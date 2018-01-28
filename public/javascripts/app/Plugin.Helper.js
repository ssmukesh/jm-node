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
        pluginName = "HelperPlugin",
        // key using in $.data()
        dataKey = "plugin_" + pluginName;

    var Plugin = function (element, options) {
        this.element = element;

        this.options = {
            JSON: {
                config_codes: "",
                app_Config: ""
            }
        };

        this.init(options);
    };

    function _get_JSON(options, fileDetails, callback) {
        $.ajax({
            url: '/api/helper/loadJson',
            type: 'GET',
            data: fileDetails,
            xhrFields: { withCredentials: true },
            cache: false,
            success: function (response) {
                console.log(response.data);
                callback(response);
            },
            error: function (err) {
                callback(null);
                console.log('error' + err);
            }
        });
    }

    function _loadConfigValues(options) {
        _get_JSON(options, { name: "config.codes.json", path: "../config/" }, function (config_code) {
            if (_.isNull(config_code) || _.isNull(config_code.data)) {
                options.JSON.config_codes = "";
            }
            else {
                options.JSON.config_codes = config_code.data;

                _get_JSON(options, { name: "app.config.json", path: "../config/" }, function (app_config) {
                    if (_.isNull(app_config) || _.isNull(app_config.data)) {
                        options.JSON.app_Config = "";
                    }
                    else {
                        options.JSON.app_Config = app_config.data;
                    }
                });
            }
        });
    }

    Plugin.prototype = {
        // initialize options
        init: function (options) {
            $.extend(this.options, options);
            _loadConfigValues(this.options);
        },
        getOptions: function (options) {
            return this.options;
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