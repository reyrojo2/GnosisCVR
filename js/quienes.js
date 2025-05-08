function activarRuido() {
    const ruido = document.getElementById('ruido');
    const fake = document.getElementById('equipo-fake');
    const real = document.getElementById('equipo-real');
    const audio = document.getElementById('audio');

    ruido.style.display = 'block';
    audio.playbackRate = 0.5;
    audio.volume = 0.5;
    audio.play();
    // Después de 5 segundos, cambiar la vista
    setTimeout(() => {
        ruido.style.display = "none";
        fake.style.display = "none";
        real.style.display = "block";
        audio.pause();
        audio.currentTime = 0;
    }, 5000);
}
