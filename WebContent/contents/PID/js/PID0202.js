var page = {
		
		argType : null,			// 조회 종류
		argCust : null,		// 거래처 코드/이름
		argBrnd : null,			// 브랜드 코드/이름
		argShcn : null,			// 매장 코드/이름
		
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
			page.argType = arg.data.type;				// 조회 종류
			page.argCust = arg.data.account;			// 거래처 코드/이름
			page.argBrnd = arg.data.brnd;			// 검색 브랜드 코드/이름
			page.argShcn = arg.data.shcn;			// 검색 매장 코드/이름
			
			page.initEvent();				// 페이지 이벤트 등록
			page.initDpEvent();				// 화면 디스플레이 이벤트
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
			$("#popConfirmBtn").click(function(){
				var pickCheck = $("input[name=pick]:checked");
				var code = pickCheck.attr("id");
				var name = pickCheck.data("name");
				
				
				// 라디오 버튼을 선택하지 않았을 경우
				if(!$("input[name='pick']").is(":checked")){
					LEMP.Window.alert({
						"_sTitle" : "알림",
						"_vMessage" : "버튼을 선택해주세요."
					});
				}else{
					var param = {
						"type" : page.argType,			// 조회 종류
						"code" : code,					// 코드
						"name" : name,					// 이름
					};
					
					if(page.argType == "Shcn"){
						param.brndCode = pickCheck.data("brndCd");
						param.brndName = pickCheck.data("brndNm");
					}
					
					LEMP.Window.close({
						"_oMessage" : param,
						"_sCallback" : "page.pid0202Callback"
					});
				}
				
			});
		},
		
		initDpEvent : function()
		{
			var _this = this;
			smutil.loadingOn();
			
			if(page.argType == "Cust"){
				$("#menuTitle").text("거래처 선택");
				$(".contentBox").addClass("popBrand").removeClass("popLogistics");
			}else if(page.argType == "Brnd"){
				$("#menuTitle").text("브랜드 선택");
				$(".contentBox").addClass("popBrand").removeClass("popLogistics");
			}else if(page.argType == "Shcn" || page.argType == "stsFare"){
				$("#menuTitle").text("매장 선택");
				$(".contentBox").removeClass("popBrand").addClass("popLogistics");
			}else if(page.argType == "ustRtg"){
				$("#menuTitle").text("물류센터 선택");
				$(".contentBox").removeClass("popBrand").addClass("popLogistics");
			}
			
			_this.listSearch();
		},
		
		// ################### 리스트 조회 start
		listSearch : function(){
			
			var _this = this;
			
			if(page.argType == "Cust"){
				_this.apiParam.param.baseUrl = "/smapis/pid/getTctB2bJobCustList";		// api no
				_this.apiParam.data = {													// api 통신용 파라메터
					"parameters" : {
						"srch_mgr_cust_nm" : page.argCust								// 거래처 코드/이름
					}
				};
			}else if(page.argType == "Brnd"){
				_this.apiParam.param.baseUrl = "/smapis/pid/getTctB2bJobBrndList";
				_this.apiParam.data = {
					"parameters" : {
						"mgr_cust_cd" : page.argCust,									// 거래처 코드
						"srch_brnd_nm" : page.argBrnd									// 브랜드 코드/이름
					}
				};
			}else if(page.argType == "Shcn"){
				_this.apiParam.param.baseUrl = "/smapis/pid/getTctB2bJobShList";
				_this.apiParam.data = {
					"parameters" : {
						"b2b_sct_cd" : "",												// Y:전체검색 빈값:자기구역만검색
						"mgr_cust_cd" : page.argCust,									// 거래처 코드
						"brnd_cust_cd" : page.argBrnd,									// 브랜드 코드/이름
						"srch_shcn_nm" : page.argShcn									// 매장 코드/이름
					}
				};
			}else if(page.argType == "stsFare"){
				_this.apiParam.param.baseUrl = "/smapis/pid/getTctB2bJobShList";
				_this.apiParam.data = {
					"parameters" : {
						"b2b_sct_cd" : "Y",												// Y:전체검색 빈값:자기구역만검색
						"mgr_cust_cd" : page.argCust,									// 거래처 코드
						"brnd_cust_cd" : page.argBrnd,									// 브랜드 코드/이름
						"srch_shcn_nm" : page.argShcn									// 매장 코드/이름
					}
				};
			}else if(page.argType == "ustRtg"){
				_this.apiParam.param.baseUrl = "/smapis/pid/getTctB2bBrndRtnList";
				_this.apiParam.data = {
					"parameters" : {
						"mgr_cust_cd" : page.argCust,									// 거래처 코드
						"brnd_cust_cd" : page.argBrnd,									// 브랜드 코드/이름
						"srch_shcn_cd" : page.argShcn									// 물류센터 코드/이름
					}
				};
			}
			
			_this.apiParam.param.callback = "page.listCallback";						// callback methode
			
			// 공통 api호출 함수 
			smutil.callApi(_this.apiParam);
		},
		
		// 리스트 조회 callback
		listCallback : function(result){
			var _this = this;
			
			try{
				
				if(smutil.apiResValidChk(result) && result.code == "0000"){
					
					var data = result.data; //data = [];

					// 핸들바 템플릿 가져오기
					if(page.argType == "Cust" || page.argType == "Brnd"){
						var source = $("#pid0202" + page.argType + "Template").html();
					}else{
						var source = $("#pid0202ShcnTemplate").html();
					}
					
					// 핸들바 템플릿 컴파일
					var template = Handlebars.compile(source); 
					
					// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
					var liHtml = template(data);
					
					// 생성된 HTML을 DOM에 주입
					$('#pid0202LstUl').html(liHtml);
					
				}
				
			}
			catch(e){}
			finally{
				smutil.loadingOff();			// 로딩바 닫기
				page.apiParamInit();			// 파라메터 전역변수 초기화
			}
			
		},
		// ################### 리스트 조회 end
		
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