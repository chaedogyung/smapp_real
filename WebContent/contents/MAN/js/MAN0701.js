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
		
		
		initEvent : function()
		{
			$(document).on('click', '.view1Tr', function(){
				
				//비디오태그 URL설정
				page.videoUrlApi($(this).attr('id'));
				
				if($('.video').hasClass('dsn'))
					$('.video').removeClass('dsn');
		        
				page.apiParamInit(); //파라메터 전역변수 초기화
				
				//여기서 동영상 재생여부 가는 api를 주면 될거같아요!
				//
				
				
			});
			
			//확인 버튼 click
			$(document).on('click', '#checkOkay', function(){
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
//				LEMP.Window.toast({
//					"_sMessage":"리스트를 가져왔습니다." + result.data_count,
//					'_sDuration' : 'short'
//				});
				
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
			
			//여기가 공지사항으로 띄워진 화면인지 메인화면에서 띄워진 화면인지 확인하는 코드
			var videoPlay_yn = LEMP.Properties.get({
				"_sKey" : "videoPlay_yn",
			});
			
			var id = $('.view1Tr:eq(0)').attr('id')

			if(smutil.isEmpty(videoPlay_yn)) {
				$('.btn.back.paL.ti').hide();
				page.videoUrlApi(id);
				$('.video').removeClass('dsn');
				$('#video').get(0).currentTime = 0;
				
				var html = "<button class='btn m red w100p' id='checkOkay'>확인</button>"
				$('.btnBox.pxB').html(html);
			}
		},
		
		//비디오 태그 URL설정
		videoUrlApi : function(id) {
			$.ajax({
	            url:"https://young-reef-76169.herokuapp.com/http://service.kosha.or.kr/api/deliveryworker/edcVidoRecomend?legaldongCode="+ id +"&crtfcky=YEJ6U5M390E8DVP0V9OXRDXLD9GSJUE5",
				//url:"http://service.kosha.or.kr/api/deliveryworker/edcVidoRecomend?legaldongCode="+ id +"&crtfcky=YEJ6U5M390E8DVP0V9OXRDXLD9GSJUE5",
	            type:"GET",
	            contentType: "application/json; charset=utf-8",
	            success: function (xml) {
	                smutil.loadingOff();
	                
	                $('.video').removeClass('dsn');
	                
	                var video = document.getElementById('video');
	    			var videoSrc = $(xml).find('vidoUrl').text();
	    			//
	    			// 우선 HLS를 지원하는지 체크
	    			//
	    			if (video.canPlayType('application/vnd.apple.mpegurl')) {
	    			  video.src = videoSrc;
	    			//
	    			// HLS를 지원하지 않는다면 hls.js를 지원
	    			//
	    			} else if (Hls.isSupported()) {
	    			  var hls = new Hls();
	    			  hls.loadSource(videoSrc);
	    			  hls.attachMedia(video);
	    			}
	    			
	    			$('#video').focus();
					page.videoViewHst();
				
	            },
	            error : function(data) {
	            	LEMP.Window.alert({
						"_vMessage": JSON.stringify(data),
					});
	            }
	        });
			
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
		//재해예방 영상 시청 이력 
		videoViewHst : function(){
			page.apiParamInit(); //파라메터 전역변수 초기화
			page.apiParam.param.baseUrl="/smapis/videoViewHst";
			page.apiParam.param.callback = "page.videoViewHstCallback";
			smutil.callApi(page.apiParam);
			
		},
		
		//재해예방 영상 시청 이력 콜백
		videoViewHstCallback : function(res){
		},		
		
		callbackBackButton : function() {
			var videoPlay_yn = LEMP.Properties.get({
				"_sKey" : "videoPlay_yn",
			});
			
			var ended = $('#video').prop("ended");
			if($("#view1Tbody tr").length != 1){
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
			}
			LEMP.Window.close();
		}
};