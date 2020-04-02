var page = {
		
		plnCnt : null,				// 최상단 전체, 배달, 집하 조회 건수
		plnTmList : null,			// 시간 선택 리스트 
		plnFltrList : null,			// 집배달 예정 리스트 필터
		
		// api 호출 기본 형식
		apiParam : {
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
		},
		
		init:function()
		{
			page.initEvent();			// 페이지 이벤트 등록
			page.lstSerch();
		},
		
		
		
		// 페이지 이벤트 등록
		initEvent : function()
		{
			var _this = this;

			
			// 기사 메모가 있는지 없는지 if else
			Handlebars.registerHelper('prcsMemoYn', function(options) {
				if(!smutil.isEmpty(this.prcs_memo)){	// 메모있음 if true
					return options.fn(this)
				}
				else{	// 메모없음 else
					return options.inverse(this);
				}
			});
			
			
			// ###################################### handlebars helper 등록 end
			
		},
		
		
		// ################### 페이지 리스트 조회 start
		lstSerch : function(){
			
			var _this = this;
			
			_this.apiParam.param.baseUrl = "smapis/cldl/plnList";			// api no
			_this.apiParam.param.callback = "page.lstSerchCallback";			// callback methode
			_this.apiParam.data = {				// api 통신용 파라메터
				"parameters" : {
					"base_ymd" : "20200107",
					"cldl_sct_cd" : "D",
					"fltr_sct_cd" : "0000",
					//"pick_sct_cd" : "G",
				}
			};
			
			
			// 공통 api호출 함수 
			smutil.callApi(_this.apiParam);
			page.apiParamInit();			// 파라메터 전역변수 초기화
		},
		
		
		// 리스트 조회후 그리기
		lstSerchCallback : function(result){
			var data = {};
			// 조회한 결과가 있을경우 
//			if(smutil.apiResValidChk(result) && result.code == "0000"){
				
				var html = [];
				var i=0;
				html[i++] = '<tr style="width:100%;">\n';
				
				console.log("length ===========> ",result.data.list.length);
				
//				$.each(result.data.list, function(idx, obj){
//					if(idx > 0 && idx%4==0){
//						html[i++] = '</tr>\n';
//					}
//					
//					if(!smutil.isEmpty(obj.inv_no) && obj.inv_no != 'XXXXXXXXXXXX'){
//						html[i++] = '<td style=" width:25%; height:40px; text-align:center; padding:7px; font-size:10pt; border:1px solid blue;"><div id="'+obj.inv_no+'"></div></td>\n';
//					}
//					
//					
//				});
				
				
				// 집하
				var list = [
					  {"inv_no" : "230560496622"}
					, {"inv_no" : "230560496633"}
					, {"inv_no" : "230560496644"}
					, {"inv_no" : "230560496655"}
					, {"inv_no" : "230497473765"}
					, {"inv_no" : "233422255990"}
				];
				
				
				// 배달
				var list2 = [
					  {"inv_no" : "104031351443"}
					, {"inv_no" : "104031351454"}
					, {"inv_no" : "232643708290"}
					, {"inv_no" : "103836285044"}
					, {"inv_no" : "233349517634"}
					, {"inv_no" : "233349517645"} 
				];
				
				
				
				$.each(list2, function(idx, obj){
					if(idx > 0 && idx%4==0){
						html[i++] = '</tr>\n';
					}
					
					if(!smutil.isEmpty(obj.inv_no) && obj.inv_no != 'XXXXXXXXXXXX'){
						html[i++] = '<td style=" width:25%; height:40px; text-align:center; padding:7px; font-size:10pt; border:1px solid blue;"><div id="'+obj.inv_no+'"></div></td>\n';
					}
				});

				
				$('#barcodeLstUl').html(html.join(''));

//			}
//			else{		// 조회 결과 없음
//				alert('조회결과 없음');
//			}
			
			var settings = {
				bgColor: $("#FFFFFF").val(),
				color: $("#000000").val(),
				barWidth: "1",
				barHeight: "67"
//				moduleSize: $("#moduleSize").val(),
//				posX: $("#posX").val(),
//				posY: $("#posY").val(),
//				addQuietZone: $("#quietZoneSize").val()
			};
			
			var inv_no;
//			$.each(result.data.list, function(idx, obj){
//				inv_no = obj.inv_no;
//				
//				if(!smutil.isEmpty(inv_no)){
//					$('#'+inv_no).barcode(inv_no,"code39",settings);
//				}
//				
//			});
			
			
			$.each(list2, function(idx, obj){
				inv_no = obj.inv_no;
				
				if(!smutil.isEmpty(inv_no)){
					$('#'+inv_no).barcode(inv_no,"code39",settings);
				}
				
			});
			
		},
		// ################### 페이지 리스트 조회 end
		
		
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
		}
};

