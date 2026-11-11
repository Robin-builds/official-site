import Link from "next/link";
import type { FuncionalidadesContent } from "@/content/funcionalidades";
import { inicio } from "@/content/inicio";
import { ui } from "@/content/site";
import type { Feature, Locale } from "@/content/types";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { guideHref, readyGuide } from "@/lib/i18n";
import { PhoneFrame, ScreenImage } from "./PhoneMockup";

const SCREEN_SIZES = "(min-width: 1024px) 240px, 200px";

/**
 * Funcionalidades por grupo (FR-008): cada grupo es una sección con su ancla y H2; cada
 * funcionalidad tiene su ancla, H3, descripción, beneficio y, si existe, su captura real.
 * Sin captura: solo ícono y texto (US3-2, Principio I).
 * Las secciones alternan fondo para marcar el ritmo.
 */
export function FeatureGroups({ content, locale }: { content: FuncionalidadesContent; locale: Locale }) {
  return (
    <>
      {content.groups.map((group, gi) => {
        const items = content.features.filter((f) => f.group === group.key);
        return (
          <section
            key={group.key}
            id={group.id}
            aria-labelledby={`${group.id}-title`}
            className={`scroll-mt-16 py-section ${gi % 2 === 0 ? "bg-canvas" : "bg-surface"}`}
          >
            <Container>
              <div className="max-w-2xl">
                <h2 id={`${group.id}-title`} className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">
                  {group.title}
                </h2>
                <p className="mt-3 text-lg text-fg-2">{group.intro}</p>
              </div>
              <div className="mt-10 flex flex-col gap-12 sm:mt-14 lg:gap-16">
                {items.map((feature, i) => (
                  <FeatureRow key={feature.key} feature={feature} locale={locale} reverse={i % 2 === 1} />
                ))}
              </div>
            </Container>
          </section>
        );
      })}
    </>
  );
}

function FeatureRow({ feature, locale, reverse }: { feature: Feature; locale: Locale; reverse: boolean }) {
  const t = ui[locale].common;
  const guide = readyGuide(feature.guide);

  const text = (
    <div className="max-w-xl">
      <span className="grid size-12 place-items-center rounded-2xl bg-primary/12 text-primary">
        <Icon name={feature.icon} />
      </span>
      <h3 id={`${feature.id}-title`} className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-2xl font-semibold text-fg">
        {feature.title}
        {feature.adminOnly && (
          <span className="rounded-full border border-accent/50 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-accent-text uppercase">
            {t.adminOnly}
          </span>
        )}
      </h3>
      <p className="mt-3 text-lg text-fg-2">{feature.description}</p>
      <p className="mt-4 flex gap-2 text-fg">
        <Icon name="check" className="mt-0.5 size-5 shrink-0 text-ok" />
        <span>
          <span className="sr-only">{t.benefitLabel}: </span>
          {feature.benefit}
        </span>
      </p>
      {guide && (
        <Link
          href={guideHref(guide.key, locale)}
          className="mt-5 inline-flex min-h-11 items-center gap-1 rounded-sm font-semibold text-link underline underline-offset-4 hover:no-underline"
        >
          {t.seeGuide}: {guide.locales[locale].title}
        </Link>
      )}
    </div>
  );

  return (
    <article id={feature.id} aria-labelledby={`${feature.id}-title`} className="scroll-mt-20">
      {feature.screen ? (
        <div className="grid items-center gap-10 md:grid-cols-[1fr_auto] md:gap-16">
          <div className={reverse ? "md:order-2" : ""}>{text}</div>
          <PhoneFrame className={`mx-auto w-[200px] lg:w-[240px] ${reverse ? "md:order-1" : ""}`}>
            <ScreenImage
              screen={feature.screen}
              locale={locale}
              pendingLabel={inicio[locale].hero.screenshotPending}
              sizes={SCREEN_SIZES}
            />
          </PhoneFrame>
        </div>
      ) : (
        text
      )}
    </article>
  );
}
