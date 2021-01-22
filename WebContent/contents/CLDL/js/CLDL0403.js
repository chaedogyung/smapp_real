var page = {
		
	init:function(res)
	{
		page.initInterface(res.data.param);
	},
	
	initInterface : function(data)
	{
		$("#CLDL0403_Confirm").click(function(){
			data.acpr_nm=$("#contentSection").find("input").val();
			LEMP.Window.close({
				"_oMessage" : data,
				"_sCallback" : "page.CLDL0403Callback"
			});
		});
		$(".btn.closeW.paR").click(function(){
			LEMP.Window.close({
				"_oMessage":data
			});
		});
	},

	maxLengthCheck : function(object){
		if(object.value.length > object.maxLength) {
			object.value = object.value.slice(0, object.maxLength);
		}
	}
};

