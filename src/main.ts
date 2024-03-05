const BOARD_DIV_ID = "board_div";
const BOARD_ID = "board";
const PIECE_CLASS = "piece";
const SELECTED_CLASS = "selected";
const CELL_SIZE = 75;
const BOARD_SIZE = 600;

const board_div: HTMLElement = document.getElementById(BOARD_DIV_ID)!;
var board_img: HTMLElement;

//of view_direction is not null, it overwrites the 'turn' view
var view_direction: (Color|null) = null;

function test() {
	kingInCheck(wk!);
}

/*
	board initialization functions
*/

//init game
function initGame() {
	console.log("Initializing the game...");
	initBoard();
	placeBoard();
	console.log("Adding pieces...");
	for(let y = 0; y < 8; y++)
		for(let x = 0; x < 8; x++)
			if(board[y][x] != null)
				addPiece(board[y][x]!);
    promotionCallback = (piece: ChessPiece) => {
        piece.htmlPiece = getImg(getPieceImage(piece.type, piece.color), "chess_piece", piece.uid, ["piece"], () => pieceClicked(piece));
    }
}

//put a board into BOARD_DIV_ID div
function placeBoard() {
	console.log("Placing the board...");
	board_div.replaceChildren(createBoard());
	board_img = document.getElementById(BOARD_ID)!;
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
function addPiece(piece: ChessPiece) {
	let htmlPiece = getImg(getPieceImage(piece.type, piece.color), "chess_piece", piece.uid, ["piece"], () => pieceClicked(piece));
	piece.htmlPiece = htmlPiece;
	updatePiecePosition(piece);
	board_div.appendChild(htmlPiece);
}

//get an img div with given arguments
function getImg(src: string, ifLoadFails: string = "image", id: (string|null) = null, classList: string[] = [], onClick: (null|(() => void)) = null): HTMLElement {
	let image = document.createElement("img");
	image.src = src; //i hate it, but i can just ignore the null 'src', it'll work just fine, ugh, my Java|Kotlin|C++|C brain hurts
	image.alt = ifLoadFails;
	if(id != null) image.id = id; //i'm not even sure if this is nessesary CHECK!!!
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
function updatePiecePosition(piece: ChessPiece) {
	if(getViewDirection() == Color.White) {
	    piece.htmlPiece!.style.left = piece.x*CELL_SIZE + "px";
		piece.htmlPiece!.style.top = (BOARD_SIZE - (piece.y + 1)*CELL_SIZE) + "px";
    } else {
	    piece.htmlPiece!.style.left = (BOARD_SIZE - (piece.x + 1)*CELL_SIZE) + "px";
		piece.htmlPiece!.style.top = piece.y*CELL_SIZE + "px";
    }
}

//deselect the currently selected (if any) piece (both html and variable)
function deselect() {
	if(selected != null) {
		selected.htmlPiece!.classList.remove("selected");
	}
	selected = null;
}

//select a piece (both html and variable) (deselect if anything is selected)
function select(piece: ChessPiece) {
	deselect();
	piece.htmlPiece!.classList.add("selected");
	selected = piece;
}

//will completely ignore captured pieces; fully update the state of the board
function updateBoard() {
    //it doesn't even need to be rotated i'm stupid XD
	// if(getViewDirection() == Color.White)
	// 	board_img.classList.remove("flip");
	// else
	// 	board_img.classList.add("flip");
	for(let y = 0; y < 8; y++) {
		for(let x = 0; x < 8; x++) {
			if(board[y][x] != null) {
				updatePiecePosition(board[y][x]!);
			}
		}
	}
}

//remove an associated html and a board piece 'piece'
function removePiece(piece: ChessPiece) {
	board_div.removeChild(piece.htmlPiece!);
	capturePiece(piece);
}

//this function gets called for every clicked piece
function pieceClicked(piece: ChessPiece) {
	// console.log(`clicked on a piece at x = ${piece.x}, y = ${piece.y}, direction = ${getViewDirection()}`);
	if(piece.color == turn) {
		//clicking on your piece
		if(selected == piece) {
			deselect();
		} else {
			select(piece);
		}
	} else {
		//clicking on opponent piece
		if(selected == null) return;
		if(attack(selected, piece.x, piece.y)) {
			//can move to (piece.x,piece.y) -> can capture
			removePiece(piece);
			movePiece(selected, piece.x, piece.y);
			nextTurn();
			// updatePiecePosition(selected);
			updateBoard(); // because it may turn
		}
		deselect();
	}
}

//this function gets called for every square on board that's clicked
function boardClicked(x: number, y: number) {
	// console.log(`clicked on board at x = ${x}, y = ${y}, direction = ${getViewDirection()}`);
	if(selected == null) return;
	if(attack(selected, x, y)) {
		//can move to (x,y) and it's empty
		movePiece(selected, x, y);
		nextTurn();
		// updatePiecePosition(selected);
		updateBoard(); // because it may turn
	}
	deselect();
}

/*
	board orientation functions
*/

function toggleViewDirection() {
	if(view_direction == null) {
		if(turn == Color.White)
			view_direction = Color.Black;
		else
			view_direction = Color.White;
	} else if(view_direction == Color.White) {
		view_direction = Color.Black;
	} else {
		view_direction = Color.White;
	}
	updateBoard();
}

function resetViewDirection() {
	view_direction = null;
	updateBoard();
}

function getViewDirection(): Color {
	if(view_direction == null)
		return turn;
	return view_direction
}