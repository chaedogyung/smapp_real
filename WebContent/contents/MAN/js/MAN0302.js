LEMP.addEvent("backbutton", "page.callbackBackButton");
var page = {
	apiParam : {
		id : "HTTP", // 디바이스 콜 id
		param : {// 디바이스가 알아야할 데이터
			task_id : "", // 화면 ID 코드가 들어가기로함
			// position : {}, // 사용여부 미확정
			type : "",
			baseUrl : "",
			method : "POST", // api 호출 형식(지정 안하면 'POST' 로 자동 셋팅)
			callback : "", // api 호출후 callback function
			contentType : "application/json; charset=utf-8"
		},
		data : {
			"parameters" : {}
		},// api 통신용 파라메터
	},
	contentType : "Notice",
	isYoutubeLinkContains : false, // 공지사항에 유튜브 링크 있을때는 영상 클릭해야만 확인버튼 클릭가능
	init:function(data){
		var data_r = data.data.param;
		page.initInterface(data_r);
	},
	initInterface : function(data_r)
	{
		Handlebars.registerHelper('snperName', function(options){
			if (!smutil.isEmpty(this.snper_nm)) {
				return options.fn(this);
			}
		});
		Handlebars.registerHelper('content', function(options){
			const html = '<div class="content">'+this.dtl_desc+ '</div>';
			page.isYoutubeLinkContains = html.indexOf("externalLink") !== -1;
			return new Handlebars.SafeString(html);
		});
		
		//이미지 태그 추가
		Handlebars.registerHelper('img_path', function(options){
			if (!smutil.isEmpty(this.img_path)) {
				var html = '<img src="'+this.img_path+ '">';
				return new Handlebars.SafeString(html);
			}
		});

		page.contentType = data_r.status;

		var data_l = {
			"notice" :[data_r]
		}
		if(data_r.status =="Notice"){
			$('#headline').text("공지사항상세");
			$('#contentSection_1').html("");
			var source = $("#MAN0302_Notice_template").html();
			var template = Handlebars.compile(source);
			$("#contentSection_1").html(template(data_l));
		}else{
			$('#headline').text("쪽지상세");
			$('#contentSection_1').html("");
			var source = $("#MAN0302_Memo_template").html();
			var template = Handlebars.compile(source);
			$("#contentSection_1").html(template(data_l));
		}
		//확인버튼 click
		$('#checkOkay').click(function(){
			if(data_r.status==="Notice") {
				const isVideoLinkClicked = LEMP.Properties.get({
					"_sKey" : "videoLinkClicked"
				});

				if (page.isYoutubeLinkContains && isVideoLinkClicked === false) {
					LEMP.Window.toast({
						'_sMessage' : '영상을 확인해주세요.',
						'_sDuration' : 'short'
					});
				} else {
					LEMP.Properties.set({
						"_sKey" : "videoLinkClicked",
						"_vValue" : false
					});
					LEMP.Window.close();
				}
			} else {
				if(smutil.isEmpty(data_r.read_sct)){
					page.readUpdate(data_r);
				}else{
					LEMP.Window.close();
				}
			}
		});


	},
	//쪽지일경우 읽음처리
	readUpdate : function(data_r){
		smutil.loadingOn();
//		var reg_ymd = data_r.reg_ymd.substring(0,4)
//					 +data_r.reg_ymd.substring(5,7)
//					 +data_r.reg_ymd.substring(8,10);

		page.apiParam.param.baseUrl="smapis/cmn/uptNoteRead";
		page.apiParam.param.callback="page.readUpdateCallback";
		page.apiParam.data.parameters={
				"reg_ymd": data_r.reg_ymd,
				"reg_tme": data_r.reg_tme
		};
		smutil.callApi(page.apiParam);
	},
	readUpdateCallback : function(res){
		try{
			if(smutil.apiResValidChk(res) && res.code === "0000"){
				LEMP.Window.close({
					"_oMessage" : {
						"param" : "readUpdate"
					},
					"_sCallback" : "page.readUpdateCallback"
				});
			}
		}catch(e){}
		finally{
			smutil.loadingOff();
		}
	},

	showWeb : function(url) {
		smutil.nativeMothodCall({
			id : 'SHOW_WEBSITE',
			param : {
				url: url
			}
		});
	},
	externalLinkClicked : function(url) {
		LEMP.Properties.set({
			"_sKey" : "videoLinkClicked",
			"_vValue" : true
		});
		LEMP.System.callBrowser({"_sURL": url});
	},
	callbackBackButton : function() {
		if(page.contentType === "Notice") {
			const isVideoLinkClicked = LEMP.Properties.get({
				"_sKey" : "videoLinkClicked"
			});

			if (page.isYoutubeLinkContains && isVideoLinkClicked === false) {
				LEMP.Window.toast({
					'_sMessage' : '영상을 확인해주세요.',
					'_sDuration' : 'short'
				});
			} else {
				LEMP.Properties.set({
					"_sKey" : "videoLinkClicked",
					"_vValue" : false
				});
				LEMP.Window.close();
			}
		} else {
			LEMP.Window.close();
		}
	},
}
