import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

const BlueprintDisplay = ({ content, isGenerating }) => {
  if (isGenerating) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
        <motion.div
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          [AWAITING_AI_RESPONSE...]
        </motion.div>
      </div>
    );
  }

  if (!content) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
        <p>&gt; SYSTEM_IDLE. WAITING FOR INPUT.</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="blueprint-content"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </motion.div>
  );
};

export default BlueprintDisplay;
