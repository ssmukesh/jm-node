var router = require('express').Router();
const util = require('util');
const sessionManager = require('../Utils/sessionManager');
const helper = require('../Utils/helper');
var _jsQuery = require('lodash');

router.get('/', function (req, res) {
    res.render('accounts/login');
});

router.get('/signout', function (req, res) {
    res.render('accounts/signout');
});

router.post('/saveuserinfo', function (req, res) {
    if (req.body.email && !_jsQuery.isEmpty(req.body.email)) {

        sessionManager.saveUserProfile(req.session, { "email": req.body.email });

        var configCode = helper.getConfig_Codes("success", "API", "1000");
        return res.json({ status: configCode, statusCode: 200 });
    }
    else {
        var configCode = helper.getConfig_Codes("error", "API", "2000");
        return res.json({ status: configCode, statusCode: 200 });
    }
});

module.exports = router;