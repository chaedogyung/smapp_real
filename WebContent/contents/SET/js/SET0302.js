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
		page.set0301 = page.getProp();
		page.publishCode();
		page.initEvent();
	},
	set0301 : {}

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
				page.set0301.sortable = arr;
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

		Handlebars.registerHelper('delFunc', function(options) {
			if (this.code_status === "P") { // 집하
				// options.fn == if(true)
				return options.fn(this)
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
				"_sTitle" : "미배달/미회수 사유 목록",
				"_vMessage" : "미배달/미회수 사유 목록이 설정되었습니다."
			});
			LEMP.Window.close();
		});

		$(document).on('click', ".btn.del2", function() {
			if ($(this).parents("li").data("codeStatus") !== "S") {
				var index = $(this).parents("li").index();
				$('.mpopBox.delete').bPopup(function() {
					$("#confirm").attr("data-sel-li", index);
				});
			}
		});

		$('#confirm').click(function() {
			var index = $(this).attr("data-sel-li");
			$("#sortable > li").eq(index).remove();
			$('.mpopBox.delete').bPopup().close();

			var arr = [];
			$("#sortable > li").each(function() {
				var obj = {};
				obj.dtl_cd_nm = $(this).find("span").text();
				obj.dtl_cd = String($(this).data("dtlCd"));
				obj.code_status = $(this).data("codeStatus");
				arr.push(obj);
			});
		});

		// $("#append").click(function() {
		// 	var popUrl = smutil.getMenuProp("COM.COM0602", "url");
		// 	LEMP.Window.open({
		// 		"_sPagePath" : popUrl
		// 	});
		// });
		page.codeListPopup();
	}
	// 미배달/미회수 사유 리스트 조회
	,
	codeListPopup : function() {
		smutil.loadingOn();
		page.apiParam.param.baseUrl = "smapis/cmn/codeListPopup";
		page.apiParam.param.callback = "page.codeListPopupCallback";
		page.apiParam.data.parameters = {
			"typ_cd" : "UDLV_RSN_CD"
		};
		smutil.callApi(page.apiParam);
	}
	// 미배달/미회수 사유 리스트 콜백
	,
	codeListPopupCallback : function(res) {
		try {
			var result_insu = [];

			// 통신성공
			if (smutil.apiResValidChk(res) && res.code === "0000") {
				for (var i = 0; i < res.data.list.length; i++) {
					res.data.list[i].code_status = "S";
				}
				// properties에 데이터가 있음
				if (!smutil.isEmpty(page.getProp())) {

					var temp_insu_l = [];
					var temp_insu_p = [];
					var append_insu = [];
					var delete_insu = [];
					var result_temp = [];

					// 결과에 추가해야할 코드 탐색 후 append배열에 저장
					for (var i = 0; i < res.data.list.length; i++) {
						temp_insu_l.push(JSON.parse(JSON
								.stringify(res.data.list[i])));
						var check = _.find(page.set0301, {
							"dtl_cd" : temp_insu_l[i].dtl_cd
						});
						if (smutil.isEmpty(check)) {
							append_insu.push(JSON.parse(JSON
									.stringify(temp_insu_l[i])));
						}
					}

					// Properties의 값중 code_status가 S인 코드만 temp배열에 저장
					for (var i = 0; i < page.set0301.length; i++) {
						if (page.set0301[i].code_status==="S") {
							temp_insu_p.push(JSON.parse(JSON
									.stringify(page.set0301[i])));
						}
					}

					// 결과에서 삭제해야할 코드 탐색 후 delete배열에 저장
					for (var i = 0; i < temp_insu_p.length; i++) {
						var check = _.find(res.data.list, {
							"dtl_cd" : temp_insu_p[i].dtl_cd
						});
						if (smutil.isEmpty(check)) {
							delete_insu.push(JSON.parse(JSON
									.stringify(temp_insu_p[i])));
						}
					}

					for (var i = 0; i < temp_insu_l.length; i++) {
						for (var j = 0; j < temp_insu_p.length; j++) {
							// 변경
							if ((temp_insu_l[i].dtl_cd == temp_insu_p[j].dtl_cd)&&
									(temp_insu_l[i].dtl_cd_nm != temp_insu_p[j].dtl_cd_nm)&&
									temp_insu_p.code_status ==="S") {
								temp_insu_p[j].dtl_cd_nm = temp_insu_l[i].dtl_cd_nm
								break;
							}
						}
					}
					
					// result배열에 출력할 결과물을 저장
					// 삭제는 result에 반영하지 않으면 됨.
					for (var i = 0; i < page.set0301.length; i++) {
						var check = _.find(delete_insu, {
							"dtl_cd" : page.set0301[i].dtl_cd
						});
						if (smutil.isEmpty(check)) {
							result_temp.push(page.set0301[i]);
						}
					}
					// 추가는 result의 후미에 추가
					result_insu = result_temp.concat(append_insu);
					// properties에 데이터가 없음
				} else {
					page.drawCodeList(res.data.list);
					return false;
				}
				// 통신실패
			} else {
				// properties에 데이터가 있음
				if (!smutil.isEmpty(page.getProp())) {
					for (var i = 0; i < page.set0301.length; i++) {
						if (page.set0301[i].code_status == "P") {
							result_insu.push(page.set0301[i]);
						}
					}
					// properties에 데이터가 없음
				}
				// else {}
			}
			page.drawCodeList(result_insu);
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
			"_sKey" : "nonDeliveryReason",
			"_vValue" : res
		});

		page.set0301 = page.getProp();
	}

	// 저장되어있는 properties를 불러옴
	,
	getProp : function() {
		var obj = LEMP.Properties.get({
			"_sKey" : "nonDeliveryReason"
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
		var source = $("#SET0301_list_template").html();
		var template = Handlebars.compile(source);
		$("#sortable").append(template(data));
	}

	,
	COM0602Callback : function(res) {
		var arr = [];
		var obj = {
			"dtl_cd_nm" : res.param.value,
			"dtl_cd" : "99",
			"code_status" : "P"
		};
		arr.push(obj);
		page.drawCodeList(arr);
		$("li[data-dtl-cd='99'][data-code-status='S']").insertAfter($("#sortable > li").last());
	}
}