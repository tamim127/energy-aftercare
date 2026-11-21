import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  Battery,
  Zap,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  FileText,
  Upload,
  ChevronRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Home,
  Sliders,
  DollarSign,
  Info,
  Check,
} from 'lucide-react';
import { cn } from '@project/components/lib/utils';
import { btn, Reveal, usePageMeta } from '../components/ui';

/* =========================================================================
   CONFIG & BENCHMARKS (from EAC UK Solar & Battery Model)
   ========================================================================= */
const CONFIG = {
  IMPORT_P: 26.32, // p/kWh, Ofgem price cap average
  EXPORT_P: 12.0, // p/kWh, flat export tariff (e.g. Outgoing Octopus)
  OFFPEAK_P: 8.0, // p/kWh, typical night rate on EV / Economy 7
  SOLAR_FIXED: [1500, 2000, 2500],
  SOLAR_PER_KW: [950, 1250, 1550],
  BATT_FIXED: [800, 1200, 1800],
  BATT_PER_KWH: [350, 450, 600],
  THREE_PHASE: [300, 500, 800],
  MICRO_PER_PANEL: [40, 60, 90],
  OFF_GRID: [2500, 4000, 7000],
  G99: [400, 800, 1500], // DNO application for inverters > 3.68 kW (single phase)
  STANDING_P: 54.83, // p/day standing charge
  EXTRAS: {
    xEv: [800, 1000, 1300],
    xBird: [300, 450, 700],
    xBackup: [400, 800, 1500],
    xOptPerPanel: [30, 45, 70],
  },
  WARRANTY_TYPICAL: {
    wPanel: [12, 25],
    wPerf: [25, 30],
    wInv: [10, 10],
    wBatt: [10, 10],
    wWork: [2, 10],
  },
  DEFAULT_PANEL_W: 440,
  LOADS: [
    { name: 'Electric car', kwh: 2500 },
    { name: 'Heat pump', kwh: 3500 },
    { name: 'Hot tub or pool heater', kwh: 2500 },
    { name: 'Electric heating / storage heaters', kwh: 4000 },
    { name: 'Air conditioning', kwh: 500 },
  ],
};

const AREAS: Record<string, [number, string, string]> = {
  sw: [1000, 'the South West', 'TR PL EX TQ TA DT BH'],
  s: [960, 'the South', 'BA BS SP SN GL SO PO BN GU RH TN CT ME RG OX HP SL'],
  ldn: [
    940,
    'London and the South East',
    'E EC N NW SE SW W WC KT CR BR DA SM TW IG RM EN HA UB WD AL SG LU MK CM SS',
  ],
  e: [930, 'the East of England', 'IP NR CB CO PE'],
  mid: [900, 'the Midlands', 'B CV WV WS DY ST TF WR HR DE NG LE NN LN'],
  wal: [890, 'Wales', 'CF NP SA LD SY LL'],
  n: [
    850,
    'the North of England',
    'M L WA WN BL OL SK CW CH PR BB FY LA CA S DN HU YO LS BD HX HD WF HG DL TS DH SR NE',
  ],
  ni: [820, 'Northern Ireland', 'BT'],
  sco: [790, 'Scotland', 'EH G KA ML PA FK KY DD PH AB IV KW HS ZE DG TD'],
};

function getRegion(postcode: string) {
  const m = (postcode || '').toUpperCase().replace(/\s+/g, '').match(/^([A-Z]{1,2})\d/);
  if (m) {
    for (const k in AREAS) {
      if (AREAS[k][2].split(' ').includes(m[1])) {
        return { yieldPerKw: AREAS[k][0], name: AREAS[k][1], known: true };
      }
    }
  }
  return { yieldPerKw: 900, name: 'an average UK location', known: false };
}

const gbp = (n: number) =>
  (n < 0 ? '−' : '') + '£' + Math.abs(Math.round(n)).toLocaleString('en-GB');
const kwhFormat = (n: number) => Math.round(n).toLocaleString('en-GB') + ' kWh';
const r100 = (n: number) => Math.round(n / 100) * 100;

const PANEL_BRANDS = [
  'Aiko',
  'JA Solar',
  'Jinko',
  'LONGi',
  'Trina',
  'Canadian Solar',
  'REC',
  'DMEGC',
  'Q CELLS',
  'Hanwha',
  'Hyundai',
  'Maxeon',
  'SunPower',
  'Eurener',
  'Perlight',
  'Tongwei',
  'Risen',
  'Astronergy',
  'Sharp',
  'Meyer Burger',
];

const BATT_BRANDS = [
  'SigEnergy',
  'GivEnergy',
  'Fox ESS',
  'SolarEdge',
  'Enphase',
  'Tesla',
  'Solis',
  'Sofar',
  'Growatt',
  'Huawei',
  'Lux Power',
  'Alpha ESS',
  'Puredrive',
  'Duracell',
  'myenergi',
  'libbi',
  'Sunsynk',
  'SolaX',
  'Victron',
  'BYD',
  'Pylontech',
  'EcoFlow',
];

const SUPPLIERS = [
  'Octopus Energy',
  'British Gas',
  'EDF',
  'E.ON Next',
  'OVO',
  'Scottish Power',
  'Utility Warehouse',
  'So Energy',
  'Outfox the Market',
  'Good Energy',
  'Ecotricity',
  'Fuse Energy',
  'Other',
];

const STD_BATT = [5, 7, 10, 13.5, 15, 20, 25];
const STD_INV = [3, 3.6, 4.6, 5, 6, 8, 10, 12, 15, 20];

export default function Calculator() {
  usePageMeta(
    'Solar & Battery Calculator & Quote Checker | Energy Aftercare',
    'Check if your solar quote is fair or estimate annual savings, payback, and lifetime return with our independent UK solar and battery calculator.'
  );

  // STEP: 1 = choose path, 2 = system/quote, 3 = home/energy, 4 = results
  const [step, setStep] = useState<number>(1);
  const [mode, setMode] = useState<'quote' | 'new'>('new');

  /* ---------- Quote Mode State ---------- */
  const [qPanels, setQPanels] = useState<number>(8);
  const [qWatt, setQWatt] = useState<number>(440);
  const [qPanelBrand, setQPanelBrand] = useState<string>('');
  const [qBattUnits, setQBattUnits] = useState<number>(1);
  const [qBatt, setQBatt] = useState<number>(10);
  const [qBattV, setQBattV] = useState<'HV' | 'LV' | ''>('');
  const [qBattBrand, setQBattBrand] = useState<string>('');
  const [qInvType, setQInvType] = useState<'hybrid' | 'string' | 'ac' | 'micro' | ''>('hybrid');
  const [qInvKw, setQInvKw] = useState<number>(5);
  const [qPhase, setQPhase] = useState<'1' | '3' | ''>('1');
  const [qInvBrand, setQInvBrand] = useState<string>('');
  const [qPrice, setQPrice] = useState<number>(11500);
  const [qInstaller, setQInstaller] = useState<string>('');

  // BOS & installation items
  const [bScaffold, setBScaffold] = useState<boolean>(true);
  const [bMount, setBMount] = useState<boolean>(true);
  const [bCable, setBCable] = useState<boolean>(true);
  const [bProtect, setBProtect] = useState<boolean>(true);
  const [bDno, setBDno] = useState<boolean>(true);
  const [bMcs, setBMcs] = useState<boolean>(true);
  const [bMonitor, setBMonitor] = useState<boolean>(true);

  // Extras
  const [xEv, setXEv] = useState<boolean>(false);
  const [xBird, setXBird] = useState<boolean>(false);
  const [xBackup, setXBackup] = useState<boolean>(false);
  const [xOpt, setXOpt] = useState<boolean>(false);

  // Warranties
  const [wPanel, setWPanel] = useState<number | ''>(25);
  const [wPerf, setWPerf] = useState<number | ''>(30);
  const [wInv, setWInv] = useState<number | ''>(10);
  const [wBatt, setWBatt] = useState<number | ''>(10);
  const [wWork, setWWork] = useState<number | ''>(2);
  const [wIns, setWIns] = useState<'yes' | 'no' | ''>('yes');

  /* ---------- New System Mode State ---------- */
  const [sysType, setSysType] = useState<'hybrid' | 'ongrid' | 'offgrid'>('hybrid');
  const [nKwp, setNKwp] = useState<number | ''>('');
  const [nRoof, setNRoof] = useState<number>(12);
  const [nPanelBrand, setNPanelBrand] = useState<string>('');
  const [nBattKwh, setNBattKwh] = useState<number | ''>('');
  const [nBattV, setNBattV] = useState<'HV' | 'LV' | ''>('');
  const [nBattBrand, setNBattBrand] = useState<string>('');
  const [nInvKw, setNInvKw] = useState<number | ''>('');
  const [nPhase, setNPhase] = useState<'1' | '3'>('1');
  const [nInvBrand, setNInvBrand] = useState<string>('');

  /* ---------- Home & Energy Usage State ---------- */
  const [postcode, setPostcode] = useState<string>('');
  const [usage, setUsage] = useState<number>(2700);
  const [usagePer, setUsagePer] = useState<number>(1); // 1 = year, 12 = month, 4 = quarter, 365 = day
  const [supplier, setSupplier] = useState<string>('Octopus Energy');
  const [tariff, setTariff] = useState<'svt' | 'fixed' | 'e7' | 'tou' | 'agile'>('svt');
  const [rate, setRate] = useState<number>(CONFIG.IMPORT_P);
  const [offRate, setOffRate] = useState<number>(CONFIG.OFFPEAK_P);
  const [tariffName, setTariffName] = useState<string>('');
  const [loadsState, setLoadsState] = useState<Record<number, 'no' | 'have' | 'plan'>>({
    0: 'no',
    1: 'no',
    2: 'no',
    3: 'no',
    4: 'no',
  });
  const [orient, setOrient] = useState<number>(0.85); // East & West split
  const [shade, setShade] = useState<number>(1.0); // None
  const [occ, setOcc] = useState<'out' | 'part' | 'home'>('part');

  // Error & Status Messages
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [parseNotice, setParseNotice] = useState<string>('');
  const [pasteModalOpen, setPasteModalOpen] = useState<boolean>(false);
  const [pastedText, setPastedText] = useState<string>('');

  // Lead Form
  const [leadName, setLeadName] = useState<string>('');
  const [leadEmail, setLeadEmail] = useState<string>('');
  const [leadPhone, setLeadPhone] = useState<string>('');
  const [leadWant, setLeadWant] = useState<string>(
    mode === 'quote' ? 'A second opinion on my quote' : 'Quotes from vetted local installers'
  );
  const [leadConsent, setLeadConsent] = useState<boolean>(true);
  const [leadSent, setLeadSent] = useState<boolean>(false);

  /* =========================================================================
     COMPUTATIONS
     ========================================================================= */
  const regionInfo = useMemo(() => getRegion(postcode), [postcode]);

  const totalConsumption = useMemo(() => {
    let base = (usage || 0) * usagePer;
    CONFIG.LOADS.forEach((l, i) => {
      if (loadsState[i] === 'plan') {
        base += l.kwh;
      }
    });
    return Math.max(300, base);
  }, [usage, usagePer, loadsState]);

  // System parameters for calculation
  const systemConfig = useMemo(() => {
    if (mode === 'quote') {
      const panels = qPanels || 0;
      const kWp = (panels * (qWatt || CONFIG.DEFAULT_PANEL_W)) / 1000;
      const batt = qBatt || 0;
      return {
        panels,
        kWp,
        batt,
        phase: qPhase || '1',
        inv: qInvType,
        invKw: qInvKw || 5,
        extras: { xEv, xBird, xBackup, xOpt },
        price: qPrice || 0,
        offgrid: false,
        suggested: { kwp: false, batt: false, inv: false },
      };
    } else {
      // Sizing mode
      const perPanel = CONFIG.DEFAULT_PANEL_W / 1000;
      let panels: number;
      let kWp: number;
      if (typeof nKwp === 'number' && nKwp > 0) {
        kWp = nKwp;
        panels = Math.max(1, Math.round(kWp / perPanel));
      } else {
        const target =
          (totalConsumption * (sysType === 'offgrid' ? 1.6 : 1.1)) /
          (regionInfo.yieldPerKw * orient * shade);
        panels = Math.max(6, Math.min(nRoof, Math.round(target / perPanel)));
        kWp = +(panels * perPanel).toFixed(2);
      }

      let batt = 0;
      if (sysType !== 'ongrid') {
        if (typeof nBattKwh === 'number' && nBattKwh > 0) {
          batt = nBattKwh;
        } else {
          const daily = totalConsumption / 365;
          const want =
            sysType === 'offgrid'
              ? daily * 1.5
              : daily * (['e7', 'tou', 'agile'].includes(tariff) ? 0.7 : 0.5);
          batt = STD_BATT.find((x) => x >= want) || 25;
        }
      }

      let invKw: number;
      if (typeof nInvKw === 'number' && nInvKw > 0) {
        invKw = nInvKw;
      } else {
        let want = Math.max(kWp * 0.85, sysType === 'offgrid' ? 5 : 3);
        if (nPhase !== '3') want = Math.min(want, kWp > 4.5 ? 5 : 3.6);
        invKw = STD_INV.find((x) => x >= want) || 20;
      }

      return {
        panels,
        kWp,
        batt,
        phase: nPhase,
        inv: sysType === 'ongrid' ? 'string' : 'hybrid',
        invKw,
        extras: { xEv: false, xBird: false, xBackup: false, xOpt: false },
        price: 0,
        offgrid: sysType === 'offgrid',
        suggested: {
          kwp: !(typeof nKwp === 'number' && nKwp > 0),
          batt: sysType !== 'ongrid' && !(typeof nBattKwh === 'number' && nBattKwh > 0),
          inv: !(typeof nInvKw === 'number' && nInvKw > 0),
        },
      };
    }
  }, [
    mode,
    qPanels,
    qWatt,
    qBatt,
    qPhase,
    qInvType,
    qInvKw,
    xEv,
    xBird,
    xBackup,
    xOpt,
    qPrice,
    nKwp,
    nRoof,
    totalConsumption,
    regionInfo.yieldPerKw,
    orient,
    shade,
    sysType,
    nBattKwh,
    tariff,
    nInvKw,
    nPhase,
  ]);

  // Price range calculation
  const fairRange = useMemo(() => {
    const s = systemConfig;
    const out = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
      if (s.kWp > 0) out[i] += CONFIG.SOLAR_FIXED[i] + s.kWp * CONFIG.SOLAR_PER_KW[i];
      if (s.batt > 0) out[i] += CONFIG.BATT_FIXED[i] + s.batt * CONFIG.BATT_PER_KWH[i];
      if (s.phase === '3') out[i] += CONFIG.THREE_PHASE[i];
      if (s.offgrid) out[i] += CONFIG.OFF_GRID[i];
      if (s.invKw && s.invKw > (s.phase === '3' ? 11.04 : 3.68)) out[i] += CONFIG.G99[i];
      if (s.inv === 'micro') out[i] += CONFIG.MICRO_PER_PANEL[i] * s.panels;
      const x = (s.extras || {}) as {
        xEv?: boolean;
        xBird?: boolean;
        xBackup?: boolean;
        xOpt?: boolean;
      };
      if (x.xEv) out[i] += CONFIG.EXTRAS.xEv[i];
      if (x.xBird) out[i] += CONFIG.EXTRAS.xBird[i];
      if (x.xBackup) out[i] += CONFIG.EXTRAS.xBackup[i];
      if (x.xOpt) out[i] += CONFIG.EXTRAS.xOptPerPanel[i] * s.panels;
    }
    return out.map(r100);
  }, [systemConfig]);

  // Energy & Savings Model
  const calculation = useMemo(() => {
    const s = systemConfig;
    const cons = totalConsumption;
    const yieldPerKw = regionInfo.yieldPerKw;
    const effRate = rate || CONFIG.IMPORT_P;
    const effOff = ['e7', 'tou', 'agile'].includes(tariff) && s.batt > 0 ? offRate : null;

    const gen = s.kWp * yieldPerKw * orient * shade;
    const f = { out: 0.25, part: 0.35, home: 0.45 }[occ];
    const d = { out: 0.3, part: 0.4, home: 0.5 }[occ];
    const fEff = gen > 0 ? Math.min(0.8, f * Math.sqrt(cons / gen)) : 0;
    const direct = Math.min(gen * fEff, cons * d);
    const excess = Math.max(0, gen - direct);
    let remaining = cons - direct;

    const usable = s.batt * 0.95;
    const eff = 0.9;
    const solarIn = Math.min(excess * 0.7, usable * 200);
    const fromBatt = Math.min(solarIn * eff, remaining * 0.85);
    const charged = fromBatt / eff;
    remaining -= fromBatt;
    const exported = Math.max(0, excess - charged);

    let shift = 0;
    let shiftSave = 0;
    if (effOff != null && usable > 0 && effRate > effOff / eff) {
      const spareCycles = Math.max(0, 330 - charged / usable);
      shift = Math.min(spareCycles * usable * eff, remaining * 0.9);
      shiftSave = (shift * (effRate - effOff / eff)) / 100;
    }

    const billSave = ((direct + fromBatt) * effRate) / 100;
    const exportInc = s.offgrid ? 0 : (exported * CONFIG.EXPORT_P) / 100;
    const standing = s.offgrid ? (CONFIG.STANDING_P * 365) / 100 : 0;
    const totalAnnual = billSave + exportInc + shiftSave + standing;
    const selfShare = cons > 0 ? (direct + fromBatt + shift) / cons : 0;

    const effectiveCost = mode === 'quote' ? s.price : fairRange[1];
    const paybackYears = totalAnnual > 0 ? effectiveCost / totalAnnual : Infinity;

    // 25-year lifetime return with 0.5% yearly degradation & £1000 inverter replacement
    let lifetimeTotal = 0;
    for (let y = 0; y < 25; y++) {
      lifetimeTotal += totalAnnual * Math.pow(0.995, y);
    }
    const lifetimeReturn = Math.round(lifetimeTotal - effectiveCost - 1000);

    // Aftercare Plan Recommendation
    let planSlug = 'gold-support-plan';
    let planName = 'Gold Support Plan';
    let planPrice = '£299';
    let planReason =
      'Comprehensive annual electrical inspection & proactive battery diagnostics.';
    if (s.offgrid || s.kWp >= 8 || s.batt >= 15) {
      planSlug = 'platinum-support-plan';
      planName = 'Platinum Support Plan';
      planPrice = '£449';
      planReason =
        'Priority engineer support, remote firmware telemetry, and multi-string balancing.';
    } else if (s.batt === 0 && s.kWp <= 3.6) {
      planSlug = 'silver-support-plan';
      planName = 'Silver Support Plan';
      planPrice = '£149';
      planReason = 'Ideal for standard solar string systems requiring periodic certification.';
    }

    return {
      gen,
      direct,
      fromBatt,
      exported: s.offgrid ? 0 : exported,
      wasted: s.offgrid ? exported : 0,
      shift,
      billSave,
      exportInc,
      shiftSave,
      standing,
      totalAnnual,
      selfShare,
      effectiveCost,
      paybackYears,
      lifetimeReturn,
      planSlug,
      planName,
      planPrice,
      planReason,
    };
  }, [
    systemConfig,
    totalConsumption,
    regionInfo.yieldPerKw,
    rate,
    tariff,
    offRate,
    orient,
    shade,
    occ,
    mode,
    fairRange,
  ]);

  /* =========================================================================
     TEXT / DOCUMENT PARSER (Matches eac-calculator.html regexes)
     ========================================================================= */
  const parseDocumentText = (t: string) => {
    let foundCount = 0;

    // Postcode
    const pcMatch = t.match(/\b([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})\b/i);
    if (pcMatch) {
      setPostcode(pcMatch[1].toUpperCase());
      foundCount++;
    }

    // Panels
    let m = t.match(/\b(\d{1,2})\s*(?:x|×|no\.?|nos|pcs)\s*[^\n]{0,50}?\b(\d{3})\s*w(?:p)?\b/i);
    if (m) {
      setQPanels(+m[1]);
      setQWatt(+m[2]);
      foundCount += 2;
    } else {
      m = t.match(/\b(\d{1,2})\s*(?:x\s*)?(?:solar\s*|pv\s*)?(?:panels|modules)\b/i);
      if (m) {
        setQPanels(+m[1]);
        foundCount++;
      }
      m = t.match(/\b([3-7]\d{2})\s*w(?:p)?\b/i);
      if (m) {
        setQWatt(+m[1]);
        foundCount++;
      }
    }

    // Battery
    const kwhMatches = [...t.matchAll(/\b(\d{1,3}(?:\.\d{1,2})?)\s*kwh\b/gi)]
      .map((x) => +x[1])
      .filter((v) => v >= 2 && v <= 100);
    if (kwhMatches.length > 0) {
      setQBatt(Math.max(...kwhMatches));
      foundCount++;
    }

    // Inverter
    if (/micro[- ]?inverter/i.test(t)) setQInvType('micro');
    else if (/hybrid/i.test(t)) setQInvType('hybrid');
    else if (/ac[- ]?coupled/i.test(t)) setQInvType('ac');
    else if (/(solar|string|pv)\s*inverter/i.test(t)) setQInvType('string');

    const invLine = t
      .split('\n')
      .find((l) => /inverter/i.test(l) && /\d(?:\.\d)?\s*kw\b(?!h|p)/i.test(l));
    if (invLine) {
      const im = invLine.match(/\b(\d{1,2}(?:\.\d)?)\s*kw\b(?!h|p)/i);
      if (im) {
        setQInvKw(+im[1]);
        foundCount++;
      }
    }

    // Price
    const moneyMatches = [...t.matchAll(/£\s?([\d,]{3,9}(?:\.\d{2})?)/g)]
      .map((x) => parseFloat(x[1].replace(/,/g, '')))
      .filter((v) => v >= 1000 && v <= 80000);
    if (moneyMatches.length > 0) {
      setQPrice(Math.round(Math.max(...moneyMatches)));
      foundCount++;
    }

    // BOS items
    setBScaffold(/scaffold/i.test(t));
    setBMount(/mounting|rail|bracket/i.test(t));
    setBCable(/cabl|wiring/i.test(t));
    setBProtect(/isolator|breaker|surge|spd/i.test(t));
    setBDno(/dno|g98|g99|g100/i.test(t));
    setBMcs(/mcs/i.test(t));
    setBMonitor(/monitor|app\b|wifi dongle/i.test(t));

    // Extras
    setXEv(/ev charger|zappi|wallbox|ohme/i.test(t));
    setXBird(/bird|pigeon|mesh/i.test(t));
    setXBackup(/eps|backup|gateway/i.test(t));
    setXOpt(/optimiser|optimizer/i.test(t));

    // Warranties
    for (const l of t.split('\n')) {
      if (!/warrant|guarant/i.test(l)) continue;
      for (const y of l.matchAll(/\b(\d{1,2})\s*[- ]?(?:years?|yrs?)\b/gi)) {
        const val = +y[1];
        if (/panel|product|module/i.test(l)) setWPanel(val);
        else if (/performance|output|linear/i.test(l)) setWPerf(val);
        else if (/inverter/i.test(l)) setWInv(val);
        else if (/batter/i.test(l)) setWBatt(val);
        else if (/workmanship|installation|labour/i.test(l)) setWWork(val);
      }
    }

    setParseNotice(
      foundCount > 0
        ? `Found ${foundCount} details and updated your calculator fields below!`
        : 'Could not extract clean numbers automatically. You can edit the values directly below.'
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setParseNotice('Reading file text...');

    try {
      if (file.type === 'text/plain') {
        const text = await file.text();
        parseDocumentText(text);
      } else {
        // If PDF or image, prompt to paste or read text
        setParseNotice(
          'File selected. For instant parsing, you can also paste your quote text using the "Paste Quote Text" button below.'
        );
      }
    } catch {
      setParseNotice('Could not parse automatically. Please fill in the details below.');
    }
  };

  /* =========================================================================
     NAVIGATION & VALIDATION
     ========================================================================= */
  const handleProceedToStep3 = () => {
    setErrorMessage('');
    if (mode === 'quote') {
      if (qPanels <= 0 && qBatt <= 0) {
        setErrorMessage('Please specify either the number of solar panels or battery size.');
        return;
      }
      if (!qPrice || qPrice <= 0) {
        setErrorMessage('Please enter the total quoted price from your installer.');
        return;
      }
    }
    setStep(3);
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  const handleCalculate = () => {
    setErrorMessage('');
    if (totalConsumption < 300) {
      setErrorMessage(
        'Please enter your electricity consumption or pick an estimate from the household size options.'
      );
      return;
    }
    setStep(4);
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  return (
    <div className="bg-ea-black text-ea-white min-h-screen">
      {/* Hero Header */}
      <section className="relative border-b border-ea-grey/15 pb-10 pt-12 md:py-16 bg-gradient-to-b from-ea-black to-ea-ink">
        <div className="ea-container">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-ea-green/30 bg-ea-green/10 px-4 py-1.5 text-xs font-bold tracking-wider text-ea-green uppercase">
              <Sparkles className="h-4 w-4" /> Independent UK Solar & Battery Analysis
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-ea-white">
              Solar & Battery <span className="text-ea-green">Calculator</span>
            </h1>
            <p className="mt-3 max-w-2xl text-base sm:text-lg text-ea-white/75">
              Check whether an installer quote is genuinely fair, or size a bespoke setup for your home
              with real UK regional yields, daytime habits, and lifetime savings.
            </p>

            {/* Stepper Navigation */}
            <div className="mt-8 flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
              {[
                { n: 1, label: '1. Select Goal' },
                { n: 2, label: mode === 'quote' ? '2. Quote Details' : '2. System Sizing' },
                { n: 3, label: '3. Home & Tariff' },
                { n: 4, label: '4. Full Results' },
              ].map((s) => (
                <button
                  key={s.n}
                  type="button"
                  onClick={() => s.n < step && setStep(s.n)}
                  className={cn(
                    'rounded-full px-4 py-2 font-bold transition-all border flex items-center gap-1.5',
                    step === s.n
                      ? 'border-ea-green bg-ea-green text-ea-black shadow-[0_0_20px_rgba(0,229,117,0.3)]'
                      : s.n < step
                      ? 'border-ea-green/40 bg-ea-green/10 text-ea-green hover:bg-ea-green/20 cursor-pointer'
                      : 'border-ea-grey/25 bg-ea-ink text-ea-grey/60 cursor-default'
                  )}
                >
                  {s.n < step && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  {s.label}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Main Body */}
      <main className="py-10 md:py-16">
        <div className="ea-container max-w-5xl">
          {/* =================================================================
             STEP 1: CHOOSE PATH
             ================================================================= */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center max-w-xl mx-auto mb-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-ea-white">
                  What would you like to calculate today?
                </h2>
                <p className="mt-2 text-sm text-ea-grey">
                  Choose the path that fits where you are in your solar journey.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Option A: Have a quote */}
                <button
                  type="button"
                  onClick={() => {
                    setMode('quote');
                    setStep(2);
                  }}
                  className={cn(
                    'group text-left rounded-3xl border p-8 transition-all duration-300 relative overflow-hidden',
                    mode === 'quote'
                      ? 'border-ea-green bg-ea-ink shadow-[0_0_30px_rgba(0,229,117,0.15)] ring-1 ring-ea-green'
                      : 'border-ea-grey/25 bg-ea-ink/60 hover:border-ea-grey/50 hover:bg-ea-ink'
                  )}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ea-black border border-ea-grey/20 text-ea-green mb-6 group-hover:scale-105 transition-transform">
                    <FileText className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-ea-white flex items-center justify-between">
                    I have a quote
                    <ChevronRight className="h-5 w-5 text-ea-green group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="mt-3 text-sm text-ea-white/70 leading-relaxed">
                    Check if your installer’s price is fair against UK benchmark averages. We review
                    hardware brands, missing BOS items (scaffolding, DNO, isolators), warranties, and
                    calculate your genuine payback period.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2 text-xs text-ea-green font-medium">
                    <span className="rounded-lg bg-ea-black/60 px-3 py-1 border border-ea-grey/20">
                      Fair Price Check
                    </span>
                    <span className="rounded-lg bg-ea-black/60 px-3 py-1 border border-ea-grey/20">
                      Warranty Audit
                    </span>
                    <span className="rounded-lg bg-ea-black/60 px-3 py-1 border border-ea-grey/20">
                      Payback
                    </span>
                  </div>
                </button>

                {/* Option B: Do not have a quote yet */}
                <button
                  type="button"
                  onClick={() => {
                    setMode('new');
                    setStep(2);
                  }}
                  className={cn(
                    'group text-left rounded-3xl border p-8 transition-all duration-300 relative overflow-hidden',
                    mode === 'new'
                      ? 'border-ea-green bg-ea-ink shadow-[0_0_30px_rgba(0,229,117,0.15)] ring-1 ring-ea-green'
                      : 'border-ea-grey/25 bg-ea-ink/60 hover:border-ea-grey/50 hover:bg-ea-ink'
                  )}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ea-black border border-ea-grey/20 text-ea-green mb-6 group-hover:scale-105 transition-transform">
                    <Sun className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-ea-white flex items-center justify-between">
                    I don't have a quote yet
                    <ChevronRight className="h-5 w-5 text-ea-green group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="mt-3 text-sm text-ea-white/70 leading-relaxed">
                    Tell us about your home, roof, and daytime habits. We’ll calculate your ideal solar
                    array kWp, optimal battery capacity, expected UK market installation cost, and 25-year
                    financial return.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2 text-xs text-ea-green font-medium">
                    <span className="rounded-lg bg-ea-black/60 px-3 py-1 border border-ea-grey/20">
                      System Sizing
                    </span>
                    <span className="rounded-lg bg-ea-black/60 px-3 py-1 border border-ea-grey/20">
                      Market Price Range
                    </span>
                    <span className="rounded-lg bg-ea-black/60 px-3 py-1 border border-ea-grey/20">
                      25-Yr Return
                    </span>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* =================================================================
             STEP 2: SYSTEM OR QUOTE DETAILS
             ================================================================= */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {mode === 'quote' ? (
                <>
                  {/* Quote Quick Upload / Paste Banner */}
                  <div className="rounded-3xl border border-ea-green/30 bg-ea-ink p-6 md:p-8 relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ea-green">
                          <Upload className="h-4 w-4" /> Fast Autofill
                        </span>
                        <h3 className="text-lg font-bold text-ea-white mt-1">
                          Have a quote PDF or text from your installer?
                        </h3>
                        <p className="text-xs text-ea-grey mt-0.5">
                          Upload your file or paste the text. We extract panels, battery, inverter, and
                          price automatically.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <label className="cursor-pointer rounded-xl bg-ea-black border border-ea-grey/30 hover:border-ea-green/50 px-4 py-2.5 text-xs font-bold text-ea-white inline-flex items-center gap-2 transition-colors">
                          <Upload className="h-4 w-4 text-ea-green" /> Select File
                          <input
                            type="file"
                            accept=".pdf,.txt,image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setPasteModalOpen(true)}
                          className="rounded-xl bg-ea-black border border-ea-grey/30 hover:border-ea-green/50 px-4 py-2.5 text-xs font-bold text-ea-white inline-flex items-center gap-2 transition-colors"
                        >
                          <FileText className="h-4 w-4 text-ea-green" /> Paste Text
                        </button>
                      </div>
                    </div>

                    {parseNotice && (
                      <div className="mt-4 rounded-xl bg-ea-black/80 border border-ea-green/40 p-3 text-xs text-ea-green flex items-center gap-2">
                        <Info className="h-4 w-4 shrink-0" />
                        <span>{parseNotice}</span>
                      </div>
                    )}
                  </div>

                  {/* Solar Panels on Quote */}
                  <div className="rounded-3xl border border-ea-grey/25 bg-ea-ink p-6 md:p-8 space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-ea-green flex items-center gap-2">
                      <Sun className="h-4 w-4" /> 1. Solar Panels
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="text-xs font-semibold text-ea-grey">Number of Panels</label>
                        <input
                          type="number"
                          min={0}
                          max={80}
                          value={qPanels}
                          onChange={(e) => setQPanels(parseInt(e.target.value) || 0)}
                          className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm font-bold text-ea-white focus:border-ea-green focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-ea-grey">Panel Size (Watts)</label>
                        <input
                          type="number"
                          min={200}
                          max={700}
                          value={qWatt}
                          onChange={(e) => setQWatt(parseInt(e.target.value) || 0)}
                          className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm font-bold text-ea-white focus:border-ea-green focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-ea-grey">Panel Brand</label>
                        <input
                          type="text"
                          placeholder="e.g. Aiko, JA Solar, Trina"
                          value={qPanelBrand}
                          onChange={(e) => setQPanelBrand(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm text-ea-white focus:border-ea-green focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="text-xs text-ea-white/70">
                      Total Array Peak Power:{' '}
                      <strong className="text-ea-green">
                        {((qPanels * (qWatt || 440)) / 1000).toFixed(2)} kWp
                      </strong>
                    </div>
                  </div>

                  {/* Battery Storage on Quote */}
                  <div className="rounded-3xl border border-ea-grey/25 bg-ea-ink p-6 md:p-8 space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-ea-green flex items-center gap-2">
                      <Battery className="h-4 w-4" /> 2. Battery Storage
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="text-xs font-semibold text-ea-grey">Battery Units / Packs</label>
                        <input
                          type="number"
                          min={0}
                          max={10}
                          value={qBattUnits}
                          onChange={(e) => setQBattUnits(parseInt(e.target.value) || 0)}
                          className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm font-bold text-ea-white focus:border-ea-green focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-ea-grey">
                          Total Usable Capacity (kWh)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          min={0}
                          max={60}
                          value={qBatt}
                          onChange={(e) => setQBatt(parseFloat(e.target.value) || 0)}
                          className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm font-bold text-ea-white focus:border-ea-green focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-ea-grey">Voltage Architecture</label>
                        <select
                          value={qBattV}
                          onChange={(e) => setQBattV(e.target.value as any)}
                          className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm text-ea-white focus:border-ea-green focus:outline-none"
                        >
                          <option value="">Not sure / Standard</option>
                          <option value="HV">High Voltage (HV - e.g. SigEnergy, Tesla)</option>
                          <option value="LV">Low Voltage (LV / 48V)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-ea-grey">
                        Battery Brand & Model (optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. GivEnergy All-In-One, Tesla Powerwall 3, SigEnergy SigenStor"
                        value={qBattBrand}
                        onChange={(e) => setQBattBrand(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm text-ea-white focus:border-ea-green focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Inverter on Quote */}
                  <div className="rounded-3xl border border-ea-grey/25 bg-ea-ink p-6 md:p-8 space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-ea-green flex items-center gap-2">
                      <Zap className="h-4 w-4" /> 3. Inverter
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="text-xs font-semibold text-ea-grey">Inverter Type</label>
                        <select
                          value={qInvType}
                          onChange={(e) => setQInvType(e.target.value as any)}
                          className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm text-ea-white focus:border-ea-green focus:outline-none"
                        >
                          <option value="hybrid">Hybrid (Solar + Battery in one)</option>
                          <option value="string">Solar-only String Inverter</option>
                          <option value="ac">Separate Battery Inverter (AC coupled)</option>
                          <option value="micro">Microinverters (e.g. Enphase)</option>
                          <option value="">Not sure</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-ea-grey">Inverter Size (kW)</label>
                        <input
                          type="number"
                          step="0.1"
                          min={1}
                          max={30}
                          value={qInvKw}
                          onChange={(e) => setQInvKw(parseFloat(e.target.value) || 0)}
                          className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm font-bold text-ea-white focus:border-ea-green focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-ea-grey">Grid Phase</label>
                        <select
                          value={qPhase}
                          onChange={(e) => setQPhase(e.target.value as any)}
                          className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm text-ea-white focus:border-ea-green focus:outline-none"
                        >
                          <option value="1">Single Phase (Most UK Homes)</option>
                          <option value="3">Three Phase (Commercial / Large rural)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Installation Checklist & Extras */}
                  <div className="rounded-3xl border border-ea-grey/25 bg-ea-ink p-6 md:p-8 space-y-6">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-ea-green">
                        4. Installation Inclusions (Check what the quote specifies)
                      </h3>
                      <p className="text-xs text-ea-grey mt-1">
                        Missing installation parts often lead to hidden extra charges later.
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                      {[
                        { label: 'Scaffolding', val: bScaffold, setVal: setBScaffold },
                        { label: 'Roof Mounting Rails & Hooks', val: bMount, setVal: setBMount },
                        { label: 'AC/DC Cabling & Trunking', val: bCable, setVal: setBCable },
                        {
                          label: 'DC Isolators & Surge Protection (SPD)',
                          val: bProtect,
                          setVal: setBProtect,
                        },
                        { label: 'DNO Notification (G98/G99)', val: bDno, setVal: setBDno },
                        { label: 'MCS Certificate for Export', val: bMcs, setVal: setBMcs },
                        { label: 'Monitoring App & Wifi Dongle', val: bMonitor, setVal: setBMonitor },
                      ].map((item, idx) => (
                        <label
                          key={idx}
                          className={cn(
                            'flex items-center gap-3 rounded-2xl border p-3.5 cursor-pointer text-xs font-semibold transition-all',
                            item.val
                              ? 'border-ea-green/40 bg-ea-green/10 text-ea-white'
                              : 'border-ea-grey/20 bg-ea-black/50 text-ea-grey'
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={item.val}
                            onChange={(e) => item.setVal(e.target.checked)}
                            className="h-4 w-4 accent-ea-green rounded cursor-pointer"
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-ea-grey/15">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-ea-grey">
                        Optional Add-ons on Quote
                      </h4>
                      <div className="mt-3 grid gap-3 sm:grid-cols-4">
                        {[
                          { label: 'EV Charger', val: xEv, setVal: setXEv },
                          { label: 'Bird / Pigeon Mesh', val: xBird, setVal: setXBird },
                          { label: 'Backup Power (EPS / Gateway)', val: xBackup, setVal: setXBackup },
                          { label: 'Solar Optimisers', val: xOpt, setVal: setXOpt },
                        ].map((item, idx) => (
                          <label
                            key={idx}
                            className={cn(
                              'flex items-center gap-3 rounded-2xl border p-3.5 cursor-pointer text-xs font-semibold transition-all',
                              item.val
                                ? 'border-ea-green/40 bg-ea-green/10 text-ea-white'
                                : 'border-ea-grey/20 bg-ea-black/50 text-ea-grey'
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={item.val}
                              onChange={(e) => item.setVal(e.target.checked)}
                              className="h-4 w-4 accent-ea-green rounded cursor-pointer"
                            />
                            <span>{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Warranties on Quote */}
                  <div className="rounded-3xl border border-ea-grey/25 bg-ea-ink p-6 md:p-8 space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-ea-green">
                      5. Warranties (Years)
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="text-xs font-semibold text-ea-grey">Panel Product (yrs)</label>
                        <input
                          type="number"
                          placeholder="e.g. 25"
                          value={wPanel}
                          onChange={(e) =>
                            setWPanel(e.target.value === '' ? '' : parseInt(e.target.value))
                          }
                          className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm font-bold text-ea-white focus:border-ea-green focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-ea-grey">
                          Panel Performance (yrs)
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 30"
                          value={wPerf}
                          onChange={(e) =>
                            setWPerf(e.target.value === '' ? '' : parseInt(e.target.value))
                          }
                          className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm font-bold text-ea-white focus:border-ea-green focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-ea-grey">Inverter (yrs)</label>
                        <input
                          type="number"
                          placeholder="e.g. 10"
                          value={wInv}
                          onChange={(e) =>
                            setWInv(e.target.value === '' ? '' : parseInt(e.target.value))
                          }
                          className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm font-bold text-ea-white focus:border-ea-green focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-ea-grey">Battery (yrs)</label>
                        <input
                          type="number"
                          placeholder="e.g. 10"
                          value={wBatt}
                          onChange={(e) =>
                            setWBatt(e.target.value === '' ? '' : parseInt(e.target.value))
                          }
                          className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm font-bold text-ea-white focus:border-ea-green focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-ea-grey">
                          Installer Workmanship (yrs)
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 2"
                          value={wWork}
                          onChange={(e) =>
                            setWWork(e.target.value === '' ? '' : parseInt(e.target.value))
                          }
                          className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm font-bold text-ea-white focus:border-ea-green focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-ea-grey">Insurance-Backed?</label>
                        <select
                          value={wIns}
                          onChange={(e) => setWIns(e.target.value as any)}
                          className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm text-ea-white focus:border-ea-green focus:outline-none"
                        >
                          <option value="yes">Yes (e.g. HIES, IWA)</option>
                          <option value="no">No</option>
                          <option value="">Not stated</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Quoted Total Price */}
                  <div className="rounded-3xl border border-ea-green/40 bg-ea-ink p-6 md:p-8 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-ea-green flex items-center gap-2">
                      <DollarSign className="h-4 w-4" /> 6. Total Quoted Price (inc. 0% VAT)
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-semibold text-ea-grey">Total Price (£)</label>
                        <input
                          type="number"
                          step="100"
                          value={qPrice}
                          onChange={(e) => setQPrice(parseInt(e.target.value) || 0)}
                          className="mt-1.5 w-full rounded-2xl border border-ea-green/50 bg-ea-black px-4 py-3 text-2xl font-black text-ea-green focus:border-ea-green focus:outline-none"
                        />
                        <p className="mt-1 text-xs text-ea-grey">
                          Full contract price including scaffolding, parts, and labour.
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-ea-grey">
                          Installer Company Name (optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Local Solar Ltd"
                          value={qInstaller}
                          onChange={(e) => setQInstaller(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-3 text-sm text-ea-white focus:border-ea-green focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Mode: Sizing a New System */
                <>
                  {/* System Architecture */}
                  <div className="rounded-3xl border border-ea-grey/25 bg-ea-ink p-6 md:p-8 space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-ea-green">
                      1. System Architecture
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {[
                        {
                          id: 'hybrid',
                          title: 'Hybrid (Solar + Battery)',
                          desc: 'Panels charge the battery and power the home. Grid remains connected for backup and night top-ups.',
                        },
                        {
                          id: 'ongrid',
                          title: 'On-Grid (Solar Only)',
                          desc: 'Panels generate electricity in daylight; excess sold to grid. No battery storage.',
                        },
                        {
                          id: 'offgrid',
                          title: 'Off-Grid (Self-Sustaining)',
                          desc: 'No mains connection. Requires larger battery reserve and generator integration.',
                        },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSysType(item.id as any)}
                          className={cn(
                            'text-left rounded-2xl border p-5 transition-all',
                            sysType === item.id
                              ? 'border-ea-green bg-ea-green/10 text-ea-white shadow-[0_0_20px_rgba(0,229,117,0.15)]'
                              : 'border-ea-grey/25 bg-ea-black/50 text-ea-grey hover:border-ea-grey/50'
                          )}
                        >
                          <b className="block text-sm font-bold text-ea-white">{item.title}</b>
                          <p className="mt-2 text-xs text-ea-white/70">{item.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Solar Array Capacity & Roof Space */}
                  <div className="rounded-3xl border border-ea-grey/25 bg-ea-ink p-6 md:p-8 space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-ea-green flex items-center gap-2">
                      <Sun className="h-4 w-4" /> 2. Solar Array & Roof Space
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="text-xs font-semibold text-ea-grey">
                          Solar Size (kWp) <span className="text-ea-grey/60">(Leave blank to auto-size)</span>
                        </label>
                        <input
                          type="number"
                          step="0.2"
                          placeholder="Auto-suggested"
                          value={nKwp}
                          onChange={(e) =>
                            setNKwp(e.target.value === '' ? '' : parseFloat(e.target.value))
                          }
                          className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm font-bold text-ea-white focus:border-ea-green focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-ea-grey">Estimated Roof Space</label>
                        <select
                          value={nRoof}
                          onChange={(e) => setNRoof(parseInt(e.target.value))}
                          className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm text-ea-white focus:border-ea-green focus:outline-none"
                        >
                          <option value="8">Small Roof (~8 panels / 3.5 kWp)</option>
                          <option value="12">Medium Roof (~12 panels / 5.2 kWp)</option>
                          <option value="18">Large Roof (~18 panels / 7.9 kWp)</option>
                          <option value="30">Very Large Roof (~30 panels / 13.2 kWp)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-ea-grey">Preferred Brand (optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. Aiko, JA Solar, Trina"
                          value={nPanelBrand}
                          onChange={(e) => setNPanelBrand(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm text-ea-white focus:border-ea-green focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Battery Capacity */}
                  {sysType !== 'ongrid' && (
                    <div className="rounded-3xl border border-ea-grey/25 bg-ea-ink p-6 md:p-8 space-y-6">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-ea-green flex items-center gap-2">
                        <Battery className="h-4 w-4" /> 3. Battery Storage
                      </h3>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <label className="text-xs font-semibold text-ea-grey">
                            Battery Capacity (kWh) <span className="text-ea-grey/60">(Leave blank to auto-size)</span>
                          </label>
                          <input
                            type="number"
                            step="0.5"
                            placeholder="Auto-suggested"
                            value={nBattKwh}
                            onChange={(e) =>
                              setNBattKwh(e.target.value === '' ? '' : parseFloat(e.target.value))
                            }
                            className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm font-bold text-ea-white focus:border-ea-green focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-ea-grey">Battery Voltage</label>
                          <select
                            value={nBattV}
                            onChange={(e) => setNBattV(e.target.value as any)}
                            className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm text-ea-white focus:border-ea-green focus:outline-none"
                          >
                            <option value="">No preference</option>
                            <option value="HV">High Voltage (HV - higher efficiency)</option>
                            <option value="LV">Low Voltage (LV - 48V)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-ea-grey">
                            Preferred Battery Brand (optional)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. GivEnergy, SigEnergy, Tesla"
                            value={nBattBrand}
                            onChange={(e) => setNBattBrand(e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm text-ea-white focus:border-ea-green focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Inverter & Phase */}
                  <div className="rounded-3xl border border-ea-grey/25 bg-ea-ink p-6 md:p-8 space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-ea-green flex items-center gap-2">
                      <Zap className="h-4 w-4" /> 4. Inverter & Phase
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="text-xs font-semibold text-ea-grey">Inverter Size (kW)</label>
                        <input
                          type="number"
                          step="0.5"
                          placeholder="Auto-suggested"
                          value={nInvKw}
                          onChange={(e) =>
                            setNInvKw(e.target.value === '' ? '' : parseFloat(e.target.value))
                          }
                          className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm font-bold text-ea-white focus:border-ea-green focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-ea-grey">Property Phase</label>
                        <select
                          value={nPhase}
                          onChange={(e) => setNPhase(e.target.value as any)}
                          className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm text-ea-white focus:border-ea-green focus:outline-none"
                        >
                          <option value="1">Single Phase (Standard Domestic)</option>
                          <option value="3">Three Phase</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-ea-grey">Inverter Brand (optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. Solis, SolarEdge, GivEnergy"
                          value={nInvBrand}
                          onChange={(e) => setNInvBrand(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm text-ea-white focus:border-ea-green focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {errorMessage && (
                <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-xs font-semibold text-red-300 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-full border border-ea-grey/30 px-6 py-3 text-sm font-bold text-ea-white hover:border-ea-grey flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={handleProceedToStep3}
                  className={cn(btn.primary, 'py-3.5 px-8 text-sm')}
                >
                  Next: Your Home & Tariff <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* =================================================================
             STEP 3: HOME & USAGE & TARIFF
             ================================================================= */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Postcode & Consumption */}
              <div className="rounded-3xl border border-ea-grey/25 bg-ea-ink p-6 md:p-8 space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-ea-green flex items-center gap-2">
                  <Home className="h-4 w-4" /> 1. Location & Electricity Consumption
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-ea-grey">
                      Postcode (UK Outward Code)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BS1 4DJ, SW1A 1AA, M1 1AE"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm font-bold text-ea-white focus:border-ea-green focus:outline-none"
                    />
                    <p className="mt-1.5 text-xs text-ea-white/70">
                      Region:{' '}
                      <strong className="text-ea-green">{regionInfo.name}</strong> (
                      {regionInfo.yieldPerKw} kWh/kWp average solar yield)
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ea-grey">Electricity Use</label>
                    <div className="mt-1.5 flex gap-2">
                      <input
                        type="number"
                        min={100}
                        value={usage}
                        onChange={(e) => setUsage(parseFloat(e.target.value) || 0)}
                        className="w-2/3 rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm font-bold text-ea-white focus:border-ea-green focus:outline-none"
                      />
                      <select
                        value={usagePer}
                        onChange={(e) => setUsagePer(parseFloat(e.target.value))}
                        className="w-1/3 rounded-xl border border-ea-grey/30 bg-ea-black px-3 py-2.5 text-xs text-ea-white focus:border-ea-green focus:outline-none"
                      >
                        <option value="1">per year</option>
                        <option value="12">per month</option>
                        <option value="4">per quarter</option>
                        <option value="365">per day</option>
                      </select>
                    </div>
                    {/* Quick Preset Buttons */}
                    <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                      <span className="text-ea-grey mr-1">Presets:</span>
                      {[
                        { label: '1-2 people (1,800 kWh)', val: 1800 },
                        { label: '3-4 people (2,700 kWh)', val: 2700 },
                        { label: '5+ people (4,100 kWh)', val: 4100 },
                      ].map((p, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setUsage(p.val);
                            setUsagePer(1);
                          }}
                          className="rounded-md border border-ea-grey/25 bg-ea-black px-2 py-0.5 text-ea-grey hover:border-ea-green hover:text-ea-white transition-colors"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Electricity Supplier & Tariff */}
              <div className="rounded-3xl border border-ea-grey/25 bg-ea-ink p-6 md:p-8 space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-ea-green flex items-center gap-2">
                  <Zap className="h-4 w-4" /> 2. Supplier & Tariff Rates
                </h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="text-xs font-semibold text-ea-grey">Electricity Supplier</label>
                    <select
                      value={supplier}
                      onChange={(e) => setSupplier(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm text-ea-white focus:border-ea-green focus:outline-none"
                    >
                      {SUPPLIERS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ea-grey">Tariff Type</label>
                    <select
                      value={tariff}
                      onChange={(e) => setTariff(e.target.value as any)}
                      className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm text-ea-white focus:border-ea-green focus:outline-none"
                    >
                      <option value="svt">Standard Variable (Ofgem Price Cap)</option>
                      <option value="fixed">Fixed Rate</option>
                      <option value="e7">Economy 7 (Day/Night rate)</option>
                      <option value="tou">EV / Smart Tariff (e.g. Intelligent Octopus)</option>
                      <option value="agile">Agile / Dynamic Market Rate</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ea-grey">Day / Standard Rate (p/kWh)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={rate}
                      onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                      className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm font-bold text-ea-white focus:border-ea-green focus:outline-none"
                    />
                  </div>
                </div>

                {['e7', 'tou', 'agile'].includes(tariff) && (
                  <div className="rounded-2xl border border-ea-grey/20 bg-ea-black/60 p-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-ea-green">
                        Off-Peak / Night Rate (p/kWh)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={offRate}
                        onChange={(e) => setOffRate(parseFloat(e.target.value) || 0)}
                        className="mt-1.5 w-full rounded-xl border border-ea-green/40 bg-ea-black px-4 py-2.5 text-sm font-bold text-ea-green focus:border-ea-green focus:outline-none"
                      />
                      <p className="mt-1 text-xs text-ea-grey">
                        Allows battery overnight charging to offset higher daytime rates.
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-ea-grey">Tariff Name (optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Octopus Go, Next Drive"
                        value={tariffName}
                        onChange={(e) => setTariffName(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm text-ea-white focus:border-ea-green focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Big Electricity Users (Appliances) */}
              <div className="rounded-3xl border border-ea-grey/25 bg-ea-ink p-6 md:p-8 space-y-4">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-ea-green">
                    3. High-Consumption Appliances
                  </h3>
                  <p className="text-xs text-ea-grey mt-0.5">
                    "Planning to get" adds anticipated demand to size your solar system accurately.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {CONFIG.LOADS.map((load, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-ea-grey/20 bg-ea-black/50 p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-ea-white">
                        <span>{load.name}</span>
                        <span className="text-ea-grey">+{load.kwh.toLocaleString()} kWh/yr</span>
                      </div>
                      <select
                        value={loadsState[idx]}
                        onChange={(e) =>
                          setLoadsState({ ...loadsState, [idx]: e.target.value as any })
                        }
                        className="w-full rounded-lg border border-ea-grey/30 bg-ea-black px-3 py-1.5 text-xs text-ea-white focus:border-ea-green focus:outline-none"
                      >
                        <option value="no">Do not have</option>
                        <option value="have">Already have (in bill)</option>
                        <option value="plan">Planning to get (+{load.kwh} kWh)</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Roof Orientation, Shade & Daytime Occupancy */}
              <div className="rounded-3xl border border-ea-grey/25 bg-ea-ink p-6 md:p-8 space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-ea-green flex items-center gap-2">
                  <Sliders className="h-4 w-4" /> 4. Roof Orientation, Shading & Daily Routine
                </h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="text-xs font-semibold text-ea-grey">Roof Facing Direction</label>
                    <select
                      value={orient}
                      onChange={(e) => setOrient(parseFloat(e.target.value))}
                      className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm text-ea-white focus:border-ea-green focus:outline-none"
                    >
                      <option value="1">South (100% max yield)</option>
                      <option value="0.95">South-East or South-West (95%)</option>
                      <option value="0.85">East & West Split (85%)</option>
                      <option value="0.82">East or West only (82%)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ea-grey">Roof Shading</label>
                    <select
                      value={shade}
                      onChange={(e) => setShade(parseFloat(e.target.value))}
                      className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm text-ea-white focus:border-ea-green focus:outline-none"
                    >
                      <option value="1">None (Full unobstructed sun)</option>
                      <option value="0.9">Some Shading (Nearby tree / chimney)</option>
                      <option value="0.75">Heavy Shading (Significant obstruction)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ea-grey">Daytime Occupancy</label>
                    <select
                      value={occ}
                      onChange={(e) => setOcc(e.target.value as any)}
                      className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm text-ea-white focus:border-ea-green focus:outline-none"
                    >
                      <option value="out">Usually Out (Lower daytime self-consumption)</option>
                      <option value="part">Sometimes Home (Typical hybrid working)</option>
                      <option value="home">Home Most Days (High daytime direct use)</option>
                    </select>
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-xs font-semibold text-red-300 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-full border border-ea-grey/30 px-6 py-3 text-sm font-bold text-ea-white hover:border-ea-grey flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={handleCalculate}
                  className={cn(btn.primary, 'py-3.5 px-8 text-sm')}
                >
                  Calculate My Results <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* =================================================================
             STEP 4: FULL RESULTS & BREAKDOWN
             ================================================================= */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Verdict Card */}
              <div className="rounded-3xl border border-ea-green/40 bg-ea-ink p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ea-grey/20 pb-5">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-ea-green">
                      {mode === 'quote' ? 'Quote Price Verdict' : 'Recommended Specification'}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-ea-white mt-1">
                      {mode === 'quote' ? (
                        <>
                          Quoted Price:{' '}
                          <span className="text-ea-green">{gbp(systemConfig.price)}</span>
                        </>
                      ) : (
                        <>
                          {systemConfig.kWp.toFixed(2)} kWp Solar{' '}
                          {systemConfig.batt > 0 && `+ ${systemConfig.batt} kWh Battery`}
                        </>
                      )}
                    </h2>
                    <p className="text-xs text-ea-grey mt-1">
                      {systemConfig.panels} Panels ({systemConfig.kWp.toFixed(2)} kWp) •{' '}
                      {systemConfig.batt > 0 ? `${systemConfig.batt} kWh Battery • ` : ''}
                      {systemConfig.invKw} kW Inverter • {regionInfo.name}
                    </p>
                  </div>

                  {mode === 'quote' && (
                    <div>
                      {systemConfig.price <= fairRange[0] * 0.9 ? (
                        <span className="rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 px-4 py-1.5 text-xs font-bold inline-block">
                          Cheaper than Usual
                        </span>
                      ) : systemConfig.price <= fairRange[2] ? (
                        <span className="rounded-full bg-ea-green/20 text-ea-green border border-ea-green/40 px-4 py-1.5 text-xs font-bold inline-block">
                          Fair UK Market Price
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-500/20 text-red-300 border border-red-500/40 px-4 py-1.5 text-xs font-bold inline-block">
                          Above Typical Market Rate
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Price Benchmark Range Visualization */}
                <div>
                  <div className="flex justify-between items-baseline text-xs font-semibold text-ea-grey mb-2">
                    <span>UK Fair Market Estimate (MCS averages)</span>
                    <span className="text-ea-white">
                      {gbp(fairRange[0])} — {gbp(fairRange[2])}
                    </span>
                  </div>

                  <div className="relative h-6 w-full rounded-full bg-ea-black border border-ea-grey/30 overflow-hidden flex items-center px-1">
                    <div className="h-3 w-full rounded-full bg-ea-green/20 flex items-center justify-between px-3 text-[10px] font-bold text-ea-green">
                      <span>Low: {gbp(fairRange[0])}</span>
                      <span>Typical: {gbp(fairRange[1])}</span>
                      <span>High: {gbp(fairRange[2])}</span>
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] text-ea-grey">
                    *Independent guide based on typical UK MCS certified installer costs (0% VAT). Excludes
                    unusual structural repairs, slate roofs, or complex cable trenches.
                  </p>
                </div>
              </div>

              {/* 4 Highlight Metric Cards */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div className="rounded-2xl border border-ea-green/40 bg-ea-green/10 p-5">
                  <span className="text-xs font-bold text-ea-green uppercase tracking-wider block">
                    Saved Per Year
                  </span>
                  <p className="mt-2 text-3xl font-extrabold text-ea-green">
                    {gbp(calculation.totalAnnual)}
                  </p>
                  <span className="mt-1 text-xs text-ea-green/80 block">Bills saved + Export income</span>
                </div>

                <div className="rounded-2xl border border-ea-grey/25 bg-ea-ink p-5">
                  <span className="text-xs font-bold text-ea-grey uppercase tracking-wider block">
                    Payback Period
                  </span>
                  <p className="mt-2 text-3xl font-extrabold text-ea-white">
                    {isFinite(calculation.paybackYears)
                      ? calculation.paybackYears < 1
                        ? 'Under 1 yr'
                        : `${calculation.paybackYears.toFixed(1)} yrs`
                      : 'n/a'}
                  </p>
                  <span className="mt-1 text-xs text-ea-grey block">
                    {mode === 'quote' ? 'at your quoted price' : 'at typical UK market price'}
                  </span>
                </div>

                <div className="rounded-2xl border border-ea-grey/25 bg-ea-ink p-5">
                  <span className="text-xs font-bold text-ea-grey uppercase tracking-wider block">
                    25-Year Gain
                  </span>
                  <p className="mt-2 text-3xl font-extrabold text-ea-white">
                    {gbp(calculation.lifetimeReturn)}
                  </p>
                  <span className="mt-1 text-xs text-ea-grey block">
                    Net profit after kit & 1 inverter change
                  </span>
                </div>

                <div className="rounded-2xl border border-ea-grey/25 bg-ea-ink p-5">
                  <span className="text-xs font-bold text-ea-grey uppercase tracking-wider block">
                    Self-Sufficiency
                  </span>
                  <p className="mt-2 text-3xl font-extrabold text-ea-white">
                    {Math.round(calculation.selfShare * 100)}%
                  </p>
                  <span className="mt-1 text-xs text-ea-grey block">Of your total electricity use</span>
                </div>
              </div>

              {/* Energy Breakdown & Warranties */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* 1st Year Energy & Financial Table */}
                <div className="rounded-3xl border border-ea-grey/25 bg-ea-ink p-6 md:p-8 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-ea-green flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" /> 1st Year Performance Breakdown
                  </h3>
                  <div className="divide-y divide-ea-grey/15 text-xs sm:text-sm">
                    <div className="flex justify-between py-2.5">
                      <span className="text-ea-grey">Total Solar Generated</span>
                      <strong className="text-ea-white">{kwhFormat(calculation.gen)}</strong>
                    </div>
                    <div className="flex justify-between py-2.5">
                      <span className="text-ea-grey">Used Straight Away (Daytime)</span>
                      <span className="text-ea-white">{kwhFormat(calculation.direct)}</span>
                    </div>
                    {systemConfig.batt > 0 && (
                      <div className="flex justify-between py-2.5">
                        <span className="text-ea-grey">Stored & Discharged from Battery</span>
                        <span className="text-ea-white">{kwhFormat(calculation.fromBatt)}</span>
                      </div>
                    )}
                    {calculation.shift > 0 && (
                      <div className="flex justify-between py-2.5">
                        <span className="text-ea-grey">Off-Peak Night Charging Shifted</span>
                        <span className="text-ea-white">{kwhFormat(calculation.shift)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2.5">
                      <span className="text-ea-grey">Exported to Grid (SEG payment)</span>
                      <span className="text-ea-white">{kwhFormat(calculation.exported)}</span>
                    </div>
                    <div className="flex justify-between py-2.5">
                      <span className="text-ea-grey">Direct Bill Savings</span>
                      <span className="text-ea-white font-semibold">
                        {gbp(calculation.billSave + calculation.shiftSave)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2.5">
                      <span className="text-ea-grey">Export Income (@ 12p/kWh)</span>
                      <span className="text-ea-white font-semibold">
                        {gbp(calculation.exportInc)}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 text-base font-extrabold border-t border-ea-green/40">
                      <span className="text-ea-green">Total 1st Year Benefit</span>
                      <span className="text-ea-green">{gbp(calculation.totalAnnual)}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-ea-grey pt-2 border-t border-ea-grey/15">
                    Assumptions: {regionInfo.name} irradiation, 0.5% yearly solar degradation, flat
                    tariffs, and 0% VAT.
                  </p>
                </div>

                {/* Warranties & Technical Audit */}
                <div className="rounded-3xl border border-ea-grey/25 bg-ea-ink p-6 md:p-8 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-ea-green flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    {mode === 'quote' ? 'Warranties & Technical Checklist' : 'Key Things to Verify'}
                  </h3>

                  {mode === 'quote' ? (
                    <div className="space-y-4 text-xs">
                      {/* Warranties Table */}
                      <div className="rounded-2xl border border-ea-grey/20 bg-ea-black/60 p-4 divide-y divide-ea-grey/15">
                        {[
                          { label: 'Panels (Product)', val: wPanel, typical: '12-25 yrs' },
                          { label: 'Panels (Performance)', val: wPerf, typical: '25-30 yrs' },
                          { label: 'Inverter', val: wInv, typical: '10 yrs' },
                          { label: 'Battery', val: wBatt, typical: '10 yrs' },
                          { label: 'Workmanship', val: wWork, typical: '2-10 yrs' },
                        ].map((w, idx) => (
                          <div key={idx} className="flex justify-between items-center py-2">
                            <span className="text-ea-grey">{w.label}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-ea-white font-bold">
                                {w.val ? `${w.val} yrs` : 'Not stated'}
                              </span>
                              <span className="text-[11px] text-ea-grey/70">
                                (Std: {w.typical})
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* BOS Inclusions Status */}
                      <div className="pt-2">
                        <span className="font-bold text-ea-white block mb-2">
                          Essential Installation Items Included:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { name: 'Scaffold', ok: bScaffold },
                            { name: 'Roof Mount', ok: bMount },
                            { name: 'Cables', ok: bCable },
                            { name: 'DC Isolators/SPD', ok: bProtect },
                            { name: 'DNO Notification', ok: bDno },
                            { name: 'MCS Certificate', ok: bMcs },
                            { name: 'Monitoring App', ok: bMonitor },
                          ].map((b, i) => (
                            <span
                              key={i}
                              className={cn(
                                'rounded-lg px-2.5 py-1 text-[11px] font-semibold flex items-center gap-1 border',
                                b.ok
                                  ? 'border-ea-green/30 bg-ea-green/10 text-ea-green'
                                  : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                              )}
                            >
                              {b.ok ? <Check className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                              {b.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <ul className="space-y-3 text-xs sm:text-sm text-ea-white/80">
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-ea-green shrink-0 mt-0.5" />
                        <span>Always obtain 2 to 3 like-for-like quotes before deciding.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-ea-green shrink-0 mt-0.5" />
                        <span>
                          Ensure your installer is MCS certified so energy suppliers accept your export
                          payments (SEG).
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-ea-green shrink-0 mt-0.5" />
                        <span>
                          Ask for itemised quotes specifying panel models, battery voltage, and scaffolding.
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-ea-green shrink-0 mt-0.5" />
                        <span>
                          Confirm whether your inverter requires G99 DNO approval (inverters over 3.68 kW on
                          single phase).
                        </span>
                      </li>
                    </ul>
                  )}
                </div>
              </div>

              {/* Recommended Protection Plan Card */}
              <div className="rounded-3xl border border-ea-green/50 bg-gradient-to-r from-ea-ink to-ea-black p-6 md:p-8 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-ea-green">
                      Independent Aftercare Protection
                    </span>
                    <h3 className="text-xl font-extrabold text-ea-white mt-1">
                      Recommended Plan: {calculation.planName} ({calculation.planPrice})
                    </h3>
                    <p className="text-xs text-ea-white/70 mt-1 max-w-xl">{calculation.planReason}</p>
                  </div>
                  <Link
                    to={`/booking-calendar/${calculation.planSlug}`}
                    className={cn(btn.primary, 'py-3 px-6 text-xs whitespace-nowrap font-bold')}
                  >
                    Book {calculation.planName} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Consultation / Second Opinion Lead Form */}
              <div className="rounded-3xl border border-ea-grey/25 bg-ea-ink p-6 md:p-8 space-y-6">
                <div className="max-w-xl">
                  <h3 className="text-xl font-extrabold text-ea-white">
                    {mode === 'quote'
                      ? 'Want an engineer to review your quote for free?'
                      : 'Want quotes from vetted local MCS installers?'}
                  </h3>
                  <p className="mt-1 text-xs text-ea-grey">
                    {mode === 'quote'
                      ? 'Leave your details and our technical team will review your quote line-by-line, free of charge.'
                      : 'We connect you with qualified, reputable local installers and provide ongoing independent aftercare.'}
                  </p>
                </div>

                {leadSent ? (
                  <div className="rounded-2xl border border-ea-green/50 bg-ea-green/10 p-6 text-center space-y-2">
                    <CheckCircle2 className="h-10 w-10 text-ea-green mx-auto" />
                    <h4 className="text-lg font-bold text-ea-white">Thank you, {leadName}!</h4>
                    <p className="text-xs text-ea-white/80">
                      Your results have been received. An Energy Aftercare advisor will be in touch within
                      one working day.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setLeadSent(true);
                    }}
                    className="grid gap-4 sm:grid-cols-2"
                  >
                    <div>
                      <label className="text-xs font-semibold text-ea-grey">Your Name</label>
                      <input
                        type="text"
                        required
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        placeholder="John Doe"
                        className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm text-ea-white focus:border-ea-green focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-ea-grey">Email Address</label>
                      <input
                        type="email"
                        required
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm text-ea-white focus:border-ea-green focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-ea-grey">Phone Number (optional)</label>
                      <input
                        type="tel"
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        placeholder="07123 456789"
                        className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm text-ea-white focus:border-ea-green focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-ea-grey">How can we help?</label>
                      <select
                        value={leadWant}
                        onChange={(e) => setLeadWant(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-ea-grey/30 bg-ea-black px-4 py-2.5 text-sm text-ea-white focus:border-ea-green focus:outline-none"
                      >
                        <option>A second opinion on my quote</option>
                        <option>Quotes from vetted local installers</option>
                        <option>Annual aftercare and maintenance</option>
                        <option>Just email me these calculations</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2 pt-2">
                      <label className="flex items-center gap-3 text-xs text-ea-grey cursor-pointer">
                        <input
                          type="checkbox"
                          checked={leadConsent}
                          onChange={(e) => setLeadConsent(e.target.checked)}
                          className="h-4 w-4 accent-ea-green rounded"
                        />
                        <span>
                          I agree to be contacted by Energy Aftercare regarding this calculation.
                        </span>
                      </label>
                    </div>

                    <div className="sm:col-span-2 pt-2">
                      <button type="submit" className={cn(btn.primary, 'py-3 px-8 text-sm font-bold')}>
                        Send My Details <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Bottom Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-ea-grey/15">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="rounded-full border border-ea-grey/30 px-6 py-3 text-sm font-bold text-ea-white hover:border-ea-grey flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Edit Home & Tariff
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setLeadSent(false);
                  }}
                  className="rounded-full border border-ea-grey/30 px-6 py-3 text-sm font-bold text-ea-grey hover:text-ea-white hover:border-ea-grey flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" /> Start Over
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Quote Text Paste Modal */}
      {pasteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ea-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl border border-ea-green/40 bg-ea-ink p-6 space-y-4">
            <h3 className="text-lg font-bold text-ea-white">Paste Installer Quote Text</h3>
            <p className="text-xs text-ea-grey">
              Paste the text from your quote PDF, email, or estimate. We'll automatically extract panel
              counts, battery capacity, inverter size, and total cost.
            </p>
            <textarea
              rows={8}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="e.g. 10 x Aiko 440W solar modules, GivEnergy 9.5kWh battery storage, Solis 5kW hybrid inverter, scaffolding included, total price £10,500..."
              className="w-full rounded-2xl border border-ea-grey/30 bg-ea-black p-4 text-xs text-ea-white focus:border-ea-green focus:outline-none"
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPasteModalOpen(false)}
                className="rounded-full border border-ea-grey/30 px-5 py-2 text-xs font-bold text-ea-grey hover:text-ea-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  parseDocumentText(pastedText);
                  setPasteModalOpen(false);
                }}
                className={cn(btn.primary, 'py-2 px-6 text-xs font-bold')}
              >
                Extract Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
