# QRngViewer - 跨平台随机数发生器上位机

## 项目概述

一款用于连接和管理量子随机数发生器(QRNG)的跨平台桌面/移动应用。

## 技术栈

- **框架**: Tauri 2.0
- **前端**: React + TypeScript + Vite
- **后端**: Rust
- **图表**: Chart.js / ECharts
- **样式**: Tailwind CSS

## 功能模块

### 1. 通信模块
- Serial/USB 串口通信
- TCP/IP 网络连接
- Bluetooth 蓝牙连接

### 2. 连接管理
- 设备自动发现
- 自动重连机制
- 多设备同时连接

### 3. 数据处理
- 实时数据接收与显示
- 历史数据记录
- 统计分析(熵值、分布检验)

### 4. UI展示
- 数字仪表盘
- 实时波形图
- 统计分布直方图
- 位视图可视化

### 5. 设置与配置
- 波特率/校验位配置
- 通信协议配置
- 显示偏好设置

### 6. 数据导出
- CSV 格式导出
- JSON 格式导出
- 测试报告生成

## 支持平台

- ✅ Windows 10/11
- ✅ macOS 11+
- ✅ Android (APK)
- ✅ iOS (iPad/iPhone)
- ✅ 鸿蒙系统 (HarmonyOS)

## 构建命令

```bash
# 开发模式
npm run tauri dev

# 构建桌面端
npm run tauri build

# 构建移动端
npm run tauri build --target android
npm run tauri build --target ios
```