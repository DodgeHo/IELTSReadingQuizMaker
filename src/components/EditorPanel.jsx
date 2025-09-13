import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function EditorPanel({ title, setTitle, readingText, setReadingText, footnote, setFootnote }) {
  return (
    <section className="pane" id="left">
      <div style={{marginBottom:'10px'}}>
        <label style={{fontWeight:'bold',fontSize:'16px'}}>文章题号：</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="请输入文章题号(如:READING PASSAGE 1， 或C20T1P1)..."
          style={{width:'70%',fontSize:'16px',marginLeft:'10px',padding:'6px'}}
        />
      </div>
      <ReactQuill
        theme="snow"
        value={readingText}
        onChange={setReadingText}
        style={{ height: '65vh', marginBottom: '12px', background: '#fff' }}
        placeholder="请输入阅读材料，可使用格式化工具栏..."
      />
      <div style={{marginTop:'10px'}}>
        <label style={{fontWeight:'bold',fontSize:'16px',marginBottom:'8px',display:'block'}}>底部批注（可选）：</label>
        <textarea
          value={footnote || ''}
          onChange={e => setFootnote(e.target.value)}
          placeholder="输入词汇注释，例如：*pulp: wood which is crushed until soft enough to form the basis of paper"
          style={{
            width:'100%',
            height:'100px',
            fontSize:'14px',
            padding:'8px',
            border:'1px solid #e5e7eb',
            borderRadius:'6px',
            resize:'vertical',
            fontFamily:'system-ui, sans-serif'
          }}
        />
        <div style={{fontSize:'12px',color:'#6b7280',marginTop:'4px'}}>
          提示：批注会显示在阅读材料底部，可用于解释生词或专业术语
        </div>
      </div>
    </section>
  );
}

export default EditorPanel;
