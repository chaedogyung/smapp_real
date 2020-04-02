var page = {
		
	init:function(arg)
	{
		page.cldl0406.images=arg.data.param.dlvcp_img_path;
		page.initEvent();
	}
	,cldl0406:{}
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
		
		$("#imgArea").attr("src",page.cldl0406.images);
	}
};

