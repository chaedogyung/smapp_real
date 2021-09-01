LEMP.addEvent("resume", "page.pwResetVal"); // 페이지 열릴때마다 비밀번호 초기화

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
		data:{}// api 통신용 파라메터
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
			data:{}// api 통신용 파라메터
		};
	},

	deviceInfo : null,			// android(smandroid) / ios(smios) 구분
	init:function()
	{
		page.deviceInfo = smutil.deviceInfo;		// 해당 기기 android / ios 구분

		page.usrCpno = LEMP.Device.getInfo({
			"_sKey" : "mobile_number"
		});

		// GETPUSHTOKEN
		var param =  {
			id : "GETPUSHTOKEN",	// 디바이스 콜 id
			param : {
				callback : "page.getPushTokenCallback"// api 호출후 callback function
			}
		};

		smutil.nativeMothodCall(param);

		page.initDpEvent();
		page.initEvent();					// 이벤트 등록

	},
	usrCpno : null, 						// 디바이스 전화번호
	pushToken : null,						// 디바이스 푸시토큰
	loginUsrCpno : null,					// 로그인 요청한 전화번호
	isTermAgree : false,					// 이용약관 동의 여부
	isLmsAgree: false,						// 메시지 대량발송 동의 여부

	// 디바이스의 푸시토큰 구해오기
	getPushTokenCallback : function(res){
		page.pushToken = res.push_token;
	},

	initDpEvent : function(){

		// 저장해 놓은 id
		var principal = LEMP.Properties.get({
			"_sKey" : "saveId"
		});

		// 난독화화 함께 적용하기로하고 주석처리
//		if(!smutil.isEmpty(principal)){
//			principal = atob(principal);		// 평문으로 디코딩
//		}

		// 저장해 놓은 id체크박스값
		var saveIdChk = LEMP.Properties.get({
			"_sKey" : "saveIdChk"
		});

		// 저장해 놓은  id체크박스값 있는경우는  셋팅
		// 복호화 한 값이 숫자타입에 8자리만 셋팅한다.
		if(!smutil.isEmpty(saveIdChk)
			&& saveIdChk == "Y"
			&& $.isNumeric( principal )
			&& principal.length == 8){
			// 저장해 놓은 id 가 있는경우는 id 셋팅
			if(!smutil.isEmpty(principal)){
				$('#principal').val(principal);
			}

			$("input:checkbox[id='saveIdChk']").prop("checked", true);
		}
		else{
			$("input:checkbox[id='saveIdChk']").prop("checked", false);
		}


		// 설치권한 동의정보
		var installAuthConfirmYn = LEMP.Properties.get({
			"_sKey" : "installAuthConfirmYn"
		});

		// 설치 권한동의 값이 있을경우 토큰 벨리데이션해서 자동로그인 여부 결정
		if(!smutil.isEmpty(installAuthConfirmYn) && installAuthConfirmYn === "Y"){
			page.isvalid();						// 토큰 사용여부 확인
		}
		else{	// 권한정보가 없으면 토큰 삭제하고 권한동의 페이지를 띄운다
			// 토큰 삭제
			LEMP.Properties.remove({"_sKey":"accessToken"});

			// 권한동의 팝업오픈
			var popUrl = smutil.getMenuProp("LGN.LGN0004","url");

			LEMP.Window.open({
				"_sPagePath":popUrl,
			});

			// inito 화면 초기화
			$(".intro").fadeOut(800);

		}


		// 개인정보 동의값
		var personalInfo = LEMP.Properties.get({
			"_sKey" : "personalInfo"
		});

		// 최초 개인정보 동의를 하지 않거나 동의했지만 id가 없는경우는 무조건 동의페이지 띄우기
		if(smutil.isEmpty(personalInfo) || smutil.isEmpty(personalInfo.principal) || personalInfo.new_accept_yn !== "Y"){
			var popUrl = smutil.getMenuProp("LGN.LGN0006","url");

			LEMP.Window.open({
				"_sPagePath":popUrl,
			});
		}



		// 로그인과 사용자 인증 버튼 컨트롤
		// android or web
		if(page.deviceInfo !== "smios"){
			$('#loginBtn').show();				// 로그인 버튼 보이기
			$('#authUserBtn').hide();			// 사용자 인증버튼 감춤
		}
		// ios
		else{
			$('#loginBtn').hide();				// 로그인 버튼 숨김
			$('#authUserBtn').show();			// 사용자 인증버튼 보이기
		}


	},


	initEvent : function()
	{

		// 로그인 버튼 클릭
		$("#loginBtn").click(function(){
			//###################################################### test 용 start
			// 햄버거 메뉴 생성
			// LEMP.SideView.create({
			// 	"_sPosition" : "left",  // or right
			// 	"_sPagePath" : "GNB/html/GNB0001.html",
			// 	"_sWidth" : "100",
			// 	"_oMessage" : {
			// 		"param" : ""
			// 	}
			// });
			//
			// var popUrl = smutil.getMenuProp("MAN.MAN0001","url");
			//
			// LEMP.Window.open({
			// 	"_sPagePath":popUrl,
			// });
			//
			// return;
			//###################################################### test 용 end
			// 안드로이드 혹은 웹
			if(page.deviceInfo !== "smios"){
				// 사용자 전화번호 셋팅 추가
				page.usrCpno = LEMP.Device.getInfo({
					"_sKey" : "mobile_number"
				});
			}

			page.login();

		});



		// 사용자인증 버튼 클릭
		$("#authUserBtn").click(function(){
			//###################################################### test 용 start
//			// 햄버거 메뉴 생성
//			LEMP.SideView.create({
//				"_sPosition" : "left",  // or right
//				"_sPagePath" : "GNB/html/GNB0001.html",
//				"_sWidth" : "100",
//				"_oMessage" : {
//					"param" : ""
//				}
//			});
//
//			var popUrl = smutil.getMenuProp("MAN.MAN0001","url");
//
//			LEMP.Window.open({
//				"_sPagePath":popUrl,
//			});
//
//			return;
			//###################################################### test 용 end

			var id = $.trim($('#principal').val());

			if(smutil.isEmpty(id)){

				LEMP.Window.alert({
					"_sTitle":"사용자인증 오류",
					"_vMessage":"ID를 입력해 주세요."
				});

				$('#principal').focus();

				return false;
			}

			// 인증페이지 팝업 오픈
			var popUrl = smutil.getMenuProp('LGN.LGN0002', 'url');

			// 인증 페이지로 이동
			LEMP.Window.open({
				"_sPagePath" : popUrl,
				"_oMessage" : {
					"param" : {
						"status" : page.deviceInfo,					// ios 인증절차
						"principal" : id							// 로그인 id
					}
				}
			});
		});


		// 비밀번호 초기화 버튼 클릭
		$("#pwResetBtn").click(function(){
			page.pwResetProc();
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


		// id 값이 변하는 경우 실시간 이벤트 감시
		$("#principal").on("propertychange change keyup paste input", function(e) {

			// ios 기기일경우 id가 바뀌면 인증 완료 정보를 삭제하고 버튼을 사용자 인증버튼으로 바꾼다.
			if(page.deviceInfo === "smios"){
				var currentVal = $(this).val();
				if(currentVal === page.oldId_ios) {
					return;
				}

				page.oldId_ios = currentVal;

				// 사용자 인증정보 삭제
				LEMP.Properties.remove({_sKey:"authCertInfo"});

				$('#loginBtn').hide();				// 로그인 버튼 숨김
				$('#authUserBtn').show();			// 사용자 인증버튼 보이기
			}
		});


	},

	// ios 일 경우 id를 저장해 놓는 변수
	oldId_ios : null,

	//############################################################################
	// 토큰이 살아있는지 체크
	isvalid : function(){

		var accessToken = LEMP.Properties.get({
			"_sKey" : "accessToken"
		});

		// 저장소에 토큰이 있는경우 사용여부 체크
		if(!smutil.isEmpty(accessToken)){

			page.apiParam.param.baseUrl = "/auth/isvalid";					// api no
			page.apiParam.param.callback = "page.isvalidCallback";			// callback methode
			page.apiParam.data = {"accessToken" : accessToken};

			// 공통 api호출 함수
			smutil.callApi(page.apiParam);

			page.apiParamInit();				// 파라메터 전역변수 초기화
		}
		else{
			$(".intro").fadeOut(800);
		}

	},


	// 토큰이 살아있는지 체크 callback
	isvalidCallback : function(res){


		// 토큰 결과값에 따라서 페이지 이동(사용가능이면 메인으로 이동, 불가능이면 다시 로그인)
		// 사용가능 토큰이면 자동으로 메인페이지 이동로직
		if((res.code == "00" || res.code == "0000")){

			// 햄버거 메뉴 생성
			LEMP.SideView.create({
				"_sPosition" : "left",  // or right
				"_sPagePath" : "GNB/html/GNB0001.html",
				"_sWidth" : "100",
				"_oMessage" : {
					"param" : ""
				}
			});

			// app 사용시간 설정(25시간, 토큰이 24시간 이기때문에 그보다 더 길게 설정)
			LEMP.App.setTimeout({
				"_nSeconds" : 90000
			});

			// 메인 페이지로 이동
			LEMP.Window.open({
				"_sPagePath" : "MAN/html/MAN0001.html"
			});
		}
		else {		// 유효기간 만료 or 잘못된 토큰

			// 저장되어있던 토큰 삭제
			LEMP.Properties.remove({"_sKey":"accessToken"});

		}
		$(".intro").fadeOut(800);

	},
	// 토큰 벨리데이션 종료
	//############################################################################



	//############################################################################
	// 비밀번호 초기화 시작
	pwResetProc : function(){
		var id = $.trim($('#principal').val());

		if(smutil.isEmpty(id)){

			LEMP.Window.alert({
				"_sTitle":"비밀번호 초기화 오류",
				"_vMessage":"ID를 입력해 주세요."
			});

			$('#principal').focus();

			return false;
		}

		// id는 숫자 8자리로 고정
		var chk = /^[0-9]+$/;
		var chk1 = chk.test(id);

		if(id.length != 8 || !chk1){

			LEMP.Window.alert({
				"_sTitle":"비밀번호 초기화 오류",
				"_vMessage":"ID는 숫자 8자리로 입력해 주세요"
			});

			$('#principal').focus();

			return false;
		}
		// 인증페이지로 이동
		else {

			var popUrl = smutil.getMenuProp('LGN.LGN0002', 'url');

			// 인증 페이지로 이동
			LEMP.Window.open({
				"_sPagePath" : popUrl,
				"_oMessage" : {
					"param" : {
						"status" : "PASSWORD_RESET",				// 비밀번호 초기화
						"principal" : id							// 로그인 id
					}
				}
			});

			return false;
		}

	},

	// 비밀번호 초기화 로직 종료
	//############################################################################




	//############################################################################
	// 로그인 로직 시작
	login : function(){
		var id = $.trim($('#principal').val());
		var pw = $.trim($('#credential').val());
		var pushToken = page.pushToken;
		var usrCpno = page.usrCpno;


		// 인증정보가 있는지 체크하고 없으면 인증처리를 먼저 하도록 유도한다.
		// 인증정보
		var authCertInfo = LEMP.Properties.get({
			"_sKey" : "authCertInfo"
		});


		if(smutil.isEmpty(id)){

			LEMP.Window.alert({
				"_sTitle":"로그인 오류",
				"_vMessage":"ID를 입력해 주세요."
			});

			$('#principal').focus();

			return false;
		}

		// id는 숫자 8자리로 고정
		var chk = /^[0-9]+$/;
		var chk1 = chk.test(id);

		if(id.length != 8 || !chk1){

			LEMP.Window.alert({
				"_sTitle":"로그인 오류",
				"_vMessage":"ID는 숫자 8자리로 입력해 주세요"
			});

			$('#principal').focus();

			return false;
		}
		// 인증정보 없으면 인증먼저 하고 다시 로그인
		else if(smutil.isEmpty(authCertInfo) || smutil.isEmpty(authCertInfo.usrCpno)){

			LEMP.Window.alert({
				"_sTitle":"인증정보 없음",
				"_vMessage":"인증정보가 없습니다.\n인증절차를 먼저 진행해 주세요."
			});

			var popUrl = smutil.getMenuProp('LGN.LGN0002', 'url');

			// 인증 페이지로 이동
			LEMP.Window.open({
				"_sPagePath" : popUrl,
				"_oMessage" : {
					"param" : {
						"status" : "INIT_LOGIN",					// 최초 인증절차
						"principal" : id							// 로그인 id
					}
				}
			});

			return false;
		}
		else if(smutil.isEmpty(pw)){
			LEMP.Window.alert({
				"_sTitle":"로그인 오류",
				"_vMessage":"비밀번호를 입력해 주세요."
			});

			$('#credential').foucs();

			return false;
		}
		else if(smutil.isEmpty(usrCpno)){
			var message = "해당 디바이스의 \n전화번호를 구해올수 없습니다.";

			if(smutil.deviceInfo === "smios"){
				message = "해당 디바이스의 \n인증받은 전화번호를 구해올수 없습니다.";
			}

			LEMP.Window.alert({
				"_sTitle":"로그인 오류",
				"_vMessage": message
			});

			return false;
		}
		else if(smutil.isEmpty(pushToken)){
			LEMP.Window.alert({
				"_sTitle":"로그인 오류",
				"_vMessage":"해당 디바이스의 \n푸시 정보를 구해올수 없습니다.\n관리자에게 문의해주세요."
			});

			return false;
		}
		else {

			smutil.loadingOn();

			// 우리나라 전화번호 형식으로 변경
			if(usrCpno.startsWith( '+82' )){
				usrCpno = "0" + usrCpno.substring(3, usrCpno.length);
			}

			// 로그인 요청한 전화번호(- 없음)
			page.loginUsrCpno = usrCpno;
			usrCpno = usrCpno.LPToFormatPhone();		// 전화번호 형식으로 변경

			// 로그인 시도
			page.apiParam.param.baseUrl = "/auth/login";					// api no
			page.apiParam.param.callback = "page.loginCallback";			// callback methode
			page.apiParam.data = {
				"principal" : id,
				"credential" : pw,
				"usrCpno" : usrCpno,
				"pushToken" : pushToken,
			};


			// 공통 api호출 함수
			smutil.callApi(page.apiParam);

		}

		page.apiParamInit();				// 파라메터 전역변수 초기화

	},


	// 로그인 로직 callback
	loginCallback : function(res){

		smutil.loadingOff();

		var popUrl;

		// 로그인 성공
		if(res && (res.code == "00" || res.code == "0000")
			&& !smutil.isEmpty(res.accessToken)){

			// 결제 대상자인경우 결제팝업
			if(!smutil.isEmpty(res.pay_status_yn) && res.pay_status_yn == "N"){
				LEMP.Window.alert({
					"_sTitle":"결제 대상자",
					"_vMessage":"결제완료 후 사용이 가능합니다.\n결제창으로 이동합니다."
				});

				// 결제팝업
				var popUrl = smutil.getMenuProp('LGN.LGN0005', 'url');
				var accessToken = smutil.nullToValue(res.accessToken, 'accessToken');

				LEMP.Window.open({
					"_sPagePath": popUrl,
					"_oMessage" : {
						"param" : {
							"accessToken" : accessToken			// 토큰정보를 파라메터로 넘긴다
						}
					}
				});

				return false;
			}
			else{		// 결제대상이 아닌 사용자

				var loginId = $.trim($('#principal').val());

				/**
				 * 로그인 id와 프로퍼티에 저장된 데이터의 id를 비교해서 id가 다를경우
				 * 새로운 사용자로 간주하고 저장되어있는 개인정보를 전부다 삭제
				 */
					// 저장해 놓은 로그인id
				var principal = LEMP.Properties.get({
						"_sKey" : "dataId"
					});

				// 난독화화 함께 적용하기로하고 주석처리
//				if(!smutil.isEmpty(principal)){
//					principal = atob(principal);		// 평문으로 디코딩
//				}

				// 저장한 id 와 로그인한 id 가 다르면 로컬 데이터 전부 삭제(인증데이터 제외)
				if($.isNumeric( principal )
					&& principal.length == 8
					&& !smutil.isEmpty(principal)
					&& principal != loginId){

					if(setPropKeys.keys){
						var keysLst = setPropKeys.keys;

						$.each(keysLst, function(idx, Obj){
							$.each(Obj, function (key, val) {
								// 인증정보 제외, 개인정보 동의 제외
								if(!smutil.isEmpty(key)
									&& key != "authCertInfo"		// 인증정보
									&& key != "personalInfo")		// 개인정보 동의 제외
								{
									LEMP.Properties.remove({"_sKey":key});
								}
							});
						});
					}
				}


				// 인증정보
				var authCertInfo = LEMP.Properties.get({
					"_sKey" : "authCertInfo"
				});

				// 인증한 사용자 전화번호
				var cpNo = authCertInfo.usrCpno;

				// 난독화화 함께 적용하기로하고 주석처리
				// base64로 인코딩된걸 디코딩하기
//				if(cpNo){
//					cpNo = atob(cpNo);
//				}


				// 인증을 받은 전화번호와 로그인 성공한 전화번호가 다르면 로컬 데이터 전부 삭제(인증 다시 받고 다시 로그인 해야함)
				if(!smutil.isEmpty(authCertInfo) && page.loginUsrCpno.LPToFormatPhone() != cpNo.LPToFormatPhone()){
					if(setPropKeys.keys){
						var keysLst = setPropKeys.keys;

						$.each(keysLst, function(idx, Obj){
							$.each(Obj, function (key, val) {
								// 개인정보 동의를 제외한 모든 데이터 삭제
								if(!smutil.isEmpty(key) && key != "personalInfo") {
									LEMP.Properties.remove({"_sKey":key});
								}
							});
						});


						LEMP.Window.alert({
							"_sTitle":"전화번호 변경",
							"_vMessage":"인증받은 전화번호와 \n현재 전화번호가 다릅니다.\n인증절차를 먼저 진행해 주세요."
						});

						var popUrl = smutil.getMenuProp('LGN.LGN0002', 'url');

						// 인증 페이지로 이동
						LEMP.Window.open({
							"_sPagePath" : popUrl,
							"_oMessage" : {
								"param" : {
									"status" : "INIT_LOGIN",					// 최초 인증절차
									"principal" : loginId						// 로그인 id
								}
							}
						});

						return false;
					}
				}


				// 난독화화 함께 적용하기로하고 주석처리
//				if(!smutil.isEmpty(loginId)){
//					// base64 인코딩
//					loginId = btoa(loginId);
//				}

				// id 저장 체크인 경우
				if($("input:checkbox[id='saveIdChk']").is(":checked")){

					// id 저장(로그인 페이지 셋팅용)
					LEMP.Properties.set({
						"_sKey" : "saveId",
						"_vValue" : loginId
					});

					// id 저장 체크박스 선택여부 저장
					LEMP.Properties.set({
						"_sKey" : "saveIdChk",
						"_vValue" : "Y"
					});
				}
				else{		// 저장된 id 삭제
					LEMP.Properties.remove({"_sKey":"saveId"});

					// id 저장 체크박스 선택여부 저장
					LEMP.Properties.set({
						"_sKey" : "saveIdChk",
						"_vValue" : "N"
					});
				}


				// 로그인 성공한 사용자의 데이터용 사용자 id 저장
				LEMP.Properties.set({
					"_sKey" : "dataId",
					"_vValue" : loginId
				});


				// 초기 비밀번호(비밀번호 변경페이지로 이동)
				if(res.message == "INIT_PW"){

					// 인증 완료후 토큰 저장 및 메인 페이지로 이동해야함
					// 인증 못하면  메인페이지로 이동 못함
					LEMP.Window.alert({
						"_sTitle":"초기 비밀번호",
						"_vMessage":"첫 로그인을 시도하였습니다.\n비밀번호 변경후 사용 가능합니다."
					});

					// 비밀번호 변경 완료후 토큰 저장 및 메인 페이지로 이동해야함
					// 변경하지 않으면  메인페이지로 이동 못함
					popUrl = smutil.getMenuProp('LGN.LGN0003', 'url');

					// 비밀번호 변경페이지로 이동
					LEMP.Window.open({
						"_sPagePath" : popUrl,
						"_oMessage" : {
							"param" : {
								"status" : "INIT_PW",
								"accessToken" : res.accessToken,
								"principal" : loginId,
								"usrCpno" : page.loginUsrCpno
							}
						}
					});

				}
				// 임시비밀번호(비밀번호 변경페이지로 이동)
				else if(res.message == "TMP_PW"){

					LEMP.Window.alert({
						"_sTitle":"임시 비밀번호",
						"_vMessage":"임시 비밀번호를 사용중입니다.\n비밀번호변경후 사용 가능합니다."
					});

					// 비밀번호 변경 완료후 토큰 저장 및 메인 페이지로 이동해야함
					// 변경하지 않으면  메인페이지로 이동 못함
					popUrl = smutil.getMenuProp('LGN.LGN0003', 'url');

					// 비밀번호 변경페이지로 이동
					LEMP.Window.open({
						"_sPagePath" : popUrl,
						"_oMessage" : {
							"param" : {
								"status" : "TMP_PW",
								"accessToken" : res.accessToken,
								"principal" : loginId,
								"usrCpno" : page.loginUsrCpno
							}
						}
					});

				}
				// 비밀번호 변경 주기 초과(비밀번호 변경페이지로 이동) -- 변경하지 않을경우 로그인 불가
				else if(res.message == "PW_CHG_LIMIT_ERR"){

					LEMP.Window.alert({
						"_sTitle":"비밀번호 변경주기 초과",
						"_vMessage":"비밀번호 변경주기가 초과되었습니다.\n비밀번호 변경후 사용 가능합니다."
					});

					// 비밀번호 변경 완료후 토큰 저장 및 메인 페이지로 이동해야함
					// 변경하지 않으면  메인페이지로 이동 못함
					popUrl = smutil.getMenuProp('LGN.LGN0003', 'url');

					// 비밀번호 변경페이지로 이동
					LEMP.Window.open({
						"_sPagePath" : popUrl,
						"_oMessage" : {
							"param" : {
								"status" : "PW_CHG_LIMIT_ERR",
								"accessToken" : res.accessToken,
								"principal" : loginId,
								"usrCpno" : page.loginUsrCpno
							}
						}
					});

				}
				else{		// 로그인 성공


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
						"_vValue" : res.accessToken
					});

					// 로그인에 성공한 전화번호 properties 에 저장(안드로이드에서 유심 변경 체크에 사용)
					var dataCpno = page.usrCpno;

					// 난독화화 함께 적용하기로하고 주석처리
					/*if(!smutil.isEmpty(dataCpno)){
						// base64 로 인코딩
						dataCpno = btoa(dataCpno);
					}*/

					LEMP.Properties.set({
						"_sKey" : "dataCpno",
						"_vValue" : dataCpno
					});

					// app 사용시간 설정(25시간, 토큰이 24시간 이기때문에 그보다 더 길게 설정)
					LEMP.App.setTimeout({
						"_nSeconds" : 90000		// 초단위
					});


					// 이용약관 동의 여부
					if (res.term_accept_yn == 'Y') {
						page.isTermAgree = true;

						// 개인정보동의 데이터
						var personalInfo = LEMP.Properties.get({
							"_sKey" : "personalInfo"
						});

						// 개인정보동의 데이터에 id 셋팅해서 저장
						if(!smutil.isEmpty(personalInfo)){
							var principal = $.trim($('#principal').val());

							// 난독화화 함께 적용하기로하고 주석처리
							/*if(!smutil.isEmpty(principal)){
								// base64 인코딩
								principal = btoa(principal);
							}*/

							// 개인정보 동의값 id 셋팅해서 properties 에 저장
							personalInfo.principal = principal;

							LEMP.Properties.set({
								"_sKey" : "personalInfo",
								"_vValue" : personalInfo
							});
						}
					}

					// 메시지 대량발송 동의 여부(동의하고 만료일자가 지나지 않은 경우 팝업)
					if (res.lms_agg_yn == 'Y') {
						var lmsEndDt = new Date(res.lms_end_ymd.substr(0, 4), res.lms_end_ymd.substr(4, 2) - 1, res.lms_end_ymd.substr(6, 2)).LPAddDay(1);
						var now = new Date();

						if (now.getTime() < lmsEndDt.getTime()) {
							page.isLmsAgree = true;
						}
					}

					// TODO: 6월 11일 이후 제거(LMS 동의)
					var now = new Date();
					var applyDate = new Date(2020, 5, 11);
					if (now.getTime() < applyDate.getTime()) {
						page.isLmsAgree = false;
					}

					// 모두 동의한 경우 정상 로그인 처리
					if(page.isTermAgree && page.isLmsAgree){
						// 메인페이지 이동
						LEMP.Window.open({
							"_sPagePath" : "MAN/html/MAN0001.html",
							"_oMessage":{"param":{
									"term_accept_yn" : res.term_accept_yn
								}}
						});
					}
					else if(!page.isTermAgree){	// 개인정보 동의가 필요한 사람
						page.term();
					}
					else if(!page.isLmsAgree) {	// 메시지 대량발송 동의가 필요한 사람
						page.lms();
					}
				}
			}

		}
		else {	// 로그인 실패

			var loginId = $.trim($('#principal').val());			//입력된 id
			// 인증페이지로 이동
			// 장기미접속 차단
			if(res.message == "LONG_TIM_PW"){
				// 인증페이지로 이동
				// 인증 완료후 임시 비밀번호를 발급 받아서 다시 로그인 페이지로 이동
				// 인증 못하면  메인페이지로 이동 못함
				LEMP.Window.alert({
					"_sTitle":"장기 미접속 차단",
					"_vMessage":"장기 미접속으로 접근 차단되었습니다.\n사용자 인증후 로그인 가능합니다."
				});

				popUrl = smutil.getMenuProp('LGN.LGN0002', 'url');

				// 인증 페이지로 이동
				LEMP.Window.open({
					"_sPagePath" : popUrl,
					"_oMessage" : {
						"param" : {
							"status" : "LONG_TIM_PW",
							"principal" : loginId
						}
					}
				});
			}
			// 횟수초과
			else if(res.message == "PW_FAIL_CNT_ERR"){
				// 인증페이지로 이동
				// 인증 완료후 임시 비밀번호를 발급 받아서 다시 로그인 페이지로 이동
				// 인증 못하면  메인페이지로 이동 못함
				LEMP.Window.alert({
					"_sTitle":"로그인실패 횟수초과",
					"_vMessage":"로그인실패의 횟수가 초과되었습니다.\n사용자 인증후 로그인 가능합니다."
				});

				popUrl = smutil.getMenuProp('LGN.LGN0002', 'url');

				// 인증 페이지로 이동
				LEMP.Window.open({
					"_sPagePath" : popUrl,
					"_oMessage" : {
						"param" : {
							"status" : "PW_FAIL_CNT_ERR",
							"principal" : loginId
						}
					}
				});
			}
			else if(res.code == "99"){
				LEMP.Window.alert({
					"_sTitle":"로그인 실패",
					"_vMessage": res.message
				});

				return false;
			}
			else{
				LEMP.Window.alert({
					"_sTitle":"로그인 실패",
					"_vMessage": "로그인에 실패 하였습니다.\nID 혹은 비밀번호를 확인해 주세요."
				});

				return false;
			}
		}

	},
	// 로그인 로직 종료
	//############################################################################


	// 팝업이 닫힐때 호출되는 함수
	pwResetVal : function(arg){

		var status = null;

		if(!smutil.isEmpty(arg.param)
			&& !smutil.isEmpty(arg.param.status)){
			status = arg.param.status;
		}

		// 저장해 놓은 id
		var principal = LEMP.Properties.get({
			"_sKey" : "saveId"
		});


		// 저장해 놓은 id체크박스값
		var saveIdChk = LEMP.Properties.get({
			"_sKey" : "saveIdChk"
		});


		// 로그인과 사용자 인증 버튼 컨트롤
		// android or web
		if(!smutil.isEmpty(status) && status !== "smios"){
			$('#loginBtn').show();				// 로그인 버튼 보이기
			$('#authUserBtn').hide();			// 사용자 인증버튼 감춤
		}
		// ios
		else if(!smutil.isEmpty(status) && status === "smios"){
			// 인증받은 사용자 전화번호 ( '-' 없음)
			if(!smutil.isEmpty(arg.param)
				&& !smutil.isEmpty(arg.param.usrCpno)){
				page.usrCpno = arg.param.usrCpno;
			}

			// 인증정보가 있는지 체크하고 없으면 인증처리를 먼저 하도록 유도한다.
			// 인증정보
			var authCertInfo = LEMP.Properties.get({
				"_sKey" : "authCertInfo"
			});

			// 인증정보 없으면 사용자 인증버튼 노출
			if(smutil.isEmpty(authCertInfo) || smutil.isEmpty(authCertInfo.usrCpno)){
				$('#loginBtn').hide();				// 로그인 버튼 숨김
				$('#authUserBtn').show();			// 사용자 인증버튼 보이기
			}
			else {		// 사용자 인증 완료면 로그인 버튼 노출
				$('#authUserBtn').hide();		// 사용자 인증버튼 숨김
				$('#loginBtn').show();			// 로그인 버튼  보이기
			}
		}
		else {		// 인증정보가 없거나 다시 로딩되는경우

			// 로그인과 사용자 인증 버튼 컨트롤
			// android or web
			if(page.deviceInfo !== "smios"){
				$('#loginBtn').show();				// 로그인 버튼 보이기
				$('#authUserBtn').hide();			// 사용자 인증버튼 감춤
			}
			// ios
			else{
				$('#loginBtn').hide();				// 로그인 버튼 숨김
				$('#authUserBtn').show();			// 사용자 인증버튼 보이기
			}
		}


		// 비밀번호 초기화
		$('#credential').val('');
	},


	/**
	 * 결제 완료후 종료될때 실행되는 함수.
	 * -- 로그인후 저장된 토큰을 삭제하는 기능을 해야한다.
	 * -- 결제가 완료되면 무조건 다시 로그인로직을 거쳐야함.
	 * -- 자동으로 로그인 하게 되면 1달짜리 결제는 환불할수 없다.
	 */
	paymentCallback : function(){
		// 저장되어있던 토큰 삭제
		LEMP.Properties.remove({_sKey:"accessToken"});

		// 비밀번호 초기화
		$('#credential').val('');
	},



	// ################### 개인정보 동의 조회 start
	term : function(){

		var principal = $('#principal').val();
		page.apiParamInit();	// 파라메터 전역변수 초기화
		page.apiParam.id = "HTTP";
		page.apiParam.param.baseUrl = "term";								// api no
		page.apiParam.param.callback = "page.termCallback";				// callback methode
		page.apiParam.data = {
			"parameters" : {
				"principal" : smutil.nullToValue(principal, "")		// 로그인에 성공한 id
			}
		};							// api 통신용 파라메터

		// 공통 api호출 함수
		smutil.callApi(page.apiParam);

		page.apiParamInit();		// 파라메터 전역변수 초기화
	},


	termCallback : function(result){
		page.apiParamInit();		// 파라메터 전역변수 초기화

		// api 결과 성공여부 검사
		if(smutil.apiResValidChk(result) && result.code == "0000"){

			var term_id = result.term_id;

			var personalInfo = LEMP.Properties.get({
				"_sKey" : "personalInfo",
			});

			if(personalInfo && personalInfo.term_id && term_id){
				/**
				 *  properties 에 자장해놓은 개인정보동의 아이디와
				 *  신규로 조회한 개인정보동의 아이디가 다르면 개인정보동의를 다시 해야하는경우다.
				 *  개인정보 동의창 오픈
				 */

				// 동의한 권한정보 페이지와 지금 내려온 권한정보 페이지 id 가 다른경우는 팝업오픈
				if(personalInfo.term_id != term_id){
					var popUrl = smutil.getMenuProp("LGN.LGN0006","url");

					LEMP.Window.open({
						"_sPagePath":popUrl,
						"_oMessage":{"param":{
								"principal" : $('#principal').val()		// 로그인 id
							}}
					});
				}
				else {		// 같은경우는 최초 개인정보 동의한 경우기때문에 동의 결과를 서버에 전송한 후 로그인처리 한다.
					page.accept();			// 개인정보 동의 결과 전송
				}
			}

		}

	},
	// ################### 개인정보 동의 조회 end



	// ################### 개인정보 동의여부 전송 start
	accept : function(){

		var personalInfo = LEMP.Properties.get({
			"_sKey" : "personalInfo",
		});

		page.apiParamInit();	// 파라메터 전역변수 초기화
		page.apiParam.id = "HTTP";
		page.apiParam.param.baseUrl = "term/accept";						// api no
		page.apiParam.param.callback = "page.acceptCallback";				// callback methode
		page.apiParam.data = {
			"term_id" : personalInfo.term_id,									// 개인정보 동의 id
			"principal" : $('#principal').val(),								// 로그인에 성공한 id
			"accept_yn" : personalInfo.accept_yn								// 동의함
		};							// api 통신용 파라메터

		// 프로그래스바 열기
		//smutil.loadingOn();

		// 공통 api호출 함수
		smutil.callApi(page.apiParam);

		// 파라메터 전역변수 초기화
		page.apiParamInit();
	},


	acceptCallback : function(result){

		page.apiParamInit();		// 파라메터 전역변수 초기화

		// api 결과 성공여부 검사
		if(smutil.apiResValidChk(result) && result.code == "0000"){

			var principal = $('#principal').val();		// 로그인 id

			// 난독화화 함께 적용하기로하고 주석처리
			/*if(!smutil.isEmpty(principal)){
				// base64 인코딩
				principal = btoa(principal);
			}*/

			var personalInfo = LEMP.Properties.get({
				"_sKey" : "personalInfo",
			});

			if(!smutil.isEmpty(personalInfo)){
				// 개인정보 동의값 id 셋팅해서 properties 에 저장
				personalInfo.principal = principal;
			}
			else{
				personalInfo = {};

				// 개인정보 동의값 id 셋팅해서 properties 에 저장
				personalInfo.principal = principal;
			}

			LEMP.Properties.set({
				"_sKey" : "personalInfo",
				"_vValue" : personalInfo
			});

			if (page.isLmsAgree) {
				// 메인페이지 이동
				LEMP.Window.open({
					"_sPagePath" : "MAN/html/MAN0001.html"
				});
			} else {
				// 메시지 대량발송 동의 로직
				page.lms();
			}
		}


	},
	// ################### 개인정보 동의여부 전송 end

	// 개인정보 동의결과를 전송하고 로그인도 완료된 후에 메인페이지로 이동되는 함수
	termPopupCallback : function(){
		if (page.isLmsAgree) {
			// 메인페이지 이동
			LEMP.Window.open({
				"_sPagePath" : "MAN/html/MAN0001.html"
			});
		} else {
			// 메시지 대량발송 동의 로직
			page.lms();
		}

	},

	lms : function() {
		// 토큰 조회
		var accessToken = LEMP.Properties.get({
			"_sKey" : "accessToken"
		});

		// 저장되어있던 토큰 삭제(앱 종료 시 로그아웃 처리)
		if (!smutil.isEmpty(accessToken)) {
			LEMP.Properties.remove({_sKey:"accessToken"});
		}

		var popUrl = smutil.getMenuProp("LGN.LGN0007","url");
		LEMP.Window.open({
			"_sPagePath": popUrl,
			"_oMessage": {
				"param": {
					"accessToken": accessToken
				}
			}
		});
	}
};
