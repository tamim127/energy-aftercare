import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@project/components/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@project/components/ui/dropdown-menu';
import { nav, logInLabel, type NavItem } from '../content/site';
import Logo from './Logo';
import LoginModal from './LoginModal';
import { useMember } from '../hooks/useMember';

const linkCls = ({ isActive }: { isActive: boolean }) =>
  cn('rounded-full px-3 py-2 text-[14px] font-medium transition-colors hover:text-ea-green', isActive ? 'text-ea-green' : 'text-ea-white');

const isAllowedRoute = (to: string) => to === '/' || to === '/about';

function DesktopItem({ item }: { item: NavItem }) {
  const allowed = isAllowedRoute(item.to);
  if (!item.children) {
    if (allowed) {
      return (
        <NavLink to={item.to} end={item.to === '/'} className={linkCls}>
          {item.label}
        </NavLink>
      );
    }
    return (
      <span className="rounded-full px-3 py-2 text-[14px] font-medium text-ea-white/80 cursor-default select-none">
        {item.label}
      </span>
    );
  }

  return (
    <div className="flex items-center">
      {allowed ? (
        <NavLink to={item.to} className={linkCls}>
          {item.label}
        </NavLink>
      ) : (
        <span className="rounded-full px-3 py-2 text-[14px] font-medium text-ea-white/80 cursor-default select-none">
          {item.label}
        </span>
      )}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          aria-label={`More ${item.label} pages`}
          className="flex items-center gap-1 rounded-full py-2 pr-2 text-[14px] font-medium text-ea-white/80 hover:text-ea-green focus-visible:outline-none"
        >
          <ChevronDown className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[200px] rounded-xl border-ea-grey/30 bg-ea-ink p-1.5 text-ea-white">
          {item.children.map((c) => (
            <DropdownMenuItem key={c.to} className="rounded-lg px-3 py-2.5">
              {isAllowedRoute(c.to) ? (
                <Link to={c.to} className="w-full cursor-pointer focus:bg-ea-ink2 focus:text-ea-green">
                  {c.label}
                </Link>
              ) : (
                <span className="w-full cursor-default text-ea-grey/70 select-none">
                  {c.label}
                </span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function MobileGroup({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const allowed = isAllowedRoute(item.to);

  if (!item.children) {
    if (allowed) {
      return (
        <NavLink
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) => cn('block py-4 text-2xl font-bold', isActive ? 'text-ea-green' : 'text-ea-white')}
        >
          {item.label}
        </NavLink>
      );
    }
    return (
      <span className="block py-4 text-2xl font-bold text-ea-white/80 cursor-default select-none">
        {item.label}
      </span>
    );
  }

  const links = item.children;
  return (
    <div className="border-b border-ea-grey/15">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-2xl font-bold text-ea-white/80 cursor-pointer"
      >
        <span>{item.label}</span>
        <ChevronDown className={cn('h-6 w-6 transition-transform', open && 'rotate-180 text-ea-green')} />
      </button>
      {open && (
        <div className="space-y-1 pb-4 pl-4">
          {links.map((c) =>
            isAllowedRoute(c.to) ? (
              <Link key={c.to + c.label} to={c.to} className="block py-2.5 text-lg text-ea-grey hover:text-ea-green">
                {c.label}
              </Link>
            ) : (
              <span key={c.to + c.label} className="block py-2.5 text-lg text-ea-grey/60 cursor-default select-none">
                {c.label}
              </span>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [mobile, setMobile] = useState(false);
  const [login, setLogin] = useState(false);
  const { member, loggedIn, logout } = useMember();
  const location = useLocation();

  useEffect(() => setMobile(false), [location.pathname, location.hash]);
  useEffect(() => {
    document.body.style.overflow = mobile ? 'hidden' : '';
  }, [mobile]);

  const initials = member?.firstName?.[0] || member?.displayName?.[0] || 'U';

  return (
    <header className="sticky top-0 z-50 border-b border-ea-grey/15 bg-ea-black/95 backdrop-blur">
      <div className="h-[3px] bg-ea-green" />
      <div className="ea-container flex h-[82px] items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Main" className="hidden items-center xl:flex">
          {nav.map((i) => <DesktopItem key={i.label} item={i} />)}
        </nav>
        <div className="flex items-center gap-2">
          {loggedIn ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger className="hidden items-center gap-2 rounded-full border border-ea-green/40 bg-ea-ink2 px-3 py-1.5 text-sm font-semibold text-ea-white transition-all hover:border-ea-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ea-green sm:inline-flex">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ea-green text-xs font-bold text-ea-black uppercase">
                  {initials}
                </div>
                <span className="max-w-[120px] truncate text-xs font-semibold">{member?.displayName || 'Member'}</span>
                <ChevronDown className="h-3.5 w-3.5 text-ea-grey" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[220px] rounded-xl border border-ea-grey/30 bg-ea-ink p-2 text-ea-white shadow-xl">
                <div className="border-b border-ea-grey/15 px-3 py-2">
                  <p className="text-sm font-bold text-ea-white">{member?.displayName || 'Member'}</p>
                  {member?.loginEmail && <p className="truncate text-xs text-ea-grey">{member.loginEmail}</p>}
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
              className="hidden items-center gap-2 rounded-full border border-ea-grey/50 px-4 py-2 text-sm font-semibold text-ea-white hover:border-ea-green hover:text-ea-green sm:inline-flex transition-colors"
            >
              <LogIn className="h-4 w-4" /> {logInLabel}
            </button>
          )}

          <button onClick={() => setMobile(true)} aria-label="Open menu" className="flex h-12 w-12 items-center justify-center rounded-full text-ea-white hover:text-ea-green xl:hidden">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {mobile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] overflow-y-auto bg-ea-black" role="dialog" aria-modal="true" aria-label="Menu">
            <div className="h-[3px] bg-ea-green" />
            <div className="ea-container flex h-[72px] items-center justify-between">
              <Logo />
              <button onClick={() => setMobile(false)} aria-label="Close menu" className="flex h-12 w-12 items-center justify-center text-ea-white hover:text-ea-green">
                <X className="h-7 w-7" />
              </button>
            </div>
            <nav aria-label="Mobile" className="ea-container pb-10 pt-4">
              {nav.map((i) => <MobileGroup key={i.label} item={i} />)}

              {loggedIn ? (
                <div className="mt-8 space-y-3 rounded-2xl border border-ea-grey/20 bg-ea-ink2 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ea-green text-sm font-bold text-ea-black uppercase">
                      {initials}
                    </div>
                    <div>
                      <p className="font-bold text-ea-white">{member?.displayName || 'Member'}</p>
                      <p className="text-xs text-ea-grey">{member?.loginEmail}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setMobile(false); logout(); }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Log Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setMobile(false); setLogin(true); }}
                  className="mt-8 flex w-full min-h-[56px] items-center justify-center gap-2 rounded-full bg-ea-green text-lg font-bold text-ea-black hover:bg-ea-green/90 transition-colors"
                >
                  <LogIn className="h-5 w-5" /> {logInLabel}
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      <LoginModal open={login} onOpenChange={setLogin} />
    </header>
  );
}
