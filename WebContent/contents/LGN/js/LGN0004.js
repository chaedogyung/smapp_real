LEMP.addEvent("backbutton", "page.callbackBackButton");

var page = {
	
	init:function()
	{
		page.initEvent();					// 이벤트 등록
	},
	
	
	initEvent : function(){
		// 확인버튼 클릭
		$(".btn.red.w100p.m").on('click, touchstart',function(){
			// 설치권한 동의정보 프로퍼티에 셋팅
			LEMP.Properties.set({
				"_sKey" : "installAuthConfirmYn",
				"_vValue" : "Y"
			});
			
			LEMP.Window.close({});
		});
	},
	
	
	
	// 물리적 뒤로가기 버튼 클릭시 종료여부 설정
	callbackBackButton : function() {
		var btnCancel = LEMP.Window.createElement({
			_sElementName : "TextButton"
		});
		btnCancel.setProperty({
			_sText : "취소",
			_fCallback : function() {
			}
		});

		var btnConfirm = LEMP.Window.createElement({
			_sElementName : "TextButton"
		});
		btnConfirm.setProperty({
			_sText : "확인",
			_fCallback : function() {
				LEMP.App.exit({
					_sType : "kill"
				});
			}
		});

		LEMP.Window.confirm({
			_vMessage : "앱을 종료하시겠습니까?",
			_aTextButton : [ btnCancel, btnConfirm ]
		});
	}
	
	
};