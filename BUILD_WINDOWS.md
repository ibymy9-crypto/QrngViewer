# QRngViewer Windows 安装包构建指南

## 快速开始

### 方式一：使用 Electron 构建 (推荐)

```bash
# 1. 进入 Electron 目录
cd electron

# 2. 安装依赖
npm install

# 3. 构建 Windows 安装包
npm run electron:build

# 输出: electron/release/win-unpacked/QRngViewer Setup.exe
```

### 方式二：使用构建脚本
```bash
chmod +x ../build.sh
../build.sh win
```

---

## 方案一：本地构建 (需要安装环境)

### 步骤 1：安装 Node.js
```powershell
# 使用 winget (Windows)
winget install OpenJS.NodeJS.LTS

# 或下载安装包
# https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi
```

### 步骤 2：安装 Rust
```powershell
# 使用 winget
winget install Rustlang.Rust.MSVC

# 或下载
# https://static.rust-lang.org/rustup/dist/x86_64-pc-windows-msvc/rustup-init.exe
```

### 步骤 3：构建项目
```powershell
# 进入项目目录
cd QrngViewer

# 安装依赖
npm install

# 构建 Windows 安装包
npm run tauri build

# 输出文件位置:
# src-tauri/target/release/bundle/nsis/QRngViewer_1.0.0_x64-setup.exe
```

---

## 方案二：使用 GitHub Actions (免费云构建)

### 步骤 1：创建 GitHub 仓库
1. 登录 GitHub (https://github.com)
2. 创建新仓库 `QRngViewer`
3. 上传项目文件

### 步骤 2：创建构建工作流
创建文件 `.github/workflows/build.yml`:

```yaml
name: Build Windows Installer

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: windows-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install Rust
        uses: dtolnay/rust-action@stable
        with:
          toolchain: stable
          
      - name: Install dependencies
        run: npm install
        
      - name: Build Tauri app
        run: npm run tauri build
        env:
          TAURI_SIGNING_PRIVATE_KEY: ${{ secrets.TAURI_KEY }}
          
      - name: Upload installer
        uses: actions/upload-release-asset@v1
        with:
          upload_url: ${{ secrets.UPLOAD_URL }}
          asset_path: src-tauri/target/release/bundle/nsis/*.exe
```

### 步骤 3：触发构建
```bash
git tag v1.0.0
git push origin v1.0.0
```

---

## 方案三：使用 Electron + electron-builder

这是更简单的方案，不需要 Rust。

### 1. 修改 package.json
```json
{
  "name": "qrng-viewer",
  "main": "dist-electron/main.js",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "electron:dev": "electron .",
    "electron:build": "electron-builder --win"
  },
  "devDependencies": {
    "electron": "^28.0.0",
    "electron-builder": "^24.9.1"
  },
  "build": {
    "appId": "com.qrngviewer.app",
    "win": {
      "target": "nsis",
      "icon": "public/icon.ico"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true
    }
  }
}
```

### 2. 创建 Electron 主进程
创建 `electron/main.js`:
```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:1420');
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(createWindow);
```

### 3. 构建
```bash
npm run electron:build
# 输出: dist/QRngViewer Setup.exe
```

---

## 方案四：使用在线构建服务

### Replit + electron-builder
1. 在 https://replit.com 创建 Node.js 项目
2. 上传代码
3. 运行 `npm run electron:build`

### CodeSandbox
1. 访问 https://codesandbox.io
2. 导入项目
3. 配置 electron-builder

---

## 快速验证 (无需安装)

直接使用 Web 版:
```bash
# 方式1: 双击打开
open web/index.html

# 方式2: 启动本地服务器
cd web
python -m http.server 8080
# 浏览器访问 http://localhost:8080
```

---

## 输出文件

| 方案 | 输出文件 | 大小 |
|------|----------|------|
| Tauri | QRngViewer_1.0.0_x64-setup.exe | ~15MB |
| Electron | QRngViewer Setup.exe | ~80MB |
| Web | index.html (单文件) | ~200KB |