var page = {
	curLocation : null,			// 자기위치
	curLgtd: null,
	curLttd: null,
	isfirst : true,		
	isGpsLoad : false,
	datalist : null,  //지도에 표시할 위도경도목록
	dlvyCompl : null,			// 구역,시간 기준
	mbl_dlv_area: null,   //토요휴무
	sboxType: null,			// 권역 or 시간별
	is_reload : null,      //부모창 리로드여부(자식창 변경여부)
	init:function(data)	{
		// 이전페이지에서 넘겨 받은 파라미터로 배달, 집하 구분하며 어떤 api를 호출 할지 결정
		page.com0201= data.data.param;
		page.com0201.cldl_sct_cd="A";
		
		var baseymd = (page.com0201.base_ymd).substr(0,4) + "." + (page.com0201.base_ymd).substr(4,2) + "." + (page.com0201.base_ymd).substr(6,2);
		$('#cldlBtnCal').text(baseymd);
		
		page.dlvyCompl = LEMP.Properties.get({
			"_sKey" : "autoMenual"
		});
		page.sboxType = 'time';
		if(!_.isUndefined(page.dlvyCompl)){
			if(page.dlvyCompl.area_sct_cd == "Y"){
				page.sboxType = 'area';
			} else {
				page.sboxType = 'time';
			}
		}

		page.getLocation();
		page.initInterface();
		page.initDpEvent();
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

			if(page.is_reload) {
				LEMP.Window.close({
						"_oMessage":{
							"param":{"step_sct_cd":page.com0201.step_sct_cd}
						},
						"_sCallback":"page.com0201Callback"
					});
			} else {
				LEMP.Window.close();
			}
		});

		$("#cldlBtnCal").click(function(){

			var popUrl = smutil.getMenuProp("COM.COM0301","url");
			LEMP.Window.open({
				"_sPagePath":popUrl,
				"_oMessage":{
					"param":null
				}
			});

		});	// end 스캔버튼을 누른경우 종료

		
		// 집배달출발 전송버튼 클릭 //2023.04.04
		$('#dprtTrsmTrsmBtn').click(function(e){
			var base_ymd = $('#cldlBtnCal').text();
			var dprtTrsmCnt = Number(smutil.nullToValue($('#A_com0201Cnt').text(), "0")); //건물번호와 상관없이 전체 출발건수 가져올것
			if(dprtTrsmCnt == 0 || smutil.isEmpty(dprtTrsmCnt)){
            	LEMP.Window.toast({
					"_sMessage":"전송할 데이터가 없습니다.",
					'_sDuration' : 'short'
				});

                return false;
            }
            
			if(smutil.isEmpty(base_ymd)){
				LEMP.Window.toast({
					"_sMessage":"날짜를 선택해 주세요.",
					'_sDuration' : 'short'
				}); 

				return false;
			}
			else{ // 배달출발 확정(전송) 컴펌창 호출
				$('#pop2Txt2').html(dprtTrsmCnt + '건의 집배달 출발을 전송합니다.');
				$('.mpopBox.pop2').bPopup();
			}
		});
		
		// 배달출발확정 버튼 'yes' 버튼 클릭
		$('#dprtTrsmYesBtn').click(function(e){
			// 배달출발 확정로직 시작
			page.dprtTrsm();
		});
		
		
		//selectBox 그려주는 함수
		//page.mapTmList();
		setTimeout(function() { //현재위치 찾을시간 주고 찾지못할경우 실행
			  if(!page.isGpsLoad) {
				page.mapSelectList();
			}
		}, 3000);

	}
	// 화면 디스플레이 이벤트
	, initDpEvent : function(){
		var _this = this;
		
		if(page.com0201.step_sct_cd != "0"  && page.com0201.step_sct_cd != "1"){
			$(".popMap .divisionBox").hide();
			$(".popMap .mapCon").css({"top": "98px"});
			$(".popMap .mapCon").css({"height": "85%"});
			$(".cldl0send").hide();//2023.04.10
		} else {
			$(".popMap .divisionBox").show();
			if(page.sboxType == "time") {
				$(".popMap .mapCon").css({"top": "170px"});
				$(".popMap .mapCon").css({"height": "77%"});
				
				$("#setDlvyCom1").text('시간');
	            $("#setDlvyCom1").attr('class', 'green badge option outline');
			} else {
				$(".popMap .mapCon").css({"top": "193px"});
				$(".popMap .mapCon").css({"height": "74%"});
				
				$("#setDlvyCom1").text('구역');
	            $("#setDlvyCom1").attr('class', 'red badge option outline');				
			}
			
			// 자동전송 여부
			if(page.dlvyCompl.area_sct_cd2 == "A") {
				$("#setDlvyCom2").text('자동');
				$("#setDlvyCom2").attr('class', 'blue badge option outline');
			} else {
				$("#setDlvyCom2").text('수동');
                $("#setDlvyCom2").attr('class', 'gray2 badge option outline');
			}
			if(page.com0201.step_sct_cd == "0") { //2023.04.10
				$(".cldl0send").show();
			} else {
				$(".cldl0send").hide();
			}
		}

	}  //initDpEvent end

	, mapSelectList:function() {
		$("#A_com0201Cnt").text(0);
		$("#P_com0201Cnt").text(0);
		$("#D_com0201Cnt").text(0);
		
		if(page.com0201.step_sct_cd == "0" || page.com0201.step_sct_cd == "1"){
			if(page.sboxType == 'area'){
				page.mapAreaList();            // 구역별 조회건수 조회
				$('.noList > #mapCon > div > div > div > div >.label.red > div').hide();
			} else{
				page.mapTmList();
				$('.noList > #mapCon > div > div > div > div >.label.red > div').hide();
			}
		} else {
			var data={};
			data.base_ymd = page.com0201.base_ymd;
			data.step_sct_cd = page.com0201.step_sct_cd+"";
			data.cldl_sct_cd = "A"; //page.cldl_sct_cd
			data.cldl_tmsl_null = "true";
			data.sbox_type_cd = "";
			page.locMapList(data);
			$('.noList > #mapCon > div > div > div > div >.label.silver > div').hide();
		}
	}
	// ################### 구역별 조회건수 조회 start
	, mapAreaList : function(){
		
		var data = {};
		data.base_ymd=page.com0201.base_ymd;
		data.cldl_sct_cd="A";
		data.step_sct_cd=page.com0201.step_sct_cd+"";

		smutil.loadingOn();

		page.apiParam.param.baseUrl="smapis/cldl/mapAreaList";
		page.apiParam.param.callback="page.mapAreaListCallback";
		page.apiParam.data.parameters=data;

		// 공통 api호출 함수
		smutil.callApi(page.apiParam);
	},

	// 구역별 조회건수 callback
	mapAreaListCallback : function(result){
		page.apiParamInit();		// 파라메터 전역변수 초기화
		try {
			if (smutil.apiResValidChk(result) && result.code==="0000") {
				// 조회 결과 데이터가 있으면 옵션 생성
				if(result.data_count > 0){
					var data = result.data;
					
					//오름차순 정렬
					data.list.sort(function(a, b) {
						if(a.mbl_area == "기타"){
							return -1;
						}
						
						if(b.mbl_area == "기타"){
							return 1;
						}
						
						return 0;
					});

					// 핸들바 템플릿 가져오기
					var source = $("#COM0201_mblLst_template").html();
					
					// 핸들바 템플릿 컴파일
					var template = Handlebars.compile(source);

					// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
					var liHtml = template(data);

					// 생성된 HTML을 DOM에 주입
					$('#com0201LstUl').html(liHtml); //cmptTmListUl
					
					/* touchFlow 등록*/
					$(".divisionBox .selectBox").touchFlow();

					$("#com0201LstUl").find("li:eq(0)").trigger("click");					
				}
				else{
					// 리스트가 아무것도 없을경우에는 기본으로 18~20 시 코드를 셋팅한다
					var data = {"list" : [{
						"mbl_area": "기타",
						"mbl_area_org": "기타",
						"alps_area":"ZZ",
						"min_nm": "18",
						"max_nm": "20",
						"cldl_tmsl_nm": "18~20시",
						"cldl_tmsl_cd": "19",
						"cnt" : 0,
						"cnt_p" : 0,
						"cnt_d" : 0,
						"min_tmsl" : "18",
						"max_tmsl" : "19"							
					}]};
					var source = $("#COM0201_mblLst_template").html(); 
					// 핸들바 템플릿 컴파일
					var template = Handlebars.compile(source);

					// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
					var liHtml = template(data);

					// 생성된 HTML을 DOM에 주입
					$('#com0201LstUl').html(liHtml);


					/* touchFlow 등록*/
					$(".divisionBox .selectBox").touchFlow();

					$('#mapno').show();
					$('#mapCon').hide();
				}
				
			}else {
				$('#mapno').show();
				$('#mapCon').hide();
				$('#com0201LstUl').html('');				
			}
		}
		catch (e) {}
		finally{
			smutil.loadingOff();
		}
	}
	// ################### 구역별 조회건수 조회 end
	,mapTmList:function(){
		var data = {};
		data.base_ymd=page.com0201.base_ymd;
		data.step_sct_cd=page.com0201.step_sct_cd+"";

		smutil.loadingOn();

		page.apiParam.param.baseUrl="smapis/cldl/mapTmList";
		page.apiParam.param.callback="page.mapTmListCallback";
		page.apiParam.data.parameters=data;

		// 공통 api호출 함수
		smutil.callApi(page.apiParam);
	}
	,mapTmListCallback:function(res){
		try {
			if (smutil.apiResValidChk(res) && res.code==="0000" && res.data_count > 0) {
				// 가져온 핸들바 템플릿 컴파일
				var template = Handlebars.compile($("#COM0201_list_template").html());
				
				$('#mapno').hide();
				$('#mapCon').show();

				$('#com0201LstUl').html(template(res.data));

				$("#com0201LstUl").find("li:eq(0)").trigger("click");
			} else {
				/*var template = Handlebars.compile($("#com0201_list_template").html());
				$('#com0201LstUl').html(template(res.data));*/
				$('#mapno').show();
				$('#mapCon').hide();
				$('#com0201LstUl').html('');
				
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

		//page.pick_tmsl_cd= $("#com0201LstUl").find(".on").find(".top").attr("id");
		data.sbox_type = "";
		data.sbox_type_cd = obj.data('timecd') + "";
		data.sbox_type_cd2 = "";
		data.min_tmsl = "";
		data.max_tmsl = "";
		data.cldl_tmsl_null = "";

		if(smutil.isEmpty(data.sbox_type_cd )) {
			data.cldl_tmsl_null = "true";
			data.sbox_type_cd = "";
		}

		if(page.sboxType == 'area' && page.com0201.step_sct_cd != "3"){
			data.sbox_type = "area";
			data.min_tmsl = smutil.nullToValue(obj.data('tmslmin'), "") + "";
			data.max_tmsl = smutil.nullToValue(obj.data('tmslmax'), "") + "";
			data.sbox_type_cd2 = smutil.nullToValue(obj.data('timecd2'), "") + "";
		}else{
			data.sbox_type = "time";
		}

		data.base_ymd = page.com0201.base_ymd;
		data.step_sct_cd = page.com0201.step_sct_cd;
		data.cldl_sct_cd = "A"; //page.cldl_sct_cd 
		
		page.com0201 = data;
		page.com0201.max_nm = smutil.nullToValue(obj.data('maxnm'), "");
		page.com0201.pick_tmsl_nm = smutil.nullToValue(obj.data('timenm'), "");
		
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

		page.datalist = null;
		page.apiParam.param.baseUrl="smapis/cldl/mapList";
		page.apiParam.param.callback="page.MapListCallback";
		page.apiParam.data.parameters=data;

		// 공통 api호출 함수
		smutil.callApi(page.apiParam);
	}


	// 순서 기준 조회 콜백
	,MapListCallback:function(res){
		//var arr = res.data.list;
		page.datalist = res.data.list;
		try {
			if (res.data_count !== 0 && smutil.apiResValidChk(res) && res.code==="0000") {
				$(".NoBox").css("display","none");
				$("#mapCon").css("display","block");
				page.writeMap(page.datalist);
				
				//지도 집배달 출발 목록 조회 건수(전송시 알림용)
				if(page.com0201.step_sct_cd == "0") { //2023.04.10
					if(!smutil.isEmpty(res.data.listCnt)){
					var cnt = 0;
					$.each(res.data.listCnt, function(index, obj){
							if(smutil.isEmpty(obj.cldl_cnt)) {
								cnt = 0 ;
							}
							else{
								cnt = obj.cldl_cnt ;
							}
	
							$("#"+obj.cldl_sct_cd+"_com0201Cnt").text(cnt);
						});
					}
				}
			}else {
				$("#mapCon").css("display","none");
				$(".NoBox").css("display","block");
			}
		}
		catch (e) {}
		finally{
			smutil.loadingOff();
			
			/*if(page.isfirst) {				
				if(smutil.isEmpty(page.curLgtd)) {
					alert('GPS(핸드폰 위치 서비스) 설정 바랍니다.');
				}
			}*/
			page.isfirst = false;
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
		//if(navigator.geolocation) { //GPS 지원여부
			navigator.geolocation.getCurrentPosition(function(position) {
				page.isGpsLoad = true;
				page.curLocation = new kakao.maps.LatLng(position.coords.latitude,position.coords.longitude);				
				if((position.coords.latitude + "").substr(0,1) == '1') {
					page.curLgtd = position.coords.latitude;
					page.curLttd = position.coords.longitude;	
				} else {
					page.curLgtd = position.coords.longitude;
					page.curLttd = position.coords.latitude;
				}

				if(!page.isfirst && page.datalist != null && page.datalist.length > 0) {
					page.writeMap(page.datalist);
				} else {
					page.mapSelectList();
				}
			}, function(error) {
				//alert('GPS권한이 필요합니다.');
				console.error(error);
			}, {
				enableHighAccuracy : false,//배터리를 더 소모해서 더 정확한 위치를 찾음
				maximumAge: 0, //한 번 찾은 위치 정보를 해당 초만큼 캐싱
				timeout: Infinity //주어진 초 안에 찾지 못하면 에러 발생
			});
		//}
	}
	
	//지도 그리는 함수
	,writeMap: function(list){
		$("#mapCon").empty();
		// 맵그리기
		var arr = list;
		
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
		}

		// 마커를 추가하는 반복문
		for (var i = 0; i < arr.length; i ++) {
			arr[i].latlng = new kakao.maps.LatLng(arr[i].lttd,arr[i].lgtd);

			var content;
			content = document.createElement('div'); 
			content.setAttribute('id','I'+i); 
			content.classList.add('label');
			var strCnt = arr[i].cldl_p + '/' + arr[i].cldl_d;
			var bldMgrNo = arr[i].bld_mgr_no;
			if(page.com0201.step_sct_cd == "0" || page.com0201.step_sct_cd == "1") {
				content.classList.add('red');
				//content.classList.add('pink');	
			} else {
				content.classList.add('silver');	
			}
			
			var info = document.createElement('span');
			var info2 = document.createElement('div');
		    info.appendChild(document.createTextNode(strCnt));
		    info2.appendChild(document.createTextNode(bldMgrNo));
		    content.appendChild(info);	
		    content.appendChild(info2);	
			content.onclick = function(e) {
				var id = $(this)[0].id; 
				var mid = 0, stmpDetail;
				if(($(this).attr("id")).length > 1) {
					mid = ($(this).attr("id")).substr(1);
					
					if(!smutil.isEmpty(arr[mid].bld_mgr_no)){
						var popUrl = smutil.getMenuProp('CLDL.CLDL0802', 'url');
						//console.log('com0201', page.com0201);
						var cldl_sct_cd = "P";
						if(arr[mid].cldl_p == 0) cldl_sct_cd = "D";
						
						var paramdata = {};
						paramdata.bld_mgr_no = arr[mid].bld_mgr_no;
						paramdata.base_ymd=page.com0201.base_ymd;
						paramdata.step_sct_cd=page.com0201.step_sct_cd;
						paramdata.cldl_sct_cd = cldl_sct_cd;
						paramdata.ep = arr[mid].lttd+ "," +arr[mid].lgtd;	
						
						paramdata.lttd = arr[mid].lttd;
						paramdata.lgtd = arr[mid].lgtd;
						paramdata.curlgtd = page.curLgtd;
						paramdata.curlttd = page.curLttd;

						if(page.com0201.step_sct_cd == "0" || page.com0201.step_sct_cd == "1") {
							paramdata.sbox_type = page.com0201.sbox_type;
							paramdata.sbox_type_cd = page.com0201.sbox_type_cd;
							paramdata.sbox_type_cd2 = page.com0201.sbox_type_cd2;
							paramdata.cldl_tmsl_null = page.com0201.cldl_tmsl_null;
							paramdata.max_tmsl = page.com0201.max_tmsl;
							paramdata.min_tmsl = page.com0201.min_tmsl;
							paramdata.max_nm = page.com0201.max_nm;
							paramdata.cldl_tmsl_nm = page.com0201.pick_tmsl_nm;
						}

						/*LEMP.MultiLayout.open({
							"_sPagePath" : popUrl,
							"_sType"     : "popup",
							"_sWidth"    : "90%",
							"_sHeight"   : "90%",	
							"_oMessage" : {
								"param" : paramdata
							}
						});*/
						LEMP.Window.open({
							"_sPagePath" : popUrl,
							/*"_sType"     : "popup",
							"_sWidth"    : "90%",
							"_sHeight"   : "90%",*/	
							"_oMessage" : {
								"param" : paramdata
							}
						});
					}					
				} 
				
		    };			
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
		
			
		// 추가된 마커의 위치에 따라 맵의 표현범위가 확장
		map.setBounds(bounds);
		
		//지도새로고침(현재자기위치 갱신용)		
		var divMapReload = document.createElement('div'); 
		divMapReload.setAttribute('id','mapReload'); 
		divMapReload.classList.add('label');
		divMapReload.classList.add('mapreload');
		divMapReload.onclick = function(e) {
			page.getLocation();
		};
		mapContainer.appendChild(divMapReload);
		$("#mapReload").css({"top": "5px" ,"margin-left": "8px", "z-index": "1"});
	}
	// api 파람메터 초기화
	,apiParamInit : function(){
		page.apiParam =  {
			id:"HTTP",			// 디바이스 콜 id
			param:{				// 디바이스가 알아야할 데이터
				task_id : "",										// 화면 ID 코드가 들어가기로함
				//position : {},									// 사용여부 미확정
				type : "",
				baseUrl : "",
				method : "POST",									// api 호출 형식(지정 안하면 'POST' 로 자동 셋팅)
				callback : "",										// api 호출후 callback function
				contentType : "application/json; charset=utf-8"
			},
			data:{"parameters" : {}}// api 통신용 파라메터
		};
	}
	
	// ################### 집배달출발 전송 start //2023.04.10
	, dprtTrsm : function(){
		var cldl_sct_cd = "A";		// 업무구분 (전체 : A, 집하 : P, 배달 : D)
		var cldl_tmsl_cd = page.returnTimeCd();		// 시간구분코드
		var base_ymd = $('#cldlBtnCal').text();

		if(smutil.isEmpty(base_ymd)){
			LEMP.Window.toast({
				"_sMessage":"날짜를 선택해 주세요.",
				'_sDuration' : 'short'
			}); 

			return ;
		}

		base_ymd = base_ymd.split('.').join('');

		// 시간대별 전송이 아닌 전체 전송으로 수정(20200121 : 수정사항 반영)
		//if(!smutil.isEmpty(cldl_sct_cd) && !smutil.isEmpty(cldl_tmsl_cd)){
		if(!smutil.isEmpty(cldl_sct_cd)){
			page.apiParamInit();		// 파라메터 전역변수 초기화
			page.apiParam.param.baseUrl = "smapis/cldl/dprtTrsm";			// api no
			page.apiParam.param.callback = "page.dprtTrsmCallback";		// callback methode
			page.apiParam.data = {						// api 통신용 파라메터
				"parameters" : {
					"cldl_sct_cd" : cldl_sct_cd			// 업무구분
					//, "cldl_tmsl_cd" : cldl_tmsl_cd
					, "base_ymd" : base_ymd				// 기준일자
				}
			};

			smutil.loadingOn();				// 로딩바 on

			// 공통 api호출 함수
			smutil.callApi(page.apiParam);
		}

	},


	// 배달출발전송 콜백
	dprtTrsmCallback : function(result){
		try{
			// api 전송 성공
			if(smutil.apiResValidChk(result) && result.code == "0000"){
				LEMP.Window.toast({
					"_sMessage" : "집배달출발을 전송하였습니다.",
					"_sDuration" : "short"
				});
				page.is_reload = true;
				page.mapSelectList(); //page.listReLoad();					// 리스트 제조회
			}
		}
		catch(e){}
		finally{
			smutil.loadingOff();			// 로딩바 닫기
			page.apiParamInit();			// 파라메터 전역변수 초기화
		}
	},
	// ################### 배달출발확정(전송) end
	// 현재 활성화 시간구간코드 리턴
	returnTimeCd : function(){
		var timeLst = $("li[name='timeLstLi']");

		//현제 어느 탭에 있는지 상태체크
		var btnObj;
		var cldl_tmsl_cd;
		_.forEach(timeLst, function(obj, key) {
			btnObj = $(obj);

			if(btnObj.is('.on')){
				cldl_tmsl_cd = btnObj.data('timeLi');
				return false;
			}
		});

		return cldl_tmsl_cd;
	}

	
	//com0301에서 날짜 선택 한 후 실행되는 콜백 함수 
	, COM0301Callback:function(res){
		$("#cldlBtnCal").text(res.param.date);
		page.com0201.base_ymd = (res.param.date).split('.').join('');
		page.mapSelectList();
	}
	
	// 운송장목록 팝업창 닫을때 callback 함수
	, cldl0802Callback : function(res){

		if(!smutil.isEmpty(res.param.step_sct_cd)) {
			page.com0201.step_sct_cd = res.param.step_sct_cd + "";
			page.is_reload = true;
			page.mapSelectList2();
		}
	}
	,mapSelectList2:function() {
		$("#A_com0201Cnt").text(0);
		$("#P_com0201Cnt").text(0);
		$("#D_com0201Cnt").text(0);
		
		if(page.com0201.step_sct_cd == "0" || page.com0201.step_sct_cd == "1"){
			if(page.sboxType == 'area'){
				var data={};
				data.base_ymd = page.com0201.base_ymd;
				data.step_sct_cd = page.com0201.step_sct_cd+"";
				data.cldl_sct_cd = page.com0201.cldl_sct_cd;
				data.cldl_tmsl_null = page.com0201.cldl_tmsl_null;
				data.sbox_type_cd = page.com0201.sbox_type_cd;
				page.mapAreaList2();            // 구역별 조회건수 조회
				page.locMapList2(data);
				$('.noList > #mapCon > div > div > div > div >.label.red > div').hide();
			} else{
				var data={};
				data.base_ymd = page.com0201.base_ymd;
				data.step_sct_cd = page.com0201.step_sct_cd+"";
				data.cldl_sct_cd = page.com0201.cldl_sct_cd;
				data.cldl_tmsl_null = page.com0201.cldl_tmsl_null;
				data.sbox_type_cd = page.com0201.sbox_type_cd;
				page.mapTmList2();
				page.locMapList2(data);
				$('.noList > #mapCon > div > div > div > div >.label.red > div').hide();
			}
		} else {
			var data={};
			data.base_ymd = page.com0201.base_ymd;
			data.step_sct_cd = page.com0201.step_sct_cd+"";
			data.cldl_sct_cd = "A"; //page.cldl_sct_cd
			data.cldl_tmsl_null = "true";
			data.sbox_type_cd = "";
			page.locMapList2(data);
			$('.noList > #mapCon > div > div > div > div >.label.silver > div').hide();
		}
	}	
		
	// 건수 기준 조회2
	,locMapList2:function(data){
		smutil.loadingOn();

//		page.com0201.base_ymd = "20200106"
		page.apiParam.param.baseUrl="smapis/cldl/locMapList";
		page.apiParam.param.callback="page.MapListCallback2";
		page.apiParam.data.parameters=data;

		// 공통 api호출 함수
		smutil.callApi(page.apiParam);
	}
	
	// 순서 기준 조회 콜백2
	,MapListCallback2:function(res){
		//var arr = res.data.list;
		page.datalist = res.data.list;
		try {
			if (res.data_count !== 0 && smutil.apiResValidChk(res) && res.code==="0000") {
				$(".NoBox").css("display","none");
				$("#mapCon").css("display","block");
				//page.writeMap(page.datalist);
				
				var arr = res.data.list;
				
				//집배달예정일때
				if(page.com0201.step_sct_cd == "3"){
					var bld_mgr_no = $('.noList > #mapCon > div > div > div > div >.label.silver > div');
	
					var arrArray = [];
					var bld_mgr_no_array = [];
					for(var f=0;f<arr.length;f++){
						console.log(arr[f].bld_mgr_no)
						arrArray.push(arr[f].bld_mgr_no)
					}
	
					arrArray.sort(function(a, b) {
					  return a - b;
					});
					console.log(arrArray);
					
					for(var i =0; i<bld_mgr_no.length;i++){
						console.log(bld_mgr_no[i].outerText);
						bld_mgr_no_array.push(bld_mgr_no[i].outerText);
					}
					bld_mgr_no_array.sort(function(a, b) {
					  return a - b;
					});
					console.log(bld_mgr_no_array);
	
					// 차집합(Difference) 목록에서 사라진 항목 찾아서 지도에서 제거하기
					console.log(bld_mgr_no_array.filter(x => !arrArray.includes(x)));
					var myArray3 = bld_mgr_no_array.filter(x => !arrArray.includes(x));
					console.log(myArray3)
					console.log(bld_mgr_no);
					for(var q=0;q<bld_mgr_no.length;q++){
						if(bld_mgr_no[q].outerText == myArray3){
							$(bld_mgr_no[q]).closest('.label.silver').remove();
						}
					}
				//집배달 출발,집배달완료	
				} else if(page.com0201.step_sct_cd == '1' || page.com0201.step_sct_cd == '0'){
				
					var bld_mgr_no = $('.noList > #mapCon > div > div > div > div >.label.red > div');
					var arrArray = [];
					var bld_mgr_no_array = [];
	
					for(var f=0;f<arr.length;f++){
						console.log(arr[f].bld_mgr_no)
						arrArray.push(arr[f].bld_mgr_no)
					}
	
					arrArray.sort(function(a, b) {
					  return a - b;
					});
					console.log(arrArray);
					
					for(var i =0; i<bld_mgr_no.length;i++){
						console.log(bld_mgr_no[i].outerText);
						bld_mgr_no_array.push(bld_mgr_no[i].outerText);
					}
					bld_mgr_no_array.sort(function(a, b) {
					  return a - b;
					});
					console.log(bld_mgr_no_array);
	
					// 차집합(Difference) 목록에서 사라진 항목 찾아서 지도에서 제거하기
					console.log(bld_mgr_no_array.filter(x => !arrArray.includes(x)));
					var myArray3 = bld_mgr_no_array.filter(x => !arrArray.includes(x));
					console.log(myArray3)
					console.log(bld_mgr_no);
					for(var q=0;q<bld_mgr_no.length;q++){
						if(bld_mgr_no[q].outerText == myArray3){
							$(bld_mgr_no[q]).closest('.label.red').remove();
						}
					}

				}
				
				
				//지도 집배달 출발 목록 조회 건수(전송시 알림용)
				if(page.com0201.step_sct_cd == "0") { //2023.04.10
					if(!smutil.isEmpty(res.data.listCnt)){
					var cnt = 0;
					$.each(res.data.listCnt, function(index, obj){
							if(smutil.isEmpty(obj.cldl_cnt)) {
								cnt = 0 ;
							}
							else{
								cnt = obj.cldl_cnt ;
							}
	
							$("#"+obj.cldl_sct_cd+"_com0201Cnt").text(cnt);
						});
					}
				}
			}else {
				$("#mapCon").css("display","none");
				$(".NoBox").css("display","block");
			}
		}
		catch (e) {}
		finally{
			smutil.loadingOff();
			
			/*if(page.isfirst) {				
				if(smutil.isEmpty(page.curLgtd)) {
					alert('GPS(핸드폰 위치 서비스) 설정 바랍니다.');
				}
			}*/
			page.isfirst = false;
		}
	}
	
	,mapTmList2:function(){
		var data = {};
		data.base_ymd=page.com0201.base_ymd;
		data.step_sct_cd=page.com0201.step_sct_cd+"";

		smutil.loadingOn();

		page.apiParam.param.baseUrl="smapis/cldl/mapTmList";
		page.apiParam.param.callback="page.mapTmListCallback2";
		page.apiParam.data.parameters=data;

		// 공통 api호출 함수
		smutil.callApi(page.apiParam);
	}
	,mapTmListCallback2:function(res){
		try {
			if (smutil.apiResValidChk(res) && res.code==="0000" && res.data_count > 0) {
				// 가져온 핸들바 템플릿 컴파일
				var template = Handlebars.compile($("#COM0201_list_template").html());
				
				$('#mapno').hide();
				$('#mapCon').show();

				$('#com0201LstUl').html(template(res.data));

//				$("#com0201LstUl").find("li:eq(0)").trigger("click");
			} else {
				/*var template = Handlebars.compile($("#com0201_list_template").html());
				$('#com0201LstUl').html(template(res.data));*/
				$('#mapno').show();
				$('#mapCon').hide();
				$('#com0201LstUl').html('');
				
			}
		}
		catch (e) {}
		finally{
			smutil.loadingOff();
			page.PublishCode();
		}
	}
	// ################### 구역별 조회건수 조회2 start
	, mapAreaList2 : function(){
		
		var data = {};
		data.base_ymd=page.com0201.base_ymd;
		data.cldl_sct_cd="A";
		data.step_sct_cd=page.com0201.step_sct_cd+"";

		smutil.loadingOn();

		page.apiParam.param.baseUrl="smapis/cldl/mapAreaList";
		page.apiParam.param.callback="page.mapAreaListCallback2";
		page.apiParam.data.parameters=data;

		// 공통 api호출 함수
		smutil.callApi(page.apiParam);
	},

	// 구역별 조회건수 callback
	mapAreaListCallback2 : function(result){
		page.apiParamInit();		// 파라메터 전역변수 초기화
		try {
			if (smutil.apiResValidChk(result) && result.code==="0000") {
				// 조회 결과 데이터가 있으면 옵션 생성
				if(result.data_count > 0){
					var data = result.data;
					
					//오름차순 정렬
					data.list.sort(function(a, b) {
						if(a.mbl_area == "기타"){
							return -1;
						}
						
						if(b.mbl_area == "기타"){
							return 1;
						}
						
						return 0;
					});

					// 핸들바 템플릿 가져오기
					var source = $("#COM0201_mblLst_template").html();
					
					// 핸들바 템플릿 컴파일
					var template = Handlebars.compile(source);

					// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
					var liHtml = template(data);

					// 생성된 HTML을 DOM에 주입
					$('#com0201LstUl').html(liHtml); //cmptTmListUl
					
					/* touchFlow 등록*/
					$(".divisionBox .selectBox").touchFlow();

//					$("#com0201LstUl").find("li:eq(0)").trigger("click");					
				}
				else{
					// 리스트가 아무것도 없을경우에는 기본으로 18~20 시 코드를 셋팅한다
					var data = {"list" : [{
						"mbl_area": "기타",
						"mbl_area_org": "기타",
						"alps_area":"ZZ",
						"min_nm": "18",
						"max_nm": "20",
						"cldl_tmsl_nm": "18~20시",
						"cldl_tmsl_cd": "19",
						"cnt" : 0,
						"cnt_p" : 0,
						"cnt_d" : 0,
						"min_tmsl" : "18",
						"max_tmsl" : "19"							
					}]};
					var source = $("#COM0201_mblLst_template").html(); 
					// 핸들바 템플릿 컴파일
					var template = Handlebars.compile(source);

					// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
					var liHtml = template(data);

					// 생성된 HTML을 DOM에 주입
					$('#com0201LstUl').html(liHtml);


					/* touchFlow 등록*/
					$(".divisionBox .selectBox").touchFlow();

					$('#mapno').show();
					$('#mapCon').hide();
				}
				
			}else {
				$('#mapno').show();
				$('#mapCon').hide();
				$('#com0201LstUl').html('');				
			}
		}
		catch (e) {}
		finally{
			smutil.loadingOff();
		}
	}
	// ################### 구역별 조회건수 조회2 end
	
};
