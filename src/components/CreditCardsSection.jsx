import React from 'react';
import { CreditCard, Layers, Plus, Wifi, Sparkles, ChevronRight, AlertCircle } from 'lucide-react';

export default function CreditCardsSection({ onAddExpense, installments = [] }) {
  const cards = [
    {
      name: 'Mercado Pago',
      bankName: 'MERCADO PAGO',
      type: 'Crédito Principal',
      number: '•••• 7419',
      value: 2950.00,
      baseNote: 'Piso base de R$ 500/mês + gastos',
      dueDay: 9,
      theme: {
        bg: 'from-[#001428] via-[#002752] to-[#0070ba]',
        border: 'border-blue-500/30',
        chip: 'from-amber-200 to-yellow-400',
        brand: 'VISA'
      }
    },
    {
      name: 'Bradesco',
      bankName: 'BRADESCO',
      type: 'Crédito Fixo',
      number: '•••• 3892',
      value: 220.00,
      baseNote: 'Valor fixo mensal + extras',
      dueDay: 1,
      theme: {
        bg: 'from-[#2d0208] via-[#5c0612] to-[#990a20]',
        border: 'border-red-500/30',
        chip: 'from-amber-100 to-amber-300',
        brand: 'VISA'
      }
    },
    {
      name: 'XP Investimentos',
      bankName: 'XP INVESTIMENTOS',
      type: 'Visa Infinite',
      number: '•••• 9104',
      value: 120.00,
      baseNote: 'Valor fixo mensal + extras',
      dueDay: 1,
      theme: {
        bg: 'from-[#0a0a0c] via-[#14151a] to-[#1f2229]',
        border: 'border-amber-500/20',
        chip: 'from-yellow-400 to-amber-600',
        brand: 'INFINITE'
      }
    }
  ];

  return (
    <div className="bg-[#100c22]/90 rounded-2xl p-6 shadow-xl border border-purple-900/30 backdrop-blur-md flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">Meus Cartões de Crédito</h2>
            <p className="text-[11px] text-purple-300/60">Faturas e acompanhamento mensal</p>
          </div>
        </div>
        <span className="text-xs font-bold text-purple-300 bg-purple-950/60 border border-purple-700/40 px-3 py-1 rounded-full">
          Total Faturas: R$ 3.290,00
        </span>
      </div>

      {/* Realistic Credit Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {cards.map((card) => (
          <div
            key={card.name}
            className={`relative rounded-2xl bg-gradient-to-br ${card.theme.bg} p-4 text-white border ${card.theme.border} shadow-lg shadow-black/40 flex flex-col justify-between min-h-[160px] overflow-hidden group hover:scale-[1.02] transition-transform duration-300`}
          >
            {/* Background subtle sheen */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />

            {/* Top row: Bank & Contactless */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black tracking-widest text-slate-200">
                {card.bankName}
              </span>
              <div className="flex items-center gap-1.5 opacity-70">
                <Wifi className="w-3.5 h-3.5 rotate-90 text-slate-300" />
              </div>
            </div>

            {/* Middle row: Chip EMV */}
            <div className="my-2 flex items-center justify-between">
              <div className={`w-8 h-6 rounded-md bg-gradient-to-br ${card.theme.chip} border border-amber-600/40 shadow-xs relative overflow-hidden flex items-center justify-center`}>
                <div className="w-full h-[1px] bg-amber-800/40 absolute" />
                <div className="h-full w-[1px] bg-amber-800/40 absolute" />
              </div>
              <span className="text-[10px] font-mono tracking-wider text-slate-300/80">
                {card.number}
              </span>
            </div>

            {/* Bottom row: Value & Due Date */}
            <div>
              <div className="flex items-baseline justify-between mb-0.5">
                <span className="text-[10px] text-slate-300 uppercase font-medium">Fatura Novembro</span>
                <span className="text-[10px] font-bold text-amber-300 bg-black/40 px-1.5 py-0.5 rounded border border-amber-500/20">
                  Vence dia {card.dueDay}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <p className="text-lg font-black tracking-tight text-white">
                  R$ {card.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <span className="text-[9px] font-extrabold italic text-slate-300 tracking-wider">
                  {card.theme.brand}
                </span>
              </div>
              <p className="text-[9px] text-slate-300/60 mt-1 truncate">
                {card.baseNote}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Compras Parceladas Section (Zero Dummy Items) */}
      <div className="pt-4 border-t border-purple-900/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-slate-200">Compras Parceladas</span>
          </div>
          <span className="text-[11px] text-purple-300/50">
            {installments.length} {installments.length === 1 ? 'parcelamento' : 'parcelamentos'} ativos
          </span>
        </div>

        {installments.length > 0 ? (
          <div className="space-y-3">
            {installments.map((inst, index) => {
              const percent = Math.round((inst.current / inst.total) * 100);
              return (
                <div key={index} className="p-3 rounded-xl bg-purple-950/30 border border-purple-900/40">
                  <div className="flex justify-between items-start text-xs mb-1">
                    <div>
                      <span className="font-semibold text-slate-200">{inst.title}</span>
                      <span className="text-purple-400 text-[11px] ml-1.5">
                        ({inst.current}/{inst.total})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-100">
                        R$ {Number(inst.monthlyValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-purple-300/60 text-[10px] block">/mês</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-purple-950 rounded-full overflow-hidden mt-1 mb-1.5">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="rounded-xl p-4 bg-purple-950/20 border border-dashed border-purple-800/40 text-center flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-purple-900/30 text-purple-400 flex items-center justify-center mb-2">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-slate-300">
              Nenhuma compra parcelada cadastrada ainda
            </p>
            <p className="text-[11px] text-purple-300/60 mt-1 max-w-sm">
              Você pode adicionar uma compra direto pelo Telegram mandando: <br />
              <code className="text-purple-300 bg-purple-900/40 px-1.5 py-0.5 rounded text-[10px] inline-block mt-1">
                Tênis 300 em 3x no Mercado Pago
              </code>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
