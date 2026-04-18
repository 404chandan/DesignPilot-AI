const mongoose = require('mongoose');

const blueprintSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  originalPrompt: {
    type: String,
    required: true,
  },
  generatedArchitecture: {
    type: String,
    required: true,
  },
  chatHistory: [{
    role: { type: String, enum: ['user', 'model'], required: true },
    text: { type: String, required: true }
  }],
  workspaceFiles: [{
    name: { type: String, required: true },
    path: { type: String, required: true },
    language: { type: String, default: 'javascript' },
    content: { type: String, default: '' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Blueprint', blueprintSchema);
