// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
; (function ($, window, document, undefined) {

    "use strict";

    // Create the defaults once
    var pluginName = "UserPlugin",
        defaults = {
            issuer: "https://janhavimeadows-api.herokuapp.com/",
            authorization_endpoint: "api/userInfo/connecttojm"
        };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    function _login(options) {

        var userInfo =
            {
                email: $("#inputEmail").val(),
                password: $("#inputPassword").val()
            };

        showHideLoading(true);

        $.ajax({
            type: 'POST',
            data: JSON.stringify(userInfo),
            contentType: 'application/json',
            xhrFields: { withCredentials: true },
            cache: false,
            url: options.settings.issuer + options.settings.authorization_endpoint,
            success: function (data) {
                showHideLoading(false);
                makeNotice();
                console.log(data);
            },
            error: function () {
                showHideLoading(false);
                console.log('error');
            }
        });

    }

    function makeNotice() {
        new PNotify({
            title: 'Oh No!',
            text: 'Something terrible happened.',
            type: 'error'
        });
    }

    function showHideLoading(isShow) {
        if (isShow) {
            $("#loadingicon").addClass("d-block").removeClass("d-none");
            $("#btnsubmit").prop('disabled', true);
        }
        else {
            $("#loadingicon").addClass("d-none").removeClass("d-block");
            $("#btnsubmit").prop('disabled', false);
        }
    }

    function _registerEvents(options) {
        $("#loginForm").submit(function (event) {
            event.preventDefault();
            _login(options);
        });
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        init: function () {
            _registerEvents(this);
        }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" +
                    pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);