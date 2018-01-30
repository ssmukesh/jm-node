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
        pluginName = "PNotifyPlugin",
        // key using in $.data()
        dataKey = "plugin_" + pluginName;

    function _Settings(options) {
        // PNotify.defaults.styling = "material";
        // PNotify.defaults.icons = "material";
    }

    function _DesktopSettings(options) {
        PNotify.desktop.permission();
    }

    function _show_stack_bar_top(options, type) {
        var opts = {
            title: "Over Here",
            text: "Check me out. I'm in a different stack."
        };
        opts.title = type.title;
        opts.text = type.text;
        opts.type = type.type;
        opts.animate = {
            animate: true,
            in_class: 'zoomInLeft',
            out_class: 'zoomOutRight'
        };

        new PNotify(opts);
    }


    var Plugin = function (element, options) {
        this.element = element;

        this.options = {
            // default options
        };

        /*
         * Initialization
         */

        this.init(options);
    };

    Plugin.prototype = {
        // initialize options
        init: function (options) {
            $.extend(this.options, options);
        },
        showStack_bar_top: function (type) {
            _show_stack_bar_top(this.options, type);
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