const catchAsync = require('../utils/catchAsync');
const Project = require('../models/projectModel');
const Article = require('../models/articleModel');
const AppError = require('../utils/appError');

const PAGE_ROOT = 'pages';

exports.getLanding = catchAsync(async (req, res, next) => {
  const featProjects = await Project.find({ featured: true });
  const featArticles = await Article.find({ featured: true });

  if (featProjects.length > 3) featProjects.splice(3);
  if (featArticles.length > 2) featArticles.splice(2);

  res.status(200).render(`${PAGE_ROOT}/landing`, {
    title: 'Welcome',
    projects: featProjects,
    articles: featArticles,
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

// MongoDB aggregation pipeline to find articles with overlapping categories and tags
// Sorted by amount of overlap (categories then tags)
async function getRelatedArticles(article) {
  return await Article.aggregate([
    {
      $match: { _id: { $ne: article._id } },
    },
    {
      $addFields: {
        commonCategories: {
          $reduce: {
            input: '$categories',
            initialValue: 0,
            in: {
              $add: [
                '$$value',
                {
                  $toInt: { $in: ['$$this', article.categories] },
                },
              ],
            },
          },
        },
        commonTags: {
          $reduce: {
            input: '$tags',
            initialValue: 0,
            in: {
              $add: [
                '$$value',
                {
                  $toInt: { $in: ['$$this', article.tags] },
                },
              ],
            },
          },
        },
      },
    },
    {
      $match: {
        $or: [{ commonCategories: { $gt: 0 } }, { commonTags: { $gt: 0 } }],
      },
    },
    {
      $sort: { commonCategories: -1, commonTags: -1, updatedAt: -1 },
    },
    {
      $limit: 3,
    },
    {
      $project: {
        name: 1,
        slug: 1,
        coverImage: 1,
      },
    },
  ]);
}

exports.getArticle = catchAsync(async (req, res, next) => {
  const article = await Article.findOne({ slug: req.params.slug });

  if (!article)
    next(new AppError('Could not find an article with that name.', 404));

  const relatedArticles = await getRelatedArticles(article);

  res.status(200).render(`${PAGE_ROOT}/article`, {
    title: article.name,
    article,
    relatedArticles,
  });
});
