import { $, money } from './utils.js';
import { API } from './api.js';

const CART_KEY = 'yy_cart';

function readCart(){ return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
function writeCart(items){ localStorage.setItem(CART_KEY, JSON.stringify(items)); }

export function addToCart(line){
  const cart = readCart();
  const idx = cart.findIndex(i=>i.id===line.id);
  if(idx>-1) cart[idx].qty += line.qty;
  else cart.push(line);
  writeCart(cart);
  renderCart();
}

export function updateCartCountBadge(){
  const cart = readCart();
  const count = cart.reduce((s,i)=>s+i.qty,0);
  document.getElementById('cart-count').textContent = count;
}

function lineTemplate(line, currency){
  return `<div class="d-flex align-items-center border rounded p-2 mb-2" data-id="${line.id}">
    <img src="${line.image}" onerror="this.src='https://picsum.photos/seed/${line.id}/80/80'" class="rounded me-2" width="56" height="56" alt="">
    <div class="flex-grow-1">
      <div class="fw-medium">${line.name}</div>
      <div class="text-muted small">${money(line.price, currency)}</div>
    </div>
    <div class="input-group input-group-sm" style="width: 110px;">
      <button class="btn btn-outline-secondary qty-minus">–</button>
      <input type="number" min="1" class="form-control text-center qty-input" value="${line.qty}">
      <button class="btn btn-outline-secondary qty-plus">+</button>
    </div>
    <button class="btn btn-sm btn-link text-danger ms-2 remove-line">Remove</button>
  </div>`;
}

async function renderSummary(){
  const items = readCart();
  const settings = await API.getSettings();
  const sub = items.reduce((s,i)=>s+i.price*i.qty,0);
  const tax = sub * settings.taxRate;
  const total = sub + tax + settings.deliveryFee;
  $('#cart-summary').innerHTML = `
    <div class="d-flex justify-content-between"><span>Subtotal</span><strong>${money(sub, settings.currency)}</strong></div>
    <div class="d-flex justify-content-between"><span>Tax</span><strong>${money(tax, settings.currency)}</strong></div>
    <div class="d-flex justify-content-between"><span>Delivery</span><strong>${money(settings.deliveryFee, settings.currency)}</strong></div>
    <hr class="my-2">
    <div class="d-flex justify-content-between fs-5"><span>Total</span><strong>${money(total, settings.currency)}</strong></div>
  `;
}

export async function renderCart(){
  const items = readCart();
  const settings = await API.getSettings();
  const wrap = document.getElementById('cart-items');
  wrap.innerHTML = items.length ? items.map(i=>lineTemplate(i, settings.currency)).join('') : '<p class="text-muted">Your cart is empty.</p>';
  await renderSummary();
  updateCartCountBadge();
}

export function initCart(){
  // listeners
  document.getElementById('cart-items').addEventListener('click', (e)=>{
    const row = e.target.closest('[data-id]');
    if(!row) return;
    const id = row.getAttribute('data-id');
    let cart = readCart();
    const idx = cart.findIndex(i=>i.id===id);
    if(idx<0) return;

    if(e.target.closest('.qty-plus')){
      cart[idx].qty += 1;
    }else if(e.target.closest('.qty-minus')){
      cart[idx].qty = Math.max(1, cart[idx].qty - 1);
    }else if(e.target.closest('.remove-line')){
      cart.splice(idx, 1);
    }
    writeCart(cart);
    renderCart();
  });

  document.getElementById('cart-items').addEventListener('change', (e)=>{
    const row = e.target.closest('[data-id]');
    if(!row) return;
    if(e.target.classList.contains('qty-input')){
      const id = row.getAttribute('data-id');
      let cart = readCart();
      const idx = cart.findIndex(i=>i.id===id);
      if(idx>-1){
        cart[idx].qty = Math.max(1, parseInt(e.target.value || '1', 10));
        writeCart(cart);
        renderCart();
      }
    }
  });

  document.getElementById('cart-clear').addEventListener('click', ()=>{
    writeCart([]);
    renderCart();
  });

  renderCart();
}

export function openCheckoutFromCart(){
  // expose for app.js
}

export { readCart, writeCart };
