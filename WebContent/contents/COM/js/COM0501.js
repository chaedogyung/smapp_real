var page = {

	init:function()
	{
		page.initEvent();				// 페이지 이벤트 등록
		page.initDpEvent();			// 화면 디스플레이 이벤트
	},

	initEvent : function()
	{
		// 닫기
		$("#btnClose").on('click',function(){
			LEMP.Window.close();
		});

		// 시간 row 선택
		$(document).on('click', '.liClickEvent',function(){
			var cnt = $(this).data('liCnt');
			$("#ra_"+cnt).attr("checked", true);
		});

		// 선택
		$("#timeSelect").on('click',function(){
			var selectedCode = $(":input:radio[name=timeRadio]:checked").val();

			if(!smutil.isEmpty(selectedCode)){
				LEMP.Window.close({
					"_sCallback" : "page.com0501Callback",
				 	"_oMessage": {"selectedCode" : selectedCode}
				});
			}
			else{
				LEMP.Window.alert({
					"_sTitle":"시간선택 오류",
					"_vMessage":"선택한 시간이 없습니다."
				});
			}

		});
	},


	initDpEvent : function(){
		page.hpsrTmsl();				// 예정시간리스트 조회
	},



	// 예정시간리스트 조회
	hpsrTmsl : function(){
		var _this = this;

		var apiParam =  {
			id:"HTTP",			// 디바이스 콜 id
			param:{				// 디바이스가 알아야할 데이터
				//task_id : "",										// 화면 ID 코드가 들어가기로함(사용여부 미확정)
				//position : {},									// 사용여부 미확정
				type : "",
				baseUrl : "smapis/cmn/codeListPopup",
				callback : "page.hpsrTmslCallback",					// api 호출후 callback function
			},
			data:{"parameters" : {"typ_cd":"HPSR_TMSL"}}			// api 통신용 파라메터
		};

		// 공통 api호출 함수
		smutil.callApi(apiParam);
	},


	// 시간 리스트 조회 callback
	hpsrTmslCallback : function(result){

		// api 결과 성공여부 검사
		if(smutil.apiResValidChk(result) && result.code == "0000"){

			var data = result.data;
			let list = [];
			let hpsrArr = page.getPropHpsr();

			//hpsr 데이터가 있을경우 정렬
			if(!smutil.isEmpty(hpsrArr)) {
				_.forEach(hpsrArr, function (v, i){
					_.forEach(result.data.list, function (value, index){
						if(value.dtl_cd == v.dtl_cd){
							list.push(value);
						}
					});
				});
				data.list = list;
			}
			// 토요 휴무 / 지정일 집하/배송 제거
			data.list = data.list.filter(x => {
				return (x.dtl_cd !== '27' && x.dtl_cd !== '28');
			});

			// 핸들바 템플릿 가져오기
			var source = $("#COM0501_list_template").html();

			// 핸들바 템플릿 컴파일
			var template = Handlebars.compile(source);

			// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
			var liHtml = template(data);

			// 생성된 HTML을 DOM에 주입
			$('#cldl0501LstUl').append(liHtml);

		}
//		else{
//			// 핸들바 템플릿 가져오기
//			var source = $("#noboxli").html();
//
//			// 핸들바 템플릿 컴파일
//			var template = Handlebars.compile(source);
//
//			// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
//			var liHtml = template({});
//
//			// 생성된 HTML을 DOM에 주입
//			$('#cldl0501LstUl').append(liHtml);
//		}

	},
	// 저장되어있는 properties를 불러옴
	getPropHpsr : function() {
		var obj = LEMP.Properties.get({
			"_sKey" : "hpsrTmsl"
		});
		// alert("getProp : " + (JSON.stringify(obj)));

		return obj;
	},

};

