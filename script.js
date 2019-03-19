// Grid class for displaying in browser as well as turn logic
class Grid {
	constructor(x, y, aiBaseScore = 0) {
		//x,y coordinates for displaying in browser
		this.x = x;
		this.y = y;
		this.display = document.createElement("div");

		// boolean to check if grid already picked
		this.player = false;
		this.ai = false;

		//score for AI eval
		this.playerScore = 0;
		this.aiScore = 0;
		this.aiBaseScore = aiBaseScore;
	}
	displayGrid = () => {
		this.display.className = "grid";
		this.display.style.left = `${this.x}px`;
		this.display.style.top = `${this.y}px`;
		gameContainer.appendChild(this.display);
	};
	getUserInput = () => {
		this.display.addEventListener("click", this.updatePlayer);
	};

	updatePlayer = () => {
		if (playerTurn && !this.player && !this.ai) {
			this.player = true;
			this.display.style.backgroundColor = "red";
			playerTurn = false;
			msgContainer.innerHTML = "AI turn.";

			updateAI(gameSize);
		}
	};
}

const updateAI = x => {
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			const grid = gameGrid[i][j];

			//Evaluate Win

			// Evaluate Block


			let countRow = evaluateLine("row", i);
			let countCol = evaluateLine("col", j);
			let countDiag = [null, null];

			if (
				((i === 0 || i === 2) && (j === 0 || j === 2)) ||
				(i === 1 && j === 1)
			) {
				countDiag =
					i === j ? evaluateLine("forwardDiag") : evaluateLine("reverseDiag");
			}

			//Evaluate Block Fork

			//Evaluate Fork

			grid.aiScore = 0;
			grid.playerScore = 0;

			grid.aiScore =
				countRow[0] + countCol[0] + countDiag[0] + grid.aiBaseScore;
			grid.playerScore =
				countRow[1] + countCol[1] + countDiag[1] + grid.aiBaseScore;

			grid.display.innerHTML = grid.aiScore;
			grid.display.innerHTML += "<br>";

			grid.display.innerHTML += grid.playerScore;
			grid.display.innerHTML += "<br>";
		}
	}
	aiMakeMove();
};

const evaluateLine = (direction, i) => {
	let playerScore = 0;
	let aiScore = false;

	let playerPresent = false;
	let aiPresent = false;

	let targetGrid;
	for (let x = 0; x < 3; x++) {
		if (direction === "row") {
			targetGrid = gameGrid[i][x];
		} else if (direction === "col") {
			targetGrid = gameGrid[x][i];
		} else if (direction === "forwardDiag") {
			targetGrid = gameGrid[x][x];
		} else if (direction === "reverseDiag") {
			targetGrid = gameGrid[2 - x][x];
		}

		if (targetGrid.player) {
			playerScore++;
			playerPresent = true;
		}
		if (targetGrid.ai) {
			aiScore++;
			aiPresent = true;
		}
	}

	if (playerPresent) {
		aiScore = 0;
	} else if (aiScore === 3) {
		aiScore = 1000;
	} else if (aiScore === 2) {
		aiScore = 100;
	} else if (aiScore === 1) {
		aiScore = 1;
	} else {
		aiScore = 0;
	}

	if (aiPresent) {
		playerScore = 0;
	} else if (playerScore === 3) {
		playerScore = 1000;
	} else if (playerScore === 2) {
		playerScore = 100;
	} else if (playerScore === 1) {
		playerScore = 1;
	} else {
		playerScore = 0;
	}

	return [aiScore, playerScore];
};

const aiMakeMove = () => {
	highestScorer = null;
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			const grid = gameGrid[i][j];

			if (!highestScorer && !grid.player && !grid.ai) {
				highestScorer = grid;
			}
			if (
				highestScorer &&
				highestScorer.playerScore < grid.playerScore &&
				!grid.player &&
				!grid.ai
			) {
				highestScorer = grid;
			}
		}
	}
	highestScorer.ai = true;
	highestScorer.display.style.backgroundColor = "blue";
	playerTurn = true;
	msgContainer.innerHTML = "Your turn.";

	console.log(highestScorer);
};

const initializeGame = x => {
	for (let i = 0; i < x; i++) {
		gameGrid[i] = [];
		for (let j = 0; j < x; j++) {
			gameGrid[i].push(new Grid(j + 100 * j, i + 100 * i));
			gameGrid[i][j].displayGrid();
			gameGrid[i][j].getUserInput();

			if (aiMode === "hard") {
				if ((i === 0 || i === 2) && (j === 0 || j === 2)) {
					gameGrid[i][j].display.innerHTML = "+0";
					gameGrid[i][j].aiBaseScore = 0;
				}
				if (i === 1 && j === 1) {
					gameGrid[i][j].display.innerHTML = "+3";
					gameGrid[i][j].aiBaseScore = 3;
				}
			}
		}
	}
	if (playerTurn) {
		msgContainer.innerHTML = "Your turn.";
	} else {
		msgContainer.innerHTML = "AI turn.";
	}
};

initializeGame(gameSize);
