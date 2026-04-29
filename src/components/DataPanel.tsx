import { useState } from 'react';
import type { QRngData } from '../App';

interface DataPanelProps {
  data: QRngData[];
  onClear: () => void;
}

export default function DataPanel({ data, onClear }: DataPanelProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const latestData = data.slice(-100).reverse();

  // 处理清空数据确认
  const handleClearClick = () => {
    if (data.length === 0) {
      alert('当前没有数据，无需清空');
      return;
    }
    setShowConfirm(true);
  };

  // 确认清空
  const handleConfirmClear = () => {
    onClear();
    setShowConfirm(false);
    // 刷新页面
    window.location.reload();
  };

  // 取消清空
  const handleCancelClear = () => {
    setShowConfirm(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 操作栏 */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          📋 数据列表 (最新100条)
        </h2>
        <button
          onClick={handleClearClick}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          🗑️ 清空数据
        </button>
      </div>

      {/* 确认弹框 */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              ⚠️ 确认清空
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              确定要清空所有数据吗？
              <br />
              <span className="font-semibold">当前数据量: {data.length} 条</span>
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleCancelClear}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300"
              >
                取消
              </button>
              <button
                onClick={handleConfirmClear}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                确认清空
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 数据表格 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                  序号
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                  时间戳
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                  十进制
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                  十六进制
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                  二进制
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {latestData.map((item, index) => (
                <tr key={item.timestamp} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                    {data.length - index}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 font-mono">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800 dark:text-white font-mono">
                    {item.value}
                  </td>
                  <td className="px-4 py-2 text-sm text-blue-600 font-mono">
                    0x{item.hex}
                  </td>
                  <td className="px-4 py-2 text-sm text-green-600 font-mono">
                    {item.binary}
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    暂无数据，请连接设备并开始接收
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 数据统计 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-md font-semibold mb-4 text-gray-800 dark:text-white">
          📊 数据概览
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{data.length}</div>
            <div className="text-sm text-gray-500">总字节数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{data.length * 8}</div>
            <div className="text-sm text-gray-500">总位数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {data.length > 0 ? (data.reduce((sum, d) => sum + d.value, 0) / data.length).toFixed(1) : 0}
            </div>
            <div className="text-sm text-gray-500">平均值</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {data.length > 0 ? Math.max(...data.map(d => d.value)) : 0}
            </div>
            <div className="text-sm text-gray-500">最大值</div>
          </div>
        </div>
      </div>
    </div>
  );
}