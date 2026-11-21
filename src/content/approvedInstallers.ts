export interface ApprovedInstaller {
  id: string;
  name: string;
  logo?: string;
  tagline: string;
  shortDescription: string;
  phone: string;
  email: string;
  website: string;
  baseLocation: string;
  county: string;
  lat: number;
  lng: number;
  coveredPostcodes: string[]; // UK outward postcode areas (e.g. ['BS', 'BA', 'GL', 'SN'])
  coveredCounties: string[];
  services: string[];
  accreditations: string[];
  mcsNumber: string;
  tradingYears: number;
  rating: number;
  reviewCount: number;
  status: 'active' | 'paused';
}

export const approvedInstallers: ApprovedInstaller[] = [
  {
    id: 'inst-sw-1',
    name: 'Apex Renewables Ltd',
    tagline: 'Premium Solar PV & Battery Specialists across the South West',
    shortDescription:
      'Apex Renewables is an established domestic and commercial solar installation firm with over 8 years of clean energy engineering experience across the West Country.',
    phone: '+44 117 942 8110',
    email: 'enquiries@apexrenewables.co.uk',
    website: 'https://www.apexrenewables.co.uk',
    baseLocation: 'Bristol',
    county: 'Bristol',
    lat: 51.4545,
    lng: -2.5879,
    coveredPostcodes: ['BS', 'BA', 'GL', 'SN', 'TA'],
    coveredCounties: ['Bristol', 'Somerset', 'Gloucestershire', 'Wiltshire'],
    services: ['Solar PV', 'Battery Storage', 'EV Charging', 'System Upgrades'],
    accreditations: ['MCS Certified', 'TrustMark', 'HIES Protected', 'RECC Member'],
    mcsNumber: 'MCS-40918',
    tradingYears: 8,
    rating: 4.9,
    reviewCount: 142,
    status: 'active',
  },
  {
    id: 'inst-sw-2',
    name: 'Wessex Solar Care',
    tagline: 'Independent solar installation and battery retrofitting',
    shortDescription:
      'Family-owned renewable energy engineers serving Somerset and Wiltshire. Certified installers for GivEnergy, Tesla, and SolarEdge systems.',
    phone: '+44 1225 308940',
    email: 'info@wessexsolarcare.co.uk',
    website: 'https://www.wessexsolarcare.co.uk',
    baseLocation: 'Bath',
    county: 'Somerset',
    lat: 51.3811,
    lng: -2.359,
    coveredPostcodes: ['BA', 'BS', 'SP', 'DT'],
    coveredCounties: ['Somerset', 'Wiltshire', 'Dorset'],
    services: ['Solar PV', 'Battery Storage', 'EPS Backup Power'],
    accreditations: ['MCS Certified', 'EPVS Member', 'IWA Guaranteed'],
    mcsNumber: 'MCS-38291',
    tradingYears: 5,
    rating: 4.8,
    reviewCount: 89,
    status: 'active',
  },
  {
    id: 'inst-ldn-1',
    name: 'Meridian Solar Engineering',
    tagline: 'High-density urban solar & hybrid battery storage solutions',
    shortDescription:
      'London and Home Counties specialist in microinverters, complex slate roofs, and high-voltage domestic battery arrays with full G99 grid liaison.',
    phone: '+44 20 8194 7720',
    email: 'contact@meridiansolar.co.uk',
    website: 'https://www.meridiansolar.co.uk',
    baseLocation: 'London & Surrey',
    county: 'Greater London',
    lat: 51.5074,
    lng: -0.1278,
    coveredPostcodes: ['SW', 'SE', 'W', 'WC', 'E', 'EC', 'N', 'NW', 'CR', 'KT', 'SM', 'BR'],
    coveredCounties: ['Greater London', 'Surrey', 'Kent'],
    services: ['Solar PV', 'Battery Storage', 'Microinverters', 'EV Charging'],
    accreditations: ['MCS Certified', 'NAPIT', 'TrustMark', 'HIES Protected'],
    mcsNumber: 'MCS-51829',
    tradingYears: 7,
    rating: 4.9,
    reviewCount: 215,
    status: 'active',
  },
  {
    id: 'inst-mid-1',
    name: 'Midland Clean Energy Systems',
    tagline: 'Residential solar arrays and smart home energy automation',
    shortDescription:
      'Serving the West and East Midlands with bespoke solar PV designs, SigEnergy & GivEnergy battery systems, and intelligent tariff integration.',
    phone: '+44 121 663 9200',
    email: 'hello@midlandcleanenergy.co.uk',
    website: 'https://www.midlandcleanenergy.co.uk',
    baseLocation: 'Birmingham',
    county: 'West Midlands',
    lat: 52.4862,
    lng: -1.8904,
    coveredPostcodes: ['B', 'CV', 'WV', 'WS', 'DY', 'LE', 'DE', 'NG'],
    coveredCounties: ['West Midlands', 'Warwickshire', 'Staffordshire', 'Leicestershire'],
    services: ['Solar PV', 'Battery Storage', 'EV Charging', 'Heat Pumps'],
    accreditations: ['MCS Certified', 'NICEIC Approved', 'TrustMark', 'RECC Member'],
    mcsNumber: 'MCS-29471',
    tradingYears: 9,
    rating: 4.8,
    reviewCount: 167,
    status: 'active',
  },
  {
    id: 'inst-north-1',
    name: 'Pennine Solar Works',
    tagline: 'Robust domestic renewable power tailored for Northern climates',
    shortDescription:
      'Expert solar and storage installation team covering Greater Manchester, Cheshire, and Lancashire. Specialising in bifacial panels and hybrid inverter systems.',
    phone: '+44 161 789 4430',
    email: 'support@penninesolar.co.uk',
    website: 'https://www.penninesolar.co.uk',
    baseLocation: 'Manchester',
    county: 'Greater Manchester',
    lat: 53.4808,
    lng: -2.2426,
    coveredPostcodes: ['M', 'SK', 'WA', 'WN', 'BL', 'OL', 'PR', 'BB'],
    coveredCounties: ['Greater Manchester', 'Cheshire', 'Lancashire'],
    services: ['Solar PV', 'Battery Storage', 'EV Charging', 'System Servicing'],
    accreditations: ['MCS Certified', 'ECA Member', 'TrustMark', 'HIES Protected'],
    mcsNumber: 'MCS-44102',
    tradingYears: 6,
    rating: 4.9,
    reviewCount: 114,
    status: 'active',
  },
  {
    id: 'inst-wal-1',
    name: 'Cambrian Energy Solutions',
    tagline: 'Vetted solar and battery installations across South & Mid Wales',
    shortDescription:
      'Local Welsh renewable specialists dedicated to quality installations, bird-guard protection, and emergency power supply (EPS) backup configurations.',
    phone: '+44 29 2088 1900',
    email: 'info@cambrianenergy.co.uk',
    website: 'https://www.cambrianenergy.co.uk',
    baseLocation: 'Cardiff',
    county: 'South Glamorgan',
    lat: 51.4816,
    lng: -3.1791,
    coveredPostcodes: ['CF', 'NP', 'SA', 'LD'],
    coveredCounties: ['Cardiff', 'Newport', 'Swansea', 'Monmouthshire'],
    services: ['Solar PV', 'Battery Storage', 'Bird Protection', 'EPS Backup'],
    accreditations: ['MCS Certified', 'NICEIC Approved', 'TrustMark', 'RECC Member'],
    mcsNumber: 'MCS-33921',
    tradingYears: 5,
    rating: 4.8,
    reviewCount: 76,
    status: 'active',
  },
  {
    id: 'inst-sco-1',
    name: 'Caledonian Solar Tech',
    tagline: 'High-efficiency solar solutions engineered for Scotland',
    shortDescription:
      'Covering Edinburgh, Lothian, Glasgow, and the Central Belt. MCS certified installations optimized for diffuse daylight capture with full warranty handover.',
    phone: '+44 131 559 2140',
    email: 'contact@caledoniansolar.co.uk',
    website: 'https://www.caledoniansolar.co.uk',
    baseLocation: 'Edinburgh',
    county: 'Midlothian',
    lat: 55.9533,
    lng: -3.1883,
    coveredPostcodes: ['EH', 'G', 'FK', 'KY', 'ML'],
    coveredCounties: ['City of Edinburgh', 'Glasgow', 'Fife', 'Falkirk'],
    services: ['Solar PV', 'Battery Storage', 'EV Charging'],
    accreditations: ['MCS Certified', 'SELECT Registered', 'TrustMark', 'RECC Member'],
    mcsNumber: 'MCS-47209',
    tradingYears: 6,
    rating: 4.9,
    reviewCount: 98,
    status: 'active',
  },
];
