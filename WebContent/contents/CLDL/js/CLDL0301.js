LEMP.addEvent("backbutton", "page.callbackBackButton");		// 뒤로가기 버튼 클릭시 이벤트

var page = {

		selectedSchTime : null,		// 선택한 시간구분값
		mbl_dlv_area : null,		// 선택한 구역명칭
		rsnRgstInvNo : null,		// 미집하처리를 선택한 invNo
		tab_pick_sct_cd : null,		// 현재 활성화 되어있는 탭 코드(일반집하 : G, 전산집하 : C)
		scanParam : null,			// 스캔완료한 송장파라메터
		dlvyCompl : null,			// 구역,시간 기준
		curLat: null,   		// 현재나의위치
		curLong: null,   		// 현재나의위치
		// api 호출 기본 형식
		apiParam : {
			id:"HTTP",			// 디바이스 콜 id
			param:{				// 디바이스가 알아야할 데이터
				task_id : "",										// 화면 ID 코드가 들어가기로함
				//position : {},									// 사용여부 미전송
				type : "",
				baseUrl : "",
				method : "POST",									// api 호출 형식(지정 안하면 'POST' 로 자동 셋팅)
				callback : "",					// api 호출후 callback function
				contentType : "application/json; charset=utf-8"
			},
			data:{"parameters" : {}}// api 통신용 파라메터
		},

		init:function()
		{
			// 달력셋팅
			var curDate = new Date();
			curDate = curDate.getFullYear() + "." + ("0"+(curDate.getMonth()+1)).slice(-2) + "." + ("0"+curDate.getDate()).slice(-2);
			$('#cldlBtnCal').text(curDate);

			page.dlvyCompl = LEMP.Properties.get({
				"_sKey" : "autoMenual"
			});
			
			page.initEvent();			// 페이지 이벤트 등록
			page.initDpEvent();			// 화면 디스플레이 이벤트
			//현대 특정고가물품 관리거래처 코드 내품확인서비스 이미지 표시
			smutil.hdmgrCustCdReturn();
		},



		// 페이지 이벤트 등록
		initEvent : function()
		{
			var _this = this;

			/* 체크박스 전체선택 */
			$("#checkall").click(function(){
				if($("#checkall").prop("checked")){
					$("input[name=chk]").prop("checked",true);
				}else{
					$("input[name=chk]").prop("checked",false);
				}
			});


			/* 제스처 */
			var thisN = ".baedalListBox > ul > li > .baedalBox";
			var thisW = 0;
			var thisC = 0;
			$(document).on("click, touchstart", thisN, function(e){
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
			/* //제스쳐 */



			// 화면 상단의 화물추적 버튼을 누른경우
			$("#openFrePop").click(function(){
				var popUrl = smutil.getMenuProp("FRE.FRE0301","url");

				LEMP.Window.open({
					"_sPagePath":popUrl,
					"_oMessage":{
						"param":null
					}
				});
			});



			// 달력버튼을 누른경우
			$("#cldlBtnCal").click(function(){

				var popUrl = smutil.getMenuProp("COM.COM0301","url");
//				var limitDate= {
//					"minDate":1,
//					"maxDate":3
//				}

				LEMP.Window.open({
					"_sPagePath":popUrl,
					"_oMessage":{
						"param":null
					}
				});

			});	// end 달력버튼을 누른경우 종료


			// 상단 조회 탭 클릭
			$(".lstSchBtn").click(function(){
				var pick_sct_cd = $(this).data('pickSctCd');		// 선택한 탭의 값 (일반 : G, 전산 : C)

				// 집하 탭 표시처리
				var btnLst = $(".lstSchBtn");
				var btnObj;

				_.forEach(btnLst, function(obj, key) {
					btnObj = $(obj);
					if(pick_sct_cd == btnObj.data('pickSctCd')){
						btnObj.addClass( 'on' );
					}
					else{
						btnObj.removeClass( 'on' );
					}
				});

				// 선택한 값으로 일반집하 전산집하 디스플레이 조절
				_this.displayCtrl();

				//page.listReLoad();					// 리스트 제조회
			});


			// 상단 구역/시간 선택 클릭이벤트 등록
			$(document).on('click', "li[name='timeLstLi']", function(e){
				if(page.dlvyCompl.area_sct_cd == "N"){
					$("li[name='timeLstLi']").removeClass('on');
					$(this).addClass('on');
	
					// 선택한 시간목록값 전역변수로 셋팅
					page.selectedSchTime = $(this).data('timeLi')+"";
				}else{
					$("li[name='timeLstLi']").removeClass('on');
					$(this).addClass('on');
					
					// 선택한 구역명칭 전역변수로 셋팅
					page.mbl_dlv_area = $(this).data('timeLi')+"";
				}
				// 리스트 제조회
				page.listReLoad();
			});


			// 구분 필터값 변경
			$("#fltr_sct_cd").on('change', function(){
				page.listReLoad();					// 리스트 제조회
			});


			// 지도버튼 클릭
			$('.btn.ftMap').click(function(e){
				var popUrl = smutil.getMenuProp("COM.COM0201","url");

				// 날짜셋팅
				var curDate = new Date();
				curDate = curDate.getFullYear() + ("0"+(curDate.getMonth()+1)).slice(-2) + ("0"+curDate.getDate()).slice(-2);
				var base_ymd = smutil.nullToValue($('#cldlBtnCal').text(),curDate);
				base_ymd = base_ymd.split('.').join('');

				LEMP.Window.open({
					"_sPagePath":popUrl,
					"_oMessage" : {
						"param" : {
							"step_sct_cd":"1",
							"base_ymd" : base_ymd,
							"curLat" : page.curLat,	//현재위치
							"curLong" : page.curLong	//현재위치
						}
					}
				});
			});

			// 도선료조회 버튼클릭
			$('.btn.ftShip').click(function(e){
				var popUrl = smutil.getMenuProp("COM.COM0801","url");
				LEMP.Window.open({
					"_sPagePath":popUrl,
					"_oMessage" : {
						"param" : {"menu_id" : "CLDL0301"}
					}
				});
			});


			// 스캔취소 버튼 누른경우 이벤트
			$(document).on('click', '.btn.cancel', function(e){

				var inv_no = $(this).data('cancelInvNo');
				var cldl_sct_cd = $(this).data('cancleSctCd');
				var cldl_tmsl_cd = _this.returnTimeCd();

				if(!_.isUndefined(page.dlvyCompl.area_sct_cd) && page.dlvyCompl.area_sct_cd == 'Y'){
					cldl_tmsl_cd = $(this).data('cancleTmslCd');
				}else{
					cldl_tmsl_cd = _this.returnTimeCd();
				}

				// 송장번호가 있고 스캔된 데이터인지 체크
				if(!smutil.isEmpty(inv_no)
					&& _this.chkScanYn(inv_no)
					&& !smutil.isEmpty(cldl_sct_cd)){

					// 스캔 취소 전문 호출
					_this.cmptScanCcl(inv_no, cldl_sct_cd, cldl_tmsl_cd);  // 스캔취소호출
				}

			});



			// 송장번호 누른경우 (상세보기 연결)
			$(document).on('click', '.invNoSpan', function(event){
				if ($(event.target).parents('li').length > 0) {

					var liElement = $(event.target);
					$('.baedalBox').removeClass('bg-v2');									// 다른 row 선택초기화
					liElement.parents('.baedalBox').addClass('bg-v2');						// row 선택 표시
					var sctCd = liElement.parents('li').data('liSctCd');					// 업무 구분

					if(!smutil.isEmpty(sctCd)){

						var inv_no = liElement.parents('li').data('invNo')+"";				// 송장번호
						var rsrv_mgr_no = liElement.parents('li').data('rsrvMgrNo')+"";		// 접수번호

						// 팝업 url 호출
						var popUrl = smutil.getMenuProp('CLDL.CLDL0305', 'url');

						LEMP.Window.open({
							"_sPagePath":popUrl,
							"_oMessage" : {
								"param" : {
									"inv_no" : inv_no+"",
									"rsrv_mgr_no" : rsrv_mgr_no
								}
							}
						});
					}
				}
			});



			// 통화버튼 클릭
			$(document).on('click', '.btn.blue.bdM.bdPhone', function(e){
				var phoneNumberTxt = $(this).data('phoneNumber');

				// 전화걸기 팝업 호출
				$('#popPhoneTxt').text(phoneNumberTxt);
				$('.mpopBox.phone').bPopup();

			});


			// 통화팝업 버튼 클릭
			$('#phoneCallYesBtn').click(function(e){

				var phoneNumber = $('#popPhoneTxt').text();
				phoneNumber = phoneNumber.split('-').join('').replace(/\-/g,'');

				LEMP.System.callTEL({
					"_sNumber" : phoneNumber,
				});

			});



			// 전송버튼
			// 집하완료 전송 버튼 클릭
			$('#cmptTrsmBtnG,#cmptTrsmBtnC').click(function(e){

				var scanCnt = 0;
				// 일반집하
				if(_this.returnTabSctCd() == "G"){
					scanCnt = Number($('#scanLstCntG').text());
				}
				else{	// 전산집하
					scanCnt = Number($('#scanLstCntC').text());
				}


				// 배달출발 전송(전송) 컴펌창 호출
				if(scanCnt > 0){
					$('#pop2Txt2').html('스캔된 데이터 '+scanCnt+'건<br />집하완료를 전송합니다.');
					$('.mpopBox.pop2').bPopup();
				}
				else{
					LEMP.Window.toast({
						"_sMessage":"스캔한 데이터가 없습니다.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle":"집하완료 전송오류",
//						"_vMessage":"스캔한 데이터가 없습니다.",
//					});

					return ;
				}

			});


			// 집하완료전송 버튼 'yes' 버튼 클릭
			$('#cmptTrsmYesBtn').click(function(e){
				// 집하완료 전송로직 시작
				_this.cmptTrsm();
			});



			// 미집하 처리(일반집하만 가능)
			$(document).on('click', '.btn.blue3.bdM.bdCancle.mgl1', function(e){

				var inv_no = $(this).data('invNo');
				var corp_sct_cd = $(this).data('corpSctCd');

				if(!smutil.isEmpty(inv_no)){

					var liDiv = $('#'+inv_no).children('.baedalBox');
					//page.rsnRgstInvNo = inv_no;				// 미집하 송장번호 셋팅

					// 스캔된 데이터만 미집하 처리 가능
					//if(_this.chkScanYn(inv_no)){

						var popUrl = smutil.getMenuProp("COM.COM0701","url");

						LEMP.Window.open({
							"_sPagePath":popUrl,
							"_oMessage" : {
								"param" : {
									"cldl_sct_cd":"P"
									, "inv_no" : inv_no+""
									, "menu_id" : "CLDL0301"
									, "corp_sct_cd" : corp_sct_cd
								}
							}
						});
//					}
//					else{
//						LEMP.Window.alert({
//							"_sTitle":"미집하 처리 오류",
//							"_vMessage":"미스캔 데이터 입니다."
//						});
//
//						return false;
//					}

				}
			});




			// 일반집하 스캔버튼을 누른경우
			$("#scnBtnG").click(function(){

				//현제 어느 탭에 있는지 상태체크
				var cldl_tmsl_cd = _this.returnTimeCd();		// 예정시간선택
				var pick_sct_cd = _this.returnTabSctCd();		// 일반집하 : G, 전산집하 구분 : C
				var area_sct_cd = page.dlvyCompl.area_sct_cd;	//구역(Y) 시간(N) 기준 
				
				if(!_.isUndefined(page.dlvyCompl.area_sct_cd) && page.dlvyCompl.area_sct_cd == 'Y'){
					cldl_tmsl_cd = "";
				}else{
					cldl_tmsl_cd = _this.returnTimeCd();					
				}
				// 일반 집하일 경우만 시간구분코드를 찾아서 체크
				if(pick_sct_cd == "G" && (smutil.isEmpty(cldl_tmsl_cd) && page.dlvyCompl.area_sct_cd == 'N')){

					LEMP.Window.toast({
						"_sMessage":"예정시간을 선택해 주세요.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle":"스캔오류",
//						"_vMessage":"예정시간을 선택해 주세요."
//					});

					return false;
				}


				// 스캔 팝업 url 호출
				var popUrl = smutil.getMenuProp('CLDL.CLDL0306', 'url');

				LEMP.Window.open({
					"_oMessage" : {
						"param" : {
							"pick_sct_cd" : "G",
							"cldl_tmsl_cd" : cldl_tmsl_cd,
							"area_sct_cd" : area_sct_cd,
							"menu_id" : "CLDL0301"
						}
					},
					"_sPagePath": popUrl
				});


			});	// end 스캔버튼을 누른경우 종료



			// 전산집하 스캔버튼을 누른경우
			$("#scnBtnC").click(function(){

				//현제 어느 탭에 있는지 상태체크
				var cldl_sct_cd = 'P';							// 업무구분
				var pick_sct_cd = _this.returnTabSctCd();		// 일반집하, 전산집하 구분

				// 스캔 팝업 url 호출
				var popUrl = smutil.getMenuProp('COM.COM0101', 'url');

				LEMP.Window.open({
					"_oMessage" : {
						"param" : {
							"pick_sct_cd" : pick_sct_cd,
							"cldl_sct_cd" : cldl_sct_cd,
							"menu_id" : "CLDL0301"
						}
					},
					"_sPagePath": popUrl
				});
			});	// end 스캔버튼을 누른경우 종료


			// 보조송장 등록버튼 클릭한 경우
			$(document).on('click', '#blackSubBox', function(e){

				// 일반집하만 보조송장 등록 가능
				if(_this.returnTabSctCd() == "G"){
					var inv_no = $(this).data("invNo");

					if(!smutil.isEmpty(inv_no)){
						var popUrl = smutil.getMenuProp("CLDL.CLDL0307","url");
						LEMP.Window.open({
							"_sPagePath":popUrl,
							"_oMessage":{
								"param":{
									"inv_no":inv_no+""
								}
							}
						});
					}
					else{

						LEMP.Window.toast({
							"_sMessage":"보조송장을 등록할 원송장번호가 없습니다.",
							'_sDuration' : 'short'
						});
//						LEMP.Window.alert({
//							"_sTitle":"보조송장 등록오류",
//							"_vMessage":"보조송장을 등록할 원송장번호가 없습니다."
//						});

						return false;
					}
				}
				else{
					LEMP.Window.toast({
						"_sMessage":"전산집하는 보조송장을 등록할수 없습니다.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle":"보조송장 등록오류",
//						"_vMessage":"전산집하는 보조송장을 등록할수 없습니다."
//					});

					return false;
				}


			});



			// 뒤로가기 버튼 클릭시  스캔 체크해서 전송여부 결정
			$('.cldlBack').click(function(e){
				// 스캔 체크해서 전송여부 결정
				_this.callbackBackButton();
			});


			// 금액변경 버튼 클릭(착불, 현불일경우만 팝업오픈)
			$(document).on('click', '.fareBtn', function(e){
			//$(document).on('click', '.badge.red.s.imgNum', function(e){
				// 착불 현불일 경우만 금액변경 팝업오픈
				var btnYn = $(this).data('btnYn');
				var inv_no = $(this).data('invNo');

				// 스캔 완료인 경우만 선택 가능
				if(_this.chkScanYn(inv_no)){
					// 현불, 착불일 경우 금액변경 팝업오픈
					if(btnYn == 'Y'){
						var popUrl = smutil.getMenuProp("COM.COM1001","url");
						LEMP.Window.open({
							"_sPagePath":popUrl,
							"_oMessage":{
								"inv_no":inv_no+""
							}
						});
					}
				}
				else{
					LEMP.Window.toast({
						"_sMessage":"스캔후 금액변경이 가능합니다.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle":"금액변경 오류",
//						"_vMessage":"스캔후 금액변경이 가능합니다."
//					});

					return false;
				}

			});



			// 페이징 버튼 누를경우
			$(document).on('click', '.naviPageIdx', function(e){
				// 착불 현불일 경우만 금액변경 팝업오픈
				var pageNo = $(this).data('pageNo');

				if(!smutil.isEmpty(pageNo)){
					// 선택한 페이지 넘버 셋팅
					page.page_no = pageNo;

					// 페이지 제조회
					page.listReLoad();
				}


			});



			// 전산집하 스캔 전체취소버튼 클릭
			$("#scnCancelAllBtn").click(function(){

				//현제 어느 탭에 있는지 상태체크
//				var cldl_tmsl_cd = _this.returnTimeCd();		// 예정시간선택
				var pick_sct_cd = _this.returnTabSctCd();		// 일반집하 : G, 전산집하 구분 : C

				// 전산 집하일 경우만 전체취소 가능
				if(pick_sct_cd == "C"){

					var btnCancel = LEMP.Window.createElement({ _sElementName:"TextButton" });
					btnCancel.setProperty({
						_sText : "취소",
						_fCallback : function(){}
					});

					var btnConfirm = LEMP.Window.createElement({ _sElementName:"TextButton" });
					btnConfirm.setProperty({
						_sText : "확인",
						_fCallback : function(){
							page.schCmptScanList();						// 스캔 전체취소 함수 호출
						}
					});


					LEMP.Window.confirm({
						"_sTitle":"전체 스캔취소",
						_vMessage : "스캔된 전체 송장정보를 취소하시겠습니까?",
						_aTextButton : [btnConfirm, btnCancel]
					});
				}

			});	// end 스캔버튼을 누른경우 종료

			// 문자버튼 클릭
			$('.btn.ftSms').click(function(e){
				// 문자발송 이벤트 호출
				_this.sendSms();

			});

			// 문자발송 스와이프 버튼클릭
			$(document).on('click', '.btn.blue5.bdM.bdMsg', function(e){
				var inv_no = $(this).data('invNo')+"";				// 송장번호
				var phoneNumber = $(this).data('phoneNumber');		// 전화번호
				var cldl_sct_cd = "P";								// 집배달 구분 (P:집하, D:배달)

				if(smutil.isEmpty(inv_no)){
					LEMP.Window.toast({
						"_sMessage":"송장번호가 없습니다.\n관리자에게 문의해주세요.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle" : "문자발송 오류",
//						"_vMessage" : "송장번호가 없습니다.\n관리자에게 문의해주세요."
//					});

					return false;
				}


				// 스캔 안된 데이터도 문자발송 가능
				// 문자 발송 로직 시작~!!!
				var popUrl = smutil.getMenuProp("CLDL.CLDL0206","url");
				LEMP.Window.open({
					"_sPagePath":popUrl,
					"_oMessage":{"param":{
						"inv_no" : inv_no,				// 송장번호
						"phoneNumber" : phoneNumber,	// 전화번호
						"cldl_sct_cd" : cldl_sct_cd		// 집배달 구분 (P:집하, D:배달)
					}}
				});

			});


			// ###################################### handlebars helper 등록 start
			// 집하, 집하 구분(집하 = if true, 집하은=else)
			Handlebars.registerHelper('cldlSctCdChk', function(options) {
				if(this.cldl_sct_cd === "P"){	// 집하
					// options.fn == if(true)
					return options.fn(this)
				}
				else{	// 집하
					// options.inverse == else
					return options.inverse(this);
				}
			});


			// 집하 구분
			Handlebars.registerHelper('cldlSctCdChkTag', function(options) {

				var html = "";
				var phoneNumber = "";
				var span = "";

				if(!smutil.isEmpty(this.snper_nm)){
					html = html + '<li class="name">' + this.snper_nm + '</li>';
				}

				var snper_tel = smutil.nullToValue(this.snper_tel,"");
				var snper_cpno = smutil.nullToValue(this.snper_cpno,"");
				phoneNumber = page.getCpNo(snper_tel, snper_cpno);

				if(!smutil.isEmpty(phoneNumber)){
					html = html + '<li>' + phoneNumber + '</li>';
				}

				if(page.dlvyCompl.area_sct_cd == 'Y' && !smutil.isEmpty(this.cldl_tmsl_nm)){
					html = html + '<li><span style="padding: 0px 5px; font-size: 10px; color: #fff; border: 1px solid #015182; background-color: #015182; border-radius: 20px;">' + (this.cldl_tmsl_nm).replace('시', '') + '</span></li>'
				}

				// 고객요청 인수자 정보 셋팅
				if(!smutil.isEmpty(this.req_acpr_nm)){
					if(this.req_acpt_rgst_sct_cd == "01"){		// 고객요청
						html = html + '<li style="display: inline-block;" id="reqAcptSctCd_'+this.inv_no+'" data-req-acpt-sct-cd='+this.req_acpt_sct_cd+'><span class="tGreenBold">' + this.req_acpr_nm + '</span></li>';
					}
					else if(this.req_acpt_rgst_sct_cd == "02"){		// 기사변경
						html = html + '<li style="display: inline-block;" id="reqAcptSctCd_'+this.inv_no+'" data-req-acpt-sct-cd='+this.req_acpt_sct_cd+'><span class="tRed">' + this.req_acpr_nm + '</span></li>';
					}
				}
				
				if(!smutil.isEmpty(html)){
					html = '<div class="infoList"><ul>' + html + '</ul></div>';
				}
				
				return new Handlebars.SafeString(html); // mark as already escaped
			});


			// 스캔한 데이터인지 판단해서 if else 반환
			Handlebars.registerHelper('chkScanCmptYn', function(options) {
				var scan_cmpt_yn = this.scan_cmpt_yn;				// 스캔여부

				if(this.scan_cmpt_yn == "Y"){	// 스캔했음  if true
					return options.fn(this)
				}
				else{	// 스캔 안함 else
					return options.inverse(this);
				}
			});




			// 운임 라벨 표시 html return
			Handlebars.registerHelper('fareChk', function(options) {
				var result = "";
				var btnYn = "";
				var classTxt = "";

				if(!smutil.isEmpty(this.fare_sct_cd)){

					if(this.cldl_sct_cd === "P"){	// 집하
						switch (this.fare_sct_cd) {
						case "01":		// 현불 , 금액 표시
							if(this.prcs_fare > 0){
								result = (this.prcs_fare+"").LPToCommaNumber();
							}
							else{
								result = (this.summ_fare+"").LPToCommaNumber();
							}
							btnYn = "Y";
							break;
						case "02":		// 착불
							result = "착불";
							btnYn = "N";
							classTxt = "badge s default";
							break;
						case "07":		// 착불결제완료
							result = "착불결제완료";
							btnYn = "N";
							classTxt = "badge s default";
							break;
						default:
							result = "신용";
							btnYn = "N";
							classTxt = "badge s default";
							break;
						}
					}
					else{	// 배달
						switch (this.fare_sct_cd) {
						case "01":		// 현불
							result = "현불";
							btnYn = "N";
							classTxt = "badge s default";
							break;
						case "02":		// 착불, 금액 표시
							if(this.prcs_fare > 0){
								result = (this.prcs_fare+"").LPToCommaNumber();
							}
							else{
								result = (this.summ_fare+"").LPToCommaNumber();
							}
							btnYn = "Y";
							break;
						case "07":		// 착불결제완료
							result = "착불결제완료";
							btnYn = "N";
							classTxt = "badge s default";
							break;
						default:
							//result = this.fare_sct_nm;
							result = "신용";
							btnYn = "N";
							classTxt = "badge s default";
							break;
						}
					}


					// 금액 표시만 빨강, 파랑 표시.
					// 나머지는 흰색으로 표시
					if(smutil.isEmpty(classTxt)){
						if(this.prcs_fare > 0){
							result = '<span class="badge blue s imgNum" data-btn-yn="'+btnYn+'" data-inv-no="'+this.inv_no+'">' + result + '</span>';
						}
						else{
							result = '<span class="badge red s imgNum fareBtn" data-btn-yn="'+btnYn+'" data-inv-no="'+this.inv_no+'">' + result + '</span>';
						}
					}
					else{
						result = '<span class="'+classTxt+'" data-btn-yn="'+btnYn+'" data-inv-no="'+this.inv_no+'">' + result + '</span>';
					}


					return new Handlebars.SafeString(result); // mark as already escaped
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
					// options.inverse == else
					return options.inverse(this);
				}
			});


			// 송장번호 형식 표시
			Handlebars.registerHelper('invNoTmpl', function(options) {
				if(!smutil.isEmpty(this.inv_no)){
					return (this.inv_no).replace(/([0-9]{4})([0-9]{4})([0-9]{4})/,"$1-$2-$3");
				}
				else{
					return "송장번호 없음";
				}
			});


			// 스캔한 데이터인지 여부 확인
			Handlebars.registerHelper('scanYnClass', function(options) {
				if(this.scan_cmpt_yn == 'N'){
					return 'off';
				}else {
					return 'scan';
				}
//				else {
//					return 'bg-v2';
//				}
			});



			// 전화번호가 있으면 전화걸기 버튼 리턴하고 없으면 버튼 리턴 안함 (집하 = 보낸사람, 집하 = 받는사람)
			Handlebars.registerHelper('setPhoneNumber', function(options) {
				var telNum;

				var snper_tel = smutil.nullToValue(this.snper_tel,"");
				var snper_cpno = smutil.nullToValue(this.snper_cpno,"");

				telNum = page.getCpNo(snper_tel, snper_cpno);

				if(!smutil.isEmpty(telNum)){
					var html = '<button class="btn bdM blue bdPhone" data-phone-number="'+telNum+'">전화</button>';
					return new Handlebars.SafeString(html); // mark as already escaped
				}
				else{
					return '';
				}
			});


			// 미집하 버튼 셋팅(일반집하일 경우만 버튼 표시)
			Handlebars.registerHelper('setRsnRgstBtn', function(options) {

				if(!smutil.isEmpty(page.tab_pick_sct_cd) && page.tab_pick_sct_cd == "G"){
					var html = '<button class="btn blue3 bdM bdCancle mgl1" data-inv-no="'+this.inv_no+'" data-corp-sct-cd="'+this.corp_sct_cd+'">미집하</button>';
					return new Handlebars.SafeString(html); // mark as already escaped
				}
				else{
					return '';
				}
			});




			// 집하 집하 맨 앞 라벨 표시(파랑, 빨강)
			Handlebars.registerHelper('getBoxClass', function(options) {
				var result = "";
				if(this.cldl_sct_cd === "P"){	// 집하
					return 'jibBox';
				}
				else{	// 집하
					return 'baeBox';
				}
			});


			// 회사 로고 표시
			Handlebars.registerHelper('corpLogoReturn', function(options) {
				return smutil.corpLogoReturn(this.corp_sct_cd);
			});


			// 체크박스에 전화번호 리턴
			Handlebars.registerHelper('returnSctCdTel', function(options) {
				var telNum;

				var snper_tel = smutil.nullToValue(this.snper_tel,"");
				var snper_cpno = smutil.nullToValue(this.snper_cpno,"");

				telNum = page.getCpNo(snper_tel, snper_cpno);

				if(!smutil.isEmpty(telNum)){
					return (telNum).split('-').join('');
				}
				else{
					return "";
				}
			});


			// 기사 메모가 있는지 없는지 if else
			Handlebars.registerHelper('prcsMemoYn', function(options) {
				if(!smutil.isEmpty(this.prcs_memo)){	// 메모있음 if true
					return options.fn(this);
				}
				else{	// 메모없음 else
					return options.inverse(this);
				}
			});



			// 의류특화일경우 보조송장 등록버튼 표시
			Handlebars.registerHelper('setSubBoxBtn', function(options) {

				if(!smutil.isEmpty(this.svc_cd) && this.svc_cd == "01"){
					var html;
					// 원송장
					if(this.inv_atrb_cd == "00"){
						html = '<span data-inv-no="'+this.inv_no+'" class="tagInfo tagInfo2" id="blackSubBox">보조등록</span>';
					}
					else if(this.inv_atrb_cd == "01"){	// 보조송장
						html = '<span data-inv-no="'+this.inv_no+'" class="tagInfo tagInfo4" id="whiteSubBox">보조송장</span>';
					}

					return new Handlebars.SafeString(html); // mark as already escaped
				}
				else{
					return '';
				}

			});


			// 취소 여부 체크
			Handlebars.registerHelper('cclYnChk', function(options) {
				if(this.ccl_yn === "Y"){	// 취소
					// options.fn == if(true)
					return options.fn(this)
				}
				else{	// 취소아님
					// options.inverse == else
					return options.inverse(this);
				}
			});


			// 사고 여부 체크
			Handlebars.registerHelper('acdYnChk', function(options) {
				if(this.acd_yn === "Y"){	// 사고
					// options.fn == if(true)
					return options.fn(this)
				}
				else{	// 사고 아님
					// options.inverse == else
					return options.inverse(this);
				}
			});



			// 문자발송 버튼 표시 (집하 = 보낸사람, 배달 = 받는사람)
//			Handlebars.registerHelper('setSmsBtn', function(options) {
//				var telNum;
//				var snper_tel = smutil.nullToValue(this.snper_tel,"");
//				var snper_cpno = smutil.nullToValue(this.snper_cpno,"");
//				telNum = page.getCpNo(snper_tel, snper_cpno);
//
//				var html = '<button class="btn bdM blue5 bdM bdMsg mgl1" data-cldl-sct-cd="'+this.cldl_sct_cd+'" data-inv-no="'+this.inv_no+'" data-phone-number="'+telNum+'">문자</button>';
//				return new Handlebars.SafeString(html); // mark as already escaped
//
//			});
			// ###################################### handlebars helper 등록 end

		},


		// 화면 디스플레이 이벤트
		initDpEvent : function(){
			if (!_.isUndefined(page.dlvyCompl)) {
		        if(page.dlvyCompl.area_sct_cd == 'N') {
		        	$(".gathListTp1").css({"margin-top": "275px"});
					$("#setDlvyCom1").text('시간');
	                $("#setDlvyCom1").attr('class', 'green badge option outline');
				} else {
					$(".gathListTp1").css({"margin-top": "300px"});
					$("#setDlvyCom1").text('구역');
	                $("#setDlvyCom1").attr('class', 'red badge option outline');
				}
			}

			if(smutil.isEmpty($("#cldlBtnCal").text())) {
				LEMP.Window.toast({
					"_sMessage":"조회할 날짜를 선택해 주세요",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"리스트 조회오류",
//					"_vMessage":"조회할 날짜를 선택해 주세요"
//				});
				return false;
			}

			var _this = this;
			smutil.loadingOn();
			_this.plnFltrListSerch();		// 필터 리스트 조회
		},


		// 탭 구분에 따라 화면 컨트롤 조정
		displayCtrl : function(){
			var _this = this;
			$("#cmptTmListUl").html('');		// 리스트 초기화

			var pick_sct_cd = page.returnTabSctCd();
			// 일반집화
			if(!smutil.isEmpty(pick_sct_cd) && pick_sct_cd == "G"){
				$('.divisionBox').show();
				$('.topHead').show();
				$('#bottomDivG').show();
				$('#setDlvyCom1').show();
				$('#bottomDivC').hide();
				$('#listViewDiv').addClass('gathListTp1');
				$('#listViewDiv').removeClass('gathListTp2');

				if(page.dlvyCompl.area_sct_cd == 'N'){
					$(".gathListTp1").css({"margin-top": "275px"});

					$("#setDlvyCom1").text('시간');
	                $("#setDlvyCom1").attr('class', 'green badge option outline');
				}else{
					$(".gathListTp1").css({"margin-top": "300px"});

					$("#setDlvyCom1").text('구역');
	                $("#setDlvyCom1").attr('class', 'red badge option outline');
				}
			}
			// 전산집화
			else if(pick_sct_cd == "C"){
				$('.divisionBox').hide();
				$('.topHead').hide();
				$('#bottomDivG').hide();
				$('#setDlvyCom1').hide();
				$('#bottomDivC').show();
				$('#listViewDiv').removeClass('gathListTp1');
				$('#listViewDiv').addClass('gathListTp2');

				$(".gathListTp2").css({"margin-top": "161px"});

				// 전체 스캔리스트 조회
				page.cmptScanListFun();
			}

			page.pagingCtrl();			// 네비게이션바 컨트롤
			page.listReLoad();
		},



		// ################### 필터조건 조회 start
		// 필터조건 조회
		plnFltrListSerch : function(){
			var _this = this;
			_this.apiParamInit();														// 파라메터 전역변수 초기화
			_this.apiParam.param.baseUrl = "smapis/cmn/codeListPopup";					// api no
			_this.apiParam.param.callback = "page.plnFltrListSerchCallback";			// callback methode
			_this.apiParam.data = {"parameters" : {
				"typ_cd" : "SMAPP_CLDL_FLTR_CD"
			}};									// api 통신용 파라메터

			// 공통 api호출 함수
			smutil.callApi(_this.apiParam);

			page.apiParamInit();		// 파라메터 전역변수 초기화
		},


		// 필터조건 조회 callback
		plnFltrListSerchCallback : function(result){

			page.apiParamInit();		// 파라메터 전역변수 초기화

			// api 결과 성공여부 검사
			if(smutil.apiResValidChk(result) && result.code == "0000"){

				// 조회 결과 데이터가 있으면 옵션 생성
				if(result.data_count > 0){
					var list = result.data.list;

					// select box 셋팅
					smutil.setSelectOptions("#fltr_sct_cd", list);
				}

				if(!_.isUndefined(page.dlvyCompl)){
					if(page.dlvyCompl.area_sct_cd == "Y"){
						page.autoCmptTmList();            // 구역별 조회건수 조회
					}else{
						page.cmptTmList();				// 시간대별 조회건수 조회
					}
				}
			}
		},
		// ################### 필터조건 조회 end

		
		// ################### 구역별 조회건수 조회 start
		autoCmptTmList : function(){
			var _this = this;

			_this.apiParam.param.baseUrl = "smapis/cldl/autoCmptTmList";					// api no
			_this.apiParam.param.callback = "page.autoCmptTmListCallback";					// callback methode

			// 날짜셋팅
			var curDate = new Date();
			curDate = curDate.getFullYear() + ("0"+(curDate.getMonth()+1)).slice(-2) + ("0"+curDate.getDate()).slice(-2);
			var base_ymd = smutil.nullToValue($('#cldlBtnCal').text(),curDate);
			base_ymd = base_ymd.split('.').join('');

			_this.apiParam.data = {
				"parameters" : {
					"cldl_sct_cd":"P",
					"pick_sct_cd":_this.returnTabSctCd(),
					"base_ymd":base_ymd
				}
			};					// api 통신용 파라메터 (배달)


			// 공통 api호출 함수
			smutil.callApi(_this.apiParam);

			page.apiParamInit();		// 파라메터 전역변수 초기화
		},


		// 구역별 조회건수 callback
		autoCmptTmListCallback : function(result){
			page.apiParamInit();		// 파라메터 전역변수 초기화

			// api 결과 성공여부 검사
			if(smutil.apiResValidChk(result) && result.code == "0000"){

				// 조회 결과 데이터가 있으면 옵션 생성
				if(result.data_count > 0){
					var data = result.data;
					
					//오름차순 정렬
					_.forEach(data.list, function(e, key) {
						
						if(e.mbl_area == null){
							data.list[key].mbl_area = "기타";
						}else{
							data.list[key].mbl_area = e.mbl_area;
						}
						
						if(e.min_nm != "-"){
							data.list[key].cldl_tmsl_nm = e.min_nm + "~" + e.max_nm + "시";
						}else{
							data.list[key].cldl_tmsl.nm = "";
						}
					});
					
					//오름차순 정렬
					data.list.sort(function(a, b) {
						if(a.mbl_area == "기타"){
							return -1;
						}
						
						if(b.mbl_area == "기타"){
							return 1;
						}
						
						return 0;
					});

					// 핸들바 템플릿 가져오기
					var source = $("#cldl0301_mblLst_template").html();
					
					// 핸들바 템플릿 컴파일
					var template = Handlebars.compile(source);

					// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
					var liHtml = template(data);

					// 생성된 HTML을 DOM에 주입
					$('#cmptTmListUl').html(liHtml);


					/* touchFlow 등록*/
					$(".divisionBox .selectBox").touchFlow();

					// 선택한 값이 없을경우는 시간리스트의 첫번째 순서를 on 상태로 만든다
					// 최초에 들어온 경우만 이벤트 등록
					if(smutil.isEmpty(page.mbl_dlv_area)){
						// 현제 어느 시간데를 선택했는지 검사
						var timeLstLi = $("li[name='timeLstLi']");

						_.forEach(timeLstLi, function(obj, key) {
							$(obj).addClass('on');

							page.mbl_dlv_area = $(obj).find('p.top:eq(0)').text();
							// 한번만 셋팅하고 바로 루프 나감
							return false;
						});
					}
					else {		// 선택한 구역이 있을경우에는 그 시간을 on 시켜줌
						// 현제 어느 시간구간을 선택했는지 검사
						var timeLstLi = $("li[name='timeLstLi']");
						var timeObj;
						_.forEach(timeLstLi, function(obj, key) {
							timeObj = $(obj);
							
							if(timeObj.find('p.top:eq(0)').text() == page.mbl_dlv_area){
								timeObj.addClass('on');

								page.mbl_dlv_area = timeObj.find('p.top:eq(0)').text();
								return false;
							}
						});

						// 활성화된 구역이 없으면 첫번째 리스트를 선택
						if(smutil.isEmpty(page.returnAreaCd())){
							// 현제 어느 시간데를 선택했는지 검사
							var timeLstLi = $("li[name='timeLstLi']");

							_.forEach(timeLstLi, function(obj, key) {
								$(obj).addClass('on');

								page.mbl_dlv_area = $(obj).find('p.top:eq(0)').text();
//								// 선택한 시간구간 등록
//								page.selectedSchTime = $(obj).data('timeLi')+"";
								// 한번만 셋팅하고 바로 루프 나감
								return false;
							});
						}
					}
				}
				else{
					// 리스트가 아무것도 없을경우에는 기본으로 18~20 시 코드를 셋팅한다
					var data = {"list" : [{
						"mbl_area": "기타",
						"min_nm": "18",
						"max_nm": "20",
						"cldl_tmsl_nm": "18~20시",
						"cldl_tmsl_cd": "19",
						"cnt" : 0
					}]};
					var source = $("#cldl0301_mblLst_template").html();
					
					// 핸들바 템플릿 컴파일
					var template = Handlebars.compile(source);

					// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
					var liHtml = template(data);

					// 생성된 HTML을 DOM에 주입
					$('#cmptTmListUl').html(liHtml);


					/* touchFlow 등록*/
					$(".divisionBox .selectBox").touchFlow();

					// 현제 어느 시간데를 선택했는지 검사
					var timeLstLi = $("li[name='timeLstLi']");

					_.forEach(timeLstLi, function(obj, key) {
						$(obj).addClass('on');

						// 선택한 구역 등록
						page.mbl_dlv_area = $(obj).data('timeLi')+"";
						// 한번만 셋팅하고 바로 루프 나감
						return false;
					});


					// 생성된 HTML을 DOM에 주입
//					$('#cmptTmListUl').html('');
				}

				page.autoCmptList();		// 페이지 리스트 조회
			}
		},
		// ################### 구역별 조회건수 조회 end


		// ################### 시간대별 조회건수 조회 start
		cmptTmList : function(){
			var _this = this;

			_this.apiParam.param.baseUrl = "smapis/cldl/cmptTmList";					// api no
			_this.apiParam.param.callback = "page.cmptTmListCallback";					// callback methode

			// 날짜셋팅
			var curDate = new Date();
			curDate = curDate.getFullYear() + ("0"+(curDate.getMonth()+1)).slice(-2) + ("0"+curDate.getDate()).slice(-2);
			var base_ymd = smutil.nullToValue($('#cldlBtnCal').text(),curDate);
			base_ymd = base_ymd.split('.').join('');

			_this.apiParam.data = {
				"parameters" : {
					"cldl_sct_cd":"P",
					"pick_sct_cd":_this.returnTabSctCd(),
					"base_ymd":base_ymd
				}
			};					// api 통신용 파라메터 (집하)

			// 공통 api호출 함수
			smutil.callApi(_this.apiParam);

			page.apiParamInit();		// 파라메터 전역변수 초기화
		},


		// 시간대별 조회건수 callback
		cmptTmListCallback : function(result){
			page.apiParamInit();		// 파라메터 전역변수 초기화

			// api 결과 성공여부 검사
			if(smutil.apiResValidChk(result) && result.code == "0000"){

				// 조회 결과 데이터가 있으면 옵션 생성
				if(result.data_count > 0){
					var data = result.data;
					//오름차순 정렬
					data.list.sort(function(a, b) {
						return a.cldl_tmsl_nm < b.cldl_tmsl_nm ? -1 : a.cldl_tmsl_nm > b.cldl_tmsl_nm ? 1 : 0;
					});

					// 핸들바 템플릿 가져오기
					var source = $("#cldl0301_timeLst_template").html();

					// 핸들바 템플릿 컴파일
					var template = Handlebars.compile(source);

					// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
					var liHtml = template(data);

					// 생성된 HTML을 DOM에 주입
					$('#cmptTmListUl').html(liHtml);


					/* touchFlow 등록*/
					$(".divisionBox .selectBox").touchFlow();

					// 선택한 값이 없을경우는 시간리스트의 첫번째 순서를 on 상태로 만든다
					// 최초에 들어온 경우만 이벤트 등록
					if(smutil.isEmpty(page.selectedSchTime)){

						// 현재 어느 시간데를 선택했는지 검사
						var timeLstLi = $("li[name='timeLstLi']");

						_.forEach(timeLstLi, function(obj, key) {
							$(obj).addClass('on');

							// 선택한 시간구간 등록
							page.selectedSchTime = $(obj).data('timeLi')+"";
							// 한번만 셋팅하고 바로 루프 나감
							return false;
						});
					}
					else {		// 선택한 시간 구간이 있을경우에는 그 시간을 on 시켜줌
						// 현재 어느 시간구간을 선택했는지 검사
						var timeLstLi = $("li[name='timeLstLi']");
						var timeObj;
						_.forEach(timeLstLi, function(obj, key) {
							timeObj = $(obj);

							if((timeObj.data('timeLi')+"") == page.selectedSchTime){
								timeObj.addClass('on');

								return false;
							}
						});

						// 활성화된 시간구간코드가 없으면 첫번째 리스트를 선택
						if(smutil.isEmpty(page.returnTimeCd())){
							// 현재 어느 시간데를 선택했는지 검사
							var timeLstLi = $("li[name='timeLstLi']");

							_.forEach(timeLstLi, function(obj, key) {
								$(obj).addClass('on');

								// 선택한 시간구간 등록
								page.selectedSchTime = $(obj).data('timeLi')+"";
								// 한번만 셋팅하고 바로 루프 나감
								return false;
							});
						}
					}
				}
				else{

					// 리스트가 아무것도 없을경우에는 기본으로 18~20 시 코드를 셋팅한다
					var data = {"list" : [{
						"cldl_tmsl_nm": "18~20시",
						"cldl_tmsl_cd": "19",
						"tmsl_pick_cnt" : 0
					}]};

					// 핸들바 템플릿 가져오기
					var source = $("#cldl0301_timeLst_template").html();

					// 핸들바 템플릿 컴파일
					var template = Handlebars.compile(source);

					// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
					var liHtml = template(data);

					// 생성된 HTML을 DOM에 주입
					$('#cmptTmListUl').html(liHtml);


					/* touchFlow 등록*/
					$(".divisionBox .selectBox").touchFlow();

					// 현제 어느 시간데를 선택했는지 검사
					var timeLstLi = $("li[name='timeLstLi']");

					_.forEach(timeLstLi, function(obj, key) {
						$(obj).addClass('on');

						// 선택한 시간구간 등록
						page.selectedSchTime = $(obj).data('timeLi')+"";
						// 한번만 셋팅하고 바로 루프 나감
						return false;
					});

					// 생성된 HTML을 DOM에 주입
//					$('#cmptTmListUl').html('');
				}

				page.cmptList();			// 페이지 리스트 조회
			}

		},
		// ################### 시간대별 조회건수 조회 end


		// ################### 구역별 페이지 리스트 조회 start
		autoCmptList : function(){

			var _this = this;
			var cldl_sct_cd = "P";		// 업무구분 (집하 : P)
			var fltr_sct_cd = $('#fltr_sct_cd').val();		// 필터구분
			var mbl_dlv_area = page.mbl_dlv_area;			// 현제 어느 시간을 선택했는지 검사
			var pick_sct_cd = _this.returnTabSctCd();		// 현재 어느탭에 있는지 코드리턴(G : 일반집하, C:전산집하)
			var page_no;									// 전산집하에서 사용하는 페이징 번호
			var item_cnt;									// 전산집하에서 보여질 row 수

			// 전산집하인 경우 파라메터 초기화
			if(pick_sct_cd == "C"){
				fltr_sct_cd = "";
				mbl_dlv_area = "";
				page_no = smutil.nullToValue(page.page_no, 1)+"";
				item_cnt = page.item_cnt+"";
			}
			
			_this.apiParam.param.baseUrl = "smapis/cldl/autoCmptList";				// api no
			_this.apiParam.param.callback = "page.cmptListCallback";			// callback methode

			// 날짜셋팅
			var curDate = new Date();
			curDate = curDate.getFullYear() + ("0"+(curDate.getMonth()+1)).slice(-2) + ("0"+curDate.getDate()).slice(-2);
			var base_ymd = smutil.nullToValue($('#cldlBtnCal').text(),curDate);
			base_ymd = base_ymd.split('.').join('');

			_this.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {
					"cldl_sct_cd" : smutil.nullToValue(cldl_sct_cd,"P"),		// 업무구분
					"fltr_sct_cd" : fltr_sct_cd,								// 필터구분
					"mbl_area" : mbl_dlv_area,									// 구역명칭
					"pick_sct_cd" : pick_sct_cd,								// (G : 일반집하, C:전산집하)
					"base_ymd" : base_ymd,										// 조회일자
					"page_no" : page_no,										// 조회할 페이지
					"item_cnt" : item_cnt		
				}
			};

			// 공통 api호출 함수
			smutil.callApi(_this.apiParam);

			page.apiParamInit();		// 파라메터 전역변수 초기화
		},


		// ################### 페이지 리스트 조회 start
		cmptList : function(){

			var _this = this;
			var cldl_sct_cd = "P";								// 업무구분 ( 배달 : P)
			var fltr_sct_cd = $('#fltr_sct_cd').val();			// 필터구분
			var cldl_tmsl_cd = _this.returnTimeCd();			// 현재 어느 시간을 선택했는지 코드리턴
			var pick_sct_cd = _this.returnTabSctCd();			// 현재 어느탭에 있는지 코드리턴(G : 일반집하, C:전산집하)
			var page_no;										// 전산집하에서 사용하는 페이징 번호
			var item_cnt;										// 전산집하에서 보여질 row 수

			// 전산집하인 경우 파라메터 초기화
			if(pick_sct_cd == "C"){
				fltr_sct_cd = "";
				cldl_tmsl_cd = "";
				page_no = smutil.nullToValue(page.page_no, 1)+"";
				item_cnt = page.item_cnt+"";
			}


			_this.apiParam.param.baseUrl = "smapis/cldl/cmptList";			// api no
			_this.apiParam.param.callback = "page.cmptListCallback";		// callback methode

			// 날짜셋팅
			var curDate = new Date();
			curDate = curDate.getFullYear() + ("0"+(curDate.getMonth()+1)).slice(-2) + ("0"+curDate.getDate()).slice(-2);
			var base_ymd = smutil.nullToValue($('#cldlBtnCal').text(),curDate);
			base_ymd = base_ymd.split('.').join('');


			_this.apiParam.data = {											// api 통신용 파라메터
				"parameters" : {
					"cldl_sct_cd" : smutil.nullToValue(cldl_sct_cd,"P"),		// 업무구분
					"fltr_sct_cd" : fltr_sct_cd,								// 필터구분
					"cldl_tmsl_cd" : cldl_tmsl_cd,								// 시간코드
					"pick_sct_cd" : pick_sct_cd,								// (G : 일반집하, C:전산집하)
					"base_ymd" : base_ymd,										// 조회일자
					"page_no" : page_no,										// 조회할 페이지
					"item_cnt" : item_cnt										// 페이지에 조회할 row 수
				}
			};


			// 공통 api호출 함수
			smutil.callApi(_this.apiParam);

			page.apiParamInit();			// 파라메터 전역변수 초기화

		},


		// 리스트 조회후 그리기
		cmptListCallback : function(result){

			page.apiParamInit();			// 파라메터 전역변수 초기화

			try{
				var pick_sct_cd = page.returnTabSctCd();

				// 조회한 결과가 있을경우
//				if(false && smutil.apiResValidChk(result) && result.code == "0000"
//						&& result.data_count > 0){
				if(smutil.apiResValidChk(result) && result.code == "0000"){

					var data = {};

					if(result){
						data = result.data;
					}

					// 핸들바 템플릿 가져오기
					var source = $("#cldl0301_list_template").html();

					// 핸들바 템플릿 컴파일
					var template = Handlebars.compile(source);

					// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
					var liHtml = template(data);

					// 생성된 HTML을 DOM에 주입
					$('#cldl0301LstUl').html(liHtml);

					//현대 특정고가물품 관리거래처 코드 내품확인서비스 이미지 표시
					smutil.hdmgrCustCdReturn();

					var pick_sct_cd = page.returnTabSctCd();

					// 일반집화
					if(!smutil.isEmpty(pick_sct_cd) && pick_sct_cd == "G"){
						// 스캔건수
						var scanLstCnt = $('#scanLstCntG');

						// 스캔건수 표시
						if(!smutil.isEmpty(result.data.scan_cnt)
							&& result.data.scan_cnt > 0){
							scanLstCnt.text(result.data.scan_cnt);
							scanLstCnt.show();
						}
						else{	// 스캔건수 숨김
							scanLstCnt.text('0');
							scanLstCnt.hide();
						}


					}
					// 전산집화
					else if(pick_sct_cd == "C"){
						// 스캔건수
						var scanLstCnt = $('#scanLstCntC');

						// 스캔건수 표시
						if(!smutil.isEmpty(result.data.scan_cnt)
							&& result.data.scan_cnt > 0){
							scanLstCnt.text(result.data.scan_cnt);
							scanLstCnt.show();
						}
						else{	// 스캔건수 숨김
							scanLstCnt.text('0');
							scanLstCnt.hide();
						}

						// 조회된 게시물이 있을경우 페이징 처리
						if(Number(result.data.total_cnt)
								&& Number(result.data.total_cnt) > 0){

							var pagObj = smutil.paginate(
								Number(result.data.total_cnt),
								Number(page.page_no),
								Number(page.item_cnt),
								Number(page.page_navigation_cnt)
							);


							if(!smutil.isEmpty(pagObj) && (pagObj.pages.length > 0)){

								var naviLiHtml = "";

								$.each(pagObj.pages, function(idx, obj){

									// 선택된 페이지
									if((obj+"") == (page.page_no+"")){
										naviLiHtml += '<li class="naviPageIdx" data-page-no="'+obj+'"><strong class="current">'+obj+'</strong></li>';
									}
									else {
										naviLiHtml += '<li class="naviPageIdx" data-page-no="'+obj+'"><button>'+obj+'</button></li>';
									}
								});


								$('#pagingUl').html(naviLiHtml);		// 네비게이션바에 리스트 셋팅
							}
							$('#pagingDiv').show();					// 네비게이션바 보이기
						}
						else{
							$('#pagingDiv').hide();					// 네비게이션바 숨김
						}
					}
				}
				else{		// 에러
					$('#scanLstCntG').hide();		// 전체 스캔건수 숨김
					$('#scanLstCntC').hide();		// 전체 스캔건수 숨김

					// 페이징 컨트롤 및 숨김
					page.pagingCtrl();				// 네비게이션 컨트롤
					page.pagingInit();				// 네비게이션 초기화
				}
			}
			catch(e){}
			finally{
				smutil.loadingOff();			// 로딩바 닫기
				page.apiParamInit();			// 파라메터 전역변수 초기화
			}

		},



		// 전체 스캔 리스트 조회
		cmptScanListFun : function(){
			// 날짜셋팅
//			var curDate = new Date();
//			curDate = curDate.getFullYear() + ("0"+(curDate.getMonth()+1)).slice(-2) + ("0"+curDate.getDate()).slice(-2);
//			var base_ymd = smutil.nullToValue($('#cldlBtnCal').text(),curDate);
//			base_ymd = base_ymd.split('.').join('');

			// 탭을 클릭했을때 한번만 총 스캔 리스트를 조회한다.
			page.apiParam.param.baseUrl = "smapis/cldl/cmptScanList";			// api no
			page.apiParam.param.callback = "page.cmptScanListCallback";		// callback methode
			page.apiParam.data = {											// api 통신용 파라메터
				"parameters" : {
					//"base_ymd" : base_ymd
				}
			};

			// 공통 api호출 함수
			smutil.callApi(page.apiParam);
			page.apiParamInit();			// 파라메터 전역변수 초기화
		},

		// 전산집하 스캔리스트
		cmptScanListCallback : function(res){
			// api 전송 성공
			if(smutil.apiResValidChk(res) && res.code == "0000"){
				if(res.data_count > 0){
					page.cmptScanList = res.data.list;
				}
				else{
					page.cmptScanList = null;
				}
			}
		},

		// ################### 페이지 리스트 조회 end


		// 리스트 제조회 함수
		listReLoad : function(){

			if(smutil.isEmpty($("#cldlBtnCal").text())){
				LEMP.Window.toast({
					"_sMessage":"조회할 날짜를 선택해 주세요",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"리스트 조회오류",
//					"_vMessage":"조회할 날짜를 선택해 주세요"
//				});
				return false;
			}
			
			$("#checkall").prop("checked", false);
			smutil.loadingOn();				// 로딩바 시작
			page.apiParamInit();			// 파라메터 전역변수 초기화

			var pick_sct_cd = page.returnTabSctCd();

			// 일반 집하일 경우만 시간별 카운트 조회
			if(pick_sct_cd == "G"){
				page.plnFltrListSerch();				// 필터부터 재조회
			}
			else{		// 전산집하는 리스트만 조회
				page.cmptList();				// 리스트 제조회
			}

		},



		// ################### 집하완료 전송 start
		// cmptTrsm : function(){
		// 	page.apiParamInit();			// 파라메터 전역변수 초기화
		//
		// 	var _this = this;
		// 	var cldl_sct_cd = "P";							// 업무구분 (집하 : P)
		// 	var cldl_tmsl_cd = _this.returnTimeCd();		// 시간구분코드
		// 	var pick_sct_cd = _this.returnTabSctCd();		// (일반집하 : G, 전산집하 : C)
		// 	var base_ymd = $('#cldlBtnCal').text();			// 기준일자
		//
		// 	if(smutil.isEmpty(base_ymd)){
		// 		LEMP.Window.alert({
		// 			"_sTitle":"집하 전송 오류",
		// 			"_vMessage":"날짜를 선택해 주세요.",
		// 		});
		//
		// 		return ;
		// 	}
		//
		// 	base_ymd = base_ymd.split('.').join('');
		//
		// 	if(!smutil.isEmpty(cldl_sct_cd)
		// 			&& !smutil.isEmpty(cldl_tmsl_cd)){
		// 		_this.apiParamInit();		// 파라메터 전역변수 초기화
		// 		_this.apiParam.param.baseUrl = "smapis/cldl/cmptTrsm";			// api no
		// 		_this.apiParam.param.callback = "page.cmptTrsmCallback";		// callback methode
		//
		// 		// 일반집하
		// 		if(pick_sct_cd == "G"){
		// 			_this.apiParam.data = {						// api 통신용 파라메터
		// 				"parameters" : {
		// 					"cldl_sct_cd" : cldl_sct_cd								// 업무구분
		// 					, "cldl_tmsl_cd" : cdl_tmsl_cd							// 시간대구분
		// 					, "pick_sct_cd" : pick_sct_cd
		// 					, "base_ymd" : base_ymd									// 기준일자
		// 				}
		// 			};
		// 		}
		// 		else if(pick_sct_cd == "C"){		// 전산집하
		// 			_this.apiParam.data = {						// api 통신용 파라메터
		// 				"parameters" : {
		// 					"cldl_sct_cd" : cldl_sct_cd								// 업무구분
		// 					//, "cldl_tmsl_cd" : cdl_tmsl_cd							// 시간대구분
		// 					, "pick_sct_cd" : pick_sct_cd
		// 					, "base_ymd" : base_ymd									// 기준일자
		// 				}
		// 			};
		// 		}
		//
		//
		//
		// 		smutil.loadingOn();				// 로딩바 on
		//
		// 		// 공통 api호출 함수
		// 		smutil.callApi(_this.apiParam);
		// 	}
		//
		// },


		// 집하완료전송 콜백
		// cmptTrsmCallback : function(result){
		// 	var _this = this;
		//
		// 	try{
		//
		// 		// api 전송 성공
		// 		if(smutil.apiResValidChk(result) && result.code == "0000"){
		// 			LEMP.Window.toast({
		// 				"_sMessage" : "집하완료를 전송하였습니다.",
		// 				"_sDuration" : "short"
		// 			});
		//
		// 			page.listReLoad();					// 리스트 제조회
		// 		}
		//
		// 	}
		// 	catch(e){}
		// 	finally{
		// 		smutil.loadingOff();			// 로딩바 닫기
		// 		page.apiParamInit();			// 파라메터 전역변수 초기화
		// 	}
		// },
		// ################### 집하완료전송(전송) end





		// ################### 스캔 전송 start
		// 스캔된후 호출되는 함수
		scanCallback : function(result){
			page.apiParamInit();		// 전역 api 파라메터 초기화

			var _this = this;
			var inv_no = result.barcode;						// 스캔 바코드 번호
			var scanCallYn = "Y";
			var pick_sct_cd = page.returnTabSctCd();			// 집하구분(일반집하:G, 팝업은 일반집하만 사용)
			var cldl_sct_cd = 'P';								// 업무구분 (집하 : P)
			var cldl_tmsl_cd = page.returnTimeCd();				// 예정시간
			var date = new Date();
			var scan_dtm = date.LPToFormatDate("yyyymmddHHnnss");	// 스캔 시간
			var area_sct_cd = page.dlvyCompl.area_sct_cd;			//구역(Y) 시간(N) 기준 
			
			inv_no = inv_no+"";

			if(!_.isUndefined(page.dlvyCompl.area_sct_cd) && page.dlvyCompl.area_sct_cd == 'Y'){
				cldl_tmsl_cd = "";
			}else{
				cldl_tmsl_cd = page.returnTimeCd();				
			}

			// 일반집하 중복 스캔 방지
			if(page.chkScanYn(inv_no) && pick_sct_cd == "G"){
//				LEMP.Window.alert({
//					"_sTitle":"스캔오류",
//					"_vMessage":"이미 스캔 완료된 송장입니다."
//				});

				// 실패 tts 호출(벨소리)
				smutil.callTTS("0", "0", null, result.isBackground);

				return false;
			}
			// 전산집하인경우 전체 중복방지 체크
			else if(pick_sct_cd == "C"){
				var cmptScnList = page.cmptScanList;			// 전산집하 전체 스캔 리스트
				var tempBoolean = false;

				// 중복 검사
				$.each(cmptScnList, function(idx,obj){
					if(obj.inv_no == inv_no){
						tempBoolean = true;
						return false;
					}
				});

				if(tempBoolean){
//					LEMP.Window.alert({
//						"_sTitle":"스캔오류",
//						"_vMessage":"이미 스캔 완료된 송장입니다."
//					});

					// 실패 tts 호출(벨소리)
					smutil.callTTS("0", "0", null, result.isBackground);

					return false;
				}
			}


			// 집하에서 5번으로 시작하는 송장은 스캔할수 없게 한다.
			if(cldl_sct_cd == "P" && (inv_no.LPStartsWith("5"))){
				LEMP.Window.toast({
					"_sMessage":"의류특화 보조송장은 \n집하업무에선 스캔할수 없습니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"스캔오류",
//					"_vMessage":"의류특화 보조송장은 \n집하업무에선 스캔할수 없습니다."
//				});

				// 실패 tts 호출
				smutil.callTTS("0", "0", null, result.isBackground);

				return false;
			}

			// 일반집하는 팝업호출
			if(!smutil.isEmpty(pick_sct_cd) && pick_sct_cd == "G"){

				// app이  background 면 실패처리
				if(result.isBackground){
					// 실패 tts 호출
					smutil.callTTS("0", "0", null, result.isBackground);

					return false;
				}


				if(smutil.isEmpty(inv_no)){
					LEMP.Window.toast({
						"_sMessage":"송장번호가 없습니다.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle":"스캔오류",
//						"_vMessage":"송장번호가 없습니다."
//					});

					scanCallYn = "N";
				}
				else if(inv_no.length != 12
						|| (inv_no.substr(0,11) + ((Number(inv_no.substr(0,11))%7)+"")) != inv_no ){
					LEMP.Window.toast({
						"_sMessage":"정상적인 송장번호가 아닙니다.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle":"스캔오류",
//						"_vMessage":"정상적인 송장번호가 아닙니다."
//					});

					scanCallYn = "N";
				}


				// 스캔 validation 오류이거나 실패
				if(scanCallYn == "N" || result.isBackground){

					// 실패 tts 호출
					smutil.callTTS("0", "0", null, result.isBackground);

					return false;
				}


				// 스캔 팝업 url 호출
				var popUrl = smutil.getMenuProp('CLDL.CLDL0306', 'url');

				LEMP.Window.open({
					"_oMessage" : {
						"param" : {
							"pick_sct_cd" : "G",
							"cldl_tmsl_cd" : cldl_tmsl_cd+"",
							"area_sct_cd" : area_sct_cd+"",
							"menu_id" : "CLDL0301",
							"inv_no":inv_no+"",
							"scan_dtm":scan_dtm+""
						}
					},
					"_sPagePath": popUrl
				});

			}
			else{		// 전산집하 (스캔 후처리)

				result.scan_dtm = scan_dtm;
				page.cmptScanRgst(result);

			}

		},



		// 스캔팝업 콜백 함수
		CLDL0306Callback : function(result){
			page.apiParamInit();		// 전역 api 파라메터 초기화

			var _this = this;
			var scanCallYn = "Y";
			var cldl_sct_cd = 'P';								// 업무구분 (배달 : P)
			var cldl_tmsl_cd = page.returnTimeCd();				// 예정시간
			var inv_no = result.param.inv_no;					// 송장번호
			var scan_dtm = result.param.scan_dtm;				// 스캔 시간
			var pick_sct_cd = "G";								// 집하구분코드(일반집하 : G)
			var svc_cd = result.param.svc_cd;					// 의류특화여부(서비스코드)
			var box_typ = result.param.box_typ;					// 의류 구분코드
			var fare_sct_cd = result.param.fare_sct_cd;			// 운임구분
			var dstt_cd = result.param.dstt_cd;					// 도착지코드(터미널 주소 key)
			var area_sct_cd = page.dlvyCompl.area_sct_cd;			//구역(Y) 시간(N) 기준 

			if(!_.isUndefined(page.dlvyCompl.area_sct_cd) && page.dlvyCompl.area_sct_cd == 'Y'){
				cldl_tmsl_cd = "";
			}else{
				cldl_tmsl_cd = page.returnTimeCd();				
			}

			if(smutil.isEmpty(cldl_tmsl_cd) && page.dlvyCompl.area_sct_cd == 'N'){
				LEMP.Window.toast({
					"_sMessage":"예정시간을 선택해 주세요.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"스캔오류",
//					"_vMessage":"예정시간을 선택해 주세요."
//				});

				scanCallYn = "N";
			}
			else if(smutil.isEmpty(inv_no)){
				LEMP.Window.toast({
					"_sMessage":"송장번호가 없습니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"스캔오류",
//					"_vMessage":"송장번호가 없습니다."
//				});

				scanCallYn = "N";
			}
			else if(inv_no.length != 12
					|| (inv_no.substr(0,11) + ((Number(inv_no.substr(0,11))%7)+"")) != inv_no ){
				LEMP.Window.toast({
					"_sMessage":"정상적인 송장번호가 아닙니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"스캔오류",
//					"_vMessage":"정상적인 송장번호가 아닙니다."
//				});

				scanCallYn = "N";
			}
			else if(smutil.isEmpty(scan_dtm)){
				LEMP.Window.toast({
					"_sMessage":"스캔시간이 없습니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"스캔오류",
//					"_vMessage":"스캔시간이 없습니다."
//				});

				scanCallYn = "N";
			}
			else if(smutil.isEmpty(svc_cd)){
				LEMP.Window.toast({
					"_sMessage":"의류특화여부 코드가 없습니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"스캔오류",
//					"_vMessage":"의류특화여부 코드가 없습니다."
//				});

				scanCallYn = "N";
			}
			else if(smutil.isEmpty(fare_sct_cd)){
				LEMP.Window.toast({
					"_sMessage":"운임구분코드가 없습니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"스캔오류",
//					"_vMessage":"운임구분코드가 없습니다."
//				});

				scanCallYn = "N";
			}
			else if(smutil.isEmpty(dstt_cd)){
				LEMP.Window.toast({
					"_sMessage":"도착지 터미널코드가 없습니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"스캔오류",
//					"_vMessage":"도착지 터미널코드가 없습니다."
//				});

				scanCallYn = "N";
			}


			// 스캔 validation 오류로 실패
			if(scanCallYn == "N"){

				// 실패 tts 호출
				smutil.callTTS("0", "0", null, result.isBackground);

				return false;
			}


			//스캔시간
			page.apiParam.param.baseUrl = "smapis/cldl/cmptScanRgst";			// api no
			page.apiParam.param.callback = "page.cmptScanRgstCallback";			// callback methode


			page.apiParam.data =
			{
				"parameters" : {
					"inv_no":inv_no+"",
					"scan_dtm":scan_dtm+"",
					"cldl_tmsl_cd":cldl_tmsl_cd+"",
					"cldl_sct_cd":cldl_sct_cd+"",
					"area_sct_cd":area_sct_cd+"",
					"pick_sct_cd" : pick_sct_cd+"",
					"svc_cd" : svc_cd+"",
					"box_typ" : box_typ+"",
					"fare_sct_cd" : fare_sct_cd+"",
					"dstt_cd" : dstt_cd+""
				}

			};	// api 통신용 파라메터

			page.apiParam.isBackground = result.isBackground;					// app이 background 상태인지 설정

			// 스캔 데이터 전역변수에 셋팅
			page.scanParam = {
					"inv_no":inv_no+"",
					"scan_dtm":scan_dtm+"",
					"cldl_tmsl_cd":cldl_tmsl_cd+"",
					"cldl_sct_cd":cldl_sct_cd+"",
					"pick_sct_cd" : pick_sct_cd+"",
					"svc_cd" : svc_cd+"",
					"box_typ" : box_typ+"",
					"fare_sct_cd" : fare_sct_cd+"",
					"dstt_cd" : dstt_cd+""
			};

			// 공통 api호출 함수
			smutil.callApi(page.apiParam);

		},


		// 전산집하 스캔
		cmptScanRgst : function(result){
			page.apiParamInit();		// 전역 api 파라메터 초기화

			var _this = this;
			var scanCallYn = "Y";
			var cldl_sct_cd = 'P';								// 업무구분 (배달 : P)
			var inv_no = result.barcode;						// 송장번호
			var scan_dtm = result.scan_dtm;						// 스캔 시간
			var pick_sct_cd = "C";								// 집하구분코드(전산집하 : C)

			if(smutil.isEmpty(inv_no)){
				LEMP.Window.toast({
					"_sMessage":"송장번호가 없습니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"스캔오류",
//					"_vMessage":"송장번호가 없습니다."
//				});

				scanCallYn = "N";
			}
			else if(inv_no.length != 12
					|| (inv_no.substr(0,11) + ((Number(inv_no.substr(0,11))%7)+"")) != inv_no ){
				LEMP.Window.toast({
					"_sMessage":"정상적인 송장번호가 아닙니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"스캔오류",
//					"_vMessage":"정상적인 송장번호가 아닙니다."
//				});

				scanCallYn = "N";
			}
			else if(smutil.isEmpty(scan_dtm)){
				LEMP.Window.toast({
					"_sMessage":"스캔시간이 없습니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"스캔오류",
//					"_vMessage":"스캔시간이 없습니다."
//				});

				scanCallYn = "N";
			}


			// 스캔 validation 오류로 실패
			if(scanCallYn == "N"){

				// 실패 tts 호출
				smutil.callTTS("0", "0", null, result.isBackground);

				return false;
			}

			//스캔시간
			page.apiParam.param.baseUrl = "smapis/cldl/cmptScanRgst";			// api no
			page.apiParam.param.callback = "page.cmptScanRgstCallback";			// callback methode

			page.apiParam.data =
			{
				"parameters" : {
					"inv_no":inv_no+"",
					"scan_dtm":scan_dtm+"",
					"cldl_sct_cd":cldl_sct_cd+"",
					"pick_sct_cd" : pick_sct_cd+""
				}

			};	// api 통신용 파라메터


			page.apiParam.isBackground = result.isBackground;					// app이 background 상태인지 설정

			// 공통 api호출 함수
			smutil.callApi(page.apiParam);

		},



		// 스캔 api 호출 callback
		cmptScanRgstCallback : function(result){
			var message = smutil.nullToValue(result.message,'');
			var acnt = 0;
			var dcnt = 0;
			var pcnt = 0;
			var cldl_sct_cd = "P";			// 업무구분
			var tabSctCd = page.returnTabSctCd();


			// api 결과 성공여부 1차 검사
			if(smutil.apiResValidChk(result)
					&& (result.code == "0000" || result.code == "1000")){

				var inv_no = result.inv_no;
				var message = "스캔성공";

				var scanLstCnt;				// 하단 스캔건수
				var scancnt = 0;

				if(result.code == "1000"){
					message = "이미 취소된 송장입니다."
				}

				// 송장번호가 있는경우
				if(!smutil.isEmpty(inv_no)){

					LEMP.Window.toast({
						"_sMessage" : message,
						"_sDuration" : "short"
					});


					// 리스트에 송장정보가 있는지 체크
					var liKey = $('#'+inv_no);

					// 스캔한 정보가 리스트에 있는경우는 li 활성화만 하면 됨
					if(liKey.length > 0){

						// 신규 스캔일경우만 카운트 증가
						if(!page.chkScanYn(inv_no)){

							// 일반집하
							if(tabSctCd == "G"){
								scanLstCnt = $('#scanLstCntG');
							}
							else {	// 전산집하
								scanLstCnt = $('#scanLstCntC');
							}


							if(smutil.isEmpty(scanLstCnt.text())){
								scancnt = 1;
							}
							else {
								scancnt = Number(scanLstCnt.text()) + 1;
							}

							// 버튼위에 스캔건수 증가
							scanLstCnt.show();
							scanLstCnt.text(scancnt+"");
						}

						// 스캔완료로 변경
						liKey.children('.baedalBox').removeClass('off');
						liKey.children('.baedalBox').addClass('scan');

						// 화면 가장 상단으로 li 이동
						liKey.prependTo('#cldl0301LstUl');
					}
					else {	// 스캔한 정보가 리스트에 없는경우는 li 추가
						var data = {"inv_no" : inv_no+"", "cldl_sct_cd" : cldl_sct_cd}

						// 핸들바스 템플릿 가져오기
						var source = $("#cldl0301_li_template").html();

						// 핸들바 템플릿 컴파일
						var template = Handlebars.compile(source);

						// 핸들바스 템플릿에 데이터를 바인딩해서 HTML 생성
						var liHtml = template(data);

						// noList 일경우 li 삭제
						if($('.noList').length > 0){
							$('.noList').remove();
						}

						// 생성된 HTML을 DOM에 주입
						$('#cldl0301LstUl').prepend(liHtml);


						// 일반집하
						if(tabSctCd == "G"){
							scanLstCnt = $('#scanLstCntG');

							// 상단에 time 리스트 카운트 증가
							var timeLiCd = page.returnTimeCd();
							var timeLiCdCnt = $('#timeCnt_P_'+timeLiCd);
							var scancnt = 0;
							if(smutil.isEmpty(timeLiCdCnt.text())){
								scancnt = 1;
							}
							else {
								scancnt = Number(timeLiCdCnt.text()) + 1;
							}

							timeLiCdCnt.text(scancnt+"");
						}
						else {	// 전산집하
							scanLstCnt = $('#scanLstCntC');
						}


						if(smutil.isEmpty(scanLstCnt.text())){
							scancnt = 1;
						}
						else {
							scancnt = Number(scanLstCnt.text()) + 1;
						}

						// 버튼위에 스캔건수 증가
						scanLstCnt.show();
						scanLstCnt.text(scancnt+"");

					}


					// 의류특화 송장인경우 의류특화버튼 셋팅
					if(!smutil.isEmpty(page.scanParam)
							&& !smutil.isEmpty(page.scanParam.svc_cd)
							&& page.scanParam.svc_cd == "01"){
						var html = '<span data-inv-no="'+inv_no+'" class="badge black s subBox" id="blackSubBox">보조</span>';
						$("#subBoxBtnDiv_"+inv_no).html(html);
					}
				}


				// 카운트가 1000이 넘어가면 1로 초기화
				var scanCnt = scanLstCnt.text();
				var resetCnt = 1000;
				if(!smutil.isEmpty(scanCnt)
						&& Number(scanCnt)
						&& Number(scanCnt) > 0
						){
					scanCnt = Number(scanCnt) % resetCnt;

					if(scanCnt == 0){
						scanCnt = resetCnt
					}
				}

				// 성공 tts 호출
				smutil.callTTS("1", "1", scanCnt, result.isBackground);

				// 전산집하인경우 스캔목록 add
				if(tabSctCd == "C"){
					var scanInvNoObj = {"inv_no" : inv_no};

					if(!smutil.isEmpty(page.cmptScanList)){
						(page.cmptScanList).push(scanInvNoObj);
					}
					else{
						page.cmptScanList = [scanInvNoObj];
					}
				}else if(tabSctCd == "G" && liKey.length == 0 &&  page.dlvyCompl.area_sct_cd == "Y"){
					page.listReLoad();
				}

			}
			else{		// 스캔 실패

				LEMP.Window.toast({
					"_sMessage" : message,
					"_sDuration" : "short"
				});

				// 실패 tts 호출
				smutil.callTTS("0", "0", null, result.isBackground);

				// 취소건은 li 삭제처리 및 카운트 -1
//				if(result.code == "1000"){
//
//					// 리스트에 송장정보가 있는지 체크
//					var liKey = $('#'+inv_no);
//
//					if(liKey.length > 0){
//						// li 삭제
//						$('#'+result.inv_no).remove();
//
//						// 하단 스캔건수-1
//						var scanLstCnt;
//						var scancnt = 0;
//
//						// 일반집하
//						if(page.returnTabSctCd() == "G"){
//							scanLstCnt = $('#scanLstCntG');
//						}
//						else {	// 전산집하
//							scanLstCnt = $('#scanLstCntC');
//						}
//
//						if(smutil.isEmpty(scanLstCnt.text())){
//							scancnt = 0;
//							scanLstCnt.hide();
//							scanLstCnt.text("0");
//						}
//						else {
//							scancnt = Number(scanLstCnt.text()) -1;
//							scanLstCnt.show();
//							scanLstCnt.text(scancnt+"");
//						}
//
//						// 일반집하인경우
//						if(tabSctCd == "G"){
//							//상단 time 리스트 건수 -1
//							var timeLiCd = page.returnTimeCd();
//							var timeLiCdCnt = $('#timeCnt_P_'+timeLiCd);
//							var scancnt = 0;
//							if(smutil.isEmpty(timeLiCdCnt.text())){
//								scancnt = 0;
//							}
//							else {
//								scancnt = Number(timeLiCdCnt.text()) - 1;
//							}
//
//							if(scancnt < 0) scancnt = 0;
//							timeLiCdCnt.text(scancnt+"");
//						}
//					}
//				}

				// 리스트가 없을경우 noList 처리
//				if($('.cldlSctCd_P').length == 0){
//					// 핸들바스 템플릿 가져오기
//					var source = $("#cldl0301_noLstLi").html();
//
//					// 핸들바 템플릿 컴파일
//					var template = Handlebars.compile(source);
//
//					// 핸들바스 템플릿에 데이터를 바인딩해서 HTML 생성
//					var liHtml = template();
//
//					// 생성된 HTML을 DOM에 주입
//					$('#cldl0301LstUl').prepend(liHtml);
//				}


			}

			// 스캔 데이터 전역변수초기화
			page.scanParam = null;
		},
		// ################### 스캔 전송  end



		// ################### 스캔취소 start
		cmptScanCcl : function(inv_no, cldl_sct_cd, cldl_tmsl_cd){

			var _this = this;

			if(smutil.isEmpty(inv_no)){
				LEMP.Window.toast({
					"_sMessage":"송장번호가 없습니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"스캔취소 오류",
//					"_vMessage":"송장번호가 없습니다."
//				});

				return false;
			}
			else if(smutil.isEmpty(cldl_sct_cd)){
				LEMP.Window.toast({
					"_sMessage":"업무구분이 없습니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"스캔취소 오류",
//					"_vMessage":"업무구분이 없습니다."
//				});

				return false;
			}
//			else if(smutil.isEmpty(cldl_tmsl_cd)){
//				LEMP.Window.alert({
//					"_sTitle":"스캔취소 오류",
//					"_vMessage":"선택된 시간구간이 없습니다."
//				});
//
//				return false;
//			}


			var btnCancel = LEMP.Window.createElement({ _sElementName:"TextButton" });
			btnCancel.setProperty({
				_sText : "취소",
				_fCallback : function(){}
			});

			var btnConfirm = LEMP.Window.createElement({ _sElementName:"TextButton" });
			btnConfirm.setProperty({
				_sText : "확인",
				_fCallback : function(){

					// 스캔 취소 전문 호출
					_this.apiParamInit();		// 파라메터 초기화
					_this.apiParam.param.baseUrl = "smapis/cldl/cmptScanCcl";			// api no
					_this.apiParam.param.callback = "page.cmptScanCclCallback";			// callback methode
					_this.apiParam.data = {				// api 통신용 파라메터
						"parameters" : {
							"inv_no" : inv_no+"",					// 송장번호
							"cldl_sct_cd" : cldl_sct_cd,			// 업무구분
							"cldl_tmsl_cd" : cldl_tmsl_cd			// 시간코드
						}
					};

					// 공통 api호출 함수
					smutil.callApi(_this.apiParam);
				}
			});


			LEMP.Window.confirm({
				"_sTitle":"스캔취소",
				_vMessage : "선택한 송장정보의 \n스캔을 취소하시겠습니까?",
				_aTextButton : [btnConfirm, btnCancel]
			});

		},


		// 스캔취소 콜백
		cmptScanCclCallback : function(result){
			var _this = this;

			// api 전송 성공
			if(smutil.apiResValidChk(result) && result.code == "0000"){
				LEMP.Window.toast({
					"_sMessage":"스캔정보가 취소되었습니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"스캔취소 완료",
//					"_vMessage":"스캔정보가 취소되었습니다."
//				});

				page.listReLoad();				// 리스트 제조회

				var pick_sct_cd = page.returnTabSctCd();		// 선택한 탭의 값 (일반 : G, 전산 : C)

				// 전산집하인경우 전체 스캔리스트 제조회
				if(pick_sct_cd == "C"){
					page.cmptScanListFun();						// 전체 스켄리스트 제조회
				}

			}
			else if(result.code == "9000"){
				page.listReLoad();				// 이미 삭제된 리스트이기 때문에 바로 리스트 제조회
			}
			else{
//				var message = smutil.nullToValue(result.message,'');
//
//				LEMP.Window.alert({
//					"_sTitle":"스캔취소 오류",
//					"_vMessage":message
//				});
			}

			page.apiParamInit();				// 파라메터 전역변수 초기화
		},
		// ################### 스캔취소 end



		// ################### 미집하 전송 start
		// 미집하 사유 선택후 callback
		com0701Callback : function(res){
			page.apiParamInit();		// 파라메터 초기화

			var inv_no = smutil.nullToValue(res.param.inv_no,"");			// 미집하 선택한 송장번호
			inv_no = inv_no+"";												// 송장번호 문자처리
			var cldl_sct_cd = "P";					// 집하업무
			var dlay_rsn_cd = smutil.nullToValue(res.param.code,"");		// 미집하 사유 코드
			var rsn_cont = smutil.nullToValue(res.param.value,"");			// 미집하 사유 value
			var filepath = smutil.nullToValue(res.param.images,"");			// 취급불가 비규격 사진파일

			if(!smutil.isEmpty(inv_no) && !smutil.isEmpty(dlay_rsn_cd)){

				var liDiv = $('#'+inv_no).children('.baedalBox');

				// 스캔된 데이터만 미집하 처리 가능
//				if(liDiv.is('.off') == false){

					if(!smutil.isEmpty(rsn_cont)){
						rsn_cont = rsn_cont.split('.').join('');
					}

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
					page.apiParam.data = {				// api 통신용 파라메터
						"parameters" : {
							"inv_no" : inv_no+"",					// 송장번호
							"cldl_sct_cd" : cldl_sct_cd,		// 업무구분
							"dlay_rsn_cd" : dlay_rsn_cd,		// 미집하 사유 코드
							"rsn_cont" : rsn_cont				// 미집하 사유 date 또는 text
						}
					};

					// 공통 api호출 함수
					smutil.callApi(page.apiParam);

					//미집하 확인창 삭제(2020.05.19)
//					var btnCancel = LEMP.Window.createElement({ _sElementName:"TextButton" });
//					btnCancel.setProperty({
//						_sText : "취소",
//						_fCallback : function(){}
//					});
//
//					var btnConfirm = LEMP.Window.createElement({ _sElementName:"TextButton" });
//					btnConfirm.setProperty({
//						_sText : "확인",
//						_fCallback : function(){
//
//							// 이미지 있을경우
//							if(!smutil.isEmpty(filepath)){
//								page.apiParam.id = "HTTPFILE";
//								page.apiParam.param.baseUrl = "smapis/cmn/rsnRgst";				// api no
//								page.apiParam.files = [filepath];
//							}
//							else{			// 이미지 없을경우
//								page.apiParam.id = "HTTP";
//								page.apiParam.param.baseUrl = "smapis/cmn/rsnRgstTxt";				// api no
//							}
//
//							//미집하 api 호출
//
//							page.apiParam.param.callback = "page.rsnRgstCallback";			// callback methode
//							page.apiParam.data = {				// api 통신용 파라메터
//								"parameters" : {
//									"inv_no" : inv_no+"",					// 송장번호
//									"cldl_sct_cd" : cldl_sct_cd,		// 업무구분
//									"dlay_rsn_cd" : dlay_rsn_cd,		// 미집하 사유 코드
//									"rsn_cont" : rsn_cont				// 미집하 사유 date 또는 text
//								}
//							};
//
//							// 공통 api호출 함수
//							smutil.callApi(page.apiParam);
//						}
//					});
//
//
//					LEMP.Window.confirm({
//						"_sTitle":"미집하 처리",
//						_vMessage : "선택한 송장정보를 \n미집하 처리하시겠습니까?",
//						_aTextButton : [btnConfirm, btnCancel]
//					});

//				}
//				else{
//					LEMP.Window.alert({
//						"_sTitle":"미집하 처리 오류",
//						"_vMessage":"미스캔 데이터 입니다."
//					});
//
//					return false;
//				}

			}
			else {
				LEMP.Window.toast({
					"_sMessage":"선택한 미집하 송장번호 혹은 \n미집하 사유가 없습니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"미집하 처리 오류",
//					"_vMessage":"선택한 미집하 송장번호 혹은 \n미집하 사유가 없습니다."
//				});

				return false;
			}

			//page.rsnRgstInvNo = null;

		},


		// 미집하 처리 콜백
		rsnRgstCallback : function(result){
			page.apiParamInit();			// 파라메터 전역변수 초기화

			// api 전송 성공
			if(smutil.apiResValidChk(result) && result.code == "0000"){
				LEMP.Window.toast({
					"_sMessage" : "미집하 처리가 완료되었습니다.",
					"_sDuration" : "short"
				});


				page.listReLoad();				// 리스트 제조회
			}
//			else{
//				var message = smutil.nullToValue(result.message,'');
//
//				LEMP.Window.alert({
//					"_sTitle":"미집하 처리 오류",
//					"_vMessage":message
//				});
//			}

			//page.rsnRgstInvNo = null;		// 미집하 처리 전역변수 초기화

		},
		// ################### 미집하 처리 end






		// ################### 집하완료전송(전송) start
		cmptTrsm : function(){

			var _this = this;
			var cldl_sct_cd = "P";							// 업무구분
			var cldl_tmsl_cd = page.returnTimeCd();			// 예정시간코드
			var mbl_dlv_area = page.mbl_dlv_area;			// 구역명칭
			var pick_sct_cd = _this.returnTabSctCd();
			var base_ymd = $('#cldlBtnCal').text();			// 기준일자
			var area_sct_cd = page.dlvyCompl.area_sct_cd;	//구역시간 구분

			if(!_.isUndefined(page.dlvyCompl.area_sct_cd) && page.dlvyCompl.area_sct_cd == 'Y'){
				cldl_tmsl_cd = "";
				mbl_dlv_area = page.mbl_dlv_area;
			}else{
				cldl_tmsl_cd = page.returnTimeCd();
				mbl_dlv_area = "";
			}
			
			if(pick_sct_cd == "C"){
				cldl_tmsl_cd = "";
				mbl_dlv_area = "";
			}
			
			base_ymd = base_ymd.split('.').join('');

			if((pick_sct_cd == "G" && (!smutil.isEmpty(cldl_tmsl_cd) || page.dlvyCompl.area_sct_cd == 'Y'))
					|| pick_sct_cd == "C"){
				var scanCnt = 0;
				if(_this.returnTabSctCd() == "G"){
					scanCnt = Number($('#scanLstCntG').text());
				}
				else{
					scanCnt = Number($('#scanLstCntC').text());
				}

				if(scanCnt > 0){
					_this.apiParamInit();		// 파라메터 전역변수 초기화
					_this.apiParam.param.baseUrl = "smapis/cldl/cmptTrsm";		// api no
					_this.apiParam.param.callback = "page.cmptTrsmCallback";		// callback methode
					_this.apiParam.data = {				// api 통신용 파라메터
						"parameters" : {
							"cldl_sct_cd" : cldl_sct_cd			// 업무구분
							, "pick_sct_cd" : pick_sct_cd		// 일반집하, 전산집하 구분코드
							, "cldl_tmsl_cd" : cldl_tmsl_cd		// 예정시간 구분코드
							, "mbl_area" : mbl_dlv_area			// 구역명칭
							, "area_sct_cd" : area_sct_cd
							, "base_ymd" : base_ymd
						}
					};

					smutil.loadingOn();			// 로딩바 on

					// 공통 api호출 함수
					smutil.callApi(_this.apiParam);
				}
				else{
					LEMP.Window.toast({
						"_sMessage":"스캔한 데이터가 없습니다.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle":"집하완료 전송오류",
//						"_vMessage":"스캔한 데이터가 없습니다.",
//					});

					return false;
				}

			}
			else{
				LEMP.Window.toast({
					"_sMessage":"집하완료시간을 선택해 주세요.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"집하완료 전송오류",
//					"_vMessage":"집하완료시간을 선택해 주세요.",
//				});

				return ;
			}

			page.apiParamInit();			// 파라메터 전역변수 초기화

		},


		// 집하완료전송 콜백
		cmptTrsmCallback : function(result){
			var _this = this;

			try{
				// api 전송 성공
				if(smutil.apiResValidChk(result) && result.code == "0000"){

					LEMP.Window.toast({
						"_sMessage" : "집하완료를 전송하였습니다.",
						"_sDuration" : "short"
					});


					page.listReLoad();					// 리스트 제조회
				}
			}
			catch(e){}
			finally{
				smutil.loadingOff();			// 로딩바 닫기
				page.apiParamInit();			// 파라메터 전역변수 초기화
			}
		},
		// ################### 집하완료전송(전송) end



		// 현제 리스트가 스캔이 되어있는지 체크
		// 스캔 했으면 true, 안했으면 false
		chkScanYn : function(inv_no){
			if(!smutil.isEmpty(inv_no) && $('#'+inv_no).length > 0){
				return !($('#'+inv_no).children(".baedalBox").is(".off"));
			}
			else {
				return false;
			}
		},


		// 현재 활성화 되어있는 텝 코드 리턴(일반집하 : G, 전산집하 : C)
		returnTabSctCd : function(){

			//현재 어느 탭에 있는지 상태체크
			var btnLst = $(".lstSchBtn");
			var btnObj;
			var pick_sct_cd;
			_.forEach(btnLst, function(obj, key) {
				btnObj = $(obj);

				if(btnObj.closest('li').is('.on')){
					pick_sct_cd = btnObj.data('pickSctCd');
					return false;
				}
			});

			page.tab_pick_sct_cd = pick_sct_cd;

			// 없으면G 리턴(일반집하)
			return smutil.nullToValue(pick_sct_cd,'G');
		},



		// 현재 활성화 시간구간코드 리턴
		returnTimeCd : function(){
			var cldl_tmsl_cd;
			// 일반 집하일 경우만 값을 찾아서 리턴
			if(page.returnTabSctCd() == "G"){

				var timeLst = $("li[name='timeLstLi']");

				//현재 어느 탭에 있는지 상태체크
				var btnObj;

				_.forEach(timeLst, function(obj, key) {
					btnObj = $(obj);

					if(btnObj.is('.on')){
						cldl_tmsl_cd = btnObj.data('timeLi');
						return false;
					}
				});
			}

			return cldl_tmsl_cd;
		},

		//현재 활성화 구역코드 리턴
		returnAreaCd : function(){
			var mbl_dlv_area;
			
			// 일반 집하일 경우만 값을 찾아서 리턴
			if(page.returnTabSctCd() == "G"){
				var timeLst = $("li[name='timeLstLi']");
	
				//현제 어느 탭에 있는지 상태체크
				var btnObj;
				_.forEach(timeLst, function(obj, key) {
					btnObj = $(obj);
	
					if(btnObj.is('.on')){
						mbl_dlv_area = btnObj.data('timeLi');
						return false;
					}
				});
			}
			
			return mbl_dlv_area;
		},

		// api 파람메터 초기화
		apiParamInit : function(){
			page.apiParam =  {
				id:"HTTP",			// 디바이스 콜 id
				param:{				// 디바이스가 알아야할 데이터
					task_id : "",										// 화면 ID 코드가 들어가기로함
					//position : {},									// 사용여부 미전송
					type : "",
					baseUrl : "",
					method : "POST",									// api 호출 형식(지정 안하면 'POST' 로 자동 셋팅)
					callback : "",										// api 호출후 callback function
					contentType : "application/json; charset=utf-8"
				},
				data:{"parameters" : {}}// api 통신용 파라메터
			};
		},



		// 물리적 뒤로가기 버튼 및 뒤로가기 화살표 버튼 클릭시 스캔 체크해서 전송여부 결정
		callbackBackButton : function(){
			// 하단 스캔건수 조회
			var scancnt ;

			// 일반집하
			if(page.returnTabSctCd() == "G"){
				scancnt = Number(smutil.nullToValue($('#scanLstCntG').text(),"0"));
			}
			else if(page.returnTabSctCd() == "C"){		// 전산집하
				scancnt = Number(smutil.nullToValue($('#scanLstCntC').text(),"0"));
			}

			// 스캔 후 전송안된 데이터가 남아있으면 전송 후 페이지 이동 가능
			if(scancnt>0){
				var btnCancel = LEMP.Window.createElement({ _sElementName:"TextButton" });
				btnCancel.setProperty({
					_sText : "취소",
					_fCallback : function(){}
				});

				var btnConfirm = LEMP.Window.createElement({ _sElementName:"TextButton" });
				btnConfirm.setProperty({
					_sText : "확인",
					_fCallback : function(){

						// 배달출발 확정(전송) 컴펌창 호출
						if(scancnt > 0){
							$('#pop2Txt2').html('스캔된 데이터 '+scancnt+'건<br />집하완료를 전송합니다.');
							$('.mpopBox.pop2').bPopup();
						}
						else{
							LEMP.Window.toast({
								"_sMessage":"스캔한 데이터가 없습니다.",
								'_sDuration' : 'short'
							});
//							LEMP.Window.alert({
//								"_sTitle":"집배달 완료 전송오류",
//								"_vMessage":"스캔한 데이터가 없습니다.",
//							});

							return false;
						}
					}
				});

				LEMP.Window.confirm({
					"_sTitle":"미전송 스캔데이터 확인.",
					"_vMessage" : "전송완료가 안된 스캔데이터가 있습니다.\n전송후 페이지 이동이 가능합니다. \n전송 하시겠습니까?",
					"_aTextButton" : [btnCancel, btnConfirm]
				});
			}
			else{
				LEMP.Window.close({
					"_oMessage" : {
						"param" : ""
					}
				});
			}
		},


		//com0301에서 날짜 선택 한 후 실행되는 콜백 함수
		COM0301Callback:function(res){
			$("#cldlBtnCal").text(res.param.date);
			page.selectedSchTime = "";
			page.mbl_dlv_area = "";
			page.listReLoad();					// 리스트 제조회
		},


		// 금액변경 callback 함수
		com1001Callback : function(res){

			if(!smutil.isEmpty(res)){

				var btnCancel = LEMP.Window.createElement({ _sElementName:"TextButton" });
				btnCancel.setProperty({
					_sText : "취소",
					_fCallback : function(){}
				});

				var btnConfirm = LEMP.Window.createElement({ _sElementName:"TextButton" });
				btnConfirm.setProperty({
					_sText : "확인",
					_fCallback : function(){
						page.fareUpt(res);
					}
				});

				LEMP.Window.confirm({
					"_sTitle":"운임변경",
					"_vMessage" : "선택한 송장의 운임을\n변경하시겠습니까?",
					"_aTextButton" : [btnCancel, btnConfirm]
				});
			}
			else{
				LEMP.Window.toast({
					"_sMessage":"송장번호 혹은 변경금액이\n없습니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"운임변경 오류",
//					"_vMessage":"송장번호 혹은 변경금액이\n없습니다."
//				});
			}
		},



		// ################### 기사 운임 변경 start
		fareUpt : function(res){
			page.apiParamInit();		// 파라메터 초기화

			var inv_no = res.inv_no;		// 미배달 선택한 송장번호
			inv_no = inv_no+"";				// 송장번호 문자로처리
			var cldl_sct_cd = "P";			// 배달업무
			var prcs_fare = res.prcs_fare;	// 기사 운임가격

			if(!smutil.isEmpty(inv_no)
					&& !smutil.isEmpty(prcs_fare)){

				//기사 운임 변경 api 호출
				page.apiParam.id = 'HTTP'
				page.apiParam.param.baseUrl = "smapis/cldl/fareUpt";				// api no
				page.apiParam.param.callback = "page.fareUptCallback";			// callback methode
				page.apiParam.data = {				// api 통신용 파라메터
					"parameters" : {
						"inv_no" : inv_no,					// 송장번호
						"cldl_sct_cd" : cldl_sct_cd,		// 업무구분
						"prcs_fare" : prcs_fare				// 기사운임가격
					}
				};

				// 공통 api호출 함수
				smutil.callApi(page.apiParam);

			}
			else {
				LEMP.Window.toast({
					"_sMessage":"송장번호 혹은 변경금액이\n없습니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"운임변경 오류",
//					"_vMessage":"송장번호 혹은 변경금액이\n없습니다."
//				});

				return false;
			}


		},


		// 기사운임변경 콜백
		fareUptCallback : function(result){

			page.apiParamInit();			// 파라메터 전역변수 초기화

			// api 전송 성공
			if(smutil.apiResValidChk(result) && result.code == "0000"){
				LEMP.Window.toast({
					"_sMessage":"기사운임 변경처리가 완료되었습니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"기사운임 변경완료",
//					"_vMessage":"기사운임 변경처리가 완료되었습니다."
//				});

				page.listReLoad();				// 리스트 제조회
			}
			else{
				var message = smutil.nullToValue(result.message,'');

				LEMP.Window.toast({
					"_sMessage":message,
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"기사운임 변경오류",
//					"_vMessage": message
//				});
			}
		},
		// ################### 미배달 처리 end



		// 두 번호로 휴대폰 번호가 있는경우 휴대폰 번호를 리턴, 없으면 일반전화번호 리턴
		getCpNo : function(phoneNum1, phoneNum2){
			var returnNum = "";

			// 둘다 핸드폰 번호가 아닌경우에는 phoneNum1 셋팅
			if(
				(
					!phoneNum1.LPStartsWith("010")
					&& !phoneNum1.LPStartsWith("011")
					&& !phoneNum1.LPStartsWith("016")
					&& !phoneNum1.LPStartsWith("017")
				) &&
				(
					!phoneNum2.LPStartsWith("010")
					&& !phoneNum2.LPStartsWith("011")
					&& !phoneNum2.LPStartsWith("016")
					&& !phoneNum2.LPStartsWith("017")
				)
			){
				returnNum = phoneNum1;
			}
			// phoneNum1 가 핸드폰 번호인경우 phoneNum1 셋팅
			else if(phoneNum1.LPStartsWith("010")
							|| phoneNum1.LPStartsWith("011")
							|| phoneNum1.LPStartsWith("016")
							|| phoneNum1.LPStartsWith("017")
			){
				returnNum = phoneNum1;
			}
			else if(!smutil.isEmpty(phoneNum2)){
				returnNum = phoneNum2;
			}

			return returnNum;

		},



		page_no : 1,						// 조회 요청한 페이지 번호
		item_cnt : 400,						// 전산집하에서 보여질 row 수
		page_navigation_cnt : 5,			// 페이징을 표시할 네게이션 수
		cmptScanList : null,				// 전산집하 스캔한 전체 리스트



		// 네비게이션 바 컨트롤
		pagingCtrl : function(){
			var pick_sct_cd = page.returnTabSctCd();		// 선택한 탭의 값 (일반 : G, 전산 : C)

			// 일반집하
			if(pick_sct_cd == "G"){
				$('#pagingUl').html('');
				$('#pagingDiv').hide();				// 네비게이션바 숨김
				page.cmptScanList = null;			// 전산집하 스캔리스트 초기화
				page.page_no = 1;					// 1페이지로 초기화
			}
			// 전산집하
			else{
				$('#pagingDiv').show();				// 네비게이션바 보이기
			}

		},


		// 페이징 초기화 및 숨김
		pagingInit : function(){
			$('#pagingUl').html('');
			$('#pagingDiv').hide();				// 네비게이션바 숨김
			page.cmptScanList = null;			// 전산집하 스캔리스트 초기화
			page.page_no = 1;					// 1페이지로 초기화
		},




		//############################################ 스캔 전체취소 로직 시작~!!!!
		// 전체 스캔 리스트 조회
		schCmptScanList : function(){
			smutil.loadingOn();

			page.apiParamInit();			// 파라메터 전역변수 초기화

			// 탭을 클릭했을때 한번만 총 스캔 리스트를 조회한다.
			page.apiParam.param.baseUrl = "smapis/cldl/cmptScanList";			// api no
			page.apiParam.param.callback = "page.schCmptScanListCallback";		// callback methode
			page.apiParam.data = {												// api 통신용 파라메터
				"parameters" : {}
			};

			// 공통 api호출 함수
			smutil.callApi(page.apiParam);
			page.apiParamInit();			// 파라메터 전역변수 초기화
		},

		// 전체 스캔 리스트 조회 callback
		schCmptScanListCallback : function(res){

			page.apiParamInit();			// 파라메터 전역변수 초기화

			// api 전송 성공
			if(smutil.apiResValidChk(res) && res.code == "0000"){
				// 스캔한 송장이 있을경우 전체 송장 파라메터를 만든다.
				if(res.data_count > 0){
					var invNoLst = [];
					$.each(res.data.list, function(idx, obj){
						invNoLst.push({
							"inv_no" : obj.inv_no,
							"cldl_sct_cd" : "P"
						});
					});

					// 일괄취소 api 호출
					page.cmptScanCclArr(invNoLst);
				}
				else{
					LEMP.Window.toast({
						"_sMessage":"현재 스캔된 송장정보가 없습니다.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle":"스캔 일괄취소 오류",
//						"_vMessage":"현재 스캔된 송장정보가 없습니다."
//					});

					smutil.loadingOff();			// 로딩바 닫기

					return
				}
			}
		},




		// 일괄 스캔취소 호출
		cmptScanCclArr : function(invNoLst){
			page.apiParamInit();			// 파라메터 전역변수 초기화

			if(invNoLst && invNoLst.length > 0){
				// 탭을 클릭했을때 한번만 총 스캔 리스트를 조회한다.
				page.apiParam.param.baseUrl = "smapis/cldl/cmptScanCclArr";			// api no
				page.apiParam.param.callback = "page.cmptScanCclArrCallback";		// callback methode
				page.apiParam.data = {												// api 통신용 파라메터
					"parameters" : invNoLst
				};

				// 공통 api호출 함수
				smutil.callApi(page.apiParam);
				page.apiParamInit();			// 파라메터 전역변수 초기화
			}
			else{
				LEMP.Window.toast({
					"_sMessage":"현재 스캔된 송장정보가 없습니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"스캔 일괄취소 오류",
//					"_vMessage":"현재 스캔된 송장정보가 없습니다."
//				});

				smutil.loadingOff();			// 로딩바 닫기

				return
			}


		},

		// 일괄 스캔취소 호출 callback
		cmptScanCclArrCallback : function(res){

			if(res && res.code == "00"){
				var count = res.data_count;
				var resObj;
				var successCnt = 0;				// 성공카운트
				var failureCnt = 0;				// 실패카운트

				for(var i=0 ; i < count ; i++){
					resObj = (res.data)[i];

					// 성공
					if(resObj.code == "0000"){
						successCnt++;
					}
					else {			// 실패
						failureCnt++;
					}
				}

				LEMP.Window.toast({
					"_sMessage":"스캔취소 성공 : "+successCnt+"건\n스캔취소 실패 : "+failureCnt+"건\n처리되었습니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"전체스켄취소 완료",
//					"_vMessage":"스캔취소 성공 : "+successCnt+"건\n스캔취소 실패 : "+failureCnt+"건\n처리되었습니다."
//				});

				page.listReLoad();			// 페이지 제조회

			}
			else{
				LEMP.Window.toast({
					"_sMessage":smutil.nullToValue(res.message, "전체스캔취소중 오류가 발생했습니다.\n연속해서 오류가 발생할경우 \n담당자에게 문의해 주세요."),
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle" : "전체스켄취소 오류 ",
//					"_vMessage" : smutil.nullToValue(res.message, "전체스켄취소중 오류가 발생했습니다.\n연속해서 오류가 발생할경우 \n담당자에게 문의해 주세요.")
//				});
			}

			smutil.loadingOff();			// 로딩바 닫기

		},


		//############################################ 스캔 전체취소 로직 종료~!!!!

		// 문자발송 서비스 호출
		sendSms : function(){
			var _this = this;
			var chkLst = [];
			var invNoLst = [];
			var chkYn = false;

			$("input[name=chk]:checked").each(function() {
				var inv_no = ($(this).attr("id")).replace('_chk', '');

				// 스캔 된 데이터만 문자가능
				if(_this.chkScanYn(inv_no)){
					chkLst.push($(this).val());
					invNoLst.push(inv_no);
				}
				else{
					chkYn = true;
					return false;
				}
			});

			// 다건 전송을 고려해서 스캔 안되있는 송장이 있을경우 문자발송 불가
			if(chkYn){
				LEMP.Window.toast({
					"_sMessage":"문자발송은 송장 스캔후 가능합니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"문자발송 오류",
//					"_vMessage":'문자발송은 송장 스캔후 가능합니다.'
//				});

				return false;
			}

			if(chkLst.length > 20){
				LEMP.Window.toast({
					"_sMessage":"문자발송은 20건까지만 선택 가능합니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"문자발송 오류",
//					"_vMessage":'문자발송은 20건까지만 선택 가능합니다.'
//				});

				return false;
			}


			// 전화번호가 없어도 문자 발송 가능하도록 기능 수정(20200204)
			if(chkLst.length > 0){
				var single = [];
				var timeTxt = "";

				// 중복 전화번호 제거
//				$.each(chkLst, function(i, el){
//					if($.inArray(el, single) === -1) single.push(el);
//				});

				if(page.dlvyCompl.area_sct_cd == "Y" && page.returnTabSctCd() == "G"){
					timeTxt = $('#' + invNoLst[0]).data('liTmslNm');
				}else if(page.dlvyCompl.area_sct_cd == "N" && page.returnTabSctCd() == "G"){
					// 선택한 시간 구분text 셋팅
					$("li[name=timeLstLi]").each(function() {
						if($(this).is('.on')){
							timeTxt = $(this).data('timeTxt');
							return false;
						}
					});
				}

				if((smutil.isEmpty(timeTxt) && page.dlvyCompl.area_sct_cd == "N" && page.returnTabSctCd() == "G")
						|| (smutil.isEmpty(timeTxt) && page.dlvyCompl.area_sct_cd == "Y" && chkLst.length == 1 && page.returnTabSctCd() == "G")){
					LEMP.Window.toast({
						"_sMessage":"선택한 시간 구간이 없습니다.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle":"문자발송 오류",
//						"_vMessage":'선택한 시간 구간이 없습니다.'
//					});

					return false;
				}
//				if(single.length > 1){
//					LEMP.Window.alert({
//						"_sTitle":"문자발송 오류",
//						"_vMessage":'문자발송은 전화번호 하나만 가능합니다.'
//					});
//
//					return false;
//				}
				/*else if(single.length == 1 && smutil.isEmpty(single[0])){
					LEMP.Window.alert({
						"_sTitle":"문자발송 오류",
						"_vMessage":'문자를 발송할 전화번호가 없습니다.'
					});

					return false;
				}*/
//				(20200129 : 전화번호 체크를 안하고 기사들이 변경 가능하게 모두 앱으로 넘어가도록 로직변경)
//				else if(single.length == 1 && !(single[0].LPStartsWith("010"))){
//					LEMP.Window.alert({
//						"_sTitle":"문자발송 오류",
//						"_vMessage":'핸드폰 번호가 아닙니다.'
//					});
//
//					return false;
//				}
				//else if(single.length == 1 && !smutil.isEmpty(single[0])){
				else{
					// 문자 발송 로직 시작~!!!
					var popUrl = smutil.getMenuProp("CLDL.CLDL0206","url");
					LEMP.Window.open({
						"_sPagePath":popUrl,
						"_oMessage":{"param":{}}
					});
				}


			}
			else{
				LEMP.Window.toast({
					"_sMessage":"문자를 발송할 송장을 선택해주세요.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"문자발송 오류",
//					"_vMessage":'문자를 발송할 송장을 선택해주세요.'
//				});
				return false;
			}

		},


		// sms 문구 선택 후에 콜백되는 함수
		// sms 문자발송
		smsMsgSeletPopCallback : function(res){
			var _this = this;
			var chkLst = [];
			var invNoLst = [];
			var chkYn = false;

			$("input[name=chk]:checked").each(function() {
				var inv_no = ($(this).attr("id")).replace('_chk', '');

				// 스캔 된 데이터만 문자가능
				if(page.chkScanYn(inv_no)){
					chkLst.push($(this).val());
					invNoLst.push(inv_no);
				}
				else{
					chkYn = true;
					return false;
				}
			});

			// 다건 전송을 고려해서 스캔 안되있는 송장이 있을경우 문자발송 불가
			if(chkYn){
				LEMP.Window.toast({
					"_sMessage":"문자발송은 송장 스캔후 가능합니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"문자발송 오류",
//					"_vMessage":'문자발송은 송장 스캔후 가능합니다.'
//				});

				return false;
			}

			if(chkLst.length > 20){
				LEMP.Window.toast({
					"_sMessage":"문자발송은 20건까지만 선택 가능합니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"문자발송 오류",
//					"_vMessage":'문자발송은 20건까지만 선택 가능합니다.'
//				});

				return false;
			}


			// 전화번호가 없어도 문자 발송 가능하도록 기능 수정(20200204)
			if(chkLst.length > 0){
				var single = [];
				var timeTxt = "";

				// 선택한 전화번호리스트 중복제거
				$.each(chkLst, function(i, el){
					// 공백 전화번호는 저장 안함
					if(!smutil.isEmpty(el)){
						if($.inArray(el, single) === -1) single.push(el);
					}

				});
				
				if(page.dlvyCompl.area_sct_cd == "Y" && page.returnTabSctCd() == "G"){
					timeTxt = $('#' + invNoLst[0]).data('liTmslNm');
				}else if(page.dlvyCompl.area_sct_cd == "N" && page.returnTabSctCd() == "G"){
					// 선택한 시간 구분text 셋팅
					$("li[name=timeLstLi]").each(function() {
						if($(this).is('.on')){
							timeTxt = $(this).data('timeTxt');
							return false;
						}
					});
				}
				
				if((smutil.isEmpty(timeTxt) && page.dlvyCompl.area_sct_cd == "N" && page.returnTabSctCd() == "G")
						|| (smutil.isEmpty(timeTxt) && page.dlvyCompl.area_sct_cd == "Y" && chkLst.length == 1 && page.returnTabSctCd() == "G")){
					LEMP.Window.toast({
						"_sMessage":"선택한 시간 구간이 없습니다.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle":"문자발송 오류",
//						"_vMessage":'선택한 시간 구간이 없습니다.'
//					});

					return false;
				}
				else {
					var text= res.msg_cont;			// 선택한 메세지

					if(chkLst.length == 1 && page.dlvyCompl.area_sct_cd == 'Y' && page.returnTabSctCd() == "G"){
						text += "\n도착예정시간 : " + timeTxt ;
					}
					
					if(page.dlvyCompl.area_sct_cd == 'N' && page.returnTabSctCd() == "G"){
						// 리스트에서 고른 시간구분text
						if(!smutil.isEmpty(timeTxt)){
							text += "\n도착예정시간 : " + timeTxt ;
						}
					}

					// 문자 발송 대상이 1건일 경우만 송장번호를 붙인다
					if(single.length == 1){
						// 송장번호 추가
						var invNoStr;
						text += "\n송장번호 : ";
						for (var i = 0; i < invNoLst.length; i++) {
							invNoStr = invNoLst[i];
							invNoStr = (invNoStr.split("_"))[0];
							if (invNoLst.length-1 === i) {
								text+=invNoStr;
							}else {
								text+=invNoStr+", ";
							}
						}

					}


					// 문자발송 기능 호출
					LEMP.System.callSMS({
						"_aNumber":single,
						"_sMessage":text
					});
				}

			}
			else{
				LEMP.Window.toast({
					"_sMessage":"문자를 발송할 송장을 선택해주세요.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"문자발송 오류",
//					"_vMessage":'문자를 발송할 송장을 선택해주세요.'
//				});
				return false;
			}

		}

		//현재 위치 가져오기
		, getLocation:function() {
			if(navigator.geolocation) { //GPS 지원여부
				navigator.geolocation.getCurrentPosition(function(position) {
					page.curLat = position.coords.latitude;
					page.curLong = position.coords.longitude;					
				}, function(error) {
					//console.error(error);
				}, {
					enableHighAccuracy : false,//배터리를 더 소모해서 더 정확한 위치를 찾음
					maximumAge: 0, //한 번 찾은 위치 정보를 해당 초만큼 캐싱
					timeout: Infinity //주어진 초 안에 찾지 못하면 에러 발생
				});
			}
			
		}
		// 운송장목록 팝업창 닫을때 callback 함수
		, com0201Callback : function(res){
			console.log(' com0201Callback:: ', res);	
			if(!smutil.isEmpty(res.param.step_sct_cd)) {
				page.listReLoad();
			}
		}
};

