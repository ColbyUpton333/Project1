import { $, money } from './utils.js';
import { readCart, writeCart } from './cart.js';
import { API } from './api.js';

function validateForm(){
  const name = $('#co-name');
  const email = $('#co-email');
  const phone = $('#co-phone');
  const address = $('#co-address');

  let ok = true;
  [name,email,phone,address].forEach(el=>{
    if(!el.checkValidity()){
      el.classList.add('is-invalid'); ok=false;
    }else{
      el.classList.remove('is-invalid');
    }
  });
  $('#place-order-btn').disabled = !ok || readCart().length===0;
}

function renderSummaryCard(settings){
  const items = readCart();
  const sub = items.reduce((s,i)=>s+i.price*i.qty,0);
  const tax = sub * settings.taxRate;
  const total = sub + tax + settings.deliveryFee;

  $('#checkout-summary').innerHTML = `
    <ul class="list-group list-group-flush">
      ${items.map(i=>`<li class="list-group-item d-flex justify-content-between align-items-center">
        <span>${i.name} × ${i.qty}</span>
        <strong>${money(i.price*i.qty, settings.currency)}</strong>
      </li>`).join('')}
      <li class="list-group-item d-flex justify-content-between"><span>Subtotal</span><strong>${money(sub, settings.currency)}</strong></li>
      <li class="list-group-item d-flex justify-content-between"><span>Tax</span><strong>${money(tax, settings.currency)}</strong></li>
      <li class="list-group-item d-flex justify-content-between"><span>Delivery</span><strong>${money(settings.deliveryFee, settings.currency)}</strong></li>
      <li class="list-group-item d-flex justify-content-between fs-5"><span>Total</span><strong>${money(total, settings.currency)}</strong></li>
    </ul>
  `;
}

export async function initCheckout(){
  const form = $('#checkout-form');
  const settings = await API.getSettings();
  renderSummaryCard(settings);
  validateForm();

  form.addEventListener('input', validateForm);
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    validateForm();
    if($('#place-order-btn').disabled) return;

    const profile = {
      name: $('#co-name').value.trim(),
      email: $('#co-email').value.trim(),
      phone: $('#co-phone').value.trim(),
      address: $('#co-address').value.trim()
    };

    const items = readCart();
    const sub = items.reduce((s,i)=>s+i.price*i.qty,0);
    const tax = sub * settings.taxRate;
    const total = sub + tax + settings.deliveryFee;

    const order = await API.saveOrder({
      customer: profile,
      items, sub, tax, delivery: settings.deliveryFee, total
    });

    writeCart([]);
    $('#checkout-summary').innerHTML = `<div class="text-center py-4">
      <h3 class="h4">Thanks! Order <span class="badge text-bg-success">${order.id}</span> received.</h3>
      <p class="text-muted">Status: ${order.status}. You will receive updates soon.</p>
      <a class="btn btn-primary mt-2" href="#" data-nav="home">Back to Menu</a>
    </div>`;
    document.getElementById('cart-count').textContent = '0';
    $('#place-order-btn').disabled = true;
  });
}
