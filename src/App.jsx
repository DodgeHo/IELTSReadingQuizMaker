import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { exportHtml } from './utils/exportHtml';
import './style.css';

function App() {
  const [title, setTitle] = useState('');
  const [readingText, setReadingText] = useState('');
  const [questions, setQuestions] = useState([
    { id: 1, type: 'single', text: 'Soccer is played in the street and in youth teams. Which is more organized?', options: ['Street', 'Youth team'], answer: 1 }
  ]);
  const [newQText, setNewQText] = useState('');
  const [newQOptions, setNewQOptions] = useState('');
  const [newQAnswer, setNewQAnswer] = useState('0');

  return (
    <>
      <div className="shell">
        <section className="pane" id="left">
          <div style={{marginBottom:'10px'}}>
            <label style={{fontWeight:'bold',fontSize:'16px'}}>试卷标题：</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="请输入试卷标题..."
              style={{width:'70%',fontSize:'16px',marginLeft:'10px',padding:'6px'}}
            />
          </div>
          <ReactQuill
            theme="snow"
            value={readingText}
            onChange={setReadingText}
            style={{ height: '70vh', marginBottom: '12px', background: '#fff' }}
            placeholder="请输入阅读材料，可使用格式化工具栏..."
          />
        </section>
        <div id="divider" title="Drag to resize"></div>
        <section className="pane" id="right">
          <h2>题目编辑区</h2>
          <ol>
            {questions.map(q => (
              <li key={q.id} style={{marginBottom: '18px'}}>
                <div><b>Q{q.id}:</b> {q.text}</div>
                {q.type === 'single' && (
                  <div>
                    {q.options.map((opt, idx) => (
                      <label key={idx} style={{display:'block',margin:'4px 0'}}>
                        <input type="radio" name={`q${q.id}`} disabled /> {opt}
                        {q.answer === idx ? <span style={{color:'#3b82f6',marginLeft:8}}>(正确答案)</span> : null}
                      </label>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ol>
          <hr />
          <h3>添加单选题</h3>
          <input
            type="text"
            placeholder="题干内容"
            value={newQText}
            onChange={e => setNewQText(e.target.value)}
            style={{width:'100%',marginBottom:'8px',fontSize:'15px'}}
          />
          <input
            type="text"
            placeholder="选项（用英文逗号分隔）"
            value={newQOptions}
            onChange={e => setNewQOptions(e.target.value)}
            style={{width:'100%',marginBottom:'8px',fontSize:'15px'}}
          />
          <input
            type="number"
            min="0"
            max={newQOptions.split(',').length-1}
            placeholder="正确答案序号（从0开始）"
            value={newQAnswer}
            onChange={e => setNewQAnswer(e.target.value)}
            style={{width:'100px',marginRight:'8px'}}
          />
          <button
            onClick={() => {
              if(!newQText.trim() || !newQOptions.trim()) return;
              setQuestions([...questions, {
                id: questions.length+1,
                type: 'single',
                text: newQText,
                options: newQOptions.split(',').map(s=>s.trim()),
                answer: Number(newQAnswer)
              }]);
              setNewQText(''); setNewQOptions(''); setNewQAnswer('0');
            }}
            style={{padding:'8px 16px',background:'#3b82f6',color:'#fff',border:'none',borderRadius:'8px',marginBottom:'12px'}}
          >添加题目</button>
          <hr />
          <button
            onClick={() => exportHtml({ title, readingText, questions })}
            style={{padding:'10px 20px',background:'#10b981',color:'#fff',border:'none',borderRadius:'8px',fontSize:'16px'}}
          >导出HTML</button>
        </section>
      </div>
    </>
  );
}

export default App;
