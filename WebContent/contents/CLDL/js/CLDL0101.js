LEMP.addEvent("backbutton", "page.callbackBackButton");		// 뒤로가기 버튼 클릭시 이벤트

var page = {
		curDate:"",
		dlvyCompl : null,
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
			page.curDate = curDate.getFullYear() + "" + ("0"+(curDate.getMonth()+1)).slice(-2) + "" + ("0"+curDate.getDate()).slice(-2);
			curDate = curDate.getFullYear() + "." + ("0"+(curDate.getMonth()+1)).slice(-2) + "." + ("0"+curDate.getDate()).slice(-2);
			$('#cldlBtnCal').text(curDate);

			page.dlvyCompl = LEMP.Properties.get({
				"_sKey" : "autoMenual"
			});
			
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

			// 예정시간이 변경된 경우
			$('#cldl_tmsl_cd').change(function() {
				// 지정일 배송의 경우 달력 팝업 출력
				if ($(this).val() === '28') {
					var popUrl = smutil.getMenuProp("COM.COM0301","url");

					LEMP.Window.open({
						"_sPagePath":popUrl,
						"_oMessage":{
							"param": {
								type: 'time',
								necessary: true,
								minDate: 1,
								maxDate: 3
							}
						}
					});
				} else {
					$('#dsgt_dd_cldl_ymd').val('');
				}
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
						"param": {
							type: 'list'
						}
					}
				});

			});
			
			


			// 스캔버튼을 누른경우
			$(".btn.ftScan").click(function(){

				var _this = this;
				//현제 어느 탭에 있는지 상태체크
				var tab_sct_cd = page.returnTabSctCd();
				var cldl_sct_cd = $('#cldl_sct_cd').val();			// 업무구분
				var cldl_tmsl_cd = $('#cldl_tmsl_cd').val();		// 예정시간선택
				var tmptime = page.fnGetToDayCd();
				var area_sct_cd = page.dlvyCompl.area_sct_cd;			//구역(Y) 시간(N) 구분
				
				if(!_.isUndefined(page.dlvyCompl.area_sct_cd) && page.dlvyCompl.area_sct_cd == "Y"){
					//TO-DO 현재시간 기준 코드 값 리턴 단, 토요일일경우 토요휴무 신청
					if($('#cldl_set_cd').val() == "" && $('#cldl_set_cd').val() == null){
						cldl_tmsl_cd = page.fnGetToDayCd();
					}else{
						cldl_tmsl_cd = $('#cldl_set_cd').val();
					}
					
				}else{
					cldl_tmsl_cd = $('#cldl_tmsl_cd').val();
				}
				
				var dsgt_dd_cldl_ymd = $('#dsgt_dd_cldl_ymd').val();	// 지정일집하/배송 일자

				// 전체 텝에서 스캔한 경우가 아니면 업무구분을 텝에 맞도록 셋팅
				if(tab_sct_cd != 'A'){
					cldl_sct_cd = tab_sct_cd;
				}

				if(smutil.isEmpty(cldl_sct_cd)){
					LEMP.Window.toast({
						"_sMessage":"업무구분을 선택해 주세요.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle":"스캔오류",
//						"_vMessage":"업무구분을 선택해 주세요."
//					});

					return false;
				}
				else if(smutil.isEmpty(cldl_tmsl_cd) && page.dlvyCompl.area_sct_cd == "N"){
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
				else if(cldl_tmsl_cd === '28' && smutil.isEmpty(dsgt_dd_cldl_ymd)) {
					LEMP.Window.toast({
						"_sMessage":"지정일자를 선택해 주세요.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle":"스캔오류",
//						"_vMessage":"지정일자를 선택해 주세요."
//					});

					return false;
				}

				// 스캔 팝업 url 호출
				var popUrl = smutil.getMenuProp('COM.COM0101', 'url');

				LEMP.Window.open({
					"_oMessage" : {
						"param" : {
							"cldl_sct_cd" : cldl_sct_cd,
							"cldl_tmsl_cd" : cldl_tmsl_cd,
							"dsgt_dd_cldl_ymd": dsgt_dd_cldl_ymd,
							"area_sct_cd": area_sct_cd,
							"menu_id" : "CLDL0101"
						}
					},
					"_sPagePath": popUrl
				});
			});	// end 스캔버튼을 누른경우 종료

			//
		
			// 상단 조회 탭 클릭
			$(".lstSchBtn").click(function(){
				var cldl_sct_cd = $(this).data('schSctCd');		// 선택한 탭의 값 (A,P,D)

				// 텝에따라 업무구분 선택박스 처리
				if(cldl_sct_cd != 'A'){
					$('#span_cldl_sct_cd').hide();
				}
				else{
					$('#span_cldl_sct_cd').val('');
					$('#span_cldl_sct_cd').show();
				}

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



			// 구분 필터값 변경
			$("#fltr_sct_cd").on('change', function(){
				page.listReLoad();					// 리스트 제조회
			});



			// 스캔취소 버튼 누른경우 이벤트
			$(document).on('click', '.btn.cancel', function(e){
				var inv_no = $(this).data('cancelInvNo');
				var cldl_sct_cd = $(this).data('cancleSctCd');

				// 송장번호가 있고 스캔된 데이터인지 체크
				if(!smutil.isEmpty(inv_no) && $('#'+cldl_sct_cd+'_'+inv_no).children(".baedalBox").is(".off") == false){
					// 스캔 취소 전문 호출
					_this.plnScanCcl(inv_no, cldl_sct_cd);  // 스캔취소호출
				}
				else{

				}

			});



			// 송장번호 누른경우
			$(document).on('click', '.dsin.vm.invNoSpan', function(event){

				if ($(event.target).parents('li').length > 0) {

					var liElement = $(event.target);
					$('.baedalBox').removeClass('bg-v2');									// 다른 row 선택초기화
					liElement.parents('.baedalBox').addClass('bg-v2');						// row 선택 표시

					var sctCd = liElement.parents('li').data('liSctCd');					// 업무 구분

					if(!smutil.isEmpty(sctCd)){

						var inv_no = liElement.parents('li').data('invNo')+"";				// 송장번호
						var rsrv_mgr_no = liElement.parents('li').data('rsrvMgrNo')+"";		// 접수번호
						// 팝업 url 호출
						var popUrl;

						if(sctCd == "P"){		// 집하 팝업

							popUrl = smutil.getMenuProp('CLDL.CLDL0104', 'url');

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

							popUrl = smutil.getMenuProp('CLDL.CLDL0106', 'url');

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

				return;

			});


			// 통화버튼 클릭
			$(document).on('click', '.btn.blue.bdM.bdPhone', function(e){
				var phoneNumberTxt = $(this).data('phoneNumber');

				// 전화걸기 팝업 호출
				$('#popPhoneTxt').text(phoneNumberTxt);
				$('.mpopBox.phone').bPopup();

			});

			// 통화버튼 yes 클릭
			$('#phoneCallYesBtn').click(function(e){

				var phoneNumber = $('#popPhoneTxt').text();
				phoneNumber = phoneNumber.split('-').join('').replace(/\-/g,'');

				LEMP.System.callTEL({
					"_sNumber" : phoneNumber,
				});

			});


			// 배달출발확정 버튼 클릭
			$('#plnDprtTrsmBtn').click(function(e){

				var scanCnt = 0;
				scanCnt = Number($('#scanLstCnt').text());

				// 배달출발 확정(전송) 컴펌창 호출
				if(scanCnt > 0){
					$('#pop2Txt2').html('스캔된 데이터 '+scanCnt+'건<br/>집배달출발을 확정합니다.<br/>확정후 출발화면으로 이동합니다.');
					$('.mpopBox.pop2').bPopup();
				}
				else{
					LEMP.Window.toast({
						"_sMessage":"스캔한 데이터가 없습니다.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle":"집배달 출발 확정 오류",
//						"_vMessage":"스캔한 데이터가 없습니다.",
//					});

					return ;
				}
			});


			// 배달출발확정 버튼 'yes' 버튼 클릭
			$('#plnDprtTrsmYesBtn').click(function(e){
				// 배달출발 확정로직 시작
				_this.plnDprtTrsm();
			});


			// 뒤로가기 버튼 클릭시  스캔 체크해서 전송여부 결정
			$('.cldlBack').click(function(e){
				// 스캔 체크해서 전송여부 결정
				_this.callbackBackButton();
			});



			// 미집하, 미배달 버튼클릭
			$(document).on('click', '.btn.blue3.bdM.bdCancle.mgl1', function(e){

				var inv_no = $(this).data('invNo');					// 송장번호
				var cldl_sct_cd = $(this).data('cldlSctCd');		// 집하, 배달 구분코드
				var corp_sct_cd = $(this).data('corpSctCd');		// 업체 구분코드(카카오/ 그외)
				var menu_id ;
				if(!smutil.isEmpty(inv_no)){

					// 집하
					if(cldl_sct_cd === "P"){	// 집하
						menu_id = "CLDL0301";
					}
					else{	// 배달
						menu_id = "CLDL0401";
					}

					//var liDiv = $('#'+cldl_sct_cd+'_'+inv_no).children('.baedalBox');
					//page.rsnRgstInvNo = inv_no;				// 미집하 송장번호 셋팅

					// 스캔된 데이터만 미집하 처리 가능
					//if(_this.chkScanYn(inv_no)){

						var popUrl = smutil.getMenuProp("COM.COM0701","url");


						LEMP.Window.open({
							"_sPagePath":popUrl,
							"_oMessage" : {
								"param" : {
									"cldl_sct_cd" : cldl_sct_cd
									, "inv_no" : inv_no+""
									, "menu_id" : menu_id
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



			// 기사메모 팝업 호출
			$(document).on('click', '.btn.bdM.blue2.bdMemo.mgl1', function(e){
				var inv_no = $(this).data('invNo')+"";				// 송장번호
				var cldl_sct_cd = $(this).data('cldlSctCd');		// 집배달 구분코드(P:집하, D:배달)

				if(smutil.isEmpty(inv_no) || smutil.isEmpty(cldl_sct_cd)){
					LEMP.Window.toast({
						"_sMessage":"송장번호 혹은\n집배달 구분코드가 없습니다.\n관리자에게 문의해주세요.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle" : "메모 오류",
//						"_vMessage" : "송장번호 혹은\n집배달 구분코드가 없습니다.\n관리자에게 문의해주세요."
//					});

					return false;
				}


				// 스캔된 데이터만 미집하 처리 가능
				if(_this.chkScanYn(inv_no, cldl_sct_cd)){
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
				}
				else{
					LEMP.Window.toast({
						"_sMessage":"미스캔 데이터 입니다.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle":"미집하 처리 오류",
//						"_vMessage":"미스캔 데이터 입니다."
//					});

					return false;
				}

			});




			// 문자발송 스와이프 버튼클릭
			$(document).on('click', '.btn.blue5.bdM.bdMsg', function(e){
				var inv_no = $(this).data('invNo')+"";				// 송장번호
				var phoneNumber = $(this).data('phoneNumber');		// 전화번호
				var cldl_sct_cd = $(this).data('cldlSctCd');		// 집배달 구분 (P:집하, D:배달)

				if(smutil.isEmpty(inv_no) || smutil.isEmpty(cldl_sct_cd)){
					LEMP.Window.toast({
						"_sMessage":"송장번호 혹은\n집배달 구분코드가 없습니다.\n관리자에게 문의해주세요.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle" : "문자발송 오류",
//						"_vMessage" : "송장번호 혹은\n집배달 구분코드가 없습니다.\n관리자에게 문의해주세요."
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
			// 집하, 배달 구분(집하 = if true, 배달은=else)
			Handlebars.registerHelper('cldlSctCdChk', function(options) {
				if(this.cldl_sct_cd === "P"){	// 집하
					// options.fn == if(true)
					return options.fn(this);
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
					if(this.req_acpt_rgst_sct_cd == "01"){			// 고객요청
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


			// 스캔한 데이터인지 여부 확인
			Handlebars.registerHelper('scanYnClass', function(options) {
				if(this.scan_cmpt_yn == 'N'){
					return 'off';
				}
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




			// 미집하 버튼 셋팅(일반집하일 경우만 버튼 표시)
			Handlebars.registerHelper('setRsnRgstBtn', function(options) {

				// 집하
				if(this.cldl_sct_cd === "P"){	// 집하
					var html = '<button class="btn blue3 bdM bdCancle mgl1" data-inv-no="'+this.inv_no+'" data-corp-sct-cd="'+this.corp_sct_cd+'" data-cldl-sct-cd="'+this.cldl_sct_cd+'">미집하</button>';
					return new Handlebars.SafeString(html); // mark as already escaped
				}
				else{			// 배달
					var html = '<button class="btn blue3 bdM bdCancle mgl1" data-inv-no="'+this.inv_no+'" data-cldl-sct-cd="'+this.cldl_sct_cd+'">미배달</button>';
					return new Handlebars.SafeString(html); // mark as already escaped
				}
			});


			// 문자발송 버튼 표시 (집하 = 보낸사람, 배달 = 받는사람)
			Handlebars.registerHelper('setSmsBtn', function(options) {
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

				var html = '<button class="btn bdM blue5 bdM bdMsg mgl1" data-cldl-sct-cd="'+this.cldl_sct_cd+'" data-inv-no="'+this.inv_no+'" data-phone-number="'+telNum+'">문자</button>';
				return new Handlebars.SafeString(html); // mark as already escaped

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

			// 기준날짜가 오늘이 아닌경우 배경색 변경
			Handlebars.registerHelper('base_ymd', function(options) {
				if(!smutil.isEmpty(this.base_ymd)){
					if(this.base_ymd!=page.curDate){
						return 'pink';
					}
				}
			});

			// ###################################### handlebars helper 등록 end

		},


		// 화면 최초 디스플레이 이벤트
		initDpEvent : function(){

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
			
			if (!_.isUndefined(page.dlvyCompl)) {
                // 구역별 시간별

                if(page.dlvyCompl.area_sct_cd == "Y") {
                    $("#setDlvyCom1").text('구역');
                    $("#setDlvyCom1").attr('class', 'red badge option outline');
                    $("#cldl_tmsl_cd").hide();
                } else {
                    $("#setDlvyCom1").text('시간');
                    $("#setDlvyCom1").attr('class', 'green badge option outline');
                    $("#cldl_tmsl_cd").show();
                }
            }
			
			var _this = this;
			smutil.loadingOn();
			_this.plnFltrListSerch();			// 필터 리스트 조회
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

			page.apiParamInit();			// 파라메터 전역변수 초기화
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

				page.codeListSerch();			// 예정시간리스트 조회

			}

		},
		// ################### 필터조건 조회 end



		// ################### 예정시간 리스트 조회 start
		// 예정시간 조회
		codeListSerch : function(){
			var _this = this;

			_this.apiParam.param.baseUrl = "smapis/cmn/codeListPopup";					// api no
			_this.apiParam.param.callback = "page.codeListSerchCallback";			// callback methode
			_this.apiParam.data = {"parameters" : {"typ_cd":"HPSR_TMSL"}};			// api 통신용 파라메터

			// 공통 api호출 함수
			smutil.callApi(_this.apiParam);

			page.apiParamInit();			// 파라메터 전역변수 초기화
		},


		// 예정시간 조회 callback
		codeListSerchCallback : function(result){
			page.apiParamInit();		// 파라메터 전역변수 초기화

			// api 결과 성공여부 검사
			if(smutil.apiResValidChk(result) && result.code == "0000"){
				// 조회 결과 데이터가 있으면 옵션 생성
				if(result.data_count > 0){
					let list = [];
					let hpsrArr = page.getPropHpsr();

					//hpsr 데이터가 있을경우 정렬
					if(!smutil.isEmpty(hpsrArr)) {
						_.forEach(hpsrArr, function (v, i){
							_.forEach(result.data.list, function (value, index){
								if(value.dtl_cd == v.dtl_cd){
									list.push(value);
								}
							});
						});
					}
					//hpsr 데이터가 없을경우 바로입력
					else{
						list = result.data.list;
					}

					// select box 셋팅
					smutil.setSelectOptions("#cldl_tmsl_cd", list);

					// 지정일 배송이 최상단에 있을경우 달력 팝업 출력
					if ($('#cldl_tmsl_cd').val() === '28') {
						var popUrl = smutil.getMenuProp("COM.COM0301","url");

						LEMP.Window.open({
							"_sPagePath":popUrl,
							"_oMessage":{
								"param": {
									type: 'time',
									necessary: true,
									minDate: 1,
									maxDate: 3
								}
							}
						});
					}
				}
			}

			page.plnCnt();		// 집배달 리스트 카운트 조회
		},
		// ################### 예정시간 리스트 조회 end




		// ################### 최상단 집배달 리스트 카운트 조회 start
		// 집배달 예정 리스트 카운트 조회
		plnCnt : function(){
			var _this = this;

			_this.apiParam.param.baseUrl = "smapis/cldl/plnCnt";			// api no
			_this.apiParam.param.callback = "page.plnCntCallback";			// callback methode

			// 날짜셋팅
			var curDate = new Date();
			curDate = curDate.getFullYear() + ("0"+(curDate.getMonth()+1)).slice(-2) + ("0"+curDate.getDate()).slice(-2);
			var base_ymd = smutil.nullToValue($('#cldlBtnCal').text(),curDate);
			base_ymd = base_ymd.split('.').join('');

			_this.apiParam.data = {"parameters" : {"base_ymd":base_ymd}};			// api 통신용 파라메터


			// 공통 api호출 함수
			smutil.callApi(_this.apiParam);

			page.apiParamInit();			// 파라메터 전역변수 초기화
		},


		// 집배달 예정 카운트 조회 callback
		plnCntCallback : function(result){

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
						$("#"+obj.cldl_sct_cd+"_cldl0101Cnt").text(cnt);
					});
				}

				page.plnList();			// 페이지 리스트 조회

			}


		},
		// ################### 최상단 집배달 리스트 카운트 조회 end





		// ################### 페이지 리스트 조회 start
		plnList : function(){

			var _this = this;
			var cldl_sct_cd  = page.returnTabSctCd();		// 업무구분 (전체 : A, 집하 : P, 배달 : D)
			var fltr_sct_cd = $('#fltr_sct_cd').val();		// 필터구분

			_this.apiParam.param.baseUrl = "smapis/cldl/plnList";			// api no
			_this.apiParam.param.callback = "page.plnListCallback";			// callback methode

			// 날짜셋팅
			var curDate = new Date();
			curDate = curDate.getFullYear() + ("0"+(curDate.getMonth()+1)).slice(-2) + ("0"+curDate.getDate()).slice(-2);
			var base_ymd = smutil.nullToValue($('#cldlBtnCal').text(),curDate);
			base_ymd = base_ymd.split('.').join('');

			_this.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {
					"cldl_sct_cd" : smutil.nullToValue(cldl_sct_cd,"A"),		// 업무구분
					"fltr_sct_cd" : smutil.nullToValue(fltr_sct_cd,"0000"),		// 필터구분
					"base_ymd" : base_ymd										// 날짜셋팅
				}
			};

			// 공통 api호출 함수
			smutil.callApi(_this.apiParam);

			page.apiParamInit();			// 파라메터 전역변수 초기화
		},



		// 리스트 조회후 그리기
		plnListCallback : function(result){

			page.apiParamInit();			// 파라메터 전역변수 초기화

			try{
				// 스캔건수
				var scanLstCnt = $('#scanLstCnt');

				// 조회한 결과가 있을경우
				if(smutil.apiResValidChk(result) && result.code == "0000"){
					var data = {};

					if(result){
						data = result.data;
					}
					//data = [];

					// 핸들바 템플릿 가져오기
					var source = $("#cldl0101_list_template").html();

					// 핸들바 템플릿 컴파일
					var template = Handlebars.compile(source);

					// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
					var liHtml = template(data);

					// 생성된 HTML을 DOM에 주입
					$('#cldl0101LstUl').html(liHtml);

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
				else{		// 조회 결과 없음
					scanLstCnt.hide();		// 전체 스캔건수 숨김
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

			smutil.loadingOn();
			page.plnCnt();						// 상단 카운트 조회

		},


		// ################### 스캔 전송 start
		// 스캔된후 호출되는 함수
		scanCallback : function(result){

			page.apiParamInit();		// 전역 api 파라메터 초기화

			var _this = this;
			var scanCallYn = "Y";
			var tab_sct_cd = page.returnTabSctCd();				//현제 어느 탭에 있는지 상태체크
			var cldl_sct_cd = $('#cldl_sct_cd').val();			// 업무구분
			var cldl_tmsl_cd = $('#cldl_tmsl_cd').val();		// 예정시간선택
			var dsgt_dd_cldl_ymd = $('#dsgt_dd_cldl_ymd').val();				// 지정일집하/배송 일자
			var inv_no = result.barcode;
			var area_sct_cd = page.dlvyCompl.area_sct_cd;			//구역(Y) 시간(N) 기준 
			inv_no = inv_no+"";

			// 전체 텝에서 스캔한 경우가 아니면 업무구분을 텝에 맞도록 셋팅
			if(tab_sct_cd != 'A'){
				cldl_sct_cd = tab_sct_cd;
			}
			
			if(!_.isUndefined(page.dlvyCompl.area_sct_cd) && page.dlvyCompl.area_sct_cd == 'Y'){
				cldl_tmsl_cd = "";
			}else{
				cldl_tmsl_cd = $('#cldl_tmsl_cd').val();
			}
			
			// 중복 스캔 방지
			if(page.chkScanYn(inv_no, cldl_sct_cd)){
				LEMP.Window.toast({
					'_sMessage' : '이미 스캔 완료된 송장입니다.',
					'_sDuration' : 'short'
				});

				// 실패 tts 호출(벨소리)
				smutil.callTTS("0", "0", null, result.isBackground);

				return false;
			}


			if(smutil.isEmpty(cldl_sct_cd)){
				LEMP.Window.toast({
					'_sMessage' : '업무구분을 선택해 주세요.',
					'_sDuration' : 'short'
				});

				scanCallYn = "N";
			}
			else if(smutil.isEmpty(cldl_tmsl_cd) && page.dlvyCompl.area_sct_cd == 'N'){
				LEMP.Window.toast({
					'_sMessage' : '예정시간을 선택해 주세요.',
					'_sDuration' : 'short'
				});

				scanCallYn = "N";
			}
			else if(cldl_tmsl_cd === '28' && smutil.isEmpty(dsgt_dd_cldl_ymd)) {
				LEMP.Window.toast({
					'_sMessage' : '지정일자를 선택해 주세요.',
					'_sDuration' : 'short'
				});

				scanCallYn = "N";
			}
			else if(smutil.isEmpty(inv_no)){
				LEMP.Window.toast({
					'_sMessage' : '송장번호가 없습니다.',
					'_sDuration' : 'short'
				});

				scanCallYn = "N";
			}
			else if(inv_no.length != 12
					|| (inv_no.substr(0,11) + ((Number(inv_no.substr(0,11))%7)+"")) != inv_no){
				LEMP.Window.toast({
					'_sMessage' : '정상적인 송장번호가 아닙니다.',
					'_sDuration' : 'short'
				});

				scanCallYn = "N";
			}
			// 집하에서 5번으로 시작하는 송장은 스캔할수 없게 한다.
			else if(cldl_sct_cd == "P" && (inv_no.LPStartsWith("5"))){
				LEMP.Window.toast({
					'_sMessage' : '의류특화 보조송장은 집하예정 업무에선 스캔할수 없습니다.',
					'_sDuration' : 'short'
				});

				scanCallYn = "N";
			}


			// 스캔 validation 오류로 실패
			if(scanCallYn == "N"){

				// 실패 tts 호출(벨소리)
				smutil.callTTS("0", "0", null, result.isBackground);

				return false;
			}


			//스캔시간
			var date = new Date();
			var scan_dtm = date.LPToFormatDate("yyyymmddHHnnss");				// 스캔 시간
			page.apiParam.param.baseUrl = "smapis/cldl/plnScanRgst";			// api no
			page.apiParam.param.callback = "page.plnScanRgstCallback";			// callback methode
			page.apiParam.data =
			{
				"parameters" : {
					"inv_no":inv_no+"",
					"scan_dtm":scan_dtm,
					"cldl_tmsl_cd":cldl_tmsl_cd,
					"cldl_sct_cd":cldl_sct_cd,
					"dsgt_dd_cldl_ymd":dsgt_dd_cldl_ymd,
					"area_sct_cd":area_sct_cd
				}
			};			// api 통신용 파라메터

			page.apiParam.isBackground =  result.isBackground;					// app이 background 상태인지 설정

			// 공통 api호출 함수
			smutil.callApi(page.apiParam);

		},



		// 스캔 api 호출 callback
		plnScanRgstCallback : function(result){
			var message = smutil.nullToValue(result.message,'');
			var acnt = 0;
			var dcnt = 0;
			var pcnt = 0;
			//현제 어느 탭에 있는지 상태체크
			var tab_sct_cd = page.returnTabSctCd();
			var cldl_sct_cd = $('#cldl_sct_cd').val();			// 업무구분
			var inv_no = result.inv_no;

			// 전체 텝에서 스캔한 경우가 아니면 업무구분을 텝에 맞도록 셋팅
			if(tab_sct_cd != 'A'){
				cldl_sct_cd = tab_sct_cd;
			}

			// api 결과 성공여부 1차 검사
			if(smutil.apiResValidChk(result)
					&& result.code == "0000"){
					//&& (result.code == "0000" || result.code == "1000")){

				var message = "스캔성공";
//				if(result.code == "1000"){
//					message = "이미 취소된 송장입니다."
//				}

				// 송장번호가 있는경우
				if(!smutil.isEmpty(inv_no)){

					LEMP.Window.toast({
						"_sMessage" : message,
						"_sDuration" : "short"
					});

					// 성공 tts 호출
					smutil.callTTS("1", "0", null, result.isBackground);

					// 리스트에 송장정보가 있는지 체크
					var liKey = $('#'+cldl_sct_cd+'_'+inv_no);

					// 스캔한 정보가 리스트에 있는경우는 li 활성화만 하면 됨
					if(liKey.length > 0){

						// 스켄하지 않은건이면 하단 카운트 증가(상단카운트는 증가할 필요 없음)
						if(!page.chkScanYn(inv_no, cldl_sct_cd)){

							// 하단 스캔건수+1
							var scanLstCnt = $('#scanLstCnt');
							var scancnt = 0;
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

						// 스캔 완료상태로 변경
						liKey.children('.baedalBox').removeClass('off');

						// 화면 가장 상단으로 li 이동
						liKey.prependTo('#cldl0101LstUl');

					}
					else {	// 스캔한 정보가 리스트에 없는경우는 li 추가
						var data = {"inv_no" : inv_no+"", "cldl_sct_cd" : cldl_sct_cd}

						// 핸들바스 템플릿 가져오기
						var source = $("#cldl0101_li_template").html();

						// 핸들바 템플릿 컴파일
						var template = Handlebars.compile(source);

						// 핸들바스 템플릿에 데이터를 바인딩해서 HTML 생성
						var liHtml = template(data);

						// noList 일경우 li 삭제
						if($('.noList').length > 0){
							$('.noList').remove();
						}

						// 생성된 HTML을 DOM에 주입
						$('#cldl0101LstUl').prepend(liHtml);

						// 하단 상단 스캔 카운트 전부 +1
						// 상단 리스트 건수 +1
						if(cldl_sct_cd == "D"){		// 배달건수 +1
							var D_cldl0101Cnt = $('#D_cldl0101Cnt');
							dcnt = (Number(smutil.nullToValue(D_cldl0101Cnt.text(),0)))+1;
							D_cldl0101Cnt.text(smutil.nullToValue(dcnt,1));
						}
						else if(cldl_sct_cd == "P"){		// 집하건수 +1
							var P_cldl0101Cnt = $('#P_cldl0101Cnt');
							pcnt = (Number(smutil.nullToValue(P_cldl0101Cnt.text(),0)))+1;
							P_cldl0101Cnt.text(pcnt);
						}

						// 토탈 건수 +1
						var A_cldl0101Cnt = $('#A_cldl0101Cnt');
						acnt = (Number(smutil.nullToValue(A_cldl0101Cnt.text(),0)))+1;
						A_cldl0101Cnt.text(acnt);


						// 하단 스캔건수+1
						var scanLstCnt = $('#scanLstCnt');
						var scancnt = 0;
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

				}
			}
			else{		// 스캔 실패

				LEMP.Window.toast({
					"_sMessage" : message,
					"_sDuration" : "short"
				});

				// 실패 tts 호출
				smutil.callTTS("0", "0", null, result.isBackground);

				// 스켄되지 않은 취소건은 li 삭제처리 및 카운트 -1
				if(result.code == "1000" && !page.chkScanYn(inv_no, cldl_sct_cd)){

					// 리스트에 송장정보가 있는지 체크
					var liKey = $('#'+cldl_sct_cd+'_'+inv_no);

					// 있으면 삭제하고 카운트 처리
					if(liKey.length > 0){

						// li 삭제
						liKey.remove();

						// 하단 스캔건수-1
						var scanLstCnt = $('#scanLstCnt');
						var scancnt = 0;
						if(smutil.isEmpty(scanLstCnt.text())){
							scancnt = 0;
							scanLstCnt.hide();
							scanLstCnt.text("0");
						}
						else {
							scancnt = Number(scanLstCnt.text()) -1;
							if(scancnt < 0) scancnt = 0;
							scanLstCnt.show();
							scanLstCnt.text(scancnt+"");
						}

						// 상단 리스트 건수 -1
						if(cldl_sct_cd == "D"){		// 배달건수 -1
							var D_cldl0101Cnt = $('#D_cldl0101Cnt');
							dcnt = (Number(smutil.nullToValue(D_cldl0101Cnt.text(),0)))-1;
							if(dcnt<0) dcnt=0;
							D_cldl0101Cnt.text(dcnt);
						}
						else if(cldl_sct_cd == "P"){		// 집하건수 -1
							var P_cldl0101Cnt = $('#P_cldl0101Cnt');
							pcnt = (Number(smutil.nullToValue(P_cldl0101Cnt.text(),0)))-1;
							if(pcnt<0) pcnt=0;
							P_cldl0101Cnt.text(pcnt);
						}

						// 토탈 건수 -1
						var A_cldl0101Cnt = $('#A_cldl0101Cnt');
						acnt = (Number(smutil.nullToValue(A_cldl0101Cnt.text(),0)))-1;
						if(acnt<0) acnt=0;
						A_cldl0101Cnt.text(acnt);


						if((tab_sct_cd == 'A' && acnt == 0)					// 전체 탭에 있는데 카운트가 없을경우
								|| (tab_sct_cd == 'P' && pcnt == 0)			// 집하 탭에 있는데 카운트가 없을경우
								|| (tab_sct_cd == 'D' && dcnt == 0)){		// 배달 탭에 있는데 카운트가 없을경우

							// 핸들바스 템플릿 가져오기
							var source = $("#cldl0101_noLstLi").html();

							// 핸들바 템플릿 컴파일
							var template = Handlebars.compile(source);

							// 핸들바스 템플릿에 데이터를 바인딩해서 HTML 생성
							var liHtml = template();

							// 생성된 HTML을 DOM에 주입
							$('#cldl0101LstUl').prepend(liHtml);
						}

					}

				}

			}
		},
		// ################### 스캔 전송  end



		// ################### 스캔취소 start
		plnScanCcl : function(inv_no, cldl_sct_cd){

			var _this = this;

			if(smutil.isEmpty(inv_no)){
				LEMP.Window.toast({
					'_sMessage' : '송장번호가 없습니다.',
					'_sDuration' : 'short'
				});

				return false;
			}
			else if(smutil.isEmpty(cldl_sct_cd)){
				LEMP.Window.toast({
					'_sMessage' : '업무구분이 없습니다.',
					'_sDuration' : 'short'
				});

				return false;
			}


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
					_this.apiParam.param.baseUrl = "smapis/cldl/plnScanCcl";			// api no
					_this.apiParam.param.callback = "page.plnScanCclCallback";			// callback methode
					_this.apiParam.data = {				// api 통신용 파라메터
						"parameters" : {
							"inv_no" : inv_no+"",			// 송장번호
							"cldl_sct_cd" : cldl_sct_cd	// 업무구분
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
		plnScanCclCallback : function(result){
			var _this = this;

			// api 전송 성공
			if(smutil.apiResValidChk(result) && result.code == "0000"){
				LEMP.Window.toast({
					'_sMessage' : '스캔정보가 취소되었습니다.',
					'_sDuration' : 'short'
				});

				page.listReLoad();				// 리스트 제조회
			}
			else if(result.code == "9000"){
				page.listReLoad();				// 이미 삭제된 리스트이기 때문에 바로 리스트 제조회
			}
			else{
				var message = smutil.nullToValue(result.message,'');

				LEMP.Window.toast({
					"_sMessage": message,
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"스캔취소 오류",
//					"_vMessage":message
//				});
			}

			page.apiParamInit();			// 파라메터 전역변수 초기화
		},
		// ################### 스캔취소 end



		// ################### 집배달출발확정(전송) start
		plnDprtTrsm : function(){

			var _this = this;
			var cldl_sct_cd = page.returnTabSctCd();		// 업무구분
			var base_ymd = $('#cldlBtnCal').text();

			if(smutil.isEmpty(base_ymd)){
				LEMP.Window.toast({
					"_sMessage":"날짜를 선택해 주세요.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"집배달 출발 확정 오류",
//					"_vMessage":"날짜를 선택해 주세요.",
//				});

				return ;
			}

			base_ymd = base_ymd.split('.').join('');

			if(!smutil.isEmpty(cldl_sct_cd)){
				var scanCnt = 0;

				scanCnt = Number($('#scanLstCnt').text());

				if(scanCnt > 0){
					_this.apiParamInit();		// 파라메터 전역변수 초기화
					_this.apiParam.param.baseUrl = "smapis/cldl/plnDprtTrsm";		// api no
					_this.apiParam.param.callback = "page.plnDprtTrsmCallback";		// callback methode
					_this.apiParam.data = {				// api 통신용 파라메터
						"parameters" : {
							"cldl_sct_cd" : cldl_sct_cd,		// 업무구분
							"base_ymd" : base_ymd				// 기준일자
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
//						"_sTitle":"집배달 출발 확정 오류",
//						"_vMessage":"스캔한 데이터가 없습니다.",
//					});

					return ;
				}

			}

			page.apiParamInit();			// 파라메터 전역변수 초기화

		},


		// 집배달출발 확정 콜백
		plnDprtTrsmCallback : function(result){
			var _this = this;

			try{
				// api 전송 성공
				if(smutil.apiResValidChk(result) && result.code == "0000"){

//					LEMP.Window.alert({
//						"_sTitle":"",
//						"_vMessage":"집배달 출발을 확정하였습니다.",
//					});

					// 집배달 출발로 페이지 전환
					var popUrl = smutil.getMenuProp('CLDL.CLDL0201', 'url');
					LEMP.Window.replace({
						"_sPagePath":popUrl
					});

					//page.listReLoad();					// 리스트 제조회
				}
			}
			catch(e){}
			finally{
				smutil.loadingOff();			// 로딩바 닫기
				page.apiParamInit();			// 파라메터 전역변수 초기화
			}
		},
		// ################### 배달출발확정(전송) end

		// 현제 리스트가 스켄이 되어있는지 체크
		// 스캔 했으면 true, 안했으면 false
		chkScanYn : function(inv_no, cldl_sct_cd){
			if(!smutil.isEmpty(inv_no) && $('#'+cldl_sct_cd+'_'+inv_no).length > 0){
				return !($('#'+cldl_sct_cd+'_'+inv_no).children(".baedalBox").is(".off"));
			}
			else {
				return false;
			}
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
		},



		// 물리적 뒤로가기 버튼 및 뒤로가기 화살표 버튼 클릭시 스캔 체크해서 전송여부 결정
		callbackBackButton : function(){

			// 하단 스캔건수 조회
			var scancnt = Number(smutil.nullToValue($('#scanLstCnt').text(),"0"));

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
							$('#pop2Txt2').html('스캔된 데이터 '+scancnt+'건<br />집배달출발을 확정합니다.');
							$('.mpopBox.pop2').bPopup();
						}
						else{
							LEMP.Window.toast({
								"_sMessage":"스캔한 데이터가 없습니다.",
								'_sDuration' : 'short'
							});
//							LEMP.Window.alert({
//								"_sTitle":"집배달 출발 확정 오류",
//								"_vMessage":"스캔한 데이터가 없습니다.",
//							});

							return false;
						}
					}
				});

				LEMP.Window.confirm({
					"_sTitle":"미전송 스캔데이터 확인.",
					"_vMessage" : "출발확정이 안된 스캔데이터가 있습니다.\n출발확정 전송후 페이지 이동이 가능합니다. \n전송 하시겠습니까?",
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
			if (res.param.type === 'list') {
				$("#cldlBtnCal").text(res.param.date);
				page.listReLoad();					// 리스트 제조회
			} else if (res.param.type === 'time') {
				$('#dsgt_dd_cldl_ymd').val(res.param.date.replace(/\./g,""));
			}
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



		// ################### 미집배달 전송 start
		// 선택한 미집배달 구분코드
		rsnRgstCldlSctCd : null,

		// 미집배달 사유 선택후 callback
		com0701Callback : function(res){
			page.apiParamInit();		// 파라메터 초기화

			var inv_no = smutil.nullToValue(res.param.inv_no,"");			// 미집하 선택한 송장번호
			inv_no = inv_no+"";												// 송장번호 문자처리
			var cldl_sct_cd = smutil.nullToValue(res.param.cldl_sct_cd,"");	// 집배달 업무구분코드(P : 집하, D : 배달)
			var dlay_rsn_cd = smutil.nullToValue(res.param.code,"");		// 미집하, 미배달 사유 코드
			var rsn_cont = smutil.nullToValue(res.param.value,"");			// 미집하, 미배달 사유 value
			var filepath = smutil.nullToValue(res.param.images,"");			// 취급불가 비규격 사진파일
			var str;

			if(!smutil.isEmpty(inv_no) && !smutil.isEmpty(dlay_rsn_cd)){
				//심야배송 선택했을경우 시간체크
				if(res.param.code == 42){
					if(!smutil.isMidnight()){
						LEMP.Window.toast({
							"_sMessage":"심야배송으로 인한 익일배송은 20시 30분 이후에 선택 가능합니다.",
							'_sDuration' : 'short'
						});
//						LEMP.Window.alert({
//							"_sTitle":"미배달 사유 선택 오류",
//							"_vMessage":"심야배송으로 인한 익일배송은 20시 30분 이후에 선택 가능합니다."
//						});
						return false;
					}
				}
				page.rsnRgstCldlSctCd = cldl_sct_cd;

				if(cldl_sct_cd == "P"){
					str = "미집하";
				}
				else{
					str = "미배달";
				}

				//var liDiv = $('#'+cldl_sct_cd+'_'+inv_no).children('.baedalBox');

				// 스캔된 데이터만 미집하 처리 가능
//				if(liDiv.is('.off') == false){

					if(!smutil.isEmpty(rsn_cont)){
						rsn_cont = rsn_cont.split('.').join('');
					}

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
							else if(smutil.isEmpty(filepath)){									// 사진이 없고는경우
								page.apiParam.id = "HTTP";
								page.apiParam.param.baseUrl = "smapis/cmn/rsnRgstTxt";			// api no
							}

							//미집하 api 호출

							page.apiParam.param.callback = "page.rsnRgstCallback";			// callback methode
							page.apiParam.data = {				// api 통신용 파라메터
								"parameters" : {
									"inv_no" : inv_no+"",				// 송장번호
									"cldl_sct_cd" : cldl_sct_cd,		// 업무구분
									"dlay_rsn_cd" : dlay_rsn_cd,		// 미집하 사유 코드
									"rsn_cont" : rsn_cont				// 미집하 사유 date 또는 text
								}
							};

							// 공통 api호출 함수
							smutil.callApi(page.apiParam);
						}
					});


					LEMP.Window.confirm({
						"_sTitle":str+" 처리",
						_vMessage : "선택한 송장정보를 \n"+str+" 처리하시겠습니까?",
						_aTextButton : [btnConfirm, btnCancel]
					});

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
					"_sMessage":"선택한 송장번호 혹은 사유가 없습니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"미 집배달 처리 오류",
//					"_vMessage":"선택한 송장번호 혹은 사유가 없습니다."
//				});

				return false;
			}

			//page.rsnRgstInvNo = null;

		},


		// 미집하 처리 콜백
		rsnRgstCallback : function(result){

			page.apiParamInit();			// 파라메터 전역변수 초기화
			page.rsnRgstCldlSctCd = null;	// 선택한 미집배달 구분코드 초기화

			var cldl_sct_cd = page.rsnRgstCldlSctCd;

			if(cldl_sct_cd == "P"){
				str = "미집하";
			}
			else{
				str = "미배달";
			}

			// api 전송 성공
			if(smutil.apiResValidChk(result) && result.code == "0000"){
				LEMP.Window.toast({
					"_sMessage": str+" 처리가 완료되었습니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle" : str+" 처리 완료",
//					"_vMessage" : str+" 처리가 완료되었습니다."
//				});

				page.listReLoad();				// 리스트 제조회
			}
//			else{
//				var message = smutil.nullToValue(result.message,'');
//
//				LEMP.Window.alert({
//					"_sTitle" : str+" 처리 오류",
//					"_vMessage":message
//				});
//			}

		},
		// ################### 미집배달 처리 end



		// sms 문구 선택 후에 콜백되는 함수
		// sms 문자발송
		smsMsgSeletPopCallback : function(res){
			var _this = this;

			if(!smutil.isEmpty(res.msg_cont)){

				var text= res.msg_cont;			// 선택한 메세지
				var inv_no = res.inv_no;		// 송장번호
				var phoneNumber = res.phoneNumber;
				var aNumber = [];

				// 공백 전화번호는 저장 안함
				if(!smutil.isEmpty(phoneNumber)){
					phoneNumber = phoneNumber.split('-').join('').replace(/\-/g,'');
					aNumber.push(phoneNumber);
				}

				// 송장번호 추가
				if(!smutil.isEmpty(res.msg_cont)){
					text += "\n송장번호 : "+inv_no;
				}

				// 문자발송 기능 호출
				LEMP.System.callSMS({
					"_aNumber":aNumber,
					"_sMessage":text
				});
			}
			else{
				LEMP.Window.toast({
					"_sMessage":"선택한 문자발송 문구가 없습니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"문자발송 오류",
//					"_vMessage":"선택한 문자발송 문구가 없습니다."
//				});

				return false;
			}



		},

	// 저장되어있는 properties(hpsrTmsl)를 불러옴
	getPropHpsr : function() {
		var obj = LEMP.Properties.get({
			"_sKey" : "hpsrTmsl"
		});
		// alert("getProp : " + (JSON.stringify(obj)));

		return obj;
	},
	
	//현재 시간 기준 코드 조회
	fnGetToDayCd : function(){
		var today = new Date();
		var Dayof = today.getDay();   //요일
		var behours = today.getHours()-1;
		var hours = today.getHours(); // 시
		var fohours = today.getHours()+1;
		var minutes = today.getMinutes();  // 분
		var seconds = today.getSeconds();  // 초
		
		var setHoursCheck = hours;
		
		console.log(setHoursCheck, fohours, behours);
		
		return setHoursCheck;
	}


};

