const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', viewsController.getLanding);
router.get('/projects', viewsController.getAllProjects);
router.get('/projects/post', authController.protect, viewsController.postProject);
router.get('/projects/:slug', viewsController.getProject);

router.get('/articles', viewsController.getAllArticles);
router.get('/articles/post', authController.protect, viewsController.postArticle);
router.get('/articles/:slug', viewsController.getArticle);

module.exports = router;
