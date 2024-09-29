const browser = window.browser || window.chrome;
let timer = document.getElementById("timer");
let startBtn = document.getElementById("startBtn");
let pauseBtn = document.getElementById("pauseBtn");
let resetBtn = document.getElementById("resetBtn");

function updateTimerDisplay(time) {
    timer.innerText = time;
    console.log("Updated display:", time);
}

startBtn.addEventListener("click", () => {
    browser.runtime.sendMessage({ action: "start" });
    console.log("Start button clicked");
});

pauseBtn.addEventListener("click", () => {
    browser.runtime.sendMessage({ action: "pause" });
    console.log("Pause button clicked");
});

resetBtn.addEventListener("click", () => {
    browser.runtime.sendMessage({ action: "reset" });
    console.log("Reset button clicked");
});

browser.runtime.onMessage.addListener((message) => {
    if (message.action === 'updateTimer') {
        updateTimerDisplay(message.time);
    }
});
