class GeometricMatchingGame {
    constructor() {
        this.gameData = [
            {
                name: "מעגל",
                definition: "צורה שכל הנקודות עליה נמצאות במרחק שווה מנקודה מרכזית"
            },
            {
                name: "משולש",
                definition: "צורה עם שלוש צלעות ושלוש זוויות"
            },
            {
                name: "ריבוע",
                definition: "צורה עם ארבע צלעות שוות וארבע זוויות ישרות"
            },
            {
                name: "מלבן",
                definition: "צורה עם ארבע צלעות, שתיים ארוכות ושתיים קצרות, וארבע זוויות ישרות"
            },
            {
                name: "מעוין",
                definition: "צורה עם ארבע צלעות שוות שאינן יוצרות זוויות ישרות"
            },
            {
                name: "מקבילית",
                definition: "צורה עם ארבע צלעות, כל זוג צלעות נגדיות מקבילות ושוות"
            },
            {
                name: "טרפז",
                definition: "צורה עם ארבע צלעות, שתיים מהן מקבילות"
            },
            {
                name: "מחומש",
                definition: "צורה עם חמש צלעות וחמש זוויות"
            },
            {
                name: "משושה",
                definition: "צורה עם שש צלעות ושש זוויות"
            },
            {
                name: "אליפסה",
                definition: "צורה עגולה שדומה למעגל מוארך"
            }
        ];

        this.currentGame = [];
        this.selectedItems = [];
        this.matchedPairs = [];
        this.score = 0;
        this.gameTimer = null;
        this.startTime = null;
        this.isGameActive = false;

        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.timerElement = document.getElementById('timer');
        this.scoreElement = document.getElementById('score');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.namesContainer = document.getElementById('names-items');
        this.definitionsContainer = document.getElementById('definitions-items');
        this.gameOverModal = document.getElementById('game-over');
        this.finalScoreElement = document.getElementById('final-score');
        this.finalTimeElement = document.getElementById('final-time');
        this.playAgainBtn = document.getElementById('play-again-btn');
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.playAgainBtn.addEventListener('click', () => this.playAgain());
    }

    startGame() {
        this.isGameActive = true;
        this.score = 0;
        this.matchedPairs = [];
        this.selectedItems = [];
        this.startTime = Date.now();
        
        this.updateScore();
        this.startTimer();
        this.createGameBoard();
        
        this.startBtn.disabled = true;
        this.startBtn.textContent = 'המשחק פעיל';
    }

    resetGame() {
        this.stopTimer();
        this.isGameActive = false;
        this.score = 0;
        this.matchedPairs = [];
        this.selectedItems = [];
        
        this.updateScore();
        this.updateTimer('00:00');
        this.clearGameBoard();
        
        this.startBtn.disabled = false;
        this.startBtn.textContent = 'התחל משחק';
    }

    createGameBoard() {
        this.clearGameBoard();
        
        // Create shuffled game data
        this.currentGame = [...this.gameData].sort(() => Math.random() - 0.5);
        
        // Create names items
        const shuffledNames = [...this.currentGame].sort(() => Math.random() - 0.5);
        shuffledNames.forEach((item, index) => {
            const nameElement = this.createGameItem(item.name, 'name', index);
            this.namesContainer.appendChild(nameElement);
        });

        // Create definitions items
        const shuffledDefinitions = [...this.currentGame].sort(() => Math.random() - 0.5);
        shuffledDefinitions.forEach((item, index) => {
            const definitionElement = this.createGameItem(item.definition, 'definition', index);
            this.definitionsContainer.appendChild(definitionElement);
        });
    }

    createGameItem(text, type, index) {
        const item = document.createElement('div');
        item.className = 'item';
        item.textContent = text;
        item.dataset.type = type;
        item.dataset.index = index;
        item.dataset.text = text;
        
        item.addEventListener('click', () => this.handleItemClick(item));
        
        return item;
    }

    handleItemClick(item) {
        if (!this.isGameActive || item.classList.contains('matched')) {
            return;
        }

        // If this item is already selected, deselect it
        if (item.classList.contains('selected')) {
            item.classList.remove('selected');
            this.selectedItems = this.selectedItems.filter(selected => selected !== item);
            return;
        }

        // Select the item
        item.classList.add('selected');
        this.selectedItems.push(item);

        // Check if we have two selected items
        if (this.selectedItems.length === 2) {
            setTimeout(() => this.checkMatch(), 500);
        }
    }

    checkMatch() {
        const [item1, item2] = this.selectedItems;
        const isMatch = this.isCorrectMatch(item1, item2);

        if (isMatch) {
            // Correct match
            item1.classList.remove('selected');
            item2.classList.remove('selected');
            item1.classList.add('matched');
            item2.classList.add('matched');
            
            this.matchedPairs.push(item1.dataset.text);
            this.score += 10;
            this.updateScore();

            // Check if game is complete
            if (this.matchedPairs.length === this.currentGame.length) {
                this.endGame();
            }
        } else {
            // Wrong match
            item1.classList.remove('selected');
            item2.classList.remove('selected');
            item1.classList.add('wrong');
            item2.classList.add('wrong');
            
            setTimeout(() => {
                item1.classList.remove('wrong');
                item2.classList.remove('wrong');
            }, 1000);
        }

        this.selectedItems = [];
    }

    isCorrectMatch(item1, item2) {
        const item1Data = this.currentGame.find(gameItem => 
            gameItem.name === item1.dataset.text || gameItem.definition === item1.dataset.text
        );
        
        const item2Data = this.currentGame.find(gameItem => 
            gameItem.name === item2.dataset.text || gameItem.definition === item2.dataset.text
        );

        return item1Data === item2Data;
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

    updateScore() {
        this.scoreElement.textContent = this.score;
    }

    clearGameBoard() {
        this.namesContainer.innerHTML = '';
        this.definitionsContainer.innerHTML = '';
    }

    endGame() {
        this.stopTimer();
        this.isGameActive = false;
        
        const finalTime = this.timerElement.textContent;
        this.finalScoreElement.textContent = this.score;
        this.finalTimeElement.textContent = finalTime;
        
        this.gameOverModal.classList.remove('hidden');
    }

    playAgain() {
        this.gameOverModal.classList.add('hidden');
        this.resetGame();
        this.startGame();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GeometricMatchingGame();
});
