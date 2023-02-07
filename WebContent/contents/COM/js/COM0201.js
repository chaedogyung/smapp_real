var page = {
	curLocation : null,			// 자기위치
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
		

		//하단 운송장정보탭 헤드(전체선택, 인수자 저장버튼)
		if(page.com0201.step_sct_cd == '1' || page.com0201.step_sct_cd == '2'){
			$('#tabChkDetailP').show();
			$('#tabChkDetailD').hide();
		}
		else{
			$('.tabChkbox').hide();
		} 
		
		/* 체크박스 전체선택 */
		$("#checkallD").click(function(){
			if($("#checkallD").prop("checked")){
				$("input[name=chkInvD]").prop("checked",true);
			}else{
				$("input[name=chkInvD]").prop("checked",false);
			}
		});
		
		/* 체크박스 전체선택 */
		$("#checkallP").click(function(){
			if($("#checkallP").prop("checked")){
				$("input[name=chkInvP]").prop("checked",true);
			}else{
				$("input[name=chkInvP]").prop("checked",false);
			}
		});
		
		//하단 운송장정보탭
		$(".tabInvBtn").click(function(){
			var cldl_sct_cd = $(this).data('invSctCd');		// 선택한 탭의 값 (A,P,D)
			// 텝에따라 업무구분 선택박스 처리
			if(cldl_sct_cd == 'D'){
				$('#invDetailP').hide();
				$('#invDetailD').show();
				
				if(page.com0201.step_sct_cd == '1' || page.com0201.step_sct_cd == '2'){
					$('#tabChkDetailP').hide();
					$('#tabChkDetailD').show();
				}
			}
			else{
				$('#invDetailP').show();
				$('#invDetailD').hide();
				
				if(page.com0201.step_sct_cd == '1' || page.com0201.step_sct_cd == '2'){
					$('#tabChkDetailP').show();
					$('#tabChkDetailD').hide();
				}
			}


		 	// 운송장보기 집하 배달 탭 표시처리
			var btnLst = $(".tabInvBtn");
			var btnObj;
			_.forEach(btnLst, function(obj, key) {
				btnObj = $(obj);
				if(cldl_sct_cd == btnObj.data('invSctCd')){
					btnObj.closest('li').addClass( 'on' );
				}
				else{
					btnObj.closest('li').removeClass( 'on' );
				}
			});
		
		});
		
		/* 제스처 */
		var thisN = ".baedalListBox .txtBox .invListBox  > ul > li > .baedalBox"; //.tabInvDetail > ul > li > .baedalBox
		var thisW = 0;
		var thisC = 0;
		var thisPid = "";
		$(document).on("click, touchstart", thisN,function(e){
			$(thisN).swipe({
				triggerClick:false,
				preventDefault:false,
				onStart:function(onThis){
					thisC = $(onThis).parent().index();
					thisW = $(onThis).parent().find(".btnBox").width();
					thisPid = $(onThis).parent().attr("id");
				},
				swipeRight:function(){
					$(thisN).animate({left:0},250,'easeOutCubic');
					//$(thisN).parent().parent().children().eq(thisC).children(".baedalBox").stop().animate({left:thisW},400,'easeOutQuart');
					$("#"+thisPid).children(".baedalBox").stop().animate({left:thisW},400,'easeOutQuart');
				},
				swipeLeft:function(){
					$(thisN).animate({left:0});
				}
			});
		});
		$(thisN).trigger("click");
		/* //제스쳐 */


		// 송장번호 누른경우 (상세보기 연결)
		$(document).on('click', '.invNoSpan', function(event){
			if ($(event.target).parents('li').length > 0) {

				var liElement = $(event.target);
				$('.baedalBox').removeClass('bg-v2');									// 다른 row 선택초기화
				liElement.parents('.baedalBox').addClass('bg-v2');						// row 선택 표시
				var sctCd = liElement.parents('li').data('liSctCd');		// 업무 구분

				if(!smutil.isEmpty(sctCd)){

					var inv_no = liElement.parents('li').data('invNo')+"";				// 송장번호
					var rsrv_mgr_no = liElement.parents('li').data('rsrvMgrNo')+"";		// 접수번호

					// 팝업 url 호출
					var popUrl;

					if(sctCd == "P"){		// 집하 팝업

						popUrl = smutil.getMenuProp('CLDL.CLDL0202', 'url');

						LEMP.Window.open({
							"_sPagePath":popUrl,
							"_oMessage" : {
								"param" : {
									"inv_no" : inv_no+"",
									"rsrv_mgr_no" : rsrv_mgr_no
								}
							}
						});
					}
					else if(sctCd == "D"){		// 배달 팝업

						popUrl = smutil.getMenuProp('CLDL.CLDL0203', 'url');

						LEMP.Window.open({
							"_sPagePath":popUrl,
							"_oMessage" : {
								"param" : {
									"inv_no" : inv_no+"",
									"rsrv_mgr_no" : rsrv_mgr_no
								}
							}
						});

					}
				}
			}
		});		


		// 스와이프해서  통화버튼 클릭
		$(document).on('click', '.btn.blue.bdM.bdPhone', function(e){
			var phoneNumberTxt = $(this).data('phoneNumber');
			// 전화걸기 팝업 호출
			$('#popPhoneTxt').text(phoneNumberTxt);
			$('.mpopBox.phone').bPopup();

		});
		
		// 스와이프해서 서명 싸인패드 호출
		$(document).on('click', '.btn.blue2.bdM.bdSign.mgl1', function(e){
			var inv_no = $(this).data('invNo')+"";alert('서명 싸인패드 기능 준비중');

			/*if(_this.chkScanYn(inv_no)){
				_this.signInvNo = inv_no;
				var date = new Date();
				var curTime = date.LPToFormatDate("yyyymmddHHnnss");
				var fileFullPath = "{external}/LEMP/"+inv_no+"_sign_"+curTime+".jpg";
				smutil.callSignPad(fileFullPath, page.cmptSignRgst);

			}
			else{
				LEMP.Window.toast({
					"_sMessage":"스캔후 가능합니다.",
					'_sDuration' : 'short'
				});
			}*/

		});

		// 기사메모 팝업 호출
		$(document).on('click', '.btn.bdM.blue4.bdMemo.mgl1', function(e){
			var inv_no = $(this).data('invNo')+"";				// 송장번호

			if(smutil.isEmpty(inv_no)){
				LEMP.Window.toast({
					"_sMessage":"송장번호가 없습니다.\n관리자에게 문의해주세요.",
					'_sDuration' : 'short'
				});

				return false;
			}
				
//			// 스캔된 데이터만 메모 가능
//			if(_this.chkScanYn(inv_no)){
				// 기사 메모 팝업 호출
				var popUrl = smutil.getMenuProp('CLDL.CLDL0204', 'url');

				LEMP.Window.open({
					"_sPagePath":popUrl,
					"_oMessage" : {
						"param" : {
							"inv_no" : inv_no+""
						}
					}
				});

		});

		// 미배달 처리
		$(document).on('click', '.btn.blue5.bdM.bdCancle.mgl1', function(e){
			var inv_no = $(this).data('invNo');

			if(!smutil.isEmpty(inv_no)){
				// 스캔된 데이터만 미배달 처리 가능
//				if(_this.chkScanYn(inv_no)){
					var popUrl = smutil.getMenuProp("COM.COM0701","url");

					LEMP.Window.open({
						"_sPagePath":popUrl,
						"_oMessage" : {
							"param" : {
								"menu_id":"COM0201"
								, "inv_no":inv_no+""
								, "cldl_sct_cd" : "D"
							}
						}
					});
			}
		});

		// 스와이프해서 스캔버튼 클릭한 경우
		$(document).on('click', '.btn.blue6.bdM.bdScan.mgl1', function(e){
			alert('scan 기능 준비중입니다.');
			var inv_no = $(this).data('invNo');
			inv_no = inv_no+"";
			
			if(!smutil.isEmpty(inv_no)){
				inv_no = inv_no.split('-').join('');
				var result = {"barcode" : inv_no};
				//page.scanCallback(result);
			}
			else{
				LEMP.Window.toast({
					"_sMessage":"송장번호가 없습니다.",
					'_sDuration' : 'short'
				});

				return false;
			}
		});
		
		// 스와이프해서 이동경로버튼 클릭한 경우
		$(document).on('click', '.btn.blue7.bdM.bdRoute.mgl1', function(e){
			alert('이동경로 기능 준비중입니다.');
			var inv_no = $(this).data('invNo');
			inv_no = inv_no+"";
			
			if(!smutil.isEmpty(inv_no)){
				inv_no = inv_no.split('-').join('');
				var result = {"barcode" : inv_no};
				//page.scanCallback(result);
			}
			else{
				LEMP.Window.toast({
					"_sMessage":"송장번호가 없습니다.",
					'_sDuration' : 'short'
				});

				return false;
			}
		});		
		
		
		// ###################################### handlebars helper 등록 start		
		// check박스 필요여부 잽배완료,배달완료시 true
		Handlebars.registerHelper('isChk', function(options) {
			if(page.com0201.step_sct_cd == '1' || page.com0201.step_sct_cd == '2'){
				return options.fn(this)
			}
			else{	
				return options.inverse(this);
			}
		});
		
		Handlebars.registerHelper('cldlSctNm', function(options) {
			var result = "";
			if(this.cldl_sct_cd === "P"){	// 집하
				return '집하';
			}
			else{	// 배달
				return '배달';
			}
		});		
		
		// 기사 메모가 있는지 없는지 if else
		Handlebars.registerHelper('prcsMemoYn', function(options) {
			if(!smutil.isEmpty(this.prcs_memo)){	// 메모있음 if true
				return options.fn(this);
			}
			else{	// 메모없음 else
				return options.inverse(this);
			}
		});
		
		// 송장번호 형식 표시
		Handlebars.registerHelper('invNoTmpl', function(options) {
			if(!smutil.isEmpty(this.inv_no)){
				return (this.inv_no).replace(/([0-9]{4})([0-9]{4})([0-9]{4})/,"$1-$2-$3");
			}
			else{
				return "송장번호 없음";
			}
		});
		
		// 전화번호가 있으면 전화걸기 버튼 리턴하고 없으면 버튼 리턴 안함 (집하 = 보낸사람, 배달 = 받는사람)
		Handlebars.registerHelper('setPhoneNumber', function(options) {
			var telNum;
			var acper_tel = smutil.nullToValue(this.acper_tel,"");
			var acper_cpno = smutil.nullToValue(this.acper_cpno,"");

			telNum = page.getCpNo(acper_tel, acper_cpno);

			if(!smutil.isEmpty(telNum)){
				var html = '<button class="btn bdM blue bdPhone" data-phone-number="'+telNum+'">전화</button>';
				return new Handlebars.SafeString(html); // mark as already escaped
			}
			else{
				return '';
			}
		});		
		// ###################################### handlebars helper 등록 end
					
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
		/*obj.parent().find(".on").attr("class","");
		obj.attr("class","on");
		obj.parent().parent().find(".on").index()+1;*/

		data.cldl_tmsl_cd= $("#com0201LstUl").find(".on").find(".top").attr("id");
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
	
	//운송장정보로 같은위치의 운송장정모목록 조회
	,invDetailList:function(inv_no){
		var data = {};
		data.base_ymd=page.com0201.base_ymd;
		data.step_sct_cd=page.com0201.step_sct_cd;
		data.invNos = inv_no;
		data.cldl_sct_cd = "P";
		if ($("#invDetailP").css("display") == "none") {  //hide 
        	data.cldl_sct_cd = "D";
	    } else {
	        data.cldl_sct_cd = "P";
	    }

		smutil.loadingOn();		// 로딩바 열기
		
		page.apiParam.param.baseUrl = "smapis/cldl/invDetailList";
		page.apiParam.param.callback = "page.invDetailListCallback";
		page.apiParam.data.parameters = data;
		
		// 공통 api호출 함수 
		smutil.callApi(page.apiParam);
	}	

	//운송장정보로 같은위치의 운송장정모목록 조회 콜백
	,invDetailListCallback:function(res){

		if(page.com0201.step_sct_cd == '1' || page.com0201.step_sct_cd == '2'){
			$("#chkallD").prop("checked",false);
			$("#chkallP").prop("checked",false);
			$("input[name=chkInvP]").prop("checked",false);
			$("input[name=chkInvD]").prop("checked",false);
		}
		
		try {
			var template = Handlebars.compile($("#COM0201_listInvs_template").html());
			var templateD = Handlebars.compile($("#COM0201_listInvs_templateD").html());
				
			if (res.data_count !== 0 && smutil.apiResValidChk(res) && res.code==="0000") { 
				
				$('#com0201LstInvsUl').html(template(res.data));
				$('#com0201LstInvsUlD').html(templateD(res.data));				
			} else {
				/*var data = {};
				data.list = [];*/
				/*if(res.data_count == 0) {
				}*/ 
				$('#com0201LstInvsUl').html(template(res.data));
				$('#com0201LstInvsUlD').html(template(res.data));
			}
		}
		catch (e) {}
		finally{
			smutil.loadingOff();
		}
	}
		
	// 두 번호로 휴대폰 번호가 있는경우 휴대폰 번호를 리턴, 없으면 일반전화번호 리턴
	,getCpNo : function(phoneNum1, phoneNum2){
		var returnNum = "";

		// 둘다 핸드폰 번호가 아닌경우에는 phoneNum1 셋팅
		if(
			(
				!phoneNum1.LPStartsWith("010")
				&& !phoneNum1.LPStartsWith("011")
				&& !phoneNum1.LPStartsWith("016")
				&& !phoneNum1.LPStartsWith("017")
				&& !phoneNum1.LPStartsWith("050")
			) &&
			(
				!phoneNum2.LPStartsWith("010")
				&& !phoneNum2.LPStartsWith("011")
				&& !phoneNum2.LPStartsWith("016")
				&& !phoneNum2.LPStartsWith("017")
				&& !phoneNum2.LPStartsWith("050")
			)
		){
			returnNum = phoneNum1;
		}
		// phoneNum1 가 핸드폰 번호인경우 phoneNum1 셋팅
		else if(phoneNum1.LPStartsWith("010")
						|| phoneNum1.LPStartsWith("011")
						|| phoneNum1.LPStartsWith("016")
						|| phoneNum1.LPStartsWith("017")
						|| phoneNum1.LPStartsWith("050")
		){
			returnNum = phoneNum1;
		}
		else if(!smutil.isEmpty(phoneNum2)){
			returnNum = phoneNum2;
		}

		return returnNum;

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
		    var name = '<div class ="label curloc"><span>I</span></div>';
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
			} else if(page.com0201.step_sct_cd == "1" || page.com0201.step_sct_cd == "2") {
				if(arr[i].cmpt_ncnt !==0) content.classList.add('blue');  //미전송 , 미처리건 1건이라도 있으면 빨간색 표시
				else content.classList.add('red');	
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
					var inv_no = smutil.nullToValue((arr[mid].inv_no),"");
					if(!smutil.isEmpty(arr[mid].inv_nos)){
						page.invDetailList(arr[mid].inv_nos);		// 해당운송장으로 같은위치의 운송장목록정보상세조회	
					}
					
					var dCnt = smutil.nullToValue((arr[mid].cldl_p),0);
					var pCnt = smutil.nullToValue((arr[mid].cldl_d),0);
					
					$('#cldlPcnt').text('집하 '+dCnt+'건');
					$('#cldlDcnt').text('배달 '+pCnt+'건');
					//$('#invDetailD').html("<p class='txt2 tc'>"+ smutil.nullToValue((arr[mid].inv_dd),"")+"</p>");
				} 
				
				//클릭한 곳  배경색 변경 
				if(!$("#"+id).hasClass('on')) {
					$("#"+id).addClass('on');
					$("#"+id +" span").css('background-color', '#f8e2e2');
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
};
