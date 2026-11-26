import React, { useState } from 'react';
import { X, Plus, Calendar, DollarSign, Tag, CreditCard } from 'lucide-react';

export default function NewExpenseModal({ isOpen, onClose, onSave }) {
  const [type, setType] = useState('daily'); // 'daily' or 'bill'
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('Moradia');
  const [dia, setDia] = useState('');
  const [cartao, setCartao] = useState('Mercado Pago');
  const [parcelas, setParcelas] = useState('1');
  const [observacao, setObservacao] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome || !valor) return;

    onSave({
      tipo: type,
      nome,
      valorPrevisto: parseFloat(valor.replace(',', '.')),
      categoria: type === 'bill' ? categoria : 'Cartão',
      dia: dia ? parseInt(dia) : null,
      cartao: type === 'daily' ? cartao : null,
      parcelas: parseInt(parcelas) || 1,
      observacao,
      pago: false,
    });

    onClose();
    setNome('');
    setValor('');
    setDia('');
    setObservacao('');
    setParcelas('1');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#14121B] rounded-3xl w-full max-w-md p-6 shadow-2xl border border-[#241A30] text-[#EFEAFF] animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-[#241A30]">
          <h2 className="text-base font-bold text-[#EFEAFF]">Novo Lançamento</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#241A30]/50 hover:bg-[#241A30] text-[#EFEAFF]/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type Toggle */}
        <div className="grid grid-cols-2 p-1 bg-[#0B0B0E] border border-[#241A30] rounded-xl my-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setType('daily')}
            className={`py-2 rounded-lg transition-all ${
              type === 'daily' ? 'bg-[#51307A] text-[#EFEAFF] shadow-md' : 'text-[#EFEAFF]/50 hover:text-white'
            }`}
          >
            Gasto no Cartão / Pix
          </button>
          <button
            type="button"
            onClick={() => setType('bill')}
            className={`py-2 rounded-lg transition-all ${
              type === 'bill' ? 'bg-[#51307A] text-[#EFEAFF] shadow-md' : 'text-[#EFEAFF]/50 hover:text-white'
            }`}
          >
            Conta Fixa Mensal
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#EFEAFF]/80 mb-1">
              Descrição
            </label>
            <input
              type="text"
              required
              placeholder={type === 'daily' ? "Ex: Mercado, Almoço, Gasolina" : "Ex: Academia, Condomínio"}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#241A30] bg-[#0B0B0E] text-[#EFEAFF] placeholder:text-[#EFEAFF]/40 focus:border-[#51307A] focus:outline-none transition-all font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#EFEAFF]/80 mb-1">
                Valor Total (R$)
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0,00"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#241A30] bg-[#0B0B0E] text-[#EFEAFF] placeholder:text-[#EFEAFF]/40 focus:border-[#51307A] focus:outline-none transition-all font-black"
              />
            </div>

            {type === 'daily' ? (
              <div>
                <label className="block text-xs font-semibold text-[#EFEAFF]/80 mb-1">
                  Cartão / Método
                </label>
                <select
                  value={cartao}
                  onChange={(e) => setCartao(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#241A30] bg-[#0B0B0E] text-[#EFEAFF] focus:border-[#51307A] focus:outline-none transition-all font-medium"
                >
                  <option value="Mercado Pago" className="bg-[#14121B]">Mercado Pago</option>
                  <option value="Bradesco" className="bg-[#14121B]">Bradesco</option>
                  <option value="XP" className="bg-[#14121B]">XP Investimentos</option>
                  <option value="Pix" className="bg-[#14121B]">Pix / Dinheiro</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-[#EFEAFF]/80 mb-1">
                  Dia Vencimento
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  placeholder="Ex: 10"
                  value={dia}
                  onChange={(e) => setDia(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#241A30] bg-[#0B0B0E] text-[#EFEAFF] placeholder:text-[#EFEAFF]/40 focus:border-[#51307A] focus:outline-none transition-all font-medium"
                />
              </div>
            )}
          </div>

          {type === 'daily' && (
            <div>
              <label className="block text-xs font-semibold text-[#EFEAFF]/80 mb-1">
                Parcelamento (Quantidade de vezes)
              </label>
              <select
                value={parcelas}
                onChange={(e) => setParcelas(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#241A30] bg-[#0B0B0E] text-[#EFEAFF] focus:border-[#51307A] focus:outline-none transition-all font-medium"
              >
                <option value="1" className="bg-[#14121B]">À vista (1x)</option>
                <option value="2" className="bg-[#14121B]">2x</option>
                <option value="3" className="bg-[#14121B]">3x</option>
                <option value="4" className="bg-[#14121B]">4x</option>
                <option value="5" className="bg-[#14121B]">5x</option>
                <option value="6" className="bg-[#14121B]">6x</option>
                <option value="10" className="bg-[#14121B]">10x</option>
                <option value="12" className="bg-[#14121B]">12x</option>
              </select>
            </div>
          )}

          {type === 'bill' && (
            <div>
              <label className="block text-xs font-semibold text-[#EFEAFF]/80 mb-1">
                Categoria
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#241A30] bg-[#0B0B0E] text-[#EFEAFF] focus:border-[#51307A] focus:outline-none transition-all font-medium"
              >
                <option value="Moradia" className="bg-[#14121B]">Moradia</option>
                <option value="Cartão" className="bg-[#14121B]">Cartão</option>
                <option value="Família" className="bg-[#14121B]">Família</option>
                <option value="Saúde" className="bg-[#14121B]">Saúde</option>
                <option value="Planos" className="bg-[#14121B]">Planos</option>
                <option value="Pets" className="bg-[#14121B]">Pets</option>
                <option value="Outros" className="bg-[#14121B]">Outros</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#EFEAFF]/80 mb-1">
              Observação (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: Compra no app"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#241A30] bg-[#0B0B0E] text-[#EFEAFF] placeholder:text-[#EFEAFF]/40 focus:border-[#51307A] focus:outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 rounded-xl border border-[#241A30] bg-[#241A30]/40 text-xs font-semibold text-[#EFEAFF]/70 hover:bg-[#241A30] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 rounded-xl bg-[#51307A] hover:bg-[#51307A]/80 text-[#EFEAFF] text-xs font-bold transition-all shadow-md shadow-[#51307A]/40"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
