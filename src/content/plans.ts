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
  isVirtualOnly?: boolean;
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
      '6 cases, priority support, annual system review and discounted site visits. Highest level of homeowner support.',
    duration: 'Up to 4 hours comprehensive on-site service',
    recommendedFor:
      'High-capacity setups, multi-battery configurations, or properties requiring annual executive system review.',
    conditions:
      'Covers domestic or commercial arrays up to 25 kWp and battery storage up to 25 kWh. In-person engineer dispatch.',
    isVirtualOnly: false,
    inclusions: [
      '6 technical support cases',
      'Comprehensive annual on-site system review by Senior Specialist',
      'Priority technical support with rapid dispatch',
      'Discounted site visits where an on-site assessment is required',
      'Review of system performance and operational parameters',
      'Support with apps, monitoring and advanced configuration',
      'Direct installer and equipment manufacturer escalation',
      'Assistance with more complex technical issues and warranty claims',
    ],
  },
  {
    tier: 'gold',
    name: 'Gold Support Plan',
    price: '£299',
    slug: 'gold-support-plan',
    summary:
      '4 cases, priority support, performance and battery optimisation reviews; in-person support available.',
    duration: '2.5 to 3 hours comprehensive service (In-person on-site or virtual)',
    recommendedFor:
      'Homeowners wanting comprehensive support, battery optimisation, and available in-person engineer visits.',
    conditions:
      'Covers domestic systems up to 10 kWp and battery storage up to 15 kWh. In-person visit or remote session.',
    isVirtualOnly: false,
    inclusions: [
      '4 technical support cases',
      'In-person on-site visit available',
      'System performance review & yield analysis',
      'Battery optimisation review and charge/discharge cycle tuning',
      'Priority technical support with direct specialist contact',
      'Independent technical advice and guidance',
      'Support with apps, monitoring and system configuration',
      'Installer and manufacturer liaison where required',
      'Assistance troubleshooting more complex system issues',
    ],
  },
  {
    tier: 'silver',
    name: 'Silver Support Plan',
    price: '£149',
    slug: 'silver-support-plan',
    summary:
      '2 cases, 2 virtual visits, including remote health check. Enhanced monitoring for standard residential setups.',
    duration: 'Virtual consultation sessions (Remote video/call & health check)',
    recommendedFor:
      'Standard residential solar and storage configurations requiring remote health check and telemetry analysis.',
    conditions:
      'Virtual / remote support sessions. Online joining details and telemetry instructions provided.',
    isVirtualOnly: true,
    inclusions: [
      '2 technical support cases',
      '2 virtual visits (online diagnostic sessions)',
      'Comprehensive remote system health check',
      'Standard technical support & telemetry analysis',
      'Help with apps, monitoring and system configuration',
      'Independent advice and guidance',
      'Review of system operation and performance trends',
      'Assistance identifying potential issues or areas requiring attention',
    ],
  },
  {
    tier: 'bronze',
    name: 'Bronze Support Plan',
    price: '£79',
    slug: 'bronze-support-plan',
    summary:
      '1 case, 1 virtual visit (apps, monitoring, operation). Straightforward technical guidance throughout the year.',
    duration: 'Virtual consultation session (Remote video/call)',
    recommendedFor:
      'Homeowners needing remote support with apps, monitoring dashboards, or general system guidance.',
    conditions:
      'Virtual / remote support session. Joining link and instructions provided upon confirmation.',
    isVirtualOnly: true,
    inclusions: [
      '1 technical support case',
      '1 virtual visit (apps, monitoring, and operation support)',
      'Standard technical support and telemetry review',
      'Help with inverter and battery apps, cloud portals & settings',
      'Independent advice and guidance from UK specialists',
      'Support understanding system performance and daily operation',
      'Assistance identifying potential issues before they become larger problems',
    ],
  },
];

// Home & Services order: Bronze → Platinum
export const plansAscending: Plan[] = [...plansLiveOrder].reverse();
