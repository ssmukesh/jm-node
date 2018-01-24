var router = require('express').Router();

router.get('/', function (req, res) {
    res.render('accounts/login');
});

module.exports = router;