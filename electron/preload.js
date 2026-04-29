const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 获取版本
  getVersion: () => ipcRenderer.invoke('get-version'),
  
  // 最小化窗口
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  
  // 最大化窗口
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  
  // 关闭窗口
  closeWindow: () => ipcRenderer.send('window-close'),
  
  // 平台信息
  platform: process.platform,
  
  // 是否为打包后的应用
  isPackaged: process.env.NODE_ENV !== 'development'
});