// ============================================================
//  DOMINIO · Pedido
//
//  Capa central de la arquitectura hexagonal: aquí viven las
//  reglas del negocio de la cafetería. Esta clase NO conoce
//  HTTP, el frontend, ni la base de datos.
//
//  Patrón GoF aplicado aquí: PROTOTYPE → método duplicar()
// ============================================================

class Pedido {
  /**
   * @param {number}   id        Número del pedido. Ej: 14
   * @param {string[]} productos Lista de productos. Ej: ["Café", "Café", "Sandwich"]
   * @param {string}   nota      Indicación del cliente. Ej: "sin azúcar"
   */
  constructor(id, productos, nota) {
    this.id = id;
    this.productos = productos;
    this.nota = nota;
  }

  // ----------------------------------------------------------
  // PROTOTYPE: el propio pedido sabe crear una copia de sí mismo.
  // Quien lo use solo llama a duplicar(); no necesita conocer
  // los campos internos del pedido.
  // ----------------------------------------------------------
  duplicar(nuevoId) {
    return new Pedido(
      nuevoId,             // la copia recibe su propio número
      [...this.productos], // "..." crea una lista NUEVA con los mismos productos
                           // (si pasáramos this.productos, ambos compartirían la lista)
      this.nota            // la nota empieza igual; luego la copia puede cambiarla
    );
  }

  // Agrega un producto SOLO a este pedido
  agregarProducto(producto) {
    this.productos.push(producto);
  }
}

module.exports = Pedido;
