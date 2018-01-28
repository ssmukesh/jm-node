var router = require('express').Router();
var _query = require('lodash');

router.get('/loadJson', function (req, res) {
    let filePath = "";

    if (!_query.isNull(req.query.name) && !_query.isNull(req.query.path)) {
        filePath = req.query.path + req.query.name;
    }
    else {
        filePath = "../config/config.codes.json";
    }

    var jsonData = require(filePath);
    return res.json({ data: jsonData, statusCode: 200 });

});



module.exports = router;