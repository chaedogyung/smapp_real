LEMP.addEvent("backbutton", "page.callbackBackButton");		// 뒤로가기 버튼 클릭시 이벤트

var page ={
	init : function(arg){
		if(smutil.isEmpty(arg.data.param)){
			arg.data.param = {};
		}
		page.com0301 = arg.data.param;
		page.initInterface();
		page.PublishCode();
	}
	,com0301:{}
	,PublishCode:function(){
		var date = new Date();
		$.datepicker.setDefaults({
			closeText: "닫기",
			currentText: "오늘",
			monthNames: ["1월", "2월", "3월", "4월", "5월", "6월","7월","8월", "9월", "10월", "11월", "12월"],
			monthNamesShort: ["1월", "2월", "3월", "4월", "5월", "6월","7월", "8월", "9월", "10월", "11월", "12월"],
			dayNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
			dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
			dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"],
			weekHeader: "주",
			dateFormat: "yy년 m월 d일",
			firstDay: 0,
			isRTL: false,
			showMonthAfterYear: true,
			showOtherMonths: true,
			yearSuffix: "년",
			minDate:page.com0301.minDate,
			maxDate:page.com0301.maxDate
		});
		$(".calArea").datepicker({
			onSelect: function(dateText, inst) {
				$(this).datepicker('option', 'minDate', date);
				var date = $(this).datepicker('getDate');
				startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
				endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7);
				var dateFormat = inst.settings.dateFormat || $.datepicker._defaults.dateFormat;
				$(".startDate .m").text(startDate.getMonth()+1)
				$(".startDate .d").text(startDate.getDate())
				$(".startDate .y").text(startDate.getFullYear())
				$(".startDate .ymd").text(startDate.getFullYear()+"."+(startDate.getMonth()+1)+"."+startDate.getDate())
			}
		});

		var curDate = $(".calArea").datepicker('getDate');
		$(".startDate .m").text(curDate.getMonth()+1);
		$(".startDate .d").text(curDate.getDate());
		$(".startDate .y").text(curDate.getFullYear());
		$(".startDate .ymd").text(curDate.getFullYear()+"."+(curDate.getMonth()+1)+"."+curDate.getDate());

		// 필수인 경우 닫기 버튼 숨김
		if (!smutil.isEmpty(page.com0301.necessary) && page.com0301.necessary) {
			$(".btn.closeW.paR").hide();
		}
	}
	,initInterface : function(){
		// 닫기
		$(".btn.closeW.paR ,#btnClose").on('click',function(){
			if (!smutil.isEmpty(page.com0301.necessary) && page.com0301.necessary) {
				// 필수 인 경우 닫지 않음
				LEMP.Window.toast({
					'_sMessage' : '날짜를 선택해 주세요.',
					'_sDuration' : 'short'
				});
			} else {
				LEMP.Window.close();
			}
		});

		$("#confirm").on('click',function(){
			var startDate = $('.startDate .ymd').text();

			startDate = startDate.split('.');

			if(startDate.length>0){
				if (startDate[1].length < 2) {
					startDate[1] = "0" + startDate[1];
				}

				if (startDate[2].length < 2) {
					startDate[2] = "0" + startDate[2];
				}

				startDate = startDate[0] + "." + startDate[1] + "." + startDate[2];
			}


			page.com0301.date = startDate;
			LEMP.Window.close({
				"_oMessage":{
					"param" :page.com0301
				}
				,"_sCallback" :"page.COM0301Callback"
			});
		});

	},

	callbackBackButton: function() {
		if (smutil.isEmpty(page.com0301.necessary) || !page.com0301.necessary) {
			LEMP.Window.close();
		} else {
			// 필수 인 경우 닫지 않음
			LEMP.Window.toast({
				'_sMessage' : '날짜를 선택해 주세요.',
				'_sDuration' : 'short'
			});
		}
	}
};
