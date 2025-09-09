import React from 'react';
import { exportHtml } from '../utils/exportHtml';

function ExportButton({ title, readingText, questions, groups }) {
  // groups结构合并为扁平题目数组，带分组说明
  // 兼容props传递问题，优先groups，其次questions
  const realGroups = Array.isArray(groups) ? groups : Array.isArray(questions) ? questions : [];
  const handleExport = async () => {
    // 合并所有分组和小题，分组说明作为每组顶部说明，选项结构完整
    const questions = [];
    groups.forEach(group => {
      if(group.instruction) {
        questions.push({
          instruction: group.instruction,
          type: group.type
        });
      }
      group.questions.forEach(q => {
        questions.push({
          ...q,
          type: group.type,
          options: Array.isArray(q.options) ? q.options : []
        });
      });
    });
    const { exportHtml } = await import('../utils/exportHtml');
    exportHtml({ title, readingText, questions });
  };
  return (
    <button
      style={{
        background: '#10b98185',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        boxShadow: '0 4px 16px rgba(0,0,0,.10)',
        cursor: 'pointer',
        padding: '10px 24px'
      }}
      onClick={handleExport}
      onMouseOver={e => e.currentTarget.style.background = '#10b981'}
      onMouseOut={e => e.currentTarget.style.background = '#10b98185'}
    >导出HTML</button>
  );
}

export default ExportButton;
