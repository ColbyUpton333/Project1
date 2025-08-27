import { API } from './api.js';
import { $, $all, money, debounce } from './utils.js';
import { addToCart, updateCartCountBadge } from './cart.js';

let MENU = [];
let SETTINGS;

function cardTemplate(item){
  const stockBadge = item.inStock ? '' : `<span class="badge text-bg-secondary ms-1">Out</span>`;
  const veg = item.vegan ? `<span class="badge-chip ms-1">Vegan</span>` : (item.veg ? `<span class="badge-chip ms-1">Veg</span>` : '');
  return `<div class="col-sm-6 col-md-4 col-lg-3">
    <div class="card h-100 item-card" data-id="${item.id}">
      <img src="${item.image}" class="card-img-top" alt="${item.name}" onerror="this.src='https://picsum.photos/seed/${item.id}/600/400'">
      <div class="card-body d-flex flex-column">
        <div class="d-flex justify-content-between align-items-start mb-1">
          <h5 class="card-title">${item.name}</h5>
          <span class="price">${money(item.price, SETTINGS.currency)}</span>
        </div>
        <p class="card-text text-muted small flex-grow-1">${item.description}</p>
        <div class="d-flex align-items-center justify-content-between">
          <div>${veg} ${stockBadge}</div>
          <button class="btn btn-sm btn-primary add-btn" ${item.inStock?'':'disabled'}>Add</button>
        </div>
      </div>
    </div>
  </div>`;
}

function renderMenu(list){
  const grid = $('#menu-grid');
  grid.innerHTML = list.map(cardTemplate).join('');
}

function getActiveCategories(){
  return $all('.category-filter')
    .filter(c=>c.checked)
    .map(c=>c.value);
}

function applyFilters(){
  const cats = getActiveCategories();
  const q = $('#menu-search-input').value.trim().toLowerCase();
  const onlyVeg = $('#onlyVeg').checked;
  const onlyVegan = $('#onlyVegan').checked;
  const sort = $('#menu-sort').value;

  let list = MENU.filter(i=>cats.includes(i.category));
  if(q) list = list.filter(i=> (i.name+i.description+i.tags.join(' ')).toLowerCase().includes(q));
  if(onlyVeg) list = list.filter(i=>i.veg || i.vegan);
  if(onlyVegan) list = list.filter(i=>i.vegan);

  if(sort==='price-asc') list.sort((a,b)=>a.price-b.price);
  else if(sort==='price-desc') list.sort((a,b)=>b.price-a.price);
  else list.sort((a,b)=>b.popularity - a.popularity);

  renderMenu(list);
}

function bindMenuEvents(){
  $('#menu-grid').addEventListener('click', (e)=>{
    const btn = e.target.closest('.add-btn');
    if(btn){
      const card = e.target.closest('.item-card');
      const id = card.getAttribute('data-id');
      const item = MENU.find(i=>i.id===id);
      addToCart({ id:item.id, name:item.name, price:item.price, image:item.image, qty:1 });
      updateCartCountBadge();
      const toast = document.createElement('div');
      toast.className = 'toast align-items-center text-bg-primary border-0';
      toast.role = 'alert';
      toast.innerHTML = `<div class="d-flex"><div class="toast-body">Added ${item.name} to cart.</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
      document.getElementById('toastContainer').appendChild(toast);
      const t = new bootstrap.Toast(toast, { delay: 1200 });
      t.show();
      setTimeout(()=>toast.remove(), 1500);
    }
  });

  // Filters
  $('#menu-search-input').addEventListener('input', debounce(applyFilters, 200));
  $('#menu-sort').addEventListener('change', applyFilters);
  $all('.category-filter').forEach(c=>c.addEventListener('change', applyFilters));
  $('#onlyVeg').addEventListener('change', applyFilters);
  $('#onlyVegan').addEventListener('change', applyFilters);
}

export async function initMenu(){
  SETTINGS = await API.getSettings();
  MENU = await API.getMenu();
  bindMenuEvents();
  applyFilters();
}
