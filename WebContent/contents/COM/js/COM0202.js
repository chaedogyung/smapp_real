var page = {
	init:function(arg)	{
		var obj=arg.data.param
		page.initInterface(obj);
	}


	//DOM출력 완료시 실행할 초기 함수
	,initInterface : function(data)	{
		$(document).on("click",".btn.closeW.paR",function(){
			LEMP.Window.close();
		});
		page.mapList(data);
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
	
	// 지도 조회 통신
	,mapList:function(data){
		smutil.loadingOn();
		
		page.apiParam.param.baseUrl = "smapis/cldl/mapList";
		page.apiParam.param.callback = "page.mapListCallback";
		page.apiParam.data.parameters = data;
			
		// 공통 api호출 함수 
		smutil.callApi(page.apiParam);
	}
	
	
	// 지도 조회 콜백
	,mapListCallback:function(res){
		try {
			if (res.data_count !== 0 && smutil.apiResValidChk(res) && res.code==="0000") {
				$(".NoBox").css("display","none");
				$("#mapCon").css("display","block");
				page.writeMap(res.data.list[0]);
			}else {
				$("#mapCon").css("display","none");
				$(".NoBox").css("display","block");
			}
		} catch (e) {}
		finally{
			smutil.loadingOff();
		}
	}
	//지도 그리는 함수
	,writeMap: function(res){
		$("#mapCon").empty();
		// 맵그리기
		var mapContainer = document.getElementById("mapCon"); // 지도를 표시할 div 
		var mapOption = { 
			center: new kakao.maps.LatLng(res.lttd, res.lgtd), // 지도의 중심좌표
			level: 3
		};
		// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
		var map = new kakao.maps.Map(mapContainer, mapOption); 
		
		//지도 레벨 제한
		map.setMaxLevel(6);
//		map.setMinLevel(2);
		
		/* 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다*/
		var zoomControl = new kakao.maps.ZoomControl();
		map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
		/**/
		
		// 지도를 클릭한 위치에 표출할 마커입니다
		var marker = new kakao.maps.Marker({ 
			// 지도 중심좌표에 마커를 생성합니다 
			position: map.getCenter() 
		}); 
		
		// 지도에 마커를 표시합니다
		marker.setMap(map);
	}
};