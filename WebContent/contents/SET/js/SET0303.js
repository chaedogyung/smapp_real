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
	getParam: null,
	trans_yn: null,		//집배달출발 기준 변경 가능여부
	init:function()
	{
		page.initInterface();
		//page.transInfo();
	},
	
	initInterface : function(){
		
		$(function(){
			getParam = LEMP.Properties.get({ "_sKey" : "autoMenual"});
			if(getParam){
				if(!_.isUndefined(getParam.area_sct_cd)){
					$('input[name="area_sct_cd"]').each(function() {
						if($(this).val() == getParam.area_sct_cd){
							$(this).prop('checked', true);
		                }else{
		                	$(this).prop('checked', false);
		                }
					});
				}

				if(!_.isUndefined(getParam.area_sct_cd2)){
					$('input[name="area_sct_cd2"]').each(function() {
						if($(this).val() == getParam.area_sct_cd2){
							$(this).prop('checked', true);
						}else{
							$(this).prop('checked', false);
						}
					});
				}

				if(!_.isUndefined(getParam.area_sct_cd3)){
					$('input[name="area_sct_cd3"]').each(function() {
						if($(this).val() == getParam.area_sct_cd3){
							$(this).prop('checked', true);
						}else{
							$(this).prop('checked', false);
						}
					});
				}
			}

            // push 음성
	        var isSpeak = LEMP.Properties.get({"_sKey" : "push_speak_yn"});

	        if(!smutil.isEmpty(isSpeak) && isSpeak == "Y") {
                $("#ra7").prop('checked', true);
	        } else {
	            $("#ra7").prop('checked', false);
	        }

		});

        //확인버튼
		$('.btn.red.w100p.m').click(function(){
			var area_sct_cd = $('input[name="area_sct_cd"]:checked').val();
			
			if(!smutil.isEmpty(getParam) && getParam.area_sct_cd != area_sct_cd){
				page.transInfo();
				
			}else{
				var setParameter = {};
	
				setParameter = {
					area_sct_cd : $("input[name='area_sct_cd']:checked").val(),
					area_sct_cd2 : $("input[name='area_sct_cd2']:checked").val(),
					area_sct_cd3 : $("input[name='area_sct_cd3']:checked").val()
				};
	
				LEMP.Properties.set({ "_sKey" : "autoMenual", "_vValue" : setParameter });
				//메인 팝업 체크
				LEMP.Properties.set({ "_sKey" : "setPopCheck", "_vValue" : "Y"});
	
//	            // push 음성
	            LEMP.Properties.set({ "_sKey"   : "push_speak_yn"
	                                , "_vValue" :  $("input[name='area_sct_cd4']:checked").val() });
				LEMP.Window.close();
			}
		});
		
	},
	//구역/시간 변경 가능 여부 확인
	transInfo : function(){
		smutil.loadingOn();
		
		page.apiParam.param.baseUrl="/smapis/transInfo";
		page.apiParam.param.callback="page.transInfoCallback";
		page.apiParam.data.parameters={
				
		};
		
		smutil.callApi(page.apiParam);
	},
	//구역/시간 변경 가능 여부 콜백
	transInfoCallback : function(result){
		page.trans_yn = result.trans_yn;
		
		try{
			if(smutil.apiResValidChk(result) && result.code === "0000"){
				if(page.trans_yn == "N"){
//					$('input[name="area_sct_cd"]').prop('disabled', true);
//					
//					$('.area_sct_cd').click(function(){
//						LEMP.Window.alert({
//							"_sTitle": "집배달출발 기준 설정",
//							"_vMessage": "집배달출발 기준 설정 불가능 합니다.\n스캔 취소 후 다시 시도해 주세요."
//						});
//					});
					
					LEMP.Window.alert({
						"_sTitle": "집배달출발 기준 설정",
						"_vMessage": "집배달출발 기준 설정 불가능 합니다.\n스캔 취소 후 다시 시도해 주세요."
					});
					
					$('input[name="area_sct_cd"]').each(function() {
						if($(this).val() == getParam.area_sct_cd){
							$(this).prop('checked', true);
		                }else{
		                	$(this).prop('checked', false);
		                }

					});
					
				}else{
//					$('input[name="area_sct_cd"]').prop('disabled', false);
					
					var setParameter = {};
					
					setParameter = {
						area_sct_cd : $("input[name='area_sct_cd']:checked").val(),
						area_sct_cd2 : $("input[name='area_sct_cd2']:checked").val(),
						area_sct_cd3 : $("input[name='area_sct_cd3']:checked").val()
					};
		
					LEMP.Properties.set({ "_sKey" : "autoMenual", "_vValue" : setParameter });
					//메인 팝업 체크
					LEMP.Properties.set({ "_sKey" : "setPopCheck", "_vValue" : "Y"});
		
		            // push 음성
		            LEMP.Properties.set({ "_sKey"   : "push_speak_yn"
		                                , "_vValue" :  $("input[name='area_sct_cd4']:checked").val() });
					LEMP.Window.close();
				}
				
			}
		}catch(e){}
		finally{
			smutil.loadingOff();
		}
	}
}