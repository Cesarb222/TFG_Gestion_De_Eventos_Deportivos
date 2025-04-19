var express = require('express');

var router = express.Router();

/* GET users listing. */
router.get('/:idEvento',isAuthenticated, function(req, res, next) {
    const {idEvento} = req.params
    console.log(idEvento)
    res.render("sector",{
        idEvento
    });
});

function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }

    res.redirect('/')
}
module.exports = router;
