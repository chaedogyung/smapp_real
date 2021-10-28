var page = {

	init : function(arg) {
		var obj = {};
		if (arg.data == "" || arg.data == undefined) {
			LEMP.Window.toast({
				"_sMessage":"송장번호가 없습니다.\n관리자에게 문의해주세요.",
				'_sDuration' : 'short'
			});
//			LEMP.Window.alert({
//				"_sTitle" : "메모 오류",
//				"_vMessage" : "송장번호가 없습니다.\n관리자에게 문의해주세요."
//			});
			LEMP.Window.close();
			
		} else {
			obj.inv_no = String(arg.data.param.inv_no);
		}
		page.initInterface(obj);
	}
	
	,apiParam : {
		id:"HTTP",			// 디바이스 콜 id
		param:{				// 디바이스가 알아야할 데이터
			task_id : "",										// 화면 ID 코드가 들어가기로함
			//position : {},									// 사용여부 미확정 
			type : "",
			baseUrl : "",
			method : "POST",									// api 호출 형식(지정 안하면 'POST' 로 자동 셋팅)
			callback : "",										// api 호출후 callback function
			contentType : "application/json; charset=utf-8"
		},
		data:{				// api 통신용 파라메터
			"parameters" : {}
		}
	}
	
	// 이벤트 등록 함수
	,initInterface : function(data) {
		$(".btn.closeW.paR").click(function() {
			LEMP.Window.close();
		});
		$(".btn.gray.w100p.m").click(function() {
			page.DelClickEvent(data);
		});
		$(".btn.red.w100p.m").click(function() {
			page.SendClickEvent(data);
		});
		$("#dlvPrcsMemo").on("keyup",function(e){
			page.MaxByteCheck($(this));
			
		})
		page.dlvPrcsMemo(data);
	}
	,MaxByteCheck : function(obj) {
		{
			var str = obj.val();
			var str_len = obj.val().length;

			var rbyte = 0;
			var rlen = 0;
			var one_char = "";
			var str2 = "";

			for (var i = 0; i < str_len; i++) {
				one_char = str.charAt(i);
				if (escape(one_char).length > 4) {
					rbyte += 3; // 한글2Byte
				} else {
					rbyte++; // 영문 등 나머지 1Byte
				}

				if (rbyte <= 100) {
					rlen = i + 1; // return할 문자열 갯수
				}
			}
			if (rbyte > 100) {
				LEMP.Window.toast({
					"_sMessage":"메세지는 최대 100byte를 \n초과 할 수 없습니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle" : "경고",
//					"_vMessage" : "메세지는 최대 100byte를 \n초과 할 수 없습니다."
//				});
				str2 = str.substr(0, rlen); // 문자열 자르기
				obj.val(str2);
//				return false;
			} 
		}
	}

	// 삭제 버튼 클릭
	,DelClickEvent : function(data) {
		$("#dlvPrcsMemo").val("");
		data.prcs_memo=$("#dlvPrcsMemo").val();
		page.dlvPrcsMemoRgst(data);
	}

	// 전송 버튼 클릭
	,SendClickEvent : function(data) {
		data.prcs_memo = $("#dlvPrcsMemo").val();

		page.dlvPrcsMemoRgst(data);
	}

	// 메모 조회 통신
	,dlvPrcsMemo : function(data) {
		smutil.loadingOn(); // 로딩바 열기
		
		page.apiParam.param.baseUrl="smapis/cldl/dlvPrcsMemo";
		page.apiParam.param.callback="page.dlvPrcsMemoCallback";
		page.apiParam.data.parameters=data;

		// 공통 api호출 함수
		smutil.callApi(page.apiParam);
	}

	// 메모 조회 통신 콜백
	,dlvPrcsMemoCallback : function(data) {
		try {
			if (smutil.apiResValidChk(data) && data.code === "0000"
					&& data.data_count !== 0) {
				$("#dlvPrcsMemo").val(data.data.list[0].prcs_memo);
			} 
		} catch (e) {
		} finally {
			smutil.loadingOff(); // 로딩바 닫기
		}
	}

	// 전송 통신
	,dlvPrcsMemoRgst : function(data) {
		smutil.loadingOn(); // 로딩바 열기
		
		page.apiParam.param.baseUrl="smapis/cldl/dlvPrcsMemoRgst";
		page.apiParam.param.callback="page.dlvPrcsMemoRgstCallback";
		page.apiParam.data.parameters=data;

		// 공통 api호출 함수
		smutil.callApi(page.apiParam);
	}

	// 전송 통신 콜백
	,dlvPrcsMemoRgstCallback : function(data) {
		try {
			if (smutil.apiResValidChk(data) && data.code === "0000"
					&& data.data_count !== 0) {
				LEMP.Window.alert({
					"_sTitle" : "알림",
					"_vMessage" : "메모가 성공적으로 전송되었습니다."
				})
				
				LEMP.Window.close({
					"_sCallback" : "page.listReLoad"
				});

			}
		} catch (e) {
		} finally {
			smutil.loadingOff(); // 로딩바 닫기
		}
	}
};
