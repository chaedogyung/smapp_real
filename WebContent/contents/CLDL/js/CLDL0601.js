
// 뒤로가기 버튼 클릭시 이벤트
LEMP.addEvent('backbutton', 'page.onBack');

var page = {

    // 데이터
    CLDL0601: {},

    // Background 상태
    isBackground: false,

    // mms 기본 메시지
    mmsMessage: '딩~동!!\n' +
        '진심을 다하는 롯데택배입니다.\n' +
        '고객님의 소중한 상품이 도착되었다는 소식을 알려드립니다.\n' +
        '불편사항 있으시면 언제든지 연락바라며, 항상 최고의 서비스를 위해 노력하겠습니다.',

    // API 호출 인터페이스
    apiParam: {
        id: 'HTTP',             // 디바이스 콜 ID
        param: {                // 디바이스용 데이터
            task_id: '',        // 화면 ID
            type: '',
            baseUrl: '',
            method: 'POST',     // API METHOD(지정 안하면 'POST' 로 자동 셋팅)
            callback: '',       // API CALLBACK
            contentType: 'application/json; charset=utf-8'
        },
        data: {parameters: {}}  // API용 데이터
    },

    //////////////////////////////////////////////////
    // 초기화 (LEMP에서 최초 실행)
    init: function() {
        page.initEvent();       // 이벤트 초기화
        page.initDisplay();     // 디스플레이 초기화
    },

    //////////////////////////////////////////////////
    // 이벤트 초기화
    initEvent: function() {
        // 뒤로가기 버튼 클릭
        $('#btnBack').click(function() {
            page.onBack();
        });

        // 인수자 선택 버튼 클릭
        $('#btnRcv').click(function() {
            if (!$(this).hasClass('disabled')) {
                // 인수자 설정 팝업 호출
                var popUrl = smutil.getMenuProp('COM.COM0601', 'url');
                LEMP.Window.open({
                    _sPagePath: popUrl
                });
            }
        });

        // 송장 번호 직접 입력 클릭
        $('#inputScan').click(function() {
            if (page.possibleScan()) {
                // 송장 번호 직접 입력 팝업 호출
                var popUrl = smutil.getMenuProp('COM.COM0102', 'url');
                LEMP.Window.open({
                    _sPagePath: popUrl
                });
            }
        });

        // 송장 번호 스캔 버튼 클릭
        $('#btnScan').click(function() {
            if (page.possibleScan()) {
                // 카메라 스캔 호출
                LEMP.Window.openCodeReader({
                    "_fCallback": page.codeReaderCallback
                });
            }
        });

        // 카메라 버튼 클릭
        $('#btnCamera').click(function() {
            var date = new Date();
            var curTime = date.LPToFormatDate('yyyymmddHHnnss');
            var fileName = `000000000000_cdlv_${curTime}.jpg`;

            smutil.callCamera(fileName, 'page.imageCallback');
        });

        // 갤러리 버튼 클릭
        $('#btnImage').click(function() {
            var date = new Date();
            var curTime = date.LPToFormatDate('yyyymmddHHnnss');
            var fileName = `000000000000_cdlv_${curTime}.jpg`;

            smutil.callGallery(fileName, 'page.imageCallback');
        });

        // 송장번호/전화번호 버튼 클릭
        $(document).on('click', '.btnInvNo, .btnTelNum', function() {
            var invNo = $(this).closest('li').attr('id');
            var popUrl = smutil.getMenuProp('CLDL.CLDL0407','url');
            LEMP.Window.open({
                _sPagePath: popUrl,
                _oMessage: {
                    param: {
                        invNo: invNo
                    }
                }
            });
        });

        // 송장번호 삭제 버튼 클릭
        $(document).on('click', '.btnInvNoDel', function() {
            $(this).closest('li').remove();         // 송장 아이템 삭제
            $('#btnRcv').removeClass('disabled');   // 인수자 선택 활성화
            $('#mmsInvNo').text('송장번호 : ');       // 송장 번호 초기화
        });

        // 전송 버튼 클릭
        $('#btnSend').click(page.send);
    },

    //////////////////////////////////////////////////
    // 디스플레이 초기화
    initDisplay: function() {
        // 마지막 전송 메시지
        var mmsMessage = LEMP.Properties.get({ '_sKey': 'mmsMessage' });

        // 마지막 전송 메시지가 없다면 기본 메시지로 설정
        if (smutil.isEmpty(mmsMessage)) {
            mmsMessage = page.mmsMessage;
        }

        // 전송할 메시지 설정
        $('#mmsMessage').val(mmsMessage);

        // 인수자 명 메시지 설정
        $('#mmsRcvName').text('인수자 : ');

        // 기존 설정한 인수자 정보 설정
        var acptSctInfo = LEMP.Properties.get({
            '_sKey' : 'acptSctInfo2',
        });

        if(!smutil.isEmpty(acptSctInfo)){
            page.setReceiver(acptSctInfo.acpt_sct_cd, acptSctInfo.acpr_nm);
        }

        // 송장번호 메시지 설정
        $('#mmsInvNo').text('송장번호 : ');
    },

    //////////////////////////////////////////////////
    // 스캔 가능 여부 확인
    possibleScan: function() {
        // 인수자 정보 유효성 체크
        var rcvName = $('#rcvName').val();              // 인수자 명
        var rcvCode = $('#rcvCode').val();              // 인수자 코드
        if (smutil.isEmpty(rcvName) || smutil.isEmpty(rcvCode)) {
            LEMP.Window.alert({
                '_sTitle' : '사진전송',
                '_vMessage' : '인수자 정보가 없습니다.\n인수자를 확인해주세요'
            });

            return false;
        }

        if ($('#invNoItem').length > 0) {
            LEMP.Window.toast({
                '_sMessage' : '1개의 송장만 등록 가능합니다.',
                '_sDuration' : 'short'
            });

            return false;
        }

        return true;
    },

    //////////////////////////////////////////////////
    // 송장번호 유효성 확인
    validateInvNo: function(invNo) {
        invNo = String(invNo);

        // 길이 확인
        if (invNo.length === 12) {
            // 규칙 확인
            if (Number(invNo.substr(0,11)) % 7 === Number(invNo.substr(11,1))) {
                // 중복 확인
                var invNoItem = $('#invNoItem').find('.btnInvNo').data('invNo');
                if (invNoItem === invNo) {
                    LEMP.Window.alert({
                        "_sTitle" : "경고",
                        "_vMessage" : "이미 스캔된 송장입니다."
                    });

                    // 실패 TTS 호출
                    smutil.callTTS("0", "0", null, page.isBackground);
                    return false;
                } else {
                    return true;
                }
            }
        }

        LEMP.Window.alert({
            "_sTitle" : "경고",
            "_vMessage" : "정상적인 송장번호가 아닙니다."
        });

        // 실패 TTS 호출
        smutil.callTTS("0", "0", null, page.isBackground);

        return false;
    },

    //////////////////////////////////////////////////
    // 휴대폰 번호 여부 확인
    isPhoneNumber: function(phoneNumber) {
        var arr = ['010', '011', '016', '017', '018', '019', '050'];
        phoneNumber = smutil.nullToValue(phoneNumber, '');

        return (phoneNumber.length > 10 && arr.indexOf(phoneNumber.substr(0, 3)) > -1);
    },

    //////////////////////////////////////////////////
    // 두 번호로 휴대폰 번호 조회
    getPhoneNumber: function(phoneNumber1, phoneNumber2){
        if (page.isPhoneNumber(phoneNumber1)) {
            return phoneNumber1;
        } else if (page.isPhoneNumber(phoneNumber2)) {
            return phoneNumber2;
        }

        // 둘다 휴대폰 번호가 아니면 phoneNumber1 리턴
        return phoneNumber1;
    },

    //////////////////////////////////////////////////
    // 인수자 정보 설정
    setReceiver: function(code, name) {
        $('#rcvName').val(name);                    // 인수자 명 hidden
        $('#rcvCode').val(code);                    // 인수자 코드 hidden
        $('#rcvNameText').text(name);               // 인수자 명
        $('#mmsRcvName').text('인수자 : ' + name);    // 인수자 명 메시지

        var acpt_sct_info = {
            'acpt_sct_cd' : code
            , 'acpr_nm' : name
        };

        // 인수자정보 메모리에 저장
        LEMP.Properties.set({
            '_sKey' : 'acptSctInfo2',
            '_vValue' : acpt_sct_info
        });
    },

    //////////////////////////////////////////////////
    // 송장 아이템 추가
    addItem: function() {
        if ($('#invNoItem').length === 0) {
            var template = Handlebars.compile($('#cldl0601_list_template').html());

            $('#cldl0601LstUl').append(template(page.CLDL0601.item));
            $('#mmsInvNo').text('송장번호 : ' + (page.CLDL0601.invNo).replace(/([0-9]{4})([0-9]{4})([0-9]{4})/,"$1-$2-$3"));

            // 성공 TTS 호출
            smutil.callTTS("1", "0", null, page.isBackground);
        }
    },

    //////////////////////////////////////////////////
    // MMS 전송
    send: function() {
        var mmsMessage = $('#mmsMessage').val();        // mms 메시지
        var mmsRcvName = $('#mmsRcvName').text();       // 인수자
        var mmsInvNo = $('#mmsInvNo').text();           // 송장번호
        var mmsImage = $('.imgBox img').attr('src');    // 사진
        var rcvName = $('#rcvName').val();              // 인수자 명
        var rcvCode = $('#rcvCode').val();              // 인수자 코드

        var arrPhoneNumber = [];                        // 휴대폰 번호 목록
        var arrInvNo = [];                              // 송장 번호 목록
        var arrUsrCpno = [];                            // 휴대폰 번호 목록

        // 인수자 정보 유효성 체크
        if (smutil.isEmpty(rcvName) || smutil.isEmpty(rcvCode)) {
            LEMP.Window.alert({
                '_sTitle' : '사진전송',
                '_vMessage' : '인수자 정보가 없습니다.\n인수자를 확인해주세요'
            });

            return false;
        }

        // 송장 번호 유효성 체크
        if ($('#invNoItem').length === 0) {
            LEMP.Window.alert({
                '_sTitle' : '사진전송',
                '_vMessage' : '스캔된 송장번호가 없습니다.\n송장번호를 확인해주세요'
            });

            return false;
        }

        // 메시지 유효성 체크
        if (smutil.isEmpty(mmsMessage)) {
            LEMP.Window.alert({
                '_sTitle' : '사진전송',
                '_vMessage' : '배송문구 내용이 입력 되지 않았습니다\n내용을 확인해주세요'
            });

            return false;
        }

        // 사진 유효성 체크
        if (smutil.isEmpty(mmsImage)) {
            LEMP.Window.alert({
                '_sTitle' : '사진전송',
                '_vMessage' : '이미지가 선택 되지 않았습니다\n내용을 확인해주세요'
            });

            return false;
        }

        // 인수자 정보가 있으면 메시지에 셋팅
        if (!smutil.isEmpty(mmsRcvName)) {
            mmsMessage = mmsMessage.concat('\n', mmsRcvName);
        }

        // 송장번호 정보가 있으면 메시지에 셋팅
        if(!smutil.isEmpty(mmsInvNo)) {
            mmsMessage = mmsMessage.concat('\n', mmsInvNo);
        }

        var invNo = $('#invNoItem').find('.btnInvNo').data('invNo');
        var phoneNumber = $('#invNoItem').find('.btnTelNum').data('telNum');
        var cnfYn = $('#invNoItem').data('cnfYn');

        // 휴대폰 번호일 경우만 MMS 전송
        if (page.isPhoneNumber(phoneNumber)) {
            arrPhoneNumber.push(phoneNumber.replace(/\-/gi,''));
        }

        arrInvNo.push(String(invNo));
        arrUsrCpno.push(phoneNumber);

        // API Data 설정
        page.CLDL0601.apiData = {
            inv_no: arrInvNo,
            acpt_sct_cd: rcvCode,
            acpr_nm: rcvName,
            usr_cpno: arrUsrCpno,
            images: mmsImage
        };

        // MMS Data 설정
        page.CLDL0601.mmsData = {
            phoneNumber: arrPhoneNumber,
            title: '롯데택배',
            context: mmsMessage,
            filePath: mmsImage,
            sleepTime: 0
        };

        // 배달 완료 처리 & 스캔/사진 일괄 전송
        if (cnfYn === 'Y') {
            page.cmptPhtgTrsmPic();
        } else {
            page.cmptPhtgTrsmPop();
        }
    },

    //////////////////////////////////////////////////
    // API CALL: 송장 등록 정보 조회
    cmptPhtgTrsmCheck: function() {
        page.apiParam.id = 'HTTP';
        page.apiParam.param.baseUrl = '/smapis/cldl/cmptPhtgTrsmCheck';     // API NO
        page.apiParam.param.callback = 'page.cmptPhtgTrsmCheckCallback';    // API CALLBACK
        page.apiParam.data.parameters.inv_no = page.CLDL0601.invNo;         // PARAM: 운송장번호

        smutil.callApi(page.apiParam);
    },

    //////////////////////////////////////////////////
    // API CALLBACK: 송장 등록 정보 조회
    cmptPhtgTrsmCheckCallback: function(res) {
        var data = res.data.list[0];
        var invNo = page.CLDL0601.invNo;
        var item = {
            invNo: invNo,
            cnf_yn: data.cnf_yn,
            txtInvNo: (invNo).replace(/([0-9]{4})([0-9]{4})([0-9]{4})/,"$1-$2-$3"),
            telNum: '',
            txtTelNum: '입력해주세요.'
        };

        if (smutil.apiResValidChk(res) && res.code === '0000') {
            // 사진 전송 여부 확인
            if (data.pic_send_yn === 'Y') {
                LEMP.Window.alert({
                    "_sTitle" : "사진전송",
                    "_vMessage" : "이미 사진전송이 완료된 송장입니다."
                });

                // 실패 TTS 호출
                smutil.callTTS("0", "0", null, page.isBackground);
                return;
            }

            // 인수자 정보 설정
            if (!smutil.isEmpty(data.acpt_sct_cd) && !smutil.isEmpty(data.acpr_nm)) {
                page.setReceiver(data.acpt_sct_cd, data.acpr_nm);
            }

            // 확정된 송장의 경우 인수자 변경 불가
            if (data.cnf_yn === 'Y') {
                $('#btnRcv').addClass('disabled');
            }

            // 전화번호 설정
            var telNum1 = smutil.nullToValue(data.acper_tel, '');   // 전화번호 1
            var telNum2 = smutil.nullToValue(data.acper_cpno, '');  // 전화번호 2

            var telNum = page.getPhoneNumber(telNum1, telNum2);
            if (!smutil.isEmpty(telNum)) {
                item.telNum = telNum;

                if (telNum.LPStartsWith('050')) {
                    item.txtTelNum = (telNum).replace(/([0-9]{4})([0-9]{4})([0-9]{4})/,"$1-$2-$3");
                } else {
                    item.txtTelNum = telNum.LPToFormatPhone();
                }
            }

            page.CLDL0601.item = item;

            if (data.cnf_yn === 'Y') {
                // 확정인 경우 스캔 등록 안함
                page.addItem();
            } else {
                // 확정이 아닌경우 스캔 등록
                page.cmptScanRgst();
            }
        } else {
            // 실패 TTS 호출
            smutil.callTTS("0", "0", null, page.isBackground);
        }
    },

    //////////////////////////////////////////////////
    // API CALL: 배달 완료 스캔 등록
    cmptScanRgst: function() {
        var date = new Date();
        var scan_dtm = date.LPToFormatDate("yyyymmddHHnnss");

        page.apiParam.id = 'HTTP';
        page.apiParam.param.baseUrl = '/smapis/cldl/cmptScanRgst';          // API NO
        page.apiParam.param.callback = 'page.cmptScanRgstCallback';         // API CALLBACK
        page.apiParam.data.parameters.inv_no = page.CLDL0601.invNo;         // PARAM: 운송장번호
        page.apiParam.data.parameters.cldl_sct_cd = 'D';                    // PARAM: 집하 / 배달 업무 구분 코드
        page.apiParam.data.parameters.cldl_tmsl_cd = '19';                  // PARAM: 시간대별 구분 코드
        page.apiParam.data.parameters.scan_dtm = scan_dtm;                  // PARAM: 스캔 시간
        page.apiParam.data.parameters.acpt_sct_cd = $('#rcvCode').val();    // PARAM: 인수자 구분 코드
        page.apiParam.data.parameters.acpr_nm = $('#rcvName').val();        // PARAM: 인수자 명

        smutil.callApi(page.apiParam);
    },

    //////////////////////////////////////////////////
    // API CALLBACK: 배달 완료 스캔 등록
    cmptScanRgstCallback: function() {
        page.addItem();
    },

    //////////////////////////////////////////////////
    // API CALL: 배달 완료 처리 & 스캔/사진 일괄 전송(확정 송장 용)
    cmptPhtgTrsmPic: function() {
        smutil.loadingOn();
        var arr = [page.CLDL0601.apiData.images];

        // 사진전송 API 파라미터 세팅
        page.apiParam.id = 'HTTPFILE';
        page.apiParam.param.baseUrl = 'smapis/cldl/cmptPhtgTrsmPic';                // API NO
        page.apiParam.param.callback = 'page.cmptPhtgTrsmPicCallback';              // API CALLBACK
        page.apiParam.data.parameters.inv_no = page.CLDL0601.apiData.inv_no;        // PARAM: 운송장 번호
        page.apiParam.data.parameters.usr_cpno = page.CLDL0601.apiData.usr_cpno;    // PARAM: 고객휴대전화번호
        page.apiParam.files = arr;                                                  // PARAM: 이미지 업로드

        smutil.callApi(page.apiParam);
    },

    //////////////////////////////////////////////////
    // API CALLBACK: 배달 완료 처리 & 스캔/사진 일괄 전송(확정 송장 용)
    cmptPhtgTrsmPicCallback: function(res){
        if (smutil.apiResValidChk(res) && res.code === '0000') {
            page.mms();
        } else if (res.code === 'SMAPP_BAD_PARAMETER') {
            LEMP.Window.alert({
                '_sTitle' : '사진전송',
                '_vMessage' : res.message
            });
        }
    },

    //////////////////////////////////////////////////
    // API CALL: 배달 완료 처리 & 스캔/사진 일괄 전송
    cmptPhtgTrsmPop: function() {
        smutil.loadingOn();
        var arr = [page.CLDL0601.apiData.images];

        // 사진전송 API 파라미터 세팅
        page.apiParam.id = 'HTTPFILE';
        page.apiParam.param.baseUrl = 'smapis/cldl/cmptPhtgTrsmPop';                // API NO
        page.apiParam.param.callback = 'page.cmptPhtgTrsmPopCallback';              // API CALLBACK
        page.apiParam.data.parameters.inv_no = page.CLDL0601.apiData.inv_no;        // PARAM: 움송장 번호
        page.apiParam.data.parameters.usr_cpno = page.CLDL0601.apiData.usr_cpno;    // PARAM: 고객휴대전화번호
        page.apiParam.files = arr;                                                  // PARAM: 이미지 업로드

        smutil.callApi(page.apiParam);
    },

    //////////////////////////////////////////////////
    // API CALLBACK: 배달 완료 처리 & 스캔/사진 일괄 전송
    cmptPhtgTrsmPopCallback: function(res){
        if (smutil.apiResValidChk(res) && res.code === '0000') {
            page.mms();
        } else if (res.code === 'SMAPP_BAD_PARAMETER') {
            LEMP.Window.alert({
                '_sTitle' : '사진전송',
                '_vMessage' : res.message
            });
        }
    },

    //////////////////////////////////////////////////
    // NATIVE CALLBACK: 바코드 스캐너(카메라)
    codeReaderCallback: function(res) {
        if (res.result) {
            var invNo = res.data;

            if (page.validateInvNo(invNo)) {
                $('#inputScan').val(invNo);

                page.CLDL0601.invNo = invNo;
                page.cmptPhtgTrsmCheck();
            }
        } else {
            LEMP.Window.alert({
                "_sTitle" : "경고",
                "_vMessage" : "바코드를 읽지 못했습니다."
            });

            // 실패 TTS 호출
            smutil.callTTS("0", "0", null, page.isBackground);
        }
    },

    //////////////////////////////////////////////////
    // NATIVE CALLBACK: 바코드 스캐너(디바이스)
    scanCallback: function(res) {
        page.isBackground = res.isBackground;

        if (page.possibleScan()) {
            var invNo = res.barcode;

            if (page.validateInvNo(invNo)) {
                $('#inputScan').val(invNo);

                page.CLDL0601.invNo = invNo;
                page.cmptPhtgTrsmCheck();
            }
        } else {
            // 실패 TTS 호출
            smutil.callTTS("0", "0", null, page.isBackground);
        }
    },

    //////////////////////////////////////////////////
    // NATIVE CALLBACK: 카메라/갤러리 이미지
    imageCallback:function(res){
        if (res.result) {
            $('.imgBox > img').attr('src', res.target_path);
        }else {
            LEMP.Window.alert({
                '_sTitle' : '사진전송',
                '_vMessage' : '이미지를 가져올 수 없습니다.'
            });
        }
    },

    //////////////////////////////////////////////////
    // NATIVE CALL: MMS 플러그인 호출
    mms: function(){
        var tr = {
            'id': 'SENDMMS',
            'param': page.CLDL0601.mmsData
        };

        // mms 호출
        smutil.nativeMothodCall(tr);
    },

    //////////////////////////////////////////////////
    // NATIVE CALLBACK: MMS 플러그인 호출
    mmsCallback: function(statusCode){
        if(statusCode){
            // 기사가 입력한 메시지
            var mmsMessage = smutil.nullToValue($('#mmsMessage').val(),'');

            // 기사가 입력한 메시지를 properties 에 저장
            LEMP.Properties.set({
                '_sKey': 'mmsMessage',
                '_vValue': mmsMessage
            });

            // MMS 전송 후 Alert
            var textButton = LEMP.Window.createElement({
                '_sElementName': 'TextButton'
            });

            textButton.setProperty({
                _sText: '확인',
                _fCallback: function()   {
                    LEMP.Window.close({
                        _oMessage: {
                            param: ''
                        }
                    });
                }
            });

            LEMP.Window.alert({
                '_sTitle' : '사진전송',
                '_vMessage' : '송장번호와 사진을 서버로 전송했습니다.',
                '_eTextButton' : textButton
            });
        } else{
            LEMP.Window.alert({
                '_sTitle' : '사진전송 mms발송 실패',
                '_vMessage' : 'MMS 문자발송에 실패했습니다.'
            });

            smutil.loadingOff();            // 로딩바 닫기
        }
    },

    //////////////////////////////////////////////////
    // POPUP CALLBACK: 인수자 팝업
    com0601Callback : function(res){
        // 선택한 인수자 정보가 있을경우
        if(!smutil.isEmpty(res.selectedCode)
            && !smutil.isEmpty(res.selectedText)){
            page.setReceiver(res.selectedCode, res.selectedText);
        }
    },

    //////////////////////////////////////////////////
    // POPUP CALLBACK: 송장번호 직접 입력 팝업
    InputCallback: function(res) {
        var invNo = res.inv_no;

        if (page.validateInvNo(invNo)) {
            $('#inputScan').val(invNo);

            page.CLDL0601.invNo = invNo;
            page.cmptPhtgTrsmCheck();
        }
    },

    //////////////////////////////////////////////////
    // POPUP CALLBACK: 전화번호 입력 팝업
    CLDL0407Callback : function(res) {
        var item = $('#' + res.param.invNo);

        item.find('.btnTelNum > span').text(res.param.pNum);
        item.find('.btnTelNum').data('telNum', res.param.pNum.replace(/\-/gi,''));
    },

    //////////////////////////////////////////////////
    // 물리적 뒤로가기 버튼 및 뒤로가기 버튼 클릭
    onBack : function(){
        // 로딩중에 물리적인 뒤로 가기가 눌리면 아무 동작 안함
        if($('#lodingDvi').length > 0 && $('#lodingDvi').is(':visible')) {
        } else {        // 로딩중이 아니면 화면 닫기
            LEMP.Window.close();
        }
    }
};

