import { defineConfig, devices } from "@playwright/test";

/**
 * Suite e2e de la spec 010 (research R8, contracts/verification.md).
 * Mide el build de producción (`next build && next start`) en un puerto propio (3100), para no
 * chocar con `next dev` en el 3000 ni medir el sitio de desarrollo, que difiere en estilos y JS.
 * Solo Chromium: los criterios son geométricos y de estilos computados, no de compatibilidad.
 */
export default defineConfig({
  testDir: "tests/e2e",
  // Los tests miden layout; en paralelo comparten la misma instancia de `next start`, que aguanta bien
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3100",
    // Sin animaciones al medir (contrato "Reglas"); el test del carrusel lo reactiva con test.use
    reducedMotion: "reduce",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run build && npm run start -- -p 3100",
    url: "http://localhost:3100",
    // En local reutiliza un servidor ya levantado en :3100; en CI siempre uno nuevo
    reuseExistingServer: !process.env.CI,
    // El build de Next tarda; 3 minutos de margen
    timeout: 180_000,
  },
});
