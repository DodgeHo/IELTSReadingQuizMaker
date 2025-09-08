const { app, BrowserWindow } = require('electron');
const path = require('path');
const { ipcMain, dialog } = require('electron');
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

  mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));

  // 监听保存 HTML 请求
  ipcMain.handle('save-html', async (event, { html, defaultFileName }) => {
    // 默认保存到 output 文件夹，文件名为文章标题（非法字符自动替换）
    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    let fileName = defaultFileName || 'IELTS_Reading_Export.html';
    // 替换非法文件名字符
    fileName = fileName.replace(/[/\\:*?"<>|]/g, '_');
    if (!fileName.toLowerCase().endsWith('.html')) fileName += '.html';
    const defaultPath = path.join(outputDir, fileName);
    const { filePath } = await dialog.showSaveDialog(mainWindow, {
      title: '保存导出 HTML',
      defaultPath,
      filters: [{ name: 'HTML 文件', extensions: ['html'] }],
    });
    if (filePath) {
      fs.writeFileSync(filePath, html, 'utf-8');
      return { success: true, filePath };
    }
    return { success: false };
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});