import React from 'react';
import type { Weight } from '../App';

export default function WeightList({ weights }: { weights: Weight[] }) {
  return (
    <section className="list">
      <h2>Previous entries</h2>
      <div className="table">
        <div className="row header">
          <div>Date</div>
          <div>Weight (kg)</div>
        </div>
        {weights.slice().reverse().map((w) => (
          <div className="row" key={w.date}>
            <div>{w.date}</div>
            <div>{w.weight.toFixed(1)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
