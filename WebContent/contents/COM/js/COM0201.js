var page = {
	init:function(data)	{
		// 이전페이지에서 넘겨 받은 파라미터로 배달, 집하 구분하며 어떤 api를 호출 할지 결정
		page.com0201= data.data.param;
		page.com0201.cldl_sct_cd="A";
		page.initInterface();
	}
	,PublishCode:function(){
		$(document).ready(function(){
			/* touchFlow */
			$(".divisionBox .selectBox").touchFlow();
		});
		/* //ready */
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
	,com0201:{}
	,initInterface : function()	{
		var data={};
		
		//selectbox와 tab클릭시 실행 이벤트
		$(document).on("click",".selectBox > ul > li,.tabBox > ul > li",function(){
			data = page.com0201;
			page.ClickFunc($(this),data);
		});
		
		
		//닫기
		$(".btn.closeW.paR").click(function(){
			LEMP.Window.close();
		});
		
		
		data.step_sct_cd=page.com0201.step_sct_cd;
		//selectBox 그려주는 함수
		page.mapTmslCnt();
		
	}	
	,mapTmslCnt:function(){
		var data = {};
		data.base_ymd=page.com0201.base_ymd;
		data.step_sct_cd=page.com0201.step_sct_cd;
		
		smutil.loadingOn();
		
		page.apiParam.param.baseUrl="smapis/cldl/mapTmslCnt";
		page.apiParam.param.callback="page.mapTmslCntCallback";
		page.apiParam.data.parameters=data;
		
		// 공통 api호출 함수 
		smutil.callApi(page.apiParam);
	}
	,mapTmslCntCallback:function(res){
		try {
			if (smutil.apiResValidChk(res) && res.code==="0000" && res.data_count > 0) {
				// 가져온 핸들바 템플릿 컴파일
				var template = Handlebars.compile($("#COM0201_list_template").html());
				// 핸들바 템플릿에 데이터를 바인딩해서 생성된 HTML을 DOM에 주입
				for (var i = 0; i < res.data.list.length; i++) {
					res.data.list[i].pick_total_cnt = res.data.list[i].pick_cnf_cnt+res.data.list[i].pick_ucnf_cnt;
					res.data.list[i].dlv_total_cnt = res.data.list[i].dlv_cnf_cnt+res.data.list[i].dlv_ucnf_cnt;
				}
				
				$('#com0201LstUl').append(template(res.data));
				
				$("#com0201LstUl").find("li:eq(0)").trigger("click");
			}
		}
		catch (e) {}
		finally{
			smutil.loadingOff();
			page.PublishCode();
		}
	}
	,ClickFunc : function(obj,data){
		obj.parent().find(".on").attr("class","");
		obj.attr("class","on");
		obj.parent().parent().find(".on").index()+1
		
		data.cldl_tmsl_cd= $("#com0201LstUl").find(".on").find(".top").attr("id");
		if ($(".tabBox").find(".on").index()==0) {
			page.locMapList(data);
		}else {
			page.mapList(data);
		}
	}

	
	// 순서 기준 조회
	,mapList:function(data){
		smutil.loadingOn();
		
		page.apiParam.param.baseUrl="smapis/cldl/mapList";
		page.apiParam.param.callback="page.MapListCallback";
		page.apiParam.data.parameters=data;
			
		// 공통 api호출 함수 
		smutil.callApi(page.apiParam);
	}
	
	
	// 순서 기준 조회 콜백
	,MapListCallback:function(res){
		try {
			if (res.data_count !== 0 && smutil.apiResValidChk(res) && res.code==="0000") {
				$(".NoBox").css("display","none");
				$("#mapCon").css("display","block");
				page.writeMap(res);
			}else {
				$("#mapCon").css("display","none");
				$(".NoBox").css("display","block");
			}
		}
		catch (e) {}
		finally{
			smutil.loadingOff();
		}
	}
	// 건수 기준 조회
	,locMapList:function(data){
		smutil.loadingOn();
		
//		page.com0201.base_ymd = "20200106"
		page.apiParam.param.baseUrl="smapis/cldl/locMapList";
		page.apiParam.param.callback="page.MapListCallback";
		page.apiParam.data.parameters=data;
		
		// 공통 api호출 함수 
		smutil.callApi(page.apiParam);
	}
	
	
	//지도 그리는 함수
	,writeMap: function(list){
		$("#mapCon").empty();
		// 맵그리기
		var arr = list.data.list;
		
		var mapContainer = document.getElementById('mapCon'); // 지도를 표시할 div 
		var mapOption = { 
			center: new kakao.maps.LatLng(arr[arr.length-1].lttd,arr[arr.length-1].lgtd), // 지도의 중심좌표, 정상좌표값이 들어있기만 하면 됩니다.
			level: 3 // 지도의 확대 레벨
		};
		
		var map = new kakao.maps.Map(mapContainer, mapOption); 
		
		
		//지도 레벨의 한계를 제한합니다
//		map.setMaxLevel(6);
		map.setMinLevel(2);
		
		
		// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
		var zoomControl = new kakao.maps.ZoomControl();
		map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
		
		
		// 마커들을 한 화면에 출력하기위해 맵 레벨 변경을 하기 위한 변수
		// 지도에서 표현 할 수 없는 좌표가 존재한다면 하얀 화면이 출력 될 수 있음
		var bounds = new kakao.maps.LatLngBounds();
		
		
		// 마커를 추가하는 반복문
		for (var i = 0; i < arr.length; i ++) {
			arr[i].latlng = new kakao.maps.LatLng(arr[i].lttd,arr[i].lgtd);

			if (arr[i].hasOwnProperty("cnt")) {
				var str=arr[i].cnt;
			}else {
				var str=i+1;
			}
			
			// 커스텀오버레이마커 생성
			// 배달
			if (arr[i].cldl_sct_cd==="D") {
				// 미전송
				if (arr[i].cmpt_yn !=="Y") {
					var name = '<div class ="label red"><span>'+str+'</span></div>';
				// 전송
				}else {
					var name = '<div class ="label pink"><span>'+str+'</span></div>';
				}
			// 집하
			}else{
				// 미전송
				if (arr[i].cmpt_yn !=="Y") {
					var name = '<div class ="label blue"><span>'+str+'</span></div>';
				// 전송
				}else {
					var name = '<div class ="label sky"><span>'+str+'</span></div>';
				}
			}
			
			// 커스텀 오버레이 객체를 생성합니다  
			var customOverlay = new kakao.maps.CustomOverlay({
				position: arr[i].latlng,
				content: name
			});
			
			// 마커를 추가함으로써 표현할 영역을 확장시킴
			bounds.extend(arr[i].latlng);
				
			customOverlay.setMap(map);
		}
		
		// 추가된 마커의 위치에 따라 맵의 표현범위가 확장
		map.setBounds(bounds);
	}
};