var page = {
		
	init:function(arg)
	{
		var obj={"inv_no":String(arg.data.param.inv_no)}
		page.initInterface(obj);
	}
	
	,apiParam : {
		id:"HTTP",			// 디바이스 콜 id
		param:{				// 디바이스가 알아야할 데이터
			task_id : "",										// 화면 ID 코드가 들어가기로함
			//position : {},									// 사용여부 미확정 
			type : "",
			baseUrl : "",
			method : "POST",									// api 호출 형식(지정 안하면 'POST' 로 자동 셋팅)
			callback : "",					// api 호출후 callback function
			contentType : "application/json; charset=utf-8"
		},
		data:{				// api 통신용 파라메터
			"parameters" : {}
		}
	}
	
	// 이벤트 등록 함수
	,initInterface :function(data)
	{
		// 닫기
		$(document).on("click",".btn.closeW.paR",function(){
			LEMP.Window.close();
		});
		
		
		// 지도버튼 클릭
		$(document).on("click",".btn.map",function(){
			// 개발미완료
			var popUrl = smutil.getMenuProp('COM.COM0202', 'url');
			LEMP.Window.open({
				"_sPagePath":popUrl,
				"_oMessage":{
					"param":{
						"cldl_sct_cd":"D",
						"inv_no":data.inv_no,
						"shcn_sct_cd":$(this).closest(".infoBox").attr("id")
					}
				}
			});
		});
		
		
		// 전화버튼 클릭
		$(document).on("click",".btn.mobile",function(){
			$("#phoneNum").text($(this).prev().text());
			$('.mpopBox.phone').bPopup();
		});
		
		
		//통화 
		$(document).on("click","#callOk",function(){
			LEMP.System.callTEL({
				"_sNumber":$("#phoneNum").text().replace(/\-/g,'')
			});
			$('.mpopBox.phone').bPopup().close();
		});
		
		
		//서명 버튼 클릭
		$(document).on("click","#signArea",function(){
			var popUrl = smutil.getMenuProp('CLDL.CLDL0405', 'url');
			LEMP.Window.open({
				"_sPagePath":popUrl,
				"_oMessage":{
					"param":{
						"sign_img_path":$(this).attr("src")
					}
				}
			});
		});
		
		
		//이미지 버튼 클릭
		$(document).on("click","#imgArea",function(){
			var popUrl = smutil.getMenuProp('CLDL.CLDL0406', 'url');
			LEMP.Window.open({
				"_sPagePath":popUrl,
				"_oMessage":{
					"param":{
						"dlvcp_img_path":$(this).attr("src")
					}
				}
			});
		});
		
		// 상세정보 api 호출
		page.dlvInvDtl(data);
	}
	
	
	// 상세화면 조회
	,dlvInvDtl: function(data){
		smutil.loadingOn();		// 로딩바 열기
		
		page.apiParam.param.baseUrl="smapis/cldl/dlvInvDtl";
		page.apiParam.param.callback="page.dlvInvDtlCallback";
		page.apiParam.data.parameters=data;
		
		// 공통 api호출 함수 
		smutil.callApi(page.apiParam);
	}
	
	
	// 상세화면 콜백
	,dlvInvDtlCallback : function(data){
		try{
			var res = data.data.list[0];
			if (smutil.apiResValidChk(data)&& data.code==="0000"&& data.data_count !== 0 ) {
				// 상세정보 null check
				if (res.snper_badr==null) {
					res.snper_badr=""
				}
				
				if (res.snper_dadr==null) {
					res.snper_dadr=""
				}
				
				if (res.snper_ldno_adr==null) {
					res.snper_ldno_adr=""
				}
				
				if (res.snper_rdnm_adr==null) {
					res.snper_rdnm_adr=""
				}
				
				if (res.snper_etc_adr==null) {
					res.snper_etc_adr=""
				}
				
				if (res.acper_badr==null) {
					res.acper_badr=""
				}
				if (res.acper_dadr==null) {
					res.acper_dadr=""
				}
				
				if (res.acper_ldno_adr==null) {
					res.acper_ldno_adr=""
				}
				
				if (res.acper_rdnm_adr==null) {
					res.acper_rdnm_adr=""
				}
				
				if (res.acper_etc_adr==null) {
					res.acper_etc_adr=""
				}
				
				res.inv_no = res.inv_no.substr(0,4)+"-"+res.inv_no.substr(4,4)+"-"+res.inv_no.substr(8,4);
				res.summ_fare=String(res.summ_fare).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				res.pick_ymd = res.pick_ymd.LPToFormatDate("yyyy년 mm월 dd일");
				res.snper_addr=res.snper_badr + " " + res.snper_dadr + " " + res.snper_etc_adr;
				res.snper_ldno_addr = res.snper_ldno_adr + " " + res.snper_etc_adr;
				res.snper_rdnm_addr = res.snper_rdnm_adr + " " + res.snper_etc_adr;
				res.acper_addr = res.acper_badr + " " + res.acper_dadr + " " + res.acper_etc_adr;
				res.acper_ldno_addr = res.acper_ldno_adr + " " + res.acper_etc_adr;
				res.acper_rdnm_addr = res.acper_rdnm_adr + " " + res.acper_etc_adr;
				
				switch (res.fare_sct_cd) {
				case "01":
					res.fare_sct_nm = "현불";
					break;
				case "02":
					res.fare_sct_nm = "착불";
					break;
				case "07":		// 착불결제완료
					res.fare_sct_nm = "착불결제완료";
					break;
				default:
					res.fare_sct_nm = "신용";
					break;
				}
				
				// 의류특화가 아니며, 신선여부 값이 'Y'면 출력
				Handlebars.registerHelper('fres', function(options){
					if (this.fres_yn === "Y" && this.svc_cd !== "01") {
						return options.fn(this);
					} 
				});
				
				// 의류 특화면 집하일 출력
				Handlebars.registerHelper('svc', function(options){
					if (this.svc_cd === "01") {
						return options.fn(this);
					} 
				});
				
				// 고객지정 위탁장소 출력
				Handlebars.registerHelper('acpr', function(options){
					if (this.req_acpr_nm != null) {
						return options.fn(this);
					} 
				});
				
				// 보내는사람 전화번호1이 공백일시 버튼 출력 X
				Handlebars.registerHelper('mobileST', function(options){
					if (this.snper_tel !== null) {
						return options.fn(this);
					}
				});
				
				// 보내는사람 전화번호2이 공백일시 버튼 출력 X
				Handlebars.registerHelper('mobileSC', function(options){
					if (this.snper_cpno !== null) {
						return options.fn(this);
					}
				});
				
				// 받는사람 전화번호1이 공백일시 버튼 출력 X
				Handlebars.registerHelper('mobileAT', function(options){
					if (this.acper_tel !== null) {
						return options.fn(this);
					}
				});
				
				// 받는사람 전화번호2이 공백일시 버튼 출력 X
				Handlebars.registerHelper('mobileAC', function(options){
					if (this.acper_cpno !== null) {
						return options.fn(this);
					}
				});
				
				//handlebars template 시작
				var template = Handlebars.compile($("#CLDL0404_list_template").html());
				$("#contents").append(template(res));
				
				$(".memo").html($(".memo").text());
				if (res.dlvcp_img_path===null) {
					$("#imgArea").css("display","none");
				}else {
					$("#imgArea").css("display","block");
				}
				
			}else {
				LEMP.Window.toast({
					"_sMessage":"상세정보 데이터가 없습니다.",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle" : "알림",
//					"_vMessage" : "상세정보 데이터가 없습니다."
//				});
				LEMP.Window.close();
			}
		}
		catch(e){}
		finally{
			smutil.loadingOff();			// 로딩바 닫기
		}
	}
};

