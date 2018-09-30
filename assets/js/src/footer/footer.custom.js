var footer = document.getElementById('footer');
var footerTemplate = `<div class="container">
                <div class="row footer-menus">
                    <div class="footer-menus-wrapper col-6 col-md-4 col-lg-3 col-xl-2">
                        <p>Productos</p>
                        <ul class="footer-menu list-unstyled">
                            <li><a href="#">Nerdcom PRO</a></li>
                            <li><a href="#">Nerdcom DOC</a></li>
                            <li><a href="#">Nerdcom LAW</a></li>
                            <li><a href="#">Site Lock</a></li>
                            <li><a href="#">SSL</a></li>
                        </ul>
                    </div>
                    <div class="footer-menus-wrapper col-6 col-md-4 col-lg-3 col-xl-2">
                        <p>Servicios</p>
                        <ul class="footer-menu list-unstyled">
                            <li><a href="#">Diseño Web</a></li>
                            <li><a href="#">Web Hosting</a></li>
                            <li><a href="#">Wordpress Hosting</a></li>
                            <li><a href="#">Web SEO</a></li>
                            <li><a href="#">Community Manager</a></li>
                            <li><a href="#">G Suite</a></li>
                        </ul>
                    </div>
                    <div class="footer-menus-wrapper col-6 col-md-4 col-lg-3 col-xl-2">
                        <p>Soporte</p>
                        <ul class="footer-menu list-unstyled">
                            <li><a href="#">Área de Clientes</a></li>
                            <li><a href="#">Foro</a></li>
                            <li><a href="#">Preguntas Frecuentes</a></li>
                            <li><a href="#">Ayuda</a></li>
                            <li><a href="#">Contactar</a></li>
                            <li><a href="#">Abrir Ticket</a></li>
                        </ul>
                    </div>
                    <div class="footer-menus-wrapper col-6 col-md-4 col-lg-3 col-xl-2">
                        <p>Recursos</p>
                        <ul class="footer-menu list-unstyled">
                            <li><a href="#">Herramientas Gratis</a></li>
                            <li><a href="#">Solicitar Características</a></li>
                            <li><a href="#">Partners</a></li>
                            <li><a href="#">Verificación de Licencia</a></li>
                            <li><a href="#">Programa de Afiliado</a></li>
                            <li><a href="#">Panel de Proyectos</a></li>
                        </ul>
                    </div>
                    <div class="footer-menus-wrapper col-6 col-md-4 col-lg-3 col-xl-2">
                        <p>Programas</p>
                        <ul class="footer-menu list-unstyled">
                            <li><a href="#">Impulsa</a></li>
                            <li><a href="#">Webinars</a></li>
                            <li><a href="#">Cooperativas</a></li>
                        </ul>
                    </div>
                    <div class="footer-menus-wrapper col-6 col-md-4 col-lg-3 col-xl-2">
                        <p>Compañía</p>
                        <ul class="footer-menu list-unstyled">
                            <li><a href="#">Quienes Somos</a></li>
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">Clientes</a></li>
                            <li><a href="#">Trabajar con Nosotros</a></li>
                            <li><a href="#">Contactar</a></li>
                            <li><a href="#">Kai</a></li>
                        </ul>
                    </div>
                </div>
                <div class="row footer-info">
                    <div class="col-lg-6">
                        <div class="logo"><img src="./images/logon.png" alt="anerdcom" class="img-fluid"></div>
                        <p class="text-center text-lg-left">Suplidor de tecnología, servicios Hosting, Cloud y desarrollo líder en el mundo.</p>
                        <p class="text-center text-lg-left">Registardo con el Numero RNC: 1.31.17191.5</p>
                    </div>
                    <div class="col-lg-6">
                        <ul class="footer-menu-icons nav list-unstyled">
                            <li class="nav-item">
                                <a href="javascript:if(window.open('https://www.trustlogo.com/ttb_searcher/trustlogo?v_querytype=W&amp;v_shortname=SC5&amp;v_search=https://k.nerdcom.host/&amp;x=6&amp;y=5','tl_wnd_credentials'+(new Date()).getTime(),'toolbar=0,scrollbars=1,location=1,status=1,menubar=1,resizable=1,width=374,height=660,left=60,top=120')){};tLlB(tLTB);"
                                    onmouseover="tLeB(event,'https://www.trustlogo.com/ttb_searcher/trustlogo?v_querytype=C&amp;v_shortname=SC5&amp;v_search=https://k.nerdcom.host/&amp;x=6&amp;y=5','tl_popupSC5')"
                                    onmousemove="tLXB(event)" onmouseout="tLTC('tl_popupSC5')" ondragstart="return false;">
                                    <img src="./images/comodo_secure_seal_113x59_transp.png"
                                    onmousedown="return tLKB(event,'https://www.trustlogo.com/ttb_searcher/trustlogo?v_querytype=W&amp;v_shortname=SC5&amp;v_search=https://k.nerdcom.host/&amp;x=6&amp;y=5');"
                                    oncontextmenu="return tLLB(event);" alt="trustlogo">
                                </a>
                                <div id="tl_popupSC5" class="ssl-popup"
                                    onmouseover="tLoB('tl_popupSC5')" onmousemove="tLpC('tl_popupSC5')" onmouseout="tLpB('tl_popupSC5')">&nbsp;</div>
                            </li>
                            <li class="nav-item"><a href="#"><img src="./images/visa.svg" alt="pay"></a></li>
                            <li class="nav-item"><a href="#"><img src="./images/mastercard.svg" alt="pay"></a></li>
                            <li class="nav-item"><a href="#"><img src="./images/amex.svg" alt="pay"></a></li>
                        </ul>
                        <ul class="footer-menu-links nav list-unstyled">
                            <li class="nav-item"><a href="#">Nosotros</a></li>
                            <li class="nav-item"><a href="#">Política de Privacidad</a></li>
                            <li class="nav-item"><a href="#">Términos del Servicio</a></li>
                            <li class="nav-item"><a href="#">Legal</a></li>
                        </ul>
                        <p class="text-center text-lg-right">Copyright © 2018 NERDCOM. Todos los derechos reservados.</p>
                    </div>
                </div>
            </div>`;

footer.innerHTML = footerTemplate;