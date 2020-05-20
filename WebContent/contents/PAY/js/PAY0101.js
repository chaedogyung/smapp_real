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
			// 오늘날짜
			var curDate = new Date();
			$('.titBox.curDate').text(curDate.LPToFormatDate("yyyy.mm.dd"));
			
			page.initEvent();			// 페이지 이벤트 등록
			page.initDpEvent();			// 화면 디스플레이 이벤트
		},
		
		accessToken : null,
		
		// 페이지 이벤트 등록
		initEvent : function()
		{
			var _this = this;
			
			//사용료 계산버튼 클릭
			$("#payCalcBtn").on('click', function(){
				// 토큰
				var accessToken = LEMP.Properties.get({
					"_sKey" : "accessToken"
				});
				
				
				if(smutil.isEmpty(accessToken)){
					LEMP.Window.alert({
						"_sTitle":"사용료 계산 오류",
						"_vMessage":"사용료 계산에 필요한 사용자정보가 없습니다.\n관리자에게 문의해 주세요."
					});
					
					return false;
				}
				
				page.accessToken = accessToken;
				
				// 현제날짜
				var curDate = new Date();
				curDate = curDate.LPToFormatDate("yyyymmdd");
				
				// 결제된 데이터가 2건 이하이고 사용가능일로부터 7일 이내에만 결제 가능
				if(!smutil.isEmpty(page.paymentCnt) 
						&& !smutil.isEmpty(page.paymentUseEndYmd)
						&& !smutil.isEmpty(curDate)){
					
					// 결제 내역 건수가 1건 이하이면서 사용 종료일 7일 이전부터 결제가 가능하다
					if(page.paymentCnt <= 1 
							&& (curDate.LPDateDiff(page.paymentUseEndYmd) + 1) <= 7){
						page.payCalc();		// 사용료 계산
					}
					
				}
			});
			
			
			
			
			//사용료 결제버튼 클릭
			$("#paymentBtn").on('click', function(){
				
				// 토큰
				var accessToken = LEMP.Properties.get({
					"_sKey" : "accessToken"
				});
				
				
				if(smutil.isEmpty(accessToken)){
					LEMP.Window.alert({
						"_sTitle":"사용료 계산 오류",
						"_vMessage":"사용료 계산에 필요한 사용자정보가 없습니다.\n관리자에게 문의해 주세요."
					});
					
					return false;
				}
				page.accessToken = accessToken;
				
				var curDate = $('.titBox.curDate').text();
				if(!smutil.isEmpty(curDate)){
					curDate = curDate.split('.').join(''); 
				}
				
				// 결제된 데이터가 2건 이하이고 사용가능일로부터 7일 이내에만 결제 가능
				if(!smutil.isEmpty(page.paymentCnt) 
						&& !smutil.isEmpty(page.paymentUseEndYmd)
						&& !smutil.isEmpty(curDate)){
					
					// 결제 내역 건수가 1건 이하이면서 사용 종료일 7일 이전부터 결제가 가능하다
					if(page.paymentCnt <= 1 
							&& (curDate.LPDateDiff(page.paymentUseEndYmd) + 1) <= 7){
						
						var pay_amount = $('#pay_amount').val();			// 사용금액
						pay_amount = pay_amount.split(',').join('');
						var fromYmd = $('#useDate').data('fromYmd');		// 사용시작일
						var endYmd = $('#useDate').data('endYmd');			// 사용종료일
						
						// 사용료 계산을 완료한 경우만 결제 가능
						if(!smutil.isEmpty(pay_amount)
								&& !smutil.isEmpty(fromYmd)
								&& !smutil.isEmpty(endYmd)){
							
							page.callPayment();		// 사용료 결제
							
						}
					}
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
			_this.payList();			// 결제내역 리스트 조회
			
		},
		
		
		paymentCnt : null,				// 결제내역 건수
		paymentUseEndYmd : null,		// 최종 사용 종료일
		
		
		// ################### 결제 현황 조회
		// 결제 현황 조회 api호출
		payList : function(){
			var _this = this;
			// 파라메터 전역변수 초기화
			page.apiParamInit();
			
			_this.apiParam.param.baseUrl = "smapis/pay/list";					// api no
			_this.apiParam.param.callback = "page.payListCallback";				// callback methode
			_this.apiParam.data = {"parameters" : {}};							// api 통신용 파라메터
			
			// 프로그래스바 열기
			smutil.loadingOn();
			
			// 공통 api호출 함수 
			smutil.callApi(_this.apiParam);
			
			// 파라메터 전역변수 초기화
			page.apiParamInit();
		},
		
		
		// 결제 현황 조회 api호출 callback
		payListCallback : function(result){
			
			page.apiParamInit();		// 파라메터 전역변수 초기화
			
			// api 결과 성공여부 검사
			if(smutil.apiResValidChk(result) && result.code == "0000"){
				
				// 조회 결과 데이터가 있으면 옵션 생성
				if(result.data_count > 0){
					
					var data = result.data;
					
//					console.log("data11111  ", data);			// (test)
//					data.list = [(data.list)[1]];				// (test)
//					console.log("data2222  ", data);			// (test)
					
					page.paymentCnt = result.data_count;		// 결제 현황 건수 전역변수 셋팅
//					page.paymentCnt = data.list.length;		// 결제 현황 건수 전역변수 셋팅(test)

					// 최종 사용일도 구해야 한다.
					var endDateLst = [];
					var max;
					
					// 사용 종료일 리스트 셋팅
					$.each(data.list, function(idx, Obj){
						if(Obj && Obj.use_end_ymd){
							endDateLst.push((Obj.use_end_ymd)*1);		// 날짜를 number type 으로 변환해서 저장
						}
					});
					
					// 최대사용 마지막일자 구하기
					if(endDateLst.length > 0){
						// 최대값 사용일자값
						max = endDateLst.reduce( function (previous, current) { 
							return previous > current ? previous:current;
						});
						
						if(max){
							page.paymentUseEndYmd = max+"";				// 문자 타입으로 변환해서 전역변수 셋팅
						}
					}
					
//					page.paymentUseEndYmd = "20200325";					// (test)
					
					// 핸들바스 템플릿 가져오기
					var source = $("#pay0101_list_template").html();
					
					// 핸들바 템플릿 컴파일
					var template = Handlebars.compile(source);
					
					// 핸들바스 템플릿에 데이터를 바인딩해서 HTML 생성
					var liHtml = template(data);
					
					// 생성된 HTML을 DOM에 주입
					$('#paymentLstDiv').html(liHtml);
					
					// 조회 결과에 따른 화면 디스플레이
					page.displayPament();
					
				}
				
			}
			
			// 프로그래스바 닫기
			smutil.loadingOff();
			
		},
		// ################### 결제 현황 조회 end
		
		
		
		
		// ################### 사용료 결제 화면 디스플레이 start
		// 결제 현황 조회 결과에 따른 화면 디스플레이
		displayPament : function(){
			
//			page.paymentCnt				// 결제내역 건수
//			page.paymentUseEndYmd		// 최종 사용 종료일
			
			// 현재 날짜
			var curDate = new Date();
			curDate = curDate.LPToFormatDate("yyyymmdd");
			
			if(!smutil.isEmpty(page.paymentCnt) 
					&& !smutil.isEmpty(page.paymentUseEndYmd)
					&& !smutil.isEmpty(curDate)){
				
				// 결제 내역 건수가 1건 이하이면서 사용 종료일 7일 이전부터 결제가 가능하다
				if(page.paymentCnt <= 1 
						&& (curDate.LPDateDiff(page.paymentUseEndYmd) + 1) <= 7){
					$('#pay_month').attr('disabled', false);		// 사용계월수 활성화
					$('#payCalcBtn').attr('disabled', false);		// 사용료계산버튼 활성화
					$('#paymentBtn').attr('disabled', false);		// 사용료결제버튼 활성화
					$('#payCalcBtn').addClass('red');
					$('#paymentBtn').addClass('red');
				}
				else {			// 그 외에는 모두 결제 불가능
					$('#pay_month').attr('disabled', true);			// 사용계월수 비활성화
					$('#payCalcBtn').attr('disabled', true);		// 사용료계산버튼 비활성화
					$('#paymentBtn').attr('disabled', true);		// 사용료결제버튼 비활성화
					$('#payCalcBtn').removeClass('red');
					$('#paymentBtn').removeClass('red');
					
					$('#pay_amount').val('');						// 사용금액 초기화
					$('#useDate').text('');							// 날짜 초기화
					$('#useDate').removeData('fromYmd');			// 사용시작일 데이타 초기화
					$('#useDate').removeData('endYmd');				// 사용종료일 데이타 초기화
				}
			}
			else {			// 결제 불가능
				$('#pay_month').attr('disabled', true);			// 사용계월수 비활성화
				$('#payCalcBtn').attr('disabled', true);		// 사용료계산버튼 비활성화
				$('#paymentBtn').attr('disabled', true);		// 사용료결제버튼 비활성화
				$('#payCalcBtn').removeClass('red');
				$('#paymentBtn').removeClass('red');
				
				$('#pay_amount').val('');						// 사용금액 초기화
				$('#useDate').text('');							// 날짜 초기화
				$('#useDate').removeData('fromYmd');			// 사용시작일 데이타 초기화
				$('#useDate').removeData('endYmd');				// 사용종료일 데이타 초기화
			}
			
			
		},
		
		// ################### 사용료 결제 화면 디스플레이 end
		
		
		
		
		// ################### 사용료 계산요청 start
		// 사용료 계산 api호출
		payCalc : function(){
			
			var _this = this;
			var pay_month = ($('#pay_month').val() * 1);						// 사용계월 수
			
			_this.apiParamInit();	// 파라메터 전역변수 초기화
			_this.apiParam.id = "PAYMENTHTTP";
			_this.apiParam.param.accessToken = page.accessToken;				// accessToken
			_this.apiParam.param.baseUrl = "smapis/pay/calc";					// api no
			_this.apiParam.param.callback = "page.payCalcCallback";				// callback methode
			_this.apiParam.data = {"parameters" : {
				"pay_month" : pay_month
			}};							// api 통신용 파라메터
			
			// 프로그래스바 열기
			smutil.loadingOn();
			
			// 공통 api호출 함수 
			smutil.callApi(_this.apiParam);
			
			// 파라메터 전역변수 초기화
			page.apiParamInit();
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
			var pay_amount = $('#pay_amount').val();				// 사용료
			var strt_ymd = $('#useDate').data('fromYmd');			// 사용시작일
			var end_ymd = $('#useDate').data('endYmd');				// 사용종료일
			var pay_mth = $("#pay_mth").val();						// 결제방법 01:카드, 02:모바일
			var cpno = LEMP.Properties.get({						// 전화번호
				"_sKey" : "dataCpno"
			});
			
			if(cpno.startsWith( '+82' )){							//010으로 변경
				cpno = "0" + cpno.substring(3, cpno.length);
			}
			
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
				"pay_mth" : pay_mth,
				"cpno" : cpno,
				"accessToken" : page.accessToken
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
						LEMP.Window.alert({
							"_sTitle":"결제 완료",
							"_vMessage":"결제가 정상적으로 완료되었습니다."
						});
						
						// 결제 현황 다시조회
						page.payList();
						
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
		}
		
};

