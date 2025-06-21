class UnicornMemoryGame {
    constructor() {
        this.gameData = [
            { id: 1, emoji: '⚽', name: 'כדורגל' },
            { id: 2, emoji: '🏀', name: 'כדורסל' },
            { id: 3, emoji: '🎾', name: 'טניס' },
            { id: 4, emoji: '🏓', name: 'פינג פונג' },
            { id: 5, emoji: '🎮', name: 'משחקי וידאו' },
            { id: 6, emoji: '🎲', name: 'משחקי קופסה' },
            { id: 7, emoji: '🧸', name: 'דובונים' },
            { id: 8, emoji: '🎨', name: 'ציור ויצירה' },
            { id: 9, emoji: '🎵', name: 'מוזיקה' },
            { id: 10, emoji: '📚', name: 'ספרים' },
            { id: 11, emoji: '🎪', name: 'קרקס' },
            { id: 12, emoji: '🎭', name: 'התחפשות' },
            { id: 13, emoji: '🏈', name: 'פוטבול' },
            { id: 14, emoji: '⚾', name: 'בייסבול' },
            { id: 15, emoji: '🏐', name: 'כדורעף' },
            { id: 16, emoji: '🏸', name: 'בדמינטון' },
            { id: 17, emoji: '🎯', name: 'קליעה למטרה' },
            { id: 18, emoji: '🎪', name: 'משחקי קרקס' },
            { id: 19, emoji: '🎨', name: 'ציור' },
            { id: 20, emoji: '🎤', name: 'שירה' },
            { id: 21, emoji: '🏊', name: 'שחייה' },
            { id: 22, emoji: '🚴', name: 'רכיבה על אופניים' },
            { id: 23, emoji: '🎪', name: 'מופעי קרקס' },
            { id: 24, emoji: '🎨', name: 'אמנות' }
        ];

        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = [];
        this.moves = 0;
        this.score = 0;
        this.gameTimer = null;
        this.startTime = null;
        this.isGameActive = false;
        this.playerCount = 1;
        this.currentPlayer = 1;
        this.playerOrder = [];
        this.currentPlayerIndex = 0;
        this.playerNames = { 1: 'שחקן 1', 2: 'שחקן 2', 3: 'שחקן 3', 4: 'שחקן 4' };
        this.playerScores = { 1: 0, 2: 0, 3: 0, 4: 0 };
        this.cardCount = 8;

        this.initializeElements();
        this.bindEvents();
        this.showSetupModal();
    }

    initializeElements() {
        this.timerElement = document.getElementById('timer');
        this.movesElement = document.getElementById('moves');
        this.scoreElement = document.getElementById('score');
        this.currentPlayerElement = document.getElementById('current-player');
        this.currentPlayerContainer = document.getElementById('current-player-container');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.gameBoard = document.getElementById('game-board');
        this.gameOverModal = document.getElementById('game-over');
        this.setupModal = document.getElementById('setup-modal');
        this.winnerElement = document.getElementById('winner');
        this.finalTimeElement = document.getElementById('final-time');
        this.finalMovesElement = document.getElementById('final-moves');
        this.playAgainBtn = document.getElementById('play-again-btn');
        this.toastContainer = document.getElementById('toast-container');
        this.playerInfo = document.getElementById('player-info');
        this.playerScoresContainer = document.getElementById('player-scores');
        this.finalScoresContainer = document.getElementById('final-scores');
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.showSetupModal());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.playAgainBtn.addEventListener('click', () => this.playAgain());

        // Setup modal events
        document.querySelectorAll('.player-count-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectPlayerCount(e));
        });

        document.querySelectorAll('.card-count-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectCardCount(e));
        });

        document.getElementById('start-game-btn').addEventListener('click', () => this.startGameFromSetup());
    }

    showSetupModal() {
        this.setupModal.classList.remove('hidden');
        this.resetGame();
    }

    selectPlayerCount(event) {
        document.querySelectorAll('.player-count-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        this.playerCount = parseInt(event.target.dataset.players);
        this.updatePlayerNameSection();
    }

    selectCardCount(event) {
        document.querySelectorAll('.card-count-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        this.cardCount = parseInt(event.target.dataset.cards);
    }

    updatePlayerNameSection() {
        const playerNamesSection = document.getElementById('player-names-section');
        playerNamesSection.style.display = this.playerCount > 1 ? 'block' : 'none';

        for (let i = 1; i <= 4; i++) {
            const container = document.getElementById(`player${i}-name-container`);
            if (container) {
                container.classList.remove('player1', 'player2', 'player3', 'player4');
                
                if (i <= this.playerCount) {
                    container.style.display = 'flex';
                    container.classList.add(`player${i}`);
                } else {
                    container.style.display = 'none';
                }
            }
        }
    }

    startGameFromSetup() {
        // Get player names
        for (let i = 1; i <= this.playerCount; i++) {
            this.playerNames[i] = document.getElementById(`player${i}-name`).value || `שחקן ${i}`;
        }

        this.setupModal.classList.add('hidden');
        this.startGame();
    }

    startGame() {
        this.isGameActive = true;
        this.moves = 0;
        this.score = 0;
        this.matchedPairs = [];
        this.flippedCards = [];
        this.startTime = Date.now();
        this.playerScores = { 1: 0, 2: 0, 3: 0, 4: 0 };
        this.playerOrder = [];

        if (this.playerCount > 1) {
            for (let i = 1; i <= this.playerCount; i++) {
                this.playerOrder.push(i);
            }
            this.playerOrder.sort(() => Math.random() - 0.5);
            this.currentPlayerIndex = 0;
            this.currentPlayer = this.playerOrder[this.currentPlayerIndex];
        } else {
            this.currentPlayer = 1;
        }
        
        this.updateDisplay();
        this.startTimer();
        this.createGameBoard();
        
        this.startBtn.disabled = true;
        this.startBtn.textContent = '🎮 המשחק פעיל';
        
        const startMessage = this.playerCount > 1 ? `תור של ${this.playerNames[this.currentPlayer]}` : 'בהצלחה!';
        this.showToast(`המשחק התחיל! ${startMessage}`, 'info');
    }

    resetGame() {
        this.stopTimer();
        this.isGameActive = false;
        this.moves = 0;
        this.score = 0;
        this.matchedPairs = [];
        this.flippedCards = [];
        this.playerScores = { 1: 0, 2: 0, 3: 0, 4: 0 };
        this.playerOrder = [];
        this.currentPlayerIndex = 0;
        
        this.updateDisplay();
        this.updateTimer('00:00');
        this.clearGameBoard();
        
        this.startBtn.disabled = false;
        this.startBtn.textContent = '🎮 התחל משחק';
    }

    createGameBoard() {
        this.clearGameBoard();
        
        // Create pairs of cards based on selected count
        const selectedGames = this.gameData.slice(0, this.cardCount);
        this.cards = [];
        
        selectedGames.forEach(game => {
            this.cards.push({ ...game, isFlipped: false, isMatched: false });
            this.cards.push({ ...game, isFlipped: false, isMatched: false });
        });

        this.cards.sort(() => Math.random() - 0.5);

        this.cards.forEach((card, index) => {
            const cardElement = this.createCardElement(card, index);
            this.gameBoard.appendChild(cardElement);
        });

        this.gameBoard.className = 'game-board';
    }

    createCardElement(card, index) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.dataset.index = index;
        cardDiv.dataset.id = card.id;

        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';
        cardFront.textContent = card.emoji;

        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        cardBack.textContent = '🦄';

        cardDiv.appendChild(cardFront);
        cardDiv.appendChild(cardBack);

        cardDiv.addEventListener('click', () => this.handleCardClick(cardDiv, card, index));

        return cardDiv;
    }

    handleCardClick(cardElement, card, index) {
        if (!this.isGameActive || card.isMatched || card.isFlipped || this.flippedCards.length >= 2) {
            return;
        }

        card.isFlipped = true;
        cardElement.classList.add('flipped');
        this.flippedCards.push({ element: cardElement, card: card, index: index });

        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateDisplay();
            setTimeout(() => this.checkMatch(), 1000);
        }
    }

    checkMatch() {
        const [card1, card2] = this.flippedCards;
        const isMatch = card1.card.id === card2.card.id;

        if (isMatch) {
            card1.card.isMatched = true;
            card2.card.isMatched = true;
            card1.element.classList.add('matched');
            card2.element.classList.add('matched');
            
            this.matchedPairs.push(card1.card);
            this.score += 10;

            if (this.playerCount > 1) {
                this.playerScores[this.currentPlayer] += 1;
            }
            
            const isGameOver = this.matchedPairs.length === this.cardCount;

            if (!isGameOver) {
                if (this.playerCount > 1) {
                    this.showToast(`כל הכבוד ${this.playerNames[this.currentPlayer]}!`, 'success');
                } else {
                    this.showToast('כל הכבוד!', 'success');
                }
            }

            if (isGameOver) {
                setTimeout(() => this.endGame(), 500);
            }
        } else {
            card1.card.isFlipped = false;
            card2.card.isFlipped = false;
            card1.element.classList.remove('flipped');
            card2.element.classList.remove('flipped');
            card1.element.classList.add('wrong');
            card2.element.classList.add('wrong');
            
            setTimeout(() => {
                card1.element.classList.remove('wrong');
                card2.element.classList.remove('wrong');
            }, 1000);

            if (this.playerCount > 1) {
                this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.playerCount;
                this.currentPlayer = this.playerOrder[this.currentPlayerIndex];
                this.showToast(`תור של ${this.playerNames[this.currentPlayer]}`, 'info', 1000);
            }
        }

        this.flippedCards = [];
        this.updateDisplay();
    }

    showToast(message, type = 'info', duration = 2500) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        this.toastContainer.appendChild(toast);
        this.gameBoard.classList.add('no-clicks');
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            if (this.toastContainer.childElementCount === 0) {
                this.gameBoard.classList.remove('no-clicks');
            }
        }, duration);
    }

    startTimer() {
        this.gameTimer = setInterval(() => {
            const elapsed = Date.now() - this.startTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            this.updateTimer(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }, 1000);
    }

    stopTimer() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
    }

    updateTimer(timeString) {
        this.timerElement.textContent = timeString;
    }

    updateDisplay() {
        this.movesElement.textContent = this.moves;
        this.scoreElement.textContent = this.score;
        
        if (this.playerCount > 1) {
            this.playerInfo.style.display = 'flex';
            this.currentPlayerElement.textContent = this.playerNames[this.currentPlayer];
            this.currentPlayerContainer.className = `current-player player${this.currentPlayer}`;
            
            this.playerScoresContainer.innerHTML = '';
            for (let i = 1; i <= this.playerCount; i++) {
                const scoreDiv = document.createElement('div');
                scoreDiv.className = `player-score player${i}`;
                scoreDiv.innerHTML = `${this.playerNames[i]}: <span>${this.playerScores[i]}</span>`;
                this.playerScoresContainer.appendChild(scoreDiv);
            }
        } else {
            this.playerInfo.style.display = 'none';
        }
    }

    clearGameBoard() {
        this.gameBoard.innerHTML = '';
        this.gameBoard.className = 'game-board';
    }

    endGame() {
        this.stopTimer();
        this.isGameActive = false;
        
        const finalTime = this.timerElement.textContent;
        const winner = this.determineWinner();
        
        this.winnerElement.textContent = winner;
        this.finalTimeElement.textContent = finalTime;
        this.finalMovesElement.textContent = this.moves;
        
        this.finalScoresContainer.innerHTML = '';
        if (this.playerCount > 1) {
            for (let i = 1; i <= this.playerCount; i++) {
                const scoreP = document.createElement('p');
                scoreP.innerHTML = `${this.playerNames[i]}: <span>${this.playerScores[i]}</span> זוגות`;
                this.finalScoresContainer.appendChild(scoreP);
            }
        }
        
        this.gameOverModal.classList.remove('hidden');
        
        let toastMessage;
        if (this.playerCount === 1) {
            toastMessage = '🎉 כל הכבוד! 🎉';
        } else if (winner.includes('תיקו') || winner.includes('אף אחד')) {
            toastMessage = `🤝 ${winner} 🤝`;
        } else {
            toastMessage = `🏆 ניצחון של ${winner}! 🏆`;
        }
        this.showToast(toastMessage, 'success');
    }

    determineWinner() {
        if (this.playerCount === 1) {
            return 'כל הכבוד!';
        }
        
        let maxScore = -1;
        let winners = [];
        
        for (let i = 1; i <= this.playerCount; i++) {
            if (this.playerScores[i] > maxScore) {
                maxScore = this.playerScores[i];
                winners = [this.playerNames[i]];
            } else if (this.playerScores[i] === maxScore) {
                winners.push(this.playerNames[i]);
            }
        }
        
        if (winners.length === this.playerCount && maxScore === 0) {
            return 'אף אחד לא ניצח 😔';
        }

        if (winners.length === 1) {
            return `${winners[0]}`;
        } else {
            return `תיקו בין: ${winners.join(', ')}!`;
        }
    }

    playAgain() {
        this.gameOverModal.classList.add('hidden');
        this.showSetupModal();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new UnicornMemoryGame();
}); 