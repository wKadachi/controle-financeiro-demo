import React, { useState, useEffect } from 'react';
import KpiCards from '../components/KpiCards';
import BillCalendarStrip from '../components/BillCalendarStrip';
import CategoriesChart from '../components/CategoriesChart';
import MyCardsWidget from '../components/MyCardsWidget';
import BillsList from '../components/BillsList';
import { Layers, Sparkles } from 'lucide-react';

export default function InicioView({
  data,
  hideValues,
  selectedDay,
  onSelectDay,
  onTogglePago,
  onOpenNewExpense
}) {
  const [ofInstallments, setOfInstallments] = useState([]);

  useEffect(() => {
    fetch('/api/open-finance/data')
      .then(res => res.json())
      .then(d => {
        if (d.parceladas && d.parceladas.length > 0) {
          setOfInstallments(d.parceladas.slice(0, 4));
        }
      })
      .catch(() => {});
  }, []);

  const displayedInstallments = data.installments && data.installments.length > 0
    ? data.installments
    : ofInstallments;

  return (
    <div className="space-y-6">
      {/* 4 KPI Cards */}
      <KpiCards data={data} hideValues={hideValues} />

      {/* 2-Column Balanced Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Columns: Calendar Strip + Donut + Bills List */}
        <div className="lg:col-span-7 space-y-6">
          <BillCalendarStrip
            contas={data.contas}
            selectedDay={selectedDay}
            onSelectDay={onSelectDay}
          />

          <CategoriesChart categorias={data.categorias} />

          <BillsList
            contas={data.contas}
            onTogglePago={onTogglePago}
            selectedDay={selectedDay}
          />
        </div>

        {/* Right 5 Columns: Meus Cartões Widget + Parcelas */}
        <div className="lg:col-span-5 space-y-6 sticky top-20">
          <MyCardsWidget onOpenAll={onOpenNewExpense} />

          {/* Compras Parceladas Card */}
          <div className="bg-[#14121B] rounded-2xl p-5 shadow-xl border border-[#241A30]">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#EFEAFF]" />
                <h2 className="text-sm font-bold text-[#EFEAFF]">Compras Parceladas</h2>
              </div>
              <span className="text-[11px] text-[#EFEAFF]/50">
                {displayedInstallments.length} ativas
              </span>
            </div>

            {displayedInstallments.length > 0 ? (
              <div className="space-y-3">
                {displayedInstallments.map((inst, index) => {
                  const percent = Math.min(100, Math.round((inst.current / inst.total) * 100));
                  return (
                    <div key={index} className="p-3 rounded-xl bg-[#0B0B0E] border border-[#241A30]">
                      <div className="flex justify-between items-start text-xs mb-1">
                        <div>
                          <span className="font-semibold text-[#EFEAFF]">{inst.title}</span>
                          <span className="text-[#EFEAFF]/60 text-[11px] ml-1.5 font-mono">
                            ({inst.current}/{inst.total})
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-[#EFEAFF]">
                            R$ {Number(inst.monthlyValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-[#EFEAFF]/50 text-[10px] block">/mês</span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-[#241A30] rounded-full overflow-hidden mt-1 mb-1.5">
                        <div className="h-full bg-[#51307A] rounded-full" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl p-4 bg-[#241A30]/20 border border-dashed border-[#241A30] text-center flex flex-col items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-[#51307A]/30 text-[#EFEAFF] flex items-center justify-center mb-2">
                  <Sparkles className="w-4 h-4" />
                </div>
                <p className="text-xs font-semibold text-[#EFEAFF]">
                  Nenhuma compra parcelada ativa
                </p>
                <p className="text-[11px] text-[#EFEAFF]/60 mt-1 max-w-xs">
                  Conecte seus cartões ou cadastre suas compras no Telegram!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
