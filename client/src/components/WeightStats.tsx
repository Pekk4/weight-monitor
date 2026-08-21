import React from 'react';
import type { Weight } from '../App';

type StatsValue = number | null;

function getLastEntries(weights: Weight[], count: number): Weight[] {
  return weights
    .slice()
    .sort((a, b) => {
      if (a.date === b.date) {
        return 0;
      }
      return a.date < b.date ? 1 : -1;
    })
    .slice(0, count);
}

function getHighLow(weights: Weight[]): { high: StatsValue; low: StatsValue } {
  if (weights.length === 0) {
    return { high: null, low: null };
  }

  const values = weights.map((entry) => entry.weight);
  return {
    high: Math.max(...values),
    low: Math.min(...values)
  };
}

function formatWeight(value: StatsValue): string {
  return value === null ? '-' : `${value.toFixed(1)} kg`;
}

export default function WeightStats({ weights }: { weights: Weight[] }) {
  const allTime = getHighLow(weights);
  const last30Entries = getHighLow(getLastEntries(weights, 30));

  return (
    <section className="stats">
      <h2>Stats</h2>
      <div className="stats-grid">
        <article className="stats-item">
          <h3>All time high</h3>
          <p>{formatWeight(allTime.high)}</p>
        </article>
        <article className="stats-item">
          <h3>All time low</h3>
          <p>{formatWeight(allTime.low)}</p>
        </article>
        <article className="stats-item">
          <h3>Last 30 entries high</h3>
          <p>{formatWeight(last30Entries.high)}</p>
        </article>
        <article className="stats-item">
          <h3>Last 30 entries low</h3>
          <p>{formatWeight(last30Entries.low)}</p>
        </article>
      </div>
    </section>
  );
}