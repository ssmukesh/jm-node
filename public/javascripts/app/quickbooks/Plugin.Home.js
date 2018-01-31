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
            container: ""
        };
        this.options.container = element;
        this.init(options);
    };

    function _refreshToken(options) {

        try {
            $.ajax({
                url: JSON_APP_CONFIG.issuer + JSON_APP_CONFIG.endpoint.refreshtoken,
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

    function _getCompanyInfo(options, callback_refreshToken) {
        options.container.HelperPlugin().Loading(options, true);
        try {
            $.ajax({
                url: JSON_APP_CONFIG.issuer + JSON_APP_CONFIG.endpoint.getCompanyInfo,
                type: 'GET',
                xhrFields: { withCredentials: true },
                cache: false,
                success: function (data) {
                    options.container.HelperPlugin().Loading(options, true);
                    if (!_.isNull(data.status) && (_.isEqual(data.status.code, "0001"))) {
                        if (callback_refreshToken) {
                            callback_refreshToken(options);
                        }
                        else {
                            options.container.HelperPlugin().redirect_signout();
                        }
                    }
                    else if (!_.isNull(data.status) && (_.isEqual(data.status.code, "0000"))) {
                        options.container.HelperPlugin().redirect_signout();
                    }
                    else if (!_.isNull(data.status) && (_.isEqual(data.status.code, "1120"))) {
                        options.container.HelperPlugin().Loading(options, false);
                    }
                    else {
                        options.container.HelperPlugin().redirect_signout();
                    }
                },
                error: function (error) {
                    options.container.HelperPlugin().Loading(options, false);
                    options.container.HelperPlugin().redirect_signout();
                }
            });
        }
        catch (error) {
            options.container.HelperPlugin().Loading(options, false);
            options.container.HelperPlugin().redirect_signout();
        }
    }

    Plugin.prototype = {
        // initialize options
        init: function (options) {
            $.extend(this.options, options);
            _getCompanyInfo(this.options, _refreshToken);
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