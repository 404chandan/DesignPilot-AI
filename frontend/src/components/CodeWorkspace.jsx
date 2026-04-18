import React, { useState, useContext } from 'react';
import { Panel, Group, Separator } from 'react-resizable-panels';
import Editor from '@monaco-editor/react';
import { 
  FileCode, 
  Terminal, 
  Eye, 
  Folder, 
  File, 
  ChevronDown,
  X,
  Play,
  Save,
  Settings,
  Download,
  Sparkles,
  Loader,
  FilePlus,
  FileDown
} from 'lucide-react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const ResizeHandle = ({ orientation = 'vertical' }) => (
  <Separator className={`resize-handle-${orientation}`}>
    <div className={`handle-line-${orientation}`} />
  </Separator>
);

const DEFAULT_FILES = (prompt) => [
  { id: '1', name: 'App.js', path: 'src/App.js', language: 'javascript', content: `// System Architecture Implementation\n// Based on: ${prompt}\n\nfunction Main() {\n  return (\n    <div className="container">\n      <h1>Welcome to your new system</h1>\n      <p>Click "Generate Code" to create your project files.</p>\n    </div>\n  );\n}\n\nexport default Main;` },
  { id: '2', name: 'styles.css', path: 'src/styles.css', language: 'css', content: `body {\n  background-color: #0a0a0a;\n  color: #fff;\n  font-family: sans-serif;\n}\n\n.container {\n  padding: 2rem;\n  text-align: center;\n}` },
  { id: '3', name: 'package.json', path: 'package.json', language: 'json', content: `{\n  "name": "project",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.2.0"\n  }\n}` },
];

const CodeWorkspace = ({ blueprint, onClose, onUpdateBlueprint }) => {
  const { user } = useContext(AuthContext);

  // Load saved workspace files, or fall back to defaults
  const initialFiles = (blueprint.workspaceFiles && blueprint.workspaceFiles.length > 0)
    ? blueprint.workspaceFiles.map((f, i) => ({ ...f, id: f.id || String(i + 1) }))
    : DEFAULT_FILES(blueprint.originalPrompt);

  const [files, setFiles] = useState(initialFiles);
  const [activeFileId, setActiveFileId] = useState(files[0]?.id || '1');
  const [terminalOutput, setTerminalOutput] = useState([
    { type: 'info', text: 'Workspace initialized.' },
    { type: 'success', text: 'Ready.' },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const activeFile = files.find(f => f.id === activeFileId);

  const handleEditorChange = (value) => {
    setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, content: value } : f));
  };

  // ── Feature 1: AI Code Generation ──
  const handleGenerateCode = async () => {
    setIsGenerating(true);
    setStatusMessage('');
    setTerminalOutput(prev => [...prev, { type: 'command', text: '> Generating code with AI...' }]);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/blueprints/${blueprint._id}/generate-code`,
        {},
        config
      );
      const newFiles = data.files.map((f, i) => ({ ...f, id: String(i + 1) }));
      setFiles(newFiles);
      setActiveFileId(newFiles[0]?.id || '1');
      setTerminalOutput(prev => [...prev, { type: 'success', text: `Generated ${newFiles.length} files successfully.` }]);
      setStatusMessage('Code generated!');
      if (onUpdateBlueprint) {
        onUpdateBlueprint({ ...blueprint, workspaceFiles: newFiles });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to generate code.';
      setTerminalOutput(prev => [...prev, { type: 'error', text: `[ERROR] ${msg}` }]);
      setStatusMessage(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  // ── Feature 2: Save Workspace ──
  const handleSaveWorkspace = async () => {
    setIsSaving(true);
    setStatusMessage('');
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const payload = files.map(({ name, path, language, content }) => ({ name, path, language, content }));
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/blueprints/${blueprint._id}/workspace`,
        { files: payload },
        config
      );
      setTerminalOutput(prev => [...prev, { type: 'success', text: 'Workspace saved to cloud.' }]);
      setStatusMessage('Saved!');
      if (onUpdateBlueprint) {
        onUpdateBlueprint({ ...blueprint, workspaceFiles: payload });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save workspace.';
      setTerminalOutput(prev => [...prev, { type: 'error', text: `[ERROR] ${msg}` }]);
      setStatusMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  // ── Feature 3: Export to ZIP ──
  const handleExportZip = async () => {
    const zip = new JSZip();
    files.forEach(f => {
      zip.file(f.path || f.name, f.content || '');
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    const projectName = blueprint.originalPrompt.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_');
    saveAs(blob, `${projectName}_project.zip`);
    setTerminalOutput(prev => [...prev, { type: 'success', text: 'Project exported as ZIP.' }]);
  };

  // ── Feature 4: Export Architecture as Markdown ──
  const handleExportMarkdown = () => {
    const content = `# Architecture: ${blueprint.originalPrompt}\n\n${blueprint.generatedArchitecture}`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const projectName = blueprint.originalPrompt.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_');
    saveAs(blob, `${projectName}_architecture.md`);
    setTerminalOutput(prev => [...prev, { type: 'success', text: 'Architecture exported as Markdown.' }]);
  };

  // ── Add New File ──
  const handleAddFile = () => {
    const fileName = prompt('Enter file name (e.g. utils.js):');
    if (!fileName) return;
    const ext = fileName.split('.').pop().toLowerCase();
    const langMap = { js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript', css: 'css', html: 'html', json: 'json', py: 'python', md: 'markdown' };
    const newFile = {
      id: String(Date.now()),
      name: fileName,
      path: `src/${fileName}`,
      language: langMap[ext] || 'plaintext',
      content: `// ${fileName}\n`
    };
    setFiles(prev => [...prev, newFile]);
    setActiveFileId(newFile.id);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: '#000',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        color: '#fff'
      }}
    >
      {/* ═══ HEADER ═══ */}
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
            {blueprint.originalPrompt.substring(0, 30)}... / <span style={{ color: '#888' }}>Workspace / {activeFile?.path || activeFile?.name}</span>
          </span>
          {statusMessage && (
            <span style={{ fontSize: '12px', color: '#4ade80', marginLeft: '12px' }}>{statusMessage}</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Generate Code Button */}
          <button 
            onClick={handleGenerateCode} 
            disabled={isGenerating}
            style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(168, 85, 247, 0.15)', borderColor: '#a855f7', color: '#a855f7' }}
          >
            {isGenerating ? <Loader size={14} className="spin-animation" /> : <Sparkles size={14} />}
            {isGenerating ? 'Generating...' : 'AI Generate'}
          </button>
          {/* Save Button */}
          <button 
            onClick={handleSaveWorkspace} 
            disabled={isSaving}
            style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {isSaving ? <Loader size={14} className="spin-animation" /> : <Save size={14} />} 
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          {/* Export ZIP */}
          <button 
            onClick={handleExportZip}
            style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} /> ZIP
          </button>
          {/* Export Markdown */}
          <button 
            onClick={handleExportMarkdown}
            style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FileDown size={14} /> .md
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

      {/* ═══ MAIN CONTENT ═══ */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Group orientation="horizontal">
          {/* ── File Explorer ── */}
          <Panel defaultSize={15} minSize={10} style={{ borderRight: '1px solid #333', background: '#0a0a0a' }}>
            <div style={{ padding: '12px' }}>
              <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Explorer
                <div style={{ display: 'flex', gap: '8px' }}>
                  <FilePlus size={12} style={{ cursor: 'pointer', color: '#888' }} onClick={handleAddFile} title="New File" />
                  <Settings size={12} />
                </div>
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
                    <File size={14} /> {file.path || file.name}
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          <ResizeHandle orientation="horizontal" />

          {/* ── Editor + Terminal ── */}
          <Panel defaultSize={50} minSize={20}>
            <Group orientation="vertical">
              <Panel defaultSize={70} minSize={20} style={{ background: '#1e1e1e', display: 'flex', flexDirection: 'column' }}>
                {/* Editor Tabs */}
                <div style={{ height: '36px', background: '#111', borderBottom: '1px solid #333', display: 'flex', overflowX: 'auto' }}>
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
                        borderTop: activeFileId === file.id ? '2px solid var(--accent-color)' : '2px solid transparent',
                        whiteSpace: 'nowrap',
                        flexShrink: 0
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
                    path={activeFile?.path || activeFile?.name}
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

              <ResizeHandle orientation="vertical" />

              {/* Terminal */}
              <Panel defaultSize={30} minSize={10} style={{ background: '#0a0a0a', borderTop: '1px solid #333' }}>
                <div style={{ padding: '8px 16px', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#888' }}>
                  <Terminal size={12} /> TERMINAL
                </div>
                <div style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '12px', overflowY: 'auto', maxHeight: 'calc(100% - 36px)' }}>
                  {terminalOutput.map((line, i) => (
                    <div key={i} style={{ marginBottom: '4px', display: 'flex', gap: '8px' }}>
                      <span style={{ color: '#555' }}>[SYS]</span>
                      <span style={{ 
                        color: line.type === 'command' ? 'var(--accent-color)' : 
                               line.type === 'success' ? '#4ade80' : 
                               line.type === 'error' ? '#f87171' : '#888' 
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
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          setTerminalOutput(prev => [...prev, { type: 'command', text: e.target.value }]);
                          e.target.value = '';
                        }
                      }}
                    />
                  </div>
                </div>
              </Panel>
            </Group>
          </Panel>

          <ResizeHandle orientation="horizontal" />

          {/* ── Preview ── */}
          <Panel defaultSize={35} minSize={10} style={{ background: '#fff', borderLeft: '1px solid #333', position: 'relative' }}>
             <div style={{ 
               position: 'absolute', 
               top: 0, left: 0, right: 0, 
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
             <div style={{ paddingTop: '48px', color: '#000', height: '100%', overflowY: 'auto' }}>
               <style dangerouslySetInnerHTML={{ __html: files.find(f => f.name.endsWith('.css'))?.content || '' }} />
               <div style={{ padding: '24px' }}>
                 <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                   <h2 style={{ margin: '0 0 12px 0', color: '#111' }}>Live Preview</h2>
                   <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>Preview updates as you edit your code.</p>
                   
                   {/* Show generated component list */}
                   <div style={{ 
                     margin: '0 auto', maxWidth: '400px', textAlign: 'left',
                     border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px',
                     background: '#fafafa'
                   }}>
                     <h4 style={{ margin: '0 0 12px 0', color: '#333', fontSize: '14px' }}>📁 Project Files ({files.length})</h4>
                     {files.map(f => (
                       <div key={f.id} style={{ 
                         display: 'flex', alignItems: 'center', gap: '8px',
                         padding: '6px 0', borderBottom: '1px solid #f0f0f0',
                         fontSize: '13px', color: '#444'
                       }}>
                         <span style={{ color: '#a855f7' }}>📄</span> {f.path || f.name}
                         <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#999' }}>{f.language}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
             </div>
          </Panel>
        </Group>
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
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin-animation { animation: spin 1s linear infinite; }
      ` }} />
    </motion.div>
  );
};

export default CodeWorkspace;
