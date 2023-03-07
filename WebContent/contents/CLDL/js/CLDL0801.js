LEMP.addEvent("backbutton", "page.callbackBackButton");		// 뒤로가기 버튼 클릭시 이벤트

var page = {
		step_sct_cd : "3",  // 집배달 예정 3 testdev
		base_ymd : null,
		dlvyCompl : null,			// 구역,시간 기준
		curLocation : null,			// 자기위치
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
			curDate = curDate.getFullYear() + ("0"+(curDate.getMonth()+1)).slice(-2) + ("0"+curDate.getDate()).slice(-2);
			//var base_ymd = smutil.nullToValue($('#cldlBtnCal').text(),curDate);
			page.base_ymd = curDate.split('.').join('');
			//$('#cldlBtnCal').text(curDate);
			
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
			
			// 상단 조회 탭 클릭
			$(".lstSchBtn").click(function(){
				var step_sct_cd = $(this).data('stepSctCd');		// 선택한 탭의 값 (0,1,3) step_sct_cd
				page.step_sct_cd = step_sct_cd;

				
				if(page.step_sct_cd == "0" || page.step_sct_cd == "1"){
					$(".popMap .mapCon").css({"margin-top": "17px"});
					$(".popMap .mapCon").css({"height": "77%"});	
				} else {
					$(".popMap .mapCon").css({"margin-top": "-63px"});
					$(".popMap .mapCon").css({"height": "86%"});
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
	
				//page.mapTmslCnt();
				page.mapSelectList();
				
			});

			var data={};
	
			//selectbox와 tab클릭시 실행 이벤트
			$(document).on("click",".selectBox > ul > li",function(){ //,.tabBox > ul > li
				data = page.cldl0801;
				page.ClickFunc($(this),data);
			});
			 
			//selectBox 그려주는 함수
			//page.mapTmslCnt();
			page.mapSelectList();
			
		}, //initEvent end
		
		// 화면 디스플레이 이벤트
		initDpEvent : function(){
			var _this = this;
			
			if(page.step_sct_cd == "0" || page.step_sct_cd == "1"){
				$(".popMap .mapCon").css({"margin-top": "17px"});
				$(".popMap .mapCon").css({"height": "77%"});	
			} else {
				$(".popMap .mapCon").css({"margin-top": "-63px"});
				$(".popMap .mapCon").css({"height": "86%"});
			}
				
		},  //initDpEvent end
		
		mapSelectList:function() {
			if(page.step_sct_cd == "0" || page.step_sct_cd == "1"){
				if(page.sboxType == 'area'){
					page.autoCmptTmList();            // 구역별 조회건수 조회
				} else{
					page.mapTmslCnt();
				}
			} else {
				var data={};
				data.base_ymd = page.base_ymd;
				data.step_sct_cd = page.step_sct_cd;
				data.cldl_sct_cd = "A"; //page.cldl_sct_cd 
				page.locMapList(data);
			}
		}
		,mapTmslCnt:function(){
			
			var data = {};
			data.base_ymd=page.base_ymd;
			data.step_sct_cd=page.step_sct_cd;
	
			smutil.loadingOn();
	
			page.apiParam.param.baseUrl="smapis/cldl/mapTmslCnt";
			page.apiParam.param.callback="page.mapTmslCntCallback";
			page.apiParam.data.parameters=data;
	
			// 공통 api호출 함수
			smutil.callApi(page.apiParam);
		}
		,mapTmslCntCallback:function(res){
			try {
				$('#cldl0801LstUl').html("");

				if (smutil.apiResValidChk(res) && res.code==="0000" && res.data_count > 0) {
					//오름차순 정렬
					res.data.list.sort(function(a, b) {
						return a.cldl_tmsl_nm < b.cldl_tmsl_nm ? -1 : a.cldl_tmsl_nm > b.cldl_tmsl_nm ? 1 : 0;
					});
					// 가져온 핸들바 템플릿 컴파일
					var template = Handlebars.compile($("#CLDL0801_list_template").html());
					// 핸들바 템플릿에 데이터를 바인딩해서 생성된 HTML을 DOM에 주입
					for (var i = 0; i < res.data.list.length; i++) {
						res.data.list[i].pick_total_cnt = res.data.list[i].pick_cnf_cnt+res.data.list[i].pick_ucnf_cnt;
						res.data.list[i].dlv_total_cnt = res.data.list[i].dlv_cnf_cnt+res.data.list[i].dlv_ucnf_cnt;
					}
					$('#mapno').hide();
					$('#mapCon').show();
	
					$('#cldl0801LstUl').append(template(res.data));
	
					$("#cldl0801LstUl").find("li:eq(0)").trigger("click");
					
				} else {
					var template = Handlebars.compile($("#CLDL0801_list_template").html());
					$('#cldl0801LstUl').html(template(res.data));
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
		, autoCmptTmList : function(){
			
			var data = {};
			data.base_ymd=page.base_ymd;
			data.cldl_sct_cd="A";
			data.step_sct_cd=page.step_sct_cd;
	
			smutil.loadingOn();
	
			page.apiParam.param.baseUrl="smapis/cldl/autoCmptTmList";
			page.apiParam.param.callback="page.autoCmptTmListCallback";
			page.apiParam.data.parameters=data;
	
			// 공통 api호출 함수
			smutil.callApi(page.apiParam);
		},

		// 구역별 조회건수 callback
		autoCmptTmListCallback : function(result){
			page.apiParamInit();		// 파라메터 전역변수 초기화

			// api 결과 성공여부 검사
			if(smutil.apiResValidChk(result) && result.code == "0000"){

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
						"min_nm": "18",
						"max_nm": "20",
						"cldl_tmsl_nm": "18~20시",
						"cldl_tmsl_cd": "19",
						"cnt" : 0
					}]};
					var source = $("#cldl0802_mblLst_template").html();
					
					// 핸들바 템플릿 컴파일
					var template = Handlebars.compile(source);

					// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
					var liHtml = template(data);

					// 생성된 HTML을 DOM에 주입
					$('#cldl0801LstUl').html(liHtml);


					/* touchFlow 등록*/
					$(".divisionBox .selectBox").touchFlow();

					/*// 현제 어느 시간데를 선택했는지 검사
					var timeLstLi = $("li[name='timeLstLi']");

					_.forEach(timeLstLi, function(obj, key) {
						$(obj).addClass('on');

						// 선택한 구역 등록
						page.mbl_dlv_area = $(obj).data('timecd')+"";
						// 한번만 셋팅하고 바로 루프 나감
						return false;
					});*/


					// 생성된 HTML을 DOM에 주입
//					$('#cmptTmListUl').html('');
				}

				//page.autoCmptList();		// 페이지 리스트 조회
			}
		}
		// ################### 구역별 조회건수 조회 end

		,ClickFunc : function(obj,data){
			obj.parent().find(".on").attr("class","");
			obj.attr("class","on");
			obj.parent().parent().find(".on").index()+1
			
			data.sbox_type = "";
			data.sbox_type_cd = obj.data('timecd');
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
				data.min_tmsl = smutil.nullToValue(obj.data('tmslmin'), "");
				data.max_tmsl = smutil.nullToValue(obj.data('tmslmax'), "");
				data.sbox_type_cd2 = smutil.nullToValue(obj.data('timecd2'), "");
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
	
			page.apiParam.param.baseUrl="smapis/cldl/locMapList";
			page.apiParam.param.callback="page.MapListCallback";
			page.apiParam.data.parameters=data;
	
			// 공통 api호출 함수
			smutil.callApi(page.apiParam);
		}		
			  
		// 기준 조회 콜백
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
 
		// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
		var zoomControl = new kakao.maps.ZoomControl();
		map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);


		// 마커들을 한 화면에 출력하기위해 맵 레벨 변경을 하기 위한 변수
		// 지도에서 표현 할 수 없는 좌표가 존재한다면 하얀 화면이 출력 될 수 있음
		var bounds = new kakao.maps.LatLngBounds();

		// 마커를 추가하는 반복문
		for (var i = 0; i < arr.length; i ++) {
			arr[i].latlng = new kakao.maps.LatLng(arr[i].lttd,arr[i].lgtd);

			var content;
			content = document.createElement('div'); 
			content.setAttribute('id','I'+i); 
			content.classList.add('label');
			var strCnt = arr[i].cldl_p + '/' + arr[i].cldl_d;
			if(page.step_sct_cd == "0") {
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
							"_sPagePath":popUrl,
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
		
		var imarkerPosition = page.curLocation;
		if(!imarkerPosition) {
			imarkerPosition = new kakao.maps.LatLng(37.5570572,126.9736211); //testdev
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
		
 		// 추가된 마커의 위치에 따라 맵의 표현범위가 확장
		map.setBounds(bounds);
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
	
	// 운송장목록 팝업창 닫을때 callback 함수
	, cldl0802Callback : function(res){

		page.mapSelectList();
	}	
};