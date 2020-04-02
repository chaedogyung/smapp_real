var page = {
	init : function(arg) {
		page.cldl0407 = arg.data.param;
		page.initEvent();
		//page.PublishCode();
	}
	,cldl0407:{}
	,initEvent : function() {
		var _this = this;
		
		// 닫기
		$(document).on("click", ".btn.closeW.paR", function() {
			LEMP.Window.close();
		});
		
		$(".btn.red.m.w100p").click(function(){
			var phoneNumber = $(".txtBox.tp2.numBox").text();
			phoneNumber = phoneNumber.split('-').join('');
			var num1 = phoneNumber.substr(0,3);
			
			if(smutil.isEmpty(phoneNumber)){
				LEMP.Window.alert({ 
					_sTitle : "전화번호 입력오류",
					_vMessage : "전화번호를 입력해주세요."
				});
				
				return false;
			}
			else if(phoneNumber.length < 10){
				
				LEMP.Window.alert({ 
					_sTitle : "전화번호 입력오류",
					_vMessage : "문자발송이 가능한\n전화번호가 아닙니다."
				});
				
				return false;
			}
			else if(num1 != "010" 
						&& num1 != "011"
						&& num1 != "016"
						&& num1 != "017"
						&& num1 != "018"
						&& num1 != "019"
						&& num1 != "050"){
				
				LEMP.Window.alert({ 
					_sTitle : "전화번호 입력오류",
					_vMessage : "휴대폰 혹은 안심번호를 입력해주세요."
				});
				
				return false;
			}
			else{
				page.cldl0407.pNum=$(".txtBox.tp2.numBox").text();
				LEMP.Window.close({
					"_oMessage":{
						"param":page.cldl0407
					},
					"_sCallback":"page.CLDL0407Callback"
				});	
			}
		});
		
		
		
		var num = '';
		var priceMaxLength = 11;
		var txtBox = $(".txtBox.tp2.numBox");

		$(".keypadBox > ul > li .btn").on("click, touchstart", function(){
			var keyPad = $(this).data('key');
			//if(!num.length) return;

			switch(keyPad) {
				case 'cancel':
					num = '';
					txtBox.text('');
				break;
				case 'del':
					num = num.substr(0, num.length - 1);
					txtBox.text(_this.autoHypenPhone(num));
				break;
				default:
					if(num.length > priceMaxLength) return;
					num = num + keyPad;
					txtBox.text(_this.autoHypenPhone(num));
				break;
			}
		});
		
		
//		$(document).on('click', '.numLi', function(){
//			
//			var keyVal = $(this).data("value");
//			var str = $(".txtBox.tp2.numBox").text();
//			
//			if(keyVal=="cancel"){
//				str = "";
//			}
//			else if(keyVal=="delete"){
//				if(!smutil.isEmpty(str)){
//					// 마지막에 '-' 로 끝나면 2글자를 지운다.
//					if(str.LPEndsWith("-")){
//						str = str.substr(0, str.length-2);
//					}
//					else{
//						str = str.substr(0, str.length-1);
//					}
//					str = page.autoHypenPhone(str);
//				}
//			}
//			else{
//				
//				if(!smutil.isEmpty(str)){
//					str += keyVal;
//					str = page.autoHypenPhone(str);
//				}
//				else{
//					str = $(this).data("value");
//				}
//			}
//				
//			$(".txtBox.tp2.numBox").text(str);
//		});

	}
	
	// 휴대폰/회사번호 번호검색(하이픈'-' 자동입력)
	, autoHypenPhone : function(str) {

		str = str.replace(/[^0-9]/g, '');

		var tmp = '';
		// 01) 전화번호 처리
		if (str.substring(0, 1) == "1") { // 1588, 1688등의 번호일 경우
			if (str.length < 4) {
				return str;
			} else if (str.length < 9) {
				tmp += str.substr(0, 4); // 1544
				tmp += '-';
				tmp += str.substr(4, 4); // 6071
				return tmp;
			} else {
				tmp += str.substr(0, 4);
				tmp += '-';
				tmp += str.substr(4, 4);
				return tmp;
			}
		} else if (str.substring(0, 2) == "02") { // 02 서울 대표번호
			if (str.length < 2) {
				return str;
			} else if (str.length < 5) {
				tmp += str.substr(0, 2); // 02
				tmp += '-';
				tmp += str.substr(2, 3); // 1544
				return tmp;
			} else if (str.length < 10) {
				tmp += str.substr(0, 2); // 02
				tmp += '-';
				tmp += str.substr(2, 3); // 222
				tmp += '-';
				tmp += str.substr(5); // 3333
				return tmp;
			} else {
				tmp += str.substr(0, 2); // 02
				tmp += '-';
				tmp += str.substr(2, 4); // 2222
				tmp += '-';
				tmp += str.substr(6, 4); // 2222
				return tmp;
			}
		} else if (str.substring(0, 3) == "050") { // 050 안심번호
			if (str.length < 4) {
				return str;
			} else if (str.length < 9) {
				tmp += str.substr(0, 4);
				tmp += '-';
				tmp += str.substr(4, 4);
				return tmp;
			} else {
				tmp += str.substr(0, 4);
				tmp += '-';
				tmp += str.substr(4, 4);
				tmp += '-';
				tmp += str.substr(8, 4);
				return tmp;
			}
			// 02)휴대폰 번호처리
		} else if (str.length < 4) {
			return str;
		} else if (str.length < 7) {
			tmp += str.substr(0, 3);
			tmp += '-';
			tmp += str.substr(3);
			return tmp;
		} else if (str.length < 11) {
			tmp += str.substr(0, 3);
			tmp += '-';
			tmp += str.substr(3, 3);
			tmp += '-';
			tmp += str.substr(6);
			return tmp;
		} else {
			tmp += str.substr(0, 3);
			tmp += '-';
			tmp += str.substr(3, 4);
			tmp += '-';
			tmp += str.substr(7, 4);
			return tmp;
		}
		return str;
	}
	
	,PublishCode:function(){
		
		
		
		/*$(document).ready(function(){
			var liLst = document.querySelectorAll('.numLi');
			
			liLst.forEach((item, index) => {
				item.addEventListener('click', (event) => {
					var str = document.querySelector(".txtBox.tp2.numBox").innerText;
					var obj = `${event.currentTarget.dataset.value}`;
					var numCheck = isNaN(Number(obj));
					
					
					if (str.length < 13) {
						if (str.length > 2 && str.substr(0,3)==="050") {
							switch (str.length) {
							case 4:
							case 9:
								if (obj ==="delete") {
									str=str.substr(0,str.length-1);
								}else {
									str += "-" + obj;
								}
								break;
							case 6:
							case 11:
								if (obj ==="delete") {
									str=str.substr(0,str.length-2);
								}else {
									str += obj;
								}
								break;
							default:
								if (obj ==="delete") {
									str=str.substr(0,str.length-1);
								}else {
									str += obj;
								}
								break;
							}
						}else {
							switch (str.length) {
							//구분의 첫번째 글자
							case 5:
							case 10:
								if (obj ==="delete") {
									str=str.substr(0,str.length-2);
								}else {
									str += obj;
								}
								break;
								//구분의 마지막글자
							case 3:
							case 8:
								if (obj ==="delete") {
									str=str.substr(0,str.length-1);
								}else {
									str += "-" + obj;
								}
								break;
							case 2:
								if (obj==="0" || 
										obj==="1"|| 
										obj==="6"|| 
										obj==="7"|| 
										obj==="8"|| 
										obj==="9") {
									str += obj;
								}else if (obj ==="delete") {
									str=str.substr(0,str.length-1);
								}
								break;
							case 1:
								if (obj==="1"||obj==="5") {
									str += obj;
								}else if (obj ==="delete") {
									str=str.substr(0,str.length-1);
								}
								break;
							case 0:
								if (obj==="0") {
									str += obj;
								}else if (obj ==="delete") {
									str=str.substr(0,str.length-1);
								}
								str
								break;
							default:
								if (obj ==="delete") {
									str=str.substr(0,str.length-1);
								}else {
									str += obj;
								}
							break;
							}
						}
					}else if (str.substr(0,3)==="050" && str.length < 14) {
						if(obj==="delete"){
							str=str.substr(0,str.length-1);
						}else {
							str += obj;
						}
					}else if(obj==="delete"){
						str=str.substr(0,str.length-1);
					}
					
					if (obj==="cancel") {
						str="";
					}
					
					
					document.querySelector(".txtBox.tp2.numBox").innerText = str;
				});
			});
		});*/
	}
};
