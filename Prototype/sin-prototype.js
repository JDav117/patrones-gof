// ============================================================
//  PROTOTYPE — SIN el patrón ❌
//
//  Situación: la cafetería tiene un pedido frecuente, el
//  "Desayuno habitual". Queremos un pedido igual para la mesa 4
//  sin tener que armarlo desde cero.
//
//  Ejecutar:  node Prototype/sin-prototype.js
// ============================================================

// Un pedido tiene número, lista de productos y una nota
class Pedido {
  constructor(id, productos, nota) {
    this.id = id;               // número del pedido, ej. 14
    this.productos = productos; // lista, ej. ["Café", "Café", "Sandwich"]
    this.nota = nota;           // indicación del cliente, ej. "sin azúcar"
  }

  // Devuelve el pedido como texto para imprimirlo
  mostrar() {
    return `Pedido #${this.id} | ${this.productos.join(", ")} | Nota: ${this.nota}`;
  }
}

console.log("\n=== PROTOTYPE · SIN el patrón ===\n");

// ------------------------------------------------------------
// PASO 1: la plantilla que queremos reutilizar
// ------------------------------------------------------------
const pedidoBase = new Pedido(14, ["Café", "Café", "Sandwich"], "sin azúcar");

console.log("1) Tenemos la plantilla \"Desayuno habitual\":");
console.log("     " + pedidoBase.mostrar());

// ------------------------------------------------------------
// PASO 2: intentamos "copiarla" con el signo =
// ❌ El = NO crea un pedido nuevo. Crea otra variable que apunta
//    al MISMO objeto en memoria (copia la referencia, no el objeto).
// ------------------------------------------------------------
const copia = pedidoBase;

copia.id = 15;              // queremos que la copia sea el pedido #15...
copia.nota = "para mesa 4"; // ...y que tenga otra nota

console.log("\n2) La copiamos con   const copia = pedidoBase;");
console.log("   y a la copia le ponemos el número 15 y la nota \"para mesa 4\".");

// ------------------------------------------------------------
// PASO 3: revisamos los dos pedidos
// "===" pregunta: ¿las dos variables son EL MISMO objeto?
// ------------------------------------------------------------
console.log("\n3) Resultado:");
console.log("     Original: " + pedidoBase.mostrar());
console.log("     Copia:    " + copia.mostrar());
console.log("     ¿pedidoBase === copia? →", pedidoBase === copia);

console.log("\n😱 ¿Qué pasó?");
console.log("   Al cambiar la copia también cambió el original, porque son el MISMO pedido.");
console.log("   Perdimos la plantilla: ya no existe el pedido #14 \"sin azúcar\".");
console.log("\n👉 Solución: que el pedido sepa crear una copia de sí mismo (con-prototype.js).\n");
