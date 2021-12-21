const express = require('express');
const projectController = require('../controllers/projectController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/featured').get(projectController.getFeaturedProjects);

router
  .route('/:id')
  .get(projectController.getProject)
  .patch(authController.protect, projectController.updateProject)
  .delete(authController.protect, projectController.deleteProject);

router
  .route('/')
  .get(projectController.getAllProjects)
  .post(authController.protect, projectController.createProject);

module.exports = router;
