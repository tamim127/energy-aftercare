import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Linkedin, Mail, Phone, Music2 } from 'lucide-react';
import { nav, contact, socials, copyright, copyrightLink } from '../content/site';
import { homeContent } from '../content/home';
import Logo from './Logo';

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
    <path d="M18.9 2H22l-7.6 8.7L23 22h-6.8l-5.3-6.9L4.8 22H1.7l8.1-9.3L1 2h7l4.8 6.3L18.9 2Zm-1.2 18h1.7L7.4 3.9H5.6L17.7 20Z" />
  </svg>
);
const icons: Record<string, React.ReactNode> = {
  Facebook: <Facebook className="h-4 w-4" />,
  Instagram: <Instagram className="h-4 w-4" />,
  YouTube: <Youtube className="h-4 w-4" />,
  X: <XIcon />,
  LinkedIn: <Linkedin className="h-4 w-4" />,
  TikTok: <Music2 className="h-4 w-4" />,
};

const isAllowedRoute = (to: string) => to === '/' || to === '/about';

export default function Footer() {
  const links = nav.flatMap((n) => (n.label === 'Legal' ? n.children! : [{ label: n.label, to: n.to }, ...(n.children ?? [])]));
  return (
    <footer className="border-t border-ea-grey/15 bg-ea-black text-ea-white">
      <div className="ea-container grid gap-12 py-16 md:grid-cols-[1.2fr_2fr]">
        <div>
          <Logo />
          <p className="mt-6 max-w-xs text-xs font-semibold tracking-[0.14em] text-ea-grey">{homeContent.contact.strap}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {socials.map((s) => (
              <a key={s.name} href={s.href} target="_blank" rel="noreferrer" aria-label={s.name} className="flex h-10 w-10 items-center justify-center rounded-full border border-ea-grey/40 text-ea-grey transition-colors hover:border-ea-green hover:text-ea-green">
                {icons[s.name]}
              </a>
            ))}
          </div>
        </div>
        <div className="grid gap-10 sm:grid-cols-2">
          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {links.map((l) => (
                <li key={l.label}>
                  {isAllowedRoute(l.to) ? (
                    <Link to={l.to} className="text-ea-grey hover:text-ea-green">{l.label}</Link>
                  ) : (
                    <span className="text-ea-grey/70 cursor-default select-none">{l.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-4 text-sm">
            <a href={`mailto:${contact.email}`} className="flex items-center gap-3 hover:text-ea-green"><Mail className="h-4 w-4 text-ea-green" />{contact.email}</a>
            <a href={contact.phoneHref} className="flex items-center gap-3 hover:text-ea-green"><Phone className="h-4 w-4 text-ea-green" />{contact.phone}</a>
          </div>
        </div>
      </div>
      <div className="border-t border-ea-grey/15">
        <p className="ea-container py-6 text-sm text-ea-grey">
          {copyright} • <span className="text-ea-grey/70 select-none">{copyrightLink}</span>
        </p>
      </div>
    </footer>
  );
}
