var page = {
	invStatus : "",

	scanStatus : {
		ymd : "",
		tme : ""
	},
	pictureStatus : {
		id : "",
		text : ""
	},
	pictures1 : {
		inv_no : "",
		total : "",
		pdamage1 : "",
		pdamage2 : "",
	},
	pictures2 : {
		inv_no : "",
		total : "",
		odamage1 : "",
		odamage2 : "",
		inv_no_c : "",
		total_c : ""
	},
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
		},
	// api 통신용 파라메터
	},

	init : function() {
		page.initInterface();
		page.fltrListSearch();
	},

	initInterface : function() {
		// 삭제버튼 오손 layout display none
		$('.btn.del4').css('display', 'none');
		$('.damage').css('display', 'none');

		// 카메라스캔
		$('#cameraScan_1').on('click', function() {
			LEMP.Window.openCodeReader({
				"_fCallback" : function(resOpenCodeReader) {
					var code = resOpenCodeReader.data;
					var date = new Date();
					if (code.length !== 12 
							|| ( code.substr(0,11)+((Number(code.substr(0,11))%7)+"") ) !== code){
						LEMP.Window.alert({
							"_sTitle":"스캔오류",
							"_vMessage":"정상적인 송장번호가 아닙니다."
						});
					}
					if(code.length!=0){
						$('#inv_noText').val(code);
					}
					page.scanStatus.ymd = date.LPToFormatDate("yyyymmdd");
					page.scanStatus.tme = date.LPToFormatDate("HHnnss");
				}
			});
		});
		// 원인 운송장 카메라
		$('#cameraScan_Cause').on('click', function() {
			LEMP.Window.openCodeReader({
				"_fCallback" : function(resOpenCodeReader) {
					var code = resOpenCodeReader.data;
					var date = new Date();
					if (code.length !== 12 
							|| ( code.substr(0,11)+((Number(code.substr(0,11))%7)+"") ) !== code){
						LEMP.Window.alert({
							"_sTitle":"스캔오류",
							"_vMessage":"정상적인 송장번호가 아닙니다."
						});
					}
					$('#text_cause').val(code);
					page.scanStatus.ymd = date.LPToFormatDate("yyyymmdd");
					page.scanStatus.tme = date.LPToFormatDate("HHnnss");
				}
			});
		});

		// 사진 등록
		$(".btn.plus3").on('click', function() {
			var status = $(this).attr('id');
			var text = $(this).parent().prev().text();
			if (status == "damage2C" || status == "damage2CT") {
				if (smutil.isEmpty($('#text_cause').val())) {
					LEMP.Window.alert({
						"_vMessage" : "원인 운송장 번호를 입력해주세요",
					});
					return false;
				}
			}

			if ($("#inv_noText").val().length == 0) {
				LEMP.Window.alert({
					"_vMessage" : "송장번호를 입력해주세요",
				});
			} else {
				page.pictureStatus.id = status;
				page.pictureStatus.text = text;
				var inv_no ;
				// 오손인경우 
				if (status == "damage2C" || status == "damage2CT") {
					inv_no = $('#text_cause').val();
				}
				else{
					inv_no = $('#inv_noText').val();
				}
				
				var popUrl = smutil.getMenuProp('FRE.FRE0102', 'url');
				var data = {
					"inv_no" : inv_no,
					"id" : status,
					"status" : page.pictureStatus.text,
				}
				LEMP.Window.open({
					"_sPagePath" : popUrl,
					"_oMessage" : {
						// FRE0201페이지에서 호출했다는 구분값
						"pageStatus" : "confirm",
						"param" : data
					}
				});
			}
		});

		$('#FRE0201_code_template').on('change', function() {
			if ($("#FRE0201_code_template option:selected").val() === "50") {
				$('.damage').css('display', 'block');
				$('.damage_1_others').css('display', 'none');

			} else {
				$('.damage').css('display', 'none');
				$('.damage_1_others').css('display', 'block');
			}
		});

		// 송장번호 입력
		$('#inv_noText ,#text_cause').on('click', function() {
			page.invStatus = $(this).attr("id");
			var popUrl = smutil.getMenuProp('COM.COM0102', 'url');
			LEMP.Window.open({
				"_sPagePath" : popUrl
			});
		});
		// 사진 삭제
		$('.btn.del4').on('click', function() {
			$(this).css('display', 'none');
			$(this).prev().css('display', 'block');
			$(this).next().css('display', 'none');

		
			switch ($(this).prev().attr('id')) {
			case "inv_no1":
				page.pictures1.inv_no = "";
				break;
			case "total1":
				page.pictures1.total = "";
				break;
			case "damage_p1":
				page.pictures1.pdamage1 = "";
				break;
			case "damage_p1t":
				page.pictures1.pdamage2 = "";
				break;
			case "inv_no2":
				page.pictures2.inv_no = "";
				break;
			case "total2":
				page.pictures2.total = "";
				break;
			case "damage_p2":
				page.pictures2.odamage1 = "";
				break;
			case "damage_p2t":
				page.pictures2.odamage2 = "";
				break;
			case "damage2C":
				page.pictures2.inv_no_c = "";
				break;
			case "damage2CT":
				page.pictures2.total_c = "";
				break;
			}
	
		});
		
		
		
		// 전송
		$('#sendDatas').on('click',function(){
			var rea_cd = $('#FRE0201_code_template option:selected').val();
			var phto_sct = "30";
			var inv_no = $('#inv_noText').val();
			var scan_ymd = page.scanStatus.ymd;
			var scan_tme = page.scanStatus.tme;
			var rea_cd_img;
			var fileArray = new Array();

			if (inv_no.length !== 12 
					|| ( inv_no.substr(0,11)+((Number(inv_no.substr(0,11))%7)+"") ) !== inv_no) {
				LEMP.Window.alert({
					"_vMessage" : "정상적인 송장번호가 아닙니다."
				});
				return false;
			}
			
			page.apiParam.id = "HTTPFILE";
			page.apiParam.param.baseUrl = "/smapis/pacl/rgstAcc";
			page.apiParam.param.callback = "page.sendCallback_F";
			page.apiParam.data = {
				"parameters" : {
					"phto_sct" : phto_sct,
					"inv_no" : inv_no,
					"scan_ymd" : scan_ymd,
					"scan_tme" : scan_tme,
					"rea_cd" : rea_cd,
					"phto_sct_img" : "2"
				}
			}

			if (rea_cd == "50") {
				if (smutil.isEmpty($('#inv_noText').val())) {
					LEMP.Window.alert({
						"_vMessage" : "송장 번호를 입력해주세요. "
					});
					return false;
				} else if (smutil.isEmpty(page.pictures2.inv_no)
						|| smutil.isEmpty(page.pictures2.total)
						|| smutil.isEmpty(page.pictures2.odamage1)
						|| smutil.isEmpty(page.pictures2.odamage2)) {
					LEMP.Window.alert({
						"_vMessage" : "사진을 등록해주세요. "
					});
					return false;
				}
				else if(!smutil.isEmpty($('#text_cause').val())
					&& (smutil.isEmpty(page.pictures2.inv_no_c) || smutil.isEmpty(page.pictures2.total_c))
				){
					LEMP.Window.alert({
						"_vMessage" : "원인 운송장의 사진을 등록해주세요. "
					});
					
					return false;
				}
				else if($('#inv_noText').val() == $('#text_cause').val()){
					LEMP.Window.alert({
						"_vMessage" : "운송장 번호는 서로 같을수 없습니다."
					});
					
					return false;
				}
				else {
					page.apiParam.data.parameters.rea_cd_img = "22";
					page.apiParam.data.parameters.stn_inv_no = $('#text_cause').val();
					fileArray.push(page.pictures2.inv_no);
					fileArray.push(page.pictures2.total);
					fileArray.push(page.pictures2.odamage1);
					fileArray.push(page.pictures2.odamage2);
					
					if(!smutil.isEmpty(page.pictures2.inv_no_c)){
						fileArray.push(page.pictures2.inv_no_c);
					}
					
					if(!smutil.isEmpty(page.pictures2.total_c)){
						fileArray.push(page.pictures2.total_c);
					}
					
					page.apiParam.files = fileArray;
				}
			} else {
				if (smutil.isEmpty($('#inv_noText').val())) {
					LEMP.Window.alert({
						"_vMessage" : " 송장 번호를 입력해주세요 "
					});
					return false;
				} else if (smutil.isEmpty(page.pictures1.inv_no)
						|| smutil.isEmpty(page.pictures1.total)
						|| smutil.isEmpty(page.pictures1.pdamage1)
						|| smutil.isEmpty(page.pictures1.pdamage2)) {
					LEMP.Window.alert({
						"_vMessage" : " 사진을 등록해주세요 "
					});
					return false;
				} else {
					page.apiParam.data.parameters.rea_cd_img = "21";
					fileArray.push(page.pictures1.inv_no);
					fileArray.push(page.pictures1.total);
					fileArray.push(page.pictures1.pdamage1);
					fileArray.push(page.pictures1.pdamage2);
					page.apiParam.files = fileArray;
				}
			}
		
			smutil.loadingOn();
			smutil.callApi(page.apiParam);
		});
		
		$(document).on('click','.btn.red.m.w100p.b-close',function(){
			$('.mpopBox.pop3').bPopup().close();
			
		});
	},
	// 필터 구분 조회
	fltrListSearch : function() {
		smutil.loadingOn();
		var _this = this;
		_this.apiParam.param.baseUrl = "/smapis/cmn/codeListPopup";
		_this.apiParam.param.callback = "page.fltrListCallback";
		_this.apiParam.data = {
			"parameters" : {
				"typ_cd" : "ACD_TYP_CD"
			}
		};
		smutil.callApi(_this.apiParam);
	},

	// 필터 구분 조회 콜백
	fltrListCallback : function(result) {
		try{
			smutil.setSelectOptions("#FRE0201_code_template", result.data.list);
		}catch(e){}
		finally{
			smutil.loadingOff();
		}
	},
	// 송장번호 직접입력 callback
	InputCallback : function(data) {
		var date = new Date();
		page.scanStatus.ymd = date.LPToFormatDate("yyyymmdd");
		page.scanStatus.tme = date.LPToFormatDate("HHnnss");
	
		$("#" + page.invStatus).val(data.inv_no);
	},
	// 사진등록 callback
	pictureCallBack : function(data) {
		
		var num = page.pictureStatus.id.replace(/[^0-9]/g, '');
		$('#' + page.pictureStatus.id).next().next().attr('src', data.param);
		$('#' + page.pictureStatus.id).next().next().css('display', 'block');
		$('#' + page.pictureStatus.id + "_D").css('display', 'block');
		$('#' + page.pictureStatus.id).css('display', 'none');

		switch (page.pictureStatus.id) {
		case "inv_no1":
			page.pictures1.inv_no = data.param;
			break;
		case "total1":
			page.pictures1.total = data.param;
			break;
		case "damage_p1":
			page.pictures1.pdamage1 = data.param;
			break;
		case "damage_p1t":
			page.pictures1.pdamage2 = data.param;
			break;
		case "inv_no2":
			page.pictures2.inv_no = data.param;
			break;
		case "total2":
			page.pictures2.total = data.param;
			break;
		case "damage_p2":
			page.pictures2.odamage1 = data.param;
			break;
		case "damage_p2t":
			page.pictures2.odamage2 = data.param;
			break;
		case "damage2C":
			page.pictures2.inv_no_c = data.param;
			break;
		case "damage2CT":
			page.pictures2.total_c = data.param;
			break;
		}
	
	},
	//전송콜백
	sendCallback_F : function(data) {
	
		
		try{
			var res = $('#FRE0201_code_template option:selected').val();
			if (smutil.apiResValidChk(data) && data.code === "0000") {
				$('.mpopBox.pop3').bPopup();
				if (res == "50") {
					page.ParamInitO();
					$('#inv_no2_D').next().attr('src', '');
					$('#inv_no2_D').css('display', 'none');
					$('#inv_no2').css('display', 'block');
					$('#total2_D').next().attr('src', '');
					$('#total2_D').css('display', 'none');
					$('#total2').css('display', 'block');
					$('#damage_p2_D').next().attr('src', '');
					$('#damage_p2_D').css('display', 'none');
					$('#damage_p2').css('display', 'block');
					$('#damage_p2t_D').next().attr('src', '');
					$('#damage_p2t_D').css('display', 'none');
					$('#damage_p2t').css('display', 'block');
					$('#damage2C_D').next().attr('src', '');
					$('#damage2C_D').css('display', 'none');
					$('#damage2C').css('display', 'block');
					$('#damage2CT_D').next().attr('src', '');
					$('#damage2CT_D').css('display', 'none');
					$('#damage2CT').css('display', 'block');
	
				} else {
					page.ParamInit();
					$('#inv_no1_D').next().attr('src', '');
					$('#inv_no1_D').css('display', 'none');
					$('#inv_no1').css('display', 'block');
					$('#total1_D').next().attr('src', '');
					$('#total1_D').css('display', 'none');
					$('#total1').css('display', 'block');
					$('#damage_p1_D').next().attr('src', '');
					$('#damage_p1_D').css('display', 'none');
					$('#damage_p1').css('display', 'block');
					$('#damage_p1t_D').next().attr('src', '');
					$('#damage_p1t_D').css('display', 'none');
					$('#damage_p1t').css('display', 'block');
				}
			}
		}catch(e){}
		finally{
			smutil.loadingOff();
		}
	},

	ParamInitO : function() {
		page.pictures2 = {
			inv_no : "",
			total : "",
			odamage1 : "",
			odamage2 : "",
			inv_no_c : "",
			total_c : ""
		}
		$('#text_cause').val("");

	},
	ParamInit : function() {
		page.pictures1 = {
			inv_no : "",
			total : "",
			pdamage1 : "",
			pdamage2 : "",
		}

	}, 
	
	
	
	scanCallback : function(result){
		
	
		var inv_no = result.barcode;
		
		var date = new Date();
		page.scanStatus.ymd = date.LPToFormatDate("yyyymmdd");
		page.scanStatus.tme = date.LPToFormatDate("HHnnss");
		
		if(inv_no.length != 12
				|| (inv_no.substr(0,11) + ((Number(inv_no.substr(0,11))%7)+"")) != inv_no){
			LEMP.Window.alert({
				"_sTitle":"스캔오류",
				"_vMessage":"정상적인 송장번호가 아닙니다."
			});
			
			scanCallYn = "N";
		}
		
		
		$('#inv_noText').val(inv_no);

		
	},

};
