import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'var(--font-mono)'
});

const Mermaid = ({ chart }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && chart) {
      mermaid.render(`mermaid-${Math.random().toString(36).substr(2, 9)}`, chart)
        .then(({ svg }) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
          }
        })
        .catch((e) => {
          console.error('Mermaid render error:', e);
          if (containerRef.current) {
             containerRef.current.innerHTML = `<p style="color:red; font-size: 12px; font-family: monospace;">[MERMAID_ERROR] ${e.message}</p>`;
          }
        });
    }
  }, [chart]);

  return <div ref={containerRef} className="mermaid-container" style={{ margin: '20px 0', display: 'flex', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '8px', border: '1px solid #333', overflowX: 'auto' }} />;
};

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
      <ReactMarkdown
        components={{
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '')
            if (!inline && match && match[1] === 'mermaid') {
              return <Mermaid chart={String(children).replace(/\n$/, '')} />
            }
            return !inline ? (
              <pre style={{ background: '#000', padding: '16px', borderRadius: '4px', overflowX: 'auto', border: '1px solid #333', margin: '16px 0' }}>
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.9em' }} className={className} {...props}>
                {children}
              </code>
            )
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </motion.div>
  );
};

export default BlueprintDisplay;
