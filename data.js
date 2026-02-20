
// data.js — Catálogo + Promos con precios (PYG)
(function () {
  // data.js — fragmento para rutas y promos en "Menu/"
const BASE_IMG   = "";  // SIEMPRE con "/"
const PROMOS_DIR = "";        // tu carpeta actual de imágenes

// helper opcional (asegura join correcto y encoding)
const promoImg = (file) => BASE_IMG + PROMOS_DIR + encodeURIComponent(file);

  function imgTag(srcRel, alt) {
    const parts = String(srcRel || '').split('/').filter(Boolean);
    const encodedPath = parts.map(p => encodeURIComponent(p)).join('/');
    const src = BASE_IMG + encodedPath;
    const safeAlt = String(alt || '').trim() || 'Producto';
    return `<img src="${src}" alt="${safeAlt}" loading="lazy" decoding="async">`;
  }

  const DESC_DEFAULT = 'Pan ciabatta artesanal, mix de hojas, tomate, queso y aderezo de la casa.';
  function product(o) {
    return {
      id: String(o.id),
      nombre: String(o.nombre || ""),
      desc: String(o.desc || DESC_DEFAULT),
      precio: Number(o.precio) || 0,
      categoria: String(o.categoria || "Otros"),
      tags: Array.isArray(o.tags) ? o.tags.map(String) : [],
      img: typeof o.img === "string" && !o.img.trim().startsWith("<") ? imgTag(o.img, o.nombre) : (o.img || ""),
      disponible: (o.disponible !== false),
      stock: (typeof o.stock === 'number' ? o.stock : -1),
      validDays: Array.isArray(o.validDays) ? o.validDays.map(Number) : [1,2,3,4,5,6],
      validHours: (typeof o.validHours === 'string' ? o.validHours : "12:00-21:00")
    };
  }

  // === Sándwiches === (se mantiene igual que tu última versión resumida)
 const sabores = [
  product({ id: 's_pas', nombre: 'Pastrami', precio: 28000, categoria: 'Sandwiches', img: 'Pastrami.png', tags: ['Nuevo'] }),
  product({ id: 's_cia_art', nombre: 'Ciabatta artesanal', precio: 21000, categoria: 'Sandwiches', img: 'Ciabatta artesanal.png' }),
  product({ id: 's_des_vac', nombre: 'Desmechados de Vacío', precio: 26000, categoria: 'Sandwiches', img: 'Desmechados de Vacío.png', desc: 'Pan ciabatta de masa madre artesanal, mayonesa casera, desmechado de carne; a elección salsa criolla levemente picante o barbacoa ahumada.', tags: ['Artesanal'] }),
  product({ id: 's_tortu_poll', nombre: 'Tortuguita de pollo', precio: 19000, categoria: 'Sandwiches', img: 'tortuguita de pollo.png' }),
  product({ id: 's_baguette_fr', nombre: 'Baguette francés', precio: 20000, categoria: 'Sandwiches', img: 'baguette francés.png' }),
  product({ id: 's_nembo_it', nombre: 'Ñembo Italiano', precio: 25000, categoria: 'Sandwiches', img: 'Ñembo Italiano.png', desc: 'Aceite de oliva, pesto clásico, jamón crudo vacuno, tomate cherry confitado, muzzarella, parmesano y rúcula.', tags: ['Clásico'] }),
  product({ id: 's_med', nombre: 'Mediterráneo', precio: 24000, categoria: 'Sandwiches', img: 'Mediterráneo.png' }),
  product({ id: 's_cia_gour', nombre: 'Ciabatta Gourmet', precio: 27000, categoria: 'Sandwiches', img: 'Ciabatta Gourmet.png' }),
  product({ id: 's_veg_huevo', nombre: 'Verduras con Huevo', precio: 21000, categoria: 'Sandwiches', img: 'Verduras con Huevo.png' }),
  product({ id: 's_serrano', nombre: 'Serrano', precio: 25000, categoria: 'Sandwiches', img: 'serrano.png' }),
];

  // === Otros / Bebidas / Postres ===
const especiales = [
  product({
    id: 'e_emp_carne',
    nombre: 'Empanada de carne (unidad)',
    categoria: 'Empanadas',
    img: 'Empanada carne.png',
    desc: 'Relleno de carne sazonada.',
    precio: 6000
  }),

  product({
    id: 'e_emp_pollo',
    nombre: 'Empanada de pollo (unidad)',
    categoria: 'Empanadas',
    img: 'Empanada pollo.png',
    desc: 'Relleno de pollo desmechado.',
    precio: 6000
  }),

  product({
    id: 'o_aros',
    nombre: 'Aros de cebolla',
    categoria: 'Otros',
    img: 'aroscebolla.png',
    desc: 'Porción individual.',
    precio: 12000
  }),

  product({
    id: 'o_papas',
    nombre: 'Papas fritas',
    categoria: 'Otros',
    img: 'Papas fritas.png',
    desc: 'Porción individual.',
    precio: 10000
  }),

  product({
    id: 'b_jugo_naran',
    nombre: 'Jugo de naranja',
    categoria: 'Bebidas',
    img: 'naranjajugo.png',
    precio: 8000
  }),

  product({
    id: 'b_coca_zero',
    nombre: 'Coca-Cola Zero',
    categoria: 'Bebidas',
    img: 'zero coca.png',
    precio: 9000
  }),

  product({
    id: 'b_coca_orig',
    nombre: 'Coca-Cola Original',
    categoria: 'Bebidas',
    img: 'original coca.png',
    precio: 9000
  }),

  product({
    id: 'p_tresleches',
    nombre: 'Tres Leches',
    categoria: 'Postres',
    img: 'Tres Leches.png',
    desc: 'Postre casero.',
    precio: 15000
  }),

  product({
    id: 'p_pave',
    nombre: 'Pavé',
    categoria: 'Postres',
    img: 'Pavé.png',
    desc: 'Postre casero.',
    precio: 15000
  }),
];


  // === Carrusel (sin cambios) ===
  const carousel = [
    { img: BASE_IMG + '3.png', title: 'Sándwiches artesanales', desc: 'Pan ciabatta + rellenos generosos' },
    { img: BASE_IMG + '1.png', title: 'Empanadas y postres', desc: 'Para completar tu pedido' },
    { img: BASE_IMG + '2.png', title: 'Delivery por PedidosYa y Monchis', desc: 'Hacé tu pedido online' },
  ];

  // === Promos por día con PRECIOS (PYG) ===
  // Campos soportados por promos.html: title, desc, img, hours, badge, validFrom, validTo, validMonths
  const promosPorDia = {
  1: { title: 'Combo Italiano + Bebida', desc: 'Ñembo Italiano + gaseosa a precio especial',
       img: promoImg('Ñembo Italiano.png'), hours:'12:00–21:00', badge:'Solo en el local', price:23000, priceOld:26000 },
  2: { title: 'Pastrami Lovers', desc:'Pastrami + papas',
       img: promoImg('martes.jpg'), hours:'12:00–21:00', badge:'Solo en el local', price:28000, priceOld:32000 },
  3: { title: 'Mediterráneo + Jugo', desc:'Mediterráneo + jugo de naranja',
       img: promoImg('Mediterráneo.png'), hours:'12:00–21:00', badge:'Solo en el local', price:24000, priceOld:27000 },
  4: { title: 'Desmechado Day', desc:'Desmechado de Vacío + bebida',
       img: promoImg('jueves.png'), hours:'12:00–21:00', badge:'Solo en el local', price:26000, priceOld:29000 },
  5: { title: 'Serrano Friday', desc:'Serrano + papas',
       img: promoImg('serrano.png'), hours:'12:00–21:00', badge:'Solo en el local', price:25000 },
  6: { title: 'Combo Familiar', desc:'2 sánguches + 2 acompañamientos + 2 bebidas',
       img: promoImg('Verduras con Huevo.png'), hours:'12:00–21:00', badge:'Solo en el local', price:90000, priceOld:105000 },
  0: { title: 'Dulce Domingo', desc:'Tres Leches o Pavé en promo en el local',
       img: promoImg('domingo.jpg'), hours:'12:00–21:00', badge:'Solo en el local', price:15000 }
};

  window.HELADERIA_DATA = { sabores, especiales, carousel, promosPorDia };
})();
