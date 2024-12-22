const { authentication, restrictTo } = require('../controller/authCotroller');
const { createProject, getAllProject, getProjectById } = require('../controller/projectController');


const router = require('express').Router();

router.route('/').post(authentication, restrictTo('1'), createProject).get(authentication, getAllProject);

router.route('/:id').get(authentication, getProjectById);

module.exports = router;
