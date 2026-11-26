import React, { useState } from 'react';
import { Settings, Key, Shield, Calendar, Send, FileSpreadsheet, Check, RefreshCw } from 'lucide-react';

export default function ConfiguracoesView({ onLock }) {
  const [pinAtual, setPinAtual] = useState('1234');
  const [novoPin, setNovoPin] = useState('');
  const [pinSalvo, setPinSalvo] = useState(false);
  const [diaVirada, setDiaVirada] = useState('18');
  const [viradaSalva, setViradaSalva] = useState(false);

  const handleSalvarPin = (e) => {
    e.preventDefault();
    if (novoPin.length === 4) {
      setPinAtual(novoPin);
      setNovoPin('');
      setPinSalvo(true);
      setTimeout(() => setPinSalvo(false), 2500);
    }
  };

  const handleSalvarVirada = (e) => {
    e.preventDefault();
    setViradaSalva(true);
    setTimeout(() => setViradaSalva(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-[#14121B] rounded-2xl p-6 border border-[#241A30]">
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-5 h-5 text-purple-400" />
          <h1 className="text-lg font-black text-[#EFEAFF]">Configurações do Sistema</h1>
        </div>
        <p className="text-xs text-[#EFEAFF]/60">
          Personalize seu PIN de segurança, a data da virada do ciclo e visualize as integrações ativas.
        </p>
      </div>

      {/* Security & PIN */}
      <div className="bg-[#14121B] rounded-2xl p-6 border border-[#241A30] space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#EFEAFF]">
          <Key className="w-4 h-4 text-purple-400" />
          <span>Segurança & PIN de Acesso</span>
        </div>

        <p className="text-xs text-[#EFEAFF]/60">
          O seu PIN atual de acesso é <strong className="text-white font-mono bg-[#241A30] px-2 py-0.5 rounded">{pinAtual}</strong>.
          Ele é exigido sempre ao abrir o app no celular.
        </p>

        <form onSubmit={handleSalvarPin} className="flex items-center gap-3 max-w-sm pt-2">
          <input
            type="password"
            maxLength={4}
            placeholder="Novo PIN (4 dígitos)"
            value={novoPin}
            onChange={(e) => setNovoPin(e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#241A30] bg-[#0B0B0E] text-[#EFEAFF] placeholder:text-[#EFEAFF]/40 focus:border-[#51307A] focus:outline-none font-mono"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#51307A] hover:bg-[#51307A]/80 text-[#EFEAFF] text-xs font-bold shrink-0 transition-all shadow-md shadow-[#51307A]/40"
          >
            {pinSalvo ? 'Salvo! ✓' : 'Alterar PIN'}
          </button>
        </form>

        <div className="pt-2">
          <button
            onClick={onLock}
            className="text-xs font-bold text-[#EFEAFF]/70 hover:text-[#EFEAFF] underline"
          >
            Bloquear agora e testar a tela de PIN
          </button>
        </div>
      </div>

      {/* Cycle Turn Date */}
      <div className="bg-[#14121B] rounded-2xl p-6 border border-[#241A30] space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#EFEAFF]">
          <Calendar className="w-4 h-4 text-purple-400" />
          <span>Data da Virada de Ciclo Mensal</span>
        </div>

        <p className="text-xs text-[#EFEAFF]/60 leading-relaxed">
          Como a sua última conta é paga até o dia 17, o ciclo roda de <strong>18 do mês anterior até dia 17 do mês atual</strong>. No dia 18, o painel vira automaticamente para o próximo mês e o Mercado Pago reinicia no piso de R$ 500.
        </p>

        <form onSubmit={handleSalvarVirada} className="flex items-center gap-3 max-w-sm pt-2">
          <div className="flex items-center gap-2 text-xs text-[#EFEAFF]/80">
            <span>Dia do reset:</span>
            <input
              type="number"
              min="1"
              max="31"
              value={diaVirada}
              onChange={(e) => setDiaVirada(e.target.value)}
              className="w-16 px-2.5 py-1.5 text-xs rounded-xl border border-[#241A30] bg-[#0B0B0E] text-[#EFEAFF] text-center font-bold focus:border-[#51307A] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-xl bg-[#241A30] hover:bg-[#241A30]/80 text-[#EFEAFF] text-xs font-bold transition-all"
          >
            {viradaSalva ? 'Atualizado! ✓' : 'Salvar Dia'}
          </button>
        </form>
      </div>

      {/* Integrations Status */}
      <div className="bg-[#14121B] rounded-2xl p-6 border border-[#241A30] space-y-4">
        <h2 className="text-sm font-bold text-[#EFEAFF]">Integrações & Conexões Ativas</h2>

        <div className="space-y-3">
          {/* Telegram */}
          <div className="p-3.5 rounded-xl bg-[#0B0B0E] border border-[#241A30] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#51307A]/20 border border-[#51307A]/30 text-[#EFEAFF] flex items-center justify-center font-bold">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#EFEAFF]">Bot do Telegram (@Kadachiibot)</p>
                <span className="text-[10px] text-[#EFEAFF]/70">Ativo e conectado ao chat de Luis</span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#51307A] text-[#EFEAFF]">
              Online
            </span>
          </div>

          {/* Google Sheets */}
          <div className="p-3.5 rounded-xl bg-[#0B0B0E] border border-[#241A30] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#241A30] border border-[#51307A]/40 text-[#EFEAFF] flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#EFEAFF]">Planilha Google Sheets (Contas mensais)</p>
                <span className="text-[10px] text-[#EFEAFF]/50">Sincronização automática em tempo real</span>
              </div>
            </div>
            <a
              href="https://docs.google.com/spreadsheets/"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-bold text-[#EFEAFF] hover:underline"
            >
              Abrir Planilha
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
