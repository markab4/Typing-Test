
const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");
const theCounter = document.querySelector(".counter");
const theWPMcount = document.querySelector('.wpm');

var originText = document.querySelector("#origin-text p").innerHTML;
var counter = 0;
var timer = [0, 0, 0, 0];
var interval;
var timerRunning = false;


// Retrieving quotes from a local JSON

var newQuote = function(){
    var list = fetch("quotes.JSON")
        .then(res => res.json())
        .then(data => {
            return (list = data);
        });

    list.then(function() {
        let randomNumber = Math.floor(Math.random() * list.length);
        originText = list[randomNumber]['quoteText'] + ' - ' + list[randomNumber]['quoteAuthor'];
        document.getElementById('origin-text').innerHTML = originText;
    });
};


// Add leading zero to numbers 9 or below (purely for aesthetics):
function leadingZero(time) {
    return (time < 10) ? "0" + time : time;
}


// Run a standard minute/second/hundredths timer:
function runTimer() {
    let currentTime = '';

    for (let i = 0; i<2; i++){
        currentTime += leadingZero(timer[i]) + ':';
    }
    currentTime += leadingZero(timer[2]);
    theTimer.innerHTML = currentTime;
    timer[3]++;

    timer[0] = Math.floor((timer[3]/100)/60);    //minutes
    timer[1] = Math.floor((timer[3]/100) - timer[0] * 60); //seconds
    timer[2] = Math.floor(timer [3] - timer[1] * 100 - timer[0] * 6000); //100ths of seconds
}

// Match the text entered with the provided text on the page:
function spellCheck() {
    let textEntered = testArea.value;
    let originTextMatch = originText.substring(0, textEntered.length);
    switch(textEntered){
        case originText :
            clearInterval(interval);
            testWrapper.style.borderColor = '#429890';
            theWPMcount.innerHTML = "WPM: " + countWPM();
            break;
        case originTextMatch :
            testWrapper.style.borderColor = '#65CCf3';
            theCounter.style.color = "#429890";
            break;
        default :
            testWrapper.style.borderColor = "#E95D0F";
            theCounter.style.color = "#E95D0F";
            incErrors();
    }
}


// Start the timer:
function start() {
    let textEnteredLength = testArea.value.length;
    if (textEnteredLength === 0 && !timerRunning){
        timerRunning = true;
        interval = setInterval(runTimer, 10);
    }
}

// Reset everything:
function reset(){
    newQuote();
    clearInterval(interval);
    counter = 0;
    interval = null;
    timer = [0, 0, 0, 0];
    timerRunning = false;

    testArea.value = "";
    theCounter.innerHTML="Error Count: 0";
    theTimer.innerHTML = "00:00:00";
    testWrapper.style.borderColor = "grey";
    theCounter.style.color = "#429890";
}

//Words Per Minute
function countWPM(){
    return Math.round((originText.length/5) / (timer[0] + timer[1]/60 + timer[2]/(60*60)));
}

//Error Count
function incErrors(){
    theCounter.innerHTML = "Error Count: " + ++counter;
}

// High Score

// Event listeners for keyboard input and the reset button:
newQuote();
testArea.addEventListener("keypress", start, false);
testArea.addEventListener('keyup', spellCheck, false);
resetButton.addEventListener("click", reset, false);