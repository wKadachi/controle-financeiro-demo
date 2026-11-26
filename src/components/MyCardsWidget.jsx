import React, { useState, useEffect } from 'react';
import { CreditCard, ChevronLeft, ChevronRight, Wifi } from 'lucide-react';

export default function MyCardsWidget({ onOpenAll }) {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('fatura');
  const [liveCards, setLiveCards] = useState([]);

  const baseCards = [
    {
      id: 'mp',
      name: 'Mercado Pago',
      modelName: 'Platinum Card',
      bankLogo: 'MERCADO PAGO',
      brand: 'MASTERCARD',
      color: 'from-[#0B0B0E] via-[#14121B] to-[#241A30]',
      borderColor: 'border-[#51307A]/50',
      fatura: 529.63,
      limiteTotal: 4200.00,
      limiteDisponivel: 3670.37,
      statusText: 'Aberta • Vence dia 08',
      statusColor: 'text-[#EFEAFF] bg-[#241A30] border-[#51307A]/40',
      dueDay: 8,
      note: 'Fatura aberta do ciclo atual'
    },
    {
      id: 'xp',
      name: 'XP Investimentos',
      modelName: 'Infinite Card',
      bankLogo: 'XP INVESTIMENTOS',
      brand: 'VISA',
      color: 'from-[#0B0B0E] via-[#14121B] to-[#241A30]',
      borderColor: 'border-[#51307A]/50',
      fatura: 161.91,
      limiteTotal: 10000.00,
      limiteDisponivel: 9838.09,
      statusText: 'Aberta • Vence dia 24/11',
      statusColor: 'text-[#EFEAFF] bg-[#241A30] border-[#51307A]/40',
      dueDay: 24,
      note: 'Fatura atual (R$ 381,27 com parcelas futuras)'
    },
    {
      id: 'bra',
      name: 'Bradesco',
      modelName: 'Visa Signature',
      bankLogo: 'BRADESCO',
      brand: 'VISA',
      color: 'from-[#0B0B0E] via-[#14121B] to-[#241A30]',
      borderColor: 'border-[#51307A]/50',
      fatura: 214.23,
      limiteTotal: 12000.00,
      limiteDisponivel: 11143.08,
      statusText: 'Parcela do Mês',
      statusColor: 'text-[#EFEAFF] bg-[#51307A]/50 border-[#51307A]',
      dueDay: 1,
      note: 'R$ 856,92 de parcelas futuras restantes'
    }
  ];

  useEffect(() => {
    fetch('/api/open-finance/data')
      .then(res => res.json())
      .then(data => {
        if (data.cartoes && data.cartoes.length > 0) {
          const mapped = data.cartoes
            .filter(c => c.valorFatura > 0 || c.limiteTotal > 0)
            .map(c => {
              const isXP = c.nome.toLowerCase().includes('xp');
              const isMP = c.nome.toLowerCase().includes('mercado');
              const isBra = c.nome.toLowerCase().includes('bradesco');

              let statusText = c.status;
              let note = c.rule;
              if (isMP) {
                statusText = 'Aberta • Vence dia 08';
                note = 'Fatura aberta do ciclo atual';
              } else if (isXP) {
                statusText = 'Aberta • Vence dia 24/11';
                note = 'Fatura atual (R$ 381,27 com parcelas futuras)';
              } else if (isBra) {
                statusText = 'Parcela do Mês';
                note = 'R$ 856,92 de parcelas futuras restantes';
              }

              return {
                id: c.id,
                name: c.nome,
                modelName: c.modelName,
                bankLogo: c.bankLogo,
                brand: c.brand?.toUpperCase() || 'VISA',
                color: 'from-[#0B0B0E] via-[#14121B] to-[#241A30]',
                borderColor: 'border-[#51307A]/50',
                fatura: c.valorFatura,
                limiteTotal: c.limiteTotal,
                limiteDisponivel: c.limiteDisponivel,
                statusText,
                statusColor: 'text-[#EFEAFF] bg-[#241A30] border-[#51307A]/40',
                dueDay: c.vencimentoDia,
                note
              };
            });
          if (mapped.length > 0) setLiveCards(mapped);
        }
      })
      .catch(err => console.error('Erro ao carregar cartões no widget:', err));
  }, []);

  const cards = liveCards.length > 0 ? liveCards : baseCards;
  const current = cards[activeCardIndex] || cards[0];

  const handlePrev = () => {
    setActiveCardIndex(prev => (prev === 0 ? cards.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveCardIndex(prev => (prev === cards.length - 1 ? 0 : prev + 1));
  };

  const totalBars = 32;
  const usedRatio = Math.min(Math.max(current.fatura / (current.limiteTotal || 1), 0.08), 1);
  const activeBarsCount = Math.round(usedRatio * totalBars);

  return (
    <div className="bg-[#14121B] rounded-2xl p-5 shadow-xl border border-[#241A30] flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-[#EFEAFF]" />
          <h2 className="text-sm font-bold text-[#EFEAFF]">Meus cartões</h2>
        </div>

        {/* Carousel arrows */}
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            className="w-7 h-7 rounded-lg bg-[#241A30] hover:bg-[#51307A] text-[#EFEAFF] flex items-center justify-center transition-all active:scale-95 border border-[#241A30]"
            title="Cartão anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="w-7 h-7 rounded-lg bg-[#241A30] hover:bg-[#51307A] text-[#EFEAFF] flex items-center justify-center transition-all active:scale-95 border border-[#241A30]"
            title="Próximo cartão"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Realistic Card Preview strictly in palette */}
      <div
        className={`relative w-full aspect-[1.72/1] rounded-2xl bg-gradient-to-br ${current.color} p-4 text-white border ${current.borderColor} shadow-xl flex flex-col justify-between overflow-hidden transition-all duration-300`}
      >
        {/* Subtle texture */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#51307A 1px, transparent 1px)`,
            backgroundSize: '8px 8px'
          }}
        />

        {/* Card Header */}
        <div className="flex items-center justify-between relative z-10">
          <span className="text-xs font-bold tracking-wide text-[#EFEAFF]">
            {current.modelName}
          </span>
          <span className="text-[11px] font-black tracking-widest text-[#EFEAFF]">
            {current.bankLogo}
          </span>
        </div>

        {/* Card Middle: Metallic Purple/Silver Chip & Contactless */}
        <div className="flex items-center justify-between relative z-10 my-1">
          <div className="w-8 h-6 rounded-md bg-gradient-to-br from-[#EFEAFF] via-[#51307A] to-[#241A30] border border-[#51307A] relative overflow-hidden shadow-xs">
            <div className="w-full h-[1px] bg-[#0B0B0E]/60 absolute top-2" />
            <div className="w-full h-[1px] bg-[#0B0B0E]/60 absolute top-4" />
            <div className="h-full w-[1px] bg-[#0B0B0E]/60 absolute left-3" />
          </div>
          <Wifi className="w-4 h-4 rotate-90 text-[#EFEAFF]/50" />
        </div>

        {/* Card Footer: Brand in Lavender & Purple */}
        <div className="flex items-center justify-between relative z-10">
          <span className="text-[10px] font-mono tracking-widest text-[#EFEAFF]/70">
            •••• 4892
          </span>
          {current.brand === 'MASTERCARD' ? (
            <div className="flex items-center -space-x-2">
              <div className="w-5 h-5 rounded-full bg-[#51307A]" />
              <div className="w-5 h-5 rounded-full bg-[#241A30] border border-[#51307A]/40" />
            </div>
          ) : (
            <span className="text-xs font-black italic tracking-wider text-[#EFEAFF]">
              VISA
            </span>
          )}
        </div>
      </div>

      {/* Sub-tabs below card: [ Crédito ] [ Fatura ] */}
      <div className="grid grid-cols-2 p-1 bg-[#0B0B0E] border border-[#241A30] rounded-xl my-4 text-xs font-bold text-[#EFEAFF]">
        <button
          type="button"
          onClick={() => setActiveTab('credito')}
          className={`py-1.5 rounded-lg transition-all ${
            activeTab === 'credito'
              ? 'bg-[#51307A] text-[#EFEAFF] shadow-md'
              : 'text-[#EFEAFF]/50 hover:text-white'
          }`}
        >
          Crédito
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('fatura')}
          className={`py-1.5 rounded-lg transition-all ${
            activeTab === 'fatura'
              ? 'bg-[#51307A] text-[#EFEAFF] shadow-md'
              : 'text-[#EFEAFF]/50 hover:text-white'
          }`}
        >
          Fatura
        </button>
      </div>

      {/* Details Row: Total da fatura • Status */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1">
          <div className="flex items-center gap-1.5 text-[11px] text-[#EFEAFF]/60 font-medium">
            <span>{activeTab === 'fatura' ? 'Total da fatura' : 'Limite utilizado'}</span>
            <span>•</span>
            <span className={`font-bold px-1.5 py-0.2 rounded border ${current.statusColor}`}>
              {current.statusText}
            </span>
          </div>

          <button
            onClick={onOpenAll}
            className="text-[11px] font-bold text-[#EFEAFF] hover:underline"
          >
            Ver todos
          </button>
        </div>

        {/* Large Value */}
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-black text-[#EFEAFF] tracking-tight">
            R$ {current.fatura.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-[#EFEAFF]/40">
            de R$ {current.limiteTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Barcode / Striped vertical progress indicator */}
        <div className="flex items-end gap-[3px] h-5 my-2.5">
          {Array.from({ length: totalBars }).map((_, i) => {
            const isFilled = i < activeBarsCount;
            return (
              <div
                key={i}
                className={`w-[4px] rounded-xs transition-all duration-300 ${
                  isFilled
                    ? 'bg-[#51307A] h-5'
                    : 'bg-[#241A30] h-3'
                }`}
              />
            );
          })}
        </div>

        <p className="text-[10px] text-[#EFEAFF]/50">
          {current.note}
        </p>
      </div>
    </div>
  );
}
