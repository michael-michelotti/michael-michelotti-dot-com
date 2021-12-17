const express = require('express');
const articleController = require('../controllers/articleController');

const router = express.Router();

router
  .route('/:id')
  .get(articleController.getArticle)
  .patch(articleController.updateArticle);

router
  .route('/')
  .get(articleController.getAllArticles)
  .post(articleController.createArticle);

module.exports = router;
