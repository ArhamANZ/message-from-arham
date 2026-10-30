import { useEffect, useRef, useState } from "react";
import { FlowerCelebration } from "@/components/FlowerCelebration";
import { Button } from "@/components/ui/button";
import { RotateCcw, Volume2, VolumeX } from "lucide-react";
import { MUSE_DELAY_MS, SWEETIE_DELAY_MS, THANK_YOU_DELAY_MS } from "@/lib/celebration";
import musicAsset from "@/assets/musik.mp3.asset.json";

type Stage = "tulips" | "thanks" | "final" | "muse";


export function LoveQuestion() {
  const [dodges, setDodges] = useState(0);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [replay, setReplay] = useState(0);
  const [stage, setStage] = useState<Stage>("tulips");
  const [muted, setMuted] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!accepted) return;
    // The audio element only exists in the accepted view, so playback starts
    // here — still within the user-activation window opened by the YES click.
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      void audio.play().catch(() => {
        /* autoplay blocked until the next tap */
      });
    }
    const t1 = setTimeout(() => setStage("thanks"), THANK_YOU_DELAY_MS);
    const t2 = setTimeout(() => setStage("final"), SWEETIE_DELAY_MS);
    const t3 = setTimeout(() => setStage("muse"), MUSE_DELAY_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };

  }, [accepted, replay]);

  const flee = () => {
    const box = boxRef.current;
    if (!box) return;
    const w = box.clientWidth - 90;
    const h = box.clientHeight - 50;
    setPos({ x: Math.random() * Math.max(w, 0), y: Math.random() * Math.max(h, 0) });
    setDodges((d) => d + 1);
  };

  const yes = () => {
    setAccepted(true);
  };

  const replayCelebration = () => {
    setStage("tulips");
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      void audio.play().catch(() => {
        /* autoplay blocked until the next tap */
      });
    }
    setReplay((value) => value + 1);
  };

  const toggleMute = () => {
    setMuted((value) => {
      if (audioRef.current) audioRef.current.muted = !value;
      return !value;
    });
  };

  if (accepted) {
    return (
      <div className="bouquet-night fixed inset-0 z-50 overflow-hidden">
        <FlowerCelebration key={replay} />
        <div className="celebration-message pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center" aria-live="polite">
          {stage !== "tulips" && (
            <p className="pop-in font-display text-3xl text-good-foreground sm:text-4xl">
              Thank you 🌷
            </p>
          )}
          {stage !== "tulips" && stage !== "thanks" && (
            <div className="pop-in max-w-xs font-display text-2xl text-good-foreground sm:max-w-md sm:text-3xl">
              🥰 I knew it sweetie
            </div>
          )}
          {stage === "muse" && (
            <p className="pop-in max-w-sm font-display text-xl leading-relaxed text-good-foreground sm:max-w-lg sm:text-2xl">
              My muse, my cutie patotie janu ka tukra. Life's been immeasurably better with you in it.
            </p>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-6 flex justify-center gap-3 pb-[env(safe-area-inset-bottom)]">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="font-display"
            onClick={replayCelebration}
          >
            <RotateCcw aria-hidden="true" />
            Replay
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            aria-label={muted ? "Unmute music" : "Mute music"}
            onClick={toggleMute}
          >
            {muted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
            {muted ? "Muted" : "Music"}
          </Button>
        </div>
        <audio ref={audioRef} src={musicAsset.url} loop preload="auto" />
      </div>
    );
  }

  const scale = 1 + dodges * 0.25;

  return (
    <div className="pop-in mt-6">
      <p className="font-display text-2xl text-foreground">Do you love me tooo? 🥺</p>
      <div ref={boxRef} className="relative mt-4 h-56 w-full">
        <div className="absolute inset-0 flex items-center justify-center gap-6">
          <button
            onClick={yes}
            style={{ transform: `scale(${scale})`, transition: "transform .2s" }}
            className="btn-pop z-10 rounded-2xl px-6 py-2 font-display text-xl"
          >
            YES
          </button>
          {!pos && (
            <button
              onMouseEnter={flee}
              onTouchStart={(e) => { e.preventDefault(); flee(); }}
              onFocus={flee}
              className="rounded-2xl border-4 border-foreground bg-bad px-6 py-2 font-display text-xl text-bad-foreground"
            >
              NO
            </button>
          )}
        </div>
        {pos && (
          <button
            onMouseEnter={flee}
            onTouchStart={(e) => { e.preventDefault(); flee(); }}
            onClick={flee}
            style={{ left: pos.x, top: pos.y, transition: "left .15s, top .15s" }}
            className="absolute z-20 rounded-2xl border-4 border-foreground bg-bad px-6 py-2 font-display text-xl text-bad-foreground"
          >
            NO
          </button>
        )}
      </div>
    </div>
  );
}
