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

	//마일리지
	req_amount : 100000,
	own_amount : 0,

	init : function(){
		page.initInterface();
		page.smInfoList();
	},
	
	initInterface : function(){
		//마일리지 감소
		$(document).on('click','#minus_amount', function(e){
			if(page.req_amount>100000){
				page.req_amount = page.req_amount-100000;
				$('#req_amount').text((page.req_amount+"").LPToCommaNumber());
			}
			else{
				LEMP.Window.toast({
					"_sMessage" : "100,000부터 입력 가능합니다",
					"_sDuration" : "short"
				});
			}
		});

		//마일리지 증가
		$(document).on('click','#plus_amount', function(e){
			if(page.req_amount <= (page.own_amount-100000)){
				page.req_amount = page.req_amount+100000;
				$('#req_amount').text((page.req_amount+"").LPToCommaNumber());
			}
			else{
				LEMP.Window.toast({
					"_sMessage" : "보유마일리지를 초과하였습니다",
					"_sDuration" : "short"
				});
			}
		});

		//마일리지 신청버튼 클릭
		$(document).on('click','#requestBtn', function(e){
			if(page.req_amount < 100000){
				LEMP.Window.alert({
					"_vMessage" : "100,000 이상부터 신청 가능합니다.",
				});
				return false;
			}
			// 마일리지 신청 컴펌창 호출
			$('#pop2Txt2').html((page.req_amount+"").LPToCommaNumber()+'<br /> 마일리지 전환을 신청합니다.');
			$('.mpopBox.pop').bPopup();
		});

		// 마일리지신청 'yes' 버튼 클릭
		$('#reqMileYesBtn').click(function(e){
			page.reqMile();
		});

	},

	//마일리지 관련 기본정보 호출
	smInfoList : function(){
		smutil.loadingOn();
		page.apiParam.param.baseUrl = "/smapis/point";
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
				$('#emp_no').text(res.empno);
				//오늘날짜세팅
				var today = new Date();
				var year = today.getFullYear();
				var month = 1+today.getMonth();
				month = month >= 10 ? month : '0'+month
				var day = today.getDate();
				day = day >= 10 ? day : '0'+day;

				$('#req_date').text(smutil.getToday());
				$('#req_amount').text((page.req_amount+"").LPToCommaNumber());
				//보유마일리지 세팅
				page.own_amount = res.point;
				// page.own_amount = 100000;

				$('#own_amount').text((page.own_amount+"").LPToCommaNumber());

				if(page.own_amount>=100000){
					$('#requestBtn').attr('disabled', false);		// 신청버튼 활성화
					$('#requestBtn').addClass('red');
				}
			}
		}catch(e){}
		finally{


			smutil.loadingOff();
		}
	},

	//마일리지 신청
	reqMile : function(){
		smutil.loadingOn();
		page.apiParam.param.baseUrl = "/smapis/point/chg";
		page.apiParam.param.callback = "page.reqMileCallback";
		page.apiParam.data = {
			"parameters" : {
				"point" : page.req_amount
			}
		}
		smutil.callApi(page.apiParam);
	},

	reqMileCallback :function(res){
		try{
			if(smutil.apiResValidChk(res) && res.code === "0000"){
				LEMP.Window.alert({
					"_sTitle":"마일리지 전환신청",
					"_vMessage":'마일리지 전환신청이 완료되었습니다.'
				});
			}
		}catch(e){}
		finally{
			smutil.loadingOff();
			page.smInfoList(); //페이지 리로드
		}
	}
}