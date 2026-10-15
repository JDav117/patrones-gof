// ============================================================
//  APLICACIÓN · Caso de uso: ListarPedidos
//  Devuelve todos los pedidos registrados.
// ============================================================

class ListarPedidos {
  constructor(repositorio) {
    this.repositorio = repositorio; // un PedidoRepositorio (puerto)
  }

  ejecutar() {
    return this.repositorio.listar();
  }
}

module.exports = ListarPedidos;
