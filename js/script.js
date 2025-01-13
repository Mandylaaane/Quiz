
// URL (CATEGORY: MUSIC): https://opentdb.com/api.php?amount=10&category=12&difficulty=easy&type=multiple 

const question = document.getElementById('question');
const answers = document.querySelector('.quizAnswers');
const checkBtn = document.getElementById('btnCheckAnswer');
const nextBtn = document.getElementById('btnNextQuest');
const result = document.getElementById('result');
const playAgainBtn = document.getElementById('btnPlayAgain');

let questions = [];
let currentQuestion = 0;
let score = 0;
const totalQuestions = 10;

// EVENT LISTENERS
function eventListeners(){
    checkBtn.addEventListener('click', checkAnswer);
    nextBtn.addEventListener('click', loadNextQuestion);
    playAgainBtn.addEventListener('click', playAgain);
}

document.addEventListener('DOMContentLoaded', () => {
    loadQuestion();
    eventListeners();
});

// LOAD Q&A FROM API
async function loadQuestion(){
    const APIUrl = 'https://opentdb.com/api.php?amount=10&category=12&difficulty=easy&type=multiple';
    const result = await fetch(`${APIUrl}`);
    const data = await result.json();
    questions = data.results;
    showQuestion(questions[currentQuestion]);
}

// DISPLAY QUESTION, ANSWERS & CORRECTION
function showQuestion(data){
    correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let answerList = incorrectAnswer;
    // CORRECT ANSWER PLACED RANDOMLY
    answerList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1 )), 0, correctAnswer);
    
    question.innerHTML = `${data.question}`;
    answers.innerHTML = `
       ${answerList.map((option, index) => `
        <li> ${index + 1}. <span> ${option} </span> </li>
        `).join('')} 
    `;

    selectAnswer();
}

// SELECT ANSWER 
function selectAnswer(){
    answers.querySelectorAll('li').forEach((option) => {
        option.addEventListener('click', () => {
            if(answers.querySelector('.selected')){
                const activeAnswer = answers.querySelector('.selected');
                activeAnswer.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });

}

// CHECK ANSWER
function checkAnswer() {
    const selectedAnswer = answers.querySelector('.selected');
    if (selectedAnswer) {
        const answer = selectedAnswer.querySelector('span').textContent.trim();
        if (answer === correctAnswer) {
            result.textContent = "Correct!";
            result.style.color = "#72e772";
            selectedAnswer.classList.add('correct-answer');
            score++;
        } else {
            result.textContent = "Wrong!";
            result.style.color = "#f9657b";
            selectedAnswer.classList.add('incorrect-answer');
            // Highlight the correct answer
            answers.querySelectorAll('li').forEach((li) => {
                if (li.querySelector('span').textContent.trim() === correctAnswer) {
                    li.classList.add('correct-answer');
                }
            });
        }
        checkBtn.style.display = "none";
        currentQuestion++;
        if (currentQuestion < totalQuestions) {
          nextBtn.style.display = "inline-block";     
        } else {
            showFinalScore();
        } 
        } else {
          result.textContent = "Please select an answer";
          result.style.color = "#3E3F4D";  
        } 
    
}

function showFinalScore(){
    question.style.display = 'none';
    answers.style.display = 'none';
    result.style.display = 'none';
    nextBtn.style.display = 'none';
    checkBtn.style.display = 'none';

    const scoreDiv = document.getElementById('scoreScreen');
    const scoreValue = document.getElementById('scoreValue');
    scoreValue.textContent = score;
    scoreDiv.style.display = 'block';
    
    playAgainBtn.style.display = 'inline-block';

}

function loadNextQuestion(){
    if (currentQuestion < totalQuestions) {
      result.textContent = "";
      nextBtn.style.display = "none";
      checkBtn.style.display = "inline-block";  
      answers.querySelectorAll('li').forEach((li) => {
        li.classList.remove('correct-answer', 'incorrect-answer', 'selected');
    });
    showQuestion(questions[currentQuestion]);
    } else {
        showFinalScore();
    }
}

function playAgain() {
    currentQuestion = 0;
    score = 0;
    result.textContent = "";
    nextBtn.style.display = "none";
    checkBtn.style.display = "inline-block";
    playAgainBtn.style.display = "none";
    question.style.display = 'block';
    answers.style.display = 'block';
    result.style.display = 'block';
    document.getElementById('scoreScreen').style.display = 'none';

    loadQuestions();
}







