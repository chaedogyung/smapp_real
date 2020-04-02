var page = {		
		
		init:function(arg)
		{			
			page.initEvent();
		},
		
		initEvent : function()
		{	
			// 닫기
			$(".btn.closeW.paR").on('click',function(){
				LEMP.Window.close()
			});
			
			// 닫기
			$("#btnClose").on('click',function(){
				LEMP.Window.close()
			});
			
			// 확인
			$("#btnConfirm").on('click',function(){
				var directInput = $('#directInput').val();

				LEMP.Window.close({
					"_sCallback" : "page.directInputCallback",
				 	"_oMessage": {
							"directInput" : directInput
						}
				})
			})
		}
		
};

