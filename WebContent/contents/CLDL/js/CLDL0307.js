var page = {
		
	init:function(arg)
	{
		page.cldl0307.org_inv_no=String(arg.data.param.inv_no);
		page.initInterface();
		
		// 숫자 키패드 팝업 열기
		$("#scan").click(function(){
			var popUrl = smutil.getMenuProp('COM.COM0102', 'url');
			LEMP.Window.open({
				"_sPagePath":popUrl,
			});
		});
	}
	,cldl0307:{}
	, isBackground : false
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
		, isBackground : page.isBackground
	}
	,initInterface : function()
	{
		//input박스 우측의 코드리더이미지 클릭
		$(document).on("click",".btn.scan",function(){
			page.codeReader();
		});
		
		
		//스캔취소그림 클릭
		$(document).on("click",".btn.del2",function(){
			page.ScanCancel($(this));
		});
		
		
		//상단의 X버튼 클릭
		$(document).on("click",".btn.closeW.paR",function(){
			var textButton1=LEMP.Window.createElement({
				"_sElementName":"TextButton"
			});
			var textButton2=LEMP.Window.createElement({
				"_sElementName":"TextButton"
			});
			textButton1.setProperty({
				"_sText":"확인",
				"_fCallback":function(){
					LEMP.Window.close({
						"_sCallback" : "page.listReLoad"
					});
				}
			});
			textButton2.setProperty({
				"_sText":"취소",
				"_fCallback":function(){}
			});
			LEMP.Window.confirm({
				"_sTitle":"스캔팝업닫기",
				"_vMessage":"스캔을 종료하시겠습니까?",
				"_aTextButton":[textButton1,textButton2 ]
			});
		});
		
		
		//input change 이벤트
		$(document).on("change","#scan",function(){
			page.InputChange($(this));
		});
		
		var inv_no = ""; 
		for (var i = 0; i < 3; i++) {
			if (i ===2) {
				inv_no += page.cldl0307.org_inv_no.substr(i*4,4);
			}else {
				inv_no += page.cldl0307.org_inv_no.substr(i*4,4) + "-";
			}
		}
		$("#org_inv_no").text(inv_no);
	}
	// input에 데이터 변경시 처리 프로세스
	,InputChange : function(obj){
		var invNo = obj.val();
		var plag = false;
		// 입력받은 송장번호가 목록에 있는지 확인
		$(".li.list").each(function(i,r){
			if ($(r).find("span").text().replace(/\-/g,'') == invNo) {
				plag = true;
				return false;
			}
		});
		if(obj.val().length==12){
			if (!plag) {
				var Current_date = new Date();
				Current_date = Current_date.LPToFormatDate("yyyymmddHHnnss");
				page.cldl0307.asst_inv_no=obj.val();
				page.cldl0307.scan_dtm=Current_date;
				// 송장번호 유효성 검증
				
				if (Number(obj.val().substr(0,11))%7 == Number(obj.val().substr(11,1))) {
					if(obj.val().LPStartsWith("5")){
						page.asstInvScanRgst();
					}
					else{
						LEMP.Window.toast({
							"_sMessage":"보조 송장번호가 아닙니다.",
							'_sDuration' : 'short'
						});
//						LEMP.Window.alert({
//							"_sTitle":"스캔오류",
//							"_vMessage":"보조 송장번호가 아닙니다."
//						});
					}
				}else {
					LEMP.Window.toast({
						"_sMessage":"정상적인 바코드번호가 아닙니다.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle" : "경고",
//						"_vMessage" : "정상적인 바코드번호가 아닙니다."
//					});
				}
			}else {
				LEMP.Window.toast({
					"_sMessage":"중복된 송장번호 입니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle" : "경고",
//					"_vMessage" : "중복된 송장번호 입니다."
//				});
			}
		}
		$("#scan").val("");
	}
	,ScanCancel:function(obj){
		var Current_date = new Date();
		Current_date = Current_date.LPToFormatDate("yyyymmddHHnnss");
		page.cldl0307.asst_inv_no=obj.prev().text().replace(/\-/g,'');
		page.cldl0307.scan_dtm=Current_date;
		page.asstInvScanCcl();
	}
	,asstInvScanRgst:function(){
		smutil.loadingOn();
		
		page.apiParam.param.baseUrl="smapis/cldl/asstInvScanRgst";
		page.apiParam.param.callback="page.asstInvScanRgstCallback";
		page.apiParam.data.parameters=page.cldl0307;
		
		// 공통 api호출 함수 
		smutil.callApi(page.apiParam);

	}
	,asstInvScanCcl:function(){
		smutil.loadingOn();
		
		page.apiParam.param.baseUrl="smapis/cldl/asstInvScanCcl";
		page.apiParam.param.callback="page.asstInvScanCclCallback";
		page.apiParam.data.parameters=page.cldl0307;
		
		// 공통 api호출 함수 
		smutil.callApi(page.apiParam);
	}
	,scanCallback:function(res){
		page.isBackground = res.isBackground;		// 앱이 background 상태인지 아닌지 설정
		$("#scan").val(res.barcode);
		$("#scan").trigger("change");
	}
	,asstInvScanRgstCallback: function(res){
		try {
			if (smutil.apiResValidChk(res) && res.code === "0000") {
				var code = res.asst_inv_no.replace(/([0-9]{4})([0-9]{4})([0-9]{4})/,"$1-$2-$3");
				//handlebars template 불러오기
				var source = $("#CLDL0307_list_template").html();
				//handlebars template pre 컴파일 
				var template = Handlebars.compile(source);
				//handlebars template에 binding할 data
				var data={"list":[{"invNo":code, "invNoId" : res.asst_inv_no}]}
				//생성된 태그에 binding한 템플릿 data를 출력
				$("#CLDL0307LstUl").append(template(data));
				
				// 실패 tts 호출(벨소리) 
				smutil.callTTS("1", "0", null, page.isBackground);
			}else {
				
				// 그려져 있는 li 삭제
				if(res.code == "1000"){
					$('#'+res.inv_no).remove();
				}
				
				LEMP.Window.toast({
					//"_sMessage" : "스캔 통신 에러",
					"_sMessage" : res.message,
					"_sDuration" : "short"
				});
				
				// 실패 tts 호출(벨소리) 
				smutil.callTTS("0", "0", null, page.isBackground);
			}
		} catch (e) {}
		finally{
			smutil.loadingOff();
		}
	}
	// api에서 리턴해준 송장번호를 찾아서 해당 li DOM을 삭제
	,asstInvScanCclCallback:function(res){
		try {
			if (smutil.apiResValidChk(res) && 
					(res.code ==="0000" || res.code==="1000")) {
				$('#'+res.inv_no).remove();
			}
		} catch (e) {}
		finally{
			smutil.loadingOff();
		}
	}
	,InputCallback:function(res){
		$("#scan").val(res.inv_no);
		//$("#scan").trigger("change");
		page.InputChange($("#scan"),page.cldl0307);
	}
	,codeReader:function(){
		LEMP.Window.openCodeReader({
			"_fCallback":function(res){
				if(res.result){
					if (String(res.data).length == 12) {
						$('#scan').val(res.data);
						$('#scan').trigger("change");
					}else {
						LEMP.Window.toast({
							"_sMessage":"정상적인 바코드번호가 아닙니다.",
							'_sDuration' : 'short'
						});
//						LEMP.Window.alert({
//							"_sTitle" : "경고",
//							"_vMessage" : "정상적인 바코드번호가 아닙니다."
//						});
					}
				}else {
					LEMP.Window.toast({
						"_sMessage":"바코드를 읽지 못했습니다.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle" : "경고",
//						"_vMessage" : "바코드를 읽지 못했습니다."
//					});
				}
			}
		});
	}
};

