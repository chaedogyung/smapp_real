var page = {
		
		argStartDate : null,				// 시작일
		argEndDate : null,					// 종료일
		argBkgCode : null,					// 방문처 코드
		argBkgName : null,					// 방문처명
		argCustSctCd : null,				// 거래처구분 (전체, K:kakao, M:마켓민트)
		
		deviceType : null,					// 디바이스 타입
		prntPage : 0,						// 출력 갯수
		prntTotalPage : 0,					// 출력 전체 갯수
		
		prntDataArr : [],					// 출력 정보 배열
		prntRsrv : null,					// 출력 접수번호
		prntCclInv : null,					// 출력 취소 송장번호
		
		print_p_type : null,
		print_p_type2 : null,
		
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
		
		init:function(arg)
		{
			var argData = arg.data.param;
			argBkgCode = argData.bkg_code;		// 방문처 코드
			argBkgName = argData.bkg_name;		// 방문처명
			argCustSctCd = argData.cust_sct_cd;	// 거래처구분 (전체, K:kakao, M:마켓민트)
			
			$('input:radio[name=area_sct_cd]:input[value=' + argData.area_sct_cd + ']').attr("checked", true);
			$('#startDate').val(argData.startDate);	// 시작일
			$('#endDate').val(argData.endDate);		// 종료일
			
			var custSctNm;
			if(argCustSctCd == ""){
				custSctNm = "전체";
			}else if(argCustSctCd == "K"){
				custSctNm = "카카오택배";
			}else if(argCustSctCd == "M"){
				custSctNm = "마켓민트";
			}
			
			$("#bkgName").text(argBkgName);
			$("#custSctCd").text(custSctNm);
			
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
				// 팝업 url 호출
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
			$("#fltr_sct_cd").on('change', function(){
				page.listReLoad();					// 리스트 제조회
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
			
			/* 제스처 > SM변경 */
			$(document).on('click', '.btn.blue2.bdM.bdMemo.mgl1', function(e){
				
				var rsrv = $(this).data('rsrv');
				if(!smutil.isEmpty(rsrv)){	
					
					var popUrl = smutil.getMenuProp("PID.PID0303","url");
					LEMP.Window.open({
						"_sPagePath" : popUrl,
						"_oMessage" : {
							"param" : {
								"rsrv_mgr_no" : rsrv
							}
						}
					});
					
				}else{
					LEMP.Window.alert({
						"_sTitle":"sm변경 오류",
					    "_vMessage" : '접수 번호가 없습니다.'
					});
				}
				
			});
			
			/* 제스처 > 미집하 클릭 */
			$(document).on('click', '.btn.blue3.bdM.bdCancle.mgl1', function(e){
				
				var inv_no = $(this).data('invNo');
				var corp_sct_cd = $(this).data('corp');
				var rsrv_mgr_no = $(this).data('rsrv');
				
				if(!smutil.isEmpty(inv_no)){	
					
					var popUrl = smutil.getMenuProp("COM.COM0701","url");
					LEMP.Window.open({
						"_sPagePath" : popUrl,
						"_oMessage" : {
							"param" : {
								"rsrv_mgr_no" : rsrv_mgr_no,	//카카오 집하보류시 사용
								"inv_no" : inv_no,
								"menu_id" : "PID0302",
								"corp_sct_cd" : String(corp_sct_cd)
							}
						}
					});
					
				}else{
					LEMP.Window.alert({
						"_sTitle":"운송장 번호 오류",
					    "_vMessage" : '운송장 번호가 없습니다.'
					});
				}
			});

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
			
			/* 선택된건에대한 출력 */ 
			$('#invPrntYesBtn').click(function(){				
				var printList = $('.checkBoxSelect:checked');
				
				var tag;
				prntDataArr = [];		//출력한 송장 배열 초기화
				_.forEach(printList,function(value,index,array){
					tag = $('.checkBoxSelect:checked')[index].closest('.baedalBox');
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
			$(document).on('click',".printCancel",function(){
				page.prntCclInv = $(this).parent().data('inv');
				$('.mpopBox.cancel').bPopup();
			});
			
			/* 운송장 출력 취소 > 예 */
			$('#invPrntCclYesBtn').click(function(){
				page.invPrntCcl();
			});
			
			/* 상세화면으로 이동 */
			$(document).on('click',".thumb, .infoBox",function(){
				var inv_no = $(this).parent().data('inv');
				var rsrv_mgr_no = $(this).parent().data('rsrv');
				var corp_sct_cd = $(this).parent().data('corp');
				
				// 팝업 url 호출
				var popUrl = smutil.getMenuProp('PID.PID0102', 'url');
				LEMP.Window.open({
					"_sPagePath":popUrl,
					"_oMessage": {
						"inv_no" :inv_no, 
						"rsrv_mgr_no" :rsrv_mgr_no,
						"corp_sct_cd" : corp_sct_cd
					}
				});
				
			});
			
			
			
			// ###################################### handlebars helper 등록 start
			
			// 출력 체크박스 활성화
			Handlebars.registerHelper('prntChk', function(options) {
				//카카오
				if(this.status_cd != "05" && this.status_cd != "06"){ // 취소건이 아닌경우 체크박스 활성화
					if(this.corp_sct_cd == "2201" || (this.corp_sct_cd != "2201" && this.inv_prnt_yn == "N")){ //카카오거나 카카오가아닐경우에는 미출력만 출력가능
						// options.fn == if(true)
						return options.fn(this);
					}
				}
			});
			
			// 회사 로고 표시
			Handlebars.registerHelper('corpLogoReturn', function(corp_sct_cd) {
				return smutil.corpLogoReturn(corp_sct_cd);
			});
			
			// 전화번호 표시(-삭제)
			Handlebars.registerHelper('snperTelTmp', function(options) {
				if(!smutil.isEmpty(this.snper_tel)){
					return (this.snper_tel).split('-').join('');
				}
				else {
					return "";
				}
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
					result = '<span class="badge blue s imgNum">' + (this.summ_fare+"").LPToCommaNumber() + '</span>';
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
			
			// 용지 종류
			$(function() {
			//회수용지
			page.print_p_type =	LEMP.Properties.get({"_sKey" : "print_paper_type"});
			if(!smutil.isEmpty(page.print_p_type) && page.print_p_type == "Y") {
				$("#setDlvyCom1").text('신회수(E형)');
				$("#setDlvyCom1").attr('class', 'blue badge option outline');
			} else {
				$("#setDlvyCom1").text('구회수(4P)');
	            $("#setDlvyCom1").attr('class', 'gray2 badge option outline');
					}
			//출고용지
			/*page.print_p_type2 =	LEMP.Properties.get({"_sKey" : "print_paper_type2"});
			if(!smutil.isEmpty(page.print_p_type2) && page.print_p_type2 == "Y") {
				$("#setDlvyCom2").text('신출고');
				$("#setDlvyCom2").attr('class', 'blue badge option outline');
			} else {
				$("#setDlvyCom2").text('구출고');
	            $("#setDlvyCom2").attr('class', 'gray2 badge option outline');
					}*/					
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
			
			// 제스처 - 미집하 버튼 활성화
			Handlebars.registerHelper('bdCancleChk', function(options) {
				if(this.prnt_yn === "Y"){ //출력일 경우
					// options.fn == if(true)
					return options.fn(this);
				}
			});
			
			// 제스처 - 미집하,집하보류 버튼 이름
			Handlebars.registerHelper('corpSctCdTmp', function(options) {
				
				var html = "";
				
				if(this.corp_sct_cd === "2201" && this.status_cd != "05" && this.status_cd != "06"){	///카카오이면서 집하보류,취소건이 아닌경우 집하보류 버튼 활성화
					// options.fn == if(true)
					var html = '<button class="btn blue3 bdM bdCancle mgl1" data-inv-no="' + this.inv_no + '" data-corp="' + this.corp_sct_cd + '" data-rsrv="' + this.rsrv_mgr_no + '">집하보류</button>';
				}
				
				if(smutil.isEmpty(html)){
					return "";
				}
				else{
					return new Handlebars.SafeString(html); // mark as already escaped
				}
			});
			
			// 출력취소 버튼 활성화
			Handlebars.registerHelper('prntCclChk', function(options) {
				if(this.inv_prnt_yn === "Y" && this.corp_sct_cd != "2201"){ //출력이면서 카카오가 아닌 경우 true
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
			_this.initDisplay();
			_this.fltrListSearch();
			_this.smilePickListSearch();
			smutil.loadingOff();
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
		
		// ################### 스마일픽업 조회필터 조회 start
		// 필터 구분 조회
		fltrListSearch : function(){
			var _this = this;
			
			_this.apiParam.param.baseUrl = "/smapis/cmn/codeListPopup";				//api no
			_this.apiParam.param.callback = "page.fltrListCallback";				//callback methode
			_this.apiParam.data = {"parameters" : {"typ_cd":"SMAPP_SMILE_PICK_FLTR_CD"}};	// api 통신용 파라메터
			
			//공통 api호출 함수
			smutil.callApi(_this.apiParam);
		},
		
		// 필터 구분 callback
		fltrListCallback : function(result){
			
			//조회 결과 데이터가 있으면 옵션 생성
			if(result.data_count > 0){
				var list = result.data.list;
				
				//목록에서 출고(UST) 제외
				list.forEach(function(item, index, object) {
					if(item.dtl_cd === "UST"){
						object.splice(index, 1);
					}
				});
				
				//select box 셋팅
				smutil.setSelectOptions("#fltr_sct_cd", list);
			}
			
			page.apiParamInit();		// 파라메터 전역변수 초기화
		},
		// ################### 스마일픽업 조회필터 조회 end
		
		// ################### 스마일픽업  리스트 조회 start
		smilePickListSearch : function(){
			var _this = this;
			var area_sct_cd = $('input[name=area_sct_cd]:checked').val();	// 집배송구역 A, 집배대리점 P
			var startDate = page.replaceAll($('#startDate').val(),'.');			// 시작일
			var endDate = page.replaceAll($('#endDate').val(),'.');				// 종료일
			var prnt_sct_cd;												// 구분코드 (A:전체, Y:출력, N:미출력)
			var fltr_sct_cd = $('#fltr_sct_cd').val();						// 필터 구분코드 (00.전체, 03.집하,04.미집하,05.집하보류, 06.취소)

			// 현제 어느 탭에 있는지 검사 (전체, 출력, 미출력)
			var btnLst = $(".lstSchBtn");
			var btnObj;
			_.forEach(btnLst, function(obj, key) {
				btnObj = $(obj);
				
				if(btnObj.closest('li').is('.on')){
					prnt_sct_cd = btnObj.data('prntSctCd');
				}
			});
			
			_this.apiParam.param.baseUrl = "smapis/pid/smilePickList";				// api no
			_this.apiParam.param.callback = "page.smilePickListCallback";			// callback methode
			_this.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {
					"area_sct_cd" : smutil.nullToValue(area_sct_cd,"A"),		// 집배송구역 A, 집배대리점 P
					"pick_ymd_fr" : startDate,									// 시작일자
					"pick_ymd_to" : endDate,									// 종료일자
					"prnt_sct_cd" : smutil.nullToValue(prnt_sct_cd,"A"),		// 구분코드 (A:전체, Y:출력, N:미출력)
					"fltr_sct_cd" : smutil.nullToValue(fltr_sct_cd,"00"),		// 필터 구분코드 (00.전체, 03.집하,04.미집하,05.집하보류, 06.취소)
					"cust_sct_cd" : smutil.nullToValue(argCustSctCd,""),		// 거래처구분 (전체, K:kakao, M:마켓민트)
					"bkg_code" : String(argBkgCode)								// 방문처 코드
					
				}
			};
			
			// 공통 api호출 함수 
			smutil.callApi(_this.apiParam);
		},
		
		// 스마트 픽업 목록 callback
		smilePickListCallback : function(result){

			try{
				var data = {};
				
				if(result){
					data = result.data; //data = [];
				}
				
				//리스트 카운트 (전체, 출력, 미출력)
				$("#A_pid0302Cnt").text(data.cnt.tot_cnt);
				$("#Y_pid0302Cnt").text(data.cnt.prnt_cnt);
				$("#N_pid0302Cnt").text(data.cnt.uprnt_cnt);
				
				if(result.data_count == 0){
					// 핸들바 템플릿 가져오기
					var source = $("#pid0302_nolist_template").html();
					
					// 핸들바 템플릿 컴파일
					var template = Handlebars.compile(source); 
					
					// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
					var liHtml = template(data);
					
					// 생성된 HTML을 DOM에 주입
					$('#pid0302LstUl').html(liHtml);
					
				}else{
					// 핸들바 템플릿 가져오기
					var source = $("#pid0302_list_template").html();
					
					// 핸들바 템플릿 컴파일
					var template = Handlebars.compile(source); 
					
					// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
					var liHtml = template(data);
					
					// 생성된 HTML을 DOM에 주입
					$('#pid0302LstUl').html(liHtml);
				}
				
			}
			catch(e){}
			finally{
				smutil.loadingOff();			// 로딩바 닫기
				page.apiParamInit();			// 파라메터 전역변수 초기화
			}
			
		},
		// ################### 스마일픽업 리스트 조회 end
		
		// ################### 운송장 출력 start
		// 출력 카운트
		printCount : function(){
			var ChkCnt = $('.checkBoxSelect:checked').length;
			$("#printCount").text(ChkCnt);
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
		},
		
		// 출력 전 운송장 정보
		invPrnt : function(arg){
			if(prntDataArr[0].corp == "2201"){	//카카오만 재출력
				//이미 출력한 목록은 재출력 여부 물어보기
				if(prntDataArr[0].invPrntYn == "Y"){
					
					var btnCancel = LEMP.Window.createElement({ _sElementName:"TextButton" });
					btnCancel.setProperty({
						_sText : "취소", 
						_fCallback : function(){
							page.listReLoad();	//출력 끝 > 페이지 reload
						}
					});

					var btnConfirm = LEMP.Window.createElement({ _sElementName:"TextButton" });
					btnConfirm.setProperty({
						_sText : "확인", 
						_fCallback : function(){
							page.invPrntCallApi();	//출력
						}
					});
					
					LEMP.Window.confirm({
						"_sTitle":"재출력",
						"_vMessage" : "접수번호[" + prntDataArr[0].inv + "] \n 재출력하시겠습니까?",
						"_aTextButton" : [btnConfirm, btnCancel]
					});
				}else{
					page.invPrntCallApi();	//출력
				}
			}else{
				page.invPrntCallApi();	//출력
			}
		},
		
		invPrntCallApi : function(){
			var _this = this;
			
			//출력건 접수번호
			page.prntRsrv = prntDataArr[0].rsrv;
			
			if(prntDataArr[0].corp == "2201" || prntDataArr[0].corp == "2203"){	//카카오
				_this.apiParam.param.baseUrl = "smapis/pid/smileInvPrnt";			//api no
			}else{
				_this.apiParam.param.baseUrl = "smapis/pid/invPrnt";			//api no
			}
			
			_this.prntPage = _this.prntPage + 1;
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
					if(item.rsrv === page.prntRsrv){
						object.splice(index, 1);
					}
				});
				
				//출력 할 배열이 남아있으면 함수 호출
				if(prntDataArr.length > 0){
					page.invPrnt();
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
			
			var _this = this;
			_this.apiParam.param.baseUrl = "smapis/pid/invPrntCcl";				// api no
			_this.apiParam.param.callback = "page.invPrntCclCallback";			// callback methode
			_this.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {
					"inv_no" : String(page.prntCclInv)			// 송장번호
				}
			};
			
			// 공통 api호출 함수 
			smutil.callApi(_this.apiParam);
		},
		
		// 운송장 출력 취소 callback
		invPrntCclCallback : function(result){
			
			if(smutil.apiResValidChk(result) && result.code == "0000"){
				
				LEMP.Window.alert({
					"_sTitle" : "운송장 출력취소",
					"_vMessage" : "출력 취소되었습니다."
				});
				page.listReLoad();
				
			}else{
				
				LEMP.Window.alert({
					"_sTitle" : "운송장 출력취소 오류",
					"_vMessage" : "출력취소 중 오류가 발생하였습니다."
				});
				page.listReLoad();
				
			}
			
		},
		// ################### 운송장 취소 start

		//################### sm변경 start
		PID0303Callback : function(result){
			page.listReLoad();
		},
		//################### sm변경 end
		
		// ################### 미집하 전송 start
		// 미집하 사유 선택 후 callback
		com0701Callback : function(result){
			
			var inv_no = smutil.nullToValue(result.param.inv_no,"");			// 미집하 선택한 송장번호
			inv_no = inv_no+"";
			var rsrv_mgr_no = smutil.nullToValue(result.param.rsrv_mgr_no,"");	// 집하보류 선택한 접수번호
			rsrv_mgr_no = rsrv_mgr_no+"";
			var cldl_sct_cd = "P";											// 업무구분 (P:집하, D:배달)
			var dlay_rsn_cd = smutil.nullToValue(result.param.code);		// 미집하 사유 코드 ex)12
			var rsn_cont = smutil.nullToValue(result.param.value,"");		// 미집하 사유 직접입력 텍스트 또는 지정일
			var filepath = smutil.nullToValue(result.param.images,"");		// 취급불가 비규격 사진파일
			var corp_sct_cd = smutil.nullToValue(result.param.corp_sct_cd);	// 업체구분코드
			if(corp_sct_cd == "2201"){
				var confirmTitle = "집하보류 처리";
				var confirmMessage = "선택한 송장정보를 \n집하보류 처리하시겠습니까?";
			}else{
				var confirmTitle = "미집하 처리";
				var confirmMessage = "선택한 송장정보를 \n미집하 처리하시겠습니까?";
			}
			
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
						
						if(corp_sct_cd == "2201"){	// 카카오일 경우 집하보류
							// 집하보류 api 호출
							page.apiParam.id = "HTTP";
							page.apiParam.param.baseUrl = "/smapis/cldl/kakaoCcl";			// callback methode
							page.apiParam.data = {											// api 통신용 파라메터
								"parameters" : {
									"rsrv_mgr_no" : rsrv_mgr_no+"",							// 접수번호
									"ccl_rea_cd" : dlay_rsn_cd,								// 집하보류 코드
									"ccl_rea" : rsn_cont									// 직접입력
								}
							};
						}else{
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
							
							// 미집하 api 호출
							page.apiParam.data = {											// api 통신용 파라메터
								"parameters" : {
									"inv_no" : inv_no+"",									// 송장번호
									"cldl_sct_cd" : cldl_sct_cd,							// 업무구분
									"dlay_rsn_cd" : dlay_rsn_cd,							// 미집하 사유 코드
									"rsn_cont" : rsn_cont									// 미집하 사유 date
								}
							};
						}
						
						page.apiParam.param.callback = "page.rsnRgstCallback";			// callback methode
						
						// 공통 api호출 함수
						smutil.callApi(page.apiParam);
					}
				});
				
				LEMP.Window.confirm({
					"_sTitle" : confirmTitle,
					"_vMessage" : confirmMessage,
					"_aTextButton" : [btnConfirm, btnCancel]
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
					"_sTitle":"처리 완료",
					"_vMessage":"처리되었습니다."
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
			$("input[type='checkbox']").prop('checked', false);	//checkbox
			page.printCount();
			page.smilePickListSearch();				// 리스트 재조회
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
