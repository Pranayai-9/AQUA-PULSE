import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Mon', gal: 45 },
  { name: 'Tue', gal: 52 },
  { name: 'Wed', gal: 38 },
  { name: 'Thu', gal: 65 },
  { name: 'Fri', gal: 48 },
  { name: 'Sat', gal: 70 },
  { name: 'Sun', gal: 55 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 p-3 rounded shadow-xl">
        <p className="text-slate-200 font-semibold">{label}</p>
        <p className="text-cyan-400">{`${payload[0].value} Gallons`}</p>
      </div>
    );
  }
  return null;
};

const UsageChart: React.FC = () => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis 
            dataKey="name" 
            stroke="#64748b" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#64748b" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `${value}g`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{fill: '#1e293b'}} />
          <Bar dataKey="gal" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.gal > 60 ? '#f59e0b' : '#0ea5e9'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsageChart;