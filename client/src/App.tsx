import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WeightForm from './components/WeightForm';
import WeightList from './components/WeightList';
import WeightChart from './components/WeightChart';

export type Weight = { date: string; weight: number; waist?: number; created_at?: string };

function App() {
  const [weights, setWeights] = useState<Weight[]>([]);

  const load = async () => {
    const res = await axios.get<Weight[]>('/api/weights');
    setWeights(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (date: string | undefined, weight: number, waist?: number) => {
    await axios.post('/api/weights', { date, weight, waist });
    await load();
  };

  return (
    <div className="app">
      <header className="topbar">
        <h1>Weight Monitor</h1>
      </header>
      <main>
        <WeightForm onSave={handleSave} />
        <WeightChart weights={weights} />
        <WeightList weights={weights} />
      </main>
    </div>
  );
}

export default App;
