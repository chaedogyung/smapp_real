var page = {
		
	init:function(arg)
	{
		if(smutil.isEmpty(arg.data.param)){
			arg.data.param = {};
		}
		page.com0602 = arg.data.param;
		page.initInterface();
	}
	,com0602:{}
	,initInterface : function()
	{
		$(".btn.red.w100p.m").click(function(){
			if ($.trim($("#selectedText").val())!=="") {
				page.com0602.value=$("#selectedText").val();
				LEMP.Window.close({
					"_sCallback":"page.COM0602Callback",
					"_oMessage" : {
						"param":page.com0602
					}
				});
			}else {
				LEMP.Window.alert({
					"_sTitle":"직접입력",
					"_vMessage":"텍스트를 입력해주세요."
				})
			}
		});
		$(".btn.closeW.paR").click(function(){
			var popUrl = smutil.getMenuProp("COM.COM0701","url");
			LEMP.Window.close({
				"_sPagePath":popUrl,
				"_oMessage":{
					"param":page.com0602
				}
			});
		});
	}
	
};

