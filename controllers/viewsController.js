const catchAsync = require('../utils/catchAsync');
const Project = require('../models/projectModel');
const Article = require('../models/articleModel');

exports.getLanding = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const featProj = await Project.find({ featured: true });
  const featArt = await Article.find({ featured: true });

  if (featProj.length > 3) featProj.splice(3);
  if (featArt.length > 2) featArt.splice(2);

  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render('landing', {
    title: 'Welcome',
    projects: featProj,
    articles: featArt,
  });
});

exports.getAllProjects = catchAsync(async (req, res, next) => {
  const projects = await Project.find({ hidden: false });

  res.status(200).render('allProjects', {
    title: 'All Projects',
    projects,
  });
});

exports.getAllArticles = catchAsync(async (req, res, next) => {
  const articles = await Article.find({ hidden: false });

  res.status(200).render('allArticles', {
    title: 'All Articles',
    articles,
  });
});

exports.getArticle = catchAsync(async (req, res, next) => {
  const article = await Article.findOne({ slug: req.params.slug });

  res.status(200).render('article', {
    title: article.name,
    article,
  });
});
