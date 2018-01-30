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
            container: "",
            helper_defaults: ""
        };

        this.options.container = element;
        this.init(options);
    };

    function _showHideLoading(isShow) {
        options.container.HelperPlugin().Loading(null, isShow);
    };

    function _login(options) {

        if (_.isNull(options.helper_defaults)) {
            options.container.HelperPlugin().redirect_signout();
        }

        var userInfo = { email: $("#inputEmail").val(), password: $("#inputPassword").val() };

        options.container.HelperPlugin().Loading(options, true);

        try {

            $.ajax({
                type: 'POST',
                data: JSON.stringify(userInfo),
                contentType: 'application/json',
                xhrFields: { withCredentials: true },
                cache: false,
                url: options.helper_defaults.JSON.app_Config.issuer + options.helper_defaults.JSON.app_Config.endpoint.authorization,
                success: function (data) {
                    console.log(data);
                    options.container.HelperPlugin().Loading(options, false);

                    if (data.status && (_.isEqual(data.status.code, "2060") || _.isEqual(data.status.code, "2120"))) {
                        options.container.HelperPlugin().showPNotifyAlert(options, { title: "Having Trouble Signing On?", text: data.status.detail, type: "error" });
                    }
                    else {
                        options.container.HelperPlugin().Loading(options, true);
                        saveUserInfoInSession(userInfo, options);
                    }
                },
                error: function () {
                    options.container.HelperPlugin().Loading(options, false);
                    options.container.HelperPlugin().redirect_signout();
                }
            });

        }
        catch (error) {
            options.container.HelperPlugin().redirect_signout();
        }

    };

    function saveUserInfoInSession(userInfo, options) {

        try {
            $.ajax({
                type: 'POST',
                data: JSON.stringify(userInfo),
                contentType: 'application/json',
                xhrFields: { withCredentials: true },
                cache: false,
                url: options.helper_defaults.JSON.app_Config.endpoint.saveUserInfo,
                success: function (data) {
                    console.log(data);
                    options.container.HelperPlugin().Loading(options, false);

                    if (data.status && (_.isEqual(data.status.code, "2060") || _.isEqual(data.status.code, "2120"))) {
                        options.container.HelperPlugin().showPNotifyAlert(options, { title: "Having Trouble Signing On?", text: data.status.detail, type: "error" });
                    }
                    else {
                        options.container.HelperPlugin().redirect_quickbooks_home();
                    }
                },
                error: function () {
                    options.container.HelperPlugin().Loading(options, false);
                    options.container.HelperPlugin().redirect_signout();
                }
            });
        }
        catch (error) {
            options.container.HelperPlugin().redirect_signout();
        }


    }

    function _registerEvents(options) {

        try {
            $("#loginForm").submit(function (event) {
                event.preventDefault();
                _login(options);
            });
        }
        catch (error) {
            options.container.HelperPlugin().redirect_signout();
        }

    };

    function _helper_defaults(options) {
        options.helper_defaults = options.container.HelperPlugin().getOptions();
        options.container.HelperPlugin().Loading(null, false);
        _registerEvents(options);
    }

    Plugin.prototype = {
        // initialize options
        init: function (options) {
            $.extend(this.options, options);
            this.options.container.HelperPlugin().Loading(this.options, true);
            this.options.container.HelperPlugin().loadConfigValues(this.options, _helper_defaults);
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