const botonTema = document.getElementById("boton-tema");
const estiloIndex = document.getElementById("style");
const estiloQuienes = document.getElementById("style2");
const estiloSobreNos = document.getElementById("style3");
const estiloLogin = document.getElementById("style4");
const estiloDashboard = document.getElementById("style5");

let temaOscuro = false;

// Funcion para cambiar el tema
function cambiarTema() {
    if (temaOscuro) {
        estiloIndex.setAttribute("href", "../css/index-light.css");
        if (estiloQuienes) {
            estiloQuienes.setAttribute("href", "../css/quienes-light.css");
        }
        if (estiloSobreNos) {
            estiloSobreNos.setAttribute("href", "../css/sobrenosotros-light.css");
        }
        if (estiloLogin) {
            estiloLogin.setAttribute("href", "../css/login-light.css");
        }
        if (estiloDashboard) {
            estiloDashboard.setAttribute("href", "../css/dashboard-light.css");
        }
    } else {
        estiloIndex.setAttribute("href", "../css/index-dark.css");
        if (estiloQuienes) {
            estiloQuienes.setAttribute("href", "../css/quienes-dark.css");
        }
        if (estiloSobreNos) {
            estiloSobreNos.setAttribute("href", "../css/sobrenosotros-dark.css");
        }
        if (estiloLogin) {
            estiloLogin.setAttribute("href", "../css/login-dark.css");
        }
        if (estiloDashboard) {
            estiloDashboard.setAttribute("href", "../css/dashboard-dark.css");
        }
    }

}

//funcion para cambiar colores de forma dianmica
function cambiarColor(selector, propiedad) {
    const elemento = document.querySelector(selector);

    if (elemento) {
        let hue = 0;

        function actualizarColor() {
            const color = `hsla(${hue}, 100%, 50%, 0.7)`;
            elemento.style[propiedad] = color;
            hue = (hue + 1) % 360;
            setTimeout(actualizarColor, 20);
        }

        actualizarColor();
    }
}

// Leer del localStorage al cargar
document.addEventListener('DOMContentLoaded', function () {
    // Comprobar si ya hay un valor guardado
    const temaGuardado = localStorage.getItem("temaOscuro");

    if (temaGuardado !== null) {
        temaOscuro = temaGuardado === "true";
        cambiarTema();
    }

    botonTema.addEventListener("click", function () {
        temaOscuro = !temaOscuro;
        localStorage.setItem("temaOscuro", temaOscuro);
        cambiarTema();
    });

    cambiarColor("#modelo1", "backgroundColor");
    cambiarColor("#modelo2", "backgroundColor");
});