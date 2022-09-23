var page = {
		
	init:function(arg)
	{
		page.cldl0306=arg.data.param;
			
		page.initInterface();
		page.PublishCode();
	},
	PublishCode:function(){
		/* 라디오버튼 옵션 */
		$(".raTab input:radio").on("click",function(){
			if($(".raTab .raShow").prop("checked")){
				$(".raView").show();
			}else{
				$(".raView").hide();
			}
		});
	}
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
	}
	// api 파람메터 초기화 
	,apiParamInit : function(){
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
	}
	,cldl0306:{}
	,initInterface : function()
	{
		//마이크 버튼
		$("#micBtn").click(function(){
			page.callStt();
		});

		// ios 음성인식 완료버튼을 클릭한경우 
		$(".btn.gray3.m.w100p.b-close").click(function(){
			page.callSttIos();
		});
		
		// 닫기 버튼
		$(".btn.closeW.paR").click(function(){
			LEMP.Window.close();
		});
		
		
		// 확인버튼 클릭
		$(".btn.red.w100p.m").click(function(){
			var key = $("#cldl0306Ul > li").size();
			var liCheck= true;
			
			switch (key) {
				case 0:
				case 1:
					if ($("#cldl0306Ul").find(".addList.tp2").length >0) {
						liCheck= false;
					}else {
					}
					break;
				default:
					liCheck= false;
					break;
			}
			
			//선택할 수 있는 li가 없을때
			if (liCheck) {
				// 문구 전달받으면 수정
				LEMP.Window.toast({
					"_sMessage":"터미널 정보가 검색되지 않았습니다\n터미널 정보를 검색 후 확인해주세요",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle" : "알림",
//					"_vMessage" : "터미널 정보가 검색되지 않았습니다\n터미널 정보를 검색 후 확인해주세요"
//				});
				return false;
			}
			
			// 터미널주소 버튼이 선택되었는지 체크
			var rCheck=$("input[type='radio'][name='dstt_cd']").is(":checked");
			
			// 터미널주소 버튼이 선택되었다면 실행
			if (rCheck) {
				// 서비스 구분의 선택값을 체크
				var svcCheck = $("input[type=radio][id$=SVC_CD]:checked").val();
				
				
				page.cldl0306.cldl_sct_cd="P";
				page.cldl0306.svc_cd=svcCheck;
				page.cldl0306.fare_sct_cd=$("input[type='radio'][id$='FARE_SCT_CD']:checked").val();
				page.cldl0306.dstt_cd=$("input[type='radio'][id$='DSTT_CD']:checked").val();
				page.cldl0306.box_typ="";
				
				// 서비스구분이 의류 
				if (svcCheck === "01") {
					// 박스 규격이 선택되었는지 체크
					var rCheck4=$("input[type='radio'][name='box_typ']").is(":checked");
					
					if (rCheck4) {
						page.cldl0306.box_typ=$("input[type='radio'][id$='BOX_TYP']:checked").val();
					}else {
						LEMP.Window.toast({
							"_sMessage":"박스규격을 선택하지 않았습니다.\n버튼을 선택 해주세요.",
							'_sDuration' : 'short'
						});
//						LEMP.Window.alert({
//							"_sTitle" : "알림",
//							"_vMessage" : "박스규격을 선택하지 않았습니다.\n버튼을 선택 해주세요."
//						});
						return false;
					}
				}
				
				// 송장번호가 있다면 리스트로 돌아가고, 없다면 팝업스캔창으로 전환처리
				if (smutil.isEmpty(page.cldl0306.inv_no)) {
					page.cldl0306.menu_id="CLDL0306";
					LEMP.Window.replace({
						"_sPagePath" : "COM/html/COM0101.html",
						"_oMessage" : {
							"param" : page.cldl0306
						}
					});
				}else {
					LEMP.Window.close({
						"_oMessage":{
							"param":page.cldl0306
						},
						"_sCallback":"page.CLDL0306Callback"
					});
				}
			}else {
				LEMP.Window.toast({
					"_sMessage":"터미널 주소가 선택 되지 않았습니다.\n선택 후 확인을 눌러주세요.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle" : "알림",
//					"_vMessage" : "터미널 주소가 선택 되지 않았습니다.\n선택 후 확인을 눌러주세요."
//				});
				return false;
			};
		});
		// 확인버튼 구문 종료
		
		
		// 도착지검색 바코드리더
		$("#codeReader").click(function(){
			LEMP.Window.openCodeReader({
				"_fCallback":function(res){
					if (res.data.length === 3 || res.data.length === 4) {
						// 서비스 구분의 선택값을 체크
						var svcCheck = $("input[type=radio][id$=SVC_CD]:checked").val();
						
						
						page.cldl0306.cldl_sct_cd="P";
						page.cldl0306.svc_cd=svcCheck;
						page.cldl0306.fare_sct_cd=$("input[type='radio'][id$='FARE_SCT_CD']:checked").val();
						page.cldl0306.dstt_cd=res.data;
						page.cldl0306.box_typ="";
						
						// 서비스구분이 의류 
						if (svcCheck === "01") {
							// 박스 규격이 선택되었는지 체크
							var rCheck4=$("input[type='radio'][name='box_typ']").is(":checked");
							
							if (rCheck4) {
								page.cldl0306.box_typ=$("input[type='radio'][id$='BOX_TYP']:checked").val();
							}else {
								LEMP.Window.toast({
									"_sMessage":"박스규격을 선택하지 않았습니다.\n버튼을 선택 해주세요.",
									'_sDuration' : 'short'
								});
//								LEMP.Window.alert({
//									"_sTitle" : "알림",
//									"_vMessage" : "박스규격을 선택하지 않았습니다.\n버튼을 선택 해주세요."
//								});
								return false;
							}
						}
						
						// 송장번호가 있다면 리스트로 돌아가고, 없다면 팝업스캔창으로 전환처리
						if (smutil.isEmpty(page.cldl0306.inv_no)) {
							page.cldl0306.menu_id="CLDL0306";
							LEMP.Window.replace({
								"_sPagePath" : "COM/html/COM0101.html",
								"_oMessage" : {
									"param" : page.cldl0306
								}
							});
						}else {
							LEMP.Window.close({
								"_oMessage":{
									"param":page.cldl0306
								},
								"_sCallback":"page.CLDL0306Callback"
							});
						}
					}else {
						smutil.callTTS("0", "0", null, page.isBackground);
						LEMP.Window.toast({
							"_sMessage":"정상적인 도착지 코드가 아닙니다.",
							'_sDuration' : 'short'
						});
//						LEMP.Window.alert({
//							"_sTitle" : "도착지조회",
//							"_vMessage" : "정상적인 도착지 코드가 아닙니다."
//						});
					}
				}
			})
			
		});
		//
		
		
		// 시도 selectbox 변경 이벤트
		$(document).on("change","#cldl0306SidoSel",function(){
			
			if (!isNaN( Number( $(this).val() ) ) ) {
				var data = {
					"city_do":$("#cldl0306SidoSel option:selected").text()
				}
				page.gungu(data);
				
			}
		});
		
		
		$("#ldno_addr,#rdnm_addr").click(function(){
			// 주소 버튼 클릭시 li 클래스명 on으로 변경 이벤트
			$(this).parents("ul").find(".on").attr("class","");
			$(this).parent().attr("class","on");
			
			//검색할 주소버튼에 따라 input값의 문구내용을 바꿈
			if ($(this).attr("id")==="rdnm_addr") {
				$("#addr_input").attr("placeholder","건물번호까지 입력해주세요");
			}else {
				$("#addr_input").attr("placeholder","법정동명을 입력해주세요");
			}
			
			$("#cldl0306Ul").empty();
		})
		
		// 검색버튼 클릭(구)
/*		$("#addrSearch").click(function(){
			var data = {};
			var check_sido = $("#cldl0306SidoSel option:selected");
			var check_gungu = $("#cldl0306GunguSel option:selected");
			
			var sido_text = check_sido.text();
			var gungu_text = check_gungu.text();
			var addr = $("#addr_input").val();
			var adr_sct_cd = $(".addTab").find(".on button").val();
			var svc_cd =$("input[type=radio][id$=SVC_CD]:checked").val();
			
			//지번주소일때는 최소2글자여야 함
			if ($(".addTab").find(".on").children().val() ==="00") {
				//지번일 경우 select박스가 선택되지 않았으면 빈값으로 변경;
				if ($("#cldl0306SidoSel").val()===null) {
					sido_text="";
				}
				if ($("#cldl0306GunguSel").val()===null) {
					gungu_text="";
				}
				if (smutil.isEmpty(addr)) {
					LEMP.Window.toast({
						"_sMessage":"상세주소가 입력되지 않았습니다.\n법정동 단위로 입력 해주세요.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle" : "도착지 검색",
//						"_vMessage" : "상세주소가 입력되지 않았습니다.\n법정동 단위로 입력 해주세요."
//					});
				}else if ($("#addr_input").val().length < 2) {
					LEMP.Window.toast({
						"_sMessage":"상세주소가 입력되지 않았습니다.\n2글자 이상 입력 해주세요.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle" : "도착지 검색",
//						"_vMessage" : "상세주소가 입력되지 않았습니다.\n2글자 이상 입력 해주세요."
//					});
				}else {
					data = {
						"city_do":sido_text,
						"city_gun_gu":gungu_text,
						"adr":addr,
						"adr_sct_cd":adr_sct_cd,
						"svc_cd":svc_cd
					}
					
					page.addr(data);
				}
			}else {
				if (check_sido.val()==="default") {
					LEMP.Window.toast({
						"_sMessage":"시,도를 선택 해주세요.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle" : "도착지 검색",
//						"_vMessage" : "시,도를 선택 해주세요."
//					});
				}else if (check_gungu.val()==="default") {
					LEMP.Window.toast({
						"_sMessage":"군,구를 선택 해주세요.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle" : "도착지 검색",
//						"_vMessage" : "군,구를 선택 해주세요."
//					});
				}else if (smutil.isEmpty(addr)) {
					LEMP.Window.toast({
						"_sMessage":"상세주소가 입력되지 않았습니다.\n법정동 단위로 입력 해주세요.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle" : "도착지 검색",
//						"_vMessage" : "상세주소가 입력되지 않았습니다.\n법정동 단위로 입력 해주세요."
//					});
				}else {
					data = {
						"city_do":sido_text,
						"city_gun_gu":gungu_text,
						"adr":addr,
						"adr_sct_cd":adr_sct_cd,
						"svc_cd":svc_cd
					}
					
					page.addr(data);
				}
			}
			
		});*/
		// 검색버튼 클릭(신)
		$("#addrSearch").click(function(){
			var data = {};
			
			var addr = $("#addr_input").val();
			var network = $("input[type=radio][id$=SVC_CD]:checked").val();
			
			var zip_no_input = ($("#zip_no_input").val()).replace(/\-/gi,"");
			var area_no;		//새우편번호
			var zip_no;			//구우편번호
			
			if(zip_no_input.length == 5){
				area_no = zip_no_input;
				zip_no = "";
			}else if(zip_no_input.length == 6){
				area_no = "";
				zip_no = zip_no_input;
			}else if(zip_no_input.length == 0){
				area_no = "";
				zip_no = "";
			}else{
				LEMP.Window.toast({
					"_sMessage":"유효하지 않은 우편번호",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle" : "분류코드 검색",
//					"_vMessage" : "유효하지 않은 우편번호"
//				});
				
				$("#cldl0306Ul").html("");
				return;
			}
			
			if (smutil.isEmpty(addr)) {
				LEMP.Window.toast({
					"_sMessage":"전체 주소를 입력해주세요.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle" : "분류코드 검색",
//					"_vMessage" : "전체 주소를 입력해주세요."
//				});
			}else if ($("#addr_input").val().length < 2) {
				LEMP.Window.toast({
					"_sMessage":"전체 주소를 입력해주세요.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle" : "분류코드 검색",
//					"_vMessage" : "전체 주소를 입력해주세요."
//				});
			}else {
				data = {
					"network": network,
					"address": addr,
					"zip_no": zip_no,
					"area_no": area_no
				}
				
				page.addr(data);
			}
			
		});
		
		// 주소리스트 초기화
		$(".addTab>ul>li,input[name='svc_cd']").click(function(){
			$(".addList > ul").empty();
		});
		
		
		// 시/도 조회
		page.sido();
	}
	,sido:function(){

		smutil.loadingOn();		// 로딩바 열기
		
		page.apiParam.param.baseUrl="smapis/cmn/sido";
		page.apiParam.param.callback="page.sidoCallback";
		
		// 공통 api호출 함수 
		smutil.callApi(page.apiParam);
	}
	,sidoCallback:function(data){
		try{
			
			var res = data.data;
			if (smutil.apiResValidChk(data)&& data.code=="0000") {
				//각각의 옵션의 value값을 배열 인덱스+1로 지정해줌.
//				Handlebars.registerHelper("index", function(index, options){
//					return index + 1;
//				});
				
				//handlebars template 시작
				var template = Handlebars.compile($("#cldl0306_sido_template").html());
				$("#cldl0306SidoSel").html(template(res));
			}else {
				LEMP.Window.toast({
					"_sMessage":"통신에 실패했습니다.\n문제가 지속되면 담당자에게 연락하세요.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle" : "알림",
//					"_vMessage" : "통신에 실패했습니다.\n문제가 지속되면 담당자에게 연락하세요."
//				});
			}
		}
		catch(e){}
		finally{
			smutil.loadingOff();			// 로딩바 닫기
		}
	}
	,gungu:function(data){
		smutil.loadingOn();		// 로딩바 열기
		
		page.apiParam.param.baseUrl="smapis/cmn/gungu";
		page.apiParam.param.callback="page.gunguCallback";
		page.apiParam.data.parameters=data;
		
		// 공통 api호출 함수 
		smutil.callApi(page.apiParam);
	}
	,gunguCallback:function(data){
		try{
			
			var res = data.data;
			if (smutil.apiResValidChk(data)&& data.code=="0000") {
				$("#cldl0306GunguSel").empty();
				
				//각각의 옵션의 value값을 배열 인덱스+1로 지정해줌.
//				Handlebars.registerHelper("index", function(index, options){
//					return index + 1;
//				});
				
				//handlebars template 시작
				var template = Handlebars.compile($("#cldl0306_gungu_template").html());
				$("#cldl0306GunguSel").html(template(res));
			}else {
				LEMP.Window.toast({
					"_sMessage":"통신에 실패했습니다.\n문제가 지속되면 담당자에게 연락하세요.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle" : "알림",
//					"_vMessage" : "통신에 실패했습니다.\n문제가 지속되면 담당자에게 연락하세요."
//				});
			}
		}
		catch(e){}
		finally{
			smutil.loadingOff();			// 로딩바 닫기
		}
		
	}
	
	//구형검색
/*	,addr:function(data){
		
		smutil.loadingOn();		// 로딩바 열기
		
		page.apiParam.param.baseUrl="smapis/cmn/dsttAddr";
		page.apiParam.param.callback="page.addrCallback";
		page.apiParam.data.parameters=data;
		
		// 공통 api호출 함수 
		smutil.callApi(page.apiParam);
	}
	,addrCallback:function(data){
		console.log("addr : ",data)
		try{
			var res = data.data;
			if (smutil.apiResValidChk(data) && data.code=="0000") {
				
				var template = Handlebars.compile($("#cldl0306_list_template").html());
				$("#cldl0306Ul").html(template(res));
				
			}
		}
		catch(e){}
		finally{
			smutil.loadingOff();			// 로딩바 닫기
		}
	}*/
	//신형 검색
		,addr:function(data){
		
		smutil.loadingOn();		// 로딩바 열기
		
		page.apiParam.param.baseUrl="smapis/newAddress";
		page.apiParam.param.callback="page.addrCallback";
		page.apiParam.data.parameters=data;
		
		// 공통 api호출 함수 
		smutil.callApi(page.apiParam);
	}
	,addrCallback:function(data){
		console.log("fdsafdsa : ",data)
		try{
			var res = data.api_msg;
			
			if (smutil.apiResValidChk(data) && data.code=="0000") {
				
				if(res.result === "success"){
					
					var template = Handlebars.compile($("#cldl0306_list_template").html());
					$("#cldl0306Ul").html(template(res));
				}
				else {
					LEMP.Window.toast({
						"_sMessage":res.message,
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle" : "분류코드 검색",
//						"_vMessage" : res.message
//					});
					var template = Handlebars.compile($("#no_list_template").html());
					
					$("#cldl0306Ul").html(template(res));
				}
			}
		}
		catch(e){}
		finally{
			smutil.loadingOff();			// 로딩바 닫기
		}
	}
		
	,scanCallback:function(res){
		if (res.barcode.length === 3 || res.barcode.length === 4) {
			// 서비스 구분의 선택값을 체크
			var svcCheck = $("input[type=radio][id$=SVC_CD]:checked").val();
			
			
			page.cldl0306.cldl_sct_cd="P";
			page.cldl0306.svc_cd=svcCheck;
			page.cldl0306.fare_sct_cd=$("input[type='radio'][id$='FARE_SCT_CD']:checked").val();
			page.cldl0306.dstt_cd=res.barcode;
			page.cldl0306.box_typ="";
			
			// 서비스구분이 의류 
			if (svcCheck === "01") {
				// 박스 규격이 선택되었는지 체크
				var rCheck4=$("input[type='radio'][name='box_typ']").is(":checked");
				
				if (rCheck4) {
					page.cldl0306.box_typ=$("input[type='radio'][id$='BOX_TYP']:checked").val();
				}else {
					LEMP.Window.toast({
						"_sMessage":"박스규격을 선택하지 않았습니다.\n버튼을 선택 해주세요.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle" : "알림",
//						"_vMessage" : "박스규격을 선택하지 않았습니다.\n버튼을 선택 해주세요."
//					});
					return false;
				}
			}
			
			// 송장번호가 있다면 리스트로 돌아가고, 없다면 팝업스캔창으로 전환처리
			if (smutil.isEmpty(page.cldl0306.inv_no)) {
				page.cldl0306.menu_id="CLDL0306";
				LEMP.Window.replace({
					"_sPagePath" : "COM/html/COM0101.html",
					"_oMessage" : {
						"param" : page.cldl0306
					}
				});
			}else {
				LEMP.Window.close({
					"_oMessage":{
						"param":page.cldl0306
					},
					"_sCallback":"page.CLDL0306Callback"
				});
			}
		}else {
			smutil.callTTS("0", "0", null, page.isBackground);
			LEMP.Window.toast({
				"_sMessage":"정상적인 도착지 코드가 아닙니다.",
				'_sDuration' : 'short'
			});
//			LEMP.Window.alert({
//				"_sTitle" : "도착지조회",
//				"_vMessage" : "정상적인 도착지 코드가 아닙니다."
//			});
		}
	}
		// ################### 음성인식 호출 start
	,callStt : function(){
		page.apiParamInit();		// 파라메터 전역변수 초기화
		page.apiParam.id = "STT";
		
		// ios 기기인경우 시작과 종료 파라메터를 셋팅해 줘야함
		if(smutil.deviceInfo == "smios"){
			page.apiParam.param = {				// api 통신용 파라메터
				"type" : "connect"
			};
		}
		else{
			page.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {}
			};
		}
		
		if(smutil.deviceInfo == "smios"){		// ios
			// 종료 버튼이 있는 음성인식 바 넣기
			$('.mpopBox.sms2').bPopup({modalClose: false});
		}
		else {		// android
			// 음성인식 바 넣기
			$('.mpopBox.sms').bPopup({modalClose: false});
		}
		
		// 공통 api호출 함수
		smutil.nativeMothodCall(page.apiParam);
		
		page.apiParamInit();			// 파라메터 전역변수 초기화
		
	}
	// ios 음성인식 완료로직
	,callSttIos : function(){
		page.apiParamInit();		// 파라메터 전역변수 초기화
		page.apiParam.id = "STT";

		// ios 기기인경우 시작과 종료 파라메터를 셋팅해 줘야함
		page.apiParam.param = {				// api 통신용 파라메터
			"type" : "disConnect"
		};
		
		// 공통 api호출 함수
		smutil.nativeMothodCall(page.apiParam);
		
		page.apiParamInit();			// 파라메터 전역변수 초기화
		
	}
	// 음성인식 콜백 
	,sttCallback : function(result){
		try{
			
			if(!smutil.isEmpty(result)){
				// api 전송 성공
				if(result.status == "true"){
					var resultText = result.resultText;		// 검색어
					
					$('#addr_input').val(result.resultText);
				}
				else if(result.status == "false"){
					LEMP.Window.toast({
						"_sMessage":"음성인식에 실패했습니다.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle" : "알림",
//						"_vMessage" : "음성인식에 실패했습니다."
//					});
				}
			}
			
		}
		catch(e){}
		finally{
			
			if(smutil.deviceInfo == "smios"){		// ios
				$('.mpopBox.sms2').bPopup().close();
			}
			else {		// android
				$('.mpopBox.sms').bPopup().close();
			}
			
			page.apiParamInit();			// 파라메터 전역변수 초기화
		}
	},
	
};

