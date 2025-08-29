const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    createTemplate,
    getTemplates,
    getTemplate,
    updateTemplate,
    deleteTemplate
} = require('../controllers/templateController');

// All routes require authentication
router.use(auth);

// Create a new template
router.post('/', createTemplate);

// Get all templates
router.get('/', getTemplates);

// Get single template
router.get('/:id', getTemplate);

// Update template
router.put('/:id', updateTemplate);

// Delete template
router.delete('/:id', deleteTemplate);

module.exports = router;