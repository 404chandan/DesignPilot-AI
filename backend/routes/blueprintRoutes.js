const express = require('express');
const router = express.Router();
const Blueprint = require('../models/Blueprint');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/blueprints
// @desc    Get all blueprints for logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const blueprints = await Blueprint.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(blueprints);
  } catch (error) {
    console.error('Error fetching blueprints:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const { GoogleGenerativeAI } = require('@google/generative-ai');

// @route   POST /api/blueprints/:id/chat
// @desc    Chat with the AI about a specific architecture blueprint
// @access  Private
router.post('/:id/chat', protect, async (req, res) => {
  try {
    const blueprint = await Blueprint.findOne({ _id: req.params.id, userId: req.user.id });
    if (!blueprint) {
      return res.status(404).json({ message: 'Blueprint not found' });
    }

    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Prepare conversation history
    const history = blueprint.chatHistory && blueprint.chatHistory.length > 0 
      ? blueprint.chatHistory.map(msg => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.text}`).join('\n\n')
      : 'No previous chat history.';

    const systemPrompt = `You are an expert System Design Architect assisting a user with their existing software architecture blueprint.
    
Current Architecture Blueprint:
${blueprint.generatedArchitecture}

Chat History:
${history}

The user has a new message for you:
User: ${message}

Instructions:
1. Answer the user's question or address their request briefly and professionally.
2. If the user's message implies they want to change the architecture (e.g., adding a feature, swapping a database, fixing a bottleneck), you MUST output the ENTIRE updated architecture in clean Markdown enclosed exactly within <NEW_ARCHITECTURE>...</NEW_ARCHITECTURE> tags at the end of your response. 
3. Include mermaid diagrams (flowcharts, mindmaps, workflows) whenever helpful or requested. ALWAYS wrap Mermaid node labels in double quotes (e.g., A["Label with (parentheses)"]) to avoid syntax errors.
4. Keep your conversational response (outside the tags) very brief and to the point.
5. If they are just asking a question and not requesting a change, do NOT include the <NEW_ARCHITECTURE> tags.`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const aiText = response.text();

    let updatedArchitecture = blueprint.generatedArchitecture;
    let replyText = aiText;

    // Check if the AI provided a new architecture
    const newArchMatch = aiText.match(/<NEW_ARCHITECTURE>([\s\S]*?)<\/NEW_ARCHITECTURE>/);
    if (newArchMatch && newArchMatch[1]) {
      updatedArchitecture = newArchMatch[1].trim();
      // Remove the tags from the reply text shown to the user
      replyText = aiText.replace(/<NEW_ARCHITECTURE>[\s\S]*?<\/NEW_ARCHITECTURE>/, '').trim();
      if (!replyText) {
        replyText = "I have updated the architecture as requested. Check the updated blueprint!";
      }
      blueprint.generatedArchitecture = updatedArchitecture;
    }

    // Add to chat history
    if (!blueprint.chatHistory) {
      blueprint.chatHistory = [];
    }
    blueprint.chatHistory.push({ role: 'user', text: message });
    blueprint.chatHistory.push({ role: 'model', text: replyText });

    await blueprint.save();

    res.json({
      reply: replyText,
      updatedArchitecture: updatedArchitecture,
      chatHistory: blueprint.chatHistory
    });

  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ message: 'Server error during chat' });
  }
});

module.exports = router;
