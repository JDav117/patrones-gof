// ============================================================
//  PROTOTYPE — CON el patrón ✅
//
//  El propio pedido sabe crear una copia de sí mismo con
//  duplicar(). Cada copia es un objeto NUEVO e independiente.
//
//  En la demo organizada: Backend/dominio/Pedido.js
//  Ejecutar:  node Prototype/con-prototype.js
// ============================================================

class Pedido {
  constructor(id, productos, nota) {
    this.id = id;               // número del pedido, ej. 14
    this.productos = productos; // lista, ej. ["Café", "Café", "Sandwich"]
    this.nota = nota;           // indicación del cliente, ej. "sin azúcar"
  }

  // 🔑 PROTOTYPE: devuelve un pedido NUEVO con los mismos datos
  duplicar(nuevoId) {
    return new Pedido(       // "new" crea un objeto nuevo en memoria
      nuevoId,               // la copia recibe su propio número
      [...this.productos],   // "..." crea una lista NUEVA con los mismos productos
                             // (sin esto, la copia y el original compartirían la lista)
      this.nota              // la nota empieza igual; la copia puede cambiarla después
    );
  }

  // Devuelve el pedido como texto para imprimirlo
  mostrar() {
    return `Pedido #${this.id} | ${this.productos.join(", ")} | Nota: ${this.nota}`;
  }
}

console.log("\n=== PROTOTYPE · CON el patrón ===\n");

// ------------------------------------------------------------
// PASO 1: la plantilla
// ------------------------------------------------------------
const pedidoBase = new Pedido(14, ["Café", "Café", "Sandwich"], "sin azúcar");

console.log("1) Tenemos la plantilla \"Desayuno habitual\":");
console.log("     " + pedidoBase.mostrar());

// ------------------------------------------------------------
// PASO 2: copia A → solo cambia la nota
// ------------------------------------------------------------
const copiaA = pedidoBase.duplicar(15);
copiaA.nota = "para mesa 4";

console.log("\n2) Creamos la copia A con   pedidoBase.duplicar(15)");
console.log("   y le cambiamos la nota a \"para mesa 4\".");

// ------------------------------------------------------------
// PASO 3: copia B → cambia la nota y además agrega un producto
// ------------------------------------------------------------
const copiaB = pedidoBase.duplicar(16);
copiaB.nota = "para llevar";
copiaB.productos.push("Jugo"); // push agrega "Jugo" al final de la lista de la copia B

console.log("\n3) Creamos la copia B con   pedidoBase.duplicar(16),");
console.log("   le cambiamos la nota a \"para llevar\" y le agregamos un Jugo.");

// ------------------------------------------------------------
// PASO 4: revisamos los tres pedidos
// ------------------------------------------------------------
console.log("\n4) Resultado:");
console.log("     Plantilla: " + pedidoBase.mostrar());
console.log("     Copia A:   " + copiaA.mostrar());
console.log("     Copia B:   " + copiaB.mostrar());

// ------------------------------------------------------------
// PASO 5: comprobaciones
// "!==" pregunta: ¿son objetos DISTINTOS?
// ------------------------------------------------------------
console.log("\n5) Comprobaciones:");
console.log("     ¿La copia es otro objeto?        pedidoBase !== copiaA →", pedidoBase !== copiaA);
console.log("     ¿Tiene su propia lista?          pedidoBase.productos !== copiaB.productos →", pedidoBase.productos !== copiaB.productos);
console.log("     ¿La plantilla sigue intacta?     nota:", `"${pedidoBase.nota}"`, "· productos:", pedidoBase.productos.length);

console.log("\n✅ ¿Qué ganamos?");
console.log("   · Cada copia es un pedido nuevo: cambiarla no daña la plantilla.");
console.log("   · Quien copia solo llama a duplicar(); no necesita saber qué campos tiene Pedido.");
console.log("   · Si mañana Pedido agrega un campo (ej. mesa), solo se actualiza duplicar().\n");
