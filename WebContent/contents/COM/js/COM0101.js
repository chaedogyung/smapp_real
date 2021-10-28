LEMP.addEvent("backbutton", "page.callbackBackButton");

var page={
	init:function(arg){
		page.param = arg.data.param;
		page.initInterface(arg.data.param);

		// 숫자 키패드 팝업 열기
		$("#scan").click(function(){
			var popUrl = smutil.getMenuProp('COM.COM0102', 'url');
			LEMP.Window.open({
				"_sPagePath":popUrl,
			});
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
		, isBackground : page.isBackground
	}
	, param : null
	, isBackground : false
	//이벤트 등록 함수
	,initInterface:function(data)
	{
		//input박스 우측의 코드리더이미지 클릭
		$(document).on("click",".btn.scan",function(){
			page.codeReader();
		});
		//스캔취소그림 클릭
		$(document).on("click",".btn.del2",function(){
			var obj = $(this);

			var btnCancel = LEMP.Window.createElement({ _sElementName:"TextButton" });
			btnCancel.setProperty({
				_sText : "취소",
				_fCallback : function(){}
			});

			var btnConfirm = LEMP.Window.createElement({ _sElementName:"TextButton" });
			btnConfirm.setProperty({
				_sText : "확인",
				_fCallback : function(){
					page.ScanCancel(obj,data);
				}
			});

			LEMP.Window.confirm({
				"_sTitle":"스캔취소",
				_vMessage : "선택한 송장정보의 \n스캔을 취소하시겠습니까?",
				_aTextButton : [btnConfirm, btnCancel]
			});

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
					if(page.param.menu_id == "CLDL0401"){
						var dlvyCompl = LEMP.Properties.get({ "_sKey" : "autoMenual"});
						if(dlvyCompl.area_sct_cd2 == "A"){
							$("#span_cldl_sct_cd").hide();
							$("#chngTme").hide();
							var area_sct_cd = dlvyCompl.area_sct_cd;	//구역시간 구분

							for (var i = 0; i < Object.keys(data).length; i++) {
								data[Object.keys(data)[i]] = data[Object.keys(data)[i]]+"";
							}
							var baseUrl = "smapis/cldl/dlvCmptScanTrsm"
							if(!smutil.isEmpty(baseUrl)){
								smutil.loadingOn();
								
								var liLst = $(".li.list")
								var inv_no;									// li 에 걸려있는 송장번호
								var param_list = [];						// 전송할 리스트 배열
								var invNoObj = {};
								$.each(liLst, function(idx, liObj){
									inv_no = $(liObj).attr('id')+"";
									invNoObj = {"inv_no":inv_no, "scan_yn":"Y"};
									param_list.push(invNoObj);
									return true;					// 스캔한 데이터를 셋팅했으면 다음 li 로 이동(continue)

									// 체크박스에 체크한 데이터 (기본적으로 스캔 안한데이터이다)
									
									invNoObj = {"inv_no":inv_no, "scan_yn":"N"};
									param_list.push(invNoObj);
									});
								
							    if(param_list.length == 0){
                                	LEMP.Window.close({
										"_sCallback" : "page.listReLoad"
									})
                                }
								var curDate = new Date();
								curDate = curDate.getFullYear() + ("0"+(curDate.getMonth()+1)).slice(-2) + ("0"+curDate.getDate()).slice(-2);
								var base_ymd = smutil.nullToValue($('#cldlBtnCal').text(),curDate);
								base_ymd = base_ymd.split('.').join('');
								
								page.apiParam.param.baseUrl=baseUrl;
								page.apiParam.param.callback="page.dlvCmptScanTrsmCallback";
								page.apiParam.data = {				// api 통신용 파라메터
										"parameters" : {
											"base_ymd" : base_ymd,				// 기준일자
											"cldl_sct_cd" : data.cldl_sct_cd, 		// 집하 / 배달 업무 구분코드
											"cldl_tmsl_cd" : data.cldl_tmsl_cd, 		// 예정시간 구분코드
											"mbl_area" : data.mbl_dlv_area,			// 설정된 구역
											"max_nm" : data.max_nm,						// 일괄전송을 위한 max 시간 값
											"area_sct_cd" : area_sct_cd,
											"acpt_sct_cd" : data.acpt_sct_cd, 		// 인수자 구분코드
											"acpr_nm" : data.acpr_nm,				// 인수자 명
											"param_list" : param_list			// 전송할 송장정보 {송장번호 : 스캔여부}
										}
								};
								smutil.loadingOn();

								// 공통 api호출 함수
								smutil.callApi(page.apiParam);
							}
							
						}else{
							LEMP.Window.close({
								"_sCallback" : "page.listReLoad"
							})
						}
							
					}else{
						LEMP.Window.close({
							"_sCallback" : "page.listReLoad"
						})
					};
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

		// input 데이터 변경 감지
		$(document).on("change","#scan",function(){
			page.InputChange($(this),data);
		});
	}
	// input에 데이터 변경시 처리 프로세스
	,InputChange : function(obj,data){
		var invNo = obj.val()+"";
		var plag = false;

		// 입력받은 송장번호가 목록에 있는지 확인
		$(".li.list").each(function(i,r){
			if ($(r).find("span").text().replace(/\-/g,'') == invNo) {
				plag = true;
				return false;
			}
		});


		if(invNo.length==12){
			if (!plag) {
				var Current_date = new Date();
				Current_date = Current_date.LPToFormatDate("yyyymmddHHnnss");
				data.inv_no=invNo;
				data.scan_dtm=Current_date;

				// 송장번호 유효성 검증
				if (Number(invNo.substr(0,11))%7 == Number(invNo.substr(11,1))) {

					// 집하에서 5번으로 시작하는 송장은 스캔할수 없게 한다.
					if(data.cldl_sct_cd == "P" && ((invNo).LPStartsWith("5"))){
						LEMP.Window.toast({
							"_sMessage":"의류특화 보조송장은 \n집하업무에선 스캔할수 없습니다.",
							'_sDuration' : 'short'
						});
//						LEMP.Window.alert({
//							"_sTitle":"스캔오류",
//							"_vMessage":"의류특화 보조송장은 \n집하업무에선 스캔할수 없습니다."
//						});

						obj.val(invNo.replace(/([0-9]{4})([0-9]{4})([0-9]{4})/,"$1-$2-$3"));

						// 실패 tts 호출(벨소리)
						smutil.callTTS("0", "0", null, page.isBackground);

						return false;
					}
					else{
						page.plnScanRgst(data);
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

					obj.val(invNo.replace(/([0-9]{4})([0-9]{4})([0-9]{4})/,"$1-$2-$3"));

					// 실패 tts 호출(벨소리)
					smutil.callTTS("0", "0", null, page.isBackground);

					return false;
				}
			}
			else {
				LEMP.Window.toast({
					"_sMessage" : "중복된 송장번호 입니다.",
					"_sDuration" : "short"
				});

				obj.val(invNo.replace(/([0-9]{4})([0-9]{4})([0-9]{4})/,"$1-$2-$3"));

				// 실패 tts 호출(벨소리)
				smutil.callTTS("0", "0", null, page.isBackground);

				return false;
			}
		}
	}

	// 스캔 취소
	,ScanCancel:function(obj,data){
		var Current_date = new Date();
		Current_date = Current_date.LPToFormatDate("yyyymmddHHnnss");
		data.inv_no=obj.prev().text().replace(/\-/g,'');
		data.scan_dtm=Current_date;
		page.plnScanCcl(data);
	}

	// 스캔 등록 api
	,plnScanRgst:function(data){

		var baseUrl;
		switch (page.param.menu_id) {
			case 'CLDL0101':
				baseUrl = "smapis/cldl/plnScanRgst";
				break;

			case 'CLDL0301':
			case 'CLDL0302':
			case 'CLDL0306':
			case 'CLDL0401':
				
			default:
				baseUrl = "smapis/cldl/cmptScanRgst";
				break;
		}
		if(!smutil.isEmpty(baseUrl)){
			for (var i = 0; i < Object.keys(data).length; i++) {
				data[Object.keys(data)[i]] = data[Object.keys(data)[i]]+"";
			}

			smutil.loadingOn();

			page.apiParam.param.baseUrl=baseUrl;
			page.apiParam.param.callback="page.ScanRgstCallback";
			page.apiParam.data.parameters=data;

			// 공통 api호출 함수
			smutil.callApi(page.apiParam);
		}
		else {
			LEMP.Window.toast({
				"_sMessage":"스캔 처리 구분값이 없습니다.",
				'_sDuration' : 'short'
			});
//			LEMP.Window.alert({
//				"_sTitle":"스캔오류",
//				"_vMessage":"스캔 처리 구분값이 없습니다."
//			});
		}

	}

	// 스캔 취소 api
	,plnScanCcl:function(data){
		var baseUrl;

		switch (page.param.menu_id) {
			case 'CLDL0101':
				baseUrl = "smapis/cldl/plnScanCcl";
				break;

			case 'CLDL0301':
			case 'CLDL0302':
			case 'CLDL0306':
			case 'CLDL0401':

			default:
				baseUrl = "smapis/cldl/cmptScanCcl";
				break;
		}

		if(!smutil.isEmpty(baseUrl)){
			smutil.loadingOn();

			page.apiParam.param.baseUrl=baseUrl;
			page.apiParam.param.callback="page.ScanCclCallback";
			page.apiParam.data.parameters=data;

			// 공통 api호출 함수
			smutil.callApi(page.apiParam);
		}
		else {
			LEMP.Window.toast({
				"_sMessage":"스캔 처리 구분값이 없습니다.",
				'_sDuration' : 'short'
			});
//			LEMP.Window.alert({
//				"_sTitle":"스캔오류",
//				"_vMessage":"스캔 처리 구분값이 없습니다."
//			});
		}
	}

	// 휴대용 스캐너 스캔
	,scanCallback:function(res){
		page.isBackground = res.isBackground;		// 앱이 background 상태인지 아닌지 설정
		$("#scan").val(res.barcode);
		$("#scan").trigger("change");
	}

	// 스캔 등록 api 콜백
	,ScanRgstCallback: function(res){
		try {
			if (smutil.apiResValidChk(res) && res.code === "0000") {
				var code = res.inv_no.replace(/([0-9]{4})([0-9]{4})([0-9]{4})/,"$1-$2-$3");
				//handlebars template 불러오기
				var source = $("#COM0101_list_template").html();
				//handlebars template pre 컴파일
				var template = Handlebars.compile(source);
				//handlebars template에 binding할 data
				var data={"list":[{"invNo":code, "invNoId" : res.inv_no}]}
				//생성된 태그에 binding한 템플릿 data를 출력
				$(".boxList").append(template(data));

				$("#scan").val("");

				// 성공 tts 호출(벨소리)
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
	
	,autoSendInvCallback: function(res){
		try {
			if (smutil.apiResValidChk(res) && res.code === "0000") {
				var code = res.inv_no.replace(/([0-9]{4})([0-9]{4})([0-9]{4})/,"$1-$2-$3");
				//handlebars template 불러오기
				var source = $("#COM0101_list_template").html();
				//handlebars template pre 컴파일
				var template = Handlebars.compile(source);
				//handlebars template에 binding할 data
				var data={"list":[{"invNo":code, "invNoId" : res.inv_no}]}
				//생성된 태그에 binding한 템플릿 data를 출력
				$(".boxList").append(template(data));

				$("#scan").val("");

				// 성공 tts 호출(벨소리)
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
	,ScanCclCallback:function(res){
		try {
			if (smutil.apiResValidChk(res) &&
					(res.code ==="0000" || res.code==="1000")) {
				$('#'+res.inv_no).remove();
			}
		} catch (e) {}
		finally{
			smutil.loadingOff();
			LEMP.Window.close({
				"_sCallback" : "page.listReLoad"
			})
		}
	},
	dlvCmptScanTrsmCallback:function(res){
		try {
			if (smutil.apiResValidChk(res) &&
					(res.code ==="0000" || res.code==="1000")) {
				LEMP.Window.close({
					"_sCallback" : "page.listReLoad"
				})
			}
			if(res.code ==="1100" ){
				smutil.loadingOff();
				LEMP.Window.close({
					"_sCallback" : "page.listReLoad"
				})
			}
		} catch (e) {}
		finally{
			smutil.loadingOff();
		}
	}
	
	,InputCallback:function(res){
		$("#scan").val(res.inv_no);
		//$("#scan").trigger("change");
		page.InputChange($("#scan"),page.param);

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



	// 물리적 뒤로가기 버튼 클릭시 페이지 재조회
	,callbackBackButton : function(){
		LEMP.Window.close({
			"_sCallback" : "page.listReLoad"
		});
	}
};
