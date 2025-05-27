const lugaresData = [
  {
    id: 1,
    nombre: "Cascada del Xurbeo",
    lat: 43.2833,
    lng: -5.9167,
    tipo: "cascadas",
    icono: "../img/icons/agua.svg", 
    descripcion: "Una cascada escondida en los Picos de Europa.",
  },
  {
    id: 2,
    nombre: "Mirador de Peña Ubiña",
    lat: 43.0167,
    lng: -5.9167,
    tipo: "miradores",
    icono: "../img/icons/mirador.svg",
    descripcion: "Vista panorámica única de la cordillera cantábrica.",
  },
  {
    id: 3,
    nombre: "Pueblo de Bermiego",
    lat: 43.3167,
    lng: -6.0833,
    tipo: "pueblos",
    icono: "../img/icons/pueblo.svg",
    descripcion: "Pueblo medieval perfectamente conservado.",
  },
  {
    id: 4,
    nombre: "Playa de Gulpiyuri",
    lat: 43.4667,
    lng: -4.9167,
    tipo: "senderos",
    icono: "../img/icons/playa.svg",
    descripcion: "Playa pequeña y escondida entre prados verdes.",
  },
  {
    id: 5,
    nombre: "Cueva de Tito Bustillo",
    lat: 43.4667,
    lng: -5.0667,
    tipo: "cuevas",
    icono: "../img/icons/hoja.svg",
    descripcion: "Arte rupestre paleolítico en una cueva poco conocida.",
  },
  {
    id: 6,
    nombre: "Bosque de Muniellos",
    lat: 43.0667,
    lng: -6.6333,
    tipo: "senderos",
    icono: "../img/icons/bosque.svg",
    descripcion: "Robledal mejor conservado de España.",
  },
];

let mapa;
let marcadores = [];
let filtroActual = "todos";

function inicializarMapa() {
  mapa = L.map("map").setView([43.3614, -5.8593], 9);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(mapa);
  cargarMarcadores();
}

function cargarMarcadores() {
  marcadores.forEach((m) => mapa.removeLayer(m));
  marcadores = [];

  const lugaresFiltrados =
    filtroActual === "todos"
      ? lugaresData
      : lugaresData.filter((l) => l.tipo === filtroActual);
  lugaresFiltrados.forEach((lugar) => {
    const marcador = L.marker([lugar.lat, lugar.lng]).addTo(mapa).bindPopup(`
                <img src="${lugar.icono}" alt="${lugar.tipo}" style="width:24px; vertical-align:middle; margin-right:6px;">
                <strong>${lugar.nombre}</strong><br>${lugar.descripcion}
              `);
    marcador.on("click", () => seleccionarLugar(lugar.id));
    marcadores.push(marcador);
  });
  mostrarLugares(lugaresFiltrados);
}

function mostrarLugares(lugares) {
  const grid = document.getElementById("placesGrid");
  grid.innerHTML = "";
  lugares.forEach((l) => {
    const card = document.createElement("div");
    card.className = "col";
    card.innerHTML = `
            <div class="card place-card" onclick="seleccionarLugar(${l.id})">
                <div class="card-body">
<h5 class="card-title">
  <img src="${l.icono}" alt="${l.tipo}" style="width:24px; vertical-align:middle; margin-right:6px;">
  ${l.nombre}
</h5>                    <p class="card-text">${l.descripcion}</p>
                </div>
            </div>
        `;
    grid.appendChild(card);
  });
}

function aplicarFiltro(tipo) {
  filtroActual = tipo;
  document
    .querySelectorAll("[data-filter]")
    .forEach((btn) => btn.classList.remove("active"));
  document.querySelector(`[data-filter="${tipo}"]`).classList.add("active");
  cargarMarcadores();
}

function seleccionarLugar(id) {
  const lugar = lugaresData.find((l) => l.id === id);
  if (lugar) mapa.setView([lugar.lat, lugar.lng], 12);
}

function buscarLugares() {
  const termino = document.getElementById("searchInput").value.toLowerCase();
  const lugaresFiltrados = lugaresData.filter(
    (l) =>
      l.nombre.toLowerCase().includes(termino) ||
      l.descripcion.toLowerCase().includes(termino)
  );
  mostrarLugares(lugaresFiltrados);
}

document.addEventListener("DOMContentLoaded", inicializarMapa);
