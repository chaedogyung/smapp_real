/**
 * 
 * 01.클래스 설명 : LEMPCore 최상위 클래스.</br> 
 * 02.제품구분 : LEMP Xross</br>
 * 03.기능(콤퍼넌트) 명 : LEMPCore 최상위 클래스 </br>
 * 04.관련 API/화면/서비스 : 해당 사항 없음 </br>
 * 05.관련테이블 : 해당 사항 없음 </br>
 * 06.관련 서비스 : 해당 사항 없음 </br> 
 * 07.수정이력  </br>
 * <pre>
 * ********************************************************************************************************************************** </br>
 *  수정일                                          이름                          변경 내용</br>
 * **********************************************************************************************************************************</br>
 *  2016-09-01                                    김승현                         최초 작성</br>
 * **********************************************************************************************************************************</br>
 *</pre>
 *
 * @author 김승현 
 * @version 1.0 
 * 
 */
var LEMPCore = {};

LEMPCore.version = "3.0";
// 커맨드 작업을 수행하고 있는지여부 check
LEMPCore.readystatus = false;
LEMPCore.loglevel = "1248";  //Log(1)Debug(2)Warning(4)Error(8)
//LEMPCore.layers = {};
// contents 찾는 경로
LEMPCore.RELATE_DEPTH = "";
// push register할 때 정보 읽을 용도
LEMPCore.APP_CONFIG = {}


/**
 * 
 * 01.클래스 설명 : LEMP Window 클래스 .</br> 
 * 02.제품구분 : LEMP Xross</br>
 * 03.기능(콤퍼넌트) 명 :  LEMP Client에서 생성하는 Window 객체 </br>
 * 04.관련 API/화면/서비스 : </br>
 * 05.관련테이블 : 해당 사항 없음 </br>
 * 06.관련 서비스 : 해당 사항 없음 </br> 
 * 07.수정이력  </br>
 * <pre>
 * ********************************************************************************************************************************** </br>
 *  수정일                                          이름                          변경 내용</br>
 * **********************************************************************************************************************************</br>
 *  2016-09-01                                    김승현                         최초 작성</br>
 * **********************************************************************************************************************************</br>
 *</pre>
 *
 * @author 김승현 
 * @version 1.0 
 * 
 */
LEMPCore.Window = new Object();

LEMPCore.Window.servicename = "Window";

/**
 * 
 * 01.클래스 설명 : LEMP TitleBar 클래스 .</br> 
 * 02.제품구분 : LEMP Xross</br>
 * 03.기능(콤퍼넌트) 명 :  LEMP Client에서 생성하는 Window 객체내 TitleBar UI Element </br>
 * 04.관련 API/화면/서비스 :</br>
 * 05.관련테이블 : 해당 사항 없음 </br>
 * 06.관련 서비스 : 해당 사항 없음 </br> 
 * 07.수정이력  </br>
 * <pre>
 * ********************************************************************************************************************************** </br>
 *  수정일                                          이름                          변경 내용</br>
 * **********************************************************************************************************************************</br>
 *  2016-09-01                                    김승현                         최초 작성</br>
 * **********************************************************************************************************************************</br>
 *</pre>
 *
 * @author 김승현 
 * @version 1.0 
 * 
 */
LEMPCore.Window.TitleBar = function(_sTitle) {
	this.element_type = "Bar";
	this.element_name = "titlebar";
	this.visible = true;
	this.title = arguments[0]._sTitle;
	this.text_align = "center"
	this.id = "";
	this.left = [];
	this.right = [];
};

/**
 * TitleBar 속성 지정.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sTitle		타이틀바에 표시될 제목.
 * @param Boolean _bVisible		(Default : true) 타이틀바를 표시 여부
 * @param String _sImagePath		타이틀바의 배경 이미지.
 * @param Array _aLeftImageButton	타이틀바의 왼쪽에 들어갈 버튼 엘리먼트 배열.
 * @param Array _aRightImageButton	타이틀바의 오른쪽에 들어갈 버튼 엘리먼트 배열.
 *  *  
 * @return 
 */
LEMPCore.Window.TitleBar.prototype.setProperty = function(){
	
	/*
	var required = new Array("_sTitle");
	if(this.title == "" || this.title == undefined){
		if(!LEMPCore.Module.checkparam(arguments[0], required)) {
			return;
		}
	}
	*/
	this.visible  = arguments[0]._bVisible != undefined ? arguments[0]._bVisible : this.visible;
	this.image_name = arguments[0]._sImagePath;
	this.title = arguments[0]._sTitle ? arguments[0]._sTitle : this.title;
	this.text_align = arguments[0]._sTitleAlign ? arguments[0]._sTitleAlign : this._sTitleAlign;
	this.left = arguments[0]._aLeftImageButton;
	this.right = arguments[0]._aRightImageButton;
	this.id = arguments[0]._sID;
	
//	if(this.left && this.left.length)	{
//		this.left.forEach(function(imageButton)	{
//			if(imageButton && imageButton.constructor == LEMPCore.Window.ImageButton)	{
//				LEMPCore.Window.setElement(imageButton);
//			}
//		});
//	}
//	
//	if(this.right && this.right.length)	{
//		this.right.forEach(function(imageButton)	{
//			if(imageButton && imageButton.constructor == LEMPCore.Window.ImageButton)	{
//				LEMPCore.Window.setElement(imageButton);
//			}
//		});
//	}

	
};


/**
 * 
 * 01.클래스 설명 : LEMP ToolBar 클래스 .</br> 
 * 02.제품구분 : LEMP Xross</br>
 * 03.기능(콤퍼넌트) 명 :  LEMP Client에서 생성하는 Window 객체내 ToolBar UI Element </br>
 * 04.관련 API/화면/서비스 :</br>
 * 05.관련테이블 : 해당 사항 없음 </br>
 * 06.관련 서비스 : 해당 사항 없음 </br> 
 * 07.수정이력  </br>
 * <pre>
 * ********************************************************************************************************************************** </br>
 *  수정일                                          이름                          변경 내용</br>
 * **********************************************************************************************************************************</br>
 *  2016-09-01                                    김승현                         최초 작성</br>
 * **********************************************************************************************************************************</br>
 *</pre>
 *
 * @author 김승현 
 * @version 1.0 
 * 
 */
LEMPCore.Window.ToolBar = function(aImageButton) {
	this.element_type = "Bar";
	this.element_name = "toolbar";
	this.visible = true;
	this.buttons = arguments[0]._aImageButton;
	this.id = "";
};

/**
 * ToolBar 속성 지정.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Array _aImageButton		툴바에 지정할 이미지 버튼 목록.
 * @param Boolean _bVisible		(Default : true) 툴바를 화면에 표시 여부( true 또는 false )
 * @param String _sImagePath		툴바의 배경 이미지.
 *  *  
 * @return 
 */
LEMPCore.Window.ToolBar.prototype.setProperty = function(){
	
	/*
	var required = new Array("_aImageButton");
	
	if(!this.buttons){
		if(!LEMPCore.Module.checkparam(arguments[0], required)) {
			return;
		}
	}
	*/
	
	this.visible  = arguments[0]._bVisible != undefined ? arguments[0]._bVisible : this.visible;
	this.image_name = arguments[0]._sImagePath? arguments[0]._sImagePath : this.image_name;
	this.buttons = arguments[0]._aImageButton? arguments[0]._aImageButton : this.buttons;
	this.id = arguments[0]._sID;
	
	// toolbar, titlebar는 imagebutton만 가능
//	if(this.buttons instanceof Array)	{
//		this.buttons.forEach(function(imageButton)	{
//			if(imageButton && imageButton.constructor == LEMPCore.Window.ImageButton)	{
//				LEMPCore.Window.setElement(imageButton);
//			}
//		});
//	}
	
};

/**
 * 
 * 01.클래스 설명 : LEMP SideBar 클래스 .</br> 
 * 02.제품구분 : LEMP Xross</br>
 * 03.기능(콤퍼넌트) 명 :  LEMP Client에서 생성하는 Window 객체내 SideBar UI Element </br>
 * 04.관련 API/화면/서비스 :</br>
 * 05.관련테이블 : 해당 사항 없음 </br>
 * 06.관련 서비스 : 해당 사항 없음 </br> 
 * 07.수정이력  </br>
 * <pre>
 * ********************************************************************************************************************************** </br>
 *  수정일                                          이름                          변경 내용</br>
 * **********************************************************************************************************************************</br>
 *  2016-09-01                                    김승현                         최초 작성</br>
 * **********************************************************************************************************************************</br>
 *</pre>
 *
 * @author 김승현 
 * @version 1.0 
 * 
 */
LEMPCore.Window.SideBar = function(_aImageButton) {
	this.element_type = "Bar";
	this.element_name = "SideBar";
	this.buttons = arguments[0]._aImageButton;
	this.position = "left";
	this.id = "";
};

/**
 * SideBar 속성 지정.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Array _aImageButton		사이드바에 지정할 이미지 버튼 목록.
 * @param Boolean _bVisible		(Default : true) 툴바를 화면에 표시 여부( true 또는 false )
 * @param String _sImagePath		툴바의 배경 이미지.
 * @param String _sPositon (Default : left) 사이드바 위치 ( left 또는 right )
 * 
 * @return 
 */
LEMPCore.Window.SideBar.prototype.setProperty = function(_aImageButton){
	
	var required = new Array("_aImageButton");
	
	if(!this.buttons){
		if(!LEMPCore.Module.checkparam(arguments[0], required)) {
			return;
		}
	}
	
	this.visible  = arguments[0]._bVisible ? arguments[0]._bVisible : true;
	this.image_name = arguments[0]._sImagePath? arguments[0]._sImagePath : this.image_name;
	this.buttons = arguments[0]._aImageButton? arguments[0]._aImageButton : this.buttons;
	this.position = arguments[0]._sPosition? arguments[0]._sPosition : this.position;
	this.id = arguments[0]._sID;
	
//	if(this.buttons instanceof Array)	{
//		this.buttons.forEach(function(imageButton)	{
//			if(imageButton && imageButton.constructor == LEMPCore.Window.ImageButton)	{
//				LEMPCore.Window.setElement(imageButton);
//			}
//		});
//	}
	
};

/**
 * UI Element 생성 요청</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Array _aElement	생성할 엘리먼트들의 객체 배열.
 *  
 * @return 
 */
LEMPCore.Window.draw = function(_aElement) {
	
	var action = "draw";
	
	if(!arguments[0]){
		LEMPCore.Module.logger(this.servicename, action ,"I", "Parameter is empty.");
		return;
	}
	
	

	var oldparam = {};
	
	var tr = {
		id:"SET_APP",
		param:{}
	};
	
	// TitleBar, ToolBark, SideBar setting
	for(var i=0; i < arguments[0]._aElement.length ; i++ ) {
		switch( arguments[0]._aElement[i].constructor )
		{
			case LEMPCore.Window.TitleBar :
				oldparam.titlebar = arguments[0]._aElement[i];
				
				//LEMPCore.Window.setElement(oldparam.titlebar);
				break;
			case LEMPCore.Window.ToolBar :
				oldparam.bottom_toolbar = arguments[0]._aElement[i];
				
				//LEMPCore.Window.setElement(oldparam.bottom_toolbar);
				break;
			case LEMPCore.Window.SideBar :
				if(arguments[0]._aElement[i].position == "left"){
					oldparam.left_toolbar = arguments[0]._aElement[i];
					
					//LEMPCore.Window.setElement(oldparam.left_toolbar);
				}else if(arguments[0]._aElement[i].position == "right"){
					oldparam.right_toolbar = arguments[0]._aElement[i];
					
					//LEMPCore.Window.setElement(oldparam.right_toolbar);
				}else{
					LEMPCore.Module.logger(this.servicename, action ,"I", "A SideBar must have position value.");
				}
				break;
			
		}
	}
	
	var params = $.extend(true, {}, oldparam);
	
	tr.param = params;
	
	LEMPCore.Module.gateway(tr, this.servicename , action );
	
	
};

/**
 * 
 * 01.클래스 설명 : LEMP TextButton 클래스 .</br> 
 * 02.제품구분 : LEMP Xross</br>
 * 03.기능(콤퍼넌트) 명 :  LEMP Client에서 생성하는 Window 객체내 TextButton UI Element </br>
 * 04.관련 API/화면/서비스 :</br>
 * 05.관련테이블 : 해당 사항 없음 </br>
 * 06.관련 서비스 : 해당 사항 없음 </br> 
 * 07.수정이력  </br>
 * <pre>
 * ********************************************************************************************************************************** </br>
 *  수정일                                          이름                          변경 내용</br>
 * **********************************************************************************************************************************</br>
 *  2016-09-01                                    김승현                         최초 작성</br>
 * **********************************************************************************************************************************</br>
 *</pre>
 *
 * @author 김승현 
 * @version 1.0 
 * 
 */
LEMPCore.Window.TextButton = function() {
	this.element_type = "button" ;
	this.element_name = "textbutton";
	this.text = "확인";
	this.callback = "";
};

/**
 * Text Button 속성 지정</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sText		텍스트 버튼에 표시될 텍스트.
 * @param Function _fCallback		버튼이 Click됐을때 실행될 callback함수.

 *  
 * @return 
 */
LEMPCore.Window.TextButton.prototype.setProperty = function(_sText){
	
	var required = new Array("_sText");
	
	if(!LEMPCore.Module.checkparam(arguments[0], required)) {
		return;
	}
	
	this.text = arguments[0]._sText;
	// textbutton은 listener
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback,"listener");
	this.callback = callback;
	
};
/**
 * 
 * 01.클래스 설명 : LEMP ImageButton 클래스 .</br> 
 * 02.제품구분 : LEMP Xross</br>
 * 03.기능(콤퍼넌트) 명 :  LEMP Client에서 생성하는 Window 객체내 ImageButton UI Element </br>
 * 04.관련 API/화면/서비스 :</br>
 * 05.관련테이블 : 해당 사항 없음 </br>
 * 06.관련 서비스 : 해당 사항 없음 </br> 
 * 07.수정이력  </br>
 * <pre>
 * ********************************************************************************************************************************** </br>
 *  수정일                                          이름                          변경 내용</br>
 * **********************************************************************************************************************************</br>
 *  2016-09-01                                    김승현                         최초 작성</br>
 * **********************************************************************************************************************************</br>
 *</pre>
 *
 * @author 김승현 
 * @version 1.0 
 * 
 */
LEMPCore.Window.ImageButton = function() {
	this.element_type = "button";
	this.element_name = "imagebutton";
	this.image_name = "";
	this.action = "";
	// badge는 아직
	//this.badge = {};
	this.id = "imageButton" + LEMPCore.Window.ImageButton.INDEX++;
};

LEMPCore.Window.ImageButton.INDEX = 0;
/**
 * ImageButton Button 속성 지정</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sText		텍스트 버튼에 표시될 텍스트.
 * @param Function _fCallback		버튼이 Click됐을때 실행될 callback함수.

 *  
 * @return 
 */
LEMPCore.Window.ImageButton.prototype.setProperty = function(_sImagePath){
	
	var required = new Array("_sImagePath");
	
	if(!LEMPCore.Module.checkparam(arguments[0], required)) {
		return;
	}

	if(arguments[0]._sID)	{
		this.id = arguments[0]._sID;
	}
	this.image_name = arguments[0]._sImagePath;
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback, "listener");
	this.action = callback;
	
};

/**
 * 특정 Window로 이동.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sName		이동할 Window 이름.
 * @param String _sType  Window 이동 방법 ( name 또는 index )
 * @param Number __nStep	이전 Window로 이동할 스텝(음수)을 지정.(0 또는 양의 정수일경우 이동하지 않음)
 * @param Object _oMessage	이동할 Window에 전달할 데이터 
 * @param String _sCallback		이동할 Window에서 실행될 callback함수명.
 *  
 * @return 
 */
LEMPCore.Window.go = function() {
	
	var action = "go";
	
	var tr = {
		id:"NAVIGATION",
		param:{
			// back: index / go: name
			type : arguments[0]._sType, // index or name
	        index : arguments[0]._nStep,
	        page_name: arguments[0]._sName,
	        message:arguments[0]._oMessage,
	        callback : arguments[0]._sCallback,
		}
	};
	
	LEMPCore.Module.gateway(tr, this.servicename , action );
	
};

/**
 * 메세지창(경고/확인)  띄우기</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String  _sTitle		메세지창 상단에 표시할 제목.
 * @param Variable _vMessage		메세지창에 표시할 내용.
 * @param Array _aTextButton	메세지창에 삽입할 TextButton 엘리먼트들.

 *  
 * @return 
 */
LEMPCore.Window.showMessage = function() {
	// Alert창, Confirm창	
	var action = "showmessage";
	
	var oldparam = {
			title : arguments[0]._sTitle,
			message : arguments[0]._sMessage,
			buttons : arguments[0]._aButtons
	};
	
	var tr = {
		id:"POPUP_MESSAGE_BOX",
		param:{}
	};
	
	var params = $.extend(true, {}, oldparam);
	
	tr.param = params;
	
	LEMPCore.Module.gateway(tr, this.servicename , action );
	
};
/**
 * Toast  띄우기</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sMessage	토스트에 표시할 Text.
 * @param String _sDuration		 (Default : short) 토스트를 표시할 시간( short 또는 long )
 *  
 * @return 
 */
LEMPCore.Window.toast = function() {
	
	var action = "toast";
	
	var oldparam = {
		message : arguments[0]._sMessage,
		duration : arguments[0]._sDuration
	};
	
	var tr = {
		id:"SHOW_MESSAGE",
		param:{}
	};
	
	var params = $.extend(true, {}, oldparam);
	
	tr.param = params;
	
	LEMPCore.Module.gateway(tr, this.servicename , action );
	
};

/**
 * Window 열기.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sPagePath	페이지 경로.
 * @param String _bReplace		화면 이동 타입. ( true : 현재 Window에서 페이지 이동 또는 false : 새창으로 띄우기 )
 * @param String _sOrientation	페이지 열때 로딩시 회전 기준값. ( portrait 또는 land )
 * @param String _sTitleBar	페이지 열때 미리 생성할 TitleBar 아이디
 * @param Object _oMessage	페이지 로딩시 전달할 데이터.
 * @param String _sName		페이지 이름( LEMP.Window.go API에서 사용할 이름 ).
 * @param Boolean _bHardwareAccel	페이지 로딩할 WebView에 대한 하드웨어 가속 옵션 설정값( true 또는 false )
 *  
 * @return 
 */
LEMPCore.Window.open = function() {
	
	var oldparam = {
		replace:arguments[0]._bReplace,
		message:arguments[0]._oMessage,
		target_page:arguments[0]._sPagePath,
		orientation:arguments[0]._sOrientation,
		fixlayer :arguments[0]._sTitleBar,
		page_name:arguments[0]._sName,
		hardware_accelator : arguments[0]._bHardwareAccel === true ? true : false
	};
	
	var action = "open";
	
	var tr = {
		
		id:"",
		param:{}
	};
			
	var params = $.extend(true, {
		replace:false,
		message:{},
		page_name : "",
		target_page:"",
		fixlayer : "",
		orientation:'none'
	}, oldparam);
	
	tr.param = params;
	
	// 네이티브에서 구분
	if(params.replace) {
		tr.id="REPLACE_WEB";
	}else{
		tr.id="SHOW_WEB";
	}
	
	LEMPCore.Module.gateway(tr, this.servicename , action );
};

/**
 * Window 닫기.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Object _oMessage	이전 페이지에 전달할 데이터.
 * @param String _sCallback		이전 페이지에서 실행할 callback함수 이름.
 *  
 * @return 
 */
LEMPCore.Window.close = function() {
	
	if(arguments[0] == undefined) arguments[0] = {};
	
	var oldparam = {
		message:arguments[0]._oMessage,
		// callback이 string인 이유: 호출될 함수가 현재 페이지가 아닌 이전페이즤 callback함수를 호출해야 하기때문에 함수의 이름을 적는다.
		callback:arguments[0]._sCallback
	};
	
	var action = "close";
	
	var tr = {
		
		id:"POP_VIEW",
		param:{}
	};
	
	var params = $.extend(true, {
		message:{},
		callback: "LEMPCore.Module.echo"					
	}, oldparam);
	
	tr.param = params;
	
	LEMPCore.Module.gateway(tr, this.servicename , action );
};
/**
 * Popup Window 열기.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sPagePath	페이지 경로.
 * @param String _sOrientation		(Default : portrait )페이지 열때 로딩시 회전 기준값. ( portrait 또는 land )
 * @param Object _oMessage	페이지 로딩시 전달할 데이터.
 * @param Boolean _bHardwareAccel		(default:false)페이지 로딩할 WebView에 대한 하드웨어 가속 옵션 설정값( true 또는 false )
 * @param String _sWidth	팝업으로 페이지를 열 경우 팝업 창의 가로 사이즈입니다.% 와 px로 지정 가능함.
 * @param String _sHeight	팝업으로 페이지를 열 경우 팝업 창의 세로 사이즈입니다.% 와 px로 지정 가능함.
 * @param String _sBaseSize	(default:device) 멀티레이아웃 사용시 팝업으로 페이지를 열경우 사이즈값의 단위가 백분율(%)로 지정될 경우 사이즈의 기준 값 ( device 뚀는 page )
 * @param String _sBaseOrientation	(default : auto) 멀티레이아웃 사용시 팝업으로 페이지를 열경우 사이즈값의 단위가 백분율(%)로 지정될 경우 rotate의 기준 값 (auto , vertical, horizontal )
 *  
 * @return 
 */
LEMPCore.Window.openpopup = function() {
	
	var action = "openpopup";
	
	var oldparam = 
	{
			message : arguments[0]._oMessage,
			target_page : arguments[0]._sPagePath,
			// 픽셀단위와 %단위가 있음
			width: arguments[0]._sWidth,
			height: arguments[0]._sHeight,
			base_on_size : arguments[0]._sBaseSize,
			base_size_orientation : arguments[0]._sBaseOrientation,
			hardware_accelator : arguments[0]._bHardwareAccel === true ? true : false
	};
	
	var defparam = {
			message:{},
			height : 350,
			width : 200,
			base_on_size : "device",
			base_size_orientation : "auto",
			target_page:""
	};
	
	
	var tr = {
			
			id:"SHOW_POPUP_VIEW",
			param:{}
	};
	
	// %를 가지고 높이를 계산하는 것
	if(oldparam.height != undefined && oldparam.height != "" ){
		if( oldparam.height.indexOf("%") > 0){
			oldparam.height_percent = parseInt(oldparam.height.replace(/\%/,""));
			delete oldparam.height;
			delete defparam.height;
		}else{
			oldparam.height = parseInt(oldparam.height);
		}
		
	}
	// %를 가지고 가로를 계사하는 것
	if(oldparam.width != undefined && oldparam.width != "" ){
		if( oldparam.width.indexOf("%") > 0){
			oldparam.width_percent =  parseInt(oldparam.width.replace(/\%/,""));
			delete oldparam.width;
			delete defparam.width;
		}else{
			oldparam.width = parseInt(oldparam.width);
		}
		
	}
	
	
	var params = $.extend(true, defparam , oldparam);
	
	
	tr.param = params;
	
	LEMPCore.Module.gateway(tr, this.servicename , action );
};

/**
 * Popup Window 닫기.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Object _oMessage	이전 페이지에 전달할 데이터.
 * @param String _sCallback		이전 페이지에서 실행할 callback함수 이름.
 *  
 * @return 
 */
LEMPCore.Window.closepopup = function() {
	
	var oldparam = {
		message:arguments[0]._oMessage,
		callback:arguments[0]._sCallback
	};
	
	var action = "closepopup";
	
	var tr = {
		
		id:"DISMISS_POPUP_VIEW",
		param:{}
	};
	
	var params = $.extend(true, {
		message:{},
		callback: "LEMPCore.Module.echo"					
	}, oldparam);
	
	tr.param = params;
	
	LEMPCore.Module.gateway(tr, this.servicename , action );
	
};

/**
 * SignPad(서명) Window 띄우기</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sTargetPath		사인패드에서 서명한 이미지를 저장할 File Path.
 * @param Function _fCallback		사인패드 처리 결과값을 받을 callback 함수.
 *  
 * @return
 */
LEMPCore.Window.openSignPad = function() {
	
	var action = "openSignPad";
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
	var splitTargetPath = LEMPCore.Module.pathParser(arguments[0]._sTargetPath);
	
	var oldparam = {
		target_path_type : splitTargetPath.type,
		target_path : splitTargetPath.path,
		//image_name : arguments[0]._sImagePath,
		callback:callback
	};
	
	var tr = {
		id:"GOTO_SIGNATURE",
		param:{}
	};
	
	tr.param = oldparam;
	
	LEMPCore.Module.gateway(tr, this.servicename , action );	
	
};


/**
 * File Explorer(탐색기) Window 띄우기</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 *  
 * @return Object File 정보 객체
 */
LEMPCore.Window.openFileExplorer = function() {
	
	var action = "openFileExplorer";
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
	
	var tr = {
			id:"OPEN_FILE_BROWSER",
			param:{
				"callback" : callback
			}
	};
	
	LEMPCore.Module.gateway(tr, this.servicename , action );	
	
};

/**
 * ImageViewer  띄우기</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sImagePath	이미지 뷰어로 열 이미지 File Path.
 * @param Function _fCallback	 이미지 뷰어 Close시 결과값을 받을 callback함수.
 *  
 * @return 
 */
LEMPCore.Window.openImageViewer = function() {
	
	var action = "openImageViewer";
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
	var splitSourcePath = LEMPCore.Module.pathParser(arguments[0]._sImagePath);
	
	var oldparam = {
		"source_path" : splitSourcePath.path,
		"source_path_type" : splitSourcePath.type,
		"orientation" : "auto",
		callback : callback
	};
	
	var tr = {
		id:"SHOW_IMAGE_VIEW",
		param:{}
	};
	
	var params = $.extend(true, {
		callback: "LEMPCore.Module.echo"					
	}, oldparam);
	
	tr.param = params;
	
	LEMPCore.Module.gateway(tr, this.servicename , action );	
	
};

/**
 * CodeReader( BarCode, QRCode )  띄우기</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Function _fCallback	 Code 판독 결과값을 받을 callback함수.
 *  
 * @return 
 */
LEMPCore.Window.openCodeReader = function() {
	
	var action = "openCodeReader";
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
	
	var oldparam = {
		callback:callback
	};
	
	var tr = {
		id:"QR_AND_BAR_CODE",
		param:{}
	};
	
	var params = $.extend(true, {
		message:{},
		callback: "LEMPCore.Module.echo"					
	}, oldparam);
	
	tr.param = params;
	
	LEMPCore.Module.gateway(tr, this.servicename , action );	
	
};

/**
 * 
 * 01.클래스 설명 : LEMPCore에서 사용할 공통 기능 클래스.</br> 
 * 02.제품구분 : LEMP Xross</br>
 * 03.기능(콤퍼넌트) 명 : Callback 함수 관리 클래스 </br>
 * 04.관련 API/화면/서비스 : 해당 사항 없음 </br>
 * 05.관련테이블 : 해당 사항 없음 </br>
 * 06.관련 서비스 : 해당 사항 없음 </br> 
 * 07.수정이력  </br>
 * <pre>
 * ********************************************************************************************************************************** </br>
 *  수정일                                          이름                          변경 내용</br>
 * **********************************************************************************************************************************</br>
 *  2016-09-01                                    김승현                         최초 작성</br>
 * **********************************************************************************************************************************</br>
 *</pre>
 *
 * @author 김승현 
 * @version 1.0 
 * 
 */
LEMPCore.Module = new Object();

LEMPCore.Module.servicename = "Module";

// requester 상태 check하기 위한 cmdwatcher
LEMPCore.Module.cmdwatcher = false;

LEMPCore.Module.cmdPosition = 0;
LEMPCore.Module.backCmdPosition = 0;

/**
 * Callback 함수 호출</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Object oParams	확인될 파라미터 정보 객체.
 * @param Array aRequired	필수 파라미터 목록.
 *  
 * @return boolean result 파라미터 체크 결과
 */
LEMPCore.Module.checkparam = function(oParams, aRequired){
	// param에 대해 옵션과 type지정이 올바르게 되었는지 확인	
	var action = "checkparam";
	var result = true;
	var typeList = {
			"b" : Boolean ,
			"a" : Array , 
			"s" : String ,
			"f" : Function ,
			"o" : Object ,
			"n" : Number ,
			"v" : "Variable",
			"e" : "Element"
	};
	
	if(oParams == undefined) { 
		if(aRequired.length == 0){
			LEMPCore.Module.logger(this.servicename, action ,"D", "Paramter is undefined.");
			return true;
		}else{
			LEMPCore.Module.logger(this.servicename, action ,"D", "cannot found parameters.");
			return false;
		}
		 
	}
	if(aRequired == undefined) { aRequired = new Array(); }
	
	LEMPCore.Module.logger(this.servicename, action ,"D", "Paramter is " + JSON.stringify(oParams));
	
	// Basic Check
	// oParams이 정의되어 있지 않거나, JSON Object가 아니면 false
	if(oParams == undefined || oParams.constructor != Object ) {
		LEMPCore.Module.logger(this.servicename, action ,"E", "Invalid parameter format. Paramter have to define JSON.");
		return false;
	}
	
	for(var i =0; i< aRequired.length ; i++){
		//Required param Check
		if(oParams[aRequired[i]] == undefined ) {
			LEMPCore.Module.logger(this.servicename, action ,"E", aRequired[i]+" parameter is required.");
			result = false;
			break;
		}
	}
	
	//Param Type Check
	for(var prop in oParams){
		
		if(oParams[prop] == undefined){
			LEMPCore.Module.logger(this.servicename, action ,"I", prop+" parameter is undefined. it skip check");
		}else if(oParams[prop] == null) {
			LEMPCore.Module.logger(this.servicename, action ,"I", prop+" parameter is null. it skip check.");
		}else{
			
			// key값 앞에 _s, _n...를 받아옴
			var paramtype = prop.substring(1,2);
			
			// 위에 선언한 typeList에 해당하지 않으면 false
			if(typeList[paramtype] == undefined) {
				LEMPCore.Module.logger(this.servicename, action ,"E", prop+" parameter is unknown variable type.");
				result = false;
				break;
				// 1) array일 경우
			} else if(typeList[paramtype] == Array)	{
				for(var idx = 0; idx < aRequired.length; idx++)	{
					if(aRequired[i] == prop && oParams[prop].length === 0)	{
						LEMPCore.Module.logger(this.servicename, action ,"E", prop+" is empty Array.");
						result = false;
						break;
					}
				}
				// 2) array아닐경우
			} else if(oParams[prop].constructor !== typeList[paramtype] && typeList[paramtype] != "Variable" && typeList[paramtype] != "Element" ){	
				LEMPCore.Module.logger(this.servicename, action ,"E", prop+" parameter have wrong value.");
				result = false;
				break;	
			}
				
		}
	}
	
	return result;
};

/**
 * Command Queue에서 저장된 커맨드 순서대로 Native에 요청</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param 
 *   
 * @return 
 */
LEMPCore.Module.requester = function() {
	// 실제로 네이티브에 요청하는 부분	
	var action = "requester";
	
	if(this.cmdQueue.length > this.cmdPosition){
		LEMPCore.Module.logger(this.servicename , action, "D", (this.cmdPosition+1)+"th COMMAND Request.");
		document.location.href=this.cmdQueue[this.cmdPosition];
		this.cmdQueue[this.cmdPosition] = null;
		this.cmdPosition++;
		setTimeout("LEMPCore.Module.requester();", 200);
	}else{
		LEMPCore.Module.logger(this.servicename , action, "D", "COMMAND Stopped!!");
		this.cmdwatcher = false;
	}
	
};

/**
 * 각 서비스 별로 요청된 Command를 받아 MCNC Protocol 규격으로 Commnad Queue에 저장</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Object oMessage	Native에 전달될 파라미터 정보 객체.
 * @param String sServiceName	요청한 커맨드의 서비스명 정보.
 * @param String sAction	요청한 커맨드의 서비스내 기능 정보.
 * @param Object oServiceInfo	Native에 전달하고 Core 로직을 위한 파라미터 정보 객체.  
 *   
 * @return 
 */
LEMPCore.Module.gateway = function(oMessage, sServiceName, sAction, oServiceInfo ){

	var action = "gateway";

	oMessage.service_info = {};

	if(oServiceInfo){
		oMessage.service_info = oServiceInfo;
	}

	oMessage.service_info["sServiceName"] = sServiceName;
	oMessage.service_info["sAction"] = sAction;

	if( ! this.cmdQueue ){this.cmdQueue = new Array();}
	LEMPCore.Module.logger(this.servicename , action, "D", (this.cmdPosition+1)+"th COMMAND Reserved. ---  " +sServiceName+ "."+sAction);
	// oMessage JSON object --> string으로 바꾸어 줌
	// replacer: 숫자를 string으로 변환해 줌(webkit에서 오류나서)
	oMessage = JSON.stringify(oMessage, this.replacer, 3);

	var url = 'ldcc:///';

	// 메시지 전체 encoding
	url += encodeURIComponent(oMessage);
	this.cmdQueue.push(url);

	LEMPCore.Module.logger(this.servicename , action, "D", "Request Service : "+sServiceName);
	LEMPCore.Module.logger(this.servicename , action, "D", "Request Action : "+sAction);
	LEMPCore.Module.logger(this.servicename , action, "D", "Request Param : "+oMessage);

	// requester에 대한 trigger역할
	if( !this.cmdwatcher ){

		this.cmdwatcher = true;
		LEMPCore.Module.logger(this.servicename , action, "D", (this.cmdPosition+1)+"th COMMAND Request!! ");
		document.location.href=this.cmdQueue[this.cmdPosition];
		this.cmdPosition++;
		// 0.2초로 timeout setting
		setTimeout("LEMPCore.Module.requester();", 200);
	}

};




/**
 * 각 서비스 별로 요청된 Command를 받아 MCNC Protocol 규격으로 Commnad Queue에 저장</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Object oMessage	Native에 전달될 파라미터 정보 객체.
 * @param String sServiceName	요청한 커맨드의 서비스명 정보.
 * @param String sAction	요청한 커맨드의 서비스내 기능 정보.
 * @param Object oServiceInfo	Native에 전달하고 Core 로직을 위한 파라미터 정보 객체.  
 *   
 * @return 
 */
/*LEMPCore.Module.backGroundGateway = function(oMessage, sServiceName, sAction, oServiceInfo ){
	
	var action = "gateway";
	
	oMessage.service_info = {};
	
	if(oServiceInfo){
		oMessage.service_info = oServiceInfo;
	}
	
	oMessage.service_info["sServiceName"] = sServiceName;
	oMessage.service_info["sAction"] = sAction;
	
	if( ! this.cmdQueue ){this.cmdQueue = new Array();}
	LEMPCore.Module.logger(this.servicename , action, "D", (this.cmdPosition+1)+"th COMMAND Reserved. ---  " +sServiceName+ "."+sAction);
	// oMessage JSON object --> string으로 바꾸어 줌
	// replacer: 숫자를 string으로 변환해 줌(webkit에서 오류나서)
	oMessage = JSON.stringify(oMessage, this.replacer, 3);
	
	var url = 'ldcc:///';

	// 메시지 전체 encoding
	url += encodeURIComponent(oMessage);
	this.cmdQueue.push(url);
	
	LEMPCore.Module.logger(this.servicename , action, "D", "Request Service : "+sServiceName);
	LEMPCore.Module.logger(this.servicename , action, "D", "Request Action : "+sAction);
	LEMPCore.Module.logger(this.servicename , action, "D", "Request Param : "+oMessage);
	
	// requester에 대한 trigger역할
//	if( !this.cmdwatcher ){
		
		this.cmdwatcher = true;
		LEMPCore.Module.logger(this.servicename , action, "D", (this.cmdPosition+1)+"th COMMAND Request!! ");
		document.location.href=this.cmdQueue[this.cmdPosition];
		this.cmdPosition++;
		// 0.2초로 timeout setting
		setTimeout("LEMPCore.Module.requester();", 200);
//	}
		
};*/

//LEMPCore.Module.backGroundGateway = function(oMessage, sServiceName, sAction, oServiceInfo ){
//	var action = "gateway";
//	oMessage.service_info = {};
//	if(oServiceInfo){
//		oMessage.service_info = oServiceInfo;
//	}
//
//	oMessage.service_info["sServiceName"] = sServiceName;
//	oMessage.service_info["sAction"] = sAction;
//	this.backCmdPosition++;
//
//	LEMPCore.Module.logger(this.servicename , action, "D", (this.backCmdPosition)+"th COMMAND Reserved[background]. --- " +sServiceName+ "."+sAction);
//	// oMessage JSON object --> string으로 바꾸어 줌
//	// replacer: 숫자를 string으로 변환해 줌(webkit에서 오류나서)
//	oMessage = JSON.stringify(oMessage, this.replacer, 3);
//	var url = 'ldcc:///';
//
//	// 메시지 전체 encoding
//	url += encodeURIComponent(oMessage);
//	setTimeout(function(){
//		document.location.href=url;
//	}, 200);
//
////	LEMPCore.Module.logger(this.servicename , action, "D", "url =====> "+url);
//
//	LEMPCore.Module.logger(this.servicename , action, "D", (this.backCmdPosition)+"th COMMAND Request!![background] ");
//	LEMPCore.Module.logger(this.servicename , action, "D", "[background]Request Service : "+sServiceName);
//	LEMPCore.Module.logger(this.servicename , action, "D", "[background]Request Action : "+sAction);
//	LEMPCore.Module.logger(this.servicename , action, "D", "[background]Request Param : "+oMessage);
//};

LEMPCore.Module.backGroundGateway = function(oMessage, sServiceName, sAction, oServiceInfo ){

   var action = "backGroundGateway";

   oMessage.service_info = {};

   if(oServiceInfo){
      oMessage.service_info = oServiceInfo;
   }

   oMessage.service_info["sServiceName"] = sServiceName;
   oMessage.service_info["sAction"] = sAction;

   this.backCmdPosition++;
   LEMPCore.Module.logger(this.servicename , action, "D", (this.backCmdPosition)+"th COMMAND Reserved[background]. ---  " +sServiceName+ "."+sAction);
   // oMessage JSON object --> string으로 바꾸어 줌
   // replacer: 숫자를 string으로 변환해 줌(webkit에서 오류나서)
   oMessage = JSON.stringify(oMessage, this.replacer, 3);

//   window.custom.call(oMessage);
    custom.call(oMessage);

//    LEMPCore.Module.logger("module" , action, "D", (LEMPCore.Module.backCmdPosition)+"th COMMAND Request!![background] url : " + url);


};







/**
 * 메세지 Data중 Command 요청시 오류가 발생하는 Data처리 함수.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String sKey	Data의 키값.
 * @param Variable vValue	변경할 데이터.  
 *   
 * @return vValue 가공된 데이터
 */
LEMPCore.Module.replacer = function(sKey, vValue) {
	// 숫자를 string type으로 바꾸어 줌(number로 하면 오작동 하는 경우 발생)
    if (typeof vValue === 'number' && !isFinite(vValue)) {
        return String(vValue);
    }
    return vValue;
};

/**
 * JSON Object를 String으로 변환.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Variable vValue	변경할 데이터.  
 *   
 * @return value String으로 변환된 값.
 */
LEMPCore.Module.stringjson = function(vValue) {
	// Object -> String
	var value =  vValue!=undefined && vValue!=null ? JSON.stringify(vValue) : "";
    return value;
    
};

/**
 *String을 JSON Object으로 변환.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Variable vValue	변경할 데이터.  
 *   
 * @return String vValue String으로 변환된 값.
 */
LEMPCore.Module.parsejson = function(vValue) {
	// String -> Object
	var retValue;
	
	// 숫자를 다시 Object로 변환 할 때, 0으로 시작하면 8진수로 오작동 할 수 있으므로 
	if ( vValue != undefined && vValue.slice(0, 1) != "0" && vValue != "" ) {
		retValue = JSON.parse(vValue);
	}
	
	return retValue;
    
};

/**
 *File 클래스내에서 FilePath지정시 지정위치 키워드 처리 .</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String sPath	변경할 FilePath 값.  
 *   
 * @return Object splitPathType FilePath 정보를 분할한 Data Object.
 */
LEMPCore.Module.pathParser = function(sPath) {
	// native 인터페이스 parsing을 위해 경로 분리
	var splitPathType = {};
	var regExp = new RegExp("\{(.*?)\}\/(.*)","g");
	var result = regExp.exec(sPath);
	
	if(result){
		// {contents}/LEMP/sign.bmp
		// result[1]: {contents}
		// result[2]: LEMP/sign.bmp
		splitPathType.type = result[1] ? result[1] : "absolute";
		splitPathType.path = result[2];
	}else{
		splitPathType.type = "absolute"; 
		splitPathType.path = sPath; 
	}
	return splitPathType;
};

/**
 *Native 요청시 정의된 Callback함수가 없을경우 Default로 지정될 함수..</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Object oReturnValue	Native로 부터 전달된 데이터 값.  
 *   
 * @return 
 */
LEMPCore.Module.echo = function(oReturnValue){
	// callback이 option일때 callback이 없으면 script에러 나서 echo callback만들어 줌
	var action = "echo";
	LEMPCore.Module.logger("Module", action ,"I", "Echo callback . : ");
	if(oReturnValue.constructor !== Event){
		LEMPCore.Module.logger("Module", action ,"D", "callback parameter . : "+ JSON.stringify(oReturnValue));
	}
	
};

/**
 * Log 출력.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String sServiceName	요청한 커맨드의 서비스명 정보.
 * @param String sAction	요청한 커맨드의 서비스내 기능 정보.  
 * @param String sLogtype 로그 레벨 
 * @param String sMessage 로그 메세지
 *   
 * @return 
 */
LEMPCore.Module.logger = function(sService, sAction, sLogtype, sMessage){
	
	var logmsg = "["+sService+"]"+"["+sAction+"] - "+sMessage;
	logmsg = logmsg.replace(/\{/gi, "{\n").replace(/\}/gi, "}\n").replace(/\\"/gi, "");
	
	switch(sLogtype){

		case "E" :
			if(LEMPCore.loglevel.indexOf("8") > -1){
				
				console.error("LEMP ERROR : "+logmsg);
				console.trace();
				throw("LEMP error. stop process");
			}
			break;
		case "W" :
			if(LEMPCore.loglevel.indexOf("4")  > -1){
				console.log("LEMP WARN :"+logmsg);
			}
			break;
		case "D" :
			if(LEMPCore.loglevel.indexOf("2")  > -1){
				console.debug("LEMP DEBUG:"+logmsg);
			}
			break;
		case "I" :
			if(LEMPCore.loglevel.indexOf("1")  > -1){
				console.log("LEMP INFO :"+logmsg);
			}
			break;

	}

};

/**
 * Core 초기화 작업.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String sServiceName	요청한 커맨드의 서비스명 정보.
 * @param String sAction	요청한 커맨드의 서비스내 기능 정보.  
 * @param String sLogtype 로그 레벨 
 * @param String sMessage 로그 메세지
 *   
 * @return 
 */
LEMPCore.Module.init = function(oRequired, oOptions){
	
	var action = "init";
	
	LEMPCore.APP_CONFIG = $.ajax({ "url" : "../../LEMP/config/app.config", "async" : false, "cache" : false, "dataType" : "JSON" }).responseJSON;
	
	LEMPCore.DeviceManager.init(); 
	LEMPCore.Module.logger(this.servicename, action ,"I", "LEMP DeviceManager initialized. ");
	LEMPCore.EventManager.init();
	LEMPCore.Module.logger(this.servicename, action ,"I", "LEMP EventManager initialized. ");
	
	LEMPCore.Module.logger(this.servicename, action ,"I", "LEMP Module initialized. ");

};

/**
 * 
 * 01.클래스 설명 : Native 파트와 통신시 Async 로 호출받은 Callback 함수 관리 클래스.</br> 
 * 02.제품구분 : LEMP Xross</br>
 * 03.기능(콤퍼넌트) 명 : Callback 함수 관리 클래스 </br>
 * 04.관련 API/화면/서비스 : 해당 사항 없음 </br>
 * 05.관련테이블 : 해당 사항 없음 </br>
 * 06.관련 서비스 : 해당 사항 없음 </br> 
 * 07.수정이력  </br>
 * <pre>
 * ********************************************************************************************************************************** </br>
 *  수정일                                          이름                          변경 내용</br>
 * **********************************************************************************************************************************</br>
 *  2016-09-01                                    김승현                         최초 작성</br>
 * **********************************************************************************************************************************</br>
 *</pre>
 *
 * @author 김승현 
 * @version 1.0 
 * 
 */
LEMPCore.CallbackManager = new Object();

LEMPCore.CallbackManager.servicename = "CallbackManager";

LEMPCore.CallbackManager.index = 0;

LEMPCore.CallbackManager.storage = {};

LEMPCore.CallbackManager.listener = {};

/**
 * Callback 함수 저장</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Function fCallback	저장 할 callback함수.
 * @param String sType	저장할 타입(stg : 1회성, lsn : 반복성 ).
 *  
 * @return String callbackId 
 */
LEMPCore.CallbackManager.save = function(fCallback, sType){
	
	var action = "save";
	var callbackId = "";
	
	if(!fCallback){
		LEMPCore.Module.logger(this.servicename, action ,"I", "Callback function is not defined.");
		// 없으면 가상으로 echo
		fCallback =  LEMPCore.Module.echo;
	}
	
	// listener: 1회성X --> listener에 저장
	// callback: 1회성 --> storage에 저장
	switch(sType){
		case "listener" :
			callbackId = "lsn"+this.index++;
			// listner에 callbackID랑 callback함수 저장
			this.listener[callbackId] = fCallback;
			LEMPCore.Module.logger(this.servicename, action, "I", " Callback listener saved the function at "+callbackId+" area.");
			break;
		default :
			callbackId = "stg"+this.index++;
			// storage에 callbackID랑 callback함수 저장
			this.storage[callbackId] = fCallback;
			LEMPCore.Module.logger(this.servicename, action, "I", " Callback storage saved the function at "+callbackId+" area.");
			break;
	}
	
	// 네이티브에 callbackId 전달하기 위해
	return callbackId;
	
};
/**
 * Callback 함수 호출</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Object oCallback	콜백 함수 정보 객체.
 * @param Object oResdata	콜백 함수로 전달될 데이타.
 *  
 * @return 
 */
LEMPCore.CallbackManager.responser = function(oCallback, oResdata, oServiceInfo){
	
	// 네이티브가 callback줄 때	
	LEMPCore.Module.logger(this.servicename, "responser", "I",  "CallbackManager recieve response from native : " );
	
	// 네이티브에서 오류나면 "exception"으로 replace
	if(oCallback.callback == "exception"){
		LEMPCore.Module.logger(this.servicename, "responser", "E",  "Recieve Message is " + JSON.stringify(oResdata) );
		return;
	}
	
	if(oCallback.callback.indexOf("stg") == 0){
		
		LEMPCore.Module.logger(this.servicename, "responser", "D", oCallback.callback + " call from the storage : " );
		this.storage[oCallback.callback](oResdata.message, oServiceInfo); // 네이티브에서 온 message와 함께 전달
		delete this.storage[oCallback.callback]; // 1회성
		LEMPCore.Module.logger(this.servicename, "responser", "I", oCallback.callback+" function called and removed.");
		
	}else if(oCallback.callback.indexOf("lsn") == 0){
		
		LEMPCore.Module.logger(this.servicename, "responser", "D", oCallback.callback + " call from the listener : " );
		this.listener[oCallback.callback](oResdata.message, oServiceInfo);
		
	}else{
		
		// Device와 같이, script만 가지고 실행하는 경우
		LEMPCore.Module.logger(this.servicename, "responser", "D", oCallback.callback + " call from the page : " );
		
		var tempcall
		
		try{
			tempcall = eval(oCallback.callback);
			tempcall.call(undefined, oResdata.message, oServiceInfo);
		}catch(e){
			if(tempcall == undefined ){
				LEMPCore.Module.logger(this.servicename, "responser", "E", "Callback does not exist. : " + JSON.stringify(oCallback.callback));
				
			}else if(tempcall.constructor !== Function){
				LEMPCore.Module.logger(this.servicename, "responser", "E", "Callback is not a function. : " + JSON.stringify(oCallback.callback));
			}
		}
		
	}
	
	
	
};

/**
 * 
 * 01.클래스 설명 : LEMP SideView 클래스.</br> 
 * 02.제품구분 : LEMP Xross</br>
 * 03.기능(콤퍼넌트) 명 : SideView 관련 기능 </br>
 * 04.관련 API/화면/서비스 : 해당 사항 없음 </br>
 * 05.관련테이블 : 해당 사항 없음 </br>
 * 06.관련 서비스 : 해당 사항 없음 </br> 
 * 07.수정이력  </br>
 * <pre>
 * ********************************************************************************************************************************** </br>
 *  수정일                                          이름                          변경 내용</br>
 * **********************************************************************************************************************************</br>
 *  2016-09-01                                    김승현                         최초 작성</br>
 * **********************************************************************************************************************************</br>
 *</pre>
 *
 * @author 김승현 
 * @version 1.0 
 * 
 */
LEMPCore.SideView = new Object();

LEMPCore.SideView.servicename = "SideView";
LEMPCore.SideView.CURRENT_POSITION = "CURRENT_POSITION";

/**
 * 현재 위치값 저장.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String position SideView 현재 위치값.
 *   
 * @return 
 */
LEMPCore.SideView.setCurrentPosition = function(position)	{
	// position: left or right
	localStorage.setItem(LEMPCore.SideView.CURRENT_POSITION, position);
};

/**
 * 현재 위치값 조회.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param 
 *   
 * @return String position SideView 현재 위치값.
 */
LEMPCore.SideView.getCurrentPosition = function()	{
	return localStorage.getItem(LEMPCore.SideView.CURRENT_POSITION);
};

/**
 * SideView 신규 생성.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param 
 *   
 * @return 
 */
LEMPCore.SideView.create = function()	{
	var action = "create";
	var position = arguments[0]._sPosition;
	var widthPercent = arguments[0]._sWidth
	var pagePath = arguments[0]._sPagePath;
	var message = arguments[0]._oMessage;
	
	message = message == undefined ? {} : message;
		
	LEMPCore.Module.logger(this.servicename, action, "D", "Request Parameter : " + arguments[0]);
	
	var tr = {
		id : "CREATE_MENU_VIEW",
		param : {
			target_view : position,
			width_percent : widthPercent,
			target_page : pagePath,
			message : message
		}
	};
	
	LEMPCore.Module.gateway(tr, this.servicename, action);
};


/**
 * 사이브 뷰 열기.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sPosition		열어볼 사이드 뷰의 위치 지정값. left 또는 right
 * @param Object _oMessage	사이드 뷰에 전달 될 메세지  
 * @return 
 */
LEMPCore.SideView.show = function()	{
	var action = "show";
	var position = arguments[0]._sPosition.toLowerCase();
	var message = arguments[0]._oMessage;
	
	message = message == undefined ? {} : message;
	
	LEMPCore.Module.logger(this.servicename, action, "D", "Request Parameter : " + arguments[0]);
	
	var tr = {
		id : "SHOW_MENU_VIEW",
		param:{
			target_view : position,
			message : message
		}
	};
	
	LEMPCore.SideView.setCurrentPosition(position);
	
	LEMPCore.Module.gateway(tr, this.servicename, action);
};

/**
 * 사이브 뷰 닫기.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Object _oMessage	사이드 뷰에 전달 될 메세지
 *   
 * @return 
 */
LEMPCore.SideView.hide = function()	{
	var action = "hide";
	var message = arguments[0]._oMessage;
	var position = LEMPCore.SideView.getCurrentPosition();
	
	if(!((message) instanceof Object))	message = {};
	
	LEMPCore.Module.logger(this.servicename, action, "D", "Request Parameter : " + arguments[0]);
	
	var tr = {
		id : "CLOSE_MENU_VIEW",
		param:{
			target_view : position,
			message : message
		}
	};
	
	LEMPCore.Module.gateway(tr, this.servicename, action);
};

/**
 * 사이브 뷰 함수 호출.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sPosition		전달할 사이드 뷰의 위치 지정값. left 또는 right
 * @param String _sCallback	사이드 뷰에 호출될 함수 명
 * @param Object _oMessage	사이드 뷰에 전달 될 메세지
 *   
 * @return 
 */
LEMPCore.SideView.postMessage = function()	{
	// 안보이는 상태에서 sideview update할 용도	
	var action = "postMessage";
	var position = arguments[0]._sPosition;
	var callback = arguments[0]._sCallback;
	var message = arguments[0]._oMessage;
	
	LEMPCore.Module.logger(this.servicename, action, "D", "Request Parameter : " + arguments[0]);
	
	var tr = {
		id : "SEND_DATA_MENU_VIEW",
		param : {
			target_view : position,
			message : message,
			callback : callback
		}
	};
	
	LEMPCore.Module.gateway(tr, this.servicename, action);
};

/**
 * 
 * 01.클래스 설명 : Properties 저장 클래스 .</br> 
 * 02.제품구분 : LEMP Xross</br>
 * 03.기능(콤퍼넌트) 명 : 영구 데이터 저장소 </br>
 * 04.관련 API/화면/서비스 : </br>
 * 05.관련테이블 : 해당 사항 없음 </br>
 * 06.관련 서비스 : 해당 사항 없음 </br> 
 * 07.수정이력  </br>
 * <pre>
 * ********************************************************************************************************************************** </br>
 *  수정일                                          이름                          변경 내용</br>
 * **********************************************************************************************************************************</br>
 *  2016-09-01                                    김승현                         최초 작성</br>
 * **********************************************************************************************************************************</br>
 *</pre>
 *
 * @author 김승현 
 * @version 1.0 
 * 
 */
LEMPCore.Properties = new Object();

LEMPCore.Properties.servicename = "Properties";

/**
 * Properties 데이터 저장.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Variable _aList또는_sKey 저장할 데이터
 * @param Variable _vValue 저장할 값(_sKey와 쌍으로 들어옴.)
 * 
 * @return 
 */
LEMPCore.Properties.set = function() {
	
	var action = "set";
	var tr = {
			id:"SET_FSTORAGE",
			param:{data:[]}
	};
	
	// native한테 주기 전에 데이터 정리하는 용도의 array
	var properties = new Array();
	
	if(arguments[0]._aList)
	{
			var savelist = arguments[0]._aList;
			for(var i=0;i < savelist.length ; i++){
				properties.push({key:savelist[i]._sKey, value:LEMPCore.Module.stringjson(savelist[i]._vValue)});
				// set하고 바로 get하고 싶을 때(개발자 입장에서 로직에따라)
				LEMP.FStorage[savelist[i]._sKey] = LEMPCore.Module.stringjson(savelist[i]._vValue);
			}
	}else{			
			properties.push({key:arguments[0]._sKey, value:LEMPCore.Module.stringjson(arguments[0]._vValue)});
			LEMP.FStorage[arguments[0]._sKey] = LEMPCore.Module.stringjson(arguments[0]._vValue);
	}
	
	tr.param.data = properties;
	LEMPCore.Module.logger(this.servicename, action ,"D", arguments[0]._sKey+ " set on LEMP Properties. ");
	
	LEMPCore.Module.gateway(tr, this.servicename , action );
	
};

/**
 * Properties 데이터 불러오기.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sKey 저장 값의 키
 * 
 * @return 
 */
LEMPCore.Properties.get = function() {
	var action = "get";
	var key = arguments[0]._sKey;
	
	// native에 요청 없이 FStorage에서 get
	return LEMPCore.Module.parsejson( LEMP.FStorage[key]);
	
};

/**
 * Properties 데이터 삭제.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sKey 저장 값의 키
 * 
 * @return 
 */
LEMPCore.Properties.remove = function() {
	var action = "remove";
	var key = arguments[0]._sKey;
	
	// Native에서 지우기
	var tr = {
		id:"REMOVE_FSTORAGE",
		param:{data:[key]}
	};
	// FStorage에서 지우기
	delete LEMP.FStorage[key];
	

	LEMPCore.Module.logger(this.servicename, action ,"D", arguments[0]._sKey+ " removed on LEMP Properties. ");
	
	LEMPCore.Module.gateway(tr, this.servicename , action );
	
};

/**
 * 
 * 01.클래스 설명 : System 기능 클래스 .</br> 
 * 02.제품구분 : LEMP Xross</br>
 * 03.기능(콤퍼넌트) 명 : OS 기반 기본 기능 </br>
 * 04.관련 API/화면/서비스 : LEMPCore.Module.checkparam,LEMPCore.System.callBrowser, LEMPCore.System.callCamera, LEMPCore.System.callGallery, LEMPCore.System.callMap, LEMPCore.System.callSMS, LEMPCore.System.callTEL, LEMPCore.System.getGPS</br>
 * 05.관련테이블 : 해당 사항 없음 </br>
 * 06.관련 서비스 : 해당 사항 없음 </br> 
 * 07.수정이력  </br>
 * <pre>
 * ********************************************************************************************************************************** </br>
 *  수정일                                          이름                          변경 내용</br>
 * **********************************************************************************************************************************</br>
 *  2016-09-01                                    김승현                         최초 작성</br>
 * **********************************************************************************************************************************</br>
 *</pre>
 *
 * @author 김승현 
 * @version 1.0 
 * 
 */
LEMPCore.System = new Object();

LEMPCore.System.servicename = "System";

/**
 * 전화걸기.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sNumber	전화번호
 * @param Function _fCallback	실행후 결과를 처리할 callback 함수
 *  
 * @return 
 */
LEMPCore.System.callTEL = function() {
	
	var action = "callTEL";
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
	
	var tr = {
		id:"TEL",
		param:{
			number:arguments[0]._sNumber,
			callback : callback
		}
	};
	
	LEMPCore.Module.gateway(tr, this.servicename , action );
};

/**
 * 문자보내기.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Array _aNumber	메세지를 보낼 전화번호 배열
 * @param String _sMessage	보낼 메세지
 * @param Function _fCallback	실행후 결과를 처리할 callback 함수
 *  
 * @return 
 */
LEMPCore.System.callSMS = function() {
	
	var action = "callSMS";
	//var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
	
	var cell_list = arguments[0]._aNumber;
	
	for(var i=0; i< cell_list.length ; i++)
	{
		var validvalue = cell_list[i].match(/(^[+0-9])|[0-9]/gi);
		if(validvalue != null){
			cell_list[i] = validvalue.join("");
		}else{
			LEMPCore.Module.logger(this.servicename, action ,"E", cell_list[i]+ " is wrong number format.");
		}	
	}
	
	arguments[0]._aNumber = cell_list;
	
	var tr = {
		id:"SMS",
		// ;로 구분해서 string으로 보냄
		param:{number:arguments[0]._aNumber.join(";"), message:arguments[0]._sMessage}
	};
	
	LEMPCore.Module.gateway(tr, this.servicename , action );
};

/**
 * 단말기 설치된 브라우져 열기.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sURL	메세지를 보낼 전화번호 배열
 *  
 * @return 
 */
LEMPCore.System.callBrowser = function(){
	
	var action = "callBrowser";
	
	var tr = {
		
		id:"SHOW_WEBSITE",
		param:{ "url":arguments[0]._sURL }
	};
	
	LEMPCore.Module.gateway(tr, this.servicename , action );
		
};

/**
 * 단말기 디바이스의 갤러리(사진앨범) 보기.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sType	String	(Default : all) 갤러리에서 불러올 미디어 타입( all, image, video )가 있습니다.
 * @param Function _fCallback	갤러리에서 선택한 미디어를 결과를 전달 받아서 처리할 callback 함수.

 *  
 * @return 
 */
LEMPCore.System.callGallery = function(){
	
	var action = "callGallery";
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
	
	var tr = {
			id:"GET_MEDIA_PICK",
			param:{
				type_list : arguments[0]._sType,
				callback:callback
			}
	};
	
	LEMPCore.Module.gateway(tr, this.servicename , action );
		
};

/**
 * 단말기 지도 실행</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sLocation	위치 정보(주소, 위경도값)
 *  
 * @return  
 */
LEMPCore.System.callMap = function() {
	
	var action = "callMap";
	
	var tr = {
		id:"SHOW_MAP",
		param:{
			location:arguments[0]._sLocation
		}
	};
		
	LEMPCore.Module.gateway(tr, this.servicename , action );
};

/**
 * OS별 지도 실행</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sLocation	위치 정보(주소, 위경도값)
 *  
 * @return  
 */
LEMPCore.System.getGPS = function()
{
	var action = "getGPS";
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
		
    var tr = {
            id:"GET_LOCATION",
            param:{
            	callback:callback
            }
    };
    
    LEMPCore.Module.gateway(tr, this.servicename , action );
   
};

/**
 * 단말기 카메라 촬영.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Function _fCallback		갤러리에서 선택한 미디어를 전달 받아서 처리하는 callback 함수
 * @param String _sFileName		찍은 이미지를 저장할 이름
 * @param String _sDirectory	찍은 이미지를 저장할 경로
 * @param Boolean _bAutoVerticalHorizontal	(Default : true) 찍은 이미지를 화면에 맞게 자동으로 회전시켜 저장할지를 설정 값
 *  
 * @return  
 */
LEMPCore.System.callCamera = function()
{
	var action = "callCamera";
	
	
	var splitTargetDir = LEMPCore.Module.pathParser(arguments[0]._sDirectory);
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
	// bAutoVerticalHorizontal: 사진을 자동으로 가로 세로 맞춰주는 옵션
	var autoVerticalHorizontal = arguments[0]._bAutoVerticalHorizontal === false ? false : true;
	
	var tr = {
			id:"CAMERA_CAPTURE",
			param:{
				target_directory: splitTargetDir.path,
				target_directory_type: splitTargetDir.type,
				picture_name:arguments[0]._sFileName,
				rotate : autoVerticalHorizontal,
				callback : callback
			}
	};
	
	LEMPCore.Module.gateway(tr, this.servicename , action );
	
};

/**
 * 
 * 01.클래스 설명 : App 컨트롤 관련 클래스 .</br> 
 * 02.제품구분 : LEMP Xross</br>
 * 03.기능(콤퍼넌트) 명 : App 컨트롤 관련 기능 </br>
 * 04.관련 API/화면/서비스 : </br>
 * 05.관련테이블 : 해당 사항 없음 </br>
 * 06.관련 서비스 : 해당 사항 없음 </br> 
 * 07.수정이력  </br>
 * <pre>
 * ********************************************************************************************************************************** </br>
 *  수정일                                          이름                          변경 내용</br>
 * **********************************************************************************************************************************</br>
 *  2016-09-01                                    김승현                         최초 작성</br>
 * **********************************************************************************************************************************</br>
 *</pre>
 *
 * @author 김승현 
 * @version 1.0 
 * 
 */
LEMPCore.App = new Object();

LEMPCore.App.servicename = "App";


/**
 * App 프로그래스바 열기</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Function _fCallback	실행 후 호출될 callback 함수
 *   
 * @return 
 */
LEMPCore.App.openProgress = function(){
	
	var action = "openProgress";
	if(arguments[0] == undefined) { arguments[0] = {}; }
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
	
	var tr = {
		"id": "PROGRESS_CONTROLLER",
		"param": {
			"type" : "show" ,
			"callback" : callback
		}
	};
	
	LEMPCore.Module.gateway(tr, this.servicename , action );

};

/**
 * App 프로그래스바 닫기</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 *@param Function _fCallback	실행 후 호출될 callback 함수
 *   
 * @return 
 */
LEMPCore.App.closeProgress = function(){
	
	var action = "closeProgress";
	if(arguments[0] == undefined) { arguments[0] = {}; }
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
	
	var tr = {
		"id": "PROGRESS_CONTROLLER",
		"param": {
			"type" : "close" ,
			"callback" : callback
		}
	};
	
	LEMPCore.Module.gateway(tr, this.servicename , action );

};
/**
 * App 종료</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sType	(Default : kill)어플리케이션 종료 유형( logout 또는 kill )
 *   
 * @return 
 */
LEMPCore.App.exit = function(){
	
	var action = "kill";
	
	var tr = {
		"id": "APPLICATION_EXIT",
		"param": {"kill_type" : arguments[0]._sType }
	};
	
	LEMPCore.Module.gateway(tr, this.servicename , action );

};

/**
 * App 자동 종료 시간 설정/조회</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Number _nSeconds	( default : 7200 )어플리케이션의 세션 만료 시간(초단위) 설정 값.
 *   
 * @return 
 */
LEMPCore.App.requestTimeout = function(){
	
	var action = "requstTimeout";	
	
	var callback = arguments[0]._fCallback ? LEMPCore.CallbackManager.save(arguments[0]._fCallback) : "" ;
	
	var tr = {
	    "id": "SET_SESSION_TIMEOUT",
	    "param": {
	        "callback":callback,  
	        "session_timeout": arguments[0]._nSeconds       
	    }
	};
	
	LEMPCore.Module.gateway(tr, this.servicename , action );
	
};

/**
 * 
 * 01.클래스 설명 : Web Storage 클래스 .</br> 
 * 02.제품구분 : LEMP Xross</br>
 * 03.기능(콤퍼넌트) 명 : 휘발성 데이터 저장소 </br>
 * 04.관련 API/화면/서비스 : </br>
 * 05.관련테이블 : 해당 사항 없음 </br>
 * 06.관련 서비스 : 해당 사항 없음 </br> 
 * 07.수정이력  </br>
 * <pre>
 * ********************************************************************************************************************************** </br>
 *  수정일                                          이름                          변경 내용</br>
 * **********************************************************************************************************************************</br>
 *  2016-09-01                                    김승현                         최초 작성</br>
 * **********************************************************************************************************************************</br>
 *</pre>
 *
 * @author 김승현 
 * @version 1.0 
 * 
 */
LEMPCore.Storage = new Object();

LEMPCore.Storage.servicename = "Storage";

/**
 * Storage 데이터 저장.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Variable _aList또는_sKey 저장할 데이터
 * @param Variable _vValue 저장할 값(_sKey와 쌍으로 지정됨)
 * 
 * @return 
 */
LEMPCore.Storage.set = function() {
	
	var action = "set";
	
	// 1. Array로 올 때
	if(arguments[0]._aList)
	{		var savelist = arguments[0]._aList;
			for(var i=0;i < savelist.length ; i++){
				// HTML5에 있는 localStorage에 저장
				// storage는 브라우저 web storage
				localStorage.setItem ( savelist[i]._sKey ,  LEMPCore.Module.stringjson(savelist[i]._vValue) );
			}
	// 2. Key value로 들어 올 때
	}else{	
			localStorage.setItem ( arguments[0]._sKey ,  LEMPCore.Module.stringjson(arguments[0]._vValue) );
	}
	
	LEMPCore.Module.logger(this.servicename, action ,"D", arguments[0]._sKey+ " set on LEMP Storage. ");
	
	
};

/**
 * Storage 데이터 불러오기.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sKey 저장 값의 키
 * 
 * @return 
 */
LEMPCore.Storage.get = function() {
	
	var action = "get";
	var key = arguments[0]._sKey;
	
	var value = localStorage.getItem ( key );
	
	return LEMPCore.Module.parsejson(value);
};

/**
 * Storage 데이터 삭제.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sKey 저장 값의 키
 * 
 * @return 
 */
LEMPCore.Storage.remove = function() {
	
	var action = "remove";
	
	localStorage.removeItem(arguments[0]._sKey);
	
	LEMPCore.Module.logger(this.servicename, action ,"D", arguments[0]._sKey+ " removed on LEMP Storage. ");
	
};

/**
 * 
 * 01.클래스 설명 : Network 통신 클래스 .</br> 
 * 02.제품구분 : LEMP Xross</br>
 * 03.기능(콤퍼넌트) 명 : LEMP Server와 통신  </br>
 * 04.관련 API/화면/서비스 : </br>
 * 05.관련테이블 : 해당 사항 없음 </br>
 * 06.관련 서비스 : 해당 사항 없음 </br> 
 * 07.수정이력  </br>
 * <pre>
 * ********************************************************************************************************************************** </br>
 *  수정일                                          이름                          변경 내용</br>
 * **********************************************************************************************************************************</br>
 *  2016-09-01                                    김승현                         최초 작성</br>
 * **********************************************************************************************************************************</br>
 *</pre>
 *
 * @author 김승현 
 * @version 1.0 
 * 
 */
LEMPCore.Network = new Object();

LEMPCore.Network.servicename = "Network";

LEMPCore.Network.index = 0;

LEMPCore.Network.callbackStorage = {};

LEMPCore.Network.TrStorage = {};

/**
 * LEMP Server 전문목록 요청 결과 처리 제어.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 *
 * @param Object result	서버와 통신 후 결과
 * @param Object service_info	LEMP Server 전문 요청 인증 전문 리스트
 *  
 * @return 
 */
LEMPCore.Network.listResponser = function( result, service_info ){
	
	console.log("++++++++++++++++++++++++++Responser service_info.listKey++++++++++++++"+service_info.listKey);
	console.log("++++++++++++++++++++++++++Responser service_info++++++++++++++"+JSON.stringify(service_info));
	try{
		LEMPCore.Network.TrStorage[service_info.listKey].trResult.push(result);
		LEMPCore.Network.listRequester(service_info.listKey );
		
	}catch(e){
		
		LEMPCore.App.closeProgress();
		LEMPCore.Module.logger(service_info.sServiceName , service_info.sAction, "D", service_info.listKey+" Request Failed.");
		LEMPCore.Module.logger(service_info.sServiceName , service_info.sAction, "E", JSON.stringify(e) );
		
	}
	
}

/**
 * LEMP Server 전문목록 요청.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String listKey	LEMP Server 목록 요청키
 *  
 * @return 
 */
LEMPCore.Network.listRequester = function(listKey){
	
	var action = "listRequester";
	var TrStorage = LEMPCore.Network.TrStorage;
	
	if( TrStorage[listKey] && TrStorage[listKey].trList.length > 0 ){
		
		var tr = this.makeTr(TrStorage[listKey].trList[0]);
		var callbackid =  LEMPCore.CallbackManager.save(LEMPCore.Network.listResponser);
		
		tr.param.callback = callbackid;
		
		TrStorage[listKey].trList = TrStorage[listKey].trList.LPRemoveAt(0);
		
		
		var service_info = {
			"listKey" : listKey	
		}
		
		LEMPCore.Module.gateway(tr, this.servicename , action, service_info );
		
	}else{
		
		LEMPCore.App.closeProgress()
		
		LEMPCore.CallbackManager.responser(   
	        	{ "callback" : TrStorage[listKey].callback }, 
	        	{ "message" : TrStorage[listKey].trResult }   
	     );
		
	}
	
	
}

/**
 * LEMP Server 전문 통신.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Array _aTrList	LEMP Server 인증 전문 리스트
 * @param Function _fCallback	서버와 통신 후 실행될 callback 함수
 *  
 * @return 
 */
LEMPCore.Network.requestTrList = function() {
	
	var action = "requestTrList";
	
	try{
		
		LEMPCore.App.openProgress();
		
		var listKey = action+this.index;
		this.index++;
		
		this.TrStorage[listKey] = {};
		this.TrStorage[listKey].trResult = new Array();
		this.TrStorage[listKey].trList = arguments[0]._aTrList;
		this.TrStorage[listKey].callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
		
		LEMPCore.Module.logger(this.servicename , action, "D", arguments[0]._aTrList.length+" Request Reserved.");
		
		this.listRequester(listKey, action);	
	
	}catch(e){
		
		LEMPCore.App.closeProgress();
		LEMPCore.Module.logger(this.servicename , action, "D", arguments[0]._aTrList.length+" Request Failed.");
	}
};
/**
 * LEMP Server 전문 생성.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sTrcode	LEMP Server 전문코드
 * @param String _oHeader	LEMP Server 전문 Header 객체
 * @param String _oBody		LEMP Server 전문 Body 객체
 * @param Boolean _bProgressEnable		(default:true) 서버에 통신 요청시 progress 표시 여부( true 또는 false )
 * @param Function _fCallback	서버와 통신 후 실행될 callback 함수
 *  
 * @return 
 */
LEMPCore.Network.makeTr = function(){
	
	var TR_HEADER = {
			"result" : true,
			"error_code" : "",
			"error_text" : "",         
			"info_text" : "",         
			"message_version" : "",         
			"login_session_id" : "",         
			"trcode" : arguments[0]._sTrcode
		};
		
		var TR_BODY = {};
		
		var header = $.extend(true,TR_HEADER , arguments[0]._oHeader);
		var body = $.extend(true,TR_BODY , arguments[0]._oBody);
		
		var tr = {
			
			id:"RELOAD_WEB",
			param:{}
		};
		
		var params ={
			trcode : arguments[0]._sTrcode,
			message:{ header: header , body : body },
			read_timeout : 60*1000,
			progress : false
		};
		
		tr.param = params;
		
		return tr;
};

/**
 * LEMP Server 전문 통신.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sTrcode	LEMP Server 전문코드
 * @param String _oHeader	LEMP Server 전문 Header 객체
 * @param String _oBody		LEMP Server 전문 Body 객체
 * @param Boolean _bProgressEnable		(default:true) 서버에 통신 요청시 progress 표시 여부( true 또는 false )
 * @param Function _fCallback	서버와 통신 후 실행될 callback 함수
 *  
 * @return 
 */
LEMPCore.Network.requestTr = function() {
	
	var action = "requestTr";
	
	var TR_HEADER = {
		"result" : true,
		"error_code" : "",
		"error_text" : "",         
		"info_text" : "",         
		"message_version" : "",         
		"login_session_id" : "",         
		"trcode" : arguments[0]._sTrcode
	};
	
	var TR_BODY = {};
	
	var header = $.extend(true,TR_HEADER , arguments[0]._oHeader);
	var body = $.extend(true,TR_BODY , arguments[0]._oBody);
	
	var callbackid =  LEMPCore.CallbackManager.save(arguments[0]._fCallback);
	// progress 진행 표시
	var progressEnable = arguments[0]._bProgressEnable === false ? false : true;
	
	var tr = {
		
		id:"RELOAD_WEB",
		param:{}
	};
	
	var params ={
		trcode : arguments[0]._sTrcode,
		message:{ header: header , body : body },
		callback: callbackid,
		read_timeout : 60*1000,
		progress : progressEnable
	};
	
	tr.param = params;
	
	LEMPCore.Module.gateway(tr, this.servicename , action );
	
};

/**
 * LEMP Server 로그인(인증)전문 통신.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sUserId	인증 받을 사용자 아이디
 * @param String _sPassword	인증 받을 사용자 패스워드
 * @param String _sTrcode	레거시 로그인 인증 전문코드
 * @param String _oHeader	레거시 로그인 인증 전문 Header 객체
 * @param String _oBody		레거시 로그인 인증 전문 Body 객체
 * @param Function _fCallback	서버와 통신 후 실행될 callback 함수
 *  
 * @return 
 */
LEMPCore.Network.requestLogin = function() {
	
	var TR_HEADER = {
		"result" : true,
		"error_code" : "",
		"error_text" : "",         
		"info_text" : "",         
		"message_version" : "",         
		"login_session_id" : "",         
		"trcode" : arguments[0]._sTrcode
	};
	
	var action = "requestLogin";
	
	var header = $.extend(true,TR_HEADER , arguments[0]._oHeader);
	
	var TR_BODY = {};
	
	var body = $.extend(true,TR_BODY , arguments[0]._oBody);
	
	var callbackid =  LEMPCore.CallbackManager.save(arguments[0]._fCallback);
	
	var tr = {
		
		id:"AUTH",
		param:{}
	};
	
	var params ={
			// portal에 로그인
			auth_info:{user_id:arguments[0]._sUserId,password:arguments[0]._sPassword},
			// 확장
			legacy_trcode:arguments[0]._sTrcode,
			legacy_message:{ header: header , body : body },
			message:{},
			callback:callbackid,
			// connection_timeout
			read_timeout : 10*1000,
			progress : true
	
	};
	
	tr.param = params;
	
	LEMPCore.Module.gateway(tr, this.servicename , action );
	
};

/**
 * 
 * 01.클래스 설명 : Event 관리 기능 클래스 .</br> 
 * 02.제품구분 : LEMP Xross</br>
 * 03.기능(콤퍼넌트) 명 : LEMP Event  관리 기능 클래스 </br>
 * 04.관련 API/화면/서비스 : </br>
 * 05.관련테이블 : 해당 사항 없음 </br>
 * 06.관련 서비스 : 해당 사항 없음 </br> 
 * 07.수정이력  </br>
 * <pre>
 * ********************************************************************************************************************************** </br>
 *  수정일                                          이름                          변경 내용</br>
 * **********************************************************************************************************************************</br>
 *  2016-09-01                                    김승현                         최초 작성</br>
 * **********************************************************************************************************************************</br>
 *</pre>
 *
 * @author 김승현 
 * @version 1.0 
 * 
 */
LEMPCore.EventManager = new Object();

LEMPCore.EventManager.servicename = "EventManager";

LEMPCore.EventManager.storage = {
		// 페이지 관련
		"ready" : ["page.init"],
		"resume" : [],
		"backbutton" : [],
		"beforeready" : [],
		// 사이드 뷰 관련
		"open" : [],
		"close" : [],
		// 푸시메시지 관련
		"push" : [],
		"networkstatechange" : []
};

LEMPCore.EventManager.list = new Array("ready","resume","backbutton","open","close","networkstatechange");

/**
 * LEMP Window Load시 LEMP Event 기능 초기화 .</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param 
 *  
 * @return 
 */
LEMPCore.EventManager.init = function() {
	
	var action = "init";
	var backYn = false; // close event default
	
	for (var evtname in this.storage) {
		
		var evtlist = LEMPCore.EventManager.storage[evtname];
		
		for(var i=0; i < evtlist.length;i++){
			
			LEMPCore.Module.logger(this.servicename, action ,"D", evtname+" event add start. Listener is "+evtlist[i]);
			// String -> Object화 (return value: function)
			var evtlistener = eval(evtlist[i]);
			
			if(evtlistener ){
				
				if(evtlistener.constructor === Function){
					
					if(evtname == "backbutton" && LEMP.Device.isAndroid()) { backYn = true; }
					
					document.addEventListener("LEMP.on"+evtname, evtlistener, false);
					LEMPCore.Module.logger(this.servicename, action ,"D", evtlist[i]+" has been added in the "+evtname+" event. ");
					
				}else{
					LEMPCore.Module.logger(this.servicename, action ,"W", evtlist[i]+" cannot added in the "+evtname+" event. it is not a function.");
				}
				
			}else{
				LEMPCore.Module.logger(this.servicename, action ,"W",  evtlist[i]+" is undefined. ");
			}
						
		}
		
	}
	
	// native에 backbutton에 대한 event 추가 요청
	if(backYn){
		LEMPCore.EventManager.requester({ "eventname" : "backbutton" });
	}
	
	LEMPCore.Module.logger(this.servicename, action ,"I", "EventManager initialized.");
	
};

/**
 * Native에서 관장하는 Event  등록 요청 기능 .</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Object oRequired 요청 이벤트 Data객체
 * @param Object oOptions 요청 이벤트 등록 요청시 전달할 Data객체
 *  
 * @return 
 */
LEMPCore.EventManager.requester = function(oRequired, oOptions) {

	var action = "requester";
	
	switch(oRequired.eventname)
	{
		case "backbutton" :
			
			var tr = {
			        
			        id:"HARDWARE_BACKBUTTON",
			        param:{}
			};

			
			var params ={
		               useBackEvent : true,
	        };
			
			tr.param = params;
			
			// native gateway에 요청
			LEMPCore.Module.gateway(tr, this.servicename , action );
			LEMPCore.Module.logger(this.servicename, action ,"I", "EventManager request add event.");
			
			break;

	}
};

/**
 * Native에서 Event 발생시 Web으로 전달되는 기능.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Object oRequired 발생한 이벤트 Data객체
 * @param Object oOptions 이벤트에 전달될 메세지 Data객체
 *  
 * @return 
 */
LEMPCore.EventManager.responser = function(oRequired, oOptions) {
	// 네이티브에게 응답을 받기위한 용도
	// 네이티브에서 로직처리 다하고 responser를 호출
	
	var action = "responser";
	
	LEMPCore.Module.logger(this.servicename, action ,"I", "EventManager recieved event.");
	LEMPCore.Module.logger(this.servicename, action ,"D", "Event Name : " + oRequired.eventname);
	LEMPCore.Module.logger(this.servicename, action ,"D", "Event Data : " + JSON.stringify(oOptions));
	
	switch(oRequired.eventname)
	{
		// 네이티브에서 준비되면 onReady
		case "onReady" :
			if(!LEMPCore.readystatus){
				// 웹 레디 준비(Module.init에서 device property랑 이벤트 등록해줌)
				LEMPCore.Module.init(oRequired, oOptions);
				LEMPCore.readystatus = true;
				// beforeready 호출(beforeready: 페이지가 로딩 전에 수행되어야하는 로직들)
				LEMPCore.EventManager.raiseevent({eventname : "onbeforeready"}, oOptions);
				// onReady불러줌 onReady에 page.init
				LEMPCore.EventManager.raiseevent(oRequired, oOptions);
			}
			break;
		// 일반적인 이벤트
		default :
			LEMPCore.EventManager.raiseevent(oRequired, oOptions);
			break;
	}

};

/**
 * 등록된 이벤트를 발생 시키는 기능.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Object oRequired 발생한 이벤트 Data객체
 * @param Object oOptions 이벤트에 전달될 메세지 Data객체
 *  
 * @return 
 */
LEMPCore.EventManager.raiseevent = function(oRequired, oOptions) {
	// 이벤트 발생	
	var action = "raiseevent";
	
	LEMPCore.Module.logger(this.servicename, action ,"I", "EventManager raise event.");
	LEMPCore.Module.logger(this.servicename, action ,"D", "Event Name : "+oRequired.eventname.toLowerCase());
	LEMPCore.Module.logger(this.servicename, action ,"D", "Event Message : "+JSON.stringify(oOptions.message));

	// 자바스크립트 custom이벤트 발생
	var evt = document.createEvent("Event");
	evt.initEvent("LEMP."+oRequired.eventname.toLowerCase(), false, true );
	// 이전페이지에서 온 message를 data에 넣어줌
	evt.data = oOptions.message;

		
	try{
		document.dispatchEvent(evt); 
	}catch(e){ 
		LEMPCore.Module.logger(this.servicename, action ,"E", e);
	}
	
	
		
};


/**
 * 
 * 01.클래스 설명 : 단말기 정보 관리 클래스 .</br> 
 * 02.제품구분 : LEMP Xross</br>
 * 03.기능(콤퍼넌트) 명 : 단말기 정보 관리 </br>
 * 04.관련 API/화면/서비스 : </br>
 * 05.관련테이블 : 해당 사항 없음 </br>
 * 06.관련 서비스 : 해당 사항 없음 </br> 
 * 07.수정이력  </br>
 * <pre>
 * ********************************************************************************************************************************** </br>
 *  수정일                                          이름                          변경 내용</br>
 * **********************************************************************************************************************************</br>
 *  2016-09-01                                    김승현                         최초 작성</br>
 * **********************************************************************************************************************************</br>
 *</pre>
 *
 * @author 김승현 
 * @version 1.0 
 * 
 */
LEMPCore.DeviceManager = new Object();

LEMPCore.DeviceManager.servicename = "DeviceManager";

/**
 * LEMP Window Load시 LEMP Device Info 초기화 .</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param 
 *  
 * @return 
 */
LEMPCore.DeviceManager.init = function(){
	// Device Info관련
	LEMP.Device.Info.app_version = LEMP.Device.Info.app_major_version+"."+
									 LEMP.Device.Info.app_minor_version+"."+
									 LEMP.Device.Info.app_build_version+ "_" + 
									 LEMP.Device.Info.content_major_version + "." + 
									 LEMP.Device.Info.content_minor_version;
	
	if(LEMP.Device.Info.web_log_level) {
		LEMP.loglevel =  LEMP.Device.Info.web_log_level;
	}
	
	LEMPCore.Module.logger(this.servicename, "init", "D", "Device Info initialized - "+JSON.stringify(LEMP.Device.Info));
	
};

/**
 * 
 * 01.클래스 설명 : 단말기 주소록 기능 클래스 .</br> 
 * 02.제품구분 : LEMP Xross</br>
 * 03.기능(콤퍼넌트) 명 : 단말기 주소록 관리 기능 </br>
 * 04.관련 API/화면/서비스 : </br>
 * 05.관련테이블 : 해당 사항 없음 </br>
 * 06.관련 서비스 : 해당 사항 없음 </br> 
 * 07.수정이력  </br>
 * <pre>
 * ********************************************************************************************************************************** </br>
 *  수정일                                          이름                          변경 내용</br>
 * **********************************************************************************************************************************</br>
 *  2016-09-01                                    김승현                         최초 작성</br>
 * **********************************************************************************************************************************</br>
 *</pre>
 *
 * @author 김승현 
 * @version 1.0 
 * 
 */
LEMPCore.Contacts =  new Object();

LEMPCore.Contacts.servicename = "Contacts";
/**
 * 전화번호부 검색.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sSearchType	(Default : "", 전체조회) 주소록 검색 대상 필드(name 또는 phone) 
 * @param String _sSearchText 	(Default : "") 주소록 검색어
 * @param Function _fCallback	주소록 검색 결과를 받아 처리할 callback함수
 *  
 * @return 
 */
LEMPCore.Contacts.get = function(options) {
	
	var action = "get";
	
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
	
    var tr = 
    {
           id:"GET_CONTACT",
           param:{
        	   search_type : arguments[0]._sSearchType,
        	   search_text : arguments[0]._sSearchText,
        	   callback : callback
           }
    };
    
    LEMPCore.Module.gateway(tr, this.servicename , action );
    
};

/**
 * 
 * 01.클래스 설명 : File 클래스 .</br> 
 * 02.제품구분 : LEMP Xross</br>
 * 03.기능(콤퍼넌트) 명 : File 컨트롤 클래스.  </br>
 * 04.관련 API/화면/서비스 : </br>
 * 05.관련테이블 : 해당 사항 없음 </br>
 * 06.관련 서비스 : 해당 사항 없음 </br> 
 * 07.수정이력  </br>
 * <pre>
 * ********************************************************************************************************************************** </br>
 *  수정일                                          이름                          변경 내용</br>
 * **********************************************************************************************************************************</br>
 *  2016-09-01                                    김승현                         최초 작성</br>
 * **********************************************************************************************************************************</br>
 *</pre>
 *
 * @author 김승현 
 * @version 1.0 
 * 
 */
LEMPCore.File = new Object();

LEMPCore.File.servicename = "File";
/**
 * 파일 열기.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sSourcePath 열어볼 파일 경로. 기본 설치App으로 연결.
 * @param Function _fCallback 파일을 열고 난 후 호출될 callback함수.
 *  
 * @return 
 */
LEMPCore.File.open = function()
{
	var action = "open";
	
	var splitSourcePath = LEMPCore.Module.pathParser(arguments[0]._sSourcePath);
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
	
    var tr = 
    {
           
           id:"OPEN_FILE",
           param:{
                  target_path : splitSourcePath.path,
                  target_path_type : splitSourcePath.type,
                  callback:callback
           }
    };
    
    LEMPCore.Module.gateway(tr, this.servicename , action );
};

/**
 * 파일 압축.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sSourcePath 소스 File Path.
 * @param String _sTargetPath 결과 File Path.
 * @param Function _fCallback 압축 후 호출될 callback함수.
 *  
 * @return 
 */
LEMPCore.File.zip= function()
{
	var action = "zip";
	
	var splitSourcePath = LEMPCore.Module.pathParser(arguments[0]._sSourcePath);
	var splitTargetPath = LEMPCore.Module.pathParser(arguments[0]._sTargetPath);
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
	
	var tr = 
	{
		
		id:"ZIP_FILE",
		param:{
			source_path: splitSourcePath.path,
			source_path_type: splitSourcePath.type,
		    target_path: splitTargetPath.path,
		    target_path_type: splitTargetPath.type,
			callback:callback
		}
	};
	
	LEMPCore.Module.gateway(tr, this.servicename , action );
	
};

/**
 * 파일 압축해제.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sSourcePath 소스 File Path.
 * @param String _sDirectory 압축 해제할 Directory Path.
 * @param Function _fCallback 압축 후 호출될 callback함수.
 *  
 * @return 
 */
LEMPCore.File.unzip= function()
{
	var action = "unzip";
	
	var splitSourcePath = LEMPCore.Module.pathParser(arguments[0]._sSourcePath);
	var splitTargetPath = LEMPCore.Module.pathParser(arguments[0]._sDirectory);
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
	
	var tr = 
	{
			
			id:"UNZIP_FILE",
			param:{
				source_path: splitSourcePath.path,
				source_path_type: splitSourcePath.type,
			    target_directory: splitTargetPath.path,
				target_directory_type: splitTargetPath.type,
				callback:callback
			}
	};

	LEMPCore.Module.gateway(tr, this.servicename , action );
	
};


/**
 * 파일 이동.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sSourcePath 소스 File Path.
 * @param String _sTargetPath 이동될 File Path.
 * @param Function _fCallback 이동 후 호출될 callback함수.
 *  
 * @return 
 */
LEMPCore.File.move = function()
{
	var action = "move";
	
	var splitSourcePath = LEMPCore.Module.pathParser(arguments[0]._sSourcePath);
	var splitTargetPath = LEMPCore.Module.pathParser(arguments[0]._sTargetPath);
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
	
	var tr = 
	{
			
			id:"MOVE_FILE",
			param:{
				source_path: splitSourcePath.path,
				source_path_type: splitSourcePath.type,
			    target_path: splitTargetPath.path,
			    target_path_type: splitTargetPath.type,
				callback:callback
			}
	};

	LEMPCore.Module.gateway(tr, this.servicename , action );
	
};
/**
 * 파일 복사.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sSourcePath 소스 File Path.
 * @param String _sTargetPath 복사될 File Path.
 * @param Function _fCallback 복사 후 호출될 callback함수.
 *  
 * @return 
 */
LEMPCore.File.copy = function() {
	
	var action = "copy";
	
	var splitSourcePath = LEMPCore.Module.pathParser(arguments[0]._sSourcePath);
	var splitTargetPath = LEMPCore.Module.pathParser(arguments[0]._sTargetPath);
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
	
	var tr = {
			
		    "id": "COPY_FILE",
		    "param": {
		        source_path: splitSourcePath.path,
				source_path_type: splitSourcePath.type,
			    target_path: splitTargetPath.path,
			    target_path_type: splitTargetPath.type,
				callback:callback
		    }
		};
	
	LEMPCore.Module.gateway(tr, this.servicename , action );
	
};

/**
 * 파일 삭제.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Array _aSourcePath 삭제할 File Path 목록.
 * @param Function _fCallback 삭제 후 호출될 callback함수.
 *  
 * @return 
 */
LEMPCore.File.remove = function() {
	
	var action = "remove";
	
	var targetfiles = new Array();
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
		
	for(var i=0;i<arguments[0]._aSourcePath.length;i++){
		
		var splitSourcePath = LEMPCore.Module.pathParser(arguments[0]._aSourcePath[i]);
		
		var file = {
				"source_path": splitSourcePath.path,
				"source_path_type": splitSourcePath.type,
		};
		
		
		targetfiles[i] = file;
	}
	
	var tr = {
			
		    "id": "REMOVE_FILES",
		    "param": {
		    	list: targetfiles,
		    	callback:callback
		    }
		};
	
	LEMPCore.Module.gateway(tr, this.servicename , action );
};
/**
 * 디렉토리 정보 읽기 .</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Array _aSourcePath 삭제할 File Path 목록.
 * @param Function _fCallback 삭제 후 호출될 callback함수.
 *  
 * @return 
 */
LEMPCore.File.directory = function()
{
	var action = "directory";
	
	var splitSourcePath = LEMPCore.Module.pathParser(arguments[0]._sDirectory);
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
	
	var tr = 
	{
			
			id:"GET_DIRECTORY_INFO",
			param:{
				source_directory: splitSourcePath.path,
				source_directory_type: splitSourcePath.type,
				callback:callback
			}
	};

	LEMPCore.Module.gateway(tr, this.servicename , action );
};

/**
 * 파일 존재 여부 확인.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sSourcePath 확인할 File Path 목록.
 * @param Function _fCallback 확인 후 호출될 callback함수.
 *  
 * @return 
 */
LEMPCore.File.exist = function() {
	
	var action = "exist";
	
	var splitSourcePath = LEMPCore.Module.pathParser(arguments[0]._sSourcePath);
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
	
	var tr = 
	{
			
			id:"EXISTS_FILE",
			param:{
				source_path: splitSourcePath.path,
				source_path_type: splitSourcePath.type,
				callback:callback
			}
	};
	
	LEMPCore.Module.gateway(tr, this.servicename , action );
	
};
/**
 * 파일 업로드.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Array _aFileList	업로드할 File Path 목록.
 * @param Function _fCallback		결과를 받을 callback 함수.
 *  
 * @return 
 */
LEMPCore.File.upload = function() {
	
	var action = "upload";
	
	var file_list = arguments[0]._aFileList.map(function(row, index)	{
	var splitSourcePath = LEMPCore.Module.pathParser(row._sSourcePath);
		
		return {
			source_path : splitSourcePath.path,
			source_path_type : splitSourcePath.type,
			file_name : row._sFileName
		};
	});
	
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
	
	var tr = 
	{
			id:"FILE_UPLOAD",
			param:{
				list : file_list,
				callback : callback
			}
	};
	
	LEMPCore.Module.gateway(tr, this.servicename , action );
	
};
/**
 * 파일 다운로드.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Array _aFileList	다운로드할 URL 주소 목록.
 * @param String _sMode		파일 다운로드 모드. (background 또는 foreground ). 
 * @param String _sProgressBar	다운로드할 때 프로그래스바 설정 값.( off , each, full )
 * @param Function _fCallback		결과를 받을 callback 함수.
 *  
 * @return 
 */

LEMPCore.File.download = function() {
	
	var action = "download";
	
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback, "listener");
	var file_list = arguments[0]._aFileList;
	var list_len = file_list.length;
	
	for(var i=0;i< list_len; i++){
		var splitTargetPath = LEMPCore.Module.pathParser(file_list[i]._sDirectory);
		file_list[i].target_path = splitTargetPath.path + file_list[i]._sFileName,
		file_list[i].target_path_type = splitTargetPath.type,
		file_list[i].overwrite = file_list[i]._bOverwrite,
		file_list[i].uri = file_list[i]._sURI,
		file_list[i].file_id = i;
	}
	
	var tr = {
		
		id:"DOWNLOAD",
		param:{
			method:arguments[0]._sMode,
			uri_list:file_list,
			progress : arguments[0]._oProgressBar,
			callback:callback
		}
	};
	
	LEMPCore.Module.gateway(tr, this.servicename , action );
	
};

/**
 * 파일 정보 가져오기.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Array _aFileList	정보를 가져올 File Path 목록.
 * @param Function _fCallback		결과를 받을 callback 함수.
 *  
 * @return 
 */
LEMPCore.File.getInfo = function()    {
    var action = "getInfo";

    var serviceName = this.servicename;
    var fileList = arguments[0]._aFileList.map(function(row, index)	{
	    var splitSourcePath = LEMPCore.Module.pathParser(row._sSourcePath);
		
		return {
            index : index,
			source_path : splitSourcePath.path,
			source_path_type : splitSourcePath.type
		};
	});
    var userCallback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
    // JSON은 순서 보장이 안되니까 순서 맞춰서 usercallback대신 callback을 만들고
    // native에 callback보내고 callback안에서 usercallback부르도록
    var callback = LEMPCore.CallbackManager.save(function(res)   {
        LEMPCore.Module.logger(serviceName, action ,"D", res);

        if(res.result)	{
            var nonIndexFileList = new Array();
            
            res.list.forEach(function(row)    {
                var index = row.index;
                
                nonIndexFileList[index] = row;
                delete nonIndexFileList[index].index;
            });
    
            res.list = nonIndexFileList;
        }

        // script에서 호출하는 CallbackManager responser
        LEMPCore.CallbackManager.responser(   
        	{ "callback" : userCallback }, 
        	{ "message" : res }   
        );
    });

    var tr = {
		id : "GET_IMAGE_INFO",
		param : {
			file_path : fileList,
			callback : callback
		}
	};

    LEMPCore.Module.gateway(tr, this.servicename , action );
};
/**
 * 이미지 파일 리사이즈.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Array _aFileList	이미지 파일 목록.
 * @param Boolean _bIsCopy	(Default : false) 원본 파일 유지 여부. (true 또는 false)
 * @param String _sTargetDirectory	_bIsCopy가 true일 경우 복사본이 저장될 디렉토리 경로.
 * @param Number _nWidth	파일의 가로 크기를 설정.
 * @param Number _nHeight	 파일의 세로 크기를 설정.
 * @param Number _nCompressRate	Number	X (Default : 1.0) 파일의 압축률 값( 0.0부터 1.0까지 값 지정가능 )
 * @param Number _nFileSize	리사이즈 된 파일 용량의 최대값.( byte단위 )
 * @param Function _fCallback	결과를 받아 처리할 callback 함수.
 *  
 * @return 
 */
LEMPCore.File.resizeImage = function()    {
    var action = "resizeImage";

    var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
    var fileList = arguments[0]._aFileList.map(function(row)	{
	    var splitSourcePath = LEMPCore.Module.pathParser(row._sSourcePath);
		
		return {
			source_path : splitSourcePath.path,
			source_path_type : splitSourcePath.type
		};
	});
    var splitTargetDir = LEMPCore.Module.pathParser(arguments[0]._sTargetDirectory);
    // resizeImage가 가로, 세로를 줄이는게 아니라 용량을 줄이는 것
    var compressRate = isNaN(Number(arguments[0]._nCompressRate)) ? 1.0 : arguments[0]._nCompressRate;
    // 원본 둘지 말지 여부
    var copy = arguments[0]._bIsCopy === false ? false : true;

    var tr = {
		id : "RESIZE_IMAGE",
		param : {
			image_paths  : fileList,
			callback : callback,
            compress_rate : compressRate,
            copy_flag : copy,
            width : arguments[0]._nWidth,
            height : arguments[0]._nHeight,
            file_size : arguments[0]._nFileSize,
            target_path_type : splitTargetDir.type,
            target_path : splitTargetDir.path
		}
	};

    LEMPCore.Module.gateway(tr, this.servicename , action );
};
/**
 * 이미지 파일 회전.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sSourcePath		이미지 File Path.
 * @param String _sTargetPath		회전된 이미지가 저장될 Path.
 * @param Number _nOrientation	회전 시킬 각도(EXIF_Orientation)값.(1, 2, 3, 4, 5, 6, 7, 8 )
 * @param Function _fCallback		결과를 받아 처리할 callback 함수.
 *  
 * @return 
 */
LEMPCore.File.rotateImage = function()    {
    var action = "rotateImage";
    var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
    var splitSourcePath = LEMPCore.Module.pathParser(arguments[0]._sSourcePath);
    var splitTargetPath = LEMPCore.Module.pathParser(arguments[0]._sTargetPath);
    var orientation = (arguments[0]._nOrientation).toString();

    var tr = {
        id : "ROTATE_IMAGE",
        param : {
        	orientation : orientation,
            source_path_type : splitSourcePath.type,
            source_path : splitSourcePath.path,
            target_path_type : splitTargetPath.type,
            target_path : splitTargetPath.path,
            callback : callback
        }
    };
    
    LEMPCore.Module.gateway(tr, this.servicename , action );
};

/**
 * 
 * 01.클래스 설명 : Push 기능 클래스 .</br> 
 * 02.제품구분 : LEMP Xross</br>
 * 03.기능(콤퍼넌트) 명 : bizPush Server Open API연동 본 기능 </br>
 * 04.관련 API/화면/서비스 : LEMPCore.Module.checkparam,LEMPCore.Push.getAlarm,LEMPCore.Push.getMessageList,LEMPCore.Push.getPushKey,LEMPCore.Push.getUnreadCount,LEMPCore.Push.readMessage,LEMPCore.Push.registerToServer,LEMPCore.Push.sendMessage,LEMPCore.Push.setAlarm,LEMPCore.Push.setBadgeCount</br>
 * 05.관련테이블 : 해당 사항 없음 </br>
 * 06.관련 서비스 : 해당 사항 없음 </br> 
 * 07.수정이력  </br>
 * <pre>
 * ********************************************************************************************************************************** </br>
 *  수정일                                          이름                          변경 내용</br>
 * **********************************************************************************************************************************</br>
 *  2016-09-01                                    김승현                         최초 작성</br>
 * **********************************************************************************************************************************</br>
 *</pre>
 *
 * @author 김승현 
 * @version 1.0 
 * 
 */
LEMPCore.PushManager = new Object();

LEMPCore.PushManager.servicename = "PushManager";

LEMPCore.PushManager.userCallback = {};

/**
 * 푸시 기본 저장 정보 초기화</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param 
 *   
 * @return 
 */
LEMPCore.PushManager.reset = function()	{
	LEMPCore.Properties.remove({
		"_sKey" : "STORED_PUSHKEY"
	});
	LEMPCore.Properties.remove({
		"_sKey" : "STORED_PUSH_USERID"
	});
	LEMPCore.Properties.remove({
		"_sKey" : "IS_REGISTRATION"
	});
};

/**
 * 푸시 정보 등록 여부 체크</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param 
 *   
 * @return Boolean isRegistration		등록 여부(true 또는 false )
 */
LEMPCore.PushManager.isRegistration = function()	{
	// 앱 최초 실행 시, push서버에 register되었는지 확인(Properties)
	var isRegistration = LEMPCore.Properties.get({
		"_sKey" : "IS_REGISTRATION"
	}) ? true : false;
	
	return isRegistration;
};

/**
 * 푸시 키 일치 여부 확인</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param 
 *   
 * @return Boolean result		일치 여부(true 또는 false )
 */
LEMPCore.PushManager.checkValidPushKey = function()	{
	// 네이티브 device에 등록된 push_key랑 property에 있는 push_key일치 여부
	var deviceInfoPushKey = LEMP.Device.getInfo({
			"_sKey" : "push_key"
		});
	var storedPushKey = LEMPCore.Properties.get({
		"_sKey" : "STORED_PUSHKEY"
	});
	var result = false;
	
	deviceInfoPushKey = LEMPCore.APP_CONFIG.PUSH.URL + ":" + deviceInfoPushKey;
	
	if(LEMP.Device.isAndroid())	{
		if(typeof deviceInfoPushKey == "string")	{
			if(deviceInfoPushKey.trim().length > 0)	{
				if(deviceInfoPushKey == storedPushKey)	result = true;
			}
		}
	} else	{
		if(deviceInfoPushKey == storedPushKey)	result = true;
	}
	
	return result;
};

/**
 * 푸시 사용 유저 정보 조회</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String userId	비교할 유저ID
 * 
 *  
 * @return Boolean result		일치 여부(true 또는 false )
 */
LEMPCore.PushManager.checkValidPushUserId = function(userId)	{
	// 1인 1디바이스가 아니라 한 어플리케이션에 로그아웃 후 다른 사용자로 로그인 시 userid가 등록되어 있는지 확인
	var storedPushUserId = LEMPCore.Properties.get({
		"_sKey" : "STORED_PUSH_USERID"
	});
	var result = false;

	if(storedPushUserId != undefined)	{
		if(storedPushUserId.toString().trim().length > 0)	{
			if(storedPushUserId == userId)	{
				result = true;
			}
		}
	}
	
	return result;
};


/**
 * 푸시키 저장</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String pushKey	저장할 pushKey
 *  
 * @return 
 */
LEMPCore.PushManager.setStoredPushKey = function(pushKey)	{
	// native에 push_key setting용도
	var storedPushKey = LEMPCore.Properties.get({
		"_sKey" : "STORED_PUSHKEY"
	});

	pushKey = LEMPCore.APP_CONFIG.PUSH.URL + ":" + pushKey;
	
	if(storedPushKey != pushKey)	{
		LEMPCore.Properties.set({
			"_sKey" : "STORED_PUSHKEY",
			"_vValue" : pushKey
		});
	}
};
/**
 * 푸시 사용 유저 정보 저장</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String userId	저장할 유저ID
 *   
 * @return 
 */

LEMPCore.PushManager.setStoredPushUserId = function(userId)	{
	// native에 pushUserID 저장 용도
	var storedPushUserId = LEMPCore.Properties.get({
		"_sKey" : "STORED_PUSH_USERID"
	});
	
	if(storedPushUserId != userId)	{
		LEMPCore.Properties.set({
			"_sKey" : "STORED_PUSH_USERID",
			"_vValue" : userId
		});
	}
};
/**
 * 푸시키 정보 조회</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Function _fCallback	결과를 받아 처리할 callback 함수.
 * @param Boolean _bProgressEnable		(default:true) 푸시 서버와 통신 중일때 화면에 progress 를 표시할지에 대한 여부( true 또는 false )
 *  
 * @return 
 */

LEMPCore.PushManager.getPushKey = function()	{
	// LEMP push server로 부터 push key get
	var action = "getPushKey";
	var callback = LEMPCore.CallbackManager.save(this.resGetPushKey);
	var userCallback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
    var progressEnable = arguments[0]._bProgressEnable === false ? false : true;

	this.userCallback[action] = userCallback;
	
	var tr = {
		id : "GET_PUSHKEY",
		param : {
			callback : callback,
            read_timeout : 10*1000,
            progress : progressEnable
		}
	};
	
	if(!this.checkValidPushKey())	{
		LEMPCore.Properties.remove({
			"_sKey" : "IS_REGISTRATION"
		});
		LEMPCore.Module.gateway(tr, this.servicename, action);
	} else	{
		var returnValue = {
			"result" : true,
			"resultCode" : "0000",
			"resultMessage" : LEMP.Device.getInfo({
				"_sKey" : "push_key"
			})
		};
		
		this.resGetPushKey(returnValue);
	}
};

/**
 * 푸시키 정보 결과처리 Callback 함수</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Object res	Native에서 전달받은 푸시키 정보 Data Object.
 *  *  
 * @return 
 */
LEMPCore.PushManager.resGetPushKey = function(res)	{
	// push key get 후 response callback
	if(res.result)	{
		LEMPCore.PushManager.setStoredPushKey(res.resultMessage);
		LEMP.Device.Info.push_key = res.resultMessage;
	} else	{
		LEMPCore.Module.logger(this.servicename, "getPushKey" ,"D", res.resultMessage);		
	}
	
	LEMPCore.CallbackManager.responser({
		"callback" : LEMPCore.PushManager.userCallback["getPushKey"]
	}, {
		"message" : res
	});
}

/**
 * 푸시서버에 사용자 정보 등록</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sServerType		푸시키를 등록할 서버 타입.( bizpush 또는 push )
 * @param String_sUserId			푸시키를 등록할 사용자 아이디.
 * @param String _sAppName		푸시키를 등록할 앱 이름.
 * @param Function _fCallback		결과를 받아 처리할 callback 함수.
 * @param Boolean _bProgressEnable		(default:true) 푸시 서버와 통신 중일때 화면에 progress 를 표시할지에 대한 여부( true 또는 false )
 *  
 * @return 
 */
LEMPCore.PushManager.registerToServer = function()	{
	// 서버에 register용도
	var action = "registerToServer";
	var callback = {};
	var userCallback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
	var userId = arguments[0]._sUserId;
    var progressEnable = arguments[0]._bProgressEnable === false ? false : true;
	
	this.userCallback[action] = userCallback;
	
	callback = function(res)	{
		LEMPCore.PushManager.resRegistration(res, userId);
	};
	
	var tr = {
		id : "PUSH_REGISTRATION",
		param : {
			type : arguments[0]._sServerType,
			push_key : LEMP.Device.getInfo({
				"_sKey" : "push_key"
			}),
			user_id : userId,
			app_name : arguments[0]._sAppName,
			callback : LEMPCore.CallbackManager.save(callback),
            read_timeout : 10*1000,
            progress : progressEnable
		}
	};
	
	if(this.checkValidPushUserId(userId) && this.isRegistration())	{
		var resultValue = {
			"result" : true,
			"resultCode" : "0000",
			"resultMessage" : "성공",
			"body" : null
		};
		
		this.resRegistration(resultValue, userId);
	} else	{
		LEMPCore.Module.gateway(tr, this.servicename , action );
	}
};

/**
 * 푸시서버에 사용자 정보 등록 결과 처리 함수</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Object res		Native에서 전달받은 등록 처리 결과 정보 Data
 * @param String_sUserId			등록한 사용자 아이디.
 *   
 * @return 
 */
LEMPCore.PushManager.resRegistration = function(res, userId)	{
	// 서버 register 후 response callback
	if(res.result)	{
		LEMPCore.Properties.set({
			"_sKey" : "IS_REGISTRATION",
			"_vValue" : true
		});
		
		LEMPCore.PushManager.setStoredPushUserId(userId);
	} else	{
		LEMPCore.Module.logger(this.servicename, "registerToServer" ,"D", res.resultMessage);
	}
	
	LEMPCore.CallbackManager.responser({
		"callback" : LEMPCore.PushManager.userCallback["registerToServer"]
	}, {
		"message" : res
	});
};

/**
 * 푸시 알람 수신여부 설정</br>
 *
 * <pre>
 * 수정이력 </br>
 * *********************************w************************************************************************************************* </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sUserId		푸시 알림 설정을 등록할 사용자 이이디.
 * @param Boolean  _bEnabled		(Default : true) 알람 수신 여부 설정 ( true 또는 false )
 * @param Boolean _bProgressEnable		(Default:true) 푸시 알람 설정 요청시 화면에 progress 표시 여부( true 또는 false )
 * @param Function _fCallback	결과를 받아 처리할 callback 함수.
 *  
 * @return 
 */
LEMPCore.PushManager.setAlarm = function()	{
	var action = "setAlarm";
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
    var progressEnable = arguments[0]._bProgressEnable === false ? false : true;
	
	var tr = {
		id : "PUSH_UPDATE_ALARM_SETTING",
		param : {
			user_id : arguments[0]._sUserId,
			push_key : arguments[0]._sPushKey,
			enabled : arguments[0]._bEnabled,
			callback : callback,
            read_timeout : 10*1000,
            progress : progressEnable
		}
	};
	
	LEMPCore.Module.gateway(tr, this.servicename , action );
};
/**
 * 푸시 알람 수신여부 조회</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sUserId		푸시 알림 설정을 조회할 사용자 이이디.
 * @param Boolean _bProgressEnable		(Default:true) 푸시 알람 설정 요청시 화면에 progress 표시 여부( true 또는 false )
 * @param Function _fCallback	결과를 받아 처리할 callback 함수.
 *  
 * @return 
 */
LEMPCore.PushManager.getAlarm = function()	{
	var action = "getAlarm";
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
    var progressEnable = arguments[0]._bProgressEnable === false ? false : true;
	
	var tr = {
		id : "PUSH_ALARM_SETTING_INFO",
		param : {
			user_id : arguments[0]._sUserId,
			push_key : arguments[0]._sPushKey,
			callback : callback,
            read_timeout : 10*1000,
            progress : progressEnable
		}
	};
	
	LEMPCore.Module.gateway(tr, this.servicename , action );
};
/**
 * 푸시 수신 목록 조회</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sAppName	푸시 서버에 등록된 앱 이름.
 * @param String _sUserId		푸시 메세지를 조회할 사용자 이이디.
 * @param Number _nPageIndex	푸시 메세지를 가져올 페이징 값.
 * @param Number _nItemCount	푸시 메세지를 가져올 페이징 처리 갯수
 * @param Boolean _bProgressEnable		(default:true) 푸시 서버와 통신 중일때 화면에 progress 를 표시할지에 대한 여부( true 또는 false )
 * @param Function _fCallback	결과를 받아 처리할 callback 함수.
 *  
 * @return 
 */
LEMPCore.PushManager.getMessageList = function()	{
	var action = "getMessageList";
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
    var progressEnable = arguments[0]._bProgressEnable === false ? false : true;
	
	var tr = {
		id : "PUSH_GET_MESSAGES",
		param : {
			app_name : arguments[0]._sAppName,
			page_index : arguments[0]._nPageIndex,
			item_count : arguments[0]._nItemCount,
			user_id : arguments[0]._sUserId,
			callback : callback,
            read_timeout : 10*1000,
            progress : progressEnable
		}
	};
	
	LEMPCore.Module.gateway(tr, this.servicename , action );
};
/**
 * 푸시 메세지 읽기</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sTrxDay		푸시 메세지를 읽은 날짜.(yyyymmdd)
 * @param String _sTrxId		푸시 메세지 아이디.
 * @param String _sUserId	사용자 아이디.
 * @param Boolean _bProgressEnable		(Default:true) 푸시 알람 설정 요청시 화면에 progress 표시 여부( true 또는 false )
 * @param Function _fCallback	결과를 받아 처리할 callback 함수.
 *  
 * @return 
 */
LEMPCore.PushManager.readMessage = function()	{ 
	var action = "read";
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
    var progressEnable = arguments[0]._bProgressEnable === false ? false : true;
	
	var tr = {
		id : "PUSH_MARK_AS_READ",
		param : {
			trx_day : arguments[0]._sTrxDay,
			trx_id : arguments[0]._sTrxId,
			user_id : arguments[0]._sUserId,
			read : true,
			callback : callback,
            read_timeout : 10*1000,
            progress : progressEnable
		}
	};
	
	LEMPCore.Module.gateway(tr, this.servicename , action );
};
/**
 * 읽지 않은 푸시 메세지 카운트 조회</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sAppName	푸시 서버에 등록된 앱 이름.
 * @param String _sUserId		푸시 메세지를 조회할 사용자 이이디.
 * @param Boolean _bProgressEnable		(Default:true) 푸시 알람 설정 요청시 화면에 progress 표시 여부( true 또는 false )
 * @param Function _fCallback	결과를 받아 처리할 callback 함수.
 *  
 * @return 
 */
LEMPCore.PushManager.getUnreadMessageCount = function()	{
	var action = "getUnreadMessageCount";
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
    var progressEnable = arguments[0]._bProgressEnable === false ? false : true;
	
	var tr = {
		id : "PUSH_GET_UNREAD_PUSH_MESSAGE_COUNT",
		param : {
			app_name : arguments[0]._sAppName,
			user_id : arguments[0]._sUserId,
			callback : callback,
            read_timeout : 10*1000,
            progress : progressEnable
		}
	};
	
	LEMPCore.Module.gateway(tr, this.servicename , action );
};
/**
 * 앱 아이콘에 숫자 표시하기</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Number _nBadgeCount		뱃지에 표시할 값 .( 양수 : 표시할 갯수 ,  0 : 뱃지카운트 초기화 )
 * @param Function _fCallback	결과를 받아 처리할 callback 함수.
 *  
 * @return 
 */
LEMPCore.PushManager.setBadgeCount = function()	{
	var action = "setBadgeCount";
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
	
	var tr = {
		id : "SET_BADGE_COUNT",
		param : {
			badge_count : arguments[0]._nBadgeCount,
			callback : callback
		}
	};
	
	LEMPCore.Module.gateway(tr, this.servicename , action );
};
/**
 * 푸시 메세지 발송</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sAppName	푸시 메세지 보낼 앱 이름.
 * @param Array _aUsers		푸시 메세지 받을 사용자 목록.
 * @param String _sFromUser	푸시 메세지를 보낼 사용자 아이디.
 * @param String _sSubject		푸시 메세지 제목.
 * @param String _sContent		푸시 메세지 내용.
 * @param String _sTrxType		(Default : INSTANT) 푸시 메세지 전송 방식.( INSTANT 또는 SCHEDULE )
 * @param String _sScheduleDate	푸시 메세지 전송 날짜.
 * @param Array _aGroups	푸시 메세지를 받을 그룹 목록
 * @param Boolean _bToAll	(Default : false) 해당 앱을 사용하는 전체 사용자에게 푸시 메세지를 발송할지 여부.
 * @param String _sCategory	(Default : def) 푸시 메세지 카테고리.
 * @param Object _oPayLoad	푸시 기폰 용량 초과시 전달할 메세지.
 * @param Boolean _bProgressEnable		(Default:true) 푸시 알람 설정 요청시 화면에 progress 표시 여부( true 또는 false )
 * @param Function _fCallback	결과를 받아 처리할 callback 함수.
 *  
 * @return 
 */
LEMPCore.PushManager.sendMessage = function()	{
	var action = "sendMessage";
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
    var progressEnable = arguments[0]._bProgressEnable === false ? false : true;
	
	var tr = {
		id : "SEND_PUSH_MESSAGE",
		param : {
			trx_type : arguments[0]._sTrxType,
			app_name : arguments[0]._sAppName,
			schedule_date : arguments[0]._sScheduleDate,
			to_users : arguments[0]._aUsers,
			to_groups : arguments[0]._aGroups,
			to_all : arguments[0]._bToAll,
			from_user : arguments[0]._sFromUser,
			message_subject : arguments[0]._sSubject,
			message_content : arguments[0]._sContent,
			message_category : arguments[0]._sCategory,
			message_payload : arguments[0]._oPayLoad,
			callback : callback,
            read_timeout : 10*1000,
            progress : progressEnable
		}

	};
	
	LEMPCore.Module.gateway(tr, this.servicename , action );
};
/**
 * 대용량 푸시 메세지 읽기</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sMessageId	푸시 메세지 아이디.
 * @param String _sUserId	사용자 아이디.
 * @param Function _fCallback	결과를 받아 처리할 callback 함수.
 *  
 * @return 
 */
LEMPCore.PushManager.readReceiptMessage = function()	{
	var action = "readReceiptMessage";
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
	
	var tr = {
		id : "CHECK_PUSH_RECEIVED",
		param : {
			callback : callback,
			user_id : arguments[0]._sUserId,
			message_id : arguments[0]._sMessageId
		}
	};
	
	LEMPCore.Module.gateway(tr, this.servicename , action );
};

/**
 * 
 * 01.클래스 설명 : Database 기능 클래스 .</br> 
 * 02.제품구분 : LEMP Xross</br>
 * 03.기능(콤퍼넌트) 명 : 컨테이너 SQLite DB 사용 기능 </br>
 * 04.관련 API/화면/서비스 :</br>
 * 05.관련테이블 : 해당 사항 없음 </br>
 * 06.관련 서비스 : 해당 사항 없음 </br> 
 * 07.수정이력  </br>
 * <pre>
 * ********************************************************************************************************************************** </br>
 *  수정일                                          이름                          변경 내용</br>
 * **********************************************************************************************************************************</br>
 *  2016-09-01                                    김승현                         최초 작성</br>
 * **********************************************************************************************************************************</br>
 *</pre>
 *
 * @author 김승현 
 * @version 1.0 
 * 
 */
LEMPCore.Database = new Object();

LEMPCore.Database.servicename = "Database";

/**
 * DataBase Open.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sDbName		오픈할 데이터베이스 명.
 * @param Function _fCallback		결과를 받아 처리할 callback 함수.
 *  
 * @return 
 */
LEMPCore.Database.openDatabase = function()	{
	var action = "openDatabase";
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
	var dbName = arguments[0]._sDbName;
	
	var tr = {
		id : "OPEN_DATABASE",
		param : {
			db_name : dbName,
            callback : callback
		}
	};
	
	LEMPCore.Module.gateway(tr, this.servicename, action);
};

/**
 * DataBase Close.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Function _fCallback		결과를 받아 처리할 callback 함수.
 *  
 * @return 
 */
LEMPCore.Database.closeDatabase = function()	{
	var action = "closeDatabase";
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
	
	var tr = {
		id : "CLOSE_DATABASE",
		param : {
			callback : callback
		}
	};
	
	LEMPCore.Module.gateway(tr, this.servicename, action);
};
/**
 * DataBase Transaction 시작 </br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Function _fCallback		결과를 받아 처리할 callback 함수.
 *  
 * @return 
 */
LEMPCore.Database.beginTransaction = function()	{
	var action = "beginTransaction";
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
	
	var tr = {
		id : "BEGIN_TRANSACTION",
		param : {
			callback : callback
		}
	};
	
	LEMPCore.Module.gateway(tr, this.servicename, action);
};

/**
 * DataBase Transaction Commit.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param Function _fCallback		결과를 받아 처리할 callback 함수.
 *  
 * @return 
 */
LEMPCore.Database.commitTransaction = function()	{
	var action = "commitTransaction";
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
	
	var tr = {
		id : "COMMIT_TRANSACTION",
		param : {
			callback : callback
		}
	};
	
	LEMPCore.Module.gateway(tr, this.servicename, action);
};

/**
 * DataBase Transaction Rollback.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 *  @param Function _fCallback		결과를 받아 처리할 callback 함수.
 *  
 * @return 
 */
LEMPCore.Database.rollbackTransaction = function()	{
	var action = "rollbackTransaction";
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
	
	var tr = {
		id : "ROLLBACK_TRANSACTION",
		param : {
			callback : callback
		}
	};
	
	LEMPCore.Module.gateway(tr, this.servicename, action);
};

/**
 * SQL쿼리문을 실행.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sQuery		실행할 SQL SELECT 쿼리문.
 * @param Array _aBindingValues		쿼리문의 각 변수 위치에 대입해줄 값의 배열.
 * @param Function _fCallback		SQL쿼리문 실행 요청 후 호출되는 callback 함수.
 *  
 * @return 
 */
LEMPCore.Database.executeSql = function()	{
	var action = "executeSql";
	var query = arguments[0]._sQuery;
	var bidingValues;
	
	if(arguments[0]._aBindingValues){
		bidingValues = arguments[0]._aBindingValues;
	}else{
		bidingValues = new Array();
	}
	
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
	
	var tr = {
		id : "EXECUTE_SQL",
		param : {
			query : query,
			bind_array : bidingValues,
			callback : callback
		}
	};
	
	LEMPCore.Module.gateway(tr, this.servicename, action);
};
/**
 * SELECT SQL쿼리문을 실행.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sQuery		실행할 SQL SELECT 쿼리문.
 * @param Array _aBindingValues		쿼리문의 각 변수 위치에 대입해줄 값의 배열.
 * @param Function _fCallback		SQL쿼리문 실행 요청 후 호출되는 callback 함수.
 *  
 * @return 
 */
LEMPCore.Database.executeSelect = function()	{
	var action = "executeSelect";
	var query = arguments[0]._sQuery;
	var bidingValues;
	
	if(arguments[0]._aBindingValues){
		bidingValues = arguments[0]._aBindingValues;
	}else{
		bidingValues = new Array();
	}
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
	
	var tr = {
		id : "EXECUTE_SELECT",
		param : {
			query : query,
			bind_array : bidingValues,
			callback : callback
		}
	};
	
	LEMPCore.Module.gateway(tr, this.servicename, action);
};


/**
 * SQL쿼리문을 일괄 실행.</br>
 *
 * <pre>
 * 수정이력 </br>
 * ********************************************************************************************************************************** </br>
 *  수정일                               이름                               변경내용</br>
 * **********************************************************************************************************************************</br>
 *  2015-09-01                         김승현                             최초 작성</br>
 * 
 *</pre>
 * 
 * @param String _sQuery		실행할 SQL SELECT 쿼리문.
 * @param Array _aBindingValues		쿼리문의 각 변수 위치에 대입해줄 값의 배열.
 * @param Function _fCallback		SQL쿼리문 실행 요청 후 호출되는 callback 함수.
 *  
 * @return 
 */
LEMPCore.Database.executeBatchSql = function()	{
	// batch: 특정 query에 대해 반복할 때 사용
	var action = "executeBatchSql";
	var query = arguments[0]._sQuery;
	var bidingValues = arguments[0]._aBindingValues;
	var callback = LEMPCore.CallbackManager.save(arguments[0]._fCallback);
	
	var tr = {
		id : "EXECUTE_BATCH_SQL",
		param : {
			query : query,
			bind_array : bidingValues,
			callback : callback
		}
	};
	
	LEMPCore.Module.gateway(tr, this.servicename, action);
};


console.log("LEMPCore ready." );
