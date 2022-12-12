var page = {
		
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
			$('#startDate').val(arg.data.startDate);	// 시작일
			$('#endDate').val(arg.data.endDate);		// 종료일
			
			/*
			 * pid0101CorpSctCd : 예약/지시 PID0101에서 넘어온 값 (2201:kakao, 2202:마켓민트) 
			 * cust_sct_cd : 거래처구분 (전체, K:kakao, M:마켓민트) 
			 */
			var pid0101CorpSctCd = arg.data.pid0101CorpSctCd;
			if(pid0101CorpSctCd == "2201") 
				$('#cust_sct_cd').val("K");
			else if(pid0101CorpSctCd == "2202")
				$('#cust_sct_cd').val("M");
			
			page.initEvent();			// 페이지 이벤트 등록
			page.initDpEvent();			// 화면 디스플레이 이벤트
		},
		
		// 페이지 이벤트 등록
		initEvent : function()
		{
			var _this = this;
			
			/* 시작일 달력 팝업 */
			$(document).on('click','#startDate,#endDate',function(){
				var popUrl = smutil.getMenuProp('COM.COM0302', 'url');
				LEMP.Window.open({
					"_sPagePath":popUrl,
					"_oMessage":{
						"param":null
					}
				});
			});
			
			/* 화면 상단 > 화물추적 */
			$("#openFrePop").click(function(){
				var popUrl = smutil.getMenuProp("FRE.FRE0301","url");
				
				LEMP.Window.open({
					"_sPagePath":popUrl,
					"_oMessage":{
						"param":null
					}
				});
			});
			
			/* 리스트 펼치기, 접기 */
//			$(document).on('click',".deliveryList > ul > li .infoBox .top",function(){
//				if ($(this).hasClass('on')) {
//					$(this).removeClass("on").parent().find(".itemList").slideUp("fast");
//				} else {
//					$(this).addClass("on").parent().find(".itemList").slideDown("fast");
//				}
//			});
			
			/* 조회 */
			$(".lstSch").on('click', function(){
				page.listReLoad();					// 리스트 제조회
			});
			
			/* 거래처 필터값 변경 */
			$("#cust_sct_cd").on('change', function(){
				page.listReLoad();					// 리스트 제조회
			});
			
			/* 타이틀 선택 시 해당 항목 리스트 화면으로 이동 */
			$(document).on('click','.infoBox',function(){
				var area_sct_cd = $("input[name='area_sct_cd']:checked").val();
				var startDate = $('#startDate').val();
				var endDate = $('#endDate').val();
				var bkg_code = $(this).data("bkgCode");
				var bkg_name = $(this).data("bkgName");
				var cust_sct_cd = $('#cust_sct_cd').val();
				
				var popUrl = smutil.getMenuProp('PID.PID0302', 'url');
				LEMP.Window.open({
					"_sPagePath": popUrl,
					"_oMessage" : {
						"param" : {
							"area_sct_cd" : area_sct_cd,
							"startDate" : startDate,
							"endDate" : endDate,
							"bkg_code" : bkg_code,
							"bkg_name" : bkg_name,
							"cust_sct_cd" : cust_sct_cd,
						}
					}
				});
			});
			
			// 용지 종류
			$(function() {
			//회수용지
			page.print_p_type =	LEMP.Properties.get({"_sKey" : "print_paper_type"});
			if(!smutil.isEmpty(page.print_p_type) && page.print_p_type == "Y") {
				$("#setDlvyCom1").text('신회수(E형)');
				$("#setDlvyCom1").attr('class', 'blue badge option outline');
			} else {
				$("#setDlvyCom1").text('구회수(4P)');
	            $("#setDlvyCom1").attr('class', 'gray2 badge option outline');
					}
			//출고용지
			/*page.print_p_type2 =	LEMP.Properties.get({"_sKey" : "print_paper_type2"});
			if(!smutil.isEmpty(page.print_p_type2) && page.print_p_type2 == "Y") {
				$("#setDlvyCom2").text('신출고');
				$("#setDlvyCom2").attr('class', 'blue badge option outline');
			} else {
				$("#setDlvyCom2").text('구출고');
	            $("#setDlvyCom2").attr('class', 'gray2 badge option outline');
					}*/					
			});	
			
		},
		
		initDpEvent : function()
		{
			var _this = this;
			smutil.loadingOn();
			_this.initDisplay();
			_this.smilePickCnt();
		},
		
		initDisplay : function()
		{
			//시작일,종료일(처음 페이지 들어왔을때 input 태그가 빈상태)
			if($('#startDate').val()=="" && $('#endDate').val()==""){
				var today = page.getDate('today');
				var weekago =  page.getDate('7daysAgo');
				$('#startDate').val(weekago);
				$('#endDate').val(today);
			}
		},
		
		// ################### 스마일픽업 건수 조회 start
		smilePickCnt : function(){
			var area_sct_cd = $('input[name=area_sct_cd]:checked').val();	//집배송구역 A, 집배대리점 P
			var startDate = page.replaceAll($('#startDate').val(),'.');		//시작일
			var endDate = page.replaceAll($('#endDate').val(),'.');			//종료일
			var cust_sct_cd = $('#cust_sct_cd').val();						//구분코드 (A:전체, K:kakao, M:마켓민트)
			
			var _this = this;
			_this.apiParam.param.baseUrl = "/smapis/pid/smilePickCnt";			// api no
			_this.apiParam.param.callback = "page.smilePickCntCallback";		// callback methode
			_this.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {
					"area_sct_cd" : smutil.nullToValue(area_sct_cd,"A"),	// 집배송구역 A, 집배대리점 P
					"pick_ymd_fr" : startDate,								// 시작일자
					"pick_ymd_to" : endDate,								// 종료일자
					"cust_sct_cd" : smutil.nullToValue(cust_sct_cd,"")		// 거래처구분 (전체, K:kakao, M:마켓민트)
				}
			};
			
			// 공통 api호출 함수 
			smutil.callApi(_this.apiParam);
		},
		smilePickCntCallback : function(result){
			
			try{
				var data = {};
				
				if(result){
					data = result.data; //data = [];
				}
				
				if(result.data_count == 0){
					// 핸들바 템플릿 가져오기
					var source = $("#pid0301_nolist_template").html();
					
					// 핸들바 템플릿 컴파일
					var template = Handlebars.compile(source); 
					
					// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
					var liHtml = template(data);
					
					// 생성된 HTML을 DOM에 주입
					$('.deliveryList').html(liHtml);
					
				}else{
					// 핸들바 템플릿 가져오기
					var source = $("#pid0301_list_template").html();
					
					// 핸들바 템플릿 컴파일
					var template = Handlebars.compile(source); 
					
					// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
					var liHtml = template(data);
					
					// 생성된 HTML을 DOM에 주입
					$('.deliveryList').html(liHtml);
				}
				
			}
			catch(e){}
			finally{
				smutil.loadingOff();			// 로딩바 닫기
				page.apiParamInit();			// 파라메터 전역변수 초기화
			}
			
		},
		// ################### 스마일픽업 건수 조회 end
		
		//달력 팝업 callback
		popCallback :function(args){
			$('#startDate').val(args.start);
			$('#endDate').val(args.end);
			
			page.listReLoad();				// 리스트 제조회
		},
		
		// 리스트 제조회 함수
		listReLoad : function(){
			smutil.loadingOn();
			page.smilePickCnt();				// 리스트 제조회
		},
		
		getDate : function(flag){
			var date = new Date();
			
			if(flag == '7daysAgo'){
				var daysAgo = date.getTime() - (6*24*60*60*1000);
				date.setTime(daysAgo);
			}
			
			var year  = page.pad(date.getFullYear());
		    var month = page.pad(date.getMonth() + 1);
		    var day   = page.pad(date.getDate());
			return year + "." + month + "." + day;
		},
		
		pad : function(numb){
			return (numb < 10 ? '0' : '') + numb;
		},
		
		replaceAll : function(string,change){
			return string.split(change).join('');
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