import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function QuestionPanel({ groups, setGroups, showToast }) {
  // 新建大题相关
  const typeInstructions = {
    single: 'Choose the correct letter, A, B, C or D.',
    multi: 'Choose TWO letters. There may be more than two options, but only two of them are correct.',
    tf: `Do the following statements agree with the information given in the reading passage?\n\nWrite:\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this`,
    yn: `Do the following statements agree with the claims of the writer in Reading Passage?\n\nIn boxes on your answer sheet, write\nYES if the statement agrees with the claims of the writer\nNO if the statement contradicts the claims of the writer\nNOT GIVEN if it is impossible to say what the writer thinks about this`,
    blank: 'Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.',
    table: 'Complete the table below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
  };
  const [newGroupType, setNewGroupType] = useState('single');
  const [newGroupInstruction, setNewGroupInstruction] = useState(typeInstructions.single);
  // 双选题选项数
  const [multiOptionCount, setMultiOptionCount] = useState(5);
  // 当前激活大题索引
  const [activeGroup, setActiveGroup] = useState(null);

  return (
    <section className="pane" id="right">
      <label style={{fontWeight:'bold',fontSize:'16px'}}>题目编辑：</label>

      {groups.map((group, gi) => (
        <div key={group.id} style={{border:'1px solid #e5e7eb',borderRadius:'8px',padding:'12px',marginBottom:'18px',background:'#f9fafb'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <h4 >大题题干描述</h4>
            <button style={{background:'#ef4444',color:'#fff',border:'none',borderRadius:'6px',padding:'4px 10px',marginLeft:'12px'}} onClick={()=>{
              if(window.confirm('确定要删除这个大题吗？')) {
                setGroups(groups.filter((_,idx)=>idx!==gi));
              }
            }}>删除该大题</button>
          </div>
          <ReactQuill
            theme="snow"
            value={group.instruction}
            onChange={value => {
              const newGroups = [...groups];
              newGroups[gi].instruction = value;
              setGroups(newGroups);
            }}
            style={{ minHeight: '80px', marginBottom: '60px', background: '#fff' }}
            modules={{
              toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'align': [] }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
              ]
            }}
            placeholder="输入大题说明，可使用格式化工具栏..."
          />
          
          {/* 填空题特殊处理：整段编辑 */}
          {group.type === 'blank' ? (
            <div style={{background:'#f6f7fb',borderRadius:6,padding:'12px',marginBottom:'12px'}}>
              <div style={{marginBottom:'8px',color:'#64748b',fontSize:15,background:'#e0f2fe',borderRadius:6,padding:'8px 12px'}}>
                <div style={{marginBottom:4}}>
                  <b>填空题操作提示：</b>
                </div>
                <div>在题干中插入 <b>[[空1]]</b>、<b>[[空2]]</b> 等标记，即可自动生成空位。</div>
                <div>每个空的正确答案可设置多个，用分号分隔（如：<span style={{color:'#3b82f6'}}>60000;60,000;sixty thousand</span>）。</div>
                <div style={{marginTop:4,color:'#ef4444'}}>注意：空位标记必须为 <b>[[空数字]]</b>，且从1开始计数，如 [[空1]]、[[空2]]。</div>
              </div>
              
              <label style={{fontWeight:'bold',marginBottom:'6px',display:'block'}}>题目内容（整段编辑）：</label>
              <ReactQuill
                theme="snow"
                value={group.blankContent || ''}
                onChange={value => {
                  const newGroups = [...groups];
                  newGroups[gi].blankContent = value;
                  
                  // 自动识别空数并生成answers数组（从纯文本中识别）
                  const plainText = value.replace(/<[^>]*>/g, ''); // 去除HTML标签
                  const blanks = plainText.match(/\[\[空(\d+)\]\]/g) || [];
                  const blankCount = blanks.length;
                  if(!Array.isArray(newGroups[gi].blankAnswers)) newGroups[gi].blankAnswers = [];
                  while(newGroups[gi].blankAnswers.length < blankCount) newGroups[gi].blankAnswers.push('');
                  while(newGroups[gi].blankAnswers.length > blankCount) newGroups[gi].blankAnswers.pop();
                  
                  setGroups(newGroups);
                }}
                style={{minHeight:'120px',marginBottom:'80px',background:'#fff'}}
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'align': [] }],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link', 'image'],
                    ['clean']
                  ]
                }}
                placeholder="输入题目内容，用[[空1]]、[[空2]]等标记空位，可使用格式化工具栏..."
              />
              
              {/* 答案设置区 */}
              {Array.isArray(group.blankAnswers) && group.blankAnswers.length > 0 && (
                <div style={{marginTop:'12px',background:'#f1f5f9',borderRadius:'6px',padding:'8px'}}>
                  <div style={{fontWeight:'bold',marginBottom:'8px'}}>设置每个空的正确答案（多个答案用分号分隔，大小写不区分）：</div>
                  {group.blankAnswers.map((ans, ai) => (
                    <div key={ai} style={{marginBottom:'6px',display:'flex',alignItems:'center'}}>
                      <label style={{minWidth:'50px'}}>空{ai+1}：</label>
                      <input 
                        type="text" 
                        value={ans} 
                        onChange={e => {
                          const newGroups = [...groups];
                          newGroups[gi].blankAnswers[ai] = e.target.value;
                          setGroups(newGroups);
                        }} 
                        style={{flex:1,marginLeft:'8px',fontSize:'15px',padding:'4px 8px'}} 
                        placeholder="如：60000;60,000;sixty thousand"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : group.type === 'table' ? (
            <div>
              <div style={{margin:'8px 0 12px 0',color:'#64748b',fontSize:15,background:'#f6f7fb',borderRadius:6,padding:'8px 12px'}}>
                <div style={{marginBottom:4}}>
                  <b>表格填空题操作提示：</b>
                </div>
                <div>• 设置表格尺寸，然后在每个单元格中输入内容</div>
                <div>• 需要填空的地方选择"填空"，程序会自动编号</div>
                <div>• 可以混合文字和填空，如："A组 [填空]"</div>
                <div style={{marginTop:4,color:'#ef4444'}}>每个空的正确答案可设置多个，用分号分隔（如：goal;objective）</div>
              </div>
              
              {/* 表格尺寸设置 */}
              <div style={{marginBottom:'15px',padding:'10px',background:'#f1f5f9',borderRadius:'6px'}}>
                <label style={{fontWeight:'bold',marginBottom:'8px',display:'block'}}>表格设置：</label>
                <div style={{display:'flex',alignItems:'center',gap:'15px'}}>
                  <div>
                    <label>行数：</label>
                    <input 
                      type="number" 
                      min={2} 
                      max={8} 
                      value={group.tableRows || 3}
                      onChange={e => {
                        const newGroups = [...groups];
                        const rows = parseInt(e.target.value) || 3;
                        newGroups[gi].tableRows = rows;
                        
                        // 重建表格数据
                        const cols = newGroups[gi].tableCols || 3;
                        newGroups[gi].tableData = Array(rows).fill(null).map(() => 
                          Array(cols).fill(null).map(() => ({type: 'text', content: ''}))
                        );
                        
                        setGroups(newGroups);
                      }}
                      style={{width:'50px',marginLeft:'5px'}}
                    />
                  </div>
                  <div>
                    <label>列数：</label>
                    <input 
                      type="number" 
                      min={2} 
                      max={6} 
                      value={group.tableCols || 3}
                      onChange={e => {
                        const newGroups = [...groups];
                        const cols = parseInt(e.target.value) || 3;
                        newGroups[gi].tableCols = cols;
                        
                        // 重建表格数据
                        const rows = newGroups[gi].tableRows || 3;
                        newGroups[gi].tableData = Array(rows).fill(null).map(() => 
                          Array(cols).fill(null).map(() => ({type: 'text', content: ''}))
                        );
                        
                        setGroups(newGroups);
                      }}
                      style={{width:'50px',marginLeft:'5px'}}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newGroups = [...groups];
                      
                      // 创建示例表格
                      newGroups[gi].tableRows = 4;
                      newGroups[gi].tableCols = 3;
                      newGroups[gi].tableData = [
                        [{type: 'text', content: 'Conditions'}, {type: 'text', content: 'Type of situation'}, {type: 'text', content: 'Result'}],
                        [{type: 'text', content: 'Equal status'}, {type: 'text', content: 'eating'}, {type: 'blank', content: ''}],
                        [{type: 'text', content: ''}, {type: 'blank', content: ''}, {type: 'text', content: 'enjoyed them but were not sitting together'}],
                        [{type: 'mixed', content: 'A [空]'}, {type: 'text', content: 'raising money'}, {type: 'text', content: ''}]
                      ];
                      
                      setGroups(newGroups);
                    }}
                    style={{
                      padding:'4px 12px',
                      fontSize:'12px',
                      border:'1px solid #3b82f6',
                      borderRadius:'4px',
                      background:'#eff6ff',
                      color:'#3b82f6',
                      cursor:'pointer'
                    }}
                  >
                    载入示例
                  </button>
                </div>
              </div>

              {/* 可视化表格编辑器 */}
              {group.tableData && (
                <div style={{marginBottom:'20px'}}>
                  <label style={{fontWeight:'bold',marginBottom:'8px',display:'block'}}>编辑表格内容：</label>
                  <div style={{
                    border:'1px solid #d1d5db',
                    borderRadius:'6px',
                    overflow:'hidden',
                    background:'#fff'
                  }}>
                    <table style={{width:'100%',borderCollapse:'collapse'}}>
                      <tbody>
                        {group.tableData.map((row, ri) => (
                          <tr key={ri}>
                            {row.map((cell, ci) => (
                              <td key={ci} style={{
                                border:'1px solid #e5e7eb',
                                padding:'8px',
                                verticalAlign:'top',
                                minWidth:'120px'
                              }}>
                                <div style={{marginBottom:'5px'}}>
                                  <select
                                    value={cell.type}
                                    onChange={e => {
                                      const newGroups = [...groups];
                                      newGroups[gi].tableData[ri][ci].type = e.target.value;
                                      if(e.target.value === 'blank') {
                                        newGroups[gi].tableData[ri][ci].content = '';
                                      } else if(e.target.value === 'mixed') {
                                        newGroups[gi].tableData[ri][ci].content = '[空]';
                                      }
                                      setGroups(newGroups);
                                    }}
                                    style={{
                                      fontSize:'11px',
                                      padding:'2px 4px',
                                      border:'1px solid #d1d5db',
                                      borderRadius:'3px',
                                      width:'100%'
                                    }}
                                  >
                                    <option value="text">文字</option>
                                    <option value="blank">填空</option>
                                    <option value="mixed">文字+填空</option>
                                    <option value="empty">空白</option>
                                  </select>
                                </div>
                                {cell.type === 'text' && (
                                  <input
                                    type="text"
                                    value={cell.content}
                                    onChange={e => {
                                      const newGroups = [...groups];
                                      newGroups[gi].tableData[ri][ci].content = e.target.value;
                                      setGroups(newGroups);
                                    }}
                                    placeholder="输入文字内容"
                                    style={{
                                      width:'100%',
                                      padding:'4px',
                                      border:'1px solid #e5e7eb',
                                      borderRadius:'3px',
                                      fontSize:'13px'
                                    }}
                                  />
                                )}
                                {cell.type === 'mixed' && (
                                  <input
                                    type="text"
                                    value={cell.content}
                                    onChange={e => {
                                      const newGroups = [...groups];
                                      newGroups[gi].tableData[ri][ci].content = e.target.value;
                                      setGroups(newGroups);
                                    }}
                                    placeholder="如：A [空] 或 [空], e.g. stuck truck"
                                    style={{
                                      width:'100%',
                                      padding:'4px',
                                      border:'1px solid #e5e7eb',
                                      borderRadius:'3px',
                                      fontSize:'13px'
                                    }}
                                  />
                                )}
                                {cell.type === 'blank' && (
                                  <div style={{
                                    padding:'8px',
                                    background:'#fef3c7',
                                    border:'2px dashed #f59e0b',
                                    borderRadius:'4px',
                                    textAlign:'center',
                                    fontSize:'12px',
                                    color:'#92400e'
                                  }}>
                                    填空位置
                                  </div>
                                )}
                                {cell.type === 'empty' && (
                                  <div style={{
                                    padding:'8px',
                                    background:'#f3f4f6',
                                    border:'1px dashed #d1d5db',
                                    borderRadius:'4px',
                                    textAlign:'center',
                                    fontSize:'12px',
                                    color:'#6b7280'
                                  }}>
                                    空白单元格
                                  </div>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 表格预览（显示实际效果） */}
              {group.tableData && (() => {
                let blankIndex = 1;
                return (
                  <div style={{marginTop:'15px'}}>
                    <label style={{fontWeight:'bold',marginBottom:'8px',display:'block'}}>预览效果：</label>
                    <div style={{
                      border:'1px solid #d1d5db',
                      borderRadius:'6px',
                      padding:'10px',
                      background:'#f9fafb'
                    }}>
                      <table style={{width:'100%',borderCollapse:'collapse'}}>
                        <tbody>
                          {group.tableData.map((row, ri) => (
                            <tr key={ri}>
                              {row.map((cell, ci) => (
                                <td key={ci} style={{
                                  border:'1px solid #e5e7eb',
                                  padding:'8px',
                                  background:'#fff'
                                }}>
                                  {cell.type === 'text' && cell.content}
                                  {cell.type === 'blank' && (
                                    <span style={{
                                      background:'#fef3c7',
                                      color:'#92400e',
                                      padding:'2px 6px',
                                      borderRadius:'3px',
                                      fontSize:'12px',
                                      border:'1px dashed #f59e0b'
                                    }}>
                                      [{blankIndex++}]
                                    </span>
                                  )}
                                  {cell.type === 'mixed' && (() => {
                                    return cell.content.replace(/\[空\]/g, () => {
                                      return `<span style="background:#fef3c7;color:#92400e;padding:2px 6px;border-radius:3px;font-size:12px;border:1px dashed #f59e0b;">[${blankIndex++}]</span>`;
                                    });
                                  })().split(/(<span[^>]*>.*?<\/span>)/).map((part, pi) => 
                                    part.includes('<span') ? 
                                      <span key={pi} dangerouslySetInnerHTML={{__html: part}} /> : 
                                      part
                                  )}
                                  {cell.type === 'empty' && ''}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}

              {/* 自动计算填空数量并生成答案输入框 */}
              {(() => {
                if (!group.tableData) return null;
                
                let blankCount = 0;
                let mixedBlanks = 0;
                
                group.tableData.forEach(row => {
                  row.forEach(cell => {
                    if (cell.type === 'blank') {
                      blankCount++;
                    } else if (cell.type === 'mixed') {
                      // 计算mixed类型中的[空]数量
                      const matches = (cell.content || '').match(/\[空\]/g);
                      if (matches) {
                        mixedBlanks += matches.length;
                      }
                    }
                  });
                });
                
                const totalBlanks = blankCount + mixedBlanks;
                
                // 同步tableAnswers数组
                if (totalBlanks > 0) {
                  const newGroups = [...groups];
                  if (!Array.isArray(newGroups[gi].tableAnswers)) {
                    newGroups[gi].tableAnswers = [];
                  }
                  
                  // 调整数组长度
                  while (newGroups[gi].tableAnswers.length < totalBlanks) {
                    newGroups[gi].tableAnswers.push('');
                  }
                  while (newGroups[gi].tableAnswers.length > totalBlanks) {
                    newGroups[gi].tableAnswers.pop();
                  }
                  
                  // 只在必要时更新state，避免无限循环
                  if (newGroups[gi].tableAnswers.length !== (group.tableAnswers || []).length) {
                    setTimeout(() => setGroups(newGroups), 0);
                  }
                }
                
                return totalBlanks > 0 ? (
                  <div style={{marginTop:'15px',padding:'12px',background:'#f1f5f9',borderRadius:'6px'}}>
                    <div style={{fontWeight:'bold',marginBottom:'8px'}}>
                      设置答案（共{totalBlanks}个空，多个答案用分号分隔）：
                    </div>
                    {Array.from({length: totalBlanks}).map((_, ai) => (
                      <div key={ai} style={{display:'flex',alignItems:'center',marginBottom:'6px'}}>
                        <span style={{minWidth:'60px',fontWeight:'bold'}}>空{ai+1}:</span>
                        <input 
                          type="text" 
                          value={(group.tableAnswers && group.tableAnswers[ai]) || ''} 
                          onChange={e => {
                            const newGroups = [...groups];
                            if (!Array.isArray(newGroups[gi].tableAnswers)) {
                              newGroups[gi].tableAnswers = [];
                            }
                            newGroups[gi].tableAnswers[ai] = e.target.value;
                            setGroups(newGroups);
                          }} 
                          style={{flex:1,marginLeft:'8px',fontSize:'15px',padding:'4px 8px',border:'1px solid #d1d5db',borderRadius:'4px'}} 
                          placeholder="如：goal;objective;target"
                        />
                      </div>
                    ))}
                  </div>
                ) : null;
              })()}


            </div>
          ) : (
            <ol>
            {group.questions.map((q, qi) => (
              <li key={q.id} style={{marginBottom: '14px',borderBottom:'1px dashed #e5e7eb',paddingBottom:'8px'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <button style={{background:'#ef4444',color:'#fff',border:'none',borderRadius:'6px',padding:'2px 8px',marginLeft:'12px'}} onClick={()=>{
                    if(window.confirm('确定要删除这个小题吗？')) {
                      const newGroups = [...groups];
                      newGroups[gi].questions = newGroups[gi].questions.filter((_,idx)=>idx!==qi);
                      setGroups(newGroups);
                    }
                  }}>删除小题</button>
                  <button style={{background:'#eab308',color:'#fff',border:'none',borderRadius:'6px',padding:'2px 8px',marginLeft:'4px'}} disabled={qi===0} onClick={()=>{
                    if(qi===0) return;
                    const newGroups = [...groups];
                    const arr = newGroups[gi].questions;
                    [arr[qi-1],arr[qi]] = [arr[qi],arr[qi-1]];
                    setGroups(newGroups);
                  }}>上移</button>
                  <button style={{background:'#eab308',color:'#fff',border:'none',borderRadius:'6px',padding:'2px 8px',marginLeft:'4px'}} disabled={qi===group.questions.length-1} onClick={()=>{
                    if(qi===group.questions.length-1) return;
                    const newGroups = [...groups];
                    const arr = newGroups[gi].questions;
                    [arr[qi],arr[qi+1]] = [arr[qi+1],arr[qi]];
                    setGroups(newGroups);
                  }}>下移</button>
                </div>
                <textarea value={q.text} onChange={e=>{
                  const newGroups = [...groups];
                  newGroups[gi].questions[qi].text = e.target.value;
                  setGroups(newGroups);
                }} style={{width:'100%',height:'48px',margin:'6px 0',fontSize:'15px',resize:'vertical'}} placeholder="题干内容"/>
                {group.type === 'single' && (
                  <div style={{marginLeft:'12px'}}>
                    {q.options.map((opt, oi) => (
                      <div key={oi} style={{display:'flex',alignItems:'center',marginBottom:'4px'}}>
                        <input type="radio" name={`ans_${group.id}_${q.id}`} checked={q.answer===oi} onChange={()=>{
                          const newGroups = [...groups];
                          newGroups[gi].questions[qi].answer = oi;
                          setGroups(newGroups);
                        }}/>
                        <textarea value={opt} onChange={e=>{
                          const newGroups = [...groups];
                          newGroups[gi].questions[qi].options[oi] = e.target.value;
                          setGroups(newGroups);
                        }} style={{width:'70%',height:'32px',marginLeft:'8px',fontSize:'15px',resize:'vertical'}} placeholder={`选项${String.fromCharCode(65+oi)}`}/>
                        <button style={{background:'#ef4444',color:'#fff',border:'none',borderRadius:'6px',padding:'2px 8px',marginLeft:'8px'}} disabled={q.options.length<=2} onClick={()=>{
                          const newGroups = [...groups];
                          newGroups[gi].questions[qi].options = newGroups[gi].questions[qi].options.filter((_,idx)=>idx!==oi);
                          // 如果删除的是正确答案，重置answer
                          if(newGroups[gi].questions[qi].answer === oi) newGroups[gi].questions[qi].answer = 0;
                          setGroups(newGroups);
                        }}>删除选项</button>
                      </div>
                    ))}
                    <button style={{background:'#3b82f6',color:'#fff',border:'none',borderRadius:'6px',padding:'2px 10px',marginTop:'4px'}} onClick={()=>{
                      const newGroups = [...groups];
                      newGroups[gi].questions[qi].options.push('');
                      setGroups(newGroups);
                    }}>添加选项</button>
                  </div>
                )}
                {group.type === 'multi' && (
                  <div style={{marginLeft:'12px'}}>
                    <div style={{marginBottom:'6px'}}>
                      <label>选项数：</label>
                      <input type="number" min={3} max={10} value={q.options.length} onChange={e=>{
                        let v = parseInt(e.target.value, 10);
                        if(isNaN(v) || v<3) v = 3;
                        if(v>10) v = 10;
                        const newGroups = [...groups];
                        let opts = [...newGroups[gi].questions[qi].options];
                        if(v > opts.length) {
                          opts = opts.concat(Array(v - opts.length).fill(''));
                        } else if(v < opts.length) {
                          opts = opts.slice(0, v);
                          // 答案同步修正
                          if(Array.isArray(newGroups[gi].questions[qi].answer)) {
                            newGroups[gi].questions[qi].answer = newGroups[gi].questions[qi].answer.filter(idx=>idx<v);
                          }
                        }
                        newGroups[gi].questions[qi].options = opts;
                        setGroups(newGroups);
                      }} style={{width:'60px',marginLeft:'8px'}} />
                      <span style={{color:'#888',marginLeft:'8px'}}>（3-10个）</span>
                    </div>
                    {q.options.map((opt, oi) => (
                      <div key={oi} style={{display:'flex',alignItems:'center',marginBottom:'4px'}}>
                        <input type="checkbox" name={`ans_${group.id}_${q.id}`} checked={Array.isArray(q.answer) && q.answer.includes(oi)} onChange={()=>{
                          const newGroups = [...groups];
                          let ans = Array.isArray(newGroups[gi].questions[qi].answer) ? [...newGroups[gi].questions[qi].answer] : [];
                          if(ans.includes(oi)) {
                            ans = ans.filter(x=>x!==oi);
                          } else {
                            if(ans.length<2) ans.push(oi);
                            else {
                              if(showToast) showToast('只能选择两个答案');
                              return;
                            }
                          }
                          newGroups[gi].questions[qi].answer = ans;
                          setGroups(newGroups);
                        }}/>
                        <textarea value={opt} onChange={e=>{
                          const newGroups = [...groups];
                          newGroups[gi].questions[qi].options[oi] = e.target.value;
                          setGroups(newGroups);
                        }} style={{width:'70%',height:'32px',marginLeft:'8px',fontSize:'15px',resize:'vertical'}} placeholder={`选项${String.fromCharCode(65+oi)}`}/>
                      </div>
                    ))}
                  </div>
                )}
                {/* 继续渲染其他题型 */}
                {group.type === 'tf' && (
                  <div style={{marginLeft:'12px'}}>
                    {q.options.map((opt, oi) => (
                      <div key={oi} style={{display:'flex',alignItems:'center',marginBottom:'4px'}}>
                        <input type="radio" name={`ans_${group.id}_${q.id}`} checked={q.answer===oi} onChange={()=>{
                          const newGroups = [...groups];
                          newGroups[gi].questions[qi].answer = oi;
                          setGroups(newGroups);
                        }}/>
                        <span style={{marginLeft:'8px',fontWeight:'bold'}}>{opt}</span>
                      </div>
                    ))}
                  </div>
                )}
                {group.type === 'yn' && (
                  <div style={{marginLeft:'12px'}}>
                    {q.options.map((opt, oi) => (
                      <div key={oi} style={{display:'flex',alignItems:'center',marginBottom:'4px'}}>
                        <input type="radio" name={`ans_${group.id}_${q.id}`} checked={q.answer===oi} onChange={()=>{
                          const newGroups = [...groups];
                          newGroups[gi].questions[qi].answer = oi;
                          setGroups(newGroups);
                        }}/>
                        <span style={{marginLeft:'8px',fontWeight:'bold'}}>{opt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ol>
          )}
          
          {/* 非填空题的小题添加区 */}
          {group.type !== 'blank' && group.type !== 'table' && (
          <div style={{marginTop:'8px',borderTop:'1px dashed #e5e7eb',paddingTop:'8px', background:'#b3c8f3ff', borderRadius:'6px'}}>
            <h4>添加小题</h4>
            <textarea
              placeholder="题干内容"
              style={{width:'100%',marginBottom:'8px',fontSize:'15px',height:'48px',resize:'vertical'}}
              value={group._newQText || ''}
              onChange={e => {
                const newGroups = [...groups];
                newGroups[gi]._newQText = e.target.value;
                setGroups(newGroups);
              }}
            />
            {group.type === 'multi' && (
              <span style={{marginRight:'12px'}}>
                <label>选项数：</label>
                <input type="number" min={3} max={10} value={group._newQOptions ? group._newQOptions.length : 4}
                  onChange={e => {
                    let v = parseInt(e.target.value, 10);
                    if(isNaN(v) || v<3) v = 3;
                    if(v>10) v = 10;
                    const newGroups = [...groups];
                    let opts = Array.isArray(newGroups[gi]._newQOptions) ? [...newGroups[gi]._newQOptions] : Array(4).fill('');
                    if(v > opts.length) {
                      opts = opts.concat(Array(v - opts.length).fill(''));
                    } else if(v < opts.length) {
                      opts = opts.slice(0, v);
                    }
                    newGroups[gi]._newQOptions = opts;
                    setGroups(newGroups);
                  }}
                  style={{width:'60px',marginLeft:'8px'}}
                />
                <span style={{color:'#888',marginLeft:'8px'}}>（3-10个）</span>
              </span>
            )}
            <button
              onClick={() => {
                const newGroups = [...groups];
                if(!newGroups[gi]._newQText) {
                  if (showToast) showToast('请填写题干内容！');
                  return;
                }
                const nextQid = newGroups[gi].questions && newGroups[gi].questions.length>0 ? newGroups[gi].questions[newGroups[gi].questions.length-1].id+1 : 1;
                let options = [];
                let answers = [];
                if(newGroups[gi].type==='single') options = ['','','',''];
                if(newGroups[gi].type==='multi') {
                  let count = Array.isArray(newGroups[gi]._newQOptions) ? newGroups[gi]._newQOptions.length : 4;
                  options = Array(count).fill('');
                }
                if(newGroups[gi].type==='tf') options = ['TRUE','FALSE','NOT GIVEN'];
                if(newGroups[gi].type==='yn') options = ['YES','NO','NOT GIVEN'];
                newGroups[gi].questions.push({
                  id: nextQid,
                  text: newGroups[gi]._newQText,
                  options,
                  answer: newGroups[gi].type==='multi' ? [] : 0,
                  answers
                });
                newGroups[gi]._newQText = '';
                if(newGroups[gi].type==='multi') newGroups[gi]._newQOptions = Array(4).fill('');
                setGroups(newGroups);
              }}
              style={{padding:'8px 16px',background:'#14745cff',color:'#fff',border:'none',borderRadius:'8px',marginBottom:'12px'}}
            >添加该小题</button>

          </div>
          )}
        </div>
      ))}

      <div style={{border:'1px solid #e5e7eb',borderRadius:'8px',padding:'12px',marginBottom:'18px',background:'rgba(220, 239, 255, 1)ff'}}>
        <div style={{marginBottom:'16px'}}>
          <label>题型：</label>
          <select value={newGroupType} onChange={e=>{
            setNewGroupType(e.target.value);
            setNewGroupInstruction(typeInstructions[e.target.value]);
          }}>
            <option value="single">单选题（A/B/C/D）</option>
            <option value="multi">双选题（可自定义选项数，选2个）</option>
            <option value="tf">事实判断题（TRUE/FALSE/NOT GIVEN）</option>
            <option value="yn">观点匹配题（YES/NO/NOT GIVEN）</option>
            <option value="blank">填空题（句子填空题/段落填空题）</option>
            <option value="table">表格填空题（表格内填空）</option>
          </select>
        </div>
  {/* 移除大题添加区的选项数设置，仅在小题添加区设置 */}
        <button style={{marginBottom:'12px',padding:'8px 16px',background:'#10b981',color:'#fff',border:'none',borderRadius:'8px'}}
            onClick={() => {
            const nextId = groups.length+1;
            let options = [];
            if(newGroupType==='single') options = ['','','',''];
            if(newGroupType==='multi') options = Array(multiOptionCount).fill('');
            if(newGroupType==='tf') options = ['TRUE','FALSE','NOT GIVEN'];
            if(newGroupType==='yn') options = ['YES','NO','NOT GIVEN'];
            setGroups([...groups, {
                id: nextId,
                type: newGroupType,
                instruction: newGroupInstruction,
                questions: [],
                _newQText: '',
                _newQOptions: options,
                _newQAnswer: newGroupType==='multi' ? [] : 0
            }]);
            setActiveGroup(nextId-1);
            setNewGroupInstruction(typeInstructions[newGroupType]);
            }}
        >添加新的大题</button>
      </div>


    </section>
  );
}

export default QuestionPanel;
