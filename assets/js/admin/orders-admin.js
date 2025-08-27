import { API } from '../api.js';
import { guard } from './auth.js'; guard();

let tb;

function rowTemplate(o){
  const items = o.items.map(i=>`${i.name}×${i.qty}`).join(', ');
  return `<tr data-id="${o.id}">
    <td>${o.id}</td>
    <td>${items}</td>
    <td>$${o.total.toFixed(2)}</td>
    <td>
      <span class="badge text-bg-secondary">${o.status}</span>
    </td>
    <td class="text-end">
      <div class="btn-group btn-group-sm">
        <button class="btn btn-outline-secondary" data-s="Pending">Pending</button>
        <button class="btn btn-outline-secondary" data-s="Preparing">Preparing</button>
        <button class="btn btn-outline-secondary" data-s="Out for delivery">Out</button>
        <button class="btn btn-outline-secondary" data-s="Completed">Done</button>
      </div>
    </td>
  </tr>`;
}

async function render(){
  const list = await API.getOrders();
  tb.innerHTML = list.map(rowTemplate).join('');
}

document.addEventListener('DOMContentLoaded', ()=>{
  tb = document.getElementById('admin-orders-tbody');
  tb.addEventListener('click', async (e)=>{
    const btn = e.target.closest('[data-s]'); if(!btn) return;
    const tr = e.target.closest('tr');
    const id = tr.getAttribute('data-id');
    const status = btn.getAttribute('data-s');
    await API.updateOrderStatus(id, status);
    await render();
  });
  render();
});
