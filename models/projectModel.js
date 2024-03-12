const mongoose = require('mongoose');
const slugify = require('slugify');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project must have a name'],
    unique: true,
  },
  summary: {
    type: String,
    required: [true, 'Project must have a summary'],
  },
  detailDescription: String,
  slug: String,
  categories: [String],
  tags: [String],
  techsUsed: [String],
  liveLink: String,
  githubLink: String,
  coverImage: String,
  coverImageAltText: String,
  images: [String],
  contributors: [String],
  featured: {
    type: Boolean,
    default: false,
  },
  featured_position: {
    type: Number,
    validate: {
      validator: function(v) {
        return v >= 1 && v <= 3;
      },
      message: props => `${props.value} is not a valid featured project position. Must be between 1 and 3.`
    }
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

projectSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

projectSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

// If updating the name, I want to update the slug
projectSchema.pre('findOneAndUpdate', function (next) {
  if ('name' in this._update) {
    this.set({ slug: slugify(this._update.name, { lower: true }) });
  }
  next();
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
