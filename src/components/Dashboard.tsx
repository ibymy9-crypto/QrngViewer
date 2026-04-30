import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { QRngData, ConnectionConfig } from '../App';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardProps {
  data: QRngData[];
  statistics: {
    totalCount: number;
    onesCount: number;
    zerosCount: number;
    entropy: number;
  };
  isConnected: boolean;
  isReceiving: boolean;
  onConnect: (config: ConnectionConfig) => void;
  onDisconnect: () => void;
  onStart: () => void;
  onStop: () => void;
  onClear: () => void;
  onDataGenerated: (data: QRngData) => void;
  config: ConnectionConfig;
}

export default function Dashboard({
  data,
  statistics,
  isConnected,
  isReceiving,
  onConnect,
  onDisconnect,
  onStart,
  onStop,
  onClear,
  onDataGenerated,
  config,
}: DashboardProps) {
  const [port, setPort] = useState('COM1');
  const [baudRate, setBaudRate] = useState(115200);
  const [targetBytes, setTargetBytes] = useState(100);
  const [isFixedMode, setIsFixedMode] = useState(false);
  const [isFixedPaused, setIsFixedPaused] = useState(false);
  const [fixedProgress, setFixedProgress] = useState({ current: 0, target: 0 });
  const fixedIntervalRef = useRef<number | null>(null);

  // 判断按钮是否应该禁用
  const isStartDisabled = isFixedMode;
  const isFixedDisabled = isReceiving;

  // 生成随机数据
  const generateRandomData = useCallback((): QRngData => {
    const value = Math.floor(Math.random() * 256);
    return {
      timestamp: Date.now(),
      value,
      hex: value.toString(16).toUpperCase().padStart(2, '0'),
      binary: value.toString(2).padStart(8, '0'),
    };
  }, []);

  // 启动指定字节模式
  const startFixedMode = useCallback(() => {
    // 如果已在指定模式中，点击按钮为暂停/继续
    if (isFixedMode) {
      if (isFixedPaused) {
        // 继续生成
        setIsFixedPaused(false);
        fixedIntervalRef.current = setInterval(() => {
          setFixedProgress(prev => {
            if (prev.current >= prev.target) {
              stopFixedMode();
              return prev;
            }
            const newData = generateRandomData();
            onDataGenerated(newData);
            return { ...prev, current: prev.current + 1 };
          });
        }, 10);
      } else {
        // 暂停生成
        setIsFixedPaused(true);
        if (fixedIntervalRef.current) {
          clearInterval(fixedIntervalRef.current);
          fixedIntervalRef.current = null;
        }
      }
      return;
    }
    
    // 首次启动指定模式
    if (targetBytes < 1 || targetBytes > 10000) {
      alert('请输入1-10000之间的字节数');
      return;
    }
    
    // 停止连续接收
    if (isReceiving) {
      onStop();
    }
    
    // 清空数据
    onClear();
    
    setIsFixedMode(true);
    setIsFixedPaused(false);
    setFixedProgress({ current: 0, target: targetBytes });
    
    // 快速生成 (10ms间隔)
    fixedIntervalRef.current = setInterval(() => {
      setFixedProgress(prev => {
        if (prev.current >= prev.target) {
          stopFixedMode();
          return prev;
        }
        const newData = generateRandomData();
        onDataGenerated(newData);
        return { ...prev, current: prev.current + 1 };
      });
    }, 10);
  }, [targetBytes, isReceiving, isFixedMode, isFixedPaused, onStop, onClear, onDataGenerated, generateRandomData]);

  // 停止指定字节模式
  const stopFixedMode = useCallback(() => {
    if (fixedIntervalRef.current) {
      clearInterval(fixedIntervalRef.current);
      fixedIntervalRef.current = null;
    }
    setIsFixedMode(false);
    setIsFixedPaused(false);
    setFixedProgress({ current: 0, target: 0 });
  }, []);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (fixedIntervalRef.current) {
        clearInterval(fixedIntervalRef.current);
      }
    };
  }, []);

  // 波形图数据
  const chartData = {
    labels: data.slice(-50).map((_, i) => i.toString()),
    datasets: [
      {
        label: '随机数值',
        data: data.slice(-50).map(d => d.value),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    scales: {
      y: {
        min: 0,
        max: 255,
      },
    },
  };

  // 最新数据展示
  const latestData = data[data.length - 1];

  return (
    <div className="space-y-6 pb-16">
      {/* 连接控制面板 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          🔌 连接控制
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 端口选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              串口
            </label>
            <select
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="COM1">COM1 (Windows)</option>
              <option value="/dev/ttyUSB0">/dev/ttyUSB0 (Linux)</option>
              <option value="/dev/cu.usbserial">/dev/cu.usbserial (macOS)</option>
              <option value="SIMULATE">🔄 模拟模式</option>
            </select>
          </div>
          
          {/* 波特率 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              波特率
            </label>
            <select
              value={baudRate}
              onChange={(e) => setBaudRate(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value={9600}>9600</option>
              <option value={19200}>19200</option>
              <option value={38400}>38400</option>
              <option value={57600}>57600</option>
              <option value={115200}>115200</option>
              <option value={230400}>230400</option>
              <option value={460800}>460800</option>
              <option value={921600}>921600</option>
            </select>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex items-end gap-2">
            {!isConnected ? (
              <button
                onClick={() => onConnect({ ...config, port, baudRate })}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                🔗 连接
              </button>
            ) : (
              <button
                onClick={onDisconnect}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                ⏏️ 断开
              </button>
            )}
          </div>
        </div>

        {/* 数据控制 */}
        <div className="mt-4 flex gap-2 flex-wrap items-center">
          {isConnected && (
            <>
              {/* 开始接收按钮 */}
              {!isFixedMode ? (
                <button
                  onClick={onStart}
                  disabled={isStartDisabled}
                  className={`px-4 py-2 rounded-lg text-white transition-colors ${
                    isStartDisabled
                      ? 'bg-blue-400 opacity-50 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isReceiving ? '⏸️ 暂停' : '▶️ 开始接收'}
                </button>
              ) : (
                <button
                  onClick={onStop}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  ⏸️ 暂停
                </button>
              )}
              
              {/* 指定字节数输出 */}
              <div className="flex items-center gap-2 ml-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  指定字节数:
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={targetBytes}
                  onChange={(e) => setTargetBytes(Math.max(1, Math.min(10000, parseInt(e.target.value) || 1)))}
                  className="w-24 px-3 py-2 border rounded-lg text-center dark:bg-gray-700 dark:border-gray-600"
                  disabled={isFixedMode && !isFixedPaused}
                />
                <button
                  onClick={startFixedMode}
                  disabled={isFixedDisabled}
                  className={`px-4 py-2 rounded-lg text-white transition-colors ${
                    isFixedDisabled
                      ? 'bg-purple-400 opacity-50 cursor-not-allowed'
                      : isFixedMode
                        ? (isFixedPaused ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700')
                        : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {isFixedMode ? (isFixedPaused ? '▶️ 继续' : '⏸️ 暂停') : '🎯 指定输出'}
                </button>
                {isFixedMode && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    已生成: {fixedProgress.current}/{fixedProgress.target} 字节
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 实时数据仪表盘 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 数值显示 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            最新值
          </h3>
          <div className="text-3xl font-bold text-blue-600">
            {latestData?.value ?? '--'}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            HEX: {latestData?.hex ?? '--'}
          </div>
        </div>

        {/* 二进制显示 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            二进制
          </h3>
          <div className="font-mono text-lg text-green-600 break-all">
            {latestData?.binary ?? '--------'}
          </div>
        </div>

        {/* 熵值显示 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            熵值
          </h3>
          <div className="text-3xl font-bold text-purple-600">
            {(statistics.entropy * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {statistics.entropy > 0.9 ? '✓ 优质' : '⚠ 需检测'}
          </div>
        </div>

        {/* 数据计数 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            数据量
          </h3>
          <div className="text-3xl font-bold text-orange-600">
            {statistics.totalCount}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            字节
          </div>
        </div>
      </div>

      {/* 波形图 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          📈 实时波形
        </h3>
        <div className="h-64">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* 位视图可视化 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          🔲 位视图 (最新32字节)
        </h3>
        <div className="grid grid-cols-8 gap-1">
          {data.slice(-32).map((item, i) => (
            <div key={i} className="aspect-square flex items-center justify-center">
              <div className="w-full h-full grid grid-cols-4 gap-0.5">
                {item.binary.split('').map((bit, j) => (
                  <div
                    key={j}
                    className={`rounded-sm ${
                      bit === '1'
                        ? 'bg-blue-500'
                        : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
            1 位
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-200 dark:bg-gray-600 rounded-sm"></div>
            0 位
          </span>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect, useCallback } from 'react';