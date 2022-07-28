// Get DOMs
const timeEl = document.getElementById("timeEl")
const startTimer = document.getElementById("start")
const stopTimer = document.getElementById("stop")
const lapTimer = document.getElementById("lap")
const resetTimer = document.getElementById("reset")
const lapTimes = document.getElementById("lapTimes")

// Variables
let timerOn = false  // Checks if timer is ongoing
let timing = false  // Checks if timer is paused or stopped

let time = {
    millisecond: 0,
    second: 0,
    minute: 0,
    hour: 0,
    reset: function() {
        this.millisecond = 0
        this.second = 0
        this.minute = 0
        this.hour = 0
}}
let offsetTime = 0

let startTime
let stopTime

timeEl.innerHTML = "00:00:00.000"

startTimer.onclick = function() {
    switch(true) {
        // Resume
        case timerOn && (!timing):
            const currentTime = new Date()
            const start = stopTime.getTime()
            const current = currentTime.getTime()
            const tPassed = current - start
            offsetTime += tPassed
            timing = true
            break;
        // Start
        case (!timerOn) && (!timing):
            startTime = new Date()
            timerOn = true
            timing = true
            break;
    }
}

stopTimer.onclick = function() {
    timing = false
    stopTime = new Date()
}

lapTimer.onclick = function() {
    let lap
    if (!startTime) {
        lap = `00:00:00.000`
    } else {
        lap = `${time.hour}:${time.minute}:${time.second}.${time.millisecond}`
    }
    lapTimes.innerHTML += `
        <li>${lap}</li>
    `
}

resetTimer.onclick = function() {
    timeEl.innerHTML = "00:00:00.000"
    startTime = null
    timerOn = false
    timing = false
    lapTimes.innerHTML = ""
    time.reset()
    offsetTime = 0
}

function update() {
    if (timerOn && timing) {
        const currentTime = new Date()
        const start = startTime.getTime()
        const current = currentTime.getTime()
        const tPassed = (current - start) - offsetTime

        time.millisecond = digits(limiter(tPassed, 1000), 3)
        time.second = digits(limiter(Math.floor(tPassed / 1000), 60), 2)
        time.minute = digits(limiter(Math.floor(tPassed / (1000 * 60)), 60), 2)
        time.hour = digits(Math.floor(tPassed / ((1000 * 60) * 60)), 2)

        timeEl.innerHTML = `${time.hour}:${time.minute}:${time.second}.${time.millisecond}`
    }
}

function limiter(num, lim) {
    return num - (Math.floor(num / lim) * lim)
}

function digits(num, digit) {
    return num.toLocaleString("en-US", {
        minimumIntegerDigits: digit
    })
}

var intervalId = setInterval(update, 1)
