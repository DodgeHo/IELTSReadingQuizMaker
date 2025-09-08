function renderQuestions(questions) {
  return `<h2>题目</h2><ol>${questions.map(q => {
    let opts = '';
    if(q.type === 'single') {
      opts = '<div>' + q.options.map((opt, idx) => {
        return `<label style='display:block;margin:4px 0'><input type='radio' name='q${q.id}'/> ${opt}${q.answer === idx ? "<span style='color:#3b82f6;margin-left:8px'>(正确答案)</span>" : ''}</label>`;
      }).join('') + '</div>';
    }
    return `<li><div><b>Q${q.id}:</b> ${q.text}</div>${opts}</li>`;
  }).join('')}</ol>`;
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
