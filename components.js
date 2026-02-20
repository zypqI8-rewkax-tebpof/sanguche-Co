
// components.js — Header/Footer + Sidebar móvil (DELUXE) con iconos, slide-in y accesibilidad
(function(){
  function getCfg(){ return window.APP_CONFIG || window.PALEFIT || {}; }
  function isActive(href){
    const path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    return path===href.toLowerCase()? 'aria-current="page"' : '';
  }
  function ensureExtraCss(){
    const id='styles-extra';
    if(!document.getElementById(id)){
      const link=document.createElement('link');
      link.id=id; link.rel='stylesheet'; link.href='assets/css/styles-extra.css';
      document.head.appendChild(link);
    }
  }

  function headerHTML(){
    const c=getCfg();
    return `
    <div class="site-header">
      <div class="container navbar">
       <a class="brand" href="index.html" aria-label="Inicio">
  <img src="Logo.png"alt="Sánguche & Co"class="brand-logo-img">
        </a>
        <nav class="nav-links" aria-label="Principal">
          <a href="index.html" ${isActive('index.html')}>Inicio</a>
          <a href="sabores.html" ${isActive('sabores.html')}>Sándwiches</a>
          <a href="productos.html" ${isActive('productos.html')}>Otros</a>
          <a href="promos.html" ${isActive('promos.html')}>Promos</a>
          <a href="contacto.html" ${isActive('contacto.html')}>Contacto</a>
        </nav>
        <div class="nav-cta">
          <a class="cart-pill" href="carrito.html" aria-label="Carrito">
            <i class="bi bi-shop-window"></i>
            <span id="cartCount" class="cart-count">0</span>
          </a>
          <button id="btnHamburger" class="hamburger" aria-label="Abrir menú" aria-controls="mobileMenu" aria-expanded="false">
            <i class="bi bi-list" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>`;
  }

  function footerHTML(){
    const c=getCfg();
    const wa=c.whatsapp?`https://wa.me/${c.whatsapp}`:'#';
    const maps=c.mapsQuery?`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.mapsQuery)}`:'#';
    return `
    <div class="footer">
      <div class="container footer-grid">
        <div>
          <a class="brand" href="index.html" aria-label="Inicio">
          <img src="Logo.png"alt="Sánguche & Co"class="brand-logo-img">
        </a>
          <p>${c.tagline||''}</p>
          <p>${c.address||''}</p>
          <p>${c.hours||''}</p>
        </div>
        <div>
          <h4>Menú</h4>
          <ul>
            <li><a href="index.html">Inicio</a></li>
            <li><a href="sabores.html">Sándwiches</a></li>
            <li><a href="productos.html">Otros</a></li>
            <li><a href="promos.html">Promos</a></li>
            <li><a href="carrito.html">Carrito</a></li>
          </ul>
        </div>
        <div>
          <h4>Ayuda</h4>
          <ul>
            <li><a href="contacto.html">Contacto</a></li>
            <li><a href="faq.html">Preguntas frecuentes</a></li>
            <li><a href="privacy.html">Privacidad</a></li>
            <li><a href="terms.html">Términos</a></li>
          </ul>
        </div>
        <div>
          <h4>Seguinos</h4>
          <div class="social">
  ${c.instagram ? `
    <a class="soc soc-circle" href="${c.instagram}" target="_blank" rel="noopener" aria-label="Instagram">
      <img class="soc-img" src="logotipo-de-instagram.png" alt="">
      <i class="bi bi-instagram" aria-hidden="true"></i>
      <span class="sr-only">Instagram</span>
    </a>
  ` : ''}

  ${c.whatsapp ? `
    <a class="soc soc-circle" href="${wa}" target="_blank" rel="noopener" aria-label="WhatsApp">
      <img class="soc-img" src="whatsapp.png" alt="">
      <i class="bi bi-whatsapp" aria-hidden="true"></i>
      <span class="sr-only">WhatsApp</span>
    </a>
  ` : ''}

  ${c.pedidosya ? `
    <a class="soc soc-circle" href="${c.pedidosya}" target="_blank" rel="noopener" aria-label="PedidosYa">
      <img class="soc-img" src="Icon.jpeg" alt="">
      <i class="bi bi-bag" aria-hidden="true"></i>
      <span class="sr-only">PedidosYa</span>
    </a>
  ` : ''}

  ${c.mochis ? `
    <a class="soc soc-circle" href="" target="_blank" rel="noopener" aria-label="Cómo llegar">
      <img class="soc-img" src="monchis.png" alt="">
      <i class="bi bi-geo-alt" aria-hidden="true"></i>
      <span class="sr-only">Cómo llegar</span>
    </a>
  ` : ''}
</div>
        </div>
      </div>
      <div class="container footer-bottom">
        <small>© ${new Date().getFullYear()} • ${c.city||''} </small>
        <small>© ${c.name||'Sánguche & Co.'}</small>
      </div>
      
    </div>`;
  }

  

  // Construye/inyecta el overlay y panel si faltan
  function ensureMobileSkeleton(){
    let menu=document.getElementById('mobileMenu');
    if(!menu){
      menu=document.createElement('div');
      menu.id='mobileMenu';
      menu.className='mobile-menu';
      menu.setAttribute('aria-hidden','true');
      menu.innerHTML = `
        <div class="mobile-panel">
          <button id="btnCloseMenu" class="close" aria-label="Cerrar menú">✕</button>
          <div class="panel-inner"></div>
        </div>`;
      document.body.appendChild(menu);
    } else {
      const panel = menu.querySelector('.mobile-panel');
      if(!panel){
        const div=document.createElement('div');
        div.className='mobile-panel';
        div.innerHTML = `<button id="btnCloseMenu" class="close" aria-label="Cerrar menú">✕</button><div class="panel-inner"></div>`;
        menu.appendChild(div);
      } else if(!panel.querySelector('.panel-inner')){
        const inner=document.createElement('div');
        inner.className='panel-inner';
        panel.appendChild(inner);
      }
    }
  }

  function renderMobilePanel(){
    const c=getCfg();
    const menu=document.getElementById('mobileMenu');
    const panel=menu?.querySelector('.mobile-panel');
    const inner=panel?.querySelector('.panel-inner');
    if(!inner) return;

    const wa=c.whatsapp?`https://wa.me/${c.whatsapp}`:'#';
    const maps=c.mapsQuery?`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.mapsQuery)}`:'#';

    inner.innerHTML = `
      <nav aria-label="Navegación móvil">
        <a href="index.html" ${isActive('index.html')}><i class="bi bi-house"></i> Inicio</a>
        <a href="sabores.html" ${isActive('sabores.html')}><i class="bi bi-grid-3x3-gap"></i> Sándwiches</a>
        <a href="productos.html" ${isActive('productos.html')}><i class="bi bi-stars"></i> Otros</a>
        <a href="promos.html" ${isActive('promos.html')}><i class="bi bi-tags"></i> Promos</a>
        <a href="carrito.html" ${isActive('carrito.html')}><i class="bi bi-shop-window"></i>Carrito</a>
        <a href="contacto.html" ${isActive('contacto.html')}><i class="bi bi-whatsapp"></i> Contacto</a>
      </nav>
      <div class="panel-cta">
        ${c.pedidosya?`<a class="btn btn-ghost" href="${c.pedidosya}" target="_blank" rel="noopener"><i class="bi bi-bag"></i> Pedir por PedidosYa</a>`:''}
        ${c.whatsapp?`<a class="btn btn-primary" href="${wa}" target="_blank" rel="noopener"><i class="bi bi-whatsapp"></i> WhatsApp</a>`:''}
        ${c.mapsQuery?`<a class="btn btn-soft" href="${maps}" target="_blank" rel="noopener"><i class="bi bi-geo-alt"></i> Cómo llegar</a>`:''}
      </div>`;
  }

  function bindMobileMenu(){
    const menu=document.getElementById('mobileMenu');
    const panel=menu?.querySelector('.mobile-panel');
    const openBtn=document.getElementById('btnHamburger');
    const closeBtn=menu?.querySelector('#btnCloseMenu');
    if(!menu || !panel || !openBtn || !closeBtn) return;

    let lastFocused=null;

    const open=()=>{
      lastFocused=document.activeElement;
      menu.classList.add('is-open');
      menu.setAttribute('aria-hidden','false');
      openBtn.setAttribute('aria-expanded','true');
      const first=panel.querySelector('a,button,[tabindex]:not([tabindex="-1"])');
      if(first) first.focus();
    };

    const close=()=>{
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden','true');
      openBtn.setAttribute('aria-expanded','false');
      if(lastFocused) lastFocused.focus();
    };

    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    menu.addEventListener('click', (e)=>{ if(e.target===menu) close(); });

    document.addEventListener('keydown', (e)=>{
      if(!menu.classList.contains('is-open')) return;
      if(e.key==='Escape'){ e.preventDefault(); close(); return; }
      if(e.key==='Tab'){
        const f=panel.querySelectorAll('a,button,[tabindex]:not([tabindex="-1"])');
        const list=[...f]; if(!list.length) return;
        const first=list[0], last=list[list.length-1];
        if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
        else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
      }
    });
  }

  function mount(){
    ensureExtraCss();
    const header=document.getElementById('siteHeader');
    const footer=document.getElementById('siteFooter');
    if(header) header.innerHTML = headerHTML();
    if(footer) footer.innerHTML = footerHTML();

    ensureMobileSkeleton();
    renderMobilePanel();
    bindMobileMenu();

    if (typeof Cart?.updateCartCount==='function') Cart.updateCartCount();
  }

  document.addEventListener('DOMContentLoaded', mount);
})();
