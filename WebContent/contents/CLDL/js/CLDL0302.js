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
			var network = $("input[type=radio][id$=SVC_CD]:checked").val();
			
			var zip_no_input = ($("#zip_no_input").val()).replace(/\-/gi,"");
			var area_no;		//새우편번호
			var zip_no;			//구우편번호
			
			if(zip_no_input.length == 5){
				area_no = zip_no_input;
				zip_no = "";
			}else if(zip_no_input.length == 6){
				area_no = "";
				zip_no = zip_no_input;
			}else if(zip_no_input.length == 0){
				area_no = "";
				zip_no = "";
			}else{
				LEMP.Window.alert({
					"_sTitle" : "분류코드 검색",
					"_vMessage" : "유효하지 않은 우편번호"
				});
				
				$("#cldl0302Ul").html("");
				return;
			}
			
			if (smutil.isEmpty(addr)) {
				LEMP.Window.alert({
					"_sTitle" : "분류코드 검색",
					"_vMessage" : "전체 주소를 입력해주세요."
				});
			}else if ($("#addr_input").val().length < 2) {
				LEMP.Window.alert({
					"_sTitle" : "분류코드 검색",
					"_vMessage" : "전체 주소를 입력해주세요."
				});
			}else {
				data = {
					"network": network,
					"address": addr,
					"zip_no": zip_no,
					"area_no": area_no
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
			var res = data.api_msg;
			
			if (smutil.apiResValidChk(data) && data.code=="0000") {
				
				if(res.result === "success"){
					var template = Handlebars.compile($("#cldl0302_list_template").html());
					$("#cldl0302Ul").html(template(res));
				}
				else {
					LEMP.Window.alert({
						"_sTitle" : "분류코드 검색",
						"_vMessage" : res.message
					});
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

