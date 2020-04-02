var page = {
		cerk : null,				// 롯데 홈쇼핑 인증키
		argRsrvMgrNo : null,		// 접수번호
		initData : null,			// 받은 데이터
		lotteApiCallType : null,	// API 요청 타입
		cnclReqCuseCntt : null,		// 입찰 취소 사유
		
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
			page.argRsrvMgrNo = String(arg.data.rsrv_mgr_no);
			
			page.initEvent();			// 페이지 이벤트 등록
			page.initDpEvent();			// 화면 디스플레이 이벤트
		},
		
		// 페이지 이벤트 등록
		initEvent : function()
		{
			var _this = this;
			
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
			
			/* 입찰요청 */
			$(document).on('click','.bidRequest',function(){
				page.lotteApiCallType = "reqRecv";
				page.getLhCerk();
			});
			
			
			/* 입찰취소 */
			$(document).on('click','.bidCancle',function(){
				page.lotteApiCallType = "cnclReqRecv";
				// 바로반품 취소 사유 등록
				var popUrl = smutil.getMenuProp("COM.COM0901","url");
				LEMP.Window.open({
					"_sPagePath" : popUrl,
					"_oMessage" : {
						"param" : {
							"typ_cd" : "SMAPP_LH_CCL_RSN_CD"
						}
					}
				});
			});
			
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
			
			// 버튼 상태
			// 전체:A, 입찰성공:S, 입찰실패:F,입찰대기:N, 반품취소:C, 지연취소:D
			Handlebars.registerHelper('statCdBtn', function(options) {
				var html;
				
				if(this.stat_cd == "N"){ //입찰대기
					if(this.bd_sct_cd == "S")  //단건:S,복수:M
						html = '<button class="btn red m w100p bidRequest">입찰</button>';
					else
						html = '<button class="btn red m w100p bidRequest">복수입찰</button>';
				}else if(this.stat_cd == "S" && this.ccl_able_yn == "Y"){ // 취소요청 
					html = '<button class="btn red m w100p bidCancle">취소요청</button>';
				}else{
					html = '';
				}
				
				return new Handlebars.SafeString(html); // mark as already escaped
			});
			
			// 취소사유 반품취소:C, 지연취소:D
			Handlebars.registerHelper('cclrsnTml', function(options) {
				var html;
				
				if(this.stat_cd == "C"){ //반품취소
					html = '<dt class="vt">취소사유</dt><dd>' + this.ccl_rsn + '</dd>';
				}else{
					html = '';
				}
				
				return new Handlebars.SafeString(html); // mark as already escaped
			});
			
			Handlebars.registerHelper('statTml', function(options) {
				
				if(this.stat_cd == "S" && this.ccl_able_yn == "N"){ //입찰성공 3시간 경과
					return "취소불가 (3시간 경과)";
				}else{
					return this.stat_nm;
				}
				
			});
			
			//###################################### handlebars helper 등록 end
			
		},
		
		initDpEvent : function()
		{
			var _this = this;
			smutil.loadingOn();
			_this.lhRtgDtlSearch();
		},
		
		// ################### 바로반품 상세 조회 start
		lhRtgDtlSearch : function(){
			var _this = this;
			
			_this.apiParam.param.baseUrl = "smapis/pid/lhRtgDtl";		// api no
			_this.apiParam.param.callback = "page.lhRtgDtlCallback";	// callback methode
			_this.apiParam.data = {										// api 통신용 파라메터
				"parameters" : {
					"rsrv_mgr_no" : page.argRsrvMgrNo
				}
			};
			
			// 공통 api호출 함수 
			smutil.callApi(_this.apiParam);
		},
		lhRtgDtlCallback : function(result){			
			try{
				if(result){
					data = result.data.list[0];
				}
				
				page.initData = data;
				
				// 핸들바 템플릿 가져오기
				var source = $("#pid0401_dtl_template").html();
				
				// 핸들바 템플릿 컴파일
				var template = Handlebars.compile(source); 
				
				// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
				var contentHtml = template(data);
		
				// 생성된 HTML을 DOM에 주입
				$('#contents').html(contentHtml);
				
				//상품 셋팅
				page.multiGdsSearch();
			}
			catch(e){}
			finally{
				page.apiParamInit();			// 파라메터 전역변수 초기화
			}
			
		},
		// ################### 바로반품 상세 조회 end
		
		// ################### 바로반품 상품 조회 start
		multiGdsSearch : function(){
			var _this = this;
			
			_this.apiParam.param.baseUrl = "smapis/pid/lhRtgDtlMultiGds";		// api no
			_this.apiParam.param.callback = "page.multiGdsCallback";	// callback methode
			_this.apiParam.data = {										// api 통신용 파라메터
				"parameters" : {
					"rsrv_mgr_no" : page.argRsrvMgrNo
				}
			};
			
			// 공통 api호출 함수 
			smutil.callApi(_this.apiParam);
		},
		multiGdsCallback : function(result){
			
			try{
				if(result){
					data = result.data;
				}
				
				// 핸들바 템플릿 가져오기
				var source = $("#pid0401_gds_template").html();
				
				// 핸들바 템플릿 컴파일
				var template = Handlebars.compile(source); 
				
				// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
				var contentHtml = template(data);
		
				// 생성된 HTML을 DOM에 주입
				$('#multiGds').html(contentHtml);
			}
			catch(e){}
			finally{
				smutil.loadingOff();			// 로딩바 닫기
				page.apiParamInit();			// 파라메터 전역변수 초기화
			}
			
		},
		// ################### 바로반품 상품 조회 end
		
		// ################### 롯데홈쇼핑 인증키  조회 start
		getLhCerk : function() {
			smutil.loadingOn();
			
			// 오늘 날짜
			var today = new Date();
			today = today.LPToFormatDate("yyyymmdd");
			
			// 생성된 인증키
			var lotteCerk = LEMP.Properties.get({
				"_sKey" : "lotteCerk"
			});
			
			if(!smutil.isEmpty(lotteCerk)){
				// 인증키 생성일과 날짜가 다르면 새로 발급
				if(today != lotteCerk.date){
					// 저장되어있던 토큰 삭제
					LEMP.Properties.remove({"_sKey":"lotteCerk"});
					page.setLhCerkTrmn();
				}else{
					page.cerk = lotteCerk.cerk;
					
					// 입찰요청 : reqRecv, 입찰실패 : reqRecv
					if(page.lotteApiCallType == "reqRecv"){
						page.ReqRecv();
					}else if(page.lotteApiCallType == "cnclReqRecv"){
						page.cnclReqRecv();
					}
				}
			}else{
				// 저장되어있던 토큰 삭제
				LEMP.Properties.remove({"_sKey":"lotteCerk"});
				page.setLhCerkTrmn();
			}
			
		},
		setLhCerkTrmn : function() {
			var tr = {
				id : "HTTPDIRECT",
				param : {
					baseUrl : "/lhwms/rest/LhCerkTrmn/call?companyCode=LH",
					callback : "page.LhCerkTrmnCallback",
					data:{
						"cerkUserId" : "11"	//택배사코드(롯데글로벌로지스 : 11)
					}// api 통신용 파라메터
				}
			};

			// native 기능 호출
			smutil.nativeMothodCall(tr);
		},
		LhCerkTrmnCallback : function(res) {
			
			try{
				if(res.statusCode == "200"){
					var data = res.result;
					// 정상처리
					if(data.resultCd === "1"){
						
						var today = new Date();
						today = today.LPToFormatDate("yyyymmdd");
						
						// 인증키 저장
						var lotteCerkInfo = {
								"cerk" : data.cerk,			// 인증 토큰
								"date" : today				// 생성일
						};
						LEMP.Properties.set({
							"_sKey" : "lotteCerk",
							"_vValue" : lotteCerkInfo
						});
						
						// 입찰요청 : reqRecv, 입찰실패 : reqRecv
						if(page.lotteApiCallType == "reqRecv"){
							page.ReqRecv();
						}else if(page.lotteApiCallType == "cnclReqRecv"){
							page.cnclReqRecv();
						}
						
					}
				}
			}catch(e){}
			finally{
				smutil.loadingOff();
			}
		},
		// ################### 롯데홈쇼핑 인증키  조회 start
		
		// ################### 롯데홈쇼핑 입찰요청  조회 start
		// 입찰
		ReqRecv : function() {
			smutil.loadingOn();
			var now = page.getTimeStamp();
			var data = page.initData;
			
			var tr = {
				id : "HTTPDIRECT",
				param : {
					baseUrl : "/lhwms/rest/LhBrRegdTndrReqRecv/call?companyCode=LH",
					callback : "page.ReqRecvCallback",
					data:{
						"cerk" : page.cerk,					// 인증키
						"hodecoCode" : "11",				// 택배사코드(롯데글로벌로지스 : 11)
						"ordNo" : data.real_ord_no,				// 실제주문번호
						"ordGoodsSeq" : data.ord_goods_seq,				// 주문상품순번
						"ordGoodsDtlSeq" : data.ord_goods_dtl_seq,		// 주문상품상세순번
						"ordGoodsDelySeq" : data.ord_goods_dely_seq,		// 주문상품배송순번
						"reqDt" : now,						// 요청일시
						"intfDt" : now						// 인터페이스일시 
					}// api 통신용 파라메터
				}
			};
			
			// native 기능 호출
			smutil.nativeMothodCall(tr);
		},
		ReqRecvCallback : function(res) {
			
			try{
				if(res.statusCode == "200"){
					if(res.result.resultCd === "1"){
						LEMP.Window.alert({
							"_sTitle" : "알림",
							"_vMessage" : res.result.resultMsg
						});
						page.lhRtgBdPrc("S");
					}else{
						LEMP.Window.alert({
							"_sTitle" : "입찰 요청 실패",
							"_vMessage" : res.result.resultMsg
						});
						page.lhRtgBdPrc("F");
					}
				}else{
					LEMP.Window.alert({
						"_sTitle" : "알림",
						"_vMessage" : "실패"
					});
					page.lhRtgBdPrc("F");
				}
			}catch(e){}
			finally{
				smutil.loadingOff();
			}
		},

		// 바로반품 입찰 후처리
		lhRtgBdPrc : function(resultCd){
			
			var now = page.getTimeStamp();
			var data = page.initData;
			
			var _this = this;
			_this.apiParam.param.baseUrl = "/smapis/pid/lhRtgBdPrc";				//api no
			_this.apiParam.param.callback = "page.lhRtgBdPrcCallback";				//callback methode
			_this.apiParam.data = {				// api 통신용 파라메터
					"parameters" : {
						"result_cd" : resultCd,								// 롯데홈쇼핑 api 결과 코드
						"real_ord_no" :	data.real_ord_no,					// 주문번호
						"delypl_postno" : $.trim(data.delypl_postno),		// 배송지우편번호
						"delypl_postno_addr" : $.trim(data.delypl_postno_addr),		// 배송지주소
						"delypl_postno_eaddr" :	$.trim(data.delypl_postno_eaddr),	// 배송지상세주소
						"rcimn_real_hpno" :	smutil.nullToValue(data.rcimn_real_hpno,"") // 카카오톡 전화번호
						
					}
				};
			
			//공통 api호출 함수
			smutil.callApi(_this.apiParam);
		},
		
		// 바로반품 입찰 후처리 callback
		lhRtgBdPrcCallback : function(result){
			
			if(smutil.apiResValidChk(result) && result.code == "0000"){
				LEMP.Window.close({
					"_oMessage":{
						"param":null
					},
					"_sCallback" : "page.listReLoad"
				});
			}else{
				LEMP.Window.alert({
					"_sTitle" : "알림",
					"_vMessage" : "입찰요청 후처리 실패"
				});
			}
			page.apiParamInit();		// 파라메터 전역변수 초기화
			
		},
		
		// ################### 롯데홈쇼핑 입찰요청 end
		
		// ################### 롯데홈쇼핑 입찰취소 end
		
		// 바로반품 취소 사유 callback
		com0901Callback : function(result){
			
			try {
				
				var typ_cd = result.typ_cd;				// 구분코드
				var dtl_cd = result.dtl_cd;				// 상세코드 (상품대분류코드)
				var dtl_cd_nm = result.dtl_cd_nm;		// 상세코드명 (상품분류명)
				
				if(!smutil.isEmpty(dtl_cd)){
					page.cnclReqCuseCntt = dtl_cd_nm;
					page.getLhCerk();
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
		
		// 입찰취소
		cnclReqRecv : function() {
			smutil.loadingOn();
			
			var now = page.getTimeStamp();
			var data = page.initData;
			var tr = {
				id : "HTTPDIRECT",
				param : {
					baseUrl : "/lhwms/rest/LhBrRegdTndrCnclReqRecv/call?companyCode=LH",
					callback : "page.cnclReqRecvCallback",
					data:{
						"cerk" : page.cerk,								// 인증키
						"hodecoCode" : "11",							// 택배사코드(롯데글로벌로지스 : 11)
						"ordNo" : data.real_ord_no,						// 실제주문번호
						"ordGoodsSeq" : data.ord_goods_seq,				// 주문상품순번
						"ordGoodsDtlSeq" : data.ord_goods_dtl_seq,		// 주문상품상세순번
						"ordGoodsDelySeq" : data.ord_goods_dely_seq,	// 주문상품배송순번
						"reqDt" : now,									// 요청일시
						"intfDt" : now,									// 인터페이스일시 
						"cuseCntt" : page.cnclReqCuseCntt				// 사유내용
					}// api 통신용 파라메터
				}
			};

			// native 기능 호출
			smutil.nativeMothodCall(tr);
		},
		// 입찰취소 callback
		cnclReqRecvCallback : function(res) {
			try{
				if(res.statusCode == "200"){
					if(res.result.resultCd === "1"){
						LEMP.Window.alert({
							"_sTitle" : "알림",
							"_vMessage" : "입찰 취소되었습니다"
						});
						page.lhRtgBdCclPrc("C");
					}else{
						LEMP.Window.alert({
							"_sTitle" : "입찰 취소 실패",
							"_vMessage" : res.result.resultMsg
						});
						LEMP.Window.close({
							"_oMessage":{
								"param":null
							},
							"_sCallback" : "page.listReLoad"
						});
					}
				}else{
					LEMP.Window.alert({
						"_sTitle" : "알림",
						"_vMessage" : "실패"
					});
				}
			}catch(e){}
			finally{
				smutil.loadingOff();
			}
		},
		
		// 바로반품 입찰취소 후처리
		lhRtgBdCclPrc : function(resultCd){
			var data = page.initData;
			
			var _this = this;
			_this.apiParam.param.baseUrl = "/smapis/pid/lhRtgBdCclPrc";				//api no
			_this.apiParam.param.callback = "page.lhRtgBdCclPrcCallback";				//callback methode
			_this.apiParam.data = {				// api 통신용 파라메터
					"parameters" : {
						"result_cd" : resultCd,				// 롯데홈쇼핑 api 결과 코드
						"ccl_rsn" :	page.cnclReqCuseCntt,	// 취소 사유
						"rsrv_mgr_no" : data.rsrv_mgr_no	// 예약접수번호
						
					}
				};
			
			//공통 api호출 함수
			smutil.callApi(_this.apiParam);
		},
		
		// 바로반품 입찰취소 후처리 callback
		lhRtgBdCclPrcCallback : function(result){
			if(smutil.apiResValidChk(result) && result.code == "0000"){
				LEMP.Window.close({
					"_oMessage":{
						"param":null
					},
					"_sCallback" : "page.listReLoad"
				});
			}else{
				LEMP.Window.alert({
					"_sTitle" : "알림",
					"_vMessage" : "입찰취소 후처리 실패"
				});
			}
			page.apiParamInit();		// 파라메터 전역변수 초기화
			
		},
		// ################### 롯데홈쇼핑 입찰취소 end
		
		// 현재시간 가져오기 (YYYY-MM-DD hh:mm:ss)
		getTimeStamp : function(){
			var _this = this;
			var d = new Date();
			var s =
				_this.leadingZeros(d.getFullYear(), 4) + '-' +
				_this.leadingZeros(d.getMonth() + 1, 2) + '-' +
				_this.leadingZeros(d.getDate(), 2) + ' ' +

				_this.leadingZeros(d.getHours(), 2) + ':' +
				_this.leadingZeros(d.getMinutes(), 2) + ':' +
				_this.leadingZeros(d.getSeconds(), 2);

			  return s;
		},
		leadingZeros : function(n, digits){
			  var zero = '';
			  n = n.toString();

			  if (n.length < digits) {
			    for (i = 0; i < digits - n.length; i++)
			      zero += '0';
			  }
			  return zero + n;
		},
		
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