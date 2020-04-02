var page = {
		
		argFlag : null,		// 약관 flag
		argEtc : null,		// 기타값(리턴값)
		
		init:function(arg)
		{
			page.argFlag = arg.data.flag;
			page.argEtc = arg.data.etc;
			
			var title;
			switch(page.argFlag){
				case "01":
					title = "개인정보 수집 및 이용안내";
					break;
				case "02":
					title = "개인정보활용동의";
					break;
				default:
					title = "";
					break;
			}
			
			$("#termsTitle").text(title);
			
			page.initEvent();			// 페이지 이벤트 등록
			page.initDpEvent();			// 화면 디스플레이 이벤트
		},
		
		// 페이지 이벤트 등록
		initEvent : function()
		{
			var _this = this;
			
			/* 닫기(x)*/
			$(".closeTerms").click(function(){
				LEMP.Window.close({});
			});
			
			/* 확인 */
			$(".agree").click(function(){
				LEMP.Window.close({
					"_oMessage" : {
						"agree" : "true",			// 동의
						"flag" : page.argFlag,		// 구분 코드
						"etc" : page.argEtc			// 기타값
						
					},
					"_sCallback" : "page.com1101Callback"
				});
			});
			
			/* 동의안함 */
			$(".doNotAgree").click(function(){
				LEMP.Window.close({
					"_oMessage" : {
						"agree" : "false",			// 비동의
						"flag" : page.argFlag,		// 구분 코드
						"etc" : page.argEtc			// 기타값
					},
					"_sCallback" : "page.com1101Callback"
				});
			});
			
		},
		
		initDpEvent : function()
		{
			smutil.loadingOn();					// 로딩바 열기
			page.termContent();
		},
		
		// 약관 내용
		termContent : function(){
			try{
				
				// 핸들바 템플릿 가져오기
				var source = $("#com1101_terms" + page.argFlag + "_template").html();
				
				// 핸들바 템플릿 컴파일
				var template = Handlebars.compile(source); 
				
				// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
				var html = template();
				
				// 생성된 HTML을 DOM에 주입
				$('.contentBox.terms').html(html);
				
			}
			catch(e){}
			finally{
				smutil.loadingOff();			// 로딩바 닫기
			}
		},
		
};