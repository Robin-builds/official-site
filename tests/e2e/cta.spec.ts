/**
 * Consistencia del CTA (spec 010, US3): SC-005 (FR-008, FR-009).
 * Todos los "Pruébala gratis" de Inicio comparten 1 color de fondo por tema: el primario del
 * tema de la página, también el del bloque de cierre, que fuerza data-theme="dark".
 */
import { expect, test } from "@playwright/test";
import { CTA_LABEL, VIEWPORTS, gotoReady, setTheme } from "./fixtures";

// Valores de --primary en globals.css: teal #155e75 en claro, cian #2ec6da en oscuro
const EXPECTED = { light: "rgb(21, 94, 117)", dark: "rgb(46, 198, 218)" } as const;

for (const theme of ["light", "dark"] as const) {
  test(`SC-005 / ${theme}: un solo color de fondo en los "Pruébala gratis"`, async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.w1440);
    await setTheme(page, theme);
    await gotoReady(page, "/");

    // exact: false porque el CTA del hero lleva un ícono y los externos el aviso de pestaña nueva
    const links = page.getByRole("link", { name: CTA_LABEL, exact: false });
    const colors: string[] = [];
    for (const link of await links.all()) {
      await link.scrollIntoViewIfNeeded();
      if (!(await link.isVisible())) continue;
      colors.push(await link.evaluate((el) => getComputedStyle(el).backgroundColor));
    }

    // Encabezado, hero y cierre como mínimo
    expect(colors.length).toBeGreaterThanOrEqual(3);
    expect([...new Set(colors)], `colores encontrados: ${colors.join(" | ")}`).toEqual([EXPECTED[theme]]);
  });
}
