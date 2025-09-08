import fs from 'fs';
import path from 'path';

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
const highlightScript = `
<style>
.hl { background:#fff3a3; box-shadow: inset 0 -2px 0 rgba(0,0,0,.05); cursor: pointer; }
.hl:hover { filter: brightness(0.98); }
#selbar { position: absolute; display:none; z-index: 2000; background:#111; color:#fff; border-radius: 8px; padding: 6px; box-shadow: 0 6px 20px rgba(0,0,0,.12); font-size: 13px; gap:6px; align-items: center; }
#selbar button { background: transparent; color:#fff; border: 1px solid rgba(255,255,255,.25); padding: 4px 8px; border-radius: 6px; cursor:pointer; }
#selbar button:hover { border-color:#fff; }
#notes { position: fixed; right: 12px; bottom: 12px; width: 320px; height: 42vh; background:#fff; border:1px solid #e5e7eb; border-radius: 12px; display:none; flex-direction: column; z-index:1500; box-shadow: 0 6px 20px rgba(0,0,0,.12); }
#notes header { display:flex; align-items:center; justify-content: space-between; padding:8px 10px; border-bottom:1px solid #e5e7eb; }
#notes textarea { flex:1; border:0; padding:10px; resize:none; font-size:14px; line-height:1.5; }
#toast { position: fixed; left:50%; transform: translateX(-50%); bottom: 24px; background:#111; color:#fff; padding:8px 12px; border-radius: 8px; display:none; z-index:2500; }
</style>
<script>
// 高亮/批注工具栏
var selbar = document.createElement('div');
selbar.id = 'selbar';
selbar.innerHTML = `
  <button id='btnHL'>高亮</button>
  <button id='btnUH'>取消高亮</button>
  <button id='btnNote'>批注</button>
`;
document.body.appendChild(selbar);
var lastRange = null;
function getSelectionRect() {
  var sel = window.getSelection();
  if (!sel.rangeCount) return null;
  var range = sel.getRangeAt(0);
  var rect = range.getBoundingClientRect();
  return rect;
}
function updateSelbar() {
  var sel = window.getSelection();
  if (!sel.isCollapsed && sel.toString().length > 0) {
    var rect = getSelectionRect();
    if (rect) {
      selbar.style.display = 'flex';
      selbar.style.left = rect.left + window.scrollX + 'px';
      selbar.style.top = (rect.bottom + window.scrollY + 5) + 'px';
      lastRange = sel.getRangeAt(0).cloneRange();
    }
  } else {
    selbar.style.display = 'none';
  }
}
document.getElementById('left').addEventListener('mouseup', updateSelbar);
document.getElementById('left').addEventListener('keyup', updateSelbar);
selbar.addEventListener('mousedown', function(e){ e.preventDefault(); });
function doHighlight() {
  if (lastRange) {
    var span = document.createElement('span');
    span.className = 'hl';
    lastRange.surroundContents(span);
    window.getSelection().removeAllRanges();
    selbar.style.display = 'none';
  }
}
function removeHighlight() {
  if (lastRange) {
    var sel = window.getSelection();
    var range = lastRange;
    var container = range.commonAncestorContainer;
    var parent = container.nodeType === 3 ? container.parentNode : container;
    if (parent.classList && parent.classList.contains('hl')) {
      var text = parent.textContent;
      var newNode = document.createTextNode(text);
      parent.parentNode.replaceChild(newNode, parent);
      selbar.style.display = 'none';
      sel.removeAllRanges();
    }
  }
}
document.getElementById('btnHL').onclick = doHighlight;
document.getElementById('btnUH').onclick = removeHighlight;
// 批注功能
var notes = document.createElement('div');
notes.id = 'notes';
notes.innerHTML = `<header><span>批注</span><button id='btnClose'>关闭</button></header><textarea id='noteArea' placeholder='请输入批注内容...'></textarea>`;
document.body.appendChild(notes);
document.getElementById('btnNote').onclick = function() {
  notes.style.display = 'flex';
  selbar.style.display = 'none';
};
document.getElementById('btnClose').onclick = function() {
  notes.style.display = 'none';
};
</script>
`;

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

function fillTemplate(template, vars) {
  return template.replace(/\\$\\{(\\w+)\\}/g, (_, key) => vars[key] || '');
}

export async function exportHtml({ title, readingText, questions }) {
  const leftContent = `<h2>${title || '阅读材料'}</h2><div>${readingText}</div>`;
  const rightContent = renderQuestions(questions);
  // 读取模板文件
  const templatePath = path.join(__dirname, 'template.html');
  const template = fs.readFileSync(templatePath, 'utf-8');
  const html = fillTemplate(template, {
    title: title || 'IELTS Reading Export',
    leftContent,
    rightContent,
    styleBlock: style,
    scriptBlock: highlightScript
  });

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
