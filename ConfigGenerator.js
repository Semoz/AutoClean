// ==UserScript==
// @name         ESD Config Tools
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ESD!
// @author       Semoz
// @match        https://www.baidu.com/
// @require      https://semoz.github.io/AutoClean/resource/CryptoJS/tripledes.js
// @require      https://semoz.github.io/AutoClean/resource/CryptoJS/mode-ecb-min.js
// @grant        none
// ==/UserScript==

(function() {
    var key = "6XfgNCy494s6Uto";

    calculate();

    // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
    function calculate(){
        // 无限 ∞
        var configJson = {};
        var lessonJson;
        configJson[""] = "∞";

        //configJson
        config = {};

        var moneyPlanText = "";

        // 1
        /*
        moneyPlanText += "<table border='1' cellspacing='0' cellpadding='0' style='border-color:#CCCCCC;' width='95%'>";
        moneyPlanText += "<tr><td width='30%'>课程范围</td><td width='50%'>时间</td><td width='20%'>P</td></tr>";
        moneyPlanText += "<tr><td>单门课程</td><td>40000秒</td><td>15</td></tr>";
        moneyPlanText += "<tr><td>单门课程</td><td>50000秒</td><td>25</td></tr>";
        moneyPlanText += "<tr><td>...</td><td>...</td><td>...</td></tr>";
        moneyPlanText += "<tr><td colspan='3'>10000/10</td></tr>";
        moneyPlanText += "<tr><td>任何课程</td><td>∞(无限制)秒</td><td>100</td></tr>";
        moneyPlanText += "</td></tr>";
        moneyPlanText += "</table>";
        */

        // 2

        moneyPlanText += "<table border='1' cellspacing='0' cellpadding='0' style='border-color:#CCCCCC;' width='95%'>";
        moneyPlanText += "<tr><td>可定制，详联系</td></tr>";
        moneyPlanText += "</table>";


        config["价格清单"] = moneyPlanText;
        //config["默认计时"] = 60000;
        configJson["全局配置"] = config;


        // >>>>>>>>>>>>
        var config = JSON.stringify(configJson);
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>");
        console.log("ConfigJson: " + config);
        var ciphertext = encryptByDES(config, key);
        console.log("编码 - Ciphertext: \r\n\r\n" + ciphertext + " \r\n\r\n key: " + key);
        var plaintext = decryptByDES(ciphertext, key) ;
        console.log("解码 - Plaintext: " + plaintext + " key: " + key);
        console.log("<<<<<<<<<<<<<<<<<<<<<<<<");

    }
    // ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

    // des加密
    function encryptByDES(message, key) {
        var keyHex = CryptoJS.enc.Utf8.parse(key);
        var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    }
    //des解密
    function decryptByDES(ciphertext, key) {
        var keyHex = CryptoJS.enc.Utf8.parse(key);
        var decrypted = CryptoJS.DES.decrypt({
            ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
        }, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
})();