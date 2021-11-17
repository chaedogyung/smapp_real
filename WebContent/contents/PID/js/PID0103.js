var page = {

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

		sum_fare_final : null,	// 합계운임
		sum_fare_base : null,	// 최종기본운임(수정전)
		sum_fare_base_input : null,	// 최종기본운임(수정후)
//		social_fare : null,		// 사합금
		air_fare : null,	// 항공운임
		ship_fare : null,	// 도선료

		//거래처검색, 고정송수하주
		tab_cd : "rsrv",	// 선택한 탭의 값 (rsrv, client, rtn)
		searchType : "",			// 거래처명(Cust), 고정송수하주(Fix) 검색 타입
		addrTypeCd : "",			// 송하인(1 / Snper), 수하인(2 / Acper) 여부
		addrTypeNm : "",			// 송하인(Snper), 수하인(Acper) 여부
		custData : {},				// 선택된 거래처 데이터
		fareAmtInfo : {},			// 거래처운임조회 결과 데이터,

		isFare : false,				// 운임계산 클릭여부


		init:function()
		{
			page.initEvent();			// 페이지 이벤트 등록
			page.initDpEvent();			// 화면 디스플레이 이벤트
		},

		// 페이지 이벤트 등록
		initEvent : function()
		{
			var _this = this;

			/* 최상단 탭 클릭 > 개인 택배 접수, 반품 접수*/
			$(".tabBtn").click(function(){
				var tab_cd = $(this).data('tabCd');		// 선택한 탭의 값 (rsrv, client, rtn)
				page.tab_cd = tab_cd;

				var btnTab = $(".tabBtn");
				var btnObj;
				_.forEach(btnTab, function(obj, key) {
					btnObj = $(obj);
					var objTabCd = btnObj.data('tabCd');
					if(tab_cd == objTabCd){
						btnObj.closest('li').addClass( 'on' );
						$("."+objTabCd+"Li").show();	//ex).rsrvLi, .clientLi, .rtnLi
					}
					else{
						btnObj.closest('li').removeClass( 'on' );
						$("."+objTabCd+"Li").hide();
					}
				});

			});

			/* 공통 > 휴대폰/회사번호 번호검색(하이픈'-' 자동입력) */
			$(".autoHypenPhone").keyup(function(){
				var phone = $(this).val();
				phone = autoHypenPhone(phone);
				$(this).val(phone);
			});

			/* 공통 > 숫자만 입력 */
			$(document).on('keypress', 'input.money', function(e){
		        if(e.which && (e.which < 48 || e.which > 57) ) e.preventDefault();
		    });

			/* 공통 > 화물가액은 최대 3,000,000원까지 입력 가능 */
			$(document).on('keyup', '#rsrvArtcPrc', function(e){
				var tmps = parseInt($(this).val().replace(/[^0-9]/g, '')) || 0;
				if(tmps > 3000000){
					$("#rsrvArtcPrcTxt").show();
				}else{
					$("#rsrvArtcPrcTxt").hide();
				}
				var numberToComma = String(tmps).LPToCommaNumber();
				$(this).val(numberToComma);
			});

			/* 공통 > 보내는 사람, 받는 사람 정보 저장*/
			$("#rsrvSnperSave, #rsrvAcperSave, #rtnSnperSave, #clientAcperSave, #clientSnperSave").on('click', function(){
				var id = $(this).attr("id");

				//접수 이벤트 실행시 saveInfo 클래스 하위에 있는 input은 초기화 되지 않음
				if($(this).is(":checked") == true){
					$("."+id).addClass("saveInfo");
				}else{
					$("."+id).removeClass("saveInfo");
				}

			});

			/* 개인택배접수 > 보내는 사람 정보 받는 사람 정보에 복사  */
			$(document).on('click', '#rsrvInfoCopy', function(e){
				page.rsrvRtnCopy();
			});

			$(document).on('keyup', '#rsrvSnperNm,#rsrvSnperTel,#rsrvSnperCpno', function(e){
				page.rsrvRtnCopy();
			});

			/* 거래처택배접수 > 보내는 사람 정보 받는 사람 정보에 복사  */
			$(document).on('click', '#clientInfoCopy', function(e){
				page.rtnClientCopy();
			});

			$(document).on('keyup', '#clientSnperNm,#clientSnperTel,#clientSnperCpno', function(e){
				page.rtnClientCopy();
			});

			/* 반품접수 > 보내는 사람 정보 받는 사람 정보에 복사  */
			$(document).on('click', '#rtnInfoCopy', function(e){
				page.rtnRsrvCopy();
			});

			$(document).on('keyup', '#rtnSnperNm,#rtnSnperTel,#rtnSnperCpno', function(e){
				page.rtnRsrvCopy();
			});

			/* 반품접수 > 반품지 선택  */
			$(document).on('click', 'input[name="return"]', function(e){
				page.returnChange();
			});

			/* 공통 > 주소검색 */
			$(".addressSearch").on('click', function(){
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

			/* 공통 > 상품 분류 팝업 */
			$(document).on("click",".itemKnd",function(){
				var popUrl = smutil.getMenuProp("COM.COM0901","url");
				LEMP.Window.open({
					"_sPagePath" : popUrl,
					"_oMessage" : {
						"param" : {
							"typ_cd" : "LRG_ITEM_KND_CD"
						}
					}
				});
			});

			/* 공통 > 운임 계산 팝업 */
			$(document).on("click",".fareCalcBtn",function(){
				if(page.tab_cd === 'client'){
					const fare = $("#clientSummFareTxt").val();
					if(smutil.isEmpty(fare)){
						LEMP.Window.alert({
							"_sTitle" : "미입력",
							"_vMessage" : "운임을 입력해주세요."
						});
						return false;
					}else{
						page.isFare = true;
						page.getFareAmtInfo(fare);
					}
				}else{
					page.fareCalcSearch();
				}
			});

			/* 개인택배접수 > 플러스 마이너스 */
			page.plusMinus(".inNum .btn.minus",".inNum .btn.plus2",30,1,".inNum .valNum");

			/* 개인택배접수 / 거래처택배접수 > 배송요청사항 팝업 */
			$(document).on("click","#dlvMsg, #dlvMsgClient",function(){
				var popUrl = smutil.getMenuProp("COM.COM0901","url");
				LEMP.Window.open({
					"_sPagePath" : popUrl,
					"_oMessage" : {
						"param" : {
							"typ_cd" : "SMAPP_DLV_MSG_CD"
						}
					}
				});
			});

			/* 반품접수 > 원송장 번호 직접 입력 */
			$('#rtnOrgInvNo').on('click', function() {
				var popUrl = smutil.getMenuProp('COM.COM0102', 'url');
				LEMP.Window.open({
					"_sPagePath" : popUrl
				});
			});

			/* 반품접수 > 원송장 번호 조회 */
			$('#orgInvNoSearch').on('click', function() {
				if(smutil.isEmpty($("#rtnOrgInvNo").val())){
					LEMP.Window.alert({
						"_sTitle" : "원송장 조회 오류",
						"_vMessage" : "원송장 번호가 없습니다."
					});
				}
				page.invNoInfoSearch();
			});

			/* 반품접수 > 반품사유 팝업 */
			$(document).on("click","#rtgRsn",function(){
				var popUrl = smutil.getMenuProp("COM.COM0901","url");
				LEMP.Window.open({
					"_sPagePath" : popUrl,
					"_oMessage" : {
						"param" : {
							"typ_cd" : "SMAPP_RTG_RSN_CD"
						}
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
			$("#sendBtn").on('click', function() {

				// 공통 > 현제 어느 탭에 있는지 검사 (예약/지시, 거래처출고)
				var btnTab = $(".tabBtn");
				var btnObj;

				_.forEach(btnTab, function (obj, key) {
					btnObj = $(obj);

					if (btnObj.closest('li').is('.on')) {
						tab_btn = btnObj.data('tabCd');
					}
				});


				if (tab_btn == "rsrv") { // 개인택배접수

					//input check
					var result = to_validation($(".rsrvLi"));
					if (result == false)
						return false;

					var rsrvArtcPrc = parseInt($("#rsrvArtcPrc").val().replace(/[^0-9]/g, '')) || 0;
					if (rsrvArtcPrc < 10000) {
						LEMP.Window.alert({
							"_sTitle": "미입력",
							"_vMessage": "화물가액을 만 단위 이상으로 입력해주세요."
						});
						return false;
					}

					if (rsrvArtcPrc > 3000000) {
						LEMP.Window.alert({
							"_sTitle": "",
							"_vMessage": "화물가액은 최대 3,000,000원까지 입력 가능합니다."
						});
						$("#rsrvArtcPrc").focus();
						return false;
					}

					var boxCnt = $("#rsrvQty").val();
					if (boxCnt < 1) {
						LEMP.Window.alert({
							"_sTitle": "미입력",
							"_vMessage": "박스 수량은 1개 이상입니다."
						});
						$("#rsrvQty").focus();
						return false;
					}

					// 개인정보 활용 동의
					if ($("#rsrvAgree").is(":checked") == false) {
						LEMP.Window.alert({
							"_sTitle": "개인정보 활용 동의",
							"_vMessage": "개인정보 활용에 동의해주세요."
						});
						$("#rsrvAgree").focus();
						return false;
					}

					// API에서 box수량만큼 등록
					page.postPidRsrvRgst();

				} else if (tab_btn === "client") {		// 거래처 택배접수
					//input check
					var result = to_validation($(".clientLi"));
					if (result == false)
						return false;

					// 개인정보 활용 동의
					if ($("#clientAgree").is(":checked") == false) {
						LEMP.Window.alert({
							"_sTitle": "개인정보 활용 동의",
							"_vMessage": "개인정보 활용에 동의해주세요."
						});
						$("#clientAgree").focus();
						return false;
					}

					// API에서 box수량만큼 등록
					page.addTrvTsrvJobCust();

				}else if(tab_btn == "rtn"){ //반품접수

					//input check
					var result = to_validation($(".rtnLi"));
					if(result == false)
						return false;

					//개인정보 활용 동의
					if($("#rtnAgree").is(":checked") == false){
						LEMP.Window.alert({
							"_sTitle" : "개인정보 활용 동의",
							"_vMessage" : "개인정보 활용에 동의해주세요."
						});
						$("#rtnAgree").focus();
						return false;
					}

					page.postPidRtnRgst();
				}


			});

			/* 거래처 > 거래처명 검색 */
			$(".clientNmSearch").on('click', function(){
				const id = $(this).attr("id");
				if(id.indexOf("Snper")!==-1){
					page.addrTypeCd = "1";
					page.addrTypeNm = "Snper";
				}else if(id.indexOf("Acper")!==-1){
					page.addrTypeCd = "2";
					page.addrTypeNm = "Acper";
				}
				const search = $("#" + page.tab_cd + page.addrTypeNm + "CustNm").val();
				if(!smutil.isEmpty(search)){
					page.jobCustList(search);
				}else{
					LEMP.Window.alert({
						"_sTitle" : "거래처명 검색",
						"_vMessage" : "검색어를 입력해주세요"
					});
				}
			});

			/* 개인, 거래처 > 고정송수하주 검색 */
			$(".fixedClient").on("click", function(){
				const id = $(this).attr("id");
				if(id.indexOf("Snper")!==-1){
					page.addrTypeCd = "1";
					page.addrTypeNm = "Snper";
				}else if(id.indexOf("Acper")!==-1){
					page.addrTypeCd = "2";
					page.addrTypeNm = "Acper";
				}
				let search = $("#clientSnperCustCd").val();
				if(smutil.isEmpty(search) && page.tab_cd ==='client'){
					LEMP.Window.alert({
						"_sTitle" : "고정송수하주 검색오류",
						"_vMessage" : "거래처명을 선택해주세요"
					});
					return;
				}else if(page.tab_cd === 'rsrv'){
					search = ""
				}
				page.fixShcnList(search);
			});

			//거래처 택배접수 / 박스타입이 변경될 경우 기본운임 세팅
			$("#clientBoxTyp").change(function () {
				if(page.tab_cd === "client"){
					page.isFare = false;
					page.getFareAmtInfo("0");
				}
			});
		},

		initDpEvent : function()
		{
			var _this = this;
			smutil.loadingOn();
			page.returnChange();
			smutil.loadingOff();
		},

		// ################### 상품분류, 배송요청사항  start
		// 상품 분류, 배송요청사항 팝업 선택 후 callback
		com0901Callback : function(result){

			try {

				var typ_cd = result.typ_cd;				// 구분코드
				var dtl_cd = result.dtl_cd;				// 상세코드 (상품대분류코드)
				var dtl_cd_nm = result.dtl_cd_nm;			// 상세코드명 (상품분류명)

				// 현제 어느 탭에 있는지 검사 (예약/지시, 거래처출고)
				var btnTab = $(".tabBtn");
				var btnObj;

				_.forEach(btnTab, function(obj, key) {
					btnObj = $(obj);

					if(btnObj.closest('li').is('.on')){
						tab_btn = btnObj.data('tabCd');
					}
				});

				if(!smutil.isEmpty(dtl_cd)){
					if(typ_cd == "LRG_ITEM_KND_CD"){			// 상품 분류
						if(tab_btn === "rsrv"){						//개인택배
							$("#rsrvGdsCd").val(dtl_cd);
							$("#rsrvGdsNm").text(dtl_cd_nm);
						}else if(tab_btn === "client"){				//거래처택배
							$("#clientGdsCd").val(dtl_cd);
							$("#clientGdsNm").text(dtl_cd_nm);
						}
						else{
//							$("#rtnGdsCd").val(dtl_cd);
//							$("#rtnGdsNm").text(dtl_cd_nm);
						}

					}else if(typ_cd == "SMAPP_DLV_MSG_CD"){			// 배송요청사항
						if(tab_btn === "rsrv"){						//개인택배
							$("#dlvMsgCont").val(dtl_cd_nm);
							$("#dlvMsgContText").text(dtl_cd_nm);
						}else if(tab_btn === "client"){				//거래처택배
							$("#dlvMsgClientCont").val(dtl_cd_nm);
							$("#dlvMsgContClientText").text(dtl_cd_nm);
						}

					}else if(typ_cd == "SMAPP_RTG_RSN_CD"){	// 반품사유
						$("#rtnRsnNm").val(dtl_cd_nm);
						$("#rtnRsnNmText").text(dtl_cd_nm);
					}
				}
				else {
					LEMP.Window.alert({
						"_sTitle" : "상품 분류 오류",
						"_vMessage" : "선택된 상품이 없습니다."
					});

					return false;
				}
			}
			catch (e){}
			finally{
				page.apiParamInit();			// 파라메터 전역변수 초기화
			}

		},
		// ################### 상품분류, 배송요청사항  end


		// ################### 원송장번호 start
		// 원송장 번호 스캔된 후 callback
		scanCallback : function(result){
			$("#rtnOrgInvNo").val(result.barcode);
		},

		// 원송장 번호 키패드 callback
		InputCallback : function(result){
			$("#rtnOrgInvNo").val(result.inv_no);
		},

		// 원송장번호 정보 조회
		invNoInfoSearch : function(){
			var _this = this;

			_this.apiParam.param.baseUrl = "smapis/pid/rsrvDtl";			// api no
			_this.apiParam.param.callback = "page.invNoInfoCallback";			// callback methode
			_this.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {
					"inv_no" : $("#rtnOrgInvNo").val(),
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

				if(smutil.isEmpty(data)){
					LEMP.Window.alert({
						"_sTitle" : "원송장 조회 오류",
						"_vMessage" : "조회하신 송장번호에 데이터가 없습니다."
					});
				}

				//보내는 사람
				$("#rtnSnperNm").val(data.acper_nm);
				$("#rtnSnperTel").val(data.acper_tel);
				$("#rtnSnperCpno").val(data.acper_cpno);
				$("#rtnSnperZipcd").val(data.acper_zipcd);
				$("#rtnSnperBadr").val(data.acper_badr);
				$("#rtnSnperDadr").val(data.acper_dadr);

				//받는 사람
				$("#rtnAcperNm").val(data.snper_nm);
				$("#rtnAcperTel").val(data.snper_tel);
				$("#rtnAcperCpno").val(data.snper_cpno);
				$("#rtnAcperZipcd").val(data.snper_zipcd);
				$("#rtnAcperBadr").val(data.snper_badr);
				$("#rtnAcperDadr").val(data.snper_dadr);

				$("#rtnGdsNm").val(data.gds_nm);
				if(data.fres_yn == "Y"){
					$("#rtnfresYn").prop('checked', true);
				}else{
					$("#rtnfresYn").prop('checked', false);
				}

				$('input[name="rtnFareSctCd"]').removeAttr('checked');
				$("input:radio[name=rtnFareSctCd]:radio[value=" + data.fare_sct_cd + "]").prop('checked', true);
				$("#rtnSummFare").val(String(data.summ_fare).LPToCommaNumber());
				$('input[name="rtnSvcCd"]').removeAttr('checked');
				$("input:radio[name=rtnSvcCd]:radio[value=" + data.svc_cd + "]").prop('checked', true);

			}
			catch(e){}
			finally{
				smutil.loadingOff();			// 로딩바 닫기
				page.apiParamInit();			// 파라메터 전역변수 초기화
			}

		},
		// ################### 원송장번호 end

		// ################### 주소 start
		// 주소 팝업 선택 후 callback
		com0801Callback : function(result){
			var data = result.param;
			var type = data.type;
			$("#" + type + "Zipcd").val(data.zipcd);
			$("#" + type + "BldMgrNo").val(data.bldMgrNo);
			$("#" + type + "CldlBrshCd").val(data.dlvBrshCd);
			$("#" + type + "CldlBrshNm").val(data.dlvBrshNm);
			$("#" + type + "BasAreaCd").val(data.basAreaCd);

			if(data.adrSctCd == "J"){	//지번
				$("#" + type + "Badr").val(data.badr);
				$("#" + type + "Dadr").val(data.dadr);
			}else{
				$("#" + type + "Badr").val(data.rdnmBadr);
				$("#" + type + "Dadr").val(data.rdnmDadr);
			}

			if(type == "rsrvSnper"){
				page.rsrvRtnCopy();				// 개인택배접수
			}else if(type == "rtnSnper"){
				page.rtnRsrvCopy();				// 반품접수
			}else if(type === "clientSnper"){
				page.rtnClientCopy();			// 거래처 택배접수
			}

		},
		// ################### 주소 end

		// ################### 운임계산 start
		// 운임 조회

		fareCalcSearch : function(){
			var _this = this;

			var sqty = "0";
			var mqty = "0";
			var lqty = "0";
			var rsrvQty = $("#rsrvQty").val();
			var rsrvArtcPrc = parseInt($("#rsrvArtcPrc").val().replace(/[^0-9]/g, '')) || 0;

			// 필수값 체크 S
			var message = "";
			if($("#rsrvSnperZipcd").val() == ""){
				LEMP.Window.alert({
					"_sTitle" : "미입력",
					"_vMessage" : "보내는 사람 주소를 입력해주세요."
				});
				return false;
			}
			if($("#rsrvAcperZipcd").val() == ""){
				LEMP.Window.alert({
					"_sTitle" : "미입력",
					"_vMessage" : "받는 사람 주소를 입력해주세요."
				});
				return false;
			}
			if(rsrvArtcPrc < 10000){
				LEMP.Window.alert({
					"_sTitle" : "미입력",
					"_vMessage" : "화물가액을 만 단위 이상으로 입력해주세요."
				});
				return false;
			}
			if(rsrvQty < 1){
				LEMP.Window.alert({
					"_sTitle" : "미입력",
					"_vMessage" : "박스 수량은 1개 이상입니다."
				});
				return false;
			}
			// 필수값 체크 E


			if($("#rsrvBoxTyp").val() == "A")
				sqty = rsrvQty;
			else if($("#rsrvBoxTyp").val() == "B")
				mqty = rsrvQty;
			else if($("#rsrvBoxTyp").val() == "C")
				lqty = rsrvQty;

			var rsrvSvcCd = $("input[name=rsrvSvcCd]:checked").val(); //서비스구분(특화구분)

			_this.apiParam.param.baseUrl = "smapis/pid/fareCalc";			// api no
			_this.apiParam.param.callback = "page.fareCalcCallback";			// callback methode
			_this.apiParam.data = {
				    "parameters": {
				    	"p_snper_zip_no" : $("#rsrvSnperZipcd").val(),	//보내는사람 우편번호 110440
				    	"p_acper_zip_no" : $("#rsrvAcperZipcd").val(),	//받는사람 우편번호 690010
				    	"p_item_price" : String(rsrvArtcPrc),			//화물가액 5000
				    	"p_sqty" : sqty,								//수량(소) 1
				    	"p_mqty" : mqty,								//수량(중) 0
				    	"p_lqty" : lqty,								//수량(대) 0
				    	"p_fcha_cd" : rsrvSvcCd							//서비스구분 (00:일반, 01:특화(의류), 04: 소형 [공통코드: SVC_CD]) 00
				    }
				};

			// 공통 api호출 함수
			smutil.callApi(_this.apiParam);
		},

		// 운임계산  callback
		fareCalcCallback : function(result){
			try{
				// api 전송 성공
				if(smutil.apiResValidChk(result) && result.code == "0000"){

					var popUrl = smutil.getMenuProp("PID.PID0104","url");
					LEMP.Window.open({
						"_sPagePath" : popUrl,
						"_oMessage" : result
					});

				}else{

					LEMP.Window.alert({
						"_sTitle" : "운임 조회 오류",
						"_vMessage" : "운임 계산 도중 오류가 발생하였습니다."
					});
				}
			}
			catch(e){}
			finally{
				smutil.loadingOff();			// 로딩바 닫기
				page.apiParamInit();			// 파라메터 전역변수 초기화
			}

		},
		// ################### 원송장번호 end

		//거래처 택배 운임계산
		getFareAmtInfo : function (fare) {
			const clientQty = $("#clientQty").val();			//수량
			const clientSnperZipcd = $("#clientSnperZipcd").val();			//보내는사람 우편번호
			const clientAcperZipcd = $("#clientAcperZipcd").val();			//받는사람 우편번호
			const clientSummFareTxt = fare;

			// 필수값 체크 S
			if(_.isUndefined(page.custData.job_cust_cd) || smutil.isEmpty(page.custData.job_cust_cd)){
				if(fare !== "0"){
					LEMP.Window.alert({
						"_sTitle" : "미입력",
						"_vMessage" : "거래처 검색을 해주세요"
					});
				}
				return false;
			}
			if(_.isUndefined(clientSnperZipcd) || smutil.isEmpty(clientSnperZipcd)){
				if(fare !== "0"){
					LEMP.Window.alert({
						"_sTitle" : "미입력",
						"_vMessage" : "보내는 사람 주소를 입력해주세요."
					});
				}
				return false;
			}
			if(_.isUndefined(clientAcperZipcd) || smutil.isEmpty(clientAcperZipcd)){
				if(fare !== "0"){
					LEMP.Window.alert({
						"_sTitle" : "미입력",
						"_vMessage" : "받는 사람 주소를 입력해주세요."
					});
				}
				return false;
			}

			// 필수값 체크 E
			page.apiParam.param.baseUrl = "smapis/pid/getFareAmtInfo";			// api no
			page.apiParam.param.callback = "page.getFareAmtInfoCallback";		// callback methode
			page.apiParam.data = {
				"parameters": {
					"jobCustCd" : page.custData.job_cust_cd,						//거래처 코드
					"picshCd" : $("#clientSnperCldlBrshCd").val(),					//집하 점소코드
					"dlvPlnBrshCd" : $("#clientAcperCldlBrshCd").val(),				//배달예정 점소코드
					"fareSctCd" : $("input[name=clientFareSctCd]:checked").val(),	//운임구분
					"ordSct" : "01",												//출고 01 고정
					"snperBldMgrNo" : $("#clientsnperBldMgrNo").val(),				//보내는사람 건물번호
					"snperSvcCd" : "00",											//00 고정
					"snperBasAreaCd" : $("#clientSnperBasAreaCd").val(),			//보내는사람 지역코드
					"snperZipcd" : clientSnperZipcd,								//보내는사람 우편번호
					"acperBldMgrNo" : $("#clientAcperBldMgrNo").val(),				//받는사람 건물번호
					"acperSvcCd" : "00",											//00 고정
					"acperBasAreaCd" : $("#clientAcperBasAreaCd").val(),			//받는사람 지역코드
					"acperZipcd" : clientAcperZipcd,								//받는사람 우편번호
					"dlvFare" :  clientSummFareTxt,									//입력된 운임
					"boxTypCd" : $("#clientBoxTyp").val(),
					"pickYmd" : smutil.getToday().replaceAll("-",""),	//오늘날짜
					"qty" : clientQty,
				}
			};

			smutil.loadingOn();
			// 공통 api호출 함수
			smutil.callApi(page.apiParam);

		},

		//거래처 택배 운임계산 콜백
		getFareAmtInfoCallback : function (result){
			smutil.loadingOff();
			if(smutil.apiResValidChk(result) && result.code === "0000"){
				page.fareAmtInfo = result.list[0];
				//운임등록
				if(page.isFare){
					const clientSummFareTxt = $("#clientSummFareTxt").val();
					$("#clientSummFare").val(clientSummFareTxt);
					LEMP.Window.alert({
						"_sTitle" : "운임계산",
						"_vMessage" : "운임이 등록되었습니다"
					});
				}else{
					$("#clientSummFare").val(page.fareAmtInfo.summFare);
					$("#clientSummFareTxt").val(page.fareAmtInfo.summFare);
				}
			} else {
				LEMP.Window.alert({
					"_sTitle" : "오류코드 : " + result.code,
					"_vMessage" : result.message
				});
			}
		},

		// 개인정보활용 동의 callback
		com1101Callback : function(result){
			if(result.agree == "true"){
				$("#" + result.etc + "Agree").prop("checked", true);
			}else{
				$("#" + result.etc + "Agree").prop("checked", false);
			}
		},

		// ################### 접수 start
		// 개인택배 접수
		postPidRsrvRgst : function(){
			smutil.loadingOn();
			var _this = this;

			var rsrvArtcPrc = $("#rsrvArtcPrc").val().replace(/[^0-9]/g, '') || "0";			// 화물가액
			var rsrvFareSctCd = $("input[name=rsrvFareSctCd]:checked").val();					// 운임구분
			var rsrvSvcCd = $("input[name=rsrvSvcCd]:checked").val();							// 서비스구분(특화구분)
			var rsrvFresYn = $("#rsrvFresYn").is(":checked")?"Y":"N";							// 신선on/off여부
			var rsrvSummFare = $("#rsrvSummFare").val().replace(/[^0-9]/g, '') || "0";			// 운임

			_this.apiParam.param.baseUrl = "smapis/pid/postPidRsrvRgst";			// api no
			_this.apiParam.param.callback = "page.pidRsrvRgstCallback";				// callback methode
			_this.apiParam.data = {										// api 통신용 파라메터
				"parameters" : {
					"ifof_sct_cd" : "60",								//예약접수처 코드 고정값(SMAPP:60)
					"snper_nm" : $("#rsrvSnperNm").val(),				//보내는사람이름
					"snper_tel" : $("#rsrvSnperTel").val(),				//보내는사람전화번호1
					"snper_cpno" : $("#rsrvSnperCpno").val(),			//보내는사람전화번호2
					"snper_zipcd" : $("#rsrvSnperZipcd").val(),			//보내는사람우편번호
					"snper_bld_mgr_no" : $("#rsrvSnperBldMgrNo").val(),	//보내는사람건물관리번호
					"snper_badr" : $("#rsrvSnperBadr").val(),			//보내는사람기본주소
					"snper_dadr" : $("#rsrvSnperDadr").val(),			//보내는사람상세주소
					"acper_nm" : $("#rsrvAcperNm").val(),				//받는사람이름
					"acper_tel" : $("#rsrvAcperTel").val(),				//받는사람전화번호1
					"acper_cpno" : $("#rsrvAcperCpno").val(),			//받는사람전화번호2
					"acper_zipcd" : $("#rsrvAcperZipcd").val(),			//받는사람우편번호
					"acper_bld_mgr_no" : $("#rsrvAcperBldMgrNo").val(),	//받는사람건물관리번호
					"acper_badr" : $("#rsrvAcperBadr").val(),			//받는사람기본주소
					"acper_dadr" : $("#rsrvAcperDadr").val(),			//받는사람상세주소
					"gds_cd" : $("#rsrvGdsCd").val(),					//상품구분코드
					"gds_nm" : $("#rsrvGdsNm").text(),					//상품구분명또는직접입력
					"fres_yn" : rsrvFresYn,								//신선on/off여부
					"artc_prc" : rsrvArtcPrc,							//화물가액
					"box_typ" : $("#rsrvBoxTyp").val(),					//박스및규격코드
					"box_qty" : $("#rsrvQty").val(),					//박스수량
					"svc_cd" : rsrvSvcCd,								//서비스(특화)구분(일반:00,특화:01)
					"fare_sct_cd" : rsrvFareSctCd,						//운임구분(현불:01,착불:02)

					"summ_fare" : rsrvSummFare,							//합계운임
					"sum_fare_base" : page.sum_fare_base,				//최종기본운임(수정전)
					"sum_fare_base_input" : page.sum_fare_base_input,	//최종기본운임(수정후)
//					"social_fare" : page.social_fare,					//사합금
					"air_fare" : page.air_fare,							//항공운임
					"ship_fare" : page.ship_fare,						//도선료

					"dlv_msg_cont" : $("#dlvMsgCont").val(),			//배송요청사항
					"prsn_info_agrm_yn" : "Y"							//개인정보 활용동의 체크 여부
				}
			};

			// 공통 api호출 함수
			smutil.callApi(_this.apiParam);
		},
		// 개인택배 접수 callback
		pidRsrvRgstCallback : function(result){
			smutil.loadingOff();
			if(smutil.apiResValidChk(result) && result.code == "0000"){
				LEMP.Window.alert({
					"_sTitle" : "개인 택배 접수",
					"_vMessage" : "접수되었습니다."
				});

				// 공통 > 보내는사람, 받는사람 정보저장 체크 (saveInfo 클래스 하위에 있는 input은 초기화 되지 않음)
				$("input[type='text']").not(".saveInfo input[type='text']").val("");	//text
				$("input[type='checkbox']").not(".saveInfo input[type='checkbox']").prop('checked', false);	//checkbox
				// 상품명 초기화
				$("#rsrvGdsCd").val("");
				$("#rsrvGdsNm").text("상품 분류를 선택해주세요.");
				// 박스수량 초기화
				$("#rsrvQty").val(1);
				// 특화구분, 운임구분 초기화
				$('input[name="rsrvSvcCd"]').removeAttr('checked');
				$('input[name="rsrvFareSctCd"]').removeAttr('checked');
				//체크되어있는 항목 모두 해제
				$("input:radio[name=rsrvSvcCd]:radio[value=00]").prop('checked', true);
				$("input:radio[name=rsrvFareSctCd]:radio[value=01]").prop('checked', true);
				// 배송요청사항 초기화
				$("#dlvMsgCont").val("");
				$("#dlvMsgContText").text("요청사항을 선택해주세요.");
			}else{
				LEMP.Window.alert({
					"_sTitle" : "개인 택배 접수 오류",
					"_vMessage" : "개인 택배 접수 도중 오류가 발생하였습니다."
				});
			}

		},

		// 반품 접수
		postPidRtnRgst : function(){
			smutil.loadingOn();
			var _this = this;

			var rtnFareSctCd = $("input[name=rtnFareSctCd]:checked").val(); //운임구분
			var rtnSvcCd = $("input[name=rtnSvcCd]:checked").val(); //서비스구분(특화구분)

			_this.apiParam.param.baseUrl = "smapis/pid/postPidRtnRgst";			// api no
			_this.apiParam.param.callback = "page.pidRtnRgstCallback";			// callback methode
			_this.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {
					"orgl_inv_no" : $("#rtnOrgInvNo").val(),		// 원송장번호
					"rtn_rsn_nm" : $("#rtnRsnNm").val(),			// 반품사유명

					"snper_nm" : $("#rtnSnperNm").val(),			// 보내는사람이름
					"snper_tel" : $("#rtnSnperTel").val(),			// 보내는사람전화번호1
					"snper_cpno" : $("#rtnSnperCpno").val(),		// 보내는사람전화번호2
					"snper_zipcd" : $("#rtnSnperZipcd").val(),		// 보내는사람우편번호
					"snper_badr" : $("#rtnSnperBadr").val(),		// 보내는사람주소
					"snper_dadr" : $("#rtnSnperDadr").val(),		// 보내는사람상세주소

					"acper_nm" : $("#rtnAcperNm").val(),			// 받는사람이름
					"acper_tel" : $("#rtnAcperTel").val(),			// 받는사람전화번호1
					"acper_cpno" : $("#rtnAcperCpno").val(),		// 받는사람전화번호2
					"acper_zipcd" : $("#rtnAcperZipcd").val(),		// 받는사람우편번호
					"acper_badr" : $("#rtnAcperBadr").val(),		// 받는사람주소
					"acper_dadr" : $("#rtnAcperDadr").val(),		// 받는사람상세주소

					"prsn_info_agrm_yn" : "Y"						// 개인정보활용동의체크여부(★)
				}
			};

			// 공통 api호출 함수
			smutil.callApi(_this.apiParam);
		},
		// 반품 접수 callback
		pidRtnRgstCallback : function(result){
			smutil.loadingOff();
			if(smutil.apiResValidChk(result) && result.code == "0000"){
				LEMP.Window.alert({
					"_sTitle" : "반품 접수",
					"_vMessage" : "접수되었습니다."
				});

				// 공통 > 보내는사람, 받는사람 정보저장 체크 (saveInfo 클래스 하위에 있는 input은 초기화 되지 않음)
				$("input[type='text']").not(".saveInfo input[type='text']").val("");	//text
				$("input[type='checkbox']").not(".saveInfo input[type='checkbox']").prop('checked', false);	//checkbox
			}else{
				LEMP.Window.alert({
					"_sTitle" : result.code,
					"_vMessage" : result.message
				});
			}
		},

		// 거래처택배 접수
		addTrvTsrvJobCust : function(){
			smutil.loadingOn();
			var _this = this;

			var clientFareSctCd = $("input[name=clientFareSctCd]:checked").val();					// 운임구분
			var clientSvcCd = $("input[name=clientSvcCd]:checked").val();							// 서비스구분(특화구분)
			var clientFresYn = $("#clientFresYn").is(":checked")?"Y":"N";							// 신선on/off여부
			var clientSummFare = $("#clientSummFareTxt").val().replace(/[^0-9]/g, '') || "0";			// 운임
			if(page.fareAmtInfo.summFare != clientSummFare){
				LEMP.Window.alert({
					"_sTitle" : "거래처 택배 접수",
					"_vMessage" : "운임이 변경되었습니다. 운임계산을 다시 클릭해 주세요"
				});
				smutil.loadingOff();
				return false;
			}

			_this.apiParam.param.baseUrl = "smapis/pid/addTrvRsrvJobCust";			// api no
			_this.apiParam.param.callback = "page.addTrvRsrvJobCustCallback";				// callback methode
			_this.apiParam.data = {										// api 통신용 파라메터
				"parameters" : {
					"ifof_sct_cd":"60",								//예약접수처 코드 고정값(SMAPP:60)
					"pick_ymd":smutil.getToday().replaceAll("-",""),	//오늘날짜
					"box_prtt":"Y",                     					//고정
					"ord_sct":"01",                    					//출고 고정
					"job_cust_cd":page.custData.job_cust_cd,					//거래처 코드
					"dev_brsh_cd":page.custData.dev_brsh_cd,            		//개발점소코드
					"dev_brsh_nm":page.custData.dev_brsh_nm, 				//개발점소이름
					"job_cust_form_nm":"출고",      							// --거래처조회(없음)
					"job_cust_form_cd":page.custData.job_cust_form_cd,			//거래처조회 > form코드
					"picsh_cd":$("#clientSnperCldlBrshCd").val(),			//집하점소코드
					"picsh_nm":$("#clientSnperCldlBrshNm").val(),			//집하점소이름
					//보내는사람
					"snper_nm":$("#clientSnperNm").val(),					//보내는사람 이름
					"snper_tel":$("#clientSnperTel").val(),					//보내는사람 전화번호
					"snper_cpno":$("#clientSnperCpno").val(),				//보내는사람 휴대폰번호
					"snper_badr":$("#clientSnperBadr").val(),				//보내는사람 주소
					"snper_dadr":$("#clientSnperDadr").val(),				//보내는사람 상세주소
					"snper_padr":$("#clientSnperBadr").val()+$("#clientSnperDadr").val(),	//보내는사람 주소+상세주소
					"snper_zipcd":$("#clientSnperZipcd").val(),				//보내는사람 우편번호
					"snper_bld_mgr_no":$("#clientSnperBldMgrNo").val(),		//보내는사람>건물관리번호
					"snper_bas_area_cd":$("#clientSnperBasAreaCd").val(),		//보내는사람 지역코드

					"snperFadr":"",
					"snperEtcAdr":"",
					"snperBldAnnm":"",
					"snperRdnmBadr":"",
					"snperRdnmDadr":"",
					"snperRdnm_FAdr":"",
					"snperRdnmBldNo":"",

					//받는사람
					"acper_nm":$("#clientAcperNm").val(),				// 받는사람 이름
					"acper_tel":$("#clientAcperTel").val(),				//받는사람 전화번호
					"acper_cpno":$("#clientAcperCpno").val(),			//받는사람 휴대폰번호
					"acper_badr":$("#clientAcperBadr").val(),			//받는사람 주소
					"acper_dadr":$("#clientAcperDadr").val(),			//받는사람 상세주소
					"acper_padr":$("#clientAcperBadr").val()+$("#clientAcperDadr").val(),	//받는사람 주소+상세주소
					"acper_zipcd":$("#clientAcperZipcd").val(),			//받는사람 우편번호
					"acper_bld_mgr_no":$("#clientAcperBldMgrNo").val(),	//받는사람 건물관리번호
					"acper_bas_area_cd":$("#clientAcperBasAreaCd").val(),	//받는사람 지역코드
					"dlv_pln_brsh_cd":$("#clientAcperCldlBrshCd").val(),	//배달점소코드
					"dlv_pln_brsh_nm":$("#clientAcperCldlBrshNm").val(),	//배달점소이름

					"acperFadr":"",
					"acperEtcAdr":"",
					"acperBldAnnm":"",
					"acperRdnmBadr":"",
					"acperRdnmDadr":"",
					"acperRdnm_FAdr":"",
					"acperRdnmBldNo":"",

					// 화물정보
					"qty":$("#clientQty").val(),                          //수량
					"ty_qty":$("#clientBoxTyp").val(),						//박스및규격코드
					"fare_sct_cd":clientFareSctCd,                			//운임 구분
					"svc_cd":clientSvcCd,									//특화 구분
					"fres_yn" : clientFresYn,								//신선on/off여부
					"org_inv_no":"",
					"grp_snper_cd":"",
					"grp_acper_cd":"",
					"dlv_fare":$("#clientSummFareTxt").val(),
					"summ_fare":page.fareAmtInfo.summFare,
					"bsc_fare":page.fareAmtInfo.bscFare,
					"jeju_cnco":page.fareAmtInfo.jejuCnco,
					"pick_pltn":page.fareAmtInfo.pickPltn,
					"dlv_pltn":page.fareAmtInfo.dlvPltn,
					"etc_fare":page.fareAmtInfo.etcFare,
					"cllt_fare":page.fareAmtInfo.clltFare,
					"etc_fare1":page.fareAmtInfo.etcFare1,
					"pick_rp":page.fareAmtInfo.pickRp,
					"dlv_rp":page.fareAmtInfo.dlvRp,
					"pick_tlgt":page.fareAmtInfo.pickTlgt,
					"dlv_tlgt":page.fareAmtInfo.dlvTlgt,
					"ispd_qty":"",
					"gds_nm":$("#clientGdsNm").text(),				//상품명(화면 입력)
					"gds_cd":$("#clientGdsCd").val(),				//상품명코드(화면 입력)
					"dlv_msg_cont":$("#dlvMsgClientCont").val(),			//배송요청사항
					"wms_ord_yn":"N",
					"shpm_cd":"",
					"usable_name_limit":"N",
					"jeju_rsph_uprc":0,
					"row_status":"C"
				}
			};
			// 공통 api호출 함수
			smutil.callApi(_this.apiParam);
		},

		// 거래처택배 접수 callback
		addTrvRsrvJobCustCallback : function(result){
			smutil.loadingOff();
			if(smutil.apiResValidChk(result) && result.code == "0000"){
				LEMP.Window.alert({
					"_sTitle" : "거래처 택배 접수",
					"_vMessage" : "접수되었습니다."
				});

				// 공통 > 보내는사람, 받는사람 정보저장 체크 (saveInfo 클래스 하위에 있는 input은 초기화 되지 않음)
				$("input[type='text']").not(".saveInfo input[type='text']").val("");	//text
				$("input[type='checkbox']").not(".saveInfo input[type='checkbox']").prop('checked', false);	//checkbox
				// 상품명 초기화
				$("#clientGdsCd").val("");
				$("#clientGdsNm").text("상품 분류를 선택해주세요.");
				// 박스수량 초기화
				$("#rsrvQty").val(1);
				// 특화구분, 운임구분 초기화
				$('input[name="clientSvcCd"]').removeAttr('checked');
				$('input[name="clientFareSctCd"]').removeAttr('checked');
				//체크되어있는 항목 모두 해제
				$("input:radio[name=clientSvcCd]:radio[value=00]").prop('checked', true);
				$("input:radio[name=clientFareSctCd]:radio[value=01]").prop('checked', true);
				// 배송요청사항 초기화
				$("#dlvMsgClientCont").val("");
				$("#dlvMsgContClientText").text("요청사항을 선택해주세요.");
			}
		},

		// 운임계산 callback
		pid0104Callback : function(result){
			page.sum_fare_final = result.sum_fare;					// 합계운임
			page.sum_fare_base = result.sum_fare_base;				//최종기본운임(수정전)
			page.sum_fare_base_input = result.sum_fare_base_input;	// 최종기본운임(수정후)
//			page.social_fare = result.social_fare;					// 사합금
			page.air_fare = result.air_fare;						// 항공운임
			page.ship_fare = result.ship_fare;						// 도선료

			$("#rsrvSummFare").val(result.sum_fare);
			$("#rsrvSummFareTxt").val((result.sum_fare+"").LPToCommaNumber());
		},

		/* 반품접수 > 반품지 선택  */
		returnChange : function(){
			if($("input[name='return']:checked").val() == "direct"){	//직접입력
				$(".rtnSnperSaveToggle").show();
				$("#rtnAcperNm").attr("readonly",false);
				$("#rtnAcperTel").attr("readonly",false);
				$("#rtnAcperCpno").attr("readonly",false);
				$("#rtnAcperDadr").attr("readonly",false);
				$("#rtnAcperAddSrch").attr("disabled",false);
			}else{
				$(".rtnSnperSaveToggle").hide();
				$("#rtnAcperNm").attr("readonly",true);
				$("#rtnAcperTel").attr("readonly",true);
				$("#rtnAcperCpno").attr("readonly",true);
				$("#rtnAcperDadr").attr("readonly",true);
				$("#rtnAcperAddSrch").attr("disabled",true);
			}
		},

		// ################### 접수 조회 end

		// 개인택배접수 > 보내는 사람 정보 받는 사람 정보에 복사
		rsrvRtnCopy : function() {
			if($("#rsrvInfoCopy").is(":checked")){
				$("#rsrvAcperNm").val($("#rsrvSnperNm").val());
				$("#rsrvAcperTel").val($("#rsrvSnperTel").val());
				$("#rsrvAcperCpno").val($("#rsrvSnperCpno").val());
				$("#rsrvAcperBldMgrNo").val($("#rsrvSnperBldMgrNo").val());
				$("#rsrvAcperZipcd").val($("#rsrvSnperZipcd").val());
				$("#rsrvAcperBadr").val($("#rsrvSnperBadr").val());
				$("#rsrvAcperDadr").val($("#rsrvSnperDadr").val());
			}
		},

		// 거래처 택배접수 > 보내는 사람 정보 받는 사람 정보에 복사
		rtnClientCopy : function() {
			if($("#clientInfoCopy").is(":checked")){
				$("#clientAcperCustNm").val($("#clientSnperCustNm").val());
				$("#clientAcperCustCd").val($("#clientSnperCustCd").val());
				$("#clientAcperNm").val($("#clientSnperNm").val());
				$("#clientAcperTel").val($("#clientSnperTel").val());
				$("#clientAcperCpno").val($("#clientSnperCpno").val());
				$("#clientAcperBldMgrNo").val($("#clientSnperBldMgrNo").val());
				$("#clientAcperZipcd").val($("#clientSnperZipcd").val());
				$("#clientAcperBadr").val($("#clientSnperBadr").val());
				$("#clientAcperDadr").val($("#clientSnperDadr").val());
				$("#clientAcperBasAreaCd").val($("#clientSnperBasAreaCd").val());
				$("#clientAcperCldlBrshCd").val($("#clientSnperCldlBrshCd").val());
				$("#clientAcperCldlBrshNm").val($("#clientSnperCldlBrshNm").val());

			}
		},

		// 반품접수 > 보내는 사람 정보 받는 사람 정보에 복사
		rtnRsrvCopy : function() {
			//보내는 사람 정보와 동일 체크시, 반품지 선택이 직접입력일 경우
			if($("#rtnInfoCopy").is(":checked") && $("input[name='return']:checked").val() == "direct"){
				$("#rtnAcperNm").val($("#rtnSnperNm").val());
				$("#rtnAcperTel").val($("#rtnSnperTel").val());
				$("#rtnAcperCpno").val($("#rtnSnperCpno").val());
				$("#rtnAcperBldMgrNo").val($("#rtnSnperBldMgrNo").val());
				$("#rtnAcperZipcd").val($("#rtnSnperZipcd").val());
				$("#rtnAcperBadr").val($("#rtnSnperBadr").val());
				$("#rtnAcperDadr").val($("#rtnSnperDadr").val());
			}
		},

		//거래처명 검색
		jobCustList: function (search){
			smutil.loadingOn();
			page.searchType = "Cust";										// 검색타입 거래처
			page.apiParam.param.baseUrl = "smapis/pid/jobCustList";			// api no
			page.apiParam.param.callback = "page.jobCustListCallback";		// callback methode
			page.apiParam.data = {
				"parameters": {
					"srchJobCust" : search,			//거래처명(코드)
				}
			};

			// 공통 api호출 함수
			smutil.callApi(page.apiParam);
		},

		//거래처명 검색 콜백
		jobCustListCallback : function(result){
			try{

				if(smutil.apiResValidChk(result) && result.code == "0000"){

					// 코드와 일치하는 항목이 1개있는경우 팝업을 따로 띄우지않음
					if(result.data_count === 0){
						LEMP.Window.alert({
							"_sTitle" : "코드 조회 ",
							"_vMessage" : "코드 항목이 없습니다."
						});
						return false;
					}else if(result.data_count === 1){
						const data = result.data.list[0]; //data = [];
						// 코드 셋팅
						page.codeSetting(data);

					}else{
						// 코드 조회 팝업
						let popUrl = smutil.getMenuProp("PID.PID0105","url");
						LEMP.Window.open({
							"_sPagePath" : popUrl,
							"_oMessage" : {
								"clientList" : result.data.list,	//검색결과 리스트
								"tabCd" : page.tabCd,				//현재 탭
								"type" : page.searchType,			//검색 타입
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

		//고정송수하주 검색
		fixShcnList: function (search){
			smutil.loadingOn();
			page.searchType = "Fix";
			page.apiParam.param.baseUrl = "smapis/pid/fixShcnList";			// api no
			page.apiParam.param.callback = "page.fixShcnListCallback";		// callback methode
			page.apiParam.data = {
				"parameters": {
					"srchJobCustCd" : search,								//조회된 거래처코드
					"srchShcnSctCd" : page.addrTypeCd,						//송하인(1), 수하인(2)
				}
			};

			// 공통 api호출 함수
			smutil.callApi(page.apiParam);
		},

		//고정송수하주 검색콜백
		fixShcnListCallback : function (result){
			try{

				if(smutil.apiResValidChk(result) && result.code == "0000"){

					// 코드와 일치하는 항목이 1개있는경우 팝업을 따로 띄우지않음
					if(result.data_count === 0){
						LEMP.Window.alert({
							"_sTitle" : "코드 조회 ",
							"_vMessage" : "코드 항목이 없습니다."
						});
						return false;
					}else if(result.data_count === 1){
						const data = result.data.list[0]; //data = [];
						// 코드 셋팅
						page.codeSetting(data);

					}else{
						// 코드 조회 팝업
						const popUrl = smutil.getMenuProp("PID.PID0105","url");
						LEMP.Window.open({
							"_sPagePath" : popUrl,
							"_oMessage" : {
								"clientList" : result.data.list,	//검색결과 리스트
								"tabCd" : page.tabCd,				//현재 탭
								"type" : page.searchType,			//검색 타입
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

		// 검색결과가 하나일경우 코드 셋팅
		codeSetting : function(data){
			const area = page.codeAreaCd;
			const type = page.searchType;
			const id = "#" + page.tab_cd + page.addrTypeNm;

			if(page.searchType === "Cust"){
				page.custData = data;
				//거래처명, 코드 입력
				$(id+'CustNm').val(data.job_cust_nm);
				$(id+'CustCd').val(data.job_cust_cd);

				//집하점 기본설정
				$(id + "Nm").val(data.mgr_cust_nm);							//이름
				$(id + "Tel").val(data.pick_tel);							//전화번호
				$(id + "Zipcd").val(data.pick_zipcd);						//우편번호
				$(id + "BldMgrNo").val(data.pick_bld_mgr_no);				//건물번호
				$(id + "Badr").val(data.pick_badr);							//주소
				$(id + "Dadr").val(data.pick_dadr);							//상세주소
				$(id + "BasAreaCd").val(data.pick_bas_area_cd);				//지역코드
				$(id + "CldlBrshCd").val(data.picsh_cd);					//집하점소드코드
				$(id + "CldlBrshNm").val(data.picsh_nm);					//집하점소드코드

				page.rtnClientCopy();										//수하인 정보에 복사

				//////////////////화물정보 세팅/////////////
				//박스및규격
				let list = [];

				if(!smutil.isEmpty(data.a_svc_cd)){
					let tmpItem = {};
					tmpItem.dtl_cd = "A";
					tmpItem.dtl_cd_nm = "A";
					list.push(tmpItem);
				}
				if(!smutil.isEmpty(data.b_svc_cd)){
					let tmpItem = {};
					tmpItem.dtl_cd = "B";
					tmpItem.dtl_cd_nm = "B";
					list.push(tmpItem);
				}
				if(!smutil.isEmpty(data.c_svc_cd)){
					let tmpItem = {};
					tmpItem.dtl_cd = "C";
					tmpItem.dtl_cd_nm = "C";
					list.push(tmpItem);
				}
				if(!smutil.isEmpty(data.d_svc_cd)){
					let tmpItem = {};
					tmpItem.dtl_cd = "D";
					tmpItem.dtl_cd_nm = "D";
					list.push(tmpItem);
				}
				if(!smutil.isEmpty(data.e_svc_cd)){
					let tmpItem = {};
					tmpItem.dtl_cd = "E";
					tmpItem.dtl_cd_nm = "E";
					list.push(tmpItem);
				}
				if(!smutil.isEmpty(data.f_svc_cd)){
					let tmpItem = {};
					tmpItem.dtl_cd = "F";
					tmpItem.dtl_cd_nm = "F";
					list.push(tmpItem);
				}
				if (!smutil.isEmpty(list) && list.length>0){
					$('#clientBoxTyp').children('option').remove();
					smutil.setSelectOptions("#clientBoxTyp", list);
					//박스규격 기본으로 선택되지 않도록
					$('#clientBoxTyp').val("");
				}

				//운임구분
				if(!smutil.isEmpty(data.fare_sct_cd)){
					const fare_value = "clientFareSct"+data.fare_sct_cd;
					$("input:radio[name=clientFareSctCd]:radio[value=" + data.fare_sct_cd + "]").prop('checked', true);
				}

			}else if(page.searchType === "Fix"){
				//고정송수하주 검색결과 세팅
				$(id + "Nm").val(data.shcn_nm);				//이름
				$(id + "Tel").val(data.tel);				//전화번호
				$(id + "Zipcd").val(data.zipcd);			//우편번호
				$(id + "BldMgrNo").val(data.bld_mgr_no);	//건물번호
				$(id + "Badr").val(data.ldno_badr);			//주소
				$(id + "Dadr").val(data.ldno_dadr);			//상세주소
				$(id + "BasAreaCd").val(data.basAreaCd);
				$(id + "CldlBrshCd").val(data.picsh_cd);					//집하점소드코드
				$(id + "CldlBrshNm").val(data.picsh_nm);					//집하점소드코드

				if(page.tab_cd + page.addrTypeNm === "rsrvSnper"){
					page.rsrvRtnCopy();					// 보내는 사람 정보와 동일(개인택배접수)
				}

				if(page.tab_cd === 'client'){
					page.getHpsrAreaInfo(data);			//거래처택배>고정송수하주 추가정보 검색
				}
			}
		},

		// 거래처, 고정송수하주 팝업 callback
		pid0105Callback : function(result){
			try {
				const type = result.type;			// 조회 종류
				const code = result.code;			// 코드
				const name = result.name;			// 이름

				if(!smutil.isEmpty(type)){
					if(type === "Cust"){
						page.codeSetting(result);
					}else if(type === "Fix"){
						page.codeSetting(result);
					}
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

		//고정송수하주 추가 주소검색
		getHpsrAreaInfo : function (data){
			smutil.loadingOn();
			page.apiParam.param.baseUrl = "smapis/pid/getHpsrAreaInfo";			// api no
			page.apiParam.param.callback = "page.getHpsrAreaInfoCallback";		// callback methode
			page.apiParam.data = {
				"parameters": {
					"bldMgrNo" : data.bld_mgr_no,			//건물번호
					"zipcd" : data.zipcd,				//우편번호
					"basAreaCd" : data.basAreaCd,
				}
			};

			// 공통 api호출 함수
			smutil.callApi(page.apiParam);
		},

		//고정송수하주 추가 주소검색 콜백
		getHpsrAreaInfoCallback : function (result){
			try{
				if(smutil.apiResValidChk(result) && result.code === "0000"){
					if(page.tab_cd === 'client'){
						const id = "#" + page.tab_cd + page.addrTypeNm;
						$(id + "CldlBrshCd").val(result.cldlBrshCd);			//담당점소코드

						if(page.tab_cd + page.addrTypeNm === "clientSnper"){
							page.rtnClientCopy();					// 보내는 사람 정보와 동일(거래처 택배접수)
						}
					}
				}
			}
			catch(e){}
			finally{
				smutil.loadingOff();			// 로딩바 닫기
				page.apiParamInit();			// 파라메터 전역변수 초기화
			}
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

/* 휴대폰/회사번호 번호검색(하이픈'-' 자동입력) */
function autoHypenPhone(str) {

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
}
