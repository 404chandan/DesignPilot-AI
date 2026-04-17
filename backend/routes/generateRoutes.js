const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { protect } = require('../middleware/authMiddleware');
const Blueprint = require('../models/Blueprint');

// @route   POST /api/generate-architecture
// @desc    Generate system design architecture from messy input
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { brainDump } = req.body;

    if (!brainDump) {
      return res.status(400).json({ message: 'Please provide an idea to process' });
    }

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const systemPrompt = `You are an expert System Design Architect. The user will provide a disorganized idea for a software application. Your job is to organize it into a structured, step-by-step technical blueprint. You must specifically highlight the optimal data flow, suggest appropriate networking protocols (like HTTP vs. WebSockets, or TCP/IP considerations), and identify at least two potential scaling bottlenecks. Output the response in clean Markdown.`;
    
    const prompt = `${systemPrompt}\n\nUser Idea:\n${brainDump}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedArchitecture = response.text();

    // Save to database
    const blueprint = await Blueprint.create({
      userId: req.user.id,
      originalPrompt: brainDump,
      generatedArchitecture: generatedArchitecture,
    });

    res.status(201).json(blueprint);
  } catch (error) {
    console.error('Error generating architecture:', error);
    res.status(500).json({ message: 'Error generating architecture' });
  }
});

module.exports = router;
