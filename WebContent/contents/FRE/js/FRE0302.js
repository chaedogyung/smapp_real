var page = {
	info : {},
	apiParam : {
		id : "HTTP", // 디바이스 콜 id
		param : { // 디바이스가 알아야할 데이터
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
		}
	// api 통신용 파라메터
	},
	init : function(data) {
//		if (!smutil.isEmpty(data.data.menuId)) {
//			$("#FRE0401").css("display","block");
//		}
		page.info = data.data;
		page.initInterface();
		page.searchData();
	},
	initInterface : function() {

		$(document).on('click',"#freHandle > li > button",function(){
			
			var tel = $(this).prev().find('.telN').text();
			//전화번호 형식이 올바른지 검증
			var regCellPhone = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/;
			var regPhone = /^\d{2,3}-\d{3,4}-\d{4}$/;
			
			if(regCellPhone.test(tel)||regPhone.test(tel)){
				$("#phoneNumber").text(tel);
				$('.mpopBox.phone').bPopup();
			}else {
				LEMP.Window.alert({
					"_sTitle" : "알림",
					"_vMessage" : "전화번호 형식이 올바르지 않습니다."
				});
			};
		});
	
		// 통화 팝업 > 통화버튼 클릭
		$(document).on("click","#phoneCall",function(){
			LEMP.System.callTEL({
				"_sNumber" : $("#phoneNumber").text().replace(/\-/g,'')
			});
			
			$('.mpopBox.phone').bPopup().close();
		});
		
		
		// 화물사고판정 이벤트
//		$("#opinion_regist").click(function(){
//			
//		});
//		
//		$("#judge_confirm").click(function(){
//			
//		});

		$(document).on("click",".btn.closeW.paR",function(){
			LEMP.Window.close();
		});
		
		//도착지 변경 click
		$('#freInfo').click(function() {
			if(smutil.isEmpty(page.info.inv_no)){
				LEMP.Window.alert({
					"_vMessage" : "운송장 번호를 입력해주세요"
				});
				return false;
			}else if($('.tRed.fs11').text() == "운송장번호가 유효하지 않습니다."){
				LEMP.Window.alert({
					"_vMessage" : "운송장 번호가 유효하지 않습니다."
				});
				return false;
			}
			else{
				var popUrl = smutil.getMenuProp('FRE.FRE0303', 'url');
				LEMP.Window.open({
					"_sPagePath" : popUrl,
					"_oMessage" : {
						"inv_no" : page.info.inv_no,
						"param" : page.pInfo,
						//"menuId":$("#inv_noNumber").data("menuId")
					}
				});
			}
		});
	},
	//추적정보 조회
	searchData : function(){
		smutil.loadingOn();
		var _this = this;

		_this.apiParam.param.baseUrl = "smapis/pacl/trcStat";			// api no
		_this.apiParam.param.callback = "page.freCallback";			// callback methode
		_this.apiParam.data.parameters.inv_no = page.info.inv_no.replace(/\-/g,'');
		
		smutil.callApi(_this.apiParam);
		
	},
	//추적정보 조회 콜백
	freCallback : function(res){

		try{
			//데이터가 있을시
			var keys = Object.keys(page.info.param);
			for (var i = 0; i < keys.length; i++) {
				if (!smutil.isEmpty(page.info.param[keys[i]])) {
					$("#"+keys[i]).text(page.info.param[keys[i]]);
				}
			}
			$("#inv_no").text(page.info.inv_no);
			
			if (smutil.apiResValidChk(res) && res.code === "0000" && res.data_count != 0) {
				var ymd;
				var tme;	
				var sAddress = page.info.param.snper_badr;
				var aAddress = page.info.param.acper_badr;
				
				if(!smutil.isEmpty(aAddress)){
					$('#acper_badr').text(aAddress);
				}
				if(!smutil.isEmpty(sAddress)){
					$('#snper_badr').text(sAddress);
				}
				
				var data_r = res.data.list;
				//스캔 시간을 형식에 맞게 변환
				_.forEach(res.data.list,function(val){
					ymd = val.scan_datetime.substring(0,4)+"/"+val.scan_datetime.substring(4,6)+"/"+val.scan_datetime.substring(6,8);
					tme = val.scan_datetime.substring(8,10)+":"+val.scan_datetime.substring(10,12)+":"+val.scan_datetime.substring(12,val.scan_datetime.length);
					val.scan_datetime = ymd;
					val.tmev = tme;
				});
				
				var source = $("#FRE0302_template").html();
				var template = Handlebars.compile(source);
				var itemList = template(res.data);
				
				$('#freHandle').html(itemList);
			}else{
				var	html = '<li><div class="NoBox"><p class="txt tc">조회된 결과가 없습니다</p></div></li>';
				$('#freNon').html(html);
			}
		}catch(e){}
		finally{
			smutil.loadingOff();
		}
	},
	
//	directInputCallback: function(res){
//		console.log(res);
//	}
}
