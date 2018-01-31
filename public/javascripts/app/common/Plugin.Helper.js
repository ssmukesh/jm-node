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
            container: "",
            notifySettings: "",
            loadingModal: ""
        };

        this.options.container = element;

        this.init(options);
    };

    function _configureModalLoading(options) {
        var modalLoading = `<div class="modal" id="pleaseWaitDialog" data-backdrop="static" data-keyboard=false role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">                    
                    <div class="modal-body">
                        <div class="progress">
                          <div class="progress-bar progress-bar-striped bg-warning progress-bar-animated active" role="progressbar"
                          aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width:100%; height: 40px">
                          </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        $(document.body).append(modalLoading);
        options.loadingModal = $("#pleaseWaitDialog");
    }

    function _showHideModalLoading(options, isShow) {
        if (isShow) {
            options.loadingModal.modal("show");
        }
        else {
            options.loadingModal.modal("hide");
        }
    }

    function _getConfig_Codes(options, config) {
        if (_.isEqual(config.status, "success")) {
            if (_.isEqual(config.type, "database")) {
                return _.find(JSON_CONFIG_CODES.AppMessageCodes.success.database, { 'code': config.code });
            }
            else if (_.isEqual(config.type, "API")) {
                return _.find(JSON_CONFIG_CODES.AppMessageCodes.success.API, { 'code': config.code });
            }
            else if (_.isEqual(config.type, "QuickBooks")) {
                return _.find(JSON_CONFIG_CODES.AppMessageCodes.success.QuickBooks, { 'code': config.code });
            }
        }
        if (_.isEqual(config.status, "error")) {
            if (_.isEqual(config.type, "database")) {
                return _.find(JSON_CONFIG_CODES.AppMessageCodes.error.database, { 'code': config.code });
            }
            else if (_.isEqual(config.type, "API")) {
                return _.find(JSON_CONFIG_CODES.AppMessageCodes.error.API, { 'code': config.code });
            }
            else if (_.isEqual(config.type, "QuickBooks")) {
                return _.find(JSON_CONFIG_CODES.AppMessageCodes.error.QuickBooks, { 'code': config.code });
            }
        }
        return null;
    }

    Plugin.prototype = {
        // initialize options
        init: function (options) {
            $.extend(this.options, options);
            _configureModalLoading(this.options);
        },
        redirect_signout: function (options) {
            window.location = "/signout";
        },
        redirect_quickbooks_home: function (options) {
            window.location = "/resident/home";
        },
        redirect_login: function (options) {
            window.location = "/";
        },
        showPNotifyAlert: function (options, notifySettings) {
            this.options.notifySettings = notifySettings;
            this.options.container.PNotifyPlugin().showStack_bar_top(this.options.notifySettings);
        },
        Loading: function (options, isShow) {
            _showHideModalLoading(this.options, isShow);
        },
        GetConfigCodes: function (options, config) {
            _getConfig_Codes(this.options, config);
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