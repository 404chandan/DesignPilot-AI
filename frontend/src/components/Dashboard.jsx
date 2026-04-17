import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import BrainDumpInput from './BrainDumpInput';
import BlueprintDisplay from './BlueprintDisplay';
import { LogOut, Terminal } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [currentBlueprint, setCurrentBlueprint] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (brainDump) => {
    setIsGenerating(true);
    setError('');
    setCurrentBlueprint(null);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.post('http://localhost:5000/api/generate-architecture', { brainDump }, config);
      setCurrentBlueprint(data.generatedArchitecture);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate architecture');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="glow-text">
          <Terminal size={24} color="#00ffcc" />
          DesignPilot AI
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

      <main className="dashboard-main">
        <div className="panel panel-left">
          <div className="panel-title">// INPUT_NODE: BRAIN_DUMP</div>
          <BrainDumpInput onGenerate={handleGenerate} isGenerating={isGenerating} />
          {error && <div style={{ color: '#ff3333', marginTop: '16px', fontFamily: 'var(--font-mono)', fontSize: '14px' }}>[ERROR]: {error}</div>}
        </div>
        <div className="panel">
          <div className="panel-title">// OUTPUT_NODE: BLUEPRINT</div>
          <BlueprintDisplay content={currentBlueprint} isGenerating={isGenerating} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
