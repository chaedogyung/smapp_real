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

	set0501 : {},

	init : function() {
		page.publishCode();
		page.initEvent();
	},

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
				page.set0501.sortable = arr;
			},
			cancel : "",
			axis : 'y'
		});
	},

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
				"_sTitle" : "집배달 시간대역",
				"_vMessage" : "집배달 시간대역이 설정되었습니다."
			});
			LEMP.Window.close();
		});

		page.codeListPopup();
	},

	// 집배달 시간대역 조회
	codeListPopup : function() {
		smutil.loadingOn();
		page.apiParam.param.baseUrl = "smapis/cmn/codeListPopup";
		page.apiParam.param.callback = "page.codeListPopupCallback";
		page.apiParam.data.parameters = {
			"typ_cd" : "HPSR_TMSL"
		};
		smutil.callApi(page.apiParam);
	},

	// 집배달 시간대역 콜백
	codeListPopupCallback : function(res) {
		try {
			let hpsrArr = page.getPropHpsr();
			// 통신성공
			if (smutil.apiResValidChk(res) && res.code === "0000") {
				//저장된 HPSR_TMSL이 없으면 기본순서대로 출력

				if (smutil.isEmpty(hpsrArr)) {
					page.drawCodeList(res.data.list);
					return false;
				}
				else{
					let comArr = [];
					_.forEach(hpsrArr, function (v){
						_.forEach(res.data.list, function (value){
							if(value.dtl_cd == v.dtl_cd){
								comArr.push(value);
							}
						});
					});
					page.drawCodeList(comArr);
				}
				// 통신실패
			} else {
				// properties에 데이터가 있음
				if (!smutil.isEmpty(hpsrArr)) {
					page.drawCodeList(hpsrArr);
				}
			}
		} catch (e) {
		} finally {
			// page.listCheck();
			smutil.loadingOff();
		}
	},

	// 저장버튼 누를시 화면의 목록을 properties에 저장
	setProp : function(res) {
		LEMP.Properties.set({
			"_sKey" : "hpsrTmsl",
			"_vValue" : res
		});
	},

	// 저장되어있는 properties를 불러옴
	getPropHpsr : function() {
		var obj = LEMP.Properties.get({
			"_sKey" : "hpsrTmsl"
		});
		// alert("getProp : " + (JSON.stringify(obj)));

		return obj;
	},

	// 그려져있는 리스트를 JSONarray로 변환해서 반환해줌.
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
	},

	// handlebars draw
	drawCodeList : function(res) {
		var data = {
			"list" : res
		};
		var source = $("#SET0501_list_template").html();
		var template = Handlebars.compile(source);
		$("#sortable").append(template(data));
	}
}