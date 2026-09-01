import React, { createContext, useContext, useState, useEffect } from 'react';

const DashboardDataContext = createContext(null);

// Initial Mock Data with Realistic Punjab Housing Information
const INITIAL_HOUSES = [
  {
    id: 'ACAG-L-4521',
    caseId: 'ACAG-L-4521',
    ownerName: 'Muhammad Arshad',
    ownerPhone: '+92 300 4521890',
    ownerCnic: '35202-8941235-1',
    division: 'Lahore',
    district: 'Lahore',
    tehsil: 'Shalimar',
    address: 'Plot 42, Block B, Jallo Park Housing, Lahore',
    lat: 31.5892,
    lng: 74.4521,
    plotSizeMarla: 5,
    coveredAreaSqft: 1125,
    stage: 'Completed',
    status: 'Completed',
    progressPct: 100,
    loanApproved: 1500000,
    loanDisbursed: 1500000,
    remainingLoan: 0,
    loanStatus: 'Completed',
    engineerId: 1,
    engineerName: 'Shoaib Akhtar',
    safetyStatus: 'Safe',
    safetyIssuesCount: 0,
    environmentalRisk: 'Low',
    temperature: 33,
    weather: 'Clear',
    photoUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-01-15',
    lastInspectionDate: '2026-05-15',
    workersCount: 6,
    trainedWorkersCount: 6,
  },
  {
    id: 'ACAG-R-2210',
    caseId: 'ACAG-R-2210',
    ownerName: 'Tariq Mehmood',
    ownerPhone: '+92 312 8765432',
    ownerCnic: '37405-2345678-3',
    division: 'Rawalpindi',
    district: 'Rawalpindi',
    tehsil: 'Taxila',
    address: 'Street 9, Sector C, Model Town, Taxila',
    lat: 33.7463,
    lng: 72.8397,
    plotSizeMarla: 5,
    coveredAreaSqft: 1100,
    stage: 'Finishing',
    status: 'Under Construction',
    progressPct: 88,
    loanApproved: 1500000,
    loanDisbursed: 1125000,
    remainingLoan: 375000,
    loanStatus: '3rd Tranche Disbursed',
    engineerId: 2,
    engineerName: 'Bilal Ahmed',
    safetyStatus: 'Minor Issue',
    safetyIssuesCount: 1,
    environmentalRisk: 'Medium',
    temperature: 29,
    weather: 'Sunny',
    photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18015f5?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-02-10',
    lastInspectionDate: '2026-05-18',
    workersCount: 5,
    trainedWorkersCount: 4,
  },
  {
    id: 'ACAG-F-1187',
    caseId: 'ACAG-F-1187',
    ownerName: 'Zahid Hussain',
    ownerPhone: '+92 321 9876543',
    ownerCnic: '33100-3456789-5',
    division: 'Faisalabad',
    district: 'Faisalabad',
    tehsil: 'Saddar',
    address: 'Near Chak 204 RB, Sargodha Road, Faisalabad',
    lat: 31.4504,
    lng: 73.1350,
    plotSizeMarla: 3.5,
    coveredAreaSqft: 850,
    stage: 'Roof',
    status: 'Under Construction',
    progressPct: 65,
    loanApproved: 1200000,
    loanDisbursed: 800000,
    remainingLoan: 400000,
    loanStatus: '2nd Tranche Disbursed',
    engineerId: 3,
    engineerName: 'Ayesha Mir',
    safetyStatus: 'Safe',
    safetyIssuesCount: 0,
    environmentalRisk: 'High',
    temperature: 38,
    weather: 'Heatwave',
    photoUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-02-28',
    lastInspectionDate: '2026-05-20',
    workersCount: 7,
    trainedWorkersCount: 5,
  },
  {
    id: 'ACAG-M-0934',
    caseId: 'ACAG-M-0934',
    ownerName: 'Farooq Qureshi',
    ownerPhone: '+92 301 2345678',
    ownerCnic: '36302-1234567-7',
    division: 'Multan',
    district: 'Multan',
    tehsil: 'Multan City',
    address: 'Mohallah Shah Rukn-e-Alam, Phase 2, Multan',
    lat: 30.1984,
    lng: 71.4687,
    plotSizeMarla: 5,
    coveredAreaSqft: 1150,
    stage: 'Completed',
    status: 'Completed',
    progressPct: 100,
    loanApproved: 1500000,
    loanDisbursed: 1500000,
    remainingLoan: 0,
    loanStatus: 'Completed',
    engineerId: 4,
    engineerName: 'Usman Ali',
    safetyStatus: 'Safe',
    safetyIssuesCount: 0,
    environmentalRisk: 'Medium',
    temperature: 40,
    weather: 'Hot',
    photoUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-01-05',
    lastInspectionDate: '2026-04-28',
    workersCount: 4,
    trainedWorkersCount: 4,
  },
  {
    id: 'ACAG-G-2567',
    caseId: 'ACAG-G-2567',
    ownerName: 'Ghulam Rasool',
    ownerPhone: '+92 333 8765123',
    ownerCnic: '34101-5678901-9',
    division: 'Gujranwala',
    district: 'Gujranwala',
    tehsil: 'Kamoke',
    address: 'Near GT Road Toll Plaza, Kamoke, Gujranwala',
    lat: 32.0336,
    lng: 74.2230,
    plotSizeMarla: 5,
    coveredAreaSqft: 1100,
    stage: 'Structure',
    status: 'Under Construction',
    progressPct: 45,
    loanApproved: 1500000,
    loanDisbursed: 600000,
    remainingLoan: 900000,
    loanStatus: '1st Tranche Disbursed',
    engineerId: 1,
    engineerName: 'Shoaib Akhtar',
    safetyStatus: 'Critical Issue',
    safetyIssuesCount: 2,
    environmentalRisk: 'High',
    temperature: 32,
    weather: 'Windy',
    photoUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-03-12',
    lastInspectionDate: '2026-05-22',
    workersCount: 6,
    trainedWorkersCount: 3,
  },
  {
    id: 'ACAG-B-3109',
    caseId: 'ACAG-B-3109',
    ownerName: 'Abdul Sattar',
    ownerPhone: '+92 306 7654321',
    ownerCnic: '31202-6789012-3',
    division: 'Bahawalpur',
    district: 'Bahawalpur',
    tehsil: 'Ahmedpur East',
    address: 'Chak 12/BC, Bahawalpur',
    lat: 29.3544,
    lng: 71.6911,
    plotSizeMarla: 3.5,
    coveredAreaSqft: 800,
    stage: 'Foundation',
    status: 'Under Construction',
    progressPct: 25,
    loanApproved: 1200000,
    loanDisbursed: 400000,
    remainingLoan: 800000,
    loanStatus: '1st Tranche Disbursed',
    engineerId: 4,
    engineerName: 'Usman Ali',
    safetyStatus: 'Safe',
    safetyIssuesCount: 0,
    environmentalRisk: 'Low',
    temperature: 36,
    weather: 'Clear',
    photoUrl: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-04-01',
    lastInspectionDate: '2026-05-10',
    workersCount: 5,
    trainedWorkersCount: 4,
  },
  {
    id: 'ACAG-S-4012',
    caseId: 'ACAG-S-4012',
    ownerName: 'Rashid Minhas',
    ownerPhone: '+92 345 6789012',
    ownerCnic: '38403-7890123-5',
    division: 'Sargodha',
    district: 'Sargodha',
    tehsil: 'Bhalwal',
    address: 'Main Bazar, Kot Momin Road, Bhalwal',
    lat: 32.2742,
    lng: 72.9022,
    plotSizeMarla: 5,
    coveredAreaSqft: 1100,
    stage: 'Foundation',
    status: 'Approved',
    progressPct: 15,
    loanApproved: 1500000,
    loanDisbursed: 0,
    remainingLoan: 1500000,
    loanStatus: 'Approved - Pending 1st Tranche',
    engineerId: 3,
    engineerName: 'Ayesha Mir',
    safetyStatus: 'Safe',
    safetyIssuesCount: 0,
    environmentalRisk: 'Low',
    temperature: 31,
    weather: 'Partly Cloudy',
    photoUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-04-18',
    lastInspectionDate: null,
    workersCount: 3,
    trainedWorkersCount: 2,
  },
  {
    id: 'ACAG-K-5501',
    caseId: 'ACAG-K-5501',
    ownerName: 'Imran Ashraf',
    ownerPhone: '+92 308 1234567',
    ownerCnic: '35102-8901234-7',
    division: 'Lahore',
    district: 'Kasur',
    tehsil: 'Chunian',
    address: 'Near Railway Crossing, Chunian, Kasur',
    lat: 30.9639,
    lng: 73.9803,
    plotSizeMarla: 3.5,
    coveredAreaSqft: 850,
    stage: 'Electrical',
    status: 'Under Construction',
    progressPct: 75,
    loanApproved: 1200000,
    loanDisbursed: 800000,
    remainingLoan: 400000,
    loanStatus: '2nd Tranche Disbursed',
    engineerId: 1,
    engineerName: 'Shoaib Akhtar',
    safetyStatus: 'Safe',
    safetyIssuesCount: 0,
    environmentalRisk: 'Medium',
    temperature: 34,
    weather: 'Clear',
    photoUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-02-14',
    lastInspectionDate: '2026-05-19',
    workersCount: 5,
    trainedWorkersCount: 5,
  },
  {
    id: 'ACAG-P-6612',
    caseId: 'ACAG-P-6612',
    ownerName: 'Shahid Iqbal',
    ownerPhone: '+92 315 9012345',
    ownerCnic: '35302-9012345-9',
    division: 'Sahiwal',
    district: 'Okara',
    tehsil: 'Depalpur',
    address: 'Katcheri Road, Depalpur, Okara',
    lat: 30.6706,
    lng: 73.6534,
    plotSizeMarla: 5,
    coveredAreaSqft: 1100,
    stage: 'Plumbing',
    status: 'Under Construction',
    progressPct: 80,
    loanApproved: 1500000,
    loanDisbursed: 1125000,
    remainingLoan: 375000,
    loanStatus: '3rd Tranche Disbursed',
    engineerId: 2,
    engineerName: 'Bilal Ahmed',
    safetyStatus: 'Safe',
    safetyIssuesCount: 0,
    environmentalRisk: 'Low',
    temperature: 35,
    weather: 'Sunny',
    photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18015f5?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-02-20',
    lastInspectionDate: '2026-05-21',
    workersCount: 6,
    trainedWorkersCount: 6,
  },
  {
    id: 'ACAG-R-7789',
    caseId: 'ACAG-R-7789',
    ownerName: 'Nasir Abbas',
    ownerPhone: '+92 334 0123456',
    ownerCnic: '31301-0123456-1',
    division: 'Bahawalpur',
    district: 'Rahim Yar Khan',
    tehsil: 'Sadiqabad',
    address: 'Manzoor Colony, Sadiqabad, RYK',
    lat: 28.3090,
    lng: 70.1287,
    plotSizeMarla: 3.5,
    coveredAreaSqft: 820,
    stage: 'Foundation',
    status: 'Pending',
    progressPct: 0,
    loanApproved: 1200000,
    loanDisbursed: 0,
    remainingLoan: 1200000,
    loanStatus: 'Under Verification',
    engineerId: null,
    engineerName: 'Unassigned',
    safetyStatus: 'Safe',
    safetyIssuesCount: 0,
    environmentalRisk: 'High',
    temperature: 42,
    weather: 'Extreme Heat',
    photoUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-05-01',
    lastInspectionDate: null,
    workersCount: 0,
    trainedWorkersCount: 0,
  },
  {
    id: 'ACAG-L-8820',
    caseId: 'ACAG-L-8820',
    ownerName: 'Khurram Shehzad',
    ownerPhone: '+92 300 1122334',
    ownerCnic: '35201-1122334-5',
    division: 'Lahore',
    district: 'Lahore',
    tehsil: 'Cantonment',
    address: 'Near Bedian Road, Bhatta Chowk, Lahore',
    lat: 31.4820,
    lng: 74.4120,
    plotSizeMarla: 5,
    coveredAreaSqft: 1100,
    stage: 'Foundation',
    status: 'Rejected',
    progressPct: 0,
    loanApproved: 0,
    loanDisbursed: 0,
    remainingLoan: 0,
    loanStatus: 'Rejected - Land Title Dispute',
    engineerId: null,
    engineerName: 'Unassigned',
    safetyStatus: 'Safe',
    safetyIssuesCount: 0,
    environmentalRisk: 'Low',
    temperature: 33,
    weather: 'Clear',
    photoUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-04-10',
    lastInspectionDate: null,
    workersCount: 0,
    trainedWorkersCount: 0,
  },
  {
    id: 'ACAG-S-9911',
    caseId: 'ACAG-S-9911',
    ownerName: 'Waqas Munir',
    ownerPhone: '+92 322 2233445',
    ownerCnic: '34601-2233445-7',
    division: 'Gujranwala',
    district: 'Sialkot',
    tehsil: 'Daska',
    address: 'Pasrur Road, Daska, Sialkot',
    lat: 32.3243,
    lng: 74.3503,
    plotSizeMarla: 5,
    coveredAreaSqft: 1120,
    stage: 'Roof',
    status: 'Under Construction',
    progressPct: 60,
    loanApproved: 1500000,
    loanDisbursed: 800000,
    remainingLoan: 700000,
    loanStatus: '2nd Tranche Disbursed',
    engineerId: 2,
    engineerName: 'Bilal Ahmed',
    safetyStatus: 'Critical Issue',
    safetyIssuesCount: 1,
    environmentalRisk: 'Critical',
    temperature: 30,
    weather: 'Heavy Rainfall Warning',
    photoUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-02-18',
    lastInspectionDate: '2026-05-23',
    workersCount: 6,
    trainedWorkersCount: 4,
  }
];

const INITIAL_ENGINEERS = [
  {
    id: 1,
    name: 'Engr. Shoaib Akhtar',
    contact: '+92 300 5551234',
    email: 'shoaib.akhtar@acag.punjab.gov.pk',
    pecNo: 'PEC-CIVIL-45210',
    assignedDivision: 'Lahore & Gujranwala',
    assignedHouses: ['ACAG-L-4521', 'ACAG-G-2567', 'ACAG-K-5501'],
    assignedHousesCount: 3,
    completedVisits: 48,
    pendingVisits: 2,
    trainingSessionsConducted: 24,
    workersTrained: 82,
    status: 'Active',
    rating: 4.9,
    safetyComplianceScore: 94,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    name: 'Engr. Bilal Ahmed',
    contact: '+92 312 4445678',
    email: 'bilal.ahmed@acag.punjab.gov.pk',
    pecNo: 'PEC-CIVIL-38921',
    assignedDivision: 'Rawalpindi & Gujranwala',
    assignedHouses: ['ACAG-R-2210', 'ACAG-P-6612', 'ACAG-S-9911'],
    assignedHousesCount: 3,
    completedVisits: 42,
    pendingVisits: 1,
    trainingSessionsConducted: 19,
    workersTrained: 65,
    status: 'Active',
    rating: 4.8,
    safetyComplianceScore: 91,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    name: 'Engr. Ayesha Mir',
    contact: '+92 321 3337890',
    email: 'ayesha.mir@acag.punjab.gov.pk',
    pecNo: 'PEC-CIVIL-51204',
    assignedDivision: 'Faisalabad & Sargodha',
    assignedHouses: ['ACAG-F-1187', 'ACAG-S-4012'],
    assignedHousesCount: 2,
    completedVisits: 36,
    pendingVisits: 3,
    trainingSessionsConducted: 18,
    workersTrained: 54,
    status: 'Active',
    rating: 4.95,
    safetyComplianceScore: 98,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    name: 'Engr. Usman Ali',
    contact: '+92 333 2228901',
    email: 'usman.ali@acag.punjab.gov.pk',
    pecNo: 'PEC-CIVIL-41982',
    assignedDivision: 'Multan & Bahawalpur',
    assignedHouses: ['ACAG-M-0934', 'ACAG-B-3109'],
    assignedHousesCount: 2,
    completedVisits: 39,
    pendingVisits: 1,
    trainingSessionsConducted: 21,
    workersTrained: 70,
    status: 'Active',
    rating: 4.75,
    safetyComplianceScore: 89,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 5,
    name: 'Engr. Hamza Farooq',
    contact: '+92 345 1119012',
    email: 'hamza.farooq@acag.punjab.gov.pk',
    pecNo: 'PEC-CIVIL-60193',
    assignedDivision: 'Sahiwal & D.G Khan',
    assignedHouses: [],
    assignedHousesCount: 0,
    completedVisits: 15,
    pendingVisits: 0,
    trainingSessionsConducted: 8,
    workersTrained: 28,
    status: 'On Leave',
    rating: 4.6,
    safetyComplianceScore: 88,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  }
];

const INITIAL_VISITS = [
  {
    id: 'VST-2026-089',
    houseId: 'ACAG-G-2567',
    houseAddress: 'GT Road, Kamoke, Gujranwala',
    engineerId: 1,
    engineerName: 'Engr. Shoaib Akhtar',
    visitType: 'Safety Inspection',
    visitDate: '2026-05-22',
    visitTime: '10:30 AM',
    status: 'Completed',
    purpose: 'Verify structural steel binding and inspect worker scaffolding safety',
    progressPctReported: 45,
    workersPresent: 6,
    trainingProvided: {
      topic: 'Scaffold Safety & Working at Height',
      durationMinutes: 45,
      attendees: ['Muhammad Khan', 'Aslam Pervez', 'Bashir Ahmed'],
      evidenceUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
    },
    safetyChecklist: {
      helmetsWorn: false,
      safetyHarness: false,
      properScaffolding: false,
      electricalGrounding: true,
      firstAidAvailable: true,
    },
    environmentalConditions: {
      temperature: 32,
      humidity: '58%',
      windSpeed: '24 km/h',
      rainRisk: 'Low',
    },
    issuesFound: [
      'Workers observed working on 2nd tier scaffolding without safety harness',
      'Unsecured wooden planks on scaffolding'
    ],
    engineerRemarks: 'Construction paused until compliant scaffolding brackets and harness lines are installed.',
    photos: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb18015f5?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80'
    ],
    aiHazardResult: {
      hasHazard: true,
      hazardType: 'Working at height without harness & Unsafe scaffolding',
      confidence: 94.2,
      boundingBox: { x: 35, y: 25, width: 40, height: 50 },
    },
    adminApproved: false,
    reInspectionRequired: true,
  },
  {
    id: 'VST-2026-088',
    houseId: 'ACAG-S-9911',
    houseAddress: 'Pasrur Road, Daska, Sialkot',
    engineerId: 2,
    engineerName: 'Engr. Bilal Ahmed',
    visitType: 'Progress Verification',
    visitDate: '2026-05-23',
    visitTime: '02:00 PM',
    status: 'Completed',
    purpose: 'Roof shuttering inspection prior to concrete pouring tranche release',
    progressPctReported: 60,
    workersPresent: 6,
    trainingProvided: {
      topic: 'Concrete Pouring & PPE Safety',
      durationMinutes: 30,
      attendees: ['Rashid Ali', 'Zafar Iqbal', 'Nadeem Akhtar'],
      evidenceUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
    },
    safetyChecklist: {
      helmetsWorn: true,
      safetyHarness: true,
      properScaffolding: true,
      electricalGrounding: true,
      firstAidAvailable: true,
    },
    environmentalConditions: {
      temperature: 30,
      humidity: '82%',
      windSpeed: '18 km/h',
      rainRisk: 'High - Monsoon Cloudburst',
    },
    issuesFound: [
      'Heavy rain forecast within 6 hours. Advised delay of slab casting.'
    ],
    engineerRemarks: 'Steel reinforcement complies with standard ACAG drawings. Shuttering certified safe.',
    photos: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&auto=format&fit=crop&q=80'
    ],
    aiHazardResult: {
      hasHazard: false,
      confidence: 96.8,
    },
    adminApproved: true,
    reInspectionRequired: false,
  },
  {
    id: 'VST-2026-087',
    houseId: 'ACAG-L-4521',
    houseAddress: 'Jallo Park, Lahore',
    engineerId: 1,
    engineerName: 'Engr. Shoaib Akhtar',
    visitType: 'Final Inspection',
    visitDate: '2026-05-15',
    visitTime: '11:00 AM',
    status: 'Completed',
    purpose: 'Final handover and certificate issuance inspection',
    progressPctReported: 100,
    workersPresent: 4,
    trainingProvided: {
      topic: 'Emergency Response & Home Safety',
      durationMinutes: 35,
      attendees: ['Muhammad Arshad (Owner)', 'Irfan Ullah'],
      evidenceUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80',
    },
    safetyChecklist: {
      helmetsWorn: true,
      safetyHarness: true,
      properScaffolding: true,
      electricalGrounding: true,
      firstAidAvailable: true,
    },
    environmentalConditions: {
      temperature: 33,
      humidity: '45%',
      windSpeed: '10 km/h',
      rainRisk: 'None',
    },
    issuesFound: [],
    engineerRemarks: 'House construction 100% compliant. Electricity and sanitation functional. Handover approved.',
    photos: [
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80'
    ],
    aiHazardResult: {
      hasHazard: false,
      confidence: 99.1,
    },
    adminApproved: true,
    reInspectionRequired: false,
  },
  {
    id: 'VST-2026-090',
    houseId: 'ACAG-F-1187',
    houseAddress: 'Sargodha Road, Faisalabad',
    engineerId: 3,
    engineerName: 'Engr. Ayesha Mir',
    visitType: 'Labour Training',
    visitDate: '2026-05-25',
    visitTime: '09:30 AM',
    status: 'Scheduled',
    purpose: 'On-site worker training session on Electrical Safety & Fire Prevention',
    progressPctReported: 65,
    workersPresent: 7,
    trainingProvided: null,
    safetyChecklist: null,
    environmentalConditions: null,
    issuesFound: [],
    engineerRemarks: '',
    photos: [],
    aiHazardResult: null,
    adminApproved: false,
    reInspectionRequired: false,
  },
  {
    id: 'VST-2026-091',
    houseId: 'ACAG-R-2210',
    houseAddress: 'Taxila, Rawalpindi',
    engineerId: 2,
    engineerName: 'Engr. Bilal Ahmed',
    visitType: 'Construction Inspection',
    visitDate: '2026-05-26',
    visitTime: '11:00 AM',
    status: 'Scheduled',
    purpose: 'Flooring and plaster quality verification for final installment eligibility',
    progressPctReported: 88,
    workersPresent: 5,
    trainingProvided: null,
    safetyChecklist: null,
    environmentalConditions: null,
    issuesFound: [],
    engineerRemarks: '',
    photos: [],
    aiHazardResult: null,
    adminApproved: false,
    reInspectionRequired: false,
  }
];

const INITIAL_WORKERS = [
  {
    id: 'WRK-101',
    name: 'Muhammad Khan',
    skill: 'Mason',
    phone: '+92 301 5550101',
    assignedHouseId: 'ACAG-G-2567',
    assignedHouseOwner: 'Ghulam Rasool',
    trainingStatus: 'Trained',
    safetyStatus: 'Safe',
    experienceYears: 7,
    completedTopics: ['PPE Safety', 'Helmet Usage', 'Scaffold Safety'],
    pendingTopics: ['Electrical Safety', 'Emergency Response'],
  },
  {
    id: 'WRK-102',
    name: 'Aslam Pervez',
    skill: 'Welder',
    phone: '+92 312 5550102',
    assignedHouseId: 'ACAG-G-2567',
    assignedHouseOwner: 'Ghulam Rasool',
    trainingStatus: 'In Progress',
    safetyStatus: 'Warning',
    experienceYears: 5,
    completedTopics: ['PPE Safety', 'Fire Safety'],
    pendingTopics: ['Working at Height', 'Scaffold Safety'],
  },
  {
    id: 'WRK-103',
    name: 'Rashid Ali',
    skill: 'Mason',
    phone: '+92 321 5550103',
    assignedHouseId: 'ACAG-S-9911',
    assignedHouseOwner: 'Waqas Munir',
    trainingStatus: 'Trained',
    safetyStatus: 'Safe',
    experienceYears: 10,
    completedTopics: ['PPE Safety', 'Helmet Usage', 'Material Handling', 'Scaffold Safety', 'Working at Height'],
    pendingTopics: [],
  },
  {
    id: 'WRK-104',
    name: 'Tariq Mehmood Jr.',
    skill: 'Electrician',
    phone: '+92 333 5550104',
    assignedHouseId: 'ACAG-K-5501',
    assignedHouseOwner: 'Imran Ashraf',
    trainingStatus: 'Trained',
    safetyStatus: 'Safe',
    experienceYears: 6,
    completedTopics: ['PPE Safety', 'Electrical Safety', 'Fire Safety', 'Emergency Response'],
    pendingTopics: [],
  },
  {
    id: 'WRK-105',
    name: 'Zafar Iqbal',
    skill: 'Plumber',
    phone: '+92 345 5550105',
    assignedHouseId: 'ACAG-P-6612',
    assignedHouseOwner: 'Shahid Iqbal',
    trainingStatus: 'Trained',
    safetyStatus: 'Safe',
    experienceYears: 8,
    completedTopics: ['PPE Safety', 'Material Handling', 'Emergency Response'],
    pendingTopics: ['Scaffold Safety'],
  },
  {
    id: 'WRK-106',
    name: 'Nadeem Akhtar',
    skill: 'Carpenter',
    phone: '+92 300 5550106',
    assignedHouseId: 'ACAG-R-2210',
    assignedHouseOwner: 'Tariq Mehmood',
    trainingStatus: 'Pending',
    safetyStatus: 'Safe',
    experienceYears: 4,
    completedTopics: ['Helmet Usage'],
    pendingTopics: ['PPE Safety', 'Working at Height', 'Fire Safety'],
  },
  {
    id: 'WRK-107',
    name: 'Bashir Ahmed',
    skill: 'Painter',
    phone: '+92 308 5550107',
    assignedHouseId: 'ACAG-L-4521',
    assignedHouseOwner: 'Muhammad Arshad',
    trainingStatus: 'Trained',
    safetyStatus: 'Safe',
    experienceYears: 9,
    completedTopics: ['PPE Safety', 'Material Handling', 'Fire Safety', 'Working at Height'],
    pendingTopics: [],
  },
  {
    id: 'WRK-108',
    name: 'Irfan Ullah',
    skill: 'Mason',
    phone: '+92 315 5550108',
    assignedHouseId: 'ACAG-B-3109',
    assignedHouseOwner: 'Abdul Sattar',
    trainingStatus: 'In Progress',
    safetyStatus: 'Safe',
    experienceYears: 3,
    completedTopics: ['PPE Safety', 'Helmet Usage'],
    pendingTopics: ['Scaffold Safety', 'Working at Height'],
  }
];

const INITIAL_TRAINING_TOPICS = [
  { id: 'TRN-01', name: 'PPE Safety', duration: '30 mins', required: true, trainedCount: 142, description: 'Correct usage of helmets, steel-toe boots, vests, and protective gloves.' },
  { id: 'TRN-02', name: 'Helmet Usage', duration: '20 mins', required: true, trainedCount: 156, description: 'Mandatory head protection protocols on active construction sites.' },
  { id: 'TRN-03', name: 'Electrical Safety', duration: '45 mins', required: true, trainedCount: 98, description: 'Wiring isolation, ground-fault circuit breakers, and power tool safety.' },
  { id: 'TRN-04', name: 'Fire Safety', duration: '30 mins', required: true, trainedCount: 110, description: 'Fire extinguisher operation, hot-work permit guidelines, and emergency escape.' },
  { id: 'TRN-05', name: 'Working at Height', duration: '45 mins', required: true, trainedCount: 88, description: 'Full-body safety harnesses, lifelines, edge protection, and anchor points.' },
  { id: 'TRN-06', name: 'Scaffold Safety', duration: '40 mins', required: true, trainedCount: 92, description: 'Base plate leveling, guardrails, toe boards, and load capacity checks.' },
  { id: 'TRN-07', name: 'Material Handling', duration: '30 mins', required: false, trainedCount: 120, description: 'Ergonomic lifting techniques for cement bags and steel rebars.' },
  { id: 'TRN-08', name: 'Emergency Response', duration: '40 mins', required: true, trainedCount: 104, description: 'Site first-aid response, heat stroke mitigation, and emergency calling.' },
];

const INITIAL_SAFETY_ISSUES = [
  {
    id: 'SAF-001',
    houseId: 'ACAG-G-2567',
    houseAddress: 'GT Road, Kamoke, Gujranwala',
    issueType: 'Working at height without harness',
    severity: 'Critical',
    status: 'Open',
    assignedEngineer: 'Engr. Shoaib Akhtar',
    reportedDate: '2026-05-22',
    description: 'Worker observed at 14 ft roof elevation tying rebar without safety harness or edge guardrail.',
    photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18015f5?w=600&auto=format&fit=crop&q=80',
    resolutionNotes: '',
  },
  {
    id: 'SAF-002',
    houseId: 'ACAG-G-2567',
    houseAddress: 'GT Road, Kamoke, Gujranwala',
    issueType: 'Unsafe scaffolding',
    severity: 'High',
    status: 'Open',
    assignedEngineer: 'Engr. Shoaib Akhtar',
    reportedDate: '2026-05-22',
    description: 'Scaffolding planks not secured with clamps; base resting on uncompacted soil.',
    photoUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
    resolutionNotes: '',
  },
  {
    id: 'SAF-003',
    houseId: 'ACAG-R-2210',
    houseAddress: 'Taxila, Rawalpindi',
    issueType: 'Worker without helmet',
    severity: 'Medium',
    status: 'Resolved',
    assignedEngineer: 'Engr. Bilal Ahmed',
    reportedDate: '2026-05-18',
    resolvedDate: '2026-05-19',
    description: 'Two helper masons were mixing plaster without hard hats.',
    photoUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&auto=format&fit=crop&q=80',
    resolutionNotes: 'Helmets issued on-site by engineer; safety briefing conducted.',
  },
  {
    id: 'SAF-004',
    houseId: 'ACAG-S-9911',
    houseAddress: 'Pasrur Road, Daska, Sialkot',
    issueType: 'Electrical hazard',
    severity: 'High',
    status: 'Resolved',
    assignedEngineer: 'Engr. Bilal Ahmed',
    reportedDate: '2026-05-20',
    resolvedDate: '2026-05-21',
    description: 'Temporary water pump power cable had uninsulated joint touching damp ground.',
    photoUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
    resolutionNotes: 'Waterproof junction box installed with 30mA RCD breaker.',
  },
  {
    id: 'SAF-005',
    houseId: 'ACAG-F-1187',
    houseAddress: 'Sargodha Road, Faisalabad',
    issueType: 'Unsafe material storage',
    severity: 'Low',
    status: 'Resolved',
    assignedEngineer: 'Engr. Ayesha Mir',
    reportedDate: '2026-05-10',
    resolvedDate: '2026-05-11',
    description: 'Steel rebars stacked near passage without safety warning flags.',
    photoUrl: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=600&auto=format&fit=crop&q=80',
    resolutionNotes: 'Rebars moved to designated storage bay and barricaded.',
  }
];

const INITIAL_AI_HAZARDS = [
  {
    id: 'AI-HAZ-101',
    houseId: 'ACAG-G-2567',
    houseAddress: 'GT Road, Kamoke, Gujranwala',
    hazardName: 'Worker without Harness at Height',
    confidence: 94.2,
    severity: 'Critical',
    status: 'Pending Review',
    detectedAt: '2026-05-22 10:45 AM',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18015f5?w=600&auto=format&fit=crop&q=80',
    engineerAssigned: 'Engr. Shoaib Akhtar',
    boundingBox: { x: '35%', y: '25%', width: '40%', height: '50%' },
  },
  {
    id: 'AI-HAZ-102',
    houseId: 'ACAG-G-2567',
    houseAddress: 'GT Road, Kamoke, Gujranwala',
    hazardName: 'Unstable Scaffolding Staging',
    confidence: 89.5,
    severity: 'High',
    status: 'Pending Review',
    detectedAt: '2026-05-22 10:46 AM',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
    engineerAssigned: 'Engr. Shoaib Akhtar',
    boundingBox: { x: '20%', y: '40%', width: '60%', height: '45%' },
  },
  {
    id: 'AI-HAZ-103',
    houseId: 'ACAG-R-2210',
    houseAddress: 'Taxila, Rawalpindi',
    hazardName: 'Missing Hard Hat / PPE',
    confidence: 97.1,
    severity: 'Medium',
    status: 'Resolved',
    detectedAt: '2026-05-18 03:15 PM',
    imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&auto=format&fit=crop&q=80',
    engineerAssigned: 'Engr. Bilal Ahmed',
    boundingBox: { x: '45%', y: '15%', width: '25%', height: '30%' },
  },
  {
    id: 'AI-HAZ-104',
    houseId: 'ACAG-S-9911',
    houseAddress: 'Pasrur Road, Daska, Sialkot',
    hazardName: 'Exposed High Voltage Cable',
    confidence: 91.8,
    severity: 'High',
    status: 'Resolved',
    detectedAt: '2026-05-20 01:20 PM',
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
    engineerAssigned: 'Engr. Bilal Ahmed',
    boundingBox: { x: '30%', y: '60%', width: '40%', height: '30%' },
  }
];

const INITIAL_LOANS = [
  {
    id: 'LN-2026-001',
    applicant: 'Muhammad Arshad',
    cnic: '35202-8941235-1',
    houseId: 'ACAG-L-4521',
    division: 'Lahore',
    approvedAmount: 1500000,
    disbursedAmount: 1500000,
    remainingAmount: 0,
    tranches: [
      { trancheNo: 1, stage: 'Foundation', amount: 375000, status: 'Disbursed', date: '2026-01-20', voucherRef: 'BOP-TXN-88192' },
      { trancheNo: 2, stage: 'Structure', amount: 375000, status: 'Disbursed', date: '2026-02-25', voucherRef: 'BOP-TXN-89401' },
      { trancheNo: 3, stage: 'Roof Slab', amount: 375000, status: 'Disbursed', date: '2026-04-05', voucherRef: 'BOP-TXN-90214' },
      { trancheNo: 4, stage: 'Finishing & Handover', amount: 375000, status: 'Disbursed', date: '2026-05-16', voucherRef: 'BOP-TXN-91560' },
    ],
    status: 'Completed',
    appliedDate: '2026-01-10',
    bank: 'Bank of Punjab (BOP)',
    accountNo: 'PK82BPUN0012948192019',
  },
  {
    id: 'LN-2026-002',
    applicant: 'Tariq Mehmood',
    cnic: '37405-2345678-3',
    houseId: 'ACAG-R-2210',
    division: 'Rawalpindi',
    approvedAmount: 1500000,
    disbursedAmount: 1125000,
    remainingAmount: 375000,
    tranches: [
      { trancheNo: 1, stage: 'Foundation', amount: 375000, status: 'Disbursed', date: '2026-02-15', voucherRef: 'BOP-TXN-89012' },
      { trancheNo: 2, stage: 'Structure', amount: 375000, status: 'Disbursed', date: '2026-03-20', voucherRef: 'BOP-TXN-89915' },
      { trancheNo: 3, stage: 'Roof Slab', amount: 375000, status: 'Disbursed', date: '2026-04-28', voucherRef: 'BOP-TXN-90871' },
      { trancheNo: 4, stage: 'Finishing & Handover', amount: 375000, status: 'Pending Verification', date: null, voucherRef: null },
    ],
    status: 'Active',
    appliedDate: '2026-02-01',
    bank: 'Bank of Punjab (BOP)',
    accountNo: 'PK82BPUN0098471928371',
  },
  {
    id: 'LN-2026-003',
    applicant: 'Zahid Hussain',
    cnic: '33100-3456789-5',
    houseId: 'ACAG-F-1187',
    division: 'Faisalabad',
    approvedAmount: 1200000,
    disbursedAmount: 800000,
    remainingAmount: 400000,
    tranches: [
      { trancheNo: 1, stage: 'Foundation', amount: 400000, status: 'Disbursed', date: '2026-03-05', voucherRef: 'BOP-TXN-89510' },
      { trancheNo: 2, stage: 'Structure', amount: 400000, status: 'Disbursed', date: '2026-04-12', voucherRef: 'BOP-TXN-90412' },
      { trancheNo: 3, stage: 'Roof & Finishing', amount: 400000, status: 'Pending Inspection', date: null, voucherRef: null },
    ],
    status: 'Active',
    appliedDate: '2026-02-15',
    bank: 'Bank of Punjab (BOP)',
    accountNo: 'PK82BPUN0038471928491',
  },
  {
    id: 'LN-2026-004',
    applicant: 'Rashid Minhas',
    cnic: '38403-7890123-5',
    houseId: 'ACAG-S-4012',
    division: 'Sargodha',
    approvedAmount: 1500000,
    disbursedAmount: 0,
    remainingAmount: 1500000,
    tranches: [
      { trancheNo: 1, stage: 'Foundation', amount: 375000, status: 'Approved for Disbursement', date: null, voucherRef: null },
      { trancheNo: 2, stage: 'Structure', amount: 375000, status: 'Upcoming', date: null, voucherRef: null },
      { trancheNo: 3, stage: 'Roof Slab', amount: 375000, status: 'Upcoming', date: null, voucherRef: null },
      { trancheNo: 4, stage: 'Finishing', amount: 375000, status: 'Upcoming', date: null, voucherRef: null },
    ],
    status: 'Approved',
    appliedDate: '2026-04-10',
    bank: 'Bank of Punjab (BOP)',
    accountNo: 'PK82BPUN0059182736451',
  },
  {
    id: 'LN-2026-005',
    applicant: 'Nasir Abbas',
    cnic: '31301-0123456-1',
    houseId: 'ACAG-R-7789',
    division: 'Bahawalpur',
    approvedAmount: 1200000,
    disbursedAmount: 0,
    remainingAmount: 1200000,
    tranches: [
      { trancheNo: 1, stage: 'Foundation', amount: 400000, status: 'Pending Verification', date: null, voucherRef: null },
    ],
    status: 'Pending Application',
    appliedDate: '2026-05-01',
    bank: 'Bank of Punjab (BOP)',
    accountNo: 'PK82BPUN0077182938475',
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'CRITICAL_HAZARD',
    title: 'Critical AI Hazard: Working at Height without Harness',
    houseId: 'ACAG-G-2567',
    description: 'AI Computer Vision detected high-elevation worker safety violation at GT Road, Kamoke.',
    time: '5 mins ago',
    unread: true,
    category: 'Safety',
  },
  {
    id: 2,
    type: 'ENVIRONMENTAL_RISK',
    title: 'Monsoon Cloudburst Weather Warning',
    houseId: 'ACAG-S-9911',
    description: 'Heavy rainfall warning in Sialkot district. Advised stoppage of concrete casting works.',
    time: '25 mins ago',
    unread: true,
    category: 'Environmental',
  },
  {
    id: 3,
    type: 'NEW_APPLICATION',
    title: 'New ACAG Housing Application: Rahim Yar Khan',
    houseId: 'ACAG-R-7789',
    description: 'Applicant Nasir Abbas submitted 3.5 Marla housing loan application.',
    time: '1 hour ago',
    unread: true,
    category: 'Application',
  },
  {
    id: 4,
    type: 'VISIT_REPORT',
    title: 'Engineer Visit Report Submitted: Taxila',
    houseId: 'ACAG-R-2210',
    description: 'Engr. Bilal Ahmed completed 3rd Tranche progress verification inspection.',
    time: '2 hours ago',
    unread: false,
    category: 'Visits',
  },
  {
    id: 5,
    type: 'LABOUR_TRAINING',
    title: 'Labour Training Session Logged: 6 Workers',
    houseId: 'ACAG-G-2567',
    description: 'Scaffold safety on-site training session conducted by Engr. Shoaib Akhtar.',
    time: '4 hours ago',
    unread: false,
    category: 'Labour',
  },
  {
    id: 6,
    type: 'LOAN_APPROVAL',
    title: 'Tranche 1 Loan Disbursal Approved: Sargodha',
    houseId: 'ACAG-S-4012',
    description: 'PKR 375,000 disbursement voucher ready for BOP account credit.',
    time: 'Yesterday',
    unread: false,
    category: 'Loan',
  }
];

const INITIAL_AUDIT_LOGS = [
  { id: 1, user: 'Muhammad Admin', action: 'Approved Inspection Report', module: 'Engineer Visits', houseId: 'ACAG-L-4521', timestamp: '2026-05-23 11:20 AM', status: 'Success' },
  { id: 2, user: 'Muhammad Admin', action: 'Disbursed Tranche 3 (PKR 375k)', module: 'Loan Management', houseId: 'ACAG-R-2210', timestamp: '2026-05-22 03:45 PM', status: 'Success' },
  { id: 3, user: 'Engr. Shoaib Akhtar', action: 'Submitted On-Site Training Log', module: 'Labour Management', houseId: 'ACAG-G-2567', timestamp: '2026-05-22 11:15 AM', status: 'Success' },
  { id: 4, user: 'AI Vision Engine', action: 'Flagged Critical Safety Hazard', module: 'AI Hazard Detection', houseId: 'ACAG-G-2567', timestamp: '2026-05-22 10:45 AM', status: 'Alert' },
  { id: 5, user: 'Muhammad Admin', action: 'Assigned Engineer to House', module: 'House Management', houseId: 'ACAG-S-4012', timestamp: '2026-05-20 09:30 AM', status: 'Success' },
  { id: 6, user: 'Muhammad Admin', action: 'Updated Safety Rule Thresholds', module: 'System Settings', houseId: 'System', timestamp: '2026-05-19 04:00 PM', status: 'Success' },
];

export const DashboardDataProvider = ({ children }) => {
  // Primary State
  const [houses, setHouses] = useState(INITIAL_HOUSES);
  const [engineers, setEngineers] = useState(INITIAL_ENGINEERS);
  const [visits, setVisits] = useState(INITIAL_VISITS);
  const [workers, setWorkers] = useState(INITIAL_WORKERS);
  const [trainingTopics, setTrainingTopics] = useState(INITIAL_TRAINING_TOPICS);
  const [safetyIssues, setSafetyIssues] = useState(INITIAL_SAFETY_ISSUES);
  const [aiHazards, setAiHazards] = useState(INITIAL_AI_HAZARDS);
  const [loans, setLoans] = useState(INITIAL_LOANS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);

  // Settings Configuration State
  const [settings, setSettings] = useState({
    profile: {
      name: 'Muhammad Harram Admin',
      email: 'admin@acag.punjab.gov.pk',
      phone: '+92 42 99001234',
      designation: 'Director Program Management (Super Administrator)',
      department: 'Housing, Urban Development & Public Health Engineering Department',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    constructionStages: [
      { id: 1, name: 'Foundation & Plinth', durationDays: 14, inspectionRequired: true, disbursementPct: 25 },
      { id: 2, name: 'Superstructure & Walls', durationDays: 20, inspectionRequired: true, disbursementPct: 25 },
      { id: 3, name: 'Roof Casting & Slab', durationDays: 18, inspectionRequired: true, disbursementPct: 25 },
      { id: 4, name: 'Electrical & Plumbing', durationDays: 12, inspectionRequired: false, disbursementPct: 0 },
      { id: 5, name: 'Plaster & Finishing', durationDays: 15, inspectionRequired: true, disbursementPct: 25 },
      { id: 6, name: 'Final Handover Inspection', durationDays: 5, inspectionRequired: true, disbursementPct: 0 },
    ],
    safetyRules: {
      mandatoryHelmet: true,
      mandatoryHarnessHeightMeters: 2.0,
      dailyChecklistRequired: true,
      scaffoldingInspectionIntervalDays: 7,
      maxAllowedOpenViolations: 2,
    },
    environmentalRules: {
      maxWorkingTemperatureC: 42,
      stoppageRainfallMm: 25,
      maxWindSpeedKmh: 40,
      heatwaveAdvisoryAlert: true,
      monsoonFloodWarningAlert: true,
    },
    security: {
      twoFactorAuth: true,
      sessionTimeoutMinutes: 30,
      passwordExpiryDays: 90,
      maxFailedAttempts: 5,
      ipWhitelistEnabled: false,
    },
    notificationToggles: {
      emailOnCriticalHazard: true,
      smsToBeneficiary: true,
      inAppVisitsAlert: true,
      dailySummaryDPR: true,
    }
  });

  // Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  const addAuditLog = (action, module, houseId = 'System', status = 'Success') => {
    const newLog = {
      id: Date.now(),
      user: settings.profile.name,
      action,
      module,
      houseId,
      timestamp: new Date().toLocaleString(),
      status,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // ==================== HOUSE ACTIONS ====================
  const approveHouse = (houseId) => {
    setHouses((prev) =>
      prev.map((h) => (h.id === houseId ? { ...h, status: 'Approved', loanStatus: 'Approved - Pending 1st Tranche' } : h))
    );
    showToast(`House ${houseId} approved successfully!`);
    addAuditLog(`Approved House Application`, 'House Management', houseId);
  };

  const rejectHouse = (houseId, reason) => {
    setHouses((prev) =>
      prev.map((h) => (h.id === houseId ? { ...h, status: 'Rejected', loanStatus: `Rejected: ${reason || 'Criteria not met'}` } : h))
    );
    showToast(`House ${houseId} rejected.`, 'error');
    addAuditLog(`Rejected House Application (${reason})`, 'House Management', houseId);
  };

  const assignEngineerToHouse = (houseId, engineerId) => {
    const targetEng = engineers.find((e) => e.id === Number(engineerId));
    if (!targetEng) return;

    setHouses((prev) =>
      prev.map((h) =>
        h.id === houseId
          ? { ...h, engineerId: targetEng.id, engineerName: targetEng.name }
          : h
      )
    );

    setEngineers((prev) =>
      prev.map((e) =>
        e.id === targetEng.id
          ? {
              ...e,
              assignedHouses: e.assignedHouses.includes(houseId) ? e.assignedHouses : [...e.assignedHouses, houseId],
              assignedHousesCount: e.assignedHouses.includes(houseId) ? e.assignedHouses.length : e.assignedHouses.length + 1,
            }
          : e
      )
    );

    showToast(`Assigned ${targetEng.name} to ${houseId}`);
    addAuditLog(`Assigned ${targetEng.name}`, 'House Management', houseId);
  };

  const updateHouseStatus = (houseId, stage, status, progressPct) => {
    setHouses((prev) =>
      prev.map((h) =>
        h.id === houseId
          ? { ...h, stage: stage || h.stage, status: status || h.status, progressPct: progressPct !== undefined ? progressPct : h.progressPct }
          : h
      )
    );
    showToast(`Updated house ${houseId} progress.`);
    addAuditLog(`Updated status to ${status} (${stage})`, 'House Management', houseId);
  };

  // ==================== ENGINEER VISITS ACTIONS ====================
  const scheduleVisit = (newVisit) => {
    const createdVisit = {
      ...newVisit,
      id: `VST-2026-${String(visits.length + 90).padStart(3, '0')}`,
      status: 'Scheduled',
      adminApproved: false,
      reInspectionRequired: false,
    };
    setVisits((prev) => [createdVisit, ...prev]);

    // Add notification
    const newNotif = {
      id: Date.now(),
      type: 'NEW_VISIT',
      title: `Visit Scheduled: ${createdVisit.visitType}`,
      houseId: createdVisit.houseId,
      description: `${createdVisit.engineerName} assigned for ${createdVisit.visitDate} at ${createdVisit.visitTime}.`,
      time: 'Just now',
      unread: true,
      category: 'Visits',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Visit scheduled for ${createdVisit.houseId}`);
    addAuditLog(`Scheduled ${createdVisit.visitType}`, 'Engineer Visits', createdVisit.houseId);
  };

  const approveVisitReport = (visitId) => {
    setVisits((prev) =>
      prev.map((v) => (v.id === visitId ? { ...v, adminApproved: true, reInspectionRequired: false } : v))
    );
    showToast(`Visit report ${visitId} approved.`);
    addAuditLog(`Approved Visit Report`, 'Engineer Visits', visitId);
  };

  const requestReInspection = (visitId, remarks) => {
    setVisits((prev) =>
      prev.map((v) =>
        v.id === visitId
          ? { ...v, adminApproved: false, reInspectionRequired: true, engineerRemarks: `${v.engineerRemarks || ''} [ADMIN RE-INSPECTION: ${remarks}]` }
          : v
      )
    );
    showToast(`Re-inspection requested for visit ${visitId}.`, 'warning');
    addAuditLog(`Requested Re-Inspection (${remarks})`, 'Engineer Visits', visitId);
  };

  // ==================== ENGINEER MANAGEMENT ACTIONS ====================
  const addEngineer = (engineerData) => {
    const newEng = {
      ...engineerData,
      id: engineers.length + 1,
      assignedHouses: [],
      assignedHousesCount: 0,
      completedVisits: 0,
      pendingVisits: 0,
      trainingSessionsConducted: 0,
      workersTrained: 0,
      status: 'Active',
      rating: 5.0,
      safetyComplianceScore: 100,
      avatar: engineerData.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    };
    setEngineers((prev) => [...prev, newEng]);
    showToast(`Engineer ${newEng.name} registered.`);
    addAuditLog(`Registered new Field Engineer`, 'Engineer Management', newEng.name);
  };

  const toggleEngineerStatus = (engineerId) => {
    setEngineers((prev) =>
      prev.map((e) =>
        e.id === engineerId
          ? { ...e, status: e.status === 'Active' ? 'Inactive' : 'Active' }
          : e
      )
    );
    showToast(`Updated engineer status.`);
  };

  // ==================== LABOUR & TRAINING ACTIONS ====================
  const recordTrainingSession = (sessionData) => {
    const { houseId, engineerId, engineerName, topic, date, duration, workersPresent, evidenceUrl, remarks } = sessionData;

    // Update worker training records
    setWorkers((prev) =>
      prev.map((w) => {
        if (workersPresent.includes(w.name) || workersPresent.includes(w.id)) {
          const completedTopics = w.completedTopics.includes(topic) ? w.completedTopics : [...w.completedTopics, topic];
          const pendingTopics = w.pendingTopics.filter((t) => t !== topic);
          return {
            ...w,
            completedTopics,
            pendingTopics,
            trainingStatus: pendingTopics.length === 0 ? 'Trained' : 'In Progress',
          };
        }
        return w;
      })
    );

    // Update training topics counter
    setTrainingTopics((prev) =>
      prev.map((t) => (t.name === topic ? { ...t, trainedCount: t.trainedCount + (workersPresent?.length || 1) } : t))
    );

    // Update engineer training stats
    if (engineerId) {
      setEngineers((prev) =>
        prev.map((e) =>
          e.id === Number(engineerId)
            ? {
                ...e,
                trainingSessionsConducted: e.trainingSessionsConducted + 1,
                workersTrained: e.workersTrained + (workersPresent?.length || 1),
              }
            : e
        )
      );
    }

    showToast(`Training session on "${topic}" recorded successfully.`);
    addAuditLog(`Logged On-Site Training: ${topic}`, 'Labour Management', houseId);
  };

  const addTrainingTopic = (topicData) => {
    const newTopic = {
      ...topicData,
      id: `TRN-${String(trainingTopics.length + 1).padStart(2, '0')}`,
      trainedCount: 0,
    };
    setTrainingTopics((prev) => [...prev, newTopic]);
    showToast(`Added new training topic: ${newTopic.name}`);
    addAuditLog(`Added Training Topic: ${newTopic.name}`, 'Labour Management');
  };

  // ==================== SAFETY MANAGEMENT ACTIONS ====================
  const resolveSafetyIssue = (issueId, resolutionNotes) => {
    setSafetyIssues((prev) =>
      prev.map((s) =>
        s.id === issueId
          ? { ...s, status: 'Resolved', resolvedDate: new Date().toISOString().split('T')[0], resolutionNotes: resolutionNotes || 'Resolved by site engineer' }
          : s
      )
    );
    showToast(`Safety issue ${issueId} marked as resolved.`);
    addAuditLog(`Resolved Safety Issue`, 'Safety Management', issueId);
  };

  const assignSafetyIssue = (issueId, engineerName) => {
    setSafetyIssues((prev) =>
      prev.map((s) => (s.id === issueId ? { ...s, assignedEngineer: engineerName } : s))
    );
    showToast(`Assigned ${issueId} to ${engineerName}`);
    addAuditLog(`Assigned Safety Issue to ${engineerName}`, 'Safety Management', issueId);
  };

  const logSafetyViolation = (newIssue) => {
    const issue = {
      ...newIssue,
      id: `SAF-${String(safetyIssues.length + 1).padStart(3, '0')}`,
      status: 'Open',
      reportedDate: new Date().toISOString().split('T')[0],
    };
    setSafetyIssues((prev) => [issue, ...prev]);

    // Notify
    const newNotif = {
      id: Date.now(),
      type: 'SAFETY_ISSUE',
      title: `Safety Incident Logged: ${issue.issueType}`,
      houseId: issue.houseId,
      description: `${issue.severity} severity issue reported at ${issue.houseAddress}.`,
      time: 'Just now',
      unread: true,
      category: 'Safety',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Safety violation logged: ${issue.id}`, 'warning');
    addAuditLog(`Logged Safety Violation (${issue.severity})`, 'Safety Management', issue.houseId);
  };

  // ==================== AI HAZARD ACTIONS ====================
  const resolveAiHazard = (hazardId) => {
    setAiHazards((prev) =>
      prev.map((h) => (h.id === hazardId ? { ...h, status: 'Resolved' } : h))
    );
    showToast(`AI Hazard ${hazardId} marked as mitigated.`);
    addAuditLog(`Mitigated AI Vision Hazard`, 'AI Hazard Detection', hazardId);
  };

  // ==================== LOAN ACTIONS ====================
  const disburseTranche = (loanId, trancheNo, amount) => {
    setLoans((prev) =>
      prev.map((ln) => {
        if (ln.id === loanId) {
          const updatedTranches = ln.tranches.map((t) =>
            t.trancheNo === trancheNo
              ? { ...t, status: 'Disbursed', date: new Date().toISOString().split('T')[0], voucherRef: `BOP-TXN-${Math.floor(10000 + Math.random() * 90000)}` }
              : t
          );
          const newDisbursed = ln.disbursedAmount + amount;
          const newRemaining = Math.max(0, ln.approvedAmount - newDisbursed);
          const isComplete = newRemaining === 0;
          return {
            ...ln,
            disbursedAmount: newDisbursed,
            remainingAmount: newRemaining,
            tranches: updatedTranches,
            status: isComplete ? 'Completed' : 'Active',
          };
        }
        return ln;
      })
    );

    // Sync with house loan balance
    const targetLoan = loans.find((l) => l.id === loanId);
    if (targetLoan) {
      setHouses((prev) =>
        prev.map((h) =>
          h.id === targetLoan.houseId
            ? {
                ...h,
                loanDisbursed: h.loanDisbursed + amount,
                remainingLoan: Math.max(0, h.loanApproved - (h.loanDisbursed + amount)),
                loanStatus: `Tranche ${trancheNo} Disbursed`,
              }
            : h
        )
      );
    }

    showToast(`Tranche ${trancheNo} (PKR ${amount.toLocaleString()}) disbursed via BOP.`);
    addAuditLog(`Disbursed Tranche ${trancheNo} (PKR ${amount.toLocaleString()})`, 'Loan Management', loanId);
  };

  const approveLoan = (loanId) => {
    setLoans((prev) =>
      prev.map((l) => (l.id === loanId ? { ...l, status: 'Approved' } : l))
    );
    showToast(`Loan application ${loanId} approved.`);
    addAuditLog(`Approved Loan Application`, 'Loan Management', loanId);
  };

  const rejectLoan = (loanId, reason) => {
    setLoans((prev) =>
      prev.map((l) => (l.id === loanId ? { ...l, status: `Rejected: ${reason || 'Eligibility unmet'}` } : l))
    );
    showToast(`Loan application ${loanId} rejected.`, 'error');
    addAuditLog(`Rejected Loan Application`, 'Loan Management', loanId);
  };

  // ==================== NOTIFICATIONS ACTIONS ====================
  const markNotificationRead = (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, unread: false } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast('All notifications marked as read.');
  };

  // ==================== SETTINGS ACTIONS ====================
  const updateProfile = (profileData) => {
    setSettings((prev) => ({ ...prev, profile: { ...prev.profile, ...profileData } }));
    showToast('Profile updated successfully.');
    addAuditLog('Updated Profile Settings', 'System Settings');
  };

  const updateSafetyRules = (rulesData) => {
    setSettings((prev) => ({ ...prev, safetyRules: { ...prev.safetyRules, ...rulesData } }));
    showToast('Safety rules updated.');
    addAuditLog('Updated Safety Compliance Rules', 'System Settings');
  };

  const updateEnvironmentalRules = (envData) => {
    setSettings((prev) => ({ ...prev, environmentalRules: { ...prev.environmentalRules, ...envData } }));
    showToast('Environmental risk thresholds saved.');
    addAuditLog('Updated Environmental Thresholds', 'System Settings');
  };

  const updateSecuritySettings = (secData) => {
    setSettings((prev) => ({ ...prev, security: { ...prev.security, ...secData } }));
    showToast('Security configuration updated.');
    addAuditLog('Updated Security Configuration', 'System Settings');
  };

  const value = {
    // Data
    houses,
    engineers,
    visits,
    workers,
    trainingTopics,
    safetyIssues,
    aiHazards,
    loans,
    notifications,
    auditLogs,
    settings,
    toast,

    // House operations
    approveHouse,
    rejectHouse,
    assignEngineerToHouse,
    updateHouseStatus,

    // Visits operations
    scheduleVisit,
    approveVisitReport,
    requestReInspection,

    // Engineer operations
    addEngineer,
    toggleEngineerStatus,

    // Labour & Training operations
    recordTrainingSession,
    addTrainingTopic,

    // Safety operations
    resolveSafetyIssue,
    assignSafetyIssue,
    logSafetyViolation,

    // AI Hazard operations
    resolveAiHazard,

    // Loan operations
    disburseTranche,
    approveLoan,
    rejectLoan,

    // Notification operations
    markNotificationRead,
    markAllNotificationsRead,

    // Settings operations
    updateProfile,
    updateSafetyRules,
    updateEnvironmentalRules,
    updateSecuritySettings,
    showToast,
  };

  return (
    <DashboardDataContext.Provider value={value}>
      {children}

      {/* Global Toast Alert Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border text-xs font-black flex items-center gap-3 backdrop-blur-md ${
              toast.type === 'error'
                ? 'bg-rose-900/90 text-rose-50 border-rose-700'
                : toast.type === 'warning'
                ? 'bg-amber-900/90 text-amber-50 border-amber-700'
                : 'bg-emerald-900/90 text-emerald-50 border-emerald-700'
            }`}
          >
            <div
              className={`h-2.5 w-2.5 rounded-full ${
                toast.type === 'error' ? 'bg-rose-400' : toast.type === 'warning' ? 'bg-amber-400' : 'bg-emerald-400'
              } animate-ping`}
            />
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </DashboardDataContext.Provider>
  );
};

export const useDashboardData = () => {
  const context = useContext(DashboardDataContext);
  if (!context) {
    throw new Error('useDashboardData must be used within a DashboardDataProvider');
  }
  return context;
};
