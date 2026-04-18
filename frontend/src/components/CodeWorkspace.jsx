import React, { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Editor from '@monaco-editor/react';
import { 
  FileCode, 
  Terminal, 
  Eye, 
  Folder, 
  File, 
  ChevronRight, 
  ChevronDown,
  X,
  Play,
  Save,
  Settings,
  MoreVertical
} from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const ResizeHandle = ({ direction = 'vertical' }) => (
  <PanelResizeHandle className={`resize-handle-${direction}`}>
    <div className={`handle-line-${direction}`} />
  </PanelResizeHandle>
);

const CodeWorkspace = ({ blueprint, onClose }) => {
  const [files, setFiles] = useState([
    { id: '1', name: 'App.js', language: 'javascript', content: `// System Architecture Implementation
// Based on: ${blueprint.originalPrompt}

console.log("Initializing ${blueprint.originalPrompt}...");

function Main() {
  return (
    <div className="container">
      <h1>Welcome to your new system</h1>
      <p>This is a preview of your architecture implementation.</p>
    </div>
  );
}

export default Main;` },
    { id: '2', name: 'styles.css', language: 'css', content: `body {
  background-color: #0a0a0a;
  color: #fff;
  font-family: sans-serif;
}

.container {
  padding: 2rem;
  text-align: center;
}` },
    { id: '3', name: 'package.json', language: 'json', content: `{
  "name": "project",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0"
  }
}` },
  ]);

  const [activeFileId, setActiveFileId] = useState('1');
  const [terminalOutput, setTerminalOutput] = useState([
    { type: 'info', text: 'System initialized.' },
    { type: 'command', text: 'npm start' },
    { type: 'success', text: 'Server running on port 3000' },
  ]);

  const activeFile = files.find(f => f.id === activeFileId);

  const handleEditorChange = (value) => {
    setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, content: value } : f));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#000',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        color: '#fff'
      }}
    >
      {/* Header */}
      <div style={{ 
        height: '48px', 
        borderBottom: '1px solid #333', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '0 16px',
        background: '#0a0a0a'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ color: 'var(--accent-color)' }}><FileCode size={20} /></div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 'bold' }}>
            {blueprint.originalPrompt.substring(0, 30)}... / <span style={{ color: '#888' }}>Workspace</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Play size={14} /> Run
          </button>
          <button style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Save size={14} /> Save
          </button>
          <div style={{ width: '1px', height: '20px', background: '#333' }} />
          <button 
            onClick={onClose}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: '#888', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <PanelGroup direction="horizontal">
          {/* Sidebar - File Explorer */}
          <Panel defaultSize={15} minSize={10} style={{ borderRight: '1px solid #333', background: '#0a0a0a' }}>
            <div style={{ padding: '12px' }}>
              <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Explorer
                <Settings size={12} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#ccc', marginBottom: '8px' }}>
                <ChevronDown size={14} /> <Folder size={14} style={{ color: '#dcb67a' }} /> SRC
              </div>
              <div style={{ paddingLeft: '16px' }}>
                {files.map(file => (
                  <div 
                    key={file.id}
                    onClick={() => setActiveFileId(file.id)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      padding: '6px 8px', 
                      fontSize: '13px', 
                      color: activeFileId === file.id ? 'var(--accent-color)' : '#888',
                      background: activeFileId === file.id ? 'rgba(0, 255, 204, 0.05)' : 'transparent',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginBottom: '2px'
                    }}
                  >
                    <File size={14} /> {file.name}
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          <ResizeHandle direction="horizontal" />

          {/* Editor and Terminal (Vertical Split) */}
          <Panel defaultSize={50} minSize={20}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={70} minSize={20} style={{ background: '#1e1e1e', display: 'flex', flexDirection: 'column' }}>
                {/* Editor Tabs */}
                <div style={{ height: '36px', background: '#111', borderBottom: '1px solid #333', display: 'flex' }}>
                   {files.map(file => (
                    <div 
                      key={file.id}
                      onClick={() => setActiveFileId(file.id)}
                      style={{ 
                        padding: '0 16px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        fontSize: '12px',
                        borderRight: '1px solid #222',
                        background: activeFileId === file.id ? '#1e1e1e' : 'transparent',
                        color: activeFileId === file.id ? '#fff' : '#666',
                        cursor: 'pointer',
                        borderTop: activeFileId === file.id ? '2px solid var(--accent-color)' : '2px solid transparent'
                      }}
                    >
                      {file.name}
                      <X size={10} style={{ opacity: activeFileId === file.id ? 1 : 0 }} />
                    </div>
                  ))}
                </div>
                {/* Monaco Editor */}
                <div style={{ flex: 1 }}>
                  <Editor
                    height="100%"
                    theme="vs-dark"
                    language={activeFile?.language || 'javascript'}
                    value={activeFile?.content || ''}
                    onChange={handleEditorChange}
                    options={{
                      fontSize: 14,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      padding: { top: 16 }
                    }}
                  />
                </div>
              </Panel>

              <ResizeHandle direction="vertical" />

              <Panel defaultSize={30} minSize={10} style={{ background: '#0a0a0a', borderTop: '1px solid #333' }}>
                <div style={{ padding: '8px 16px', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#888' }}>
                  <Terminal size={12} /> TERMINAL
                </div>
                <div style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                  {terminalOutput.map((line, i) => (
                    <div key={i} style={{ marginBottom: '4px', display: 'flex', gap: '8px' }}>
                      <span style={{ color: '#555' }}>[SYS]</span>
                      <span style={{ 
                        color: line.type === 'command' ? 'var(--accent-color)' : 
                               line.type === 'success' ? '#4ade80' : '#888' 
                      }}>
                        {line.type === 'command' ? '> ' : ''}{line.text}
                      </span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ color: 'var(--accent-color)' }}>$</span>
                    <input 
                      type="text" 
                      style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        outline: 'none', 
                        color: '#fff', 
                        padding: 0, 
                        flex: 1,
                        fontSize: '12px'
                      }}
                      placeholder="..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setTerminalOutput([...terminalOutput, { type: 'command', text: e.target.value }]);
                          e.target.value = '';
                        }
                      }}
                    />
                  </div>
                </div>
              </Panel>
            </PanelGroup>
          </Panel>

          <ResizeHandle direction="horizontal" />

          {/* Preview */}
          <Panel defaultSize={35} minSize={10} style={{ background: '#fff', borderLeft: '1px solid #333', position: 'relative' }}>
             <div style={{ 
               position: 'absolute', 
               top: 0, 
               left: 0, 
               right: 0, 
               height: '36px', 
               background: '#f0f0f0', 
               borderBottom: '1px solid #ccc', 
               display: 'flex', 
               alignItems: 'center', 
               padding: '0 12px',
               zIndex: 10
             }}>
               <div style={{ display: 'flex', gap: '6px' }}>
                 <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }} />
                 <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
                 <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }} />
               </div>
               <div style={{ 
                 flex: 1, 
                 background: '#fff', 
                 margin: '0 12px', 
                 borderRadius: '4px', 
                 fontSize: '11px', 
                 padding: '2px 8px',
                 color: '#666',
                 border: '1px solid #ddd',
                 display: 'flex',
                 alignItems: 'center',
                 gap: '4px'
               }}>
                 <Eye size={10} /> http://localhost:3000
               </div>
             </div>
             <div style={{ padding: '48px 24px', color: '#000', height: '100%', overflowY: 'auto' }}>
               <style dangerouslySetInnerHTML={{ __html: files.find(f => f.name === 'styles.css')?.content || '' }} />
               <div dangerouslySetInnerHTML={{ __html: `
                 <div class="container">
                   <h1>System Preview</h1>
                   <p>This is a live preview of your generated frontend architecture.</p>
                   <div style="margin-top: 40px; padding: 20px; border: 1px dashed #ccc; border-radius: 8px;">
                     <h4 style="margin-top: 0">Generated Components</h4>
                     <ul style="font-size: 14px; color: #666">
                       <li>Navbar.jsx</li>
                       <li>Dashboard.jsx</li>
                       <li>AuthWrapper.js</li>
                     </ul>
                   </div>
                 </div>
               ` }} />
             </div>
          </Panel>
        </PanelGroup>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .resize-handle-horizontal {
          width: 4px;
          background: #222;
          cursor: col-resize;
          transition: background 0.2s;
          display: flex;
          justify-content: center;
        }
        .resize-handle-horizontal:hover {
          background: var(--accent-color);
        }
        .handle-line-horizontal {
          width: 1px;
          height: 30px;
          background: #444;
          align-self: center;
        }

        .resize-handle-vertical {
          height: 4px;
          background: #222;
          cursor: row-resize;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .resize-handle-vertical:hover {
          background: var(--accent-color);
        }
        .handle-line-vertical {
          height: 1px;
          width: 30px;
          background: #444;
        }
      ` }} />
    </motion.div>
  );
};

export default CodeWorkspace;
