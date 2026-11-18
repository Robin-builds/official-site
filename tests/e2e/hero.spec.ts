/**
 * Hero de Inicio (spec 010, US4): SC-007, SC-010 y SC-011 (FR-010, FR-011, FR-014).
 */
import { expect, test, type Locator } from "@playwright/test";
import { inicio } from "@/content/inicio";
import { fillTemplate } from "@/lib/text";
import { CTA_LABEL, VIEWPORTS, gotoReady, setTheme } from "./fixtures";

const hero = inicio.es.hero;
const HERO = 'section[aria-labelledby="hero-title"]';

/** Caja del elemento en la pantalla, sin desplazar; falla si no tiene caja. */
async function box(locator: Locator) {
  const b = await locator.boundingBox();
  expect(b, "el elemento no tiene caja").not.toBeNull();
  return b!;
}

for (const vp of ["w1440", "w390"] as const) {
  test(`SC-007 / @${VIEWPORTS[vp].width}x${VIEWPORTS[vp].height}: título, bajada y CTA en la primera pantalla`, async ({ page }) => {
    const viewport = VIEWPORTS[vp];
    await page.setViewportSize(viewport);
    await setTheme(page, "light");
    await gotoReady(page, "/");

    const section = page.locator(HERO);
    const parts = {
      título: page.locator("#hero-title"),
      // La bajada es el primer párrafo después del título
      bajada: section.locator("#hero-title + p"),
      cta: section.getByRole("link", { name: CTA_LABEL, exact: false }),
    };
    for (const [name, locator] of Object.entries(parts)) {
      const b = await box(locator);
      expect(b.y, `${name}: borde superior`).toBeGreaterThanOrEqual(0);
      expect(b.y + b.height, `${name}: borde inferior (alto ${viewport.height})`).toBeLessThanOrEqual(viewport.height);
    }
  });

  test(`SC-011 / @${VIEWPORTS[vp].width}: hueco bajo el encabezado ≤ --spacing-section`, async ({ page }) => {
    await page.setViewportSize(VIEWPORTS[vp]);
    await setTheme(page, "light");
    await gotoReady(page, "/");

    const { gap, section } = await page.evaluate(() => {
      // El token se resuelve midiendo un elemento temporal: clamp() no se puede leer como número
      const probe = document.createElement("div");
      probe.style.height = "var(--spacing-section)";
      document.body.appendChild(probe);
      const section = probe.getBoundingClientRect().height;
      probe.remove();

      const header = document.querySelector("header")!.getBoundingClientRect();
      // Primer elemento de la columna de texto (la etiqueta sobre el título)
      const first = document.getElementById("hero-title")!.parentElement!.firstElementChild!.getBoundingClientRect();
      return { gap: first.top - header.bottom, section };
    });
    expect(gap, `hueco ${gap}px, separación estándar ${section}px`).toBeLessThanOrEqual(section);
  });
}

test.describe("carrusel con movimiento", () => {
  // El carrusel es lo único que se prueba con animación: así corre como lo ve el visitante
  test.use({ reducedMotion: "no-preference" });

  test("SC-010 / @1440: sin texto visible bajo el teléfono; el anuncio conserva la descripción", async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.w1440);
    await setTheme(page, "light");
    await gotoReady(page, "/");

    const carousel = page.locator("section[data-carousel]");
    const live = carousel.locator('[aria-live="polite"]');
    const captions = hero.screens.map((s) => s.caption);
    const total = captions.length;

    for (const [i, caption] of captions.entries()) {
      const dot = carousel.getByRole("button", {
        name: fillTemplate(hero.carousel.goTo, { n: i + 1, total, caption }),
        exact: true,
      });
      // El clic necesita React hidratado: se reintenta hasta que el anuncio aparece
      await expect(async () => {
        await dot.click();
        await expect(live).toContainText(caption, { timeout: 500 });
      }).toPass();

      // Texto visible del carrusel fuera de botones y de .sr-only
      const visibleText = await carousel.evaluate((root) => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        const out: string[] = [];
        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
          const el = node.parentElement;
          if (!el || !node.textContent?.trim()) continue;
          if (el.closest("button, .sr-only")) continue;
          if (!el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue;
          out.push(node.textContent.trim());
        }
        return out.join(" ");
      });
      expect(visibleText, `pantalla ${i + 1}`).toBe("");
    }
  });
});
