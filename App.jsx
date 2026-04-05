import React, { useState } from 'react';
import { useExpenseData } from './ExpenseContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Analytics from './components/Analytics';
import Goals from './components/Goals';
import Budgets from './components/Budgets';
import { LayoutDashboard, Receipt, PieChart, Wallet, Target, Settings2, LogOut } from 'lucide-react';
import './index.css';

function App() {
  const { user, logout } = useExpenseData();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Orb Background Wrapper
  const OrbBackground = () => (
    <div className="bg-orbs">
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>
    </div>
  );

  // Protected Route Logic
  if (!user) {
    return (
      <>
        <OrbBackground />
        <Login />
      </>
    );
  }

  return (
    <>
      <OrbBackground />
      <div className="app-container">
        {/* Sidebar Navigation */}
        <aside className="sidebar">
          <div style={{ marginBottom: '48px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--color-neutral), var(--color-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)' }}>
              <Wallet size={20} />
            </div>
            <h2 style={{ fontSize: '22px', letterSpacing: '1px' }}>Finance<span className="text-gradient">Flow</span></h2>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            <button 
              className={`btn ${activeTab === 'dashboard' ? 'btn-ghost active' : 'btn-ghost'}`} 
              style={{ justifyContent: 'flex-start', background: activeTab === 'dashboard' ? 'rgba(255,255,255,0.08)' : 'transparent' }}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={20} /> Dashboard
            </button>
            
            <button 
              className={`btn ${activeTab === 'transactions' ? 'btn-ghost active' : 'btn-ghost'}`} 
              style={{ justifyContent: 'flex-start', background: activeTab === 'transactions' ? 'rgba(255,255,255,0.08)' : 'transparent' }}
              onClick={() => setActiveTab('transactions')}
            >
              <Receipt size={20} /> Transactions
            </button>
            
            <button 
              className={`btn ${activeTab === 'analytics' ? 'btn-ghost active' : 'btn-ghost'}`} 
              style={{ justifyContent: 'flex-start', background: activeTab === 'analytics' ? 'rgba(255,255,255,0.08)' : 'transparent' }}
              onClick={() => setActiveTab('analytics')}
            >
              <PieChart size={20} /> Analytics & Insights
            </button>

            <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '16px 0' }}></div>

            <button 
              className={`btn ${activeTab === 'budgets' ? 'btn-ghost active' : 'btn-ghost'}`} 
              style={{ justifyContent: 'flex-start', background: activeTab === 'budgets' ? 'rgba(255,255,255,0.08)' : 'transparent' }}
              onClick={() => setActiveTab('budgets')}
            >
              <Settings2 size={20} /> Budget Planner
            </button>

            <button 
              className={`btn ${activeTab === 'goals' ? 'btn-ghost active' : 'btn-ghost'}`} 
              style={{ justifyContent: 'flex-start', background: activeTab === 'goals' ? 'rgba(255,255,255,0.08)' : 'transparent' }}
              onClick={() => setActiveTab('goals')}
            >
              <Target size={20} /> Financial Goals
            </button>
          </nav>
          
          <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--border-subtle)' }}>
             <button className="btn btn-ghost" style={{ justifyContent: 'flex-start', width: '100%', color: 'var(--color-expense)' }} onClick={logout}>
               <LogOut size={20} /> Secure Logout
             </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'transactions' && <Transactions />}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'budgets' && <Budgets />}
          {activeTab === 'goals' && <Goals />}
        </main>
      </div>
    </>
  )
}

export default App;
