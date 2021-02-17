LEMP.addEvent("backbutton", "page.callbackBackButton");
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
		page.getUseStatus();
	},

	initInterface : function(){
		$('#req_date').text(smutil.getToday()); 		// 신청일자 세팅
		var loginId = LEMP.Properties.get({
			"_sKey" : "dataId"
		});
		$('#empno').text(loginId); 						// 사번 세팅

		//긴급사용 신청버튼 클릭
		$(document).on('click','#requestBtn', function(e){
			// 긴급사용 신청 컴펌창 호출
			$('#pop2Txt2').html("2시간"+'<br /> 긴급사용을 신청합니다.');
			$('.mpopBox.pop').bPopup();
			$('.popFooter').show();
		});

		// 긴급사용 'yes' 버튼 클릭
		$('#reqUseYesBtn').click(function(e){
			page.reqUse();
		});

		// 닫기버튼 이벤트 등록
		$(".btn.closeW.paR").click(function() {
			page.callbackBackButton();
		});
	},

	//긴급사용 신청여부확인
	getUseStatus : function (){
		smutil.loadingOn();
		var loginId = LEMP.Properties.get({
			"_sKey" : "dataId"
		});
		page.apiParam.param.baseUrl = "/smapis/use/getApvInfo";
		page.apiParam.param.callback = "page.getUseStatusCallback";
		page.apiParam.data.parameters.empno = loginId;						// PARAM: 사원번호
		smutil.callApi(page.apiParam);
	},

	//긴급사용 신청여부화인 콜백
	getUseStatusCallback : function (res){
		try{
			if(smutil.apiResValidChk(res) && res.code === "0000"){
				//신청횟수가 3일경우 비활성화
				if(res.apv_cnt==="3"){
					LEMP.Window.alert({
						"_sTitle":"SM APP 긴급사용",
						"_vMessage":'긴급사용 신청횟수(3회)를 모두 사용하였습니다.'
					});
					return;
				}

				if(res.apv_yn ==="W"){
					$('#pop2Txt2').html("긴급 사용 신청중입니다.<br> 승인이 완료될때 까지 기다려주세요");
					$('.mpopBox.pop').bPopup({modalClose:false});
					$('.popFooter').hide();
					//신청 중일경우 30초뒤 다시 확인 요청
					setTimeout(function (){
						page.getUseStatus();
					}, 10000);

				}else if(res.apv_yn ==="Y"){
					LEMP.Window.alert({
						"_sTitle":"SM APP 긴급사용",
						"_vMessage":'긴급사용 신청이 승인되었습니다.'
					});
					LEMP.Window.close();
				}
				else if(res.apv_yn ==="X"){
					$('.mpopBox.pop').bPopup().close();
					LEMP.Window.alert({
						"_sTitle":"SM APP 긴급사용",
						"_vMessage":'긴급사용 신청이 반려되었습니다.\n 다시 신청하시겠습니까?'
					});
					$('#requestBtn').addClass('red');
					$('#requestBtn').attr('disabled', false);		// 신청버튼 활성화
				}
				else{
					$('#requestBtn').addClass('red');
					$('#requestBtn').attr('disabled', false);		// 신청버튼 활성화
				}
			}
		}catch(e){}
		finally{
			smutil.loadingOff();
		}
	},

	//긴급사용 신청
	reqUse : function(){
		smutil.loadingOn();
		var loginId = LEMP.Properties.get({
			"_sKey" : "dataId"
		});

		page.apiParam.param.baseUrl = "/smapis/use/approval";
		page.apiParam.param.callback = "page.reqUseCallback";
		// page.apiParam.data.parameters.reqDate = smutil.getToday();			// PARAM: 신청일자
		page.apiParam.data.parameters.empno = loginId;						// PARAM: 사원번호
		page.apiParam.data.parameters.appTm = "2";			// PARAM: 신청시간
		smutil.callApi(page.apiParam);
	},

	reqUseCallback :function(res){
		try{
			if(smutil.apiResValidChk(res) && res.code === "0000"){
				$('#pop2Txt2').html("긴급 사용 신청중입니다.<br> 승인이 완료될때 까지 기다려주세요");
				$('.mpopBox.pop').bPopup({modalClose:false});
				$('.popFooter').hide();
				LEMP.Window.alert({
					"_sTitle":"SM APP 긴급사용",
					"_vMessage":'긴급사용 신청이 완료되었습니다.'
				});
				//긴급사용 신청 성공후 긴급사용상태 확인
				setTimeout(function (){
					page.getUseStatus();
				}, 10000);
			}else {

			}
		}catch(e){}
		finally{
			smutil.loadingOff();
		}
	},

	callbackBackButton : function(){
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
				LEMP.App.exit({
					_sType : "kill"
				});
			}
		});

		LEMP.Window.confirm({
			_vMessage : "앱을 종료하시겠습니까?",
			_aTextButton : [ btnCancel, btnConfirm ]
		});
	}
}
