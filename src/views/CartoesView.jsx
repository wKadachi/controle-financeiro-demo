import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Calendar, ShieldCheck, Wifi, ArrowUpRight, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function CartoesView({ onOpenNewExpense }) {
  const [selectedCardId, setSelectedCardId] = useState('mp');
  const [loading, setLoading] = useState(false);
  const [openFinanceCards, setOpenFinanceCards] = useState([]);

  const baseCards = [
    {
      id: 'mp',
      name: 'Mercado Pago',
      modelName: 'Platinum Mastercard',
      bankLogo: 'MERCADO PAGO',
      brand: 'mastercard',
      color: 'from-[#0B0B0E] via-[#14121B] to-[#241A30]',
      faturaAtual: 2950.00,
      limiteTotal: 6000.00,
      limiteDisponivel: 3050.00,
      fechamentoDia: 2,
      vencimentoDia: 9,
      status: 'Aberta',
      statusColor: 'text-[#EFEAFF]/70 bg-[#241A30] border-[#51307A]/40',
      rule: 'Virada dia 18: Inicia no piso de R$ 500,00 + despesas do mês',
      gastos: [
        { desc: 'Mercado Livre / Compras', valor: 1450.00, data: '05/11' },
        { desc: 'Posto de Gasolina Shell', valor: 220.00, data: '08/11' },
        { desc: 'Supermercado Carrefour', valor: 480.00, data: '10/11' },
        { desc: 'iFood / Restaurantes', valor: 300.00, data: '12/11' },
        { desc: 'Piso base de fatura', valor: 500.00, data: '18/10' }
      ]
    },
    {
      id: 'bra',
      name: 'Bradesco',
      modelName: 'Exclusive Visa',
      bankLogo: 'BRADESCO',
      brand: 'visa',
      color: 'from-[#0B0B0E] via-[#14121B] to-[#241A30]',
      faturaAtual: 220.00,
      limiteTotal: 4000.00,
      limiteDisponivel: 3780.00,
      fechamentoDia: 25,
      vencimentoDia: 1,
      status: 'Paga',
      statusColor: 'text-[#EFEAFF] bg-[#51307A]/60 border-[#51307A]/50',
      rule: 'Fatura fixa base de R$ 220,00 mensal',
      gastos: [
        { desc: 'Assinaturas Fixas Bradesco', valor: 220.00, data: '01/11' }
      ]
    },
    {
      id: 'xp',
      name: 'XP Investimentos',
      modelName: 'Visa Infinite',
      bankLogo: 'XP INVESTIMENTOS',
      brand: 'visa',
      color: 'from-[#0B0B0E] via-[#14121B] to-[#241A30]',
      faturaAtual: 120.00,
      limiteTotal: 10000.00,
      limiteDisponivel: 9880.00,
      fechamentoDia: 25,
      vencimentoDia: 1,
      status: 'Paga',
      statusColor: 'text-[#EFEAFF] bg-[#51307A]/60 border-[#51307A]/50',
      rule: 'Fatura fixa base de R$ 120,00 mensal',
      gastos: [
        { desc: 'Investimentos & Serviços XP', valor: 120.00, data: '01/11' }
      ]
    }
  ];

  const fetchCardData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/open-finance/data');
      if (res.ok) {
        const data = await res.json();
        if (data.cartoes && data.cartoes.length > 0) {
          setOpenFinanceCards(data.cartoes);
          setSelectedCardId(data.cartoes[0].id);
        }
      }
    } catch (e) {
      console.error('Erro ao buscar cartões Open Finance:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCardData();
  }, []);

  const displayedCards = openFinanceCards.length > 0
    ? openFinanceCards.map(c => ({
        id: c.id,
        name: c.nome,
        modelName: c.modelName,
        bankLogo: c.bankLogo,
        brand: c.brand,
        color: 'from-[#0B0B0E] via-[#14121B] to-[#241A30]',
        faturaAtual: c.valorFatura,
        limiteTotal: c.limiteTotal,
        limiteDisponivel: c.limiteDisponivel,
        fechamentoDia: c.fechamentoDia,
        vencimentoDia: c.vencimentoDia,
        status: c.status,
        statusColor: c.statusColor,
        rule: c.rule,
        gastos: c.gastos && c.gastos.length > 0 ? c.gastos : [{ desc: 'Sem compras recentes na fatura', valor: 0, data: 'Hoje' }],
        isOpenFinance: true
      }))
    : baseCards;

  const current = displayedCards.find(c => c.id === selectedCardId) || displayedCards[0];
  const totalFaturas = displayedCards.reduce((acc, c) => acc + c.faturaAtual, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#14121B] rounded-2xl p-6 border border-[#241A30] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-5 h-5 text-[#EFEAFF]" />
            <h1 className="text-lg font-black text-[#EFEAFF]">Gestão de Cartões de Crédito</h1>
            {openFinanceCards.length > 0 && (
              <span className="px-2 py-0.5 text-[10px] bg-[#51307A]/50 border border-[#7B4FA6]/50 text-[#EFEAFF] rounded-full font-bold">
                Open Finance Ativo
              </span>
            )}
          </div>
          <p className="text-xs text-[#EFEAFF]/60">
            {openFinanceCards.length > 0
              ? 'Faturas e compras sincronizadas em tempo real diretamente dos bancos.'
              : 'Acompanhe faturas, limites e viradas de ciclo de cada um dos seus cartões.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCardData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#241A30] hover:bg-[#3D2860] text-[#EFEAFF] text-xs font-bold rounded-xl transition-all border border-[#51307A]/40"
            title="Atualizar faturas"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Sincronizar
          </button>

          <div className="text-right sm:border-l sm:border-[#241A30] sm:pl-4">
            <span className="text-[10px] text-[#EFEAFF]/50 uppercase font-semibold">Total em Faturas</span>
            <p className="text-xl font-black text-[#EFEAFF]">
              R$ {totalFaturas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <button
            onClick={onOpenNewExpense}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#51307A] hover:bg-[#7B4FA6] text-[#EFEAFF] text-xs font-bold transition-all shadow-md shadow-[#51307A]/40 border border-[#7B4FA6]/40"
          >
            <Plus className="w-4 h-4" />
            <span>Lançar no Cartão</span>
          </button>
        </div>
      </div>

      {/* Cards Selector Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {displayedCards.map(card => {
          const isSelected = card.id === selectedCardId;
          return (
            <button
              key={card.id}
              onClick={() => setSelectedCardId(card.id)}
              className={`text-left p-4 rounded-2xl border transition-all ${
                isSelected
                  ? 'bg-[#14121B] border-[#51307A] shadow-lg shadow-[#51307A]/30 scale-[1.02]'
                  : 'bg-[#14121B]/60 border-[#241A30] hover:border-[#51307A]/40 hover:bg-[#14121B]'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-[#EFEAFF]">{card.name}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${card.statusColor}`}>
                  {card.status}
                </span>
              </div>
              <p className="text-xl font-black text-[#EFEAFF]">
                R$ {card.faturaAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <div className="flex justify-between items-center mt-3 text-[11px] text-[#EFEAFF]/50">
                <span>Vencimento dia {card.vencimentoDia}</span>
                <span>{card.brand?.toUpperCase() || 'CARTÃO'}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Card Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Card Mockup & Limit details */}
        <div className="lg:col-span-5 bg-[#14121B] rounded-2xl p-6 border border-[#241A30] space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#EFEAFF]">Detalhes do Cartão</h2>
            <span className="text-xs text-[#EFEAFF]/50">Fechamento: Dia {current.fechamentoDia}</span>
          </div>

          {/* Physical card mockup */}
          <div className={`w-full aspect-[1.72/1] rounded-2xl bg-gradient-to-br ${current.color} p-5 text-white border border-[#241A30] shadow-xl relative overflow-hidden flex flex-col justify-between`}>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#EFEAFF]">{current.modelName}</span>
              <span className="text-xs font-black tracking-widest text-[#EFEAFF]">{current.bankLogo}</span>
            </div>

            <div className="flex justify-between items-center my-2">
              <div className="w-9 h-7 rounded-md bg-gradient-to-br from-[#51307A] to-[#241A30] border border-[#51307A]/60 shadow-xs flex items-center justify-center">
                <div className="w-5 h-4 border border-[#EFEAFF]/30 rounded-xs" />
              </div>
              <Wifi className="w-5 h-5 rotate-90 text-[#EFEAFF]/50" />
            </div>

            <div className="flex justify-between items-end">
              <div>
                <span className="text-[10px] text-[#EFEAFF]/60 block">Fatura Atual</span>
                <span className="text-lg font-black text-white">
                  R$ {current.faturaAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <span className="text-xs font-black italic tracking-wider text-[#EFEAFF]/80">
                {current.brand?.toUpperCase() || 'CARTÃO'}
              </span>
            </div>
          </div>

          {/* Limit Bar */}
          <div className="p-4 rounded-xl bg-[#0B0B0E] border border-[#241A30] space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-[#EFEAFF]/60">Limite Utilizado</span>
              <span className="text-[#EFEAFF] font-bold">
                {current.limiteTotal > 0 ? Math.min(100, Math.round((current.faturaAtual / current.limiteTotal) * 100)) : 0}%
              </span>
            </div>
            <div className="w-full h-2 bg-[#241A30] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#51307A] rounded-full"
                style={{ width: `${current.limiteTotal > 0 ? Math.min(100, Math.round((current.faturaAtual / current.limiteTotal) * 100)) : 0}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-[#EFEAFF]/50 pt-1">
              <span>Utilizado: R$ {current.faturaAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              <span>Disponível: R$ {current.limiteDisponivel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Card Rule Note */}
          <div className="p-3.5 rounded-xl bg-[#241A30]/30 border border-[#241A30] flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#51307A] shrink-0 mt-0.5" />
            <p className="text-xs text-[#EFEAFF]/80 leading-relaxed">
              <strong>Status:</strong> {current.rule}
            </p>
          </div>
        </div>

        {/* Right: Transactions breakdown of selected card */}
        <div className="lg:col-span-7 bg-[#14121B] rounded-2xl p-6 border border-[#241A30]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-[#EFEAFF]">Lançamentos desta Fatura</h2>
              <p className="text-[11px] text-[#EFEAFF]/50">Histórico de despesas computadas no {current.name}</p>
            </div>
            <span className="text-xs font-bold text-[#EFEAFF] bg-[#241A30] px-2.5 py-1 rounded-lg">
              {current.gastos.length} itens
            </span>
          </div>

          <div className="divide-y divide-[#241A30] max-h-[460px] overflow-y-auto pr-1">
            {current.gastos.map((gasto, i) => (
              <div key={i} className="py-3 flex items-center justify-between text-xs hover:bg-[#241A30]/20 px-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#241A30] text-[#EFEAFF] flex items-center justify-center font-bold">
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#EFEAFF]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#EFEAFF]">{gasto.desc}</p>
                    <span className="text-[10px] text-[#EFEAFF]/50">
                      {gasto.data ? `Lançamento em ${gasto.data}` : ''} {gasto.categoria ? `• ${gasto.categoria}` : ''}
                    </span>
                  </div>
                </div>
                <span className="font-black text-[#EFEAFF] text-sm">
                  R$ {gasto.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
