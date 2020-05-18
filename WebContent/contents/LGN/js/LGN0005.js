LEMP.addEvent("backbutton", "page.callbackBackButton");

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
			// 로그인 성공 토큰
			if(arg && !smutil.isEmpty(arg.data) 
					&& !smutil.isEmpty(arg.data.param)
					&& !smutil.isEmpty(arg.data.param.accessToken)){
				// 토큰  전역변수 셋팅
				page.accessToken = arg.data.param.accessToken;
			}
			
			// 오늘날짜
			var curDate = new Date();
			$('.titBox.curDate').text(curDate.LPToFormatDate("yyyy.mm.dd"));
			
			page.initEvent();			// 페이지 이벤트 등록
			page.initDpEvent();			// 화면 디스플레이 이벤트
			
//			LEMP.Window.alert({
//				"_sTitle":"사용료 결제 대상",
//				"_vMessage":"사용료 결제 대상입니다.\n결제를 진행해주세요."
//			});
		},
		
		accessToken : null,				// 로그인 성공한 토큰값
		
		// 페이지 이벤트 등록
		initEvent : function()
		{
			var _this = this;
			
			/* 닫기 버튼 클릭 */
			$(".closeBtn").on('click',function(){
				// 저장되어있던 토큰 삭제
				LEMP.Properties.remove({_sKey:"accessToken"});
				LEMP.Window.close();
			});
			
			
			//사용료 계산버튼 클릭
			$("#payCalcBtn").on('click', function(){
				
				if(page.accessToken){
					page.payCalc();		// 사용료 계산
				}
				else {
					LEMP.Window.alert({
						"_sTitle":"사용료 계산 오류",
						"_vMessage":"사용료 계산에 필요한 사용자정보가 없습니다.\n관리자에게 문의해 주세요."
					});
					
					return false;
				}
				
			});
			
			
			//사용료 결제버튼 클릭
			$("#paymentBtn").on('click', function(){
				if(page.accessToken){
					page.callPayment();		// 사용료 결제
				}
				else {
					LEMP.Window.alert({
						"_sTitle":"사용료 결제 오류",
						"_vMessage":"사용료 결제에 필요한 사용자정보가 없습니다.\n관리자에게 문의해 주세요."
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
		},
		
		
		// ################### 사용료 계산요청 start
		// 사용료 계산 api호출
		payCalc : function(){
			
			var _this = this;
			var pay_month = ($('#pay_month').val() * 1);						// 사용계월 수
			
			_this.apiParamInit();	// 파라메터 전역변수 초기화
			_this.apiParam.id = "PAYMENTHTTP";
			_this.apiParam.param.baseUrl = "smapis/pay/calc";					// api no
			_this.apiParam.param.callback = "page.payCalcCallback";				// callback methode
			_this.apiParam.param.accessToken = page.accessToken;				// accessToken
			_this.apiParam.data = {
				"parameters" : {
					"pay_month" : pay_month
				}
			};							// api 통신용 파라메터
			
			// 프로그래스바 열기
			smutil.loadingOn();
			
			// 공통 api호출 함수 
			smutil.callApi(_this.apiParam);
			
			// 파라메터 전역변수 초기화
			_this.apiParamInit();
		},
		
		
		// 결제사용료계산요청 callback
		payCalcCallback : function(result){
			page.apiParamInit();		// 파라메터 전역변수 초기화
			var useDateText = "";
			// api 결과 성공여부 검사
			if(smutil.apiResValidChk(result) && result.code == "0000"){
				
				// 조회 결과 데이터가 있으면 옵션 생성
				if(result.data_count > 0){
					
					var data = result.data.list;
					
					if(data.length > 0){
						
						data = data[0];

						// 사용금액 셋팅
						if(!smutil.isEmpty(data.pay_amount+"")){
							$('#pay_amount').val((data.pay_amount+"").LPToCommaNumber());
						}
						else{
							$('#pay_amount').val('');
						}
						
						// 사용 시작일
						if(!smutil.isEmpty(data.pay_from_ymd)){
							$('#useDate').data("fromYmd", data.pay_from_ymd+"");
							useDateText = (data.pay_from_ymd+"").LPToFormatDate("yyyy년 mm월 dd일");
						}
						else{
							$('#useDate').removeData('fromYmd');
						}
						
						// 사용 종료일
						if(!smutil.isEmpty(data.pay_end_ymd)){
							$('#useDate').data("endYmd", data.pay_end_ymd+"");
							useDateText = useDateText + " ~ " + (data.pay_end_ymd+"").LPToFormatDate("yyyy년 mm월 dd일");
						}
						else{
							$('#useDate').removeData('endYmd');
						}
						
						$('#useDate').text(useDateText);
					}
					else{
						$('#pay_amount').val('');		// 사용금액 초기화
						$('#useDate').text('');			// 날짜 초기화
						$('#useDate').removeData('fromYmd');
						$('#useDate').removeData('endYmd');
					}
				}
				else{
					$('#pay_amount').val('');		// 사용금액 초기화
					$('#useDate').text('');			// 날짜 초기화
					$('#useDate').removeData('fromYmd');
					$('#useDate').removeData('endYmd');
				}
				
			}
			else{
				$('#pay_amount').val('');		// 사용금액 초기화
				$('#useDate').text('');			// 날짜 초기화
				$('#useDate').removeData('fromYmd');
				$('#useDate').removeData('endYmd');
			}
			
			// 프로그래스바 닫기
			smutil.loadingOff();
			
		},
		// ################### 사용료 계산요청 end
		
		
		// ################### 사용료 결제요청 start
		// 사용료 결제요청
		callPayment : function(){
			
			// 파라메터 전역변수 초기화
			page.apiParamInit();
			
			
			// 토큰값이 없으면 결제 진행 못함
			if(smutil.isEmpty(page.accessToken)){
				LEMP.Window.alert({
					"_sTitle":"결제 오류",
					"_vMessage":"결제에 필요한 사용자정보가 없습니다.\n관리자에게 문의해주세요."
				});
				
				return false;
			}
			
			var pay_amount = $('#pay_amount').val();				// 사용료
			var strt_ymd = $('#useDate').data('fromYmd');			// 사용시작일
			var end_ymd = $('#useDate').data('endYmd');				// 사용종료일
			var pay_mth = $("#pay_mth").val();						// 결제방법 01:카드, 02:모바일
			var cpno = LEMP.Properties.get({						// 전화번호
				"_sKey" : "dataCpno"
			});
			
			
			if(smutil.isEmpty(pay_amount)
					|| smutil.isEmpty(strt_ymd)
					|| smutil.isEmpty(end_ymd)){
				
				LEMP.Window.alert({
					"_sTitle":"결제 오류",
					"_vMessage":"사용료 계산을 먼저 실행해 주세요."
				});
				
				return false;
			}
			
			pay_amount = pay_amount.split(',').join('');
			
			// param 셋팅
			page.apiParamInit();		// 파라메터 초기화
			page.apiParam.id = "PAYMENT";
			page.apiParam.param.callback = "payCallback";
			page.apiParam.data = {
				"pay_amount" : pay_amount, 
				"strt_ymd" : strt_ymd,
				"end_ymd" : end_ymd,
				"accessToken" : page.accessToken,
				"pay_mth" : pay_mth,
				"cpno" : cpno
			};

			smutil.nativeMothodCall(page.apiParam);
		},
		
		
		// 결제 완료후 callback
		payCallback : function(res){
			// 파라메터 전역변수 초기화
			page.apiParamInit();
			
			if(res && res.status){
				switch (res.status) {
					case "SUCCESS":
						// 저장되어있던 토큰 삭제
						LEMP.Properties.remove({_sKey:"accessToken"});
						
						LEMP.Window.alert({
							"_sTitle":"결제 완료",
							"_vMessage":"결제가 정상적으로 완료되었습니다.\n다시 로그인해주세요."
						});
						
						LEMP.Window.close({
							"_sCallback" : "page.paymentCallback"
						});
						
						break;
						
					case "CANCEL":
						LEMP.Window.alert({
							"_sTitle":"결제 취소",
							"_vMessage":"결제가 실패되었습니다.\n관리자에게 문의해주세요."
						});
						
						break;
					case "FAILURE":
						
						LEMP.Window.alert({
							"_sTitle":"결제 실패",
							"_vMessage":"결제가 실패되었습니다.\n관리자에게 문의해주세요."
						});
						
						break;
		
					default:
						break;
				}
			}
			else{
				LEMP.Window.alert({
					"_sTitle":"결제 오류",
					"_vMessage":"결제가 정상적으로 완료되지 못했습니다.\n관리자에게 문의해주세요."
				});
			}
		},
		// ################### 사용료 결제요청 end
		
		
		// 물리적 뒤로가기 버튼 클릭시 종료여부 설정
		callbackBackButton : function() {
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
					// 저장되어있던 토큰 삭제
					LEMP.Properties.remove({_sKey:"accessToken"});
					
					// 팝업닫기
					LEMP.Window.close({
						"_sCallback" : "page.paymentCallback"
					});
				}
			});

			LEMP.Window.confirm({
				_vMessage : "결제를 종료하면 앱을 사용할수 없습니다.\n결제를 종료하시겠습니까?",
				_aTextButton : [ btnCancel, btnConfirm ]
			});
		},
		
};

