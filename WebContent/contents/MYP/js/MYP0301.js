var page = {
	apiParam : {
		id : "HTTP", // 디바이스 콜 id
		param : {// 디바이스가 알아야할 데이터
			task_id : "", // 화면 ID 코드가 들어가기로함
				// position : {}, // 사용여부 미확정
			type : "",
			baseUrl : "",
			method : "POST", // api 호출 형식(지정 안하면 'POST' 로 자동 셋팅)
			callback : "", // api 호출후 callback function
			contentType : "application/json; charset=utf-8"
		},
		data : {
			"parameters" : {} // api 통신용 파라메터
		}
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

	init : function(){
		page.initInterface();
		page.dtllist(); //결제조회로 테스트
	},
	
	initInterface : function(){
		/* 달력 팝업 */
		$(document).on('click','.inCal',function(){
			var popUrl = smutil.getMenuProp('COM.COM0302', 'url');
			LEMP.Window.open({
				"_sPagePath":popUrl,
				"_oMessage":{
					"param":{"menuId" : "PAY0201"}
				}
			});
		});

		//조회버튼 클릭
		$(document).on('click','#schLstBtn',function(){
			var strt_ymd = $('#strt_ymd').val();
			var end_ymd = $('#end_ymd').val();

			if(smutil.isEmpty(strt_ymd)
				|| smutil.isEmpty(end_ymd)){

				LEMP.Window.alert({
					"_sTitle":"조회오류",
					"_vMessage":"조회 날짜를 설정해 주세요."
				});

				return false;
			}
			page.mileList(); //마일리지 이력조회
		});

		// ###################################### handlebars helper 등록 start
		// 적립일자 셋팅
		Handlebars.registerHelper('acmtYmd', function(options) {
			var dateTxt = "";
//				console.log("this.stlm_ymd ::: ", this.stlm_ymd);
			// 결제일자
			if(!smutil.isEmpty(this.acmt_ymd)){
				dateTxt = (this.acmt_ymd+"").LPToFormatDate("yyyy년 mm월 dd일");
			}
			return dateTxt;
		});


		// 적립/사용여부 셋팅
		Handlebars.registerHelper('acmtSctCd', function(options) {
			var str;

			if (this.acmt_sct_cd === '10') {
				str = "적립";
			} else if(this.acmt_sct_cd === '20') {
				str = "전환";
			}
			return str; // html 코드 리턴
		});

		// 현재미사용
		Handlebars.registerHelper('useFromTo', function(options) {
			var dateTxt;
			// 사용 시작일
			if(!smutil.isEmpty(this.use_strt_ymd)){
				dateTxt = (this.use_strt_ymd+"").LPToFormatDate("yyyy년 mm월 dd일");
			}

			// 사용 종료일
			if(!smutil.isEmpty(this.use_end_ymd)){
				dateTxt = dateTxt + " ~ " + (this.use_end_ymd+"").LPToFormatDate("yyyy년 mm월 dd일");
			}

			//전체환불일 경우 기간에 전체환불로 표시
			if (this.stlm_mthd === 'all_refund') {
				dateTxt = "전체환불";
			}

			return smutil.nullToValue(dateTxt,'');
		});


		// 결제금액과 결제개월수 셋팅
		Handlebars.registerHelper('useMoneyMonth', function(options) {
			var returnTxt;

			// 결제금액
			if(!smutil.isEmpty(this.stlm_amt+"")){
				returnTxt = (this.stlm_amt+"").LPToCommaNumber()+"원";
			}

			// 결제한 개월수
			if(!smutil.isEmpty(this.stlm_month+"")){
				returnTxt = returnTxt + "(" + (this.stlm_month+"") + "개월)";
			}

			return smutil.nullToValue(returnTxt,'');
		});

		// ###################################### handlebars helper 등록 end
	},

	//달력 팝업 callback
	popCallback :function(args){

		if(!smutil.isEmpty(args.start)){
			$('#strt_ymd').val(args.start);
		}
		else{
			$('#strt_ymd').val('');
		}

		if(!smutil.isEmpty(args.end)){
			$('#end_ymd').val(args.end);
		}
		else{
			$('#end_ymd').val('');
		}

		page.listReLoad();				// 리스트 제조회
	},

	// ################### 기간설정 없이 조회
	// 기간설정 없이 조회
	dtllist : function(){
		var _this = this;
		_this.apiParam.param.baseUrl = "smapis/point/hst";			// api no
		_this.apiParam.param.callback = "page.dtllistCallback";			// callback methode
		_this.apiParam.data = {"parameters" : {
			}};						// api 통신용 파라메터

		// 프로그래스바 열기
		smutil.loadingOn();

		// 공통 api호출 함수
		smutil.callApi(_this.apiParam);

		// 파라메터 전역변수 초기화
		page.apiParamInit();
	},

	// 기간설정 없이 조회 api호출 callback
	dtllistCallback : function(result){

		page.apiParamInit();		// 파라메터 전역변수 초기화

		// api 결과 성공여부 검사
		if(smutil.apiResValidChk(result) && result.code == "0000"){

			// 조회 결과 데이터가 있으면 옵션 생성
			if(result.data_count > 0){

				var data = result.data;


				// 핸들바스 템플릿 가져오기
				var source = $("#myp0301_list_template").html();

				// 핸들바 템플릿 컴파일
				var template = Handlebars.compile(source);

				// 핸들바스 템플릿에 데이터를 바인딩해서 HTML 생성
				var liHtml = template(data);

				// 생성된 HTML을 DOM에 주입
				$('#dtllistUl').html(liHtml);
			}
		}

		// 프로그래스바 닫기
		smutil.loadingOff();

	},
	// ################### 기간설정 없이 조회 end

	// 상세내역에서 돌아올때 새로고침
	resumeInfo : function(){
		var strt_ymd = $('#strt_ymd').val();
		var end_ymd = $('#end_ymd').val();

		if(strt_ymd!="" && end_ymd!=""){
			page.listReLoad();				// 리스트 제조회
		}
	},

	//조회
	mileList : function(){
		smutil.loadingOn();
		page.apiParam.param.baseUrl = "/smapis/cmn/smInf";
		page.apiParam.param.callback = "page.mileListCallback";
		page.apiParam.data = {
			"parameters" : {
			}
		}
		smutil.callApi(page.apiParam);
	},

	mileListCallback :function(res){
		try{
			if(smutil.apiResValidChk(res) && res.code === "0000"){
				LEMP.Window.toast({
					"_sMessage" : "mileListCallback",
					"_sDuration" : "short"
				});

				var source = $("#MYP0101_template").html();
				var template = Handlebars.compile(source);

				Handlebars.registerHelper('monSumMyp', function(res){
					var data = res.data.root;
					return Number(data.cur_pick_rate)+Number(data.cur_dlv_rate);
				});

				Handlebars.registerHelper('infoMonL', function(res){
					var data = res.data.root.cur_mon;
					var FData = data.substring(0,4);
					var LData = data.substring(4,6);
					return FData+"년 "+LData+"월";
				});
				Handlebars.registerHelper('infoMonC', function(res){
					var data = res.data.root.cur_mon;
					var LData = data.substring(4,6);
					return LData+"월";
				});

				Handlebars.registerHelper('2mag', function(res){
					var data = res.data.root.cur_mon;
					var LData = Number(data.substring(4,6))-2+"월";
					if(LData=="0월"){
						LData ="12월";
					}else if(LData =="-1월"){
						LData ="11월";
					}

					return LData;
				});

				Handlebars.registerHelper('1mag', function(res){
					var data = res.data.root.cur_mon;
					var LData = String(Number(data.substring(4,6))-1)+"월";
					if(LData === "0월"){
						LData = "12월";
					}
					return LData;
				});


//				if(smutil.isEmpty(res.emp_img_path)){
//					res.emp_img_path = '../../common/img/icon-man.png';
//				}

				$("#MypInfoList").html(template(res));

				$('#bacodeNumber').barcode(res.k7_conf_no,"ean13",{barWidth:2, barHeight:50});
			}
		}catch(e){}
		finally{
			smutil.loadingOff();
		}
	}

}