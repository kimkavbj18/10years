var smedia = document.getElementById('smedia');
var smediaTemplate = `<div class="smedia">
				<div class="d-block d-lg-none">
					<button class="closeImg" data-close="close">X Close</button>
				</div>	
				<div class="smedia-icons">
					<div class="mt-1 mt-lg-0 floating-messenger">
			            <a target="_new" href="https://m.me/nerdcomllc"><img src="${smedia.dataset.pathImages}/icon-messenger.png" alt="icon-messenger"></a>
			        </div>
		        <div class="d-none d-lg-block floating-whatsapp">
		            <a target="_new" href="https://api.whatsapp.com/send?phone=18299460068"><img src="${smedia.dataset.pathImages}/icon-whatsapp.png" alt="icon-whatsapp"></a>
		        </div>
		    <div>    
        </div>`;

 smedia.innerHTML = smediaTemplate;