const ADMIN_KEY='yy_admin_token';

function login(email, password){
  const ok = email==='admin@demo.com' && password==='Admin!234';
  if(ok){
    localStorage.setItem(ADMIN_KEY, 'demo-token');
    window.location.href = '/admin/index.html';
  }else{
    alert('Invalid credentials');
  }
}

function guard(){
  const token = localStorage.getItem(ADMIN_KEY);
  if(!token){ window.location.href = '/admin/login.html'; }
}

function logout(){
  localStorage.removeItem(ADMIN_KEY);
  window.location.href = '/admin/login.html';
}

if(location.pathname.endsWith('/login.html')){
  document.getElementById('admin-login-form').addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = document.getElementById('admin-email').value.trim();
    const pass = document.getElementById('admin-password').value;
    login(email, pass);
  });
}else{
  guard();
  document.getElementById('admin-logout').addEventListener('click', logout);
}

export { guard };
