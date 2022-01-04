var page = {
		curDate: "",
		
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
			page.curDate = curDate.LPToFormatDate("yyyymm");
			
			var year = page.curDate.substring(0,4);
			var month = page.curDate.substring(4,6);

			if(year != 'undefined' || month != 'undefined'){
				$('#sel_ym').val(year+"-"+month);				
			}
			
			page.initInterface();
			page.initEvent();			// 페이지 이벤트 등록
			page.initDpEvent();			// 화면 디스플레이 이벤트
		},
		
		initInterface : function() {
			//monthpicker
			var currentYear = (new Date()).getFullYear();
			var options = {
					pattern: 'yyyy-mm', // Default is 'mm/yyyy' and separator char is not mandatory
					selectedYear: currentYear,
					startYear: currentYear-10,
					finalYear: currentYear,
					monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']	,
					openOnFocus: true,
					disableMonths : []
			};
			
			//이달의 실적현황 달력 버튼
			$("#sel_ym").monthpicker(options);
			
			// 금액, 수량에  콤마 추가
			Handlebars.registerHelper('moneyForm', function(options) {
				if(options != null){
					return options.toString().LPToCommaNumber();					
				}
			});
		},
		
		// 페이지 이벤트 등록
		initEvent : function()
		{
			var _this = this;
			
			//조회 버튼 클릭
			$('#search').click(function(){
				page.agcySmCmsNinQy();
			});
			
			//비고 상세 버튼 클릭
			$(document).on('click', '.btn.info', function(){
				$('#popTxt').text($(this).data('rmk'));
				$('.mpopBox.pop').bPopup();				
			});
		},
		
		
		// 화면 최초 디스플레이 이벤트
		initDpEvent : function(){
			// 정산 조회
			page.agcySmCmsNinQy();
		},
		
		// SM별 정산 정보 조회
		agcySmCmsNinQy : function(){
			var srchYm = $('#sel_ym').val().replace(/\-/g, '');
			var loginId = LEMP.Properties.get({
				"_sKey" : "dataId"
			});

			page.apiParamInit();		// 파라메터 초기화
			page.apiParam.param.baseUrl = "/smapis/adj/agcySmCmsNinQy";
			page.apiParam.param.callback = "page.agcySmCmsNinQyCallback";
			
			page.apiParam.data = {
					"parameters" : {
						"srchYm" : srchYm,		//정산년월
						"empno" : loginId	//정산사번 test "31902410", "31600488", "32104938"
					}
			};

			smutil.loadingOn();
			smutil.callApi(page.apiParam);
		},
		
		agcySmCmsNinQyCallback : function(result){
			$("#emp_nm").text(result.userInfo.emp_nm);
			$("#brsh_nm").val(result.userInfo.brsh_nm);
			
			try{
				if(smutil.apiResValidChk(result) && result.code === "0000"){
					var res_data = result.data;

					if(result.count != "0" && res_data.etc_cnf_yn == 'Y'){
						// 핸들바 템플릿 가져오기
						var source = $("#MYP0501_tr_template").html();
						
						//정산  여부
						if(res_data.etc_cnf_yn == 'Y'){
							$('#etc_cnf').hide();
						}else{
							$('#etc_cnf').show();
						}
					}else if(result.count != "0" && (res_data.etc_cnf_yn == 'N' || res_data.etc_cnf_yn == null)){
						// 핸들바 템플릿 가져오기
						var source = $("#MYP0501_req_template").html();
					}else{
						// 핸들바 템플릿 가져오기
						var source = $("#MYP0501_noTr_template").html();
					}
					
					// 핸들바 템플릿 컴파일
					var template = Handlebars.compile(source);

					// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
					var liHtml = template(res_data);

					// 생성된 HTML을 DOM에 주입
					$('#view1Tbody').html(liHtml);
				}
			}catch(e){}
			finally{
				smutil.loadingOff();
			}
		}
};