var _jsQuery = require('lodash');
const config_Codes = require("../config/config.codes.json");

class helper {

    getConfig_Codes(status, type, code) {
        if (_jsQuery.isEqual(status, "success")) {
            if (_jsQuery.isEqual(type, "database")) {
                return _jsQuery.find(config_Codes.AppMessageCodes.success.database, { 'code': code });
            }
            else if (_jsQuery.isEqual(type, "API")) {
                return _jsQuery.find(config_Codes.AppMessageCodes.success.API, { 'code': code });
            }
            else if (_jsQuery.isEqual(type, "QuickBooks")) {
                return _jsQuery.find(config_Codes.AppMessageCodes.success.QuickBooks, { 'code': code });
            }
        }
        if (_jsQuery.isEqual(status, "error")) {
            if (_jsQuery.isEqual(type, "database")) {
                return _jsQuery.find(config_Codes.AppMessageCodes.error.database, { 'code': code });
            }
            else if (_jsQuery.isEqual(type, "API")) {
                return _jsQuery.find(config_Codes.AppMessageCodes.error.API, { 'code': code });
            }
            else if (_jsQuery.isEqual(type, "QuickBooks")) {
                return _jsQuery.find(config_Codes.AppMessageCodes.error.QuickBooks, { 'code': code });
            }
        }
        return null;
    }

}

module.exports = new helper();