// HTML导出模板，结构清晰，支持变量插值
export default function htmlTemplate({ title, leftContent, rightContent, styleBlock, scriptBlock }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>${title || 'IELTS Reading Export'}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>${styleBlock}</style>
  ${scriptBlock}
</head>
<body>
  <div class="shell">
    <section class="pane" id="left">${leftContent}</section>
    <div id="divider"></div>
    <section class="pane" id="right">${rightContent}</section>
  </div>
</body>
</html>`;
}
