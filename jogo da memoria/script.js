let cards = [];
let flippedCards = [];
let errorCounter = 0;
let timer = 0;
let interval;
let pairsFound = 0;
let gameMode = 'solo';
let currentPlayer = 1;
let players = [
    { name: 'Jogador 1', score: 0 },
    { name: 'Jogador 2', score: 0 }
];
let gameHistory = [];

document.getElementById('start-game').addEventListener('click', startGame);

function startGame() {
    // Limpar o tabuleiro e variáveis
    document.getElementById('game-board').innerHTML = '';
    document.getElementById('error-counter').innerText = '0';
    document.getElementById('timer').innerText = '0';
    document.getElementById('victory-message').classList.add('hidden');
    document.getElementById('current-player').classList.add('hidden');
    errorCounter = 0;
    timer = 0;
    pairsFound = 0;
    clearInterval(interval);

    // Definir o modo de jogo
    gameMode = document.getElementById('game-mode').value;

    // Definir o nível de dificuldade
    const difficulty = document.getElementById('difficulty').value;
    let numPairs;
    if (difficulty === 'easy') {
        numPairs = 4; // 4 pares para fácil
    } else if (difficulty === 'medium') {
        numPairs = 6; // 6 pares para médio
    } else {
        numPairs = 8; // 6 pares para difícil
    }

    // Gerar cartas
    cards = generateCards(numPairs);
    shuffle(cards);

    // Criar elementos de cartas no HTML
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.value = card;
        cardElement.addEventListener('click', flipCard);
        document.getElementById('game-board').appendChild(cardElement);
    });

    // Iniciar o temporizador
    interval = setInterval(() => {
        timer++;
        document.getElementById('timer').innerText = timer;
    }, 1000);

    if (gameMode === 'duo') {
        // Exibir o jogador atual
        currentPlayer = 1;
        document.getElementById('current-player').classList.remove('hidden');
        updateCurrentPlayer();
        players.forEach(player => player.score = 0); // Resetar pontuações
    }
}

function generateCards(numPairs) {
    let arr = [];
    for (let i = 1; i <= numPairs; i++) {
        arr.push(i);
        arr.push(i); // Adicionar o par
    }
    return arr;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function flipCard() {
    if (this.classList.contains('flipped') || flippedCards.length === 2) return;

    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        checkForMatch();
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;
    card1.classList.add('flipped');
    card2.classList.add('flipped');

    if (card1.dataset.value === card2.dataset.value) {
        pairsFound++;
        flippedCards = [];

        if (gameMode === 'duo') {
            players[currentPlayer - 1].score++;
        }

        // Verificar vitória
        if (pairsFound === cards.length / 2) {
            endGame(true);
        }
    } else {
        errorCounter++;
        document.getElementById('error-counter').innerText = errorCounter;
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            if (gameMode === 'duo') {
                currentPlayer = currentPlayer === 1 ? 2 : 1;
                updateCurrentPlayer();
            }
        }, 1000);
    }
}

function updateCurrentPlayer() {
    document.getElementById('player-name').innerText = players[currentPlayer - 1].name;
}

function endGame(isVictory) {
    clearInterval(interval);
    const victoryMessage = document.getElementById('winner-message');
    if (isVictory) {
        victoryMessage.innerText = 'Você venceu!';
        // Adicionar histórico de jogo
        const gameEntry = {
            date: new Date().toLocaleString(),
            mode: gameMode,
            difficulty: document.getElementById('difficulty').value,
            time: timer,
            score1: players[0].score,
            score2: players[1]?.score || '-'
        };
        gameHistory.push(gameEntry);
        updateGameHistory();
    } else {
        victoryMessage.innerText = 'Você perdeu! Tente novamente.';
    }
    document.getElementById('victory-message').classList.remove('hidden');
}

function updateGameHistory() {
    const tbody = document.getElementById('game-history').querySelector('tbody');
    tbody.innerHTML = '';
    gameHistory.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.mode}</td>
            <td>${entry.difficulty}</td>
            <td>${entry.time}</td>
            <td>${entry.score1}</td>
            <td>${entry.score2}</td>
        `;
        tbody.appendChild(row);
    });
}
