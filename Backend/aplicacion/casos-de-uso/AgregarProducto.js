// ============================================================
//  APLICACIÓN · Caso de uso: AgregarProducto
//  Agrega un producto a UN pedido. En la demo sirve para probar
//  que la copia y el original tienen listas independientes.
// ============================================================

class AgregarProducto {
  constructor(repositorio) {
    this.repositorio = repositorio; // un PedidoRepositorio (puerto)
  }

  ejecutar(idPedido, producto) {
    const pedido = this.repositorio.buscarPorId(idPedido);
    if (!pedido) throw new Error(`No existe el pedido #${idPedido}`);

    pedido.agregarProducto(producto); // regla del dominio
    this.repositorio.guardar(pedido);
    return pedido;
  }
}

module.exports = AgregarProducto;
