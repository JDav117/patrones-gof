// ============================================================
//  INFRAESTRUCTURA · Adaptador de ENTRADA: servidor HTTP
//
//  Traduce peticiones HTTP del frontend en llamadas a los casos
//  de uso, y sus resultados en respuestas JSON. No tiene reglas
//  de negocio: solo recibe, delega y responde.
//
//  Rutas (las mismas de las diapositivas):
//    GET  /pedidos                 → ListarPedidos
//    POST /pedidos/:id/duplicar    → DuplicarPedido   (Prototype)
//    POST /pedidos/:id/agregar     → AgregarProducto
//    POST /pedidos/reiniciar       → datos iniciales (solo demo)
//    GET  /config?modo=con|sin     → ConfigApp        (Singleton)
//    POST /pagos                   → PagarPedido      (Adapter)
// ============================================================

const http = require("http");
const fs = require("fs");
const path = require("path");

const RUTA_FRONTEND = path.join(__dirname, "..", "..", "..", "Frontend", "index.html");

/**
 * @param {object} dep Dependencias ya armadas en main.js (casos de uso, adapters...)
 */
function crearServidor(dep) {
  // Le pone un número a cada objeto de configuración distinto, para que
  // el panel muestre "instancia #1, #2...". Es solo para la demo.
  const numeros = { con: new Map(), sin: new Map() };
  const numeroDe = (modo, objeto) => {
    if (!numeros[modo].has(objeto)) numeros[modo].set(objeto, numeros[modo].size + 1);
    return numeros[modo].get(objeto);
  };

  // Cada ruta: [método, patrón de la URL, función que responde]
  const rutas = [
    // ---------- PROTOTYPE ----------
    ["GET", /^\/pedidos$/, () => dep.listarPedidos.ejecutar()],

    ["POST", /^\/pedidos\/(\d+)\/duplicar$/, ([id], body) => {
      const { original, copia } = dep.duplicarPedido.ejecutar(Number(id), body.nota);
      return {
        original,
        copia,
        // Comprobaciones que el panel muestra como ✔
        verificacion: {
          idNuevo: copia.id !== original.id,
          objetosDistintos: copia !== original,
          productosIndependientes: copia.productos !== original.productos,
        },
      };
    }],

    ["POST", /^\/pedidos\/(\d+)\/agregar$/, ([id]) => {
      dep.agregarProducto.ejecutar(Number(id), "Café");
      return dep.listarPedidos.ejecutar();
    }],

    ["POST", /^\/pedidos\/reiniciar$/, () => {
      dep.reiniciarDemo();
      return dep.listarPedidos.ejecutar();
    }],

    // ---------- SINGLETON ----------
    // Pide la configuración DOS veces (a y b) y compara si son el mismo objeto
    ["GET", /^\/config$/, (_, __, query) => {
      const modo = query.get("modo") === "sin" ? "sin" : "con";
      const pedir = modo === "sin"
        ? () => new dep.ConfigAppSinPatron() // sin patrón: un objeto nuevo cada vez
        : () => dep.ConfigApp.getInstance(); // Singleton: siempre el mismo
      const a = pedir();
      const b = pedir();
      return {
        config: a,
        numeroA: numeroDe(modo, a),
        numeroB: numeroDe(modo, b),
        mismaReferencia: a === b,
        totalInstancias: numeros[modo].size,
      };
    }],

    // ---------- ADAPTER ----------
    ["POST", /^\/pagos$/, (_, body) => {
      const proveedor = body.proveedor === "Y" ? "Y" : "X";
      const total = Number(body.total);

      // El caso de uso ya viene armado con su adapter (ver main.js)
      const estado = dep.pagarPedido[proveedor].ejecutar(total);

      // Datos extra para que el panel muestre la traducción paso a paso
      const adapter = dep.adapters[proveedor];
      return {
        proveedor,
        enviadoPorNuestraApp: { total, moneda: dep.config.moneda },
        recibidoPorPasarela: adapter.pasarela.ultimaPeticion,
        respuestaDePasarela: adapter.ultimaRespuesta,
        respuestaNormalizada: estado,
      };
    }],
  ];

  return http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    // La página del frontend
    if (req.method === "GET" && url.pathname === "/") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      return fs.createReadStream(RUTA_FRONTEND).pipe(res);
    }

    // Buscar la ruta que coincide con el método y la URL
    for (const [metodo, patron, manejador] of rutas) {
      const coincide = url.pathname.match(patron);
      if (req.method !== metodo || !coincide) continue;

      try {
        const body = await leerBody(req);
        console.log(`${req.method} ${url.pathname}${url.search}`);
        const parametros = coincide.slice(1); // lo capturado en la URL, ej. el :id
        return enviarJson(res, 200, manejador(parametros, body, url.searchParams));
      } catch (error) {
        return enviarJson(res, 400, { error: error.message });
      }
    }

    enviarJson(res, 404, { error: "Ruta no encontrada" });
  });
}

// Lee el cuerpo JSON de la petición (ej. { "nota": "para mesa 4" })
function leerBody(req) {
  return new Promise((resolve) => {
    let datos = "";
    req.on("data", (trozo) => (datos += trozo));
    req.on("end", () => {
      try { resolve(datos ? JSON.parse(datos) : {}); } catch { resolve({}); }
    });
  });
}

function enviarJson(res, estado, datos) {
  res.writeHead(estado, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(datos));
}

module.exports = crearServidor;
