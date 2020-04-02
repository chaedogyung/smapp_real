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
		page.deviceInfo = smutil.deviceInfo;		// 해당 기기 android / ios 구분
		
		
		// ios 기기가 아니면 사용자 전화번호 전역변수로 셋팅
		if(page.deviceInfo !== "smios"){
			page.usrCpno = LEMP.Device.getInfo({
				"_sKey" : "mobile_number"
			});
		}
		
		
		page.initParam = arg.data.param;
		page.initEvent();					// 이벤트 등록
		page.initDpEvent();
		
	},
	
	usrCpno : null,					// 사용자 전화번호
	initParam : null,				// 이전 페이지에서 넘어온 파라메터
	reqcertResult : null,			// 인증문자 요청시 넘어온 결과값
	authUsrCpno:null,				// 인증정보를 요청한 전화번호
	
	initEvent : function()
	{
		
		// 닫기버튼 이벤트 등록
		$(".btn.closeW.paR").click(function() {
			LEMP.Window.close({
				"_sCallback" : "page.pwResetVal"
			});
		});
		
		
		// 번호요청 버튼 클릭( 번호요청 api 콜 한후 3분 타이머 시작. 인증전송 버튼 클릭 가능하도록 변경.)
		$("#accessNumBtn").click(function(){
			// 인증문자 요청 api 호출 
			page.reqcert();
			
		});
		
		
		// 인증버튼 클릭(3분 이내면 이고 인증번호가 입력되었으면 인증 api 호출가능. 아니면 버튼 클릭 못함.) 
		$("#accessBtn").click(function(){
			page.cert();
		});
		
	},
	
	deviceInfo : null,			// android(smandroid) / ios(smios) 구분
	initDpEvent : function(){
		
		// 안드로이드 폰은 전화번호 체번으로 전화번호 변경 불가하도록 처리
		if(page.deviceInfo !== "smios"){
			$("#phone1").attr("disabled",true);
			$("#phone2").attr("disabled",true);
			$("#phone3").attr("disabled",true);
			
			// 전화번호 셋팅
			var usrCpno = page.usrCpno;
			
			// 전화번호 체번 성공일경우
			if(!smutil.isEmpty(usrCpno)){
				if(usrCpno.startsWith( '+82' )){
					usrCpno = "0" + usrCpno.substring(3, usrCpno.length);
				}
				
				usrCpno = usrCpno.LPToFormatPhone();		// 전화번호 형식으로 변경
				page.authUsrCpno = usrCpno;					// 인증번호 요청 전화번호 전역변수에 셋팅
				usrCpno = usrCpno.split('-');
				
				$("#phone1").val(usrCpno[0]);
				$("#phone2").val(usrCpno[1]);
				$("#phone3").val(usrCpno[2]);
			}
			// 전화번호 채번 실패일경우
			else {
				LEMP.Window.alert({
					"_sTitle":"오류",
					"_vMessage":"전화번호를 구해올수 없습니다.\n유심정보를 확인해주세요."
				});
				
				// 타이머 0 처리
				page.setTimerSec = 0;
				
				//버튼 비활성화 처리
				$('#accessNumBtn').removeClass("red");				// 문자버튼 비활성화
				$('#accessNumBtn').addClass("gray");				// 문자버튼 비활성화
				$('#accessBtn').removeClass("red");					// 인증버튼 비활성화
				$('#accessBtn').addClass("gray");					// 인증버튼 비활성화
				
				$("#accessNumBtn").attr("disabled",true);			// 문자버튼 비활성화
				$("#accessBtn").attr("disabled",true);				// 인증버튼 비활성화
				$("#timeTxt").text('');
				
			}
		}	// 안드로이드인경우 끝
		
		
		// 닫기버튼
		$('#closeButtomBtn').click(function(){
			LEMP.Window.close({
				"_sCallback" : "page.pwResetVal"
			});
		});
		
	},
	
	// 타이머 설정값 start
	setTimerSec : 179,
	tid : "",
	
	// 타이머 시작
	timerStart: function (){ 
		page.tid = setInterval('page.msgTime()',1000);
	},
	
	// 타이머 종료
	timerEnd: function (){ 
		clearInterval(page.tid);		// 타이머 해제
	},
	
	// 1초씩 타이머 설정
	msgTime: function() {	
		var sec = (page.setTimerSec % 60);
		if(sec < 10) {
			sec = '0'+sec;
		}
		var msg = Math.floor(page.setTimerSec / 60) + "분 " + sec + "초";		// 남은 시간 계산
		
		$('#timeTxt').text(msg);		// div 영역에 보여줌 
				
		page.setTimerSec--;					// 1초씩 감소
		
		if (page.setTimerSec < 0) {			// 시간이 종료 되었으면..
			clearInterval(page.tid);		// 타이머 해제
			
			$('#accessBtn').removeClass("red");				// 인증버튼 비활성화
			$('#accessBtn').addClass("gray");				// 인증버튼 비활성화
		}
		
	},
	// 타이머 설정값 end
	
	
	//############################################################################
	// 인증번호 문자요청 시작
	reqcert : function(){
		
		var phone1 = $('#phone1');
		var phone2 = $('#phone2');
		var phone3 = $('#phone3');
		
		// 전화번호는 숫자로 고정
		var chk = /^[0-9]+$/;
		var chk2 = chk.test(phone2.val());
		var chk3 = chk.test(phone3.val());
		
		
		if(smutil.isEmpty($.trim(phone2.val()))){
			
			LEMP.Window.alert({
				"_sTitle":"인증번호요청 오류",
				"_vMessage":"전화번호를 입력해 주세요."
			});
			
			return false;
		}
		else if(smutil.isEmpty($.trim(phone3.val()))){
			LEMP.Window.alert({
				"_sTitle":"인증번호요청 오류",
				"_vMessage":"전화번호를 입력해 주세요."
			});
			
			return false;
		}
		else if(!chk2){
			LEMP.Window.alert({
				"_sTitle":"인증번호요청 오류",
				"_vMessage":"전화번호는 숫자로 입력해 주세요."
			});
			
			return false;
		}
		else if(!chk3){
			LEMP.Window.alert({
				"_sTitle":"인증번호요청 오류",
				"_vMessage":"전화번호는 숫자로 입력해 주세요."
			});
			
			return false;
		}
		else if(smutil.isEmpty(page.initParam)
				|| (!smutil.isEmpty(page.initParam) && smutil.isEmpty(page.initParam.principal))){
			LEMP.Window.alert({
				"_sTitle":"인증번호요청 오류",
				"_vMessage":"번호요청에 필요한 id가 없습니다.\n관리자에게 문의해 주세요."
			});
			
			return false;
		}
		
		
		var usrCpno = phone1.val() +"-"+ phone2.val() +"-"+ phone3.val();
		
		// 인증 요청한 전화번호 셋팅
		page.authUsrCpno = usrCpno;
		page.apiParam.param.baseUrl = "/auth/reqcert";					// api no
		page.apiParam.param.callback = "page.reqcertCallback";			// callback methode
		page.apiParam.data = {
			"principal" : page.initParam.principal,
			"usrCpno" : usrCpno
		};
		
		smutil.loadingOn();
		
		// 공통 api호출 함수 
		smutil.callApi(page.apiParam);
		
		LEMP.Window.toast({
			"_sDuration" : "short",
			"_sMessage" : "인증번호를 요청하였습니다."
		});
		
		$('#accessBtn').removeClass("gray");				// 인증버튼 활성화
		$('#accessBtn').addClass("red");					// 인증버튼 활성화
		
		page.apiParamInit();				// 파라메터 전역변수 초기화
		
	},
	
	
	// 인증번호 문자요청 callback
	reqcertCallback : function(res){
		
		if((res.code == "00" || res.code == "0000")
				&& !smutil.isEmpty(res.certKey) 
				&& !smutil.isEmpty(res.certTm)){
			
			// 인증값 전역변수에 셋팅
			page.reqcertResult = res;
			
			// 타이머 셋팅
			page.setTimerSec = 179;		// 3분 셋팅
			page.timerStart();		// 3분 타이머 시작
			
		}
		else {		// 인증번호 요청 실패
			
			LEMP.Window.alert({
				"_sTitle":"인증번호요청 오류",
				"_vMessage": res.message
			});
			
			page.reqcertResult = null;
		}
		
		
		smutil.loadingOff();
	},
	//############################################################################
	
	
	
	
	//############################################################################
	// 인증요청 시작
	cert : function(){
		
		var certNo = $('#certNo');				// 인증번호
		
		// 인증문자 요청을 안한경우
		if(smutil.isEmpty(page.reqcertResult)){
			LEMP.Window.alert({
				"_sTitle" : "인증요청 오류",
				"_vMessage": "인증번호 요청이 완료되지 않았습니다.\n인증번호를 먼저 요청해주세요."
			});
			
			return false;
		}
		
		// 인증번호 입력 안함
		if(smutil.isEmpty(certNo.val())){
			LEMP.Window.alert({
				"_sTitle" : "인증요청 오류",
				"_vMessage": "인증번호를 입력해 주세요."
			});
			
			certNo.focus();
			return false;
		}
		
		
		// 3분이 지난경우
		if(page.setTimerSec <= 0){
			LEMP.Window.alert({
				"_sTitle" : "인증요청 오류",
				"_vMessage": "3분이 초과되었습니다.\n다시 인증번호를 요청해주세요."
			});
			
			return false;
		}
		
		if(!smutil.isEmpty(page.initParam) && smutil.isEmpty(page.initParam.principal)){
			LEMP.Window.alert({
				"_sTitle":"인증번호요청 오류",
				"_vMessage":"번호요청에 필요한 id가 없습니다.\n관리자에게 문의해 주세요."
			});
			
			return false;
		}
		
		certNo = certNo.val();								// 인증번호
		var principal = page.initParam.principal;			// 요청자 id
		var usrCpno = page.authUsrCpno;						// 인증 요청한 전화번호
		var certKey = page.reqcertResult.certKey;			// 인증키
		var certTm = page.reqcertResult.certTm;				// 인증시간
		var certSct = "00";									// 00 : 앱 최초 설치 인증요청(비밀번호 초기화할 필요 없음, 인증값 생성해서 db저장), 01 : 비밀번호 변경용 인증요청(비밀번호 초기화하고 임시 비밀번호 문자발송)
		var status = page.initParam.status;
		
		
		// (최초 로그인, 초기비밀번호) : 비밀번호 변경 안함
		if(status == "INIT_LOGIN" || status == "INIT_PW"){
			certSct = "00";
		}
		// (장기 미접속 차단, 비밀번호오류 횟수초과, 비밀번호 초기화버튼 클릭): 비밀번호 변경
		else if(status == "LONG_TIM_PW" || status == "PW_FAIL_CNT_ERR" || status == "PASSWORD_RESET"){
			certSct = "01"
		}
		// (ios) : 비밀번호 변경 안함
		else if(status == "smios"){
			certSct = "00"
		}
		
		page.apiParam.param.baseUrl = "/auth/cert";					// api no
		page.apiParam.param.callback = "page.certCallback";			// callback methode
		page.apiParam.data = {
			"principal" : principal,
			"usrCpno" : usrCpno,
			"certKey" : certKey,
			"certTm" : certTm,
			"certNo" : certNo,
			"certSct" : certSct
		};
		
		// 공통 api호출 함수 
		smutil.callApi(page.apiParam);
		
		
		page.apiParamInit();				// 파라메터 전역변수 초기화
		
	},
	
	
	// 인증요청 callback
	certCallback : function(res){
		
		// 토큰 결과값에 따라서 페이지 이동(사용가능이면 메인으로 이동, 불가능이면 다시 로그인)
		// 사용가능 토큰이면 자동으로 메인페이지 이동로직
//		if(smutil.apiResValidChk(res) && (res.code == "00" || res.code == "0000")){
		if((res.code == "00" || res.code == "0000")){
			
			var code = res.code;
			var message = res.message;
			var principal = page.initParam.principal;
			var cpNo = page.authUsrCpno;	// 인증받은 전화번호('-' 없음)
			
			// 난독화화 함께 적용하기로하고 주석처리
			// base64 로 인코딩
			/*if(principal){
				principal = btoa(principal);
			}*/
			
			// 난독화화 함께 적용하기로하고 주석처리
			// base64 로 인코딩
			/*if(cpNo){
				cpNo = btoa(page.authUsrCpno.split('-').join(''));	// 인증받은 전화번호('-' 없음)
			}*/
			
			// 인증성공 정보 (id : 인증 성공한 전화번호)
			var authCertInfo = {
				"principal" : principal,			// 인증받은 id
				"usrCpno" : cpNo								// 인증받은 전화번호('-' 없음)
			};
			
			
			// 인증정보 메모리에 저장
			LEMP.Properties.set({
				"_sKey" : "authCertInfo",
				"_vValue" : authCertInfo
			});
			
			
			// 인증 성공 후에는 무조건 다시 로그인
			LEMP.Window.alert({
				"_sTitle":"인증성공",
				"_vMessage": "인증에 성공했습니다.\n로그인을 진행해 주세요."
			});
			
			// ios 인 경우 로그인 버튼으로 바꿔줘야 하기때문에 status 를 리턴한다.
			LEMP.Window.close({
				"_sCallback" : "page.pwResetVal",
				"_oMessage" : {
					"param" : {
						"status" : page.initParam.status,
						"usrCpno" : page.authUsrCpno.split('-').join('')
					}
				}
			});
			
			
			// 초기 비밀번호는 사용자가 넘어온 경우에는 인증 성공후 메인페이지로 이동 
//			if(page.initParam.status == "INIT_PW"){
//				
//				if(!smutil.isEmpty(page.initParam.accessToken)){
//					// 토큰 저장
//					LEMP.Properties.set({
//						"_sKey" : "accessToken",
//						"_vValue" : page.initParam.accessToken
//					});
//					
//					
//					// app 사용시간 설정(25시간, 토큰이 24시간 이기때문에 그보다 더 길게 설정)
//					LEMP.App.setTimeout({
//						"_nSeconds" : 90000
//					});
//					
//					LEMP.Window.alert({
//						"_sTitle":"인증성공",
//						"_vMessage": "인증에 성공했습니다."
//					});
//					
//					// 메인페이지로 페이지 전환
//					var popUrl = smutil.getMenuProp('MAN.MAN0001', 'url');
//					LEMP.Window.replace({
//						"_sPagePath":popUrl
//					});
//				}
//				else{
//					LEMP.Window.alert({
//						"_sTitle":"인증오류",
//						"_vMessage": "인증후 로그인에 필요한 토큰값이 없습니다.\n관리자에게 문의해 주세요."
//					});
//				}
//				
//			}
//			else {			// 초기 비밀번호 사용자가 아닌경우에는 무조건 로그인
//				LEMP.Window.alert({
//					"_sTitle":"인증성공",
//					"_vMessage": "인증에 성공했습니다.\n로그인을 진행해 주세요."
//				});
//				
//				LEMP.Window.close({
//					"_sCallback" : "page.pwResetVal"
//				});
//			}
			
		}
		else {		// 인증번호 요청 실패
			LEMP.Window.alert({
				"_sTitle":"인증실패",
				"_vMessage": res.message
			});
			
			return false;
			
		}
	},
	//############################################################################
	
	
	
	
};