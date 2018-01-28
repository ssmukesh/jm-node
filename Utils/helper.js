var _query = require('lodash');
const config_Codes = require("../config/config.codes.json");
const sessionManager = require('./sessionManager');

class helper {

    getConfig_Codes(status, type, code) {
        if (_query.isEqual(status, "success")) {
            if (_query.isEqual(type, "database")) {
                return _query.find(config_Codes.AppMessageCodes.success.database, { 'code': code });
            }
            else if (_query.isEqual(type, "API")) {
                return _query.find(config_Codes.AppMessageCodes.success.API, { 'code': code });
            }
            else if (_query.isEqual(type, "QuickBooks")) {
                return _query.find(config_Codes.AppMessageCodes.success.QuickBooks, { 'code': code });
            }
        }
        if (_query.isEqual(status, "error")) {
            if (_query.isEqual(type, "database")) {
                return _query.find(config_Codes.AppMessageCodes.error.database, { 'code': code });
            }
            else if (_query.isEqual(type, "API")) {
                return _query.find(config_Codes.AppMessageCodes.error.API, { 'code': code });
            }
            else if (_query.isEqual(type, "QuickBooks")) {
                return _query.find(config_Codes.AppMessageCodes.error.QuickBooks, { 'code': code });
            }
        }
        return null;
    }

    checkForUnauthorized(session) {
        let userProfile = sessionManager.getUserProfile(session);
        if (_query.isNull(userProfile) || _query.isNull(userProfile.email)) {
            return null;
        }
        else {
            return userProfile;
        }
    }

}

module.exports = new helper();