import React from 'react';
import { Calendar as CalendarIcon, Check } from 'lucide-react';

export default function BillCalendarStrip({ contas, selectedDay, onSelectDay }) {
  const daysMap = {};
  contas.forEach(conta => {
    if (conta.dia) {
      if (!daysMap[conta.dia]) {
        daysMap[conta.dia] = {
          day: conta.dia,
          contas: [],
          allPaid: true
        };
      }
      daysMap[conta.dia].contas.push(conta);
      if (!conta.pago) {
        daysMap[conta.dia].allPaid = false;
      }
    }
  });

  const sortedDays = Object.values(daysMap).sort((a, b) => a.day - b.day);

  return (
    <div className="bg-[#100c22]/90 rounded-2xl p-5 shadow-xl border border-purple-900/30 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-bold text-slate-100 tracking-tight">
            Calendário de Vencimentos do Mês
          </h2>
        </div>
        {selectedDay && (
          <button
            onClick={() => onSelectDay(null)}
            className="text-xs text-purple-400 font-semibold hover:text-purple-300 hover:underline"
          >
            Ver todos os dias
          </button>
        )}
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
        {/* All button */}
        <button
          onClick={() => onSelectDay(null)}
          className={`flex flex-col items-center justify-center min-w-[56px] h-[70px] rounded-2xl px-2 transition-all ${
            selectedDay === null
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40 border border-purple-400/40'
              : 'bg-purple-950/30 hover:bg-purple-900/40 text-slate-300 border border-purple-900/30'
          }`}
        >
          <span className="text-[11px] font-medium opacity-80">Todas</span>
          <span className="text-base font-black mt-0.5">{contas.length}</span>
        </button>

        {/* Days pills */}
        {sortedDays.map(({ day, contas: dayContas, allPaid }) => {
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => onSelectDay(isSelected ? null : day)}
              className={`flex flex-col items-center justify-center min-w-[56px] h-[70px] rounded-2xl px-2 transition-all relative ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40 border border-purple-400/40 scale-105'
                  : allPaid
                  ? 'bg-purple-950/20 hover:bg-purple-900/40 text-slate-200 border border-emerald-500/30'
                  : 'bg-purple-950/30 hover:bg-purple-900/40 text-slate-200 border border-purple-900/30'
              }`}
            >
              {allPaid && !isSelected && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 shadow-xs shadow-emerald-400/60" title="Todas pagas" />
              )}
              <span className={`text-[10px] font-semibold ${isSelected ? 'text-purple-200' : 'text-purple-300/60'}`}>
                Dia
              </span>
              <span className="text-lg font-black leading-none mt-0.5">
                {String(day).padStart(2, '0')}
              </span>
              <span className={`text-[10px] mt-1 font-medium ${isSelected ? 'text-purple-200' : 'text-purple-300/50'}`}>
                {dayContas.length} {dayContas.length === 1 ? 'conta' : 'contas'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
