import { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  ShieldCheck,
  Star,
  Phone,
  Mail,
  Globe,
  ExternalLink,
  CheckCircle2,
  Wrench,
  Award,
  Calendar,
  Building2,
  Users,
  ChevronRight,
  Info,
  Map as MapIcon,
  List as ListIcon,
  X,
  ArrowRight,
  Sparkles,
  Zap,
  Check,
  Send,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@project/components/lib/utils';
import { btn, Reveal, usePageMeta } from '../components/ui';
import { approvedInstallers, type ApprovedInstaller } from '../content/approvedInstallers';
import { useApprovedInstallers } from '../wix/cms';
import { submitInquiry } from '../wix/submissions';

export default function ApprovedInstallers() {
  usePageMeta(
    'Find Approved Solar & Battery Installers | Energy Aftercare',
    'Search our selective network of vetted, MCS-certified solar and battery installers across the UK. Enter your postcode to find local installers who cover your area.'
  );

  const { data: installers = approvedInstallers } = useApprovedInstallers();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('All');
  const [selectedInstaller, setSelectedInstaller] = useState<ApprovedInstaller | null>(null);
  const [profileModal, setProfileModal] = useState<ApprovedInstaller | null>(null);
  const [mobileView, setMobileView] = useState<'split' | 'map' | 'list'>('split');
  const [mapLoaded, setMapLoaded] = useState(false);

  // Quote Request State inside Modal
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteRequested, setQuoteRequested] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientPostcode, setClientPostcode] = useState('');
  const [clientService, setClientService] = useState('Solar PV & Battery Storage');
  const [clientNotes, setClientNotes] = useState('');
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
  const [quoteError, setQuoteError] = useState('');

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileModal) return;
    setIsSubmittingQuote(true);
    setQuoteError('');
    try {
      const res = await submitInquiry({
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
        type: 'InstallerQuote',
        subject: `Quote Request for ${profileModal.name} (${clientPostcode || profileModal.baseLocation})`,
        message: `Selected Installer: ${profileModal.name} (MCS: ${profileModal.mcsNumber})\nService Needed: ${clientService}\nPostcode/Town: ${clientPostcode}\nNotes: ${clientNotes || 'Requesting free quote and survey.'}`,
        details: {
          installerId: profileModal.id,
          installerName: profileModal.name,
          mcs: profileModal.mcsNumber,
          baseLocation: profileModal.baseLocation,
          service: clientService,
          postcode: clientPostcode,
          notes: clientNotes,
        },
      });

      if (res.success) {
        setQuoteRequested(true);
      } else {
        setQuoteError(res.error || 'Failed to submit quote request. Please try again.');
      }
    } catch (err: any) {
      setQuoteError(err?.message || 'A network error occurred. Please try again.');
    } finally {
      setIsSubmittingQuote(false);
    }
  };

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Filter installers based on postcode/town and service
  const filteredInstallers = useMemo(() => {
    const q = searchQuery.trim().toUpperCase().replace(/\s+/g, '');
    const outcodeMatch = q.match(/^([A-Z]{1,2})\d?/);
    const outcodePrefix = outcodeMatch ? outcodeMatch[1] : '';

    return installers.filter((inst) => {
      // 0. Only published/approved installer profiles
      if (inst.status !== 'active') {
        return false;
      }

      // 1. Service filter
      if (selectedService !== 'All' && !inst.services.includes(selectedService)) {
        return false;
      }

      // 2. Search query filter
      if (!q) return true;

      // Match by exact or partial postcode coverage
      const matchesPostcode = inst.coveredPostcodes.some(
        (pc) => pc === q || pc === outcodePrefix || q.startsWith(pc)
      );

      // Match by county or base location
      const queryLower = searchQuery.toLowerCase();
      const matchesCounty = inst.coveredCounties.some((c) =>
        c.toLowerCase().includes(queryLower)
      );
      const matchesTown =
        inst.baseLocation.toLowerCase().includes(queryLower) ||
        inst.county.toLowerCase().includes(queryLower);
      const matchesName = inst.name.toLowerCase().includes(queryLower);

      return matchesPostcode || matchesCounty || matchesTown || matchesName;
    });
  }, [searchQuery, selectedService, installers]);

  // Dynamically load Leaflet with 100% free OpenStreetMap tiles (No Watermark)
  useEffect(() => {
    let isMounted = true;

    const loadLeaflet = async () => {
      if (typeof window === 'undefined') return;

      // Load Leaflet CSS
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Load Leaflet JS
      if (!(window as any).L) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.async = true;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        }).catch(() => {});
      }

      if (!isMounted || !mapContainerRef.current || !(window as any).L) return;

      const L = (window as any).L;

      // Initialize map if not already done
      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [53.8, -2.5],
          zoom: 6,
          zoomControl: false,
        });

        // 100% Free OpenStreetMap tile server with dark CSS filter applied via .leaflet-tile-pane
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          subdomains: ['a', 'b', 'c'],
          maxZoom: 18,
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        mapInstanceRef.current = map;
        setMapLoaded(true);
      }
    };

    loadLeaflet();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers on map
  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = (window as any).L;
    if (!map || !L) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((m: any) => m.remove());
    markersRef.current = {};

    filteredInstallers.forEach((inst) => {
      const isSelected = selectedInstaller?.id === inst.id;

      // Custom marker icon with Energy Aftercare Green accent & pulse
      const icon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="
            position: relative;
            width: ${isSelected ? '38px' : '30px'};
            height: ${isSelected ? '38px' : '30px'};
            background: ${isSelected ? '#00E575' : '#0B0B0B'};
            border: 2px solid ${isSelected ? '#FFFFFF' : '#00E575'};
            color: ${isSelected ? '#000000' : '#00E575'};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 13px;
            box-shadow: 0 0 ${isSelected ? '25px rgba(0,229,117,0.9)' : '10px rgba(0,229,117,0.35)'};
            cursor: pointer;
            transition: all 0.3s ease;
          ">
            ⚡
            ${
              isSelected
                ? '<div style="position:absolute; inset:-6px; border-radius:50%; border:2px solid #00E575; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; opacity:0.6;"></div>'
                : ''
            }
          </div>
        `,
        iconSize: [isSelected ? 38 : 30, isSelected ? 38 : 30],
        iconAnchor: [isSelected ? 19 : 15, isSelected ? 19 : 15],
      });

      const marker = L.marker([inst.lat, inst.lng], { icon })
        .addTo(map)
        .bindTooltip(`<b>${inst.name}</b><br/><span style="color:#00E575">MCS Certified</span>`, {
          direction: 'top',
          offset: [0, -18],
          className: 'custom-leaflet-tooltip',
        })
        .on('click', () => {
          setSelectedInstaller(inst);
          setProfileModal(inst);
          map.flyTo([inst.lat, inst.lng], 9, { duration: 1.2 });
          // Scroll card into view
          cardRefs.current[inst.id]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });

      markersRef.current[inst.id] = marker;
    });

    if (selectedInstaller) {
      map.flyTo([selectedInstaller.lat, selectedInstaller.lng], 9, { duration: 1.2 });
    } else if (filteredInstallers.length > 0) {
      const group = L.featureGroup(Object.values(markersRef.current));
      try {
        map.fitBounds(group.getBounds().pad(0.18));
      } catch {}
    }
  }, [filteredInstallers, selectedInstaller, mapLoaded]);

  // Handle installer card selection
  const handleSelectInstaller = (inst: ApprovedInstaller) => {
    setSelectedInstaller(inst);
    setProfileModal(inst);
    setQuoteRequested(false);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([inst.lat, inst.lng], 9, { duration: 1.2 });
    }
  };

  const allServices = ['All', 'Solar PV', 'Battery Storage', 'EV Charging', 'Heat Pumps'];

  return (
    <div className="bg-ea-black text-ea-white min-h-screen">
      {/* Hero Introduction Section */}
      <section className="relative border-b border-ea-grey/15 pb-12 pt-14 md:py-20 bg-gradient-to-b from-ea-black to-ea-ink">
        <div className="ea-container">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-ea-green/30 bg-ea-green/10 px-4 py-1.5 text-xs font-bold tracking-wider text-ea-green uppercase">
              <ShieldCheck className="h-4 w-4" /> Vetted Installer Directory
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-ea-white">
              Approved <span className="text-ea-green">Installer Network</span>
            </h1>
            <p className="mt-4 max-w-3xl text-base sm:text-lg text-ea-white/80 leading-relaxed">
              Find an Energy Aftercare approved installer in your area. Enter your postcode to see
              vetted local installers, check the areas they cover, and contact a company directly. Our
              installer network is carefully selected and limited by area.
            </p>

            {/* Quick Trust Highlights */}
            <div className="mt-8 flex flex-wrap gap-3 text-xs font-semibold text-ea-white/75">
              <span className="flex items-center gap-2 rounded-xl bg-ea-black/60 border border-ea-grey/25 px-3.5 py-2">
                <CheckCircle2 className="h-4 w-4 text-ea-green" /> 100% MCS Certified
              </span>
              <span className="flex items-center gap-2 rounded-xl bg-ea-black/60 border border-ea-grey/25 px-3.5 py-2">
                <CheckCircle2 className="h-4 w-4 text-ea-green" /> Minimum 3 Years Trading History
              </span>
              <span className="flex items-center gap-2 rounded-xl bg-ea-black/60 border border-ea-grey/25 px-3.5 py-2">
                <CheckCircle2 className="h-4 w-4 text-ea-green" /> 4+ Star Public Customer Rating
              </span>
              <span className="flex items-center gap-2 rounded-xl bg-ea-black/60 border border-ea-grey/25 px-3.5 py-2">
                <CheckCircle2 className="h-4 w-4 text-ea-green" /> Strictly Limited by County
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Main Interactive Directory Section */}
      <section className="py-10 md:py-16">
        <div className="ea-container space-y-6">
          {/* Search Bar & Filters */}
          <div className="rounded-3xl border border-ea-grey/25 bg-ea-ink p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ea-green" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter your UK postcode or town (e.g. BS1, SW1, Manchester, Bristol)..."
                  className="w-full rounded-2xl border border-ea-grey/30 bg-ea-black pl-12 pr-10 py-3.5 text-sm sm:text-base text-ea-white placeholder-ea-grey focus:border-ea-green focus:outline-none focus:ring-1 focus:ring-ea-green"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ea-grey hover:text-ea-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Mobile View Toggle */}
              <div className="flex sm:hidden rounded-2xl border border-ea-grey/30 bg-ea-black p-1">
                <button
                  type="button"
                  onClick={() => setMobileView('list')}
                  className={cn(
                    'flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors',
                    mobileView === 'list'
                      ? 'bg-ea-green text-ea-black'
                      : 'text-ea-grey hover:text-ea-white'
                  )}
                >
                  <ListIcon className="h-3.5 w-3.5" /> List
                </button>
                <button
                  type="button"
                  onClick={() => setMobileView('map')}
                  className={cn(
                    'flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors',
                    mobileView === 'map'
                      ? 'bg-ea-green text-ea-black'
                      : 'text-ea-grey hover:text-ea-white'
                  )}
                >
                  <MapIcon className="h-3.5 w-3.5" /> Map
                </button>
              </div>
            </div>

            {/* Service Filters & Result Count */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-ea-grey mr-1">
                  Service:
                </span>
                {allServices.map((service) => (
                  <button
                    key={service}
                    type="button"
                    onClick={() => setSelectedService(service)}
                    className={cn(
                      'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all border',
                      selectedService === service
                        ? 'border-ea-green bg-ea-green text-ea-black shadow-[0_0_15px_rgba(0,229,117,0.3)]'
                        : 'border-ea-grey/25 bg-ea-black/50 text-ea-grey hover:border-ea-grey/50 hover:text-ea-white'
                    )}
                  >
                    {service}
                  </button>
                ))}
              </div>

              <div className="text-xs text-ea-grey">
                Showing{' '}
                <strong className="text-ea-green">{filteredInstallers.length}</strong> approved{' '}
                {filteredInstallers.length === 1 ? 'installer' : 'installers'}
                {searchQuery && ` covering "${searchQuery}"`}
              </div>
            </div>
          </div>

          {/* Interactive Map & Results Split View */}
          <div className="grid gap-6 lg:grid-cols-12 items-start">
            {/* Left: Installers Results List (5 cols on desktop, NO-SCROLLBAR applied) */}
            <div
              className={cn(
                'space-y-4 lg:col-span-5',
                mobileView === 'map' ? 'hidden sm:block' : 'block'
              )}
            >
              {filteredInstallers.length === 0 ? (
                <div className="rounded-3xl border border-ea-grey/25 bg-ea-ink p-8 text-center space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ea-black text-ea-green mx-auto border border-ea-grey/20">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-ea-white">No direct match for this search</h3>
                  <p className="text-xs text-ea-grey max-w-sm mx-auto leading-relaxed">
                    We keep our network strictly limited to maintain quality. If there is no listing for
                    your exact postcode yet, contact us and we will recommend a vetted partner serving your
                    county.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedService('All');
                    }}
                    className={cn(btn.outlineDark, 'py-2 px-4 text-xs font-bold mt-2')}
                  >
                    View All Approved Installers
                  </button>
                </div>
              ) : (
                /* Ultra-smooth scrolling with zero ugly scrollbars */
                <div className="space-y-3 max-h-[680px] overflow-y-auto no-scrollbar scroll-smooth pr-0">
                  {filteredInstallers.map((inst) => {
                    const isSelected = selectedInstaller?.id === inst.id;
                    return (
                      <div
                        key={inst.id}
                        ref={(el) => (cardRefs.current[inst.id] = el)}
                        onClick={() => handleSelectInstaller(inst)}
                        className={cn(
                          'group rounded-3xl border p-5 cursor-pointer transition-all duration-300 text-left relative overflow-hidden',
                          isSelected
                            ? 'border-ea-green bg-gradient-to-r from-ea-ink to-ea-black shadow-[0_0_28px_rgba(0,229,117,0.22)] ring-1 ring-ea-green -translate-y-0.5'
                            : 'border-ea-grey/25 bg-ea-ink/75 hover:border-ea-green/50 hover:bg-ea-ink hover:-translate-y-0.5'
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-ea-green flex items-center gap-1.5">
                              <ShieldCheck className="h-3.5 w-3.5" /> MCS Certified • {inst.mcsNumber}
                            </span>
                            <h3 className="text-lg font-extrabold text-ea-white mt-1 group-hover:text-ea-green transition-colors">
                              {inst.name}
                            </h3>
                            <p className="text-xs text-ea-grey mt-0.5 flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-ea-green shrink-0" />
                              Based in {inst.baseLocation} • Covers {inst.coveredCounties.join(', ')}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 rounded-xl bg-ea-black border border-ea-grey/25 px-2.5 py-1 text-xs font-bold text-amber-300">
                            <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                            <span>{inst.rating}</span>
                          </div>
                        </div>

                        <p className="mt-3 text-xs text-ea-white/70 line-clamp-2 leading-relaxed">
                          {inst.shortDescription}
                        </p>

                        {/* Interactive service tags */}
                        <div className="mt-3.5 flex flex-wrap gap-1.5">
                          {inst.services.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedService(s);
                              }}
                              className={cn(
                                'rounded-lg border px-2.5 py-0.5 text-[10px] font-semibold transition-colors',
                                selectedService === s
                                  ? 'border-ea-green bg-ea-green text-ea-black'
                                  : 'border-ea-grey/20 bg-ea-black/60 text-ea-white/80 hover:border-ea-green/50 hover:text-ea-white'
                              )}
                            >
                              {s}
                            </button>
                          ))}
                        </div>

                        <div className="mt-4 pt-3 border-t border-ea-grey/15 flex items-center justify-between text-xs">
                          <span className="text-ea-grey text-[11px]">
                            <strong>{inst.tradingYears} yrs</strong> trading history
                          </span>
                          <span className="font-bold text-ea-green flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Full Profile & Contact <ChevronRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Interactive Map (7 cols on desktop) */}
            <div
              className={cn(
                'lg:col-span-7 sticky top-24',
                mobileView === 'list' ? 'hidden sm:block' : 'block'
              )}
            >
              <div className="rounded-3xl border border-ea-grey/25 bg-ea-ink p-2.5 shadow-2xl overflow-hidden relative">
                {/* Map Container */}
                <div
                  ref={mapContainerRef}
                  className="h-[420px] sm:h-[660px] w-full rounded-2xl bg-ea-black relative z-10"
                />

                {/* Selected Installer Quick Bar */}
                {selectedInstaller && (
                  <div className="absolute bottom-5 inset-x-5 z-20 rounded-2xl border border-ea-green/50 bg-ea-black/95 p-4 shadow-2xl backdrop-blur-md">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-ea-green flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Selected Approved Installer
                        </span>
                        <h4 className="text-base font-extrabold text-ea-white mt-0.5">
                          {selectedInstaller.name}
                        </h4>
                        <p className="text-xs text-ea-grey">
                          Base: {selectedInstaller.baseLocation} • Postcodes:{' '}
                          {selectedInstaller.coveredPostcodes.join(', ')}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedInstaller(null)}
                        className="p-1 text-ea-grey hover:text-ea-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileModal(selectedInstaller);
                          setShowQuoteForm(true);
                          setQuoteRequested(false);
                          setQuoteError('');
                        }}
                        className="rounded-xl bg-ea-green px-4 py-2 font-bold text-ea-black hover:bg-ea-green/90 transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,229,117,0.3)]"
                      >
                        <Send className="h-3.5 w-3.5" /> Request Free Quote
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setProfileModal(selectedInstaller);
                          setShowQuoteForm(false);
                        }}
                        className="rounded-xl border border-ea-grey/30 bg-ea-ink px-3.5 py-2 font-semibold text-ea-white hover:border-ea-green transition-colors flex items-center gap-1.5"
                      >
                        View Full Details <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                      <a
                        href={`tel:${selectedInstaller.phone}`}
                        className="rounded-xl border border-ea-grey/30 bg-ea-ink px-3.5 py-2 font-semibold text-ea-white hover:border-ea-green transition-colors flex items-center gap-1.5"
                      >
                        <Phone className="h-3.5 w-3.5 text-ea-green" /> {selectedInstaller.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programme Information & Vetting Criteria Section */}
      <section className="border-t border-ea-grey/15 bg-ea-ink py-16 md:py-24">
        <div className="ea-container space-y-12">
          {/* Section Header */}
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-ea-green">
              Trust & Verification Standards
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-ea-white">
              What Does Energy Aftercare "Approved" Status Mean?
            </h2>
            <p className="mt-4 text-base text-ea-white/75 leading-relaxed">
              Energy Aftercare is building a selective network of trusted installers so homeowners can find
              a suitable local company for solar, battery, and related electrical work. The programme is free
              to join for installers who are accepted, subject to our rigorous vetting process.
            </p>
            <p className="mt-3 text-base text-ea-white/75 leading-relaxed">
              We intentionally limit the number of approved installers in each county—generally to no more
              than a couple—so the directory remains selective, accountable, and high-performing.
            </p>
          </div>

          {/* 4 Vetting Criteria Pillars */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-ea-grey/25 bg-ea-black p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ea-green/10 border border-ea-green/30 text-ea-green">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-ea-white">1. MCS Certified</h3>
              <p className="text-xs text-ea-white/70 leading-relaxed">
                Mandatory certification for solar PV and battery storage. Ensures compliance with UK grid
                standards and guarantees homeowner eligibility for Smart Export Guarantee (SEG) payments.
              </p>
            </div>

            <div className="rounded-2xl border border-ea-grey/25 bg-ea-black p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ea-green/10 border border-ea-green/30 text-ea-green">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-ea-white">2. 3+ Years Trading</h3>
              <p className="text-xs text-ea-white/70 leading-relaxed">
                We require at least 3 years of continuous trading history with verifiable domestic
                installations, proving business stability and long-term commitment to clean energy.
              </p>
            </div>

            <div className="rounded-2xl border border-ea-grey/25 bg-ea-black p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ea-green/10 border border-ea-green/30 text-ea-green">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-ea-white">3. 4+ Star Rating</h3>
              <p className="text-xs text-ea-white/70 leading-relaxed">
                A verified public customer satisfaction rating of 4.0 stars or higher across Google,
                Trustpilot, or Which? Trusted Traders, backed by genuine client references.
              </p>
            </div>

            <div className="rounded-2xl border border-ea-grey/25 bg-ea-black p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ea-green/10 border border-ea-green/30 text-ea-green">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-ea-white">4. Financial & Safety Checks</h3>
              <p className="text-xs text-ea-white/70 leading-relaxed">
                Thorough business solvency checks, insurance-backed guarantee reviews, and a formal technical
                discussion with Energy Aftercare engineering directors prior to approval.
              </p>
            </div>
          </div>

          {/* Ongoing Review & Recertification Note */}
          <div className="rounded-2xl border border-ea-grey/20 bg-ea-black/50 p-5 flex items-start gap-3 text-xs text-ea-grey">
            <Info className="h-4 w-4 text-ea-green shrink-0 mt-0.5" />
            <span>
              Approval is strictly subject to maintaining our quality standards. Energy Aftercare conducts
              periodic reviews and reserves the right to remove any installer who fails to adhere to agreed
              consumer codes, technical safety, or workmanship guarantees.
            </span>
          </div>
        </div>
      </section>

      {/* For Installers Callout Banner */}
      <section className="bg-ea-green text-ea-black py-16">
        <div className="ea-container flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-black uppercase tracking-wider text-ea-black/80">
              For Installation Companies
            </span>
            <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-ea-black">
              Are you a quality renewable installer serving your county?
            </h3>
            <p className="mt-2 text-sm text-ea-black/85 leading-relaxed">
              Applications to the Energy Aftercare Approved Directory are free. Approved installers gain an
              exclusive county directory profile, direct homeowner referrals, and the option to discuss our
              dedicated technical aftercare and customer handover support.
            </p>
          </div>
          <Link
            to="/installer-support#installer-inquiry-form"
            className="rounded-full bg-ea-black px-8 py-3.5 text-sm font-bold text-ea-white hover:bg-ea-black/90 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            Apply to Join Network <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Full Installer Profile Modal */}
      {profileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ea-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-ea-green/40 bg-ea-ink p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
            <button
              type="button"
              onClick={() => setProfileModal(null)}
              className="absolute right-5 top-5 p-2 rounded-full bg-ea-black border border-ea-grey/25 text-ea-grey hover:text-ea-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Profile Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-ea-green/15 text-ea-green border border-ea-green/30 px-3 py-1 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" /> Energy Aftercare Approved
                </span>
                <span className="rounded-full bg-ea-black border border-ea-grey/25 px-3 py-1 text-xs font-semibold text-ea-white">
                  MCS: {profileModal.mcsNumber}
                </span>
                <span className="rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 px-3 py-1 text-xs font-bold flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-300" /> {profileModal.rating} ({profileModal.reviewCount} reviews)
                </span>
              </div>

              <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-ea-white">
                {profileModal.name}
              </h2>
              <p className="mt-1 text-sm text-ea-green font-semibold">{profileModal.tagline}</p>
              <p className="mt-1 text-xs text-ea-grey flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-ea-green" /> Headquartered in {profileModal.baseLocation} ({profileModal.county}) • {profileModal.tradingYears} years continuous trading
              </p>
            </div>

            {/* About */}
            <div className="rounded-2xl border border-ea-grey/20 bg-ea-black/50 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ea-grey mb-1.5">
                Company Overview
              </h4>
              <p className="text-xs sm:text-sm text-ea-white/80 leading-relaxed">
                {profileModal.shortDescription}
              </p>
            </div>

            {/* Services & Coverage */}
            <div className="grid gap-4 sm:grid-cols-2 text-xs">
              <div className="rounded-2xl border border-ea-grey/20 bg-ea-black/50 p-4 space-y-2">
                <h4 className="font-bold text-ea-white uppercase tracking-wider text-[11px]">
                  Services Offered
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {profileModal.services.map((s) => (
                    <span
                      key={s}
                      className="rounded-lg bg-ea-green/10 border border-ea-green/30 text-ea-green px-2.5 py-1 font-semibold text-[11px]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-ea-grey/20 bg-ea-black/50 p-4 space-y-2">
                <h4 className="font-bold text-ea-white uppercase tracking-wider text-[11px]">
                  Areas & Postcodes Covered
                </h4>
                <p className="text-ea-white/80 text-[11px] leading-relaxed">
                  <strong>Counties:</strong> {profileModal.coveredCounties.join(', ')}
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {profileModal.coveredPostcodes.map((pc) => (
                    <span
                      key={pc}
                      className="rounded bg-ea-black border border-ea-grey/25 px-1.5 py-0.5 text-[10px] font-mono text-ea-grey"
                    >
                      {pc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Accreditations */}
            <div className="rounded-2xl border border-ea-grey/20 bg-ea-black/40 p-4">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-ea-grey mb-2">
                Industry Accreditations & Consumer Protection
              </h4>
              <div className="flex flex-wrap gap-2 text-xs">
                {profileModal.accreditations.map((acc) => (
                  <span
                    key={acc}
                    className="flex items-center gap-1.5 rounded-xl border border-ea-grey/30 bg-ea-black px-3 py-1 font-semibold text-ea-white"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-ea-green" />
                    {acc}
                  </span>
                ))}
              </div>
            </div>

            {/* Interactive Quote Request Form in Profile */}
            {showQuoteForm && (
              <div className="rounded-2xl border border-ea-green/50 bg-ea-black/80 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-ea-white flex items-center gap-1.5">
                      <Send className="h-4 w-4 text-ea-green" /> Request a Free Quote from {profileModal.name}
                    </h3>
                    <p className="text-xs text-ea-grey mt-0.5">
                      Your inquiry is protected by Energy Aftercare's quality and independent standards.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowQuoteForm(false)}
                    className="text-xs text-ea-grey hover:text-ea-white underline"
                  >
                    Hide Form
                  </button>
                </div>

                {quoteRequested ? (
                  <div className="rounded-xl border border-ea-green/50 bg-ea-green/10 p-6 text-center space-y-2">
                    <CheckCircle2 className="h-10 w-10 text-ea-green mx-auto" />
                    <h4 className="text-base font-bold text-ea-white">Quote Request Submitted!</h4>
                    <p className="text-xs text-ea-white/80 max-w-md mx-auto">
                      Thank you, {clientName}! Your specification has been forwarded to {profileModal.name} and logged in your Energy Aftercare account. An advisor will contact you within one business day.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setShowQuoteForm(false);
                        setQuoteRequested(false);
                      }}
                      className={cn(btn.outlineDark, 'py-2 px-5 text-xs font-bold mt-2')}
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleQuoteSubmit} className="space-y-3">
                    {quoteError && (
                      <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-200 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                        <span>{quoteError}</span>
                      </div>
                    )}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-[11px] font-semibold text-ea-grey">Your Full Name *</label>
                        <input
                          type="text"
                          required
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="e.g. David Williams"
                          className="mt-1 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-3.5 py-2 text-xs text-ea-white focus:border-ea-green focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-ea-grey">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="david@example.com"
                          className="mt-1 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-3.5 py-2 text-xs text-ea-white focus:border-ea-green focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-ea-grey">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder="07123 456789"
                          className="mt-1 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-3.5 py-2 text-xs text-ea-white focus:border-ea-green focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-ea-grey">Postcode / City</label>
                        <input
                          type="text"
                          value={clientPostcode}
                          onChange={(e) => setClientPostcode(e.target.value)}
                          placeholder="e.g. BS1 4DJ"
                          className="mt-1 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-3.5 py-2 text-xs text-ea-white focus:border-ea-green focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-ea-grey">Installation Service Needed</label>
                      <select
                        value={clientService}
                        onChange={(e) => setClientService(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-3.5 py-2 text-xs text-ea-white focus:border-ea-green focus:outline-none"
                      >
                        <option>Solar PV & Battery Storage</option>
                        <option>Solar PV Only</option>
                        <option>Battery Storage Retrofit</option>
                        <option>EV Charger Installation</option>
                        <option>Heat Pump / Clean Heating</option>
                        <option>Annual Maintenance & Inspection</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-ea-grey">Property / System Requirements</label>
                      <textarea
                        rows={2}
                        value={clientNotes}
                        onChange={(e) => setClientNotes(e.target.value)}
                        placeholder="Tell the installer about your property (e.g. roof orientation, current energy bills, timeline)..."
                        className="mt-1 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-3.5 py-2 text-xs text-ea-white focus:border-ea-green focus:outline-none resize-none"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowQuoteForm(false)}
                        className="rounded-xl border border-ea-grey/30 px-4 py-2 text-xs font-semibold text-ea-grey hover:text-ea-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingQuote}
                        className={cn(btn.primary, 'py-2 px-6 text-xs font-bold flex items-center gap-1.5 disabled:opacity-60')}
                      >
                        {isSubmittingQuote ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-ea-black" />
                            <span>Sending Quote Request...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-3.5 w-3.5" /> Submit Quote Request
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Direct Contact Actions */}
            <div className="pt-2 border-t border-ea-grey/15 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowQuoteForm(true);
                  setQuoteRequested(false);
                  setQuoteError('');
                }}
                className="flex-1 min-w-[150px] rounded-2xl bg-ea-green py-3 text-center text-xs font-bold text-ea-black hover:bg-ea-green/90 transition-colors flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(0,229,117,0.25)]"
              >
                <Send className="h-4 w-4" /> Request Free Quote
              </button>
              <a
                href={`tel:${profileModal.phone}`}
                className="rounded-2xl border border-ea-grey/30 bg-ea-black px-4 py-3 text-center text-xs font-bold text-ea-white hover:border-ea-green transition-colors flex items-center justify-center gap-1.5"
              >
                <Phone className="h-4 w-4 text-ea-green" /> Call {profileModal.phone}
              </a>
              <a
                href={`mailto:${profileModal.email}`}
                className="rounded-2xl border border-ea-grey/30 bg-ea-black px-4 py-3 text-center text-xs font-bold text-ea-white hover:border-ea-green transition-colors flex items-center justify-center gap-1.5"
              >
                <Mail className="h-4 w-4 text-ea-green" /> Email
              </a>
              <a
                href={profileModal.website}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-ea-grey/30 bg-ea-black px-3.5 py-3 text-center text-xs font-bold text-ea-white hover:border-ea-green transition-colors flex items-center justify-center gap-1.5"
              >
                <Globe className="h-4 w-4 text-ea-green" /> <ExternalLink className="h-3.5 w-3.5 opacity-60" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
