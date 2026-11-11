/**
 * Índice de anclas al inicio de una página (grupos de Funcionalidades, rubros).
 * A 360 px se desliza dentro de su propia franja: la página no gana scroll horizontal.
 */
export function FeatureIndex({ label, items }: { label: string; items: { id: string; title: string }[] }) {
  return (
    <nav aria-label={label} className="mt-10">
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {items.map((item) => (
          <li key={item.id} className="shrink-0">
            <a
              href={`#${item.id}`}
              className="inline-flex min-h-11 items-center rounded-full border border-line bg-surface px-4 text-sm font-semibold text-fg transition-colors hover:border-primary hover:text-primary"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
