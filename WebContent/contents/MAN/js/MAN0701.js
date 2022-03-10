LEMP.addEvent("backbutton", "page.callbackBackButton");		// 뒤로가기 버튼 클릭시 이벤트

var page = {
		
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
		
		init:function()
		{
			page.initEvent();			// 페이지 이벤트 등록
			page.initDpEvent();			// 화면 디스플레이 이벤트
			//page.initInterface();
		},
		
//		initInterface : function()
//		{
//			var date = new Date();
//			var day = date.getDay();
//
//		},
		
		initEvent : function()
		{
			$(document).on('click', '.view1Tr', function(){
				
				//비디오태그 URL설정
				page.videoUrlApi($(this).attr('id'));
				
				if($('.video').hasClass('dsn'))
					$('.video').removeClass('dsn');
				
				//page.apiParam.param.callback = "page.videoContentsCallback";
				
//				page.apiParam.data = {
//					"legaldongCode" : $(this).attr('id'),
//					"crtfcky" : "YEJ6U5M390E8DVP0V9OXRDXLD9GSJUE5"
//				};		
//				// 공통 api호출 함수
//				smutil.callApi(page.apiParam);
//				data = smutil.openApi($(this).attr('id'));	
				var id = $(this).attr('id')
		        
		        
				page.apiParamInit(); //파라메터 전역변수 초기화
				
				//여기서 동영상 재생여부 가는 api를 주면 될거같아요!
				//
				
				$('#video').get(0).currentTime = 0;
				$('#video').get(0).play();
				
				
			});
			
			//확인 버튼 click
			$('#checkOkay').click(function(){
				page.callbackBackButton();
			});
			
			

		},
		
		initDpEvent : function()
		{
//			smutil.loadingOn();
//			//재해예방 동영상 리스트 가져오기
			page.cldlAreaLegdList();
			
		},
		
		//재해예방 동영상 리스트
		cldlAreaLegdList : function() {

			page.apiParam.param.baseUrl = "smapis/cldlAreaLegdList";			// api no
			page.apiParam.param.callback = "page.cldlAreaLegdListCallback";	
			
			// 공통 api호출 함수
			smutil.callApi(page.apiParam);
			
			page.apiParamInit(); //파라메터 전역변수 초기화
		},
		
		
		//재해예방 동영상 리스트 callback
		cldlAreaLegdListCallback : function(result) {
			
			page.apiParamInit();

			if(smutil.apiResValidChk(result) && result.code == "0000") {
				LEMP.Window.toast({
					"_sMessage":"리스트를 가져왔습니다." + result.data_count,
					'_sDuration' : 'short'
				});
				
				var data = result.data;
				
				// 핸들바 템플릿 가져오기
				var source = $("#video_list_template").html();

				// 핸들바 템플릿 컴파일
				var template = Handlebars.compile(source);

				// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
				var liHtml = template(data);
				
				// 생성된 HTML을 DOM에 주입
				$('#view1Tbody').html(liHtml);
				
			}else {
				LEMP.Window.toast({
					"_sMessage":"리스트를 가져오지못했습니다. code:" + result.code,
					'_sDuration' : 'short'
				});
			}
			
			smutil.loadingOff();
			
			var videoPlay_yn = LEMP.Properties.get({
				"_sKey" : "videoPlay_yn",
			});
			
			var id = $('.view1Tr:eq(0)').attr('id')

			if(smutil.isEmpty(videoPlay_yn)) {
				$('.btn.back.paL.ti').hide();
				page.videoUrlApi(id);
				$('.video').removeClass('dsn');
				$('#video').get(0).currentTime = 0;
			}else {
				$('.btn.m.red.w100p').hide();
			}
		},
		
		//비디오 태그 URL설정
		videoUrlApi : function(id) {
			$.ajax({
	            url:"http://service.kosha.or.kr/api/deliveryworker/edcVidoRecomend?legaldongCode="+ id +"&crtfcky=YEJ6U5M390E8DVP0V9OXRDXLD9GSJUE5",
	            type:"GET",
	            contentType: "application/json; charset=utf-8",
	            headers : {
	                'access-control-allow': '*'
	            },
	            success: function (xml) {
	                smutil.loadingOff();
//	                LEMP.Window.alert({
//						"_vMessage": $(xml).find('vidoUrl').text(),
//					});
	                
	                $('.video').removeClass('dsn');
	                $('#video source').prop('src', $(xml).find('vidoUrl').text());
	            }
	        });

//			page.apiParam.param.baseUrl = "smapis/videoContents",			// api no
//			page.apiParam.param.callback = "page.videoContentsCallback",
//			page.apiParam.param.method = "GET"
//			page.apiParam.data={"parameters" : {
//				"lege_cd" : id,
//			}} 	
//			// 공통 api호출 함수
//			smutil.callApi(page.apiParam);
//			
//			page.apiParamInit(); //파라메터 전역변수 초기화
//			
//			
		},
		
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
					callback : "",					// api 호출후 callback function
					contentType : "application/json; charset=utf-8"
				},
				data:{"parameters" : {}}// api 통신용 파라메터
			};
		},
		
//		videoContentsCallback : function(xml) {
//			smutil.loadingOff();
//            LEMP.Window.alert({
//				"_vMessage": $(xml).find('vidoUrl').text(),
//			});
//            
//            $('.video').removeClass('dsn');
//		},
		
		callbackBackButton : function() {

			var videoPlay_yn = LEMP.Properties.get({
				"_sKey" : "videoPlay_yn",
			});
			
			var ended = $('#video').prop("ended");
			
			if(smutil.isEmpty(videoPlay_yn)) {
				if(!ended) {
					LEMP.Window.toast({
						"_sMessage":"동영상을 시청해주세요",
						'_sDuration' : 'short'
					});
					return false;
				}	
				else {
					LEMP.Properties.set({
						"_sKey" : "videoPlay_yn",
						"_vValue" : "Y"
					});
					
					LEMP.Window.close();
				}
			}
			
			LEMP.Window.close();
		}
};