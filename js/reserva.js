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

        document.querySelector(".form-container").style.display = 'none';
        mensajeDiv.style.display = "block";

        mensaje.innerHTML = `¡Gracias por tu reserva, ${nombre}!`
       
        //Pasando 1.5 segundos, se oculta el overlay, el form y el mensaje
        setTimeout(() => {
            document.querySelector("#overlay").style.display = 'none';
            document.querySelector(".form-container").style.display = 'none';
            mensajeDiv.style.display = 'none';
        }, 1500);

        //para enviar formulario
        const data = Object.fromEntries(new FormData(form).entries());
        guardarForm(data);

        form.reset();
}

document.addEventListener("DOMContentLoaded", function () {
    if (botonReserva) {
        botonReserva.addEventListener("click", () => mostrarForm('.form-container'));
    }
    
    form.addEventListener("submit", function (e) {
        reserva(e);
    });

    linkReserva.addEventListener('click', () => mostrarForm('.form-container'))

    document.getElementById("cerrar-reserva").addEventListener("click", () => {
        document.querySelector("#overlay").style.display = 'none';
        document.querySelector(".form-container").style.display = 'none';
    });
});


const SUPABASE_URL = 'https://hogwabktijnpthrpvoxe.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZ3dhYmt0aWpucHRocnB2b3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NTQ3MDMsImV4cCI6MjA2MjQzMDcwM30.aqkxIxn2-bVnveFh0kWLdn3gzJlWmrQkBZjNib0F5RI';

async function guardarForm(data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/forms_prereg`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
        },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        console.log("Formulario enviado correctamente")
    } else {
        const error = await res.text();
        console.error("Error: ", error)
        console.log("Hubo un error al enviar el formulario");
    }
}
