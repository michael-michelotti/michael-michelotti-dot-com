const catchAsync = require('../utils/catchAsync');
const Project = require('../models/projectModel');
const Article = require('../models/articleModel');
const AppError = require('../utils/appError');

const PAGE_ROOT = 'pages';

exports.getLanding = catchAsync(async (req, res, next) => {
  /**
   * Array of featured projects
   * @type {Array<Object>}
   */
  const featProjects = await Project.find({ featured: true, hidden: false });
  /**
   * Array of featured articles
   * @type {Array<Object>}
   */
  const featArticles = await Article.find({ featured: true, hidden: false });

  if (featProjects.length > 3) featProjects.splice(3);
  if (featArticles.length > 2) featArticles.splice(2);

  res.status(200).render(`${PAGE_ROOT}/landing`, {
    title: 'Welcome',
    projects: featProjects,
    articles: featArticles,
  });
});

exports.getAllProjects = catchAsync(async (req, res, next) => {
  /**
   * Array of projects which aren't hidden
   * @type {Array<Object>}
   */
  const projects = await Project.find({ hidden: false });

  res.status(200).render(`${PAGE_ROOT}/allProjects`, {
    title: 'All Projects',
    projects,
  });
});

exports.getAllArticles = catchAsync(async (req, res, next) => {
  /**
   * Array of articles which aren't hidden
   * @type {Array<Object>}
   */
  const articles = await Article.find({ hidden: false });

  res.status(200).render(`${PAGE_ROOT}/allArticles`, {
    title: 'All Articles',
    articles,
  });
});

/**
 * MongoDB aggregation pipeline to find articles with overlapping categories and tags
 * Sorted by amount of overlap (categories then tags)
 * @param {Object} article main article
 * @returns {Array<Object>} articles considered related to main article
 */
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
                { $toInt: { $in: ['$$this', article.categories] } },
              ],
            },
          },
        },
        commonTags: {
          $reduce: {
            input: '$tags',
            initialValue: 0,
            in: {
              $add: ['$$value', { $toInt: { $in: ['$$this', article.tags] } }],
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
        cardImage: 1,
      },
    },
  ]);
}

exports.getArticle = catchAsync(async (req, res, next) => {
  /**
   * Article which matches the URL slug
   * @type {Object}
   */
  const article = await Article.findOne({ slug: req.params.slug });

  if (!article)
    return next(new AppError('Could not find an article with that name.', 404));

  /**
   * Articles with overlapping categories or tags with main article
   * @type {Array<Object>}
   */
  const relatedArticles = await getRelatedArticles(article);

  res.status(200).render(`${PAGE_ROOT}/article`, {
    title: article.name,
    article,
    relatedArticles,
  });
});
