import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

// 直接引入 ReadingExample.html 的样式（建议将 CSS 复制到 public/style.css 并在 index.html 引入）
// 这里暂时内联样式，后续可优化为独立 CSS 文件
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
`;

function App() {
  const [readingText, setReadingText] = useState('');

  return (
    <>
      <style>{style}</style>
      <div className="shell">
        <section className="pane" id="left">
          <h2>阅读编辑区</h2>
          <textarea
            style={{ width: '100%', height: '70vh', fontSize: '16px', padding: '8px' }}
            value={readingText}
            onChange={e => setReadingText(e.target.value)}
            placeholder="请输入阅读材料..."
          />
        </section>
        <div id="divider" title="Drag to resize"></div>
        <section className="pane" id="right">
          <h2>题目编辑区</h2>
          {/* 后续可放题目编辑器、导出按钮等 */}
        </section>
      </div>
    </>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);