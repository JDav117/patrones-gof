// ============================================================
//  APLICACIÓN · Puerto de salida: PedidoRepositorio
//
//  Contrato para guardar y buscar pedidos. A los casos de uso
//  no les importa si detrás hay memoria, MySQL o MongoDB: solo
//  usan estos métodos.
//
//  Implementación actual: infraestructura/persistencia/PedidoRepositorioEnMemoria.js
// ============================================================

class PedidoRepositorio {
  listar() { throw new Error("listar() debe implementarlo un adaptador"); }
  buscarPorId(id) { throw new Error("buscarPorId() debe implementarlo un adaptador"); }
  guardar(pedido) { throw new Error("guardar() debe implementarlo un adaptador"); }
  siguienteId() { throw new Error("siguienteId() debe implementarlo un adaptador"); }
}

module.exports = PedidoRepositorio;
