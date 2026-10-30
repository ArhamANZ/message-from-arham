import { useEffect, useRef } from "react";

type FlowerKind = "lily" | "daisy" | "rose" | "tulip";

// Render the flowers as tiny luminous characters, like the reference bouquet.
function flowerSprite(kind: FlowerKind, color: string, stem: string, light: string, luminous = false, openness = 1) {
  const source = document.createElement("canvas");
  source.width = 240;
  source.height = 320;
  const ctx = source.getContext("2d", { willReadFrequently: true });
  if (!ctx) return source;

  ctx.strokeStyle = stem;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(120, 305);
  ctx.bezierCurveTo(105, 230, 138, 190, 120, 100);
  ctx.stroke();
  for (let i = 0; i < 3; i++) {
    const y = 180 + i * 35;
    const side = i % 2 ? 1 : -1;
    ctx.fillStyle = stem;
    ctx.beginPath();
    ctx.moveTo(120, y + 30);
    ctx.bezierCurveTo(120 + side * 20, y - 25, 120 + side * 70, y - 5, 120 + side * 88, y - 30);
    ctx.bezierCurveTo(120 + side * 75, y + 30, 120 + side * 24, y + 35, 120, y + 30);
    ctx.fill();
  }

  ctx.save();
  ctx.translate(120, 100);
  const gradient = ctx.createRadialGradient(0, 10, 4, 0, -10, 108);
  gradient.addColorStop(0, light);
  gradient.addColorStop(0.25, color);
  gradient.addColorStop(0.8, color);
  gradient.addColorStop(1, light);
  ctx.fillStyle = gradient;

  if (kind === "tulip") {
    for (const offset of [-1, 1, 0]) {
      ctx.save();
      ctx.translate(offset * (7 + openness * 18), 0);
      ctx.rotate(offset * (0.03 + openness * 0.24));
      ctx.scale(0.42 + openness * 0.58, 1);
      ctx.beginPath();
      ctx.moveTo(0, 72);
      ctx.bezierCurveTo(-62, 65, -61, -37, -38, -79);
      ctx.bezierCurveTo(-24, -48, -6, -37, 0, -23);
      ctx.bezierCurveTo(9, -45, 25, -53, 35, -85);
      ctx.bezierCurveTo(54, -22, 52, 63, 0, 72);
      ctx.fill();
      ctx.strokeStyle = light;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }
  } else if (kind === "rose") {
    for (let ring = 4; ring > 0; ring--) {
      for (let petal = 0; petal < 7; petal++) {
        ctx.save();
        ctx.rotate(petal * Math.PI * 2 / 7 + ring * 0.6);
        ctx.beginPath();
        ctx.ellipse(0, -ring * 13, ring * 15, ring * 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = light;
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.restore();
      }
    }
  } else {
    const count = kind === "lily" ? 6 : 13;
    for (let i = 0; i < count; i++) {
      ctx.save();
      ctx.rotate(i * Math.PI * 2 / count);
      ctx.beginPath();
      if (kind === "lily") {
        ctx.moveTo(0, 12);
        ctx.bezierCurveTo(-48, -14, -22, -56, -9, -102);
        ctx.bezierCurveTo(11, -73, 39, -35, 0, 12);
      } else {
        ctx.ellipse(0, -45, 15, 49, 0, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.strokeStyle = light;
      ctx.lineWidth = 0.9;
      ctx.stroke();
      ctx.restore();
    }
    ctx.fillStyle = light;
    ctx.beginPath();
    ctx.arc(0, 0, kind === "lily" ? 9 : 19, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  const pixels = ctx.getImageData(0, 0, 240, 320).data;
  const sprite = document.createElement("canvas");
  sprite.width = 240;
  sprite.height = 320;
  const ink = sprite.getContext("2d");
  if (!ink) return source;
  if (luminous) {
    ink.globalAlpha = 0.6;
    ink.drawImage(source, 0, 0);
    ink.globalAlpha = 1;
  }
  ink.font = "5px monospace";
  const glyphs = ["·", ":", "+", "=", "*", "≡"];
  for (let y = 0; y < 320; y += 3) {
    for (let x = 0; x < 240; x += 3) {
      const p = (y * 240 + x) * 4;
      if ((pixels[p + 3] ?? 0) < 40) continue;
      const noise = ((x * 17 + y * 31) % 19) / 19;
      ink.fillStyle = `rgba(${pixels[p]},${pixels[p + 1]},${pixels[p + 2]},${0.45 + noise * 0.55})`;
      ink.fillText(glyphs[(x + y * 3) % glyphs.length] ?? "=", x, y + 3);
    }
  }
  return sprite;
}

export function FlowerCelebration() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const styles = getComputedStyle(canvas);
    const token = (name: string) => styles.getPropertyValue(name).trim();
    const kinds: FlowerKind[] = ["lily", "daisy", "rose", "tulip"];
    const palette = ["--flower-pink", "--flower-red", "--flower-yellow", "--flower-white", "--flower-violet", "--flower-peach"];
    const sprites = palette.map((color, i) => flowerSprite(kinds[i % kinds.length] ?? "lily", token(color), token("--tulip-leaf"), token("--flower-highlight")));
    // Cache each petal-opening stage once; the animation only draws sprites.
    const bloomFrames = (color: string, light: string) => Array.from({ length: 24 }, (_, i) =>
      flowerSprite("tulip", token(color), token("--tulip-leaf"), token(light), true, i / 23));
    const blueTulips = bloomFrames("--tulip-2", "--tulip-3");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let frame = 0;
    const start = performance.now();
    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    const draw = (now: number) => {
      const time = reduced ? 8 : (now - start) / 1000;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = token("--flower-white");
      for (let i = 0; i < 90; i++) {
        ctx.globalAlpha = 0.25 + Math.sin(time + i) * 0.2;
        ctx.fillRect((i * 137.7) % width, (i * 89.3) % height, 1.3, 1.3);
      }
      const cols = Math.max(4, Math.ceil(width / 155));
      const rows = Math.max(5, Math.ceil(height / 165));
      const cellW = width / cols;
      const cellH = height / rows;
      for (let row = 0; row <= rows; row++) {
        for (let col = -1; col <= cols; col++) {
          const i = row * (cols + 2) + col + 1;
          const x = (col + 0.5 + (row % 2) * 0.35) * cellW;
          const y = (row + 0.4) * cellH;
          const delay = ((i * 7) % 17) * 0.055;
          const progress = Math.min(1, Math.max(0, (time - delay) / 0.85));
          const scale = 1 - Math.pow(1 - progress, 3);
          const size = cellW * (1.15 + (i % 3) * 0.12);
          ctx.save();
          ctx.translate(x, y + size * 0.9);
          ctx.rotate(Math.sin(i * 13) * 0.2 + (reduced ? 0 : Math.sin(time * 0.6 + i) * 0.025));
          ctx.scale(scale, scale);
          ctx.globalAlpha = 1 - Math.min(1, Math.max(0, time - 1.1)) * 0.55;
          const sprite = sprites[i % sprites.length];
          if (sprite) ctx.drawImage(sprite, -size / 2, -size * 1.33, size, size * 1.33);
          ctx.restore();
        }
      }
      const size = Math.min(width * 0.95, height * 0.7, 520);
      const drawTulip = (frames: HTMLCanvasElement[], x: number, y: number, flowerSize: number, tilt: number, delay: number, prominent = false) => {
        const emerge = Math.min(1, Math.max(0, (time - delay) / 0.85));
        const opening = Math.min(1, Math.max(0, (time - delay - 0.3) / 2.2));
        const sprite = frames[Math.round(opening * (frames.length - 1))];
        if (!sprite || emerge === 0) return;
        const growth = 1 - Math.pow(1 - emerge, 3);
        ctx.save();
        ctx.translate(x, y + (1 - growth) * 110);
        ctx.rotate(tilt + (reduced ? 0 : Math.sin(time * 0.7 + x) * 0.012));
        ctx.scale(0.65 + growth * 0.35, 0.65 + growth * 0.35);
        ctx.globalAlpha = emerge;
        ctx.shadowColor = token(prominent ? "--tulip-2" : "--flower-highlight");
        ctx.shadowBlur = prominent ? 32 : 8;
        ctx.drawImage(sprite, -flowerSize / 2, -flowerSize * 1.33, flowerSize, flowerSize * 1.33);
        ctx.restore();
      };
      // One slow-opening blue blossom above the unchanged flower backdrop.
      drawTulip(blueTulips, width / 2, height / 2 + size * 0.91, size, 0, 1.1, true);
      if (!reduced) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="flower-canvas absolute inset-0 h-full w-full" role="img" aria-label="A screen full of colorful lilies, daisies, roses and tulips, with a glowing blue tulip blooming in the middle" />;
}