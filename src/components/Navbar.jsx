import React from 'react';
import { ChevronLeft, ChevronRight, Plus, Lock, Send, RefreshCw, CalendarDays } from 'lucide-react';

export default function Navbar({ onOpenNewExpense, onLock, onSync, isSyncing }) {
  return (
    <header className="sticky top-0 z-30 bg-[#0c081e]/85 backdrop-blur-md border-b border-purple-900/30 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Brand & Month */}
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white font-black text-lg shadow-md shadow-purple-500/20 border border-purple-400/30">
            CF
          </div>
          <div>
            <h1 className="text-sm font-black text-white tracking-tight leading-none">
              Controle Financeiro
            </h1>
            <p className="text-[10px] text-purple-300/60 font-medium mt-0.5">Visão Pessoal • Luis</p>
          </div>
        </div>

        {/* Month Selector */}
        <div className="hidden sm:flex items-center gap-1 bg-purple-950/40 border border-purple-900/40 px-2.5 py-1 rounded-xl text-xs font-semibold text-slate-200">
          <button className="p-0.5 hover:bg-purple-900/60 rounded-md text-purple-300 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="px-1.5 font-bold">Novembro de 2026</span>
          <button className="p-0.5 hover:bg-purple-900/60 rounded-md text-purple-300 transition-colors">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Cycle indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-950/30 border border-purple-900/30 text-[11px] text-purple-300">
          <CalendarDays className="w-3.5 h-3.5 text-purple-400" />
          <span>Ciclo: <strong>18/10 a 17/11</strong> (Virada em 18/11)</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Telegram Status Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-800/40 text-purple-300 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Send className="w-3 h-3 text-purple-400" />
          <span>@Kadachiibot</span>
        </div>

        {/* Sync Button */}
        <button
          onClick={onSync}
          disabled={isSyncing}
          className="p-2 rounded-xl bg-purple-950/40 border border-purple-900/40 hover:bg-purple-900/50 text-purple-300 transition-all active:scale-95"
          title="Sincronizar com Google Sheets"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-purple-400' : ''}`} />
        </button>

        {/* Add Expense Button */}
        <button
          onClick={onOpenNewExpense}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/30 border border-purple-400/30 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Adicionar Gasto</span>
          <span className="sm:hidden">Novo</span>
        </button>

        {/* Lock Screen Button */}
        <button
          onClick={onLock}
          className="p-2 rounded-xl bg-purple-950/40 border border-purple-900/40 hover:bg-purple-900/50 text-purple-300 transition-all active:scale-95"
          title="Bloquear Painel (Exigir PIN)"
        >
          <Lock className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
