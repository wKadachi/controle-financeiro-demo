import React from 'react';
import { Activity, ShieldCheck, TrendingUp, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';

export default function SaudeFinanceiraView() {
  const pilares = [
    {
      titulo: 'Comprometimento da Renda',
      valor: '70,6%',
      status: 'Saudável',
      statusColor: 'text-[#EFEAFF] bg-[#51307A]/60 border-[#51307A]',
      desc: 'O patamar recomendado para despesas fixas é de até 75%. Suas contas fixas de R$ 3.890 deixam margem segura.'
    },
    {
      titulo: 'Margem de Sobra Mensal',
      valor: 'R$ 2.610,00',
      status: 'Excelente',
      statusColor: 'text-[#EFEAFF] bg-[#51307A]/60 border-[#51307A]',
      desc: 'Você preserva 29,4% da sua receita líquida livre no fechamento do ciclo todo mês.'
    },
    {
      titulo: 'Pontualidade de Pagamentos',
      valor: '100%',
      status: 'Perfeito',
      statusColor: 'text-[#EFEAFF] bg-[#51307A]/60 border-[#51307A]',
      desc: 'Nenhuma conta em atraso. O bot do Telegram avisa 2 dias antes para garantir que nada passe do prazo.'
    },
    {
      titulo: 'Gastos em Cartão de Crédito',
      valor: '24,1%',
      status: 'Atenção',
      statusColor: 'text-[#EFEAFF]/70 bg-[#241A30] border-[#51307A]/40',
      desc: 'Total de R$ 3.290 em faturas. Mantenha os lançamentos do Mercado Pago sob o teto diário de R$ 133 para não comprimir a sobra.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#14121B] rounded-2xl p-6 border border-[#241A30] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-purple-400" />
            <h1 className="text-lg font-black text-[#EFEAFF]">Diagnóstico de Saúde Financeira</h1>
          </div>
          <p className="text-xs text-[#EFEAFF]/60">
            Análise automática do seu fluxo de caixa, solvência e eficiência orçamentária.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#51307A] text-[#EFEAFF] font-bold text-xs shadow-md shadow-[#51307A]/40">
            <ShieldCheck className="w-4 h-4 text-[#EFEAFF]" />
            <span>Score: 85/100 (Excelente)</span>
          </div>
        </div>
      </div>

      {/* Score Big Banner */}
      <div className="bg-gradient-to-r from-[#14121B] via-[#241A30]/40 to-[#14121B] rounded-2xl p-6 border border-[#241A30] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative w-24 h-24 rounded-full bg-[#0B0B0E] border-4 border-[#51307A] flex flex-col items-center justify-center shrink-0 shadow-lg shadow-[#51307A]/30">
            <span className="text-3xl font-black text-white">85</span>
            <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">/ 100</span>
          </div>
          <div>
            <span className="text-xs font-bold text-[#EFEAFF] uppercase tracking-widest">Nível de Segurança</span>
            <h2 className="text-xl font-black text-[#EFEAFF] mt-0.5">Caixa Confortável & Margem Ativa</h2>
            <p className="text-xs text-[#EFEAFF]/60 mt-1 max-w-md">
              Sua receita de R$ 6.500,00 cobre todas as contas fixas e gera sobra previsível de mais de R$ 2.600 todo dia 18.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-xl bg-[#0B0B0E] border border-[#241A30] text-center min-w-[120px]">
            <span className="text-[10px] text-[#EFEAFF]/50 uppercase font-semibold">Teto Diário</span>
            <p className="text-base font-black text-white">R$ 133,66/dia</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#0B0B0E] border border-[#241A30] text-center min-w-[120px]">
            <span className="text-[10px] text-[#EFEAFF]/50 uppercase font-semibold">Sobra Anual</span>
            <p className="text-base font-black text-[#EFEAFF]">R$ 48.120,00</p>
          </div>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {pilares.map((p, i) => (
          <div key={i} className="bg-[#14121B] rounded-2xl p-5 border border-[#241A30] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-[#EFEAFF]/70">{p.titulo}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${p.statusColor}`}>
                  {p.status}
                </span>
              </div>
              <p className="text-2xl font-black text-white">{p.valor}</p>
              <p className="text-xs text-[#EFEAFF]/60 mt-2 leading-relaxed">
                {p.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
