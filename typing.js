const wordWrapper = document.getElementById('words');
const texts = [...new Set("When I was in my 5th semester watching a Harvard University lecture on Artificial Intelligence I got know how search tree work in board games and decision making I then created a tic-tac-toe game in a single day This experience ignited a spark in me; an idea took root that I could create a chess engine so advanced that it would be challenging even for seasoned players From that day forward I embarked on a journey into the realm of chess programming diving into a plethora of documents research papers and resources to make this vision a reality".split(' '))];

function getRandomWord() {
    let randomIndex = Math.floor(Math.random() * texts.length);
    return texts[randomIndex];
}

let currentWord, currentLetter;
renderWords(20);

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
    currentWord = document.querySelector('.word');
    currentLetter = document.querySelector('letter');
}

const main = document.getElementById('main');
const cursor = document.querySelector('.cursor');

main.addEventListener('keydown', ({key, ctrlKey})=>{
    const expected = (!currentLetter) ? ' ' : currentLetter.textContent;

    //Booleans
    const isLetter = key.length === 1 && key !== ' ';
    const isSpace = key == ' ';
    const isBackspace = key === 'Backspace';

    if(isLetter){
        if(!currentLetter){
            const extraLetter = document.createElement('letter');
            extraLetter.className = 'incorrect extra';
            extraLetter.textContent = key;
            currentWord.appendChild(extraLetter);
        }
        else{
            currentLetter.className = (key == expected)? 'correct' : 'incorrect';
            currentLetter = currentLetter.nextElementSibling;
        }
    }
    else if(isSpace){
        if(!currentLetter){
            let temp = currentLetter;
            while(temp){
                temp.className = 'incorrect';
                temp = temp.nextElementSibling;
            }
        }

        currentWord = currentWord.nextElementSibling;
        currentLetter = currentWord.children[0];
    }
    else if(isBackspace){
        let prevLetter;
        if(!currentLetter){
            currentLetter = currentWord.lastElementChild;
        }
        else{
            prevLetter = currentLetter.previousElementSibling;
            if(prevLetter){
                currentLetter = prevLetter;
            }
            else{
                // at the beginning can't back further
                if(!currentWord.previousElementSibling){
                    return;
                }
                currentWord = currentWord.previousElementSibling;
                currentLetter = currentWord.lastElementChild;
            }
        }

        if(currentLetter.classList.contains('extra')){
            prevLetter = currentLetter.previousElementSibling;
            currentLetter.remove();
            currentLetter = null;
            return;
        }
        currentLetter.className = '';
    }
    console.log(currentLetter, !currentLetter);
})