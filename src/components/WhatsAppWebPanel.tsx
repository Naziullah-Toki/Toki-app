import React from 'react';
import { Send, CheckCheck, RefreshCw, MessageSquare, PhoneCall, ShieldCheck, QrCode } from 'lucide-react';
import { Business } from '../types';

interface WhatsAppWebPanelProps {
  phoneConnected: string;
  leads: Business[];
}

export default function WhatsAppWebPanel({ phoneConnected, leads }: WhatsAppWebPanelProps) {
  // Filter leads with WhatsApp messages sent
  const sentLeads = leads.filter(l => l.status === 'whatsapp_sent' || l.status === 'both_sent');

  return (
    <div className="flex h-full bg-slate-950 text-slate-100 font-sans" id="whatsapp-web-panel">
      {/* Sidebar - Contacts List */}
      <div className="w-[340px] border-r border-slate-800 bg-slate-900/90 flex flex-col h-full">
        {/* Header */}
        <div className="h-16 bg-slate-900 px-4 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs uppercase tracking-widest">
              LO
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">Outreach Desk</h3>
              <p className="text-[10px] font-medium text-emerald-400">
                {phoneConnected ? `Connected (${phoneConnected})` : 'Offline'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        {/* Search & Chats Bar */}
        <div className="p-3 border-b border-slate-800 bg-slate-900/60">
          <div className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 flex items-center gap-3">
            <span className="text-slate-500 text-[11px] font-medium tracking-wide">Automated Outreach Stream</span>
          </div>
        </div>

        {/* Sent chats list */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40" style={{ scrollbarWidth: 'thin' }}>
          {sentLeads.length === 0 ? (
            <div className="p-6 text-center text-slate-500 flex flex-col items-center justify-center h-full gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                <MessageSquare className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div className="flex flex-col gap-1.5 px-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">No active sessions</p>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Automated WhatsApp outreach messages will show up here as they are processed in real-time.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              {sentLeads.map((lead) => (
                <div key={lead.id} className="p-4 flex items-start gap-3 hover:bg-slate-800/40 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {lead.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-200 truncate pr-2">{lead.name}</h4>
                      <span className="text-[9px] text-slate-500 font-mono">Just now</span>
                    </div>
                    <p className="text-[10px] font-mono text-slate-500 truncate mt-1">{lead.phone}</p>
                    <div className="flex items-center gap-1.5 mt-2.5">
                      <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-[9px] text-blue-400 font-bold bg-blue-600/10 px-2 py-0.5 rounded-md uppercase tracking-wider">
                        WA Sent
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main chat viewport */}
      <div className="flex-1 flex flex-col h-full bg-slate-950 relative">
        {/* Background grid */}
        <div 
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {sentLeads.length === 0 ? (
          // Empty State
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 shadow-xl shadow-emerald-950/20">
              <QrCode className="w-10 h-10 animate-pulse" />
            </div>
            <h3 className="text-base font-extrabold text-white uppercase tracking-wider mb-2">WhatsApp Web Bridge</h3>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed px-4">
              Connect your WhatsApp account in the Chrome Extension overlay, and LeadOutfy AI Pro will handle automated customer prospecting directly.
            </p>
          </div>
        ) : (
          // Active chat simulation (focusing on the latest sent)
          (() => {
            const latest = sentLeads[sentLeads.length - 1];
            return (
              <div className="flex-1 flex flex-col h-full relative z-10">
                {/* Chat Header */}
                <div className="h-16 bg-slate-900 px-6 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs uppercase">
                      {latest.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white tracking-tight">{latest.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{latest.phone} • <span className="text-blue-400 uppercase tracking-widest font-bold">{latest.category}</span></p>
                    </div>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-end gap-5 bg-slate-950/40">
                  {/* System message */}
                  <div className="self-center bg-slate-900 px-4 py-2 rounded-lg text-[9px] text-slate-500 uppercase tracking-widest font-black border border-slate-800/80">
                    Fully Automated LeadOutfy Outbound Route
                  </div>

                  {/* Recipient info card */}
                  <div className="self-start bg-slate-900 text-slate-200 p-4 rounded-xl max-w-sm border border-slate-800 flex flex-col gap-2 shadow-2xl">
                    <div className="text-[9px] font-black tracking-widest text-blue-400 uppercase">Lead Metadata</div>
                    <div className="font-extrabold text-xs text-white tracking-tight">{latest.name}</div>
                    <div className="text-[11px] text-slate-400 leading-snug">{latest.address}</div>
                    <div className="text-[11px] text-slate-500 font-bold mt-1">Rating: {latest.rating} ⭐ ({latest.reviews} reviews)</div>
                  </div>

                  {/* Outbound outreach message bubble */}
                  <div className="self-end bg-slate-900 text-slate-200 p-5 rounded-2xl max-w-md border border-blue-900/40 flex flex-col gap-2.5 shadow-2xl relative">
                    <div className="absolute top-0 right-4 transform -translate-y-1/2 bg-blue-600 text-white text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded-md">
                      Smart Pitch
                    </div>
                    <p className="text-xs leading-relaxed text-slate-300">
                      Hello <strong>{latest.name}</strong>,<br /><br />
                      We noticed your digital footprint and review score of <strong>{latest.rating} ⭐</strong> in Faisalabad.
                      We would love to assist you in getting high-converting customer leads. Let's arrange a brief introductory call this week!
                    </p>
                    <div className="flex items-center justify-end gap-1.5 self-end mt-1 text-[10px] font-bold text-slate-500">
                      <span>Just now</span>
                      <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                  </div>
                </div>

                {/* Message input area */}
                <div className="h-16 bg-slate-900 px-6 flex items-center justify-between border-t border-slate-800 flex-shrink-0 gap-4">
                  <div className="flex-1 bg-slate-950 border border-slate-800/80 rounded-xl px-4 py-2 text-xs text-slate-500 font-medium select-none">
                    Automated outbound campaign is actively sending...
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/10 flex-shrink-0 cursor-pointer">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
}
