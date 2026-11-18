import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, LogIn } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@project/components/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@project/components/ui/dropdown-menu';
import { nav, logInLabel, type NavItem } from '../content/site';
import Logo from './Logo';
import LoginModal from './LoginModal';

const linkCls = ({ isActive }: { isActive: boolean }) =>
  cn('rounded-full px-3 py-2 text-[14px] font-medium transition-colors hover:text-ea-green', isActive ? 'text-ea-green' : 'text-ea-white');

function DesktopItem({ item }: { item: NavItem }) {
  if (!item.children) return <NavLink to={item.to} end={item.to === '/'} className={linkCls}>{item.label}</NavLink>;
  const isLegal = item.label === 'Legal';
  return (
    <div className="flex items-center">
      {!isLegal && <NavLink to={item.to} className={linkCls}>{item.label}</NavLink>}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          aria-label={isLegal ? 'Legal' : `More ${item.label} pages`}
          className={cn('flex items-center gap-1 rounded-full py-2 text-[14px] font-medium text-ea-white hover:text-ea-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ea-green', isLegal ? 'px-3' : 'pr-2')}
        >
          {isLegal && item.label}
          <ChevronDown className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[200px] rounded-xl border-ea-grey/30 bg-ea-ink p-1.5 text-ea-white">
          {item.children.map((c) => (
            <DropdownMenuItem key={c.to} asChild className="cursor-pointer rounded-lg px-3 py-2.5 focus:bg-ea-ink2 focus:text-ea-green">
              <Link to={c.to}>{c.label}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function MobileGroup({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  if (!item.children)
    return <NavLink to={item.to} end={item.to === '/'} className={({ isActive }) => cn('block py-4 text-2xl font-bold', isActive ? 'text-ea-green' : 'text-ea-white')}>{item.label}</NavLink>;
  const links = item.label === 'Legal' ? item.children : [{ label: item.label, to: item.to }, ...item.children];
  return (
    <div className="border-b border-ea-grey/15">
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between py-4 text-2xl font-bold text-ea-white">
        {item.label}
        <ChevronDown className={cn('h-6 w-6 transition-transform', open && 'rotate-180 text-ea-green')} />
      </button>
      {open && (
        <div className="pb-4 pl-4">
          {links.map((c) => (
            <Link key={c.to + c.label} to={c.to} className="block py-3 text-lg text-ea-grey hover:text-ea-green">{c.label}</Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [mobile, setMobile] = useState(false);
  const [login, setLogin] = useState(false);
  const location = useLocation();
  useEffect(() => setMobile(false), [location.pathname, location.hash]);
  useEffect(() => {
    document.body.style.overflow = mobile ? 'hidden' : '';
  }, [mobile]);

  return (
    <header className="sticky top-0 z-50 border-b border-ea-grey/15 bg-ea-black/95 backdrop-blur">
      <div className="h-[3px] bg-ea-green" />
      <div className="ea-container flex h-[72px] items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Main" className="hidden items-center xl:flex">
          {nav.map((i) => <DesktopItem key={i.label} item={i} />)}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={() => setLogin(true)} className="hidden items-center gap-2 rounded-full border border-ea-grey/50 px-4 py-2 text-sm font-semibold text-ea-white hover:border-ea-green hover:text-ea-green sm:inline-flex">
            <LogIn className="h-4 w-4" /> {logInLabel}
          </button>
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
              <button onClick={() => { setMobile(false); setLogin(true); }} className="mt-8 flex w-full min-h-[56px] items-center justify-center gap-2 rounded-full bg-ea-green text-lg font-bold text-ea-black">
                <LogIn className="h-5 w-5" /> {logInLabel}
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      <LoginModal open={login} onOpenChange={setLogin} />
    </header>
  );
}
