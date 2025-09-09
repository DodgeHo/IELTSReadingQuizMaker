function renderQuestions(questions) {
  // 分组拆分，按instruction分组
  let html = '';
  let groupQuestions = [];
  let groupCount = 0;
  let pendingInstruction = '';
  let globalIndex = 1;
  questions.forEach((q, idx) => {
    if(q.instruction && q.instruction.trim()) {
      // 输出上一组（把分组说明和题目一起包裹）
      if(groupQuestions.length || pendingInstruction) {
        html += `<div style='border:1px solid #e5e7eb;border-radius:8px;padding:12px;margin-bottom:18px;background:#f9fafb'>`;
        if(pendingInstruction) {
          html += `<div style='color:#64748b;font-size:16px;font-weight:bold;margin-bottom:10px'>${pendingInstruction}</div>`;
        }
        html += `<ol start='${globalIndex}'>${groupQuestions.join('')}</ol>`;
        html += `</div>`;
        globalIndex += groupQuestions.length;
        groupQuestions = [];
        pendingInstruction = '';
      }
      pendingInstruction = q.instruction;
      groupCount++;
      return; // 跳过分组说明，不渲染为题目
    }
    // 跳过无题干的题目
    if(!q.text || !q.text.trim()) return;
    let opts = '';
    if (Array.isArray(q.options)) {
      const name = `group${groupCount}_q${q.id}`;
      if (q.type === 'single') {
        // 单选题显示A/B/C/D
        opts = `<ul style='list-style:none;padding-left:0;margin:8px 0 0 0;'>` + q.options.map((opt, oi) => {
          const letter = String.fromCharCode(65+oi);
          const isCorrect = q.answer === oi ? " data-answer='true'" : '';
          return `<li style='margin-bottom:6px'><label style='display:flex;align-items:center;font-size:15px;'><input type='radio' name='${name}' value='${letter}' style='margin-right:8px'${isCorrect}/> <span style='font-weight:bold;margin-right:8px'>${letter}.</span> <span>${opt}</span></label></li>`;
        }).join('') + '</ul>';
      } else {
        // 其他题型不显示选项号
        opts = `<ul style='list-style:none;padding-left:0;margin:8px 0 0 0;'>` + q.options.map((opt, oi) => {
          const isCorrect = q.answer === oi ? " data-answer='true'" : '';
          return `<li style='margin-bottom:6px'><label style='display:flex;align-items:center;font-size:15px;'><input type='radio' name='${name}' value='${opt}' style='margin-right:8px'${isCorrect}/> <span>${opt}</span></label></li>`;
        }).join('') + '</ul>';
      }
    }
    groupQuestions.push(`<li style='margin-bottom:18px'><div style='font-size:16px;margin-bottom:6px'>${q.text}</div>${opts}</li>`);
  });
  if(groupQuestions.length || pendingInstruction) {
    html += `<div style='border:1px solid #e5e7eb;border-radius:8px;padding:12px;margin-bottom:18px;background:#f9fafb'>`;
    if(pendingInstruction) {
      html += `<div style='color:#64748b;font-size:16px;font-weight:bold;margin-bottom:10px'>${pendingInstruction}</div>`;
    }
    html += `<ol start='${globalIndex}'>${groupQuestions.join('')}</ol>`;
    html += `</div>`;
    globalIndex += groupQuestions.length;
  }
  return html;
}

export async function exportHtml({ title, readingText, questions }) {
  const leftContent = `<h2>${title || '阅读材料'}</h2><div>${readingText}</div>`;
  let rightContent = '<h4>Questions</h4>';
  rightContent += renderQuestions(questions);

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
