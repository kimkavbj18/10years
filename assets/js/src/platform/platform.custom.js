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
    menuHtml += `<a class="nav-item nav-link ${key}${ platform.dataset.active === key ? ' active' : '' }" href="${menu[key].link}">${menu[key].title}</a>\n`;
}

platformTemplate = `
            <div class="container">
                <div class="row hamburger-button spacer-in-top-20 spacer-in-bottom-20">
                    <div class="container-fluid">
                        <button class="hamburger hamburger--collapse border border-gray-700 rounded" type="button">
                            <span class="hamburger-box">
                                <span class="hamburger-inner"></span>
                            </span>
                        </button>
                    </div>
                </div>
                <nav class="nav justify-content-center nav-fill flex-column flex-sm-row">
                    ${menuHtml}
                </nav>
            </div>`;

platform.innerHTML = platformTemplate;
