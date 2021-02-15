// LEMP.addEvent("backbutton", "page.callbackBackButton");		// 뒤로가기 버튼 클릭시 이벤트
var page = {
		cldl0701 :{},				// 전달받은 파라메터
		dprtCnt : null,				// 최상단 전체, 배달, 집하 조회 건수
		selectedSchTime : null,		// 선택한 시간구분값
		rsn_cont : "",				// 직접입력 텍스트 또는 지정일
		dlay_rsn_cd : null,			// 미배달 사유 등록코드
		param_list : [],			// 미배달 전송할 송장 리스트
		order : "01",				// 배달완료 정렬방식

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

		init : function(arg)
		{
			//이전메뉴 확인
			if(!smutil.isEmpty(arg.data.param)){
				page.cldl0701 = arg.data.param;
				//팝업에서 들어왔을경우 미배달 사유(심야배송) 자동설정
				if(page.cldl0701.menu_id === "pop"){
					let code = "42";
					let name = "심야배송으로 인한 익일배송"
					$('#bdCancelTxt').val(name);			// 미배달 사유 text
					$('#bdCancelCode').val(code);			// 미배달 사유 code
					$('.bdCancelTxtView').text(name);		// 미배달 사유 text
					page.dlay_rsn_cd = code;				// 미배달 사유 등록코드
				}
			}

			// 달력셋팅
			var curDate = new Date();
			curDate = curDate.getFullYear() + "." + ("0"+(curDate.getMonth()+1)).slice(-2) + "." + ("0"+curDate.getDate()).slice(-2);
			$('#cldlBtnCal').text(curDate);

			// 배달완료 정렬방식 세팅
			page.order = LEMP.Properties.get({"_sKey":"order"});
			if(smutil.isEmpty(page.order)){
				page.order = "01";
			}
			$("#select_order").val(page.order).prop("selected", true);

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

			// 배달완료 정렬방식 변경
			$("#select_order").on('change', function(){
				LEMP.Properties.set({"_sKey" : "order", "_vValue" : $('#select_order').val()});
				page.order = $('#select_order').val();
				page.listReLoad();					// 리스트 제조회
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

			// 미배달 설정 버튼 클릭
			$(document).on('click', '.bdCancel', function(e){
				let popUrl = smutil.getMenuProp("COM.COM0701","url");
				LEMP.Window.open({
					"_sPagePath":popUrl,
					"_oMessage" : {
						"param" : {
							"menu_id":"CLDL0701"
							, "cldl_sct_cd" : "D"	//배달로 고정
						}
					}
				});
			});

			// 등록(전송) 버튼 클릭
			$('#cmptTrsmBtn').click(function(e){
				if(smutil.isEmpty(page.dlay_rsn_cd)){
					LEMP.Window.alert({
						"_sTitle":"미배달 전송 오류",
						"_vMessage":"미배달 사유를 선택해주세요",
					});
					return false;
				}

				let liLst = $('.baedalListBox > ul > li');
				let inv_no;									// li 에 걸려있는 송장번호
				let param_list = [];						// 전송할 리스트 배열
				let invNoObj = {};

				// 모든 li 리스트를 돌면서 스캔한 데이터와 체크박스의 체크한 데이터를 셋팅한다.
				$.each(liLst, function(idx, liObj){
					inv_no = $(liObj).attr('id')+"";
					// 체크박스에 체크한 데이터 (기본적으로 스캔 안한데이터이다)
					if($('#'+inv_no+'_chk').prop("checked")){
						// 스캔한 송장번호, 스캔여부 전부 Y으로 셋팅
						invNoObj = {"inv_no":inv_no, "scan_yn":"N"};
						param_list.push(invNoObj);
					}
				});

				page.param_list = param_list;

				let scanCnt = 0;
				scanCnt = param_list.length;

				// 컴펌창 호출
				if(scanCnt > 0){
					if(page.dlay_rsn_cd == 42){
						$('#pop2Txt2').html('등록할 데이터 '+scanCnt+'건<br />미배달 사유를 등록합니다.<br />심야배송으로 인한 익일배송 사유로 고객님에게 문자메세지가 발송됩니다');
					}else{
						$('#pop2Txt2').html('등록할 데이터 '+scanCnt+'건<br />미배달 사유를 등록합니다.');
					}
					$('.mpopBox.pop2').bPopup();
				}
				else{
					LEMP.Window.alert({
						"_sTitle":"미배달 전송오류",
						"_vMessage":"전송할 데이터가 없습니다.\n체크박스를 선택해주세요.",
					});

					return;
				}
			});

			// 미배달사유 일괄전송 'yes' 버튼 클릭
			$('#rsnRgstYesBtn').click(function(e){
				// 미배달 전송
				page.sendRsnRgstTxt();
			});

			//헬퍼등록
			page.setHelper();
		},


		// 화면 디스플레이 이벤트
		initDpEvent : function(){
			if(smutil.isEmpty($("#cldlBtnCal").text())){
				LEMP.Window.alert({
					"_sTitle":"리스트 조회오류",
					"_vMessage":"조회할 날짜를 선택해 주세요"
				});
				return false;
			}

			smutil.loadingOn();
			page.cmptList();		//전체 배달완료 리스트 조회
		},

		//helper 등록
		setHelper : function (){
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

				if(!smutil.isEmpty(this.acper_nm)){
					html = html + '<li>' + this.acper_nm + '</li>';
				}

				var acper_tel = smutil.nullToValue(this.acper_tel,"");
				var acper_cpno = smutil.nullToValue(this.acper_cpno,"");

				let phoneNumber = page.getCpNo(acper_tel, acper_cpno);

				if(!smutil.isEmpty(phoneNumber)){
					html = html + '<li>' + phoneNumber + '</li>';
				}

				// 고객요청 인수자 정보 셋팅
				if(!smutil.isEmpty(this.req_acpr_nm)){
					if(this.req_acpt_rgst_sct_cd == "01"){		// 고객요청
						html = html + '<li style="display: inline-block; position: absolute;" id="reqAcptSctCd_'+this.inv_no+'" data-req-acpt-sct-cd='+this.req_acpt_sct_cd+'><span class="tGreenBold">' + this.req_acpr_nm + '</span></li>';
					}
					else if(this.req_acpt_rgst_sct_cd == "02"){		// 기사변경
						html = html + '<li style="display: inline-block; position: absolute;" id="reqAcptSctCd_'+this.inv_no+'" data-req-acpt-sct-cd='+this.req_acpt_sct_cd+'><span class="tRed">' + this.req_acpr_nm + '</span></li>';
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

			// 스캔한 데이터인지 여부 확인 (미배달 사유 일괄전송 에서는 스캔여부 구분하지 않음)
			Handlebars.registerHelper('scanYnClass', function(options) {
				// if(this.scan_cmpt_yn == 'N'){
				// 	return 'off';
				// }
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

		// ################### 페이지 리스트 조회 start
		cmptList : function(){

			var _this = this;
			var cldl_sct_cd = "D";		// 업무구분 (배달 : D)
			// var fltr_sct_cd = $('#fltr_sct_cd').val();		// 필터구분(미배달 사유 일괄전송 화면에서는 사용하지 않음)
			// var cldl_tmsl_cd = _this.returnTimeCd();			// 현재 어느 시간을 선택했는지 검사(미배달 사유 일괄전송 화면에서는 사용하지 않음)

			_this.apiParam.param.baseUrl = "smapis/cldl/cmptList";				// api no
			_this.apiParam.param.callback = "page.cmptListCallback";			// callback methode

			// 날짜셋팅
			var curDate = new Date();
			curDate = curDate.getFullYear() + ("0"+(curDate.getMonth()+1)).slice(-2) + ("0"+curDate.getDate()).slice(-2);
			var base_ymd = smutil.nullToValue($('#cldlBtnCal').text(),curDate);
			base_ymd = base_ymd.split('.').join('');

			_this.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {
					// "fltr_sct_cd" : smutil.nullToValue(fltr_sct_cd+"",""),			// 필터구분(미배달 사유 일괄전송 화면에서는 사용하지 않음)
					// "cldl_tmsl_cd" : smutil.nullToValue(cldl_tmsl_cd+"",""),		// 시간코드(미배달 사유 일괄전송 화면에서는 사용하지 않음)
					"cldl_sct_cd" : smutil.nullToValue(cldl_sct_cd+"","D"),		// 업무구분
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
				// 조회한 결과가 있을경우
				if(smutil.apiResValidChk(result) && result.code == "0000"){

					var data = {};

					if(result){
						data = result.data;
						//2020-08-06 배달완료리스트 역순정렬
						if(page.order == "02"){
							data.list.reverse();
						}
					}

					// 핸들바 템플릿 가져오기
					var source = $("#cldl0701_list_template").html();

					// 핸들바 템플릿 컴파일
					var template = Handlebars.compile(source);

					// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
					var liHtml = template(data);

					// 생성된 HTML을 DOM에 주입
					$('#cldl0701LstUl').html(liHtml);

					//상단에 전체 그리기
					page.showTotalCount(data.list.length);

				}
				else{		// 조회 결과 없음

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
				LEMP.Window.alert({
					"_sTitle":"리스트 조회오류",
					"_vMessage":"조회할 날짜를 선택해 주세요"
				});
				return false;
			}

			smutil.loadingOn();				// 로딩바 시작
			page.cmptList();				// 전체 리스트 조회
		},

		// 미배달사유 설정버튼 콜백
		com0701Callback : function(res){
			if(!smutil.isEmpty(res.param.code) && !smutil.isEmpty(res.param.name)){
				//심야배송 선택했을경우 시간체크
				if(res.param.code == 42){
					if(!smutil.isMidnight()){
						LEMP.Window.alert({
							"_sTitle":"미배달 사유 선택 오류",
							"_vMessage":"심야배송으로 인한 익일배송은 20시 30분 이후에 선택 가능합니다."
						});
						return false;
					}
				}

				$('#bdCancelTxt').val(res.param.name);			// 미배달 사유 text
				$('#bdCancelCode').val(res.param.code);			// 미배달 사유 code
				$('.bdCancelTxtView').text(res.param.name);		// 미배달 사유 text

				//미배달 사유 page에 저장
				if(!smutil.isEmpty(res.param.value)){
					page.rsn_cont = res.param.value; 				// 직접입력 텍스트 또는 지정일
				}
				page.dlay_rsn_cd = res.param.code;				// 미배달 사유 등록코드
			}
		},

		// ################### 미배달 전송 start
		sendRsnRgstTxt : function (){
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
				LEMP.Window.alert({
					"_sTitle":"미배달 처리 오류",
					"_vMessage":"선택한 미배달 송장번호 혹은 \n미배달 사유가 없습니다."
				});

				return false;
			}
		},

		// 미배달 처리 콜백
		rsnRgstCallback : function(result) {
			page.apiParamInit();			// 파라메터 전역변수 초기화

			// api 전송 성공
			if (smutil.apiResValidChk(result) && result.code == "0000") {
				LEMP.Window.toast({
					"_sMessage": "미배달 처리가 완료되었습니다.",
					"_sDuration": "short"
				});

				page.listReLoad();				// 리스트 제조회
			}
		},
		// ################### 미배달 처리 end

		// 상단 전체카운트 표시
		showTotalCount : function (count){
			let data = {"list" : [{
					"cldl_tmsl_nm": "전체",
					"cldl_tmsl_cd": "19",
					"tmsl_dlv_cnt" : count
				}]};

			// 핸들바 템플릿 가져오기
			let source = $("#cldl0701_timeLst_template").html();

			// 핸들바 템플릿 컴파일
			let template = Handlebars.compile(source);

			// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
			let liHtml = template(data);

			// 생성된 HTML을 DOM에 주입
			$('#cmptTmListUl').html(liHtml);

			/* touchFlow 등록*/
			$(".divisionBox .selectBox").touchFlow();

			// 현제 어느 시간데를 선택했는지 검사
			let timeLstLi = $("li[name='timeLstLi']");

			_.forEach(timeLstLi, function(obj, key) {
				$(obj).addClass('on');

				// 선택한 시간구간 등록
				page.selectedSchTime = $(obj).data('timeLi')+"";
				// 한번만 셋팅하고 바로 루프 나감
				return false;
			});
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

		},

};

