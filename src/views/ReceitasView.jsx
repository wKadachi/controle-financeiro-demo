import React from 'react';
import { ArrowDownLeft, TrendingUp, DollarSign, PieChart, ShieldCheck, Plus } from 'lucide-react';

export default function ReceitasView() {
  const receitaTotal = 6500.00;
  const contasTotal = 3890.00;
  const sobraLivre = receitaTotal - contasTotal;
  const margemLivre = ((sobraLivre / receitaTotal) * 100).toFixed(1);

  const fontes = [
    { nome: 'Salário / Renda Principal', valor: 6500.00, percent: 100, frequencia: 'Mensal', diaRecebimento: 'Todo 5º dia útil' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#14121B] rounded-2xl p-6 border border-[#241A30] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ArrowDownLeft className="w-5 h-5 text-[#EFEAFF]" />
            <h1 className="text-lg font-black text-[#EFEAFF]">Gestão de Receitas</h1>
          </div>
          <p className="text-xs text-[#EFEAFF]/60">
            Acompanhamento de fluxo de entradas, margem de economia e projeção anual.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-[#EFEAFF]/50 uppercase font-semibold">Receita do Mês</span>
            <p className="text-xl font-black text-[#EFEAFF]">
              R$ {receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards for Receita */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[#14121B] rounded-2xl p-5 border border-[#241A30]">
          <span className="text-xs text-[#EFEAFF]/60 font-semibold block mb-1">Renda Bruta Mensal</span>
          <p className="text-2xl font-black text-[#EFEAFF]">R$ 6.500,00</p>
          <span className="text-[11px] text-[#EFEAFF]/80 font-bold mt-2 block">100% recebido e confirmado</span>
        </div>

        <div className="bg-[#14121B] rounded-2xl p-5 border border-[#241A30]">
          <span className="text-xs text-[#EFEAFF]/60 font-semibold block mb-1">Margem Livre de Sobra</span>
          <p className="text-2xl font-black text-[#EFEAFF]">{margemLivre}%</p>
          <span className="text-[11px] text-[#EFEAFF]/50 mt-2 block">R$ {sobraLivre.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} livres para guardar</span>
        </div>

        <div className="bg-[#14121B] rounded-2xl p-5 border border-[#241A30]">
          <span className="text-xs text-[#EFEAFF]/60 font-semibold block mb-1">Projeção Anual (12 Meses)</span>
          <p className="text-2xl font-black text-[#EFEAFF]">R$ 163.800,00</p>
          <span className="text-[11px] text-[#EFEAFF]/70 font-medium mt-2 block">Com sobra anual estimada de R$ 48.120,00</span>
        </div>
      </div>

      {/* Sources Table */}
      <div className="bg-[#14121B] rounded-2xl p-6 border border-[#241A30]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-[#EFEAFF]">Fontes de Renda Cadastradas</h2>
          <span className="text-xs text-[#EFEAFF]/50">1 fonte ativa</span>
        </div>

        <div className="divide-y divide-[#241A30]">
          {fontes.map((f, i) => (
            <div key={i} className="py-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#241A30] border border-[#51307A]/50 text-[#EFEAFF] flex items-center justify-center font-bold">
                  <ArrowDownLeft className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-[#EFEAFF] text-sm">{f.nome}</p>
                  <span className="text-[11px] text-[#EFEAFF]/50">{f.diaRecebimento} • Frequência: {f.frequencia}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-base font-black text-[#EFEAFF]">
                  R$ {f.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <span className="text-[10px] text-[#EFEAFF]/50">100% da receita</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
