import React, { useState, useEffect } from 'react';
import { Layers, Plus, Sparkles, Send, Trash2, Calendar, RefreshCw, CreditCard } from 'lucide-react';

export default function ParceladasView({ installments = [], onAddInstallment }) {
  const [showAdd, setShowAdd] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [parcelas, setParcelas] = useState('3');
  const [cartao, setCartao] = useState('Mercado Pago');
  const [ofInstallments, setOfInstallments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInstallments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/open-finance/data');
      if (res.ok) {
        const data = await res.json();
        if (data.parceladas && data.parceladas.length > 0) {
          setOfInstallments(data.parceladas);
        }
      }
    } catch (e) {
      console.error('Erro ao buscar parceladas Open Finance:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstallments();
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!titulo || !valorTotal) return;
    const vTotal = parseFloat(valorTotal);
    const nParc = parseInt(parcelas) || 1;

    onAddInstallment({
      nome: titulo,
      valorPrevisto: vTotal,
      parcelas: nParc,
      categoria: 'Cartão',
      cartao: cartao,
      tipo: 'daily'
    });

    setTitulo('');
    setValorTotal('');
    setParcelas('3');
    setShowAdd(false);
  };

  // Combine manual installments and Open Finance detected installments
  const combinedInstallments = [
    ...ofInstallments.map((inst, idx) => ({
      id: `of-${idx}`,
      title: inst.title,
      card: inst.card,
      current: inst.current,
      total: inst.total,
      monthlyValue: inst.monthlyValue,
      remainingTotal: inst.remainingTotal,
      endDate: inst.endDate,
      isOpenFinance: true
    })),
    ...installments.map((inst, idx) => ({
      id: `man-${idx}`,
      title: inst.title,
      card: inst.category || 'Cartão',
      current: inst.current || 1,
      total: inst.total || 1,
      monthlyValue: inst.monthlyValue || 0,
      remainingTotal: inst.remainingTotal || 0,
      endDate: inst.endDate || 'A definir',
      isOpenFinance: false
    }))
  ];

  const totalMensal = combinedInstallments.reduce((acc, inst) => acc + (inst.monthlyValue || 0), 0);
  const totalRestante = combinedInstallments.reduce((acc, inst) => acc + (inst.remainingTotal || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#14121B] rounded-2xl p-6 border border-[#241A30] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-[#EFEAFF]" />
            <h1 className="text-lg font-black text-[#EFEAFF]">Gestão de Compras Parceladas</h1>
            {ofInstallments.length > 0 && (
              <span className="px-2 py-0.5 text-[10px] bg-[#51307A]/50 border border-[#7B4FA6]/50 text-[#EFEAFF] rounded-full font-bold">
                {ofInstallments.length} via Open Finance
              </span>
            )}
          </div>
          <p className="text-xs text-[#EFEAFF]/60">
            Monitore o peso das compras divididas no seu orçamento e data de término de cada fatura.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchInstallments}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#241A30] hover:bg-[#3D2860] text-[#EFEAFF] text-xs font-bold rounded-xl transition-all border border-[#51307A]/40"
            title="Atualizar parceladas"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Sincronizar
          </button>

          <button
            onClick={() => setShowAdd(prev => !prev)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#51307A] hover:bg-[#7B4FA6] text-[#EFEAFF] text-xs font-bold transition-all shadow-md shadow-[#51307A]/40 border border-[#7B4FA6]/40"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Compra Parcelada</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[#14121B] rounded-2xl p-5 border border-[#241A30]">
          <span className="text-xs text-[#EFEAFF]/60 font-semibold block mb-1">Parcelamentos Ativos</span>
          <p className="text-2xl font-black text-[#EFEAFF]">{combinedInstallments.length}</p>
          <span className="text-[11px] text-[#EFEAFF]/70 font-medium mt-2 block">
            {ofInstallments.length > 0 ? `${ofInstallments.length} detectadas nos cartões` : 'Cadastrados no painel'}
          </span>
        </div>

        <div className="bg-[#14121B] rounded-2xl p-5 border border-[#241A30]">
          <span className="text-xs text-[#EFEAFF]/60 font-semibold block mb-1">Impacto Mensal nas Faturas</span>
          <p className="text-2xl font-black text-[#EFEAFF]">
            R$ {totalMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-[#EFEAFF]/50 mt-2 block">Soma das parcelas deste mês</span>
        </div>

        <div className="bg-[#14121B] rounded-2xl p-5 border border-[#241A30]">
          <span className="text-xs text-[#EFEAFF]/60 font-semibold block mb-1">Saldo a Quitar no Futuro</span>
          <p className="text-2xl font-black text-[#EFEAFF]">
            R$ {totalRestante.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-[#EFEAFF]/50 mt-2 block">Total de parcelas restantes</span>
        </div>
      </div>

      {/* Add Form */}
      {showAdd && (
        <form onSubmit={handleAdd} className="bg-[#14121B] rounded-2xl p-5 border border-[#51307A] space-y-4">
          <h2 className="text-xs font-bold text-[#EFEAFF] uppercase">Cadastrar Compra Parcelada</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              required
              placeholder="O que comprou? (Ex: Smartphone)"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-[#241A30] bg-[#0B0B0E] text-[#EFEAFF] placeholder:text-[#EFEAFF]/40 focus:border-[#51307A] focus:outline-none"
            />
            <input
              type="number"
              step="0.01"
              required
              placeholder="Valor Total (R$)"
              value={valorTotal}
              onChange={(e) => setValorTotal(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-[#241A30] bg-[#0B0B0E] text-[#EFEAFF] placeholder:text-[#EFEAFF]/40 focus:border-[#51307A] focus:outline-none font-bold"
            />
            <select
              value={parcelas}
              onChange={(e) => setParcelas(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-[#241A30] bg-[#0B0B0E] text-[#EFEAFF] focus:border-[#51307A] focus:outline-none"
            >
              <option value="2">2x</option>
              <option value="3">3x</option>
              <option value="4">4x</option>
              <option value="5">5x</option>
              <option value="6">6x</option>
              <option value="10">10x</option>
              <option value="12">12x</option>
              <option value="24">24x</option>
            </select>
            <select
              value={cartao}
              onChange={(e) => setCartao(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-[#241A30] bg-[#0B0B0E] text-[#EFEAFF] focus:border-[#51307A] focus:outline-none"
            >
              <option value="Mercado Pago">Mercado Pago</option>
              <option value="Bradesco">Bradesco</option>
              <option value="XP">XP</option>
            </select>
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
              Salvar Compra
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="bg-[#14121B] rounded-2xl p-6 border border-[#241A30]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-[#EFEAFF]">Lista de Compras Parceladas</h2>
          <span className="text-xs text-[#EFEAFF]/50">{combinedInstallments.length} compras encontradas</span>
        </div>

        {combinedInstallments.length > 0 ? (
          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
            {combinedInstallments.map((inst, index) => {
              const percent = Math.min(100, Math.round((inst.current / inst.total) * 100));
              const isFinished = inst.current >= inst.total;
              return (
                <div key={index} className="p-4 rounded-xl bg-[#0B0B0E] border border-[#241A30] flex flex-col justify-between hover:border-[#51307A]/50 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#EFEAFF]">{inst.title}</span>
                        {inst.isOpenFinance && (
                          <span className="px-1.5 py-0.5 text-[9px] bg-[#51307A]/40 border border-[#7B4FA6]/40 text-[#EFEAFF] rounded font-bold">
                            {inst.card}
                          </span>
                        )}
                      </div>
                      <span className="text-[#EFEAFF]/60 text-xs font-mono block mt-0.5">
                        Parcela {inst.current} de {inst.total} {isFinished ? '• Concluída ✅' : ''}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-[#EFEAFF]">
                        R$ {Number(inst.monthlyValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-[10px] text-[#EFEAFF]/50 block">/mês</span>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-[#241A30] rounded-full overflow-hidden mt-1 mb-2">
                    <div className="h-full bg-[#51307A] rounded-full transition-all" style={{ width: `${percent}%` }} />
                  </div>

                  <div className="flex justify-between text-[11px] text-[#EFEAFF]/60">
                    <span>
                      {isFinished
                        ? 'Parcelamento 100% quitado'
                        : `Faltam ${inst.total - inst.current} parcelas (R$ ${Number(inst.remainingTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} restante)`}
                    </span>
                    <span>Término: {inst.endDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-[#241A30]/60 text-[#EFEAFF] flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-[#EFEAFF]">Nenhum parcelamento ativo</p>
            <p className="text-xs text-[#EFEAFF]/50 mt-1 max-w-sm">
              Conecte seus cartões ou cadastre suas compras pelo botão acima!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
