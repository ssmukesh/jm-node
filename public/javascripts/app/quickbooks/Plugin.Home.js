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
        pluginName = "HomePlugin",
        // key using in $.data()
        dataKey = "plugin_" + pluginName;

    var Plugin = function (element, options) {
        this.element = element;

        this.options = {
            // default options
            container: "",
            helper_defaults: "",
            timeout: 0
        };
        this.options.container = element;
        this.init(options);
    };

    function _refreshToken(options) {

        try {
            $.ajax({
                url: options.helper_defaults.JSON.app_Config.issuer + options.helper_defaults.JSON.app_Config.endpoint.refreshtoken,
                type: 'GET',
                xhrFields: { withCredentials: true },
                cache: false,
                success: function (data) {
                    console.log(data);

                    if (data.status && (_.isEqual(data.status.code, "2100"))) {
                        options.container.HelperPlugin().redirect_signout();
                    }
                    else {
                        _getCompanyInfo(options);
                    }
                },
                error: function (error) {
                    options.container.HelperPlugin().redirect_signout();
                }
            });
        }
        catch (error) {
            options.container.HelperPlugin().redirect_signout();
        }

    }

    function _refreshQBConfig(options, callback_getCompanyInfo, callback_refreshToken) {

        try {
            $.ajax({
                url: options.helper_defaults.JSON.app_Config.issuer + options.helper_defaults.JSON.app_Config.endpoint.refreshQBConfig,
                type: 'GET',
                xhrFields: { withCredentials: true },
                cache: false,
                success: function (data) {
                    if (!_.isNull(data.status) && (_.isEqual(data.status.code, "1060"))) {
                        options.timeout++;
                        if (callback_refreshToken && callback_getCompanyInfo) {
                            callback_getCompanyInfo(options, callback_refreshToken);
                        }
                        else {
                            options.container.HelperPlugin().redirect_signout();
                        }
                    }
                    else if (!_.isNull(data.status) && (_.isEqual(data.status.code, "2060"))) {
                        options.container.HelperPlugin().redirect_signout();
                    }
                    else {
                        options.container.HelperPlugin().redirect_signout();
                    }
                },
                error: function (error) {
                    options.container.HelperPlugin().redirect_signout();
                }
            });
        } catch (error) {
            options.container.HelperPlugin().redirect_signout();
        }

    }

    function _getCompanyInfo(options, callback_refreshToken) {

        try {
            $.ajax({
                url: options.helper_defaults.JSON.app_Config.issuer + options.helper_defaults.JSON.app_Config.endpoint.getCompanyInfo,
                type: 'GET',
                xhrFields: { withCredentials: true },
                cache: false,
                success: function (data) {
                    if (!_.isNull(data.status) && (_.isEqual(data.status.code, "2130"))) {
                        if (callback_refreshToken) {
                            callback_refreshToken(options);
                        }
                        else {
                            options.container.HelperPlugin().redirect_signout();
                        }
                    }
                    else if (!_.isNull(data.status) && (_.isEqual(data.status.code, "2140"))) {
                        if (callback_refreshToken && options.timeout == 0) {
                            _refreshQBConfig(options, _getCompanyInfo, callback_refreshToken);
                        }
                        else if (options.timeout == 1) {
                            callback_refreshToken(options);
                        }
                        else {
                            options.container.HelperPlugin().redirect_signout();
                        }
                    }
                    else if (!_.isNull(data.status) && (_.isEqual(data.status.code, "1120"))) {
                        window.location = "expenses";
                    }
                    else {
                        options.container.HelperPlugin().redirect_signout();
                    }
                },
                error: function (error) {
                    options.container.HelperPlugin().redirect_signout();
                }
            });
        }
        catch (error) {
            options.container.HelperPlugin().redirect_signout();
        }

    }

    function _helper_defaults(options) {
        options.helper_defaults = options.container.HelperPlugin().getOptions();
        options.container.HelperPlugin().Loading(null, false);
        _getCompanyInfo(options, _refreshToken);
    }

    Plugin.prototype = {
        // initialize options
        init: function (options) {
            $.extend(this.options, options);
            this.options.timeout = 0;
            this.options.container.HelperPlugin().Loading(this.options, true);
            this.options.container.HelperPlugin().loadConfigValues(this.options, _helper_defaults);
        }
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