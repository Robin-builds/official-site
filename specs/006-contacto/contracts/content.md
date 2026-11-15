# Contract: contenido de Contacto (`src/content/contacto.ts`)

Forma tipada que consumen `ContactPage`, `ContactForm` y `ContactAlternatives`. Todo texto es
`Localized<…>` (constitución III): falta una traducción → falla el build. El copy en español es
la fuente de verdad; el inglés queda oculto hasta la revisión del owner (Principio VII).
FR-012: nada de tiempos de respuesta, llamadas, demos ni beneficios.

```ts
type ContactField = "name" | "company" | "phone" | "email" | "message";
type ContactError = "required" | "email" | "phone";

type ContactContent = {
  header: { title: string; subtitle: string };       // H1 y bajada (PageHeader)
  form: {
    title: string;                                   // H2 de la columna del formulario
    fields: Record<ContactField, {
      label: string;                                 // etiqueta visible
      hint?: string;                                 // ayuda bajo el campo (p. ej. "Opcional")
    }>;
    errors: Record<ContactField, Partial<Record<ContactError, string>>>;
    errorSummary: { one: string; other: string };    // anuncio en role="status"; "{n}" = cantidad
    submit: string;                                  // botón primario
    privacyNote: string;                             // FR-005, junto al botón
    sent: { text: string; link: string };            // aviso tras el envío + enlace de respaldo
    noScript: string;                                // FR-013
  };
  message: {                                         // texto que se envía por WhatsApp
    greeting: string;
    labels: Record<ContactField, string>;
  };
  alternatives: {
    title: string;                                   // H2 de la columna de alternativas
    body: string;
    direct: Cta;                                     // href = whatsapp[locale].general
    qr: { src: `/contact/${string}.svg`; alt: string; caption: string };
  };
};
```

`errorSummary` trae singular y plural; el componente elige según la cantidad y reemplaza `{n}`.

## Copy propuesto (ES, fuente de verdad)

| Clave | Texto |
|-------|-------|
| header.title | Conversemos |
| header.subtitle | Déjanos tus datos y se arma un mensaje de WhatsApp para StoreFlow. Tú decides si lo envías. |
| form.title | Envíanos tus datos |
| fields.name.label | Nombre |
| fields.company.label | Nombre de tu empresa |
| fields.phone.label / hint | Teléfono / Opcional |
| fields.email.label / hint | Correo / Opcional |
| fields.message.label / hint | ¿En qué te podemos ayudar? / Opcional, hasta 500 caracteres |
| errors.name.required | Escribe tu nombre. |
| errors.company.required | Escribe el nombre de tu empresa. |
| errors.phone.phone | Revisa el teléfono: debe tener entre 8 y 15 números, por ejemplo +56 9 1234 5678. |
| errors.email.email | Revisa el correo: debe verse como nombre@empresa.cl. |
| errorSummary.one / other | Revisa 1 campo. / Revisa {n} campos. |
| submit | Enviar por WhatsApp |
| privacyNote | Tus datos no se guardan en este sitio: solo se agregan al mensaje de WhatsApp, y tú decides si lo envías. |
| sent.text / link | Abrimos WhatsApp en una pestaña nueva. ¿No se abrió? / Abrir WhatsApp |
| noScript | Para armar el mensaje con tus datos, este formulario necesita JavaScript. Puedes escribirnos directo por WhatsApp. |
| message.greeting | Hola, quiero saber más de StoreFlow. Mis datos: |
| message.labels | Nombre · Empresa · Teléfono · Correo · Mensaje |
| alternatives.title | ¿Prefieres escribir directo? |
| alternatives.body | Abre el chat de StoreFlow sin llenar nada. |
| alternatives.direct.label | Escribir por WhatsApp |
| qr.alt | Código QR que abre el chat de WhatsApp de StoreFlow |
| qr.caption | Escanéalo con la cámara de tu celular. |

La traducción al inglés sigue el mismo sentido ("Let's talk", "Send it on WhatsApp", "Message us
on WhatsApp", "Scan it with your phone's camera.", etc.) y la revisa el owner.

## Cambios en `src/content/site.ts`

- `WHATSAPP_NUMBER = "56957596588"`; `whatsappLink` pasa a `export`.
- Nueva entrada `contact` en `pages` (ver [data-model.md](../data-model.md)).
- `ui[locale].footer.contactLabel` se elimina (el pie enlaza a la página, R9).

## Cambios en `src/content/types.ts`

- `PageKey` suma `"contact"`.
