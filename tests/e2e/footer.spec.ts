/**
 * Pie (spec 010, US1): SC-009. Ningún destino se pierde al quitarlo del encabezado (FR-002, FR-007).
 */
import { expect, test } from "@playwright/test";
import { URLS } from "@/content/site";
import { isPublished, pageHref } from "@/lib/i18n";
import { VIEWPORTS, gotoReady, publishedRoutes, setTheme } from "./fixtures";

const routes = publishedRoutes("es");
// Privacidad: la página propia si tiene texto; si no, la política externa (research R11)
const privacyHref = isPublished("privacy", "es") ? pageHref("privacy", "es") : URLS.privacyPolicy;
const expected = [...routes, URLS.webAppLogin, privacyHref];

for (const route of routes) {
  test(`SC-009 ${route}: el pie enlaza todos los destinos publicados`, async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.w1440);
    await setTheme(page, "light");
    await gotoReady(page, route);

    const footer = page.getByRole("contentinfo");
    const missing: string[] = [];
    for (const href of new Set(expected)) {
      if ((await footer.locator(`a[href="${href}"]`).count()) === 0) missing.push(href);
    }
    expect(missing, `faltan en el pie de ${route}`).toEqual([]);
  });
}
