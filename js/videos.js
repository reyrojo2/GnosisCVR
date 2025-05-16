import { printTexto } from "./cajas_info.js";

let intervaloActual;
let video1, video2, indice;
let videos = [
    "../videos/primero.mp4",
    "../videos/segunda.mp4",
    "../videos/tercera.mp4",
    "../videos/cuarta.mp4"
];

const btns2 = [
    "btn_prev1",
    "btn_prev2",
    "btn_prev3",
    "btn_prev4"
]

const titles = ["title-desc2", "title-desc3", "title-desc4","title-desc5"];
const descs = ["p-desc-ft1", "p-desc-ft2", "p-desc-ft3", "p-desc-ft4"];

function cambiarTitleDesc(i) {
    for (let j = 0; j < btns2.length; j++) {
        const mostrar = (j === i) ? "block" : "none";
        document.getElementById("title-desc1").style.display = "none";
        document.getElementById(titles[j]).style.display = mostrar;
        document.getElementById(descs[j]).style.display = mostrar;
        printTexto(titles[j]);
    }
}

function carouselVideos(x) {
    
    // Limpiar el intervalo si existe para no crear mas instancias
    if (intervaloActual) {
        clearInterval(intervaloActual);
    }

    video1 = document.querySelector(".video1");
    video2 = document.querySelector(".video2");
    indice = x;

    cambiarVideo(indice);
    slider();
}

// Cambia el video actual pro el siguiente en lal lista
function cambiarVideo(i) {
    const actual = obtenerActual();
    const siguiente = obtenerSiguiente(actual);
    siguiente.src = videos[i];
    siguiente.load();

    siguiente.onloadeddata = () => {
        crossfade(siguiente, actual);
    };
}

// Obtener video actual
function obtenerActual() {
    return video1.classList.contains("actual") ? video1 : video2;
}

// Obtener video siguiente
function obtenerSiguiente(actual) {
    return actual === video1 ? video2 : video1;
}

// Crossfade para transicion
function crossfade(siguiente, actual) {
    siguiente.play();
    siguiente.classList.add("actual");
    actual.classList.remove("actual");

    siguiente.style.opacity = 1;
    actual.style.opacity = 0;
}

// Cambia de video cada 6 segundos y reiniciia cuando se llama
function slider() {
    intervaloActual = setInterval(() => {
        indice = (indice + 1) % videos.length;
        cambiarVideo(indice);
    }, 6000);
}


document.addEventListener('DOMContentLoaded', function () {
    for (let i = 0; i < btns2.length; i++) {
        const btn = document.getElementById(btns2[i]);
        btn.addEventListener('click', function () {
            carouselVideos(i);
            cambiarTitleDesc(i);
        });
    }
    carouselVideos(0);

});

export default btns2;