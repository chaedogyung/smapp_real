var page = {
	isBackground : false,
	// 집배 센터명
	jibbae : "",
	// 집배 센터코드
	scanCode : "",
	detail : "",
	inv_noV : {
		sign : "",
		cancle : "",
		//isBackground : null
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
	apiParamInit:function(){
		page.apiParam.param.baseUrl="";
		page.apiParam.param.callback="";
		page.apiParam.data.parameters={};
	},
	init : function() {
		page.getSmInfo();
		page.scanCnt();
		page.initInterface();
	},
	initInterface : function() {
		// 도착조회 click
		$('#arriSearch').click(function() {
			var popUrl = smutil.getMenuProp('ARI.ARI0102', 'url');
			LEMP.Window.open({
				"_sPagePath" : popUrl,
				"_oMessage" : {
					"sdar_sct_cd" : "A"
				}
			});
		});
		// 연계일보정보 click
		$('#yunKil').click(function() {
			var popUrl = smutil.getMenuProp('ARI.ARI0103', 'url');
			LEMP.Window.open({
				"_sPagePath" : popUrl,
			});
		});
		// 연계일보 팝업
		$('#searchYun').click(function() {
			var popUrl = smutil.getMenuProp('ARI.ARI0104', 'url');
			LEMP.Window.open({
				"_sPagePath" : popUrl,
				"_oMessage" : {
					"sdar_sct_cd" : "A",
					"base_brsh_cd" : page.scanCode,
					"cldl_cenr_nm" : page.jibbae
				}
			});
		});
		// 연계일보정보
		$('#yunInfoScan').click(function() {
			LEMP.Window.openCodeReader({
				"_fCallback" : function(res) {
					if (res.result) {
						var str = String(res.data);
						if (str.length == 12 &&
								(str.substr(0, 1) === "9" ||
										(str.substr(0, 1) === "8" &&
										Number(str.substr(0, 11)) % 7 == Number(str.substr(11, 1))))) {
							$('#yunKil').val(res.data);
							page.dtlyk();
						} else {
							LEMP.Window.toast({
								"_sMessage":"정상적인 바코드번호가 아닙니다.",
								'_sDuration' : 'short'
							});
							
//							LEMP.Window.alert({
//								"_sTitle" : "경고",
//								"_vMessage" : "정상적인 바코드번호가 아닙니다."
//							});
						}
						return false;
					} else {
						LEMP.Window.toast({
							"_sMessage":"바코드를 읽지 못했습니다.",
							'_sDuration' : 'short'
						});
						
//						LEMP.Window.alert({
//							"_sTitle" : "경고",
//							"_vMessage" : "바코드를 읽지 못했습니다."
//						});
						return false;
					}
				}
			});
		});
		// 송장스캔

		$('#invScan').click(function() {
			if (smutil.isEmpty($('#yunKil').val())) {
				LEMP.Window.toast({
					"_sMessage":"연계일보 번호가 없습니다",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_vMessage" : "연계일보 번호가 없습니다"
//				});
				return false;
			} else if (smutil.isEmpty($('#counp').val())) {
				LEMP.Window.toast({
					"_sMessage":"상대점소 정보가 없습니다",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_vMessage" : "상대점소 정보가 없습니다"
//				});
				return false;
			} else if (smutil.isEmpty($('#carN').val())) {
				LEMP.Window.toast({
					"_sMessage":"차량번호가 없습니다",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_vMessage" : "차량번호가 없습니다"
//				});
				return false;
			} else {
				var popUrl = smutil.getMenuProp('COM.COM0102', 'url');
				LEMP.Window.open({
					"_sPagePath" : popUrl
				});
			}

		});
		$('#invCame').click(function() {
			if (smutil.isEmpty($('#yunKil').val())) {
				LEMP.Window.toast({
					"_sMessage":"연계일보 번호가 없습니다",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_vMessage" : "연계일보 번호가 없습니다"
//				});
				return false;
			} else if (smutil.isEmpty($('#counp').val())) {
				LEMP.Window.toast({
					"_sMessage":"상대점소 정보가 없습니다 ",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_vMessage" : "상대점소 정보가 없습니다 "
//				});
				return false;
			} else if (smutil.isEmpty($('#carN').val())) {
				LEMP.Window.toast({
					"_sMessage":"차량번호가 없습니다 ",
					'_sDuration' : 'short'
				});
//				LEMP.Window.alert({
//					"_vMessage" : "차량번호가 없습니다 "
//				});
				return false;
			} else {
				LEMP.Window.openCodeReader({
					"_fCallback" : function(res) {
						if (res.result) {
							if (String(res.data).length == 12) {
								page.inv_noV.sign = String(res.data);
								page.InputChange();
							} else {
								LEMP.Window.toast({
									"_sMessage":"정상적인 바코드번호가 아닙니다.",
									'_sDuration' : 'short'
								});
//								LEMP.Window.alert({
//									"_sTitle" : "경고",
//									"_vMessage" : "정상적인 바코드번호가 아닙니다."
//								});
								smutil.callTTS("0", "0", null, page.isBackground);
								return false;								
							}
						} else {
							LEMP.Window.toast({
								"_sMessage":"바코드를 읽지 못했습니다.",
								'_sDuration' : 'short'
							});
//							LEMP.Window.alert({
//								"_sTitle" : "경고",
//								"_vMessage" : "바코드를 읽지 못했습니다."
//							});
							smutil.callTTS("0", "0", null, page.isBackground);
							return false;
						}
					}
				});
			}
		});

		// 스캔 취소
		$(document).on("click", ".btn.del2", function() {
			page.inv_noV.cancle = $(this).prev().text().replace(/\-/g, '');
			$('.mpopBox.img.cancel').bPopup();
		});

		// 스캔 취소 확인 버튼 클릭
		$('#agree').click(function() {
			$('.mpopBox.img.cancel').bPopup().close();
			var alcr_no = $('#yunKil').val();
			var base_brsh_cd = page.scanCode;

			smutil.loadingOn();

			page.apiParam.param.baseUrl = "/smapis/net/scanCcl";
			page.apiParam.param.callback = "page.ScanCclCallback";
			page.apiParam.data.parameters = {
				"sdar_sct_cd" : "A",
				"alcr_no" : alcr_no,
				"base_brsh_cd" : base_brsh_cd,
				"inv_no" : page.inv_noV.cancle

			};
			// 공통 api호출 함수

			smutil.callApi(page.apiParam);
		});
		// 스캔 취소 버튼 클릭
		$('#disagress').click(function() {
			$('.mpopBox.img.cancel').bPopup().close();
		});
		// 스캔 전송
		$('#sendP').on('click', function() {
			var count = $('.li.list').length;
			if (count == 0 || smutil.isEmpty($('.li.list'))) {
				LEMP.Window.toast({
					"_sMessage":"전송할 송장 번호가 없습니다",
					'_sDuration' : 'short'
				});		
//				LEMP.Window.alert({
//					"_vMessage" : "전송할 송장 번호가 없습니다"
//				});
				return false;
			} else {
				smutil.loadingOn();
				var alcr_no = $('#yunKil').val();
				var base_brsh_cd = page.scanCode;
				smutil.loadingOn();
				page.apiParam.param.baseUrl = "/smapis/net/scanTrsm";
				page.apiParam.param.callback = "page.ScanSenCallback";
				page.apiParam.data.parameters = {
					"sdar_sct_cd" : "A",
					"alcr_no" : alcr_no,
					"base_brsh_cd" : base_brsh_cd,
				};

				smutil.callApi(page.apiParam);
			}
			
			page.scanCnt();
		});
		// 스캔 전송 확인 클릭
		$('#scanSFi').click(function() {
			$('.mpopBox.send.pop1').bPopup().close();
		});
	},

	getSmInfo : function() {
		smutil.loadingOn();
		page.apiParam.param.baseUrl = "/smapis/cmn/smInf";
		page.apiParam.param.callback = "page.getSmInfoCallback";
		smutil.callApi(page.apiParam);
	},

	// 연계일보 상세조회
	dtlyk : function() {
		smutil.loadingOn();
		var sdar_sct_cd = "A";
		var alcr_no = $('#yunKil').val();
		var base_brsh_cd;
		page.apiParam.param.baseUrl = "/smapis/net/alcrDtl"; // api no
		page.apiParam.param.callback = "page.dtlykCallback"; // callback
																// methode
		page.apiParam.data = {
			"parameters" : {
				"sdar_sct_cd" : sdar_sct_cd,
				"alcr_no" : alcr_no,
				"base_brsh_cd" : page.scanCode
			}
		}; // api 통신용 파라메터

		// 공통 api호출 함수
		smutil.callApi(page.apiParam);
	},
	// 스캔 리스트 조회
	scanList : function(data) {
		smutil.loadingOn();
		var sdar_sct_cd = "A";
		var alcr_no = $('#yunKil').val();
		var prtn_brsh_cd = data.data.list[0].prtn_brsh_cd;
		var vhc_mgr_no = data.data.list[0].vhc_mgr_no;

		page.apiParam.param.baseUrl = "/smapis/net/scanList"; // api no
		page.apiParam.param.callback = "page.scanListCallback"; // callback
																// methode
		page.apiParam.data = {
			"parameters" : {
				"sdar_sct_cd" : sdar_sct_cd,
				"alcr_no" : alcr_no,
				"base_brsh_cd" : page.scanCode,
				"prtn_brsh_cd" : prtn_brsh_cd,
				"vhc_mgr_no" : vhc_mgr_no
			}
		}

		smutil.callApi(page.apiParam);
	},
	getSmInfoCallback : function(res) {
		// page.scanCode
		try {
			if (smutil.apiResValidChk(res) && res.code === "0000") {
				$('#scanP').text(res.cldl_cenr_nm);
				page.scanCode = res.cldl_cenr_cd;
				page.jibbae = res.cldl_cenr_nm;
			}
		} catch (e) {
		} finally {
			smutil.loadingOff();
		}
	},
	// 연계일보 번호 callback
	Input_yCallback : function(data) {

		$('#yunKil').val(data.yinfo);

		smutil.loadingOn();
		// 연계일보 상세조회 호출
		page.dtlyk();

	},
	// 연계일보 상세조회 callback
	dtlykCallback : function(data) {
		try {
			if (smutil.apiResValidChk(data) && data.code === "0000"
					&& data.data_count != 0) {
				page.detail = data.data.list[0];
				$('#counp').val(data.data.list[0].prtn_brsh_nm);
				$('#carN').val(data.data.list[0].vhc_no);
				// 스캔리스트 조회 호출
				page.scanList(data);
			} else {
				LEMP.Window.toast({
					"_sMessage":"조회된 데이터가 없습니다",
					'_sDuration' : 'short'
				});		
//				LEMP.Window.alert({
//					"_vMessage" : "조회된 데이터가 없습니다"
//				});
				$('#counp').val("");
				$('#carN').val("");
				$('#invScan').val("");
				var data_r={};
				var source = $("#COM0101_list_template").html();
				var template = Handlebars.compile(source);
				$(".boxList").html(template(data_r));
			}

		} catch (e) {
		} finally {
			smutil.loadingOff();
		}

	},
	// 스캔리스트 조회 콜백
	scanListCallback : function(data) {
		try {

			// 리스트 초기화
//			$(".boxList").html('');
			var data_r = {};
			
			if (smutil.apiResValidChk(data) && data.code === "0000") {
				var list = data.data.list;
				var array = new Array();
				_.forEach(list, function(v, i) {
					var data = {
						"invNo" : v.inv_no.replace(/([0-9]{4})([0-9]{4})([0-9]{4})/, "$1-$2-$3"),
						"invNoId" : v.inv_no
					};
					array.push(data);

				});

				data_r.list = array;

				// var code =
				// data.data.list.inv_no.replace(/([0-9]{4})([0-9]{4})([0-9]{4})/,"$1-$2-$3");
				// handlebars template 불러오기
				// handlebars template pre 컴파일
				// handlebars template에 binding할 data
				// var data_r={"list":[{"invNo":code, "invNoId" : data.inv_no}]}
				// 생성된 태그에 binding한 템플릿 data를 출력
				
				
				if(data_r.list.length > 0){
					$("#scanCount").text(data_r.list.length);
				}
				else{
					$("#scanCount").text("0");
				}
				
			}
			else{
				$("#scanCount").text("0");
			}
			var source = $("#COM0101_list_template").html();
			var template = Handlebars.compile(source);
			$(".boxList").html(template(data_r));

		} catch (e) {
		} finally {
			smutil.loadingOff();
		}
	},
	// 스캔 콜백
	scanCallback : function(data) {
		if (smutil.isEmpty($('#yunKil').val())) {
			LEMP.Window.toast({
				"_sMessage":"연계일보 번호가 없습니다",
				'_sDuration' : 'short'
			});			
//			LEMP.Window.alert({
//				"_vMessage" : "연계일보 번호가 없습니다"
//			});
			smutil.callTTS("0", "0", null, page.isBackground);
			return false;
		} else if (smutil.isEmpty($('#counp').val())) {
			LEMP.Window.toast({
				"_sMessage":"상대점소 정보가 없습니다",
				'_sDuration' : 'short'
			});	
//			LEMP.Window.alert({
//				"_vMessage" : "상대점소 정보가 없습니다"
//			});
			smutil.callTTS("0", "0", null, page.isBackground);
			return false;
		} else if (smutil.isEmpty($('#carN').val())) {
			LEMP.Window.toast({
				"_sMessage":"차량번호가 없습니다",
				'_sDuration' : 'short'
			});	
//			LEMP.Window.alert({
//				"_vMessage" : "차량번호가 없습니다"
//			});
			smutil.callTTS("0", "0", null, page.isBackground);
			return false;
		} else {
			page.inv_noV.sign = data.barcode;
			page.isBackground = data.isBackground;					// app이 background 상태인지 설정
			page.InputChange();
		}
	},
	// 송장번호 입력 콜백
	InputCallback : function(data) {
		page.inv_noV.sign = data.inv_no;
		page.InputChange();
	},
	InputChange : function() {
		var sdar_sct_cd = "A";
		var scan_dtm;
		var alcr_no = $('#yunKil').val();
		var prtn_brsh_cd = page.detail.prtn_brsh_cd;
		var base_brsh_cd = page.scanCode;
		var vhc_mgr_no = page.detail.vhc_mgr_no;

		var invNo = page.inv_noV.sign;
		var plag = false;
		// 입력받은 송장번호가 목록에 있는지 확인
		$(".li.list").each(function(i, r) {
			if (($(r).find("span").text().replace(/\-/g, '')+"") == invNo) {
				plag = true;
				return false;
			}
		});
		if (invNo.length == 12) {
			if (!plag) {
				var Current_date = new Date();
				scan_dtm = Current_date.LPToFormatDate("yyyymmddHHnnss");

				// var code=obj.val();
				// data.inv_no=obj.val();
				// data.scan_dtm=Current_date;
				// 송장번호 유효성 검증
				if (Number(invNo.substr(0, 11)) % 7 == Number(invNo.substr(11,1))) {

					smutil.loadingOn();

					page.apiParam.param.baseUrl = "smapis/net/scanRgst";
					page.apiParam.param.callback = "page.ScanRgstCallback";
					page.apiParam.data.parameters = {
						"sdar_sct_cd" : "A",
						"scan_dtm" : scan_dtm,
						"alcr_no" : alcr_no,
						"prtn_brsh_cd" : prtn_brsh_cd,
						"base_brsh_cd" : base_brsh_cd,
						"vhc_mgr_no" : vhc_mgr_no,
						"inv_no" : invNo

					};
					
					page.apiParam.isBackground = page.isBackground;		// app이 background 상태인지 설정

					// 공통 api호출 함수
					smutil.callApi(page.apiParam);

				} else {
					LEMP.Window.toast({
						"_sMessage":"정상적인 바코드번호가 아닙니다.",
						'_sDuration' : 'short'
					});	
//					LEMP.Window.alert({
//						"_sTitle" : "경고",
//						"_vMessage" : "정상적인 바코드번호가 아닙니다."
//					});
					// $("#invScan").val("");
					smutil.callTTS("0", "0", null, page.isBackground);
					return false;
				}
			} else {
				LEMP.Window.toast({
					"_sMessage":"중복된 송장번호 입니다.",
					'_sDuration' : 'short'
				});	
//				LEMP.Window.alert({
//					"_sTitle" : "경고",
//					"_vMessage" : "중복된 송장번호 입니다."
//				});
				// $("#invScan").val("");
				smutil.callTTS("0", "0", null, page.isBackground);
				return false;
			}
		} else {
			LEMP.Window.toast({
				"_sMessage":"정상적인 바코드번호가 아닙니다.",
				'_sDuration' : 'short'
			});	
//			LEMP.Window.alert({
//				"_sTitle" : "경고",
//				"_vMessage" : "정상적인 바코드번호가 아닙니다."
//			});
			smutil.callTTS("0", "0", null, page.isBackground);
			return false;
		}
	},
	ScanRgstCallback : function(data) {
		var code = page.inv_noV.sign;

		try {
			if (smutil.apiResValidChk(data) && data.code === "0000") {
				var codeI = code.replace(/([0-9]{4})([0-9]{4})([0-9]{4})/,"$1-$2-$3");
				// handlebars template 불러오기
				$('#invScan').val(codeI);

				var source = $("#COM0101_list_template").html();
				// handlebars template pre 컴파일
				var template = Handlebars.compile(source);
				// handlebars template에 binding할 data
				var data = {
					"list" : [ {
						"invNo" : codeI,
						"invNoId" : code
					} ]
				}
				
				if ($(".boxList > li:eq(0)").attr("class")=="noList") {
					$(".boxList").empty();
				};
				// 생성된 태그에 binding한 템플릿 data를 출력
				$(".boxList").append(template(data));
				smutil.callTTS("1", "0", null, page.isBackground);
				
				page.scanCallbackCnt();
			} else {
				LEMP.Window.toast({
					// "_sMessage" : "스캔 통신 에러",
					"_sMessage" : data.message,
					"_sDuration" : "short"
				});
				smutil.callTTS("0", "0", null, page.isBackground);
			}
		} catch (e) {
		} finally {
			smutil.loadingOff();
		}
	},
	// 스캔 취소 콜백
	ScanCclCallback : function(data) {
		try {
			if (smutil.apiResValidChk(data) && data.code === "0000") {

				$('#' + page.inv_noV.cancle).remove();
				if (page.inv_noV.cancle.replace(/([0-9]{4})([0-9]{4})([0-9]{4})/, "$1-$2-$3") == $('#invScan').val()) {
					$('#invScan').val("");
				}
				page.scanCallbackCnt();
			}
		} catch (e) {
		} finally {
			smutil.loadingOff();
		}
	},
	// 스캔 전송 콜백
	ScanSenCallback : function(data) {

		try {
			if (smutil.apiResValidChk(data) && data.code === "0000") {
				var count = $('.li.list').length;
				$('.mpopBox.send.pop1').bPopup();
				$('#scanDataN').text("스캔된 데이터 " + count + "건 데이터 전송이 완료 되었습니다");
				$('#invScan').val("");
				$('.boxList').empty();
			}
		} catch (e) {
		} finally {
			smutil.loadingOff();
		}
	},
	// 연계일보팝업 콜백
	ARI0101numberCallback : function(data) {
		$('#yunKil').val(data.param);
		$('#scanP').text(data.scannm);
		page.scanCode = data.scancd;
		page.jibbae = data.jibbae;
		
		smutil.loadingOn();
		// 연계일보 상세조회 호출
		page.dtlyk();
		page.scanCallbackCnt();
	},
	scanCnt:function(){
		var Current_date = new Date();
		Current_date = Current_date.LPToFormatDate("yyyymmdd");
		
		smutil.loadingOn();
		page.apiParamInit();
		
		page.apiParam.param.baseUrl = "smapis/net/scanCnt";
		page.apiParam.param.callback = "page.scanCntCallback";
		page.apiParam.data.parameters = {"sdar_sct_cd":"A","base_ymd":Current_date};
		
		smutil.callApi(page.apiParam);
	},
	scanCntCallback:function(res){
		try {
			if (smutil.apiResValidChk(res) && res.code==="0000") {
				var key = Object.keys(res.data.list[0])
				for (var i = 0; i < key.length; i++) {
					$("#"+key[i]+" > span").text(res.data.list[0][key[i]])
				}
			}
		} catch (e) {}
		finally{
			smutil.loadingOff();
		}
		
	},
	
	
	//전송버튼 우측의 카운트
	scanCallbackCnt: function(){
		var li = $(".boxList > li");
		if (!li.hasClass("noList")) {
			$("#scanCount").html(li.length);
		}else {
			$("#scanCount").html("0");
		}
	}
}