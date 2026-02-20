
const CART_KEY = "palefit_cart_v1";
function loadCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch{ return []; } }
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartCount(); }
function moneyPYG(n){ return new Intl.NumberFormat('es-PY',{style:'currency',currency:'PYG',maximumFractionDigits:0}).format(n); }
function addToCart(item, qty=1){ const cart=loadCart(); const idx = cart.findIndex(x=>x.id===item.id); if(idx>=0) cart[idx].qty += qty; else cart.push({...item, qty}); saveCart(cart); toast(`Agregado: ${item.nombre} (x${qty})`); }
function removeFromCart(id){ let cart=loadCart(); cart = cart.filter(x=>x.id!==id); saveCart(cart); }
function setQty(id, qty){ const cart=loadCart(); const it = cart.find(x=>x.id===id); if(!it) return; it.qty = Math.max(1, qty); saveCart(cart); }
function clearCart(){ saveCart([]); }
function getCartTotals(){ const cart=loadCart(); const subtotal = cart.reduce((acc,it)=>acc+(it.precio*it.qty),0); return { subtotal, total: subtotal }; }
function updateCartCount(){ const el=document.getElementById('cartCount'); if(!el) return; const cart=loadCart(); const count = cart.reduce((a,x)=>a+x.qty,0); el.textContent = count; }
function toast(msg){ const t=document.createElement('div'); t.textContent=msg; t.style.position='fixed'; t.style.left='50%'; t.style.bottom='18px'; t.style.transform='translateX(-50%)'; t.style.background='rgba(255,90,31,.94)'; t.style.color='#fff'; t.style.padding='12px 14px'; t.style.borderRadius='999px'; t.style.boxShadow='0 18px 40px rgba(0,0,0,.2)'; t.style.zIndex='9999'; t.style.fontWeight='700'; document.body.appendChild(t); setTimeout(()=>{ t.style.opacity='0'; t.style.transition='opacity .35s ease'; }, 1300); setTimeout(()=>{ t.remove(); }, 1800); }
window.Cart = { loadCart, addToCart, removeFromCart, setQty, clearCart, getCartTotals, moneyPYG, updateCartCount };
document.addEventListener('DOMContentLoaded', updateCartCount);
