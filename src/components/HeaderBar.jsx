import React, { useState } from 'react';
import { Menu, Plus, Eye, EyeOff, RefreshCw, Calendar, Send, ChevronLeft, ChevronRight } from 'lucide-react';

const TAB_NAMES = {
  inicio: 'Visão Geral',
  cartoes: 'Cartões de Crédito',
  receitas: 'Receitas & Entradas',
  despesas: 'Central de Despesas',
  saude: 'Saúde Financeira',
  metas: 'Metas Financeiras',
  patrimonio: 'Balanço Patrimonial',
  parceladas: 'Compras Parceladas',
  configuracoes: 'Configurações'
};

export default function HeaderBar({
  activeTab,
  onOpenMobileMenu,
  onOpenNewExpense,
  hideValues,
  onToggleHideValues,
  isSyncing,
  onSync,
  currentMonthData,
  onPrevMonth,
  onNextMonth,
  monthKeys,
  currentMonthIndex
}) {
  const isPast = currentMonthData?.status === 'fechado';
  const isFuture = currentMonthData?.status === 'previsao';

  return (
    <header className="sticky top-0 z-30 bg-[#0B0B0E]/95 backdrop-blur-md border-b border-[#241A30] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 select-none">
      {/* Left: Mobile hamburger + Active Section */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-xl bg-[#14121B] border border-[#241A30] text-[#EFEAFF] lg:hidden hover:bg-[#241A30]"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-black text-[#EFEAFF] tracking-tight leading-none">
              {TAB_NAMES[activeTab] || 'Controle Financeiro'}
            </h1>
            <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-[11px] text-[#EFEAFF]/50 font-medium mt-1">
            Ciclo Atual: <strong className="text-white">18/10 até 17/11</strong> • Virada em 18/11
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Interactive Month Switcher with Carousel Arrows & Status Badge */}
        <div className="flex items-center gap-1 bg-[#14121B] border border-[#241A30] p-1 rounded-xl text-xs font-bold text-[#EFEAFF]">
          <button
            onClick={onPrevMonth}
            disabled={currentMonthIndex === 0}
            className={`p-1 rounded-lg transition-colors ${
              currentMonthIndex === 0 ? 'text-[#EFEAFF]/20 cursor-not-allowed' : 'text-[#EFEAFF]/70 hover:bg-[#241A30] hover:text-white'
            }`}
            title="Mês anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 px-1.5">
            <Calendar className="w-3.5 h-3.5 text-purple-400 hidden sm:block" />
            <span className="text-xs font-black tracking-tight">{currentMonthData?.mesNome || 'Novembro de 2026'}</span>

            {/* Status indicator */}
            {isPast && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#241A30] text-purple-300 border border-[#241A30]">
                Fechado
              </span>
            )}
            {!isPast && !isFuture && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                Ativo
              </span>
            )}
            {isFuture && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-purple-950/60 text-purple-300 border border-purple-500/30">
                Previsão
              </span>
            )}
          </div>

          <button
            onClick={onNextMonth}
            disabled={currentMonthIndex === monthKeys.length - 1}
            className={`p-1 rounded-lg transition-colors ${
              currentMonthIndex === monthKeys.length - 1 ? 'text-[#EFEAFF]/20 cursor-not-allowed' : 'text-[#EFEAFF]/70 hover:bg-[#241A30] hover:text-white'
            }`}
            title="Próximo mês"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Telegram status */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#14121B] border border-[#241A30] text-[11px] text-purple-300 font-medium">
          <Send className="w-3 h-3 text-purple-400" />
          <span>@Kadachiibot</span>
        </div>

        {/* Eye Privacy Toggle */}
        <button
          onClick={onToggleHideValues}
          className="p-2 rounded-xl bg-[#14121B] border border-[#241A30] hover:bg-[#241A30] text-[#EFEAFF] transition-all active:scale-95"
          title={hideValues ? "Mostrar valores" : "Ocultar valores"}
        >
          {hideValues ? <EyeOff className="w-4 h-4 text-purple-400" /> : <Eye className="w-4 h-4" />}
        </button>

        {/* Sync Button */}
        <button
          onClick={onSync}
          disabled={isSyncing}
          className="p-2 rounded-xl bg-[#14121B] border border-[#241A30] hover:bg-[#241A30] text-[#EFEAFF] transition-all active:scale-95"
          title="Sincronizar dados"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-purple-400' : ''}`} />
        </button>

        {/* Action Button: + LANÇAR */}
        <button
          onClick={onOpenNewExpense}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#51307A] hover:bg-[#51307A]/80 text-[#EFEAFF] text-xs font-black tracking-wide uppercase transition-all shadow-md shadow-[#51307A]/40 border border-[#51307A] active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>LANÇAR</span>
        </button>
      </div>
    </header>
  );
}
