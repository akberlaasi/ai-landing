import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Basic validation (keep it)
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { reply: "Please send a valid message." },
        { status: 400 }
      );
    }

    if (message.length > 300) {
      return NextResponse.json(
        { reply: "Message too long. Please keep it under 300 characters." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { reply: "Server missing GEMINI_API_KEY." },
        { status: 500 }
      );
    }

    // Gemini REST call
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
            parts: [{ text: message }],
          },
        ],
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return NextResponse.json(
        { reply: `Gemini error (${geminiRes.status}): ${errText}` },
        { status: 500 }
      );
    }

    const data = await geminiRes.json();

    // Extract text safely
    const reply =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: any) => p?.text)
        ?.filter(Boolean)
        ?.join("") || "No response from Gemini.";

const encoder = new TextEncoder();

const stream = new ReadableStream({
  async start(controller) {
    const words = reply.split(" ");

    for (let i = 0; i < words.length; i++) {
      const chunk = (i === 0 ? "" : " ") + words[i];
      controller.enqueue(encoder.encode(chunk));
      await new Promise((r) => setTimeout(r, 25)); // typing speed
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
    return NextResponse.json(
      { reply: "Server error while generating response." },
      { status: 500 }
    );
  }
}
