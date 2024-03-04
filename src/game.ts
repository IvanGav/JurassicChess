interface ChessPiece {
	type: Piece;
	color: Color;
	x: number;
	y: number;
	uid?: string; //id of an html element which represents this piece
	htmlPiece?: HTMLElement; //the actual html element corresponding to this piece; this file completely doesn't care about it
}

enum Piece {
	Pawn = 1,
	Knight = 2,
	Bishop = 3,
	Rook = 4,
	Queen = 5,
	King  = 6,
}

enum Color {
	Black = -1,
	White = 1,
}

//board[0][0] = a1; board[7][0] = a8; board[0][7] = h1; board[7][7] = h8
var board: ChessPiece[][] = [];
var selected: ChessPiece = null;
var turn: Color = Color.White;

//reset the game position
function initBoard() {
	console.log("Resetting the board...")
	turn = Color.White;
	selected = null;
	board = [];
	for(let y = 0; y < 8; y++) {
		board.push([]);
		for(let x = 0; x < 8; x++) {
			board[y].push(null);
		}
	}
	console.log(board);
	board[0][0] = {type: Piece.Rook, color: Color.White, x: 0, y: 0};
	board[0][1] = {type: Piece.Knight, color: Color.White, x: 1, y: 0};
	board[0][2] = {type: Piece.Bishop, color: Color.White, x: 2, y: 0};
	board[0][3] = {type: Piece.Queen, color: Color.White, x: 3, y: 0};
	board[0][4] = {type: Piece.King, color: Color.White, x: 4, y: 0};
	board[0][5] = {type: Piece.Bishop, color: Color.White, x: 5, y: 0};
	board[0][6] = {type: Piece.Knight, color: Color.White, x: 6, y: 0};
	board[0][7] = {type: Piece.Rook, color: Color.White, x: 7, y: 0};

	board[1][0] = {type: Piece.Pawn, color: Color.White, x: 0, y: 1};
	board[1][1] = {type: Piece.Pawn, color: Color.White, x: 1, y: 1};
	board[1][2] = {type: Piece.Pawn, color: Color.White, x: 2, y: 1};
	board[1][3] = {type: Piece.Pawn, color: Color.White, x: 3, y: 1};
	board[1][4] = {type: Piece.Pawn, color: Color.White, x: 4, y: 1};
	board[1][5] = {type: Piece.Pawn, color: Color.White, x: 5, y: 1};
	board[1][6] = {type: Piece.Pawn, color: Color.White, x: 6, y: 1};
	board[1][7] = {type: Piece.Pawn, color: Color.White, x: 7, y: 1};
	
	board[7][0] = {type: Piece.Rook, color: Color.Black, x: 0, y: 7};
	board[7][1] = {type: Piece.Knight, color: Color.Black, x: 1, y: 7};
	board[7][2] = {type: Piece.Bishop, color: Color.Black, x: 2, y: 7};
	board[7][3] = {type: Piece.Queen, color: Color.Black, x: 3, y: 7};
	board[7][4] = {type: Piece.King, color: Color.Black, x: 4, y: 7};
	board[7][5] = {type: Piece.Bishop, color: Color.Black, x: 5, y: 7};
	board[7][6] = {type: Piece.Knight, color: Color.Black, x: 6, y: 7};
	board[7][7] = {type: Piece.Rook, color: Color.Black, x: 7, y: 7};

	board[6][0] = {type: Piece.Pawn, color: Color.Black, x: 0, y: 6};
	board[6][1] = {type: Piece.Pawn, color: Color.Black, x: 1, y: 6};
	board[6][2] = {type: Piece.Pawn, color: Color.Black, x: 2, y: 6};
	board[6][3] = {type: Piece.Pawn, color: Color.Black, x: 3, y: 6};
	board[6][4] = {type: Piece.Pawn, color: Color.Black, x: 4, y: 6};
	board[6][5] = {type: Piece.Pawn, color: Color.Black, x: 5, y: 6};
	board[6][6] = {type: Piece.Pawn, color: Color.Black, x: 6, y: 6};
	board[6][7] = {type: Piece.Pawn, color: Color.Black, x: 7, y: 6};

	//init uid for every piece
	let count = 0;
	for(let y = 0; y < 8; y++) {
		for(let x = 0; x < 8; x++) {
			if(board[y][x] != null) {
				board[y][x].uid = `${count}`;
				count++;
			}
		}
	}
}

//remove a given piece
function capturePiece(piece: ChessPiece) {
	board[piece.y][piece.x] = null;
}

//no move legality checking, just move a given piece to a given position
function movePiece(piece: ChessPiece, x: number, y: number) {
	board[y][x] = piece;
	board[piece.y][piece.x] = null;
	piece.x = x;
	piece.y = y;
}

//true means that the position (x,y) can be attacked (moved to, and perhaps capture) by a 'piece'; false means 'piece' can't move to that position
function attack(piece: ChessPiece, x: number, y: number): boolean {
	//assume that x, y will never be out of bounds (since it's impossible with clicking)
	switch(piece.type) {
		case Piece.Pawn: {
			if(piece.color == Color.White) {
				//move 2 up
			} else {
				//move 2 up
			}
		}
	}
	return false;
}