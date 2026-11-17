/**
 * Cálculo y formato de precios de la página Planes (spec 009, FR-006, FR-008).
 *
 * Sin importaciones en tiempo de ejecución (solo `import type`, con ruta relativa): así
 * `specs/009-planes-pricing/planes-check.mjs` lo importa con Node sin compilar (research R9).
 */
import type { Period } from "../content/planes";

/**
 * Meses que se cobran en el plan anual: 12 meses al precio de 10 ("2 meses gratis", ≈ 17 %).
 * Se usa 10 × mensual y no −17 % exacto porque da cifras redondas ($9.990 → $99.900).
 */
export const ANNUAL_MONTHS = 10;

/** Precio del plan en la periodicidad pedida, en CLP sin IVA. */
export function priceFor(monthlyPrice: number, period: Period): number {
  return period === "annual" ? monthlyPrice * ANNUAL_MONTHS : monthlyPrice;
}

// es-CL en ambos idiomas: la moneda es CLP y se escribe con punto de miles (research R4)
const CLP = new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 });

/** "$9.990": signo peso + entero con punto de miles, sin decimales. */
export function formatCLP(n: number): string {
  return `$${CLP.format(n)}`;
}
