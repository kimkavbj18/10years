var header = document.getElementById('header');
var headerTemplate = `<div class="container">
                <div class="row">
                    <div class="container-fluid">
                        <button class="hamburger hamburger--collapse hide-desktop" type="button">
                            <span class="hamburger-box">
                                <span class="hamburger-inner"></span>
                            </span>
                        </button>
                        <div class="logo">
                            <a href="/"><img src="${header.dataset.pathImages}/logon.png" alt="anerdcom" class="img-fluid"></a>
                        </div>
                        <div class="logo-white">
                            <a href="/"><img src="${header.dataset.pathImages}/logob.png" alt="bnerdcom" class="img-fluid"></a>
                        </div>
                        <nav class="navigation nav-item hide-desktop">
                            <ul class="secondary-menu list-unstyled nav">
                                <li class="nav-item hide-desktop"><a href="tel:+1.929.273.0923"><i class="fas fa-phone text-white"></i></a></li>
                                <li class="nav-item hide-desktop"><a href="https://www.nerdcom.host/support"><i class="fa fa-question-circle text-white"></i></a></li>
                                <li class="nav-item hide-desktop"><a href="https://www.panel.nerdcom.host/"><i class="fa fa-user text-white"></i></a></li>
                                <li class="nav-item hide-desktop"><a href="https://panel.nerdcom.host/cart.php?a=view"><i class="fa fa-shopping-cart fa-fw text-white"></i></a></li>   
                            </ul>
                            <ul class="main-menu list-unstyled nav">
                                <li class="nav-item">
                                    <span>Alojamiento <i class="fa fa-caret-down fa-fw"></i></span>
                                    <div class="sub-menu">
                                        <ul class="menu list-unstyled">
                                            <li>
                                                <a class="link-title" href="https://www.nerdcom.host/webhosting/">Web hosting</a>
                                                <a class="link-description" href="https://www.nerdcom.host/webhosting/">El mejor espacio para alojar tus páginas web, Seguro y disponible 24 horas.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="https://www.nerdcom.host/cloudhosting/">Cloud Hosting</a>
                                                <a class="link-description" href="https://www.nerdcom.host/cloudhosting/">Ofrecemos una expansión en la capacidad de recursos ilimitados de almacenamiento.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="https://www.nerdcom.host/wordpress/">Wordpress Hosting</a>
                                                <a class="link-description" href="https://www.nerdcom.host/wordpress/">Plan diseñado para sitios WordPress que cuenta con un equipo especializado.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="https://www.nerdcom.host/dedicados/">Servidores Dedicados</a>
                                                <a class="link-description" href="https://www.nerdcom.host/dedicados/">Web's de tráfico alto o con necesidad de amplios recursos de transferencia.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="https://www.nerdcom.host/streaming/">Streaming Hosting</a>
                                                <a class="link-description" href="https://www.nerdcom.host/streaming/">Tecnología que lleva tu emisora en línea a tu público de manera eficiente.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="https://www.nerdcom.host/vps/">Virtual Private Server "VPS"</a>
                                                <a class="link-description" href="https://www.nerdcom.host/vps/">Dispone recursos que conceden más potencia que un hosting compartido.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="https://www.nerdcom.host/webhostingdesign/">Web Hosting Design</a> 
                                                <a class="link-description" href="https://www.nerdcom.host/webhostingdesign/">Web hosting + Dominio + WorPress + 1 Especialista enfocado en tu web.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="https://www.nerdcom.host/emailhosting/">Business Email</a>
                                                <a class="link-description" href="https://www.nerdcom.host/emailhosting/">Web hosting + Dominio + WorPress + 1 Especialista enfocado para tu web.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="https://www.nerdcom.host/emailenterprise/">Enterprise Email</a>
                                                <a class="link-description" href="https://www.nerdcom.host/emailenterprise/">Web hosting + Dominio + WorPress + 1 Especialista enfocado para tu web.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="https://www.nerdcom.host/gsuite/">GSuite</a>
                                                <a class="link-description" href="https://www.nerdcom.host/gsuite/">Web hosting + Dominio + WorPress + 1 Especialista enfocado para tu web.</a>
                                            </li>
                                        </ul>
                                        <div class="sub-menu-foot hide-mobile">
                                            <a class = "link-title-center" href="https://panel.nerdcom.host/clientarea.php"><i class = "fa fa-lock fa-fw text-green"></i> Rápido Acceso a Control Panel</a>
                                        </div>
                                    </div>
                                </li>
                                <li class="nav-item">
                                    <span>Dominios <i class="fa fa-caret-down fa-fw"></i></span>
                                    <div class="sub-menu">
                                        <ul class="menu list-unstyled">
                                            <li>
                                                <a class="link-title" href="https://www.nerdcom.host/domains/">Dominios</a>
                                                <a class="link-description" href="https://www.nerdcom.host/domains/">tu empresa en línea inicia con un dominio. El nombre con el que darás a conocer tu marca en la web.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="https://www.nerdcom.host/dominio/domainreseller.php">Revendedor de Dominios</a>
                                                <a class="link-description href="https://www.nerdcom.host/dominio/domainreseller.php">Comienza a vender dominios sin inversión previa, benefíciate de nuestra oferta y genera ganancias.</a>
                                            </li>
                                            <li class="domain-include hide-mobile">
                                                <span>Incluye</span>
                                                <ul class="list-unstyled">
                                                    <li><a class="link-description" href="https://panel.nerdcom.host/clientarea.php?action=domains">Manejo de DNS<span class="sm-icon-submenu free">Gratis</span></a></li>
                                                    <li><a class="link-description" href="https://panel.nerdcom.host/clientarea.php?action=domains">Bloqueo de Transferencia<span class="sm-icon-submenu free">Gratis</span></a></li>
                                                    <li><a class="link-description" href="https://www.nerdcom.host/dominio/dominioprivacidad.php">Privacidad<span class="sm-icon-submenu cost">$7.95</span></a></li>                
                                                    <li><a class="link-description" href="https://panel.nerdcom.host/clientarea.php?action=domains">Auto Renovación<span class="sm-icon-submenu free">Gratis</span></a></li>    
                                                </ul>
                                            </li>
                                        </ul>
                                        <div class="sub-menu-foot hide-mobile">
                                            <a class="link-title-center" href="https://panel.nerdcom.host/clientarea.php?action=domains"><i class="fa fa-lock fa-fw text-green"></i>Control Panel de Dominios</a>
                                        </div>
                                    </div>
                                </li>
                                <li class="nav-item">
                                    <span>Plataformas <i class="fa fa-caret-down fa-fw"></i></span>
                                    <div class="sub-menu">
                                        <ul class="menu list-unstyled">
                                            <li>
                                                <a class="link-title" href="https://www.nerdcom.host/nerdcompro/">Nerdcom PRO</a>
                                                <a class="link-description" href="https://www.nerdcom.host/nerdcompro/">Plataforma de facturación y contabilidad, orientada a clientes, te permite optimizar la administrar tu empresa ahorrando tiempo y ampliando tus ganancias.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="https://www.nerdcom.host/nerdcomdoc/">Nerdcom DOC</a>
                                                <a class="link-description" href="https://www.nerdcom.host/nerdcomdoc/">Plataforma médica dirigida a facilitar la administración de consultorios y mejorar la atención personalizada a tus pacientes que te protege contra demandas.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="https://www.nerdcom.host/nerdcomlaw/">Nerdcom LAW</a>
                                                <a class="link-description" href="https://www.nerdcom.host/nerdcomlaw/">Diseñada para la administración de bufetes de abogados, que permite hacer una distribución eficiente de tiempo y esfuerzo mejorando la atención al cliente.</a>
                                            </li>
                                        </ul>
                                        <div class="sub-menu-foot hide-mobile">
                                            <a class="link-title-center" href="http://www.nerdcom.host/nerdcomacademy/"><i class="fa fa-lock fa-fw text-green"></i>Nerdcom Academy<span class="sm-icon-submenu cost">Certificate</span></a>
                                        </div> 
                                    </div>
                                </li>
                                <li class="nav-item">
                                    <span>Revendedor <i class="fa fa-caret-down fa-fw"></i></span>
                                    <div class="sub-menu">
                                        <ul class="menu list-unstyled">
                                            <li>
                                                <a class="link-title" href="https://www.nerdcom.host/resellerhosting/">Revendedor Hosting</a>
                                                <a class="link-description" href="https://www.nerdcom.host/resellerhosting/">Invierte y comienza a producir ganancias con tu plan reseller hosting desde 19.95$ y disfruta de WHMCS Gratis.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="https://www.nerdcom.host/dominio/domainreseller.php">Revendedor de Dominios</a>
                                                <a class="link-description" href=" https://www.nerdcom.host/dominio/domainreseller.php">Conviértete en socio Nerdcom y genera ingresos substánciales en tu cuenta bancaria. ¡Conoce nuestra oferta!</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="https://www.nerdcom.host/resellerpartner/">Socio Estrategico "Partner"</a>
                                                <a class="link-description" href="https://www.nerdcom.host/resellerpartner/">Conviértete en socio Nerdcom y genera ingresos substánciales en tu cuenta bancaria. ¡Conoce nuestra oferta!</a>
                                            </li>
                                        </ul>
                                        <div class="sub-menu-foot hide-mobile">
                                            <a class="link-title-center" href="https://panel.nerdcom.host/clientarea.php"><i class="fa fa-lock fa-fw text-green"></i>Acceso a Panel de Revendedor<span class="sm-icon-submenu cost">Certificate</span></a>
                                        </div>
                                    </div>
                                </li>
                                <li class="nav-item">
                                    <span>Seguridad y Diseño <i class="fa fa-caret-down fa-fw"></i></span>
                                    <div class="sub-menu">
                                        <ul class="menu list-unstyled">
                                            <li>
                                                <a class="link-title" href="https://www.nerdcom.host/verifyidentity/">Verificacion de Identidad</a>
                                                <a class="link-description" href="https://www.nerdcom.host/verifyidentity/">Te brindamos un servicio especializado en incrementar la seguridad de tu empresa en línea. (República Dominicana)</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="https://www.nerdcom.host/webdesign/">Diseño Web</a>
                                                <a class="link-description" href="https://www.nerdcom.host/webdesign/">Paquetes de diseño realizados por profesionales que te permiten llegar a tus clientes en la web de manera exitosa.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="https://www.nerdcom.host/identidadcorporativa/">Identidad Corporativa</a>
                                                <a class="link-description" href="../comming-soon.html">Trabajamos en quipo aplicando estrategias que te permiten hacer de tus ideas una marca reconocida para el público.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="https://www.nerdcom.host/sitelock/">Site Lock</a>
                                                <a class="link-description" href="https://www.nerdcom.host/sitelock/">Sistema de protección anti malware que asegura tu sitio web contra virus, ataques con un certificado de garantía visible.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="https://www.nerdcom.host/ssl/">SSL</a>
                                                <a class="link-description" href="https://www.nerdcom.host/ssl/">Certificado de seguridad (https://) protege  tu web y tu SEO dando tranquilidad en la compra de productos a visitantes.</a>
                                            </li>
                                            <li class="security-design hide-mobile">
                                                <a href="https://www.nerdcom.host/webdesign/">
                                                    <span class="text-link text-create">Creamos</span>                                                                
                                                    <span class="text-link text-page">Tu página</span><br>                                                                
                                                    <span class="text-link text-since">Desde</span>                                                                
                                                    <span class="text-link text-price">US$ 450.00</span>                                                                
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                                <li class="nav-item">
                                    <span>Servicios <i class="fa fa-caret-down fa-fw"></i></span>
                                    <div class="sub-menu">
                                        <ul class="menu list-unstyled">
                                            <li>
                                                <a class="link-title" href="https://www.nerdcom.host/impulsa/">Impulsa con Éxito</a>
                                                <a class="link-description" href="https://www.nerdcom.pro/impulsa.php">Programa que permite a emprendedores impulsar sus negocios desde los inicios, con cientos herramientas integradas al mejor costo del mercado.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="https://www.nerdcom.host/webseo/">Web SEO</a>
                                                <a class="link-description" href="https://www.nerdcom.host/webseo/">Hacemos el contenido de tu web orgánico y  atractivo a los motores de búsqueda que envían personas a tu sitio aumentando visibilidad de tu sitio.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="https://www.nerdcom.host/communitymanager/">Community Manager</a>
                                                <a class="link-description" href="https://www.nerdcom.host/communitymanager/">Un profesional  dedicado a hacer que el contenido en tus redes sociales sea irresistible a tus futuros clientes. ¡Atráelos desde su lugar favorito!</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="https://www.nerdcom.host/cooperativas/">Cooperativas</a>
                                                <a class="link-description" href="https://www.nerdcom.host/cooperativas/">Plan diseñado para brindar las mejores herramientas que proyectan y promueven tu cooperativa como un fuerte competidor dentro y fuera de la industria.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="https://www.nerdcom.host/marketing/">Marketing</a>
                                                <a class="link-description" href="//www.nerdcom.host/marketing/">Incrementa tus ventas con estrategias creadas para aumentar la visibilidad y el atractivo de tu producto .¡Conoce los planes que ideamos pensando en ti!</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="https://www.nerdcom.host/businessinteligence/">Inteligencia de Negocios</a>
                                                <a class="link-description" href="https://www.nerdcom.host/businessinteligence/">Un especialista en medios digitales te guiara a lograr el esquema funcional, de posicionamiento y ventas para que puedas llevar a tu marca donde deseas.</a>
                                            </li>
                                        </ul>
                                        <div class="sub-menu-foot hide-mobile">
                                            <a class="link-title-center" href="https://www.nerdcom.host/accesservices/"><i class="fa fa-lock fa-fw text-green"></i>Acceso a tus Servicios<span class="sm-icon-submenu cost">Certificate</span></a>
                                        </div>
                                    </div>
                                </li>
                                <li class="nav-item">
                                    <span>Compañia <i class="fa fa-caret-down fa-fw"></i></span>
                                    <div class="sub-menu">
                                        <ul class="menu list-unstyled">
                                            <li>
                                                <span>Empresa</span>
                                                <ul class="list-unstyled">
                                                    <li><a class="link-title-company" href="https://www.nerdcom.host/nosotros/">Equipo <i class="fa fa-users fa-fw"></i></a></li>
                                                    <li><a class="link-title-company" href="https://www.nerdcom.host/contact/">Contacto</a></li>
                                                    <li><a class="link-title-company" href="https://www.nerdcom.host/clients/">Clientes <i class="fa fa-users fa-fw"></i></a></li>
                                                    <li><a class="link-title-company" href="https://www.nerdcom.host/workwithus/">Trabaja con nosotros <i class="fab fa-dropbox fa-fw"></i></a></li>
                                                    <li><a class="link-title-company" href="https://www.nerdcom.host/mediakit/">Media Kit</a></li>
                                                    <li><a class="link-title-company" href="https://www.nerdcom.host/kai/">KAI  <img src="${header.dataset.pathImages}/kai.png" alt="nerdcom_kai"></a></li>
                                                </ul>
                                            </li>
                                            <li>
                                                <span>Noticias y Comunidad</span>
                                                <ul class=" menu-company list-unstyled">
                                                    <li><a class="link-title-company" href="https://blog.nerdcom.host/">Blog <i class="fa fa-comments fa-fw"></i></a></li>
                                                    <li><a class="link-title-company" href="https://forum.nerdcom.host">Foro</a></li>
                                                    <li><a class="link-title-company" href="https://www.nerdcom.host/kaizeneven/">Kaizen Even <i class="fa fa-calendar fa-fw"></i></a></li>
                                                    <li><a class="link-title-company" href="https://www.nerdcom.host/webinars/">Webinars <i class="fas fa-tv fa-fw"></i></a></li>
                                                </ul>
                                            </li>
                                            <li>
                                                <span>Ayuda</span>
                                                <ul class="menu-company list-unstyled">
                                                    <li><a class="link-title-company" href="https://panel.nerdcom.host/clientarea.php">Área de Clientes</a></li>
                                                    <li><a class="link-title-company" href="https://panel.nerdcom.host/knowledgebase/">Base de Conocimientos <i class="fa fa-book fa-fw"></i></a></li>
                                                    <li><a class="link-title-company" href="https://panel.nerdcom.host/submitticket.php">Abrir un Ticket</a></li>
                                                    <li><a class="link-title-company" href="#"><i class="fa fa-phone fa-fw"></i> +1.929.273.0923</a></li>
                                                    <li><a class="link-title-company" href="#"><i class="fa fa-phone fa-fw"></i> +1.877.280.9295</a></li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                                <li class="nav-item">
                                    <span>Contacto <i class="fa fa-caret-down fa-fw"></i></span>
                                    <div class="sub-menu">
                                        <ul class="menu list-unstyled">
                                            <li class="text-left  text-lg-center">
                                                <a class="link-title-center" href="https://panel.nerdcom.host/submitticket.php">Ayuda y Soporte</a>
                                                <img class="nav-img-contact hide-mobile" src="${header.dataset.pathImages}/supp.svg" alt="support">
                                            </li>
                                            <li class="text-left text-lg-center">
                                                <a class="link-title-center" href="https://www.nerdcom.host/questions/">Realiza una pregunta</a>
                                                <img class="nav-img-contact hide-mobile" src="${header.dataset.pathImages}/quest.svg" alt="quest">
                                            </li>
                                            <li class="text-left text-lg-center">
                                                <a class="link-title-center" href="https://www.nerdcom.host/faq/">Preguntas frecuentes</a>
                                                <img class="nav-img-contact hide-mobile" src="${header.dataset.pathImages}/faq.svg" alt="faq">
                                            </li>
                                        </ul>    
                                    </div>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-cp" href="https://panel.nerdcom.host"><i class="fa fa-lock fa-fw"></i><span>Control Panel</span></a>
                                </li>
                                <li class="text-center nav-item">
                                    <a href="../comming-soon.html" class="btn btn-blk-mobile nav-offers btn-sm">Ofertas</a>
                                </li>
                                <li class="nav-item hide-mobile">
                                    <span>&nbsp;<i class="fa fa-globe-americas"></i></span>
                                    <div class="sub-menu worldwide-menu">
                                        <ul class="menu list-unstyled">
                                            <li>
                                                <span>América</span>
                                                <ul class="list-unstyled">
                                                    <li><a href="../comming-soon.html"><img class="flags" src="${header.dataset.pathImages}/usa.png" alt="usa"> USA</a></li>
                                                    <li><a href="../comming-soon.html"><img class="flags" src="${header.dataset.pathImages}/republicadominicana.png" alt="rep_dominicana"> R. Dominicana</a></li>
                                                    <li><a href="../comming-soon.html"><img class="flags" src="${header.dataset.pathImages}/argentina.png" alt="argentina"> Argentina</a></li>
                                                    <li><a href="../comming-soon.html"><img class="flags" src="${header.dataset.pathImages}/mex.png" alt="mexico"> México</a></li>
                                                    <li><a href="../comming-soon.html"><img class="flags" src="${header.dataset.pathImages}/chile.png" alt="chile"> Chile</a></li>
                                                    <li><a href="../comming-soon.html"><img class="flags" src="${header.dataset.pathImages}/venezuela.png" alt="venezuela"> Venezuela</a></li>
                                                </ul>
                                            </li>
                                            <li>
                                                <span>Europa</span>
                                                <ul class="list-unstyled">
                                                    <li><a href="../comming-soon.html"><img class="flags" src="${header.dataset.pathImages}/es.svg" alt="españa"> España</a></li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>`;

header.innerHTML = headerTemplate;