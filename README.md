# IELTS Reading Quiz Maker / 雅思阅读试卷生成器

## 项目简介 / Project Introduction

本项目是一个基于 Electron + React 的桌面软件，旨在帮助普通老师（无需编程基础）在 Windows 平台上可视化编辑并批量生成雅思阅读题型的 HTML 网页试卷。学生可直接用浏览器答题，自动评分。

This project is a desktop application based on Electron + React, designed for teachers (no coding required) to visually create and batch-generate IELTS reading HTML quiz pages on Windows. Students can answer directly in browser with auto-grading.

## 主要功能 / Main Features

- 左文右题分栏布局，所见即所得编辑
- 支持单选、多选、填空等题型
- 自动评分与答案显示
- 一键导出为静态 HTML 文件
- 界面友好，易于上手

## 安装与运行 / Installation & Usage

### 中文说明
1. 安装 [Node.js](https://nodejs.org/)、[Git](https://git-scm.com/)、[VS Code](https://code.visualstudio.com/)
2. 克隆或复制本项目到本地文件夹
3. 依次执行以下命令安装依赖并运行：
   ```shell
   npm install --save react react-dom
   npm install --save-dev electron @electron-forge/cli
   npx electron-forge import
   npm install
   npx webpack
   npm start
   ```
4. 如需导出安装包（.exe），运行：
   ```shell
   npm run make
   ```

### English Instructions
1. Install [Node.js](https://nodejs.org/), [Git](https://git-scm.com/), [VS Code](https://code.visualstudio.com/)
2. Clone or copy this repo to your local folder
3. Run the following commands to install dependencies and start:
   ```shell
   npm install --save react react-dom
   npm install --save-dev electron @electron-forge/cli
   npx electron-forge import
   npm install
   npx webpack
   npm start
   ```
4. To export installer (.exe), run:
   ```shell
   npm run make
   ```

## 开源协议 / License

本项目采用 GPL-3.0 协议，任何衍生作品必须同样开源。
This project is licensed under GPL-3.0. All derivative works must also be open source.

## 联系方式 / Contact

如有建议或需求，请通过 Issues 联系。
For suggestions or requests, please use Issues.
