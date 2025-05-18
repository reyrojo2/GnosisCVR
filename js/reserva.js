function mostrarForm(selector) {
    document.querySelector(selector).style.display = 'flex';
    document.querySelector("#overlay").style.display = 'block';
}

const form = document.getElementById("reserva-form");
const linkReserva = document.getElementById("menu-reserva");
const botonReserva = document.getElementById("boton-reserva");
const mensajeDiv = document.getElementById("mensaje-container");
let mensaje = document.querySelector(".mensaje");

async function reserva(e) {
    e.preventDefault();

    const indicadorCarga = document.createElement('div');
    indicadorCarga.id = 'loading-indicator';
    indicadorCarga.textContent = 'Enviando...';
    indicadorCarga.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(255, 255, 255, 0.7); color: black; padding: 20px; border-radius: 5px; z-index: 10000;';
    document.body.appendChild(indicadorCarga);
    
    const data = Object.fromEntries(new FormData(form).entries());
    
    try {
        const success = await guardarForm(data);
        document.body.removeChild(indicadorCarga);

        if (success) {
            const nombre = document.getElementById("nombre").value;

            document.querySelector(".form-container").style.display = 'none';
            mensajeDiv.style.display = "block";
            mensaje.style.color = 'black';

            mensaje.innerHTML = `¡Gracias por tu reserva, ${nombre}!`;

            setTimeout(() => {
                document.querySelector("#overlay").style.display = 'none';
                document.querySelector(".form-container").style.display = 'none';
                mensajeDiv.style.display = 'none';
            }, 1500);

            form.reset();
        } else {
            mensajeDiv.style.display = "block";
            mensaje.innerHTML = `Error al enviar el formulario. Por favor, inténtalo de nuevo`;
            mensaje.style.color = 'red';
        }
    } catch (err) {
        document.body.removeChild(indicadorCarga);
        mensajeDiv.style.display = "block";
        mensaje.innerHTML = `Error inesperado. Por favor, inténtalo de nuevo`;
        mensaje.style.color = 'red';
    }
}

async function guardarForm(data) {
    try {        
        const res = await fetch('https://gnosiscvr-backend.onrender.com/guardar-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            mode: 'cors'
        });
        
        if (res.ok) {
            const msg = await res.text();
            console.log(msg);
            return true;
        } else {
            const errorMsg = await res.text();
            console.error("Error del servidor:", errorMsg);
            return false;
        }
    } catch (err) {
        console.error("Error de red:", err);
        return false;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    
    if (botonReserva) {
        botonReserva.addEventListener("click", () => mostrarForm('.form-container'));
    }
    
    if (form) {
        form.addEventListener("submit", reserva);
    }
    
    if (linkReserva) {
        linkReserva.addEventListener('click', () => mostrarForm('.form-container'));
    }
    
    const cerrarReserva = document.getElementById("cerrar-reserva");
    if (cerrarReserva) {
        cerrarReserva.addEventListener("click", () => {
            document.querySelector("#overlay").style.display = 'none';
            document.querySelector(".form-container").style.display = 'none';
        });
    }
});