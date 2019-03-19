
// 			GAME FUNCTIONS 			//

    //creates the grid and seeds base score to prioritize certain grids based on who start first
const initializeGame = () => {
	for (let i = 0; i < 3; i++) {
		gameGrid[i] = [];
		for (let j = 0; j < 3; j++) {
			gameGrid[i].push(new Grid(j + 100 * j, i + 100 * i));
			gameGrid[i][j].displayGrid();
			gameGrid[i][j].getUserInput();

			gameGrid[i][j].aiBaseScore = 1;
			if ((i === 0 || i === 2) && (j === 0 || j === 2)) {
				if (!playerTurn) {
					gameGrid[i][j].aiBaseScore = 2;
				} else {
					gameGrid[i][j].aiBaseScore = 0;
				}
			}

			if (i === 1 && j === 1) {
				gameGrid[i][j].aiBaseScore = 3;
			}
		}
	}
};


	//return true if no moves left a.k.a it's a draw
const checkEndGame = () => {
	let filledGrid = 0;
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			let grid = gameGrid[i][j];
			if (grid.ai || grid.player) {
				filledGrid++;
			}
		}
	}
	return filledGrid === 9 ? true : false;
};

    //END THE GAME
const endGame = (aiWon = false) => {
	// Message for player
	aiWon
		? (msgContainer.innerText = "You Lost")
		: (msgContainer.innerText = "It's a draw.");

	//Remove eventlisteners on grids
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			let grid = gameGrid[i][j];
			grid.display.removeEventListener("click", grid.updatePlayer);
		}
	}
};


// Button handlers 

	//let player go first
const playerFirstButtonHandler = () => {
	initializeGame();
};

	// let ai go first
const aiFirstButtonHandler = () => {
	playerTurn = false;
	initializeGame();
	updateAI();
};
