// Plan names and prices copied from the live Book Online page.
export type Tier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Plan {
  tier: Tier;
  name: string;
  price: string;
  slug: string;
}

export const bookNowLabel = 'Book Now';
export const viewAllPlansLabel = 'View all plans';
export const supportPlansHeading = 'Support Plans';

// Live Book Online order: Platinum, Gold, Silver, Bronze
export const plansLiveOrder: Plan[] = [
  { tier: 'platinum', name: 'Platinum Support Plan', price: '£449', slug: 'platinum-support-plan' },
  { tier: 'gold', name: 'Gold Support Plan', price: '£299', slug: 'gold-support-plan' },
  { tier: 'silver', name: 'Silver Support Plan', price: '£149', slug: 'silver-support-plan' },
  { tier: 'bronze', name: 'Bronze Support Plan', price: '£79', slug: 'bronze-support-plan' },
];

// Home & Services order: Bronze → Platinum
export const plansAscending: Plan[] = [...plansLiveOrder].reverse();
