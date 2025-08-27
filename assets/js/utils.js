export const sleep = (ms=350)=> new Promise(r=>setTimeout(r, ms));

export function $(sel, root=document){ return root.querySelector(sel); }
export function $all(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

export function money(v, currency='USD'){
  try{
    return new Intl.NumberFormat('en-US', {style:'currency', currency}).format(v);
  }catch{
    return `$${v.toFixed(2)}`;
  }
}

export function debounce(fn, wait=250){
  let t; return (...args)=>{ clearTimeout(t); t=setTimeout(()=>fn(...args), wait); };
}
