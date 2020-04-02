//문자-직접입력 보류중
var page = {
		
	init:function(arg)
	{
		//"_oMessage":{"param":{"cldl_sct_cd":(집하:P,배달:D)}}
		page.initInterface(arg.data.param);
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
	
	,data : null
	
	,initInterface : function(data)
	{
		//닫기버튼
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
		
		
		//확인버튼
		$(".btn.red.w100p.m").click(function(){
			if ($("input:radio[name=ra]").is(":checked")) {
				data.code=$("input:radio[name=ra]:checked").attr("id");
				data.msg_seq=$("input:radio[name=ra]:checked").next().text();
				data.msg_cont=$("input:radio[name=ra]:checked").parents(".tit").next().text();
				LEMP.Window.close({
					"_oMessage":data,
					"_sCallback":"page.smsMsgSeletPopCallback"
				});
			}else {
				LEMP.Window.alert({
					"_sTitle" : "알림",
					"_vMessage" : "문구를 선택해주세요"
				});
			};
		});
		
		
		page.smsContList(data);
		
		page.data = data;
	}
	,smsContList : function(data){
		smutil.loadingOn();		// 로딩바 열기
		
		page.apiParam.param.baseUrl="smapis/cmn/smsContList";
		page.apiParam.param.callback="page.smsContListPopupCallback";
		page.apiParam.data.parameters=data;
		
		// 공통 api호출 함수 
		smutil.callApi(page.apiParam);
	}
	,smsContListPopupCallback:function(res){
		try{
			if (smutil.apiResValidChk(res) && res.code==="0000") {
				// 가져온 핸들바 템플릿 컴파일
				var template = Handlebars.compile($("#CLDL0206_list_template").html()); 
				// 핸들바 템플릿에 데이터를 바인딩해서 생성된 HTML을 DOM에 주입
				$('#cldl0206LstUl').append(template(res.data));
				
			}else {
				LEMP.Window.alert({
					"_sTitle" : "알림",
					"_vMessage" : "문구 정보를 받아오지 못했습니다.\n오류가 지속 될 시 담당자에게 연락 바랍니다."
				});
				LEMP.Window.close();
			}
		}
		catch(e){}
		finally{
			smutil.loadingOff();			// 로딩바 닫기
		}
	},
	
	
	// ################### 음성인식 호출 start
	callStt : function(){
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
		
	},
	
	
	// ios 음성인식 완료로직
	callSttIos : function(){
		page.apiParamInit();		// 파라메터 전역변수 초기화
		page.apiParam.id = "STT";

		// ios 기기인경우 시작과 종료 파라메터를 셋팅해 줘야함
		page.apiParam.param = {				// api 통신용 파라메터
			"type" : "disConnect"
		};
		
		// 공통 api호출 함수
		smutil.nativeMothodCall(page.apiParam);
		
		page.apiParamInit();			// 파라메터 전역변수 초기화
		
	},
	
	
	// 음성인식 콜백 
	sttCallback : function(result){
		try{
			
			if(!smutil.isEmpty(result)){
				// api 전송 성공
				if(result.status == "true"){
					var resultText = result.resultText;		// 검색어
					resultText = resultText.split(' ').join('');		// 모든 공백 제거
					var titText ;			// 문자 제목
					var msgId;				// 문자의 id값
					var msgLst = $('.msgTitleClass');
					var checked = false;
					
					// 문자 title 검색
					$.each(msgLst, function(idx, titObj){
						titText = $(titObj).text();
						if(!smutil.isEmpty(titText)){
							titText = titText.split(' ').join('');		// 모든 공백 제거
							
							// 음성인식값이 문자 제목에 포함되어있으면 표시하고 루프 탈출
							if(titText.indexOf(resultText) != -1){
								msgId = $(titObj).attr('for');
								$("#"+msgId).attr("checked",true);
								checked = true;
								return false;
							}
						}
					});
					
					// 선택된 값이 있으면 문자 앱 호출
					if(checked){
						page.data.code=$("input:radio[name=ra]:checked").attr("id");
						page.data.msg_seq=$("input:radio[name=ra]:checked").next().text();
						page.data.msg_cont=$("input:radio[name=ra]:checked").parents(".tit").next().text();
						LEMP.Window.close({
							"_oMessage":page.data,
							"_sCallback":"page.smsMsgSeletPopCallback"
						});
					}
					else {
						LEMP.Window.alert({
							"_sTitle" : "알림",
							"_vMessage" : "'"+result.resultText+"'\n해당 문구가 존재하지 않습니다."
						});
					}
				}
				else if(result.status == "false"){
					LEMP.Window.alert({
						"_sTitle" : "알림",
						"_vMessage" : "음성인식에 실패했습니다."
					});
				}
				/*else if(result.status == "fail"){
					LEMP.Window.alert({
						"_sTitle" : "알림",
						"_vMessage" : "음성인식을 다시 시도해주세요."
					});
				}*/
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
	},
	// ################### 배달출발확정(전송) end
	
};

