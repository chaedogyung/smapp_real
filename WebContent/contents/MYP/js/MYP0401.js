LEMP.addEvent("backbutton", "page.callbackBackButton");		// 뒤로가기 버튼 클릭시 이벤트
var page = {
	MYP0401 :{},				// 전달받은 파라메터
	param_list : [],			// 긴급사용 승인할 리스트
	isPop : false,

	// api 호출 기본 형식
	apiParam : {
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
		data:{"parameters" : {}}// api 통신용 파라메터
	},

	init : function(arg)
	{
		//팝업에서 들어왔을경우
		if(!smutil.isEmpty(arg.data.param)){
			page.MYP0401 = arg.data.param;
			if(page.MYP0401.typ_cd === "pop"){
				//뒤로가기버튼 숨김처리
				$('.back').remove();
				page.isPop = true;
			}
		}

		page.initEvent();			// 페이지 이벤트 등록
		page.initDpEvent();			// 화면 디스플레이 이벤트
	},

	// 페이지 이벤트 등록
	initEvent : function()
	{
		/* 체크박스 전체선택 */
		$("#checkall").click(function(){
			if($("#checkall").prop("checked")){
				$("input[name=chk]").prop("checked",true);
			}else{
				$("input[name=chk]").prop("checked",false);
			}
		});

		// 화면 상단의 새로고침 버튼을 누른경우
		$("#btn_refresh").click(function(){
			smutil.loadingOn();
			page.empList();		//긴급사용 신청리스트 조회
		});

		// 등록(전송) 버튼 클릭
		$('#acceptBtn').click(function(e){
			let liLst = $('.acceptListBox > ul > li');
			let empNo;									// li 에 걸려있는 사원번호
			let param_list = [];						// 전송할 리스트 배열
			let empNoObj = {};

			// 모든 li 리스트를 돌면서 스캔한 데이터와 체크박스의 체크한 데이터를 셋팅한다.
			$.each(liLst, function(idx, liObj){
				empNo = $(liObj).attr('id')+"";
				// 체크박스에 체크한 데이터
				if($('#'+empNo+'_chk').prop("checked")){
					empNoObj = {"empno":empNo};
					param_list.push(empNoObj);
				}
			});

			page.param_list = param_list;

			let acceptCnt = param_list.length;

			// 컴펌창 호출
			if(acceptCnt > 0){
				$('#pop2Txt2').html('승인할 데이터 '+acceptCnt+'건<br />긴급사용신청을 승인합니다');
				$('.mpopBox.pop2').bPopup();
			}
			else{
				LEMP.Window.alert({
					"_sTitle":"긴급사용 승인 오류",
					"_vMessage":"전송할 데이터가 없습니다.\n체크박스를 선택해주세요.",
				});
			}
		});

		// 긴급사용 승인 'yes' 버튼 클릭
		$('#rsnRgstYesBtn').click(function(){
			// 긴급사용 승인
			page.sendRsnRgstTxt();
		});

		// 종료팝업 > 긴급사용 신청 버튼 클릭
		$('#notDeliveryYesBtn').click(function(){
			const popUrl = smutil.getMenuProp("COM.COM1201","url");
			LEMP.Window.replace({
				"_sPagePath":popUrl
			});
		});

		// 종료팝업 > 종료 버튼 클릭
		$('#notDeliveryNoBtn').click(function(){
			LEMP.App.exit({
				_sType : "kill"
			});
		});

	},


	// 화면 디스플레이 이벤트
	initDpEvent : function(){
		smutil.loadingOn();
		page.empList();		//전체 긴급사용 신청 리스트 조회
	},

	// ################### 페이지 리스트 조회 start
	empList : function(){
		page.apiParam.param.baseUrl = "smapis/use/empList";				// api no
		page.apiParam.param.callback = "page.empListCallback";			// callback methode
		page.apiParam.data = {				// api 통신용 파라메터
			"parameters" : {

			}
		};

		// 공통 api호출 함수
		smutil.callApi(page.apiParam);

		page.apiParamInit();		// 파라메터 전역변수 초기화
	},


	// 리스트 조회후 그리기
	empListCallback : function(result){

		page.apiParamInit();		// 파라메터 전역변수 초기화

		try{
			// 조회한 결과가 있을경우
			if(smutil.apiResValidChk(result) && result.code === "0000"){

				let data = {list:[]};

				//apvyn 이 W 인경우만 표시
				$.each(result.data.list, function(idx, liObj){
					if(liObj.apvyn ==="W"){
						data.list.push(liObj);
					}
				});

				//긴급사용 신청이 없을경우 결과없음 화면 표시
				if(data.list.length>0){
					$(".NoBox").hide();
				}else{
					$(".NoBox").show();
				}

				// 핸들바 템플릿 가져오기
				const source = $("#MYP0401_list_template").html();

				// 핸들바 템플릿 컴파일
				const template = Handlebars.compile(source);

				// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
				const liHtml = template(data);

				// 생성된 HTML을 DOM에 주입
				$('#MYP0401LstUl').html(liHtml);

				//상단에 전체 그리기
				page.showTotalCount(data.list.length);

			}
		}
		catch(e){}
		finally{
			smutil.loadingOff();			// 로딩바 닫기
			page.apiParamInit();			// 파라메터 전역변수 초기화
		}

	},
	// ################### 페이지 리스트 조회 end

	// ################### 긴급사용 승인 start
	sendRsnRgstTxt : function (){
		page.apiParamInit();		// 파라메터 전역변수 초기화

		if(!smutil.isEmpty(page.param_list)){

			//긴급사용 승인 api 호출,
			page.apiParam.id = 'HTTP'
			page.apiParam.param.baseUrl = "smapis/use/approvalSet";				// api no
			page.apiParam.param.callback = "page.rsnRgstCallback";			// callback methode
			page.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {
					"param_list" : page.param_list		// 승인 리스트
				}
			};

			smutil.loadingOn();			// 로딩바 on
			// 공통 api호출 함수
			smutil.callApi(page.apiParam);
		}
	},

	// 긴급사용 승인 콜백
	rsnRgstCallback : function(result) {
		page.apiParamInit();			// 파라메터 전역변수 초기화

		// api 전송 성공
		if (smutil.apiResValidChk(result) && result.code === "0000") {
			LEMP.Window.toast({
				"_sMessage": "긴급사용 승인이 완료되었습니다.",
				"_sDuration": "short"
			});

			smutil.loadingOn();				// 로딩바 시작
			page.empList();				// 전체 리스트 조회
		}
	},
	// ################### 긴급사용 승인 end

	// api 파람메터 초기화
	apiParamInit : function(){
		page.apiParam =  {
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
			data:{"parameters" : {}}// api 통신용 파라메터
		};
	},

	// 물리적 뒤로가기 버튼 클릭시
	callbackBackButton : function(){
		if(page.isPop){
			if($('.mpopBox.pop').is(':visible')){
				$('.mpopBox.pop').bPopup().close();
				return;
			}else{
				$('.mpopBox.pop').bPopup();
				return;
			}
		}else{
			LEMP.Window.close();
		}
	}
};

