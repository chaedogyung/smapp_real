/**
 * Emulator 관련 클래스 로드용 무명함수.</br>
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
'use strict';
(function(undefined)
{
    var rootDir = location.origin + location.pathname;
    var rootContentsDir = rootDir + "contents/"; 
    var rootEmulatorDir = rootDir + "webemulator/";
    
    /**
     * Require 모듈 초기화.</br>
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
    require.config(
    {
        // 모듈의 기본 위치를 지정한다.
        baseUrl: rootEmulatorDir + "js/", 

        // 모듈의 단축 경로 지정 또는 이름에 대한 별칭(Alias)을 지정할 수 있다.   
        paths: { 
            'backbone': 'backbone',
            'underscore': 'underscore',
            'jquery' : 'jquery-1.7.2.min',
            'Snap' : 'snap'
        },

        // AMD를 지원하지 않는 외부 라이브러리를 모듈로 사용할 수 있게 한다.
         shim: 
         {
            'underscore': {
                exports: '_'
            },
            'backbone': 
            {
                //These script dependencies should be loaded before loading
                //backbone.js
                deps: ['jquery', 'underscore'],
                //Once loaded, use the global 'Backbone' as the
                //module value.
                exports: 'Backbone'
            },
            'Snap': {
                exports: "Snap"
            }
        }

        // 모듈 위치 URL뒤에 덧붙여질 쿼리를 설정한다.
        // 개발 환경에서는 브라우저 캐시를 회피하기 위해 사용할 수 있고, 
        // 실제 서비스 환경이라면 ts값을 배포한 시간으로 설정하여 새로 캐시하게 할 수 있다.
        //urlArgs : 'ts=' + (new Date()).getTime()
    });
    
    /**
     * Require 모듈 환경설정 초기화.</br>
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
    require(["backbone"], function(Backbone)
    {
        Backbone.View = Backbone.View.extend(
        {
            toggle : function()
            {
                this.$el.toggleClass("hide");
            },
            hide:function()
            {
                this.$el.addClass("hide");
            },
            show:function()
            {
                this.$el.removeClass("hide");
            }
        });
    });
    
    /**
     * 
     * 01.클래스 설명 : dispatchRouterInst 클래스 .</br> 
     * 02.제품구분 : LEMP Emulator</br>
     * 03.기능(콤퍼넌트) 명 : dispatchRouterInst 모듈(URL Change Event 감지)  정의. </br>
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
    
    define("dispatchRouterInst", ['jquery', 'backbone', "requestProcInst", "screensViewInst", "Action", "Snap"], function($, Backbone, requestProc, screensView, Action, Snap) {

        var DispatchRouter = Backbone.Router.extend({
            routes: {          
                ":action/*param/*reqId" : "dispatch"
            },
            /**
             * URL Change Event Handler </br>
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
             * @param String actionId 수행할 명령
             * @param String reqMessage 명령에 대한 옵션 값
             * @param String reqId  명령요청시 생성한 ID
             *  
             * @return 
             */
            dispatch: function (actionId, reqMessage, reqId) {
                try
                {
                    location.hash = "";
                    ////console.log("Emulator Log:Dispatch - " + 'action:' + actionId + ' / ' + 'reqMessage:' + reqMessage);
                    reqMessage = JSON.parse(reqMessage);
                    var action = new Action(actionId, reqMessage);
                    
                    var func = this["execute" + actionId];
                    if(!func) { this.executeEtc(action); }
                    else { func.apply(this, [reqMessage]); }
                    requestProc.complete();
                }
                catch(e)
                {
                    require(["screensViewInst"], function (screensView)
                    {
                        if(reqMessage && reqMessage.param && reqMessage.param.callback) 
                        { 
                            var callback = reqMessage.param.callback;
                            var response = e;
                            screensView.getCurrentWebviewView().callback(reqMessage.param.callback, response);
                        }
                        requestProc.complete();
                        //console.debug(e);
                        //jQuery.error("Emulator Error:unknown error.");
                    });
                    
                }
            },
            /**
             * Emulator 구현 명령어 외 수행 기능 </br>
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
             * @param String action 수행할 명령어 전체 Data
             *  
             * @return 
             */
            executeEtc:function(action)
            {
                require(["testActionInst"], function(testAction)
                {   
                    var reqMessage = action.get("reqMessage"); 
                    var xrossApi = "LEMP." + reqMessage.sServiceName + "." + reqMessage.sAction;
                    var responseInfo = testAction.get(xrossApi) || {};
                    if(responseInfo.isFixed)
                    {
                        var callbackName = action.get("callbackName");
                        if(callbackName) 
                        {
                            screensView.getCurrentWebviewView().callback(callbackName, responseInfo.response);
                        }
                    }
                    else
                    {
                        require(["TestActionView"], function(TestActionView)
                        {
                            var testActionView = new TestActionView();
                            testActionView.setAction(action);
                            testActionView.render().show();
                        });
                    }
                });
            },
            /**
             * Emulator 프로그래스바 컨트롤러 </br>
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
             * @param Object reqMessage 프로그래스바 정보 Data
             *  
             * @return 
             */
            executePROGRESS_CONTROLLER:function(reqMessage) {
                require(["appInst"], function(app) {
                    var param = reqMessage.param;
                    var $loading = $(".loading");
                    var $span = $loading.find("span");
                    switch(param.type) {
                    case "show":
                        if($span.css("background-image") == "none") {
                        	if(app.getAppConfig("PROGRESS").IMAGEPATH) {
                        		$span.css("background", "url("+rootContentsDir+app.getAppConfig("PROGRESS").IMAGEPATH+") no-repeat");
                        	} else {
                        		$span.css("background", "url("+rootEmulatorDir+"images/progress_bar.gif"+") no-repeat");
                        	}                            
                        }
                        $loading.show();
                        break;
                    case "close":
                        $loading.hide();
                        break;
                    }
                    screensView.getCurrentWebviewView().callback(param.callback, {});
                });             
            },
            /**
             * SideView에 데이터 전달 </br>
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
             * @param Object reqMessage SideView 컨트롤 정보 Data
             *  
             * @return 
             */
            executeSEND_DATA_MENU_VIEW:function(reqMessage) {
                var sideView = screensView.getSideView(),
                    reqPosition = reqMessage.param.target_view;
                if(!sideView) {
                    console.error("Emulator Error:side view does not exist.");
                    return;
                }
                if(!reqPosition.match(/^(right|left)$/)) {
                    console.error("Emulator Error:position must be only left or right and lower case letter.");
                    return;
                }
                if(reqPosition != sideView.getPosition()) {
                    console.error("Emulator Error:request position and side view position is different, ensure it is lower-case.");
                    return;
                }
                var sideWebView = sideView.getWebviewView(),
                    message = reqMessage.param.message,
                    callback = reqMessage.param.callback;
                sideWebView.setInitParam(message);
                if(callback) {
                    sideWebView.callback(callback, message);
                }
            },          
            /**
             * SideView 생성 </br>
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
             * @param Object reqMessage 옵션값
             *  
             * @return 
             */
            executeCREATE_MENU_VIEW:function(reqMessage){
                var sideView = screensView.addSideView(reqMessage.param.target_page);
                sideView.setWidth(reqMessage.param.width_percent);
                sideView.setPosition(reqMessage.param.target_view);
                sideView.getWebviewView().setInitParam(reqMessage.param.message);
            },
            /**
             * SideView 열기 </br>
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
             * @param Object reqMessage 옵션값
             *  
             * @return 
             */
           executeSHOW_MENU_VIEW:function(reqMessage) {
                var sideView = screensView.getSideView(),
                reqPosition = reqMessage.param.target_view;
                if(!sideView) {
                    console.error("Emulator Error:menu does not exist.");
                    return;
                }
                if(!reqPosition.match(/^(right|left)$/)) {
                    console.error("Emulator Error:position must be only left or right and lower case letter.");
                    return;
                }
                if(reqPosition != sideView.getPosition()) {
                    console.error("Emulator Error:request position and side view position is different, ensure it is lower-case.");
                    return;
                }
                if(!screensView.isSideViewOpen) {
                    var sideWebView = sideView.getWebviewView();
                    sideView.open(reqMessage.param.target_view);
                    sideWebView.setOpenParam(reqMessage.param.message);
                    sideWebView.trigger("opensideview", sideWebView);
                    screensView.isSideViewOpen = true;
                }
            },
            /**
             * SideView 닫기 </br>
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
             * @param Object reqMessage 옵션값
             *  
             * @return 
             */
            executeCLOSE_MENU_VIEW:function(reqMessage){
                var sideView = screensView.getSideView(),
                sideWebView = sideView.getWebviewView();
                sideView.close();
                sideWebView.setCloseParam(reqMessage.param.message);
                sideWebView.trigger("closesideview", sideWebView);
                screensView.isSideViewOpen = false;
            },
            /**
             * 브라우져 열기 </br>
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
             * @param Object reqMessage 옵션값
             *  
             * @return 
             */
            executeSHOW_WEBSITE:function(reqMessage){
                window.open(reqMessage.param.url, "_blank");
            },
            /**
             * Window 이동 </br>
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
             * @param Object reqMessage 옵션값
             *  
             * @return 
             */
            executeNAVIGATION:function(reqMessage){
                var message = reqMessage.param.message,
                    param = reqMessage.param,
                    callbackFunc = reqMessage.param.callback,
                    screenView = screensView.goToScreen(param);             
                if(!!screenView) {
                    screenView.getWebviewView().setInitParam(message);
                    if(!!callbackFunc) {
                        screenView.getWebviewView().callback(callbackFunc, message);                        
                    }   
                }
            },
            /**
             * 데이타 베이스 열기 </br>
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
             * @param Object reqMessage 옵션값
             *  
             * @return 
             */
            executeOPEN_DATABASE:function(reqMessage){
                require(['databaseInst'], function(database) 
                {
                    ////console.log("Emulator Log:request openDatabase.");
                    //console.log(JSON.stringify(reqMessage));
                    
                    var response = {};
                    database.openDatabase(reqMessage.param.db_name, function() 
                    {
                        //console.log("Emulator Log:response openDatabase.");
                        //console.log(response);
                        
                        response.result=true;
                        screensView.getCurrentWebviewView().callback(reqMessage.param.callback, response);                          
                    }, function(error) 
                    {
                        //console.error("Emulator Error:response openDatabase.", error);
                        
                        response.result=false;
                        screensView.getCurrentWebviewView().callback(reqMessage.param.callback, response);
                    });
                    
                });
            },
            /**
             * SQL 실행 </br>
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
             * @param Object reqMessage 옵션값
             *  
             * @return 
             */
            executeEXECUTE_SQL:function(reqMessage){
                require(['databaseInst'], function(database) 
                {
                    var bindArray = reqMessage.param.bind_array;
                    var callback = reqMessage.param.callback;
                    var query = reqMessage.param.query;
                    
                    //console.log("Emulator Log:request executeSql.");
                    //console.log(JSON.stringify(reqMessage));
                    
                    database.executeSql(query, bindArray, function(response)
                    {
                        //console.log("Emulator Log:response executeSql.");
                        //console.log(response);
                        
                        screensView.getCurrentWebviewView().callback(reqMessage.param.callback, response);
                    }, function(error) 
                    {
                        //console.error("Emulator Error:request executeSql.");
                        //console.error(error);
                        
                        screensView.getCurrentWebviewView().callback(reqMessage.param.callback, error);
                    });
                    
                });
            },
            /**
             * SQL 반복 실행 </br>
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
             * @param Object reqMessage 옵션값
             *  
             * @return 
             */
            executeEXECUTE_BATCH_SQL:function(reqMessage){
                require(['databaseInst'], function(database) 
                {
                    var bindArray = reqMessage.param.bind_array;
                    var callback = reqMessage.param.callback;
                    var query = reqMessage.param.query;
                    
                    //console.log("Emulator Log:request executeBatchSql.");
                    //console.log(JSON.stringify(reqMessage));
                    
                    database.executeBatchSql(query, bindArray, function(response) 
                    {
                        //console.log("Emulator Log:response executeBatchSql.");
                        //console.log(response);
                        
                        screensView.getCurrentWebviewView().callback(reqMessage.param.callback, response);
                    },
                    function(error) 
                    {
                        //console.error("Emulator Error:request executeBatchSql. Trasaction roleback.");
                        //console.error(error);
                        
                        screensView.getCurrentWebviewView().callback(reqMessage.param.callback, error);
                    });
                });
            },
            /**
             * Select SQL 반복 실행 </br>
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
             * @param Object reqMessage 옵션값
             *  
             * @return 
             */
            executeEXECUTE_SELECT:function(reqMessage)
            {
                require(['databaseInst'], function(database) 
                {
                    var bindArray = reqMessage.param.bind_array;
                    var callback = reqMessage.param.callback;
                    var query = reqMessage.param.query;
                    
                    //console.log("Emulator Log:request executeSelect.");
                    //console.log(reqMessage);
                    
                    database.executeSelect(query, bindArray, function(response) 
                    {
                        //console.log("Emulator Log:response executeSelect");
                        //console.log(response);
                        screensView.getCurrentWebviewView().callback(reqMessage.param.callback, response);
                    },
                    function(error) 
                    {
                        //console.error("Emulator Error:request executeSelect.");
                        //console.error(error);
                        
                        screensView.getCurrentWebviewView().callback(reqMessage.param.callback, error);
                    });
                });
            },
            /**
             * LEMP Login  실행 </br>
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
             * @param Object reqMessage 옵션값
             *  
             * @return 
             */
            executeAUTH:function(reqMessage)
            {
                require(["serverInst"], function(server)
                {
                    var id = reqMessage.param.auth_info.user_id;
                    var password = reqMessage.param.auth_info.password;
                    var trcode = reqMessage.param.legacy_trcode;
                    var message = reqMessage.param.legacy_message;
                    var callback = reqMessage.param.callback;
                    //console.log("Emulator Log:request auth. url-" + server.get("url"));
                    //console.log(message);
                    
                    server.login(id, password, trcode, message, function(response)
                    {
                        //console.log("Emulator Log:response auth");
                        //console.log(response);
                        screensView.getCurrentWebviewView().callback(callback, response);
                    });
                });
            },
            /**
             * Window 열기 </br>
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
             * @param Object reqMessage 옵션값
             *  
             * @return 
             */
            executeSHOW_WEB:function(reqMessage)
            {
                    var fixlayer = reqMessage.param.fixlayer || "BBS001"; // TODO : will remove "BBS001" later
                    var param = reqMessage.param;
                    var currentScreenView = screensView.getCurrentScreenView();
                    var newScreenView = screensView.addNewScreen(param.target_page, fixlayer, param.page_name);
                    newScreenView.getWebviewView().setInitParam(param.message);
                    currentScreenView.$el.addClass("hide");
            },
            /**
             * Window 페이지 이동 </br>
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
             * @param Object reqMessage 옵션값
             *  
             * @return 
             */
            executeREPLACE_WEB:function(reqMessage)
            {
                // TODO : REPLACE_WEB 테스트 필요
//              if(!!reqMessage.param.page_name){
//                  screensView.getCurrentScreenView().pageName = reqMessage.param.page_name;                   
//              }
                var currentWebviewView = screensView.getCurrentWebviewView();
                currentWebviewView.setInitParam(reqMessage.param.message);
                currentWebviewView.setPage(reqMessage.param.target_page);
            },
            /**
             * Popup Window 열기 </br>
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
             * @param Object reqMessage 옵션값
             *  
             * @return 
             */
            executeSHOW_POPUP_VIEW:function(reqMessage)
            {
                var newScreenView = screensView.addNewPopupScreen(reqMessage.param.target_page);
                var unit = undefined,
                    width = undefined,
                    height = undefined;
                
                if(reqMessage.param.width_percent && reqMessage.param.height_percent) 
                {
                    unit = "%";
                    width = reqMessage.param.width_percent;
                    height = reqMessage.param.height_percent;
                }
                else 
                {
                    unit = "px";
                    width = reqMessage.param.width;
                    height = reqMessage.param.height;
                }
                
                newScreenView.setBaseSizeOrientation(reqMessage.param.base_size_orientation);
                newScreenView.setSize(width, height, unit);
                /*width: 300px;
                height: 300px;
                top: 50%;
                margin-top: -150px;
                margin-left: -150px;
                left: 50%;
                }*/
                newScreenView.getWebviewView().setInitParam(reqMessage.param.message);
            },
            /**
             * Popup Window 닫기 </br>
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
             * @param Object reqMessage 옵션값
             *  
             * @return 
             */
            executeDISMISS_POPUP_VIEW:function(reqMessage)
            {
                screensView.back();
                // Callback only can invoke when there is at least 1 screen
                if(reqMessage.param.callback && (screensView.screenViews.length > 1))
                {
                    screensView.getCurrentWebviewView().callback(reqMessage.param.callback, reqMessage.param.message);
                }
            },
            /**
             * Popup Window 닫기 </br>
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
             * @param Object reqMessage 옵션값
             *  
             * @return 
             */
            executePOP_VIEW:function(reqMessage)
            {
                screensView.back();
                if(reqMessage.param.callback)
                {
                    screensView.getCurrentWebviewView().callback(reqMessage.param.callback, reqMessage.param.message);
                }
            },
            /**
             * 단말기 정보 조회 </br>
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
             * @param Object reqMessage 옵션값
             *  
             * @return 
             */
            executeGET_DEVICEINFO:function(reqMessage)
            {
                require(["deviceInst"], function (device)
                {
                    var deviceInfo = device.getDeviceInfo();
                    screensView.getCurrentWebviewView().callback(reqMessage.param.callback, deviceInfo);
                });
            },
            /**
             * TitleBar , ToolBar 생성 요청 </br>
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
             * @param Object reqMessage 옵션값
             *  
             * @return 
             */
            executeSET_APP:function(reqMessage)
            {
                require(["TitleBarView", "ToolBarView", "ButtonView"], function (TitleBarView, ToolBarView, ButtonView)
                {
                    function createButtonView(buttonInfo)
                    {
                        var btn = new ButtonView();
                        
                        var action = undefined;
                        action = ButtonView.ACTION.CALLBACK;
                        btn.setCallback(buttonInfo.action);
                        btn.setActionType(action);
                        btn.setImage(buttonInfo.image_name);
                        return btn;
                    }
                    if(reqMessage.param.titlebar)
                    {
                        require(["appInst"], function(app){
                            var titleBarInfo = $.extend(false, 
                            {
                                title : "",
                                image_name : "",
                                left : [],
                                right : [],
                                visible : true,
                                id : "",
                                text_align : ""
                            }, reqMessage.param.titlebar);
                            
                            var currentScreen = screensView.getCurrentScreenView();
                            //타이틀바
                            var titleBarView = new TitleBarView();
                            var titleBarAppConfig = app.getAppConfig("TITLEBAR");
                            
                            titleBarView.setId(titleBarInfo.id);
                            titleBarView.setTitle(titleBarInfo.title); 
                            titleBarView.setBackgroundImage(titleBarInfo.image_name);
                            titleBarView.setTextAlign(titleBarInfo.text_align);
                            
                            titleBarView.setHeight(titleBarAppConfig.HEIGHT);
                            titleBarView.setTextSize(titleBarAppConfig.TEXTSIZE);
                            titleBarView.setTextColor(titleBarAppConfig.TEXTCOLOR);
                            titleBarView.setBackgroundColor(titleBarAppConfig.BACKGROUNDCOLOR);
                            
                            titleBarInfo.left.forEach(function(value)
                            {
                                titleBarView.addLeftButton(createButtonView(value));
                            });
                            
                            //기본백버튼 생성
                            if(titleBarInfo.left.length===0)
                            {
                                var btnBack = new ButtonView();
                                btnBack.setActionType(ButtonView.ACTION.BACK);
                                btnBack.setImage(rootEmulatorDir + "images/icon_back.png");
                                titleBarView.addLeftButton(btnBack);
                            }
                            
                            titleBarInfo.right.forEach(function(value)
                            {
                                titleBarView.addRightButton(createButtonView(value));
                            });
                            
                            currentScreen.setTitleBar(titleBarView);
                        });
                    }
                    
                    if(reqMessage.param.bottom_toolbar)
                    {
                        var toolBarInfo = $.extend(false, 
                        {
                            image_name : "",
                            buttons : [],
                            visible : true
                        }, reqMessage.param.bottom_toolbar);
                       
                        
                        //툴바
                        var toolBarView = new ToolBarView();
                        toolBarView.setBackgroundImage(toolBarInfo.image_name);
                        
                        toolBarInfo.buttons.forEach(function(value)
                        {
                            toolBarView.addButton(createButtonView(value));
                        });
                        screensView.getCurrentScreenView().setToolBar(toolBarView);
                    }
                });
            },
            /**
             *  Storage 저장 </br>
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
             * @param Object reqMessage 옵션값
             *  
             * @return 
             */
            executeSET_MSTORAGE:function(reqMessage)
            {
                require(["storageInst"], function (storage)
                {
                    var data = {};
                    $.each(reqMessage.param.data, function(index, value)
                    {
                        data[value.key] = value.value;
                    });
                    storage.setNonVolatileData(data);
                });
            },
            /**
             *  Storage 삭제 </br>
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
             * @param Object reqMessage 옵션값
             *  
             * @return 
             */
            executeREMOVE_MSTORAGE:function(reqMessage)
            {
                require(["storageInst"], function (storage)
                {
                    $.each(reqMessage.param.data, function(index, value)
                    {
                        storage.removeNonVolatileData(value);
                    });
                });
            },
            /**
             *  Property 저장 </br>
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
             * @param Object reqMessage 옵션값
             *  
             * @return 
             */
            executeSET_FSTORAGE:function(reqMessage)
            {
                require(["storageInst"], function (storage)
                {
                    var data = {};
                    $.each(reqMessage.param.data, function(index, value)
                    {
                        data[value.key] = value.value;
                    });
                    storage.setVolatileData(data);
                });
            },
            /**
             *  Property 삭제 </br>
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
             * @param Object reqMessage 옵션값
             *  
             * @return 
             */
            executeREMOVE_FSTORAGE:function(reqMessage)
            {
                require(["storageInst"], function (storage)
                {
                    $.each(reqMessage.param.data, function(index, value)
                    {
                        storage.removeVolatileData(value);
                    });
                });
            },
            /**
             *  Property 비우기 </br>
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
             * @param Object reqMessage 옵션값
             *  
             * @return 
             */
            executeCLEAR_FSTORAGE:function(reqMessage)
            {
                require(["storageInst"], function (storage)
                {
                    storage.clearVolatileData();
                });
            },
            /**
             *  전문 통신 요청 </br>
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
             * @param Object reqMessage 옵션값
             *  
             * @return 
             */
            executeRELOAD_WEB:function(reqMessage)
            {
                
                // TODO : RELOAD_WEB 테스트 필요
                require(["serverInst"], function(server)
                {
                    var trcode = reqMessage.param.trcode;
                    var message = reqMessage.param.message;
                    var serviceinfo = reqMessage.service_info;
                    var callback = reqMessage.param.callback;
                    server.requestTr(trcode, message, function(response, serviceinfo)
                    {
                        screensView.getCurrentWebviewView().callback(callback, response, serviceinfo );
                    }, serviceinfo );
                });
            },
            /**
             *  Alert, Confirm 창 띄우기 </br>
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
             * @param Object reqMessage 옵션값
             *  
             * @return 
             */
            executePOPUP_MESSAGE_BOX:function(reqMessage)
            {
                require(["MessageBoxView"], function(MessageBoxView)
                {
                    var title = reqMessage.param.title;
                    var message = reqMessage.param.message;
                    
                    var messageBoxView = new MessageBoxView();
                    messageBoxView.setTitle(title);
                    messageBoxView.setMessage(message);
                    var buttons = reqMessage.param.buttons;
                    buttons.forEach(function(value)
                    {
                        messageBoxView.addButton(value.text, value.callback);
                    });
                    
                    screensView.getCurrentScreenView().setMessageBox(messageBoxView);
                });
            },
            /**
             *  HARDWARE BACKBUTTON 이벤트 핸들러 등록 </br>
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
             * @param Object reqMessage 옵션값
             *  
             * @return 
             */
            executeHARDWARE_BACKBUTTON:function(reqMessage)
            {
                require(["screensViewInst"], function(screensView)
                {
                    screensView.getCurrentScreenView().isCatchedHardwareBackbutton = !!reqMessage.param.useBackEvent; 
                });
            },
            /**
             *  Toast 메세지 띄우기 </br>
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
             * @param Object reqMessage 옵션값
             *  
             * @return 
             */
            executeSHOW_MESSAGE:function(reqMessage)
            {
                require(["ToastView"], function(ToastView)
                {
                    var toast = new ToastView();
                    toast.show(reqMessage);
                });
            }
        });
        
        return new DispatchRouter();
    });
    
    /**
     * 
     * 01.클래스 설명 : deviceInst 클래스 .</br> 
     * 02.제품구분 : LEMP Emulator</br>
     * 03.기능(콤퍼넌트) 명 : Device 클래스 관련 기능  정의. </br>
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
    
    define("deviceInst", [ 'jquery', 'backbone', 'configPropertyInst'], function($, Backbone, configProperty) {
        var EVENT_ON_TAB_HARDWARE_BACKBUTTON = "onbackbutton";
        var Device = Backbone.Model.extend({
            defaults : 
            {
                deviceInfo : {},
                isCatchedHardwareBackbutton : false
            },
              /**
             *  Device 클래스 초기화 </br>
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
            initialize:function()
            {
                this.loadDeviceInfo();
            },
             /**
             *  Device 정보 초기화 </br>
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
            loadDeviceInfo:function()
            {
                var deviceInfo = configProperty.getDeviceInfo();
                
                if(!deviceInfo)
                {
                    deviceInfo = 
                    {
                        "locale": "ko_KR",
                        "device_type": "Emulator",
                        "model": "Emulator",
                        "spec_version": "0",
                        "app_build_version": "0",
                        "app_major_version": "0",
                        "app_minor_version": "0",
                        "content_minor_version": "0",
                        "device_id": "",
                        "content_major_version": "0",
                        "os_type": "Emulator",
                        "network_operater_name": "",
                        "mobile_number": "",
                        "screen_density": "0",
                        "screen_density_dpi": "0",
                        "client_version": "0"
                    };
                }
                var osVersionInfo = /Android (\d+.\d+)/.exec(navigator.userAgent);
                deviceInfo = $.extend(deviceInfo, 
                {
                    "os_version" : osVersionInfo ? osVersionInfo.pop() : "",
                    "screen_width": screen.width,
                    "manufacturer": navigator.vendor,
                    "screen_height": screen.height
                });
                this.saveDeviceInfo(deviceInfo);
                return deviceInfo;
            },
             /**
             *  Device 정보 저장 </br>
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
             * @param Object deviceInfo 단말기 정보 값
             *  
             * @return 
             */
            saveDeviceInfo:function(deviceInfo)
            {
                configProperty.saveDeviceInfo(deviceInfo);
                this.set("deviceInfo", deviceInfo);
            },
             /**
             *  Device 정보 조회 </br>
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
             * @return Object deviceInfo 단말기 정보 값
             */
            getDeviceInfo:function()
            {
                return this.get("deviceInfo");
            },
             /**
             *  Hardware Back Button 기능 </br>
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
            back:function()
            {
                require(["screensViewInst"], function (screensView)
                {
                    var isCatchedHardwareBackbutton = screensView.getCurrentScreenView().isCatchedHardwareBackbutton;
                    if(isCatchedHardwareBackbutton)
                    {
                        screensView.getCurrentWebviewView().dispatchEvent(EVENT_ON_TAB_HARDWARE_BACKBUTTON);
                    }
                    else
                    {
                        screensView.back();
                    }
                });
            }
        });
        return new Device();
    });
    
    /**
     * 
     * 01.클래스 설명 : SideView 클래스 .</br> 
     * 02.제품구분 : LEMP Emulator</br>
     * 03.기능(콤퍼넌트) 명 : SideView 관련 기능  정의. </br>
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
    
    define("SideView", ["jquery", "backbone", "underscore", "ScreenView"], function($, Backbone, _, ScreenView) {
        var SideView = ScreenView.extend({
            isOpen: false,
            snapper: undefined,
            position: undefined,
            widthPercent: undefined,
            message : undefined,
             /**
             *  SideView 초기화 </br>
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
            initialize:function() {
                var that = this;
                this.constructor.__super__.initialize.apply(this, Array.prototype.slice.call(arguments, 0));
                require(["appInst"], function(app)
                {
                    var webviewInfo = app.getAppConfig("WEBVIEW");
                    if(webviewInfo && webviewInfo.BACKGROUNDCOLOR)
                    {
                        var color = webviewInfo.BACKGROUNDCOLOR.DIALOG,
                            a = parseInt(color.substr(0,2),16) /255,
                            r = parseInt(color.substr(2,2),16),
                            g = parseInt(color.substr(4,2),16),
                            b = parseInt(color.substr(6,2),16);
                        color =  "rgba(" + r + "," + g+ "," + b + "," + a + ")";
                        that.$el.find(".webview").css("background-color", color);
                    }
                });
            },
            /**
             *  Snap JS Libarary 초기화 </br>
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
            createSnap:function(){
                // Position which screens move to, when open side view
                var position = Math.round($("body").width()*this.widthPercent/100)+1;
                var snapper = new Snap({
                    element: document.getElementById("screens"),
                    tapToClose: false, 
                    maxPosition: position,
                    minPosition: -position
                });
                return snapper;
            },
             /**
             *  SideView 열기 </br>
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
            open:function(reqPosition){
                this.createSnap().open(reqPosition);
            },
            /**
             *  SideView 닫기 </br>
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
            close:function(){ 
                this.createSnap().close();
            },
            /**
             *  SideView 가로 사이즈 설정 </br>
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
             * @param  Number widthPercent 가로사이즈
             *  
             * @return 
             */
            setWidth:function(widthPercent) {
                this.widthPercent = widthPercent.match(/\d+/)[0];
                $(".snap-drawer").width(this.widthPercent+"%");
            },
            /**
             *  SideView 위치 설정 </br>
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
             * @param  String position SideView 위치
             *  
             * @return 
             */
            setPosition:function(position) {
                this.position = position;
            },
            /**
             *  SideView 위치 조회 </br>
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
             * @return  String position SideView 위치
             */
            getPosition:function() {
                return this.position;
            },
            /**
             *  TitleBar 설정 Interface 정의(View Class공통) </br>
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
            setTitleBar:function() {
                
            },
            /**
             *  ToolBar 설정 Interface 정의(View Class공통) </br>
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
            setToolBar:function() {
                
            },
        });
        return SideView;
    });
    
    /**
     * 
     * 01.클래스 설명 : screensViewInst 클래스 .</br> 
     * 02.제품구분 : LEMP Emulator</br>
     * 03.기능(콤퍼넌트) 명 : screensView 관련 기능  정의. </br>
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
    
    define("screensViewInst", ['jquery', 'backbone', 'underscore',"ScreenView", "PopupScreenView", "appInst", "SideView"], function($, Backbone, _, ScreenView, PopupScreenView, app, SideView) {
        var EVENT_ON_READY_SCREEN = "onReady";
        var EVENT_ON_OPEN_SCREEN = "onOpen";
        var EVENT_ON_CLOSE_SCREEN = "onClose";
        
        var ScreensView = Backbone.View.extend({
            el:"#screens",
            screenViews : [],
            sideView : undefined,
            isSideViewOpen : false,
            mainScreenPaths : [],
            mainScreenView : undefined,
            webviewMaxCount : 15,
            render:function()
            {
            },
            /**
             *  screensViewInst 초기화 </br>
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
            initialize : function() {
                var that = this;
                
                document.addEventListener("keydown", function(event){ that.keydown.apply(that, [event]); });
                app.bind("loadConfig", function()
                { 
                    this.updateScreenPath();
                    this.updateWebviewMaxCount();
                }, this);
            },
            /**
             *  keydown Event Handler </br>
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
             * @param Event event Event 객체
             *  
             * @return  
             */
            keydown:function(event)
            {
                switch(event.keyCode)
                {
                case 116 : // F5
                    var currentScreenView = this.getCurrentScreenView();
                    if(currentScreenView)
                    {
                        currentScreenView.refresh();
                        event.preventDefault();
                    }
                    break;
                case 27 : // ESC
                    event.preventDefault();
                    require(["contextMenuViewInst"], function(contextMenuView)
                    {
                        contextMenuView.toggle();
                    });
                    break;
                }
            },
            /**
             *  ScreenView 생성 </br>
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
             * @param String path 새창으로 열 페이지 URL
             * @param String pageName 페이지 이름( Window open시 지정한 이름 )
             *  
             * @return ScreenView  screenView 생성한 ScreenView객체
             */
            addNewScreen:function(path, fixlayer, pageName)
            {
                var that = this;
                var titleBarInfo = app.getAppConfig("TITLEBAR");
                var fixlayers = titleBarInfo.FIXLAYER;
                if(that.screenViews.length >= that.webviewMaxCount) 
                {
                    that.destoryFirstScreen();
                }
                
                var screenView = new ScreenView();
                screenView.getWebviewView().bind("load", function(webviewView)
                {
                    var contentWindow = webviewView.el.contentWindow;
                    
                    contentWindow.document.addEventListener("keydown", function(event)
                    {
                        that.keydown.apply(that, [event]);
                    });
                    
                    contentWindow.focus();
                    contentWindow.window.addEventListener("blur", function (event) 
                    {
                        var activeElement = contentWindow.document.activeElement;
                        if(activeElement.tagName == 'IFRAME' && !activeElement.getAttribute('evtContextAttached'))
                        {
                            var iframe = activeElement;
                            var ifWindow = iframe.contentWindow;
                            ifWindow.document.addEventListener("keydown", function(event)
                            {
                                that.keydown.apply(that, [event]);
                            }); 
                            iframe.setAttribute('evtContextAttached','true');
                        }
                    });
                    
                    this.resetViewport();
                    webviewView.el.contentWindow.LEMPCore.EventManager.responser(
                        { eventname : EVENT_ON_READY_SCREEN },
                        { message : webviewView.initParam }
                    );
                }, that);
                
                if(!!pageName){
                    screenView.pageName = pageName;                 
                }
                
                // Preload title bar
                if(titleBarInfo.VISIBLE) {
                    require(["TitleBarView", "ButtonView"], function (TitleBarView, ButtonView) {                            
                        var titleBarView = new TitleBarView();
                        var f = fixlayers[fixlayer] || {};                        
                        if(!f.VISIBLE) { f = {}; }
                        
                        titleBarView.setId(fixlayer);
                        titleBarView.setTextAlign(f.TEXTALIGN);
                        titleBarView.setTitle(f.TITLETEXT);
                        titleBarView.setBackgroundImage(f.BACKGROUNDIMAGE||titleBarInfo.BACKGROUNDIMAGE);    
                        titleBarView.setBackgroundColor(f.BACKGROUNDCOLOR||titleBarInfo.BACKGROUNDCOLOR);
                        titleBarView.setTextColor(f.TEXTCOLOR||titleBarInfo.TEXTCOLOR);
                        titleBarView.setHeight(titleBarInfo.HEIGHT);
                        titleBarView.setTextSize(titleBarInfo.TEXTSIZE);
                        
                        if(f.LEFT) {
                            $.each(f.LEFT, function(i, v) {
                                var btn = new ButtonView();
                                btn.setActionType(ButtonView.ACTION.CALLBACK);
                                btn.setCallback(v.CALLBACK);
                                btn.setImage(rootContentsDir + v.IMAGENAME);
                                titleBarView.addLeftButton(btn);
                            });
                        }
                        
                        if(f.RIGHT) {
                            $.each(f.RIGHT, function(i, v) {
                                var btn = new ButtonView();
                                btn.setActionType(ButtonView.ACTION.CALLBACK);
                                btn.setCallback(v.CALLBACK);
                                btn.setImage(rootContentsDir + v.IMAGENAME);
                                titleBarView.addRightButton(btn);
                            });
                        }
                        
                        screenView.setTitleBar(titleBarView);                            
                    });
                }
                // Preload tool bar
                var toolBarInfo = app.getAppConfig("TOOLBAR");
                if(toolBarInfo.VISIBLE)
                {
                    require([ "ToolBarView"], function (ToolBarView) {
                        var toolBarView = new ToolBarView();
                        toolBarView.setBackgroundImage(toolBarInfo.BACKGROUNDIMAGE);
                        screenView.setToolBar(toolBarView);
                    });
                }
                // Load screen
                screenView.loadWebview(path);
                screenView.$el.appendTo(that.el);
                that.screenViews.push(screenView);
                that.mainScreenPaths.forEach(function(value)
                {
                    if(value===path) { that.mainScreenView = screenView; }
                });             
                
                return screenView;
            },
            /**
             *  Popup ScreenView 생성 </br>
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
             * @param String path 팝업창으로 열 페이지 URL
             *  
             * @return ScreenView  screenView 생성한 ScreenView객체
             */
            addNewPopupScreen:function(path)
            {
                var that = this;
                var popupScreenView = new PopupScreenView();
                popupScreenView.loadWebview(path);
                popupScreenView.getWebviewView().bind("load", function(webviewView)
                {
                    var contentWindow = webviewView.el.contentWindow;
                    contentWindow.document.addEventListener("keydown", function(event)
                    {
                        that.keydown.apply(that, [event]);
                    });
                    
                    contentWindow.focus();
                    contentWindow.window.addEventListener("blur", function (event) 
                    {
                        var activeElement = contentWindow.document.activeElement;
                        if(activeElement.tagName == 'IFRAME' && !activeElement.getAttribute('evtContextAttached'))
                        {
                            var iframe = activeElement;
                            var ifWindow = iframe.contentWindow;
                            ifWindow.document.addEventListener("keydown", function(event)
                            {
                                that.keydown.apply(that, [event]);
                            }); 
                            iframe.setAttribute('evtContextAttached','true');
                        }
                    });
                    
                    this.resetViewport();
                    webviewView.el.contentWindow.LEMPCore.EventManager.responser(
                        { eventname : EVENT_ON_READY_SCREEN },
                        { message : webviewView.initParam }
                    );
                }, this);
                popupScreenView.$el.appendTo(this.el);
                this.screenViews.push(popupScreenView);
                
                return popupScreenView;
            },
            /**
             *  SideView 생성 </br>
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
             * @param String path 팝업창으로 열 페이지 URL
             *  
             * @return SideView  sideView 생성한 SideView객체
             */
            addSideView:function(path)
            {
                var sideView = new SideView(),
                sideWebView = sideView.getWebviewView(); 
                sideView.loadWebview(path);
                window.parent.$("#snap-drawer").html(sideView.$el);
                // Bind events
                sideWebView.bind("load", function(webviewView) {
                    webviewView.el.contentWindow.LEMPCore.EventManager.responser(
                        { eventname : EVENT_ON_READY_SCREEN},
                        { message : webviewView.initParam }
                    );
                }, this);
                sideWebView.bind("opensideview", function(webviewView) {
                    webviewView.el.contentWindow.LEMPCore.EventManager.responser(
                        { eventname : EVENT_ON_OPEN_SCREEN},
                        { message : webviewView.openParam }
                    );
                }, this);
                sideWebView.bind("closesideview", function(webviewView) {
                    webviewView.el.contentWindow.LEMPCore.EventManager.responser(
                        { eventname : EVENT_ON_CLOSE_SCREEN},
                        { message : webviewView.closeParam }
                    );
                }, this);
                
                this.sideView = sideView;
                
                return sideView;
            },
            /**
             *  ScreenView 닫기 </br>
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
            back:function()
            {
                this.destoryCurrentScreen();                
                if(this.screenViews.length == 0) {
            		this.addNewScreen(app.getAppConfig("URL").LOGIN);                	
                }
                var currentScreenView = this.getCurrentScreenView();
                if(currentScreenView) 
                { 
                    this.resetViewport();
                    currentScreenView.$el.removeClass("hide");
                }
            },
            /**
             *  첫번째 ScreenView 닫기(MaxCount 초과시) </br>
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
            destoryFirstScreen:function()
            {
                if(this.screenViews.length>0)
                {
                    var firstScreenView = this.screenViews[0];
                    if(this.mainScreenView === firstScreenView) this.mainScreenView = undefined;
                    firstScreenView.remove();
                    this.screenViews.shift();
                }
            },
            /**
             *  현재 ScreenView 닫기 </br>
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
            destoryCurrentScreen:function()
            {
                var currentScreenView = this.getCurrentScreenView();
                if(this.mainScreenView === currentScreenView) this.mainScreenView = undefined;
                currentScreenView.remove();
                delete this.screenViews.pop();
            },
            /**
             *  Viewport 맞추기 </br>
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
            resetViewport:function()
            {
                var viewport = this.getCurrentWebviewView().getViewport();
                $(document.head).find("meta[name=viewport]").attr("content", viewport || "");
            },
            /**
             *  SideView 반환 </br>
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
            getSideView:function() 
            {
                return this.sideView;
            },
            /**
             *  SideWebView 반환 </br>
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
            getSideWebView:function()
            {
                return this.getSideView().getWebviewView();
            },
            /**
             *  현재 ScreenView 반환 </br>
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
            getCurrentScreenView:function()
            {
                return this.screenViews[this.screenViews.length-1];
            },
            /**
             *  현재 WebviewView 반환 </br>
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
            getCurrentWebviewView:function()
            {
                return this.getCurrentScreenView().getWebviewView();
            },
            /**
             *  ScreenView 정보 업데이트 </br>
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
            updateScreenPath:function()
            {
                var appConfig = app.getAppConfig();
                if(appConfig)
                {
                    this.mainScreenPaths = appConfig.URL.MAIN || [];
                }
            },
            /**
             *  Webview Max Count 정보 업데이트 </br>
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
            updateWebviewMaxCount:function()
            {
                var appConfig = app.getAppConfig();
                if(appConfig && appConfig.WEBVIEW.MAXIMUMCOUNT)
                {
                    this.webviewMaxCount = appConfig.WEBVIEW.MAXIMUMCOUNT;
                }
            },
            /**
             *  첫번째 ScreenView로 이동 </br>
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
            goStartScreen:function()
            {
                while(this.screenViews.length>1)
                {
                    this.destoryCurrentScreen();
                }
                this.screenViews[0].show();
            },
            /**
             *  메인 ScreenView로 이동 </br>
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
            goMainScreen:function()
            {
                if(this.mainScreenView)
                {
                    
                    var currentScreenView = undefined;
                    while(true)
                    {
                        currentScreenView = this.getCurrentScreenView();
                        if(currentScreenView !== this.mainScreenView) { this.destoryCurrentScreen(); }
                        else { break; }
                    }
                    currentScreenView.show();
                }
                else { jQuery.error("Emulator Error:can't find main page. path:"+ this.mainScreenPaths); }
                
            },
            /**
             *  특정 ScreenView로 이동 </br>
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
             * @param Object param 이동 명령에 대한 옵션값
             *  
             * @return 
             */
            goToScreen:function(param){
                var screen = undefined, 
                    pageName = param.page_name, 
                    screenViewsLength = this.screenViews.length-1,
                    index = undefined;
                if(!!param.index || param.index === 0) {
                    // If step equal -0, screen length, or greater; go to first screen (index 0)
                    var step = -1*param.index===0 ? screenViewsLength : -1*param.index;
                    index = step>=screenViewsLength ? 0 : screenViewsLength-step;
                    // Step must be negative
                    if(step < 0) {                  
                        console.error("Emulator Error:step must be negative.");
                        return screen;
                    }
                }
                // Check screen by name if provided name
                if(!!pageName) {
                    for(var i=0; i <= screenViewsLength; i++) {
                        if(this.screenViews[i].pageName == pageName) {
                            index = i;
                            break;
                        }
                    }       
                }
                // Remove front screens
                while(true) {
                    if(screenViewsLength > index) {
                        this.destoryCurrentScreen(); 
                    }
                    else {
                        break;
                    }
                    screenViewsLength--;
                }
                // Display a screen
                screen = this.screenViews[index];
                if(!!screen) {
                    screen.show();
                } else {
                    console.error("Emulator Error:screen not found.");
                }               
                return screen;
            }
        });
        
        return new ScreensView();
    });
    
    /**
     * 
     * 01.클래스 설명 : ScreenView 클래스 .</br> 
     * 02.제품구분 : LEMP Emulator</br>
     * 03.기능(콤퍼넌트) 명 : ScreenView 관련 기능 정의 </br>
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
    
    define("ScreenView", ['jquery', 'backbone', 'underscore', 'WebviewView'], function($, Backbone, _, WebviewView) {
        var ScreenView = Backbone.View.extend({
            pageName: "", 
            className: "screen",
            tagName: "article",
            webviewView : undefined,
            components : undefined,
            titleBar:undefined,
            toolBar:undefined,
            messageBox:undefined,
            isCatchedHardwareBackbutton:undefined,
            isMainScreen:false,
            isStartScreen:false,
            /**
             *  ScreenView 초기화 </br>
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
            initialize : function() {
                this.components = {};
                var that = this;
                require(["appInst"], function(app)
                {                   
                    var webviewInfo = app.getAppConfig("WEBVIEW");
                    if(webviewInfo && webviewInfo.BACKGROUNDCOLOR)
                    {
                        var color = webviewInfo.BACKGROUNDCOLOR.NORMAL,
                            a = parseInt(color.substr(0,2),16) /255,
                            r = parseInt(color.substr(2,2),16),
                            g = parseInt(color.substr(4,2),16),
                            b = parseInt(color.substr(6,2),16);
                        color =  "rgba(" + r + "," + g+ "," + b + "," + a + ")";
                        that.$el.find(".webview").css("background-color", color);
                    }
                });
                that.webviewView = new WebviewView();
                var webviewBox = $("<section>").addClass("webviewBox content").appendTo(that.$el);
                that.webviewView.$el.appendTo(webviewBox);
                
                
            },
            /**
             *  Webview 로드 </br>
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
             * @param path String 웹뷰로 연결할 URL
             *  
             * @return 
             */
            loadWebview:function(path)
            {
                this.webviewView.setPage(path);
            },
            /**
             *  TitleBar 로드 </br>
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
             * @param titleBar Object TitleBar 객체
             *  
             * @return 
             */
            setTitleBar:function(titleBar)
            {
                if(this.titleBar) 
                {
                    this.titleBar.remove();
                    delete this.titleBar;
                }
                this.titleBar = titleBar;
                this.titleBar.render(this).$el.prependTo(this.$el);
            },
            /**
             *  ToolBar 로드 </br>
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
            setToolBar:function(toolBar)
            {
                if(this.toolBar) 
                {
                    this.toolBar.remove();
                    delete this.toolBar;
                }
                this.toolBar = toolBar;
                this.toolBar.render(this).$el.appendTo(this.$el);
            },
            /**
             *  Alert, confirm 생성 </br>
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
            setMessageBox:function(messageBox)
            {
                if(this.messageBox) 
                {
                    this.messageBox.remove();
                    delete this.messageBox;
                }
                this.messageBox = messageBox;
                this.messageBox.render(this).$el.prependTo($(this.el));
            },
            /**
             *  Alert, confirm 닫기 </br>
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
            removeMessageBox:function ()
            {
                if(this.messageBox){ this.messageBox.remove();}
            },
            /**
             *  Component 생성( 2.5 API ) </br>
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
             * @param component Object component객체
             *  
             * @return 
             */
            setComponent:function(component)
            {
                this.components[component.cid] = component;
                component.render(this).$el.appendTo(this.$el);
            },
            /**
             *  WebView 반환 </br>
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
            getWebviewView:function()
            {
                return this.webviewView;
            },
            /**
             *  Page 새로 고침 </br>
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
            refresh:function()
            {
                for(var key in this.components)
                {
                    this.components[key].remove();
                    delete this.components[key];
                }
                this.removeMessageBox();
                this.getWebviewView().refresh();
            },
        });
          
        return ScreenView;
    });
    /**
     * 
     * 01.클래스 설명 : PopupScreenView 클래스 .</br> 
     * 02.제품구분 : LEMP Emulator</br>
     * 03.기능(콤퍼넌트) 명 :  Popup Window 관련 기능 </br>
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
    
    define("PopupScreenView", ['jquery', 'backbone', 'underscore', 'ScreenView'], function($, Backbone, _, ScreenView) {
        var PopupScreenView = ScreenView.extend({
            className: "screen popup",
            baseSizeOrientation : "auto", 
            width : undefined,
            height : undefined,
            unit : undefined,
            /**
             *  PopupScreenView 초기화 </br>
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
            initialize:function()
            {
                var that = this;
                this.constructor.__super__.initialize.apply(this, Array.prototype.slice.call(arguments, 0));
                require(["appInst"], function(app)
                {
                    var webviewInfo = app.getAppConfig("WEBVIEW");
                    if(webviewInfo && webviewInfo.BACKGROUNDCOLOR)
                    {
                        var color = webviewInfo.BACKGROUNDCOLOR.DIALOG,
                            a = parseInt(color.substr(0,2),16) /255,
                            r = parseInt(color.substr(2,2),16),
                            g = parseInt(color.substr(4,2),16),
                            b = parseInt(color.substr(6,2),16);
                        color =  "rgba(" + r + "," + g+ "," + b + "," + a + ")";
                        that.$el.find(".webview").css("background-color", color);
                    }
                });
            },
            /**
             *  PopupScreenView 사이즈 지정 </br>
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
             * @param String width 팝업창 가로크기
             * @param String height 팝업창 세로크기
             * @param String unit 팝업창 크기 단위
             *  
             * @return 
             */
            setSize:function(width, height, unit)
            { 
                this.width = width;
                this.height = height;
                this.unit = unit;
                var realWidth,realHeight;
                switch(this.base_size_orientation)
                {
                case "vertical" :
                    realWidth = width;
                    realHeight = height;
                    break;
                case "horizontal " :
                    realWidth = height;
                    realHeight = width;
                    break;
                default :
                    //세로
                    if(screen.availWidth < screen.availHeight)
                    {
                        realWidth = width;
                        realHeight = height;
                    }
                    else
                    {
                        realWidth = height;
                        realHeight = width;
                    }
                    break;
                }
                
                this.getWebviewView().setSize(realWidth, realHeight, unit);
            },
            /**
             *  PopupScreenView 닫기 </br>
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
            remove:function()
            {
                this.$el.remove();
            },
            /**
             *  TitleBar 설정 Interface 정의(View Class공통) </br>
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
            setTitleBar:function(){},
            /**
             *  ToolBar 설정 Interface 정의(View Class공통) </br>
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
            setToolBar:function(){},
            /**
             *  가로 세로 사이즈 기준값 설정 </br>
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
             * @param baseSizeOrientation String 단말기 가로세로 기준값
             *  
             * @return  
             */
            setBaseSizeOrientation:function(baseSizeOrientation)
            {
                this.baseSizeOrientation = baseSizeOrientation;
                var that = this;
                $(window).unbind(".autoScreenSize").bind("resize orientatinchange.autoScreenSize", function(event)
                {
                    that.setSize(that.width, that.height, that.unit);
                });
            }
        });
        return PopupScreenView;
    });
    /**
     * 
     * 01.클래스 설명 : WebviewView 클래스 .</br> 
     * 02.제품구분 : LEMP Emulator</br>
     * 03.기능(콤퍼넌트) 명 : WebView 관련 기능 정의 </br>
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
    
    define("WebviewView", ['jquery', 'backbone', 'underscore'], function($, Backbone, _) {
        var WebviewView = Backbone.View.extend({
            className: "webview",
            tagName: "iframe",
            path : undefined,
            initParam:{},
            openParam:{},
            closeParam:{},
            events: {
                "load": "onLoad",  // 이벤트 핸들러 등록
            },
            /**
             *  WebviewView 초기화 </br>
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
            initialize : function() {
            },
            /**
             *  WebviewView 열릴때 전달될 Parameter 세팅 </br>
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
             * @param param Object WebView open시 설정값
             *  
             * @return 
             */
            setOpenParam:function(param) 
            {
                this.openParam = param;
            },
            /**
             *  WebviewView 닫을때 전달될 Parameter </br>
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
             * @param param Object WebView close시 설정값
             *  
             * @return 
             */
            setCloseParam:function(param) 
            {
                this.closeParam = param;
            },
            /**
             *  WebviewView 생성시 전달될 Parameter </br>
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
            setInitParam:function(param)
            {
                this.initParam = param;
            },
            /**
             *  WebviewView 페이지 로드하기 </br>
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
             * @param path String 페이지에 로드할 URL
             *  
             * @return 
             */
            setPage:function(path)
            {
                this.path = path && path.substr(0,4)==="http" ? path : rootContentsDir + path;
                this.$el.attr("src", this.path);
            },
            /**
             *  WebviewView 사이즈 설정 </br>
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
             * @param width String 가로 사이즈
             * @param height String 세로 사이즈
             * @param width String 사이즈 단위
             *  
             * @return 
             */
            setSize:function(width, height, unit)
            {
                
                this.$el
                    .width(width+unit)
                    .height(height+unit)
                    .css("left",((unit==="%" ? 100 : screen.width)/2 - width/2) + unit)
                    .css("top", ((unit==="%" ? 100 : screen.height)/2 - height/2) + unit);
            },
            /**
             *  WebviewView URL Path 반환 </br>
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
             * @return path String 페이지에 로드할 URL
             */
            getPath:function()
            {
                return this.path;
            },
            /**
             *  WebviewView Load 이벤트 핸들러 </br>
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
            onLoad:function()
            {
                var that = this,
                    contentWindow = this.el.contentWindow;
                require(["storageInst", "sqliteInst", "deviceInst"], function(storage, sqlite, device)
                {
                    contentWindow.Object.prototype.constructor = Object;
                    contentWindow.Object = Object;
                    contentWindow.Array.prototype.constructor = Array;
                    contentWindow.Array = Array;
                    contentWindow.String.prototype.constructor = String;
                    contentWindow.String = String;
                    contentWindow.Number.prototype.constructor = Number;
                    contentWindow.Number = Number;
                    contentWindow.Boolean.prototype.constructor = Boolean;
                    contentWindow.Boolean = Boolean;
                    
                    if(contentWindow.LEMP && contentWindow.LEMPCore)
                    {
                        contentWindow.LEMPPluginMgr = {};
                        contentWindow.LEMPPluginMgr.addPlugin = function()
                        {
                            this.start = function(a,b,c,d,e){};
                            return this;
                        };
                        
                        contentWindow.LEMPCore.Module.gateway = function(oMessage, sServiceName, sAction, oServiceInfo )
                        {
                            require(["requestProcInst"], function(requestProc)
                            {
                                oMessage.sServiceName = sServiceName;
                                oMessage.sAction = sAction;
                                oMessage.service_info = oServiceInfo;
                                requestProc.request(oMessage);
                            });
                        };
                        
                        contentWindow.LEMP.FStorage = storage.getVolatileData();
                        contentWindow.LEMP.MStorage = storage.getNonVolatileData();
                        contentWindow.LEMP.Device.Info = device.getDeviceInfo(); 
                        
                        that.trigger("load", that);
                    }
                    
                });
                
                
            },
            /**
             *  WebviewView Callback 함수 호출 </br>
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
             * @param callbackName String 콜백 함수명
             * @param data Object 콜백 함수에 전달할 데이터
             * @param serviceinfo Object 콜백 컨트롤 데이터
             *  
             * @return 
             */
            callback:function(callbackName, data, serviceinfo )
            {
	            console.log("serviceinfo in callback manager"+JSON.stringify(serviceinfo));
	            if(callbackName)
	            {
	                this.el.contentWindow.LEMPCore.CallbackManager.responser(
	                    { callback : callbackName },
	                    { message:data },
	                    serviceinfo
	                );
	            }
            },
            /**
             *  WebviewView Event 발생 함수 호출 </br>
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
             * @param eventName String 이벤트 명 
             * @param data Object 이벤트로 전달할 데이터
             *  
             * @return 
             */
            dispatchEvent:function(eventName, data)
            {
                this.el.contentWindow.LEMPCore.EventManager.responser(
                    { eventname : eventName },
                    { message:data }
                );
            },
            /**
             *  WebviewView Viewport 조회 </br>
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
            getViewport:function()
            {
                return $(this.el.contentWindow.document.head).find("meta[name=viewport]").attr("content");
            },
            /**
             *  WebviewView 페이지 새로고침 </br>
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
            refresh:function()
            {
                this.el.contentWindow.location.reload();
            },
            /**
             *  WebviewView Script 실행 </br>
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
             * @param String command Script
             *  
             * @return 
             */
            execute:function(command)
            {
                this.el.contentWindow.eval(command);
            }
        });
          
        return WebviewView;
    });
    
    /**
     * 
     * 01.클래스 설명 : storageInst 클래스 .</br> 
     * 02.제품구분 : LEMP Emulator</br>
     * 03.기능(콤퍼넌트) 명 : Storage 관련 기능 정의 </br>
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
    
    define("storageInst", [ 'jquery', 'backbone' ], function($, Backbone) {
        var LOCALSTORAGE_PREPIX = "LEMP:EMULATOR:FSTORAGE:";
        var Storage = Backbone.Model.extend(
        {
            defaults : {},
            /**
             *  Storage 저장 </br>
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
             * @param Object data Storage에 저장할 데이터
             *  
             * @return 
             */
            setVolatileData:function(data)
            {
                for(var key in data)
                {
                    localStorage.setItem(LOCALSTORAGE_PREPIX + key, data[key]);
                };
            },
            /**
             *  Storage 조회 </br>
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
             * @param String key Storage에 저장한 키값
             *  
             * @return String result 저장한 Data
             */
            getVolatileData:function(key)
            {
                var result = undefined;
                if(key) { result = localStorage.getItem(LOCALSTORAGE_PREPIX + key); }
                else
                {
                    result = {};
                    var prepixLength = LOCALSTORAGE_PREPIX.length;
                    for(var key in localStorage)
                    {
                        if(key.indexOf(LOCALSTORAGE_PREPIX)!=-1) 
                        { 
                            result[key.substr(prepixLength)] = localStorage.getItem(key); 
                        } 
                    }
                }
                return result;
            },
            /**
             *  Storage 삭제 </br>
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
             * @param String key Storage에 저장한 키값
             *  
             * @return 
             */
            removeVolatileData:function(key)
            {
                localStorage.removeItem(LOCALSTORAGE_PREPIX + key);
            },
            /**
             *  Storage 비우기 </br>
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
            clearVolatileData:function()
            {
                for(var key in localStorage)
                {
                    if(key.indexOf(LOCALSTORAGE_PREPIX)!=-1) 
                    { 
                        localStorage.removeItem(key); 
                    } 
                }
            },
            /**
             *  Properties 저장 </br>
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
             * @param Object data Storage에 저장할 데이터
             *  
             * @return 
             */
            setNonVolatileData:function(data)
            {
                this.set(data);
            },
            /**
             *  Properties 조회 </br>
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
             * @param String key Storage에 저장한 키값
             *  
             * @return Variable result 저장한 Data
             */
            getNonVolatileData:function(key)
            {
                return key ? this.get(key) : this.attributes;
            },
            /**
             *  Properties 삭제 </br>
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
             * @param String key Storage에 저장한 키값
             *  
             * @return 
             */
            removeNonVolatileData:function(key)
            {
                this.unset(key);
            }
            
        });
        return new Storage();
    });
    /**
     * 
     * 01.클래스 설명 : requestProcInst 클래스 .</br> 
     * 02.제품구분 : LEMP Emulator</br>
     * 03.기능(콤퍼넌트) 명 : 서버통신 기능 정의 </br>
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
    
    define("requestProcInst", [ 'jquery', 'backbone' ], function($, Backbone) {
        var RequestProc = function(){};
        
        RequestProc.prototype = {
            requestStack : [],
            /**
             *  통신 Request 저장 </br>
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
             * @param Object message 요청 명령 데이터
             *  
             * @return 
             */
            request:function(message)
            {
                this.requestStack.push(message);
                if(this.requestStack.length===1) { this.executeRequest(); }
            },
            /**
             *  통신 Requst 요청 목록 순차 처리 </br>
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
            complete:function()
            {
                this.requestStack.shift();
                if(this.requestStack.length>0) { this.executeRequest(); }
            },
            /**
             *  통신 Requst 실행 </br>
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
            executeRequest:function()
            {
                var message = this.requestStack[0];
                var now = new Date();
                var strDate = now.toISOString().substr(0,10).replace(/-/g,""); 
                var millisecond = now.getTime() - new Date(now.getFullYear(),now.getMonth(),now.getDate(),1,0,0).getTime();
                var reqId = strDate + "-" + millisecond;
                    
                location.href=location.pathname + "#/" + message.id + "/" + encodeURIComponent(JSON.stringify(message)) + "/" + reqId;
            }
        };
        return new RequestProc();
    });
    /**
     * 
     * 01.클래스 설명 : configurationInst 클래스 .</br> 
     * 02.제품구분 : LEMP Emulator</br>
     * 03.기능(콤퍼넌트) 명 :  Emulator 설정 관련 기능</br>
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
    
    define("configurationInst", [ 'jquery', 'backbone' ], function($, Backbone) {
        var Configuration = Backbone.Model.extend({
            defaults : 
            {
                serverIp : "218.55.79.206",
                serverPort : "80",
                serverContextRoot : "lemp-ldcc",
                serverSsl : false,
            }
        });
        return new Configuration();
    });
    
    /**
     * 
     * 01.클래스 설명 : serverInst 클래스 .</br> 
     * 02.제품구분 : LEMP Emulator</br>
     * 03.기능(콤퍼넌트) 명 :  Server 설정 관련 기능</br>
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
    
    define("serverInst", [ 'jquery', 'backbone', "appInst" ], function($, Backbone, app) {
        var ERROR_NETWORK_TIMEOUT = "ES0001"
        var ERROR_NO_IP = "ES0002"
    	
    	var REQUEST_TIMEOUT = 20000;
        var DEFAULT_RESPONSE = 
        {
            "header" :
            {
                "result" : true,
                "error_code" : "",
                "error_text" : "",         
                "info_text" : "",         
                "message_version" : "",         
                "login_session_id" : "",         
                "trcode" : ""
            },
            "body" :
            {
            }
        };
        var Server = Backbone.Model.extend({
            defaults : 
            {
                ip : "1.1.1.1",
                port : "8080",
                contextRoot : "lemp",
                ssl : "N",
                url : ""
            },
            /**
             *  serverInst 초기화 </br>
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
            initialize:function()
            {
                app.bind("changeAppConfig", this.updateUrl);
                this.updateUrl();
            },
            /**
             *  server 통신 에러 처리 </br>
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
             * @return ERROR_NETWORK_TIMEOUT String 통신에러코드
             */
            getErrorNextworkTimeout:function()
            {
            	return ERROR_NETWORK_TIMEOUT;
            },
            /**
             *  server 설정값 업데이트 </br>
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
            updateUrl:function()
            {
                this.set(app.getAppConfig("server"));
                this.set("url", "http" + (this.get("ssl")==="Y" ? "s" : "") + "://" + (this.get("ip") || "0") + ":" + (this.get("port") || "80") + "/" + this.get("contextRoot") + "/");
            },
            /**
             *  server 전문 요청 </br>
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
             * @param String trcode 전문코드
             * @param String message 전문코드
             * @param String callback 전문코드
             * @param Object callback 제어 데이터
             *  
             * @return 
             */
            requestTr:function(trcode, message, callback, serviceinfo)
            {
                if(this.get("ip")==="") 
                { 
                	console.error("serverInst.requestTr - There is no ip. " + ERROR_NO_IP);
                	var response = $.extend(false, DEFAULT_RESPONSE,
                    {
                        header : 
                        {
                            result : false,
                            error_code : ERROR_NO_IP,
                            error_text : ""
                        }
                    });
                    callback(response, serviceinfo);
                	return; 
                }
                
                var reqUrl = this.get("url") + trcode+".json";
                var strMessage = JSON.stringify(message);
                $.ajax({
                    url:reqUrl,
                    type:'GET',
                    dataType:'jsonp',
                    data:{'message':strMessage},
                    timeout:REQUEST_TIMEOUT,
                    success:function(json) {
                        callback(json,serviceinfo); 
                    },
                    error:function(xhr, textStatus, errorThrown) {
                        console.error("serverInst.requestTr - ajax error. " + xhr.statusText + " / " + xhr.status);
                        
                        var response = $.extend(false, DEFAULT_RESPONSE,
                        {
                            header : 
                            {
                                result : false,
                                error_code :ERROR_NETWORK_TIMEOUT,
                                error_text : textStatus
                            }
                        });
                        callback(response, serviceinfo);
                    }
                });
                
            },
            /**
             *  server Login 전문 요청 </br>
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
             * @param String trcode 전문코드
             * @param String message 전문코드
             * @param String callback 전문코드
             *  
             * @return 
             */
            login:function(id, password, trcode, message, callback)
            {
                var that = this;
                require(["appInst"], function(app)
                {
                    var appKey = app.getAppConfig("app").appKey;
                    var reqLOGIN = {
                        "header": {
                            "trcode": "LOGIN",
                            "error_text": "",
                            "info_text": "",
                            "message_version": "",
                            "result": true,
                            "error_code": "",
                            "login_session_id": ""
                        },
                        "body": {
                           "user_id": id,
                            "os_type": "emulator",
                            "legacy_message": message,
                            "legacy_trcode": trcode,
                            "password": password,
                            "emulator_flag": true,
                            "device_id": "",
                            "app_key": appKey,
                            "phone_number": "",
                            "manual_phone_number": false
                        }
                    };
                    that.requestTr(reqLOGIN.header.trcode, reqLOGIN, function(resLOGIN)
                    {
                        var result = resLOGIN.header.result ? resLOGIN.body.legacy_message : resLOGIN;
                        if(callback) callback(result);          
                    });
                });
            }
            
                
        });
        return new Server();
    });
    
    /**
     * 
     * 01.클래스 설명 : MessageBoxView 클래스 .</br> 
     * 02.제품구분 : LEMP Emulator</br>
     * 03.기능(콤퍼넌트) 명 : MessageBox 관련 기능 정의 </br>
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
    
    define("MessageBoxView", ['jquery', 'backbone', 'underscore'], function($, Backbone, _) {
        var MessageBoxView = Backbone.View.extend({
            className : "layPop messageBox",
            tagName : "aside",
            template : _.template($("script.messageBoxTemplate").html()),
            title : "",
            message : "",
            buttons:undefined,
            /**
             *  MessageBoxView 초기화 </br>
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
            initialize:function()
            {
                this.$el.html(this.template());
                this.buttons = new Array();
            },
            events : 
            {
                "click #btnCancel" : "executeCancel",
                "click #btnConfirm" : "executeConfirm"
            },
            /**
             *  MessageBox 제목 설정 </br>
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
            setTitle:function(title)
            {
                this.title = title;
            },
            /**
             *  MessageBox 내용 설정 </br>
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
             * @param message String 확인창 내용
             *  
             * @return 
             */
            setMessage:function(message)
            {
                this.message = message;
            },
            /**
             *  MessageBox 버튼 추가 </br>
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
             * @param text String 버튼 텍스트
             * @param callback Function 버튼 Listener
             *  
             * @return 
             */
            addButton:function(text, callback)
            {
                this.buttons.push({ text:text,callback:callback});
            },
            /**
             *  MessageBox 취소버튼 Callback 실행 </br>
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
            executeCancel : function () {
                var buttons = this.buttons;
                
                if(buttons[1] && buttons[1].callback) { this.currentScreen.getWebviewView().callback(buttons[1].callback); };
                this.remove();
            },
            /**
             *  MessageBox 취소버튼 Confirm 실행 </br>
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
            executeConfirm : function () {
                var buttons = this.buttons;
                
                if(buttons[0] && buttons[0].callback) { this.currentScreen.getWebviewView().callback(buttons[0].callback); };
                this.remove();
            },
            /**
             *  MessageBox 생성 </br>
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
             * @param ScreenView currentScreen 현재 스크린 뷰
             *  
             * @return Object result MessageBox Object
             */
            render:function(currentScreen)
            {
                var title = this.title;
                var message = this.message;
                var buttons = this.buttons;
                var isAlert = (buttons.length <=1);
                this.currentScreen = currentScreen;
                
                var $title = this.$el.find("#title"),
                    $message = this.$el.find("#message"),
                    $btnConfirm = this.$el.find("#btnConfirm"),
                    $btnCancel = this.$el.find("#btnCancel");
                
                $title.text(title);
                $message.text(message);
                
                if(isAlert)
                {
                    if(buttons[0] && buttons[0].text) { $btnConfirm.text(buttons[0].text); }
                    $btnCancel.addClass("hide");
                } 
                else
                {
                    $btnCancel.removeClass("hide");
                    if(buttons[0] && buttons[0].text) { $btnConfirm.text(buttons[0].text); }
                    if(buttons[1] && buttons[1].text) { $btnCancel.text(buttons[1].text); }
                }
                
                return this;
                
                
            }
        });
        return MessageBoxView; 
    });
    
    /**
     * 
     * 01.클래스 설명 : ButtonView 클래스 .</br> 
     * 02.제품구분 : LEMP Emulator</br>
     * 03.기능(콤퍼넌트) 명 :  ButtonView 관련 기능 정의</br>
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
    
    define("ButtonView", ['jquery', 'backbone', 'underscore'], function($, Backbone, _) {
        var ButtonView = Backbone.View.extend({
            tagName: "Button",
            imagePath : "",
            callbackName : undefined,
            actionType : undefined,
            events: {
                "click": "click"
            },
            /**
             *  ButtonView 초기화 </br>
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
            initialize : function() {
                this.template = _.template($("script.buttonTemplate").html()); 
            },
            /**
             *  ButtonView Image 넣기 </br>
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
             * @param String path 이미지 경로
             *  
             * @return 
             */
            setImage:function(path)
            {
                this.imagePath = !path || path.substr(0,4)==="http" ? path : rootContentsDir + path;
            },
            /**
             *  ButtonView 만들기 </br>
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
             * @param String path 이미지 경로
             *  
             * @return Object result ButtonView Object
             */
            render:function()
            {
                this.$el.html(this.template(this));
                return this;
            },
            /**
             *  ButtonView Click Event 핸들러 </br>
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
            click:function()
            {
                if(this.actionType) this[this.actionType]();
            },
            /**
             *  ButtonView Click Event 핸들러 세팅 </br>
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
             * @param String 동작 타입
             *  
             * @return 
             */
            setActionType:function(actionType)
            {
                this.actionType = actionType; 
            },
            /**
             *  ButtonView Click Event 핸들러 실행 </br>
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
             * @param String path 이미지 경로
             *  
             * @return 
             */
            _actionCallback:function()
            {
                var callbackName = this.callbackName;
                require(["screensViewInst"], function (screensView)
                {
                    screensView.getCurrentWebviewView().callback(callbackName);
                });
            },
            /**
             *  ButtonView 기본 BackButton Event 핸들러 </br>
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
            _actionBack:function()
            {
                require(["screensViewInst", "contextMenuViewInst"], function (screensView, contextMenuView)
                {
                    contextMenuView.hide();
                    screensView.back();
                });
            },
            /**
             *  ButtonView 기본 HomeButton Event 핸들러 </br>
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
            _actionGoHome:function()
            {
                require(["screensViewInst", "contextMenuViewInst"], function (screensView, contextMenuView)
                {
                    contextMenuView.hide();
                    screensView.goMainScreen();
                });
            },
            /**
             *  ButtonView 기본 LogoutButton Event 핸들러 </br>
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
            _actionLogout:function()
            {
                require(["screensViewInst", "contextMenuViewInst"], function (screensView, contextMenuView)
                {
                    contextMenuView.hide();
                    screensView.goStartScreen();
                });
            },
            /**
             *  ButtonView Callback Event 핸들러 지정 </br>
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
             * @param String callbackName 콜백명
             *  
             * @return 
             */
            setCallback:function(callbackName)
            {
                this.callbackName = callbackName;
            }
        });
        ButtonView.ACTION = 
        {
            CALLBACK : "_actionCallback",
            GO_HOME : "_actionGoHome",
            BACK : "_actionBack",
            LOGOUT : "_actionLogout"
        };
        return ButtonView; 
    });
    
    /**
     * 
     * 01.클래스 설명 : TitleBarView 클래스 .</br> 
     * 02.제품구분 : LEMP Emulator</br>
     * 03.기능(콤퍼넌트) 명 :  TitleBarView 관련 기능 정의</br>
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
    
    define("TitleBarView", ['jquery', 'backbone', 'underscore'], function($, Backbone, _) {
        var TitleBarView = Backbone.View.extend({
            className: "titleBar",
            tagName: "header",
            visible : true,
            title : "",
            textColor : "",
            id : "",
            textAlign : "",
            height : "",
            textSize : "",
            backgroundImage : "",
            backgroundColor : "",
            leftButtons:undefined,
            rightButtons:undefined,
            /**
             *  TitleBarView 초기화 </br>
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
            initialize : function() 
            {
                this.leftButtons = new Array();
                this.rightButtons = new Array();
            },
            /**
             *  TitleBarView Visible 설정 </br>
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
             * @param boolean visible Visible 설정값
             *  
             * @return 
             */
            setVisible:function(visible)
            {
                this.visible = visible;
            },
            /**
             *  TitleBarView Title Text 설정 </br>
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
             * @param String title Title Text
             *  
             * @return 
             */
            setTitle:function(title)
            {
                this.title = title;
            },
            /**
             *  TitleBarView LeftButton 설정 </br>
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
             * @param ImageButton button 이미지 버튼 Object
             *  
             * @return 
             */
            addLeftButton:function(button)
            {
                this.leftButtons.push(button);
            },
            /**
             *  TitleBarView RightButton 설정 </br>
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
             * @param ImageButton button 이미지 버튼 Object
             *  
             * @return 
             */
            addRightButton:function(button)
            {
                this.rightButtons.push(button);
            },
            /**
             *  TitleBarView Title Text Color 설정 </br>
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
             * @param String colorCode 컬러 색상값
             *  
             * @return 
             */
            setTextColor:function(colorCode)
            {
                this.textColor = colorCode;
            },
            /**
             *  TitleBarView Title Text 정렬 설정 </br>
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
             * @param String textAlign 정렬 설정값
             *  
             * @return 
             */
            setTextAlign:function(textAlign)
            {
                this.textAlign = textAlign || "center";
            },
            /**
             *  TitleBarView 높이 설정 </br>
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
             * @param Number height 높이값
             *  
             * @return 
             */
            setHeight:function(height)
            {
                this.height = height;
            },
            /**
             *  TitleBarView Text크기 설정 </br>
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
             * @param Number textSize Text 크기 설정값
             *  
             * @return 
             */
            setTextSize:function(textSize)
            {
                this.textSize = textSize;
            },
            /**
             *  TitleBarView ID 설정 </br>
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
             * @param String id값
             *  
             * @return 
             */
            setId:function(id)
            {
                this.id = id;
            },
            /**
             *  TitleBarView Title 배경 이미지 설정 </br>
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
             * @param String imagePath 이미지 File Path
             *  
             * @return 
             */
            setBackgroundImage:function(imagePath)
            {
                this.backgroundImage = imagePath;
            },
            /**
             *  TitleBarView Title 배경 색 설정 </br>
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
             * @param String colorCode 컬러 색상값
             *  
             * @return 
             */
            setBackgroundColor:function(colorCode)
            {
                this.backgroundColor = colorCode;
            },
            /**
             *  TitleBarView 생성 </br>
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
             * @return Object result TitleBarView Object
             */
            render:function()
            {
                if(this.backgroundColor)
                {
                    var color = this.backgroundColor,
                        a = parseInt(color.substr(0,2),16) /255,
                        r = parseInt(color.substr(2,2),16),
                        g = parseInt(color.substr(4,2),16),
                        b = parseInt(color.substr(6,2),16);
                    color =  "rgba(" + r + "," + g+ "," + b + "," + a + ")";
                    this.$el.css("background-color", color);
                }
                
                if(this.backgroundImage) 
                { 
                    var backgroundImage = this.backgroundImage.substr(0,4)==="http" ? this.backgroundImage : rootContentsDir + this.backgroundImage; 
                    this.$el.css("background-image", "url(" + backgroundImage + ")"); 
                }
                var template = _.template($("script.titleBarTemplate").html());
                
                this.$el.html(template(this));
                
                var $leftButtons = this.$el.find(".leftButtons button");
                this.leftButtons.forEach(function(button, index)
                {
                    button.setElement($leftButtons.eq(index)).render();
                });
                var $rightButtons = this.$el.find(".rightButtons button");
                this.rightButtons.forEach(function(button, index)
                {
                    button.setElement($rightButtons.eq(index)).render();
                });
                
                if(this.textColor)
                {
                    var color = this.textColor,
                        a = parseInt(color.substr(0,2),16) /255,
                        r = parseInt(color.substr(2,2),16),
                        g = parseInt(color.substr(4,2),16),
                        b = parseInt(color.substr(6,2),16);
                    color =  "rgba(" + r + "," + g+ "," + b + "," + a + ")";
                    this.$el.find("h1, .leftButtons button, .rightButtons button").css("color", color);
                }
                
                if(this.textAlign)
                {
                    var positions = {"right":"flex-end", "left":"flex-start", "center":"center"}
                    this.$el.find("em").css("justify-content", positions[this.textAlign.toLowerCase()]);
                }
                if(this.height)
                {
                    this.$el.css("height", this.height+"px");
                }
                if(this.textSize)
                {
                    this.$el.find("em").css("font-size", this.textSize+"px");
                }
                
                if(this.visible) { this.show(); }
                else { this.hide(); }
                
                return this;
            }
        });
        return TitleBarView; 
    });
    
    /**
     * 
     * 01.클래스 설명 : ToolBarView 클래스 .</br> 
     * 02.제품구분 : LEMP Emulator</br>
     * 03.기능(콤퍼넌트) 명 :  ToolBarView 관련 기능 정의</br>
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
    
    define("ToolBarView", ['jquery', 'backbone', 'underscore'], function($, Backbone, _) {
        var ToolBarView = Backbone.View.extend({
            className: "toolBar",
            tagName: "nav",
            visible : true,
            title : "",
            backgroundImage : "",
            buttons:undefined,
            /**
             *  ToolBarView 초기화 </br>
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
             * @param String path 이미지 경로
             *  
             * @return 
             */
            initialize : function() 
            {
                this.buttons = new Array();
            },
            /**
             *  ToolBarView Visible 설정 </br>
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
             * @param boolean visible Visible 설정값
             *  
             * @return 
             */
            setVisible:function(visible)
            {
                this.visible = visible;
            },
            /**
             *  ToolBarView Button 추가 </br>
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
             * @param ImageButton button 이미지 버튼 Object
             *  
             * @return 
             */
            addButton:function(button)
            {
                this.buttons.push(button);
            },
            /**
             *  ToolBarView Title 배경 이미지 설정 </br>
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
             * @param String imagePath 이미지 File Path
             *  
             * @return 
             */
            setBackgroundImage:function(imagePath)
            {
                this.backgroundImage = imagePath;
            },
            /**
             *  ToolBarView 생성 </br>
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
             * @return Object result ToolBarView Object
             */
            render:function()
            {
                if(this.backgroundImage) 
                { 
                    var backgroundImage = this.backgroundImage.substr(0,4)==="http" ? this.backgroundImage : rootContentsDir + this.backgroundImage;
                    this.$el.css("background-image", "url(" + backgroundImage + ")"); 
                } 
                var template = _.template($("script.toolBarTemplate").html());
                
                this.$el.html(template(this));
                
                var $buttons = this.$el.find(".buttons button");
                this.buttons.forEach(function(button, index)
                {
                    button.setElement($buttons.eq(index)).render();
                });
                
                if(this.visible) { this.show(); }
                else { this.hide(); }
                
                return this;
            }
        });
        return ToolBarView; 
    });
    
    /**
     * 
     * 01.클래스 설명 : contextMenuViewInst 클래스 .</br> 
     * 02.제품구분 : LEMP Emulator</br>
     * 03.기능(콤퍼넌트) 명 :  contextMenuViewInst 관련 기능 정의</br>
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
    
    define("contextMenuViewInst", ['jquery', 'backbone', 'underscore'], function($, Backbone, _) {
        var ContextMenuView = Backbone.View.extend({
            el : "#contextMenu",
            events:
            {
                "click #btnBack" : "executeBack",
                "click #btnRefresh" : "executeRefresh",
                "click #btnRestart" : "executeRestart",
                "click #btnReset" : "executeReset",
                "click #btnConfiguration" : "executeConfiguration",
                "click #btnClose" : "executeClose"
            },
            /**
             *  contextMenuViewInst 초기화 </br>
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
            initialize : function() 
            {
                this.buttons = new Array();
            },
            /**
             *  이전 화면으로 이동 </br>
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
            executeBack:function()
            {
                require(["deviceInst", "contextMenuViewInst"], function (device, contextMenuView)
                {
                    contextMenuView.hide();
                    device.back();
                });
                this.removeTestActionViews();
                this.hide();
            },
            /**
             *  새로고침 실행 </br>
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
            executeRefresh:function()
            {
                require(["screensViewInst", "contextMenuViewInst"], function (screensView, contextMenuView)
                {
                    contextMenuView.hide();
                    var currentScreenView = screensView.getCurrentScreenView();
                    if(currentScreenView) { currentScreenView.refresh(); }
                });
                this.removeTestActionViews();
                this.hide();
            },
            /**
             *  다시 시작 </br>
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
            executeRestart:function()
            {
                location.reload();
                this.hide();
            },
            /**
             *  Emulator config 설정 초기화 </br>
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
            executeReset:function()
            {
                if(confirm("Are you sure to reset configuration?")) {
                    localStorage.clear();
                    location.reload();
                    this.hide();
                }
            },
            /**
             *   config 설정창 실행 </br>
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
            executeConfiguration:function()
            {
                require(["appConfigViewInst"], function (appConfigView)
                {
                    appConfigView.render().show();
                });
                this.hide();
            },
            /**
             *   config 설정창 닫기 </br>
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
            executeClose : function () {
                this.hide();
            },
            /**
             *   Test Action 설정창 삭제 </br>
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
            removeTestActionViews:function()
            {
                $("aside.testAction").remove();
            }
        
        });
        return new ContextMenuView(); 
    });
    
    /**
     * 
     * 01.클래스 설명 : appInst 클래스 .</br> 
     * 02.제품구분 : LEMP Emulator</br>
     * 03.기능(콤퍼넌트) 명 :  app 설정 관련 기능 정의</br>
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
    
    define("appInst", [ 'jquery', 'backbone', 'configPropertyInst' ], function($, Backbone, configProperty) {
        var App = Backbone.Model.extend({
            CONFIG_PATH : rootContentsDir + "LEMP/config/app.config",
            appConfig : configProperty.getAppConfig(), 
            defaults :
            {
                init : !!localStorage.getItem("LEMP:EMULATOR:init")
            },
            /**
             *  appInst 첫 실행인지 여부 </br>
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
             * @param boolean result  실행 여부
             *  
             * @return 
             */
            isFirst:function()
            {
                return !this.get("init");
            },
            /**
             *  appInst 초기화 </br>
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
            initialize:function()
            {
                if(this.isFirst()) {
                    localStorage.setItem("LEMP:EMULATOR:configPropertyName", "Default");
                    configProperty.saveDefault();
                }
            },
            /**
             *  appInst 설정창 실행 </br>
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
             * @param String category 설정창 카테고리 값
             *  
             * @return Object result 설정값 
             */
            getAppConfig:function(category)
            {
                var result = undefined;
                if(category) 
                { 
                    result = this.appConfig ? this.appConfig[category] || {} : {}; 
                }
                else { result = this.appConfig; }
                return result;
            },
            /**
             *  appInst 설정 값 저장 </br>
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
             * @param Object appConfig 설정값
             *  
             * @return 
             */
            saveAppConfig:function(appConfig)
            {
                this.appConfig = $.extend(this.getAppConfig(), appConfig);
                configProperty.saveAppConfig(this.appConfig);
                this.trigger("changeAppConfig");
            },
            /**
             *  appInst 사용자 설정값 초기화 </br>
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
             * @return boolean result 설정값 
             */
            initApp:function()
            {
                if(this.loadConfigFile())
                {
                    localStorage.setItem("LEMP:EMULATOR:init", true);
                    this.set("init", true);
                }
                else return false;
                return true;
            },
            /**
             *  appInst 사용자 설정값 읽어오기 </br>
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
             * @return Object result 설정값 
             */
            loadConfigFile:function()
            {
                var that = this;
                var result = undefined;
                var configPath = this.CONFIG_PATH;
                $.ajax({
                    url:configPath,
                    type:'POST',
                    async : false,
                    dataType:'json',
                    success:function(json) {
                        that.appConfig = $.extend(that.appConfig, json);
                        configProperty.saveAppConfig(that.appConfig);
                        that.trigger("loadConfig");
                        result = true;
                    },
                    error:function(xhr, textStatus, errorThrown) {
                        jQuery.error("Emulator Error:ajax error. " + xhr.statusText + " / " + xhr.status + " / path:" + configPath);
                        result = false;
                    }
                });
                return result;
            },
            setTitleBar:function() {
                
            },
            setToolBar:function() {
                
            }
        });
        
        return new App();
    });
    
    /**
     * 
     * 01.클래스 설명 : appConfigViewInst 클래스 .</br> 
     * 02.제품구분 : LEMP Emulator</br>
     * 03.기능(콤퍼넌트) 명 :  appConfig 설정화면 관련 기능 정의</br>
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
    
    define("appConfigViewInst", ['jquery', 'backbone', 'underscore', "appInst", "deviceInst", "testActionInst", 'configPropertyInst'], function($, Backbone, _, app, device, testAction, configProperty) {
        var AppConfigView = Backbone.View.extend({
            el : "#appConfig",
            testActionTemplate : _.template($("script.testActionTemplate").html()),
            propertyOptionTemplate : _.template($("script.propertyOptionTemplate").html()),
            events : 
            {
                "click #btnCancel" : "onClickBtnCancel",
                "click #btnSave" : "onClickBtnSave",
                "click .btnTab" : "onClickBtnTab",
                "click #testActionBox .title" : "onClickTestActionTitle",
                
                "click #btnNew" : "onClickBtnNew", 
                "click #btnDelete" : "onClickBtnDelete",
                "click #btnRename" : "onClickBtnRename",
                "change #currentProperty" : "onPropertySelected"
            },
             /**
             *  appConfigViewInst 초기화 </br>
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
            initialize:function()
            {
                this.setTab(0);
            },
             /**
             *  appConfigViewInst 실행 </br>
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
             * @param String configName 설정값 이름
             *  
             * @return Object result appConfigViewInst Object
             */
            render:function(configName)
            {
                var appConfig = configProperty.getAppConfig(configName);
                if(appConfig)
                {
                    this.$el.find("#serverIp").val(appConfig.server.ip).end()
                        .find("#serverPort").val(appConfig.server.port).end()
                        .find("#serverContext").val(appConfig.server.contextRoot).end()
                        .find("#serverSsl").val(appConfig.server.ssl).end()
                        .find("#appKey").val(appConfig.app.appKey).end();
                }
                
                var deviceInfo = configProperty.getDeviceInfo(configName);
                if(deviceInfo)
                {
                    for(var key in deviceInfo)
                    {
                        this.$el.find("#" + key).val(deviceInfo[key]);
                    }
                }
                
                var propertyList = configProperty.getPropertyList();
                var currentProperty = configName || configProperty.getConfigPropertyName();
                var $currentProperty = this.$el.find("#currentProperty");
                $currentProperty.html(this.propertyOptionTemplate({propertyList:propertyList}));
                $currentProperty.val(currentProperty);
                
                if(configName){testAction.resetAttritutes(configName);}
                this.$el.find("#testActionBox").html(this.testActionTemplate(testAction));
                
                return this;
            },
             /**
             *  취소버튼 Event handler </br>
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
            onClickBtnCancel:function()
            {
                this.hide();
            },
             /**
             *  저장버튼 Event handler </br>
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
            onClickBtnSave:function() 
            {
                if(this.save()) { this.hide(); }
            },
             /**
             *  신규 버튼 Event handler </br>
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
            onClickBtnNew:function () 
            {
                var newConfigName = "";
                var validConfigName = false;
                while(!validConfigName) 
                {
                    newConfigName = prompt("Please enter the name of configuration property");
                    if(!newConfigName || !configProperty.getConfigProperty(newConfigName))
                    {
                        validConfigName = true;
                    }
                    else {
                        alert("'" + newConfigName + "' exists. Please input another name");
                    }
                }
                if(newConfigName)
                {
                    var defaultConf = configProperty.getConfigProperty();
                    configProperty.saveConfigProperty(defaultConf, newConfigName);
                    this.$el.find("#currentProperty").append(this.propertyOptionTemplate({propertyList:[newConfigName]})).val();
                    this.render(newConfigName);
                    this.$el.find("#currentProperty").val(newConfigName);
                }
            },
             /**
             *  삭제 버튼 Event handler </br>
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
            onClickBtnDelete:function()
            {
                var configPropertyName = this.$el.find("#currentProperty").val();
                if(confirm('Are you sure to delete "' + configPropertyName + '" property?'))
                {
                    configProperty.removeConfigProperty(configPropertyName);
                    configProperty.setConfigPropertyName('Default');
                    this.render();
                }
            },
             /**
             *  사용자 정의 설정 변경 Button Event Handler </br>
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
            onClickBtnRename:function() 
            {
                var newConfigName = "";
                var validConfigName = false;
                while(!validConfigName) 
                {
                    newConfigName = prompt("Please enter the name of configuration property");
                    if(!newConfigName || !configProperty.getConfigProperty(newConfigName))
                    {
                        validConfigName = true;
                    }
                    else {
                        alert("'" + newConfigName + "' exists. Please input another name");
                    }
                }
                if(newConfigName)
                {
                    var oldConfigName = this.$el.find("#currentProperty").val();
                    var oldConfig = configProperty.getConfigProperty(oldConfigName);
                    
                    configProperty.saveConfigProperty(oldConfig, newConfigName);
                    configProperty.removeConfigProperty(oldConfigName);
                    
                    if(oldConfigName === configProperty.getConfigPropertyName())
                    {
                        configProperty.setConfigPropertyName(newConfigName);
                    }
                    this.render(newConfigName);
                }
            },
            /**
             *  사용자 정의 설정 Button Event Handler </br>
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
             * @param Event event Event Object
             *  
             * @return 
             */
            onPropertySelected:function(e)
            {
                var property = $(e.target).val();
                this.render(property);
            },
            /**
             *  설정 화면 Tab Button Event Handler</br>
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
             * @param Event event Event Object
             *  
             * @return 
             */
            onClickBtnTab:function(event)
            {
                this.setTab(this.$el.find(".btnTab").index(event.currentTarget));
            },
            /**
             *  Test Action 항목 Event Handler</br>
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
             * @param Event event Event Object
             *  
             * @return 
             */
            onClickTestActionTitle:function(event)
            {
                var $testActionBox = this.$el.find("#testActionBox");
                $testActionBox.find(".title")
                    .not(event.currentTarget).next().addClass("hide");
                $(event.currentTarget).next().toggleClass("hide");
            },
            /**
             *  설정 화면 Tab 화면 이동</br>
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
             * @param Number index 탭버튼 번호
             *  
             * @return 
             */
            setTab:function(index)
            {
                var $tabs = this.$el.find(".btnTab");
                var $target = $tabs.eq(index).addClass("on"); 
                $tabs.not($target).removeClass("on");
                    
                this.$el.find(".tabContents").eq(index).show()
                    .siblings(".tabContents").hide();
            },
            /**
             *  설정 화면 저장</br>
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
             * @param Number index 탭버튼 번호
             *  
             * @return 
             */
            save:function()
            {
                //Update config name
                var configName = this.$el.find("#currentProperty").val();
                configProperty.setConfigPropertyName(configName);
                
                //App 설정 저장
                var appConfig = 
                {
                    server : 
                    {
                        ip : this.$el.find("#serverIp").val(),
                        port : this.$el.find("#serverPort").val(),
                        contextRoot : this.$el.find("#serverContext").val(),
                        ssl : this.$el.find("#serverSsl").val()
                    },
                    app :
                    {
                        appKey : this.$el.find("#appKey").val()
                    }
                };
                app.saveAppConfig(appConfig);
                
                //Device 설정 저장
                var deviceInfo = {};
                $("input, select", "#deviceBox").each(function(index, value)
                {
                    deviceInfo[$(value).attr("id")] = $(value).val();
                });
                device.saveDeviceInfo(deviceInfo);
                
                //Test Response 설정 저장
                var testActionInfo = {};
                var isError = false;
                $("#testActionBox .testActionRecord").each(function(index, value)
                {
                    var actionId = $(value).find(".title span").text();
                    var response = undefined;
                    try { response = JSON.parse($(value).find(".response").val()); }
                    catch(e)
                    {
                        isError = true;
                        if(e.constructor === SyntaxError)
                        {
                            alert(actionId + "에 대한 response를 JSON 형식에 맞게 입력해주세요.");
                            return;
                            
                        }
                        else { jQuery.error("Emulator Error:unknown error."); }
                    }
                    var isFixed = $(value).find(".fixTestAction").is(":checked");
                    testActionInfo[actionId] = 
                    {
                        response : response,
                        isFixed : isFixed
                    };
                });
                if(!isError)
                {
                    testAction.set(testActionInfo);
                    this.setTab(0);
                    this.trigger("save");
                    location.reload();
                }
                return !isError;
            },
        });
        return new AppConfigView(); 
    });
    
    /**
     * 
     * 01.클래스 설명 : sqliteInst 클래스 .</br> 
     * 02.제품구분 : LEMP Emulator</br>
     * 03.기능(콤퍼넌트) 명 :  sqlite 관련 기능 정의</br>
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
    
    define("sqliteInst", [ 'jquery', 'backbone'], function($, Backbone) {
        var SQLite = Backbone.Model.extend({
            /**
             *  Database Open </br>
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
             * @param String dbName 데이타베이스 명
             *  
             * @return 
             */
            openDatabase:function(dbName)
            {
                return window.openDatabase(dbName, "1", "LEMP DB", 1024 * 1024);
            }
        });
        return new SQLite();
    });
    
    /**
     * 
     * 01.클래스 설명 : Action 클래스 .</br> 
     * 02.제품구분 : LEMP Emulator</br>
     * 03.기능(콤퍼넌트) 명 :  Action 관련 기능 정의</br>
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
    
    define("Action", [ 'jquery', 'backbone'], function($, Backbone) {
        var Action = Backbone.Model.extend({
            defaults : 
            {                
            },
            /**
             *  Action 초기화 </br>
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
             * @param Number index 탭버튼 번호
             *  
             * @return 
             */
            initialize:function(actionId, reqMessage)
            {
                this.set("id", actionId);
                this.set("reqMessage", reqMessage);
                if(reqMessage && reqMessage.param) { this.set("callbackName", reqMessage.param.callback); }
            },
        });
        return Action;
    });
    
    /**
     * 
     * 01.클래스 설명 : testActionInst 클래스 .</br> 
     * 02.제품구분 : LEMP Emulator</br>
     * 03.기능(콤퍼넌트) 명 :  testAction 제어 기능 정의</br>
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
    
    define("testActionInst", ['jquery', 'backbone', 'configPropertyInst'], function($, Backbone, configProperty) {
        var TestAction = Backbone.Model.extend({
            RESPONSE_PATH : rootEmulatorDir +  "res/test-responses.json",
            TEST_RESPONSES : [],
            defaults : 
            {
            },
             /**
             *  testActionInst 초기화 </br>
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
            initialize:function()
            {
                this.resetAttritutes();
                this.loadTestResponses();
            },
             /**
             *  testAction 설정 초기화 </br>
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
             * @param configName Object 테스트 응답 Data
             *  
             * @return 
             */
            resetAttritutes:function(configName)
            {
                this.attributes = {};
                var testResponses = configProperty.getTestResponseList(configName);
                for(var key in testResponses){
                    var responseInfo = testResponses[key];
                    this.constructor.__super__.set.apply(this, [key, responseInfo]);
                }
            },
             /**
             *  testAction 설정 저장 </br>
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
            set:function()
            {
                if(arguments[0] && arguments[0].constructor === Object)
                {
                    this.constructor.__super__.set.apply(this, Array.prototype.slice.call(arguments, 0));
                    var info = arguments[0];
                    for(var xrossApi in info)
                    {
                        configProperty.saveTestResponse($.extend(info[xrossApi], {xrossApi:xrossApi }));
                    }
                }
                else if(arguments[0].constructor === String)
                {
                    var xrossApi = arguments[0];
                    var responseInfo = 
                    {
                        response : arguments[1],
                        isFixed : arguments[2]
                    };
                    this.constructor.__super__.set.apply(this, [xrossApi, responseInfo]);
                    configProperty.saveTestResponse($.extend(responseInfo,{xrossApi : xrossApi}));
                }
            },
             /**
             *  testAction 설정 반환 </br>
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
            get:function(key)
            {
                var result = this.constructor.__super__.get.apply(this,[key]);
                if(!!!result)
                {
                    result = this.TEST_RESPONSES[key];
                }
                return result;
            },
             /**
             *  testAction 설정 적용 </br>
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
            loadTestResponses:function()
            {
                var that = this; 
                var responsePath = that.RESPONSE_PATH;
                $.ajax({
                    url:responsePath,
                    type:'POST',
                    dataType:'json',
                    async : false,
                    success:function(responses) 
                    {
                        require(['requestProcInst'], function (requestProc)
                        {
                            if(responses.constructor === Object) 
                            {
                                for(var servicename in responses)
                                {
                                    var actions = responses[servicename]; 
                                    for(var actName in actions)
                                    {
                                        var response = actions[actName];
                                        var actionId = "LEMP." + servicename +"." + actName;
                                        that.TEST_RESPONSES[actionId] = 
                                        {
                                            "response" : response,
                                            "isFixed" : false
                                        };
                                    }
                                }
                            }
                        });
                    },
                    error:function(xhr, textStatus, errorThrown) 
                    {
                        if(textStatus === "parsererror") 
                        {
                        }
                        else 
                        {
                            jQuery.error("Emulator Error:ajax error. " + xhr.statusText + " / " + xhr.status + " / path:" + responsePath);                          
                        }
                    }
                });
            }
        });
        var testAction = new TestAction();
        return testAction;
    });
    
    /**
     * 
     * 01.클래스 설명 : TestActionView 클래스 .</br> 
     * 02.제품구분 : LEMP Emulator</br>
     * 03.기능(콤퍼넌트) 명 :  testAction 설정화면 관련 기능 정의</br>
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
    
    define("TestActionView", ['jquery', 'backbone', 'underscore', 'testActionInst'], function($, Backbone, _, testAction) {
        var TestActionView = Backbone.View.extend({
            tagName:"aside",
            className:"testAction layPop",
            template : _.template($("script.testActionViewTemplate").html()),
            action : undefined,
            response : undefined,
            events:
            {
                "click #btnSubmit" : "executeSubmit",
                "click #btnClose" : "executeClose"
            },
             /**
             *  TestActionView 초기화 </br>
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
            initialize : function() 
            {
                
            },
             /**
             *  TestAction 데이터 전송 </br>
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
            executeSubmit:function()
            {
                var response = undefined;
                var xrossApi = this.$el.find("#xrossApi").text();
                var fix = this.$el.find(".fixTestAction").is(":checked");
                try
                {
                    response = JSON.parse(this.$el.find(".response").val());
                }
                catch(e)
                {
                    if(e.constructor === SyntaxError)
                    {
                        alert("response를 JSON 형식에 맞게 입력해주세요.");
                        return;
                    }
                    else { jQuery.error("Emulator Error:unknown error."); }
                }
                if(response) 
                { 
                    testAction.set(xrossApi, response, fix);
                    var callbackName = this.action.get("callbackName");
                    require(["screensViewInst"], function (screensView)
                    {
                        screensView.getCurrentWebviewView().callback(callbackName, response);
                    });
                    this.hide();
                }
            },
             /**
             *  TestAction 화면 닫기 </br>
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
            executeClose:function() 
            {
                this.hide();
            },
            /**
             *  TestAction 데이터 저장 </br>
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
            setAction:function(action)
            {
                this.action = action;
            },
            /**
             *  TestAction 화면 로드 </br>
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
             * @return Object result TestActionInst Object 
             */
            render:function()
            {
                var id = this.action.get("id");
                var reqMessage = this.action.get("reqMessage");
                var xrossApi = "LEMP." + reqMessage.sServiceName + "." + reqMessage.sAction;
                var responseInfo = testAction.get(xrossApi) || {};
                
                this.$el.html(this.template({
                    actionId : id,
                    xrossApi : xrossApi,
                    responseInfo : responseInfo
                }));
                
                return this;
            },
            /**
             *  TestAction 화면 열기 </br>
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
            show:function()
            {
                this.$el.prependTo('body');
            },
            /**
             *  TestAction 화면 닫기 </br>
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
            hide:function()
            {
                this.remove();
            }
        });
        return TestActionView; 
    });
    
    /**
     * 
     * 01.클래스 설명 : ToastView 클래스 .</br> 
     * 02.제품구분 : LEMP Emulator</br>
     * 03.기능(콤퍼넌트) 명 :  Toast 메세지 관련 기능 정의</br>
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
    
    define("ToastView",['jquery', 'backbone'], function ($, Backbone) {
        var ToastView = Backbone.View.extend({
            className : "toastMessage",
            template : _.template($("script.toastMessageTemplate").html()),
             /**
             *  ToastView 초기화 </br>
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
            initialize:function()
            {
                this.$el.html(this.template());
            },
            events : 
            {
            },
             /**
             *  ToastView 로드 </br>
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
             * @param String message Toast 뷰 UI ID
             *  
             * @return 
             */
            render:function(message)
            {
                this.$el.find(".message").text(message);
                return this;
            },
             /**
             *  ToastView 열기 </br>
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
             * @param Object reqParam Toast 옵션값
             *  
             * @return 
             */
            show:function(reqParam)
            {
                var that = this;
                var duration = reqParam.param.duration;
                var message = reqParam.param.message;
                
                if(duration === "long") 
                { 
                    duration = 4000; 
                } 
                else 
                {
                    duration = 2000;
                }
                
                this.render(message).$el.appendTo("body");
                setTimeout(function() 
                {
                    that.remove();
                }, duration);
            },
             /**
             *  ToastView 닫기 </br>
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
            destroy:function()
            {
                this.remove();
            }
        });
        return ToastView;
    });
    
    /**
     * 
     * 01.클래스 설명 : configPropertyInst 클래스 .</br> 
     * 02.제품구분 : LEMP Emulator</br>
     * 03.기능(콤퍼넌트) 명 :  configPropertyInst 관련 기능 정의</br>
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
    
    define("configPropertyInst", ['jquery', 'backbone'], function ($, Backbone) {
        var CONFIG_PROP_PREFIX = "LEMP:EMULATOR:CONFIG:";
        var CUR_PROP_NAME = "LEMP:EMULATOR:configPropertyName";
        var ConfigProperty = Backbone.Model.extend({
            defaults : 
            {
                configPropertyName : localStorage.getItem(CUR_PROP_NAME) || 'Default',
                configProperty : {}
            },
             /**
             *  configPropertyInst 초기화 </br>
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
            initialize:function()
            {
                this.set("configProperty", this.getConfigProperty());
            },
             /**
             *  config 설정 저장 </br>
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
            saveDefault:function()
            {
                var that = this;
                require(['serverInst'], function (server)
                {
                    var appConfig = 
                    {
                        server : 
                        {
                            ip : server.get('ip'),
                            port : server.get('port'),
                            contextRoot : server.get('contextRoot'),
                            ssl : server.get('ssl')
                        },
                        app :
                        {
                            appKey : "BM30ANP0"
                        }
                    };
                    that.saveAppConfig(appConfig);
                    that.saveDeviceInfo({});
                });
            },  
             /**
             *  config 설정 값 이름 반환 </br>
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
             * @return String result config 설정 값 이름
             */
            getConfigPropertyName:function()
            {
                return this.get('configPropertyName'); 
            },
             /**
             *  config 설정 값 이름 저장 </br>
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
             * @param String configName config 설정 값 이름
             *  
             * @return 
             */
            setConfigPropertyName:function(configName)
            {
                if(configName) {
                    localStorage.setItem(CUR_PROP_NAME, configName);
                    this.set("configPropertyName", configName);
                }
            },
             /**
             *  config 설정 값 가져오기 </br>
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
             * @param String configName config 설정 값 이름
             *  
             * @return Object configInfo config 설정 값
             */
            getConfigProperty:function(configName)
            {
                var configPropertyName = configName || this.getConfigPropertyName();
                var configInfo = localStorage.getItem(CONFIG_PROP_PREFIX + configPropertyName);
                
                try
                {
                    if(!configInfo) 
                    { 
                        configInfo = undefined; 
                    }
                    else 
                    {
                        configInfo = JSON.parse(configInfo);
                    }
                }
                catch(error) {configInfo = undefined; }
                return configInfo;
            },
             /**
             *  config 설정 값 저장하기 </br>
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
             * @param String configPropertyName config 설정 값 이름
             * @param Object configInfo config 설정 값
             *  
             * @return 
             */
            saveConfigProperty:function(configInfo, configPropertyName)
            {   
                var propName = configPropertyName || this.getConfigPropertyName();
                localStorage.setItem(CONFIG_PROP_PREFIX + propName, JSON.stringify(configInfo));
                this.set('configProperty', configInfo);
            },
             /**
             *  config 설정 값 삭제하기 </br>
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
             * @param String configPropertyName config 설정 값 이름
             *             
             * @return 
             */
            removeConfigProperty:function(configName)
            {
                localStorage.removeItem(CONFIG_PROP_PREFIX + configName);
            },
             /**
             *  config 목록 가져오기 </br>
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
             * @return Array result config 설정 목록
             */
            getPropertyList:function()
            {
                var result = [];
                for(var key in localStorage)
                {
                    if(key.indexOf(CONFIG_PROP_PREFIX)!=-1) 
                    { 
                        result.push(key.substr(CONFIG_PROP_PREFIX.length));
                    } 
                }
                return result;
            },
             /**
             *  config 단말기 정보 가져오기 </br>
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
             * @param  String configName config 설정 값 이름
             *             
             * @return Object result Device Info Object
             */
            getDeviceInfo:function(configName)
            {
                var configInfo = this.getConfigProperty(configName) || {};
                return configInfo['deviceInfo'];
            },
             /**
             *  config 단말기 정보 저장하기 </br>
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
             * @param Object deviceInfo  Device Info Object
             *             
             * @return 
             */
            saveDeviceInfo:function(deviceInfo)
            {
                var configInfo = this.getConfigProperty() || {};
                configInfo['deviceInfo'] = deviceInfo;
                this.saveConfigProperty(configInfo);
            },
             /**
             *  config 단말기 정보 가져오기 </br>
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
             * @param String configName config 설정 값 이름
             *             
             * @return 
             */
            getAppConfig:function(configName)
            {
                var configInfo = this.getConfigProperty(configName) || {};
                return configInfo['appConfig'];
            },
             /**
             *  config 단말기 정보 저장하기 </br>
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
             * @param Object appConfig App Config 설정 값
             *             
             * @return 
             */
            saveAppConfig:function(appConfig)
            {
                var configInfo = this.getConfigProperty() || {};
                configInfo['appConfig'] = appConfig;
                this.saveConfigProperty(configInfo);
            },
             /**
             *  TestResponse 목록 가져오기</br>
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
             * @param String configName Config 설정 값 이름
             *             
             * @return Object testResponses testResponses 설정 값
             */
            getTestResponseList:function(configName){
                var configInfo = this.getConfigProperty(configName) || {};
                return configInfo['testResponses'];
            },
             /**
             *  TestResponse 값 가져오기</br>
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
             * @param Object xrossApi API ID
             *             
             * @return Object result TestResponse 값
             */
            getTestResponse:function(xrossApi)
            {
                var configInfo = this.getConfigProperty() || {};
                var testResponses = configInfo['testResponses'] || {};
                return testResponses[xrossApi];
            },
             /**
             *  TestResponse 값 저장하기</br>
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
             * @param Object testResponse TestResponse 값
             *             
             * @return 
             */
            saveTestResponse:function(testResponse)
            {
                var configInfo = this.getConfigProperty();
                var testResponses = this.getTestResponseList() || {};
                testResponses[testResponse.xrossApi] = {
                    response : testResponse.response,
                    isFixed : testResponse.isFixed
                };
                configInfo['testResponses'] = testResponses;
                this.saveConfigProperty(configInfo);
            }
        });
        return new ConfigProperty();
    });
    
    /**
     * 
     * 01.클래스 설명 : databaseInst 클래스 .</br> 
     * 02.제품구분 : LEMP Emulator</br>
     * 03.기능(콤퍼넌트) 명 :  databaseInst 관련 기능 정의</br>
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
    
    define("databaseInst", ['jquery', 'backbone'], function ($, Backbone) {
        var Database = Backbone.Model.extend({
            db:undefined,
            defaults:{
                dbName : '',
                version:'1.0',
                description:'LEMP Database',
                size: 5*1024*1024
            },
            /**
             *  database 이름저장 </br>
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
            setDbName:function(dbName)
            {
                this.set('dbName', dbName);
            },
            /**
             *  database 조회 </br>
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
            getDbName:function()
            {
                return this.get('dbName');
            },
            /**
             *  database 버전 조회 </br>
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
            getVersion:function()
            {
                return this.get('version');
            },
            /**
             *  database 설명 조회 </br>
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
            getDescription:function()
            {
                return this.get('description');
            },
            /**
             *  database 크기 조회 </br>
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
            getSize:function()
            {
                return this.get('size');
            },
            /**
             *  database 생성 </br>
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
             * @param dbName String 데이터베이스명
             * @param success Function 데이터베이스 성공 이벤트 핸들러
             * @param error Function 데이터베이스 실패 이벤트 핸들러
             *  
             * @return 
             */
            openDatabase:function(dbName, success, error)
            {
                this.setDbName(dbName);
                try{
                    this.db = window.openDatabase(dbName, this.getVersion(), this.getDescription(), this.getSize());
                    success();
                }
                catch(err)
                {
                    error(err);
                }
            },
            /**
             *  Sql 쿼리 실행 </br>
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
             * @param String query      실행할 SQL SELECT 쿼리문.
             * @param Array bindArray       쿼리문의 각 변수 위치에 대입해줄 값의 배열.
             * @param Function success      SQL쿼리문 실행 성공 후 호출되는 callback 함수.
             * @param Function error        SQL쿼리문 실행 실패 후 호출되는 callback 함수.
             *  
             * @return 
             */
            executeSql:function(query, bindArray, success, error)
            {
                var db = this.db;
                if(db)
                {
                    db.transaction(function(tx) 
                    {
                        tx.executeSql(query, bindArray, successHandler, errorHandler);
                    });
                    function successHandler(tx, rs) 
                    {
                        var res = 
                        {
                            result : true,
                            insert_id : "",
                            affected_number : rs.rowsAffected,
                            result_set:{
                                rows : []
                            }
                        };
                        
                        var length = rs.rows.length;
                        for(var i=0;i<length;i++)
                        {
                            res.result_set.rows.push(rs.rows.item(i));
                        }
                        
                        if(query.toLowerCase().trim().slice(0, 6) == "insert")
                        {
                            res.insert_id = rs.insertId;
                        }
                        success(res);
                    }
                    
                    function errorHandler(tx, err) 
                    {
                        var error_message = {
                            result : false,
                            exception_msg : err.message
                        };
                        typeof error == 'function' && error(error_message);
                    }
                }
            },
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
             * @param String query      실행할 SQL SELECT 쿼리문.
             * @param Array bindArray       쿼리문의 각 변수 위치에 대입해줄 값의 배열.
             * @param Function success      SQL쿼리문 실행 성공 후 호출되는 callback 함수.
             * @param Function error        SQL쿼리문 실행 실패 후 호출되는 callback 함수.
             *  
             * @return 
             */
            executeBatchSql:function(query, bindArray, success, error)
            {
                var db = this.db;
                if(db)
                {
                    if(query && bindArray.constructor == Array)
                    {
                        var resultset =
                        {
                            result : true,
                            insert_ids : [],
                            rows : [],
                            affected_number : 0
                        };
                        
                        db.transaction(function(tx)
                        {
                            bindArray.forEach(function(item, index) 
                            {
                                tx.executeSql(query, item, successHandler, errorHandler);
                            });
                            
                        }, null, function(){ //success transaction
                            success(resultset);
                        });
                        
                        function successHandler(tx, rs) {
                            if(query.toLowerCase().trim().slice(0, 6) == "insert")
                            {
                                resultset.insert_ids.push(rs.insertId);
                            }
                            resultset.affected_number+=rs.rowsAffected;
                        }
                        
                        function errorHandler(tx, err){
                            var error_message = {
                                result : false,
                                exception_msg : err.message
                            };
                            typeof error == 'function' && error(error_message);
                            return true;//roleback
                        }
                        
                    }
                }
            },
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
             * @param String query      실행할 SQL SELECT 쿼리문.
             * @param Array bindArray       쿼리문의 각 변수 위치에 대입해줄 값의 배열.
             * @param Function success      SQL쿼리문 실행 성공 후 호출되는 callback 함수.
             * @param Function error        SQL쿼리문 실행 실패 후 호출되는 callback 함수.
             *  
             * @return 
             */
            executeSelect:function(query, bindArray, success, error)
            {
                var db = this.db;
                if(db)
                {
                    db.readTransaction(function(tx)
                    {
                        tx.executeSql(query, bindArray, successHandler, errorHandler);
                        
                    });
                    
                    function successHandler(tx, rs) 
                    {
                        var res = 
                        {
                            result : true,
                            affected_number : rs.rowsAffected,
                            result_set:{
                                rows : []
                            }
                        };
                        
                        var length = rs.rows.length;
                        for(var i=0;i<length;i++)
                        {
                            res.result_set.rows.push(rs.rows.item(i));
                        }
                        
                        success(res);
                    }
                    
                    function errorHandler(tx, err) 
                    {
                        var error_message = {
                            result : false,
                            exception_msg : err.message
                        };
                        typeof error == 'function' && error(error_message);
                    }
                }
            }
        });
        return new Database();
    });
    
    /**
     *  Emulator 초기화 </br>
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
    require([ 'jquery', 'backbone', 'dispatchRouterInst',"screensViewInst", "appInst", "appConfigViewInst"], function($, Backbone, dispatchRouterInst, screensView, app, appConfigView) {
        $(document).ready(function() {
            
            Backbone.history.start(); 
            appConfigView.bind("save", function()
            {
                if(app.isFirst() && app.initApp()) { 
                	screensView.addNewScreen(app.getAppConfig("URL").LOGIN); 
                }
            });
            
            if(app.isFirst()) { 
                appConfigView.render().show(); 
            }else{                
                if(app.initApp()) {  
                    require(["serverInst", "storageInst"], function(server, storage)
                    {
						var trcode = "ZZ0007";
						var message = {
						    "header": {
						        "cookie" : "",
						        "error_code" : "",
						        "error_text" : "",
						        "info_text" : "",
						        "login_session_id" : "",
						        "message_version" : "",
						        "result" : false,
						        "trcode" : "ZZ0007",
						        "userId" : ""
						    },
						    "body": {
						        "appKey": app.getAppConfig("app").appKey
						    }
						};
                    	// 
						screensView.addNewScreen(app.getAppConfig("URL").LOGIN);
						/*server.requestTr(trcode, message, function(response)
						{
							var data = response;
                            
                    	  	if(data.header.result===true)
                    	  	{
                    	  		var appShareArea =  JSON.parse(storage.getVolatileData("AppShareArea")) || {};
                    	  		
                    	  		if(data.body.list.length > 0){
                    	  			
                    	  			for(var i=0; i<data.body.list.length; i++ ){
                        	  			var skipdays = appShareArea[data.body.list[i].noticeId];
                        	  			if(!skipdays || (data.body.toDay > skipdays.endDate)) {
                        	  				dispatchRouterInst.executeSHOW_POPUP_VIEW({
                        	  					param: {
    		                	  					message: data.body,
    		                	  					target_page: "LEMP/notice/html/notice.html",
    		                	  					height_percent: "90",
    		                	  					width_percent: "90"
    		                	  					
                        	  					}
                        	  				});
                        	  				break;
                        	  			} else {
                        	  				screensView.addNewScreen(app.getAppConfig("URL").LOGIN);
                        	  				break;
                        	  			}                                  
                        	  		}
	                    	  		
                    	  		}else{
                    	  			screensView.addNewScreen(app.getAppConfig("URL").LOGIN);
                    	  		}
                    	  		
                    	  	}
                    	  	else
                    	  	{
                    	  		console.error("[Emulator][ERROR] : Cannot recieve Notice List. - " + data.header.info_text );
                    	  		screensView.addNewScreen(app.getAppConfig("URL").LOGIN);
                    	  	}
						}, {} );*/
                    }); 
                }   
            }       
        });
    });
    
})(undefined);
