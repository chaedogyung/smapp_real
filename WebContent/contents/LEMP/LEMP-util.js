/**
 * 
 * 01.클래스 설명 : Util 클래스 .</br> 
 * 02.제품구분 : LEMP Util</br>
 * 03.기능(콤퍼넌트) 명 : Application 개발시 필요한 Util 기능 관련 클래스 </br>
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
LEMP.Util= function() {};

/**
 *Util 관련 클래스 로드용 무명함수.</br>
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
(function() {
	var CURRENT_PATH = location.pathname;
	var PATH_DEPTH = CURRENT_PATH.split("/");
	var PATHARR_IDX=PATH_DEPTH.length-2;
	var RELATE_DEPTH = "";
	
	for(var i=PATHARR_IDX; i > 0;i--){
		if(PATH_DEPTH[i] != "contents"){
			RELATE_DEPTH += "../"; 
		}else{
			break;
		}
	}
	/**
	 *Util 관련 Error 로깅.</br>
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
	LEMP._throwError = function(e)
	{
		LEMPCore.Module.logger("Util", "Util", "E", e);
		
		throw("throw - LEMP error. stop process");
	};
	/**
	 *Util 관련 Warning 로깅.</br>
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
	LEMP._warning = function(e)
	{
		LEMPCore.Module.logger("Util", "Util", "W", e);
	};
	
	/**
	 * 
	 * 01.클래스 설명 : LEMPRender 클래스 .</br> 
	 * 02.제품구분 : LEMP Util</br>
	 * 03.기능(콤퍼넌트) 명 : 화면 Data Rendering  </br>
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
	function LEMPRender()
	{ 
		this.options = {};
		this.template = undefined;
	};
	$.extend(LEMPRender.prototype, 
	{
		defaultOptions : 
		{
			clone : false, // 대상을 복사한 후 render 
			newId : "renderList", // 복사한 대상의 새로운 ID. clone이 true 일 때만 동작함 
			replace : true // true=기존 요소 대체. false=기존 요소에 추가 
		},
		TYPE_SINGLE : "single",
		TYPE_LOOP : "loop",
		instances : {},
		/**
		 * Render Class Instance 생성.</br>
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
		 * @param Object key Rendering 대상으로 선정한 Jquery Selector Object
		 *  
		 * @return Render Instance
		 */
		_getInstance:function(key)
		{
			if(!this.instances[key]) this.instances[key] = new this.constructor();
			return this.instances[key];
		},
		/**
		 * Render 실행.</br>
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
		 * @param Object target  Rendering 대상으로 선정한 Jquery Selector Object
		 * @param Object options  Rendering Option
		 *  
		 * @return 
		 */
		execute:function(target, options)
		{
			if(options)
			{
				switch(options.constructor)
				{
					case Object :
					case Array :
						this.render.apply(this, arguments);
						break;
					case String :
						this[options].apply(this, arguments);
						break;
				}
			}
		},
		/**
		 * 반복 데이터 Render 처리 .</br>
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
		 * @param Object parent  Rendering Templet Jquery Selector Object
		 * @param String target  반복할 대상 Rendering Element
		 * @param Array value  반복할 Data List
		 * @param Array value  반복할 Data Rendering 옵션 List
		 * @param Object value  Data Rendering시 표시할 옵션
		 *  
		 * @return Object parent Rendering된 Jquery Selector Object
		 */
		addLoopElement:function(parent, target, value, detail, condition)
		{
			var that = this;
			var template = $(target, parent).size()>1 ? $(target, that.template) : $(target, parent);
			var conditionFlag = false;
			if(template.size() == 0)	LEMP._warning("LEMPRender - invalid taret selector. target selector : " + target);
			if(condition && condition !== "")	{
				if(condition.constructor == String)	{
					if(Object.keys(value[0]).indexOf(condition) < 0)	{
						LEMP._warning("LEMPRender - The list has not the column name for condition. condition : " + condition);
					} else	{
						conditionFlag = true;
					}
				} else if(condition.constructor == Function)	{
					conditionFlag = true;
				} else	{
					LEMP._warning("LEMPRender - Please define condition value that is String or Function Type. condition : " + condition);
				}
			}
			
			var docfrag = document.createDocumentFragment();
			
			$.each(value, function(index, element)
			{
				var isRenderFlag = false;

				if(conditionFlag)	{
					if(that._checkCondition(condition, this, element))	isRenderFlag = true;
				} else	{
					isRenderFlag = true;
				}

				if(isRenderFlag)	{
					var target = template.clone(),
						targetParent = template.parent();
					
					//that.parseDir(target, this, detail, {index : index}, targetParent.get(0)).appendTo(template.parent());
					that.parseDir(target, this, detail, {index : index}, targetParent.get(0));					
					docfrag.appendChild(target.get(0));					
				}
			});
			
			template.parent().get(0).appendChild(docfrag);
			template.remove();
			return parent;
		},
		/**
		 * 데이터 Render시 조건 처리 .</br>
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
		 * @param Variable condition  Data Rendering시 표시 조건
		 * @param Object value  Data Rendering 전체 데이터
		 * @param Object item  Data Rendering 현재 위치 데이터 셋
		 *   
		 * @return boolean result 조건 체크결과
		 */
		_checkCondition:function(condition, value, row)	{
			var result = false, conditionValue;

			if(condition.constructor == String)		conditionValue = row[condition];
			else if(condition.constructor == Function)	conditionValue = condition({ context : value, item : row });

			if(conditionValue == true || conditionValue == "true"
				|| conditionValue == 1 || conditionValue == "Y"
				|| conditionValue == "y")	result = true;

			return result; 
		},
		/**
		 * 단건 데이터 Render 처리 .</br>
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
		 * @param Object parent  Rendering Templet Jquery Selector Object
		 * @param String target  반복할 대상 Rendering Element
		 * @param String valueType  Data Rendering 화면에 표시할 타입( text 또는 html )
		 * @param Variable value  Rendering Data
		 *  
		 * @return Object parent Rendering된 Jquery Selector Object
		 */
		addSingleElement:function(parent, target, valueType, value)
		{
			var that=this, realValue;
			realValue = value;
		
			//target의 마지막 값 저장
			var method = target.length > 0 ? target.substr(target.length-1, 1) : "";
			if(method=="+")
			{
				target = target.substring(0, target.length-1);
			}
			else method = "";
			
			var targetSplit = target.split("@");
			if (targetSplit.length < 3) 
			{
				
				var element;
				try { element = targetSplit[0] && targetSplit[0] != "."? $(targetSplit[0], parent) : $(parent); }
				catch (e)
				{
					LEMP._warning("LEMPRender - invalid taret selector. target selector : " + target);
					return;
				}
				if(element.size()==0) LEMP._warning("LEMPRender - target is empty. target : " + targetSplit[0]);  
				if (targetSplit.length == 2) 
				{
					if(!targetSplit[1]) 
					{
						LEMP._warning("LEMPRender - attr is null. attr : " + targetSplit[1] + "\ntarget :" + target);
						return;
					}
					switch (method)
					{
						case "+":
							if(element.attr(targetSplit[1])) realValue = element.attr(targetSplit[1]) + realValue; 
							break;
					}
					if(realValue && (realValue.constructor == Object || realValue.constructor == Array) ) element.data(targetSplit[1], realValue);  
					else element.attr(targetSplit[1], realValue);
				}
				else 
				{
					switch (method)
					{
						case "+":
							element[valueType](element.text() + realValue);
							break;
						default:
							element[valueType](realValue);
							break;
					}
				}
			}
			else {LEMP._warning("LEMPRender - syntax error. target : " + target + "(value : " + value + ")"); }
			return parent;
		},
		/**
		 * Render 설정 Parsing .</br>
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
		 * @param Object parent  Rendering 대상 Jquery Selector Object
		 * @param String data  Rendering 대상 Data Set
		 * @param Array paths  Rendering 설정 값
		 * @param Variable options  현재 데이터 셋의 위치값
		 * @param Object parentAboveOfParent  Rendering대상의 Parent Jquery Selector Object
		 *  
		 * @return Object parent Rendering된 Jquery Selector Object
		 */
		parseDir:function(parent, data, paths, options, parentAboveOfParent)
		{
			var that = this;
			$.each(paths, function(index,element)
			{
				if(!this.target) {LEMP._warning("LEMPRender - reference error. target : " + this.target + "(value : " + this.value + ")");}
				else if(!this.value) {LEMP._warning("LEMPRender - reference error. value : " + this.value + "(target : " + this.target + ")");}
				var valueType = this.valueType ? this.valueType : "text";
				var realValue;
				if (this.value.constructor == Function) 
				{
					var param =
					{
						context : that.data,
						item : data,
						element : {},
						parent : parent
					};
					if(options) param.index = options.index;
					
					var elementTarget = element.target,
						targetSplit = elementTarget.split("@");
					
					if(targetSplit.length < 3)	{
						var targetSelector = targetSplit[0];
						
						if(!targetSelector.length || targetSelector == ".")	{
							param.element = parent.get(0);
							param.parent = !parentAboveOfParent ? param.element.parentNode : parentAboveOfParent; 
						} else	{
							param.element = parent.find(targetSelector).get(0);
							param.parent = param.element.parentNode;
						}
					}
					
					realValue = this.value.apply(that, [param]);
					if(realValue==undefined) realValue = "";
				}
				else if(this.value==".") realValue = data;
				else 
				{
					realValue = eval("data." + this.value);
					if(realValue==undefined) LEMP._warning("LEMPRender - invalid value. value : " + this.value);
				}
				
				if(this.detail == undefined)	{
					if(this.value==undefined) {
						LEMP._warning("LEMPRender - reference error. value : " + this.value + "(target : " + this.target + ")");
					}
					
					that.addSingleElement(parent, this.target, valueType, realValue);
				} else	{
					that.addLoopElement(parent, this.target, realValue, this.detail, this.condition);
				}
				
//				switch(this.type)
//				{
//					case that.TYPE_SINGLE :
//						if(this.value==undefined) {LEMP._warning("LEMPRender - reference error. value : " + this.value + "(target : " + this.target + ")");}
//						that.addSingleElement(parent, this.target, valueType, realValue);
//						break;
//					case that.TYPE_LOOP :
//						if(this.detail==undefined) {LEMP._warning("LEMPRender - reference error. detail : " + this.detail + "(value :" + this.value + ")");}
//						that.addLoopElement(parent, this.target, realValue, this.detail, this.condition);
//						break;
//					default :
//						LEMP._warning("LEMPRender - unknown type. type : " + this.type);
//				}
			});
			return parent;
		},
		/**
		 *  Render 처리 .</br>
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
		 * @param Object root   Rendering대상의 Parent Jquery Selector Object
		 * @param String data  Rendering 대상 Data Set
		 * @param Array dir  Rendering 설정 값
		 * @param Object options  Rendering 옵션 값
		 *   
		 * @return 
		 */
		render:function(root, data, dir, options)
		{
			if(data==undefined ) { LEMP._throwError("LEMPRender - reference error. data : " + data);}
			if(data.constructor != Object && data.constructor != Array) {LEMP._throwError("LEMPRender - type error. data type : " + data.constructor);}
			if(dir==undefined) { LEMP._throwError("LEMPRender - reference error. dir : " + dir); }
			if(dir.constructor != Array) {LEMP._throwError("LEMPRender - type error. dir type : " + dir.constructor);}
			
			var that = this;
			that.data = data;
			that.template = root;
			that.options = $.extend(false, that.defaultOptions, options);
			
			var target;
			if(that.options.clone) target = root.clone();
			else target = root;	
			that.parseDir(target, data, dir);
				
			if(that.options.clone)
			{
				var newId = that.options.newId;
				var newBox = $("#" + newId);
				if(that.options.replace)
				{
					if(newBox.size()!=0) { newBox.empty();} 
				}
				if(newBox.size()>0 && newBox.parent().size()>0) newBox.append(target.children()); 
				else newBox = target.attr("id", newId).insertAfter(root);
			}
			target.show();
		},
		/**
		 * Render Class 초기화 .</br>
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
		 * @param Object options   Render Class 초기 설정값
		 *   
		 * @return 
		 */
		setDefaults:function(options)
		{
			$.extend(this.defaultOptions, options);
		}
	});
	/**
	 * 
	 * 01.클래스 설명 : LEMP Render 클래스 .</br> 
	 * 02.제품구분 : LEMP Util</br>
	 * 03.기능(콤퍼넌트) 명 : 사용자 서비스 NameSpace 클래스 </br>
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
	LEMP.Util.Render = new LEMPRender();		
	
	/**
	 * 
	 * 01.클래스 설명 : LEMP Number  클래스 .</br> 
	 * 02.제품구분 : LEMP Util</br>
	 * 03.기능(콤퍼넌트) 명 : Number Object 확장 기능 </br>
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
	function LEMPNumber(){};
	$.extend(LEMPNumber.prototype,
	{
		defaultOptions : 
		{
			"toNumber_digits" : undefined,
			"toNumber_default" : 0
		},
		
		/**
		 * 숫자로 변환.정수 및 소수 지원</br>
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
		 * @param Variable value   변환할 Data
		 * @param Object options   변환시 옵션
		 *   
		 * @return Number num 변환된 숫자
		 */
		toNumber:function(value, options)
		{
			
			var newOptions = {}; 
			for(key in options)
			{
				if(options.hasOwnProperty(key)) newOptions["toNumber_" + key] = options[key];
			}
			options = $.extend(false, this.defaultOptions, newOptions);
			var defaultNum = options["toNumber_default"];
		
			if(value == undefined || value == "") return defaultNum;
			if(value.constructor!=String && value.constructor!=Number) LEMP._throwError("LEMPNumber - type error. value type : " + value.constructor);
			
			var num;
			switch(value.constructor)
			{
				case Number :
					num = value;
					break;
				case String :
					var sign="";
					var decimal="";
					var numSplit = value.split(".");
					if(numSplit.length == 2) 
					{
						num = numSplit[0];
						decimal = numSplit[1];
					}
					else num = value;
					
					if(num.length>1) 
					{
						sign = num.substring(0,1);
						if(sign!="-" && sign!="+") sign="";
						else num=num.substring(1,num.length);
					}  
					
					num = num.replace(/[^0-9]/gi, "");
					if(decimal == undefined) decimal = ""; 
					decimal = decimal.replace(/[^0-9]/gi, "");
					
					if(decimal!="") num = [num, decimal].join(".");
					num = Number(sign+num);
					break;
				default :
					return defaultNum;
			}
			
			for(key in options)
			{
				if(options.hasOwnProperty(key))
				{
					switch(key)
					{
					case "toNumber_digits" :
						var digits = options[key];
						
						if (digits >= 0) num = parseFloat(num.toFixed(digits)); // 소수부 반올림
						else
						{
							var fixdigits = Math.pow(10, Math.abs(digits));
							digits = Math.pow(10, digits); // 정수부 반올림
							num = Number(Math.round(num * digits).toFixed(0))*fixdigits;
						}
						break;
					}
				}
			}
			return num;
		},
		/**
		 * 숫자를 한글로 변환</br>
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
		 * @param Variable value   변환할 Data
		 *   
		 * @return String result 변환된 한글
		 */
		toKor:function(value)
		{
			if(value==undefined) return "";
			if(value.constructor!=String && value.constructor!=Number) LEMP._throwError("LEMPNumber - type error. value type : " + value.constructor);
			var str = value.LPToStr();
			unit1 = new Array("", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구");
			unit2 = new Array("십", "백", "천");
			unit3 = new Array("만", "억", "조");

			var length = str.length;
			var result = "";
			for (var i = 0; i < length; i++) 
			{
				var num = str.substring(i, i + 1);
				if(isNaN(num)) { console.log("(warning)LEMPNumber - invaild value : " + value); return ""; }
				num = num.LPToNumber();
				result += unit1[num];// 숫자를 한글로 변환
				if (num != 0 && (length - 1) != i)  // 숫자가 0이면 한글로 변환하지 않음. 마지막 숫자에는 단위를 붙이지 않음
				{
					// 십,백,천 단위
					switch(str.substring(0, (length - i)).length % 4)
					{
					case 0 :
						result += unit2[2];
						break;
					case 3 :
						result += unit2[1];
						break;
					case 2 :
						result += unit2[0];
						break;
					}
				}

				// 만 ,억,조 단위
				switch(length-i)
				{
				case 5 : // 만
					result += unit3[0];
					break;
				case 9 : // 억
					result += unit3[1];
					break;
				case 13 : // 조
					result += unit3[2];
					break;
				}
			}
			return result;
		}
	});
	/**
	 * 
	 * 01.클래스 설명 : LEMP Number 클래스 .</br> 
	 * 02.제품구분 : LEMP Util</br>
	 * 03.기능(콤퍼넌트) 명 : 사용자 서비스 NameSpace 클래스 </br>
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
	LEMP.Util.Number = new LEMPNumber();
	
	/**
	 * 
	 * 01.클래스 설명 : LEMP Array 클래스 .</br> 
	 * 02.제품구분 : LEMP Util</br>
	 * 03.기능(콤퍼넌트) 명 : Array Object 확장 기능 </br>
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
	function LEMPArray()
	{
	};
	$.extend(LEMPArray.prototype,
	{
		/**
		 * Array내 특정 위치 데이터 삭제</br>
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
		 * @param Array value   변환할 Data
		 * @param Array index   변환할 Data의 index
		 *   
		 * @return Array newArr 삭제된 후 Array
		 */
		RemoveAt:function(value, index)
		{
			if(value.length == 0) return value;
			if(index > value.length) LEMP._throwError("LEMPString - Array Index out of bounds. index : " + index);;
			
			var newArr = value.slice(0,index).concat(value.slice(index+1));
			
			return newArr; 
		}
	});
	/**
	 * 
	 * 01.클래스 설명 : LEMP Array 클래스 .</br> 
	 * 02.제품구분 : LEMP Util</br>
	 * 03.기능(콤퍼넌트) 명 : 사용자 서비스 NameSpace 클래스 </br>
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
	LEMP.Util.Array = new LEMPArray();
	
	/**
	 * 
	 * 01.클래스 설명 : LEMP String 클래스 .</br> 
	 * 02.제품구분 : LEMP Util</br>
	 * 03.기능(콤퍼넌트) 명 : Array Object 확장 기능 </br>
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
	function LEMPString()
	{
	};
	$.extend(LEMPString.prototype,
	{
		REGION_FORMATS : 
		{
			"kr" : "{0} 원"
		},
		defaultOptions : 
		{
			"toStr_default" : "",
			"toFixLength_fillChar" : " ",
			"toFixLength_fillDirection" : "right",
			"toFormatPhone_delim" : "-"
		},
		
		/**
		 * Array내 특정 위치 데이터 삭제</br>
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
		 * @param Variable value   변환할 Data
		 * @param Object options   변환시 옵션
		 *   
		 * @return String value 변환된 String
		 */
		toStr:function(value, options)
		{
			var newOptions = {}; 
			for(key in options)
			{
				if(options.hasOwnProperty(key)) newOptions["toStr_" + key] = options[key];
			}
			options = $.extend(false, this.defaultOptions, newOptions);
			var defaultStr = options["toStr_default"];
			if(!value) return defaultStr;
			switch(value.constructor)
			{
				case String :
					return value;
				case Object :
				case Array :
					return JSON.stringify(value);
				default :
					return String(value);
			}
		},
		/**
		 * 왼쪽기준으로 문자열 자르기</br>
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
		 * @param Variable value   변환할 Data
		 * @param Number length   자를 자리수
		 *   
		 * @return String value 변환된 String
		 */
		leftSubstr:function(value, length){
			if(!length) LEMP._throwError("LEMPString - reference error. length : " + length);
			value = this.toStr(value);
			if(length <= 0){
				return "";
			}else if(length > value.length){
				return str;
			}else{
				return value.substring(0,length);
			}
		},
		/**
		 * 오른쪽기준으로 문자열 자르기</br>
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
		 * @param Variable value   변환할 Data
		 * @param Number length   자를 자리수
		 *   
		 * @return String value 변환된 String
		 */
		rightSubstr:function(value,length){
			if(!length) LEMP._throwError("LEMPString - reference error. length : " + length);
			value = this.toStr(value);
			if(length <= 0){
				return "";
			}else if(length > value.length){
				return str;
			}else{
				return value.substring(value.length,value.length-length);
			}
		},
		/**
		 * 일정 길이로 문자열 만들기</br>
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
		 * @param Variable value   변환할 Data
		 * @param Number length   고정 자리수
		 * @param Number length   변환 옵션
		 *   
		 * @return String value 변환된 String
		 */
		toFixLength:function(value, length, options) {
			if(!length) LEMP._throwError("LEMPString - reference error. length : " + length);
			var newOptions = {}; 
			for(key in options)
			{
				if(options.hasOwnProperty(key))	newOptions["toFixLength_" + key] = options[key];
			}
			newOptions = $.extend(false, this.defaultOptions, newOptions);
			
			var fill = newOptions.toFixLength_fillChar;
			var str = this.toStr(value);
			var padding = length - str.length;
			if(padding < 0) {
				str = newOptions.toFixLength_fillDirection=="right" ? str.substr(str.length-length) : str.substr(0,-padding);
			} else {
				for(var n=0; n<padding; n++) str = newOptions.toFixLength_fillDirection=="right" ? str + fill : fill + str;
			}
			return str;
		},
		/**
		 * 특정 포맷으로 문자열 만들기</br>
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
		 * @param Variable values   변환할 Data
		 * @param String format   변환 포맷
		 *   
		 * @return String value 변환된 String
		 */
		toFormatString:function(format, values)
		{
			var str = format;
			switch(values.constructor)
			{
			   case String :
				   values = [values];
				   break;
			}

			var count = values.length;
			var strPattern = "";
			for(var i=0; i<count; i++) {
				
				if (values[i] == null || values[i] == undefined ) continue;
				
				strPattern = "\\{"+ i + "\\}";
				strPattern = new RegExp(strPattern,"g");
				str = str.replace(strPattern, values[i]);
			}
			return str;
		},
		
		/**
		 * 문자열이나 숫자를 통화타입으로 변환</br>
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
		 * @param Variable values   변환할 Data
		 *   
		 * @return String value 변환된 String
		 */
		toCommaNumber:function(value)
		{
			var strNum = this.toStr(value).replace(/[^0-9.-]/gi, "") + "";
			var sign="";
			var decimal="";
			
			var numSplit = strNum.split(".");
			
			if(numSplit.length == 2) 
			{
				strNum = numSplit[0];
				decimal = numSplit[1];
			}
			if(strNum.length>1 && (strNum.substring(0,1))) 
			{
				sign = strNum.substring(0,1);
				if(sign!="-" && sign!="+") sign="";
				else strNum=strNum.substring(1,strNum.length);
			}  
			
			var splitPoint = strNum.length%3 != 0 ? strNum.length%3 : 3;
			var firstNum = strNum.substring(0, splitPoint);
			var elseNum =  strNum.substring(splitPoint);
			var won = firstNum + elseNum.replace(/([0-9]{3})/g,",$1");
			if(decimal!="") decimal= "." + decimal;
			
			return sign + won + decimal;		
		},
		/**
		 * 전화 번호 타입으로 변환</br>
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
		 * @param Variable values   변환할 Data
		 * @param String delim   번호 구분자
		 *   
		 * @return String value 변환된 String
		 */
		toFormatPhone:function(value, delim)
		{
			if(!delim) delim = this.defaultOptions.toFormatPhone_delim; 
			var str = this.toStr(value);
			var pt = /^(01\d{1}|02|0505|0506|0502|0\d{1,2})-?(\d{3,4})-?(\d{4})$/g;
			return str.replace(/^\s+|\s+$/g, "").replace(pt, "$1" +delim+ "$2" +delim+ "$3");
		},
		/**
		 * 한글 초성 추출</br>
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
		 * @param Variable values   변환할 Data
		 *   
		 * @return String value 추출된 String
		 */
		toChoSung:function(value) 
		{ 
			var str = this.toStr(value);
			var ChoSung   = [ 0x3131, 0x3132, 0x3134, 0x3137, 0x3138, 0x3139, 0x3141, 0x3142, 0x3143, 0x3145, 0x3146, 0x3147, 0x3148, 0x3149, 0x314a, 0x314b, 0x314c, 0x314d, 0x314e ];
								// ㅏ	  ㅐ	  ㅑ	  ㅒ	  ㅓ	  ㅔ	  ㅕ	  ㅖ	  ㅗ	  ㅘ	  ㅙ	  ㅚ	  ㅛ	  ㅜ	  ㅝ	  ㅞ	  ㅟ	  ㅠ	  ㅡ	  ㅢ	  ㅣ
			var JwungSung = [ 0x314f, 0x3150, 0x3151, 0x3152, 0x3153, 0x3154, 0x3155, 0x3156, 0x3157, 0x3158, 0x3159, 0x315a, 0x315b, 0x315c, 0x315d, 0x315e, 0x315f, 0x3160, 0x3161, 0x3162, 0x3163 ];
								//		 ㄱ	  ㄲ	  ㄳ	  ㄴ	  ㄵ	  ㄶ	  ㄷ	  ㄹ	  ㄺ	  ㄻ	  ㄼ	  ㄽ	  ㄾ	  ㄿ	  ㅀ	  ㅁ	  ㅂ	  ㅄ	  ㅅ	  ㅆ	  ㅇ	  ㅈ	  ㅊ	  ㅋ	  ㅌ	  ㅍ	  ㅎ
			var JongSung  = [ 0,	  0x3131, 0x3132, 0x3133, 0x3134, 0x3135, 0x3136, 0x3137, 0x3139, 0x313a, 0x313b, 0x313c, 0x313d, 0x313e, 0x313f, 0x3140, 0x3141, 0x3142, 0x3144, 0x3145, 0x3146, 0x3147, 0x3148, 0x314a, 0x314b, 0x314c, 0x314d, 0x314e ];

			//var choSung = ["ㄱ","ㄴ","ㄷ","ㄹ","ㅁ","ㅂ","ㅅ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ",]		
			
			var a, b, c; // 자소 버퍼: 초성/중성/종성 순
			var ch;
			var result = "";
			for (var i = 0; i < str.length; i++) {
				ch = str.charCodeAt(i);
				if (ch >= 0xAC00 && ch <= 0xD7A3) { // "AC00:가" ~ "D7A3:힣" 에 속한 글자면 분해
					c = ch - 0xAC00;
					a = parseInt(c / (21 * 28));
					c = parseInt(c % (21 * 28));
					b = parseInt(c / 28);
					c = parseInt(c % 28);
					//result = result + ChoSung[a] + JwungSung[b];
					//if (c != 0) result = result + JongSung[c] ; // c가 0이 아니면, 즉 받침이 있으면
					result = result + String.fromCharCode(ChoSung[a]);
				} else {
					result = result + String.fromCharCode(ch);
			  }
			}
			return result;
		},
		/**
		 * 국가 단위 화폐 변환</br>
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
		 * @param Variable values   변환할 Data
		 * @param String code   국가코드
		 * @param String type   변환 타입
		 *   
		 * @return String value 변경된 String
		 */
		toRegionMoney:function(value, code, type)
		{
			if(!code) LEMP._throwError("LEMPString - reference error. code : " + code);
			value = this.toStr(value);
			
			var format = this.REGION_FORMATS[code];
			if(type == "code") {format = "\\ {0}";}
			
			
			if(!format) LEMP._throwError("LEMPString - unknown code");
			return this.toFormatString(format, value);
		},
		/**
		 * 파일 사이즈 변환</br>
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
		 * @param Variable values   bytes용량 Data
		 * @param String fUnit   변환 단위
		 *   
		 * @return String value 변경된 String
		 */
		toFileSizeUnit : function(bytes, fUnit) {
	 		bytes = parseInt(bytes);
			var s = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
			var e = $.inArray(fUnit, s);
			
			if(e < 0){
				e =Math.floor(Math.log(bytes)/Math.log(1024));
			}
			
			if(e == "-Infinity") return "0 "+s[0];
			else return (bytes/Math.pow(1024, Math.floor(e))).toFixed(2)+" "+s[e];
			
		} ,
		/**
		 * String Util 초기화</br>
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
		 * @param Object options  초기화 옵션
		 * 		 *   
		 * @return 
		 */
		setDefaults:function(options)
		{
			$.extend(this.defaultOptions, options);
		},
		/**
		 * 시작 문자열 확인</br>
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
		 * @param String value   기준 Data
		 * @param String str   비교 Data
		 *   
		 * @return boolean value 비교 결과
		 */
		startsWith : function (value, str){
			return value.slice(0, str.length) == str;
		},
		/**
		 * 종료 문자열 확인</br>
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
		 * @param String value   기준 Data
		 * @param String str   비교 Data
		 *   
		 * @return boolean value 비교 결과
		 */
		endsWith : function (value, str){
			return value.slice(-str.length) == str;
		},
		/**
		 * 문자열 포함여부 확인</br>
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
		 * @param String value   기준 Data
		 * @param String str   비교 Data
		 *   
		 * @return boolean value 비교 결과
		 */
		includes : function(value, str)	{
			return value.indexOf(str) !== -1;
		}
	});
	/**
	 * 
	 * 01.클래스 설명 : LEMP Render 클래스 .</br> 
	 * 02.제품구분 : LEMP Util</br>
	 * 03.기능(콤퍼넌트) 명 : 사용자 서비스 NameSpace 클래스 </br>
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
	LEMP.Util.String = new LEMPString();
	
	/**
	 * 
	 * 01.클래스 설명 : LEMP Date 클래스 .</br> 
	 * 02.제품구분 : LEMP Util</br>
	 * 03.기능(콤퍼넌트) 명 : Date 처리 기능 </br>
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
	function LEMPDate(){};
	$.extend(LEMPDate.prototype,
	{
		WEEK_NAMES : ["일","월","화","수","목","금","토"],
		WEEK_DETAIL_NAMES : ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"],
		defaultOptions:
		{
			"toFormatDate_format" : "yyyy-mm-dd"
		},
		/**
		 * 날짜형으로 변환</br>
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
		 * @param String value   변환 Data
		 *    
		 * @return Date value 변환후 Data
		 */
		toDate:function(value)
		{
			if(!value) LEMP._throwError("LEMPDate - reference error. value : " + value);
			if(value.constructor!=Date&&value.constructor!=String) LEMP._throwError("LEMPDate - type error. value type: " + value.constructor);
			
			if(value instanceof Date) date = value; 
			else if(value.constructor==String)
			{
				var strDate = value;
				strDate=strDate.replace(/([^0-9])/g,"");
				if(strDate.length<5){
					LEMP._throwError("LEMPDate - reference error. not enough value length. value : " + strDate);
				}else if(strDate.length==5){
					if(strDate.substring(4,5)=="0"){
						LEMP._throwError("LEMPDate - reference error. value string index 5 is out of range(1~9). value : " + strDate.substring(4,5));
					}else {
						date = new Date(Number(strDate.substring(0,4)),Number("0"+strDate.substring(4,5))-1);
					}					
				}
				else if(strDate.length==6) date = new Date(Number(strDate.substring(0,4)),Number(strDate.substring(4,6))-1);
				else if(strDate.length==8) date = new Date(Date.UTC(Number(strDate.substring(0,4)),Number(strDate.substring(4,6))-1,Number(strDate.substring(6,8)), -9));
				else if(strDate.length==14) date = new Date(Number(strDate.substring(0,4)),Number(strDate.substring(4,6))-1,Number(strDate.substring(6,8)), Number(strDate.substring(8,10)), Number(strDate.substring(10,12)), Number(strDate.substring(12,14)));
				else date = new Date();
			}
			return date;
		},
	
		/**
		 * 날짜간격구하기</br>
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
		 * @param Date startdate   시작일
		 * @param Date enddate   종료일
		 *    
		 * @return number value 날짜간 차이
		 */
		diff:function(startdate, enddate) { 
			if(!startdate || !enddate) LEMP._throwError("LEMPDate - reference error. startdate : " + startdate + ", enddate : " + enddate);
			if(startdate.constructor!=String&&startdate.constructor!=Date ) LEMP._throwError("LEMPDate - type error. startdate type: " + value.constructor);
			if(startdate.constructor!=enddate.constructor) LEMP._throwError("LEMPDate - different type. startdate type : " + startdate.constructor + ", enddate type : " + enddate.constructor);
			
			var start,end;
			if(startdate.constructor==String)
			{
				try
				{
					var start = this.toDate(startdate);
					var end = this.toDate(enddate);
				}
				catch(e)
				{
					LEMP._throwError("LEMPDate - invalid date format. startdate : " + startdate + ", enddate : " + enddate);
				}
			}
			else if(startdate.constructor==Date)
			{
				start = startdate; 
				end = enddate;
			}
			var diff = end.getTime() - start.getTime();
			diff = diff/(1000 * 60 * 60 * 24);
			return diff;
		},
		/**
		 * 연도 더하기</br>
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
		 * @param Date value   기준 일자
		 * @param Number year   더할 년
		 *    
		 * @return Date value 연산결과 날짜
		 */
		addYear:function(value, year)
		{
			if(!year) LEMP._throwError("LEMPDate - reference error. year : " + year);
			if(year.constructor!=Number) LEMP._throwError("LEMPDate - type error. year type : " + year.constructor);
			value.setYear(value.getFullYear()+year);
			return value;
		},
		/**
		 * 월 더하기</br>
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
		 * @param Date value   기준 일자
		 * @param Number month   더할 월
		 *    
		 * @return Date value 연산결과 날짜
		 */
		addMonth:function(value, month)
		{
			if(!month) LEMP._throwError("LEMPDate - reference error. month : " + month);
			if(month.constructor!=Number) LEMP._throwError("LEMPDate - type error. month type : " + month.constructor);
			value.setMonth(value.getMonth()+month);
			return value;
		},
		/**
		 * 일 더하기</br>
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
		 * @param Date value   기준 일자
		 * @param Number day   더할 월
		 *    
		 * @return Date value 연산결과 날짜
		 */
		addDay:function(value, day)
		{
			if(!day) LEMP._throwError("LEMPDate - reference error. date : " + day);
			if(day.constructor!=Number) LEMP._throwError("LEMPDate - type error. date type : " + day.constructor);
			value.setDate(value.getDate()+day);
			return value;
		},
		/**
		 * 다음날 구하기</br>
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
		 * @param Date value   기준 일자
		 * 
		 *    
		 * @return Date value 연산결과 날짜
		 */
		nextDay:function(value)
		{
			value.setDate(value.getDate()+1);
			return value;
		},
		/**
		 * 다음달 구하기</br>
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
		 * @param Date value   기준 일자
		 * 
		 *    
		 * @return Date value 연산결과 날짜
		 */
		nextMonth:function(value)
		{
			var thisMonth = value.getMonth();
			value.setMonth(thisMonth+1);
			
			if(value.getMonth() != thisMonth+1 && value.getMonth() != 0)
			value.setDate(0);
			
			return value;
		},
		/**
		 * 다음년 구하기</br>
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
		 * @param Date value   기준 일자
		 * 
		 *    
		 * @return Date value 연산결과 날짜
		 */
		nextYear:function(value)
		{
			value.setYear(value.getFullYear()+1);
			return value;
		},
		/**
		 * 이전일 구하기</br>
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
		 * @param Date value   기준 일자
		 * 
		 *    
		 * @return Date value 연산결과 날짜
		 */
		previousDay:function(value)
		{
			value.setDate(value.getDate()-1);
			return value;
		},
		/**
		 * 이전달 구하기</br>
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
		 * @param Date value   기준 일자
		 * 
		 *    
		 * @return Date value 연산결과 날짜
		 */
		previousMonth:function(value)
		{
			var thisMonth = value.getMonth();
			value.setMonth(thisMonth-1);
			
			if(value.getMonth() != thisMonth-1 && (value.getMonth() != 11 || (thisMonth == 11 && value.getDate() == 1)))
			value.setDate(0);
			
			return value;
		},
		/**
		 * 이전년 구하기</br>
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
		 * @param Date value   기준 일자
		 * 
		 *    
		 * @return Date value 연산결과 날짜
		 */
		previousYear:function(value)
		{
			value.setYear(value.getFullYear()-1);
			return value;
		},
		/**
		 * 이달 마지막 날 구하기</br>
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
		 * @param Date value   기준 일자
		 * 
		 *    
		 * @return Date value 연산결과 날짜
		 */
		lastDay:function(value)
		{
			var date = new Date(value);
			date.setMonth(date.getMonth()+1);
			date.setDate(0);
			return date.getDate();
		},
		/**
		 * 특정 포팻으로 날짜 표시하기</br>
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
		 * @param Date value   기준 일자
		 * @param String format   특정 포맷
		 * 
		 *    
		 * @return String value 변환 결과
		 */
		toFormatDate:function(value,format)
		{
			if(!format) format = this.defaultOptions.toFormatDate_format;
			var that = this;
			if(!value) {LEMP._warning("LEMPDate - reference error. value : " + value);  return "";}
			else if(!(value instanceof Date))
			{
				if(value.constructor!=String) { LEMP._warning("LEMPDate - type error. value type : " + value.constructor); return ""; }
				if(!(value.length==5 || value.length==6 || value.length==8 || value.length==14)) { LEMP._warning("LEMPDate - invalid value. value : " + value); return ""; }
			}
			
			var d = this.toDate(value);
			
			return format.replace(/(yyyy|yy|mm|m|dd|d|www|w|hh|h|HH|H|nn|n|ss|s|a\/p)/gi, 
				function($1)
				{
					switch ($1)
					{	
						case 'yyyy': return d.getFullYear();
						case 'yy': return d.getFullYear().LPToFixLength(2,{"fillChar" : "0"});
						case 'mm': 	return (d.getMonth() + 1).LPToFixLength(2,{"fillChar" : "0", "fillDirection" : "left"});			
						case 'm': 	return (d.getMonth() + 1);			
						case 'w': 	return that.WEEK_NAMES[d.getDay()];			
						case 'www': return that.WEEK_DETAIL_NAMES[d.getDay()];			
						case 'dd':   return d.getDate().LPToFixLength(2,{"fillChar" : "0", "fillDirection" : "left"});			
						case 'd':   return d.getDate();			
						case 'hh':   return ((h = d.getHours() % 12) ? h : 12).LPToFixLength(2,{"fillChar" : "0", "fillDirection" : "left"});			
						case 'h':   return ((h = d.getHours() % 12) ? h : 12);			
						case 'HH':   return d.getHours().LPToFixLength(2,{"fillChar" : "0", "fillDirection" : "left"});			
						case 'H':   return d.getHours();			
						case 'nn':   return d.getMinutes().LPToFixLength(2,{"fillChar" : "0", "fillDirection" : "left"});			
						case 'n':   return d.getMinutes();			
						case 'ss':   return d.getSeconds().LPToFixLength(2,{"fillChar" : "0", "fillDirection" : "left"});			
						case 's':   return d.getSeconds();			
						case 'a/p':  return d.getHours() < 12 ? 'a' : 'p';			
					}	   
				}
			);
		},
		/**
		 * 현재 일자가 해당 월의 몇 번째 주인지를 반환</br>
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
		 * @param Date value   기준 일자
		 * 	 * 
		 *    
		 * @return Number result 주수
		 */
		getWeeksOfMonth:function(value)
		{
			var stdDate = new Date(value),
				stdDay = new Date(stdDate.getFullYear(), stdDate.getMonth(), 1).getDay(),
				date = stdDate.getDate(),
				result = Math.ceil((date + stdDay) / 7);

			return result;
		},
		/**
		 * 현재 일자가 해당 년도의 몇 번째 주인지를 반환</br>
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
		 * @param Date value   기준 일자
		 * 	 * 
		 *    
		 * @return Number result 주수
		 */
		getWeeksOfYear:function(value)
		{
			var stdDate = new Date(value),
				month = stdDate.getMonth(),
				date = stdDate.getDate(),
				fDay = new Date(stdDate.getFullYear(), 0, 1).getDay(),
				tempDate,
				result = 0;

			for(var m=0; m<month; m++) {
				tempDate = new Date(stdDate.getFullYear(), m + 1, 0);
				result += tempDate.getDate();
			}

			result = Math.ceil((result + date + fDay) / 7);

			return result;
		},
		/**
		 * 현재 일자가 해당 월의 몇 번째 주인지를 반환</br>
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
		 * @param Date value   기준 일자
		 * 	 * 
		 *    
		 * @return Number result 주수
		 */
		getStartEndWeek:function(value)
		{
			var stdDate = new Date(value),
				date = stdDate.getDate(),
				day = stdDate.getDay(),
				startDate = new Date(value),
				endDate = new Date(value),
				result = [];

			startDate.setDate(date - day);
			endDate.setDate(date + 6 - day);
			result.push(startDate);
			result.push(endDate);

			return result;
		},
		/**
		 * Date Class 초기화</br>
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
		 * @param Object options   초기화 옵션값
		 * 	 * 
		 *    
		 * @return Number result 주수
		 */
		setDefaults:function(options)
		{
			$.extend(this.defaultOptions, options);
		}
	});
	/**
	 * 
	 * 01.클래스 설명 : LEMP Date 클래스 .</br> 
	 * 02.제품구분 : LEMP Util</br>
	 * 03.기능(콤퍼넌트) 명 : 사용자 서비스 NameSpace 클래스 </br>
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
	LEMP.Util.Date = new LEMPDate();
	
	/**
	 * 
	 * 01.클래스 설명 : LEMP Resource 클래스 .</br> 
	 * 02.제품구분 : LEMP Util</br>
	 * 03.기능(콤퍼넌트) 명 : 전문 JSON파일 컨트롤 기능 </br>
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
	function LEMPResource(){}
	LEMPResource.prototype.getString = function(key, locale){};
	LEMPResource.prototype.getAllString = function(){};
	LEMPResource.prototype.getTr = function(group, trcode, extendValue){};
	LEMPResource.prototype.getHeader = function(name){};
	LEMPResource.prototype.getResource = function(filepath, filename){};
	
	$.extend(LEMPResource.prototype, 
	{
		STRING_PATH : RELATE_DEPTH+"LEMP/message/res/",
		TR_PATH : RELATE_DEPTH+"LEMP/message/",
		TR_HEADER_PATH : "header/",
		SPEC_CHARS : 
		{
			"INCLUDE_HEADER" : "@",
			"REPLACE_STRING" : "="
		},
		/**
		 * JSON 파일 읽기</br>
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
		 * @param String filepath   JSON File Path
		 * 	@param String filename   JSON File Name
		 *    
		 * @return Object result 읽은JSON 객체
		 */
		getResource:function(filepath, filename)
		{
			var path;
			if(arguments.length>1){
				if(!filepath) LEMP._throwError("LEMPResource - reference error. A file path is required. : " + filepath);
				if(filepath.constructor!=String) LEMP._throwError("LEMPResource - type error. file path type : " + filepath.constructor);
				path = RELATE_DEPTH + "/" + filepath + "/" +filename;
			}else {
				filename = arguments[0];
				path = this.STRING_PATH+filename;
			}			
			
			if(!filename) LEMP._throwError("LEMPResource - reference error. A file name is required. : " + filename);									
			if(filename.constructor!=String) LEMP._throwError("LEMPResource - type error. file name type : " + filename.constructor);												
			
			var result=this._readJson(path);
			return result;
		},
		/**
		 * string JSON 파일내 특정 Property 읽기</br>
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
		 * @param String key   JSON 객체 key
		 * 	@param String locale  국가코드
		 *    
		 * @return Object result 읽은JSON 객체
		 */
		getString:function(key, locale)
		{
			if(!key) LEMP._throwError("LEMPResource - reference error. key : " + key);
			if(key.constructor!=String) LEMP._throwError("LEMPResource - type error. key type : " + key.constructor);
			var str = "";
			var result = this.getAllString(locale);
			console.log(JSON.stringify(result));
			var keySplit = key.split(".");
			keySplit.forEach(function(value)
			{
				result = result[value];
			});
			
			if (result) 
			{
				if (result.constructor == String) 
				{
					var otherArgs = Array.prototype.slice.call(arguments, 1);
					if(otherArgs.length>0) str = LEMP.Util.String.toFormatString.apply(LEMP.Util.String, [result].concat(otherArgs));
					else str = result;
				} else LEMP._throwError("LEMPResource - type error. Result is not String : " + result.constructor);
			} else LEMP._throwError("LEMPResource - invalid key. key : " + key);
			return str;
		},
		/**
		 * string JSON 파일 전체 데이터 읽기</br>
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
		 * @param String reqlocale  국가코드
		 *    
		 * @return Object result 읽은JSON 객체
		 */
		getAllString:function(reqlocale)
		{
			var Locale = "";
			var filename = "string";
			
			if(reqlocale) Locale = reqlocale;
			else {
				if(!LEMP.Device.Info.locale)	Locale = "ko"
				else	Locale = LEMP.Device.Info.locale.LPLeftSubstr(2);
			}
			
			switch(Locale)
			{
				case "ko" :
					filename = filename+".json";
					break;
				case undefined :
					filename = filename+".json";
					break;
				default : 
					filename = filename + "_" + Locale + ".json";
			}
			
			var path = this.STRING_PATH+filename;
			
			var result=this._readJson(path);
			return result;
		},
		/**
		 * 전문 JSON 파일 읽기</br>
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
		 * @param String group 전문 폴더명
		 * @param String trcode 전문 코드
		 * @param Object extendValue 전문 추가 값
		 *    
		 * @return Object result 읽은JSON 객체
		 */
		getTr:function(group, trcode, extendValue)
		{
			if(!group) LEMP._throwError("LEMPResource - reference error. group : " + group);
			if(group.constructor!=String) LEMP._throwError("LEMPResource - type error. group type : " + group.constructor);
			if(!trcode) LEMP._throwError("LEMPResource - reference error. trcode : " + trcode);
			if(trcode.constructor!=String) LEMP._throwError("LEMPResource - type error. trcode type : " + trcode.constructor);
			
			var result = undefined;
			var that = this;
			if(group) this.groupPath = group + "/";
			var path = this.TR_PATH + this.groupPath + trcode + ".json";
			
			var data = this._readJson(path);
			
			var header;
			if(data && data.header) 
			{
				header =data.header;
				try{var header = $.extend(that._replaceSpecStr(header), {"trcode" : trcode}); }
				catch(e)
				{
					LEMP._throwError("LEMPResource - JSON syntax error. header : " + header);
				}
				result = $.extend(data, {"header" : header});
			}
			else result=data;
						
			$.extend(true, result, extendValue);
			if(result && result.header) 
			{
				var now = new Date();
				result.header.trId = result.header.trcode + "_" +
					LEMP.Util.Date.toFormatDate(now,"yyyymmddhhnnss") + (now.getMilliseconds().LPToFixLength(3,{"fillChar" : "0", "fillDirection" : "left"})) + "_" + 
					Math.floor(Math.random()*1000).LPToFixLength(3,{"fillChar" : "0"});
			}
			return result;
		},
		/**
		 * 전문 JSON 파일 Header 읽기</br>
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
		 * @param String name 전문 코드
		 *    
		 * @return Object result 읽은JSON 객체
		 */
		getHeader:function(name)
		{
			var result;
			var that = this;
			var path = this.TR_PATH + this.groupPath + this.TR_HEADER_PATH  + name + ".json";
			var data = this._readJson(path);
			
			for(key in data)
			{
				if(data.hasOwnProperty(key)) data[key] = that._replaceSpecStr(data[key]);
			}
			result = data;
			
			return result;
		},
		/**
		 * 전문 JSON 파일내 키워드 Parsing</br>
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
		 * @param Object name 전문 코드 JSON 객체
		 *    
		 * @return Object result 변환된 JSON 객체
		 */
		_replaceSpecStr:function(data)
		{
			var result;
			var that = this;
			var specChar;
			if(data && typeof data == "string" && data.length > 0) specChar = data.substring(0, 1);
			switch (specChar) 
			{
				case that.SPEC_CHARS["INCLUDE_HEADER"] :
					var headerName = data.substr(1);
					result = that.getHeader(headerName);
					break;
				case that.SPEC_CHARS["REPLACE_STRING"] :
					var key = data.substr(1);
					result = sessionStorage.getItem(key);
					break;
				default :
					result = data;
					break;
			}
			return result;
		},
		/**
		 * JSON 파일 읽기</br>
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
		 * @param String path JSON File Path
		 *    
		 * @return Object result 읽은 JSON 객체
		 */
		_readJson: function(path){
			console.log("JSON file read : "+path);
			var result;
			$.ajax({
				url: path, 
				dataType: "json",
 				async : false,
 				cache:false,
				success: function(data) {
					console.log("JSON file read sucess : "+JSON.stringify(data));
					if(data==null) {
						LEMP._throwError("LEMPResource - Resource is empty." );
						return;
					}
					result=data;
				},
				error: function(error) {  
					var readType = "text";
					if(error.status == "404"){
						console.log("LEMPResource - Requested Resource not found. Default Resource Read." );
						path = path.substring(0,path.indexOf("string_")+6)+path.substring(path.indexOf(".json"));
						readType = "json";
					}
					console.log("JSON file read : "+path);
					$.ajax({
						url: path, 
						dataType: readType,
		 				async : false,
						success: function(data) {
							console.log("JSON file read sucess : "+JSON.stringify(data));
							if(data=="") {
								LEMP._throwError("LEMPResource - Resource is empty." );
								return;
							}
							try{
								if(readType == "text") {
									JSON.parse(data);
								}
								else{
									result = data;
								}
							}catch(e){
								LEMP._throwError("LEMPResource - Resource cannot convert to JSON " + e);
							}
						},
						error: function(e) {  
							LEMP._throwError("LEMPResource - load resource failed : " + path+ "[" + e.status + "] " + e.statusText);
						}
					});
				}
			});
			return result;
		}
	});
	/**
	 * 
	 * 01.클래스 설명 : LEMP Date 클래스 .</br> 
	 * 02.제품구분 : LEMP Util</br>
	 * 03.기능(콤퍼넌트) 명 : 사용자 서비스 NameSpace 클래스 </br>
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
	LEMP.Util.Resource = new LEMPResource();
	
	/**
	 * 
	 * 01.클래스 설명 : LEMP Sort 클래스 .</br> 
	 * 02.제품구분 : LEMP Util</br>
	 * 03.기능(콤퍼넌트) 명 : Object, Array, Element Sort 기능 </br>
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
	function LEMPSort()
	{
		this.options = {};
	}
	$.extend(LEMPSort.prototype, 
	{
		ORDER_BY_ASC : "asc", 
		ORDER_BY_DESC : "desc",
		KEY_TYPE_STRING : "string",
		KEY_TYPE_NUMBER : "number",
		defaultOptions : 
		{
		},
		keyDefaultOptions : 
		{
			"orderby" : "asc",
			"field" : "",
			"fieldType" : "string"
		},
		/**
		 * 정렬 하기</br>
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
		 * @param Variable target 정렬 대상
		 *    
		 * @return Variable result 정렬된 변환 객체
		 */
		execute:function(target, options)
		{
			if(!options) this.sortElement.apply(this, arguments);
			else
			{
				switch(options.constructor)
				{
					case Object :
						this.sortElement.apply(this, arguments);
						break;
					case String :
						this[options].apply(this, arguments);
						break;
				}
			}
		},
		/**
		 * 오름차순 정렬 하기</br>
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
		 * @param Variable a 비교값 1
		 * @param Variable b 비교값 2
		 * @param String key 정렬할 키값
		 * @param String keyType 정렬 기준 타입
		 *    
		 * @return Variable retVal 정렬된 변환 객체
		 */
		_orderByAscElement:function(a,b, key, keyType)
		{
			var retVal = null;
			
			var target1 = $(a),
				target2 = $(b);
			if(key)
			{
				target1 = target1.find(key);
				target2 = target2.find(key);
			}
			if (target1.text() == target2.text()){
				return 0;
			}
			if(keyType == "number")
			{
				retVal = parseInt(target1.text()) > parseInt(target2.text()) ? 1 : -1;
			} else
			{
				retVal = target1.text() > target2.text() ? 1 : -1;
			}
			return retVal;  
		},
		/**
		 * 내림차순 정렬 하기</br>
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
		 * @param Variable a 비교값 1
		 * @param Variable b 비교값 2
		 * @param String key 정렬할 키값
		 * @param String keyType 정렬 기준 타입
		 *    
		 * @return Variable retVal 정렬된 변환 객체
		 */
		_orderByDescElement:function(a,b, key, keyType){  
			return this._orderByAscElement(a,b, key, keyType) * -1;  
		},
		/**
		 * JSON객체 오름차순 정렬 하기</br>
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
		 * @param Variable a 비교값 1
		 * @param Variable b 비교값 2
		 * @param String key 정렬할 키값
		 * @param String keyType 정렬 기준 타입
		 *    
		 * @return Variable retVal 정렬된 변환 객체
		 */
		_orderByAscJson:function(a,b, key, keyType)
		{
			var retVal = null;
			
			var value1,value2;
			
			if(key)
			{
				value1 = a[key];
				value2 = b[key];
			}
			else
			{
				value1 = a;
				value2 = b;
			}
			if (value1==value2){
				return 0;
			}
			
			if(keyType == "number"){
				retVal = parseInt(value1) > parseInt(value2) ? 1 : -1;
			}else{
				retVal = value1 > value2 ? 1 : -1;
			}
			return retVal;  
		},
		/**
		 * JSON객체 내림차순 정렬 하기</br>
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
		 * @param Variable a 비교값 1
		 * @param Variable b 비교값 2
		 * @param String key 정렬할 키값
		 * @param String keyType 정렬 기준 타입
		 *    
		 * @return Variable retVal 정렬된 변환 객체
		 */
		_orderByDescJson:function(a,b, key, keyType)
		{
			return this._orderByAscJson(a,b, key, keyType) * -1;  
		},
		/**
		 * Element 정렬 하기</br>
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
		 * @param Object root Jquery Selector Object
		 * @param Object options 정렬 옵션
		 *    
		 * @return Variable retVal 정렬된 변환 객체
		 */
		sortElement:function(root, options)
		{
			if(root.size()==0) LEMP._throwError("LEMPSort - target is empty. selector : " + root.selector);
			var that = this;
			that.options = $.extend(false, that.defaultOptions);
			that.options.keys = new Array();
			that.options.keys.push(options);
			var tempBox = $("<div style='background-color:red;'>").insertAfter(root.eq(-1));
			root.pushStack([].sort.apply( root, 
			[
			 	function(a,b)
			 	{ 
			 		var retVal = 0;
			 		for(var i=0;i<that.options.keys.length;i++)
					{
			 			var record = that.options.keys[i];
			 			if(retVal==0) 
						{
							var data = $.extend(false, that.keyDefaultOptions);
							if(record.constructor === String) data.field = record;
							else if(record.constructor === Object)
							{
								$.extend(data, record);
							}
							var sortFunc = data.orderby === that.ORDER_BY_DESC ? that._orderByDescElement : that._orderByAscElement;
							retVal = sortFunc.apply(that, [a,b, data.field, data.fieldType]);
						}
					}
			 		return retVal;
			 	}
			 ] ), [] );
			tempBox.append(root);
			root.insertAfter(tempBox);
			tempBox.remove();
		},
		/**
		 * Array 정렬 하기</br>
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
		 * @param Object arr 정렬할 Array
		 * @param Object options 정렬 옵션
		 *    
		 * @return Variable retVal 정렬된 변환 객체
		 */
		sortArray:function(arr, options)
		{
			if(!arr) LEMP._throwError("LEMPSort - array is empty.");
			if(arr.length==0) 
			{
				return arr;
			}
			var that = this;
			if(!options){
				that.defaultOptions.keys = new Array();
				that.defaultOptions.keys.push(that.keyDefaultOptions);				
			}
			
			console.log(JSON.stringify(options));
			that.options = $.extend(false, that.defaultOptions, options);
			var sortFunc = that.options.orderby === that.ORDER_BY_DESC ? that._orderByDescJson : that._orderByAscJson;
			return [].sort.call( arr, 
				function(a,b)
			 	{ 
					var retVal = 0;
			 		for(var i=0;i<that.options.keys.length;i++)
					{
			 			var record = that.options.keys[i];
						if(retVal==0) 
						{
							var data = $.extend(false, that.keyDefaultOptions);
							if(record.constructor === String) data.field = record;
							else if(record.constructor === Object)
							{
								$.extend(data, record);
							}
							var sortFunc = data.orderby === that.ORDER_BY_DESC ? that._orderByDescJson : that._orderByAscJson;
							retVal = sortFunc.apply(that, [a,b, data.field, data.fieldType]);
						}
					}
			 		return retVal;
			 	}
			);
		}
		
	});
	/**
	 * 
	 * 01.클래스 설명 : LEMP Date 클래스 .</br> 
	 * 02.제품구분 : LEMP Util</br>
	 * 03.기능(콤퍼넌트) 명 : 사용자 서비스 NameSpace 클래스 </br>
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
	LEMP.Util.Sort = new LEMPSort();
	/**
	 * 
	 * 01.클래스 설명 : LEMP 유효성 체크 .</br> 
	 * 02.제품구분 : LEMP Util</br>
	 * 03.기능(콤퍼넌트) 명 : 입력값의 유효성 체크 기능 </br>
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
	function LEMPValidate()
	{
		this.options = {};
		this.initialized = false;
	}
	$.extend(LEMPValidate.prototype, 
	{
		instances : {},
		defaultOptions : 
		{
			rules : {},
			/**
			 * Error 발생시 경고 처리</br>
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
			 * @param Object errors 내부 정의된 Error 객체
			 *    
			 * @return 
			 */
			onError : function(errors)
			{
				var message = "";
				for(key in errors)
				{
					if(errors.hasOwnProperty(key))
					{
						var errorInfo = errors[key];
						if(message) message+="\n";
						message += errorInfo.message;
					}
				}
				LEMP.Window.alert({
					'_sTitle' : "확인",
					'_vMessage' : message
				});
			},
			checkAll : false
		},
		/**
		 * 내부 Error 객체 생성자</br>
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
		 * @param Object target 에러가 발생된 Jquery Selector Object
		 * @param String message 에러가 발생시 체크된 에러 메세지
		 *    
		 * @return Object error Error 객체
		 */
		_createError:function(target, message)
		{
			var error = 
			{
				"target" : target, 
				"message" : message 
			};
			return error; 
		},
		/**
		 * 유효성 검증</br>
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
		 * @param Object target 유효성체크할  Jquery Selector Object
		 * @param Variable ruleName 유효성 체크 기준
		 * @param Variable ruleName 유효성 체크 기준
		 *    
		 * @return 
		 */
		_testElement:function(target, ruleName, param)
		{
			var testFunc, testParam;
			if(ruleName && ruleName.constructor == Function)
			{
				var that = this;
				testFunc = ruleName;
				testParam = [target, LEMP.Util.Validate.Rules];
			}
			else
			{
				testFunc = LEMP.Util.Validate.Rules[ruleName];
				testParam = [target].concat(param);
			}
			if(testFunc && testFunc.constructor == Function) 
			{
				return testFunc.apply(LEMP.Util.Validate.Rules, testParam);
			}
			else LEMP._throwError("LEMPValidate - can't find rule. ruleName -" + ruleName);
		},
		/**
		 * 유효성 설정 값(Rule) Parsing</br>
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
		 * @param Object rule 유효성 체크 기준 설정값
		 *    
		 * @return result result 유효성 체크 기준 설정값 Parsing 결과
		 */
		_parseRule:function(rule)
		{
			var result = new Array();
			if(rule.constructor==String)
			{
				var ruleSplit = rule.split("//");
				ruleSplit.forEach(function(value)
				{
					var msgSplit = value.split("::");
					if(msgSplit.length!=2) LEMP._throwError("LEMPValidate - parse rule failed. rule string : " + rule);
					var msg = msgSplit[1];
					var funcStructNames = msgSplit[0].split("&&");
					
					var checks = [];
					var regExp = /([0-9|A-z]+)\((.*?)\)/g;
					funcStructNames.forEach(function(funcStructName)
					{
						var expResult=regExp.exec(funcStructName);
						var funcName = undefined,
							param = [];
						if(expResult)
						{
							var funcName = expResult[1];
							param = expResult[2].split(",");
							/*
							for(var i=0;i<param.length;i++)
							{
								param[i] = eval(param[i]);
							}
							*/
						}
						else funcName = funcStructName;
						checks.push({name : funcName, param : param});
					});

					result.push(
					{
						"checks" : checks,
						"message" : msg
					});
				});
			}
			else if(rule.constructor==Function)
			{
				result.push(
				{
					"checks" : rule
				});
			}
			else LEMP._throwError("LEMPValidate - parse rule failed. unknown type.  rule.type : " + rule.constructor);
			return result;
		},
		/**
		 * 유효성 설정 값(Rule) Parsing 실행</br>
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
		 * @param Object rules 유효성 체크 기준 전체 설정값 
		 *    
		 * @return  Object newRules 유효선 체크 기준 전체 설정값
		 */
		_parseRules:function(rules)
		{
			var newRules = new Object();
			for(key in rules)
			{
				if(rules.hasOwnProperty(key))
				{
					var rule = this._parseRule(rules[key]);
					newRules[key] = rule;
				}
			};
			return newRules;
		},
		/**
		 * 유효성 체크 실행</br>
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
		 * @param Object rules 유효성 체크 기준 전체 설정값 
		 *    
		 * @return boolean check 체크 결과
		 */
		_public_check:function(target)
		{
			var check = this.check(this.options.rules, this.options,target);
			return check;
		},
		/**
		 * 유효성 체크 설정 추가하기</br>
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
		 * @param Object targetSelector 유효성 체크 대상 Jquery Selector Object
		 * @param Object str 유효성 체크 기준명 
		 *    
		 * @return 
		 */
		_public_addRule:function(targetSelector, str)
		{
			if(!targetSelector) LEMP._throwError("LEMPValidate - reference error. targetSelector : " + targetSelector);
			if(!str)LEMP._throwError("LEMPValidate - reference error. rule string : " + str);
			this.options.rules[targetSelector] = this._parseRule(str); 
		},
		/**
		 * 유효성 체크 설정 제거하기</br>
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
		 * @param Object targetSelector 유효성 체크 대상 Jquery Selector Object
		 *    
		 * @return 
		 */
		_public_removeRule:function(targetSelector)
		{
			if(!targetSelector) LEMP._throwError("LEMPValidate - reference error. targetSelector : " + targetSelector);
			if(this.options.rules[targetSelector]) delete this.options.rules[targetSelector];
		},
		/**
		 * 유효성 체크 실행하기</br>
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
		 * @param Object $target 유효성 체크 대상 Jquery Selector Object
		 * @param Object options 유효성 체크시 옵션
		 *    
		 * @return 
		 */
		execute:function($target, options)
		{
			
			target = $target[0];
			var otherArgs = Array.prototype.slice.call(arguments, 2);
			if((!target.LEMPValidateInst) || (!target.LEMPValidateInst.initialized))
			{
				//Initialise
				target.LEMPValidateInst = LEMP.Util.Validate._getInstance($target.selector);
				target.LEMPValidateInst.extendOptions(LEMP.Util.Validate.defaultOptions);
				target.LEMPValidateInst.initialized=true;
			}
			if(typeof options == 'object')
			{
				target.LEMPValidateInst.extendOptions(options);
			}
			else if(typeof options == 'string') 
			{
				var result;
				var func = target.LEMPValidateInst['_public_' + options];
				var that;
				if(!func)
				{
					that = LEMP.Util.Validate.Rules;
					func = that[options];
					if(!func) LEMP._throwError("LEMPValidate - unknown method. method : " + options);
				}
				else that = target.LEMPValidateInst;
				return func.apply(that, [$target].concat(otherArgs));
			}
			return target.LEMPValidateInst;
		},
		/**
		 * 유효성 옵션 추가하기</br>
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
		 * @param Object options Merge될 유효성 체크 옵션
		 *    
		 * @return 
		 */
		extendOptions:function(options)
		{
			if(!options) return;
			
			var rules = {};
			if(options.rules) 
			{
				var rules = this._parseRules(options.rules);
			}
			this.options = $.extend(false, this.options, options, {"rules" : rules});
		},
		/**
		 * Validate Class 생성자</br>
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
		 * @param Object key 유효성 체크 대상 Jquery Selector Object
		 *    
		 * @return Object result Validate Instance
		 */
		_getInstance:function(key)
		{
			if(!this.instances[key]) this.instances[key] = new this.constructor();
			return this.instances[key];
		},
		/**
		 * Validate 설정 옵션 조회</br>
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
		 * @return Object result Validate Options
		 */
		getOptions:function()
		{
			return this.options;
		},
		/**
		 * 유효성 검사 실행</br>
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
		 * @param Object rules 유효성 검증 설정값
		 * @param Object options 유효성 검증 옵션값
		 * @param Object parent 유효성 검증 대상 Jquery Selector Object
		 *    
		 * @return boolean result 유효성 검즘 결과값
		 */
		check:function(rules, options,parent)
		{
			var checkAll = options && options.checkAll!=undefined ? options.checkAll : this.defaultOptions.checkAll;
			var that = this;
			var errors = new Array();
			for(var targetSelector in rules)
			{
				if(!(rules.hasOwnProperty(targetSelector))) continue;
				var target = $(targetSelector, parent);
				if(target.size()==0) 
				{
					LEMP._warning("LEMPValidate - target is null. target selector : " + targetSelector);
					continue;
				}
				rules[targetSelector].forEach(function(value)
				{
					if(errors.length!=0 && (!checkAll)) return;
					var record = value;
					var message = record.message;
					var checks = record.checks;
					if(checks.constructor==Function)
					{
						var testResult = that._testElement(target, checks); 
						if(!(testResult===true))
						{
							var message = testResult;
							errors.push(that._createError(target, message));
						}
					}
					else
					{
						for(var i=0;i<checks.length;i++)
						{
							var name = checks[i].name;
							var param = checks[i].param;
							var testResult = that._testElement(target, name, param); 
							if(testResult==false)
							{
								errors.push(that._createError(target, message));
								break; 
							}
						}
					}
				});
				if(errors.length!=0 && (!checkAll)) break;
			}
			if(errors.length!=0) 
			{
				if(options && options.onError) options.onError(errors);
				return false;
			}
			else return true;
		},
		/**
		 * Validate 객체 초기화</br>
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
		 * @param Object options 유효성 검증 옵션값
		 *    
		 * @return boolean result 유효성 검즘 결과값
		 */
		setDefaults : function(options)
		{
			$.extend(this.defaultOptions, options);
		}
	});
	
	/**
	 * 
	 * 01.클래스 설명 : LEMP Rules Class .</br> 
	 * 02.제품구분 : LEMP Util</br>
	 * 03.기능(콤퍼넌트) 명 : 입력값의 유효성 규칙 기능 </br>
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
	function LEMPRules()
	{
	}
	LEMPRules.prototype = 
	{
		/**
		 * 유효성 대상 객체 값 조회</br>
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
		 * @param Object element 유효성 검증 대상 Jquery Selector Object
		 *    
		 * @return Variable value 대상 Element Value
		 */	
		_getValue:function(element)
		{
			var value;
			if(element.jquery)
			{
				var nodeName = element[0].nodeName.toLowerCase();
				if(nodeName == "input" || nodeName == "select" || nodeName == "textarea") value = element.val();
				else value = element.text();
			}
			else value = element;
			return value;
		},
		/**
		 * 유효성 대상 검증 함수</br>
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
		 * @param Object element 유효성 검증 대상 Jquery Selector Object
		 * @param Function testFunc 유효성 검증 실행 함수
		 *    
		 * @return Variable value 대상 Element Value
		 */	
		_test:function(element, testFunc)
		{
			var that = this;
			var result = true;
			element.each(function(value)
			{
				if(value == undefined) return false;
				var testValue = that._getValue($(this));
				if(!testFunc.call(that, testValue)) result = false;
			});
			return result;
		},
		/**
		 * 필수값 검증 함수</br>
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
		 * @param Object element 유효성 검증 대상 Jquery Selector Object
		 *    
		 * @return boolean result 검증 결과
		 */	
		required:function(element)
		{
			return this._test(element, function(value){ return $.trim(value)=="" ? "":!!value; });
		},
		/**
		 * 이메일 검증 함수</br>
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
		 * @param Object element 유효성 검증 대상 Jquery Selector Object
		 *    
		 * @return boolean result 검증 결과
		 */	
		email:function(element)
		{
			return this._test(element, function(value)
			{
				if(value == undefined) return false;
				var regExp = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
				return regExp.test(value); 
			});
		},
		/**
		 * 전화번호 검증 함수</br>
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
		 * @param Object element 유효성 검증 대상 Jquery Selector Object
		 *    
		 * @return boolean result 검증 결과
		 */	
		phone:function(element)
		{
			return this._test(element, function(value)
			{
				if(value == undefined) return false;
				var regExp = /^(01[016789]|02|0[3-9]{1}[0-9]{1})[-.]{0,1}[0-9]{3,4}[-.]{0,1}[0-9]{4}$/g;
				return regExp.test(value); 
			});
		},
		/**
		 * 날짜 검증 함수</br>
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
		 * @param Object element 유효성 검증 대상 Jquery Selector Object
		 *    
		 * @return boolean result 검증 결과
		 */
		date:function(element) {
			return this._test(element, function(value)
			{
				if(value == undefined) return false;
				return /^\d{4}[\/.-]\d{1,2}[\/.-]\d{1,2}$/.test(value);
			});
		},
		/**
		 * 최소길이 검증 함수</br>
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
		 * @param Object element 유효성 검증 대상 Jquery Selector Object
		 * @param Object length 최소길이
		 *    
		 * @return boolean result 검증 결과
		 */
		minLength:function(element,length) {
			return this._test(element, function(value)
			{
				if(value == undefined) return false;
				return $.trim(this._getValue(value)).length >= length;
			});
		},
		/**
		 * 최대길이 검증 함수</br>
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
		 * @param Object element 유효성 검증 대상 Jquery Selector Object
		 * @param Object length 최대길이
		 *    
		 * @return boolean result 검증 결과
		 */
		maxLength : function(element,length) {
			return this._test(element, function(value)
			{
				if(value == undefined) return false;
				return $.trim(value).length <= length;
			});
		},
		/**
		 * 특정길이 검증 함수</br>
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
		 * @param Object element 유효성 검증 대상 Jquery Selector Object
		 * @param Object minLength 최소길이
		 * @param Object maxLength 최대길이
		 *    
		 * @return boolean result 검증 결과
		 */
		rangeLength : function(element, minLength, maxLength) {
			return this._test(element, function(value)
			{
				if(value == undefined) return false;
				var length = $.trim(value).length;
				return (length >= minLength && length <= maxLength);
			});
		},
		/**
		 * 최소값 검증 함수</br>
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
		 * @param Object element 유효성 검증 대상 Jquery Selector Object
		 * @param Object min 최소값
		 *    
		 * @return boolean result 검증 결과
		 */
		minNumber : function(element, min) {
			return this.number(element) && this._test(element, function(value)
			{
				if(value == undefined) return false;
				return (LEMP.Util.Number.toNumber(value) >= min);
			});
		},
		/**
		 * 최대값 검증 함수</br>
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
		 * @param Object element 유효성 검증 대상 Jquery Selector Object
		 * @param Object max 최대값
		 *    
		 * @return boolean result 검증 결과
		 */
		maxNumber : function(element, max) {
			return this.number(element) && this._test(element, function(value)
			{
				if(value == undefined) return false;
				return (LEMP.Util.Number.toNumber(value) <= max);
			});
		},
		/**
		 * 범위값 검증 함수</br>
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
		 * @param Object element 유효성 검증 대상 Jquery Selector Object
		 * @param Object min 최소값
		 * @param Object max 최대값
		 *    
		 * @return boolean result 검증 결과
		 */
		rangeNumber : function(element, min, max) {
			return this.number(element) && this._test(element, function(value)
			{
				if(value == undefined) return false;
				var num = LEMP.Util.Number.toNumber(value);
				return (num >= min && num <= max);
			});
		},
		/**
		 * 정수 검증 함수</br>
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
		 * @param Object element 유효성 검증 대상 Jquery Selector Object
		 *    
		 * @return boolean result 검증 결과
		 */
		digits : function(element) {
			return this._test(element, function(value)
			{
				if(value == undefined) return false;
				return /^\+*\d+$/.test(value);
			});
		},
		/**
		 * 숫자 검증 함수</br>
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
		 * @param Object element 유효성 검증 대상 Jquery Selector Object
		 *    
		 * @return boolean result 검증 결과
		 */
		number : function(element) {
			return this._test(element, function(value)
			{
				if(value == undefined) return false;
				return /^[+-]*[0-9]+$/.test(value);
			});
		},
		/**
		 * 동일값 검증 함수</br>
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
		 * @param Object element 유효성 검증 대상 Jquery Selector Object
		 * @param Object element 유효성 검증 비교 Jquery Selector Object
		 *    
		 * @return boolean result 검증 결과
		 */
		equalTo : function(element, to) {
			return this._test(element, function(value)
			{
				if(value == undefined) return false;
				if(to)
				{
					to = to.replace(/\'{0,}\"{0,}/gi, '');
					if(to.constructor==String) to =$(to);
				}
				return value === this._getValue(to);
			});
		},
		/**
		 * 범위내 값 검증 함수</br>
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
		 * @param Object element 유효성 검증 대상 Jquery Selector Object
		 *    
		 * @return boolean result 검증 결과
		 */
		"in":function(element)
		{
			var list = Array.prototype.slice.call(arguments, 1).map(function(ch)	{
				return ch.replace(/\'{0,}\"{0,}/gi, '');
			});
			return this._test(element, function(value)
			{
				if(value == undefined) return false;
				var result = false;
				list.forEach(function(loopValue)
				{
					if(value===loopValue) result=true;
				});
				return result;
			});
		},
		/**
		 * 문자 값 검증 함수</br>
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
		 * @param Object element 유효성 검증 대상 Jquery Selector Object
		 *    
		 * @return boolean result 검증 결과
		 */
		chars:function(element)
		{
			return this._test(element, function(value)
			{
				if(value == undefined) return false;
				return /^[ㄱ-ㅣ가-�R|a-z|A-Z]+$/.test(value);
			});
		},
		/**
		 * 한글 값 검증 함수</br>
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
		 * @param Object element 유효성 검증 대상 Jquery Selector Object
		 *    
		 * @return boolean result 검증 결과
		 */
		korChars:function(element) {
			return this._test(element, function(value)
			{
				if(value == undefined) return false;
				return /^[가-힣]+$/.test(value);
			});
		}
	};
	/**
	 * 
	 * 01.클래스 설명 : LEMP Validate 클래스 .</br> 
	 * 02.제품구분 : LEMP Util</br>
	 * 03.기능(콤퍼넌트) 명 : 사용자 서비스 NameSpace 클래스 </br>
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
	LEMP.Util.Validate = new LEMPValidate();
	/**
	 * 
	 * 01.클래스 설명 : LEMP Rules 클래스 .</br> 
	 * 02.제품구분 : LEMP Util</br>
	 * 03.기능(콤퍼넌트) 명 : 사용자 서비스 NameSpace 클래스 </br>
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
	LEMP.Util.Validate.Rules = new LEMPRules();
	
	/**
	 * 기본 규칙 설정 함수</br>
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
	 * @param String ruleName 유효성 검증 키값
	 * @param String testFunc 유효성 검증 수행 함수
	 *    
	 * @return 
	 */
	LEMP.Util.Validate.addDefaultRule = function(ruleName, testFunc)
	{
		if(!ruleName) LEMP._throwError("LEMPValidate - reference error. rule name : " + ruleName);
		if(!testFunc) LEMP._throwError("LEMPValidate - reference error. function : " + testFunc);
		if(testFunc.constructor != Function) LEMP._throwError("LEMPValidate - invaild type. function type : " + testFunc.constructor);
		LEMP.Util.Validate.Rules[ruleName] = testFunc;
	};
	
	/**
	 * 
	 * 01.클래스 설명 : LEMP Html 클래스 .</br> 
	 * 02.제품구분 : LEMP Util</br>
	 * 03.기능(콤퍼넌트) 명 : Html 고정 사용 Tag관리 함수 </br>
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
	function LEMPHtml(){};
	$.extend(LEMPHtml.prototype,
	{
		ID_NO_DATA : "LEMPHtmlTagNoData",
		CLASS_NO_DATA : "nodata no_data",
		ID_BACK_LAYER : "LEMPHtmlBackLayer",
		/**
		 * 데이터 없음 표시 Html Tag 생성</br>
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
		 * @param String target 화면에 표시할 Jquery Selector 키값
		 * @param String inputTxt 데이터 표시 없음 Text
		 *    
		 * @return 
		 */
		createNoDataTag:function(target, inputTxt)
		{
			if(!target || target.size()==0) 
			{
				LEMP._throwError("LEMPHtml - reference error. target : " + target);
				return;
			}
			this.removeNoDataTag();
			var tagType;
			var nodeName = target[0].nodeName.toLowerCase();
			switch(nodeName)
			{
				case "table" : tagType = "tr"; break;
				case "tbody" : tagType = "tr"; break;
				case "tr" : tagType = "td"; break;
				case "ul" : tagType = "li"; break;
				case "dl" : tagType = "dt"; break;
				default :
					tagType = "p"; 
					break;
			}
			var tag = $("<" + tagType + ">").addClass(this.CLASS_NO_DATA);
			if(tagType=="tr")
			{
				var child = $("<td>").attr("colspan",10).text(inputTxt);
				tag.append(child);
			}
			else
			{
				if(tagType=="td") tag.attr("colspan",10);
				tag.text(inputTxt);
			}
			
			var parent = target.clone();
			target.addClass(this.ID_NO_DATA + "Target");
			parent.children().remove().end()
				.attr("id", this.ID_NO_DATA)
				.insertAfter(target)
				.append(tag).show();
		},
		/**
		 * 데이터 없음 표시 Html Tag 삭제</br>
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
		removeNoDataTag:function()
		{
			$("#" + this.ID_NO_DATA).remove();
			$("." + this.ID_NO_DATA + "Target").removeClass(this.ID_NO_DATA + "Target");
		},
		/**
		 * 전체 화면 가리기 Html 생성</br>
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
		 * @param Object target 표시할 대상 Jquery Selector Object
		 *    
		 * @return 
		 */
		createBackLayer:function(target)
		{
			if(!target || target.size()==0) 
			{
				LEMP._throwError("LEMPHtml - reference error. target : " + target);
				return;
			}
			this.removeBackLayer();
			var backLayer = $("<div id='" + this.ID_BACK_LAYER + "' style='position:absolute; left:0; top:0; width:100%; height:100%; background:#000; opacity:0.7;'>");
			target.append(backLayer);
		},
		/**
		 * 전체 화면 가리기 Html 제거</br>
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
		 * @param Object target 표시할 대상 Jquery Selector Object
		 *    
		 * @return 
		 */
		removeBackLayer:function()
		{
			$("#" + this.ID_BACK_LAYER).remove();
		}
	});
	/**
	 * 
	 * 01.클래스 설명 : LEMP Html 클래스 .</br> 
	 * 02.제품구분 : LEMP Util</br>
	 * 03.기능(콤퍼넌트) 명 : 사용자 서비스 NameSpace 클래스 </br>
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
	LEMP.Util.Html = new LEMPHtml();
	
	
	
		
	///////////////////////////////////////////////////////////
	// Jquery Plugin Extends 
	///////////////////////////////////////////////////////////
	$.fn.LPFilter = function()
	{
		var inst = LEMP.Util.Filter._getInstance(this);
		return inst._public_check.apply(inst, [this].concat(Array.prototype.slice.call(arguments, 1)));
	};
	$.fn.LPRender = function()
	{
		var inst = LEMP.Util.Render._getInstance(this);
		inst.execute.apply(inst, [this].concat(Array.prototype.slice.call(arguments, 0)));
	};
	
	$.fn.LPNoDataTag = function()
	{
		var inst = LEMP.Util.Html;
		LEMP.Util.Html.createNoDataTag.apply(inst, [this].concat(Array.prototype.slice.call(arguments, 0)));
	};
	
	$.fn.LPRemoveDataTag = function()
	{
		var inst = LEMP.Util.Html;
		LEMP.Util.Html.removeNoDataTag.apply(inst, [this].concat(Array.prototype.slice.call(arguments, 0)));
	};
	
	$.fn.LPSort = function() 
	{
		var inst = LEMP.Util.Sort;
		inst.execute.apply(inst, [this].concat(Array.prototype.slice.call(arguments, 0)));
	};

	$.fn.LPValidate = function() 
	{
		if(this.size()==0) LEMP._throwError("LEMPValidate - reference error. selector : " + this.selector);
		var inst = LEMP.Util.Validate._getInstance(this);
		return inst.execute.apply(inst, [this].concat(Array.prototype.slice.call(arguments, 0)));
	};
	
	$.fn.LPExist = function () 
	{
		return this.length !== 0;
	};

	
	///////////////////////////////////////////////////////////
	// DataType Method Extends 
	///////////////////////////////////////////////////////////
	Number.prototype.LPToFileSizeUnit=function(unit){ return LEMP.Util.String.toFileSizeUnit(this, unit);};
	Number.prototype.LPToStr=function(options) { return LEMP.Util.String.toStr(this, options);};
	Number.prototype.LPToNumber=function(options) { return LEMP.Util.Number.toNumber(this.valueOf(), options);};
	Number.prototype.LPToFixLength=function(length, options) { return LEMP.Util.String.toFixLength(this, length, options);};
	Number.prototype.LPToKorNumber=function() { return LEMP.Util.Number.toKor(this);};
	Number.prototype.LPToRegionMoney=function(countryCode,unitType) { return LEMP.Util.String.toRegionMoney(this,countryCode,unitType);};
	
	String.prototype.LPToFileSizeUnit = function(unit){ return LEMP.Util.String.toFileSizeUnit(this, unit);};
	String.prototype.LPToDate=function(){ return LEMP.Util.Date.toDate(this);};
	String.prototype.LPToStr=function(options) { return LEMP.Util.String.toStr(this, options);};
	String.prototype.LPToNumber=function(options) { return LEMP.Util.Number.toNumber(this, options);};
	String.prototype.LPLeftSubstr=function(length) { return LEMP.Util.String.leftSubstr(this, length);};
	String.prototype.LPRightSubstr=function(length) { return LEMP.Util.String.rightSubstr(this, length);};
	String.prototype.LPToFixLength=function(length, options) { return LEMP.Util.String.toFixLength(this, length, options);};
	String.prototype.LPToFormatString=function(values) { return LEMP.Util.String.toFormatString(this , values);};
	String.prototype.LPToCommaNumber=function() { return LEMP.Util.String.toCommaNumber(this);};
	String.prototype.LPToFormatPhone=function(delim) { return LEMP.Util.String.toFormatPhone(this, delim);};
	String.prototype.LPToFormatDate=function(format) { return LEMP.Util.Date.toFormatDate(this, format);};
	String.prototype.LPToChoSung=function() { return LEMP.Util.String.toChoSung(this);};
	String.prototype.LPDateDiff=function(strDate) { return LEMP.Util.Date.diff(this,strDate);};
	String.prototype.LPToRegionMoney=function(countryCode,unitType) { return LEMP.Util.String.toRegionMoney(this,countryCode,unitType);};
	String.prototype.LPToKorNumber=function() { return LEMP.Util.Number.toKor(this);};
	String.prototype.LPStartsWith=function(str) { return LEMP.Util.String.startsWith(this,str);};
	String.prototype.LPEndsWith=function(str) { return LEMP.Util.String.endsWith(this,str);};
	String.prototype.LPIncludes=function(str) { return LEMP.Util.String.includes(this,str);};
	

	Array.prototype.LPSort = function(options) { return LEMP.Util.Sort.sortArray(this, options);};
	Array.prototype.LPRemoveAt= function(index) { return LEMP.Util.Array.RemoveAt(this, index);};
	
	Date.prototype.LPToDate=function(){ return LEMP.Util.Date.toDate(this);};
	Date.prototype.LPDiff=function(diffDate){ return LEMP.Util.Date.diff(this, diffDate);};
	Date.prototype.LPAddYear=function(year){ return LEMP.Util.Date.addYear(this, year);};
	Date.prototype.LPAddMonth=function(month){ return LEMP.Util.Date.addMonth(this, month);};
	Date.prototype.LPAddDay=function(day){ return LEMP.Util.Date.addDay(this,day);};
	Date.prototype.LPNextDay=function(){ return LEMP.Util.Date.nextDay(this);};
	Date.prototype.LPNextMonth=function(){ return LEMP.Util.Date.nextMonth(this);};
	Date.prototype.LPNextYear=function(){ return LEMP.Util.Date.nextYear(this);};
	Date.prototype.LPPreviousDay=function(){ return LEMP.Util.Date.previousDay(this);};
	Date.prototype.LPPreviousMonth=function(){ return LEMP.Util.Date.previousMonth(this);};
	Date.prototype.LPPreviousYear=function(){ return LEMP.Util.Date.previousYear(this);};
	Date.prototype.LPLastDay=function(){ return LEMP.Util.Date.lastDay(this);};
	Date.prototype.LPToFormatDate=function(format) { return LEMP.Util.Date.toFormatDate(this, format);};
	Date.prototype.LPGetWeeksOfMonth=function() { return LEMP.Util.Date.getWeeksOfMonth(this);};
	Date.prototype.LPGetWeeksOfYear=function() { return LEMP.Util.Date.getWeeksOfYear(this);};
	Date.prototype.LPGetStartEndWeek=function() { return LEMP.Util.Date.getStartEndWeek(this);};
	
	Storage.prototype.setObject = function(key, value){ return this.setItem.call(this, key, JSON.stringify(value));};
	Storage.prototype.getObject = function(key){ var value = this.getItem.call(this, key); return value && jQuery.parseJSON(value);};
	
	
})();
