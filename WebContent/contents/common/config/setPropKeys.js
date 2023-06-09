/**
 * 형식
 * - accessToken : LEMP.Properties.set({"_sKey" : "accessToken","_vValue" : "로그인 성공한 jwt 토큰정보"});
 * - saveId : LEMP.Properties.set({"_sKey" : "saveId", "_vValue" : "로그인 성공한 ID" });			** base64로 인코딩됨
 * - saveIdChk : LEMP.Properties.set({ "_sKey" : "saveIdChk", "_vValue" : "로그인 ID 저장 체크박스 선택여부 Y/N" });
 * - dataId : LEMP.Properties.set({ "_sKey" : "dataId", "_vValue" : "로그인 성공한 사용자의 데이터용 사용자 id" });			** base64로 인코딩됨
 * - dataCpno : LEMP.Properties.set({ "_sKey" : "dataCpno", "_vValue" : "로그인 성공한 사용자의  전화번호" });			** base64로 인코딩됨
 * - notice : LEMP.Properties.set({ "_sKey" : "notice", "_vValue" : [{"_sKey" : 공지사항 날짜+seq, "_vValue" : '확인 Y'},{"_sKey" : 공지사항 날짜+seq, "_vValue" : 'Y'}] });
 * - authCertInfo : LEMP.Properties.set({ "_sKey" : "authCertInfo", "_vValue" : {"principal" : "인증받은 사용자ID, "usrCpno" : "인증받은 전화번호('-' 없음)" } });		** base64로 인코딩됨
 * - receiver : LEMP.Properties.set({ "_sKey" : "receiver", "_vValue" : {"acpr_list_seq" : "인수자 목록 순번", "acpr_nm" : "인수자 text", "acpr_cd" : "인수자코드" } });
 * - lotteCerk : LEMP.Properties.set({ "_sKey" : "lotteCerk", "_vValue" : {"cerk" : "인증 토큰", "date" : "생성일" } });
 * - acptSctInfo : LEMP.Properties.set({ "_sKey" : "acptSctInfo", "_vValue" : {"acpt_sct_cd" : "인수자 코드", "acpr_nm" : "인수자 명"} });
 * - acptSctInfo2 : LEMP.Properties.set({ "_sKey" : "acptSctInfo2", "_vValue" : {"acpt_sct_cd" : "인수자 코드", "acpr_nm" : "인수자 명"} });
 * - installAuthConfirmYn : LEMP.Properties.set({ "_sKey" : "installAuthConfirmYn", "_vValue" : "동의 확인 Y" });
 * - mmsMessage : LEMP.Properties.set({ "_sKey" : "mmsMessage", "_vValue" : "사진전송에 발송된 기본영역 문구" });
 * - personalInfo : LEMP.Properties.set({ "_sKey" : "personalInfo", "_vValue" : {"term_id" : 이용약관PK, "principal" : "사용자ID", "accept_yn": "동의여부"} });
 * - order : LEMP.Properties.set({ "_sKey" : "order", "_vValue" : "01 / 02"});
 * - autoScanSend : LEMP.Properties.set({ "_sKey" : "order", "_vValue" : "true / false"});
 * - autoCameraPop : LEMP.Properties.set({ "_sKey" : "order", "_vValue" : "true / false"});
   - empStatus : LEMP.Properties.set({ "_sKey" : "empStatus", "_vValue" : "true / false"});
 */
var setPropKeys =
{
	"keys" : [
		{"accessToken" 		: "jwt 인증토큰"},					// 로그아웃 시에 토큰 삭제해야함.
		{"saveId" 			: "로그인 성공한 사용자의 로그인페이지 셋팅용 사용자 id"},
		{"saveIdChk" 		: "id 저장 체크여부 Y/N"},
		{"dataId"			: "로그인 성공한 사용자의 데이터용 사용자 id"},
		{"dataCpno"			: "로그인 성공한 사용자의  전화번호"},
		{"notice"			: "확인한 공지사항 리스트"},
		{"authCertInfo"		: "인증정보"},
		{"receiver"			: "인수자설정 목록"},
		{"nonDeliveryReason": "미배달 사유 목록"},
		{"nonPickUpReason"	: "미집하 사유 목록"},
		{"lotteCerk"		: "롯데홈쇼핑 인증키"},					//바로반품 입찰,입찰취소시 사용
		{"acptSctInfo"		: "인수자 정보(단건)"},					//배달 완료 리스트에서만 사용
		{"acptSctInfo2"		: "인수자 정보(단건)"},					//사진 전송에서만 사용
		{"installAuthConfirmYn": "설치권한 동의여부"},				// 최초에 앱 설치권한 동의값
		{"mmsMessage"		: "사진전송에 기사가 설정한 기본문구"},		// 사진전송 셋팅 기본문구
		{"personalInfo"		: "개인정보 사용동의값"},
		{"order"			: "배달완료 정렬방식"},
		{"autoScanSend"		: "배달완료 스캔시 자동전송"},
		{"autoCameraPop"	: "사진전송시 카메라 자동팝업"},
		{"autoMenual"		: "업무별 기능설정"},
		{"setPopCheck"		: "업무별 기능설정 자동팝업"},
		{"approval_yn"		: "대리점장 권한여부"},					//긴급사용 승인권한 확인시 사용
		{"hpsrTmsl"			: "집배달 시간대역 순서"},
		{"videoLinkClicked"	: "공지사항 유튜브 링크 클릭"},    			// 공지사항에 유튜브 링크 있을때는 영상 클릭해야만 확인버튼&백버튼 클릭가능
		{"weekTM"			: "주간근무 시간 팝업 확인 일자"},			//주간근무 시간 팝업 확인시 날짜 저장
		{"videoPlay_yn" 	: "당일 비디오 팝업 확인"},					//재해예방 동영상  확인 시 저장
	    {"videoPlayTM" 	: "당일 비디오 팝업 확인"}			   	 //재해예방 동영상 팝업 확인 시 저장
	]
};
