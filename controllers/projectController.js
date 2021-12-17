const Project = require('../models/projectModel');
const factory = require('./handlerFactory');

exports.getAllProjects = factory.getAll(Project);
exports.createProject = factory.createOne(Project);
