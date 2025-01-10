

// URL: https://opentdb.com/api.php?amount=10 (test)
// URL MUSIC: https://opentdb.com/api.php?amount=10&category=12&difficulty=easy&type=multiple 

const question = document.getElementById('question');
const answers = document.querySelector('.quizAnswers');

//GAME STARTED WHEN RELOAD PAGE
// document.addEventListener('DOMContentLoaded', () => {
//     loadQuestion();
// });

async function loadQuestion(){
    const APIUrl = 'https://opentdb.com/api.php?amount=1';
    const result = await fetch(`${APIUrl}`);
    const data = await result.json();
    // console.log(data.results[0]);
    showQuestion(data.results[0]);
}

// DISPLAY QUESTION & ANSWERS
function showQuestion(data){
    let correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let answerList = incorrectAnswer;
    answerList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1 )), 0, correctAnswer);
    
    question.innerHTML = `${data.question}`;
    answers.innerHTML = `
       ${answerList.map((option, index) => `
        <li> ${index + 1}. <span> ${option} </span> </li>
        `).join('')}
    `;

    // selectOption();
}

loadQuestion();


// SELECT ANSWER

// function selectAnswer(){
//     answers.querySelectorAll('li').forEach((option) => {
//         option.addEventListener('click', () => {

//         })

//     });
// }

