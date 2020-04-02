var page = {
		
	init:function()
	{
		page.initInterface();
	},
	
	initInterface : function()
	{
		
		// 프린터 표시 로직 시작 ########################################################
		/**
		 *print_android : android 만 사용가능한 프린터 속성
		 *print_ios : ios 만 사용가능한 프린터 속성
		 *print_all : ios 와 안드로이드 전부다 사용가능한 프린터 속성
		 *smapp : device 에서 web 으로 호출한 경우
		**/
		var deviceInfo = smutil.deviceInfo;
		if(deviceInfo === "smios"){			// ios 용 프린터만 표시
			$(".print_android").hide();
			$(".print_ios").show();
		}
		else if(deviceInfo === "smandroid"){		// 안드로이드용 프린터만 표시
			$(".print_android").show();
			$(".print_ios").hide();
		}
		else {	// web 인경우 모든 프린터를 항상 보여줌
			$(".print_android").show();
			$(".print_ios").show();
		}
		
		$(".print_all").show();		// 모두 사용할수있는 프린터는 항상 표시
		// 프린터 표시 로직 종료 ########################################################
		
		
		$(".radioSelect").click(function(){
			//$(this).prop('checked',true);
			var obj = {type:"connect",deviceType:$(this).val()}
		
			page.nativeCommute(obj);
		});
		
		// 페이지 닫기버튼 이벤트 등록
		$(document).on("click",".btn.closeW.paR",function(){
			LEMP.Window.close({
				"_oMessage" : {
					"param" : ""
				}
			});
		});
		
	}
	,nativeCommute: function(data){
		smutil.loadingOn();
		
		
		var tr = {
			id:"PRINTERCONNECT",
			param:{
				"type":data.type,
				"deviceType":data.deviceType,
				"callback":"page.setPrintStatus"
			}
		};
		
		// native 기능 호출
		smutil.nativeMothodCall(tr);
	}, 
	
	setPrintStatus : function(res){
		
		
		smutil.loadingOff();
		LEMP.Window.close({
			"_sCallback" : "page.printConnectCallback" , 
			"_oMessage" : res
		});
	}
	
	
};

