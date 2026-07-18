import React, { useState } from 'react';
import { 
  Compass, Search, UserCheck, Settings, Mail, Send, 
  Database, RefreshCw, X, Play, Square, CreditCard, 
  ChevronRight, Sparkles, CheckCircle2, ShieldCheck, QrCode, Trash2, Check, AlertCircle 
} from 'lucide-react';
import { 
  Business, ScrapeSettings, EmailSettings, WhatsAppSettings, 
  ScraperStats, LogEntry 
} from '../types';
import { MOCK_COUNTRIES, MOCK_CITIES_BY_COUNTRY } from '../mockData';

interface LeadOutfyExtensionProps {
  scrapeSettings: ScrapeSettings;
  setScrapeSettings: React.Dispatch<React.SetStateAction<ScrapeSettings>>;
  emailSettings: EmailSettings;
  setEmailSettings: React.Dispatch<React.SetStateAction<EmailSettings>>;
  whatsAppSettings: WhatsAppSettings;
  setWhatsAppSettings: React.Dispatch<React.SetStateAction<WhatsAppSettings>>;
  stats: ScraperStats;
  isScraping: boolean;
  onStartScraping: () => void;
  onStopScraping: () => void;
  onResetScraper: () => void;
  licenseKey: string;
  setLicenseKey: (key: string) => void;
  isLicenseActive: boolean;
  setIsLicenseActive: (active: boolean) => void;
  credits: number;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
  logs: LogEntry[];
  leads: Business[];
  onUploadCsv: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTriggerDownload: (format: 'csv' | 'excel') => void;
}

export default function LeadOutfyExtension({
  scrapeSettings,
  setScrapeSettings,
  emailSettings,
  setEmailSettings,
  whatsAppSettings,
  setWhatsAppSettings,
  stats,
  isScraping,
  onStartScraping,
  onStopScraping,
  onResetScraper,
  licenseKey,
  setLicenseKey,
  isLicenseActive,
  setIsLicenseActive,
  credits,
  setCredits,
  logs,
  leads,
  onUploadCsv,
  onTriggerDownload
}: LeadOutfyExtensionProps) {
  const [activeSubTab, setActiveSubTab] = useState<'hunt' | 'account' | 'settings' | 'email' | 'whatsapp' | 'leads'>('hunt');
  
  // SMTP validation helper states
  const [smtpProvider, setSmtpProvider] = useState('Gmail / Google Workspace');
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [smtpName, setSmtpName] = useState('LeadOutfy Sender');
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [smtpStatus, setSmtpStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // WhatsApp verification helper states
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [whatsAppPhone, setWhatsAppPhone] = useState('+92 321 7724128');

  // Inline alert handlers
  const [extensionNotification, setExtensionNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // License activation flow
  const handleActivateLicense = () => {
    if (licenseKey.trim().length >= 8) {
      setIsLicenseActive(true);
      setCredits(7714); // Matches the license credit count from the video exactly
      setExtensionNotification({ type: 'success', message: 'License key activated successfully! Added 7,714 credits.' });
      setTimeout(() => setExtensionNotification(null), 4000);
    } else {
      setExtensionNotification({ type: 'error', message: 'Please enter a valid serial key (at least 8 characters).' });
      setTimeout(() => setExtensionNotification(null), 4000);
    }
  };

  // SMTP test flow
  const handleTestSmtp = () => {
    setTestingSmtp(true);
    setSmtpStatus('idle');
    setTimeout(() => {
      setTestingSmtp(false);
      setSmtpStatus('success');
      setEmailSettings(prev => ({
        ...prev,
        connected: true,
        emailAddress: smtpUser || 'mst.sumayaneela@gmail.com'
      }));
      setExtensionNotification({ type: 'success', message: 'SMTP credentials validated successfully!' });
      setTimeout(() => setExtensionNotification(null), 4000);
    }, 1200);
  };

  // WhatsApp QR Code simulation
  const handleGenerateQr = () => {
    setIsGeneratingQr(true);
    setQrCodeData(null);
    setTimeout(() => {
      setIsGeneratingQr(false);
      setQrCodeData('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=leadoutfy-whatsapp-web-auth');
    }, 1000);
  };

  const handleConfirmWhatsAppLink = () => {
    setWhatsAppSettings(prev => ({
      ...prev,
      connected: true,
      phoneConnected: whatsAppPhone
    }));
    setQrCodeData(null);
    setExtensionNotification({ type: 'success', message: `WhatsApp device linked on ${whatsAppPhone}!` });
    setTimeout(() => setExtensionNotification(null), 4000);
  };

  // Set default values depending on selected countries/cities
  const handleCountryChange = (country: string) => {
    const cities = MOCK_CITIES_BY_COUNTRY[country] || ['All Cities'];
    setScrapeSettings(prev => ({
      ...prev,
      country,
      city: cities[0]
    }));
  };

  return (
    <div className="w-[380px] bg-slate-900 text-slate-200 font-sans border border-slate-800 rounded-xl shadow-2xl flex flex-col h-full overflow-hidden" id="leadoutfy-extension">
      
      {/* Extension Header */}
      <div className="bg-slate-950 border-b border-slate-800 p-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/20">
            L
          </div>
          <div>
            <h1 className="text-xs font-black tracking-tight text-white flex items-center gap-1.5">
              LeadOutfy AI Pro
              <span className="bg-blue-600/15 text-blue-400 border border-blue-500/30 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                v2.6
              </span>
            </h1>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Non-Stop Maps Harvester</p>
          </div>
        </div>
        
        {/* Credit System Indicator */}
        <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
          <CreditCard className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[10px] font-black tracking-tight text-slate-300">
            {isLicenseActive ? `${credits.toLocaleString()} Cr` : 'Unlicensed'}
          </span>
        </div>
      </div>

      {/* Extension Core Tabs Navigation */}
      <div className="flex bg-slate-950 border-b border-slate-800/80 p-1 gap-1 text-[10px] font-black select-none flex-shrink-0 uppercase tracking-wider">
        <button
          onClick={() => setActiveSubTab('hunt')}
          className={`flex-1 py-2 rounded-md transition-all cursor-pointer ${
            activeSubTab === 'hunt' ? 'bg-blue-600 text-white shadow-md font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Hunt
        </button>
        <button
          onClick={() => setActiveSubTab('email')}
          className={`flex-1 py-2 rounded-md transition-all cursor-pointer ${
            activeSubTab === 'email' ? 'bg-blue-600 text-white shadow-md font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Email
        </button>
        <button
          onClick={() => setActiveSubTab('whatsapp')}
          className={`flex-1 py-2 rounded-md transition-all cursor-pointer ${
            activeSubTab === 'whatsapp' ? 'bg-blue-600 text-white shadow-md font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          WhatsApp
        </button>
        <button
          onClick={() => setActiveSubTab('leads')}
          className={`flex-1 py-2 rounded-md transition-all cursor-pointer ${
            activeSubTab === 'leads' ? 'bg-blue-600 text-white shadow-md font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Logs
        </button>
        <button
          onClick={() => setActiveSubTab('account')}
          className={`px-3 py-2 rounded-md transition-all cursor-pointer ${
            activeSubTab === 'account' ? 'bg-blue-600 text-white shadow-md font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Product Serial Serial Activation"
        >
          Key
        </button>
      </div>

      {/* Viewport Core Panels with Slim Scrollbar */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-900/40" style={{ scrollbarWidth: 'thin' }}>
        
        {/* Real-time Toast Notifications */}
        {extensionNotification && (
          <div className={`mb-3.5 p-3 rounded-lg text-[10px] font-bold flex items-center gap-2 animate-fade-in border ${
            extensionNotification.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}>
            {extensionNotification.type === 'success' ? <Check className="w-4 h-4 bg-emerald-500/20 p-0.5 rounded-full" /> : <AlertCircle className="w-4 h-4" />}
            {extensionNotification.message}
          </div>
        )}

        {/* Tab 1: Leads Scraper (HUNT) */}
        {activeSubTab === 'hunt' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            {/* Scrape Target Parameters */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-3">
              <h3 className="text-[10px] font-black tracking-widest text-blue-400 uppercase">Search Target</h3>
              
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 focus-within:border-blue-500 transition-colors">
                <Search className="w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. Dentists, Real Estate Agencies"
                  value={scrapeSettings.keyword}
                  onChange={(e) => setScrapeSettings(prev => ({ ...prev, keyword: e.target.value }))}
                  className="w-full text-xs bg-transparent outline-none text-slate-200 placeholder-slate-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Country</label>
                  <select
                    value={scrapeSettings.country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full mt-1 text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-300 outline-none"
                  >
                    {MOCK_COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">City</label>
                  <select
                    value={scrapeSettings.city}
                    onChange={(e) => setScrapeSettings(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full mt-1 text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-300 outline-none"
                  >
                    {(MOCK_CITIES_BY_COUNTRY[scrapeSettings.country] || ['All Cities']).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Target Limits</label>
                  <select
                    value={scrapeSettings.maxResults}
                    onChange={(e) => setScrapeSettings(prev => ({ ...prev, maxResults: parseInt(e.target.value) }))}
                    className="w-full mt-1 text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-300 outline-none"
                  >
                    {[5, 10, 20, 50, 100, 200, 500, 1000].map((num) => (
                      <option key={num} value={num}>{num} Leads</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Thread Speed</label>
                  <select
                    value={scrapeSettings.speed}
                    onChange={(e) => setScrapeSettings(prev => ({ ...prev, speed: e.target.value as any }))}
                    className="w-full mt-1 text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-300 outline-none"
                  >
                    <option value="slow">Eco Mode (Delay 3s)</option>
                    <option value="normal">Active Mode (Delay 2s)</option>
                    <option value="fast">Turbo Mode (No Delay)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Smart Data Filters */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80">
              <h3 className="text-[10px] font-black tracking-widest text-blue-400 uppercase mb-3">Enrichment Filters</h3>
              <div className="flex flex-col gap-2.5">
                <label className="flex items-center gap-3 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={scrapeSettings.filterEmail}
                    onChange={(e) => setScrapeSettings(prev => ({ ...prev, filterEmail: e.target.checked }))}
                    className="accent-blue-500 rounded border-slate-800 bg-slate-950 text-blue-500"
                  />
                  <span>Harvest verified emails only</span>
                </label>

                <label className="flex items-center gap-3 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={scrapeSettings.filterPhone}
                    onChange={(e) => setScrapeSettings(prev => ({ ...prev, filterPhone: e.target.checked }))}
                    className="accent-blue-500 rounded border-slate-800 bg-slate-950 text-blue-500"
                  />
                  <span>Filter records having active phone line</span>
                </label>

                <label className="flex items-center gap-3 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={scrapeSettings.filterWebsite}
                    onChange={(e) => setScrapeSettings(prev => ({ ...prev, filterWebsite: e.target.checked }))}
                    className="accent-blue-500 rounded border-slate-800 bg-slate-950 text-blue-500"
                  />
                  <span>Exclude targets lacking functional website</span>
                </label>
              </div>
            </div>

            {/* Scraper Stats Block */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/60 text-center">
                <span className="text-[9px] font-extrabold text-slate-500 block uppercase tracking-wider">Targets Found</span>
                <span className="text-lg font-black text-blue-400 tracking-tight">{stats.totalFound}</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/60 text-center">
                <span className="text-[9px] font-extrabold text-slate-500 block uppercase tracking-wider">Emails Found</span>
                <span className="text-lg font-black text-indigo-400 tracking-tight">{stats.totalEmails}</span>
              </div>
            </div>

            {/* Main Action Controllers */}
            {!isLicenseActive ? (
              <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-3.5 text-center flex flex-col gap-2">
                <span className="text-[11px] text-blue-400 font-extrabold uppercase tracking-wider">Licensing Status Locked</span>
                <p className="text-[10px] text-slate-400 leading-normal">Enter your subscription license code in the "Key" tab to unlock high-capacity maps harvesting.</p>
                <button
                  onClick={() => setActiveSubTab('account')}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded-lg cursor-pointer transition-colors"
                >
                  Enter Serial Key
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                {isScraping ? (
                  <button
                    onClick={onStopScraping}
                    className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-[11px] uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-rose-950/20 cursor-pointer transition-all"
                  >
                    <Square className="w-3.5 h-3.5" />
                    Pause Campaign
                  </button>
                ) : (
                  <button
                    onClick={onStartScraping}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.01] active:scale-[0.99] text-white font-extrabold text-[11px] uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-950/20 cursor-pointer transition-all"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Launch Maps Agent
                  </button>
                )}
                
                {leads.length > 0 && !isScraping && (
                  <button
                    onClick={onResetScraper}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-3 rounded-xl border border-slate-700 cursor-pointer"
                    title="Reset Harvester Cache"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Email Auto-Outreach Settings */}
        {activeSubTab === 'email' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            {/* Auto Email Toggle */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
              <div>
                <h3 className="text-[10px] font-black tracking-widest text-blue-400 uppercase">SMTP Automation</h3>
                <p className="text-[10px] text-slate-500 mt-0.5 font-medium leading-normal">Instantly draft & dispatch emails as soon as details are scraped.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailSettings.autoSend}
                  onChange={(e) => setEmailSettings(prev => ({ ...prev, autoSend: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Email Delay Controller */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80">
              <h3 className="text-[10px] font-black tracking-widest text-blue-400 uppercase mb-3">Dispensation Delay</h3>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {[5, 10, 30, 60].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setEmailSettings(prev => ({ ...prev, delay: sec }))}
                    className={`py-2 rounded-lg font-bold border transition-all cursor-pointer ${
                      emailSettings.delay === sec
                        ? 'bg-blue-600/15 border-blue-500 text-blue-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            {/* SMTP Config Server */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-3">
              <h3 className="text-[10px] font-black tracking-widest text-blue-400 uppercase">SMTP Connection Panel</h3>
              
              {emailSettings.connected ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">SMTP Tunnel Secured</h4>
                    <span className="text-[10px] text-emerald-400 font-mono mt-1 block truncate">{emailSettings.emailAddress}</span>
                    <button
                      onClick={() => setEmailSettings(prev => ({ ...prev, connected: false }))}
                      className="text-[10px] text-rose-400 hover:underline mt-2 font-black uppercase tracking-wider cursor-pointer"
                    >
                      Disconnect Gateway
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Email Provider Route</label>
                    <select
                      value={smtpProvider}
                      onChange={(e) => setSmtpProvider(e.target.value)}
                      className="w-full mt-1 text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-300 outline-none"
                    >
                      <option>Gmail / Google Workspace</option>
                      <option>cPanel Webmail / Hostinger</option>
                      <option>SendGrid / Mailgun</option>
                      <option>Custom SMTP Route</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Sender Username (Email)</label>
                    <input
                      type="email"
                      placeholder="e.g. mst.sumayaneela@gmail.com"
                      value={smtpUser}
                      onChange={(e) => setSmtpUser(e.target.value)}
                      className="w-full mt-1 text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-300 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">App-Specific Password</label>
                    <input
                      type="password"
                      placeholder="••••••••••••••••"
                      value={smtpPass}
                      onChange={(e) => setSmtpPass(e.target.value)}
                      className="w-full mt-1 text-xs bg-[#111216] border border-[#2b2d35] rounded-lg p-2 text-white outline-none"
                    />
                  </div>

                  <button
                    onClick={handleTestSmtp}
                    disabled={testingSmtp}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[10px] uppercase tracking-widest py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 mt-1"
                  >
                    {testingSmtp ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Validating SMTP Connection...
                      </>
                    ) : (
                      'Validate & Mount Route'
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Outbound Template Variable Builder */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-3">
              <h3 className="text-[10px] font-black tracking-widest text-blue-400 uppercase">SMTP Message Template</h3>
              
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[9px] text-slate-400 leading-relaxed font-semibold">
                <span className="text-blue-400 block mb-1">Dynamic Macro Tags:</span>
                Use <code className="text-white font-black">{"{name}"}</code>, <code className="text-white font-black">{"{category}"}</code>, <code className="text-white font-black">{"{rating}"}</code>, <code className="text-white font-black">{"{phone}"}</code>.
              </div>

              <div>
                <label className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Email Subject Heading</label>
                <input
                  type="text"
                  value={emailSettings.subjectTemplate}
                  onChange={(e) => setEmailSettings(prev => ({ ...prev, subjectTemplate: e.target.value }))}
                  className="w-full mt-1 text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-300 outline-none"
                />
              </div>

              <div>
                <label className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Email Message Body</label>
                <textarea
                  rows={4}
                  value={emailSettings.bodyTemplate}
                  onChange={(e) => setEmailSettings(prev => ({ ...prev, bodyTemplate: e.target.value }))}
                  className="w-full mt-1 text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-300 outline-none font-mono text-[10px] leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: WhatsApp Auto-Outreach Settings */}
        {activeSubTab === 'whatsapp' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            {/* Auto WhatsApp Toggle */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
              <div>
                <h3 className="text-[10px] font-black tracking-widest text-blue-400 uppercase">WhatsApp Automation</h3>
                <p className="text-[10px] text-slate-500 mt-0.5 font-medium leading-normal">Broadcast outbound messaging campaigns immediately.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={whatsAppSettings.autoSend}
                  onChange={(e) => setWhatsAppSettings(prev => ({ ...prev, autoSend: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Delay Interval */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80">
              <h3 className="text-[10px] font-black tracking-widest text-blue-400 uppercase mb-3">WhatsApp Delay</h3>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {[10, 30, 60, 120].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setWhatsAppSettings(prev => ({ ...prev, delay: sec }))}
                    className={`py-2 rounded-lg font-bold border transition-all cursor-pointer ${
                      whatsAppSettings.delay === sec
                        ? 'bg-blue-600/15 border-blue-500 text-blue-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            {/* WhatsApp Link Setup */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-3">
              <h3 className="text-[10px] font-black tracking-widest text-blue-400 uppercase">WhatsApp Router Bridge</h3>

              {whatsAppSettings.connected ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">Device Synchronized</h4>
                    <span className="text-[10px] text-emerald-400 font-mono mt-1 block truncate">{whatsAppSettings.phoneConnected}</span>
                    <button
                      onClick={() => setWhatsAppSettings(prev => ({ ...prev, connected: false, phoneConnected: '' }))}
                      className="text-[10px] text-rose-400 hover:underline mt-2.5 font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Unlink Device
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3 items-center text-center">
                  <p className="text-[11px] text-slate-400">
                    Scan the secure bridge code on your smartphone to initiate the messaging gateway.
                  </p>

                  {qrCodeData ? (
                    <div className="bg-white p-3.5 rounded-xl flex flex-col items-center gap-3 animate-fade-in shadow-2xl">
                      <img src={qrCodeData} alt="Simulated QR Code" className="w-[140px] h-[140px]" />
                      <button
                        onClick={handleConfirmWhatsAppLink}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10px] uppercase tracking-wider px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1.5 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Confirm Scan Completion
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleGenerateQr}
                      disabled={isGeneratingQr}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      {isGeneratingQr ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Booting Secure QR...
                        </>
                      ) : (
                        <>
                          <QrCode className="w-4 h-4" />
                          Request Linking Token
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Broadcast Message Templates */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-3">
              <h3 className="text-[10px] font-black tracking-widest text-blue-400 uppercase">WhatsApp Content draft</h3>
              
              <div>
                <label className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Outbound Body Message</label>
                <textarea
                  rows={4}
                  value={whatsAppSettings.bodyTemplate}
                  onChange={(e) => setWhatsAppSettings(prev => ({ ...prev, bodyTemplate: e.target.value }))}
                  className="w-full mt-1 text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-300 outline-none font-mono text-[10px] leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Scraped Lead Results Log */}
        {activeSubTab === 'leads' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            {/* Scrape Controls Header */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-3">
              <h3 className="text-[10px] font-black tracking-widest text-blue-400 uppercase">Export Files</h3>
              <p className="text-[10px] text-slate-500 leading-normal font-medium">Instantly format and export active maps search caches to standard business spreadsheets.</p>
              
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={() => onTriggerDownload('csv')}
                  disabled={leads.length === 0}
                  className="bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold py-2 rounded-lg cursor-pointer transition-colors disabled:opacity-40"
                >
                  Download CSV
                </button>
                <button
                  onClick={() => onTriggerDownload('excel')}
                  disabled={leads.length === 0}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded-lg cursor-pointer transition-colors disabled:opacity-40"
                >
                  Download Excel
                </button>
              </div>
            </div>

            {/* Scrape Logs Viewport */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80 flex flex-col h-[280px]">
              <h3 className="text-[10px] font-black tracking-widest text-blue-400 uppercase mb-2">Live scraping output</h3>
              
              <div className="flex-1 bg-slate-950 border border-slate-800/60 rounded-lg p-3.5 font-mono text-[10px] overflow-y-auto flex flex-col gap-2 text-slate-400" style={{ scrollbarWidth: 'thin' }}>
                {logs.length === 0 ? (
                  <span className="text-slate-600 font-bold uppercase tracking-wider text-[9px]">Scraper Thread Inactive</span>
                ) : (
                  logs.map((log) => {
                    let color = 'text-slate-400';
                    if (log.type === 'email') color = 'text-blue-400 font-bold';
                    if (log.type === 'whatsapp') color = 'text-emerald-400 font-bold';
                    if (log.type === 'success') color = 'text-emerald-500 font-bold';
                    if (log.type === 'error') color = 'text-rose-400 font-bold';

                    return (
                      <div key={log.id} className="leading-relaxed border-b border-slate-900/50 pb-1">
                        <span className="text-indigo-400 mr-2 font-bold">[{log.timestamp}]</span>
                        <span className={color}>{log.message}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Account serial validation */}
        {activeSubTab === 'account' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-3">
              <h3 className="text-[10px] font-black tracking-widest text-blue-400 uppercase">Product Serial Key</h3>
              
              {isLicenseActive ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center flex flex-col items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 animate-pulse" />
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">Enterprise Key Active</h4>
                    <p className="text-[10px] text-slate-400 mt-1">Non-Stop scraping thread fully licensed.</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <p className="text-xs text-slate-400">
                    Validate your premium purchase subscription serial key below to unlock limitless lead generation.
                  </p>
                  
                  <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5">
                    <input
                      type="text"
                      placeholder="e.g. LO-7714X-ACTIVE"
                      value={licenseKey}
                      onChange={(e) => setLicenseKey(e.target.value)}
                      className="w-full text-xs bg-transparent outline-none text-white font-mono placeholder-slate-700"
                    />
                  </div>

                  <button
                    onClick={handleActivateLicense}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[11px] uppercase tracking-wider py-2.5 rounded-lg cursor-pointer transition-colors"
                  >
                    Activate Key Now
                  </button>
                </div>
              )}
            </div>

            {/* Bulk CSV Uploader Simulation */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-3">
              <h3 className="text-[10px] font-black tracking-widest text-blue-400 uppercase">Bulk CSV Import</h3>
              <p className="text-[10px] text-slate-500 leading-normal font-medium">Upload external spreadsheets containing cold records directly to LeadOutfy.</p>
              
              <label className="border border-dashed border-slate-800 hover:border-blue-500/50 rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center gap-2 bg-slate-950">
                <Database className="w-6 h-6 text-blue-400" />
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Upload Cold CSV Records</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={onUploadCsv}
                  className="hidden"
                />
              </label>
            </div>

            {/* Real Chrome Extension Downloader */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-3">
              <h3 className="text-[10px] font-black tracking-widest text-blue-400 uppercase">Download Extension</h3>
              <p className="text-[10px] text-slate-500 leading-normal font-medium">Get the unpacked Manifest V3 chrome extension ZIP file to install in Google Chrome.</p>
              
              <button
                onClick={async () => {
                  try {
                    const { downloadChromeExtension } = await import('../utils/extensionDownloader');
                    await downloadChromeExtension();
                    setExtensionNotification({ type: 'success', message: 'Chrome Extension ZIP downloaded successfully!' });
                    setTimeout(() => setExtensionNotification(null), 4000);
                  } catch (e) {
                    console.error(e);
                  }
                }}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[10px] uppercase tracking-wider py-2.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                id="extension-tab-download-btn"
              >
                Download Extension ZIP
              </button>

              <p className="text-[9px] text-slate-500 font-semibold mt-1 leading-normal">
                💡 <span className="text-slate-400">Note:</span> If your browser blocks the file download within this preview frame, please open the app in a <a href="/" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300 font-bold">New Tab</a> and download again!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Extension Footer Panel */}
      <div className="bg-slate-950 border-t border-slate-800 px-4 py-2.5 flex items-center justify-between text-[9px] text-slate-500 font-bold uppercase tracking-wider flex-shrink-0">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Gateway Active
        </span>
        <span>Secure Secure SSL Connection</span>
      </div>
    </div>
  );
}
