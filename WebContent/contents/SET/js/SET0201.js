var page = {
	apiParam : {
		id : "HTTP", // 디바이스 콜 id
		param : {// 디바이스가 알아야할 데이터
			task_id : "", // 화면 ID 코드가 들어가기로함
			// position : {}, // 사용여부 미확정
			type : "",
			baseUrl : "",
			method : "POST", // api 호출 형식(지정 안하면 'POST' 로 자동 셋팅)
			callback : "", // api 호출후 callback function
			contentType : "application/json; charset=utf-8"
		},
		data : {
			"parameters" : {}
		},
		// api 통신용 파라메터
	},	
	init:function()
	{
		page.initInterface();
		page.contList();
	},
	
	initInterface : function(){
		
		//문구 수정 클릭
		$(document).on('click','.btn.arrowR.fr',function(){
			
				var popUrl = smutil.getMenuProp('SET.SET0202','url');
				var info = {
						"msg_no" : $(this).attr('id'),
						"msg_titl" : $(this).parent().prev().text(),
						"msg_cont" : $(this).parent().next().text().trim(),
						"dist" : "E"
				}
				LEMP.Window.open({
					"_sPagePath" : popUrl,
					"_oMessage" : {
						"info" : info
					},
				});
			
		});
		
		//추가 버튼 클릭
		$('.btn.red.w100p.m').click(function(){
			var popUrl = smutil.getMenuProp('SET.SET0202','url');
			var info={
					"dist" : "A"
			}
			LEMP.Window.open({
				"_sPagePath" : popUrl,
				"_oMessage" : {
					"info" : info
				},
			});
		});
		
		//닫기버튼
		$('.btn.closeW.paR').click(function(){
			LEMP.Window.close();
		});
		
		
	},
	contList : function(){
		smutil.loadingOn();
		
		page.apiParam.param.baseUrl="/smapis/cmn/smsContList";
		page.apiParam.param.callback="page.contCallback";
		page.apiParam.data.parameters={
				
		};
		
		smutil.callApi(page.apiParam);
	},
	//문자 발송 설정 리스트 콜백
	contCallback : function(data){
		$('#set0201H').empty();
		var list_d = data.data;
	
		try{
			if(smutil.apiResValidChk(data) && data.code === "0000" && data.data_count!=0){
				
				Handlebars.registerHelper('change', function(options){

					if (this.msg_typ !== "A") {
						return options.fn(this);
					}
				});
				
				var source = $("#SET0201_list_template").html();
				var template = Handlebars.compile(source);
				$("#set0201H").append(template(list_d));	
			}
		}catch(e){}
		finally{
			smutil.loadingOff();
		}
	},
	//전송 과 삭제후 reload
	confirmCallback : function(){
		page.contList();
	}
}