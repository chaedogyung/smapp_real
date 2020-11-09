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

	//시간
	req_amount : 1,
	own_amount : 0,

	init : function(){
		page.initInterface();
		// page.smInfoList();
	},
	
	initInterface : function(){
		$('#requestBtn').attr('disabled', false);		// 신청버튼 활성화
		$('#requestBtn').addClass('red');
		$('#req_date').text(smutil.getToday()); 		// 신청일자 세팅
		var loginId = LEMP.Properties.get({
			"_sKey" : "dataId"
		});
		$('#empno').text(loginId); 						// 사번 세팅


		//시간 감소
		$(document).on('click','#minus_amount', function(e){
			if(page.req_amount==2){
				page.req_amount--;
				$('#req_amount').text((page.req_amount+"").LPToCommaNumber()+"시간");
			}
			else{
				LEMP.Window.toast({
					"_sMessage" : "1시간부터 입력 가능합니다",
					"_sDuration" : "short"
				});
			}
		});

		//시간 증가
		$(document).on('click','#plus_amount', function(e){
			if(page.req_amount == 1){
				page.req_amount++;
				$('#req_amount').text((page.req_amount+"").LPToCommaNumber()+"시간");
			}
			else{
				LEMP.Window.toast({
					"_sMessage" : "최대 2시간까지 신청 가능합니다",
					"_sDuration" : "short"
				});
			}
		});

		//긴급사용 신청버튼 클릭
		$(document).on('click','#requestBtn', function(e){
			// 긴급사용 신청 컴펌창 호출
			$('#pop2Txt2').html((page.req_amount+"").LPToCommaNumber()+"시간"+'<br /> 긴급사용을 신청합니다.');
			$('.mpopBox.pop').bPopup();
		});

		// 긴급사용 'yes' 버튼 클릭
		$('#reqMileYesBtn').click(function(e){
			page.reqUse();
		});

	},

	//긴급사용 신청
	reqUse : function(){
		LEMP.Window.alert({
			"_sTitle":"SM APP 긴급사용",
			"_vMessage":'긴급사용 신청이 완료되었습니다'
		});
		//창닫기
		LEMP.Window.close();
		// smutil.loadingOn();
		// page.apiParam.param.baseUrl = "/smapis/point/chg";
		// page.apiParam.param.callback = "page.reqUseCallback";
		// page.apiParam.data = {
		// 	"parameters" : {
		// 		"point" : page.req_amount
		// 	}
		// }
		// smutil.callApi(page.apiParam);
	},

	reqUseCallback :function(res){
		try{
			if(smutil.apiResValidChk(res) && res.code === "0000"){
				LEMP.Window.alert({
					"_sTitle":"SM APP 긴급사용",
					"_vMessage":'긴급사용 신청이 완료되었습니다'
				});
			}
		}catch(e){}
		finally{
			smutil.loadingOff();
			LEMP.Window.close();
		}
	}
}