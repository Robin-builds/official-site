/**
 * Ritmo vertical de Inicio (spec 010, US5): SC-008 (FR-012), con la definición de research R7.
 * Separación de un par contiguo (A, B) = borde superior del contenido de B − borde inferior del
 * contenido de A. "Contenido" = primer o último hijo del Container (div) de cada sección; en el
 * cierre, el único hijo es el bloque oscuro.
 */
import { expect, test } from "@playwright/test";
import { VIEWPORTS, gotoReady, setTheme } from "./fixtures";

for (const vp of ["w360", "w1440"] as const) {
  test(`SC-008 / @${VIEWPORTS[vp].width}: la misma separación entre secciones contiguas`, async ({ page }) => {
    await page.setViewportSize(VIEWPORTS[vp]);
    await setTheme(page, "light");
    await gotoReady(page, "/");

    const pairs = await page.evaluate(() => {
      const sections = [...document.querySelectorAll<HTMLElement>("main > section")];
      const start = sections.findIndex((s) => s.matches('[aria-labelledby="credibilidad-title"]'));
      // Solo secciones con contenido visible (Testimonios no se renderiza sin testimonios)
      const measured = sections.slice(start + 1).filter((s) => s.offsetHeight > 0);
      const name = (s: HTMLElement) => s.getAttribute("aria-labelledby") ?? s.id ?? "?";
      const content = (s: HTMLElement) => s.firstElementChild!;

      return measured.slice(1).map((b, i) => {
        const a = measured[i];
        const aBottom = content(a).lastElementChild!.getBoundingClientRect().bottom;
        const bTop = content(b).firstElementChild!.getBoundingClientRect().top;
        return { pair: `${name(a)} → ${name(b)}`, gap: Math.round((bTop - aBottom) * 100) / 100 };
      });
    });

    expect(pairs.length, "no se encontraron pares de secciones").toBeGreaterThan(0);
    const gaps = pairs.map((p) => p.gap);
    const detail = pairs.map((p) => `${p.pair}: ${p.gap}px`).join("\n");
    expect(Math.max(...gaps) - Math.min(...gaps), detail).toBeLessThanOrEqual(1);
  });
}
