const raiz = document.documentElement;

if (localStorage.getItem('tema') === 'oscuro') {
    raiz.classList.add('dark');
}

$(function () {
    const cabecera = $('.cabecera');
    const inicio = $('#inicio');
    const contenido = $('.contenido');
    const contenidoInicio = $('.contenido-inicio');
    const botonMenu = $('#boton-menu');
    const menu = $('#menu');

    function abrirMenu() {
        menu.addClass('menu-abierto').attr('aria-hidden', 'false');
        botonMenu.attr('aria-expanded', 'true');
        $('body').addClass('menu-activo');
        menu.find('a').first().trigger('focus');
    }

    function cerrarMenu() {
        if (menu.hasClass('menu-abierto') && window.innerWidth < 768) {
            botonMenu.trigger('focus');
        }

        menu.removeClass('menu-abierto');
        botonMenu.attr('aria-expanded', 'false');
        $('body').removeClass('menu-activo');

        if (window.innerWidth < 768) {
            menu.attr('aria-hidden', 'true');
        } else {
            menu.removeAttr('aria-hidden');
        }
    }


    function colocarCabecera() {
        cerrarMenu();

        const altoPantalla = $(window).height();
        const altoCabecera = cabecera.outerHeight();
        const altoContenido = contenidoInicio.outerHeight();
        const espacioDisponible = (altoPantalla - altoContenido) / 2 - altoCabecera - 16;
        let separacionMenu = 0;

        if (window.innerWidth >= 768) {
            separacionMenu = Math.max(0, Math.min(altoPantalla * 0.20, espacioDisponible));
        }

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

    botonMenu.on('click', function () {
        if (menu.hasClass('menu-abierto')) {
            cerrarMenu();
        } else {
            abrirMenu();
        }
    });

    $('#cerrar-menu').on('click', cerrarMenu);
    menu.find('a').on('click', cerrarMenu);

    $(document).on('keydown', function (evento) {
        if (!menu.hasClass('menu-abierto') || window.innerWidth >= 768) {
            return;
        }

        if (evento.key === 'Escape') {
            cerrarMenu();
        }

        if (evento.key === 'Tab') {
            const controles = menu.find('a, button');
            const primero = controles.first();
            const ultimo = controles.last();

            if (evento.shiftKey && document.activeElement === primero[0]) {
                evento.preventDefault();
                ultimo.trigger('focus');
            } else if (!evento.shiftKey && document.activeElement === ultimo[0]) {
                evento.preventDefault();
                primero.trigger('focus');
            }
        }
    });

    const ventanaProducto = GLightbox({
        selector: null,
        skin: 'producto',
        width: '600px',
        height: 'auto',
        preload: false,
        closeOnOutsideClick: false,
        touchNavigation: false,
        draggable: false,
        openEffect: 'none',
        closeEffect: 'none',
        svg: {
            close: '<i class="fa-solid fa-xmark" aria-hidden="true"></i>'
        }
    });

    let productoActivo = null;

    $('.abrir-producto').on('click', function (evento) {
        evento.preventDefault();
        productoActivo = $(this);

        const ficha = $('#plantilla-producto .ficha-producto').clone();
        const titulo = productoActivo.find('h3').text();

        ficha.find('img').attr({
            src: productoActivo.attr('href'),
            alt: titulo,
            loading: 'eager'
        });
        ficha.find('h2').text(titulo).attr('id', 'titulo-ficha-producto');
        ficha.find('.precio-producto').text(productoActivo.find('p').last().text());
        ficha.find('.descripcion-producto').text(productoActivo.attr('data-descripcion'));

        ventanaProducto.setElements([{
            content: ficha[0],
            type: 'inline',
            width: '600px',
            height: 'auto'
        }]);
        ventanaProducto.open();
    });

    ventanaProducto.on('open', function () {
        $('.glightbox-producto').attr({
            role: 'dialog',
            'aria-modal': 'true',
            'aria-labelledby': 'titulo-ficha-producto'
        });
        $('.glightbox-producto .gclose')
            .appendTo('.glightbox-producto .cierre-producto')
            .attr('aria-label', 'Cerrar ficha de producto')
            .trigger('focus');
        $('.glightbox-producto').on('click', function (evento) {
            if ($(evento.target).closest('.gslide-inline, .gclose').length === 0) {
                ventanaProducto.close();
            }
        });
    });

    ventanaProducto.on('close', function () {
        if (productoActivo) {
            productoActivo.trigger('focus');
        }
    });

    $(window).on('load resize', colocarCabecera);
    $(window).on('scroll', actualizarCabecera);

    colocarCabecera();
});
