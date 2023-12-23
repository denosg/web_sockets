const Express = require('express');

const router = Express.Router();

router.get('', (req, res) => {
    res.render('index')
})

module.exports = router