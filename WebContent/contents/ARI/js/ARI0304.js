var page = {
		init : function() {
			page.initInterface();
		
		},
		initInterface : function() {
			$('.btn.closeW.paR').click(function(){
				LEMP.Window.close();
			});
			
			//확인
			$('.btn.red.m.w100p').click(function(){
				if ($(".txtBox.tp2.numBox").text().substr(0,1)==="8" &&
						$(".txtBox.tp2.numBox").text().length === 10 &&
						$(".txtBox.tp2.numBox").text().substr(0,9)%7 == $(".txtBox.tp2.numBox").text().substr(9,1)){
					
					LEMP.Window.close({
						"_oMessage":{"equim" : $(".txtBox.tp2.numBox").text()},
						"_sCallback":"page.Input_ECallback"
					});
						
				}else {
					LEMP.Window.alert({
						"_sTitle" : " 오류",
						"_vMessage" : "정상적인 운반 장비 번호를  입력해 주세요."
					});
				}
			});
		}
}