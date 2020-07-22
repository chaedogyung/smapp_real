var page = {
	// 이미지저장객체(비규격)
	pictures1 : {
		inv_no : "",
		total : "",
		width : "",
		length : "",
		height : "",
		weight : ""
	},
	pictures2 : {
		inv_no : "",
		total : "",
		width : "",
		length : "",
		height : ""
	},
	pictures3 : {
		inv_no : "",
		total : "",
		weight : ""
	},
	// 이미지 저장객체 (운임미기재)
	pictures4 : {
		inv_no : "",
		total : "",
	},
	// 이미지 저장객체 (운임불일치)
	pictures5 : {
		inv_no : "",
		total : "",
	},
	//나체품 , 포장비정상 , 기타금지화물
	pictures6 : {
		inv_no : "",
		total : "",
		width : "",
		length : "",
		height : ""
	},
	// 사진상태값저장객체
	pictureStatus : {
		id : "",
		text : ""
	},
	// 길이정보 저장 객체
	lengthInfo : {
		width : "",
		length : "",
		height : "",
		sum : ""
	},
	// 스캔정보 저장객체
	ScanStatus : {
		ymd : "",
		tme : ""
	},
	//화물신고 전역변수
	chkNonStd : "",
	tab_cd : "N",
	fare_amt : "",
	apiParamOb : {},
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
	init : function() {
		page.initInterface();
		page.fltrListSearch();
		//page.updatePicture();
	},

	initInterface : function() {
		
		$('#tabView_2').css('display', "none");
		$('#tabView_3').css('display', "none");
		//$('#lengthInfomation').css('display','none');
	
		// 처음시작시 Delete버튼 hide
		$('.btn.del4').css("display", "none");

		
		/* 최상단 탭 클릭 */
		$(".FBtn").click(function() {
			var tab_cd = $(this).data('tabCd');
			page.tab_cd = tab_cd;

			// 텝에따라 업무구분 처리 (비규격 : N, 운임미기재 : M, 운임불일치 : I )
			if (tab_cd == "N") {
				$("#tabView_3").css("display", "none");
				$("#tabView_2").css("display", "none");
				$('#tabView_1').css("display", "block");
			} else if (tab_cd == "M") {
				$("#tabView_3").css("display", "none");
				$("#tabView_2").css("display", "block");
				$('#tabView_1').css("display", "none");
			} else {
				$("#tabView_3").css("display", "block");
				$("#tabView_2").css("display", "none");
				$('#tabView_1').css("display", "none");
			}

			var btnLst = $(".FBtn");
			var btnObj;
			_.forEach(btnLst, function(obj, key) {
				btnObj = $(obj);
				if (tab_cd == btnObj.data('tabCd')) {
					btnObj.closest('li').addClass('on');
				} else {
					btnObj.closest('li').removeClass('on');
				}
			});

		});

	
		// 운송장 번호 직접 입력
		$('#inv_noText').on('click', function() {
			var id = $(this).attr('id');
			var popUrl = smutil.getMenuProp('COM.COM0102', 'url');

			LEMP.Window.open({
				"_sPagePath" : popUrl
			});
		});

		// 입력정보 키패드 호출
		$('#widthCm, #lengthCm, #heightCm ,#weightInput').on('click',function() {
			var text = $('#FRE0101_code2_template2 option:selected').text();
			var id = $(this).attr('id');
			var popUrl;
			var textVal;
			if(id == "weightInput"){
				textVal = "무게 정보 입력";
			}else{
				textVal = "길이 정보 입력";
			}
			
			popUrl = smutil.getMenuProp('FRE.FRE0501', 'url');
			LEMP.Window.open({
				"_sPagePath" : popUrl,
				"_oMessage" : {
					"textVal" : textVal,
					"id" : id
				}
			});
		});
		// 실집하 운임 키패드 호출
		$("#fare_amt").on('click', function() {
			var textVal = "실집하 운임 입력";
			var id = $(this).attr("id");
			var popUrl;
			popUrl = smutil.getMenuProp('FRE.FRE0501', 'url');
			LEMP.Window.open({
				"_sPagePath" : popUrl,
				"_oMessage" : {
					"textVal" : textVal,
					"id" : id
				}
			});
		});

		// 신고용에 따라 레이아웃변경
		$('#FRE0101_code2_template2').on('change', function() {
			page.updatePicture();
		});

		// 카메라 스캔
		$('.btn.scan').click(function() {
			LEMP.Window.openCodeReader({
				"_fCallback" : function(res) {
					if(res.result){
						if(String(res.data).length == 12 && (Number((String(res.data)).substr(0,11))%7 ==
							Number((String(res.data)).substr(11,1)))){
							var date = new Date();
							page.ScanStatus.ymd = date.LPToFormatDate("yyyymmdd");
							page.ScanStatus.tme = date.LPToFormatDate("HHnnss");
							$('#inv_noText').val(res.data);
							//BCR AI 수신/처리여부
							page.getBcrAiRcpnInfo(res.data);
						}else{
							LEMP.Window.alert({
								"_sTitle" : "경고",
								"_vMessage" : "정상적인 바코드번호가 아닙니다."
							});
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

		// 사진등록
		$('.btn.plus3').click(function() {
			if ($("#inv_noText").val().length == 0) {
				LEMP.Window.alert({
					"_vMessage" : "송장번호를 입력해주세요",
				});
			} else {
				// 선택한 tag id와 위의 text pictureStatus object에 저장
				page.pictureStatus.text = $(this).parent().prev().text();
				page.pictureStatus.id = $(this).attr("id");

				var popUrl = smutil.getMenuProp('FRE.FRE0102', 'url');
				var data = {
					"inv_no" : $("#inv_noText").val(),
					"status" : page.pictureStatus.text
				};
				LEMP.Window.open({
					"_sPagePath" : popUrl,
					"_oMessage" : {
						"param" : data
					}
				});
			}
		});

		// 사진 삭제
		$('.del4').click(function() {
			var shape = $(this).parent().prev().text();
			$("#" + $(this).attr("id")).next().attr("src", "");
			var id = $(this).attr("id");
			var num = id.replace(/[^0-9]/g, '');
			if (num == "1") {
				switch (shape) {
				case "운송장":
					page.pictures1.inv_no = "";
					break;
				case "전체":
					page.pictures1.total = "";
					break;
				case "가로":
					page.pictures1.width = "";
					break;
				case "세로":
					page.pictures1.length = "";
					break;
				case "높이":
					page.pictures1.height = "";
					break;
				case "무게":
					page.pictures1.weight = "";
					break;
				}
			} else if (num == "2") {
				switch (shape) {
				case "운송장":
					page.pictures2.inv_no = "";
					break;
				case "전체":
					page.pictures2.total = "";
					break;
				case "가로":
					page.pictures2.width = "";
					break;
				case "세로":
					page.pictures2.length = "";
					break;
				case "높이":
					page.pictures2.height = "";
					break;
				}
			} else if (num == "3") {
				switch (shape) {
				case "운송장":
					page.pictures3.inv_no = "";
					break;
				case "전체":
					page.pictures3.total = "";
					break;
				case "무게":
					page.pictures3.weight = "";
					break;
				}
			} else if (num == "4") {
				switch (shape) {
				case "운송장":
					page.pictures4.inv_no = "";
					break;
				case "전체":
					page.pictures4.total = "";
					break;
				}
			}else if(num=="6"){
				switch (shape) {
				case "운송장":
					page.pictures6.inv_no = "";
					break;
				case "전체":
					page.pictures6.total = "";
					break;
				case "가로":
					page.pictures6.width = "";
					break;
				case "세로":
					page.pictures6.length = "";
					break;
				case "높이":
					page.pictures6.height = "";
					break;
				case "무게":
					page.pictures6.weight = "";
					break;
				}
			}
			else {
				switch (shape) {
				case "운송장":
					page.pictures5.inv_no = "";
					break;
				case "전체":
					page.pictures5.total = "";
					break;
				}
			}
			$(this).prev().css("display", "block");
			$(this).css("display", "none");

		});

		// 합계 구하기
		$('#sumCm').click(function() {
			var width = Number($('#widthCm').val());
			var length = Number($('#lengthCm').val());
			var height = Number($('#heightCm').val());

			if ($('#widthCm').val().length == 0) {
				LEMP.Window.alert({
					"_vMessage" : "가로 길이를 입력해주세요",
				});
			} else if ($('#lengthCm').val().length == 0) {
				LEMP.Window.alert({
					"_vMessage" : "세로 길이를 입력해주세요",
				});
			} else if ($('#heightCm').val().length == 0) {
				LEMP.Window.alert({
					"_vMessage" : "높이 값을입력해주세요",
				});
			} else {
				$('#sumCmTri').val(width + length + height);
				page.lengthInfo.width = width;
				page.lengthInfo.length = length;
				page.lengthInfo.height = height;
				page.lengthInfo.sum = width + length + height;

			}
		});

		// 전송하기 버튼 클릭
		$("#sendDatas,#sendDatas1,#sendDatas2").click(
				function() {
					// 사진구분
					var tabStatus = $(".tabBox.li3").find('.on').children().text();
					// 가로 세로 높이 무게 (비규격에서만 필요)
					var box_l;
					var box_w;
					var box_h;
					var wgt;
					//결박개수 (결박화물)
					var strp_cnt_sct_cd = $("#FRE0101_code4_template4 option:selected").val();
					//포장상태
					var pkgng_typ_cd = $("#FRE0101_code3_template3 option:selected").val();
					// 사진이미지를 담을 배열
					var fileArray = [];
					var ob = {};

					if (tabStatus == "운임미기재") {
						if (smutil.isEmpty(page.pictures4.inv_no)
								|| smutil.isEmpty(page.pictures4.total)) {
							LEMP.Window.alert({
								"_vMessage" : "사진을 업로드 해주세요",
							});
							return false;
						} else {
							fileArray.push(page.pictures4.inv_no);
							fileArray.push(page.pictures4.total);
							ob.fileArray = fileArray;
							ob.tabStatus = "20";
							page.sendDatas(ob);
						}
					} else if (tabStatus == "운임불일치") {
						if (smutil.isEmpty(page.pictures5.inv_no)
								|| smutil.isEmpty(page.pictures5.total)) {
							LEMP.Window.alert({
								"_vMessage" : "사진을 업로드 해주세요",
							});
							return false;
						} else if (smutil.isEmpty($("#fare_amt").val())) {
							LEMP.Window.alert({
								"_vMessage" : "실집하 운임을 입력해주세요",
							});
							return false;
						} else {
							fileArray.push(page.pictures5.inv_no);
							fileArray.push(page.pictures5.total);
							ob.fileArray = fileArray;
							ob.tabStatus = "21";
							ob.fare_amt = page.fare_amt;
							page.sendDatas(ob);
						}
					} else {
						// 비규격사유코드 (비규격에서만 필요)
						var rea_cd = $(
								"#FRE0101_code2_template2 option:selected").val();
						// 비규격사유 25kg초과 일경우(무게초과)
						if (rea_cd == "03") {
							if (smutil.isEmpty(page.pictures3.inv_no)
									|| smutil.isEmpty(page.pictures3.total)
									|| smutil.isEmpty(page.pictures3.weight)) {
								LEMP.Window.alert({
									"_vMessage" : "사진을 업로드 해주세요",
								});
								return false;
							} else if (smutil
									.isEmpty(($('#weightInput').val()))) {
								LEMP.Window.alert({
									"_vMessage" : "무게 값을 입력해주세요",
								});
								return false;
							} else if (Number($('#weightInput').val()) <= 25) {
								LEMP.Window.alert({
									"_vMessage" : "무게가 25kg 이하입니다",
								});
								return false;
							} else {
								wgt = $('#weightInput').val();
								fileArray.push(page.pictures3.inv_no);
								fileArray.push(page.pictures3.total);
								fileArray.push(page.pictures3.weight);

								ob.fileArray = fileArray;
								ob.wgt = wgt;
								ob.status = rea_cd;
								ob.tabStatus = "10";
								ob.pkgng_typ_cd = pkgng_typ_cd;
								ob.strp_cnt_sct_cd = strp_cnt_sct_cd;
								page.sendDatas(ob);
							}
							// 비규격사유 결박화물일 경우
						} else if (rea_cd == "02") {
							if (smutil.isEmpty(page.pictures1.inv_no)
								|| smutil.isEmpty(page.pictures1.total)
								|| smutil.isEmpty(page.pictures1.width)
								|| smutil.isEmpty(page.pictures1.length)
								|| smutil.isEmpty(page.pictures1.height)
								|| smutil.isEmpty(page.pictures1.weight)) {
								LEMP.Window.alert({
									"_vMessage": "사진을 업로드 해주세요",
								});
								return false;
							} else if (smutil.isEmpty($("#widthCm").val())) {
								LEMP.Window.alert({
									"_vMessage": "가로 값을 입력해주세요",
								});
								return false;
							} else if (smutil.isEmpty($("#lengthCm").val())) {
								LEMP.Window.alert({
									"_vMessage": "세로 값을 입력해주세요",
								});
								return false;
							} else if (smutil.isEmpty($('#heightCm').val())) {
								LEMP.Window.alert({
									"_vMessage": "높이 값을 입력해주세요",
								});
								return false;
							} else if (smutil.isEmpty($("#sumCmTri").val())) {
								LEMP.Window.alert({
									"_vMessage": "세변의 합을 입력해주세요",
								});
								return false;
							} else if (Number($("#widthCm").val())
								+ Number($("#lengthCm").val())
								+ Number($('#heightCm').val()) != Number($(
									"#sumCmTri").val())) {
								LEMP.Window.alert({
									"_vMessage": "합계가 올바르지 않습니다",
								});
								return false;
							} else if (smutil
								.isEmpty(($('#weightInput').val()))) {
								LEMP.Window.alert({
									"_vMessage": "무게 값을 입력해주세요",
								});
								return false;
							} else if (smutil
								.isEmpty(($('#FRE0101_code3_template3').val()))) {
								LEMP.Window.alert({
									"_vMessage": "결박개수를 입력해주세요",
								});
								return false;
							} else {
								wgt = $('#weightInput').val();
								box_l = $("#widthCm").val();
								box_w = $('#lengthCm').val();
								box_h = $('#heightCm').val();

								fileArray.push(page.pictures1.inv_no);
								fileArray.push(page.pictures1.total);
								fileArray.push(page.pictures1.width);
								fileArray.push(page.pictures1.length);
								fileArray.push(page.pictures1.height);
								fileArray.push(page.pictures1.weight);

								ob.status = rea_cd;
								ob.fileArray = fileArray;
								ob.tabStatus = "10";
								ob.box_l = box_l;
								ob.box_w = box_w;
								ob.box_h = box_h;
								ob.wgt = wgt;
								ob.pkgng_typ_cd = pkgng_typ_cd;
								ob.strp_cnt_sct_cd = strp_cnt_sct_cd;
								page.sendDatas(ob);
							}
							//위험화물
						} else if (rea_cd == "08") {
							if (smutil.isEmpty(page.pictures1.inv_no)
								|| smutil.isEmpty(page.pictures1.total)
								|| smutil.isEmpty(page.pictures1.width)
								|| smutil.isEmpty(page.pictures1.length)
								|| smutil.isEmpty(page.pictures1.height)
								|| smutil.isEmpty(page.pictures1.weight)) {
								LEMP.Window.alert({
									"_vMessage": "사진을 업로드 해주세요",
								});
								return false;
							} else if (smutil.isEmpty($("#widthCm").val())) {
								LEMP.Window.alert({
									"_vMessage": "가로 값을 입력해주세요",
								});
								return false;
							} else if (smutil.isEmpty($("#lengthCm").val())) {
								LEMP.Window.alert({
									"_vMessage": "세로 값을 입력해주세요",
								});
								return false;
							} else if (smutil.isEmpty($('#heightCm').val())) {
								LEMP.Window.alert({
									"_vMessage": "높이 값을 입력해주세요",
								});
								return false;
							} else if (smutil.isEmpty($("#sumCmTri").val())) {
								LEMP.Window.alert({
									"_vMessage": "세변의 합을 입력해주세요",
								});
								return false;
							} else if (Number($("#widthCm").val())
								+ Number($("#lengthCm").val())
								+ Number($('#heightCm').val()) != Number($(
									"#sumCmTri").val())) {
								LEMP.Window.alert({
									"_vMessage": "합계가 올바르지 않습니다",
								});
								return false;
							} else if (smutil
								.isEmpty(($('#weightInput').val()))) {
								LEMP.Window.alert({
									"_vMessage": "무게 값을 입력해주세요",
								});
								return false;
							} else {
								wgt = $('#weightInput').val();
								box_l = $("#widthCm").val();
								box_w = $('#lengthCm').val();
								box_h = $('#heightCm').val();

								fileArray.push(page.pictures1.inv_no);
								fileArray.push(page.pictures1.total);
								fileArray.push(page.pictures1.width);
								fileArray.push(page.pictures1.length);
								fileArray.push(page.pictures1.height);
								fileArray.push(page.pictures1.weight);

								ob.status = rea_cd;
								ob.fileArray = fileArray;
								ob.tabStatus = "10";
								ob.box_l = box_l;
								ob.box_w = box_w;
								ob.box_h = box_h;
								ob.wgt = wgt;
								ob.pkgng_typ_cd = pkgng_typ_cd;
								ob.strp_cnt_sct_cd = strp_cnt_sct_cd;
								page.sendDatas(ob);
							}
						}
						//세변합, 최장변, 나체품, 포장비정상, 기타화물
						else{
							if (smutil.isEmpty(page.pictures6.inv_no)
									|| smutil.isEmpty(page.pictures6.total)
									|| smutil.isEmpty(page.pictures6.width)
									|| smutil.isEmpty(page.pictures6.length)
									|| smutil.isEmpty(page.pictures6.height)) {
								LEMP.Window.alert({
									"_vMessage" : "사진을 업로드 해주세요",
								});
								return false;
							} else if (smutil.isEmpty($("#widthCm").val())) {
								LEMP.Window.alert({
									"_vMessage" : "가로 값을 입력해주세요",
								});
								return false;
							} else if (smutil.isEmpty($("#lengthCm").val())) {
								LEMP.Window.alert({
									"_vMessage" : "세로 값을 입력해주세요",
								});
								return false;
							} else if (smutil.isEmpty($('#heightCm').val())) {
								LEMP.Window.alert({
									"_vMessage" : "높이 값을 입력해주세요",
								});
								return false;
							} else if (smutil.isEmpty($("#sumCmTri").val())) {
								LEMP.Window.alert({
									"_vMessage" : "세변의 합을 입력해주세요",
								});
								return false;
							} else if (Number($("#widthCm").val())
									+ Number($("#lengthCm").val())
									+ Number($('#heightCm').val()) != Number($(
									"#sumCmTri").val())) {
								LEMP.Window.alert({
									"_vMessage" : "합계가 올바르지 않습니다",
								});
								return false;
							} else {
								box_l = $("#widthCm").val();
								box_w = $('#lengthCm').val();
								box_h = $('#heightCm').val();

								fileArray.push(page.pictures6.inv_no);
								fileArray.push(page.pictures6.total);
								fileArray.push(page.pictures6.width);
								fileArray.push(page.pictures6.length);
								fileArray.push(page.pictures6.height);

								ob.status = rea_cd;
								ob.box_l = box_l;
								ob.box_w = box_w;
								ob.box_h = box_h;
								ob.fileArray = fileArray;
								ob.tabStatus = "10";
								ob.pkgng_typ_cd = pkgng_typ_cd;
								ob.strp_cnt_sct_cd = strp_cnt_sct_cd;
								page.sendDatas(ob);
							}
						}
					}
				});
		
		$(document).on('click','.btn.red.m.w100p.b-close',function(){
			$('.mpopBox.pop3').bPopup().close();
	
		});
	},
	// 스캐너 콜백
	scanCallback : function(data) {
		if((data.barcode.length == 12)&&
				(Number(data.barcode.substr(0,11))%7 == Number(data.barcode.substr(11,1)))){
			var date = new Date();
			page.ScanStatus.ymd = date.LPToFormatDate("yyyymmdd");
			page.ScanStatus.tme = date.LPToFormatDate("HHnnss");
			$('#inv_noText').val(data.barcode);
			page.getBcrAiRcpnInfo(data.barcode);
		}else{
			LEMP.Window.alert({
				"_sTitle" : "운송장번호 오류",
				"_vMessage" : "정상적인 바코드번호가 아닙니다."
			});
		}
		
		
	},
	
	// 필터 구분 조회
	fltrListSearch : function() {
		smutil.loadingOn();
			var _this = this;
			_this.apiParam.param.baseUrl = "/smapis/cmn/codeListPopup"; // api
				// no
			_this.apiParam.param.callback = "page.fltrListCallback"; // callback
				// methode
			_this.apiParam.data = {
				"parameters" : {
					"typ_cd" : "BRSH_SCT_CD"
				}
			}; // api 통신용 파라메터
				// 공통 api호출 함수
			smutil.callApi(_this.apiParam);
			page.anounce = $("#FRE0101_code2_template2 option:selected").text();
	},
	// 필터 구분조회 콜백
	fltrListCallback : function(res) {
		try{
			if (smutil.apiResValidChk(res) && res.code === "0000") {
				if(res.data.list[0].dtl_cd_nm==="본사"){
					var list = res.data.list;
					smutil.setSelectOptions("#FRE0101_code_template", list);
					page.apiParam.param.baseUrl = "/smapis/cmn/codeListPopup"; // api
					page.apiParam.param.callback = "page.fltrListCallback"; // callback
					page.apiParam.data = {
						"parameters" : {
							"typ_cd" : "NSTD_TYP_CD"
						}
					};
					smutil.callApi(page.apiParam);
				}else if(res.data.list[0].dtl_cd_nm==="나체품"){
					var list = res.data.list;
					smutil.setSelectOptions("#FRE0101_code2_template2", list);
					page.apiParam.param.baseUrl = "/smapis/cmn/codeListPopup"; // api
					page.apiParam.param.callback = "page.fltrListCallback"; // callback
					page.apiParam.data = {
						"parameters" : {
							"typ_cd" : "PKGNG_TYP_CD"
						}
					};
					smutil.callApi(page.apiParam);
					page.updatePicture();
				}else if(res.data.list[0].dtl_cd_nm==="박스"){
					//포장상태 입력
					var list = res.data.list;
					smutil.setSelectOptions("#FRE0101_code3_template3", list);
					page.apiParam.param.baseUrl = "/smapis/cmn/codeListPopup"; // api
					page.apiParam.param.callback = "page.fltrListCallback"; // callback
					page.apiParam.data = {
						"parameters" : {
							"typ_cd" : "STRP_CNT_SCT_CD"
						}
					};
					smutil.callApi(page.apiParam);
				}
				else {
					//결박개수 입력
					var list = res.data.list;
					smutil.setSelectOptions("#FRE0101_code4_template4", list);
				}
			}
		}catch(e){}
		finally{
			smutil.loadingOff();
		}

		page.apiParamInit(); // 파라메터 전역변수 초기화
	},
	
	// 신고내용에 따라 영역구성

	updatePicture : function() {
		$('#updatePictures1').css('display','none');
		$('#updatePictures2').css('display','none');
		$('#updatePictures3').css('display','none');
		$('#updatePictures6').css('display','none');
		$('#weightInfomation').css('display','none');
		$('#bindInfomation').css('display','none');
		$('#lengthInfomation').css('display','none');
		//포장상태는 전부들어감
		// $('#packingInfomation').css('display','none');

		var selected = $('#FRE0101_code2_template2 option:selected').val();
		// 01 나체품, 02 결박화물, 03 무게 초과, 04 세변합초과, 05 최장변 초과, 06 포장비정상, 07 기타금지화물, 08 위험화물
		// (03) 무게 초과일경우 	
		if (selected == "03") {
			// 운송장, 전체사진, 무게
			$('#updatePictures3').css('display', 'block');
			$('#weightInfomation').css('display', 'block');
		} else if(selected =="02"){
			// 결박화물 
			// 운송장, 전체사진, 가로, 세로, 높이, 무게 / 결박개수
			$('#updatePictures1').css('display','block');
			$('#weightInfomation').css('display', 'block');
			$('#bindInfomation').css('display', 'block');
			$('#lengthInfomation').css('display', 'block');
		} else if(selected =="08"){
			// 위험화물			
			// 운송장, 전체사진, 가로, 세로, 높이, 무게 
			$('#updatePictures1').css('display','block');
			$('#weightInfomation').css('display', 'block');
			$('#lengthInfomation').css('display', 'block');
		} 
		else{
			// 운송장, 전체사진, 가로, 세로, 높이
			$('#updatePictures6').css('display', 'block');
			$('#lengthInfomation').css('display', 'block');
		}
	},

	// 스캔 인풋 콜백
	InputCallback : function(data) {
		var date = new Date();
		page.ScanStatus.ymd = date.LPToFormatDate("yyyymmdd");
		page.ScanStatus.tme = date.LPToFormatDate("HHnnss");
		$("#inv_noText").val(data.inv_no);
		//BCR AI 수신/처리 여부확인
		page.getBcrAiRcpnInfo(data.inv_no);
	},
	// 인풋콜백
	InfoCallback : function(data) {
		if (data.id == "fare_amt") {
			page.fare_amt = data.value;
			$("#" + data.id).val(
					data.value.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
			//BCR AI 수신/처리 여부확인
			page.getBcrAiRcpnInfo(data.value);
		} else {
			$("#" + data.id).val(data.value);
			//BCR AI 수신/처리 여부확인
			page.getBcrAiRcpnInfo(data.value);
		}
	},

	// 사진등록 CallBack
	pictureCallBack : function(data) {
		var num = page.pictureStatus.id.replace(/[^0-9]/g, '');

		if (num == "1") {
			switch (page.pictureStatus.text) {
			case "운송장":
				page.pictures1.inv_no = data.param;
				break;
			case "전체":
				page.pictures1.total = data.param;
				break;
			case "가로":
				page.pictures1.width = data.param;
				break;
			case "세로":
				page.pictures1.length = data.param;
				break;
			case "높이":
				page.pictures1.height = data.param;
				break;
			case "무게":
				page.pictures1.weight = data.param;
				break;
			}
		} else if (num == "2") {
			switch (page.pictureStatus.text) {
			case "운송장":
				page.pictures2.inv_no = data.param;
				break;
			case "전체":
				page.pictures2.total = data.param;
				break;
			case "가로":
				page.pictures2.width = data.param;
				break;
			case "세로":
				page.pictures2.length = data.param;
				break;
			case "높이":
				page.pictures2.height = data.param;
				break;
			}
		} else if (num == "3") {
			switch (page.pictureStatus.text) {
			case "운송장":
				page.pictures3.inv_no = data.param;
				break;
			case "전체":
				page.pictures3.total = data.param;
				break;
			case "무게":
				page.pictures3.weight = data.param;
				break;
			}
		} else if (num == "4") {
			switch (page.pictureStatus.text) {
			case "운송장":
				page.pictures4.inv_no = data.param;
				break;
			case "전체":
				page.pictures4.total = data.param;
				break;
			}
		} else if(num == "6"){
			switch (page.pictureStatus.text) {
				case "운송장":
					page.pictures6.inv_no = data.param;
					break;
				case "전체":
					page.pictures6.total = data.param;
					break;
				case "가로":
					page.pictures6.width = data.param;
					break;
				case "세로":
					page.pictures6.length = data.param;
					break;
				case "높이":
					page.pictures6.height = data.param;
					break;
				case "무게":
					page.pictures6.weight = data.param;
					break;
			}
		}
		else {
			switch (page.pictureStatus.text) {
			case "운송장":
				page.pictures5.inv_no = data.param;
				break;
			case "전체":
				page.pictures5.total = data.param;
				break;
			}
		}

		$("#" + page.pictureStatus.id + "").css("display", "none");
		$("#" + page.pictureStatus.id + "_D").css("display", "block");
		$("#" + page.pictureStatus.id + "_D").next().attr("src", data.param);
	},

	// 전송API 호출
	sendDatas : function(res) {
		smutil.loadingOn();
		// 사진구분
		var phto_sct;
		var inv_no = $('#inv_noText').val();
		var scan_ymd = page.ScanStatus.ymd;
		var scan_tme = page.ScanStatus.tme;
		// 사진구분 이미지테이블 저장용 (비규격화물 3 ,운임미기재 6 ,운임불일치 5)
		var phto_sct_img;
		// 사유코드 이미지테이블 저장용 (비규격 :(나체품 31... ) , 운임미기재 61 , 운임불일치 51)
		var rea_cd_img;

		switch ($('.on').children().text()) {
		case "비규격":
			phto_sct = "10";
			phto_sct_img = "3";
			break;
		case "운임미기재":
			phto_sct = "20";
			phto_sct_img = "6";
			rea_cd_img = "61";
			break;
		case "운임불일치":
			phto_sct = "21";
			phto_sct_img = "5";
			rea_cd_img = "51";
			break;
		}

		page.apiParam.id = "HTTPFILE";
		page.apiParam.param.callback = "page.sendCallback"; // callback
		page.apiParam.data = {
			"parameters" : {
				"phto_sct" : phto_sct,
				"inv_no" : inv_no,
				"scan_ymd" : scan_ymd,
				"scan_tme" : scan_tme,
				"phto_sct_img" : phto_sct_img,
				"rea_cd_img" : rea_cd_img
			}
		}

		// 20 운임미기재
		if (res.tabStatus == "20") {
			page.apiParam.param.baseUrl = "/smapis/pacl/accNonFare";
		}
		// 21 운임불일치
		else if (res.tabStatus == "21") {
			page.apiParam.param.baseUrl = "/smapis/pacl/accNonMatchFare"; // api
			page.apiParam.data.parameters.fare_amt = res.fare_amt;
		} else {
			//비규격 화물 판단
			if(page.chkNonStd != "Y"){
				page.apiParamOb = res;
				page.apiParam.id = "HTTP";
				page.apiParam.param.baseUrl = "/smapis/pacl/newChkNonStd"; // api
				page.apiParam.param.callback = "page.chkNonStdCallback"; // callback
				page.apiParam.data.parameters.p_inv_no = res.box_l
				page.apiParam.data.parameters.p_box_l = res.box_l
				page.apiParam.data.parameters.p_box_w = res.box_w
				page.apiParam.data.parameters.p_wgt = res.wgt
				page.apiParam.data.parameters.p_pkgng_typ_cd = $("#FRE0101_code3_template3 option:selected").val();
				page.apiParam.data.parameters.p_nstd_typ_cd = "04"
				page.apiParam.data.parameters.p_strp_cnt_sct_cd = $("#FRE0101_code4_template4 option:selected").val();
				smutil.callApi(page.apiParam);
				return;
			}

			page.apiParam.param.baseUrl = "/smapis/pacl/newAccNonStd"; // api
			// 비규격 전송
			switch ($("#FRE0101_code2_template2 option:selected").text()) {
				case "나체품":
					rea_cd_img = "31";
					break;
				case "결박화물":
					rea_cd_img = "32";
					break;
				case "25Kg초과":
					rea_cd_img = "33";
					break;
				case "무게 초과":
					rea_cd_img = "33";
					break;					
				case "세변합 160Cm초과":
					rea_cd_img = "34";
					break;
				case "세변합 초과":
					rea_cd_img = "34";
					break;					
				case "최장변 120Cm초과":
					rea_cd_img = "35";
					break;
				case "최장변 초과":
					rea_cd_img = "35";
					break;					
				case "포장비정상":
					rea_cd_img = "36";
					break;
				case "기타금지화물":
					rea_cd_img = "37";
					break;
				case "기타화물":
					rea_cd_img = "37";
					break;
				case "위험화물":
					rea_cd_img = "37";
					break;
			}
			page.apiParam.data.parameters.rea_cd_img = rea_cd_img;
			page.apiParam.data.parameters.rea_cd = res.status;
			page.apiParam.data.parameters.pkgng_typ_cd = $("#FRE0101_code3_template3 option:selected").val();

			//결박화물
			if(res.status == "02"){
				page.apiParam.data.parameters.box_l = res.box_l;
				page.apiParam.data.parameters.box_w = res.box_w;
				page.apiParam.data.parameters.box_h = res.box_h;
				page.apiParam.data.parameters.wgt = res.wgt;
				page.apiParam.data.parameters.strp_cnt_sct_cd = $("#FRE0101_code4_template4 option:selected").val();
			}//무게초과
			else if(res.status == "03"){
				page.apiParam.data.parameters.wgt = res.wgt;
			}//나체품, 세변의합초과, 최장변초과, 포장비정상, 기타화물
			else if(res.status == "01" || res.status == "04" || res.status == "05" || res.status == "06" || res.status == "07"){
				page.apiParam.data.parameters.box_l = res.box_l;
				page.apiParam.data.parameters.box_w = res.box_w;
				page.apiParam.data.parameters.box_h = res.box_h;
			}//위험화물
			else if(res.status == "08"){
				page.apiParam.data.parameters.box_l = res.box_l;
				page.apiParam.data.parameters.box_w = res.box_w;
				page.apiParam.data.parameters.box_h = res.box_h;
				page.apiParam.data.parameters.wgt = res.wgt;
			}
		}
		page.apiParam.files = res.fileArray;
		smutil.callApi(page.apiParam);

	},

	// 비규격 화물 판단 정보 콜백
	chkNonStdCallback : function(res) {
		try{
			if (smutil.apiResValidChk(res) && res.code === "0000") {
				page.chkNonStd = res.rtn_yn;
				if(page.chkNonStd == "Y"){
					page.sendDatas(page.apiParamOb);
				}
				else{
					LEMP.Window.toast({
						"_sMessage" : res.message,
						"_sDuration" : "short"
					});
					smutil.loadingOff();
				}
			}
		}catch(e){
			smutil.loadingOff();
		}
		finally{

		}
	},

	// 전송 콜백
	sendCallback : function(res) {
		try{
			if (smutil.apiResValidChk(res) && res.code === "0000") {
				$('.mpopBox.pop3').bPopup();

				var imageTagArray = [ "Inv_no1", "total1", "width1", "length1",
					"height1", "weight1", "Inv_no2", "total2", "width2",
					"length2", "height2", "Inv_no3", "total3", "weight3",
					"Inv_no6", "total6", "width6", "length6", "height6"];

				var tabStatus = $('.tabBox.li3').find('.on').children().text();


				if (tabStatus == "운임미기재") {
					$('#Inv_no4_D').next().attr("src", "");
					$('#total4_D').next().attr("src", "");
					$("#Inv_no4_D").css("display", "none");
					$("#total4_D").css("display", "none");
					$("#Inv_no4").css("display", "block");
					$("#total4").css("display", "block");
					page.ParamInitMi();

				} else if (tabStatus == "운임불일치") {
					$('#Inv_no5_D').next().attr("src", "");
					$('#total5_D').next().attr("src", "");
					$("#Inv_no5_D").css("display", "none");
					$("#total5_D").css("display", "none");
					$("#Inv_no5").css("display", "block");
					$("#total5").css("display", "block");
					$('#fare_amt').val("");
					page.ParamInitIn();

				} else {
					_.forEach(imageTagArray, function(value) {
						$('#' + value + "_D").next().attr("src", "");
						$('#' + value + "_D").css("display", "none");
						$('#' + value).css("display", "block");
						page.ParamInitNon();
					});
					$('#widthCm').val("");
					$('#lengthCm').val("");
					$('#heightCm').val("");
					$('#sumCmTri').val("")
					$('#weightInput').val("");
					page.chkNonStd = "";
				}
			}

		}catch(e){}
		finally{
			page.apiParamInit(); //파라메타 초기화
			smutil.loadingOff();
		}
	},


	// Parameter 비규격 초기화
	ParamInitNon : function() {
		page.pictures1 = {
			inv_no : "",
			total : "",
			width : "",
			length : "",
			height : "",
			weight : ""
		}
		page.pictures2 = {
			inv_no : "",
			total : "",
			width : "",
			length : "",
			height : ""
		}
		page.pictures3 = {
			inv_no : "",
			total : "",
			weight : ""
		}
		// 길이정보 저장 객체
		page.lengthInfo = {
			width : "",
			length : "",
			height : "",
			sum : ""
		}
		page.pictures6 = {
			inv_no : "",
			total : "",
			width : "",
			length : "",
			height : "",
			weight : ""
		}
	},
	// parameter 운임미기재 초기화
	ParamInitMi : function() {
		page.pictures4 = {
			inv_no : "",
			total : "",
		}
	},
	// parameter 운임불일치 초기화
	ParamInitIn : function() {
		page.pictures5 = {
			inv_no : "",
			total : "",
		}
		page.fare_amt = "";
	},
	// api 파람메터 초기화
	apiParamInit : function() {
		page.apiParam = {
			id : "HTTP", // 디바이스 콜 id
			param : { // 디바이스가 알아야할 데이터
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
		};
	},
	// BCR AI 수신/처리 여부
	getBcrAiRcpnInfo : function(code) {
		if(page.tab_cd != "N"){
			return;
		}
		smutil.loadingOn();
		var _this = this;
//		page.apiParamInit(); // 파라메터 전역변수 초기화
		_this.apiParam.param.baseUrl = "smapis/pacl/getBcrAiRcpnInfo";
		_this.apiParam.param.callback = "page.getBcrAiRcpnInfoCallback";
		_this.apiParam.data = {
			"parameters" : {
				"inv_no" : code
			}
		};
		smutil.callApi(_this.apiParam);
		
	},
	//BCR AI 수신/처리 여부콜백
	getBcrAiRcpnInfoCallback : function(res) {
		try{
			if(smutil.apiResValidChk(res) && res.code === "0000" && res.data_count!=0 && res.data.list[0].rcpn_yn == "Y"){
				LEMP.Window.toast({
					"_sMessage" : "이미 신고된 번호입니다.\n위험화물만 신고 가능합니다",
					"_sDuration" : "long"
				});

				//BCR AI Y 수신시 위험화물로 변경
				$("#FRE0101_code2_template2").val("08").prop("selected", true);
				page.updatePicture();
			}
		}catch(e){console.log(e)}
		finally{
			smutil.loadingOff();
		}
		
	}
	
};
