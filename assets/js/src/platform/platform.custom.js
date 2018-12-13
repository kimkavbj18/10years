var platform = document.getElementById('platform'),
    menuHtml = '',
    menu = {
        'ncp-home': {
            'title': 'Inicio',
            'link': './index.html',
            'show': {
                'pro': true,
                'doc': true,
                'law': true
            }
        },
        'prices': {
            'title': 'Precios',
            'link': './prices.html',
            'show': {
                'pro': true,
                'doc': true,
                'law': true
            }
        },
        'tour': {
            'title': 'Tour',
            'link': './tour.html',
            'show': {
                'pro': true,
                'doc': true,
                'law': true
            }
        },
        'integration': {
            'title': 'Integración',
            'link': './integration.html',
            'show': {
                'pro': true,
                'doc': false,
                'law': false
            }
        },
        'demo': {
            'title': 'Demo',
            'link': './demo.html',
            'show': {
                'pro': true,
                'doc': true,
                'law': true
            }
        },
        'comparison': {
            'title': 'Comparación',
            'link': './comparison.html',
            'show': {
                'pro': true,
                'doc': false,
                'law': false
            }
        },
    };
//console.log(document.getElementById('platform'));
if (platform && platform !== 'null') {
    for ( var key in menu ) {
        // console.log(menu[key].show[platform.dataset.page]);
        if (menu[key].show[platform.dataset.page]) {
            menuHtml += `<a class="nav-item nav-link ${key}${ platform.dataset.active === key ? ' active' : '' }" href="${menu[key].link}">${menu[key].title}</a>\n`;
        }
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
}
