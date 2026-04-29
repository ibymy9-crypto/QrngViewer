import { useState } from 'react';
import type { ConnectionConfig } from '../App';

interface SettingsPanelProps {
  config: ConnectionConfig;
  onSave: (config: ConnectionConfig) => void;
}

export default function SettingsPanel({ config, onSave }: SettingsPanelProps) {
  const [localConfig, setLocalConfig] = useState<ConnectionConfig>(config);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(localConfig);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 pb-16">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
        ⚙️ 设置
      </h2>

      {/* 通信设置 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-md font-semibold mb-4 text-gray-800 dark:text-white">
          📡 通信参数
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              波特率
            </label>
            <select
              value={localConfig.baudRate}
              onChange={(e) => setLocalConfig({ ...localConfig, baudRate: Number(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value={9600}>9600</option>
              <option value={19200}>19200</option>
              <option value={38400}>38400</option>
              <option value={57600}>57600</option>
              <option value={115200}>115200 (默认)</option>
              <option value={230400}>230400</option>
              <option value={460800}>460800</option>
              <option value={921600}>921600</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              数据位
            </label>
            <select
              value={localConfig.dataBits}
              onChange={(e) => setLocalConfig({ ...localConfig, dataBits: Number(e.target.value) as 5 | 6 | 7 | 8 })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value={5}>5 位</option>
              <option value={6}>6 位</option>
              <option value={7}>7 位</option>
              <option value={8}>8 位 (默认)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              停止位
            </label>
            <select
              value={localConfig.stopBits}
              onChange={(e) => setLocalConfig({ ...localConfig, stopBits: Number(e.target.value) as 1 | 2 })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value={1}>1 位 (默认)</option>
              <option value={2}>2 位</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              校验位
            </label>
            <select
              value={localConfig.parity}
              onChange={(e) => setLocalConfig({ ...localConfig, parity: e.target.value as ConnectionConfig['parity'] })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="none">无校验 (默认)</option>
              <option value="odd">奇校验</option>
              <option value="even">偶校验</option>
              <option value="mark">Mark 校验</option>
              <option value="space">Space 校验</option>
            </select>
          </div>
        </div>
      </div>

      {/* 显示设置 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-md font-semibold mb-4 text-gray-800 dark:text-white">
          🎨 显示设置
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-800 dark:text-white">深色模式</div>
              <div className="text-sm text-gray-500">切换深色/浅色主题</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-800 dark:text-white">自动滚动</div>
              <div className="text-sm text-gray-500">新数据自动滚动到视图</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-800 dark:text-white">显示时间戳</div>
              <div className="text-sm text-gray-500">在数据列表中显示时间</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 数据设置 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-md font-semibold mb-4 text-gray-800 dark:text-white">
          💾 数据设置
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              最大缓存数据量
            </label>
            <select className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
              <option value={1000}>1000 条 (默认)</option>
              <option value={5000}>5000 条</option>
              <option value={10000}>10000 条</option>
              <option value={50000}>50000 条</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              自动保存间隔
            </label>
            <select className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
              <option value={0}>不自动保存</option>
              <option value={60}>每 1 分钟</option>
              <option value={300}>每 5 分钟</option>
              <option value={600}>每 10 分钟</option>
            </select>
          </div>
        </div>
      </div>

      {/* 保存按钮 */}
      <div className="flex justify-end gap-2">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {saved ? '✓ 已保存' : '💾 保存设置'}
        </button>
      </div>
    </div>
  );
}