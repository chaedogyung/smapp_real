var page = {

	init : function() {
		page.com0601 = LEMP.Properties.get({"_sKey":"receiver"});
		page.initEvent(); // 페이지 이벤트 등록
		page.initDpEvent(); // 화면 디스플레이 이벤트
	},
	// api 호출 기본 형식
	apiParam : {
		id : "HTTP", // 디바이스 콜 id
		param : { // 디바이스가 알아야할 데이터
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
		}
	// api 통신용 파라메터
	},
	com0602Var : {
		plag : false
	},
	com0601 : {},
	initEvent : function() {
		// 닫기
		$("#btnClose").on('click', function() {
			LEMP.Window.close();
		});

		// 시간 row 선택
		$(document).on('click', '.liClickEvent', function() {
			var cnt = $(this).data('liCnt');
			$("#ra_" + cnt).attr("checked", true);
			
			// 기존 확인 버튼 기능
			var selectedCode = $(":input:radio[name=timeRadio]:checked").val();
			var selectedText = $(":input:radio[name=timeRadio]:checked").data('acprNm');
			
			if(selectedCode==="99" && selectedText ==="직접입력"){
				popUrl = smutil.getMenuProp("COM.COM0602","url")
				LEMP.Window.open({
					"_sPagePath":popUrl,
					"_oMessage":{
						"selectedCode" : selectedCode,
						"selectedText" : selectedText
					}
				});
			}else if (!smutil.isEmpty(selectedCode)) {
				LEMP.Window.close({
					"_sCallback" : "page.com0601Callback",
					"_oMessage": {
						"selectedCode" : selectedCode,
						"selectedText" : selectedText
					}
				});
			}
			else{
				LEMP.Window.alert({
					"_sTitle":"인수자 선택 오류",
					"_vMessage":"선택한 정보가 없습니다."
				});
			}
		});
		
		// label event 캡쳐링 방지
		$(document).on("click","#com0601LstUl > li > span > label",function(e){
			e.preventDefault();
		});
	},

	initDpEvent : function() {
		//page.hpsrTmsl(); // 예정시간리스트 조회
		page.codeListPopup(); // 인수자 목록 조회
	},

	// 예정시간리스트 조회
	hpsrTmsl : function() {
		var prop = LEMP.Properties.get({
			"_sKey" : "receiver"
		});
		var data = {
			"list" : prop
		};

		// 핸들바 템플릿 가져오기
		var source = $("#COM0601_list_template").html();

		// 핸들바 템플릿 컴파일
		var template = Handlebars.compile(source);

		// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
		var liHtml = template(data);

		// 생성된 HTML을 DOM에 주입
		$('#com0601LstUl').html(liHtml);

	},

	COM0602Callback : function(res) {
		var selectedCode = $(":input:radio[name=timeRadio]:checked");

		if (selectedCode.val() === "99") {

			LEMP.Window.close({
				"_sCallback" : "page.com0601Callback",
				"_oMessage" : {
					"selectedCode" : selectedCode.val(),
					"selectedText" : res.param.value
				}
			});

		} else {
			LEMP.Window.alert({
				"_sTitle" : "인수자 선택 오류",
				"_vMessage" : "선택한 정보가 없습니다."
			});
		}
	}
	// codeList를 Properties에 저장

	,codeListPopup : function() {
		smutil.loadingOn();
		page.apiParam.param.baseUrl = "smapis/cmn/codeListPopup";
		page.apiParam.param.callback = "page.codeListPopupCallback";
		page.apiParam.data.parameters = {
			"typ_cd" : "ACPT_SCT_CD"
		};
		smutil.callApi(page.apiParam);
	}
	
	// 인수자 리스트 콜백
	,codeListPopupCallback : function(res) {
		try {
			var result_insu = [];
			var properties_arr = LEMP.Properties.get({"_sKey" : "receiver"});
			// 통신성공
			if (smutil.apiResValidChk(res) && res.code === "0000") {
				for (var i = 0; i < res.data.list.length; i++) {
					res.data.list[i].code_status = "S";
				}
				// properties에 데이터가 있음
				if (!smutil.isEmpty(properties_arr)) {
					
					var temp_insu_l = [];
					var temp_insu_p = []
					var append_insu = [];
					var delete_insu = [];
					var result_temp = [];

					// 결과에 추가해야할 코드 탐색 후 append배열에 저장
					for (var i = 0; i < res.data.list.length; i++) {
						temp_insu_l.push(JSON.parse(JSON.stringify(res.data.list[i])));
						var check = _.find(properties_arr, {
							"dtl_cd" : temp_insu_l[i].dtl_cd
						});
						if (smutil.isEmpty(check)) {
							append_insu.push(JSON.parse(JSON.stringify(temp_insu_l[i])));
						}
					}

					// Properties의 값중 code_status가 S인 코드만 temp배열에 저장
					for (var i = 0; i < properties_arr.length; i++) {
						if (properties_arr[i].code_status==="S") {
							temp_insu_p.push(JSON.parse(JSON.stringify(properties_arr[i])));
						}
					}

					// 결과에서 삭제해야할 코드 탐색 후 delete배열에 저장
					for (var i = 0; i < temp_insu_p.length; i++) {
						var check = _.find(res.data.list, {
							"dtl_cd" : temp_insu_p[i].dtl_cd
						});
						if (smutil.isEmpty(check)) {
							delete_insu.push(JSON.parse(JSON.stringify(temp_insu_p[i])));
						}
					}

					for (var i = 0; i < temp_insu_l.length; i++) {
						for (var j = 0; j < temp_insu_p.length; j++) {
							// 변경
							if ((temp_insu_l[i].dtl_cd == temp_insu_p[j].dtl_cd)&&
									(temp_insu_l[i].dtl_cd_nm != temp_insu_p[j].dtl_cd_nm)&&
									temp_insu_p.code_status ==="S") {
								temp_insu_p[j].dtl_cd_nm = temp_insu_l[i].dtl_cd_nm;
								break;
							}
						}
					}
					
					// result배열에 출력할 결과물을 저장
					// 삭제는 result에 반영하지 않으면 됨.
					for (var i = 0; i < properties_arr.length; i++) {
						var check = _.find(delete_insu, {
							"dtl_cd" : properties_arr[i].dtl_cd
						});
						if (smutil.isEmpty(check)) {
							result_temp.push(properties_arr[i]);
						}
					}
					// 추가는 result의 후미에 추가
					result_insu = result_temp.concat(append_insu);
					LEMP.Properties.set({
						"_sKey" : "receiver",
						"_vValue" : result_insu
					});
				} 
				// properties에 데이터가 없음
				else {
					LEMP.Properties.set({
						"_sKey" : "receiver",
						"_vValue" : res.data.list
					});
//					return false;
				}
			} 
			
		} catch (e) {
		} finally {
			smutil.loadingOff();
			page.hpsrTmsl();
		}
	}

// codeList를 Properties에 저장
};
