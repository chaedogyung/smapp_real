var page = {
	init:function()	{
		page.initInterface();
		page.PublishCode();
	}
	,PublishCode:function(){
		var _this = this;
		
		var num = '';
		var priceMaxLength = 11;
		var txtBox = $(".txtBox.tp2.numBox");

		$(".keypadBox > ul > li .btn").on("click, touchstart", function(){
			var keyPad = $(this).data('key');

			switch(keyPad) {
				case 'cancel':
					num = '';
					txtBox.text('');
				break;
				case 'del':
					num = num.substr(0, num.length - 1);
					txtBox.text(_this.numberFormat(num));
				break;
				default:
					if(num.length > priceMaxLength) return;
					num = num + keyPad;
					txtBox.text(_this.numberFormat(num));
				break;
			}
		});
		
		
		/*var liLst = document.querySelectorAll('.numLi');
		var priceMaxLength = 11;
		var str = "";
		
		liLst.forEach((item, index) => {
			
			item.addEventListener('click', (event) => {
				var obj = `${event.currentTarget.dataset.value}`;
				var numCheck = !isNaN(Number(obj));
				
				// 12자리 미만이며, 숫자버튼 클릭
				if (numCheck && str.length < 12) {
					if(str.length > priceMaxLength) return;
					str += obj;
				// 취소버튼 클릭
				}else if (obj==="cancel"){
					str="";
				// 삭제버튼 클릭
				}else if (obj==="delete") {
					str=str.substr(0,str.length-1);
				}
				
				document.querySelector(".txtBox.tp2.numBox").innerText = page.numberFormat(str);
			});
		});*/
		
		
		
	}
	
	//DOM출력 완료시 실행할 초기 함수
	,initInterface : function()	{
		
		// 
		$(".btn.closeW.paR").click(function(){
			LEMP.Window.close();
		});
		$(".btn.red.m.w100p").click(function(){
			var str = $(".txtBox.tp2.numBox").text().replace(/\-/gi,"");
			if (str.length === 12 &&
					(str.substr(0,11)%7 == str.substr(11,1))) {
				LEMP.Window.close({
					"_oMessage":{"inv_no" : str},
					"_sCallback":"page.InputCallback"
				});
			}else {
				LEMP.Window.alert({
					"_sTitle" : "운송장번호 오류",
					"_vMessage" : "정상적인 송장번호를 입력해 주세요."
				});
			}
		});
	}
	
	, numberFormat : function(inputNumber) {
		return inputNumber.toString().replace(/\B(?=(\d{4})+(?!\d))/g, "-");
	}
};