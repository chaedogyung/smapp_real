LEMP.addEvent("backbutton", "page.callbackBackButton");
LEMP.addEvent("resume", "page.resumeInfo"); // 페이지 열릴때마다 스케너 상태확인 호출

var page = {
	apiParam : {
		id : "HTTP", // 디바이스 콜 id
		param : {// 디바이스가 알아야할 데이터
			task_id : "", // 화면 ID 코드가 들어가기로함
			// position : {}, // 사용여부 미확정
			type : "",
			baseUrl : "",
			method : "POST", // api 호출 형식(지정 안하면 'POST' 로 자동 셋팅)
			callback : "", // api 호출후 callback function
			contentType : "application/json; charset=utf-8"
		},
		data : {
			"parameters" : {}
		}
	// api 통신용 파라메터
	},
	curDate:"",
	//공지사항 팝업시 backey 방지
	init : function(json) {

		var accessToken = LEMP.Properties.get({
			"_sKey" : "accessToken"
		});

		// 오늘날짜
		var curDate = new Date();
		page.curDate = curDate.LPToFormatDate("yyyymmdd");

		page.initInterface();

		//기사정보
		page.smInfo();
		//공지사항
		page.noticePopup();
		//블루투스 연결상태
		page.chkScannerStatus();
		//롯데홈쇼핑 인증키 체크
		page.getLhCerk();
		//쪽지 안읽음 표시
		page.memoReadStatus();
		// 즐겨찾기 조회
		page.FrevMenu();
		//배달사진카운트
		page.getCdlvPicCnt();
		// 메시지 대량발송 동의 조회
		page.getMsgCnf();

		/**
		 * 출력 테스트용 코드
		 * 나중에 꼭 삭제 해야함~~~~~~~~!!!!!!!!!!!!!!!!
		 */
		// 로그인 성공한 id
		var loginId = LEMP.Properties.get({
			"_sKey" : "dataId"
		});

		// 난독화화 함께 적용하기로하고 주석처리
		/*if(!smutil.isEmpty(loginId)){
			loginId = atob(loginId);		// 평문으로 디코딩
		}*/

	},

	// 햄버거 메뉴 생성
	initCreateSideView : function(){
		LEMP.SideView.create({
			"_sPosition" : "left",  // or right
			"_sPagePath" : "GNB/html/GNB0001.html",
			"_sWidth" : "100",
			"_oMessage" : {
				"param" : ""
			}
		});
	},

	// bluetoothCheck : function() {
	// console.log('bluetoothCheck 실행해야함~!!');
	// },

	initInterface : function() {
		var tr = {
			id : "INIT",
		};
		// native 기능 호출
		smutil.nativeMothodCall(tr);



		// 알림 버튼 클릭
		$('#alim').on('click', function() {
			var popUrl = smutil.getMenuProp('MAN.MAN0301', 'url');
			LEMP.Window.open({
				"_sPagePath" : popUrl,
			});
		});

		//즐겨찾기 이동
		$(document).on('click','.frevPage',function(){
			var id = $(this).attr('id');
			var index = id.indexOf('0');
			var pre = id.substring(0,index);
			var popUrl = smutil.getMenuProp(pre+"."+id, 'url');
			LEMP.Window.open({
				"_sPagePath" : popUrl,
			});
		});


		// 메인 롯데택배 로그클릭(페이지 리로드)
		$('#mainLogo').on('click',function(e) {
			page.resumeInfo();
		});

		// 메시지 대량발송 미동의 버튼 클릭
		$('#btnSms').on('click', function() {
			var popUrl = smutil.getMenuProp('SET.SET0401', 'url');
			LEMP.Window.open({
				"_sPagePath" : popUrl
			});
		});
	},
	//공지사항 팝업
	noticePopup : function() {
		smutil.loadingOn();
		page.apiParamInit();		// 파라메터 초기화
		page.apiParam.param.baseUrl = "/smapis/cmn/notiList";
		page.apiParam.param.callback = "page.noticePopupCallback";
		page.apiParam.data.parameters = {};

		smutil.callApi(page.apiParam);
	},
	//쪽지 안읽음 표시
	memoReadStatus : function(){
		smutil.loadingOn();
		page.apiParamInit();		// 파라메터 초기화
		page.apiParam.param.baseUrl = "/smapis/cmn/noteNewCnt";
		page.apiParam.param.callback = "page.memoReadStatusCallback";
		page.apiParam.data.parameters = {};
		smutil.callApi(page.apiParam);
	},

	smInfo : function(){
		smutil.loadingOn();
		page.apiParamInit();		// 파라메터 초기화
		page.apiParam.param.baseUrl = "/smapis/cmn/smInf";
		page.apiParam.param.callback = "page.smInfoCallback";
		page.apiParam.data.parameters = {};
		smutil.callApi(page.apiParam);
	},
	callback : function(response) {
		// console.log("native res :::: ", response);
		// alert("????????????????????????????");
		// this.apiResult = response;

		return response;
		// return _this.apiResult;
	},

	// 물리적 뒤로가기 버튼 클릭시 종료여부 설정
	callbackBackButton : function() {
		var btnCancel = LEMP.Window.createElement({
			_sElementName : "TextButton"
		});
		btnCancel.setProperty({
			_sText : "취소",
			_fCallback : function() {
			}
		});

		var btnConfirm = LEMP.Window.createElement({
			_sElementName : "TextButton"
		});
		btnConfirm.setProperty({
			_sText : "확인",
			_fCallback : function() {
				LEMP.App.exit({
					_sType : "kill"
				});
			}
		});

		LEMP.Window.confirm({
			_vMessage : "앱을 종료하시겠습니까?",
			_aTextButton : [ btnCancel, btnConfirm ]
		});
	},

	// ############################# 스케너 상태 체크 start
	chkScannerStatus : function() {
		smutil.loadingOn();
		var tr = {
			id : "BLUETOOTHSTATUS",
			param : {
				type : "scanner",
				callback : "page.chkScannerStatusCallback"
			}
		};

		// native 기능 호출
		smutil.nativeMothodCall(tr);
	},
	//즐겨찾기 목록
	FrevMenu : function(){
		smutil.loadingOn();
		page.apiParam.param.baseUrl = "/smapis/cmn/fvrtList";
		page.apiParam.param.callback = "page.fvrtListCallback";

		smutil.callApi(page.apiParam);
	},
	chkScannerStatusCallback : function(res) {
		try{
			if (res.status === "true") {
				$('#scannerStatusImg').attr('src',
				'../../common/img/icon-bluetooth-on.png');
			} else {
				$('#scannerStatusImg').attr('src',
					'../../common/img/icon-bluetooth-off.png');
			}
		}catch(e){}
		finally{
			smutil.loadingOff();
		}
	},
	// ############################# 스케너 상태 체크 end

	// ############################# 롯데홈쇼핑 인증키 생성 start
	getLhCerk : function() {
		smutil.loadingOn();

		// 오늘 날짜
//		var today = new Date();
//		today = today.LPToFormatDate("yyyy-mm-dd");

		// 생성된 인증키
		var lotteCerk = LEMP.Properties.get({
			"_sKey" : "lotteCerk"
		});

		if(!smutil.isEmpty(lotteCerk)){
			// 인증키 생성일과 날짜가 다르면 새로 발급
			if(page.curDate != lotteCerk.date){
				// 저장되어있던 토큰 삭제
				LEMP.Properties.remove({"_sKey":"lotteCerk"});
				// 새로 발급
				page.setLhCerkTrmn();
			}
		}else{
			page.setLhCerkTrmn();
		}

	},
	setLhCerkTrmn : function() {
		var tr = {
			id : "HTTPDIRECT",
			param : {
				baseUrl : "/lhwms/rest/LhCerkTrmn/call?companyCode=LH",
				callback : "page.LhCerkTrmnCallback",
				data:{
					"cerkUserId" : "11"	//택배사코드(롯데글로벌로지스 : 11)
				}// api 통신용 파라메터
			}
		};

		// native 기능 호출
		smutil.nativeMothodCall(tr);
	},
	LhCerkTrmnCallback : function(res) {

		try{
			if(res.statusCode == "200"){
				var data = res.result;
				// 정상처리
				if(data.resultCd === "1"){

//					var today = new Date();
//					today = today.LPToFormatDate("yyyy-mm-dd");

					// 인증키 저장
					var lotteCerkInfo = {
							"cerk" : data.cerk,			// 인증 토큰
							"date" : page.curDate		// 생성일
					};
					LEMP.Properties.set({
						"_sKey" : "lotteCerk",
						"_vValue" : lotteCerkInfo
					});

				}
			}
		}catch(e){}
		finally{
			smutil.loadingOff();
		}
	},

	// ############################# 롯데홈쇼핑 인증키 생성 end

	// 공지사항 팝업 콜백
	noticePopupCallback : function(res) {
//		LEMP.Properties.remove({"_sKey" : "notice"});
		var popCnt = 1;
		try{
			if(smutil.apiResValidChk(res) && res.code === "0000" && res.data_count != 0){
				// 서버로 부터 받아온 list
				var list = res.data.list;
				var notice = LEMP.Properties.get({
					"_sKey" : "notice"
				});

				//alert("list ====> "+JSON.stringify(list));
				//alert("notice ====> "+JSON.stringify(notice));

				var popUrl = smutil.getMenuProp('MAN.MAN0201', 'url');
				var popUrl_I = smutil.getMenuProp('MAN.MAN0202', 'url')

				// 맨처음에 properties에 아무것도 저장안되어있을시
				if(smutil.isEmpty(notice)){

					// 날짜 + seq_no unique값
					_.forEach(list, function(v){
						v.dtl_desc = v.dtl_desc.split('\n').join('<br>');


						//이미지 경로없을시 텍스트 팝업
						//if(smutil.isEmpty(v.img_path)){

							LEMP.Window.open({
								"_sPagePath" : popUrl,
								"_oMessage" : {
									"param" : v
								},
							});
					//	}
						/*
						else{
							LEMP.Window.open({
								"_sPagePath" : popUrl_I,
								"_oMessage" : {
									"param" : v
								},
							});
						}
					*/

						//팝업은 최대 4만 오픈한다(4개 오픈하면 강제로 열지 않는다.)
						if(popCnt == 4){
							return false;
						}

						popCnt ++;
					});

				}
				// properties에 저장된 값과 현재 list와 비교
				else if(!smutil.isEmpty(list) && !smutil.isEmpty(notice)){

					//alert("여기??????????????");
	//				list = list.slice(0,2);
					//notice = notice.slice(0,4);

					// properties 에 다시 저장
	//				LEMP.Properties.set({
	//					"_sKey" : "notice",
	//					"_vValue" : notice
	//				});

	//				alert("11=====>"+JSON.stringify(notice));

					var popOpen = false;

					// 읽은 공지사항과 내려온 공지사항 비교
					// 공지사항 목록
					$.each(list ,function(j,listObj){
						listObj.keyNo = listObj.sta_ymd + listObj.seq_no;

						// 확인한 이력 목록
						$.each(notice ,function(i,noticeObj){

							if(noticeObj._sKey == listObj.keyNo){
								popOpen = true;
								return false;
							}
						});


						// 확인 이력이 없으면 팝업 오픈
						if(!popOpen){


							//이미지 경로없을시 텍스트 팝업
						//	if(smutil.isEmpty(listObj.img_path)) {
								LEMP.Window.open({
									"_sPagePath" : popUrl,
									"_oMessage" : {
										"param" : listObj
									},
								});
						//	}
							/*
							else {
								LEMP.Window.open({
									"_sPagePath" : popUrl_I,
									"_oMessage" : {
										"param" : listObj
									},
								});
							}
							*/

							//팝업은 최대 4만 오픈한다(4개 오픈하면 강제로 열지 않는다.)
							if(popCnt == 4){
								return false;
							}

							popCnt ++;
						}
						popOpen = false;
					});

					// 읽은 공지사항내용 정리
					// 공지사항 목록
					// 확인한 이력 목록
					popOpen = false;
					var noticeObj ;

					var i = notice.length
					while (i--) {
						noticeObj = notice[i];

						// 공지사항 목록
						$.each(list ,function(j,listObj){
							listObj.keyNo = listObj.sta_ymd + listObj.seq_no;

							if(noticeObj._sKey == listObj.keyNo){
								popOpen = true;
								return false;
							}
						});

						// 확인 이력이 공지사항 목록에 없으면 확인 이력 삭제
						if(!popOpen){
							notice.splice(i, 1);
						}
						popOpen = false;
					}
					// properties 에 다시 저장
					LEMP.Properties.set({
						"_sKey" : "notice",
						"_vValue" : notice
					});

				}
			}else if (smutil.apiResValidChk(res) && res.code === "0000" && res.data_count == 0) {

				// 확인한 공지사항 정보 삭제
				LEMP.Properties.remove({"_sKey":"notice"});
			}

		}catch(e){}
		finally{
			smutil.loadingOff();
		}

	},
	//쪽지 안읽음 표시 callback
	memoReadStatusCallback : function(res){
		try{
			if(smutil.apiResValidChk(res) && res.code ==="0000"){
				if (res.no_read_cnt > 0) {
					$('#alimCount').css("display","block");
					$('#alimCount').text(res.no_read_cnt);
				}else {
					$('#alimCount').css("display","none");
				}

			}
		}catch(e){}
		finally{
			smutil.loadingOff();
		}
	},
	//즐겨찾기 콜백
	fvrtListCallback : function(res){
		try{
			if(smutil.apiResValidChk(res) && res.code ==="0000"){

				var frevPage = $('.frevPage');
				$.each(frevPage, function(idx, obj){
					if($(obj).data('type') == 'remove'){
						$(obj).remove();
					}
				});

				var frevLst = {};
				frevLst.list = [];

				for (var i = 0; i < res.data.list.length; i++) {
					var foldernm=res.data.list[i].fvrt_id.replace(/[0-9]/g, "");
					var filenm=res.data.list[i].fvrt_id;
					var str = foldernm+"."+filenm;

					var src = smutil.getMenuProp(str,"mainImgSrc");
					var menuTxt = smutil.getMenuProp(str,"menuTxt");

					if(!smutil.isEmpty(src)
							&& !smutil.isEmpty(menuTxt)){
						res.data.list[i].img= smutil.getMenuProp(str,"mainImgSrc");
						res.data.list[i].text= smutil.getMenuProp(str,"menuTxt");

						frevLst.list.push(res.data.list[i]);
					}
				}

				var source = $("#FREVE0101_template").html();
				var template = Handlebars.compile(source);
				$("#freMenuBox").append(template(frevLst));
			}

		}catch(e){
		}
		finally{
			smutil.loadingOff();
		}
	},
//	readUpdateCallback : function(){
//		page.memoReadStatus();
//	},
	//사원정보callback
	smInfoCallback : function(res){

		try{
			if(smutil.apiResValidChk(res) && res.code ==="0000"){
				var fir = res.cur_mon.substring(0,4);
				var lat = res.cur_mon.substring(4,6);
				$('#emp_nm').text(res.emp_nm);
				$('#emp_grd').text(res.emp_grd);
				$('#empno').text(res.empno);
				$('#vhc_no').text(res.vhc_no);
				$('#emp_img_path').attr('src',res.emp_img_path);
				$('#cur_monF').text(fir+"년"+lat+"월");
				$('#cur_pick_rate').text(res.cur_pick_rate+"건");
				$('#cur_dlv_rate').text(res.cur_dlv_rate+"건");
				$('#cur_sum').text(Number(res.cur_pick_rate)+Number(res.cur_dlv_rate)+"건");
				$('#tod_pick_rslt').text(res.tod_pick_rslt+"건");
				$('#tod_dlv_rslt').text(res.tod_dlv_rslt+"건");
				$('#tod_sum').text(Number(res.tod_pick_rslt)+Number(res.tod_dlv_rslt)+"건");
			}
		}catch(e){}
		finally{
			smutil.loadingOff();
		}
	/*	var info = {
				"smInfo" : {res}
		}
		var source = $("#smInfo_template").html();
		var template = Handlebars.compile(source);

		Handlebars.registerHelper('infoMonF', function(res){
			var data = res.data.root.cur_mon;
			var fData = data.substring(0,4);
	        return fData;
	    });

		Handlebars.registerHelper('infoMonL', function(res){
			var data = res.data.root.cur_mon;
			var LData = data.substring(4,6);
	        return LData;
	    });

		Handlebars.registerHelper('monSum', function(res){
			var data = res.data.root;
	        return Number(data.cur_pick_rate)+Number(data.cur_dlv_rate);
	    });

		Handlebars.registerHelper('dvgaSum', function(res){
			var data = res.data.root;
	        return Number(data.tod_dlv_rslt)+Number(data.tod_pick_rslt);
	    });

		$("#infoMain").append(template(res));
		*/



	}
	,MAN0301Callback : function(){
		page.memoReadStatus();
	}


	,getCdlvPicCnt:function(){
		smutil.loadingOn();
		page.apiParamInit();		// 파라메터 초기화
		page.apiParam.param.baseUrl = "smapis/cmn/getCdlvPicCnt";
		page.apiParam.param.callback = "page.getCdlvPicCntCallback";
		page.apiParam.data.parameters.srch_ymd = page.curDate;
		smutil.callApi(page.apiParam);
	}

	,getCdlvPicCntCallback:function(res){
		try {
			if(smutil.apiResValidChk(res) && res.code ==="0000"){
				$("#pic_dlv_rslt").text(res.cdlv_pic_cnt+"건");
			}
		} catch(e){}
		finally{
			smutil.loadingOff();
		}

	}

	// 동의 상태 조회
	, getMsgCnf: function() {
		var loginId = LEMP.Properties.get({
			"_sKey" : "dataId"
		});

		// TODO: 6월 8일 6시 이후 제거(LMS 동의)
		if (loginId !== '31909351') {
			var now = new Date();
			var applyDate = new Date(2020, 5, 8, 6);
			if (now.getTime() < applyDate.getTime()) {
				return;
			}
		}

		page.apiParam.param.baseUrl = "/smapis/cmn/getMsgCnf";		// api no
		page.apiParam.param.callback = "page.getMsgCnfCallback";	// callback methode

		// 공통 api호출 함수
		smutil.callApi(page.apiParam);
	}

	// 동의 상태 조회 콜백
	, getMsgCnfCallback: function(res) {
		if(res.code === "00" || res.code === "0000") {
			var data = res.data.list[0];

			// 사용자 상태(미동의/동의)에 따라 View 설정
			if (data.lms_agg_yn === 'N') {	// 미동의 사용자
				$('#btnSms').show();
				$('#labelSms').hide();
			} else {						// 동의 사용자
				$('#lmsEndDt').text(data.lms_end_ymd.substr(0, 4) + '년 ' + data.lms_end_ymd.substr(4, 2) + '월 ' + data.lms_end_ymd.substr(6, 2) + '일');

				$('#btnSms').hide();
				$('#labelSms').show();
			}
		}

		// 프로그래스바 닫기
		smutil.loadingOff();
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
				callback : "",					// api 호출후 callback function
				contentType : "application/json; charset=utf-8"
			},
			data:{"parameters" : {}}// api 통신용 파라메터
		};
	}

	// 페이지 resume 될때마다 실행되는 함수
	, resumeInfo : function(){
		//기사정보
		page.smInfo();
		//공지사항
		page.noticePopup();
		//블루투스 연결상태
		page.chkScannerStatus();
		//롯데홈쇼핑 인증키 체크
		page.getLhCerk();
		//쪽지 안읽음 표시
		page.memoReadStatus();
		// 즐겨찾기 조회
		page.FrevMenu();
		//배달사진카운트
		page.getCdlvPicCnt();
	}
}

