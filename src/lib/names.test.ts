import { describe, it, expect } from "vitest";
import { messageFor } from "./names";

describe("messageFor", () => {
  it("special names get good message, any case", () => {
    for (const n of ["Ahin", "ahin", "ADIBA", "Chowdhury", "adiba ahin chowdhury"])
      expect(messageFor(n).text).toBe("i love you");
  });
  it("other names get bad message", () => {
    expect(messageFor("John").text).toBe("fuck off");
  });
});
