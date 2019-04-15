// ==UserScript==
// @name         AutoClean - 一个帮助你免受弹窗打扰的工具 -By Semoz
// @namespace    https://semoz.github.io/AutoClean
// @version      1.1
// @description  AutoClean is a Plug for Network Colledge To Clean Some Unnessary Alert
// @author       Semoz
// @match        *://*/xx*/client/login/frame*
// @require      https://semoz.github.io/AutoClean/resource/CryptoJS/tripledes.js
// @require      https://semoz.github.io/AutoClean/resource/CryptoJS/mode-ecb-min.js
// @run-at       document-end
// @grant        none
// ==/UserScript==
(function() {

    var debugFlag = false;

    var timeRange = 5 * 10000;
    var default_timeRange;
    var studyData;
    var configString;
    var price_list = "<br/>";
    var monitorTimer;
    var fzbPlugTimer;
    // 1.程序入口
    disclaimer();
    // 2.计算配置
    //calculate();
    //------------------------------------------------------------------------------
    // 免责声明
    function disclaimer() {
        $.messager.defaults = {ok:"同意", cancel:"拒绝"};
        var content = "";
        content += "<div style='text-align:center;color:blue;'><b>本插件属于学习辅助工具，因使用本插件而导致的各种问题均与开发者无关。</b></div><br/>";
        content += "<div style='text-align:center'>如果您&nbsp;[<span style='color:#22c122;'><b>同意</b></span>]&nbsp;使用本插件进行学习<br/>则视为您本人愿意自行承担可能产生的<span style='color:red;'><b>任何后果</b></span></div><br/>";
        content += "<div style='text-align:center'>如不同意请点击&nbsp;[<span style='color:red;'><b>拒绝</b></span>]&nbsp;后删除本插件!</div><br/>";
        content += "<div style='text-align:center'><a href='https://semoz.github.io/AutoClean/' target='_blank'>[<span style='color:blue;'><b>本项目地址</b></span>]</a></div><br/>";
        var title = "<div style='text-align:center;color:red;'>免责声明&nbsp;&nbsp;&nbsp;&nbsp;<span style='color:black;'>v1.1</span></div>";
        $.messager.confirm(title, content, function(r) {
            if (r) {
                checkStudy();
            }
        });
    }

    //------------------------------------------------------------------------------
    function checkStudy() {
        $.messager.progress({
            title:'正在处理...',
            msg:'正在加载.请稍等',
            text:'Loading...',
            interval:'400'
        });
        // 获取学习时间
        getStudyData();
        loopStudyData(studyData.name);
        setTimeout(function() {checkPay();},3000);
    }

    function loopStudyData(param){
        console.log(new Date());
        if(param == null){
            setTimeout(function() {loop(studyData.name);},1000)
        }
    }

    //------------------------------------------------------------------------------
    function checkPay() {
        $.messager.progress('close');
        var helloMsg = "";
        //alert(JSON.stringify(studyData));
        // 上传学习数据
        uploadStudyData();
        // 下载授权文件，比对学号看是否已经授权
        //downloadConfig(studyData.studyNumber);
        // 检查当前学习时间，如果超过2万5千秒，就要求检查授权文件
        // 有配置文件，加载规定的学习时间，这里要排除不限时用户
        // 全局配置检查 timeRange
        if(default_timeRange != null){
            if(parseInt(default_timeRange) > 0){
                if(debugFlag){
                    console.log("timeRange:" + timeRange + ">>> default_timeRange:" + default_timeRange);
                }
                timeRange = default_timeRange;
            }
        }

        if(configString == null || configString === "") {
            if(parseInt(studyData.time) > timeRange) {//超过了学习时间，且没有配置文件
                var errorMsg = "<div>";
                errorMsg += "<div style='text-align:center'>你好，<b>本课程现已累计时间<span style='color:red'>" + studyData.time + "</span></b></div>";
                errorMsg += "<div>为了更好的学习，超过" + parseInt(timeRange / 10000) + "万秒后，插件自动失效，你需要自行努力哦^o^</div><br/>";
                errorMsg += "<br/><div style='text-align:center'><b><span style='color:red'>挂满4万秒可获得平时分(15分~20分)</span></b></div>";
                errorMsg += "<br/><div>如有任何疑问，请联系我&nbsp<a href='mailto:lee80386@hotmail.com'><span style='color:blue;'>lee80386@hotmail.com</span></a></div>";
                errorMsg += "<br/><br/><br/>";
                errorMsg += "<div style='text-align:center' id='_btn_show_money'><input type='button' value='查看详情' onclick=\"$('#_money_plan').animate({height:'toggle'});\" /></div>";
                errorMsg += "<div style='text-align:center;display:none;' id='_money_plan'>";
                errorMsg += price_list;
                errorMsg += "</div>";
                errorMsg += "</div>";
                showErrorMsg(errorMsg);
                loadBasic();
                return;
            }
        } else {
            if(configString.indexOf("∞") > -1) {
                helloMsg += "欢迎回来，尊敬的无限用户：" + studyData.name + "<br/> 尽情享受科技带来的美好生活。";
            } else {
                //覆盖学习时间
                var lessonConfig = eval('(' + configString + ')');
                var timeLimit = parseInt(lessonConfig[studyData.lesson]);
                if(isNaN(timeLimit)){
                    console.log("No Lesson(" + studyData.lesson + ") Config, Use timeRange Default:" + timeRange + "秒");
                } else {
                    console.log("Find Lesson(" + studyData.lesson + ") Config, Set timeRange:" + timeRange + "秒 -> " + timeLimit + "秒");
                    timeRange = timeLimit;
                }
                // 再判断是否超时
                if(parseInt(studyData.time) > timeRange) {
                    var errorMsg = "<div>";
                    errorMsg += "<div style='text-align:center'>你好，<b>你现已累计时间为<span style='color:red'>" + studyData.time + "</span></b></div>";
                    errorMsg += "<div>为了更好的学习，超过" + parseInt(timeRange / 10000) + "万秒后，插件自动失效，您需要自行努力哦^o^</div><br/>";
                    errorMsg += "<br/><div style='text-align:center'><b><span style='color:red'>挂满4万秒可获得平时分(15分~20分)</span></b></div>";
                    errorMsg += "<br/><div>如有任何疑问，请联系我&nbsp<a href='mailto:lee80386@hotmail.com'><span style='color:blue;'>lee80386@hotmail.com</span></a></div>";
                    errorMsg += "<div style='text-align:center' id='_btn_show_money'><input type='button' value='查看详情' onclick=\"$('#_money_plan').animate({height:'toggle'});\" /></div>";
                    errorMsg += "<div style='text-align:center;display:none;' id='_money_plan'>";
                    errorMsg += price_list;
                    errorMsg += "</div>";
                    errorMsg += "</div>";
                    showErrorMsg(errorMsg);
                    loadBasic();
                    return;
                }
                helloMsg += "欢迎回来，用户：" + studyData.name + " 请享受科技带来的美好生活。";
            }
        }
        if(helloMsg == null || helloMsg === ""){
            helloMsg += "用户：" + studyData.name + " 你好，请享受科技带来的便利生活。";
        }
        // 显示欢迎信息
        showInfoMsg(helloMsg);
        // 成功后加载js文件
        loadJS();
        // 开启一个30秒定时监测服务
        monitorTimer = setInterval(function() {
            monitor();
        },30000);
    }

    function monitor() {
        // 下载配置文件获取配置信息
        //downloadConfig(studyData.studyNumber);
        //获取当前学习时间
        var nowTime = $("#_studyTime").html();
        if(configString == null || configString === "") {//超过了学习时间，且没有配置文件
            if(parseInt(nowTime) > timeRange) {
                var errorMsg = "<div>";
                errorMsg += "<div style='text-align:center'>你好，<b>本课程现已累计时间<span style='color:red'>" + nowTime + "</span></b></div>";
                errorMsg += "<div>为了更好的学习，超过" + parseInt(timeRange / 10000) + "万秒后，你需要自行努力哦^o^</div><br/>";
                errorMsg += "<br/><div style='text-align:center'><b><span style='color:red'>挂满4万秒可获得平时分(15分~20分)</span></b></div>";
                errorMsg += "<br/><div>如有任何疑问，请联系我&nbsp<a href='mailto:lee80386@hotmail.com'><span style='color:blue;'>lee80386@hotmail.com</span></a></div>";
                errorMsg += "<br/><br/><br/>";
                errorMsg += "";
                errorMsg += "<div style='text-align:center' id='_btn_show_money'><input type='button' value='查看详情' onclick=\"$('#_money_plan').animate({height:'toggle'});\" /></div>";
                errorMsg += "<div style='text-align:center;display:none;' id='_money_plan'>";
                errorMsg += price_list;
                errorMsg += "</div>";
                errorMsg += "</div>";
                if(debugFlag){
                    console.log("Check Log >>> Now: " + nowTime + " >>> Range: " + timeRange + "秒");
                    console.log("Check Time Out Of Range: " + timeRange + "秒 - Actually: " + nowTime + "秒");
                }
                setDisable();
                showErrorMsg(errorMsg);
                return;
            }
        } else {
            // 有配置文件，加载规定的学习时间，这里要排除不限时用户
            if(configString.indexOf("∞") > -1) {
                if(debugFlag){
                    console.log("Check Log >>> Now: " + nowTime + " >>> Range: ∞秒");
                    console.log("Check As a Unlimited User");
                }
            } else {
                //覆盖学习时间
                var lessonConfig = eval('(' + configString + ')');
                var timeLimit = parseInt(lessonConfig[studyData.lesson]);
                if(isNaN(timeLimit)){
                    console.log("No Lesson(" + studyData.lesson + ") Config, Use timeRange Default:" + timeRange + "秒");
                } else {
                    console.log("Find Lesson(" + studyData.lesson + ") Config, Set timeRange:" + timeRange + "秒 -> " + timeLimit + "秒");
                    timeRange = timeLimit;
                }
                // 再判断是否超时
                if(parseInt(nowTime) > timeRange) {
                    var errorMsg = "<div>";
                    errorMsg += "<div style='text-align:center'>你好，<b>你现已累计时间为<span style='color:red'>" + nowTime + "</span></b></div>";
                    errorMsg += "<div>为了更好的学习，超过" + parseInt(timeRange / 10000) + "万秒后，您需要自行努力哦^o^</div><br/>";
                    errorMsg += "<br/><div style='text-align:center'><b><span style='color:red'>挂满4万秒可获得平时分(15分~20分)</span></b></div>";
                    errorMsg += "<br/><div>如有任何疑问，请联系我&nbsp<a href='mailto:lee80386@hotmail.com'><span style='color:blue;'>lee80386@hotmail.com</span></a></div>";
                    errorMsg += "<br/><br/><br/>";
                    errorMsg += "<div style='text-align:center' id='_btn_show_money'><input type='button' value='查看详情' onclick=\"$('#_money_plan').animate({height:'toggle'});\" /></div>";
                    errorMsg += "<div style='text-align:center;display:none;' id='_money_plan'>";
                    errorMsg += price_list;
                    errorMsg += "</div>";
                    errorMsg += "</div>";
                    if(debugFlag){
                        console.log("Check Log >>> Now: " + nowTime + " >>> Range: " + timeRange + "秒");
                        console.log("Check Time Out Of Range " + timeRange + "秒 - Actually " + nowTime);
                    }
                    setDisable();
                    showErrorMsg(errorMsg);
                    return;
                }
            }
        }
        if(debugFlag){
            console.log("Check Log >>> Now: " + nowTime + " >>> Range: " + timeRange + "秒");
        }
    }
    //------------------------------------------------------------------------------
    //加载主要菜单
    function loadJS() {
        // 加载east框架
        loadEastLayout();
        // 加载菜单
        loadMenu();
        // 加载学习容器
        loadStudyContainerBody();
        // 加载插件容器
        loadPlugBody();
        // 加载视频学习界面
        openStudyPageInterval();
        // 加载下载容器
        loadDownloadBody();
        var oldStyle = $("#_east_layout_content").attr("style")
        $("#_east_layout_content").attr("style", oldStyle + "; background-color: #bdffde");
    }

    function loadBasic() {
        // 加载east框架
        loadEastLayout();
        // 加载菜单
        loadMenu();
        // 加载学习容器
        loadStudyContainerBody();
        // 加载插件容器
        //loadPlugBody();
        // 加载视频学习界面
        //openStudyPageInterval();
        // 加载下载容器
        loadDownloadBody();
        var oldStyle = $("#_east_layout_content").attr("style")
        $("#_east_layout_content").attr("style", oldStyle + "; background-color: #fbe4e4");
    }

    //------------------------------------------------------------------------------
    // 加载EAST框架界面
    function loadEastLayout() {
        $("body").attr("id", "_main_layout");
        $('#_main_layout').layout('add', {
            region:'east',
            width:300,
            title:'管理中心',
            split:true
        });
        $(".easyui-layout .layout-panel-east .panel-body").attr("id", "_east_layout_content");
    }

    //------------------------------------------------------------------------------
    //加载主菜单
    function loadMenu() {
        var html = "";
        html += "<ul>";
        html += "<li><span style='color:#05069c;'>基础信息</span><br/><br/><div id='studyContainer'></div></li>";
        html += "<br/>";
        html += "<li><span style='color:#05069c;'>自动学习</span><br/><br/><div id='autoContainer'></div></li>";
        html += "<br/>";
        html += "<li><span style='color:#05069c;'>视频下载</span><br/><br/><div id='downloadContainer'></div></li>";
        html += "<br/>";
        html += "</ul>";
        html += "<div style='display:block' id='_frameRemote'></div>";
        $("#_east_layout_content").html(html);
    }

    //------------------------------------------------------------------------------
    // 加载基础信息容器
    function loadStudyContainerBody() {
        // 加载学习内容
        loadStudyContent();
        // 设定计时器
        //waitTime = 60;
        // 定时刷新学习内容
        studyCountDown();
    }

    // 计时器-学习内容定时刷新
    var waitTime = 60;
    function studyCountDown() {
        if (waitTime === 0) {
            reflashStudyTime();
            // 设定计时器
            waitTime = 60;
            // 定时刷新学习内容
            studyCountDown();
        } else {
            var content = waitTime;
            if (waitTime < 10) {
                content = "0" + content;
            }
            $("#_studyCountDown").html(content);
            waitTime--;
            setTimeout(function() {
                studyCountDown();
            }, 1000);
        }
    }

    // 加载学习内容详情
    function loadStudyContent() {
        $("#studyContainer").html("<div id='_userData'></div><div id='_studyData'></div>");
        // 加载学生相关基础信息
        $.ajax({
            url:'/xx/client/login/personInfo.aspx',
            type:'get',
            async:true,
            data:"",
            timeout:5000,
            dataType:'html',
            success:function(html) {
                if (typeof html != 'undefined') {
                    var content = "";
                    var userName = $(html).find("#lblXM").html();
                    var studyNumber = $(html).find("#lblXH").html();
                    var className = $(html).find("#bjxx").html();
                    content += "&nbsp;姓名：<span style='color:black;'>" + userName + "</span><br/>";
                    content += "&nbsp;学号：<span style='color:#603ad6;'>" + studyNumber + "</span><br/>";
                    var arr = className.split("/");
                    var c0 = "", c1 = "", c2 = "", c3 = "", c4 = "", c5 = "";
                    if(arr[0]) c0 = arr[0];
                    if(arr[1]) c1 = arr[1];
                    if(arr[2]) c2 = arr[2];
                    if(arr[3]) c3 = arr[3];
                    if(arr[4]) c4 = arr[4];
                    if(arr[5]) c5 = arr[5];
                    var className_A = "";
                    className_A += c2 + "(" + c1 + ") － " + c5 + "<br/>";
                    className_A += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + c0 + " － " + c3 + "(" + c4 + ")";
                    content += "&nbsp;班级：<span style='color:#f37101;'>" + className_A + "</span><br/>";
                    content += "<hr style='border:1 dashed #987cb9 align:left' width='95%' color=#987cb9 size=1>";
                    $("#_userData").html(content);
                }
            }
        });
        // 加载学习相关基础信息
        $.ajax({
            url:'/xx/client/login/QueryStudyTime.aspx',
            type:'get',
            async:true,
            data:"",
            timeout:5000,
            dataType:'html',
            success:function(html) {
                if (typeof html != 'undefined') {
                    var content = "";
                    var str = $(html).find("#Label1").html();
                    //console.log(str);
                    //当前查询课程为：本科_大学英语III_主讲教师：朱嫣红。<br>起始日期为：20170911，终止日期为：20180411。在线学习总时长：32659秒，约为544分钟
                    content += "&nbsp;当前课程：<span style='color:red;' id='_lesson'>" + str.substring(str.indexOf("当前查询课程为：") + 8, str.indexOf("_主讲教师")) + "</span><br/>";
                    content += "&nbsp;主讲教师：<span style='color:black;'>" + str.substring(str.indexOf("_主讲教师：") + 6, str.indexOf("。")) + "</span><br/>";
                    /*
                    var yearReg = /(.{4})(.*)/;
                    var monthReg = /(.{7})(.*)/;
                    var start = str.substring(str.indexOf("起始日期为：") + 6, str.indexOf("，终止日期为"));
                    start = start.replace(yearReg, "$1-$2").replace(monthReg, "$1-$2");
                    var end = str.substring(str.indexOf("终止日期为：") + 6, str.indexOf("。在线学习"));
                    end = end.replace(yearReg, "$1-$2").replace(monthReg, "$1-$2");
                    content += "&nbsp;查询范围：<span style='color:red;'>" + start + "</span>&nbsp;至&nbsp;<span style='color:red;'>" + end + "</span><br/>";
                    */
                    content += "&nbsp;学习时间：<span style='color:red;' id='_studyTime'>" + str.substring(str.indexOf("在线学习总时长：") + 8, str.indexOf("，约为")) + "</span>";
                    // content += "（" + str.substring(str.indexOf("，约为") + 3, str.length) + "）";
                    content += "&nbsp;&nbsp;<span style='color:#0c9eec;'><span id='_studyCountDown' style=''>00</span>秒后刷新</span>";
                    $("#_studyData").html(content);
                }
            }
        });
    }

    // 获取学习总时间
    function reflashStudyTime() {
        $.ajax({
            url:'/xx/client/login/QueryStudyTime.aspx',
            type:'get',
            async:true,
            data:"",
            timeout:5000,
            dataType:'html',
            success:function(html) {
                if (typeof html != 'undefined') {
                    var content = "";
                    var str = $(html).find("#Label1").html();
                    var time = str.substring(str.indexOf("在线学习总时长：") + 8, str.indexOf("，约为"));
                    console.log("Reflash New Study Time: " + time);
                    $("#_studyTime").html(time);
                }
            }
        });
    }

    //------------------------------------------------------------------------------
    // 加载插件容器
    function loadPlugBody() {
        plugContent();
        fzbPlugTimer = setInterval(function() {
            fzbPlug();
        },15000);
    }
    // 加载插件内容
    function plugContent() {
        var html = "";
        html += "<input type='radio' name='_plugFlag' value='1' checked='checked'>我要偷懒</input>&nbsp;&nbsp;&nbsp;";
        html += "<input type='radio' name='_plugFlag' value='0'>好好学习</input><br/>";
        html += "&nbsp;已偷偷关闭防作弊窗口&nbsp;<span id='_fzbCount_show' style='color:red;'>0</span>&nbsp;次<input type='hidden' id='_fzbCount' value='0'></span>";
        $("#autoContainer").html(html);
    }

    function fzbPlug() {
        if($("input[name='_plugFlag']:checked").val() == 1) {
            showMsg("正在检查防作弊窗口..");
            // 清除普通防作弊弹窗
            if(!$('#w_fzb').window('options').closed) {
                $('#fzb_btnEp').click();
                plusCount();
            }
            // 清除带验证码的防作弊弹窗
            if(!$('#w_fzb2').window('options').closed) {
                $('#w_fzb2_z').val(parseInt($('#w_fzb2_x').text()) + parseInt($('#w_fzb2_y').text()));
                $('#fzb2_btnEp').click();
                plusCount();
            }
            // 计时暂停后继续计时
            if($("#dispStudyTime").find("a").length > 0) {
                continue_cal2();
            }
            //关闭300计时
            if($(".messager-window .messager-body")) {
                $(".messager-window .messager-body").each(function() {
                    if($(this).html().indexOf("统已经暂停计时") > 0) {
                        $(this).find(".l-btn").click();
                    }
                });
            }

        }
    }

    function plusCount() {
        $("#_fzbCount").val(parseInt($("#_fzbCount").val()) + 1);
        $("#_fzbCount_show").html($("#_fzbCount").val());
    }

    //------------------------------------------------------------------------------
    // 视频下载模块
    function loadDownloadBody() {
        // 加载视频下载html内容
        loadDownloadContent();
        // 获取视频下载链接
        setInterval(function() {
            downloadPlug();
        },3000);
    }

    // 加载视频下载html内容
    function loadDownloadContent() {
        var content = "";
        content += "<div id='_downloadContent'></div>";
        // 增加打赏功能
        //content += "<div><table style='text-align:center;'>";
        //content += "<tr>";
        //content += "<td style='width:95px;'><img id='_alipay' width='90' height='auto' src='" + alipay + "' style='display:none'/></td>";
        //content += "<td style='width:30px;'>";
        //content += "<a href='#'><img width='30' height='auto' src='" + btn_dashang + "' onclick=\"";
        //content += "$('#_east_layout_content').find('#_alipay').animate({height:'toggle'});";
        //content += "$('#_east_layout_content').find('#_wechatpay').animate({height:'toggle'});";
        //content += "\" /></a></td>";
        //content += "<td style='width:95px;'><img id='_wechatpay' width='90' height='auto' src='" + wechatPay + "' style='display:none'/></td>";
        //content += "</tr>";
        //content += "</table></div>";
        // 增加温馨提示
        content += "<div>";
        content += "<div><h3 style='color:red;'>温馨提示：</h3>";
        content += "在使用过程有任何意见或建议</div>";
        content += "请联系我&nbsp<a href='mailto:lee80386@hotmail.com'><span style='color:blue;'>lee80386@hotmail.com</span></a></div>";
        content += "<div><br/>have fun!</div>";
        content += "</div>";
        $("#downloadContainer").html(content);
    }

    function downloadPlug() {
        var content = "";
        var vga = video_vga();
        if(vga !== "") {
            content += "<div>" + vga + "</div><br/>";
        }
        var zwl = video_zwl();
        if(zwl !== "") {
            content += "<div>" + zwl + "</div><br/>";
        }
        if(content !== "") {
            $("#_downloadContent").html(content);
        }
    }

    //经济学
    function video_vga() {
        var content = "";
        var src = "";
        // 获取课程窗口内容
        $("iframe").each(function() {
            if($(this).attr("src").indexOf("LessonContents") >0) {
                var temp = this.contentWindow.location.href;
                if(temp.indexOf("content.htm") > 0) {//特殊类型
                    src = decodeURI(temp);
                }
            }
        });
        if(src !== "") {
            var baseUrl = src.substring(0, src.length-11);
            var testSrc = baseUrl + "remoteclip.asx";
            // http://www.xx.zjut.edu.cn///weblesson/web/20130401WWW.XX.ZJUT.EDU.CN2/4/_经济学_陈春根_本科/6/6_1/content.htm
            $.ajax({
                type:"GET",
                cache:false,
                url:testSrc,
                async:false,
                data:"",
                success:function() {
                    var title = baseUrl.substring(baseUrl.indexOf("WWW.XX.ZJUT.EDU.CN") + 18, baseUrl.length);
                    title = title.substring(title.indexOf("_") + 1, title.length);
                    title = title.replace(/\//g,"-");
                    title = title.substring(0, title.length - 1);
                    var src_ppt = baseUrl + "Screen.vga";
                    var src_video = baseUrl + "000.asf";
                    content+=title+"<br/>";
                    content+="<a href='"+src_video+"' download="+ title + "_视频"+"><span style='color:blue;'> ☆ 演讲【视频下载】</span></a><br/>";
                    content+="<a href='"+src_ppt+"' download="+ title + "_VGA演示稿（请用vga播放器打开）"+"><span style='color:blue;'> ☆ 演示【PPT】下载</span></a></br>";
                    content+="<a href='http://www.cj.zjut.edu.cn/downloadContent/other/VGAPlayer.exe'><span style='color:blue;'> ☆ VGA文件播放器</span></a>";
                },
                error : function() {
                    content+="视频地址解析错误";
                }
            });
        }
        return content;
    }

    function video_zwl() {
        var content = "";
        $("iframe").each(function() {
            if($(this).attr("src").indexOf("LessonContents") >0) {
                var temp = this.contentWindow.location.href;
                if(temp.indexOf("zwl_play.aspx") > 0) {//特殊类型
                    var flashvars = ($(this.contentDocument.getElementById("play_zwl2")).attr("flashvars"));
                    var file_url = flashvars.substring(flashvars.indexOf("vcastr_file=") + 12, flashvars.length);
                    // http://www.xx.zjut.edu.cn/weblesson/web/20130401WWW.XX.ZJUT.EDU.CN2/14/_大学英语II_朱嫣红_本科/1.1词汇跟读和自测.FLV
                    // var title = file_url.substring(file_url.lastIndexOf("/") + 1, file_url.lastIndexOf("."));
                    var title = file_url.substring(file_url.lastIndexOf("/") + 1, file_url.length);
                    //title = title.replace(/\//g,"-");
                    content += "<a href='" + file_url + "' download='" + title  + "'><span style='color:blue;'> ☆【" + title + "】</span></a>";
                }
            }
        });
        return content;
    }

    //------------------------------------------------------------------------------

    function getStudyData() {
        studyData = {};
        $.ajax({
            url:'/xx/client/login/personInfo.aspx',
            type:'get',
            async:true,
            data:"",
            timeout:5000,
            dataType:'html',
            success:function(html) {
                if (typeof html != 'undefined') {
                    var userName = $(html).find("#lblXM").html();
                    var studyNumber = $(html).find("#lblXH").html();
                    var className = $(html).find("#bjxx").html();
                    var arr = className.split("/");
                    var c0 = "", c1 = "", c2 = "", c3 = "", c4 = "", c5 = "";
                    if(arr[0]) c0 = arr[0];
                    if(arr[1]) c1 = arr[1];
                    if(arr[2]) c2 = arr[2];
                    if(arr[3]) c3 = arr[3];
                    if(arr[4]) c4 = arr[4];
                    if(arr[5]) c5 = arr[5];
                    var className_A = c2 + "(" + c1 + ") － " + c5 + c0 + " － " + c3 + "(" + c4 + ")";

                    studyData.name = userName;
                    studyData.studyNumber = studyNumber;
                    studyData.classData = className_A;
                }
            }
        });
        // 加载学习相关基础信息
        $.ajax({
            url:'/xx/client/login/QueryStudyTime.aspx',
            type:'get',
            async:true,
            data:"",
            timeout:5000,
            dataType:'html',
            success:function(html) {
                if (typeof html != 'undefined') {
                    var content = "";
                    var str = $(html).find("#Label1").html();
                    studyData.lesson = str.substring(str.indexOf("当前查询课程为：") + 8, str.indexOf("_主讲教师"));
                    studyData.teacher = str.substring(str.indexOf("_主讲教师：") + 6, str.indexOf("。"));
                    studyData.time = str.substring(str.indexOf("在线学习总时长：") + 8, str.indexOf("，约为"));
                }
            }
        });
    }

    function uploadStudyData() {
        var data = encodeURI(JSON.stringify(studyData));
        $.ajax({
            url:'http://dev.hisemoz.com/AutoClean/studyLog/upload?studyData=' + data,
            type:'get',
            async:true,
            data:"",
            timeout:5000,
            dataType:'html',
            success:function(html) {
            }
        });
    }
    // 下载配置文件
    function downloadConfig(studyNumber) {
        $.ajax({
            url:'https://semoz.github.io/AutoClean/resource/config.json',
            type:'get',
            async:false,
            data:"",
            timeout:5000,
            dataType:'html',
            success:function(html) {
                if(debugFlag){
                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                    console.log("Get Config: " + html);
                }
                var plaintext = decryptByDES(html, getYouDontKnow());
                if(debugFlag){
                    console.log("Plaintext: " + plaintext);
                }
                var jsonConfig = eval('(' + plaintext + ')');
                configString = JSON.stringify(jsonConfig[studyNumber]);

                var public_config_str = JSON.stringify(jsonConfig["全局配置"]);
                if(public_config_str != null && public_config_str.length > 5){
                    var public_config = eval('(' + public_config_str + ')');

                    price_list = JSON.stringify(public_config["内容配置"]);
                    price_list = price_list.substring(1, price_list.length - 1)

                    default_timeRange = JSON.stringify(public_config["默认计时"]);
                }

                if(debugFlag){
                    console.log("Price_List: " + price_list);
                    console.log("Default_TimeRange: " + default_timeRange);
                    console.log("User Config: " + configString);
                }
            }
        });
    }

    function openStudyPageInterval() {
        openStudyPage();
        setInterval(function() {
            openStudyPage();
        },30000);
    }

    function openStudyPage() {
        var flag = true;
        $("#mainPanle").find("ul").each(function() {
            if($(this).html().indexOf("在线学习目录") > 0) {
                flag = false;
            }
        });
        if(flag) {
            //没有学习目录，加载一个,打开学习面板
            $("#nav .panel:eq(0) ul li:eq(0)").find("a").click();
            if($("#dispStudyTime").find("a").length > 0) {
                continue_cal2();
            }
        }
    }

    function setDisable(){
        window.clearInterval(monitorTimer);
        window.clearInterval(fzbPlugTimer);
        $("#nav .panel:eq(0) ul li:eq(1)").find("a").click();
    }

    //------------------------------------------------------------------------------
    // 工具集
    // 显示弹窗
    function showMsg(msg) {
        $.messager.show({
            title:'提示',
            msg:msg,
            timeout:2 * 1000,
            showType:'fade'
        });
    }
    function showErrorMsg(message) {
        $.messager.alert('错误',message,'error');
    }
    function showErrorMsgAndReflush(message) {
        $.messager.alert('错误',message,'error',function() {top.location.reload();});
    }
    function showInfoMsg(message) {
        $.messager.alert('提示',message,'info');
    }
    // des加密
    function encryptByDES(message, key) {
        var keyHex = CryptoJS.enc.Utf8.parse(key);
        var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
            mode:CryptoJS.mode.ECB,
            padding:CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    }
    //des解密
    function decryptByDES(ciphertext, key) {
        var keyHex = CryptoJS.enc.Utf8.parse(key);
        var decrypted = CryptoJS.DES.decrypt({
            ciphertext:CryptoJS.enc.Base64.parse(ciphertext)
        }, keyHex, {
            mode:CryptoJS.mode.ECB,
            padding:CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
    function getYouDontKnow() {
        return "6XfgNCy494s6Uto";
    }

})();