// ==============================
// VARIABLES GLOBALES
// ==============================

// Totales
let totalIngresos = 0;
let totalGastos = 0;
let totalAhorros = 0;

// Referencias DOM
const descripcionInput = document.getElementById("descripcion");
const montoInput = document.getElementById("monto");
const tipoInput = document.getElementById("tipo");
const divisaInput = document.getElementById("divisa");
const ahorroCalculado = document.getElementById("ahorro-calculado");
const historial = document.getElementById("tabla-movimientos");
const fraseMotivacional = document.getElementById("frase-motivacional");

// ==============================
// FRASES MOTIVACIONALES
// ==============================
const frases = [
  "Cada euro cuenta, pero la constancia vale más 💪",
  "Ahorra hoy para disfrutar mañana 🌅",
  "Tu futuro financiero empieza con un clic 🏦",
  "Controlar tus gastos es controlar tu libertad 💼",
  "El mejor momento para empezar fue ayer. El segundo mejor, hoy ⏰",
  "Tu cartera digital, tu tranquilidad 💖",
  "No ahorres lo que te queda después de gastar; gasta lo que te queda después de ahorrar 💡",
  "Pequeños pasos crean grandes logros 🚀",
  "Domina tu dinero, no dejes que él te domine 🔥",
  "Cada decisión cuenta. Haz que sume 📈"
];

function mostrarFrase() {
  const indice = Math.floor(Math.random() * frases.length);
  fraseMotivacional.textContent = frases[indice];
}
mostrarFrase();

// ==============================
// GRÁFICOS CHART.JS
// ==============================
const ctxBalance = document.getElementById("graficoBalance").getContext("2d");
const ctxAhorro = document.getElementById("graficoAhorro").getContext("2d");

// Gráfico Balance general
const graficoBalance = new Chart(ctxBalance, {
  type: "doughnut",
  data: {
    labels: ["Ingresos", "Gastos", "Ahorros"],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ["#198754", "#dc3545", "#ffc107"], // verde, rojo, amarillo
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: { display: true, text: "Balance Financiero", font: { size: 16 }, color: "#fff" }
    }
  }
});

// Gráfico Progreso de ahorro
const graficoAhorro = new Chart(ctxAhorro, {
  type: "bar",
  data: {
    labels: ["Ahorro (10%)"],
    datasets: [{
      label: "Ahorro acumulado",
      data: [0],
      backgroundColor: ["#0dcaf0"]
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Progreso de Ahorro", font: { size: 16 }, color: "#fff" }
    },
    scales: {
      y: { beginAtZero: true }
    }
  }
});

// ==============================
// FUNCIONES PRINCIPALES
// ==============================

// Actualiza el campo de ahorro automáticamente al 10% de ingresos
montoInput.addEventListener("input", () => {
  const monto = parseFloat(montoInput.value) || 0;
  ahorroCalculado.value = (monto * 0.1).toFixed(2);
});

// Agregar nueva transacción
document.getElementById("form-transaccion").addEventListener("submit", e => {
  e.preventDefault();

  const descripcion = descripcionInput.value.trim();
  const monto = parseFloat(montoInput.value);
  const tipo = tipoInput.value;
  const divisa = divisaInput.value;

  if (!descripcion || isNaN(monto) || monto <= 0 || !tipo) {
    alert("Por favor, completa todos los campos correctamente.");
    return;
  }

  // Actualizar totales
  if (tipo === "ingreso") totalIngresos += monto;
  if (tipo === "gasto") totalGastos += monto;
  totalAhorros = totalIngresos * 0.1; // ahorro 10%

  // Crear fila en tabla
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${descripcion}</td>
    <td>${monto.toFixed(2)} ${divisa}</td>
    <td>${tipo}</td>
    <td>${new Date().toLocaleDateString()}</td>
    <td>
      <button class="btn btn-sm btn-outline-danger">Eliminar</button>
    </td>
  `;
  historial.prepend(fila);

  // Limpiar inputs
  descripcionInput.value = "";
  montoInput.value = "";
  tipoInput.value = "";
  ahorroCalculado.value = (totalIngresos * 0.1).toFixed(2);

  // Actualizar gráficos
  actualizarGraficos();
});

// Función que actualiza los gráficos
function actualizarGraficos() {
  // Doughnut
  graficoBalance.data.datasets[0].data = [totalIngresos, totalGastos, totalAhorros];
  graficoBalance.update();

  // Bar
  graficoAhorro.data.datasets[0].data = [totalAhorros];
  graficoAhorro.update();
}
