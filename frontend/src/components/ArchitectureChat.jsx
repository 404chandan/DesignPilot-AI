import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, User, Bot, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const ArchitectureChat = ({ blueprint, onUpdateBlueprint, userToken }) => {
  const [messages, setMessages] = useState(blueprint.chatHistory || []);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update messages if blueprint changes from outside
  useEffect(() => {
    if (blueprint.chatHistory) {
      setMessages(blueprint.chatHistory);
    } else {
      setMessages([]);
    }
  }, [blueprint]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setError('');
    
    // Optimistic UI update
    const newMessages = [...messages, { role: 'user', text: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      };
      const { data } = await axios.post(`http://localhost:5000/api/blueprints/${blueprint._id}/chat`, { message: userMessage }, config);
      
      setMessages(data.chatHistory);
      
      if (data.updatedArchitecture !== blueprint.generatedArchitecture) {
        onUpdateBlueprint({
          ...blueprint,
          generatedArchitecture: data.updatedArchitecture,
          chatHistory: data.chatHistory
        });
      } else {
        onUpdateBlueprint({
          ...blueprint,
          chatHistory: data.chatHistory
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
      // Rollback optimistic update
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', borderLeft: '1px solid #333', background: 'rgba(0,0,0,0.3)' }}>
      <div className="chat-header" style={{ padding: '16px', borderBottom: '1px solid #333', background: 'var(--bg-color)', zIndex: 10 }}>
        <h3 style={{ margin: 0, color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bot size={20} /> AI Architect
        </h3>
        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>Ask questions or request architecture changes.</p>
      </div>

      <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '40px', fontStyle: 'italic' }}>
            No chat history. How can I help you improve this architecture?
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              display: 'flex', 
              gap: '12px', 
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-start'
            }}
          >
            <div style={{ 
              background: msg.role === 'user' ? 'rgba(0, 255, 204, 0.1)' : 'rgba(255, 255, 255, 0.05)', 
              padding: '8px', 
              borderRadius: '50%', 
              color: msg.role === 'user' ? 'var(--accent-color)' : 'var(--text-secondary)' 
            }}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div style={{ 
              background: msg.role === 'user' ? 'rgba(0, 255, 204, 0.05)' : 'rgba(0,0,0,0.5)', 
              padding: '12px 16px', 
              borderRadius: '8px', 
              border: msg.role === 'user' ? '1px solid rgba(0, 255, 204, 0.2)' : '1px solid #333',
              color: 'var(--text-primary)',
              maxWidth: '80%',
              fontSize: '14px',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap'
            }}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', color: 'var(--text-secondary)' }}>
             <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '8px', borderRadius: '50%' }}>
              <Loader size={16} className="spin-animation" />
            </div>
            <span style={{ fontStyle: 'italic', fontSize: '14px' }}>Compiling response...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input" style={{ padding: '16px', borderTop: '1px solid #333', background: 'var(--bg-color)' }}>
        {error && <div style={{ color: '#ff3333', fontSize: '12px', marginBottom: '8px' }}>[ERROR]: {error}</div>}
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..." 
            disabled={isLoading}
            style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid #333', color: 'var(--text-primary)', borderRadius: '4px' }}
          />
          <button type="submit" disabled={isLoading || !input.trim()} style={{ background: 'var(--accent-color)', color: '#000', border: 'none', padding: '0 20px', borderRadius: '4px', cursor: isLoading ? 'not-allowed' : 'pointer' }}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ArchitectureChat;
