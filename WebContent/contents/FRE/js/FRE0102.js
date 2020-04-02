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
	
		if (!smutil.isEmpty(page.pageStatus)) {

			switch (page.tagId) {
			case "inv_no1":
			case "inv_no2":
				page.name = inv_no+"_phto1_pic.jpg";
				break;
			case "total1":
			case "total2":
				page.name = inv_no+"_phto2_pic.jpg";
				break;
			case "damage_p1":
			case "damage_p2":
				page.name = inv_no+"_phto3_pic.jpg";
				break;
			case "damage_p1t":
			case "damage_p2t":
				page.name = inv_no+"_phto4_pic.jpg";
				break;
			case "damage2C" :
				page.name = inv_no+"_phto5_pic.jpg";
				break;
			case "damage2CT" :
				page.name = inv_no+"_phto6_pic.jpg";
				break;
			}
		
		} else {
			// 파일 이름 변경
			switch (status) {
			case "운송장":
				page.name = inv_no+"_phto1_pic.jpg";
				break;
			case "전체":
				page.name = inv_no+"_phto2_pic.jpg";
				break;
			case "가로":
				page.name = inv_no+"_phto3_pic.jpg";
				break;
			case "세로":
				page.name = inv_no+"_phto4_pic.jpg";
				break;
			case "높이":
				page.name = inv_no+"_phto5_pic.jpg";
				break;
			case "무게":
				page.name = inv_no+"_phto6_pic.jpg";
				break;
			}
		}
		// 사진찍기
		$('.camera').click(function() {
			
			smutil.callCamera("{external}/LEMP/", page.name, page.gallaryCallback);
			
//			LEMP.System.callCamera({
//				"_sFileName" : page.name,
//				"_sDirectory" : "{external}/LEMP/",
//				"_bAutoVerticalHorizontal" : true,
//				"_fCallback" : function(result) {
//					page.resizeImage(result.path);
//
//				}
//			});
		});

		// 이미지 삭제 버튼 클릭시
		$('.del3').click(function() {
			page.picturesPath = "";
			$('#pictureImage').attr("src", "");
			$('#pictureImage').css('display', 'none');
		});

		// 갤러리 이미지
		$('.img').click(function() {
			smutil.callGallery("{external}/LEMP/" + page.name, page.gallaryCallback);
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
		page.picturesPath = data.list[0].target_path;
		$('#pictureImage').attr('src', page.picturesPath);
		$('#pictureImage').css('display', 'block');
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
