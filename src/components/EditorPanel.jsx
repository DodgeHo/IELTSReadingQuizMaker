import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function EditorPanel({ title, setTitle, readingText, setReadingText }) {
  return (
    <section className="pane" id="left">
      <div style={{marginBottom:'10px'}}>
        <label style={{fontWeight:'bold',fontSize:'16px'}}>文章标题：</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="请输入文章标题..."
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
  );
}

export default EditorPanel;
