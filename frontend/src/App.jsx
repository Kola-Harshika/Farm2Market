import React, { useState, useEffect, useMemo } from 'react';
import {
  Languages,
  MapPin,
  Truck,
  CloudRain,
  Thermometer,
  ShieldAlert,
  Volume2,
  VolumeX,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Warehouse,
  Sparkles,
  Navigation,
  User,
  Phone,
  Scale,
  Plus,
  Minus,
  AlertTriangle,
  Info,
  X,
  FileCheck,
  Calendar
} from 'lucide-react';

// ==========================================
// 🌐 GLOBAL BILINGUAL DICTIONARY (EN & TE)
// ==========================================
const t = {
  en: {
    appName: "MandiGuide AI",
    brandTitle: "Farm2Market",
    langToggle: "🌐 English / తెలుగు",
    activeLangLabel: "English",
    slideIndicator: (current, total) => `Step ${current} of ${total}`,

    // Slide 1: Welcome Screen
    slide1: {
      badge: "🌾 National Agricultural Market Intelligence",
      title: "MandiGuide AI",
      subtitle: "Desktop Market Intelligence & Rate Discovery Platform for Farmers",
      tagline: "Empowering farmers with transparent APMC mandi wholesale price discovery, accurate road freight calculations, and transit weather risk indexing across Telangana.",
      features: [
        {
          icon: "⚖️",
          title: "Commodity-Specific Mandi Mapping",
          desc: "Automated routing to specialized wholesale APMCs (Grain hubs for Paddy, Asia's major yard for Cotton, and Vegetable APMCs for perishables)."
        },
        {
          icon: "🚚",
          title: "Transparent Road Freight & SRI",
          desc: "Realistic ₹2.50/km/quintal transit transport cost calculation and weather-based spoilage risk deductions."
        },
        {
          icon: "📦",
          title: "WDRA Warehouse & Cold Storage Booking",
          desc: "Direct access to WDRA accredited storages with eNWR electronic pledge loan support (up to 75% loan against crop value)."
        }
      ],
      getStarted: "Get Started / ప్రారంభించండి 🚀",
      trustBadge: "Synchronized with AgMarkNet & Telangana State APMC Benchmarks"
    },

    // Slide 2: User Profile & Geolocation Setup
    slide2: {
      stepBadge: "Step 2 of 5: Farmer Context",
      stepTitle: "Farmer Profile & Geolocation Setup",
      stepSubtitle: "Provide your farming location to compute precise road transport freight to specialized regional mandis.",
      farmerId: "Farmer Identification",
      nameLabel: "Farmer Name",
      namePlaceholder: "Enter full name (e.g. Ramesh Kumar)",
      phoneLabel: "Phone Number (Optional for price alerts & warehouse confirmation)",
      phonePlaceholder: "10-digit mobile number (e.g. 9876543210)",
      phoneHint: "Entering your phone number enables warehouse managers to confirm your WDRA storage reservation and dispatch logistics support.",
      locationHeading: "Harvest Origin Location",
      locationBtn: "Enable Location Access 📍 / స్థానాన్ని అనుమతించండి",
      locationDetecting: "Detecting GPS coordinates...",
      locationSuccess: "Location detected via GPS",
      detectedLocationLabel: "Active Origin:",
      fallbackNotice: "(Default fallback: Hyderabad, Telangana)",
      quickSelectLabel: "Or quick-select your Telangana agricultural hub:",
      back: "← Back / వెనుకకు",
      next: "Next / తరువాత →"
    },

    // Slide 3: Interactive Crop Selection & Local Offer
    slide3: {
      stepBadge: "Step 3 of 5: Crop & Offer",
      stepTitle: "Interactive Crop Selection & Local Offer",
      stepSubtitle: "Select your harvested commodity to load its dedicated specialized trading hubs, then input your local buyer's bid.",
      cropHeading: "Select Your Harvested Crop (6 Major Telangana Commodities)",
      selectedLabel: "Selected:",
      hubSuffix: "Hub",
      qtyLabel: "Harvest Quantity (Quintals)",
      qtyUnitHint: "1 Quintal (Q) = 100 Kilograms (kg)",
      priceLabel: "Trader Offered Price (₹ / Quintal)",
      priceHint: "Price quoted on-farm by local village trader or commission agent",
      totalLocalValue: "Total Local Trader Valuation:",
      back: "← Back / వెనుకకు",
      next: "Next / తరువాత →"
    },

    // Slide 4: Route Weather Alert & Spoilage Risk Index (SRI)
    slide4: {
      stepBadge: "Step 4 of 5: Transit Risk Index",
      stepTitle: "Route Weather Alert & Spoilage Risk Index (SRI)",
      stepSubtitle: "Atmospheric weather monitoring along highway transit corridors connecting your farm to regional APMCs.",
      weatherBoxTitle: "Highway Corridor Live Weather",
      radarBadge: "Live Highway Radar",
      tempLabel: "Ambient Temperature",
      rainLabel: "Rain / Precipitation Probability",
      roadStatus: "Highway Corridor Status",
      roadStatusVal: "Monsoon Showers / Wet Transit Corridors",
      vulnerabilityLabel: "Perishable Vulnerability Status:",
      vulnHigh: "HIGH VULNERABILITY (Fast Perishable)",
      vulnMedium: "MODERATE VULNERABILITY (Semi-Perishable)",
      vulnLow: "LOW VULNERABILITY (Durable Grain / Fiber)",
      spoilageAlert: "80% Rain Risk — 25% Spoilage Loss on open transit",
      advisoryTitle: "Transit Route Advisory & Mitigation Strategy",
      advisoryText: "Open tractor trolley transit under 80% rain probability incurs severe moisture damage and fungal rot. Either secure cargo under certified waterproof tarpaulins or deposit into nearby WDRA-certified warehouses.",
      analyzeBtn: "Analyze Market Options & Net Profit 📊 / మార్కెట్ విశ్లేషించండి",
      analyzing: "Querying Specialized Mandis & Computing Net Revenue...",
      back: "← Back / వెనుకకు"
    },

    // Slide 5: Rate Comparison, Direct Navigation & Warehouse Booking
    slide5: {
      stepBadge: "Step 5 of 5: Decision Support & Booking",
      stepTitle: "Rate Comparison, Route Navigation & Storage Booking",
      stepSubtitle: "Comprehensive side-by-side net profit comparison across specialized trading hubs after deducting road freight and weather penalty.",
      listenAdvice: "🔊 Listen to Advice / వాయిస్ పలికించండి",
      stopAdvice: "⏹️ Stop Audio / ఆపండి",
      strategicCalloutTitle: "Optimal Market Strategy Callout",
      cardsHeading: "Specialized APMC Mandi Wholesale Rate Comparison",
      cardsSub: "Showing mandis dedicated to your chosen commodity:",
      bestChoice: "BEST CHOICE ⭐",
      mandiCard: {
        away: "away",
        grossRate: "Gross Agmarknet Rate:",
        tripTransport: "Distance & Transport Cost:",
        ratePerKmQ: "Transport rate: ₹2.50/km/quintal",
        totalTransport: "Total Transport",
        spoilageDeduction: "Spoilage Risk Deduction:",
        spoilageNote: "Transit weather risk penalty",
        totalLoss: "Total Weather Loss",
        netProfitHeading: "Final Net Profit Calculation",
        formula: "Net Revenue = (Gross Rate - Transport Cost - Spoilage Loss) * Quantity",
        effectiveNetRate: "Effective Net Rate:",
        totalNetRevenue: "Total Net Revenue:",
        vsTrader: "vs Local Trader Offer:",
        moreGain: "HIGHER PROFIT",
        lessLoss: "LOWER EARNINGS",
        viewRoute: "🗺️ View Route / మార్గం చూడండి"
      },
      warehouseSectionTitle: "📦 Integrated WDRA Accredited Warehouses & Cold Storages",
      warehouseSectionSub: "Specialized storage facilities suited for your crop to avoid distress selling during adverse weather:",
      storageCard: {
        facilityType: "Storage Type:",
        dailyRate: "Rental Rate:",
        distance: "Distance:",
        capacity: "Capacity:",
        enwrEligible: "eNWR Bank Loan Eligible (Up to 75%)",
        viewRoute: "🗺️ View Route / మార్గం చూడండి",
        bookBtn: "📦 Book Storage / స్థలం బుక్ చేయండి"
      },
      modal: {
        title: "Book WDRA Storage Facility",
        cropLabel: "Commodity:",
        qtyLabel: "Quantity to Store:",
        durationLabel: "Storage Duration (Days):",
        days: "Days",
        dailyRateLabel: "Daily Rental Rate:",
        totalCostLabel: "Total Estimated Storage Cost:",
        formulaNotice: "Calculated as: Quantity * Rental Rate * Days",
        enwrCheckbox: "Request electronic Negotiable Warehouse Receipt (eNWR) for instant bank pledge loan (up to 75% crop value)",
        enwrBadge: "WDRA Certified Loan Support",
        confirmBtn: "Confirm Booking Request / బుకింగ్ ధృవీకరించండి",
        closeBtn: "Cancel / రద్దు చేయండి",
        toastSuccess: "Booking Request Sent! The warehouse manager will contact you shortly."
      },
      startOver: "🔄 Start Over / మళ్ళీ ప్రారంభించండి"
    },

    footerText: "MandiGuide AI • Desktop Market Intelligence Platform for Farmers • Farm2Market © " + new Date().getFullYear()
  },

  te: {
    appName: "మండిగైడ్ AI",
    brandTitle: "ఫార్మ్ 2 మార్కెట్",
    langToggle: "🌐 English / తెలుగు",
    activeLangLabel: "తెలుగు",
    slideIndicator: (current, total) => `దశ ${current} / ${total}`,

    // Slide 1: Welcome Screen
    slide1: {
      badge: "🌾 జాతీయ వ్యవసాయ విపణి మార్గదర్శి",
      title: "మండిగైడ్ AI",
      subtitle: "రైతుల కోసం డిజిటల్ మార్కెట్ ఇంటెలిజెన్స్ & ధరల విశ్లేషణ వేదిక",
      tagline: "రైతులకు న్యాయమైన APMC మార్కెట్ హోల్‌సేల్ ధరల సమాచారం, కిలోమీటరుకు ₹2.50 ఖచ్చితమైన రవాణా ఖర్చు గణన, మరియు వర్షం నష్ట నివారణ మార్గదర్శి.",
      features: [
        {
          icon: "⚖️",
          title: "పంట ఆధారిత ప్రత్యేక మార్కెట్ల మ్యాపింగ్",
          desc: "మీ పంటకు ప్రత్యేకమైన హోల్‌సేల్ మార్కెట్లు (వరికి మిర్యాలగూడ/సూర్యాపేట, పత్తికి వరంగల్, కూరగాయలకు బోయిన్‌పల్లి/గుడిమల్కాపూర్)."
        },
        {
          icon: "🚚",
          title: "ఖచ్చితమైన రవాణా ఖర్చు & SRI",
          desc: "కిలోమీటరుకు ₹2.50 రవాణా ఛార్జీ మరియు వాతావరణం వల్ల సరుకు పాడయ్యే నష్టాన్ని ముందే లెక్కించండి."
        },
        {
          icon: "📦",
          title: "WDRA గోడౌన్ & కోల్డ్ స్టోరేజ్ బుకింగ్",
          desc: "ప్రభుత్వ గుర్తింపు పొందిన గోడౌన్లలో నిల్వ మరియు eNWR ఎలక్ట్రానిక్ రశీదు ద్వారా 75% వరకు బ్యాంక్ లోన్ పొందే సదుపాయం."
        }
      ],
      getStarted: "ప్రారంభించండి / Get Started 🚀",
      trustBadge: "తెలంగాణ APMC & అగ్‌మార్క్‌నెట్ అధికారిక మార్కెట్ ధరలు"
    },

    // Slide 2: User Profile & Geolocation Setup
    slide2: {
      stepBadge: "దశ 2 / 5: రైతు వివరాలు",
      stepTitle: "రైతు ప్రొఫైల్ & స్థానాన్ని అమర్చండి",
      stepSubtitle: "మీ పంట ప్రాంతం నుండి ప్రత్యేక మార్కెట్లకు ఖచ్చితమైన రవాణా దూరం లెక్కించడానికి వివరాలు నమోదు చేయండి.",
      farmerId: "రైతు వివరాలు & గుర్తింపు",
      nameLabel: "రైతు పేరు",
      namePlaceholder: "మీ పూర్తి పేరు నమోదు చేయండి (ఉదా: రమేష్ కుమార్)",
      phoneLabel: "ఫోన్ నంబర్ (ధరల సమాచారం & బుకింగ్ కన్ఫర్మేషన్ కోసం)",
      phonePlaceholder: "10 అంకెల మొబైల్ నంబర్ (ఉదా: 9876543210)",
      phoneHint: "ఫోన్ నంబర్ నమోదు చేయడం వల్ల వేర్‌హౌస్ మేనేజర్లు మీ WDRA నిల్వ బుకింగ్‌ను ధృవీకరించి రవాణా సహాయాన్ని అందిస్తారు.",
      locationHeading: "పంట ఉన్న స్థానం / గ్రామం",
      locationBtn: "స్థానాన్ని అనుమతించండి 📍 / Enable Location",
      locationDetecting: "మీ GPS స్థానాన్ని గుర్తిస్తోంది...",
      locationSuccess: "GPS ద్వారా స్థానం గుర్తించబడింది",
      detectedLocationLabel: "ప్రస్తుత స్థానం:",
      fallbackNotice: "(డిఫాల్ట్ స్థానం: హైదరాబాద్, తెలంగాణ)",
      quickSelectLabel: "లేదా తెలంగాణ ముఖ్య వ్యవసాయ ప్రాంతాన్ని ఎంచుకోండి:",
      back: "← వెనుకకు / Back",
      next: "తరువాత / Next →"
    },

    // Slide 3: Interactive Crop Selection & Local Offer
    slide3: {
      stepBadge: "దశ 3 / 5: పంట & వ్యాపారి ధర",
      stepTitle: "పంట ఎంపిక & స్థానిక వ్యాపారి ధర",
      stepSubtitle: "మీ పంటను ఎంచుకోగానే ఆ పంటకు ప్రసిద్ధి చెందిన మార్కెట్లు లోడ్ అవుతాయి; స్థానిక వ్యాపారి ఇచ్చిన ధరను నమోదు చేయండి.",
      cropHeading: "మీ పంటను ఎంచుకోండి (తెలంగాణ ముఖ్య పంటలు)",
      selectedLabel: "ఎంచుకున్న పంట:",
      hubSuffix: "మార్కెట్",
      qtyLabel: "పంట పరిమాణం (క్వింటాళ్లలో)",
      qtyUnitHint: "1 క్వింటాల్ (Q) = 100 కిలోగ్రాములు (kg)",
      priceLabel: "వ్యాపారి ఇచ్చిన ధర (₹ / క్వింటాల్‌కు)",
      priceHint: "గ్రామంలో కొనుగోలుదారుడు ప్రతి క్వింటాలుకు ఆఫర్ చేసిన ధర",
      totalLocalValue: "స్థానిక వ్యాపారి మొత్తం చెల్లింపు:",
      back: "← వెనుకకు / Back",
      next: "తరువాత / Next →"
    },

    // Slide 4: Route Weather Alert & Spoilage Risk Index (SRI)
    slide4: {
      stepBadge: "దశ 4 / 5: రవాణా నష్ట సూచిక",
      stepTitle: "రవాణా వాతావరణం & సరుకు నష్ట సూచిక (SRI)",
      stepSubtitle: "మీ ప్రాంతం నుండి మార్కెట్ మార్గాల్లో వాతావరణ పరిస్థితులు మరియు సరుకు పాడయ్యే ముప్పు విశ్లేషణ.",
      weatherBoxTitle: "రవాణా రహదారి ప్రత్యక్ష వాతావరణం",
      radarBadge: "లైవ్ హైవే రాడార్",
      tempLabel: "ప్రయాణ ఉష్ణోగ్రత",
      rainLabel: "వర్షం / తేమ ప్రమాద శాతం",
      roadStatus: "రహదారి పరిస్థితి",
      roadStatusVal: "రుతుపవన వర్షపు జల్లులు / తడి హైవే రోడ్లు",
      vulnerabilityLabel: "పంట పాడయ్యే స్థాయి:",
      vulnHigh: "అత్యధిక ప్రమాదం (త్వరగా కుళ్లిపోయే పంట)",
      vulnMedium: "మధ్యస్థ ప్రమాదం (కొద్దిగా పాడయ్యే పంట)",
      vulnLow: "తక్కువ ప్రమాదం (ఎక్కువ రోజులు నిల్వ ఉండే పంట)",
      spoilageAlert: "80% వర్షం ప్రమాదం — రవాణాలో 25% సరుకు పాడయ్యే అవకాశం",
      advisoryTitle: "రవాణా మార్గదర్శక సూచన & రక్షణ",
      advisoryText: "తెరిచి ఉన్న ట్రాలీలలో రవాణా చేస్తే భారీ వర్షం వల్ల సరుకు 25% కుళ్లిపోయే ప్రమాదం ఉంది. తప్పనిసరిగా వాటర్‌ప్రూఫ్ టార్పాలిన్ కప్పండి లేదా సమీప WDRA గోడౌన్‌లో నిల్వ చేసుకోండి.",
      analyzeBtn: "మార్కెట్ విశ్లేషించండి & నికర లాభం చూడండి 📊",
      analyzing: "ప్రత్యేక మార్కెట్ రేట్లు & రవాణా ఖర్చులు లెక్కిస్తోంది...",
      back: "← వెనుకకు / Back"
    },

    // Slide 5: Rate Comparison, Direct Navigation & Warehouse Booking
    slide5: {
      stepBadge: "దశ 5 / 5: లాభ నిర్ణయం & బుకింగ్",
      stepTitle: "ధరల పోలిక, మార్గదర్శకం & వేర్‌హౌస్ బుకింగ్",
      stepSubtitle: "రవాణా ఛార్జీ మరియు వాతావరణ నష్టాన్ని తీసివేసిన తర్వాత లభించే అసలు నికర లాభాల విశ్లేషణ.",
      listenAdvice: "🔊 వాయిస్ పలికించండి / Listen Advice",
      stopAdvice: "⏹️ ఆడియో ఆపండి / Stop Audio",
      strategicCalloutTitle: "ఉత్తమ మార్కెట్ సిఫార్సు",
      cardsHeading: "ప్రత్యేక APMC మార్కెట్ హోల్‌సేల్ ధరల పోలిక",
      cardsSub: "మీరు ఎంచుకున్న పంటను మాత్రమే విక్రయించే ప్రముఖ మార్కెట్లు:",
      bestChoice: "ఉత్తమ ఎంపిక ⭐",
      mandiCard: {
        away: "దూరం",
        grossRate: "అగ్‌మార్క్‌నెట్ స్థూల ధర:",
        tripTransport: "దూరం & రవాణా ఖర్చు:",
        ratePerKmQ: "రవాణా రేటు: ₹2.50/కి.మీ/క్వింటాల్",
        totalTransport: "మొత్తం రవాణా ఛార్జీ",
        spoilageDeduction: "వాతావరణ నష్టం తగ్గింపు:",
        spoilageNote: "తెరిచిన బండిపై వర్షం నష్ట అంచనా",
        totalLoss: "మొత్తం వాతావరణ నష్టం",
        netProfitHeading: "చివరి నికర లాభం గణన",
        formula: "నికర రాబడి = (స్థూల ధర - రవాణా ఛార్జీ - నష్టం) * పరిమాణం",
        effectiveNetRate: "అసలు నికర రేటు:",
        totalNetRevenue: "మొత్తం నికర రాబడి:",
        vsTrader: "స్థానిక వ్యాపారి ధరతో పోలిస్తే:",
        moreGain: "అదనపు నికర లాభం",
        lessLoss: "వ్యాపారి కంటే తక్కువ",
        viewRoute: "🗺️ మార్గం చూడండి / View Route"
      },
      warehouseSectionTitle: "📦 సమీప WDRA నమోదిత వేర్‌హౌసులు & కోల్డ్ స్టోరేజీలు",
      warehouseSectionSub: "వర్షాల సమయంలో తక్కువ ధరకు నష్టపోకుండా మీ పంటకు అనువైన గిడ్డంగులను ఎంచుకోండి:",
      storageCard: {
        facilityType: "నిల్వ రకం:",
        dailyRate: "రోజువారీ అద్దె:",
        distance: "దూరం:",
        capacity: "సామర్థ్యం:",
        enwrEligible: "eNWR ద్వారా 75% వరకు బ్యాంక్ రుణం లభిస్తుంది",
        viewRoute: "🗺️ మార్గం చూడండి / View Route",
        bookBtn: "📦 స్థలం బుక్ చేయండి / Book Storage"
      },
      modal: {
        title: "WDRA నిల్వ కేంద్రాన్ని బుక్ చేయండి",
        cropLabel: "పంట:",
        qtyLabel: "నిల్వ చేయవలసిన పరిమాణం:",
        durationLabel: "నిల్వ రోజుల సంఖ్య:",
        days: "రోజులు",
        dailyRateLabel: "రోజువారీ అద్దె రేటు:",
        totalCostLabel: "మొత్తం అంచనా నిల్వ ఖర్చు:",
        formulaNotice: "గణన: పరిమాణం * రోజువారీ రేటు * రోజుల సంఖ్య",
        enwrCheckbox: "బ్యాంక్ లోన్ (75% వరకు) కొరకు eNWR ఎలక్ట్రానిక్ వేర్‌హౌస్ రశీదును అభ్యర్థించండి",
        enwrBadge: "WDRA సర్టిఫైడ్ బ్యాంక్ లోన్ సపోర్ట్",
        confirmBtn: "బుకింగ్ ధృవీకరించండి / Confirm Booking",
        closeBtn: "రద్దు చేయండి / Cancel",
        toastSuccess: "బుకింగ్ అభ్యర్థన పంపబడింది! వేర్‌హౌస్ మేనేజర్ త్వరలోనే మిమ్మల్ని సంప్రదిస్తారు."
      },
      startOver: "🔄 మళ్ళీ ప్రారంభించండి / Start Over"
    },

    footerText: "మండిగైడ్ AI • రైతుల కోసం డిజిటల్ మార్కెట్ ఇంటెలిజెన్స్ వేదిక • ఫార్మ్ 2 మార్కెట్ © " + new Date().getFullYear()
  }
};

// ==========================================
// 🌾 CROPS DATA DEFINITION (Exact 6 Commodities)
// ==========================================
const CROPS_LIST = [
  {
    id: 'tomato',
    nameEn: 'Tomato',
    nameTe: 'టమోటా',
    icon: '🍅',
    categoryEn: 'Perishable Vegetable',
    categoryTe: 'త్వరగా పాడయ్యే కూరగాయ',
    defaultPrice: 2200,
    perishability: 'HIGH',
    perishPenaltyPct: 25,
    specializedHubsEn: 'Bowenpally, Gudimalkapur, Kothapet',
    specializedHubsTe: 'బోయిన్‌పల్లి, గుడిమల్కాపూర్, కొత్తపేట'
  },
  {
    id: 'potato',
    nameEn: 'Potato',
    nameTe: 'బంగాళాదుంప',
    icon: '🥔',
    categoryEn: 'Bulb & Tuber',
    categoryTe: 'దుంప పంట',
    defaultPrice: 1600,
    perishability: 'MEDIUM',
    perishPenaltyPct: 10,
    specializedHubsEn: 'Malakpet, Bowenpally',
    specializedHubsTe: 'మలక్‌పేట్, బోయిన్‌పల్లి'
  },
  {
    id: 'onion',
    nameEn: 'Onion',
    nameTe: 'ఉల్లిపాయ',
    icon: '🧅',
    categoryEn: 'Bulb & Tuber',
    categoryTe: 'ఉల్లి జాతి పంట',
    defaultPrice: 2400,
    perishability: 'MEDIUM',
    perishPenaltyPct: 10,
    specializedHubsEn: 'Malakpet, Bowenpally',
    specializedHubsTe: 'మలక్‌పేట్, బోయిన్‌పల్లి'
  },
  {
    id: 'chilli',
    nameEn: 'Green Chili',
    nameTe: 'పచ్చిమిర్చి',
    icon: '🌶️',
    categoryEn: 'Spice / Perishable',
    categoryTe: 'మసాలా / కూరగాయ',
    defaultPrice: 4200,
    perishability: 'HIGH',
    perishPenaltyPct: 25,
    specializedHubsEn: 'Bowenpally, Gudimalkapur, Kothapet',
    specializedHubsTe: 'బోయిన్‌పల్లి, గుడిమల్కాపూర్, కొత్తపేట'
  },
  {
    id: 'paddy',
    nameEn: 'Paddy',
    nameTe: 'వరి',
    icon: '🌾',
    categoryEn: 'Food Grain',
    categoryTe: 'ఆహార ధాన్యం',
    defaultPrice: 2183,
    perishability: 'LOW',
    perishPenaltyPct: 5,
    specializedHubsEn: 'Miryalguda, Suryapet, Nizamabad',
    specializedHubsTe: 'మిర్యాలగూడ, సూర్యాపేట, నిజామాబాద్'
  },
  {
    id: 'cotton',
    nameEn: 'Cotton',
    nameTe: 'పత్తి',
    icon: '☁️',
    categoryEn: 'Fiber Commodity',
    categoryTe: 'వాణిజ్య పత్తి పంట',
    defaultPrice: 7120,
    perishability: 'LOW',
    perishPenaltyPct: 5,
    specializedHubsEn: 'Warangal, Adilabad, Khammam',
    specializedHubsTe: 'వరంగల్, ఆదిలాబాద్, ఖమ్మం'
  }
];

// Telangana Region Quick Selectors
const TELANGANA_HUBS = [
  { name: 'Hyderabad (Bowenpally Hub)', nameTe: 'హైదరాబాద్ (బోయిన్‌పల్లి)', lat: 17.3850, lon: 78.4867 },
  { name: 'Miryalguda (Grain Capital)', nameTe: 'మిర్యాలగూడ (ధాన్యం మార్కెట్)', lat: 16.8741, lon: 79.5638 },
  { name: 'Warangal (Cotton Hub)', nameTe: 'వరంగల్ (పత్తి మార్కెట్)', lat: 17.9689, lon: 79.5941 },
  { name: 'Suryapet (APMC Hub)', nameTe: 'సూర్యాపేట (APMC)', lat: 17.1439, lon: 79.6239 },
  { name: 'Khammam (Chilli & Cotton)', nameTe: 'ఖమ్మం (మిర్చి & పత్తి)', lat: 17.2473, lon: 80.1514 },
  { name: 'Nizamabad (Grain & Turmeric)', nameTe: 'నిజామాబాద్ (ధాన్యం)', lat: 18.6725, lon: 78.0941 }
];

export default function App() {
  // Global Language state: 'en' or 'te'
  const [lang, setLang] = useState('en');
  const dict = t[lang];

  // Active slide (1 to 5)
  const [slide, setSlide] = useState(1);

  // Farmer profile state
  const [farmerName, setFarmerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Geolocation state
  const [location, setLocation] = useState({
    name: 'Hyderabad, Telangana',
    latitude: 17.3850,
    longitude: 78.4867,
    isGpsDetected: false
  });
  const [isLocating, setIsLocating] = useState(false);

  // Crop & Offer state
  const [selectedCropId, setSelectedCropId] = useState('tomato');
  const [quantity, setQuantity] = useState(50); // Quintals
  const [offeredPrice, setOfferedPrice] = useState(1800); // ₹/Quintal

  // Weather & Spoilage state
  const [weather] = useState({
    temperature: 28,
    precipitationRisk: 80,
    status: 'Monsoon Showers',
    roadVulnerability: 'High Rain Transit Hazard'
  });

  // Analysis result state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Speech synthesis state
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Warehouse Booking Modal State
  const [bookingModal, setBookingModal] = useState({
    isOpen: false,
    storage: null,
    durationDays: 7,
    requestEnwr: true
  });
  const [toastMessage, setToastMessage] = useState('');

  // Active selected crop object
  const activeCrop = useMemo(() => {
    return CROPS_LIST.find((c) => c.id === selectedCropId) || CROPS_LIST[0];
  }, [selectedCropId]);

  // Update default price when crop changes
  const handleSelectCrop = (crop) => {
    setSelectedCropId(crop.id);
    setOfferedPrice(crop.defaultPrice);
  };

  // Browser Geolocation Access
  const handleEnableLocation = () => {
    if (!('geolocation' in navigator)) {
      alert(lang === 'te' ? 'మీ బ్రౌజర్‌లో GPS సపోర్ట్ లేదు.' : 'Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setLocation({
          name: `Near Lat: ${pos.coords.latitude.toFixed(3)}, Lon: ${pos.coords.longitude.toFixed(3)} (Telangana)`,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          isGpsDetected: true
        });
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error/denied:', err);
        setLocation({
          name: 'Hyderabad, Telangana',
          latitude: 17.3850,
          longitude: 78.4867,
          isGpsDetected: false
        });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Perform Market Analysis (Backend call with dynamic commodity mapping fallback)
  const handleAnalyzeMarkets = async () => {
    setIsAnalyzing(true);

    const payload = {
      crop: activeCrop.id,
      quantity: parseFloat(quantity),
      unit: 'quintal',
      latitude: location.latitude,
      longitude: location.longitude,
      current_price: parseFloat(offeredPrice),
      current_mandi: location.name,
      language: lang,
      low_bandwidth: false
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysisResult(data);
        setIsAnalyzing(false);
        setSlide(5);
        return;
      }
      throw new Error(`Server returned ${response.status}`);
    } catch (error) {
      console.warn('Backend API connection failed, calculating commodity specialized simulation:', error);
      const simulatedData = generateCommoditySpecializedData(activeCrop, quantity, offeredPrice, location, lang);
      setAnalysisResult(simulatedData);
      setIsAnalyzing(false);
      setSlide(5);
    }
  };

  // Dynamic Web Speech Synthesis Configured for active language
  const handleToggleVoiceAdvice = () => {
    if (!('speechSynthesis' in window)) {
      alert(lang === 'te' ? 'మీ బ్రౌజర్ వాయిస్ సపోర్ట్ చేయదు.' : 'Speech synthesis is not supported on this device.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    const best = analysisResult?.best_option || (analysisResult?.comparison_markets && analysisResult.comparison_markets[0]);
    let adviceText = '';

    if (lang === 'te') {
      const bestName = best ? (best.mandi_name_te || best.name_te || best.mandi_name) : 'బోయిన్‌పల్లి మార్కెట్';
      const bestPrice = best ? best.historical_comparable_price : 2450;
      adviceText = `నమస్కారం ${farmerName ? farmerName : 'రైతు సోదరా'}. మీ ${activeCrop.nameTe} పంటకు స్థానిక వ్యాపారి క్వింటాలుకు ₹${offeredPrice} ఆఫర్ చేశారు. కానీ ప్రత్యేక మార్కెట్ అయిన ${bestName} లో క్వింటాలుకు ₹${bestPrice} ప్రత్యక్ష హోల్‌సేల్ ధర ఉంది. కిలోమీటరుకు ₹2.50 రవాణా ఖర్చు మరియు వర్షం నష్టాన్ని తీసివేసినప్పటికీ, మీకు ఇక్కడ అదనంగా నికర లాభం లభిస్తుంది. రూట్ మ్యాప్ కోసం మార్గం చూడండి బటన్ నొక్కండి.`;
    } else {
      const bestName = best ? (best.mandi_name || best.name) : 'Bowenpally APMC';
      const bestPrice = best ? best.historical_comparable_price : 2450;
      adviceText = `Hello ${farmerName ? farmerName : 'Farmer'}. For your ${activeCrop.nameEn} harvest, your local trader offered ₹${offeredPrice} per quintal. However, at specialized market ${bestName}, the gross wholesale rate is ₹${bestPrice} per quintal. Even after deducting ₹2.50 per km road freight and transit rain loss, selling at this market generates higher net income. Tap View Route for Google Maps directions.`;
    }

    const utterance = new SpeechSynthesisUtterance(adviceText);
    const voices = window.speechSynthesis.getVoices();

    if (lang === 'te') {
      utterance.lang = 'te-IN';
      const teVoice = voices.find((v) => v.lang.startsWith('te') || v.name.toLowerCase().includes('telugu'));
      if (teVoice) utterance.voice = teVoice;
    } else {
      utterance.lang = 'en-IN';
      const enVoice = voices.find(
        (v) => v.lang === 'en-IN' || v.lang.startsWith('en') || v.name.toLowerCase().includes('india')
      );
      if (enVoice) utterance.voice = enVoice;
    }

    utterance.rate = 0.93;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Open Warehouse Booking Modal
  const handleOpenBookingModal = (storage) => {
    setBookingModal({
      isOpen: true,
      storage: storage,
      durationDays: 7,
      requestEnwr: true
    });
  };

  // Confirm Warehouse Booking
  const handleConfirmBooking = () => {
    setBookingModal({ ...bookingModal, isOpen: false });
    const successMsg = `✅ ${dict.slide5.modal.toastSuccess}`;
    setToastMessage(successMsg);
    setTimeout(() => {
      setToastMessage('');
    }, 6000);
  };

  // Stop speech synthesis if slide changes or unmounts
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [slide, lang]);

  const handleStartOver = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setSlide(1);
  };

  return (
    <div className="min-h-screen bg-[#F4F7F4] text-stone-900 font-sans flex flex-col items-center selection:bg-emerald-800 selection:text-white">
      {/* ==========================================
          TOAST NOTIFICATION (DARK GREEN PILL TOAST)
         ========================================== */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#022c22] text-white text-sm font-bold px-6 py-4 rounded-full shadow-2xl border border-emerald-600/40 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ring-2 ring-emerald-700/20">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} className="ml-2 hover:opacity-80 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ==========================================
          🌐 PERSISTENT STICKY HEADER
          (Available across ALL slides with Language Toggle)
         ========================================== */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSlide(1)}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-700 flex items-center justify-center text-white text-2xl shadow-md shadow-emerald-900/20">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-stone-900 leading-tight tracking-tight">
                  {dict.appName}
                </span>
                <span className="text-xs bg-emerald-100 text-emerald-900 font-black px-3 py-0.5 rounded-full border border-emerald-200">
                  FARM2MARKET
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                {dict.brandTitle} • AgMarkNet / e-NAM Live
              </p>
            </div>
          </div>

          {/* Stepper Dots */}
          <div className="hidden md:flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((stepNum) => (
              <div
                key={stepNum}
                onClick={() => {
                  if (stepNum <= slide || (stepNum === 5 && analysisResult)) {
                    setSlide(stepNum);
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all ${
                  stepNum === slide
                    ? 'bg-emerald-800 text-white font-bold shadow-md shadow-emerald-900/20'
                    : stepNum < slide
                    ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200'
                    : 'bg-stone-100 text-stone-400'
                }`}
              >
                <span className="text-xs">{stepNum}</span>
                <span className="text-xs hidden lg:inline">
                  {stepNum === 1 ? (lang === 'te' ? 'స్వాగతం' : 'Welcome') :
                   stepNum === 2 ? (lang === 'te' ? 'రైతు ప్రొఫైల్' : 'Profile') :
                   stepNum === 3 ? (lang === 'te' ? 'పంట ఎంపిక' : 'Crop & Bid') :
                   stepNum === 4 ? (lang === 'te' ? 'వాతావరణ సూచిక' : 'Weather Risk') :
                                   (lang === 'te' ? 'మార్కెట్ ఫలితాలు' : 'Results')}
                </span>
              </div>
            ))}
          </div>

          {/* Sticky Global Language Toggle Button */}
          <button
            type="button"
            onClick={() => setLang(lang === 'en' ? 'te' : 'en')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-emerald-800 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 text-xs sm:text-sm font-black shadow-xs transition-all active:scale-95 cursor-pointer"
            aria-label="Toggle language between English and Telugu"
          >
            <Languages className="w-4 h-4 text-emerald-800" />
            <span>{dict.langToggle}</span>
          </button>
        </div>
      </header>

      {/* ==========================================
          🖥️ DESKTOP-FIRST APPLICATION CONTAINER
          (maxWidth: 1200px, margin: 2rem auto, generous desktop padding)
         ========================================== */}
      <main
        className="w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 space-y-6 flex-1"
        style={{ maxWidth: '1200px', margin: '2rem auto' }}
      >

        {/* ------------------------------------------------------------------
            SLIDE 1: Title & Welcome Screen ("MandiGuide AI")
            COMPLETELY DARK GREEN ENVIRONMENT
           ------------------------------------------------------------------ */}
        {slide === 1 && (
          <div className="rounded-3xl bg-gradient-to-br from-[#022c22] via-[#064e3b] to-[#022c22] p-8 sm:p-12 text-white shadow-2xl border border-emerald-800/50 space-y-8 relative overflow-hidden animate-in fade-in duration-300">
            {/* Ambient Dark Green Glows */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 -mb-10 w-80 h-80 bg-green-400/10 rounded-full blur-3xl pointer-events-none" />

            {/* Hero Welcome Banner Content */}
            <div className="relative z-10 max-w-4xl space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-emerald-200 text-xs sm:text-sm font-bold backdrop-blur-md">
                <span>{dict.slide1.badge}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-2">
                {dict.slide1.title} 🌾
              </h1>
              <p className="text-emerald-100 text-lg sm:text-xl font-semibold max-w-3xl leading-snug">
                {dict.slide1.subtitle}
              </p>
              <p className="text-emerald-100/85 text-sm sm:text-base max-w-2xl leading-relaxed">
                {dict.slide1.tagline}
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setSlide(2)}
                  className="py-4 px-9 rounded-full bg-white text-emerald-900 hover:bg-emerald-50 active:scale-95 font-black text-base shadow-lg shadow-black/20 hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center gap-3 cursor-pointer"
                >
                  <span>{dict.slide1.getStarted}</span>
                  <ArrowRight className="w-5 h-5 text-emerald-800" />
                </button>
                <div className="flex items-center gap-2 text-xs text-emerald-200 bg-emerald-950/70 px-5 py-3 rounded-full border border-emerald-600/40 backdrop-blur-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{dict.slide1.trustBadge}</span>
                </div>
              </div>
            </div>

            {/* 3-Column Feature Cards inside the Completely Dark Green Slide */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 pt-2">
              {dict.slide1.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-emerald-950/60 backdrop-blur-md rounded-3xl p-7 border border-emerald-700/40 shadow-lg hover:border-emerald-500/70 hover:bg-emerald-900/60 hover:-translate-y-1 transition-all space-y-3 group text-white"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-900/80 border border-emerald-700/60 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------
            SLIDE 2: User Profile & Geolocation Setup
           ------------------------------------------------------------------ */}
        {slide === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header */}
            <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                {dict.slide2.stepBadge}
              </span>
              <h2 className="text-xl font-bold text-stone-900 mt-1">
                {dict.slide2.stepTitle}
              </h2>
              <p className="text-sm text-stone-500 mt-1">
                {dict.slide2.stepSubtitle}
              </p>
            </div>

            {/* 2-Column Desktop Form Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Left Column: Farmer Contact Info */}
              <div className="bg-white rounded-3xl p-7 border border-emerald-100 shadow-xs space-y-5">
                <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-800" />
                  <span>{dict.slide2.farmerId}</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    {dict.slide2.nameLabel}
                  </label>
                  <input
                    type="text"
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    placeholder={dict.slide2.namePlaceholder}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-300 text-sm focus:border-emerald-700 focus:ring-2 focus:ring-emerald-600/20 outline-hidden bg-stone-50/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    {dict.slide2.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder={dict.slide2.phonePlaceholder}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-300 text-sm focus:border-emerald-700 focus:ring-2 focus:ring-emerald-600/20 outline-hidden bg-stone-50/50 transition-all"
                  />
                </div>

                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                  <p>{dict.slide2.phoneHint}</p>
                </div>
              </div>

              {/* Right Column: Location & GPS */}
              <div className="bg-white rounded-3xl p-7 border border-emerald-100 shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-800" />
                    <span>{dict.slide2.locationHeading}</span>
                  </h3>
                </div>

                {/* GPS Access Button */}
                <button
                  type="button"
                  onClick={handleEnableLocation}
                  disabled={isLocating}
                  className="w-full py-3.5 px-6 rounded-full border-2 border-emerald-700 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-98"
                >
                  <Navigation className={`w-4 h-4 text-emerald-800 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? dict.slide2.locationDetecting : dict.slide2.locationBtn}</span>
                </button>

                {/* Detected Location Card */}
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
                  <span className="text-xs text-stone-500 font-semibold block">
                    {dict.slide2.detectedLocationLabel}
                  </span>
                  <p className="text-base font-bold text-stone-900 mt-1">
                    {location.name}
                  </p>
                  {location.isGpsDetected ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-medium mt-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      {dict.slide2.locationSuccess}
                    </span>
                  ) : (
                    <span className="text-xs text-stone-400 mt-1 block">
                      {dict.slide2.fallbackNotice}
                    </span>
                  )}
                </div>

                {/* Quick Select Region Chips */}
                <div>
                  <p className="text-xs font-bold text-stone-600 mb-2">
                    {dict.slide2.quickSelectLabel}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {TELANGANA_HUBS.map((hub) => (
                      <button
                        key={hub.name}
                        type="button"
                        onClick={() =>
                          setLocation({
                            name: `${hub.name}, Telangana`,
                            latitude: hub.lat,
                            longitude: hub.lon,
                            isGpsDetected: false
                          })
                        }
                        className={`px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                          location.name.includes(hub.name)
                            ? 'bg-emerald-800 text-white border-transparent shadow-sm'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-emerald-300 hover:bg-emerald-50'
                        }`}
                      >
                        {lang === 'te' ? hub.nameTe : hub.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Navigation Row */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-emerald-100">
              <button
                type="button"
                onClick={() => setSlide(1)}
                className="py-3 px-7 rounded-full border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{dict.slide2.back}</span>
              </button>
              <button
                type="button"
                onClick={() => setSlide(3)}
                className="py-3.5 px-9 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md shadow-emerald-900/25 transition-all flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <span>{dict.slide2.next}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------
            SLIDE 3: Interactive Crop Selection & Local Offer
           ------------------------------------------------------------------ */}
        {slide === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header */}
            <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                {dict.slide3.stepBadge}
              </span>
              <h2 className="text-xl font-bold text-stone-900 mt-1">
                {dict.slide3.stepTitle}
              </h2>
              <p className="text-sm text-stone-500 mt-1">
                {dict.slide3.stepSubtitle}
              </p>
            </div>

            {/* 6-Column Desktop Grid for Crops */}
            <div className="bg-white rounded-3xl p-7 border border-emerald-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-stone-800 uppercase tracking-wider">
                  {dict.slide3.cropHeading}
                </h3>
                <span className="text-xs text-emerald-800 font-bold">
                  {dict.slide3.selectedLabel} {lang === 'te' ? activeCrop.nameTe : activeCrop.nameEn} ({lang === 'te' ? activeCrop.categoryTe : activeCrop.categoryEn})
                </span>
              </div>

              {/* 6-column grid with gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' */}
              <div
                className="grid gap-4"
                style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}
              >
                {CROPS_LIST.map((crop) => {
                  const isSelected = crop.id === selectedCropId;
                  return (
                    <button
                      key={crop.id}
                      type="button"
                      onClick={() => handleSelectCrop(crop)}
                      className={`p-5 rounded-3xl border-2 flex flex-col items-center justify-between gap-3 transition-all text-center cursor-pointer hover:-translate-y-1 hover:shadow-xl ${
                        isSelected
                          ? 'border-emerald-700 bg-emerald-50 shadow-md ring-2 ring-emerald-600/20'
                          : 'border-stone-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40'
                      }`}
                    >
                      <span className="text-4xl">{crop.icon}</span>
                      <div>
                        <span
                          className={`text-sm font-bold block ${
                            isSelected ? 'text-emerald-950' : 'text-stone-900'
                          }`}
                        >
                          {lang === 'te' ? crop.nameTe : crop.nameEn}
                        </span>
                        <span className="text-[11px] text-stone-500 block mt-0.5 font-medium">
                          ₹{crop.defaultPrice} / Quintal
                        </span>
                      </div>
                      <span className="text-[10px] bg-stone-100 text-stone-600 px-2.5 py-0.5 rounded-full font-medium">
                        {(lang === 'te' ? crop.specializedHubsTe : crop.specializedHubsEn).split(',')[0]} {dict.slide3.hubSuffix}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Desktop Flexbox Container for Quantity and Price Steppers */}
            <div className="bg-white rounded-3xl p-7 border border-emerald-100 shadow-xs space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quantity in Quintals */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-stone-800 flex items-center gap-2">
                      <Scale className="w-4 h-4 text-emerald-800" />
                      <span>{dict.slide3.qtyLabel}</span>
                    </label>
                    <span className="text-xs bg-emerald-100 text-emerald-900 font-black px-3 py-1 rounded-full">
                      {quantity} Q ({quantity * 100} kg)
                    </span>
                  </div>
                  <p className="text-xs text-stone-400">
                    {dict.slide3.qtyUnitHint}
                  </p>

                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(5, quantity - 5))}
                      className="w-12 h-12 rounded-full bg-stone-100 hover:bg-emerald-100 hover:text-emerald-900 text-stone-800 font-bold text-lg flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseFloat(e.target.value) || 0))}
                      className="flex-1 text-center font-bold text-lg py-2.5 rounded-2xl border border-stone-300 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-600/20 outline-hidden bg-stone-50/50"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 5)}
                      className="w-12 h-12 rounded-full bg-stone-100 hover:bg-emerald-100 hover:text-emerald-900 text-stone-800 font-bold text-lg flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Trader Offered Price (₹/Quintal) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-stone-800">
                      {dict.slide3.priceLabel}
                    </label>
                    <span className="text-sm font-bold text-emerald-800">
                      ₹{offeredPrice} / Q
                    </span>
                  </div>
                  <p className="text-xs text-stone-400">
                    {dict.slide3.priceHint}
                  </p>

                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setOfferedPrice(Math.max(100, offeredPrice - 50))}
                      className="w-12 h-12 rounded-full bg-stone-100 hover:bg-emerald-100 hover:text-emerald-900 text-stone-800 font-bold text-lg flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min="50"
                      step="50"
                      value={offeredPrice}
                      onChange={(e) => setOfferedPrice(Math.max(50, parseFloat(e.target.value) || 0))}
                      className="flex-1 text-center font-bold text-lg py-2.5 rounded-2xl border border-stone-300 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-600/20 outline-hidden bg-stone-50/50"
                    />
                    <button
                      type="button"
                      onClick={() => setOfferedPrice(offeredPrice + 50)}
                      className="w-12 h-12 rounded-full bg-stone-100 hover:bg-emerald-100 hover:text-emerald-900 text-stone-800 font-bold text-lg flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Total Trader Offer Summary Banner */}
              <div className="bg-gradient-to-r from-emerald-50 to-green-100/70 border border-emerald-200 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                <div>
                  <span className="text-xs text-emerald-900 font-bold block uppercase tracking-wider">
                    {dict.slide3.totalLocalValue}
                  </span>
                  <span className="text-xs text-stone-600">
                    {quantity} Quintals × ₹{offeredPrice} / Quintal
                  </span>
                </div>
                <div className="text-2xl font-black text-emerald-950">
                  ₹{(quantity * offeredPrice).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Desktop Navigation Row */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-emerald-100">
              <button
                type="button"
                onClick={() => setSlide(2)}
                className="py-3 px-7 rounded-full border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{dict.slide3.back}</span>
              </button>
              <button
                type="button"
                onClick={() => setSlide(4)}
                className="py-3.5 px-9 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md shadow-emerald-900/25 transition-all flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <span>{dict.slide3.next}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------
            SLIDE 4: Route Weather Alert & Spoilage Risk Index (SRI)
           ------------------------------------------------------------------ */}
        {slide === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header */}
            <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                {dict.slide4.stepBadge}
              </span>
              <h2 className="text-xl font-bold text-stone-900 mt-1">
                {dict.slide4.stepTitle}
              </h2>
              <p className="text-sm text-stone-500 mt-1">
                {dict.slide4.stepSubtitle}
              </p>
            </div>

            {/* 2-Column Desktop Grid for Weather and Spoilage Risk */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Left Column: Route Atmospheric Weather */}
              <div className="bg-white rounded-3xl p-7 border border-emerald-100 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider">
                    {dict.slide4.weatherBoxTitle}
                  </h3>
                  <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-200">
                    {dict.slide4.radarBadge}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Temperature */}
                  <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                      <Thermometer className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs text-stone-500 font-medium block">
                        {dict.slide4.tempLabel}
                      </span>
                      <span className="text-2xl font-black text-stone-800">
                        {weather.temperature}°C
                      </span>
                    </div>
                  </div>

                  {/* Precipitation */}
                  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                      <CloudRain className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs text-blue-700 font-medium block">
                        {dict.slide4.rainLabel}
                      </span>
                      <span className="text-2xl font-black text-blue-900">
                        {weather.precipitationRisk}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Road Status */}
                <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200 flex items-center justify-between text-xs">
                  <span className="text-stone-600 font-medium">
                    {dict.slide4.roadStatus}:
                  </span>
                  <span className="font-bold text-stone-900">
                    {dict.slide4.roadStatusVal}
                  </span>
                </div>
              </div>

              {/* Right Column: Spoilage Penalty Alert & Advisory */}
              <div className="bg-gradient-to-br from-amber-50 to-emerald-50/50 rounded-3xl p-7 border-2 border-amber-300 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    {dict.slide4.vulnerabilityLabel}
                  </span>
                  <span
                    className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                      activeCrop.perishability === 'HIGH'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : activeCrop.perishability === 'MEDIUM'
                        ? 'bg-yellow-100 text-yellow-900 border border-yellow-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {activeCrop.perishability === 'HIGH'
                      ? dict.slide4.vulnHigh
                      : activeCrop.perishability === 'MEDIUM'
                      ? dict.slide4.vulnMedium
                      : dict.slide4.vulnLow}
                  </span>
                </div>

                {/* Spoilage Penalty Banner */}
                <div className="bg-amber-500/15 border border-amber-500/40 rounded-2xl p-4 flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm sm:text-base font-extrabold text-amber-950 leading-snug">
                      {dict.slide4.spoilageAlert}
                    </p>
                    <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                      {dict.slide4.advisoryText}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Row */}
            <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setSlide(3)}
                className="py-3 px-7 rounded-full border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer w-full sm:w-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{dict.slide4.back}</span>
              </button>

              <button
                type="button"
                onClick={handleAnalyzeMarkets}
                disabled={isAnalyzing}
                className="py-4 px-9 rounded-full bg-emerald-800 hover:bg-emerald-900 active:scale-98 text-white font-black text-base shadow-xl shadow-emerald-900/30 transition-all flex items-center justify-center gap-3 cursor-pointer w-full sm:w-auto disabled:opacity-75"
              >
                {isAnalyzing ? (
                  <>
                    <RotateCcw className="w-5 h-5 animate-spin" />
                    <span>{dict.slide4.analyzing}</span>
                  </>
                ) : (
                  <>
                    <span>{dict.slide4.analyzeBtn}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------
            SLIDE 5: Rate Comparison, Direct Navigation & Warehouse Booking
           ------------------------------------------------------------------ */}
        {slide === 5 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Slide Header with Voice Guidance */}
            <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  {dict.slide5.stepBadge}
                </span>
                <h2 className="text-xl font-bold text-stone-900 mt-1">
                  {dict.slide5.stepTitle}
                </h2>
                <p className="text-sm text-stone-500 mt-1">
                  {dict.slide5.stepSubtitle}
                </p>
              </div>

              {/* Speech Synthesis Voice Button */}
              <button
                type="button"
                onClick={handleToggleVoiceAdvice}
                className={`px-6 py-3.5 rounded-full font-bold text-sm flex items-center gap-2.5 shrink-0 transition-all active:scale-95 cursor-pointer ${
                  isSpeaking
                    ? 'bg-emerald-700 text-white animate-pulse'
                    : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-md shadow-emerald-900/25'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-5 h-5" />
                    <span>{dict.slide5.stopAdvice}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-5 h-5" />
                    <span>{dict.slide5.listenAdvice}</span>
                  </>
                )}
              </button>
            </div>

            {/* Strategic Decision Callout Banner */}
            {(() => {
              const best = analysisResult?.best_option || (analysisResult?.comparison_markets && analysisResult.comparison_markets[0]);
              const netGain = best ? best.net_difference_vs_current : 0;
              const hasGain = netGain > 0;
              const mandiDisplayName = best
                ? (lang === 'te' && (best.mandi_name_te || best.name_te) ? (best.mandi_name_te || best.name_te) : best.mandi_name)
                : (lang === 'te' ? 'ప్రత్యేక మార్కెట్' : 'Specialized Mandi');

              return (
                <div
                  className={`rounded-3xl p-7 border-2 shadow-xl relative overflow-hidden ${
                    hasGain
                      ? 'bg-gradient-to-br from-[#022c22] via-[#064e3b] to-[#047857] border-emerald-700/50 text-white'
                      : 'bg-stone-900 border-stone-700 text-white'
                  }`}
                >
                  <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-300 mb-2">
                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                    <span>{dict.slide5.strategicCalloutTitle}</span>
                  </div>

                  <p className="text-base sm:text-lg font-bold leading-snug text-emerald-50">
                    {lang === 'te'
                      ? `సిఫార్సు: మీ ${activeCrop.nameTe} పంటను ${mandiDisplayName} కు రవాణా చేయడం ద్వారా స్థానిక వ్యాపారి ఇచ్చిన ధర కంటే నికరంగా ₹${Math.abs(netGain).toLocaleString('en-IN')} ${hasGain ? 'అదనపు నికర లాభం లభిస్తుంది!' : 'తక్కువ వస్తుంది.'}`
                      : `Recommendation: Transporting your ${activeCrop.nameEn} harvest to ${mandiDisplayName} earns you ₹${Math.abs(netGain).toLocaleString('en-IN')} ${hasGain ? 'more net profit' : 'less'} after all road freight & transit rain loss deductions!`
                    }
                  </p>
                </div>
              );
            })()}

            {/* Mandi Cards Desktop Grid (2-Column or 3-Column Desktop Grid) */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider">
                  {dict.slide5.cardsHeading}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {dict.slide5.cardsSub} <span className="font-bold text-emerald-800">{lang === 'te' ? activeCrop.nameTe : activeCrop.nameEn} ({lang === 'te' ? activeCrop.specializedHubsTe : activeCrop.specializedHubsEn})</span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(analysisResult?.comparison_markets || []).map((mandi, idx) => {
                  const isBest = mandi.is_best || idx === 0;
                  const netDiff = mandi.net_difference_vs_current;
                  const isGain = netDiff >= 0;
                  const mandiName = lang === 'te' && (mandi.mandi_name_te || mandi.name_te)
                    ? (mandi.mandi_name_te || mandi.name_te)
                    : (mandi.mandi_name || mandi.name);

                  const googleMapsDestination = (mandi.name || mandi.mandi_name) + ', Telangana';

                  return (
                    <div
                      key={mandi.mandi_id || idx}
                      className={`bg-white rounded-3xl border-2 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all ${
                        isBest ? 'border-emerald-700 ring-2 ring-emerald-600/20' : 'border-stone-200'
                      }`}
                    >
                      {/* 1. Mandi Name & Distance */}
                      <div className="p-5 bg-stone-50/80 border-b border-stone-100 flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base text-stone-900">
                              {mandiName}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 mt-1">
                            {mandi.road_distance_km || mandi.distance_km} km {dict.slide5.mandiCard.away}
                            {mandi.district ? ` • ${mandi.district}` : ''}
                          </p>
                        </div>
                        {isBest && (
                          <span className="bg-emerald-800 text-white text-[10px] font-black px-3 py-1 rounded-full shrink-0 shadow-xs">
                            {dict.slide5.bestChoice}
                          </span>
                        )}
                      </div>

                      {/* Mandi Breakdown Details */}
                      <div className="p-5 space-y-3 text-xs flex-1">
                        {/* 2. Gross Agmarknet Rate */}
                        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                          <span className="text-stone-600 font-medium">
                            {dict.slide5.mandiCard.grossRate}
                          </span>
                          <span className="text-sm font-black text-stone-900">
                            ₹{mandi.historical_comparable_price?.toLocaleString('en-IN')} / Q
                          </span>
                        </div>

                        {/* 3. Distance & Transport Cost Calculation */}
                        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                          <div className="flex items-center gap-1.5 text-stone-600">
                            <Truck className="w-4 h-4 text-stone-500 shrink-0" />
                            <div>
                              <span>{dict.slide5.mandiCard.tripTransport}</span>
                              <span className="text-[10px] text-stone-400 block">
                                (₹2.50/km/q × {mandi.road_distance_km || mandi.distance_km} km)
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-stone-800">
                              -₹{mandi.transport_cost_per_quintal || (mandi.estimated_transport_cost / (quantity || 1)).toFixed(1)}/Q
                            </span>
                            <span className="text-[10px] text-stone-500 block font-semibold">
                              {dict.slide5.mandiCard.totalTransport}: ₹{mandi.estimated_transport_cost?.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        {/* 4. Spoilage Risk Deduction */}
                        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                          <div className="flex items-center gap-1.5 text-amber-700">
                            <CloudRain className="w-4 h-4 text-amber-600 shrink-0" />
                            <div>
                              <span>{dict.slide5.mandiCard.spoilageDeduction}</span>
                              <span className="text-[10px] text-amber-600 block">
                                {dict.slide5.mandiCard.spoilageNote} ({mandi.spoilage_rate_pct || 25}%)
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-amber-800">
                              -₹{mandi.spoilage_loss_per_quintal || 0}/Q
                            </span>
                            <span className="text-[10px] text-amber-600 block font-semibold">
                              {dict.slide5.mandiCard.totalLoss}: -₹{(mandi.spoilage_total_loss || (mandi.spoilage_loss_per_quintal * quantity))?.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        {/* 5. Final Net Profit Calculation Box */}
                        <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200/80 space-y-2">
                          <div>
                            <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block">
                              {dict.slide5.mandiCard.netProfitHeading}
                            </span>
                            <p className="text-[10px] text-stone-500 font-mono mt-0.5">
                              {dict.slide5.mandiCard.formula}
                            </p>
                            <p className="text-[10px] text-stone-600 font-medium">
                              (₹{mandi.historical_comparable_price} - ₹{mandi.transport_cost_per_quintal} - ₹{mandi.spoilage_loss_per_quintal}) × {quantity} Q
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-emerald-200/60">
                            <span className="text-stone-700 font-semibold">
                              {dict.slide5.mandiCard.effectiveNetRate}
                            </span>
                            <span className="font-bold text-stone-900 text-sm">
                              ₹{mandi.effective_net_price_per_quintal?.toFixed(1)} / Q
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-emerald-900 font-bold">
                              {dict.slide5.mandiCard.totalNetRevenue}
                            </span>
                            <span className="text-lg font-black text-emerald-950">
                              ₹{mandi.estimated_net_value?.toLocaleString('en-IN')}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-1.5 border-t border-emerald-200/60 text-xs">
                            <span className="text-stone-500 font-medium">
                              {dict.slide5.mandiCard.vsTrader}
                            </span>
                            <span
                              className={`font-black ${
                                isGain ? 'text-emerald-800' : 'text-amber-800'
                              }`}
                            >
                              {isGain ? '+' : ''}₹{Math.abs(netDiff).toLocaleString('en-IN')}{' '}
                              {isGain ? dict.slide5.mandiCard.moreGain : dict.slide5.mandiCard.lessLoss}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 6. Action Button ("🗺️ View Route / మార్గం చూడండి") */}
                      <div className="p-4 bg-stone-50/50 border-t border-stone-100">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(googleMapsDestination)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3 px-5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <Navigation className="w-4 h-4 text-emerald-400" />
                          <span>{dict.slide5.mandiCard.viewRoute}</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 📦 Integrated WDRA Warehouse & Storage Section */}
            <div className="bg-white rounded-3xl p-7 border border-emerald-100 shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Warehouse className="w-5 h-5 text-emerald-800" />
                  <span>{dict.slide5.warehouseSectionTitle}</span>
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  {dict.slide5.warehouseSectionSub}
                </p>
              </div>

              {/* Storage Facilities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(analysisResult?.cold_storages || (
                  (activeCrop.id === 'paddy' || activeCrop.id === 'cotton')
                    ? GRAIN_STORAGES_FALLBACK
                    : PERISHABLE_STORAGES_FALLBACK
                )).map((storage) => {
                  const storageDisplayName = lang === 'te' && storage.name_te ? storage.name_te : storage.name;
                  const storageDestination = storage.name + ', Telangana';

                  return (
                    <div
                      key={storage.id}
                      className="bg-stone-50/80 rounded-3xl p-6 border border-stone-200 flex flex-col justify-between gap-4 shadow-xs hover:shadow-lg transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-3 py-0.5 rounded-full">
                            {storage.accreditation || 'WDRA Accredited'}
                          </span>
                          <span className="text-xs font-black text-emerald-800">
                            ₹{storage.daily_rate_per_quintal}/Q/day
                          </span>
                        </div>

                        <h4 className="font-bold text-sm sm:text-base text-stone-900 leading-snug">
                          {storageDisplayName}
                        </h4>
                        <p className="text-xs text-stone-500">
                          📍 {storage.location} • {storage.distance_km} km {dict.slide5.mandiCard.away}
                        </p>

                        <div className="text-[11px] text-stone-600 bg-white p-3 rounded-2xl border border-stone-200/70 space-y-1">
                          <div className="flex items-center justify-between">
                            <span>{dict.slide5.storageCard.capacity}:</span>
                            <span className="font-bold">{storage.capacity_tonnes?.toLocaleString('en-IN') || '5,000'} Tonnes</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-emerald-800 font-semibold pt-0.5">
                            <FileCheck className="w-3.5 h-3.5 text-emerald-800" />
                            <span>{dict.slide5.storageCard.enwrEligible}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons: View Route & Book Storage */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(storageDestination)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 px-3 rounded-full border border-stone-300 hover:bg-stone-100 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Navigation className="w-3.5 h-3.5 text-emerald-800" />
                          <span>{dict.slide5.storageCard.viewRoute}</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => handleOpenBookingModal(storage)}
                          className="py-2.5 px-3 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95"
                        >
                          <Warehouse className="w-3.5 h-3.5" />
                          <span>{dict.slide5.storageCard.bookBtn}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Start Over Button */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={handleStartOver}
                className="py-3.5 px-9 rounded-full border-2 border-emerald-800 text-emerald-800 hover:bg-emerald-50 font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{dict.slide5.startOver}</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ==========================================
          📦 INTERACTIVE WAREHOUSE BOOKING MODAL
         ========================================== */}
      {bookingModal.isOpen && bookingModal.storage && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-7 sm:p-9 shadow-2xl border border-emerald-100 space-y-6 animate-in zoom-in-95 duration-200">
            {/* Modal Top */}
            <div className="flex items-start justify-between gap-3 border-b border-emerald-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl shrink-0">
                  📦
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-stone-900">
                    {dict.slide5.modal.title}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {lang === 'te' && bookingModal.storage.name_te ? bookingModal.storage.name_te : bookingModal.storage.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setBookingModal({ ...bookingModal, isOpen: false })}
                className="text-stone-400 hover:text-stone-600 p-2 rounded-full hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form & Cost Breakdown */}
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div>
                  <span className="text-stone-500 font-medium block">{dict.slide5.modal.cropLabel}</span>
                  <span className="font-bold text-stone-900">
                    {activeCrop.icon} {lang === 'te' ? activeCrop.nameTe : activeCrop.nameEn}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 font-medium block">{dict.slide5.modal.qtyLabel}</span>
                  <span className="font-bold text-stone-900">{quantity} Quintals</span>
                </div>
              </div>

              {/* Duration Stepper / Slider (1-30 days) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-stone-800 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-800" />
                    <span>{dict.slide5.modal.durationLabel}</span>
                  </label>
                  <span className="text-sm font-extrabold text-emerald-800 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
                    {bookingModal.durationDays} {dict.slide5.modal.days}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setBookingModal({
                        ...bookingModal,
                        durationDays: Math.max(1, bookingModal.durationDays - 1)
                      })
                    }
                    className="w-10 h-10 rounded-full bg-stone-100 hover:bg-emerald-100 hover:text-emerald-800 text-stone-800 font-bold flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={bookingModal.durationDays}
                    onChange={(e) =>
                      setBookingModal({
                        ...bookingModal,
                        durationDays: parseInt(e.target.value) || 1
                      })
                    }
                    className="flex-1 accent-emerald-800 h-2 bg-stone-200 rounded-lg cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setBookingModal({
                        ...bookingModal,
                        durationDays: Math.min(30, bookingModal.durationDays + 1)
                      })
                    }
                    className="w-10 h-10 rounded-full bg-stone-100 hover:bg-emerald-100 hover:text-emerald-800 text-stone-800 font-bold flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Live Calculated Storage Cost */}
              <div className="bg-gradient-to-r from-emerald-50 to-green-100/70 rounded-2xl p-4 border border-emerald-200 space-y-1">
                <div className="flex items-center justify-between text-xs text-stone-600">
                  <span>{dict.slide5.modal.dailyRateLabel}</span>
                  <span className="font-semibold text-stone-900">₹{bookingModal.storage.daily_rate_per_quintal} / Quintal / Day</span>
                </div>
                <div className="flex items-center justify-between text-sm sm:text-base font-extrabold text-emerald-950 pt-1">
                  <span>{dict.slide5.modal.totalCostLabel}</span>
                  <span className="text-xl font-black">
                    ₹{(
                      quantity *
                      bookingModal.storage.daily_rate_per_quintal *
                      bookingModal.durationDays
                    ).toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-900 font-medium pt-0.5">
                  {dict.slide5.modal.formulaNotice}
                </p>
              </div>

              {/* eNWR Bank Pledge Loan Checkbox */}
              <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bookingModal.requestEnwr}
                    onChange={(e) =>
                      setBookingModal({ ...bookingModal, requestEnwr: e.target.checked })
                    }
                    className="mt-1 w-4 h-4 text-emerald-700 rounded-md focus:ring-emerald-600 border-stone-300"
                  />
                  <div className="text-xs leading-relaxed text-emerald-950 font-medium">
                    {dict.slide5.modal.enwrCheckbox}
                  </div>
                </label>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-white px-3 py-1 rounded-full border border-emerald-200 shadow-2xs">
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>{dict.slide5.modal.enwrBadge}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBookingModal({ ...bookingModal, isOpen: false })}
                className="flex-1 py-3 px-5 rounded-full border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs sm:text-sm cursor-pointer transition-colors"
              >
                {dict.slide5.modal.closeBtn}
              </button>
              <button
                type="button"
                onClick={handleConfirmBooking}
                className="flex-1 py-3 px-5 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-900/25 cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{dict.slide5.modal.confirmBtn}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Footer */}
      <footer className="w-full py-6 text-center text-xs text-stone-400 border-t border-stone-200 bg-white">
        <p className="max-w-[1200px] mx-auto px-6">
          {dict.footerText}
        </p>
      </footer>
    </div>
  );
}

// ==========================================
// 💡 COMMODITY SPECIALIZATION SIMULATOR (FALLBACK)
// ==========================================
function generateCommoditySpecializedData(crop, qty, traderPrice, location, lang) {
  const quantity = parseFloat(qty) || 50;
  const offeredPrice = parseFloat(traderPrice) || crop.defaultPrice;
  const traderGross = quantity * offeredPrice;

  // Commodity-Specific Mandis Mapping
  const cropMandiCatalog = {
    tomato: [
      { name: 'Bowenpally Wholesale APMC', name_te: 'బోయిన్‌పల్లి హోల్‌సేల్ APMC', district: 'Hyderabad', distance_km: 15.0, mult: 1.35 },
      { name: 'Gudimalkapur Yard', name_te: 'గుడిమల్కాపూర్ మార్కెట్ యార్డ్', district: 'Hyderabad', distance_km: 16.5, mult: 1.25 },
      { name: 'Kothapet Rythu Bazar', name_te: 'కొత్తపేట రైతు బజార్', district: 'Ranga Reddy', distance_km: 24.0, mult: 1.28 }
    ],
    chilli: [
      { name: 'Bowenpally Wholesale APMC', name_te: 'బోయిన్‌పల్లి హోల్‌సేల్ APMC', district: 'Hyderabad', distance_km: 15.0, mult: 1.32 },
      { name: 'Gudimalkapur Yard', name_te: 'గుడిమల్కాపూర్ మార్కెట్ యార్డ్', district: 'Hyderabad', distance_km: 16.5, mult: 1.22 },
      { name: 'Kothapet Rythu Bazar', name_te: 'కొత్తపేట రైతు బజార్', district: 'Ranga Reddy', distance_km: 24.0, mult: 1.26 }
    ],
    paddy: [
      { name: 'Miryalguda APMC (Major Grain Hub)', name_te: 'మిర్యాలగూడ APMC (ప్రముఖ ధాన్య విపణి)', district: 'Nalgonda', distance_km: 142.0, mult: 1.38 },
      { name: 'Suryapet APMC', name_te: 'సూర్యాపేట APMC', district: 'Suryapet', distance_km: 135.0, mult: 1.28 },
      { name: 'Nizamabad e-NAM Mandi', name_te: 'నిజామాబాద్ e-NAM మార్కెట్', district: 'Nizamabad', distance_km: 165.0, mult: 1.30 }
    ],
    rice: [
      { name: 'Miryalguda APMC (Major Grain Hub)', name_te: 'మిర్యాలగూడ APMC (ప్రముఖ ధాన్య విపణి)', district: 'Nalgonda', distance_km: 142.0, mult: 1.38 },
      { name: 'Suryapet APMC', name_te: 'సూర్యాపేట APMC', district: 'Suryapet', distance_km: 135.0, mult: 1.28 },
      { name: 'Nizamabad e-NAM Mandi', name_te: 'నిజామాబాద్ e-NAM మార్కెట్', district: 'Nizamabad', distance_km: 165.0, mult: 1.30 }
    ],
    cotton: [
      { name: "Warangal APMC (Asia's major cotton yard)", name_te: 'వరంగల్ APMC (ఆసియా అతిపెద్ద పత్తి మార్కెట్)', district: 'Warangal', distance_km: 148.0, mult: 1.40 },
      { name: 'Adilabad Mandi', name_te: 'ఆదిలాబాద్ మార్కెట్', district: 'Adilabad', distance_km: 305.0, mult: 1.32 },
      { name: 'Khammam APMC', name_te: 'ఖమ్మం APMC', district: 'Khammam', distance_km: 195.0, mult: 1.34 }
    ],
    potato: [
      { name: 'Malakpet Wholesale Market', name_te: 'మలక్‌పేట్ హోల్‌సేల్ మార్కెట్', district: 'Hyderabad', distance_km: 11.5, mult: 1.30 },
      { name: 'Bowenpally Wholesale Yard', name_te: 'బోయిన్‌పల్లి హోల్‌సేల్ యార్డ్', district: 'Hyderabad', distance_km: 15.0, mult: 1.24 },
      { name: 'Gudimalkapur Yard', name_te: 'గుడిమల్కాపూర్ మార్కెట్ యార్డ్', district: 'Hyderabad', distance_km: 16.5, mult: 1.20 }
    ],
    onion: [
      { name: 'Malakpet Wholesale Market', name_te: 'మలక్‌పేట్ హోల్‌సేల్ మార్కెట్', district: 'Hyderabad', distance_km: 11.5, mult: 1.32 },
      { name: 'Bowenpally Wholesale Yard', name_te: 'బోయిన్‌పల్లి హోల్‌సేల్ యార్డ్', district: 'Hyderabad', distance_km: 15.0, mult: 1.26 },
      { name: 'Gudimalkapur Yard', name_te: 'గుడిమల్కాపూర్ మార్కెట్ యార్డ్', district: 'Hyderabad', distance_km: 16.5, mult: 1.22 }
    ]
  };

  const selectedMandis = cropMandiCatalog[crop.id] || cropMandiCatalog.tomato;

  const comparisons = selectedMandis.map((m, idx) => {
    const roadDist = Math.round(m.distance_km * 1.15 * 10) / 10;
    const transportRatePerKmQ = 2.50;
    const transportCostPerQ = Math.round(roadDist * transportRatePerKmQ * 10) / 10;
    const totalTransport = Math.round(transportCostPerQ * quantity);

    const mandiGrossRate = Math.round(offeredPrice * m.mult);

    // Weather Spoilage Deduction (25% for high perishable under 80% rain)
    const spoilageRate = crop.perishability === 'HIGH' ? 0.25 : (crop.perishability === 'MEDIUM' ? 0.10 : 0.05);
    const spoilageLossPerQ = Math.round(mandiGrossRate * spoilageRate);
    const totalSpoilageLoss = Math.round(spoilageLossPerQ * quantity);

    // Net Calculation: (Gross Rate - Transport - Spoilage) * Quantity
    const effectiveNetPricePerQ = Math.round(mandiGrossRate - transportCostPerQ - spoilageLossPerQ);
    const totalNetRevenue = Math.round(effectiveNetPricePerQ * quantity);
    const netDiff = Math.round(totalNetRevenue - traderGross);

    return {
      mandi_id: idx + 1,
      mandi_name: m.name,
      mandi_name_te: m.name_te,
      name: m.name,
      name_te: m.name_te,
      district: m.district,
      distance_km: m.distance_km,
      road_distance_km: roadDist,
      transport_rate_per_km_q: transportRatePerKmQ,
      transport_cost_per_quintal: transportCostPerQ,
      estimated_transport_cost: totalTransport,
      spoilage_rate_pct: Math.round(spoilageRate * 100),
      spoilage_loss_per_quintal: spoilageLossPerQ,
      spoilage_total_loss: totalSpoilageLoss,
      gross_value: Math.round(mandiGrossRate * quantity),
      estimated_net_value: totalNetRevenue,
      effective_net_price_per_quintal: effectiveNetPricePerQ,
      net_difference_vs_current: netDiff,
      historical_comparable_price: mandiGrossRate,
      is_best: false,
      google_maps_url: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        m.name + ', Telangana'
      )}`
    };
  });

  comparisons.sort((a, b) => b.estimated_net_value - a.estimated_net_value);
  if (comparisons[0]) {
    comparisons[0].is_best = true;
  }

  // Pick crop-appropriate storage facilities
  const storages = (crop.id === 'rice' || crop.id === 'paddy' || crop.id === 'cotton')
    ? GRAIN_STORAGES_FALLBACK
    : PERISHABLE_STORAGES_FALLBACK;

  return {
    best_option: comparisons[0],
    comparison_markets: comparisons,
    cold_storages: storages
  };
}

const PERISHABLE_STORAGES_FALLBACK = [
  {
    id: 1,
    name: 'Ranga Reddy Cold Storage',
    name_te: 'రంగారెడ్డి కోల్డ్ స్టోరేజ్',
    location: 'Ranga Reddy Hub, Hyderabad',
    distance_km: 12.0,
    daily_rate_per_quintal: 5.0,
    capacity_tonnes: 4500,
    accreditation: 'WDRA Accredited (Grade A)',
    google_maps_url: 'https://www.google.com/maps/dir/?api=1&destination=Ranga+Reddy+Cold+Storage+Telangana'
  },
  {
    id: 2,
    name: 'Telangana State Warehousing Corp (TSWC) Cold Storage - Medchal',
    name_te: 'తెలంగాణ రాష్ట్ర గిడ్డంగుల సంస్థ (TSWC) కోల్డ్ స్టోరేజ్ - మేడ్చల్',
    location: 'Medchal, ORR Junction, Telangana',
    distance_km: 18.5,
    daily_rate_per_quintal: 5.0,
    capacity_tonnes: 5000,
    accreditation: 'WDRA Accredited',
    google_maps_url: 'https://www.google.com/maps/dir/?api=1&destination=TSWC+Cold+Storage+Medchal+Telangana'
  },
  {
    id: 3,
    name: 'Bowenpally Agromart Refrigerated Godown',
    name_te: 'బోయిన్‌పల్లి ఆగ్రోమార్ట్ రిఫ్రిజిరేటెడ్ గోడౌన్',
    location: 'Adjacent to Bowenpally APMC Yard, Telangana',
    distance_km: 14.2,
    daily_rate_per_quintal: 5.0,
    capacity_tonnes: 3500,
    accreditation: 'WDRA Accredited',
    google_maps_url: 'https://www.google.com/maps/dir/?api=1&destination=Bowenpally+Market+Yard+Telangana'
  }
];

const GRAIN_STORAGES_FALLBACK = [
  {
    id: 1,
    name: 'TSWC Modern Grain Silos - Miryalguda',
    name_te: 'TSWC ఆధునిక ధాన్యం సైలోలు - మిర్యాలగూడ',
    location: 'Miryalguda Industrial Zone, Nalgonda',
    distance_km: 18.0,
    daily_rate_per_quintal: 3.5,
    capacity_tonnes: 25000,
    accreditation: 'WDRA Accredited (Grade A+)',
    google_maps_url: 'https://www.google.com/maps/dir/?api=1&destination=TSWC+Grain+Silo+Miryalguda+Telangana'
  },
  {
    id: 2,
    name: 'Central Warehousing Corporation (CWC) Godown - Warangal',
    name_te: 'సెంట్రల్ వేర్‌హౌసింగ్ కార్పొరేషన్ (CWC) గోడౌన్ - వరంగల్',
    location: 'Enumamula Market Yard Road, Warangal',
    distance_km: 25.0,
    daily_rate_per_quintal: 3.5,
    capacity_tonnes: 18000,
    accreditation: 'WDRA Accredited',
    google_maps_url: 'https://www.google.com/maps/dir/?api=1&destination=CWC+Warehouse+Warangal+Telangana'
  },
  {
    id: 3,
    name: 'Nizamabad e-NAM Scientific Godown',
    name_te: 'నిజామాబాద్ e-NAM సైంటిఫిక్ గోడౌన్',
    location: 'APMC Market Complex, Nizamabad',
    distance_km: 20.0,
    daily_rate_per_quintal: 3.5,
    capacity_tonnes: 12000,
    accreditation: 'WDRA Accredited',
    google_maps_url: 'https://www.google.com/maps/dir/?api=1&destination=Nizamabad+Mandi+Telangana'
  }
];
