var page = {
		
	init:function(arg)
	{
		page.cldl0405.images=arg.data.param.sign_img_path;
		page.initEvent();
	}
	,cldl0405:{}
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
	
	,initEvent : function()
	{
		// 닫기
		$(document).on("click",".btn.closeW.paR",function(){
			LEMP.Window.close();
		});
		
		// 서명 출력
		$("#signArea").attr("src",page.cldl0405.images);
	}
//	,cmptSignPhtg:function(){
//		smutil.loadingOn();		// 로딩바 열기
//		
//		page.apiParam.param.baseUrl="smapis/cldl/cmptSignPhtg";
//		page.apiParam.param.callback="page.cmptSignPhtgCallback";
//		page.apiParam.data.parameters=page.cldl0405;
//		
//		// 공통 api호출 함수 
//		smutil.callApi(page.apiParam);
//	}
//	,cmptSignPhtgCallback:function(res){
//		try{
//			if (smutil.apiResValidChk(data)&& data.code==="0000") {
//				$("#signArea").attr("src",res.data.list[0].img_path);
//			}else {
//				LEMP.Window.alert({
//					"_sTitle" : "알림",
//					"_vMessage" : "조회에 실패하였습니다."
//				});
//				LEMP.Window.close();
//			}
//		}
//		catch(e){}
//		finally{
//			smutil.loadingOff();			// 로딩바 닫기
//		}
//	}
//	,cmptSignDel:function(data){
//		smutil.loadingOn();		// 로딩바 열기
//		
//		page.apiParam.param.baseUrl="smapis/cldl/cmptSignDel";
//		page.apiParam.param.callback="page.cmptSignDelCallback";
//		page.apiParam.data.parameters=data;
//		
//		// 공통 api호출 함수 
//		smutil.callApi(page.apiParam);
//	}
//	,cmptSignDelCallback:function(res){
//		try{
//			if (smutil.apiResValidChk(res)&& res.code==="0000") {
//				
//			}else {
//				LEMP.Window.alert({
//					"_sTitle" : "알림",
//					"_vMessage" : "서명 삭제 작업이 실패하였습니다."
//				});
//				LEMP.Window.close();
//			}
//		}
//		catch(e){}
//		finally{
//			smutil.loadingOff();			// 로딩바 닫기
//		}
//	}
};

