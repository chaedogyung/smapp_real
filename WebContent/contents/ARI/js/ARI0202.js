var page = {
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
			}
		// api 통신용 파라메터
		},
		init : function(data) {
			page.sdar_sct_cd = data.data.sdar_sct_cd;
			page.initInterface();
		},
		initInterface : function() {
			if(page.sdar_sct_cd=="B"){
				$('#headline').text("도착조회");
			}else{
				$('#headline').text("발송조회");
			}
			
			$("#closeP").click(function(){
				LEMP.Window.close();
			});
			
			//운송장번호 입력 click
			$('#inv_noText').click(function(){
				var popUrl = smutil.getMenuProp('COM.COM0102', 'url');
				LEMP.Window.open({
					"_sPagePath" : popUrl
				});
			});
			
			$('#invScan').click(function(){
				LEMP.Window.openCodeReader({
					"_fCallback" : function(resOpenCodeReader) {
						var code = resOpenCodeReader.data;
						if(code.length!=0){
							$('#inv_noText').val(changeForm(code));
							page.arrSearch();
						}
					}
				});
			});
			
			$('#confirm').click(function(){
				LEMP.Window.close();
			});
		},
		//운송장번호 입력 callback
		InputCallback : function(data){
			var inv_no =  data.inv_no;
			$('#inv_noText').val(changeForm(data.inv_no));
			page.arrSearch();
		},
	
		//도착조회 api호출
		arrSearch : function(){
			smutil.loadingOn();
			var inv_no =$('#inv_noText').val();
			page.apiParam.param.baseUrl = "/smapis/net/invDtl";				//api no
			page.apiParam.param.callback = "page.arrivCallback";				//callback methode
			page.apiParam.data = {
					"parameters" : {
						"sdar_sct_cd": page.sdar_sct_cd,
						"inv_no" : inv_no,
					}
			};	// api 통신용 파라메터
			
			//공통 api호출 함수
			smutil.callApi(page.apiParam);
			
			
		},
		arrivCallback: function(data){
			$('.emptyData').text("");
			try {
				if (smutil.apiResValidChk(data) && 
						(data.code ==="0000") && data.data_count!=0) {
					$('#arrp').val(data.data.list[0].base_brsh_cd);
					$("#smId").val(data.data.list[0].scan_empno);
					$("#counp").val(data.data.list[0].prtn_brsh_cd);
					$("#carN").val(data.data.list[0].vhc_no);
					
				}else{
					$('.emptyData').text("송장에 데이터가 없습니다.");
				}
			} catch (e) {}
			finally{
				smutil.loadingOff();
			}
		}
}
function changeForm(code) {
	var first = code.substring(0, 4);
	var second = code.substring(4, 8);
	var third = code.substring(8, code.length);
	return first + "-" + second + "-" + third;
}
