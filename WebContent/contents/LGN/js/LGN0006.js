LEMP.addEvent("backbutton", "page.callbackBackButton");

var page = {
		
	// api 호출 기본 형식
	apiParam : {
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
	},
	
	
	// api 파람메터 초기화 
	apiParamInit : function(){
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
	},
	
	init:function(arg)
	{
		// 사용자 id 가 있을경우 id 저장
		if(arg && !smutil.isEmpty(arg.data) 
				&& !smutil.isEmpty(arg.data.param)
				&& !smutil.isEmpty(arg.data.param.principal)){
			
			page.principal = arg.data.param.principal;		// 로그인 성공한 id
		}
		
		page.term();						// 개인정보 동의내용 조회
		page.initEvent();					// 이벤트 등록
		
	},
	
	principal : null, 				// 로그인에 성공한 id
	
	initEvent : function(){
		
		
		/* 동의안함버튼 클릭 */
		$("#disagreeBtn").on('click',function(){
			page.callbackBackButton();
		});
		
		// 동의함 클릭
		$("#agreeBtn").on('click',function(){

			// 사용자 id 가 있을경우 사용자 동의정보를 서버에 전송
			if(!smutil.isEmpty(page.principal)){
				// 동의정보 처리
				page.accept();
			}
			else{		// id가 없을경우 서버에 저장하지 않고 properties 에 동의정보 저장하고 화면 종료
				
				// 개인정보 동의값 properties 에 저장
				var personalInfo = {
						"term_id" : page.term_id,
						"accept_yn" : "Y"
				}
				
				// id 저장(로그인 페이지 셋팅용)
				LEMP.Properties.set({
					"_sKey" : "personalInfo",
					"_vValue" : personalInfo
				});
				
				LEMP.Window.alert({
					"_sTitle":"개인정보 동의 저장",
					"_vMessage":"개인정보 동의내용을 저장했습니다."
				});
				
				
				LEMP.Window.close({});
			}
		});
	},
	
	
	// ################### 개인정보 동의 조회 start
	term : function(){
		
		var _this = this;
		
		_this.apiParamInit();	// 파라메터 전역변수 초기화
		_this.apiParam.id = "HTTP";
		_this.apiParam.param.baseUrl = "term";								// api no
		_this.apiParam.param.callback = "page.termCallback";				// callback methode
		_this.apiParam.data = {
			"parameters" : {
				"principal" : smutil.nullToValue(page.principal, "")		// 로그인에 성공한 id
			}
		};							// api 통신용 파라메터
		
		// 프로그래스바 열기
		smutil.loadingOn();
		
		// 공통 api호출 함수 
		smutil.callApi(_this.apiParam);
		
		// 파라메터 전역변수 초기화
		_this.apiParamInit();
	},
	
	term_id : null, 				// 개인정보 id
	
	termCallback : function(result){
		page.apiParamInit();		// 파라메터 전역변수 초기화

		// api 결과 성공여부 검사
		if(!smutil.isEmpty(result) && result.code == "0000"){
			
			// 조회 결과 text 가 있으면 화면에 셋팅
			if(!smutil.isEmpty(result.term_cont)){
				var term_cont = result.term_cont.split('\r\n').join('<br><br>');
				$("#contentsDiv").html(term_cont);
			}
			else{
				$("#contentsDiv").html('');
			}
			
			// 사용자 동의정보 id
			if(!smutil.isEmpty(result.term_id)){
				page.term_id = result.term_id;
			}
		}
		
		// 프로그래스바 닫기
		smutil.loadingOff();
		
	},
	// ################### 개인정보 동의 조회 end
	
	
	
	// ################### 개인정보 동의여부 전송 start
	accept : function(){
		
		var _this = this;
		
		_this.apiParamInit();	// 파라메터 전역변수 초기화
		_this.apiParam.id = "HTTP";
		_this.apiParam.param.baseUrl = "term/accept";						// api no
		_this.apiParam.param.callback = "page.acceptCallback";				// callback methode
		_this.apiParam.data = {
			"term_id" : page.term_id,									// 개인정보 동의 id
			"principal" : page.principal,								// 로그인에 성공한 id
			"accept_yn" : "Y"											// 동의함
		};							// api 통신용 파라메터
		
		// 프로그래스바 열기
		smutil.loadingOn();
		
		// 공통 api호출 함수 
		smutil.callApi(_this.apiParam);
		
		// 파라메터 전역변수 초기화
		_this.apiParamInit();
	},
	
	
	acceptCallback : function(result){
		
		smutil.loadingOff();		// 프로그래스바 닫기
		page.apiParamInit();		// 파라메터 전역변수 초기화

		// api 결과 성공여부 검사
		if(smutil.apiResValidChk(result) && result.code == "0000"){
			
			var principal = page.principal;
			
			// 난독화화 함께 적용하기로하고 주석처리
			/*if(!smutil.isEmpty(principal)){
				// base64 인코딩
				principal = btoa(principal);
			}*/
			
			
			// 개인정보 동의값 properties 에 저장
			var personalInfo = {
				"term_id" : page.term_id,
				"principal" : smutil.nullToValue(principal,''),
				"accept_yn" : "Y"
			}
			
			
			LEMP.Properties.set({
				"_sKey" : "personalInfo",
				"_vValue" : personalInfo
			});
			
			
			LEMP.Window.alert({
				"_sTitle":"개인정보 동의 저장",
				"_vMessage":"개인정보 동의내용을 저장했습니다."
			});
			
			
			// 페이지 종료후 메인페이지로 이동하는 함수 호출
			LEMP.Window.close({
				"_sCallback" : "page.termPopupCallback"
			});
		}
		
		
	},
	// ################### 개인정보 동의여부 전송 end
	
	
	
	// 물리적 뒤로가기 버튼 혹은 동의하지않음 버튼 클릭시 종료여부 설정
	callbackBackButton : function() {
		var btnCancel = LEMP.Window.createElement({
			_sElementName : "TextButton"
		});
		btnCancel.setProperty({
			_sText : "취소",
			_fCallback : function() {
			}
		});

		var btnConfirm = LEMP.Window.createElement({
			_sElementName : "TextButton"
		});
		
		btnConfirm.setProperty({
			_sText : "확인",
			_fCallback : function() {
				// id 가 없을경우는 앱 종료
				if(smutil.isEmpty(page.principal)){
					// 저장되어있던 토큰 삭제
					LEMP.Properties.remove({_sKey:"accessToken"});
					
					// ios 기기인경우는 사용자 인증정보도 함께 삭제
					if(smutil.deviceInfo === "smios"){
						// 사용자 인증정보 삭제
						LEMP.Properties.remove({_sKey:"authCertInfo"});
					}
					
					LEMP.App.exit({
						_sType : "kill"
					});
				}
				else{
					smutil.logout();		// id가 있을경우는 로그아웃처리
				}
			}
		});

		LEMP.Window.confirm({
			_vMessage : "개인정보사용에 동의하지 않을경우 앱을 사용할수 없습니다.\n개인정보 동의를 하지않고 창을 닫으시겠습니까?",
			_aTextButton : [ btnCancel, btnConfirm ]
		});
	}
	
	
};