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
  const relatedArticles = await getRelatedArticles(article);

  res.status(200).render(`${PAGE_ROOT}/article`, {
    title: article.name,
    article,
    relatedArticles,
  });
});
