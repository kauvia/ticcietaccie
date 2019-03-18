//      HELPER FUNCTIONS AND VARIABLES     //
const ranN = (num) => Math.floor(Math.random() * num); //return random number from 0-num



//      Container for the game              //
const gameContainer = document.getElementById('game-container');
const msgContainer = document.getElementById('msg-container');

//      Variables for number of grids       //
const gameSize = 3;
let gameGrid = [];


//      Boolean to check player turn        //
let playerTurn = true;

//      AI Difficulty
let aiMode = "hard";