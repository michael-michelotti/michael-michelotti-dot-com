const express = require('express');
const projectController = require('../controllers/projectController');

const router = express.Router();

router
  .route('/:id')
  .get(projectController.getProject)
  .patch(projectController.updateProject);

router
  .route('/')
  .get(projectController.getAllProjects)
  .post(projectController.createProject);

module.exports = router;