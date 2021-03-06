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

		//scores for AI eval
		this.scores = {
			win: 0,
			block: 0,
			fork: 0
		};
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
			//check end of game, if not proceed to ai's turn
			checkEndGame() ? endGame() : updateAI();

		}
	};
}






// Algorithm for AI

// 		Process

// Winning move > blocking move > blocking forks > other moves

const updateAI = () => {

	// GET THE SCORES
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			const grid = gameGrid[i][j];

			//Change seed if player plays middle

			if (gameGrid[1][1].player){
				if ((i === 0 || i === 2) && (j === 0 || j === 2)) {
						grid.aiBaseScore=2;
				}
			}


			//Evaluate Winning moves and Blocking moves//

				//scores for rows,columns, and diagonals
			let diagScores = [null, null];
			let rowScores = evalWinAndBlock("row", i);
			let colScores = evalWinAndBlock("col", j);
				//For corner grids
			if ((i === 0 || i === 2) && (j === 0 || j === 2)) {
				diagScores =
					i === j
						? evalWinAndBlock("forwardDiag")
						: evalWinAndBlock("reverseDiag");
			}
				//For center grid
			if (i === 1 && j === 1) {
				let tempForward = evalWinAndBlock("forwardDiag");
				let tempReverse = evalWinAndBlock("reverseDiag");
				diagScores = [
					tempForward[0] + tempReverse[0],
					tempForward[1] + tempReverse[1]
				];
			}


			//Evaluate Fork
			let forkScores = null;
			if ((i === 0 || i === 2) && (j === 0 || j === 2)) {
				forkScores = evalFork(i, j);
			}


			//update the grid's scores 
			grid.scores.win = diagScores[0] + rowScores[0] + colScores[0];
			grid.scores.block = diagScores[1] + rowScores[1] + colScores[1];
			grid.scores.fork = forkScores;

		}
	}

	//EVALUATE THE SCORES
	let highestScorer = aiEvalScores();

	//MAKE THE MOVE ON THE BOARD
	aiMakeMove(highestScorer)
};


	//return 100 if grid needs to be played to protect from player fork attacks
const evalFork = (i, j) => {
	let forkScore = 0;
	//TOP LEFT
	if (i === 0 && j === 0) {
		if (gameGrid[0][1].player && gameGrid[1][0].player) {
			forkScore = 100;
		}
	}
	//TOP RIGHT
	if (i === 0 && j === 2) {
		if (gameGrid[0][1].player && gameGrid[1][2].player) {
			forkScore = 100;
		}
	}
	//BOT LEFT
	if (i === 2 && j === 0) {
		if (gameGrid[1][0].player && gameGrid[2][1].player) {
			forkScore = 100;
		}
	}
	//BOT RIGHT
	if (i === 2 && j === 2) {
		if (gameGrid[2][1].player && gameGrid[1][2].player) {
			forkScore = 100;
		}
	}
	return forkScore;
};

	//return 100 for winScore if ai WILL win
	//return 1000 for blockScore if ai HAVE lost(shouldn't happen though...)
	//return 100 for blockScore if ai MUST play that grid or else player will win 
const evalWinAndBlock = (direction, i) => {
	let blockScore = 0;
	let winScore = 0;

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

		//checks if this line contains player
		if (targetGrid.player) {
			blockScore++;
			playerPresent = true;
		}
		//check if this line contains ai
		if (targetGrid.ai) {
			winScore++;
			aiPresent = true;
		}
	}
	// Evaluate whether to play this grid to win game immediately, winScore = 100 is immediate win
	if (playerPresent) {
		winScore = 0;
	} else if (winScore === 2) {
		winScore = 100;
	} else {
		winScore = 0;
	}

	// Evaluate whether to block; 1000 = AI lost, 100 = Must block or lose, 0 = doesn't need to block
	if (aiPresent) {
		blockScore = 0;
	} else if (blockScore === 3) {
		blockScore = 1000;
	} else if (blockScore === 2) {
		blockScore = 100;
	} else {
		blockScore = 0;
	}

	return [winScore, blockScore];
};


	//evaluate all the win,block,and fork scores and return the grid that should be played
const aiEvalScores = () => {
	let highestScorer = null;
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			const grid = gameGrid[i][j];

			if (!grid.player && !grid.ai) {
				if (!highestScorer) {
					highestScorer = grid;
				}
				if (grid.scores.win >= 100) {
					endGame(true);
					return grid;
				} else if (grid.scores.block >= 100) {
					highestScorer = grid;
				} else if (
					highestScorer.scores.fork < grid.scores.fork &&
					highestScorer.scores.block <= grid.scores.block
				) {
					highestScorer = grid;
				} else if (
					highestScorer.aiBaseScore < grid.aiBaseScore &&
					highestScorer.scores.fork <= grid.scores.fork &&
					highestScorer.scores.block <= grid.scores.fork
				) {
					highestScorer = grid;
				}
			}
		}
	}
	return highestScorer;
};


	// update the dom elements and either end game or pass to player
const aiMakeMove = (highestScorer) => {

	highestScorer.ai = true;
	highestScorer.display.style.backgroundColor = "blue";
	checkEndGame() ? endGame() : (playerTurn = true);
	console.log(gameGrid);
};


// END OF AI ALGORITHM				//




