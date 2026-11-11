/**
 * GUÍAS DE USO (FR-014, research R10). Redactadas desde la guía rápida del owner
 * (specs/005-official-site/fuentes/guia-rapida.md), en el orden en que la app pide los pasos.
 *
 * - Los nombres que aparecen en pantalla (ENTRADA, SALIDA, AJUSTE, «Productos», «Bodegas»)
 *   se citan tal como en la app; en inglés, con su traducción la primera vez (Principio VII).
 * - `ready: false` saca la guía de rutas, enlaces y sitemap en ambos idiomas.
 * - Ningún paso afirma que la app muestra quién hizo cada movimiento (research R8).
 */
import { capturas } from "./capturas";
import type { Guide } from "./types";

const es = capturas.es;
const en = capturas.en;

export const guias: Guide[] = [
  {
    key: "primeros-pasos",
    ready: true,
    feature: "products",
    locales: {
      es: {
        slug: "primeros-pasos",
        title: "Primeros pasos",
        summary: "Crea tu cuenta, agrega tu primer producto y registra tu primera entrada.",
        steps: [
          {
            title: "Crea tu cuenta",
            body: "Descarga StoreFlow desde Google Play y regístrate con tu email y una contraseña. La app crea sola tu empresa y una bodega llamada «Bodega Principal».",
            screen: null,
          },
          {
            title: "Agrega tu primer producto",
            body: "En el inicio, toca la tarjeta «Productos» y luego el botón [+]. Escribe el nombre, elige la unidad (kg, L, pza…) y define el stock mínimo: si el stock baja de ese número, el producto aparece en las alertas.",
            screen: null,
          },
          {
            title: "Registra tu primera entrada",
            body: "Ve a Movimientos y registra una ENTRADA: elige el producto, escribe la cantidad y confirma. En StoreFlow el stock no se escribe a mano: se calcula sumando entradas y restando salidas.",
            screen: null,
          },
          {
            title: "Revisa el inicio",
            body: "Vuelve al inicio: ahí ves cuántos productos tienes, el total de unidades y una alerta si algún producto quedó bajo su mínimo. Si tienes dudas, los íconos «?» de cada sección explican cómo funciona.",
            screen: es.inicio,
          },
        ],
      },
      en: {
        slug: "getting-started",
        title: "Getting started",
        summary: "Create your account, add your first product and record your first stock in.",
        steps: [
          {
            title: "Create your account",
            body: "Download StoreFlow from Google Play and sign up with your email and a password. The app automatically creates your company and a warehouse called “Bodega Principal” (main warehouse).",
            screen: null,
          },
          {
            title: "Add your first product",
            body: "On the home screen, tap the “Productos” (products) card and then the [+] button. Enter the name, choose the unit (kg, L, pcs…) and set the minimum stock: if stock drops below that number, the product shows up in the alerts.",
            screen: null,
          },
          {
            title: "Record your first stock in",
            body: "Go to Movimientos (movements) and record an ENTRADA (stock in): choose the product, enter the quantity and confirm. In StoreFlow you never type the stock by hand: it's calculated by adding stock ins and subtracting stock outs.",
            screen: null,
          },
          {
            title: "Check the home screen",
            body: "Go back to the home screen: it shows how many products you have, the total units and an alert if any product is below its minimum. If you have questions, the “?” icons in each section explain how it works.",
            screen: en.inicio,
          },
        ],
      },
    },
  },
  {
    key: "movimientos",
    ready: true,
    feature: "movements",
    locales: {
      es: {
        slug: "registrar-movimientos",
        title: "Registrar entradas, salidas y ajustes",
        summary: "Los tres tipos de movimiento y cómo calculan tu stock.",
        steps: [
          {
            title: "Registra una ENTRADA cuando llega mercadería",
            body: "Usa ENTRADA cuando llega mercadería del proveedor o un cliente te devuelve algo. Elige el producto, escribe la cantidad y confirma: el stock sube.",
            screen: null,
          },
          {
            title: "Registra una SALIDA cuando sale mercadería",
            body: "Usa SALIDA para ventas, entregas, pérdidas o productos dañados. El stock baja en la cantidad que registras.",
            screen: es.movimiento,
          },
          {
            title: "Usa un AJUSTE cuando el conteo no cuadra",
            body: "Si cuentas la bodega y el número no coincide con la app, registra un AJUSTE para corregir la diferencia, hacia arriba o hacia abajo.",
            screen: null,
          },
          {
            title: "Mira un ejemplo con harina",
            body: "Partes en 0 kg. Una ENTRADA de 100 deja 100. Una SALIDA de 30 deja 70. Otra SALIDA de 15 deja 55. Al contar encuentras 50: un AJUSTE de −5 deja el stock en 50.",
            screen: null,
          },
          {
            title: "Revisa el historial",
            body: "Cada movimiento queda en el historial con su fecha. Los movimientos no se editan ni se borran: si te equivocas, lo corriges con un AJUSTE.",
            screen: es.historial,
          },
        ],
      },
      en: {
        slug: "recording-stock-movements",
        title: "Recording stock ins, stock outs and adjustments",
        summary: "The three types of movement and how they calculate your stock.",
        steps: [
          {
            title: "Record an ENTRADA (stock in) when goods arrive",
            body: "Use ENTRADA when goods arrive from your supplier or a customer returns something. Choose the product, enter the quantity and confirm: stock goes up.",
            screen: null,
          },
          {
            title: "Record a SALIDA (stock out) when goods leave",
            body: "Use SALIDA for sales, deliveries, losses or damaged products. Stock goes down by the quantity you record.",
            screen: en.movimiento,
          },
          {
            title: "Use an AJUSTE (adjustment) when the count doesn't match",
            body: "If you count your warehouse and the number doesn't match the app, record an AJUSTE to correct the difference, up or down.",
            screen: null,
          },
          {
            title: "See an example with flour",
            body: "You start at 0 kg. An ENTRADA of 100 leaves 100. A SALIDA of 30 leaves 70. Another SALIDA of 15 leaves 55. When you count, you find 50: an AJUSTE of −5 sets stock to 50.",
            screen: null,
          },
          {
            title: "Check the history",
            body: "Every movement stays in the history with its date. Movements can't be edited or deleted: if you make a mistake, you correct it with an AJUSTE.",
            screen: en.historial,
          },
        ],
      },
    },
  },
  {
    key: "bodegas",
    ready: true,
    feature: "warehouses",
    locales: {
      es: {
        slug: "varias-bodegas",
        title: "Trabajar con varias bodegas",
        summary: "Cuándo te conviene tener más de una bodega y cómo cambiar entre ellas.",
        steps: [
          {
            title: "Decide si necesitas más de una",
            body: "Te conviene usar varias bodegas si tienes un almacén separado de la tienda, una bodega fría y una seca, varias sucursales o si quieres separar por zona o piso. Cada bodega tiene sus propios productos, movimientos y stock.",
            screen: null,
          },
          {
            title: "Crea tus bodegas",
            body: "Al registrarte ya tienes la «Bodega Principal». Para agregar otra, toca la tarjeta «Bodegas» en el inicio y crea una nueva. Crear bodegas es tarea del Administrador.",
            screen: null,
          },
          {
            title: "Cambia la bodega activa",
            body: "Todo lo que muestra el inicio corresponde a la bodega activa. Para cambiarla, toca la tarjeta «Bodegas» y elige otra de la lista.",
            screen: es.bodega,
          },
          {
            title: "Mira un ejemplo",
            body: "Un minimarket puede usar «Bodega Tienda» para la sala de ventas y «Bodega Trasera» para la reserva. Así sabe qué hay en cada lugar sin mezclar los números.",
            screen: null,
          },
        ],
      },
      en: {
        slug: "multiple-warehouses",
        title: "Working with multiple warehouses",
        summary: "When it helps to have more than one warehouse and how to switch between them.",
        steps: [
          {
            title: "Decide whether you need more than one",
            body: "Multiple warehouses make sense if you have storage separate from your shop, a cold room and a dry room, several branches, or you want to split by area or floor. Each warehouse has its own products, movements and stock.",
            screen: null,
          },
          {
            title: "Create your warehouses",
            body: "When you sign up you already have “Bodega Principal” (main warehouse). To add another one, tap the “Bodegas” (warehouses) card on the home screen and create a new one. Creating warehouses is a task for the Administrator.",
            screen: null,
          },
          {
            title: "Change the active warehouse",
            body: "Everything on the home screen belongs to the active warehouse. To change it, tap the “Bodegas” card and pick another one from the list.",
            screen: en.bodega,
          },
          {
            title: "See an example",
            body: "A convenience store can use one warehouse for the shop floor and another for the back room. That way it knows what's in each place without mixing the numbers.",
            screen: null,
          },
        ],
      },
    },
  },
  {
    key: "alertas",
    ready: true,
    feature: "low-stock-alerts",
    locales: {
      es: {
        slug: "alertas-de-stock",
        title: "Alertas de stock",
        summary: "Define un stock mínimo y entérate antes de quedarte sin productos.",
        steps: [
          {
            title: "Define el stock mínimo de cada producto",
            body: "Al crear un producto indicas su stock mínimo, por ejemplo 5 kg de harina. Ese número es el umbral de la alerta.",
            screen: null,
          },
          {
            title: "Fíjate en el aviso de menor stock",
            body: "Cuando un producto queda bajo su mínimo o en 0, aparece un aviso rojo en el inicio.",
            screen: null,
          },
          {
            title: "Revisa la lista y decide qué reponer",
            body: "Toca el aviso para ver la lista de productos con su stock actual y su mínimo.",
            screen: es.alertaStock,
          },
          {
            title: "Atiende la alerta sin actividad",
            body: "Si un producto pasa 7 días sin ningún movimiento, StoreFlow te lo recuerda. No es un error: te ayuda a detectar productos que no rotan, registros pendientes o posibles vencimientos.",
            screen: null,
          },
        ],
      },
      en: {
        slug: "stock-alerts",
        title: "Stock alerts",
        summary: "Set a minimum stock and find out before you run out of products.",
        steps: [
          {
            title: "Set each product's minimum stock",
            body: "When you create a product you set its minimum stock, for example 5 kg of flour. That number is the alert threshold.",
            screen: null,
          },
          {
            title: "Watch for the low stock notice",
            body: "When a product drops below its minimum or reaches 0, a red notice appears on the home screen.",
            screen: null,
          },
          {
            title: "Check the list and decide what to restock",
            body: "Tap the notice to see the list of products with their current stock and their minimum.",
            screen: en.alertaStock,
          },
          {
            title: "Act on the no-activity alert",
            body: "If a product goes 7 days without any movement, StoreFlow reminds you. It isn't an error: it helps you spot products that don't sell, pending records or items that may be expiring.",
            screen: null,
          },
        ],
      },
    },
  },
];

/** Guías publicables: las que no están listas no generan ruta, enlace ni entrada de sitemap. */
export function readyGuides(): Guide[] {
  return guias.filter((g) => g.ready);
}
