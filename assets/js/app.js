import { initMenu } from './menu.js';
import { initCart, openCheckoutFromCart, updateCartCountBadge } from './cart.js';
import { initCheckout } from './checkout.js';
import { initProfile } from './profile.js';

// Simple client-side router to show/hide sections
const sections = {
  home: document.getElementById('home-section'),
  checkout: document.getElementById('checkout-section'),
  profile: document.getElementById('profile-section')
};

function show(sectionName){
  Object.values(sections).forEach(s => s.classList.add('d-none'));
  sections[sectionName].classList.remove('d-none');
  document.querySelectorAll('[data-nav]').forEach(a => {
    a.classList.toggle('active', a.getAttribute('data-nav')===sectionName);
  });
  if(sectionName==='checkout'){ initCheckout(); }
  if(sectionName==='profile'){ initProfile(); }
}

document.addEventListener('click', (e)=>{
  const nav = e.target.closest('[data-nav]');
  if(nav){
    e.preventDefault();
    show(nav.getAttribute('data-nav'));
  }
});

document.getElementById('year').textContent = new Date().getFullYear();

// Cart -> Checkout button event
document.getElementById('cart-checkout').addEventListener('click', ()=>{
  openCheckoutFromCart();
  show('checkout');
  const offcanvas = bootstrap.Offcanvas.getOrCreateInstance('#cartDrawer');
  offcanvas.hide();
});

window.addEventListener('DOMContentLoaded', async ()=>{
  await initMenu();
  initCart();
  updateCartCountBadge();
  show('home');
});
