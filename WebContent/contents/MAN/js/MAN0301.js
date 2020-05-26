var page = {
		notice :"",
		memo : "",
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
			},// api 통신용 파라메터
		},

		init:function()
		{
			page.initInterface();
			//공지사항 쪽지목록
			page.notiList();
			page.noteList();
		},
		initInterface : function()
		{
			//default 공지사항
			$('#Man_memoList').hide();
			//상단탭 구분
			$('#btn_N ,#btn_M').click(function(){
				var NadM = $(this).data('schSctCd');
				if(NadM !='N'){
					$('#Man_memoList').show();
					$('#Man_noticeList').hide();
				}else{
					$('#Man_memoList').hide();
					$('#Man_noticeList').show();
				}
				var btnArray = [$('#btn_N'),$('#btn_M')];
				//var btnObj;
				_.forEach(btnArray,function(obj,ind){
					if(NadM == obj.data('schSctCd')){
						obj.closest('li').addClass('on');
					}else{
						obj.closest('li').removeClass('on');
					}
				});

			});

			//공지사항 상세화면으로 이동
			$(document).on('click','.noticeDetail',function(){
				var obj;
				var id =  $(this).attr('id');
				_.forEach(page.notice,function(val,index){

					if(val.sta_ymd+val.seq_no === id){
						obj = val;
						return false;
					}
				});
				var popUrl = smutil.getMenuProp('MAN.MAN0302','url');

				LEMP.Window.open({
					"_sPagePath" : popUrl,
					"_oMessage" : {
						"param" : obj
					},
				});

			});
			//쪽지 상세화면으로 이동
			$(document).on('click','.memoDetail',function(){
				var obj;
				var id = $(this).attr('id');
				_.forEach(page.memo,function(val,index){
					if(val.reg_ymd+val.reg_tme == id){
						obj = val;
						return false;
					}
				});

				var popUrl = smutil.getMenuProp('MAN.MAN0302','url');
				LEMP.Window.open({
					"_sPagePath" : popUrl,
					"_oMessage" : {
						"param" : obj
					},
				});

			});

			// 닫기버튼 이벤트 등록
			$(".btn.closeW.paR").click(function() {
				LEMP.Window.close({
					"_sCallback" : "page.MAN0301Callback"
				});
			});
		},
		//공지사항 목록
		notiList : function(){
			smutil.loadingOn();
			page.apiParam.param.baseUrl="smapis/cmn/notiList";
			page.apiParam.param.callback="page.notiListCallback";
			smutil.callApi(page.apiParam);
		},

		//공지사항 콜백
		notiListCallback : function(res){
//			$('#notice').html("");
			try{
				if(smutil.apiResValidChk(res) && res.code === "0000" && res.data_count!=0){
					var list = res.data.list;
					
					list = list.sort(function (a,b){
						return b.sta_ymd - a.sta_ymd; 
					});
					
					var link = [
						'https:\/\/youtu.be\/AldEexl0X5o'
					];

					_.forEach(list,function(val,index){
						list[index].date = list[index].sta_ymd.substring(0,4)+"."
						+list[index].sta_ymd.substring(4,6)+"."
						+list[index].sta_ymd.substring(6,8);
						list[index].status ="Notice";

						// URL 파싱
						link.forEach(function(url) {
							list[index].dtl_desc = list[index].dtl_desc.replace(url, `<a href="#" onclick="page.showWeb('${url}'); return false;">${url}</a>`);
						});

						list[index].dtl_desc = list[index].dtl_desc.split("\n").join("<br>");

					});
					var list_r = {"list":list};

					page.notice = list_r.list;
				}
			}catch(e){}
			finally{
				var source = $("#MAN0301_notice_template").html();
				var template = Handlebars.compile(source);

				$("#notice").html(template(list_r));
				smutil.loadingOff();
			}
		},

		//쪽지 읽음수 표시
		memoReadStatus : function(){
			smutil.loadingOn();
			page.apiParam.param.baseUrl="/smapis/cmn/noteNewCnt";
			page.apiParam.param.callback="page.memoReadStatusCallback";
			page.apiParam.data.parameters={
			};

			smutil.callApi(page.apiParam);
		},


		//쪽지 읽음 표시
		memoReadStatusCallback : function(res){
			try{
				if(smutil.apiResValidChk(res) && res.code ==="0000"){
					$('.tRed').text("("+res.no_read_cnt+")");
				}
			}catch(e){}
			finally{
				smutil.loadingOff();
			}
		},
		readUpdateCallback : function(){
			page.noticeList();
		},

		noteList:function(){
			smutil.loadingOn();

			page.apiParam.param.baseUrl="smapis/cmn/noteList";
			page.apiParam.param.callback="page.noteListCallback";
			smutil.callApi(page.apiParam);
		},

		//쪽지 콜백
		noteListCallback : function(res){
			try{
				if(smutil.apiResValidChk(res) && res.code === "0000" && res.data_count!=0){
					var list_r =res.data;
					_.forEach(list_r.list,function(val,index){
						list_r.list[index].date = list_r.list[index].reg_ymd.substring(0,4)+"."
									+list_r.list[index].reg_ymd.substring(4,6)+"."
									+list_r.list[index].reg_ymd.substring(6,8);
						list_r.list[index].status = "Memo";
					});
					page.memo = list_r.list;
				}
			}catch(e){}
			finally{
				var source = $("#MAN0301_memo_template").html();
				var template = Handlebars.compile(source);
				$("#memo").html(template(list_r));
				smutil.loadingOff();
			}
		},

}
