import type { InicioContent } from "@/content/inicio";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";

/** Dolores actuales del cliente. Acento naranja = alerta (semáforo de la app), solo en íconos. */
export function Problems({ problems }: { problems: InicioContent["problems"] }) {

  return (
    <Section titleId="problemas-title" title={problems.title} intro={problems.intro} tone="canvas">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {problems.items.map((item) => (
          // En celular, ícono al lado del texto para acortar Inicio (SC-003)
          <li key={item.title} className="card-hover flex gap-4 rounded-card border border-line bg-surface p-5 shadow-card sm:block sm:p-6">
            <span className="card-icon grid size-11 shrink-0 place-items-center rounded-xl bg-accent/12 text-accent">
              <Icon name={item.icon} />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-fg sm:mt-4">{item.title}</h3>
              <p className="mt-2 text-fg-2">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
