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
            JSON: {
                config_codes: "",
                app_Config: "",
                notifySettings: ""
            },
            loadingModal: ""
        };

        this.options.container = element;

        this.init(options);
    };

    function _get_JSON(options, fileDetails, callback) {

        try {
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
                    Plugin.prototype.redirect_signout(options);
                }
            });
        }
        catch (error) {
            Plugin.prototype.redirect_signout(options);
        }


    }

    function _loadConfigValues(options, cb_options, callback) {

        try {
            _get_JSON(options, { name: "config.codes.json", path: "../config/" }, function (config_code) {
                if (_.isNull(config_code) || _.isNull(config_code.data)) {
                    this.redirect_signout(options);
                }
                else {
                    options.JSON.config_codes = config_code.data;

                    _get_JSON(options, { name: "app.config.json", path: "../config/" }, function (app_config) {
                        if (_.isNull(app_config) || _.isNull(app_config.data)) {
                            this.redirect_signout(options);
                        }
                        else {
                            options.JSON.app_Config = app_config.data;
                            if (callback) {
                                callback(cb_options);
                            }
                        }
                    });
                }
            });
        }
        catch (error) {
            Plugin.prototype.redirect_signout(options);
        }

    }

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

    Plugin.prototype = {
        // initialize options
        init: function (options) {
            $.extend(this.options, options);
            _configureModalLoading(this.options);
        },
        loadConfigValues: function (cb_options, callback) {
            _loadConfigValues(this.options, cb_options, callback);
        },
        getOptions: function (options) {
            if (_.isEmpty(this.options.JSON.config_codes) || _.isEmpty(this.options.JSON.app_Config)) {
                return null;
            }
            return this.options;
        },
        redirect_signout: function (options) {
            window.location = "/signout";
        },
        redirect_quickbooks_home: function (options) {
            window.location = "/resident/home";
        },
        showPNotifyAlert: function (options, notifySettings) {
            this.options.notifySettings = notifySettings;
            this.options.container.PNotifyPlugin().showStack_bar_top(this.options.notifySettings);
        },
        Loading: function (options, isShow) {
            _showHideModalLoading(this.options, isShow);
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