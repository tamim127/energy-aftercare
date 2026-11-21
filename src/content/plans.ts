// Support Plan specifications and descriptions for Energy Aftercare.
export type Tier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Plan {
  tier: Tier;
  name: string;
  price: string;
  slug: string;
  summary: string;
  duration: string;
  inclusions: string[];
  conditions: string;
  recommendedFor: string;
}

export const bookNowLabel = 'Book Now';
export const viewAllPlansLabel = 'View all plans';
export const supportPlansHeading = 'Support & Maintenance Plans';

// Live Book Online order: Platinum, Gold, Silver, Bronze
export const plansLiveOrder: Plan[] = [
  {
    tier: 'platinum',
    name: 'Platinum Support Plan',
    price: '£449',
    slug: 'platinum-support-plan',
    summary:
      'Executive diagnostic audit, priority engineer dispatch, and multi-string/high-capacity battery testing.',
    duration: 'Up to 4 hours comprehensive on-site service',
    recommendedFor:
      'High-capacity systems (over 8 kWp), multi-battery setups, or active inverter warning faults.',
    conditions:
      'Covers domestic or commercial arrays up to 25 kWp and battery storage up to 25 kWh. Safe roof access required.',
    inclusions: [
      'Comprehensive on-site visit by a Senior Renewable Energy Specialist',
      'Full solar array & battery health diagnostics with advanced thermal imaging',
      'Active fault-code investigation, isolation testing, and firmware patch',
      'Emergency Power Supply (EPS) gateway and off-grid transfer simulation',
      'EV charger & heat pump integration telemetry check',
      'Direct manufacturer warranty claim liaison and replacement escalation',
      'Executive Technical Compliance & Performance Certificate for insurance',
    ],
  },
  {
    tier: 'gold',
    name: 'Gold Support Plan',
    price: '£299',
    slug: 'gold-support-plan',
    summary:
      'Our most popular plan for domestic Solar + Battery setups. Complete hybrid system diagnostics and tariff tuning.',
    duration: '2.5 to 3 hours on-site service',
    recommendedFor: 'Standard domestic solar PV systems paired with battery storage (e.g. GivEnergy, Tesla, SigEnergy).',
    conditions:
      'Covers domestic systems up to 10 kWp and battery capacity up to 15 kWh. Scaffolding-free standard access.',
    inclusions: [
      'Everything in Silver, plus full battery storage health & capacity audit',
      'Battery cell temperature balancing & BMS firmware communication check',
      'Full DC string electrical testing (Open Circuit Voltage Voc & Short Circuit Current Isc)',
      'Inverter thermal scanning, cooling fan inspection, and error code log export',
      'Smart export and off-peak tariff charging optimization check',
      'Emergency backup circuit (EPS) functionality verification',
      '12-Month Certified System Health Report & MCS warranty compliance document',
    ],
  },
  {
    tier: 'silver',
    name: 'Silver Support Plan',
    price: '£149',
    slug: 'silver-support-plan',
    summary:
      'Comprehensive solar string diagnostics, DC electrical testing, and inverter firmware review.',
    duration: '2 hours on-site service',
    recommendedFor: 'Solar-only installations (2 to 8 years old) requiring professional verification of generation.',
    conditions: 'Covers domestic solar PV up to 7 kWp. Scaffolding-free roof inspection.',
    inclusions: [
      'Everything in Bronze, plus full string electrical isolation & resistance tests',
      'Inverter firmware update & manufacturer cloud monitoring synchronization',
      'Thermal imaging of DC isolators, breakers, and roof cable entry points',
      'AC/DC surge protection devices (SPD) and earthing continuity inspection',
      'Generation meter calibration check against regional UK weather yield models',
      'Digital Certificate of Electrical Compliance & Performance Audit',
    ],
  },
  {
    tier: 'bronze',
    name: 'Bronze Support Plan',
    price: '£79',
    slug: 'bronze-support-plan',
    summary:
      'Essential annual health check and visual safety inspection for smaller or newly installed solar setups.',
    duration: '1.5 hours on-site service',
    recommendedFor: 'Newer solar installations (under 2 years old) needing annual warranty preservation checks.',
    conditions: 'Domestic solar PV only (up to 4 kWp). Standard ground/ladder visual access.',
    inclusions: [
      'Visual safety inspection of solar panels, clamping rails, and cable integrity',
      'DC isolator switch and consumer unit AC circuit breaker operational test',
      'Inverter status indicator review and active fault code check',
      'Generation meter readout verification against tariff expectations',
      'Energy Aftercare Bronze Service Record & Maintenance Certificate',
    ],
  },
];

// Home & Services order: Bronze → Platinum
export const plansAscending: Plan[] = [...plansLiveOrder].reverse();
