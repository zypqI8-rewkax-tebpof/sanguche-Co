
// main.js — Catálogo, filtros y animación fly-to-cart (mejorado con disponibilidad)
(function(){
  const qs = (sel,root=document)=>root.querySelector(sel);
  const qsa = (sel,root=document)=>Array.from(root.querySelectorAll(sel));
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  const normalize=(s)=> (s??'').toString().normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().trim();
  const moneyPYG=(v)=> new Intl.NumberFormat('es-PY',{style:'currency',currency:'PYG',maximumFractionDigits:0}).format(v ?? 0);

  // Compat de Cart.moneyPYG si no existe
  window.Cart = window.Cart || {};
  if(!window.Cart.moneyPYG) window.Cart.moneyPYG = moneyPYG;

  // ======== Disponibilidad helpers ========
  function parseTime(s){
    const [h,m] = (s||'').split(':').map(n=>parseInt(n,10));
    if(Number.isNaN(h)||Number.isNaN(m)) return null; return {h,m};
  }
  function inTimeRange(now, range){
    if(!range || !range.includes('-')) return true;
    const [from,to] = range.split('-').map(parseTime);
    if(!from||!to) return true;
    const n = now.getHours()*60 + now.getMinutes();
    const a = from.h*60 + from.m;
    const b = to.h*60 + to.m;
    return n>=a && n<=b;
  }
  function isAvailableNow(p, now=new Date()){
    if(!p) return false;
    const okFlag = (p.disponible !== false);
    const okStock = (typeof p.stock !== 'number') ? true : (p.stock !== 0);
    const okDay = Array.isArray(p.validDays) ? p.validDays.includes(now.getDay()) : true;
    const okHour = inTimeRange(now, p.validHours);
    return okFlag && okStock && okDay && okHour;
  }

  // ======== Animaciones / util ========
  function fadeInOnScroll(){
    const els=qsa('.fade-up'); if(!els.length) return;
    const io=new IntersectionObserver((entries,obs)=>{
      for(const e of entries){ if(e.isIntersecting){ e.target.classList.add('show'); obs.unobserve(e.target);} }
    },{threshold:0.12});
    els.forEach(el=>io.observe(el));
  }

  function showSkeleton(targetId,count=6){
    const wrap=document.getElementById(targetId); if(!wrap) return;
    const sk=()=>`
      <div class="skeleton skel-card">
        <div class="skeleton skel-img"></div>
        <div class="skel-body">
          <div class="skeleton skel-line" style="width:60%"></div>
          <div class="skeleton skel-line" style="width:40%"></div>
          <div class="skeleton skel-line" style="width:80%"></div>
        </div>
      </div>`;
    wrap.innerHTML = Array.from({length:count}).map(sk).join('');
  }

  function flyToCart(imgSrc, sourceEl){
    try{
      const cartPill=qs('.cart-pill'); if(!cartPill || !sourceEl) return;
      const start=sourceEl.getBoundingClientRect();
      const end=cartPill.getBoundingClientRect();
      const img=document.createElement('img');
      img.src=imgSrc||''; img.alt=''; img.className='flying';
      img.style.position='fixed'; img.style.left=`${start.left}px`; img.style.top=`${start.top}px`;
      img.style.width=`${Math.max(24, sourceEl.clientWidth||48)}px`; img.style.height='auto';
      img.style.transition='transform 600ms ease, opacity 600ms ease'; img.style.zIndex='9999';
      document.body.appendChild(img);
      const dx=end.left-start.left, dy=end.top-start.top, scale=0.2;
      requestAnimationFrame(()=>{ img.style.transform=`translate(${dx}px, ${dy}px) scale(${scale})`; img.style.opacity='0.2'; });
      setTimeout(()=>img.remove(),650);
    }catch(_){}
  }

  // ======== Card ========
  function productCard(p, typeLabel){
    const disponible = isAvailableNow(p);
    const precio = (window.Cart?.moneyPYG ? Cart.moneyPYG(p.precio) : moneyPYG(p.precio));
    const tags = (p.tags??[]).map(t=>{
      const low=normalize(t);
      const cls = low.includes('nuevo')? 'tag hot' : low.includes('veg')? 'tag green' : 'tag';
      return `<span class="${cls}">${t}</span>`;
    }).join('');
    const qid = `qty_${p.id}`;
    const stateBadge = disponible
      ? '<span class="tag green">Disponible hoy</span>'
      : (p?.stock === 0 ? '<span class="tag hot">Agotado</span>' : '<span class="tag">Fuera de horario</span>');

    // Extraer src real desde HTML en p.img
    let imgSrc='';
    try{ if(typeof p.img==='string' && p.img.trim().startsWith('<')){ const tmp=document.createElement('div'); tmp.innerHTML=p.img; imgSrc=tmp.querySelector('img')?.getAttribute('src')??''; } }catch(_){ }

    return `
    <article class="product fade-up" data-cat="${p.categoria??''}" data-name="${normalize(p.nombre)}" data-available="${disponible?'1':'0'}">
      ${p.img}
      <div class="product-body">
        <div class="product-top">
          <div>
            <h3>${p.nombre??''}</h3>
            <div class="price">${precio}</div>
          </div>
        </div>
        <p>${p.desc??''}</p>
        <div class="tags">
          ${stateBadge}
          ${tags}
        </div>
        <div class="product-actions">
          <div class="qty">
            <button type="button" data-dec="${p.id}" aria-label="Disminuir">−</button>
            <span id="${qid}">1</span>
            <button type="button" data-inc="${p.id}" aria-label="Aumentar">+</button>
          </div>
          <button class="btn btn-primary" data-add="${p.id}" ${disponible?'' : 'disabled aria-disabled="true"'}>Agregar ${typeLabel}</button>
        </div>
        ${imgSrc ? `<input type="hidden" id="img_${p.id}" value="${imgSrc}">` : ''}
      </div>
    </article>`;
  }

  // ======== Render ========
  function renderCatalog(targetId, items, typeLabel){
    const wrap=document.getElementById(targetId); if(!wrap) return;
    showSkeleton(targetId, Math.min(6, Array.isArray(items)?(items.length||6):6));
    setTimeout(()=>{
      if(!Array.isArray(items) || !items.length){
        wrap.innerHTML = `
          <div class="card" style="padding:16px">
            <h5 class="" style="margin:0 0 6px">No hay ${typeLabel}s para mostrar</h5>
            <p class="note" style="margin:0">Volvé más tarde o escribinos por WhatsApp.</p>
          </div>`;
        return;
      }
      wrap.innerHTML = items.map(p=>productCard(p, typeLabel)).join('');

      // Delegación de eventos
      wrap.addEventListener('click', (ev)=>{
        const inc=ev.target.closest('[data-inc]');
        const dec=ev.target.closest('[data-dec]');
        const add=ev.target.closest('[data-add]');

        if(inc){ const id=inc.getAttribute('data-inc'); const span=document.getElementById(`qty_${id}`); const current=parseInt(span?.textContent??'1',10)||1; span.textContent=String(current+1); }
        if(dec){ const id=dec.getAttribute('data-dec'); const span=document.getElementById(`qty_${id}`); const current=parseInt(span?.textContent??'1',10)||1; span.textContent=String(clamp(current-1,1,999)); }

        if(add){
          const id=add.getAttribute('data-add');
          const qty=parseInt(document.getElementById(`qty_${id}`)?.textContent??'1',10)||1;
          const item=items.find(x=>x.id===id);
          if(!item || !window.Cart || typeof Cart.addToCart!=='function') return;

          // src real para carrito y animación
          const hidden = document.getElementById(`img_${id}`);
          const src = hidden?.value ?? '';
          Cart.addToCart({id:item.id,nombre:item.nombre,precio:item.precio,img:src}, qty);
          if(typeof Cart.updateCartCount==='function') Cart.updateCartCount();

          const card=add.closest('.product');
          const imgEl=card?.querySelector('img') ?? add;
          flyToCart(src, imgEl);
        }
      });

      wrap.addEventListener('keydown', (ev)=>{
        const card=ev.target.closest('.product'); if(!card) return;
        const id=(card.querySelector('[data-inc]')||{}).getAttribute?.('data-inc'); if(!id) return;
        if(ev.key==='+' || ev.key==='='){ ev.preventDefault(); const span=document.getElementById(`qty_${id}`); const current=parseInt(span?.textContent??'1',10)||1; span.textContent=String(current+1);} 
        else if(ev.key==='-' || ev.key==='_' ){ ev.preventDefault(); const span=document.getElementById(`qty_${id}`); const current=parseInt(span?.textContent??'1',10)||1; span.textContent=String(clamp(current-1,1,999)); }
      });

      fadeInOnScroll();
    },250);
  }

  // ======== Filtros ========
  function setupFilters(catalogId){
    const chips=qsa('.chip');
    const search=document.getElementById('searchInput');
    const grid=document.getElementById(catalogId);
    if(!grid) return;
    let activeCat='Todos';
    let onlyAvailable=false;

    const apply=()=>{
      const q=normalize(search?.value??'');
      const cards=qsa('.product',grid);
      cards.forEach(it=>{
        const cat=it.getAttribute('data-cat')??'';
        const name=it.getAttribute('data-name')??'';
        const avail=it.getAttribute('data-available')==='1';
        const okCat=(activeCat==='Todos' || cat===activeCat);
        const okText=(!q || name.includes(q));
        const okAvail=(!onlyAvailable || avail);
        it.classList.toggle('hidden', !(okCat && okText && okAvail));
      });
    };

    chips.forEach(ch=>{
      ch.addEventListener('click', ()=>{
        chips.forEach(x=>x.classList.remove('active'));
        ch.classList.add('active');
        activeCat=ch.getAttribute('data-cat') ?? activeCat;
        onlyAvailable = ch.hasAttribute('data-available');
        apply();
      });
    });

    if(search) search.addEventListener('input', apply);
    apply();
  }

  document.addEventListener('DOMContentLoaded', ()=>{ fadeInOnScroll(); });
  window.UI = { renderCatalog, setupFilters };
})();
