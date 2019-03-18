let gameGrid = [];
let playerTurn = true;

// Grid class for displaying in browser as well as turn logic
class Grid {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.p1 = false;
		this.p2 = false;
		this.display = document.createElement("div");
		this.updateGrid = this.updateGrid.bind(this);
	}
	displayGrid() {
		this.display.className = "grid";
		this.display.style.left = `${this.x}px`;
		this.display.style.top = `${this.y}px`;
		gameContainer.appendChild(this.display);
	}
	getUserInput() {
		this.display.addEventListener("click", this.updateGrid);
	}
	updateGrid() {
		if (playerTurn && !this.p1 && !this.p2) {
			this.p1 = true;
			this.display.style.backgroundColor = "red";
			playerTurn = false;
		}
	}
}

const initializeGame = x => {
	for (i = 0; i < x; i++) {
		gameGrid[i] = [];
		for (j = 0; j < x; j++) {
			gameGrid[i].push(new Grid(j + 100 * j, i + 100 * i));
			gameGrid[i][j].displayGrid();
			gameGrid[i][j].getUserInput();
		}
	}
};

initializeGame(gameSize);
