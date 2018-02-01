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
        pluginName = "CommonPlugin",
        // key using in $.data()
        dataKey = "plugin_" + pluginName;



    var Plugin = function (element, options) {
        this.element = element;

        this.options = {
            container: "",
            tenantsEntity: "",
            tenantsEJModel: [],
            tenantsChartsPointsEJModel: []
        };
        this.options.container = element;
        this.init(options);
    };

    function _findAllTenants(options, callback_loadTenantsGrid, callback_loadTenantsOutstandingChart,
        callback_loadTenantsGrid_options, callback_loadTenantsOutstandingChart_options) {
        options.container.HelperPlugin().Loading(options, true);        
        try {
            $.ajax({
                url: JSON_APP_CONFIG.issuer + JSON_APP_CONFIG.endpoint.findCustomers,
                type: 'GET',
                xhrFields: { withCredentials: true },
                cache: false,
                success: function (data) {
                    options.container.HelperPlugin().Loading(options, true);
                    if (!_.isNull(data.status) && (_.isEqual(data.status.code, "0001"))) {
                        options.container.HelperPlugin().redirect_signout();
                    }
                    else if (!_.isNull(data.status) && (_.isEqual(data.status.code, "0000"))) {
                        options.container.HelperPlugin().redirect_signout();
                    }
                    else if (!_.isNull(data.status) && !_.isNull(data.QBOData) && (_.isEqual(data.status.code, "1130"))) {
                        options.container.HelperPlugin().Loading(options, false);
                        if (!_.isNull(data.QBOData)) {
                            options.tenantsEntity = data.QBOData;
                            if (callback_loadTenantsGrid) {
                                _map_tenantsEntity_tenantsEJModel(options);
                                callback_loadTenantsGrid_options.tenantsEJModel = options.tenantsEJModel;
                                callback_loadTenantsGrid(options, callback_loadTenantsGrid_options);
                            }
                            if (callback_loadTenantsOutstandingChart) {
                                _map_tenantsEntity_tenantsEJModel(options);
                                _map_chartPoints_tenantsEJModel(options);
                                callback_loadTenantsOutstandingChart_options.tenantsChartsPointsEJModel = options.tenantsChartsPointsEJModel;
                                callback_loadTenantsOutstandingChart(options, callback_loadTenantsOutstandingChart_options);
                            }
                        }
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

    function _map_tenantsEntity_tenantsEJModel(options) {
        var tenantsModel = {};
        _.forEach(options.tenantsEntity, function (value, key) {
            tenantsModel = {
                CompanyName: "",
                FullyQualifiedName: "",
                Id: 0,
                PrimaryPhone: "",
                PrimaryEmailAddr: "",
                Balance: 0,
                LastUpdatedTime: ""
            };

            if (!_.isUndefined(value.FullyQualifiedName)) { tenantsModel.FullyQualifiedName = value.FullyQualifiedName; }
            if (!_.isUndefined(value.Id)) { tenantsModel.Id = value.Id; }
            if (!_.isUndefined(value.CompanyName)) { tenantsModel.CompanyName = value.CompanyName; }
            if (!_.isUndefined(value.PrimaryPhone) && !_.isUndefined(value.PrimaryPhone.FreeFormNumber)) { tenantsModel.PrimaryPhone = value.PrimaryPhone.FreeFormNumber; }
            if (!_.isUndefined(value.PrimaryEmailAddr) && !_.isUndefined(value.PrimaryEmailAddr.Address)) { tenantsModel.PrimaryEmailAddr = value.PrimaryEmailAddr.Address; }
            if (!_.isUndefined(value.Balance)) { tenantsModel.Balance = value.Balance; }

            if (!_.isUndefined(value.MetaData) && !_.isUndefined(value.MetaData.LastUpdatedTime)) {

                //tenantsModel.LastUpdatedTime = value.MetaData.LastUpdatedTime;
                tenantsModel.LastUpdatedTime = $.formatDateTime('dd/mm/y g:ii a', new Date(value.MetaData.LastUpdatedTime));
            }

            options.tenantsEJModel.push(tenantsModel);
        });
    }

    function _map_chartPoints_tenantsEJModel(options) {
        var points = {};

        _.forEach(options.tenantsEntity, function (value, key) {

            points = {
                x: value.FullyQualifiedName,
                y: value.Balance,
                text: value.FullyQualifiedName
            };
            options.tenantsChartsPointsEJModel.push(points);

        });
    }

    Plugin.prototype = {
        // initialize options
        init: function (options) {
            $.extend(this.options, options);
        },
        findAllTenants: function (callback_loadTenantsGrid, callback_loadTenantsOutstandingChart,
            callback_loadTenantsGrid_options, callback_loadTenantsOutstandingChart_options) {

            _findAllTenants(this.options, callback_loadTenantsGrid, callback_loadTenantsOutstandingChart,
                callback_loadTenantsGrid_options, callback_loadTenantsOutstandingChart_options);

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