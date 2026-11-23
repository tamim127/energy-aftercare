import { useEffect } from 'react';
import { HashRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { Toaster } from '@project/components/ui/sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Calculator from './pages/Calculator';
import BookOnline from './pages/BookOnline';
import BookingCalendar from './pages/BookingCalendar';
import Login from './pages/Login';
import InstallerSupport from './pages/InstallerSupport';
import { ManufacturerSupport } from './pages/NewPages';
import ApprovedInstallers from './pages/ApprovedInstallers';
import FAQ from './pages/FAQ';
import { PrivacyPage, CookiePage, TermsPage } from './pages/Legal';
import NotFound from './pages/NotFound';

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const t = setTimeout(
        () => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        80
      );
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-ea-black">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ea-green focus:px-4 focus:py-2 focus:text-ea-black"
      >
        Skip to content
      </a>
      <ScrollManager />
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/book-online" element={<BookOnline />} />
          <Route path="/booking-calendar/:slug" element={<BookingCalendar />} />
          <Route path="/login" element={<Login />} />
          <Route path="/installer-support" element={<InstallerSupport />} />
          <Route path="/approved-installers" element={<ApprovedInstallers />} />
          <Route path="/manufacturer-support" element={<ManufacturerSupport />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blank-6" element={<FAQ />} />
          <Route path="/privacy-policy" element={<PrivacyPage />} />
          <Route path="/blank-3" element={<PrivacyPage />} />
          <Route path="/cookie-policy" element={<CookiePage />} />
          <Route path="/blank-1" element={<CookiePage />} />
          <Route path="/terms-conditions" element={<TermsPage />} />
          <Route path="/blank-2" element={<TermsPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
