import React from 'react';
import { exportHtml } from '../utils/exportHtml';

function ExportButton({ title, readingText, questions }) {
  // groups结构合并为扁平题目数组，带分组说明
  return (
    <button
      onClick={() => {
        // 合并所有分组和小题，分组说明作为每组第一个题目的instruction字段
        const allQuestions = [];
        if(Array.isArray(questions)) {
          // 兼容旧逻辑
          exportHtml({ title, readingText, questions });
        } else if(Array.isArray(groups)) {
          groups.forEach(group => {
            group.questions.forEach((q, idx) => {
              allQuestions.push({
                ...q,
                instruction: idx === 0 ? group.instruction : ''
              });
            });
          });
          exportHtml({ title, readingText, questions: allQuestions });
        }
      }}
      style={{padding:'10px 20px',background:'#10b981',color:'#fff',border:'none',borderRadius:'8px',fontSize:'16px'}}
    >导出HTML</button>
  );
}

export default ExportButton;
