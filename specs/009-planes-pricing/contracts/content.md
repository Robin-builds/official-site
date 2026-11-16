# Contrato: contenido de Planes (`src/content/planes.ts`)

Única fuente de precios, límites, listas y textos (FR-005, Principio III). Solo usa `import type`
para que `planes-check.mjs` pueda importarlo con Node sin compilar (research R9).

```ts
export type PlanId = "free" | "standard" | "premium";
export type Period = "monthly" | "annual";

export type PlanItem = { text: string; soon?: true }; // soon → "Próximamente"

export type Plan = {
  id: PlanId;
  name: string;                       // igual en ambos idiomas
  monthlyPrice: number;               // CLP sin IVA; free = 0
  warehouses: number | "unlimited";
  recommended: boolean;               // exactamente uno: standard
  includesFrom: PlanId | null;        // "Todo lo de Free/Standard"
};

export type PlanText = { tagline: string; items: PlanItem[] };

export type PlansContent = {
  header: { title: string; subtitle: string };
  periods: { legend: string; monthly: string; annual: string; annualSaving: string }; // "2 meses gratis"
  price: { perMonth: string; perYear: string; tax: string; freeForever: string };      // "+ IVA", "Gratis para siempre"
  warehouses: { one: string; upTo: string; unlimited: string };                         // "{n}" se reemplaza
  includesFrom: string;            // "Todo lo de {plan}"
  recommended: string;             // "Recomendado"
  soon: string;                    // "Próximamente"
  referenceNote: string;           // "Precios referenciales, pueden cambiar"
  cta: { free: string; paid: string };   // "Empezar gratis", "Quiero el plan {plan}"
  trial: { title: string; body: string }; // 14 días, sin tarjeta, luego Free sin perder datos; se muestra con `soon`
  plans: Record<PlanId, PlanText>;
  dialog: {
    title: string;                 // "Quiero el plan {plan}"
    summary: string;               // "{plan} · {period} · {price}"
    fields: { email: { label: string }; whatsapp: { label: string; hint: string } };
    errors: { email: { required: string; email: string }; whatsapp: { whatsapp: string } };
    submit: string; sending: string; close: string;
    sent: { title: string; body: string };          // "Te contactamos", sin prometer cobro (FR-016)
    failed: { text: string; link: string };         // salida a Contacto
    privacyNote: { text: string; link: string };    // FR-017
  };
  noScriptWhatsapp: string;        // "Hola, quiero el plan {plan} ({period})" (research R5)
  // Correo al owner: la ruta usa siempre "es"; "en" existe por el Principio III
  email: { subjectPrefix: string; labels: Record<"plan" | "period" | "price" | "email" | "whatsapp" | "date" | "locale" | "origin", string> };
};

export const plans: Plan[];                       // orden = orden en pantalla
export const planes: Localized<PlansContent>;
```

**Invariantes** (verificadas por `planes-check.mjs`):
1. `plans.length === 3` y orden `free, standard, premium`.
2. Exactamente un `recommended`, y es `standard`.
3. Cada plan: `name`, `tagline`, `items.length ≥ 1` y texto de botón no vacíos, en ambos idiomas.
4. `monthlyPrice` entero; `free` = 0, pagos > 0.
5. `warehouses` presente en los 3 (límite en bodegas).
6. `planes[l].plans.free` no contiene "prueba" ni "trial" en ningún campo (ni en `price.freeForever`), y
   `price.freeForever` contiene "gratis para siempre" / "free forever".
7. `trial.body` contiene "14" y "sin tarjeta" / "no card"; la página lo muestra con `soon`.
8. `price.tax` es la misma cadena para todos los precios pagos (una sola convención).
9. Mismo número de ítems y mismas marcas `soon` en `es` y `en` (el inglés no dice más).
