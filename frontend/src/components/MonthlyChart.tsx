import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { MonthlyTotal } from '../types';
export function MonthlyChart({ data }: { data: MonthlyTotal[] }) { 
    return <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#66736a', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#66736a', fontSize: 12 }} tickFormatter={(value) => `₹${value}`} />
                <Tooltip cursor={{ fill: '#e5eadf' }} formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Spent']} />
                <Bar dataKey="total" fill="#6c8b72" radius={[5, 5, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </div>; 
}
