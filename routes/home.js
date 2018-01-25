var router = require('express').Router();

router.get('/home', function (req, res) {
    res.render('quickbooks/home');
});



module.exports = router;