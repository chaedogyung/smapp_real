var page = {
		
		
	init:function()
	{
		// 메뉴정보 셋팅
		page.initDpEvent();
		page.initInterface();
	},
	
	initDpEvent : function(){
		var _this = this;
		var menuObj={};
		var menuLst=[];
		var menuSubLst=[];
		var obj = {};
		var subObj = {};
		
		for (var i = 0; i < Object.keys(menuJsonJs).length; i++) {
			
			var menu_nm = Object.keys(menuJsonJs)[i];
			if (!smutil.isEmpty(menuJsonJs[menu_nm])
					 && menuJsonJs[menu_nm].GNB 
					 && menuJsonJs[menu_nm].menuDept == 0) {
				obj = {};
				obj.menuCode = menu_nm;
				obj.menuTxt = menuJsonJs[menu_nm].menuTxt;
				obj.gnbImgClass = menuJsonJs[menu_nm].gnbImgClass;
				
				for (var j = 0; j < Object.keys(menuJsonJs[menu_nm]).length; j++) {
					var subMenuNm = Object.keys(menuJsonJs[menu_nm])[j];
					var subMenuObj = (menuJsonJs[menu_nm])[subMenuNm];
					if((subMenuNm).startsWith(menu_nm)
							&& subMenuObj.menuDept === 1){
						subObj = {};
						subObj.menuCode = subMenuNm;
						subObj.menuTxt = subMenuObj.menuTxt;
						menuSubLst.push(subObj);
					}
				}
				
				obj.subList = menuSubLst;
				menuLst.push(obj);
				
				menuSubLst = [];	//서브리스트 초기화
			}
		}
		
		menuObj.list = menuLst;
		
		var template = Handlebars.compile($("#menuLst_template").html());
		$("#menuLstUl").html(template(menuObj));
		
		// 버젼 정보 셋팅
		var app_version = LEMP.Device.getInfo({
			"_sKey" : "app_version"
		});
		
		if(!smutil.isEmpty(app_version)){
			
			app_version = app_version.split('_');
			
			if(app_version && app_version.length == 2){
				$('#appVer').text(app_version[0]);
				$('#contentsVer').text(app_version[1]);
			}
			
		}
		
	},
	
	initInterface : function()
	{
		var _this = this;
		
		/* gnb 아코디어 */
		$('.gnbList > ul > li').on('click', function () {
			if ($(this).hasClass('on')) {
				slideUp();
			} else {
				slideUp();
				$(this).addClass('on').children("ul").slideDown(function(){
					//$("#content").height($(".gnbList").height()+120)
				});
			}
			function slideUp() {
				$('.gnbList > ul > li').removeClass('on').children("ul").slideUp();
			};
		});
		
		// gnb close
		$("#gnbClose").click(function(){
			LEMP.SideView.hide({
				"_oMessage" : {
					"param" : ""
				}
			});
		});
		
		// 메뉴 이동전 슬라이드 닫아주는 함수
		var hideSideView = function(callback){
			LEMP.SideView.hide({
				_oMessage : {
					type : "closeSide"
				}
			});

			if(callback){
				callback();
			}
		};
		
		// 소메뉴 클릭시 호출
		$(".gnbLiAttr").on('click', function(e){
			var _this = this;
			var level_0_id = $(_this).closest("ul").attr("id");
			var level_1_id = $(_this).attr("id");
			
			if(!smutil.isEmpty(level_0_id)
					&& !smutil.isEmpty(level_1_id)){
				menuId = level_0_id+'.'+level_1_id;
				var menuUrl = smutil.getMenuProp(menuId, 'url');

				hideSideView(function(){
					LEMP.Window.open({
						"_sPagePath" : menuUrl
					});
				});
			}
		});
		
		
		// 개인정보처리방침 클릭
		$('#linkPopBtn').on('click', function(){
			hideSideView(function(){
				LEMP.System.callBrowser({
					"_sURL" : "https://www.lotteglogis.com/mobile/customs/policy/privacy"
				});
			});
		});
		
		
		// 로그아웃 클릭
		$('#logoutBtn').on('click', function(){
			hideSideView(function(){
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
						smutil.logout();
					}
				});

				LEMP.Window.confirm({
					_vMessage : "로그아웃 하시겠습니까?",
					_aTextButton : [ btnCancel, btnConfirm ]
				});
			});
		});
		
		
		// 통화버튼 클릭
		$('#infoTelNo').on('click', function(e){
			var phoneNumberTxt = $(this).text();
			
			// 전화걸기 팝업 호출
			$('#popPhoneTxt').text(phoneNumberTxt);
			$('.mpopBox.phone').bPopup();
			
		});
		
		// 통화팝업 버튼 클릭
		$('#phoneCallYesBtn').on('click', function(e){
			
			var phoneNumber = $('#popPhoneTxt').text();
			phoneNumber = phoneNumber.split('-').join('').replace(/\-/g,'');
			
			LEMP.System.callTEL({
				"_sNumber" : phoneNumber,
			});
			
		});
	}
};