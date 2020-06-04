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
		page.initParam = arg.data.param;
		page.initEvent();					// 이벤트 등록
		page.initDpEvent();
	},

	initParam : null,				// 이전 페이지에서 넘어온 파라메터
	chgpwResult : null,				// 인증문자 요청시 넘어온 결과값
	authUsrCpno:null,				// 인증정보를 요청한 전화번호

	initEvent : function()
	{

		// 번호요청 비밀번호 변경버튼 클릭
		$("#pwChangeBtn").click(function(){

			// 비밀번호 벨리데이션 체크 후 api 호출
			if(page.checkPassword()){
				// 비밀번호 변경호출
				page.chgpw();
			}

		});


		// 통화버튼 클릭
		$('#infoTelNo').on('click', function(e){
			var phoneNumberTxt = $(this).text();

			// 전화걸기 팝업 호출
			$('#popPhoneTxt').text(phoneNumberTxt);
			$('.mpopBox.phone').bPopup();

		});

		// 통화팝업 버튼 클릭
		$('#phoneCallYesBtn').click(function(e){

			var phoneNumber = $('#popPhoneTxt').text();
			phoneNumber = phoneNumber.split('-').join('').replace(/\-/g,'');

			LEMP.System.callTEL({
				"_sNumber" : phoneNumber,
			});

		});

	},


	initDpEvent : function(){

		// 닫기버튼 이벤트 등록
		$(".btn.closeW.paR").click(function() {
			LEMP.Window.close({
				"_sCallback" : "page.pwResetVal"
			});
		});

		// 토큰값이 없으면 비밀번호 변경 못함
		if(smutil.isEmpty(page.initParam) || smutil.isEmpty(page.initParam.accessToken)){
			LEMP.Window.alert({
				"_sTitle":"비밀번호 변경오류",
				"_vMessage":"로그인에 성공하지 못했습니다.\n로그인 성공후 변경 가능합니다."
			});

			LEMP.Window.close({
				"_sCallback" : "page.pwResetVal"
			});

			return false;
		}

		// 디바이스 정보
//		var device_os_type = LEMP.Device.getInfo({
//			"_sKey" : "device_os_type"
//		});

	},

	//############################################################################
	// 비밀번호 유효성 체크 start

	checkPassword: function(){
		var credential = $('#credential').val();				// 비밀번호
		var reCredential = $('#reCredential').val();			// 비밀번호 확인

		if(smutil.isEmpty(credential)){
			LEMP.Window.alert({
				"_sTitle":"비밀번호 유효성 오류",
				"_vMessage":"비밀번호를 입력해 주세요."
			});

			$('#credential').focus();

			return false;
		}


		if(smutil.isEmpty(reCredential)){
			LEMP.Window.alert({
				"_sTitle":"비밀번호 유효성 오류",
				"_vMessage":"비밀번호 확인을 입력해 주세요."
			});

			$('#reCredential').focus();

			return false;
		}


		if(credential !== reCredential){
			LEMP.Window.alert({
				"_sTitle":"비밀번호 유효성 오류",
				"_vMessage":"입력한 비밀번호가 서로 다릅니다."
			});

			return false;
		}


		if(credential.length < 8){
			LEMP.Window.alert({
				"_sTitle":"비밀번호 유효성 오류",
				"_vMessage":"비밀번호는 최소 8자리 이상입니다."
			});
			return false;
		}


		var chk1 = /^(?=.*[a-zA-Z]).{8,100}$/.test(credential);
		var chk2 = /^(?=.*[~!@#$%<>^&*+=-]).{8,100}$/.test(credential);
		var chk3 = /^(?=.*[0-9]).{8,100}$/.test(credential);


		// 10글자 미만이면 영문, 숫자, 특수문자가 전부 포함되야함
		if(credential.length < 10){
			if(!chk1 || !chk2 || !chk1){
				LEMP.Window.alert({
					"_sTitle":"비밀번호 유효성 오류",
					"_vMessage":"숫자+영문자+특수문자 조합으로\n8자리 이상 사용해야 합니다."
				});

				return false;
			}
		}
		else{		// 10글자 이상이면 3가지 조건중 2가지만 들어가면 충족
			chkCnt = 0;
			if(chk1) chkCnt++;
			if(chk2) chkCnt++;
			if(chk3) chkCnt++;

			if(chkCnt < 2){
				LEMP.Window.alert({
					"_sTitle":"비밀번호 유효성 오류",
					"_vMessage":"숫자, 영문자, 특수문자 중 \n2가지 이상 조합으로\n10자리 이상 사용해야 합니다."
				});

				return false;
			}
		}


//		if(/(\w)\1\1\1/.test(password)){
//			alert('같은 문자를 4번 이상 사용하실 수 없습니다.');
//			$('#password').val('').focus();
//			return false;
//		}

//		if(password.search(id) > -1){
//			alert("비밀번호에 아이디가 포함되었습니다.");
//			$('#password').val('').focus();
//			return false;
//		}

		return true;
	},



	// 비밀번호 유효성 체크 end
	//############################################################################




	//############################################################################
	// 비밀번호 변경호출
	chgpw : function(){
		smutil.loadingOn();

		var credential = $('#credential').val();				// 비밀번호

		// 임시로 토큰 저장( 비밀번호 변경에 실패하면 토큰 삭제한다.)
		LEMP.Properties.set({
			"_sKey" : "accessToken",
			"_vValue" : page.initParam.accessToken
		});

		// 인증 요청한 전화번호 셋팅
		page.authUsrCpno = page.initParam.usrCpno;
		page.apiParam.param.baseUrl = "/usr/chgpw";					// api no
		page.apiParam.param.callback = "page.chgpwCallback";			// callback methode
		page.apiParam.data = {
			"principal" : page.initParam.principal,
			"usrCpno" : page.initParam.usrCpno,
			"credential" : credential
		};


		// 공통 api호출 함수
		smutil.callApi(page.apiParam);

		page.apiParamInit();				// 파라메터 전역변수 초기화

	},


	// 비밀번호 변경 callback
	chgpwCallback : function(res){

		if((res.code == "00" || res.code == "0000")){

			LEMP.Window.alert({
				"_sTitle":"비밀번호 변경성공",
				"_vMessage": "비밀번호 변경성공했습니다."
			});

			// 햄버거 메뉴 생성
			LEMP.SideView.create({
				"_sPosition" : "left",  // or right
				"_sPagePath" : "GNB/html/GNB0001.html",
				"_sWidth" : "100",
				"_oMessage" : {
					"param" : ""
				}
			});

			// 토큰 저장
			LEMP.Properties.set({
				"_sKey" : "accessToken",
				"_vValue" : page.initParam.accessToken
			});

			// app 사용시간 설정(25시간, 토큰이 24시간 이기때문에 그보다 더 길게 설정)
			LEMP.App.setTimeout({
				"_nSeconds" : 90000
			});

			// 메인페이지로 페이지 전환
			var popUrl = smutil.getMenuProp('MAN.MAN0001', 'url');
			LEMP.Window.replace({
				"_sPagePath":popUrl
			});

		}
		else {		// 비밀번호 변경오류
			// 임시로 저장한 토큰 삭제
			LEMP.Properties.remove({"_sKey":"accessToken"});

			LEMP.Window.alert({
				"_sTitle":"비밀번호 변경오류",
				"_vMessage": res.message
			});

		}

		smutil.loadingOff();
	},
	//############################################################################


};
