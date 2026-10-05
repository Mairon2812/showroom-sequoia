/* Datos del showroom · PROYECTO SEQUOIA 200M2 — SOMOS GROUP */

// Cambia este número por el WhatsApp comercial que atenderá las visitas
const WHATSAPP = "573208429106";
const WA_MSG = encodeURIComponent("Hola, vi la página del PROYECTO SEQUOIA y quiero agendar una visita.");

const ESPACIOS = {
  fachada: {
    nombre: "Fachada al atardecer",
    video: "assets/media-generation-sequoia-fachada-atardecer-0-ad9a8fce-7c24-4d06-9f27-8459ce8eb0d1.mp4",
    img: "assets/sequoia-hero-exterior.png",
    desc: "Volumen contemporáneo de dos niveles en piedra natural y madera, con ventanales que enmarcan el atardecer.",
    ficha: [
      "Revestimiento en fibrocemento alistonado tipo madera",
      "Aluminio negro + vidrio laminado de piso a techo",
      "Celosía modular: privacidad y juego de sombras",
      "Estructura metálica bajo norma NSR-10",
      "Columnas en tubo petrolero de 6\" anticorrosivo",
      "Piscina opcional integrada al volumen"
    ]
  },
  piscina: {
    nombre: "Piscina",
    video: "assets/media-generation-sequoia-fachada-atardecer-0-ad9a8fce-7c24-4d06-9f27-8459ce8eb0d1.mp4",
    img: "assets/sequoia-hero-exterior.png",
    desc: "Piscina integrada al volumen arquitectónico, con solárium en madera y jardinería ornamental alrededor.",
    ficha: [
      "Integrada al volumen arquitectónico",
      "Solárium en madera y solados perimetrales",
      "Jardinería ornamental",
      "Opcional según terreno y decisión del cliente"
    ]
  },
  terraza: {
    nombre: "Terraza BBQ",
    video: "assets/media-generation-sequoia-cocina-isla-bbq-0-117f49d9-538a-4f68-8c0c-96f765964348.mp4",
    img: "assets/interior-cocina-isla-bbq.png",
    desc: "Terraza con zona BBQ conectada a la cocina: espacios sociales continuos para disfrutar en familia.",
    ficha: [
      "Conexión directa con la cocina en isla",
      "Espacios sociales continuos y funcionales",
      "Zona social integrada interior-exterior"
    ]
  },
  sala: {
    nombre: "Sala a doble altura",
    video: "assets/media-generation-sequoia-sala-doble-altura-0-30e3ba5c-0bf8-4c48-988c-c85d408e6179.mp4",
    img: "assets/interior-sala-doble-altura.png",
    desc: "Espacio de gran amplitud con lámpara colgante de lujo y muro principal en piedra, un ambiente imponente y acogedor.",
    ficha: [
      "Doble altura con vacío sobre el primer nivel",
      "Muro principal revestido en piedra natural",
      "Lámpara colgante de lujo",
      "Paredes internas en reboque gris mineral",
      "Ventanas corredizas de piso a techo"
    ]
  },
  cocina: {
    nombre: "Cocina en isla + BBQ",
    video: "assets/media-generation-sequoia-cocina-isla-bbq-0-117f49d9-538a-4f68-8c0c-96f765964348.mp4",
    img: "assets/interior-cocina-isla-bbq.png",
    desc: "Cocina amplia con isla y barra integrada para el comedor, conectada al BBQ para espacios sociales continuos.",
    ficha: [
      "Isla con barra integrada para el comedor",
      "Barra en piedra sinterizada mate de alto desempeño",
      "Conexión directa con la terraza BBQ",
      "Pisos en SPC: apariencia madera y fácil mantenimiento"
    ]
  },
  habitacion: {
    nombre: "Habitación principal",
    video: "assets/media-generation-sequoia-habitacion-principal-0-7d07f1f9-5b3e-48a5-bf79-6dcebe13d81e.mp4",
    img: "assets/interior-habitacion-principal.png",
    desc: "Amplia habitación con ventanales en aluminio negro, iluminación de lujo y espaldar en madera que aporta calidez.",
    ficha: [
      "Vestier y baño privado (segundo nivel)",
      "Grandes ventanales con perfiles en aluminio negro",
      "Espaldar en madera, iluminación de lujo",
      "Pisos en SPC de alta resistencia",
      "Paredes en reboque gris mineral"
    ]
  },
  escaleras: {
    nombre: "Escaleras tipo avión",
    video: "assets/media-generation-sequoia-escaleras-avion-0-a8171668-f2c5-4361-99b8-0bb6232d741b.mp4",
    img: "assets/interior-escaleras-avion.png",
    desc: "Escalera con estructura tipo avión y barandas en vidrio templado: estética ligera, moderna y elegante.",
    ficha: [
      "Estructura tipo avión",
      "Pasos en madera teca: calidez y durabilidad",
      "Baranda en vidrio templado",
      "Pared revestida en piedra natural",
      "Iluminación de cortesía"
    ]
  },
  bano: {
    nombre: "Baño + iluminación cenital",
    video: "assets/media-generation-sequoia-bano-cenital-0-9b54b0ba-4c31-4e26-a6ef-58a5a0467e35.mp4",
    img: "assets/interior-bano-cenital.png",
    desc: "Baño amplio y moderno en tonos claros, con luz cenital por claraboya, lavamanos flotantes y sanitario inteligente.",
    ficha: [
      "Iluminación cenital por claraboya",
      "Lavamanos flotantes y sanitario inteligente",
      "Enchape en porcelanato gran formato",
      "Tonos claros, acabado moderno y continuo"
    ]
  },
  naturaleza: {
    nombre: "Naturaleza integrada",
    video: "assets/media-generation-sequoia-naturaleza-integrada-0-056cfa0c-aac7-48b7-851f-2a54341dc354.mp4",
    img: "assets/interior-naturaleza-integrada.png",
    desc: "Vegetación al interior de la vivienda tras una pantalla de cristal: arquitectura y naturaleza conectadas.",
    ficha: [
      "Pantalla de cristal con estructura y vidrio templado",
      "Paisajismo interno que aporta bienestar",
      "Jardinería ornamental",
      "Conexión interior-exterior en cada ambiente"
    ]
  }
};

// Hotspots sobre la fachada (posición en % sobre la imagen)
const HOTSPOTS = [
  { id: "piscina",    x: 38, y: 74, label: "Piscina" },
  { id: "terraza",    x: 90, y: 50, label: "Terraza BBQ" },
  { id: "sala",       x: 56, y: 40, label: "Sala" },
  { id: "cocina",     x: 22, y: 52, label: "Cocina" },
  { id: "habitacion", x: 74, y: 26, label: "Hab. principal" },
  { id: "escaleras",  x: 63, y: 60, label: "Escaleras" }
];

// Tarjetas de la galería de interiores
const GALERIA = ["habitacion", "escaleras", "cocina", "sala", "bano", "naturaleza"];
