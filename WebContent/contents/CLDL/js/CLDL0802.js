LEMP.addEvent("backbutton", "page.callbackBackButton");		// 뒤로가기 버튼 클릭시 이벤트
var page = {
	signInvNo : null,
	is_reload : null,
	dlvyCompl : null,
	scanParam : null,			// 스캔완료한 송장파라메터 집하
	param_list : [],			// 미집하/배달 전송할 송장 리스트
	changeTimeInvNo : null,		// 시간 변경을 선택한 invNo
	changeTimeSctCd : null,		// 시간 변경을 선택한 송장의 배달, 집하코드
	reqAcptRgstInvNo : null,	// 인수자 변경을 선택한 송장번호
	order : "01",				// 배달완료 정렬방식
	resData : null,				// 배달완료 정렬데이타
	acdTypYn: "N",         //화물사고 팝업 유무
	init:function(arg)
	{
		page.cldl0802 = arg.data.param;
		page.dlvyCompl = LEMP.Properties.get({
			"_sKey" : "autoMenual"
		});

		var curDate = page.cldl0802.base_ymd;
		if(smutil.isEmpty(page.cldl0802.base_ymd)) {
			curDate = new Date();
			curDate = curDate.getFullYear() + "." + ("0"+(curDate.getMonth()+1)).slice(-2) + "." + ("0"+curDate.getDate()).slice(-2);	
		} else {
			curDate = curDate.substr(0,4) + "." + curDate.substr(4,2) + "." + curDate.substr(6,2); 
		}		
		$('#cldlBtnCal').text(curDate);
		
		// 배달완료 정렬방식 세팅
		page.order = LEMP.Properties.get({"_sKey":"order"});
		if(smutil.isEmpty(page.order)){
			page.order = "01";
		}

        if (page.order == "01") {
            //$("#select_order").text("");
            $("#select_order").data("value", "01");
            $("#select_order").attr("class", "cldl1D sort1");
		} else {
            //$("#select_order").text("");
            $("#select_order").data("value", "02");
            $("#select_order").attr("class", "cldl1D sort2");
		}
		//page.getLocation();
		page.initEvent();
		page.initDpEvent();			// 화면 디스플레이 이벤트
	}	
	,cldl0802:{}	
	,apiParam : {
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
		data:{				// api 통신용 파라메터
			"parameters" : {}
		}
	}
	// 화면 디스플레이 이벤트
	, initDpEvent : function(){
		if(page.cldl0802.step_sct_cd == "0" || page.cldl0802.step_sct_cd == "1") {
			if (!_.isUndefined(page.dlvyCompl)) {
	            // 구역별 시간별
			    if(page.dlvyCompl.area_sct_cd == "Y") {
	                /*$("#setDlvyCom1").text('구역');
	                $("#setDlvyCom1").attr('class', 'red badge option outline');*/

					page.cldl0802.mbl_dlv_area = page.cldl0802.sbox_type_cd;
					page.cldl0802.cldl_tmsl_cd = "";
		        } else {
	                /*$("#setDlvyCom1").text('시간');
	                $("#setDlvyCom1").attr('class', 'green badge option outline');*/
	
					page.cldl0802.mbl_dlv_area = "";
					page.cldl0802.cldl_tmsl_cd = page.cldl0802.sbox_type_cd;
		        }
				
	            // 자동전송 여부
				/*if(page.dlvyCompl.area_sct_cd2 == "A") {
					$("#setDlvyCom2").text('자동');
					$("#setDlvyCom2").attr('class', 'blue badge option outline');
				} else {
					$("#setDlvyCom2").text('수동');
	                $("#setDlvyCom2").attr('class', 'gray2 badge option outline');
				}*/
				
				//$("#setDlvyCom3").text('' + page.cldl0802.sbox_type_cd + ' ' ); //testdev나중에 없앨것
			} else {
				page.cldl0802.mbl_dlv_area = "";
				page.cldl0802.cldl_tmsl_cd = "";
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

		$(".cldl3tmsl").hide();
		if(page.cldl0802.step_sct_cd == '1'){			
			$(".deliveryTy3Cal").css({"margin-top": "179px"});
			
			$('#headnm').text("집배달 완료");
			$('#chkAllSpan').show();
			//$(".cldl0").hide();
			$(".cldl3").hide();
			if(page.cldl0802.cldl_sct_cd == 'P'){
				$(".cldl1P").show();	
				$(".cldl1D").hide();
			} else {
				$(".cldl1D").show();
				$(".cldl1P").hide();
			}
		} else {
			$(".deliveryTy3Cal").css({"margin-top": "177px"});
			
			$('#chkAllSpan').hide();
			$(".cldl1P").hide();
			$(".cldl1D").hide();
			if(page.cldl0802.step_sct_cd == '0'){
				$('#headnm').text("집배달 출발");
				//$(".cldl0").show();
				$(".cldl3").hide();
			} else {
				$('#headnm').text("집배달 예정");
				//$(".cldl0").hide();
				$(".cldl3").show();
				
				if (!_.isUndefined(page.dlvyCompl) && page.dlvyCompl.area_sct_cd != "Y") {
					$(".cldl3tmsl").show();
				}
			}
		}
	}
	// 이벤트 등록 함수
	,initEvent : function()
	{
		//닫기
		$(document).on("click",".btn.closeW.paR",function(){
			page.callbackBackButton();
		});
		
		/* 제스처 */
		//var thisN = ".baedalListBox .txtBox .invListBox  > ul > li > .baedalBox"; //.tabInvDetail > ul > li > .baedalBox
		var thisN = ".baedalListBox > ul > li > .baedalBox";
		var thisW = 0;
		var thisC = 0;
		var thisPid = "";
		$(document).on("click, touchstart", thisN,function(e){
			$(thisN).swipe({
				triggerClick:false,
				preventDefault:false,
				onStart:function(onThis){
					thisC = $(onThis).parent().index();
					thisW = $(onThis).parent().find(".btnBox").width();
					thisPid = $(onThis).parent().attr("id");
				},
				swipeRight:function(){
					$(thisN).animate({left:0},250,'easeOutCubic');
					//$(thisN).parent().parent().children().eq(thisC).children(".baedalBox").stop().animate({left:thisW},400,'easeOutQuart');
					$("#"+thisPid).children(".baedalBox").stop().animate({left:thisW},400,'easeOutQuart');
				},
				swipeLeft:function(){
					$(thisN).animate({left:0});
				}
			});
		});
		$(thisN).trigger("click");
		/* //제스쳐 */

		/* 체크박스 전체선택 */
		$("#checkall").click(function(){
			if($("#checkall").prop("checked")){
				$("input[name=chkInvP]").prop("checked",true);
				$("input[name=chkInvD]").prop("checked",true);
			}else{
				$("input[name=chkInvP]").prop("checked",false);
				$("input[name=chkInvD]").prop("checked",false);
			}
		});

		//상단탭
		$(".lstSchBtn").click(function(){
			var pick_sct_cd = $(this).data('pickSctCd');		// 선택한 탭의 값 (P,D)
			page.cldl0802.cldl_sct_cd = pick_sct_cd;
			// 텝에따라 업무구분 선택박스 처리
			if(page.cldl0802.step_sct_cd == '1'){ //완료(집하/배달)
				//$(".cldl0").hide();
				$(".cldl3").hide();
				if(pick_sct_cd == 'D'){
					$(".cldl1P").hide();
					$(".cldl1D").show();	
				} else {
					$(".cldl1P").show();
					$(".cldl1D").hide();
				}
			}
			else{
				$(".cldl1P").hide();
				$(".cldl1D").hide();
				if(page.cldl0802.step_sct_cd == '0'){
					//$(".cldl0").show();
					$(".cldl3").hide();
				} else {
					//$(".cldl0").hide();
					$(".cldl3").show();					
				}
			}
			
			if(pick_sct_cd == 'D'){
				$('#invDetailP').hide();
				$('#invDetailD').show();	
			} else {
				$('#invDetailP').show();
				$('#invDetailD').hide();
			}
			

		 	// 운송장보기 집하 배달 탭 표시처리
			var btnLst = $(".lstSchBtn");
			var btnObj;
			_.forEach(btnLst, function(obj, key) {
				btnObj = $(obj);
				if(pick_sct_cd == btnObj.data('pickSctCd')){
					btnObj.closest('li').addClass( 'on' );
				}
				else{
					btnObj.closest('li').removeClass( 'on' );
				}
			});
			
			page.invDtl();			// 리스트 재조회
		});
		
		// 배달완료 정렬방식 변경
		$("#select_order").click(function(e) {

		   if ($(this).data("value") == "01") {
		      //$("#select_order").text("역순");
              $("#select_order").data("value", "02");
              $("#select_order").attr("class", "cldl1D sort2");//mgl15 selBox
           } else {
              //$("#select_order").text("정렬");
              $("#select_order").data("value", "01");
              $("#select_order").attr("class", "cldl1D sort1");
           }

            var selOrder =  $(this).data("value");
			LEMP.Properties.set({"_sKey" : "order", "_vValue" : selOrder});
			page.order = selOrder;

			page.invDtl();					// 리스트 정렬
		});
		//2023.04.04 
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
		
		// 업무구분 클릭한 경우
		$("#cldl_tmsl_cd").click(function(){
			
			var tab_sct_cd = page.returnTabSctCd();
			
			if(tab_sct_cd == 'D') {
				$("select[name=cldl_tmsl_cd] option[value='38']").prop('disabled', false);//제주 익일 활성화
			} else if(tab_sct_cd == 'P') {
				$("select[name=cldl_tmsl_cd] option[value='38']").prop('disabled', true);//제주 익일 비활성화
			}
		});
		
		//////////////////
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
					var popnm = 'CLDL.CLDL0203';	// 배달 팝업
					if(sctCd == "P"){		// 집하 팝업
						popnm = 'CLDL.CLDL0202';
					} 
					
					popUrl = smutil.getMenuProp(popnm, 'url');

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
		
		
		// 인수자 설정 버튼 클릭
		$(document).on('click', '.insuja2', function(e){
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
			page.sendSms();
		});
		
		$('.btn.ftImg').click(function(e){
			page.sendPhotoMms();		// 사진촬영 로직 호출
		});
		
		// 미집하 사유
		$("#cancleP").click(function(){
			let param_list = [];						// 전송할 리스트 배열
			let invNoObj = {};

			$("input[name=chkInvP]:checked").each(function() {
				var inv_no = ($(this).attr("id")).replace('_chk', '');
				var scan_yn = page.chkScanYn(inv_no);
				var corp_sct_cd = $(this).data('corpSctCd');
				corp_sct_cd = smutil.nullToValue(corp_sct_cd,"") + "";
				if(!smutil.isEmpty(inv_no)){
					var scan_yn = page.chkScanYn(inv_no);
					invNoObj = {"inv_no":inv_no, "scan_yn":scan_yn, "cldl_sct_cd" : "P","corp_sct_cd":corp_sct_cd};
					param_list.push(invNoObj);
				}
				else{
					return false;
				}
			});
					
			if(param_list.length > 0){ 
				page.param_list = param_list;
				// 스캔된 데이터만 미배달 처리 가능
				var popUrl = smutil.getMenuProp("COM.COM0701","url");
	
				LEMP.Window.open({
					"_sPagePath":popUrl,
					"_oMessage" : {
						"param" : {
							"menu_id":"CLDL0301"
							, "inv_no":param_list[0].inv_no+""
							, "cldl_sct_cd" : "P"
							, "corp_sct_cd" : param_list[0].corp_sct_cd+""
						}
					}
				});
			} else {
				LEMP.Window.toast({
					"_sMessage":"미회수할 데이터가 없습니다.\n체크박스를 선택해주세요.",
					'_sDuration' : 'short'
				});
 
				return false;
			}
		
		});
		
		// 미배달 사유
		$("#cancleD").click(function(){
			let param_list = [];						// 전송할 리스트 배열
			let invNoObj = {};
			var inv_no = "";

			$("input[name=chkInvD]:checked").each(function() {
				inv_no = ($(this).attr("id")).replace('_chk', '');
				var scan_yn = page.chkScanYn(inv_no);
				if(!smutil.isEmpty(inv_no)){
					var scan_yn = page.chkScanYn(inv_no);
					invNoObj = {"inv_no":inv_no, "scan_yn":scan_yn,"cldl_sct_cd":"D"};
					param_list.push(invNoObj);
				}
				else{
					return false;
				}
			});
				
			if(param_list.length > 0){ 
				page.param_list = param_list;
				// 스캔된 데이터만 미배달 처리 가능
				var popUrl = smutil.getMenuProp("COM.COM0701","url");

				LEMP.Window.open({
					"_sPagePath":popUrl,
					"_oMessage" : {
						"param" : {
							"menu_id":"CLDL0401"
							, "inv_no":inv_no
							, "cldl_sct_cd" : "D"
						}
					}
				});
								
			} else {
				LEMP.Window.toast({
					"_sMessage":"미배송할 데이터가 없습니다.\n체크박스를 선택해주세요.",
					'_sDuration' : 'short'
				});
 
				return false;
			}

		});
		 
		// 스캔취소 버튼 누른경우 이벤트
		$(document).on('click', '.btn.cancel', function(e){
	
			var inv_no = $(this).data('cancelInvNo');
			var cldl_sct_cd = $(this).data('cancleSctCd');
			var cldl_tmsl_cd = page.returnTimeCd();
	
			if(!_.isUndefined(page.dlvyCompl.area_sct_cd) && page.dlvyCompl.area_sct_cd == 'Y'){
				cldl_tmsl_cd = $(this).data('cancleTmslCd');
			}else{
				cldl_tmsl_cd = page.returnTimeCd();
			}
	
			// 송장번호가 있고 스캔된 데이터인지 체크
			if(!smutil.isEmpty(inv_no)
				&& page.chkScanYn(inv_no)
				&& !smutil.isEmpty(cldl_sct_cd)){
	
				// 스캔 취소 전문 호출
				page.cmptScanCcl(inv_no, cldl_sct_cd, cldl_tmsl_cd);  // 스캔취소호출
			}
	
		});	
		// 일반집하 스캔버튼을 누른경우
		$("#scnBtnP").click(function(){

			//현제 어느 탭에 있는지 상태체크
			var cldl_tmsl_cd = page.returnTimeCd();		// 예정시간선택
			var pick_sct_cd = "G";		// 일반집하 : G, 전산집하 구분 : C
			var area_sct_cd = page.dlvyCompl.area_sct_cd;	//구역(Y) 시간(N) 기준 
			
			// 스캔 팝업 url 호출
			var popUrl = smutil.getMenuProp('CLDL.CLDL0306', 'url');

			LEMP.Window.open({
				"_oMessage" : {
					"param" : {
						"pick_sct_cd" : pick_sct_cd,
						"cldl_tmsl_cd" : cldl_tmsl_cd,
						"area_sct_cd" : area_sct_cd,
						"menu_id" : "CLDL0802"
					}
				},
				"_sPagePath": popUrl
			});


		});	// end 스캔버튼을 누른경우 종료
			
		// 하단 스캔버튼을 누른경우
		$("#scnBtnD").click(function(){

			var cldl_sct_cd = "D";						// 업무구분
			var cldl_tmsl_cd = "";						// 예정시간선택
			var mbl_dlv_area = "";						// 선택된 구역
			var max_nm = "";							// 일괄전송을 위한 max 시간 값
			var area_sct_cd = page.dlvyCompl.area_sct_cd;			//구역(Y) 시간(N) 기준 
			
			if(!_.isUndefined(page.dlvyCompl.area_sct_cd) && page.dlvyCompl.area_sct_cd == 'Y'){
				cldl_tmsl_cd = "";
				max_nm = page.returnMaxNm(); //$("li[name='timeLstLi'].on").data('maxNm');
				mbl_dlv_area = page.returnAreaCd();					
			}else{
				cldl_tmsl_cd = page.returnTimeCd();
				max_nm = "";
				mbl_dlv_area = "";
			}

			if(smutil.isEmpty(cldl_tmsl_cd) && page.dlvyCompl.area_sct_cd == 'N'){
				LEMP.Window.toast({
					"_sMessage":"예정시간을 선택해 주세요.",
					'_sDuration' : 'short'
				});

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
						"menu_id" : "CLDL0802"
					}
				},
				"_sPagePath": popUrl
			});
		});	// end 스캔버튼을 누른경우 종료
			
		// 집하배달 예정 스캔버튼을 누른경우 //2023.04.04
		$("#scnBtn3").click(function(){

			//현제 어느 탭에 있는지 상태체크
			var cldl_sct_cd = page.returnTabSctCd();
			var cldl_tmsl_cd = $('#cldl_tmsl_cd').val();		// 예정시간선택 // page.returnTimeCd();		// 예정시간선택
			var area_sct_cd = page.dlvyCompl.area_sct_cd;	//구역(Y) 시간(N) 기준 
			
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

			if(smutil.isEmpty(cldl_tmsl_cd) && page.dlvyCompl.area_sct_cd == "N"){
				LEMP.Window.toast({
					"_sMessage":"예정시간을 선택해 주세요.",
					'_sDuration' : 'short'
				}); 

				return false;
			}
			else if(cldl_tmsl_cd === '28' && smutil.isEmpty(dsgt_dd_cldl_ymd)) {
				LEMP.Window.toast({
					"_sMessage":"지정일자를 선택해 주세요.",
					'_sDuration' : 'short'
				}); 

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

		// 전송버튼
		// 집하완료 전송 버튼 클릭
		$('#cmptTrsmBtn').click(function(e){

			var scanCnt = 0;
			scanCnt = Number($('#scanLstCnt').text());

			// 배달출발 전송(전송) 컴펌창 호출
			if(scanCnt > 0){
				$('#pop2Txt1').text('집하완료 전송');
				$('#pop2Txt2').html('스캔된 데이터 '+scanCnt+'건<br />집하완료를 전송합니다.');
				$('.mpopBox.pop2').bPopup();
			}
			else{
				LEMP.Window.toast({
					"_sMessage":"스캔한 데이터가 없습니다.",
					'_sDuration' : 'short'
				});

				return ;
			}

		});


		// 배달출발확정 버튼 클릭
		$('#cmptTrsmBtnD').click(function(e){
			var _this = this;
			var cldl_sct_cd = "D";							// 업무구분
			var cldl_tmsl_cd = "";			// 예정시간코드
			var mbl_dlv_area = "";			// 선택된 구역
			var base_ymd = $('#cldlBtnCal').text();			// 기준일자
			var acpt_sct_cd = $('#insujaCode').val();		// 인수자 코드
			var acpr_nm = $('#insujaTxt').val();			// 인수자명

			if(!_.isUndefined(page.dlvyCompl.area_sct_cd) && page.dlvyCompl.area_sct_cd == 'Y'){
				cldl_tmsl_cd = "";
				mbl_dlv_area = page.returnAreaCd();
			}else{
				cldl_tmsl_cd = page.returnTimeCd();
				mbl_dlv_area = "";
			}
			
			if(smutil.isEmpty(base_ymd)){
				LEMP.Window.toast({
					"_sMessage":"날짜를 선택해 주세요.",
					'_sDuration' : 'short'
				}); 

				return false;
			}
			else if(smutil.isEmpty(acpt_sct_cd)){
				LEMP.Window.toast({
					"_sMessage":"인수자정보를 선택해 주세요.",
					'_sDuration' : 'short'
				}); 
				return false;
			}
			else if(acpt_sct_cd == "99"
					&& ($.trim(acpr_nm) == "" || smutil.isEmpty(acpr_nm))){
				LEMP.Window.toast({
					"_sMessage":"직접입력 인수자정보를 입력해 주세요.",
					'_sDuration' : 'short'
				});

				return false;
			}
			else if(smutil.isEmpty(cldl_tmsl_cd) && page.dlvyCompl.area_sct_cd == "N"){
				LEMP.Window.toast({
					"_sMessage":"배달 완료시간을 선택해 주세요.",
					'_sDuration' : 'short'
				});

				return false;
			}

			base_ymd = base_ymd.split('.').join('');

			//var liLst = $('.baedalListBox > ul > li');
			var liLst = $('#invDetailD > ul > li');
			var inv_no;									// li 에 걸려있는 송장번호
			var param_list = [];						// 전송할 리스트 배열
			var invNoObj = {};

			// 모든 li 리스트를 돌면서 스캔한 데이터와 체크박스의 체크한 데이터를 셋팅한다.
			$.each(liLst, function(idx, liObj){
				var inv_no = $(liObj).attr('id')+"";
				//var inv_no = id.substr(1);

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
				$('#pop2Txt1').text('배달완료 전송');
				$('.mpopBox.pop2').bPopup();
			}
			else{
				LEMP.Window.toast({
					"_sMessage":"전송할 데이터가 없습니다.\n송장스캔 혹은 체크박스를 선택해주세요.",
					'_sDuration' : 'short'
				});

				return ;
			}
		});

		// 집하배달출발확정 버튼 클릭 //2023.04.04
		$('#plnDprtTrsmBtn').click(function(e){

			var scanCnt = 0;
			scanCnt = Number($('#scanLstCnt3').text());
			
			//컨펌창 호출
			if(scanCnt > 0){
					$('#pop2Txt2').html('스캔된 데이터 '+scanCnt+'건<br/>집배달출발을 확정합니다.'); //<br/>확정후 출발화면으로 이동합니다.
					$('#pop2Txt1').text('출발확정');
					$('.mpopBox.pop2').bPopup();
			}
			else{
				LEMP.Window.toast({
					"_sMessage":"스캔한 데이터가 없습니다.",
					'_sDuration' : 'short'
				});
				LEMP.Window.alert({
					"_sTitle":"집배달 출발 확정 오류",
					"_vMessage":"스캔한 데이터가 없습니다.",
				});

				return ;
			}
		});
		
		// 집배달출발 전송버튼 클릭 //2023.04.04//사용안함. 지도로 이동
		$('#dprtTrsmTrsmBtn').click(function(e){
			var alarmCnt = 0;
			if(page.acdTypYn == "N") {
				alarmCnt = page.scanAlarm(); //배달전 알림 로직 추가
				page.acdTypYn = "Y";
			}
			//console.log(alarmCnt);
			
			if(alarmCnt > 0) {
				return false;
			}
			
			var base_ymd = $('#cldlBtnCal').text();
			var dprtTrsmCnt = Number(smutil.nullToValue($('#totLstCnt0').text(), "0")); //건물번호와 상관없이 전체 출발건수 가져올것
			var pop2Txt1 = '배달 출발';
			if(page.cldl0802.cldl_sct_cd == "P") {
				pop2Txt1 = '집하 출발';
			}
			//console.log('dprtTrsmCnt:::', dprtTrsmCnt);
			
			// nodata 표시인경우
            if(dprtTrsmCnt == 0 || smutil.isEmpty(dprtTrsmCnt)){
            	LEMP.Window.toast({
					"_sMessage":"전송할 데이터가 없습니다.",
					'_sDuration' : 'short'
				});

                return false;
            }
            
			if(smutil.isEmpty(base_ymd)){
				LEMP.Window.toast({
					"_sMessage":"날짜를 선택해 주세요.",
					'_sDuration' : 'short'
				}); 

				return false;
			}
			else{ // 배달출발 확정(전송) 컴펌창 호출
				$('#pop2Txt2').html(dprtTrsmCnt + '건의 '+pop2Txt1+'을 전송합니다.');
				$('#pop2Txt1').text(pop2Txt1);
				$('.mpopBox.pop2').bPopup();
			}
		});
				
		// 배달완료전송버튼 'yes' 버튼 클릭
		$('#cmptTrsmYesBtn').click(function(e){
			if(page.cldl0802.step_sct_cd == '1'){//완료
				// 배달완료 확정로직 시작
				if(page.cldl0802.cldl_sct_cd == "P") {
					page.cmptTrsmP();	
				} else {
					page.cmptTrsmD();	
				}
			} else if(page.cldl0802.step_sct_cd == '0'){//출발
				page.dprtTrsm();	
			} else {	//예정
				// 배달출발 확정로직 시작
				page.plnDprtTrsm();
			}
		});

		// 스와이프 touch start
		// 스와이프해서  통화버튼 클릭
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
				LEMP.Window.toast({
					"_sMessage":"선택된 송장번호가 없습니다.",
					'_sDuration' : 'short'
				});

			}
		});

		$(document).on('click', '.btn.bdM.blue4.bdClock.mgl1', function(e){
			
			if(page.cldl0802.cldl_tmsl_nm != '토요휴무'){  //mbl_dlv_area
				var inv_no = $(this).data('invNo')+"";
				var cldl_sct_cd = $(this).data('cldlSctCd')+"";
				page.changeTimeInvNo = inv_no;					// 시간수정을 하기위한 송장번호 전역변수로 셋팅
				page.changeTimeSctCd = cldl_sct_cd;				// 시간수정버튼을 클릭한 송장번호의 배달, 집하 구분코드 전역변수로 셋팅
	
				// 시간수정 팝업 호출
				var popUrl = smutil.getMenuProp('COM.COM0501', 'url');

				LEMP.Window.open({
					"_sPagePath":popUrl
				});
			}else{
				LEMP.Window.toast({
					"_sMessage":"토요휴무는 시간변경이 불가능합니다.",
					'_sDuration' : 'short'
				});
			}

		});


		// 스와이프해서 서명 싸인패드 호출
		$(document).on('click', '.btn.blue2.bdM.bdSign.mgl1', function(e){
			var inv_no = $(this).data('invNo')+"";//alert('서명 싸인패드 기능 준비중');
			var cldl_sct_cd = $(this).data('cldlSctCd');
			var chksyn = page.chkScanYn(inv_no);
			//alert("chkScanYn: " + chksyn);
			if(chksyn){
				page.signInvNo = inv_no;
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
			}

		});
		
		// 기사메모 팝업 호출
		$(document).on('click', '.btn.bdM.blue2.bdMemo.mgl1, .btn.bdM.blue4.bdMemo.mgl1', function(e){
			var inv_no = $(this).data('invNo')+"";				// 송장번호
			if(smutil.isEmpty(inv_no)){
				LEMP.Window.toast({
					"_sMessage":"송장번호가 없습니다.\n관리자에게 문의해주세요.",
					'_sDuration' : 'short'
				});

				return false;
			}				
			// 스캔된 데이터만 메모 가능
			//if(_this.chkScanYn(inv_no)){
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
		 
		// 미집하, 미배달 처리
		$(document).on('click', '.btn.bdM.blue3.bdCancle.mgl1, .btn.bdM.blue5.bdCancle.mgl1', function(e){
			var inv_no = $(this).data('invNo');
			var cldl_sct_cd = $(this).data('cldlSctCd') + "";
			var corp_sct_cd = $(this).data('corpSctCd');
			corp_sct_cd = smutil.nullToValue(corp_sct_cd,"") + "";
			var menu_id = "";

			if(!smutil.isEmpty(inv_no)){
				if(cldl_sct_cd === "P"){	// 집하
					menu_id = "CLDL0301";
				}
				else{	// 배달
					menu_id = "CLDL0401";
				}
								
				// 스캔된 데이터만 미배달 처리 가능
//				if(_this.chkScanYn(inv_no)){
					var popUrl = smutil.getMenuProp("COM.COM0701","url");

					LEMP.Window.open({
						"_sPagePath":popUrl,
						"_oMessage" : {
							"param" : {
								"menu_id":menu_id
								, "inv_no":inv_no+""
								, "cldl_sct_cd" : cldl_sct_cd
								, "corp_sct_cd" : corp_sct_cd
							}
						}
					});
			}
		});

		// 스와이프해서 스캔버튼 클릭한 경우
		$(document).on('click', '.btn.blue6.bdM.bdScan.mgl1', function(e){
			var inv_no = $(this).data('invNo');
			var cldl_sct_cd = $(this).data('cldlSctCd');
			inv_no = inv_no+"";
			//alert('scan1: ' + inv_no);
			if(!smutil.isEmpty(inv_no)){
				inv_no = inv_no.split('-').join('');
				var result = {"barcode" : inv_no};
				page.scanCallback(result); //스캔 기능 확인
			}
			else{
				LEMP.Window.toast({
					"_sMessage":"송장번호가 없습니다.",
					'_sDuration' : 'short'
				});

				return false;
			}
		});
 
		// 스와이프해서 이동경로버튼 클릭한 경우
		$(document).on('click', '.btn.blue7.bdM.bdRoute.mgl1', function(e){
			if(smutil.isEmpty(page.cldl0802.curlgtd) || smutil.isEmpty(page.cldl0802.curlttd)){
				LEMP.Window.toast({
					"_sMessage":"GPS(핸드폰 위치 서비스) 설정 바랍니다.",
					'_sDuration' : 'short'
				});
				return;
			}
			
			if(!smutil.isEmpty(page.cldl0802.lgtd) && !smutil.isEmpty(page.cldl0802.lttd)){
				var routeUrl="https://map.kakao.com/link/to/도착지,"+ page.cldl0802.lttd + "," + page.cldl0802.lgtd;
				//var routeUrl = "kakaomap://route?"+"sp="+page.lgtd + "," + page.lttd+"&ep="+page.cldl0802.lgtd + ","+page.cldl0802. page.cldl0802.lttd+"&by=CAR"; 
				//alert(routeUrl);
				
				LEMP.System.callBrowser({
					"_sURL" : routeUrl
				});				
			}
			else{
				LEMP.Window.toast({
					"_sMessage":"도착지정보가 없습니다.",
					'_sDuration' : 'short'
				});

				return false;
			}
		});	
		
		// 스와이프 touch end
		
		
		// ###################################### handlebars helper 등록 start		
		// check박스 필요여부 잽배완료,배달완료시 true - 예정, 출발에서도 checkbox 사용
		Handlebars.registerHelper('isChk', function(options) {
			return options.fn(this);
			/*if(page.cldl0802.step_sct_cd == '1'){
				return options.fn(this)
			}
			else{	
				return options.inverse(this);
			}*/
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
			} else {
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
		
		// 집하, 배달 구분(집하 = if true, 배달은=else)
		Handlebars.registerHelper('cldlSctCdChkTag', function(options) {

			var html = "";
			var phoneNumber = "";
			var span = "";
			
			if(page.cldl0802.step_sct_cd == '0'){	//출발
				if(this.cldl_sct_cd === "P"){	// 집하
					if(!smutil.isEmpty(this.snper_nm)){
						html = html + '<li class="name">' + this.snper_nm + '</li>';
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
						html = html + '<li class="name">' + this.acper_nm + '</li>';
					}

					var acper_tel = smutil.nullToValue(this.acper_tel,"");
					var acper_cpno = smutil.nullToValue(this.acper_cpno,"");

					phoneNumber = page.getCpNo(acper_tel, acper_cpno);

					if(!smutil.isEmpty(phoneNumber)){
						html = html + '<li>' + phoneNumber + '</li>';
					}

				}
				
				if(page.dlvyCompl.area_sct_cd == 'Y' && !smutil.isEmpty(this.cldl_tmsl_nm)){
					html = html + '<li><span style="padding: 0px 5px; font-size: 10px; color: #fff; border: 1px solid #015182; background-color: #015182; border-radius: 20px;">' + (this.cldl_tmsl_nm).replace('시', '') + '</span></li>'
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
			}
			else if(page.cldl0802.step_sct_cd == '1'){	//완료	
				if(this.cldl_sct_cd === "P"){	// 집하
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
				} else {
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
							if(page.dlvyCompl.area_sct_cd == 'Y'){
								html = html + '<li style="display: inline-block; position: absolute;" id="reqAcptSctCd_'+this.inv_no+'" data-req-acpt-sct-cd='+this.req_acpt_sct_cd+'><span class="tGreenBold">' + this.req_acpr_nm + '</span></li>';
							}else{
								html = html + '<li style="display: inline-block; position: absolute;" id="reqAcptSctCd_'+this.inv_no+'" data-req-acpt-sct-cd='+this.req_acpt_sct_cd+'><span class="tGreenBold">' + this.req_acpr_nm + '</span></li>';							
							}
						}
						else if(this.req_acpt_rgst_sct_cd == "02"){		// 기사변경
							html = html + '<li style="display: inline-block; position: absolute;" id="reqAcptSctCd_'+this.inv_no+'" data-req-acpt-sct-cd='+this.req_acpt_sct_cd+' ><span class="tRed">' + this.req_acpr_nm + '</span></li>';
						}
					}
	 
				}
			}
			else {
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
			}
			



			if(!smutil.isEmpty(html)){
				html = '<div class="infoList"><ul>' + html + '</ul></div>';
			}

			return new Handlebars.SafeString(html); // mark as already escaped
		});
		
		Handlebars.registerHelper('cldlSctNm', function(options) {
			var result = "";
			if(this.cldl_sct_cd === "P"){	// 집하
				return '집하';
			}
			else{	// 배달
				return '배달';
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


		// 화물사고시 사고유형 버튼 표시
		Handlebars.registerHelper('setAcdTyp', function(options) {
			var html = '';
			if(page.cldl0802.step_sct_cd == '0'){ //cldl201
				if(this.acd_typ_cd === "10"){	// 분실
					html = '<span class="badge gray s outline">분실</span>';
				}
				else if(this.acd_typ_cd === "30"){	// 파손
					html = '<span class="badge gray s outline">파손</span>';
				}
				else if(this.acd_typ_cd === "60"){	// 반품
					html = '<span class="badge gray s outline">반품</span>';
				}
			}
			return new Handlebars.SafeString(html);
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
		
		// 의류특화일경우 보조송장 등록버튼 표시
		Handlebars.registerHelper('setSubBoxBtn', function(options) {
			if(!smutil.isEmpty(this.svc_cd) && this.svc_cd == "01"){
				var html = '';
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

		// 전화번호가 있으면 전화걸기 버튼 리턴하고 없으면 버튼 리턴 안함 (집하 = 보낸사람, 배달 = 받는사람)
		Handlebars.registerHelper('setPhoneNumber', function(options) {
			var telNum, per_tel, per_cpno;
			if(this.cldl_sct_cd === "P"){	// 집하
				per_tel = smutil.nullToValue(this.snper_tel,"");
				per_cpno = smutil.nullToValue(this.snper_cpno,"");
			}
			else{	// 배달
				per_tel = smutil.nullToValue(this.acper_tel,"");
				per_cpno = smutil.nullToValue(this.acper_cpno,"");
			}

			telNum = page.getCpNo(per_tel, per_cpno);

			if(!smutil.isEmpty(telNum)){
				var html = '<button class="btn bdM blue bdPhone" data-phone-number="'+telNum+'">전화</button>';
				return new Handlebars.SafeString(html); // mark as already escaped
			}
			else{
				return '';
			}
		});

		// 배달단계별 버튼 (집하운송장번호버튼)
		Handlebars.registerHelper('setRsnRgstBtnP', function(options) {
			var html = '';
			if(page.cldl0802.step_sct_cd == '0'){ //cldl201
				html = '<button class="btn bdM blue4 bdClock mgl1" data-inv-no="'+this.inv_no+'" data-cldl-sct-cd="'+this.cldl_sct_cd+'">시간수정</button>';
			}
			else if(page.cldl0802.step_sct_cd == '1'){ //cldl301
				html = '<button class="btn bdM blue3 bdCancle mgl1" data-inv-no="'+this.inv_no+'" data-corp-sct-cd="'+this.corp_sct_cd+'" data-cldl-sct-cd="'+this.cldl_sct_cd+'">미집하</button>';
			}
			else{	//step 예정 
				html = '<button class="btn bdM blue3 bdCancle mgl1" data-inv-no="'+this.inv_no+'" data-corp-sct-cd="'+this.corp_sct_cd+'" data-cldl-sct-cd="'+this.cldl_sct_cd+'">미집하</button>';
			}
			return new Handlebars.SafeString(html);
		});
		// 배달단계별 버튼 (배달운송장번호버튼)
		Handlebars.registerHelper('setRsnRgstBtnD', function(options) {
			var html = '';
			if(page.cldl0802.step_sct_cd == '0'){ //cldl201
				html = '<button class="btn bdM blue2 bdMemo mgl1" data-inv-no="'+this.inv_no+'" data-cldl-sct-cd="'+this.cldl_sct_cd+'">메모</button>'
					 + '<button class="btn bdM blue3 bdMic mgl1" data-inv-no="'+this.inv_no+'" data-cldl-sct-cd="'+this.cldl_sct_cd+'">희망인수자</button>'
				 	 + '<button class="btn bdM blue4 bdClock mgl1" data-inv-no="'+this.inv_no+'" data-cldl-sct-cd="'+this.cldl_sct_cd+'">시간수정</button>';
			}
			else if(page.cldl0802.step_sct_cd == '1'){  //cldl401
				html = '<button class="btn blue2 bdM bdSign mgl1" data-inv-no="'+this.inv_no+'" data-cldl-sct-cd="'+this.cldl_sct_cd+'">서명</button>'
					 + '<button class="btn blue4 bdM bdMemo mgl1" data-inv-no="'+this.inv_no+'" data-cldl-sct-cd="'+this.cldl_sct_cd+'">메모</button>'
				     + '<button class="btn blue5 bdM bdCancle mgl1" data-inv-no="'+this.inv_no+'" data-cldl-sct-cd="'+this.cldl_sct_cd+'">미배달</button>'
				 	 + '<button class="btn blue6 bdM bdScan mgl1" data-inv-no="'+this.inv_no+'" data-cldl-sct-cd="'+this.cldl_sct_cd+'">스캔</button>';			
			}
			else{	//step 예정 
				html ='<button class="btn bdM blue2 bdMemo mgl1" data-inv-no="'+this.inv_no+'" data-cldl-sct-cd="'+this.cldl_sct_cd+'">메모</button>'
				    + '<button class="btn bdM blue3 bdCancle mgl1" data-inv-no="'+this.inv_no+'" data-corp-sct-cd="'+this.corp_sct_cd+'" data-cldl-sct-cd="'+this.cldl_sct_cd+'">미배달</button>';
			}
			return new Handlebars.SafeString(html);
		});
		// ###################################### handlebars helper 등록 end
		
						
		
		//이전페이지에서 넘겨받은 운송장번호들로 호출한 데이터를 출력
		//page.invDtl();
		if(page.cldl0802.cldl_sct_cd == 'P'){  
			$(".tabBox").find("li:eq(0)").trigger("click");
		} else {
			$(".tabBox").find("li:eq(1)").trigger("click");
		}		
	}
	
	, listReLoad : function(){
		page.is_reload = true;
		page.invDtl();				// 리스트 재조회
	}
	
	//건물번호로 운송장목록 조회
	,invDtl:function(){
		var data = {};
		data.base_ymd   = page.cldl0802.base_ymd;
		data.step_sct_cd= page.cldl0802.step_sct_cd;
		data.cldl_sct_cd= page.cldl0802.cldl_sct_cd;
		//data.cldl_sct_cd= 'A';
		data.bld_mgr_no	= page.cldl0802.bld_mgr_no;
		data.sbox_type= page.cldl0802.sbox_type;
		data.sbox_type_cd= smutil.nullToValue(page.cldl0802.sbox_type_cd, "");		
		data.cldl_tmsl_null= "";
		if(smutil.isEmpty(data.sbox_type_cd )) data.cldl_tmsl_null = "true";
		data.max_tmsl= smutil.nullToValue(page.cldl0802.max_tmsl, "");
		data.min_tmsl= smutil.nullToValue(page.cldl0802.min_tmsl, "");
			
		smutil.loadingOn();		// 로딩바 열기
		
		page.apiParam.param.baseUrl = "smapis/cldl/invDetailList";
		page.apiParam.param.callback = "page.invDtlCallback";
		page.apiParam.data.parameters = data;
		
		// 공통 api호출 함수 
		smutil.callApi(page.apiParam);
	}
		
	
	//상세화면 콜백
	, invDtlCallback : function(res){
		try{
			$('#checkall').prop("checked",false);
			
			var template = Handlebars.compile($("#cldl0802_li_template").html());
			var templateD = Handlebars.compile($("#cldl0802_li_templateD").html());

			if (res.data_count !== 0 && smutil.apiResValidChk(res) && res.code==="0000") { 

				var resData = res.data;
				if(page.cldl0802.cldl_sct_cd == "P") {
					$('#cldl0802LstUl').html(template(resData));
				} else {
					if(page.order == "02"){
						resData.listD.reverse();
					}
					
					$('#cldl0802LstUlD').html(templateD(resData));
				}			
								
				var tot = 0, totD = 0, scanLstCnt=0, scanLstCntD = 0;
				if(resData.list.length > 0) {					
					tot = smutil.nullToValue((resData.list[0].tot),0);
					scanLstCnt = smutil.nullToValue((resData.list[0].scan_cnt),0);
				}					
				if(resData.listD.length > 0) {					
					totD = smutil.nullToValue((resData.listD[0].tot),0);
					scanLstCntD = smutil.nullToValue((resData.listD[0].scan_cnt),0);
				}
				page.resData = resData;
				$('#cldlPcnt').text('집하 '+tot+'건');
				$('#cldlDcnt').text('배달 '+totD+'건');
				$('#scanLstCnt').text(scanLstCnt);
				$('#scanLstCntD').text(scanLstCntD);
				$('#P_cldl0101Cnt').text(tot);
				$('#D_cldl0101Cnt').text(totD);
				$('#A_cldl0101Cnt').text(tot+totD);
				
				var scanLstCnt3 = 0, tot0 = 0;				
				if(page.cldl0802.step_sct_cd == '3'){//예정
					if(page.cldl0802.cldl_sct_cd == "P") {
						scanLstCnt3 = scanLstCnt;
					} else {
						scanLstCnt3 = scanLstCntD;
					}
					$('#scanLstCnt3').text(scanLstCnt3);
					
					page.codeListSerch();			// 예정시간리스트 조회 
				} /*else if(page.cldl0802.step_sct_cd == '0') { //출발
					var scan_cnt = smutil.nullToValue((resData.scan_cnt),0);
					$('#totLstCnt0').text(scan_cnt);
				}*/
				
				
				//$('#cldl0802LstUlD').html(templateD(resData));
				
				/*if(resData.list.length == 0) {
					$(".tabBox").find("li:eq(1)").trigger("click");
				}*/
			} else {
				//alert('데이터가 없습니다.');
				if(page.cldl0802.cldl_sct_cd == "P") {
					$('#cldl0802LstUl').html(template(res.data));	
				} else {
					$('#cldl0802LstUlD').html(templateD(res.data));
				}
				$('#cldlPcnt').text('집하 0건');
				$('#cldlDcnt').text('배달 0건');
				$('#scanLstCnt').text(0);
				$('#scanLstCntD').text(0);
				$('#scanLstCnt3').text(0); //예정
				//$('#totLstCnt0').text(0); //출발
				$('#P_cldl0101Cnt').text(0);
				$('#D_cldl0101Cnt').text(0);
				$('#A_cldl0101Cnt').text(0);
				
			}
			page.acdTypYn = "N"; //재조회시 팝업 유무 초기화
		}
		catch(e){}
		finally{
			smutil.loadingOff();			// 로딩바 닫기
		}
	},
	
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

		//page.plnCnt();		// 집배달 리스트 카운트 조회
	},
	// ################### 예정시간 리스트 조회 end
	//////////////////////////////////
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
	
	,
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
		}
		else{

			LEMP.Window.toast({
				"_sMessage":smutil.nullToValue(result.message,''),
				'_sDuration' : 'short'
			});
		}

		page.apiParamInit();			// 파라메터 전역변수 초기화
	}
	// ################### 서명이미지 저장 처리 end


	// ################### 일괄 미배달 전송 start
	, sendRsnRgstTxt : function (){
		page.apiParamInit();		// 파라메터 전역변수 초기화

		if(!smutil.isEmpty(page.param_list) && !smutil.isEmpty(page.dlay_rsn_cd)){

			if(!smutil.isEmpty(page.rsn_cont)){
				page.rsn_cont = page.rsn_cont.split('.').join('');
			}

			//미배달 api 호출,
			page.apiParam.id = 'HTTP'
			page.apiParam.param.baseUrl = "smapis/cmn/rsnRgstTxtPkg";				// api no
			page.apiParam.param.callback = "page.rsnRgstCallback";			// callback methode
			page.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {
					"cldl_sct_cd" : "D",		// 업무구분 배달 D로 고정
					"dlay_rsn_cd" : page.dlay_rsn_cd,		// 미배달 사유 코드
					"rsn_cont" : page.rsn_cont,				// 미배달 사유 date
					"param_list" : page.param_list
				}
			};

			smutil.loadingOn();			// 로딩바 on
			// 공통 api호출 함수
			smutil.callApi(page.apiParam);
		}
		else {
			LEMP.Window.toast({
				"_sMessage":"선택한 미배달 송장번호 혹은 \n미배달 사유가 없습니다.",
				'_sDuration' : 'short'
			});

			return false;
		}
	}
	// ################### 일괄 미배달 전송end
		
	// ################### 미배달 전송 start
	// 미집하/미배달 사유 선택후 callback
	, com0701Callback : function(res){
		page.apiParamInit();		// 파라메터 초기화

		var inv_no = smutil.nullToValue(res.param.inv_no,"");			// 미집하/미배달 선택한 송장번호
		inv_no = inv_no+"";					// 송장번호 문자로처리
		var cldl_sct_cd = smutil.nullToValue(res.param.cldl_sct_cd,"");	// 배달업무
		var dlay_rsn_cd = smutil.nullToValue(res.param.code,"");	// 미배달 사유 코드
		var rsn_cont = smutil.nullToValue(res.param.value,"");		// 미배달 사유 date
		var filepath = smutil.nullToValue(res.param.images,"");			// 집하일경우  취급불가 비규격 사진파일
		
		if(!smutil.isEmpty(inv_no) && !smutil.isEmpty(dlay_rsn_cd)){

			var liDiv = $('#'+inv_no).children('.baedalBox');

			if(!smutil.isEmpty(rsn_cont)){
				rsn_cont = rsn_cont.split('.').join('');
			}
			
			page.apiParam.id = "HTTP";
			page.apiParam.param.baseUrl = "smapis/cmn/rsnRgstTxt";				// api no			
			// 이미지 있을경우
			if(!smutil.isEmpty(filepath) && cldl_sct_cd == "P"){
				page.apiParam.id = "HTTPFILE";
				page.apiParam.param.baseUrl = "smapis/cmn/rsnRgst";				// api no
				page.apiParam.files = [filepath];
			}
			
			//미배달 api 호출
						
			//page.apiParam.id = 'HTTP'
			//page.apiParam.param.baseUrl = "smapis/cmn/rsnRgstTxt";				// api no
			page.apiParam.param.callback = "page.rsnRgstCallback";			// callback methode
			
			
			if(!smutil.isEmpty(page.param_list)){ //일괄전송
				page.apiParam.id = "HTTP";
				page.apiParam.param.baseUrl = "smapis/cmn/rsnRgstTxtPkg";				// api no
			}
						
			page.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {
					"inv_no" : inv_no+"",				// 송장번호
					"cldl_sct_cd" : cldl_sct_cd,		// 업무구분
					"dlay_rsn_cd" : dlay_rsn_cd,		// 미배달 사유 코드
					"param_list" : page.param_list,
					"rsn_cont" : rsn_cont,				// 미배달 사유 date
					"base_ymd" : page.cldl0802.base_ymd
				}
			};
			page.apiParam.files = [];


			// 공통 api호출 함수
			smutil.callApi(page.apiParam);
		}
		else {
			LEMP.Window.toast({
				"_sMessage":"선택한 미배달 송장번호 혹은 \n미배달 사유가 없습니다.",
				'_sDuration' : 'short'
			});
			return false;
		}

	}

	//##########################################################################
	// 고객요청(인수자변경) api 호출	start
	// 인수자 팝업 닫을때 callback 함수
	, com0601Callback : function(res){
		// 선택한 인수자 정보가 있을경우
		if(!smutil.isEmpty(res.selectedCode) && !smutil.isEmpty(res.selectedText)){
			if(page.cldl0802.step_sct_cd == "1") {//배달완료시 상단인수자버튼 클릭으로 인수자호출콜백
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
			} else {	//배달 출발시 스와이프로 인수자호출콜백
				var inv_no = page.reqAcptRgstInvNo;
				var req_acpt_sct_cd = res.selectedCode;
				var req_acpr_nm = res.selectedText;

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
			
		} else{
			LEMP.Window.toast({
				"_sMessage":"인수자 변경에 필요한 필수값들이 없습니다.",
				'_sDuration' : 'short'
			});
		}
	}
	// 희망인수자 변경 api 콜백  스와이프 희망인수자변경시 콜백(배달 출발)
	, reqAcptRgstCallback : function(result){
		try{
			// api 전송 성공
			if(smutil.apiResValidChk(result) && result.code == "0000"){
				LEMP.Window.toast({
					"_sMessage":"희망인수자 변경에 성공하였습니다.",
					'_sDuration' : 'short'
				});

				page.listReLoad();					// 리스트 제조회
			}
		}
		catch(e){}
		finally{
			smutil.loadingOff();			// 로딩바 닫기
			page.apiParamInit();			// 파라메터 전역변수 초기화
		}
	}
	
	// 미배달 처리 콜백
	, rsnRgstCallback : function(result){
		page.apiParamInit();			// 파라메터 전역변수 초기화

		// api 전송 성공
		if(smutil.apiResValidChk(result) && result.code == "0000"){
			LEMP.Window.toast({
				"_sMessage" : "미집하/미배달 처리가 완료되었습니다.",
				"_sDuration" : "short"
			});

			page.listReLoad();				// 리스트 재조회
		}
	}
	// ################### 미배달 처리 end

	// ################### 스캔 전송 start
	// 스캔된후 호출되는 함수
	, scanCallback : function(result){
		page.apiParamInit();		// 전역 api 파라메터 초기화
		var _this = this;
		var scanCallYn = "Y", sMsg = "";
		var cldl_sct_cd = page.cldl0802.cldl_sct_cd;				// 업무구분 (집하 : P,배달 : D)
		var cldl_tmsl_cd = "";			// 예정시간코드 
		 
		var inv_no = result.barcode;
		var area_sct_cd = page.dlvyCompl.area_sct_cd;			//구역(Y) 시간(N) 기준 

		inv_no = inv_no+"";

		if(page.cldl0802.step_sct_cd == "0" || page.cldl0802.step_sct_cd == "1") {
			cldl_tmsl_cd = page.returnTimeCd();			// 예정시간코드
			
			if(!_.isUndefined(page.dlvyCompl.area_sct_cd) && page.dlvyCompl.area_sct_cd == 'Y'){
				cldl_tmsl_cd = "";
			}
			
			if(cldl_sct_cd == "P") {
				var date = new Date();
				var scan_dtm = date.LPToFormatDate("yyyymmddHHnnss");	// 스캔 시간
			 
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

					scanCallYn = "N";
				}
				else if(inv_no.length != 12
						|| (inv_no.substr(0,11) + ((Number(inv_no.substr(0,11))%7)+"")) != inv_no ){
					LEMP.Window.toast({
						"_sMessage":"정상적인 송장번호가 아닙니다.",
						'_sDuration' : 'short'
					});

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
				
			} else { //배달
				var acpt_sct_cd = $('#insujaCode').val();			// 인수자 코드
				var acpr_nm = $('#insujaTxt').val();				// 인수자명
				
				// 중복 스캔 방지
				if(page.chkScanYn(inv_no)){

					// 실패 tts 호출(벨소리)
					smutil.callTTS("0", "0", null, result.isBackground);

					return false;
				}
				
				if(smutil.isEmpty(cldl_tmsl_cd) && page.dlvyCompl.area_sct_cd == 'N'){
						sMsg = "예정시간을 선택해 주세요.";
						scanCallYn = "N";
					}
					else if(smutil.isEmpty(inv_no)){
						sMsg = "송장번호가 없습니다.";
						scanCallYn = "N";
					}
					else if(inv_no.length != 12 || (inv_no.substr(0,11) + ((Number(inv_no.substr(0,11))%7)+"")) != inv_no ){
						sMsg = "정상적인 송장번호가 아닙니다.";
						scanCallYn = "N";
					}
					else if(smutil.isEmpty(acpt_sct_cd)){
						sMsg = "인수자정보를 선택해 주세요.";
						scanCallYn = "N";
					}
					else if(acpt_sct_cd == "99"
							&& ($.trim(acpr_nm) == "" || smutil.isEmpty(acpr_nm))){
						sMsg = "직접입력 인수자정보를 입력해 주세요.";
						scanCallYn = "N";
					}

					// 스캔 validation 오류로 실패
					if(scanCallYn == "N"){
						
						LEMP.Window.toast({
							"_sMessage":sMsg,
							'_sDuration' : 'short'
						});

						// 실패 tts 호출
						smutil.callTTS("0", "0", null, result.isBackground);
						//setTimeout(() => smutil.callTTS("0", "0", null, result.isBackground), 300);

						return false;
					}
					
					//스캔시간
					var date = new Date();
					var scan_dtm = date.LPToFormatDate("yyyymmddHHnnss");				// 스캔 시간
					page.apiParam.param.baseUrl = "smapis/cldl/cmptScanRgst";			// api no
					page.apiParam.param.callback = "page.cmptScanRgstCallbackD";			// callback methode
					
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
			}					
		} else { // 예정일때
			page.apiParamInit();		// 전역 api 파라메터 초기화
			cldl_tmsl_cd = $('#cldl_tmsl_cd').val();		// 예정시간선택 // page.returnTimeCd();		// 예정시간선택

			var dsgt_dd_cldl_ymd = $('#dsgt_dd_cldl_ymd').val();				// 지정일집하/배송 일자

			// 중복 스캔 방지
			if(page.chkScanYn(inv_no)){
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
			
		}

	}
	// 출발시 스캔 api 호출 callback 
	, plnScanRgstCallback : function(result){
		var message = smutil.nullToValue(result.message,'');
		var acnt = 0;
		var dcnt = 0;
		var pcnt = 0;
		//현제 어느 탭에 있는지 상태체크
		var cldl_sct_cd = page.cldl0802.cldl_sct_cd;			// 업무구분
		var inv_no = result.inv_no;
		var cldl0802LstUl = "cldl0802LstUl";
		if(page.cldl0802.cldl_sct_cd == "D") {
			cldl0802LstUl = "cldl0802LstUlD";
		} 

		// api 결과 성공여부 1차 검사
		if(smutil.apiResValidChk(result)
				&& result.code == "0000"){

			var message = "스캔성공";

			// 송장번호가 있는경우
			if(!smutil.isEmpty(inv_no)){

				LEMP.Window.toast({
					"_sMessage" : message,
					"_sDuration" : "short"
				});

				// 성공 tts 호출
				smutil.callTTS("1", "0", null, result.isBackground);

				page.listReLoad();
				// 리스트에 송장정보가 있는지 체크
				/*var liKey = $('#'+inv_no);

				// 스캔한 정보가 리스트에 있는경우는 li 활성화만 하면 됨
				if(liKey.length > 0){

					// 스켄하지 않은건이면 하단 카운트 증가(상단카운트는 증가할 필요 없음)
					if(!page.chkScanYn(inv_no)){

						// 하단 스캔건수+1
						var scanLstCnt = $('#scanLstCnt3');
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
					liKey.children('.baedalBox').addClass('scan');

					// 화면 가장 상단으로 li 이동
					liKey.prependTo('#' + cldl0802LstUl);

				}
				else {	// 스캔한 정보가 리스트에 없는경우는 li 추가
					var data = {"inv_no" : inv_no+"", "cldl_sct_cd" : cldl_sct_cd}

					// 핸들바스 템플릿 가져오기
					var source = $("#cldl0802_li_template").html();
					
					if(page.cldl0802.cldl_sct_cd == "D") {
						source = $("#cldl0802_li_templateD").html();
					} 			
				

					// 핸들바 템플릿 컴파일
					var template = Handlebars.compile(source);

					// 핸들바스 템플릿에 데이터를 바인딩해서 HTML 생성
					var liHtml = template(data);

					// noList 일경우 li 삭제
					if($('.noList').length > 0){
						$('.noList').remove();
					}

					// 생성된 HTML을 DOM에 주입
					$('#' + cldl0802LstUl).prepend(liHtml);

					// 하단 상단 스캔 카운트 전부 +1
					// 상단 리스트 건수 +1
					if(cldl_sct_cd == "D"){		// 배달건수 +1
						var D_cldl0101Cnt = $('#D_cldl0101Cnt');
						dcnt = (Number(smutil.nullToValue(D_cldl0101Cnt.text(),0)))+1;
						D_cldl0101Cnt.text(smutil.nullToValue(dcnt,1));
						$('#cldlDcnt').text('배달 '+dcnt+'건');
					}
					else if(cldl_sct_cd == "P"){		// 집하건수 +1
						var P_cldl0101Cnt = $('#P_cldl0101Cnt');
						pcnt = (Number(smutil.nullToValue(P_cldl0101Cnt.text(),0)))+1;
						P_cldl0101Cnt.text(pcnt);
						$('#cldlPcnt').text('집하 '+pcnt+'건');
					}


					// 하단 스캔건수+1
					var scanLstCnt = $('#scanLstCnt3');
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
				}*/

			}
		}
		else{		// 스캔 실패

			LEMP.Window.toast({
				"_sMessage" : message,
				"_sDuration" : "short"
			});

			// 실패 tts 호출
			smutil.callTTS("0", "0", null, result.isBackground);

			page.listReLoad();
			// 스켄되지 않은 취소건은 li 삭제처리 및 카운트 -1
			/*if(result.code == "1000" && !page.chkScanYn(inv_no, cldl_sct_cd)){

				// 리스트에 송장정보가 있는지 체크
				var liKey = $('#'+cldl_sct_cd+'_'+inv_no);

				// 있으면 삭제하고 카운트 처리
				if(liKey.length > 0){

					// li 삭제
					liKey.remove();

					// 하단 스캔건수-1
					var scanLstCnt = $('#scanLstCnt3');
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
						var D_cldl0802Cnt = $('#D_cldl0802Cnt');
						dcnt = (Number(smutil.nullToValue(D_cldl0802Cnt.text(),0)))-1;
						if(dcnt<0) dcnt=0;
						D_cldl0802Cnt.text(dcnt);
					}
					else if(cldl_sct_cd == "P"){		// 집하건수 -1
						var P_cldl0802Cnt = $('#P_cldl0802Cnt');
						pcnt = (Number(smutil.nullToValue(P_cldl0802Cnt.text(),0)))-1;
						if(pcnt<0) pcnt=0;
						P_cldl0802Cnt.text(pcnt);
					}


					if((tab_sct_cd == 'P' && pcnt == 0)			// 집하 탭에 있는데 카운트가 없을경우
							|| (tab_sct_cd == 'D' && dcnt == 0)){		// 배달 탭에 있는데 카운트가 없을경우

						// 핸들바스 템플릿 가져오기
						// 핸들바스 템플릿 가져오기
						var source = $("#cldl0802_li_template").html();
						
						if(page.cldl0802.cldl_sct_cd == "D") {
							source = $("#cldl0802_li_templateD").html();
						}

						// 핸들바 템플릿 컴파일
						var template = Handlebars.compile(source);

						// 핸들바스 템플릿에 데이터를 바인딩해서 HTML 생성
						var liHtml = template();

						// 생성된 HTML을 DOM에 주입
						$('#' + cldl0802LstUl).prepend(liHtml);
					}

				}

			}*/

		}
	}
	// ################### 스캔 전송  end
	
	
	// 스캔 api 호출 callback
	, cmptScanRgstCallbackD : function(result){
		var message = smutil.nullToValue(result.message,'');
		var acnt = 0;
		var dcnt = 0;
		var pcnt = 0;

		var cldl_sct_cd = "D";			// 업무구분		
		var message = "스캔성공";
		var acpr_nm = $('#insujaTxt').val();	// 인수자명

		// api 결과 성공여부 1차 검사
		if(smutil.apiResValidChk(result)
				&& (result.code == "0000" || result.code == "1000")){

			// 하단 스캔건수+1
			var scanLstCnt = $('#scanLstCntD');
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
					liKey.children('.baedalBox').addClass('scan');

					// 화면 가장 상단으로 li 이동
					liKey.prependTo('#cldl0802LstUlD');

					// 인수자 추가
					$('#'+inv_no+"_chk").attr('data-acpr-nm', acpr_nm);

				}
				else {	// 스캔한 정보가 리스트에 없는경우는 li 추가
					var data = {"inv_no" : inv_no+"", "cldl_sct_cd" : cldl_sct_cd, "acpr_nm" : acpr_nm};

					// 핸들바스 템플릿 가져오기
					var source = $("#cldl0802_li_templateD").html();

					// 핸들바 템플릿 컴파일
					var template = Handlebars.compile(source);

					// 핸들바스 템플릿에 데이터를 바인딩해서 HTML 생성
					var liHtml = template(data);

					// noList 일경우 li 삭제
					if($('.noList').length > 0){
						$('.noList').remove();
					}

					// 생성된 HTML을 DOM에 주입
					$('#cldl0802LstUlD').prepend(liHtml);


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
//				console.log(data);

				// 성공 tts 호출
				smutil.callTTS("1", "2", scanCnt, result.isBackground);

				if(page.dlvyCompl.area_sct_cd2 == "A"){
					//$("#span_cldl_sct_cd").hide(); ??
					//$("#chngTme").hide(); ??					
					var baseUrl = "smapis/cldl/dlvCmptScanTrsm"
					if(!smutil.isEmpty(baseUrl)){
						smutil.loadingOn();
						
						var liLst = $(".li.list")
						var param_list = [];						// 전송할 리스트 배열
						var invNoObj = {};
						var cldl_tmsl_cd = "";
						var mbl_dlv_area = "";
						var max_nm;
						var area_sct_cd = page.dlvyCompl.area_sct_cd;	//구역시간 구분

						if(page.dlvyCompl.area_sct_cd == 'Y'){
							mbl_dlv_area = page.returnAreaCd();
							cldl_tmsl_cd = "";
							max_nm = page.returnMaxNm(); //$("li[name='timeLstLi'].on").data('maxNm');  
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
						page.apiParam.param.callback="page.cmptTrsmCallbackD";
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
									"param_list" : param_list,			// 전송할 송장정보 {송장번호 : 스캔여부}
									"bld_mgr_no" : page.cldl0802.bld_mgr_no				// 인수자 명
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
		}
			
			
	}
	// ################### 스캔 전송  end
	// 배달출발확정 콜백
	, cmptTrsmCallbackD : function(result){
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
	}
	// ################### 배달출발확정(전송) end


	// ################### 배달완료확정(전송) start
	// 일괄전송 ( 시간데마다 스캔 + 체크한 데이터 같이 전송)
	, cmptTrsmD : function(){

		var cldl_sct_cd = "D";							// 업무구분
		var cldl_tmsl_cd = "";			// 예정시간코드
		var mbl_dlv_area = "";			// 선택된 구역
		var base_ymd = $('#cldlBtnCal').text();			// 기준일자
		var acpt_sct_cd = $('#insujaCode').val();		// 인수자 코드
		var acpr_nm = $('#insujaTxt').val();			// 인수자명
		var max_nm = "";								//일괄전송을 위한 max 시간 값
		var area_sct_cd = page.dlvyCompl.area_sct_cd;	//구역시간 구분

		if(!_.isUndefined(page.dlvyCompl.area_sct_cd) && page.dlvyCompl.area_sct_cd == 'Y'){
			cldl_tmsl_cd = "";
			max_nm = page.returnMaxNm();//$("li[name='timeLstLi'].on").data('maxNm');
			mbl_dlv_area = page.returnAreaCd();;
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

			return false;
		}
		else if(smutil.isEmpty(acpt_sct_cd)){
			LEMP.Window.toast({
				"_sMessage":"인수자정보를 선택해 주세요.",
				'_sDuration' : 'short'
			});

			return false;
		}
		else if(acpt_sct_cd == "99"
				&& ($.trim(acpr_nm) == "" || smutil.isEmpty(acpr_nm))){
			LEMP.Window.toast({
				"_sMessage":"직접입력 인수자정보를 입력해 주세요.",
				'_sDuration' : 'short'
			});

			return false;
		}
		else if(smutil.isEmpty(cldl_tmsl_cd) && page.dlvyCompl.area_sct_cd == "N"){
			LEMP.Window.toast({
				"_sMessage":"배달 완료시간을 선택해 주세요.",
				'_sDuration' : 'short'
			});

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

		page.apiParamInit();		// 파라메터 전역변수 초기화
		page.apiParam.param.baseUrl = "smapis/cldl/dlvCmptScanTrsm";		// api no
		page.apiParam.param.callback = "page.cmptTrsmCallbackD";			// callback methode
		page.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {
					"base_ymd" : base_ymd,				// 기준일자
					"cldl_sct_cd" : cldl_sct_cd, 		// 집하 / 배달 업무 구분코드
					"cldl_tmsl_cd" : cldl_tmsl_cd, 		// 예정시간 구분코드
					"mbl_area" : mbl_dlv_area,			// 선택된 구역
					"max_nm" : max_nm,					// 일괄전송을 위한 max 시간값 
					"area_sct_cd" : area_sct_cd,
					"acpt_sct_cd" : acpt_sct_cd, 		// 인수자 구분코드
					"acpr_nm" : acpr_nm,				// 인수자 명
					"param_list" : param_list,			// 전송할 송장정보 {송장번호 : 스캔여부}
					"bld_mgr_no" : page.cldl0802.bld_mgr_no				// 인수자 명
				}
		}

		
		smutil.loadingOn();			// 로딩바 on
		
		smutil.callApi(page.apiParam);
		
		page.apiParamInit();		// 파라메터 전역변수 초기화

	} 
	// ################### 배달출발확정(전송) end		
	
	// ################### 집하완료전송(전송) start
	, cmptTrsmP : function(){

		var page = this;
		var cldl_sct_cd = "P";							// 업무구분
		var pick_sct_cd = "";
		var cldl_tmsl_cd = page.returnTimeCd();			// 예정시간코드
		var mbl_dlv_area = page.returnAreaCd();			// 구역명칭
		var base_ymd = page.cldl0802.base_ymd;		// 기준일자
		var area_sct_cd = page.dlvyCompl.area_sct_cd;	//구역시간 구분
		
		if(!_.isUndefined(page.dlvyCompl.area_sct_cd) && page.dlvyCompl.area_sct_cd == 'Y'){
			cldl_tmsl_cd = "";
			mbl_dlv_area = page.returnAreaCd();
		}else{
			cldl_tmsl_cd = page.returnTimeCd();
			mbl_dlv_area = "";
		}
		 
		page.apiParamInit();		// 파라메터 전역변수 초기화
		page.apiParam.param.baseUrl = "smapis/cldl/cmptTrsm";		// api no
		page.apiParam.param.callback = "page.cmptTrsmCallbackP";		// callback methode
		page.apiParam.data = {				// api 통신용 파라메터
			"parameters" : {
				"cldl_sct_cd" : cldl_sct_cd			// 업무구분
				, "pick_sct_cd" : pick_sct_cd		// 일반집하, 전산집하 구분코드
				, "cldl_tmsl_cd" : cldl_tmsl_cd		// 예정시간 구분코드
				, "mbl_area" : mbl_dlv_area			// 구역명칭
				, "area_sct_cd" : area_sct_cd
				, "base_ymd" : base_ymd
				, "bld_mgr_no" : page.cldl0802.bld_mgr_no
			}
		};

		smutil.loadingOn();			// 로딩바 on

		// 공통 api호출 함수
		smutil.callApi(page.apiParam); 
			page.apiParamInit();			// 파라메터 전역변수 초기화

	}

	// 집하완료전송 콜백
	, cmptTrsmCallbackP : function(result){
		try{
			// api 전송 성공
			if(smutil.apiResValidChk(result) && result.code == "0000"){

				LEMP.Window.toast({
					"_sMessage" : "집하완료를 전송하였습니다.",
					"_sDuration" : "short"
				});

				page.listReLoad();					// 리스트 제조회
				//page.closeWindow(); //testdev
			}
		}
		catch(e){}
		finally{
			smutil.loadingOff();			// 로딩바 닫기
			page.apiParamInit();			// 파라메터 전역변수 초기화
		}
	}, 
	// ################### 집하완료전송(전송) end	

	// ################### 집배달출발확정(전송) start
	plnDprtTrsm : function(){

		var _this = this;
		var cldl_sct_cd = page.returnTabSctCd();		// 업무구분
		var base_ymd = $('#cldlBtnCal').text();
		var task_id = "CLDL0802"; //"CLDL0101";

		if(smutil.isEmpty(base_ymd)){
			LEMP.Window.toast({
				"_sMessage":"날짜를 선택해 주세요.",
				'_sDuration' : 'short'
			});

			return ;
		}

		base_ymd = base_ymd.split('.').join('');

		if(!smutil.isEmpty(cldl_sct_cd)){
			var scanCnt = 0;
			var cldlTmslCd = $('#cldl_tmsl_cd').val();		// 예정시간선택

			scanCnt = Number($('#scanLstCnt3').text());

			if(scanCnt > 0){
				_this.apiParamInit();		// 파라메터 전역변수 초기화
				_this.apiParam.param.baseUrl = "smapis/cldl/plnDprtTrsm";		// api no
				_this.apiParam.param.callback = "page.plnDprtTrsmCallback";		// callback methode
				_this.apiParam.data = {				// api 통신용 파라메터
					"parameters" : {
						"cldl_sct_cd" : cldl_sct_cd,		// 업무구분
						"base_ymd" : base_ymd,				// 기준일자
						"cldlTmslCd": cldlTmslCd,            //예정시간 선택(제주 익일관련 전용 코드) 
						"task_id": task_id,
						"bld_mgr_no" : page.cldl0802.bld_mgr_no
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

				return ;
			}

		}

		page.apiParamInit();			// 파라메터 전역변수 초기화

	},
	// 집배달출발 확정 콜백 후 다음 액션.. 페이지 어디로 이동? 또는 리로드?
	plnDprtTrsmCallback : function(result){

		try{
			// api 전송 성공
			if(smutil.apiResValidChk(result) && result.code == "0000"){

				// 집배달 출발로 페이지 전환
				/*var popUrl = smutil.getMenuProp('CLDL.CLDL0201', 'url');
				LEMP.Window.replace({
					"_sPagePath":popUrl
				});*/

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

	// ################### 집배달출발 전송 start
	dprtTrsm : function(){

		var _this = this;
		var cldl_sct_cd = _this.returnTabSctCd();		// 업무구분 (전체 : A, 집하 : P, 배달 : D)
		var cldl_tmsl_cd = _this.returnTimeCd();		// 시간구분코드
		var base_ymd = $('#cldlBtnCal').text();

		if(smutil.isEmpty(base_ymd)){
			LEMP.Window.toast({
				"_sMessage":"날짜를 선택해 주세요.",
				'_sDuration' : 'short'
			});

			return ;
		}

		base_ymd = base_ymd.split('.').join('');

		if(!smutil.isEmpty(cldl_sct_cd)){
			_this.apiParamInit();		// 파라메터 전역변수 초기화
			_this.apiParam.param.baseUrl = "smapis/cldl/dprtTrsm";			// api no
			_this.apiParam.param.callback = "page.dprtTrsmCallback";		// callback methode
			_this.apiParam.data = {						// api 통신용 파라메터
				"parameters" : {
					"cldl_sct_cd" : cldl_sct_cd			// 업무구분
					//, "cldl_tmsl_cd" : cldl_tmsl_cd   //
					, "base_ymd" : base_ymd				// 기준일자
					//, "bld_mgr_no" : page.cldl0802.bld_mgr_no
				}
			};

			smutil.loadingOn();				// 로딩바 on

			// 공통 api호출 함수
			smutil.callApi(_this.apiParam);
		}

	},


	// 배달출발전송 콜백
	dprtTrsmCallback : function(result){
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
	// cldl306  스캔팝업 콜백 함수
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
			scanCallYn = "N";
		}
		else if(smutil.isEmpty(inv_no)){
			LEMP.Window.toast({
				"_sMessage":"송장번호가 없습니다.",
				'_sDuration' : 'short'
			});
			scanCallYn = "N";
		}
		else if(inv_no.length != 12
				|| (inv_no.substr(0,11) + ((Number(inv_no.substr(0,11))%7)+"")) != inv_no ){
			LEMP.Window.toast({
				"_sMessage":"정상적인 송장번호가 아닙니다.",
				'_sDuration' : 'short'
			});

			scanCallYn = "N";
		}
		else if(smutil.isEmpty(scan_dtm)){
			LEMP.Window.toast({
				"_sMessage":"스캔시간이 없습니다.",
				'_sDuration' : 'short'
			});


			scanCallYn = "N";
		}
		else if(smutil.isEmpty(svc_cd)){
			LEMP.Window.toast({
				"_sMessage":"의류특화여부 코드가 없습니다.",
				'_sDuration' : 'short'
			});

			scanCallYn = "N";
		}
		else if(smutil.isEmpty(fare_sct_cd)){
			LEMP.Window.toast({
				"_sMessage":"운임구분코드가 없습니다.",
				'_sDuration' : 'short'
			});


			scanCallYn = "N";
		}
		else if(smutil.isEmpty(dstt_cd)){
			LEMP.Window.toast({
				"_sMessage":"도착지 터미널코드가 없습니다.",
				'_sDuration' : 'short'
			});

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

	}
	//CLDL306callback
	
	// 집하 스캔 api 호출 callback
	, cmptScanRgstCallback : function(result){
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
						scanLstCnt = $('#scanLstCntP');

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
					liKey.prependTo('#cldl0802LstUl');
				}
				else {	// 스캔한 정보가 리스트에 없는경우는 li 추가
					var data = {"inv_no" : inv_no+"", "cldl_sct_cd" : cldl_sct_cd}

					// 핸들바스 템플릿 가져오기
					var source = $("#cldl0802_li_template").html();

					// 핸들바 템플릿 컴파일
					var template = Handlebars.compile(source);

					// 핸들바스 템플릿에 데이터를 바인딩해서 HTML 생성
					var liHtml = template(data);

					// noList 일경우 li 삭제
					if($('.noList').length > 0){
						$('.noList').remove();
					}

					// 생성된 HTML을 DOM에 주입
					$('#cldl0802LstUl').prepend(liHtml);


					scanLstCnt = $('#scanLstCntP');

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
			page.listReLoad();

		}
		else{		// 스캔 실패

			LEMP.Window.toast({
				"_sMessage" : message,
				"_sDuration" : "short"
			});

			// 실패 tts 호출
			smutil.callTTS("0", "0", null, result.isBackground);

			// 취소건은 li 삭제처리 및 카운트 -1

		}

		// 스캔 데이터 전역변수초기화
		page.scanParam = null;
	}
	// ################### 스캔 전송  end
	
	// ################### 스캔취소 start
	, cmptScanCcl : function(inv_no, cldl_sct_cd, cldl_tmsl_cd){

		var _this = this;

		if(smutil.isEmpty(inv_no)){
			LEMP.Window.toast({
				"_sMessage":"송장번호가 없습니다.",
				'_sDuration' : 'short'
			});


			return false;
		}
		else if(smutil.isEmpty(cldl_sct_cd)){
			LEMP.Window.toast({
				"_sMessage":"업무구분이 없습니다.",
				'_sDuration' : 'short'
			});


			return false;
		}

		var baseUrl = "smapis/cldl/cmptScanCcl", scanYmd = page.cldl0802.base_ymd;
		if(page.cldl0802.step_sct_cd == '0') {  //201
			baseUrl = "/smapis/cldl/changedlvywait";
		} else if(page.cldl0802.step_sct_cd == '1') { //301, 401
			baseUrl = "smapis/cldl/cmptScanCcl";
		} else {	//101 예정
			baseUrl = "smapis/cldl/plnScanCcl";
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
				_this.apiParam.param.baseUrl = baseUrl; // "smapis/cldl/cmptScanCcl";			// api no  301 401
				_this.apiParam.param.callback = "page.cmptScanCclCallback";			// callback methode 
				_this.apiParam.data = {				// api 통신용 파라메터
					"parameters" : {
						"inv_no" : inv_no+"",					// 송장번호
						"cldl_sct_cd" : cldl_sct_cd,			// 업무구분
						"cldl_tmsl_cd" : cldl_tmsl_cd,			// 시간코드
						"cldlSctCd" : cldl_sct_cd,			// 업무구분 changedlvywait 에서 사용
						"scanYmd" : scanYmd,
						"base_ymd": scanYmd
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


			page.listReLoad();				// 리스트 제조회

			/*var pick_sct_cd = page.returnTabSctCd();		// 선택한 탭의 값 (일반 : G, 전산 : C)

			// 전산집하인경우 전체 스캔리스트 제조회
			if(pick_sct_cd == "C"){
				page.cmptScanListFun();						// 전체 스켄리스트 제조회
			}*/

		}
		else if(result.code == "9000"){
			page.listReLoad();				// 이미 삭제된 리스트이기 때문에 바로 리스트 제조회
		}
		else{

		}

		page.apiParamInit();				// 파라메터 전역변수 초기화
	}
	// ################### 스캔취소 end
		
	

	// 문자발송 서비스 호출  - 집하배달 완료시 문자발송 - 스캔 된데이터만 문자가능, 시간영역 체크
	, sendSms : function(){
			var _this = this;
			var chkLst = [];
			var invNoLst = [];
			var chkYn = false;
			
			var chkboxnm = "input[name=chkInvD]:checked";
			if(page.cldl0802.cldl_sct_cd == "P") {
				chkboxnm = "input[name=chkInvP]:checked";
			}

			if(page.cldl0802.step_sct_cd == '1'){//완료시 스캔된 운송장만 문자가능 , 선택한 시간 구간 확인
				//$("input[name=chkInvP]:checked").each(function() {
				$(chkboxnm).each(function() {
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
	 
					return false;
				}
				// 전화번호가 없어도 문자 발송 가능하도록 기능 수정(20200204)
				if(chkLst.length > 0){
					var single = [];
					var timeTxt = page.cldl0802.cldl_tmsl_nm;
	
					if((smutil.isEmpty(timeTxt) && page.dlvyCompl.area_sct_cd == "N")
							|| (smutil.isEmpty(timeTxt) && page.dlvyCompl.area_sct_cd == "Y" && chkLst.length == 1)){
						LEMP.Window.toast({
							"_sMessage":"선택한 시간 구간이 없습니다.",
							'_sDuration' : 'short'
						});
	
						return false;
					}
				}
				
			} else { ///예정 출발
				$(chkboxnm).each(function() {
					var inv_no = ($(this).attr("id")).replace('_chk', '');
					chkLst.push($(this).val());
					invNoLst.push(inv_no);
					
				});
			}


			if(chkLst.length > 20){
				LEMP.Window.toast({
					"_sMessage":"문자발송은 20건까지만 선택 가능합니다.",
					'_sDuration' : 'short'
				});

				return false;
			}


			// 전화번호가 없어도 문자 발송 가능하도록 기능 수정(20200204)
			if(chkLst.length > 0){
				var single = [];
 
				// 문자 발송 로직 시작~!!!
				var popUrl = smutil.getMenuProp("CLDL.CLDL0206","url");
				LEMP.Window.open({
					"_sPagePath":popUrl,
					"_oMessage":{"param":{}}
				}); 

			}
			else{
				LEMP.Window.toast({
					"_sMessage":"문자를 발송할 송장을 선택해주세요.",
					'_sDuration' : 'short'
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
			var chkYn = false;

			var chkboxnm = "input[name=chkInvD]:checked";
			if(page.cldl0802.cldl_sct_cd == "P") {
				chkboxnm = "input[name=chkInvP]:checked";
			}
			
			if(page.cldl0802.step_sct_cd == '1'){//완료시 스캔된 운송장만 문자가능 , 선택한 시간 구간 확인
				$(chkboxnm).each(function() {
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
					return false;
				}
				
				// 전화번호가 없어도 문자 발송 가능하도록 기능 수정(20200204)
				if(chkLst.length > 0){
					var timeTxt = "";
					var timeTxt = page.cldl0802.cldl_tmsl_nm;
					
					if((smutil.isEmpty(timeTxt) && page.dlvyCompl.area_sct_cd == "N")
							|| (smutil.isEmpty(timeTxt) && page.dlvyCompl.area_sct_cd == "Y" && chkLst.length == 1)){
						LEMP.Window.toast({
							"_sMessage":"선택한 시간 구간이 없습니다.",
							'_sDuration' : 'short'
						});
	
						return false;
					}
				} 
			
			} else {	//예정, 출발시 스캔체크 안함
				$(chkboxnm).each(function() {
					var inv_no = ($(this).attr("id")).replace('_chk', '');
					chkLst.push($(this).val());
					invNoLst.push(inv_no);
				});
			}

			if(chkLst.length > 20){
				LEMP.Window.toast({
					"_sMessage":"문자발송은 20건까지만 선택 가능합니다.",
					'_sDuration' : 'short'
				});

				return false;
			}


			// 전화번호가 없어도 문자 발송 가능하도록 기능 수정(20200204)
			if(chkLst.length > 0){
				var single = []; 

				// 선택한 전화번호리스트 중복제거
				$.each(chkLst, function(i, el){
					// 공백 전화번호는 저장 안함
					if(!smutil.isEmpty(el)){
						if($.inArray(el, single) === -1) single.push(el);
					}

				});
				
		 
				var text= res.msg_cont;			// 선택한 메세지

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
			else{
				LEMP.Window.toast({
					"_sMessage":"문자를 발송할 송장을 선택해주세요.",
					'_sDuration' : 'short'
				});
				return false;
			}

	}  

	// 사진촬영 mms 발송
	, sendPhotoMms : function(){
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

		$("input[name=chkInvD]:checked").each(function(idx, Obj) {

			var chkObj = $(this);
			var inv_no = chkObj.attr("id").replace('_chk', '');
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
					){

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

			}
		});


		if(invNoLst.length > 20){
			LEMP.Window.toast({
				"_sMessage":"사진전송은 최대 20건까지 가능합니다.",
				'_sDuration' : 'short'
			});

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
			//console.log(paramObj);
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

			return false;
		}
		else{
			LEMP.Window.toast({
				"_sMessage":"스캔후 선택한 송장정보가 없거나\nMMS를 전송할수있는 전화번호가 없습니다.",
				'_sDuration' : 'short'
			});

			return false;
		}

	}
	// mms 전송후 페이지 재조회
	, cldl0410Callback : function(){
		page.listReLoad();				// 리스트 재조회
	}
	//com0301에서 날짜 선택 한 후 실행되는 콜백 함수
	, COM0301Callback:function(res){
		if (res.param.type === 'list') {
			//$("#cldlBtnCal").text(res.param.date);
			//page.listReLoad();					// 리스트 제조회
		} else if (res.param.type === 'time') {
			$('#dsgt_dd_cldl_ymd').val(res.param.date.replace(/\./g,""));
		}
	}
		
	//##########################################################################
	// 시간변경 api 호출	start
	// 시간설정 팝업 닫을때 callback 함수 
	, com0501Callback : function(res){
		if(!smutil.isEmpty(res.selectedCode)){
			// 시간 변경을 위한 송장번호와 타임 배달, 집하 구분코드가 전부 있으면 변경
			if(!smutil.isEmpty(page.changeTimeInvNo)
					&& !smutil.isEmpty(page.changeTimeSctCd)){
				var setObject = [{invNo : page.changeTimeInvNo, cldl_sct_cd : page.changeTimeSctCd}];

				var cldl_tmsl_cd = res.selectedCode;
				//넘겨받은 체크 대상 리스트
				var chngInvNoList = setObject;

				page.apiParamInit();
				page.apiParam.param.baseUrl = "smapis/cldl/changedlvytme";					// api no
				page.apiParam.param.callback = "page.changeDlvyTimeCallback";			// callback methode
				page.apiParam.data = {
					"parameters" : {
						"cldl_tmsl_cd" : cldl_tmsl_cd,
						"chngInvNoList" : chngInvNoList
					}
				};
				
				smutil.loadingOn();				// 로딩바 on
				
				// 공통 api호출 함수
				smutil.callApi(page.apiParam);
			}
			else{
				LEMP.Window.toast({
					"_sMessage":"시간변경을 위한 필수값이 없습니다.",
					'_sDuration' : 'short'
				});

				return false;
			}
		}

	}
	//성공여부 콜백
	,changeDlvyTimeCallback: function(res){
		if(res.code == 0000){
			LEMP.Window.toast({
				"_sMessage":res.message,
				'_sDuration' : 'short'
			});
		}else if(res.code == 0001){
			LEMP.Window.toast({
				"_sMessage":res.message,
				'_sDuration' : 'short'
			});
		}
		
		page.listReLoad();
	}
	, callbackBackButton : function(){
		if(page.cldl0802.step_sct_cd == "1") { //완료
			// 하단 스캔건수 조회
			var scancnt = 0; 
			if(page.cldl0802.cldl_sct_cd == "P") {
				scancnt = Number(smutil.nullToValue($('#scanLstCnt').text(),"0"));
			} else {
				scancnt = Number(smutil.nullToValue($('#scanLstCntD').text(),"0"));
			} 
			if(scancnt > 0) {
				page.chkScanCnt(scancnt);	
			} else {
				page.closeWindow();	
			}
			
		} else if(page.cldl0802.step_sct_cd == "3") { //예정
			// 하단 스캔건수 조회
			var scancnt = 0; 
			scancnt = Number(smutil.nullToValue($('#scanLstCnt3').text(),"0"));
			if(scancnt > 0) {
				page.chkScanCnt(scancnt);	
			} else {
				page.closeWindow();	
			}
			
		} else {
			page.closeWindow();			
		}

	}
	, closeWindow : function(){
		if(page.is_reload == null) {
				LEMP.Window.close();
			} else {
				LEMP.Window.close({
						"_oMessage":{
							"param":{"step_sct_cd":page.cldl0802.step_sct_cd}
						},
						"_sCallback":"page.cldl0802Callback"
					});
			}
	}
	
	// 물리적 뒤로가기 버튼 및 뒤로가기 화살표 버튼 클릭시 스캔 체크해서 전송여부 결정
	, chkScanCnt : function(scancnt){ 

		// 스캔 후 전송안된 데이터가 남아있으면 전송 후 페이지 이동 가능
		if(scancnt>0){
			var pop2Txt2 = '스캔된 데이터 '+scancnt+'건<br /> 배달완료를 전송합니다.';
			var pop2Txt1 = '배달완료 전송';
			var txtMessage = "전송완료가 안된 스캔데이터가 있습니다.\n전송후 페이지 이동이 가능합니다. \n전송 하시겠습니까?";
			if(page.cldl0802.step_sct_cd == "1") {
				if(page.cldl0802.cldl_sct_cd == "P") {
					pop2Txt2 = '스캔된 데이터 '+scancnt+'건<br /> 집하완료를 전송합니다.';
					pop2Txt1 = '집하완료 전송';
				} 
			} else {
				pop2Txt2 = '스캔된 데이터 '+scancnt+'건<br />집배달출발을 확정합니다.';
				pop2Txt1 = '출발확정';
				txtMessage = "출발확정이 안된 스캔데이터가 있습니다.\n출발확정 전송후 페이지 이동이 가능합니다. \n전송 하시겠습니까?";
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

						// 집하배달출발 확정(전송) 컴펌창 호출
						if(scancnt > 0){
							$('#pop2Txt2').html(pop2Txt2);
							$('#pop2Txt1').text(pop2Txt1);
							$('.mpopBox.pop2').bPopup();
						}
						else{
							LEMP.Window.toast({
								"_sMessage":"스캔한 데이터가 없습니다.",
								'_sDuration' : 'short'
							});

							return false;
						}
					}
				});

				LEMP.Window.confirm({
					"_sTitle":"미전송 스캔데이터 확인.",
					"_vMessage" : txtMessage,
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
	}
	// 현재 리스트가 스캔이 되어있는지 체크
	// 스캔 했으면 true, 안했으면 false
	, chkScanYn : function(inv_no){
		if(!smutil.isEmpty(inv_no) && $('#'+inv_no).length > 0){ 
			return !($('#'+inv_no).children(".baedalBox").is(".off"));
		}
		else {
			return false;
		}
	}
	, returnMaxNm : function(){
		var max_nm = page.cldl0802.max_nm;
		
		return max_nm;
	}	
	// 현재 활성화 시간구간코드 리턴
	, returnTimeCd : function(){
		var cldl_tmsl_cd = page.cldl0802.cldl_tmsl_cd;
		if(smutil.isEmpty(page.cldl0802.cldl_tmsl_cd)) cldl_tmsl_cd= "";
		return cldl_tmsl_cd;
	}
		
	//현재 활성화 구역코드 리턴
	, returnAreaCd : function(){
		var mbl_dlv_area = page.cldl0802.mbl_dlv_area;
		return mbl_dlv_area;
	}
	
	, returnTabSctCd : function(){
		var cldl_sct_cd = 'P';
		if ($(".tabBox").find(".on").index()!=0) {
			cldl_sct_cd = 'D';
		}
		return cldl_sct_cd;
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
		
		//console.log(setHoursCheck, fohours, behours);
		
		return setHoursCheck;
	},
	//스캔 등록시 화물사고 알림
	scanAlarm:function() {
		var alarmCnt = 0;
		
		var listAll = page.resData.list;
		if(page.cldl0802.cldl_sct_cd == 'D') {
			listAll = page.resData.listD;
		}
		
		var inv_no;									// li 에 걸려있는 송장번호
		var param_list = [];						// 전송할 리스트 배열
		var invNoObj = {};
		var acdTypCd;
		var msg = "하기 송장은<br />분실 / 파손 / 반품접수 등의 사유로<br />집배달 불가 상품 입니다. <br />";
		
		if(listAll != null && listAll.length > 0 ) {
			// 모든 li 리스트를 돌면서 스캔한 데이터와 체크박스의 체크한 데이터를 셋팅한다.
			$.each(listAll, function(index, obj){
				inv_no = obj.inv_no;
				inv_no = inv_no.replace(/([0-9]{4})([0-9]{4})([0-9]{4})/,"$1-$2-$3");
				acdTypCd = smutil.nullToValue(obj.acd_typ_cd, "");
				//console.log('inv_no: ' + inv_no + ' acdTypCd: ' + acdTypCd);
				if(acdTypCd == "10") {
					msg += "<br />" + alarmCnt + ") " + inv_no + "<br />" + "- 분실 사고 진행 건<br />";
					alarmCnt ++;
				} else if(acdTypCd == "30") {
					msg += "<br />" + alarmCnt + ") " + inv_no + "<br />" + "- 경유점소에서 사고확인서 등록 건<br />";
					alarmCnt ++;
				} else if(acdTypCd == "60") {
					msg += "<br />" + alarmCnt + ") " + inv_no + "<br />" + "- 반품 지시 접수 건<br />";
					alarmCnt ++;
				}
			});
			
		} 
		if(alarmCnt == 0) {
			return 0;
		}
		
		$('#popScanAlarmTxt').html(msg);
		$('.mpopBox.scanAlarm').bPopup();
		
		return alarmCnt;
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
	}
	
	//현재위치 찾기
	,getLocation:function() {
		if(navigator.geolocation) { //GPS 지원여부
			navigator.geolocation.getCurrentPosition(function(position) {
				
				if((position.coords.latitude + "").substr(0,1) == '1') {
					page.lgtd = position.coords.latitude;
					page.lttd = position.coords.longitude;	
				} else {
					page.lgtd = position.coords.longitude;
					page.lttd = position.coords.latitude;
				}
			}, function(error) {
			}, {
				enableHighAccuracy : false,//배터리를 더 소모해서 더 정확한 위치를 찾음
				maximumAge: 0, //한 번 찾은 위치 정보를 해당 초만큼 캐싱
				timeout: Infinity //주어진 초 안에 찾지 못하면 에러 발생
			});
		}
	}
	
};