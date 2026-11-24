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

// Installer listings are managed via Wix CMS (ApprovedInstallers collection).
// Placeholder/unapproved listings removed per client instruction before going live.
export const approvedInstallers: ApprovedInstaller[] = [];
