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
        pluginName = "TenantsPlugin",
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

    function _loadTenantsGrid(options) {
        $("#Grid").ejGrid({
            dataSource: options.tenantsEJModel,
            allowPaging: true,
            isResponsive: true,
            allowSorting: true,
            allowMultiSorting: true,
            allowFiltering: true,
            toolbarSettings: { showToolbar: true, toolbarItems: [ej.Grid.ToolBarItems.ExcelExport, ej.Grid.ToolBarItems.WordExport, ej.Grid.ToolBarItems.PdfExport] },
            gridLines: ej.Grid.GridLines.Horizontal,
            filterSettings: { showFilterBarStatus: true, statusBarWidth: 500 },
            allowResizing: true,
            allowScrolling: true,
            scrollSettings: { width: '100%', height: '100%' },
            pageSettings: { pageSize: 10 },
            enableHeaderHover: true,
            filterSettings: { filterType: "menu" },
            allowTextWrap: true,
            columns: [
                { field: "Id", headerText: "Id", isPrimaryKey: true, textAlign: ej.TextAlign.Right, width: 10, visible: false },
                { field: "CompanyName", headerText: "Flat #", width: 20, textAlign: ej.TextAlign.Right },
                { field: "FullyQualifiedName", headerText: "Name", width: 100, textAlign: ej.TextAlign.Left },
                { field: "PrimaryPhone", headerText: "Phone", width: 60, textAlign: ej.TextAlign.Right, visible: false },
                { field: "PrimaryEmailAddr", headerText: "Email", width: 80, textAlign: ej.TextAlign.Left },
                { field: "LastUpdatedTime", headerText: "Updated on", width: 30, textAlign: ej.TextAlign.Left, format: "{0:dd/MM/yyyy}" },
                { field: "Balance", headerText: "Balance", width: 20, format: "{0:n2}", textAlign: ej.TextAlign.Right }
            ],
            toolbarClick: function (e) {
                this.exportGrid = this["export"];
                if (e.itemName == "Excel Export") {
                    //this.exportGrid(window.baseurl + 'api/grid/ExcelExport')
                    options.container.HelperPlugin().showPNotifyAlert(options, { title: "Coming soon...", text: "An awesome export option is coming very soon.", type: "info" });
                    e.cancel = true;
                }
                else if (e.itemName == "Word Export") {
                    options.container.HelperPlugin().showPNotifyAlert(options, { title: "Coming soon...", text: "An awesome export option is coming very soon.", type: "info" });
                    e.cancel = true;
                }
                else if (e.itemName == "PDF Export") {
                    options.container.HelperPlugin().showPNotifyAlert(options, { title: "Coming soon...", text: "An awesome export option is coming very soon.", type: "info" });
                    e.cancel = true;
                }
            },
            queryCellInfo: function (args) {

                var value = args.text.replace(",", "");
                var $element = $(args.cell);

                switch (args.column.field) {
                    case "Balance":
                        if (parseFloat(value) <= 0)
                            $element.css("color", "green");
                        else
                            $element.css("color", "red");
                        break;
                }
            }
        });
    }

    Plugin.prototype = {
        // initialize options
        init: function (options) {
            $.extend(this.options, options);
            //_findAllTenants(this.options, _loadTenantsGrid);
            this.options.container.CommonPlugin().findAllTenants(_loadTenantsGrid, null, this.options, null);
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