'use strict';


/**
 * smUtil Functions
 * @returns {Object}
 */
var smutil = (function(window, document, $) {

	var userAgent = navigator.userAgent.toLowerCase();	// userAgent 값 얻기
	var deviceInfo = null;								// 디바이스 정보
	var eventNm = "click";

	if ( userAgent.indexOf('smapp') > -1) {
		deviceInfo = "smapp";
	}
	else if ( userAgent.indexOf('smandroid') > -1) {		// android
		deviceInfo = "smandroid";
	}
	else if ( userAgent.indexOf('smios') > -1) {		// ios
		deviceInfo = "smios";
		eventNm = "touchstart";
		$('*').css('cursor', 'pointer');			// ios 인 경우 모든 css에 터치할수있는 속성 추가
	}
	else {	//웹
		deviceInfo = "other";
	}

	// 메뉴정보 셋팅
	var menuJson = menuJsonJs;

	// api 관련
	var apiUrl = "https://devsmapis.llogis.com";		// 개발 api url
	// ###################################################### end properties
//	var apiUrl = "http://localhost:8700";

	// ###################################################### add global event start

	// 사이드 메뉴 열기 전역 이벤트 등록
	$(document).on("click",".btn.topM",function(){
		LEMP.SideView.show({
			"_sPosition" : "left",  // or right
			"_oMessage" : {
				"param" : ""
			}
		});

	});

	// 페이지 뒤로가기 전역 이벤트 등록
	$(document).on("click",".btn.back",function(){
		LEMP.Window.close({
			"_oMessage" : {
				"param" : ""
			}
		});
	});


	// 집배달 상세화면에서 송장번호를 클릭하면 화물추적화면으로 이동
	$(document).on("click",".btn.barcodeSmall.fr",function(){
		var invNo = $(this).data("invNo")+"";
		if (!smutil.isEmpty($(this).data("invNo")) && invNo.replace(/\-/g,"").length===12) {
			var popUrl = smutil.getMenuProp("FRE.FRE0301","url");
			LEMP.Window.open({
				"_sPagePath":popUrl,
				"_oMessage":{
					"param":{
						"inv_no":invNo.replace(/\-/g,""),
						"menuId":smutil.nullToValue($("#menuId").val(),'none_menuId')
					}
				}
			});
		}else {
			LEMP.Window.alert({
				"_sTitle" : "화물추적",
				"_vMessage" : "송장번호가 없습니다"
			});
		}
	});



	// ###################################################### add global event end


	// app 로그아웃처리
	var logout = function(){

		// 저장되어있던 토큰 삭제
		LEMP.Properties.remove({_sKey:"accessToken"});

		// ios 기기인경우는 사용자 인증정보도 함께 삭제
		if(smutil.deviceInfo === "smios"){
			// 사용자 인증정보 삭제
			LEMP.Properties.remove({_sKey:"authCertInfo"});
		}


		LEMP.App.exit({
			"_sType" : "logout"
		});

	}


	// 넘어온 값이 빈값인지 체크합니다.
	// !value 하면 생기는 논리적 오류를 제거하기 위해
	// 명시적으로 value == 사용
	// [], {} 도 빈값으로 처리
	var isEmpty = function(value){
		if( //$.trim(value) == ""
			value === ""
			|| value === "null"
			|| value === "undefined"
			|| value === null
			|| value === undefined
			|| ( value !== null && typeof value === "object" && !Object.keys(value).length )
		){
			return true;
		}else{
			return false;
		}
	};


	var nullToValue = function(value, defaultStr){
		if(smutil.isEmpty(value)){
			return defaultStr;
		}
		else{
			return value;
		}
	}


	// 개발용 ajax 통신 공통
	var ajaxApiCall = function(apiParam){

		var result;

		// 통신 호출
		$.ajax({
//			'headers': {"Authorization": token},		/** TO-DO 나중에는 꼭 토큰이 있는 서비스로 가야함**/
			'url': apiParam.param.baseUrl,
			'type': apiParam.param.method ,
			'async' : false,								// 비동기 방식 (api 팀과 협의후 비동기로 고정하기로함)
			'contentType' : apiParam.param.contentType,		// 보내는 방식 (json or multipart)
			'datatype': 'json',								// 서버 리턴타입은 json 으로 고정
			'data': JSON.stringify(apiParam.data)			// 전송 파라메터
		})
		.done(function (data) {
			data.statusCode = "200";
			result = data;
		})
		.fail(function (jqXHR, textStatus, errorThrown) {
			result = {"code" : "9999", "message" : textStatus};
			LEMP.Window.alert({
				"_sTitle" : "통신 호출 오류",
				"_vMessage" : "서버와 통신중 오류가 발생했습니다.\n잠시후 다시 시도해 주세요."
			});

			smutil.loadingOff();
		});

		return result;

	}		// end ajaxApiCall
	
	




	// native 통신 공통
	var nativeApiCall = function(apiParam){

		// 필수사항 체크(id)
		if(smutil.isEmpty(apiParam.id)){
			LEMP.Window.alert({
				"_sTitle" : "api 호출오류",
				"_vMessage" : "호출 필수값이 없습니다.(id)"
			});

			return false;
		}
		// 필수사항 체크(apiNo)
		if(smutil.isEmpty(apiParam.param.baseUrl)){
			LEMP.Window.alert({
				"_sTitle" : "디바이스 호출오류",
				"_vMessage" : "호출 필수값이 없습니다.(apiNo)"
			});

			return false;
		}


		// ios 일경우 파라메터를 다른형식으로 셋팅
		if(deviceInfo == "smios"){
			var globalIosApiParam = {
				param:{													// 디바이스가 알아야할 데이터
					id:"",												// 디바이스 콜 id
					task_id : "",										// 화면 ID 코드가 들어가기로함
					//position : {},									// 사용여부 미확정
					type : "",
					baseUrl : "",
					method : "POST",									// api 호출 형식(지정 안하면 'POST' 로 자동 셋팅)
					callback : "",										// api 호출후 callback function
					contentType : "application/json; charset=utf-8",
					data:{				// api 통신용 파라메터
						"parameters" : {}
					},
					files : null
				}
			};

			// ios 는 파라메터 형식이 다르기 때문에 신규로 만든다.
			if(!smutil.isEmpty(apiParam.param)){
				globalIosApiParam.param = apiParam.param;
			}

			if(!smutil.isEmpty(apiParam.id)){
				globalIosApiParam.id = apiParam.id;
			}

			if(!smutil.isEmpty(apiParam.data)){
				globalIosApiParam.param.data = apiParam.data;
			}

			// 메뉴 id 셋팅
			globalIosApiParam.param.task_id = smutil.nullToValue($("#menuId").val(),'none_menuId');

			if(!smutil.isEmpty(apiParam.param)
					&& !smutil.isEmpty(apiParam.param.baseUrl)){
				if(apiParam.param.baseUrl.indexOf('/') != 0){
					globalIosApiParam.param.baseUrl = "/" + apiParam.param.baseUrl;
				}
				else{
					globalIosApiParam.param.baseUrl = apiParam.param.baseUrl;
				}
			}

			if(!smutil.isEmpty(apiParam.files)){
				globalIosApiParam.param.files = apiParam.files;
			}

			LEMPCore.Module.gateway(globalIosApiParam, "window" , "");
		}
		else{
			// app 이 백그라운드 상태이면
			if(!smutil.isEmpty(apiParam['isBackground'])
					&& apiParam.isBackground){
				LEMPCore.Module.backGroundGateway(apiParam, "window" , "");
			}
			else { // app 이 포그라운드 상태
				LEMPCore.Module.gateway(apiParam, "window" , "");
			}
		}

	};





	// native 기능 호출함수
	var nativeMothodCall = function(methodParam){

		// 필수값 확인
		if(smutil.isEmpty(methodParam.id)){
			LEMP.Window.alert({
				"_sTitle" : "디바이스 호출오류",
				"_vMessage" : "호출 필수값이 없습니다.(id)"
			});

			return false;
		}

		// ios 일경우 파라메터를 다른형식으로 셋팅
		if(deviceInfo == "smios"){

			var globalIosMethodParam = {
				param:{													// 디바이스가 알아야할 데이터
					id:"",												// 디바이스 콜 id
					task_id : "",										// 화면 ID 코드가 들어가기로함
					//position : {},									// 사용여부 미확정
					type : "",
					baseUrl : "",
					method : "POST",									// api 호출 형식(지정 안하면 'POST' 로 자동 셋팅)
					callback : "",										// api 호출후 callback function
					contentType : "application/json; charset=utf-8",
					data:{				// api 통신용 파라메터
						"parameters" : {}
					},
					files : null
				}
			};

			// ios 는 파라메터 형식이 다르기 때문에 신규로 만든다.
			if(!smutil.isEmpty(methodParam.param)){
				globalIosMethodParam.param = methodParam.param;
			}

			if(!smutil.isEmpty(methodParam.id)){
				globalIosMethodParam.id = methodParam.id;
			}

			if(!smutil.isEmpty(methodParam.data)){
				globalIosMethodParam.param.data = methodParam.data;
			}

			// 메뉴 id 셋팅
			globalIosMethodParam.param.task_id = smutil.nullToValue($("#menuId").val(),'none_menuId');
			if(!smutil.isEmpty(methodParam.param)
					&& !smutil.isEmpty(methodParam.param.baseUrl)){

				if(methodParam.param.baseUrl.indexOf('/') != 0){
					globalIosMethodParam.param.baseUrl = "/" + methodParam.param.baseUrl;
				}
				else{
					globalIosMethodParam.param.baseUrl = methodParam.param.baseUrl;
				}
			}

			if(!smutil.isEmpty(methodParam.files)){
				globalIosMethodParam.param.files = methodParam.files;
			}

			LEMPCore.Module.gateway(globalIosMethodParam, "window" , "");
		}
		else{

			// api 호출 기본 형식
			var globalApiParam = {
				id:"",													// 디바이스 콜 id
				param:{													// 디바이스가 알아야할 데이터
					task_id : "",										// 화면 ID 코드가 들어가기로함
					//position : {},									// 사용여부 미확정
					type : "",
					baseUrl : "",
					method : "POST",									// api 호출 형식(지정 안하면 'POST' 로 자동 셋팅)
					callback : "",										// api 호출후 callback function
					contentType : "application/json; charset=utf-8"
				},
				data:{				// api 통신용 파라메터
					"parameters" : {}
				}
			};


			// 파라메터 머지
			globalApiParam = $.extend(true, {}, globalApiParam, methodParam);


			// app 이 백그라운드 상태이면
			if(!smutil.isEmpty(globalApiParam['isBackground'])
					&& globalApiParam.isBackground){
				LEMPCore.Module.backGroundGateway(globalApiParam, "window" , "");
			}
			else { // app 이 포그라운드 상태
				LEMPCore.Module.gateway(globalApiParam, "window" , "");
			}
		}

	};




	// aip 결과값 성공 실패 처리 (9999 와 timeout 값만 실패처리하고 나머지 실패들은 코드 그대로 리턴)
	var apiResValidChk = function(apiRes){
		var statusCode = smutil.nullToValue((apiRes.statusCode+""),"");
		var code = smutil.nullToValue((apiRes.code+""),"");
		var message = smutil.nullToValue((apiRes.message),"");

		if(smutil.isEmpty(apiRes)){
			LEMP.Window.alert({
				"_sTitle" : "데이터 처리 오류",
				"_vMessage" : "데이터처리중 오류가 발생했습니다.\n데이터처리 결과값이 없으니\n담당자에게 문의해 주세요. "
			});

			smutil.loadingOff();

			return false;
		}
		else if(statusCode === '408' || code === '408'){
			LEMP.Window.alert({
				"_sTitle" : "네트워크 오류",
				"_vMessage" : "네트워크 상태가 불안합니다.\n잠시후 다시 시도해 주세요. "
			});

			smutil.loadingOff();

			return false;
		}
		// 사진 파일 전송 시 FileNotFound Error 일 경우
		else if(statusCode === '515' || code === '515') {
			LEMP.Window.alert({
				"_sTitle" : "사진파일 전송오류",
                "_vMessage" : smutil.nullToValue(message,'동일한 사진을 선택하셨거나, 갤러리 내에 선택한 사진 파일이 없습니다.\n사진을 다시 등록해 주세요.')
			});

			smutil.loadingOff();

			return false;
		}
		// 디바이스 네트워크 에러인경우는 로딩바만 종료해준다(디바이스 네트워크 체크시 오류인경우)
		else if(statusCode === 'native_network_error'){

			smutil.loadingOff();

			return false;
		}
		else if(statusCode === '9999'){		// api 실패
			LEMP.Window.alert({
				"_sTitle" : "데이터처리 오류 ",
				"_vMessage" : "데이터처리중 오류가 발생했습니다.\n연속해서 오류가 발생할경우 \n담당자에게 문의해 주세요."
			});

			smutil.loadingOff();

			return false;
		}
		else if((statusCode).LPStartsWith("5")){//서버 오류
			LEMP.Window.alert({
				"_sTitle" : "데이터처리 오류 ",
				"_vMessage" : smutil.nullToValue(message, "데이터처리중 오류가 발생했습니다.\n연속해서 오류가 발생할경우 \n담당자에게 문의해 주세요.")
			});

			smutil.loadingOff();

			return false;
		}
		// 성공코드가 넘어오지 안으면 에러처리
		else if(statusCode !== "200"
				|| (code !== '0000' && code !== '00')){

			LEMP.Window.alert({
				"_sTitle" : "데이터처리 오류 ",
				"_vMessage" : smutil.nullToValue(message,'네트워크 상태코드 : '+apiRes.statusCode)
			});

			smutil.loadingOff();

			return false;
		}
		else{		// 성공
			return apiRes;
		}
	}




	// 공통 api 호출 함수
	// api 호출을 로컬 브라우져에서 하고있을경우는 ajax 로 호출하고 전화기에서 호출하고있을경우에는 디바이스의 api 호출함수를 사용
	var callApi = function(commonParam){

		// 통신 필수값 체크
		// 디바이스 모듈 id
		if(smutil.isEmpty(commonParam.id)){
			LEMP.Window.alert({
				"_sTitle" : "통신 오류",
				"_vMessage" : "호출 필수값이 없습니다.(ID)"
			});

			return false;
		}

		// 통신 URL
		if(smutil.isEmpty(commonParam.param.baseUrl)){
			LEMP.Window.alert({
				"_sTitle" : "통신 오류",
				"_vMessage" : "호출 필수값이 없습니다.(apiNo)"
			});

			return false;
		}


		// api 호출 기본 형식
		var globalApiParam = {
			id:"",													// 디바이스 콜 id
			param:{													// 디바이스가 알아야할 데이터
				task_id : "",										// 화면 ID 코드가 들어가기로함
				//position : {},									// 사용여부 미확정
				type : "",
				baseUrl : "",
				method : "POST",									// api 호출 형식(지정 안하면 'POST' 로 자동 셋팅)
				callback : "",										// api 호출후 callback function
				contentType : "application/json; charset=utf-8"
			},
			data:{				// api 통신용 파라메터
				"parameters" : {}
			}
		};

		// 파라메터 머지
		var apiParam = $.extend(true, {}, globalApiParam, commonParam);

		// 메뉴 id 셋팅
		apiParam.param.task_id = smutil.nullToValue($("#menuId").val(),'none_menuId');

		// api를 호출하고있는 기기가 모바일 디바이스인경우 디바이스 함수 호출
		if(deviceInfo == "smapp"|| deviceInfo == "smandroid" || deviceInfo == "smios"){

			// api url 셋팅
			if(apiParam.param.baseUrl){

				if(apiParam.param.baseUrl.indexOf('/') != 0){
					apiParam.param.baseUrl = "/" + apiParam.param.baseUrl;
				}
				else{
					apiParam.param.baseUrl = apiParam.param.baseUrl;
				}
			}

			smutil.nativeApiCall(apiParam);
		}
		else{	// api를 호출하고 있는 기기가 웹 인 경우

			// api full url 셋팅
			if(apiParam.param.baseUrl){
				var apiFullUrl;

				if(apiParam.param.baseUrl.indexOf('/') == 0){
					apiFullUrl = apiUrl + apiParam.param.baseUrl;
				}
				else{
					apiFullUrl = apiUrl + "/" + apiParam.param.baseUrl;
				}

				apiParam.param.baseUrl = apiFullUrl;
			}

			smutil.apiResult = smutil.ajaxApiCall(apiParam);

			// function 호출
			var fnstring = apiParam.param.callback;

			if(!smutil.isEmpty(fnstring)){
				// 콜백 함수명에 점이있는경우 점으로 나눠줌
				// object function 은 2단계까지만 지원
				if (fnstring.indexOf('.') != -1) {

					var fnStrArray = fnstring.split('.');
					var fn = (window[fnStrArray[0]])[fnStrArray[1]];

					// 함수가 확인되면 실행
					if (typeof fn === "function") {
						fn(smutil.apiResult);
					}

				}
				else{		// 없는경우 바로 콜백하수 실행

					// find object
					var fn = window[fnstring];

					// is object a function?
					if (typeof fn === "function") {
						fn(smutil.apiResult);
					}
				}
			}

		}
	};	// end callApi
	
	var openApi = function(commonParam){
		$.ajax({
            url:"http://service.kosha.or.kr/api/deliveryworker/edcVidoRecomend?legaldongCode=1111010300&crtfcky=YEJ6U5M390E8DVP0V9OXRDXLD9GSJUE5",
            type:"GET",
            contentType: "application/json; charset=utf-8",
            headers : {
            	'access-control-allow': '*'
            },
            success: function (xml) {
                smutil.loadingOff();
                LEMP.Window.alert({
    				"_vMessage": "api성공!",
    			});
                console.log(">>>>>>>>>>>>>>>>> response >>>>>>>>>>>>> " + $(xml).find('resultCode').text());
                console.log(">>>>>>>>>>>>>>>>> response >>>>>>>>>>>>> " + $(xml).find('legaldongCode').text());
                console.log(">>>>>>>>>>>>>>>>> response >>>>>>>>>>>>> " + $(xml).find('vidoUrl').text());
                
                return xml;
            
            }
        });

	// 로딩레이어 on
	var loadingOn = function(){

		// 페이지에 로딩바 div 가 없을경우 추가
		var loadingObj = $('#lodingDvi');
		if(loadingObj.length == 0){
			var html = [];
			var i=0;

			html[i++] = '<div class="loading" id="lodingDvi">';
			html[i++] = '	<div class="img">';
			html[i++] = '		<div class="sk-fading-circle">';
			html[i++] = '			<div class="sk-circle1 sk-circle"></div>';
			html[i++] = '			<div class="sk-circle2 sk-circle"></div>';
			html[i++] = '			<div class="sk-circle3 sk-circle"></div>';
			html[i++] = '			<div class="sk-circle4 sk-circle"></div>';
			html[i++] = '			<div class="sk-circle5 sk-circle"></div>';
			html[i++] = '			<div class="sk-circle6 sk-circle"></div>';
			html[i++] = '			<div class="sk-circle7 sk-circle"></div>';
			html[i++] = '			<div class="sk-circle8 sk-circle"></div>';
			html[i++] = '			<div class="sk-circle9 sk-circle"></div>';
			html[i++] = '			<div class="sk-circle10 sk-circle"></div>';
			html[i++] = '			<div class="sk-circle11 sk-circle"></div>';
			html[i++] = '			<div class="sk-circle12 sk-circle"></div>';
			html[i++] = '		</div>';
			html[i++] = '	</div>';
			html[i++] = '</div>';

			$(html.join('')).prependTo(document.body);

		}

		$('#lodingDvi').css('display',"block");
	};


	// 로딩레이어 off
	var loadingOff = function(){
		$('#lodingDvi').css('display',"none");
	};


	// 메뉴정보 갖고오기
	// menuId : 0 dept 이상일경우 '.' 으로 붙여서 기술한다. ex =  CLDL or CLDL.menuTxt or CLDL.CLDL0101
	// getPropName : 갖고올 메뉴속성(없을경우 메뉴 obj 그대로 리턴)
	var getMenuProp = function(menuId, getPropName){

		if(smutil.menuJson && !smutil.isEmpty(menuId)){

			var menuJson = smutil.menuJson;
			var menuIdLst = menuId.split('.');
			var menuLen = menuIdLst.length;
			var returnObj ;

			for(var idx=0; idx < menuLen; idx++){
				// 마지막 데이터인경우
				if(!smutil.isEmpty(menuJson)){
					if( (idx+1) == menuLen){
						// 속성명이 있을경우 그 값만 리턴
						if(!smutil.isEmpty(getPropName)
							&& !smutil.isEmpty(menuJson[menuIdLst[idx]])){

							if(!smutil.isEmpty((menuJson[menuIdLst[idx]])[getPropName])){
								returnObj = (menuJson[menuIdLst[idx]])[getPropName];
							}
						}
						else{		// 없을경우 그 메뉴 object 그대로 리턴
							returnObj = (menuJson[menuIdLst[idx]]);
						}
					}
					else {	// 하위 데이터를 더 요청한 경우 하위 데이터로 타고감
						menuJson = (menuJson[menuIdLst[idx]]);
					}
				}
				else{
					return null;
				}

			}// end for

			if(smutil.isEmpty(returnObj)){
				return null;
			}
			else{
				return returnObj;
			}
		}
		else{
			return null;
		}
	};


	// 조회된 코드로 select box option 을 추가한다
	// key 는 /smapis/cmn/codeListPopup 을 기준으로 함
	var setSelectOptions = function(selector, optionsLst, selectedVal, codeName, valName){
		var selectEl = $(selector);
		var code = "dtl_cd";
		var text = "dtl_cd_nm";

		if(!smutil.isEmpty(codeName)){
			code = codeName;
		}

		if(!smutil.isEmpty(valName)){
			text = valName;
		}

		if(selectEl.length > 0){
			// 선택해야 하는 값이 없을경우
			if(smutil.isEmpty(selectedVal)){
				_.forEach(optionsLst, function(lstObject, key) {
					selectEl.append("<option value='"+lstObject[code]+"'>"+lstObject[text]+"</option>");
				});
			}
			else{
				_.forEach(optionsLst, function(lstObject, key) {
					if(selectedVal == lstObject.dtl_cd){
						selectEl.append("<option value='"+lstObject[code]+"' checked>"+lstObject[text]+"</option>");
					}
					else{
						selectEl.append("<option value='"+lstObject[code]+"'>"+lstObject[text]+"</option>");
					}

				});
			}
		}
	};


	// 코드에 맞는 회사 로고 클래스명 리턴
	var corpLogoReturn = function(code){
		var className = "";
		if(!smutil.isEmpty(code)){
			switch (code) {
				case '2001':			// 현대홈쇼핑
					className = "img lotte3";
					break;
				case '2002':			//홈앤쇼핑
					className = "img hom";
					break;
				case '2004':			// 롯데홈쇼핑 a
					className = "img lotte";
					break;
				case '2101':			// 세븐일레븐 a
					className = "img eleven";
					break;
				case '2201':			// 카카오 a
					className = "img kakao";
					break;
				case '2301':			// 롯데렌탈
					className = "img lotte4";
					break;
				case '2401':			// CJ오쇼핑
					className = "img cjo";
					break;
				case '3001':			// 롯데푸드
					className = "img lotte5";
					break;
				case '3002':			// 하이마트
					className = "img himart";
					break;
				case '3003':			// 롯데칠성
					className = "img lotte2";
					break;
				case '4001':			// VIP
					className = "img vip";
					break;
				case '4002':			// L.VIP
					className = "img lvip";
					break;
				case '4005':			// 바로반품
					className = "img baro";
					break;
				case '2202':			// 마켓민트
					className = "img min";
					break;
				case 'img coupang':		// 쿠팡 (코드 추가 해야함~!!!!)
					className = "img coupang";
					break;
				case 'img baro':		// 바로반품 (코드 추가 해야함~!!!!)
					className = "img coupang";
					break;
				case '4003':			// 마켓컬리
					className = "img kurly";
					break;
				case '4101':			// 엘롯데
					className = "img lotte6";
					break;
				case '4102':			// 롯데아이몰
					className = "img lotte7";
					break;
				case '4103':			// 롯데닷컴
					className = "img lotte8";
					break;
				case '4104':			// 롯데백화점(GSSHOP)
					className = "img gs";
					break;
				case 'b2b01':			// B2B출고
					className = "img b2b1";
					break;
				case 'b2b02':			// B2B반품
					className = "img b2b2";
					break;
				case 'b2b03':			// B2B점간
					className = "img b2b3";
					break;
				case 'b2b04':			// B2C(매장->개인)
					className = "img b2b4";
					break;
				case 'b2b05':			// B2C(개인->매장)
					className = "img b2b2";
					break;

				default:
					className = "img df";		// 일반
					break;
			}
		}
		else{
			className = "img df";		// 일반
		}

		return className;
	};


	/**
	 *  전화기 TTS 호출
	 *  	result_code : 0, 1 (fail, success)
	 *  	type : 0, 1, 2 (띵동, count, 배달 count)
	 *  	count : 1~100
	 *  	isBackground : (true : 앱이 background 상태, false: 앱이 foreground 상태)
	 */
	var callTTS = function(result_code, type, count, isBackground){

		var scanParam =  {
			id:"TTS",					// 디바이스 콜 id
			param:{						// 디바이스가 알아야할 데이터
				id:"TTS",
				result_code : result_code,		// 0, 1 (fail, success)
				type : type,					// 0, 1, 2 (띵동, count, 배달 count)
				count : count,					// 1~100
			}
		};

		// isBackground : true 면 앱이 background 상태
		if(isBackground){
			LEMPCore.Module.backGroundGateway(scanParam, "window" , "");
		}
		else{
			LEMPCore.Module.gateway(scanParam, "window" , "");
		}

	};


	/**
	 * 싸인패드에서 생성된 파일 결과 리턴
	 * fileFullPath : 생성할 파일의 풀 경로(파일명까지)
	 * width : 파일의 width 값 (없으면 800px)
	 * height : 파일의 height 값 (없으면 600px)
	 * fileSize : 파일의 max size byte크기 (없으면 500kb)
	 */
	var callSignPad = function(fileFullPath, callbackFunction, width, height, fileSize){


		// 확장자 명만 추출한 후 소문자로 변경
		var _fileLen = fileFullPath.length;
		var _lastDot = fileFullPath.lastIndexOf('.');
		var _fileExt = fileFullPath.substring((_lastDot+1), _fileLen).toLowerCase();

		if (smutil.isEmpty(_fileExt) || _fileExt !== "jpg") {
			LEMP.Window.alert({
				_sTitle : "파일 확장명 오류",
				_vMessage : "파일 확장명은 jpg만 가능합니다."
			});

			return false;
		}


		// is object a function?
		if (typeof callbackFunction !== "function") {
			LEMP.Window.alert({
				_sTitle : "파일 생성 콜백 오류",
				_vMessage : "결과를 받을 함수를 지정해주세요."
			});

			return false;
		}


		if(!smutil.isEmpty(fileFullPath)){
//			var _nWidth = smutil.nullToValue(width, 800);
//			var _nHeight = smutil.nullToValue(height, 600);
			var _nWidth = width;
			var _nHeight = height;
			var _nFileSize = smutil.nullToValue(fileSize, 512000);

			LEMP.Window.openSignPad({
				"_sTargetPath" : fileFullPath,
				"_fCallback" : function(signRes) {
					if(signRes.result){
						fileFullPath = signRes.file_path;
						// 파일이 있는지 검사
						LEMP.File.exist({
							"_sSourcePath" : fileFullPath ,
							"_fCallback"  : function(existRes){

								if(existRes.result){
									var fileList = [];

									fileList.push({
										"_sSourcePath" : fileFullPath
									});

									// 파일 리사이즈
									LEMP.File.resizeImage({
										"_aFileList" : fileList,
										"_bIsCopy" : false,
										"_nWidth" : _nWidth,
										"_nHeight" : _nHeight,
										"_nCompressRate" : 1.0,
										"_nFileSize" : _nFileSize,
										"_fCallback" : function (resizeRes){
											if(resizeRes.result){
												callbackFunction(resizeRes);
											}
											else{
												LEMP.Window.alert({
													_sTitle : "파일 리사이즈 오류",
													_vMessage : "파일 사이즈 조정에 실패했습니다."
												});
												return false;
											}
										}
									});

								}
								else {
//									LEMP.Window.alert({
//										_sTitle : "파일검사 오류",
//										_vMessage : "파일이 존재하지 않습니다."
//									});
									return false;
								}
							}
						});

					}
					else{
						LEMP.Window.alert({
							_sTitle : "서명 오류",
							_vMessage : "서명파일을 생성하지 못했습니다."
						});
						return false;
					}

				}
			});

		}
		else{
			LEMP.Window.alert({
				_sTitle : "서명 오류",
				_vMessage : "파일명이 없습니다."
			});
			return false;
		}
	};



	/**
	 * 카메라에서 생성된 파일 결과 리턴
	 * fileName : 생성할 파일명
	 * callbackFunction: callback 함수
	 */
	var callCamera = function(fileName, callbackFunction) {
		// 확장자 명만 추출한 후 소문자로 변경
		var _fileLen = fileName.length;
		var _lastDot = fileName.lastIndexOf('.');
		var _fileExt = fileName.substring((_lastDot+1), _fileLen).toLowerCase();

		if (smutil.isEmpty(_fileExt) || _fileExt !== "jpg") {
			LEMP.Window.alert({
				_sTitle : "파일 확장명 오류",
				_vMessage : "파일 확장명은 jpg만 가능합니다."
			});

			return false;
		}

		if (smutil.isEmpty(callbackFunction)) {
			LEMP.Window.alert({
				_sTitle : "콜백 오류",
				_vMessage : "결과를 받을 함수를 지정해주세요."
			});

			return false;
		}

		if (smutil.isEmpty(fileName)) {
			LEMP.Window.alert({
				_sTitle : "사진촬영 오류",
				_vMessage : "파일명이 없습니다."
			});

			return false;
		}

		// 카메라 호출
		smutil.nativeMothodCall({
			id : "CAMERA",	// 디바이스 콜 id
			param : {
				picture_name : fileName,
				callback : callbackFunction
			}
		});
	};





	/**
	 * 겔러리 이미지 파일사이즈 조정후 결과리턴
	 * fileName : 생성할 파일명
	 * callbackFunction: callback 함수
	 */
	var callGallery = function(fileName, callbackFunction){
		// 확장자 명만 추출한 후 소문자로 변경
		var _fileLen = fileName.length;
		var _lastDot = fileName.lastIndexOf('.');
		var _fileExt = fileName.substring((_lastDot+1), _fileLen).toLowerCase();

		if (smutil.isEmpty(_fileExt) || _fileExt !== "jpg") {
			LEMP.Window.alert({
				_sTitle : "파일 확장명 오류",
				_vMessage : "파일 확장명은 jpg만 가능합니다."
			});

			return false;
		}

		if (smutil.isEmpty(callbackFunction)) {
			LEMP.Window.alert({
				_sTitle : "콜백 오류",
				_vMessage : "결과를 받을 함수를 지정해주세요."
			});

			return false;
		}

		if (smutil.isEmpty(fileName)) {
			LEMP.Window.alert({
				_sTitle : "사진촬영 오류",
				_vMessage : "파일명이 없습니다."
			});

			return false;
		}

		// 앨범 호출
		smutil.nativeMothodCall({
			id : "GALLERY",	// 디바이스 콜 id
			param : {
				picture_name : fileName,
				callback : callbackFunction
			}
		});
	};


	var paginate = function(
			totalItems,			// 총 게시물 수
			currentPage,		// 현재 페이지
			pageSize,			// 한페이지당 표시할 게시물 수
			maxPages			// 네비게이션 바에 표시할 페이지 수
	){

		// calculate total pages
		var totalPages = Math.ceil(totalItems / pageSize);

		// ensure current page isn't out of range
		if (currentPage < 1) {
			currentPage = 1;
		}
		else if (currentPage > totalPages) {
			currentPage = totalPages;
		}

		var startPage, endPage;
		if (totalPages <= maxPages) {
			// total pages less than max so show all pages
			startPage = 1;
			endPage = totalPages;
		}
		else {
			// total pages more than max so calculate start and end pages
			var maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
			var maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;

			if (currentPage <= maxPagesBeforeCurrentPage) {
				// current page near the start
				startPage = 1;
				endPage = maxPages;
			}
			else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
				// current page near the end
				startPage = totalPages - maxPages + 1;
				endPage = totalPages;
			}
			else {
				// current page somewhere in the middle
				startPage = currentPage - maxPagesBeforeCurrentPage;
				endPage = currentPage + maxPagesAfterCurrentPage;
			}
		}

		// calculate start and end item indexes
		var startIndex = (currentPage - 1) * pageSize;
		var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

		// create an array of pages to ng-repeat in the pager control
		var pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

		// return object with all pager properties required by the view
		return {
			totalItems: totalItems,
			currentPage: currentPage,
			pageSize: pageSize,
			totalPages: totalPages,
			startPage: startPage,
			endPage: endPage,
			startIndex: startIndex,
			endIndex: endIndex,
			pages: pages
		};
	};

	/**
	 * 오늘날짜 가져오기 YYYY-mm-dd
	 */
	var getToday = function() {
		var today = new Date();
		var year = today.getFullYear();
		var month = 1+today.getMonth();
		month = month >= 10 ? month : '0'+month
		var day = today.getDate();
		day = day >= 10 ? day : '0'+day;
		var rcv_date = year+"-"+month+"-"+day;
		return rcv_date;
	};

	/**
	 * 오늘날짜 가져오기 YYYY년mm월dd일
	 */
	var getTodayStr = function() {
		var today = new Date();
		var month = 1+today.getMonth();
		month = month >= 10 ? month : '0'+month
		var day = today.getDate();
		day = day >= 10 ? day : '0'+day;
		var rcv_date = month+"월"+day+"일";
		return rcv_date;
	};

	/**
	 * 심야배송 확인 (true : 심야 / false : X)
	 */
	let isMidnight = function() {
		let currentDate = new Date();
		let compareDate = new Date();
		compareDate.setHours(10, 30, 0,0);
		return currentDate.getTime() > compareDate.getTime();
	};

	/**
	 * 12자리 숫자 송장번호 형식으로 변경하여 리턴
	 */
	let changeInvType = function(invNo) {
		return invNo.replace(/([0-9]{4})([0-9]{4})([0-9]{4})/,"$1-$2-$3");
	};

	/**
	 * YYYYMMDD를 받아서 현재날짜부터 기준일 이전인지 확인(20200911, 180)
	 */
	let isPassed = function(baseDate, period) {
		let currentDate = new Date();
		let compareDate = new Date(baseDate.substring(0,4), baseDate.substring(4,6)-1, baseDate.substring(6,8));
		return (currentDate.getTime()-(60*60*24*1000*period)) > (compareDate.getTime());
	};

	// ######################### end function

	// public 함수 등록
	return {
		init : function(){

		},	// end init

		apiResult : null,						// web 에서 리턴된 api 결과값

		deviceInfo : deviceInfo,				// 현재 돌아가고있는 디바이스정보 , 'smandroid, smios, other'

		logout : logout,

		// 공통 api 호출함수
		// api 호출을 로컬 브라우져에서 하고있을경우는 ajax 로 호출하고 전화기에서 호출하고있을경우에는 디바이스의 api 호출함수를 사용
		callApi : callApi,
		
		//오픈 api 호출함수
		openApi : openApi,

		// native용 API 통신함수
		nativeApiCall : nativeApiCall,

		// native 기능 호출함수
		nativeMothodCall : nativeMothodCall,

		// 개발용 ajax 통신 함수
		ajaxApiCall : ajaxApiCall,

		// 널체크
		isEmpty : isEmpty,

		// 널인경우 지정한 값 리턴
		nullToValue : nullToValue,

		// 메뉴정보 전역변수
		menuJson : menuJson,

		// api 결과값 기본 벨리데이션 체크
		apiResValidChk : apiResValidChk,

		// 로딩레이어 호출
		loadingOn : loadingOn,

		// 로딩레이어 닫기
		loadingOff : loadingOff,

		// 메뉴정보 및 obj 구해오기
		getMenuProp : getMenuProp,

		// 조회된 코드로 select box option 을 추가한다
		// key 는 /smapis/cmn/codeListPopup api를 기준으로 함
		setSelectOptions : setSelectOptions,

		// 코드에 맞는 회사 로고 클래스명 리턴
		corpLogoReturn : corpLogoReturn,

		// 전화기의 TTS 호출
		callTTS : callTTS,

		// 싸인패드에서 생성된 파일 결과 리턴
		callSignPad : callSignPad,

		// 사진찍은 결과 리턴
		callCamera : callCamera,

		// 겔러리 이미지 리턴
		callGallery : callGallery,

		// 자바스크립트용 페이지 처리 로직
		paginate : paginate,

		// 오늘날짜 리턴
		getToday : getToday,

		// 오늘날짜 월일 리턴
		getTodayStr : getTodayStr,

		// 심야배송 확인
		isMidnight : isMidnight,

		// 12자리숫자 송장번호 형식으로 변경
		changeInvType : changeInvType,

		// 기준날짜 이전인지 확인
		isPassed: isPassed,

	};


})(window, document, jQuery);
