var page = {
		
		bsc_fare : null,		// 기본운임
		social_fare : null,		// 사합금
		air_fare : null,		// 항공운임
		ship_fare : null,		// 도선료
		sur_fare : null,		// 할증료
		sum_fare : null,		// 합계운임(기존)
		sum_fare_base : null,	// 최종기본운임
		sum_fare_etc : null,	// 기타운임
		sum_fare_final : null,	// 합계운임(신규)

		
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
			social_fare = 170;                              // 사합금
			bsc_fare = arg.data.bsc_fare - social_fare;		// 기본운임
			air_fare = arg.data.air_fare;					// 항공운임
			ship_fare = arg.data.ship_fare;					// 도선료
			sur_fare = arg.data.sur_fare;					// 할증료
			sum_fare = arg.data.sum_fare;					// 합계운임(기존)
			sum_fare_base = bsc_fare + sur_fare + social_fare;			// 최종 기본운임 : 기본운임 + 할증료
			sum_fare_etc = air_fare + ship_fare;			// 기타운임 : 항공운임 + 도선료(수정불가)
			sum_fare_final = sum_fare_base + sum_fare_etc;	// 합계운임(신규) : 최종기본운임 + 기타운임(수정불가)

			$("#bscFare").text(String(bsc_fare).LPToCommaNumber() + "원");
			$("#socFare").text(String(social_fare).LPToCommaNumber() + "원");
			$("#airFare").text(String(air_fare).LPToCommaNumber() + "원");
			$("#shipFare").text(String(ship_fare).LPToCommaNumber() + "원");
			$("#surFare").text(String(sur_fare).LPToCommaNumber() + "원");
			// $("#sumFare").val(String(sum_fare).LPToCommaNumber());

			$("#sumFareBase").val(String(sum_fare_base).LPToCommaNumber());
			$("#sumFareEtc").val(String(sum_fare_etc).LPToCommaNumber());
			$("#sumFareFinal").val(String(sum_fare_final).LPToCommaNumber());
			
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
				var setSumFare = $("#sumFareBase").val().replace(/[^0-9]/g, '');
				
				// 조회된 최종기본운임 보다 입력한 최종기본운임이 작을 경우
				if(sum_fare_base > setSumFare){
					LEMP.Window.alert({
						"_sTitle" : "알림",
						"_vMessage" : "최종기본운임이 수정 전 기본(할증)운임보다 적습니다."
					});
					return false;
					
				}else{
					LEMP.Window.close({
						"_oMessage" : {
							"sum_fare" : sum_fare_final,		// 합계운임
							"social_fare" : social_fare,		// 사합금
							"sum_fare_base" : sum_fare_base,	// 최종기본운임(수정전)
							"sum_fare_base_input" : setSumFare,	// 최종기본운임(수정후)
							"air_fare" : air_fare,				// 항공운임
							"ship_fare" : ship_fare,			// 도선료
						},
						"_sCallback" : "page.pid0104Callback"
					});
				}
				
			});
			
			/* 공통 > 조회된 금액보다 입력한 금액이 더 커야함(최종기본운임) */
			$(document).on('keyup', '#sumFareBase', function(e){
				var tmps = parseInt($(this).val().replace(/[^0-9]/g, '')) || 0;

				// 조회된 합계운임보다 입력한 합계운임이 작을 경우
				if(sum_fare_base > tmps){
					$("#sumFareBaseTxt").show();
				}else{
					$("#sumFareBaseTxt").hide();
				}

				var numberToComma = String(tmps).LPToCommaNumber();
				$(this).val(numberToComma);

				//최종기본운임이 수정될 경우 합계운임도 변경
				sum_fare_final = tmps + sum_fare_etc;
				
				//사합금 계산
				var social = tmps - 5000;
				if((social >= 0) && (social <= 170)){
					social_fare = social;
				}else if(social < 0){
					social_fare = 0;
				}else {
					social_fare = 170;
				}
				
				$("#socFare").text(String(social_fare).LPToCommaNumber() + "원");
				$("#sumFareFinal").val(String(sum_fare_final).LPToCommaNumber());

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