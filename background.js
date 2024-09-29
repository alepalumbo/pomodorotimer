const browser = window.browser || window.chrome;
let isRunning = false;
let timerDuration = 30 * 60;
let remainingTime = timerDuration;

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        browser.alarms.create('pomodoroTimer', { periodInMinutes: 1 / 60 });
        console.log("Timer started!");
    }
}

function stopTimer() {
    browser.alarms.clear('pomodoroTimer');
    isRunning = false;
    console.log("Timer stopped!");
}

function resetTimer() {
    stopTimer();
    remainingTime = timerDuration;
    console.log("Timer reset to:", formatTime(remainingTime));
    updatePopup();
}

function updatePopup() {
    browser.runtime.sendMessage({
        action: 'updateTimer',
        time: formatTime(remainingTime)
    });
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
}

browser.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'pomodoroTimer' && remainingTime > 0) {
        remainingTime--;
        updatePopup();
        console.log("Remaining Time:", remainingTime);

        if (remainingTime === 0) {
            playSound();
            stopTimer();
            alert("Pomodoro Finished!");
        }
    }
});

function playSound() {
    const audio = new Audio('alarm.mp3');
    audio.play();
    console.log("Sound played");
}

browser.runtime.onMessage.addListener((message) => {
    if (message.action === 'start') {
        startTimer();
    } else if (message.action === 'pause') {
        stopTimer();
    } else if (message.action === 'reset') {
        resetTimer();
    }
});
