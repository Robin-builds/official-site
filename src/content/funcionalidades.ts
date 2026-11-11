/**
 * FUNCIONALIDADES (`/funcionalidades`, `/en/features`; FR-008, research R9 y R22).
 *
 * Fuente: guía rápida del owner + funcionalidades confirmadas por el owner (lotes y
 * vencimientos, idioma de la app). Principio I: nada que la app no haga hoy.
 * - El historial NO muestra quién hizo cada movimiento: solo "con su fecha" (research R8).
 * - El panel web es de solo lectura.
 * - Captura solo cuando existe una real en /public/screens/; si no, solo texto e ícono.
 *
 * Los datos comunes (clave, grupo, ícono, captura, guía) se declaran una vez en `base`, así
 * ambos idiomas tienen las mismas funcionalidades en el mismo orden (contracts/content.md).
 */
import { capturas, type CapturaKey } from "./capturas";
import { ui } from "./site";
import type { Cta, Feature, FeatureGroup, FeatureGroupKey, GuideKey, IconName, Locale, Localized } from "./types";

type FeatureKey =
  | "scanning"
  | "movements"
  | "adjustments"
  | "expiry"
  | "warehouses"
  | "products"
  | "low-stock-alerts"
  | "inactivity-alerts"
  | "roles"
  | "offline"
  | "history"
  | "web-panel"
  | "excel-export"
  | "product-settings"
  | "themes";

type FeatureBase = {
  key: FeatureKey;
  group: FeatureGroupKey;
  icon: IconName;
  capture: CapturaKey | null;
  guide: GuideKey | null;
  adminOnly?: boolean;
};
type FeatureText = Pick<Feature, "id" | "title" | "description" | "benefit">;

// Orden de la página: por grupo, y dentro de cada grupo en este orden
const base: FeatureBase[] = [
  { key: "scanning", group: "record", icon: "scan", capture: "escanear", guide: null },
  { key: "movements", group: "record", icon: "history", capture: "movimiento", guide: "movimientos" },
  { key: "adjustments", group: "record", icon: "adjust", capture: null, guide: "movimientos" },
  { key: "expiry", group: "record", icon: "calendar", capture: null, guide: null },
  { key: "warehouses", group: "control", icon: "warehouse", capture: "bodega", guide: "bodegas" },
  { key: "products", group: "control", icon: "search", capture: null, guide: "primeros-pasos" },
  { key: "low-stock-alerts", group: "control", icon: "alert", capture: "alertaStock", guide: "alertas" },
  { key: "inactivity-alerts", group: "control", icon: "clock", capture: null, guide: "alertas" },
  { key: "roles", group: "team", icon: "users", capture: null, guide: null },
  { key: "offline", group: "team", icon: "offline", capture: null, guide: null },
  { key: "history", group: "review", icon: "notebook", capture: "historial", guide: "movimientos" },
  { key: "web-panel", group: "review", icon: "monitor", capture: null, guide: null },
  { key: "excel-export", group: "review", icon: "download", capture: null, guide: null, adminOnly: true },
  { key: "product-settings", group: "customize", icon: "sliders", capture: null, guide: null },
  { key: "themes", group: "customize", icon: "palette", capture: null, guide: null },
];

const groupOrder: FeatureGroupKey[] = ["record", "control", "team", "review", "customize"];

const texts: Localized<{
  groups: Record<FeatureGroupKey, Omit<FeatureGroup, "key">>;
  features: Record<FeatureKey, FeatureText>;
}> = {
  es: {
    groups: {
      record: { id: "registrar", title: "Registrar", intro: "Anota en segundos lo que entra y sale de tu bodega." },
      control: { id: "controlar", title: "Controlar", intro: "Sabe qué tienes, dónde está y qué se está acabando." },
      team: { id: "equipo", title: "Trabajar en equipo", intro: "Cada persona con su rol, haya o no señal." },
      review: { id: "revisar", title: "Revisar", intro: "Mira lo que pasó y llévalo al computador." },
      customize: { id: "personalizar", title: "Personalizar", intro: "Adapta la app a tus productos y a tu gusto." },
    },
    features: {
      scanning: {
        id: "escaneo",
        title: "Escaneo con la cámara",
        description:
          "La cámara del celular lee códigos de barras y QR. Con la linterna funciona incluso en bodegas con poca luz.",
        benefit: "Cargas y encuentras productos sin escribir y sin comprar un lector.",
      },
      movements: {
        id: "entradas-y-salidas",
        title: "Entradas y salidas",
        description:
          "Registra una ENTRADA cuando llega mercadería y una SALIDA cuando sale: ventas, entregas, pérdidas o daños. El stock no se escribe a mano: se calcula con los movimientos.",
        benefit: "El stock siempre cuadra con lo que pasó en la bodega.",
      },
      adjustments: {
        id: "ajustes",
        title: "Ajustes de inventario",
        description:
          "Si el conteo físico no coincide con la app, registras un AJUSTE para corregir la diferencia, hacia arriba o hacia abajo.",
        benefit: "Corriges mermas y errores sin borrar nada del historial.",
      },
      expiry: {
        id: "lotes-y-vencimientos",
        title: "Lotes y fechas de vencimiento",
        description: "Registra los lotes de tus productos con su fecha de vencimiento.",
        benefit: "Sacas primero lo que vence primero y pierdes menos mercadería.",
      },
      warehouses: {
        id: "bodegas",
        title: "Varias bodegas",
        description:
          "Tu empresa puede tener varias bodegas, cada una con sus propios productos, movimientos y stock. Cambias la bodega activa con un toque.",
        benefit: "Sabes qué hay en la tienda, en la reserva o en cada sucursal, sin mezclar números.",
      },
      products: {
        id: "productos",
        title: "Productos y búsqueda",
        description:
          "Cada producto tiene nombre, unidad (kg, L, pza…) y stock mínimo, y si quieres, proveedor y notas. Para encontrarlo, escribe parte del nombre y la lista se filtra.",
        benefit: "Encuentras cualquier producto en segundos, aunque tengas cientos.",
      },
      "low-stock-alerts": {
        id: "alertas-de-stock",
        title: "Alertas de stock bajo",
        description:
          "Cuando un producto queda bajo su stock mínimo o en 0, aparece un aviso rojo en el inicio. Al tocarlo ves la lista con el stock actual y el mínimo de cada uno.",
        benefit: "Repones antes de que el cliente pida algo que ya no tienes.",
      },
      "inactivity-alerts": {
        id: "sin-actividad",
        title: "Alerta sin actividad",
        description: "Si un producto pasa 7 días sin ningún movimiento, la app te lo recuerda.",
        benefit: "Detectas productos que no rotan, registros pendientes o posibles vencimientos.",
      },
      roles: {
        id: "usuarios-y-roles",
        title: "Usuarios y roles",
        description:
          "Tu empresa puede tener varios usuarios con uno de dos roles: Administrador, con acceso completo, u Operador, que ve productos y stock y registra entradas y salidas, pero no crea productos ni gestiona usuarios.",
        benefit: "Tu equipo registra en la bodega sin tocar lo que no le corresponde.",
      },
      offline: {
        id: "sin-internet",
        title: "Funciona sin internet",
        description:
          "Registra entradas y salidas aunque no haya señal. Todo queda guardado en el celular y se respalda solo cuando vuelve la conexión.",
        benefit: "Ya no dejas registros «para después» porque la señal no llega al fondo de la bodega.",
      },
      history: {
        id: "historial",
        title: "Historial de movimientos",
        description:
          "Cada movimiento queda en el historial con su fecha. Los movimientos no se editan ni se borran: un error se corrige con un AJUSTE.",
        benefit: "Revisas qué entró y qué salió, y cuándo, sin depender de la memoria.",
      },
      "web-panel": {
        id: "panel-web",
        title: "Panel web de solo lectura",
        description:
          "Con la misma cuenta de la app, entra desde el computador para consultar el stock, ver alertas, revisar el historial y ver reportes y gráficos. Desde la web no se registran movimientos ni se editan productos.",
        benefit: "Revisas tu inventario desde la oficina sin tener el celular a mano.",
      },
      "excel-export": {
        id: "exportar-a-excel",
        title: "Exportar a Excel",
        description: "Exporta los reportes de tu inventario a una planilla de Excel.",
        benefit: "Llevas los datos a tus planillas o se los compartes a tu contador.",
      },
      "product-settings": {
        id: "configurar-productos",
        title: "Configurar productos",
        description:
          "Crea características propias, como talla, color, voltaje o peso neto, de tipo texto, número o lista, y asígnalas solo a los productos que las necesitan. Se hace desde la tarjeta «Configurar productos».",
        benefit: "Registras los datos que importan en tu rubro, sin campos que sobran.",
      },
      themes: {
        id: "temas",
        title: "Temas de color",
        description:
          "Elige entre 3 paletas de color y 3 niveles de oscuridad: 9 combinaciones, en Configuración > Apariencia.",
        benefit: "Usas la app con la apariencia que te resulta más cómoda.",
      },
    },
  },
  en: {
    groups: {
      record: { id: "record", title: "Record", intro: "Log what comes in and goes out of your warehouse in seconds." },
      control: { id: "stay-on-top", title: "Stay on top", intro: "Know what you have, where it is and what's running low." },
      team: { id: "team", title: "Work as a team", intro: "Everyone with their own role, with or without signal." },
      review: { id: "review", title: "Review", intro: "See what happened and take it to your computer." },
      customize: { id: "customize", title: "Customize", intro: "Fit the app to your products and your taste." },
    },
    features: {
      scanning: {
        id: "scanning",
        title: "Scanning with your camera",
        description:
          "Your phone camera reads barcodes and QR codes. With the flashlight it works even in dimly lit warehouses.",
        benefit: "You add and find products without typing and without buying a scanner.",
      },
      movements: {
        id: "stock-in-and-out",
        title: "Stock in and stock out",
        description:
          "Record a stock in when goods arrive and a stock out when they leave: sales, deliveries, losses or damage. You never type the stock by hand: it's calculated from the movements.",
        benefit: "Your stock always matches what happened in the warehouse.",
      },
      adjustments: {
        id: "adjustments",
        title: "Inventory adjustments",
        description:
          "If your physical count doesn't match the app, you record an adjustment to correct the difference, up or down.",
        benefit: "You fix shrinkage and mistakes without deleting anything from the history.",
      },
      expiry: {
        id: "batches-and-expiry",
        title: "Batches and expiry dates",
        description: "Record your products' batches with their expiry date.",
        benefit: "You sell first what expires first and lose less stock.",
      },
      warehouses: {
        id: "warehouses",
        title: "Multiple warehouses",
        description:
          "Your company can have several warehouses, each with its own products, movements and stock. You switch the active warehouse with one tap.",
        benefit: "You know what's in the shop, the back room or each branch, without mixing numbers.",
      },
      products: {
        id: "products",
        title: "Products and search",
        description:
          "Each product has a name, a unit (kg, L, pcs…) and a minimum stock, plus a supplier and notes if you want. To find one, type part of its name and the list filters itself.",
        benefit: "You find any product in seconds, even if you have hundreds.",
      },
      "low-stock-alerts": {
        id: "low-stock-alerts",
        title: "Low stock alerts",
        description:
          "When a product drops below its minimum stock or reaches 0, a red notice appears on the home screen. Tap it to see the list with each product's current stock and minimum.",
        benefit: "You restock before a customer asks for something you no longer have.",
      },
      "inactivity-alerts": {
        id: "no-activity-alert",
        title: "No-activity alert",
        description: "If a product goes 7 days without any movement, the app reminds you.",
        benefit: "You spot products that don't sell, pending records or items that may be expiring.",
      },
      roles: {
        id: "users-and-roles",
        title: "Users and roles",
        description:
          "Your company can have several users with one of two roles: Administrator, with full access, or Operator, who sees products and stock and records stock ins and outs, but doesn't create products or manage users.",
        benefit: "Your team records in the warehouse without touching what isn't theirs to change.",
      },
      offline: {
        id: "works-without-internet",
        title: "Works without internet",
        description:
          "Record stock ins and outs even with no signal. Everything is saved on the phone and backed up automatically when the connection comes back.",
        benefit: "No more leaving records “for later” because the signal doesn't reach the back of the warehouse.",
      },
      history: {
        id: "history",
        title: "Movement history",
        description:
          "Every movement stays in the history with its date. Movements can't be edited or deleted: a mistake is corrected with an adjustment.",
        benefit: "You can check what came in and what went out, and when, without relying on memory.",
      },
      "web-panel": {
        id: "web-panel",
        title: "Read-only web panel",
        description:
          "With the same account as the app, sign in from your computer to check stock, see alerts, review the history and view reports and charts. You can't record movements or edit products from the web.",
        benefit: "You review your inventory from the office without having your phone at hand.",
      },
      "excel-export": {
        id: "excel-export",
        title: "Export to Excel",
        description: "Export your inventory reports to an Excel spreadsheet.",
        benefit: "You take the data to your own spreadsheets or share it with your accountant.",
      },
      "product-settings": {
        id: "product-settings",
        title: "Product settings",
        description:
          "Create your own attributes, such as size, color, voltage or net weight, as text, number or list, and assign them only to the products that need them. You do it from the “Configurar productos” (product settings) card.",
        benefit: "You record the details that matter in your trade, without extra fields.",
      },
      themes: {
        id: "color-themes",
        title: "Color themes",
        description:
          "Choose from 3 color palettes and 3 darkness levels: 9 combinations, under Settings > Appearance.",
        benefit: "You use the app with the look you find most comfortable.",
      },
    },
  },
};

function build(locale: Locale) {
  const t = texts[locale];
  return {
    groups: groupOrder.map((key): FeatureGroup => ({ key, ...t.groups[key] })),
    features: base.map(
      (b): Feature => ({
        key: b.key,
        group: b.group,
        icon: b.icon,
        adminOnly: b.adminOnly,
        guide: b.guide,
        screen: b.capture ? capturas[locale][b.capture] : null,
        ...t.features[b.key],
      }),
    ),
  };
}

const es = {
  intro: {
    title: "Todo lo que hace StoreFlow",
    subtitle: "Las funcionalidades de la app, agrupadas por tema. Salta directo a lo que buscas.",
  },
  indexLabel: "Temas de esta página",
  ...build("es"),
  finalCta: {
    title: "Pruébalo en tu bodega",
    subtitle: "Descarga StoreFlow en tu celular Android y registra tu primera entrada hoy.",
    cta: ui.es.ctaPrincipal as Cta,
    note: "Gratis para empezar · Disponible en Google Play",
  },
};

export type FuncionalidadesContent = typeof es;

export const funcionalidades: Localized<FuncionalidadesContent> = {
  es,
  en: {
    intro: {
      title: "Everything StoreFlow does",
      subtitle: "The app's features, grouped by topic. Jump straight to what you're looking for.",
    },
    indexLabel: "Topics on this page",
    ...build("en"),
    finalCta: {
      title: "Try it in your warehouse",
      subtitle: "Download StoreFlow on your Android phone and record your first stock in today.",
      cta: ui.en.ctaPrincipal,
      note: "Free to start · Available on Google Play",
    },
  },
};
