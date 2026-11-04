const raiz = document.documentElement;

if (localStorage.getItem('tema') === 'oscuro') {
    raiz.classList.add('dark');
}

$(function () {
    const cabecera = $('.cabecera');
    const inicio = $('#inicio');
    const contenido = $('.contenido');
    const contenidoInicio = $('.contenido-inicio');

    function colocarCabecera() {
        const altoPantalla = $(window).height();
        const altoCabecera = cabecera.outerHeight();
        const altoContenido = contenidoInicio.outerHeight();
        const espacioDisponible = (altoPantalla - altoContenido) / 2 - altoCabecera - 16;
        const separacionMenu = Math.max(0, Math.min(altoPantalla * 0.25, espacioDisponible));

        $('body').css('paddingTop', separacionMenu + 'px');
        contenido.css('marginTop', -(altoCabecera + separacionMenu) + 'px');

        actualizarCabecera();
    }

    function actualizarCabecera() {
        const estilos = getComputedStyle(raiz);
        const fondo = estilos.getPropertyValue('--color-fondo').trim();
        const texto = estilos.getPropertyValue('--color-texto').trim();

        if (fondo === '' || texto === '') {
            return;
        }

        const scroll = $(window).scrollTop();
        const posicionMenu = Math.max(parseFloat($('body').css('padding-top')), scroll);
        const bordeMenu = posicionMenu + cabecera.outerHeight();
        const altoContenido = contenidoInicio.outerHeight();
        const finalContenido = contenidoInicio.offset().top + altoContenido;
        const finalInicio = inicio.offset().top + inicio.outerHeight();

        let opacidadContenido = (finalContenido - bordeMenu) / Math.max(altoContenido, 1);
        opacidadContenido = Math.max(0, Math.min(opacidadContenido, 1));
        contenidoInicio.css('opacity', opacidadContenido);

        const recorrido = Math.max(finalInicio - finalContenido, 1);
        let progreso = (bordeMenu - finalContenido) / recorrido;
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

        cabecera.css({
            backgroundColor: 'rgba(' + canalesFondo.join(', ') + ', ' + progreso + ')',
            color: 'rgb(' + canalesEnlaces.join(', ') + ')'
        });
    }

    $(window).on('load resize', colocarCabecera);
    $(window).on('scroll', actualizarCabecera);

    colocarCabecera();
});
