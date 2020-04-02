/* *
 * codeListPopup 전용 팝업
 * */
var page = {
		
		argTypeCd : null,					// 공통코드 구분 코드
		argReturnEtc : null,				// 기타값(callback return value)
		etc : null,							// 기타(99) popup callback
		
		// api 호출 기본 형식
		apiParam : {
			id:"HTTP",						// 디바이스 콜 id
			param:{							// 디바이스가 알아야할 데이터
				task_id : "",				// 화면 ID 코드가 들어가기로함
				//position : {},			// 사용여부 미확정 
				type : "",
				baseUrl : "",
				method : "POST",			// api 호출 형식(지정 안하면 'POST' 로 자동 셋팅)
				callback : "",				// api 호출후 callback function
				contentType : "application/json; charset=utf-8"
			},
			data:{"parameters" : {}}		// api 통신용 파라메터
		},
		
		init:function(arg)
		{
			page.argTypeCd = arg.data.param.typ_cd;					// 공통코드 구분 코드
			page.argReturnEtc = arg.data.param.rtn_etc;		// 기타 리턴값
			
			var title;
			switch(page.argTypeCd){
				case "LRG_ITEM_KND_CD":
					title = "상품분류";
					break;
				case "SMAPP_DLV_MSG_CD":
					title = "배송요청사항";
					break;
				case "SMAPP_RTG_RSN_CD":
					title = "반품사유";
					break;
				default:
					title = "";
					break;
			}
			
			$("#popTitle").text(title);
			
			page.initEvent();			// 페이지 이벤트 등록
			page.initDpEvent();			// 화면 디스플레이 이벤트
		},
		
		// 페이지 이벤트 등록
		initEvent : function()
		{
			var _this = this;
			
			/* 닫기(x) */
			$(".btn.closeW.paR").click(function(){
				LEMP.Window.close();
			});
			
			/* 기타 선택시 */
			$(document).on("click","#99",function(){
				var popUrl = smutil.getMenuProp("COM.COM0602","url");
				LEMP.Window.open({
					"_sPagePath":popUrl
				})
			});
			
			/* 확인 */
			$("#confirmBtn").click(function(){
				var dtl_cd = $("input[name=dtl]:checked").attr("id");
				var dtl_cd_nm = $("input[name=dtl]:checked").data("name");
				if(dtl_cd == "99"){
					dtl_cd_nm = page.etc;
				}
				
				// 라디오 버튼을 선택하지 않았을 경우
				if(!$("input[name='dtl']").is(":checked")){
					LEMP.Window.alert({
						"_sTitle" : "알림",
						"_vMessage" : "버튼을 선택해주세요."
					});
				// 기타를 선택했을 경우
				}else if(dtl_cd === "99" && smutil.isEmpty(dtl_cd_nm)) {
					LEMP.Window.alert({
						"_sTitle" : "알림",
						"_vMessage" : "사유가 입력되지 않았습니다."
					});
				}else{
					
					if(page.argTypeCd == "LRG_ITEM_KND_CD" && dtl_cd === "99"){		// 상품분류 기타값이면 상세코드 원복
						dtl_cd = "NZ";
					}
					
					LEMP.Window.close({
						"_oMessage" : {
							"typ_cd" : page.argTypeCd,								// 공통코드 구분 코드
							"rtn_etc" : smutil.nullToValue(page.argReturnEtc,""), 	// 기타리턴값
							"dtl_cd" : dtl_cd,										// 상세코드 (상품대분류코드)
							"dtl_cd_nm" : dtl_cd_nm,								// 상세코드명 (상품분류명)
						},
						"_sCallback" : "page.com0901Callback"
					});
				}
				
			});
			
			// ###################################### handlebars helper 등록 start
			// radiobox setting
			Handlebars.registerHelper('dtlTemp', function(options) {
				var html = "";
				var dtlCd = this.dtl_cd;
				
				if(page.argTypeCd == "LRG_ITEM_KND_CD" && this.dtl_cd == "NZ"){	// 상품분류의 기타값 99로 셋팅
					dtlCd = "99";
				}
				
				html = '<input type="radio" name="dtl" id="' + dtlCd + '" data-name="' + this.dtl_cd_nm + '"/><label for="' + dtlCd + '">' + this.dtl_cd_nm + '</label>';
				
				return new Handlebars.SafeString(html); // mark as already escaped
			});
			
			// ###################################### handlebars helper 등록 end
			
		},
		
		initDpEvent : function()
		{
			var _this = this;
			smutil.loadingOn();
			_this.codeListPopupSearch();
		},
		
		// ################### 리스트 조회 start
		codeListPopupSearch : function(){
			
			var _this = this;
			_this.apiParam.param.baseUrl = "smapis/cmn/codeListPopup";		// api no
			_this.apiParam.param.callback = "page.codeListPopupCallback";	// callback methode
			_this.apiParam.data = {											// api 통신용 파라메터
				"parameters" : {
					"typ_cd" : page.argTypeCd									// 공통코드 구분 코드
				}
			};
			
			// 공통 api호출 함수 
			smutil.callApi(_this.apiParam);
		},
		
		// 리스트 조회 callback
		codeListPopupCallback : function(result){
			var _this = this;
			
			try{
				
				if(smutil.apiResValidChk(result) && result.code == "0000"){
					
					var data = result.data; //data = [];
					
					// 핸들바 템플릿 가져오기
					var source = $("#com0901_list_template").html();
					
					// 핸들바 템플릿 컴파일
					var template = Handlebars.compile(source); 
					
					// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
					var liHtml = template(data);
					
					// 생성된 HTML을 DOM에 주입
					$('#com0901LstUl').html(liHtml);
					
				}
				
			}
			catch(e){}
			finally{
				smutil.loadingOff();			// 로딩바 닫기
				page.apiParamInit();			// 파라메터 전역변수 초기화
			}
			
		},
		// ################### 리스트 조회 end
		
		
		//기타 callback
		COM0602Callback : function(result){
			page.etc = result.param.value;
		},
		
		// api 파람메터 초기화 
		apiParamInit : function(){
			page.apiParam =  {
				id:"HTTP",					// 디바이스 콜 id
				param:{						// 디바이스가 알아야할 데이터
					task_id : "",			// 화면 ID 코드가 들어가기로함
					//position : {},		// 사용여부 미확정 
					type : "",
					baseUrl : "",
					method : "POST",		// api 호출 형식(지정 안하면 'POST' 로 자동 셋팅)
					callback : "",			// api 호출후 callback function
					contentType : "application/json; charset=utf-8"
				},
				data:{"parameters" : {}}	// api 통신용 파라메터
			};
		}
};