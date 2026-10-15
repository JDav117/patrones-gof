// ============================================================
//  INFRAESTRUCTURA · PedidoRepositorioEnMemoria
//
//  Implementa el puerto PedidoRepositorio guardando los pedidos
//  en un arreglo (se pierden al reiniciar el servidor).
//  Para usar una base de datos real bastaría con crear otro
//  adaptador (ej. PedidoRepositorioMySQL) sin tocar los casos de uso.
// ============================================================

const PedidoRepositorio = require("../../aplicacion/puertos/PedidoRepositorio");

class PedidoRepositorioEnMemoria extends PedidoRepositorio {
  constructor(pedidosIniciales) {
    super();
    this.pedidos = pedidosIniciales;
  }

  listar() {
    return this.pedidos;
  }

  buscarPorId(id) {
    return this.pedidos.find((pedido) => pedido.id === Number(id));
  }

  guardar(pedido) {
    // Si el pedido ya está en la lista, no se agrega de nuevo
    if (!this.pedidos.includes(pedido)) this.pedidos.push(pedido);
  }

  siguienteId() {
    // El número más alto + 1 (14 → 15 → 16...)
    return Math.max(...this.pedidos.map((pedido) => pedido.id)) + 1;
  }

  // Solo para la demo: vuelve a los datos iniciales
  reiniciar(pedidos) {
    this.pedidos = pedidos;
  }
}

module.exports = PedidoRepositorioEnMemoria;
