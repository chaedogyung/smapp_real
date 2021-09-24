var page = {
	/*
	 * input ==> {"param":{"typ_cd":코드,"key":value,,,}}
	 * output => {"param":{"code":선택한 코드,"value":코드에 해당하는 데이터(날짜, 직접입력 텍스트),"images":이미지경로}}
	 * 필요없는 값은 리턴 하지 않음.
	*/
	init:function(arg)
	{
		/**
		 * 이전 페이지에 따른 분기 처리
		 */

		// 이전페이지에서 전달받은 파라미터를 전역변수에 저장
		page.com0701=arg.data.param;

		// 이전 페이지의 id값을 변수에 저장
		var menu = arg.data.param.menu_id;
		switch (menu) {
		// 집하완료에서 넘어온 경우
		case "PID0101":
		case "PID0302":
		case "CLDL0301":
			// 카카오건일때
			if (arg.data.param.corp_sct_cd ==="2201") {
				page.com0701.typ_cd = "SMAPP_KKO_UPICK_RSN_CD";
				page.com0701.menu_title = "집하보류 사유 등록";
			// 그외
			}else {
				page.com0701.typ_cd = "UPICK_RSN_CD";
				page.com0701.properties_cd = "nonPickUpReason";
				page.com0701.menu_title = "미집하처리 사유 등록";
			}
			break;
			// 집하상세에서 넘어온 경우
//		case "CLDL0301":
//			page.com0701.typ_cd = "UPICK_RSN_CD";
//			page.com0701.menu_title = "미집하처리 사유 등록";
//			break;
		// 미배달사유 일괄전송
		case "CLDL0701":
		// 배달완료에서 넘어온 경우
		case "CLDL0401":
			page.com0701.typ_cd = "UDLV_RSN_CD";
			page.com0701.properties_cd = "nonDeliveryReason";
			page.com0701.menu_title = "미배달처리 사유 등록";
			break;
		default:
			break;
		}

		// headerWrap 클래스명을 지닌 div 하위의 h1에 이전 페이지의 메뉴이름을 지정
		$("div[class='headerWrap'] > h1").text(page.com0701.menu_title);

		page.initInterface();
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
	,com0701:{}
	,initInterface : function()
	{
		// 닫기 버튼
		$(".btn.closeW.paR").click(function(){
			LEMP.Window.close();
		});


		// 라디오 li 클릭
		$(document).on("click",".radio > li",function(){
			$(this).find("input").prop("checked",true);
			//미배달처리의 지정일배송, 미집하처리의 지정일회수 목록이 선택 되었을시
			if((page.com0701.typ_cd=='UPICK_RSN_CD' && $(this).find("input").attr('id') == '17')
					|| (page.com0701.typ_cd=='UDLV_RSN_CD' &&  $(this).find("input").attr('id') == '26')){
				$(".raView").show();
			}else{
				$(".raView").hide();
			}
		})


		// 확인 버튼 클릭시
		$(".btn.red.w100p.m").click(function(){
			// 넘길 데이터 생성
			var code = $("input[name=ra]:checked").attr("id");
			var name = $("label[for='" + code + "']").text();

			var obj = {
					"corp_sct_cd":page.com0701.corp_sct_cd,
					"cldl_sct_cd":page.com0701.cldl_sct_cd,
					"inv_no":page.com0701.inv_no,
					"rsrv_mgr_no":page.com0701.rsrv_mgr_no,	// 카카오 집하보류 접수번호사용
					"code":code,
					"value":undefined,
					"images":undefined,
					"name":name
			}

			if (code ==="99" || (code==="17"&& page.com0701.typ_cd === "UPICK_RSN_CD")
					|| (code==="26"&& page.com0701.typ_cd === "UDLV_RSN_CD")) {
				obj.value = $("#"+code).val();
			}else if(code === "06" && page.com0701.corp_sct_cd == "2201"){	//카카오의 기타(06)일경우
				obj.value = $("#"+code).val();
			}else if (code==="22" && page.com0701.typ_cd === "UPICK_RSN_CD") {
				obj.images = $("#"+code).val();
			}

			// 라디오 버튼을 선택하지 않았을 경우
			if (!$("input[name=ra]").is(":checked")){
				LEMP.Window.alert({
					"_sTitle" : "알림",
					"_vMessage" : "버튼을 선택해주세요."
				});

			// 기타를 선택했을 경우
			}else if (code ==="99" && smutil.isEmpty($("#"+code).val())) {
				LEMP.Window.alert({
					"_sTitle" : "알림",
					"_vMessage" : "사유가 입력되지 않았습니다."
				});
			// 카카오의 기타(06)일경우
			}else if (code === "06" && page.com0701.corp_sct_cd == "2201" && smutil.isEmpty($("#"+code).val())) {
				LEMP.Window.alert({
					"_sTitle" : "알림",
					"_vMessage" : "사유가 입력되지 않았습니다."
				});

			// 지정일회수, 지정일배송을 선택하고 날짜를 지정하지 않은경우
			} else if (
						(
							code ==="17"
							&& page.com0701.typ_cd === "UPICK_RSN_CD"
							&& smutil.isEmpty($("#"+code).val())
						) ||
						(
							code ==="26"
							&& page.com0701.typ_cd === "UDLV_RSN_CD"
							&& smutil.isEmpty($("#"+code).val())
						)
			){
				LEMP.Window.alert({
					"_sTitle" : "알림",
					"_vMessage" : "지정일이 선택되지 않았습니다."
				});

			// 미집하처리 취급불가를 이미지 없이 확인했을 경우
			}else if (
						code === "22"
						&& smutil.isEmpty($("#"+code).val())
						&& page.com0701.typ_cd === "UPICK_RSN_CD"
			){
				LEMP.Window.alert({
					"_sTitle" : "알림",
					"_vMessage" : "이미지가 선택되지 않았습니다."
				});

			}
			else{
				LEMP.Window.close({
					"_oMessage":{
						"param":obj
					},
					"_sCallback":"page.com0701Callback"
				});
			}
		});


		// 카메라버튼 클릭
		// 취급불가 코드를 선택후 사진이 있어야하게끔..
		$(document).on("click",".btn.camera2.fr",function(){
			var popUrl = smutil.getMenuProp("COM.COM0702","url");
			var inv_no = {
				"inv_no":page.com0701.inv_no
			}
			LEMP.Window.open({
				"_sPagePath":popUrl,
				"_oMessage":{
					"param":inv_no
				}
			});
		});


		// 달력버튼 클릭
		$(document).on("click",".inCal",function(){
			var popUrl = smutil.getMenuProp("COM.COM0301","url");
			var limitDate= {
				"minDate":1,
				"maxDate":3
			}

			LEMP.Window.open({
				"_sPagePath":popUrl,
				"_oMessage":{
					"param":limitDate
				}
			});
		});


		// 기타 li 클릭
		$(document).on("click","#99",function(){
			var popUrl = smutil.getMenuProp("COM.COM0602","url");
			LEMP.Window.open({
				"_sPagePath":popUrl
			})
		});

		// 카카오 기타 li 클릭
		$(document).on("click","#06",function(){
			if(page.com0701.corp_sct_cd == "2201"){
				var popUrl = smutil.getMenuProp("COM.COM0602","url");
				LEMP.Window.open({
					"_sPagePath":popUrl
				})
			}
		});

		Handlebars.registerHelper('showRaView', function(options) {
			// 미집하처리의 지정일회수이면 날짜 인풋 추가
			if((page.com0701.typ_cd=='UPICK_RSN_CD' && this.dtl_cd == '17')
				//미배달처리의 지정일배송이면 날짜 인풋 추가
				|| (page.com0701.typ_cd=='UDLV_RSN_CD' && this.dtl_cd == '26')){

				var html = '<div class="raView dsn mgt10 pdl25">';
				html += '<input type="text" value="" name="" placeholder="" class="inCal" id="inCal" readonly="readonly">';
				html += '</div>';

				return new Handlebars.SafeString(html); // mark as already escaped
			//미배달처리의 취급불가이면 카메라 버튼 추가
			}else if (page.com0701.typ_cd=="UPICK_RSN_CD"&& this.dtl_cd=="22") {
				var html='<button class="btn camera2 fr">사진</button>';
				return new Handlebars.SafeString(html); // mark as already escaped
			}
		});


		// 리스트 출력
		/**
		 * 전역변수 com0701의 typ_cd 값을 codeListPopup api의 파라미터로 조회합니다.
		 */
		var data ={"typ_cd":page.com0701.typ_cd};
		page.codeListPopup(data);

	}
	,codeListPopup:function(data){
		smutil.loadingOn();		// 로딩바 열기

		page.apiParam.param.baseUrl = "smapis/cmn/codeListPopup";
		page.apiParam.param.callback = "page.codeListPopupCallback";
		page.apiParam.data.parameters = data;

		// 공통 api호출 함수
		smutil.callApi(page.apiParam);
	}
	,codeListPopupCallback:function(res){
		try{
			if (smutil.apiResValidChk(res) && res.code==="0000") {
				if(page.com0701.corp_sct_cd == "2201"){
					var data = {
							"list" : res.data.list
					};
					// 가져온 핸들바 템플릿 컴파일
					var template = Handlebars.compile($("#com0701_list_template").html());
					// 핸들바 템플릿에 데이터를 바인딩해서 생성된 HTML을 DOM에 주입
					$('#com0701LstUl').append(template(data));
				}else{
					var result_reason = [];
					var properties_arr = LEMP.Properties.get({"_sKey" : page.com0701.properties_cd});
					
					for (var i = 0; i < res.data.list.length; i++) {
						res.data.list[i].code_status = "S";
					}
					// properties에 데이터가 있음
					if (!smutil.isEmpty(properties_arr)) {
						var temp_reason_l = [];
						var temp_reason_p = []
						var append_reason = [];
						var delete_reason = [];
						var result_temp = [];
	
						// 결과에 추가해야할 코드 탐색 후 append배열에 저장
						for (var i = 0; i < res.data.list.length; i++) {
							temp_reason_l.push(JSON.parse(JSON.stringify(res.data.list[i])));
							var check = _.find(properties_arr, {
								"dtl_cd" : temp_reason_l[i].dtl_cd
							});
							if (smutil.isEmpty(check)) {
								append_reason.push(JSON.parse(JSON.stringify(temp_reason_l[i])));
							}
						}
	
						// Properties의 값중 code_status가 S인 코드만 temp배열에 저장
						for (var i = 0; i < properties_arr.length; i++) {
							if (properties_arr[i].code_status==="S") {
								temp_reason_p.push(JSON.parse(JSON.stringify(properties_arr[i])));
							}
						}
	
						// 결과에서 삭제해야할 코드 탐색 후 delete배열에 저장
						for (var i = 0; i < temp_reason_p.length; i++) {
							var check = _.find(res.data.list, {
								"dtl_cd" : temp_reason_p[i].dtl_cd
							});
							if (smutil.isEmpty(check)) {
								delete_reason.push(JSON.parse(JSON.stringify(temp_reason_p[i])));
							}
						}
	
						for (var i = 0; i < temp_reason_l.length; i++) {
							for (var j = 0; j < properties_arr.length; j++) {
								// 변경
								if ((temp_reason_l[i].dtl_cd == properties_arr[j].dtl_cd)&&
									(temp_reason_l[i].dtl_cd_nm != properties_arr[j].dtl_cd_nm)&&
									properties_arr[j].code_status === 'S') {
									properties_arr[j].dtl_cd_nm = temp_reason_l[i].dtl_cd_nm;
									break;
								}
							}
						}
	
						// result배열에 출력할 결과물을 저장
						// 삭제는 result에 반영하지 않으면 됨.
						for (var i = 0; i < properties_arr.length; i++) {
							var check = _.find(delete_reason, {
								"dtl_cd" : properties_arr[i].dtl_cd
							});
							if (smutil.isEmpty(check)) {
								result_temp.push(properties_arr[i]);
							}
						}
						// 추가는 result의 후미에 추가
						result_reason = result_temp.concat(append_reason);
						LEMP.Properties.set({
							"_sKey" : page.com0701.properties_cd,
							"_vValue" : result_reason
						});
					}
					// properties에 데이터가 없음
					else {
						LEMP.Properties.set({
							"_sKey" : page.com0701.properties_cd,
							"_vValue" : res.data.list
						});
	//					return false;
					}
	
					var data;
					if (!smutil.isEmpty(result_reason)) {
						data = {
							"list" : result_reason
						};
					} else {
						data = {
							"list" : res.data.list
						};
					}
	
					//8시30분 이전인경우 심야배송(42) 노출하지 않음
					if(page.com0701.typ_cd === "UDLV_RSN_CD" && !smutil.isMidnight()){
						const idx = data.list.findIndex(function(item) {return item.dtl_cd === "42"})
						if (idx > -1) data.list.splice(idx, 1)
					}
	
					// 가져온 핸들바 템플릿 컴파일
					var template = Handlebars.compile($("#com0701_list_template").html());
					// 핸들바 템플릿에 데이터를 바인딩해서 생성된 HTML을 DOM에 주입
					$('#com0701LstUl').append(template(data));
				}
			}else {
				LEMP.Window.alert({
					"_sTitle" : "알림",
					"_vMessage" : "사유 정보를 받아오지 못했습니다.\n오류가 지속 될 시 담당자에게 연락 바랍니다."
				});
				LEMP.Window.close();
			}
		}
		catch(e){}
		finally{
			smutil.loadingOff();			// 로딩바 닫기
		}
	}
//

	//com0301에서 날짜 선택 한 후 실행되는 콜백 함수
	,COM0301Callback:function(res){
		page.com0701.value=res.param.date.replace(/\./g,'');
		$("#inCal").val(res.param.date);

		if($("#17").length>0 && page.com0701.typ_cd === "UPICK_RSN_CD"){
			$("#17").val(res.param.date.replace(/\./g,''));
		}
		else if($("#26").length>0 && page.com0701.typ_cd === "UDLV_RSN_CD"){
			$("#26").val(res.param.date.replace(/\./g,''));
		}
	}
	,COM0602Callback:function(res){
		page.com0701.value=res.param.value;
		$("#99").val(res.param.value);
		if(page.com0701.corp_sct_cd == "2201"){
			$("#06").val(res.param.value);
		}
	}
	,COM0702Callback:function(res){
		page.com0701.images = res.param.images;
		$("#22").val(res.param.images);
	}
};

