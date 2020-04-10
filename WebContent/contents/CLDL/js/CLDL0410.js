LEMP.addEvent("backbutton", "page.callbackBackButton");		// 뒤로가기 버튼 클릭시 이벤트

var page = {

	init:function(arg)
	{
		console.log("arg ::: ", arg);
		page.cldl0410.list=arg.data.param.list;
		page.cldl0410.acpr_nm = arg.data.param.acpr_nm;
		page.initInterface();

	},
	cldl0410:{},

	// mms 기본문구.  저장된 문구가 없을경우에 기본 셋팅된다
	mmsMessage : "딩~동!!\n진심을 다하는 롯데택배입니다.\n고객님의 소중한 상품이 도착되었다는 소식을 알려드립니다.\n불편사항 있으시면 언제든지 연락바라며, 항상 최고의 서비스를 위해 노력하겠습니다.",

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


		// 갤러리 버튼 클릭
		$(".btn.img").click(function() {
			var date = new Date();
			var curTime = date.LPToFormatDate("yyyymmddHHnnss");
			var fileName = "000000000000_cdlv_"+curTime+".jpg";

			smutil.callGallery(fileName, 'page.imageCallback');
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
			var usrCpno = [];

			if (smutil.isEmpty(conCheck)) {
				 LEMP.Window.alert({
					 "_sTitle" : "사진전송",
					 "_vMessage" : "배송문구 내용이 입력 되지 않았습니다\n내용을 확인해주세요"
				 });
				 return false;
			};

			if (smutil.isEmpty(imgCheck)) {
				 LEMP.Window.alert({
					 "_sTitle" : "사진전송",
					 "_vMessage" : "이미지가 선택 되지 않았습니다\n내용을 확인해주세요"
				 });
				 return false;
			};


			// 인수자 정보가 있으면 메세지에 셋팅
			if(!smutil.isEmpty(insujaTxt)){
				conCheck = conCheck + "\n"+insujaTxt;
			}

			// 송장번호 정보가 있으면 메세지에 셋팅
			if(!smutil.isEmpty(invNoTxt)){
				conCheck = conCheck + "\n"+invNoTxt;
			}


			$("#cldl0410LstUl > li").each(function(){
				var phoneNumber = $(this).find("#tel_num > span").text();
				var phoneCheck = phoneNumber.substr(0,3);
				var inv_no = $(this).find("#inv_no").data("invNo");
				switch (phoneCheck) {
					//전화번호 앞자리가 아래 조건이 아니면 전송시도를 하지 않는다.
					case "010":
					case "011":
					case "016":
					case "017":
					case "018":
					case "019":
					case "050":
						pNum.push(phoneNumber.replace(/\-/gi,""));
						invNo.push(String(inv_no));
						usrCpno.push(phoneNumber);
						break;
					default:
						plag = true;
						return false;
				}
			});

			if (plag) {
				LEMP.Window.alert({
					"_sTitle" : "사진전송",
					"_vMessage" : "MMS를 발송할 수 없는 번호가 있습니다\n전화번호를 변경해주세요"
				});
				return false;
			}

			var obj={};

			obj.inv_no=invNo;
			obj.usr_cpno=usrCpno;
			obj.images=imgCheck;
			page.cldl0410.obj = obj;

			obj = {
				"phoneNumber": pNum
				,"title": '롯데택배'
				,"context": conCheck
				,"filePath": imgCheck
				,"sleepTime": 0
				,"callback":"smutil.mmsMsgCallback"
			};

			page.cldl0410.sendmms = obj;
			page.cmptPhtgTrsmPop();

		});


		page.InvNoAppend();
	}
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


		/*var MMScont = "딩~동!!\n진심을 다하는 롯데택배입니다.\n고객님의 소중한 상품이 " +
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
			$("#insujaTxt").text("인수자 : " + acprNm);
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
		page.apiParam.data.parameters.inv_no = page.cldl0410.obj.inv_no;			// api 통신용 파라메터
		page.apiParam.data.parameters.usr_cpno = page.cldl0410.obj.usr_cpno;		// api 통신용 파라메터
		page.apiParam.files = arr;

		// 공통 api호출 함수
		smutil.callApi(page.apiParam);
	}

	//
	,cmptPhtgTrsmPopCallback:function(res){
		try{
			if (smutil.apiResValidChk(res) && res.code=="0000") {
				page.MMSLIbTestFunction();
			}else if (res.code=="SMAPP_BAD_PARAMETER"){
				LEMP.Window.alert({
					"_sTitle" : "사진전송",
					"_vMessage" : res.message
				});
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
			LEMP.Window.alert({
				"_sTitle" : "사진전송",
				"_vMessage" : "이미지를 가져올 수 없습니다."
			});
		}

	}


	// MMS 플러그인 호출
	,MMSLIbTestFunction : function(){
		var tr = {
			"id":"SENDMMS",
			"param":page.cldl0410.sendmms
		};

		// mms 호출
		smutil.nativeMothodCall(tr);
	}
	//

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

			var textButton = LEMP.Window.createElement({
				"_sElementName" : "TextButton"
			});

			textButton.setProperty({
				"_sText" : "확인",
				"_fCallback" : function()   {
					LEMP.Window.close({
						"_sCallback":"page.listReLoad"
					});
				}
			});

			//page.cldl0410.sendmmscontext
			LEMP.Window.alert({
				"_sTitle" : "사진전송",
				"_vMessage" : "송장번호와 사진을 서버로 전송했습니다.",
				"_eTextButton" : textButton
			});
		}
		else{
			LEMP.Window.alert({
				"_sTitle" : "사진전송 mms발송 실패",
				"_vMessage" : "MMS 문자발송에 실패했습니다."
			});

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

