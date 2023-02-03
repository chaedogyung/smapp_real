LEMP.addEvent("backbutton", "page.callbackBackButton");
var page = {
	isYoutubeLinkContains : false, // 공지사항에 유튜브 링크 있을때는 영상 클릭해야만 확인버튼 클릭가능
	init:function(data){
		var data_r = data.data.param;
		
		if(!smutil.isEmpty(data_r)){
			data_r.keyNo = data_r.sta_ymd + data_r.seq_no;
			page.initInterface(data_r);
		}
		else{
			LEMP.Window.alert({
				"_sTitle":"공지사항 오류",
				"_vMessage":"조회할 공지사항 정보가 없습니다."
			});
			
			LEMP.Window.close();
		}
		
	},
	initInterface : function(data_r)
	{

		//날짜 형식 변경
		data_r.sta_ymd = data_r.sta_ymd.substring(0,4)+"."
						+data_r.sta_ymd.substring(4,6)+"."
						+data_r.sta_ymd.substring(6,8);
		
		//<br>태그 추가
		data_r.dtl_desc = data_r.dtl_desc.split("\n").join("<br>");

		var data_l = {
			"notice" :[data_r]
		}
		
		
		Handlebars.registerHelper('content', function(options){
			var html = '<div class="content">'+this.dtl_desc+ '</div>';
			page.isYoutubeLinkContains = html.indexOf("externalLink") !== -1;
			return new Handlebars.SafeString(html); 
		});
		
		//이미지 태그 추가
		Handlebars.registerHelper('img_path', function(options){
			const parser = new DOMParser();
			var dom = parser.parseFromString(this.dtl_desc, "text/html");
			var imageLink = dom.getElementById("imageLink");

			if (!smutil.isEmpty(this.img_path)) {
				var html;
				if (imageLink != null && !smutil.isEmpty(imageLink.innerHTML)) {
					html = '<a href="" onClick=\'LEMP.System.callBrowser({"_sURL": "'+imageLink.innerHTML+'"}); return false;\'><img src="'+this.img_path+'"></a>';
				} else {
					html = '<img src="'+this.img_path+ '">';
				}
				return new Handlebars.SafeString(html);
			}
		});
		
		var source = $("#MAN0201_list_template").html();
		var template = Handlebars.compile(source);
		$("#contentSection_1").html(template(data_l));
		
	
		/*
		//MAN0001 에서 넘어온 데이터 저장하는 PROPERTIES
		var noticeList_pop = LEMP.Properties.get({
			   "_sKey" : "notice_pop"
		});
		
		if(smutil.isEmpty(noticeList_pop)){
			noticeList_pop= [];
		}
		noticeList_pop.push(data_r);
		
		LEMP.Properties.set({
			   "_sKey" : "notice_pop",
			   "_vValue" : noticeList_pop
		});
		
		
		var noticeList_pop2 = LEMP.Properties.get({
			   "_sKey" : "notice_pop"
		});
		
		console.log("noticeList_pop : ",noticeList_pop2);
		*/
		
		//확인 버튼 click
		$('#checkOkay').click(function(){
			LEMP.Window.close();			
//			var noticeList = LEMP.Properties.get({
//				"_sKey" : "notice"
//			});
			
//			if(smutil.isEmpty(noticeList)){
//				noticeList = [];
//			}
//			
//			var chkBoolean = false;
//			
//			$.each(noticeList ,function(i,o){
//				if(o._sKey === data_r.sta_ymd+data_r.seq_no){
//					chkBoolean = true;
//					return false;
//				}
//			});
//			
//			// chkBoolean false 면 신규 공지사항이니 확인데이터를 추가해준다
//			if(!chkBoolean){
//				noticeList.push({"_sKey" : data_r.keyNo, "_vValue" : 'Y'});
//			}
//			
//			
//			// properties 에 다시 저장
//			LEMP.Properties.set({
//				"_sKey" : "notice",
//				"_vValue" : noticeList
//			});
//
//
//			const isVideoLinkClicked = LEMP.Properties.get({
//				"_sKey" : "videoLinkClicked"
//			});
//
//			if (page.isYoutubeLinkContains && isVideoLinkClicked === false) {
//				LEMP.Window.toast({
//					'_sMessage' : '영상을 확인해주세요.',
//					'_sDuration' : 'short'
//				});
//			} else {
//				LEMP.Properties.set({
//					"_sKey" : "videoLinkClicked",
//					"_vValue" : false
//				});
//				LEMP.Window.close();
//			}
		});

		const tag = document.createElement('script');
		tag.src = "https://www.youtube.com/iframe_api";
		const firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	},
	externalLinkClicked : function(url) {
		LEMP.Properties.set({
			"_sKey" : "videoLinkClicked",
			"_vValue" : true
		});
		LEMP.System.callBrowser({"_sURL": url});
	},
	callbackBackButton : function(){
		LEMP.Window.alert({
			'_sTitle' : "공지사항 확인",
			'_vMessage' : "공지사항을 확인해주세요"
		});
	}
}

function onYouTubeIframeAPIReady() {
	new YT.Player('youtube_player', {
		events: {
			'onStateChange': onPlayerStateChange
		}
	});
}

function onPlayerStateChange(event) {
	if (event.data === YT.PlayerState.PLAYING) {
		LEMP.Properties.set({
			"_sKey" : "videoLinkClicked",
			"_vValue" : true
		});
	}
}
