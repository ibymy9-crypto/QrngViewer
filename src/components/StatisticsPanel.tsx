import { useMemo } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { QRngData } from '../App';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface StatisticsPanelProps {
  statistics: {
    totalCount: number;
    onesCount: number;
    zerosCount: number;
    entropy: number;
  };
  data: QRngData[];
}

export default function StatisticsPanel({ statistics, data }: StatisticsPanelProps) {
  // 计算字节值分布
  const byteDistribution = useMemo(() => {
    const dist = new Array(256).fill(0);
    data.forEach(item => {
      dist[item.value]++;
    });
    return dist;
  }, [data]);

  // 位分布 (每位的0/1统计)
  const bitPositionStats = useMemo(() => {
    const stats = Array(8).fill(0).map(() => ({ ones: 0, zeros: 0 }));
    data.forEach(item => {
      const bits = item.binary.split('');
      bits.forEach((bit, pos) => {
        if (bit === '1') stats[pos].ones++;
        else stats[pos].zeros++;
      });
    });
    return stats;
  }, [data]);

  // 字节分布图表数据
  const byteChartData = {
    labels: Array(16).fill(0).map((_, i) => i.toString(16).toUpperCase()),
    datasets: [
      {
        label: '字节值分布',
        data: Array(16).fill(0).map((_, i) => 
          byteDistribution.slice(i * 16, (i + 1) * 16).reduce((a, b) => a + b, 0)
        ),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  // 0/1分布环形图
  const bitDistChartData = {
    labels: ['0 位', '1 位'],
    datasets: [
      {
        data: [statistics.zerosCount, statistics.onesCount],
        backgroundColor: [
          'rgba(156, 163, 175, 0.8)',
          'rgba(59, 130, 246, 0.8)',
        ],
        borderColor: [
          'rgb(156, 163, 175)',
          'rgb(59, 130, 246)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // 每位分布图表数据
  const positionChartData = {
    labels: ['Bit7', 'Bit6', 'Bit5', 'Bit4', 'Bit3', 'Bit2', 'Bit1', 'Bit0'],
    datasets: [
      {
        label: '1 的数量',
        data: bitPositionStats.map(s => s.ones),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
      {
        label: '0 的数量',
        data: bitPositionStats.map(s => s.zeros),
        backgroundColor: 'rgba(156, 163, 175, 0.8)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  // 计算卡方检验
  const chiSquareTest = useMemo(() => {
    if (data.length === 0) return null;
    const expected = (statistics.zerosCount + statistics.onesCount) / 2;
    const observed = [statistics.zerosCount, statistics.onesCount];
    const chiSquare = observed.reduce((sum, val) => sum + Math.pow(val - expected, 2) / expected, 0);
    return {
      value: chiSquare,
      degrees: 1,
      pValue: chiSquare > 3.841 ? '不合格' : '合格',
    };
  }, [data, statistics]);

  return (
    <div className="space-y-6 pb-16">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
        📈 统计分析
      </h2>

      {/* 核心指标 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-500 mb-2">总数据量</div>
          <div className="text-2xl font-bold text-blue-600">{statistics.totalCount}</div>
          <div className="text-sm text-gray-500">字节</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-500 mb-2">1 位数量</div>
          <div className="text-2xl font-bold text-green-600">{statistics.onesCount}</div>
          <div className="text-sm text-gray-500">位</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-500 mb-2">0 位数量</div>
          <div className="text-2xl font-bold text-gray-600">{statistics.zerosCount}</div>
          <div className="text-sm text-gray-500">位</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-500 mb-2">香农熵</div>
          <div className="text-2xl font-bold text-purple-600">
            {(statistics.entropy * 100).toFixed(2)}%
          </div>
          <div className="text-sm text-gray-500">
            {statistics.entropy > 0.9 ? '✓ 优秀' : statistics.entropy > 0.7 ? '⚠ 良好' : '✗ 不足'}
          </div>
        </div>
      </div>

      {/* 0/1分布图 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-md font-semibold mb-4 text-gray-800 dark:text-white">
            🔵 0/1 位分布
          </h3>
          <div className="h-48">
            <Doughnut data={bitDistChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-md font-semibold mb-4 text-gray-800 dark:text-white">
            📊 各位点分布
          </h3>
          <div className="h-48">
            <Bar data={positionChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* 字节值分布 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-md font-semibold mb-4 text-gray-800 dark:text-white">
          📈 字节值分布 (16进制区间)
        </h3>
        <div className="h-48">
          <Bar data={byteChartData} options={chartOptions} />
        </div>
      </div>

      {/* 统计检验 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-md font-semibold mb-4 text-gray-800 dark:text-white">
          🔬 随机性检验
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-gray-500 mb-1">卡方检验</div>
            <div className="text-xl font-bold text-gray-800 dark:text-white">
              {chiSquareTest?.value.toFixed(4) || '--'}
            </div>
            <div className="text-sm text-gray-500">
              临界值: 3.841 (α=0.05)
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-gray-500 mb-1">1/0 比率</div>
            <div className="text-xl font-bold text-gray-800 dark:text-white">
              {statistics.zerosCount > 0 
                ? (statistics.onesCount / statistics.zerosCount).toFixed(4)
                : '--'}
            </div>
            <div className="text-sm text-gray-500">
              理想值: 1.0
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-gray-500 mb-1">检验结论</div>
            <div className={`text-xl font-bold ${
              chiSquareTest?.pValue === '合格' ? 'text-green-600' : 'text-red-600'
            }`}>
              {chiSquareTest?.pValue || '数据不足'}
            </div>
            <div className="text-sm text-gray-500">
              {chiSquareTest?.pValue === '合格' ? '✓ 通过随机性检验' : '⚠ 需更多数据'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}