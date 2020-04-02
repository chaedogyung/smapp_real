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
	
	,res0102:{}
	,init:function(arg){
		page.res0102=arg.data.param;

		
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
				page.daySvcRateDtl();
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
		
	}
	
	,initDisplay:function(){
		var arr = page.res0102.srch_ymd.split(".");
		//var srch_ym = arr[0]+"년 "+arr[1]+"월";
		var srch_ym = page.res0102.srch_ymd;
		$("#srch_ym").text(srch_ym);
		$("#pacl_stat_nm").text(page.res0102.pacl_stat_nm);
		page.daySvcRateDtl();
	}
	
	,daySvcRateDtl:function(){
		smutil.loadingOn();
		var ymd=page.res0102.srch_ymd.split(".");
		var str = "";
		for (var i = 0; i < 3; i++) {
			str +=ymd[i];
		}
		
		var page_no = smutil.nullToValue(page.page_no, 1)+"";	// 전산집하에서 사용하는 페이징 번호
		var item_cnt = page.item_cnt+"";						// 전산집하에서 보여질 row 수
		
		
		page.apiParam.param.baseUrl="smapis/cmn/daySvcRateDtl";
		page.apiParam.param.callback="page.daySvcRateDtlCallback";
		page.apiParam.data.parameters.pacl_stat_cd=page.res0102.pacl_stat_cd;
		page.apiParam.data.parameters.srch_ymd=str;
		
		page.apiParam.data.parameters.page_no = page_no;			// 조회 페이지
		page.apiParam.data.parameters.item_cnt = item_cnt;			// 조회 페이지 네비
		
		smutil.callApi(page.apiParam);
	}
	
	,daySvcRateDtlCallback:function(res){
		try {
			if (smutil.apiResValidChk(res) && res.code === "0000" && res.data_count > 0) {
				//handlebars template 시작
				var list = res.data.list;
				
				//합계
				$("#total_summ_fare").text(String(res.data.total_summ_fare).LPToCommaNumber());
				
				for (var i = 0; i < res.data.list.length; i++) {
					//list[i].invNo = list[i].inv_no.substr(0,4)+"-"+list[i].inv_no.substr(4,4)+"-"+list[i].inv_no.substr(8,4)
					list[i].summ_fare = String(list[i].summ_fare).LPToCommaNumber();
				}
				var template = Handlebars.compile($("#res0102_tb_template").html());
				$("#res0102_tb").append(template(res.data));
				
				
				// 조회된 게시물이 있을경우 페이징 처리
				if(Number(res.data.total_cnt)
						&& Number(res.data.total_cnt) > 0){
					
					var pagObj = smutil.paginate(
						Number(res.data.total_cnt),
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
				
			}else {
				$("#res0102_no_list").css("display","block");
				
			}
		} catch (e) {}
		finally{
			smutil.loadingOff();
		}
	},
	
	
	
	
	page_no : 1,						// 조회 요청한 페이지 번호
	item_cnt : 400,						// 보여질 row 수
	page_navigation_cnt : 5,			// 페이징을 표시할 네게이션 수
}