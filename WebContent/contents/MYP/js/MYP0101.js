var page = {
	apiParam : {
		id : "HTTP", // 디바이스 콜 id
		param : {// 디바이스가 알아야할 데이터
			task_id : "", // 화면 ID 코드가 들어가기로함
				// position : {}, // 사용여부 미확정
			type : "",
			baseUrl : "",
			method : "POST", // api 호출 형식(지정 안하면 'POST' 로 자동 셋팅)
			callback : "", // api 호출후 callback function
			contentType : "application/json; charset=utf-8"
		},
		data : {
			"parameters" : {}
		}
		// api 통신용 파라메터
	},
	init : function(){
		page.initInterface();
		page.smInfoList();
	},
	
	initInterface : function(){
		// 비밀번호 변경버튼 클릭
		$(document).on('click','#changePwd', function(e){
			
			var accessToken = LEMP.Properties.get({
				"_sKey" : "accessToken"
			});
			
			
			var loginId = LEMP.Properties.get({
				"_sKey" : "dataId"
			});
			
			// 난독화화 함께 적용하기로하고 주석처리
			/*if(!smutil.isEmpty(loginId)){
				loginId = atob(loginId);		// 평문으로 디코딩
			}*/
			
			var dataCpno = LEMP.Properties.get({
				"_sKey" : "dataCpno"
			});
			
			
			// 난독화화 함께 적용하기로하고 주석처리
			/*if(!smutil.isEmpty(dataCpno)){
				dataCpno = atob(dataCpno);		// 평문으로 디코딩
			}*/
			
			
			var popUrl = smutil.getMenuProp('MYP.MYP0102', 'url');
			
			// 비밀번호 변경페이지로 이동
			LEMP.Window.open({
				"_sPagePath" : popUrl,
				"_oMessage" : {
					"param" : {
						"status" : "MYPAGE_PWCHANG",
						"accessToken" : accessToken,
						"principal" : loginId,
						"usrCpno" : dataCpno
					}
				}
			});
		});

		//푸시데이터 삭제 버튼 클릭
		$(document).on('click','#delPushDb', function(e){
			var tr = {
				id:"DELPUSHDB",
				param:{
					"type": "DELPUSHDB",
					"callback":"page.delPushDbCallback"
				}
			};

			// native 기능 호출
			smutil.nativeMothodCall(tr);
		});
	},
	
	smInfoList : function(){
		smutil.loadingOn();
		page.apiParam.param.baseUrl = "/smapis/cmn/smInf";
		page.apiParam.param.callback = "page.sminfoMyCallback";
		page.apiParam.data = {
			"parameters" : {
			}
		}
		smutil.callApi(page.apiParam);
	},
	
	sminfoMyCallback :function(res){	
		try{
			if(smutil.apiResValidChk(res) && res.code === "0000"){

				var source = $("#MYP0101_template").html();
				var template = Handlebars.compile(source);
				
				Handlebars.registerHelper('monSumMyp', function(res){
					var data = res.data.root;
					return Number(data.cur_pick_rate)+Number(data.cur_dlv_rate);
				});

				Handlebars.registerHelper('infoMonL', function(res){
					var data = res.data.root.cur_mon;
					var FData = data.substring(0,4);
					var LData = data.substring(4,6);
					return FData+"년 "+LData+"월";
				});
				Handlebars.registerHelper('infoMonC', function(res){
					var data = res.data.root.cur_mon;
					var LData = data.substring(4,6);
					return LData+"월";
				});
			
				Handlebars.registerHelper('2mag', function(res){
					var data = res.data.root.cur_mon;
					var LData = Number(data.substring(4,6))-2+"월";
						if(LData=="0월"){
							LData ="12월";
						}else if(LData =="-1월"){
							LData ="11월";
						}
					
					return LData;
				});
				
				Handlebars.registerHelper('1mag', function(res){
					var data = res.data.root.cur_mon;
					var LData = String(Number(data.substring(4,6))-1)+"월";
					if(LData === "0월"){
						LData = "12월";
					}
					return LData;
				});
				
			
//				if(smutil.isEmpty(res.emp_img_path)){
//					res.emp_img_path = '../../common/img/icon-man.png';
//				}
				
				$("#MypInfoList").html(template(res));

				$('#bacodeNumber').barcode(res.k7_conf_no,"ean13",{barWidth:2, barHeight:50});
			}
		}catch(e){}
		finally{
			smutil.loadingOff();
		}
	},

	delPushDbCallback : function (res){
		if (res.status === "true") {
			LEMP.Window.alert({
				"_sTitle" : "푸시 데이터 삭제",
				"_vMessage" : "푸시 데이터가 삭제되었습니다."
			});
		}
	}
}