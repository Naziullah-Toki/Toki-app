/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import BrowserHeader from './browser_header_replacement'; // This will map to BrowserHeader
import GoogleMapsPanel from './components/GoogleMapsPanel';
import LeadOutfyExtension from './components/LeadOutfyExtension';
import PortalDashboard from './components/PortalDashboard';
import WhatsAppWebPanel from './components/WhatsAppWebPanel';
import { 
  Business, ScrapeSettings, EmailSettings, WhatsAppSettings, 
  ScraperStats, LogEntry 
} from './types';
import { generateMockBusinesses } from './mockData';
import { downloadLeadsCSV, downloadLeadsExcel } from './utils/csvHelper';
import { Sparkles, ArrowRight, Play, QrCode, Shield, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'gmaps' | 'dashboard' | 'whatsapp'>('gmaps');
  const [isScraping, setIsScraping] = useState(false);
  const [leads, setLeads] = useState<Business[]>([]);
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Scraper controls & settings
  const [scrapeSettings, setScrapeSettings] = useState<ScrapeSettings>({
    keyword: 'digital marketing',
    country: 'Pakistan',
    city: 'Faisalabad',
    maxResults: 20,
    speed: 'normal',
    filterEmail: false,
    filterPhone: false,
    filterWebsite: false,
  });

  // Account License Settings
  const [licenseKey, setLicenseKey] = useState(() => localStorage.getItem('leadoutfy_license_key') || 'LO-7714X-ACTIVE');
  const [isLicenseActive, setIsLicenseActive] = useState(() => localStorage.getItem('leadoutfy_is_license_active') === 'true');
  const [credits, setCredits] = useState(() => {
    const saved = localStorage.getItem('leadoutfy_credits');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('leadoutfy_license_key', licenseKey);
    localStorage.setItem('leadoutfy_is_license_active', String(isLicenseActive));
    localStorage.setItem('leadoutfy_credits', String(credits));
  }, [licenseKey, isLicenseActive, credits]);

  // Multi-Channel Outreach templates & configurations
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    autoSend: true,
    connected: false,
    emailAddress: '',
    delay: 10,
    subjectTemplate: 'Collaborative Lead Proposal - {name}',
    bodyTemplate: 'Hello {name},\n\nWe noticed your business listing in {city} under {category}. Your current rating is {rating}⭐ with {reviews} reviews.\n\nWe specialize in securing qualified customer leads. Can we schedule a brief 5-minute introductory call next week?\n\nWarm regards,\nLeadOutfy Automation Team',
  });

  const [whatsAppSettings, setWhatsAppSettings] = useState<WhatsAppSettings>({
    autoSend: true,
    connected: false,
    phoneConnected: '',
    delay: 10,
    bodyTemplate: 'Hey {name}! 🚀 We saw your business on Google Maps in {city}. Your score is {rating}⭐. We want to help you scale your leads. Reply with "YES" to schedule a brief call!',
  });

  // Stats Counters
  const [stats, setStats] = useState<ScraperStats>({
    totalFound: 0,
    totalEmails: 0,
    whatsappSent: 0,
    emailsSent: 0,
  });

  // Console log stream
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [
      {
        id: `log_${Date.now()}_${Math.random()}`,
        timestamp,
        type,
        message,
      },
      ...prev,
    ]);
  };

  // Scraper thread interval reference
  const scraperIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const activeScrapeIndexRef = useRef<number>(0);

  // Stop current scraper thread
  const handleStopScraping = () => {
    setIsScraping(false);
    if (scraperIntervalRef.current) {
      clearInterval(scraperIntervalRef.current);
      scraperIntervalRef.current = null;
    }
    addLog('Scraping session paused by user.', 'info');
  };

  // Reset Session
  const handleResetScraper = () => {
    handleStopScraping();
    setLeads([]);
    setActiveLeadId(null);
    setStats({
      totalFound: 0,
      totalEmails: 0,
      whatsappSent: 0,
      emailsSent: 0,
    });
    setLogs([]);
    addLog('Session reset successfully. Ready for new search keyword.', 'info');
  };

  // Trigger spreadsheet downloads
  const handleTriggerDownload = (format: 'csv' | 'excel') => {
    if (format === 'csv') {
      downloadLeadsCSV(leads, scrapeSettings.keyword);
      addLog('CSV Lead spreadsheet successfully downloaded.', 'success');
    } else {
      downloadLeadsExcel(leads, scrapeSettings.keyword);
      addLog('Excel Lead spreadsheet successfully downloaded.', 'success');
    }
  };

  // Simulated CSV Import
  const handleUploadCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    addLog(`Reading file: ${file.name}...`, 'info');
    setTimeout(() => {
      // Simulate reading and loading 15 preset business leads
      const preLeads = generateMockBusinesses('imported leads', scrapeSettings.city, scrapeSettings.country);
      setLeads(preLeads);
      setStats((prev) => ({
        ...prev,
        totalFound: preLeads.length,
        totalEmails: preLeads.filter((l) => l.email).length,
      }));
      addLog(`Import complete! Loaded ${preLeads.length} leads from CSV file.`, 'success');
    }, 1000);
  };

  // Start scraper thread
  const handleStartScraping = () => {
    if (!isLicenseActive) {
      addLog('Validation Failure: License Key required inside the Key/License tab.', 'error');
      return;
    }

    if (isScraping) return;

    setIsScraping(true);
    addLog(`Launching non-stop lead scrape engine for niche: "${scrapeSettings.keyword}"`, 'info');
    addLog(`Connecting Maps crawler inside ${scrapeSettings.city}...`, 'info');

    // Generate dynamic mock businesses matching the exact keyword and city target
    const pool = generateMockBusinesses(scrapeSettings.keyword, scrapeSettings.city, scrapeSettings.country);

    // Apply data filters
    const filteredPool = pool.filter((lead) => {
      if (scrapeSettings.filterEmail && !lead.email) return false;
      if (scrapeSettings.filterPhone && !lead.phone) return false;
      if (scrapeSettings.filterWebsite && !lead.website) return false;
      return true;
    });

    if (filteredPool.length === 0) {
      addLog('No businesses matched current criteria. Try enabling broad search (disable filters).', 'error');
      setIsScraping(false);
      return;
    }

    // Set leads pool state
    setLeads(filteredPool);
    activeScrapeIndexRef.current = 0;

    const delayMs = scrapeSettings.speed === 'slow' ? 3000 : scrapeSettings.speed === 'normal' ? 2000 : 800;

    scraperIntervalRef.current = setInterval(() => {
      const index = activeScrapeIndexRef.current;
      if (index >= filteredPool.length || index >= scrapeSettings.maxResults) {
        handleStopScraping();
        addLog('Completed Scraping session. All target leads fetched!', 'success');
        return;
      }

      const currentTarget = filteredPool[index];
      setActiveLeadId(currentTarget.id);

      // Scrape sequence simulation
      addLog(`Crawling: "${currentTarget.name}" - ${currentTarget.category}`, 'info');

      // Update lead status to scraped
      setLeads((prev) =>
        prev.map((l, i) => (i === index ? { ...l, status: 'scraped' } : l))
      );

      // Increment counters
      setStats((prev) => ({
        ...prev,
        totalFound: index + 1,
        totalEmails: prev.totalEmails + (currentTarget.email ? 1 : 0),
      }));

      // Subtract credit for lead extraction
      setCredits((prev) => Math.max(0, prev - 1));

      // Automatic outreach simulations (Email / WhatsApp delays)
      let finalStatus: Business['status'] = 'scraped';

      // 1. Email automated sequence
      if (emailSettings.autoSend && currentTarget.email) {
        if (emailSettings.connected) {
          finalStatus = 'email_sent';
          addLog(`SMTP success: Outreach sent to ${currentTarget.email}`, 'email');
          setStats((prev) => ({ ...prev, emailsSent: prev.emailsSent + 1 }));
        } else {
          addLog(`SMTP warning: Skipping email to ${currentTarget.email} (Server offline)`, 'error');
        }
      }

      // 2. WhatsApp automated sequence
      if (whatsAppSettings.autoSend && currentTarget.phone && currentTarget.whatsappAvailable) {
        if (whatsAppSettings.connected) {
          finalStatus = finalStatus === 'email_sent' ? 'both_sent' : 'whatsapp_sent';
          addLog(`WhatsApp message dispatched to ${currentTarget.phone}`, 'whatsapp');
          setStats((prev) => ({ ...prev, whatsappSent: prev.whatsappSent + 1 }));
        } else {
          addLog(`WhatsApp warning: Skipping ${currentTarget.phone} (No connected channel)`, 'error');
        }
      }

      if (finalStatus !== 'scraped') {
        setLeads((prev) =>
          prev.map((l, i) => (i === index ? { ...l, status: finalStatus } : l))
        );
      }

      activeScrapeIndexRef.current += 1;
    }, delayMs);
  };

  const handleIncomingLeadsRef = useRef<(incomingLeads: Business[]) => void>(() => {});

  const handleIncomingLeads = (incomingLeads: Business[]) => {
    if (incomingLeads && incomingLeads.length > 0) {
      setLeads((prev) => {
        const existingIds = new Set(prev.map((l) => l.id));
        const existingNames = new Set(prev.map((l) => l.name.toLowerCase().trim()));
        const uniqueIncoming = incomingLeads.filter(
          (l) => !existingIds.has(l.id) && !existingNames.has(l.name.toLowerCase().trim())
        );
        
        if (uniqueIncoming.length === 0) return prev;

        // Defer side-effects to prevent nested React update batching errors
        setTimeout(() => {
          addLog(`Synced ${uniqueIncoming.length} new business leads from Google Chrome Extension!`, 'success');
          
          uniqueIncoming.forEach((lead) => {
            addLog(`Crawled (Extension): "${lead.name}" - ${lead.category}`, 'info');

            // SMTP auto outreach simulation for extension leads
            if (emailSettings.autoSend && lead.email) {
              if (emailSettings.connected) {
                addLog(`SMTP success: Outreach sent to ${lead.email}`, 'email');
              } else {
                addLog(`SMTP warning: Skipping email to ${lead.email} (Server offline)`, 'error');
              }
            }

            // WhatsApp auto outreach simulation for extension leads
            if (whatsAppSettings.autoSend && lead.phone && lead.whatsappAvailable) {
              if (whatsAppSettings.connected) {
                addLog(`WhatsApp message dispatched to ${lead.phone}`, 'whatsapp');
              } else {
                addLog(`WhatsApp warning: Skipping ${lead.phone} (No connected channel)`, 'error');
              }
            }
          });

          setStats((prevStats) => {
            let extraEmailsSent = 0;
            let extraWhatsappSent = 0;

            uniqueIncoming.forEach((lead) => {
              if (emailSettings.autoSend && lead.email && emailSettings.connected) {
                extraEmailsSent++;
              }
              if (whatsAppSettings.autoSend && lead.phone && lead.whatsappAvailable && whatsAppSettings.connected) {
                extraWhatsappSent++;
              }
            });

            return {
              ...prevStats,
              totalFound: prevStats.totalFound + uniqueIncoming.length,
              totalEmails: prevStats.totalEmails + uniqueIncoming.filter((l) => l.email).length,
              emailsSent: prevStats.emailsSent + extraEmailsSent,
              whatsappSent: prevStats.whatsappSent + extraWhatsappSent,
            };
          });

          // Subtract credits for lead extraction
          setCredits((prevCredits) => Math.max(0, prevCredits - uniqueIncoming.length));
        }, 0);

        // Update status of incoming leads based on outreach configuration
        const processedIncoming = uniqueIncoming.map((lead) => {
          let finalStatus: Business['status'] = 'scraped';
          if (emailSettings.autoSend && lead.email && emailSettings.connected) {
            finalStatus = 'email_sent';
          }
          if (whatsAppSettings.autoSend && lead.phone && lead.whatsappAvailable && whatsAppSettings.connected) {
            finalStatus = finalStatus === 'email_sent' ? 'both_sent' : 'whatsapp_sent';
          }
          return { ...lead, status: finalStatus };
        });

        return [...prev, ...processedIncoming];
      });
    }
  };

  useEffect(() => {
    handleIncomingLeadsRef.current = handleIncomingLeads;
  });

  // Clear interval on unmount and listen for real-time Chrome Extension syncs
  useEffect(() => {
    // 1. Listen to postMessage event (highly reliable cross-world channel)
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.source === "leadoutfy-portal-bridge" && event.data.action === "LeadOutfySyncLeads") {
        handleIncomingLeadsRef.current(event.data.data);
      }
    };

    // 2. Listen to document custom event (highly reliable shared DOM channel)
    const handleSyncLeadsDocument = (e: Event) => {
      const customEvent = e as CustomEvent<Business[]>;
      handleIncomingLeadsRef.current(customEvent.detail);
    };

    // 3. Listen to window custom event (fallback)
    const handleSyncLeadsWindow = (e: Event) => {
      const customEvent = e as CustomEvent<Business[]>;
      handleIncomingLeadsRef.current(customEvent.detail);
    };

    window.addEventListener('message', handleMessage);
    document.addEventListener('LeadOutfySyncLeads', handleSyncLeadsDocument);
    window.addEventListener('LeadOutfySyncLeads', handleSyncLeadsWindow);

    return () => {
      if (scraperIntervalRef.current) clearInterval(scraperIntervalRef.current);
      window.removeEventListener('message', handleMessage);
      document.removeEventListener('LeadOutfySyncLeads', handleSyncLeadsDocument);
      window.removeEventListener('LeadOutfySyncLeads', handleSyncLeadsWindow);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-slate-950 select-none overflow-hidden" id="app-root">
      
      {/* High fidelity browser frame wrapper */}
      <BrowserHeader
        currentUrl={
          activeTab === 'gmaps'
            ? `https://www.google.com/maps/search/${encodeURIComponent(scrapeSettings.keyword)}+in+${encodeURIComponent(scrapeSettings.city)}`
            : activeTab === 'whatsapp'
            ? 'https://web.whatsapp.com'
            : 'https://leadoutfy.com/member/portal/dashboard'
        }
        onRefresh={() => {
          addLog('Refreshed active portal view state.', 'info');
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main workspace layout */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Dynamic Content Viewports */}
        <div className="flex-1 h-full overflow-hidden">
          {activeTab === 'gmaps' && (
            <GoogleMapsPanel
              keyword={scrapeSettings.keyword}
              setKeyword={(val) => setScrapeSettings((prev) => ({ ...prev, keyword: val }))}
              selectedCity={scrapeSettings.city}
              setSelectedCity={(val) => setScrapeSettings((prev) => ({ ...prev, city: val }))}
              selectedCountry={scrapeSettings.country}
              setSelectedCountry={(val) => setScrapeSettings((prev) => ({ ...prev, country: val }))}
              maxResults={scrapeSettings.maxResults}
              setMaxResults={(val) => setScrapeSettings((prev) => ({ ...prev, maxResults: val }))}
              leads={leads}
              activeLeadId={activeLeadId}
              onStartScraping={handleStartScraping}
              isScraping={isScraping}
              onStopScraping={handleStopScraping}
              totalFound={stats.totalFound}
              zoomLevel={zoomLevel}
              setZoomLevel={setZoomLevel}
            />
          )}

          {activeTab === 'dashboard' && (
            <PortalDashboard
              leads={leads}
              isLicenseActive={isLicenseActive}
              credits={credits}
              setCredits={setCredits}
              onActivateLicense={() => {
                setIsLicenseActive(true);
                setCredits(7714);
                addLog('Product license key successfully validated.', 'success');
              }}
              onTriggerDownload={handleTriggerDownload}
            />
          )}

          {activeTab === 'whatsapp' && (
            <WhatsAppWebPanel
              phoneConnected={whatsAppSettings.phoneConnected}
              leads={leads}
            />
          )}
        </div>

        {/* Chrome Extension Overlay Viewport Panel (Pinned on Top Right during Maps scraping) */}
        {activeTab === 'gmaps' && (
          <div className="absolute top-4 bottom-4 right-4 z-30 transition-all duration-300 transform scale-100 shadow-2xl flex flex-col max-h-[560px]">
            <LeadOutfyExtension
              scrapeSettings={scrapeSettings}
              setScrapeSettings={setScrapeSettings}
              emailSettings={emailSettings}
              setEmailSettings={setEmailSettings}
              whatsAppSettings={whatsAppSettings}
              setWhatsAppSettings={setWhatsAppSettings}
              stats={stats}
              isScraping={isScraping}
              onStartScraping={handleStartScraping}
              onStopScraping={handleStopScraping}
              onResetScraper={handleResetScraper}
              licenseKey={licenseKey}
              setLicenseKey={setLicenseKey}
              isLicenseActive={isLicenseActive}
              setIsLicenseActive={(active) => {
                setIsLicenseActive(active);
                if (active) addLog('Product license key successfully validated.', 'success');
              }}
              credits={credits}
              setCredits={setCredits}
              logs={logs}
              leads={leads}
              onUploadCsv={handleUploadCsv}
              onTriggerDownload={handleTriggerDownload}
            />
          </div>
        )}
      </div>
    </div>
  );
}
