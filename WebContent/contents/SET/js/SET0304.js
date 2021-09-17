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
	}

	,
	init : function() {
		page.set0304 = page.getProp();
		page.publishCode();
		page.initEvent();
	},
	set0304 : {}

	,
	publishCode : function() {
		/* li 이동 */
		$("#sortable > li").each(function() {
			$(this).find('input[name=num]').val($(this).index() + 1);
		});

		$("#sortable").sortable({
			disabled : false,
			handle : ".move",
			update : function(event, ui) {
				var obj = $(this).sortable("toArray", {
					attribute : "id"
				})
				var arr = [];
				for (var i = 0; i < obj.length; i++) {
					var JSONobj = {};
					JSONobj.dtl_cd = $(this).children().eq(i)
							.attr("id");
					JSONobj.dtl_cd_nm = $(this).children().eq(i).find(
							"span").text();
					arr.push(JSONobj);
				}
				page.set0304.sortable = arr;
			},
			cancel : "",
			axis : 'y'
		});
	}

	,
	initEvent : function() {
		Handlebars.registerHelper('liCnt', function(key) {
			var index = $("#sortable > li").length;
			if (index > 0) {
				return index;
			} else {
				return key;
			}
		});

		// 닫기 버튼
		$(".btn.closeW.paR").click(function() {
			LEMP.Window.close();
		});


		// 저장 버튼
		$("#propReg").click(function() {
			page.listCheck();
			LEMP.Window.alert({
				"_sTitle" : "미집하 사유 목록",
				"_vMessage" : "미집하 사유 목록이 설정되었습니다."
			});
			LEMP.Window.close();
		});

		page.codeListPopup();
	}
	// 미배달/미회수 사유 리스트 조회
	,
	codeListPopup : function() {
		smutil.loadingOn();
		page.apiParam.param.baseUrl = "smapis/cmn/codeListPopup";
		page.apiParam.param.callback = "page.codeListPopupCallback";
		page.apiParam.data.parameters = {
			"typ_cd" : "UPICK_RSN_CD"
		};
		smutil.callApi(page.apiParam);
	}
	// 미배달/미회수 사유 리스트 콜백
	,
	codeListPopupCallback : function(res) {
		try {
			var result_reason = [];

			// 통신성공
			if (smutil.apiResValidChk(res) && res.code === "0000") {
				for (var i = 0; i < res.data.list.length; i++) {
					res.data.list[i].code_status = "S";
				}
				// properties에 데이터가 있음
				if (!smutil.isEmpty(page.getProp())) {

					var temp_reason_l = [];
					var temp_reason_p = [];
					var append_reason = [];
					var delete_reason = [];
					var result_temp = [];

					// 결과에 추가해야할 코드 탐색 후 append배열에 저장
					for (var i = 0; i < res.data.list.length; i++) {
						temp_reason_l.push(JSON.parse(JSON
								.stringify(res.data.list[i])));
						var check = _.find(page.set0304, {
							"dtl_cd" : temp_reason_l[i].dtl_cd
						});
						if (smutil.isEmpty(check)) {
							append_reason.push(JSON.parse(JSON
									.stringify(temp_reason_l[i])));
						}
					}

					// Properties의 값중 code_status가 S인 코드만 temp배열에 저장
					for (var i = 0; i < page.set0304.length; i++) {
						if (page.set0304[i].code_status==="S") {
							temp_reason_p.push(JSON.parse(JSON
									.stringify(page.set0304[i])));
						}
					}

					// 결과에서 삭제해야할 코드 탐색 후 delete배열에 저장
					for (var i = 0; i < temp_reason_p.length; i++) {
						var check = _.find(res.data.list, {
							"dtl_cd" : temp_reason_p[i].dtl_cd
						});
						if (smutil.isEmpty(check)) {
							delete_reason.push(JSON.parse(JSON
									.stringify(temp_reason_p[i])));
						}
					}

					for (var i = 0; i < temp_reason_l.length; i++) {
						for (var j = 0; j <  page.set0304.length; j++) {
							// 변경
							if ((temp_reason_l[i].dtl_cd == page.set0304[j].dtl_cd)&&
									(temp_reason_l[i].dtl_cd_nm != page.set0304[j].dtl_cd_nm)&&
									page.set0304[j].code_status === 'S') {
								page.set0304[j].dtl_cd_nm = temp_reason_l[i].dtl_cd_nm
								break;
							}
						}
					}
					
					// result배열에 출력할 결과물을 저장
					// 삭제는 result에 반영하지 않으면 됨.
					for (var i = 0; i < page.set0304.length; i++) {
						var check = _.find(delete_reason, {
							"dtl_cd" : page.set0304[i].dtl_cd
						});
						if (smutil.isEmpty(check)) {
							result_temp.push(page.set0304[i]);
						}
					}
					// 추가는 result의 후미에 추가
					result_reason = result_temp.concat(append_reason);
					// properties에 데이터가 없음
				} else {
					page.drawCodeList(res.data.list);
					return false;
				}
				// 통신실패
			} else {
				// properties에 데이터가 있음
				if (!smutil.isEmpty(page.getProp())) {
					for (var i = 0; i < page.set0304.length; i++) {
						if (page.set0304[i].code_status == "P") {
							result_reason.push(page.set0304[i]);
						}
					}
					// properties에 데이터가 없음
				}
				// else {}
			}
			page.drawCodeList(result_reason);
		} catch (e) {
		} finally {
			page.listCheck();
			smutil.loadingOff();
		}
	}

	// 저장버튼 누를시 화면의 목록을 properties에 저장
	,
	setProp : function(res) {
		LEMP.Properties.set({
			"_sKey" : "nonPickUpReason",
			"_vValue" : res
		});

		page.set0304 = page.getProp();
	}

	// 저장되어있는 properties를 불러옴
	,
	getProp : function() {
		var obj = LEMP.Properties.get({
			"_sKey" : "nonPickUpReason"
		});
		return obj;
	}

	// 그려져있는 리스트를 JSONarray로 변환해서 반환해줌.
	,
	listCheck : function() {
		var arr = [];

		$("#sortable > li").each(function(idx, liObj) {
			var obj = {};
			obj.dtl_cd_nm = $(liObj).find("span").text();
			obj.dtl_cd = $(liObj).data("dtlCd")+"";
			obj.code_status = $(liObj).data("codeStatus");
			obj.index = idx+"";
			arr.push(obj);
		})

		page.setProp(arr);
	}

	// handlebars draw
	,
	drawCodeList : function(res) {
		var data = {
			"list" : res
		};
		var source = $("#SET0304_list_template").html();
		var template = Handlebars.compile(source);
		$("#sortable").append(template(data));
	}

}