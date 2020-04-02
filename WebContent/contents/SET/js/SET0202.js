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
		},// api 통신용 파라메터
	},	
	init:function(data)
	{
		var data_r =  data.data;
		page.initInterface(data_r);
	},
	initInterface : function(data_r)
	{	
		if(data_r.info.dist === "E"){
			$('#canDel').text("삭제");
			$('#inputB').val(data_r.info.msg_titl.trim());
			$('#smsText').text(data_r.info.msg_cont.trim())
		}else{
			$('#canDel').text("취소");
		}
		
		
		
		//전송후 확인버튼 클릭
		$('#confirm').click(function(){
			LEMP.Window.close({
				"_sCallback" : "page.confirmCallback", 
			});
		});
				
		
		//닫기 버튼 
		$('.btn.closeW.paR').click(function(){
			LEMP.Window.close();
		});
		
		//취소일때 reset 삭제일때 삭제
		$('#canDel').click(function(){
			var select =  data_r.info.dist;
			if(select ==="E"){
				$('.mpopBox.cancel').bPopup();
			}else{
				$('#inputB').val("");
				$('#smsText').val("");
			}
		});
		
		//저장 버튼
		$('#sendData').click(function(){
		
			if(smutil.isEmpty($('#inputB').val().trim())){
				LEMP.Window.alert({
					"_sTitle" : "문구작성 오류",
					"_vMessage" : "제목을 입력해주세요."
				});
			}else if(smutil.isEmpty($('#smsText').val().trim())){
				LEMP.Window.alert({
					"_sTitle" : "문구작성 오류",
					"_vMessage" : "문구 내용을 입력해주세요."
				});
			}else{
				page.apiParam.param.baseUrl="/smapis/cmn/mergeSmsCont";
				page.apiParam.data.parameters= {
						"msg_titl" : $('#inputB').val(),
						"msg_cont" : $('#smsText').val()
				};
				if(data_r.info.dist == "E"){
					page.apiParam.data.parameters.msg_no = data_r.info.msg_no;
				}
				page.apiParam.param.callback="page.saveCallback";

				smutil.callApi(page.apiParam);
			}
			
		});
		//삭제 확인 클릭
		$('#deleteMassge').click(function(){
			page.deleteMessage(data_r);
		});
		//삭제 취소 클릭
		$('#deleteCancle').click(function(){
			$('.mpopBox.cancel').bPopup().close();
		});
	
	},
	//메세지 삭제
	deleteMessage : function(data_r){
		page.apiParam.param.baseUrl="/smapis/cmn/delSmsCont";
		page.apiParam.data.parameters= {
				"msg_no" : data_r.info.msg_no
		};
		page.apiParam.param.callback="page.deleteCallback";

		
		smutil.callApi(page.apiParam);
	},
	//저장 콜백
	saveCallback : function(data){
		
		
		if(smutil.apiResValidChk(data) && data.code === "0000"){
			$('.mpopBox.pop3').bPopup();
		}
	},
	//삭제 콜백
	deleteCallback : function(data){
	
		if(smutil.apiResValidChk(data) && data.code === "0000"){
			LEMP.Window.close({
				"_sCallback" : "page.confirmCallback", 
			});
		}
	}
}
/*
function getTextLength(str) {
    var len = 0;
    for (var i = 0; i < str.length; i++) {
        if (escape(str.charAt(i)).length == 6) {
            len++;
        }
        len++;
    }
    return len;
}

function cut_90(obj){
    var text = $(obj).val();
    var leng = text.length;
    while(getTextLength(text) > 90){
        leng--;
        text = text.substring(0, leng);
    }
    $(obj).val(text);
}
*/