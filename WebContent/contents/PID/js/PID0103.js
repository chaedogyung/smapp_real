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
		air_fare : null,	// 항공운임
		ship_fare : null,	// 도선료
		
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
				var tab_cd = $(this).data('tabCd');		// 선택한 탭의 값 (rsrv,rtn)

				var btnTab = $(".tabBtn");
				var btnObj;
				_.forEach(btnTab, function(obj, key) {
					btnObj = $(obj);
					var objTabCd = btnObj.data('tabCd');
					if(tab_cd == objTabCd){
						btnObj.closest('li').addClass( 'on' );
						$("."+objTabCd+"Li").show();	//ex).rsrvLi,.rtnLi
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
			$("#rsrvSnperSave, #rsrvAcperSave, #rtnSnperSave").on('click', function(){
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
				page.fareCalcSearch();
			});
			
			/* 개인택배접수 > 플러스 마이너스 */
			page.plusMinus(".inNum .btn.minus",".inNum .btn.plus2",30,1,".inNum .valNum");
			
			/* 개인택배접수 > 배송요청사항 팝업 */
			$(document).on("click","#dlvMsg",function(){
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
			$("#sendBtn").on('click', function(){
				
				// 공통 > 현제 어느 탭에 있는지 검사 (예약/지시, 거래처출고)
				var btnTab = $(".tabBtn");
				var btnObj;
				
				_.forEach(btnTab, function(obj, key) {
					btnObj = $(obj);
					
					if(btnObj.closest('li').is('.on')){
						tab_btn = btnObj.data('tabCd');
					}
				});
				
				
				if(tab_btn == "rsrv"){ // 개인택배접수
					
					//input check
					var result = to_validation($(".rsrvLi"));
					if(result == false)
						return false;
					
					var rsrvArtcPrc = parseInt($("#rsrvArtcPrc").val().replace(/[^0-9]/g, '')) || 0;
					if(rsrvArtcPrc < 10000){
						LEMP.Window.alert({
							"_sTitle" : "미입력",
							"_vMessage" : "화물가액을 만 단위 이상으로 입력해주세요."
						});
						return false;
					}
					
					if(rsrvArtcPrc > 3000000){
						LEMP.Window.alert({
							"_sTitle" : "",
							"_vMessage" : "화물가액은 최대 3,000,000원까지 입력 가능합니다."
						});
						$("#rsrvArtcPrc").focus();
						return false;
					}
					
					var boxCnt = $("#rsrvQty").val();
					if(boxCnt < 1){
						LEMP.Window.alert({
							"_sTitle" : "미입력",
							"_vMessage" : "박스 수량은 1개 이상입니다."
						});
						$("#rsrvQty").focus();
						return false;
					}
					
					// 개인정보 활용 동의
					if($("#rsrvAgree").is(":checked") == false){
						LEMP.Window.alert({
							"_sTitle" : "개인정보 활용 동의",
							"_vMessage" : "개인정보 활용에 동의해주세요."
						});
						$("#rsrvAgree").focus();
						return false;
					}
					
					// API에서 box수량만큼 등록
					page.postPidRsrvRgst();

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
				
				if(!smutil.isEmpty(dtl_cd)){
					if(typ_cd == "LRG_ITEM_KND_CD"){			// 상품 분류
						
						// 현제 어느 탭에 있는지 검사 (예약/지시, 거래처출고)
						var btnTab = $(".tabBtn");
						var btnObj;
						
						_.forEach(btnTab, function(obj, key) {
							btnObj = $(obj);
							
							if(btnObj.closest('li').is('.on')){
								tab_btn = btnObj.data('tabCd');
							}
						});
						
						if(tab_btn == "rsrv"){
							$("#rsrvGdsCd").val(dtl_cd);
							$("#rsrvGdsNm").text(dtl_cd_nm);
						}else{
//							$("#rtnGdsCd").val(dtl_cd);
//							$("#rtnGdsNm").text(dtl_cd_nm);
						}
						
					}else if(typ_cd == "SMAPP_DLV_MSG_CD"){	// 배송요청사항
						$("#dlvMsgCont").val(dtl_cd_nm);
						$("#dlvMsgContText").text(dtl_cd_nm);
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
		
		// 운임 계산  callback
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
		
		// 운임계산 callback
		pid0104Callback : function(result){
			page.sum_fare_final = result.sum_fare;					// 합계운임
			page.sum_fare_base = result.sum_fare_base;				//최종기본운임(수정전)
			page.sum_fare_base_input = result.sum_fare_base_input;	// 최종기본운임(수정후)
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
