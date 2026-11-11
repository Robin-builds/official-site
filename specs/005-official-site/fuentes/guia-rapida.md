# Fuente: StoreFlow — Guía Rápida de Usuario (v1.0, julio 2026)

Transcripción fiel del PDF `StoreFlow_Guia_Rapida.pdf` entregado por el owner el 2026-11-10.
Es la fuente de las guías del sitio (FR-014) y de las funcionalidades permitidas (Principio I).
No se publica tal cual: se adapta a español de Chile sin jerga (Principio VII).

## 1. Vista general

StoreFlow es una aplicación móvil de gestión de inventario para pequeños negocios chilenos: minimarkets,
ferreterías, distribuidoras, almacenes y cualquier comercio que necesite controlar su stock.
Funciona sin internet y se sincroniza sola cuando hay conexión. Tiene un panel web complementario.

**Concepto clave: el stock nunca se ingresa manualmente.** Se calcula sumando entradas y restando salidas.
No se escribe "50 unidades"; se registra "ENTRADA de 50 unidades". Así siempre se ve cuándo entró y salió cada unidad.

Jerarquía: Empresa → Bodegas → Productos → Movimientos → Stock
- Empresa: tu negocio; se crea una vez al registrarte.
- Bodegas: almacenes dentro de la empresa, cada una independiente.
- Productos: pertenecen a una bodega.
- Movimientos: entradas, salidas y ajustes.
- Stock: calculado = suma de movimientos.

## 2. Primeros pasos

1. **Crear cuenta**: con email y contraseña. Se crean automáticamente tu empresa y una "Bodega Principal".
2. **Agregar tu primer producto**: en el inicio, tarjeta "Productos" → botón [+]. Nombre, unidad (kg, pza, L…) y stock mínimo.
3. **Registrar tu primer movimiento**: en Movimientos registra una ENTRADA: producto, cantidad, confirmar.
4. **Verificar en el inicio**: contador de productos, unidades totales y alerta si está bajo el mínimo.

Consejo: los íconos "?" de cada sección explican cómo funciona; se desactivan en Configuración.

## 3. Productos

Campos: Nombre (obligatorio, único por bodega), Unidad (obligatorio: kg, L, pza, mt, ml, g…),
Stock mínimo (obligatorio, umbral de alerta), Proveedor (opcional), Notas (opcional).
Ejemplo: Harina · kg · mínimo 5 · Distribuidora Sur · "Preferir marca Selecta". Bajo 5 kg aparece en alertas.
Búsqueda: campo que filtra la lista al escribir parte del nombre ("har" → Harina).

## 4. Bodegas

Cada bodega tiene sus propios productos, movimientos y stock, independientes.
Ejemplo: MiniMarket Don José → Bodega Tienda (sala de ventas) y Bodega Trasera (reserva).
**Bodega activa**: todo lo que muestra el inicio corresponde a ella; se cambia tocando la tarjeta "Bodegas".
Cuándo usar varias: almacén separado de la tienda, bodega fría y seca, varias sucursales, separar por zona o piso.

## 5. Movimientos

| Tipo | Efecto | Cuándo |
|---|---|---|
| ENTRADA | suma | llega mercadería del proveedor, devolución de cliente |
| SALIDA | resta | ventas, entregas, pérdida, daño |
| AJUSTE | +/- corrige | el conteo físico no coincide con el sistema |

Ejemplo Harina desde 0: ENTRADA +100 → 100; SALIDA −30 → 70; SALIDA −15 → 55; AJUSTE −5 → 50 (merma).
Los movimientos no se editan ni se borran; un error se corrige con un AJUSTE.

## 6. Configurar productos

Características personalizadas (plantillas) que se asignan solo a los productos que las necesitan.
Pasos: tarjeta "Configurar productos" → [+ Nueva configuración] → nombre y tipo (texto / número / lista) → opciones si es lista.
Ejemplos: Talla (lista S…XXL), Color (texto), Voltaje (número, V), Material (lista), Peso neto (número, g).

## 7. Usuarios y roles

- **Administrador**: acceso completo (productos, bodegas, usuarios, configuraciones, reportes, exportar, configuración de la app).
- **Operador**: ve productos y stock y registra entradas y salidas; no crea ni elimina productos, no gestiona usuarios ni configuración.

| Permiso | Admin | Operador |
|---|---|---|
| Ver inicio, productos y stock | Sí | Sí |
| Registrar movimientos | Sí | Sí |
| Crear/editar/eliminar productos | Sí | No |
| Crear bodegas | Sí | No |
| Gestionar usuarios | Sí | No |
| Configuración de la app | Sí | No |
| Ver reportes / Exportar Excel | Sí | No |

Ejemplo: el dueño es Administrador; el bodeguero o cajero es Operador.

## 8. Alertas

- **Menor stock**: productos bajo su stock mínimo o en 0. Banner rojo en el inicio; al tocarlo, lista con stock actual vs mínimo.
- **Sin actividad – 7 días**: productos sin ningún movimiento en 7 días. Recordatorio (productos sin rotación, registros pendientes, posibles vencimientos), no error.

## 9. Temas

3 paletas (Forja ámbar, Planta esmeralda, Bunker cian) × 3 niveles de oscuridad (Penumbra, Nocturno, Abismo) = 9 combinaciones. Configuración > Apariencia.

## 10. Panel web

Mismas credenciales que la app. **Solo lectura**: consultar stock, ver alertas, revisar historial, ver reportes y gráficos.
No permite crear/editar productos, registrar movimientos ni gestionar usuarios o bodegas.
Uso: registrar y contar en bodega → app; revisar desde la oficina o mostrar reportes → web. Se sincroniza en segundos.
