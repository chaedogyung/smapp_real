/**
 * MultiLayout 관련 클래스 로드용 무명함수.</br>
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
(function()
{
	/**
	 * MultiLayout 클래스 생성자.</br>
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
	var LEMPMultiLayout = new (function()
	{
		this.frameName = "";
		this.parent = "";
		this.broadcastMsgList = new Array();
		
		this.isPhone;
		this.callbacks = []; //최종 displayView 를 실행된 후 불러질 callback 목록 
		this.commandStack = []; //최종 displayView 를 실행된 후 실행된 command 목록 
		this.replaceStrings = {}; // 정규식 관리
		
		this.layout = {};
	})();
	/**
	 * MultiLayout 화면 띄우기.</br>
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
	 * @param String key 멀티레이아웃 화면키값
	 * @param Object options 새창으로 전달할 옵션값
	 *  
	 * @return 
	 */
	LEMPMultiLayout.open = function(key, options)
	{
		var layouts = LEMPMultiLayout._readLayoutFile();
		var layout = LEMPMultiLayout.getLayout(layouts, key);
		if(!layout) LEMPCore.Module.logger("MultiLayout", "open", "E", "can't find multilayout info. key : " + key);
		// title bar, tool bar inherit
		var inherits = layout.inherit;
		if(inherits)
		{
			if(inherits.constructor === String) inherits = [inherits];
			if(inherits.constructor !== Array) LEMPCore.Module.logger("MultiLayout", "open", "E", "type error. inherit type : " + inherits.constructor + "\nkey : " + key);
			var inheritLayout={};
			inherits.forEach(function(value)
			{
				var inherit = layouts[value];
				if(!inherit) LEMPCore.Module.logger("MultiLayout", "open", "E", "type error. can't find inherit. inherit : " + inherit + "\nkey : " + key);
				$.extend(inheritLayout, inherit);
			});
			layout = $.extend(false, inheritLayout, layout);
		}
		
		// {} 안에 있는 모든것을 뽑아냄
		layout = this._replaceSpecChars(layout, /{=(.+)}/g, LEMPMultiLayout.replaceStrings);		
		
		var html = layout.url; 
		var callType = layout.callType;
		
		switch(callType)
		{
			case "openPage" :
				$.extend(layout, { opener : LEMPMultiLayout.frameName });
				
				var frameCount = 0;
				for(key in layout.frames) frameCount++;
				$.extend(layout, { frameCount : frameCount });
				var message = $.extend(options._oMessage, layout.message, 
				{
					LEMPLayout : layout
				});
				var param = $.extend(options, { _oMessage : message, _sPagePath : html });
				delete options.multiLayout;
				LEMPCore.Window.open(param);
				break;
			case "notifyFrame" :
				// target지정
				var target = layout.target;
				var frame = parent.document[target].document;
				if(!target || !frame) LEMPCore.Module.logger("MultiLayout", "open", "E", "reference error. target : " + target + "\nkey : " + key);
	
				var evt = frame.createEvent("Event");
				evt.initEvent("LEMPMultiLayout.onNotifyFrame", false, true);
				evt.data = options._oMessage;
				frame.dispatchEvent(evt);

				break;
			case "openFrame" :
				LEMPMultiLayout.openFrame(
					$.extend(options._oMessage, 
					{
						LEMPLayout : layout
					})
				);
				break;
			default:
				LEMPCore.Module.logger("MultiLayout", "open", "E", "unknown callType. callType : " + callType + "\nkey : " + key);
		}
	};
	/**
	 * MultiLayout 각 화면에 Data 전달 하기.</br>
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
	 * @param Object data 화면에 전달할 Data
	 *  
	 * @return 
	 */
	LEMPMultiLayout.broadcast = function(data)
	{
		var curDocument = this.isFrame() ? window.parent.document : document; 
		var frames = $("iframe", curDocument);
		// Multilayout이라고 작성하는 것은 개발자가 작성하는 것
		// isLoadMultiLayout은 프로그램상에서 표시해 주는 것(dom ready에서 표시함)
		var isLoadMultiLayout=true;
		$("iframe", curDocument).each(function()
		{
			// 하나라도 multiLayout이 아니면 isLoadMultiLayout false
			if(!$(this).attr("isLoadMultiLayout")) isLoadMultiLayout = false;
		});
		if(isLoadMultiLayout)
		{
			frames.each(function()
			{
				// child document
				var frame = $(this)[0].contentDocument;
				if(frame!=document)
				{
					var evt = frame.createEvent("Event");
					evt.initEvent("LEMPMultiLayout.onBroadcast", false, true);
					evt.data = data;
					// 각frame에게 dispatchEvent
					try{ frame.dispatchEvent(evt); } 
					catch(e) { LEMP._warring("MultiLayout - " + e);}
				}
			});
		}
		// 하나라도 Loading안되면 reserve함
		else parent.LEMP.MultiLayout._reservBroadcast(data);
	};
	
	/**
	 * MultiLayout 설정 JSON파일 읽기.</br>
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
	 * @return Object MultiLayout설정 파일에서 읽은 JSON 
	 */
	LEMPMultiLayout._readLayoutFile = function()
	{
		var dataUrl;
		var data = {};
		var CURRENT_PATH = location.pathname;
		var MULTI_ROOT_PATH = CURRENT_PATH.substring(0,CURRENT_PATH.indexOf("/contents"))+"/contents/LEMP/config/";
		// IS_PHONE = true;
		if(LEMPMultiLayout.isPhone) dataUrl = MULTI_ROOT_PATH+"layout_phone.config";
		else dataUrl = MULTI_ROOT_PATH+"layout_tablet.config";
		$.ajax({
            type : "get",
			url: dataUrl, 
            dataType: "json",
			async : false,
            success: function(json) 
			{
				data = json;
			},
            error: function(e) 
            {
            	LEMPCore.Module.logger("MultiLayout", "_readLayoutFile", "E", "load layout failed.(" + dataUrl + ") // [" + e.status + "]" + e.statusText);
            }
        });
		return data;
	};
	
	
	/**
	 * MultiLayout 설정에서 특정 key값을 추출.</br>
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
	 * @param Object data MultiLayout설정 값
	 * @param String key MultiLayout 화면 설정키값 
	 *  
	 * @return Variable MultiLayout설정에서 key와 맵핑되어 읽은 값
	 */
	LEMPMultiLayout.getLayout = function(data, key)
	{
		var layout;
		//키가 존재할 경우
		if(data[key]) layout=data[key];
		else
		{
			layout = this._getLayoutByPattern(data, key);
		}
		return layout;
	};
	
	/**
	 * MultiLayout 설정시 사용하는 Keyword( {} ) 추출.</br>
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
	 * @param Object data MultiLayout설정 값
	 * @param String key MultiLayout 화면 설정키값 
	 *  
	 * @return Object layout Keyword가 치환되어 반영된 MultiLayout설정 값
	 */
	LEMPMultiLayout._getLayoutByPattern = function(data, key)
	{
		var layout=undefined;
		for(var dataKey in data)
		{
			var specChars = {};
			var specCharIndexs = [];
			 
			strRegExp = dataKey.replace(/{(\d+)}/g, function($1, $2)
			{ 
			  specCharIndexs.push($2);
			  return "(.+)";
			});
			//패턴형식 인경우
			if(specCharIndexs.length>0)
			{
				layout = data[dataKey]; 
				var regExp = eval("/" + strRegExp + "/");
				
				//key가 패턴에 만족하는지 검사
				var result = regExp.exec(key);
				if(result)
				{
					result = result.slice(1);
					result.forEach(function(value, i)
					{
						specChars[specCharIndexs[i]] = value;
					});
					
					layout = this._replaceSpecChars(layout, /{(\d+)}/g, specChars);
					break;
				}
				else layout = undefined;
			}
		}
		return layout;
	};
	
	/**
	 * MultiLayout 설정시 사용하는 Keyword를 특정 문자로 변경.</br>
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
	 * @param Object layout MultiLayout설정 값
	 * @param RegEx regExp Keyword 정규식
	 * @param String specChars 치환할 문자열 
	 *  
	 * @return Object result 치환된  MultiLayout설정 값
	 */
	LEMPMultiLayout._replaceSpecChars = function(layout, regExp, specChars)
	{
		function replaceUrl(url)
		{
			var lastReplaceChar, lastReplaceSpecChar;
			var result =  url.replace(regExp, function($1, $2)
			{
				lastReplaceChar = $1;
				lastReplaceSpecChar = specChars[$2];
				return lastReplaceSpecChar;  
			});
			//문자열 전체를 다른 타입의 객체로 바꿀때(이 처리를 하지 않으면 문자열로만 변환됨)
			if(url === lastReplaceChar) return lastReplaceSpecChar;
			return result;
		}
		
		//대상을 특정문자열(specChars)로 치환함.
		function replaceSpecChars(param)
		{
			var result;
			if(param!==undefined)
			{
				switch(param.constructor)
				{
					case Object :
						result = {};
						for(key in param)
						{
							result[key] = replaceSpecChars(param[key]);
						}
						break;
					case Array :
						result = [];
						for(var i=0;i<param.length;i++)
						{
							result[i] = replaceSpecChars(param[i]);
						}
						break;
					case String :
						result = replaceUrl(param);
						break;
					default :
						result = param;
						break;
				}
			}
			return result;
		};
		
		return replaceSpecChars(layout);
	};
	
	/**
	 * Broadcast시 각 페이지로 전달할 Data를 저장.</br>
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
	 * @param Object data 전달할 Data 
	 *  
	 * @return 
	 */
	LEMPMultiLayout._reservBroadcast = function(data)
	{
		this.broadcastMsgList.push(data);
	};
	
	/**
	 * Broadcast 요청.</br>
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
	 * @param Object data 전달할 Data 
	 *  
	 * @return 
	 */
	LEMPMultiLayout._broadcastReservs = function(data)
	{
		var that = this;
		this.broadcastMsgList.forEach(function(value)
		{
			that.broadcast(value);
		});
		this.broadcastMsgList = new Array();
	};
	
	
	/**
	 * Frame중 MultiLayout Frame인지 체크.</br>
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
	 * @param boolean result  MultiLayout Frame인지 아닌지 여부
	 *  
	 * @return 
	 */
	LEMPMultiLayout.isFrame = function()
	{
		// window.parent가 없으면 window.parent == window(자기 자신)
		return window!=window.parent && $("iframe[multiLayout]", parent.document).size()>0; 
	};
	/**
	 * MultiLayout Frame 초기화.</br>
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
	 * @param Object frame MultiLayout 객체 
	 *  
	 * @return 
	 */
	LEMPMultiLayout.initFrame = function(frame)
	{
		// 생성자 재정의(parent의 객체들을 frame의 객체로)
		var parent = window.parent;
		Object.prototype.constructor = parent.Object;
		Object = parent.Object;
		Array.prototype.constructor = parent.Array;
		Array = parent.Array;
		String.prototype.constructor = parent.String;
		String = parent.String;
		Number.prototype.constructor = parent.Number;
		Number = parent.Number;
		Boolean.prototype.constructor = parent.Boolean;
		Boolean = parent.Boolean;
		
		this.frameName = frame.name;
		if(frame.opener) this.opener = frame.opener;
		this.interruptClose = frame.interruptClose;
		
		var frameName = this.frameName;
		var parentWindow = window.parent;
		var parentOnFireMessageFunc = parent.LEMPCore.Module.gateway;
		
		LEMPCore.Module.gateway = function(message, service, action, serviceinfo) 
		{
			// POPUP_MESSAGE_BOX: alert창(네이티브 cmd코드는 POPUP_MESSAGE_BOX)
			// alert창은 layer
			if(message.id==="POPUP_MESSAGE_BOX")
			{
				for(var key in message.param.buttons)
				{
					var button = message.param.buttons[key];
					if(button.callback) 
					{
						(function()
						{
							var buttonCallback = button.callback;
							// parent callbackmanager에 save(native에서 parent로 주니까)
							button.callback = window.parent.LEMPCore.CallbackManager.save(function(data)
							{
								// 객체의 함수자체는 parent, 실행되는 실제 함수는 child
								// closure기법 사용(parent의 함수가 create되는 당시에 child에서 가져옴)
								window.LEMPCore.CallbackManager.responser({ callback : buttonCallback }, { message : data });
							}, "listener");
						})();
						
					}
				}
			} 
			else
			{
				var callback = message.param.callback;
				if(message.param)
				{
					switch(message.id)
					{
						case "SHOW_WEB" :
						case "GOTO_WEB" :
						// 팝업 창(팝업 창은 새창)
						case "POP_VIEW" :
						case "SHOW_MESSAGE" :
						case "DISMISS_POPUP_VIEW" :
						case "CREATE_MENU_VIEW" :
						case "CLOSE_MENU_VIEW" :
						case "SMS" :
							break;
						// 새창으로 열지 않을때(default)
						default :
							message.param.message = $.extend(message.param.message, 
							{
								LEMPLayout : 
								{
									opener : frameName
								}
							});
							if(callback)	{
								message.param.callback = window.parent.LEMPCore.CallbackManager.save(function(data)
								{
									// closure
									window.LEMPCore.CallbackManager.responser({ callback : callback }, { message : data });
								});
							}
							break; 
					}
					
				}
			}
			console.log("TEST :: MultiLayout Frame -- gateway333");
			
			// 현재 callback이 실행되고 있는 상태면, cmd를 저장해놓고 아니면 실행
			if(parent.LEMP.MultiLayout.isRunCallback) parent.LEMPMultiLayout.commandStack.push(message);
			// parentOnFireMessageFunc: parent의 LEMPCore.Module
			else parentOnFireMessageFunc.apply(parentWindow.LEMPCore.Module, [message, service, action, serviceinfo]);
		};
		
		// draw를 재정의 하는 이유: 원래 있는 titlebar, toolbar를 multiLayout에서 조합해서 사용하므로
		LEMP.Window.draw = function(_aElement)
		{
			var layout = {};
			for(var i=0; i < arguments[0]._aElement.length ; i++ ) {
				switch( arguments[0]._aElement[i].constructor )
				{
					case LEMPCore.Window.TitleBar :
						layout.titlebar = arguments[0]._aElement[i];
						break;
					case LEMPCore.Window.ToolBar :
						layout.bottom_toolbar = arguments[0]._aElement[i];
						break;
					case LEMPCore.Window.SideBar :
						if(arguments[0]._aElement[i].position == "left"){
							layout.left_toolbar = arguments[0]._aElement[i];
						}else if(arguments[0]._aElement[i].position == "right"){
							layout.right_toolbar = arguments[0]._aElement[i];
						}
						break;
				}
			}
			
			LEMPMultiLayout.layout = $.extend(false, LEMPMultiLayout.layout, layout);
			
			// draw에 대한 callback
			if(_aElement._fCallback)
			{
				window.parent.LEMP.MultiLayout._addCallback(_aElement._fCallback);
			}
			
			$("iframe[name=" + LEMPMultiLayout.frameName + "]", window.parent.document).attr("isCallDisplayView", true);
			
			var isCallDisplayView=true;
			$("iframe", window.parent.document).each(function()
			{
				if(!$(this).attr("isCallDisplayView")) isCallDisplayView = false;
			});
			// 마지막 frame의 DispalyView가 요청되었을 때
			if(isCallDisplayView)
			{
				window.parent.LEMP.MultiLayout._displayView();
			}
		};
		
		// 저장소를 각각 두지 않고, parent에 일괄 저장
		LEMP.Storage.set = function() {
			parent.LEMP.Storage.set.apply(this, arguments);
		};
		
		LEMP.Storage.setList = function() {
			parent.LEMP.Storage.setList.apply(this, arguments);
		};
		
		LEMP.Storage.get = function() {
			return parent.LEMP.Storage.get.apply(this, arguments);
		};
		
		LEMP.Properties.set = function() {
			parent.LEMP.Properties.set.apply(this, arguments);
		};
		
		LEMP.Properties.setList = function() {
			parent.LEMP.Properties.setList.apply(this, arguments);
		};
		
		LEMP.Properties.get = function() {
			return parent.LEMP.Properties.get.apply(this, arguments);
		};
		
		LEMP.Properties.remove = function() {
			return parent.LEMP.Properties.remove.apply(this, arguments);
		};
		
		LEMP.Device.Info = parent.LEMP.Device.Info; 
		
		var that = this;

		// 방향이 전환 되었을 때, 강제로 resize하도록(iPad에서 resize가 안되는 버그가 있어서 예외처리 함)
		$(window.parent).bind('onorientationchange' in window.parent ? 'orientationchange' : 'resize', function(){ setTimeout(that.resetFrameHeight, 500); });
		that.resetFrameHeight();
	};
	
	/**
	 * frame height 재설정.</br>
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
	LEMPMultiLayout.resetFrameHeight = function()
	{
		$(document.body).css("height", $(window.parent).height());
	};
	
	/**
	 * MultiLayout 새창 열기.</br>
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
	 * @param  Object json MultiLayout 설정값
	 *  
	 * @return 
	 */
	LEMPMultiLayout.openPage = function(json)
	{
		var opener = json.LEMPLayout.opener;
		var views = json.LEMPLayout.frames;
		LEMPMultiLayout.opener = opener;
		var message = {};
	
		for(key in json) 
		{
			// LEMPLayout이 아닌 Window.open의 _oMessage에 해당하는 부분을 message에 저장
			// _oMessage : 이전페이지에서 온 data
			if(key!="LEMPLayout") message[key] = json[key];
		}
		for(name in views)
		{
			var url = views[name].url;
			var frame = document[name];
			if(!frame) LEMPCore.Module.logger("MultiLayout", "openPage", "E", "can't find frame. frame name: " + name);
			// param에 message 뽑아내서 위에 있는 message랑 extend시킴
			var param = views[name].message ? $.extend(views[name].message,message) : message;
			
			param.LEMPFrame = { name : name, opener : opener, interruptClose : views[name].interruptClose};
			// url과 message넘겨 줌
			$("iframe[name=" + name +"]").attr("src","../../" + url +"?message=" + JSON.stringify(param));
		}
	};
	/**
	 * MultiLayout Frame에 새 페이지 열기.</br>
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
	 * @param  Object json MultiLayout 설정값
	 *  
	 * @return 
	 */
	LEMPMultiLayout.openFrame = function(json)
	{
		var opener = json.LEMPLayout.opener;
		var views = json.LEMPLayout.frames;
		if(!views) LEMPCore.Module.logger("MultiLayout", "openFrame", "E", "reference error. frame : " + views);
		var message = {};
		for(key in json) 
		{
			if(key!="LEMPLayout") message[key] = json[key];
		}
		
		for(name in views)
		{
			var url = views[name].url;
			var frame = parent.document[name];
			if(!frame) LEMPCore.Module.logger("MultiLayout", "openFrame", "E", "can't find frame. frame name: " + name);
			var param = views[name].message ? $.extend(views[name].message,message) : message;
			param.LEMPFrame = { name : name, opener : opener, interruptClose : views[name].interruptClose};
			var page = "../../" + url +"?message=" + encodeURIComponent(JSON.stringify(param));
			// replace
			frame.location.replace(page);
		}
	}; 
	
	var parentDisplayViewFunc = LEMP.Window.draw;
	
	/**
	 * Titlebar, Toolbar에 MultiLayout 설정을 적용하여 요청하기.</br>
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
	LEMPMultiLayout.displayView = function()
	{
		//LEMPMultiLayout.displayView 내부함수
		function rebuildBarInfo(bar, strTarget, barClass)
		{
			var result, barObject;
			if(bar)
			{
				result = {};
				if(bar.background) 
				{
					bar.image_name = bar.background;
					delete bar.background;
				}
				
				for(key in bar)
				{
					//치환
					//재귀를 위한 내부함수
					function replaceBarSpecChars(data ,key)
					{
						var replaceResult = undefined;
						switch(data.constructor)
						{
							case Array :
								replaceResult = [];
								data.forEach(function(value)
								{
									var result = replaceBarSpecChars(value, key);
									if(result) replaceResult.push(result);
								});
								break;
							case String :
								var lastReplaceString=undefined, lastReplaceSpecObj=undefined;
								
								var frameName, frame, index, targetLayout; 
								var replaceResult = data.replace(/\{(.*)\}/g, function($1, $2)
								{
									lastReplaceString = $1;
									var split = $2.split(".");
									if(split.length===2) index = split[1];
									frameName = split[0];
									//frame = window.parent.document[frameName]; 
									frame = document[frameName]; 
									if(frame) targetLayout = frame.LEMP.MultiLayout._getLayoutInfo(strTarget); 
									if(targetLayout && targetLayout[key])
									{
										if(index!=undefined)
										{
											lastReplaceSpecObj = targetLayout[key][index]; 
											return lastReplaceSpecObj;
										}
										else 
										{
											lastReplaceSpecObj = targetLayout[key]; 
											return lastReplaceSpecObj;
										}
									}
									else return;
								});
								
								if(data === lastReplaceString) replaceResult = lastReplaceSpecObj;
								if(replaceResult!=undefined)
								{
									if(replaceResult.action)
									{
										var btn = JSON.parse(JSON.stringify(replaceResult));
										var currentAction = btn.action;
										btn.action = LEMPCore.CallbackManager.save(function(data)
										{
											// button에 대한 callback
											document[frameName].LEMPCore.CallbackManager.responser({ callback : currentAction }, { message : data });
										}, "listener");
										
										return btn;
									}
								}
								return replaceResult;
								
								break;
							default : 
								replaceResult = data;	
						}
						return replaceResult;
					}
					result[key] = replaceBarSpecChars(bar[key], key); 
				}
				barObject = $.extend(new barClass({_sTitle : ""}), result);
				
				return barObject;
			}
		}
		
		var titlebar = rebuildBarInfo(LEMPMultiLayout.titlebar, "titlebar", LEMPCore.Window.TitleBar);
		var bottomToolbar = rebuildBarInfo(LEMPMultiLayout.bottom_toolbar, "bottom_toolbar", LEMPCore.Window.ToolBar);
		var leftToolbar = rebuildBarInfo(LEMPMultiLayout.left_toolbar, "bottom_toolbar", LEMPCore.Window.SideBar);
		var rightToolbar = rebuildBarInfo(LEMPMultiLayout.right_toolbar, "bottom_toolbar", LEMPCore.Window.SideBar);
		
		var elements = [titlebar, bottomToolbar, leftToolbar, rightToolbar].filter(function(value) { return value || false; });
		// draw호출
		parentDisplayViewFunc(
		{
			_aElement : elements,
			_fCallback : function()
			{
				LEMP.MultiLayout.isRunCallback = true;
				LEMPMultiLayout.callbacks.forEach(function(value)
				{
					eval(value)();
				});
				LEMPMultiLayout.callbacks = [];
				LEMP.MultiLayout.isRunCallback = false;
				
				//커맨드처리를 위한 재귀함수
				function runCommand()
				{
					var cmd = undefined;
					
					if(LEMPMultiLayout.commandStack.length>0)
					{
						//쌓아둔 커맨드목록 중 첫번째 항목 선택
						cmd = LEMPMultiLayout.commandStack[0];
						LEMPMultiLayout.commandStack = LEMPMultiLayout.commandStack.splice(1);
						if(cmd.param && cmd.param.callback) // 콜백이 있는경우
						{
							var oriCallback = cmd.param.callback;
							var filterCallback = function(message)
							{
								LEMP.MultiLayout.isRunCallback = true;
								LEMPCore.CallbackManager.responser({ callback : oriCallback}, { message : message });
								LEMP.MultiLayout.isRunCallback = false;
								runCommand();
								
							};
							cmd.param.callback = LEMPCore.CallbackManager.save(filterCallback);
							LEMPCore.Module.gateway(cmd);
						}
						else LEMPCore.Module.gateway(cmd);
					}
				};
				runCommand();
			}
		});
	};
	window.page = 
	{
		init : function(json)
		{
			
		}
	};
	
	/**
	 *  MultiLayout Library 초기화.</br>
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
	 * @param Object  json MultiLayout 객체
	 *  
	 * @return 
	 */
	LEMPMultiLayout.init = function(json)
	{
		var layout = json ? json.LEMPLayout : undefined;
		LEMPMultiLayout.isPhone = LEMP.Device.Info.device_type === "Phone";
		if(layout)
		{
			// popup에 대한 opener등록
			if(layout.opener) LEMPMultiLayout.opener = layout.opener;
			$.extend(LEMPMultiLayout, layout);
			if(layout.callType)	LEMPMultiLayout[layout.callType].call(LEMPMultiLayout, json);
			// closure
			delete json.LEMPLayout;
		}
	};
	
		
	/**
	 *  MultiLayout Library Method명 정의.</br>
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
	LEMPMultiLayout.initAPI = function()
	{
		LEMP.MultiLayout = function(){};
		
		LEMP.MultiLayout.init = function(json)
		{
			LEMPMultiLayout.init(json.data);
		};
		
		LEMP.MultiLayout._getLayoutInfo = function(name)
		{
			return LEMPMultiLayout.layout[name];
		};
		
		LEMP.MultiLayout._broadcastReservs = function()
		{
			LEMPMultiLayout._broadcastReservs();
		};
		
		LEMP.MultiLayout._addCallback = function(callback)
		{
			LEMPMultiLayout.callbacks.push(callback);
		};
		
		LEMP.MultiLayout._displayView = function()
		{
			LEMPMultiLayout.displayView();
		};
		
		LEMP.MultiLayout._reservBroadcast = function(data)
		{
			LEMPMultiLayout._reservBroadcast(data);
		};
		
		// broadcast: 특정 frame이 전체 frame에게 data전달
		LEMP.MultiLayout.broadcast =function(data)
		{
			if(LEMPMultiLayout.isFrame())
			{
				LEMPMultiLayout.broadcast(data);
			}
		};
		
		// _dispatchEvent 가 event전달하기 위해 each frame에 broadcast
		LEMP.MultiLayout._dispatchEvent = function(event)
		{
			$("iframe[multiLayout]").each(function()
			{
				var eventName = event.type.split("LEMP.")[1];
				this.contentWindow.LEMPCore.EventManager.responser(
				{
					eventname : eventName
				},
				{
					message : event.data
				});
			});
		};
		
		var parentOpenPopupFunc = LEMP.Window.open;
		LEMP.MultiLayout.open = function(_sLayoutKey)
		{
			if(arguments[0] === undefined){ arguments[0] = {_sType : "normal"}; }
			
			var param = arguments[0];
			if(param._sType == "popup")
			{ 
				var required = new Array("_sPagePath");
				if(!LEMPCore.Module.checkparam(arguments[0], required)) { return; }
				
				if((param._sHeight && param._sHeight.indexOf("%") > 0) &&
						(param._sWidth && param._sWidth.indexOf("%") > 0) ){
					
					param = $.extend(true, {
						_sBaseOrientation : "auto",
						_sBaseSize : "device"
					}, param);
					
					var widthPercent = parseInt(param._sWidth.replace(/\%/,""));
					var heightPercent = parseInt(param._sHeight.replace(/\%/,""));
					
					if(param._sBaseSize == "page" && this.isFrame()){
						var frameName = LEMPMultiLayout.frameName;
						var frameWidth = parent.document[frameName].innerWidth;
						var frameHeight = parent.document[frameName].innerHeight;
						frameWidth = frameWidth*(widthPercent/100);
						frameHeight = frameHeight*(heightPercent/100);
						
						param._sWidth = Math.ceil(frameWidth);
						param._sHeight = Math.ceil(frameHeight);
					}
				}
				
				if(LEMPMultiLayout.frameName)
				{
					param._oMessage = $.extend(param._oMessage, 
					{
						LEMPLayout : 
						{
							opener : LEMPMultiLayout.frameName
						}
					});
				}
				parentOpenPopupFunc(param);
			}
			else 
			{ 
				var required = new Array("_sLayoutKey");
				if(!LEMPCore.Module.checkparam(arguments[0], required)) { return; }
				LEMPMultiLayout.open(param._sLayoutKey, param); 
			}
		};
		
		var parentCloseFunc = LEMP.Window.close; 
		var parentClosePopupFunc = LEMP.Window.close; 
		LEMP.MultiLayout.close = function() {
			
			if(arguments[0] == undefined){ arguments[0] = {_sType : "normal"}; }
			if(!LEMPCore.Module.checkparam(arguments[0])) {	return; }
			
			var param = arguments[0];
			if(param._sType == "popup")
			{
				var opener = LEMPMultiLayout.opener; 
				if(opener && param && param._sCallback) param._sCallback = "document." + opener + "." + param._sCallback;
				parentClosePopupFunc(param);
			}
			else
			{
				if(LEMPMultiLayout.interruptClose && LEMPMultiLayout.interruptClose.targetCallback===param._sCallback)
				{
					var frameName = LEMPMultiLayout.interruptClose.throwFrame;
					var frame = window.parent.document[frameName];
					if(frame)
					{
						var callbackFunc = frame[param._sCallback];
						if(callbackFunc) callbackFunc(param._oMessage);
					}
					else LEMPCore.Module.logger("MultiLayout", "close", "E", "LEMP.MultiLayout.close : can't find interrupt frame. frameName : " + frameName);
				}
				else
				{
					if( param && param._sCallback) {
						var opener = LEMPMultiLayout.opener; 
						if(opener) param._sCallback = "document." + opener + "." + param._sCallback;
					}
					parentCloseFunc(param);
				}
			}
		};
		
		// 원래 Gateway는 LEMPCoreGateWay에 저장
		var LEMPCoreGateWay = LEMPCore.Module.gateway; 
		LEMPCore.Module.gateway = function(message, service, action, serviceinfo)	{
			// 특정 cmd에 대해 별도 처리
			switch(message.id)	{
			case "RELOAD_WEB" :
			case "AUTH" :
			case "DISMISS_POPUP_VIEW" :
			case "POP_VIEW" :
			case "CHECK_PUSH_RECEIVED" :
			case "GET_MEDIA_PICK" :
			case "CAMERA_CAPTURE" :
			case "FILE_UPLOAD" :
				break;
			// POPUP
			default :
				var opener = LEMPMultiLayout.opener;
				if(opener && message.param && message.param.callback) message.param.callback = "document." + opener + "." + message.param.callback;
			}
			
			LEMPCoreGateWay.call(LEMPCore.Module, message, service, action, serviceinfo);
		}
	};
	
	
	
	// dom ready event에 대한 handler
	$(document).ready(function()
	{
		// API 선언
		LEMPMultiLayout.initAPI();
		// Frame인지 아닌지 여부
		if(LEMPMultiLayout.isFrame()) 
		{
			var param = location.href.split("?message=");
			if(param.length>1)
			{
				param = param[1]; 
				param = jQuery.parseJSON(decodeURIComponent(param));
			}
			else param = {};
			LEMPMultiLayout.initFrame(param.LEMPFrame);
			
			delete param.LEMPFrame;
			
			// Frame에 대한 onReady(MultiLayout이 주는 onReady이벤트)
			LEMPCore.EventManager.responser(
			{
				eventname : "onReady"
			},
			{
				message : param
			});
			
			for(var eventName in LEMPCore.EventManager.storage)
			{
				if(LEMPCore.EventManager.storage[eventName].length>0)
				{
					var hasDispatchEvent = !parent.LEMPCore.EventManager.storage[eventName].every(function(value)
					{
						// Event가 발생하면 mulilayout._dispatchEvent를 호출함, _dispatchEvent가 실제로 broadcast로 frame에 event 줌
						return value!=="LEMP.MultiLayout._dispatchEvent"; 
					});
					if(!hasDispatchEvent) { parent.LEMPCore.EventManager.storage[eventName].push("LEMP.MultiLayout._dispatchEvent"); } 
				}
				/*if(!parent.LEMPCore.EventManager.storage[eventName]["LEMP.MultiLayout.dispatchEvent"])
				{
					parent.LEMPCore.EventManager.storage[eventName]["LEMP.MultiLayout.dispatchEvent"] = function()
					{
						LEMPCore.EventManager.responser
						parent.LEMPCore.EventManager.storage[eventName].concat(LEMPCore.EventManager.storage[eventName]);
					}
				}*/
				 
			}
			
			$("iframe[name=" + LEMPMultiLayout.frameName + "]", window.parent.document).attr("isLoadMultiLayout", true);
			var isLoadMultiLayout=true;
			
			$("iframe", window.parent.document).each(function()
			{
				if(!$(this).attr("isLoadMultiLayout")) isLoadMultiLayout = false;
			});
			
			if(isLoadMultiLayout) 
			{
				// 전체가 다 로딩되면 _broadcastReservs()
				// _broadcastReservs(): reserve된 msg를 broadcast해주는 함수
				window.parent.LEMP.MultiLayout._broadcastReservs();
				parent.LEMPCore.EventManager.init();
			}
		}
	});
	
	LEMP.addEvent("beforeready", "LEMP.MultiLayout.init");
})();
