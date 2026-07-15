export interface Business {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  address: string;
  phone: string;
  email: string;
  website: string;
  whatsappAvailable: boolean;
  latitude: number;
  longitude: number;
  status: 'pending' | 'scraped' | 'email_sent' | 'whatsapp_sent' | 'both_sent' | 'failed';
}

export interface ScrapeSettings {
  keyword: string;
  country: string;
  city: string;
  maxResults: number;
  speed: 'slow' | 'normal' | 'fast';
  filterEmail: boolean;
  filterPhone: boolean;
  filterWebsite: boolean;
}

export interface EmailSettings {
  autoSend: boolean;
  connected: boolean;
  emailAddress: string;
  delay: number; // in seconds
  subjectTemplate: string;
  bodyTemplate: string;
}

export interface WhatsAppSettings {
  autoSend: boolean;
  connected: boolean;
  phoneConnected: string;
  delay: number; // in seconds
  bodyTemplate: string;
}

export interface ScraperStats {
  totalFound: number;
  totalEmails: number;
  whatsappSent: number;
  emailsSent: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'email' | 'whatsapp' | 'success' | 'error';
  message: string;
}
