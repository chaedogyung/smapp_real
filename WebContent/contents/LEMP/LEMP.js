/**
 * LEMP JS Library 로드 함수.</br>
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
(function(){

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

	var jsUrls = new Array(
		"LEMP/jquery-3.4.1.min.js",
		"LEMP/jquery-migrate-3.1.0.js",
		"LEMP/jquery-barcode.js",
//		"LEMP/jquery-1.11.1.js",
		"LEMP/LEMP-core.js",
		"LEMP/LEMP-xross.js",
		"LEMP/LEMP-util.js",
		"LEMP/LEMP-multilayout.js",
		"common/config/menuJson.js",
		"common/js/jquery.bpopup.min.js",
		"common/js/jquery-ui.min.js",
		"common/js/jquery.ui.touch-punch.min.js",
		"common/js/jquery.cfTouchSwipe.js",
		"common/js/jquery.touchFlow.js",
		"common/js/jquery.bxslider.min.js",
		"common/js/handlebars-v4.4.3.js",
		"common/js/lodash.js",
		"common/js/smutil.js",
		"common/js/jquery.ui.monthpicker.js"
	);

	var JsList="";

	for(var i=0;i<jsUrls.length;i++)
	{
		 if(/jquery|core/.test( jsUrls[i] )){
			 document.write("<script type=\"text/javascript\" src=\""+ RELATE_DEPTH + jsUrls[i] + "\" charset=\"utf-8\"></script>");
		   }else{
			   JsList +=	"<script type=\"text/javascript\" src=\""+ RELATE_DEPTH + jsUrls[i] + "\" charset=\"utf-8\"></script>";
		   }
	}
	document.write(JsList);


})();

