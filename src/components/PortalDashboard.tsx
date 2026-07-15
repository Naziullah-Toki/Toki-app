import React, { useState } from 'react';
import { 
  TrendingUp, Users, Mail, MessageSquare, Shield, Globe, 
  MapPin, CheckCircle, Award, CreditCard, ChevronRight, HelpCircle, FileSpreadsheet, Sparkles, Check,
  Download, Puzzle
} from 'lucide-react';
import { Business } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { downloadChromeExtension } from '../utils/extensionDownloader';

interface PortalDashboardProps {
  leads: Business[];
  isLicenseActive: boolean;
  credits: number;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
  onActivateLicense: () => void;
  onTriggerDownload: (format: 'csv' | 'excel') => void;
}

const MOCK_CAMPAIGN_DATA = [
  { name: 'Mon', Leads: 120, Emails: 95, WhatsApp: 80 },
  { name: 'Tue', Leads: 250, Emails: 180, WhatsApp: 140 },
  { name: 'Wed', Leads: 410, Emails: 310, WhatsApp: 220 },
  { name: 'Thu', Leads: 380, Emails: 290, WhatsApp: 210 },
  { name: 'Fri', Leads: 520, Emails: 410, WhatsApp: 350 },
  { name: 'Sat', Leads: 210, Emails: 150, WhatsApp: 110 },
  { name: 'Sun', Leads: 340, Emails: 280, WhatsApp: 240 },
];

export default function PortalDashboard({
  leads,
  isLicenseActive,
  credits,
  setCredits,
  onActivateLicense,
  onTriggerDownload
}: PortalDashboardProps) {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [successNotification, setSuccessNotification] = useState<string | null>(null);

  const handleBuyCredits = (amount: number, price: number) => {
    setSelectedPlan(amount);
    setTimeout(() => {
      setCredits(prev => prev + amount);
      setSuccessNotification(`Successfully added ${amount.toLocaleString()} credits to your account!`);
      setSelectedPlan(null);
      setTimeout(() => {
        setSuccessNotification(null);
      }, 4000);
    }, 800);
  };

  const handleDownloadExtension = async () => {
    try {
      await downloadChromeExtension();
      setSuccessNotification("Success! LeadOutfy AI Pro Chrome Extension ZIP package generated and downloaded.");
      setTimeout(() => {
        setSuccessNotification(null);
      }, 5000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-300 p-6 md:p-8 overflow-y-auto h-full" id="portal-dashboard">
      
      {/* Inline Notification Banner */}
      {successNotification && (
        <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold py-3.5 px-4 rounded-xl flex items-center gap-2.5 animate-fade-in shadow-lg">
          <Check className="w-4.5 h-4.5 bg-emerald-500/20 p-0.5 rounded-full" />
          {successNotification}
        </div>
      )}

      {/* Hero Banner Area in Sleek Style */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-600/10 via-indigo-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              LeadOutfy AI Pro Platform
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none">
              B2B Lead Generation Machine
            </h1>
            <p className="text-xs text-slate-400 mt-2 max-w-xl leading-relaxed">
              Extract validated maps information on target niches and launch automated, multi-route follow-up campaigns over cold SMTP and WhatsApp.
            </p>
          </div>

          {!isLicenseActive ? (
            <button
              onClick={onActivateLicense}
              className="bg-blue-600 hover:bg-blue-500 hover:scale-[1.01] active:scale-[0.99] text-white font-extrabold text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-xl shadow-xl shadow-blue-500/15 cursor-pointer transition-all flex items-center gap-2 border border-blue-500/40"
            >
              <Award className="w-4 h-4 text-blue-200" />
              Activate License Now
            </button>
          ) : (
            <div className="bg-blue-900/10 border border-blue-500/20 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Enterprise Mode Active
            </div>
          )}
        </div>
      </div>

      {/* Chrome Extension Download & Installer Block */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 relative overflow-hidden shadow-xl" id="extension-installer-panel">
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row gap-6 items-start justify-between relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Puzzle className="w-5 h-5 animate-pulse" />
              </span>
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-wider">
                  LeadOutfy Chrome Extension Installer
                </h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                  Direct Integration Interface for Google Chrome
                </p>
              </div>
            </div>
            
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed mb-4">
              To harvest real-time business lists directly from Google Maps search results, you need the companion LeadOutfy Chrome Extension. 
              Our dynamic client compiler compiles a custom Manifest V3 extension bundle for you.
            </p>

            {/* Quick visual steps */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-5">
              <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl flex flex-col gap-1.5 hover:border-slate-700 transition-colors">
                <span className="text-[9px] font-black text-blue-400 uppercase font-mono bg-blue-500/10 px-1.5 py-0.5 rounded self-start">Step 1</span>
                <span className="text-xs font-extrabold text-slate-200">Download ZIP</span>
                <span className="text-[10px] text-slate-500 leading-normal">Click the button to generate and export your customized Manifest V3 bundle.</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl flex flex-col gap-1.5 hover:border-slate-700 transition-colors">
                <span className="text-[9px] font-black text-blue-400 uppercase font-mono bg-blue-500/10 px-1.5 py-0.5 rounded self-start">Step 2</span>
                <span className="text-xs font-extrabold text-slate-200">Unpack Folder</span>
                <span className="text-[10px] text-slate-500 leading-normal">Locate the downloaded zip file (<code className="text-slate-400 font-mono">.zip</code>) and extract it on your system.</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl flex flex-col gap-1.5 hover:border-slate-700 transition-colors">
                <span className="text-[9px] font-black text-blue-400 uppercase font-mono bg-blue-500/10 px-1.5 py-0.5 rounded self-start">Step 3</span>
                <span className="text-xs font-extrabold text-slate-200">Load Unpacked</span>
                <span className="text-[10px] text-slate-500 leading-normal">In Chrome, go to <code className="text-blue-400 font-mono select-all">chrome://extensions/</code>, and enable <strong>Developer Mode</strong>.</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl flex flex-col gap-1.5 hover:border-slate-700 transition-colors">
                <span className="text-[9px] font-black text-blue-400 uppercase font-mono bg-blue-500/10 px-1.5 py-0.5 rounded self-start">Step 4</span>
                <span className="text-xs font-extrabold text-slate-200">Pin & Launch</span>
                <span className="text-[10px] text-slate-500 leading-normal">Click <strong>Load unpacked</strong>, choose the folder, and pin the LeadOutfy icon to your toolbar!</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full lg:w-72 bg-slate-950 border border-slate-800/80 p-4.5 rounded-xl justify-center flex-shrink-0">
            <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 uppercase tracking-widest">
              <span>Extension Release</span>
              <span className="text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Latest v2.6.0
              </span>
            </div>
            
            <button
              onClick={handleDownloadExtension}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest py-3.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all border border-blue-500/30"
              id="dashboard-download-extension-btn"
            >
              <Download className="w-4 h-4 text-blue-200" />
              Download Extension Package
            </button>

            <div className="bg-slate-900 border border-slate-800/60 p-3 rounded-lg text-[10px] text-slate-500 leading-relaxed font-medium">
              <span className="text-blue-400 font-bold block mb-1">How do I use it?</span>
              Open Google Maps, enter a niche/keyword, and click the LeadOutfy extension icon to start harvesting!
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Key Performance Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg hover:border-slate-700/50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Scraped Leads</span>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-white tracking-tight">{leads.length > 0 ? leads.length : '1,240+'}</div>
          <p className="text-[10px] text-slate-500 mt-1.5 font-medium">Verified maps businesses</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg hover:border-slate-700/50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Email Dispatched</span>
            <Mail className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {leads.length > 0 ? leads.filter(l => l.status === 'email_sent' || l.status === 'both_sent').length : '840+'}
          </div>
          <p className="text-[10px] text-slate-500 mt-1.5 font-medium">Cold SMTP emails triggered</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg hover:border-slate-700/50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">WA Deliveries</span>
            <MessageSquare className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {leads.length > 0 ? leads.filter(l => l.status === 'whatsapp_sent' || l.status === 'both_sent').length : '510+'}
          </div>
          <p className="text-[10px] text-slate-500 mt-1.5 font-medium">WhatsApp messages sent</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg hover:border-slate-700/50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Outreach Balance</span>
            <CreditCard className="w-5 h-5 text-violet-400" />
          </div>
          <div className="text-2xl font-black text-white tracking-tight">{credits.toLocaleString()} Cr</div>
          <p className="text-[10px] text-slate-500 mt-1.5 font-medium">Credits for lookup API</p>
        </div>
      </div>

      {/* Main Campaign Data charts layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Campaign Metrics Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col shadow-lg">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-200 mb-6 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            Outreach Delivery Progression
          </h3>
          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_CAMPAIGN_DATA}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEmails" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff', borderRadius: '8px', fontSize: '11px' }} />
                <Area type="monotone" dataKey="Leads" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorLeads)" name="Leads Found" />
                <Area type="monotone" dataKey="Emails" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEmails)" name="SMTP Dispatched" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick credit topup calculator */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between shadow-lg">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-200 mb-1.5">Acquire Credits</h3>
            <p className="text-[11px] text-slate-500 mb-5 leading-normal">Replenish credits to power background domain lookups & business email scrapes.</p>
            
            <div className="flex flex-col gap-2.5">
              {[
                { amount: 10000, price: 25 },
                { amount: 20000, price: 45 },
                { amount: 35000, price: 75 },
                { amount: 50000, price: 99 },
              ].map((tier) => (
                <button
                  key={tier.amount}
                  onClick={() => handleBuyCredits(tier.amount, tier.price)}
                  disabled={selectedPlan !== null}
                  className="w-full bg-slate-950 hover:bg-slate-800/80 border border-slate-800/60 p-3 rounded-xl flex items-center justify-between text-xs transition-all cursor-pointer hover:border-blue-500/40"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="font-extrabold text-slate-200">{tier.amount.toLocaleString()} Cr</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Price:</span>
                    <span className="font-black text-blue-400">${tier.price}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 ml-1" />
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-4 text-center">
            🔒 Secured with integrated sandbox Stripe gateway
          </div>
        </div>
      </div>

      {/* Scraped Leads Table Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white">Leads Manager</h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-normal">Real-time status tracking for harvested B2B records.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onTriggerDownload('csv')}
              disabled={leads.length === 0}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-4.5 py-2.5 rounded-xl flex items-center gap-2 transition-all disabled:opacity-40 cursor-pointer shadow-lg shadow-emerald-950/20"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Export CSV Spreadsheet
            </button>
          </div>
        </div>

        {leads.length === 0 ? (
          <div className="p-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
            <MapPin className="w-8 h-8 text-slate-700 mx-auto mb-3" />
            <p className="text-xs font-semibold text-slate-400">No active records extracted yet.</p>
            <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">Please trigger the search crawler inside the Google Maps tab using the extension controller.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 font-extrabold text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-3">Business Name</th>
                  <th className="py-3 px-3">Niche Category</th>
                  <th className="py-3 px-3">Rating Score</th>
                  <th className="py-3 px-3">Phone Line</th>
                  <th className="py-3 px-3">Outreach Address</th>
                  <th className="py-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/20 group transition-colors">
                    <td className="py-3.5 px-3 text-white font-extrabold tracking-tight group-hover:text-blue-400 transition-colors">{lead.name}</td>
                    <td className="py-3.5 px-3 text-slate-400 font-medium">{lead.category}</td>
                    <td className="py-3.5 px-3 text-amber-500 font-extrabold">⭐ {lead.rating}</td>
                    <td className="py-3.5 px-3 font-mono text-slate-400 text-[11px]">{lead.phone || 'N/A'}</td>
                    <td className="py-3.5 px-3 text-blue-400 font-medium text-[11px]">{lead.email || 'N/A'}</td>
                    <td className="py-3.5 px-3 text-right">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-[9px] font-black tracking-wider uppercase border ${
                        lead.status === 'both_sent' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        lead.status === 'email_sent' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        lead.status === 'whatsapp_sent' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                        'bg-slate-950 text-slate-500 border-slate-800'
                      }`}>
                        {lead.status === 'both_sent' ? 'Email & WA' :
                         lead.status === 'email_sent' ? 'Email Sent' :
                         lead.status === 'whatsapp_sent' ? 'WA Sent' :
                         'Found'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
