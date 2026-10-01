/**
 * ============================================================================
 * SAI — WINTER ARC (90 Days of Discipline)
 * Pure Vanilla JavaScript Client-Side Architecture
 * LocalStorage Namespaced System:
 *   - winterArcProfile
 *   - winterArcHabits
 *   - winterArcGoals
 *   - winterArcWeeklyGoals
 *   - winterArcPriorities
 *   - winterArcGratitude
 *   - winterArcNotes
 *   - winterArcJournal
 *   - winterArcReviews
 *   - winterArcSettings
 *   - winterArcCustomHabits  (user-added tasks, apply to all 90 days)
 *   - winterArcHiddenHabits  (default habits the user has hidden)
 * ============================================================================
 */

(function () {
  'use strict';

  // --- STORAGE KEYS ---
  const STORAGE_KEYS = {
    PROFILE: 'winterArcProfile',
    HABITS: 'winterArcHabits',
    GOALS: 'winterArcGoals',
    WEEKLY_GOALS: 'winterArcWeeklyGoals',
    PRIORITIES: 'winterArcPriorities',
    GRATITUDE: 'winterArcGratitude',
    NOTES: 'winterArcNotes',
    JOURNAL: 'winterArcJournal',
    REVIEWS: 'winterArcReviews',
    SETTINGS: 'winterArcSettings',
    CUSTOM_HABITS: 'winterArcCustomHabits',
    HIDDEN_HABITS: 'winterArcHiddenHabits',
    THEME: 'winterArcTheme'
  };

  // --- CORE 12 DISCIPLINE HABITS (Directly aligned with poster reference) ---
  const DEFAULT_HABITS = [
    { id: 'wake-early', name: 'Wake Up Early (Before 6 AM)', desc: 'Start before the world wakes. Win the morning.', icon: '🌅', category: 'discipline' },
    { id: 'sleep-rest', name: '7–8 Hours Sleep', desc: 'Rest & deep recovery. Non-negotiable physical fuel.', icon: '😴', category: 'physical' },
    { id: 'workout', name: 'Workout / Exercise', desc: 'Strength training, conditioning, or intense cardio.', icon: '🏋️', category: 'physical' },
    { id: 'drink-water', name: 'Drink 3–4 L Water', desc: 'Optimal hydration for cellular energy & mental clarity.', icon: '💧', category: 'physical' },
    { id: 'healthy-diet', name: 'Healthy Diet (No Junk)', desc: 'Clean, nutrient-dense nutrition. Discipline on your plate.', icon: '🥗', category: 'physical' },
    { id: 'study-college', name: 'Study / College (3+ hrs)', desc: 'Relentless focused deep study and academic mastery.', icon: '📚', category: 'academic' },
    { id: 'coding-skills', name: 'Coding / Skill (2+ hrs)', desc: 'High-leverage engineering & deliberate practice.', icon: '💻', category: 'skills' },
    { id: 'project-work', name: 'Project / Portfolio Work', desc: 'Building & shipping tangible real-world output.', icon: '📁', category: 'skills' },
    { id: 'reading-learning', name: 'Read / Learn (Non-Syllabus)', desc: '30+ minutes of wisdom, psychology, or mindset.', icon: '📖', category: 'mental' },
    { id: 'meditation-mind', name: 'Meditation / Journal', desc: '10–15 mins stillness, breathwork, or self-reflection.', icon: '🧘', category: 'mental' },
    { id: 'no-social-media', name: 'No Social Media (≤ 1 hr)', desc: 'Eliminate doomscrolling and dopamine distractions.', icon: '📵', category: 'discipline' },
    { id: 'stay-consistent', name: 'Stay Consistent', desc: 'No excuses. Show up and honor your word every day.', icon: '🎯', category: 'discipline' }
  ];

  // --- DEFAULT MONTHLY GOALS (Across all 3 months of Winter Arc) ---
  const DEFAULT_MONTHLY_GOALS = [
    // Month 1: October (Days 1–31) - Foundation
    { id: 'g-1', title: 'Be consistent for 31 days', category: 'Discipline', completed: false, isDefault: true, month: '1' },
    { id: 'g-2', title: 'Improve physical & mental health', category: 'Physical', completed: false, isDefault: true, month: '1' },
    { id: 'g-3', title: 'Complete important academic goals', category: 'Academic', completed: false, isDefault: true, month: '1' },
    { id: 'g-4', title: 'Work on projects / portfolio', category: 'Skills', completed: false, isDefault: true, month: '1' },
    { id: 'g-5', title: 'Learn a new skill / certification', category: 'Skills', completed: false, isDefault: true, month: '1' },
    { id: 'g-6', title: 'Reduce screen time', category: 'Discipline', completed: false, isDefault: true, month: '1' },
    { id: 'g-7', title: 'Build better habits', category: 'Life', completed: false, isDefault: true, month: '1' },
    { id: 'g-8', title: 'Feel more disciplined & confident', category: 'Mental', completed: false, isDefault: true, month: '1' },

    // Month 2: November (Days 32–61) - Consistency & Intensity
    { id: 'g-m2-1', title: 'Hold streak through Day 60 without slip-ups', category: 'Discipline', completed: false, isDefault: true, month: '2' },
    { id: 'g-m2-2', title: 'Push workout intensity & set new personal records', category: 'Physical', completed: false, isDefault: true, month: '2' },
    { id: 'g-m2-3', title: 'Complete MVP / key milestone of portfolio project', category: 'Skills', completed: false, isDefault: true, month: '2' },
    { id: 'g-m2-4', title: 'Deep study & deliberate practice (50+ hrs)', category: 'Academic', completed: false, isDefault: true, month: '2' },
    { id: 'g-m2-5', title: 'Lock in 8-hour sleep & clean nutrition standard', category: 'Physical', completed: false, isDefault: true, month: '2' },
    { id: 'g-m2-6', title: 'Zero tolerance for mindless scrolling & distractions', category: 'Discipline', completed: false, isDefault: true, month: '2' },

    // Month 3: December (Days 62–92) - Mastery & Transformation
    { id: 'g-m3-1', title: 'Finish all 92 days of Winter Arc unbroken', category: 'Discipline', completed: false, isDefault: true, month: '3' },
    { id: 'g-m3-2', title: 'Finalize, polish & showcase flagship project', category: 'Skills', completed: false, isDefault: true, month: '3' },
    { id: 'g-m3-3', title: 'Achieve peak physical fitness & conditioning', category: 'Physical', completed: false, isDefault: true, month: '3' },
    { id: 'g-m3-4', title: 'Ace semester finals / year-end academic benchmarks', category: 'Academic', completed: false, isDefault: true, month: '3' },
    { id: 'g-m3-5', title: 'Solidify new identity & mental toughness permanently', category: 'Mental', completed: false, isDefault: true, month: '3' },
    { id: 'g-m3-6', title: 'Audit 92-day transformation & set 2027 vision', category: 'Life', completed: false, isDefault: true, month: '3' }
  ];

  // --- DEFAULT WEEKLY SPRINT GOALS ---
  const DEFAULT_WEEKLY_GOALS = {
    '1': [
      { id: 'w1-1', text: 'Wake up before 6:00 AM on 6 out of 7 days', completed: false },
      { id: 'w1-2', text: 'Complete 5 intense resistance workouts', completed: false },
      { id: 'w1-3', text: 'Put in 14 hours of deep coding / project work', completed: false },
      { id: 'w1-4', text: 'Zero sugary drinks or processed junk foods', completed: false }
    ]
  };

  // --- APPLICATION STATE ---
  let appState = {
    user: null, // { name: 'Sai', startDate: '2026-10-01', goal: '...' }
    activeDate: getTodayDateString(), // YYYY-MM-DD
    activePhase: 1, // 1, 2, or 3
    activeGoalMonth: '1', // '1', '2', '3', or 'all'
    analyticsRange: 7, // 7, 30, or 92
    soundEnabled: true,
    snowEnabled: true,
    theme: 'light'
  };

  // Web Audio Context for synthesized atmospheric wind and subtle feedback
  let audioCtx = null;
  let windNoiseNode = null;
  let windGainNode = null;

  // --- DOM ELEMENT REFERENCES ---
  const DOM = {
    // Dynamic Branding Elements
    pageTitle: document.getElementById('pageTitle'),
    landingBrandName: document.getElementById('landingBrandName'),
    navBrandName: document.getElementById('navBrandName'),
    footerBrandTitle: document.getElementById('footerBrandTitle'),
    strongerTargetName: document.getElementById('strongerTargetName'),

    // Screens & Containers
    landingScreen: document.getElementById('landingScreen'),
    appContainer: document.getElementById('appContainer'),
    snowCanvas: document.getElementById('snowCanvas'),
    ambientToast: document.getElementById('ambientNotification'),

    // Landing Buttons
    btnLandingStart: document.getElementById('btnLandingStart'),
    btnLandingExisting: document.getElementById('btnLandingExisting'),
    btnLandingThemeToggle: document.getElementById('btnLandingThemeToggle'),

    // Navigation
    topNav: document.getElementById('topNav'),
    navBrandLogo: document.getElementById('navBrandLogo'),
    navDayBadge: document.getElementById('navDayBadge'),
    desktopNavLinks: document.querySelectorAll('#desktopNavLinks .nav-link'),
    mobileNavLinks: document.querySelectorAll('#mobileBottomNav .mobile-nav-link'),
    btnThemeToggle: document.getElementById('btnThemeToggle'),
    themeIconSun: document.querySelector('.theme-icon-sun'),
    themeIconMoon: document.querySelector('.theme-icon-moon'),
    btnSoundToggle: document.getElementById('btnSoundToggle'),
    btnSnowToggle: document.getElementById('btnSnowToggle'),
    navUserProfileBtn: document.getElementById('navUserProfileBtn'),
    userInitial: document.getElementById('userInitial'),
    userPillName: document.getElementById('userPillName'),

    // Dashboard Hero & Stats
    heroGreeting: document.getElementById('heroGreeting'),
    heroLiveDate: document.getElementById('heroLiveDate'),
    heroDayCounter: document.getElementById('heroDayCounter'),
    heroDaysRemaining: document.getElementById('heroDaysRemaining'),
    currentPhaseTag: document.getElementById('currentPhaseTag'),
    arcPhaseLabel: document.getElementById('arcPhaseLabel'),
    arcTotalBarFill: document.getElementById('arcTotalBarFill'),
    miniRingFill: document.getElementById('miniRingFill'),
    miniDialPercent: document.getElementById('miniDialPercent'),

    statCurrentStreak: document.getElementById('statCurrentStreak'),
    statTodayCompletion: document.getElementById('statTodayCompletion'),
    statTodayHabitRatio: document.getElementById('statTodayHabitRatio'),
    statTotalHabitsDone: document.getElementById('statTotalHabitsDone'),
    statGoalsCompleted: document.getElementById('statGoalsCompleted'),

    // Daily Habit Tracker
    btnPrevDay: document.getElementById('btnPrevDay'),
    btnNextDay: document.getElementById('btnNextDay'),
    btnTodayReset: document.getElementById('btnTodayReset'),
    activeDateDisplay: document.getElementById('activeDateDisplay'),
    habitsCheckedCounter: document.getElementById('habitsCheckedCounter'),
    habitsListContainer: document.getElementById('habitsListContainer'),
    btnViewToday: document.getElementById('btnViewToday'),
    btnViewWeekly: document.getElementById('btnViewWeekly'),
    matrixViewHint: document.getElementById('matrixViewHint'),
    habitsColumnTitle: document.getElementById('habitsColumnTitle'),
    weeklyMatrixWrap: document.getElementById('weeklyMatrixWrap'),
    weeklyMatrixTbody: document.getElementById('weeklyMatrixTbody'),
    posterStreakBeadsGrid: document.getElementById('posterStreakBeadsGrid'),

    // Progress Gauge
    mainProgressCircle: document.getElementById('mainProgressCircle'),
    mainProgressPercent: document.getElementById('mainProgressPercent'),
    mainProgressRatio: document.getElementById('mainProgressRatio'),
    gaugeStatusBadge: document.getElementById('gaugeStatusBadge'),
    dayCompleteBanner: document.getElementById('dayCompleteBanner'),

    microCurrentStreak: document.getElementById('microCurrentStreak'),
    microBestStreak: document.getElementById('microBestStreak'),
    microCompletedDays: document.getElementById('microCompletedDays'),
    microAverageScore: document.getElementById('microAverageScore'),

    // Priorities
    priText0: document.getElementById('priText0'),
    priText1: document.getElementById('priText1'),
    priText2: document.getElementById('priText2'),
    priChk0: document.getElementById('priChk0'),
    priChk1: document.getElementById('priChk1'),
    priChk2: document.getElementById('priChk2'),
    priSaveIndicator: document.getElementById('priSaveIndicator'),

    // Gratitude
    gratitudeInput0: document.getElementById('gratitudeInput0'),
    gratitudeInput1: document.getElementById('gratitudeInput1'),
    gratitudeInput2: document.getElementById('gratitudeInput2'),
    gratSaveIndicator: document.getElementById('gratSaveIndicator'),

    // Scratchpad
    dailyQuickNotes: document.getElementById('dailyQuickNotes'),
    notesSaveIndicator: document.getElementById('notesSaveIndicator'),

    // Calendar
    calendarDaysGrid: document.getElementById('calendarDaysGrid'),
    phaseTabButtons: document.querySelectorAll('.phase-tab-btn'),

    // Goals
    btnOpenAddGoalModal: document.getElementById('btnOpenAddGoalModal'),
    monthlySelectDropdown: document.getElementById('monthlySelectDropdown'),
    monthlyGoalsSubtitle: document.getElementById('monthlyGoalsSubtitle'),
    monthlyGoalsList: document.getElementById('monthlyGoalsList'),
    goalsCompletionBadge: document.getElementById('goalsCompletionBadge'),
    newMonthlyGoalInput: document.getElementById('newMonthlyGoalInput'),
    btnAddMonthlyGoal: document.getElementById('btnAddMonthlyGoal'),
    weeklySelectDropdown: document.getElementById('weeklySelectDropdown'),
    weeklyGoalsList: document.getElementById('weeklyGoalsList'),
    newWeeklyGoalInput: document.getElementById('newWeeklyGoalInput'),
    btnAddWeeklyGoal: document.getElementById('btnAddWeeklyGoal'),

    // Analytics
    analyticsCanvas: document.getElementById('analyticsCanvas'),
    chartTooltip: document.getElementById('chartTooltip'),
    analyticsAvgRate: document.getElementById('analyticsAvgRate'),
    analyticsHabitsCount: document.getElementById('analyticsHabitsCount'),
    analyticsBestStreak: document.getElementById('analyticsBestStreak'),
    analyticsActiveDays: document.getElementById('analyticsActiveDays'),
    analyticsDailyScore: document.getElementById('analyticsDailyScore'),
    analyticsTabButtons: document.querySelectorAll('.analytics-tab-btn'),

    // Journal & Review
    journalDateLabel: document.getElementById('journalDateLabel'),
    journalTextarea: document.getElementById('journalTextarea'),
    journalWordCount: document.getElementById('journalWordCount'),
    btnSaveJournal: document.getElementById('btnSaveJournal'),
    journalSaveStatus: document.getElementById('journalSaveStatus'),
    journalTimelineContainer: document.getElementById('journalTimelineContainer'),

    reviewWeekSelect: document.getElementById('reviewWeekSelect'),
    revConsYes: document.getElementById('revConsYes'),
    revConsPart: document.getElementById('revConsPart'),
    revConsNo: document.getElementById('revConsNo'),
    revWentWell: document.getElementById('revWentWell'),
    revImprove: document.getElementById('revImprove'),
    revNextFocus: document.getElementById('revNextFocus'),
    btnSaveWeeklyReview: document.getElementById('btnSaveWeeklyReview'),
    reviewSaveStatus: document.getElementById('reviewSaveStatus'),

    // Settings
    settingsProfileForm: document.getElementById('settingsProfileForm'),
    settingName: document.getElementById('settingName'),
    settingStartDate: document.getElementById('settingStartDate'),
    settingGoal: document.getElementById('settingGoal'),
    btnExportData: document.getElementById('btnExportData'),
    importFileInput: document.getElementById('importFileInput'),
    btnResetDataModal: document.getElementById('btnResetDataModal'),

    // Modals
    profileSetupModal: document.getElementById('profileSetupModal'),
    onboardingForm: document.getElementById('onboardingForm'),
    setupName: document.getElementById('setupName'),
    setupStartDate: document.getElementById('setupStartDate'),
    setupGoal: document.getElementById('setupGoal'),

    addGoalModal: document.getElementById('addGoalModal'),
    addGoalForm: document.getElementById('addGoalForm'),
    newGoalTitle: document.getElementById('newGoalTitle'),
    newGoalMonth: document.getElementById('newGoalMonth'),
    newGoalCategory: document.getElementById('newGoalCategory'),
    btnCloseGoalModal: document.getElementById('btnCloseGoalModal'),

    // Add Discipline / Habit Modal
    btnOpenAddHabitModal: document.getElementById('btnOpenAddHabitModal'),
    btnToggleDefaultHabits: document.getElementById('btnToggleDefaultHabits'),
    btnOpenRemoveHabitModal: document.getElementById('btnOpenRemoveHabitModal'),
    btnResetHabits: document.getElementById('btnResetHabits'),
    addHabitModal: document.getElementById('addHabitModal'),
    addHabitForm: document.getElementById('addHabitForm'),
    newHabitName: document.getElementById('newHabitName'),
    newHabitDesc: document.getElementById('newHabitDesc'),
    newHabitIcon: document.getElementById('newHabitIcon'),
    btnCloseHabitModal: document.getElementById('btnCloseHabitModal'),
    btnCancelHabitModal: document.getElementById('btnCancelHabitModal'),
    emojiPresetChips: document.getElementById('emojiPresetChips'),

    // Remove Habit Modal
    removeHabitModal: document.getElementById('removeHabitModal'),
    removeHabitsListContainer: document.getElementById('removeHabitsListContainer'),
    btnCloseRemoveHabitModal: document.getElementById('btnCloseRemoveHabitModal'),
    btnDoneRemoveHabitModal: document.getElementById('btnDoneRemoveHabitModal'),

    dayInspectModal: document.getElementById('dayInspectModal'),
    inspectDayNumberBadge: document.getElementById('inspectDayNumberBadge'),
    inspectDayTitle: document.getElementById('inspectDayTitle'),
    inspectDayScore: document.getElementById('inspectDayScore'),
    inspectHabitsList: document.getElementById('inspectHabitsList'),
    btnJumpToInspectDay: document.getElementById('btnJumpToInspectDay'),
    btnCloseInspectModal: document.getElementById('btnCloseInspectModal'),

    resetConfirmModal: document.getElementById('resetConfirmModal'),
    resetConfirmInput: document.getElementById('resetConfirmInput'),
    btnConfirmReset: document.getElementById('btnConfirmReset'),
    btnCancelReset: document.getElementById('btnCancelReset'),
    btnCloseResetModal: document.getElementById('btnCloseResetModal'),

    // Certificate Elements
    btnOpenCertModal: document.getElementById('btnOpenCertModal'),
    arcCompleteBanner: document.getElementById('arcCompleteBanner'),
    btnClaimCertificate: document.getElementById('btnClaimCertificate'),
    certificateModal: document.getElementById('certificateModal'),
    certRecipientName: document.getElementById('certRecipientName'),
    certVerificationCode: document.getElementById('certVerificationCode'),
    btnDownloadCertPng: document.getElementById('btnDownloadCertPng'),
    btnPrintCert: document.getElementById('btnPrintCert'),
    btnCloseCertModal: document.getElementById('btnCloseCertModal'),
    btnCloseCertModal2: document.getElementById('btnCloseCertModal2')
  };

  // ==========================================================================
  // 1. INITIALIZATION & LIFECYCLE
  // ==========================================================================

  function initApp() {
    loadSettings();
    loadUser();
    initSnowParticles();
    bindGlobalEvents();

    // Check if user profile exists
    if (appState.user && appState.user.name) {
      // User profile is present
      // Auto-enter dashboard or let them browse
      applyUserProfileToUI();
      // Set landing screen buttons behavior
      DOM.btnLandingExisting.style.display = 'inline-flex';
      DOM.btnLandingExisting.onclick = () => showDashboard();
    } else {
      // First visit - user profile does not exist yet (neutral universal display)
      DOM.btnLandingExisting.style.display = 'none';
      if (DOM.landingBrandName) DOM.landingBrandName.textContent = 'THE';
      if (DOM.navBrandName) DOM.navBrandName.textContent = 'MY';
      if (DOM.footerBrandTitle) DOM.footerBrandTitle.textContent = 'THE WINTER ARC 2026';
      if (DOM.strongerTargetName) DOM.strongerTargetName.textContent = 'YOU';
      if (DOM.pageTitle) DOM.pageTitle.textContent = 'THE WINTER ARC | 92 Days of Discipline';
    }

    // Initialize Dedicated Page Router (Pure multi-page SPA navigation)
    initPageRouter();

    // Automatically start soundtrack when users open the website
    tryAutoPlaySoundtrack();

    // Set default date picker values to today
    const todayStr = getTodayDateString();
    if (DOM.setupStartDate) DOM.setupStartDate.value = todayStr;
    if (DOM.settingStartDate) DOM.settingStartDate.value = todayStr;
  }

  // ==========================================================================
  // 2. USER PROFILE MANAGEMENT
  // ==========================================================================

  /**
   * Loads user profile from localStorage
   */
  function loadUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (data) {
        appState.user = JSON.parse(data);
      } else {
        appState.user = null;
      }
    } catch (err) {
      console.error('Error loading user profile:', err);
      appState.user = null;
    }
    return appState.user;
  }

  /**
   * Saves user profile to localStorage
   */
  function saveUser(profile) {
    try {
      const sanitizedName = profile.name ? profile.name.trim() : '';
      appState.user = {
        name: sanitizedName || 'Warrior',
        startDate: profile.startDate || getTodayDateString(),
        goal: (profile.goal && profile.goal.trim()) || 'Build unbreakable discipline and mental clarity',
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(appState.user));
      applyUserProfileToUI();
      showToast('Profile saved successfully');
    } catch (err) {
      console.error('Error saving user profile:', err);
    }
  }

  /**
   * Synchronizes user profile data across all dashboard widgets & branding elements
   */
  function applyUserProfileToUI() {
    if (!appState.user) return;

    const { name, startDate, goal } = appState.user;
    const cleanName = (name && name.trim()) || 'Warrior';
    const upperName = cleanName.toUpperCase();

    // Dynamic Branding Across the entire application
    if (DOM.landingBrandName) DOM.landingBrandName.textContent = upperName;
    if (DOM.navBrandName) DOM.navBrandName.textContent = upperName;
    if (DOM.footerBrandTitle) DOM.footerBrandTitle.textContent = `${upperName} — WINTER ARC 2026`;
    if (DOM.strongerTargetName) DOM.strongerTargetName.textContent = upperName;
    if (DOM.pageTitle) DOM.pageTitle.textContent = `${upperName} — WINTER ARC | 92 Days of Discipline`;
    if (DOM.certRecipientName) DOM.certRecipientName.textContent = upperName;

    // Live auto-updating greeting (updates every minute)
    function updateGreeting() {
      const h = new Date().getHours();
      let greet = 'GOOD MORNING';
      if (h >= 12 && h < 17) greet = 'GOOD AFTERNOON';
      else if (h >= 17) greet = 'GOOD EVENING';
      DOM.heroGreeting.textContent = `${greet}, ${upperName}.`;
    }
    updateGreeting(); // run immediately on load

    // Clear any previous interval and start a new one
    if (window._greetingInterval) clearInterval(window._greetingInterval);
    window._greetingInterval = setInterval(updateGreeting, 60 * 1000);

    // Nav pill
    const initial = cleanName.charAt(0).toUpperCase() || 'W';
    DOM.userInitial.textContent = initial;
    DOM.userPillName.textContent = cleanName;

    // Settings form inputs
    if (DOM.settingName) DOM.settingName.value = cleanName;
    if (DOM.settingStartDate) DOM.settingStartDate.value = startDate;
    if (DOM.settingGoal) DOM.settingGoal.value = goal;

    // Calculate Day count & Phase
    updateArcTimeline(startDate);

    // Refresh all dependent views
    loadHabits(appState.activeDate);
    loadPriorities(appState.activeDate);
    loadGratitude(appState.activeDate);
    loadNotes(appState.activeDate);
    loadGoals();
    loadWeeklyGoals(DOM.weeklySelectDropdown.value);
    loadJournalHistory();
    loadWeeklyReview(DOM.reviewWeekSelect.value);
    renderCalendar();
    renderAnalytics(appState.analyticsRange);
  }

  /**
   * Calculates Day X of 90 and remaining days based on startDate
   */
  function updateArcTimeline(startDateStr) {
    const start = new Date(startDateStr + 'T00:00:00');
    const today = new Date(getTodayDateString() + 'T00:00:00');

    const diffTime = today - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    let dayNumber = diffDays;
    let remaining = 92 - dayNumber;

    if (dayNumber < 1) {
      dayNumber = 1;
      remaining = 92;
    } else if (dayNumber > 92) {
      dayNumber = 92;
      remaining = 0;
    }

    const dayPadded = String(dayNumber).padStart(2, '0');
    DOM.heroDayCounter.textContent = `DAY ${dayPadded} / 92`;
    DOM.heroDaysRemaining.textContent = `${remaining} DAYS REMAINING`;
    DOM.navDayBadge.textContent = `DAY ${dayPadded} / 92`;

    // Progress Bar Fill
    const progressPercent = Math.min(100, Math.max(1, (dayNumber / 92) * 100));
    DOM.arcTotalBarFill.style.width = `${progressPercent}%`;

    // Active Phase (October: 31d, November: 30d, December: 31d = 92d total)
    let phaseName = 'PHASE 01: BUILD THE FOUNDATION';
    let phaseNum = 1;
    if (dayNumber >= 32 && dayNumber <= 61) {
      phaseName = 'PHASE 02: BUILD CONSISTENCY';
      phaseNum = 2;
    } else if (dayNumber >= 62) {
      phaseName = 'PHASE 03: BECOME THE STANDARD';
      phaseNum = 3;
    }

    appState.activePhase = phaseNum;
    DOM.currentPhaseTag.textContent = phaseName;
    DOM.arcPhaseLabel.textContent = `Phase ${phaseNum} of 3`;

    // Live Date Display
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    DOM.heroLiveDate.textContent = new Date().toLocaleDateString('en-US', dateOptions);

    // 92-Day Arc Completion Check & Auto-Certificate Generation
    if (dayNumber >= 92) {
      if (DOM.arcCompleteBanner) DOM.arcCompleteBanner.style.display = 'flex';
      if (DOM.btnOpenCertModal) {
        DOM.btnOpenCertModal.classList.add('unlocked-glow');
        DOM.btnOpenCertModal.classList.remove('locked');
        DOM.btnOpenCertModal.innerHTML = `<span>🏆 92-DAY CERTIFICATE</span>`;
        DOM.btnOpenCertModal.title = 'View Official 92-Day Winter Arc Certificate';
      }

      // Auto-generate and display certificate celebration once upon completion
      try {
        const celebrated = localStorage.getItem('winterArcCertCelebrated');
        if (!celebrated) {
          localStorage.setItem('winterArcCertCelebrated', 'true');
          setTimeout(() => {
            openCertificateModal(true);
            showToast('🏆 92-Day Winter Arc Conquered! Certificate Unlocked!');
          }, 1500);
        }
      } catch (e) {}
    } else {
      if (DOM.arcCompleteBanner) DOM.arcCompleteBanner.style.display = 'none';
      if (DOM.btnOpenCertModal) {
        DOM.btnOpenCertModal.classList.remove('unlocked-glow');
        DOM.btnOpenCertModal.classList.add('locked');
        DOM.btnOpenCertModal.innerHTML = `<span>🔒 CERTIFICATE (DAY 92)</span>`;
        DOM.btnOpenCertModal.title = `Locked until Day 92 (${92 - dayNumber} days remaining)`;
      }
    }
  }

  // ==========================================================================
  // 3. HABIT TRACKING SYSTEM (TODAY'S DISCIPLINE)
  // ==========================================================================

  /**
   * Retrieves all habit logs from localStorage
   */
  function getAllHabitLogs() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HABITS);
      return data ? JSON.parse(data) : {};
    } catch (err) {
      console.error('Error reading habits store:', err);
      return {};
    }
  }

  // --- CUSTOM & ACTIVE HABIT MANAGEMENT ---

  /** Returns the user-created custom tasks */
  function getCustomHabits() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_HABITS);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      return [];
    }
  }

  /** Persists the custom tasks array */
  function saveCustomHabits(habits) {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_HABITS, JSON.stringify(habits));
    } catch (err) {
      console.error('Error saving custom habits:', err);
    }
  }

  /** Returns which default habit IDs the user has chosen to hide */
  function getHiddenDefaultHabits() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HIDDEN_HABITS);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      return [];
    }
  }

  /** Persists the hidden-default-habits list */
  function saveHiddenDefaultHabits(list) {
    try {
      localStorage.setItem(STORAGE_KEYS.HIDDEN_HABITS, JSON.stringify(list));
    } catch (err) {}
  }

  /**
   * Returns the full active habit list for all 90 days:
   *   DEFAULT_HABITS (minus hidden ones) + user's custom habits
   * Replace every direct reference to DEFAULT_HABITS with this.
   */
  function getActiveHabits() {
    const hidden = getHiddenDefaultHabits();
    const defaults = DEFAULT_HABITS.filter((h) => !hidden.includes(h.id));
    return [...defaults, ...getCustomHabits()];
  }

  /**
   * Adds a new custom task that persists across all 90 days
   */
  function addCustomHabit(name, icon, desc) {
    const customs = getCustomHabits();
    const id = 'custom-' + Date.now();
    customs.push({
      id,
      name: name.trim(),
      icon: icon.trim() || '⭐',
      desc: desc.trim() || '',
      category: 'custom',
      isCustom: true
    });
    saveCustomHabits(customs);
    refreshHabitViews();
    showToast('✅ Task added for all 90 days!');
  }

  /**
   * Removes a custom task, or hides a default habit, for all 90 days
   */
  function removeHabit(habitId, isCustom) {
    if (isCustom) {
      const customs = getCustomHabits();
      const idx = customs.findIndex((h) => h.id === habitId);
      if (idx > -1) {
        customs.splice(idx, 1);
        saveCustomHabits(customs);
      }
    } else {
      // Hide a default habit from all views
      const hidden = getHiddenDefaultHabits();
      if (!hidden.includes(habitId)) {
        hidden.push(habitId);
        saveHiddenDefaultHabits(hidden);
      }
    }
    refreshHabitViews();
    showToast('Task removed from all 90 days.');
  }

  /**
   * Restores default 12 poster habits (unhiding any hidden ones)
   */
  function restoreDefaultHabits() {
    saveHiddenDefaultHabits([]);
    refreshHabitViews();
    showToast('Original 12 disciplines restored.');
  }

  /**
   * Updates the text and icon of the "REMOVE DEFAULT 12 / RESTORE DEFAULT 12" button
   */
  function updateDefaultHabitsButton() {
    const btn = DOM.btnToggleDefaultHabits;
    if (!btn) return;

    const hidden = getHiddenDefaultHabits();
    const allDefaultsHidden = DEFAULT_HABITS.every((h) => hidden.includes(h.id));

    if (allDefaultsHidden) {
      btn.innerHTML = `
        <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13" style="margin-right: 4px;">
          <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
        </svg>
        <span>RESTORE DEFAULT 12</span>
      `;
      btn.classList.remove('btn-remove-default');
      btn.title = 'Restore the original 12 poster disciplines for all 90 days';
    } else {
      btn.innerHTML = `
        <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13" style="margin-right: 4px;">
          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
        <span>REMOVE DEFAULT 12</span>
      `;
      btn.classList.add('btn-remove-default');
      btn.title = 'Remove all 12 pre-defined tasks for all 90 days';
    }
  }

  /**
   * Toggles removing all 12 default habits or restoring them
   */
  function toggleDefaultHabits() {
    const hidden = getHiddenDefaultHabits();
    const allDefaultsHidden = DEFAULT_HABITS.every((h) => hidden.includes(h.id));

    if (allDefaultsHidden) {
      saveHiddenDefaultHabits([]);
      refreshHabitViews();
      showToast('Restored 12 pre-defined disciplines for all 90 days.');
    } else {
      if (confirm('Remove all 12 pre-defined tasks for all 90 days? You can add your own custom tasks or restore them at any time.')) {
        const allIds = DEFAULT_HABITS.map((h) => h.id);
        saveHiddenDefaultHabits(allIds);
        refreshHabitViews();
        showToast('All 12 pre-defined tasks removed for all 90 days.');
      }
    }
  }

  /**
   * Renders the list of active habits inside the Remove Disciplines modal
   */
  function renderRemoveHabitsModal() {
    if (!DOM.removeHabitsListContainer) return;
    const activeHabits = getActiveHabits();
    DOM.removeHabitsListContainer.innerHTML = '';

    if (activeHabits.length === 0) {
      DOM.removeHabitsListContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem; color: var(--text-muted); font-size: 0.88rem;">
          No active disciplines configured.
        </div>
      `;
      return;
    }

    activeHabits.forEach((habit) => {
      const item = document.createElement('div');
      item.className = 'manage-habit-item';
      item.innerHTML = `
        <div class="manage-habit-info">
          <span class="manage-habit-icon">${habit.icon || '🎯'}</span>
          <div class="manage-habit-text">
            <div class="manage-habit-name">${escapeHTML(habit.name)}</div>
            <div class="manage-habit-desc">${escapeHTML(habit.desc || (habit.isCustom ? 'Custom task' : 'Default discipline'))}</div>
          </div>
        </div>
        <button type="button" class="btn btn-danger btn-xs btn-remove-row" title="Remove this discipline for all 90 days">
          Remove
        </button>
      `;

      const btnRemoveItem = item.querySelector('.btn-remove-row');
      btnRemoveItem.addEventListener('click', () => {
        if (confirm(`Remove "${habit.name}" from all 90 days?`)) {
          removeHabit(habit.id, !!habit.isCustom);
          renderRemoveHabitsModal();
        }
      });

      DOM.removeHabitsListContainer.appendChild(item);
    });
  }

  /**
   * Refreshes all views that depend on the habit list
   */
  function refreshHabitViews() {
    loadHabits(appState.activeDate);
    renderWeeklyMatrix();
    calculateStreak();
    renderCalendar();
    renderAnalytics(appState.analyticsRange);
  }


  function saveHabit(dateStr, habitId, isChecked) {
    const logs = getAllHabitLogs();
    if (!logs[dateStr]) {
      logs[dateStr] = {};
    }

    logs[dateStr][habitId] = isChecked;

    try {
      localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(logs));
    } catch (err) {
      console.error('Error saving habit:', err);
    }

    // Play subtle audio click synthesizer feedback
    playHapticTone(isChecked ? 587.33 : 329.63, 0.08); // D5 or E4 note

    // Recalculate progress, streak, stats, and calendar
    calculateProgress(dateStr);
    calculateStreak();
    renderCalendar();
    renderAnalytics(appState.analyticsRange);
  }

  /**
   * Loads habits for a specific date into the daily tracker view
   */
  function loadHabits(dateStr) {
    const logs = getAllHabitLogs();
    const dayHabits = logs[dateStr] || {};

    // Update active date display with Day badge
    const dateObj = new Date(dateStr + 'T00:00:00');
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    const dateFormatted = dateObj.toLocaleDateString('en-US', options);

    let dayBadge = '';
    if (appState.user && appState.user.startDate) {
      const start = new Date(appState.user.startDate + 'T00:00:00');
      const diffDays = Math.floor((dateObj - start) / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays >= 1 && diffDays <= 92) {
        dayBadge = `DAY ${String(diffDays).padStart(2, '0')} · `;
      }
    }
    DOM.activeDateDisplay.textContent = `${dayBadge}${dateFormatted}`;

    const activeHabits = getActiveHabits();

    // Update column title with dynamic habit count
    if (DOM.habitsColumnTitle && (!DOM.btnViewWeekly || !DOM.btnViewWeekly.classList.contains('active'))) {
      DOM.habitsColumnTitle.textContent = `${activeHabits.length} DAILY NON-NEGOTIABLES`;
    }

    // Build habits DOM
    DOM.habitsListContainer.innerHTML = '';

    if (activeHabits.length === 0) {
      DOM.habitsListContainer.innerHTML = `
        <div class="habits-empty-state card-glass" style="text-align: center; padding: 2.5rem 1.5rem;">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">📋</div>
          <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.35rem;">No Disciplines Configured</div>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1.25rem;">Add your custom tasks or restore the original 12 poster disciplines.</p>
          <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
            <button type="button" class="btn btn-gold btn-sm" id="btnEmptyAddHabit">+ Add Task</button>
            <button type="button" class="btn btn-outline btn-sm" id="btnEmptyRestoreHabits">Restore Default 12</button>
          </div>
        </div>
      `;

      const btnEmptyAdd = document.getElementById('btnEmptyAddHabit');
      if (btnEmptyAdd) {
        btnEmptyAdd.onclick = () => openModal(DOM.addHabitModal);
      }
      const btnEmptyRestore = document.getElementById('btnEmptyRestoreHabits');
      if (btnEmptyRestore) {
        btnEmptyRestore.onclick = () => restoreDefaultHabits();
      }
    } else {
      activeHabits.forEach((habit) => {
        const isDone = !!dayHabits[habit.id];

        const row = document.createElement('div');
        row.className = `habit-row ${isDone ? 'completed' : ''}`;
        row.setAttribute('data-id', habit.id);

        row.innerHTML = `
          <div class="habit-icon">${habit.icon || '🎯'}</div>
          <div class="habit-details">
            <div class="habit-name">${escapeHTML(habit.name)}</div>
            <div class="habit-desc">${escapeHTML(habit.desc || '')}</div>
          </div>
          <button type="button" class="habit-remove-btn" title="Remove '${escapeHTML(habit.name)}' from all 90 days" aria-label="Remove discipline">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            <span>Remove</span>
          </button>
          <div class="custom-checkbox" aria-label="Toggle habit">
            <svg viewBox="0 0 20 20" fill="none">
              <polyline points="4 11 8 15 16 6"></polyline>
            </svg>
          </div>
        `;

        // Toggle habit on click
        row.addEventListener('click', () => {
          const currentlyDone = row.classList.contains('completed');
          const newState = !currentlyDone;
          row.classList.toggle('completed', newState);
          saveHabit(dateStr, habit.id, newState);
        });

        // Remove habit handler (stop row toggle)
        const removeBtn = row.querySelector('.habit-remove-btn');
        if (removeBtn) {
          removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(`Remove "${habit.name}" from all 90 days?`)) {
              removeHabit(habit.id, !!habit.isCustom);
            }
          });
        }

        DOM.habitsListContainer.appendChild(row);
      });
    }

    // Update circular progress and badges
    calculateProgress(dateStr);
    renderWeeklyMatrix();
    renderPosterStreakBeads();
    updateDefaultHabitsButton();
  }

  /**
   * Calculates progress for the current date and animates gauge
   */
  function calculateProgress(dateStr) {
    const logs = getAllHabitLogs();
    const dayHabits = logs[dateStr] || {};
    const activeHabits = getActiveHabits();
    const totalHabits = activeHabits.length;

    let completedCount = 0;
    activeHabits.forEach((habit) => {
      if (dayHabits[habit.id]) completedCount++;
    });

    const percent = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;

    // Update text indicators
    DOM.habitsCheckedCounter.textContent = `${completedCount} / ${totalHabits} COMPLETED`;
    DOM.mainProgressPercent.textContent = `${percent}%`;
    DOM.mainProgressRatio.textContent = `${completedCount} / ${totalHabits} completed`;
    DOM.miniDialPercent.textContent = `${percent}%`;
    DOM.statTodayCompletion.innerHTML = `${percent}<span class="stat-unit">%</span>`;
    DOM.statTodayHabitRatio.textContent = `${completedCount} / ${totalHabits} habits done`;

    // SVG Circular Progress Animation
    // Total circumference for r=82 is 2 * PI * 82 ≈ 515.2
    const totalCircumference = 515.2;
    const strokeOffset = totalCircumference - (percent / 100) * totalCircumference;
    DOM.mainProgressCircle.style.strokeDashoffset = strokeOffset;

    // Mini quick dial animation (r=42 => circumference ≈ 263.9)
    const miniCircumference = 264;
    const miniOffset = miniCircumference - (percent / 100) * miniCircumference;
    DOM.miniRingFill.style.strokeDashoffset = miniOffset;

    // Badge & 100% Day Complete Banner
    if (totalHabits > 0 && percent === 100) {
      DOM.gaugeStatusBadge.textContent = 'DAY COMPLETE 🔥';
      DOM.gaugeStatusBadge.classList.add('badge-complete');
      DOM.dayCompleteBanner.style.display = 'flex';
      const completeSub = DOM.dayCompleteBanner.querySelector('.complete-sub');
      if (completeSub) {
        completeSub.textContent = `All ${totalHabits} disciplines executed. You showed up today.`;
      }
    } else if (percent >= 50) {
      DOM.gaugeStatusBadge.textContent = 'STRONG PROGRESS';
      DOM.gaugeStatusBadge.classList.remove('badge-complete');
      DOM.dayCompleteBanner.style.display = 'none';
    } else {
      DOM.gaugeStatusBadge.textContent = 'IN PROGRESS';
      DOM.gaugeStatusBadge.classList.remove('badge-complete');
      DOM.dayCompleteBanner.style.display = 'none';
    }

    return { completedCount, totalHabits, percent };
  }

  // ==========================================================================
  // 4. STREAK & HISTORICAL CALCULATION SYSTEM
  // ==========================================================================

  /**
   * Calculates current streak, best streak, total 100% days, and average score
   */
  function calculateStreak() {
    const logs = getAllHabitLogs();
    const totalHabits = getActiveHabits().length || 1;
    const todayStr = getTodayDateString();

    const loggedDates = Object.keys(logs).sort();

    let totalCompleted100Days = 0;
    let totalHabitsDoneOverall = 0;
    let totalScoreSum = 0;
    let daysWithLogs = 0;

    // Map each date to its percentage score
    const dateScores = {};
    loggedDates.forEach((dateKey) => {
      const dayData = logs[dateKey];
      let checked = 0;
      Object.keys(dayData).forEach((hId) => {
        if (dayData[hId]) checked++;
      });

      totalHabitsDoneOverall += checked;
      const score = Math.round((checked / totalHabits) * 100);
      dateScores[dateKey] = score;

      if (checked > 0) {
        totalScoreSum += score;
        daysWithLogs++;
      }

      if (score === 100) {
        totalCompleted100Days++;
      }
    });

    // Calculate Current Streak:
    // A streak day is considered any day where at least 60% of habits are done, or habits are logged.
    // Consecutive backward check from today (or yesterday if today is still 0)
    let currentStreak = 0;
    let checkDate = new Date(todayStr + 'T00:00:00');

    // Check today's score
    const todayScore = dateScores[todayStr] || 0;
    if (todayScore >= 50) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // If today is not completed yet, start check from yesterday
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Loop backwards consecutively
    while (true) {
      const dStr = formatDateString(checkDate);
      const score = dateScores[dStr] || 0;
      if (score >= 50) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Calculate Best Streak across all recorded days
    let bestStreak = 0;
    let tempStreak = 0;

    if (loggedDates.length > 0) {
      // Find date range from first recorded to today
      const firstDate = new Date(loggedDates[0] + 'T00:00:00');
      const endDate = new Date(todayStr + 'T00:00:00');
      const cur = new Date(firstDate);

      while (cur <= endDate) {
        const dStr = formatDateString(cur);
        const score = dateScores[dStr] || 0;
        if (score >= 50) {
          tempStreak++;
          if (tempStreak > bestStreak) bestStreak = tempStreak;
        } else {
          tempStreak = 0;
        }
        cur.setDate(cur.getDate() + 1);
      }
    }

    if (currentStreak > bestStreak) bestStreak = currentStreak;

    // Average Score
    const avgScore = daysWithLogs > 0 ? Math.round(totalScoreSum / daysWithLogs) : 0;

    // Update Dashboard UI
    DOM.statCurrentStreak.innerHTML = `${currentStreak} <span class="stat-unit">DAYS</span>`;
    DOM.statTotalHabitsDone.textContent = totalHabitsDoneOverall;
    DOM.microCurrentStreak.textContent = `${currentStreak} Days`;
    DOM.microBestStreak.textContent = `${bestStreak} Days`;
    DOM.microCompletedDays.textContent = `${totalCompleted100Days} Days`;
    DOM.microAverageScore.textContent = `${avgScore}%`;

    // Refresh Poster Streak Beads
    renderPosterStreakBeads();

    return {
      currentStreak,
      bestStreak,
      totalCompleted100Days,
      totalHabitsDoneOverall,
      avgScore
    };
  }

  /**
   * Renders the 7-day (MON–SUN) weekly matrix table matching the reference poster
   */
  function renderWeeklyMatrix() {
    if (!DOM.weeklyMatrixTbody) return;

    const logs = getAllHabitLogs();
    const activeDateObj = new Date(appState.activeDate + 'T00:00:00');
    const dayOfWeek = activeDateObj.getDay(); // 0 is Sun, 1 is Mon...

    // Find Monday of the week containing appState.activeDate
    const diffToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const mondayObj = new Date(activeDateObj);
    mondayObj.setDate(activeDateObj.getDate() + diffToMon);

    // Calculate dates for Monday through Sunday
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(mondayObj);
      d.setDate(mondayObj.getDate() + i);
      weekDates.push(formatDateString(d));
    }

    // Highlight the column header matching appState.activeDate
    const thDays = document.querySelectorAll('.matrix-th-day');
    const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    thDays.forEach((th, idx) => {
      const colDate = weekDates[idx];
      const isColActive = colDate === appState.activeDate;
      const isColToday = colDate === getTodayDateString();
      th.classList.toggle('current-weekday', isColActive || isColToday);
      const dayNum = new Date(colDate + 'T00:00:00').getDate();
      th.innerHTML = `${dayNames[idx]}<br><span style="font-size: 0.65rem; font-weight: normal; opacity: 0.7;">${dayNum}</span>`;
    });

    // Populate rows for active habits
    DOM.weeklyMatrixTbody.innerHTML = '';
    const activeHabits = getActiveHabits();

    if (activeHabits.length === 0) {
      DOM.weeklyMatrixTbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 1.5rem; color: var(--text-muted);">No disciplines configured. Click "+ ADD TASK" to add disciplines.</td></tr>';
    } else {
      activeHabits.forEach((habit) => {
        const tr = document.createElement('tr');

        // Habit Name Cell
        let rowHTML = `
          <td class="matrix-habit-name-cell">
            <span class="matrix-habit-icon">${habit.icon || '🎯'}</span>
            <span class="matrix-habit-text">${escapeHTML(habit.name)}</span>
          </td>
        `;

        // 7 Day Cells (Mon-Sun)
        weekDates.forEach((dateStr) => {
          const isDone = !!(logs[dateStr] && logs[dateStr][habit.id]);
          const isColActive = dateStr === appState.activeDate;
          rowHTML += `
            <td class="matrix-day-cell ${isColActive ? 'current-col' : ''}" data-date="${dateStr}" data-habit="${habit.id}">
              <div class="matrix-chk-box ${isDone ? 'checked' : ''}" title="${dateStr} - ${habit.name}">
                ${isDone ? '✓' : ''}
              </div>
            </td>
          `;
        });

        tr.innerHTML = rowHTML;

        // Event listener for each day cell in this row
        tr.querySelectorAll('.matrix-day-cell').forEach((cell) => {
          cell.addEventListener('click', () => {
            const date = cell.getAttribute('data-date');
            const hId = cell.getAttribute('data-habit');
            const chkBox = cell.querySelector('.matrix-chk-box');
            const willBeChecked = !chkBox.classList.contains('checked');
            chkBox.classList.toggle('checked', willBeChecked);
            chkBox.textContent = willBeChecked ? '✓' : '';
            saveHabit(date, hId, willBeChecked);
            if (date === appState.activeDate) {
              loadHabits(date);
            }
          });
        });

        DOM.weeklyMatrixTbody.appendChild(tr);
      });
    }
  }

  /**
   * Renders the 30 numbered circular streak beads (1 to 30) matching the reference poster
   */
  function renderPosterStreakBeads() {
    if (!DOM.posterStreakBeadsGrid || !appState.user) return;

    const startDateStr = appState.user.startDate || getTodayDateString();
    const logs = getAllHabitLogs();
    const todayStr = getTodayDateString();
    const totalHabits = getActiveHabits().length || 1;
    const arcStart = new Date(startDateStr + 'T00:00:00');

    DOM.posterStreakBeadsGrid.innerHTML = '';

    // Phase configuration matching October (31), November (30), December (31) = 92 days
    const PHASE_BOUNDS = {
      1: { start: 1, end: 31 },
      2: { start: 32, end: 61 },
      3: { start: 62, end: 92 }
    };
    const bounds = PHASE_BOUNDS[appState.activePhase] || PHASE_BOUNDS[1];
    const phaseStartDay = bounds.start;
    const phaseEndDay = bounds.end;

    for (let dayNum = phaseStartDay; dayNum <= phaseEndDay; dayNum++) {
      const dayDate = new Date(arcStart);
      dayDate.setDate(arcStart.getDate() + (dayNum - 1));
      const dateKey = formatDateString(dayDate);

      const dayLogs = logs[dateKey] || {};
      let doneCount = 0;
      Object.keys(dayLogs).forEach((hId) => {
        if (dayLogs[hId]) doneCount++;
      });
      const score = Math.round((doneCount / totalHabits) * 100);

      const isToday = dateKey === todayStr;
      const isPast = dateKey < todayStr;

      let beadClass = 'bead-future';
      let beadContent = `${dayNum}`;

      if (isToday) {
        beadClass = score === 100 ? 'bead-done bead-current' : 'bead-current';
        if (score === 100) beadContent = '✓';
      } else if (isPast) {
        if (score === 100) {
          beadClass = 'bead-done';
          beadContent = '✓';
        } else if (score >= 50) {
          beadClass = 'bead-partial';
        } else {
          beadClass = 'bead-missed';
        }
      }

      const bead = document.createElement('div');
      bead.className = `streak-bead ${beadClass}`;
      bead.textContent = beadContent;
      bead.title = `Day ${dayNum} (${dateKey}) - ${score}% completed`;

      bead.addEventListener('click', () => {
        openDayInspectModal(dayNum, dateKey, dayLogs, score);
      });

      DOM.posterStreakBeadsGrid.appendChild(bead);
    }
  }

  // ==========================================================================
  // 5. 92-DAY CALENDAR SYSTEM
  // ==========================================================================

  /**
   * Renders the day block of the currently active phase (31, 30, or 31 days)
   */
  function renderCalendar() {
    if (!appState.user) return;

    const startDateStr = appState.user.startDate || getTodayDateString();
    const logs = getAllHabitLogs();
    const todayStr = getTodayDateString();
    const totalHabits = getActiveHabits().length || 1;

    DOM.calendarDaysGrid.innerHTML = '';

    // Calculate starting day for active phase (Phase 1: 1-31, Phase 2: 32-61, Phase 3: 62-92)
    const PHASE_BOUNDS = {
      1: { start: 1, end: 31 },
      2: { start: 32, end: 61 },
      3: { start: 62, end: 92 }
    };
    const bounds = PHASE_BOUNDS[appState.activePhase] || PHASE_BOUNDS[1];
    const phaseStartDay = bounds.start;
    const phaseEndDay = bounds.end;

    const arcStart = new Date(startDateStr + 'T00:00:00');

    for (let dayNum = phaseStartDay; dayNum <= phaseEndDay; dayNum++) {
      // Calculate specific calendar date for this Arc Day
      const dayDate = new Date(arcStart);
      dayDate.setDate(arcStart.getDate() + (dayNum - 1));
      const dateKey = formatDateString(dayDate);

      const dayLogs = logs[dateKey] || {};
      let doneCount = 0;
      Object.keys(dayLogs).forEach((hId) => {
        if (dayLogs[hId]) doneCount++;
      });

      const score = Math.round((doneCount / totalHabits) * 100);

      // Determine cell state
      let stateClass = 'day-future';
      const isToday = dateKey === todayStr;
      const isPast = dateKey < todayStr;

      if (isToday) {
        stateClass = 'day-current';
      } else if (isPast) {
        if (score === 100) stateClass = 'day-completed';
        else if (score >= 50) stateClass = 'day-partial';
        else stateClass = 'day-missed';
      } else {
        stateClass = 'day-future';
      }

      const cell = document.createElement('div');
      cell.className = `cal-day-cell ${stateClass}`;
      cell.title = `Day ${dayNum} (${dateKey}) - ${score}% completed`;

      cell.innerHTML = `
        <span class="cal-day-num">${String(dayNum).padStart(2, '0')}</span>
        <span class="cal-day-pct">${isPast || isToday ? score + '%' : '—'}</span>
      `;

      // Click to inspect day details
      cell.addEventListener('click', () => {
        openDayInspectModal(dayNum, dateKey, dayLogs, score);
      });

      DOM.calendarDaysGrid.appendChild(cell);
    }
  }

  /**
   * Opens the inspect modal for a specific day
   */
  function openDayInspectModal(dayNum, dateKey, dayLogs, score) {
    DOM.inspectDayNumberBadge.textContent = `DAY ${String(dayNum).padStart(2, '0')}`;

    const dateObj = new Date(dateKey + 'T00:00:00');
    DOM.inspectDayTitle.textContent = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    const activeHabits = getActiveHabits();
    const totalHabits = activeHabits.length || 1;

    let doneCount = 0;
    activeHabits.forEach((h) => {
      if (dayLogs[h.id]) doneCount++;
    });
    DOM.inspectDayScore.textContent = `Score: ${doneCount} / ${activeHabits.length} habits (${score}%)`;

    // Habit breakdown
    DOM.inspectHabitsList.innerHTML = '';
    activeHabits.forEach((habit) => {
      const isDone = !!dayLogs[habit.id];
      const item = document.createElement('div');
      item.className = `inspect-item ${isDone ? 'done' : 'missed'}`;
      item.innerHTML = `
        <span>${isDone ? '✓' : '○'}</span>
        <span>${habit.icon || '🎯'}</span>
        <span style="flex: 1;">${escapeHTML(habit.name)}</span>
        <span style="font-size: 0.72rem; color: ${isDone ? 'var(--gold-light)' : 'var(--text-muted)'};">
          ${isDone ? 'Executed' : 'Not logged'}
        </span>
      `;
      DOM.inspectHabitsList.appendChild(item);
    });

    // Jump button
    DOM.btnJumpToInspectDay.onclick = () => {
      appState.activeDate = dateKey;
      loadHabits(dateKey);
      loadPriorities(dateKey);
      loadGratitude(dateKey);
      loadNotes(dateKey);
      closeModal(DOM.dayInspectModal);
      switchPage('dailySection');
    };

    openModal(DOM.dayInspectModal);
  }

  // ==========================================================================
  // 6. GOALS MANAGEMENT (MONTHLY & WEEKLY)
  // ==========================================================================

  /**
   * Loads monthly goals with month filter (Month 1, 2, 3 or all)
   */
  function loadGoals(monthParam) {
    const selectedMonth = monthParam || (DOM.monthlySelectDropdown ? DOM.monthlySelectDropdown.value : appState.activeGoalMonth) || '1';
    appState.activeGoalMonth = selectedMonth;

    let goals = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GOALS);
      if (stored) {
        goals = JSON.parse(stored);
      } else {
        goals = DEFAULT_MONTHLY_GOALS;
        localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
      }
    } catch (err) {
      goals = DEFAULT_MONTHLY_GOALS;
    }

    // Ensure every goal has a month assigned (defaulting to '1' for legacy data)
    let needsMigration = false;
    goals.forEach((g) => {
      if (!g.month) {
        g.month = '1';
        needsMigration = true;
      }
    });
    if (needsMigration) {
      try {
        localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
      } catch (e) {}
    }

    // Update monthly goals subtitle
    if (DOM.monthlyGoalsSubtitle) {
      if (selectedMonth === '1') DOM.monthlyGoalsSubtitle.textContent = 'ARC TARGETS · MONTH 01 (OCTOBER · DAYS 1–31)';
      else if (selectedMonth === '2') DOM.monthlyGoalsSubtitle.textContent = 'ARC TARGETS · MONTH 02 (NOVEMBER · DAYS 32–61)';
      else if (selectedMonth === '3') DOM.monthlyGoalsSubtitle.textContent = 'ARC TARGETS · MONTH 03 (DECEMBER · DAYS 62–92)';
      else DOM.monthlyGoalsSubtitle.textContent = 'ARC TARGETS · ALL 3 MONTHS (OCTOBER – DECEMBER)';
    }

    // Filter goals for the chosen month
    const filteredGoals = selectedMonth === 'all'
      ? goals
      : goals.filter((g) => (g.month || '1') === selectedMonth || g.month === 'all');

    DOM.monthlyGoalsList.innerHTML = '';
    let completedInFilter = 0;
    let totalCompletedOverall = 0;

    goals.forEach((g) => {
      if (g.completed) totalCompletedOverall++;
    });

    if (filteredGoals.length === 0) {
      DOM.monthlyGoalsList.innerHTML = `
        <div style="font-size: 0.8rem; color: var(--text-muted); padding: 1.5rem 0; text-align: center;">
          No goals set for Month ${selectedMonth === 'all' ? '' : '0' + selectedMonth}. Add your targets below.
        </div>
      `;
    } else {
      filteredGoals.forEach((goal) => {
        if (goal.completed) completedInFilter++;

        const item = document.createElement('div');
        item.className = `goal-item ${goal.completed ? 'completed' : ''}`;

        const monthBadge = selectedMonth === 'all' && goal.month
          ? `<span class="goal-category-tag" style="background: rgba(212,175,55,0.12); color: var(--gold-light);">M0${goal.month}</span>`
          : '';

        item.innerHTML = `
          <div class="goal-main-wrap">
            <label class="custom-chk">
              <input type="checkbox" ${goal.completed ? 'checked' : ''}>
              <span class="chk-box"></span>
            </label>
            <span class="goal-label">${escapeHTML(goal.title)}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            ${monthBadge}
            <span class="goal-category-tag">${escapeHTML(goal.category || 'Discipline')}</span>
            <button class="clear-item-btn" title="Remove">&times;</button>
          </div>
        `;

        // Checkbox event
        const chk = item.querySelector('input[type="checkbox"]');
        chk.addEventListener('change', () => {
          goal.completed = chk.checked;
          item.classList.toggle('completed', goal.completed);
          saveAllGoals(goals);
        });

        // Delete goal event (like weekly goals, any goal can be removed)
        const deleteBtn = item.querySelector('.clear-item-btn');
        if (deleteBtn) {
          deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const filtered = goals.filter((g) => g.id !== goal.id);
            saveAllGoals(filtered);
          });
        }

        DOM.monthlyGoalsList.appendChild(item);
      });
    }

    // Update goals completion badges
    if (DOM.goalsCompletionBadge) {
      DOM.goalsCompletionBadge.textContent = `${completedInFilter} / ${filteredGoals.length} DONE`;
    }
    if (DOM.statGoalsCompleted) {
      DOM.statGoalsCompleted.innerHTML = `${totalCompletedOverall} <span class="stat-unit">/ ${goals.length}</span>`;
    }
  }

  function saveAllGoals(goals) {
    try {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
      loadGoals(appState.activeGoalMonth);
      showToast('Goals updated');
    } catch (err) {
      console.error('Error saving goals:', err);
    }
  }

  /**
   * Adds custom user goal for specific month
   */
  function saveGoal(title, category, month) {
    let goals = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GOALS);
      goals = stored ? JSON.parse(stored) : DEFAULT_MONTHLY_GOALS;
    } catch (err) {
      goals = DEFAULT_MONTHLY_GOALS;
    }

    const targetMonth = month || (appState.activeGoalMonth === 'all' ? '1' : (appState.activeGoalMonth || '1'));

    const newGoal = {
      id: 'g-custom-' + Date.now(),
      title: title.trim(),
      category: category || 'Discipline',
      month: String(targetMonth),
      completed: false,
      isDefault: false
    };

    goals.push(newGoal);
    saveAllGoals(goals);
  }

  /**
   * Loads weekly goals for a chosen week
   */
  function loadWeeklyGoals(weekNum) {
    let allWeekly = {};
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WEEKLY_GOALS);
      if (stored) {
        allWeekly = JSON.parse(stored);
      } else {
        allWeekly = DEFAULT_WEEKLY_GOALS;
        localStorage.setItem(STORAGE_KEYS.WEEKLY_GOALS, JSON.stringify(allWeekly));
      }
    } catch (err) {
      allWeekly = DEFAULT_WEEKLY_GOALS;
    }

    const weekItems = allWeekly[weekNum] || [];
    DOM.weeklyGoalsList.innerHTML = '';

    if (weekItems.length === 0) {
      DOM.weeklyGoalsList.innerHTML = `
        <div style="font-size: 0.8rem; color: var(--text-muted); padding: 1rem 0; text-align: center;">
          No goals set for Week ${weekNum}. Add your targets below.
        </div>
      `;
      return;
    }

    weekItems.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = `goal-item ${item.completed ? 'completed' : ''}`;

      row.innerHTML = `
        <div class="goal-main-wrap">
          <label class="custom-chk">
            <input type="checkbox" ${item.completed ? 'checked' : ''}>
            <span class="chk-box"></span>
          </label>
          <span class="goal-label">${escapeHTML(item.text)}</span>
        </div>
        <button class="clear-item-btn" title="Remove">&times;</button>
      `;

      const chk = row.querySelector('input[type="checkbox"]');
      chk.addEventListener('change', () => {
        item.completed = chk.checked;
        row.classList.toggle('completed', item.completed);
        saveAllWeeklyGoals(allWeekly);
      });

      const del = row.querySelector('.clear-item-btn');
      del.addEventListener('click', () => {
        weekItems.splice(index, 1);
        allWeekly[weekNum] = weekItems;
        saveAllWeeklyGoals(allWeekly);
      });

      DOM.weeklyGoalsList.appendChild(row);
    });
  }

  function saveAllWeeklyGoals(allWeekly) {
    try {
      localStorage.setItem(STORAGE_KEYS.WEEKLY_GOALS, JSON.stringify(allWeekly));
      loadWeeklyGoals(DOM.weeklySelectDropdown.value);
    } catch (err) {
      console.error('Error saving weekly goals:', err);
    }
  }

  // ==========================================================================
  // 7. TODAY'S PRIORITIES, GRATITUDE & SCRATCHPAD
  // ==========================================================================

  function loadPriorities(dateStr) {
    try {
      const store = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRIORITIES) || '{}');
      const list = store[dateStr] || [
        { text: '', completed: false },
        { text: '', completed: false },
        { text: '', completed: false }
      ];

      DOM.priText0.value = list[0]?.text || '';
      DOM.priChk0.checked = !!list[0]?.completed;

      DOM.priText1.value = list[1]?.text || '';
      DOM.priChk1.checked = !!list[1]?.completed;

      DOM.priText2.value = list[2]?.text || '';
      DOM.priChk2.checked = !!list[2]?.completed;
    } catch (e) {
      console.error(e);
    }
  }

  function savePriorities(dateStr) {
    try {
      const store = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRIORITIES) || '{}');
      store[dateStr] = [
        { text: DOM.priText0.value.trim(), completed: DOM.priChk0.checked },
        { text: DOM.priText1.value.trim(), completed: DOM.priChk1.checked },
        { text: DOM.priText2.value.trim(), completed: DOM.priChk2.checked }
      ];
      localStorage.setItem(STORAGE_KEYS.PRIORITIES, JSON.stringify(store));
      DOM.priSaveIndicator.textContent = 'Saved at ' + new Date().toLocaleTimeString();
    } catch (e) {
      console.error(e);
    }
  }

  function loadGratitude(dateStr) {
    try {
      const store = JSON.parse(localStorage.getItem(STORAGE_KEYS.GRATITUDE) || '{}');
      const list = store[dateStr] || ['', '', ''];

      DOM.gratitudeInput0.value = list[0] || '';
      DOM.gratitudeInput1.value = list[1] || '';
      DOM.gratitudeInput2.value = list[2] || '';
    } catch (e) {
      console.error(e);
    }
  }

  function saveGratitude(dateStr) {
    try {
      const store = JSON.parse(localStorage.getItem(STORAGE_KEYS.GRATITUDE) || '{}');
      store[dateStr] = [
        DOM.gratitudeInput0.value.trim(),
        DOM.gratitudeInput1.value.trim(),
        DOM.gratitudeInput2.value.trim()
      ];
      localStorage.setItem(STORAGE_KEYS.GRATITUDE, JSON.stringify(store));
      DOM.gratSaveIndicator.textContent = 'Saved at ' + new Date().toLocaleTimeString();
    } catch (e) {
      console.error(e);
    }
  }

  function loadNotes(dateStr) {
    try {
      const store = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTES) || '{}');
      DOM.dailyQuickNotes.value = store[dateStr] || '';
    } catch (e) {
      console.error(e);
    }
  }

  function saveNotes(dateStr) {
    try {
      const store = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTES) || '{}');
      store[dateStr] = DOM.dailyQuickNotes.value;
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(store));
      DOM.notesSaveIndicator.textContent = 'Saved at ' + new Date().toLocaleTimeString();
    } catch (e) {
      console.error(e);
    }
  }

  // ==========================================================================
  // 8. DAILY JOURNAL & WEEKLY REVIEW
  // ==========================================================================

  function loadJournalHistory() {
    try {
      const entries = JSON.parse(localStorage.getItem(STORAGE_KEYS.JOURNAL) || '[]');
      DOM.journalTimelineContainer.innerHTML = '';

      if (entries.length === 0) {
        DOM.journalTimelineContainer.innerHTML = `
          <div style="font-size: 0.8rem; color: var(--text-muted); text-align: center; padding: 1.5rem 0;">
            No journal entries recorded yet. Begin your reflections today.
          </div>
        `;
        return;
      }

      // Sort newest first
      entries.sort((a, b) => new Date(b.date) - new Date(a.date));

      entries.forEach((entry, idx) => {
        const item = document.createElement('div');
        item.className = 'timeline-item';

        const d = new Date(entry.date + 'T00:00:00');
        const formattedDate = d.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });

        item.innerHTML = `
          <div class="timeline-item-header">
            <span>${formattedDate}</span>
            <button class="clear-item-btn" title="Delete entry" data-idx="${idx}">&times;</button>
          </div>
          <div class="timeline-item-body">${escapeHTML(entry.content)}</div>
        `;

        item.querySelector('.clear-item-btn').addEventListener('click', () => {
          entries.splice(idx, 1);
          localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(entries));
          loadJournalHistory();
        });

        DOM.journalTimelineContainer.appendChild(item);
      });
    } catch (err) {
      console.error('Error loading journal:', err);
    }
  }

  function loadJournalForActiveDate(dateStr) {
    try {
      const entries = JSON.parse(localStorage.getItem(STORAGE_KEYS.JOURNAL) || '[]');
      const entry = entries.find((e) => e.date === dateStr);
      if (entry) {
        DOM.journalTextarea.value = entry.content;
        const words = entry.content.trim() ? entry.content.trim().split(/\s+/).length : 0;
        DOM.journalWordCount.textContent = `${words} words`;
      } else {
        DOM.journalTextarea.value = '';
        DOM.journalWordCount.textContent = '0 words';
      }
    } catch (err) {
      console.error('Error loading active journal:', err);
    }
  }

  function saveJournal(dateStr, content, isSilent = false) {
    if (!content.trim()) return;

    try {
      const entries = JSON.parse(localStorage.getItem(STORAGE_KEYS.JOURNAL) || '[]');
      // Check if entry for date already exists, update or push
      const existingIndex = entries.findIndex((e) => e.date === dateStr);
      if (existingIndex >= 0) {
        entries[existingIndex].content = content.trim();
        entries[existingIndex].timestamp = Date.now();
      } else {
        entries.push({
          id: 'j-' + Date.now(),
          date: dateStr,
          content: content.trim(),
          timestamp: Date.now()
        });
      }

      localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(entries));
      DOM.journalSaveStatus.textContent = 'Journal saved at ' + new Date().toLocaleTimeString();
      loadJournalHistory();
      if (!isSilent) {
        showToast('Journal entry saved');
      }
    } catch (err) {
      console.error('Error saving journal:', err);
    }
  }

  function loadWeeklyReview(weekNum) {
    try {
      const store = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '{}');
      const review = store[weekNum] || {};

      if (review.consistent === 'yes') DOM.revConsYes.checked = true;
      else if (review.consistent === 'partial') DOM.revConsPart.checked = true;
      else if (review.consistent === 'no') DOM.revConsNo.checked = true;
      else {
        DOM.revConsYes.checked = false;
        DOM.revConsPart.checked = false;
        DOM.revConsNo.checked = false;
      }

      DOM.revWentWell.value = review.wentWell || '';
      DOM.revImprove.value = review.improve || '';
      DOM.revNextFocus.value = review.nextFocus || '';
    } catch (e) {
      console.error(e);
    }
  }

  function saveWeeklyReview(weekNum) {
    try {
      const store = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '{}');

      let consistent = '';
      if (DOM.revConsYes.checked) consistent = 'yes';
      else if (DOM.revConsPart.checked) consistent = 'partial';
      else if (DOM.revConsNo.checked) consistent = 'no';

      store[weekNum] = {
        consistent,
        wentWell: DOM.revWentWell.value.trim(),
        improve: DOM.revImprove.value.trim(),
        nextFocus: DOM.revNextFocus.value.trim(),
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(store));
      DOM.reviewSaveStatus.textContent = 'Weekly review saved at ' + new Date().toLocaleTimeString();
      showToast(`Week ${weekNum} review saved`);
    } catch (e) {
      console.error(e);
    }
  }

  // ==========================================================================
  // 9. PROGRESS ANALYTICS (HIGH-DPI HTML5 CANVAS CHART)
  // ==========================================================================

  /**
   * Renders high-resolution interactive line chart for 7d, 30d, or 90d
   */
  function renderAnalytics(rangeDays) {
    const canvas = DOM.analyticsCanvas;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const logs = getAllHabitLogs();
    const activeHabits = getActiveHabits();
    const totalHabits = activeHabits.length || 1;
    const todayStr = getTodayDateString();

    // Prepare date range backwards from today
    const dataPoints = [];
    const dateCursor = new Date(todayStr + 'T00:00:00');

    for (let i = rangeDays - 1; i >= 0; i--) {
      const d = new Date(dateCursor);
      d.setDate(d.getDate() - i);
      const dStr = formatDateString(d);

      const dayLogs = logs[dStr] || {};
      let done = 0;
      Object.keys(dayLogs).forEach((h) => {
        if (dayLogs[h]) done++;
      });
      const pct = Math.round((done / totalHabits) * 100);

      dataPoints.push({
        date: dStr,
        label: d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }),
        fullDate: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        score: pct,
        doneHabits: done
      });
    }

    // Calculate analytics metrics
    let totalScore = 0;
    let totalHabitsDone = 0;
    let activeDaysCount = 0;

    dataPoints.forEach((p) => {
      totalScore += p.score;
      totalHabitsDone += p.doneHabits;
      if (p.doneHabits > 0) activeDaysCount++;
    });

    const avgRate = Math.round(totalScore / rangeDays);
    const avgDailyScore = activeDaysCount > 0 ? Math.round(totalScore / activeDaysCount) : 0;
    const streakInfo = calculateStreak();

    // Update analytics cards
    DOM.analyticsAvgRate.textContent = `${avgRate}%`;
    DOM.analyticsHabitsCount.textContent = totalHabitsDone;
    DOM.analyticsBestStreak.textContent = `${streakInfo.bestStreak} Days`;
    DOM.analyticsActiveDays.textContent = `${activeDaysCount} / ${rangeDays}`;
    DOM.analyticsDailyScore.textContent = `${avgDailyScore}%`;

    // Canvas Rendering Setup (High DPI Retina)
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Margins
    const padLeft = 45;
    const padRight = 20;
    const padTop = 30;
    const padBottom = 40;

    const chartWidth = width - padLeft - padRight;
    const chartHeight = height - padTop - padBottom;

    ctx.clearRect(0, 0, width, height);

    const isDark = appState.theme === 'dark';
    const gridStroke = isDark ? 'rgba(180, 220, 255, 0.09)' : 'rgba(201, 214, 227, 0.55)';
    const textFill = isDark ? '#8FAEC9' : '#6B8EAD';
    const lineStroke = isDark ? '#a8d4f0' : '#1E3A5F';
    const lineGlow = isDark ? 'rgba(148, 198, 230, 0.5)' : 'rgba(30, 58, 95, 0.25)';
    const dotBorder = isDark ? '#030810' : '#FFFFFF';
    const dotHigh = isDark ? '#e8f4fd' : '#1E3A5F';
    const dotLow = isDark ? '#7ab8d9' : '#6B8EAD';

    // Draw horizontal grid lines & Y labels (0%, 25%, 50%, 75%, 100%)
    const ySteps = [0, 25, 50, 75, 100];
    ctx.strokeStyle = gridStroke;
    ctx.lineWidth = 1;
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = textFill;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    ySteps.forEach((val) => {
      const y = padTop + chartHeight - (val / 100) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(width - padRight, y);
      ctx.stroke();

      ctx.fillText(val + '%', padLeft - 10, y);
    });

    if (dataPoints.length === 0) return;

    // Calculate points coordinates
    const stepX = chartWidth / (dataPoints.length - 1 || 1);
    const coords = dataPoints.map((pt, i) => {
      const x = padLeft + i * stepX;
      const y = padTop + chartHeight - (pt.score / 100) * chartHeight;
      return { x, y, pt };
    });

    // Create Gradient Area under curve
    const areaGradient = ctx.createLinearGradient(0, padTop, 0, padTop + chartHeight);
    if (isDark) {
      areaGradient.addColorStop(0, 'rgba(148, 198, 230, 0.25)');
      areaGradient.addColorStop(0.6, 'rgba(74, 159, 196, 0.08)');
      areaGradient.addColorStop(1, 'rgba(3, 8, 16, 0)');
    } else {
      areaGradient.addColorStop(0, 'rgba(30, 58, 95, 0.18)');
      areaGradient.addColorStop(0.6, 'rgba(107, 142, 173, 0.08)');
      areaGradient.addColorStop(1, 'rgba(244, 247, 250, 0)');
    }

    // Path drawing
    ctx.beginPath();
    ctx.moveTo(coords[0].x, coords[0].y);

    for (let i = 0; i < coords.length - 1; i++) {
      const xc = (coords[i].x + coords[i + 1].x) / 2;
      const yc = (coords[i].y + coords[i + 1].y) / 2;
      ctx.quadraticCurveTo(coords[i].x, coords[i].y, xc, yc);
    }
    ctx.lineTo(coords[coords.length - 1].x, coords[coords.length - 1].y);

    // Save line path for stroke
    ctx.save();
    ctx.lineTo(coords[coords.length - 1].x, padTop + chartHeight);
    ctx.lineTo(coords[0].x, padTop + chartHeight);
    ctx.closePath();
    ctx.fillStyle = areaGradient;
    ctx.fill();
    ctx.restore();

    // Draw Main Glowing Line
    ctx.beginPath();
    ctx.moveTo(coords[0].x, coords[0].y);
    for (let i = 0; i < coords.length - 1; i++) {
      const xc = (coords[i].x + coords[i + 1].x) / 2;
      const yc = (coords[i].y + coords[i + 1].y) / 2;
      ctx.quadraticCurveTo(coords[i].x, coords[i].y, xc, yc);
    }
    ctx.lineTo(coords[coords.length - 1].x, coords[coords.length - 1].y);
    ctx.strokeStyle = lineStroke;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = lineGlow;
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0; // reset shadow

    // Draw Points & X-axis Labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = textFill;

    const labelInterval = rangeDays >= 90 ? 10 : rangeDays === 30 ? 4 : 1;

    coords.forEach((c, idx) => {
      // Draw point dot
      ctx.beginPath();
      ctx.arc(c.x, c.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = c.pt.score >= 80 ? dotHigh : dotLow;
      ctx.fill();
      ctx.strokeStyle = dotBorder;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw X label
      if (idx % labelInterval === 0 || idx === coords.length - 1) {
        ctx.fillStyle = textFill;
        ctx.fillText(c.pt.label, c.x, padTop + chartHeight + 10);
      }
    });

    // Tooltip Interaction (Desktop mouse & Mobile touch)
    canvas.onmousemove = function (e) {
      const mouseRect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - mouseRect.left;
      const mouseY = e.clientY - mouseRect.top;

      // Find nearest point
      let nearest = null;
      let minDistance = 25;

      coords.forEach((c) => {
        const dist = Math.hypot(c.x - mouseX, c.y - mouseY);
        if (dist < minDistance) {
          minDistance = dist;
          nearest = c;
        }
      });

      if (nearest) {
        DOM.chartTooltip.style.display = 'block';
        DOM.chartTooltip.style.left = `${nearest.x}px`;
        DOM.chartTooltip.style.top = `${nearest.y}px`;
        DOM.chartTooltip.innerHTML = `
          <strong>${nearest.pt.fullDate}</strong><br>
          Score: <span style="color: var(--gold-light); font-weight:700;">${nearest.pt.score}%</span> (${nearest.pt.doneHabits}/${totalHabits})
        `;
      } else {
        DOM.chartTooltip.style.display = 'none';
      }
    };

    function handleChartTouch(e) {
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      const mouseRect = canvas.getBoundingClientRect();
      const mouseX = touch.clientX - mouseRect.left;
      const mouseY = touch.clientY - mouseRect.top;

      let nearest = null;
      let minDistance = 35;

      coords.forEach((c) => {
        const dist = Math.hypot(c.x - mouseX, c.y - mouseY);
        if (dist < minDistance) {
          minDistance = dist;
          nearest = c;
        }
      });

      if (nearest) {
        DOM.chartTooltip.style.display = 'block';
        DOM.chartTooltip.style.left = `${nearest.x}px`;
        DOM.chartTooltip.style.top = `${nearest.y}px`;
        DOM.chartTooltip.innerHTML = `
          <strong>${nearest.pt.fullDate}</strong><br>
          Score: <span style="color: var(--gold-light); font-weight:700;">${nearest.pt.score}%</span> (${nearest.pt.doneHabits}/${totalHabits})
        `;
      }
    }

    canvas.ontouchstart = handleChartTouch;
    canvas.ontouchmove = handleChartTouch;
    canvas.ontouchend = function () {
      setTimeout(() => {
        if (DOM.chartTooltip) DOM.chartTooltip.style.display = 'none';
      }, 2500);
    };

    canvas.onmouseleave = function () {
      DOM.chartTooltip.style.display = 'none';
    };
  }

  // ==========================================================================
  // 10. BACKUP, EXPORT & IMPORT (DATA SOVEREIGNTY)
  // ==========================================================================

  /**
   * Exports all winterArc localStorage items to a JSON file
   */
  function exportData() {
    const backupData = {
      appName: 'WINTER_ARC',
      version: '1.0',
      exportTimestamp: new Date().toISOString(),
      profile: JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILE) || 'null'),
      habits: JSON.parse(localStorage.getItem(STORAGE_KEYS.HABITS) || '{}'),
      goals: JSON.parse(localStorage.getItem(STORAGE_KEYS.GOALS) || '[]'),
      weeklyGoals: JSON.parse(localStorage.getItem(STORAGE_KEYS.WEEKLY_GOALS) || '{}'),
      priorities: JSON.parse(localStorage.getItem(STORAGE_KEYS.PRIORITIES) || '{}'),
      gratitude: JSON.parse(localStorage.getItem(STORAGE_KEYS.GRATITUDE) || '{}'),
      notes: JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTES) || '{}'),
      journal: JSON.parse(localStorage.getItem(STORAGE_KEYS.JOURNAL) || '[]'),
      reviews: JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '{}'),
      settings: JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}'),
      customHabits: JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_HABITS) || '[]'),
      hiddenHabits: JSON.parse(localStorage.getItem(STORAGE_KEYS.HIDDEN_HABITS) || '[]')
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    const safeDate = new Date().toISOString().split('T')[0];
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `winter-arc-backup-${safeDate}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('Winter Arc backup downloaded');
  }

  /**
   * Imports a JSON backup file and restores application state
   */
  function importData(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const imported = JSON.parse(e.target.result);

        if (!imported || (imported.appName !== 'WINTER_ARC' && imported.appName !== 'SAI_WINTER_ARC' && !imported.profile && !imported.habits)) {
          alert('Invalid backup file. Please select a valid Winter Arc JSON backup.');
          return;
        }

        if (imported.profile) localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(imported.profile));
        if (imported.habits) localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(imported.habits));
        if (imported.goals) localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(imported.goals));
        if (imported.weeklyGoals) localStorage.setItem(STORAGE_KEYS.WEEKLY_GOALS, JSON.stringify(imported.weeklyGoals));
        if (imported.priorities) localStorage.setItem(STORAGE_KEYS.PRIORITIES, JSON.stringify(imported.priorities));
        if (imported.gratitude) localStorage.setItem(STORAGE_KEYS.GRATITUDE, JSON.stringify(imported.gratitude));
        if (imported.notes) localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(imported.notes));
        if (imported.journal) localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(imported.journal));
        if (imported.reviews) localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(imported.reviews));
        if (imported.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(imported.settings));
        if (imported.customHabits) localStorage.setItem(STORAGE_KEYS.CUSTOM_HABITS, JSON.stringify(imported.customHabits));
        if (imported.hiddenHabits) localStorage.setItem(STORAGE_KEYS.HIDDEN_HABITS, JSON.stringify(imported.hiddenHabits));

        loadUser();
        applyUserProfileToUI();
        showToast('Data imported successfully');
        alert('Winter Arc backup successfully restored!');
      } catch (err) {
        console.error('Import error:', err);
        alert('Failed to parse the backup file. Ensure it is valid JSON.');
      }
    };
    reader.readAsText(file);
  }

  /**
   * Permanently wipes all application data from localStorage
   */
  function resetData() {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });

    appState.user = null;
    showToast('All local data wiped');
    closeModal(DOM.resetConfirmModal);

    // Reload page to re-init landing state
    setTimeout(() => {
      window.location.reload();
    }, 400);
  }

  // ==========================================================================
  // 11. ATMOSPHERIC CANVAS SNOW ENGINE & SYNTHESIZED SOUND
  // ==========================================================================

  function loadSettings() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}');
      appState.soundEnabled = stored.soundEnabled !== undefined ? !!stored.soundEnabled : true;
      appState.snowEnabled = stored.snowEnabled !== undefined ? stored.snowEnabled : true;
    } catch (e) {
      appState.soundEnabled = true;
      appState.snowEnabled = true;
    }

    if (DOM.btnSnowToggle) {
      DOM.btnSnowToggle.classList.toggle('active', appState.snowEnabled);
    }
    updateSoundToggleUI(appState.soundEnabled);

    // Load persisted theme (defaults to 'light', toggleable to 'dark')
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    applyTheme(savedTheme, false);
  }

  /**
   * Applies the theme ('light' = Soft Winter White, 'dark' = Midnight Arctic)
   */
  function applyTheme(theme, showToastMsg = false) {
    appState.theme = theme;
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (e) {}

    const isDark = theme === 'dark';
    if (isDark) {
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
      if (DOM.themeIconSun) DOM.themeIconSun.style.display = 'block';
      if (DOM.themeIconMoon) DOM.themeIconMoon.style.display = 'none';
      if (DOM.btnThemeToggle) {
        DOM.btnThemeToggle.title = 'Switch to Soft Winter White';
        DOM.btnThemeToggle.classList.add('active');
      }
      const landingPill = document.getElementById('btnLandingThemeToggle');
      if (landingPill) {
        landingPill.innerHTML = '<span class="theme-pill-icon">☀️</span><span class="theme-pill-text">Light Mode</span>';
      }
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', '#030810');
      if (showToastMsg) showToast('🌙 Midnight Arctic theme enabled');
    } else {
      document.body.classList.remove('theme-dark');
      document.body.classList.add('theme-light');
      if (DOM.themeIconSun) DOM.themeIconSun.style.display = 'none';
      if (DOM.themeIconMoon) DOM.themeIconMoon.style.display = 'block';
      if (DOM.btnThemeToggle) {
        DOM.btnThemeToggle.title = 'Switch to Midnight Dark';
        DOM.btnThemeToggle.classList.remove('active');
      }
      const landingPill = document.getElementById('btnLandingThemeToggle');
      if (landingPill) {
        landingPill.innerHTML = '<span class="theme-pill-icon">🌙</span><span class="theme-pill-text">Dark Mode</span>';
      }
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', '#F4F7FA');
      if (showToastMsg) showToast('☀️ Soft Winter White theme enabled');
    }

    // Synchronize Settings theme selector buttons if present
    const btnChoiceLight = document.getElementById('btnThemeChoiceLight');
    const btnChoiceDark = document.getElementById('btnThemeChoiceDark');
    if (btnChoiceLight) btnChoiceLight.classList.toggle('active', !isDark);
    if (btnChoiceDark) btnChoiceDark.classList.toggle('active', isDark);

    // Refresh analytics chart colors if chart exists
    if (typeof renderAnalytics === 'function') {
      try { renderAnalytics(appState.analyticsRange); } catch (e) {}
    }
  }

  /**
   * Toggles between previous Dark Arctic and Soft Winter White themes
   */
  function toggleTheme() {
    const next = appState.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
  }

  function saveSettings() {
    try {
      localStorage.setItem(
        STORAGE_KEYS.SETTINGS,
        JSON.stringify({
          soundEnabled: appState.soundEnabled,
          snowEnabled: appState.snowEnabled
        })
      );
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Elegant particle snow system running on canvas
   */
  let snowAnimationId = null;
  function initSnowParticles() {
    const canvas = DOM.snowCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // Particle count: 28 lightweight particles on mobile, 65 on desktop for optimal battery & 60fps
    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 28 : 65;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.6,
        density: Math.random() * particleCount,
        opacity: Math.random() * 0.55 + 0.2,
        drift: Math.random() * 0.6 - 0.3
      });
    }

    let angle = 0;
    function renderSnow() {
      if (!appState.snowEnabled) {
        ctx.clearRect(0, 0, width, height);
        snowAnimationId = requestAnimationFrame(renderSnow);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      angle += 0.008;

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        p.y += Math.cos(angle + p.density) + 0.65 + p.radius / 2;
        p.x += Math.sin(angle) * 0.8 + p.drift;

        // Wrap around
        if (p.x > width + 10 || p.x < -10 || p.y > height) {
          if (i % 3 > 0) {
            particles[i].x = Math.random() * width;
            particles[i].y = -10;
          } else {
            if (Math.sin(angle) > 0) {
              particles[i].x = -10;
              particles[i].y = Math.random() * height;
            } else {
              particles[i].x = width + 10;
              particles[i].y = Math.random() * height;
            }
          }
        }

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.95, p.opacity + 0.25)})`;
        ctx.shadowColor = 'rgba(107, 142, 173, 0.22)';
        ctx.shadowBlur = 3;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      snowAnimationId = requestAnimationFrame(renderSnow);
    }

    renderSnow();
  }

  /**
   * Pure Web Audio API synthesized ambient winter wind & haptic tone
  /**
   * ==========================================================================
   * 11. CINEMATIC WINTER ARC SOUNDTRACK & AMBIENT MUSIC ENGINE
   * Multi-layered procedural generative music:
   * 1. Lush Cinematic Warm Analog Pads (C minor 9 - Ab Maj7 - Eb add9 - Bb add9)
   * 2. Meditative Frost Bell & Felt Piano Crystal Melody with Stereo Delay/Reverb
   * 3. Deep resonant sub-bass drone
   * 4. Whispering alpine winter wind texture
   * 100% Offline & Pure Web Audio API Synthesizer
   * ==========================================================================
   */

  let winterMusicEngine = {
    isPlaying: false,
    masterGain: null,
    delayNode: null,
    delayFilter: null,
    delayFeedback: null,
    padVoices: [],
    windSource: null,
    windGain: null,
    chordTimer: null,
    melodyTimer: null,
    chordIndex: 0,
    melodyStep: 0
  };

  // 4-Chord Cinematic Winter Arc Progression (Frequencies in Hz)
  const WINTER_CHORDS = [
    // 0: C Minor 9 (Resolve & Unshakable Foundation)
    { root: 65.41, freqs: [130.81, 196.00, 233.08, 311.13, 392.00] },
    // 1: Ab Major 7 (Stoic Endurance in the Cold)
    { root: 51.91, freqs: [103.83, 207.65, 261.63, 311.13, 392.00] },
    // 2: Eb Major add9 (Crisp Frozen Dawn)
    { root: 77.78, freqs: [155.56, 196.00, 233.08, 311.13, 349.23] },
    // 3: Bb add9 (Triumph, Mastery & Discipline)
    { root: 58.27, freqs: [116.54, 174.61, 233.08, 293.66, 349.23] }
  ];

  // Meditative melody motifs for the crystal bell / felt piano
  const WINTER_MELODY_PHRASES = [
    [523.25, 622.25, 587.33, 466.16],
    [392.00, 523.25, 587.33, 783.99, 622.25],
    [622.25, 587.33, 523.25, 466.16, 392.00],
    [783.99, 932.33, 1046.50, 783.99, 587.33],
    [523.25, 622.25, 783.99, 932.33, 783.99, 622.25]
  ];

  function updateSoundToggleUI(isActive) {
    if (!DOM.btnSoundToggle) return;
    const iconOff = DOM.btnSoundToggle.querySelector('.sound-off');
    const iconOn = DOM.btnSoundToggle.querySelector('.sound-on');
    if (iconOff) iconOff.style.display = isActive ? 'none' : 'block';
    if (iconOn) iconOn.style.display = isActive ? 'block' : 'none';
    DOM.btnSoundToggle.classList.toggle('active', isActive);
  }

  function ensureAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function tryAutoPlaySoundtrack() {
    if (!appState.soundEnabled) return;
    try {
      const ctx = ensureAudioContext();
      if (ctx) {
        if (ctx.state === 'running') {
          startWinterSoundtrack();
          updateSoundToggleUI(true);
        } else {
          // If browser Autoplay policy temporarily paused AudioContext, unlock on first user gesture
          enableAutoplayOnFirstInteraction();
        }
      }
    } catch (e) {
      enableAutoplayOnFirstInteraction();
    }
  }

  let autoplayUnlocked = false;
  function enableAutoplayOnFirstInteraction() {
    if (autoplayUnlocked) return;
    const unlockAutoplay = () => {
      autoplayUnlocked = true;
      if (!appState.soundEnabled) return;
      try {
        const ctx = ensureAudioContext();
        if (ctx) {
          ctx.resume().then(() => {
            if (appState.soundEnabled && !winterMusicEngine.isPlaying) {
              startWinterSoundtrack();
              updateSoundToggleUI(true);
            }
          }).catch(() => {});
        }
      } catch (err) {}

      ['click', 'touchstart', 'pointerdown', 'keydown'].forEach((evt) => {
        window.removeEventListener(evt, unlockAutoplay, true);
        document.removeEventListener(evt, unlockAutoplay, true);
      });
    };

    ['click', 'touchstart', 'pointerdown', 'keydown'].forEach((evt) => {
      window.addEventListener(evt, unlockAutoplay, { once: true, capture: true });
      document.addEventListener(evt, unlockAutoplay, { once: true, capture: true });
    });
  }

  function toggleAtmosphereSound() {
    const ctx = ensureAudioContext();
    if (!ctx) {
      showToast('Web Audio not supported');
      return;
    }

    appState.soundEnabled = !appState.soundEnabled;
    saveSettings();

    if (appState.soundEnabled) {
      updateSoundToggleUI(true);
      startWinterSoundtrack();
      showToast('🎵 Winter Arc Soundtrack Active ❄️');
    } else {
      updateSoundToggleUI(false);
      stopWinterSoundtrack();
      showToast('Soundtrack muted');
    }
  }

  function startWinterSoundtrack() {
    if (!audioCtx || winterMusicEngine.isPlaying) return;

    try {
      winterMusicEngine.isPlaying = true;

      // 1. Master Output Gain with Limiter / Dynamics Compressor
      const compressor = audioCtx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-14, audioCtx.currentTime);
      compressor.knee.setValueAtTime(10, audioCtx.currentTime);
      compressor.ratio.setValueAtTime(3.5, audioCtx.currentTime);
      compressor.attack.setValueAtTime(0.003, audioCtx.currentTime);
      compressor.release.setValueAtTime(0.25, audioCtx.currentTime);
      compressor.connect(audioCtx.destination);

      const master = audioCtx.createGain();
      master.gain.setValueAtTime(0.001, audioCtx.currentTime);
      master.gain.exponentialRampToValueAtTime(0.75, audioCtx.currentTime + 1.8);
      master.connect(compressor);
      winterMusicEngine.masterGain = master;

      // 2. Stereo Delay / Reverb Bus
      const delay = audioCtx.createDelay(1.2);
      delay.delayTime.setValueAtTime(0.38, audioCtx.currentTime);

      const delayFilter = audioCtx.createBiquadFilter();
      delayFilter.type = 'lowpass';
      delayFilter.frequency.setValueAtTime(1600, audioCtx.currentTime);

      const delayFeedback = audioCtx.createGain();
      delayFeedback.gain.setValueAtTime(0.38, audioCtx.currentTime);

      delay.connect(delayFilter);
      delayFilter.connect(delayFeedback);
      delayFeedback.connect(delay);
      delayFilter.connect(master);

      winterMusicEngine.delayNode = delay;
      winterMusicEngine.delayFilter = delayFilter;
      winterMusicEngine.delayFeedback = delayFeedback;

      // 3. Subtle Winter Wind Texture
      try {
        const bufferSize = audioCtx.sampleRate * 2;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const windSource = audioCtx.createBufferSource();
        windSource.buffer = noiseBuffer;
        windSource.loop = true;

        const windFilter = audioCtx.createBiquadFilter();
        windFilter.type = 'bandpass';
        windFilter.frequency.setValueAtTime(320, audioCtx.currentTime);
        windFilter.Q.setValueAtTime(2.5, audioCtx.currentTime);

        const windGain = audioCtx.createGain();
        windGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
        windGain.gain.exponentialRampToValueAtTime(0.032, audioCtx.currentTime + 2.5);

        windSource.connect(windFilter);
        windFilter.connect(windGain);
        windGain.connect(master);
        windSource.start();

        winterMusicEngine.windSource = windSource;
        winterMusicEngine.windGain = windGain;
      } catch (err) {}

      // 4. Start Cinematic Chord Progression Loop
      winterMusicEngine.chordIndex = 0;
      playAtmosphericChord();
      winterMusicEngine.chordTimer = setInterval(() => {
        if (!winterMusicEngine.isPlaying) return;
        winterMusicEngine.chordIndex = (winterMusicEngine.chordIndex + 1) % WINTER_CHORDS.length;
        playAtmosphericChord();
      }, 7500);

      // 5. Start Melodic Frost Bell / Piano Chime Loop
      winterMusicEngine.melodyStep = 0;
      scheduleNextMelodyNote();

    } catch (e) {
      console.warn('Winter soundtrack error:', e);
    }
  }

  /**
   * Generates a warm, lush, cinematic pad chord with sub-bass
   */
  function playAtmosphericChord() {
    if (!audioCtx || !winterMusicEngine.isPlaying || !winterMusicEngine.masterGain) return;

    const chord = WINTER_CHORDS[winterMusicEngine.chordIndex];
    const now = audioCtx.currentTime;
    const fadeTime = 2.4;
    const newVoices = [];

    // Fade out and cleanup old pad voices
    if (winterMusicEngine.padVoices.length > 0) {
      winterMusicEngine.padVoices.forEach((voice) => {
        try {
          voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
          voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + fadeTime);
          setTimeout(() => {
            try { voice.osc.stop(); } catch (e) {}
          }, fadeTime * 1000 + 100);
        } catch (e) {}
      });
      winterMusicEngine.padVoices = [];
    }

    // Play Sub-Bass Root Drone
    try {
      const bassOsc = audioCtx.createOscillator();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(chord.root, now);

      const bassFilter = audioCtx.createBiquadFilter();
      bassFilter.type = 'lowpass';
      bassFilter.frequency.setValueAtTime(180, now);

      const bassGain = audioCtx.createGain();
      bassGain.gain.setValueAtTime(0.0001, now);
      bassGain.gain.exponentialRampToValueAtTime(0.18, now + 1.8);

      bassOsc.connect(bassFilter);
      bassFilter.connect(bassGain);
      bassGain.connect(winterMusicEngine.masterGain);
      bassOsc.start(now);

      newVoices.push({ osc: bassOsc, gain: bassGain });
    } catch (e) {}

    // Play Warm Ambient Polyphonic Harmonies
    chord.freqs.forEach((freq, idx) => {
      try {
        const osc = audioCtx.createOscillator();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        // Slight organic detune for warm analog chorus feel
        osc.detune.setValueAtTime((idx % 3 - 1) * 4, now);

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(720, now);
        filter.Q.setValueAtTime(1.2, now);

        const voiceGain = audioCtx.createGain();
        voiceGain.gain.setValueAtTime(0.0001, now);
        voiceGain.gain.exponentialRampToValueAtTime(0.075, now + 2.0);

        osc.connect(filter);
        filter.connect(voiceGain);
        voiceGain.connect(winterMusicEngine.masterGain);
        osc.start(now);

        newVoices.push({ osc, gain: voiceGain });
      } catch (e) {}
    });

    winterMusicEngine.padVoices = newVoices;
  }

  /**
   * Plays crystalline frost bell & felt piano notes
   */
  function scheduleNextMelodyNote() {
    if (!audioCtx || !winterMusicEngine.isPlaying) return;

    const phraseIdx = winterMusicEngine.chordIndex % WINTER_MELODY_PHRASES.length;
    const phrase = WINTER_MELODY_PHRASES[phraseIdx];
    const freq = phrase[winterMusicEngine.melodyStep % phrase.length];
    winterMusicEngine.melodyStep++;

    playFrostBell(freq);

    // Schedule next note with humanized cadence
    const delayMs = 1300 + Math.random() * 900;
    winterMusicEngine.melodyTimer = setTimeout(scheduleNextMelodyNote, delayMs);
  }

  function playFrostBell(freq) {
    if (!audioCtx || !winterMusicEngine.isPlaying || !winterMusicEngine.masterGain) return;

    try {
      const now = audioCtx.currentTime;

      // Primary sine bell oscillator
      const bellOsc = audioCtx.createOscillator();
      bellOsc.type = 'sine';
      bellOsc.frequency.setValueAtTime(freq, now);

      // Shimmer 2nd harmonic oscillator
      const shimmerOsc = audioCtx.createOscillator();
      shimmerOsc.type = 'triangle';
      shimmerOsc.frequency.setValueAtTime(freq * 2, now);

      // Crisp acoustic envelope
      const bellGain = audioCtx.createGain();
      bellGain.gain.setValueAtTime(0.0001, now);
      bellGain.gain.linearRampToValueAtTime(0.14, now + 0.015);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

      const shimmerGain = audioCtx.createGain();
      shimmerGain.gain.setValueAtTime(0.0001, now);
      shimmerGain.gain.linearRampToValueAtTime(0.042, now + 0.015);
      shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      // Stereo positioning if available
      let panner = null;
      if (audioCtx.createStereoPanner) {
        panner = audioCtx.createStereoPanner();
        panner.pan.setValueAtTime((Math.random() - 0.5) * 0.7, now);
      }

      bellOsc.connect(bellGain);
      shimmerOsc.connect(shimmerGain);

      const dest = panner || winterMusicEngine.masterGain;
      if (panner) panner.connect(winterMusicEngine.masterGain);

      bellGain.connect(dest);
      shimmerGain.connect(dest);

      // Feed into ethereal delay & reverb
      if (winterMusicEngine.delayNode) {
        bellGain.connect(winterMusicEngine.delayNode);
      }

      bellOsc.start(now);
      shimmerOsc.start(now);

      bellOsc.stop(now + 2.5);
      shimmerOsc.stop(now + 2.5);
    } catch (e) {}
  }

  function stopWinterSoundtrack() {
    winterMusicEngine.isPlaying = false;

    // Clear timers
    if (winterMusicEngine.chordTimer) {
      clearInterval(winterMusicEngine.chordTimer);
      winterMusicEngine.chordTimer = null;
    }
    if (winterMusicEngine.melodyTimer) {
      clearTimeout(winterMusicEngine.melodyTimer);
      winterMusicEngine.melodyTimer = null;
    }

    // Smooth fade out
    if (audioCtx && winterMusicEngine.masterGain) {
      try {
        const now = audioCtx.currentTime;
        winterMusicEngine.masterGain.gain.setValueAtTime(winterMusicEngine.masterGain.gain.value, now);
        winterMusicEngine.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);
        setTimeout(() => {
          // Stop pad voices
          winterMusicEngine.padVoices.forEach((v) => {
            try { v.osc.stop(); } catch (e) {}
          });
          winterMusicEngine.padVoices = [];

          // Stop wind
          if (winterMusicEngine.windSource) {
            try { winterMusicEngine.windSource.stop(); } catch (e) {}
            winterMusicEngine.windSource = null;
          }
        }, 1100);
      } catch (e) {}
    }
  }

  // Backward compatibility alias
  function startWindAtmosphere() {
    startWinterSoundtrack();
  }
  function stopWindAtmosphere() {
    stopWinterSoundtrack();
  }

  function playHapticTone(freq, duration) {
    if (!audioCtx || !appState.soundEnabled) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  // ==========================================================================
  // 12. EVENT LISTENERS & UI ROUTING
  // ==========================================================================

  function bindGlobalEvents() {
    // Landing Screen Actions
    DOM.btnLandingStart.addEventListener('click', () => {
      tryAutoPlaySoundtrack();
      if (appState.user && appState.user.name) {
        showDashboard();
      } else {
        openModal(DOM.profileSetupModal);
      }
    });

    DOM.btnLandingExisting.addEventListener('click', () => {
      tryAutoPlaySoundtrack();
      showDashboard();
    });

    // Onboarding Form Submit
    DOM.onboardingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const profile = {
        name: DOM.setupName.value,
        startDate: DOM.setupStartDate.value,
        goal: DOM.setupGoal.value
      };
      saveUser(profile);
      closeModal(DOM.profileSetupModal);
      showDashboard();
    });

    // Settings Profile Form Submit
    DOM.settingsProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const profile = {
        name: DOM.settingName.value,
        startDate: DOM.settingStartDate.value,
        goal: DOM.settingGoal.value
      };
      saveUser(profile);
    });

    // Profile Quick Pill
    DOM.navUserProfileBtn.addEventListener('click', (e) => {
      e.preventDefault();
      switchPage('settingsSection');
    });

    // Theme Switcher Buttons (Top Nav and Landing Screen)
    if (DOM.btnThemeToggle) {
      DOM.btnThemeToggle.addEventListener('click', toggleTheme);
    }
    const btnLandingTheme = document.getElementById('btnLandingThemeToggle');
    if (btnLandingTheme) {
      btnLandingTheme.addEventListener('click', toggleTheme);
    }
    const btnChoiceLight = document.getElementById('btnThemeChoiceLight');
    if (btnChoiceLight) {
      btnChoiceLight.addEventListener('click', () => applyTheme('light', true));
    }
    const btnChoiceDark = document.getElementById('btnThemeChoiceDark');
    if (btnChoiceDark) {
      btnChoiceDark.addEventListener('click', () => applyTheme('dark', true));
    }

    // Atmosphere Sound Button
    DOM.btnSoundToggle.addEventListener('click', toggleAtmosphereSound);

    // Snow Toggle Button
    DOM.btnSnowToggle.addEventListener('click', () => {
      appState.snowEnabled = !appState.snowEnabled;
      DOM.btnSnowToggle.classList.toggle('active', appState.snowEnabled);
      saveSettings();
      showToast(appState.snowEnabled ? 'Snow particles active' : 'Snow paused');
    });

    // Date Navigation Buttons
    DOM.btnPrevDay.addEventListener('click', () => {
      navigateDate(-1);
    });

    DOM.btnNextDay.addEventListener('click', () => {
      navigateDate(1);
    });

    DOM.btnTodayReset.addEventListener('click', () => {
      appState.activeDate = getTodayDateString();
      loadActiveDateData();
    });

    // Priorities Auto-save
    [DOM.priText0, DOM.priText1, DOM.priText2].forEach((inp) => {
      inp.addEventListener('input', debounce(() => savePriorities(appState.activeDate), 500));
    });
    [DOM.priChk0, DOM.priChk1, DOM.priChk2].forEach((chk) => {
      chk.addEventListener('change', () => savePriorities(appState.activeDate));
    });
    document.querySelectorAll('.clear-item-btn[data-clear]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const idx = e.currentTarget.getAttribute('data-clear');
        if (idx === '0') { DOM.priText0.value = ''; DOM.priChk0.checked = false; }
        if (idx === '1') { DOM.priText1.value = ''; DOM.priChk1.checked = false; }
        if (idx === '2') { DOM.priText2.value = ''; DOM.priChk2.checked = false; }
        savePriorities(appState.activeDate);
      });
    });

    // Enter key progression for priorities
    DOM.priText0.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); DOM.priText1.focus(); }
    });
    DOM.priText1.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); DOM.priText2.focus(); }
    });
    DOM.priText2.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); DOM.priText2.blur(); savePriorities(appState.activeDate); }
    });

    // Gratitude Auto-save & Enter progression
    [DOM.gratitudeInput0, DOM.gratitudeInput1, DOM.gratitudeInput2].forEach((inp) => {
      inp.addEventListener('input', debounce(() => saveGratitude(appState.activeDate), 500));
    });
    DOM.gratitudeInput0.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); DOM.gratitudeInput1.focus(); }
    });
    DOM.gratitudeInput1.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); DOM.gratitudeInput2.focus(); }
    });
    DOM.gratitudeInput2.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); DOM.gratitudeInput2.blur(); saveGratitude(appState.activeDate); }
    });

    // Scratchpad Notes Auto-save
    DOM.dailyQuickNotes.addEventListener('input', debounce(() => saveNotes(appState.activeDate), 500));

    // Phase Tabs for Calendar
    DOM.phaseTabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        DOM.phaseTabButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        appState.activePhase = parseInt(btn.getAttribute('data-phase'), 10);
        renderCalendar();
      });
    });

    // Analytics Range Tabs
    DOM.analyticsTabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        DOM.analyticsTabButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        appState.analyticsRange = parseInt(btn.getAttribute('data-range'), 10);
        renderAnalytics(appState.analyticsRange);
      });
    });

    // Goals Modals
    DOM.btnOpenAddGoalModal.addEventListener('click', () => {
      DOM.newGoalTitle.value = '';
      openModal(DOM.addGoalModal);
    });

    DOM.btnCloseGoalModal.addEventListener('click', () => {
      closeModal(DOM.addGoalModal);
    });

    DOM.addGoalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (DOM.newGoalTitle.value.trim()) {
        const targetMonth = DOM.newGoalMonth ? DOM.newGoalMonth.value : (appState.activeGoalMonth || '1');
        saveGoal(DOM.newGoalTitle.value, DOM.newGoalCategory.value, targetMonth);
        closeModal(DOM.addGoalModal);
      }
    });

    // Discipline / Habits Customization Modal
    if (DOM.btnOpenAddHabitModal) {
      DOM.btnOpenAddHabitModal.addEventListener('click', () => {
        if (DOM.newHabitName) DOM.newHabitName.value = '';
        if (DOM.newHabitDesc) DOM.newHabitDesc.value = '';
        if (DOM.newHabitIcon) DOM.newHabitIcon.value = '⚡';
        openModal(DOM.addHabitModal);
      });
    }

    if (DOM.btnCloseHabitModal) {
      DOM.btnCloseHabitModal.addEventListener('click', () => closeModal(DOM.addHabitModal));
    }
    if (DOM.btnCancelHabitModal) {
      DOM.btnCancelHabitModal.addEventListener('click', () => closeModal(DOM.addHabitModal));
    }

    // Emoji preset chips in Add Habit modal
    if (DOM.emojiPresetChips) {
      DOM.emojiPresetChips.querySelectorAll('.emoji-chip').forEach((chip) => {
        chip.addEventListener('click', () => {
          const emoji = chip.getAttribute('data-emoji') || chip.textContent.trim();
          if (DOM.newHabitIcon) DOM.newHabitIcon.value = emoji;
        });
      });
    }

    // Add Habit Form Submit
    if (DOM.addHabitForm) {
      DOM.addHabitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = DOM.newHabitName ? DOM.newHabitName.value.trim() : '';
        const icon = DOM.newHabitIcon ? DOM.newHabitIcon.value.trim() : '⚡';
        const desc = DOM.newHabitDesc ? DOM.newHabitDesc.value.trim() : '';

        if (!name) return;

        addCustomHabit(name, icon, desc);
        closeModal(DOM.addHabitModal);
      });
    }

    // Reset Habits to Defaults Button
    if (DOM.btnResetHabits) {
      DOM.btnResetHabits.addEventListener('click', () => {
        if (confirm('Restore the original 12 poster disciplines and unhide any removed defaults?')) {
          restoreDefaultHabits();
        }
      });
    }

    // Toggle/Remove All 12 Default Habits Button
    if (DOM.btnToggleDefaultHabits) {
      DOM.btnToggleDefaultHabits.addEventListener('click', toggleDefaultHabits);
    }

    // Remove Habit Modal Trigger & Controls
    if (DOM.btnOpenRemoveHabitModal) {
      DOM.btnOpenRemoveHabitModal.addEventListener('click', () => {
        renderRemoveHabitsModal();
        openModal(DOM.removeHabitModal);
      });
    }

    if (DOM.btnCloseRemoveHabitModal) {
      DOM.btnCloseRemoveHabitModal.addEventListener('click', () => closeModal(DOM.removeHabitModal));
    }
    if (DOM.btnDoneRemoveHabitModal) {
      DOM.btnDoneRemoveHabitModal.addEventListener('click', () => closeModal(DOM.removeHabitModal));
    }

    // View Switcher (Today Focus vs Weekly Matrix)
    if (DOM.btnViewToday && DOM.btnViewWeekly) {
      DOM.btnViewToday.addEventListener('click', () => {
        DOM.btnViewToday.classList.add('active');
        DOM.btnViewWeekly.classList.remove('active');
        DOM.habitsListContainer.style.display = 'flex';
        DOM.weeklyMatrixWrap.style.display = 'none';
        DOM.matrixViewHint.style.display = 'none';
        DOM.habitsColumnTitle.textContent = `${getActiveHabits().length} DAILY NON-NEGOTIABLES`;
      });

      DOM.btnViewWeekly.addEventListener('click', () => {
        DOM.btnViewWeekly.classList.add('active');
        DOM.btnViewToday.classList.remove('active');
        DOM.habitsListContainer.style.display = 'none';
        DOM.weeklyMatrixWrap.style.display = 'block';
        DOM.matrixViewHint.style.display = 'inline';
        DOM.habitsColumnTitle.textContent = 'WEEKLY DISCIPLINE MATRIX';
        renderWeeklyMatrix();
      });
    }

    // Monthly Goals Dropdown & Inline Add (just like Weekly Goals)
    if (DOM.monthlySelectDropdown) {
      DOM.monthlySelectDropdown.addEventListener('change', () => {
        appState.activeGoalMonth = DOM.monthlySelectDropdown.value;
        loadGoals(appState.activeGoalMonth);
      });
    }

    if (DOM.btnAddMonthlyGoal && DOM.newMonthlyGoalInput) {
      DOM.btnAddMonthlyGoal.addEventListener('click', () => {
        const val = DOM.newMonthlyGoalInput.value.trim();
        if (!val) return;
        const targetMonth = appState.activeGoalMonth === 'all' ? '1' : (appState.activeGoalMonth || '1');
        saveGoal(val, 'Discipline', targetMonth);
        DOM.newMonthlyGoalInput.value = '';
      });

      DOM.newMonthlyGoalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          DOM.btnAddMonthlyGoal.click();
        }
      });
    }

    // Weekly Dropdown & Add
    DOM.weeklySelectDropdown.addEventListener('change', () => {
      loadWeeklyGoals(DOM.weeklySelectDropdown.value);
    });

    DOM.btnAddWeeklyGoal.addEventListener('click', () => {
      const val = DOM.newWeeklyGoalInput.value.trim();
      if (!val) return;
      const weekNum = DOM.weeklySelectDropdown.value;
      const store = JSON.parse(localStorage.getItem(STORAGE_KEYS.WEEKLY_GOALS) || '{}');
      if (!store[weekNum]) store[weekNum] = [];
      store[weekNum].push({
        id: 'w-custom-' + Date.now(),
        text: val,
        completed: false
      });
      DOM.newWeeklyGoalInput.value = '';
      saveAllWeeklyGoals(store);
    });

    DOM.newWeeklyGoalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        DOM.btnAddWeeklyGoal.click();
      }
    });

    // Journal
    DOM.journalTextarea.addEventListener('input', () => {
      const text = DOM.journalTextarea.value.trim();
      const words = text ? text.split(/\s+/).length : 0;
      DOM.journalWordCount.textContent = `${words} words`;
    });

    // Auto-save journal on debounce
    DOM.journalTextarea.addEventListener('input', debounce(() => {
      saveJournal(appState.activeDate, DOM.journalTextarea.value, true);
    }, 1200));

    DOM.btnSaveJournal.addEventListener('click', () => {
      saveJournal(appState.activeDate, DOM.journalTextarea.value);
    });

    // Weekly Review
    DOM.reviewWeekSelect.addEventListener('change', () => {
      loadWeeklyReview(DOM.reviewWeekSelect.value);
    });

    DOM.btnSaveWeeklyReview.addEventListener('click', () => {
      saveWeeklyReview(DOM.reviewWeekSelect.value);
    });

    // Backup & Data
    DOM.btnExportData.addEventListener('click', exportData);

    DOM.importFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        importData(e.target.files[0]);
      }
    });

    // Reset Flow
    DOM.btnResetDataModal.addEventListener('click', () => {
      DOM.resetConfirmInput.value = '';
      DOM.btnConfirmReset.disabled = true;
      openModal(DOM.resetConfirmModal);
    });

    DOM.resetConfirmInput.addEventListener('input', () => {
      DOM.btnConfirmReset.disabled = DOM.resetConfirmInput.value.trim() !== 'RESET';
    });

    DOM.btnConfirmReset.addEventListener('click', resetData);
    DOM.btnCancelReset.addEventListener('click', () => closeModal(DOM.resetConfirmModal));
    DOM.btnCloseResetModal.addEventListener('click', () => closeModal(DOM.resetConfirmModal));
    DOM.btnCloseInspectModal.addEventListener('click', () => closeModal(DOM.dayInspectModal));

    // Certificate Modal Events
    if (DOM.btnOpenCertModal) {
      DOM.btnOpenCertModal.addEventListener('click', (e) => {
        e.preventDefault();
        openCertificateModal(false);
      });
    }
    if (DOM.btnClaimCertificate) {
      DOM.btnClaimCertificate.addEventListener('click', (e) => {
        e.preventDefault();
        openCertificateModal(false);
      });
    }
    if (DOM.btnCloseCertModal) {
      DOM.btnCloseCertModal.addEventListener('click', () => closeModal(DOM.certificateModal));
    }
    if (DOM.btnCloseCertModal2) {
      DOM.btnCloseCertModal2.addEventListener('click', () => closeModal(DOM.certificateModal));
    }
    if (DOM.btnDownloadCertPng) {
      DOM.btnDownloadCertPng.addEventListener('click', downloadCertificatePNG);
    }
    if (DOM.btnPrintCert) {
      DOM.btnPrintCert.addEventListener('click', () => window.print());
    }

    // Nav Links (Desktop & Mobile) — Dedicated Page Navigation
    DOM.desktopNavLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('data-section');
        switchPage(sectionId);
      });
    });

    DOM.mobileNavLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('data-section');
        switchPage(sectionId);
      });
    });

    // Brand click returns to Dashboard / Home
    DOM.navBrandLogo.addEventListener('click', (e) => {
      e.preventDefault();
      switchPage('dashboardSection');
    });

    // Dashboard 4 Stat Cards Quick Navigation
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length >= 4) {
      statCards[0].style.cursor = 'pointer';
      statCards[0].title = 'View Daily Habits Tracker';
      statCards[0].addEventListener('click', () => switchPage('dailySection'));

      statCards[1].style.cursor = 'pointer';
      statCards[1].title = 'View Daily Habits Tracker';
      statCards[1].addEventListener('click', () => switchPage('dailySection'));

      statCards[2].style.cursor = 'pointer';
      statCards[2].title = 'View Progress Analytics';
      statCards[2].addEventListener('click', () => switchPage('analyticsSection'));

      statCards[3].style.cursor = 'pointer';
      statCards[3].title = 'View Discipline Goals';
      statCards[3].addEventListener('click', () => switchPage('goalsSection'));
    }

    // Window resize triggers chart re-draw
    window.addEventListener('resize', debounce(() => {
      renderAnalytics(appState.analyticsRange);
    }, 250));
  }

  // ==========================================================================
  // 13. NAVIGATION & VIEW SWITCHING (PAGE ROUTING)
  // ==========================================================================

  const PAGE_SECTION_IDS = [
    'dashboardSection',
    'dailySection',
    'goalsSection',
    'calendarSection',
    'analyticsSection',
    'journalSection',
    'settingsSection'
  ];

  /**
   * Switches the active page view cleanly like a real multi-page website
   */
  function switchPage(targetSectionId, updateHash = true) {
    if (!PAGE_SECTION_IDS.includes(targetSectionId)) {
      targetSectionId = 'dashboardSection';
    }

    // Hide all sections, display ONLY the target page
    PAGE_SECTION_IDS.forEach((id) => {
      const section = document.getElementById(id);
      if (section) {
        if (id === targetSectionId) {
          section.classList.add('active-page');
        } else {
          section.classList.remove('active-page');
        }
      }
    });

    // Update active state on both top desktop nav & bottom mobile nav
    setActiveNavLink(targetSectionId);

    // Scroll to the very top of the newly displayed page
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Sync browser URL hash and history state
    if (updateHash) {
      try {
        if (window.location.hash !== '#' + targetSectionId) {
          history.pushState(null, null, '#' + targetSectionId);
        }
      } catch (e) {}
    }

    // Refresh components when their dedicated page is displayed
    if (targetSectionId === 'analyticsSection') {
      setTimeout(() => {
        renderAnalytics(appState.analyticsRange);
      }, 60);
    } else if (targetSectionId === 'calendarSection') {
      renderCalendar();
    } else if (targetSectionId === 'dailySection') {
      loadHabits(appState.activeDate);
    }
  }

  /**
   * Handles browser back/forward and initial URL hash routing
   */
  function initPageRouter() {
    const rawHash = (window.location.hash || '').replace('#', '').trim();
    if (PAGE_SECTION_IDS.includes(rawHash)) {
      switchPage(rawHash, false);
    } else {
      switchPage('dashboardSection', false);
    }

    window.addEventListener('popstate', () => {
      const currentHash = (window.location.hash || '').replace('#', '').trim();
      if (PAGE_SECTION_IDS.includes(currentHash)) {
        switchPage(currentHash, false);
      }
    });
  }

  function showDashboard() {
    DOM.landingScreen.classList.remove('active');
    DOM.appContainer.style.display = 'flex';
    switchPage('dashboardSection');
    tryAutoPlaySoundtrack();

    // If profile not set yet, open modal
    if (!appState.user) {
      openModal(DOM.profileSetupModal);
    } else {
      applyUserProfileToUI();
    }
  }

  function navigateDate(delta) {
    const d = new Date(appState.activeDate + 'T00:00:00');
    d.setDate(d.getDate() + delta);
    appState.activeDate = formatDateString(d);
    loadActiveDateData();

    if (delta > 0) {
      showToast('Switched to Next Day');
    } else {
      showToast('Switched to Previous Day');
    }
  }

  function loadActiveDateData() {
    loadHabits(appState.activeDate);
    loadPriorities(appState.activeDate);
    loadGratitude(appState.activeDate);
    loadNotes(appState.activeDate);
    loadJournalForActiveDate(appState.activeDate);

    // Update journal date label
    const isToday = appState.activeDate === getTodayDateString();
    DOM.journalDateLabel.textContent = isToday ? 'Entry for Today' : `Entry for ${appState.activeDate}`;
  }

  function setActiveNavLink(sectionId) {
    DOM.desktopNavLinks.forEach((l) => {
      l.classList.toggle('active', l.getAttribute('data-section') === sectionId);
    });
    DOM.mobileNavLinks.forEach((l) => {
      l.classList.toggle('active', l.getAttribute('data-section') === sectionId);
    });
  }

  function smoothScrollTo(sectionId) {
    switchPage(sectionId);
  }

  // ==========================================================================
  // 14. MODAL & UTILITY FUNCTIONS
  // ==========================================================================

  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.style.display = 'none';
    document.body.style.overflow = '';
  }

  /**
   * Populates and opens the 92-Day Winter Arc Certificate modal
  /**
   * Populates and opens the 92-Day Winter Arc Certificate modal (Unlocked ONLY on Day 92)
   */
  function openCertificateModal(forceOpen) {
    const isExplicitForce = forceOpen === true;

    const startStr = appState.user && appState.user.startDate ? appState.user.startDate : getTodayDateString();
    const start = new Date(startStr + 'T00:00:00');
    const today = new Date(getTodayDateString() + 'T00:00:00');
    const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1;

    // Strict lock: Only opens on or after Day 92
    if (diffDays < 92 && !isExplicitForce) {
      const remaining = Math.max(1, 92 - diffDays);
      showToast(`🔒 Locked! Certificate unlocks on Day 92 (${remaining} days remaining). Stay disciplined!`);
      return;
    }

    const user = appState.user || { name: 'Sai Mokshith' };
    const cleanName = (user.name && user.name.trim()) || 'Warrior';

    if (DOM.certRecipientName) {
      DOM.certRecipientName.textContent = cleanName.toUpperCase();
    }

    if (DOM.certVerificationCode) {
      const year = new Date().getFullYear();
      const codeSuffix = Math.abs(hashCode(cleanName + year)).toString(16).toUpperCase().padStart(6, '0');
      DOM.certVerificationCode.textContent = `ID: WA-${year}-92D-${codeSuffix}`;
    }

    openModal(DOM.certificateModal);
  }

  function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }

  /**
   * Renders the Certificate on high-DPI HTML5 canvas and triggers direct PNG image download
   */
  function downloadCertificatePNG() {
    const user = appState.user || { name: 'Sai Mokshith' };
    const cleanName = ((user.name && user.name.trim()) || 'Warrior').toUpperCase();
    const certCode = DOM.certVerificationCode ? DOM.certVerificationCode.textContent : 'ID: WA-2026-92D-VERIFIED';

    const canvas = document.createElement('canvas');
    const width = 1920;
    const height = 1180;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 1. Dark Luxury Obsidian Gradient Background
    const bgGrad = ctx.createRadialGradient(width / 2, height * 0.3, 100, width / 2, height / 2, width * 0.7);
    bgGrad.addColorStop(0, '#101726');
    bgGrad.addColorStop(1, '#06090f');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Ornate Double Gold Borders
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#d4af37';
    ctx.strokeRect(36, 36, width - 72, height - 72);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
    ctx.strokeRect(50, 50, width - 100, height - 100);

    // Corner Star Flourishes
    const cornerOffsets = [
      [50, 50], [width - 50, 50], [50, height - 50], [width - 50, height - 50]
    ];
    ctx.fillStyle = '#fef08a';
    cornerOffsets.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. Crest & Header Text
    ctx.textAlign = 'center';
    ctx.font = '36px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
    ctx.fillText('❄️  ⚔️  ❄️', width / 2, 120);

    ctx.fillStyle = '#7eb8da';
    ctx.font = '600 18px "Inter", sans-serif';
    ctx.fillText('OFFICIAL RECOGNITION OF HONOR & RELENTLESS DISCIPLINE', width / 2, 170);

    // 4. Main Title "CERTIFICATE OF COMPLETION"
    const titleGrad = ctx.createLinearGradient(width / 2 - 400, 0, width / 2 + 400, 0);
    titleGrad.addColorStop(0, '#ffffff');
    titleGrad.addColorStop(0.5, '#f7df94');
    titleGrad.addColorStop(1, '#d4af37');
    ctx.fillStyle = titleGrad;
    ctx.font = '900 52px "Cinzel", "Times New Roman", serif';
    ctx.fillText('CERTIFICATE OF COMPLETION', width / 2, 245);

    ctx.fillStyle = '#eab308';
    ctx.font = '700 20px "Inter", sans-serif';
    ctx.fillText('THE 92-DAY WINTER ARC · OCTOBER 01 – DECEMBER 31', width / 2, 290);

    // 5. Presentation Text & Recipient Name
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 20px "Inter", sans-serif';
    ctx.fillText('THIS CERTIFIES WITH DISTINCTION THAT', width / 2, 380);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 68px "Cinzel", "Times New Roman", serif';
    ctx.shadowColor = 'rgba(212, 175, 55, 0.7)';
    ctx.shadowBlur = 25;
    ctx.fillText(cleanName, width / 2, 470);
    ctx.shadowBlur = 0;

    // Divider Line under name
    const lineGrad = ctx.createLinearGradient(width / 2 - 250, 0, width / 2 + 250, 0);
    lineGrad.addColorStop(0, 'transparent');
    lineGrad.addColorStop(0.5, '#d4af37');
    lineGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = lineGrad;
    ctx.fillRect(width / 2 - 250, 505, 500, 3);

    // 6. Citation Statement
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '400 24px "Inter", sans-serif';
    ctx.fillText('has successfully executed and conquered the full 92 Days of the Winter Arc.', width / 2, 575);
    ctx.fillText('Through cold dawns, unyielding standards, rigorous physical training, academic excellence,', width / 2, 620);
    ctx.fillText('and deliberate daily practice, proving discipline is greater than all excuses.', width / 2, 665);

    // 7. Pillars Banner
    ctx.fillStyle = '#7eb8da';
    ctx.font = '700 18px "Inter", sans-serif';
    ctx.fillText('PHYSICAL  ·  MENTAL  ·  ACADEMIC  ·  SKILLS  ·  DISCIPLINE  ·  LIFE', width / 2, 735);

    // 8. Seal & Footer
    // Left: Creed
    ctx.textAlign = 'left';
    ctx.fillStyle = '#fef08a';
    ctx.font = 'italic 24px "Playfair Display", "Times New Roman", serif';
    ctx.fillText('“Discipline today, A Better Tomorrow”', 120, 880);
    ctx.fillStyle = 'rgba(212, 175, 55, 0.5)';
    ctx.fillRect(120, 900, 320, 1.5);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 15px "Inter", sans-serif';
    ctx.fillText('WINTER ARC CREED', 120, 928);

    // Center: Embossed Metallic Gold Seal
    const sealX = width / 2;
    const sealY = 905;
    const sealR = 75;
    const sealGrad = ctx.createRadialGradient(sealX - 25, sealY - 25, 10, sealX, sealY, sealR);
    sealGrad.addColorStop(0, '#ffe494');
    sealGrad.addColorStop(0.45, '#d4af37');
    sealGrad.addColorStop(0.85, '#926f1a');
    sealGrad.addColorStop(1, '#594109');

    ctx.beginPath();
    ctx.arc(sealX, sealY, sealR, 0, Math.PI * 2);
    ctx.fillStyle = sealGrad;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#fef3c7';
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#1e1402';
    ctx.font = '900 12px "Inter", sans-serif';
    ctx.fillText('★ ★ ★', sealX, sealY - 32);
    ctx.fillText('WINTER ARC', sealX, sealY - 14);
    ctx.font = '900 36px "Cinzel", serif';
    ctx.fillText('92', sealX, sealY + 22);
    ctx.font = '800 11px "Inter", sans-serif';
    ctx.fillText('DAYS COMPLETE', sealX, sealY + 40);

    // Right: Code & Verified
    ctx.textAlign = 'right';
    ctx.fillStyle = '#7eb8da';
    ctx.font = '16px monospace';
    ctx.fillText(certCode, width - 120, 880);
    ctx.fillStyle = 'rgba(212, 175, 55, 0.5)';
    ctx.fillRect(width - 440, 900, 320, 1.5);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 15px "Inter", sans-serif';
    ctx.fillText('OFFICIAL COMPLETION SEAL', width - 120, 928);

    // 9. Trigger download
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    const safeName = cleanName.replace(/[^a-zA-Z0-9]/g, '_');
    link.download = `WinterArc-Certificate-92Days-${safeName}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('🏆 High-Res Certificate Downloaded!');
  }

  function showToast(message) {
    DOM.ambientToast.textContent = message;
    DOM.ambientToast.classList.add('show');
    clearTimeout(DOM.ambientToast._timeout);
    DOM.ambientToast._timeout = setTimeout(() => {
      DOM.ambientToast.classList.remove('show');
    }, 2800);
  }

  function getTodayDateString() {
    const now = new Date();
    return formatDateString(now);
  }

  function formatDateString(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // Self-start on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
