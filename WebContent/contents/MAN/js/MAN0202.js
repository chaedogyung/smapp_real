LEMP.addEvent("backbutton", "page.callbackBackButton");
var page = {
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
		
		var data_l = {
				"notice" :[data_r]
			}
			
			var source = $("#MAN0202_list_template").html();
			var template = Handlebars.compile(source);
			$("#contentSection").append(template(data_l));
			
			
			$('#Man02Check').click(function(){
				
				var noticeList = LEMP.Properties.get({
					"_sKey" : "notice"
				});
				
				if(smutil.isEmpty(noticeList)){
					noticeList = [];
				}
				//console.log("noticeList_pop" ,noticeList_popC);
				
				var chkBoolean = false;
				
				$.each(noticeList ,function(i,o){
					if(o._sKey === data_r.sta_ymd+data_r.seq_no){
						chkBoolean = true;
						return false;
					}
				});
				
				// chkBoolean false 면 신규 공지사항이니 확인데이터를 추가해준다
				if(!chkBoolean){
					noticeList.push({"_sKey" : data_r.keyNo, "_vValue" : 'Y'});
				}
				
				
				// properties 에 다시 저장
				LEMP.Properties.set({
					"_sKey" : "notice",
					"_vValue" : noticeList
				});
				
			
				var noticeList2 = LEMP.Properties.get({
					"_sKey" : "notice"
				});
				
				LEMP.Window.close({});
			});
	},
	callbackBackButton : function(){
		LEMP.Window.alert({
			'_sTitle' : "backButton",
			'_vMessage' : "공지사항을 확인해주세요"
		});
	}
}