var page = {

	page_no :"1",						// 조회 요청한 페이지 번호
	item_cnt : "400",					// 현황에서 보여질 row 수
	page_navigation_cnt : 5,			// 페이징을 표시할 네비게이션 수


	init : function() {
		page.initEvent(); // 페이지 이벤트 등록
		page.initDpEvent(); // 화면 디스플레이 이벤트
	},


	apiParam : {
		id : "HTTP", // 디바이스 콜 id
		param : { // 디바이스가 알아야할 데이터
			task_id : "", // 화면 ID 코드가 들어가기로함
			// position : {}, // 사용여부 미확정
			type : "",
			baseUrl : "",
			method : "POST", // api 호출 형식(지정 안하면 'POST' 로 자동 셋팅)
			callback : "", // api 호출후 callback function
			contentType : "application/json; charset=utf-8"
		},
		data : {
			"parameters" : {}
		}
	// api 통신용 파라메터
	},


	cldl0501 : {
		"cnf_yn" : "Y", 			// 완료 : Y, 미처리 : N
		"cldl_sct_cd" : "A",		// 전체, 집하, 배달
	},


	initEvent : function() {

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
		$("#openFrePop").click(function() {
			var popUrl = smutil.getMenuProp("FRE.FRE0301", "url");

			LEMP.Window.open({
				"_sPagePath" : popUrl,
				"_oMessage" : {
					"param" : null
				}
			});
		});

		// 탭 클릭시 리스트 조회
		$(".tabBox.li2 > ul > li").click(function() {
			$(".on").removeClass("on");
			$(this).addClass("on");
			var cnf = $(this).children().data('cnfYn');
			page.cldl0501.cnf_yn = cnf;
			page.page_no = "1";					// 1페이지로 초기화
			page.initDpEvent();
		});

		// 셀렉트박스 선택시 리스트 조회
		$("#cldl_sct_cd").change(function() {
			page.cldl0501.cldl_sct_cd = this.value;
			page.initDpEvent();
		})

		$(document).on("click",".naviPageIdx",function(){
//			console.log($(this).text());
			page.page_no=$(this).text();
			page.cmptStatus();
		});

		// 운송장번호 클릭시 상세정보 호출
		//$(document).on("click", ".invNoSpan", function() {
		$(document).on('click', '.invNoSpan', function(){
			if ($(this).parents(".baedalBox").hasClass("jibBox")) {
				var popUrl = smutil.getMenuProp("CLDL.CLDL0502", "url");
			} else {
				var popUrl = smutil.getMenuProp("CLDL.CLDL0503", "url");
			}

			LEMP.Window.open({
				"_sPagePath" : popUrl,
				"_oMessage" : {
					"param" : {
						"inv_no" : $(this).text().replace(/\-/g, '')
					}
				}
			})
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


		// 문자발송 스와이프 버튼클릭
		$(document).on('click', '.btn.blue5.bdM.bdMsg', function(e){
			var inv_no = $(this).data('invNo')+"";				// 송장번호
			var phoneNumber = $(this).data('phoneNumber');		// 전화번호
			var cldl_sct_cd = $(this).data('cldlSctCd');		// 집배달 구분 (P:집하, D:배달)

			if(smutil.isEmpty(inv_no) || smutil.isEmpty(cldl_sct_cd)){
				LEMP.Window.alert({
					"_sTitle" : "문자발송 오류",
					"_vMessage" : "송장번호 혹은\n집배달 구분코드가 없습니다.\n관리자에게 문의해주세요."
				});

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
		// 운임 라벨 표시 html return
		Handlebars.registerHelper('fareChk', function(options) {
			var result = "";
			var btnYn = "";
			var classTxt = "";

			if (!smutil.isEmpty(this.fare_sct_cd)) {

				if (this.cldl_sct_cd === "P") { // 집하
					switch (this.fare_sct_cd) {
					case "01": // 현불 , 금액 표시
						if (this.prcs_fare > 0) {
							result = (this.prcs_fare + "").LPToCommaNumber();
						} else {
							result = (this.summ_fare + "").LPToCommaNumber();
						}
						btnYn = "Y";
						break;
					case "02": // 착불
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
				} else { // 배달
					switch (this.fare_sct_cd) {
					case "01": // 현불
						result = "현불";
						btnYn = "N";
						classTxt = "badge s default";
						break;
					case "02": // 착불, 금액 표시
						if (this.prcs_fare > 0) {
							result = (this.prcs_fare + "").LPToCommaNumber();
						} else {
							result = (this.summ_fare + "").LPToCommaNumber();
						}
						btnYn = "Y";
						break;
					default:
						// result = this.fare_sct_nm;
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
				return new Handlebars.SafeString(result); // mark as already
				// escaped
			} else {
				return "";
			}
		});

		// 신선식품 여부 체크
		Handlebars.registerHelper('fresYnChk', function(options) {
			if (this.fres_yn === "Y") { // 신선식품
				// options.fn == if(true)
				return options.fn(this)
			} else { // 신선식품 아님
				// options.inverse == else
				return options.inverse(this);
			}
		});

		// 집하, 배달 구분(집하 = if true, 배달은=else)
		Handlebars.registerHelper('cldlSctCdChkTag', function(options) {

			var html = "";
			var phoneNumber = "";

			if (this.cldl_sct_cd === "P") { // 집하
				if (!smutil.isEmpty(this.snper_nm)) {
					html = html + '<li>' + this.snper_nm
							+ '</li>';
				}

				var snper_tel = smutil.nullToValue(this.snper_tel, "");
				var snper_cpno = smutil.nullToValue(this.snper_cpno, "");
				phoneNumber = page.getCpNo(snper_tel, snper_cpno);

				if (!smutil.isEmpty(phoneNumber)) {
					html = html + '<li>' + phoneNumber + '</li>';
				}

			} else { // 배달
				if (!smutil.isEmpty(this.acper_nm)) {
					html = html + '<li>' + this.acper_nm
							+ '</li>';
				}

				var acper_tel = smutil.nullToValue(this.acper_tel, "");
				var acper_cpno = smutil.nullToValue(this.acper_cpno, "");

				phoneNumber = page.getCpNo(acper_tel, acper_cpno);

				if (!smutil.isEmpty(phoneNumber)) {
					html = html + '<li>' + phoneNumber + '</li>';
				}

			}

			// 고객요청 인수자 정보 셋팅
			if (!smutil.isEmpty(this.req_acpr_nm)) {
				if (this.req_acpt_rgst_sct_cd == "01") { // 고객요청
					html = html + '<li id="reqAcptSctCd_'
							+ this.inv_no + '" data-req-acpt-sct-cd='
							+ this.req_acpt_sct_cd + '><span class="tGreen">'
							+ this.req_acpr_nm + '</span></li>';
				} else if (this.req_acpt_rgst_sct_cd == "02") { // 기사변경
					html = html + '<li id="reqAcptSctCd_'
							+ this.inv_no + '" data-req-acpt-sct-cd='
							+ this.req_acpt_sct_cd + '><span class="tRed">'
							+ this.req_acpr_nm + '</span></li>';
				}
			}

			if (!smutil.isEmpty(html)) {
				html = '<div class="infoList"><ul>' + html + '</ul></div>';
			}

			return new Handlebars.SafeString(html); // mark as already escaped
		});

		// 집하, 배달 구분(집하 = if true, 배달은=else)
		Handlebars.registerHelper('cldlSctCdChk', function(options) {
			if (this.cldl_sct_cd === "P") { // 집하
				// options.fn == if(true)
				return options.fn(this)
			} else { // 배달
				// options.inverse == else
				return options.inverse(this);
			}
		});

		// 회사 로고 표시
		Handlebars.registerHelper('corpLogoReturn', function(options) {
			return smutil.corpLogoReturn(this.corp_sct_cd);
		});

		// 송장번호 형식 표시
		Handlebars.registerHelper('invNoTmpl', function(options) {
			if (!smutil.isEmpty(this.inv_no)) {
				return (this.inv_no).replace(/([0-9]{4})([0-9]{4})([0-9]{4})/, "$1-$2-$3");
			} else {
				return "송장번호 없음";
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

	},


	initDpEvent : function() {
		page.cmptStatusCnt();
		page.cmptStatus();
	},


	cmptStatusCnt : function() {
		smutil.loadingOn();
		page.apiParam.param.baseUrl = "smapis/cldl/cmptStatusCnt";
		page.apiParam.param.callback = "page.cmptStatusCntCallback";
		smutil.callApi(page.apiParam);
	},


	cmptStatusCntCallback : function(data) {
		try {
			var res = data.data.list[0];
			if (smutil.apiResValidChk(data) && data.code === "0000") {
				var Y_cnt = res.pick_cnt + " / "+ res.dlv_cnt;
				var N_cnt = res.upick_cnt + " / " + res.udlv_cnt;
				$("#Y_cldl0501Cnt").text(Y_cnt);
				$("#N_cldl0501Cnt").text(N_cnt);
			} else {
				LEMP.Window.alert({
					"_sTitle" : "알림",
					"_vMessage" : "완료 현황 데이터 조회에 실패 했습니다."
				});
				$("#Y_cldl0501Cnt").text("0");
				$("#N_cldl0501Cnt").text("0");
			}
		} catch (e) {
		} finally {
			smutil.loadingOff(); // 로딩바 닫기
		}
	},


	cmptStatus : function() {
		smutil.loadingOn();
		page.apiParam.param.baseUrl = "smapis/cldl/cmptStatus";
		page.apiParam.param.callback = "page.cmptStatusCallback";
		page.apiParam.data.parameters = page.cldl0501;
		page.apiParam.data.parameters.page_no = page.page_no;
		page.apiParam.data.parameters.item_cnt = page.item_cnt;

		smutil.callApi(page.apiParam);
	},


	cmptStatusCallback : function(res) {
		try {
			// 조회된 게시물이 있을경우 페이징 처리
			if((smutil.apiResValidChk(res) && res.code === "0000")){

				// handlebars template 시작
				var template = Handlebars.compile($("#CLDL0501_list_template").html());
				$("#CLDL0501LstUl").html(template(res.data));

				var pagObj = smutil.paginate(
					Number(res.data.total_cnt),
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

		} catch (e) {
		} finally {
			smutil.loadingOff(); // 로딩바 닫기
		}
	},


	// 두 번호로 휴대폰 번호가 있는경우 휴대폰 번호를 리턴, 없으면 일반전화번호 리턴
	getCpNo : function(phoneNum1, phoneNum2) {
		var returnNum = "";

		// 둘다 핸드폰 번호가 아닌경우에는 phoneNum1 셋팅
		if ((!phoneNum1.LPStartsWith("010") && !phoneNum1.LPStartsWith("011")
				&& !phoneNum1.LPStartsWith("016") && !phoneNum1
				.LPStartsWith("017"))
				&& (!phoneNum2.LPStartsWith("010")
						&& !phoneNum2.LPStartsWith("011")
						&& !phoneNum2.LPStartsWith("016") && !phoneNum2
						.LPStartsWith("017"))) {
			returnNum = phoneNum1;
		}
		// phoneNum1 가 핸드폰 번호인경우 phoneNum1 셋팅
		else if (phoneNum1.LPStartsWith("010") || phoneNum1.LPStartsWith("011")
				|| phoneNum1.LPStartsWith("016")
				|| phoneNum1.LPStartsWith("017")) {
			returnNum = phoneNum1;
		} else if (!smutil.isEmpty(phoneNum2)) {
			returnNum = phoneNum2;
		}
		return returnNum;
	},




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
			LEMP.Window.alert({
				"_sTitle":"문자발송 오류",
				"_vMessage":"선택한 문자발송 문구가 없습니다."
			});

			return false;
		}



	},
};
