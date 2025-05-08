function contador(selector) {
    const fechaFinal = new Date(2025, 5, 5, 1, 5, 0);

    function actualizarContador() {
        const hoy = new Date();
        const tiempoRest = Math.floor((fechaFinal - hoy) / 1000);
        const parrafo = document.getElementById(selector);

        if (tiempoRest <= 0) {
            parrafo.innerHTML = "¡Hoy es el gran día!";
            return;
        }

        const dias = Math.floor(tiempoRest / (3600 * 24));
        const horas = Math.floor((tiempoRest / 3600) % 24);
        const minutos = Math.floor((tiempoRest / 60) % 60);
        const segundos = Math.floor((tiempoRest) % 60);

        const d = dias < 10 ? "0" + dias : dias;
        const h = horas < 10 ? "0" + horas : horas;
        const m = minutos < 10 ? "0" + minutos : minutos;
        const s = segundos < 10 ? "0" + segundos : segundos;

        parrafo.innerHTML = `${d}D ${h}h ${m}min ${s}sec <br>`;
        setTimeout(actualizarContador, 1000);
    }
    actualizarContador();
}

  
document.addEventListener('DOMContentLoaded', function () {
    contador("p-contador");
});