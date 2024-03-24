const Project = require('../models/projectModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

exports.getAllProjects = factory.getAll(Project);
exports.createProject = factory.createOne(Project);
exports.updateProject = factory.updateOne(Project);
exports.getProject = factory.getOne(Project);
exports.deleteProject = factory.deleteOne(Project);

exports.getFeaturedProjects = factory.getFeatured(Project);

exports.processFrontendPost = catchAsync(async (req, res, next) => {
    if (req.query.frontend !== 'true') return next();
  
    const parentDir = path.join(__dirname, '..');
    const publicImgDir = path.join(parentDir, 'public', 'img');
    console.log("hello");
  
    const coverImageFile = req.files.find((file) => file.fieldname === 'coverImage');

    if (coverImageFile) {
      try {
        const coverImageFilename = coverImageFile.originalname;
        const filenamePrefix = coverImageFilename.split('-').slice(0, -1).join('-');
        const metadata = await sharp(coverImageFile.buffer).metadata();
  
        if (metadata.format !== 'jpeg' && metadata.format !== 'png') {
          return next(new AppError(`Cover image file must be a JPG or PNG file. Got: ${metadata.format}.`, 400));
        }
  
        if (metadata.width !== 1200 || metadata.height !== 800) {
          return next(new AppError(`Cover image must be resolution 1200x800px.`, 400));
        }
  
        if (!fs.existsSync(path.join(publicImgDir, coverImageFilename))) {
          await sharp(coverImageFile.buffer).toFile(path.join(publicImgDir, coverImageFilename));
        }
  
        const mediumCoverPath = path.join(publicImgDir, `${filenamePrefix}.jpg`);
        if (!fs.existsSync(mediumCoverPath)) {
          await sharp(coverImageFile.buffer).resize(720, 480).toFile(mediumCoverPath);
        }
  
        const smallCoverImagePath = path.join(publicImgDir, `${filenamePrefix}-small.jpg`);
        if (!fs.existsSync(smallCoverImagePath)) {
          await sharp(coverImageFile.buffer).resize(360, 240).toFile(smallCoverImagePath);
        }

        const lazyCoverImagePath = path.join(publicImgDir, `${filenamePrefix}-lazy.jpg`);
        if (!fs.existsSync(smallCoverImagePath)) {
          await sharp(coverImageFile.buffer).resize(100, 67).toFile(lazyCoverImagePath);
        }

        req.body.coverImage = `${filenamePrefix}.jpg`;

      } catch(err) {
        console.error(err);
      }
    }
  
    req.body.categories = req.body.categories.split('\r\n');
    req.body.tags = req.body.tags.split('\r\n');
    req.body.techsUsed = req.body.techsUsed.split('\r\n');
    req.body.contributors = req.body.contributors.split('\r\n');

    console.log(req.body);
  
    next();
  });
  