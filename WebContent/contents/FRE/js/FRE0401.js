var page = {
	//접속 일자
//	FRE0401:{},
	apiParam : {
		id:"HTTP",												// 디바이스 콜 id
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
	},
	
	init:function(){
		page.initEvent();
		page.initDisplay();
	},
	
	initEvent: function(){
//		$('.tab_A,.tab_R').css("display", "none");
//		$('#conBody_2').css("display", "none");
		
		//시작일 달력 팝업
		$(document).on('click','#stDate,#enDate',function(){
			var popUrl = smutil.getMenuProp("COM.COM0302","url");
			LEMP.Window.open({
				"_sPagePath" : popUrl
			});
		});
		
		/* 최상단 탭 클릭 */
		$(".btn.FBtn_2").click(function() {
			var tab_cd = $(this).data('tabCd');

			// 텝에따라 업무구분 처리 (비규격 : N, 운임미기재 : M, 운임불일치 : I )
			if (tab_cd == "A") {
				$(".tab_A").css("display","block");
				$(".tab_R").css("display","none");
			}else {
				$(".tab_A").css("display","none");
				$(".tab_R").css("display","block");
			}

			var btnLst = $(".btn.FBtn_2");
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
		
		$(document).on("click",".fre_inv_no",function(){
			var popUrl = smutil.getMenuProp("FRE.FRE0301","url")
			LEMP.Window.open({
				"_sPagePath":popUrl,
				"_oMessage":{
					"param":{
						"inv_no":$(this).data("invNo")
					}
				}
			})
		});
		
		$(".btn.red").click(function(){
			var tab_cd = $("#tab_btn_ul").find(".on > button").data("tabCd");
			switch (tab_cd) {
			case "A":
				page.pcadlist();
				break;
			case "R":
				page.rspsDstbList();
				break;
			}
		});
		
	},
	
	initDisplay : function(){
		$(".tab_R").css("display","none");
		//시작일은 현재일자의 6일전, 종료일은 현재일자로 기본값 세팅 
		var date = new Date();
		
		$('#enDate').val(date.LPToFormatDate("yyyy.mm.dd"));
		$('#stDate').val(date.LPAddDay(-6).LPToFormatDate("yyyy.mm.dd"));
	},
	
	popCallback : function(res){
		$('#stDate').val(res.start);
		$('#enDate').val(res.end);
	},
	
	pcadlist : function(){
		smutil.loadingOn();
		
		page.apiParam.param.baseUrl="smapis/pacl/pcadlist";
		page.apiParam.param.callback="page.pcadlistCallback";
		page.apiParam.data.parameters={
			"srch_start_ymd" : $('#stDate').val().replace(/\./gi,""),
			"srch_end_ymd":$('#enDate').val().replace(/\./gi,"")
		};
		
		smutil.callApi(page.apiParam);
	},
	
	pcadlistCallback : function(res){
		try {
			//test
			res.data.list=[
				{
					"pick_ymd":"9/11",
					"acd_typ_nm":"파손",
					"gds_amt":"10,000",
					"item_knd_nm":"의류",
					"inv_no":"231868680799"
				},
				{
					"pick_ymd":"9/11",
					"acd_typ_nm":"파손",
					"gds_amt":"20,000",
					"item_knd_nm":"의류",
					"inv_no":"231868680799"
				},
				{
					"pick_ymd":"9/11",
					"acd_typ_nm":"파손",
					"gds_amt":"30,000",
					"item_knd_nm":"의류",
					"inv_no":"231868680799"
				}
			]
			for (var i = 0; i < res.data.list.length; i++) {
				res.data_count++;
			}
			//
			
			if (res.code==="0000" 
				&& smutil.apiResValidChk(res) 
				&& res.data_count > 0
				) {
				var list = res.data.list
				for (var i = 0; i < list.length; i++) {
					list[i].invNo = list[i].inv_no.replace(/^(\d{4})(\d{4})(\d{4})$/,"$1-$2-$3"); 
				}
				var template = Handlebars.compile($("#FRE0401_tab_A_template").html());
				$("#FRE0401_tab_A").html(template(res.data));
				$(".tab_R").css("display","none");
				console.log(res);
			}
		} catch (e) {
			console.log(e);
		} finally {
			smutil.loadingOff();
		}
	},
	
	rspsDstbList:function(){
		smutil.loadingOn();
		
		page.apiParam.param.baseUrl="smapis/pacl/rspsDstbList";
		page.apiParam.param.callback="page.rspsDstbListCallback";
		page.apiParam.data.parameters={
			"srch_start_ymd" : $('#stDate').val().replace(/\./gi,""),
			"srch_end_ymd":$('#enDate').val().replace(/\./gi,"")
		};
		
		smutil.callApi(page.apiParam);
	},
	
	rspsDstbListCallback: function(res){
		try {
			//test
			res.data.list=[
				{
					"act_typ_nm":"파손",
					"agr_sum_amt":"10,000",
					"shex_sum_amt":"4,000",
					"judg_rst_conf_yn":"Y",
					"inv_no":"231868680799"
				},
				{
					"act_typ_nm":"파손",
					"agr_sum_amt":"20,000",
					"shex_sum_amt":"5,000",
					"judg_rst_conf_yn":"N",
					"inv_no":"231868680799"
				},
				{
					"act_typ_nm":"파손",
					"agr_sum_amt":"30,000",
					"shex_sum_amt":"6,000",
					"judg_rst_conf_yn":"Y",
					"inv_no":"231868680799"
				},
			]
			for (var i = 0; i < res.data.list.length; i++) {
				res.data_count++;
			}
			//
			if (res.code==="0000" 
				&& smutil.apiResValidChk(res) 
				&& res.data_count > 0
				) {
				var list = res.data.list
				for (var i = 0; i < list.length; i++) {
					list[i].invNo = list[i].inv_no.replace(/^(\d{4})(\d{4})(\d{4})$/,"$1-$2-$3"); 
				}
				var template = Handlebars.compile($("#FRE0401_tab_R_template").html());
				$("#FRE0401_tab_R").html(template(res.data));
				$(".tab_A").css("display","none");
			}
		} catch (e) {
			console.log(e);
		} finally {
			smutil.loadingOff();
		}
		
	}
};

