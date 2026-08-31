import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

export const translations = {
  en: {
    // Brand & Header
    brandTitle: 'ACAG',
    brandSubtitle: 'APNI CHHAT APNA GHAR',
    subHeader: 'Punjab Construction Inspection & Quality Monitoring Portal',
    dashboardOverview: 'Dashboard Overview',
    dashboardDesc: 'Real-time monitoring and analytics for ACAG projects across Punjab',
    searchPlaceholder: 'Search projects, districts...',
    reportBtn: 'Report',
    newProjectBtn: 'New Project',
    viewAll: 'View All',
    fullMap: 'Full Map',
    layers: 'Layers',
    switchRole: 'Role:',
    logout: 'Sign Out',
    copyright: 'Copyright © 2026 Urban Unit & Bank of Punjab . All Rights Reserved',
    systemTitle: 'Government of Punjab - ACAG Construction Monitoring System',

    // Sidebar Navigation Categories
    secOverview: 'OVERVIEW',
    secAnalytics: 'ANALYTICS',
    secManagement: 'MANAGEMENT',
    secAdmin: 'ADMIN',

    navDashboard: 'Dashboard',
    navMisOverview: 'MIS Overview',
    navGisMonitoring: 'GIS Monitoring',
    navReportsAnalytics: 'Reports & Analytics',
    navAiProgress: 'AI & Progress',
    navAllProjects: 'All Projects',
    navHouseOwners: 'House Owners',
    navEngineers: 'Engineers',
    navProject360: 'Project 360°',
    navHandoverPayments: 'Handover & Payments',
    navNotifications: 'Notifications',
    navSystemSettings: 'System Settings',

    // Notifications Page
    notificationsTitle: 'Notifications & Alerts',
    notificationsDesc: 'Real-time system alerts and project notifications',
    markAllRead: 'Mark All Read',
    preferences: 'Preferences',
    filterAll: 'All Notifications',
    filterUnread: 'Unread',
    filterCritical: 'Critical',
    filterWarnings: 'Warnings',
    filterSuccess: 'Success',
    unreadCount: 'UNREAD',
    criticalCount: 'CRITICAL',
    warningsCount: 'WARNINGS',
    infoCount: 'INFO',
    criticalBadge: 'Critical',
    warningBadge: 'Warning',
    successBadge: 'Success',
    infoBadge: 'Info',

    // System Settings Page
    settingsTitle: 'System Settings',
    settingsDesc: 'Configure application preferences, users, and integrations',
    saveChangesBtn: 'Save Changes',
    tabGeneral: 'General',
    tabUsersRoles: 'Users & Roles',
    tabSecurity: 'Security',
    tabNotifications: 'Notifications',
    tabDataBackups: 'Data & Backups',
    secOrgInfo: 'Organization Information',
    orgName: 'Organization Name',
    province: 'Province',
    contactEmail: 'Contact Email',
    contactPhone: 'Contact Phone',
    secSystemPrefs: 'System Preferences',
    darkMode: 'Dark Mode',
    darkModeDesc: 'Switch to dark theme',
    language: 'Language',
    languageDesc: 'Application display language',
    timezone: 'Timezone',
    timezoneDesc: 'Pakistan Standard Time (UTC+5)',
    autoSave: 'Auto-save',
    autoSaveDesc: 'Automatically save changes every 30 seconds',
    userManagement: 'User Management',
    inviteNewUser: 'Invite New User',
    secPasswordAuth: 'Password & Authentication',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    updatePasswordBtn: 'Update Password',
    secAccessControls: 'Access Controls',
    twoFactorAuth: 'Two-Factor Authentication',
    twoFactorDesc: 'Require OTP for admin logins',
    sessionTimeout: 'Session Timeout',
    sessionTimeoutDesc: 'Auto-logout after 30 minutes of inactivity',
    ipWhitelist: 'IP Whitelist',
    ipWhitelistDesc: 'Restrict logins to approved IP ranges',
    auditLog: 'Audit Log',
    auditLogDesc: 'Record all admin actions and changes',

    // All Projects Management Page
    allProjectsTitle: 'All Projects Management',
    allProjectsDesc: 'Complete list of ACAG housing projects across Punjab',
    filterBtn: 'Filter',
    exportBtn: 'Export',
    addProjectBtn: 'Add Project',
    searchProjectsPlaceholder: 'Search by ID, name, division...',
    filterAllProjects: 'All',
    filterCompleted: 'Completed',
    filterInProgress: 'In Progress',
    filterDelayed: 'Delayed',
    filterOnHold: 'On Hold',
    cardTotalProjects: 'TOTAL PROJECTS',
    cardCompleted: 'COMPLETED',
    cardInProgress: 'IN PROGRESS',
    cardDelayed: 'DELAYED',
    colHouseId: 'HOUSE ID',
    colProjectName: 'PROJECT NAME',
    colDivision: 'DIVISION',
    colEngineer: 'ENGINEER',
    colProgress: 'PROGRESS',
    colBudget: 'BUDGET',
    colStatus: 'STATUS',
    colActions: 'ACTIONS',
    statusCompleted: 'Completed',
    statusInProgress: 'In Progress',
    statusDelayed: 'Delayed',
    statusOnHold: 'On Hold',
    showingResults: 'Showing',
    toResults: 'to',
    ofResults: 'of',
    resultsTotal: 'results',
    prevPage: 'Previous',
    nextPage: 'Next',
    activeProjects: 'ACTIVE PROJECTS',
    engineers: 'ENGINEERS',
    houseOwners: 'HOUSE OWNERS',
    aiValidations: 'AI VALIDATIONS',
    pendingInsp: 'PENDING INSP.',
    stable: 'Stable',
    newBadge: 'New',
    highRisk: 'High',

    // GIS & Charts
    gisTitle: 'GIS — Project Locations',
    gisSubtitle: 'Punjab region — live project pin map',
    statusDistribution: 'Status Distribution',
    monthlyActivity: 'Monthly Activity',
    monthlyActivitySubtitle: 'Inspections and completions — last 6 months',
    inspectionsLegend: 'Inspections',
    completionsLegend: 'Completions',
    constructionStages: 'Construction Stages',
    recentActivity: 'Recent Activity',
    recentActivitySubtitle: 'Latest project updates across divisions',

    // Stages
    stageFoundation: 'Foundation',
    stagePlinth: 'Plinth',
    stageLintel: 'Lintel',
    stageRoofCast: 'Roof Cast.',
    stageFinishing: 'Finishing',
    stageCompleted: 'Completed',

    // Table Headers
    houseId: 'HOUSE ID',
    location: 'LOCATION',
    stage: 'STAGE',
    status: 'STATUS',
    date: 'DATE',
    actions: 'ACTIONS',

    // Statuses
    handedOver: 'Handed Over',
    pendingHandover: 'Pending Handover',
    underConstruction: 'Under Construction',
    completed: 'Completed',

    // Auth & Demo Logins
    signIn: 'Sign In to Workspace',
    username: 'Username',
    password: 'Password',
    quickDemoLogins: '⚡ Quick Demo Logins (1-Click)',
    localTestingReady: 'Local Testing Ready',
    adminRole: 'Admin (Harram / Supervisor)',
    reviewerRole: 'Backend Review Engineer (Yahya)',
    engineerRole: 'Field Engineer (Shoaib)',
    ownerRole: 'House Owner (Beneficiary)',
    loginError: 'Invalid credentials. Please check username and password.',
    langEnglish: 'English',
    langUrdu: 'اردو',
    superAdmin: 'Super Administrator',
  },

  ur: {
    // Brand & Header
    brandTitle: 'اے سی اے جی',
    brandSubtitle: 'اپنی چھت اپنا گھر',
    subHeader: 'پنجاب تعمیراتی معائنہ اور کوالٹی مانیٹرنگ پورٹل',
    dashboardOverview: 'ڈیش بورڈ اوور ویو',
    dashboardDesc: 'پنجاب بھر میں اے سی اے جی منصوبوں کی لائیو مانیٹرنگ اور تجزیات',
    searchPlaceholder: 'منصوبہ یا ضلع تلاش کریں...',
    reportBtn: 'رپورٹ',
    newProjectBtn: 'نیا منصوبہ',
    viewAll: 'تمام دیکھیں',
    fullMap: 'مکمل نقشہ',
    layers: 'تہیں (Layers)',
    switchRole: 'کردار:',
    logout: 'لاگ آؤٹ',
    copyright: 'حقوق اشاعت © 2026 اربن یونٹ اور بینک آف پنجاب . جملہ حقوق محفوظ ہیں',
    systemTitle: 'حکومت پنجاب - اپنی چھت اپنا گھر تعمیراتی مانیٹرنگ سسٹم',

    // Sidebar Navigation Categories
    secOverview: 'اوور ویو',
    secAnalytics: 'تجزیات و اینالیٹکس',
    secManagement: 'انتظام و مانیٹرنگ',
    secAdmin: 'ایڈمن کنٹرول',

    navDashboard: 'ڈیش بورڈ',
    navMisOverview: 'ایم آئی ایس جائزہ',
    navGisMonitoring: 'جی آئی ایس مانیٹرنگ',
    navReportsAnalytics: 'رپورٹس و اینالیٹکس',
    navAiProgress: 'اے آئی اور پیش رفت',
    navAllProjects: 'تمام منصوبے',
    navHouseOwners: 'مکانات کے مالکان',
    navEngineers: 'فیلڈ انجینئرز',
    navProject360: 'پروجیکٹ 360°',
    navHandoverPayments: 'ہینڈ اوور و ادائیگیاں',
    navNotifications: 'اطلاعات (نوٹیفکیشنز)',
    navSystemSettings: 'سسٹم سیٹنگز',

    // Notifications Page
    notificationsTitle: 'اطلاعات اور انتباہات (Notifications & Alerts)',
    notificationsDesc: 'ریئل ٹائم سسٹم الرٹس اور منصوبوں کے نوٹیفکیشنز',
    markAllRead: 'تمام پڑھا ہوا نشان لگائیں',
    preferences: 'ترجیحات',
    filterAll: 'تمام اطلاعات',
    filterUnread: 'غیر پڑھا ہوا',
    filterCritical: 'انتہائی اہم (Critical)',
    filterWarnings: 'انتباہات (Warnings)',
    filterSuccess: 'کامیابی (Success)',
    unreadCount: 'غیر پڑھا ہوا',
    criticalCount: 'انتہائی اہم',
    warningsCount: 'انتباہات',
    infoCount: 'معلومات',
    criticalBadge: 'انتہائی اہم',
    warningBadge: 'انتباہ',
    successBadge: 'کامیابی',
    infoBadge: 'معلومات',

    // System Settings Page
    settingsTitle: 'سسٹم سیٹنگز (System Settings)',
    settingsDesc: 'ایپلیکیشن ترجیحات، صارفین اور سیکیورٹی کی ترتیبات مرتب کریں',
    saveChangesBtn: 'تبدیلیاں محفوظ کریں',
    tabGeneral: 'عمومی (General)',
    tabUsersRoles: 'صارفین اور اختیارات (Users & Roles)',
    tabSecurity: 'سیکیورٹی (Security)',
    tabNotifications: 'اطلاعات (Notifications)',
    tabDataBackups: 'ڈیٹا اور بیک اپ (Data & Backups)',
    secOrgInfo: 'ادارے کی معلومات',
    orgName: 'ادارے کا نام',
    province: 'صوبہ',
    contactEmail: 'رابطہ ای میل',
    contactPhone: 'رابطہ فون نمبر',
    secSystemPrefs: 'سسٹم کی ترجیحات',
    darkMode: 'ڈارک موڈ (Dark Mode)',
    darkModeDesc: 'ڈارک تھیم پر منتقل کریں',
    language: 'زبان (Language)',
    languageDesc: 'ایپلیکیشن کی ڈسپلے زبان',
    timezone: 'ٹائم زون (Timezone)',
    timezoneDesc: 'پاکستان کا معیاری وقت (UTC+5)',
    autoSave: 'خودکار محفوظ (Auto-save)',
    autoSaveDesc: 'ہر 30 سیکنڈ بعد خودکار محفوظ کریں',
    userManagement: 'صارفین کا انتظام',
    inviteNewUser: 'نیا صارف شامل کریں',
    secPasswordAuth: 'پاس ورڈ اور تصدیق',
    currentPassword: 'موجودہ پاس ورڈ',
    newPassword: 'نیا پاس ورڈ',
    confirmPassword: 'پاس ورڈ کی تصدیق کریں',
    updatePasswordBtn: 'پاس ورڈ تبدیل کریں',
    secAccessControls: 'رسائی کے کنٹرولز (Access Controls)',
    twoFactorAuth: 'ٹو فیکٹر تصدیق (2FA)',
    twoFactorDesc: 'ایڈمن لاگ ان کیلئے او ٹی پی ضروری ہے',
    sessionTimeout: 'سیشن ٹائم آؤٹ',
    sessionTimeoutDesc: '30 منٹ غیر فعال رہنے پر خودکار لاگ آؤٹ',
    ipWhitelist: 'آئی پی وائٹ لسٹ (IP Whitelist)',
    ipWhitelistDesc: 'صرف منظور شدہ آئی پی سے لاگ ان کی اجازت دیں',
    auditLog: 'آڈٹ لاگ (Audit Log)',
    auditLogDesc: 'تمام ایڈمن سرگرمیوں کا ریکارڈ محفوظ رکھیں',

    // All Projects Management Page
    allProjectsTitle: 'تمام منصوبوں کا انتظام (All Projects Management)',
    allProjectsDesc: 'پنجاب بھر میں اے سی اے جی ہاؤسنگ منصوبوں کی مکمل فہرست',
    filterBtn: 'فلٹر',
    exportBtn: 'ایکسپورٹ (Export)',
    addProjectBtn: 'نیا منصوبہ شامل کریں',
    searchProjectsPlaceholder: 'آئی ڈی، نام یا ڈویژن سے تلاش کریں...',
    filterAllProjects: 'تمام',
    filterCompleted: 'مکمل شدہ',
    filterInProgress: 'جاری ہے (In Progress)',
    filterDelayed: 'تاخیر کا شکار (Delayed)',
    filterOnHold: 'معطل (On Hold)',
    cardTotalProjects: 'کل منصوبے',
    cardCompleted: 'مکمل شدہ',
    cardInProgress: 'جاری منصوبے',
    cardDelayed: 'تاخیر شدہ',
    colHouseId: 'گھر کا نمبر (ID)',
    colProjectName: 'منصوبے کا نام',
    colDivision: 'ڈویژن',
    colEngineer: 'نگران انجینئر',
    colProgress: 'پیش رفت',
    colBudget: 'بجٹ',
    colStatus: 'حیثیت',
    colActions: 'اقدامات',
    statusCompleted: 'مکمل شدہ',
    statusInProgress: 'جاری ہے',
    statusDelayed: 'تاخیر شدہ',
    statusOnHold: 'معطل',
    showingResults: 'دکھائے جا رہے ہیں',
    toResults: 'سے',
    ofResults: 'کل',
    resultsTotal: 'نتائج',
    prevPage: 'پچھلا صفحہ',
    nextPage: 'اگلا صفحہ',
    activeProjects: 'فعال منصوبے',
    engineers: 'انجینئرز',
    houseOwners: 'مکان مالکان',
    aiValidations: 'اے آئی تصدیقات',
    pendingInsp: 'زیر التواء معائنہ',
    stable: 'مستحکم',
    newBadge: 'نیا',
    highRisk: 'زیادہ',

    // GIS & Charts
    gisTitle: 'جی آئی ایس — منصوبوں کے مقامات',
    gisSubtitle: 'پنجاب ریجن — لائیو پروجیکٹ پن میپ',
    statusDistribution: 'حیثیت کی تقسیم',
    monthlyActivity: 'ماہانہ سرگرمی',
    monthlyActivitySubtitle: 'معائنہ جات اور تکمیلات — گزشتہ 6 ماہ',
    inspectionsLegend: 'معائنہ جات',
    completionsLegend: 'تکمیلات',
    constructionStages: 'تعمیراتی مراحل',
    recentActivity: 'حالیہ سرگرمی',
    recentActivitySubtitle: 'تمام ڈویژنز میں تازہ ترین پیش رفت',

    // Stages
    stageFoundation: 'بنیاد (Foundation)',
    stagePlinth: 'پلنتھ (Plinth)',
    stageLintel: 'لینٹل لیول',
    stageRoofCast: 'چھت کی ڈھلائی',
    stageFinishing: 'فنشنگ',
    stageCompleted: 'مکمل شدہ',

    // Table Headers
    houseId: 'گھر کا نمبر (ID)',
    location: 'مقام',
    stage: 'مرحلہ',
    status: 'حیثیت',
    date: 'تاریخ',
    actions: 'اقدامات',

    // Statuses
    handedOver: 'ہینڈ اوور مکمل',
    pendingHandover: 'زیر التواء ہینڈ اوور',
    underConstruction: 'زیر تعمیر',
    completed: 'مکمل',

    // Auth & Demo Logins
    signIn: 'ورک اسپیس میں داخل ہوں',
    username: 'صارف نام',
    password: 'پاس ورڈ',
    quickDemoLogins: '⚡ فوری ڈیمو لاگ ان (ایک کلک)',
    localTestingReady: 'مقامی ٹیسٹنگ کے لیے تیار',
    adminRole: 'ایڈمن (حرم / سپروائزر)',
    reviewerRole: 'بیک اینڈ ریویو انجینئر (یحییٰ)',
    engineerRole: 'فیلڈ انجینئر (شعیب)',
    ownerRole: 'مکان کا مالک (مستفید)',
    loginError: 'غلط معلومات۔ برائے مہربانی درست صارف نام اور پاس ورڈ درج کریں۔',
    langEnglish: 'English',
    langUrdu: 'اردو',
    superAdmin: 'سپر ایڈمنسٹریٹر',
  },
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

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, isRTL }}>
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
