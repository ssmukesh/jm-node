var router = require('express').Router();
const util = require('util');
const sessionManager = require('../Utils/sessionManager');
const helper = require('../Utils/helper');
var _query = require('lodash');

router.post('/saveuserinfo', function (req, res) {
    if (req.body.email && !_query.isEmpty(req.body.email)) {

        sessionManager.saveUserProfile(req.session, { "email": req.body.email });

        var configCode = helper.getConfig_Codes("success", "API", "1000");
        return res.json({ status: configCode, statusCode: 200 });
    }
    else {
        var configCode = helper.getConfig_Codes("error", "API", "2000");
        return res.json({ status: configCode, statusCode: 200 });
    }
});

router.get('/checkForUnauthorized', function (req, res) {
    if (_query.isNull(helper.checkForUnauthorized(req.session))) {
        var configCode = helper.getConfig_Codes("success", "API", "999");
        return res.json({ status: configCode, statusCode: 200 });
    }
    else {
        var configCode = helper.getConfig_Codes("error", "API", "0000");
        return res.json({ status: configCode, statusCode: 200 });
    }
});

module.exports = router;