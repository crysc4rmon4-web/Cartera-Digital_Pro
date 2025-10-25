// --------------------------
// Variables globales
// --------------------------
let movimientos = []; // Array de transacciones
let saldo = 0;
let ingresos = 0;
let gastos = 0;
let ahorro = 0;

// --------------------------
// Frases motivacionales aleatorias
// --------------------------
const frases = [
  "“Tu dinero trabaja mejor cuando tú descansas.” 😎",
  "“Cada euro ahorrado es un paso hacia tu libertad financiera.” 💡",
  "“Ahorra primero, gasta después, disfruta siempre.” 🏦",
  "“Un pequeño hábito hoy, grandes resultados mañana.” 🚀"
];

function mostrarFrase() {
  const fraseElemento = document.getElementById("frase-motivacional");
  const aleatoria = frases[Math.floor(Math.random() * frases.length)];
  fraseElemento.textContent = aleatoria;
}

// Ejecutar al cargar la página
mostrarFrase();

// --------------------------
// Función para actualizar resumen
// --------------------------
function actualizarResumen() {
  document.getElementById("saldo-total").textContent = saldo.toFixed(2);
  document.getElementById("ingresos-total").textContent = ingresos.toFixed(2);
  document.getElementById("gastos-total").textContent = gastos.toFixed(2);
  document.getElementById("ahorro-total").textContent = ahorro.toFixed(2);
}

// --------------------------
// Función para añadir transacción
// --------------------------
document.getElementById("form-transaccion").addEventListener("submit", function (e) {
  e.preventDefault();

  const descripcion = document.getElementById("descripcion").value;
  const monto = parseFloat(document.getElementById("monto").value);
  const tipo = document.getElementById("tipo").value;
  const divisa = document.getElementById("divisa").value;
  const fecha = new Date().toLocaleDateString();

  if (!descripcion || !monto || !tipo) return;

  // Ajuste según tipo
  if (tipo === "ingreso") {
    ingresos += monto;
    saldo += monto;
    ahorro += monto * 0.10; // 10% ahorro
    saldo -= monto * 0.10; // descuento directo del ahorro
  } else if (tipo === "gasto") {
    gastos += monto;
    saldo -= monto;
  }

  // Añadir al historial
  movimientos.push({ descripcion, monto, tipo, fecha, divisa });

  // Actualizar tabla
  const tbody = document.getElementById("tabla-movimientos");
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${descripcion}</td>
    <td>${monto.toFixed(2)} ${divisa}</td>
    <td>${tipo}</td>
    <td>${fecha}</td>
    <td><button class="btn btn-sm btn-danger btn-eliminar">Eliminar</button></td>
  `;
  tbody.appendChild(fila);

  // Eliminar mensaje "no hay movimientos"
  if (movimientos.length === 1) {
    tbody.querySelector("tr").remove();
  }

  actualizarResumen();

  // Limpiar formulario
  this.reset();
});

// --------------------------
// Eliminar movimiento
// --------------------------
document.getElementById("tabla-movimientos").addEventListener("click", function(e) {
  if (e.target.classList.contains("btn-eliminar")) {
    const fila = e.target.closest("tr");
    const index = Array.from(this.rows).indexOf(fila) - 1; // Ajuste por header
    const mov = movimientos[index];

    // Ajustar totales
    if (mov.tipo === "ingreso") {
      ingresos -= mov.monto;
      saldo -= mov.monto;
      ahorro -= mov.monto * 0.10;
      saldo += mov.monto * 0.10;
    } else if (mov.tipo === "gasto") {
      gastos -= mov.monto;
      saldo += mov.monto;
    }

    movimientos.splice(index, 1);
    fila.remove();
    actualizarResumen();

    if (movimientos.length === 0) {
      this.innerHTML = `<tr><td colspan="5" class="text-secondary fst-italic">Aún no hay movimientos registrados 🧾</td></tr>`;
    }
  }
});
