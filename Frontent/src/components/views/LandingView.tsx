import React, { useState } from 'react';
import { useStockSense } from '../../context/StockSenseContext';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Layers,
  Shield,
  Box,
  Truck,
  TrendingUp,
  BarChart3,
  Package,
  Zap,
  Star,
  Building2,
  Sliders,
  Play,
  UserCheck,
  Warehouse as WarehouseIcon,
  ShieldCheck,
  Clock,
  ArrowDownLeft,
  ArrowLeftRight,
  Database,
  QrCode,
  Lock,
  User,
  Check
} from 'lucide-react';

export const LandingView: React.FC = () => {
  const { setActiveView, showToast, login } = useStockSense();

  const [simulationTab, setSimulationTab] = useState<'inbound' | 'outbound' | 'locations' | 'matrix'>('inbound');
  const [demoEmail, setDemoEmail] = useState('');

  // 1-Click Demo Login Handlers
  const handleGoogleSignIn = async () => {
    try {
      showToast('Connecting with Google Workspace SSO...', 'info');
      await login('alex.rivera@invexa.io', 'Admin@123', 'Inventory Manager');
      showToast('Signed in via Google Workspace (Alex Rivera - Manager)', 'success');
      setActiveView('dashboard');
    } catch {
      setActiveView('dashboard');
    }
  };

  const handleAdminDemoLogin = async () => {
    try {
      showToast('Logging in as Enterprise Admin / Inventory Manager...', 'info');
      await login('alex.rivera', 'Admin@123', 'Inventory Manager');
      showToast('Welcome Alex Rivera (Inventory Manager)', 'success');
      setActiveView('dashboard');
    } catch {
      setActiveView('dashboard');
    }
  };

  const handleStaffDemoLogin = async () => {
    try {
      showToast('Logging in as Warehouse Staff / Floor Operator...', 'info');
      await login('staff.operator', 'Operator@123', 'Warehouse Operator');
      showToast('Welcome Priya Sharma (Warehouse Floor Operator)', 'success');
      setActiveView('dashboard');
    } catch {
      setActiveView('dashboard');
    }
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoEmail.trim()) {
      showToast('Please enter your corporate email address', 'warning');
      return;
    }
    showToast(`Thank you! A solution architect will contact ${demoEmail} within 15 minutes.`, 'success');
    setDemoEmail('');
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 font-sans antialiased overflow-x-hidden">
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('landing')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-1 flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <img src="/invexa_logo.png" alt="INVEXA Logo" className="w-full h-full object-contain brightness-0 invert" />
            </div>
            <div className="flex items-center gap-2">
              <div>
                <span className="text-xl font-black tracking-tight text-slate-900">INVEXA</span>
                <span className="block text-[9px] uppercase font-bold tracking-widest text-blue-600">Smart Inventory ERP</span>
              </div>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                ENTERPRISE
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#operations" className="hover:text-blue-600 transition-colors">Operations</a>
            <a href="#warehouses" className="hover:text-blue-600 transition-colors">Warehouses & Locations</a>
            <a href="#integrations" className="hover:text-blue-600 transition-colors">Integrations</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveView('auth')}
              className="text-xs font-bold text-slate-700 hover:text-blue-600 px-3 py-2 cursor-pointer transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={handleAdminDemoLogin}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-extrabold shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer transition-all hover:shadow-blue-500/30 transform hover:-translate-y-0.5"
            >
              <span>Instant Live Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-10 sm:pt-14 pb-20 bg-gradient-to-b from-blue-50/50 via-white to-slate-50/60 overflow-hidden">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-blue-200/40 via-indigo-200/30 to-sky-200/30 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Release Badge */}
          <div
            onClick={() => setActiveView('auth')}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-6 shadow-2xs hover:border-blue-300 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>ENTERPRISE INVENTORY MATRIX v2.4 RELEASED</span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.08] max-w-5xl mx-auto">
            Smart Inventory. Simple Control. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500">
              Built for Scale.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-sm sm:text-base lg:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
            Empower your enterprise supply chain with real-time multi-warehouse balance, zero-drift internal transfers, automated receipts, delivery dispatching, and cryptographic audit logs.
          </p>

          {/* 3 INSTANT DEMO & SSO BUTTONS */}
          <div className="mt-8 max-w-3xl mx-auto p-4 sm:p-5 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl shadow-blue-500/5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 text-center flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>One-Click Instant Access & Demo Roles</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* BUTTON 1: GOOGLE SSO */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 text-slate-800 text-xs font-bold transition-all shadow-2xs hover:shadow-md cursor-pointer group"
              >
                {/* Google Multi-Color SVG */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <div className="text-left">
                  <span className="block leading-tight font-extrabold text-slate-900">Sign in with Google</span>
                  <span className="block text-[10px] text-slate-500 font-normal">Workspace SSO</span>
                </div>
              </button>

              {/* BUTTON 2: INVENTORY MANAGER */}
              <button
                type="button"
                onClick={handleAdminDemoLogin}
                className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 cursor-pointer"
              >
                <Shield className="w-4 h-4 text-blue-200 shrink-0" />
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="leading-tight font-extrabold text-white">Inventory Manager</span>
                    <span className="px-1.5 py-0.2 bg-white/20 text-white text-[9px] font-bold rounded">MANAGER</span>
                  </div>
                  <span className="block text-[10px] text-blue-100 font-normal">Incoming & Outgoing Stock</span>
                </div>
              </button>

              {/* BUTTON 3: WAREHOUSE STAFF */}
              <button
                type="button"
                onClick={handleStaffDemoLogin}
                className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md shadow-slate-900/20 cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="leading-tight font-extrabold text-white">Warehouse Staff</span>
                    <span className="px-1.5 py-0.2 bg-emerald-500/30 text-emerald-300 text-[9px] font-bold rounded">STAFF</span>
                  </div>
                  <span className="block text-[10px] text-slate-300 font-normal">Transfers, Picking & Counting</span>
                </div>
              </button>
            </div>
          </div>

          {/* Trust points */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Instant Demo Access
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Sub-Second Stock Sync
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Enterprise Role Permissions
            </span>
          </div>

          {/* 3. HERO SHOWCASE MOCKUP CARD */}
          <div className="mt-12 max-w-6xl mx-auto relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-950 group">
            {/* Background Warehouse Photo with Overlay */}
            <div
              className="h-[380px] sm:h-[480px] lg:h-[540px] bg-cover bg-center relative flex flex-col justify-between p-4 sm:p-6 lg:p-8"
              style={{ backgroundImage: `url('/warehouse1.jpg')` }}
            >
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-950/40 backdrop-blur-[1px]" />

              {/* Top Floating Status Tags on Photo */}
              <div className="relative z-20 flex items-center justify-between text-xs font-bold text-white">
                <span className="px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/20 flex items-center gap-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  📍 WAREHOUSE 01: MAIN MATRIX (WH-001)
                </span>
                <span className="px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/20 text-slate-200 font-mono text-[11px]">
                  894 ACTIVE SKUS | TEMP 18.5°C
                </span>
              </div>

              {/* Center Floating Glassmorphic ERP Monitor Card */}
              <div className="relative z-20 max-w-4xl mx-auto w-full bg-white/95 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/40 text-slate-900 text-left">
                {/* Window Header */}
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                    <span className="ml-2 text-xs font-extrabold text-slate-800">
                      INVEXA Core v2.4 — Live System Monitor
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded">
                      WH-001 (MAIN HUB)
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    SYSTEM ACCURACY: 99.98%
                  </span>
                </div>

                {/* 4 KPI Metric Pills */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Inbound Receipts</div>
                    <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                      14 <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">Today</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">Dock verification queue</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Internal Transfers</div>
                    <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                      29 <span className="text-xs font-semibold text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded">Active</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">Multi-rack rebalancing</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Delivery Orders</div>
                    <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                      112 <span className="text-xs font-semibold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">Moving</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">Outbound dispatch bays</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Stock Drift Variance</div>
                    <div className="text-xl font-extrabold text-emerald-600 mt-0.5">0.00%</div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[99.98%]" />
                    </div>
                  </div>
                </div>

                {/* Mini Transfer Log Table Preview */}
                <div className="overflow-hidden rounded-xl border border-slate-200 text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100/80 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Reference</th>
                        <th className="py-2 px-3">Type</th>
                        <th className="py-2 px-3">From / To Location</th>
                        <th className="py-2 px-3">Qty</th>
                        <th className="py-2 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 text-[11px] font-medium bg-white">
                      <tr>
                        <td className="py-2 px-3 font-bold text-slate-900">WH-001-TRF-882</td>
                        <td className="py-2 px-3"><span className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-semibold">Transfer</span></td>
                        <td className="py-2 px-3">Rack A ➔ Production Floor</td>
                        <td className="py-2 px-3 font-mono">450 Units</td>
                        <td className="py-2 px-3 text-right"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">In Transit</span></td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-bold text-slate-900">WH-001-REC-019</td>
                        <td className="py-2 px-3"><span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">Receiving</span></td>
                        <td className="py-2 px-3">Vendor Dock 1 ➔ Staging B</td>
                        <td className="py-2 px-3 font-mono">1,200 Units</td>
                        <td className="py-2 px-3 text-right"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">Ready</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bottom Warehouse Location Badge */}
              <div className="relative z-20 text-center text-[10px] tracking-widest uppercase text-slate-400 font-bold">
                TRUSTED BY 2,500+ ENTERPRISE DISTRIBUTION CENTERS & LOGISTICS NETWORKS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CLIENT LOGO TRUST BANNER */}
      <section className="py-8 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-6">
            TRUSTED BY 2,500+ ENTERPRISE DISTRIBUTION CENTERS & LOGISTICS NETWORKS
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-85 text-slate-300 font-bold text-sm sm:text-base tracking-wider">
            <span className="flex items-center gap-2 hover:opacity-100 transition-opacity">
              <Zap className="w-5 h-5 text-blue-400" /> AEROLOGIX
            </span>
            <span className="flex items-center gap-2 hover:opacity-100 transition-opacity">
              <Building2 className="w-5 h-5 text-sky-400" /> MULTIWAY WH
            </span>
            <span className="flex items-center gap-2 hover:opacity-100 transition-opacity">
              <Package className="w-5 h-5 text-indigo-400" /> GAMBA GLOBAL
            </span>
            <span className="flex items-center gap-2 hover:opacity-100 transition-opacity">
              <Truck className="w-5 h-5 text-emerald-400" /> TRANS-GLOBAL
            </span>
            <span className="flex items-center gap-2 hover:opacity-100 transition-opacity">
              <Sliders className="w-5 h-5 text-purple-400" /> KINETIC SUPPLY
            </span>
          </div>
        </div>
      </section>

      {/* 5. SECTION 1: ARCHITECTURE / MODULE CARDS */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 inline-block mb-3">
            ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Engineered for Multi-Zone Warehouse Orchestration
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Eliminate stock discrepancies, unmanaged internal moves, and synchronize stores with physical rack locations using native three-state automation.
          </p>

          {/* 4 Feature Cards */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {/* Card 01 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs">
                  <WarehouseIcon className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">MODULE 01</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Warehousing Rack Hierarchy</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Structure multi-warehouses into Zone, Rack, Shelf, and Bin. Auto-generate spatial 2D barcodes for instant handheld scanner mapping.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-all">
                <span>WH-STRUCTURE</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Card 02 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center mb-5 group-hover:bg-sky-600 group-hover:text-white transition-all shadow-2xs">
                  <Box className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">MODULE 02</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Inbound Receipts (WH-IN)</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Direct vendor dock management with rapid 3-step stock verification. Draft ➔ Ready ➔ Done. Single-click batch reception & QA level release.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-600 group-hover:translate-x-1 transition-all">
                <span>RECEIVING DOCK</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Card 03 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-2xs">
                  <Truck className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">MODULE 03</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Delivery Orders (WH-OUT)</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Automate picking lists, batch authorization, and stock reservation. Prevent negative stock dispatch before items arrive at outbound loading bays.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-all">
                <span>DISPATCH ENGINE</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Card 04 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center mb-5 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-2xs">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">MODULE 04</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Zero-Drift Stock Matrix</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cryptographic double-entry inventory ledger. Moving physical unit never breaks balance logs or audit history.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-all">
                <span>LEDGER MATRIX</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECTION 2: INTERACTIVE LIVE SIMULATION */}
      <section id="operations" className="py-20 bg-slate-50 border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 inline-block mb-3">
            LIVE SIMULATION
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Deep-Dive Into Operational Workflows
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Switch between core ERP modules to view simulated live stock, automated reservation rules, and emergency replenishment flows.
          </p>

          {/* Interactive Simulation Tabs */}
          <div className="mt-10 flex flex-wrap justify-center gap-2 p-1.5 bg-slate-200/70 rounded-full max-w-3xl mx-auto text-xs font-bold">
            <button
              onClick={() => setSimulationTab('inbound')}
              className={`px-5 py-2.5 rounded-full transition-all cursor-pointer ${
                simulationTab === 'inbound'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vendor Inbound Queue
            </button>
            <button
              onClick={() => setSimulationTab('outbound')}
              className={`px-5 py-2.5 rounded-full transition-all cursor-pointer ${
                simulationTab === 'outbound'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              WH-OUT Delivery
            </button>
            <button
              onClick={() => setSimulationTab('locations')}
              className={`px-5 py-2.5 rounded-full transition-all cursor-pointer ${
                simulationTab === 'locations'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rack & Locations
            </button>
            <button
              onClick={() => setSimulationTab('matrix')}
              className={`px-5 py-2.5 rounded-full transition-all cursor-pointer ${
                simulationTab === 'matrix'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Stock Balance Matrix
            </button>
          </div>

          {/* Dynamic Tab Box Content */}
          <div className="mt-8 max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-left">
            {simulationTab === 'inbound' && (
              <div className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      Vendor Inbound Queue
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-700">12 Pending Receiving</span>
                    </h4>
                    <p className="text-xs text-slate-500">Live vendor deliveries undergoing dock scan & QA checks.</p>
                  </div>
                  <button
                    onClick={() => setActiveView('receipts')}
                    className="btn btn-primary text-xs flex items-center gap-1.5"
                  >
                    <span>Open Inbound Module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold border-b border-slate-200">
                        <th className="p-3">Reference ID</th>
                        <th className="p-3">Supplier Partner</th>
                        <th className="p-3">Destination Facility</th>
                        <th className="p-3">Scheduled Date</th>
                        <th className="p-3 text-right">Operation Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-3 font-mono font-bold text-blue-600">WH/IN/0001</td>
                        <td className="p-3 font-bold text-slate-900">Tata Steel Industrial Ltd</td>
                        <td className="p-3">Main Distribution Warehouse</td>
                        <td className="p-3 font-mono text-slate-500">2026-09-27</td>
                        <td className="p-3 text-right"><span className="badge badge-ready">Ready for Docking</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-blue-600">WH/IN/0002</td>
                        <td className="p-3 font-bold text-slate-900">Foxconn Electronics Component</td>
                        <td className="p-3">Kalol Production Warehouse</td>
                        <td className="p-3 font-mono text-slate-500">2026-09-28</td>
                        <td className="p-3 text-right"><span className="badge badge-waiting">Waiting Inspection</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {simulationTab === 'outbound' && (
              <div className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      Outbound Customer Dispatch
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">8 Dispatching Bays</span>
                    </h4>
                    <p className="text-xs text-slate-500">Pick, pack, weigh, and carrier handover with real-time stock deduction.</p>
                  </div>
                  <button
                    onClick={() => setActiveView('deliveries')}
                    className="btn btn-primary text-xs flex items-center gap-1.5"
                  >
                    <span>Open Delivery Module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold border-b border-slate-200">
                        <th className="p-3">Order Code</th>
                        <th className="p-3">Customer Entity</th>
                        <th className="p-3">Dispatch Facility</th>
                        <th className="p-3">Assigned Carrier</th>
                        <th className="p-3 text-right">Fulfillment Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-3 font-mono font-bold text-indigo-600">WH/OUT/0001</td>
                        <td className="p-3 font-bold text-slate-900">Skyline Infrastructure Pvt Ltd</td>
                        <td className="p-3">Main Distribution Warehouse</td>
                        <td className="p-3">BlueDart Logistics (Express Air)</td>
                        <td className="p-3 text-right"><span className="badge badge-done">Stock Deducted</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-indigo-600">WH/OUT/0002</td>
                        <td className="p-3 font-bold text-slate-900">Apex Robotics Assembly</td>
                        <td className="p-3">Express Transit Hub</td>
                        <td className="p-3">Delhivery Surface Cargo</td>
                        <td className="p-3 text-right"><span className="badge badge-ready">Staged at Bay 4</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {simulationTab === 'locations' && (
              <div className="p-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Zone & Storage Rack Mapping</h4>
                    <p className="text-xs text-slate-500">Spatial telemetry across aisles, shelves, and heavy-duty staging racks.</p>
                  </div>
                  <button
                    onClick={() => setActiveView('warehouses')}
                    className="btn btn-primary text-xs flex items-center gap-1.5"
                  >
                    <span>View All Warehouses</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-blue-600">LOC-001</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">82% Full</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900">Rack A — Heavy Metals</div>
                    <div className="text-[10px] text-slate-500 mt-1">Aisle 01 • Shelf A-01/02</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-blue-600">LOC-002</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">64% Full</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900">Rack B — Finished Furniture</div>
                    <div className="text-[10px] text-slate-500 mt-1">Aisle 02 • Shelf B-01/03</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-blue-600">LOC-003</span>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">45% Full</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900">Rack C — Electronics & IT</div>
                    <div className="text-[10px] text-slate-500 mt-1">Aisle 03 • Secure Cage C-01</div>
                  </div>
                </div>
              </div>
            )}

            {simulationTab === 'matrix' && (
              <div className="p-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Stock Balance Matrix</h4>
                    <p className="text-xs text-slate-500">Real-time breakdown of Total On-Hand, Reserved, and Free Available Stock.</p>
                  </div>
                  <button
                    onClick={() => setActiveView('stock')}
                    className="btn btn-primary text-xs flex items-center gap-1.5"
                  >
                    <span>Inspect Stock Matrix</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Total Catalog SKUs</div>
                    <div className="text-xl font-bold text-slate-900 mt-1">12 Items</div>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200">
                    <div className="text-[10px] uppercase font-bold text-blue-700">Total Units in Stock</div>
                    <div className="text-xl font-bold text-blue-700 mt-1">6,493 Units</div>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200">
                    <div className="text-[10px] uppercase font-bold text-amber-700">Reserved for Orders</div>
                    <div className="text-xl font-bold text-amber-700 mt-1">425 Units</div>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
                    <div className="text-[10px] uppercase font-bold text-emerald-700">Free to Deliver</div>
                    <div className="text-xl font-bold text-emerald-700 mt-1">6,068 Units</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. WAREHOUSES & HUBS SHOWCASE */}
      <section id="warehouses" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 inline-block mb-3">
              FACILITIES NETWORK
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Synchronized Multi-Hub Operations
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Manage central distribution centers, production warehouses, and cross-dock transit facilities from a single unified control plane.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-5 hover:border-blue-300 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">WH-001</span>
                <span className="badge badge-done">Active</span>
              </div>
              <h3 className="font-bold text-sm text-slate-900">Main Distribution Warehouse</h3>
              <p className="text-xs text-slate-500 mt-1">Gandhinagar, Gujarat • Central Hub</p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Capacity</span>
                <span className="font-bold text-slate-900">15,000 m³</span>
              </div>
            </div>

            <div className="card p-5 hover:border-blue-300 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">WH-002</span>
                <span className="badge badge-done">Active</span>
              </div>
              <h3 className="font-bold text-sm text-slate-900">Kalol Production Warehouse</h3>
              <p className="text-xs text-slate-500 mt-1">Kalol, Gujarat • Production & Assembly</p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Capacity</span>
                <span className="font-bold text-slate-900">8,500 m³</span>
              </div>
            </div>

            <div className="card p-5 hover:border-blue-300 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">WH-003</span>
                <span className="badge badge-done">Active</span>
              </div>
              <h3 className="font-bold text-sm text-slate-900">Express Transit Hub</h3>
              <p className="text-xs text-slate-500 mt-1">Ahmedabad, Gujarat • Cross-Dock</p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Capacity</span>
                <span className="font-bold text-slate-900">5,000 m³</span>
              </div>
            </div>

            <div className="card p-5 hover:border-blue-300 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">WH-004</span>
                <span className="badge badge-done">Active</span>
              </div>
              <h3 className="font-bold text-sm text-slate-900">Central Staging Facility</h3>
              <p className="text-xs text-slate-500 mt-1">Vadodara, Gujarat • Secure Storage</p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Capacity</span>
                <span className="font-bold text-slate-900">4,200 m³</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. INTEGRATIONS & CONNECTIVITY */}
      <section id="integrations" className="py-20 bg-slate-50 border-t border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 inline-block mb-3">
            INTEGRATIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Connects With Your Existing Supply Chain Stack
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Seamlessly sync orders, carriers, RFID tags, and barcodes with RESTful API webhooks and EDI protocols.
          </p>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-2">
              <QrCode className="w-8 h-8 text-blue-600" />
              <span className="text-xs font-bold text-slate-800">Zebra Scanners</span>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-2">
              <Truck className="w-8 h-8 text-indigo-600" />
              <span className="text-xs font-bold text-slate-800">BlueDart & FedEx</span>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-2">
              <Database className="w-8 h-8 text-sky-600" />
              <span className="text-xs font-bold text-slate-800">SAP & Oracle EDI</span>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-2">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
              <span className="text-xs font-bold text-slate-800">Google SSO & SAML</span>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-2">
              <Sliders className="w-8 h-8 text-purple-600" />
              <span className="text-xs font-bold text-slate-800">REST Webhooks</span>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-2">
              <Layers className="w-8 h-8 text-blue-700" />
              <span className="text-xs font-bold text-slate-800">Shopify & WMS</span>
            </div>
          </div>
        </div>
      </section>

      {/* 9. BOTTOM CALL TO ACTION */}
      <section className="py-20 bg-gradient-to-b from-white via-blue-50/40 to-slate-100 border-t border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-blue-100 shadow-2xl shadow-blue-500/10">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 inline-block mb-4">
              ENTERPRISE PLATFORM • INSTANT TRIAL
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Modernize your warehouse operations today.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Connect your ERP, barcode scanners, and freight carriers to the highest-velocity smart inventory ledger.
            </p>

            {/* Email Input Form */}
            <form onSubmit={handleDemoSubmit} className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row items-center gap-2">
              <input
                type="email"
                required
                placeholder="Enter your corporate email address..."
                value={demoEmail}
                onChange={(e) => setDemoEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm"
              />
              <button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl text-xs font-extrabold shadow-md shadow-blue-500/20 shrink-0 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                Request Live Demo
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-600">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Sign in with Google
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={handleAdminDemoLogin}
                className="text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Try Admin Demo
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={handleStaffDemoLogin}
                className="text-slate-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Try Staff Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800 text-xs">
            {/* Column 1: Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('landing')}>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 p-1 flex items-center justify-center shadow-md">
                  <img src="/invexa_logo.png" alt="INVEXA Logo" className="w-full h-full object-contain brightness-0 invert" />
                </div>
                <div>
                  <span className="text-lg font-black tracking-tight text-white">INVEXA</span>
                  <span className="block text-[8px] uppercase font-bold tracking-widest text-blue-400">Smart Inventory ERP</span>
                </div>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                High-velocity enterprise intelligence & real-time stock sync matrix across distribution hubs, production racks, and outbound logistics.
              </p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                All Systems Operational
              </div>
            </div>

            {/* Column 2: Product */}
            <div>
              <div className="font-bold uppercase tracking-wider text-slate-200 mb-3 text-[11px]">PRODUCT</div>
              <ul className="space-y-2 text-[11px]">
                <li><a href="#features" className="hover:text-white transition-colors">Inventory Telemetry</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Replenishment Logic</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Multi-Zone Routing</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">White-Glove Onboarding</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Enterprise Security</a></li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div>
              <div className="font-bold uppercase tracking-wider text-slate-200 mb-3 text-[11px]">RESOURCES</div>
              <ul className="space-y-2 text-[11px]">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security Whitepaper</a></li>
                <li><a href="#" className="hover:text-white transition-colors">System Status</a></li>
              </ul>
            </div>

            {/* Column 4: Compliance */}
            <div>
              <div className="font-bold uppercase tracking-wider text-slate-200 mb-3 text-[11px]">COMPLIANCE</div>
              <ul className="space-y-2 text-[11px]">
                <li>SOC-2 Type II Certified</li>
                <li>GDPR & HIPAA Ready</li>
                <li>256-Bit TLS Encryption</li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
            <div>
              © {new Date().getFullYear()} INVEXA Core v2.4 • Enterprise Inventory ERP. All rights reserved.
            </div>
            <div className="flex items-center gap-6 mt-4 sm:mt-0 font-medium">
              <a href="#" className="hover:text-slate-300">Privacy Policy</a>
              <a href="#" className="hover:text-slate-300">Terms of Service</a>
              <a href="#" className="hover:text-slate-300">Trust Center</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
