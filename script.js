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

			// eval rows and col

			let countRow = 0;
			let countCol = 0;

			for (let x = 0; x < 3; x++) {
				let targetRowGrid = gameGrid[i][x];
				let targetColGrid = gameGrid[x][j];

				if (grid !== targetRowGrid) {
					if (targetRowGrid.player) {
						countRow++;
					}
				}

				if (grid !== targetColGrid) {
					if (targetColGrid.player) {
						countCol++;
					}
				}
			}
			//		console.log(countRow, countCol);

			grid.aiScore = 0;
			countRow > 1
				? (grid.aiScore += 100 + grid.aiBaseScore)
				: countRow > 0
				? (grid.aiScore += 1 + grid.aiBaseScore)
				: (grid.aiScore += grid.aiBaseScore);

			countCol > 1
				? (grid.aiScore += 100 + grid.aiBaseScore)
				: countCol > 0
				? (grid.aiScore += 1 + grid.aiBaseScore)
				: (grid.aiScore += grid.aiBaseScore);
			//eval cols

			//eval diags

			grid.display.innerHTML = grid.aiScore;
			console.log(grid.aiScore);
		}
	}
	aiMakeMove();
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
				highestScorer.aiScore < grid.aiScore &&
				!grid.player &&
				!grid.ai
			) {
				highestScorer = grid;
			}
		}
	}
	highestScorer.player = true;
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
					gameGrid[i][j].display.innerHTML = "+1";
					gameGrid[i][j].aiBaseScore = 1;
				}
				if (i === 1 && j === 1) {
					gameGrid[i][j].display.innerHTML = "+2";
					gameGrid[i][j].aiBaseScore = 2;
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
