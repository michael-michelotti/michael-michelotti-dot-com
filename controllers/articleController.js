const Article = require('../models/articleModel');
const factory = require('./handlerFactory');

exports.getAllArticles = factory.getAll(Article);
exports.createArticle = factory.createOne(Article);
exports.updateArticle = factory.updateOne(Article);
exports.getArticle = factory.getOne(Article);
exports.deleteArticle = factory.deleteOne(Article);
