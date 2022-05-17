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
		},
	// api 통신용 파라메터
	},
	init : function() {
		page.initInterface();
	},
	initInterface : function() {
		//닫기 버튼
		$('.btn.closeW.paR').click(function(){
			LEMP.Window.close();
		});
		//운송장 번호 입력 click
		$('#inv_noText').click(function(){
			var popUrl = smutil.getMenuProp('COM.COM0102', 'url');
			LEMP.Window.open({
				"_sPagePath" : popUrl
			});
		});
		//확인버튼 click
		$('#confirm_so').click(function(){
			LEMP.Window.close();
		});
		//카메라 스캔
		$('#cscan').click(function(){
			LEMP.Window.openCodeReader({
				"_fCallback":function(res){
					if(res.result){
						if (String(res.data).length == 12
								&& Number(String(res.data).substr(0,11))%7 == Number(String(res.data).substr(11,1))) {
							$('#inv_noText').val(page.changeForm(String(res.data)));
							page.scanListH(String(res.data));
						}else {
							LEMP.Window.toast({
								"_sMessage":"정상적인 바코드번호가 아닙니다.",
								'_sDuration' : 'short'
							});	
//							LEMP.Window.alert({
//								"_sTitle" : "경고",
//								"_vMessage" : "정상적인 바코드번호가 아닙니다."
//							});
							smutil.callTTS("0", "0", null, page.isBackground);
							return false;
						}
					}else {
						LEMP.Window.toast({
							"_sMessage":"바코드를 읽지 못했습니다.",
							'_sDuration' : 'short'
						});							
//						LEMP.Window.alert({
//							"_sTitle" : "경고",
//							"_vMessage" : "바코드를 읽지 못했습니다."
//						});
						smutil.callTTS("0", "0", null, page.isBackground);
						return false;
					}
				}
			});
		});
	},
	//input콜백
	InputCallback : function(data){
	
		smutil.loadingOn();
		$('#inv_noText').val(page.changeForm(data.inv_no));
		page.scanListH(data.inv_no);

	},
	scanListH : function(data){
		smutil.loadingOn();
		
	
		//스캔리스트 api 호출
		page.apiParam.param.baseUrl="/smapis/net/stfngInvDtl";
		page.apiParam.param.callback="page.ScanListCallback";
		page.apiParam.data.parameters={
			"inv_no" : data
		};
		
		// 공통 api호출 함수 
		smutil.callApi(page.apiParam);
	},
	scanCallback : function(data){
		if(data.barcode.length==12 && Number(data.barcode.substr(0,11))%7 == Number(data.barcode.substr(11,1))){
			$('#inv_noText').val(page.changeForm(data.barcode));
			page.scanListH(data.barcode);
		}else{
			LEMP.Window.toast({
				"_sMessage":"정상적인 바코드번호가 아닙니다.",
				'_sDuration' : 'short'
			});						
//			LEMP.Window.alert({
//				"_sTitle" : "경고",
//				"_vMessage" : "정상적인 바코드번호가 아닙니다."
//			});
		}
		
	},
	
	ScanListCallback : function(data){			
		$('.emptyData').text("");
		
		try {
			if (smutil.apiResValidChk(data) && 
					data.code ==="0000" && data.data_count!=0) {
				$("#jujs").val(data.data.list[0].scan_brsh_cd);
				$("#ubjb").val(data.data.list[0].smsz_mbag_no);
				smutil.callTTS("1", "0", null, page.isBackground);
			}else{
				$('.emptyData').text("송장에 데이터가 없습니다.");
				$("#jujs").val("");
				$("#ubjb").val("");
				smutil.callTTS("0", "0", null, page.isBackground);
			}
		} catch (e) {}
		finally{
			smutil.loadingOff();
		}
		
	},
	changeForm:function(code){
		var first = code.substring(0, 4);
		var second = code.substring(4, 8);
		var third = code.substring(8, code.length);
		return first + "-" + second + "-" + third;
	}
}