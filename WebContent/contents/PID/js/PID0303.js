var page = {
		
		rsrvMgrNo : null,					// 접수번호
		
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
			page.initEvent();		// 페이지 이벤트 등록
			page.initDpEvent(arg);			// 화면 디스플레이 이벤트
		},
		
		// 페이지 이벤트 등록
		initEvent : function()
		{
			var _this = this;
			
			/* 닫기(x) */
			$(".closeBtn").click(function(){
				LEMP.Window.close();
			});
			
			/* 확인 */
			$("#saveBtn").click(function(){
				var picsh_cd = $("#picsh_cd").val();
				var pick_empno = $("#pick_empno").val();
				
				if(smutil.isEmpty(picsh_cd)){
					LEMP.Window.alert({
						"_sTitle" : "알림",
						"_vMessage" : "대리점을 입력해주세요."
					});
					
					return false;
				}else if(smutil.isEmpty(pick_empno)){
					LEMP.Window.alert({
						"_sTitle" : "알림",
						"_vMessage" : "SM명을 입력해주세요."
					});
					
					return false;
				}else{
					page.smilePickSmUpt();
				}
			});
			
		},
		
		initDpEvent : function(arg)
		{
			var _this = this;
			
			_this.rsrvMgrNo = arg.data.param.rsrv_mgr_no;					//공통코드 구분 코드
			
			// 접수번호 형식 표시
			$("#rsrvMgrNo").text(_this.rsrvMgrNo);
			
		},
		
		// ################### 방문택배 SM변경 start
		// SM변경
		smilePickSmUpt : function(){
			
			var _this = this;
			_this.apiParam.param.baseUrl = "smapis/pid/smilePickSmUpt";				// api no
			_this.apiParam.param.callback = "page.smilePickSmUptCallback";			// callback methode
			_this.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {
					"rsrv_mgr_no" : String(_this.rsrvMgrNo),				// 접수번호 
					"picsh_cd" : $("#picsh_cd").val(),		// 변경 대리점
					"pick_empno" : $("#pick_empno").val()	// 변경 사원번호
				}
			};
			
			// 공통 api호출 함수 
			smutil.callApi(_this.apiParam);
		},
		
		// SM변경 callback
		smilePickSmUptCallback : function(result){
			
			if(smutil.apiResValidChk(result) && result.code == "0000"){
				LEMP.Window.alert({
					"_sTitle" : "SM 변경 오류",
					"_vMessage" : "변경되었습니다."
				});
				
				LEMP.Window.close({
					"_sCallback" : "page.PID0303Callback"
				});
			}else if(smutil.apiResValidChk(result) && result.code == "9000"){
				LEMP.Window.alert({
					"_sTitle" : "SM 변경 오류",
					"_vMessage" : result.message
				});
			}else{
				LEMP.Window.alert({
					"_sTitle" : "SM 변경 오류",
					"_vMessage" : "변경 도중 오류가 발생하였습니다."
				});
			}
			
		},
		// ################### 방문택배 SM변경 start
		
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