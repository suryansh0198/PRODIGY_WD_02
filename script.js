// ====================
// STOPWATCH
// ====================

let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;

const display = document.getElementById("display");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const lapBtn = document.getElementById("lapBtn");
const laps = document.getElementById("laps");

function formatTime(time) {
    let hours = Math.floor(time / 3600000);
    let minutes = Math.floor((time % 3600000) / 60000);
    let seconds = Math.floor((time % 60000) / 1000);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateDisplay() {
    elapsedTime = Date.now() - startTime;
    display.textContent = formatTime(elapsedTime);
}

function startStopwatch() {
    if (timerInterval !== null) return;

    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(updateDisplay, 1000);
}

function pauseStopwatch() {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetStopwatch() {
    pauseStopwatch();
    elapsedTime = 0;
    display.textContent = "00:00:00";
    laps.innerHTML = "";
}

startBtn.addEventListener("click", startStopwatch);
pauseBtn.addEventListener("click", pauseStopwatch);
resetBtn.addEventListener("click", resetStopwatch);

lapBtn.addEventListener("click", () => {
    if (elapsedTime === 0) return;

    const lap = document.createElement("li");
    lap.textContent = formatTime(elapsedTime);
    laps.appendChild(lap);
});

// ====================
// SPACEBAR SHORTCUT
// ====================

document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        event.preventDefault();

        if (timerInterval === null) {
            startStopwatch();
        } else {
            pauseStopwatch();
        }
    }
});

// ====================
// TIMER MODE SWITCHING
// ====================

const tabs = document.querySelectorAll(".tab");

const sections = {
    stopwatch: document.getElementById("stopwatchSection"),
    countdown: document.getElementById("countdownSection"),
    pomodoro: document.getElementById("pomodoroSection"),
    interval: document.getElementById("intervalSection")
};

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        Object.values(sections).forEach(section => {
            section.classList.add("hidden");
        });

        sections[tab.dataset.mode].classList.remove("hidden");
    });
});

// ====================
// COUNTDOWN TIMER
// ====================

let countdownTime = 0;
let countdownInterval = null;

const countdownDisplay = document.getElementById("countdownDisplay");
const countdownMinutes = document.getElementById("countdownMinutes");
const countdownSeconds = document.getElementById("countdownSeconds");

function formatCountdown(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function updateCountdownDisplay() {
    countdownDisplay.textContent = formatCountdown(countdownTime);
}

function startCountdown() {
    if (countdownInterval !== null) return;

    if (countdownTime === 0) {
        countdownTime =
            Number(countdownMinutes.value) * 60 +
            Number(countdownSeconds.value);
    }

    if (countdownTime <= 0) return;

    countdownInterval = setInterval(() => {
        countdownTime--;
        updateCountdownDisplay();

        if (countdownTime <= 0) {
            clearInterval(countdownInterval);
            countdownInterval = null;
            alert("Countdown finished!");
        }
    }, 1000);
}

function pauseCountdown() {
    clearInterval(countdownInterval);
    countdownInterval = null;
}

function resetCountdown() {
    pauseCountdown();

    countdownTime =
        Number(countdownMinutes.value) * 60 +
        Number(countdownSeconds.value);

    updateCountdownDisplay();
}

document.getElementById("countdownStartBtn").addEventListener("click", startCountdown);
document.getElementById("countdownPauseBtn").addEventListener("click", pauseCountdown);
document.getElementById("countdownResetBtn").addEventListener("click", resetCountdown);

countdownMinutes.addEventListener("input", resetCountdown);
countdownSeconds.addEventListener("input", resetCountdown);

resetCountdown();

// ====================
// POMODORO TIMER
// ====================

let pomodoroTime = 25 * 60;
let pomodoroInterval = null;
let isWorkSession = true;

const pomodoroDisplay = document.getElementById("pomodoroDisplay");
const pomodoroStatus = document.getElementById("pomodoroStatus");

function updatePomodoroDisplay() {
    pomodoroDisplay.textContent = formatCountdown(pomodoroTime);
    pomodoroStatus.textContent = isWorkSession ? "Work Session" : "Break Time";
}

function startPomodoro() {
    if (pomodoroInterval !== null) return;

    pomodoroInterval = setInterval(() => {
        pomodoroTime--;
        updatePomodoroDisplay();

        if (pomodoroTime <= 0) {
            clearInterval(pomodoroInterval);
            pomodoroInterval = null;

            isWorkSession = !isWorkSession;
            pomodoroTime = isWorkSession ? 25 * 60 : 5 * 60;

            updatePomodoroDisplay();
            alert(isWorkSession ? "Break finished! Time to work." : "Work finished! Take a break.");
        }
    }, 1000);
}

function pausePomodoro() {
    clearInterval(pomodoroInterval);
    pomodoroInterval = null;
}

function resetPomodoro() {
    pausePomodoro();
    isWorkSession = true;
    pomodoroTime = 25 * 60;
    updatePomodoroDisplay();
}

document.getElementById("pomodoroStartBtn").addEventListener("click", startPomodoro);
document.getElementById("pomodoroPauseBtn").addEventListener("click", pausePomodoro);
document.getElementById("pomodoroResetBtn").addEventListener("click", resetPomodoro);

updatePomodoroDisplay();

// ====================
// INTERVAL TIMER
// ====================

let intervalTime = 0;
let intervalInterval = null;
let isWorkInterval = true;

const intervalDisplay = document.getElementById("intervalDisplay");
const intervalStatus = document.getElementById("intervalStatus");
const workMinutes = document.getElementById("workMinutes");
const restMinutes = document.getElementById("restMinutes");

function updateIntervalDisplay() {
    intervalDisplay.textContent = formatCountdown(intervalTime);
    intervalStatus.textContent = isWorkInterval ? "Work Interval" : "Rest Interval";
}

function startIntervalTimer() {
    if (intervalInterval !== null) return;

    if (intervalTime === 0) {
        intervalTime = Number(workMinutes.value) * 60;
    }

    intervalInterval = setInterval(() => {
        intervalTime--;
        updateIntervalDisplay();

        if (intervalTime <= 0) {
            isWorkInterval = !isWorkInterval;

            intervalTime = isWorkInterval
                ? Number(workMinutes.value) * 60
                : Number(restMinutes.value) * 60;

            updateIntervalDisplay();
        }
    }, 1000);
}

function pauseIntervalTimer() {
    clearInterval(intervalInterval);
    intervalInterval = null;
}

function resetIntervalTimer() {
    pauseIntervalTimer();
    isWorkInterval = true;
    intervalTime = Number(workMinutes.value) * 60;
    updateIntervalDisplay();
}

document.getElementById("intervalStartBtn").addEventListener("click", startIntervalTimer);
document.getElementById("intervalPauseBtn").addEventListener("click", pauseIntervalTimer);
document.getElementById("intervalResetBtn").addEventListener("click", resetIntervalTimer);

workMinutes.addEventListener("input", resetIntervalTimer);
restMinutes.addEventListener("input", resetIntervalTimer);

resetIntervalTimer();