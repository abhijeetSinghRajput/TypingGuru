const texts = [...new Set("When I was in my 5th semester watching a Harvard University lecture on Artificial Intelligence I got know how search tree work in board games and decision making I then created a tic-tac-toe game in a single day This experience ignited a spark in me; an idea took root that I could create a chess engine so advanced that it would be challenging even for seasoned players From that day forward I embarked on a journey into the realm of chess programming diving into a plethora of documents research papers and resources to make this vision a reality".split(' '))];

// html elements
const wordWrapper = document.getElementById('words');
const main = document.getElementById('main');
const cursor = document.getElementById('cursor');
const time = document.getElementById('time'); // textContent = 30
const LINES = 3;

let currentWord, currentLetter;
let letterWidth, lineHeight;
let typingStart = false;

newGame();
function newGame() {
    currentLetter = null;
    currentWord = null;
    typingStart = false;

    renderWords(200);

    cursor.style.top = currentLetter.offsetTop + 'px';
    cursor.style.left = currentLetter.offsetLeft + 'px';
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
    wordWrapper.style.height = (LINES  * lineHeight) + 'px';
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


main.addEventListener('keydown', ({ key, ctrlKey }) => {
    const expected = currentLetter ? currentLetter.textContent : ' ';
    const isLetter = key.length === 1 && key !== ' ';
    const isSpace = key === ' ';
    const isBackspace = key === 'Backspace';

    if(!typingStart){
        typingStart = true;
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
    }
    //handling space
    else if (isSpace) {
        let temp = currentLetter;
        while (temp) {
            temp.className = 'incorrect';
            temp = temp.nextElementSibling;
        }

        currentWord = currentWord.nextElementSibling;
        currentLetter = currentWord.firstElementChild;
    }
    //backspace
    handleBackspace(isBackspace, ctrlKey);


    const lastLine = (LINES - 1) * lineHeight;
    if(cursor.offsetTop > lastLine){
        
        //clear the first line
        const wordsOnFirstLine = [...wordWrapper.children].filter(child=>child.offsetTop === 4);
        wordsOnFirstLine.forEach(w=>w.remove());

        cursor.style.top = currentLetter.offsetTop + 'px';
    }

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

    

    // end of line (temporary new game)
    if (isGameOver()) {
        newGame();
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

function isGameOver() {
    return (!currentLetter && !currentWord.nextElementSibling);
}
