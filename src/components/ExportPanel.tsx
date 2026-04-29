interface ExportPanelProps {
  dataCount: number;
  onExport: (format: 'csv' | 'json') => void;
}

export default function ExportPanel({ dataCount, onExport }: ExportPanelProps) {
  return (
    <div className="space-y-6 pb-16">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
        💾 数据导出
      </h2>

      {/* 导出概览 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-md font-semibold text-gray-800 dark:text-white">
              可导出数据
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              当前缓冲区共有 {dataCount} 条随机数数据
            </p>
          </div>
          <div className="text-3xl font-bold text-blue-600">{dataCount}</div>
        </div>

        {dataCount === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>暂无数据可导出</p>
            <p className="text-sm mt-2">请先连接设备并接收数据</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CSV 导出 */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors cursor-pointer"
                 onClick={() => onExport('csv')}>
              <div className="text-4xl mb-3">📄</div>
              <h4 className="font-semibold text-gray-800 dark:text-white">CSV 格式</h4>
              <p className="text-sm text-gray-500 mt-2">
                通用表格格式<br/>
                可用 Excel 打开<br/>
                <span className="font-mono text-xs">约 {(dataCount * 50 / 1024).toFixed(1)} KB</span>
              </p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                导出 CSV
              </button>
            </div>

            {/* JSON 导出 */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900 transition-colors cursor-pointer"
                 onClick={() => onExport('json')}>
              <div className="text-4xl mb-3">📋</div>
              <h4 className="font-semibold text-gray-800 dark:text-white">JSON 格式</h4>
              <p className="text-sm text-gray-500 mt-2">
                结构化数据格式<br/>
                便于程序处理<br/>
                <span className="font-mono text-xs">约 {(dataCount * 80 / 1024).toFixed(1)} KB</span>
              </p>
              <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                导出 JSON
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 导出说明 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-md font-semibold mb-4 text-gray-800 dark:text-white">
          📖 导出说明
        </h3>
        
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-start gap-2">
            <span className="text-blue-500">✓</span>
            <span>CSV 格式包含表头: timestamp, value, hex, binary</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500">✓</span>
            <span>JSON 格式为数组结构，每条记录包含完整元数据</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500">✓</span>
            <span>文件名将自动添加时间戳，避免覆盖</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500">✓</span>
            <span>导出路径为浏览器默认下载目录</span>
          </div>
        </div>
      </div>

      {/* 快速统计导出 */}
      {dataCount > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-md font-semibold mb-4 text-gray-800 dark:text-white">
            📊 快速统计报告
          </h3>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <pre className="whitespace-pre-wrap">{`QRngViewer 数据统计报告
========================
生成时间: ${new Date().toLocaleString()}
数据总量: ${dataCount} 字节
预计大小: CSV约${(dataCount * 50 / 1024).toFixed(1)}KB / JSON约${(dataCount * 80 / 1024).toFixed(1)}KB

提示: 点击上方按钮导出完整数据`}</pre>
          </div>
        </div>
      )}
    </div>
  );
}