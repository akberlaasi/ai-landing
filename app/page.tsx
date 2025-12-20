import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ChatBox from "@/components/ChatBox";



export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <Header />
        <div className="mx-auto max-w-2xl px-6 py-16">
        <Hero />
        <div className="mt-10">
          <ChatBox />
        </div>
      </div>
    </main>
  );
}
