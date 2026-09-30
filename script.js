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
    SETTINGS: 'winterArcSettings'
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

  // --- DEFAULT MONTHLY GOALS (From reference poster) ---
  const DEFAULT_MONTHLY_GOALS = [
    { id: 'g-1', title: 'Be consistent for 30 days', category: 'Discipline', completed: false, isDefault: true },
    { id: 'g-2', title: 'Improve physical & mental health', category: 'Physical', completed: false, isDefault: true },
    { id: 'g-3', title: 'Complete important academic goals', category: 'Academic', completed: false, isDefault: true },
    { id: 'g-4', title: 'Work on projects / portfolio', category: 'Skills', completed: false, isDefault: true },
    { id: 'g-5', title: 'Learn a new skill / certification', category: 'Skills', completed: false, isDefault: true },
    { id: 'g-6', title: 'Reduce screen time', category: 'Discipline', completed: false, isDefault: true },
    { id: 'g-7', title: 'Build better habits', category: 'Life', completed: false, isDefault: true },
    { id: 'g-8', title: 'Feel more disciplined & confident', category: 'Mental', completed: false, isDefault: true }
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
    analyticsRange: 7, // 7, 30, or 90
    soundEnabled: false,
    snowEnabled: true
  };

  // Web Audio Context for synthesized atmospheric wind and subtle feedback
  let audioCtx = null;
  let windNoiseNode = null;
  let windGainNode = null;

  // --- DOM ELEMENT REFERENCES ---
  const DOM = {
    // Screens & Containers
    landingScreen: document.getElementById('landingScreen'),
    appContainer: document.getElementById('appContainer'),
    snowCanvas: document.getElementById('snowCanvas'),
    ambientToast: document.getElementById('ambientNotification'),

    // Landing Buttons
    btnLandingStart: document.getElementById('btnLandingStart'),
    btnLandingExisting: document.getElementById('btnLandingExisting'),

    // Navigation
    topNav: document.getElementById('topNav'),
    navBrandLogo: document.getElementById('navBrandLogo'),
    navDayBadge: document.getElementById('navDayBadge'),
    desktopNavLinks: document.querySelectorAll('#desktopNavLinks .nav-link'),
    mobileNavLinks: document.querySelectorAll('#mobileBottomNav .mobile-nav-link'),
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
    monthlyGoalsList: document.getElementById('monthlyGoalsList'),
    goalsCompletionBadge: document.getElementById('goalsCompletionBadge'),
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
    newGoalCategory: document.getElementById('newGoalCategory'),
    btnCloseGoalModal: document.getElementById('btnCloseGoalModal'),

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
    btnCloseResetModal: document.getElementById('btnCloseResetModal')
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
      // First visit - user profile does not exist
      DOM.btnLandingExisting.style.display = 'none';
    }

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
      appState.user = {
        name: profile.name.trim() || 'Sai',
        startDate: profile.startDate || getTodayDateString(),
        goal: profile.goal.trim() || 'Build unbreakable discipline and mental clarity',
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
   * Synchronizes user profile data across all dashboard widgets
   */
  function applyUserProfileToUI() {
    if (!appState.user) return;

    const { name, startDate, goal } = appState.user;

    // Greeting
    const hour = new Date().getHours();
    let timeGreeting = 'GOOD MORNING';
    if (hour >= 12 && hour < 17) timeGreeting = 'GOOD AFTERNOON';
    else if (hour >= 17) timeGreeting = 'GOOD EVENING';

    DOM.heroGreeting.textContent = `${timeGreeting}, ${name.toUpperCase()}.`;

    // Nav pill
    const initial = name.charAt(0).toUpperCase() || 'S';
    DOM.userInitial.textContent = initial;
    DOM.userPillName.textContent = name;

    // Settings form inputs
    if (DOM.settingName) DOM.settingName.value = name;
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
    let remaining = 90 - dayNumber;

    if (dayNumber < 1) {
      dayNumber = 1;
      remaining = 90;
    } else if (dayNumber > 90) {
      dayNumber = 90;
      remaining = 0;
    }

    const dayPadded = String(dayNumber).padStart(2, '0');
    DOM.heroDayCounter.textContent = `DAY ${dayPadded} / 90`;
    DOM.heroDaysRemaining.textContent = `${remaining} DAYS REMAINING`;
    DOM.navDayBadge.textContent = `DAY ${dayPadded} / 90`;

    // Progress Bar Fill
    const progressPercent = Math.min(100, Math.max(1, (dayNumber / 90) * 100));
    DOM.arcTotalBarFill.style.width = `${progressPercent}%`;

    // Active Phase
    let phaseName = 'PHASE 01: BUILD THE FOUNDATION';
    let phaseNum = 1;
    if (dayNumber >= 31 && dayNumber <= 60) {
      phaseName = 'PHASE 02: BUILD CONSISTENCY';
      phaseNum = 2;
    } else if (dayNumber >= 61) {
      phaseName = 'PHASE 03: BECOME THE STANDARD';
      phaseNum = 3;
    }

    appState.activePhase = phaseNum;
    DOM.currentPhaseTag.textContent = phaseName;
    DOM.arcPhaseLabel.textContent = `Phase ${phaseNum} of 3`;

    // Live Date Display
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    DOM.heroLiveDate.textContent = new Date().toLocaleDateString('en-US', dateOptions);
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

  /**
   * Saves habit status for a given date and habit ID
   */
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
      if (diffDays >= 1 && diffDays <= 90) {
        dayBadge = `DAY ${String(diffDays).padStart(2, '0')} · `;
      }
    }
    DOM.activeDateDisplay.textContent = `${dayBadge}${dateFormatted}`;

    // Build habits DOM
    DOM.habitsListContainer.innerHTML = '';

    let completedCount = 0;

    DEFAULT_HABITS.forEach((habit) => {
      const isDone = !!dayHabits[habit.id];
      if (isDone) completedCount++;

      const row = document.createElement('div');
      row.className = `habit-row ${isDone ? 'completed' : ''}`;
      row.setAttribute('data-id', habit.id);

      row.innerHTML = `
        <div class="habit-icon">${habit.icon}</div>
        <div class="habit-details">
          <div class="habit-name">${escapeHTML(habit.name)}</div>
          <div class="habit-desc">${escapeHTML(habit.desc)}</div>
        </div>
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

      DOM.habitsListContainer.appendChild(row);
    });

    // Update circular progress and badges
    calculateProgress(dateStr);
    renderWeeklyMatrix();
    renderPosterStreakBeads();
  }

  /**
   * Calculates progress for the current date and animates gauge
   */
  function calculateProgress(dateStr) {
    const logs = getAllHabitLogs();
    const dayHabits = logs[dateStr] || {};

    let completedCount = 0;
    DEFAULT_HABITS.forEach((habit) => {
      if (dayHabits[habit.id]) completedCount++;
    });

    const totalHabits = DEFAULT_HABITS.length;
    const percent = Math.round((completedCount / totalHabits) * 100);

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
    if (percent === 100) {
      DOM.gaugeStatusBadge.textContent = 'DAY COMPLETE 🔥';
      DOM.gaugeStatusBadge.classList.add('badge-complete');
      DOM.dayCompleteBanner.style.display = 'flex';
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
    const totalHabits = DEFAULT_HABITS.length;
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

    // Populate rows for 12 habits
    DOM.weeklyMatrixTbody.innerHTML = '';

    DEFAULT_HABITS.forEach((habit) => {
      const tr = document.createElement('tr');

      // Habit Name Cell
      let rowHTML = `
        <td class="matrix-habit-name-cell">
          <span class="matrix-habit-icon">${habit.icon}</span>
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

  /**
   * Renders the 30 numbered circular streak beads (1 to 30) matching the reference poster
   */
  function renderPosterStreakBeads() {
    if (!DOM.posterStreakBeadsGrid || !appState.user) return;

    const startDateStr = appState.user.startDate || getTodayDateString();
    const logs = getAllHabitLogs();
    const todayStr = getTodayDateString();
    const totalHabits = DEFAULT_HABITS.length;
    const arcStart = new Date(startDateStr + 'T00:00:00');

    DOM.posterStreakBeadsGrid.innerHTML = '';

    // Active phase offset (Phase 1: 1-30, Phase 2: 31-60, Phase 3: 61-90)
    const phaseStartDay = (appState.activePhase - 1) * 30 + 1;
    const phaseEndDay = phaseStartDay + 29;

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
  // 5. 90-DAY CALENDAR SYSTEM
  // ==========================================================================

  /**
   * Renders the 30-day block of the currently active phase
   */
  function renderCalendar() {
    if (!appState.user) return;

    const startDateStr = appState.user.startDate || getTodayDateString();
    const logs = getAllHabitLogs();
    const todayStr = getTodayDateString();
    const totalHabits = DEFAULT_HABITS.length;

    DOM.calendarDaysGrid.innerHTML = '';

    // Calculate starting day for active phase (Phase 1: 1-30, Phase 2: 31-60, Phase 3: 61-90)
    const phaseStartDay = (appState.activePhase - 1) * 30 + 1;
    const phaseEndDay = phaseStartDay + 29;

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

    let doneCount = 0;
    DEFAULT_HABITS.forEach((h) => {
      if (dayLogs[h.id]) doneCount++;
    });
    DOM.inspectDayScore.textContent = `Score: ${doneCount} / 12 habits (${score}%)`;

    // Habit breakdown
    DOM.inspectHabitsList.innerHTML = '';
    DEFAULT_HABITS.forEach((habit) => {
      const isDone = !!dayLogs[habit.id];
      const item = document.createElement('div');
      item.className = `inspect-item ${isDone ? 'done' : 'missed'}`;
      item.innerHTML = `
        <span>${isDone ? '✓' : '○'}</span>
        <span>${habit.icon}</span>
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
      smoothScrollTo('dailySection');
    };

    openModal(DOM.dayInspectModal);
  }

  // ==========================================================================
  // 6. GOALS MANAGEMENT (MONTHLY & WEEKLY)
  // ==========================================================================

  /**
   * Loads monthly goals
   */
  function loadGoals() {
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

    DOM.monthlyGoalsList.innerHTML = '';
    let completedCount = 0;

    goals.forEach((goal) => {
      if (goal.completed) completedCount++;

      const item = document.createElement('div');
      item.className = `goal-item ${goal.completed ? 'completed' : ''}`;

      item.innerHTML = `
        <div class="goal-main-wrap">
          <label class="custom-chk">
            <input type="checkbox" ${goal.completed ? 'checked' : ''}>
            <span class="chk-box"></span>
          </label>
          <span class="goal-label">${escapeHTML(goal.title)}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span class="goal-category-tag">${escapeHTML(goal.category || 'Discipline')}</span>
          ${!goal.isDefault ? `<button class="clear-item-btn" title="Delete custom goal">&times;</button>` : ''}
        </div>
      `;

      // Checkbox event
      const chk = item.querySelector('input[type="checkbox"]');
      chk.addEventListener('change', () => {
        goal.completed = chk.checked;
        item.classList.toggle('completed', goal.completed);
        saveAllGoals(goals);
      });

      // Delete custom goal event
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

    // Update goals completion badges
    DOM.goalsCompletionBadge.textContent = `${completedCount} / ${goals.length} DONE`;
    DOM.statGoalsCompleted.innerHTML = `${completedCount} <span class="stat-unit">/ ${goals.length}</span>`;
  }

  function saveAllGoals(goals) {
    try {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
      loadGoals();
      showToast('Goals updated');
    } catch (err) {
      console.error('Error saving goals:', err);
    }
  }

  /**
   * Adds custom user goal
   */
  function saveGoal(title, category) {
    let goals = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GOALS);
      goals = stored ? JSON.parse(stored) : DEFAULT_MONTHLY_GOALS;
    } catch (err) {
      goals = DEFAULT_MONTHLY_GOALS;
    }

    const newGoal = {
      id: 'g-custom-' + Date.now(),
      title: title.trim(),
      category: category,
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
    const totalHabits = DEFAULT_HABITS.length;
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

    // Draw horizontal grid lines & Y labels (0%, 25%, 50%, 75%, 100%)
    const ySteps = [0, 25, 50, 75, 100];
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = '#6b7280';
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
    areaGradient.addColorStop(0, 'rgba(212, 175, 55, 0.32)');
    areaGradient.addColorStop(0.6, 'rgba(126, 184, 218, 0.08)');
    areaGradient.addColorStop(1, 'rgba(5, 7, 10, 0)');

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
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = 'rgba(212, 175, 55, 0.6)';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0; // reset shadow

    // Draw Points & X-axis Labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#9ca3af';

    const labelInterval = rangeDays === 90 ? 10 : rangeDays === 30 ? 4 : 1;

    coords.forEach((c, idx) => {
      // Draw point dot
      ctx.beginPath();
      ctx.arc(c.x, c.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = c.pt.score >= 80 ? '#fdf1d6' : '#d4af37';
      ctx.fill();
      ctx.strokeStyle = '#05070a';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw X label
      if (idx % labelInterval === 0 || idx === coords.length - 1) {
        ctx.fillStyle = '#9ca3af';
        ctx.fillText(c.pt.label, c.x, padTop + chartHeight + 10);
      }
    });

    // Tooltip Interaction
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
          Score: <span style="color: var(--gold-light); font-weight:700;">${nearest.pt.score}%</span> (${nearest.pt.doneHabits}/12)
        `;
      } else {
        DOM.chartTooltip.style.display = 'none';
      }
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
      appName: 'SAI_WINTER_ARC',
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
      settings: JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}')
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

        if (!imported || (imported.appName !== 'SAI_WINTER_ARC' && !imported.profile && !imported.habits)) {
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
      appState.soundEnabled = !!stored.soundEnabled;
      appState.snowEnabled = stored.snowEnabled !== undefined ? stored.snowEnabled : true;
    } catch (e) {
      appState.soundEnabled = false;
      appState.snowEnabled = true;
    }

    if (DOM.btnSnowToggle) {
      DOM.btnSnowToggle.classList.toggle('active', appState.snowEnabled);
    }
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

    // Particle count: 65 lightweight particles
    const particleCount = 65;
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
        ctx.fillStyle = `rgba(240, 245, 255, ${p.opacity})`;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, true);
        ctx.fill();
      }

      snowAnimationId = requestAnimationFrame(renderSnow);
    }

    renderSnow();
  }

  /**
   * Pure Web Audio API synthesized ambient winter wind & haptic tone
   * Zero external mp3 dependencies, 100% offline.
   */
  function toggleAtmosphereSound() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      } else {
        showToast('Web Audio not supported');
        return;
      }
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    appState.soundEnabled = !appState.soundEnabled;
    saveSettings();

    const iconOff = DOM.btnSoundToggle.querySelector('.sound-off');
    const iconOn = DOM.btnSoundToggle.querySelector('.sound-on');

    if (appState.soundEnabled) {
      iconOff.style.display = 'none';
      iconOn.style.display = 'block';
      DOM.btnSoundToggle.classList.add('active');
      startWindAtmosphere();
      showToast('Winter atmosphere active ❄️');
    } else {
      iconOff.style.display = 'block';
      iconOn.style.display = 'none';
      DOM.btnSoundToggle.classList.remove('active');
      stopWindAtmosphere();
      showToast('Atmosphere muted');
    }
  }

  function startWindAtmosphere() {
    if (!audioCtx) return;
    try {
      // Create white noise buffer for realistic gentle mountain wind
      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      windNoiseNode = audioCtx.createBufferSource();
      windNoiseNode.buffer = noiseBuffer;
      windNoiseNode.loop = true;

      // Resonant Lowpass Filter for soft howling wind
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, audioCtx.currentTime);
      filter.Q.setValueAtTime(4, audioCtx.currentTime);

      windGainNode = audioCtx.createGain();
      windGainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
      windGainNode.gain.exponentialRampToValueAtTime(0.045, audioCtx.currentTime + 2.5);

      windNoiseNode.connect(filter);
      filter.connect(windGainNode);
      windGainNode.connect(audioCtx.destination);

      windNoiseNode.start();
    } catch (e) {
      console.warn('Audio start notice:', e);
    }
  }

  function stopWindAtmosphere() {
    if (windGainNode && audioCtx) {
      try {
        windGainNode.gain.setValueAtTime(windGainNode.gain.value, audioCtx.currentTime);
        windGainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
        setTimeout(() => {
          if (windNoiseNode) windNoiseNode.stop();
        }, 900);
      } catch (e) {}
    }
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
      if (appState.user && appState.user.name) {
        showDashboard();
      } else {
        openModal(DOM.profileSetupModal);
      }
    });

    DOM.btnLandingExisting.addEventListener('click', () => {
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
    DOM.navUserProfileBtn.addEventListener('click', () => {
      smoothScrollTo('settingsSection');
    });

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
        saveGoal(DOM.newGoalTitle.value, DOM.newGoalCategory.value);
        closeModal(DOM.addGoalModal);
      }
    });

    // View Switcher (Today Focus vs Weekly Matrix)
    if (DOM.btnViewToday && DOM.btnViewWeekly) {
      DOM.btnViewToday.addEventListener('click', () => {
        DOM.btnViewToday.classList.add('active');
        DOM.btnViewWeekly.classList.remove('active');
        DOM.habitsListContainer.style.display = 'flex';
        DOM.weeklyMatrixWrap.style.display = 'none';
        DOM.matrixViewHint.style.display = 'none';
        DOM.habitsColumnTitle.textContent = '12 DAILY NON-NEGOTIABLES';
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

    // Nav Links (Desktop & Mobile)
    DOM.desktopNavLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('data-section');
        setActiveNavLink(sectionId);
        smoothScrollTo(sectionId);
      });
    });

    DOM.mobileNavLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('data-section');
        setActiveNavLink(sectionId);
        smoothScrollTo(sectionId);
      });
    });

    // Brand click returns to top
    DOM.navBrandLogo.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Window resize triggers chart re-draw
    window.addEventListener('resize', debounce(() => {
      renderAnalytics(appState.analyticsRange);
    }, 250));
  }

  // ==========================================================================
  // 13. NAVIGATION & VIEW SWITCHING
  // ==========================================================================

  function showDashboard() {
    DOM.landingScreen.classList.remove('active');
    DOM.appContainer.style.display = 'flex';
    window.scrollTo(0, 0);

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
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
