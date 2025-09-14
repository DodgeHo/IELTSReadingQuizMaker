function renderQuestions(questions) {
  // 分组拆分，按instruction分组
  let html = '';
  let groupQuestions = [];
  let groupBlankContent = []; // 填空题单独处理
  let groupCount = 0;
  let pendingInstruction = '';
  let globalIndex = 1;
  questions.forEach((q, idx) => {
    if(q.instruction && q.instruction.trim()) {
      // 输出上一组（把分组说明和题目一起包裹）
      if(groupQuestions.length || groupBlankContent.length || pendingInstruction) {
        html += `<div style='border:1px solid #e5e7eb;border-radius:8px;padding:12px;margin-bottom:18px;background:#f9fafb'>`;
        if(pendingInstruction) {
          html += `<div style='margin-bottom:15px'>${pendingInstruction}</div>`;
        }
        // 先渲染有序列表的题目
        if(groupQuestions.length) {
          html += `<ol start='${globalIndex}'>${groupQuestions.join('')}</ol>`;
          globalIndex += groupQuestions.length;
        }
        // 再渲染填空题（无序号，但已在处理时计算过题号）
        if(groupBlankContent.length) {
          html += groupBlankContent.join('');
        }
        html += `</div>`;
        groupQuestions = [];
        groupBlankContent = [];
        pendingInstruction = '';
      }
      pendingInstruction = q.instruction;
      groupCount++;
      return; // 跳过分组说明，不渲染为题目
    }
    
    // 填空题特殊处理：使用blankContent整段渲染，每个空都有题号
    if(q.type === 'blank' && q.blankContent) {
      let blankIdx = 0;
      const startQNum = globalIndex; // 记录起始题号
      const html = q.blankContent.replace(/\[\[空(\d+)\]\]/g, (m, n) => {
        let ans = '';
        if(q.blankAnswers && q.blankAnswers[blankIdx]) {
          ans = q.blankAnswers[blankIdx]; // 用分号分隔的多个答案
        }
        const currentQNum = startQNum + blankIdx;
        blankIdx++;
        return `<input type='text' class='blank-input' data-answer='${ans}' data-question-num='${currentQNum}' placeholder='${currentQNum}' style='width:120px;margin:0 4px;border:1px solid #ccc;padding:2px 4px'/>`;
      });
      // 填空题单独处理，但参与题号计算
      groupBlankContent.push(`<div style='margin-bottom:18px;padding:12px;background:#fff;border-radius:6px'><div style='font-size:16px;line-height:1.6'>${html}</div></div>`);
      globalIndex += blankIdx; // 每个空都占一个题号
      return;
    }
    
    // 表格填空题特殊处理：使用tableData渲染表格，每个空都有题号
    if(q.type === 'table' && q.tableData) {
      let blankIdx = 0;
      const startQNum = globalIndex; // 记录起始题号
      
      let tableHtml = '<table>';
      q.tableData.forEach((row, ri) => {
        tableHtml += '<tr>';
        row.forEach((cell, ci) => {
          // 判断是否需要加粗
          const shouldBold = (q.tableBoldFirstRow && ri === 0) || (q.tableBoldFirstCol && ci === 0);
          const tdStyle = shouldBold ? ' style="font-weight:bold;background:#f8fafc;"' : '';
          
          tableHtml += `<td${tdStyle}>`;
          
          if (cell.type === 'text') {
            tableHtml += cell.content || '';
          } else if (cell.type === 'blank') {
            let ans = '';
            if(q.tableAnswers && q.tableAnswers[blankIdx]) {
              ans = q.tableAnswers[blankIdx]; // 用分号分隔的多个答案
            }
            const currentQNum = startQNum + blankIdx;
            tableHtml += `<input type='text' class='blank-input' data-answer='${ans}' data-question-num='${currentQNum}' placeholder='${currentQNum}' style='width:120px;margin:0 4px;border:1px solid #ccc;padding:2px 4px'/>`;
            blankIdx++;
          } else if (cell.type === 'mixed') {
            // 处理混合类型：文字 + [空]
            let content = cell.content || '';
            content = content.replace(/\[空\]/g, () => {
              let ans = '';
              if(q.tableAnswers && q.tableAnswers[blankIdx]) {
                ans = q.tableAnswers[blankIdx];
              }
              const currentQNum = startQNum + blankIdx;
              blankIdx++;
              return `<input type='text' class='blank-input' data-answer='${ans}' data-question-num='${currentQNum}' placeholder='${currentQNum}' style='width:120px;margin:0 4px;border:1px solid #ccc;padding:2px 4px'/>`;
            });
            tableHtml += content;
          } else if (cell.type === 'empty') {
            // 空白单元格
            tableHtml += '';
          }
          
          tableHtml += '</td>';
        });
        tableHtml += '</tr>';
      });
      tableHtml += '</table>';
      
      // 表格填空题单独处理，但参与题号计算
      groupBlankContent.push(`<div style='margin-bottom:18px;padding:12px;background:#fff;border-radius:6px'><div style='font-size:16px;line-height:1.6'>${tableHtml}</div></div>`);
      globalIndex += blankIdx; // 每个空都占一个题号
      return;
    }
    
    // 兼容旧的tableContent格式
    if(q.type === 'table' && q.tableContent) {
      let blankIdx = 0;
      const startQNum = globalIndex; // 记录起始题号
      const html = q.tableContent.replace(/\[\[空(\d+)\]\]/g, (m, n) => {
        let ans = '';
        if(q.tableAnswers && q.tableAnswers[blankIdx]) {
          ans = q.tableAnswers[blankIdx]; // 用分号分隔的多个答案
        }
        const currentQNum = startQNum + blankIdx;
        blankIdx++;
        return `<a id="q${currentQNum}-anchor"></a><input class="blank" maxlength="40" name="q${currentQNum}" placeholder="${currentQNum}"/>`;
      });
      // 表格填空题单独处理，但参与题号计算
      groupBlankContent.push(`<div style='margin-bottom:18px;padding:12px;background:#fff;border-radius:6px'><div style='font-size:16px;line-height:1.6'>${html}</div></div>`);
      globalIndex += blankIdx; // 每个空都占一个题号
      return;
    }
    
    // 匹配题特殊处理：类似填空题，但有选项区
    if(q.type === 'matching' && q.matchingContent && Array.isArray(q.matchingOptions)) {
      let blankIdx = 0;
      const startQNum = globalIndex; // 记录起始题号
      
      // 匹配题容器，包含可重复性数据
      let matchHtml = `<div class="matching-container" data-repeatable="${q.matchingRepeatable || false}">`;
      
      // 选项区
      matchHtml += '<div style="margin-bottom:15px;"><div style="font-weight:bold;margin-bottom:8px;">选项：</div><div class="matching-options" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:15px;">';
      q.matchingOptions.forEach((opt, oi) => {
        // 判断该选项是否已被某个空选中（仅在不可复选时）
        let hideOpt = false;
        if(!q.matchingRepeatable && Array.isArray(q.matchingAnswers)) {
          hideOpt = q.matchingAnswers.some(ans => ans === oi);
        }
        matchHtml += `<div class="matching-option" draggable="true" data-oi="${oi}" style="padding:6px 12px;background:#e0e7ff;border-radius:4px;cursor:grab;font-weight:bold;${hideOpt ? 'display:none;' : ''}">${opt}</div>`;
      });
      matchHtml += '</div></div>';
      
      // 题目区
      matchHtml += '<div><div style="font-weight:bold;margin-bottom:8px;">题目：</div>';
      const html = q.matchingContent.replace(/\[\[空(\d+)\]\]/g, (m, n) => {
        let ans = '';
        if(q.matchingAnswers && q.matchingAnswers[blankIdx] != null) {
          ans = q.matchingAnswers[blankIdx]; // 选项索引
        }
        const currentQNum = startQNum + blankIdx;
        blankIdx++;
        // 始终draggable，内容可拖拽
        return `<span class="matching-drop" draggable="true" data-qi="${blankIdx-1}" data-answer="${ans}" data-question-num="${currentQNum}" style="display:inline-block;min-width:120px;height:32px;background:#E2F2FE;border:1px dashed #0b80f5ff;border-radius:4px;margin:0 4px;text-align:center;line-height:32px;color:#000;font-weight:bold;cursor:pointer;vertical-align:middle;">[${currentQNum}]</span>`;
      });
      matchHtml += html + '</div></div>'; // 关闭匹配题容器
      
      groupBlankContent.push(`<div style='margin-bottom:18px;padding:12px;background:#fff;border-radius:6px'><div style='font-size:16px;line-height:1.6'>${matchHtml}</div></div>`);
      globalIndex += blankIdx; // 每个空都占一个题号
      return;
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
      } else if (q.type === 'multi') {
        // 双选题用checkbox，正确答案数组
        const correctArr = Array.isArray(q.answer) ? q.answer : [];
        opts = `<ul style='list-style:none;padding-left:0;margin:8px 0 0 0;'>` + q.options.map((opt, oi) => {
          const letter = String.fromCharCode(65+oi);
          const isCorrect = correctArr.includes(oi) ? " data-answer='true'" : '';
          return `<li style='margin-bottom:6px'><label style='display:flex;align-items:center;font-size:15px;'><input type='checkbox' name='${name}' value='${letter}' style='margin-right:8px'${isCorrect}/> <span style='font-weight:bold;margin-right:8px'>${letter}.</span> <span>${opt}</span></label></li>`;
        }).join('') + '</ul>';
      } else {
        // 其他题型不显示选项号
        opts = `<ul style='list-style:none;padding-left:0;margin:8px 0 0 0;'>` + q.options.map((opt, oi) => {
          const isCorrect = q.answer === oi ? " data-answer='true'" : '';
          return `<li style='margin-bottom:6px'><label style='display:flex;align-items:center;font-size:15px;'><input type='radio' name='${name}' value='${opt}' style='margin-right:8px'${isCorrect}/> <span>${opt}</span></label></li>`;
        }).join('') + '</ul>';
      }
      groupQuestions.push(`<li style='margin-bottom:18px'><div style='font-size:16px;margin-bottom:6px'>${q.text}</div>${opts}</li>`);
    }
  });
  if(groupQuestions.length || groupBlankContent.length || pendingInstruction) {
    html += `<div style='border:1px solid #e5e7eb;border-radius:8px;padding:12px;margin-bottom:18px;background:#f9fafb'>`;
    if(pendingInstruction) {
      html += `<div style='margin-bottom:15px'>${pendingInstruction}</div>`;
    }
    // 先渲染有序列表的题目
    if(groupQuestions.length) {
      html += `<ol start='${globalIndex}'>${groupQuestions.join('')}</ol>`;
    }
    // 再渲染填空题（无序号，但有题号）
    if(groupBlankContent.length) {
      html += groupBlankContent.join('');
    }
    html += `</div>`;
  }
  return html;
}

export async function exportHtml({ title, readingText, footnote, questions }) {
  let leftContent = `<h2>${title || 'Reading Materials'}</h2><div>${readingText}</div>`;
  
  // 添加底部批注（如果存在）
  if (footnote && footnote.trim()) {
    leftContent += `<div style="margin-top:24px;padding-top:16px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:14px;line-height:1.6;">${footnote.replace(/\n/g, '<br>')}</div>`;
  }
  
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
      if (window.showToast) {
        window.showToast('导出成功！文件已保存到：' + result.filePath);
      } else {
        alert('导出成功！文件已保存到：' + result.filePath);
      }
    } else {
      let msg = '导出已取消。';
      if (result.error) msg += '\n原因：' + result.error;
      if (window.showToast) {
        window.showToast(msg);
      } else {
        alert(msg);
      }
    }
  } else {
    if (window.showToast) {
      window.showToast('当前环境不支持本地保存（请在Electron应用中使用）。');
    } else {
      alert('当前环境不支持本地保存（请在Electron应用中使用）。');
    }
  }
}
