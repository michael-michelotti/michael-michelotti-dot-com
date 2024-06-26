const markdownit = require('markdown-it');
const { full: emoji } = require('markdown-it-emoji');
const mk = require('markdown-it-katex');

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

  featProjects.sort((a, b) => a.featured_position - b.featured_position);
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

  const allTechs = projects.flatMap((project) => project.techsUsed).filter((tech) => tech !== '');
  const uniqueTechs = [...new Set(allTechs)];
  const allCategories = projects.flatMap((project) => project.categories).filter((cat) => cat !== '');
  const uniqueCategories = [...new Set(allCategories)];

  res.status(200).render(`${PAGE_ROOT}/allProjects`, {
    title: 'All Projects',
    uniqueTechs,
    uniqueCategories,
    projects,
  });
});

exports.getProject = catchAsync(async (req, res, next) => {
  const project = await Project.findOne({ slug: req.params.slug });

  if (!project)
    return next(new AppError('Could not find a project with that name.', 404));

  res.status(200).render(`${PAGE_ROOT}/project`, {
    title: project.name,
    project
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

  const md = markdownit({
    html: true,
    linkify: true,
    typographer: true
  });
  md.use(emoji);
  md.use(mk);
  article.body = md.render(article.body);

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

exports.postArticle = catchAsync(async (req, res, next) => {
  res.status(200).render(`${PAGE_ROOT}/postArticle`, {
    title: "Create an article",
  });
});

exports.updateArticle = catchAsync(async (req, res, next) => {
  const article = await Article.findOne({ _id: req.params.id });

  if (!article)
    return next(new AppError('Could not find an article with that ID.', 404));

  res.status(200).render(`${PAGE_ROOT}/updateArticle`, {
    title: "Update an article",
    article
  });
});

exports.postProject = catchAsync(async (req, res, next) => {
  res.status(200).render(`${PAGE_ROOT}/postProject`, {
    title: "Create a project",
  });
});
