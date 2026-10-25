import React, { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import type { Weight } from '../App';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const formatDate = (date: Date) => date.toISOString().slice(0, 10);

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
};

export default function WeightChart({ weights }: { weights: Weight[] }) {
  const [range, setRange] = useState<'all' | 'last30'>('all');

  const calendarData = useMemo(() => {
    if (weights.length === 0) {
      return [];
    }

    const weightsByDate = new Map(weights.map((entry) => [entry.date, entry.weight]));
    const firstRecordedDate = weights.map((entry) => entry.date).sort()[0];
    const firstDate = new Date(`${firstRecordedDate}T00:00:00.000Z`);
    const today = new Date();
    const lastDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
    const days: { date: string; weight: number; movingAverage: number }[] = [];
    let mostRecentWeight: number | undefined;

    for (let date = firstDate; date <= lastDate; date = addDays(date, 1)) {
      const label = formatDate(date);
      const recordedWeight = weightsByDate.get(label);

      if (recordedWeight !== undefined) {
        mostRecentWeight = recordedWeight;
      }

      if (mostRecentWeight === undefined) {
        continue;
      }

      days.push({ date: label, weight: mostRecentWeight, movingAverage: 0 });
    }

    return days.map((day, index) => {
      const windowStart = Math.max(0, index - 6);
      const window = days.slice(windowStart, index + 1);
      return {
        ...day,
        movingAverage: window.reduce((sum, entry) => sum + entry.weight, 0) / window.length
      };
    });
  }, [weights]);

  const displayed = range === 'all' ? calendarData : calendarData.slice(-30);
  const labels = displayed.map((day) => day.date);
  const data = displayed.map((day) => day.weight);
  const movingAverage = displayed.map((day) => day.movingAverage);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Weight (kg)',
        data,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 1.5,
        pointRadius: 2,
        tension: 0.15
      },
      {
        label: '7-day moving average',
        data: movingAverage,
        borderColor: '#dc2626',
        backgroundColor: '#dc2626',
        borderWidth: 3,
        pointRadius: 0,
        tension: 0.35
      }
    ]
  };

  return (
    <section className="chart">
      <div className="chart-head">
        <h2>Trend</h2>
        <div className="chart-toggle" role="group" aria-label="Trendline range">
          <button
            type="button"
            className={range === 'all' ? 'active' : ''}
            onClick={() => setRange('all')}
          >
            All entries
          </button>
          <button
            type="button"
            className={range === 'last30' ? 'active' : ''}
            onClick={() => setRange('last30')}
          >
            Last 30 days
          </button>
        </div>
      </div>
      <div style={{ width: '100%', height: 220 }}>
        <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </section>
  );
}
