var platform = document.getElementById('platform'),
    menuHtml = '',
    menu = {
        'ncp-home': {
            'title': 'Inicio',
            'link': './index.html',
        },
        'prices': {
            'title': 'Precios',
            'link': './prices.html',
        },
        'tour': {
            'title': 'Tour',
            'link': './tour.html',
        },
        'integration': {
            'title': 'Integración',
            'link': './integration.html',
        },
        'demo': {
            'title': 'Demo',
            'link': './demo.html',
        },
        'comparison': {
            'title': 'Comparación',
            'link': './comparison.html',
        },
    };

for ( var key in menu ) {
    menuHtml += `<a class="nav-item nav-link rounded-bottom ${key}${ platform.dataset.active === key ? ' active' : '' }" href="${menu[key].link}">${menu[key].title}</a>\n`;
}

platformTemplate = `<div class="container">
                <nav class="nav justify-content-center nav-fill flex-column flex-sm-row">
                    ${menuHtml}
                </nav>
            </div>`;

platform.innerHTML = platformTemplate;