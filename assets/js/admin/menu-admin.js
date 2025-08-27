import { API } from '../api.js';
import { guard } from './auth.js';

guard();

let tb, modal, form;

function rowTemplate(i){
  return `<tr data-id="${i.id}">
    <td>${i.name}</td>
    <td>${i.category}</td>
    <td class="text-end">$${i.price.toFixed(2)}</td>
    <td>${i.inStock ? 'In' : 'Out'}</td>
    <td class="text-end">
      <button class="btn btn-sm btn-outline-secondary me-1 edit">Edit</button>
      <button class="btn btn-sm btn-outline-danger delete">Delete</button>
    </td>
  </tr>`;
}

async function render(){
  const list = await API.getMenu();
  tb.innerHTML = list.map(rowTemplate).join('');
}

function openModal(item){
  document.getElementById('admin-item-id').value = item?.id || '';
  document.getElementById('admin-item-name').value = item?.name || '';
  document.getElementById('admin-item-category').value = item?.category || 'Pizza';
  document.getElementById('admin-item-price').value = item?.price ?? 9.99;
  document.getElementById('admin-item-image').value = item?.image || '';
  document.getElementById('admin-item-desc').value = item?.description || '';
  document.getElementById('admin-item-stock').checked = item?.inStock ?? true;
  modal.show();
}

async function saveFromModal(){
  const id = document.getElementById('admin-item-id').value;
  const payload = {
    name: document.getElementById('admin-item-name').value.trim(),
    category: document.getElementById('admin-item-category').value,
    price: parseFloat(document.getElementById('admin-item-price').value||'0'),
    image: document.getElementById('admin-item-image').value.trim() || `https://picsum.photos/seed/${Date.now()}/600/400`,
    description: document.getElementById('admin-item-desc').value.trim(),
    inStock: document.getElementById('admin-item-stock').checked,
    veg: false, vegan: false, tags: [], popularity: Math.floor(Math.random()*100)
  };
  if(id){
    await API.updateMenuItem(id, payload);
  }else{
    await API.saveMenuItem(payload);
  }
  await render();
  modal.hide();
}

document.addEventListener('DOMContentLoaded', ()=>{
  tb = document.getElementById('admin-menu-tbody');
  modal = new bootstrap.Modal('#adminItemModal');
  form = document.getElementById('admin-item-form');

  document.getElementById('add-item-btn').addEventListener('click', ()=>openModal(null));
  document.getElementById('admin-item-save').addEventListener('click', saveFromModal);

  tb.addEventListener('click', async (e)=>{
    const tr = e.target.closest('tr'); if(!tr) return;
    const id = tr.getAttribute('data-id');

    if(e.target.classList.contains('edit')){
      const list = await API.getMenu();
      const item = list.find(x=>x.id===id);
      openModal(item);
    }else if(e.target.classList.contains('delete')){
      if(confirm('Delete this item?')){
        await API.deleteMenuItem(id);
        await render();
      }
    }
  });

  render();
});
