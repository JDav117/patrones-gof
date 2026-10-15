# ☕ Cafetería GoF · Prototype · Singleton · Adapter

Ejemplos prácticos de la exposición de Programación Avanzada. Caso: un sistema de pedidos para una cafetería.
Lenguaje: **JavaScript (Node.js)**, sin dependencias. No hace falta `npm install`.

## Estructura

El proyecto tiene dos partes:

1. **Ejemplos de consola** (`Prototype/`, `Singleton/`, `Adapter/`): cada patrón en un solo archivo, con una versión **sin** y otra **con** el patrón. Son para explicar la idea en la terminal.
2. **Demo con frontend** (`Backend/` + `Frontend/`): los tres patrones dentro de una app organizada con **arquitectura hexagonal**.

```
Prototype/
  sin-prototype.js        ❌ copia = original → se daña el pedido original
  con-prototype.js        ✅ pedido.duplicar() → copias independientes
Singleton/
  sin-singleton.js        ❌ new ConfigApp() dos veces → dos configuraciones
  con-singleton.js        ✅ ConfigApp.getInstance() → una sola configuración
Adapter/
  sin-adapter.js          ❌ el caso de uso tiene un "if" por cada pasarela
  con-adapter.js          ✅ PagoPort + PagoXAdapter / PagoYAdapter

Backend/                                  ← arquitectura hexagonal
  dominio/
    Pedido.js                             PROTOTYPE: duplicar()
  aplicacion/
    puertos/
      PagoPort.js                         contrato de pagos (lo implementan los adapters)
      PedidoRepositorio.js                contrato para guardar/buscar pedidos
    casos-de-uso/
      ListarPedidos.js
      DuplicarPedido.js                   decide cuándo clonar y guarda la copia
      AgregarProducto.js
      PagarPedido.js                      recibe un PagoPort y la ConfigApp
  infraestructura/
    configuracion/
      ConfigApp.js                        SINGLETON: getInstance()
      ConfigAppSinPatron.js               solo para comparar en el panel
    pagos/
      PasarelaX.js, PasarelaY.js          proveedores externos simulados
      PagoXAdapter.js, PagoYAdapter.js    ADAPTER: traducen al formato de cada pasarela
    persistencia/
      PedidoRepositorioEnMemoria.js       implementa PedidoRepositorio
    http/
      servidor.js                         adaptador de entrada: rutas de la API
  main.js                                 composición: crea y conecta todas las piezas

Frontend/
  index.html                              panel de demostración (los 3 patrones)
```

### Dónde vive cada patrón (diapositiva 18)

| Patrón | Archivo principal | Capa | Diapositiva |
|---|---|---|---|
| Prototype | `Backend/dominio/Pedido.js` → `duplicar()` | Dominio; lo coordina `DuplicarPedido` (aplicación) | 8 |
| Singleton | `Backend/infraestructura/configuracion/ConfigApp.js` | Infraestructura; `main.js` lo inyecta a `PagarPedido` | 12 |
| Adapter | `Backend/infraestructura/pagos/PagoXAdapter.js` | Infraestructura; implementa `PagoPort` (aplicación) | 15 |

**Regla de la hexagonal:** las dependencias apuntan hacia adentro. `dominio/` no importa nada, `aplicacion/` solo usa el dominio y sus puertos, e `infraestructura/` implementa esos puertos. Solo `main.js` conoce todas las piezas.

## Cómo ejecutar

En la terminal de VS Code, desde la carpeta del proyecto:

| Qué | Comando |
|---|---|
| Prototype sin / con | `npm run prototype:sin` · `npm run prototype:con` |
| Singleton sin / con | `npm run singleton:sin` · `npm run singleton:con` |
| Adapter sin / con | `npm run adapter:sin` · `npm run adapter:con` |
| Los 6 ejemplos seguidos | `npm run ejemplos` |
| Demo con frontend | `npm run demo` → abrir http://localhost:3000 |

> También sirve `node Prototype/con-prototype.js`, etc.
> Para ver el frontend **dentro de VS Code**: `Ctrl + Shift + P` → **Simple Browser: Show** → `http://localhost:3000`.
> Para detener el servidor: `Ctrl + C` en la terminal.
> En el panel, las teclas **1**, **2** y **3** cambian de patrón. También puedes abrir uno directo: `http://localhost:3000/#singleton`.
> Las fuentes se cargan de Google Fonts; sin internet el panel funciona igual con las fuentes del sistema.

## Guion sugerido

Para cada patrón: **1)** correr el `sin-` y mostrar el problema → **2)** correr el `con-` y mostrar la diferencia → **3)** mostrar dónde quedó en `Backend/` → **4)** probarlo en el frontend.

Cada ejemplo de consola se explica solo: imprime los pasos numerados y al final un resumen ("¿Qué pasó?" o "¿Qué ganamos?").

### 1. Prototype — duplicar pedidos
- **sin:** `const copia = pedidoBase` no copia nada: las dos variables apuntan al mismo pedido. Al cambiar la nota de la "copia", el original también cambia.
- **con:** la clave es `duplicar()`, que devuelve un `new Pedido(...)` con los mismos datos. `[...this.productos]` crea una lista nueva, así agregar "Jugo" a la copia no toca el original.
- **backend:** `dominio/Pedido.js` sabe **cómo** copiarse; `aplicacion/casos-de-uso/DuplicarPedido.js` decide **cuándo**, le da número y la guarda.
- **frontend:** "Duplicar pedido" → aparece el #015 y la barra de resultado lo confirma. "+1 Café" en la copia → la plantilla **no** cambia.

### 2. Singleton — una sola configuración
- **sin:** "Cargando configuración..." sale **2 veces** y `===` da `false`. Si pagos cambia el impuesto, pedidos no se entera: hay dos configuraciones.
- **con:** la única diferencia es `new ConfigApp()` → `ConfigApp.getInstance()`. "Cargando configuración..." sale **1 vez** y `===` da `true`.
- **backend:** `main.js` pide `ConfigApp.getInstance()` **una vez** y se la pasa a `PagarPedido` por el constructor (inyección de dependencias). Al arrancar `npm run demo`, en la terminal se ve "Cargando configuración" una sola vez.
- **frontend:** con "Con Singleton" seleccionado, "Pedir configuración" varias veces → las dos flechas llegan siempre a **ConfigApp #1**. Cambiar a "Sin patrón" → cada servicio apunta a su propia caja y el número crece.
- **riesgo (diapositiva 10):** el paso 4 de `con-singleton.js` muestra que si alguien cambia el impuesto, cambia para todos. Es estado global; por eso conviene para datos que no cambian.

### 3. Adapter — pasarela de pagos
- **sin:** `PagarPedido` tiene un `if` por pasarela y hace las conversiones él mismo (centavos, texto, "succeeded"...). Una pasarela nueva = modificar el caso de uso.
- **con:** `PagarPedido` solo conoce `PagoPort.autorizar({ total, moneda })`. `PagoXAdapter` traduce `25 → 2500 centavos` y `"succeeded" → "APROBADO"`. Una pasarela nueva = crear otro adapter; `PagarPedido` no se toca.
- **backend:** la cadena de la diapositiva 15 en archivos reales: `casos-de-uso/PagarPedido.js` → `puertos/PagoPort.js` → `pagos/PagoXAdapter.js` → `pagos/PasarelaX.js`.
- **frontend:** "Procesar pago" con $25 → APROBADO y se ven los 4 pasos de la traducción. Cambiar a Pasarela Y → cambia lo que recibe la pasarela, pero nuestra app recibe lo mismo. Con $150 → RECHAZADO.

## Posibles preguntas

- **¿Por qué `PagoPort` es una clase y no una interfaz?** JavaScript no tiene interfaces. Usamos una clase base cuyo método lanza un error si un adapter olvida implementarlo. En Java o C# sería `interface PagoPort`.
- **¿Qué impide hacer `new ConfigApp()` en el Singleton?** En JavaScript, nada. En Java o C# el constructor se haría `private` para obligar a usar `getInstance()`.
- **¿Por qué el Singleton está en infraestructura y no en el dominio?** Porque el acceso global acopla y dificulta las pruebas. Se crea en la composición (`main.js`) y se inyecta a quien lo necesite (diapositiva 12).
- **¿Por qué hay un `PedidoRepositorio`?** Es otro puerto de la hexagonal: los casos de uso guardan pedidos sin saber si es memoria o una base de datos. Hoy es `PedidoRepositorioEnMemoria`; mañana podría ser MySQL sin tocar los casos de uso.
