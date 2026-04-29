# QRngViewer 构建指南

## 系统要求

### Windows
- Windows 10 (1803+) 或 Windows 11
- 至少 4GB RAM
- 2GB 可用磁盘空间

### macOS
- macOS 10.15 (Catalina) 或更高
- 至少 4GB RAM

### Linux (Ubuntu/Debian)
- Ubuntu 20.04+ 或 Debian 11+
- 至少 4GB RAM

### Android
- Android 7.0 (API 24) 或更高

### iOS
- iOS 14.0 或更高

---

## 快速安装 (推荐)

### 方式一: 使用安装脚本

```bash
# 1. 安装 Node.js
curl -fsSL https://fnm.vercel.app/install | bash
source ~/.zshrc
fnm install 20
fnm default 20

# 2. 安装 Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.zshrc

# 3. 构建项目
cd /Volumes/MYDISK/QrngViewer
npm install
npm run tauri build
```

### 方式二: 手动安装

#### Windows
```powershell
# 安装 Node.js
winget install OpenJS.NodeJS.LTS

# 安装 Rust
winget install Rustlang.Rust.MSVC

# 重启终端后执行
cd QrngViewer
npm install
npm run tauri build
```

#### macOS
```bash
# 使用 Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install node@20 rust

# 构建
cd QrngViewer
npm install
npm run tauri build
```

#### Linux (Ubuntu)
```bash
sudo apt update
sudo apt install -y curl git build-essential
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

cd QrngViewer
npm install
npm run tauri build
```

---

## 构建输出

构建完成后，文件位置:

| 平台 | 文件位置 |
|------|----------|
| Windows | `src-tauri/target/release/bundle/nsis/QRngViewer_1.0.0_x64-setup.exe` |
| macOS | `src-tauri/target/release/bundle/dmg/QRngViewer_1.0.0_x64.dmg` |
| Linux | `src-tauri/target/release/bundle/deb/QRngViewer_1.0.0_amd64.deb` |
| Android | `src-tauri/target/release/bundle/apk/QRngViewer_1.0.0.apk` |
| iOS | `src-tauri/target/release/bundle/ios/QRngViewer.ipa` |

---

## 快速验证 (Web版)

如果暂时无法构建，可以使用 Web 版进行功能验证:

```bash
# 仅运行前端 (不需要 Rust)
cd QrngViewer
npm install
npm run dev
```

然后在浏览器访问 http://localhost:1420

---

## 常见问题

### Q: 构建失败怎么办?
A: 确保已安装:
- Node.js 18+ 
- Rust 1.70+
- C++ 构建工具

### Q: macOS 构建签名错误?
A: 需要配置 Apple Developer 证书，或使用:
```bash
npm run tauri build -- --no-bundle
```

### Q: Android APK 无法安装?
A: 需要签名，或在设备上开启"允许未知来源应用"

---

## 一键安装脚本

创建 `install-build.sh`:

```bash
#!/bin/bash
set -e

echo "=== QRngViewer 构建环境安装 ==="

# 检测操作系统
OS=$(uname -s)

if [ "$OS" = "Darwin" ]; then
    echo "检测到 macOS"
    
    # 安装 Homebrew
    if ! command -v brew &> /dev/null; then
        echo "安装 Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    
    # 安装 Node.js 和 Rust
    brew install node@20 rust
    
elif [ "$OS" = "Linux" ]; then
    echo "检测到 Linux"
    
    if command -v apt-get &> /dev/null; then
        sudo apt-get update
        sudo apt-get install -y curl git build-essential
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
    
    if ! command -v rustc &> /dev/null; then
        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    fi
fi

echo "=== 环境安装完成 ==="
echo "请运行: cd QrngViewer && npm install && npm run tauri build"
```

保存后执行:
```bash
chmod +x install-build.sh
./install-build.sh
```