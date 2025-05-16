const loginForm = document.getElementById("login-form"); 

async function login(e) {
    e.preventDefault();
    
    const email = document.getElementById("email").value;
    const pass = document.getElementById("pass").value;
    
    if (!email || !pass) {
        mensajeDiv.style.display = "block";
        mensaje.innerHTML = "Por favor, complete todos los campos";
        mensaje.style.color = "red";
        return;
    }
    
    const indicadorCarga = document.createElement("div");
    indicadorCarga.id = "loading-indicator";
    indicadorCarga.textContent = "Cargando...";
    indicadorCarga.style.cssText = `
        position: fixed; top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.7);
        color: black; padding: 20px;
        border-radius: 5px; z-index: 10000;`;
    document.body.appendChild(indicadorCarga);
    
    const dataUser = {
        email: email,
        pass: pass
    };
    
    try {
        const result = await enviarFormLogin(dataUser);
        document.body.removeChild(indicadorCarga);
        
        if (result.success) {
            localStorage.setItem("admin_jwt", result.token);
            if (result.user) {
                sessionStorage.setItem("admin_user", JSON.stringify({
                    id: result.user.id,
                    email: result.user.email,
                    role: result.user.role
                }));
            }
            
            mensajeDiv.style.display = "block";
            mensaje.style.color = "green";
            mensaje.innerHTML = `¡Sesión iniciada con éxito!`;
            
            setTimeout(() => {
                document.querySelector("#overlay").style.display = "none";
                mensajeDiv.style.display = "none";
                window.location.href = "../admin/dashboard.html";
            }, 1500);
            
            loginForm.reset();
        } else {
            mensajeDiv.style.display = "block";
            mensaje.innerHTML = result.error || "Error al iniciar sesión, inténtelo de nuevo";
            mensaje.style.color = "red";
        }
    } catch (err) {
        console.error("Error en el proceso de login:", err);
        document.body.removeChild(indicadorCarga);
        mensajeDiv.style.display = "block";
        mensaje.innerHTML = `Error inesperado. Inténtelo de nuevo.`;
        mensaje.style.color = "red";
    }
}

async function enviarFormLogin(dataUser) {
    try {
        const res = await fetch("https://gnosiscvr-backend.onrender.com/login-admin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataUser),
            mode: "cors"
        });
        
        const data = await res.json();
        
        if (!res.ok) {
            return { 
                success: false, 
                error: data.error || "Error al iniciar sesion" 
            };
        }
        return { 
            success: true, 
            token: data.token,
            user: data.user
        };
    } catch (err) {
        console.error("Error de red:", err);
        return { 
            success: false, 
            error: "Error de conexion" 
        };
    }
}

function verificarEstadoAuth() {
    const token = localStorage.getItem("admin_jwt");
    if (token) {
        if (window.location.pathname.includes("/login.html")) {
            window.location.href = "../admin/dashboard.html";
        }
    } else {
        if (!window.location.pathname.includes("/login.html") && 
            window.location.pathname.includes("/admin/")) {
            window.location.href = "/login.html";
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    verificarEstadoAuth();
    
    if (loginForm) {
        loginForm.addEventListener("submit", login);
    }
});