const Article = require('../models/articleModel');
const factory = require('./handlerFactory');

exports.getAllArticles = factory.getAll(Article);
exports.createArticle = factory.createOne(Article);
