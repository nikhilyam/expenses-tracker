import { X } from 'lucide-react';
import { useState } from 'react';
import type { Expense, ExpenseInput } from '../types';
interface Props { initial?: Expense; onSubmit: (input: ExpenseInput) => Promise<void>; onClose: () => void; }
export function ExpenseForm({ initial, onSubmit, onClose }: Props) {
  const [form, setForm] = useState<ExpenseInput>({ 
    amount: initial?.amount ?? 0, 
    category: initial?.category ?? 'Food', 
    description: initial?.description ?? '', 
    spentAt: initial?.spentAt ?? new Date().toISOString().slice(0, 10) 
  });
  const [saving, setSaving] = useState(false);
  const update = (key: keyof ExpenseInput, value: string | number) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event: React.FormEvent) => { 
        event.preventDefault(); 
        setSaving(true); 
        try { 
            await onSubmit(form); 
        } finally { 
            setSaving(false); 
        } 
    };
  return <div className="fixed inset-0 z-20 grid place-items-center bg-ink/40 p-4">
    <form onSubmit={submit} className="w-full max-w-lg rounded-2xl bg-cream p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl">{initial ? 'Edit expense' : 'New expense'}</h2>
            <button type="button" onClick={onClose} aria-label="Close"><X /></button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">Amount
                <input required min="0.01" step="0.01" type="number" value={form.amount || ''} onChange={(event) => update('amount', Number(event.target.value))} className="input" /></label>
                <label className="text-sm font-semibold">Category
                    <select value={form.category} onChange={(event) => update('category', event.target.value)} className="input">
                        <option>Food</option>
                        <option>Transport</option>
                        <option>Home</option>
                        <option>Health</option>
                        <option>Entertainment</option>
                        <option>Other</option>
                    </select>
                </label>
                <label className="text-sm font-semibold sm:col-span-2">Date
                    <input required type="date" value={form.spentAt} onChange={(event) => update('spentAt', event.target.value)} className="input" />
                </label>
                <label className="text-sm font-semibold sm:col-span-2">Description
                    <textarea value={form.description} onChange={(event) => update('description', event.target.value)} className="input min-h-24 resize-y" placeholder="What was this for?" />
                </label>
            </div>
            <button disabled={saving} className="mt-6 w-full rounded-xl bg-ink px-4 py-3 font-semibold text-cream disabled:opacity-50">
                {saving ? 'Saving...' : initial ? 'Save changes' : 'Add expense'}
            </button>
        </form>
    </div>;
}
