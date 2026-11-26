import React, { useState } from 'react';
import { CheckCircle2, Circle, Search } from 'lucide-react';

const CATEGORY_COLORS = {
  Cartão: 'bg-[#241A30] text-[#EFEAFF]/80 border-[#51307A]/40',
  Família: 'bg-[#241A30] text-[#EFEAFF]/80 border-[#51307A]/40',
  Moradia: 'bg-[#241A30] text-[#EFEAFF]/80 border-[#51307A]/40',
  Saúde: 'bg-[#241A30] text-[#EFEAFF]/80 border-[#51307A]/40',
  Planos: 'bg-[#241A30] text-[#EFEAFF]/80 border-[#51307A]/40',
  Pets: 'bg-[#241A30] text-[#EFEAFF]/80 border-[#51307A]/40',
};

export default function BillsList({ contas, onTogglePago, selectedDay }) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContas = contas.map(conta => {
    // If name is Cartão Mercado Livre, rename to Cartão Mercado Pago
    if (conta.nome === 'Cartão Mercado Livre') {
      return { ...conta, nome: 'Cartão Mercado Pago' };
    }
    return conta;
  }).filter(conta => {
    if (selectedDay !== null && conta.dia !== selectedDay) {
      return false;
    }
    if (filterStatus === 'paid' && !conta.pago) return false;
    if (filterStatus === 'pending' && conta.pago) return false;
    if (searchTerm && !conta.nome.toLowerCase().includes(searchTerm.toLowerCase()) && !conta.categoria.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="bg-[#100c22]/90 rounded-2xl p-6 shadow-xl border border-purple-900/30 backdrop-blur-md">
      {/* Header with Search and Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Contas do Mês
            {selectedDay && (
              <span className="ml-2 text-xs font-semibold text-purple-300 bg-purple-950/60 border border-purple-700/40 px-2.5 py-0.5 rounded-full">
                Vencimento Dia {String(selectedDay).padStart(2, '0')}
              </span>
            )}
          </h2>
          <p className="text-xs text-purple-200/50 mt-0.5">
            Clique no status para marcar como pago ou pendente
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar conta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-purple-900/40 bg-purple-950/30 text-white placeholder:text-purple-300/40 focus:bg-purple-950/50 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 w-36 sm:w-44 transition-all"
            />
          </div>

          {/* Filter Status Pills */}
          <div className="flex items-center p-1 bg-purple-950/40 border border-purple-900/30 rounded-xl text-xs font-medium text-slate-300">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filterStatus === 'all' ? 'bg-purple-600 text-white font-bold shadow-xs' : 'hover:text-white'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterStatus('paid')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filterStatus === 'paid' ? 'bg-[#51307A] text-white font-bold shadow-xs' : 'hover:text-white'
              }`}
            >
              Pagas
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filterStatus === 'pending' ? 'bg-[#241A30] text-[#EFEAFF] font-bold border border-[#51307A]/50 shadow-xs' : 'hover:text-white'
              }`}
            >
              Pendentes
            </button>
          </div>
        </div>
      </div>

      {/* Bills Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-purple-900/30 text-[11px] font-semibold text-purple-300/60 uppercase tracking-wider">
              <th className="pb-3 pl-1">Status</th>
              <th className="pb-3">Conta</th>
              <th className="pb-3">Categoria</th>
              <th className="pb-3">Vencimento</th>
              <th className="pb-3 text-right">Valor Previsto</th>
              <th className="pb-3 pl-4 hidden md:table-cell">Observação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-900/20">
            {filteredContas.map((conta) => {
              const categoryColor = CATEGORY_COLORS[conta.categoria] || 'bg-purple-950/40 text-purple-300 border-purple-700/40';
              return (
                <tr
                  key={conta.id || conta.nome}
                  className="hover:bg-purple-950/20 transition-colors group"
                >
                  {/* Status Toggle Button */}
                  <td className="py-3 pl-1">
                    <button
                      onClick={() => onTogglePago(conta.id || conta.nome)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-all ${
                        conta.pago
                          ? 'bg-[#241A30] text-[#EFEAFF] hover:bg-[#241A30]/80 border border-[#51307A]/50 shadow-xs'
                          : 'bg-purple-950/40 text-purple-300 hover:bg-purple-900/40 border border-purple-800/40'
                      }`}
                      title={conta.pago ? 'Clique para marcar como pendente' : 'Clique para marcar como pago'}
                    >
                      {conta.pago ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#EFEAFF]" />
                          <span>Pago</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-3.5 h-3.5 text-purple-400" />
                          <span>Pendente</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Nome da Conta */}
                  <td className="py-3 font-bold text-white">
                    <span className={conta.pago ? 'line-through text-slate-400' : ''}>
                      {conta.nome}
                    </span>
                  </td>

                  {/* Categoria */}
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${categoryColor}`}>
                      {conta.categoria}
                    </span>
                  </td>

                  {/* Vencimento */}
                  <td className="py-3 text-slate-300">
                    {conta.dia ? (
                      <span className="font-semibold text-slate-200">
                        Dia {String(conta.dia).padStart(2, '0')}/11
                      </span>
                    ) : (
                      <span className="text-purple-300/40 italic">Sem dia fixo</span>
                    )}
                  </td>

                  {/* Valor Previsto */}
                  <td className="py-3 text-right font-black text-white">
                    R$ {Number(conta.valorPrevisto).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>

                  {/* Observação */}
                  <td className="py-3 pl-4 hidden md:table-cell text-purple-200/50 max-w-xs truncate text-[11px]">
                    {conta.observacao || '-'}
                  </td>
                </tr>
              );
            })}

            {filteredContas.length === 0 && (
              <tr>
                <td colSpan="6" className="py-8 text-center text-purple-300/40">
                  Nenhuma conta encontrada com os filtros selecionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
