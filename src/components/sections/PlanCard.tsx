import { plans } from "@/content/planes";
import type { Period, Plan, PlansContent, PlanText } from "@/content/planes";
import { Icon } from "@/components/ui/Icon";
import { fillTemplate } from "@/lib/text";
import { formatCLP, priceFor } from "@/lib/pricing";

/*
 * Tarjeta de un plan (spec 009, FR-002). Sin estado: la periodicidad y el botón llegan de
 * PlansGrid. Todo texto sale de src/content/planes.ts.
 */
export function PlanCard({
  plan,
  text,
  content,
  period,
  cta,
}: {
  plan: Plan;
  text: PlanText;
  content: PlansContent;
  period: Period;
  cta: React.ReactNode;
}) {
  const paid = plan.monthlyPrice > 0;
  const price = formatCLP(priceFor(plan.monthlyPrice, period));
  const warehouses =
    plan.warehouses === "unlimited"
      ? content.warehouses.unlimited
      : fillTemplate(plan.warehouses === 1 ? content.warehouses.one : content.warehouses.upTo, {
          n: plan.warehouses,
        });
  const baseName = plans.find((p) => p.id === plan.includesFrom)?.name;
  const titleId = `plan-${plan.id}-title`;

  return (
    <article
      aria-labelledby={titleId}
      // El recomendado lleva borde de acento y se separa del fondo (FR-003); el resto, borde normal
      className={`relative flex min-w-0 flex-col rounded-card border bg-surface-2 p-6 sm:p-8 ${
        plan.recommended ? "border-2 border-primary shadow-lg" : "border-card-line"
      }`}
    >
      {plan.recommended && (
        <p className="absolute -top-3.5 left-6 rounded-full bg-primary px-3 py-1 text-sm font-semibold text-on-primary">
          {content.recommended}
        </p>
      )}

      <h3 id={titleId} className="text-2xl font-bold tracking-tight text-fg">
        {plan.name}
      </h3>
      <p className="mt-2 text-fg-2">{text.tagline}</p>

      {/* Precio: los pagos con unidad e impuesto ("+ IVA"); Free con "Gratis para siempre" (R4) */}
      <div className="mt-6">
        <p className="flex flex-wrap items-baseline gap-x-1.5">
          <span className="text-4xl font-extrabold tracking-tight whitespace-nowrap text-fg">{price}</span>
          {paid && (
            <span className="font-medium whitespace-nowrap text-fg-2">
              {period === "annual" ? content.price.perYear : content.price.perMonth} {content.price.tax}
            </span>
          )}
        </p>
        {!paid && <p className="mt-1 font-semibold text-fg">{content.price.freeForever}</p>}
      </div>

      {/* Límite principal, en bodegas (FR-004) */}
      <p className="mt-5 flex items-center gap-2 font-semibold text-fg">
        <Icon name="warehouse" className="size-5 shrink-0 text-primary" />
        <span>{warehouses}</span>
      </p>

      <ul className="mt-5 flex-1 space-y-3 border-t border-line pt-5">
        {baseName && (
          <li className="font-semibold text-fg">{fillTemplate(content.includesFrom, { plan: baseName })}</li>
        )}
        {text.items.map((item) => (
          <li key={item.text} className="flex gap-2.5 text-fg-2">
            <Icon name="check" className="mt-0.5 size-5 shrink-0 text-primary" />
            <span>
              {item.text}
              {/* "Próximamente" en texto, no solo con color (Principio I, FR-010) */}
              {item.soon && (
                <span className="ml-2 inline-block rounded-full border border-line px-2 py-0.5 text-xs font-semibold text-fg">
                  {content.soon}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-8">{cta}</div>
    </article>
  );
}
