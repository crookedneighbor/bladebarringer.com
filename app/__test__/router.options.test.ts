import { describe, test, expect } from "vitest";

import routerOptions from "../router.options";

describe("router options", () => {
  describe("scrollBehavior", () => {
    test("returns a default page position object when no saved position is present", () => {
      expect(routerOptions.scrollBehavior({}, {}, null)).toEqual({
        left: 0,
        top: 0,
      });
    });

    test("uses saved position values when present", () => {
      expect(
        routerOptions.scrollBehavior(
          {},
          {},
          {
            left: 5,
            top: 7,
          }
        )
      ).toEqual({
        left: 5,
        top: 7,
      });
    });
  });
});
