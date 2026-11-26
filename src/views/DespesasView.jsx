import React, { useState } from 'react';
import { ArrowUpRight, Search, CheckCircle2, Circle, Filter, Plus, Calendar } from 'lucide-react';

export default function DespesasView({ contas, onTogglePago, onOpenNewExpense }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['Família', 'Cartão', 'Moradia', 'Saúde', 'Planos', 'Pets'];

  const filtered = contas.filter(c => {
    if (selectedCategory !== 'all' && c.categoria !== selectedCategory) return false;
    if (filterStatus === 'paid' && !c.pago) return false;
    if (filterStatus === 'pending' && c.pago) return false;
    if (searchTerm && !c.nome.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const totalFiltered = filtered.reduce((acc, c) => acc + (c.valorPrevisto || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#14121B] rounded-2xl p-6 border border-[#241A30] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ArrowUpRight className="w-5 h-5 text-[#EFEAFF]" />
            <h1 className="text-lg font-black text-[#EFEAFF]">Central de Despesas do Mês</h1>
          </div>
          <p className="text-xs text-[#EFEAFF]/60">
            Gerencie todas as suas contas, prazos e dê baixa nos pagamentos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-[#EFEAFF]/50 uppercase font-semibold">Total Selecionado</span>
            <p className="text-xl font-black text-[#EFEAFF]">
              R$ {totalFiltered.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <button
            onClick={onOpenNewExpense}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#51307A] hover:bg-[#51307A]/80 text-[#EFEAFF] text-xs font-bold transition-all shadow-md shadow-[#51307A]/40"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Conta</span>
          </button>
        </div>
      </div>

      {/* Category Pills Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-[#51307A] text-[#EFEAFF] shadow-md shadow-[#51307A]/30'
              : 'bg-[#14121B] border border-[#241A30] text-[#EFEAFF]/60 hover:text-[#EFEAFF]'
          }`}
        >
          Todas Categorias ({contas.length})
        </button>
        {categories.map(cat => {
          const count = contas.filter(c => c.categoria === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#51307A] text-[#EFEAFF] shadow-md shadow-[#51307A]/30'
                  : 'bg-[#14121B] border border-[#241A30] text-[#EFEAFF]/60 hover:text-[#EFEAFF]'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Search and Status Filters */}
      <div className="bg-[#14121B] rounded-2xl p-6 border border-[#241A30] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome da conta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-[#241A30] bg-[#0B0B0E] text-[#EFEAFF] placeholder:text-[#EFEAFF]/40 focus:border-[#51307A] focus:outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-[#0B0B0E] rounded-xl border border-[#241A30] text-xs font-bold">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterStatus === 'all' ? 'bg-[#51307A] text-[#EFEAFF]' : 'text-[#EFEAFF]/50 hover:text-[#EFEAFF]'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterStatus('paid')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterStatus === 'paid' ? 'bg-[#51307A] text-[#EFEAFF]' : 'text-[#EFEAFF]/50 hover:text-[#EFEAFF]'
              }`}
            >
              Pagas
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterStatus === 'pending' ? 'bg-[#241A30] text-[#EFEAFF] border border-[#51307A]/50' : 'text-[#EFEAFF]/50 hover:text-[#EFEAFF]'
              }`}
            >
              Pendentes
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#241A30] text-[11px] font-bold text-[#EFEAFF]/50 uppercase tracking-wider">
                <th className="pb-3">Status</th>
                <th className="pb-3">Nome da Conta</th>
                <th className="pb-3">Categoria</th>
                <th className="pb-3">Vencimento</th>
                <th className="pb-3 text-right">Valor Previsto</th>
                <th className="pb-3 pl-4 hidden md:table-cell">Observações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#241A30]/60">
              {filtered.map(conta => (
                <tr key={conta.id || conta.nome} className="hover:bg-[#241A30]/20 transition-colors">
                  <td className="py-3">
                    <button
                      onClick={() => onTogglePago(conta.id || conta.nome)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                        conta.pago
                          ? 'bg-[#241A30] text-[#EFEAFF] border border-[#51307A]/60'
                          : 'bg-[#14121B] text-[#EFEAFF]/70 border border-[#241A30]'
                      }`}
                    >
                      {conta.pago ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#EFEAFF]" />
                          <span>Pago</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-3.5 h-3.5 text-[#51307A]" />
                          <span>Pendente</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3 font-bold text-[#EFEAFF]">
                    <span className={conta.pago ? 'line-through text-[#EFEAFF]/40' : ''}>
                      {conta.nome}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#241A30] border border-[#241A30] text-[#EFEAFF]">
                      {conta.categoria}
                    </span>
                  </td>
                  <td className="py-3 text-[#EFEAFF]/70 font-medium">
                    {conta.dia ? `Todo dia ${String(conta.dia).padStart(2, '0')}` : 'Sem dia fixo'}
                  </td>
                  <td className="py-3 text-right font-black text-[#EFEAFF] text-sm">
                    R$ {Number(conta.valorPrevisto).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 pl-4 hidden md:table-cell text-[#EFEAFF]/50 text-[11px] max-w-xs truncate">
                    {conta.observacao || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
