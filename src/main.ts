const BOARD_DIV_ID = "board_div";
const BOARD_ID = "board";
const AGREE_DRAW_ID = "agree_draw";
const AGREE_DRAW_COUNT_ID = "agree_draw_count";
const GAME_STATUS_ID = "game_status";
const TURN_STATUS_ID = "turn_status";
const PIECE_CLASS = "piece";
const SELECTED_CLASS = "selected";

// const PLAYERS = 7;
// const DRAW_VOTE_REQUIRED = 5; //5 out of 7 people have to vote for the game to be a draw

const PLAYERS = 2;
const DRAW_VOTE_REQUIRED = 2;

var BOARD_SIZE = 600;
var CELL_SIZE = BOARD_SIZE/8;

var screenHeight = window.innerHeight;
var screenWidth = window.innerWidth;

//of view_direction is not null, it overwrites the 'turn' view
var viewDirection: (Color|null) = null;
var htmlPieces: HTMLElement[] = [];
var moves: Move[] = [];

//player info
var player: number = 0;
var timers: number[] = [];
var playersDrawAgreed: boolean[] = [];
var playersDrawAgreedCount: number = 0;

var timeControl: number = 300; //inital time; in seconds
var timeBonus: number = 3; //added with each turn; in seconds

/*
	board initialization functions
*/

//init game
function initGame() {
	initBoard();
	placeBoard();
	updateBoardSize();
	for(let i = 0; i < pieces.length; i++)
		addPiece(i);
	setCallbacks(/* on promotion: */ (piece: number) => {
		removePiece(piece);
		addPiece(piece);
    }, /* on capture: */ (piece: number) => {
		removePiece(piece);
    });
	moves = allMoves();
	updateTurnStatus();
	updateGameStatusGameActive();
	player = 0;
	playersDrawAgreedCount = 0;
	//init player variables
	timers = [];
	playersDrawAgreed = [];
	for(let i = 0; i < PLAYERS; i++) {
		timers.push(timeControl*1000);
		playersDrawAgreed.push(false);
	}
}

function updateBoardSize() {
	let height = document.getElementById(BOARD_ID)?.offsetHeight;
	if(height == undefined) return;
	BOARD_SIZE = height;
	CELL_SIZE = BOARD_SIZE/8;
}

//put a board into BOARD_DIV_ID div
function placeBoard() {
	document.getElementById(BOARD_DIV_ID)!.replaceChildren(createBoard());
}

//return a new board image
function createBoard(): HTMLElement {
	let image = getImg("images/200.png", "board image", BOARD_ID, [], null);
	image.addEventListener("click", getClickPosition, false);
	return image;
}

//gets called for every click on board
function getClickPosition(this: HTMLElement, ev: MouseEvent) {
	updateBoardSize();
	var x = Math.floor(ev.offsetX/CELL_SIZE);
	var y = Math.floor(ev.offsetY/CELL_SIZE);
    if(getViewDirection() == Color.White) {
        y = 7 - y;
    } else {
        x = 7 - x;
    }
	boardClicked(x, y);
}

//add a piece html to the board and set the 'htmlPiece' property of 'piece' (on click it the html piece will update the 'selected' variable)
function addPiece(piece: number) {
	let p = pieces[piece]!;
	let htmlPiece = getImg(getPieceImage(p.type, p.color), "chess_piece", piece.toString(10), ["piece"], () => pieceClicked(piece));
	htmlPieces[piece] = htmlPiece;
	updatePiecePosition(piece);
	document.getElementById(BOARD_DIV_ID)!.appendChild(htmlPiece);
}

//remove an associated html and a board piece 'piece'
function removePiece(piece: number) {
	document.getElementById(BOARD_DIV_ID)!.removeChild(htmlPieces[piece]);
}

//get an img div with given arguments
function getImg(src: string, ifLoadFails: string = "image", id: (string|null) = null, classList: string[] = [], onClick: (null|(() => void)) = null, size: (string|null) = null): HTMLElement {
	let image = document.createElement("img");
	image.src = src;
	image.alt = ifLoadFails;
	if(id != null) image.id = id;
	if(classList.length > 0)
		for(let i = 0; i < classList.length; i++)
			image.classList.add(classList[i]);
	if(onClick != null)
		image.onclick = onClick;
	if(size != null) {
		image.style.maxHeight = size;
		image.style.maxWidth = size;
	}
	return image;
}

//get image for a specified piece and color
function getPieceImage(piece: Piece, color: Color): string {
	switch(piece) {
		//NORMAL CHES:
		case Piece.Pawn: {
			if(color == Color.Black)
				// return "images/bp.png";
				return "images/z_bv.png";
			else
				// return "images/wp.png";
				return "images/z_wv.png";
		}
		case Piece.Knight: {
			if(color == Color.Black)
				return "images/bn.png";
			else
				return "images/wn.png";
		}
		case Piece.Bishop: {
			if(color == Color.Black)
				return "images/bb.png";
			else
				return "images/wb.png";
		}
		case Piece.Rook: {
			if(color == Color.Black)
				return "images/br.png";
			else
				return "images/wr.png";
		}
		case Piece.Queen: {
			if(color == Color.Black)
				return "images/bq.png";
			else
				return "images/wq.png";
		}
		case Piece.King: {
			if(color == Color.Black)
				// return "images/bk.png";
				return "images/z_bh.png";
			else
				// return "images/wk.png";
				return "images/z_wh.png";
		}
		//JURASSIC CHESS:
		case Piece.Pterodactyl: {
			if(color == Color.Black)
				return "images/z_bp.png";
			else
				return "images/z_wp.png";
		}
		case Piece.Rex: {
			if(color == Color.Black)
				return "images/z_br.png";
			else
				return "images/z_wr.png";
		}
		case Piece.Triceratops: {
			if(color == Color.Black)
				return "images/z_bt.png";
			else
				return "images/z_wt.png";
		}
		case Piece.Dragon: {
			if(color == Color.Black)
				return "images/z_bd.png";
			else
				return "images/z_wd.png";
		}
	}
}

/*
	gameplay functions
*/

//update the position of the html piece attached to this 'piece'
function updatePiecePosition(piece: number) {
	let htmlPiece = htmlPieces[piece];
	let p = pieces[piece]!;
	if(getViewDirection() == Color.White) {
	    htmlPiece.style.left = `${p.x*8.75}vh`;
		htmlPiece.style.top = `${(70 - (p.y + 1)*8.75)}vh`;
    } else {
	    htmlPiece.style.left = `${(70 - (p.x + 1)*8.75)}vh`;
		htmlPiece.style.top = `${p.y*8.75}vh`;
    }
}

//deselect the currently selected (if any) piece (both html and variable)
function deselect() {
	if(selected != NONE) {
		htmlPieces[selected].classList.remove("selected");
	}
	selected = NONE;
}

//select a piece (both html and variable) (deselect if anything is selected)
function select(piece: number) {
	deselect();
	htmlPieces[piece].classList.add("selected");
	selected = piece;
}

//will completely ignore captured pieces; fully update the state of the board
function updateBoard() {
	for(let i = 0; i < pieces.length; i++) {
		if(pieces[i] != null) {
			updatePiecePosition(i);
		}
	}
}

//this function gets called for every clicked piece
function pieceClicked(piece: number) {
	if(gameState != GameState.Going) return;
	let p = pieces[piece]!;
	if(p.color == turn) {
		//clicking on your piece
		if(selected == piece) {
			deselect();
		} else {
			select(piece);
		}
	} else {
		//clicking on opponent piece
		boardClicked(p.x, p.y);
	}
}

//this function gets called for every square on board that's clicked
function boardClicked(x: number, y: number) {
	if(selected == NONE) return;
	let s = pieces[selected]!;
	let move = moveAvailable({from: {x: s.x, y: s.y}, to: {x: x, y: y}});
	if(move != null) {
		//can move to (x,y)
		makeMove(selected, move.to);
		setDrawStatus();
		passTurnToNextPlayer();
		updateTurnStatus();
		moves = allMoves();
		updateBoard(); // because it may turn
		updateGameStatus();
	}
	deselect();
}

function passTurnToNextPlayer() {
	nextTurn();
	player++;
	if(player == PLAYERS) player = 0;
}

function setDrawStatus() {
	let isChecked = (document.getElementById(AGREE_DRAW_ID) as HTMLInputElement).checked;
	if(isChecked != playersDrawAgreed[player]) {
		playersDrawAgreedCount += isChecked ? 1 : -1;
		playersDrawAgreed[player] = isChecked;
	}
}

function updateTurnStatus() {
	document.getElementById(TURN_STATUS_ID)!.innerText = (turn == Color.White ? "White's turn" : "Black's turn");
	(document.getElementById(AGREE_DRAW_ID) as HTMLInputElement).checked = playersDrawAgreed[player];
	document.getElementById(AGREE_DRAW_COUNT_ID)!.innerHTML = `(${playersDrawAgreedCount}/${PLAYERS})`;
}

function updateTurnStatusGameEnded() {
	document.getElementById(TURN_STATUS_ID)!.innerText = "Start a new game";
}

function updateGameStatusGameActive() {
	document.getElementById(GAME_STATUS_ID)!.innerText = "Game is active";
}

function updateGameStatusGameInactive() {
	document.getElementById(GAME_STATUS_ID)!.innerText = "Game is not active";
}

//call instead of updateGameState(moves)
function updateGameStatus() {
	if(updateGameState(moves, playersDrawAgreedCount >= DRAW_VOTE_REQUIRED)) {
		//if the game has ended
		if(gameState == GameState.Brutality) {
			document.getElementById(GAME_STATUS_ID)!.innerText = (winner == Color.White ? "White has demolished Black" : "Black has demolished White");
		} else if(gameState == GameState.Checkmate) {
			document.getElementById(GAME_STATUS_ID)!.innerText = (winner == Color.White ? "White has won" : "Black has won");
		} else if(gameState == GameState.Stalemate) {
			document.getElementById(GAME_STATUS_ID)!.innerText = "Stalemate";
		} else if(gameState == GameState.InsufficientMaterial) {
			document.getElementById(GAME_STATUS_ID)!.innerText = "Draw by insufficient material";
		} else if(gameState == GameState.AgreedDraw) {
			document.getElementById(GAME_STATUS_ID)!.innerText = "Draw by agreement";
		}
		updateTurnStatusGameEnded();
	}
}

//currently playing side is resigning
function playerDrawAgree(player: number) {
	playersDrawAgreed[player] = true;
}

//currently playing side is resigning
function playerDrawDisgree(player: number) {
	playersDrawAgreed[player] = false;
}

/*
	board orientation functions
*/

function toggleViewDirection() {
	viewDirection = _opposite(getViewDirection());
	updateBoard();
}

function resetViewDirection() {
	viewDirection = null;
	updateBoard();
}

function lockViewDirection() {
	viewDirection = getViewDirection();
	updateBoard();
}

function getViewDirection(): Color {
	if(viewDirection == null)
		return turn;
	return viewDirection;
}

//check if a move 'move' is available this turn; return the actual move to be taken (may change move.type field) or null if not available
function moveAvailable(move: Move): (Move|null) {
	for(let i = 0; i < moves.length; i++) {
		let test = moves[i];
		if(test.from.x == move.from.x && test.from.y == move.from.y && test.to.x == move.to.x && test.to.y == move.to.y) {
			return test;
		}
	}
	return null;
}