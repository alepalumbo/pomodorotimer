const browser = window.browser || window.chrome;
let isRunning = false;
let timerDuration = 30 * 60;
let breakDuration = 5 * 60;
let remainingTime = timerDuration;

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        browser.alarms.create('pomodoroTimer', { periodInMinutes: 1 / 60 });
    }
}

function stopTimer() {
    browser.alarms.clear('pomodoroTimer');
    isRunning = false;
}

function resetTimer() {
    stopTimer();
    remainingTime = timerDuration;
    updatePopup();
}

function updatePopup() {
    browser.runtime.sendMessage({
        action: 'updateTimer',
        time: formatTime(remainingTime)
    });
}

function breakTimer() {
    if (!isRunning) {
        isRunning = true;
        remainingTime = breakDuration;
        browser.alarms.create('pomodoroTimer', { periodInMinutes: 1 / 60 });
    }
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
}

browser.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'pomodoroTimer') {
        if (remainingTime > 0) {
            remainingTime--;
            updatePopup();
        } else {
            playSound();
            stopTimer();
            alert("Pomodoro Finished!");
        }
    }
});

function playSound() {
    const audio = new Audio('https://cdn.uppbeat.io/audio-files/57ef60eab5fd4218838423222dc07d99/e946ee9aeb53d44769a1526a318dd5dc/2de81a6197de7c652cc73f70cd03eeff/STREAMING-notification-action-needed-alert-single-fascinatedsound-1-00-02.mp3');
    audio.play().catch(error => console.error("Errore nella riproduzione dell'audio:", error));
}

browser.runtime.onMessage.addListener((message) => {
    if (message.action === 'start') {
        startTimer();
    } else if (message.action === 'pause') {
        stopTimer();
    } else if (message.action === 'reset') {
        resetTimer();
    } else if (message.action === 'break') {
        breakTimer();
    }
});
