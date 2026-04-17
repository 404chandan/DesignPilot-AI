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
  }
}, { timestamps: true });

module.exports = mongoose.model('Blueprint', blueprintSchema);
