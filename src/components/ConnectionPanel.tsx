import { useState } from 'react';
import type { ConnectionConfig } from '../App';

interface ConnectionPanelProps {
  isConnected: boolean;
  onConnect: (config: ConnectionConfig) => void;
  onDisconnect: () => void;
}

export default function ConnectionPanel({
  isConnected,
  onConnect,
  onDisconnect,
}: ConnectionPanelProps) {
  const [port, setPort] = useState('');
  const [baudRate, setBaudRate] = useState(115200);
  const [dataBits, setDataBits] = useState<5 | 6 | 7 | 8>(8);
  const [stopBits, setStopBits] = useState<1 | 2>(1);
  const [parity, setParity] = useState<'none' | 'odd' | 'even'>('none');

  const handleConnect = () => {
    onConnect({
      port,
      baudRate,
      dataBits,
      stopBits,
      parity,
    });
  };

  const commonPorts = [
    { value: 'COM1', label: 'COM1 (Windows)' },
    { value: '/dev/ttyUSB0', label: '/dev/ttyUSB0 (Linux)' },
    { value: '/dev/cu.usbserial-1410', label: '/dev/cu.usbserial (macOS)' },
    { value: 'SIMULATE', label: '🔄 模拟模式 (演示用)' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        🔌 连接设置
      </h2>

      <div className="space-y-4">
        {/* 端口选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            串口端口
          </label>
          <select
            value={port}
            onChange={(e) => setPort(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            disabled={isConnected}
          >
            <option value="">选择端口...</option>
            {commonPorts.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
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
            disabled={isConnected}
          >
            <option value={9600}>9600</option>
            <option value={19200}>19200</option>
            <option value={38400}>38400</option>
            <option value={57600}>57600</option>
            <option value={115200}>115200 (推荐)</option>
            <option value={230400}>230400</option>
            <option value={460800}>460800</option>
            <option value={921600}>921600</option>
          </select>
        </div>

        {/* 数据位 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            数据位
          </label>
          <select
            value={dataBits}
            onChange={(e) => setDataBits(Number(e.target.value) as 5 | 6 | 7 | 8)}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            disabled={isConnected}
          >
            <option value={5}>5 位</option>
            <option value={6}>6 位</option>
            <option value={7}>7 位</option>
            <option value={8}>8 位</option>
          </select>
        </div>

        {/* 停止位 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            停止位
          </label>
          <select
            value={stopBits}
            onChange={(e) => setStopBits(Number(e.target.value) as 1 | 2)}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            disabled={isConnected}
          >
            <option value={1}>1 位</option>
            <option value={2}>2 位</option>
          </select>
        </div>

        {/* 校验位 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            校验位
          </label>
          <select
            value={parity}
            onChange={(e) => setParity(e.target.value as 'none' | 'odd' | 'even')}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            disabled={isConnected}
          >
            <option value="none">无校验</option>
            <option value="odd">奇校验</option>
            <option value="even">偶校验</option>
          </select>
        </div>

        {/* 连接按钮 */}
        <div className="pt-4">
          {!isConnected ? (
            <button
              onClick={handleConnect}
              disabled={!port}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🔗 连接设备
            </button>
          ) : (
            <button
              onClick={onDisconnect}
              className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              ⏏️ 断开连接
            </button>
          )}
        </div>
      </div>
    </div>
  );
}