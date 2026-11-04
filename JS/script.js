const raiz = document.documentElement;

if (localStorage.getItem('tema') === 'oscuro') {
    raiz.classList.add('dark');
}
