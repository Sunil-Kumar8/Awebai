const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote');

// @route   POST /api/quote
// @desc    Submit quote request form
// @access  Public
router.post('/', async (req, res, next) => {
    try {
        const { firstName, lastName, email, company, website, service, budget, timeline, message } = req.body;

        // Clean validation check
        if (!firstName || !email || !service || !budget || !timeline || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: firstName, email, service, budget, timeline, and message.'
            });
        }

        // Create new quote record
        const quote = new Quote({
            firstName,
            lastName,
            email,
            company,
            website,
            service,
            budget,
            timeline,
            message
        });

        // Save to MongoDB
        await quote.save();

        return res.status(201).json({
            success: true,
            message: 'Quote request submitted successfully! We will analyze and reply within 24 hours.',
            data: {
                id: quote._id,
                name: `${quote.firstName} ${quote.lastName}`.trim(),
                email: quote.email,
                service: quote.service,
                budget: quote.budget,
                timeline: quote.timeline,
                createdAt: quote.createdAt
            }
        });
    } catch (error) {
        // Forward error to global error handler
        next(error);
    }
});

module.exports = router;
