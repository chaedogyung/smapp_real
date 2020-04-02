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
//			// 달력셋팅
//			var curDate = new Date();
//			curDate = curDate.getFullYear() + "." + ("0"+(curDate.getMonth()+1)).slice(-2) + "." + ("0"+curDate.getDate()).slice(-2);
//			$('#cldlBtnCal_V2').text(curDate);
			
			page.initDpEvent();			// 화면 디스플레이 이벤트
			page.initEvent();			// 페이지 이벤트 등록
			//page.listReLoad();			// 페이지 조회
		},
		
		
		
		// 페이지 이벤트 등록
		initEvent : function()
		{
			var _this = this;
			
			// 화면 탭 클릭
			_this.tabList(".tabBox",".tabView",1,"click");
			
			// 달력버튼을 누른경우
			$("#cldlBtnCal_V1,#cldlBtnCal_V2").click(function(){
				
				var popUrl = smutil.getMenuProp("COM.COM0301","url");
//				var limitDate= {
//					"minDate":1,
//					"maxDate":3
//				}
				
				LEMP.Window.open({
					"_sPagePath":popUrl,
					"_oMessage":{
						"param":null
					}
				});
				
			});
			

			// 탭을 클릭한 경우
			$(".lstSchBtn").click(function(){
				// 화면 탭 클릭
				_this.tabList(".tabBox", ".tabView", $(this).data('tabIdx'), "click");
			});
			
			
			// 일일 작업현황 상세 호출
			$(document).on('click', ".view2Tr", function(){
				
				var trObj = $(this);
				var pacl_stat_cd = trObj.data("paclStatCd");
				var pacl_stat_nm = trObj.data("paclStatNm");
				var srch_ymd = $('#cldlBtnCal_V2').text();
				
				if(!smutil.isEmpty(pacl_stat_cd)
						&& !smutil.isEmpty(pacl_stat_nm)
						&& !smutil.isEmpty(srch_ymd)){
					
					// 스캔 팝업 url 호출
					var popUrl = smutil.getMenuProp('RES.RES0102', 'url');
					
					// 사진전송
					if(pacl_stat_cd == "410"){
						popUrl = smutil.getMenuProp('RES.RES0104', 'url');
					}
					
					LEMP.Window.open({
						"_oMessage" : {
							"param" : {
								"pacl_stat_cd" : pacl_stat_cd,
								"srch_ymd" : srch_ymd,
								"pacl_stat_nm" : pacl_stat_nm
							}
						},
						"_sPagePath": popUrl
					});
				}
				else{
					LEMP.Window.alert({
						"_sTitle":"일일작업현황 상세오류",
						"_vMessage":"상세 조회를 위한 필수값이 없습니다.",
					});
					
					return false;
				}
				
			});
			
			
			
			// 월별 실적현황 상세 호출
			$(document).on('click', ".view3Tr", function(){
				
				var trObj = $(this);
				var ymd = trObj.data("ymd");
				
				if(!smutil.isEmpty(ymd)){
					var tempYmd = ymd.split('.').join('');
					// 날짜를 클릭할때만 상세표시
					if(Number(tempYmd)){
						// 스캔 팝업 url 호출
						var popUrl = smutil.getMenuProp('RES.RES0103', 'url');
						
						LEMP.Window.open({
							"_oMessage" : {
								"param" : {
									"ymd" : ymd
								}
							},
							"_sPagePath": popUrl
						});
					}
				}
				else{
					LEMP.Window.alert({
						"_sTitle":"월별실적현황 상세오류",
						"_vMessage":"상세 조회를 위한 필수값이 없습니다.",
					});
					
					return false;
				}
			});
			
			
			
			// 월별실적현황 집하 금액 표시
			Handlebars.registerHelper('picResult', function(options) {
				var pickCnt = this.pick_cnt+"";		// 집하건수
				var pickFare ;						// 집하금액
				
				// 집하건수가 없으면 그냥 빈칸으로 리턴
				if(!smutil.isEmpty(pickCnt)){
					pickFare = this.pick_fare+"";

					// 금액이 있으면 콤마표시
					if(!smutil.isEmpty(pickFare)){
						return (pickCnt+"("+pickFare.LPToCommaNumber()+")");
					}
					else{
						return (pickCnt+"(0)");
					}
				}
				else{
					return "";
				}
			});
			
			
			
			// 월별실적현황 배달 금액 표시
			Handlebars.registerHelper('dvlResult', function(options) {
				var dlvCnt = this.dlv_cnt+"";		// 집하건수
				var dlvFare ;						// 집하금액
				
				// 배달건수가 없으면 그냥 빈칸으로 리턴
				if(!smutil.isEmpty(dlvCnt)){
					dlvFare = this.dlv_fare+"";
					
					// 금액이 있으면 콤마표시
					if(!smutil.isEmpty(dlvFare)){
						return (dlvCnt+"("+dlvFare.LPToCommaNumber()+")");
					}
					else{
						return (dlvCnt+"(0)");
					}
				}
				else{
					return "";
				}
			});
			
			
		},
		
		
		// 화면 그리는데 처음 실행되야하는 로직들 
		initDpEvent : function(){
			
			var $dateTits = $(".dateTit");
			$dateTits.each(function(idx){
				var date = new Date();
				var today = new Date();
				var $dateTit = $(".dateTit").eq(idx);
				
				var $prevDateButton1 = $dateTit.prev('.arrowL.fl.tv1');
				var $nextDateButton1 = $dateTit.next('.arrowR.fr.tv1');
				var $prevDateButton2 = $dateTit.prev('.arrowL.fl.tv2');
				var $nextDateButton2 = $dateTit.next('.arrowR.fr.tv2');
				var $prevDateButton3 = $dateTit.prev('.arrowL.fl.tv3');
				var $nextDateButton3 = $dateTit.next('.arrowR.fr.tv3');
				
				// 2번탭은 일자별로 셋팅
				if(idx == 0){	// 1번탭 월별실적현황이니까 월별로 셋팅
					updateMonth1(date);
					
					// 이전달
					$prevDateButton1.on('click', function(e){					
						date.setMonth(date.getMonth() - 1);
						updateMonth1(date);
					});

					// 다음달
					$nextDateButton1.on('click', function(e){					
						if(date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth()) {
							return;	
						}

						date.setMonth(date.getMonth() + 1);
						updateMonth1(date);
						
					});

					// 날짜 업데이트
					function updateMonth1(date) {					
						var dateYear = date.getFullYear();
						var dateMonth = date.getMonth() + 1;
						var dateDay = date.getDate();
						
						// 달력셋팅
						var curDate = dateYear + "." + ("0"+(dateMonth)).slice(-2);
						$dateTit.text(curDate);
						
						page.listReLoad();		// 리스트 조회
					}
				}
				else if(idx == 1){	// 2번탭은 일자별로 셋팅
					updateDate2(date);		

					// 이전일
					$prevDateButton2.on('click', function(e){
						date.setDate(date.getDate() - 1);
						updateDate2(date);
					});

					// 다음일
					$nextDateButton2.on('click', function(e){
						if(date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate()) {
							return;	
						}

						date.setDate(date.getDate() + 1);
						updateDate2(date);
					});

					// 날짜 업데이트
					function updateDate2(date) {
						var dateYear = date.getFullYear();
						var dateMonth = date.getMonth() + 1;
						var dateDay = date.getDate();
						
						// 달력셋팅
						var curDate = dateYear + "." + ("0"+(dateMonth)).slice(-2) + "." + ("0"+dateDay).slice(-2);
						$dateTit.text(curDate);
						
						page.listReLoad();		// 리스트 조회
					}
				}
				else if(idx == 2){		// 3번탭 월별실적현황이니까 월별로 셋팅
					
					updateMonth3(date);
					
					// 이전달
					$prevDateButton3.on('click', function(e){					
						date.setMonth(date.getMonth() - 1);
						updateMonth3(date);
					});

					// 다음달
					$nextDateButton3.on('click', function(e){					
						if(date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth()) {
							return;	
						}

						date.setMonth(date.getMonth() + 1);
						updateMonth3(date);
						
					});

					// 날짜 업데이트
					function updateMonth3(date) {					
						var dateYear = date.getFullYear();
						var dateMonth = date.getMonth() + 1;
						var dateDay = date.getDate();
						
						// 달력셋팅
						var curDate = dateYear + "." + ("0"+(dateMonth)).slice(-2);
						$dateTit.text(curDate);
						
						page.listReLoad();		// 리스트 조회
					}
					
				}

			});
			
		},
		
		
		// 활성화된 탭의 리스트를 조회
		listReLoad : function(){
			var tabCd = page.returnTabCd();			// 활성화 되있는 탭 번호
			if(tabCd == "1"){						// 서비스실적
				page.svcRate();
			}
			else if(tabCd == "2"){
				page.daySvcRate();					// 일일 작업현황 조회
			}
			else if(tabCd == "3"){
				page.svcMon();					// 월별 실적현황 조회
			}
		},
		
		//com0301에서 날짜 선택 한 후 실행되는 콜백 함수
		COM0301Callback:function(res){
			var tabCd = page.returnTabCd();			// 활성화 되있는 탭 번호
			
			if(tabCd == "1"){
				$("#cldlBtnCal_V1").text(res.param.date);
			}
			else if(tabCd == "2"){
				$("#cldlBtnCal_V2").text(res.param.date);
			}
			else if(tabCd == "3"){
				$("#cldlBtnCal_V3").text(res.param.date);	
			}
			
			page.listReLoad();					// 리스트 제조회
		},
		
		
		// 탭 클릭시 화면 컨트롤
		tabList : function(list,view,n,action) {
			var firstN = n-1;
			
			$(view + " > ul > li").hide();
			$(view + " > ul > li:eq("+firstN+")").show();
			//$(list + "> ul > li").eq(firstN).addClass("on");
			
			// 집하 배달 탭 표시처리
			var btnLst = $(".lstSchBtn");
			var btnObj;
			_.forEach(btnLst, function(obj, key) {
				btnObj = $(obj);
				if(n == btnObj.data('tabIdx')){
					btnObj.closest('li').addClass( 'on' );
				}
				else{
					btnObj.closest('li').removeClass( 'on' );
				}
			});
			
			page.listReLoad();					// 리스트 제조회
		},
		
		
		
		
		// ########################################################################################## 서비스실적 리스트 조회 start
		svcRate : function(){
			var _this = this;
			var srch_ym = $('#cldlBtnCal_V1').text();
			srch_ym = srch_ym.split('.').join('');
			
			_this.apiParamInit();		// 파라메터 전역변수 초기화
			_this.apiParam.param.baseUrl = "smapis/cmn/svcRate";		// api no
			_this.apiParam.param.callback = "page.svcRateCallback";		// callback methode
			_this.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {
					"srch_ym" : srch_ym			// 조회 연월
				}
			};
			
			smutil.loadingOn();			// 로딩바 on
			
			// 공통 api호출 함수
			smutil.callApi(_this.apiParam);
		},
		
		
		
		svcRateCallback : function(result){
			
			try{
				// api 전송 성공
				if(smutil.apiResValidChk(result) && result.code == "0000"){
					var data = {};
					
					if(!smutil.isEmpty(result.data)){
						data = result.data;
					}
					
					// 핸들바 템플릿 가져오기
					var source = $("#view1TrTmpl").html();

					// 핸들바 템플릿 컴파일
					var template = Handlebars.compile(source); 

					// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
					var trHtml = template(data);

					// 생성된 HTML을 DOM에 주입
					$('#view1Tbody').html(trHtml);

				}
			}
			catch(e){}
			finally{
				smutil.loadingOff();			// 로딩바 닫기
				page.apiParamInit();			// 파라메터 전역변수 초기화
			}
			
		},
		// ########################################################################################## 일일 작업현황 리스트 조회 end
		
		
		// ########################################################################################## 일일 작업현황 리스트 조회 start
		daySvcRate : function(){
			var _this = this;
			var srch_ymd = $('#cldlBtnCal_V2').text();
			srch_ymd = srch_ymd.split('.').join('');
			
			_this.apiParamInit();		// 파라메터 전역변수 초기화
			_this.apiParam.param.baseUrl = "smapis/cmn/daySvcRate";		// api no
			_this.apiParam.param.callback = "page.daySvcRateCallback";		// callback methode
			_this.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {
					"srch_ymd" : srch_ymd		// 조회 연월일
				}
			};
			
			smutil.loadingOn();			// 로딩바 on
			
			// 공통 api호출 함수
			smutil.callApi(_this.apiParam);
		},
		
		
		
		daySvcRateCallback : function(result){
			
			try{
				// api 전송 성공
				if(smutil.apiResValidChk(result) && result.code == "0000"){
					var data = {};
					
					if(!smutil.isEmpty(result.data)){
						data = result.data;
					}
					
					// 핸들바 템플릿 가져오기
					var source = $("#view2TrTmpl").html();

					// 핸들바 템플릿 컴파일
					var template = Handlebars.compile(source); 

					// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
					var trHtml = template(data);

					// 생성된 HTML을 DOM에 주입
					$('#view2Tbody').html(trHtml);

				}
			}
			catch(e){}
			finally{
				smutil.loadingOff();			// 로딩바 닫기
				page.apiParamInit();			// 파라메터 전역변수 초기화
			}
			
		},
		// ########################################################################################## 일일 작업현황 리스트 조회 end
		
		
		
		// ##########################################################################################월별 실적현황 조회 start
		svcMon : function(){
			var _this = this;
			var srch_ymd = $('#cldlBtnCal_V3').text();
			srch_ym = srch_ymd.split('.').join('');
			
			_this.apiParamInit();		// 파라메터 전역변수 초기화
			_this.apiParam.param.baseUrl = "smapis/cmn/svcMon";				// api no
			_this.apiParam.param.callback = "page.svcMonCallback";		// callback methode
			_this.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {
					"pick_dlv_ym" : srch_ym		// 조회 연월
				}
			};
			
			smutil.loadingOn();			// 로딩바 on
			
			// 공통 api호출 함수
			smutil.callApi(_this.apiParam);
		},
		
		
		
		svcMonCallback : function(result){
			
			page.apiParamInit();			// 파라메터 전역변수 초기화
			
			try{
				// api 전송 성공
				if(smutil.apiResValidChk(result) && result.code == "0000"){
					var data = {};
					var sumdata = {};
					var totSumMoney = 0;			// 총 가격
					var totPickCnt = 0;				// 총 집하건수
					var totPickfare = 0;				// 총 집하금액
					var totDlvCnt = 0;				// 총 배달건수
					var totDlvfare = 0;				// 총 배달금액
					
					
					if(!smutil.isEmpty(result.data) && result.data_count > 0){
						data = result.data;
						sumdata = data.list.splice(0,1);
						
						if(data.list.length>0){
							
							$.each(data.list, function(idx, obj){
								if(!smutil.isEmpty(obj.pick_cnt)){
									totPickCnt = totPickCnt + obj.pick_cnt;
								}
								
								if(!smutil.isEmpty(obj.pick_fare)){
									totPickfare = totPickfare + obj.pick_fare;
								}
								
								if(!smutil.isEmpty(obj.dlv_cnt)){
									totDlvCnt = totDlvCnt + obj.dlv_cnt;
								}
								
								if(!smutil.isEmpty(obj.dlv_fare)){
									totDlvfare = totDlvfare + obj.dlv_fare;
								}
								
								if(!smutil.isEmpty(obj.ymd)){
									obj.ymd = obj.ymd.LPToFormatDate('yyyy.mm.dd');
								}
								
							});
						}
						
						if(!smutil.isEmpty(sumdata)){
							totSumMoney = sumdata[0].dlv_fare + sumdata[0].pick_fare; 
						}
						
						if(totSumMoney > 0){
							$('#view3TotTxt1').text((totSumMoney+"").LPToCommaNumber()+"원");
						}
						else{
							$('#view3TotTxt1').text("0원");
						}
						
						$('#view3TotTxt2').text(totPickCnt+"건");
						$('#view3TotTxt3').text(totDlvCnt+"건");
						
						var sumObj = {
							"ymd": "합계",
							"dlv_fare": totDlvfare,
							"pick_cnt": totPickCnt,
							"pick_fare": totPickfare,
							"dlv_cnt": totDlvCnt
						};
						
						(data.list).unshift(sumObj);
						
					}
					else{
						$('#view3TotTxt1').text("0원");
						$('#view3TotTxt2').text("0건");
						$('#view3TotTxt3').text("0건");
					}
					
					// 핸들바 템플릿 가져오기
					var source = $("#view3TrTmpl").html();

					// 핸들바 템플릿 컴파일
					var template = Handlebars.compile(source); 

					// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
					var trHtml = template(data);
					
					// 생성된 HTML을 DOM에 주입
					$('#view3Tbody').html(trHtml);

				}
			}
			catch(e){}
			finally{
				smutil.loadingOff();			// 로딩바 닫기
				
			}
			
			page.apiParamInit();				// 파라메터 전역변수 초기화
			
		},
		// ##########################################################################################월별 실적현황 조회 end
		
		
		// 현재 활성화 되어있는 텝 코드 리턴
		returnTabCd : function(){
			
			//현제 어느 탭에 있는지 상태체크
			var btnLst = $(".lstSchBtn");
			var btnObj;
			var tabIdx;
			
			_.forEach(btnLst, function(obj, key) {
				btnObj = $(obj);
				if(btnObj.closest('li').is('.on')){
					tabIdx = btnObj.data('tabIdx');
					return false;
				}
			});
			
			// 없으면 A 리턴
			return smutil.nullToValue(tabIdx,'1'); 
		},
		
		
};
