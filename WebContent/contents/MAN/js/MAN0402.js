// 뒤로가기 버튼 클릭시 이벤트
LEMP.addEvent('backbutton', 'page.onBack');

var page = {
	// 데이터
	MAN0402: {},

	// API 호출 인터페이스
	apiParam: {
		id: 'HTTP',             // 디바이스 콜 ID
		param: {                // 디바이스용 데이터
			task_id: '',        // 화면 ID
			type: '',
			baseUrl: '',
			method: 'POST',     // API METHOD(지정 안하면 'POST' 로 자동 셋팅)
			callback: '',       // API CALLBACK
			contentType: 'application/json; charset=utf-8'
		},
		data: {parameters: {}}  // API용 데이터
	},

	//////////////////////////////////////////////////
	// 초기화 (LEMP에서 최초 실행)
	init: function(arg) {
		page.MAN0402 = arg.data.param;

		page.initEvent();       // 이벤트 초기화
		page.initDisplay();     // 디스플레이 초기화
	},

	//////////////////////////////////////////////////
	// 이벤트 초기화
	initEvent: function() {
		// 저장 클릭
		$(".btnBox").on('click', function(e) {
			var invsNo = $('.invs:checked').val();
			if (invsNo === undefined) {
				LEMP.Window.toast({
					'_sMessage' : '칭찬 내용을 선택해 주세요.',
					'_sDuration' : 'short'
				});

				return;
			}

			page.invsYearEvl();
		});

		// Replace new line
		Handlebars.registerHelper('replaceNewline', function(text) {
			text = text.replace(/(?:\r\n|\r|\n)/g, '<br>');
			return new Handlebars.SafeString(text);
		});
	},

	//////////////////////////////////////////////////
	// 디스플레이 초기화
	initDisplay: function() {
		// 날짜
		$('.date').text(new Date().LPToFormatDate("yyyy.mm.dd"));

		// 제목
		$('.tit').html(page.MAN0402.year_cplt_titl);

		// 핸들바 템플릿 가져오기
		var source = $("#man0402_list_template").html();

		// 핸들바 템플릿 컴파일
		var template = Handlebars.compile(source);

		// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
		var liHtml = template(page.MAN0402);

		// 생성된 HTML을 DOM에 주입
		$('#list').html(liHtml);

		// 더보기 이벤트
		$(".radioContentMore").on('click', function(){
			var $this = $(this);
			var $li = $this.closest("li");

			$li.siblings().removeClass("active");
			$li.toggleClass("active");

			$(".radioContentMore").html('더보기');
			$li.hasClass("active") && $this.html("접기");
		});
	},

	//////////////////////////////////////////////////
	// API CALL: 연간 친절페스티벌 투표
	invsYearEvl: function() {
		var invsNo = $('.invs:checked').val();

		page.apiParam.id = 'HTTP';
		page.apiParam.param.baseUrl = '/smapis/cplt/invs/year/evl';         // API NO
		page.apiParam.param.callback = 'page.invsYearEvlCallback';          // API CALLBACK
		page.apiParam.data.parameters.invs_no = invsNo;       				// PARAM: 선택한 설문조사 ID
		page.apiParam.data.parameters.scor = 1;                				// PARAM: 점수(고정값)

		smutil.callApi(page.apiParam);
	},

	//////////////////////////////////////////////////
	// API CALLBACK: 연간 친절페스티벌 투표
	invsYearEvlCallback: function() {
		LEMP.Window.close();
	},

	//////////////////////////////////////////////////
	// 물리적 뒤로가기 버튼 및 뒤로가기 버튼 클릭
	onBack : function() {
		LEMP.Window.toast({
			'_sMessage' : '칭찬 내용을 선택해 주세요.',
			'_sDuration' : 'short'
		});
	}
}
