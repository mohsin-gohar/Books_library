import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  Layers,
  Sparkles,
  Palette,
  Webhook,
  BarChart3,
  BookOpen,
  RefreshCw,
  Users,
  Award,
  Flame,
  CheckCircle2,
  Lock,
  Globe,
  Settings,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Activity,
  Plus,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { Permissions, DEFAULT_ROLE_PERMISSIONS, EnterpriseSystemRole } from '../../packages/shared/src/types/rbac';

interface EnterpriseAdminDashboardProps {
  onExit?: () => void;
}

type EnterpriseTab =
  | 'multi-tenant'
  | 'rbac'
  | 'modules'
  | 'premium'
  | 'white-label'
  | 'integrations'
  | 'architecture';

export const EnterpriseAdminDashboard: React.FC<EnterpriseAdminDashboardProps> = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState<EnterpriseTab>('multi-tenant');

  // Multi-tenant state
  const [selectedOrg, setSelectedOrg] = useState('oxford');
  const [selectedBranch, setSelectedBranch] = useState('bodleian-main');

  // RBAC state
  const [selectedRole, setSelectedRole] = useState<EnterpriseSystemRole>('Librarian');
  const [customRoleName, setCustomRoleName] = useState('');
  const [roleSearchFilter, setRoleSearchFilter] = useState('');

  // White-labeling state
  const [primaryBrandColor, setPrimaryBrandColor] = useState('#b45309');
  const [brandTitle, setBrandTitle] = useState('Bodleian Archival System');
  const [customDomain, setCustomDomain] = useState('library.ox.ac.uk');
  const [removeBranding, setRemoveBranding] = useState(true);

  // Active module tab within modules view
  const [currentModuleTab, setCurrentModuleTab] = useState<'catalog' | 'circulation' | 'members' | 'reading' | 'analytics' | 'accounting' | 'integrations'>('circulation');

  const allPermissionsList = Object.entries(Permissions);

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col font-sans antialiased">
      {/* Top Enterprise SaaS Bar */}
      <header className="sticky top-0 z-30 bg-stone-950/90 backdrop-blur-md border-b border-stone-800 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 text-stone-950 flex items-center justify-center font-bold text-lg shadow-md">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg text-white">Athenaeum Enterprise SaaS/ERP</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                100M$ Tier Architecture
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Multi-tenant Isolation · 60+ RBAC Permissions · 7 Enterprise Modules · 10K+ Concurrent Scale
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Tenant Switcher Quick Dropdown */}
          <div className="flex items-center gap-2 bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-800 text-xs">
            <Building2 className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-stone-400">Tenant:</span>
            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              className="bg-transparent text-amber-300 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="oxford" className="bg-stone-900 text-white">University of Oxford</option>
              <option value="harvard" className="bg-stone-900 text-white">Harvard University</option>
              <option value="sorbonne" className="bg-stone-900 text-white">Sorbonne Université</option>
              <option value="national-library" className="bg-stone-900 text-white">British Library</option>
            </select>
          </div>

          {onExit && (
            <button
              onClick={onExit}
              className="px-3.5 py-1.5 rounded-xl border border-stone-700 hover:bg-stone-800 text-xs text-stone-300 transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Standard View</span>
            </button>
          )}
        </div>
      </header>

      {/* Navigation Sub-Tabs */}
      <div className="border-b border-stone-800 bg-stone-950/60 px-6 py-2 flex items-center gap-2 overflow-x-auto text-xs">
        {[
          { id: 'multi-tenant', label: '1. Multi-Tenant Hierarchy', icon: Building2 },
          { id: 'rbac', label: '2. RBAC & 60+ Permissions', icon: ShieldCheck },
          { id: 'modules', label: '3. 7 Core SaaS Modules', icon: Layers },
          { id: 'premium', label: '4. Premium Reading Suite', icon: Sparkles },
          { id: 'white-label', label: '5. White-Labeling Engine', icon: Palette },
          { id: 'integrations', label: '6. Webhooks & Integrations', icon: Webhook },
          { id: 'architecture', label: '7. System Scale & Roadmap', icon: Activity }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as EnterpriseTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-amber-600/20 text-amber-400 border border-amber-500/40 shadow-xs'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Workspace */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* ============================================================== */}
        {/* TAB 1: MULTI-TENANT HIERARCHY */}
        {/* ============================================================== */}
        {activeTab === 'multi-tenant' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-semibold">
                  Multi-Tenant Architecture
                </span>
                <h2 className="text-2xl font-serif font-bold text-white mt-1">
                  Hierarchical Multi-Tenant Isolation
                </h2>
                <p className="text-sm text-stone-400 mt-1 max-w-2xl">
                  Row-level tenancy with dynamic database isolation, domain-based routing, and 3-tier structure:
                  <strong className="text-stone-200"> Organization → Campus Branches → Academic Departments</strong>.
                </p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-stone-900 text-stone-300 font-mono text-xs border border-stone-800">
                  Data Shard: EU-CENTRAL-1
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Level 1: Organization */}
              <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-amber-500" />
                    <h3 className="font-serif font-bold text-base text-white">1. Organization</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded">
                    Tier: Consortium
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-900/80 border border-stone-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Name:</span>
                    <span className="font-semibold text-white">University of Oxford</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Tenant Slug:</span>
                    <span className="font-mono text-amber-400">oxford</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Custom Domain:</span>
                    <span className="font-mono text-stone-300">library.ox.ac.uk</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Total Patrons:</span>
                    <span className="font-mono text-white">24,580</span>
                  </div>
                </div>
              </div>

              {/* Level 2: Campus Branches */}
              <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-sky-400" />
                    <h3 className="font-serif font-bold text-base text-white">2. Campus Branches</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded">
                    3 Active
                  </span>
                </div>
                <div className="space-y-2">
                  {[
                    { id: 'bodleian-main', name: 'Bodleian Old Library (Main)', code: 'BOD-01', copies: 14200 },
                    { id: 'radcliffe', name: 'Radcliffe Camera Science Lib', code: 'RAD-02', copies: 6800 },
                    { id: 'weston', name: 'Weston Special Collections', code: 'WES-03', copies: 3580 }
                  ].map((branch) => (
                    <button
                      key={branch.id}
                      onClick={() => setSelectedBranch(branch.id)}
                      className={`w-full p-2.5 rounded-xl text-left text-xs transition-colors border ${
                        selectedBranch === branch.id
                          ? 'bg-sky-500/10 border-sky-500/40 text-white'
                          : 'bg-stone-900/60 border-stone-800/80 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <div className="flex justify-between font-medium">
                        <span>{branch.name}</span>
                        <span className="font-mono text-[10px] text-sky-400">{branch.code}</span>
                      </div>
                      <div className="text-[11px] text-stone-500 mt-1">{branch.copies.toLocaleString()} catalog copies</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Level 3: Academic Departments */}
              <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    <h3 className="font-serif font-bold text-base text-white">3. Departments</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded">
                    Department Units
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  {[
                    { name: 'Faculty of Philosophy', code: 'DEP-PHIL', floor: 'Floor 3, Wing A' },
                    { name: 'History & Civilization', code: 'DEP-HIST', floor: 'Floor 2, Wing C' },
                    { name: 'Computer Science & AI', code: 'DEP-CS', floor: 'Wolfson Building' },
                    { name: 'Comparative Literature', code: 'DEP-LIT', floor: 'Taylor Institution' }
                  ].map((dept) => (
                    <div key={dept.code} className="p-2.5 rounded-xl bg-stone-900/60 border border-stone-800 flex justify-between items-center">
                      <div>
                        <div className="font-medium text-white">{dept.name}</div>
                        <div className="text-[11px] text-stone-500">{dept.floor}</div>
                      </div>
                      <span className="font-mono text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                        {dept.code}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: RBAC WITH 60+ PERMISSIONS */}
        {/* ============================================================== */}
        {activeTab === 'rbac' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-semibold">
                  Identity & Access Management
                </span>
                <h2 className="text-2xl font-serif font-bold text-white mt-1">
                  Enterprise RBAC Matrix (60+ Permissions)
                </h2>
                <p className="text-sm text-stone-400 mt-1">
                  Role-Based Access Control matrix supporting 5 System Roles plus Custom Role Builder.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Filter permissions..."
                  value={roleSearchFilter}
                  onChange={(e) => setRoleSearchFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Roles Selector Tabs */}
            <div className="flex gap-2 border-b border-stone-800 pb-3 overflow-x-auto">
              {(['Super Admin', 'Institution Admin', 'Librarian', 'Member', 'Viewer'] as EnterpriseSystemRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedRole === role
                      ? 'bg-amber-600 text-stone-950 font-bold shadow-xs'
                      : 'bg-stone-950 text-stone-400 border border-stone-800 hover:text-white'
                  }`}
                >
                  {role} ({DEFAULT_ROLE_PERMISSIONS[role].length} perms)
                </button>
              ))}
            </div>

            {/* Permissions Grid Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {allPermissionsList
                .filter(([key, val]) =>
                  key.toLowerCase().includes(roleSearchFilter.toLowerCase()) ||
                  val.toLowerCase().includes(roleSearchFilter.toLowerCase())
                )
                .map(([key, val]) => {
                  const isGranted = (DEFAULT_ROLE_PERMISSIONS[selectedRole] as string[]).includes(val);
                  return (
                    <div
                      key={key}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                        isGranted
                          ? 'bg-emerald-500/5 border-emerald-500/30 text-stone-200'
                          : 'bg-stone-950 border-stone-800/80 text-stone-500'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-mono font-medium truncate">{val}</div>
                        <div className="text-[10px] text-stone-500">{key}</div>
                      </div>
                      {isGranted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: 7 CORE SAAS MODULES */}
        {/* ============================================================== */}
        {activeTab === 'modules' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-semibold">
                Architecture Blueprint
              </span>
              <h2 className="text-2xl font-serif font-bold text-white mt-1">
                7 Enterprise SAAS/ERP Modules
              </h2>
              <p className="text-sm text-stone-400 mt-1">
                Fully decoupled enterprise service modules with independent domain boundaries and microservices compatibility.
              </p>
            </div>

            {/* Modules Switcher */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {[
                { id: 'catalog', name: '1. Catalog', icon: BookOpen },
                { id: 'circulation', name: '2. Circulation', icon: RefreshCw },
                { id: 'members', name: '3. Members', icon: Users },
                { id: 'reading', name: '4. Reading Journeys', icon: Sparkles },
                { id: 'analytics', name: '5. Analytics', icon: BarChart3 },
                { id: 'accounting', name: '6. Accounting', icon: DollarSign },
                { id: 'integrations', name: '7. Integrations', icon: Webhook }
              ].map((m) => {
                const Icon = m.icon;
                const isActive = currentModuleTab === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setCurrentModuleTab(m.id as any)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-600/20 border-amber-500/40 text-amber-400'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{m.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Module Detail */}
            <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 space-y-4">
              {currentModuleTab === 'catalog' && (
                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-bold text-white">Catalog & Inventory Management</h3>
                  <p className="text-xs text-stone-400">
                    Supports 200+ curated monographs, Dewey/LC call numbering, multi-copy barcode tracking, and automated Google Books/OpenLibrary API synchronization.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-stone-900 border border-stone-800">
                      <div className="text-xs text-stone-400">Total Volumes</div>
                      <div className="text-2xl font-serif font-bold text-white mt-1">200</div>
                    </div>
                    <div className="p-4 rounded-xl bg-stone-900 border border-stone-800">
                      <div className="text-xs text-stone-400">Total Asset Value</div>
                      <div className="text-2xl font-serif font-bold text-emerald-400 mt-1">$48,250</div>
                    </div>
                    <div className="p-4 rounded-xl bg-stone-900 border border-stone-800">
                      <div className="text-xs text-stone-400">Live API Sync</div>
                      <div className="text-2xl font-serif font-bold text-sky-400 mt-1">Connected</div>
                    </div>
                  </div>
                </div>
              )}

              {currentModuleTab === 'circulation' && (
                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-bold text-white">Circulation & Inter-Library Courier</h3>
                  <p className="text-xs text-stone-400">
                    Automated loan rules, overdue fine calculations, inter-branch holds routing, and real-time courier status workflow.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="text-[10px] font-mono uppercase text-stone-400 border-b border-stone-800">
                        <tr>
                          <th className="py-2">Loan ID</th>
                          <th className="py-2">Patron</th>
                          <th className="py-2">Work Title</th>
                          <th className="py-2">Due Date</th>
                          <th className="py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-800/60 font-mono">
                        <tr>
                          <td className="py-3 text-stone-400">LN-9481</td>
                          <td className="text-white font-sans">Julian Hayes (Scholar)</td>
                          <td className="text-stone-300 font-sans">The Architecture of the City</td>
                          <td className="text-stone-400">2025-04-12</td>
                          <td><span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">ACTIVE</span></td>
                        </tr>
                        <tr>
                          <td className="py-3 text-stone-400">LN-9482</td>
                          <td className="text-white font-sans">Dr. Eleanor Vance (Faculty)</td>
                          <td className="text-stone-300 font-sans">Critique of Pure Reason</td>
                          <td className="text-stone-400">2025-04-18</td>
                          <td><span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">ACTIVE</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {currentModuleTab === 'accounting' && (
                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-bold text-white">Accounting & Subscriptions Engine</h3>
                  <p className="text-xs text-stone-400">
                    Stripe and PayPal gateway integration, overdue fine captures, annual institutional licensing invoices, and automated receipts.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-stone-900 border border-stone-800">
                      <div className="text-xs text-stone-400">Monthly Licensing ARR</div>
                      <div className="text-2xl font-serif font-bold text-white mt-1">$14,500 / mo</div>
                    </div>
                    <div className="p-4 rounded-xl bg-stone-900 border border-stone-800">
                      <div className="text-xs text-stone-400">Gateway Status</div>
                      <div className="text-sm font-semibold text-emerald-400 mt-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Stripe Webhooks Healthy
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentModuleTab !== 'catalog' && currentModuleTab !== 'circulation' && currentModuleTab !== 'accounting' && (
                <div className="py-6 text-center text-stone-400 text-xs">
                  Active {currentModuleTab.toUpperCase()} enterprise microservice endpoints ready and isolated under multi-tenant contexts.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: PREMIUM READING SUITE */}
        {/* ============================================================== */}
        {activeTab === 'premium' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-semibold">
                Patron Engagement
              </span>
              <h2 className="text-2xl font-serif font-bold text-white mt-1">
                Premium Feature Set & Gamification
              </h2>
              <p className="text-sm text-stone-400 mt-1">
                Reading goals, AI smart recommendations, scholastic book clubs, reading challenges, streaks, and achievement badges.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1: Reading Streaks */}
              <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-500" />
                  <h3 className="font-serif font-bold text-white">Daily Reading Streaks</h3>
                </div>
                <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 text-center space-y-1">
                  <div className="text-3xl font-serif font-bold text-amber-400">14 Days</div>
                  <div className="text-xs text-stone-400">Current Scholastic Streak</div>
                  <div className="text-[11px] text-stone-500">Longest: 45 Days · 2 Streak Freezes Left</div>
                </div>
              </div>

              {/* Feature 2: Scholastic Badges */}
              <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-400" />
                  <h3 className="font-serif font-bold text-white">Scholastic Badges</h3>
                </div>
                <div className="space-y-2 text-xs">
                  {[
                    { name: 'First Folio Explorer', desc: 'Read 5 Classical Treatises', tier: 'Gold' },
                    { name: 'Polymath Mind', desc: 'Read works across 5 disciplines', tier: 'Platinum' },
                    { name: 'Dialectic Scholar', desc: 'Contribute 10 verified reviews', tier: 'Silver' }
                  ].map((b) => (
                    <div key={b.name} className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 flex justify-between items-center">
                      <div>
                        <div className="font-medium text-white">{b.name}</div>
                        <div className="text-[10px] text-stone-500">{b.desc}</div>
                      </div>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">
                        {b.tier}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature 3: Book Clubs */}
              <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-sky-400" />
                  <h3 className="font-serif font-bold text-white">Scholastic Book Clubs</h3>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 text-xs space-y-2">
                  <div className="font-semibold text-white">The Epistemology Reading Circle</div>
                  <div className="text-[11px] text-stone-400">Currently Reading: Meditations on First Philosophy</div>
                  <div className="flex justify-between text-[10px] text-stone-500 pt-1">
                    <span>32 Members</span>
                    <span>Next Meeting: Thu 6:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: WHITE-LABELING ENGINE */}
        {/* ============================================================== */}
        {activeTab === 'white-label' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-semibold">
                Multi-Tenant Customization
              </span>
              <h2 className="text-2xl font-serif font-bold text-white mt-1">
                White-Labeling & Custom Branding Engine
              </h2>
              <p className="text-sm text-stone-400 mt-1">
                Allows institutions to fully customize brand colors, typography, logos, domain mapping, and remove Athenaeum branding.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Configuration Controls */}
              <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 space-y-4">
                <h3 className="font-serif font-bold text-white">Institution Branding Controls</h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-stone-400 mb-1">Custom Brand Name</label>
                    <input
                      type="text"
                      value={brandTitle}
                      onChange={(e) => setBrandTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Custom Domain Mapping (CNAME)</label>
                    <input
                      type="text"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 font-mono text-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Primary Brand Palette</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={primaryBrandColor}
                        onChange={(e) => setPrimaryBrandColor(e.target.value)}
                        className="w-9 h-9 rounded-lg border border-stone-700 bg-transparent cursor-pointer"
                      />
                      <span className="font-mono text-xs">{primaryBrandColor}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="removeBrandingCheck"
                      checked={removeBranding}
                      onChange={(e) => setRemoveBranding(e.target.checked)}
                      className="rounded border-stone-700 text-amber-600 focus:ring-amber-500"
                    />
                    <label htmlFor="removeBrandingCheck" className="text-stone-300 cursor-pointer">
                      Remove "Powered by Athenaeum" footer badge
                    </label>
                  </div>
                </div>
              </div>

              {/* Real-time White-Label Preview */}
              <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 space-y-4">
                <h3 className="font-serif font-bold text-white">Real-Time Portal Preview</h3>
                <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                    <div className="flex items-center gap-2">
                      <div
                        style={{ backgroundColor: primaryBrandColor }}
                        className="w-6 h-6 rounded-md flex items-center justify-center text-stone-950 font-bold text-xs"
                      >
                        B
                      </div>
                      <span className="font-serif font-bold text-white text-sm">{brandTitle}</span>
                    </div>
                    <span className="font-mono text-[10px] text-stone-400">{customDomain}</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <p className="text-stone-300 font-serif">Welcome to {brandTitle}. Archival access enabled for verified faculty and students.</p>
                    <button
                      style={{ backgroundColor: primaryBrandColor }}
                      className="px-3.5 py-1.5 rounded-lg text-white font-medium text-xs shadow-xs"
                    >
                      Browse Archival Monograph Collection
                    </button>
                  </div>

                  {!removeBranding && (
                    <div className="text-[10px] text-stone-600 pt-2 border-t border-stone-800">
                      Powered by Athenaeum Enterprise
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: WEBHOOKS & INTEGRATIONS */}
        {/* ============================================================== */}
        {activeTab === 'integrations' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-semibold">
                Ecosystem & Extensibility
              </span>
              <h2 className="text-2xl font-serif font-bold text-white mt-1">
                Webhooks & Enterprise Connectors
              </h2>
              <p className="text-sm text-stone-400 mt-1">
                HMAC-SHA256 signed event dispatchers for circulation loans, returns, patron onboarding, and payment captures.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Webhook Events */}
              <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-3">
                <h3 className="font-serif font-bold text-white text-sm">Dispatched Webhook Event Types</h3>
                <div className="space-y-2 text-xs font-mono">
                  {[
                    { event: 'circulation.borrow', desc: 'Triggered when a monograph copy is checked out' },
                    { event: 'circulation.return', desc: 'Triggered upon successful book return' },
                    { event: 'reading_journey.goal_completed', desc: 'Triggered when patron completes yearly goal' },
                    { event: 'accounting.invoice_paid', desc: 'Triggered when Stripe fine/fee is captured' }
                  ].map((evt) => (
                    <div key={evt.event} className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                      <div className="text-amber-400 font-bold">{evt.event}</div>
                      <div className="text-stone-400 font-sans text-[11px] mt-0.5">{evt.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connectors */}
              <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-3">
                <h3 className="font-serif font-bold text-white text-sm">Active Enterprise Connectors</h3>
                <div className="space-y-2 text-xs">
                  {[
                    { name: 'Stripe Payment Gateway', type: 'Payments', status: 'Connected' },
                    { name: 'SendGrid Email Notifications', type: 'Transactional Email', status: 'Connected' },
                    { name: 'Salesforce CRM Patron Sync', type: 'CRM', status: 'Available' },
                    { name: 'Google Calendar / Outlook', type: 'Events & Club Meetings', status: 'Available' }
                  ].map((c) => (
                    <div key={c.name} className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 flex justify-between items-center">
                      <div>
                        <div className="font-medium text-white">{c.name}</div>
                        <div className="text-[10px] text-stone-500">{c.type}</div>
                      </div>
                      <span className={`font-mono text-[10px] px-2 py-0.5 rounded ${
                        c.status === 'Connected' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-stone-800 text-stone-400'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 7: ARCHITECTURE & ROADMAP */}
        {/* ============================================================== */}
        {activeTab === 'architecture' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-semibold">
                Enterprise Scale & Execution
              </span>
              <h2 className="text-2xl font-serif font-bold text-white mt-1">
                3-Month Enterprise SaaS Roadmap
              </h2>
              <p className="text-sm text-stone-400 mt-1">
                High-scale engineering roadmap delivering 10K+ concurrent user capacity, sharded databases, and Redis caching.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  month: 'MONTH 1',
                  focus: 'Auth, RBAC & Core Operations',
                  items: [
                    'Multi-tenant context extraction',
                    'RBAC 60+ permissions & custom roles',
                    'Catalog module & ISBN real cover ingestion',
                    'Basic circulation & patron onboarding'
                  ]
                },
                {
                  month: 'MONTH 2',
                  focus: 'Patron Engagement & Intelligence',
                  items: [
                    'Reading goals & daily streaks visualizer',
                    'Smart recommendations engine',
                    'Scholastic book clubs & challenges',
                    'Executive analytics & white-label basics'
                  ]
                },
                {
                  month: 'MONTH 3',
                  focus: 'Enterprise Scale & Ecosystem',
                  items: [
                    'Public API v1 & webhook engine',
                    'Stripe & PayPal financial processing',
                    'Enterprise SAML / Azure AD SSO',
                    '10K+ concurrent Redis & Elasticsearch scale'
                  ]
                }
              ].map((phase) => (
                <div key={phase.month} className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                  <div className="font-mono text-xs text-amber-500 font-bold">{phase.month}</div>
                  <h3 className="font-serif font-bold text-white text-base">{phase.focus}</h3>
                  <ul className="space-y-2 text-xs text-stone-400 pt-1">
                    {phase.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
