'use client';
import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'rw';

interface LanguageContextType {
  lang: Language;
  toggleLanguage: () => void;
  t: (key: string) => any;
}

const translations = {
  en: {
    companyName: "SAFETY FINANCIAL SOLUTIONS",
    tagline: "YOUR SATISFACTION IS OUR PRIORITY",
    phone: "0787316671 / 0781453818 / 0794495659",
    email: "safetyfinancialsolution@gmail.com",
    switchBtn: "Hindura mu Kinyarwanda",
    navHome: "Home",
    navApply: "Apply Now",
    heroBadge: "Fast & Reliable Credit Service",
    heroTitle: "Own Your Dream Home & Finance Your Projects",
    heroDesc: "We offer fast and reliable loans, disbursed within just two days, at very competitive and low interest rates. Tackle life's needs with confidence through our flexible credit structures.",
    applyNow: "Start Application",
    badge2Days: "2 Days Max",
    badge2DaysDesc: "Rapid Disbursal Window",
    badgeRates: "Low Interest",
    badgeRatesDesc: "Highly Competitive Rates",
    badgeTrust: "Priority Trust",
    badgeTrustDesc: "Your Satisfaction First",
    loansTitle: "Our Strategic Financial Solutions",
    loanDesc: "Tailored lending frameworks built to support your immediate personal or professional structural growth.",
    loans: [
      "Personal Loans", 
      "Salary-Based Loans", 
      "Car Purchase Loans", 
      "Business Improvement Loans", 
      "Agriculture and Farming Loan", 
      "Construction Project Financing"
    ],
    reqTitle: "Compliance & Underwriting Requirements",
    reqDesc: "Please ensure you have the following documentation ready to secure your 48-hour approval turnaround:",
    requirements: [
      "Collateral (e.g., House, Land, etc.)", 
      "Copy of your National ID", 
      "A document confirming your marital status", 
      "Copy of your spouse's ID", 
      "Proof of ownership of the collateral", 
      "Collateral valuation report", 
      "A summary / write-up of your project", 
      "Tax clearance certificate from Rwanda Revenue Authority (RRA)"
    ],
    footerDesc: "A licensed money lending and credit service dedicated to prioritizing your financial flexibility, security, and continuous progress.",
    footerActions: "Quick Actions",
    footerSupport: "Support Channels",
    footerUrgent: "Have an urgent question or facing a financial challenge? Connect with our credit officers immediately:",
    rightsReserved: "All Rights Reserved. Your Satisfaction Is Our Priority.",
    
    // Form Page Strings
    formTitle: "Secure Credit Application",
    formSubtitle: "Please complete the steps below to submit your evaluation profile to our underwriting division.",
    step1: "Profile Information",
    step2: "Upload Documents",
    step3: "Submit Application",
    labelName: "Full Name",
    labelID: "National ID / Passport Number",
    labelPhone: "Phone Number",
    labelEmail: "Email Address",
    labelProduct: "Selected Loan Product Division",
    labelAmount: "Requested Loan Amount (RWF)", // English Form Tag
    labelCollateral: "Collateral Identification Asset / Description",
    labelSummary: "Brief Project Summary / Allocation Intention",
    btnContinue: "Continue to Document Uploads →",
    btnNextSubmit: "Proceed to Final Review →",
    btnBack: "← Back",
    btnFinalSubmit: "Complete & Submit Application",
    uploadDesc: "Please attach digital copies (PDF or Images) of the following underwriting requirements:",
    fileAttached: "Attached",
    fileChange: "Change File",
    fileChoose: "Choose File",
    reviewTitle: "Final Application Review",
    reviewDesc: "Please verify that all details and document attachments are correct before final submission.",
    reviewFiles: "Attached Documents",
    reviewNoFiles: "No optional documents attached",
    successMsg: "Application submitted successfully! Your tracking ID is:"
  },
  rw: {
    companyName: "SAFETY FINANCIAL SOLUTIONS",
    tagline: "AKANYAMUNEZA KANJU NI INTAMBWE YAWE YA MBERE",
    phone: "0787316671 / 0781453818 / 0794495659",
    email: "safetyfinancialsolution@gmail.com",
    switchBtn: "Switch to English",
    navHome: "Ahabanza",
    navApply: "Saba Inguzanyo",
    heroBadge: "Serivisi y'Inguzanyo Yihuse & Wizewe",
    heroTitle: "Gura Inzu y'Inzozi Zawe Kandi Uteze Imbere Imishinga Yawe",
    heroDesc: "Dutanga inguzanyo yihuse muminsi ibiri gusa, kandi ku nyungu ntoya cyane. Reba ibyo ukene mu buzima ufite icyizere binyuze mu nguzanyo zacu zihuse kandi zoroheje.",
    applyNow: "Tangira Gusaba",
    badge2Days: "Iminsi 2 Gusa",
    badge2DaysDesc: "Inguzanyo Iboneka Lihuse",
    badgeRates: "Inyungu Ntoya",
    badgeRatesDesc: "Inyungu Ihagaze Neza Cyane",
    badgeTrust: "Gushimisha Umukiriya",
    badgeTrustDesc: "Ibyifuzo Byawe Ni Intambwe Ya Mbere",
    loansTitle: "Ubwoko bw'Inguzanyo Dutanga",
    loanDesc: "Uburyo bunoze bwo gutanga inguzanyo bwubatswe hagamijwe gushyigikira iterambere ryawe rya muntu cyangwa ry'ubucuruzi.",
    loans: [
      "Inguzanyo y'Umuntu ku Giti Cye", 
      "Inguzanyo ku Mushahara", 
      "Inguzanyo yo Kugura Imodoka", 
      "Inguzanyo yo Kwagura Ubucuruzi", 
      "Inguzanyo mu Buhinzi n'Ubworozi", 
      "Inguzanyo y'Ubuhamya bw'Inzu n'Ubwubatsi"
    ],
    reqTitle: "Ibisabwa ngo Uhabwe Inguzanyo",
    reqDesc: "Nyamuneka menya neza ko ufite ibi bitabo n'ibyemezo bikurikira ngo inguzanyo yawe itunganywe mu masaha 48:",
    requirements: [
      "Ingwate itimukanwa (Inzu, Ubutaka, ........)", 
      "Kopi y'Irangamuntu yawe", 
      "Icyemezo cy'Irangamimerere", 
      "Kopi y'Irangamuntu y'uwo mwashakanye", 
      "Icyemezo kigaragaza ko ingwate ari iyawe", 
      "Igenagaciro ry'ingwate", 
      "Incamacye y'umushinga uzakora", 
      "Icyemezo cyo kutabamo umwenda ikigo cy'imisoro n'amahoro RRA"
    ],
    footerDesc: "Serivisi yemewe yo gutanga inguzanyo n'inguzanyo igamije gushyira imbere ukwiyorohereza kw'amafaranga, umutekano, n'iterambere rirambye.",
    footerActions: "Ubufasha Bwihuse",
    footerSupport: "Twandikire / Duhamagare",
    footerUrgent: "Ufite ikibazo cyihutirwa cyangwa ikibazo cy'amafaranga? Twandikire cyangwa uhamagare abasinziriye b'inguzanyo bacu ubu:",
    rightsReserved: "Uburenganzira bwose buraboshywe. Akanyamuneza kawe niyo ntego yacu.",
    
    // Form Page Strings
    formTitle: "Saba Inguzanyo mu Mutekano",
    formSubtitle: "Nyamuneka uzuzatunganye intambwe zikurikira kugira ngo wohereze umwirondoro wawe mu kigo cyacu.",
    step1: "Imwirondoro Y'umuntu",
    step2: "Shyiraho Inyandiko",
    step3: "Komeza Wohereze",
    labelName: "Amazina Yose",
    labelID: "Numero y'Irangamuntu / Pasiporo",
    labelPhone: "Numero de Terefone",
    labelEmail: "Ikoresha-nyandiko (Email)",
    labelProduct: "Ubwoko bw'Inguzanyo Uhisemo",
    labelAmount: "Amafaranga y'Inguzanyo we Ukene (RWF)", // Kinyarwanda Form Tag
    labelCollateral: "Ibisobanuro By'Ingwate Ufite",
    labelSummary: "Incamake y'Umushinga Uzakoresha Aya Mafaranga",
    btnContinue: "Komeza Ushyireho Inyandiko →",
    btnNextSubmit: "Komeza Kureba Ibyo Wujuje Byaryo →",
    btnBack: "← Subira Inyuma",
    btnFinalSubmit: "Yemeza Kandi Wohereze Gusaba",
    uploadDesc: "Nyamuneka shyiraho fotokopi cyangwa impapuro z'izi nyandiko zikurikira:",
    fileAttached: "Byashyizweho",
    fileChange: "Hano Fresh",
    fileChoose: "Hitamo Idosiye",
    reviewTitle: "Subiramo Ibyo Wujuje Byaryo",
    reviewDesc: "Nyamuneka banza urebe neza ko amakuru n'izindi nyandiko washyizeho bikororotse neza mbere yo kwemeza.",
    reviewFiles: "Inyandiko Washyizeho",
    reviewNoFiles: "Nta nyandiko yongereweho",
    successMsg: "Gusaba inguzanyo byagenze neza cyane! Numero yawe ni:"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('en');
  const toggleLanguage = () => setLang((prev) => (prev === 'en' ? 'rw' : 'en'));
  const t = (key: string) => translations[lang][key as keyof typeof translations['en']] || key;

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLang must be used within a LanguageProvider');
  return context;
};