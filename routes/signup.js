var express = require('express');
var router = express.Router();

router.get('/signup_page', function(req, res) {
    res.render('signuppage');
});

module.exports = router;