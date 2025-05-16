document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem("admin_jwt");
    
    if (!token) {
        window.location.href = "../login.html";
        return;
    }
    
    verificarToken(token).then(esValido => {
        if (!esValido) {
            localStorage.removeItem("admin_jwt");
            sessionStorage.removeItem("admin_user");
            window.location.href = "../login.html";
        } else {
            construirDashboard();
            cargarDatos();
        }
    }).catch(error => {
        console.error("Error al verificar token:", error);
        localStorage.removeItem("admin_jwt");
        sessionStorage.removeItem("admin_user");
        window.location.href = "../login.html";
    });
});

async function verificarToken(token) {
    try {
        const response = await fetch("https://gnosiscvr-backend.onrender.com/verify-token", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            mode: "cors"
        });
        
        return response.ok;
    } catch (error) {
        console.error("Error al verificar el token:", error);
        return false;
    }
}

//interfaz dinamica
function construirDashboard() {
    const container = document.getElementById("app-container");
    if (!container) {
        console.error("No se encontró el contenedor principal");
        return;
    }
    
    container.innerHTML = `
        <header class="dashboard-header">
            <div class="logo">
                <h1>GnosisCVR Admin</h1>
            </div>
            <div class="user-info" id="user-info">
                <!-- Información del usuario logueado -->
            </div>
            <button id="logout-button" class="btn-logout">Cerrar Sesión</button>
        </header>
        
        <div class="dashboard-content">
            <aside class="sidebar">
                <nav>
                    <ul>
                        <li><a href="#" class="active" data-section="usuarios">Usuarios</a></li>
                        <li><a href="#" data-section="formularios">Formularios</a></li>
                        <li><a href="#" data-section="configuracion">Configuración</a></li>
                    </ul>
                </nav>
            </aside>
            
            <main class="main-content">
                <div id="mensaje-container"></div>
                
                <section id="seccion-usuarios" class="seccion-dashboard active">
                    <h2>Gestión de Usuarios</h2>
                    <div class="actions-bar">
                        <button id="btn-nuevo-usuario" class="btn-primary">Nuevo Usuario</button>
                        <div class="search-bar">
                            <input type="text" id="buscar-usuario" placeholder="Buscar usuario...">
                            <button class="btn-search">Buscar</button>
                        </div>
                    </div>
                    <div id="tabla-datos" class="data-container">
                        <p>Cargando datos...</p>
                    </div>
                </section>
                
                <section id="seccion-formularios" class="seccion-dashboard">
                    <h2>Formularios Recibidos</h2>
                    <div id="tabla-formularios" class="data-container">
                        <p>Cargando formularios...</p>
                    </div>
                </section>
                
                <section id="seccion-configuracion" class="seccion-dashboard">
                    <h2>Configuración</h2>
                    <div class="config-form">
                        <h3>Ajustes de la aplicación</h3>
                        <form id="form-config">
                        </form>
                    </div>
                </section>
            </main>
        </div>
        
        <div id="modal-usuario" class="modal">
            <div class="modal-content">
                <h3 id="modal-title">Nuevo Usuario</h3>
                <form id="form-usuario">
                    <div class="form-group">
                        <label for="email">Email:</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="nombre">Nombre:</label>
                        <input type="text" id="nombre" name="nombre" required>
                    </div>
                    <div class="form-group">
                        <label for="pass">Contraseña:</label>
                        <input type="password" id="pass" name="pass">
                        <small id="pass-hint">(en blanco para mantener la actual)</small>
                    </div>
                    <div class="form-group">
                        <label for="role">Rol:</label>
                        <select id="role" name="role">
                            <option value="admin">Administrador</option>
                            <option value="user">Usuario</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="active">Estado:</label>
                        <select id="active" name="active">
                            <option value="true">Activo</option>
                            <option value="false">Inactivo</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Guardar</button>
                        <button type="button" id="btn-cancelar" class="btn-secondary">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    configurarEventos();

    mostrarInfoUsuario();
}

function mostrarInfoUsuario() {
    const userInfoElement = document.getElementById("user-info");
    if (!userInfoElement) return;
    
    const userData = JSON.parse(sessionStorage.getItem("admin_user") || "{}");
    
    if (userData.email) {
        userInfoElement.innerHTML = `
            <span class="user-email">${userData.email}</span>
            <span class="user-role">${userData.role || 'admin'}</span>
        `;
    } else {
        userInfoElement.innerHTML = `<span>Administrador</span>`;
    }
}

function configurarEventos() {
    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
        logoutButton.addEventListener("click", function() {
            localStorage.removeItem("admin_jwt");
            sessionStorage.removeItem("admin_user");
            window.location.href = "../login.html";
        });
    }
    const navLinks = document.querySelectorAll(".sidebar a");
    navLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            
            navLinks.forEach(l => l.classList.remove("active"));
            
            this.classList.add("active");
            
            const secciones = document.querySelectorAll(".seccion-dashboard");
            secciones.forEach(seccion => seccion.classList.remove("active"));

            const seccionId = `seccion-${this.dataset.section}`;
            document.getElementById(seccionId).classList.add("active");
        });
    });
    
    const btnNuevoUsuario = document.getElementById("btn-nuevo-usuario");
    const modalUsuario = document.getElementById("modal-usuario");
    const btnCancelar = document.getElementById("btn-cancelar");
    
    if (btnNuevoUsuario && modalUsuario) {
        btnNuevoUsuario.addEventListener("click", function() {
            document.getElementById("form-usuario").reset();
            document.getElementById("modal-title").textContent = "Nuevo Usuario";
            document.getElementById("pass-hint").style.display = "none";

            modalUsuario.style.display = "flex";
        });
    }
    
    if (btnCancelar && modalUsuario) {
        btnCancelar.addEventListener("click", function() {
            modalUsuario.style.display = "none";
        });
    }
    
    const formUsuario = document.getElementById("form-usuario");
    if (formUsuario) {
        formUsuario.addEventListener("submit", async function(e) {
            e.preventDefault();
            await guardarUsuario(new FormData(this));
            modalUsuario.style.display = "none";
            cargarDatos();
        });
    }
}

// cargar datos usuarios
async function cargarDatos() {
    const token = localStorage.getItem("admin_jwt");
    const tablaContainer = document.getElementById("tabla-datos");
    
    if (!tablaContainer) return;
    
    // mensajd e carga
    tablaContainer.innerHTML = "<p>Cargando datos...</p>";
    
    try {
        const response = await fetch("https://gnosiscvr-backend.onrender.com/admin/users", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            mode: "cors"
        });
        
        if (!response.ok) {
            throw new Error("Error al obtener datos");
        }
        
        const datos = await response.json();
        mostrarTablaUsuarios(datos);
    } catch (error) {
        console.error("Error al cargar datos:", error);
        tablaContainer.innerHTML = `<p class="error-mensaje">Error al cargar datos: ${error.message}</p>`;
    }
}

// Mostrar tabla usuarios
function mostrarTablaUsuarios(usuarios) {
    const tablaContainer = document.getElementById("tabla-datos");
    if (!tablaContainer) return;
    
    if (!usuarios || usuarios.length === 0) {
        tablaContainer.innerHTML = "<p>No hay usuarios registrados</p>";
        return;
    }
    
    const tabla = document.createElement("table");
    tabla.className = "tabla-admin";
    
    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");
    
    const columnas = ["id", "email", "nombre", "role", "active", "created_at"];
    const columnasVisibles = ["ID", "Email", "Nombre", "Rol", "Estado", "Fecha Creación", "Acciones"];
    
    columnasVisibles.forEach(col => {
        const th = document.createElement("th");
        th.textContent = col;
        trHead.appendChild(th);
    });
    
    thead.appendChild(trHead);
    tabla.appendChild(thead);
    
    const tbody = document.createElement("tbody");
    
    usuarios.forEach(usuario => {
        const tr = document.createElement("tr");
        
        columnas.forEach(campo => {
            const td = document.createElement("td");
            
            if (campo === "active") {
                td.textContent = usuario[campo] ? "Activo" : "Inactivo";
                td.className = usuario[campo] ? "estado-activo" : "estado-inactivo";
            } else if (campo === "created_at") {
                const fecha = new Date(usuario[campo]);
                td.textContent = fecha.toLocaleDateString();
            } else {
                td.textContent = usuario[campo] || "-";
            }
            
            tr.appendChild(td);
        });
        
        const tdAcciones = document.createElement("td");
        tdAcciones.className = "acciones";
        
        const btnEditar = document.createElement("button");
        btnEditar.className = "btn-editar";
        btnEditar.textContent = "Editar";
        btnEditar.addEventListener("click", () => editarUsuario(usuario));
        
        const btnEstado = document.createElement("button");
        btnEstado.className = usuario.active ? "btn-desactivar" : "btn-activar";
        btnEstado.textContent = usuario.active ? "Desactivar" : "Activar";
        btnEstado.addEventListener("click", () => cambiarEstadoUsuario(usuario.id, !usuario.active));
        
        tdAcciones.appendChild(btnEditar);
        tdAcciones.appendChild(btnEstado);
        tr.appendChild(tdAcciones);
        
        tbody.appendChild(tr);
    });
    
    tabla.appendChild(tbody);
    
    //limpiar y agregar nueva tabla
    tablaContainer.innerHTML = "";
    tablaContainer.appendChild(tabla);
}

function editarUsuario(usuario) {
    const modal = document.getElementById("modal-usuario");
    const form = document.getElementById("form-usuario");
    const modalTitle = document.getElementById("modal-title");
    const passHint = document.getElementById("pass-hint");
    
    if (!modal || !form) return;
    
    modalTitle.textContent = "Editar Usuario";
    
    passHint.style.display = "inline";
    
    form.email.value = usuario.email || "";
    form.nombre.value = usuario.nombre || "";
    form.pass.value = ""; 
    form.role.value = usuario.role || "user";
    form.active.value = usuario.active === false ? "false" : "true";

    form.dataset.userId = usuario.id;
    
    modal.style.display = "flex";
}

// Guardar usuario 
async function guardarUsuario(formData) {
    const token = localStorage.getItem("admin_jwt");
    const form = document.getElementById("form-usuario");
    const userId = form.dataset.userId;
    
    const data = Object.fromEntries(formData.entries());
    
    data.active = data.active === "true";
    
    if (userId && !data.pass) {
        delete data.pass;
    }
    
    try {
        let url, method;
        
        if (userId) {
            url = `https://gnosiscvr-backend.onrender.com/admin/users/${userId}`;
            method = "PATCH";
        } else {
            url = "https://gnosiscvr-backend.onrender.com/save-user";
            method = "POST";
        }
        
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data),
            mode: "cors"
        });
        
        if (!response.ok) {
            throw new Error("Error al guardar usuario");
        }
        
        mostrarMensaje("Usuario guardado con éxito", "success");
        return true;
    } catch (error) {
        console.error("Error al guardar usuario:", error);
        mostrarMensaje(`Error: ${error.message}`, "error");
        return false;
    }
}

async function cambiarEstadoUsuario(userId, nuevoEstado) {
    const token = localStorage.getItem("admin_jwt");
    
    try {
        const response = await fetch(`https://gnosiscvr-backend.onrender.com/admin/users/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ active: nuevoEstado }),
            mode: "cors"
        });
        
        if (!response.ok) {
            throw new Error("Error al cambiar estado del usuario");
        }

        cargarDatos();
        
        mostrarMensaje(
            `Usuario ${nuevoEstado ? "activado" : "desactivado"} correctamente`, 
            "success"
        );
    } catch (error) {
        console.error("Error al cambiar estado:", error);
        mostrarMensaje(`Error: ${error.message}`, "error");
    }
}

function mostrarMensaje(texto, tipo = "info") {
    const mensajeContainer = document.getElementById("mensaje-container");
    if (!mensajeContainer) return;
    
    const mensaje = document.createElement("div");
    mensaje.className = `mensaje mensaje-${tipo}`;
    mensaje.textContent = texto;
    
    mensajeContainer.innerHTML = "";
    mensajeContainer.appendChild(mensaje);
    
    setTimeout(() => {
        mensajeContainer.innerHTML = "";
    }, 4000);
}