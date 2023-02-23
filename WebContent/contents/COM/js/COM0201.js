var page = {
	curLocation : null,			// 자기위치
	mbl_dlv_area: null,   //토요휴무
	pick_tmsl_cd: null,
	init:function(data)	{
		// 이전페이지에서 넘겨 받은 파라미터로 배달, 집하 구분하며 어떤 api를 호출 할지 결정
		page.com0201= data.data.param;
		page.com0201.cldl_sct_cd="A";
		page.getLocation();
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
		$(document).on("click",".selectBox > ul > li",function(){ //,.tabBox > ul > li 삭제
		//$(document).on("click",".selectBox > ul > li,.tabBox > ul > li",function(){
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
				//오름차순 정렬
				res.data.list.sort(function(a, b) {
					return a.cldl_tmsl_nm < b.cldl_tmsl_nm ? -1 : a.cldl_tmsl_nm > b.cldl_tmsl_nm ? 1 : 0;
				});
				// 가져온 핸들바 템플릿 컴파일
				var template = Handlebars.compile($("#COM0201_list_template").html());
				// 핸들바 템플릿에 데이터를 바인딩해서 생성된 HTML을 DOM에 주입
				for (var i = 0; i < res.data.list.length; i++) {
					res.data.list[i].pick_total_cnt = res.data.list[i].pick_cnf_cnt+res.data.list[i].pick_ucnf_cnt;
					res.data.list[i].dlv_total_cnt = res.data.list[i].dlv_cnf_cnt+res.data.list[i].dlv_ucnf_cnt;
				}

				$('#com0201LstUl').append(template(res.data));

				$("#com0201LstUl").find("li:eq(0)").trigger("click");
			} else {
				if(res.code==="0000" && res.data_count == 0) {
					//현재 내 위치만 표시하자
					$('#com0201LstUl').append(template(res.data));
				}
				
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
		obj.parent().parent().find(".on").index()+1;

		page.pick_tmsl_cd= $("#com0201LstUl").find(".on").find(".top").attr("id");
		data.cldl_tmsl_cd= page.pick_tmsl_cd;
		
		if(smutil.isEmpty(data.cldl_tmsl_cd)) data.cldl_tmsl_null = "true";
		
		page.locMapList(data);
		/*if ($(".tabBox").find(".on").index()==0) {
			page.locMapList(data);
		}else {
			page.mapList(data);
		}*/
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
		var arr = res.data.list;
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

	//현재위치 찾기
	,getLocation:function() {
		if(navigator.geolocation) { //GPS 지원여부
			navigator.geolocation.getCurrentPosition(function(position) {
				page.curLocation = new kakao.maps.LatLng(position.coords.latitude,position.coords.longitude);

			}, function(error) {
				//console.error(error);
			}, {
				enableHighAccuracy : false,//배터리를 더 소모해서 더 정확한 위치를 찾음
				maximumAge: 0, //한 번 찾은 위치 정보를 해당 초만큼 캐싱
				timeout: Infinity //주어진 초 안에 찾지 못하면 에러 발생
			});
		}
		
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
		
		var marker = new kakao.maps.Marker({}); 

		//지도 레벨의 한계를 제한합니다
//		map.setMaxLevel(6);
// 		map.setMinLevel(2);


		// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
		var zoomControl = new kakao.maps.ZoomControl();
		map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);


		// 마커들을 한 화면에 출력하기위해 맵 레벨 변경을 하기 위한 변수
		// 지도에서 표현 할 수 없는 좌표가 존재한다면 하얀 화면이 출력 될 수 있음
		var bounds = new kakao.maps.LatLngBounds();

		var isFindMe = false;
		var imarkerPosition = page.curLocation;
		if(!imarkerPosition) {
			//현재페이지에서 현재위치를 못가져왔으면 호출페이지에서 넘김파라미터에 담긴 현재위치정보 활용한다
			if(page.com0201.curLat && page.com0201.curLong) {
				imarkerPosition = new kakao.maps.LatLng(page.com0201.curLat,page.com0201.curLong);	
			}
		}

		if(imarkerPosition) {
		    var name = '<div class ="label curloc"><span></span></div>';
			var customOverlay = new kakao.maps.CustomOverlay({
				position: imarkerPosition,
				content: name
			});
	
			bounds.extend(imarkerPosition);
          
			customOverlay.setMap(map);
			isFindMe = true;
		}

		// 마커를 추가하는 반복문
		for (var i = 0; i < arr.length; i ++) {
			arr[i].latlng = new kakao.maps.LatLng(arr[i].lttd,arr[i].lgtd);

			var content;
			content = document.createElement('div'); 
			content.setAttribute('id','I'+i); 
			content.classList.add('label');
			var strCnt = arr[i].cldl_p + '/' + arr[i].cldl_d;
			if(page.com0201.step_sct_cd == "0") {
				content.classList.add('red');
				//content.classList.add('pink');	
			} else if(page.com0201.step_sct_cd == "1" ) {
				content.classList.add('blue');  //미전송 , 미처리건 1건이라도 있으면 빨간색 표시
			} else {
				content.classList.add('silver');	
			}
			
			
			/*var str;
			if (arr[i].hasOwnProperty("cnt")) {
				str=arr[i].cnt;
			}else {
				str=i+1;
			}
			 
			// 커스텀오버레이마커 생성
			// 배달
			if (arr[i].cldl_sct_cd==="D") {
				// 미전송
				if (arr[i].cmpt_yn !=="Y") {
					content.classList.add('red');
					var name = '<div class ="label red"><span>'+str+'</span></div>';
				// 전송
				}else {
					content.classList.add('pink');
					var name = '<div class ="label pink"><span>'+str+'</span></div>';
				}
			// 집하
			}else{
				// 미전송
				if (arr[i].cmpt_yn !=="Y") {
					content.classList.add('blue');
					var name = '<div class ="label blue"><span>'+str+'</span></div>';
				// 전송
				}else {
					content.classList.add('sky');
					var name = '<div class ="label sky"><span>'+str+'</span></div>';
				}
			}*/
			var info = document.createElement('span');
		    info.appendChild(document.createTextNode(strCnt));
		    content.appendChild(info);	
			content.onclick = function(e) {
				var id = $(this)[0].id; 
				var mid = 0, stmpDetail;
				if(($(this).attr("id")).length > 1) {
					mid = ($(this).attr("id")).substr(1);
					
					if(!smutil.isEmpty(arr[mid].bld_mgr_no)){
						var popUrl = smutil.getMenuProp('CLDL.CLDL0802', 'url');

						LEMP.Window.open({
							"_sPagePath":popUrl,
							"_oMessage" : {
								"param" : {
									"bld_mgr_no" : arr[mid].bld_mgr_no+"",
									"cldl_tmsl_cd" : page.pick_tmsl_cd,									
									"base_ymd" : page.com0201.base_ymd,
									"step_sct_cd" : page.com0201.step_sct_cd,
									"ep" : arr[mid].lttd+","+arr[mid].lgtd
								}
							}
						});	
					}					
				} 
				
		    };
			
			// 커스텀 오버레이 객체를 생성합니다
			var customOverlay = new kakao.maps.CustomOverlay({
				position: arr[i].latlng,
				content: content //name
			});

			// 마커를 추가함으로써 표현할 영역을 확장시킴
			bounds.extend(arr[i].latlng);
			
			// 마커를 클릭했을 때 커스텀 오버레이를 표시합니다
			kakao.maps.event.addListener(marker, 'click', function() {			
			});

			customOverlay.setMap(map);
		}
		
		///////////
		if(!isFindMe) {
			imarkerPosition = page.curLocation;
			if(imarkerPosition) {
			    var name = '<div class ="label curloc"><span>I</span></div>';
				var customOverlay = new kakao.maps.CustomOverlay({
					position: imarkerPosition,
					content: name
				});
		
				bounds.extend(imarkerPosition);
	          
				customOverlay.setMap(map);
			}	
		}
		///////////
		
			
		// 추가된 마커의 위치에 따라 맵의 표현범위가 확장
		map.setBounds(bounds);
	}
	
	// 운송장목록 팝업창 닫을때 callback 함수
	, cldl0802Callback : function(res){
		console.log('cldl0802Callback');
		page.mapTmslCnt();
	}	
};
