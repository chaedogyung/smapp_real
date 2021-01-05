var page = {
		
		argInvNo : null,			// 송장번호
		argRsrvMgrNo : null,		// 접수번호
		argCorpSctCd : null,		// 업체구분코드
		argFresYn : null,			// 신선식품여부
		
		// api 호출 기본 형식
		apiParam : {
			id:"HTTP",				// 디바이스 콜 id
			param:{					// 디바이스가 알아야할 데이터
				task_id : "",		// 화면 ID 코드가 들어가기로함
				//position : {},	// 사용여부 미확정 
				type : "",
				baseUrl : "",
				method : "POST",	// api 호출 형식(지정 안하면 'POST' 로 자동 셋팅)
				callback : "",		// api 호출후 callback function
				contentType : "application/json; charset=utf-8"
			},
			data:{"parameters" : {}}// api 통신용 파라메터
		},
		
		init:function(arg)
		{
			var obj;
			
			page.argInvNo = String(arg.data.inv_no);
			page.argRsrvMgrNo = String(arg.data.rsrv_mgr_no);
			page.argCorpSctCd = arg.data.corp_sct_cd;
			
			page.initEvent();			// 페이지 이벤트 등록
			page.initDpEvent();			// 화면 디스플레이 이벤트
		},
		
		// 페이지 이벤트 등록
		initEvent : function()
		{
			var _this = this;
			
			/* 팝업 닫기 */
			$(document).on("click",".btn.closeW.paR",function(){
				LEMP.Window.close({
					"_oMessage":{
						"param":null
					},
					"_sCallback" : "page.listReLoad"
				});
			});
			
			/* 통화 버튼 클릭 */
			$(document).on('click', '.btn.mobile', function(e){
				var phoneNumberTxt = $(this).data('phoneNumber');
				
				// 전화걸기 팝업 호출
				$('#phoneNumber').text(phoneNumberTxt);
				$('.mpopBox.phone').bPopup();
				
			});
			
			/* 통화 팝업 > 통화버튼 클릭*/
			$('#phoneCallYesBtn').click(function(e){				
				LEMP.System.callTEL({
					"_sNumber":$("#phoneNumber").text().replace(/\-/g,'')
				});
				$('.mpopBox.phone').bPopup().close();
			});
			
			/* 지도팝업*/
			$(document).on("click",".btn.map",function(){
				smutil.loadingOn();
				var popUrl = smutil.getMenuProp('COM.COM0202', 'url');
				LEMP.Window.open({
					"_sPagePath" : popUrl,
					"_oMessage" : {
						"param" : {
							"cldl_sct_cd" : "P",									//업무구분코드 (A:전체, P:집하,D:배달)
							"inv_no" : page.argInvNo,								//운송장번호
							"shcn_sct_cd" : $(this).closest(".infoBox").attr("id")	//송수하인 구분 (단건 조회 시, 필수)
						}
					}
				});
				smutil.loadingOff();
			});
			
			/* 신선여부 클릭 */
//			$(document).on("click","#sw",function(){
//				if ($(this).is(":checked")) {
//					page.argFresYn = "Y"
//				}else {
//					page.argFresYn = "N"
//				}
//				page.fresUpt();
//			});
			
			//###################################### handlebars helper 등록 start
			// 송장번호 형식 표시
			Handlebars.registerHelper('invNoTmpl', function(options) {
				if(!smutil.isEmpty(this.inv_no)){
					return (this.inv_no).replace(/([0-9]{4})([0-9]{4})([0-9]{4})/,"$1-$2-$3");
				}
				else{
					return "";
				}
			});
			
			// 신선식품 여부 체크
			Handlebars.registerHelper('fresYnChk', function(options) {
				if(this.fres_yn === "Y"){	// 신선식품
					// options.fn == if(true)
					return options.fn(this)
				}
				else{	// 신선식품 아님
					return options.inverse(this);
				}
			});
			
			// 박스 규격
			Handlebars.registerHelper('boxMgntTml', function(options) {
				switch (this.box_mgnt){
				    case "A" :
				        return "소";
				        break;
				    case "B" :
				    	return "중";
				        break;
				    case "C" :
				    	return "대";
				        break;
				    default :
				    	return "값없음";
			        	break;
				}
			});
			
			// 지도 버튼 > 송장번호 있을때만 출력
			Handlebars.registerHelper('mapBtn', function(options) {
				if(smutil.isEmpty(page.argInvNo)){
					return "";
				}
				else{
					var html = '<button class="btn map">지도</button>';
					return new Handlebars.SafeString(html); // mark as already escaped
				}
			});
			
			//합계운임
			Handlebars.registerHelper('commaSummFare', function(summ_fare) {
				return (this.summ_fare+"").LPToCommaNumber();
			});
			
			//기본운임
			Handlebars.registerHelper('commaBscFare', function(bsc_fare) {
				return (this.bsc_fare+"").LPToCommaNumber();
			});

			//기타운임
			Handlebars.registerHelper('commaEtcFare', function(etc_summ_fare) {
				return (this.etc_summ_fare+"").LPToCommaNumber();
			});
			
			// //항공운임
			// Handlebars.registerHelper('commaAirf', function(airf) {
			// 	return (this.airf+"").LPToCommaNumber();
			// });
			//
			// //할증료
			// Handlebars.registerHelper('commaPltg', function(pltg) {
			// 	return (this.pltg+"").LPToCommaNumber();
			// });
			//
			// //합계운임
			// Handlebars.registerHelper('commaExtch', function(extch) {
			// 	return (this.extch+"").LPToCommaNumber();
			// });
			
		},
		
		initDpEvent : function()
		{
			var _this = this;
			smutil.loadingOn();
			_this.rsrvDtlSearch();
		},
		
		// ################### 상세 페이지 정보 조회 start
		rsrvDtlSearch : function(){
			var _this = this;
			
			_this.apiParam.param.baseUrl = "smapis/pid/rsrvDtl";			// api no
			_this.apiParam.param.callback = "page.rsrvDtlCallback";			// callback methode
			_this.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {
					"inv_no" : page.argInvNo,
					"rsrv_mgr_no" : page.argRsrvMgrNo
				}
			};
			
			// 공통 api호출 함수 
			smutil.callApi(_this.apiParam);
		},
		rsrvDtlCallback : function(result){			
			try{
				
				if(smutil.apiResValidChk(result) && result.code == "0000"){
					if(result){
						data = result.data.list[0];
					}
					
					// 의류 특화이면서, 신선여부 키가 존재한다면 fres_yn 키를 삭제
					if (data.svc_cd === "01" && data.hasOwnProperty("fres_yn")) {
						delete data.fres_yn;
					}
					
					// 핸들바 템플릿 가져오기
					var source = $("#pid0102_detail_template").html();
					
					// 핸들바 템플릿 컴파일
					var template = Handlebars.compile(source); 
					
					// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
					var contentHtml = template(data);
			
					// 생성된 HTML을 DOM에 주입
					$('#contents').html(contentHtml);
				}
				
			}
			catch(e){}
			finally{
				smutil.loadingOff();			// 로딩바 닫기
				page.apiParamInit();			// 파라메터 전역변수 초기화
			}
			
		},
		// ################### 상세 페이지 정보 조회 end
		
		// ################### 신선여부 저장 start
		fresUpt : function(){
			var _this = this;
			
			_this.apiParam.param.baseUrl = "/smapis/cldl/fresUpt";			// api no
			_this.apiParam.param.callback = "page.fresUptCallback";			// callback methode
			_this.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {
					"inv_no" : page.argInvNo,
					"rsrv_mgr_no" : page.argRsrvMgrNo,
					"fres_yn" : page.argFresYn
				}
			};
			
			// 공통 api호출 함수 
			smutil.callApi(_this.apiParam);
		},
		fresUptCallback : function(result){
			try{
				if(smutil.apiResValidChk(result) && result.code == "0000"){
					
				}else{
					LEMP.Window.toast({
						"_sMessage" : "신선 통신 에러",
						"_sDuration" : "short"
					});
				}
			}
			catch(e){}
			finally{
				smutil.loadingOff();			// 로딩바 닫기
			}
			
		},
		// ################### 신선여부 저장 end
		
		
		// api 파람메터 초기화 
		apiParamInit : function(){
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
};