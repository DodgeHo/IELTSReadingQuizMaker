                let opts = '';
                if(q.type === 'single') {
                  opts = '<div>' + q.options.map((opt, idx) => {
                    return `<label style='display:block;margin:4px 0'><input type='radio' name='q${q.id}'/> ${opt}${q.answer === idx ? "<span style='color:#3b82f6;margin-left:8px'>(正确答案)</span>" : ''}</label>`;
                  }).join('') + '</div>';
                }
                return `<li><div><b>Q${q.id}:</b> ${q.text}</div>${opts}</li>`;
              }).join('')}</ol></section></div></body></html>`;
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);