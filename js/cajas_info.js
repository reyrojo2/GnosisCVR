import btns2 from './videos.js';

const btns = ["btn4", "btn1", "btn2", "btn3"];


function printTexto(selector) {
    let elemento = document.getElementById(selector);
    let texto = elemento.innerText;
    let i = 0;

    elemento.innerHTML = '';

    function print() {
        bloquearBtns(btns, true);
        bloquearBtns(btns2, true);
        
        if (i < texto.length) {
            elemento.innerHTML += texto.charAt(i);
            i++;
            setTimeout(print, 50);
        } else {
            bloquearBtns(btns, false);
            bloquearBtns(btns2, false);
        }
    }
    print();
}

function bloquearBtns (array, estado) {
    for (let i = 0; i < btns.length; i++) {
        const btn = document.getElementById(array[i]);
        btn.disabled = estado;
    }
}

function cambiarCaja(i) {
    const titles = ["title1", "title2", "title3", "title4"];
    const contents = ["content1", "content2", "content3", "content4"];
    const models = ["modelo1", "modelo2"];

    for (let j = 0; j < titles.length; j++) {
        const mostrar = (j === i) ? "block" : "none";
        document.getElementById(titles[j]).style.display = mostrar;
        document.getElementById(contents[j]).style.display = mostrar;
        printTexto(titles[j]);
    }
    
    if (i === 0) {
        document.getElementById(models[0]).style.display = "block";
        document.getElementById(models[1]).style.display = "none";
    }
    if (i === 3) {
        document.getElementById(models[1]).style.display = "block";
        document.getElementById(models[0]).style.display = "none";
    }
}

document.addEventListener('DOMContentLoaded', function () {
    for (let i = 0; i < btns.length; i++) {
        const btn = document.getElementById(btns[i]);
        btn.addEventListener('click', () => {cambiarCaja(i)})
    }
    printTexto('title1');
})

export { printTexto };