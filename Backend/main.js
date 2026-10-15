// ============================================================
//  MAIN · Composición de la aplicación (punto de arranque)
//
//  Aquí, y solo aquí, se crean las piezas y se conectan entre sí
//  (inyección de dependencias). Las demás clases nunca hacen
//  "new" de sus dependencias: las reciben en el constructor.
//
//  Ejecutar:  npm run demo   →   http://localhost:3000
// ============================================================

// ----- Dominio ------------------------------------------------
const Pedido = require("./dominio/Pedido");

// ----- Aplicación: casos de uso -------------------------------
const ListarPedidos = require("./aplicacion/casos-de-uso/ListarPedidos");
const DuplicarPedido = require("./aplicacion/casos-de-uso/DuplicarPedido");
const AgregarProducto = require("./aplicacion/casos-de-uso/AgregarProducto");
const PagarPedido = require("./aplicacion/casos-de-uso/PagarPedido");

// ----- Infraestructura: adaptadores ---------------------------
const ConfigApp = require("./infraestructura/configuracion/ConfigApp");
const ConfigAppSinPatron = require("./infraestructura/configuracion/ConfigAppSinPatron");
const PedidoRepositorioEnMemoria = require("./infraestructura/persistencia/PedidoRepositorioEnMemoria");
const PasarelaX = require("./infraestructura/pagos/PasarelaX");
const PasarelaY = require("./infraestructura/pagos/PasarelaY");
const PagoXAdapter = require("./infraestructura/pagos/PagoXAdapter");
const PagoYAdapter = require("./infraestructura/pagos/PagoYAdapter");
const crearServidor = require("./infraestructura/http/servidor");

console.log("\n☕ Iniciando Cafetería GoF...");

// 1. SINGLETON: se pide la configuración una sola vez y se comparte
const config = ConfigApp.getInstance();

// 2. Persistencia: el pedido #14 "Desayuno habitual" es la plantilla
const datosIniciales = () => [new Pedido(14, ["Café", "Café", "Sandwich"], "sin azúcar")];
const repositorio = new PedidoRepositorioEnMemoria(datosIniciales());

// 3. ADAPTER: cada pasarela externa queda envuelta en su adapter
const adapters = {
  X: new PagoXAdapter(new PasarelaX()),
  Y: new PagoYAdapter(new PasarelaY()),
};

// 4. Casos de uso: reciben sus dependencias por el constructor
const dependencias = {
  listarPedidos: new ListarPedidos(repositorio),
  duplicarPedido: new DuplicarPedido(repositorio),
  agregarProducto: new AgregarProducto(repositorio),
  pagarPedido: {
    X: new PagarPedido(adapters.X, config), // mismo caso de uso...
    Y: new PagarPedido(adapters.Y, config), // ...con otro adapter
  },

  // Extras que usa el panel para sus comparaciones
  config,
  adapters,
  ConfigApp,
  ConfigAppSinPatron,
  reiniciarDemo: () => repositorio.reiniciar(datosIniciales()),
};

// 5. Adaptador de entrada: el servidor HTTP que atiende al frontend
const PUERTO = process.env.PORT || 3000; // se puede cambiar con la variable PORT
crearServidor(dependencias).listen(PUERTO, () => {
  console.log(`☕ Demo lista en http://localhost:${PUERTO}\n`);
});
