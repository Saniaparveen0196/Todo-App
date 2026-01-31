const API = "http://127.0.0.1:5000";
let currentFilter = "all";

/* ---------- AUTH ---------- */

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    fetch(`${API}/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: username,
            password: password
        })
    }).then(res => {
        if (res.ok) {
            window.location.href = "index.html";
        } else {
            alert("Invalid login credentials");
        }
    });
}

function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        if (res.ok) {
            window.location.href = "login.html";
        }
    });
}

function logout() {
    fetch(`${API}/logout`, {
        method: "POST",
        credentials: "include"
    }).then(() => {
        window.location.href = "login.html";
    });
}

/* ---------- TASKS ---------- */

function loadTasks() {
    fetch(`${API}/tasks`, { credentials: "include" })
        .then(res => {
            if (res.status === 401) {
                window.location.href = "login.html";
                return [];
            }
            return res.json();
        })
        .then(tasks => {
            const taskList = document.getElementById("taskList");
            taskList.innerHTML = "";
            
            const filteredTasks = tasks.filter(t => 
                currentFilter === "all" || t.status === currentFilter
            );
            
            if (filteredTasks.length === 0) {
                taskList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📝</div>
                        <p>No tasks found</p>
                        <p>Add a new task to get started!</p>
                    </div>
                `;
                return;
            }
            
            filteredTasks.forEach(t => {
                const taskItem = document.createElement("li");
                taskItem.className = t.status === "done" ? "completed" : "";
                
                taskItem.innerHTML = `
                    <div class="task-content">
                        <div class="task-title">${t.title}</div>
                        ${t.description ? `<div class="task-description">${t.description}</div>` : ''}
                        <span class="task-status status-${t.status}">${t.status}</span>
                    </div>
                    <div class="task-actions">
                        <button onclick="toggle(${t.id}, '${t.status}')">
                            ${t.status === "pending" ? "Mark Done" : "Mark Pending"}
                        </button>
                        <button onclick="del(${t.id})">Delete</button>
                    </div>
                `;
                
                taskList.appendChild(taskItem);
            });
            
            // Update active filter button
            document.querySelectorAll('.filters button').forEach(btn => {
                if (btn.textContent.toLowerCase() === currentFilter) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        });
}

function addTask() {
    const title = document.getElementById("title");
    const description = document.getElementById("description");
    
    if (!title.value.trim()) {
        alert("Please enter a task title");
        return;
    }
    
    fetch(`${API}/tasks`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: title.value,
            description: description.value
        })
    }).then(() => {
        title.value = "";
        description.value = "";
        loadTasks();
    });
}

function toggle(id, status) {
    fetch(`${API}/tasks/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            status: status === "pending" ? "done" : "pending"
        })
    }).then(loadTasks);
}

function del(id) {
    if (!confirm("Are you sure you want to delete this task?")) {
        return;
    }
    
    fetch(`${API}/tasks/${id}`, {
        method: "DELETE",
        credentials: "include"
    }).then(loadTasks);
}

function setFilter(filter) {
    currentFilter = filter;
    loadTasks();
}

// Add event listeners for Enter key in login/register
document.addEventListener('DOMContentLoaded', function() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    if (usernameInput && passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                if (document.querySelector('button[onclick="login()"]')) {
                    login();
                } else if (document.querySelector('button[onclick="register()"]')) {
                    register();
                }
            }
        });
    }
    
    // Add event listener for Enter key in task input
    const taskTitleInput = document.getElementById('title');
    if (taskTitleInput) {
        taskTitleInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTask();
            }
        });
    }
    
    // Load tasks if on task page
    if (document.getElementById("taskList")) {
        loadTasks();
    }
});