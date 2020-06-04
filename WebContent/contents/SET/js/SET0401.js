var page = {

	// api 호출 기본 형식
	apiParam : {
		id:"HTTP",					// 디바이스 콜 id
		param:{						// 디바이스가 알아야할 데이터
			task_id : "",			// 화면 ID 코드가 들어가기로함
			//position : {},		// 사용여부 미확정
			type : "",
			baseUrl : "",
			method : "POST",		// api 호출 형식(지정 안하면 'POST' 로 자동 셋팅)
			callback : "",			// api 호출후 callback function
			contentType : "application/json; charset=utf-8"
		},
		data:{"parameters" : {}}	// api 통신용 파라메터
	},


	// api 파람메터 초기화
	apiParamInit : function(){
		page.apiParam =  {
			id:"HTTP",					// 디바이스 콜 id
			param:{						// 디바이스가 알아야할 데이터
				task_id : "",			// 화면 ID 코드가 들어가기로함
				//position : {},		// 사용여부 미확정
				type : "",
				baseUrl : "",
				method : "POST",		// api 호출 형식(지정 안하면 'POST' 로 자동 셋팅)
				callback : "",			// api 호출후 callback function
				contentType : "application/json; charset=utf-8"
			},
			data:{"parameters" : {}}	// api 통신용 파라메터
		};
	},

	deviceInfo: {},						// 기기 정보

	init:function()
	{
		page.initEvent();					// 이벤트 등록
		page.getDeviceInfo();				// 기기 정보 조회
		page.getMsgCnf();					// 약관 상태 조회
	},

	initEvent : function(){

		// 동의/미동의 변경 시
		$('input[name=agree]').change(function() {
			var agreeYn = $(this).val();
			if (agreeYn === 'Y') {
				$('#agree_info').show();
				$('#disagree_reason').hide();
			} else {
				$('#agree_info').hide();
				$('#disagree_reason').show();
			}
		});

		// 신청일
		$('#req_dt').click(function() {
			var popUrl = smutil.getMenuProp("COM.COM0301","url");

			LEMP.Window.open({
				"_sPagePath":popUrl,
				"_oMessage":{
					"param": {
						maxDate: 0,
						type: 'R'
					}
				}
			});
		});

		// 만료일
		$('#end_dt').click(function() {
			var popUrl = smutil.getMenuProp("COM.COM0301","url");

			LEMP.Window.open({
				"_sPagePath":popUrl,
				"_oMessage":{
					"param": {
						minDate: 1,
						type: 'E'
					}
				}
			});
		});

		// 저장
		$("#btnSave").on('click',function(){
			// 파라메터 전역변수 초기화
			page.apiParamInit();

			var agreeYn = $('input[name=agree]:checked').val();

			if (agreeYn === 'Y') {
				// 신청일 확인
				var reqDt = $('#req_dt').val();
				if (smutil.isEmpty(reqDt)) {
					LEMP.Window.toast({
						"_sMessage" : "문자제한 해제 신청일을 입력해 주세요.",
						"_sDuration" : "short"
					});

					return false;
				}

				// 만료일 확인
				var endDt = $('#end_dt').val();
				if (smutil.isEmpty(endDt)) {
					LEMP.Window.toast({
						"_sMessage" : "문자제한 해제 만료일을 입력해 주세요.",
						"_sDuration" : "short"
					});

					return false;
				}

				// 알뜰폰 확인
				var carrier = $('input[name=carrier]:checked').val();
				if (carrier === 'MVNO') {
					LEMP.Window.toast({
						"_sMessage" : "알뜰폰은 문자발송 서비스를 지원하지 않습니다. 미동의로 선택해주세요.",
						"_sDuration" : "short"
					});

					return false;
				}

				page.apiParam.data.parameters = {
					lms_agg_yn: 'Y',
					lms_req_ymd: reqDt.replace(/\./g,''),
					lms_end_ymd: endDt.replace(/\./g,''),
					carrier_sct: carrier
				}
			} else {
				// 미동의 사유 확인
				var reason = $('#reason').val();
				if (smutil.isEmpty(reason)) {
					LEMP.Window.toast({
						"_sMessage" : "미동의 사유를 선택해 주세요.",
						"_sDuration" : "short"
					});

					return false;
				}

				page.apiParam.data.parameters = {
					lms_agg_yn: 'N',
					dis_agg_sct_cd: reason
				}
			}

			page.setMsgCnf();
		});
	},

	// 동의 상태 조회
	getMsgCnf: function() {
		page.apiParam.param.baseUrl = "/smapis/cmn/getMsgCnf";		// api no
		page.apiParam.param.callback = "page.getMsgCnfCallback";	// callback methode

		// 프로그래스바 열기
		smutil.loadingOn();

		// 공통 api호출 함수
		smutil.callApi(page.apiParam);

		// 파라메터 전역변수 초기화
		page.apiParamInit();
	},

	// 동의 상태 조회 콜백
	getMsgCnfCallback: function(res) {
		// 프로그래스바 닫기
		smutil.loadingOff();

		if(res.code === "00" || res.code === "0000") {
			var data = res.data.list[0];

			// 사용자 상태(미입력/미동의/동의)에 따라 View 설정
			if (data.lms_agg_yn === 'N') {		// 미동의 사용자
				// 미동의 체크
				$('#disagree').attr('checked', true).trigger('change');

				// 미동의 사유 설정
				$('#reason').val(data.dis_agg_sct_cd);

				// 통신사 설정
				$('input[name=carrier][value=' + page.deviceInfo.network + ']').attr('checked', true);
			} else {							// 동의 사용자
				// 동의 체크
				$('#agree').attr('checked', true).trigger('change');

				// 신청일/만료일 설정
				$('#req_dt').val(data.lms_req_ymd.substr(0, 4) + '.' + data.lms_req_ymd.substr(4, 2) + '.' + data.lms_req_ymd.substr(6, 2));
				$('#end_dt').val(data.lms_end_ymd.substr(0, 4) + '.' + data.lms_end_ymd.substr(4, 2) + '.' + data.lms_end_ymd.substr(6, 2));

				// 통신사 설정
				$('input[name=carrier][value=' + data.carrier_sct + ']').attr('checked', true);
			}
		}
	},

	// 동의
	setMsgCnf: function() {
		page.apiParam.param.baseUrl = "/smapis/cmn/setMsgCnf";		// api no
		page.apiParam.param.callback = "page.setMsgCnfCallback";	// callback methode

		// 프로그래스바 열기
		smutil.loadingOn();

		// 공통 api호출 함수
		smutil.callApi(page.apiParam);

		// 파라메터 전역변수 초기화
		page.apiParamInit();
	},

	// 동의 콜백
	setMsgCnfCallback: function(res) {
		// 프로그래스바 닫기
		smutil.loadingOff();

		if(res.code === "00" || res.code === "0000") {
			// 페이지 종료후 동의 상태 조회 함수 호출
			LEMP.Window.close({
				"_sCallback" : "page.getMsgCnf"
			});
		} else {
			LEMP.Window.alert({
				"_sTitle":"메시지 대량발송 동의 오류",
				"_vMessage": res.message
			});
		}
	},

	// 기기 정보 조회
	getDeviceInfo: function() {
		smutil.nativeMothodCall({
			id : "DEVICE_INFO",	// 디바이스 콜 id
			param : {
				callback : 'page.getDeviceInfoCallback'
			}
		});
	},

	// 기기 정보 조회 콜백
	getDeviceInfoCallback: function(res) {
		page.deviceInfo = res;
	},

	// 달력 팝업 콜백
	COM0301Callback: function(res) {
		if (res.param.type === 'R') {
			$('#req_dt').val(res.param.date);
		} else {
			$('#end_dt').val(res.param.date);
		}
	}
};
