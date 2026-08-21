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

export default function WeightChart({ weights }: { weights: Weight[] }) {
  const [range, setRange] = useState<'all' | 'last30'>('all');

  const sorted = useMemo(
    () =>
      weights.slice().sort((a, b) => {
        if (a.date === b.date) {
          return 0;
        }
        return a.date < b.date ? -1 : 1;
      }),
    [weights]
  );

  const displayed = range === 'all' ? sorted : sorted.slice(Math.max(0, sorted.length - 30));
  const labels = displayed.map((s) => s.date);
  const data = displayed.map((s) => s.weight);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Weight (kg)',
        data,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)'
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
            Last 30 entries
          </button>
        </div>
      </div>
      <div style={{ width: '100%', height: 220 }}>
        <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </section>
  );
}
