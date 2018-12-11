var Chatstack = {};
 Chatstack.server = 'panel.nerdcom.host/modules';  (function(d, $, undefined) {
   $(window).ready(function() {
     Chatstack.e = []; Chatstack.ready = function (c) { Chatstack.e.push(c); }
     var b = d.createElement('script'); b.type = 'text/javascript'; b.async = true;
     b.src = ('https:' == d.location.protocol ? 'https://' : 'http://') + Chatstack.server + '/livehelp/scripts/js.min.js';
     var s = d.getElementsByTagName('script')[0];
     s.parentNode.insertBefore(b, s);
   });
 })(document, jQuery);