import React from 'react';
import {
  LayoutGrid,
  CreditCard,
  ArrowDownLeft,
  ArrowUpRight,
  Activity,
  Flag,
  Landmark,
  Layers,
  Settings,
  Shield,
  LogOut,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ activeTab, onSelectTab, onLock, isOpenMobile, onCloseMobile }) {
  const menuSections = [
    {
      title: null,
      items: [
        { id: 'inicio', label: 'Início', icon: LayoutGrid }
      ]
    },
    {
      title: 'Análise',
      items: [
        { id: 'cartoes', label: 'Cartões', icon: CreditCard, count: '3' },
        { id: 'receitas', label: 'Receitas', icon: ArrowDownLeft },
        { id: 'despesas', label: 'Despesas', icon: ArrowUpRight, count: '12' },
        { id: 'saude', label: 'Saúde Financeira', icon: Activity }
      ]
    },
    {
      title: 'Planejamento',
      items: [
        { id: 'metas', label: 'Metas', icon: Flag },
        { id: 'patrimonio', label: 'Patrimônio', icon: Landmark },
        { id: 'parceladas', label: 'Compras Parceladas', icon: Layers }
      ]
    },
    {
      title: 'Sistema',
      items: [
        { id: 'configuracoes', label: 'Configurações', icon: Settings }
      ]
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0B0B0E] border-r border-[#241A30] flex flex-col justify-between p-4 transition-transform duration-300 lg:translate-x-0 select-none ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header */}
        <div>
          <div className="flex items-center gap-3 px-2 py-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#51307A] flex items-center justify-center text-[#EFEAFF] font-black text-xl shadow-lg shadow-[#51307A]/40 border border-[#51307A]">
              CF
            </div>
            <div>
              <h1 className="text-sm font-black text-[#EFEAFF] tracking-tight leading-tight">
                Controle Financeiro
              </h1>
              <p className="text-[10px] text-[#EFEAFF]/50 font-medium">Painel Pessoal • Luis</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-5">
            {menuSections.map((sec, idx) => (
              <div key={idx}>
                {sec.title && (
                  <p className="px-3 mb-1.5 text-[10px] font-bold text-[#EFEAFF]/40 uppercase tracking-widest">
                    {sec.title}
                  </p>
                )}
                <div className="space-y-1">
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectTab(item.id);
                          if (onCloseMobile) onCloseMobile();
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-[#51307A] text-[#EFEAFF] shadow-md shadow-[#51307A]/30 font-bold'
                            : 'text-[#EFEAFF]/60 hover:text-[#EFEAFF] hover:bg-[#14121B]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-[#EFEAFF]' : 'text-purple-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.count && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                            isActive ? 'bg-[#241A30] text-[#EFEAFF]' : 'bg-[#14121B] text-[#EFEAFF]/60 border border-[#241A30]'
                          }`}>
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer: User profile & Lock */}
        <div className="pt-4 border-t border-[#241A30] space-y-2">
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#14121B] border border-[#241A30]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#51307A] text-[#EFEAFF] font-bold text-xs flex items-center justify-center border border-[#51307A]">
                UD
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#EFEAFF] leading-none">Usuário Demo</p>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> Online
                </span>
              </div>
            </div>

            <button
              onClick={onLock}
              className="p-1.5 rounded-lg hover:bg-[#241A30] text-[#EFEAFF]/60 hover:text-white transition-colors"
              title="Bloquear Painel (PIN demo: 1234)"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
