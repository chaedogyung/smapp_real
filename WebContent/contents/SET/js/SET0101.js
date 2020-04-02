//페이지(웹뷰)가 로드되기 전 실행할 콜백함수 설정
//LEMP.addEvent("beforeready", page.blutoothStatus);
var page = {
	init:function()
	{
		page.initInterface();
	},
	initInterface : function()
	{
		page.blutoothStatus();
		
		
		$("#swPrint").click(function(){
			$(".accordian").slideUp();
			if(!$(".accordian").is(":visible")){
				$(".accordian").slideDown();
			};
		});
		$(document).on("click","#PrinterDisconnect",function(){
			var obj = {
					"type":"disconnect",
					"deviceType":$(this).prev().text()
			};
			page.disconnect(obj);
		});
		$(document).on("click","#PrinterSettingChoice",function(){
			var popUrl = smutil.getMenuProp('SET.SET0105', 'url');
			LEMP.Window.open({
				"_sPagePath":popUrl
			});
		});
		$(document).on("click","#cut",function(){
			var obj ={ "type":"disConnect","deviceType":$(this).prev().text()};
			page.disconnect(obj);
			
		});
		$(document).on("click","#PrintTest",function(){
			if ($("#printModel").text()!="") {
				var obj = {
						"deviceType":$("#printModel").text(),
						"inv_no":"111122223333",
						"snper_nm":""
				};
				page.printCallback(obj);
			}else {
				LEMP.Window.alert({
					"_sTitle" : "프린터 테스트 출력",
					"_vMessage" : "출력할 프린터가 없습니다."
				});
			};
		});
		
		$(document).on("click","#ReceiverChange",function(){
			var popUrl = smutil.getMenuProp("SET.SET0301","url");
			
			LEMP.Window.open({
				"_sPagePath":popUrl
			})
		});
		//스캐너 페어링 
		$(document).on("click","#scannerSet",function(){
			
			var value = $(this).text()=="연결 해제" ? "disConnect" : "connect";
		
			var tr = {
					id:"SCANNER",
					param:{
						"type": value,
						"callback":"page.setScannerStatus"
					}
				};
			
			// native 기능 호출
			smutil.nativeMothodCall(tr);
		});
	
	},
	setScannerStatus : function(res){
		if(res.status ==="true"){
			$('#scannerSet').text("연결 해제");
		}else{
			$('#scannerSet').text("설정");
		}
	
	},
	//페이지(웹뷰)가 로드되기 전 실행할 함수 
	blutoothStatus : function(){
		var device = ["scanner","printer"];
		_.forEach(device,function(value,index){
			var tr = {
					id:"BLUETOOTHSTATUS",
					param:{
						"type": value,
						"callback":"page.bluetoothStatusCallBack"
					}
				};
	
			// native 기능 호출
			smutil.nativeMothodCall(tr);
		});
		
	},
	bluetoothStatusCallBack : function(res){
		if(res.type =="scanner"){
			if(res.status ==="true"){
				$('#scannerSet').text("연결 해제");
			}else{
				$('#scannerSet').text("설정");
			}
		}else{
			if(res.status ==="true"){
				$("#printModel").text(res.deviceType);
				$("#PrinterSettingChoice").prop("id","PrinterDisconnect").text("연결 해제");
			}else {
				$("#printModel").text("");
				$("#PrinterDisconnect").prop("id","PrinterSettingChoice").text("선택");
			}
		}
	
	},
	//스캐너 콜백
	scanCallback : function(data){
		
	}
	,printCallback : function(data){
		var tr = {
				id:"PRINTER",
				param:{
					"deviceType":data.deviceType,
				},
				data:{
					"number":data.inv_no,
					"recipient":data.snper_nm
				}
			};
			
			if(smutil.isEmpty(data.deviceType)){
				LEMP.Window.alert({
					"_sTitle" : "프린터 출력설정",
					"_vMessage" : "기기명이 잘못 입력 되었습니다.."
				});
				return false;
			}else if (smutil.isEmpty(data.inv_no)||smutil.isEmpty(data.snper_nm)) {
				LEMP.Window.alert({
					"_sTitle" : "프린터 출력설정",
					"_vMessage" : "데이터를 설정 해주세요."
				});
				return false;
			};
			
			// native 기능 호출
			smutil.nativeMothodCall(tr);
	}
	,printConnectCallback : function(res) {
		
		
		if (res.status === "true") {
			$("#printModel").text(res.deviceType);
			$("#PrinterSettingChoice").prop("id","PrinterDisconnect").text("연결 해제");
		}	
		else {
			$("#printModel").text("");
			$("#PrinterDisconnect").prop("id","PrinterSettingChoice").text("선택");
			
			LEMP.Window.alert({
				"_sTitle" : "프린터 설정",
				"_vMessage" : "연결이 해제되었습니다."
			});
			return false;
		}
	}
	,disconnect : function(data){
		var tr = {
			id:"PRINTERCONNECT",
			param:{
				"type":data.type,
				"deviceType":data.deviceType,
				"callback":"setPrintStatus"
			}
		};
		
		if(smutil.isEmpty(data.type)
				|| smutil.isEmpty(data.deviceType)){
			LEMP.Window.alert({
				"_sTitle" : "프린터 연결설정",
				"_vMessage" : "기능을 호출할수 없습니다."
			});
			
			return false;
		}
		
		// native 기능 호출
		smutil.nativeMothodCall(tr);
	},
	
	setPrintStatus : function(data){
		page.printConnectCallback(data);
	}
};
