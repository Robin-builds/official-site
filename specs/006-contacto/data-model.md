# Data Model: Página de Contacto (spec 006)

No hay datos persistidos. Las "entidades" son estructuras en memoria del navegador y contenido
tipado en `src/content/`.

## Solicitud de contacto (efímera, solo en el navegador)

Estado del formulario; vive en el componente cliente y se pierde al cerrar la pestaña. Nunca se
envía ni se guarda (FR-005).

| Campo | Tipo | Obligatorio | Máx. | Regla (después de `trim`) | Autocompletado |
|-------|------|-------------|------|---------------------------|----------------|
| `name` | string | sí | 100 | no vacío | `name` |
| `company` | string | sí | 100 | no vacío | `organization` |
| `phone` | string | no | 30 | si no está vacío: solo `0-9 + - ( ) .` y espacios; 8–15 dígitos | `tel` (`type="tel"`) |
| `email` | string | no | 254 | si no está vacío: `^[^\s@]+@[^\s@]+\.[^\s@]+$` | `email` (`type="email"`) |
| `message` | string | no | 500 | ninguna | `off` |

**Estados del formulario**

```text
deshabilitado (sin hidratar / sin JS)
   └─(hidrata)→ editando
editando ─(enviar, inválido)→ con errores ─(corrige y envía)→ …
editando / con errores ─(enviar, válido)→ enviado
enviado: abre WhatsApp en pestaña nueva + muestra aviso con enlace "Abrir WhatsApp";
         los datos se conservan; editar y volver a enviar arma un enlace nuevo
```

**Errores**: `Partial<Record<campo, código>>` con códigos `required | email | phone`; el texto de
cada error sale del contenido en el idioma de la página.

## Mensaje de WhatsApp (derivado)

```text
<saludo>
<rótulo nombre>: <name>
<rótulo empresa>: <company>
[<rótulo teléfono>: <phone>]
[<rótulo correo>: <email>]
[<rótulo mensaje>: <message>]
```

Las líneas entre corchetes se omiten si el campo está vacío. Enlace:
`https://wa.me/56957596588?text=<encodeURIComponent(mensaje)>`.

## Destino de WhatsApp (contenido, `src/content/site.ts`)

| Elemento | Valor |
|----------|-------|
| `WHATSAPP_NUMBER` | `"56957596588"` (único lugar) |
| `whatsappLink(message)` | exportada; arma el enlace `wa.me` |
| `whatsapp[locale].general` | botón directo, QR (y antes, el pie) |
| `whatsapp[locale].partner` | "Sé partner" (sin cambios) |

## Registro de páginas

`PageKey` suma `"contact"`. Entrada en `pages` (después de `help`):

| Campo | ES | EN |
|-------|----|----|
| `href` | `/contacto` | `/en/contact` |
| `navLabel` | Contacto | Contact |
| `title` | Contacto | Contact |
| `description` | Envíanos tus datos por WhatsApp o escríbenos directo para conversar sobre StoreFlow. | Send us your details on WhatsApp or message us directly to talk about StoreFlow. |
| `inNav` / `published` | `true` / `true` | (el inglés depende de `languages.en.published`) |

## Contenido de la página (`src/content/contacto.ts`, `Localized<ContactContent>`)

Ver la forma completa en [contracts/content.md](./contracts/content.md).
