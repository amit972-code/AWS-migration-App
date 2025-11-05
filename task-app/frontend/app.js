const API_URL = "http://backend:3000/api";

let currentUser = null;

// Show Register/Login forms
function showRegister(){ document.getElementById("loginForm").classList.add("hidden"); document.getElementById("registerForm").classList.remove("hidden"); }
function showLogin(){ document.getElementById("registerForm").classList.add("hidden"); document.getElementById("loginForm").classList.remove("hidden"); }

// Login
async function login(){
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const res = await fetch("http://localhost:3000/api/login", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({username,password})
  });
  const data = await res.json();
  if(res.ok){ currentUser = data; document.getElementById("loginForm").classList.add("hidden"); document.getElementById("dashboard").classList.remove("hidden"); loadTasks(); }
  else alert(data.error);
}

// Register
async function register(){
  const username = document.getElementById("regUsername").value;
  const password = document.getElementById("regPassword").value;
  const res = await fetch("http://localhost:3000/api/register", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({username,password})
  });
  const data = await res.json();
  if(res.ok){ alert("Registered! Login now."); showLogin(); }
  else alert(data.error);
}

// Logout
function logout(){ currentUser=null; document.getElementById("dashboard").classList.add("hidden"); document.getElementById("loginForm").classList.remove("hidden"); }

// Load tasks
async function loadTasks(){
  const res = await fetch(`http://localhost:3000/api/tasks/${currentUser.userId}`);
  const tasks = await res.json();
  const ul = document.getElementById("taskList");
  ul.innerHTML="";
  tasks.forEach(t=>{
    const li = document.createElement("li");
    li.textContent = t.task_name;
    const btn = document.createElement("button");
    btn.textContent="Delete";
    btn.onclick = async ()=>{ await fetch(`http://localhost:3000/api/tasks/${t.id}`, {method:"DELETE"}); loadTasks(); };
    li.appendChild(btn);
    ul.appendChild(li);
  });
}

// Add task
async function addTask(){
  const taskInput = document.getElementById("newTask");
  const task = taskInput.value.trim();
  if(!task) return alert("Enter a task");
  await fetch("http://localhost:3000/api/tasks", {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({userId:currentUser.userId, task_name:task})});
  taskInput.value="";
  loadTasks();
}
