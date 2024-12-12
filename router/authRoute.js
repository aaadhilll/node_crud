const { signup } = require('../controller/authCotroller');

const router = require('express').Router();


router.route('/signup').post(signup);

module.exports = router;
