const elemAOcultar = [
    "header",
    "#model-section",
    "#preview-menu",
    "#preview-desc",
    ".botones",
    "#reserva-section",
    "#overlay",
    "#footer",
    "#model-info-container",
    "#modelo1",
    "#btn1",
    "#btn2",
    "#btn3",
    "#btn4",
    "#preview-container"
];

const estilosModelContainer = [
    ["display", "block"],
    ["width", "100%"],
    ["height", "100%"],
    ["border-radius", "0"],
];

const estilosVidContainer = [
    ["display", "flex"],
    ["justify-content", "center"],
    ["gap", "0"],
    ["position", "absolute"],
    ["width", "100%"],
    ["height", "100%"],
];

function aplEstilosContainer(selector, estilos) {
    const elemento = document.querySelector(selector);
    for (let i = 0; i < estilos.length; i++) {
        const propiedad = estilos[i][0];
        const valor = estilos[i][1];
        elemento.style[propiedad] = valor;
    }
}

function ocultarElementos() {
    for (let i = 0; i < elemAOcultar.length; i++) {
        const elemento = document.querySelector(elemAOcultar[i]);
        elemento.style.display = "none";
    }
}

function aplicarEstilo(selector, estilo, valor) {
    const elemento = document.querySelector(selector);
    elemento.style[estilo] = valor;
}

function animacionPreview() {
    ocultarElementos();
    aplEstilosContainer('#preview-container', estilosVidContainer);
    aplEstilosContainer('#model-container', estilosModelContainer);
    initAnimacionModelo();

    aplicarEstilo("#preview-container", "display", "none");
    aplicarEstilo("html", "overflow", "hidden");
    aplicarEstilo("canvas", "display", "block");
    aplicarEstilo("#model-section", "display", "flex");

    setTimeout(() => {
        aplicarEstilo("#model-section", "display", "none");
        aplicarEstilo("#preview-container", "display", "flex");
        aplicarEstilo("#preview-desc", "backdropFilter", "none");

        setTimeout(() => {
            document.querySelector("canvas").remove();
            aplicarEstilo("#preview-desc", "display", "flex");
            aplicarEstilo("#preview-desc", "backdropFilter", "blur(8px)");

            setTimeout(() => {
                window.location.reload();
            }, 4000);            
        }, 5000);
    }, 1600);
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('canvas').style.display = 'none';
    document.querySelector("#boton-prueba").addEventListener('click', () => {
        animacionPreview();
    });
});


// Configurar escena
const contenedorPrincipal = document.getElementById("model-container");
const escena = new THREE.Scene();
escena.background = new THREE.Color('#ffffff');

// Cámara
const camara = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
camara.position.set(0, 2, 5);

// Renderizador
const renderizador = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderizador.setSize(window.innerWidth, window.innerHeight);
contenedorPrincipal.appendChild(renderizador.domElement);

// Iluminación 
const luces = [
    new THREE.AmbientLight(0xdfffff, 15),
    new THREE.DirectionalLight(0xFFFFFF, 1),
    new THREE.DirectionalLight(0xFFFFFF, 1),
    new THREE.DirectionalLight(0xFFFFFF, 1.5)
];

//Posicion de las DirectionalLight
luces[1].position.set(5, 10, 5);
luces[2].position.set(-5, 5, -5);
luces[3].position.set(0, -1, 5);

for (let i = 0; i < luces.length; i++) {
    escena.add(luces[i]);
}

// Controles de órbita
const controles = new THREE.OrbitControls(camara, renderizador.domElement);
controles.enableDamping = true;
controles.dampingFactor = 0.05;
controles.enableZoom = true;
controles.enabled = false;

// Variables de animación
let modelo = null;
let fase = 1;
let progreso = 0;
let progresoRotacion = 0;

// Cargar modelo
const cargador = new THREE.GLTFLoader();
cargador.setPath("../animation/animation2/");
cargador.load("scene.gltf", function (gltf) {
    modelo = gltf.scene;
    modelo.traverse((child) => {
        if (child.isMesh && child.material) {
            child.material.transparent = false;
            child.material.opacity = 1;
            child.material.side = THREE.DoubleSide;
        }
    });
    modelo.scale.set(3, 3, 3);
    modelo.position.set(0, 0, -20);
    escena.add(modelo);
}, undefined, function (error) {
    console.error("Error al cargar el modelo:", error);
});

// Animación por fases
function animarModelo() {
    if (!modelo) return;

    if (fase === 1 && progreso < 1) {
        progreso += 0.02;
        modelo.position.lerp(new THREE.Vector3(0, 1.5, 0), progreso);
        if (progreso >= 1) { progreso = 0; fase = 2; }
    }

    if (fase === 2 && progresoRotacion < Math.PI) {
        progresoRotacion += 0.1;
        modelo.rotation.y = progresoRotacion;
        if (progresoRotacion >= Math.PI) { progreso = 0; fase = 3; }
    }

    if (fase === 3 && progreso < 1) {
        progreso += 0.02;
        modelo.position.lerp(new THREE.Vector3(0, 2.5, 7.5), progreso);
    }
}

// Loop de animación
function initAnimacionModelo() {
    requestAnimationFrame(initAnimacionModelo);
    animarModelo();
    controles.update();
    renderizador.render(escena, camara);
}
