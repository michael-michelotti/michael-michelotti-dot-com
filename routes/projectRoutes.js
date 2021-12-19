const express = require('express');
const projectController = require('../controllers/projectController');

const router = express.Router();

router.route('/featured').get(projectController.getFeaturedProjects);

router
  .route('/:id')
  .get(projectController.getProject)
  .patch(projectController.updateProject)
  .delete(projectController.deleteProject);

router
  .route('/')
  .get(projectController.getAllProjects)
  .post(projectController.createProject);

module.exports = router;
