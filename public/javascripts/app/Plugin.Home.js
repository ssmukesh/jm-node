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
            error_msg: {
                systemError: "Please contact the server administrator, inform them of the time the error occurred, and anything you might have done that may have caused the error."
            },
            helper_defaults: "",
            notifySettings: ""
        };
        this.init(options);
    };

    function showPNotifyAlert(options, notifySettings) {
        options.notifySettings = notifySettings;
        $("#dvHome").PNotifyPlugin().showStack_bar_top(options.notifySettings);
    }

    function getCompanyInfo(options) {

        $.ajax({
            url: options.helper_defaults.JSON.app_Config.issuer + options.helper_defaults.JSON.app_Config.endpoint.getCompanyInfo,
            type: 'GET',
            xhrFields: { withCredentials: true },
            cache: false,
            success: function (data) {
                if (data.status && (_.isEqual(data.status.code, "2130"))) {
                    showPNotifyAlert(options, { title: "Having Trouble Signing On?", text: data.status.detail, type: "error" });
                }
                else {
                }
            },
            error: function () {
                showPNotifyAlert(options, { title: "Internal Server Error", text: options.error_msg.systemError, type: "error" });
            }
        });

    }

    Plugin.prototype = {
        // initialize options
        init: function (options) {
            $.extend(this.options, options);
            getCompanyInfo(this.options);
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