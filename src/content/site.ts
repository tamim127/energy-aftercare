// Global header/footer copy, copied from the live site (www.energyaftercare.co.uk).
// "Approved Installers" and "Manufacturer Support" are new items agreed with the client.

export interface NavItem {
  label: string;
  to: string;
  children?: { label: string; to: string }[];
}

export const nav: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  {
    label: 'Services',
    to: '/services',
    children: [
      { label: 'Book Online', to: '/book-online' },
      { label: 'Savings Calculator', to: '/calculator' },
    ],
  },
  {
    label: 'Installer Support',
    to: '/installer-support',
    children: [{ label: 'Approved Installers', to: '/approved-installers' }],
  },
  { label: 'Manufacturer Support', to: '/manufacturer-support' },
  { label: 'FAQ', to: '/faq' },
  {
    label: 'Legal',
    to: '/privacy-policy',
    children: [
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Cookie Policy', to: '/cookie-policy' },
      { label: 'Terms & Conditions', to: '/terms-conditions' },
    ],
  },
];

export const logInLabel = 'Log In';
export const chatLabel = 'Chat With Us';

export const contact = {
  email: 'admin@energyaftercare.co.uk',
  phone: '+44 7943 812137',
  phoneHref: 'tel:+447943812137',
};

export const socials = [
  { name: 'Facebook', href: 'http://www.facebook.com' },
  { name: 'Instagram', href: 'http://www.instagram.com' },
  { name: 'YouTube', href: 'http://www.youtube.com' },
  { name: 'X', href: 'http://www.x.com' },
  { name: 'LinkedIn', href: 'http://www.linkedin.com' },
  { name: 'TikTok', href: 'http://www.tiktok.com' },
] as const;

export const copyright = '© 2026 Energy Aftercare. All rights reserved.';
export const copyrightLink = 'Privacy Policy';
