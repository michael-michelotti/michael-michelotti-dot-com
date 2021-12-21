const express = require('express');
const articleController = require('../controllers/articleController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/featured').get(articleController.getFeaturedArticles);

router
  .route('/:id')
  .get(articleController.getArticle)
  .patch(authController.protect, articleController.updateArticle)
  .delete(authController.protect, articleController.deleteArticle);

router
  .route('/')
  .get(articleController.getAllArticles)
  .post(authController.protect, articleController.createArticle);

module.exports = router;
