var page = {
		
	init:function(arg)
	{
	
		page.com0801=arg.data.param;
		var text;
		if (page.com0801.menu_id ==="CLDL0301") {
			text = "도선료 조회";
			$("#addr_input").attr("placeholder","법정동명을 입력해주세요");
		}else {
			text = "주소검색";
			$("#addr_input").attr("placeholder","상세주소까지 입력해주세요");
		}
		document.getElementById("pageNm").innerText = text;
//		$("#pageNm").text(text);
		
		page.initInterface();
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
	,com0801:{}
	,initInterface : function()
	{
		// 닫기 버튼
		$(".btn.closeW.paR").click(function(){
			LEMP.Window.close();
		});
		
		
		// 시도 selectbox 변경 이벤트
		$(document).on("change","#com0801SidoSel",function(){
			if (!isNaN( Number( $(this).val() ) ) ) {
				var data = {
					"city_do":$("#com0801SidoSel option:selected").text()
				};
				page.gungu(data);
			};
		});
		
		
		// 검색버튼 클릭
		$("#addrSearch,#ldno_addr,#rdnm_addr").click(function(){
			// 주소 버튼 클릭시 li 클래스명 on으로 변경 이벤트
			if ($(this).parents("div").attr("class")=="addTab") {
				$(this).parents(".addTab").find(".on").attr("class","");
				$(this).parent().attr("class","on");
				
				//검색할 주소버튼에 따라 input값의 문구내용을 바꿈
				if ($(this).attr("id")==="rdnm_addr") {
					$("#addr_input").attr("placeholder","건물번호까지 입력해주세요");
				}else {
					$("#addr_input").attr("placeholder","법정동명을 입력해주세요");
				}
			}
			
			if (page.com0801.menu_id==="CLDL0301" && !$(".addList").hasClass("tp2")) {
				$(".addList").addClass("tp2");
			}
			
			var check_sido = $("#com0801SidoSel option:selected");
			var check_gungu = $("#com0801GunguSel option:selected");
			var addr = $("#addr_input").val();
			
			if (check_sido.val()==="default") {
				LEMP.Window.alert({
					"_sTitle" : "알림",
					"_vMessage" : "시,도를 선택 해주세요."
				});
			}else if (check_gungu.val()==="default") {
				LEMP.Window.alert({
					"_sTitle" : "알림",
					"_vMessage" : "군,구를 선택 해주세요."
				});
			}else if (smutil.isEmpty(addr)) {
				LEMP.Window.alert({
					"_sTitle" : "알림",
					"_vMessage" : "상세주소가 입력되지 않았습니다.\n법정동 단위로 입력 해주세요."
				});
			}else {
				
				page.com0801.city_do = check_sido.text();
				page.com0801.city_gun_gu = check_gungu.text();
				page.com0801.adr = addr;

				// 집하완료에서 넘어왔을 경우
				if (page.com0801.menu_id==="CLDL0301") {
					page.com0801.adr_sct_cd = $(".addTab").find(".on button").val();
					page.addrPltg();
				}else { // 주소검색
					page.addrSearch();
				}
			}
			
			
		});		
		
		/* 주소 확인 팝업 */
		$(document).on('click', '#jusoSelect', function(e){
			var mpopBoxJusoTxt = $(".selectJuso").text();
			
			// 확인 팝업 호출
			$('.mpopBoxJuso').text(mpopBoxJusoTxt);
			$('.mpopBox.img.map').bPopup();
			
		});
		
		/* 주소 확인 팝업 > 예 */
		$(document).on('click', '#jusoPopYes', function(e){
			
			if( $(".addTab").find(".on button").val() === "00" ){
				var adrSctCd = "J"; // 지번 기본주소
			}else{
				var adrSctCd = "R"; // 도로명 기본주소
			}
			
			LEMP.Window.close({
				"_oMessage" : {
					"param" : {
						"type" : page.com0801.type,		// 타입
						"adrSctCd" : adrSctCd,			// 주소유형
						"badr" : $("#badr").val(),		// 지번기본주소
						"dadr" : $("#dadr").val(),		// 지번상세주소
						"zipcd" : $("#zipcd").val(),	// 구우편번호
						"basAreaCd" : $("#basAreaCd").val(),	// 신우편번호
						"rdnmBadr" : $("#rdnmBadr").val(),		// 도로명기본주소
						"rdnmDadr" : $("#rdnmDadr").val(),		// 도로명상세주소
						"bldNm" : $("#bldNm").val(),			// 도로명 빌딩 명칭
						"bldMgrNo" : $("#bldMgrNo").val(),		// 건물관리번호
						"cldlEmpno" : $("#cldlEmpno").val(),	// 건물관리번호
						"dlvBrshCd" : $("#dlvBrshCd").val(),	// 배달점코드(B2B용)
						"dlvBrshNm" : $("#dlvBrshNm").val(),	// 배달점명(B2B용)
						"rsphCd" : $("#rsphCd").val()			// 권역코드(B2B용)
					}
				},
				"_sCallback" : "page.com0801Callback"
			});
		});
		
		// ###################################### handlebars helper 등록 start
		
		Handlebars.registerHelper('badrTmpl', function(options) {
			if( $(".addTab").find(".on button").val() === "00" ){
				return this.badr; // 지번 기본주소
			}else{
				return this.rdnmBadr; // 도로명 기본주소
			}
		});
		
		Handlebars.registerHelper('dabrTmpl', function(options) {
			if( $(".addTab").find(".on button").val() === "00" ){
				return this.dadr; // 지번 상세주소
			}else{
				return this.rdnmDadr; // 도로명 상세주소
			}
		});
		
		// ###################################### handlebars helper 등록 end
		
//		// 주소리스트 초기화
//		$(".addTab>ul>li").click(function(){
//			$(".addList > ul").empty();
//		});
		
		
		// 시도 조회
		page.sido();
	}
	,sido:function(){

		smutil.loadingOn();		// 로딩바 열기
		
		page.apiParam.param.baseUrl="smapis/cmn/sido";
		page.apiParam.param.callback="page.sidoCallback";
		
		// 공통 api호출 함수 
		smutil.callApi(page.apiParam);
	}
	,sidoCallback:function(data){
		try{
			
			var res = data.data;
			if (smutil.apiResValidChk(data)&& data.code=="0000") {
				
				//handlebars template 시작
				var template = Handlebars.compile($("#com0801_sido_template").html());
				$("#com0801SidoSel").html(template(res));
				
			}else {
				LEMP.Window.alert({
					"_sTitle" : "알림",
					"_vMessage" : "통신에 실패했습니다.\n문제가 지속되면 담당자에게 연락하세요."
				});
			}
		}
		catch(e){}
		finally{
			smutil.loadingOff();			// 로딩바 닫기
		}
	}
	,gungu:function(data){
		
		smutil.loadingOn();		// 로딩바 열기
		
		page.apiParam.param.baseUrl="smapis/cmn/gungu";
		page.apiParam.param.callback="page.gunguCallback";
		page.apiParam.data.parameters=data;
		
		// 공통 api호출 함수 
		smutil.callApi(page.apiParam);
	}
	,gunguCallback:function(data){
		try{
			
			var res = data.data;
			if (smutil.apiResValidChk(data)&& data.code=="0000") {
				//handlebars template 시작
				var template = Handlebars.compile($("#com0801_gungu_template").html());
				$("#com0801GunguSel").html(template(res));
			}else {
				LEMP.Window.alert({
					"_sTitle" : "알림",
					"_vMessage" : "통신에 실패했습니다.\n문제가 지속되면 담당자에게 연락하세요."
				});
//				
			}
		}
		catch(e){}
		finally{
			smutil.loadingOff();			// 로딩바 닫기
		}
		
	}
	,cldl0301Search:function(){
		
	}
	,addrPltg:function(){
		
		smutil.loadingOn();		// 로딩바 열기
		
		page.apiParam.param.baseUrl="smapis/cmn/addrPltg";
		page.apiParam.param.callback="page.addrPltgCallback";
		page.apiParam.data.parameters=page.com0801;
		
		// 공통 api호출 함수 
		smutil.callApi(page.apiParam);
	}
	,addrPltgCallback:function(data){
		try{
			
			var res = data.data;
			
			if (smutil.apiResValidChk(data) && data.code=="0000") {
				var template = Handlebars.compile($("#com0801_list_template").html());
				$("#com0801Ul").html(template(res));
				
			}
		}
		catch(e){}
		finally{
			smutil.loadingOff();			// 로딩바 닫기
		}
	},
	
	// ################### 주소검색 조회 start 
	addrSearch : function(){
		var _this = this;
		
		_this.apiParam.param.baseUrl = "/smapis/cmn/addr";				// api no
		_this.apiParam.param.callback = "page.addrCallback";			// callback methode
		_this.apiParam.data.parameters = page.com0801;					// api 통신용 파라메터
		
		// 공통 api호출 함수 
		smutil.callApi(_this.apiParam);
	},
	
	addrCallback : function(result){
		
		try{
			
			// api 결과 성공여부 검사
			if(smutil.apiResValidChk(result) && result.code == "0000"){

				if(result.data_count > 0){
					var data = result.data; //data = [];
					if(data.bldMgrNo != ""){
						// 핸들바 템플릿 가져오기
						var source = $("#addr_list_template").html();					
						// 핸들바 템플릿 컴파일
						var template = Handlebars.compile(source); 
						// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
						var html = template(data);
						// 생성된 HTML을 DOM에 주입
						$("#com0801Ul").html(html);
					}else {
						// 핸들바 템플릿 가져오기
						var source = $("#no_list_template").html();					
						// 핸들바 템플릿 컴파일
						var template = Handlebars.compile(source); 
						// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
						var html = template(data);
						// 생성된 HTML을 DOM에 주입
						$("#com0801Ul").html(html);
					}
				}
				
			}
			
		}
		catch(e){}
		finally{
			smutil.loadingOff();			// 로딩바 닫기
		}

	},
	// ################### 주소검색 조회 end
	
};

