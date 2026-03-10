import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const OrderGraph = ({ dailyRevenue = [], monthlyRevenue = 0, totalRevenue = 0 }) => {
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('30days');

  // Prepare chart data
  const prepareChartData = () => {
    if (!dailyRevenue || dailyRevenue.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    // Format dates and prepare data
    const labels = dailyRevenue.map(day => {
      const date = new Date(day._id.year, day._id.month - 1, day._id.day);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const data = dailyRevenue.map(day => day.total);

    return {
      labels,
      datasets: [
        {
          label: 'Daily Revenue (৳)',
          data,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: chartType === 'line' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.8)',
          borderWidth: 2,
          fill: chartType === 'line',
          tension: 0.4,
        }
      ]
    };
  };

  const chartData = prepareChartData();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgb(156, 163, 175)',
        }
      },
      title: {
        display: true,
        text: 'Order Revenue Trend',
        color: 'rgb(243, 244, 246)',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39)',
        titleColor: 'rgb(243, 244, 246)',
        bodyColor: 'rgb(156, 163, 175)',
        borderColor: 'rgb(75, 85, 99)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `Revenue: ৳${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          callback: function(value) {
            return '৳' + value.toLocaleString();
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Revenue Analytics</h3>
          <div className="flex space-x-4 text-sm">
            <div className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">Total Revenue:</span> ৳{totalRevenue.toLocaleString()}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">This Month:</span> ৳{monthlyRevenue.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
          </select>
        </div>
      </div>

      <div className="h-80">
        {chartData.labels.length > 0 ? (
          <div>
            {(() => {
              try {
                return chartType === 'line' ? (
                  <Line data={chartData} options={options} />
                ) : (
                  <Bar data={chartData} options={options} />
                );
              } catch (error) {
                console.error('Chart rendering error:', error);
                return (
                  <div className="flex items-center justify-center h-full text-red-500 dark:text-red-400">
                    <div className="text-center">
                      <div className="text-4xl mb-2">⚠️</div>
                      <p>Chart rendering error</p>
                      <p className="text-sm">Please refresh the page</p>
                    </div>
                  </div>
                );
              }
            })()}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p>No revenue data available</p>
              <p className="text-sm">Revenue data will appear here once orders are processed</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderGraph;