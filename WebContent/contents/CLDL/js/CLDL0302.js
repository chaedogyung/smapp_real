var page = {
		
	init:function(arg)
	{
		page.cldl0302=arg.data.param;
		console.log(page.cldl0302);
		page.initInterface();
	}
	,apiParam : {
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
		data:{				// api 통신용 파라메터
			"parameters" : {}
		}
	}
	,cldl0302:{}
	,initInterface : function()
	{
		// 닫기 버튼
		$(".btn.closeW.paR").click(function(){
			LEMP.Window.close();
		});
		
		// 검색버튼 클릭
		$("#addrSearch").click(function(){
			var data = {};
			
			var addr = $("#addr_input").val();
			
				if (smutil.isEmpty(addr)) {
					LEMP.Window.alert({
						"_sTitle" : "도착지 검색",
						"_vMessage" : "상세주소가 입력되지 않았습니다.\n법정동 단위로 입력 해주세요."
					});
				}else if ($("#addr_input").val().length < 2) {
					LEMP.Window.alert({
						"_sTitle" : "도착지 검색",
						"_vMessage" : "상세주소가 입력되지 않았습니다.\n2글자 이상 입력 해주세요."
					});
				}else {
					data = {
						"network": "00",
						"address":addr
					}
					
					page.addr(data);
				}
			
		});
	}
	,addr:function(data){
		
		smutil.loadingOn();		// 로딩바 열기
		
		page.apiParam.param.baseUrl="smapis/newAddress";
		page.apiParam.param.callback="page.addrCallback";
		page.apiParam.data.parameters=data;
		
		// 공통 api호출 함수 
		smutil.callApi(page.apiParam);
	}
	,addrCallback:function(data){
		try{
			console.log(data);
			var res = {
					"data": data.api_msg
			}
			console.log(JSON.stringify(res));
			if (smutil.apiResValidChk(data) && data.code=="0000") {
				
				if(res.data.result === "success"){
					var template = Handlebars.compile($("#cldl0302_list_template").html());
					$("#cldl0302Ul").html(template(res));
				}
				else {
					var template = Handlebars.compile($("#no_list_template").html());
					$("#cldl0302Ul").html(template(res));
				}
			}
		}
		catch(e){}
		finally{
			smutil.loadingOff();			// 로딩바 닫기
		}
	}
	
};

