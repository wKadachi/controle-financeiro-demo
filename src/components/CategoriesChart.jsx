import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

const COLORS = [
  '#51307A', // Família - Primary purple
  '#7B4FA6', // Cartões - Medium purple
  '#241A30', // Moradia - Dark surface
  '#3D2860', // Saúde - Deep purple
  '#8A5FC9', // Pets - Light purple
  '#1A1024', // Planos - Darkest purple
];

export default function CategoriesChart({ categorias = [] }) {
  const defaultCategories = [
    { name: 'Família', value: 4000, percent: 29.3, color: '#51307A' },
    { name: 'Cartões', value: 3290, percent: 24.1, color: '#7B4FA6' },
    { name: 'Moradia', value: 1545, percent: 11.3, color: '#3D2860' },
    { name: 'Saúde', value: 440, percent: 3.2, color: '#8A5FC9' },
    { name: 'Pets', value: 300, percent: 2.2, color: '#241A30' },
    { name: 'Planos', value: 65, percent: 0.5, color: '#1A1024' },
  ];

  const data = categorias.length > 0 ? categorias : defaultCategories;
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-[#100c22]/90 rounded-2xl p-6 shadow-xl border border-purple-900/30 backdrop-blur-md flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PieIcon className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-bold text-slate-100">Gastos por Categoria</h2>
        </div>
        <span className="text-xs text-purple-300/60 font-medium">Novembro</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* Donut Chart */}
        <div className="h-56 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(val) => [`R$ ${Number(val).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Valor']}
                contentStyle={{
                  backgroundColor: '#0c081e',
                  borderColor: '#4c1d95',
                  borderRadius: '14px',
                  color: '#fff',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                }}
              />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] text-purple-300/60 font-semibold uppercase tracking-wider">Total</span>
            <span className="text-xl font-black text-white">
              R$ {(total / 1000).toFixed(1)}k
            </span>
          </div>
        </div>

        {/* Legend with progress indicators */}
        <div className="space-y-2.5">
          {data.map((item, index) => {
            const color = item.color || COLORS[index % COLORS.length];
            return (
              <div key={item.name} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                    {item.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">
                      R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-purple-300/60 text-[11px] min-w-[36px] text-right font-medium">
                      {item.percent}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-purple-950/60 rounded-full overflow-hidden border border-purple-900/30">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(item.percent * 2.5, 100)}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
