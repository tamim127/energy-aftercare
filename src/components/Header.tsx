import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  LogIn,
  LogOut,
  User,
  Phone,
  Mail,
  ShieldCheck,
  Calculator,
  Calendar,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@project/components/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@project/components/ui/dropdown-menu';
import { nav, logInLabel, contact, type NavItem } from '../content/site';
import Logo from './Logo';
import LoginModal from './LoginModal';
import { useMember } from '../hooks/useMember';

const linkCls = ({ isActive }: { isActive: boolean }) =>
  cn('rounded-full px-3 py-2 text-[14px] font-medium transition-colors hover:text-ea-green', isActive ? 'text-ea-green' : 'text-ea-white');

function DesktopItem({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 150);
  };

  if (!item.children) {
    return (
      <NavLink to={item.to} end={item.to === '/'} className={linkCls}>
        {item.label}
      </NavLink>
    );
  }

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
        <div className="flex items-center">
          <NavLink
            to={item.to}
            className={({ isActive }) =>
              cn(
                'rounded-full py-2 pl-3 pr-1 text-[14px] font-medium transition-colors flex items-center gap-1',
                isActive || open ? 'text-ea-green' : 'text-ea-white hover:text-ea-green'
              )
            }
          >
            <span>{item.label}</span>
          </NavLink>
          <DropdownMenuTrigger
            aria-label={`More ${item.label} pages`}
            className="flex items-center rounded-full py-2 pr-3 text-[14px] font-medium text-ea-white/80 hover:text-ea-green focus-visible:outline-none cursor-pointer"
          >
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 transition-transform duration-200',
                open && 'rotate-180 text-ea-green'
              )}
            />
          </DropdownMenuTrigger>
        </div>

        <DropdownMenuContent
          align="start"
          sideOffset={6}
          className="min-w-[220px] rounded-2xl border border-ea-grey/30 bg-ea-ink p-1.5 shadow-2xl backdrop-blur-xl z-50"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {item.children.map((c) => (
            <DropdownMenuItem
              key={c.to}
              asChild
              className="rounded-xl p-0 outline-none data-[highlighted]:bg-ea-green data-[highlighted]:text-ea-black cursor-pointer"
            >
              <Link
                to={c.to}
                onClick={() => setOpen(false)}
                className="group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-[14px] font-semibold text-ea-white transition-colors hover:bg-ea-green hover:text-ea-black focus:bg-ea-green focus:text-ea-black"
              >
                <span>{c.label}</span>
                <ChevronRight className="h-4 w-4 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" />
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function MobileGroup({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  if (!item.children) {
    const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
    return (
      <Link
        to={item.to}
        onClick={onClose}
        className={cn(
          'flex items-center justify-between py-3 px-3.5 rounded-2xl text-base font-bold transition-all border',
          isActive
            ? 'border-ea-green/40 bg-ea-green/10 text-ea-green'
            : 'border-transparent text-ea-white hover:border-ea-grey/25 hover:bg-ea-ink hover:text-ea-green'
        )}
      >
        <span>{item.label}</span>
        <ChevronRight className="h-4 w-4 opacity-40" />
      </Link>
    );
  }

  const isChildActive = item.children.some((c) => location.pathname === c.to);
  const isMainActive = location.pathname === item.to;

  return (
    <div className="rounded-2xl border border-ea-grey/15 bg-ea-ink/40 overflow-hidden transition-all">
      <div className="flex items-center justify-between p-1.5">
        <Link
          to={item.to}
          onClick={onClose}
          className={cn(
            'flex-1 py-2 px-3 text-base font-bold transition-colors rounded-xl',
            isMainActive || isChildActive ? 'text-ea-green' : 'text-ea-white hover:text-ea-green'
          )}
        >
          {item.label}
        </Link>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="p-2 text-ea-grey hover:text-ea-white rounded-xl hover:bg-ea-ink transition-colors cursor-pointer"
          aria-label={`Toggle ${item.label} submenu`}
        >
          <ChevronDown
            className={cn(
              'h-5 w-5 transition-transform duration-200',
              open ? 'rotate-180 text-ea-green' : 'text-ea-grey'
            )}
          />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-ea-grey/10 bg-ea-black/40 px-2.5 py-2 space-y-1"
          >
            {item.children.map((c) => {
              const active = location.pathname === c.to;
              return (
                <Link
                  key={c.to + c.label}
                  to={c.to}
                  onClick={onClose}
                  className={cn(
                    'flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors',
                    active
                      ? 'bg-ea-green text-ea-black font-bold'
                      : 'text-ea-white/85 hover:bg-ea-ink hover:text-ea-green'
                  )}
                >
                  <span>{c.label}</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Header() {
  const [mobile, setMobile] = useState(false);
  const [login, setLogin] = useState(false);
  const { member, loggedIn, logout } = useMember();
  const location = useLocation();

  useEffect(() => {
    setMobile(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobile(false);
    };
    if (mobile) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobile]);

  const initials = member?.firstName?.[0] || member?.displayName?.[0] || 'U';

  return (
    <header className="sticky top-0 z-50 border-b border-ea-grey/15 bg-ea-black/95 backdrop-blur">
      <div className="h-[3px] bg-ea-green" />
      <div className="ea-container flex h-[72px] sm:h-[82px] items-center justify-between gap-3">
        <Logo />

        <nav aria-label="Main" className="hidden items-center xl:flex">
          {nav.map((i) => (
            <DesktopItem key={i.label} item={i} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {loggedIn ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger className="hidden items-center gap-2 rounded-full border border-ea-green/40 bg-ea-ink2 px-3 py-1.5 text-sm font-semibold text-ea-white transition-all hover:border-ea-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ea-green sm:inline-flex cursor-pointer">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ea-green text-xs font-bold text-ea-black uppercase">
                  {initials}
                </div>
                <span className="max-w-[120px] truncate text-xs font-semibold">
                  {member?.displayName || 'Member'}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-ea-grey" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="min-w-[220px] rounded-xl border border-ea-grey/30 bg-ea-ink p-2 text-ea-white shadow-xl z-50"
              >
                <div className="border-b border-ea-grey/15 px-3 py-2">
                  <p className="text-sm font-bold text-ea-white">{member?.displayName || 'Member'}</p>
                  {member?.loginEmail && (
                    <p className="truncate text-xs text-ea-grey">{member.loginEmail}</p>
                  )}
                </div>
                <DropdownMenuItem
                  onClick={() => logout()}
                  className="mt-1 cursor-pointer rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 focus:bg-red-500/10 focus:text-red-300 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" /> Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              onClick={() => setLogin(true)}
              className="hidden items-center gap-2 rounded-full border border-ea-grey/50 px-4 py-2 text-sm font-semibold text-ea-white hover:border-ea-green hover:text-ea-green sm:inline-flex transition-colors cursor-pointer"
            >
              <LogIn className="h-4 w-4" /> {logInLabel}
            </button>
          )}

          {/* Quick CTA button on medium screens */}
          <Link
            to="/approved-installers"
            className="hidden md:inline-flex xl:hidden items-center gap-1.5 rounded-full bg-ea-green/10 border border-ea-green/30 px-3.5 py-1.5 text-xs font-bold text-ea-green hover:bg-ea-green hover:text-ea-black transition-colors"
          >
            <MapPin className="h-3.5 w-3.5" /> Find Installers
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobile(true)}
            aria-label="Open navigation menu"
            className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl border border-ea-grey/25 bg-ea-ink text-ea-white hover:text-ea-green hover:border-ea-green/60 transition-all cursor-pointer xl:hidden active:scale-95"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation (Portaled to body to escape header's backdrop-filter containing block) */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {mobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex justify-end"
                role="dialog"
                aria-modal="true"
                aria-label="Mobile Navigation"
                onClick={() => setMobile(false)}
              >
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                  className="relative w-full max-w-[420px] h-[100dvh] bg-ea-black border-l border-ea-grey/25 flex flex-col shadow-2xl overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Drawer Top Header */}
                  <div className="h-[3px] bg-ea-green shrink-0" />
                  <div className="flex h-[72px] items-center justify-between px-5 border-b border-ea-grey/15 shrink-0 bg-ea-ink">
                    <Logo />
                    <button
                      onClick={() => setMobile(false)}
                      aria-label="Close menu"
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-ea-grey/30 bg-ea-black text-ea-white hover:text-ea-green hover:border-ea-green transition-colors cursor-pointer"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Scrollable Navigation Area */}
                  <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5 no-scrollbar">
                    {/* 1. Top Quick Action Grid (3 Cards) */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-ea-grey/80 px-1">
                        Quick Access
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        <Link
                          to="/approved-installers"
                          onClick={() => setMobile(false)}
                          className="flex flex-col items-center justify-center p-3 rounded-2xl border border-ea-green/40 bg-ea-green/10 text-center hover:bg-ea-green hover:text-ea-black transition-all group"
                        >
                          <MapPin className="h-5 w-5 text-ea-green mb-1 group-hover:text-ea-black transition-colors" />
                          <span className="text-xs font-bold text-ea-white group-hover:text-ea-black leading-tight">
                            Installers
                          </span>
                          <span className="text-[10px] text-ea-green group-hover:text-ea-black font-semibold mt-0.5">
                            Map
                          </span>
                        </Link>

                        <Link
                          to="/calculator"
                          onClick={() => setMobile(false)}
                          className="flex flex-col items-center justify-center p-3 rounded-2xl border border-ea-grey/25 bg-ea-ink text-center hover:border-ea-green/50 transition-all group"
                        >
                          <Calculator className="h-5 w-5 text-ea-green mb-1 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold text-ea-white leading-tight">Calculator</span>
                          <span className="text-[10px] text-ea-grey mt-0.5">Savings</span>
                        </Link>

                        <Link
                          to="/book-online"
                          onClick={() => setMobile(false)}
                          className="flex flex-col items-center justify-center p-3 rounded-2xl border border-ea-grey/25 bg-ea-ink text-center hover:border-ea-green/50 transition-all group"
                        >
                          <Calendar className="h-5 w-5 text-ea-green mb-1 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold text-ea-white leading-tight">Book Visit</span>
                          <span className="text-[10px] text-ea-grey mt-0.5">Engineers</span>
                        </Link>
                      </div>
                    </div>

                    {/* 2. All Site Pages Navigation */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-ea-grey/80 px-1">
                        Menu &amp; Pages
                      </span>
                      <nav aria-label="Mobile Navigation Menu" className="space-y-1.5">
                        {nav.map((i) => (
                          <MobileGroup key={i.label} item={i} onClose={() => setMobile(false)} />
                        ))}
                      </nav>
                    </div>

                    {/* 3. Account / Member Portal */}
                    <div className="space-y-2 pt-2 border-t border-ea-grey/15">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-ea-grey/80 px-1">
                        Customer Portal
                      </span>
                      {loggedIn ? (
                        <div className="space-y-3 rounded-2xl border border-ea-grey/25 bg-ea-ink p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ea-green text-sm font-bold text-ea-black uppercase">
                              {initials}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-ea-white truncate">
                                {member?.displayName || 'Member'}
                              </p>
                              <p className="text-xs text-ea-grey truncate">{member?.loginEmail}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setMobile(false);
                              logout();
                            }}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                          >
                            <LogOut className="h-4 w-4" /> Log Out
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setMobile(false);
                            setLogin(true);
                          }}
                          className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-ea-green py-3 text-sm font-extrabold text-ea-black hover:bg-white transition-all shadow-lg shadow-ea-green/20 cursor-pointer"
                        >
                          <LogIn className="h-4 w-4" /> Log In / Register Account
                        </button>
                      )}
                    </div>

                    {/* 4. Direct Contact Information */}
                    <div className="rounded-2xl border border-ea-grey/20 bg-ea-ink/70 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-ea-grey">
                          Direct Support
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-ea-green">
                          <span className="h-2 w-2 rounded-full bg-ea-green animate-pulse" /> Mon–Fri 9am–5pm
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={contact.phoneHref}
                          className="flex items-center justify-center gap-2 rounded-xl border border-ea-grey/25 bg-ea-black/60 p-2.5 text-xs font-bold text-ea-white hover:text-ea-green hover:border-ea-green transition-colors"
                        >
                          <Phone className="h-3.5 w-3.5 text-ea-green shrink-0" />
                          <span className="truncate">07943 812137</span>
                        </a>
                        <a
                          href={`mailto:${contact.email}`}
                          className="flex items-center justify-center gap-2 rounded-xl border border-ea-grey/25 bg-ea-black/60 p-2.5 text-xs font-bold text-ea-white hover:text-ea-green hover:border-ea-green transition-colors"
                        >
                          <Mail className="h-3.5 w-3.5 text-ea-green shrink-0" />
                          <span className="truncate">Email Us</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

      <LoginModal open={login} onOpenChange={setLogin} />
    </header>
  );
}
