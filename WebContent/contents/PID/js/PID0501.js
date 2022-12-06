var page = {
	print_p_type : null,
	printParam : {},
	prntDeviceType : null,			// 디바이스 타입

	pInfo :{},
	apiParam : {
		id : "HTTP", // 디바이스 콜 id
		param : { // 디바이스가 알아야할 데이터
			task_id : "PID0501", // 화면 ID 코드가 들어가기로함
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

	init : function(args) {
		page.initEvent();					//페이지 이벤트 등록
		page.initDpEvent();
	},

	//페이지 이벤트 등록
	initEvent : function() {
		//키패드 엔터를 눌렀을때(검색)
		$(document).keydown(function(event) {
			if (event.keyCode === '13') {
				page.searchReceipt($('#inv_noNumber').val());
			}
		});

		//검색버튼 클릭
		$('#btn_search').click(function(){
			page.searchReceipt($('#inv_noNumber').val());
		});

		//카메라 바코드 호출
		$('.btn.scan').click(function(){
			LEMP.Window.openCodeReader({
				"_fCallback" : function(res) {
					if(res.result){
						if(!smutil.isEmpty(res.data)){
							page.searchReceipt(res.data);
						}
					}else{
						LEMP.Window.alert({
							"_sTitle" : "경고",
							"_vMessage" : "바코드를 읽지 못했습니다."
						});
					}
				}
			});
		});

		/* 화면 상단 > 화물추적 */
		$("#openFrePop").click(function(){
			var popUrl = smutil.getMenuProp("FRE.FRE0301","url");

			LEMP.Window.open({
				"_sPagePath":popUrl,
				"_oMessage":{
					"param":null
				}
			});

			// //테스트 프린트
			// let tmpParam = {
			// 		"parameters": {
			// 		}
			// 		,
			// 		"ord_no": null,
			// 		"msg": "success",
			// 		"extch": 0,
			// 		"ust_rtg_sct_cd": "01",
			// 		"acper_badr": "서울 구로구 구로동",
			// 		"acper_emd_nm": "구로3동",
			// 		"snper_etc_adr": " ",
			// 		"fltr_sct_cd": "RSRV",
			// 		"snper_rdnm_adr": "서울 구로구 구로동 186-7 ",
			// 		"acper_sd_nm": "서울",
			// 		"gds_nm": "잡화/생활용품",
			// 		"fare_sct_cd": "01",
			// 		"dstt_cd": "283",
			// 		"box_qty": "1",
			// 		"mgr_cust_cd": "005074",
			// 		"corp_prnt_nm": null,
			// 		"snper_cpno": null,
			// 		"acper_tel": "010-3409-3654",
			// 		"orgl_inv_no": null,
			// 		"acpt_rgst_ymd": "20210115",
			// 		"pick_emp_nm": "이하니(테스트용)",
			// 		"corp_prnt_cd": null,
			// 		"qty": null,
			// 		"snper_dadr": "186-7",
			// 		"snper_tel": "010-3409-3654",
			// 		"inv_no": "336000003723",
			// 		"acper_rdnm_adr": "서울 구로구 구로동 186-7 ",
			// 		"pick_brsh_nm": "분당판교(대)",
			// 		"pick_ymd": "20210115",
			// 		"code": "0000",
			// 		"snper_nm": "김간잔",
			// 		"job_cust_cd": "005074",
			// 		"cust_nm_tel_wksct": " ",
			// 		"jrsd_cust_cd": "191180",
			// 		"acper_etc_adr": " ",
			// 		"dlv_emp_nm": "이영섭",
			// 		"summ_fare": 60000,
			// 		"dlv_brsh_nm": "구로디지털(대)",
			// 		"acper_sgk_nm": "구로구",
			// 		"acper_dadr": "186-7",
			// 		"pltg": 0,
			// 		"clsf_cd": "20",
			// 		"snper_sgk_nm": "구로구",
			// 		"bsc_fare": 60000,
			// 		"snper_badr": "서울 구로구 구로동",
			// 		"pick_pstp_cd": "00",
			// 		"acper_cpno": null,
			// 		"rsrv_mgr_no": "3042368002",
			// 		"snper_sd_nm": "서울",
			// 		"chn_cd": "C2C",
			// 		"cust_emer_msg": " ",
			// 		"message": "success",
			// 		"hs_txt_6": null,
			// 		"b2b_sct_cd": null,
			// 		"box_mgnt": "A",
			// 		"snper_emd_nm": "구로동",
			// 		"hs_txt_4": null,
			// 		"brnd_nm": null,
			// 		"airf": 0,
			// 		"sort_cd": "D2",
			// 		"fare_sct_nm": "현불",
			// 		"fres_yn": "N",
			// 		"pick_brsh_rpn_tel": null,
			// 		"acpt_no": "20210115000001",
			// 		"dlv_msg_cont": "부재시 경비실에 맡겨주세요.",
			// 		"req_cust_cd": "005074",
			// 		"acper_nm": "김간잔",
			// 		"statusCode": 200,
			// 		"isBackground": false,
			// 		"page": 1,
			// 		"totalPage": 1
			//
			// };
			// page.printInv(tmpParam);
		});

		//출력버튼 클릭
		$('.ftPrint').click(function(){
			page.bluetoothStatus();
		});

		/* 운송장 출력 > 예 */
		$('#invPrntYesBtn').click(function(){
			page.printInv(page.printParam);
		});
				
		// 송장 종류
		$(function() {
		page.print_p_type =	LEMP.Properties.get({"_sKey" : "print_paper_type"});
		if(!smutil.isEmpty(page.print_p_type) && page.print_p_type == "Y") {
			$("#setDlvyCom1").text('신송장');
			$("#setDlvyCom1").attr('class', 'blue badge option outline');
		} else {
			$("#setDlvyCom1").text('구송장');
            $("#setDlvyCom1").attr('class', 'gray2 badge option outline');
				}			
		});

		page.setHandlebars();
	},

	initDpEvent : function (){
		//최초에 없음 표시
		page.showNoList();
	},

	//스캐너 콜백
	scanCallback : function(data){
		if(!smutil.isEmpty(data.barcode)){
			page.searchReceipt(data.barcode);
		}
	},

	//접수번호로 검색
	searchReceipt : function (receiptNum){
		if(!smutil.isEmpty(receiptNum)){
			smutil.loadingOn();
			$("#inv_noNumber").val(receiptNum);
			page.apiParamInit();										//파라메터 초기화
			page.apiParam.param.baseUrl = "smapis/pid/scanPrint";
			page.apiParam.param.callback = "page.scanPrintCallback";
			page.apiParam.data = {
				"parameters" : {
					"scan_code" : receiptNum
					// "scan_code" : "336000003764"
				}
			};
			smutil.callApi(page.apiParam);

		}else{
			LEMP.Window.alert({
				"_sTitle" : "스캔출력",
				"_vMessage" : "접수번호를 입력해주세요"
			});
		}
	},

	//접수번호로 조회 후 콜백
	scanPrintCallback : function(res) {
		try{
			if(smutil.apiResValidChk(res) && res.code === "0000" && res.data_count!==0){
				//성공시 출력버튼 활성화
				$('.ftPrint').attr('disabled', false);	//출력버튼 활성화
				$('#li').addClass('on');

				page.printParam = res;

				// 의류 특화이면서, 신선여부 키가 존재한다면 fres_yn 키를 삭제
				if (res.svc_cd === "01" && res.hasOwnProperty("fres_yn")) {
					delete res.fres_yn;
				}

				// 핸들바 템플릿 가져오기
				var source = $("#pid0501_detail_template").html();

				// 핸들바 템플릿 컴파일
				var template = Handlebars.compile(source);

				// 핸들바 템플릿에 데이터를 바인딩해서 HTML 생성
				var contentHtml = template(res);

				// 생성된 HTML을 DOM에 주입
				$('#result_view').html(contentHtml);

				// 자동출력 체크시 바로 출력
				if($('#checkAuto').prop("checked")){
					page.bluetoothStatus();
				}
			}else{
				page.printParam = {};
				page.showNoList();
				$('.ftPrint').attr('disabled', true);	//출력버튼 비활성화
				$('#li').removeClass('on');
			}
		}catch(e){console.log(e)}
		finally{
			smutil.loadingOff();
		}
	},

	//검색결과 없음 표시
	showNoList : function (){
		let source = $("#pid0501_nolist_template").html();
		let template = Handlebars.compile(source);
		let liHtml = template();
		$('#result_view').html(liHtml);
	},

	// 출력 전 블루투스 체크
	bluetoothStatus : function(){
		//블루투스 호출
		const param =  {
			id : "BLUETOOTHSTATUS",        			// 디바이스 콜 id
			param : {									// 디바이스가 알아야할 데이터
				type : "printer",
				callback : "page.bluetoothStatusCallback"// api 호출후 callback function
			}
		};
		smutil.nativeMothodCall(param);
	},

	// 출력 전 블루투스 체크  Callback
	bluetoothStatusCallback : function(result){
		if(result.status === "true"){
			//프린트 종류 저장
			page.prntDeviceType = result.deviceType;

			//자동출력일경우 바로 출력
			if($('#checkAuto').prop("checked")){
				page.printInv(page.printParam);
			}else{
				//프린트 확인 팝업창 노출
				$('.mpopBox.print').bPopup();
			}
		}else{
			LEMP.Window.alert({
				"_sTitle" : "블루투스 연결 실패",
				"_vMessage" : "프린터가 연결되어 있지 않습니다"
			});
		}
		smutil.loadingOff();
	},

	printInv : function(data){
		smutil.loadingOn();
		data["page"] = 1;
		data["totalPage"] = 1;
		const printerParam =  {
			id : "PRINTER",						// 디바이스 콜 id
			data : data,						// 운송장 정보
			param : {             				// 디바이스가 알아야할 데이터
				deviceType : page.prntDeviceType,
				callback : "page.nativePrntCallback"// api 호출후 callback function
			}
		};
		smutil.nativeMothodCall(printerParam);
	},

	// 출력 후 Callback
	nativePrntCallback : function(result){
		smutil.loadingOff();
		if(result.statusCode === "true"){

		}else{
			LEMP.Window.alert({
				"_sTitle" : "운송장 출력 오류",
				"_vMessage" : "출력 중 오류가 발생하였습니다."
			});
		}

	},
	// ################### 운송장 출력 end

	setHandlebars : function (){
		//###################################### handlebars helper 등록 start
		// 송장번호 형식 표시
		Handlebars.registerHelper('invNoTmpl', function(options) {
			if(!smutil.isEmpty(this.inv_no)){
				return (this.inv_no).replace(/([0-9]{4})([0-9]{4})([0-9]{4})/,"$1-$2-$3");
			}
			else{
				return "";
			}
		});

		// 신선식품 여부 체크
		Handlebars.registerHelper('fresYnChk', function(options) {
			if(this.fres_yn === "Y"){	// 신선식품
				// options.fn == if(true)
				return options.fn(this)
			}
			else{	// 신선식품 아님
				return options.inverse(this);
			}
		});

		// 박스 규격
		Handlebars.registerHelper('boxMgntTml', function(options) {
			switch (this.box_mgnt){
				case "A" :
					return "소";
					break;
				case "B" :
					return "중";
					break;
				case "C" :
					return "대";
					break;
				default :
					return "값없음";
					break;
			}
		});

		// 지도 버튼 > 송장번호 있을때만 출력
		Handlebars.registerHelper('mapBtn', function(options) {
			if(smutil.isEmpty(page.argInvNo)){
				return "";
			}
			else{
				var html = '<button class="btn map">지도</button>';
				return new Handlebars.SafeString(html); // mark as already escaped
			}
		});

		//합계운임
		Handlebars.registerHelper('commaSummFare', function(summ_fare) {
			return (this.summ_fare+"").LPToCommaNumber();
		});

		//기본운임
		Handlebars.registerHelper('commaBscFare', function(bsc_fare) {
			return (this.bsc_fare+"").LPToCommaNumber();
		});

		//기타운임
		Handlebars.registerHelper('commaEtcFare', function(etc_summ_fare) {
			return (this.etc_summ_fare+"").LPToCommaNumber();
		});

		// //항공운임
		// Handlebars.registerHelper('commaAirf', function(airf) {
		// 	return (this.airf+"").LPToCommaNumber();
		// });
		//
		// //할증료
		// Handlebars.registerHelper('commaPltg', function(pltg) {
		// 	return (this.pltg+"").LPToCommaNumber();
		// });
		//
		// //합계운임
		// Handlebars.registerHelper('commaExtch', function(extch) {
		// 	return (this.extch+"").LPToCommaNumber();
		// });

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
				callback : "",					// api 호출후 callback function
				contentType : "application/json; charset=utf-8"
			},
			data:{"parameters" : {}}// api 통신용 파라메터
		};
	},

	changeForm : function(code){
		$("#inv_noNumber").val(code.replace(/^(\d{4})(\d{4})(\d{4})$/,"$1-$2-$3"));
		page.pInfo.inv_no =$("#inv_noNumber").val();
	}

};
