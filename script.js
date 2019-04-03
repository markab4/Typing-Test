void function (){
    const testWrapper = document.querySelector(".test-wrapper"),
        testArea = document.querySelector("#test-area"),
        resetButton = document.querySelector("#reset"),
        timerElement = document.querySelector(".timer"),
        counterElement = document.querySelector(".counter"),
        wpmElement = document.querySelector('.wpm');

    let originText = document.querySelector("#origin-text p").innerHTML,
        counter = 0,
        timer = [0, 0, 0, 0],
        interval,
        timerRunning = false,
        hasError = false;


// Retrieving quotes from the local JSON
    function newQuote () {
        let randomNumber = Math.floor(Math.random() * list.length);
        originText = list[randomNumber]['quoteText'] + ' - ' + list[randomNumber]['quoteAuthor'];
        document.getElementById('origin-text').innerHTML = originText;
    }

// Adding leading zero to numbers 9 or below (purely for aesthetics)
    function leadingZero(time) {
        return (time < 10) ? "0" + time : time;
    }

// Running a standard minute/second/hundredths timer
    function runTimer() {
        let currentTime = '';
        for (let i = 0; i < 2; i++) {
            currentTime += leadingZero(timer[i]) + ':';
        }
        currentTime += leadingZero(timer[2]);
        timerElement.innerHTML = currentTime;
        timer[3]++;

        timer[0] = Math.floor((timer[3] / 100) / 60);    //minutes
        timer[1] = Math.floor((timer[3] / 100) - timer[0] * 60); //seconds
        timer[2] = Math.floor(timer [3] - timer[1] * 100 - timer[0] * 6000); //100ths of seconds
    }

// Matching the text entered with the provided text on the page
    function spellCheck() {
        let textEntered = testArea.value;
        let originTextMatch = originText.substring(0, textEntered.length);
        switch (textEntered) {
            case originText :
                hasError = false;
                clearInterval(interval);
                testWrapper.style.borderColor = '#429890';
                wpmElement.innerHTML = "WPM: " + countWPM();
                testArea.disabled = true;
                break;
            case originTextMatch :
                hasError = false;
                testWrapper.style.borderColor = '#65CCf3';
                counterElement.style.color = "#429890";
                break;
            default :
                testWrapper.style.borderColor = "#E95D0F";
                counterElement.style.color = "#E95D0F";
                if (!hasError && timerRunning) incErrors();
                hasError = true;
        }
    }

// Starting the timer
    function start() {
        let textEnteredLength = testArea.value.length;
        if (textEnteredLength === 0 && !timerRunning) {
            timerRunning = true;
            interval = setInterval(runTimer, 10);
        }
    }

// Resetting everything
    function reset() {
        newQuote();
        clearInterval(interval);
        counter = 0;
        interval = null;
        timer = [0, 0, 0, 0];
        testArea.disabled = false;
        timerRunning = false;

        testArea.value = "";
        counterElement.innerHTML = "Error Count: 0";
        timerElement.innerHTML = "00:00:00";
        testWrapper.style.borderColor = "grey";
        counterElement.style.color = "#429890";
    }

// Words Per Minute
    function countWPM() {
        return Math.round((originText.length / 5) / (timer[0] + timer[1] / 60 + timer[2] / (60 * 60)));
    }

// Error Count
    function incErrors() {
        counterElement.innerHTML = "Error Count: " + ++counter;
    }

// High Score functionality, to be coded


// Event listeners for keyboard input and the reset button:
    newQuote();
    testArea.addEventListener("keypress", start, false);
    testArea.addEventListener('keyup', spellCheck, false);
    resetButton.addEventListener("click", reset, false);
}();
