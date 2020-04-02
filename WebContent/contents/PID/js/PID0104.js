var page = {
		
		bsc_fare : null,		// 기본운임
		air_fare : null,		// 항공운임
		ship_fare : null,		// 도선료
		sur_fare : null,		// 할증료
		sum_fare : null,		// 합계운임
		
		// api 호출 기본 형식
		apiParam : {
			id:"HTTP",						// 디바이스 콜 id
			param:{							// 디바이스가 알아야할 데이터
				task_id : "",				// 화면 ID 코드가 들어가기로함
				//position : {},			// 사용여부 미확정 
				type : "",
				baseUrl : "",
				method : "POST",			// api 호출 형식(지정 안하면 'POST' 로 자동 셋팅)
				callback : "",				// api 호출후 callback function
				contentType : "application/json; charset=utf-8"
			},
			data:{"parameters" : {}}		// api 통신용 파라메터
		},
		
		init:function(arg)
		{
			bsc_fare = arg.data.bsc_fare;		// 기본운임
			air_fare = arg.data.air_fare;		// 항공운임
			ship_fare = arg.data.ship_fare;		// 도선료
			sur_fare = arg.data.sur_fare;		// 할증료
			sum_fare = arg.data.sum_fare;		// 합계운임
			
			$("#bscFare").text(String(bsc_fare).LPToCommaNumber() + "원");
			$("#airFare").text(String(air_fare).LPToCommaNumber() + "원");
			$("#shipFare").text(String(ship_fare).LPToCommaNumber() + "원");
			$("#surFare").text(String(sur_fare).LPToCommaNumber() + "원");
			$("#sumFare").val(String(sum_fare).LPToCommaNumber());
			
			page.initEvent();			// 페이지 이벤트 등록
		},
		
		// 페이지 이벤트 등록
		initEvent : function()
		{
			var _this = this;
			
			/* 닫기(x) */
			$(".btn.closeW.paR").click(function(){
				LEMP.Window.close();
			});
			
			/* 확인 */
			$("#confirmBtn").click(function(){
				
				// 입력한 합계금액
				var setSumFare = $("#sumFare").val();
				
				// 조회된 합계운임보다 입력한 합계운임이 작을 경우
				if(sum_fare > setSumFare){
					LEMP.Window.alert({
						"_sTitle" : "알림",
						"_vMessage" : "합계금액보다 적은 금액입니다."
					});
					return false;
					
				}else{
					LEMP.Window.close({
						"_oMessage" : {
							"sum_fare" : setSumFare	// 합계운임
						},
						"_sCallback" : "page.pid0104Callback"
					});
				}
				
			});
			
			/* 공통 > 조회된 금액보다 입력한 금액이 더 커야함 */
			$(document).on('keyup', '#sumFare', function(e){
				var tmps = parseInt($(this).val().replace(/[^0-9]/g, '')) || 0;
				
				// 조회된 합계운임보다 입력한 합계운임이 작을 경우
				if(sum_fare > tmps){
					$("#sumFareTxt").show();
				}else{
					$("#sumFareTxt").hide();
				}
				
				var numberToComma = String(tmps).LPToCommaNumber();
				$(this).val(numberToComma);
				
			});
			
		},
		
		// api 파람메터 초기화 
		apiParamInit : function(){
			page.apiParam =  {
				id:"HTTP",					// 디바이스 콜 id
				param:{						// 디바이스가 알아야할 데이터
					task_id : "",			// 화면 ID 코드가 들어가기로함
					//position : {},		// 사용여부 미확정 
					type : "",
					baseUrl : "",
					method : "POST",		// api 호출 형식(지정 안하면 'POST' 로 자동 셋팅)
					callback : "",			// api 호출후 callback function
					contentType : "application/json; charset=utf-8"
				},
				data:{"parameters" : {}}	// api 통신용 파라메터
			};
		}
};