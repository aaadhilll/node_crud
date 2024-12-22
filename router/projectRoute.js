const { authentication, restrictTo } = require('../controller/authCotroller');
const { createProject } = require('../controller/projectController');


const router = require('express').Router();

router.route('/').post(authentication, restrictTo('2'), createProject)

module.exports = router;
