export const SPECIAL_NAMES = ["adiba ahin chowdhury", "ahin", "chowdhury", "adiba"];

export function isSpecial(name: string): boolean {
  const n = name.trim().replace(/\s+/g, " ").toLowerCase();
  return SPECIAL_NAMES.includes(n);
}

export function messageFor(name: string): { type: "A" | "B"; text: string } {
  return isSpecial(name) ? { type: "A", text: "i love you" } : { type: "B", text: "fuck off" };
}
