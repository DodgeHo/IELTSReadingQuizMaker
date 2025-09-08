import React from 'react';
import { exportHtml } from '../utils/exportHtml';

function ExportButton({ title, readingText, questions, groups }) {
  // groups结构合并为扁平题目数组，带分组说明
  // 兼容props传递问题，优先groups，其次questions
  const realGroups = Array.isArray(groups) ? groups : Array.isArray(questions) ? questions : [];
  const handleExport = () => {
    const allQuestions = [];
    realGroups.forEach(group => {
      if(group.questions && Array.isArray(group.questions)) {
        group.questions.forEach((q, idx) => {
          allQuestions.push({
            ...q,
            instruction: idx === 0 ? group.instruction : ''
          });
        });
      }
    });
    exportHtml({ title, readingText, questions: allQuestions });
  };
return (
    <div style={{position:'fixed',left:'50%',top:'98%',transform:'translate(-50%,-98%)',zIndex:1000}}>
        <button
            onClick={handleExport}
            style={{
                padding: '18px 30px',
                background: '#10b98185',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                boxShadow: '0 4px 16px rgba(0,0,0,.10)',
                cursor: 'pointer'
            }}
            onMouseOver={e => e.currentTarget.style.background = '#10b981'}
            onMouseOut={e => e.currentTarget.style.background = '#10b98185'}
        >导出HTML</button>
    </div>
);
}

export default ExportButton;
