const Article = require('../models/articleModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const fs = require('fs');
const path = require('path');
const slugify = require('slugify');
const sharp = require('sharp');


exports.getAllArticles = factory.getAll(Article);
exports.createArticle = factory.createOne(Article);
exports.updateArticle = factory.updateOne(Article);
exports.getArticle = factory.getOne(Article);
exports.deleteArticle = factory.deleteOne(Article);

exports.getFeaturedArticles = factory.getFeatured(Article);

exports.processFrontendPost = catchAsync(async (req, res, next) => {
  if (req.query.frontend !== 'true') return next();

  const parentDir = path.join(__dirname, '..');
  const publicImgDir = path.join(parentDir, 'public', 'img');

  const articlesDir = path.join(parentDir, 'data', 'articleFiles');
  if (!fs.existsSync(articlesDir)) {
    fs.mkdirSync(articlesDir, {recursive: true});
  }

  // article body markdown file
  const bodyMarkdownFile = req.files.find((file) => file.fieldname === 'body');
  if (bodyMarkdownFile) {
    const newArticlePath = path.join(articlesDir, `${slugify(req.body.name, { lower: true })}.md`);
    if (!fs.existsSync(newArticlePath)) {
      fs.writeFileSync(newArticlePath, bodyMarkdownFile.buffer);
    }
    req.body.body = bodyMarkdownFile.buffer.toString('utf-8');
  }

  // card image file
  const cardImageFile = req.files.find((file) => file.fieldname === 'cardImage');
  if (cardImageFile) {
    try {
      const cardImageFilename = cardImageFile.originalname;
      const cardFilenamePrefix = cardImageFilename.split('.').slice(0, -1).join('.');
      const metadata = await sharp(cardImageFile.buffer).metadata();

      if (metadata.format !== 'jpeg' && metadata.format !== 'png') {
        return next(new AppError(`Card image file must be a JPG or PNG file. Got: ${metadata.format}.`, 400));
      }

      if (metadata.width !== 520 || metadata.height !== 520) {
        return next(new AppError(`Card image must be resolution 520x520px.`, 400));
      }


      if (!fs.existsSync(path.join(publicImgDir, cardImageFilename))) {
        await sharp(cardImageFile.buffer).toFile(path.join(publicImgDir, cardImageFilename));
      }

      const smallCardImagePath = path.join(publicImgDir, `${cardFilenamePrefix}-small.jpg`);
      if (!fs.existsSync(smallCardImagePath)) {
        await sharp(cardImageFile.buffer).resize(240, 240).toFile(smallCardImagePath);
      }

      const lazyCardImagePath = path.join(publicImgDir, `${cardFilenamePrefix}-lazy.jpg`);
      if (!fs.existsSync(lazyCardImagePath)) {
        await sharp(cardImageFile.buffer).resize(200, 200).toFile(lazyCardImagePath);
      }
      req.body.cardImage = cardImageFilename;

    } catch(err) {
      console.error(err);
    }
  }

  // cover image file
  const coverImageFile = req.files.find((file) => file.fieldname === 'coverImage');
  if (coverImageFile) {
    try {
      const coverImageFilename = coverImageFile.originalname;
      const filenamePrefix = coverImageFilename.split('-').slice(0, -1).join('-');
      const metadata = await sharp(coverImageFile.buffer).metadata();

      if (metadata.format !== 'jpeg' && metadata.format !== 'png') {
        return next(new AppError(`Cover image file must be a JPG or PNG file. Got: ${metadata.format}.`, 400));
      }

      if (metadata.width !== 1440 || metadata.height !== 603) {
        return next(new AppError(`Cover image must be resolution 1440x603px.`, 400));
      }

      if (!fs.existsSync(path.join(publicImgDir, coverImageFilename))) {
        await sharp(coverImageFile.buffer).toFile(path.join(publicImgDir, coverImageFilename));
      }

      const mediumCoverPath = path.join(publicImgDir, `${filenamePrefix}.jpg`);
      if (!fs.existsSync(mediumCoverPath)) {
        await sharp(coverImageFile.buffer).resize(720, 302).toFile(mediumCoverPath);
      }

      const smallCoverImagePath = path.join(publicImgDir, `${filenamePrefix}-small.jpg`);
      if (!fs.existsSync(smallCoverImagePath)) {
        await sharp(coverImageFile.buffer).resize(480, 201).toFile(smallCoverImagePath);
      }
      req.body.coverImage = `${filenamePrefix}.jpg`;

    } catch(err) {
      console.error(err);
    }
  }


  req.body.summaryPoints = req.body.summaryPoints.split('\r\n');
  req.body.categories = req.body.categories.split('\r\n');
  req.body.tags = req.body.tags.split('\r\n');
  req.body.authors = req.body.authors.split('\r\n');

  next();
});
