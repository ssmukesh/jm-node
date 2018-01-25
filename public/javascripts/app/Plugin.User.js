/*
 *  Project:
 *  Description:
 *  Author:
 *  License:
 */

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
; (function ($, window, document, undefined) {

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window is passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    var // plugin name
        pluginName = "UserPlugin",
        // key using in $.data()
        dataKey = "plugin_" + pluginName;

    var Plugin = function (element, options) {
        this.element = element;

        this.options = {
            // default options
            // issuer: "https://janhavimeadows-api.herokuapp.com/",
            issuer: "http://localhost:3000/",
            endpoint: {
                authorization: "api/userInfo/connecttojm",
                saveUserInfo: "api/saveuserinfo"
            },
            error_msg: {
                systemError: "Please contact the server administrator, inform them of the time the error occurred, and anything you might have done that may have caused the error."
            }
        };

        /*
         * Initialization
         */

        this.init(options);
    };

    function showPNotifyAlert(options, notifySettings) {
        options.notifySettings = notifySettings;
        $("#dvLogin").PNotifyPlugin().showStack_bar_top(options.notifySettings);
    }


    function showHideLoading(isShow) {
        if (isShow) {
            $("#loadingicon").addClass("d-block").removeClass("d-none");
            $("#btnsubmit").prop('disabled', true);
        }
        else {
            $("#loadingicon").addClass("d-none").removeClass("d-block");
            $("#btnsubmit").prop('disabled', false);
        }
    };

    function _login(options) {

        var userInfo = { email: $("#inputEmail").val(), password: $("#inputPassword").val() };

        showHideLoading(true);

        $.ajax({
            type: 'POST',
            data: JSON.stringify(userInfo),
            contentType: 'application/json',
            xhrFields: { withCredentials: true },
            cache: false,
            url: options.issuer + options.endpoint.authorization,
            success: function (data) {
                console.log(data);
                showHideLoading(false);

                if (data.status && (_.isEqual(data.status.code, "2060") || _.isEqual(data.status.code, "2120"))) {
                    showPNotifyAlert(options, { title: "Having Trouble Signing On?", text: data.status.detail, type: "error" });
                }
                else {
                    showHideLoading(true);
                    saveUserInfoInSession(userInfo, options);
                }
            },
            error: function () {
                showHideLoading(false);
                console.log('error');
                showPNotifyAlert(options, { title: "Internal Server Error", text: options.error_msg.systemError, type: "error" });
            }
        });

    };

    function saveUserInfoInSession(userInfo, options) {
        $.ajax({
            type: 'POST',
            data: JSON.stringify(userInfo),
            contentType: 'application/json',
            xhrFields: { withCredentials: true },
            cache: false,
            url: options.endpoint.saveUserInfo,
            success: function (data) {
                console.log(data);
                showHideLoading(false);

                if (data.status && (_.isEqual(data.status.code, "2060") || _.isEqual(data.status.code, "2120"))) {
                    showPNotifyAlert(options, { title: "Having Trouble Signing On?", text: data.status.detail, type: "error" });
                }
                else {

                }
            },
            error: function () {
                showHideLoading(false);
                console.log('error');
                showPNotifyAlert(options, { title: "Internal Server Error", text: options.error_msg.systemError, type: "error" });
            }
        });
    }

    function _registerEvents(options) {
        $("#loginForm").submit(function (event) {
            event.preventDefault();
            _login(options);
        });
    };



    Plugin.prototype = {
        // initialize options
        init: function (options) {
            $.extend(this.options, options);
            _registerEvents(this.options);
        },
    };

    /*
     * Plugin wrapper, preventing against multiple instantiations and
     * return plugin instance.
     */
    $.fn[pluginName] = function (options) {

        var plugin = this.data(dataKey);

        // has plugin instantiated ?
        if (plugin instanceof Plugin) {
            // if have options arguments, call plugin.init() again
            if (typeof options !== 'undefined') {
                plugin.init(options);
            }
        } else {
            plugin = new Plugin(this, options);
            this.data(dataKey, plugin);
        }

        return plugin;
    };

}(jQuery, window, document));