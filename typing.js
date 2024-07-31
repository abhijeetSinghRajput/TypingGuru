const texts = [...new Set("When I was in my 5th semester watching a Harvard University lecture on Artificial Intelligence I got know how search tree work in board games and decision making I then created a tic-tac-toe game in a single day This experience ignited a spark in me; an idea took root that I could create a chess engine so advanced that it would be challenging even for seasoned players From that day forward I embarked on a journey into the realm of chess programming diving into a plethora of documents research papers and resources to make this vision a reality".split(' '))];

// html elements
const wordWrapper = document.getElementById('words');
const main = document.getElementById('main');
const cursor = document.getElementById('cursor');
const time = document.getElementById('time'); // textContent = 30
const statistics = document.querySelector('.statistics');
const wpm = document.querySelector('.wpm .value');
const accuracy = document.querySelector('.accuracy .value');
const hiddenInput = document.getElementById('hiddenInput');
const LINES = 3;

let totalTypedChar = 0;
let totalCorrectTypedChar = 0;
let totalTypedWords = 0;
let correctWordChar = 0;
let incorrectWordChar = 0;


let currentWord, currentLetter;
let letterWidth, lineHeight;
let isStart = false;
let startTime = null;

main.onfocus = () => {
    hiddenInput.focus();
}
hiddenInput.onfocus = () => {
    cursor.style.visibility = 'visible';
}
hiddenInput.onblur = () => {
    cursor.style.visibility = 'hidden';
}
newGame();
function newGame() {
    statistics.classList.remove('active');
    currentLetter = null;
    currentWord = null;

    renderWords(200);

    cursor.style.top = currentLetter.offsetTop + 'px';
    cursor.style.left = currentLetter.offsetLeft + 'px';
}

let intervalId;
function start() {
    wpmData = [];
    rawData = [];

    isStart = true;
    startTime = Date.now();
    intervalId = setInterval(() => {
        calculateTypingStats();
        time.textContent -= 1;
        if (time.textContent === '0') terminate();
    }, 1000);
}

function terminate() {
    console.log('over');
    clearInterval(intervalId);
    labels = Array.from({ length: wpmData.length }, (_, i) => i);
    isStart = false;
    newGame();
    time.textContent = '30';
    myChart.data.datasets[0].data = wpmData;
    myChart.data.datasets[1].data = rawData;
    myChart.data.datasets[2].data = []; // errors
    myChart.data.labels = labels;
    myChart.update();
    statistics.classList.add('active');
    wpm.textContent = wpmData[wpmData.length - 1];
    accuracy.textContent = Math.round((totalCorrectTypedChar / totalTypedChar) * 100);
}

function getRandomWord() {
    let randomIndex = Math.floor(Math.random() * texts.length);
    return texts[randomIndex];
}

function renderWords(length) {
    function letterFragments(word) {
        return word.split('').map(letter => {
            return `<letter>${letter}</letter>`
        })
    }

    let htmlFragments = '';
    for (let i = 0; i < length; ++i) {
        const word = getRandomWord();
        htmlFragments += `
            <div class="word">
                ${letterFragments(word).join('')}
            </div>`;
    }

    wordWrapper.innerHTML = htmlFragments;
    document.querySelector('.word:last-child').innerHTML += '<letter>.</letter>';

    // Initializing variables
    currentWord = document.querySelector('.word');
    currentLetter = document.querySelector('letter');

    letterWidth = currentLetter.offsetWidth;
    cursor.style.height = currentWord.offsetHeight + 'px';
    lineHeight = 8 + currentWord.offsetHeight;
    wordWrapper.style.height = (LINES * lineHeight) + 'px';
}

window.addEventListener('resize', () => {
    if (currentLetter) {
        cursor.style.top = currentLetter.offsetTop + 'px';
        cursor.style.left = currentLetter.offsetLeft + 'px';
    }
    else {
        cursor.style.top = currentWord.lastElementChild.offsetTop + 'px';
        cursor.style.left = currentWord.lastElementChild.offsetLeft + currentWord.lastElementChild.offsetWidth + 'px';
    }

    letterWidth = currentWord.firstElementChild.offsetWidth;
})


main.addEventListener('keyup', ({ key, ctrlKey }) => {
    const expected = currentLetter ? currentLetter.textContent : ' ';
    const isLetter = key.length === 1 && key !== ' ';
    const isSpace = key === ' ';
    const isBackspace = key === 'Backspace';

    if (!isStart) {
        start();
    }
    if (key == expected) {
        totalCorrectTypedChar++;
    }

    // !currentLetter indicated the end of word
    if (isLetter) {
        if (!currentLetter) {
            const extraLetter = document.createElement('letter');
            extraLetter.className = 'incorrect extra';
            extraLetter.textContent = key;
            currentWord.appendChild(extraLetter);
        }
        else {
            currentLetter.className = (key === expected) ? 'correct' : 'incorrect';
            currentLetter = currentLetter.nextElementSibling;
        }
        totalTypedChar++;
    }
    //handling space
    else if (isSpace) {
        let temp = currentLetter;
        while (temp) {
            temp.className = 'incorrect';
            temp = temp.nextElementSibling;
        }
        validateCurrentWord();

        currentWord = currentWord.nextElementSibling;
        if (!currentWord) {
            terminate();
            return;
        }
        currentLetter = currentWord.firstElementChild;
        totalTypedChar++;
        totalTypedWords++;
    }
    //backspace
    handleBackspace(isBackspace, ctrlKey);

    // move the cursor
    if (currentLetter) {
        cursor.style.top = currentLetter.offsetTop + 'px';
        cursor.style.left = currentLetter.offsetLeft + 'px';
    }
    else if (isLetter) {
        // place cursor at the end of the word
        let x = currentWord.lastElementChild.offsetLeft;
        let y = currentWord.lastElementChild.offsetTop;
        cursor.style.left = x + letterWidth + 'px';
        cursor.style.top = y + 'px';
    }

    // remove the first line
    const lastLine = (LINES - 1) * lineHeight;
    if (parseInt(cursor.style.top) > lastLine) {
        //clear the first line
        const wordsOnFirstLine = [...wordWrapper.children].filter(child => child.offsetTop === 4);
        wordsOnFirstLine.forEach(w => w.remove());

        cursor.style.top = currentLetter.offsetTop + 'px';
    }

    // end of line (temporary new game)
    if (isGameOver()) {
        totalTypedWords++;
        terminate();
    }
})

function handleBackspace(isBackspace, ctrlKey) {
    if (!isBackspace) return;

    //EOW then curren is last letter of current word
    if (!currentLetter) {
        currentLetter = currentWord.lastElementChild;
    }
    else {
        const prevWord = currentWord.previousElementSibling;
        const prevLetter = currentLetter.previousElementSibling;

        if (prevLetter) {
            currentLetter = prevLetter;
        }
        //at the beginning of current word (move to the previous word. if any)
        else if (prevWord) {
            currentWord = prevWord;
            currentLetter = prevWord.lastElementChild;
        }
    }

    //erase the extra incorrect word
    if (currentLetter.classList.contains('extra')) {
        currentLetter.remove();
        currentLetter = null;

        // move the cursor at the end of the word
        cursor.style.top = currentWord.lastElementChild.offsetTop + 'px';
        cursor.style.left = currentWord.lastElementChild.offsetLeft + letterWidth + 'px';
    }

    // erase the whole word
    if (ctrlKey) {
        [...currentWord.children].forEach(letter => {
            if (letter.classList.contains('extra')) {
                letter.remove();
            }
            else {
                letter.className = '';
            }
        })
        currentLetter = currentWord.firstElementChild;
    }

    if (currentLetter) currentLetter.className = '';
}

function validateCurrentWord() {
    //not incorrect letter
    if (!currentWord.querySelector('.incorrect')) {
        currentWord.classList.add('correct');
        correctWordChar += currentWord.childElementCount;
    }
    else {
        currentWord.classList.add('incorrect');
        incorrectWordChar += currentWord.querySelectorAll('letter:not(.extra)').length;
    }
}
function isGameOver() {
    return (!currentLetter && !currentWord.nextElementSibling);
}

let correctWords = 0, incorrectWords = 0;

function calculateTypingStats() {
    const duration = (Date.now() - startTime) / 1000; // unit(second)
    WPM = Math.ceil(correctWordChar / 5) * 60 / duration;
    raw_WPM = Math.ceil((correctWordChar + incorrectWordChar) / 5) * 60 / duration;


    wpmData.push(Math.round(WPM));
    rawData.push(Math.round(raw_WPM));
}

