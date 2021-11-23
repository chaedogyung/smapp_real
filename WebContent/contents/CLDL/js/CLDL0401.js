LEMP.addEvent("backbutton", "page.callbackBackButton");		// 뒤로가기 버튼 클릭시 이벤트

var page = {

		dprtCnt : null,				// 최상단 전체, 배달, 집하 조회 건수
		plnTmList : null,			// 시간 선택 리스트
		plnFltrList : null,			// 배달 예정 리스트 필터
		selectedSchTime : null,		// 선택한 시간구분값
		signInvNo : null,			// 서명이미지버튼을 클릭한 invNo
		order : "01",				// 배달완료 정렬방식
		mbl_dlv_area : null,
		mbl_dlv_nm : null,
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
			curDate = curDate.getFullYear() + "." + ("0"+(curDate.getMonth()+1)).slice(-2) + "." + ("0"+curDate.getDate()).slice(-2);
			$('#cldlBtnCal').text(curDate);

			// 배달완료 정렬방식 세팅
			page.order = LEMP.Properties.get({"_sKey":"order"});
			if(smutil.isEmpty(page.order)){
				page.order = "01";
			}

            if (page.order == "01") {
                $("#select_order").text("일반정렬");
                $("#select_order").data("value", "01");
                $("#select_order").attr("class", "selBox sort1 mgl15");
			} else {
                $("#select_order").text("역순정렬");
                $("#select_order").data("value", "02");
                $("#select_order").attr("class", "selBox sort2 mgl15");
			}


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

			});

			// 상단 시간/구역 선택 클릭이벤트 등록
			$(document).on('click', "li[name='timeLstLi']", function(e){
				if(page.dlvyCompl.area_sct_cd == "N"){
					$("li[name='timeLstLi']").removeClass('on');
					$(this).addClass('on');

					// 선택한 시간목록값 전역변수로 셋팅
					page.selectedSchTime = $(this).data('timeLi')+"";
				}else{
					$("li[name='timeLstLi']").removeClass('on');
					$(this).addClass('on');

					page.mbl_dlv_area = $(this).find('p.top:eq(0)').text();
//					page.selectedSchTime = "";
				}
								// 리스트 제조회
				page.listReLoad();
			});

			// 구분 필터값 변경
			$("#fltr_sct_cd").on('change', function(){
				page.listReLoad();					// 리스트 제조회
			});

			// 배달완료 정렬방식 변경
			$("#select_order").click(function(e) {

			   if ($(this).data("value") == "01") {
			      $("#select_order").text("역순정렬");
                  $("#select_order").data("value", "02");
                  $("#select_order").attr("class", "selBox sort2 mgl15");
               } else {
                  $("#select_order").text("일반정렬");
                  $("#select_order").data("value", "01");
                  $("#select_order").attr("class", "selBox sort1 mgl15");
               }

                var selOrder =  $(this).data("value");
				LEMP.Properties.set({"_sKey" : "order", "_vValue" : selOrder});
				page.order = selOrder;

				page.listReLoad();					// 리스트 제조회
			});

			// 송장 체크 변경시 하단 스캔건수 변경
//			$(document).on('change', 'input[name="chk"]', function(){
//				// 하단 스캔건수
//				var scanLstCnt = $('#scanLstCnt');
//				var scancnt = 0;
//				
//				if($(this).parents(".baedalBox").is(".off")){
//					if($(this).is(':checked')){
//						if(smutil.isEmpty(scanLstCnt.text())){
//							scancnt = 1;
//						}
//						else {
//							scancnt = Number(scanLstCnt.text()) + 1;
//						}
//					}else{
//						if(smutil.isEmpty(scanLstCnt.text())){
//							scancnt = 0;
//						}
//						else {
//							scancnt = Number(scanLstCnt.text()) - 1;
//						}
//					}
//					
//					// 스캔건수 표시
//					if(!smutil.isEmpty(scancnt)
//						&& scancnt > 0){
//						// 버튼위에 스캔건수 증가
//						scanLstCnt.text(scancnt+"");
//						scanLstCnt.show();
//					}
//					else{	// 스캔건수 숨김
//						scanLstCnt.text('0');
//						scanLstCnt.hide();
//					}
//				}
//			});

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
							"base_ymd":base_ymd
						}
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
					&& $('#'+inv_no).children(".baedalBox").is(".off") == false
					&& !smutil.isEmpty(cldl_tmsl_cd)){
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
					var sctCd = liElement.parents('li').data('liSctCd');		// 업무 구분

					if(!smutil.isEmpty(sctCd)){

						var inv_no = liElement.parents('li').data('invNo')+"";				// 송장번호
						var rsrv_mgr_no = liElement.parents('li').data('rsrvMgrNo')+"";		// 접수번호

						// 팝업 url 호출
						var popUrl = smutil.getMenuProp('CLDL.CLDL0404', 'url');

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


			// 배달출발확정 버튼 클릭
			$('#cmptTrsmBtn').click(function(e){
				var _this = this;
				var cldl_sct_cd = "D";							// 업무구분
				var cldl_tmsl_cd = page.returnTimeCd();			// 예정시간코드
				var mbl_dlv_area = page.mbl_dlv_area;			// 선택된 구역
				var base_ymd = $('#cldlBtnCal').text();			// 기준일자
				var acpt_sct_cd = $('#insujaCode').val();		// 인수자 코드
				var acpr_nm = $('#insujaTxt').val();			// 인수자명

				if(!_.isUndefined(page.dlvyCompl.area_sct_cd) && page.dlvyCompl.area_sct_cd == 'Y'){
					cldl_tmsl_cd = "";
					mbl_dlv_area = page.mbl_dlv_area;
				}else{
					cldl_tmsl_cd = page.returnTimeCd();
					mbl_dlv_area = "";
				}
				
				if(smutil.isEmpty(base_ymd)){
					LEMP.Window.toast({
						"_sMessage":"날짜를 선택해 주세요.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle":"배달 전송 오류",
//						"_vMessage":"날짜를 선택해 주세요.",
//					});

					return false;
				}
				else if(smutil.isEmpty(acpt_sct_cd)){
					LEMP.Window.toast({
						"_sMessage":"인수자정보를 선택해 주세요.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle":"배달 전송 오류",
//						"_vMessage":"인수자정보를 선택해 주세요."
//					});

					return false;
				}
				else if(acpt_sct_cd == "99"
						&& ($.trim(acpr_nm) == "" || smutil.isEmpty(acpr_nm))){
					LEMP.Window.toast({
						"_sMessage":"직접입력 인수자정보를 입력해 주세요.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle":"배달 전송 오류",
//						"_vMessage":"직접입력 인수자정보를 입력해 주세요."
//					});

					return false;
				}
				else if(smutil.isEmpty(cldl_tmsl_cd) && page.dlvyCompl.area_sct_cd == "N"){
					LEMP.Window.toast({
						"_sMessage":"배달 완료시간을 선택해 주세요.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle":"배달 전송 오류",
//						"_vMessage":"배달 완료시간을 선택해 주세요.",
//					});

					return false;
				}

				base_ymd = base_ymd.split('.').join('');

				var liLst = $('.baedalListBox > ul > li');
				var inv_no;									// li 에 걸려있는 송장번호
				var param_list = [];						// 전송할 리스트 배열
				var invNoObj = {};

				// 모든 li 리스트를 돌면서 스캔한 데이터와 체크박스의 체크한 데이터를 셋팅한다.
				$.each(liLst, function(idx, liObj){
					inv_no = $(liObj).attr('id')+"";

					// 스캔한 데이터 먼저 모두 셋팅
					if(page.chkScanYn(inv_no)){
						// 스캔한 송장번호, 스캔여부 전부 Y으로 셋팅
						invNoObj = {"inv_no":inv_no, "scan_yn":"Y"};
						param_list.push(invNoObj);
						return true;					// 스캔한 데이터를 셋팅했으면 다음 li 로 이동(continue)
					}

					// 체크박스에 체크한 데이터 (기본적으로 스캔 안한데이터이다)
					if($('#'+inv_no+'_chk').prop("checked")){
						// 스캔한 송장번호, 스캔여부 전부 Y으로 셋팅
						invNoObj = {"inv_no":inv_no, "scan_yn":"N"};
						param_list.push(invNoObj);
					}
				});

				var scanCnt = 0;
				scanCnt = param_list.length;

				// 배달출발 확정(전송) 컴펌창 호출
				if(scanCnt > 0){
					$('#pop2Txt2').html('전송할 데이터 '+scanCnt+'건<br />배달완료를 전송합니다.');
					$('.mpopBox.pop2').bPopup();
				}
				else{
					LEMP.Window.toast({
						"_sMessage":"전송할 데이터가 없습니다.\n송장스캔 혹은 체크박스를 선택해주세요.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle":"배달완료 전송오류",
//						"_vMessage":"전송할 데이터가 없습니다.\n송장스캔 혹은 체크박스를 선택해주세요.",
//					});

					return ;
				}
			});


			// 배달완료전송버튼 'yes' 버튼 클릭
			$('#cmptTrsmYesBtn').click(function(e){
				// 배달완료 확정로직 시작
				_this.cmptTrsm();
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



			// 인수자 설정 버튼 클릭
			$(document).on('click', '.insuja', function(e){
				var inv_no = $(this).data('invNo')+"";

				// 인수자 설정 팝업 호출
				var popUrl = smutil.getMenuProp('COM.COM0601', 'url');

				LEMP.Window.open({
					"_sPagePath" : popUrl
				});

			});




			// 문자버튼 클릭
			$('.btn.ftSms').click(function(e){
				// 문자발송 이벤트 호출
				_this.sendSms();

			});



			// 서명 싸인패드 호출
			$(document).on('click', '.btn.blue2.bdM.bdMemo.mgl1', function(e){
				var inv_no = $(this).data('invNo')+"";

				if(_this.chkScanYn(inv_no)){
					_this.signInvNo = inv_no;
					var date = new Date();
					var curTime = date.LPToFormatDate("yyyymmddHHnnss");
					var fileFullPath = "{external}/LEMP/"+inv_no+"_sign_"+curTime+".jpg";
					smutil.callSignPad(fileFullPath, page.cmptSignRgst);

				}
				else{
					LEMP.Window.toast({
						"_sMessage":"스캔후 가능합니다.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle":"서명 오류",
//						"_vMessage":"스캔후 가능합니다.",
//					});
				}

			});


			// 미배달 처리
			$(document).on('click', '.btn.blue3.bdM.bdCancle.mgl1', function(e){

				var inv_no = $(this).data('invNo');

				if(!smutil.isEmpty(inv_no)){

					// 스캔된 데이터만 미배달 처리 가능
//					if(_this.chkScanYn(inv_no)){

						var popUrl = smutil.getMenuProp("COM.COM0701","url");

						LEMP.Window.open({
							"_sPagePath":popUrl,
							"_oMessage" : {
								"param" : {
									"menu_id":"CLDL0401"
									, "inv_no":inv_no+""
									, "cldl_sct_cd" : "D"
								}
							}
						});
//					}
//					else{
//						LEMP.Window.alert({
//							"_sTitle":"미배달 처리 오류",
//							"_vMessage":"스캔후 가능합니다."
//						});
//
//						return false;
//					}

				}
			});





			// 스와이프해서 스캔버튼 클릭한 경우
			$(document).on('click', '.btn.blue4.bdM.bdScan.mgl1', function(e){

				var inv_no = $(this).data('invNo');
				inv_no = inv_no+"";

				if(!smutil.isEmpty(inv_no)){
					inv_no = inv_no.split('-').join('');
					var result = {"barcode" : inv_no};
					page.scanCallback(result);
				}
				else{
					LEMP.Window.toast({
						"_sMessage":"송장번호가 없습니다.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle":"스캔처리 오류",
//						"_vMessage":"송장번호가 없습니다."
//					});

					return false;
				}
			});



			// 하단 스캔버튼을 누른경우
			$(".btn.ftScan").click(function(){

				//현제 어느 탭에 있는지 상태체크
				var cldl_sct_cd = "D";						// 업무구분
				var cldl_tmsl_cd = _this.returnTimeCd();						// 예정시간선택
				var mbl_dlv_area = "";						// 선택된 구역
				var max_nm = "";							// 일괄전송을 위한 max 시간 값
				var area_sct_cd = page.dlvyCompl.area_sct_cd;			//구역(Y) 시간(N) 기준 
				
				if(!_.isUndefined(page.dlvyCompl.area_sct_cd) && page.dlvyCompl.area_sct_cd == 'Y'){
					cldl_tmsl_cd = "";
					max_nm = $("li[name='timeLstLi'].on").data('maxNm');
					mbl_dlv_area = _this.returnAreaCd();					
				}else{
					cldl_tmsl_cd = _this.returnTimeCd();
					max_nm = "";
					mbl_dlv_area = "";
				}

				if(smutil.isEmpty(cldl_tmsl_cd) && page.dlvyCompl.area_sct_cd == 'N'){
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
				var popUrl = smutil.getMenuProp('CLDL.CLDL0402', 'url');

				LEMP.Window.open({
					"_oMessage" : {
						"param" : {
							"cldl_sct_cd" : cldl_sct_cd,
							"cldl_tmsl_cd" : cldl_tmsl_cd,
							"mbl_dlv_area" : mbl_dlv_area,
							"max_nm" : max_nm,
							"area_sct_cd" : area_sct_cd,
							"menu_id" : "CLDL0401"
						}
					},
					"_sPagePath": popUrl
				});
			});	// end 스캔버튼을 누른경우 종료



			// 사진촬영 버튼클랙
			$('.btn.ftImg').click(function(e){
				_this.sendPhotoMms();		// 사진촬영 로직 호출
			});




			// 뒤로가기 버튼 클릭시  스캔 체크해서 전송여부 결정
			$('.cldlBack').click(function(e){
				// 스캔 체크해서 전송여부 결정
				_this.callbackBackButton();
			});




			// 금액변경 버튼 클릭(착불, 현불일경우만 팝업오픈)
			$(document).on('click', '.badge.red.s.imgNum', function(e){
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



			Handlebars.registerHelper('cldlSctCdChkTag', function(options) {

				var html = "";
				var span = "";

				if(!smutil.isEmpty(this.acper_nm)){
					html = html + '<li class="name">' + this.acper_nm + '</li>';
				}

				var acper_tel = smutil.nullToValue(this.acper_tel,"");
				var acper_cpno = smutil.nullToValue(this.acper_cpno,"");

				phoneNumber = page.getCpNo(acper_tel, acper_cpno);

				if(!smutil.isEmpty(phoneNumber)){
					html = html + '<li>' + phoneNumber + '</li>';
				}

				if(page.dlvyCompl.area_sct_cd == 'Y' && !smutil.isEmpty(this.cldl_tmsl_nm)){
					html = html + '<li><span style="padding: 0px 5px; font-size: 10px; color: #fff; border: 1px solid #015182; background-color: #015182; border-radius: 20px;">' + (this.cldl_tmsl_nm).replace('시', '') + '</span></li>'
				}

				// 고객요청 인수자 정보 셋팅
				if(!smutil.isEmpty(this.req_acpr_nm)){
					if(this.req_acpt_rgst_sct_cd == "01"){		// 고객요청
						html = html + '<li style="display: inline-block; max-width: 50px;" id="reqAcptSctCd_'+this.inv_no+'" data-req-acpt-sct-cd='+this.req_acpt_sct_cd+'><span class="tGreenBold">' + this.req_acpr_nm + '</span></li>';
					}
					else if(this.req_acpt_rgst_sct_cd == "02"){		// 기사변경
						html = html + '<li style="display: inline-block; max-width: 50px;" id="reqAcptSctCd_'+this.inv_no+'" data-req-acpt-sct-cd='+this.req_acpt_sct_cd+'><span class="tRed">' + this.req_acpr_nm + '</span></li>';
					}
				}

				if(!smutil.isEmpty(html)){
					html = '<div class="infoList"><ul>' + html + '</ul></div>';
				}

				return new Handlebars.SafeString(html); // mark as already escaped
			});

			// 배달예정 시간 표시
//			Handlebars.registerHelper('cldlTmslNmTag', function(options) {
//				var html = "";
//				
//				if(page.dlvyCompl.area_sct_cd == 'Y' && !smutil.isEmpty(this.cldl_tmsl_nm)){
//					html = '<span style="height: 22px; line-height: 20px; padding: 2px 5px; margin-top: 5px; font-size: 10px; color: #fff; border: 1px solid #015182; background-color: #015182; border-radius: 20px;">' + (this.cldl_tmsl_nm).replace('시', '') + '</span>'
//				}
//
//				return new Handlebars.SafeString(html); // mark as already escaped
//			});
			
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
							result = '<span class="badge red s imgNum" data-btn-yn="'+btnYn+'" data-inv-no="'+this.inv_no+'">' + result + '</span>';
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
				}
//				else {
//					return 'bg-v2';
//				}
			});



			// 전화번호가 있으면 전화걸기 버튼 리턴하고 없으면 버튼 리턴 안함 (집하 = 보낸사람, 배달 = 받는사람)
			Handlebars.registerHelper('setPhoneNumber', function(options) {
				var telNum;
				var acper_tel = smutil.nullToValue(this.acper_tel,"");
				var acper_cpno = smutil.nullToValue(this.acper_cpno,"");

				telNum = page.getCpNo(acper_tel, acper_cpno);

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
				var telNum ;
				var acper_tel = smutil.nullToValue(this.acper_tel,"");
				var acper_cpno = smutil.nullToValue(this.acper_cpno,"");

				telNum = page.getCpNo(acper_tel, acper_cpno);

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

		},


		// 화면 디스플레이 이벤트
		initDpEvent : function(){
			if (!_.isUndefined(page.dlvyCompl)) {
                // 구역별 시간별

			    if(page.dlvyCompl.area_sct_cd == "Y") {
					$(".deliveryTy3Cal").css({"margin-top": "225px"});
                    $("#setDlvyCom1").text('구역');
                    $("#setDlvyCom1").attr('class', 'red badge option outline');
                } else {
					$(".deliveryTy3Cal").css({"margin-top": "205px"});
                    $("#setDlvyCom1").text('시간');
                    $("#setDlvyCom1").attr('class', 'green badge option outline');
                }


                // 자동전송 여부

				if(page.dlvyCompl.area_sct_cd2 == "A") {
					$("#setDlvyCom2").text('자동');
					$("#setDlvyCom2").attr('class', 'blue badge option outline');
				} else {
					$("#setDlvyCom2").text('수동');
                    $("#setDlvyCom2").attr('class', 'gray2 badge option outline');
				}
				
			}
			
			// 인수자 정보 셋팅
			var acptSctInfo = LEMP.Properties.get({
				"_sKey" : "acptSctInfo",
			});

			if(!smutil.isEmpty(acptSctInfo)){
				$('#insujaTxt').val(acptSctInfo.acpr_nm);			// 인수자 hidden text
				$('#insujaCode').val(acptSctInfo.acpt_sct_cd);		// 인수자 hidden code
				$('.insujaTxtView').text(acptSctInfo.acpr_nm);		// 인수자 text
			}


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

			var _this = this;
			smutil.loadingOn();
			_this.plnFltrListSerch();		// 필터 리스트 조회
//			_this.cmptTmList();				// 예정시간리스트 조회
			//_this.cmptList();				// 리스트 목록 조회
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
					"cldl_sct_cd":"D",
					"base_ymd" : base_ymd
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
					var source = $("#cldl0401_mblLst_template").html();
					
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

							// 선택한 시간구간 등록
//							page.selectedSchTime = $(obj).find('p.top:eq(0)').text();
							page.mbl_dlv_area = $(obj).find('p.top:eq(0)').text();
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
							
							if(timeObj.find('p.top:eq(0)').text() == page.mbl_dlv_area){
								timeObj.addClass('on');

								page.mbl_dlv_area = timeObj.find('p.top:eq(0)').text();
								return false;
							}
						});

						// 활성화된 시간구간코드가 없으면 첫번째 리스트를 선택
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
					var source = $("#cldl0401_mblLst_template").html();
					
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
					"cldl_sct_cd":"D",
					"base_ymd" : base_ymd
				}
			};					// api 통신용 파라메터 (배달)


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
					var source = $("#cldl0401_timeLst_template").html();

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
					// 리스트가 아무것도 없을경우에는 기본으로 18~20 시 코드를 셋팅한다
					var data = {"list" : [{
						"cldl_tmsl_nm": "18~20시",
						"cldl_tmsl_cd": "19",
						"tmsl_dlv_cnt" : 0
					}]};

					// 핸들바 템플릿 가져오기
					var source = $("#cldl0401_timeLst_template").html();
					
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

				page.cmptList();		// 페이지 리스트 조회
			}
		},
		// ################### 시간대별 조회건수 조회 end

		// ################### 구역별 페이지 리스트 조회 start
		autoCmptList : function(){

			var _this = this;
			var cldl_sct_cd = "D";		// 업무구분 (배달 : D)
			var fltr_sct_cd = $('#fltr_sct_cd').val();		// 필터구분
			var mbl_dlv_area = page.mbl_dlv_area;			// 현제 어느 시간을 선택했는지 검사

			_this.apiParam.param.baseUrl = "smapis/cldl/autoCmptList";				// api no
			_this.apiParam.param.callback = "page.cmptListCallback";			// callback methode

			// 날짜셋팅
			var curDate = new Date();
			curDate = curDate.getFullYear() + ("0"+(curDate.getMonth()+1)).slice(-2) + ("0"+curDate.getDate()).slice(-2);
			var base_ymd = smutil.nullToValue($('#cldlBtnCal').text(),curDate);
			base_ymd = base_ymd.split('.').join('');

			_this.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {
					"cldl_sct_cd" : smutil.nullToValue(cldl_sct_cd+"","D"),		// 업무구분
					"fltr_sct_cd" : smutil.nullToValue(fltr_sct_cd+"",""),			// 필터구분
					"mbl_area" : smutil.nullToValue(mbl_dlv_area+"",""),		// 구역코드
					"base_ymd" : base_ymd+""
				}
			};

			// 공통 api호출 함수
			smutil.callApi(_this.apiParam);

			page.apiParamInit();		// 파라메터 전역변수 초기화
		},

		// ################### 시간별 페이지 리스트 조회 start
		cmptList : function(){

			var _this = this;
			var cldl_sct_cd = "D";		// 업무구분 (배달 : D)
			var fltr_sct_cd = $('#fltr_sct_cd').val();		// 필터구분
			var cldl_tmsl_cd = _this.returnTimeCd();			// 현제 어느 시간을 선택했는지 검사


			_this.apiParam.param.baseUrl = "smapis/cldl/cmptList";				// api no
			_this.apiParam.param.callback = "page.cmptListCallback";			// callback methode

			// 날짜셋팅
			var curDate = new Date();
			curDate = curDate.getFullYear() + ("0"+(curDate.getMonth()+1)).slice(-2) + ("0"+curDate.getDate()).slice(-2);
			var base_ymd = smutil.nullToValue($('#cldlBtnCal').text(),curDate);
			base_ymd = base_ymd.split('.').join('');

			_this.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {
					"cldl_sct_cd" : smutil.nullToValue(cldl_sct_cd+"","D"),		// 업무구분
					"fltr_sct_cd" : smutil.nullToValue(fltr_sct_cd+"",""),			// 필터구분
					"cldl_tmsl_cd" : smutil.nullToValue(cldl_tmsl_cd+"",""),		// 시간코드
					"base_ymd" : base_ymd+""
				}
			};

			// 공통 api호출 함수
			smutil.callApi(_this.apiParam);

			page.apiParamInit();		// 파라메터 전역변수 초기화
		},


		// 리스트 조회후 그리기
		cmptListCallback : function(result){

			page.apiParamInit();		// 파라메터 전역변수 초기화

			try{
				// 스캔건수
				var scanLstCnt = $('#scanLstCnt');

				// 조회한 결과가 있을경우
//				if(false && smutil.apiResValidChk(result) && result.code == "0000"
//						&& result.data_count > 0){
				if(smutil.apiResValidChk(result) && result.code == "0000"){

					var data = {};

					if(result){
						data = result.data;
						//2020-08-06 배달완료리스트 역순정렬
						if(page.order == "02"){
							data.list.reverse();
						}
					}
					//data = [];

					// 핸들바 템플릿 가져오기
					var source = $("#cldl0401_list_template").html();

					// 핸들바 템플릿 컴파일
					var template = Handlebars.compile(source);

					// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
					var liHtml = template(data);

					// 생성된 HTML을 DOM에 주입
					$('#cldl0401LstUl').html(liHtml);

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
				page.apiParamInit();			// 파라메터 전역변수 초기화
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
//			var _this = this;
			smutil.loadingOn();				// 로딩바 시작
			
			page.plnFltrListSerch();
			
//			smutil.loadingOff();
		},



		// ################### 배달출발 전송 start
		dprtTrsm : function(){

			var _this = this;
			var cldl_sct_cd = "D";							// 업무구분 (배달 : D)
			var cldl_tmsl_cd = _this.returnTimeCd();		// 시간구분코드

			if(!smutil.isEmpty(cldl_sct_cd)
					&& !smutil.isEmpty(cldl_tmsl_cd)){
				_this.apiParamInit();		// 파라메터 전역변수 초기화
				_this.apiParam.param.baseUrl = "smapis/cldl/dprtTrsm";			// api no
				_this.apiParam.param.callback = "page.dprtTrsmCallback";		// callback methode
				_this.apiParam.data = {						// api 통신용 파라메터
					"parameters" : {
						"cldl_sct_cd" : cldl_sct_cd			// 업무구분
						, "cldl_tmsl_cd" : cldl_tmsl_cd
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
				debugger;
				// api 전송 성공
				if(smutil.apiResValidChk(result) && result.code == "0000"){

					LEMP.Window.toast({
						"_sMessage":"배달출발을 전송하였습니다.",
						'_sDuration' : 'short'
					});
//					LEMP.Window.alert({
//						"_sTitle":"",
//						"_vMessage":"배달출발을 전송하였습니다.",
//					});

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


		// 사진촬영 mms 발송
		sendPhotoMms : function(){
			var _this = this;
			var chkTelLst = [];
			var invNoLst = [];
			// 보내는분, 상품명, 인수자 추가
			var snperNmLst = [];
			var artcNmLst = [];
			var acprNmLst = []
			var popOpenYn = true;
			var acprCnt = 0;
			var acpr_nm = "";

			//배송일자
			var rcv_date = '배송일자 : ' + smutil.getTodayStr();

			$("input[name=chk]:checked").each(function(idx, Obj) {

				var chkObj = $(this);
				var inv_no = chkObj.attr("id");
				inv_no = (inv_no.split("_"))[0];
				var telNumber = chkObj.val();

				//보내는분, 상품명, 인수자 추가
				var snper_nm = chkObj.attr("data-snper-nm");
				var artc_nm = chkObj.attr("data-artc-nm");
				var acpr_nm = chkObj.attr("data-acpr-nm");

				if(smutil.isEmpty(telNumber)){
					telNumber = "";
				}


				// 스캔 되고 전화번호가 있는 데이터만 mms 전송가능
				// (20200129 : 전화번호 체크는 mms 팝업에서만 하는걸로 요건사항 변경)
				if(!smutil.isEmpty(inv_no)
						&& _this.chkScanYn(inv_no)
//						&& !smutil.isEmpty(telNumber)
						){

					// 핸드폰 번호만 mms 발송 가능(20200129 : 전화번호 체크는 mms 팝업에서만 하는걸로 요건사항 변경)
//					if(telNumber.LPStartsWith("010")
//							|| telNumber.LPStartsWith("011")
//							|| telNumber.LPStartsWith("016")
//							|| telNumber.LPStartsWith("017")
//							|| telNumber.LPStartsWith("018")
//							|| telNumber.LPStartsWith("019")
//							|| telNumber.LPStartsWith("050")){

						chkTelLst.push(telNumber);
						invNoLst.push(inv_no);
						snperNmLst.push(snper_nm);
						artcNmLst.push(artc_nm);
						acprNmLst.push(acpr_nm);

						// 최초에 나오는 송장번호에 셋팅된 인수자를 사진정송 문구에 보내기로 수정 협의(2020-02-12)
						if(acprCnt == 0){
							acpr_nm = chkObj.data("acprNm");
							acprCnt++;
						}

//					}
//					else{
//						popOpenYn = false;
//						return false;
//					}
				}
			});


			if(invNoLst.length > 20){
				LEMP.Window.toast({
					"_sMessage":"사진전송은 최대 20건까지 가능합니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"사진전송 오류",
//					"_vMessage":'사진전송은 최대 20건까지 가능합니다.'
//				});
				return false;
			}

			// 스캔 되고 전화번호가 있는 리스트만 mms 전송가능
			if(chkTelLst.length > 0 && invNoLst.length > 0 && popOpenYn){
				var paramObj = [];
				var timeTxt = "";

				$.each(chkTelLst, function(idx){
					paramObj.push({"inv_no" : (invNoLst[idx])+"","snper_nm" : (snperNmLst[idx])+"", "artc_nm" : (artcNmLst[idx])+"", "acpr_nm" : (acprNmLst[idx])+"", "rcv_date" : rcv_date, "tel_num":chkTelLst[idx]});
				});


				// 사진전송 로직 시작~!!!
				var popUrl = smutil.getMenuProp("CLDL.CLDL0410","url");
				console.log(paramObj);
				LEMP.Window.open({
					"_sPagePath":popUrl,
					"_oMessage":{"param":{"list" : paramObj, "acpr_nm" : acpr_nm}}		// 인수자명 셋팅
				});

			}
			else if(!popOpenYn){
				LEMP.Window.toast({
					"_sMessage":"핸드폰 번호가 아닙니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"사진전송 오류",
//					"_vMessage":'핸드폰 번호가 아닙니다.'
//				});
				return false;
			}
			else{
				LEMP.Window.toast({
					"_sMessage":"스캔후 선택한 송장정보가 없거나\nMMS를 전송할수있는 전화번호가 없습니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"사진전송 오류",
//					"_vMessage":'스캔후 선택한 송장정보가 없거나\nMMS를 전송할수있는 전화번호가 없습니다.'
//				});
				return false;
			}

		},


		// mms 전송후 페이지 제조회
		cldl0410Callback : function(){
			page.listReLoad();				// 리스트 제조회
		},


		// 문자발송 서비스 호출
		sendSms : function(){
			var _this = this;
			var chkLst = [];
			var invNoLst = [];
			var chkYn = false;

			$("input[name=chk]:checked").each(function(idx, Obj) {
				var inv_no = $(this).attr("id");
				inv_no = (inv_no.split("_"))[0];

				// 스캔 된 데이터만 문자가능
				if(_this.chkScanYn(inv_no)){
					chkLst.push($(this).val());
					invNoLst.push($(this).attr("id"));
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


			// 스캔한 송장을 선택해야 문자 가능 (20200104)
			if(chkLst.length > 0){
				var single = [];
				var timeTxt = "";

				// 전화번호 중복제거
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
//				else if(single.length == 1 && smutil.isEmpty(single[0])){
//					LEMP.Window.alert({
//						"_sTitle":"문자발송 오류",
//						"_vMessage":'문자를 발송할 전화번호가 없습니다.'
//					});
//
//					return false;
//				}
//				(20200129 : 전화번호 체크를 안하고 기사들이 변경 가능하게 모두 앱으로 넘어가도록 로직변경)
//				else if(single.length == 1 && !(single[0].LPStartsWith("010"))){
//					LEMP.Window.alert({
//						"_sTitle":"문자발송 오류",
//						"_vMessage":'핸드폰 번호가 아닙니다.'
//					});
//
//					return false;
//				}
//				else if(single.length == 1 && !smutil.isEmpty(single[0])){
				else {
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
			var inv_no;
			var chkYn = false;

			$("input[name=chk]:checked").each(function() {

				inv_no = $(this).attr("id");
				inv_no = (inv_no.split("_"))[0];

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



			// 스캔한 송장을 선택해야 문자 가능 (20200104)
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

					// 리스트에서 고른 시간구분text
					// 문구에 시간관련정보 삭제하기로 결정(20200305)
//					if(!smutil.isEmpty(timeTxt)){
//						text += "\n도착예정시간 : " + timeTxt ;
//					}

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

		},






		//##########################################################################
		// 고객요청(인수자변경) api 호출	start
		// 인수자 팝업 닫을때 callback 함수
		com0601Callback : function(res){
			// 선택한 인수자 정보가 있을경우
			if(!smutil.isEmpty(res.selectedCode)
					&& !smutil.isEmpty(res.selectedText)){
				$('#insujaTxt').val(res.selectedText);			// 인수자 text
				$('#insujaCode').val(res.selectedCode);			// 인수자 code
				$('.insujaTxtView').text(res.selectedText);		// 인수자 text

				var acpt_sct_info = {
					"acpt_sct_cd" : res.selectedCode
					, "acpr_nm" : res.selectedText
				};

				// 인수자정보 메모리에 저장
				LEMP.Properties.set({
					"_sKey" : "acptSctInfo",
					"_vValue" : acpt_sct_info
				});
			}
		},



		// ################### 스캔 전송 start
		// 스캔된후 호출되는 함수
		scanCallback : function(result){
			page.apiParamInit();		// 전역 api 파라메터 초기화
			var _this = this;
			var scanCallYn = "Y";
			var cldl_sct_cd = 'D';								// 업무구분 (배달 : D)
			var cldl_tmsl_cd = page.returnTimeCd();								// 예정시간
			var inv_no = result.barcode;
			var acpt_sct_cd = $('#insujaCode').val();			// 인수자 코드
			var acpr_nm = $('#insujaTxt').val();				// 인수자명
			var area_sct_cd = page.dlvyCompl.area_sct_cd;			//구역(Y) 시간(N) 기준 
			
			if(!_.isUndefined(page.dlvyCompl.area_sct_cd) && page.dlvyCompl.area_sct_cd == 'Y'){
				cldl_tmsl_cd = "";
			}else{
				cldl_tmsl_cd = page.returnTimeCd();
			}
			
			inv_no = inv_no+"";
			// 중복 스캔 방지
			if(page.chkScanYn(inv_no)){
				
//				LEMP.Window.alert({
//					"_sTitle":"스캔오류",
//					"_vMessage":"이미 스캔 완료된 송장입니다."
//				});

				// 실패 tts 호출(벨소리)
				smutil.callTTS("0", "0", null, result.isBackground);

				return false;
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
			else if(smutil.isEmpty(acpt_sct_cd)){
				LEMP.Window.toast({
					"_sMessage":"인수자정보를 선택해 주세요.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"스캔오류",
//					"_vMessage":"인수자정보를 선택해 주세요."
//				});

				scanCallYn = "N";
			}
			else if(acpt_sct_cd == "99"
					&& ($.trim(acpr_nm) == "" || smutil.isEmpty(acpr_nm))){
				LEMP.Window.toast({
					"_sMessage":"직접입력 인수자정보를 입력해 주세요.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"스캔오류",
//					"_vMessage":"직접입력 인수자정보를 입력해 주세요."
//				});

				scanCallYn = "N";
			}



			// 스캔 validation 오류로 실패
			if(scanCallYn == "N"){

				// 실패 tts 호출
				smutil.callTTS("0", "0", null, result.isBackground);
				//setTimeout(() => smutil.callTTS("0", "0", null, result.isBackground), 300);

				return false;
			}
			

				//스캔시간
				var date = new Date();
				var scan_dtm = date.LPToFormatDate("yyyymmddHHnnss");				// 스캔 시간
				page.apiParam.param.baseUrl = "smapis/cldl/cmptScanRgst";			// api no
				page.apiParam.param.callback = "page.cmptScanRgstCallback";			// callback methode
	
	
				page.apiParam.data =
				{
					"parameters" : {
						"inv_no":inv_no+"",
						"scan_dtm":scan_dtm+"",
						"cldl_tmsl_cd":cldl_tmsl_cd+"",
						"cldl_sct_cd":cldl_sct_cd+"",
						"acpt_sct_cd" : acpt_sct_cd+"",
						"acpr_nm" : acpr_nm+"",
						"area_sct_cd" : area_sct_cd+""
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
			var cldl_sct_cd = "D";			// 업무구분
//			var message = "스캔성공";
			var acpr_nm = $('#insujaTxt').val();				// 인수자명

			// api 결과 성공여부 1차 검사
			if(smutil.apiResValidChk(result)
					&& (result.code == "0000" || result.code == "1000")){

				// 하단 스캔건수+1
				var scanLstCnt = $('#scanLstCnt');
				var scancnt = 0;

				var inv_no = result.inv_no;

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

						// 스켄하지 않은건이면 하단 카운트 증가(상단카운트는 증가할 필요 없음)
						if(!page.chkScanYn(inv_no)){

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
						liKey.prependTo('#cldl0401LstUl');

						// 인수자 추가
						$('#'+inv_no+"_chk").attr('data-acpr-nm', acpr_nm);

					}
					else {	// 스캔한 정보가 리스트에 없는경우는 li 추가
						var data = {"inv_no" : inv_no+"", "cldl_sct_cd" : cldl_sct_cd, "acpr_nm" : acpr_nm};

						// 핸들바스 템플릿 가져오기
						var source = $("#cldl0401_li_template").html();

						// 핸들바 템플릿 컴파일
						var template = Handlebars.compile(source);

						// 핸들바스 템플릿에 데이터를 바인딩해서 HTML 생성
						var liHtml = template(data);

						// noList 일경우 li 삭제
						if($('.noList').length > 0){
							$('.noList').remove();
						}

						// 생성된 HTML을 DOM에 주입
						$('#cldl0401LstUl').prepend(liHtml);


						if(smutil.isEmpty(scanLstCnt.text())){
							scancnt = 1;
						}
						else {
							scancnt = Number(scanLstCnt.text()) + 1;
						}

						// 버튼위에 스캔건수 증가
						scanLstCnt.show();
						scanLstCnt.text(scancnt+"");


						// 상단에 time 리스트 카운트 증가
						var timeLiCd = page.returnTimeCd();
						var timeLiCdCnt = $('#timeCnt_D_'+timeLiCd);
						scancnt = 0;

						if(smutil.isEmpty(timeLiCdCnt.text())){
							scancnt = 1;
						}
						else {
							scancnt = Number(timeLiCdCnt.text()) + 1;
						}

						timeLiCdCnt.text(scancnt+"");
					}

					// 카운트가 500이 넘어가면 1로 초기화
					var scanCnt = scanLstCnt.text();
					var resetCnt = 500;
					if(!smutil.isEmpty(scanCnt)
							&& Number(scanCnt)
							&& Number(scanCnt) > 0
							){
						scanCnt = Number(scanCnt) % resetCnt;

						if(scanCnt == 0){
							scanCnt = resetCnt
						}
					}

					//TO-DO
//					console.log(data);

					// 성공 tts 호출
					smutil.callTTS("1", "2", scanCnt, result.isBackground);

					if(page.dlvyCompl.area_sct_cd2 == "A"){
						$("#span_cldl_sct_cd").hide();
						$("#chngTme").hide();
						var baseUrl = "smapis/cldl/dlvCmptScanTrsm"
						if(!smutil.isEmpty(baseUrl)){
							smutil.loadingOn();
							
							var liLst = $(".li.list")
							var param_list = [];						// 전송할 리스트 배열
							var invNoObj = {};
							var cldl_tmsl_cd = page.returnTimeCd();
							var mbl_dlv_area = page.mbl_dlv_area;
							var max_nm;
							var area_sct_cd = page.dlvyCompl.area_sct_cd;	//구역시간 구분

							if(page.dlvyCompl.area_sct_cd == 'Y'){
								mbl_dlv_area = page.mbl_dlv_area;
								cldl_tmsl_cd = "";
								max_nm = $("li[name='timeLstLi'].on").data('maxNm');
							}else{
								mbl_dlv_area = "";
								cldl_tmsl_cd = page.returnTimeCd();
								max_nm = "";
							}
							
							invNoObj = {"inv_no":inv_no, "scan_yn":"Y"};
							param_list.push(invNoObj);

							
							var curDate = new Date();
							curDate = curDate.getFullYear() + ("0"+(curDate.getMonth()+1)).slice(-2) + ("0"+curDate.getDate()).slice(-2);
							var base_ymd = smutil.nullToValue($('#cldlBtnCal').text(),curDate);
							base_ymd = base_ymd.split('.').join('');
							
							page.apiParam.param.baseUrl=baseUrl;
							page.apiParam.param.callback="page.cmptTrsmCallback";
							page.apiParam.data = {				// api 통신용 파라메터
									"parameters" : {
										"base_ymd" : base_ymd,				// 기준일자
										"cldl_sct_cd" : cldl_sct_cd, 		// 집하 / 배달 업무 구분코드
										"cldl_tmsl_cd" : cldl_tmsl_cd, 		// 예정시간 구분코드
										"mbl_area" : mbl_dlv_area,			// 선택된 구역
										"max_nm" : max_nm,					// 일괄전송을 위한 max 시간값 
										"area_sct_cd" : area_sct_cd,
										"acpt_sct_cd" : $('#insujaCode').val(), 		// 인수자 구분코드
										"acpr_nm" : acpr_nm,				// 인수자 명
										"param_list" : param_list			// 전송할 송장정보 {송장번호 : 스캔여부}
									}
							};
							smutil.loadingOn();
							
							// 공통 api호출 함수
							smutil.callApi(page.apiParam);
						}
					}
					
					if(liKey.length == 0 && page.dlvyCompl.area_sct_cd == 'Y'){
						page.listReLoad();
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
//						var scanLstCnt = $('#scanLstCnt');
//						var scancnt = 0;
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
//
//						//상단 time 리스트 건수 -1
//						var timeLiCd = page.returnTimeCd();
//						var timeLiCdCnt = $('#timeCnt_D_'+timeLiCd);
//						var scancnt = 0;
//						if(smutil.isEmpty(timeLiCdCnt.text())){
//							scancnt = 0;
//						}
//						else {
//							scancnt = Number(timeLiCdCnt.text()) - 1;
//						}
//
//						if(scancnt < 0) scancnt = 0;
//						timeLiCdCnt.text(scancnt+"");
//					}
//				}

				// 리스트가 없을경우 noList 처리
//				if($('.cldlSctCd_D').length == 0){
//					// 핸들바스 템플릿 가져오기
//					var source = $("#cldl0401_noLstLi").html();
//
//					// 핸들바 템플릿 컴파일
//					var template = Handlebars.compile(source);
//
//					// 핸들바스 템플릿에 데이터를 바인딩해서 HTML 생성
//					var liHtml = template();
//
//					// 생성된 HTML을 DOM에 주입
//					$('#cldl0401LstUl').prepend(liHtml);
//				}

			}
			
			
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
			else if(smutil.isEmpty(cldl_tmsl_cd)){
				LEMP.Window.toast({
					"_sMessage":"선택된 시간구간이 없습니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"스캔취소 오류",
//					"_vMessage":"선택된 시간구간이 없습니다."
//				});

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
					_this.apiParam.param.baseUrl = "smapis/cldl/cmptScanCcl";			// api no
					_this.apiParam.param.callback = "page.cmptScanCclCallback";			// callback methode
					_this.apiParam.data = {				// api 통신용 파라메터
						"parameters" : {
							"inv_no" : inv_no+"",					// 송장번호
							"cldl_sct_cd" : cldl_sct_cd,		// 업무구분
							"cldl_tmsl_cd" : cldl_tmsl_cd		// 시간코드
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
			}
			else if(result.code == "9000"){
				page.listReLoad();				// 이미 삭제된 리스트이기 때문에 바로 리스트 제조회
			}
			else{
				var message = smutil.nullToValue(result.message,'');

				LEMP.Window.toast({
					"_sMessage":message,
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





		// ################### 서명이미지 전송
		cmptSignRgst : function(signObj){
			page.apiParamInit();					// 파라메터 초기화

			if(!smutil.isEmpty(signObj) && signObj.result && !smutil.isEmpty(page.signInvNo)){

				//서명이미지 api 호출
				page.apiParam.id = 'HTTPFILE'
				page.apiParam.param.baseUrl = "/smapis/cldl/cmptSignRgst";			// api no
				page.apiParam.param.callback = "page.cmptSignRgstCallback";			// callback methode
				page.apiParam.data = {				// api 통신용 파라메터
					"parameters" : {
						"inv_no" : page.signInvNo+""	// 송장번호
					}
				};
				page.apiParam.files = [(signObj.list[0]).target_path];

				// 공통 api호출 함수
				smutil.callApi(page.apiParam);

				page.signInvNo = null;
			}
			else{
				LEMP.Window.toast({
					"_sMessage":"서명이미지를 저장하지 못했습니다.\n 관리자에게문의해 주세요.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"서명이미지 저장오류",
//					"_vMessage":"서명이미지를 저장하지 못했습니다.\n 관리자에게문의해 주세요."
//				});
			}

		},


		// 서명이미지 전송 콜백
		cmptSignRgstCallback : function(result){
			page.signInvNo = null;

			// api 전송 성공
			if(smutil.apiResValidChk(result) && result.code == "0000"){
				LEMP.Window.toast({
					"_sMessage":"서명이미지 저장처리가 완료되었습니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"서명이미지 저장",
//					"_vMessage":"서명이미지 저장처리가 완료되었습니다."
//				});

			}
			else{

				LEMP.Window.toast({
					"_sMessage":smutil.nullToValue(result.message,''),
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"서명이미지 저장오류",
//					"_vMessage":smutil.nullToValue(result.message,'')
//				});
			}

			page.apiParamInit();			// 파라메터 전역변수 초기화
		},
		// ################### 서명이미지 저장 처리 end



		// ################### 미배달 전송 start
		// 미배달 사유 선택후 callback
		com0701Callback : function(res){
			page.apiParamInit();		// 파라메터 초기화

			var inv_no = res.param.inv_no;		// 미배달 선택한 송장번호
			inv_no = inv_no+"";					// 송장번호 문자로처리
			var cldl_sct_cd = smutil.nullToValue(res.param.cldl_sct_cd,"");	// 배달업무
			var dlay_rsn_cd = smutil.nullToValue(res.param.code,"");	// 미배달 사유 코드
			var rsn_cont = smutil.nullToValue(res.param.value,"");		// 미배달 사유 date

			if(!smutil.isEmpty(inv_no) && !smutil.isEmpty(dlay_rsn_cd)){

				var liDiv = $('#'+inv_no).children('.baedalBox');

				// 스캔된 데이터만 미배달 처리 가능
//				if(liDiv.is('.off') == false){

					if(!smutil.isEmpty(rsn_cont)){
						rsn_cont = rsn_cont.split('.').join('');
					}

					//미배달 api 호출, 

					page.apiParam.id = 'HTTP'
					page.apiParam.param.baseUrl = "smapis/cmn/rsnRgstTxt";				// api no
					page.apiParam.param.callback = "page.rsnRgstCallback";			// callback methode
					page.apiParam.data = {				// api 통신용 파라메터
						"parameters" : {
							"inv_no" : inv_no+"",				// 송장번호
							"cldl_sct_cd" : cldl_sct_cd,		// 업무구분
							"dlay_rsn_cd" : dlay_rsn_cd,		// 미배달 사유 코드
							"rsn_cont" : rsn_cont				// 미배달 사유 date
						}
					};
					page.apiParam.files = [];

					// 공통 api호출 함수
					smutil.callApi(page.apiParam);
					
					//확인창 삭제(2020.05.19)
//					var btnCancel = LEMP.Window.createElement({ _sElementName:"TextButton" });
//					btnCancel.setProperty({
//						_sText : "취소",
//						_fCallback : function(){}
//					});
//
//
//					var btnConfirm = LEMP.Window.createElement({ _sElementName:"TextButton" });
//					btnConfirm.setProperty({
//						_sText : "확인",
//						_fCallback : function(){
//
//							//미배달 api 호출
//							page.apiParam.id = 'HTTP'
//							page.apiParam.param.baseUrl = "smapis/cmn/rsnRgstTxt";				// api no
//							page.apiParam.param.callback = "page.rsnRgstCallback";			// callback methode
//							page.apiParam.data = {				// api 통신용 파라메터
//								"parameters" : {
//									"inv_no" : inv_no+"",				// 송장번호
//									"cldl_sct_cd" : cldl_sct_cd,		// 업무구분
//									"dlay_rsn_cd" : dlay_rsn_cd,		// 미배달 사유 코드
//									"rsn_cont" : rsn_cont				// 미배달 사유 date
//								}
//							};
//							page.apiParam.files = [];
//
//							// 공통 api호출 함수
//							smutil.callApi(page.apiParam);
//						}
//					});
//
//
//					LEMP.Window.confirm({
//						"_sTitle":"미배달 처리",
//						_vMessage : "선택한 송장정보를 \n미배달 처리하시겠습니까?",
//						_aTextButton : [btnConfirm, btnCancel]
//					});


//				}
//				else{
//					LEMP.Window.alert({
//						"_sTitle":"미배달 처리 오류",
//						"_vMessage":"미스캔 데이터 입니다."
//					});
//
//					return false;
//				}

			}
			else {
				LEMP.Window.toast({
					"_sMessage":"선택한 미배달 송장번호 혹은 \n미배달 사유가 없습니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"미배달 처리 오류",
//					"_vMessage":"선택한 미배달 송장번호 혹은 \n미배달 사유가 없습니다."
//				});

				return false;
			}


		},


		// 미배달 처리 콜백
		rsnRgstCallback : function(result){
			page.apiParamInit();			// 파라메터 전역변수 초기화

			// api 전송 성공
			if(smutil.apiResValidChk(result) && result.code == "0000"){
				LEMP.Window.toast({
					"_sMessage" : "미배달 처리가 완료되었습니다.",
					"_sDuration" : "short"
				});

				page.listReLoad();				// 리스트 제조회
			}
//			else{
//				var message = smutil.nullToValue(result.message,'');
//
//				LEMP.Window.alert({
//					"_sTitle":"미배달 처리 오류",
//					"_vMessage":message
//				});
//			}
		},
		// ################### 미배달 처리 end




		// ################### 배달완료확정(전송) start
		// 일괄전송 ( 시간데마다 스캔 + 체크한 데이터 같이 전송)
		cmptTrsm : function(){

			var _this = this;
			var cldl_sct_cd = "D";							// 업무구분
			var cldl_tmsl_cd = page.returnTimeCd();			// 예정시간코드
			var mbl_dlv_area = page.mbl_dlv_area;			// 선택된 구역
			var base_ymd = $('#cldlBtnCal').text();			// 기준일자
			var acpt_sct_cd = $('#insujaCode').val();		// 인수자 코드
			var acpr_nm = $('#insujaTxt').val();			// 인수자명
			var max_nm = "";								//일괄전송을 위한 max 시간 값
			var area_sct_cd = page.dlvyCompl.area_sct_cd;	//구역시간 구분

			if(!_.isUndefined(page.dlvyCompl.area_sct_cd) && page.dlvyCompl.area_sct_cd == 'Y'){
				cldl_tmsl_cd = "";
				max_nm = $("li[name='timeLstLi'].on").data('maxNm');
				mbl_dlv_area = page.mbl_dlv_area;
			}else{
				cldl_tmsl_cd = page.returnTimeCd();
				max_nm = "";
				mbl_dlv_area = "";
			}
			
			if(smutil.isEmpty(base_ymd)){
				LEMP.Window.toast({
					"_sMessage":"날짜를 선택해 주세요.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"배달 전송 오류",
//					"_vMessage":"날짜를 선택해 주세요.",
//				});

				return false;
			}
			else if(smutil.isEmpty(acpt_sct_cd)){
				LEMP.Window.toast({
					"_sMessage":"인수자정보를 선택해 주세요.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"배달 전송 오류",
//					"_vMessage":"인수자정보를 선택해 주세요."
//				});

				return false;
			}
			else if(acpt_sct_cd == "99"
					&& ($.trim(acpr_nm) == "" || smutil.isEmpty(acpr_nm))){
				LEMP.Window.toast({
					"_sMessage":"직접입력 인수자정보를 입력해 주세요.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"배달 전송 오류",
//					"_vMessage":"직접입력 인수자정보를 입력해 주세요."
//				});

				return false;
			}
			else if(smutil.isEmpty(cldl_tmsl_cd) && page.dlvyCompl.area_sct_cd == "N"){
				LEMP.Window.toast({
					"_sMessage":"배달 완료시간을 선택해 주세요.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle":"배달 전송 오류",
//					"_vMessage":"배달 완료시간을 선택해 주세요.",
//				});

				return false;
			}

			base_ymd = base_ymd.split('.').join('');

			var liLst = $('.baedalListBox > ul > li');
			var inv_no;									// li 에 걸려있는 송장번호
			var param_list = [];						// 전송할 리스트 배열
			var invNoObj = {};

			// 모든 li 리스트를 돌면서 스캔한 데이터와 체크박스의 체크한 데이터를 셋팅한다.
			$.each(liLst, function(idx, liObj){
				inv_no = $(liObj).attr('id')+"";

				// 스캔한 데이터 먼저 모두 셋팅
				if(page.chkScanYn(inv_no)){
					// 스캔한 송장번호, 스캔여부 전부 Y으로 셋팅
					invNoObj = {"inv_no":inv_no, "scan_yn":"Y"};
					param_list.push(invNoObj);
					return true;					// 스캔한 데이터를 셋팅했으면 다음 li 로 이동(continue)
				}

				// 체크박스에 체크한 데이터 (기본적으로 스캔 안한데이터이다)
				if($('#'+inv_no+'_chk').prop("checked")){
					// 스캔한 송장번호, 스캔여부 전부 Y으로 셋팅
					invNoObj = {"inv_no":inv_no, "scan_yn":"N"};
					param_list.push(invNoObj);
				}
			});

			_this.apiParamInit();		// 파라메터 전역변수 초기화
			_this.apiParam.param.baseUrl = "smapis/cldl/dlvCmptScanTrsm";		// api no
			_this.apiParam.param.callback = "page.cmptTrsmCallback";			// callback methode
			_this.apiParam.data = {				// api 통신용 파라메터
					"parameters" : {
						"base_ymd" : base_ymd,				// 기준일자
						"cldl_sct_cd" : cldl_sct_cd, 		// 집하 / 배달 업무 구분코드
						"cldl_tmsl_cd" : cldl_tmsl_cd, 		// 예정시간 구분코드
						"mbl_area" : mbl_dlv_area,			// 선택된 구역
						"max_nm" : max_nm,					// 일괄전송을 위한 max 시간값 
						"area_sct_cd" : area_sct_cd,
						"acpt_sct_cd" : acpt_sct_cd, 		// 인수자 구분코드
						"acpr_nm" : acpr_nm,				// 인수자 명
						"param_list" : param_list			// 전송할 송장정보 {송장번호 : 스캔여부}
					}
			}

			
			smutil.loadingOn();			// 로딩바 on
			
			smutil.callApi(_this.apiParam);
			
			page.apiParamInit();		// 파라메터 전역변수 초기화

		},


		// 배달출발확정 콜백
		cmptTrsmCallback : function(result){
			var _this = this;

			try{
				// api 전송 성공
				if(smutil.apiResValidChk(result) && result.code == "0000"){
					LEMP.Window.toast({
						"_sMessage" : "배달완료를 확정하였습니다.",
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



		// 현제 리스트가 스켄이 되어있는지 체크
		// 스캔 했으면 true, 안했으면 false
		chkScanYn : function(inv_no){
			if(!smutil.isEmpty(inv_no) && $('#'+inv_no).length > 0){
				return !($('#'+inv_no).children(".baedalBox").is(".off"));
			}
			else {
				return false;
			}
		},



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
		
		//현재 활성화 구역코드 리턴
		returnAreaCd : function(){
			var timeLst = $("li[name='timeLstLi']");

			//현제 어느 탭에 있는지 상태체크
			var btnObj;
			var mbl_dlv_area;
			_.forEach(timeLst, function(obj, key) {
				btnObj = $(obj);

				if(btnObj.is('.on')){
					mbl_dlv_area = btnObj.data('timeLi');
					return false;
				}
			});
			return mbl_dlv_area;
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
							$('#pop2Txt2').html('스캔된 데이터 '+scancnt+'건<br />배달완료를 전송합니다.');
							$('.mpopBox.pop2').bPopup();
						}
						else{
							LEMP.Window.toast({
								"_sMessage":"스캔한 데이터가 없습니다.",
								'_sDuration' : 'short'
							});
//							LEMP.Window.alert({
//								"_sTitle":"배달완료 전송오류",
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
			var cldl_sct_cd = "D";			// 배달업무
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
					&& !phoneNum1.LPStartsWith("050")
				) &&
				(
					!phoneNum2.LPStartsWith("010")
					&& !phoneNum2.LPStartsWith("011")
					&& !phoneNum2.LPStartsWith("016")
					&& !phoneNum2.LPStartsWith("017")
					&& !phoneNum2.LPStartsWith("050")
				)
			){
				returnNum = phoneNum1;
			}
			// phoneNum1 가 핸드폰 번호인경우 phoneNum1 셋팅
			else if(phoneNum1.LPStartsWith("010")
							|| phoneNum1.LPStartsWith("011")
							|| phoneNum1.LPStartsWith("016")
							|| phoneNum1.LPStartsWith("017")
							|| phoneNum1.LPStartsWith("050")
			){
				returnNum = phoneNum1;
			}
			else if(!smutil.isEmpty(phoneNum2)){
				returnNum = phoneNum2;
			}

			return returnNum;

		}
};

