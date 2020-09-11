var page = {
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
	}
	
	,res0103:{}
	,init:function(arg){
		page.res0103=arg.data.param;
		page.initEvent();
		page.initDisplay();
	}
	
	,initEvent:function(){
		$(".btn.closeW.paR").click(function(){
			LEMP.Window.close();
		});
		
		
		// 페이징 버튼 누를경우 
		$(document).on('click', '.naviPageIdx', function(e){
			// 착불 현불일 경우만 금액변경 팝업오픈
			var pageNo = $(this).data('pageNo');
			
			if(!smutil.isEmpty(pageNo)){
				// 선택한 페이지 넘버 셋팅
				page.page_no = pageNo;
				
				// 페이지 제조회
				page.svcMonDtl();
			}
			
			
		});
		
		
		
		// 송장번호 row를 클릭하는경우
		$(document).on('click', '.invNoTr', function(e){
			var inv_no = $(this).data('invNo');
			
			if(!smutil.isEmpty(inv_no)){
				var popUrl = smutil.getMenuProp("FRE.FRE0301","url");
				LEMP.Window.open({
					"_sPagePath":popUrl,
					"_oMessage":{
						"param":{
							"inv_no":inv_no+""
						}
					}
				});
			}
			
//			if(!smutil.isEmpty(inv_no)){
//				if($(this).data('sct1') == "집하"){
//					//집하완료팝업 오픈
//					var popUrl = smutil.getMenuProp('CLDL.CLDL0305', 'url');
//					
//					LEMP.Window.open({
//						"_sPagePath":popUrl,
//						"_oMessage" : {
//							"param" : {
//								"inv_no" : inv_no+""
//							}
//						}
//					});
//					
//				}
//				else{
//					// 배달완료 팝업오픈
//					var popUrl = smutil.getMenuProp('CLDL.CLDL0404', 'url');
//					
//					LEMP.Window.open({
//						"_sPagePath":popUrl,
//						"_oMessage" : {
//							"param" : {
//								"inv_no" : inv_no+""
//							}
//						}
//					});
//				}
//			}
		});
		
		
		// 송장번호 형식 표시
		Handlebars.registerHelper('invNoTmpl', function(options) {
			if(!smutil.isEmpty(this.inv_no)){
				return (this.inv_no).replace(/([0-9]{4})([0-9]{4})([0-9]{4})/,"$1-$2-$3");
			}
			else{
				return "";
			}
		});
		
		
		// 송장번호 형식 표시
		Handlebars.registerHelper('getMoneyType', function(options) {
			if(!smutil.isEmpty(this.fare+"") && this.fare > 0){
				return (this.fare+"").LPToCommaNumber()+" 원";
			}
			else{
				return "0 원";
			}
		});
		
		
		// 운임 라벨 표시 html return
		Handlebars.registerHelper('fareChk', function(options) {
			var result = "";
			
			if(!smutil.isEmpty(this.sct1) 
					&& (this.sct1 == "집하" || this.sct1 == "배송")){
				
				if(this.sct1 === "집하"){	// 집하
					switch (this.pay_nm) {
					case "현불":		// 현불 , 금액 표시
						if(this.fare > 0){
							result = "현불 ("+(this.fare+"").LPToCommaNumber()+")";
						}
						else{
							result = "현불 (0)";
						}
						break;
					case "착불":		// 착불
						result = "착불";
						break;
					case "착불결제완료":		// 착불결제완료
						result = "착불결제완료";
						break;
					default:
						result = "신용";
						break;
					}
				}
				else if(this.sct1 === "배송"){	// 배달
					switch (this.pay_nm) {
					case "현불":		// 현불
						result = "현불";
						break;
					case "착불":		// 착불, 금액 표시
						if(this.fare > 0){
							result = "착불 ("+(this.fare+"").LPToCommaNumber()+")";
						}
						else{
							result = "착불 (0)";
						}
						break;
					case "착불결제완료":		// 착불결제완료
						result = "착불결제완료";
						break;
					default:
						result = "신용";
						break;
					}
				}
				
				return result;
			}
			else{
				return "0";
			}
		});
	}
	
	,initDisplay:function(){
		
		if(!smutil.isEmpty(page.res0103.ymd)){
			var arr = page.res0103.ymd.split(".");
			if(arr.length == 3){
				var srch_ym = arr[0]+"년 "+arr[1]+"월 "+arr[2]+"일";
				$("#srch_ym").text(srch_ym);
				$("#pacl_stat_nm").text(page.res0103.pacl_stat_nm);
				page.svcMonDtl();
			}
		}
	}
	
	,svcMonDtl:function(){
		smutil.loadingOn();
		var ymd=page.res0103.ymd.split(".");
		var str = "";
		str = ymd[0] + ymd[1] + ymd[2];
		var page_no = smutil.nullToValue(page.page_no, 1)+"";	// 전산집하에서 사용하는 페이징 번호
		var item_cnt = page.item_cnt+"";						// 전산집하에서 보여질 row 수
		
		page.apiParam.param.baseUrl="smapis/cmn/svcMonDtl";
		page.apiParam.param.callback="page.svcMonDtlCallback";
		page.apiParam.data.parameters.pick_dlv_ymd=str;
		
		page.apiParam.data.parameters.page_no = page_no;			// 조회 페이지
		page.apiParam.data.parameters.item_cnt = item_cnt;			// 조회 페이지
		
		smutil.callApi(page.apiParam);
	}
	
	,svcMonDtlCallback:function(result){
		
		try{
			// api 전송 성공
			if(smutil.apiResValidChk(result) && result.code == "0000"){
				var data = {};

				if(!smutil.isEmpty(result.data)){
					data = result.data;
				}
				
				// 핸들바 템플릿 가져오기
				var source = $("#res0103_tb_template").html();
				
				// 핸들바 템플릿 컴파일
				var template = Handlebars.compile(source); 

				// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
				var trHtml = template(data);
				

				// 생성된 HTML을 DOM에 주입
				$('#res0103_tb').html(trHtml);
				
				
				
				// 조회된 게시물이 있을경우 페이징 처리
				if(Number(result.data.total_cnt)
						&& Number(result.data.total_cnt) > 0){
					
					var pagObj = smutil.paginate(
						Number(result.data.total_cnt),
						Number(page.page_no),
						Number(page.item_cnt),
						Number(page.page_navigation_cnt)
					);
					
					
					if(!smutil.isEmpty(pagObj) && (pagObj.pages.length > 0)){
						
						var naviLiHtml = "";
						
						$.each(pagObj.pages, function(idx, obj){
							
							// 선택된 페이지
							if((obj+"") == (page.page_no+"")){
								naviLiHtml += '<li class="naviPageIdx" data-page-no="'+obj+'"><strong class="current">'+obj+'</strong></li>';
							}
							else {
								naviLiHtml += '<li class="naviPageIdx" data-page-no="'+obj+'"><button>'+obj+'</button></li>';
							}
						});
						
						
						$('#pagingUl').html(naviLiHtml);		// 네비게이션바에 리스트 셋팅
					}
					$('#pagingDiv').show();					// 네비게이션바 보이기
				}
				else{
					$('#pagingDiv').hide();					// 네비게이션바 숨김
				}

			}
		}
		catch(e){}
		finally{
			smutil.loadingOff();			// 로딩바 닫기
		}
	},
	
	
	page_no : 1,						// 조회 요청한 페이지 번호
	item_cnt : 400,						// 전산집하에서 보여질 row 수
	page_navigation_cnt : 5,			// 페이징을 표시할 네게이션 수
	
	
}