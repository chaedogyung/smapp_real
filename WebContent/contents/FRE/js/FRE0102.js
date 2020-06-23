var page = {
	pageStatus : "",
	picturesPath : "",
	tagetPath : "",
	tagId : "",
	name : "",

	init : function(res) {
		if (!smutil.isEmpty(res.data.pageStatus)) {
			page.pageStatus = res.data.pageStatus;
			page.tagId = res.data.param.id;
		}
		var data = res.data.param;
		page.initInterface(data);
	},

	initInterface : function(res) {
		var inv_no = res.inv_no;
		var status = res.status;
		// var status ="운송장";

		var date = new Date();
        var curTime = date.LPToFormatDate("yyyymmddHHnnss");

     // 사진 명명 규칙 (운송장번호 + 순번 + 시간)
		if (!smutil.isEmpty(page.pageStatus)) {

			switch (page.tagId) {
			case "inv_no1":
			case "inv_no2":
				page.name = inv_no + "_phto1_pic" + "_" + curTime + ".jpg";
				break;
			case "total1":
			case "total2":
				page.name = inv_no + "_phto2_pic" + "_" + curTime + ".jpg";
				break;
			case "damage_p1":
			case "damage_p2":
				page.name = inv_no + "_phto3_pic" + "_" + curTime + ".jpg";
				break;
			case "damage_p1t":
			case "damage_p2t":
				page.name = inv_no + "_phto4_pic" + "_" + curTime + ".jpg";
				break;
			case "damage2C" :
				page.name = inv_no + "_phto5_pic" + "_" + curTime + ".jpg";
				break;
			case "damage2CT" :
				page.name = inv_no + "_phto6_pic" + "_" + curTime + ".jpg";
				break;
			}

		} else {
			// 파일 이름 변경
			switch (status) {
			case "운송장":
				page.name = inv_no + "_phto1_pic" + "_" + curTime + ".jpg";
				break;
			case "전체":
				page.name = inv_no + "_phto2_pic" + "_" + curTime + ".jpg";
				break;
			case "가로":
				page.name = inv_no + "_phto3_pic" + "_" + curTime + ".jpg";
				break;
			case "세로":
				page.name = inv_no + "_phto4_pic" + "_" + curTime + ".jpg";
				break;
			case "높이":
				page.name = inv_no + "_phto5_pic" + "_" + curTime + ".jpg";
				break;
			case "무게":
				page.name = inv_no + "_phto6_pic" + "_" + curTime + ".jpg";
				break;
			}
		}
		
		// 사진찍기
		$('.camera').click(function() {
			smutil.callCamera(page.name, 'page.gallaryCallback');
		});

		// 이미지 삭제 버튼 클릭시
		$('.del3').click(function() {
			page.picturesPath = "";
			$('#pictureImage').attr("src", "");
			$('#pictureImage').css('display', 'none');
		});

		// 갤러리 이미지
		$('.img').click(function() {
			smutil.callGallery(page.name, 'page.gallaryCallback');
		});

		// 등록버튼 클릭시
		$('#resister').click(function() {
			if (page.picturesPath == "") {
				LEMP.Window.alert({
					"_vMessage" : " 관련 사진을 등록해주세요 "
				});
			} else {
				LEMP.Window.close({
					"_oMessage" : {
						"param" : page.picturesPath
					},
					"_sCallback" : "page.pictureCallBack"
				});
			}

		});

		// 닫기 버튼 클릭시
		$('#closePage,#ClosePage2').click(function() {
			LEMP.Window.close();
		});

	},
	// gallaryCallback
	gallaryCallback : function(data) {
		page.picturesPath = data.target_path;

		$('#pictureImage').remove();
		$('.imgBox').append(`<img src="${page.picturesPath}?t=${new Date().getTime()}" id="pictureImage" style="width:338px;">`);
	},
	// 이미지 resize
//	resizeImage : function(result) {
//		var fileList = [];
//		fileList.push({
//			"_sSourcePath" : result
//		});
//
//		LEMP.File.resizeImage({
//			"_aFileList" : fileList,
//			"_bIsCopy" : false,
//			"_nWidth" : 800,
//			"_nHeight" : 600,
//			"_nCompressRate" : 0.3,
//			"_nFileSize" : 1000000,
//			"_fCallback" : function(res) {
//
//				page.picturesPath = res.list[0].target_path;
//
//				$('#pictureImage').attr('src', page.picturesPath);
//				$('#pictureImage').css('display', 'block');
//
//			}
//		});
//
//	},
};
