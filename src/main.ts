const BOARD_DIV_ID = "board_div";
const BOARD_ID = "board";
const GAME_STATUS_ID = "game_status";
const PIECE_CLASS = "piece";
const SELECTED_CLASS = "selected";
const BOARD_SIZE = 600;
const CELL_SIZE = BOARD_SIZE/8;

const board_div: HTMLElement = document.getElementById(BOARD_DIV_ID)!;

//of view_direction is not null, it overwrites the 'turn' view
var view_direction: (Color|null) = null;
var htmlPieces: HTMLElement[] = [];
var moves: Move[] = [];

/*
	board initialization functions
*/

//init game
function initGame() {
	initBoard();
	placeBoard();
	for(let i = 0; i < pieces.length; i++)
		addPiece(i);
	setCallbacks(/* on promotion: */ (piece: number) => {
		removePiece(piece);
		addPiece(piece);
    }, /* on capture: */ (piece: number) => {
		removePiece(piece);
    });
	moves = allMoves();
}

//put a board into BOARD_DIV_ID div
function placeBoard() {
	board_div.replaceChildren(createBoard());
}

//return a new board image
function createBoard(): HTMLElement {
	let image = getImg("https://assets-themes.chess.com/image/9rdwe/200.png", "board image", BOARD_ID, [], null);
	image.addEventListener("click", getClickPosition, false);
	return image;
}

//gets called for every click on board
function getClickPosition(this: HTMLElement, ev: MouseEvent) {
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
	board_div.appendChild(htmlPiece);
}

//get an img div with given arguments
function getImg(src: string, ifLoadFails: string = "image", id: (string|null) = null, classList: string[] = [], onClick: (null|(() => void)) = null): HTMLElement {
	let image = document.createElement("img");
	image.src = src; //i hate it, but i can just ignore the null 'src', it'll work just fine, ugh, my Java|Kotlin|C++|C brain hurts
	image.alt = ifLoadFails;
	if(id != null) image.id = id;
	if(classList.length > 0)
		for(let i = 0; i < classList.length; i++)
			image.classList.add(classList[i]);
	if(onClick != null)
		image.onclick = onClick;
	return image;
}

//get image for a specified piece and color
function getPieceImage(piece: Piece, color: Color): string {
	switch(piece) {
		case Piece.Pawn: {
			if(color == Color.Black)
				return "https://assets-themes.chess.com/image/ejgfv/150/bp.png";
			else
				return "https://assets-themes.chess.com/image/ejgfv/150/wp.png";
		}
		case Piece.Knight: {
			if(color == Color.Black)
				return "https://assets-themes.chess.com/image/ejgfv/150/bn.png";
			else
				return "https://assets-themes.chess.com/image/ejgfv/150/wn.png";
		}
		case Piece.Bishop: {
			if(color == Color.Black)
				return "https://assets-themes.chess.com/image/ejgfv/150/bb.png";
			else
				return "https://assets-themes.chess.com/image/ejgfv/150/wb.png";
		}
		case Piece.Rook: {
			if(color == Color.Black)
				return "https://assets-themes.chess.com/image/ejgfv/150/br.png";
			else
				return "https://assets-themes.chess.com/image/ejgfv/150/wr.png";
		}
		case Piece.Queen: {
			if(color == Color.Black)
				return "https://assets-themes.chess.com/image/ejgfv/150/bq.png";
			else
				return "https://assets-themes.chess.com/image/ejgfv/150/wq.png";
		}
		case Piece.King: {
			if(color == Color.Black)
				return "https://assets-themes.chess.com/image/ejgfv/150/bk.png";
			else
				return "https://assets-themes.chess.com/image/ejgfv/150/wk.png";
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
	    htmlPiece.style.left = p.x*CELL_SIZE + "px";
		htmlPiece.style.top = (BOARD_SIZE - (p.y + 1)*CELL_SIZE) + "px";
    } else {
	    htmlPiece.style.left = (BOARD_SIZE - (p.x + 1)*CELL_SIZE) + "px";
		htmlPiece.style.top = p.y*CELL_SIZE + "px";
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

//remove an associated html and a board piece 'piece'
function removePiece(piece: number) {
	board_div.removeChild(htmlPieces[piece]);
}

//this function gets called for every clicked piece
function pieceClicked(piece: number) {
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
		if(selected == NONE) return; //ERROR: comparing to null isntead of NONE
		let s = pieces[selected]!;
		let move = moveAvailable({from: {x: s.x, y: s.y}, to: {x: p.x, y: p.y}});
		if(move != null) {
			//can move to (piece.x,piece.y) -> can capture
			makeMove(selected, move.to);
			nextTurn();
			moves = allMoves();
			updateBoard(); // because it may turn
			checkWinner();
		}
		deselect();
	}
}

//this function gets called for every square on board that's clicked
function boardClicked(x: number, y: number) {
	if(selected == NONE) return; //ERROR: comparing to null isntead of NONE
	let s = pieces[selected]!;
	let move = moveAvailable({from: {x: s.x, y: s.y}, to: {x: x, y: y}});
	if(move != null) {
		//can move to (x,y) and it's empty
		makeMove(selected, move.to);
		nextTurn();
		moves = allMoves();
		updateBoard(); // because it may turn
		checkWinner();
	}
	deselect();
}

function checkWinner() {
	if(updateGameState(moves)) {
		//if the game has ended
		if(gameState == GameState.Brutality) {
			document.getElementById(GAME_STATUS_ID)!.innerText = (winner == Color.White ? "White has demolished Black" : "Black has demolished White");
		} else if(gameState == GameState.Checkmate) {
			document.getElementById(GAME_STATUS_ID)!.innerText = (winner == Color.White ? "White has won" : "Black has won");
		} else if(gameState == GameState.Stalemate) {
			document.getElementById(GAME_STATUS_ID)!.innerText = "Stalemate";
		} else if(gameState == GameState.InsufficientMaterial) {
			document.getElementById(GAME_STATUS_ID)!.innerText = "Draw by insufficient material";
		}
	}
}

//currently playing side is resigning
function resign() {
	winner = (turn == Color.White ? Color.Black : Color.White);
	document.getElementById(GAME_STATUS_ID)!.innerText = winner == Color.White ? "White won" : "Black won";
}

/*
	board orientation functions
*/

function toggleViewDirection() {
	view_direction = _opposite(getViewDirection());
	updateBoard();
}

function resetViewDirection() {
	view_direction = null;
	updateBoard();
}

function lockViewDirection() {
	view_direction = getViewDirection();
	updateBoard();
}

function getViewDirection(): Color {
	if(view_direction == null)
		return turn;
	return view_direction;
}

//check if a move 'move' is available this turn; return the actual move to be taken (may change move.type field) or null if not available
function moveAvailable(move: Move): (Move|null) {
	for(let i = 0; i < moves.length; i++) {
		let test = moves[i];
		if(test.from.x == move.from.x && test.from.y == move.from.y && test.to.x == move.to.x && test.to.y == move.to.y) { //ERROR: the last condition was testing 'from' and not 'to'
			return test;
		}
	}
	return null;
}