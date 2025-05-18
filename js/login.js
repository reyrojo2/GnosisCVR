const loginForm = document.getElementById("login-form"); 

function mostrarMensaje(texto, color = "red") {
    mensajeDiv.style.display = "block";
    mensaje.innerHTML = texto;
    mensaje.style.color = color;
    clearTimeout(mostrarMensaje.timeout);
    mostrarMensaje.timeout = setTimeout(() => {
        mensajeDiv.style.display = "none";
        mensaje.innerHTML = "";
    }, 3000);
}

async function login(e) {

    const email = document.getElementById("email").value.toLowerCase();
    const pass = document.getElementById("pass").value;

    if (!email || !pass) {
        mostrarMensaje("Por favor, complete todos los campos", "red");
        return;
    }

    const indicadorCarga = document.createElement("div");
    indicadorCarga.id = "loading-indicator";
    indicadorCarga.textContent = "Cargando...";
    indicadorCarga.style.cssText = `
        position: fixed; top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.78);
        color: black; padding: 4vmin;
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
            localStorage.setItem("auth_token", result.token);
            if (result.user) {
                sessionStorage.setItem("user_data", JSON.stringify({
                    id: result.user.id,
                    email: result.user.email,
                    role: result.user.role
                }));
            }

            mostrarMensaje("¡Sesión iniciada con éxito!", "green", 1500);

            setTimeout(() => {
                document.querySelector("#overlay").style.display = "none";
                mensajeDiv.style.display = "none";
                window.location.href = "../admin/dashboard.html";
            }, 1500);

            loginForm.reset();
        } else {
            mostrarMensaje(result.error || "Error al iniciar sesión, inténtelo de nuevo", "red");
        }
    } catch (err) {
        console.error("Error en el proceso de login:", err);
        document.body.removeChild(indicadorCarga);
        mostrarMensaje("Error inesperado. Inténtelo de nuevo.", "red");
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
    const token = localStorage.getItem("auth_token");
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

const elemRegistro = [
    document.querySelector("label[for='nombre']"),
    document.querySelector("label[for='confirm-pass']"),
    document.getElementById("name"),
    document.getElementById("confirm-pass"),
];
const botonLogin = document.getElementById("boton-login");
const textToggle = document.getElementById("toggle-form-p");
const toggleForm = document.getElementById("mostrar-registro");
const tituloLogin = document.querySelector(".login-container h2");

let modoRegistro = false;

toggleForm.addEventListener("click", function(e) {
    e.preventDefault();
    modoRegistro = !modoRegistro;
    if (modoRegistro) {
        tituloLogin.innerHTML = "Registrarse";
        elemRegistro.forEach(el => el.style.display = "block");
        botonLogin.textContent = "Registrarse";
        toggleForm.textContent = "¿Ya tienes cuenta? Inicia sesión";
    } else {
        tituloLogin.innerHTML = "Iniciar Sesión en el sistema";
        elemRegistro.forEach(el => el.style.display = "none");
        botonLogin.textContent = "Iniciar Sesión";
        toggleForm.textContent = "¿No tienes cuenta? Regístrate aquí";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    verificarEstadoAuth();
    
    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {    
            e.preventDefault();
            if (modoRegistro) {
                const formData = new FormData(loginForm);
                const dataNuevoUser = {};

                for (let [key, value] of formData.entries()) {
                    //exclluir ambos campos del lowercase para evitar problemas con el backend
                    if (key === "pass" || key === "confirm-pass") {
                        dataNuevoUser[key] = value;
                    } else {
                        dataNuevoUser[key] = value.toLowerCase();
                    }
                }
                
                //verificar que ambos valores sean identicos
                if (dataNuevoUser.pass !== dataNuevoUser["confirm-pass"]) {
                    mostrarMensaje("Las contraseñas no coinciden", "red");
                    return;
                }

                //aqui se elimina los key, value de confirm-pass pq no se usa en backend 
                delete dataNuevoUser["confirm-pass"];
                await registrarUser(dataNuevoUser);
            } else {
                await login(e);
            }
        });
    }
});

async function registrarUser(data) {
    try {
        let url, method;
        //ruta endpoint para registros publicos
        url = "https://gnosiscvr-backend.onrender.com/register";
        method = "POST";
        
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            mode: "cors"
        });
        
        if (!response.ok) {
            throw new Error("Error al registrarse");
        }

        const dataRes = await response.json();
        if (dataRes.token) {
            localStorage.setItem("auth_token", dataRes.token);
            sessionStorage.setItem("user_data", JSON.stringify(dataRes.user));
        }
        
        mostrarMensaje("Registración Exitosa", "success");
        return true;
    } catch (error) {
        console.error("Error al registrarse:", error);
        mostrarMensaje(`Error: ${error.message}`, "error");
        return false;
    }
}