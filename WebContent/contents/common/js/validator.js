/**
 * class Validator.js
 */

var Validator = function(obj) {
	this.obj = (typeof(f) == 'string') ? $(obj) : obj;
	if (!this.obj) return false;
	this.lang = 'KO';
	this.error_prefix = true;
	this.error_default = '항목은 필수입니다.';
	this.result = true;
}

Validator.prototype = {
	init: function() {
		this.msg = this.message[this.lang]; // 메세지
		this.length = this.obj.find("input").length;
		for (i=0; i<this.length; i++) {
			var el = this.obj.find("input")[i];
			if (!this.is_valid(el)) continue;
			var result = this.validate(el);
			if (result == false) return false;
		}
	},

	message: {
		// 한글
		"KO": {
			"require": "항목은 필수입니다.",
			"minbyte": "항목은 {minbyte} 바이트(한글 {minbyte2}자) 이상이어야 합니다.",
			"maxbyte": "항목은 {maxbyte} 바이트(한글 {maxbyte2}자) 이상이어야 합니다.",
			"range": "항목은 {minnum} 이상이거나 {maxnum} 이하이어야 합니다.",
			"compare": "항목의 입력된 내용이 일치하지 않습니다.",
			"pattern": "항목의 형식이 올바르지 않습니다.",
			"numeric": "항목은 숫자만 입력해 주세요.",
			"alpha": "항목은 영어만 입력해 주세요.",
			"alnum": "항목은 영어, 숫자만 입력해 주세요.",
			"alnumunder": "항목은 영어, 숫자, _(언더바)만 입력해 주세요.",
			"hangul": "항목은 한글만 입력해 주세요.",
			"id": "항목의 아이디 형식이 올바르지 않습니다.\n\n영소문자, 숫자, _(언더바) 로 4~20자까지 가능\n\n첫글자는 영소문자, 숫자만 가능",
			"password": "항목의 비밀번호 형식이 올바르지 않습니다.\n\n비밀번호는 4~20자 사이로 입력하셔야 합니다.",
			"email": "항목의 이메일 형식이 올바르지 않습니다.",
			"jumin": "항목의 주민등록번호 형식이 올바르지 않습니다.",
			"date": "항목의 날짜 형식이 올바르지 않습니다.\n\n(입력예 : 2008-01-01)",
			"bizno": "항목의 사업자등록번호 형식이 올바르지 않습니다."
		},
		// 영어
		"EN": {
			"require": "item is required.", 
			"minbyte": "item {minbyte} bytes must be over.", 
			"maxbyte": "item {maxbyte} bytes must be over.", 
			"range": "item {minnum} more or {maxnum} less should be.", 
			"compare": "does not match the contents of the item entered.", 
			"pattern": "item is not a valid format.", 
			"numeric": "Please enter the item numbers.", 
			"alpha": "Also, please enter the All.", 
			"alnum": "entries in English, please enter numbers.", 
			"alnumunder": "entries in English, numbers, and _(underbar), please enter.", 
			"hangul": "Also, please enter the korean", 
			"id": "is not in the correct format. \n\nlowercase, number, _(underbar) to 4 to 20 characters \n\nletter the lowercase, with numbers",
			"password": "is not in the correct format.\n\npassword is 4 to 20 characters.",
			"email": "item not in the correct format of the email.", 
			"jumin": "Social Security numbers of the item is not in the correct format.", 
			"date": "item is not a valid date format. \n\n(example: 2008-01-01)",
			"bizno": "business registration number of the item is not in the correct format."
		},
		// 중국어
		"CN": {
			"require": "item is required.", 
			"minbyte": "item {minbyte} bytes must be over.", 
			"maxbyte": "item {maxbyte} bytes must be over.", 
			"range": "item {minnum} more or {maxnum} less should be.", 
			"compare": "does not match the contents of the item entered.", 
			"pattern": "item is not a valid format.", 
			"numeric": "Please enter the item numbers.", 
			"alpha": "Also, please enter the All.", 
			"alnum": "entries in English, please enter numbers.", 
			"alnumunder": "entries in English, numbers, and _(underbar), please enter.", 
			"hangul": "Also, please enter the korean", 
			"id": "is not in the correct format. \n\nlowercase, number, _(underbar) to 4 to 20 characters \n\nletter the lowercase, with numbers",
			"password": "is not in the correct format.\n\npassword is 4 to 20 characters.",
			"email": "item not in the correct format of the email.", 
			"jumin": "Social Security numbers of the item is not in the correct format.", 
			"date": "item is not a valid date format. \n\n(example: 2008-01-01)",
			"bizno": "business registration number of the item is not in the correct format."
		}
	},

	validate: function(el) {
		var type = el.type.toLowerCase();
		var trim = el.getAttribute('trim');
		var required = el.getAttribute('required');
		var minbyte = parseInt(el.getAttribute('minbyte'), 10);
		var maxbyte = parseInt(el.getAttribute('maxbyte'), 10);
		var minnum = parseInt(el.getAttribute('minnum'), 10);
		var maxnum = parseInt(el.getAttribute('maxnum'), 10);
		var compare = el.getAttribute('compare');
		var pattern = el.getAttribute('pattern');
		var option = el.getAttribute('option');
		var group = el.getAttribute('group'); // 주민번호 나누어진거 체크위해 추가 (20080327)

		// trim
		if (trim != null && (type == "text" || type == "hidden")) {
			switch (trim) {
				case 'trim': el.value = this.trim(el.value); break;
				case 'ltrim': el.value = this.trim(el.value, 'l'); break;
				case 'rtrim': el.value = this.trim(el.value, 'r'); break;
				case 'mtrim': el.value = this.trim(el.value, 'm'); break;
			}
		}

		// required
		if (required != null) {
			var is_required = this.is_required(el, type);
			if (is_required == false) return false;
		}

		// minbyte, maxbyte
		if (minbyte > 0 || maxbyte > 0) {
			var is_byte = this.is_byte(el, minbyte, maxbyte);
			if (is_byte == false) return false;
		}

		// range
		if (!isNaN(minnum) && !isNaN(maxnum)) {
			var is_range = this.is_range(el, minnum, maxnum);
			if (is_range == false) return false;
		}

		// compare
		if (compare != null) {
			var is_compare = this.is_compare(el, compare);
			if (is_compare == false) return false;
		}

		// pattern
		if (pattern != null) {
			var is_pattern = this.is_pattern(el, pattern);
			if (is_pattern == false) return false;
		}

		// option
		switch (option) {
			case 'numeric': return this.is_numeric(el); break;
			case 'alpha': return this.is_alpha(el); break;
			case 'alnum': return this.is_alnum(el); break;
			case 'alnumunder': return this.is_alnumunder(el); break;
			case 'hangul': return this.is_hangul(el); break;
			case 'id': return this.is_id(el); break;
			case 'password': return this.is_password(el); break;
			case 'email': return this.is_email(el); break;
			case 'jumin': return this.is_jumin(el, group); break;
			case 'date': return this.is_date(el); break;
			case 'bizno': return this.is_bizno(el); break;
			default: break;
		}
	},

	error: function(el, err) {
		var herror = el.getAttribute('herror');
		var hname = (el.getAttribute('hname')) ? el.getAttribute('hname') : el.name;
		var msg = (herror) ? herror : ((this.error_prefix) ? hname + ' ' : '') + err;
		
		LEMP.Window.alert({
			"_sTitle":"미입력",
		    "_vMessage" : msg
		});
		
		this.focus(el);
			
		
		this.result = false;
		return this.result;
	},

	focus: function(el) {				
		var type = el.type.toLowerCase();		
		if (type != "hidden") el.focus();
	},

	trim: function(str, type) {
		switch (type) {
			case 'l': return str.replace(/^\s+/, ''); break;
			case 'r': return str.replace(/\s+$/, ''); break;
			case 'm': return str.replace(/\s+/g, ''); break;
			default : return str.replace(/(^\s+)|(\s+$)/g, '');
		}
	},

	bytes: function(str) {
		var len = 0; 
		for (var i=0, l=str.length; i<l; i++) {
			var chr = str.charAt(i);
			len += (chr.charCodeAt() > 128) ? 2 : 1
		}
		return len;
	},

	is_valid: function(el) {
		return el.id && el.tagName.match(/^input|select|textarea$/i) && !el.disabled;
	},

	is_radio: function(el) {
		var obj = el.form.elements[el.name];
		var len = obj.length;
		if (len) {
			for (var i=0, len=obj.length; i<len; i++) {
				if (obj[i].checked) return;
			}
			return this.error(el, this.msg.require);
		}
    },

	is_required: function(el, type) {
		if (type == 'radio' || type == 'checkbox') {
			var obj = el.form.elements[el.name];
			var len = obj.length;
			if (len) {
				for (var i=0, len=obj.length; i<len; i++) {
					if (obj[i].checked) return;
				}
				return this.error(el, this.msg.require);
			}
			else {
				// 20080617 수정
				if (obj.checked == false) return this.error(el, this.msg.require);
			}
		}
		else {
			var value = this.trim(el.value);
			if (value == '' || value == null) return this.error(el, this.msg.require);
		}
	},

	is_byte: function(el, minbyte, maxbyte) {
		var value = this.trim(el.value);
		var len = this.bytes(value);
		
		var msg_minbyte = this.msg.minbyte;
		msg_minbyte = msg_minbyte.replace(/\{minbyte\}/g, minbyte);
		msg_minbyte = msg_minbyte.replace(/\{minbyte2\}/g, Math.round(minbyte / 2));

		var msg_maxbyte = this.msg.maxbyte;
		msg_maxbyte = msg_maxbyte.replace(/\{msg_maxbyte\}/g, maxbyte);
		msg_maxbyte = msg_maxbyte.replace(/\{msg_maxbyte2\}/g, Math.round(maxbyte / 2));

		if (len && len < minbyte) return this.error(el, msg_minbyte);
		if (len && len > maxbyte) return this.error(el, msg_maxbyte);
	},

	is_range: function(el, minnum, maxnum) {
		var value = this.trim(el.value);
		if (isNaN(value) || value < minnum || value > maxnum)

		var msg_range = this.msg.range;
		msg_range = msg_range.replace(/\{minnum\}/g, minnum);
		msg_range = msg_range.replace(/\{maxnum\}/g, maxnum);

		return this.error(el, msg_range);
	},

	is_compare: function(el, compare) {
		var el_compare = this.form.elements[compare];
		var value = el.value;
		var value2 = el_compare.value;
		if (value && value != value2) return this.error(el, this.msg.compare);
	},

	is_pattern: function(el, pattern) {
		var value = el.value;
		pattern = eval('/' + pattern + '/');
		if (!pattern.test(value)) return this.error(el, this.msg.pattern);
	},

	is_numeric: function(el) {
		var value = el.value;
		var pattern = /^[0-9,]+$/;
		if (value && !pattern.test(value)) return this.error(el, this.msg.numeric);
	},

	is_alpha: function(el) {
		var value = el.value;
		var pattern = /^[a-zA-Z]+$/;
		if (value && !pattern.test(value)) return this.error(el, this.msg.alpha);
	},

	is_alnum: function(el) {
		var value = el.value;
		var pattern = /^[a-zA-Z0-9]+$/;
		if (value && !pattern.test(value)) return this.error(el, this.msg.alnum);
	},

	is_alnumunder: function(el) {
		var value = el.value;
		var pattern = /^[a-zA-Z0-9_]+$/;
		if (value && !pattern.test(value)) return this.error(el, this.msg.alnumunder);
	},

	is_hangul: function(el) {
		var value = el.value;
		var pattern = /^[가-힣]+$/;
		if (!pattern.test(value)) return this.error(el, this.msg.hangul);
	},

	is_id: function(el) {
		var value = el.value;
		var pattern = /^[a-z0-9][a-z0-9_]{3,20}$/;
		if (!pattern.test(value)) return this.error(el, this.msg.id);
	},

	is_password: function(el) {
		var value = el.value;
		var pattern = /^.{4,20}$/;
		if (!pattern.test(value)) return this.error(el, this.msg.password);
	},

	is_email: function(el) {
		var value = el.value;
		if (value) {
			var pattern = /^[_a-zA-Z0-9-\.]+@[\.a-zA-Z0-9-]+\.[a-zA-Z]+$/;
			if (!pattern.test(value)) return this.error(el, this.msg.email);
		}
	},

	is_jumin: function(el, group) {
		var group_value = (group) ? this.form.elements[group].value : '';
		var num = el.value + '' + group_value;
		var pattern = /^([0-9]{6})-?([0-9]{7})$/;
		if (!pattern.test(num)) return this.error(el, this.msg.jumin);
		num = RegExp.$1 + RegExp.$2;

		var sum = 0;
		var last = num.charCodeAt(12) - 0x30;
		var bases = "234567892345";
		for (var i=0; i<12; i++) {
			if (isNaN(num.substring(i, i+1))) return this.error(el, this.msg.jumin);
			sum += (num.charCodeAt(i) - 0x30) * (bases.charCodeAt(i) - 0x30);
		}
		var mod = sum % 11;
		if ((11 - mod) % 10 != last) return this.error(el, this.msg.jumin);
	},

	is_date: function(el) {
		var value = el.value;
		if (value) {
			var pattern = /^[12][0-9]{3}\-[01]?[0-9]\-[0-3]?[0-9]$/;
			if (!pattern.test(value)) return this.error(el, this.msg.date)
		}
	},

	is_bizno: function(el) {
		var num = el.value;
		var pattern = /([0-9]{3})-?([0-9]{2})-?([0-9]{5})/;
		if (!pattern.test(num)) return this.error(el, this.msg.bizno);
		num = RegExp.$1 + RegExp.$2 + RegExp.$3;
		var cVal = 0;
		for (var i=0; i<8; i++) {
			var cKeyNum = parseInt(((_tmp = i % 3) == 0) ? 1 : ( _tmp  == 1 ) ? 3 : 7);
			cVal += (parseFloat(num.substring(i,i+1)) * cKeyNum) % 10;
		}
		var li_temp = parseFloat(num.substring(i, i+1)) * 5 + "0";
		cVal += parseFloat(li_temp.substring(0,1)) + parseFloat(li_temp.substring(1,2));
		if (parseInt(num.substring(9,10)) != 10 - (cVal % 10) % 10)
			return this.error(el, this.msg.bizno);
	}
}

// 공통 Validator 함수 추가
// @f : 폼객체(필수)
// @lang : 언어(KO(default), EN(영어))
function to_validation(f) {
	var validator = new Validator(f);
	var lang_cd;

	lang_cd = "KO";
	//if(lang=='eng') lang_cd = "EN";
	//if(lang=='cn') lang_cd = "CN";

	validator.lang = lang_cd;
	var result = validator.init();
	if (result == false) return false;
}
