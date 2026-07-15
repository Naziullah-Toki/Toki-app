import { Business } from '../types';

export function downloadLeadsCSV(leads: Business[], keyword: string) {
  if (leads.length === 0) return;

  const headers = [
    'Name',
    'Category',
    'Rating',
    'Reviews Count',
    'Address',
    'Phone',
    'Email Address',
    'Website',
    'WhatsApp Status',
    'Outreach Status',
  ];

  const rows = leads.map((lead) => [
    `"${lead.name.replace(/"/g, '""')}"`,
    `"${lead.category}"`,
    lead.rating,
    lead.reviews,
    `"${lead.address.replace(/"/g, '""')}"`,
    `"${lead.phone}"`,
    `"${lead.email}"`,
    `"${lead.website}"`,
    lead.whatsappAvailable ? 'Active' : 'Offline',
    lead.status.toUpperCase(),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((e) => e.join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `LeadOutfy_Leads_${keyword.replace(/[^a-z0-9]/gi, '_')}_${dateStr}.csv`;
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadLeadsExcel(leads: Business[], keyword: string) {
  // Excel output can be simulated via XML Spreadsheet or simple tab-separated content
  // Since CSV is universal, we can download a tab-separated text file styled as .xls for compatibility
  if (leads.length === 0) return;

  const headers = [
    'Name',
    'Category',
    'Rating',
    'Reviews Count',
    'Address',
    'Phone',
    'Email Address',
    'Website',
    'WhatsApp Status',
    'Outreach Status',
  ];

  const rows = leads.map((lead) => [
    lead.name,
    lead.category,
    lead.rating,
    lead.reviews,
    lead.address,
    lead.phone,
    lead.email,
    lead.website,
    lead.whatsappAvailable ? 'Active' : 'Offline',
    lead.status.toUpperCase(),
  ]);

  const tsvContent = [
    headers.join('\t'),
    ...rows.map((e) => e.join('\t')),
  ].join('\n');

  const blob = new Blob([tsvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `LeadOutfy_Leads_${keyword.replace(/[^a-z0-9]/gi, '_')}_${dateStr}.xls`;
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
