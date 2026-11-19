// src/pages/VisitorDashboard.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function VisitorDashboard() {
  const [stats, setStats] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchStats = async (y = year) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL || ''}/api/visitors/stats`,
        { params: { year: y, period: 'year' } }
      );
      setStats(res.data);
    } catch (e) {
      console.error('Failed to load visitor stats', e);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [year]);

  if (!stats) return <p>Loading…</p>;

  const chartData = {
    labels: stats.yearDays.map((d) => d.label),
    datasets: [
      {
        label: 'Visitors',
        data: stats.yearDays.map((d) => d.visitors),
        backgroundColor: 'rgba(217,119,6,.82)',
        borderColor: '#d97706',
        borderWidth: 1,
        borderRadius: 6,
        maxBarThickness: 34,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1, precision: 0 } },
      x: {
        grid: { display: false },
        ticks: {
          autoSkip: false,
          maxTicksLimit: 12,
          font: { size: window.innerWidth < 600 ? 9 : 12 },
          padding: 5,
        },
      },
    },
  };

  return (
    <section className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">
        Website Visitors – {year}
      </h2>

      {/* Summary cards */}
      <div className="grid md:grid-cols-5 gap-4 mb-6">
        {stats.summaryCards.map((c, i) => (
          <div
            key={i}
            className="flex items-center p-3 bg-white rounded shadow"
          >
            <i
              className={`fa-solid ${i === 0 ? 'fa-users' : 'fa-calendar-days'} text-amber-600 mr-3`}
            ></i>
            <div>
              <p className="text-gray-500 text-sm">{c.label}</p>
              <strong className="text-xl">{c.count}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="h-80 bg-white rounded shadow p-4">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Year selector */}
      <div className="mt-4 flex items-center">
        <label className="mr-2">Year:</label>
        <input
          type="number"
          min="1900"
          max="2100"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border rounded px-2 py-1 w-24"
        />
      </div>
    </section>
  );
}
