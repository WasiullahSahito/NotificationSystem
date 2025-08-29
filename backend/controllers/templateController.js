const Template = require('../models/Template');
const { extractTemplateVariables } = require('../utils/validators');

// Create a new template
const createTemplate = async (req, res) => {
    try {
        const { name, type, subject, content } = req.body;

        if (!name || !type || !content) {
            return res.status(400).json({
                message: 'Name, type, and content are required'
            });
        }

        // Extract variables from content
        const variables = extractTemplateVariables(content);

        const template = new Template({
            name,
            type,
            subject: subject || '',
            content,
            variables
        });

        await template.save();

        res.status(201).json({
            message: 'Template created successfully',
            template: {
                id: template._id,
                name: template.name,
                type: template.type,
                subject: template.subject,
                content: template.content,
                variables: template.variables,
                createdAt: template.createdAt
            }
        });
    } catch (error) {
        console.error('Create template error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Template name already exists' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all templates
const getTemplates = async (req, res) => {
    try {
        const { type } = req.query;
        const filter = type ? { type } : {};

        const templates = await Template.find(filter)
            .sort({ createdAt: -1 })
            .select('-__v')
            .lean();

        res.json({
            templates,
            count: templates.length
        });
    } catch (error) {
        console.error('Get templates error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get single template
const getTemplate = async (req, res) => {
    try {
        const template = await Template.findById(req.params.id).select('-__v');

        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }

        res.json(template);
    } catch (error) {
        console.error('Get template error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid template ID' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update template
const updateTemplate = async (req, res) => {
    try {
        const { name, type, subject, content } = req.body;

        // Extract variables from content if provided
        let variables;
        if (content) {
            variables = extractTemplateVariables(content);
        }

        const updateData = {
            ...(name && { name }),
            ...(type && { type }),
            ...(subject !== undefined && { subject }),
            ...(content && { content }),
            ...(variables && { variables })
        };

        const template = await Template.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-__v');

        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }

        res.json({
            message: 'Template updated successfully',
            template
        });
    } catch (error) {
        console.error('Update template error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Template name already exists' });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid template ID' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete template
const deleteTemplate = async (req, res) => {
    try {
        const template = await Template.findByIdAndDelete(req.params.id);

        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }

        res.json({ message: 'Template deleted successfully' });
    } catch (error) {
        console.error('Delete template error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid template ID' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createTemplate,
    getTemplates,
    getTemplate,
    updateTemplate,
    deleteTemplate
};