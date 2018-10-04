(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/APLLoader.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9f0b8TSsE1C6bpy6yCTPH4F', 'APLLoader', __filename);
// Script/APLLoader.js

'use strict';

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var urlGET = '';
var urlPOST = '';
var _crypt = require('cryptlib');
var iv = '';
var key = '';
var cypherText = '';
var originalText = '';

cc.Class({
    extends: cc.Component,

    properties: {
        btnGet: { default: null, type: cc.Button },
        btnPost: { default: null, type: cc.Button },
        btnEncrypt: { default: null, type: cc.Button },
        btnDecrypt: { default: null, type: cc.Button },
        btnClear: { default: null, type: cc.Button },

        inputGet: { default: null, type: cc.EditBox },
        inputPost: { default: null, type: cc.EditBox },
        inputValue: { default: null, type: cc.EditBox },
        inputIV: { default: null, type: cc.EditBox },
        inputKey: { default: null, type: cc.EditBox },

        lblLog: { default: null, type: cc.Label },
        lblResult: { default: null, type: cc.Label },

        // defaults, set visually when attaching this script to the Canvas        
        txtURLGet: 'http://192.168.12.43:8888/API/result.json',
        txtURLPost: '',
        msgLog: 'Log : \n',
        msgDecrypt: 'decrypt aes 128 : \n'
    },

    // LIFE-CYCLE CALLBACKS:
    // onLoad () {},

    start: function start() {
        //clear value 
        iv = '';
        key = '';
        cypherText = '';
        originalText = '';

        // Add listener callback.
        this.btnGet.node.on('click', this.getAPILoader, this);
        this.btnPost.node.on('click', this.loadAPILoader, this);
        this.btnClear.node.on('click', this.clearMSG, this);
        this.btnEncrypt.node.on('click', this.encrypt_data, this);
        this.btnDecrypt.node.on('click', this.decrypt_data, this);

        // Define construct value.
        this.inputGet.string = this.txtURLGet;
        this.inputPost.string = this.txtURLPost;
    },


    // update (dt) {},

    getAPILoader: function getAPILoader(Button) {
        urlGET = this.inputGet.string;

        this.msgLog += 'click get data from => ' + urlGET + '\n';
        this.lblLog.string = this.msgLog;
        var xhr = new XMLHttpRequest();

        xhr.open('GET', urlGET, true);
        xhr.onload = function () {
            var users = JSON.parse(xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == "200") {
                console.log(users);
                // this.print_data_callback_get(JSON.stringify(users));                
            } else {
                console.log(users);
                // this.print_data_callback_get.apply(xhr, JSON.stringify(users));                 
            }
        };
        // xhr.callback = this.print_data_callback_get;  
        xhr.withCredentials = false;
        xhr.send(null);
    },

    loadAPILoader: function loadAPILoader(Button) {
        urlPOST = this.inputPost.string;
        this.msgLog += 'click post data to => ' + urlPOST + '\n';
        this.lblLog.string = this.msgLog;

        if (urlPOST === '') {
            var data = {};
            data.param = "Tanet(ice)";
            data.status = 200;
            var json = JSON.stringify(data);
            var xhr = new XMLHttpRequest();

            xhr.open("POST", urlPOST, true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.onload = function () {
                var users = JSON.parse(xhr.responseText);
                if (xhr.readyState == 4 && xhr.status == "201") {
                    console.log(users);
                    // this.print_data_callback_post.apply(xhr, JSON.stringify(users));    
                } else {
                    console.log(users);
                    // this.print_data_callback_post.apply(xhr, JSON.stringify(users));    
                }
            };
            // xhr.callback = this.print_data_callback_post;
            xhr.withCredentials = false;
            xhr.send(json);
        }
    },

    clearMSG: function clearMSG(Button) {
        console.log('clear');
        this.msgLog = 'Log :\n';
        this.lblLog.string = this.msgLog;
        this.msgDecrypt = 'decrypt aes 128 : \n';
        this.lblResult.string = this.msgDecrypt;
    },

    print_data_callback_get: function print_data_callback_get(message) {
        this.msgLog += message + '\n';
        this.lblLog.string = this.msgLog;
    },

    print_data_callback_post: function print_data_callback_post(message) {
        this.msgLog += message + '\n';
        this.lblLog.string = this.msgLog;
    },

    encrypt_data: function encrypt_data(Button) {
        var _error = false;
        this.cypherText = '';
        this.msgLog = 'Log :\n';
        if (this.inputIV.string == '') {
            _error = true;
            this.msgLog += '->> Input IV\n';
        }
        if (this.inputValue.string == '') {
            _error = true;
            this.msgLog += '->> Input value string\n';
        }
        if (this.inputKey.string == '') {
            _error = true;
            this.msgLog += '->>Input secret key string\n';
        }

        if (!_error) {
            var _iv = parseInt(this.inputIV.string);
            var _strKey = this.inputKey.string;
            var _value = this.inputValue.string;
            iv = _crypt.generateRandomIV(_iv); //16 bytes = 128 bit
            key = _crypt.getHashSha256(_strKey, 32); //32 bytes = 256 bits
            cypherText = _crypt.encrypt(_value, key, iv);

            this.msgDecrypt = 'Encrypt AES ---------------- :\n' + ' :> IV (Initialization vector) : ' + _iv + '\n' + ' :> Key string(' + _strKey + ')' + ' bytes ' + 32 + '\n' + ' :> Generate Random IV : ' + iv + '\n' + ' :> Get HashSha 256bits or 32 bytes : ' + key + '\n' + ' :> Encrypted : ' + cypherText;
            this.lblResult.string = this.msgDecrypt;
        } else this.lblLog.string = this.msgLog;
    },

    decrypt_data: function decrypt_data(Button) {
        var _error = false;
        console.log(cypherText);
        if (cypherText == undefined || cypherText == '') {
            _error = true;
            this.msgLog += '->> String encrypt is null!\n';
        }
        if (this.inputKey.string == '') {
            _error = true;
            this.msgLog += '->>Input secret key string\n';
        }

        if (!_error) {
            var _strKey = this.inputKey.string;
            key = _crypt.getHashSha256(_strKey, 32); //32 bytes = 256 bits
            try {
                originalText = _crypt.decrypt(cypherText, key, iv);
                this.msgDecrypt += '\nDecrypt AES ---------------- :\n' + ' :> Decrypted :> ' + originalText;
                this.lblResult.string = this.msgDecrypt;
            } catch (e) {
                this.msgLog += e + '\n';
                this.lblLog.string = this.msgLog;
            }
        } else this.lblLog.string = this.msgLog;
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=APLLoader.js.map
        