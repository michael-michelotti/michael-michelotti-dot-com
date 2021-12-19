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
  images: [String],
  contributors: [String],
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

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
