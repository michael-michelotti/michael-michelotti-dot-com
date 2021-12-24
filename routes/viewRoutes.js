const express = require('express');
const viewsController = require('../controllers/viewsController');

const router = express.Router();

router.get('/', viewsController.getLanding);
router.get('/projects', viewsController.getAllProjects);

module.exports = router;
