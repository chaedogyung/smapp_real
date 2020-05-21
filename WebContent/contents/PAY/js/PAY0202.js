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


		init:function(arg)
		{
			// 거래번호
			if(!smutil.isEmpty(arg.data)
					&& !smutil.isEmpty(arg.data.param)
					&& !smutil.isEmpty(arg.data.param.pg_stlm_no)){
				page.pg_stlm_no = arg.data.param.pg_stlm_no;
			}

			if(smutil.isEmpty(page.pg_stlm_no)){
				LEMP.Window.alert({
					"_sTitle":"환불 상세조회 오류",
					"_vMessage":"해당 데이터의 거래번호가 없습니다.\n관리자에게 문의해 주세요"
				});

				// 팝업 닫기
				LEMP.Window.close();
			}


			// 오늘날짜
			page.initEvent();			// 페이지 이벤트 등록
			page.initDpEvent();			// 화면 디스플레이 이벤트
		},

		pg_stlm_no : null,				// 거래번호

		// 페이지 이벤트 등록
		initEvent : function()
		{
			var _this = this;

			/* 닫기 버튼 클릭 */
			$(".closeBtn").on('click',function(){
				LEMP.Window.close();
			});


			//환불버튼 클릭
			$("#refundBtn").on('click', function(){

				var btnCancel = LEMP.Window.createElement({
					_sElementName : "TextButton"
				});
				btnCancel.setProperty({
					_sText : "취소",
					_fCallback : function() {
					}
				});

				var btnConfirm = LEMP.Window.createElement({
					_sElementName : "TextButton"
				});
				btnConfirm.setProperty({
					_sText : "확인",
					_fCallback : function() {
						page.payCcl();		// 환불
					}
				});

				LEMP.Window.confirm({
					_vMessage : "해당 결제정보를 환불하시겠습니까?",
					_aTextButton : [ btnCancel, btnConfirm ]
				});


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

				return smutil.nullToValue(dateTxt,'');
			});



			// 결제일 셋팅
			Handlebars.registerHelper('setStlmYmdText', function(options) {
				var dateTxt;
				// 결제일
				if(!smutil.isEmpty(this.stlm_ymd)){
					dateTxt = (this.stlm_ymd+"").LPToFormatDate("yyyy년 mm월 dd일");
				}

				return smutil.nullToValue(dateTxt,'');
			});


			// ###################################### handlebars helper 등록 end

		},


		// 화면 최초 디스플레이 이벤트
		initDpEvent : function(){

			var _this = this;
			_this.payDtl();			// 환불정보 조회
		},



		// ################### 환불정보 조회
		// 환불정보 조회 api호출
		payDtl : function(){
			var _this = this;
			var pg_stlm_no = _this.pg_stlm_no;		// 거래번호

			if(smutil.isEmpty(pg_stlm_no)){
				LEMP.Window.alert({
					"_sTitle":"환불 상세조회 오류",
					"_vMessage":"해당 데이터의 거래번호가 없습니다.\n관리자에게 문의해 주세요"
				});

				// 팝업 닫기
				LEMP.Window.close();

			}

			_this.apiParam.param.baseUrl = "smapis/pay/dtl";					// api no
			_this.apiParam.param.callback = "page.payDtlCallback";			// callback methode
			_this.apiParam.data = {"parameters" : {
				"pg_stlm_no" : pg_stlm_no
			}};								// api 통신용 파라메터

			// 프로그래스바 열기
			smutil.loadingOn();

			// 공통 api호출 함수
			smutil.callApi(_this.apiParam);

			// 파라메터 전역변수 초기화
			page.apiParamInit();
		},


		// 환불정보 조회 api호출 callback
		payDtlCallback : function(result){

			page.apiParamInit();		// 파라메터 전역변수 초기화

			// api 결과 성공여부 검사
			if(smutil.apiResValidChk(result) && result.code == "0000"){

				// 조회 결과 데이터가 있으면 옵션 생성
				if(result.data_count > 0){

					var data = result.data.list[0];

					// 거래번호
					$('#pg_stlm_no').val(data.pg_stlm_no);

					// 승인번호
					$('#pg_auth_no').val(data.pg_auth_no);

					// 사용기간 셋팅
					var dateTxt;
					// 사용 시작일
					if(!smutil.isEmpty(data.use_strt_ymd)){
						dateTxt = (data.use_strt_ymd+"").LPToFormatDate("yyyy년 mm월 dd일");
					}

					// 사용 종료일
					if(!smutil.isEmpty(data.use_end_ymd)){
						dateTxt = dateTxt + " ~ " + (data.use_end_ymd+"").LPToFormatDate("yyyy년 mm월 dd일");
					}

					$('#useFromToDate').text(smutil.nullToValue(dateTxt,''));	// 사용기간

					// 결제일
					if(!smutil.isEmpty(data.stlm_ymd)){
						$('#stlm_ymd').text((data.stlm_ymd+"").LPToFormatDate("yyyy년 mm월 dd일"));
					}


					// 결제금액 개월
					dateTxt = "";
					// 결제금액
					if(!smutil.isEmpty(data.stlm_amt+"")){
						dateTxt = (data.stlm_amt+"").LPToCommaNumber()+"원";
					}

					// 결제한 개월수
					if(!smutil.isEmpty(data.stlm_month+"")){
						dateTxt = dateTxt + "(" + (data.stlm_month+"") + "개월)";
					}

					$('#useMoneyMonth').text(smutil.nullToValue(dateTxt,''));		// 결제금액 개월 셋팅
					$('#stlm_mthd').text(smutil.nullToValue(data.stlm_mthd,''));	// 결제수단

					// 사용종료일
					if(!smutil.isEmpty(data.refund_use_end_ymd)){
						$('#refund_use_end_ymd').text((data.refund_use_end_ymd+"").LPToFormatDate("yyyy년 mm월 dd일"));
					}

					// 환불예정금액 개월
					dateTxt = "";
					// 환불예정금액
					if(!smutil.isEmpty(data.refund_amount+"")){
						dateTxt = (data.refund_amount+"").LPToCommaNumber()+"원";
						$('#refund_amount').val(data.refund_amount);				// 환불예정금액 셋팅
					}

					// 환불 개월수
					if(!smutil.isEmpty(data.refund_month+"")){
						dateTxt = dateTxt + "(" + (data.refund_month+"") + "개월)";
					}

					$('#refundInfo').text(smutil.nullToValue(dateTxt,''));		// 환불예정금액

					//버튼 text 표시
					if(!smutil.isEmpty(data.refund_amount+"")){
						dateTxt = (data.refund_amount+"").LPToCommaNumber()+"원 취소하기";
						$('#refundBtn').text(smutil.nullToValue(dateTxt,''));		// 환불예정금액
					}
				}

			}

			// 프로그래스바 닫기
			smutil.loadingOff();

		},
		// ################### 필터조건 조회 end



		// 환불요청
		payCcl : function(){
			var pg_stlm_no = $('#pg_stlm_no').val();
			var refund_amount = $('#refund_amount').val();

			if(!smutil.isEmpty(pg_stlm_no) && !smutil.isEmpty(refund_amount)){

				// param 셋팅
				page.apiParamInit();		// 파라메터 초기화
				page.apiParam.param.baseUrl = "smapis/pay/ccl";				// api no
				page.apiParam.param.callback = "page.payCclCallback";		// callback methode
				page.apiParam.data = {"parameters" : {
					"pg_stlm_no" : pg_stlm_no,
					"ccl_stlm_amt" : refund_amount*1
				}};						// api 통신용 파라메터

				// 프로그래스바 열기
				smutil.loadingOn();

				// 공통 api호출 함수
				smutil.callApi(page.apiParam);

				page.apiParamInit();		// 파라메터 전역변수 초기화
			}
			else{
				LEMP.Window.alert({
					"_sTitle":"환불 오류",
					"_vMessage":"해당 데이터의 거래번호가 없습니다.\n관리자에게 문의해 주세요"
				});
			}
		},



		// 환불요청 callback
		payCclCallback : function(result){

			// api 결과 성공여부 검사
			if(result.code == "0000" || result.code == "00"){
				// 환불 완료 & 사용 가능 사용자
				LEMP.Window.alert({
					"_sTitle":"환불 완료",
					"_vMessage": result.message
				});

				// 팝업 닫기
				LEMP.Window.close();

			}
			else if(result.code === "0001") {
				// 환불 완료 & 사용 불가능 사용자
				var textButton = LEMP.Window.createElement({
					'_sElementName': 'TextButton'
				});

				textButton.setProperty({
					_sText: '확인',
					_fCallback: function() {
						smutil.logout();
					}
				});

				LEMP.Window.alert({
					"_sTitle":"환불 완료",
					"_vMessage": result.message,
					"_eTextButton": textButton
				});
			}
			else{
				LEMP.Window.alert({
					"_sTitle":"환불 실패",
					"_vMessage": result.message
				});
			}
			// 프로그래스바 닫기
			smutil.loadingOff();
		},

};

