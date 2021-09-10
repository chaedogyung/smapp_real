var page = {

		strtNum : 0,					// 시작 번호(페이징)
		endNum : 200,					// 시작 번호로부터 데이터 갯수 (페이징)

		prntdeviceType : null,			// 디바이스 타입
		prntPage : 0,					// 출력 갯수
		prntTotalPage : 0,				// 출력 전체 갯수

		prntDataArr : [],				// 출력 정보 배열
		prntRsrv : null,				// 출력 접수번호
		prntCclDataArr : null,			// 출력취소 정보 배열
		prntCclInv : null,				// 출력 취소 송장번호
		
		prntSmsDataArr : null,
		
													 
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

			/* 제스처 */
			var thisN = ".baedalListBox > ul > li > .baedalBox";
			var thisW = 0;
			var thisC = 0;
			$(document).on("touchstart click", thisN,function(e){
					$(thisN).swipe({
					triggerClick:false,
					preventDefault:false,
					onStart:function(onThis){
						thisC = $(onThis).parent().index();
						thisW = $(onThis).parent().find(".btnBox").width();
					},
					swipeRight:function(){
						$(thisN).animate({left:0},250,'easeOutCubic');
						$(thisN).parent().parent().children().eq(thisC).children(".baedalBox").stop().animate({left:thisW},400,'easeOutQuart');
					},
					swipeLeft:function(){
						$(thisN).animate({left:0});
					}
				});
			});
			$(thisN).trigger("click");

			/* 시작일 달력 팝업 */
			$(document).on('click','#startDate,#endDate',function(){
				var popUrl = smutil.getMenuProp('COM.COM0302', 'url');
				LEMP.Window.open({
					"_sPagePath":popUrl,
					"_oMessage":{
						"param":null
					}
				});
			});

			/* 화면 상단 > 화물추적 */
			$("#openFrePop").click(function(){
				var popUrl = smutil.getMenuProp("FRE.FRE0301","url");

				LEMP.Window.open({
					"_sPagePath":popUrl,
					"_oMessage":{
						"param":null
					}
				});
			});

			/* 최상단 탭 클릭  */
			$(".lstTabBtn").click(function(){
				var tab_cd = $(this).data('tabCd');		// 선택한 탭의 값 (R,A)

				// 텝에따라 업무구분  처리 (예약지시 : R , 거래처 출고 : A)
				if(tab_cd == 'A'){
					$("#fltr_sct_cd").hide();
					$('#job_cust').show();
				} else {
					$('#fltr_sct_cd').show();
					$('#job_cust').hide();
				}

				if(tab_cd == "R")
					$(".tabView.view2").removeClass("gathListTp7").addClass("gathListTp8");
				else
					$(".tabView.view2").removeClass("gathListTp8").addClass("gathListTp7");

				// 예약/지시, 거래처 출고 탭 표시처리
				var btnLst = $(".lstTabBtn");
				var btnObj;
				_.forEach(btnLst, function(obj, key) {
					btnObj = $(obj);
					if(tab_cd == btnObj.data('tabCd')){
						btnObj.closest('li').addClass( 'on' );
					}
					else{
						btnObj.closest('li').removeClass( 'on' );
					}
				});

				page.apiParamInit();			// 파라메터 전역변수 초기화
				page.strtNum = 0;				// 시작번호 초기화
				page.listReLoad();				// 리스트 제조회
			});

			/* 조회 탭 클릭, 조회 클릭 */
			$(".lstSchBtn , .lstSch").click(function(){
				var prnt_sct_cd = $(this).data('prntSctCd');		// 선택한 탭의 값 (A,Y,N)

				//전체,줄력,미출력 탭 표시처리
				var btnLst = $(".lstSchBtn");
				var btnObj;
				_.forEach(btnLst, function(obj, key) {
					btnObj = $(obj);
					if(prnt_sct_cd == btnObj.data('prntSctCd')){
						btnObj.closest('li').addClass( 'on' );
					}
					else{
						btnObj.closest('li').removeClass( 'on' );
					}
				});

				page.listReLoad();					// 리스트 제조회
			});

			/* 구분 필터값 변경 */
			$("#fltr_sct_cd, #fltr_sct_cd_A").on('change', function(){
				page.listReLoad();					// 리스트 제조회
			});

			/* 더보기  */
			$("#moreBtn").on('click', function(){
				page.strtNum = page.strtNum + page.endNum;
				smutil.loadingOn();
				page.rsrvPrntListSearch();				// 리스트 조회
			});

			/* 제스처 > 통화버튼 클릭 */
			$(document).on('click', '.btn.blue.bdM.bdPhone', function(e){
				var phoneNumberTxt = $(this).data('phoneNumber');

				// 전화걸기 팝업 호출
				$('#popPhoneTxt').text(phoneNumberTxt);
				$('.mpopBox.phone').bPopup();

			});

			/* 제스처 > 통화버튼 yes 클릭 */
			$('#phoneCallYesBtn').click(function(e){

				LEMP.System.callTEL({
					"_sNumber":$("#popPhoneTxt").text().replace(/\-/g,'')
				});
				$('.mpopBox.phone').bPopup().close();

			});

			/* 제스처 > 미집하 클릭 */
//			$(document).on('click', '.btn.blue3.bdM.bdCancle.mgl1', function(e){
//
//				var inv_no = $(this).data('invNo');
//				var corp_sct_cd = $(this).data('corp');
//
//				if(!smutil.isEmpty(inv_no)){
//
//					var popUrl = smutil.getMenuProp("COM.COM0701","url");
//					LEMP.Window.open({
//						"_sPagePath" : popUrl,
//						"_oMessage" : {
//							"param" : {
//								"inv_no" : inv_no,
//								"menu_id" : "PID0101",
//								"corp_sct_cd" : String(corp_sct_cd)
//							}
//						}
//					});
//
//				}else{
//					LEMP.Window.alert({
//						"_sTitle":"운송장 번호 오류",
//					    "_vMessage" : '운송장 번호가 없습니다.'
//					});
//				}
//			});

			/* 체크박스 전체선택 */
			$("#checkall").click(function(){
				if($("#checkall").prop("checked")){
					$("input[name=chk]").prop("checked",true);
				}else{
					$("input[name=chk]").prop("checked",false);
				}

				page.printCount();
			});

			/* 출력카운트 */
			$(document).on('click',".checkBoxSelect",function(event){
				page.printCount();
			});

			/* 선택된건에대한 출력 */
			$('.ftPrint').click(function(){

				if($('.checkBoxSelect:checked').length < 1){ //최소 1건이상 출력 가능
					LEMP.Window.alert({
						"_sTitle" : "알림",
						"_vMessage" : "출력할 송장을 선택해주십시오."
					});

					return false;
				}

				page.bluetoothStatus();
			});

			/* 운송장 출력 > 예 */
			$('#invPrntYesBtn').click(function(){
				var printList = $('.checkBoxSelect:checked');

				var tag;
				prntDataArr = [];		//출력한 송장 배열 초기화
				_.forEach(printList,function(value,index,array){
					tag = $('.checkBoxSelect:checked')[index].closest('.baedalBox');
					if(tag.dataset.prntYn == "Y"){
						LEMP.Window.alert({
							"_sTitle" : "알림",
							"_vMessage" : "선택한 송장중 이미 출력된 송장이 있습니다. 제외 후 출력해주십시오."
						});

						return false;
					}
					prntDataArr.push(tag.dataset);
				});

				_this.prntPage = 0;
				_this.prntTotalPage = prntDataArr.length;
				if(_this.prntTotalPage > 0){
					smutil.loadingOn();
					page.invPrnt();
				}
			});

			/* 선택된건에대한 출력취소 */
			$(document).on('click',".ftPrintCancel",function(){
				var inv_no = $(this).parent().data('inv');
				var corp_sct_cd = $(this).parent().data('corp');

				var ChkCnt = $('.checkBoxSelect:checked').length;
				if(ChkCnt < 1){ //최소 1건이상 출력취소 가능
					LEMP.Window.alert({
						"_sTitle" : "알림",
						"_vMessage" : "출력취소 할 송장을 선택해주십시오."
					});

					return false;
				}
				$('.mpopBox.cancel').bPopup();
			});
			/* 선택된건에대한 문자발송 */
			$(document).on('click',".ftSms",function(){
				var inv_no = $(this).parent().data('inv');
				var corp_sct_cd = $(this).parent().data('corp');
				prntSmsDataArr = [];
				var msgList = $('.checkBoxSelect:checked');
				var tag;
				
				if(msgList.length > 0){
//					_.forEach(msgList,function(value,index,array){
//						tag = $('.checkBoxSelect:checked')[index].closest('.baedalBox');
//						if(tag.dataset.inv != '' && tag.dataset.inv != null){
//							prntSmsDataArr.push(tag.dataset);				
//						}
//						
//					});
//					var chkCnt = prntSmsDataArr.length
//					if(chkCnt > 0){
//						LEMP.Window.alert({
//							"_sTitle" : "알림",
//							"_vMessage" : "발송이 불가능한 문자가 있습니다."
//						});
//						
//						return false;
//					}else{
						$('.mpopBox.sms').bPopup();
//					}
				}else{
					LEMP.Window.alert({
						"_sTitle" : "알림",
						"_vMessage" : "문자 발송 할 예약지시를 선택해주세요."
					});
				}
			});
			
			/* 문자메시지 발송 > 예 */
			$('#invSendMsgBtn').click(function(){
		
//				if(prntSmsDataArr.length == 0){
					smutil.loadingOn();
					page.sendMsg();
//				}

			});   

			/* 운송장 출력 취소 > 예 */
			$('#invPrntCclYesBtn').click(function(){
				prntCclDataArr = [];
				_.forEach($('.checkBoxSelect:checked'),function(value,index,array){
					var tag = $('.checkBoxSelect:checked')[index].closest('.baedalBox');
					if(tag.dataset.prntYn == "N"){
						LEMP.Window.alert({
							"_sTitle" : "알림",
							"_vMessage" : "출력 취소가 불가능한 항목이 포함되어 있습니다"
						});

						return false;
					}
					prntCclDataArr.push(tag.dataset);
				});

				if(prntCclDataArr.length > 0){
					smutil.loadingOn();
					page.invPrntCcl();
				}

			});

			/* 상세화면으로 이동 */
			$(document).on('click',".thumb, .infoBox",function(){
				var inv_no = $(this).parent().data('inv');
				var rsrv_mgr_no = $(this).parent().data('rsrv');
				var corp_sct_cd = $(this).parent().data('corp');

				if(corp_sct_cd == "2201"){ // 카카오:2201
					var popUrl = smutil.getMenuProp("PID.PID0301","url");

					LEMP.Window.open({
						"_sPagePath":popUrl,
						"_oMessage": {
							"startDate" : $('#startDate').val(),
							"endDate" : $('#endDate').val(),
							"pid0101CorpSctCd" : corp_sct_cd
						}
					});
				}else{
					// 팝업 url 호출
					var popUrl = smutil.getMenuProp('PID.PID0102', 'url');

					LEMP.Window.open({
						"_sPagePath" : popUrl,
					 	"_oMessage": {
							"inv_no" :inv_no,
							"rsrv_mgr_no" :rsrv_mgr_no,
							"corp_sct_cd" : corp_sct_cd
						}
					});
				}
			});

			/* 택배/반품접수 이동 */
			$(document).on('click',"#receipt",function(){
				var popUrl = smutil.getMenuProp('PID.PID0103', 'url');
				LEMP.Window.open({
					"_sPagePath" : popUrl,
				});
			});

			// ###################################### handlebars helper 등록 start

			// 출력 체크박스 활성화
			Handlebars.registerHelper('prntChk', function(options) {
				if(this.corp_sct_cd != "2101" && this.corp_sct_cd != "2201"){ //세븐일레븐, 카카오
					// options.fn == if(true)
					return options.fn(this);
				}
			});

			// 회사 로고 표시
			Handlebars.registerHelper('corpLogoReturn', function(corp_sct_cd) {

				var corpSctCd = corp_sct_cd;

				if(this.corp_sct_cd == "2004" && this.baro_yn == "Y"){	// 롯데홈쇼핑이면서 바로반품인 경우 로고 4005로 출력
					corpSctCd = "4005";
				}

				// chn_cd 가 B2B 일 경우 (01: 출고, 02: 반품, 03, 점간, 04: B2C(매장->개인), 05: B2C(개인->매장)
				if(this.chn_cd == "B2B"){
					corpSctCd = "b2b" + this.b2b_sct_cd;
				}

				return smutil.corpLogoReturn(corpSctCd);
			});

			// 송장번호 형식 표시
			Handlebars.registerHelper('invNoTmpl', function(options) {
				if(!smutil.isEmpty(this.inv_no)){
					return (this.inv_no).replace(/([0-9]{4})([0-9]{4})([0-9]{4})/,"$1-$2-$3");
				}
				else{
					return "운송장번호";
				}
			});

			// 운임 라벨 표시
			Handlebars.registerHelper('fareSctChk', function(options) {
				var result = "";

				switch (this.fare_sct_cd) {
				case "01":		// 현불 , 금액 표시
					result = '<span class="badge red s imgNum">' + (this.summ_fare+"").LPToCommaNumber() + '</span>';
					break;
				default:
					result = '<span class="badge red s imgNum">' + this.fare_sct_nm + '</span>';
					break;
				}

				if(smutil.isEmpty(result)){
					return "";
				}
				else{
					return new Handlebars.SafeString(result); // mark as already escaped
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

			// 접수/출력 정보
			Handlebars.registerHelper('infoTmpl', function(options) {
				if(this.prnt_yn == "Y"){	//여부
					// options.fn == if(true)
					var typeTxt = '출력일';
					var ymd = this.prnt_ymd;
				}
				else{	//접수일
					var typeTxt = '접수일';
					var ymd = this.acpt_rgst_ymd;
				}

				// 출력일, 접수일
				var ymdTmp = "";
				if(!smutil.isEmpty(ymd)){
					var ymdTmp = typeTxt + ' ' + ymd.substring(4,6) + '월' + ymd.substring(6,8) + '일';
				}else{
					var ymdTmp = '';
				}

				// 예약/지시(R) / 거래처 집하(A) 구분
				var tabCd;
				$('.lstTabBtn').each(function() {
					if ($(this).closest('li').hasClass('on')) {
						tabCd = $(this).data('tabCd');
					}
				});

				var html = '';
				// chn_cd 가 B2B 일 경우 (01: 출고, 02: 반품, 03, 점간, 04: B2C(매장->개인), 05: B2C(개인->매장)
				if(this.chn_cd == "B2B" && this.b2b_sct_cd == "01"){	// B2B출고 : 브랜드명|송하인명|수하인명
					html = '<li>' + this.brnd_nm + '</li>';
					html += '<li>' + this.snper_nm + '</li>';
					html += '<li>' + this.acper_nm + '</li>';
				}else if(this.chn_cd == "B2B" && 						// B2B집하 : 브랜드명|송하인명|접수일
						(this.b2b_sct_cd == "02" || this.b2b_sct_cd == "03" || this.b2b_sct_cd == "04")){
					html = '<li>' + this.brnd_nm + '</li>';
					html += '<li>' + this.snper_nm + '</li>';
					html += '<li>' + ymdTmp + '</li>';
				}else{													// 그 밖의경우 : 송하인명|송하인전화번호|접수일
					if (tabCd === 'R') {	// 예약/지시의 경우: 송하인 정보
						html = '<li>' + this.snper_nm + '</li>';
						html += '<li>' + this.snper_tel + '</li>';
						html += '<li>' + ymdTmp + '</li>';
					} else {				// 거래처 집하의 경우: 수하인 정보
						html = '<li>' + this.acper_nm + '</li>';
						html += '<li>' + this.acper_tel + '</li>';
						html += '<li>' + ymdTmp + '</li>';
					}
				}
				return new Handlebars.SafeString(html); // mark as already escaped
			});

			Handlebars.registerHelper('infoAdr', function(options) {
				// 예약/지시(R) / 거래처 집하(A) 구분
				var tabCd;
				$('.lstTabBtn').each(function() {
					if ($(this).closest('li').hasClass('on')) {
						tabCd = $(this).data('tabCd');
					}
				});

				// 거래처 집하 & (일반 || B2C(개인->매장))의 경우 수하인 주소 출력
				if (tabCd === 'A' && (this.chn_cd !== 'B2B' || (this.chn_cd === 'B2B' && this.b2b_sct_cd === '05'))) {
					return this.acper_adr;
				}

				return this.snper_adr;
			});

			// 출력취소 버튼 활성화
			Handlebars.registerHelper('prntCclChk', function(options) {
				if(this.prnt_yn === "Y" && this.corp_sct_cd != "2101"){ //출력이면서 편의점(2101)이 아닌 경우 true
					// options.fn == if(true)
					return options.fn(this);
				}
			});

			// 제스처 - 미집하 버튼 활성화
			Handlebars.registerHelper('bdCancleChk', function(options) {
				if(this.prnt_yn === "Y"){ //출력이면서 편의점(2101)이 아닌 경우 true
					// options.fn == if(true)
					return options.fn(this);
				}
			});

			//###################################### handlebars helper 등록 end
		},

		initDpEvent : function()
		{
			var _this = this;
			smutil.loadingOn();
			page.initDisplay();
			page.fltrListSearch();
			_this.rsrvPrntListSearch();
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



		// ################### 예약/지시 조회필터 리스트 조회 start
		// 필터 구분 조회
		fltrListSearch : function(){
			var _this = this;

			_this.apiParam.param.baseUrl = "/smapis/cmn/codeListPopup";				//api no
			_this.apiParam.param.callback = "page.fltrListCallback";				//callback methode
			_this.apiParam.data = {"parameters" : {"typ_cd":"SMAPP_PID_FLTR_CD"}};	// api 통신용 파라메터

			//공통 api호출 함수
			smutil.callApi(_this.apiParam);
		},

		// 필터 구분 callback
		fltrListCallback : function(result){

			//조회 결과 데이터가 있으면 옵션 생성
			if(smutil.apiResValidChk(result) && result.code == "0000"){
				var list = result.data.list;

				var fltrSctCd = [];
				var fltrSctCdA = [];
				list.forEach(function(item, index, object) {
					if(item.dtl_cd === "UST" || item.dtl_cd === "B2B_UST" || item.dtl_cd === "B2B_PICK"){	// 거래처 집하 (b2c출고,b2b출고,b2b집하)
						fltrSctCdA.push(item);
					}else{
						fltrSctCd.push(item);
					}
				});

				//select box 셋팅
				smutil.setSelectOptions("#fltr_sct_cd", fltrSctCd);		// 예약/지시
				smutil.setSelectOptions("#fltr_sct_cd_A", fltrSctCdA);	// 거래처 집하

			}

			page.apiParamInit();		// 파라메터 전역변수 초기화
		},
		// ################### 예약/지시 조회필터 리스트 조회 end



		// ################### 예약/지시 리스트 조회 start
		rsrvPrntListSearch : function(){
			var _this = this;

			var tab_btn;													//예약/지시, 거래처출고
			var area_sct_cd = $('input[name=area_sct_cd]:checked').val();	//집배송구역 A, 집배대리점 P
			var startDate = page.replaceAll($('#startDate').val(),'.');			//시작일
			var endDate = page.replaceAll($('#endDate').val(),'.');				//종료일
			var prnt_sct_cd;												//구분코드 (A:전체, Y:출력, N:미출력)
			var fltr_sct_cd;												//필터 구분코드
			var job_cust_cd;

			// 현제 어느 탭에 있는지 검사 (예약/지시, 거래처출고)
			var btnLst = $(".lstTabBtn");
			var btnObj;

			_.forEach(btnLst, function(obj, key) {
				btnObj = $(obj);

				if(btnObj.closest('li').is('.on')){
					tab_btn = btnObj.data('tabCd');
				}
			});

			if(tab_btn == "A") {	//거래처 출고탭이면 출고로 fltr
				fltr_sct_cd = $('#fltr_sct_cd_A').val();	// b2c출고,b2b출고,b2b집하
				job_cust_cd = $("#job_cust_cd").val(); 		// 거래처 코드
			}else{
				fltr_sct_cd = $('#fltr_sct_cd').val();
				job_cust_cd = "";							// 거래처 출고 탭이 아니면 거래처 코드값 조회하지 않음
			}

			// 현제 어느 탭에 있는지 검사 (전체, 출력, 미출력)
			var btnLst = $(".lstSchBtn");
			var btnObj;
			_.forEach(btnLst, function(obj, key) {
				btnObj = $(obj);

				if(btnObj.closest('li').is('.on')){
					prnt_sct_cd = btnObj.data('prntSctCd');
				}
			});

			_this.apiParam.param.baseUrl = "smapis/pid/rsrvPrntList";				// api no
			_this.apiParam.param.callback = "page.rsrvPrntListCallback";			// callback methode
			_this.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {
					"area_sct_cd" : smutil.nullToValue(area_sct_cd,"A"),		//집배송구역, 집배대리점
					"strt_ymd" : startDate,
					"end_ymd" : endDate,
					"prnt_sct_cd" : smutil.nullToValue(prnt_sct_cd,"A"),		// 구분코드
					"fltr_sct_cd" : smutil.nullToValue(fltr_sct_cd,"000"),	// 필터 구분코드
					"job_cust_cd" : smutil.nullToValue(job_cust_cd,""),		// 거래처 코드
					"strt_num" : String(_this.strtNum),
					"end_num" : String(_this.endNum)
				}
			};

			// 공통 api호출 함수
			smutil.callApi(_this.apiParam);
		},

		// 예약/지시 리스트 조회 callback
		rsrvPrntListCallback : function(result){
			var _this = this;

			try{
				if(smutil.apiResValidChk(result) && result.code == "0000"){

					// 더보기 버튼
					var totCnt = result.tot_cnt;				// 전체 카운트
					var ingCnt = page.strtNum + page.endNum;	// 진행중인 카운트
					$("#moreBtn").html(ingCnt + " / " + totCnt + " 더보기");

					if(totCnt > ingCnt){
						$("#moreBtnDiv").show();
					}else{
						$("#moreBtnDiv").hide();
					}

					//리스트 카운트 (전체, 출력, 미출력)
					$("#A_pid0101Cnt").text(result.tot_cnt);
					$("#Y_pid0101Cnt").text(result.prnt_cnt);
					$("#N_pid0101Cnt").text(result.uprnt_cnt);

					if(page.strtNum == 0 && result.data_count == 0){
						//거래처명 초기화
						$("#job_cust_nm").val("");

						// 핸들바 템플릿 가져오기
						var source = $("#pid0101_nolist_template").html();

						// 핸들바 템플릿 컴파일
						var template = Handlebars.compile(source);

						// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
						var liHtml = template();

						// 생성된 HTML을 DOM에 주입
						$('#pid0101LstUl').html(liHtml);

					}else{

						var data = result.data; //data = [];

						//거래처명 있을 경우 표시
						if(result.job_cust_nm){
							$("#job_cust_nm").val(result.job_cust_nm);
						}

						// 핸들바 템플릿 가져오기
						var source = $("#pid0101_list_template").html();

						// 핸들바 템플릿 컴파일
						var template = Handlebars.compile(source);

						// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
						var liHtml = template(data);

						if(page.strtNum == 0){
							$('#pid0101LstUl').html(liHtml);
						}else{
							// 생성된 HTML을 DOM에 주입
							$('#pid0101LstUl').append(liHtml);
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
		// ################### 예약/지시 리스트 조회 end



		// ################### 운송장 출력 start
		// 출력 카운트
		printCount : function(){
			var ChkCnt = $('.checkBoxSelect:checked').length;
			$("#printCount").text(ChkCnt);
			$("#printCancelCount").text(ChkCnt);
		},

		// 출력 전 블루투스 체크
		bluetoothStatus : function(){

			//블루투스 호출
			var param =  {
					id : "BLUETOOTHSTATUS",        			// 디바이스 콜 id
					param : {									// 디바이스가 알아야할 데이터
						type : "printer",
						callback : "page.bluetoothStatusCallback"// api 호출후 callback function
					}
				};

			smutil.nativeMothodCall(param);
		},

		// 출력 전 블루투스 체크  Callback
		bluetoothStatusCallback : function(result){
			if(result.status == "true"){
				page.prntDeviceType = result.deviceType;

				var prntMaxCnt = page.prntCntByDevice(page.prntDeviceType);
				if($('.checkBoxSelect:checked').length > prntMaxCnt){ //최대 prntMaxCnt건까지 출력 가능
					LEMP.Window.alert({
						"_sTitle" : "알림",
						"_vMessage" : "출력 가능범위 숫자가 초과되었습니다. " + prntMaxCnt + "개 이하로 선택하여 주세요"
					});

					return false;
				}

				$('.mpopBox.print').bPopup();

			}else{
				LEMP.Window.alert({
					"_sTitle" : "블루투스 연결 실패",
					"_vMessage" : "블루투스 연결이 실패하였습니다."
				});
			}
			smutil.loadingOff();
		},

		// 출력 전 운송장 정보
		invPrnt : function(){
			var _this = this;
			_this.prntPage = _this.prntPage + 1;

			//출력건 접수번호
			prntRsrv = prntDataArr[0].rsrv;

			_this.apiParam.param.baseUrl = "smapis/pid/invPrnt";				//api no
			_this.apiParam.param.callback = "page.invPrntCallback";				//callback methode
			_this.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {
					"inv_no" : prntDataArr[0].inv,
					"rsrv_mgr_no" : prntDataArr[0].rsrv
				}
			}

			//공통 api호출 함수
			smutil.callApi(_this.apiParam);
		},

		// 출력 전 운송장 정보 callback
		invPrntCallback : function(result){
			// 갯수/총갯수
			result["page"] = page.prntPage;
			result["totalPage"] = page.prntTotalPage;

			try{
				if(smutil.apiResValidChk(result) && result.code == "0000"){
					// 출력
					var printerParam =  {
							id : "PRINTER",						// 디바이스 콜 id
							data : result,						// 운송장 정보
							param : {             				// 디바이스가 알아야할 데이터
								deviceType : page.prntDeviceType,
								callback : "page.nativePrntCallback"// api 호출후 callback function
							}
						};
					smutil.nativeMothodCall(printerParam);
				}else if(smutil.apiResValidChk(result) && result.code == "8888"){
					LEMP.Window.alert({
						"_sTitle" : "운송장 출력 정보 오류",
						"_vMessage" : "송장번호 출력구간이 없습니다."
					});
					page.listReLoad();
				}else{
					LEMP.Window.alert({
						"_sTitle" : "운송장 출력 정보 오류",
						"_vMessage" : result.code + " " + result.message
					});
					page.listReLoad();
				}
			}
			catch(e){}
			finally{
				page.apiParamInit();			// 파라메터 전역변수 초기화
			}
		},

		// 출력 후 Callback
		nativePrntCallback : function(result){

			if(result.statusCode == "true"){

				//출력한 송장 배열 삭제
				prntDataArr.forEach(function(item, index, object) {
					if(item.rsrv === prntRsrv){
						object.splice(index, 1);
					}
				});

				//출력 할 배열이 남아있으면 함수 호출
				if(prntDataArr.length > 0){
					setTimeout(function (){
						page.invPrnt();
					}, 2000);
				}else{
					page.listReLoad();
				}

			}else{

				LEMP.Window.alert({
					"_sTitle" : "운송장 출력 오류",
					"_vMessage" : "출력 중 오류가 발생하였습니다."
				});
				page.listReLoad();
			}

		},
		// ################### 운송장 출력 end



		// ################### 운송장 출력 취소 start
		// 운송장 출력 취소
		invPrntCcl : function(){

			prntCclInv = prntCclDataArr[0].inv;

			var _this = this;
			_this.apiParam.param.baseUrl = "smapis/pid/invPrntCcl";				// api no
			_this.apiParam.param.callback = "page.invPrntCclCallback";			// callback methode
			_this.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {
					"inv_no" : String(prntCclInv)			// 송장번호
				}
			};
			   
			// 공통 api호출 함수
			smutil.callApi(_this.apiParam);
		},
		sendMsg : function(){
			smutil.loadingOn();
			
			var inv_no = $(this).parent().data('inv');
			var corp_sct_cd = $(this).parent().data('corp');
			prntSmsDataArr = [];
			var msgList = $('.checkBoxSelect:checked');
			var tag;
			_.forEach(msgList,function(value,index,array){
				tag = $('.checkBoxSelect:checked')[index].closest('.baedalBox');
				if((tag.dataset.rsrv != '' && tag.dataset.rsrv != null) && !(tag.dataset.inv != '' && tag.dataset.inv != null)){
					prntSmsDataArr.push(tag.dataset);				
				}
				
			});
			
			var _this = this;
			_this.apiParam.param.baseUrl = "smapis/pid/sendwaitmsg";				// api no
			_this.apiParam.param.callback = "page.sendwaitmsg";			// callback methode
			_this.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {
					"inv_no" : "",
					"rsrv_mgr_no" : "",
					"rsrv_mgr_list" : prntSmsDataArr
				}
			};
			console.log(_this.apiParam);
			// 공통 api호출 함수
			smutil.callApi(_this.apiParam);
		},
		sendwaitmsg : function(result){
			try{
				console.log(result);
				LEMP.Window.alert({
					"_sTitle" : "문자 발송 성공 알림",
					"_vMessage" : "성공건 : " + result.successMsg + "\n기발송건 : " + result.alreadyMsg
				});
			}
			catch(e){}
			finally{
				
				smutil.loadingOff();			// 로딩바 닫기
				page.listReLoad();
				page.apiParamInit();			// 파라메터 전역변수 초기화
			}
		},					 
					   
	

		// 운송장 출력 취소 callback
		invPrntCclCallback : function(result){

			if(smutil.apiResValidChk(result) && result.code == "0000"){

				//출력 취소한 송장 배열 삭제
				prntCclDataArr.forEach(function(item, index, object) {
					if(item.inv === prntCclInv){
						object.splice(index, 1);
					}
				});

				//출력취소 할 배열이 남아있으면 함수 호출
				if(prntCclDataArr.length > 0){
					page.invPrntCcl();
				}else{
					page.listReLoad();
				}

			}else{

				LEMP.Window.alert({
					"_sTitle" : "운송장 출력취소 오류",
					"_vMessage" : "출력취소 중 오류가 발생하였습니다."
				});
				page.listReLoad();

			}

		},
		// ################### 운송장 취소 start



		// ################### 미집하 전송 start
		// 미집하 사유 선택 후 callback
		com0701Callback : function(result){

			var inv_no = smutil.nullToValue(res.param.inv_no,"");			// 미집하 선택한 송장번호
			inv_no = inv_no+"";
			var cldl_sct_cd = "P";											// 업무구분 (P:집하, D:배달)
			var dlay_rsn_cd = smutil.nullToValue(result.param.code,"");		// 미집하 사유 코드 ex)12
			var rsn_cont = smutil.nullToValue(result.param.value,"");		// 미집하 사유 직접입력 텍스트 또는 지정일
			var filepath = smutil.nullToValue(res.param.images,"");			// 취급불가 비규격 사진파일

			if(!smutil.isEmpty(inv_no)){

				var btnCancel = LEMP.Window.createElement({ _sElementName:"TextButton" });
				btnCancel.setProperty({
					_sText : "취소",
					_fCallback : function(){}
				});

				var btnConfirm = LEMP.Window.createElement({ _sElementName:"TextButton" });
				btnConfirm.setProperty({
					_sText : "확인",
					_fCallback : function(){

						// 이미지 있을경우
						if(!smutil.isEmpty(filepath)){
							page.apiParam.id = "HTTPFILE";
							page.apiParam.param.baseUrl = "smapis/cmn/rsnRgst";				// api no
							page.apiParam.files = [filepath];
						}
						else{			// 이미지 없을경우
							page.apiParam.id = "HTTP";
							page.apiParam.param.baseUrl = "smapis/cmn/rsnRgstTxt";				// api no
						}

						//미집하 api 호출
						page.apiParam.param.callback = "page.rsnRgstCallback";			// callback methode
						page.apiParam.data = {											// api 통신용 파라메터
							"parameters" : {
								"inv_no" : inv_no+"",									// 송장번호
								"cldl_sct_cd" : cldl_sct_cd,							// 업무구분
								"dlay_rsn_cd" : dlay_rsn_cd,							// 미집하 사유 코드
								"rsn_cont" : rsn_cont									// 미집하 사유 date
							}
						};

						// 공통 api호출 함수
						smutil.callApi(page.apiParam);
					}
				});

				LEMP.Window.confirm({
					"_sTitle":"미집하 처리",
					_vMessage : "선택한 송장정보를 \n미집하 처리하시겠습니까?",
					_aTextButton : [btnConfirm, btnCancel]
				});

			} else {
				LEMP.Window.alert({
					"_sTitle":"미집하 처리 오류",
					"_vMessage":"선택한 미집하 송장번호가 없습니다."
				});

				return false;
			}

			page.apiParamInit();			// 파라메터 전역변수 초기화

		},

		// 미집하 처리 콜백
		rsnRgstCallback : function(result){
			// api 전송 성공
			if(smutil.apiResValidChk(result) && result.code == "0000"){
				LEMP.Window.alert({
					"_sTitle":"미집하 처리 완료",
					"_vMessage":"미집하 처리가 완료되었습니다."
				});

				page.listReLoad();				// 리스트 제조회
			}
			else{
				var message = smutil.nullToValue(result.message,'');

				LEMP.Window.alert({
					"_sTitle":"미집하 처리 오류",
					"_vMessage":message
				});
			}

			page.apiParamInit();			// 파라메터 전역변수 초기화
		},
		// ################### 미집하 전송 end

		//달력 팝업 callback
		popCallback :function(args){
			$('#startDate').val(args.start);
			$('#endDate').val(args.end);

			page.listReLoad();				// 리스트 제조회
		},

		// 프린트 기기별 출력갯수
		prntCntByDevice : function(deviceType){
			switch(deviceType){
				case "SPP-R310":
					return 40;
					break;
				case "PP-480BT":
					return 200;
					break;
				case "SLP-DL410":
					return 200;
					break;
				default :
					return 40;
					break;
			}
		},

		// 리스트 제조회 함수
		listReLoad : function(){
			smutil.loadingOn();
			page.strtNum = 0;
			$("input[type='checkbox']").prop('checked', false);	//checkbox
			page.printCount();
			page.rsrvPrntListSearch();				// 리스트 제조회
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
