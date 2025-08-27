import { sleep } from './utils.js';

const SETTINGS_KEY = 'yy_settings';
const MENU_KEY = 'yy_menu';
const ORDERS_KEY = 'yy_orders';

async function fetchJSON(path){
  // Bust cache for local static server
  const res = await fetch(`${path}?v=${Date.now()}`);
  if(!res.ok) throw new Error('Fetch failed '+path);
  return res.json();
}

export const API = {
  async getSettings(){
    let s = JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null');
    if(!s){
      s = await fetchJSON('/data/settings.json');
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
    }
    return s;
  },
  async getMenu(){
    let data = JSON.parse(localStorage.getItem(MENU_KEY) || 'null');
    if(!data){
      data = await fetchJSON('/data/menu.json');
      localStorage.setItem(MENU_KEY, JSON.stringify(data));
    }
    // Simulate latency
    await sleep(350 + Math.random()*400);
    return data;
  },
  async saveMenuItem(item){
    const menu = await this.getMenu();
    item.id = crypto.randomUUID();
    menu.push(item);
    localStorage.setItem(MENU_KEY, JSON.stringify(menu));
    await sleep(300);
    return item;
  },
  async updateMenuItem(id, patch){
    const menu = await this.getMenu();
    const i = menu.findIndex(x=>x.id===id);
    if(i>-1){ menu[i] = { ...menu[i], ...patch }; }
    localStorage.setItem(MENU_KEY, JSON.stringify(menu));
    await sleep(300);
    return menu[i];
  },
  async deleteMenuItem(id){
    const menu = await this.getMenu();
    const next = menu.filter(x=>x.id!==id);
    localStorage.setItem(MENU_KEY, JSON.stringify(next));
    await sleep(250);
    return true;
  },
  async getOrders(){
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    await sleep(200);
    return orders;
  },
  async saveOrder(order){
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    // simple id
    const id = Math.random().toString(36).slice(2,8).toUpperCase();
    const now = new Date().toISOString();
    const record = { id, createdAt: now, status:'Pending', ...order };
    orders.unshift(record);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    await sleep(500);
    return record;
  },
  async updateOrderStatus(id, status){
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    const idx = orders.findIndex(o=>o.id===id);
    if(idx>-1){ orders[idx].status = status; }
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    await sleep(250);
    return orders[idx];
  }
};
