import React, { useState, useEffect } from 'react';
import { Landmark, TrendingUp, ShieldCheck, ArrowUpRight, ArrowDownLeft, Wallet, RefreshCw, PlusCircle, Trash2, CheckCircle2 } from 'lucide-react';

export default function PatrimonioView() {
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [openFinanceData, setOpenFinanceData] = useState(null);

  const fetchOpenFinanceData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/open-finance/data');
      if (res.ok) {
        const data = await res.json();
        setOpenFinanceData(data);
      }
    } catch (err) {
      console.error('Erro ao buscar dados do Open Finance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpenFinanceData();
  }, []);

  const handleConnectBank = async () => {
    try {
      setConnecting(true);
      const tokenRes = await fetch('/api/open-finance/connect-token');
      if (!tokenRes.ok) throw new Error('Não foi possível obter o token de conexão');
      const { accessToken } = await tokenRes.json();

      if (window.PluggyConnect) {
        const pluggyConnect = new window.PluggyConnect({
          connectToken: accessToken,
          includeSandbox: true,
          onSuccess: async (itemData) => {
            try {
              await fetch('/api/open-finance/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  itemId: itemData.item.id,
                  connector: itemData.item.connector
                })
              });
              fetchOpenFinanceData();
            } catch (saveErr) {
              console.error('Erro ao salvar item conectado:', saveErr);
            }
          },
          onError: (err) => {
            console.error('Erro no Pluggy Connect:', err);
          },
          onClose: () => {
            setConnecting(false);
          }
        });
        pluggyConnect.init();
      } else {
        alert('Carregando biblioteca do Open Finance, por favor tente novamente em alguns segundos.');
      }
    } catch (e) {
      alert('Erro ao iniciar conexão Open Finance: ' + e.message);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnectItem = async (itemId) => {
    if (!confirm('Deseja desconectar esta instituição?')) return;
    try {
      await fetch(`/api/open-finance/items/${itemId}`, { method: 'DELETE' });
      fetchOpenFinanceData();
    } catch (e) {
      alert('Erro ao desconectar: ' + e.message);
    }
  };

  // Fallback defaults if no Open Finance accounts connected yet
  const fallbackAtivos = [
    { nome: 'Reserva Financeira Liquidez Diária', tipo: 'Renda Fixa / CDB', valor: 12000.00, rendimento: '+0,85%/mês' },
    { nome: 'Carteira XP Investimentos', tipo: 'Ações & Fundos', valor: 3500.00, rendimento: '+1,2%/mês' },
    { nome: 'Saldo em Conta Corrente', tipo: 'Disponível', valor: 5200.00, rendimento: 'Caixa' }
  ];

  const fallbackPassivos = [
    { nome: 'Fatura Aberta Mercado Pago', valor: 2950.00, vencimento: '09/11' },
    { nome: 'Fatura Bradesco', valor: 220.00, vencimento: '01/11' },
    { nome: 'Fatura XP', valor: 120.00, vencimento: '01/11' }
  ];

  const hasLiveOF = openFinanceData?.hasData && (openFinanceData.investimentos?.length > 0 || openFinanceData.contas?.length > 0);

  const ativosExibidos = hasLiveOF
    ? [
        ...openFinanceData.investimentos.map(inv => ({
          nome: inv.nome,
          tipo: `${inv.subtipo || inv.tipo} • ${inv.instituicao}`,
          valor: inv.valor,
          rendimento: inv.taxa || (inv.quantidade ? `${inv.quantidade} cotas` : 'Investido')
        })),
        ...openFinanceData.contas.map(c => ({
          nome: c.nome,
          tipo: c.tipo,
          valor: c.saldo,
          rendimento: 'Saldo em Conta'
        }))
      ]
    : fallbackAtivos;

  const passivosExibidos = hasLiveOF && openFinanceData.cartoes?.length > 0
    ? openFinanceData.cartoes.map(cr => ({
        nome: cr.nome,
        valor: cr.valorFatura,
        vencimento: cr.vencimento
      }))
    : fallbackPassivos;

  const totalAtivos = ativosExibidos.reduce((a, b) => a + b.valor, 0);
  const totalPassivos = passivosExibidos.reduce((a, b) => a + b.valor, 0);
  const patrimonioLiquido = totalAtivos - totalPassivos;
  const solvencia = totalPassivos > 0 ? (totalAtivos / totalPassivos).toFixed(1) : '∞';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#14121B] rounded-2xl p-6 border border-[#241A30] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Landmark className="w-5 h-5 text-[#EFEAFF]" />
            <h1 className="text-lg font-black text-[#EFEAFF]">Balanço Patrimonial & Investimentos</h1>
            {hasLiveOF && (
              <span className="px-2 py-0.5 text-[10px] bg-[#51307A]/50 border border-[#7B4FA6]/50 text-[#EFEAFF] rounded-full font-bold">
                Open Finance Ativo
              </span>
            )}
          </div>
          <p className="text-xs text-[#EFEAFF]/60">
            Acompanhamento consolidado entre bens, carteiras de investimento e faturas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchOpenFinanceData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#241A30] hover:bg-[#3D2860] text-[#EFEAFF] text-xs font-bold rounded-xl transition-all border border-[#51307A]/40"
            title="Atualizar dados"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Sincronizar
          </button>

          <button
            onClick={handleConnectBank}
            disabled={connecting}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#51307A] hover:bg-[#7B4FA6] text-[#EFEAFF] text-xs font-black rounded-xl transition-all shadow-lg shadow-[#51307A]/30 border border-[#7B4FA6]/50"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            {connecting ? 'Conectando...' : '+ Conectar Banco / Corretora'}
          </button>

          <div className="text-right sm:border-l sm:border-[#241A30] sm:pl-4">
            <span className="text-[10px] text-[#EFEAFF]/50 uppercase font-semibold">Patrimônio Líquido</span>
            <p className="text-xl font-black text-[#EFEAFF]">
              R$ {patrimonioLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Connected Institutions Strip */}
      {openFinanceData?.items && openFinanceData.items.length > 0 && (
        <div className="bg-[#14121B] rounded-xl p-3 border border-[#241A30] flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#EFEAFF]/60 font-semibold mr-1">Instituições Conectadas:</span>
          {openFinanceData.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 px-3 py-1 bg-[#241A30] border border-[#51307A]/50 rounded-lg text-xs text-[#EFEAFF]"
            >
              <CheckCircle2 className="w-3 h-3 text-[#EFEAFF]" />
              <span className="font-bold">{item.name}</span>
              <button
                onClick={() => handleDisconnectItem(item.id)}
                className="text-[#EFEAFF]/40 hover:text-[#EFEAFF] transition-colors ml-1"
                title="Desconectar"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[#14121B] rounded-2xl p-5 border border-[#241A30]">
          <span className="text-xs text-[#EFEAFF]/60 font-semibold block mb-1">Total de Ativos</span>
          <p className="text-2xl font-black text-[#EFEAFF]">R$ {totalAtivos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <span className="text-[11px] text-[#EFEAFF]/70 font-bold mt-2 block">
            {hasLiveOF ? `${ativosExibidos.length} posições sincronizadas` : 'Caixa e investimentos'}
          </span>
        </div>

        <div className="bg-[#14121B] rounded-2xl p-5 border border-[#241A30]">
          <span className="text-xs text-[#EFEAFF]/60 font-semibold block mb-1">Passivos & Faturas</span>
          <p className="text-2xl font-black text-[#EFEAFF]/80">R$ {totalPassivos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <span className="text-[11px] text-[#EFEAFF]/50 mt-2 block">
            {hasLiveOF ? 'Faturas em aberto nos bancos' : 'Faturas estimadas do mês'}
          </span>
        </div>

        <div className="bg-[#14121B] rounded-2xl p-5 border border-[#241A30]">
          <span className="text-xs text-[#EFEAFF]/60 font-semibold block mb-1">Solvência Patrimonial</span>
          <p className="text-2xl font-black text-[#EFEAFF]">{solvencia}x</p>
          <span className="text-[11px] text-[#EFEAFF]/60 font-medium mt-2 block">
            {totalPassivos > 0 ? `R$ ${(totalAtivos / totalPassivos).toFixed(2)} de ativos para cada R$ 1 em dívida` : 'Sem passivos pendentes'}
          </span>
        </div>
      </div>

      {/* 2 Lists: Ativos & Passivos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ativos */}
        <div className="bg-[#14121B] rounded-2xl p-6 border border-[#241A30]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#EFEAFF] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#EFEAFF]" />
              Meus Ativos & Investimentos
            </h2>
            <span className="text-xs text-[#EFEAFF]/50">{ativosExibidos.length} itens</span>
          </div>

          <div className="divide-y divide-[#241A30] max-h-[460px] overflow-y-auto pr-1">
            {ativosExibidos.map((at, i) => (
              <div key={i} className="py-3 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-[#EFEAFF]">{at.nome}</p>
                  <span className="text-[10px] text-[#EFEAFF]/50">{at.tipo}</span>
                </div>
                <div className="text-right">
                  <p className="font-black text-[#EFEAFF]">R$ {at.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  <span className="text-[10px] text-[#EFEAFF]/60 font-semibold">{at.rendimento}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Passivos */}
        <div className="bg-[#14121B] rounded-2xl p-6 border border-[#241A30]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#EFEAFF] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#EFEAFF]" />
              Passivos & Faturas
            </h2>
            <span className="text-xs text-[#EFEAFF]/50">{passivosExibidos.length} itens</span>
          </div>

          <div className="divide-y divide-[#241A30] max-h-[460px] overflow-y-auto pr-1">
            {passivosExibidos.map((pa, i) => (
              <div key={i} className="py-3 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-[#EFEAFF]">{pa.nome}</p>
                  <span className="text-[10px] text-[#EFEAFF]/50">Vence em {pa.vencimento}</span>
                </div>
                <div className="text-right">
                  <p className="font-black text-[#EFEAFF]/80">R$ {pa.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  <span className="text-[10px] text-[#EFEAFF]/50">Em dia</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
