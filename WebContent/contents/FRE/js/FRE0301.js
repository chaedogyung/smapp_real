var page = {
	pInfo :{},
	apiParam : {
		id : "HTTP", // 디바이스 콜 id
		param : { // 디바이스가 알아야할 데이터
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
	apiParamInit:function(){
		page.apiParam.param.baseUrl="";
		page.apiParam.param.callback="";
		page.apiParam.data.parameters={};
	},
	init : function(args) {
		page.initInterface();
		page.emp();
		if (!smutil.isEmpty(args.data.param)) {
			$("#inv_noNumber").data("menuId",args.data.param.menuId);
			page.changeForm(args.data.param.inv_no+"");
			page.trclInfo(args.data.param.inv_no);
		}
	},
	emp : function(){
		smutil.loadingOn();
		
		page.apiParam.param.baseUrl="smapis/cmn/emp";
		page.apiParam.param.callback="page.empCallback";
		
		smutil.callApi(page.apiParam);
	},
	empCallback:function(res){
		try {
			if (smutil.apiResValidChk(res) && res.code==="0000") {
				page.pInfo.dlvsh_cd = res.brsh_cd;
			}else {
				LEMP.Window.close();
				LEMP.Window.alert({
					"_sTitle" : "화물추적",
					"_vMessage" : "기초정보 조회에 실패하였습니다.\n이전 페이지로 이동합니다."
				});
			}
		}
		catch (e){}
		finally{
			smutil.loadingOff();
		}
	},
	initInterface : function() {
		$(document).on('click','#inv_noNumber',function(){
			var popUrl = smutil.getMenuProp('COM.COM0102', 'url');
			LEMP.Window.open({
				"_sPagePath" : popUrl
			});
		});

		$(document).on('click','.btn.scan',function(){
			LEMP.Window.openCodeReader({
				"_fCallback" : function(res) {
					if(res.result){
						if(String(res.data).length == 12 && (Number(String((res.data)).substr(0,11))%7 ==								
									Number(String((res.data)).substr(0,11))%7)){
							page.changeForm(res.data);
							page.trclInfo(res.data);
						}else{
							LEMP.Window.alert({
								"_sTitle" : "경고",
								"_vMessage" : "정상적인 바코드번호가 아닙니다."
							});
						}
					}else{
						LEMP.Window.alert({
							"_sTitle" : "경고",
							"_vMessage" : "바코드를 읽지 못했습니다."
						});
					}
				}
			});
		});
		
		//화물정보 click
		$('#freInfo').click(function() {
			if(smutil.isEmpty($('#inv_noNumber').val())){
				LEMP.Window.alert({
					"_vMessage" : "운송장 번호를 입력해주세요"
				});
				return false;
			}else if($('.tRed.fs11').text() == "운송장번호가 유효하지 않습니다."){
				LEMP.Window.alert({
					"_vMessage" : "운송장 번호가 유효하지 않습니다."
				});
				return false;
			}
			else{
				var popUrl = smutil.getMenuProp('FRE.FRE0302', 'url');
				LEMP.Window.open({
					"_sPagePath" : popUrl,
					"_oMessage" : {
						"inv_no" : $("#inv_noNumber").val(),
						"param" : page.pInfo,
						//"menuId":$("#inv_noNumber").data("menuId")
					}
				});
			}
		});
		
		
		$(document).on("click",".btn.mobile",function(){
			var pNum = $(this).parent().text().replace(/[^0-9\-]/g,"");
			$(".popBody > .txt1").text(pNum);
			$(".popBody > .txt1").attr("id",pNum);
			$('.mpopBox.phone').bPopup();
		})
		
		$("#callOk").click(function(){
			LEMP.System.callTEL({
				"_sNumber":$(".popBody > .txt1").attr("id")
			});
			$('.mpopBox.phone').bPopup().close();
		});

		//문자발송 버튼
		$(document).on("click",".btn.sms",function(){
			var pNum = $(this).parent().text().replace(/[^0-9\-]/g,"");
			$(".popBody > .txt1").text(pNum);
			$(".popBody > .txt1").attr("id",pNum);
			$('.mpopBox.sms').bPopup();
		})
		//문자발송 확인 버튼
		$("#smsOk").click(function(){
			var aNumber = [];
			aNumber.push($(".popBody > .txt1").attr("id"));
			LEMP.System.callSMS({
				"_aNumber":aNumber,
				"_sMessage":""
			});
			$('.mpopBox.sms').bPopup().close();
		})
		
	},
	//송장번호 입력후 전송
	trclInfo : function(code) {
		smutil.loadingOn();
		var _this = this;

		_this.apiParam.param.baseUrl = "smapis/pacl/trcInfo";
		_this.apiParam.param.callback = "page.trclInfoCallback";
		_this.apiParam.data = {
			"parameters" : {
				"inv_no" : code
			}
		};
		smutil.callApi(_this.apiParam);
		
	},
	// 숫자키패드 콜백
	InputCallback : function(res) {
		var code = res.inv_no;
		
		page.changeForm(code);
		page.trclInfo(code);
	},
	//송장번호  전송후 콜백
	trclInfoCallback : function(res) {
		try{
			if(smutil.apiResValidChk(res) && res.code === "0000" && res.data_count!=0){
				$(".tRed.fs11").css("display","none");
				var list = res.data.list[0];
				//주소가 있으면 기타주소까지 출력, 없으면 공백으로 출력(배달사원이 로그인한 사원과 동일할때)
				
				var keys = Object.keys(list);
				
				//null 값 공백으로 치환하는 반복문;
				for (var i = 0; i < keys.length; i++) {
					if (smutil.isEmpty($.trim(list[keys[i]]))) {
						list[keys[i]]="";
					}
				}
				for (var i = 0; i < keys.length; i++) {
					var str = keys[i];
					var val = list[str];
					
					// 데이터가 빈 내용으로 돌아올시 공백으로 처리
					if (smutil.isEmpty($.trim(val))) {
						val = "";
					}
					
					/**
					 * 데이터가 공백일시 아무것도 하지 않음 -> 공백일시 공백으로 입력
					 * 데이터가 있을 시 자신의 점소코드가 배달이나 집하점소코드와 동일하다면 정상적으로 출력
					 * 데이터가 있을 시 자신의 점소코드가 배달이나 집하점소코드와 동일하지 않다면 출력 하지 않음
					 */
					if (!smutil.isEmpty(val)) {
						switch (str) {
							case "acper_htel":
							case "snper_htel":
							case "acper_tel":
							case "snper_tel":
								if (page.pInfo.dlvsh_cd === list.dlvsh_cd 
										|| page.pInfo.dlvsh_cd === list.picsh_cd
										|| page.pInfo.dlvsh_cd === list.dev_brsh_cd){
									$("#"+keys[i]).text(val);
									$("#"+keys[i]).append("<button class='btn mobile'>전화번호</button>");
									//휴대폰 번호일경우 문자버튼 추가
									if(val.LPStartsWith("010")
										|| val.LPStartsWith("011")
										|| val.LPStartsWith("016")
										|| val.LPStartsWith("017")
										|| val.LPStartsWith("050")
									){
										$("#"+keys[i]).append("<button class='btn sms'>문자</button>");
									}
								}else {
									var array = val.split("-");
									switch (array.length) {
										case 1:
											val = array[0].replace(/[0-9]/gi,"*");
											break;
										case 2:
											val = array[0]+"-"+array[1].replace(/[0-9]/gi,"*");
											break;
										default:
											if (array.length > 0) {
												val=array[0]+"-"+array[1]+"-"+array[2].replace(/[0-9]/gi,"*");
											};
											break;
									}
									$("#"+keys[i]).text(val);
								}
								page.pInfo[str]=val;
								break;
							case "acper_badr":
								if (page.pInfo.dlvsh_cd === list.dlvsh_cd 
										|| page.pInfo.dlvsh_cd === list.picsh_cd
										|| page.pInfo.dlvsh_cd === list.dev_brsh_cd){
									val += " "+ list.acper_dadr+" "+list.acper_etc_adr;
								}
								page.pInfo[str]=val;
								$("#"+keys[i]).text(val);
								break;
							case "snper_badr":
								if (page.pInfo.dlvsh_cd === list.dlvsh_cd 
										|| page.pInfo.dlvsh_cd === list.picsh_cd
										|| page.pInfo.dlvsh_cd === list.dev_brsh_cd){
									val += " "+ list.snper_dadr+" "+list.snper_etc_adr;
								}
								page.pInfo[str]=val;
								$("#"+keys[i]).text(val);
								break;
							case "acper_rdnm_adr":
							case "acper_ldno_adr":
								if (page.pInfo.dlvsh_cd === list.dlvsh_cd 
										|| page.pInfo.dlvsh_cd === list.picsh_cd
										|| page.pInfo.dlvsh_cd === list.dev_brsh_cd){
									val += " "+ list.acper_etc_adr;
								}
								page.pInfo[str]=val;
								$("#"+keys[i]).text(val);
								break;
							case "snper_rdnm_adr":
							case "snper_ldno_adr":
								if (page.pInfo.dlvsh_cd === list.dlvsh_cd 
										|| page.pInfo.dlvsh_cd === list.picsh_cd
										|| page.pInfo.dlvsh_cd === list.dev_brsh_cd){
									val += " "+ list.snper_etc_adr;
								}
								page.pInfo[str]=val;
								$("#"+keys[i]).text(val);
								break;
							case "img_path":
								// 본인의 구역인 데이터를 조회중일때만 이미지 출력 
								if (page.pInfo.dlvsh_cd === list.dlvsh_cd 
										|| page.pInfo.dlvsh_cd === list.picsh_cd
										|| page.pInfo.dlvsh_cd === list.dev_brsh_cd){
									$("#FRE0301_img").attr("src",list.img_path);
									$("#FRE0301_img").closest("li").css("display","block");
								}else {
									$("#FRE0301_img").attr("src","");
									$("#FRE0301_img").closest("li").css("display","none");
								}
								break;
							case "snper_nm":
							case "acper_nm":
							case "acpt_per_nm":
								// 본인의 구역이 아닌 데이터를 조회중 이름이 3글자 일때 2,3번째 글자를 * 처리
								// 본인의 구역이 아닌 데이터를 조회중 이름이 4글자 이상일때 첫번째와 마지막 글자 제외하고 * 처리
								if(page.pInfo.dlvsh_cd !== list.dlvsh_cd 
										&& page.pInfo.dlvsh_cd !== list.picsh_cd
										&& page.pInfo.dlvsh_cd !== list.dev_brsh_cd){
									if (val.length <= 3) {
										//val = val.replace(/(?<=.{1})./gi, "*");
										val = val.LPLeftSubstr(1)+"**";
									}else {
										val = val.LPLeftSubstr(1)+ "*****" + val.LPRightSubstr(1);
	//									val = val.LPLeftSubstr(val.length-1).replace(/(?<=.{1})./gi,"*") + val.LPRightSubstr(1);
									}
								}
									
								$("#"+keys[i]).text(val);
								page.pInfo[str]=val;
								break;
							default:
								$("#"+keys[i]).text(val);
								break;
						}
					}
					else{
						//들어온 데이터가 공백일경우 빈칸처리
						$("#"+keys[i]).text("");
					}
				}
			}else{
				$(".fre0301_class").text("");
				$(".tRed.fs11").css("display","block");
				$("#FRE0301_img").closest("li").css("display","none");
			}
		}catch(e){console.log(e)}
		finally{
			smutil.loadingOff();
		}
		
	},
	scanCallback : function(data){
		if((data.barcode.length == 12)&&
				(Number(data.barcode.substr(0,11))%7 == Number(data.barcode.substr(11,1)))){
			page.changeForm(data.barcode);
			page.trclInfo(data.barcode);
		}else{
			LEMP.Window.alert({
				"_sTitle" : "운송장번호 오류",
				"_vMessage" : "정상적인 바코드번호가 아닙니다."
			});
		}
		
	},
	changeForm : function(code){
		$("#inv_noNumber").val(code.replace(/^(\d{4})(\d{4})(\d{4})$/,"$1-$2-$3"));
		page.pInfo.inv_no =$("#inv_noNumber").val();
	}
};
