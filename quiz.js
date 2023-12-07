// Frågedata
const questions = [
  {
    question: "HTML är ett programmeringsspråk.",
    type: "trueFalse",
    answer: "false",
  },

  {
    question: "Git används för versionshantering av kod.",
    type: "trueFalse",
    answer: "true",
  },

  {
    question: "Vilket av följande är ett programmeringsspråk?",
    type: "multipleChoice",
    choices: ["HTML", "CSS", "JavaScript", "SQL"],
    answer: "JavaScript",
  },

  {
    question: "Vilka av följande är operativsystem?",
    type: "checkbox",
    choices: ["Windows", "Linux", "Chrome", "iOS"],
    correctAnswers: ["Windows", "Linux", "iOS"],
  },

  {
    question: "CSS står för 'Central Style Sheet'.",
    type: "trueFalse",
    answer: "false",
  },

  {
    question: "Vad är DOM i JavaScript?",
    type: "multipleChoice",
    choices: [
      "Document Object Model",
      "Data Output Management",
      "Digital Object Model",
      "Dynamic Output Method",
    ],
    answer: "Document Object Model",
  },

  {
    question: "Vilket företag utvecklade JavaScript?",
    type: "multipleChoice",
    choices: ["Microsoft", "Netscape", "Oracle", "Google"],
    answer: "Netscape",
  },

  {
    question: "Vilken funktion används för att skriva ut text i JavaScript?",
    type: "multipleChoice",
    choices: ["console.log", "print", "write", "output"],
    answer: "console.log",
  },

  {
    question: "Vad gör kommandot 'git pull'?",
    type: "multipleChoice",
    choices: [
      "Hämtar och integrerar ändringar från ett fjärrarkiv",
      "Skapar en ny gren",
      "Skickar ändringar till det lokala arkivet",
      "Tar bort den nuvarande grenen",
    ],
    answer: "Hämtar och integrerar ändringar från ett fjärrarkiv",
  },

  {
    question: "Vilka av följande är frontend-ramverk eller bibliotek?",
    type: "checkbox",
    choices: ["React", "Express", "Vue", "Django"],
    correctAnswers: ["React", "Vue"],
  },
];

// Funktion för att skapa frågelement
function createQuestionElement(questionData, index) {
  const questionContainer = document.getElementById("quiz-form");

  // Skapa frågeelement
  const questionElement = document.createElement("div");
  questionElement.classList.add("question");

  // Beroende på frågetyp, skapa olika HTML-struktur
  if (questionData.type === "trueFalse") {
    questionElement.innerHTML = `
            <p>${index + 1}. ${questionData.question}</p>
            <label>
                <input type="radio" name="q${index + 1}" value="true"> Sant
            </label>
            <label>
                <input type="radio" name="q${index + 1}" value="false"> Falskt
            </label>
        `;
  } else if (questionData.type === "multipleChoice") {
    const choices = questionData.choices
      .map(
        (choice) => `
            <label>
                <input type="radio" name="q${
                  index + 1
                }" value="${choice}"> ${choice}
            </label>
        `
      )
      .join("");
    questionElement.innerHTML = `
            <p>${index + 1}. ${questionData.question}</p>
            ${choices}
        `;
  } else if (questionData.type === "checkbox") {
    const choices = questionData.choices
      .map(
        (choice) => `
            <label>
                <input type="checkbox" name="q${
                  index + 1
                }" value="${choice}"> ${choice}
            </label>
        `
      )
      .join("");
    questionElement.innerHTML = `
            <p>${index + 1}. ${questionData.question}</p>
            ${choices}
        `;
  }

  // Lägg till frågeelement i formuläret
  questionContainer.appendChild(questionElement);
}

// Skapa frågeelement för varje fråga i arrayen
for (let i = 0; i < questions.length; i++) {
  createQuestionElement(questions[i], i);
}

// Övriga variabler
let userAnswers = [];
let correctAnswers = 0;

// Lägg till en lyssnare för knappen
showResultButton.addEventListener("click", showResult);

// Funktion för att visa resultat
function showResult() {
  userAnswers = [];
  correctAnswers = 0;
  result = [];

  // Hämta knappen för att visa resultat
  const showResultButton = document.getElementById("showResultButton");

  // Hämta användarens svar
  for (let i = 1; i <= questions.length; i++) {
    const answer = document.querySelector(`input[name="q${i}"]:checked`);
    if (answer) {
      userAnswers.push(answer.value);

      const currentQuestion = questions[i - 1];

      if (
        currentQuestion.type === "trueFalse" ||
        currentQuestion.type === "multipleChoice"
      ) {
        if (answer.value === currentQuestion.answer) {
          correctAnswers++;
          result.push(true);
        }else{result.push(false)}
      } else if (currentQuestion.type === "checkbox") {
        const userSelected = Array.from(
          answer.parentNode.parentNode.querySelectorAll("input:checked")
        ).map((input) => input.value);
        const correct =
          userSelected.every((value) =>
            currentQuestion.correctAnswers.includes(value)
          ) &&
          currentQuestion.correctAnswers.every((value) =>
            userSelected.includes(value)
          );
          if (correct) {
            // Poängberäkning baserat på procent
            const correctPercentage =
                userSelected.length / currentQuestion.correctAnswers.length;
            correctAnswers += correctPercentage;
            result.push(true);
        } else {
            result.push(false);
        }
    }
} else {
    result.push(false);
}
}

  // Kontrollera om användaren har besvarat några frågor
  if (userAnswers.length === 0) {
    alert("Du måste besvara minst en fråga innan du kan se resultatet.");
    return;
  }

  // Visa resultat
  const scorePercentage = (correctAnswers / questions.length) * 100;
  const resultContainer = document.getElementById("result-container");
  const scoreElement = document.getElementById("score");
  const feedbackList = document.getElementById("feedback-list");

  resultContainer.classList.remove("hidden");
  scoreElement.textContent = `Du fick ${correctAnswers.toFixed(1)} av ${
    questions.length
  } poäng.`;

  // Färg och text för resultatfeedback
  if (scorePercentage < 50) {
    scoreElement.style.color = "red";
    feedbackList.innerHTML = "<li>Underkänt</li>";
  } else if (scorePercentage >= 50 && scorePercentage <= 75) {
    scoreElement.style.color = "orange";
    feedbackList.innerHTML = "<li>Bra</li>";
  } else {
    scoreElement.style.color = "green";
    feedbackList.innerHTML = "<li>Riktigt bra jobbat</li>";
  }

  // Visa vilka frågor som är rätt eller fel
  for (let i = 0; i < questions.length; i++) {
    const listItem = document.createElement("li");
    const correctAnswerText = Array.isArray(questions[i].correctAnswers)
      ? ` Rätta svar: ${questions[i].correctAnswers.join(", ")}`
      : ` Rätt svar: ${questions[i].answer}`;


    // listItem.textContent = `Fråga ${i + 1}: ${
    //     (Array.isArray(userAnswers[i]) && userAnswers[i].every(value => questions[i].correctAnswers.includes(value))) ||
    //     (!Array.isArray(userAnswers[i]) && userAnswers[i] === questions[i].answer)
    //         ? "Rätt"
    //         : "Fel"
    // }${correctAnswerText}`;

    console.log(result);
    
    listItem.textContent = `Fråga ${i + 1}: ${
      result[i] === true ? "Rätt" : "Fel"
    }${correctAnswerText}`;

    feedbackList.appendChild(listItem);
  }

  // Dölj knappen efter att resultatet har visats
  showResultButton.disabled = true;
}
