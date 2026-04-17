import { useState } from 'react';
import { motion } from 'framer-motion';

const BrainDumpInput = ({ onGenerate, isGenerating }) => {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input.trim()) {
      onGenerate(input);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <textarea
        className="brain-dump-area"
        placeholder="Dump your messy backend ideas here... (e.g., I want to build a RAG-based AI PDF app, but I don't know how to handle the data flow or networking protocols.)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isGenerating}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          onClick={handleSubmit} 
          disabled={isGenerating || !input.trim()}
          style={{ width: '100%' }}
        >
          {isGenerating ? (
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              INITIALIZING_AI_ENGINE...
            </motion.div>
          ) : (
            'COMPILE_ARCHITECTURE'
          )}
        </button>
      </div>
    </div>
  );
};

export default BrainDumpInput;
