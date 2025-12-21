import { NextResponse } from "next/server";

export const runtime = "edge";

function normalizeLists(text: string) {
  let t = (text || "").trim();

  // Ensure numbered items start on a new line:
  // Turns: "1) a 2) b 3) c" or "1. a 2. b" into lines
  t = t.replace(/(\s*)(\d+[\.\)])\s+/g, "\n$2 ");

  // Ensure bullets start on a new line:
  // Turns: "- a - b" or "• a • b" into lines
  t = t.replace(/(\s*)([-•])\s+/g, "\n$2 ");

  // Clean up excessive blank lines
  t = t.replace(/\n{3,}/g, "\n\n");

  return t.trim();
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Basic validation
    if (!message || typeof message !== "string") {
      return new Response("Please send a valid message.", {
        status: 400,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    if (message.length > 300) {
      return new Response("Message too long. Please keep it under 300 characters.", {
        status: 400,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response("Server missing GEMINI_API_KEY.", {
        status: 500,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
      encodeURIComponent(apiKey);

    const geminiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `
You are a helpful AI assistant.
Always format responses clearly.

Rules:
- If listing ideas, use numbered lists.
- Put each idea on a new line.
- Prefer bullet points when helpful.
- Keep answers concise and readable.

User request:
${message}
                `.trim(),
              },
            ],
          },
        ],
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return new Response(`Gemini error (${geminiRes.status}): ${errText}`, {
        status: 500,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    const data = await geminiRes.json();

    // Extract text safely
    const reply: string =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: any) => p?.text)
        ?.filter(Boolean)
        ?.join("") || "No response from Gemini.";

    // Force clean list formatting
    const formattedReply = normalizeLists(reply);

    // Stream it word-by-word (typing effect)
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const words = formattedReply.split(" ");

        for (let i = 0; i < words.length; i++) {
          const chunk = (i === 0 ? "" : " ") + words[i];
          controller.enqueue(encoder.encode(chunk));
          await new Promise((r) => setTimeout(r, 25));
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (e: any) {
    // Keep JSON here is okay, but since UI expects streaming text, return text:
    return new Response("Server error while generating response.", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
