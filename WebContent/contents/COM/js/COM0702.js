var page = {

	init : function(arg) {
		page.com0702 = arg.data.param
		page.initEvent();
	},
	com0702 : {},
	
	
	initEvent : function() {
		var Directory = "{external}/LEMP/";
		
		// 닫기
		$(document).on("click", ".btn.closeW.paR", function() {
			var popUrl = smutil.getMenuProp("COM.COM0701","url");
			LEMP.Window.close({
				"_sPagePath":popUrl,
				"_oMessage":{
					"param":page.com0702
				}
			});
		});
		// 카메라 버튼 클릭
		$(".btn.camera").click(function() {
			var date = new Date();
			var curTime = date.LPToFormatDate("yyyymmddHHnnss");
			var FileName = page.com0702.inv_no + "_cldl_"+curTime+".jpg";
			smutil.callCamera(Directory, FileName, page.imageCallback);
		});

		// 갤러리 버튼 클릭
		$(".btn.img").click(function() {
			var date = new Date();
			var curTime = date.LPToFormatDate("yyyymmddHHnnss");
			var FileName = page.com0702.inv_no + "_cldl_"+curTime+".jpg";
			smutil.callGallery(Directory+FileName, page.imageCallback);
		});

		// 확인 버튼 클릭
		$(".btn.red.w100p.m").click(function() {
			LEMP.Window.close({
				"_oMessage":{
					"param":page.com0702
				},
				"_sCallback":"page.COM0702Callback"
			});
		});

	}
	
	
	,imageCallback:function(res){
		
		if (res.result) {
			page.com0702.images = res.list[0].target_path;
			$(".imgBox img").attr("src",res.list[0].target_path);
		}else {
			LEMP.Window.alert({
				"_sTitle" : "알림",
				"_vMessage" : "이미지를 가져올 수 없습니다."
			});
		}
		
	}
};
