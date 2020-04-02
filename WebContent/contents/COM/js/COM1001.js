var page = {
		
	init:function(res)	{
		page.res = res.data;
		
		if(smutil.isEmpty(page.res.inv_no)){
			
		}
		
		page.initInterface();
		page.PublishCode();
	}

	, res : {}
	, PublishCode:function(){
		
		
		var num = '';
		var txtBox = $(".txtBox.tp2.numBox");

		$(".keypadBox > ul > li .btn").on("click, touchstart", function(){
			var keyPad = $(this).data('key');

			switch(keyPad) {
				case 'cancel':
					num = '';
					txtBox.text('');
				break;
				case 'del':
					num = num.substr(0, num.length - 1)+"";
					txtBox.text(num.LPToCommaNumber());
				break;
				default:
					num = num + keyPad+"";
					txtBox.text(num.LPToCommaNumber());
				break;
			}
		});
		
		
//		$(document).ready(function(){
//			var liLst = document.querySelectorAll('.numLi');
//			
//			liLst.forEach((item, index) => {
//				item.addEventListener('click', (event) => {
//					var str = document.querySelector(".txtBox.tp2.numBox").innerText;
//					var obj = `${event.currentTarget.dataset.value}`;
//					var numCheck = !isNaN(Number(obj));
//					
//					// 숫자버튼 클릭
//					if (numCheck) {
//						str += obj;
//					// 취소버튼 클릭
//					}else if (obj==="cancel"){
//						str="";
//					// 삭제버튼 클릭
//					}else if (obj==="delete") {
//						str=str.substr(0,str.length-1);
//					}
//					
//					//콤마표시
//					if(!smutil.isEmpty(str)){
//						str = str.LPToCommaNumber();
//					}
//					
//					document.querySelector(".txtBox.tp2.numBox").innerText = str;
//				});
//			});
//			
//			
//		});
	}
	//DOM출력 완료시 실행할 초기 함수
	,initInterface : function()	{
		
		$(".btn.closeW.paR").click(function(){
			LEMP.Window.close();
		});
		
		
		$(".btn.red.m.w100p").click(function(){
			
			var money = $.trim($(".txtBox.tp2.numBox").text());
			if(!smutil.isEmpty(money)){
				money = money.split(',').join('');
			}
			
			
			
			if (money.length == 0) {
				LEMP.Window.alert({
					"_sTitle" : "금액변경오류",
					"_vMessage" : "금액을 입력해 주세요."
				});
				
				return false;
			}
			
			money *= 1; 
			
			if(money % 50 != 0){
				LEMP.Window.alert({
					"_sTitle" : "금액변경오류",
					"_vMessage" : "변경금액은 50원 단위로만\n변경 가능합니다."
				});
				
				return false;
			}
			if(money < 4000){
				LEMP.Window.alert({
					"_sTitle" : "금액변경오류",
					"_vMessage" : "변경금액은 최하 4000 까지\n변경 가능합니다."
				});
				
				return false;
			}
			else {
				if(smutil.isEmpty(page.res)){
					page.res = {"prcs_fare" : money};
				}
				else{
					page.res.prcs_fare = money;
				}
				
				LEMP.Window.close({
					"_sCallback":"page.com1001Callback",
					"_oMessage":{"prcs_fare" : money, "inv_no" : page.res.inv_no}
				});
			}
		});
	}
};