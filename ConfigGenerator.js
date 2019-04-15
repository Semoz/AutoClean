// ==UserScript==
// @name         ESD Config Tools
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ESD!
// @author       Semoz
// @match        https://cn.bing.com/
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
        //configJson[""] = "∞";

        //configJson
        config = {};

        var contentText = "";

        // 1
        /*
        contentText += "<table border='1' cellspacing='0' cellpadding='0' style='border-color:#CCCCCC;' width='95%'>";
        contentText += "</table>";
        */

        // 2

        contentText += "<table border='1' cellspacing='0' cellpadding='0' style='border-color:#CCCCCC;' width='95%'>";
        contentText += "<tr><td>可定制，详联系</td></tr>";
        contentText += "</table>";


        config["内容配置"] = contentText;
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