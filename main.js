const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.maximize();
  mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
}

app.whenReady().then(createWindow);

ipcMain.handle('save-html', async (event, { title, leftContent, rightContent, defaultFileName }) => {
  try {
    // 1. 读取模板
    const templatePath = path.join(__dirname, 'src/utils/template.html');
    let template = fs.readFileSync(templatePath, 'utf-8');
    // 2. 变量插值
    template = template.replace(/\$\{title\}/g, title || '雅思阅读');
    template = template.replace(/\$\{leftContent\}/g, leftContent || '');
    template = template.replace(/\$\{rightContent\}/g, rightContent || '');

    // 3. 文件名优化：只保留英文、数字、下划线，去除特殊字符和空格
    let safeName = defaultFileName || 'IELTS_Reading.html';
    safeName = safeName.replace(/[^a-zA-Z0-9_\.]/g, '_');
    if (!safeName.toLowerCase().endsWith('.html')) safeName += '.html';

    // 4. 默认保存到 output 子文件夹
    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    const defaultPath = path.join(outputDir, safeName);

    // 5. 弹出保存窗口
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: '导出HTML',
      defaultPath,
      filters: [{ name: 'HTML文件', extensions: ['html'] }],
    });
    if (canceled || !filePath) {
      // 失败时返回详细原因
      let reason = canceled ? '用户取消保存窗口' : '未获得有效保存路径';
      return { success: false, error: reason };
    }
    try {
      fs.writeFileSync(filePath, template, 'utf-8');
      return { success: true, filePath };
    } catch (err) {
      return { success: false, error: '写入文件失败: ' + err.message };
    }
  } catch (e) {
    return { success: false, error: '主进程异常: ' + e.message };
  }
});

// 保存项目文件
ipcMain.handle('save-project', async (event, { data, fileName }) => {
  try {
    // 1. 确保output文件夹存在
    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 2. 设置默认保存路径
    const defaultPath = path.join(outputDir, fileName);

    // 3. 弹出保存对话框，默认路径指向output文件夹
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: '保存工程文件',
      defaultPath,
      filters: [{ name: 'JSON文件', extensions: ['json'] }],
    });

    if (canceled || !filePath) {
      return { success: false, error: '用户取消保存' };
    }

    // 4. 写入文件
    fs.writeFileSync(filePath, data, 'utf-8');
    return { success: true, filePath };

  } catch (error) {
    return { success: false, error: error.message };
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});