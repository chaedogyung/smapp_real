LEMP.addEvent("backbutton", "page.callbackBackButton");		// 뒤로가기 버튼 클릭시 이벤트

var page = {

	init:function(arg)
	{
		console.log("arg ::: ", arg);
		page.cldl0410.list=arg.data.param.list;
		page.cldl0410.acpr_nm = arg.data.param.acpr_nm;
		page.initInterface();
		console.log(page.cldl0410.list);
	},
	cldl0410:{},

	// mms 기본문구.  저장된 문구가 없을경우에 기본 셋팅된다
	mmsMessage : "딩동\u266C\n진심을 다하는 롯데택배입니다.\n고객님의 소중한 상품이 도착되었다는 소식을 알려드립니다.\n불편사항 있으시면 언제든지 연락바라며, 항상 최고의 서비스를 위해 노력하겠습니다.",

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
		data:{"parameters":{}}// api 통신용 파라메터
	},

	// api 파람메터 초기화
	apiParamInit : function(){
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
	},

	initInterface : function()
	{
	

		// 닫기 버튼
		$(".btn.closeW.paR").click(function(){
			LEMP.Window.close();
		});

		// 카메라 버튼 클릭
		$(".btn.camera").click(function() {
			var date = new Date();
			var curTime = date.LPToFormatDate("yyyymmddHHnnss");
			var fileName = "000000000000_cdlv_"+curTime+".jpg";
			smutil.callCamera(fileName, 'page.imageCallback');
		});
		
		 $(function(){
			var dlvyCompl = LEMP.Properties.get({ "_sKey" : "autoMenual"});
			if(dlvyCompl.area_sct_cd3 == "Y"){
				$('#autoPic').text("자동");
				$("#autoPic").attr('class', 'blue badge option outline');

				var date = new Date();
				var curTime = date.LPToFormatDate("yyyymmddHHnnss");
				var fileName = "000000000000_cdlv_"+curTime+".jpg";
				smutil.callCamera(fileName, 'page.imageCallback');

			}else{
				$('#autoPic').text("수동");
                $("#autoPic").attr('class', 'gray2 badge option outline');
			}
			
		});
				
		
		// 갤러리 버튼 클릭
		$(".btn.img").click(function() {
			var date = new Date();
			var curTime = date.LPToFormatDate("yyyymmddHHnnss");
			var fileName = "000000000000_cdlv_"+curTime+".jpg";
			smutil.callGallery(fileName, 'page.imageCallback');
		});
		
		// 싸인 버튼 클릭
		$(".btn.sign").click(function() {
			var date = new Date();
			var curTime = date.LPToFormatDate("yyyymmddHHnnss");
			var fileFullPath = "{external}/LEMP/"+"000000000000"+"_sign_"+curTime+".jpg";
			smutil.callSignPad(fileFullPath, page.cmptSignRgst);
		});
		
		// 서명 싸인패드 호출
		$(document).on('click', '.btn.blue2.bdM.bdMemo.mgl1', function(e){
			var inv_no = $(this).data('invNo')+"";

			if(_this.chkScanYn(inv_no)){
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
//				LEMP.Window.alert({
//					"_sTitle":"서명 오류",
//					"_vMessage":"스캔후 가능합니다.",
//				});
			}

		});



		$(document).on("click",".phon > button",function(){
			if ($(this).hasClass("phonNum")) {
				var index = $(this).closest("li").attr("id");
				var popUrl = smutil.getMenuProp("CLDL.CLDL0407","url");
				LEMP.Window.open({
					"_sPagePath":popUrl
					,"_oMessage":{
						"param":{
							"index":index
						}
					}
				});
			}else {
				$(this).closest("li").remove();
			}
		});

		//전송 버튼 클릭
		$("#confirm").click(function(){
			var conCheck = $("#MMScont").val();			// mms 메세지
			var insujaTxt = $("#insujaTxt").text();		// 인수자
			var invNoTxt = $("#invNoTxt").text();		// 송장번호

			var imgCheck = $(".imgBox img").attr("src");
			var plag = false;
			var pNum = [];
			var invNo = [];
			var invCo = [];//송장번호 count(갯수)//새로추가 2023.02.03
			var usrCpno = [];
			
			//서버전송용 
			var pNumApi = [];
			var invNoApi = [];
			var usrCpnoApi = [];

			if (smutil.isEmpty(conCheck)) {
				LEMP.Window.toast({
					"_sMessage":"배송문구 내용이 입력 되지 않았습니다\n내용을 확인해주세요",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					 "_sTitle" : "사진전송",
//					 "_vMessage" : "배송문구 내용이 입력 되지 않았습니다\n내용을 확인해주세요"
//				 });
				 return false;
			};

			if (smutil.isEmpty(imgCheck)) {
				LEMP.Window.toast({
					"_sMessage":"이미지가 선택 되지 않았습니다\n내용을 확인해주세요",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					 "_sTitle" : "사진전송",
//					 "_vMessage" : "이미지가 선택 되지 않았습니다\n내용을 확인해주세요"
//				 });
				 return false;
			};


			// 인수자 정보가 있으면 메세지에 셋팅
			if(!smutil.isEmpty(insujaTxt)){
				conCheck = conCheck + "\n"+insujaTxt;
			}

			// 송장번호 정보가 있으면 메세지에 셋팅(배열로 넘겨서 주석처리)
			// if(!smutil.isEmpty(invNoTxt)){
			// 	conCheck = conCheck + "\n"+invNoTxt;
			// }


			var sum = 0;
			new Set();
			var phoneCount1 = $("#tel_num > span");
			new Array();
			var phoneCount2 = new Array();
			for(var i =0;i<phoneCount1.length; i++){
				phoneCount2.push(phoneCount1[i].innerText);
			};

			var invNoCount = $("#inv_no > span");

			var phoneCount = new Set(phoneCount2);	
			$("#cldl0410LstUl > li").each(function(){
				//전화번호가 1개이고 송장번호가 1개일떄( 단건일때)
				if(phoneCount.size == 1 && invNoCount.length == 1){
						var phoneNumber = $(this).find("#tel_num > span").text();
						var phoneCheck = phoneNumber.substr(0,3);
						var inv_no = $(this).find("#inv_no").data("invNo");
						var snper_nm = "\n\u25A0\u0020보내는분 : " + $(this).find("#inv_no").attr("data-snper-nm");
						var artc_nm = "\n\u25A0\u0020상품명 : " + $(this).find("#inv_no").attr("data-artc-nm");
						var acpr_nm = "\n\u25A0\u0020위탁장소 : " + $(this).find("#inv_no").attr("data-acpr-nm");
						var rcv_date = "\n\u25A0\u0020" + $(this).find("#inv_no").attr("data-rcv-date");
	
						switch (phoneCheck) {
							//전화번호 앞자리가 아래 조건이 아니면 전송시도를 하지 않는다.
							case "010":
							case "011":
							case "016":
							case "017":
							case "018":
							case "019":
							case "050":
								//MMS 발송용
								pNum.push(phoneNumber.replace(/\-/gi,""));
								//MMS 발송할때 보내는분, 상품명, 배송날짜를 송장번호에 추가하여 발송
								invNo.push(String(inv_no) + snper_nm + artc_nm + acpr_nm + rcv_date);
								usrCpno.push(phoneNumber);
	
								//API 발송용
								pNumApi.push(phoneNumber.replace(/\-/gi,""));
								invNoApi.push(String(inv_no));
								usrCpnoApi.push(phoneNumber);
								break;
							default:
								//휴대폰 번호는 아니지만 정상 번호가 입력되어 있을경우 전송
								var numCheck = phoneNumber.replace(/[^0-9]/gi,"");
								if(!smutil.isEmpty(numCheck) && numCheck.length>8){
									pNumApi.push(numCheck);
									invNoApi.push(String(inv_no));
									//invNoApi.push(String(inv_no) + snper_nm + artc_nm + acpr_nm + rcv_date);
									usrCpnoApi.push(phoneNumber);
								}
								else{
									plag = true;
									return false;
								}
						}
					
				}
				//전화번호가 1개이고 송장번호가 2개이상일때
				else if(phoneCount.size == 1 && invNoCount.length > 1){	
					var phoneNumber = $(this).find("#tel_num > span").text();
					var phoneCheck = phoneNumber.substr(0,3);
					var inv_co = sum += $(this).find("#inv_no").size();
					inv_co = inv_co - '1'; 
					inv_co= " 외" + inv_co + "건";
					var inv_no = $(this).find("#inv_no").data("invNo");
					var snper_nm = "\n\u25A0\u0020보내는분 : " + $(this).find("#inv_no").attr("data-snper-nm");
					var artc_nm = "\n\u25A0\u0020상품명 : " + $(this).find("#inv_no").attr("data-artc-nm")+ ' ' + inv_co;
					var acpr_nm = "\n\u25A0\u0020위탁장소 : " + $(this).find("#inv_no").attr("data-acpr-nm");
					var rcv_date = "\n\u25A0\u0020" + $(this).find("#inv_no").attr("data-rcv-date");
	
					switch (phoneCheck) {
						//전화번호 앞자리가 아래 조건이 아니면 전송시도를 하지 않는다.
						case "010":
						case "011":
						case "016":
						case "017":
						case "018":
						case "019":
						case "050":
							//MMS 발송용
							pNum.push(phoneNumber.replace(/\-/gi,""));
							//MMS 발송할때 보내는분, 상품명, 배송날짜를 송장번호에 추가하여 발송
							usrCpno.push(phoneNumber);
							invCo.push(inv_co);
							invNo.push(String(inv_no) + inv_co + snper_nm + artc_nm + acpr_nm + rcv_date);
							//API 발송용
							pNumApi.push(phoneNumber.replace(/\-/gi,""));
							invNoApi.push(String(inv_no));
							usrCpnoApi.push(phoneNumber);
							break;
						default:
							//휴대폰 번호는 아니지만 정상 번호가 입력되어 있을경우 전송
							var numCheck = phoneNumber.replace(/[^0-9]/gi,"");
							if(!smutil.isEmpty(numCheck) && numCheck.length>8){
								pNumApi.push(numCheck);
								invNoApi.push(String(inv_no));
								//invNoApi.push(String(inv_no) + snper_nm + artc_nm + acpr_nm + rcv_date);
								usrCpnoApi.push(phoneNumber);
							}
							else{
								plag = true;
								return false;
							}
					}
				} 
				//전화 번호가 두개 이상이고 송장번호가 2개이상일떄
				else {
					var phoneNumber = $(this).find("#tel_num > span").text();
					var phoneCheck = phoneNumber.substr(0,3);
					var inv_no = $(this).find("#inv_no").data("invNo");
					var snper_nm = "\n\u25A0\u0020보내는분 : " + $(this).find("#inv_no").attr("data-snper-nm");
					var artc_nm = "\n\u25A0\u0020상품명 : " + $(this).find("#inv_no").attr("data-artc-nm");
					var acpr_nm = "\n\u25A0\u0020위탁장소 : " + $(this).find("#inv_no").attr("data-acpr-nm");
					var rcv_date = "\n\u25A0\u0020" + $(this).find("#inv_no").attr("data-rcv-date");

					switch (phoneCheck) {
						//전화번호 앞자리가 아래 조건이 아니면 전송시도를 하지 않는다.
						case "010":
						case "011":
						case "016":
						case "017":
						case "018":
						case "019":
						case "050":
							//MMS 발송용
							pNum.push(phoneNumber.replace(/\-/gi,""));
							//MMS 발송할때 보내는분, 상품명, 배송날짜를 송장번호에 추가하여 발송
							invNo.push(String(inv_no) + snper_nm + artc_nm + acpr_nm + rcv_date);
							usrCpno.push(phoneNumber);

							//API 발송용
							pNumApi.push(phoneNumber.replace(/\-/gi,""));
							invNoApi.push(String(inv_no));
							usrCpnoApi.push(phoneNumber);
							break;
						default:
							//휴대폰 번호는 아니지만 정상 번호가 입력되어 있을경우 전송
							var numCheck = phoneNumber.replace(/[^0-9]/gi,"");
							if(!smutil.isEmpty(numCheck) && numCheck.length>8){
								pNumApi.push(numCheck);
								invNoApi.push(String(inv_no));
								//invNoApi.push(String(inv_no) + snper_nm + artc_nm + acpr_nm + rcv_date);
								usrCpnoApi.push(phoneNumber);
							}
							else{
								plag = true;
								return false;
							}
					}
				}
			});

			if (plag) {
				LEMP.Window.toast({
					"_sMessage":"MMS를 발송할 수 없는 번호가 있습니다\n전화번호를 변경해주세요",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle" : "사진전송",
//					"_vMessage" : "MMS를 발송할 수 없는 번호가 있습니다\n전화번호를 변경해주세요"
//				});
				return false;
			}

			var obj={};

			obj.inv_no=invNo;
			obj.usr_cpno=usrCpno;
			obj.inv_co=invCo;
			obj.images=imgCheck;
			page.cldl0410.obj = obj;

			obj = {
				"phoneNumber": pNum
				,"invoiceNumber" : invNo
				// ,"snper_nm" : obj.snper_nm
				// ,"artc_nm" : obj.artc_nm
				// ,"rcv_date" : obj.rcv_date
				,"invoiceCount": invCo
				,"title": '롯데택배'
				,"context": conCheck
				,"filePath": imgCheck
				,"sleepTime": 0
				,"callback":"smutil.mmsMsgCallback"
			};
			
			//서버전송용 추가
			var objApi={};

			objApi.inv_no=invNoApi;
			objApi.usr_cpno=usrCpnoApi;
			objApi.images=imgCheck;
			page.cldl0410.objApi = objApi;

			objApi = {
				"phoneNumber": pNumApi
				,"title": '롯데택배'
				,"context": conCheck
				,"filePath": imgCheck
				,"sleepTime": 0
				,"callback":"smutil.mmsMsgCallback"
			};
			
			page.cldl0410.sendmms = obj;
            page.cmptPhtgTrsmPop();

			//page.MMSLIbTestFunction(); //문자발송 테스트용

		});

		$("#msgLock").change(function () {
			var msgLockYn = $("#msgLock").is(":checked")?"Y":"N";

			if (msgLockYn === "Y") {
				document.getElementById("MMScont").readOnly = true;
										  
			} else {
				document.getElementById("MMScont").removeAttribute("readonly");
								 
			}
		});


		document.getElementById("MMScont").addEventListener('touchend', function(e) {
			var msgLockYn = $("#msgLock").is(":checked")?"Y":"N";
			if (msgLockYn === "Y") {
				LEMP.Window.toast({
					'_sMessage' : '메세지잠금을 풀면 메세지 수정이 가능합니다.',
					'_sDuration' : 'short'
				});
			}
		});

		page.InvNoAppend();
	},
	
	
	// ################### 서명이미지 전송
	cmptSignRgst : function(signObj){
		//송장번호 배열
		var invNoApi = [];
		$("#cldl0410LstUl > li").each(function(){
			var inv_no = $(this).find("#inv_no").data("invNo");
			invNoApi.push(String(inv_no));
		});
		
		if(!smutil.isEmpty(signObj) && signObj.result && !smutil.isEmpty(invNoApi)){

			//서명이미지 api 호출
			page.apiParam.id = 'HTTPFILE'
			page.apiParam.param.baseUrl = "/smapis/cldl/cmptSignRgstArr";			// api no
			page.apiParam.param.callback = "page.cmptSignRgstCallback";			// callback methode
			page.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {
					"inv_no" : invNoApi	// 송장번호
				}
			};
			page.apiParam.files = [(signObj.list[0]).target_path];

			// 공통 api호출 함수
			smutil.callApi(page.apiParam);

			page.signInvNo = null;
		}
		else{
			LEMP.Window.toast({
				"_sMessage":"서명이미지를 저장하지 못했습니다.\n 관리자에게문의해 주세요.",
				'_sDuration' : 'short'
			});
//			LEMP.Window.alert({
//				"_sTitle":"서명이미지 저장오류",
//				"_vMessage":"서명이미지를 저장하지 못했습니다.\n 관리자에게문의해 주세요."
//			});
		}

	},


	// 서명이미지 전송 콜백
	cmptSignRgstCallback : function(result){
		page.signInvNo = null;

		// api 전송 성공
		if(smutil.apiResValidChk(result) && result.code == "0000"){
			LEMP.Window.toast({
				"_sMessage":"서명이미지 저장처리가 완료되었습니다.",
				'_sDuration' : 'short'
			});
//			LEMP.Window.alert({
//				"_sTitle":"서명이미지 저장",
//				"_vMessage":"서명이미지 저장처리가 완료되었습니다."
//			});
			//서명이미지 전송후 종료
			LEMP.Window.close();
		}
		else{
			LEMP.Window.toast({
				"_sMessage":smutil.nullToValue(result.message,''),
				'_sDuration' : 'short'
			});
//			LEMP.Window.alert({
//				"_sTitle":"서명이미지 저장오류",
//				"_vMessage":smutil.nullToValue(result.message,'')
//			});
		}

	}
	// ################### 서명이미지 저장 처리 end
	
	,InvNoAppend:function(){
		var list = page.cldl0410.list;
		for (var i = 0; i < list.length; i++) {
			list[i].invNo = list[i].inv_no.substr(0,4) + "-" + list[i].inv_no.substr(4,4) + "-" + list[i].inv_no.substr(8,4);
			if (list[i].tel_num.LPStartsWith("050")) {
				list[i].telNum = list[i].tel_num.substr(0,4) + "-" + list[i].tel_num.substr(4,4) + "-" + list[i].tel_num.substr(8,4);
			}else if (list[i].tel_num == "") {
				list[i].telNum = "입력해주세요";
			}else {
				list[i].telNum = list[i].tel_num.LPToFormatPhone();
			}
		}


		// 가져온 핸들바 템플릿 컴파일
		var template = Handlebars.compile($("#cldl0410_list_template").html());
		// 핸들바 템플릿에 데이터를 바인딩해서 생성된 HTML을 DOM에 주입
		$('#cldl0410LstUl').append(template(page.cldl0410));

		/*var MMScont = "딩동\u266C\n진심을 다하는 롯데택배입니다.\n고객님의 소중한 상품이 " +
				smutil.nullToValue(page.cldl0410.acpr_nm,'') + "에(게) 도착되었다는 소식을 알려드립니다.\n" +
				"불편사항 있으시면 언제든지 연락바라며, 항상 최고의 서비스를 위해 노력하겠습니다."
		if ($("#cldl0410LstUl > li").length === 1) {
			$("#MMScont").val(MMScont+"\n송장번호 : "+page.cldl0410.list[0].invNo);
		}else {
			$("#MMScont").val(MMScont);
		}*/

		// 기사가 발송한 사진전송 메세지
		var mmsMessage = LEMP.Properties.get({
			"_sKey" : "mmsMessage"
		});
		var MMScont = page.mmsMessage;						// 기본 메세지
		var invNo = page.cldl0410.list[0].invNo;			// 송장번호
		var acprNm = page.cldl0410.acpr_nm;					// 인수자명

		// 설정 되어있는 메세지가 있으면 기본 메세지 설정
		if(!smutil.isEmpty(mmsMessage)){
			MMScont = mmsMessage;
		}
		// 전송할 메세지 셋팅
		$("#MMScont").val(MMScont);

		// 인수자 셋팅
		if(!smutil.isEmpty(acprNm)){
			$("#insujaTxt").text("위탁장소 : " + acprNm);
		}

		// 송장번호는 사진전송이 1건일 경우만 셋팅
		if ($("#cldl0410LstUl > li").length === 1
				&& !smutil.isEmpty(invNo)) {
			$("#invNoTxt").text("송장번호 : "+(invNo).replace(/([0-9]{4})([0-9]{4})([0-9]{4})/,"$1-$2-$3"));
		}

	}

	//서버 api 콜
	,cmptPhtgTrsmPop:function(){
		smutil.loadingOn();
		var arr = [page.cldl0410.obj.images];

		//사진전송 api 파라미터 세팅
		page.apiParam.id = "HTTPFILE";
		page.apiParam.param.baseUrl = "smapis/cldl/cmptPhtgTrsmPop";				// api no
//		page.apiParam.param.baseUrl = "smapis/cldl/cmptPhtgTrsmPopResize";			// api no(파일 리사이징용 api)
		page.apiParam.param.callback = "page.cmptPhtgTrsmPopCallback";				// callback methode
		page.apiParam.data.parameters.inv_no = page.cldl0410.objApi.inv_no;			// api 통신용 파라메터
		page.apiParam.data.parameters.usr_cpno = page.cldl0410.objApi.usr_cpno;		// api 통신용 파라메터
		page.apiParam.files = arr;

		// 공통 api호출 함수
		smutil.callApi(page.apiParam);
	}

	//api호출 후 콜백(mms전송)
	,cmptPhtgTrsmPopCallback:function(res){
		try{
			if (smutil.apiResValidChk(res) && res.code=="0000") {
//               alert(page.cldl0410.sendmms.phoneNumber);
//               alert(page.cldl0410.sendmms);
               page.MMSLIbTestFunction();

			}else if (res.code=="SMAPP_BAD_PARAMETER"){
				LEMP.Window.toast({
					"_sMessage":res.message,
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_sTitle" : "사진전송",
//					"_vMessage" : res.message
//				});
			}
		}
		catch(e){}
		finally{
//			smutil.loadingOff();			// 로딩바 닫기
		}

	}

	,imageCallback:function(res){
		if (res.result) {
			$(".imgBox > img").attr("src",res.target_path);
		}else {
			LEMP.Window.toast({
				"_sMessage":"이미지를 가져올 수 없습니다.",
				'_sDuration' : 'short'
			});
//			LEMP.Window.alert({
//				"_sTitle" : "사진전송",
//				"_vMessage" : "이미지를 가져올 수 없습니다."
//			});
		}

	}


	// MMS 플러그인 호출
	,MMSLIbTestFunction : function(){
		var tr = {
			"id":"SENDMMS",
			"param":page.cldl0410.sendmms
		};
		var tr1 = tr.param.phoneNumber;
		new Set();
		var tr1 = new Set(tr1);
		
		if(tr1.size == 1){
			var phoneNumber = [tr.param.phoneNumber.pop()];
			var invoiceNumber = [tr.param.invoiceNumber.pop()];
			var invoiceCount = [tr.param.invoiceCount.pop()];
			var title = tr.param.title;
			var context = tr.param.context;
			var filePath = tr.param.filePath;
			var sleepTime = tr.param.sleepTime;
			var callback = tr.param.callback;
			var SENDMMS = tr.id;
			var tr = {
					"id":SENDMMS,
					"param":{phoneNumber,invoiceNumber,invoiceCount,title,context,filePath,sleepTime,callback}
			};
			// mms 호출
			smutil.nativeMothodCall(tr);
		}
		else
		{
			// mms 호출
			smutil.nativeMothodCall(tr);
		}
	}

	// mms 호출후 callback
	, mmsCallback : function(statusCode){
		if(statusCode){
			// 기사가 입력한 메세지
			var mmsMessage = smutil.nullToValue($("#MMScont").val(),'');

			// 기사가 입력한 메세지를 properties 에 저장
			LEMP.Properties.set({
				"_sKey" : "mmsMessage",
				"_vValue" : mmsMessage
			});

//			var textButton = LEMP.Window.createElement({
//				"_sElementName" : "TextButton"
//			});
//
//			textButton.setProperty({
//				"_sText" : "확인",
//				"_fCallback" : function()   {
//					LEMP.Window.close({
//						"_sCallback":"page.listReLoad"
//					});
//				}
//			});
//
//			//page.cldl0410.sendmmscontext
//			LEMP.Window.alert({
//				"_sTitle" : "사진전송",
//				"_vMessage" : "송장번호와 사진을 서버로 전송했습니다.",
//				"_eTextButton" : textButton
//			});
			
			LEMP.Window.toast({
				"_sMessage":"송장번호와 사진을 서버로 전송했습니다.",
				'_sDuration' : 'short'
			});
			
			LEMP.Window.close({
				"_sCallback":"page.listReLoad"
			});
		}
		else{
			LEMP.Window.toast({
				"_sMessage":"MMS 문자발송에 실패했습니다.",
				'_sDuration' : 'short'
			});
//			LEMP.Window.alert({
//				"_sTitle" : "사진전송 mms발송 실패",
//				"_vMessage" : "MMS 문자발송에 실패했습니다."
//			});

			smutil.loadingOff();			// 로딩바 닫기
		}
	}


	,CLDL0407Callback : function(res){
		$("#"+res.param.index).find("#tel_num > span").text(res.param.pNum);
		$("#"+res.param.index).find("#tel_num").attr("data-tel-num",res.param.pNum.replace(/\-/gi,""));
	}


	// 물리적 뒤로가기 버튼 및 뒤로가기 버튼 클릭시 아무동작 안함
	, callbackBackButton : function(){
		// 로딩중에 물리적인 뒤로 가기가 눌리면 아무 동작 안함
		if($('#lodingDvi').length > 0 && $('#lodingDvi').is(":visible")){
		}
		else{		//로딩중이 아니면 화면 닫기
			LEMP.Window.close({
				"_sCallback":"page.listReLoad"
			});
		}
	}
}

