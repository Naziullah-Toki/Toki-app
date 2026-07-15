import React from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Home, Search, Shield, Puzzle, UserCircle, Star, MoreVertical } from 'lucide-react';

interface BrowserHeaderProps {
  currentUrl: string;
  onRefresh: () => void;
  activeTab: 'gmaps' | 'dashboard' | 'whatsapp';
  setActiveTab: (tab: 'gmaps' | 'dashboard' | 'whatsapp') => void;
}

export default function BrowserHeader({ currentUrl, onRefresh, activeTab, setActiveTab }: BrowserHeaderProps) {
  return (
    <div className="bg-slate-950 text-slate-200 select-none flex flex-col border-b border-slate-800" id="browser-header">
      {/* Sleek Window Control Buttons & Tabs */}
      <div className="flex items-center px-4 pt-2.5 h-11 select-none">
        {/* Mock window buttons */}
        <div className="flex items-center gap-1.5 mr-6">
          <div className="w-3 h-3 rounded-full bg-rose-500 transition-transform hover:scale-110 cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-amber-500 transition-transform hover:scale-110 cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-emerald-500 transition-transform hover:scale-110 cursor-pointer" />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-hidden max-w-full">
          <button
            onClick={() => setActiveTab('gmaps')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-200 ${
              activeTab === 'gmaps'
                ? 'bg-slate-900 text-white border-t-2 border-blue-500'
                : 'text-slate-500 hover:bg-slate-900/60 hover:text-slate-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0 animate-pulse" />
            Google Maps
          </button>
          
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-200 ${
              activeTab === 'dashboard'
                ? 'bg-slate-900 text-white border-t-2 border-indigo-500'
                : 'text-slate-500 hover:bg-slate-900/60 hover:text-slate-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
            Admin Portal
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-200 ${
              activeTab === 'whatsapp'
                ? 'bg-slate-900 text-white border-t-2 border-emerald-500'
                : 'text-slate-500 hover:bg-slate-900/60 hover:text-slate-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
            WhatsApp Web
          </button>
        </div>
      </div>

      {/* Navigation & Address Bar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 h-12">
        <div className="flex items-center gap-3 text-slate-400">
          <button className="hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button className="hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer">
            <ArrowRight className="w-4 h-4" />
          </button>
          <button 
            onClick={onRefresh}
            className="hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
            title="Refresh View"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button className="hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer">
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* Address Field - Sleek Interface style */}
        <div className="flex-1 flex items-center justify-between bg-slate-800 hover:bg-slate-800/80 text-xs px-4 py-1.5 rounded-md border border-slate-700/50 text-slate-400 font-medium transition-all overflow-hidden">
          <div className="flex items-center gap-2 truncate">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-emerald-400 text-[10px] font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider">Secure</span>
            <span className="text-slate-200 font-mono tracking-tight truncate">{currentUrl}</span>
          </div>
          <Star className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
        </div>

        {/* Extensions & User Profile Area */}
        <div className="flex items-center gap-3 text-slate-400">
          <div className="flex items-center gap-1.5 bg-blue-600/15 border border-blue-500/30 text-blue-400 px-2.5 py-1 rounded-md text-[10px] font-black tracking-widest uppercase">
            <Puzzle className="w-3 h-3" />
            LeadOutfy Active
          </div>
          <button className="hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer">
            <UserCircle className="w-4.5 h-4.5" />
          </button>
          <button className="hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer">
            <MoreVertical className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
