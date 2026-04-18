import { useNavigate } from 'react-router-dom';
import { Terminal, Cpu, Zap, Code, Shield } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleCTA = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="home-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0, 255, 204, 0.2)', background: 'rgba(10, 10, 10, 0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.png" alt="Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          <h1 className="glow-text" style={{ fontSize: '24px', margin: 0 }}>DesignPilot AI</h1>
        </div>
        <nav style={{ display: 'flex', gap: '16px' }}>
          {user ? (
            <button onClick={() => navigate('/dashboard')} className="btn-outline">Dashboard</button>
          ) : (
            <>
              <button onClick={() => navigate('/login')} style={{ background: 'transparent', color: 'var(--primary-color)' }}>Login</button>
              <button onClick={() => navigate('/register')}>Sign Up</button>
            </>
          )}
        </nav>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <section className="hero" style={{ padding: '80px 20px', textAlign: 'center', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
          <div className="badge" style={{ padding: '6px 16px', borderRadius: '20px', border: '1px solid #00ffcc', color: '#00ffcc', fontSize: '14px', background: 'rgba(0, 255, 204, 0.1)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={14} /> Powered by Gemini 2.5 Pro
          </div>
          <h2 style={{ fontSize: '56px', lineHeight: 1.1, margin: 0, background: 'linear-gradient(to right, #ffffff, #00ffcc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Architect Your Next Big Idea in Seconds.
          </h2>
          <p style={{ fontSize: '20px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Turn messy brain dumps into structured, scalable system architecture blueprints. Let AI map out your data flow, networking, and bottlenecks before you write a single line of code.
          </p>
          <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
            <button onClick={handleCTA} style={{ fontSize: '18px', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Code size={20} /> Try DesignPilot Free
            </button>
            <a href="#features" style={{ padding: '16px 32px', color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', border: '1px solid #333', borderRadius: '4px', transition: 'all 0.2s' }}>
              Learn More
            </a>
          </div>
        </section>

        <section id="features" style={{ width: '100%', maxWidth: '1200px', padding: '80px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          <div className="feature-card panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '32px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 255, 204, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Cpu color="#00ffcc" size={24} />
            </div>
            <h3 style={{ margin: 0, color: 'white' }}>Instant Architecture</h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>Just describe your app idea in plain English. We'll generate a complete markdown blueprint including components, databases, and APIs.</p>
          </div>
          
          <div className="feature-card panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '32px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 255, 204, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Terminal color="#00ffcc" size={24} />
            </div>
            <h3 style={{ margin: 0, color: 'white' }}>Interactive Dashboard</h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>Keep all your architectures in one place. Your history is securely saved and easily accessible whenever you need to reference a past project.</p>
          </div>
          
          <div className="feature-card panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '32px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 255, 204, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Shield color="#00ffcc" size={24} />
            </div>
            <h3 style={{ margin: 0, color: 'white' }}>Scalability Insights</h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>Every blueprint automatically identifies potential bottlenecks and scalability solutions, saving you headaches in the future.</p>
          </div>
        </section>
      </main>
      
      <footer style={{ padding: '40px 20px', textAlign: 'center', borderTop: '1px solid #222', color: 'var(--text-secondary)', marginTop: '40px' }}>
        <p>&copy; {new Date().getFullYear()} DesignPilot AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
