import { useNavigate } from 'react-router-dom';
import { Terminal, Cpu, Zap, Code, Shield, Layers, ArrowRight, Layout, Database, Star, Users, Server, Globe, Monitor, Smartphone, Briefcase, Activity, Clock } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

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

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="home-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      {/* Background Effects */}
      <div className="bg-glow-1"></div>
      <div className="bg-glow-2"></div>

      <header style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(10, 10, 10, 0.6)', backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img src="/logo.png" alt="Logo" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
          <h1 className="glow-text" style={{ fontSize: '24px', margin: 0, fontWeight: 700, letterSpacing: '-0.5px' }}>DesignPilot AI</h1>
        </motion.div>
        <motion.nav initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {user ? (
            <button onClick={() => navigate('/dashboard')} className="btn-primary">Dashboard <ArrowRight size={16} /></button>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="btn-ghost">Login</button>
              <button onClick={() => navigate('/register')} className="btn-primary">Get Started</button>
            </>
          )}
        </motion.nav>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 10 }}>

        {/* HERO SECTION */}
        <section className="hero" style={{ padding: '120px 20px', textAlign: 'center', maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center', minHeight: '80vh', justifyContent: 'center' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="badge glass-badge"
          >
            <Zap size={16} className="text-accent" /> Powered by Gemini 2.5 Pro
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontSize: '72px', lineHeight: 1.05, margin: 0, fontWeight: 800, letterSpacing: '-2px' }}
            className="hero-title"
          >
            Architect Your Next <br /> <span className="text-gradient">Big Idea in Seconds.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontSize: '22px', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '800px' }}
          >
            Turn messy brain dumps into structured, scalable system architecture blueprints. Let AI map out your data flow, networking, and bottlenecks before you write a single line of code.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: 'flex', gap: '20px', marginTop: '20px' }}
          >
            <button onClick={handleCTA} className="btn-primary large-btn">
              <Code size={20} /> Start Architecting Now
            </button>
            <a href="#how-it-works" className="btn-outline large-btn" style={{ textDecoration: 'none' }}>
              See How It Works
            </a>
          </motion.div>
        </section>

        {/* TECH STACK MARQUEE SECTION */}
        <section style={{ width: '100%', padding: '40px 0 80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '30px' }}>Powered by industry standard technologies</p>
          <div className="marquee-container">
            <div className="marquee-content">
              <div className="marquee-item"><Database size={20} className="text-accent" /> MongoDB</div>
              <div className="marquee-item"><Server size={20} className="text-accent" /> Express.js</div>
              <div className="marquee-item"><Monitor size={20} className="text-accent" /> React</div>
              <div className="marquee-item"><Globe size={20} className="text-accent" /> Node.js</div>
              <div className="marquee-item"><Zap size={20} className="text-accent" /> Gemini AI</div>
              <div className="marquee-item"><Smartphone size={20} className="text-accent" /> React Native</div>
              <div className="marquee-item"><Briefcase size={20} className="text-accent" /> AWS</div>
              {/* Duplicate for infinite effect */}
              <div className="marquee-item"><Database size={20} className="text-accent" /> MongoDB</div>
              <div className="marquee-item"><Server size={20} className="text-accent" /> Express.js</div>
              <div className="marquee-item"><Monitor size={20} className="text-accent" /> React</div>
              <div className="marquee-item"><Globe size={20} className="text-accent" /> Node.js</div>
              <div className="marquee-item"><Zap size={20} className="text-accent" /> Gemini AI</div>
              <div className="marquee-item"><Smartphone size={20} className="text-accent" /> React Native</div>
              <div className="marquee-item"><Briefcase size={20} className="text-accent" /> AWS</div>
            </div>
          </div>
        </section>

        {/* MOCKUP / VISUAL DEMO SECTION */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          style={{ width: '100%', maxWidth: '1000px', padding: '0 20px 100px', display: 'flex', justifyContent: 'center' }}
        >
          <div className="glass-panel mockup-window" style={{ width: '100%', height: '400px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div className="mockup-header" style={{ height: '40px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="dot" style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }}></div>
              <div className="dot" style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></div>
              <div className="dot" style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }}></div>
              <div style={{ margin: '0 auto', fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>designpilot-workspace.tsx</div>
            </div>
            <div className="mockup-body" style={{ flex: 1, display: 'flex', background: 'rgba(0,0,0,0.5)' }}>
              <div className="mockup-sidebar" style={{ width: '60px', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0', gap: '20px' }}>
                <Layout size={20} color="var(--text-secondary)" />
                <Database size={20} color="var(--text-secondary)" />
                <Terminal size={20} color="var(--text-secondary)" />
              </div>
              <div className="mockup-code" style={{ padding: '24px', fontFamily: 'var(--font-mono)', fontSize: '14px', color: '#a9b7c6', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <motion.div initial={{ width: 0 }} whileInView={{ width: '100%' }} transition={{ duration: 1, delay: 0.5 }} style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  <span style={{ color: '#cc7832' }}>import</span> {'{'} Architecture {'}'} <span style={{ color: '#cc7832' }}>from</span> <span style={{ color: '#6a8759' }}>'@designpilot/core'</span>;
                </motion.div>
                <motion.div initial={{ width: 0 }} whileInView={{ width: '100%' }} transition={{ duration: 1, delay: 1 }} style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  <br />
                  <span style={{ color: '#cc7832' }}>const</span> system = <span style={{ color: '#cc7832' }}>new</span> Architecture();
                </motion.div>
                <motion.div initial={{ width: 0 }} whileInView={{ width: '100%' }} transition={{ duration: 1.5, delay: 1.5 }} style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  <span style={{ color: '#808080' }}>// Generating optimal microservices structure...</span>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5, delay: 2.5 }} style={{ color: 'var(--accent-color)', marginTop: '16px' }}>
                  ✓ System blueprint successfully generated!
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" style={{ width: '100%', maxWidth: '1200px', padding: '100px 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '40px', fontWeight: 700, marginBottom: '16px' }}>From Idea to Reality</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>A seamless workflow designed for visionary architects and developers.</p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}
          >
            <motion.div variants={fadeIn} whileHover={{ scale: 1.02 }} className="step-card glass-panel" style={{ padding: '40px 30px', borderRadius: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div className="step-icon-wrapper" style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>1</span>
              </div>
              <h3 style={{ fontSize: '22px', margin: 0 }}>Brain Dump</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>Describe your app's purpose, features, and target audience in natural language. No technical jargon required.</p>
            </motion.div>

            <motion.div variants={fadeIn} whileHover={{ scale: 1.02 }} className="step-card glass-panel" style={{ padding: '40px 30px', borderRadius: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div className="step-icon-wrapper" style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0, 255, 204, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(0, 255, 204, 0.2)' }}>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent-color)' }}>2</span>
              </div>
              <h3 style={{ fontSize: '22px', margin: 0 }}>AI Architecture</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>Gemini 2.5 Pro analyzes your idea and generates a comprehensive, scalable system blueprint in seconds.</p>
            </motion.div>

            <motion.div variants={fadeIn} whileHover={{ scale: 1.02 }} className="step-card glass-panel" style={{ padding: '40px 30px', borderRadius: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div className="step-icon-wrapper" style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>3</span>
              </div>
              <h3 style={{ fontSize: '22px', margin: 0 }}>Code Generation</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>Export your blueprint directly to functional React and Node.js code, ready to be deployed or customized.</p>
            </motion.div>
          </motion.div>
        </section>

        {/* STATS SECTION */}
        <section style={{ width: '100%', maxWidth: '1000px', padding: '60px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="stat-card">
              <Activity size={32} color="var(--accent-color)" style={{ marginBottom: '16px' }} />
              <div className="stat-number">10k+</div>
              <div className="stat-label">Blueprints Generated</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="stat-card">
              <Clock size={32} color="var(--accent-color)" style={{ marginBottom: '16px' }} />
              <div className="stat-number">500k</div>
              <div className="stat-label">Hours Saved</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="stat-card">
              <Users size={32} color="var(--accent-color)" style={{ marginBottom: '16px' }} />
              <div className="stat-number">5,000+</div>
              <div className="stat-label">Active Architects</div>
            </motion.div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" style={{ width: '100%', maxWidth: '1200px', padding: '100px 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '40px', fontWeight: 700, marginBottom: '16px' }}>Powerful Features</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>Everything you need to plan, design, and build world-class software.</p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}
          >
            <motion.div variants={fadeIn} whileHover={{ scale: 1.02 }} className="feature-card glass-panel hover-glow" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '40px', borderRadius: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(0, 255, 204, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(0, 255, 204, 0.2)' }}>
                <Cpu color="var(--accent-color)" size={28} />
              </div>
              <h3 style={{ margin: 0, color: 'white', fontSize: '24px' }}>Instant Blueprints</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6, fontSize: '16px' }}>We generate complete markdown blueprints including UI components, database schemas, and API endpoints.</p>
            </motion.div>

            <motion.div variants={fadeIn} whileHover={{ scale: 1.02 }} className="feature-card glass-panel hover-glow" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '40px', borderRadius: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(0, 255, 204, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(0, 255, 204, 0.2)' }}>
                <Layers color="var(--accent-color)" size={28} />
              </div>
              <h3 style={{ margin: 0, color: 'white', fontSize: '24px' }}>Interactive Workspace</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6, fontSize: '16px' }}>A fully-featured IDE experience right in your browser. Edit code, preview architecture, and manage files seamlessly.</p>
            </motion.div>

            <motion.div variants={fadeIn} whileHover={{ scale: 1.02 }} className="feature-card glass-panel hover-glow" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '40px', borderRadius: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(0, 255, 204, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(0, 255, 204, 0.2)' }}>
                <Shield color="var(--accent-color)" size={28} />
              </div>
              <h3 style={{ margin: 0, color: 'white', fontSize: '24px' }}>Scalability Insights</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6, fontSize: '16px' }}>Automatically identify potential bottlenecks and scalability solutions to ensure your architecture is production-ready.</p>
            </motion.div>
          </motion.div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section style={{ width: '100%', maxWidth: '1200px', padding: '100px 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '40px', fontWeight: 700, marginBottom: '16px' }}>Loved by Engineers</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>Don't just take our word for it. See what industry leaders are saying.</p>
          </div>
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}
          >
            <motion.div variants={fadeIn} whileHover={{ y: -10 }} className="testimonial-card glass-panel hover-glow">
              <div style={{ display: 'flex', gap: '4px', color: '#ffbd2e' }}><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
              <p style={{ color: 'var(--text-primary)', fontSize: '16px', lineHeight: 1.6, flex: 1 }}>"DesignPilot completely transformed how we plan our microservices. We went from weeks of whiteboarding to having a deployable blueprint in an afternoon."</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #00ffcc 0%, #00b3ff 100%)' }}></div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Sarah Jenkins</h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Lead Architect @ TechFlow</span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} whileHover={{ y: -10 }} className="testimonial-card glass-panel hover-glow">
              <div style={{ display: 'flex', gap: '4px', color: '#ffbd2e' }}><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
              <p style={{ color: 'var(--text-primary)', fontSize: '16px', lineHeight: 1.6, flex: 1 }}>"The ability to dump a messy product requirement document and get a structured, scalable system architecture out the other end feels like magic."</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #ff5f56 0%, #ffbd2e 100%)' }}></div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>David Chen</h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>CTO @ StartupX</span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} whileHover={{ y: -10 }} className="testimonial-card glass-panel hover-glow">
              <div style={{ display: 'flex', gap: '4px', color: '#ffbd2e' }}><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
              <p style={{ color: 'var(--text-primary)', fontSize: '16px', lineHeight: 1.6, flex: 1 }}>"Not only does it generate the architecture, but it catches potential bottlenecks I hadn't even considered. It's like having a Staff Engineer on demand."</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #b027c9 0%, #00ffcc 100%)' }}></div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Elena Rodriguez</h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Senior Backend Eng</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* CTA SECTION */}
        <section style={{ width: '100%', padding: '100px 20px', display: 'flex', justifyContent: 'center' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-panel"
            style={{ maxWidth: '1000px', width: '100%', padding: '60px', borderRadius: '24px', textAlign: 'center', position: 'relative', overflow: 'hidden', border: '1px solid rgba(0, 255, 204, 0.3)' }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at center, rgba(0, 255, 204, 0.1) 0%, transparent 70%)', zIndex: 0 }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: '48px', fontWeight: 800, marginBottom: '24px', letterSpacing: '-1px' }}>Ready to Build?</h2>
              <p style={{ fontSize: '20px', color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>Join the visionary architects who are already using DesignPilot to accelerate their development workflow.</p>
              <button onClick={handleCTA} className="btn-primary large-btn" style={{ fontSize: '18px', padding: '18px 40px' }}>
                Create Your First Blueprint
              </button>
            </div>
          </motion.div>
        </section>
      </main>

      <footer style={{ padding: '40px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/logo.png" alt="Logo" style={{ width: '24px', height: '24px', opacity: 0.8 }} />
            <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-secondary)' }}>DesignPilot AI</span>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'white'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Privacy Policy</a>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'white'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Terms of Service</a>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'white'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Contact</a>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-secondary)', fontSize: '14px' }}>
          &copy; {new Date().getFullYear()} DesignPilot AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
