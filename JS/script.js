const raiz = document.documentElement;

if (localStorage.getItem('tema') === 'oscuro') {
    raiz.classList.add('dark');
}

const cabecera = document.querySelector('.cabecera');
const inicio = document.getElementById('inicio');

function actualizarCabecera() {
    const estilos = getComputedStyle(raiz);
    const fondo = estilos.getPropertyValue('--color-fondo').trim();
    const texto = estilos.getPropertyValue('--color-texto').trim();

    if (fondo === '' || texto === '') {
        return;
    }

    const recorrido = Math.max(inicio.offsetHeight - cabecera.offsetHeight, 1);
    let progreso = (window.scrollY - inicio.offsetTop) / recorrido;
    progreso = Math.max(0, Math.min(progreso, 1));

    const canalesFondo = [];
    const canalesTexto = [];
    const canalesEnlaces = [];

    for (let posicion = 1; posicion < 7; posicion = posicion + 2) {
        canalesFondo.push(parseInt(fondo.substring(posicion, posicion + 2), 16));
        canalesTexto.push(parseInt(texto.substring(posicion, posicion + 2), 16));
    }

    for (let indice = 0; indice < 3; indice = indice + 1) {
        const canal = canalesFondo[indice] + (canalesTexto[indice] - canalesFondo[indice]) * progreso;
        canalesEnlaces.push(Math.round(canal));
    }

    cabecera.style.backgroundColor = 'rgba(' + canalesFondo.join(', ') + ', ' + progreso + ')';
    cabecera.style.color = 'rgb(' + canalesEnlaces.join(', ') + ')';
}

window.addEventListener('load', actualizarCabecera);
window.addEventListener('scroll', actualizarCabecera);
window.addEventListener('resize', actualizarCabecera);

actualizarCabecera();
