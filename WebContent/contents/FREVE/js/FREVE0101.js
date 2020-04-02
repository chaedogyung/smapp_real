var page = {
	updateStatus : ""
	,apiParam : {
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
		},// api 통신용 파라메터
	}
	,init:function(){
		page.initDisplay();
		page.initEvent();
	}
	,initEvent : function(){
		//li태그의 이벤트
		$(document).on("click",".quickMenuBox.favo li",function(){
			var data={
				"fvrt_id":$(this).find("input").attr("id")
			};
			//li버튼이 눌렸을때 input을 클릭하기 전 상태를 기준으로 데이터 세팅
			if ($(this).find("input").prop("checked")) {
				$(this).find("input").prop("checked",false);
				$(this).find("button").addClass("off");
				data.fvrt_sct="N";
			}else {
				$(this).find("input").prop("checked",true);
				$(this).find("button").removeClass("off");
				data.fvrt_sct="Y";
			}
			page.chgFvrt(data);
		});
		
		//label태그의 이벤트제거
		$(document).on("click",".fvr_ck",function(e){
			e.preventDefault();
		});

	}
	,initDisplay:function(){
		page.zeroDp();
	}
	,zeroDp:function(){
		var zero_dept={};
		var zero_dept_list=[];
		for (var i = 0; i < Object.keys(menuJsonJs).length; i++) {
			var menu_nm = Object.keys(menuJsonJs)[i];
			if (menuJsonJs[menu_nm].FREVE) {
				var obj = {};
				obj.menu_nm = menu_nm;
				obj.menuTxt = menuJsonJs[menu_nm].menuTxt;
				zero_dept_list.push(obj);
			}
		}
		zero_dept.list = zero_dept_list;
		
		//handlebars template 시작
		var template = Handlebars.compile($("#frvt_zero_dept_template").html());
		$("#zero_dept_area").html(template(zero_dept));
		
		page.oneDp();
	}
	,oneDp:function(){
		var one_dept = {};
		var one_dept_list;
		
		for (var i = 3; i < Object.keys(menuJsonJs).length; i++) {
			one_dept_list=[];
			
			var folder_nm = Object.keys(menuJsonJs)[i];
			var file_nm = Object.keys(menuJsonJs[folder_nm]);
			
			for (var j = 0; j < file_nm.length; j++) {
				var menu_id = Object.keys(menuJsonJs[folder_nm])[j];
				var target_obj = menuJsonJs[folder_nm][menu_id];
				
				if (!smutil.isEmpty($("#"+folder_nm)) && 			//찾고자 하는 폴더명을 id속성값으로 가진 ul 태그가 있고
						!isNaN(file_nm[j].LPRightSubstr(1))&& 		//찾고자 하는 다차원 객체 2차 키값의 마지막 글자가 숫자이며
						!smutil.isEmpty(target_obj.menuTxt) && 		//찾고자 하는 대상 객체의 메뉴이름이 null이 아니고
						target_obj.menuDept===1) {					//찾고자 하는 대상 객체의 메뉴dept가 1일 때 true
					target_obj.menuId=menu_id;
					one_dept_list.push(target_obj);
				}
				
			}
			
			one_dept.list = one_dept_list;
			
			var template = Handlebars.compile($("#frvt_one_dept_template").html());
			$("#"+folder_nm).html(template(one_dept));
		}
		page.fvrtList();
	}
	
	//즐겨 찾기 목록 조회
	,fvrtList: function(){
		smutil.loadingOn();
		page.apiParam.param.baseUrl = "smapis/cmn/fvrtList";
		page.apiParam.param.callback = "page.fvrtListCallback";

		smutil.callApi(page.apiParam);
	},
	//즐겨 찾기 설정
	chgFvrt : function(data){
		page.apiParam.param.baseUrl = "smapis/cmn/chgFvrt";
		page.apiParam.param.callback = "page.chgFvrtCallback";
		page.apiParam.data.parameters = data;
		
		smutil.callApi(page.apiParam);
	},
	//즐겨 찾기 목록조회 콜백
	fvrtListCallback : function(res){
		try{
			if(smutil.apiResValidChk(res) && res.code === "0000"){
				var list = res.data.list;
				var frevLst = {};
				frevLst.list = [];
				for (var i = 0; i < list.length; i++) {
					var foldernm=res.data.list[i].fvrt_id.replace(/[0-9]/g, "");
					var filenm=res.data.list[i].fvrt_id;

					var str = foldernm+"."+filenm;
					$("#"+list[i].fvrt_id).prop("checked",true);
					$("#"+list[i].fvrt_id).closest("button").removeClass("off");
					
					var src = smutil.getMenuProp(str,"mainImgSrc");
					var menuTxt = smutil.getMenuProp(str,"menuTxt");
					
					if(!smutil.isEmpty(src)
							&& !smutil.isEmpty(menuTxt)){
						res.data.list[i].src = smutil.getMenuProp(str,"mainImgSrc");
						res.data.list[i].menuTxt =smutil.getMenuProp(str,"menuTxt");
						res.data.list[i].foldernm =foldernm;
						res.data.list[i].filenm =filenm;
						
						frevLst.list.push(res.data.list[i]);
					}
					
				}
				var template = Handlebars.compile($("#frvt_template").html());
				$("#freMenuBox").html(template(frevLst));
			}
		}
		catch(e){
		}
		finally{
			smutil.loadingOff();
			
		}
		
	},
	
	//즐겨찾기 설정 콜백
	chgFvrtCallback: function(res){
		
		try{
			if(!smutil.isEmpty(res) && res.code === "0000"){
				var foldernm = res.fvrt_id.replace(/[0-9]/g, "");
				var filenm =res.fvrt_id;
				
				var str = foldernm+"."+filenm;
				
				if (res.fvrt_sct==="Y") {
					
					var obj={
						"list":[{
							"foldernm":foldernm,
							"filenm":filenm,
							"src":smutil.getMenuProp(str,"mainImgSrc"),
							"menuTxt":smutil.getMenuProp(str,"menuTxt")
						}]
					}
					
					
					var template = Handlebars.compile($("#frvt_template").html());
					$("#freMenuBox").append(template(obj));
					
					$("#"+res.fvrt_id).closest("button").removeClass("off");
					
				}else {
					$("button[data-menu='"+foldernm+"'][data-menu-id='"+filenm+"']").parent().remove();
					$("#"+res.fvrt_id).prop("checked",false);
					$("#"+res.fvrt_id).closest("button").addClass("off");
				}
			}
		}catch(e){}
		finally{
			smutil.loadingOff();
		}
	}
}