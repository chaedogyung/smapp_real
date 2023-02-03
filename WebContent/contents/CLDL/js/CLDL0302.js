var page = {
		
	init:function(arg)
	{
		page.cldl0302=arg.data.param;
		console.log(page.cldl0302);
		page.initInterface();
	}
	,apiParam : {
		id:"HTTP",			// 디바이스 콜 id
		param:{				// 디바이스가 알아야할 데이터
			task_id : "",										// 화면 ID 코드가 들어가기로함
			//position : {},									// 사용여부 미확정 
			type : "",
			baseUrl : "",
			method : "POST",									// api 호출 형식(지정 안하면 'POST' 로 자동 셋팅)
			callback : "",					// api 호출후 callback function
			contentType : "application/json; charset=utf-8"
		},
		data:{				// api 통신용 파라메터
			"parameters" : {}
		}
	}
	// api 파람메터 초기화 
	,apiParamInit : function(){
		page.apiParam =  {
			id:"HTTP",			// 디바이스 콜 id
			param:{				// 디바이스가 알아야할 데이터
				task_id : "",										// 화면 ID 코드가 들어가기로함
				//position : {},									// 사용여부 미확정 
				type : "",
				baseUrl : "",
				method : "POST",									// api 호출 형식(지정 안하면 'POST' 로 자동 셋팅)
				callback : "",					// api 호출후 callback function
				contentType : "application/json; charset=utf-8"
			},
			data:{"parameters" : {}}// api 통신용 파라메터
		};
	}
	,cldl0302:{}
	,initInterface : function()
	{
		// 닫기 버튼
		$(".btn.closeW.paR").click(function(){
			LEMP.Window.close();
		});

		//마이크 버튼
		$("#micBtn").click(function(){
			page.callStt();
		});

		// ios 음성인식 완료버튼을 클릭한경우 
		$(".btn.gray3.m.w100p.b-close").click(function(){
			page.callSttIos();
		});
		
		// 검색버튼 클릭
		$("#addrSearch").click(function(){
			var data = {};
			
			var addr = $("#addr_input").val();
			var network = $("input[type=radio][id$=SVC_CD]:checked").val();
			
			var zip_no_input = ($("#zip_no_input").val()).replace(/\-/gi,"");
			var area_no;		//새우편번호
			var zip_no;			//구우편번호
			
			if(zip_no_input.length == 5){
				area_no = zip_no_input;
				zip_no = "";
			}else if(zip_no_input.length == 6){
				area_no = "";
				zip_no = zip_no_input;
			}else if(zip_no_input.length == 0){
				area_no = "";
				zip_no = "";
			}else{
				LEMP.Window.toast({
					"_sMessage":"유효하지 않은 우편번호",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle" : "분류코드 검색",
//					"_vMessage" : "유효하지 않은 우편번호"
//				});
				
				$("#cldl0302Ul").html("");
				return;
			}
			
			if (smutil.isEmpty(addr)) {
				LEMP.Window.toast({
					"_sMessage":"전체 주소를 입력해주세요.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle" : "분류코드 검색",
//					"_vMessage" : "전체 주소를 입력해주세요."
//				});
			}else if ($("#addr_input").val().length < 2) {
				LEMP.Window.toast({
					"_sMessage":"전체 주소를 입력해주세요.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle" : "분류코드 검색",
//					"_vMessage" : "전체 주소를 입력해주세요."
//				});
			}else {
				data = {
					"network": network,
					"address": addr,
					"zip_no": zip_no,
					"area_no": area_no
				}
				
				page.addr(data);
			}
			
		});
	}
	// ################### 음성인식 호출 start
	,callStt : function(){
		page.apiParamInit();		// 파라메터 전역변수 초기화
		page.apiParam.id = "STT";
		
		// ios 기기인경우 시작과 종료 파라메터를 셋팅해 줘야함
		if(smutil.deviceInfo == "smios"){
			page.apiParam.param = {				// api 통신용 파라메터
				"type" : "connect"
			};
		}
		else{
			page.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {}
			};
		}
		
		if(smutil.deviceInfo == "smios"){		// ios
			// 종료 버튼이 있는 음성인식 바 넣기
			$('.mpopBox.sms2').bPopup({modalClose: false});
		}
		else {		// android
			// 음성인식 바 넣기
			$('.mpopBox.sms').bPopup({modalClose: false});
		}
		
		// 공통 api호출 함수
		smutil.nativeMothodCall(page.apiParam);
		
		page.apiParamInit();			// 파라메터 전역변수 초기화
		
	}
	// ios 음성인식 완료로직
	,callSttIos : function(){
		page.apiParamInit();		// 파라메터 전역변수 초기화
		page.apiParam.id = "STT";

		// ios 기기인경우 시작과 종료 파라메터를 셋팅해 줘야함
		page.apiParam.param = {				// api 통신용 파라메터
			"type" : "disConnect"
		};
		
		// 공통 api호출 함수
		smutil.nativeMothodCall(page.apiParam);
		
		page.apiParamInit();			// 파라메터 전역변수 초기화
		
	}
	// 음성인식 콜백 
	,sttCallback : function(result){
		try{
			
			if(!smutil.isEmpty(result)){
				// api 전송 성공
				if(result.status == "true"){
					var resultText = result.resultText;		// 검색어
					
					$('#addr_input').val(result.resultText);
				}
				else if(result.status == "false"){
					LEMP.Window.toast({
						"_sMessage":"음성인식에 실패했습니다.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle" : "알림",
//						"_vMessage" : "음성인식에 실패했습니다."
//					});
				}
			}
			
		}
		catch(e){}
		finally{
			
			if(smutil.deviceInfo == "smios"){		// ios
				$('.mpopBox.sms2').bPopup().close();
			}
			else {		// android
				$('.mpopBox.sms').bPopup().close();
			}
			
			page.apiParamInit();			// 파라메터 전역변수 초기화
		}
	}
	,addr:function(data){
		
		smutil.loadingOn();		// 로딩바 열기
		
		page.apiParam.param.baseUrl="smapis/newAddress";
		page.apiParam.param.callback="page.addrCallback";
		page.apiParam.data.parameters=data;
		
		// 공통 api호출 함수 
		smutil.callApi(page.apiParam);
	}
	,addrCallback:function(data){
		try{
			var res = data.api_msg;
			var template;
			
			if (smutil.apiResValidChk(data) && data.code=="0000") {
				
				console.log(res.air_fare)
				if(res.result === "success"){
					if(res.air_fare == 0) {
						template = Handlebars.compile($("#cldl0302_list_template").html());
					} else {
						template = Handlebars.compile($("#cldl0302_list_template_airFare").html());
						
					}
					$("#cldl0302Ul").html(template(res));
				}
				else {
					LEMP.Window.toast({
						"_sMessage":res.message,
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle" : "분류코드 검색",
//						"_vMessage" : res.message
//					});
					var template = Handlebars.compile($("#no_list_template").html());
					$("#cldl0302Ul").html(template(res));
				}
			}
		}
		catch(e){}
		finally{
			smutil.loadingOff();			// 로딩바 닫기
		}
	}
	
};

