var page = {
	mbl_dlv_area : null,
	signInvNo : null,
	is_reload : null,
	dlvyCompl : null,
	sp : null,	//현재위치 
	init:function(arg)
	{
		page.cldl0802 = arg.data.param;
		page.dlvyCompl = LEMP.Properties.get({
			"_sKey" : "autoMenual"
		});

		page.getLocation();
		page.initInterface();
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
	
	// 이벤트 등록 함수
	,initInterface : function()
	{
		//닫기
		$(document).on("click",".btn.closeW.paR",function(){
			if(page.is_reload == null) {
				LEMP.Window.close();
			} else {
				var obj = {
						"cldl_sct_cd":"D",
						"inv_no":"1111"
				}
				LEMP.Window.close({
						"_oMessage":{
							"param":obj
						},
						"_sCallback":"page.cldl0802Callback"
					});
			}
		});
		
		/* 제스처 */
		//var thisN = ".baedalListBox .txtBox .invListBox  > ul > li > .baedalBox"; //.tabInvDetail > ul > li > .baedalBox
		var thisN = ".baedalListBox > ul > li > .baedalBox";
		var thisW = 0;
		var thisC = 0;
		var thisPid = "";
		$(document).on("click, touchstart", thisN,function(e){ console.log('page.cldl0802. click, touchstart');
			$(thisN).swipe({
				triggerClick:false,
				preventDefault:false,
				onStart:function(onThis){
					thisC = $(onThis).parent().index();
					thisW = $(onThis).parent().find(".btnBox").width();
					thisPid = $(onThis).parent().attr("id");//console.log('thisPid', thisPid);
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
		
		// 인수자 정보 셋팅
		var acptSctInfo = LEMP.Properties.get({
			"_sKey" : "acptSctInfo",
		});

		if(!smutil.isEmpty(acptSctInfo)){
			$('#insujaTxt').val(acptSctInfo.acpr_nm);			// 인수자 hidden text
			$('#insujaCode').val(acptSctInfo.acpt_sct_cd);		// 인수자 hidden code
			$('.insujaTxtView').text(acptSctInfo.acpr_nm);		// 인수자 text
		}
		
		if(page.cldl0802.step_sct_cd == '1'){
			$('#tabChkDetailP').show();
			$('#tabChkDetailD').hide();
			$('#headnm').text("집배달 완료");
			$("#bottomli").show();
		} else {
			$('.tabChkbox').hide();
			$("#bottomli").hide();
			if(page.cldl0802.step_sct_cd == '0'){
				$('#headnm').text("집배달 출발");	
			} else {
				$('#headnm').text("집배달 예정");
			}
		}
				
		/* 체크박스 전체선택 */
		$("#checkallD").click(function(){
			if($("#checkallD").prop("checked")){
				$("input[name=chkInvD]").prop("checked",true);
			}else{
				$("input[name=chkInvD]").prop("checked",false);
			}
		});
		
		/* 체크박스 전체선택 */
		$("#checkallP").click(function(){
			if($("#checkallP").prop("checked")){
				$("input[name=chkInvP]").prop("checked",true);
			}else{
				$("input[name=chkInvP]").prop("checked",false);
			}
		});

		//상단탭
		$(".lstSchBtn").click(function(){
			var pick_sct_cd = $(this).data('pickSctCd');		// 선택한 탭의 값 (P,D)
			// 텝에따라 업무구분 선택박스 처리
			if(pick_sct_cd == 'D'){
				$('#invDetailP').hide();
				$('#invDetailD').show();				
				
				if(page.cldl0802.step_sct_cd == '1'){ //완료(집하/배달)
					$('#tabChkDetailP').hide();
					$('#tabChkDetailD').show();
					
					$("#bottomli").show();
					$("#bottomli").removeClass("li4");
					$("#bottomli").addClass("li5");
					$('#liimg').show();
					$("#spanoff").html("미배송사유");
				}
				else{
					$('.tabChkbox').hide();
					$("#bottomli").hide();
				}
			}
			else{
				$('#invDetailP').show();
				$('#invDetailD').hide();
				
				if(page.cldl0802.step_sct_cd == '1'){
					$('#tabChkDetailP').show();
					$('#tabChkDetailD').hide();
					$("#bottomli").show();
					$("#bottomli").removeClass("li4");
					$("#bottomli").addClass("li5");
					$('#liimg').show();
					$("#spanoff").html("미배송사유");
				}
				else{
					$('.tabChkbox').hide();
					$("#bottomli").hide();

				}
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
		
		});
		

		// 송장번호 누른경우 (상세보기 연결)
		$(document).on('click', '.invNoSpan', function(event){
			console.log('invNoSpan click');
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
			var routeUrl = "https://m.map.kakao.com/scheme/open";
			alert('map opentest:: ' + routeUrl);
			window.location = routeUrl;
			// 문자발송 이벤트 호출
			//page.sendSms();
		});
		
		$('.btn.ftImg').click(function(e){
			var routeUrl = "kakaomap://route?sp=37.5570572,126.9736211&ep=37.4979502,127.0276368&by=FOOT";
			alert('routeUrl kakaomap:: ' + routeUrl);
			window.location = routeUrl;
		});
		
		$('.btn.ftSend').click(function(e){
			var routeUrl = "https://map.kakao.com/link/from/서울특별시청,37.5668260054857,126.978656785931/to/강원도청,37.8853257858225,127.729829010358";
			alert('routeUrl https:: ' + routeUrl);
			window.location = routeUrl;
		});



		// 스와이프 touch start
		// 스와이프해서  통화버튼 클릭
		$(document).on('click', '.btn.blue.bdM.bdPhone', function(e){
			var phoneNumberTxt = $(this).data('phoneNumber');
			// 전화걸기 팝업 호출
			$('#popPhoneTxt').text(phoneNumberTxt);
			$('.mpopBox.phone').bPopup();

		});
		
		//통화 
		$(document).on("click","#phoneCallYesBtn",function(){
			var phoneNumber = $('#popPhoneTxt').text();
			alert('phoneNumber : ' + phoneNumber );
				phoneNumber = phoneNumber.split('-').join('').replace(/\-/g,'');
			
			LEMP.System.callTEL({
				"_sNumber":phoneNumber
			});
			
			$('.mpopBox.phone').bPopup().close();
		});
		


		// 스와이프해서 서명 싸인패드 호출
		$(document).on('click', '.btn.blue2.bdM.bdSign.mgl1', function(e){
			var inv_no = $(this).data('invNo')+"";//alert('서명 싸인패드 기능 준비중');
			console.log('page.cldl0802. btn.blue2.bdM.bdSign.mgl1 click inv_no' + inv_no);
			var chksyn = page.chkScanYn(inv_no);
			alert("chkScanYn: " + chksyn);
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
			var cldl_sct_cd = $(this).data('cldlSctCd');
			var menu_id = "";
			console.log('page.cldl0802. btn.bdM.blue5.bdM.bdCancle.mgl1 click');
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
			alert('scan1: ' + inv_no);
			if(!smutil.isEmpty(inv_no)){
				inv_no = inv_no.split('-').join('');
				var result = {"barcode" : inv_no}; //, "cldl_sct_cd":cldl_sct_cd
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
			//alert('이동경로 기능 준비중입니다.');
			alert("goRoute::: " + page.sp + "" + page.cldl0802.ep);
			if(!smutil.isEmpty(page.sp) && !smutil.isEmpty(page.cldl0802.ep)){				
				var popUrl = "kakaomap://route?sp="+page.sp+"&ep="+page.cldl0802.ep+"&by=CAR"; //2023.02.24
				//page.goRoute(result);
				alert(popUrl);
				LEMP.Window.open({
					"_sPagePath":popUrl,
					"_oMessage" : {
					}
				});	
				
			}
			else{
				LEMP.Window.toast({
					"_sMessage":"송장번호가 없습니다.",
					'_sDuration' : 'short'
				});

				return false;
			}
		});		
		
		// 스와이프 touch end
		
		
		// ###################################### handlebars helper 등록 start		
		// check박스 필요여부 잽배완료,배달완료시 true
		Handlebars.registerHelper('isChk', function(options) {
			if(page.cldl0802.step_sct_cd == '1'){
				return options.fn(this)
			}
			else{	
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
				//html = '<button class="btn bdM blue4 bdClock mgl1" data-inv-no="'+this.inv_no+'" data-cldl-sct-cd="'+this.cldl_sct_cd+'">시간수정</button>';
			}
			else if(page.cldl0802.step_sct_cd == '1'){ //cldl301
				html = '<button class="btn bdM blue3 bdCancle mgl1" data-inv-no="'+this.inv_no+'" data-corp-sct-cd="'+this.corp_sct_cd+'">미집하</button>'
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
//					 + '<button class="btn bdM blue3 bdMic mgl1" data-inv-no="'+this.inv_no+'" data-cldl-sct-cd="'+this.cldl_sct_cd+'">희망인수자</button>'
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
				    + '<button class="btn bdM blue3 bdCancle mgl1" data-inv-no="'+this.inv_no+'" data-cldl-sct-cd="'+this.cldl_sct_cd+'">미배달</button>';
			}
			return new Handlebars.SafeString(html);
		});
		// ###################################### handlebars helper 등록 end
		
						
		
		//이전페이지에서 넘겨받은 운송장번호들로 호출한 데이터를 출력
		page.invDtl();
	}
	
	, listReLoad : function(){
			page.is_reload = true;
			page.invDtl();				// 리스트 재조회
	}
	
	
	
	//상세화면 조회
	,invDtl:function(){
		var data = {};
		data.base_ymd   = page.cldl0802.base_ymd;
		data.step_sct_cd= page.cldl0802.step_sct_cd;
		data.bld_mgr_no	= page.cldl0802.bld_mgr_no;
		data.cldl_tmsl_cd= page.cldl0802.cldl_tmsl_cd;
		data.cldl_tmsl_null = "";
		if(smutil.isEmpty(page.cldl0802.cldl_tmsl_cd)) data.cldl_tmsl_null = "true";
			
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
			$('.tabChkbox').prop("checked",false);
			
			var template = Handlebars.compile($("#cldl0802_li_template").html());
			var templateD = Handlebars.compile($("#cldl0802_li_templateD").html());
				
			if (res.data_count !== 0 && smutil.apiResValidChk(res) && res.code==="0000") { 
				//console.log('res.cldl_sct_cd', res.cldl_sct_cd);
				$('#cldlPcnt').text('집하 '+smutil.nullToValue((res.data.list.length),0)+'건');
				$('#cldlDcnt').text('배달 '+smutil.nullToValue((res.data.listD.length),0)+'건');


				$('#cldl0802LstUl').html(template(res.data));
				$('#cldl0802LstUlD').html(templateD(res.data));
				
				if(res.data.list.length == 0) {
					$(".tabBox").find("li:eq(1)").trigger("click");
				}
			} else {
				alert('데이터가 없습니다.');
			}
		}
		catch(e){}
		finally{
			smutil.loadingOff();			// 로딩바 닫기
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
	
	// 두 번호로 휴대폰 번호가 있는경우 휴대폰 번호를 리턴, 없으면 일반전화번호 리턴
	,getCpNo : function(phoneNum1, phoneNum2){
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
console.log('cmptSignRgst signObj', signObj);
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
console.log('cmptSignRgstCallback result', result);
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

	// ################### 미배달 전송 start
	// 미배달 사유 선택후 callback
	, com0701Callback : function(res){
		page.apiParamInit();		// 파라메터 초기화

		var inv_no = res.param.inv_no;		// 미배달 선택한 송장번호
		inv_no = inv_no+"";					// 송장번호 문자로처리
		var cldl_sct_cd = smutil.nullToValue(res.param.cldl_sct_cd,"");	// 배달업무
		var dlay_rsn_cd = smutil.nullToValue(res.param.code,"");	// 미배달 사유 코드
		var rsn_cont = smutil.nullToValue(res.param.value,"");		// 미배달 사유 date

		if(!smutil.isEmpty(inv_no) && !smutil.isEmpty(dlay_rsn_cd)){

			var liDiv = $('#'+cldl_sct_cd + inv_no).children('.baedalBox');

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

			page.listReLoad();				// 리스트 재조회 2023.02.27
		}
	}
	// ################### 미배달 처리 end

	// ################### 스캔 전송 start
	// 스캔된후 호출되는 함수
	, scanCallback : function(result){console.log('scanCallback', result);
		page.apiParamInit();		// 전역 api 파라메터 초기화
		var _this = this;
		var scanCallYn = "Y", sMsg = "";
		var cldl_sct_cd = "D";//result.cldl_sct_cd;				// 업무구분 (배달 : D)
		var cldl_tmsl_cd = page.cldl0802.cldl_tmsl_cd;				// 예정시간
		 
		var inv_no = result.barcode;
		var acpt_sct_cd = $('#insujaCode').val();			// 인수자 코드
		var acpr_nm = $('#insujaTxt').val();				// 인수자명
		var area_sct_cd = page.dlvyCompl.area_sct_cd;			//구역(Y) 시간(N) 기준 

		if(!_.isUndefined(page.dlvyCompl.area_sct_cd) && page.dlvyCompl.area_sct_cd == 'Y'){
			cldl_tmsl_cd = "";
		}
		
		inv_no = inv_no+"";
		// 중복 스캔 방지
		if(page.chkScanYn(inv_no)){
			console.log('smutil.callTTS');
			// 실패 tts 호출(벨소리)
			smutil.callTTS("0", "0", null, result.isBackground);

			return false;
		}  //진행안됨.. 나중에 살림 testdev
		
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
			console.log('222222222222 scanCallYn: ' + scanCallYn + ' sMsg: ' + sMsg);
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
			console.log('3333333333');
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
	console.log('page.apiParam.data 1111', page.apiParam.data);
			// 공통 api호출 함수
			smutil.callApi(page.apiParam);
		
	}
	
	// 스캔 api 호출 callback
	, cmptScanRgstCallback : function(result){ console.log('cmptScanRgstCallback', result);
		var message = smutil.nullToValue(result.message,'');
		var acnt = 0;
		var dcnt = 0;
		var pcnt = 0;
		var cldl_sct_cd = page.apiParam.data.cldl_sct_cd;			// 업무구분 -- 변경???
		var message = "스캔성공";
		var acpr_nm = $('#insujaTxt').val();	// 인수자명

		// api 결과 성공여부 1차 검사
		if(smutil.apiResValidChk(result)
				&& (result.code == "0000" || result.code == "1000")){

			// 하단 스캔건수+1
			var scanLstCnt = $('#scanLstCnt'); //?
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
				var liKey = $('#'+cldl_sct_cd+inv_no);

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
					liKey.prependTo('#cldl0802LstUl');

					// 인수자 추가
					$('#'+cldl_sct_cd+inv_no+"_chk").attr('data-acpr-nm', acpr_nm);

				}
				else {	// 스캔한 정보가 리스트에 없는경우는 li 추가
					var data = {"inv_no" : inv_no+"", "cldl_sct_cd" : cldl_sct_cd, "acpr_nm" : acpr_nm};

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
console.log('smutil.callTTS scanCnt: ', scanCnt);
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
		}
			
			
	}
	// ################### 스캔 전송  end
	// 배달출발확정 콜백
	, cmptTrsmCallback : function(result){ console.log('cmptTrsmCallback: ', cmptTrsmCallback);
		var _this = this;

		try{
			// api 전송 성공
			if(smutil.apiResValidChk(result) && result.code == "0000"){
				LEMP.Window.toast({
					"_sMessage" : "배달완료를 확정하였습니다.",
					"_sDuration" : "short"
				});
				page.is_reload = true;
				page.invDtl();					// 리스트 제조회
			}
		}
		catch(e){}
		finally{
			smutil.loadingOff();			// 로딩바 닫기
			page.apiParamInit();			// 파라메터 전역변수 초기화
		}
	}
	// ################### 배달출발확정(전송) end
	// ################### 스캔취소 end
		
	// api 파람메터 초기화
	, apiParamInit : function(){
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
				page.sp = position.coords.latitude +","+position.coords.longitude;//2023.02.24
			}, function(error) {
			}, {
				enableHighAccuracy : false,//배터리를 더 소모해서 더 정확한 위치를 찾음
				maximumAge: 0, //한 번 찾은 위치 정보를 해당 초만큼 캐싱
				timeout: Infinity //주어진 초 안에 찾지 못하면 에러 발생
			});
		}
	}
	
};

