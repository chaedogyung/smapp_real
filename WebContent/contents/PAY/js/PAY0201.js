LEMP.addEvent("resume", "page.resumeInfo"); // 페이지 열릴때마다 스케너 상태확인 호출
var page = {

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


		init:function()
		{
			page.initEvent();			// 페이지 이벤트 등록
			page.initDpEvent();			// 화면 디스플레이 이벤트
		},


		// 페이지 이벤트 등록
		initEvent : function()
		{
			var _this = this;

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


			// 조회버튼 클릭
			$("#schLstBtn").on('click', function(){
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

				// 목록 조회
				page.dtllist();

			});



//			// 조회버튼 클릭 같은게 두개있어서 일단 주석
//			$("#schLstBtn").on('click', function(){
//				var strt_ymd = $('#strt_ymd').val();
//				var end_ymd = $('#end_ymd').val();
//
//				if(smutil.isEmpty(strt_ymd)
//						|| smutil.isEmpty(end_ymd)){
//
//					LEMP.Window.alert({
//						"_sTitle":"조회오류",
//						"_vMessage":"조회 날짜를 설정해 주세요."
//					});
//
//					return false;
//				}
//
//				// 목록 조회
//				page.dtllist();
//
//			});


			//환불버튼 클릭
			$(document).on('click',".btn.s.bdRed.w60.fr.refundBtn", function(){
				var pg_stlm_no = $(this).data('pgStlmNo');		// 결제내역 pk (거래번호)

				if(!smutil.isEmpty(pg_stlm_no+"")){
					// 환불정보
					var popUrl = smutil.getMenuProp('PAY.PAY0202', 'url');

					LEMP.Window.open({
						"_sPagePath": popUrl,
						"_oMessage" : {
							"param" : {
								"pg_stlm_no" : pg_stlm_no+""
							}
						}
					});
				}
				else{
					LEMP.Window.alert({
						"_sTitle":"환불 상세조회 오류",
						"_vMessage":"해당 데이터의 거래번호가 없습니다.\n관리자에게 문의해 주세요"
					});

					return false;
				}

			});


			// ###################################### handlebars helper 등록 start
			// 사용기간 셋팅
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




			// 결제일자 셋팅
			Handlebars.registerHelper('setstlmYmd', function(options) {
				var dateTxt = "";
//				console.log("this.stlm_ymd ::: ", this.stlm_ymd);
				// 결제일자
				if(!smutil.isEmpty(this.stlm_ymd)){
					dateTxt = (this.stlm_ymd+"").LPToFormatDate("yyyy년 mm월 dd일");
				}

				return dateTxt;
			});


			// 환불 버튼 셋팅
			Handlebars.registerHelper('setRefundBtn', function(options) {
				var valid_yn = this.valid_yn;			// 결제내역 상태. F: 환불완료, Y : 유효, N: 사용완료 (사용기간 지남)
				var refund_yn = this.refund_yn;			// 환불가능여부 Y/N
				var btnHtml ;

				// 환불가능
				if(refund_yn == "Y"){
					// 환불버튼
					btnHtml = '<button class="btn s bdRed w60 fr refundBtn" data-pg-stlm-no="'+this.pg_stlm_no+'">환불</button>';
				}
				else if(refund_yn == "N"){	// 환불 불가
					if(valid_yn == "N"){		// 사용완료(사용기간지남)
						btnHtml = '<span class="fs14 tGray2 fr">사용완료</span>';
					}
					else{							// 사용중(환불불가)
						btnHtml = '<span class="fs14 tBlue2 fr">사용중(환불불가)</span>';
					}
				}

				return new Handlebars.SafeString(btnHtml); // html 코드 리턴
			});

			// 결제 수단/환불 정보 셋팅
			Handlebars.registerHelper('setStlmMthd', function(options) {
				var html;

				if (this.stlm_mthd === 'all_refund') {
					html = '<dt>환불상태</dt><dd>전체환불</dd>';
				} else if(this.stlm_mthd === 'part_refund') {
					html = '<dt>환불상태</dt><dd>부분환불</dd>';
				} else {
					html = '<dt>결제수단</dt><dd>' + this.stlm_mthd + '</dd>';
				}

				return new Handlebars.SafeString(html); // html 코드 리턴
			});


			// ###################################### handlebars helper 등록 end

		},


		// 화면 최초 디스플레이 이벤트
		initDpEvent : function(){

			var _this = this;
			//_this.dtllist();			// 결제내역 리스트 조회

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


		listReLoad : function(){

			// 리스트 조회
			page.dtllist();
		},


		// ################### 결제 내역 목록조회
		// 결제 내역 목록조회
		dtllist : function(){
			var _this = this;

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

			strt_ymd = strt_ymd.split('.').join('')*1;
			end_ymd = end_ymd.split('.').join('')*1;

			_this.apiParam.param.baseUrl = "smapis/pay/dtllist";			// api no
			_this.apiParam.param.callback = "page.dtllistCallback";			// callback methode
			_this.apiParam.data = {"parameters" : {
				"strt_ymd" : strt_ymd,
				"end_ymd" : end_ymd
			}};						// api 통신용 파라메터

			// 프로그래스바 열기
			smutil.loadingOn();

			// 공통 api호출 함수
			smutil.callApi(_this.apiParam);

			// 파라메터 전역변수 초기화
			page.apiParamInit();
		},


		// 결제 내역 목록조회 api호출 callback
		dtllistCallback : function(result){
			
			page.apiParamInit();		// 파라메터 전역변수 초기화
			
			// api 결과 성공여부 검사
			if(smutil.apiResValidChk(result) && result.code == "0000"){

				// 조회 결과 데이터가 있으면 옵션 생성
				if(result.data_count > 0){
					
					var data = result.data;

					// 핸들바스 템플릿 가져오기
					var source = $("#pay0201_list_template").html();

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
		// ################### 결제 내역 조회 end
		// 상세내역에서 돌아올때 새로고침
		resumeInfo : function(){
			var strt_ymd = $('#strt_ymd').val();
			var end_ymd = $('#end_ymd').val();
			
			if(strt_ymd!="" && end_ymd!=""){
				page.listReLoad();				// 리스트 제조회	
			}
			
		}

};

