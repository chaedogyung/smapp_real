/* *
 * codeListPopup 전용 팝업
 * */
var page = {
		
		init:function(arg)
		{
			$.datepicker.setDefaults({
				closeText: "닫기",
				currentText: "오늘",
				monthNames: ["1월", "2월", "3월", "4월", "5월", "6월","7월","8월", "9월", "10월", "11월", "12월"],
				monthNamesShort: ["1월", "2월", "3월", "4월", "5월", "6월","7월", "8월", "9월", "10월", "11월", "12월"],
				dayNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
				dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
				dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"],
				weekHeader: "주",
				dateFormat: "yy-mm-dd",
				firstDay: 0,
				isRTL: false,
				showMonthAfterYear: true,
				showOtherMonths: true,
				yearSuffix: "년"
			});
			
			// menuId 에 따라서 날자 선택이 달라지도록 수정
			if(!smutil.isEmpty(arg.data) 
					&& !smutil.isEmpty(arg.data.param)){
				page.menuId = arg.data.param.menuId;
			} 
			
			page.initEvent();			// 페이지 이벤트 등록
		},
		
		menuId : null,
		
		// 페이지 이벤트 등록
		initEvent : function()
		{
			var isFirst = true;
			$(".calArea").datepicker({					
				onSelect: function(dateText, inst) {
					var $this = $(this);
					var date =  $this.datepicker('getDate');
					selectDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
					maxDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 6);
					
					// 결제목록에서 호출된 경우는 1년단위 검색이 가능하도록 수정
					if(!smutil.isEmpty(page.menuId)
							&& page.menuId === "PAY0201"){
						maxDate = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate() - 1);
					}

					var dateFormat = inst.settings.dateFormat || $.datepicker._defaults.dateFormat;						
					
					if(isFirst) {
						$this.datepicker("option","minDate",selectDate);
						$this.datepicker("option","maxDate",maxDate);

						$(".startDate .m").text(selectDate.getMonth()+1)
						$(".startDate .d").text(selectDate.getDate())
						$(".startDate .y").text(selectDate.getFullYear())
						
						var padFullYear = page.pad(selectDate.getFullYear());
						var padMonth = page.pad(selectDate.getMonth()+1);
						var padDay = page.pad(selectDate.getDate());
						$("#startDate").val(padFullYear + "." + padMonth + "." + padDay);

						$(".endDate .m").text('')
						$(".endDate .d").text('')
						$(".endDate .y").text('')
						$("#endDate").val('');

					} else {
						$this.datepicker("option","minDate",null);
						$this.datepicker("option","maxDate",null);

						$(".endDate .m").text(selectDate.getMonth()+1)
						$(".endDate .d").text(selectDate.getDate())
						$(".endDate .y").text(selectDate.getFullYear())
						
						var padFullYear = page.pad(selectDate.getFullYear());
						var padMonth = page.pad(selectDate.getMonth()+1);
						var padDay = page.pad(selectDate.getDate());					
						$("#endDate").val(padFullYear + "." + padMonth + "." + padDay);
					}
					
					isFirst = !isFirst;
					$(this).datepicker('refresh');
				}
			});
			
			/* 닫기 */
			$(".closeBtn").on('click',function(){
				 LEMP.Window.close();
			});
			
			/* 확인 */      	
			$(".confirmBtn").on('click',function(){
				var startDate = $("#startDate").val();
				var endDate = $("#endDate").val();
				
				LEMP.Window.close({
					"_oMessage":{
						"start" :startDate,
						"end" : endDate
					},
					"_sCallback" :"page.popCallback"
				});
			});
			
		},
		
		pad : function(numb){
			return (numb < 10 ? '0' : '') + numb;
		},
};