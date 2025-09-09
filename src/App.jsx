import React, { useState } from 'react';
import Toast from './components/Toast';
import EditorPanel from './components/EditorPanel';
import QuestionPanel from './components/QuestionPanel';
import ExportButton from './components/ExportButton';
import './style.css';

function App() {
  const [title, setTitle] = useState('');
  const [readingText, setReadingText] = useState('');
  // 顶层题目分组状态
  const [groups, setGroups] = useState([]);

  // Toast提示
  const [toast, setToast] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const showToast = msg => {
    setToast(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };
  // 挂载到window，供全局调用
  React.useEffect(() => {
    window.showToast = showToast;
    return () => {
      window.showToast = undefined;
    };
  }, []);
  const handleSaveProject = () => {
    const data = JSON.stringify({ title, readingText, groups }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (title ? title.replace(/[^a-zA-Z0-9_]/g,'_') : 'IELTS_Project') + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 载入工程
  const handleLoadProject = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const obj = JSON.parse(evt.target.result);
        setTitle(obj.title || '');
        setReadingText(obj.readingText || '');
        setGroups(obj.groups || []);
        showToast('载入成功！');
      } catch {
        showToast('载入失败，文件格式错误！');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="shell">
      <EditorPanel
        title={title}
        setTitle={setTitle}
        readingText={readingText}
        setReadingText={setReadingText}
      />
      <div id="divider" title="Drag to resize"></div>
      <QuestionPanel
        groups={groups}
        setGroups={setGroups}
        showToast={showToast}
      />
      <div style={{position:'fixed',right:32,bottom:32,zIndex:1000,display:'flex',flexDirection:'column',gap:'12px'}}>
        <ExportButton title={title} readingText={readingText} groups={groups} />
        <button
          style={{background:'#f59e42',color:'#fff',border:'none',borderRadius:'12px',fontSize:'15px',padding:'8px 20px',marginTop:'8px',boxShadow:'0 2px 8px rgba(0,0,0,.08)',cursor:'pointer'}}
          onClick={handleSaveProject}
        >保存工程</button>
        <label style={{background:'#3b82f6',color:'#fff',borderRadius:'12px',fontSize:'15px',padding:'8px 20px',marginTop:'8px',boxShadow:'0 2px 8px rgba(0,0,0,.08)',cursor:'pointer',textAlign:'center'}}>
          载入工程
          <input type="file" accept=".json" style={{display:'none'}} onChange={handleLoadProject}/>
        </label>
      </div>
  {/* Toast提示 */}
  <Toast message={toast} visible={toastVisible} />
    </div>
  );
}

export default App;
