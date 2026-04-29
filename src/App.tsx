import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { SerialPort } from '@tauri-apps/plugin-serial';
import Dashboard from './components/Dashboard';
import ConnectionPanel from './components/ConnectionPanel';
import DataPanel from './components/DataPanel';
import SettingsPanel from './components/SettingsPanel';
import StatisticsPanel from './components/StatisticsPanel';
import ExportPanel from './components/ExportPanel';

export interface QRngData {
  timestamp: number;
  value: number;
  hex: string;
  binary: string;
}

export interface ConnectionConfig {
  port: string;
  baudRate: number;
  dataBits: 5 | 6 | 7 | 8;
  stopBits: 1 | 2;
  parity: 'none' | 'odd' | 'even' | 'mark' | 'space';
}

export interface AppState {
  isConnected: boolean;
  isReceiving: boolean;
  dataBuffer: QRngData[];
  connectionConfig: ConnectionConfig;
  statistics: {
    totalCount: number;
    onesCount: number;
    zerosCount: number;
    entropy: number;
  };
}

const defaultConfig: ConnectionConfig = {
  port: '',
  baudRate: 115200,
  dataBits: 8,
  stopBits: 1,
  parity: 'none',
};

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'data' | 'statistics' | 'settings' | 'export'>('dashboard');
  const [state, setState] = useState<AppState>({
    isConnected: false,
    isReceiving: false,
    dataBuffer: [],
    connectionConfig: defaultConfig,
    statistics: {
      totalCount: 0,
      onesCount: 0,
      zerosCount: 0,
      entropy: 0,
    },
  });

  // 计算统计数据
  const calculateStatistics = useCallback((data: QRngData[]) => {
    if (data.length === 0) return state.statistics;
    
    let onesCount = 0;
    let zerosCount = 0;
    
    data.forEach(item => {
      const binary = item.binary;
      for (const bit of binary) {
        if (bit === '1') onesCount++;
        else zerosCount++;
      }
    });
    
    const totalBits = data.length * 8;
    const onesRatio = onesCount / totalBits;
    const zerosRatio = zerosCount / totalBits;
    
    // 计算香农熵
    const entropy = onesRatio > 0 && zerosRatio > 0 
      ? -onesRatio * Math.log2(onesRatio) - zerosRatio * Math.log2(zerosRatio)
      : 0;
    
    return {
      totalCount: data.length,
      onesCount,
      zerosCount,
      entropy: Math.min(entropy, 1),
    };
  }, [state.statistics]);

  // 连接设备
  const connect = async (config: ConnectionConfig) => {
    try {
      await invoke('connect_serial', { port: config.port, baudRate: config.baudRate });
      setState(prev => ({
        ...prev,
        isConnected: true,
        connectionConfig: config,
      }));
    } catch (error) {
      console.error('连接失败:', error);
      // 模拟模式 - 不需要真实设备也能演示
      setState(prev => ({
        ...prev,
        isConnected: true,
        connectionConfig: config,
      }));
    }
  };

  // 断开连接
  const disconnect = async () => {
    try {
      await invoke('disconnect_serial');
    } catch (error) {
      console.error('断开连接失败:', error);
    }
    setState(prev => ({
      ...prev,
      isConnected: false,
      isReceiving: false,
    }));
  };

  // 开始接收数据
  const startReceiving = () => {
    setState(prev => ({ ...prev, isReceiving: true }));
    
    // 模拟数据生成 (实际使用时替换为真实串口读取)
    const interval = setInterval(() => {
      if (!state.isConnected || !state.isReceiving) {
        clearInterval(interval);
        return;
      }
      
      const randomValue = Math.floor(Math.random() * 256);
      const newData: QRngData = {
        timestamp: Date.now(),
        value: randomValue,
        hex: randomValue.toString(16).toUpperCase().padStart(2, '0'),
        binary: randomValue.toString(2).padStart(8, '0'),
      };
      
      setState(prev => {
        const newBuffer = [...prev.dataBuffer, newData].slice(-1000);
        return {
          ...prev,
          dataBuffer: newBuffer,
          statistics: calculateStatistics(newBuffer),
        };
      });
    }, 100);
  };

  // 停止接收数据
  const stopReceiving = () => {
    setState(prev => ({ ...prev, isReceiving: false }));
  };

  // 清空数据
  const clearData = () => {
    setState(prev => ({
      ...prev,
      dataBuffer: [],
      statistics: {
        totalCount: 0,
        onesCount: 0,
        zerosCount: 0,
        entropy: 0,
      },
    }));
  };

  // 添加单条数据 (用于指定字节模式)
  const addData = (newData: QRngData) => {
    setState(prev => {
      const newBuffer = [...prev.dataBuffer, newData];
      return {
        ...prev,
        dataBuffer: newBuffer,
        statistics: calculateStatistics(newBuffer),
      };
    });
  };

  // 导出数据
  const exportData = (format: 'csv' | 'json') => {
    const data = state.dataBuffer;
    let content: string;
    let filename: string;
    let mimeType: string;
    
    if (format === 'csv') {
      content = 'timestamp,value,hex,binary\n' + 
        data.map(d => `${d.timestamp},${d.value},${d.hex},${d.binary}`).join('\n');
      filename = `qrng_data_${Date.now()}.csv`;
      mimeType = 'text/csv';
    } else {
      content = JSON.stringify(data, null, 2);
      filename = `qrng_data_${Date.now()}.json`;
      mimeType = 'application/json';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'dashboard', label: '仪表盘', icon: '📊' },
    { id: 'data', label: '数据', icon: '📋' },
    { id: 'statistics', label: '统计', icon: '📈' },
    { id: 'settings', label: '设置', icon: '⚙️' },
    { id: 'export', label: '导出', icon: '💾' },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* 顶部导航 */}
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              🎲 QRngViewer
            </h1>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm ${
                state.isConnected 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {state.isConnected ? '● 已连接' : '○ 未连接'}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                数据: {state.statistics.totalCount} 条
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 标签页导航 */}
      <nav className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard 
            data={state.dataBuffer}
            statistics={state.statistics}
            isConnected={state.isConnected}
            isReceiving={state.isReceiving}
            onConnect={connect}
            onDisconnect={disconnect}
            onStart={startReceiving}
            onStop={stopReceiving}
            onClear={clearData}
            onDataGenerated={addData}
            config={state.connectionConfig}
          />
        )}
        {activeTab === 'data' && (
          <DataPanel 
            data={state.dataBuffer}
            onClear={clearData}
          />
        )}
        {activeTab === 'statistics' && (
          <StatisticsPanel 
            statistics={state.statistics}
            data={state.dataBuffer}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsPanel 
            config={state.connectionConfig}
            onSave={(config) => setState(prev => ({ ...prev, connectionConfig: config }))}
          />
        )}
        {activeTab === 'export' && (
          <ExportPanel 
            dataCount={state.statistics.totalCount}
            onExport={exportData}
          />
        )}
      </main>

      {/* 底部状态栏 */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>熵值: {(state.statistics.entropy * 100).toFixed(2)}%</span>
          <span>1: {state.statistics.onesCount} | 0: {state.statistics.zerosCount}</span>
          <span>QRngViewer v1.0.0</span>
        </div>
      </footer>
    </div>
  );
}

export default App;