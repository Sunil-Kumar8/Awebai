const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// @route   POST /api/contact
// @desc    Submit contact request form
// @access  Public
router.post('/', async (req, res, next) => {
    try {
        const { firstName, lastName, email, service, message } = req.body;

        // Clean validation check (in addition to mongoose schema validations)
        if (!firstName || !email || !service || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: firstName, email, service, and message.'
            });
        }

        // Create new contact record
        const contact = new Contact({
            firstName,
            lastName,
            email,
            service,
            message
        });

        // Save to MongoDB
        await contact.save();

        return res.status(201).json({
            success: true,
            message: 'Inquiry sent successfully! We will get back to you within 24 hours.',
            data: {
                id: contact._id,
                name: `${contact.firstName} ${contact.lastName}`.trim(),
                email: contact.email,
                service: contact.service,
                createdAt: contact.createdAt
            }
        });
    } catch (error) {
        // Forward error to global error handler
        next(error);
    }
});

module.exports = router;
