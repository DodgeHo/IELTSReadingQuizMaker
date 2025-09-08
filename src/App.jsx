import React, { useState } from 'react';
import EditorPanel from './components/EditorPanel';
import QuestionPanel from './components/QuestionPanel';
import ExportButton from './components/ExportButton';
import './style.css';

function App() {
  const [title, setTitle] = useState('');
  const [readingText, setReadingText] = useState('');
  // 顶层题目分组状态
  const [groups, setGroups] = useState([]);

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
      />
      <div style={{position:'fixed',right:32,bottom:32,zIndex:1000}}>
        <ExportButton title={title} readingText={readingText} groups={groups} />
      </div>
    </div>
  );
}

export default App;
