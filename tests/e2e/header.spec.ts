/**
 * Encabezado (spec 010, US1 y US2): SC-001, SC-002 y SC-004 (contracts/verification.md).
 */
import { expect, test, type Page } from "@playwright/test";
import { ui } from "@/content/site";
import { getPage, pageHref } from "@/lib/i18n";
import { CTA_LABEL, VIEWPORTS, gotoReady, publishedRoutes, setTheme } from "./fixtures";

const t = ui.es;
const routes = publishedRoutes("es");
// Los 3 enlaces de sección esperados (FR-001), en orden, con el texto del registro
const EXPECTED_NAV = (["features", "business", "plans"] as const).map((k) => getPage(k).locales.es.navLabel);
// Destinos que ya no van en el encabezado (FR-002)
const FOOTER_ONLY = (["faq", "help", "contact"] as const).map((k) => pageHref(k, "es"));

/** El <details> del menú desplegable dentro del encabezado. */
const menu = (page: Page) => page.getByRole("banner").locator("details");

for (const route of routes) {
  for (const vp of ["w1024", "w1440"] as const) {
    test(`SC-001 ${route} @${VIEWPORTS[vp].width}: 3 enlaces de sección en el encabezado`, async ({ page }) => {
      await page.setViewportSize(VIEWPORTS[vp]);
      await setTheme(page, "light");
      await gotoReady(page, route);

      // getByRole ignora lo oculto: solo cuenta la navegación que el visitante ve a este ancho
      const links = page
        .getByRole("banner")
        .getByRole("navigation", { name: t.a11y.mainNav })
        .getByRole("link");
      await expect(links).toHaveText(EXPECTED_NAV);
    });
  }

  for (const vp of ["w1024", "w1440", "w390"] as const) {
    test(`SC-002 ${route} @${VIEWPORTS[vp].width}: sin selector de tema ni FAQ/Ayuda/Contacto en el encabezado`, async ({ page }) => {
      await page.setViewportSize(VIEWPORTS[vp]);
      await setTheme(page, "light");
      await gotoReady(page, route);

      const banner = page.getByRole("banner");
      // En celular se mide con el menú abierto: su panel también es parte del encabezado
      if (vp === "w390") {
        await banner.locator("summary").click();
        await expect(menu(page)).toHaveJSProperty("open", true);
      }

      // Se cuenta en el DOM, visible u oculto: ningún ancho debe poder mostrarlos
      await expect(banner.getByRole("button", { name: t.a11y.themeToggle, includeHidden: true })).toHaveCount(0);
      for (const href of FOOTER_ONLY) {
        await expect(banner.locator(`a[href="${href}"]`), `enlace a ${href} en el encabezado`).toHaveCount(0);
      }
    });
  }
}

for (const vp of ["w390", "w1023"] as const) {
  test(`SC-004 / @${VIEWPORTS[vp].width}: el menú abre y cierra, y el CTA queda a la vista`, async ({ page }) => {
    const viewport = VIEWPORTS[vp];
    await page.setViewportSize(viewport);
    await setTheme(page, "light");
    await gotoReady(page, "/");

    const summary = page.getByRole("banner").locator("summary");
    const details = menu(page);

    // Clic abre y clic de nuevo cierra (<details> nativo)
    await summary.click();
    await expect(details).toHaveJSProperty("open", true);
    await summary.click();
    await expect(details).toHaveJSProperty("open", false);

    // Escape cierra: lo maneja MobileMenu al hidratar, por eso se reintenta hasta que React esté listo
    await summary.click();
    await expect(details).toHaveJSProperty("open", true);
    await expect(async () => {
      await page.keyboard.press("Escape");
      await expect(details).toHaveJSProperty("open", false, { timeout: 500 });
    }).toPass();

    // Teclado: Enter sobre el botón con foco abre
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(details).toHaveJSProperty("open", true);
    await page.keyboard.press("Escape");
    await expect(details).toHaveJSProperty("open", false);

    // Con el menú cerrado, "Pruébala gratis" del encabezado está completo dentro de la pantalla
    const cta = page.getByRole("banner").getByRole("link", { name: CTA_LABEL });
    await expect(cta).toBeVisible();
    const box = await cta.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
  });
}
