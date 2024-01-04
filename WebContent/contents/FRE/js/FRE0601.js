LEMP.addEvent("backbutton", "page.callbackBackButton");		// 뒤로가기 버튼 클릭시 이벤트

var page = {
	//접속 일자
//	FRE0401:{},
	apiParam : {
		id:"HTTP",												// 디바이스 콜 id
		param:{													// 디바이스가 알아야할 데이터
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
	},
	init:function(){
		page.initInterface();
	},
	initInterface(){
		$('.btn.back.paL.fre').click(function(e){
			var popUrl = smutil.getMenuProp('MAN.MAN0001', 'url');
			LEMP.Window.open({
				"_sPagePath" : popUrl,
			});
		})
		page.FltrListSerch();
		$('.lstSch').click(function(){
			page.tctDgMstrList();
		})
		$('.lstSch').trigger('click');
	},
	FltrListSerch : function(){
		smutil.loadingOn();
		var _this = this;
		
		_this.apiParam.param.baseUrl = "/smapis/cmn/codeListPopup"; // api
		_this.apiParam.param.callback = "page.FltrListSerchCallback"; // callback
		_this.apiParam.data = {
			"parameters" : {
				"typ_cd" : "TCT_DG_CD"
			}
		}; // api 통신용 파라메터
		// 공통 api호출 함수
		smutil.callApi(_this.apiParam);
	},

	// 필터조건 조회 callback
	FltrListSerchCallback : function(result){

		// api 결과 성공여부 검사
		if(smutil.apiResValidChk(result) && result.code == "0000"){

			// 조회 결과 데이터가 있으면 옵션 생성
			if(result.data_count > 0){
				var list = result.data.list;
				// select box 셋팅
				smutil.setSelectOptions("#fltr_sct_cd", list);
			}
			smutil.loadingOff();
			
		}
	},
	// ################### 필터조건 조회 end
	
	tctDgMstrList : function(){
		
		var srchKeyword = $("#srchKeyword").val();
		var srchSrchTctDg = $("#fltr_sct_cd option:selected").val();
		smutil.loadingOn();
		page.apiParam.param.method= "GET";
		page.apiParam.param.baseUrl="/smapis/getTctDgMstrList";
		page.apiParam.param.callback="page.getTctDgMstrListCallback";
		page.apiParam.data= {// api 통신용 파라메터
			"parameters" : {
				"srchKeyword" : srchKeyword,
				"srchSrchTctDg" : srchSrchTctDg
			}
		};
		
		smutil.callApi(page.apiParam);
	},
	
	getTctDgMstrListCallback : function(result){
		try{
			var data = {};
			if(result){
				data = result.data; //data = [];
			}
			
			if(result.data_count == 0 || result.code == 9999){
				// 핸들바 템플릿 가져오기
				var source = $("#fre0601_nolist_template").html();
				
				// 핸들바 템플릿 컴파일
				var template = Handlebars.compile(source); 
				
				// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
				var liHtml = template(data);
				
				// 생성된 HTML을 DOM에 주입
				$('.tctDgMstrList').html(liHtml);
				
			}else{
				// 핸들바 템플릿 가져오기
				var source = $("#fre0601_list_template").html();
				
				// 핸들바 템플릿 컴파일
				var template = Handlebars.compile(source); 
				
				// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
				var liHtml = template(data);
				
				// 생성된 HTML을 DOM에 주입
				$('.tctDgMstrList').html(liHtml);
			}
		}
		catch(e){}
		finally{
			smutil.loadingOff();			// 로딩바 닫기
		}
		
	}
};

