var dataInfo;
var page = {
	info : {},
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
	init : function(data) {
//		if (!smutil.isEmpty(data.data.menuId)) {
//			$("#FRE0401").css("display","block");
//		}
		console.log(data.data);
		page.info = data.data;
		page.initInterface();
		page.searchData();
	},
	initInterface : function() {
		
		//마이크 버튼
		$("#micBtn").click(function(){
			page.callStt();
		});

		// ios 음성인식 완료버튼을 클릭한경우 
		$(".btn.gray3.m.w100p.b-close").click(function(){
			page.callSttIos();
		});
		
		$(document).on('click',"#freHandle > li > button",function(){
			
			var tel = $(this).prev().find('.telN').text();
			//전화번호 형식이 올바른지 검증
			var regCellPhone = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/;
			var regPhone = /^\d{2,3}-\d{3,4}-\d{4}$/;
			
			if(regCellPhone.test(tel)||regPhone.test(tel)){
				$("#phoneNumber").text(tel);
				$('.mpopBox.phone').bPopup();
			}else {
				LEMP.Window.alert({
					"_sTitle" : "알림",
					"_vMessage" : "전화번호 형식이 올바르지 않습니다."
				});
			};
			
		});
	
		//도착지 변경 click
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
				var popUrl = smutil.getMenuProp('FRE.FRE0303', 'url');
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
		 
		//x버튼
		$(document).on("click",".btn.closeW.paR",function(){
			LEMP.Window.close();
		});
		//취소버튼
		$(document).on("click","#btnCancel",function(){
			LEMP.Window.close();
		});
		//확인버튼
		$(document).on("click","#btnConfirm",function(){
			page.fnSave();
		});
		
		// 배달출발확정 버튼 'yes' 버튼 클릭
		$('#confirmYesBtn').click(function(e){
			// 배달출발 확정로직 시작
			page.dsttSave();
		});
		
		
		/* 공통 > 주소검색 */
		$("#rsrvAcperBadr").on('click', function(){
			var type = $(this).data("type");

			var popUrl = smutil.getMenuProp("COM.COM0801","url");
			LEMP.Window.open({
				"_sPagePath" : popUrl,
				"_oMessage" : {
					"param" : {
						"menu_id" : "FRE0303",
						"type" : type
					}
				}
			});
		});
		
		/* 공통 > 주소검색 */
		$(".addressSearch").on('click', function(){
			var type = $(this).data("type");
			
			var popUrl = smutil.getMenuProp("COM.COM0801","url");
			LEMP.Window.open({
				"_sPagePath" : popUrl,
				"_oMessage" : {
					"param" : {
						"menu_id" : "FRE0303",
						"type" : type
					}
				}
			});
		});
	},
	// ################### 주소 start
	// 주소 팝업 선택 후 callback
	com0801Callback : function(result){
		var data = result.param;
		var type = data.type;
		//adrSctCd 지번 J, 도로명 R
		$("#" + type + "Zipcd").val(data.zipcd);
		$("#" + type + "BldMgrNo").val(data.bldMgrNo);
		$("#" + type + "CldlBrshCd").val(data.dlvBrshCd);
		$("#" + type + "CldlBrshNm").val(data.dlvBrshNm);
		$("#" + type + "BasAreaCd").val(data.basAreaCd);
		$("#" + type + "DlvBrshNm").val(data.dlvBrshNm);
		$("#dlvBrshCd").val(data.dlvBrshCd);
		$("#dsttCd").val(data.dsttCd);
		

		if(data.adrSctCd == "J"){	//지번
			$("#" + type + "Badr").val(data.badr);
			$("#" + type + "Dadr").val(data.dadr);
		}else{
			$("#" + type + "Badr").val(data.rdnmBadr);
			$("#" + type + "Dadr").val(data.rdnmDadr);
		}
	},
	
	//도착지 정보 조회
	searchData : function(){
		smutil.loadingOn();
		var _this = this;
		
		_this.apiParam.param.baseUrl = "smapis/pacl/trcDest";			// api no
		_this.apiParam.param.callback = "page.freCallback";			// callback methode
		_this.apiParam.data.parameters.inv_no = page.info.inv_no.replace(/\-/g,'');
		
		smutil.callApi(_this.apiParam);
		
	},
	//도착지 정보 조회 콜백
	freCallback : function(res){
		console.log(res);
		dataInfo = res.data.list[0];
//		$("#inv_no").text(dataInfo.inv_no);
		$("#inv_no").text(page.info.inv_no);
		$("#acper_address").text(dataInfo.acperAddress);
		$("#updb_dlvsh").text(dataInfo.updbDlvshCd +', ' +dataInfo.updbDlvshNm);
		$("#updb_dstt_cd").text(dataInfo.updbDsttCd);
		
		try{
			//데이터가 있을시
			var keys = Object.keys(page.info.param);
			for (var i = 0; i < keys.length; i++) {
				if (!smutil.isEmpty(page.info.param[keys[i]])) {
					$("#"+keys[i]).text(page.info.param[keys[i]]);
				}
			}
			$("#inv_no").text(page.info.inv_no);
			
			if (smutil.apiResValidChk(res) && res.code === "0000" && res.data_count != 0) {
				var ymd;
				var tme;	
				var sAddress = page.info.param.snper_badr;
				var aAddress = page.info.param.acper_badr;
				
				if(!smutil.isEmpty(aAddress)){
					$('#acper_badr').text(aAddress);
				}
				if(!smutil.isEmpty(sAddress)){
					$('#snper_badr').text(sAddress);
				}
				
				var data_r = res.data.list;
				//스캔 시간을 형식에 맞게 변환
				_.forEach(res.data.list,function(val){
					ymd = val.scan_datetime.substring(0,4)+"/"+val.scan_datetime.substring(4,6)+"/"+val.scan_datetime.substring(6,8);
					tme = val.scan_datetime.substring(8,10)+":"+val.scan_datetime.substring(10,12)+":"+val.scan_datetime.substring(12,val.scan_datetime.length);
					val.scan_datetime = ymd;
					val.tmev = tme;
				});
				
				var source = $("#FRE0303_template").html();
				var template = Handlebars.compile(source);
				var itemList = template(res.data);
				
				$('#freHandle').html(itemList);
			}else{
				var	html = '<li><div class="NoBox"><p class="txt tc">조회된 결과가 없습니다</p></div></li>';
				$('#freNon').html(html);
			}
		}catch(e){}
		finally{
			smutil.loadingOff();
		}
	},
	// api 파라미터 초기화
	apiParamInit : function(){
		page.apiParam =  {
			id:"HTTP",			// 디바이스 콜 id
			param:{				// 디바이스가 알아야할 데이터
				task_id : "",										// 화면 ID 코드가 들어가기로함
				//position : {},									// 사용여부 미확정
				type : "",
				baseUrl : "",
				method : "POST",									// api 호출 형식(지정 안하면 'POST' 로 자동 셋팅)
				callback : "",										// api 호출후 callback function
				contentType : "application/json; charset=utf-8"
			},
			data:{"parameters" : {}}// api 통신용 파라메터
		};
	},
	//음성인식
	callStt : function(){
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
		
	},
	// ios 음성인식 완료로직
	callSttIos : function(){
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
	fnSave : function(){
		
		var dlvBrshCd = $("#dlvBrshCd").val();
		if (smutil.isEmpty(dlvBrshCd)) {
			LEMP.Window.alert({
				 "_sTitle" : "주소검색",
				 "_vMessage" : "변경될 배달점소코드가 없습니다.\n주소를 검색하여 상세주소를 입력해주세요."
			 });
			 return false;
		}
		$('#pop2Txt2').html('도착지를 변경 하시겠습니까?');
		$('.mpopBox.pop').bPopup();
		
	},
	// ################### 도착지 변경 저장
	dsttSave : function(){
		
		var _this = this;
		console.log(dataInfo);
//		console.log(dataInfo.acper);
		
		smutil.loadingOn();
		
		// 도착지변경 프로세스 진행, 모두 완료되면 이력에 insert 진행
		_this.apiParam.param.baseUrl = "smapis/pacl/savetmlauto";			// api no
		_this.apiParam.param.callback = "page.dsttSaveCallback";			// callback methode
		
		_this.apiParam.data = {
				"invNo" : page.info.inv_no.replace(/\-/g,'')
				 , "svcCd" : $('select[name=svcCd]').val() //서비스코드
	                , "dsttCd" : $('#dsttCd').val() //변경후도착지코드
	                , "jobCustCd" : dataInfo.jobCustCd //업무거래처 코드
	                , "picshCd" : dataInfo.updbPicshCd //집하점소 코드
	                , "dlvshCd" : $('#dlvBrshCd').val() //배달예정 점소 코드
	                , "usrId" : ''
	                , "dlvPlnEmpno" : '' //김창현 배달사원
	                , "pgmId" : "FRE0303"
	                , "creTypCd" : "D"
		};
		
		smutil.callApi(_this.apiParam);
		
	},
	
	// 도착지 변경 저장 콜백
	dsttSaveCallback : function(result){
		
		try{
			if(result.rstCd == "S") {
				
				page.apiParam.param.baseUrl = "smapis/pacl/adddstt";			// api no
				page.apiParam.param.callback = "page.dsttSaveLastCallback";			// callback methode
				
				page.apiParam.data = {
					"invNo" : page.info.inv_no.replace(/\-/g,'')
	                , "updbSvcCd" : dataInfo.updbSvcCd //변경전 서비스 코드
	                , "updbDlvshCd" : dataInfo.updbDlvshCd //변경전 점소 코드
	                , "updbDsttCd" : dataInfo.updbDsttCd //변경전 도착지 코드
	                , "updaSvcCd" : $('select[name=svcCd]').val() //변경후 서비스 코드
	                , "updaDlvshCd" : $('#dlvBrshCd').val() //변경후 점소 코드
	                , "updaDsttCd" : $('#dsttCd').val() //변경후 도착지 코드
	                , "empno" : dataInfo.dlvPlnEmpno //사원번호
	                , "rgstEmpno" : dataInfo.dlvPlnEmpno //사원번호
	                , "rgstBrshCd" : "" //소속점소코드
				};
				
				smutil.callApi(page.apiParam);
				
            } else if(resultTmlc.rstCd == "E") {
            	LEMP.Window.alert({
   				    "_sTitle" : "도착지 정보수정 저장",
   				    "_vMessage" : "변경될 배달점소코드가 없습니다.\n주소를 검색하여 상세주소를 입력해주세요."
   			 	});
                return false;
            }
		}
		catch(e){}
		finally{
			smutil.loadingOff();			// 로딩바 닫기
			page.apiParamInit();			// 파라메터 전역변수 초기화
		}
	},
	// 도착지 변경 저장 콜백
	dsttSaveLastCallback : function(result){
		if(smutil.apiResValidChk(result) && result.code == "0000") {
			LEMP.Window.alert({
			    "_sTitle" : "도착지 정보수정 저장",
			    "_vMessage" : result.message
		 	});
			
			var dlvBrshCd = $('#dlvBrshCd').val(); //변경된 배달점소
			var dlvBrshNm = $('#rsrvAcperDlvBrshNm').val(); //변경된 배달점소 이름
			var dsttCd = $('#dsttCd').val(); //변경된 도착지 코드
			
			$("#updb_dlvsh").text(dlvBrshCd + ', ' + dlvBrshNm);
			$("#updb_dstt_cd").text(dsttCd);
		}
	}
	// ################### 배달출발확정(전송) end
	
//	directInputCallback: function(res){
//		console.log(res);
//	}
}
