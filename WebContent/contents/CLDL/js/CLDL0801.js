LEMP.addEvent("backbutton", "page.callbackBackButton");		// 뒤로가기 버튼 클릭시 이벤트

var page = {
		step_sct_cd : "3",  // 집배달 예정 3 testdev
		base_ymd : null,
		dlvyCompl : null,			// 구역,시간 기준
		curLocation : null,			// 자기위치
		curLgtd: null,
		curLttd: null,
		isfirst : true,		//첫로드시 관련
		isGpsLoad : false,	//gps찾고 로드중인지 시간지나서 로드중인지확인용. 첫 로드시 과련
		datalist : null,  //지도에 표시할 위도경도목록
		sboxType: null,			// 권역 or 시간별
		apiParam : {
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
		},	
		init:function(data)	{
			// 이전페이지에서 넘겨 받은 파라미터로 배달, 집하 구분하며 어떤 api를 호출 할지 결정
			//page.cldl0801= data.data.param;
			page.getLocation();
			
			// 날짜셋팅
			var curDate = new Date();
			curDate = curDate.getFullYear() + "." + ("0"+(curDate.getMonth()+1)).slice(-2) +"."+ ("0"+curDate.getDate()).slice(-2);
			page.base_ymd = curDate.split('.').join('');
			$('#cldlBtnCal').text(curDate);
			
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
	
			page.initEvent();			// 페이지 이벤트 등록
			page.initDpEvent();			// 화면 디스플레이 이벤트		
		}
		,PublishCode:function(){
			$(document).ready(function(){
				/* touchFlow */
				$(".divisionBox .selectBox").touchFlow();
			});
			/* //ready */
		}
		,cldl0801:{} 
		// 페이지 이벤트 등록
		,initEvent : function()
		{
			var _this = this;
			
			// 화면 상단의 화물추적 버튼을 누른경우
			$("#openFrePop").click(function(){
				var popUrl = smutil.getMenuProp("FRE.FRE0301","url");
	
				LEMP.Window.open({
					"_sPagePath":popUrl,
					"_oMessage":{
						"param":null
					}
				});
			});
			
			// 달력버튼을 누른경우 
			$("#cldlBtnCal").click(function(){

				var popUrl = smutil.getMenuProp("COM.COM0301","url");
				LEMP.Window.open({
					"_sPagePath":popUrl,
					"_oMessage":{
						"param":null
					}
				});

			});	// end 스캔버튼을 누른경우 종료
			
			// 상단 조회 탭 클릭
			$(".lstSchBtn").click(function(){
				var step_sct_cd = $(this).data('stepSctCd');		// 선택한 탭의 값 (0,1,3) step_sct_cd
				page.step_sct_cd = step_sct_cd;
				page.isfirst = false;

				
				if(page.step_sct_cd != "0"  && page.step_sct_cd != "1"){
					$(".popMap .mapCon").css({"top": "162px"});
					$(".popMap .mapCon").css({"height": "78%"});
					$(".popMap .divisionBox").hide();
					$("#setDlvyCom1").hide();
					$("#setDlvyCom2").hide();
				} else {
					$(".popMap .divisionBox").show();
					$("#setDlvyCom1").show();
					$("#setDlvyCom2").show();
					if(page.sboxType == "time") {
						$(".popMap .mapCon").css({"top": "231px"});
						$(".popMap .mapCon").css({"height": "69%"});
						
						$("#setDlvyCom1").text('시간');
	            		$("#setDlvyCom1").attr('class', 'green badge option outline');
					} else {
						$(".popMap .mapCon").css({"top": "253px"});
						$(".popMap .mapCon").css({"height": "66%"});
						
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
				}
				
				// 집하 배달 탭 표시처리
				var btnLst = $(".lstSchBtn");
				var btnObj;
				_.forEach(btnLst, function(obj, key) {
					btnObj = $(obj);
					if(step_sct_cd == btnObj.data('stepSctCd')){
						btnObj.closest('li').addClass( 'on' );
						$("#div"+key).show();
					}
					else{
						btnObj.closest('li').removeClass( 'on' );
						$("#div"+key).hide();
					}
				});
	
				//page.mapTmList();
				page.mapSelectList();
				
			});

			var data={};
	
			//selectbox와 tab클릭시 실행 이벤트
			$(document).on("click",".selectBox > ul > li",function(){ //,.tabBox > ul > li
				data = page.cldl0801;
				page.ClickFunc($(this),data);
			});
			 
			//selectBox 그려주는 함수
			//page.mapTmList();
			setTimeout(function() { //현재위치 찾을시간 주고 찾지못할경우 실행
				  if(!page.isGpsLoad) {
						page.mapSelectList();
					}
				}, 3000);
			
		}, //initEvent end
		
		// 화면 디스플레이 이벤트
		initDpEvent : function(){
			var _this = this;
			
			$(".popMap .mapCon").css({"top": "162px"});
			$(".popMap .mapCon").css({"height": "78%"});
				
		},  //initDpEvent end
		
		mapSelectList:function() {
			if(page.step_sct_cd == "0" || page.step_sct_cd == "1"){
				if(page.sboxType == 'area'){
					page.mapAreaList();            // 구역별 조회건수 조회
				} else{
					page.mapTmList();
				}
			} else {
				var data={};
				data.base_ymd = page.base_ymd;
				data.step_sct_cd = page.step_sct_cd;
				data.cldl_sct_cd = "A";
				data.cldl_tmsl_null = "true";
				data.sbox_type_cd = ""; 
				page.locMapList(data);
				$('#cldl0801LstUl').html('');
			}
		}
		,mapTmList:function(){
			
			var data = {};
			data.base_ymd=page.base_ymd;
			data.step_sct_cd=page.step_sct_cd;
	
			smutil.loadingOn();
	
			page.apiParam.param.baseUrl="smapis/cldl/mapTmList";
			page.apiParam.param.callback="page.mapTmListCallback";
			page.apiParam.data.parameters=data;
	
			// 공통 api호출 함수
			smutil.callApi(page.apiParam);
		}
		,mapTmListCallback:function(res){
			try {
				$('#cldl0801LstUl').html("");

				if (smutil.apiResValidChk(res) && res.code==="0000" && res.data_count > 0) {
					// 가져온 핸들바 템플릿 컴파일
					var template = Handlebars.compile($("#CLDL0801_list_template").html());
					
					$('#mapno').hide();
					$('#mapCon').show();
	
					$('#cldl0801LstUl').html(template(res.data));
	
					$("#cldl0801LstUl").find("li:eq(0)").trigger("click");
					
				} else {
					/*var template = Handlebars.compile($("#CLDL0801_list_template").html());
					$('#cldl0801LstUl').html(template(res.data));*/
					$('#mapno').show();
					$('#mapCon').hide();
				}
			}
			catch (e) {}
			finally{
				smutil.loadingOff();
				page.PublishCode();
			}
		}
		
		// ################### 구역별 조회건수 조회 start
		, mapAreaList : function(){
			
			var data = {};
			data.base_ymd=page.base_ymd;
			data.cldl_sct_cd="A";
			data.step_sct_cd=page.step_sct_cd;
	
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
						var source = $("#CLDL0801_mblLst_template").html();
						
						// 핸들바 템플릿 컴파일
						var template = Handlebars.compile(source);
	
						// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
						var liHtml = template(data);
	
						// 생성된 HTML을 DOM에 주입
						$('#cldl0801LstUl').html(liHtml); //cmptTmListUl
						
						/* touchFlow 등록*/
						$(".divisionBox .selectBox").touchFlow();
	
						$("#cldl0801LstUl").find("li:eq(0)").trigger("click");					
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
							"tmsl_pick_cnt" : 0,
							"tmsl_dlv_cnt" : 0,
							"min_tmsl" : "18",
							"max_tmsl" : "19"							
						}]};
						var source = $("#CLDL0801_mblLst_template").html(); 
						// 핸들바 템플릿 컴파일
						var template = Handlebars.compile(source);
	
						// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
						var liHtml = template(data);
	
						// 생성된 HTML을 DOM에 주입
						$('#cldl0801LstUl').html(liHtml);
	
	
						/* touchFlow 등록*/
						$(".divisionBox .selectBox").touchFlow();
	
						$('#mapno').show();
						$('#mapCon').hide();
					}
					
				}else {
					$('#mapno').show();
					$('#mapCon').hide();				
				}
			}
			catch (e) {}
			finally{
				smutil.loadingOff();
			}
			
		}
		// ################### 구역별 조회건수 조회 end

		,ClickFunc : function(obj,data){
			obj.parent().find(".on").attr("class","");
			obj.attr("class","on");
			obj.parent().parent().find(".on").index()+1
			
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

			if(page.sboxType == 'area' && page.step_sct_cd != "3"){
				data.sbox_type = "area";
				data.min_tmsl = smutil.nullToValue(obj.data('tmslmin'), "") + "";
				data.max_tmsl = smutil.nullToValue(obj.data('tmslmax'), "") + "";
				data.sbox_type_cd2 = smutil.nullToValue(obj.data('timecd2'), "") + "";
			}else{
				data.sbox_type = "time";
			}

			data.base_ymd = page.base_ymd;
			data.step_sct_cd = page.step_sct_cd;
			data.cldl_sct_cd = "A"; //page.cldl_sct_cd 
			
			page.cldl0801 = data;
			page.cldl0801.max_nm = smutil.nullToValue(obj.data('maxnm'), "");
			page.cldl0801.pick_tmsl_nm = smutil.nullToValue(obj.data('timenm'), "");
			

			page.locMapList(data);
			
			/*if ($(".tabBox").find(".on").index()==0) {
				page.locMapList(data);
			}else {
				page.mapList(data);
			}
			//page.pick_tmsl_nm = $("li[name='timeLstLi'].on").data('timenm');
			//data.cldl_tmsl_cd= $("#cldl0801LstUl").find(".on").find(".top").attr("id");
			*/
		}
		// 건수 기준 조회
		,locMapList:function(data){
			smutil.loadingOn();
	
			page.datalist = null;
			page.apiParam.param.baseUrl="smapis/cldl/locMapList";
			page.apiParam.param.callback="page.MapListCallback";
			page.apiParam.data.parameters=data;
	
			// 공통 api호출 함수
			smutil.callApi(page.apiParam);
		}		
			  
		// 기준 조회 콜백
		,MapListCallback:function(res){
			//var arr = res.data.list;
			page.datalist = res.data.list;
			try {
				if (res.data_count !== 0 && smutil.apiResValidChk(res) && res.code==="0000") {
					$(".NoBox").css("display","none");
					$("#mapCon").css("display","block");
					page.writeMap(page.datalist);
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
		//현재위치 찾기
		,getLocation:function() {
			
			//if(navigator.geolocation) { //GPS 지원여부
				navigator.geolocation.getCurrentPosition(function(position) {
					page.curLocation = new kakao.maps.LatLng(position.coords.latitude,position.coords.longitude);
					//console.log('curlat: ' + position.coords.latitude + ' lon:' + position.coords.longitude);
					page.isGpsLoad = true;
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
					//console.error(error);
					//alert('GPS권한이 필요합니다.');
				}, {
					enableHighAccuracy : false,//배터리를 더 소모해서 더 정확한 위치를 찾음
					maximumAge: 0, //한 번 찾은 위치 정보를 해당 초만큼 캐싱
					timeout: 4000//Infinity //주어진 초 안에 찾지 못하면 에러 발생
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
 
		// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
		var zoomControl = new kakao.maps.ZoomControl();
		map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);


		// 마커들을 한 화면에 출력하기위해 맵 레벨 변경을 하기 위한 변수
		// 지도에서 표현 할 수 없는 좌표가 존재한다면 하얀 화면이 출력 될 수 있음
		var bounds = new kakao.maps.LatLngBounds();

		var imarkerPosition = page.curLocation;
		/*if(!imarkerPosition) {
			imarkerPosition = new kakao.maps.LatLng(37.5570572,126.9736211); //testdev
		}*/

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
			if(page.step_sct_cd == "0" || page.step_sct_cd == "1") {
				content.classList.add('red');	
			} else {
				content.classList.add('silver');	
			}
			
			 
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

						var cldl_sct_cd = "P";
						if(arr[mid].cldl_p == 0) cldl_sct_cd = "D";
						
						var paramdata = {};
						paramdata.bld_mgr_no = arr[mid].bld_mgr_no;
						paramdata.base_ymd=page.base_ymd;
						paramdata.step_sct_cd=page.step_sct_cd;
						paramdata.cldl_sct_cd = cldl_sct_cd;
						paramdata.ep = arr[mid].lttd+ "," +arr[mid].lgtd;
						
						paramdata.lttd = arr[mid].lttd;
						paramdata.lgtd = arr[mid].lgtd;
						paramdata.curlgtd = page.curLgtd;
						paramdata.curlttd = page.curLttd;

						if(page.step_sct_cd == "0" || page.step_sct_cd == "1") {
							paramdata.sbox_type = page.cldl0801.sbox_type;
							paramdata.sbox_type_cd = page.cldl0801.sbox_type_cd;
							paramdata.sbox_type_cd2 = page.cldl0801.sbox_type_cd2;
							paramdata.cldl_tmsl_null = page.cldl0801.cldl_tmsl_null;
							paramdata.max_tmsl = page.cldl0801.max_tmsl;
							paramdata.min_tmsl = page.cldl0801.min_tmsl;
							paramdata.max_nm = page.cldl0801.max_nm;
							paramdata.cldl_tmsl_nm = page.cldl0801.pick_tmsl_nm;
						}

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
	//com0301에서 날짜 선택 한 후 실행되는 콜백 함수
	, COM0301Callback:function(res){
		$("#cldlBtnCal").text(res.param.date);
		page.base_ymd = (res.param.date).split('.').join('');
		page.mapSelectList();
	}
	
	// 운송장목록 팝업창 닫을때 callback 함수
	, cldl0802Callback : function(res){
		if(!smutil.isEmpty(res.param.step_sct_cd)) {
			page.step_sct_cd = res.param.step_sct_cd + "";
			page.mapSelectList();
		}
	}	
};
