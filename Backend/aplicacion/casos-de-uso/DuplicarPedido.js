// ============================================================
//  APLICACIÓN · Caso de uso: DuplicarPedido
//
//  Usa el patrón PROTOTYPE del dominio. Reparto de tareas
//  (diapositiva 8):
//    · Dominio     → Pedido.duplicar() sabe CÓMO copiarse.
//    · Aplicación  → este caso de uso decide CUÁNDO copiar,
//                    qué número darle y lo guarda.
// ============================================================

class DuplicarPedido {
  constructor(repositorio) {
    this.repositorio = repositorio; // un PedidoRepositorio (puerto)
  }

  /**
   * @param {number} idOriginal Pedido que sirve de modelo. Ej: 14
   * @param {string} [nota]     Nota opcional para la copia. Ej: "para mesa 4"
   */
  ejecutar(idOriginal, nota) {
    // 1. Buscar el pedido modelo
    const original = this.repositorio.buscarPorId(idOriginal);
    if (!original) throw new Error(`No existe el pedido #${idOriginal}`);

    // 2. PROTOTYPE: pedirle al pedido que se copie a sí mismo
    const copia = original.duplicar(this.repositorio.siguienteId());

    // 3. Personalizar la copia (el original no se toca)
    if (nota) copia.nota = nota;

    // 4. Guardar la copia como un pedido nuevo
    this.repositorio.guardar(copia);

    return { original, copia };
  }
}

module.exports = DuplicarPedido;
