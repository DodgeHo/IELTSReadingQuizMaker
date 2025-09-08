import React, { useState } from 'react';

function QuestionPanel({ groups, setGroups }) {
  // 新建大题相关
  const [newGroupType, setNewGroupType] = useState('single');
  const [newGroupInstruction, setNewGroupInstruction] = useState('Choose the correct letter, A, B, C or D.');
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
          <textarea value={group.instruction} onChange={e=>{
            const newGroups = [...groups];
            newGroups[gi].instruction = e.target.value;
            setGroups(newGroups);
          }} style={{width:'100%',height:'40px',marginBottom:'8px',fontSize:'15px',resize:'vertical'}}/>
          <ol>
            {group.questions.map((q, qi) => (
              <li key={q.id} style={{marginBottom: '14px',borderBottom:'1px dashed #e5e7eb',paddingBottom:'8px'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <b>Q{q.id}:</b>
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
                        <button style={{background:'#ef4444',color:'#fff',border:'none',borderRadius:'6px',padding:'2px 8px',marginLeft:'8px'}} onClick={()=>{
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
              </li>
            ))}
          </ol>
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
            <div style={{marginBottom:'8px'}}>
              <span style={{fontWeight:'bold'}}>选项：</span>
              {(group._newQOptions || ['','']).map((opt, oi) => (
                <div key={oi} style={{display:'flex',alignItems:'center',marginBottom:'4px'}}>
                  <input type="radio" name={`newans_${group.id}`} checked={group._newQAnswer===oi} onChange={()=>{
                    const newGroups = [...groups];
                    newGroups[gi]._newQAnswer = oi;
                    setGroups(newGroups);
                  }}/>
                  <textarea value={opt} onChange={e=>{
                    const newGroups = [...groups];
                    newGroups[gi]._newQOptions[oi] = e.target.value;
                    setGroups(newGroups);
                  }} style={{width:'70%',height:'32px',marginLeft:'8px',fontSize:'15px',resize:'vertical'}} placeholder={`选项${String.fromCharCode(65+oi)}`}/>
                  <button style={{background:'#ef4444',color:'#fff',border:'none',borderRadius:'6px',padding:'2px 8px',marginLeft:'8px'}} onClick={()=>{
                    const newGroups = [...groups];
                    newGroups[gi]._newQOptions = newGroups[gi]._newQOptions.filter((_,idx)=>idx!==oi);
                    setGroups(newGroups);
                  }}>删除选项</button>
                </div>
              ))}
              <button style={{background:'#3b82f6',color:'#fff',border:'none',borderRadius:'6px',padding:'2px 10px',marginTop:'4px'}} onClick={()=>{
                const newGroups = [...groups];
                if(!newGroups[gi]._newQOptions) newGroups[gi]._newQOptions = ['',''];
                newGroups[gi]._newQOptions.push('');
                setGroups(newGroups);
              }}>添加选项</button>
            </div>
            <button
              onClick={() => {
                const newGroups = [...groups];
                const opts = (newGroups[gi]._newQOptions || []).filter(s=>s.trim());
                if(!newGroups[gi]._newQText || !opts.length) return;
                const nextQid = newGroups[gi].questions.length>0 ? newGroups[gi].questions[newGroups[gi].questions.length-1].id+1 : 1;
                newGroups[gi].questions.push({
                  id: nextQid,
                  text: newGroups[gi]._newQText,
                  options: opts,
                  answer: typeof newGroups[gi]._newQAnswer==='number' ? newGroups[gi]._newQAnswer : 0
                });
                newGroups[gi]._newQText = '';
                newGroups[gi]._newQOptions = ['',''];
                newGroups[gi]._newQAnswer = 0;
                setGroups(newGroups);
              }}
              style={{padding:'8px 16px',background:'#14745cff',color:'#fff',border:'none',borderRadius:'8px',marginBottom:'12px'}}
            >添加该小题</button>
          </div>
        </div>
      ))}

      <div style={{border:'1px solid #e5e7eb',borderRadius:'8px',padding:'12px',marginBottom:'18px',background:'rgba(220, 239, 255, 1)ff'}}>
        <div style={{marginBottom:'16px'}}>
            <label>题型：</label>
            <select value={newGroupType} onChange={e=>setNewGroupType(e.target.value)}>
                <option value="single">单选题（四个选项）</option>
            </select>
            <br />
            <label>题干要求/说明：</label>
            <textarea placeholder="题干要求/说明" value={newGroupInstruction} onChange={e=>setNewGroupInstruction(e.target.value)} style={{marginLeft:'8px',width:'60%',height:'40px',verticalAlign:'middle',fontSize:'15px'}}/>
        </div>
        <button style={{marginBottom:'12px',padding:'8px 16px',background:'#10b981',color:'#fff',border:'none',borderRadius:'8px'}}
            onClick={() => {
            const nextId = groups.length+1;
            setGroups([...groups, {
                id: nextId,
                type: newGroupType,
                instruction: newGroupInstruction,
                questions: [],
                _newQText: '',
                _newQOptions: ['','','',''],
                _newQAnswer: 0
            }]);
            setActiveGroup(nextId-1);
            setNewGroupInstruction('Choose the correct letter, A, B, C or D.');
            }}
        >添加新的大题</button>
      </div>


    </section>
  );
}

export default QuestionPanel;
