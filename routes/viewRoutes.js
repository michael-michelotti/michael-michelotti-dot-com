const express = require('express');
const viewsController = require('../controllers/viewsController');

const router = express.Router();

router.get('/', viewsController.getLanding);
router.get('/projects', viewsController.getAllProjects);
router.get('/projects/:slug', viewsController.getProject);

router.get('/articles', viewsController.getAllArticles);
router.get('/articles/post', viewsController.postArticle);
router.get('/articles/:slug', viewsController.getArticle);

module.exports = router;
