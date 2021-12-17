const mongoose = require('mongoose');
const slugify = require('slugify');

const articleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Article must have a name'],
    unique: true,
  },
  summaryPoints: {
    type: [String],
    required: [true, 'Article must have a summary'],
  },
  body: String,
  slug: String,
  categories: [String],
  tags: [String],
  coverImage: String,
  coverImageCaption: String,
  images: [String],
  authors: [String],
  featured: {
    type: Boolean,
    default: false,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
  postedOn: {
    type: Date,
    default: Date.now(),
  },
});

const Article = mongoose.model('article', articleSchema);
module.exports = Article;
