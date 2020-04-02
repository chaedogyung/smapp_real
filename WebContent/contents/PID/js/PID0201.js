var page = {
		
		tabCd : "b2b",						// B2B반품/점간, B2B개인
		codeAreaCd : "b2b",					// 위치 > b2b(반품/점간) b2b01(매장->개인),b2b02(개인->매장)
		shcnSchDtlFlag : "",				// 매장코드 상세조회 구분값
		b2bSnperData : null,				// B2B 보내는 매장 callback 데이터
		b2bAcperData : null,				// B2B 받는 매장 callback 데이터
		invNoInfo : [],						// 원송장 번호 정보
		b2c02SnData : [],					// B2C 개인->매장 보내는
		b2c02AcData : [],					// B2C 개인->매장 받는
		
		schType : null,						// 코드를 요청하는 타입
		schCust : null,						// 검색 거래처 코드/이름
		schBrnd : null,						// 검색 브랜드 코드/이름
		schShcn : null,						// 검색 매장 코드/이름
		
		b2bSnperRsphCd : null,				// 반품/점간 > 보내는 매장 권역코드(ex 01)
		b2bAcperRsphCd : null,				// 반품/점간 > 받는 매장 권역코드
		b2cSnper01RsphCd : null,			// 개인->매장 > 보내는 매장 권역코드(ex 01)
		
		
		// api 호출 기본 형식
		apiParam : {
			id:"HTTP",						// 디바이스 콜 id
			param:{							// 디바이스가 알아야할 데이터
				task_id : "",				// 화면 ID 코드가 들어가기로함
				//position : {},			// 사용여부 미확정 
				type : "",
				baseUrl : "",
				method : "POST",			// api 호출 형식(지정 안하면 'POST' 로 자동 셋팅)
				callback : "",				// api 호출후 callback function
				contentType : "application/json; charset=utf-8"
			},
			data:{"parameters" : {}}		// api 통신용 파라메터
		},
		
		init:function()
		{
			page.initEvent();			// 페이지 이벤트 등록
			page.initDpEvent();			// 화면 디스플레이 이벤트
		},
		
		// 페이지 이벤트 등록
		initEvent : function()
		{
			var _this = this;
			
			/* 최상단 탭 클릭 > B2B반품/점간, B2B 개인 > B2B반품/점간 사용*/
			$(".tabBtn").click(function(){
				page.tabCd = $(this).data('tabCd');		// 선택한 탭의 값 (b2b,b2c)
				var btnTab = $(".tabBtn");
				var btnObj;
				_.forEach(btnTab, function(obj, key) {
					btnObj = $(obj);
					var objTabCd = btnObj.data('tabCd');
					if(page.tabCd == objTabCd){
						btnObj.closest('li').addClass( 'on' );
						$("."+objTabCd+"Div").show();	//ex).b2bDiv,.b2cDiv
					}
					else{
						btnObj.closest('li').removeClass( 'on' );
						$("."+objTabCd+"Div").hide();
					}
				});
				
				if($(this).data('tabCd') == "b2b"){
					page.codeAreaCd = "b2b";
				}else{
					page.codeAreaCd = "b2c" + $("input[name=b2cSctCd]:checked").val();
				}
				
			});
			
			/* 반품/점간 체크 */
			$("input[name=b2bSctCd]").on('click', function(){
				page.b2bSctCdChk();
			});
			
			/* 개인/매장 체크 */
			$("input[name=b2cSctCd]").on('click', function(){
				page.b2cSctCdChk();
			});
			
			/* 개인/매장 > 원송장 번호 직접 입력 */
			$('#orgInvNo').on('click', function() {
				var popUrl = smutil.getMenuProp('COM.COM0102', 'url');
				LEMP.Window.open({
					"_sPagePath" : popUrl
				});
			});
			
			/* 개인/매장 > 원송장 번호 조회 */
			$('#orgInvNoSearch').on('click', function() {
				if(smutil.isEmpty($("#orgInvNo").val())){
					LEMP.Window.alert({
						"_sTitle" : "미입력",
						"_vMessage" : "원송장 번호를 입력해주세요."
					});
				}
				page.invNoInfoSearch();
			});
			
			/* 거래처, 브랜드, 매장코드 대문자로 변경 */
			$(".b2bCodeInitInfo input[type=text], .b2cCodeInitInfo input[type=text], #stsFareSctCd").on('keyup', function(){
				var thisVal = $(this).val();
				var upper = thisVal.toUpperCase();
				$(this).val(upper);
				$(this).css("color","red");
				
				// 상위코드 수정시 하위코드삭제
				var type = $(this).parent().data("type");
				page.removeLowCode(type,page.tabCd);
			});
			
			/* 공통 > 거래처 조회*/
			$(".custSch").on('click', function(){
				// 거래처코드 검색조건 2글자 이상
				if($("#" + page.codeAreaCd + "Cust").val().length < 2){
					LEMP.Window.alert({
						"_sTitle" : "알림",
						"_vMessage" : "거래처 코드를 두 자리이상 입력해주세요."
					});
					return false;
				}
				
				page.schCust = $("#" + page.codeAreaCd + "Cust").val();
				page.schBrnd = "";
				page.schShcn = "";
				
				page.validCodeSearch("Cust");
			});
			
			/* 공통 > 브랜드 조회*/
			$(".brndSch").on('click', function(){
				// 거래처코드 조회 후 검색 가능 
				if($("#" + page.codeAreaCd + "CustCode").val().length < 2){
					LEMP.Window.alert({
						"_sTitle" : "알림",
						"_vMessage" : "거래처 코드를 조회해 주세요."
					});
					return false;
				}
				
				page.schCust = $("#" + page.codeAreaCd + "CustCode").val();
				page.schBrnd = $("#" + page.codeAreaCd + "Brnd").val();
				page.schShcn = "";
				
				page.validCodeSearch("Brnd");
			});
			
			/* 공통 > 매장 조회*/
			$(".shcnSch").on('click', function(){
				// 거래처코드 조회 후 검색 가능 
				if($("#" + page.codeAreaCd + "CustCode").val().length < 2){
					LEMP.Window.alert({
						"_sTitle" : "알림",
						"_vMessage" : "거래처 코드를 조회해 주세요."
					});
					return false;
				}
				
				page.schCust = $("#" + page.codeAreaCd + "CustCode").val();
				page.schBrnd = $("#" + page.codeAreaCd + "Brnd").val();
				page.schShcn = $("#" + page.codeAreaCd + "Shcn").val();
				
				page.validCodeSearch("Shcn");
			});
			
			/* 반품 > 물류센터 코드 조회 */
			$(".b2bUstRtgSch").on('click', function(){
				// 거래처코드 조회 후 검색 가능 
				if($("#b2bBrndCode").val().length < 2){
					LEMP.Window.alert({
						"_sTitle" : "알림",
						"_vMessage" : "브랜드  코드를 조회해 주세요."
					});
					return false;
				}
				
				page.schCust = $("#b2bCustCode").val();
				page.schBrnd = $("#b2bBrndCode").val();
				page.schShcn = $("#ustRtgCustCd").val();
				page.validCodeSearch("ustRtg");
			});
			
			/* 반품 > 점간 코드 조회 */
			$(".b2bStsFareSch").on('click', function(){
				// 거래처코드 조회 후 검색 가능 
				if($("#b2bBrndCode").val().length < 2){
					LEMP.Window.alert({
						"_sTitle" : "알림",
						"_vMessage" : "브랜드  코드를 조회해 주세요."
					});
					return false;
				}
				
				page.schCust = $("#b2bCustCode").val();
				page.schBrnd = $("#b2bBrndCode").val();
				page.schShcn = $("#stsFareSctCd").val();
				page.validCodeSearch("stsFare");
			});
			
			/* 개인 > 주소검색 */
			$(".addrSrch").on('click', function(){
				var type = $(this).data("type");
				
				var popUrl = smutil.getMenuProp("COM.COM0801","url");
				LEMP.Window.open({
					"_sPagePath" : popUrl,
					"_oMessage" : {
						"param" : {
							"menu_id" : "PID0103",
							"type" : type
						}
					}
				});
			});
			
			/* 박스 타입, 운임 구분 변경시 */
			$(document).on("change","#b2bBoxTyp,#b2bFareSctCd,#b2cBoxTyp,#b2cFareSctCd",function(){
				page.selectedFare();
			});
			
			/* 공통 > 콤마 */
			$(document).on('keyup', '#b2bDlvFare, #b2cDlvFare', function(e){
				var tmps = parseInt($(this).val().replace(/[^0-9]/g, '')) || 0;
				
				var numberToComma = String(tmps).LPToCommaNumber();
				$(this).val(numberToComma);
			});
			
			/* 반품/점간 > 배송비 */
			$("#b2bDlvFare").change(function(){
				var dlfFare = parseInt($(this).val().replace(/[^0-9]/g, '')) || 0;
				var b2bDlvFare = page.b2bDlvFare;
				var b2bDlvFareToComma = String(b2bDlvFare).LPToCommaNumber();

				if(dlfFare < b2bDlvFare){
					LEMP.Window.alert({
						"_sTitle" : "알림",
						"_vMessage" : "최저 배송 단가보다 작은 금액을 입력하실 수 없습니다."
					});
					$(this).val(b2bDlvFareToComma);
					return false;	
				}
				
				if(dlfFare % 50 != 0){
					LEMP.Window.alert({
						"_sTitle" : "금액변경오류",
						"_vMessage" : "변경금액은 50원 단위로만\n변경 가능합니다."
					});
					$(this).val(b2bDlvFareToComma);
					return false;
				}
				
			});
			
			/* 개인 > 배송비 */
			$("#b2cDlvFare").change(function(){
				var dlfFare = parseInt($(this).val().replace(/[^0-9]/g, '')) || 0;
				var b2cDlvFare = page.b2cDlvFare;
				var b2cDlvFareToComma = String(b2cDlvFare).LPToCommaNumber();
				
				if(dlfFare < b2cDlvFare){
					LEMP.Window.alert({
						"_sTitle" : "알림",
						"_vMessage" : "최저 배송 단가보다 작은 금액을 입력하실 수 없습니다."
					});
					$(this).val(b2cDlvFareToComma);
					return false;	
				}
				
				if(dlfFare % 50 != 0){
					LEMP.Window.alert({
						"_sTitle" : "금액변경오류",
						"_vMessage" : "변경금액은 50원 단위로만\n변경 가능합니다."
					});
					$(this).val(b2cDlvFareToComma);
					return false;
				}
				
			});
			
			/* 공통 > 배송요청사항 팝업 */
			$(document).on("click","#b2bDlvMsg, #b2cDlvMsg",function(){
				var popUrl = smutil.getMenuProp("COM.COM0901","url");
				LEMP.Window.open({
					"_sPagePath" : popUrl,
					"_oMessage" : {
						"param" : {
							"typ_cd" : "SMAPP_DLV_MSG_CD",
							"rtn_etc" : page.tabCd
						}
					}
				});
			});
			
			/* 달력 집하일자 */
			$(document).on("click",".inCal",function(){
				var popUrl = smutil.getMenuProp("COM.COM0301","url");
				var limitDate = {
						"minDate" : 0
				}
				
				LEMP.Window.open({
					"_sPagePath" : popUrl,
					"_oMessage" : {
						"param" : limitDate
					}
				});
			});
			
			/* 동의하기 전문보기 */
			$(document).on("click",".agreeView",function(){
				var popUrl = smutil.getMenuProp("COM.COM1101","url");
				LEMP.Window.open({
					"_sPagePath" : popUrl,
					"_oMessage" : {
						"flag" : "02",	//개인정보활용동의
						"etc" : $(this).data("etc")
					}
				});
			});
			
			/* 공통 > 접수버튼 클릭시 */
			$(".confirmBtn").on('click', function(){
				if(page.codeAreaCd == "b2b"){
					page.addTrvRsrv();	// 반품/점간 접수
				}else if(page.codeAreaCd == "b2c01"){
					page.addTrvRsrvB2c01();		// 매장->개인 접수
				}else if(page.codeAreaCd == "b2c02"){
					page.addTrvRsrvB2c02();		// 개인->매장 접수
				}
			});
			
			/* box수량 > 플러스 마이너스 */
			page.plusMinus(".inNum .btn.minus",".inNum .btn.plus2",30,1,".inNum .valNum");
			
			/* 공통 > 휴대폰/회사번호 번호검색(하이픈'-' 자동입력) */
			$(".autoHypenPhone").keyup(function(){
				var phone = $(this).val();
				phone = page.autoHypenPhone(phone);
				$(this).val(phone);
			});
			
		},
		
		initDpEvent : function()
		{
			var _this = this;
			smutil.loadingOn();
			page.initDisplay();
			page.empSearch();
			smutil.loadingOff();
		},
		
		initDisplay : function()
		{			
			//시작일,종료일(처음 페이지 들어왔을때 input 태그가 빈상태)
			if($('#b2bPickYmd').val()==""){
				var today = page.getDate('today');
				$('#b2bPickYmd').val(today);
			}
			
			if($('#b2cPickYmd').val()==""){
				var today = page.getDate('today');
				$('#b2cPickYmd').val(today);
			}
		},
		
		// 반품/점간 체크
		b2bSctCdChk : function(){
			page.codeAreaCd = "b2b";
			if($("input[name=b2bSctCd]:checked").val() == "02"){ //02:반품, 03:점간
				$("#ustRtgCustCd").show();
				$("#stsFareSctCd").hide();
			}else{
				$("#ustRtgCustCd").hide();
				$("#stsFareSctCd").show();
			}
			
			// 받는 매장 정보, 집하일자, 운임정보, 상품/배송요청사항, 개인정보활용동의 초기화
			page.b2bAcperReset();
			
			if($("input[name=b2bSctCd]:checked").val() == "02" && $("#ustRtgCustCd").val() != ""){ //02:반품
				var code;
				if($("input[name=b2bSctCd]:checked").val() == "02"){ //02:반품, 03:점간
					code = $("#ustRtgCustCd").val();	// 반품 > 물류 센터 코드
				}else{
					code = $("#stsFareSctCd").val();	// 점간 > 매장코드
				}
				
				page.shcnSchDtlFlag = "b2bAcper";
				page.shcnDtlSearch(code);
			}
		},
		
		// 매장->개인 / 개인->매장  체크
		b2cSctCdChk : function(){
			if($("input[name=b2cSctCd]:checked").val() == "01"){ //01:매장->개인, 02:개인->매장
				page.codeAreaCd = "b2c01";
				$(".b2cArea01").show();
				$(".b2cArea02").hide();
				$("#b2cGdsNm").val("B2B매장발송건");
			}else{
				page.codeAreaCd = "b2c02";
				$(".b2cArea01").hide();
				$(".b2cArea02").show();
				$("#b2cGdsNm").val("B2B고객반품건");
			}
		},
		
		// ################### 집하점 정보 구분 조회 start
		// 집하점 정보 조회
		empSearch : function(){
			var _this = this;
			
			_this.apiParam.param.baseUrl = "/smapis/cmn/emp";				//api no
			_this.apiParam.param.callback = "page.empCallback";				//callback methode
			
			//공통 api호출 함수
			smutil.callApi(_this.apiParam);
		},
		
		// 집하점 정보 구분 callback
		empCallback : function(result){
			
			//조회 결과 데이터가 있으면 옵션 생성
			if(smutil.apiResValidChk(result) && result.code == "0000"){
				$("#b2bBrshCd").val(result.brsh_cd);
				$("#b2bBrshNm").val(result.brsh_nm);
				$("#b2c01BrshCd").val(result.brsh_cd);
				$("#b2c01BrshNm").val(result.brsh_nm);
			}
			
			page.apiParamInit();		// 파라메터 전역변수 초기화
		},
		// ################### 집하점 정보 구분 조회 end
		
		// ################### 원송장번호 start
		// 원송장 번호 스캔된 후 callback
		scanCallback : function(result){
			$("#orgInvNo").val(result.barcode);
		},
		
		// 원송장 번호 키패드 callback
		InputCallback : function(result){
			$("#orgInvNo").val(result.inv_no);
		},
		
		// 원송장번호 정보 조회
		invNoInfoSearch : function(){
			var _this = this;
			
			_this.apiParam.param.baseUrl = "smapis/pid/rsrvDtl";			// api no
			_this.apiParam.param.callback = "page.invNoInfoCallback";			// callback methode
			_this.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {
					"inv_no" : $("#orgInvNo").val(),
					"rsrv_mgr_no" : ""
				}
			};
			
			// 공통 api호출 함수 
			smutil.callApi(_this.apiParam);
		},
		invNoInfoCallback : function(result){
			try{
				
				if(result){
					data = result.data.list[0];
				}
				
				page.invNoInfo = data;
				
				//보내는 사람
				$("#b2c02BrshCd").val(data.dlvsh_cd);							// 집하점소코드
				$("#b2c02BrshNm").val(data.dlvsh_nm);							// 집하점명
				$("#b2c02SnperNm").val(data.acper_nm);
				$("#b2c02SnperTel").val(data.acper_tel);
				$("#b2c02SnperCpno").val(data.acper_cpno);
				$("#b2c02SnperBadr").val(data.acper_badr);
				$("#b2c02SnperDadr").val(data.acper_dadr);
				$("#b2c02SnperEtcAdr").val(data.acper_etc_adr);
				
				page.b2c02SnperRsphCd = data.snper_rsph_cd;						// 보내는 사람 권역 코드
				
				// 매장 코드로 조회
				page.schType = "Shcn";
				page.shcnSchDtlFlag = "b2c02Acper";
				page.shcnDtlSearch(data.snper_job_cust_cd);
				
				//받는 사람
				$("#b2c02DlvBrshCd").val(data.picsh_cd);			// 배달점소코드
				$("#b2c02DlvBrshNm").val(data.picsh_nm);			// 배달점명
				$("#b2c02AcperNm").val(data.snper_nm);
				$("#b2c02AcperTel").val(data.snper_tel);
				$("#b2c02AcperCpno").val(data.snper_cpno);
				$("#b2c02AcperBadr").val(data.snper_badr);
				$("#b2c02AcperDadr").val(data.snper_dadr);
				$("#b2c02AcperEtcAdr").val(data.snper_etc_adr);
				
				var data = page.invNoInfo;
				if(data.fare_sct_cd == "01"){		// 현불
					$("#b2cFareSctCd").val("02");
					$("#b2cDlvFare").val(String(data.summ_fare).LPToCommaNumber());
				}else if(data.fare_sct_cd == "02"){	//착불
					$("#b2cFareSctCd").val("01");
					$("#b2cDlvFare").val(String(data.summ_fare).LPToCommaNumber());
				}else if(data.fare_sct_cd == "03"){	//신용
					$("#b2cFareSctCd").val("03");
					$("#b2cDlvFare").val(0);
				}
				$("#b2cBoxTyp").val(data.box_mgnt);
			}
			catch(e){}
			finally{
				smutil.loadingOff();			// 로딩바 닫기
				page.apiParamInit();			// 파라메터 전역변수 초기화
			}
			
		},
		// ################### 원송장번호 end
		
		// ################### 코드 조회 start
		validCodeSearch : function(type){
			var _this = this;
			page.schType = type;
			
			if(type == "Cust"){
				_this.apiParam.param.baseUrl = "/smapis/pid/getTctB2bJobCustList";		// api no
				_this.apiParam.data = {													// api 통신용 파라메터
					"parameters" : {
						"srch_mgr_cust_nm" : page.schCust								// 거래처 코드/이름
					}
				};
			}else if(type == "Brnd"){
				_this.apiParam.param.baseUrl = "/smapis/pid/getTctB2bJobBrndList";
				_this.apiParam.data = {
					"parameters" : {
						"mgr_cust_cd" : page.schCust,									// 거래처 코드/이름
						"srch_brnd_nm" : page.schBrnd									// 브랜드 코드/이름
					}
				};
			}else if(type == "Shcn"){
				_this.apiParam.param.baseUrl = "/smapis/pid/getTctB2bJobShList";
				_this.apiParam.data = {
					"parameters" : {
						"b2b_sct_cd" : "",												// Y:전체검색 빈값:자기구역만검색
						"mgr_cust_cd" : page.schCust,									// 거래처 코드
						"brnd_cust_cd" : page.schBrnd,									// 브랜드 코드/이름
						"srch_shcn_nm" : page.schShcn									// 매장 코드/이름
					}
				};
			}else if(type == "stsFare"){
				_this.apiParam.param.baseUrl = "/smapis/pid/getTctB2bJobShList";
				_this.apiParam.data = {
					"parameters" : {
						"b2b_sct_cd" : "Y",												// Y:전체검색 빈값:자기구역만검색
						"mgr_cust_cd" : page.schCust,									// 거래처 코드
						"brnd_cust_cd" : page.schBrnd,									// 브랜드 코드/이름
						"srch_shcn_nm" : page.schShcn									// 매장 코드/이름
					}
				};
			}else if(type == "ustRtg"){
				_this.apiParam.param.baseUrl = "/smapis/pid/getTctB2bBrndRtnList";
				_this.apiParam.data = {
					"parameters" : {
						"mgr_cust_cd" : page.schCust,									// 거래처 코드
						"brnd_cust_cd" : page.schBrnd,									// 브랜드 코드/이름
						"srch_shcn_cd" : page.schShcn									// 물류센터 코드/이름
					}
				};
			}
			
			_this.apiParam.param.callback = "page.validCodeCallback";						// callback methode
			
			// 공통 api호출 함수 
			smutil.callApi(_this.apiParam);

		},
		validCodeCallback : function(result){
			try{
				
				if(smutil.apiResValidChk(result) && result.code == "0000"){
					
					// 코드와 일치하는 항목이 1개있는경우 팝업을 따로 띄우지않음
					if(result.data_count == 0){
						LEMP.Window.alert({
							"_sTitle" : "코드 조회 ",
							"_vMessage" : "코드 항목이 없습니다."
						});
						return false;
					}if(result.data_count == 1){
						var data = result.data.list[0]; //data = [];
						// 코드 셋팅
						page.codeSetting(data);
						
					}else{
						// 코드 조회 팝업
						var popUrl = smutil.getMenuProp("PID.PID0202","url");
						LEMP.Window.open({
							"_sPagePath" : popUrl,
							"_oMessage" : {
								"tabCd" : page.tabCd,
								"type" : page.schType,
								"account" : page.schCust,
								"brnd" : page.schBrnd,
								"shcn" : page.schShcn
							} 
						});
					}
					
				}
				
			}
			catch(e){}
			finally{
				smutil.loadingOff();			// 로딩바 닫기
				page.apiParamInit();			// 파라메터 전역변수 초기화
			}
		
		},
		
		// 코드 셋팅
		codeSetting : function(data){
			var area = page.codeAreaCd;
			var type = page.schType;
			
			if(type == "Cust"){
				$("#" + area + "Cust").css("color","black");
				$("#" + area + "Cust").val(data.mgr_cust_cd);
				$("#" + area + "CustCode").val(data.mgr_cust_cd);
				$("#" + area + "CustName").val(data.mgr_cust_nm);
				
			}else if(type == "Brnd"){
				$("#" + area + "Cust").css("color","black");
				$("#" + area + "Cust").val(data.mgr_cust_cd);
				$("#" + area + "CustCode").val(data.mgr_cust_cd);
				$("#" + area + "CustName").val(data.mgr_cust_nm);
				
				$("#" + area + "Brnd").css("color","black");
				$("#" + area + "Brnd").val(data.brnd_cust_cd);
				$("#" + area + "BrndCode").val(data.brnd_cust_cd);
				$("#" + area + "BrndName").val(data.brnd_cust_nm);
				
			}else if(type == "Shcn"){
				$("#" + area + "Brnd").css("color","black");
				$("#" + area + "Brnd").val(data.brnd_cust_cd);
				$("#" + area + "BrndCode").val(data.brnd_cust_cd);
				$("#" + area + "BrndName").val(data.brnd_cust_nm);
				
				$("#" + area + "Shcn").css("color","black");
				$("#" + area + "Shcn").val(data.shcn_cust_cd);
				$("#" + area + "ShcnCode").val(data.shcn_cust_cd);
				$("#" + area + "ShcnName").val(data.shcn_cust_nm);
				
				if(area == "b2c02"){	// 개인->매장일때만 받는사람 매장정보 불러옴
					page.shcnSchDtlFlag = area + "Acper";
				}else{
					page.shcnSchDtlFlag = area + "Snper";
				}
				
				page.shcnDtlSearch(data.shcn_cust_cd);
				
			}else if(type == "stsFare"){	// 점간
				$("#stsFareSctCd").css("color","black");
				$("#stsFareSctCd").val(data.shcn_cust_cd);
				page.shcnSchDtlFlag = "b2bAcper";
				page.shcnDtlSearch(data.shcn_cust_cd);
				
			}else if(type == "ustRtg"){		// 물류
				$("#ustRtgCustCd").val(data.shcn_cust_cd);
				page.shcnSchDtlFlag = "b2bAcper";
				page.shcnDtlSearch(data.shcn_cust_cd);
				
			}
		},
		
		// 거래처, 브랜드, 매장 팝업 callback
		pid0202Callback : function(result){
			
			try {
				var type = result.type;			// 조회 종류
				var code = result.code;			// 코드
				var name = result.name;			// 이름
				
				if(!smutil.isEmpty(type)){
					
					if(type == "Cust"){
						page.schCust = code;
					}else if(type == "Brnd"){
						page.schBrnd = code;
					}else{
						page.schShcn = code;
					}
					
					// 코드 재조회
					page.validCodeSearch(type);
				}
				else {
					LEMP.Window.alert({
						"_sTitle" : "팝업 선택 오류",
						"_vMessage" : "선택된 항목이 없습니다."
					});
					
					return false;
				}
			}
			catch (e){} 
			finally{
				page.apiParamInit();			// 파라메터 전역변수 초기화
			}
			
		},
		
		// 상위코드 수정시 하위코드삭제
		removeLowCode : function(type,area){
			if(type == "Cust"){
				$("#" + area + "Brnd").val("");
				$("#" + area + "BrndCode").val("");
				$("#" + area + "BrndName").val("");
				$("#" + area + "Shcn").val("");
				$("#" + area + "ShcnCode").val("");
				$("#" + area + "ShcnName").val("");
			}else if(type == "Brnd"){
				$("#" + area + "Shcn").val("");
				$("#" + area + "ShcnCode").val("");
				$("#" + area + "ShcnName").val("");
			}
		},
		
		// ################### 코드 조회 end
		
		// ################### 코드로 상세내용 조회 start
		shcnDtlSearch : function(code){
			
			if(smutil.isEmpty(code)){
				LEMP.Window.alert({
					"_sTitle" : "코드 입력 오류",
					"_vMessage" : "코드를 입력 후 조회해주세요."
				});
				return false;
			}
			
			var _this = this;
			_this.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {
					"shcn_cust_cd" : code
				}
			};
			_this.apiParam.param.baseUrl = "/smapis/pid/getTctB2bJobShDtl";			// api no
			_this.apiParam.param.callback = "page.shcnDtlCallback";			// callback methode
			
			// 공통 api호출 함수 
			smutil.callApi(_this.apiParam);
			
		},
		// 상세내용 callback
		shcnDtlCallback : function(result){
			try{
				if(smutil.apiResValidChk(result) && result.code == "0000"){
					var data = result;
					
					if(page.shcnSchDtlFlag == "b2bSnper"){						// B2B 보내는 매장
						page.b2bSnperData = data;
						page.b2bSnperRsphCd = data.rsph_cd;					// 보내는 사람 권역코드(2)
						
						$("#b2bSnperCust").val(data.mgr_cust_nm);				// 관리거래처명
						$("#b2bSnperBrnd").val(data.brnd_job_cust_nm);			// 브랜드거래처명
						$("#b2bSnperShcn").val(data.shcn_cust_nm);				// 매장거래처명
						$("#b2bSnperBadr").val(data.pick_badr);					// 보내는 사람 기본 주소
						$("#b2bSnperDadr").val(data.pick_dadr);					// 보내는 사람 상세 주소

						$("#b2bFareSctCd").val(data.fare_sct_cd);				// 운임구분(3)
						$("#ustRtgCustCd").val(data.ust_rtg_cust_cd);			// 반품 > 출고반품거래처코드(H36931)
						
					}else if(page.shcnSchDtlFlag == "b2bAcper"){				// B2B 받는 매장
						page.b2bAcperData = data;
						page.b2bAcperRsphCd = data.rsph_cd;						// 권역코드
						
						$("#b2bDlvPlnBrshCd").val(data.picsh_cd);				// 배달 예정 점소코드
						$("#b2bDlvPlnBrshNm").val(data.picsh_nm);				// 배달 예정 점소명
						$("#b2bAcperCust").val(data.mgr_cust_nm);				// 관리거래처명
						$("#b2bAcperBrnd").val(data.brnd_job_cust_nm);			// 브랜드거래처명
						$("#b2bAcperShcn").val(data.shcn_cust_nm);				// 매장거래처명
						$("#b2bAcperBadr").val(data.pick_badr);					// 받는 사람 기본 주소
						$("#b2bAcperDadr").val(data.pick_dadr);					// 받는 사람 상세 주소
						
					}else if(page.shcnSchDtlFlag == "b2c01Snper"){				// B2C 매장->개인 보내는 매장
						page.b2c01SnperData = data;
						page.b2cSnper01RsphCd = data.rsph_cd;					// 보내는 사람 권역코드(2)
						
						$("#b2c01SnperNm").val(data.shcn_cust_nm);				// 보내는 사람 이름
						$("#b2c01SnperTel").val(data.pick_tel);					// 보내는 사람 전화번호
						$("#b2c01SnperCpno").val("");							// 보내는 사람 핸드폰번호
						$("#b2c01SnperBadr").val(data.pick_badr);				// 보내는 사람 기본 주소
						$("#b2c01SnperDadr").val(data.pick_dadr);				// 보내는 사람 상세 주소
						
						$("#b2cFareSctCd").val(data.fare_sct_cd);				// 운임구분(3)
						
					}else if(page.shcnSchDtlFlag == "b2c02Acper"){				// B2C 개인->매장 받는매장
						page.b2c02AcData = data;
						page.b2c02AcperRsphCd = data.rsph_cd;					// 받는 사람 권역코드(2)
						
						$("#b2c02DlvBrshCd").val(data.picsh_cd);				// 배달 예정 점소코드
						$("#b2c02DlvBrshNm").val(data.picsh_nm);				// 배달 예정 점소명
						
						$("#b2c02Cust").css("color","black");
						$("#b2c02Cust").val(data.mgr_cust_cd);
						$("#b2c02CustCode").val(data.mgr_cust_cd);
						$("#b2c02CustName").val(data.mgr_cust_nm);
						$("#b2c02Brnd").css("color","black");
						$("#b2c02Brnd").val(data.brnd_job_cust_cd);
						$("#b2c02BrndCode").val(data.brnd_job_cust_cd);
						$("#b2c02BrndName").val(data.brnd_job_cust_nm);
						$("#b2c02Shcn").css("color","black");
						$("#b2c02Shcn").val(data.shcn_cust_cd);
						$("#b2c02ShcnCode").val(data.shcn_cust_cd);
						$("#b2c02ShcnName").val(data.shcn_cust_nm);
						
						$("#b2c02AcperNm").val(data.shcn_cust_nm);				// 매장명
						$("#b2c02AcperTel").val(data.pick_tel);					// 전화번호
						$("#b2c02AcperBadr").val(data.pick_badr);				// 기본 주소
						$("#b2c02AcperDadr").val(data.pick_dadr);				// 상세 주소
						$("#b2c02AcperEtcAdr").val(data.pick_etc_adr);			// 기타 주소
					}

					// 배송비 배열 정리
					var objFare = page.setFare(data);
					
					if(page.shcnSchDtlFlag == "b2bSnper"){		// B2B 보내는 매장
						page.arrB2bSnperFare = objFare;
						
						// 반품일 경우 물류센터코드로 받는사람 정보 조회
						if($("input[name=b2bSctCd]:checked").val() == "02"){
							page.shcnSchDtlFlag = "b2bAcper";
							var code = $("#ustRtgCustCd").val();
							page.shcnDtlSearch(code);
						}
						
					}else if(page.shcnSchDtlFlag == "b2bAcper"){	// B2B 받는 매장
						page.arrB2bAcperFare = objFare;
					}else if(page.shcnSchDtlFlag == "b2c01Snper"){	// B2C 매장->개인 보내는 매장
						page.arrB2c01SnperFare = objFare;
					}else if(page.shcnSchDtlFlag == "b2c02Acper"){	// B2C 개인->매장 받는 매장
						page.arrB2c02AcperFare = objFare;
					}
					
					// 운임정보 > 수량구분, 배송단가 셋팅
					page.settingFare();
					
				}
			}catch(e){}
			finally{
				smutil.loadingOff();			// 로딩바 닫기
				page.apiParamInit();			// 파라메터 전역변수 초기화
			}
		},
		
		// 배송비 배열 정리
		setFare : function(data){
			
			var objFare = new Object();		
			var arrA = new Object();					
			arrA.jeju_cnco = data.a_jeju_cnco; 				// Box Type A 제주연계비(3000)
			arrA.jeju_rsph_uprc = data.a_jeju_rsph_uprc; 	// Box Type A 제주권역단가(2310)
			arrA.oth_rsph_uprc = data.a_oth_rsph_uprc; 		// Box Type A 타권역단가(2310)
			arrA.same_rsph_uprc = data.a_same_rsph_uprc; 	// Box Type A 동일권역단가(0)
			arrA.svc_cd = data.a_svc_cd; 					// Box Type A 서비스코드(1)

			var arrB = new Object();
			arrB.jeju_cnco = data.b_jeju_cnco; 				// Box Type B 제주연계비(3000)
			arrB.jeju_rsph_uprc = data.b_jeju_rsph_uprc; 	// Box Type B 제주권역단가(2310)
			arrB.oth_rsph_uprc = data.b_oth_rsph_uprc; 		// Box Type B 타권역단가(2310)
			arrB.same_rsph_uprc = data.b_same_rsph_uprc; 	// Box Type B 동일권역단가(2310)
			arrB.svc_cd = data.b_svc_cd; 					// Box Type B 서비스코드(1)

			var arrC = new Object();
			arrC.jeju_cnco = data.c_jeju_cnco; 				// Box Type C 제주연계비(3000)
			arrC.jeju_rsph_uprc = data.c_jeju_rsph_uprc; 	// Box Type C 제주권역단가(0)
			arrC.oth_rsph_uprc = data.c_oth_rsph_uprc; 		// Box Type C 타권역단가(2310)
			arrC.same_rsph_uprc = data.c_same_rsph_uprc; 	// Box Type C 동일권역단가(2310)
			arrC.svc_cd = data.c_svc_cd; 					// Box Type C 서비스코드(1)

			var arrD = new Object();
			arrD.jeju_cnco = data.d_jeju_cnco; 				// Box Type D 제주연계비(0)
			arrD.jeju_rsph_uprc = data.d_jeju_rsph_uprc; 	// Box Type D 제주권역단가(0)
			arrD.oth_rsph_uprc = data.d_oth_rsph_uprc; 		// Box Type D 타권역단가(0)
			arrD.same_rsph_uprc = data.d_same_rsph_uprc; 	// Box Type D 동일권역단가(0)
			arrD.svc_cd = data.d_svc_cd; 					// Box Type D 서비스코드(null)

			var arrE = new Object();
			arrE.jeju_cnco = data.e_jeju_cnco; 				// Box Type E 제주연계비(0)
			arrE.jeju_rsph_uprc = data.e_jeju_rsph_uprc; 	// Box Type E 제주권역단가(0)
			arrE.oth_rsph_uprc = data.e_oth_rsph_uprc; 		// Box Type E 타권역단가(0)
			arrE.same_rsph_uprc = data.e_same_rsph_uprc; 	// Box Type E 동일권역단가(0)
			arrE.svc_cd = data.e_svc_cd; 					// Box Type E 서비스코드(null)

			var arrF = new Object();
			arrF.jeju_cnco = data.f_jeju_cnco; 				// Box Type F 제주연계비(0)
			arrF.jeju_rsph_uprc = data.f_jeju_rsph_uprc; 	// Box Type F 제주권역단가(0)
			arrF.oth_rsph_uprc = data.f_oth_rsph_uprc; 		// Box Type F 타권역단가(0)
			arrF.same_rsph_uprc = data.f_same_rsph_uprc; 	// Box Type F 동일권역단가(0)
			arrF.svc_cd = data.f_svc_cd; 					// Box Type F 서비스코드(null)
			
			objFare.A = arrA;
			objFare.B = arrB;
			objFare.C = arrC;
			objFare.D = arrD;
			objFare.E = arrE;
			objFare.F = arrF;
			
			return objFare;
		},
		// ################### 코드로 상세내용 조회 end
		
		// ################### 운임 정보 조회 end
		
		// box type 셋팅
		settingFare : function(){
			var snperRsphCd = null;
			var acperRsphCd = null;
			var arrFare = null;
			var area = page.codeAreaCd;
			if(area == "b2b"){
				snperRsphCd = page.b2bSnperRsphCd;
				acperRsphCd = page.b2bAcperRsphCd;
				arrFare = page.arrB2bSnperFare;
			}else if(area == "b2c01"){
				snperRsphCd = page.b2cSnper01RsphCd;
				acperRsphCd = page.b2c01AcperRsphCd;
				arrFare = page.arrB2c01SnperFare;
			}else if(area == "b2c02"){
				snperRsphCd = page.b2c02SnperRsphCd;
				acperRsphCd = page.b2c02AcperRsphCd;
				arrFare = page.arrB2c02AcperFare;
			}
			
			var tab = page.tabCd;
			if(snperRsphCd == null || acperRsphCd == null){
				$("#" + tab + "BoxTyp").attr( 'disabled', true );
				$("#" + tab + "FareSctCd").attr( 'disabled', true );
				$("#" + tab + "DlvFare").attr( 'disabled', true );
				return false;
			}else{
				//전부 삭제
				$("#" + tab + "BoxTyp option").remove();
				
				$.each(arrFare,function(item, index){
					if(arrFare[item]["svc_cd"] != null){
						var option = $("<option value='" + item + "'>" + item + " Type</option>");
						$("#" + tab + "BoxTyp").append(option);
					}
				});
				
				$("#" + tab + "BoxTyp").attr( 'disabled', false );
				$("#" + tab + "FareSctCd").attr( 'disabled', false );
				$("#" + tab + "DlvFare").attr( 'disabled', false );
				
				page.selectedFare();	//선택값으로 단가 셋팅하기
			}
		},
		
		// 박스타입, 운임구분 선택시
		selectedFare : function(){
			var snperRsphCd = null;
			var acperRsphCd = null;
			var arrFare = null;
			var area = page.codeAreaCd;
			var tab = page.tabCd;
			
			if(area == "b2b"){
				snperRsphCd = page.b2bSnperRsphCd;
				acperRsphCd = page.b2bAcperRsphCd;
				arrFare = page.arrB2bSnperFare;
			}else if(area == "b2c01"){
				snperRsphCd = page.b2cSnper01RsphCd;
				acperRsphCd = page.b2c01AcperRsphCd;
				arrFare = page.arrB2c01SnperFare;
			}else if(area == "b2c02"){
				snperRsphCd = page.b2c02SnperRsphCd;
				acperRsphCd = page.b2c02AcperRsphCd;
				arrFare = page.arrB2c02AcperFare;
			}
			
			var bscFare = 0;		// 기본운임 (제주권역단가 or 타권역단가 or 동일권역단가)
			var jejuCnco = 0;		// 제주 연계비
			var money = 0;
			var svcCd;
			
			if($("#" + tab + "FareSctCd").val() == "03"){	// 신용일 경우 배송단가 0
				$("#" + tab + "DlvFare").attr( 'disabled', true );
			}else{
				var typ = $("#" + tab + "BoxTyp").val();
				if(snperRsphCd == acperRsphCd){	// 같으면 동일권 (강원==강원 ,제주==제주)
					bscFare = arrFare[typ]["same_rsph_uprc"];	// 동일권역단가
					jejuCnco = 0;
				}else if(snperRsphCd == "06" || acperRsphCd == "06"){	// 둘중 하나라도 제주건이면 제주건 (강원==제주,제주==서울)
					bscFare = arrFare[typ]["jeju_rsph_uprc"];	// 제주권역단가
					jejuCnco = arrFare[typ]["jeju_cnco"];		// 제주연계비
				}else{	// 타구역
					bscFare = arrFare[typ]["oth_rsph_uprc"];	// 타권역단가
					jejuCnco = 0;
				}
				
				money = bscFare + jejuCnco;
				money = (money < 3000)?3000:money;	// 최저 3000
				money = page.increments50(money);	// 50원 단위 올림
				svcCd = arrFare[typ]["svc_cd"];	//서비스코드
					
				$("#" + tab + "DlvFare").attr( 'disabled', false );
				
			}
			if(tab == "b2b"){
				page.b2bRsrvSctCd = svcCd;
				page.b2bBscFare = bscFare;
				page.b2bJejuCnco = jejuCnco;
				page.b2bDlvFare = money;
				$("#b2bDlvFare").val(String(money).LPToCommaNumber());
			}else{
				page.b2cRsrvSctCd = svcCd;
				page.b2cBscFare = bscFare;
				page.b2cJejuCnco = jejuCnco;
				page.b2cDlvFare = money;
				$("#b2cDlvFare").val(String(money).LPToCommaNumber());
			}
			
		},
		// ################### 운임정보  end
		
		
		// ################### 배송요청사항  start
		// 상품 분류, 배송요청사항 팝업 선택 후 callback
		com0901Callback : function(result){
			
			try {
				
				var typ_cd = result.typ_cd;				// 구분코드
				var rtn_etc = result.rtn_etc;			// 기타리턴값(b2b,b2c)
				var dtl_cd = result.dtl_cd;				// 상세코드 (상품대분류코드)
				var dtl_cd_nm = result.dtl_cd_nm;		// 상세코드명 (상품분류명)				
				
				if(!smutil.isEmpty(dtl_cd)){
					if(typ_cd == "SMAPP_DLV_MSG_CD"){	// 배송요청사항
						if(rtn_etc == "b2b"){
							$("#b2bDlvMsgCont").val(dtl_cd_nm);
							$("#b2bDlvMsgContText").text(dtl_cd_nm);
						}else if(rtn_etc == "b2c"){
							$("#b2cDlvMsgCont").val(dtl_cd_nm);
							$("#b2cDlvMsgContText").text(dtl_cd_nm);
						}
					}
				}
				else {
					LEMP.Window.alert({
						"_sTitle" : "배송요청사항 오류",
						"_vMessage" : "선택된 요청사항이 없습니다."
					});
					
					return false;
				}
			}
			catch (e){} 
			finally{
				page.apiParamInit();			// 파라메터 전역변수 초기화
			}
			
		},
		// ################### 배송요청사항  end
		
		// ################### 주소 start
		// 주소 팝업 선택 후 callback
		com0801Callback : function(result){
			var data = result.param;
			var type = data.type;
			
			if(type == "b2c01Acper"){							// B2B : 매장->개인 받는사람
				page.b2c01AcperAddrInfo = data;					// 주소 데이터
				page.b2c01AcperRsphCd = data.rsphCd;			// 권역코드
				$("#b2c01DlvBrshCd").val(data.dlvBrshCd); 		// 배달점 코드
				$("#b2c01DlvBrshNm").val(data.dlvBrshNm); 		// 배달점명
			}else if(type == "b2c02Snper"){						// B2C : 개인->매장 보내는사람
				page.b2c02SnperAddrInfo = data;					// 주소 데이터
				page.b2c02SnperRsphCd = data.rsphCd;			// 권역코드
				$("#b2c02BrshCd").val(data.dlvBrshCd); 			// 집하점 코드
				$("#b2c02BrshNm").val(data.dlvBrshNm); 			// 집하점명
			}else if(type == "b2c02Acper"){						// B2C : 개인->매장 받는사람
				page.b2c02AcperAddrInfo = data;					// 주소 데이터
				page.b2c02AcperRsphCd = data.rsphCd;			// 권역코드
				$("#b2c02DlvBrshCd").val(data.dlvBrshCd); 		// 배달점 코드
				$("#b2c02DlvBrshNm").val(data.dlvBrshNm); 		// 배달점명
			}
			
			if(data.adrSctCd == "J"){	//지번
				$("#" + type + "Badr").val(data.badr);		// 지번기본주소
				$("#" + type + "Dadr").val(data.dadr);		// 지번상세주소
			}else{
				$("#" + type + "Badr").val(data.rdnmBadr);	// 도로명기본주소
				$("#" + type + "Dadr").val(data.rdnmDadr);	// 도로명상세주소
			}
			
			page.settingFare();
			
		},
		// ################### 주소 end
		
		// ################### B2B 반품/점간 접수 start
		// B2B 반품/점간 접수
		addTrvRsrv : function(){
			var _this = this;
			
			if($("#b2bShcnCode").val() == ""){
				LEMP.Window.alert({
					"_sTitle" : "매장코드 오류",
					"_vMessage" : "매장을 조회해주세요"
				});
				return false;
			}
			
			if($("#b2bSnperShcn").val() == ""){
				LEMP.Window.alert({
					"_sTitle" : "미입력",
					"_vMessage" : "보내는 매장 정보가 없습니다"
				});
				return false;
			}
			
			if($("#b2bAcperShcn").val() == ""){
				LEMP.Window.alert({
					"_sTitle" : "미입력",
					"_vMessage" : "받는 매장 정보가 없습니다"
				});
				return false;
			}
			
			if($("#b2bPickYmd").val() == ""){
				LEMP.Window.alert({
					"_sTitle" : "미입력",
					"_vMessage" : "집하일자를 선택해주세요"
				});
				return false;
			}
			
			if($("#b2bBoxTyp").val() == ""){
				LEMP.Window.alert({
					"_sTitle" : "미입력",
					"_vMessage" : "BOX TYPE을 선택해주세요"
				});
				return false;
			}
			
			if($("#b2bGdsNm").val() == ""){
				LEMP.Window.alert({
					"_sTitle" : "미입력",
					"_vMessage" : "상품명을 입력해주세요"
				});
				return false;
			}
			
			if($("#b2bDlvMsgCont").val() == ""){
				LEMP.Window.alert({
					"_sTitle" : "미입력",
					"_vMessage" : "배송요청사항을 입력해주세요"
				});
				return false;
			}
			
			//개인정보 활용 동의
			if($("#b2bAgree").is(":checked") == false){
				LEMP.Window.alert({
					"_sTitle" : "개인정보 활용 동의",
					"_vMessage" : "개인정보활용에 동의해주세요."
				});
				$("#b2bAgree").focus();
				return false;
			}
			
			
			var snData = page.b2bSnperData;
			var acData = page.b2bAcperData;
			var b2bSctCd = $("input[name=b2bSctCd]:checked").val();			// 출고반품구분코드
			var b2bPickYmd = page.replaceAll($("#b2bPickYmd").val(),"."); 	// 집하일자 (20200117)
			var b2bDlvFare = $("#b2bDlvFare").val().replace(/[^0-9]/g, '') || "0";	// 배달운임
			
			_this.apiParam.param.baseUrl = "smapis/pid/addTrvRsrv";			// api no
			_this.apiParam.param.callback = "page.addTrvRsrvCallback";		// callback methode
			_this.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {
					"ustRtgSctCd" : "01",									// 출고반품 구분코드 (01:고정값)
					"b2bSctCd" : b2bSctCd,									// B2B 구분코드 (반품:02 , 점간:03)
					
					"pickEmpno" : snData.pick_empno,							// 집하사원번호
					"picshCd" : snData.picsh_cd,								// 집하점소코드
					"picshNm" : snData.picsh_nm,								// 집하점소명
					
					"mgrCustCd" : snData.mgr_cust_cd,						// 관리거래처코드
					"mgrCustNm" : snData.mgr_cust_nm,						// 관리거래처명
					"brndJobCustCd" : snData.brnd_job_cust_cd,				// 브랜드 거래처코드
					"brndJobCustNm" : snData.brnd_job_cust_nm,				// 브랜드 거래처명
					"brndCd" : snData.brnd_cd,								// 브랜드코드
					"jobCustCd" : snData.shcn_cust_cd,						// 거래처코드
					
					"snperJobCustCd" : snData.shcn_cust_cd,					// 보내는 매장 거래처코드
					"snperJobCustNm" : snData.shcn_cust_nm,					// 보내는 매장 거래처명
					"snperCorpMgrCd" : snData.corp_mgr_cd,					// 보내는 매장 업체관리코드
					"snperCustMapiCd" : snData.cust_mapi_cd,					// 보내는 매장 거래처 매핑코드

					"snperTel" : snData.pick_tel,							// 보내는 사람 전화번호
					"snperCpno" : null,										// 보내는 사람 핸드폰번호
					"snperBasAreaCd" : snData.pick_bas_area_cd,				// 보내는 사람 기초 구역 코드
					"snperZipcd" : snData.pick_zipcd,						// 보내는 사람 우편번호
					"snperBldMgrNo" : snData.pick_bld_mgr_no,				// 보내는 사람 건물관리번호
					"snperPadr" : snData.pick_badr + snData.pick_dadr,		// 보내는 사람 주소
					"snperBadr" : snData.pick_badr,							// 보내는 사람 기본 주소
					"snperDadr" : snData.pick_dadr,							// 보내는 사람 상세 주소
					"snperEtcAdr" : snData.pick_etc_adr,						// 보내는 사람 기타주소
					"snperFadr" : "",										// 보내는 사람 지번주소
					"snperRdnmFadr" : smutil.nullToValue(snData.pick_rdnm_badr,"") + " " 
									+ smutil.nullToValue(snData.pick_rdnm_dadr,""),	// 보내는 사람 도로명 주소
					
					"dlvPlnEmpno" : acData.pick_empno,						// 배달 예정 사원번호
					"dlvPlnBrshCd" : acData.picsh_cd,						// 배달 예정 점소코드
					"dlvPlnBrshNm" : acData.picsh_nm,						// 배달 예정 점소명

					"acperJobCustCd" : acData.shcn_cust_cd,					// 받는 사람 거래처코드
					"acperJobCustNm" : acData.shcn_cust_nm,					// 받는 사람 거래처명
					"acperCorpMgrCd" : acData.corp_mgr_cd,					// 받는 매장 업체관리코드
					"acperCustMapiCd" :acData.cust_mapi_cd,					// 받는 매장 거래처 매핑코드
					
					"acperTel" : acData.pick_tel,							// 받는 사람 전화번호
					"acperCpno" : null,										// 받는 사람 휴대폰번호
					"acperBasAreaCd" : acData.pick_bas_area_cd,				// 받는 사람 기초구역코드
					"acperZipcd" : acData.pick_zipcd,						// 받는 사람 우편번호
					"acperBldMgrNo" : acData.pick_bld_mgr_no,				// 받는 사람 건물관리번호
					"acperPadr" : acData.pick_badr + acData.pick_dadr,		// 받는 사람 주소
					"acperBadr" : acData.pick_badr,							// 받는 사람 기본주소
					"acperDadr" : acData.pick_dadr,							// 받는 사람 상세주소
					"acperEtcAdr" : acData.pick_etc_adr,					// 받는 사람 기타주소
					"acperFadr" : "",										// 받는 사람 지번주소
					"acperRdnmFadr" : smutil.nullToValue(acData.pick_rdnm_badr,"") + " " 
									+ smutil.nullToValue(acData.pick_rdnm_dadr,""),	// 받는 사람 도로명주소
					
					"pickYmd" : b2bPickYmd,									// 집하일자 (20200117)
					"tyQty" : $("#b2bBoxTyp").val(),						// 박스타입 (A)
					"qty" : $("#b2bBoxQty").val(),							// 박스수량 (1)
					"dlvFare" : b2bDlvFare,									// 배달운임 (5000)
					"fareSctCd" : $("#b2bFareSctCd").val(),					// 운임구분코드 (01:현불, 02:착불, 03:신용)
					"gdsNm" : $("#b2bGdsNm").val(),							// 상품명
					"dlvMsgCont" : $("#b2bDlvMsgCont").val(),				// 배송 메세지
					
					"bscFare" : String(page.b2bBscFare),					// 기본운임 (제주권역단가 or 타권역단가 or 동일권역단가)
					"etcFare" : "0.0",										// 기타운임 (사용안함)
					"clltFare" : "0.0",										// 착불운임 (사용안함)
					"jejuCnco" : String(page.b2bJejuCnco),					// 제주 연계비
					"pickPltn" : String(snData.pick_pltg),					// 집하도선료
					"dlvPltn" : String(snData.dlv_pltg),					// 배달도선료
					"pickRp" : "0.0",										// 집하연계비 (사용안함)
					"dlvRp" : "0.0",										// 배달연계비 (사용안함)
					"pickTlgt" : "0.0",										// 집하 톨게이트비 (사용안함)
					"dlvTlgt" : "0.0",										// 배달 톨게이트비 (사용안함)
					"etcFare1" : "0.0",										// 기타운임1   (사용안함)
					"summFare" : b2bDlvFare,								// 합계운임
					"rowStatus" : "C",										// 상태값 (C:고정값)
					"prsn_info_agrm_yn" : "Y"								// 개인정보 활용동의 체크 여부
				}
			};
			
			// 공통 api호출 함수 
			smutil.callApi(_this.apiParam);
		},
		// B2B 반품/점간 접수 callback
		addTrvRsrvCallback : function(result){
			
			if(smutil.apiResValidChk(result) && result.code == "0000"){
				LEMP.Window.alert({
					"_sTitle" : "B2B 접수",
					"_vMessage" : "접수되었습니다."
				});
				
				if($("#b2bSnperSave").is(":checked") == false){
					page.b2bSnperReset();		// 보내는 사람 정보 초기화
				}
				
				page.b2bAcperReset();	// 받는 사람 정보, 운임 정보 초기화
				
			}else if(result.code == "9999"){
				LEMP.Window.alert({
					"_sTitle" : "B2B 접수 오류",
					"_vMessage" : result.message
				});
			}else{
				LEMP.Window.alert({
					"_sTitle" : "B2B 접수 오류",
					"_vMessage" : "B2B 접수 도중 오류가 발생하였습니다."
				});
			}
			
		},
		// ################### B2B 반품/점간 접수 end
		
		// ################### 개인 접수 start
		// B2B 매장->개인 접수
		addTrvRsrvB2c01 : function(){
			if($("#b2c01ShcnCode").val() == ""){
				LEMP.Window.alert({
					"_sTitle" : "매장코드 오류",
					"_vMessage" : "매장을 조회해주세요"
				});
				return false;
			}
			
			if($("#b2c01SnperNm").val() == ""){
				LEMP.Window.alert({
					"_sTitle" : "미입력",
					"_vMessage" : "보내는 사람 이름을 입력해주세요."
				});
				return false;
			}
			
			if($("#b2c01SnperTel").val() == ""){
				LEMP.Window.alert({
					"_sTitle" : "미입력",
					"_vMessage" : "보내는 사람 전화번호를 입력해주세요"
				});
				return false;
			}
			
			if($("#b2c01AcperNm").val() == ""){
				LEMP.Window.alert({
					"_sTitle" : "미입력",
					"_vMessage" : "받는 사람 이름을 입력해주세요"
				});
				return false;
			}
			
			if($("#b2c01AcperTel").val() == ""){
				LEMP.Window.alert({
					"_sTitle" : "미입력",
					"_vMessage" : "받는 사람 전화번호를 입력해주세요"
				});
				return false;
			}
			
			if($("#b2c01AcperBadr").val() == ""){
				LEMP.Window.alert({
					"_sTitle" : "미입력",
					"_vMessage" : "받는 사람 주소를 입력해주세요"
				});
				return false;
			}
			
			if($("#b2cPickYmd").val() == ""){
				LEMP.Window.alert({
					"_sTitle" : "미입력",
					"_vMessage" : "집하일자를 선택해주세요"
				});
				return false;
			}
			
			if($("#b2cBoxTyp").val() == ""){
				LEMP.Window.alert({
					"_sTitle" : "미입력",
					"_vMessage" : "BOX TYPE을 선택해주세요"
				});
				return false;
			}
			
			if($("#b2cGdsNm").val() == ""){
				LEMP.Window.alert({
					"_sTitle" : "미입력",
					"_vMessage" : "상품명을 입력해주세요"
				});
				return false;
			}
			
			if($("#b2cDlvMsgCont").val() == ""){
				LEMP.Window.alert({
					"_sTitle" : "미입력",
					"_vMessage" : "배송요청사항을 입력해주세요"
				});
				return false;
			}
			
			//개인정보 활용 동의
			if($("#b2cAgree").is(":checked") == false){
				LEMP.Window.alert({
					"_sTitle" : "개인정보 활용 동의",
					"_vMessage" : "개인정보활용에 동의해주세요."
				});
				$("#b2cAgree").focus();
				return false;
			}
			
			var data = page.b2c01SnperData;
			var acAddr = page.b2c01AcperAddrInfo;
			var b2cPickYmd = page.replaceAll($("#b2cPickYmd").val(),"."); 		// 집하일자 (20200117)
			var today = page.getDate('today');
			today = page.replaceAll(today,".");
			var b2cDlvFare = $("#b2cDlvFare").val().replace(/[^0-9]/g, '') || "0";	// 배달운임
			
			var _this = this;
			_this.apiParam.param.baseUrl = "smapis/pid/addTrvRsrvB2c";			// api no
			_this.apiParam.param.callback = "page.addTrvRsrvB2cCallback";		// callback methode
			_this.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {
					"b2b_sct_cd" : "04",									// B2C : 04 , C2B : 05
					"pick_empno" : data.pick_empno,							// 집하사원번호	
					"picsh_cd" : data.picsh_cd,								// 집하점소코드
					"acpt_rgst_brsh_cd" : data.picsh_cd,					// 접수점소(11018)
					
					"brnd_job_cust_cd" : data.brnd_job_cust_cd,				// 브랜드 거래처코드
					"brnd_cd" : data.brnd_cd,								// 브랜드코드
					"job_cust_cd" : data.shcn_cust_cd,						// 거래처코드
					
					"snper_job_cust_cd" : data.shcn_cust_cd,				// 보내는 매장 거래처코드
					"snper_nm" : data.shcn_cust_nm,							// 보내는 매장 거래처명
					"snper_tel" : data.pick_tel,							// 보내는 사람 전화번호
					"snper_cpno" : null,									// 보내는 사람 핸드폰번호
					"snper_adr_sct_cd" : "J",								// 보내는사람 주소유형(J:고정값)
					"snper_bas_area_cd" : data.pick_bas_area_cd,			// 보내는 사람 기초 구역 코드
					"snper_zipcd" : data.pick_zipcd,						// 보내는 사람 우편번호
					"snper_ortx_zipcd" : data.pick_zipcd,					// 보내는 사람 우편번호
					"snper_bld_mgr_no" : data.pick_bld_mgr_no,				// 보내는 사람 건물관리번호
					"snper_bld_annm" : "",									// 보내는사람 건물명(사용안함)
					"snper_badr" : data.pick_badr,							// 보내는 사람 기본 주소
					"snper_dadr" : data.pick_dadr,							// 보내는 사람 상세 주소
					"snper_etc_adr" : data.pick_etc_adr,					// 보내는 사람 기타주소
					"snper_sgk_nm" : "",									// 보내는사람 시군구명(사용안함)
					"snper_ri_nm" : "",										// 보내는사람 (리명)(사용안함)
					"snper_emd_nm" : "",									// 보내는사람 읍면동(사용안함)
					"snper_sd_nm" : "",										// 보내는사람 동명(사용안함)
					"snper_text_adr" : data.pick_badr + data.pick_dadr,		// 보내는사람 주소전체(경기광주시초월읍쌍동리쌍동리178-10)
					"snper_rdnm_bld_no" : null,								// 보내는사람 도로명주소(사용안함)
					"snper_rdnm_badr" : data.pick_rdnm_badr,				// 보내는사람 도로명주소기본주소(null)
					"snper_rdnm_dadr" : data.pick_rdnm_dadr,				// 보내는사람 도로명상세주소(null)
					
					"ordr_nm" : $("#b2c01SnperNm").val(),					// 보내는 사람 입력받은 주문자명
					"ordr_tel" : $("#b2c01SnperTel").val(),					// 보내는 사람 입력받은 전화번호
					"ordr_cpno" : $("#b2c01SnperCpno").val(),				// 보내는 사람 입력받은 핸드폰번호
					
					"dlv_pln_empno" : acAddr.cldlEmpno,						// 배달 예정 사원번호
					"dlv_pln_brsh_cd" : $("#b2c01DlvBrshCd").val(),			// 배달 예정 점소코드
					
					"acper_job_cust_cd" : null,								// 받는 사람 거래처코드(사용안함)
					"acper_nm" : $("#b2c01AcperNm").val(),					// 받는 사람 거래처명
					"acper_tel" : $("#b2c01AcperTel").val(),				// 받는 사람 전화번호
					"acper_cpno" : $("#b2c01AcperCpno").val(),				// 받는 사람 휴대폰번호
					"acper_adr_sct_cd" : acAddr.adrSctCd,					// 받는사람주소유형(J)
					"acper_bas_area_cd" : acAddr.basAreaCd,					// 받는 사람 기초구역코드
					"acper_zipcd" : acAddr.zipcd,							// 받는 사람 우편번호
					"acper_ortx_zipcd" : acAddr.zipcd,						// 받는 사람 우편번호
					"acper_bld_mgr_no" : acAddr.bldMgrNo,					// 받는 사람 건물관리번호
					"acper_bld_annm" : acAddr.bldNm,						// 받는사람건물명(연세대학교세브란스빌딩)
					"acper_badr" : $("#b2c01AcperBadr").val(),				// 받는 사람 기본주소
					"acper_dadr" : $("#b2c01AcperDadr").val(),				// 받는 사람 상세주소
					"acper_etc_adr" : $("#b2c01AcperEtcAdr").val(),			// 받는 사람 기타주소
					"acper_sgk_nm" : "",									// 받는사람시군구명(사용안함)
					"acper_ri_nm" : "",										// 받는사람주소(리명)(사용안함)
					"acper_emd_nm" : "",									// 받는사람읍면동(사용안함)
					"acper_sd_nm" : "",										// 받는사람동명(사용안함)
					"acper_text_adr" : $("#b2c01AcperBadr").val() 
									+ $("#b2c01AcperDadr").val() 
									+ $("#b2c01AcperEtcAdr").val(),			// 받는사람주소전체(서울중구남대문로5가84-11연세대학교세브란스빌딩)
					"acper_rdnm_bld_no" : null,								// 받는사람도로명 주소(사용안함)
					"acper_rdnm_badr" : acAddr.rdnmBadr,					// 받는사람도로명 기본주소(서울중구통일로)
					"acper_rdnm_dadr" : acAddr.rdnmDadr,					// 받는사람도로명 상세주소(10)
					
					"pick_ymd" : b2cPickYmd,								// 집하일자 (20200117)
					"ty_qty" : $("#b2cBoxTyp").val(),						// 박스타입 (A)
					"qty" : $("#b2cBoxQty").val(),							// 박스수량 (1)
					"dlv_fare" : b2cDlvFare,								// 배달운임 (5000)
					"fare_sct_cd" : $("#b2cFareSctCd").val(),				// 운임구분코드 (01:현불, 02:착불, 03:신용)
					"gds_nm" : $("#b2cGdsNm").val(),						// 상품명
					"dlv_msg_cont" : $("#b2cDlvMsgCont").val(),				// 배송 메세지
					
					"rsrv_sct_cd" : page.b2cRsrvSctCd,						// 서비스유형(1)
					"bsc_fare" : b2cDlvFare,								// 기본 운임
					"pick_tlgt" : "0",										// 집하자 톨게이트비용(사용안함)
					"summ_fare" : b2cDlvFare,								// 합계운임
					
					"fstm_istr_ymd" : today,								// 접수일
					"prsn_info_agrm_yn" : "Y"								// 개인정보 활용동의 체크 여부
				}
			};
			
			// 공통 api호출 함수 
			smutil.callApi(_this.apiParam);
		},
		
		// B2B 개인->매장 접수
		addTrvRsrvB2c02 : function(){
			
			if($("#b2c02SnperNm").val() == ""){
				LEMP.Window.alert({
					"_sTitle" : "미입력",
					"_vMessage" : "보내는 사람 이름을 입력해주세요."
				});
				return false;
			}
			
			if($("#b2c02SnperTel").val() == ""){
				LEMP.Window.alert({
					"_sTitle" : "미입력",
					"_vMessage" : "보내는 사람 전화번호를 입력해주세요"
				});
				return false;
			}
			
			if($("#b2c02SnperBadr").val() == ""){
				LEMP.Window.alert({
					"_sTitle" : "미입력",
					"_vMessage" : "보내는 사람 주소를 입력해주세요"
				});
				return false;
			}
			
			if($("#b2c02ShcnCode").val() == ""){
				LEMP.Window.alert({
					"_sTitle" : "매장코드 오류",
					"_vMessage" : "매장을 조회해주세요"
				});
				return false;
			}
			
			if($("#b2c02AcperNm").val() == ""){
				LEMP.Window.alert({
					"_sTitle" : "미입력",
					"_vMessage" : "받는 사람 이름을 입력해주세요"
				});
				return false;
			}
			
			if($("#b2c02AcperTel").val() == ""){
				LEMP.Window.alert({
					"_sTitle" : "미입력",
					"_vMessage" : "받는 사람 전화번호를 입력해주세요"
				});
				return false;
			}
			
			if($("#b2c02AcperBadr").val() == ""){
				LEMP.Window.alert({
					"_sTitle" : "미입력",
					"_vMessage" : "받는 사람 주소를 입력해주세요"
				});
				return false;
			}
			
			if($("#b2cPickYmd").val() == ""){
				LEMP.Window.alert({
					"_sTitle" : "미입력",
					"_vMessage" : "집하일자를 선택해주세요"
				});
				return false;
			}
			
			if($("#b2cBoxTyp").val() == ""){
				LEMP.Window.alert({
					"_sTitle" : "미입력",
					"_vMessage" : "BOX TYPE을 선택해주세요"
				});
				return false;
			}
			
			if($("#b2cGdsNm").val() == ""){
				LEMP.Window.alert({
					"_sTitle" : "미입력",
					"_vMessage" : "상품명을 입력해주세요"
				});
				return false;
			}
			
			if($("#b2cDlvMsgCont").val() == ""){
				LEMP.Window.alert({
					"_sTitle" : "미입력",
					"_vMessage" : "배송요청사항을 입력해주세요"
				});
				return false;
			}
			
			//개인정보 활용 동의
			if($("#b2cAgree").is(":checked") == false){
				LEMP.Window.alert({
					"_sTitle" : "개인정보 활용 동의",
					"_vMessage" : "개인정보활용에 동의해주세요."
				});
				$("#b2cAgree").focus();
				return false;
			}
			
			var infoData = page.invNoInfo;
			var snData = page.b2c02SnData;
			var acData = page.b2c02AcData;
			var snAddr = page.b2c02SnperAddrInfo;
			var acAddr = page.b2c02AcperAddrInfo;
			
			snData.pick_empno = infoData.dlv_pln_empno;				// 집하사원번호
			snData.snper_zipcd = infoData.acper_zipcd;				// 우편번호
			snData.snper_bas_area_cd = infoData.acper_bas_area_cd;	// 보내는 사람 기초 구역 코드
			
			if(!smutil.isEmpty(snAddr)){					// 주소검색
				snData.pick_empno = snAddr.cldlEmpno;		// 집배사원번호
				snData.snper_adr_sct_cd = snAddr.adrSctCd;	// 주소유형
				snData.snper_bas_area_cd = snAddr.rsphCd;	// 권역코드
				snData.snper_zipcd = snAddr.zipcd;			// 구우편번호
				snData.snper_bld_mgr_no = snAddr.bldMgrNo;	// 건물관리번호
				snData.snper_bld_annm = snAddr.bldNm;		// 건물명
				snData.snper_rdnm_badr = snAddr.rdnmBadr;	// 도로명 기본주소
				snData.snper_rdnm_dadr = snAddr.rdnmDadr;	// 도로명 상세주소
			}

			
			var b2cPickYmd = page.replaceAll($("#b2cPickYmd").val(),"."); 		// 집하일자 (20200117)
			var today = page.getDate('today');
			today = page.replaceAll(today,".");
			var b2cDlvFare = $("#b2cDlvFare").val().replace(/[^0-9]/g, '') || "0";	// 배달운임
			
			var _this = this;
			_this.apiParam.param.baseUrl = "smapis/pid/addTrvRsrvB2c";			// api no
			_this.apiParam.param.callback = "page.addTrvRsrvB2cCallback";		// callback methode
			_this.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {
					"b2b_sct_cd" : "05",									// B2C : 04 , C2B : 05
					"pick_empno" : snData.pick_empno,						// 집하사원번호	
					"picsh_cd" : $("#b2c02BrshCd").val(),					// 집하점소코드
					"acpt_rgst_brsh_cd" : $("#b2c02BrshCd").val(),			// 접수점소(11018)
					
					"snper_job_cust_cd" : "",								// 보내는 매장 거래처코드(사용안함)
					"snper_nm" : $("#b2c02SnperNm").val(),					// 보내는 매장 거래처명
					"snper_tel" : $("#b2c02SnperTel").val(),				// 보내는 사람 전화번호
					"snper_cpno" : $("#b2c02SnperCpno").val(),				// 보내는 사람 핸드폰번호
					"snper_adr_sct_cd" : smutil.nullToValue(snData.snper_adr_sct_cd,"J"),	// 보내는사람 주소유형(없으면 J)
					"snper_bas_area_cd" : snData.snper_bas_area_cd,			// 보내는 사람 기초 권역 코드
					"snper_zipcd" : snData.snper_zipcd,						// 보내는 사람 우편번호
					"snper_ortx_zipcd" : snData.snper_zipcd,				// 보내는 사람 우편번호
					"snper_bld_mgr_no" : smutil.nullToValue(snData.snper_bld_mgr_no,""),	// 보내는 사람 건물관리번호
					"snper_bld_annm" : smutil.nullToValue(snData.snper_bld_annm,""),		// 보내는사람 건물명(사용안함)
					"snper_badr" : $("#b2c02SnperBadr").val(),				// 보내는 사람 기본 주소
					"snper_dadr" : $("#b2c02SnperDadr").val(),				// 보내는 사람 상세 주소
					"snper_etc_adr" : $("#b2c02SnperEtcAdr").val(),			// 보내는 사람 기타주소
					"snper_sgk_nm" : "",									// 보내는사람 시군구명(사용안함)
					"snper_ri_nm" : "",										// 보내는사람 (리명)(사용안함)
					"snper_emd_nm" : "",									// 보내는사람 읍면동(사용안함)
					"snper_sd_nm" : "",										// 보내는사람 동명(사용안함)
					"snper_text_adr" : $("#b2c02SnperBadr").val()			// 보내는사람 주소전체(경기광주시초월읍쌍동리쌍동리178-10)
										+ $("#b2c02SnperDadr").val()
										+ $("#b2c02SnperEtcAdr").val(),
					"snper_rdnm_bld_no" : null,								// 보내는사람 도로명주소(사용안함)
					"snper_rdnm_badr" : smutil.nullToValue(snData.snper_rdnm_badr,""),		// 보내는사람 도로명주소기본주소(null)
					"snper_rdnm_dadr" : smutil.nullToValue(snData.snper_rdnm_dadr,""),		// 보내는사람 도로명상세주소(null)

					"ordr_nm" : $("#b2c02SnperNm").val(),					// 보내는 사람 입력받은 주문자명
					"ordr_tel" : $("#b2c02SnperTel").val(),					// 보내는 사람 입력받은 전화번호
					"ordr_cpno" : $("#b2c02SnperCpno").val(),				// 보내는 사람 입력받은 핸드폰번호
					
					"dlv_pln_empno" : acData.pick_empno,					// 배달 예정 사원번호 > 주소검색시 사원번호 가져와야하는지 추측
					"dlv_pln_brsh_cd" : $("#b2c02DlvBrshCd").val(),			// 배달 예정 점소코드
					"brnd_job_cust_cd" : acData.brnd_job_cust_cd,			// 브랜드 거래처코드
					"brnd_cd" : acData.brnd_cd,								// 브랜드코드
					"job_cust_cd" : acData.shcn_cust_cd,					// 거래처코드
					
					"acper_job_cust_cd" : acData.shcn_cust_cd,				// 받는 사람 거래처코드
					"acper_nm" : $("#b2c02AcperNm").val(),					// 받는 사람 이름
					"acper_tel" : $("#b2c02AcperTel").val(),				// 받는 사람 전화번호
					"acper_cpno" : $("#b2c02AcperCpno").val(),				// 받는 사람 휴대폰번호
					"acper_adr_sct_cd" : smutil.nullToValue(snData.snper_adr_sct_cd,"J"), // 받는사람주소유형(J)
					"acper_bas_area_cd" : acData.pick_bas_area_cd,			// 받는 사람 기초 권역 코드
					"acper_zipcd" : acData.pick_zipcd,						// 받는 사람 우편번호
					"acper_ortx_zipcd" : acData.pick_zipcd,					// 받는 사람 우편번호
					"acper_bld_mgr_no" : smutil.nullToValue(acData.acper_bld_mgr_no,""),			// 받는 사람 건물관리번호
					"acper_bld_annm" : smutil.nullToValue(acData.acper_bld_annm,""),				// 받는사람건물명(연세대학교세브란스빌딩)
					"acper_badr" : $("#b2c02AcperBadr").val(),				// 받는 사람 기본주소
					"acper_dadr" : $("#b2c02AcperDadr").val(),				// 받는 사람 상세주소
					"acper_etc_adr" : $("#b2c02AcperEtcAdr").val(),			// 받는 사람 기타주소
					"acper_sgk_nm" : "",									// 받는사람시군구명(사용안함)
					"acper_ri_nm" : "",										// 받는사람주소(리명)(사용안함)
					"acper_emd_nm" : "",									// 받는사람읍면동(사용안함)
					"acper_sd_nm" : "",										// 받는사람동명(사용안함)
					"acper_text_adr" : $("#b2c02AcperBadr").val()			// 받는사람주소전체(서울중구남대문로5가84-11연세대학교세브란스빌딩)
									+ $("#b2c02AcperDadr").val(),
					"acper_rdnm_bld_no" : null,								// 받는사람도로명 주소(사용안함)
					"acper_rdnm_badr" : smutil.nullToValue(acData.acper_rdnm_badr,""),	// 받는사람도로명 기본주소(서울중구통일로)
					"acper_rdnm_dadr" : smutil.nullToValue(acData.acper_rdnm_dadr,""),	// 받는사람도로명 상세주소(10)
					
					"pick_ymd" : b2cPickYmd,								// 집하일자 (20200117)
					"ty_qty" : $("#b2cBoxTyp").val(),						// 박스타입 (A)
					"qty" : $("#b2cBoxQty").val(),							// 박스수량 (1)
					"dlv_fare" : b2cDlvFare,								// 배달운임 (5000)
					"fare_sct_cd" : $("#b2cFareSctCd").val(),				// 운임구분코드 (01:현불, 02:착불, 03:신용)
					"gds_nm" : $("#b2cGdsNm").val(),						// 상품명
					"dlv_msg_cont" : $("#b2cDlvMsgCont").val(),				// 배송 메세지
					
					"rsrv_sct_cd" : page.b2cRsrvSctCd,						// 서비스유형(1)
					"bsc_fare" : b2cDlvFare,								// 기본 운임
					"pick_tlgt" : "0",										// 집하자 톨게이트비용(사용안함)
					"summ_fare" : b2cDlvFare,								// 합계운임
					
					"fstm_istr_ymd" : today,								// 접수일
					"prsn_info_agrm_yn" : "Y"								// 개인정보 활용동의 체크 여부
				}
			};
			
			// 공통 api호출 함수 
			smutil.callApi(_this.apiParam);
		},
		
		// B2B개인 접수 callback
		addTrvRsrvB2cCallback : function(result){
			
			if(smutil.apiResValidChk(result) && result.code == "0000"){
				LEMP.Window.alert({
					"_sTitle" : "B2B 접수",
					"_vMessage" : "접수되었습니다."
				});
				
				if(page.codeAreaCd == "b2c01"){
					if($("#b2c01SnperSave").is(":checked") == false){
						page.b2c01SnperReset();		// 보내는 사람 정보 초기화
					}
					
					page.b2c01AcperReset();	// 받는 사람 정보, 운임 정보 초기화
				}else{
					if($("#b2c02SnperSave").is(":checked") == false){
						page.b2c02SnperReset();		// 보내는 사람 정보 초기화
					}
					if($("#b2c02AcperSave").is(":checked") == false){
						page.b2c02AcperReset();		// 받는 사람 사람 정보 초기화
					}
				}

			}else if(result.code == "9999"){
				LEMP.Window.alert({
					"_sTitle" : "B2B 접수 오류",
					"_vMessage" : result.message
				});
			}else{
				LEMP.Window.alert({
					"_sTitle" : "B2B 접수 오류",
					"_vMessage" : "B2B 접수 도중 오류가 발생하였습니다."
				});
			}
			
		},
		
		// ################### 개인 접수 end
		
		// ################### 초기화 start
		// 반품/점간 > 거래처/브랜드/매장 코드, 보내는 매장 정보 초기화
		b2bSnperReset : function(){
			// 보내는 매장 정보
			page.b2bSnperData = null;
			// 운임정보
			page.arrB2bSnperFare = null;
			
			// 코드 input 초기화
			$(".b2bCodeInitInfo input[type='text']").val("");
			// 보내는 매장 input 초기화
			$(".b2bSnperInitInfo input[type='text']").val("");
		},
		
		// 반품/점간 > 받는 매장 정보, 집하일자, 운임정보, 상품/배송요청사항, 개인정보활용동의 초기화
		b2bAcperReset : function(){
			// 받는 매장 정보
			page.b2bAcperData = null;
			// 운임정보
			page.arrB2bAcperFare = null;
			
			// 배달점 정보 초기화
			$(".b2bBrshInitInfo input[type='text']").val("");
			// 받는 매장 input 초기화
			$(".b2bAcperInitInfo input[type='text']").val("");

			// 집하일자
			var today = page.getDate('today');
			$('#b2bPickYmd').val(today);
			
			// 운임정보
			$("#b2bBoxTyp option").remove();
			$("#b2bBoxTyp").attr( 'disabled', true );
			$("#b2bFareSctCd").attr( 'disabled', true );
			$("#b2bDlvFare").attr( 'disabled', true );
			
			// 상품명
			if($("input[name=b2bSctCd]:checked").val() == "02"){ //02:반품, 03:점간
				$("#b2bGdsNm").val("B2B반품");
			}else{
				$("#b2bGdsNm").val("B2B점간");
			}
			
			// 배송요청사항
			$("#b2bDlvMsgCont").val("없음");
			$("#b2bDlvMsgContText").text("없음");
			
			// 개인정보활용동의 초기화
			$("#b2bAgree").prop("checked", false);
		},
		
		// 매장->개인 > 거래처/브랜드/매장 코드, 보내는 매장 정보 초기화
		b2c01SnperReset : function(){
			// 보내는 매장 정보
			page.b2c01SnperData = null;
			// 운임정보
			page.arrB2c01SnperFare = null;
			
			// 코드 input 초기화
			$(".b2c01CodeInitInfo input[type='text']").val("");
			// 보내는 매장 input 초기화
			$(".b2c01SnperInitInfo input[type='text']").val("");
		},
		
		// 매장->개인 > 받는 매장 정보, 집하일자, 운임정보, 상품/배송요청사항, 개인정보활용동의 초기화
		b2c01AcperReset : function(){
			// 받는 매장 정보
			page.b2c01AcperData = null;
			
			// 운임정보
			page.arrb2c01AcperFare = null;
			
			// 배달점 정보 초기화
			$(".b2c01BrshInitInfo input[type='text']").val("");
			// 받는 매장 input 초기화
			$(".b2c01AcperInitInfo input[type='text']").val("");
			
			// 집하일자
			var today = page.getDate('today');
			$('#b2cPickYmd').val(today);
			
			$("#b2cBoxTyp option").remove();
			$("#b2cBoxTyp").attr( 'disabled', true );
			$("#b2cFareSctCd").attr( 'disabled', true );
			$("#b2cDlvFare").attr( 'disabled', true );
			
			// 상품명
			$("#b2cGdsNm").val("B2B매장발송건");
			
			//배송요청사항
			$("#b2cDlvMsgCont").val("없음");
			$("#b2cDlvMsgContText").text("없음");
			
			//개인정보활용동의 초기화
			$("#b2cAgree").prop("checked", false);
		},
		
		// 개인->매장 > 거래처/브랜드/매장 코드, 보내는 매장 정보 초기화
		b2c02SnperReset : function(){
			// 보내는 매장 정보
			page.b2c02SnperData = null;
			// 운임정보
			page.arrB2c02SnperFare = null;
			
			// 집하점, 원송장번호 초기화
			$(".b2cArea02 input[type='text']").val("");
			// 보내는 매장 input 초기화
			$(".b2c02SnperInitInfo input[type='text']").val("");
		},
		
		// 개인->매장 > 받는 매장 정보, 집하일자, 운임정보, 상품/배송요청사항, 개인정보활용동의 초기화
		b2c02AcperReset : function(){
			// 받는 매장 정보
			page.b2c02AcperData = null;
			
			// 운임정보
			page.arrb2c02AcperFare = null;
			
			// 코드 input 초기화
			$(".b2c02CodeInitInfo input[type='text']").val("");
			// 배달점 정보 초기화
			$(".b2c02BrshInitInfo input[type='text']").val("");
			// 받는 매장 input 초기화
			$(".b2c02AcperInitInfo input[type='text']").val("");
			
			// 집하일자
			var today = page.getDate('today');
			$('#b2cPickYmd').val(today);
			
			$("#b2cBoxTyp option").remove();
			$("#b2cBoxTyp").attr( 'disabled', true );
			$("#b2cFareSctCd").attr( 'disabled', true );
			$("#b2cDlvFare").attr( 'disabled', true );
			
			// 상품명
			$("#b2cGdsNm").val("B2B고객반품건");
			
			//배송요청사항
			$("#b2cDlvMsgCont").val("없음");
			$("#b2cDlvMsgContText").text("없음");
			
			//개인정보활용동의 초기화
			$("#b2cAgree").prop("checked", false);
		},
		// ################### 초기화 end
		
		// 날짜 선택 한 후 실행되는 콜백 함수
		COM0301Callback:function(res){
			$("#" + page.tabCd +"PickYmd").val(res.param.date);
			
			page.listReLoad();					// 리스트 제조회
		},

		// 개인정보활용 동의 callback
		com1101Callback : function(result){
			if(result.agree == "true"){
				$("#" + result.etc + "Agree").prop("checked", true);
			}else{
				$("#" + result.etc + "Agree").prop("checked", false);
			}
		},
		
		// 50원 단위 올림
		increments50 : function(money){
			var remainder = money % 50;	// 나머지
			var subtract = 50 - remainder;		// 50 - 나머지
			if(remainder > 0){	// 나머지값이 있으면
				var increments = money + subtract; //원래금액 + 모자란금액
			}else{
				var increments = money;
			}
			return increments;
		},
		
		// 플러스 마이너스
		plusMinus : function(minBtn,plusBtn,max,min,inpu) {
			var count = min;
			$(minBtn).on("click, touchstart",function(){
				count -= 1;
				if(count < min){count = min;	}
				$(inpu).val(count);
			});
			$(plusBtn).on("click, touchstart",function(){
				count += 1;
				if(count >= max){count = max;}
				$(inpu).val(count);
			});
		},
		
		// 현재,7일전 날짜 가져오기
		getDate : function(flag){
			var date = new Date();
			
			if(flag == '7daysAgo'){
				var daysAgo = date.getTime() - (6*24*60*60*1000);
				date.setTime(daysAgo);
			}
			
			var year  = page.pad(date.getFullYear());
		    var month = page.pad(date.getMonth() + 1);
		    var day   = page.pad(date.getDate());
			return year + "." + month + "." + day;
		},
		
		pad : function(numb){
			return (numb < 10 ? '0' : '') + numb;
		},
		
		replaceAll : function(string,change){
			return string.split(change).join('');
		},
		
		// 휴대폰/회사번호 번호검색(하이픈'-' 자동입력)
		autoHypenPhone : function(str) {

			str = str.replace(/[^0-9]/g, '');

			var tmp = '';
			// 01) 전화번호 처리
			if (str.substring(0, 1) == "1") { // 1588, 1688등의 번호일 경우
				if (str.length < 4) {
					return str;
				} else if (str.length < 9) {
					tmp += str.substr(0, 4); // 1544
					tmp += '-';
					tmp += str.substr(4, 4); // 6071
					return tmp;
				} else {
					tmp += str.substr(0, 4);
					tmp += '-';
					tmp += str.substr(4, 4);
					return tmp;
				}
			} else if (str.substring(0, 2) == "02") { // 02 서울 대표번호
				if (str.length < 2) {
					return str;
				} else if (str.length < 5) {
					tmp += str.substr(0, 2); // 02
					tmp += '-';
					tmp += str.substr(2, 3); // 1544
					return tmp;
				} else if (str.length < 10) {
					tmp += str.substr(0, 2); // 02
					tmp += '-';
					tmp += str.substr(2, 3); // 222
					tmp += '-';
					tmp += str.substr(5); // 3333
					return tmp;
				} else {
					tmp += str.substr(0, 2); // 02
					tmp += '-';
					tmp += str.substr(2, 4); // 2222
					tmp += '-';
					tmp += str.substr(6, 4); // 2222
					return tmp;
				}
			} else if (str.substring(0, 2) == "05") { // 05 안심번호
				if (str.length < 4) {
					return str;
				} else if (str.length < 9) {
					tmp += str.substr(0, 4);
					tmp += '-';
					tmp += str.substr(4, 4);
					return tmp;
				} else {
					tmp += str.substr(0, 4);
					tmp += '-';
					tmp += str.substr(4, 4);
					tmp += '-';
					tmp += str.substr(8, 4);
					return tmp;
				}
				// 02)휴대폰 번호처리
			} else if (str.length < 4) {
				return str;
			} else if (str.length < 7) {
				tmp += str.substr(0, 3);
				tmp += '-';
				tmp += str.substr(3);
				return tmp;
			} else if (str.length < 11) {
				tmp += str.substr(0, 3);
				tmp += '-';
				tmp += str.substr(3, 3);
				tmp += '-';
				tmp += str.substr(6);
				return tmp;
			} else {
				tmp += str.substr(0, 3);
				tmp += '-';
				tmp += str.substr(3, 4);
				tmp += '-';
				tmp += str.substr(7, 4);
				return tmp;
			}
			return str;
		},
		
		// api 파람메터 초기화 
		apiParamInit : function(){
			page.apiParam =  {
				id:"HTTP",					// 디바이스 콜 id
				param:{						// 디바이스가 알아야할 데이터
					task_id : "",			// 화면 ID 코드가 들어가기로함
					//position : {},		// 사용여부 미확정 
					type : "",
					baseUrl : "",
					method : "POST",		// api 호출 형식(지정 안하면 'POST' 로 자동 셋팅)
					callback : "",			// api 호출후 callback function
					contentType : "application/json; charset=utf-8"
				},
				data:{"parameters" : {}}	// api 통신용 파라메터
			};
		}
};
