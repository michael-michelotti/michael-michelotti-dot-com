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
    title: 'Welcome!',
    projects: featProj,
    articles: featArt,
  });
});
