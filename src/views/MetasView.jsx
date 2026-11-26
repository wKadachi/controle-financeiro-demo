import React, { useState } from 'react';
import { Flag, Plus, Sparkles, Target, Calendar, CheckCircle } from 'lucide-react';

export default function MetasView() {
  const [metas, setMetas] = useState([
    {
      id: 1,
      titulo: 'Reserva de Emergência (6 Meses)',
      categoria: 'Segurança',
      valorAtual: 12000.00,
      valorAlvo: 20000.00,
      prazo: 'Junho/2027',
      aporteSugerido: 1000.00
    },
    {
      id: 2,
      titulo: 'Viagem de Férias',
      categoria: 'Lazer',
      valorAtual: 5200.00,
      valorAlvo: 8000.00,
      prazo: 'Dezembro/2026',
      aporteSugerido: 1400.00
    },
    {
      id: 3,
      titulo: 'Carteira de Investimentos XP',
      categoria: 'Patrimônio',
      valorAtual: 3500.00,
      valorAlvo: 10000.00,
      prazo: 'Dezembro/2027',
      aporteSugerido: 500.00
    }
  ]);

  const [novoTitulo, setNovoTitulo] = useState('');
  const [novoAlvo, setNovoAlvo] = useState('');
  const [novoAtual, setNovoAtual] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const handleAddMeta = (e) => {
    e.preventDefault();
    if (!novoTitulo || !novoAlvo) return;
    const alvo = parseFloat(novoAlvo);
    const atual = parseFloat(novoAtual) || 0;
    setMetas(prev => [
      ...prev,
      {
        id: Date.now(),
        titulo: novoTitulo,
        categoria: 'Pessoal',
        valorAtual: atual,
        valorAlvo: alvo,
        prazo: 'Em definição',
        aporteSugerido: (alvo - atual) / 6
      }
    ]);
    setNovoTitulo('');
    setNovoAlvo('');
    setNovoAtual('');
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#14121B] rounded-2xl p-6 border border-[#241A30] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Flag className="w-5 h-5 text-purple-400" />
            <h1 className="text-lg font-black text-[#EFEAFF]">Metas & Objetivos Financeiros</h1>
          </div>
          <p className="text-xs text-[#EFEAFF]/60">
            Direcione a sua sobra mensal de R$ 2.610 para conquistar seus objetivos.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(prev => !prev)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#51307A] hover:bg-[#51307A]/80 text-[#EFEAFF] text-xs font-bold transition-all shadow-md shadow-[#51307A]/40"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Meta</span>
        </button>
      </div>

      {/* Add Meta Inline Form */}
      {showAdd && (
        <form onSubmit={handleAddMeta} className="bg-[#14121B] rounded-2xl p-5 border border-[#51307A] space-y-4">
          <h2 className="text-xs font-bold text-[#EFEAFF] uppercase">Cadastrar Novo Objetivo</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Nome da Meta (Ex: Trocar de Carro)"
              value={novoTitulo}
              onChange={(e) => setNovoTitulo(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-[#241A30] bg-[#0B0B0E] text-[#EFEAFF] placeholder:text-[#EFEAFF]/40 focus:border-[#51307A] focus:outline-none"
            />
            <input
              type="number"
              step="0.01"
              required
              placeholder="Valor Alvo Total (R$)"
              value={novoAlvo}
              onChange={(e) => setNovoAlvo(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-[#241A30] bg-[#0B0B0E] text-[#EFEAFF] placeholder:text-[#EFEAFF]/40 focus:border-[#51307A] focus:outline-none font-bold"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Valor já guardado (R$)"
              value={novoAtual}
              onChange={(e) => setNovoAtual(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-[#241A30] bg-[#0B0B0E] text-[#EFEAFF] placeholder:text-[#EFEAFF]/40 focus:border-[#51307A] focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-3 py-1.5 rounded-xl border border-[#241A30] text-xs text-[#EFEAFF]/60"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-[#51307A] text-[#EFEAFF] font-bold text-xs"
            >
              Salvar Meta
            </button>
          </div>
        </form>
      )}

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {metas.map(meta => {
          const percent = Math.min(Math.round((meta.valorAtual / meta.valorAlvo) * 100), 100);
          const falta = Math.max(meta.valorAlvo - meta.valorAtual, 0);

          return (
            <div key={meta.id} className="bg-[#14121B] rounded-2xl p-6 border border-[#241A30] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#241A30] text-[#EFEAFF]/70 border border-[#51307A]/40">
                    {meta.categoria}
                  </span>
                  <span className="text-xs font-black text-[#EFEAFF]">
                    {percent}%
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#EFEAFF] mt-1">{meta.titulo}</h3>

                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-[#EFEAFF]">
                    <span>R$ {meta.valorAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    <span className="text-[#EFEAFF]/50 text-[11px]">de R$ {meta.valorAlvo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div className="w-full h-2.5 bg-[#0B0B0E] rounded-full overflow-hidden border border-[#241A30]">
                    <div
                      className="h-full bg-gradient-to-r from-[#51307A] to-[#241A30] rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-[#EFEAFF]/50 pt-1">
                    <span>Falta: R$ {falta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    <span>Prazo: {meta.prazo}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#241A30] flex justify-between items-center text-[11px] text-[#EFEAFF]/70">
                <span>Aporte sugerido:</span>
                <span className="font-bold text-white">R$ {meta.aporteSugerido.toFixed(2)}/mês</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
