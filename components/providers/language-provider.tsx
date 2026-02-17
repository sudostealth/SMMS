"use client";

import { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "bn";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    batches: "Batches",
    createBatch: "Create Batch",
    profileSettings: "Profile & Settings",
    logout: "Logout",
    
    // Dashboard
    totalBatches: "Total Batches",
    totalStudents: "Total Students",
    activeBatches: "Active Batches",
    attendanceRate: "Attendance Rate",
    recentBatches: "Recent Batches",
    viewAll: "View All",
    noBatches: "No batches yet",
    
    // Batch Management
    batchName: "Batch Name",
    department: "Department",
    section: "Section",
    semester: "Semester",
    academicYear: "Academic Year",
    status: "Status",
    students: "Students",
    sessions: "Sessions",
    attendance: "Attendance",
    settings: "Settings",
    
    // Student Management
    studentName: "Student Name",
    studentId: "Student ID",
    phone: "Phone",
    email: "Email",
    addStudent: "Add Student",
    importStudents: "Import Students",
    searchPlaceholder: "Search by name, student ID, phone, or email...",
    
    // Session Management
    sessionNumber: "Session Number",
    sessionDate: "Session Date",
    method: "Method",
    online: "Online",
    offline: "Offline",
    platform: "Platform",
    roomNumber: "Room Number",
    createSession: "Create Session",
    markAttendance: "Mark Attendance",
    
    // Attendance
    present: "Present",
    absent: "Absent",
    markAllPresent: "Mark All Present",
    markAllAbsent: "Mark All Absent",
    save: "Save",
    cancel: "Cancel",
    
    // Profile
    fullName: "Full Name",
    batch: "Batch",
    editProfile: "Edit Profile",
    saveChanges: "Save Changes",
    
    // Common
    edit: "Edit",
    delete: "Delete",
    update: "Update",
    create: "Create",
    loading: "Loading...",
    success: "Success!",
    error: "Error",
    confirmDelete: "Are you sure you want to delete?",
    
    // Landing Page
    welcome: "Welcome to GUSMP",
    subtitle: "Green University Student Mentorship Program",
    description: "Manage your mentorship batches, students, sessions, and attendance all in one place.",
    getStarted: "Get Started",
    learnMore: "Learn More",
    features: "Features",
    batchManagement: "Batch Management",
    batchManagementDesc: "Organize and manage multiple batches efficiently",
    studentTracking: "Student Tracking",
    studentTrackingDesc: "Keep track of all your students in one place",
    attendanceSystem: "Attendance System",
    attendanceSystemDesc: "Digital attendance tracking with detailed analytics",
    
    // Auth
    login: "Login",
    signup: "Sign Up",
    loginTitle: "Welcome Back",
    signupTitle: "Create Account",
    emailAddress: "Email Address",
    password: "Password",
    confirmPassword: "Confirm Password",
    forgotPassword: "Forgot Password?",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    loginSuccess: "Login Successful!",
    loggingIn: "Logging in...",
  },
  bn: {
    // Navigation
    dashboard: "ড্যাশবোর্ড",
    batches: "ব্যাচসমূহ",
    createBatch: "ব্যাচ তৈরি করুন",
    profileSettings: "প্রোফাইল ও সেটিংস",
    logout: "লগআউট",
    
    // Dashboard
    totalBatches: "মোট ব্যাচ",
    totalStudents: "মোট শিক্ষার্থী",
    activeBatches: "সক্রিয় ব্যাচ",
    attendanceRate: "উপস্থিতির হার",
    recentBatches: "সাম্প্রতিক ব্যাচসমূহ",
    viewAll: "সব দেখুন",
    noBatches: "এখনো কোনো ব্যাচ নেই",
    
    // Batch Management
    batchName: "ব্যাচের নাম",
    department: "বিভাগ",
    section: "সেকশন",
    semester: "সেমিস্টার",
    academicYear: "শিক্ষাবর্ষ",
    status: "অবস্থা",
    students: "শিক্ষার্থীবৃন্দ",
    sessions: "সেশনসমূহ",
    attendance: "উপস্থিতি",
    settings: "সেটিংস",
    
    // Student Management
    studentName: "শিক্ষার্থীর নাম",
    studentId: "শিক্ষার্থী আইডি",
    phone: "ফোন",
    email: "ইমেইল",
    addStudent: "শিক্ষার্থী যোগ করুন",
    importStudents: "শিক্ষার্থী আমদানি করুন",
    searchPlaceholder: "নাম, আইডি, ফোন, বা ইমেইল দিয়ে খুঁজুন...",
    
    // Session Management
    sessionNumber: "সেশন নম্বর",
    sessionDate: "সেশনের তারিখ",
    method: "পদ্ধতি",
    online: "অনলাইন",
    offline: "অফলাইন",
    platform: "প্ল্যাটফর্ম",
    roomNumber: "রুম নম্বর",
    createSession: "সেশন তৈরি করুন",
    markAttendance: "উপস্থিতি চিহ্নিত করুন",
    
    // Attendance
    present: "উপস্থিত",
    absent: "অনুপস্থিত",
    markAllPresent: "সবাইকে উপস্থিত করুন",
    markAllAbsent: "সবাইকে অনুপস্থিত করুন",
    save: "সংরক্ষণ করুন",
    cancel: "বাতিল করুন",
    
    // Profile
    fullName: "পূর্ণ নাম",
    batch: "ব্যাচ",
    editProfile: "প্রোফাইল সম্পাদনা",
    saveChanges: "পরিবর্তন সংরক্ষণ করুন",
    
    // Common
    edit: "সম্পাদনা",
    delete: "মুছে ফেলুন",
    update: "আপডেট করুন",
    create: "তৈরি করুন",
    loading: "লোড হচ্ছে...",
    success: "সফল!",
    error: "ত্রুটি",
    confirmDelete: "আপনি কি নিশ্চিত মুছে ফেলতে চান?",
    
    // Landing Page
    welcome: "GUSMP তে স্বাগতম",
    subtitle: "গ্রীন বিশ্ববিদ্যালয় শিক্ষার্থী মেন্টরশিপ প্রোগ্রাম",
    description: "এক জায়গায় আপনার মেন্টরশিপ ব্যাচ, শিক্ষার্থী, সেশন এবং উপস্থিতি পরিচালনা করুন।",
    getStarted: "শুরু করুন",
    learnMore: "আরও জানুন",
    features: "বৈশিষ্ট্যসমূহ",
    batchManagement: "ব্যাচ ব্যবস্থাপনা",
    batchManagementDesc: "দক্ষতার সাথে একাধিক ব্যাচ সংগঠিত এবং পরিচালনা করুন",
    studentTracking: "শিক্ষার্থী ট্র্যাকিং",
    studentTrackingDesc: "সব শিক্ষার্থীকে এক জায়গায় ট্র্যাক করুন",
    attendanceSystem: "উপস্থিতি ব্যবস্থা",
    attendanceSystemDesc: "বিস্তারিত বিশ্লেষণ সহ ডিজিটাল উপস্থিতি ট্র্যাকিং",
    
    // Auth
    login: "লগইন",
    signup: "সাইন আপ",
    loginTitle: "স্বাগতম",
    signupTitle: "অ্যাকাউন্ট তৈরি করুন",
    emailAddress: "ইমেইল ঠিকানা",
    password: "পাসওয়ার্ড",
    confirmPassword: "পাসওয়ার্ড নিশ্চিত করুন",
    forgotPassword: "পাসওয়ার্ড ভুলে গেছেন?",
    dontHaveAccount: "অ্যাকাউন্ট নেই?",
    alreadyHaveAccount: "ইতিমধ্যে অ্যাকাউন্ট আছে?",
    loginSuccess: "লগইন সফল!",
    loggingIn: "লগইন হচ্ছে...",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    // Load saved language preference
    const saved = localStorage.getItem("language") as Language;
    if (saved && (saved === "en" || saved === "bn")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
