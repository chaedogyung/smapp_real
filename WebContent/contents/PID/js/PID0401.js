var page = {
		
		cerk : null,					// 롯데 홈쇼핑 인증키
		listData : null,				// 리스트 data
		lotteApiCallType : null,		// API 요청 타입
		reqRecvIdx : null,				// 입찰 요청 index
		cnclReqRecvIdx : null,			// 입찰 취소 index
		cnclReqCuseCntt : null,			// 입찰 취소 사유
		
		// api 호출 기본 형식
		apiParam : {
			id:"HTTP",					// 디바이스 콜 id
			param:{						// 디바이스가 알아야할 데이터
				task_id : "",			// 화면 ID 코드가 들어가기로함
				//position : {},		// 사용여부 미확정 
				type : "",
				baseUrl : "",
				method : "POST",		//api 호출 형식(지정 안하면 'POST' 로 자동 셋팅)
				callback : "",			// api 호출후 callback function
				contentType : "application/json; charset=utf-8"
			},
			data:{"parameters" : {}}	// api 통신용 파라메터
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
			
			/* 시작일,종료일 달력 팝업 */
			$(document).on('click','#startDate,#endDate',function(){
				var popUrl = smutil.getMenuProp('COM.COM0302', 'url');
				LEMP.Window.open({
					"_sPagePath":popUrl,
					"_oMessage":{
						"param":null
					}
				});
			});
			
			/* 상태코드 */
			$("#stat_cd").change(function(){
				page.listReLoad();
			});
			
			/* 새로고침 */
			$(".btn.refresh.paR").click(function(){
				page.listReLoad();
			});
			
			/* 상세화면으로 이동 */
			$(document).on('click',".nameArea ,.infoArea",function(){
				var rsrv_mgr_no = $(this).parent().data('rsrv');
				
				// 팝업 url 호출
				var popUrl = smutil.getMenuProp('PID.PID0402', 'url');
				LEMP.Window.open({
					"_sPagePath":popUrl,
					"_oMessage": {
						"rsrv_mgr_no" :rsrv_mgr_no
					}
				});
			});
			
			/* 입찰요청 */
			$(document).on('click','.bidRequest',function(){
				page.reqRecvIdx = $(this).data("index");
				page.lotteApiCallType = "reqRecv";
				page.getLhCerk();
			});
			
			/* 입찰취소 */
			$(document).on('click','.bidCancle',function(){
				page.cnclReqRecvIdx = $(this).data("index");
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
			

			// ###################################### handlebars helper 등록 start
			
			// 송장번호 형식 표시
			Handlebars.registerHelper('invNoTmpl', function(options) {
				var text = "";
				if(this.stat_cd == "S" || this.stat_cd == "C" || this.stat_cd == "D"){ // 입찰성공일경우에만(입찰성공:S, 반품취소:C, 지연취소:D)
					if(!smutil.isEmpty(this.inv_no)){
						text = (this.inv_no).replace(/([0-9]{4})([0-9]{4})([0-9]{4})/,"$1-$2-$3");
					}
					else{
						text = "미출력";
					}
					
					var html = '<span class="dsin lineR fs13">' + text + '</span>';
					return new Handlebars.SafeString(html); // mark as already escaped
				}
			});
			
			// 출력일,접수일 표시
			Handlebars.registerHelper('ymdTmpl', function(options) {
				var result = "";
				var ymd = "";
				var typeTxt = "";
				
				if(this.prnt_yn == "Y"){	//여부
					// options.fn == if(true)
					typeTxt = '출력일';
					ymd = this.prnt_ymd;
				}
				else{	//접수일
					typeTxt = '접수일';
					ymd = this.acpt_rgst_ymd;
				}
				
				if(smutil.isEmpty(ymd)){
					return "";
				}
				else{
					result = '<li>' + typeTxt + ' ' + ymd.substring(4,6) + '월' + ymd.substring(6,8) + '일</li>';
					return new Handlebars.SafeString(result); // mark as already escaped
				}
			});
			
			//상태
			Handlebars.registerHelper('statTmpl', function(options) {
				var text = "";
				var colorClass = "";
				var time;
				if(this.stat_cd == "N" || this.stat_cd == "F"){ // 입찰대기:N, 입찰실패:F
					text = "접수";
					colorClass = "blue";
					time = this.cre_dtm.substring(8,10) + ':' + this.cre_dtm.substring(10,12);
				}else{
					text = "성공";
					colorClass = "red";
					time = this.succ_tm.substring(0,2) + ':' + this.succ_tm.substring(2,4);
				}
				
				if(smutil.isEmpty(time)){
					var html = '<div class="nameArea ' + colorClass + '"><p class="icon man">' + text + '</p><span class="time"></span></div>'; 
				}else{
					var html = '<div class="nameArea ' + colorClass + '"><p class="icon man">' + text + '</p><span class="time">' + time + '</span></div>'; 
				}
				return new Handlebars.SafeString(html); // mark as already escaped
			});
			
			// 버튼 상태
			// 전체:A, 입찰성공:S, 입찰실패:F,입찰대기:N, 반품취소:C, 지연취소:D
			Handlebars.registerHelper('statNmTag', function(options) {
				var html;
				
				var btnData = "data-index='" + options.data.index + "' ";
				if(this.stat_cd == "N"){ //입찰대기
					if(this.bd_sct_cd == "S")  //단건:S,복수:M
						html = '<button class="btn bdRed w70 bidRequest" ' + btnData + '>입찰</button>';
					else
						html = '<button class="btn bdRed w70 bidRequest" ' + btnData + '>복수입찰</button>';
				}else if(this.stat_cd == "S"){ //입찰성공
					if(this.ccl_able_yn == "Y"){ //취소 가능(입찰성공 후 3시간 이내)
						html = '<button class="btn bd w70 bidCancle" ' + btnData + '>취소요청</button>';
					}else{ //3시간 경과
						html = '<span class="btn dsin pdt8 w70 tc tRed">취소불가</span>';
					}
				}else if(this.stat_cd == "F" || this.stat_cd == "C" || this.stat_cd == "D"){ //F:입찰실패,C:반품취소(입찰 성공 후  취소한 경우),D:지연취소(입찰 성공 후 미집하 6시간 경과)
					html = '<span class="btn dsin pdt8 w70 tc tRed">' + this.stat_nm + '</span>';
				}else{
					html = "미확인값";
				}
				
				return new Handlebars.SafeString(html); // mark as already escaped
			});
			
			Handlebars.registerHelper('infoAreaClass', function(options){
				var className = "infoArea";
				
				if(this.stat_nm == "지연취소"){
					className = "infoArea red";
				}
				
				return className;
			});
			
			//###################################### handlebars helper 등록 end
		},
		
		initDpEvent : function()
		{
			var _this = this;
			smutil.loadingOn();
			_this.initDisplay();
			_this.fltrListSearch();
			_this.lhRtgListSearch();
		},
		
		initDisplay : function()
		{
			//시작일,종료일(처음 페이지 들어왔을때 input 태그가 빈상태)
			if($('#startDate').val()=="" && $('#endDate').val()==""){
				var today = page.getDate('today');
				var weekago =  page.getDate('7daysAgo');
				$('#startDate').val(weekago);
				$('#endDate').val(today);
			}
		},
		
		// ################### 바로반품 조회필터 리스트 조회 start
		// 필터 구분 조회
		fltrListSearch : function(){
			var _this = this;
			
			_this.apiParam.param.baseUrl = "/smapis/cmn/codeListPopup";				//api no
			_this.apiParam.param.callback = "page.fltrListCallback";				//callback methode
			_this.apiParam.data = {"parameters" : {"typ_cd":"SMAPP_LH_RGT_FLTR_CD"}};	// api 통신용 파라메터
			
			//공통 api호출 함수
			smutil.callApi(_this.apiParam);
		},
		
		// 필터 구분 callback
		fltrListCallback : function(result){
			
			//조회 결과 데이터가 있으면 옵션 생성
			if(result.data_count > 0){
				var list = result.data.list;
				
				//select box 셋팅
				smutil.setSelectOptions("#stat_cd", list);
			}
			
			page.apiParamInit();		// 파라메터 전역변수 초기화
			
		},
		// ################### 바로반품 조회필터 리스트 조회 end
		
		
		// ################### 바로반품 리스트 조회 start
		lhRtgListSearch : function(){
			var _this = this;
			
			var startDate = page.replaceAll($('#startDate').val(),'.');			//시작일
			var endDate = page.replaceAll($('#endDate').val(),'.');				//종료일
			var stat_cd = $('#stat_cd').val();								//구분코드 (전체:A, 입찰성공:S, 입찰실패:F,입찰대기:W, 반품취소:N, 지연취소: C)
			
			_this.apiParam.param.baseUrl = "smapis/pid/lhRtgList";				// api no
			_this.apiParam.param.callback = "page.lhRtgListCallback";			// callback methode
			_this.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {
					"pick_ymd_fr" : startDate,						//시작일
					"pick_ymd_to" : endDate,						//종료일
					"stat_cd" : smutil.nullToValue(stat_cd,"A")		//상태구분
				}
			};
			
			// 공통 api호출 함수 
			smutil.callApi(_this.apiParam);
		},
		
		// 바로반품 리스트 조회 callback
		lhRtgListCallback : function(result){
			
			// api 결과 성공여부 검사
			if(smutil.apiResValidChk(result) && result.code == "0000"){
				try{
					var data = {};
					
					if(result.data_count == 0){
						// 핸들바 템플릿 가져오기
						var source = $("#pid0401_nolist_template").html();
						
						// 핸들바 템플릿 컴파일
						var template = Handlebars.compile(source); 
						
						// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
						var liHtml = template(data);
						
						// 생성된 HTML을 DOM에 주입
						$('#pid0401LstUl').html(liHtml);
						
					}else{
					
						if(result){
							data = result.data; //data = [];
							page.listData = data.list;
						}
						
						// 핸들바 템플릿 가져오기
						var source = $("#pid0401_list_template").html();
						
						// 핸들바 템플릿 컴파일
						var template = Handlebars.compile(source); 
						
						// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
						var liHtml = template(data);
						
						// 생성된 HTML을 DOM에 주입
						$('#pid0401LstUl').html(liHtml);
					}
				}
				catch(e){}
				finally{
					smutil.loadingOff();			// 로딩바 닫기
					page.apiParamInit();			// 파라메터 전역변수 초기화
				}
			}
			
		},
		// ################### 바로반품 리스트 조회 end
		
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
			var data = page.listData[page.reqRecvIdx];
			
			var tr = {
				id : "HTTPDIRECT",
				param : {
					baseUrl : "/lhwms/rest/LhBrRegdTndrReqRecv/call?companyCode=LH",
					callback : "page.ReqRecvCallback",
					data:{
						"cerk" : page.cerk,							// 인증키
						"hodecoCode" : "11",						// 택배사코드(롯데글로벌로지스 : 11)
						"ordNo" : data.real_ord_no,					// 실제주문번호
						"ordGoodsSeq" : data.ord_goods_seq,			// 주문상품순번
						"ordGoodsDtlSeq" : data.ord_goods_dtl_seq,	// 주문상품상세순번
						"ordGoodsDelySeq" : data.ord_goods_dely_seq,// 주문상품배송순번
						"reqDt" : now,								// 요청일시
						"intfDt" : now								// 인터페이스일시 
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
						page.lhRtgBdPrc("S");		// 입찰성공
					}else{
						LEMP.Window.alert({
							"_sTitle" : "입찰 요청 실패",
							"_vMessage" : res.result.resultMsg
						});
						page.lhRtgBdPrc("F");		// 입찰실패
					}
				}else{
					LEMP.Window.alert({
						"_sTitle" : "알림",
						"_vMessage" : "실패"
					});
					page.lhRtgBdPrc("F");			// 입찰실패
				}
			}catch(e){}
			finally{
				smutil.loadingOff();
			}
		},

		// 바로반품 입찰 후처리
		lhRtgBdPrc : function(resultCd){
			
			var now = page.getTimeStamp();
			var data = page.listData[page.reqRecvIdx];
			
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
				page.listReLoad();
			}else{
				LEMP.Window.alert({
					"_sTitle" : "알림",
					"_vMessage" : "입찰 후처리 실패"
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
			var data = page.listData[page.cnclReqRecvIdx];
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
						page.lhRtgBdCclPrc("C");		// 입찰취소
					}else{
						LEMP.Window.alert({
							"_sTitle" : "입찰 취소 실패",
							"_vMessage" : res.result.resultMsg
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
			var data = page.listData[page.cnclReqRecvIdx];
			
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
				page.listReLoad();
			}else{
				LEMP.Window.alert({
					"_sTitle" : "알림",
					"_vMessage" : "입찰취소 후처리 실패"
				});
			}
			page.apiParamInit();		// 파라메터 전역변수 초기화
			
		},
		// ################### 롯데홈쇼핑 입찰취소 end
		
		//달력 팝업 callback
		popCallback :function(args){
			$('#startDate').val(args.start);
			$('#endDate').val(args.end);
			
			page.listReLoad();				// 리스트 제조회
		},
		
		// 리스트 제조회 함수
		listReLoad : function(){
			smutil.loadingOn();
			page.lhRtgListSearch();				// 리스트 제조회
		},
		
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
