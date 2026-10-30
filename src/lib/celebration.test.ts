import { describe, expect, it } from "vitest";
import { MUSE_DELAY_MS, SWEETIE_DELAY_MS, THANK_YOU_DELAY_MS } from "./celebration";

describe("celebration message timing", () => {
  it("shows thank you after 2.5 seconds", () => {
    expect(THANK_YOU_DELAY_MS).toBe(2500);
  });
  it("shows the sweetie message after 3 seconds", () => {
    expect(SWEETIE_DELAY_MS).toBe(3000);
  });
  it("shows the muse message after 4.5 seconds", () => {
    expect(MUSE_DELAY_MS).toBe(4500);
  });
});
