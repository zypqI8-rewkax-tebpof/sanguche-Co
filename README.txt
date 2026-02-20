Sánguche & Co. Site Bundle

Estructura:
  index.html, sabores.html, productos.html, promos.html, carrito.html, contacto.html,
  nosotros.html, faq.html, privacy.html, terms.html
  assets/js/{config.js, components.js, cart.js, data.js, main.js}
  assets/css/styles.css

Notas:
- Header y Footer se montan por assets/js/components.js (usa #siteHeader y #siteFooter).
- Configuración en assets/js/config.js (APP_CONFIG).
- Carrito: assets/js/cart.js (API Cart.*).
- Catálogo: usar UI.renderCatalog() y UI.setupFilters() desde assets/js/main.js.
- Si tenías código legacy con window.PALEFIT, puedes añadir: window.PALEFIT = window.APP_CONFIG;
