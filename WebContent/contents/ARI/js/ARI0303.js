var page = {
		init : function() {
			page.initInterface();
		
		},
		initInterface : function() {
			$('.btn.closeW.paR').click(function(){
				LEMP.Window.close();
			});
			
			$('.btn.red.m.w100p').click(function(){
				var txtV = $('.txtBox.tp2.numBox').text();
				
				LEMP.Window.close({
					"_oMessage":{"txtJy" : txtV},
					"_sCallback":"page.InputCallback_J"
				});
			});
		}
}