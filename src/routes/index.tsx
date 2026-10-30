import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { messageFor } from "@/lib/names";
import { LoveQuestion } from "@/components/LoveQuestion";
import photo00 from "@/assets/collage-photo-00.jpg.asset.json";
import photo01 from "@/assets/collage-photo-01.jpg.asset.json";
import photo02 from "@/assets/collage-photo-02.jpg.asset.json";
import photo03 from "@/assets/collage-photo-03.jpg.asset.json";
import photo04 from "@/assets/collage-photo-04.jpg.asset.json";
import photo05 from "@/assets/collage-photo-05.jpg.asset.json";
import photo06 from "@/assets/collage-photo-06.jpg.asset.json";
import photo07 from "@/assets/collage-photo-07.jpg.asset.json";
import photo11 from "@/assets/collage-photo-11.jpg.asset.json";
import photo14 from "@/assets/collage-photo-14.jpg.asset.json";
import photo15 from "@/assets/collage-photo-15.jpg.asset.json";
import photo18 from "@/assets/collage-photo-18.jpg.asset.json";
import photo20 from "@/assets/collage-photo-20.jpg.asset.json";
import photo21 from "@/assets/collage-photo-21.jpg.asset.json";
import photo23 from "@/assets/collage-photo-23.jpg.asset.json";
import photo26 from "@/assets/collage-photo-26.jpg.asset.json";

const collagePhotos = [photo02, photo06, photo04, photo14, photo21, photo26, photo01, photo03, photo07, photo23, photo18, photo05, photo20, photo15, photo00, photo11];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Message from Arham :)" },
      { name: "description", content: "Type your name and find out what the oracle thinks of you." },
      { property: "og:title", content: "Message from Arham :)" },
      { property: "og:description", content: "Type your name and get your message." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  const [name, setName] = useState("");
  const [result, setResult] = useState<ReturnType<typeof messageFor> | null>(null);
  const [thinking, setThinking] = useState(false);
  const [phase, setPhase] = useState(0);
  const [key, setKey] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const suspenseLines = [
    "Apnar nam porchi... 🔮",
    "Nam er aura hisab korchi... 👁️",
    "Apnar borth checking korchi... 📜",
    "Apnake judge korchi... ⚖️",
  ];

  useEffect(() => {
    if (!thinking) return;
    const lines = setInterval(() => setPhase((p) => p + 1), 1200);
    timer.current = setTimeout(() => {
      setThinking(false);
      setKey((k) => k + 1);
    }, 5200);
    return () => {
      clearInterval(lines);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [thinking]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || thinking) return;
    setResult(messageFor(name));
    setPhase(0);
    setThinking(true);
  };

  return (
    <main className="photo-entry flex min-h-screen items-center justify-center px-4 py-8">
      <div className="photo-collage" aria-hidden="true">
        {collagePhotos.map((photo) => (
          <img key={photo.asset_id} src={photo.url} alt="" />
        ))}
      </div>
      <div className="card-pop relative z-10 w-full max-w-md rounded-3xl p-8 text-center">
        <h1 className="font-display text-5xl text-foreground">Who are you?</h1>
        <p className="mt-2 text-muted-foreground">Tell me your name 👀</p>
        <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name..."
            className="rounded-2xl border-4 border-foreground bg-background px-4 py-3 text-lg text-foreground outline-none focus:ring-4 focus:ring-ring"
          />
          <button type="submit" disabled={thinking} className="btn-pop rounded-2xl px-4 py-3 font-display text-2xl disabled:opacity-60">
            {thinking ? "Thinking..." : "Reveal!"}
          </button>
        </form>
        {thinking && (
          <div className="suspense mt-8 rounded-2xl border-4 border-foreground bg-card p-6 font-display text-xl text-foreground">
            <span className="text-4xl">🔮</span>
            <p className="mt-2">{suspenseLines[phase % suspenseLines.length]}</p>
            <p className="mt-1 text-base text-muted-foreground tracking-widest">
              <span className="dot">●</span>
              <span className="dot" style={{ animationDelay: "0.2s" }}>●</span>
              <span className="dot" style={{ animationDelay: "0.4s" }}>●</span>
            </p>
          </div>
        )}
        {result && !thinking && (
          <div
            key={key}
            className={`pop-in mt-8 rounded-2xl border-4 border-foreground p-6 font-display text-4xl ${
              result.type === "A" ? "bg-good text-good-foreground" : "bg-bad text-bad-foreground"
            }`}
          >
            {result.type === "A" ? "💖 " : "🖕 "}
            {result.text}
          </div>
        )}
        {result?.type === "A" && !thinking && <LoveQuestion key={`q${key}`} />}
      </div>
    </main>
  );
}
