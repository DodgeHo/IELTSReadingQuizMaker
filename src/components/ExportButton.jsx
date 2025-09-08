import React from 'react';
import { exportHtml } from '../utils/exportHtml';

function ExportButton({ title, readingText, questions }) {
  return (
    <button
      onClick={() => exportHtml({ title, readingText, questions })}
      style={{padding:'10px 20px',background:'#10b981',color:'#fff',border:'none',borderRadius:'8px',fontSize:'16px'}}
    >导出HTML</button>
  );
}

export default ExportButton;
