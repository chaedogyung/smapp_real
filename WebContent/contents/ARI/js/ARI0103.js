var page = {
	init:function()	{
		page.initInterface();
		page.PublishCode();
	}
	,PublishCode:function(){
		
		
	}
	//DOM출력 완료시 실행할 초기 함수
	,initInterface : function()	{
	
		$(".btn.closeW.paR").click(function(){
			LEMP.Window.close();
		});
		$(".btn.red.m.w100p").click(function(){
			//첫번째 번호 
			var fDis = $(".txtBox.tp2.numBox").text().substr(0,1);
			if(fDis==="8" || fDis==="9"){
				if(fDis==="8"){
					if ($(".txtBox.tp2.numBox").text().length === 12 &&($(".txtBox.tp2.numBox").text().substr(0,11)%7 == $(".txtBox.tp2.numBox").text().substr(11,1))) {
						LEMP.Window.close({
							"_oMessage":{"yinfo" : $(".txtBox.tp2.numBox").text()},
							"_sCallback":"page.Input_yCallback"
						});
					}else {
						LEMP.Window.alert({
							"_sTitle" : "연계일보번호 오류",
							"_vMessage" : "정상적인 연계일보번호 입력해 주세요."
						});
					}
				}else{
					if($(".txtBox.tp2.numBox").text().length == 12){
						LEMP.Window.close({
							"_oMessage":{"yinfo" : $(".txtBox.tp2.numBox").text()},
							"_sCallback":"page.Input_yCallback"
						});
					}else{
						LEMP.Window.alert({
							"_sTitle" : "연계일보번호 오류",
							"_vMessage" : "정상적인 연계일보번호 입력해 주세요."
						});
					}
				}
			}else{
				LEMP.Window.alert({
					"_sTitle" : "연계일보번호 오류",
					"_vMessage" : "정상적인 연계일보번호 입력해 주세요."
				});
			}
		});
		
	}
};