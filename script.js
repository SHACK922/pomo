// DOM Elements
const timerLabel = document.getElementById('timer-label');
const timeLeft = document.getElementById('time-left');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const sessionCount = document.getElementById('session-count');
const sessionIcons = document.getElementById('session-icons');
const taskNotes = document.getElementById('task-notes');
const soundToggle = document.getElementById('sound-toggle');
const vibrationToggle = document.getElementById('vibration-toggle');
const notification = document.getElementById('notification');
const notificationTitle = document.getElementById('notification-title');
const notificationMessage = document.getElementById('notification-message');
const notificationClose = document.getElementById('notification-close');
const notificationSound = document.getElementById('notification-sound');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeToggleIcon = themeToggleBtn.querySelector('i');
const themeToggleText = themeToggleBtn.querySelector('span');
const progressRing = document.querySelector('.progress-ring__circle');
const pomodoroCalendar = document.getElementById('pomodoro-calendar');

// Timer variables
const WORK_TIME = 25 * 60; // 25 minutes in seconds
const SHORT_BREAK = 5 * 60; // 5 minutes in seconds
const LONG_BREAK = 15 * 60; // 15 minutes in seconds
const POMODORO_CYCLE = 4; // Number of pomodoros before a long break

let timer;
let timeRemaining = WORK_TIME;
let isRunning = false;
let isWorkTime = true;
let pomodoroCount = 0;
let dailyPomodoroCount = 0;
let currentCycle = 0;
let originalTime = WORK_TIME;

// Progress ring variables
const CIRCLE_RADIUS = 140;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;
progressRing.style.strokeDasharray = `${CIRCLE_CIRCUMFERENCE}`;

// Local storage keys
const STORAGE_KEY_THEME = 'pomodoro-theme';
const STORAGE_KEY_DAILY_COUNT = 'pomodoro-daily-count';
const STORAGE_KEY_HISTORY = 'pomodoro-history';
const STORAGE_KEY_SETTINGS = 'pomodoro-settings';

// Initialize the application
function init() {
    loadTheme();
    loadSettings();
    loadDailyCount();
    updateTimerDisplay();
    generateCalendar();
    
    // Event listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    notificationClose.addEventListener('click', closeNotification);
    themeToggleBtn.addEventListener('click', toggleTheme);
    soundToggle.addEventListener('change', saveSettings);
    vibrationToggle.addEventListener('change', saveSettings);
    
    // Check if we need to update the daily count (new day)
    checkNewDay();
}

// Timer functions
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        
        timer = setInterval(() => {
            timeRemaining--;
            updateTimerDisplay();
            updateProgressRing();
            
            if (timeRemaining <= 0) {
                clearInterval(timer);
                timerComplete();
            }
        }, 1000);
    }
}

function pauseTimer() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    timeRemaining = originalTime;
    updateTimerDisplay();
    updateProgressRing();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timeLeft.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateProgressRing() {
    const progress = timeRemaining / originalTime;
    const offset = CIRCLE_CIRCUMFERENCE * (1 - progress);
    progressRing.style.strokeDashoffset = offset;
}

function timerComplete() {
    if (isWorkTime) {
        // Work session completed
        pomodoroCount++;
        dailyPomodoroCount++;
        currentCycle++;
        
        // Update session count and icons
        sessionCount.textContent = dailyPomodoroCount;
        updateSessionIcons();
        saveDailyCount();
        
        // Show notification
        showNotification('作業完了！', 'お疲れさま！よくやった！次は休憩時間です。');
        
        // Switch to break time
        isWorkTime = false;
        
        // Determine if it's time for a long break
        if (currentCycle % POMODORO_CYCLE === 0) {
            timeRemaining = LONG_BREAK;
            originalTime = LONG_BREAK;
            timerLabel.textContent = '長い休憩時間';
            progressRing.style.stroke = 'var(--secondary-color)';
        } else {
            timeRemaining = SHORT_BREAK;
            originalTime = SHORT_BREAK;
            timerLabel.textContent = '短い休憩時間';
            progressRing.style.stroke = 'var(--secondary-color)';
        }
    } else {
        // Break time completed
        isWorkTime = true;
        timeRemaining = WORK_TIME;
        originalTime = WORK_TIME;
        timerLabel.textContent = '作業時間';
        progressRing.style.stroke = 'var(--primary-color)';
        
        // Show notification
        showNotification('休憩終了！', '次の作業セッションを始めましょう！');
    }
    
    // Update display
    updateTimerDisplay();
    updateProgressRing();
    
    // Check if we earned a stamp (4 or more pomodoros in a day)
    if (dailyPomodoroCount >= 4) {
        addStampToToday();
    }
    
    // Auto-start the next timer
    startTimer();
}

// Notification functions
function showNotification(title, message) {
    notificationTitle.textContent = title;
    notificationMessage.textContent = message;
    notification.classList.add('show');
    
    // Play sound if enabled
    if (soundToggle.checked) {
        notificationSound.play();
    }
    
    // Vibrate if enabled and supported
    if (vibrationToggle.checked && 'vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
    }
}

function closeNotification() {
    notification.classList.remove('show');
}

// Session tracking functions
function updateSessionIcons() {
    sessionIcons.innerHTML = '';
    
    for (let i = 0; i < dailyPomodoroCount; i++) {
        const icon = document.createElement('div');
        icon.className = 'session-icon';
        icon.textContent = (i + 1).toString();
        sessionIcons.appendChild(icon);
    }
}

// Theme functions
function toggleTheme() {
    const isDarkMode = document.body.getAttribute('data-theme') === 'dark';
    
    if (isDarkMode) {
        document.body.removeAttribute('data-theme');
        themeToggleIcon.className = 'fas fa-moon';
        themeToggleText.textContent = 'ダークモード';
    } else {
        document.body.setAttribute('data-theme', 'dark');
        themeToggleIcon.className = 'fas fa-sun';
        themeToggleText.textContent = 'ライトモード';
    }
    
    // Save theme preference
    localStorage.setItem(STORAGE_KEY_THEME, isDarkMode ? 'light' : 'dark');
}

function loadTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
    
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeToggleIcon.className = 'fas fa-sun';
        themeToggleText.textContent = 'ライトモード';
    }
}

// Settings functions
function saveSettings() {
    const settings = {
        sound: soundToggle.checked,
        vibration: vibrationToggle.checked
    };
    
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
}

function loadSettings() {
    const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
    
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        soundToggle.checked = settings.sound;
        vibrationToggle.checked = settings.vibration;
    }
}

// Daily count and history functions
function saveDailyCount() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Save daily count
    localStorage.setItem(STORAGE_KEY_DAILY_COUNT, JSON.stringify({
        date: today,
        count: dailyPomodoroCount
    }));
    
    // Update history
    const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
    let history = savedHistory ? JSON.parse(savedHistory) : {};
    
    history[today] = dailyPomodoroCount;
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    
    // Update calendar
    generateCalendar();
}

function loadDailyCount() {
    const savedCount = localStorage.getItem(STORAGE_KEY_DAILY_COUNT);
    
    if (savedCount) {
        const data = JSON.parse(savedCount);
        const today = new Date().toISOString().split('T')[0];
        
        if (data.date === today) {
            dailyPomodoroCount = data.count;
            sessionCount.textContent = dailyPomodoroCount;
            updateSessionIcons();
        }
    }
}

function checkNewDay() {
    const savedCount = localStorage.getItem(STORAGE_KEY_DAILY_COUNT);
    
    if (savedCount) {
        const data = JSON.parse(savedCount);
        const today = new Date().toISOString().split('T')[0];
        
        if (data.date !== today) {
            // It's a new day, reset the count
            dailyPomodoroCount = 0;
            sessionCount.textContent = '0';
            sessionIcons.innerHTML = '';
            saveDailyCount();
        }
    }
}

// Calendar functions
function generateCalendar() {
    pomodoroCalendar.innerHTML = '';
    
    // Get history data
    const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
    const history = savedHistory ? JSON.parse(savedHistory) : {};
    
    // Generate last 28 days (4 weeks)
    const today = new Date();
    
    for (let i = 27; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        const dateString = date.toISOString().split('T')[0];
        const dayNumber = date.getDate();
        const pomodoroCount = history[dateString] || 0;
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        if (pomodoroCount >= 4) {
            dayElement.classList.add('has-stamp');
        }
        
        const dayNumberElement = document.createElement('div');
        dayNumberElement.className = 'calendar-day-number';
        dayNumberElement.textContent = dayNumber;
        
        const pomodoroCountElement = document.createElement('div');
        pomodoroCountElement.className = 'calendar-day-pomodoros';
        pomodoroCountElement.textContent = pomodoroCount > 0 ? `${pomodoroCount}🍅` : '';
        
        dayElement.appendChild(dayNumberElement);
        dayElement.appendChild(pomodoroCountElement);
        pomodoroCalendar.appendChild(dayElement);
    }
}

function addStampToToday() {
    const today = new Date().toISOString().split('T')[0];
    
    // Update calendar
    generateCalendar();
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
