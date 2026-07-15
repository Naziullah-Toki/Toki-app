import React, { useRef, useEffect } from 'react';
import { Search, Star, MapPin, Phone, Globe, Mail, AlertCircle, RefreshCw, Layers, ZoomIn, ZoomOut, Compass } from 'lucide-react';
import { Business } from '../types';

interface GoogleMapsPanelProps {
  keyword: string;
  setKeyword: (keyword: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  maxResults: number;
  setMaxResults: (val: number) => void;
  leads: Business[];
  activeLeadId: string | null;
  onStartScraping: () => void;
  isScraping: boolean;
  onStopScraping: () => void;
  totalFound: number;
  zoomLevel: number;
  setZoomLevel: (z: number) => void;
}

export default function GoogleMapsPanel({
  keyword,
  setKeyword,
  selectedCity,
  setSelectedCity,
  selectedCountry,
  setSelectedCountry,
  maxResults,
  setMaxResults,
  leads,
  activeLeadId,
  onStartScraping,
  isScraping,
  onStopScraping,
  totalFound,
  zoomLevel,
  setZoomLevel,
}: GoogleMapsPanelProps) {
  const mapCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeLead = leads.find((l) => l.id === activeLeadId) || leads[0];

  // Draw simulated maps canvas with real vector look and feel (Futuristic Dark theme)
  useEffect(() => {
    const canvas = mapCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high-dpi monitors
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Draw Map background (Sleek Dark Map color scheme)
    ctx.fillStyle = '#0f172a'; // Deep slate
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw some roads/grids based on selected zoom
    ctx.strokeStyle = '#1e293b'; // Slightly lighter slate
    ctx.lineWidth = 2 * (zoomLevel / 100);

    // Secondary roads grid
    ctx.beginPath();
    for (let i = 0; i < rect.width; i += 50 * (zoomLevel / 100)) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i, rect.height);
    }
    for (let j = 0; j < rect.height; j += 50 * (zoomLevel / 100)) {
      ctx.moveTo(0, j);
      ctx.lineTo(rect.width, j);
    }
    ctx.stroke();

    // Primary Highways (Tech Blue / Indigo lines)
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 4 * (zoomLevel / 100);
    ctx.beginPath();
    ctx.moveTo(0, rect.height * 0.35);
    ctx.lineTo(rect.width, rect.height * 0.45);
    ctx.moveTo(rect.width * 0.3, 0);
    ctx.lineTo(rect.width * 0.5, rect.height);
    ctx.stroke();

    // Water bodies (Neon blue tint)
    ctx.fillStyle = '#1e1b4b'; // Dark indigo for deep water
    ctx.beginPath();
    ctx.moveTo(0, rect.height * 0.15);
    ctx.bezierCurveTo(rect.width * 0.2, rect.height * 0.18, rect.width * 0.4, rect.height * 0.12, rect.width, rect.height * 0.22);
    ctx.lineTo(rect.width, rect.height * 0.26);
    ctx.bezierCurveTo(rect.width * 0.4, rect.height * 0.16, rect.width * 0.2, rect.height * 0.22, 0, rect.height * 0.19);
    ctx.closePath();
    ctx.fill();

    // Green areas / Parks (Dark Forest Neon tone)
    ctx.fillStyle = '#064e3b'; // Emerald
    ctx.beginPath();
    ctx.arc(rect.width * 0.25, rect.height * 0.65, 70, 0, Math.PI * 2);
    ctx.arc(rect.width * 0.75, rect.height * 0.28, 55, 0, Math.PI * 2);
    ctx.fill();

    // Render Pinpoints for leads
    leads.forEach((lead) => {
      // Calculate coordinates scaling based on zoom
      const scaleX = rect.width / 2 + (lead.longitude - 73.1350) * 1500 * (zoomLevel / 100);
      const scaleY = rect.height / 2 - (lead.latitude - 31.4504) * 1500 * (zoomLevel / 100);

      // Skip if off bounds
      if (scaleX < 0 || scaleX > rect.width || scaleY < 0 || scaleY > rect.height) return;

      const isActive = activeLeadId === lead.id;

      // Draw custom animated ripple if scraping is currently focused on this item
      if (isActive && isScraping) {
        ctx.fillStyle = 'rgba(59, 130, 246, 0.35)'; // Blue tech ripple
        ctx.beginPath();
        ctx.arc(scaleX, scaleY, 22 + Math.sin(Date.now() / 150) * 6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Pin shape shadow
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath();
      ctx.ellipse(scaleX, scaleY + 2, 5, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Draw futuristic neon pin
      ctx.fillStyle = isActive ? '#ef4444' : '#3b82f6';
      ctx.beginPath();
      ctx.arc(scaleX, scaleY - 11, 7, 0, Math.PI * 2);
      ctx.lineTo(scaleX, scaleY);
      ctx.closePath();
      ctx.fill();

      // Pin center dot
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(scaleX, scaleY - 11, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Label (Briefly show on hovering or active)
      if (isActive) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const text = lead.name;
        const textWidth = ctx.measureText(text).width;
        ctx.roundRect(scaleX - textWidth / 2 - 10, scaleY - 42, textWidth + 20, 22, 5);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(text, scaleX, scaleY - 28);
      }
    });
  }, [leads, activeLeadId, zoomLevel, isScraping]);

  return (
    <div className="flex h-full bg-slate-950 text-slate-100 font-sans" id="google-maps-panel">
      {/* Sidebar List (Left Panel of Google Maps UI in Sleek Style) */}
      <div className="w-[360px] border-r border-slate-800 bg-slate-900 flex flex-col h-full z-10">
        
        {/* Mock Search input */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex flex-col gap-3">
          <div className="flex items-center gap-2.5 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 focus-within:border-blue-500 transition-all">
            <Search className="w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search Google Maps..."
              value={`${keyword} ${selectedCity}`}
              readOnly
              className="w-full text-xs bg-transparent outline-none border-none text-slate-200"
            />
            <Compass className="w-4.5 h-4.5 text-slate-500 animate-spin-slow cursor-pointer" />
          </div>
          
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
            <span>Location: <strong className="text-slate-300">{selectedCity}, {selectedCountry}</strong></span>
            <span>Limit: <strong className="text-blue-400">{maxResults}</strong></span>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60" style={{ scrollbarWidth: 'thin' }}>
          {leads.length === 0 ? (
            <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center h-full gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                <MapPin className="w-8 h-8 stroke-[1.5]" />
              </div>
              <div className="flex flex-col gap-1.5 px-4">
                <p className="font-extrabold text-xs uppercase tracking-widest text-slate-400">Ready to Hunt Leads</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Set target keyword/city in the Chrome Extension overlay to start live Google Maps scraping.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              {leads.map((lead) => {
                const isActive = activeLeadId === lead.id;
                return (
                  <div
                    key={lead.id}
                    className={`p-4 transition-all relative border-l-4 cursor-pointer hover:bg-slate-800/40 ${
                      isActive ? 'bg-slate-800/80 border-blue-500' : 'border-transparent'
                    }`}
                  >
                    {isActive && isScraping && (
                      <span className="absolute top-3 right-3 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                      </span>
                    )}

                    <h4 className="font-bold text-white text-xs tracking-tight truncate leading-tight pr-4">{lead.name}</h4>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">{lead.category}</p>
                    
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-xs font-black text-slate-300">{lead.rating}</span>
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 fill-current ${
                              i < Math.floor(lead.rating) ? 'text-amber-500' : 'text-slate-800'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-500">({lead.reviews})</span>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-2 truncate flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      {lead.address}
                    </p>

                    <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                      {lead.phone && (
                        <span className="bg-slate-950/80 text-slate-300 border border-slate-800 text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-500" />
                          {lead.phone}
                        </span>
                      )}
                      {lead.email && (
                        <span className="bg-blue-900/20 text-blue-400 border border-blue-800/40 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                          <Mail className="w-3 h-3 text-blue-500" />
                          {lead.email}
                        </span>
                      )}
                      {lead.website && (
                        <span className="bg-emerald-950/20 text-emerald-400 border border-emerald-800/40 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                          <Globe className="w-3 h-3 text-emerald-500" />
                          Website
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Main Map Canvas Component with floating overlays */}
      <div className="flex-1 relative h-full flex flex-col bg-slate-950">
        <canvas ref={mapCanvasRef} className="w-full h-full block" />

        {/* Floating map controls in Sleek style */}
        <div className="absolute right-4 top-4 flex flex-col gap-1.5 z-10 bg-slate-900/95 border border-slate-800 p-1.5 rounded-lg shadow-xl">
          <button 
            onClick={() => setZoomLevel(Math.min(zoomLevel + 10, 150))}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setZoomLevel(Math.max(zoomLevel - 10, 40))}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="w-full h-px bg-slate-800 my-0.5" />
          <div className="text-[10px] text-center font-black text-blue-400 font-mono select-none px-1">
            {zoomLevel}%
          </div>
        </div>

        {/* Selected Location Bottom Overlay Banner in Sleek Dark Design */}
        {activeLead && (
          <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 backdrop-blur-md shadow-2xl border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-20 animate-fade-in">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600/10 text-blue-400 p-2.5 rounded-xl border border-blue-500/20 mt-1 flex-shrink-0">
                <MapPin className="w-5 h-5 fill-current animate-pulse" />
              </div>
              <div>
                <span className="bg-blue-600 text-white text-[9px] font-black tracking-widest px-2.5 py-0.5 rounded-md uppercase shadow-lg shadow-blue-500/20">
                  Focused Scrape Target
                </span>
                <h3 className="font-extrabold text-white text-base mt-2 tracking-tight">{activeLead.name}</h3>
                <p className="text-xs font-semibold text-blue-400 mt-0.5">{activeLead.category}</p>
                <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {activeLead.address}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 items-stretch md:items-end w-full md:w-auto">
              <div className="flex gap-2 text-xs flex-wrap">
                <div className="bg-slate-950 border border-slate-800 text-slate-300 px-3.5 py-2 rounded-lg font-medium flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  {activeLead.phone || 'No Phone'}
                </div>
                <div className="bg-slate-950 border border-slate-800 text-slate-300 px-3.5 py-2 rounded-lg font-medium flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  {activeLead.email || 'No Email'}
                </div>
              </div>
              <div className="text-[10px] text-slate-500 md:text-right font-mono">
                Lat: {activeLead.latitude.toFixed(5)}, Lng: {activeLead.longitude.toFixed(5)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
