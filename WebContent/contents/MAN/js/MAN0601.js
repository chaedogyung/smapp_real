LEMP.addEvent("backbutton", "page.callbackBackButton");
var page = {
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
			
		init:function(){
			page.initInterface();
			page.workTmInfo();
		},
		initInterface : function()
		{
			//확인 버튼 click
			$('#checkOkay').click(function(){
				LEMP.Window.close();
			});
		},
		
		//주60시간 근무 현황
		workTmInfo : function(){
			smutil.loadingOn();
			
			var loginId = LEMP.Properties.get({
				"_sKey" : "dataId"
			});
			
			page.apiParamInit();		// 파라메터 초기화
			page.apiParam.param.baseUrl = "/smapis/workTmInfo";
			page.apiParam.param.callback = "page.workTmInfoCallback";
			
			page.apiParam.data = {
					"parameters" : {
						"empno" : loginId
					}
			};

			smutil.callApi(page.apiParam);
		},

		workTmInfoCallback : function(result){
			try{
				if(smutil.apiResValidChk(result) && result.code === "0000"){
					var res_data = result.data;
					
					$("#emp_nm").text(res_data.empnm);
					$("#tot_tme").text(res_data.tot_tme);
					$("#remind_tme").text(res_data.remind_tme);
					
					var data = [];
					
					$.each(res_data.list, function(index, res){
						var num = res.scan_d - 2;
						
						if(num < 0){
							num = num + 7;							
						}
						
						data[num] = (res.wkg_tme).replace("시간", "");
					});
					
					var workTime = document.getElementById("workTime").getContext('2d');
					
					var myChart = new Chart(workTime, {
					    type: 'bar',
					    data: {
					        labels: ["월", "화", "수", "목", "금", "토", "일"],
					        datasets: [{
					            data: data,
					            backgroundColor: [
					                'rgba(255, 99, 132, 0.2)',
					                'rgba(54, 162, 235, 0.2)',
					                'rgba(255, 206, 86, 0.2)',
					                'rgba(75, 192, 192, 0.2)',
					                'rgba(153, 102, 255, 0.2)',
					                'rgba(255, 159, 64, 0.2)',
					                'rgba(255, 159, 80, 0.2)'
					            ],
					            borderColor: [
					                'rgba(255,99,132,1)',
					                'rgba(54, 162, 235, 1)',
					                'rgba(255, 206, 86, 1)',
					                'rgba(75, 192, 192, 1)',
					                'rgba(153, 102, 255, 1)',
					                'rgba(255, 159, 64, 1)',
					                'rgba(255, 159, 80, 1)'
					            ],
					            borderWidth: 1
					        }]
					    },
					    options: {
					        maintainAspectRatio: false, // default value. false일 경우 포함된 div의 크기에 맞춰서 그려짐.
					        scales: {
					        	xAxes:[{
					        		gridLines: {			//눈금선 표시여부
					        			display: false
					        		}
					        	}],
					            yAxes: [{
					            	gridLines: {			//눈금선 표시여부
					        			display: false
					        		},
					                ticks: {
					                    beginAtZero: true,	// 시작값 0
					                    suggestedMax: 15	// max 값
					                }
					            }]
					        },
					        legend: {
						    	display: false
						    },
						    animation: {
				                duration : 1,
				                //막대 상단 값 표시
				                onComplete : function() {
				                    var chartInstance = this.chart,
				                    ctx = chartInstance.ctx;

				                    ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
				                    ctx.textAlign = 'center';
				                    ctx.fillStyle = 'black';
				                    ctx.textBaseline = 'bottom';

				                    this.data.datasets.forEach(function(dataset, i) {
				                        var meta = chartInstance.controller.getDatasetMeta(i);
				                        meta.data.forEach(function(bar, index) {
				                            if (dataset.data[index] > 0) {
				                                var data = dataset.data[index] + "시간";
				                                ctx.fillText(data, bar._model.x, bar._model.y);
				                            }
				                        });
				                    });
				                }
				            }
					    }
					});
				}
			}
			catch(e) {}
			finally{
				smutil.loadingOff();
			}
		},
		
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
		},
		
		// 물리적 뒤로가기 버튼 및 뒤로가기 화살표 버튼 클릭시 스캔 체크해서 전송여부 결정
		callbackBackButton : function(){
			LEMP.Window.close({
				"_oMessage" : {
					"param" : ""
				}
			});
		}
}
