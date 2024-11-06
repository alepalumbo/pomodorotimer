const browser = window.browser || window.chrome;
let timer = document.getElementById("timer");
let startBtn = document.getElementById("startBtn");
let pauseBtn = document.getElementById("pauseBtn");
let resetBtn = document.getElementById("resetBtn");
let breakBtn = document.getElementById("breakBtn");

function updateTimerDisplay(time) {
    timer.innerText = time;
}

startBtn.addEventListener("click", () => {
    browser.runtime.sendMessage({ action: "start" });
});

pauseBtn.addEventListener("click", () => {
    browser.runtime.sendMessage({ action: "pause" });
});

resetBtn.addEventListener("click", () => {
    browser.runtime.sendMessage({ action: "reset" });
});

breakBtn.addEventListener("click", () => {
    browser.runtime.sendMessage({ action: "break" });
});

browser.runtime.onMessage.addListener((message) => {
    if (message.action === 'updateTimer') {
        updateTimerDisplay(message.time);
    }
});
