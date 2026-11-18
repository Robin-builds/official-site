/**
 * Contraste AA del encabezado y del bloque de cierre en ambos temas (spec 010, US3): SC-006
 * (FR-005, FR-009). Cubre "Pruébala gratis", Ingresar y los enlaces del encabezado.
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { ui } from "@/content/site";
import { VIEWPORTS, gotoReady, setTheme } from "./fixtures";

for (const theme of ["light", "dark"] as const) {
  for (const vp of ["w1440", "w390"] as const) {
    test(`SC-006 / ${theme} @${VIEWPORTS[vp].width}: 0 violaciones de contraste`, async ({ page }) => {
      await page.setViewportSize(VIEWPORTS[vp]);
      await setTheme(page, theme);
      await gotoReady(page, "/");

      // En celular se revisa con el menú abierto: así entran sus enlaces, Ingresar y el CTA
      if (vp === "w390") {
        await page.getByRole("banner").locator("summary").click();
        await expect(page.getByRole("banner").locator("details")).toHaveJSProperty("open", true);
      }

      const results = await new AxeBuilder({ page })
        .include("header")
        .include("section[aria-labelledby='cta-final-title']")
        // El logotipo queda fuera: WCAG 1.4.3 exime a los logotipos del contraste mínimo, y SC-006
        // mide los CTA, Ingresar y los enlaces de sección. El "FLOW" naranja es el color de marca.
        .exclude(`header a[aria-label="${ui.es.a11y.home}"]`)
        .withRules(["color-contrast"])
        .analyze();

      const detail = results.violations
        .flatMap((v) => v.nodes)
        .map((n) => `${n.target.join(" ")}: ${n.failureSummary}`)
        .join("\n");
      expect(results.violations, detail).toEqual([]);
    });
  }
}
