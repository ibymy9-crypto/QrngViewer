#!/bin/bash

# QRngViewer 构建脚本
# 用法: ./build.sh [platform]
# platform: win, mac, linux, all

PLATFORM=${1:-win}

echo "=== QRngViewer 构建脚本 ==="
echo "目标平台: $PLATFORM"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装"
    echo ""
    echo "请先安装 Node.js:"
    echo "  macOS: brew install node@20"
    echo "  Windows: winget install OpenJS.NodeJS.LTS"
    echo "  Linux: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
    exit 1
fi

echo "✓ Node.js: $(node --version)"
echo "✓ npm: $(npm --version)"

# 安装依赖
echo ""
echo "📦 安装依赖..."
cd "$(dirname "$0")/electron"
npm install

# 构建
echo ""
echo "🔨 构建安装包..."
case $PLATFORM in
    win)
        npm run electron:build -- --win
        ;;
    mac)
        npm run electron:build -- --mac
        ;;
    linux)
        npm run electron:build -- --linux
        ;;
    all)
        npm run electron:build -- --win --mac --linux
        ;;
    *)
        echo "未知平台: $PLATFORM"
        echo "可用选项: win, mac, linux, all"
        exit 1
        ;;
esac

echo ""
echo "=== 构建完成 ==="
echo "输出目录: electron/release/"
ls -la release/ 2>/dev/null || echo "请检查 release 目录"