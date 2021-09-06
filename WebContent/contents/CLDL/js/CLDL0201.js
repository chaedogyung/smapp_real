LEMP.addEvent("backbutton", "page.callbackBackButton");		// 뒤로가기 버튼 클릭시 이벤트

var page = {

		selectedSchTime : null,		// 선택한 시간구분값
		changeTimeInvNo : null,		// 시간 변경을 선택한 invNo
		changeTimeSctCd : null,		// 시간 변경을 선택한 송장의 배달, 집하코드
		reqAcptRgstInvNo : null,	// 인수자 변경을 선택한 송장번호
		mbl_dlv_area: null,
		mbl_dlv_nm : null,
		// api 호출 기본 형식
		apiParam : {
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
		},

		init:function()
		{
			// 달력셋팅
			var curDate = new Date();
			curDate = curDate.getFullYear() + "." + ("0"+(curDate.getMonth()+1)).slice(-2) + "." + ("0"+curDate.getDate()).slice(-2);
			$('#cldlBtnCal').text(curDate);

			page.initEvent();			// 페이지 이벤트 등록
			page.initDpEvent();			// 화면 디스플레이 이벤트
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

			/* li 이동 */
			$("#sortable > li").each(function(){
				$(this).find('input[name=num]').val($(this).index()+1);
			});
			$("#sortable").sortable({
				startIdx : null,
				disabled:false,
				handle:".move",
				start: function(event, ui) {
					this.startIdx = ui.item.index();
				},
				stop: function(event, ui) {

					var stopIdx = ui.item.index();

					if(this.startIdx != stopIdx){
						var chg_inv_no = "";
						var next_inv_no = "";
						var liObj;
						$("#sortable > li").each(function(){
							liObj = $(this);

							// 내가 멈춘 idx 의 inv_no
							if(liObj.index() == stopIdx){
								chg_inv_no = liObj.attr('id');
							}// 내가 멈춘 다음 idx 의 inv_no
							else if(liObj.index() == (stopIdx+1)){
								next_inv_no = liObj.attr('id');
								return false;
							}
						});

						// 이벤트가 있고 stopIdx == 0 이면서 nextInvNo 가 꼭 있어야 api 호출
						// 멈춘 순서가 0번이고 다음 송장번호가 없는경우는 1건만 있는 데이터이기때문에 순서변경을 할 수 없다.
						if(stopIdx == 0 && smutil.isEmpty(next_inv_no)){}
						else{
							// 집배달 리스트 순서변경 호출
							_this.dprtListSeqUpd(chg_inv_no, next_inv_no);
						}
					}
				},
				cancel:"",
				axis:'y'
			});



			/* 제스처 */
			var thisN = ".baedalListBox > ul > li > .baedalBox";
			var thisW = 0;
			var thisC = 0;
			$(document).on("click, touchstart", thisN,function(e){
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
				
				
//				var popUrl = smutil.getMenuProp("FRE.FRE0301","url");
//
//				LEMP.Window.open({
//					"_sPagePath":popUrl,
//					"_oMessage":{
//						"param":null
//					}
//				});


				// 집하완료 페이지로 전환
//				var popUrl = smutil.getMenuProp('CLDL.CLDL0301', 'url');
////				LEMP.Window.open({
////					"_sPagePath":popUrl
////				});
////
////				LEMP.Window.close();
//				LEMP.Window.replace({
//					"_sPagePath":popUrl
//				});
//			});


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

			});	// end 스캔버튼을 누른경우 종료


			// 상단 조회 탭 클릭
			$(".lstSchBtn").click(function(){
				var cldl_sct_cd = $(this).data('schSctCd');		// 선택한 탭의 값 (A,P,D)

				// 집하 배달 탭 표시처리
				var btnLst = $(".lstSchBtn");
				var btnObj;
				_.forEach(btnLst, function(obj, key) {
					btnObj = $(obj);
					if(cldl_sct_cd == btnObj.data('schSctCd')){
						btnObj.closest('li').addClass( 'on' );
					}
					else{
						btnObj.closest('li').removeClass( 'on' );
					}
				});

				page.listReLoad();					// 리스트 제조회
			});


			// 상단 시간선택 클릭이벤트 등록
			$(document).on('click', "li[name='timeLstLi']", function(e){

				$("li[name='timeLstLi']").removeClass('on');
				$(this).addClass('on');

				// 선택한 시간목록값 전역변수로 셋팅
				page.selectedSchTime = $(this).data('timeLi')+"";

				// 리스트 제조회
				page.listReLoad();
			});


			// 구분 필터값 변경
			$("#fltr_sct_cd").on('change', function(){
				page.listReLoad();					// 리스트 제조회
			});



			// 스켄취소 버튼 누른경우 이벤트
			$(document).on('click', '.btn.cancel', function(e){
				var inv_no = $(this).data('cancelInvNo');
				var cldl_sct_cd = $(this).data('cancleSctCd');
				var curDate = new Date();
				curDate = curDate.getFullYear() + ("0"+(curDate.getMonth()+1)).slice(-2) + ("0"+curDate.getDate()).slice(-2);
				var scanYmd = smutil.nullToValue($('#cldlBtnCal').text(),curDate);
				scanYmd = scanYmd.split('.').join('');
				// 스켄 취소 전문 호출
				_this.plnScanCcl(inv_no, cldl_sct_cd, scanYmd);

			});



			// 송장번호 누른경우 (상세보기 연결)
			$(document).on('click', '.invNoSpan', function(event){
				if ($(event.target).parents('li').length > 0) {

					var liElement = $(event.target);
					$('.baedalBox').removeClass('bg-v2');									// 다른 row 선택초기화
					liElement.parents('.baedalBox').addClass('bg-v2');						// row 선택 표시
					var sctCd = liElement.parents('li').data('liSctCd');		// 업무 구분

					if(!smutil.isEmpty(sctCd)){

						var inv_no = liElement.parents('li').data('invNo')+"";				// 송장번호
						var rsrv_mgr_no = liElement.parents('li').data('rsrvMgrNo')+"";		// 접수번호

						// 팝업 url 호출
						var popUrl;

						if(sctCd == "P"){		// 집하 팝업

							popUrl = smutil.getMenuProp('CLDL.CLDL0202', 'url');

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
						else if(sctCd == "D"){		// 배달 팝업

							popUrl = smutil.getMenuProp('CLDL.CLDL0203', 'url');

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


			// 기사메모 팝업 호출
			$(document).on('click', '.btn.bdM.blue2.bdMemo.mgl1', function(e){
				var inv_no = $(this).data('invNo')+"";

				if(smutil.isEmpty(inv_no)){
					LEMP.Window.alert({
						"_sTitle" : "메모 오류",
						"_vMessage" : "선택된 송장번호가 없습니다.\n관리자에게 문의해주세요."
					});

					return false;
				}

				// 기사 메모 팝업 호출
				var popUrl = smutil.getMenuProp('CLDL.CLDL0204', 'url');

				LEMP.Window.open({
					"_sPagePath":popUrl,
					"_oMessage" : {
						"param" : {
							"inv_no" : inv_no+""
						}
					}
				});

			});


			// 고객요청(인수자변경) 팝업호출
			$(document).on('click', '.btn.bdM.blue3.bdMic.mgl1', function(e){
				var inv_no = $(this).data('invNo')+"";


				if(!smutil.isEmpty(inv_no)){
					page.reqAcptRgstInvNo = inv_no;

					// 인수자 선택 팝업호출
					var popUrl = smutil.getMenuProp('COM.COM0601', 'url');

					LEMP.Window.open({
						"_sPagePath":popUrl
					});
				}
				else{
					LEMP.Window.alert({
						"_sTitle":"희망인수자 변경오류",
						"_vMessage":"선택한 송장번호가 없습니다.",
					});
				}



			});


			// 시간수정 팝업호출
			$(document).on('click', '.btn.bdM.blue4.bdClock.mgl1', function(e){
				var inv_no = $(this).data('invNo')+"";
				var cldl_sct_cd = $(this).data('sctCd')+"";
				page.changeTimeInvNo = inv_no;					// 시간수정을 하기위한 송장번호 전역변수로 셋팅
				page.changeTimeSctCd = cldl_sct_cd;				// 시간수정버튼을 클릭한 송장번호의 배달, 집하 구분코드 전역변수로 셋팅

				// 기사 메모 팝업 호출
				var popUrl = smutil.getMenuProp('COM.COM0501', 'url');

				LEMP.Window.open({
					"_sPagePath":popUrl
					/*, "_oMessage" : {
						"param" : {
							"inv_no" : inv_no+"",
							"menuId" : "CLDL0201"
						}
					}*/
				});

			});


			// 배달출발 전송 버튼 클릭
			// [20200121 : 시간대별 전송에서 리스트 전체 전송으로 수정]
			$('#dprtTrsmTrsmBtn').click(function(e){

//				var scanCnt = 0;
//				var liLst = $('.cldl0201LstUl').children('li');
//				scanCnt = Number(liLst.length);
				var cldl_sct_cd = page.returnTabSctCd();		// 업무구분 (전체 : A, 집하 : P, 배달 : D)
				var dprtTrsmCnt = Number($('#'+cldl_sct_cd+'_cldl0201Cnt').text());

				// nodata 표시인경우
				if(dprtTrsmCnt == 0 || smutil.isEmpty(dprtTrsmCnt)){
					LEMP.Window.alert({
						"_sTitle":"집배달 출발 확정 오류",
						"_vMessage":"전송할 데이터가 없습니다.",
					});

					return false;
				}
				// 배달출발 확정(전송) 컴펌창 호출
				else{
					$('#pop2Txt2').html(dprtTrsmCnt + '건의 집배달 출발을 전송합니다.');
					$('.mpopBox.pop2').bPopup();
				}

			});


			// 배달출발확정 버튼 'yes' 버튼 클릭
			$('#dprtTrsmYesBtn').click(function(e){
				// 배달출발 확정로직 시작
				_this.dprtTrsm();
			});



			// 문자버튼 클릭
			$('.btn.ftSms').click(function(e){
				// 문자발송 이벤트 호출
				_this.sendSms();
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
							"step_sct_cd":"0",
							"base_ymd" : base_ymd
						}
					}
				});
			});


			// ###################################### handlebars helper 등록 start
			// 집하, 배달 구분(집하 = if true, 배달은=else)
			Handlebars.registerHelper('cldlSctCdChk', function(options) {
				if(this.cldl_sct_cd === "P"){	// 집하
					// options.fn == if(true)
					return options.fn(this)
				}
				else{	// 배달
					// options.inverse == else
					return options.inverse(this);
				}
			});
			Handlebars.registerHelper('bldAnnmArea', function(options) {
				if(this.bld_annm_area === null){	// 집하
					// options.fn == if(true)
					debugger;
					return options.fn(this)
				}
				else{	// 배달
					// options.inverse == else
					return options.inverse(this);
				}
			});


			// 집하, 배달 구분(집하 = if true, 배달은=else)
			Handlebars.registerHelper('cldlSctCdChkTag', function(options) {

				var html = "";
				var phoneNumber = "";

				if(this.cldl_sct_cd === "P"){	// 집하
					if(!smutil.isEmpty(this.snper_nm)){
						html = html + '<li>' + this.snper_nm + '</li>';
					}

					var snper_tel = smutil.nullToValue(this.snper_tel,"");
					var snper_cpno = smutil.nullToValue(this.snper_cpno,"");
					phoneNumber = page.getCpNo(snper_tel, snper_cpno);

					if(!smutil.isEmpty(phoneNumber)){
						html = html + '<li>' + phoneNumber + '</li>';
					}

				}
				else{	// 배달
					if(!smutil.isEmpty(this.acper_nm)){
						html = html + '<li>' + this.acper_nm + '</li>';
					}

					var acper_tel = smutil.nullToValue(this.acper_tel,"");
					var acper_cpno = smutil.nullToValue(this.acper_cpno,"");

					phoneNumber = page.getCpNo(acper_tel, acper_cpno);

					if(!smutil.isEmpty(phoneNumber)){
						html = html + '<li>' + phoneNumber + '</li>';
					}

				}

				// 고객요청 인수자 정보 셋팅
				if(!smutil.isEmpty(this.req_acpr_nm)){
					if(this.req_acpt_rgst_sct_cd == "01"){		// 고객요청
						html = html + '<li id="reqAcptSctCd_'+this.inv_no+'" data-req-acpt-sct-cd='+this.req_acpt_sct_cd+'><span class="tGreen">' + this.req_acpr_nm + '</span></li>';
					}
					else if(this.req_acpt_rgst_sct_cd == "02"){		// 기사변경
						html = html + '<li id="reqAcptSctCd_'+this.inv_no+'" data-req-acpt-sct-cd='+this.req_acpt_sct_cd+'><span class="tRed">' + this.req_acpr_nm + '</span></li>';
					}
				}

				if(!smutil.isEmpty(html)){
					html = '<div class="infoList"><ul>' + html + '</ul></div>';
				}


				return new Handlebars.SafeString(html); // mark as already escaped
			});


			// 송장번호가 없을경우 접수번호 반환
			Handlebars.registerHelper('returnKey', function(options) {
				var inv_no = this.inv_no;				// 송장번호
				var rsrv_mgr_no = this.rsrv_mgr_no;		// 접수번호

				if(this.cldl_sct_cd === "P"){			// 집하
					// 접수번호가 없을경우는 송장번호를 리턴
					if(smutil.isEmpty(inv_no)){
						return rsrv_mgr_no;
					}
					else{
						return inv_no;
					}
				}
				else{	// 배달
					return inv_no;
				}
			});



			// 스켄한 데이터인지 판단해서 if else 반환
			Handlebars.registerHelper('chkScanCmptYn', function(options) {
				var scan_cmpt_yn = this.scan_cmpt_yn;				// 스켄여부

				if(this.scan_cmpt_yn == "Y"){	// 스켄했음  if true
					return options.fn(this)
				}
				else{	// 스켄 안함 else
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
							result = '<span class="badge blue s imgNum">' + result + '</span>';
						}
						else{
							result = '<span class="badge red s imgNum">' + result + '</span>';
						}
					}
					else{
						result = '<span class="'+classTxt+'">' + result + '</span>';
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


			// 스켄한 데이터인지 여부 확인
			Handlebars.registerHelper('scanYnClass', function(options) {
				if(this.scan_cmpt_yn == 'N'){
					return 'off';
				}
//				else {
//					return 'bg-v2';
//				}
			});



			// 전화번호가 있으면 전화걸기 버튼 리턴하고 없으면 버튼 리턴 안함 (집하 = 보낸사람, 배달 = 받는사람)
			Handlebars.registerHelper('setPhoneNumber', function(options) {
				var telNum;

				if(this.cldl_sct_cd === "P"){	// 집하

					var snper_tel = smutil.nullToValue(this.snper_tel,"");
					var snper_cpno = smutil.nullToValue(this.snper_cpno,"");

					telNum = page.getCpNo(snper_tel, snper_cpno);
				}
				else{	// 배달

					var acper_tel = smutil.nullToValue(this.acper_tel,"");
					var acper_cpno = smutil.nullToValue(this.acper_cpno,"");

					telNum = page.getCpNo(acper_tel, acper_cpno);

				}

				if(!smutil.isEmpty(telNum)){
					var html = '<button class="btn bdM blue bdPhone" data-phone-number="'+telNum+'">전화</button>';
					return new Handlebars.SafeString(html); // mark as already escaped
				}
				else{
					return '';
				}
			});




			// 집하 배달 맨 앞 라벨 표시(파랑, 빨강)
			Handlebars.registerHelper('getBoxClass', function(options) {
				var result = "";
				if(this.cldl_sct_cd === "P"){	// 집하
					return 'jibBox';
				}
				else{	// 배달
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

				if(this.cldl_sct_cd === "P"){	// 집하

					var snper_tel = smutil.nullToValue(this.snper_tel,"");
					var snper_cpno = smutil.nullToValue(this.snper_cpno,"");

					telNum = page.getCpNo(snper_tel, snper_cpno);
				}
				else{	// 배달

					var acper_tel = smutil.nullToValue(this.acper_tel,"");
					var acper_cpno = smutil.nullToValue(this.acper_cpno,"");

					telNum = page.getCpNo(acper_tel, acper_cpno);

				}

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


			// 전체 , (집하, 배달) 구분
			Handlebars.registerHelper('cldlSctCdTabChk', function(options) {
				if(page.returnTabSctCd() != "A"){	// 전체가 아니면 true
					// options.fn == if(true)
					return options.fn(this)
				}
				else{	// 전체면 false
					// options.inverse == else
					return options.inverse(this);
				}
			});



			// 의류특화일경우 보조송장 등록버튼 표시
			Handlebars.registerHelper('setSubBoxBtn', function(options) {
				if(!smutil.isEmpty(this.svc_cd) && this.svc_cd == "01"){
					var html;
					// 원송장
					if(this.inv_atrb_cd == "00"){
						html = '<span data-inv-no="'+this.inv_no+'" class="tagInfo tagInfo3" id="blackSubBox">원송장</span>';
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

			// ###################################### handlebars helper 등록 end
			//시간변경 이벤트 
			$("#chngTme").click(function(){
				var scanCnt = 0;
				var selList = [];
				var _this = this;
				var chkLst = [];
				var invNoLst = [];

				$("input[name=chk]:checked").each(function() {
					var invNo = $(this).attr("id").split("_");
					invNoLst.push(invNo[0]);
				});
				
				var cldl_sct_cd = page.returnTabSctCd();		// 업무구분 (전체 : A, 집하 : P, 배달 : D)
				var dprtTrsmCnt = Number($('#'+cldl_sct_cd+'_cldl0201Cnt').text());
				
				// nodata 표시인경우
				if(dprtTrsmCnt == 0 || smutil.isEmpty(dprtTrsmCnt)){
					LEMP.Window.alert({
						"_sTitle":"집배달 출발 확정 오류",
						"_vMessage":"전송할 데이터가 없습니다.",
					});

					return false;
				}
				//TO-DO 변경 API 구성 후 호출
				page.changeDlvyTime(invNoLst);
			});
			
			//구역변경 이벤트
			$("#chngArea").click(function(){
				var cldl_sct_cd = page.returnTabSctCd();		// 업무구분 (전체 : A, 집하 : P, 배달 : D)
				var scanCnt = 0;
				var selList = [];
				var _this = this;
				var chkLst = [];
				var invNoLst = [];
				var chngArea = $("#cldl_area_cd").val();
				$("input[name=chk]:checked").each(function() {
					var invNo = $(this).attr("id").split("_");
					invNoLst.push(invNo[0]);
				});
				
//				var cldl_sct_cd = page.returnTabSctCd();		// 업무구분 (전체 : A, 집하 : P, 배달 : D)
				var dprtTrsmCnt = Number($('#'+cldl_sct_cd+'_cldl0201Cnt').text());
				

				$("input[name=chk]:checked").each(function() {
					var cpNo = $(this).val();

					chkLst.push($(this).val());
//					invNoLst.push($(this).attr("id"));
				});
				
				
				// nodata 표시인경우
				if(dprtTrsmCnt == 0 || smutil.isEmpty(dprtTrsmCnt)){
					LEMP.Window.alert({
						"_sTitle":"집배달 출발 확정 오류",
						"_vMessage":"전송할 데이터가 없습니다.",
					});

					return false;
				}
				//TO-DO 변경 API 구성 후 호출
			
				page.changeDlvyArea(invNoLst, chngArea);
			});
			
			//설정여부에 따라 시간 선택 여부 노출
			/*$(function(){
				var dlvyCompl = LEMP.Storage.get({ "_sKey" : "autoMenual"});
				if(dlvyCompl.area_sct_cd == "Y"){
					$("#span_cldl_sct_cd").hide();
					$("#chngTme").hide();
				}
				
			});*/
			
			
			// ###################################### handlebars helper 등록 end
		},
		


		// 화면 디스플레이 이벤트
		initDpEvent : function(){
			var _this = this;

			if(smutil.isEmpty($("#cldlBtnCal").text())){
				LEMP.Window.alert({
					"_sTitle":"리스트 조회오류",
					"_vMessage":"조회할 날짜를 선택해 주세요"
				});
				return false;
			}

			smutil.loadingOn();
			_this.plnFltrListSerch();		// 필터 리스트 조회
		},




		// ################### 필터조건 조회 start
		// 필터조건 조회
		plnFltrListSerch : function(){
			var _this = this;

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

				page.dprtCnt();		// 리스트 조회
			}
		},
		// ################### 필터조건 조회 end


		// ################### 최상단 집배달 리스트 카운트 조회 start
		// 집배달 출발 리스트 카운트 조회
		dprtCnt : function(){
			var _this = this;

			_this.apiParam.param.baseUrl = "smapis/cldl/dprtCnt";					// api no
			_this.apiParam.param.callback = "page.dprtCntCallback";					// callback methode

			// 날짜셋팅
			var curDate = new Date();
			curDate = curDate.getFullYear() + ("0"+(curDate.getMonth()+1)).slice(-2) + ("0"+curDate.getDate()).slice(-2);
			var base_ymd = smutil.nullToValue($('#cldlBtnCal').text(),curDate);
			base_ymd = base_ymd.split('.').join('');

			_this.apiParam.data = {"parameters" : {"base_ymd":base_ymd}};			// api 통신용 파라메터

			// 공통 api호출 함수
			smutil.callApi(_this.apiParam);

			page.apiParamInit();		// 파라메터 전역변수 초기화
		},

		// 집배달 출발 리스트 카운트 조회 callback
		dprtCntCallback : function(result){
			page.apiParamInit();		// 파라메터 전역변수 초기화

			// api 결과 성공여부 검사
			if(smutil.apiResValidChk(result) && result.code == "0000"){
				var data = {};

				if(!smutil.isEmpty(result.data.list)){
					var cnt = 0;
					$.each(result.data.list, function(index, obj){
						if(smutil.isEmpty(obj.cldl_cnt)) {
							cnt = 0 ;
						}
						else{
							cnt = obj.cldl_cnt ;
						}

						$("#"+obj.cldl_sct_cd+"_cldl0201Cnt").text(cnt);
					});
				}

				var dlvyCompl = LEMP.Storage.get({ "_sKey" : "autoMenual"});
				if(!_.isUndefined(dlvyCompl)){
					debugger;
					if(dlvyCompl.area_sct_cd == "Y"){
						page.dprtAreaList();            // 구역기준조회
					}else{
						page.dprtTmList();				// 예정시간리스트 조회
					}
					
				}
				
			}

		},
		// ################### 최상단 집배달 리스트 카운트 조회 end
		dprtAreaList : function(){
			var _this = this;

			_this.apiParam.param.baseUrl = "smapis/cldl/dprtAreaList";					// api no
			_this.apiParam.param.callback = "page.dprtAreaListCallback";					// callback methode

			// 날짜셋팅
			var curDate = new Date();
			curDate = curDate.getFullYear() + ("0"+(curDate.getMonth()+1)).slice(-2) + ("0"+curDate.getDate()).slice(-2);
			var base_ymd = smutil.nullToValue($('#cldlBtnCal').text(),curDate);
			base_ymd = base_ymd.split('.').join('');

			_this.apiParam.data = {"parameters" : {"base_ymd":base_ymd}};				// api 통신용 파라메터

			// 공통 api호출 함수
			smutil.callApi(_this.apiParam);

			page.apiParamInit();		// 파라메터 전역변수 초기화
		},


		// ################### 시간대별 조회건수 조회 start
		dprtTmList : function(){
			var _this = this;

			_this.apiParam.param.baseUrl = "smapis/cldl/dprtTmList";					// api no
			_this.apiParam.param.callback = "page.dprtTmListCallback";					// callback methode

			// 날짜셋팅
			var curDate = new Date();
			curDate = curDate.getFullYear() + ("0"+(curDate.getMonth()+1)).slice(-2) + ("0"+curDate.getDate()).slice(-2);
			var base_ymd = smutil.nullToValue($('#cldlBtnCal').text(),curDate);
			base_ymd = base_ymd.split('.').join('');

			_this.apiParam.data = {"parameters" : {"base_ymd":base_ymd}};				// api 통신용 파라메터

			// 공통 api호출 함수
			smutil.callApi(_this.apiParam);

			page.apiParamInit();		// 파라메터 전역변수 초기화
		},


		// 시간대별 조회건수 callback
		dprtTmListCallback : function(result){

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
					var source = $("#cldl0201_timeLst_template").html();

					// 핸들바 템플릿 컴파일
					var template = Handlebars.compile(source);

					// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
					var liHtml = template(data);

					// 생성된 HTML을 DOM에 주입
					$('#dprtTmListUl').html(liHtml);


					/* touchFlow 등록*/
					$(".divisionBox .selectBox").touchFlow();

					// 선택한 값이 없을경우는 시간리스트의 첫번째 순서를 on 상태로 만든다
					// 최초에 들어온 경우만 이벤트 등록
					if(smutil.isEmpty(page.selectedSchTime)){

						// 현제 어느 시간데를 선택했는지 검사
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
						// 현제 어느 시간구간을 선택했는지 검사
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
							// 현제 어느 시간데를 선택했는지 검사
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
					// 생성된 HTML을 DOM에 주입
					$('#dprtTmListUl').html('');
				}

				page.dprtList();			// 리스트 조회
			}
		},
		
		// 구역별 조회건수 callback
		dprtAreaListCallback : function(result){

			page.apiParamInit();		// 파라메터 전역변수 초기화

			// api 결과 성공여부 검사
			if(smutil.apiResValidChk(result) && result.code == "0000"){

				// 조회 결과 데이터가 있으면 옵션 생성
				if(result.data_count > 0){
					var data = result.data;
					result.data.list[0].mbl_dlv_area = "A";
					//오름차순 정렬
					_.forEach(data.list, function(e, key) {
						
						if(e.mbl_dlv_area == null){
							data.list[key].mbl_dlv_area = "기타";
						}else{
							data.list[key].mbl_dlv_area = e.mbl_dlv_area;
						}
					});
					
					//오름차순 정렬
					data.list.sort(function(a, b) {
						console.log(a);
						console.log(b);
						return a.mbl_dlv_area;
					});
debugger;
					// 핸들바 템플릿 가져오기
					var source = $("#cldl0201_timeLst_template").html();

					// 핸들바 템플릿 컴파일
					var template = Handlebars.compile(source);

					// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
					var liHtml = template(data);

					// 생성된 HTML을 DOM에 주입
					$('#dprtTmListUl').html(liHtml);


					/* touchFlow 등록*/
					$(".divisionBox .selectBox").touchFlow();

					// 선택한 값이 없을경우는 시간리스트의 첫번째 순서를 on 상태로 만든다
					// 최초에 들어온 경우만 이벤트 등록
					if(smutil.isEmpty(page.selectedSchTime)){

						// 현제 어느 시간데를 선택했는지 검사
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
						// 현제 어느 시간구간을 선택했는지 검사
						var timeLstLi = $("li[name='timeLstLi']");
						var timeObj;
						_.forEach(timeLstLi, function(obj, key) {
							timeObj = $(obj);
							if(timeObj.data('timeLi') == page.selectedSchTime){
								timeObj.addClass('on');
								if(page.selectedSchTime == "기타"){
									page.selectedSchTime = "";
								}
								return false;
							}
						});

						// 활성화된 시간구간코드가 없으면 첫번째 리스트를 선택
						if(smutil.isEmpty(page.returnTimeCd())){
							// 현제 어느 시간데를 선택했는지 검사
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
					// 생성된 HTML을 DOM에 주입
					$('#dprtTmListUl').html('');
				}

				page.dprtList();			// 리스트 조회
			}
		},
		// ################### 시간대별 조회건수 조회 end




		// ################### 페이지 리스트 조회 start
		dprtList : function(){
			var _this = this;
			var cldl_sct_cd = _this.returnTabSctCd();		// 업무구분 (전체 : A, 집하 : P, 배달 : D)
			var fltr_sct_cd = $('#fltr_sct_cd').val();		// 필터구분
			var cldl_tmsl_cd = _this.returnTimeCd();			// 현제 어느 시간을 선택했는지 검사


			_this.apiParam.param.baseUrl = "smapis/cldl/dprtList";				// api no
			_this.apiParam.param.callback = "page.dprtListCallback";			// callback methode

			// 날짜셋팅
			var curDate = new Date();
			curDate = curDate.getFullYear() + ("0"+(curDate.getMonth()+1)).slice(-2) + ("0"+curDate.getDate()).slice(-2);
			var base_ymd = smutil.nullToValue($('#cldlBtnCal').text(),curDate);
			base_ymd = base_ymd.split('.').join('');

			_this.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {
					"cldl_sct_cd" : smutil.nullToValue(cldl_sct_cd,"A"),		// 업무구분
					"fltr_sct_cd" : smutil.nullToValue(fltr_sct_cd,""),			// 필터구분
					"cldl_tmsl_cd" : smutil.nullToValue(cldl_tmsl_cd,""),		// 시간코드
					"base_ymd" : base_ymd
				}
			};

			// 공통 api호출 함수
			smutil.callApi(_this.apiParam);

			page.apiParamInit();		// 파라메터 전역변수 초기화
		},


		// 리스트 조회후 그리기
		dprtListCallback : function(result){
			page.apiParamInit();		// 파라메터 전역변수 초기화

			try{
				// 스켄건수
				var scanLstCnt = $('#scanLstCnt');

				// 조회한 결과가 있을경우
//				if(false && smutil.apiResValidChk(result) && result.code == "0000"
//						&& result.data_count > 0){
				if(smutil.apiResValidChk(result) && result.code == "0000"){

					var data = {};

					if(result){
						data = result.data;
					}
					//data = [];

					// 핸들바 템플릿 가져오기
					var source = $("#cldl0201_list_template").html();

					// 핸들바 템플릿 컴파일
					var template = Handlebars.compile(source);

					// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
					var liHtml = template(data);

					// 생성된 HTML을 DOM에 주입
					$('.cldl0201LstUl').html(liHtml);

				}
				else{		// 조회 결과 없음
					scanLstCnt.hide();		// 전체 스켄건수 숨김
				}
			}
			catch(e){}
			finally{
				smutil.loadingOff();			// 로딩바 닫기
			}

		},
		// ################### 페이지 리스트 조회 end


		// 리스트 제조회 함수
		listReLoad : function(){
			if(smutil.isEmpty($("#cldlBtnCal").text())){
				LEMP.Window.alert({
					"_sTitle":"리스트 조회오류",
					"_vMessage":"조회할 날짜를 선택해 주세요"
				});
				return false;
			}

			smutil.loadingOn();				// 로딩바 시작
			page.dprtCnt();					// 상단 카운트 조회
		},



		// ################### 집배달출발 전송 start
		dprtTrsm : function(){

			var _this = this;
			var cldl_sct_cd = _this.returnTabSctCd();		// 업무구분 (전체 : A, 집하 : P, 배달 : D)
			var cldl_tmsl_cd = _this.returnTimeCd();		// 시간구분코드
			var base_ymd = $('#cldlBtnCal').text();

			if(smutil.isEmpty(base_ymd)){

				LEMP.Window.alert({
					"_sTitle":"집배달 출발 전송 오류",
					"_vMessage":"날짜를 선택해 주세요.",
				});

				return ;
			}

			base_ymd = base_ymd.split('.').join('');

			// 시간대별 전송이 아닌 전체 전송으로 수정(20200121 : 수정사항 반영)
			//if(!smutil.isEmpty(cldl_sct_cd) && !smutil.isEmpty(cldl_tmsl_cd)){
			if(!smutil.isEmpty(cldl_sct_cd)){
				_this.apiParamInit();		// 파라메터 전역변수 초기화
				_this.apiParam.param.baseUrl = "smapis/cldl/dprtTrsm";			// api no
				_this.apiParam.param.callback = "page.dprtTrsmCallback";		// callback methode
				_this.apiParam.data = {						// api 통신용 파라메터
					"parameters" : {
						"cldl_sct_cd" : cldl_sct_cd			// 업무구분
						//, "cldl_tmsl_cd" : cldl_tmsl_cd
						, "base_ymd" : base_ymd				// 기준일자
					}
				};

				smutil.loadingOn();				// 로딩바 on

				// 공통 api호출 함수
				smutil.callApi(_this.apiParam);
			}

		},


		// 배달출발전송 콜백
		dprtTrsmCallback : function(result){
			var _this = this;

			try{

				// api 전송 성공
				if(smutil.apiResValidChk(result) && result.code == "0000"){
					LEMP.Window.toast({
						"_sMessage" : "집배달출발을 전송하였습니다.",
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
		// ################### 배달출발확정(전송) end


		// 문자발송 서비스 호출
		sendSms : function(){
			var _this = this;
			var chkLst = [];
			var invNoLst = [];

			$("input[name=chk]:checked").each(function() {
				var cpNo = $(this).val();

				chkLst.push($(this).val());
				invNoLst.push($(this).attr("id"));
			});


			if(chkLst.length > 20){
				LEMP.Window.alert({
					"_sTitle":"문자발송 오류",
					"_vMessage":'문자발송은 20건까지만 선택 가능합니다.'
				});

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

				// 선택한 시간 구분text 셋팅
				$("li[name=timeLstLi]").each(function() {
					if($(this).is('.on')){
						timeTxt = $(this).data('timeTxt');
						return false;
					}
				});

				if(smutil.isEmpty(timeTxt)){
					LEMP.Window.alert({
						"_sTitle":"문자발송 오류",
						"_vMessage":'선택한 시간 구간이 없습니다.'
					});

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
				LEMP.Window.alert({
					"_sTitle":"문자발송 오류",
					"_vMessage":'문자를 발송할 송장을 선택해주세요.'
				});
				return false;
			}

		},


		// sms 문구 선택 후에 콜백되는 함수
		// sms 문자발송
		smsMsgSeletPopCallback : function(res){
			var _this = this;
			var chkLst = [];
			var invNoLst = [];


			$("input[name=chk]:checked").each(function() {
				chkLst.push($(this).val());
				invNoLst.push(($(this).attr("id")).replace('_chk', ''));
			});


			if(chkLst.length > 20){
				LEMP.Window.alert({
					"_sTitle":"문자발송 오류",
					"_vMessage":'문자발송은 20건까지만 선택 가능합니다.'
				});

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

				// 선택한 시간 구분text 셋팅
				$("li[name=timeLstLi]").each(function() {
					if($(this).is('.on')){
						timeTxt = $(this).data('timeTxt');
						return false;
					}
				});


				if(smutil.isEmpty(timeTxt)){
					LEMP.Window.alert({
						"_sTitle":"문자발송 오류",
						"_vMessage":'선택한 시간 구간이 없습니다.'
					});

					return false;
				}
				else {
					var text= res.msg_cont;			// 선택한 메세지

					// 리스트에서 고른 시간구분text
					if(!smutil.isEmpty(timeTxt)){
						text += "\n도착예정시간 : " + timeTxt ;
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
				LEMP.Window.alert({
					"_sTitle":"문자발송 오류",
					"_vMessage":'문자를 발송할 송장을 선택해주세요.'
				});
				return false;
			}

		},


		//##########################################################################
		// 시간변경 api 호출	start
		// 시간설정 팝업 닫을때 callback 함수
		com0501Callback : function(res){

			if(!smutil.isEmpty(page.selectedSchTime)
					&& !smutil.isEmpty(res.selectedCode)){

				if(page.selectedSchTime == res.selectedCode){
					LEMP.Window.alert({
						"_sTitle":"시간수정 오류",
						"_vMessage":'선택한 시간구간이\n현제 운송장의 시간구간과 동일합니다.'
					});
					return false;
				}
				else {

					// 시간 변경을 위한 송장번호와 타임 배달, 집하 구분코드가 전부 있으면 변경
					if(!smutil.isEmpty(page.changeTimeInvNo)
							&& !smutil.isEmpty(page.changeTimeSctCd)){

						page.apiParamInit();		// 파라메터 전역변수 초기화
						page.apiParam.param.baseUrl = "smapis/cldl/areaTmslRgst";			// api no
						page.apiParam.param.callback = "page.areaTmslRgstCallback";		// callback methode
						page.apiParam.data = {				// api 통신용 파라메터
							"parameters" : {
								"cldl_tmsl_cd" : res.selectedCode,
								"cldl_sct_cd" : page.changeTimeSctCd,					// 업무구분
								"inv_no" : page.changeTimeInvNo+""
							}
						};

						smutil.loadingOn();				// 로딩바 on

						// 공통 api호출 함수
						smutil.callApi(page.apiParam);
					}
					else{
						LEMP.Window.alert({
							"_sTitle":"시간수정 오류",
							"_vMessage":'시간변경을 위한 필수값이 없습니다.'
						});

						return false;
					}
				}
			}

		},

		// 시간변경 api 콜백
		areaTmslRgstCallback : function(result){
			try{
				// api 전송 성공
				if(smutil.apiResValidChk(result) && result.code == "0000"){

					LEMP.Window.toast({
						"_sMessage" : "시간변경 성공",
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
		// 시간변경 api 호출 end
		//##########################################################################







		//##########################################################################
		// 고객요청(인수자변경) api 호출	start
		// 인수자 팝업 닫을때 callback 함수
		com0601Callback : function(res){

			// 선택한 코드값이
			if(!smutil.isEmpty(res.selectedCode)
					&& !smutil.isEmpty(page.reqAcptRgstInvNo)){

				var inv_no = page.reqAcptRgstInvNo;
				var req_acpt_sct_cd = res.selectedCode;
				var req_acpr_nm ;

				if(req_acpt_sct_cd == "99"){
					req_acpr_nm = res.selectedText;
				}


				page.apiParamInit();		// 파라메터 전역변수 초기화
				page.apiParam.param.baseUrl = "smapis/cldl/reqAcptRgst";			// api no
				page.apiParam.param.callback = "page.reqAcptRgstCallback";		// callback methode
				page.apiParam.data = {				// api 통신용 파라메터
					"parameters" : {
						"inv_no" : inv_no+"",
						"req_acpt_sct_cd" : req_acpt_sct_cd,
						"req_acpr_nm" :req_acpr_nm
					}
				};

				smutil.loadingOn();				// 로딩바 on

				// 공통 api호출 함수
				smutil.callApi(page.apiParam);
			}
			else{
				LEMP.Window.alert({
					"_sTitle":"희망인수자 변경 오류",
					"_vMessage":'인수자 변경에 필요한 필수값들이 없습니다.'
				});
			}

		},


		// 희망인수자 변경 api 콜백
		reqAcptRgstCallback : function(result){
			try{
				// api 전송 성공
				if(smutil.apiResValidChk(result) && result.code == "0000"){
					LEMP.Window.alert({
						"_sTitle":"희망인수자 변경 성공",
						"_vMessage" : "희망인수자 변경에 성공하였습니다.",
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
		// 시간변경 api 호출 end
		//##########################################################################





		//##########################################################################
		// 집배달출발 리스트 순서변경 api 호출 start
		dprtListSeqUpd : function(chg_inv_no, next_inv_no){
			var _this = this;
			var cldl_sct_cd = _this.returnTabSctCd();
			if(!smutil.isEmpty(chg_inv_no)
					&& !smutil.isEmpty(cldl_sct_cd)
					&& cldl_sct_cd != 'A'){

				page.apiParamInit();		// 파라메터 전역변수 초기화
				page.apiParam.param.baseUrl = "smapis/cldl/dprtListSeqUpd";			// api no
				page.apiParam.param.callback = "page.dprtListSeqUpdCallback";			// callback methode
				page.apiParam.data = {				// api 통신용 파라메터
					"parameters" : {
						"chg_inv_no" : chg_inv_no,				// 이동한 운송장
						"next_inv_no" : next_inv_no,			// 다음 운송장
						"cldl_sct_cd" : cldl_sct_cd				// 집하 배달 구분코드
					}
				};

				smutil.loadingOn();				// 로딩바 on

				// 공통 api호출 함수
				smutil.callApi(page.apiParam);

			}

		},

		// 순서변경 api 콜백
		dprtListSeqUpdCallback : function(result){
			try{
				// api 전송 성공
				if(smutil.apiResValidChk(result) && result.code == "0000"){
				}
				else{
					// 서버에서 에러가 난경우는 리스트 제조회
					page.listReLoad();					// 리스트 제조회
				}
			}
			catch(e){}
			finally{
				page.apiParamInit();			// 파라메터 전역변수 초기화
				smutil.loadingOff();			// 로딩바 닫기
			}

		},
		// 집배달출발 리스트 순서변경 api 호출 end
		//##########################################################################



		//##########################################################################
		// 시간변경 api 호출	start
		// 시간설정 팝업 닫을때 callback 함수
		como0501Callback : function(res){

			if(!smutil.isEmpty(page.selectedSchTime)
					&& !smutil.isEmpty(res.selectedCode)){

				if(page.selectedSchTime == res.selectedCode){
					LEMP.Window.alert({
						"_sTitle":"시간수정 오류",
						"_vMessage":'선택한 시간구간이\n현제 운송장의 시간구간과 동일합니다.'
					});
					return false;
				}
				else {

					// 시간 변경을 위한 송장번호와 타임 배달, 집하 구분코드가 전부 있으면 변경
					if(!smutil.isEmpty(page.changeTimeInvNo)
							&& !smutil.isEmpty(page.changeTimeSctCd)){

						page.apiParamInit();		// 파라메터 전역변수 초기화
						page.apiParam.param.baseUrl = "smapis/cldl/areaTmslRgst";			// api no
						page.apiParam.param.callback = "page.areaTmslRgstCallback";		// callback methode
						page.apiParam.data = {				// api 통신용 파라메터
							"parameters" : {
								"cldl_tmsl_cd" : res.selectedCode,
								"cldl_sct_cd" : page.changeTimeSctCd,					// 업무구분
								"inv_no" : page.changeTimeInvNo+""
							}
						};

						smutil.loadingOn();				// 로딩바 on

						// 공통 api호출 함수
						smutil.callApi(page.apiParam);
					}
					else{
						LEMP.Window.alert({
							"_sTitle":"시간수정 오류",
							"_vMessage":'시간변경을 위한 필수값이 없습니다.'
						});

						return false;
					}
				}
			}

		},

		// 시간변경 api 콜백
		areaTmslRgstCallback : function(result){
			try{
				// api 전송 성공
				if(smutil.apiResValidChk(result) && result.code == "0000"){

					LEMP.Window.toast({
						"_sMessage" : "시간변경 성공",
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
		// 시간변경 api 호출 end
		//##########################################################################




		// 현재 활성화 시간구간코드 리턴
		returnTimeCd : function(){
			var timeLst = $("li[name='timeLstLi']");

			//현제 어느 탭에 있는지 상태체크
			var btnObj;
			var cldl_tmsl_cd;
			_.forEach(timeLst, function(obj, key) {
				btnObj = $(obj);

				if(btnObj.is('.on')){
					cldl_tmsl_cd = btnObj.data('timeLi');
					return false;
				}
			});

			return cldl_tmsl_cd;
		},


		// 현재 활성화 되어있는 텝 코드 리턴( 전체, 배달, 집하)
		returnTabSctCd : function(){

			//현제 어느 탭에 있는지 상태체크
			var btnLst = $(".lstSchBtn");
			var btnObj;
			var tab_sct_cd;
			_.forEach(btnLst, function(obj, key) {
				btnObj = $(obj);

				if(btnObj.closest('li').is('.on')){
					tab_sct_cd = btnObj.data('schSctCd');
					return false;
				}
			});

			// 없으면 A 리턴
			return smutil.nullToValue(tab_sct_cd,'A');
		},
	//집배달 출발 시간변경
		changeDlvyTime : function(param){
			var setParam = [];
			var setObject = {invNo : ""};
			//현재 시간 기준
//			var mbl_dlv_area = $('#mbl_dlv_area').val();
			var cldl_tmsl_cd = $('#cldl_tmsl_cd').val();
			//넘겨받은 체크 대상 리스트
			var chngInvNoList = param;
			for(var i = 0; i < param.length; i++){
				
				setObject.invNo = param[i];
				if(param != null && param != undefined && param != ""){
					  setParam.push({"invNo":param[i]});
				}
			}
			
			
			var _this = this;
			_this.apiParam.param.baseUrl = "smapis/cldl/changedlvytme";					// api no
			_this.apiParam.param.callback = "page.changeDlvyTimeCallback";			// callback methode
			_this.apiParam.data = {"parameters" : {
				"cldl_tmsl_cd" : cldl_tmsl_cd,
				"chngInvNoList" : setParam
			}};
			console.log(_this.apiParam);
			// 공통 api호출 함수
			smutil.callApi(page.apiParam);
		},
		//성공여부 콜백
		changeDlvyTimeCallback: function(res){
			page.listReLoad();
		},
		
		//집배달 출발 구역변경
		changeDlvyArea : function(param, param2){
			//현재 시간 기준
			var timeCheck = page.returnTimeCd();
			var setParam = [];
			var setObject = {invNo : ""};
			//현재 시간 기준
//			var cldl_tmsl_cd = $('#cldl_tmsl_cd').val();
			var cldl_tmsl_cd = $('#cldl_tmsl_cd').val();
			//넘겨받은 체크 대상 리스트
			var chngInvNoList = param;
			for(var i = 0; i < param.length; i++){
				
				setObject.invNo = param[i];
				if(param != null && param != undefined && param != ""){
					  setParam.push({"invNo":param[i]});
				}
			}
			var chngArea = $("#cldl_area_cd").val();
			
			var _this = this;
			_this.apiParam.param.baseUrl = "smapis/cldl/changedlvyarea";					// api no
			_this.apiParam.param.callback = "page.changeDlvyAreaCallback";			// callback methode
			_this.apiParam.data = {"parameters" : {
				"chngInvNoList" : setParam,
				"chngArea" : chngArea
			}};
			console.log(_this.apiParam);
			// 공통 api호출 함수
			smutil.callApi(page.apiParam);
		},
		//성공여부 콜백
		changeDlvyTimeCallback: function(res){
			if(res.code == 0000){
				LEMP.Window.alert({
					"_sTitle":"성공",
					"_vMessage":res.message
				});
			}else if(res.code == 0001){
				LEMP.Window.alert({
					"_sTitle":"구역 오류",
					"_vMessage": res.message
				});
			}
			console.log(res);
			page.listReLoad();
		},
		
		changeDlvyAreaCallback : function(res){
			debugger;
			if(res.code == 0000){
				LEMP.Window.alert({
					"_sTitle":"성공",
					"_vMessage":res.message
				});
			}else if(res.code == 0001){
				LEMP.Window.alert({
					"_sTitle":"구역 오류",
					"_vMessage": res.message
				});
			}else if(res.code == 0002){
				LEMP.Window.alert({
					"_sTitle":"구역변경 오류",
					"_vMessage": res.message
				});
			}
			page.listReLoad();
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
					callback : "",										// api 호출후 callback function
					contentType : "application/json; charset=utf-8"
				},
				data:{"parameters" : {}}// api 통신용 파라메터
			};
		},



		//com0301에서 날짜 선택 한 후 실행되는 콜백 함수
		COM0301Callback:function(res){
			$("#cldlBtnCal").text(res.param.date);

			page.listReLoad();					// 리스트 제조회
		},


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

		// 물리적 뒤로가기 버튼 및 뒤로가기 화살표 버튼 클릭시 스캔 체크해서 전송여부 결정
		callbackBackButton : function(){
			LEMP.Window.close({
				"_oMessage" : {
					"param" : ""
				}
			});
		}

};

