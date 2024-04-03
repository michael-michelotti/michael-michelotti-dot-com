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
  cardImage: String,
  cardImageAltText: String,
  coverImage: String,
  coverImageCaption: String,
  coverImageAltText: String,
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
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

articleSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

articleSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

// If updating the name, also update the slug
articleSchema.pre('findOneAndUpdate', function (next) {
  if ('name' in this._update) {
    this.set({ slug: slugify(this._update.name, { lower: true }) });
  }
  next();
});

const Article = mongoose.model('article', articleSchema);
module.exports = Article;
