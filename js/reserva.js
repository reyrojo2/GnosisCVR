function mostrarForm(selector) {
    document.querySelector(selector).style.display = 'flex';
    document.querySelector("#overlay").style.display = 'block';
}

const form = document.getElementById("reserva-form");
const linkReserva = document.getElementById("menu-reserva");
const botonReserva = document.getElementById("boton-reserva");

function reserva(e) {
        e.preventDefault();

        const mensajeDiv = document.getElementById("mensaje-container");
        let mensaje = document.querySelector(".mensaje");

        const nombre = document.getElementById("nombre").value;



        form.reset();

        document.querySelector(".form-container").style.display = 'none';
        mensajeDiv.style.display = "block";

        mensaje.innerHTML = `¡Gracias por tu reserva, ${nombre}!`
       
        //Pasando 1.5 segundos, se oculta el overlay, el form y el mensaje
        setTimeout(() => {
            document.querySelector("#overlay").style.display = 'none';
            document.querySelector(".form-container").style.display = 'none';
            mensajeDiv.style.display = 'none';
        }, 1500);
}

document.addEventListener("DOMContentLoaded", function () {
    if (botonReserva) {
        botonReserva.addEventListener("click", () => mostrarForm('.form-container'));
    }
    
    form.addEventListener("submit", (e) => reserva(e));
    linkReserva.addEventListener('click', () => mostrarForm('.form-container'))

    document.getElementById("cerrar-reserva").addEventListener("click", () => {
        document.querySelector("#overlay").style.display = 'none';
        document.querySelector(".form-container").style.display = 'none';
    });
});

