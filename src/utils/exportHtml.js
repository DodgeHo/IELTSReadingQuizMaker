function renderQuestions(questions) {
  // 分组拆分，按instruction分组
  let html = '<h2>题目</h2>';
  let currentInstruction = null;
  let groupQuestions = [];
  questions.forEach((q, idx) => {
    if(q.instruction && q.instruction.trim()) {
      // 输出上一组
      if(groupQuestions.length) {
        html += `<ol>${groupQuestions.join('')}</ol>`;
        groupQuestions = [];
      }
      html += `<div style='color:#64748b;font-size:16px;font-weight:bold;margin:18px 0 10px 0'>${q.instruction}</div>`;
      currentInstruction = q.instruction;
    }
    let opts = '';
    if(q.type === 'single' && Array.isArray(q.options)) {
      opts = `<ul style='list-style:none;padding-left:0;margin:8px 0 0 0;'>` + q.options.map((opt, oi) => {
        const letter = String.fromCharCode(65+oi);
        return `<li style='margin-bottom:6px'><label style='display:flex;align-items:center;font-size:15px;'><span style='font-weight:bold;margin-right:8px'>${letter}.</span> <span>${opt}</span>${q.answer === oi ? "<span style='color:#3b82f6;margin-left:8px'>(正确答案)</span>" : ''}</label></li>`;
      }).join('') + '</ul>';
    }
    groupQuestions.push(`<li style='margin-bottom:18px'><div style='font-size:16px;margin-bottom:6px'>${q.text}</div>${opts}</li>`);
  });
  if(groupQuestions.length) {
    html += `<ol>${groupQuestions.join('')}</ol>`;
  }
  return html;
}

export async function exportHtml({ title, readingText, questions }) {
  const leftContent = `<h2>${title || '阅读材料'}</h2><div>${readingText}</div>`;
  const rightContent = renderQuestions(questions);

  let ipcRenderer;
  try {
    ipcRenderer = window.require ? window.require('electron').ipcRenderer : null;
  } catch(e) {
    ipcRenderer = null;
  }
  let fileName;
  if (title && title.trim()) {
    fileName = title.trim();
  } else {
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    const dateStr = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    fileName = `IELTS_Reading_Export_${dateStr}`;
  }
  if (!fileName.toLowerCase().endsWith('.html')) fileName += '.html';
  if (ipcRenderer) {
    const result = await ipcRenderer.invoke('save-html', {
      title,
      leftContent,
      rightContent,
      defaultFileName: fileName,
    });
    if (result.success) {
      alert('导出成功！文件已保存到：' + result.filePath);
    } else {
      let msg = '导出已取消。';
      if (result.error) msg += '\n原因：' + result.error;
      alert(msg);
    }
  } else {
    alert('当前环境不支持本地保存（请在Electron应用中使用）。');
  }
}
