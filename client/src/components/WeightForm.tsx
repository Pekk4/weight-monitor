import React, { useState } from 'react';
import dayjs from 'dayjs';

type Props = { onSave: (date: string | undefined, weight: number, waist?: number) => Promise<void> };

export default function WeightForm({ onSave }: Props) {
  const [weightText, setWeightText] = useState<string>('');
  const [waistText, setWaistText] = useState<string>('');
  const [date, setDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weightText);
    if (Number.isNaN(w)) return;
    const waist = parseFloat(waistText);
    setSaving(true);
    try {
      await onSave(date, w, !Number.isNaN(waist) ? waist : undefined);
      setWeightText('');
      setWaistText('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="weight-form" onSubmit={submit}>
      <div className="row">
        <label htmlFor="date">Date</label>
        <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="row">
        <label htmlFor="weight">Weight</label>
        <input
          id="weight"
          type="number"
          step="0.1"
          inputMode="decimal"
          placeholder="kg"
          value={weightText}
          onChange={(e) => setWeightText(e.target.value)}
        />
      </div>

      <div className="row">
        <label htmlFor="waist">Waist</label>
        <input
          id="waist"
          type="number"
          step="0.1"
          inputMode="decimal"
          placeholder="cm"
          value={waistText}
          onChange={(e) => setWaistText(e.target.value)}
        />
      </div>

      <div className="row actions">
        <button type="submit" disabled={saving || weightText.trim() === ''}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
