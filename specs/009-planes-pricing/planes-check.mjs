/*
 * Verificador del contenido de Planes (spec 009-planes-pricing, research R9).
 *
 * Uso (desde la raíz del repo, Node ≥ 22.18):  node specs/009-planes-pricing/planes-check.mjs
 *
 * Importa directamente src/content/planes.ts y src/lib/pricing.ts: Node quita los tipos de
 * TypeScript sin compilar, por eso esos dos archivos solo tienen `import type`.
 *
 * Qué verifica (invariantes de contracts/content.md y criterios de éxito de la spec):
 *  1. Exactamente 3 planes, en orden free → standard → premium (SC-002, FR-001).
 *  2. Exactamente un plan recomendado, y es standard (SC-009).
 *  3. Cada plan tiene nombre, frase, ≥ 1 ítem y texto de botón, en ambos idiomas (SC-002).
 *  4. Precios enteros: free = 0, pagos > 0 (FR-005).
 *  5. Límite en bodegas presente en los 3 (SC-010).
 *  6. Free sin "prueba"/"trial"; "gratis para siempre"/"free forever" presente (SC-011).
 *  7. Prueba de 14 días con "14" y "sin tarjeta"/"no card" (SC-012).
 *  8. Una sola convención de impuesto: "+ IVA" / "+ VAT" (SC-014).
 *  9. Mismos ítems y mismas marcas "Próximamente" en es y en (el inglés no dice más).
 * 10. Anual = 10 × mensual en cada plan pago, y formato "$9.990" (SC-006).
 * 11. "Varias empresas" solo en Premium y marcado Próximamente, en ambos idiomas (SC-016, US-5).
 *
 * Termina con código 1 si hay algún FAIL.
 */
import { planes, plans } from "../../src/content/planes.ts";
import { formatCLP, priceFor } from "../../src/lib/pricing.ts";

let failed = 0;
function check(ok, label) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}`);
  if (!ok) failed++;
}

const LOCALES = ["es", "en"];
const ids = plans.map((p) => p.id);

// 1–2. Cantidad, orden y recomendado
check(plans.length === 3, `3 planes (hay ${plans.length})`);
check(ids.join(",") === "free,standard,premium", `orden free → standard → premium (${ids.join(" → ")})`);
const rec = plans.filter((p) => p.recommended).map((p) => p.id);
check(rec.length === 1 && rec[0] === "standard", `un solo recomendado y es standard (${rec.join(", ") || "ninguno"})`);

// 3–5. Campos obligatorios, precios y límites
for (const p of plans) {
  check(Boolean(p.name?.trim()), `${p.id}: tiene nombre`);
  check(Number.isInteger(p.monthlyPrice) && (p.id === "free" ? p.monthlyPrice === 0 : p.monthlyPrice > 0),
    `${p.id}: precio mensual válido (${p.monthlyPrice})`);
  check(p.warehouses === "unlimited" || (Number.isInteger(p.warehouses) && p.warehouses >= 1),
    `${p.id}: límite en bodegas (${p.warehouses})`);
  for (const l of LOCALES) {
    const t = planes[l].plans[p.id];
    check(Boolean(t?.tagline?.trim()), `${p.id}/${l}: tiene frase de posicionamiento`);
    check(Array.isArray(t?.items) && t.items.length >= 1 && t.items.every((i) => i.text.trim()),
      `${p.id}/${l}: lista de lo incluido no vacía`);
    const cta = p.id === "free" ? planes[l].cta.free : planes[l].cta.paid;
    check(Boolean(cta?.trim()), `${p.id}/${l}: tiene texto de botón`);
  }
}

// 6. Free: gratis para siempre, sin "prueba" ni "trial"
for (const l of LOCALES) {
  const free = JSON.stringify(planes[l].plans.free) + planes[l].price.freeForever + planes[l].cta.free;
  check(!/prueba|trial/i.test(free), `free/${l}: no dice "prueba" ni "trial"`);
}
check(/gratis para siempre/i.test(planes.es.price.freeForever), `free/es: "gratis para siempre"`);
check(/free forever/i.test(planes.en.price.freeForever), `free/en: "free forever"`);

// 7. Prueba de 14 días
check(/14/.test(planes.es.trial.body) && /sin tarjeta/i.test(planes.es.trial.body), `prueba/es: "14" y "sin tarjeta"`);
check(/14/.test(planes.en.trial.body) && /no card/i.test(planes.en.trial.body), `prueba/en: "14" y "no card"`);

// 8. Convención de impuesto única (la tarjeta usa `price.tax` en todos los precios pagos)
check(planes.es.price.tax === "+ IVA", `impuesto/es: "+ IVA" (${planes.es.price.tax})`);
check(planes.en.price.tax === "+ VAT", `impuesto/en: "+ VAT" (${planes.en.price.tax})`);

// 9. Paridad es/en
for (const p of plans) {
  const es = planes.es.plans[p.id].items;
  const en = planes.en.plans[p.id].items;
  check(es.length === en.length, `${p.id}: mismo número de ítems en es y en (${es.length}/${en.length})`);
  check(es.every((it, i) => Boolean(it.soon) === Boolean(en[i]?.soon)), `${p.id}: mismas marcas Próximamente en es y en`);
}

// 10. Regla anual y formato
for (const p of plans.filter((x) => x.monthlyPrice > 0)) {
  check(priceFor(p.monthlyPrice, "annual") === p.monthlyPrice * 10,
    `${p.id}: anual = 10 × mensual (${formatCLP(priceFor(p.monthlyPrice, "annual"))})`);
}
check(formatCLP(9990) === "$9.990", `formato CLP: 9990 → "${formatCLP(9990)}"`);

// 11. Varias empresas: solo en Premium y Próximamente
for (const [l, re] of [["es", /empresas/i], ["en", /compan/i]]) {
  const hits = plans.flatMap((p) => planes[l].plans[p.id].items.filter((i) => re.test(i.text)).map((i) => ({ id: p.id, soon: i.soon })));
  check(hits.length === 1 && hits[0].id === "premium" && hits[0].soon === true,
    `varias empresas/${l}: solo en premium y Próximamente`);
}

console.log(failed ? `\n${failed} FAIL` : "\nTodo PASS");
process.exit(failed ? 1 : 0);
