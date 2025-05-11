function mostrarForm(selector) {
    document.querySelector(selector).style.display = 'flex';
    document.querySelector("#overlay").style.display = 'block';
}

const form = document.getElementById("reserva-form");
const linkReserva = document.getElementById("menu-reserva");
const botonReserva = document.getElementById("boton-reserva");

function reserva(e) {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());
    guardarForm(data);

    const mensajeDiv = document.getElementById("mensaje-container");
    let mensaje = document.querySelector(".mensaje");

    const nombre = document.getElementById("nombre").value;

    document.querySelector(".form-container").style.display = 'none';
    mensajeDiv.style.display = "block";

    mensaje.innerHTML = `¡Gracias por tu reserva, ${nombre}!`;

    setTimeout(() => {
        document.querySelector("#overlay").style.display = 'none';
        document.querySelector(".form-container").style.display = 'none';
        mensajeDiv.style.display = 'none';
    }, 1500);

    form.reset();
}

async function guardarForm(data) {
    const res = await fetch('https://gnosiscvr-backend.onrender.com/guardar-form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        console.log("Formulario enviado correctamente");
    } else {
        console.error("Ocurrió un error al guardar el formulario");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    if (botonReserva) {
        botonReserva.addEventListener("click", () => mostrarForm('.form-container'));
    }

    form.addEventListener("submit", reserva);

    linkReserva.addEventListener('click', () => mostrarForm('.form-container'));

    document.getElementById("cerrar-reserva").addEventListener("click", () => {
        document.querySelector("#overlay").style.display = 'none';
        document.querySelector(".form-container").style.display = 'none';
    });
});
