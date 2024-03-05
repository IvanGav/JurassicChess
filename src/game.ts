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
var board: (ChessPiece|null)[][] = [];
var selected: (ChessPiece|null) = null;
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
				board[y][x]!.uid = `${count}`;
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
            let startRank = (piece.color == Color.White) ? 1 : 6;
            let moveDirection = (piece.color == Color.White) ? 1 : -1;
            if(piece.x == x) {
                //move
                if(board[piece.y+moveDirection][x] != null) return false; //right in front is obstructed
                //if the move is 1 up
                if((piece.y+moveDirection) == y)
                    return true;
                //move 2 up from startRank
                if(piece.y == startRank && (piece.y+moveDirection*2) == y) {
                    if(board[piece.y+moveDirection*2][x] == null)
                        return true;
                }
            } else {
                //capture
                if(piece.y+moveDirection != y) return false;
                if(piece.x+1 == x || piece.x-1 == x) {
                    if(board[y][x] != null && board[y][x]?.color != piece.color)
                        return true;
                }
            }
            return false;
		}
        case Piece.Knight: {
            return canKnightMove(piece, x, y);
        }
        case Piece.Bishop: {
            return (distDiagonal(piece, x, y) > 0);
        }
        case Piece.Rook: {
            return (distStraight(piece, x, y) > 0);
        }
        case Piece.Queen: {
            return (distDiagonal(piece, x, y) > 0 || distStraight(piece, x, y) > 0);
        }
        case Piece.King: {
            return (distDiagonal(piece, x, y) == 1 || distStraight(piece, x, y) == 1);
        }
	}
	return false;
}

//return number of squares that a 'piece' has to travel in a straight line to reach (x,y); if can't be reached, return -1
function distStraight(piece: ChessPiece, x: number, y: number): number {
    if(piece.x == x) {
        //on the same vertical line
        if(piece.y > y) {
            //(x,y) is below the piece (if up is white, 0)
            for(let dy = -1; piece.y+dy != y; dy--) {
                if(board[piece.y+dy][x] != null) {
                    return -1;
                }
            }
            //still have to check the landing square
            if(board[y][x] != null) {
                if(board[y][x]?.color == piece.color)
                    return -1;
                else
                    return (piece.y-y);
            }
            return (piece.y-y);
        } else {
            //(x,y) is above the piece (if down is black, 7)
            for(let dy = 1; piece.y+dy != y; dy++) {
                if(board[piece.y+dy][x] != null) {
                    return -1;
                }
            }
            //still have to check the landing square
            if(board[y][x] != null) {
                if(board[y][x]?.color == piece.color)
                    return -1;
                else
                    return (y-piece.y);
            }
            return (y-piece.y);
        }
    } else if(piece.y == y) {
        //on the same horizontal line
        if(piece.x > x) {
            //(x,y) is to the left of the piece (if left is white's queen side)
            for(let dx = -1; piece.x+dx != x; dx--) {
                if(board[y][piece.x+dx] != null) {
                    return -1;
                }
            }
            //still have to check the landing square
            if(board[y][x] != null) {
                if(board[y][x]?.color == piece.color)
                    return -1;
                else
                    return (piece.x-x);
            }
            return (piece.x-x);
        } else {
            //(x,y) is to the right of the piece (if right is white's king side)
            for(let dx = 1; piece.x+dx != x; dx++) {
                if(board[y][piece.x+dx] != null) {
                    return -1;
                }
            }
            //still have to check the landing square
            if(board[y][x] != null) {
                if(board[y][x]?.color == piece.color)
                    return -1;
                else
                    return (x-piece.x);
            }
            return (x-piece.x);
        }
    }
    return -1;
}

//return number of squares that a 'piece' has to travel in a diagonal line to reach (x,y); if can't be reached, return -1
function distDiagonal(piece: ChessPiece, x: number, y: number): number {
    let dx = piece.x-x;
    let dy = piece.y-y;
    if(Math.abs(dx) != Math.abs(dy)) return -1;
    if(dx > 0) {
        if(dy > 0) {
            //(x,y) is to the top left of piece
            for(let i = 1; i < dx; i++) {
                if(board[piece.x-i][piece.y-i] != null)
                    return -1;
            }
            //still check the landing square for availability
            if(board[y][x] != null) {
                if(board[y][x]?.color == piece.color)
                    return -1;
                else
                    return dx;
            }
            return dx;
        } else {
            //(x,y) is to the bottom left of piece
            for(let i = 1; i < dx; i++) {
                if(board[piece.x-i][piece.y+i] != null)
                    return -1;
            }
            //still check the landing square for availability
            if(board[y][x] != null) {
                if(board[y][x]?.color == piece.color)
                    return -1;
                else
                    return dx;
            }
            return dx;
        }
    } else {
        if(dy > 0) {
            //(x,y) is to the top right of piece
            for(let i = 1; i < -dx; i++) {
                if(board[piece.x+i][piece.y-i] != null)
                    return -1;
            }
            //still check the landing square for availability
            if(board[y][x] != null) {
                if(board[y][x]?.color == piece.color)
                    return -1;
                else
                    return -dx;
            }
            return -dx;
        } else {
            //(x,y) is to the bottom right of piece
            for(let i = 1; i < -dx; i++) {
                if(board[piece.x+i][piece.y+i] != null)
                    return -1;
            }
            //still check the landing square for availability
            if(board[y][x] != null) {
                if(board[y][x]?.color == piece.color)
                    return -1;
                else
                    return -dx;
            }
            return -dx;
        }
    }
    return -1;
}

//return true if a 'piece' can move to (x,y) with a knight move 
function canKnightMove(piece: ChessPiece, x: number, y: number): boolean {
    if(piece.x > x) {
        //(x,y) is up from piece
        if(piece.y > y) {
            //(x,y) is to the top left of piece
            if(piece.x-2 == x && piece.y-1 == y) return true;
            if(piece.x-1 == x && piece.y-2 == y) return true;
        } else {
            //(x,y) is to the bottom left of piece
            if(piece.x-2 == x && piece.y+1 == y) return true;
            if(piece.x-1 == x && piece.y+2 == y) return true;
        }
    } else {
        if(piece.y > y) {
            //(x,y) is to the top right of piece
            if(piece.x+2 == x && piece.y-1 == y) return true;
            if(piece.x+1 == x && piece.y-2 == y) return true;
        } else {
            //(x,y) is to the bottom right of piece
            if(piece.x+2 == x && piece.y+1 == y) return true;
            if(piece.x+1 == x && piece.y+2 == y) return true;
        }
    }
    return false;
}

//return if this move is legal in terms of mate and en passant (it's higher than check in priority)
function moveLegal(piece: ChessPiece, x: number, y: number): boolean {
    return true;
}