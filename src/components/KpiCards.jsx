import React from 'react';
import { ArrowDownLeft, ArrowUpRight, TrendingUp, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function KpiCards({ data, hideValues }) {
  const { receita = 6500, totalPrevisto = 3890, contas = [] } = data || {};
  const sobraPrevista = receita - totalPrevisto;
  const pagasCount = contas.filter(c => c.pago).length;
  const totalContasCount = contas.length;

  const formatMoney = (val) => {
    if (hideValues) return '••••••';
    return `R$ ${Number(val).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Entradas (Receita) */}
      <div className="bg-[#14121B] rounded-2xl p-4 sm:p-5 shadow-xl border border-[#241A30] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#EFEAFF]/60">Entradas</span>
            <span className="text-[10px] font-bold text-[#EFEAFF] bg-[#51307A]/40 border border-[#51307A] px-2 py-0.5 rounded-full">
              Confirmado
            </span>
          </div>
          <div className="text-2xl font-black text-[#EFEAFF] tracking-tight">
            {formatMoney(receita)}
          </div>
        </div>

        {/* Striped bars indicator (Purple palette) */}
        <div className="mt-4 pt-3 border-t border-[#241A30]">
          <div className="flex items-end gap-[3px] h-3.5 mb-1.5">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="w-[3px] rounded-xs bg-[#51307A] h-3.5"
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-[#EFEAFF]/60 font-medium">
            <span>R$ 6.500 recebido</span>
            <span className="text-[#EFEAFF] font-bold">100%</span>
          </div>
        </div>
      </div>

      {/* 2. Despesas (Contas Previstas) */}
      <div className="bg-[#14121B] rounded-2xl p-4 sm:p-5 shadow-xl border border-[#241A30] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#EFEAFF]/60">Despesas</span>
            <span className="text-[10px] font-bold text-[#EFEAFF] bg-[#241A30] border border-[#51307A]/50 px-2 py-0.5 rounded-full">
              70,6% fixo
            </span>
          </div>
          <div className="text-2xl font-black text-[#EFEAFF] tracking-tight">
            {formatMoney(totalPrevisto)}
          </div>
        </div>

        {/* Striped bars indicator */}
        <div className="mt-4 pt-3 border-t border-[#241A30]">
          <div className="flex items-end gap-[3px] h-3.5 mb-1.5">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className={`w-[3px] rounded-xs ${i < 17 ? 'bg-[#51307A] h-3.5' : 'bg-[#241A30] h-2'}`}
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-[#EFEAFF]/60 font-medium">
            <span>{pagasCount} de {totalContasCount} quitadas</span>
            <span className="text-[#EFEAFF] font-bold">70,6%</span>
          </div>
        </div>
      </div>

      {/* 3. Balanço do mês (Sobra Livre) */}
      <div className="bg-[#14121B] rounded-2xl p-4 sm:p-5 shadow-xl border border-[#241A30] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#EFEAFF]/60">Balanço do mês</span>
            <span className="text-[10px] font-bold text-[#EFEAFF] bg-[#51307A] border border-[#51307A] px-2 py-0.5 rounded-full">
              Livre
            </span>
          </div>
          <div className="text-2xl font-black text-[#EFEAFF] tracking-tight">
            +{formatMoney(sobraPrevista)}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#241A30]">
          <div className="w-full h-2.5 bg-[#0B0B0E] rounded-full overflow-hidden flex border border-[#241A30]">
            <div className="bg-[#EFEAFF] h-full" style={{ width: '29.4%' }} />
            <div className="bg-[#51307A] h-full" style={{ width: '70.6%' }} />
          </div>
          <div className="flex justify-between text-[10px] text-[#EFEAFF]/60 font-medium mt-1.5">
            <span className="text-[#EFEAFF] font-bold">+29,4% livre</span>
            <span>Virada em 18/11</span>
          </div>
        </div>
      </div>

      {/* 4. Teto Diário */}
      <div className="bg-[#14121B] rounded-2xl p-4 sm:p-5 shadow-xl border border-[#241A30] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#EFEAFF]/60">Meta Diária</span>
            <span className="text-[10px] font-bold text-[#EFEAFF]/80 bg-[#241A30] border border-[#241A30] px-2 py-0.5 rounded-full">
              Pace
            </span>
          </div>
          <div className="text-2xl font-black text-[#EFEAFF] tracking-tight">
            {formatMoney(sobraPrevista / 30)}
            <span className="text-xs font-normal text-[#EFEAFF]/50 ml-1">/dia</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#241A30]">
          <p className="text-[10px] text-[#EFEAFF]/60 leading-relaxed">
            Limite diário para fechar o ciclo com a sobra livre de R$ 2.610,00.
          </p>
        </div>
      </div>
    </div>
  );
}
