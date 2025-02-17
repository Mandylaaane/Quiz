// URL (CATEGORY: MUSIC): https://opentdb.com/api.php?amount=10&category=12&difficulty=easy&type=multiple

const question = document.getElementById("question");
const answers = document.querySelector(".quizAnswers");
const checkBtn = document.getElementById("btnCheckAnswer");
const nextBtn = document.getElementById("btnNextQuest");
const result = document.getElementById("result");
const playAgainBtn = document.getElementById("btnPlayAgain");

let questions = [];
let currentQuestion = 0;
let score = 0;
const totalQuestions = 10;
// declare variable to store the correct answer
let correctAnswer;

// EVENT LISTENERS
function eventListeners() {
  checkBtn.addEventListener("click", checkAnswer);
  nextBtn.addEventListener("click", loadNextQuestion);
  playAgainBtn.addEventListener("click", playAgain);
}

document.addEventListener("DOMContentLoaded", () => {
  loadQuestion();
  eventListeners();
});

// CONNECT API
async function loadQuestion() {
  try {
    // since we have the totalQuestions variable, we can use it here, which makes it easier to change the number of questions in the future if we want to
    const APIUrl = `https://opentdb.com/api.php?amount=${totalQuestions}&category=12&difficulty=easy&type=multiple`;
    const result = await fetch(`${APIUrl}`);
    if (!result.ok) {
      throw new Error("Failed to load questions");
    }
    const data = await result.json();
    if (!data.results || data.results.length === 0) {
      throw new Error("No questions received from API");
    }
    questions = data.results;
    showQuestion(questions[currentQuestion]);
  } catch (error) {
    handleError(error);
  }
}

// DISPLAY QUESTION & ANSWERS
function showQuestion(data) {
  try {
    if (
      !data ||
      !data.question ||
      !data.correct_answer ||
      !data.incorrect_answers
    ) {
      throw new Error("Invalid question data");
    }
    // declaring a variable without ley, const or var is not recommended, it creates a global variable
    correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let answerList = incorrectAnswer;
    // CORRECT ANSWER PLACED RANDOMLY

    // fix the bug where the correct answer is added twice
    if (!answerList.includes(correctAnswer)) {
      answerList.splice(
        Math.floor(Math.random() * (incorrectAnswer.length + 1)),
        0,
        correctAnswer
      );
    }

    // this can be simplified by using textContent and `data.question` instead of ${data.question}
    question.textContent = data.question;
    answers.innerHTML = `
       ${answerList
         .map(
           (option, index) => `
        <li> ${index + 1}. <span> ${option} </span> </li>
        `
         )
         .join("")} 
    `;
    nextBtn.style.display = "none";

    selectAnswer();
  } catch (error) {
    handleError(error);
  }
}

// ERROR HANDLER
function handleError(error) {
  console.error("Error occurred:", error.message);
  // textContent is better than innerHTML for security reasons
  question.textContent = "Error loading question, please try again.";
  answers.textContent = "";
  // this can be consolidated into a single line
  checkBtn.style.display = nextBtn.style.display = "none";
  playAgainBtn.style.display = "inline-block";
}

// SELECT ANSWER
function selectAnswer() {
  answers.querySelectorAll("li").forEach((option) => {
    option.addEventListener("click", () => {
      if (answers.querySelector(".selected")) {
        const activeAnswer = answers.querySelector(".selected");
        activeAnswer.classList.remove("selected");
      }
      option.classList.add("selected");
    });
  });
}

// CHECK ANSWER
function checkAnswer() {
  const selectedAnswer = answers.querySelector(".selected");
  if (!selectedAnswer) {
    result.textContent = "Please select an answer";
    result.style.color = "#3E3F4D";
    return;
  }

  const answer = selectedAnswer.querySelector("span").textContent.trim();
  const isCorrectAnswer = answer === correctAnswer;
  result.textContent = isCorrectAnswer ? "Correct!" : "Wrong!";
  result.style.color = isCorrectAnswer ? "#72e772" : "#f9657b";
  selectedAnswer.classList.add(
    isCorrectAnswer ? "correct-answer" : "incorrect-answer"
  );

  if (isCorrectAnswer) {
    score++;
  } else {
    answers.querySelectorAll("li").forEach((li) => {
      if (li.querySelector("span").textContent.trim() === correctAnswer) {
        li.classList.add("correct-answer");
      }
    });
  }

  checkBtn.style.display = "none";
  currentQuestion++;
  // using a ternary operator here is more readable
  nextBtn.style.display =
    currentQuestion < totalQuestions ? "inline-block" : "none";

  if (currentQuestion >= totalQuestions) {
    showFinalScore();
  }
}

// DISPLAY FINAL SCORE
function showFinalScore() {
  // this can be simplified by using a forEach loop
  [question, answers, result, nextBtn, checkBtn].forEach((element) => {
    element.style.display = "none";
  });

  const scoreDiv = document.getElementById("scoreScreen");
  const scoreValue = document.getElementById("scoreValue");
  scoreValue.textContent = score;
  scoreDiv.style.display = "block";

  playAgainBtn.style.display = "inline-block";
}

// LOAD NEXT QUESTION
function loadNextQuestion() {
  if (currentQuestion < totalQuestions) {
    result.textContent = "";
    nextBtn.style.display = "none";
    checkBtn.style.display = "inline-block";
    answers.querySelectorAll("li").forEach((li) => {
      li.classList.remove("correct-answer", "incorrect-answer", "selected");
    });
    showQuestion(questions[currentQuestion]);
  } else {
    showFinalScore();
  }
}

// PLAY AGAIN / RESTART GAME
function playAgain() {
  // a dirty way of restarting the game, to avoid the current bug of the answers not being displayed properly
  // window.location.reload();
  currentQuestion = 0;
  score = 0;
  result.textContent = "";
  // can use forEach loop to simplify this
  [nextBtn, playAgainBtn].forEach((btn) => (btn.style.display = "none"));
  // can use forEach loop to simplify this
  [checkBtn, question, answers, result].forEach(
    (element) => (element.style.display = "block")
  );
  document.getElementById("scoreScreen").style.display = "none";

  // remove the selected class from the answer on restart
  answers.querySelector(".selected").classList.remove("selected");

  loadQuestions();
}
