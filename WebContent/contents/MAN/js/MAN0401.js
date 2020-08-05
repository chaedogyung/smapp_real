// 뒤로가기 버튼 클릭시 이벤트
LEMP.addEvent('backbutton', 'page.onBack');

var page = {
	// 데이터
	MAN0401: {},

	// 별 갯수
	starValue: 0,

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
		page.MAN0401 = arg.data.param;

		page.initEvent();       // 이벤트 초기화
		page.initDisplay();     // 디스플레이 초기화
	},

	//////////////////////////////////////////////////
	// 이벤트 초기화
	initEvent: function() {
		// 별 선택 이벤트
		var $starBtn = $(".starBtn");
		$starBtn.on('click', function(e) {
			e.preventDefault();
			var $this = $(this);
			var selectValue = $starBtn.index($this) + 1;
			$starBtn.removeClass("active");
			$this.addClass("active");

			if($this.hasClass("active")) {
				$starBtn.each(function(index, ele){
					if(index < selectValue) {
						$(ele).addClass("active");
					}
				});
				page.starValue = selectValue;
			} else {
				$starBtn.each(function(index, ele){
					if(index < selectValue) {
						$(ele).removeClass("active");
					}
				});
				page.starValue = 0;
			}
		});

		// 저장 클릭
		$(".btnBox").on('click', function(e){
			if (page.starValue === 0) {
				LEMP.Window.toast({
					'_sMessage' : '별 평가를 선택해 주세요.',
					'_sDuration' : 'short'
				});

				return;
			}

			page.invsDayEvl();
		});
	},

	//////////////////////////////////////////////////µ
	// 디스플레이 초기화
	initDisplay: function() {
		// 날짜
		$('.date').text(new Date().LPToFormatDate("yyyy.mm.dd"));

		// 제목
		$('.tit').html(page.MAN0401.cplt_titl);

		// 내용
		$('.content').html(page.MAN0401.cplt_cont.replace(/(?:\r\n|\r|\n)/g, '<br>'));
	},

	//////////////////////////////////////////////////
	// API CALL: 일일 친절페스티벌 투표
	invsDayEvl: function() {
		page.apiParam.id = 'HTTP';
		page.apiParam.param.baseUrl = '/smapis/cplt/invs/day/evl';          // API NO
		page.apiParam.param.callback = 'page.invsDayEvlCallback';           // API CALLBACK
		page.apiParam.data.parameters.invs_no = page.MAN0401.invs_no;       // PARAM: 설문조사 ID
		page.apiParam.data.parameters.scor = page.starValue;                // PARAM: 점수

		smutil.callApi(page.apiParam);
	},

	//////////////////////////////////////////////////
	// API CALLBACK: 일일 친절페스티벌 투표
	invsDayEvlCallback: function() {
		LEMP.Window.close();
	},

	//////////////////////////////////////////////////
	// 물리적 뒤로가기 버튼 및 뒤로가기 버튼 클릭
	onBack : function() {
		LEMP.Window.toast({
			'_sMessage' : '별 평가를 선택해 주세요.',
			'_sDuration' : 'short'
		});
	}
}
