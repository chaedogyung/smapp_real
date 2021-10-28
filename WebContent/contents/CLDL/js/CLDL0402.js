var page = {
		
	init:function(arg)
	{
		page.param = arg.data.param;
		page.initInterface();
		page.codeListPopup();
	}
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
	,param : null				//이전페이지에서 넘겨받은 파라미터
//	,cldl0402:{}				//목록생성
	,initInterface : function()
	{
		//닫기버튼 클릭
		$(".btn.closeW.paR").click(function(){
			LEMP.Window.close();
		});
		
		
		$(document).on("click",".radio > li",function(){
			//li 클릭시 해당 radio button on
			$(this).find("input").prop("checked",true);
			
			//선택한 radio button 정보의 code에 따라 실행문 분기
			/**
			 * 정보를 읽지 못했을시 >> else 구문실행
			 * 직접입력을 선택했을시 >> else if 구문실행
			 * 그외의 정보를 읽었을시 >> if 구문 실행
			 */
			if($("input[name=ra]:checked").data("dtlCd")!="99"){
				page.CLDL0403Callback({
					"acpt_sct_cd":$("input[name=ra]:checked").data("dtlCd")
					});
			}else if ($("input[name=ra]:checked").data("dtlCd")=="99") {
				if ($("input[name=ra]:checked").val()=="직접입력") {
					var popUrl = smutil.getMenuProp('CLDL.CLDL0403', 'url');
					LEMP.Window.open({
						"_sPagePath":popUrl,
						"_oMessage":{
							"param":{
								"acpt_sct_cd":$("input[name=ra]:checked").data("dtlCd")
							}
						}
					});
				}else {
					page.CLDL0403Callback({
						"acpt_sct_cd":$("input[name=ra]:checked").data("dtlCd"),
						"acpr_nm":$("input[name=ra]:checked").val()
						});
				}
				
			}else {
				LEMP.Window.toast({
					"_sMessage":"버튼을 선택해주세요",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle" : "경고",
//					"_vMessage" : "버튼을 선택해주세요"
//				});
			}
		});
		
		// label event 캡쳐링 방지
		$(document).on("click",".radio > li > span > label",function(e){
			e.preventDefault();
		});
	}
	
	,CLDL0403Callback : function(res){
		if(!smutil.isEmpty(page.param.menu_id)){
			res.menu_id = page.param.menu_id;
			res.cldl_sct_cd = page.param.cldl_sct_cd;
			res.cldl_tmsl_cd = page.param.cldl_tmsl_cd;
			res.mbl_dlv_area = page.param.mbl_dlv_area;
			res.max_nm = page.param.max_nm;
			res.area_sct_cd = page.param.area_sct_cd;

//			smutil.loadingOn();
			var popUrl = smutil.getMenuProp('COM.COM0101', 'url');
			LEMP.Window.replace({
				"_sPagePath":popUrl,
				"_oMessage":{
					"param":res
				}
			});
//			smutil.loadingOff();
		}
		else{
			LEMP.Window.toast({
				"_sMessage":"스캔 처리 구분값이 없습니다.",
				'_sDuration' : 'short'
			});
//			LEMP.Window.alert({
//				"_sTitle":"스캔오류",
//				"_vMessage":"스캔 처리 구분값이 없습니다."
//			});
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
				};
				// properties에 데이터가 있음
				if (!smutil.isEmpty(properties_arr)) {
					
					var temp_insu_l = [];
					var temp_insu_p = [];
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
					};

					// Properties의 값중 code_status가 S인 코드만 temp배열에 저장
					for (var i = 0; i < properties_arr.length; i++) {
						if (properties_arr[i].code_status==="S") {
							temp_insu_p.push(JSON.parse(JSON.stringify(properties_arr[i])));
						}
					};

					// 결과에서 삭제해야할 코드 탐색 후 delete배열에 저장
					for (var i = 0; i < temp_insu_p.length; i++) {
						var check = _.find(res.data.list, {
							"dtl_cd" : temp_insu_p[i].dtl_cd
						});
						if (smutil.isEmpty(check)) {
							delete_insu.push(JSON.parse(JSON.stringify(temp_insu_p[i])));
						}
					};

					for (var i = 0; i < temp_insu_l.length; i++) {
						for (var j = 0; j < temp_insu_p.length; j++) {
							// 변경
							if ((temp_insu_l[i].dtl_cd == temp_insu_p[j].dtl_cd)&&
									(temp_insu_l[i].dtl_cd_nm != temp_insu_p[j].dtl_cd_nm)&&
									temp_insu_p.code_status ==="S") {
								temp_insu_p[j].dtl_cd_nm = temp_insu_l[i].dtl_cd_nm;
								break;
							}
						};
					};
					
					// result배열에 출력할 결과물을 저장
					// 삭제는 result에 반영하지 않으면 됨.
					for (var i = 0; i < properties_arr.length; i++) {
						var check = _.find(delete_insu, {
							"dtl_cd" : properties_arr[i].dtl_cd
						});
						if (smutil.isEmpty(check)) {
							result_temp.push(properties_arr[i]);
						};
					};
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
			page.codeListCallback();
		}
	}
	,codeListCallback:function(){
		var prop = LEMP.Properties.get({"_sKey" : "receiver"});
		var data = {
			"list":prop
		};
		/*
		page.cldl0402 = LEMP.Properties.get({"_sKey" : "receiver"});
		var data={
			"list":page.cldl0402
		}
		*/
		var template = Handlebars.compile($("#CLDL0402_list_template").html());

		$("#CLDL0402LstUl").html(template(data));
	}
};

