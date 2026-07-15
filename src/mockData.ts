import { Business } from './types';

export const MOCK_COUNTRIES = [
  'All Countries',
  'Bangladesh',
  'Pakistan',
  'United States',
  'United Kingdom',
];

export const MOCK_CITIES_BY_COUNTRY: Record<string, string[]> = {
  'All Countries': ['All Cities'],
  'Bangladesh': ['All Cities', 'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi'],
  'Pakistan': ['All Cities', 'Faisalabad', 'Lahore', 'Karachi', 'Islamabad'],
  'United States': ['All Cities', 'New York', 'Los Angeles', 'Chicago', 'Miami'],
  'United Kingdom': ['All Cities', 'London', 'Manchester', 'Birmingham', 'Edinburgh'],
};

// Generates lists of realistic businesses dynamically based on keyword and location
export function generateMockBusinesses(keyword: string, city: string, country: string): Business[] {
  const normKeyword = keyword.toLowerCase().trim() || 'marketing';
  const finalCity = city === 'All Cities' ? 'Faisalabad' : city;
  const finalCountry = country === 'All Countries' ? 'Pakistan' : country;

  // Business templates depending on category
  let category = 'Local Business';
  let names: string[] = [];

  if (normKeyword.includes('market') || normKeyword.includes('ad') || normKeyword.includes('seo') || normKeyword.includes('lead')) {
    category = 'Digital Marketing Agency';
    names = [
      'Infinity Marketing Agency',
      'SEO Services Faisalabad',
      'AAA AD Digital Marketing',
      'Apex Expert Services',
      'Spark SEO Solutions',
      'Intellect Tech Digital & SEO',
      'Search Ring Digital (SMG)',
      'Lead Magnets Agency',
      'Faisalabad SEO Expert',
      'Web & Marketing Co.',
      'Alpha Media & Lead Gen',
      'Prime Boost Digital',
      'Vibe Media Agency',
      'Bright Path Consultants',
      'Target Leads International',
    ];
  } else if (normKeyword.includes('rest') || normKeyword.includes('food') || normKeyword.includes('cafe')) {
    category = 'Restaurant & Café';
    names = [
      'The Grill Lounge',
      'Royal Feast Restaurant',
      'Bake & Coffee Hub',
      'Golden Dragon Chinese',
      'Spice Junction',
      'Urban Bites Café',
      'Gourmet Palace',
      'The Pizza Crust',
      'Grand Dine Restaurant',
      'The Daily Grind Cafe',
      'Faisalabad Foodies Spot',
    ];
  } else if (normKeyword.includes('dent') || normKeyword.includes('clin') || normKeyword.includes('doc') || normKeyword.includes('health')) {
    category = 'Dental Clinic & Healthcare';
    names = [
      'SMILE Dental Care',
      'Apex Family Dentistry',
      'City Care Medical Clinic',
      'Metro Dental Hub',
      'Bright White Orthodontics',
      'Modern Dental Center',
      'Elite Dental Services',
      'Grace Health Clinic',
      'Caring Hands Dental',
    ];
  } else if (normKeyword.includes('real') || normKeyword.includes('est') || normKeyword.includes('agent') || normKeyword.includes('prop')) {
    category = 'Real Estate Agency';
    names = [
      'Premium Properties',
      'City View Real Estate',
      'Apex Realtors & Builders',
      'Golden Key Property Group',
      'Metro Builders & Real Estate',
      'Skyline Property Advisory',
      'Greenfield Real Estate',
      'Legacy Homes Agency',
    ];
  } else {
    // Default fallback list
    category = `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} Service Provider`;
    names = [
      `Apex ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} Hub`,
      `Royal ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} & Co.`,
      `Metro ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} Services`,
      `Elite ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} Group`,
      `Faisalabad ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} Expert`,
      `Global ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} Solutions`,
      `Prime ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} Partner`,
      `Express ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} Pro`,
    ];
  }

  // Country specific detail generators
  let phonePrefix = '+92';
  let addressSuffix = `Punjab, ${finalCountry}`;

  if (finalCountry === 'Bangladesh') {
    phonePrefix = '+880';
    addressSuffix = `Dhaka Division, ${finalCountry}`;
  } else if (finalCountry === 'United States') {
    phonePrefix = '+1';
    addressSuffix = `NY 10001, ${finalCountry}`;
  } else if (finalCountry === 'United Kingdom') {
    phonePrefix = '+44';
    addressSuffix = `Greater London, ${finalCountry}`;
  }

  return names.map((name, index) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const hasEmail = index % 5 !== 1; // 80% have emails
    const emailDomain = slug.includes('seo') ? 'seo-pro.com' : 'digital-marketing.co';
    const email = hasEmail ? `contact@${slug}.com` : ''; // Some have no email to simulate filter
    const rating = parseFloat((4.0 + Math.random() * 1.0).toFixed(1));
    const reviews = Math.floor(10 + Math.random() * 450);

    // Coordinate generator inside target city / area
    const centerLat = 31.4504; // Faisalabad base
    const centerLng = 73.1350;
    const latOffset = (Math.random() - 0.5) * 0.1;
    const lngOffset = (Math.random() - 0.5) * 0.1;

    const formattedPhone = `${phonePrefix} ${Math.floor(300 + Math.random() * 99)} ${Math.floor(1000000 + Math.random() * 9000000)}`;

    return {
      id: `lead_${index + 1}_${slug}`,
      name,
      category,
      rating,
      reviews,
      address: `${index + 12}, Main Boulevard, Block ${String.fromCharCode(65 + (index % 4))}, ${finalCity}, ${addressSuffix}`,
      phone: formattedPhone,
      email,
      website: hasEmail ? `www.${slug}.com` : '',
      whatsappAvailable: index % 3 !== 1, // 66% have whatsapp active
      latitude: centerLat + latOffset,
      longitude: centerLng + lngOffset,
      status: 'pending',
    };
  });
}

export const MOCK_EMAIL_LOGS: string[] = [
  'Connection established with SMTP Server.',
  'Auth successful. Ready to send emails.',
];

export const MOCK_WHATSAPP_LOGS: string[] = [
  'WhatsApp server connection initiated...',
  'QR Code generated successfully.',
];
