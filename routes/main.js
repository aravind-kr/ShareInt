var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    //if(req.session)
        res.render('main', { name : "Guest", title: 'ShareInt',message : '', Interest: '' });
    //else
    //    res.render('index',{ title: 'ShareInt',message : ''  });
});

module.exports = router;