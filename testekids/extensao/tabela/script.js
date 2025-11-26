document.addEventListener('DOMContentLoaded', () => {
    const playerNameInput = document.getElementById('playerName');
    const playerScoreInput = document.getElementById('playerScore');
    const addScoreBtn = document.getElementById('addScoreBtn');
    const scoreTableBody = document.querySelector('#scoreTable tbody');
    const clearScoresBtn = document.getElementById('clearScoresBtn');
    const MAX_SCORES = 5; 

    function loadScores() {
        const scores = JSON.parse(localStorage.getItem('quizHighScores')) || [];
        return scores.sort((a, b) => b.score - a.score).slice(0, MAX_SCORES);
    }

    function saveScores(scores) {
        localStorage.setItem('quizHighScores', JSON.stringify(scores));
    }

    function renderScores() {
        const scores = loadScores();
        scoreTableBody.innerHTML = ''; 

        if (scores.length === 0) {
            scoreTableBody.innerHTML = '<tr><td colspan="3">Nenhuma pontuação registrada ainda.</td></tr>';
            return;
        }

        scores.forEach((entry, index) => {
            const row = scoreTableBody.insertRow();
            const positionCell = row.insertCell();
            const nameCell = row.insertCell();
            const scoreCell = row.insertCell();

            positionCell.textContent = index + 1;
            nameCell.textContent = entry.name;
            scoreCell.textContent = entry.score;
        });
    }

    addScoreBtn.addEventListener('click', () => {
        const name = playerNameInput.value.trim();
        const score = parseInt(playerScoreInput.value);

        if (name === '') {
            alert('Por favor, digite seu nome.');
            return;
        }
        if (isNaN(score) || score < 0) {
            alert('Por favor, digite uma pontuação válida (número positivo).');
            return;
        }

        let scores = loadScores();
        scores.push({ name, score });
        scores = scores.sort((a, b) => b.score - a.score).slice(0, MAX_SCORES);

        saveScores(scores);
        renderScores();

        playerNameInput.value = '';
        playerScoreInput.value = '';
    });

    clearScoresBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja limpar todas as pontuações?')) {
            localStorage.removeItem('quizHighScores');
            renderScores(); 
        }
    });

    renderScores();
});