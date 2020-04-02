var page = {
	isBackground : false,
	detail : "",
	inv_noV : {
		sign :"",
		cancle : ""
	},
	codeJ : "",
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
	},
	apiParamInit:function(){
		page.apiParam.param.baseUrl="";
		page.apiParam.param.callback="";
		page.apiParam.data.parameters={};
	},
	init : function() {
		page.initInterface();
		page.stfngScanCnt();
	},
	initInterface : function() {
		
		//소형적입조회
		$('#searchJy').click(function(){
			var popUrl = smutil.getMenuProp('ARI.ARI0302', 'url');
			LEMP.Window.open({
				"_sPagePath" : popUrl,
			});
		});
		
		//적입점소 입력
		$('#inputJy').click(function(){
			var popUrl = smutil.getMenuProp('ARI.ARI0303', 'url');
			LEMP.Window.open({
				"_sPagePath" : popUrl,
			});
		});
		
		//운반장비 입력
		$('#moequi').click(function(){
			var popUrl = smutil.getMenuProp('ARI.ARI0304', 'url');
			LEMP.Window.open({
				"_sPagePath" : popUrl,
			});
		});
		
		//운반장비 번호 카메라 스캔
		$('#eqScan').click(function(){
		
			if(smutil.isEmpty($("#inputJy").val())){
				LEMP.Window.alert({
					"_vMessage" : "적입점소 번호를 입력해주세요",
				});
			}else{
				LEMP.Window.openCodeReader({
					"_fCallback" : function(res) {
						if(res.result){
							if (String(res.data).length == 10 && 
								(String(res.data).substr(0,1)==="8" 
									&& Number(String(res.data).substr(0,9))%7==
										Number(String(res.data).substr(9,1)))){
								$('#moequi').val(res.data);
								page.sjycallback();
									
							}else {
								LEMP.Window.alert({
									"_sTitle" : "경고",
									"_vMessage" : "정상적인 바코드번호가 아닙니다."
								});
								return false;
							}
						}else {
							LEMP.Window.alert({
								"_sTitle" : "경고",
								"_vMessage" : "바코드를 읽지 못했습니다."
							});
							return false;
						}
					}
				});
			}
		});
		
		//송장번호 입력
		$('#invScan').click(function(){
			if(smutil.isEmpty($("#moequi").val())){
				LEMP.Window.alert({
					"_vMessage" : "운반 장비 번호를 입력해주세요 ",
				});
			}else{
				var popUrl = smutil.getMenuProp('COM.COM0102', 'url');
				LEMP.Window.open({
					"_sPagePath" : popUrl
				});
			}
		});
		
		//카메라 스캔 입력
		$('#invScan_c').click(function(){
			if(smutil.isEmpty($("#moequi").val())){
				LEMP.Window.alert({
					"_vMessage" : "운반 장비 번호를 입력해주세요 ",
				});
			}else{
				LEMP.Window.openCodeReader({
					"_fCallback":function(res){
						if(res.result){
							if (String(res.data).length == 12) {
								page.inv_noV.sign = String(res.data);
								page.InputChange();
							}else {
								LEMP.Window.alert({
									"_sTitle" : "경고",
									"_vMessage" : "정상적인 바코드번호가 아닙니다."
								});
								smutil.callTTS("0", "0", null, page.isBackground);
								
								return false;
							}
						}else {
							LEMP.Window.alert({
								"_sTitle" : "경고",
								"_vMessage" : "바코드를 읽지 못했습니다."
							});
							smutil.callTTS("0", "0", null, page.isBackground);
							
							return false;
						}
					}
					});
			}
		});
		
		//스캔 취소 확인 버튼 클릭
		$('#agree').click(function(){
			$('.mpopBox.img.cancel').bPopup().close();		
			smutil.loadingOn();
			
			page.apiParam.param.baseUrl="/smapis/net/stfngScanCcl";
			page.apiParam.param.callback="page.ScanCclCallback";
			page.apiParam.data.parameters={
					"smsz_mbag_no" : $('#moequi').val(),
					"inv_no" : page.inv_noV.cancle,
					"scan_brsh_cd" : $('#inputJy').val(),
					
			};
			
			// 공통 api호출 함수 
			
			smutil.callApi(page.apiParam);
		});
		//스캔 취소 버튼 클릭
		$('#disagress').click(function(){
			$('.mpopBox.img.cancel').bPopup().close();
		});
		//스캔 취소
		$(document).on("click",".btn.del2",function(){
			page.inv_noV.cancle = $(this).prev().text().replace(/\-/g,'');
		
			$('.mpopBox.img.cancel').bPopup();
		});
		
		
		//스캔 전송
		$('#sendP').on('click',function(){
			var count = $('.li.list').length;
			if(count==0 || smutil.isEmpty($('.li.list'))){
				LEMP.Window.alert({
					"_vMessage" : "전송할 송장 번호가  번호가 없습니다 ",
				});
				return false;
			}
			else{
				smutil.loadingOn();
				page.apiParam.param.baseUrl="/smapis/net/stfngScanTrsm";
				page.apiParam.param.callback="page.ScanSenCallback";
				page.apiParam.data.parameters={
						"smsz_mbag_no" : $('#moequi').val(),
						"scan_brsh_cd" : $('#inputJy').val(),
				};
				
		
				smutil.callApi(page.apiParam);
			}
			page.stfngScanCnt();
		});
		//스캔 전송 확인 클릭
		$('#scanSFi').click(function(){
			$('.mpopBox.send.pop1').bPopup().close();
		});
		
		
		
	},
	InputCallback : function(data){
		page.inv_noV.sign = data.inv_no;
		page.InputChange();
	},
	//스캔 콜백
	scanCallback : function(data){
		if(smutil.isEmpty($('#moequi').val())){
			LEMP.Window.alert({
				"_vMessage" : "운반장비 번호를 입력해주세요 ",
			});
			smutil.callTTS("0", "0", null, page.isBackground);
			return false;
		}else{
			page.inv_noV.sign = data.barcode;
			page.InputChange();
		}
	},
	
	
	//적입점소 입력 콜백
	InputCallback_J : function(data){
		smutil.loadingOn();
		
		page.codeJ = data.txtJy;
		//스캔리스트 api 호출
		page.apiParam.param.baseUrl="/smapis/net/stfngScanBrshChk";
		page.apiParam.param.callback="page.BrashCallback";
		page.apiParam.data.parameters={
				"scan_brsh_cd" : data.txtJy
		};
		// 공통 api호출 함수 
		
		smutil.callApi(page.apiParam);
		
	},
	//소형적입 적입점소조회 콜백
	BrashCallback : function(data){
		try {
			if(data.code ==="0000" && data.data_count!=0) {
					$('#inputJy').val(page.codeJ);
					LEMP.Window.alert({
						"_vMessage" : "입력 점소명은 "+data.data.list[0].scan_brsh_nm+" 입니다"
					});
					$("#moequi").attr('disabled',false);
					
			}else{
				LEMP.Window.alert({
					"_vMessage" : "올바르지 않은 점소코드 입니다 ",
				});
				return false;
			}
		} catch (e) {}
		finally{
			smutil.loadingOff();
		}
	},
	//운반장비 콜백
	Input_ECallback : function(data){
	
		$('#moequi').val(data.equim);
		page.sjycallback();
	},
	sjycallback : function(data){
		smutil.loadingOn();
		//스캔 리스트 
		page.apiParam.param.baseUrl = "/smapis/net/stfngScanList";				//api no
		page.apiParam.param.callback = "page.scanListCallback";				//callback methode
		page.apiParam.data = {"parameters" : {
									"scan_brsh_cd": $('#inputJy').val(),
									"smsz_mbag_no" : $('#moequi').val(),
				}
		}

		smutil.callApi(page.apiParam);
	},
	//스캔 리스트 콜백
	scanListCallback : function(data){
		try{
			// 리스트 초기화
//				$(".boxList").html('');
			var data_r={};
			if (smutil.apiResValidChk(data) && data.code === "0000") {
				var list = data.data.list;
				var array = new Array();
				_.forEach(list,function(v,i){
					var data = {
						"invNo":v.inv_no.replace(/([0-9]{4})([0-9]{4})([0-9]{4})/,"$1-$2-$3"),
						"invNoId" :v.inv_no
					};
					array.push(data);
				});
					
					data_r.list = array;
					//var code = data.data.list.inv_no.replace(/([0-9]{4})([0-9]{4})([0-9]{4})/,"$1-$2-$3");
					//handlebars template 불러오기
					//handlebars template pre 컴파일 
					//handlebars template에 binding할 data
					//var data_r={"list":[{"invNo":code, "invNoId" : data.inv_no}]}
					//생성된 태그에 binding한 템플릿 data를 출력
			} 
			var source = $("#COM0101_list_template").html();
			var template = Handlebars.compile(source);
			$(".boxList").html(template(data_r));
		}catch(e){}
		finally{
			smutil.loadingOff();
		}
	},
	InputChange : function(){
		var invNo = page.inv_noV.sign;
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
				scan_dtm = Current_date.LPToFormatDate("yyyymmddHHnnss");
//					var code=obj.val();
				//data.inv_no=obj.val();
				//data.scan_dtm=Current_date;
				// 송장번호 유효성 검증
				if (Number(invNo.substr(0,11))%7 == Number(invNo.substr(11,1))) {
					
					smutil.loadingOn();
					
					page.apiParam.param.baseUrl="/smapis/net/stfngScanRgst";
					page.apiParam.param.callback="page.ScanRgstCallback";
					page.apiParam.data.parameters={
						"scan_dtm" : scan_dtm,
						"scan_brsh_cd" : $('#inputJy').val(),
						"smsz_mbag_no" : $('#moequi').val(),
						"inv_no" : invNo
					};
					
					// 공통 api호출 함수 
					smutil.callApi(page.apiParam);
				}else {
					LEMP.Window.alert({
						"_sTitle" : "경고",
						"_vMessage" : "정상적인 바코드번호가 아닙니다."
					});
					//$("#invScan").val("");
					smutil.callTTS("0", "0", null, page.isBackground);
					return false;
				}
			}else {
				LEMP.Window.alert({
					"_sTitle" : "경고",
					"_vMessage" : "중복된 송장번호 입니다."
				});
				//$("#invScan").val("");
				smutil.callTTS("0", "0", null, page.isBackground);
				return false;
			}
		}else {
			LEMP.Window.alert({
				"_sTitle" : "경고",
				"_vMessage" : "정상적인 바코드번호가 아닙니다."
			});
			//$("#invScan").val("");
			smutil.callTTS("0", "0", null, page.isBackground);
			return false;
		}
	},

	ScanRgstCallback : function(data){
		var code = page.inv_noV.sign;
	
		
		try {
			if (smutil.apiResValidChk(data) && data.code === "0000") {
				var codeI = code.replace(/([0-9]{4})([0-9]{4})([0-9]{4})/,"$1-$2-$3");
				//handlebars template 불러오기
				$('#invScan').val(codeI);
				
				var source = $("#COM0101_list_template").html();
				//handlebars template pre 컴파일 
				var template = Handlebars.compile(source);
				//handlebars template에 binding할 data
				var data={"list":[{"invNo":codeI, "invNoId" : code}]}
				
				if ($(".boxList > li:eq(0)").attr("class")=="noList") {
					$(".boxList").empty();
				};
				
				//생성된 태그에 binding한 템플릿 data를 출력
				$(".boxList").append(template(data));
				smutil.callTTS("1", "0", null, page.isBackground);
			}else {
				LEMP.Window.toast({
					//"_sMessage" : "스캔 통신 에러",
					"_sMessage" : data.message,
					"_sDuration" : "short"
				});
				smutil.callTTS("0", "0", null, page.isBackground);
			}
		} catch (e) {}
		finally{
			smutil.loadingOff();
		}
	},
	ScanCclCallback : function(data){
		try {
			if (smutil.apiResValidChk(data) && 
					(data.code ==="0000" || data.code==="1000")) {
				
						$('#'+page.inv_noV.cancle).remove();
						if(page.inv_noV.cancle.replace(/([0-9]{4})([0-9]{4})([0-9]{4})/,"$1-$2-$3")
								==$('#invScan').val()){
							$('#invScan').val("");
						}
			}
		} catch (e) {}
		finally{
			smutil.loadingOff();
		}
	},
	//스캔 전송 콜백
	ScanSenCallback : function(data){
		try{
			if(smutil.apiResValidChk(data) && data.code ==="0000"){	
				var count = $('.li.list').length;
				$('.mpopBox.send.pop1').bPopup();
				$('#scanDataN').text("스캔된 데이터 "+count+"건 데이터 전송이 완료 되었습니다 ");
				$('#invScan').val("");
				$('.boxList').empty();
			}
		}catch(e){}
		finally{
			smutil.loadingOff();
		}
	},
	stfngScanCnt:function(){
		var Current_date = new Date();
		Current_date = Current_date.LPToFormatDate("yyyymmdd");
		
		smutil.loadingOn();
		page.apiParamInit();
		
		page.apiParam.param.baseUrl = "/smapis/net/stfngScanCnt";
		page.apiParam.param.callback = "page.stfngScanCntCallback";
		page.apiParam.data.parameters = {"base_ymd":Current_date};
		
		smutil.callApi(page.apiParam);
	},
	stfngScanCntCallback:function(res){
		try {
			if (smutil.apiResValidChk(res) && res.code==="0000") {
				var key = Object.keys(res.data.list[0])
				for (var i = 0; i < key.length; i++) {
					$("#"+key[i]+" > span").text(res.data.list[0][key[i]])
				}
			}
		} catch (e) {}
		finally{
			smutil.loadingOff();
		}
		
	}
}