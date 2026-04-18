import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Terminal, Plus, Clock, FileText, Code } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BlueprintDisplay from './BlueprintDisplay';
import ArchitectureChat from './ArchitectureChat';
import CodeWorkspace from './CodeWorkspace';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [blueprints, setBlueprints] = useState([]);
  const [selectedBlueprint, setSelectedBlueprint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWorkspace, setShowWorkspace] = useState(false);
  const navigate = useNavigate();

  // Helper to close modal
  const closeModal = () => {
    setSelectedBlueprint(null);
    setShowWorkspace(false);
  };

  const handleUpdateBlueprint = (updatedBlueprint) => {
    setSelectedBlueprint(updatedBlueprint);
    setBlueprints(prev => prev.map(bp => bp._id === updatedBlueprint._id ? updatedBlueprint : bp));
  };

  useEffect(() => {
    const fetchBlueprints = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/blueprints`, config);
        setBlueprints(data);
      } catch (err) {
        console.error('Failed to fetch blueprints', err);
        if (err.response && err.response.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBlueprints();
  }, [user.token]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="glow-text" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.png" alt="Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          DesignPilot AI Dashboard
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className="hacker-text" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            USER: {user?.username}
          </span>
          <button onClick={logout} style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LogOut size={16} /> LOGOUT
          </button>
        </div>
      </header>

      <main className="dashboard-main" style={{ flexDirection: 'column', gap: '24px', overflowY: 'auto', padding: '24px' }}>
        <div className="dashboard-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>Your Architecture History</h2>
          <button
            onClick={() => navigate('/generate')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'var(--accent-color)', color: '#000', fontWeight: 'bold' }}
          >
            <Plus size={18} /> New Architecture
          </button>
        </div>

        {loading ? (
          <div style={{ color: 'var(--accent-color)', textAlign: 'center', marginTop: '40px' }}>Loading history...</div>
        ) : blueprints.length === 0 ? (
          <div className="empty-state panel" style={{ textAlign: 'center', padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <FileText size={48} color="var(--text-secondary)" />
            <h3 style={{ color: 'var(--text-primary)' }}>No architectures yet</h3>
            <p style={{ color: 'var(--text-secondary)' }}>You haven't generated any system designs yet.</p>
            <button onClick={() => navigate('/generate')} style={{ marginTop: '16px' }}>Generate Your First Design</button>
          </div>
        ) : (
          <div className="history-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {blueprints.map(bp => (
              <div key={bp._id} className="history-card panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', cursor: 'pointer', transition: 'all 0.2s ease', position: 'relative' }} onClick={() => setSelectedBlueprint(bp)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '12px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                  <Clock size={14} /> {new Date(bp.createdAt).toLocaleDateString()}
                </div>
                <h4 style={{ color: 'var(--accent-color)', margin: 0, fontSize: '16px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {bp.originalPrompt}
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>
                  {bp.generatedArchitecture.replace(/[#*`]/g, '').substring(0, 150)}...
                </p>
                <div style={{ marginTop: 'auto', paddingTop: '16px', fontSize: '12px', color: '#666', textAlign: 'right' }}>
                  Click to view details
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal for viewing full architecture */}
      {selectedBlueprint && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '10px' }}>
          <div className="panel split-modal" style={{ width: '100%', maxWidth: '1400px', height: '90vh', background: 'var(--bg-color)', position: 'relative', border: '1px solid var(--accent-color)', display: 'flex', flexDirection: 'row', padding: 0, overflow: 'hidden' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--accent-color)', borderRadius: '4px', padding: '4px 12px', color: 'var(--accent-color)', fontSize: '14px', cursor: 'pointer', zIndex: 20 }}>Close View</button>
            
            {/* Left side: Blueprint Display */}
            <div style={{ flex: 2, overflowY: 'auto', padding: '60px 24px 24px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '16px', marginBottom: '20px' }}>
                <h2 style={{ color: 'var(--accent-color)', margin: 0 }}>{selectedBlueprint.originalPrompt}</h2>
                <button 
                  onClick={() => setShowWorkspace(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(0, 255, 204, 0.1)' }}
                >
                  <Code size={18} /> Open Code Workspace
                </button>
              </div>
              <div style={{ color: 'var(--text-primary)', textAlign: 'left' }}>
                <BlueprintDisplay content={selectedBlueprint.generatedArchitecture} isGenerating={false} />
              </div>
            </div>

            {/* Right side: Chat */}
            <div className="chat-sidebar" style={{ flex: 1, minWidth: '350px', background: 'rgba(0,0,0,0.2)' }}>
              <ArchitectureChat 
                blueprint={selectedBlueprint} 
                onUpdateBlueprint={handleUpdateBlueprint} 
                userToken={user.token} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Code Workspace Overlay */}
      {showWorkspace && selectedBlueprint && (
        <CodeWorkspace 
          blueprint={selectedBlueprint} 
          onClose={() => setShowWorkspace(false)} 
        />
      )}
    </div>
  );
};

export default Dashboard;
