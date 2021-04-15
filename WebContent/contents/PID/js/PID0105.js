var page = {

	dataList : [],		//전달받은 리스트
	argType : null,			// 조회 종류

	// api 호출 기본 형식
	apiParam : {
		id:"HTTP",						// 디바이스 콜 id
		param:{							// 디바이스가 알아야할 데이터
			task_id : "",				// 화면 ID 코드가 들어가기로함
			//position : {},			// 사용여부 미확정
			type : "",
			baseUrl : "",
			method : "POST",			// api 호출 형식(지정 안하면 'POST' 로 자동 셋팅)
			callback : "",				// api 호출후 callback function
			contentType : "application/json; charset=utf-8"
		},
		data:{"parameters" : {}}		// api 통신용 파라메터
	},

	init:function(arg)
	{
		page.dataList = arg.data.clientList;			//전달받은 리스트
		page.argType = arg.data.type;				// 조회 종류

		page.initEvent();				// 페이지 이벤트 등록
		page.initDpEvent();				// 화면 디스플레이 이벤트
	},

	// 페이지 이벤트 등록
	initEvent : function()
	{
		/* 닫기(x) */
		$(".btn.closeW.paR").click(function(){
			LEMP.Window.close();
		});

		/* 확인 */
		$("#popConfirmBtn").click(function(){
			let pickCheck = $("input[name=pick]:checked");
			const code = pickCheck.attr("id");
			const name = pickCheck.data("name");

			// 라디오 버튼을 선택하지 않았을 경우
			if(!$("input[name='pick']").is(":checked")){
				LEMP.Window.alert({
					"_sTitle" : "알림",
					"_vMessage" : "버튼을 선택해주세요."
				});
				return false;
			}else{
				let param = {
					"type" : page.argType,			// 조회 종류
					"code" : code,					// 코드
					"name" : name,					// 이름
					"job_cust_cd" : code,			// 거래처 코드
					"job_cust_nm" : name,			// 거래처 이름
				};

				if(page.argType === "Cust"){
					param = pickCheck.data("json");
					param.type = page.argType;

				}else if(page.argType === "Fix"){
					param = pickCheck.data("json");
					param.type = page.argType;
					// param.shcn_nm = pickCheck.data("name")				//이름
					// param.ldno_dadr = pickCheck.data("ldnoDadr");		//상세주소
					// param.ldno_badr = pickCheck.data("ldnoBadr");		//주소
					// param.tel = pickCheck.data("tel");					//전화번호
					// param.zipcd = pickCheck.data("zipcd")+"";				//우편번호
					// param.bld_mgr_no = pickCheck.data("bldMgrNo");		//건물번호
					// param.basAreaCd = pickCheck.data("basAreaCd")+"";
					// param.picsh_cd = pickCheck.data("picshCd")+"";
					// param.picsh_nm = pickCheck.data("picshNm")+"";
				}

				LEMP.Window.close({
					"_oMessage" : param,
					"_sCallback" : "page.pid0105Callback"
				});
			}

		});
	},

	initDpEvent : function()
	{
		smutil.loadingOn();
		let menuTitle = $('#menuTitle');
		if(page.argType === "Cust"){
			menuTitle.text("거래처 선택");
		}else{
			menuTitle.text("고정송수하주 선택");
		}
		page.setHandlebars();
		page.setDataList();
	},


	//전달받은 리스트로 화면에 표시(거래처 조회)
	setDataList : function (){
		let data = {};
		data.list = page.dataList;
		// 핸들바 템플릿 가져오기
		let source = $("#pid0105" + page.argType + "Template").html();

		// 핸들바 템플릿 컴파일
		let template = Handlebars.compile(source);

		// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
		let liHtml = template(data);

		// 생성된 HTML을 DOM에 주입
		$('#pid0105LstUl').html(liHtml);
		smutil.loadingOff();
	},

	setHandlebars : function () {
		Handlebars.registerHelper('data_json', function(ary, max, options) {
			return JSON.stringify(this);
		});
	},

	// api 파람메터 초기화
	apiParamInit : function(){
		page.apiParam =  {
			id:"HTTP",					// 디바이스 콜 id
			param:{						// 디바이스가 알아야할 데이터
				task_id : "",			// 화면 ID 코드가 들어가기로함
				//position : {},		// 사용여부 미확정
				type : "",
				baseUrl : "",
				method : "POST",		// api 호출 형식(지정 안하면 'POST' 로 자동 셋팅)
				callback : "",			// api 호출후 callback function
				contentType : "application/json; charset=utf-8"
			},
			data:{"parameters" : {}}	// api 통신용 파라메터
		};
	}
};
