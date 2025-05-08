//Rotacion
let i = 1;
const backgroundImages = document.querySelectorAll('.background-image');
function rotacion() {
    const currentImage = document.querySelector('.background-image.active');
    currentImage.classList.remove('active');
    i++;
    if (i > 4) i = 1;
    backgroundImages[i - 1].classList.add('active');
    setTimeout(rotacion, 3000);
}
;
document.body.setAttribute("onload", "rotacion()");