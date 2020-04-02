var page = {
	value : "",
	id : "",
	init:function(data)	{
	
		$('#headline').text(data.data.textVal);
		value = data.data.param;
		id = data.data.id;
		page.initInterface();
		page.PublishCode(data);
	}
	,PublishCode:function(data){
		
		$(document).ready(function(){
			
			$(".keypadBox li .btn").on("click, touchstart",function(){
				var obj =$(this).attr("id");
				var str = $(".txtBox.tp2.numBox").text();
				
				if (!isNaN(Number(obj))) {
					str += obj;
				}else {
					if (obj==="cancel") {
						str="";
					}else {
						str=str.substr(0,str.length-1);
					}
				}
				
				$(".txtBox.tp2.numBox").text(str);
				
//				var txtBox = $(".numBox");
//				var thisN = $(this).parent().index()+1;
//
//				if($(this).hasClass("cancle")){
//					txtBox.html("");
//				}else if($(this).hasClass("keyDel")){
//					txDel = txtBox.text().length-1;						
//					txtBox.html(txtBox.text().substr(0,txDel));
//				}else {
//					if (txtBox.text().length < 12) {
//						if($(this).hasClass("key0")){
//							txtBox.html(txtBox.html() + 0);
//						}else{
//							txtBox.html(txtBox.html() + thisN);
//						}
//					}else {
//						LEMP.Window.alert({
//							"_sTitle" : "운송장번호 오류",
//							"_vMessage" : "정상적인 송장번호를 입력해 주세요."
//						});
//					}
//				}
			});
		});
	}
	//DOM출력 완료시 실행할 초기 함수
	,initInterface : function(value){
	
		$('#headline').text(value);
		 
		$(".btn.closeW.paR").click(function(){
			LEMP.Window.close();
		});
		$(".btn.red.m.w100p").click(function(){
			LEMP.Window.close({
				"_oMessage":{
					"value" : $(".txtBox.tp2.numBox").text(),
					"id" :  id
				},
				"_sCallback":"page.InfoCallback"
			});
			
		});
	}
};