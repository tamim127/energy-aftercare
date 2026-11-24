// Wix CMS Data Layer for Energy Aftercare
// Connects to live Wix Data Collections with automatic fallback to local content
// Real-time synchronization via React Query with background polling & window focus revalidation

import { useQuery } from '@tanstack/react-query';
import { wixFetch } from './sdk';
import { ensureTokens } from './members/auth';
import { approvedInstallers, type ApprovedInstaller } from '../content/approvedInstallers';
import { plansLiveOrder, type Plan, type Tier } from '../content/plans';
import { contact as defaultContact, socials as defaultSocials, copyright as defaultCopyright } from '../content/site';
import { faqData } from '../content/faqData';
import { homeContent } from '../content/home';
import { aboutContent } from '../content/about';
import { servicesContent } from '../content/services';
import { installerContent } from '../content/installer';
import { manufacturerContent } from '../content/newPages';

export interface CMSSiteSettings {
  companyName: string;
  phone: string;
  email: string;
  copyright: string;
  officeHours: string;
  phoneHref: string;
  socials: Array<{ name: string; href: string }>;
}

export interface CMSFAQItem {
  q: string;
  a: string[];
}

export interface CMSFAQCategory {
  heading: string;
  items: CMSFAQItem[];
}

interface WixDataItem<T = Record<string, any>> {
  id: string;
  dataCollectionId: string;
  data: T & {
    _id?: string;
    _createdDate?: any;
    _updatedDate?: any;
  };
}

interface WixQueryResponse<T = Record<string, any>> {
  dataItems?: WixDataItem<T>[];
  pagingMetadata?: {
    count?: number;
    hasNext?: boolean;
  };
}

/**
 * Generic query function for Wix Data v2 collections
 */
async function queryWixCollection<T = Record<string, any>>(
  collectionId: string,
  sortField?: string,
  sortDirection: 'ASC' | 'DESC' = 'ASC'
): Promise<T[]> {
  try {
    await ensureTokens();

    const queryBody: Record<string, any> = {
      dataCollectionId: collectionId,
      query: {
        paging: { limit: 100 },
      },
    };

    if (sortField) {
      queryBody.query.sort = [{ fieldName: sortField, order: sortDirection }];
    }

    const res = await wixFetch('/data/v2/items/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(queryBody),
    });

    if (!res.ok) {
      console.warn(`[Wix CMS] Failed to query ${collectionId}: HTTP ${res.status}`);
      return [];
    }

    const json = (await res.json()) as WixQueryResponse<T>;
    if (!json.dataItems || !Array.isArray(json.dataItems)) {
      return [];
    }

    return json.dataItems.map((item) => ({
      ...item.data,
      id: item.data._id || item.id,
    }));
  } catch (err) {
    console.warn(`[Wix CMS] Exception querying ${collectionId}, using fallback:`, err);
    return [];
  }
}

// ==========================================
// 1. APPROVED INSTALLERS
// ==========================================
export async function fetchApprovedInstallers(): Promise<ApprovedInstaller[]> {
  const items = await queryWixCollection<any>('ApprovedInstallers');
  if (!items || items.length === 0) {
    return approvedInstallers;
  }

  return items.map((raw, idx) => {
    // Parse arrays if stored as string or array
    const coveredPostcodes = Array.isArray(raw.coveredPostcodes)
      ? raw.coveredPostcodes
      : typeof raw.coveredPostcodes === 'string'
      ? raw.coveredPostcodes.split(',').map((s: string) => s.trim())
      : [];

    const coveredCounties = Array.isArray(raw.coveredCounties)
      ? raw.coveredCounties
      : typeof raw.coveredCounties === 'string'
      ? raw.coveredCounties.split(',').map((s: string) => s.trim())
      : [];

    const services = Array.isArray(raw.services)
      ? raw.services
      : typeof raw.services === 'string'
      ? raw.services.split(',').map((s: string) => s.trim())
      : ['Solar PV'];

    const accreditations = Array.isArray(raw.accreditations)
      ? raw.accreditations
      : typeof raw.accreditations === 'string'
      ? raw.accreditations.split(',').map((s: string) => s.trim())
      : ['MCS Certified'];

    return {
      id: raw.id || `inst-${idx + 1}`,
      name: raw.name || 'Renewable Installer',
      tagline: raw.tagline || '',
      shortDescription: raw.shortDescription || '',
      phone: raw.phone || '',
      email: raw.email || '',
      website: raw.website || '',
      baseLocation: raw.baseLocation || 'United Kingdom',
      county: raw.county || 'UK',
      lat: typeof raw.lat === 'number' ? raw.lat : Number(raw.lat) || 51.5074,
      lng: typeof raw.lng === 'number' ? raw.lng : Number(raw.lng) || -0.1278,
      coveredPostcodes,
      coveredCounties,
      services,
      accreditations,
      mcsNumber: raw.mcsNumber || 'MCS Verified',
      tradingYears: typeof raw.tradingYears === 'number' ? raw.tradingYears : Number(raw.tradingYears) || 5,
      rating: typeof raw.rating === 'number' ? raw.rating : Number(raw.rating) || 4.9,
      reviewCount: typeof raw.reviewCount === 'number' ? raw.reviewCount : Number(raw.reviewCount) || 50,
      status: (raw.status === 'paused' ? 'paused' : 'active') as 'active' | 'paused',
    };
  });
}

export function useApprovedInstallers() {
  return useQuery({
    queryKey: ['cms', 'approved-installers'],
    queryFn: fetchApprovedInstallers,
    initialData: approvedInstallers,
    staleTime: 30 * 1000,
    refetchInterval: 45 * 1000,
    refetchOnWindowFocus: true,
  });
}

// ==========================================
// 2. SUPPORT & MAINTENANCE PLANS
// ==========================================
export async function fetchSupportPlans(): Promise<Plan[]> {
  const items = await queryWixCollection<any>('SupportPlans');
  if (!items || items.length === 0) {
    return plansLiveOrder;
  }

  // Sort by order ascending
  const sorted = [...items].sort((a, b) => (Number(a.order) || 99) - (Number(b.order) || 99));

  return sorted.map((raw) => {
    const inclusions = Array.isArray(raw.inclusions)
      ? raw.inclusions
      : typeof raw.inclusions === 'string'
      ? raw.inclusions.split('\n').filter(Boolean)
      : [];

    return {
      tier: (raw.tier || 'gold') as Tier,
      name: raw.name || 'Support Plan',
      price: raw.price || '£299',
      slug: raw.slug || 'support-plan',
      summary: raw.summary || '',
      duration: raw.duration || '2-3 hours on-site service',
      recommendedFor: raw.recommendedFor || '',
      conditions: raw.conditions || '',
      inclusions,
    };
  });
}

export function useSupportPlans() {
  return useQuery({
    queryKey: ['cms', 'support-plans'],
    queryFn: fetchSupportPlans,
    initialData: plansLiveOrder,
    staleTime: 30 * 1000,
    refetchInterval: 45 * 1000,
    refetchOnWindowFocus: true,
  });
}

// ==========================================
// 3. SITE SETTINGS & CONTACT INFO
// ==========================================
export async function fetchSiteSettings(): Promise<CMSSiteSettings> {
  const items = await queryWixCollection<any>('SiteSettings');
  const raw = items && items.length > 0 ? items[0] : null;

  if (!raw) {
    return {
      companyName: 'Energy Aftercare',
      phone: defaultContact.phone,
      email: defaultContact.email,
      copyright: defaultCopyright,
      officeHours: 'Mon – Fri: 08:30 – 17:30',
      phoneHref: defaultContact.phoneHref,
      socials: [...defaultSocials],
    };
  }

  const phone = raw.phone || defaultContact.phone;
  const cleanPhone = phone.replace(/\s+/g, '');
  const phoneHref = cleanPhone.startsWith('tel:') ? cleanPhone : `tel:${cleanPhone}`;

  const socials = [
    { name: 'Facebook', href: raw.facebookUrl || 'https://www.facebook.com' },
    { name: 'Instagram', href: raw.instagramUrl || 'https://www.instagram.com' },
    { name: 'YouTube', href: raw.youtubeUrl || 'https://www.youtube.com' },
    { name: 'X', href: raw.xUrl || 'https://www.x.com' },
    { name: 'LinkedIn', href: raw.linkedinUrl || 'https://www.linkedin.com' },
  ].filter((s) => Boolean(s.href));

  return {
    companyName: raw.companyName || 'Energy Aftercare',
    phone,
    email: raw.email || defaultContact.email,
    copyright: raw.copyright || defaultCopyright,
    officeHours: raw.officeHours || 'Mon – Fri: 08:30 – 17:30',
    phoneHref,
    socials,
  };
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ['cms', 'site-settings'],
    queryFn: fetchSiteSettings,
    initialData: {
      companyName: 'Energy Aftercare',
      phone: defaultContact.phone,
      email: defaultContact.email,
      copyright: defaultCopyright,
      officeHours: 'Mon – Fri: 08:30 – 17:30',
      phoneHref: defaultContact.phoneHref,
      socials: [...defaultSocials],
    },
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

// ==========================================
// 4. FREQUENTLY ASKED QUESTIONS (FAQS)
// ==========================================
export async function fetchFAQs(): Promise<CMSFAQCategory[]> {
  const items = await queryWixCollection<any>('FAQs');
  if (!items || items.length === 0) {
    return faqData.categories as CMSFAQCategory[];
  }

  // Group items by category
  const categoryMap = new Map<string, Array<{ q: string; a: string[]; order: number }>>();

  for (const item of items) {
    const cat = item.category?.trim() || 'GENERAL';
    if (!categoryMap.has(cat)) {
      categoryMap.set(cat, []);
    }
    const lines = Array.isArray(item.answer)
      ? item.answer
      : typeof item.answer === 'string'
      ? item.answer.split('\n\n').filter(Boolean)
      : [];

    categoryMap.get(cat)!.push({
      q: item.question || '',
      a: lines.length > 0 ? lines : [item.answer || ''],
      order: Number(item.order) || 99,
    });
  }

  const result: CMSFAQCategory[] = [];
  for (const [heading, list] of categoryMap.entries()) {
    list.sort((a, b) => a.order - b.order);
    result.push({
      heading,
      items: list.map((i) => ({ q: i.q, a: i.a })),
    });
  }

  // If result has entries, sort categories or append fallback categories if needed
  if (result.length > 0) {
    return result;
  }

  return faqData.categories as CMSFAQCategory[];
}

export function useFAQs() {
  return useQuery({
    queryKey: ['cms', 'faqs'],
    queryFn: fetchFAQs,
    initialData: faqData.categories as CMSFAQCategory[],
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

// ==========================================
// 5. HELPER: RESOLVE WIX IMAGE URLS
// ==========================================
export function resolveWixImageUrl(rawUrl?: string): string | undefined {
  if (!rawUrl) return undefined;
  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
    return rawUrl;
  }
  if (rawUrl.startsWith('wix:image://v1/')) {
    // format: wix:image://v1/<uri>/<filename>#originWidth=...
    const parts = rawUrl.replace('wix:image://v1/', '').split('/');
    const fileId = parts[0];
    if (fileId) {
      return `https://static.wixstatic.com/media/${fileId}`;
    }
  }
  return rawUrl;
}

// ==========================================
// 6. PAGE-WISE CONTENT & MEDIA (PageContent)
// ==========================================
export interface CMSPageContent {
  pageKey: string;
  pageName: string;
  heroHeading: string;
  heroSubheading: string;
  heroBody: string;
  heroImage?: string;
  secondaryImage?: string;
  heroPrimaryCta?: string;
  heroSecondaryCta?: string;
  section2Heading?: string;
  section2Subheading?: string;
  section2Body?: string;
  section3Heading?: string;
  section3Body?: string;
  ctaHeading?: string;
  ctaButtonText?: string;
  plansHeading?: string;
  plansNotice?: string;
  plansDescription?: string;
  calculatorPreviewBadge?: string;
  calculatorPreviewHeading?: string;
  calculatorPreviewBody?: string;
  calculatorPreviewButton?: string;
}

export const defaultPagesContent: Record<string, CMSPageContent> = {
  home: {
    pageKey: 'home',
    pageName: 'Home Page',
    heroHeading: homeContent.hero.h1,
    heroSubheading: homeContent.hero.eyebrow,
    heroBody: homeContent.hero.body,
    heroPrimaryCta: homeContent.hero.primaryCta,
    heroSecondaryCta: 'About Us',
    section2Heading: homeContent.services.heading,
    section2Subheading: homeContent.contact.strap,
    section2Body: 'Ensure your panels and batteries are performing at their peak with technical health checks, tariff tuning, and generation analysis.',
    section3Heading: homeContent.why.heading,
    section3Body: 'Human, independent, and technical guidance focused entirely on your energy efficiency, not hardware sales agendas.',
    ctaHeading: homeContent.journey.heading,
    ctaButtonText: homeContent.contact.heading,
    plansHeading: 'Support & Maintenance Plans',
    plansNotice: 'For Homeowners Only • Yearly Subscription',
    plansDescription: 'These annual support and maintenance plans are exclusively for residential homeowners and are billed yearly. All plan prices are £X + 20% VAT as a service.',
    calculatorPreviewBadge: 'Free Online Solar Tool',
    calculatorPreviewHeading: 'Have an installer quote or planning a solar system?',
    calculatorPreviewBody: 'Use our independent, hardware-agnostic calculator to check whether an installer quote is genuinely fair against UK regional benchmarks, verify equipment warranties, or estimate solar generation, battery payback and annual savings.',
    calculatorPreviewButton: 'Launch Quote Checker',
  },
  about: {
    pageKey: 'about',
    pageName: 'About Us Page',
    heroHeading: aboutContent.origin.h1,
    heroSubheading: aboutContent.origin.eyebrow,
    heroBody: aboutContent.origin.paragraphs.join('\n\n'),
    section2Heading: aboutContent.mission.heading,
    section2Subheading: aboutContent.mission.eyebrow,
    section2Body: aboutContent.mission.body,
    section3Heading: aboutContent.expertise.heading,
    section3Body: aboutContent.expertise.body,
    ctaHeading: aboutContent.cta.heading,
    ctaButtonText: aboutContent.cta.button,
  },
  services: {
    pageKey: 'services',
    pageName: 'Services Page',
    heroHeading: servicesContent.advice.heading,
    heroSubheading: servicesContent.advice.listHeading,
    heroBody: servicesContent.advice.body,
    heroPrimaryCta: servicesContent.advice.button,
    heroSecondaryCta: servicesContent.bookOnlineButton,
    section2Heading: servicesContent.sections[0]?.heading || 'Homeowner Support',
    section2Subheading: 'Specialist Areas & Impartial Analysis',
    section2Body: servicesContent.sections[0]?.body || '',
    section3Heading: servicesContent.sections[2]?.heading || 'Diagnostic Excellence',
    section3Body: servicesContent.sections[2]?.body || '',
    ctaHeading: servicesContent.sections[4]?.heading || 'The Specialist Difference',
    ctaButtonText: 'Book Online',
    plansHeading: 'Support & Maintenance Plans',
    plansNotice: 'For Homeowners Only • Yearly Subscription',
    plansDescription: 'These support and maintenance plans are exclusively for residential homeowners and are billed yearly. All plan fees are subject to 20% VAT as a service (£X +vat).',
  },
  'installer-support': {
    pageKey: 'installer-support',
    pageName: 'Installer Support Page',
    heroHeading: installerContent.hero.h1,
    heroSubheading: 'Premier Installer Support',
    heroBody: installerContent.hero.body,
    heroPrimaryCta: installerContent.whiteLabel.button,
    heroSecondaryCta: installerContent.remote.button,
    section2Heading: installerContent.remote.heading,
    section2Subheading: 'Rapid Remote Diagnostics',
    section2Body: installerContent.remote.body,
    section3Heading: installerContent.form.heading,
    section3Body: installerContent.form.body,
    ctaHeading: installerContent.form.heading,
    ctaButtonText: installerContent.form.submit,
  },
  'manufacturer-support': {
    pageKey: 'manufacturer-support',
    pageName: 'Manufacturer Support Page',
    heroHeading: manufacturerContent.heading,
    heroSubheading: 'Hardware-Agnostic & Independent',
    heroBody: manufacturerContent.intro,
    ctaHeading: manufacturerContent.ctaText,
    ctaButtonText: manufacturerContent.ctaButton,
  },
};

export async function fetchPagesContent(): Promise<Record<string, CMSPageContent>> {
  const items = await queryWixCollection<any>('PageContent');
  if (!items || items.length === 0) {
    return defaultPagesContent;
  }

  const result: Record<string, CMSPageContent> = { ...defaultPagesContent };

  for (const raw of items) {
    const key = raw.pageKey?.toLowerCase()?.trim();
    if (!key) continue;

    const base: CMSPageContent = defaultPagesContent[key] || {
      pageKey: key,
      pageName: raw.pageName || `${key} Page`,
      heroHeading: '',
      heroSubheading: '',
      heroBody: '',
      heroPrimaryCta: '',
      heroSecondaryCta: '',
      section2Heading: '',
      section2Subheading: '',
      section2Body: '',
      section3Heading: '',
      section3Body: '',
      ctaHeading: '',
      ctaButtonText: '',
    };

    result[key] = {
      pageKey: key,
      pageName: raw.pageName || base.pageName,
      heroHeading: raw.heroHeading || base.heroHeading,
      heroSubheading: raw.heroSubheading || base.heroSubheading,
      heroBody: raw.heroBody || base.heroBody,
      heroImage: resolveWixImageUrl(raw.heroImage),
      secondaryImage: resolveWixImageUrl(raw.secondaryImage),
      heroPrimaryCta: raw.heroPrimaryCta || base.heroPrimaryCta,
      heroSecondaryCta: raw.heroSecondaryCta || base.heroSecondaryCta,
      section2Heading: raw.section2Heading || base.section2Heading,
      section2Subheading: raw.section2Subheading || base.section2Subheading,
      section2Body: raw.section2Body || base.section2Body,
      section3Heading: raw.section3Heading || base.section3Heading,
      section3Body: raw.section3Body || base.section3Body,
      ctaHeading: raw.ctaHeading || base.ctaHeading,
      ctaButtonText: raw.ctaButtonText || base.ctaButtonText,
      plansHeading: raw.plansHeading || base.plansHeading,
      plansNotice: raw.plansNotice || base.plansNotice,
      plansDescription: raw.plansDescription || base.plansDescription,
      calculatorPreviewBadge: raw.calculatorPreviewBadge || base.calculatorPreviewBadge,
      calculatorPreviewHeading: raw.calculatorPreviewHeading || base.calculatorPreviewHeading,
      calculatorPreviewBody: raw.calculatorPreviewBody || base.calculatorPreviewBody,
      calculatorPreviewButton: raw.calculatorPreviewButton || base.calculatorPreviewButton,
    };
  }

  return result;
}

export function usePagesContent() {
  return useQuery({
    queryKey: ['cms', 'pages-content'],
    queryFn: fetchPagesContent,
    initialData: defaultPagesContent,
    staleTime: 30 * 1000,
    refetchInterval: 45 * 1000,
    refetchOnWindowFocus: true,
  });
}

export function usePageContent(pageKey: string): CMSPageContent {
  const { data: pages = defaultPagesContent } = usePagesContent();
  return pages[pageKey] || defaultPagesContent[pageKey] || {
    pageKey,
    pageName: `${pageKey} Page`,
    heroHeading: '',
    heroSubheading: '',
    heroBody: '',
  };
}

// ==========================================
// 7. SERVICES & FEATURES LIST (ServicesList)
// ==========================================
export interface CMSServiceItem {
  id: string;
  title: string;
  body: string;
  iconName: string;
  page: string;
  order: number;
}

const defaultServicesList: CMSServiceItem[] = [
  { id: 'srv-1', title: 'Solar Optimisation', body: 'Ensure your panels are performing at their peak with technical health checks and generation analysis.', iconName: 'Sun', page: 'Home', order: 1 },
  { id: 'srv-2', title: 'Battery Management', body: 'Deep-dive setup of charge/discharge cycles to maximise your savings and protect battery longevity.', iconName: 'BatteryCharging', page: 'Home', order: 2 },
  { id: 'srv-3', title: 'EV Integration', body: 'Smart charging setup that talks to your solar and battery for true zero-carbon motoring at home.', iconName: 'PlugZap', page: 'Home', order: 3 },
  { id: 'srv-4', title: 'System Diagnostics', body: "Independent fault finding and manufacturer warranty support when things aren't working as they should.", iconName: 'Activity', page: 'Home', order: 4 },
  { id: 'srv-5', title: 'Technical Handover', body: "Bought a home with an existing system? We'll teach you how it works and how to manage it efficiently.", iconName: 'KeyRound', page: 'Home', order: 5 },
  { id: 'srv-6', title: 'Independent Advice', body: 'Unbiased guidance on hardware upgrades or system expansions without the sales agenda.', iconName: 'Compass', page: 'Home', order: 6 },
];

export async function fetchServicesList(): Promise<CMSServiceItem[]> {
  const items = await queryWixCollection<any>('ServicesList');
  if (!items || items.length === 0) {
    return defaultServicesList;
  }

  const sorted = [...items].sort((a, b) => (Number(a.order) || 99) - (Number(b.order) || 99));

  return sorted.map((raw, idx) => ({
    id: raw.id || `srv-${idx + 1}`,
    title: raw.title || 'Renewable Service',
    body: raw.body || '',
    iconName: raw.iconName || 'Sun',
    page: raw.page || 'Home',
    order: Number(raw.order) || idx + 1,
  }));
}

export function useServicesList(pageFilter?: string) {
  const query = useQuery({
    queryKey: ['cms', 'services-list'],
    queryFn: fetchServicesList,
    initialData: defaultServicesList,
    staleTime: 30 * 1000,
    refetchInterval: 45 * 1000,
    refetchOnWindowFocus: true,
  });

  const filtered = pageFilter
    ? (query.data || []).filter((s) => s.page.toLowerCase() === pageFilter.toLowerCase())
    : query.data || [];

  return { ...query, data: filtered.length > 0 ? filtered : defaultServicesList };
}
