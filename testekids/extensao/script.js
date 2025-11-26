const question = document.querySelector(".question");
const answers = document.querySelector(".answers");
const spnQtd = document.querySelector(".spnQtd");
const textFinish = document.querySelector(".finish span");
const content = document.querySelector(".content");
const contentFinish = document.querySelector(".finish");
const scoreInputContainer = document.querySelector(".score-input-container");
const playerNameInput = document.getElementById("player-name");
const btnSaveScore = document.getElementById("btn-save-score");
const finalScoreDisplay = document.getElementById("final-score-display");
const finalPercentageDisplay = document.getElementById("final-percentage-display");
const btnRestartQuiz = document.getElementById("btn-restart-quiz"); 


import questions from "./questions.js";


let currentIndex = 0; 
let questionsCorrect = 0;
let shuffledQuestions; 
let score = 0; 

const MAX_SCORES = 5; 
const HIGHSCORES_STORAGE_KEY = 'quizHighScores'; 

/**
 * Carrega as pontuações mais altas do localStorage.
 * Garante que as pontuações estejam ordenadas (maior para menor) e limitadas ao MAX_SCORES.
 * @returns {Array<Object>} Um array de objetos { name: string, score: number }.
 */
function loadHighScores() {
    const scores = JSON.parse(localStorage.getItem(HIGHSCORES_STORAGE_KEY)) || [];
    return scores.sort((a, b) => b.score - a.score).slice(0, MAX_SCORES);
}

/**
 * Salva um array de pontuações no localStorage.
 * @param {Array<Object>} scores - O array de objetos { name: string, score: number } a ser salvo.
 */
function saveHighScores(scores) {
    localStorage.setItem(HIGHSCORES_STORAGE_KEY, JSON.stringify(scores));
}

btnSaveScore.onclick = () => {
    const finalScore = score; 
    let playerName = playerNameInput.value.trim();

    if (playerName === "") {
        alert("Por favor, digite seu nome para salvar a pontuação.");
        playerNameInput.focus();
        return;
    }

    playerName = playerName.substring(0, 15);

    let highScores = loadHighScores();
    highScores.push({ name: playerName, score: finalScore });

    highScores = highScores.sort((a, b) => b.score - a.score).slice(0, MAX_SCORES);

    saveHighScores(highScores);


    playerNameInput.value = ''; 
    
    alert(`Pontuação de ${finalScore} salva com sucesso para ${playerName}!`);
    window.location.href = "/extensao/tabela/tabela.html";
};


if (btnRestartQuiz) { 
    btnRestartQuiz.onclick = () => {
        scoreInputContainer.style.display = "none";
        content.style.display = "flex"; 
        contentFinish.style.display = "none";
        currentIndex = 0;
        questionsCorrect = 0;
        score = 0;
        shuffledQuestions = selecionarPerguntasAleatorias(questions, 15);

        loadQuestion();
    };
}


/**
 * Lida com a seleção de uma resposta pelo usuário.
 * @param {Event} e - O evento de clique.
 */
function nextQuestion(e) {
    const selectedButton = e.target;
    const isCorrect = selectedButton.getAttribute("data-correct") === "true";

    if (isCorrect) {
        questionsCorrect++; 
        score += 10; 
        selectedButton.style.backgroundColor = "green"; 
    } else {
        selectedButton.style.backgroundColor = "red"; 

        document.querySelectorAll(".answer").forEach(button => {
            if (button.getAttribute("data-correct") === "true") {
                button.style.backgroundColor = "green";
            }
        });
    }

    document.querySelectorAll(".answer").forEach((button) => {
        button.disabled = true;
    });

    if (currentIndex < shuffledQuestions.length - 1) {
        currentIndex++; 
        setTimeout(loadQuestion, 1000); 
    } else {
        setTimeout(finish, 500); 
    }
}


function finish() {
    const totalQuestions = shuffledQuestions.length;
    const percentage = (questionsCorrect / totalQuestions) * 100;
    
    textFinish.innerHTML = `Você acertou ${questionsCorrect} de ${totalQuestions}.`;
    
    finalPercentageDisplay.textContent = `Aproveitamento: ${percentage.toFixed(1)}%`;
    finalScoreDisplay.textContent = score;
    content.style.display = "none";
    contentFinish.style.display = "flex"; 
}


function loadQuestion() {
    spnQtd.innerHTML = `${currentIndex + 1}/${shuffledQuestions.length}`;
    const item = shuffledQuestions[currentIndex];
    answers.innerHTML = "";
    question.innerHTML = item.question;

    item.answers.forEach((answer) => {
        const div = document.createElement("div");

        div.innerHTML = `
        <button class="answer" data-correct="${answer.corret}">
            ${answer.Option}
        </button>
        `;

        answers.appendChild(div);
    });

    document.querySelectorAll(".answer").forEach((item) => {
        item.addEventListener("click", nextQuestion);
        item.style.backgroundColor = ""; 
        item.disabled = false; 
    });
}

function selecionarPerguntasAleatorias(perguntas, numeroPerguntas) {
    const perguntasAleatorias = [];
    const indicesUsados = new Set();

    while (perguntasAleatorias.length < numeroPerguntas) {
        const indiceAleatorio = Math.floor(Math.random() * perguntas.length);

        if (!indicesUsados.has(indiceAleatorio)) {
            perguntasAleatorias.push(perguntas[indiceAleatorio]);
            indicesUsados.add(indiceAleatorio);
        }
    }

    for (let i = perguntasAleatorias.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [perguntasAleatorias[i], perguntasAleatorias[j]] = [perguntasAleatorias[j], perguntasAleatorias[i]];
    }

    return perguntasAleatorias;
}

shuffledQuestions = selecionarPerguntasAleatorias(questions, 15);
loadQuestion();

content.style.display = "flex";
contentFinish.style.display = "none";