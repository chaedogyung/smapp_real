var page = {
		jibbae : "",
		scanCode : "",
		sdar_sct_cd : "",
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
		init : function(data) {
			
			// 데이터를 못가져왔을경우
			page.jibbae =data.data.cldl_cenr_nm;
			page.sdar_sct_cd = data.data.sdar_sct_cd;
			page.scanCode =data.data.base_brsh_cd;
			// 데이터를 못가져왔을경우
			if(smutil.isEmpty(data.data.base_brsh_cd)){
					page.getSmInfo();
			}
			page.initInterface();
		
		},
		initInterface : function() {
			$('#inDate').val(getDateT());
			$('#jibbqe').text(page.jibbae);
			//달력click
			$('#inDate').click(function(){
				var popUrl = smutil.getMenuProp('COM.COM0301', 'url');
				LEMP.Window.open({
					"_sPagePath" : popUrl
				});
			});
			
			//조회버튼 클릭
			$('#searchD').click(function(){
				
				var base_brsh_cd = page.scanCode;
				
				// 코드가 없는경우는 api 콜 안하고 없는 리스트로 셋팅
				if(smutil.isEmpty(base_brsh_cd)){
					$('#totalC').text("총0건");
					$('.tableBox.tableBoxSimple').css('display','none');
					$('.NoBox').css('display','block');
				}
				else{
					smutil.loadingOn();
					var base_ym = $('#inDate').val();
					var base_ymd = base_ym.split('.').join('');
					
					page.apiParam.param.baseUrl = "/smapis/net/alcrList";				//api no
					page.apiParam.param.callback = "page.arrivCallback";				//callback methode
					page.apiParam.data = {
							"parameters" : {
								"sdar_sct_cd":page.sdar_sct_cd,
								"base_ymd" : base_ymd,
								"base_brsh_cd" : page.scanCode
							}
					};	// api 통신용 파라메터
			
					//공통 api호출 함수
					smutil.callApi(page.apiParam);
				}
				
			});
			
			//확인 버튼 클릭
			$('#confirm').click(function(){
				var numb =$('#dataListB').find('.on').children(":first").text();
				if(smutil.isEmpty(numb)){
					LEMP.Window.alert({
						"_vMessage" : "연계일보 번호를 선택해주세요",
					});
				}else{
					if(page.sdar_sct_cd === "A"){
						LEMP.Window.close({
							"_oMessage" : {
								"param" : numb
							},
							"_sCallback" : "page.ARI0101numberCallback"
						});
					}else{
						LEMP.Window.close({
							"_oMessage" : {
								"param" : numb
							},
							"_sCallback" : "page.ARI0201numberCallback"
						});
				
					}
				}
					
			});
			
			//닫기 취소 버튼 클릭
			$('.btn.closeW.paR , .btn.gray.w100p.m').click(function(){
				LEMP.Window.close();
			})
			
		},
		
		//전페이지에서 스캔 코드를 못가져올경우
		getSmInfo : function(){
		smutil.loadingOn();
		page.apiParam.param.baseUrl="/smapis/cmn/smInf";
		page.apiParam.param.callback="page.getSmInfoCallback";
		smutil.callApi(page.apiParam);
		},
		
		getSmInfoCallback : function(res){
			//page.scanCode
			try{
				if(smutil.apiResValidChk(res) && res.code === "0000") {
					$('#scanP').text(res.cldl_cenr_nm);
					page.jibbae = res.cldl_cenr_nm;
					page.scanCode = res.cldl_cenr_cd;
					page.sdar_sct_cd = "5";
				}
			}catch(e){}
			finally{
				smutil.loadingOff();
			}
		},
		
		//달력 callback
		COM0301Callback:function(res){
			$('#inDate').val(res.param.date);
		},
		
		//조회 callback
		arrivCallback : function(data){
			try{
				$('#dataListB').empty();
				if(smutil.apiResValidChk(data) && data.code === "0000" && data.data_count !== 0){
					_.forEach(data.data.list,function(val,index){
						val.jib = page.jibbae;
					});
					$('.NoBox').css('display','none');
					$('#totalC').text("총"+data.data.list.length+"건");
					var source =$("#ARI0104-template").html();
					var template = Handlebars.compile(source);
					var itemList = template(data.data);
					
					$('#dataListB').append(itemList);
				}else{
					$('#totalC').text("총"+data.data.list.length+"건");
					$('.tableBox.tableBoxSimple').css('display','none');
					$('.NoBox').css('display','block');
				} 
			}
			catch(e){}
			finally{
				smutil.loadingOff();
			}
			
		}
	}
function getDateT(){
	// 달력셋팅
	var curDate = new Date();
	return curDate = curDate.getFullYear() + "." + ("0"+(curDate.getMonth()+1)).slice(-2) + "." + ("0"+curDate.getDate()).slice(-2);
}