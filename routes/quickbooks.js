var router = require('express').Router();
const util = require('util');
const sessionManager = require('../Utils/sessionManager');
const helper = require('../Utils/helper');
var _query = require('lodash');

router.get('/home', function (req, res) {
    // if (_query.isNull(helper.checkForUnauthorized(req.session))) {
    //     res.redirect("/signout");
    // }
    // else {
    //     res.render('quickbooks/home');
    // }
    res.render('quickbooks/home');
});

router.get('/expenses', function (req, res) {
    if (_query.isNull(helper.checkForUnauthorized(req.session))) {
        res.redirect("/signout");
    }
    else {
        res.render('quickbooks/expenses');
    }

});



module.exports = router;