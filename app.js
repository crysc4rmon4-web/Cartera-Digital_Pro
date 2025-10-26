// ================================
// 💼 CARTERA DIGITAL PRO - v1.1
// Fase 2: Persistencia local básica
// ================================

// 🎯 ELEMENTOS PRINCIPALES DEL DOM
const form = document.getElementById("form-transaccion");
const tablaMovimientos = document.getElementById("tabla-movimientos");
const saldoTotal = document.getElementById("saldo-total");
const ingresosTotal = document.getElementById("ingresos-total");
const gastosTotal = document.getElementById("gastos-total");
const ahorroTotal = document.getElementById("ahorro-total");

// 🧠 DATOS PRINCIPALES DE LA APP
let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
// Esto lee lo que haya guardado en el navegador, o empieza con un array vacío.

// ================================
// 🧮 FUNCIONES PRINCIPALES
// ================================

// 📥 1. Guardar los movimientos en localStorage
function guardarDatos() {
  localStorage.setItem("movimientos", JSON.stringify(movimientos));
}

// 📊 2. Actualizar los totales (ingresos, gastos, ahorro, saldo)
function actualizarTotales() {
  let ingresos = 0, gastos = 0, ahorro = 0;

  movimientos.forEach((m) => {
    if (m.tipo === "ingreso") ingresos += m.monto;
    else if (m.tipo === "gasto") gastos += m.monto;
    else if (m.tipo === "ahorro") ahorro += m.monto;
  });

  // 💰 Cálculos de totales
  const saldo = ingresos - gastos - ahorro;

  // ✍️ Mostrar en pantalla
  ingresosTotal.textContent = `€${ingresos.toFixed(2)}`;
  gastosTotal.textContent = `€${gastos.toFixed(2)}`;
  ahorroTotal.textContent = `€${ahorro.toFixed(2)}`;
  saldoTotal.textContent = `€${saldo.toFixed(2)}`;
}

// 🧾 3. Mostrar los movimientos en la tabla
function renderMovimientos() {
  tablaMovimientos.innerHTML = "";

  if (movimientos.length === 0) {
    tablaMovimientos.innerHTML = `
      <tr>
        <td colspan="5" class="text-secondary fst-italic">
          Aún no hay movimientos registrados 🧾
        </td>
      </tr>`;
    return;
  }

  movimientos.forEach((m, index) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${m.descripcion}</td>
      <td>€${m.monto.toFixed(2)}</td>
      <td>${m.tipo}</td>
      <td>${m.fecha}</td>
      <td>
        <button class="btn btn-sm btn-outline-danger" onclick="eliminarMovimiento(${index})">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    tablaMovimientos.appendChild(fila);
  });
}

// ❌ 4. Eliminar movimiento por índice
function eliminarMovimiento(index) {
  movimientos.splice(index, 1);  // elimina 1 elemento en la posición index
  guardarDatos();
  actualizarTotales();
  renderMovimientos();
}

// ➕ 5. Registrar nueva transacción
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Evita que se recargue la página

  const descripcion = document.getElementById("descripcion").value;
  const monto = parseFloat(document.getElementById("monto").value);
  const tipo = document.getElementById("tipo").value;

  if (!descripcion || !monto || !tipo) return alert("Por favor, completa todos los campos.");

  // 💡 Si el tipo es 'ingreso', calculamos ahorro automático del 10%
  if (tipo === "ingreso") {
    const ahorro10 = monto * 0.1;
    movimientos.push({
      descripcion: "Ahorro automático (10%)",
      monto: ahorro10,
      tipo: "ahorro",
      fecha: new Date().toLocaleDateString(),
    });
  }

  // 🧾 Guardamos el movimiento principal
  movimientos.push({
    descripcion,
    monto,
    tipo,
    fecha: new Date().toLocaleDateString(),
  });

  // 🧠 Actualizamos todo
  guardarDatos();
  actualizarTotales();
  renderMovimientos();
  form.reset();
});

// 🚀 6. Al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  actualizarTotales();
  renderMovimientos();
});

// ================================
// 📊 GRÁFICO DE AHORRO AUTOMÁTICO
// ================================

// Variable global para el gráfico
let graficoAhorro;

// Función para crear o actualizar el gráfico
function actualizarGrafico() {
  const ingresos = movimientos.filter(m => m.tipo === "ingreso").reduce((a, b) => a + b.monto, 0);
  const ahorro = movimientos.filter(m => m.tipo === "ahorro").reduce((a, b) => a + b.monto, 0);
  const gastos = movimientos.filter(m => m.tipo === "gasto").reduce((a, b) => a + b.monto, 0);

  const restante = ingresos - gastos - ahorro;
  const ctx = document.getElementById("graficoAhorro").getContext("2d");

  // Si el gráfico ya existe, lo destruimos para actualizarlo
  if (graficoAhorro) graficoAhorro.destroy();

  graficoAhorro = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Ahorro", "Gastos", "Saldo restante"],
      datasets: [{
        data: [ahorro, gastos, restante > 0 ? restante : 0],
        backgroundColor: [
          "rgba(255, 206, 86, 0.8)", // amarillo para ahorro
          "rgba(255, 99, 132, 0.8)", // rojo para gastos
          "rgba(75, 192, 192, 0.8)"  // verde agua para saldo
        ],
        borderWidth: 1,
        hoverOffset: 10
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: { color: "#fff", font: { size: 14 } },
          position: "bottom"
        }
      },
      cutout: "70%",
    }
  });
}

// Modificamos la parte final de DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  actualizarTotales();
  renderMovimientos();
  actualizarGrafico(); // <-- añadimos esto
});

// También actualizamos el gráfico cada vez que se modifiquen los datos
function actualizarTodo() {
  guardarDatos();
  actualizarTotales();
  renderMovimientos();
  actualizarGrafico();
}

// Y reemplazamos donde antes tenías guardarDatos + render + actualizarTotales por:
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const descripcion = document.getElementById("descripcion").value;
  const monto = parseFloat(document.getElementById("monto").value);
  const tipo = document.getElementById("tipo").value;

  if (!descripcion || !monto || !tipo) return alert("Por favor, completa todos los campos.");

  if (tipo === "ingreso") {
    const ahorro10 = monto * 0.1;
    movimientos.push({
      descripcion: "Ahorro automático (10%)",
      monto: ahorro10,
      tipo: "ahorro",
      fecha: new Date().toLocaleDateString(),
    });
  }

  movimientos.push({
    descripcion,
    monto,
    tipo,
    fecha: new Date().toLocaleDateString(),
  });

  actualizarTodo();
  form.reset();
});
