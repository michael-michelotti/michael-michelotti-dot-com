const catchAsync = require('../utils/catchAsync');
const Project = require('../models/projectModel');
const Article = require('../models/articleModel');

const PAGE_ROOT = 'pages';

exports.getLanding = catchAsync(async (req, res, next) => {
  const featProj = await Project.find({ featured: true });
  const featArt = await Article.find({ featured: true });

  if (featProj.length > 3) featProj.splice(3);
  if (featArt.length > 2) featArt.splice(2);

  res.status(200).render(`${PAGE_ROOT}/landing`, {
    title: 'Welcome',
    projects: featProj,
    articles: featArt,
  });
});

exports.getAllProjects = catchAsync(async (req, res, next) => {
  const projects = await Project.find({ hidden: false });

  res.status(200).render(`${PAGE_ROOT}/allProjects`, {
    title: 'All Projects',
    projects,
  });
});

exports.getAllArticles = catchAsync(async (req, res, next) => {
  const articles = await Article.find({ hidden: false });

  res.status(200).render(`${PAGE_ROOT}/allArticles`, {
    title: 'All Articles',
    articles,
  });
});

exports.getArticle = catchAsync(async (req, res, next) => {
  const article = await Article.findOne({ slug: req.params.slug });

  mainCategory = article.categories[0];

  const relatedArticles = await Article.find({
    categories: mainCategory,
    _id: { $ne: article._id },
  });

  res.status(200).render(`${PAGE_ROOT}/article`, {
    title: article.name,
    article,
    relatedArticles,
  });
});
