import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

export const translations = {
  en: {
    // Brand & Header
    brandTitle: 'ACAG ADMIN',
    brandSubtitle: 'APNI CHHAT APNA GHAR',
    subHeader: 'Government of Punjab Housing Program & Quality Monitoring Portal',
    dashboardOverview: 'Executive Dashboard Overview',
    dashboardDesc: 'Real-time monitoring and control for ACAG housing, loans, engineers, labour training & safety across Punjab',
    searchPlaceholder: 'Search house ID, owner, CNIC, district, engineer...',
    reportBtn: 'Export DPR',
    newProjectBtn: 'Schedule Visit',
    viewAll: 'View All',
    fullMap: 'Full GIS Map',
    layers: 'Layers',
    switchRole: 'Role:',
    logout: 'Sign Out',
    copyright: 'Government of Punjab — Housing, Urban Development & Public Health Engineering Department. All Rights Reserved',
    systemTitle: 'Government of Punjab - ACAG Construction Monitoring System',

    // Sidebar Navigation (Exact Specification)
    navDashboard: 'Dashboard',
    navHouses: 'Houses',
    navEngineerVisits: 'Engineer Visits',
    navEngineers: 'Engineers',
    navLabourManagement: 'Labour Management',
    navSafetyManagement: 'Safety Management',
    navEnvironmentalMonitoring: 'Environmental Monitoring',
    navAiHazards: 'AI Hazard Detection',
    navLoanManagement: 'Loan Management',
    navGisMap: 'GIS Map',
    navReportsAnalytics: 'Reports & Analytics',
    navUsers: 'Users',
    navNotifications: 'Notifications',
    navSettings: 'Settings',

    // Top Stats
    totalHouses: 'Total Houses',
    pendingApplications: 'Pending Applications',
    underConstruction: 'Under Construction',
    completedHouses: 'Completed Houses',
    pendingInspections: 'Pending Inspections',
    totalEngineers: 'Total Engineers',
    totalWorkers: 'Total Workers',
    openSafetyIssues: 'Open Safety Issues',

    // General Labels
    actions: 'Actions',
    status: 'Status',
    stage: 'Stage',
    owner: 'Owner',
    location: 'Location',
    engineer: 'Engineer',
    progress: 'Progress',
    loanStatus: 'Loan Status',
    safety: 'Safety',
    date: 'Date',
    details: 'Details',
    approve: 'Approve',
    reject: 'Reject',
    schedule: 'Schedule',
    disburse: 'Disburse Tranche',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    superAdmin: 'Super Administrator',
  },

  ur: {
    // Brand & Header
    brandTitle: 'اے سی اے جی ایڈمن',
    brandSubtitle: 'اپنی چھت اپنا گھر',
    subHeader: 'حکومت پنجاب ہاؤسنگ پروگرام و کوالٹی مانیٹرنگ پورٹل',
    dashboardOverview: 'ڈیش بورڈ جائزہ',
    dashboardDesc: 'پنجاب بھر میں اے سی اے جی مکانات، قرضہ جات، انجینئرز، لیبر ٹریننگ اور سیفٹی کا مکمل انتظام',
    searchPlaceholder: 'مکان نمبر، شناختی کارڈ، ضلع یا انجینئر تلاش کریں...',
    reportBtn: 'ڈی پی آر رپورٹ',
    newProjectBtn: 'معائنہ شیڈول کریں',
    viewAll: 'تمام دیکھیں',
    fullMap: 'مکمل جی آئی ایس نقشہ',
    layers: 'تہیں (Layers)',
    switchRole: 'کردار:',
    logout: 'لاگ آؤٹ',
    copyright: 'حکومت پنجاب — محکمہ ہاؤسنگ، اربن ڈویلپمنٹ و پبلک ہیلتھ انجینئرنگ',
    systemTitle: 'حکومت پنجاب - اپنی چھت اپنا گھر تعمیراتی مانیٹرنگ سسٹم',

    // Sidebar Navigation (Exact Specification)
    navDashboard: 'ڈیش بورڈ',
    navHouses: 'مکانات (Houses)',
    navEngineerVisits: 'معائناتی دورے (Engineer Visits)',
    navEngineers: 'انجینئرز (Engineers)',
    navLabourManagement: 'لیبر مینجمنٹ (Labour)',
    navSafetyManagement: 'سیفٹی مینجمنٹ (Safety)',
    navEnvironmentalMonitoring: 'ماحولیاتی مانیٹرنگ (Environmental)',
    navAiHazards: 'اے آئی خطرات کا سراغ (AI Hazards)',
    navLoanManagement: 'قرضہ جات کا انتظام (Loans)',
    navGisMap: 'جی آئی ایس نقشہ (GIS Map)',
    navReportsAnalytics: 'رپورٹس و اینالیٹکس (Reports)',
    navUsers: 'صارفین (Users)',
    navNotifications: 'اطلاعات (Notifications)',
    navSettings: 'ترتیبات (Settings)',

    // Top Stats
    totalHouses: 'کل مکانات',
    pendingApplications: 'زیر التواء درخواستیں',
    underConstruction: 'زیر تعمیر مکانات',
    completedHouses: 'مکمل شدہ مکانات',
    pendingInspections: 'زیر التواء معائنہ جات',
    totalEngineers: 'کل انجینئرز',
    totalWorkers: 'کل ورکرز',
    openSafetyIssues: 'سیفٹی کے مسائل',

    // General Labels
    actions: 'اقدامات',
    status: 'حیثیت',
    stage: 'مرحلہ',
    owner: 'مالک',
    location: 'مقام',
    engineer: 'نگران انجینئر',
    progress: 'پیش رفت',
    loanStatus: 'قرض کی کیفیت',
    safety: 'حفاظتی حالت',
    date: 'تاریخ',
    details: 'تفصیلات',
    approve: 'منظور کریں',
    reject: 'مسترد کریں',
    schedule: 'شیڈول کریں',
    disburse: 'قسط جاری کریں',
    saveChanges: 'محفوظ کریں',
    cancel: 'منسوخ کریں',
    superAdmin: 'سپر ایڈمنسٹریٹر',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('app_language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('app_language', language);
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  const isRTL = language === 'ur';

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ur' : 'en'));
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, changeLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
