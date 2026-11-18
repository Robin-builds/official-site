/**
 * Sin desplazamiento horizontal entre 360 y 1023px (spec 010, US2): SC-003 (FR-013).
 */
import { expect, test } from "@playwright/test";
import { VIEWPORTS, gotoReady, publishedRoutes, setTheme } from "./fixtures";

for (const route of publishedRoutes("es")) {
  for (const vp of ["w360", "w390", "w1023"] as const) {
    test(`SC-003 ${route} @${VIEWPORTS[vp].width}: sin desplazamiento horizontal`, async ({ page }) => {
      await page.setViewportSize(VIEWPORTS[vp]);
      await setTheme(page, "light");
      await gotoReady(page, route);

      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth, `${route} desborda a ${VIEWPORTS[vp].width}px`).toBeLessThanOrEqual(clientWidth);
    });
  }
}
