
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

// CONNECT API 
async function loadQuestion(){
    try {
      const APIUrl = 'https://opentdb.com/api.php?amount=10&category=12&difficulty=easy&type=multiple';
      const result = await fetch(`${APIUrl}`);
      if (!result.ok) {
        throw new Error('Failed to load questions');
      }
      const data = await result.json();
      if (!data.results || data.results.length === 0) {
        throw new Error('No questions received from API');
      }
      questions = data.results;
      showQuestion(questions[currentQuestion]);
    } catch (error) {
        handleError(error);
    }
}

// DISPLAY QUESTION & ANSWERS 
function showQuestion(data){
    try {
        if (!data || !data.question || !data.correct_answer || !data.incorrect_answers) {
            throw new Error('Invalid question data');
    }
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
    nextBtn.style.display = "none";

    selectAnswer();
  } catch (error) {
    handleError(error);
  }
}

// ERROR HANDLER 
function handleError(error){
    console.error('Error occurred:', error.message);
    question.innerHTML = 'Error loading question, please try again.';
    answers.innerHTML = '';
    checkBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    playAgainBtn.style.display = 'inline-block';
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

// DISPLAY FINAL SCORE
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

// LOAD NEXT QUESTION
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

// PLAY AGAIN / RESTART GAME
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







