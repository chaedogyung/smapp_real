// 뒤로가기 버튼 클릭시 이벤트
LEMP.addEvent('backbutton', 'page.onBack');

var page = {
	// 데이터
	MAN0501: {},

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
		page.MAN0501 = arg.data.param;

		page.initEvent();       // 이벤트 초기화
		// page.initDisplay();     // 디스플레이 초기화
	},

	//////////////////////////////////////////////////
	// 이벤트 초기화
	initEvent: function() {
		// 저장 클릭
		$(".btnBox").on('click', function(e) {
			let id = ['survey1','survey2','survey3','survey4','survey5'];
			// let question = [];
			// let answer = [];
			// let all = [];
			let survey = [];
			let surveyItem;
			let answer;
			for(let i=0; i<id.length; i++){
				answer = $("input[name="+id[i]+"]:checked").val();
				if(smutil.isEmpty(answer)){
					alert((i+1)+"번 문항을 작성해주세요");
					return;
				}
				else{
					// question.push($('#'+id[i]).text());
					// answer.push(survey);
					surveyItem = {idx: i+1, question: $('#'+id[i]).text(), answer: answer};
					survey.push(surveyItem);
				}
			}

			//항목 다채우면 api 채우기
			// page.apiParam.data.parameters.surveyNo = id;
			// page.apiParam.data.parameters.surveyAnswer = answer;
			// page.apiParam.data.parameters.surveyQuestion = question;
			// page.apiParam.data.parameters.surveyAll = all;
			page.sendSurvey(survey);
			return;







			var invsNo = $('.invs:checked').val();
			if (invsNo === undefined) {
				LEMP.Window.toast({
					'_sMessage' : '칭찬 내용을 선택해 주세요.',
					'_sDuration' : 'short'
				});

				return;
			}
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

	},

	//////////////////////////////////////////////////
	// API CALL: 설문조사 답변전송
	sendSurvey: function(survey) {
		var loginId = LEMP.Properties.get({
			"_sKey" : "dataId"
		});
		page.apiParam.id = 'HTTP';
		page.apiParam.param.baseUrl = '/smapis/survey/answer';         // API NO
		page.apiParam.param.callback = 'page.sendSurveyCallback';          // API CALLBACK
		page.apiParam.data.parameters.empno = loginId;				// PARAM: 사원번호
		page.apiParam.data.parameters.survey = survey;				// PARAM: survey 내용

		smutil.callApi(page.apiParam);
	},

	//////////////////////////////////////////////////
	// API CALLBACK: 설문조사 답변전송
	sendSurveyCallback: function() {
		// LEMP.Window.close();
	},

	//////////////////////////////////////////////////
	// 물리적 뒤로가기 버튼 및 뒤로가기 버튼 클릭
	// onBack : function() {
	// 	LEMP.Window.toast({
	// 		'_sMessage' : '칭찬 내용을 선택해 주세요.',
	// 		'_sDuration' : 'short'
	// 	});
	// }
}
