import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import HeaderBar from './components/HeaderBar';
import NewExpenseModal from './components/NewExpenseModal';
import PinLockScreen from './components/PinLockScreen';

// Views
import InicioView from './views/InicioView';
import CartoesView from './views/CartoesView';
import ReceitasView from './views/ReceitasView';
import DespesasView from './views/DespesasView';
import SaudeFinanceiraView from './views/SaudeFinanceiraView';
import MetasView from './views/MetasView';
import PatrimonioView from './views/PatrimonioView';
import ParceladasView from './views/ParceladasView';
import ConfiguracoesView from './views/ConfiguracoesView';

const INITIAL_MONTHS = {
  '2026-09': {
    key: '2026-09',
    mesNome: 'Setembro de 2026',
    status: 'fechado',
    receita: 6500.00,
    totalPrevisto: 3820.00,
    totalPago: 3820.00,
    sobraPrevista: 2680.00,
    contas: [
      { id: 's1', nome: 'Cartão Platinum', categoria: 'Cartão', valorPrevisto: 950.00, dia: 5, pago: true, observacao: 'Fatura de Setembro' },
      { id: 's2', nome: 'Cartão Digital', categoria: 'Cartão', valorPrevisto: 420.00, dia: 10, pago: true, observacao: '' },
      { id: 's3', nome: 'Aluguel Apartamento', categoria: 'Moradia', valorPrevisto: 1800.00, dia: 7, pago: true, observacao: '' },
      { id: 's4', nome: 'Energia Elétrica', categoria: 'Moradia', valorPrevisto: 180.00, dia: 12, pago: true, observacao: '' },
      { id: 's5', nome: 'Internet Fibra', categoria: 'Moradia', valorPrevisto: 120.00, dia: 15, pago: true, observacao: '' },
      { id: 's6', nome: 'Plano de Saúde', categoria: 'Saúde', valorPrevisto: 350.00, dia: 18, pago: true, observacao: '' }
    ],
    categorias: [
      { name: 'Moradia', value: 2100, percent: 32.3, color: '#3D2860' },
      { name: 'Cartões', value: 1370, percent: 21.1, color: '#7B4FA6' },
      { name: 'Saúde', value: 350, percent: 5.4, color: '#8A5FC9' }
    ],
    installments: []
  },
  '2026-10': {
    key: '2026-10',
    mesNome: 'Outubro de 2026',
    status: 'fechado',
    receita: 6500.00,
    totalPrevisto: 3910.00,
    totalPago: 3910.00,
    sobraPrevista: 2590.00,
    contas: [
      { id: 'o1', nome: 'Cartão Platinum', categoria: 'Cartão', valorPrevisto: 1020.00, dia: 5, pago: true, observacao: 'Fatura Paga' },
      { id: 'o2', nome: 'Cartão Digital', categoria: 'Cartão', valorPrevisto: 440.00, dia: 10, pago: true, observacao: '' },
      { id: 'o3', nome: 'Aluguel Apartamento', categoria: 'Moradia', valorPrevisto: 1800.00, dia: 7, pago: true, observacao: '' },
      { id: 'o4', nome: 'Energia Elétrica', categoria: 'Moradia', valorPrevisto: 180.00, dia: 12, pago: true, observacao: '' },
      { id: 'o5', nome: 'Internet Fibra', categoria: 'Moradia', valorPrevisto: 120.00, dia: 15, pago: true, observacao: '' },
      { id: 'o6', nome: 'Plano de Saúde', categoria: 'Saúde', valorPrevisto: 350.00, dia: 18, pago: true, observacao: '' }
    ],
    categorias: [
      { name: 'Moradia', value: 2100, percent: 32.3, color: '#3D2860' },
      { name: 'Cartões', value: 1460, percent: 22.5, color: '#7B4FA6' },
      { name: 'Saúde', value: 350, percent: 5.4, color: '#8A5FC9' }
    ],
    installments: []
  },
  '2026-11': {
    key: '2026-11',
    mesNome: 'Novembro de 2026',
    status: 'atual',
    receita: 6500.00,
    totalPrevisto: 3890.00,
    totalPago: 2440.00,
    sobraPrevista: 2610.00,
    contas: [
      { id: 'demo-1', nome: 'Aluguel Apartamento', categoria: 'Moradia', valorPrevisto: 1800.00, dia: 7, pago: true, observacao: 'Exemplo demonstrativo' },
      { id: 'demo-2', nome: 'Cartão Platinum', categoria: 'Cartão', valorPrevisto: 1120.00, dia: 5, pago: false, observacao: '' },
      { id: 'demo-3', nome: 'Cartão Digital', categoria: 'Cartão', valorPrevisto: 330.00, dia: 10, pago: false, observacao: '' },
      { id: 'demo-4', nome: 'Energia Elétrica', categoria: 'Moradia', valorPrevisto: 170.00, dia: 12, pago: true, observacao: '' },
      { id: 'demo-5', nome: 'Internet Fibra', categoria: 'Moradia', valorPrevisto: 120.00, dia: 15, pago: true, observacao: '' },
      { id: 'demo-6', nome: 'Plano de Saúde', categoria: 'Saúde', valorPrevisto: 350.00, dia: 18, pago: true, observacao: '' }
    ],
    categorias: [
      { name: 'Moradia', value: 2090, percent: 32.2, color: '#3D2860' },
      { name: 'Cartões', value: 1450, percent: 22.3, color: '#7B4FA6' },
      { name: 'Saúde', value: 350, percent: 5.4, color: '#8A5FC9' }
    ],
    installments: []
  },
  '2026-12': {
    key: '2026-12',
    mesNome: 'Dezembro de 2026',
    status: 'previsao',
    receita: 6500.00,
    totalPrevisto: 3890.00,
    totalPago: 0,
    sobraPrevista: 2610.00,
    contas: [
      { id: 'd1', nome: 'Aluguel Apartamento', categoria: 'Moradia', valorPrevisto: 1800.00, dia: 7, pago: false, observacao: '' },
      { id: 'd2', nome: 'Cartão Platinum', categoria: 'Cartão', valorPrevisto: 1120.00, dia: 5, pago: false, observacao: '' },
      { id: 'd3', nome: 'Cartão Digital', categoria: 'Cartão', valorPrevisto: 330.00, dia: 10, pago: false, observacao: '' },
      { id: 'd4', nome: 'Energia Elétrica', categoria: 'Moradia', valorPrevisto: 170.00, dia: 12, pago: false, observacao: '' },
      { id: 'd5', nome: 'Internet Fibra', categoria: 'Moradia', valorPrevisto: 120.00, dia: 15, pago: false, observacao: '' },
      { id: 'd6', nome: 'Plano de Saúde', categoria: 'Saúde', valorPrevisto: 350.00, dia: 18, pago: false, observacao: '' }
    ],
    categorias: [
      { name: 'Moradia', value: 2090, percent: 32.2, color: '#3D2860' },
      { name: 'Cartões', value: 1450, percent: 22.3, color: '#7B4FA6' },
      { name: 'Saúde', value: 350, percent: 5.4, color: '#8A5FC9' }
    ],
    installments: []
  }
};

const MONTH_KEYS = ['2026-09', '2026-10', '2026-11', '2026-12'];

export default function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [months, setMonths] = useState(INITIAL_MONTHS);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(2); // '2026-11'
  const [activeTab, setActiveTab] = useState('inicio');
  const [selectedDay, setSelectedDay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [hideValues, setHideValues] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeKey = MONTH_KEYS[currentMonthIndex] || '2026-11';
  const currentMonthData = months[activeKey] || months['2026-11'];

  const handlePrevMonth = () => {
    if (currentMonthIndex > 0) {
      setCurrentMonthIndex(prev => prev - 1);
      setSelectedDay(null);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex < MONTH_KEYS.length - 1) {
      setCurrentMonthIndex(prev => prev + 1);
      setSelectedDay(null);
    }
  };

  const syncWithGoogleSheets = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/finances');
      if (res.ok) {
        const payload = await res.json();
        if (payload && payload.monthsHistory) {
          setMonths(payload.monthsHistory);
        }
      }
    } catch (e) {
    } finally {
      setTimeout(() => setIsSyncing(false), 300);
    }
  };

  useEffect(() => {
    syncWithGoogleSheets();
  }, []);

  const handleTogglePago = (contaIdOrName) => {
    setMonths(prev => {
      const updatedTarget = { ...prev[activeKey] };
      updatedTarget.contas = updatedTarget.contas.map(conta => {
        if (conta.id === contaIdOrName || conta.nome === contaIdOrName) {
          return { ...conta, pago: !conta.pago };
        }
        return conta;
      });
      return { ...prev, [activeKey]: updatedTarget };
    });
  };

  const handleAddExpense = (newEntry) => {
    setMonths(prev => {
      const updatedTarget = { ...prev[activeKey] };
      let updatedInstallments = updatedTarget.installments || [];

      if (newEntry.parcelas && newEntry.parcelas > 1) {
        const newInst = {
          title: newEntry.nome,
          category: newEntry.categoria || 'Cartão',
          current: 1,
          total: newEntry.parcelas,
          monthlyValue: (newEntry.valorPrevisto / newEntry.parcelas),
          remainingTotal: newEntry.valorPrevisto,
          endDate: `Mês +${newEntry.parcelas}`
        };
        updatedInstallments = [newInst, ...updatedInstallments];
      }

      const newConta = {
        id: Date.now().toString(),
        nome: newEntry.nome,
        categoria: newEntry.categoria || 'Cartão',
        valorPrevisto: newEntry.valorPrevisto,
        dia: newEntry.dia,
        pago: false,
        observacao: newEntry.observacao || ''
      };

      updatedTarget.contas = [newConta, ...updatedTarget.contas];
      updatedTarget.totalPrevisto += newEntry.valorPrevisto;
      updatedTarget.sobraPrevista = updatedTarget.receita - updatedTarget.totalPrevisto;
      updatedTarget.installments = updatedInstallments;

      return { ...prev, [activeKey]: updatedTarget };
    });
  };

  return (
    <div className="min-h-screen bg-[#0B0B0E] text-[#EFEAFF] font-sans selection:bg-[#51307A] selection:text-white">
      {/* PIN Security Overlay */}
      {isLocked && <PinLockScreen onUnlock={() => setIsLocked(false)} />}

      {/* Lateral Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onLock={() => {
          localStorage.removeItem('finance_trusted_device');
          setIsLocked(true);
        }}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header Bar with Month Switcher */}
        <HeaderBar
          activeTab={activeTab}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenNewExpense={() => setIsModalOpen(true)}
          hideValues={hideValues}
          onToggleHideValues={() => setHideValues(prev => !prev)}
          isSyncing={isSyncing}
          onSync={syncWithGoogleSheets}
          currentMonthData={currentMonthData}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          monthKeys={MONTH_KEYS}
          currentMonthIndex={currentMonthIndex}
        />

        {/* Dynamic Views based on activeTab & selectedMonth */}
        <main className="flex-1 px-4 sm:px-8 py-6">
          {activeTab === 'inicio' && (
            <InicioView
              data={currentMonthData}
              hideValues={hideValues}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
              onTogglePago={handleTogglePago}
              onOpenNewExpense={() => setIsModalOpen(true)}
            />
          )}

          {activeTab === 'cartoes' && (
            <CartoesView
              onOpenNewExpense={() => setIsModalOpen(true)}
            />
          )}

          {activeTab === 'receitas' && (
            <ReceitasView />
          )}

          {activeTab === 'despesas' && (
            <DespesasView
              contas={currentMonthData.contas}
              onTogglePago={handleTogglePago}
              onOpenNewExpense={() => setIsModalOpen(true)}
            />
          )}

          {activeTab === 'saude' && (
            <SaudeFinanceiraView />
          )}

          {activeTab === 'metas' && (
            <MetasView />
          )}

          {activeTab === 'patrimonio' && (
            <PatrimonioView />
          )}

          {activeTab === 'parceladas' && (
            <ParceladasView
              installments={currentMonthData.installments || []}
              onAddInstallment={handleAddExpense}
            />
          )}

          {activeTab === 'configuracoes' && (
            <ConfiguracoesView
              onLock={() => {
                localStorage.removeItem('finance_trusted_device');
                setIsLocked(true);
              }}
            />
          )}
        </main>
      </div>

      {/* Add Expense Modal */}
      <NewExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddExpense}
      />
    </div>
  );
}
