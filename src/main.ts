//TODO: update title based on a variant

const GAME_DIV_ID = "game_div";
const BOARD_DIV_ID = "board_div";
const MOVES_DIV_ID = "moves_div";
const PIECES_DIV_ID = "pieces_div";
const BOARD_ID = "board";
const AGREE_DRAW_ID = "agree_draw";
const AGREE_DRAW_COUNT_ID = "agree_draw_count";
const GAME_STATUS_ID = "game_status";
const TURN_STATUS_ID = "turn_status";
const MOVES_RECORD_ID = "moves";
const PIECE_CLASS = "piece";
const SELECTED_CLASS = "selected";

// const PLAYERS = 7;
// const DRAW_VOTE_REQUIRED = 5; //5 out of 7 people have to vote for the game to be a draw

var VARIANT_CURRENT = -1;

var PLAYERS = 2;
var DRAW_VOTE_REQUIRED = 2;
var BOARD_CELLS = 8;

var BOARD_SIZE = 600;
var CELL_SIZE = BOARD_SIZE/BOARD_CELLS;

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

//callbacks
var gameEndCallback: ()=>void;

/*
	board initialization functions
*/

function setCallbacksMain(gameEndCallBack: (()=>void)) {
	gameEndCallback = gameEndCallBack;
}

//init game
function initGame(variant: number) {
	removeBoard();
	initBoard(variant);
	VARIANT_CURRENT = variant;

	placeBoard();
	placeMovesIndicatorsDiv();
	putPieces();

	updateBoardSize();
	clearMoveRecord();
	updateTurnStatus();

	setCallbacksGame(/* on promotion: */ (piece: number) => {
		removePiece(piece, document.getElementById(PIECES_DIV_ID)!);
		addPiece(piece, document.getElementById(PIECES_DIV_ID)!);
	}, /* on capture: */ (piece: number) => {
		removePiece(piece, document.getElementById(PIECES_DIV_ID)!);
	});

	moves = allMoves();
	viewDirection = null;
	player = 0;
	playersDrawAgreedCount = 0;
	timers = [];
	playersDrawAgreed = [];
	for(let i = 0; i < PLAYERS; i++) {
		timers.push(timeControl*1000);
		playersDrawAgreed.push(false);
	}
}

function removeBoard() {
	document.getElementById(GAME_DIV_ID)!.innerHTML = "";

}

function updateBoardSize() {
	let height = document.getElementById(BOARD_ID)?.offsetHeight;
	if(height == undefined) return;
	BOARD_SIZE = height;
	CELL_SIZE = BOARD_SIZE/8;
}

function placeBoard() {
	let board_div = document.createElement("div");
	board_div.id = BOARD_DIV_ID;
	board_div.appendChild(createBoard());
	document.getElementById(GAME_DIV_ID)!.appendChild(board_div);
}

//return a new board image
function createBoard(): HTMLElement {
	let image = getImg("images/200.png", "board image", BOARD_ID, [], () => deselect());
	return image;
}

function placeMovesIndicatorsDiv() {
	let moves_div = document.createElement("div");
	moves_div.id = MOVES_DIV_ID;
	document.getElementById(GAME_DIV_ID)!.appendChild(moves_div);
}

function putPieces() {
	let pieces_div = document.createElement("div");
	pieces_div.id = PIECES_DIV_ID;
	for(let i = 0; i < pieces.length; i++)
		addPiece(i, pieces_div);
	document.getElementById(GAME_DIV_ID)!.appendChild(pieces_div);
}

//add a piece html to the board and set the 'htmlPiece' property of 'piece' (on click it the html piece will update the 'selected' variable)
function addPiece(piece: number, board: HTMLElement) {
	let p = pieces[piece]!;
	let htmlPiece = getImg(getPieceImage(p.type, p.color), "chess_piece", piece.toString(10), ["piece"], () => pieceClicked(piece));
	htmlPieces[piece] = htmlPiece;
	updatePiecePosition(piece);
	board.appendChild(htmlPiece);
}

//remove an associated html and a board piece 'piece'
function removePiece(piece: number, board: HTMLElement) {
	board.removeChild(htmlPieces[piece]);
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
	Gameplay update functions
*/

function putMoveIndicators() {
	if(selected == NONE) return;
	let p = pieces[selected];
	if(p == null) return;

	for(let i = 0; i < moves.length; i++) {
		if(moves[i].from.x != p.x || moves[i].from.y != p.y) continue;
		let moveIndicator = getImg(moves[i].to.type == MoveType.Capture ? "images/can_capture.png" : "images/can_move.png", "move_indicator", null, ["move_indicator"], () => {
			boardClicked(moves[i].to.x, moves[i].to.y);
		});
		if(getViewDirection() == Color.White) {
			moveIndicator.style.left = `${moves[i].to.x*8.75}vh`;
			moveIndicator.style.top = `${(70 - (moves[i].to.y + 1)*8.75)}vh`;
		} else {
			moveIndicator.style.left = `${(70 - (moves[i].to.x + 1)*8.75)}vh`;
			moveIndicator.style.top = `${moves[i].to.y*8.75}vh`;
		}
		document.getElementById(MOVES_DIV_ID)?.appendChild(moveIndicator);
	}
}

function clearMoveIndicators() {
	let moveDiv = document.getElementById(MOVES_DIV_ID);
	if(moveDiv == null) return;
	moveDiv.innerHTML = "";
}

//update the position of the html piece attached to 'piece'
function updatePiecePosition(piece: number) {
	clearMoveIndicators();
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

//fully update the state of the board; will completely ignore captured pieces
function updateBoard() {
	putMoveIndicators();
	for(let i = 0; i < pieces.length; i++) {
		if(pieces[i] != null) {
			updatePiecePosition(i);
		}
	}
}

/*
	Dealing with piece/board clicks
*/

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
		recordMove(move);
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


/*
	Update visible game/turn status
*/

//display draw choice of currently playing player
function setDrawStatus() {
	let checkmark = document.getElementById(AGREE_DRAW_ID);
	// if(checkmark == null) return;
	let isChecked = (checkmark as HTMLInputElement).checked;
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

//call instead of updateGameState(moves)
function updateGameStatus() {
	if(updateGameState(moves, playersDrawAgreedCount >= DRAW_VOTE_REQUIRED)) {
		//if the game has ended
		let message: string;
		switch(gameState) {
			case GameState.AgreedDraw:				{ message = "Draw by agreement"; break; }
			case GameState.Brutality:				{ message = (winner == Color.White ? "White has demolished Black" : "Black has demolished White"); break; }
			case GameState.Checkmate:				{ message = (winner == Color.White ? "White has won" : "Black has won"); break; }
			case GameState.Going:					{ message = "ERROR: game is still going"; break; }
			case GameState.InsufficientMaterial:	{ message = "Draw by insufficient material"; break; }
			case GameState.None:					{ message = "ERROR: game is not active"; break; }
			case GameState.Stalemate:				{ message = "Stalemate"; break; }
		}
		gameEndCallback();
		setGameStatus(message);
	}
}

function setGameStatus(message: string) {
	let status = document.getElementById(GAME_STATUS_ID);
	if(status == null) return;
	status.innerText = message;
}

function setPlayerDrawOffer(player: number, offeringDraw: boolean) {
	playersDrawAgreed[player] = offeringDraw;
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

/*
	Helper functions
*/

//deselect the currently selected (if any) piece (both html and variable)
function deselect() {
	if(selected != NONE) {
		htmlPieces[selected].classList.remove("selected");
	}
	selected = NONE;
	clearMoveIndicators();
}

//select a piece (both html and variable) (deselect if anything is selected)
function select(piece: number) {
	deselect();
	htmlPieces[piece].classList.add("selected");
	selected = piece;
	putMoveIndicators();
}

//should be called instead of 'nextTurn'
function passTurnToNextPlayer() {
	nextTurn();
	player++;
	if(player == PLAYERS) player = 0;
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

/*
	Recording moves and retrieving recorded moves
*/

var rank = [1,2,3,4,5,6,7,8];
var file = ["a","b","c","d","e","f","g","h"];
var pieceLetter = [undefined, "","N","B","R","Q",/*,"K",*/"H","P","R","T","D"];

//call after the move happens, but before the turn is passed to the next player
function recordMove(move: Move) {
	document.getElementById(MOVES_RECORD_ID)!.innerHTML += getMoveNotation(move) + "; ";
}

function getMoveRecord(): string {
	let moves_div = document.getElementById(MOVES_RECORD_ID);
	if(moves_div == null) return "ERROR: moves div doesn't exist";
	return moves_div.innerHTML;
}

//overwrite current move record, if available, with a givent value
function writeMoveRecord(moveRecord: string) {
	document.getElementById(MOVES_RECORD_ID)!.innerHTML = moveRecord;
}

//clear move record, if available
function clearMoveRecord() {
	document.getElementById(MOVES_RECORD_ID)!.innerHTML = "";
}

//given a move, get its algebraic-like notation (must be called before the move is made)
function getMoveNotation(move: Move): string {
	if(move.to.type == MoveType.ShortCastle) return "0-0";
	if(move.to.type == MoveType.LongCastle) return "0-0-0";

	let p = pieceAt(move.from);
	if(p == null) return "ERROR: moved piece doesn't exist";

	let notation: string = "";

	notation += pieceLetter[p.type];
	notation += file[move.from.x];
	notation += rank[move.from.y];
	
	if(move.to.type == MoveType.Capture || move.to.type == MoveType.EnPassant) notation += "x";

	notation += file[move.to.x];
	notation += rank[move.to.y];
	
	if(move.to.promotion_to != undefined) {
		notation += pieceLetter[move.to.promotion_to];
		// notation.substring(1);
	}

	return notation;
}