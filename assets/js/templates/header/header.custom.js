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
                            <img src="./dist/images/logon.png" alt="anerdcom" class="img-fluid">
                        </div>
                        <div class="logo-white">
                            <img src="./dist/images/logob.png" alt="bnerdcom" class="img-fluid">
                        </div>
                        <nav class="navigation nav-item hide-desktop">
                            <ul class="secondary-menu list-unstyled nav">
                                <li class="nav-item hide-desktop"><span><i class="fa fa-phone"></i></span></li>
                                <li class="nav-item hide-desktop"><span><i class="fa fa-question-circle"></i></span></li>
                                <li class="nav-item hide-desktop"><span><i class="fa fa-user"></i></span></li>
                                <li class="nav-item hide-desktop"><span><i class="fa fa-shopping-cart fa-fw"></i></span></li>   
                            </ul>
                            <ul class="main-menu list-unstyled nav">
                                <li class="nav-item">
                                    <span>Alojamiento <i class="fa fa-caret-down fa-fw"></i></span>
                                    <div class="sub-menu">
                                        <ul class="menu list-unstyled">
                                            <li>
                                                <a class="link-title" href="#">Alojamiento Web</a>
                                                <a class="link-description" href="#">El mejor espacio para alojar tus páginas web, Seguro y disponible 24 horas.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="#">Cloud Hosting</a>
                                                <a class="link-description" href="#">Ofrecemos una expansión en la capacidad de recursos ilimitados de almacenamiento.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="#">Wordpress Hosting</a>
                                                <a class="link-description" href="#">Plan diseñado para sitios WordPress que cuenta con un equipo especializado.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="#">Servidores Dedicados</a>
                                                <a class="link-description" href="#">Web's de tráfico alto o con necesidad de amplios recursos de transferencia.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="#">Streaming Hosting</a>
                                                <a class="link-description" href="#">Tecnología que lleva tu emisora en línea a tu público de manera eficiente.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="#">Virtual Private Server "VPS"</a>
                                                <a class="link-description" href="#">Dispone recursos que conceden más potencia que un hosting compartido.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="#">Web Hosting Design</a>
                                                <a class="link-description" href="#">Web hosting + Dominio + WorPress + 1 Especialista enfocado en tu web.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="#">Business Email</a>
                                                <a class="link-description" href="#">Web hosting + Dominio + WorPress + 1 Especialista enfocado para tu web.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="#">Enterprise Email</a>
                                                <a class="link-description" href="#">Web hosting + Dominio + WorPress + 1 Especialista enfocado para tu web.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="#">GSuite</a>
                                                <a class="link-description" href="#">Web hosting + Dominio + WorPress + 1 Especialista enfocado para tu web.</a>
                                            </li>
                                        </ul>
                                        <div class="sub-menu-foot hide-mobile">
                                            <a class="link-title-center" href="#"><i class="fa fa-lock fa-fw"></i>Rápido Acceso a Control Panel</a>
                                        </div>
                                    </div>
                                </li>
                                <li class="nav-item">
                                    <span>Dominios <i class="fa fa-caret-down fa-fw"></i></span>
                                    <div class="sub-menu">
                                        <ul class="menu list-unstyled">
                                            <li>
                                                <a class="link-title" href="#">Dominios</a>
                                                <a class="link-description" href="#">tu empresa en línea inicia con un dominio. El nombre con el que darás a conocer tu marca en la web.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="#">Revendedor de Dominios</a>
                                                <a class="link-description" href="#">Comienza a vender dominios sin inversión previa, benefíciate de nuestra oferta y genera ganancias.</a>
                                            </li>
                                            <li class="domain-include hide-mobile">
                                                <span>Incluye</span>
                                                <ul class="list-unstyled">
                                                    <li><a class="link-description" href="#">Manejo de DNS<span class="sm-icon-submenu free">Gratis</span></a></li>
                                                    <li><a class="link-description" href="#">Bloqueo de Transferencia<span class="sm-icon-submenu free">Gratis</span></a></li>
                                                    <li><a class="link-description" href="#">Privacidad<span class="sm-icon-submenu cost">$7.95</span></a></li>                
                                                    <li><a class="link-description" href="#">Auto Renovación<span class="sm-icon-submenu free">Gratis</span></a></li>    
                                                </ul>
                                            </li>
                                        </ul>
                                        <div class="sub-menu-foot hide-mobile">
                                            <a class="link-title-center" href="#"><i class="fa fa-lock fa-fw"></i>Control Panel de Dominios</a>
                                        </div>
                                    </div>
                                </li>
                                <li class="nav-item">
                                    <span>Plataformas <i class="fa fa-caret-down fa-fw"></i></span>
                                    <div class="sub-menu">
                                        <ul class="menu list-unstyled">
                                            <li>
                                                <a class="link-title" href="#">Nerdcom PRO</a>
                                                <a class="link-description" href="#">Plataforma de facturación y contabilidad, orientada a clientes, te permite optimizar la administrar tu empresa ahorrando tiempo y ampliando tus ganancias.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="#">Nerdcom DOC</a>
                                                <a class="link-description" href="#">Plataforma médica dirigida a facilitar la administración de consultorios y mejorar la atención personalizada a tus pacientes que te protege contra demandas.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="#">Nerdcom LAW</a>
                                                <a class="link-description" href="#">Diseñada para la administración de bufetes de abogados, que permite hacer una distribución eficiente de tiempo y esfuerzo mejorando la atención al cliente.</a>
                                            </li>
                                        </ul>
                                        <div class="sub-menu-foot hide-mobile">
                                            <a class="link-title-center" href="#"><i class="fa fa-lock fa-fw"></i>Nerdcom Academy<span class="sm-icon-submenu cost">Certificate</span></a>
                                        </div> 
                                    </div>
                                </li>
                                <li class="nav-item">
                                    <span>Revendedor <i class="fa fa-caret-down fa-fw"></i></span>
                                    <div class="sub-menu">
                                        <ul class="menu list-unstyled">
                                            <li>
                                                <a class="link-title" href="#">Revendedor Hosting</a>
                                                <a class="link-description" href="#">Invierte y comienza a producir ganancias con tu plan reseller hosting desde 19.95$ y disfruta de WHMCS Gratis.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="#">Revendedor de Dominios</a>
                                                <a class="link-description" href="#">Conviértete en socio Nerdcom y genera ingresos substánciales en tu cuenta bancaria. ¡Conoce nuestra oferta!</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="#">Socio Estrategico "Partner"</a>
                                                <a class="link-description" href="#">Conviértete en socio Nerdcom y genera ingresos substánciales en tu cuenta bancaria. ¡Conoce nuestra oferta!</a>
                                            </li>
                                        </ul>
                                        <div class="sub-menu-foot hide-mobile">
                                            <a class="link-title-center" href="#"><i class="fa fa-lock fa-fw"></i>Acceso a Panel de Revendedor<span class="sm-icon-submenu cost">Certificate</span></a>
                                        </div>
                                    </div>
                                </li>
                                <li class="nav-item">
                                    <span>Seguridad y Diseño <i class="fa fa-caret-down fa-fw"></i></span>
                                    <div class="sub-menu">
                                        <ul class="menu list-unstyled">
                                            <li>
                                                <a class="link-title" href="#">Verificacion de Identidad</a>
                                                <a class="link-description" href="#">Te brindamos un servicio especializado en incrementar la seguridad de tu empresa en línea. (República Dominicana)</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="#">Diseño Web</a>
                                                <a class="link-description" href="#">Paquetes de diseño realizados por profesionales que te permiten llegar a tus clientes en la web de manera exitosa.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="#">Identidad Corporativa</a>
                                                <a class="link-description" href="#">Trabajamos en quipo aplicando estrategias que te permiten hacer de tus ideas una marca reconocida para el público.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="#">Site Lock</a>
                                                <a class="link-description" href="#">Sistema de protección anti malware que asegura tu sitio web contra virus, ataques con un certificado de garantía visible.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="#">SSL</a>
                                                <a class="link-description" href="#">Certificado de seguridad (https://) protege  tu web y tu SEO dando tranquilidad en la compra de productos a visitantes.</a>
                                            </li>
                                            <li class="security-design hide-mobile">
                                                <a href="#">
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
                                                <a class="link-title" href="#">Impulsa con Éxito</a>
                                                <a class="link-description" href="#">Programa que permite a emprendedores impulsar sus negocios desde los inicios, con cientos herramientas integradas al mejor costo del mercado.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="#">Web SEO</a>
                                                <a class="link-description" href="#">Hacemos el contenido de tu web orgánico y  atractivo a los motores de búsqueda que envían personas a tu sitio aumentando visibilidad de tu sitio.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="#">Community Manager</a>
                                                <a class="link-description" href="#">Un profesional  dedicado a hacer que el contenido en tus redes sociales sea irresistible a tus futuros clientes. ¡Atráelos desde su lugar favorito!</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="#">Cooperativas</a>
                                                <a class="link-description" href="#">Plan diseñado para brindar las mejores herramientas que proyectan y promueven tu cooperativa como un fuerte competidor dentro y fuera de la industria.</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="#">Marketing</a>
                                                <a class="link-description" href="#">Incrementa tus ventas con estrategias creadas para aumentar la visibilidad y el atractivo de tu producto .¡Conoce los planes que ideamos pensando en ti!</a>
                                            </li>
                                            <li>
                                                <a class="link-title" href="#">Inteligencia de Negocios</a>
                                                <a class="link-description" href="#">Un especialista en medios digitales te guiara a lograr el esquema funcional, de posicionamiento y ventas para que puedas llevar a tu marca donde deseas.</a>
                                            </li>
                                        </ul>
                                        <div class="sub-menu-foot hide-mobile">
                                            <a class="link-title-center" href="#"><i class="fa fa-lock fa-fw"></i>Acceso a tus Servicios<span class="sm-icon-submenu cost">Certificate</span></a>
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
                                                    <li><a class="link-title-company" href="#">Equipo <i class="fa fa-users fa-fw"></i></a></li>
                                                    <li><a class="link-title-company" href="#">Contacto</a></li>
                                                    <li><a class="link-title-company" href="#">Clientes <i class="fa fa-users fa-fw"></i></a></li>
                                                    <li><a class="link-title-company" href="#">Trabaja con nosotros <i class="fab fa-dropbox fa-fw"></i></a></li>
                                                    <li><a class="link-title-company" href="#">Media Kit</a></li>
                                                    <li><a class="link-title-company" href="#">KAI  <img src="./dist/images/kai.png" alt="nerdcom_kai"></a></li>
                                                </ul>
                                            </li>
                                            <li>
                                                <span>Noticias y Comunidad</span>
                                                <ul class=" menu-company list-unstyled">
                                                    <li><a class="link-title-company" href="#">Blog <i class="fa fa-comments fa-fw"></i></a></li>
                                                    <li><a class="link-title-company" href="#">Foro</a></li>
                                                    <li><a class="link-title-company" href="#">Kaizen Even <i class="fa fa-calendar fa-fw"></i></a></li>
                                                    <li><a class="link-title-company" href="#">Webinars <i class="fas fa-tv fa-fw"></i></a></li>
                                                </ul>
                                            </li>
                                            <li>
                                                <span>Ayuda</span>
                                                <ul class="menu-company list-unstyled">
                                                    <li><a class="link-title-company" href="#">Área de Clientes</a></li>
                                                    <li><a class="link-title-company" href="#">Base de Conocimientos <i class="fa fa-book fa-fw"></i></a></li>
                                                    <li><a class="link-title-company" href="#">Abrir un Ticket</a></li>
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
                                                <a class="link-title-center" href="#">Ayuda y Soporte</a>
                                                <img class="nav-img-contact hide-mobile" src="./dist/images/supp.svg" alt="support">
                                            </li>
                                            <li class="text-left text-lg-center">
                                                <a class="link-title-center" href="#">Realiza una pregunta</a>
                                                <img class="nav-img-contact hide-mobile" src="./dist/images/quest.svg" alt="quest">
                                            </li>
                                            <li class="text-left text-lg-center">
                                                <a class="link-title-center" href="#">Preguntas frecuentes</a>
                                                <img class="nav-img-contact hide-mobile" src="./dist/images/faq.svg" alt="faq">
                                            </li>
                                        </ul>    
                                    </div>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-cp" href="https://panel.nerdcom.host"><i class="fa fa-lock fa-fw"></i><span>Control Panel</span></a>
                                </li>
                                <li class="text-center nav-item">
                                    <a href="#" class="btn btn-blk-mobile nav-offers btn-sm">Ofertas</a>
                                </li>
                                <li class="nav-item hide-mobile">
                                    <span>&nbsp;<i class="fa fa-globe-americas"></i></span>
                                    <div class="sub-menu worldwide-menu">
                                        <ul class="menu list-unstyled">
                                            <li>
                                                <span>América</span>
                                                <ul class="list-unstyled">
                                                    <li><a href="#"><img class="flags" src="./dist/images/usa.png" alt="usa"> USA</a></li>
                                                    <li><a href="#"><img class="flags" src="./dist/images/republicadominicana.png" alt="rep_dominicana"> R. Dominicana</a></li>
                                                    <li><a href="#"><img class="flags" src="./dist/images/argentina.png" alt="argentina"> Argentina</a></li>
                                                    <li><a href="#"><img class="flags" src="./dist/images/mex.png" alt="mexico"> México</a></li>
                                                    <li><a href="#"><img class="flags" src="./dist/images/chile.png" alt="chile"> Chile</a></li>
                                                    <li><a href="#"><img class="flags" src="./dist/images/venezuela.png" alt="venezuela"> Venezuela</a></li>
                                                </ul>
                                            </li>
                                            <li>
                                                <span>Europa</span>
                                                <ul class="list-unstyled">
                                                    <li><a href="#"><img class="flags" src="./dist/images/es.svg" alt="españa"> España</a></li>
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