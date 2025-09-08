// 导出 HTML 工具函数
const style = `
  :root { --line:#e5e7eb; --bg:#f6f7fb; --panel:#fff; --accent:#3b82f6; --muted:#6b7280; --shadow:0 6px 20px rgba(0,0,0,.12); }
  * { box-sizing: border-box; }
  html,body { height:100%; }
  body { margin:0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; background:var(--bg); }
  .shell { display:flex; height:100vh; width:100%; }
  .pane { background:var(--panel); overflow:auto; padding:20px; }
  #left { flex: 0 0 50%; min-width: 280px; }
  #right { flex: 1 1 auto; min-width: 320px; background:#fbfbff; border-left:1px solid var(--line); }
  #divider { flex: 0 0 8px; background: linear-gradient(90deg,#e5e7eb,#d1d5db); cursor: ew-resize; position:relative; z-index: 5; user-select:none; }
  #left p { margin: 0 0 12px; line-height: 1.6; word-break: normal; overflow-wrap: normal; hyphens: none; }
`;

export async function exportHtml({ title, readingText, questions }) {
  const html = `<!DOCTYPE html><html lang='en'><head><meta charset='utf-8'/><title>${title || 'IELTS Reading Export'}</title><meta name='viewport' content='width=device-width, initial-scale=1.0'/><style>${style}</style></head><body><div class='shell'><section class='pane' id='left'><h2>${title || '阅读材料'}</h2><div>${readingText}</div></section><div id='divider'></div><section class='pane' id='right'><h2>题目</h2><ol>${questions.map(q => {
    let opts = '';
    if(q.type === 'single') {
      opts = '<div>' + q.options.map((opt, idx) => {
        return `<label style='display:block;margin:4px 0'><input type='radio' name='q${q.id}'/> ${opt}${q.answer === idx ? "<span style='color:#3b82f6;margin-left:8px'>(正确答案)</span>" : ''}</label>`;
      }).join('') + '</div>';
    }
    return `<li><div><b>Q${q.id}:</b> ${q.text}</div>${opts}</li>`;
  }).join('')}</ol></section></div></body></html>`;

  // Electron环境下通过ipcRenderer保存文件，文件名为文章标题或带时间戳
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
      html,
      defaultFileName: fileName,
    });
    if (result.success) {
      alert('导出成功！文件已保存到：' + result.filePath);
    } else {
      alert('导出已取消。');
    }
  } else {
    alert('当前环境不支持本地保存（请在Electron应用中使用）。');
  }
}
