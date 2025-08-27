import { $ } from './utils.js';

const PKEY = 'yy_profile';

function readProfile(){ return JSON.parse(localStorage.getItem(PKEY) || '{"name":"","email":"","address":""}'); }
function writeProfile(p){ localStorage.setItem(PKEY, JSON.stringify(p)); }

export function initProfile(){
  const form = document.getElementById('profile-form');
  const p = readProfile();
  document.getElementById('pf-name').value = p.name || '';
  document.getElementById('pf-email').value = p.email || '';
  document.getElementById('pf-address').value = p.address || '';

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const next = {
      name: document.getElementById('pf-name').value.trim(),
      email: document.getElementById('pf-email').value.trim(),
      address: document.getElementById('pf-address').value.trim(),
    };
    writeProfile(next);
    const ok = document.createElement('div');
    ok.className = 'alert alert-success mt-3';
    ok.textContent = 'Profile saved.';
    form.appendChild(ok);
    setTimeout(()=>ok.remove(), 1200);
  });
}
