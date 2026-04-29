# GitHub 提交指南

## 方式一：使用 GitHub CLI (推荐)

### 1. 安装 GitHub CLI
```bash
# macOS
brew install gh

# Windows
winget install GitHub.cli

# Linux
curl -fsSL https://cli.github.com/packages/github-cli-pub.key | sudo gpg --dearmor -o /usr/share/keyrings/github-cli.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/github-cli.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh
```

### 2. 认证登录
```bash
gh auth login
# 选择 GitHub.com
# 选择 HTTPS
# 输入 Personal access token (需要在 GitHub 设置中创建)
```

### 3. 创建仓库并推送
```bash
cd /Volumes/MYDISK/QrngViewer

# 初始化 Git
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: QRngViewer - 跨平台随机数发生器上位机"

# 创建仓库并推送
gh repo create QRngViewer --source=. --public --push
```

---

## 方式二：使用 Git 命令

### 1. 配置 Git
```bash
git config --global user.name "你的用户名"
git config --global user.email "你的邮箱"
```

### 2. 在 GitHub 创建空仓库
1. 访问 https://github.com/new
2. 仓库名称: `QRngViewer`
3. 选择 Public
4. 不要勾选 "Add a README file"
5. 点击 "Create repository"

### 3. 本地推送
```bash
cd /Volumes/MYDISK/QrngViewer

# 初始化
git init

# 添加远程仓库
git remote add origin https://github.com/你的用户名/QRngViewer.git

# 添加文件
git add .

# 提交
git commit -m "Initial commit"

# 推送
git branch -M main
git push -u origin main
```

---

## 方式三：使用 GitHub Desktop

### 1. 下载 GitHub Desktop
https://desktop.github.com

### 2. 添加项目
1. 打开 GitHub Desktop
2. File → Add Local Repository
3. 选择 `/Volumes/MYDISK/QrngViewer`
4. 点击 "Create Repository"
5. 点击 "Publish repository"

---

## 提交后的仓库结构

```
QRngViewer/
├── .gitignore              # Git 忽略配置
├── README.md               # 项目说明
├── BUILD_WINDOWS.md        # Windows 构建指南
├── package.json            # 前端依赖
├── tsconfig.json           # TypeScript 配置
├── vite.config.ts          # Vite 配置
├── tailwind.config.js      # Tailwind CSS 配置
├── index.html              # 入口 HTML
├── web/
│   └── index.html         # Web 版单文件应用
├── electron/
│   ├── package.json       # Electron 配置
│   ├── main.js            # 主进程
│   └── preload.js         # 预加载脚本
├── src/
│   ├── main.tsx           # React 入口
│   ├── App.tsx            # 主应用
│   ├── index.css          # 全局样式
│   └── components/       # React 组件
│       ├── Dashboard.tsx
│       ├── DataPanel.tsx
│       ├── StatisticsPanel.tsx
│       ├── SettingsPanel.tsx
│       └── ExportPanel.tsx
└── src-tauri/             # Tauri 后端
    ├── tauri.conf.json
    ├── Cargo.toml
    └── src/
```

---

## 常用 Git 命令

```bash
# 查看状态
git status

# 查看差异
git diff

# 添加修改
git add .
git add -A  # 添加所有

# 提交
git commit -m "描述"

# 查看历史
git log --oneline

# 推送
git push

# 拉取
git pull

# 创建分支
git checkout -b feature/xxx

# 切换分支
git checkout main
```