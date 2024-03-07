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

//Attack squares detection options; combine options with | or +
const A_EXCLUDE_EMPTY = 1; //don't add empty attacked cells (useful when detecting checks or pawn captures)
const A_EXCLUDE_CAPTURES = 2; //don't add attacked cells with enemy pieces (useful when detecting pawn movement)

//board[0][0] = a1; board[7][0] = a8; board[0][7] = h1; board[7][7] = h8
var board: (ChessPiece|null)[][] = [];
var selected: (ChessPiece|null) = null;
var turn: Color = Color.White;
var promotionPiece: Piece = Piece.Queen;
var promotionCallback: (((piece:ChessPiece)=>void)|null) = null; //set up before the game begins (optional)

var wking: (ChessPiece|null) = null;
var wpieces: ChessPiece[] = []; //stores all white pieces excluding king
var bking: (ChessPiece|null) = null;
var bpieces: ChessPiece[] = []; //stores all black pieces excluding king

var winner: (Color|null) = null;
var brutality: boolean = false; //is set to true whenever a king is captured

/*
    init functions
*/

//reset the game position
function initBoard() {
	console.log("Resetting the board...")
	turn = Color.White;
	selected = null;
	board = [];
    wking = null;
    wpieces = [];
    bking = null;
    bpieces = [];
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
    
    wpieces.push(board[0][0]);
    wpieces.push(board[0][1]);
    wpieces.push(board[0][2]);
    wpieces.push(board[0][3]);
    wking = board[0][4];
    wpieces.push(board[0][5]);
    wpieces.push(board[0][6]);
    wpieces.push(board[0][7]);

	board[1][0] = {type: Piece.Pawn, color: Color.White, x: 0, y: 1};
	board[1][1] = {type: Piece.Pawn, color: Color.White, x: 1, y: 1};
	board[1][2] = {type: Piece.Pawn, color: Color.White, x: 2, y: 1};
	board[1][3] = {type: Piece.Pawn, color: Color.White, x: 3, y: 1};
	board[1][4] = {type: Piece.Pawn, color: Color.White, x: 4, y: 1};
	board[1][5] = {type: Piece.Pawn, color: Color.White, x: 5, y: 1};
	board[1][6] = {type: Piece.Pawn, color: Color.White, x: 6, y: 1};
	board[1][7] = {type: Piece.Pawn, color: Color.White, x: 7, y: 1};

    wpieces.push(board[1][0]);
    wpieces.push(board[1][1]);
    wpieces.push(board[1][2]);
    wpieces.push(board[1][3]);
    wpieces.push(board[1][4]);
    wpieces.push(board[1][5]);
    wpieces.push(board[1][6]);
    wpieces.push(board[1][7]);
	
	board[7][0] = {type: Piece.Rook, color: Color.Black, x: 0, y: 7};
	board[7][1] = {type: Piece.Knight, color: Color.Black, x: 1, y: 7};
	board[7][2] = {type: Piece.Bishop, color: Color.Black, x: 2, y: 7};
	board[7][3] = {type: Piece.Queen, color: Color.Black, x: 3, y: 7};
	board[7][4] = {type: Piece.King, color: Color.Black, x: 4, y: 7};
	board[7][5] = {type: Piece.Bishop, color: Color.Black, x: 5, y: 7};
	board[7][6] = {type: Piece.Knight, color: Color.Black, x: 6, y: 7};
	board[7][7] = {type: Piece.Rook, color: Color.Black, x: 7, y: 7};
    
    bpieces.push(board[7][0]);
    bpieces.push(board[7][1]);
    bpieces.push(board[7][2]);
    bpieces.push(board[7][3]);
    bking = board[7][4];
    bpieces.push(board[7][5]);
    bpieces.push(board[7][6]);
    bpieces.push(board[7][7]);

	board[6][0] = {type: Piece.Pawn, color: Color.Black, x: 0, y: 6};
	board[6][1] = {type: Piece.Pawn, color: Color.Black, x: 1, y: 6};
	board[6][2] = {type: Piece.Pawn, color: Color.Black, x: 2, y: 6};
	board[6][3] = {type: Piece.Pawn, color: Color.Black, x: 3, y: 6};
	board[6][4] = {type: Piece.Pawn, color: Color.Black, x: 4, y: 6};
	board[6][5] = {type: Piece.Pawn, color: Color.Black, x: 5, y: 6};
	board[6][6] = {type: Piece.Pawn, color: Color.Black, x: 6, y: 6};
	board[6][7] = {type: Piece.Pawn, color: Color.Black, x: 7, y: 6};
    
    bpieces.push(board[6][0]);
    bpieces.push(board[6][1]);
    bpieces.push(board[6][2]);
    bpieces.push(board[6][3]);
    bpieces.push(board[6][4]);
    bpieces.push(board[6][5]);
    bpieces.push(board[6][6]);
    bpieces.push(board[6][7]);

	//init uid for every piece
    //i am not using wpieces and bpieces, because i don't want to
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

/*
    game progression functions
*/

//remove a given piece
function capturePiece(piece: ChessPiece) {
	board[piece.y][piece.x] = null;
}

//no move legality checking, just move a given piece to a given position
function movePiece(piece: ChessPiece, x: number, y: number, useCallbackFunction: boolean = true) {
	board[y][x] = piece;
	board[piece.y][piece.x] = null;
	piece.x = x;
	piece.y = y;
    //promote
    if(piece.type == Piece.Pawn && (piece.y == 0 || piece.y == 7)) {
        piece.type = promotionPiece;
        if(useCallbackFunction && promotionCallback != null) promotionCallback(piece);
    }
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

//pass the board to the next player
function nextTurn() {
    if(turn == Color.White)
        turn = Color.Black;
    else
        turn = Color.White;
}

/*
    move legality helper functions
*/

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
    let dx = piece.x-x; //positive if attempt to go left (negative x)
    let dy = piece.y-y; //positive if attempt to go up (negative y) 
    if(Math.abs(dx) != Math.abs(dy)) return -1;
    if(dx > 0) {
        if(dy > 0) {
            //(x,y) is to the top left of piece
            for(let i = 1; i < dx; i++) {
                if(board[piece.y-i][piece.x-i] != null)
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
                if(board[piece.y+i][piece.x-i] != null)
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
                if(board[piece.y-i][piece.x+i] != null)
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
                if(board[piece.y+i][piece.x+i] != null)
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

/*
    all moves functions
*/

//return a list of all possible straight moves; for options, look for 'A_${name}'
function allStraight(piece: ChessPiece, options: number = 0): number[][] {
    let pos: number[][] = [];
    let x = -1, y = -1;
    //left
    for(x = piece.x-1; x >= 0 && board[piece.y][x] == null; x--)
        if((options & A_EXCLUDE_EMPTY) == 0) pos.push([x, piece.y]);
    if(x >= 0 && board[piece.y][x]?.color != piece.color)
        if((options & A_EXCLUDE_CAPTURES) == 0) pos.push([x, piece.y]);
    //right
    for(x = piece.x+1; x < 8 && board[piece.y][x] == null; x++)
        if((options & A_EXCLUDE_EMPTY) == 0) pos.push([x, piece.y]);
    if(x < 8 && board[piece.y][x]?.color != piece.color)
        if((options & A_EXCLUDE_CAPTURES) == 0) pos.push([x, piece.y]);
    //up
    for(y = piece.y-1; y >= 0 && board[y][piece.x] == null; y--)
        if((options & A_EXCLUDE_EMPTY) == 0) pos.push([piece.x, y]);
    if(y >= 0 && board[y][piece.x]?.color != piece.color)
        if((options & A_EXCLUDE_CAPTURES) == 0) pos.push([piece.x, y]);
    //down
    for(y = piece.y+1; y < 8 && board[y][piece.x] == null; y++)
        if((options & A_EXCLUDE_EMPTY) == 0) pos.push([piece.x, y]);
    if(y < 8 && board[y][piece.x]?.color != piece.color)
        if((options & A_EXCLUDE_CAPTURES) == 0) pos.push([piece.x, y]);
    return pos;
}

//return a list of all possible diagonal moves; for options, look for 'A_${name}'
function allDiagonal(piece: ChessPiece, options: number = 0): number[][] {
    let pos: number[][] = [];
    let x = -1, y = -1;
    //top left
    for(x = piece.x-1, y = piece.y-1; x >= 0 && y >= 0 && board[y][x] == null; x--, y--)
        if((options & A_EXCLUDE_EMPTY) == 0) pos.push([x, y]);
    if(x >= 0 && y >= 0 && board[y][x]?.color != piece.color)
        if((options & A_EXCLUDE_CAPTURES) == 0) pos.push([x, y]);
    //top right
    for(x = piece.x+1, y = piece.y-1; x < 8 && y >= 0 && board[y][x] == null; x++, y--)
        if((options & A_EXCLUDE_EMPTY) == 0) pos.push([x, y]);
    if(x < 8 && y >= 0 && board[y][x]?.color != piece.color)
        if((options & A_EXCLUDE_CAPTURES) == 0) pos.push([x, y]);
    //bottom left
    for(x = piece.x-1, y = piece.y+1; x >= 0 && y < 8 && board[y][x] == null; x--, y++)
        if((options & A_EXCLUDE_EMPTY) == 0) pos.push([x, y]);
    if(x >= 0 && y < 8 && board[y][x]?.color != piece.color)
        if((options & A_EXCLUDE_CAPTURES) == 0) pos.push([x, y]);
    //bottom right
    for(x = piece.x+1, y = piece.y+1; x < 8 && y < 8 && board[y][x] == null; x++, y++)
        if((options & A_EXCLUDE_EMPTY) == 0) pos.push([x, y]);
    if(x < 8 && y < 8 && board[y][x]?.color != piece.color)
        if((options & A_EXCLUDE_CAPTURES) == 0) pos.push([x, y]);
    return pos;
}

//return a list of all possible knight moves; for options, look for 'A_${name}'
function allKnight(piece: ChessPiece, options: number = 0): number[][] {
    let pos: number[][] = [];
    //left
    if(piece.x > 1) {
        //can move 2 squares left
        if(piece.y > 0) {
            //can move <<^
            if(!(
                board[piece.y-1][piece.x-2]?.color == piece.color ||
                ((options & A_EXCLUDE_EMPTY) != 0 && board[piece.y-1][piece.x-2] == null) ||
                ((options & A_EXCLUDE_CAPTURES) != 0 && board[piece.y-1][piece.x-2]?.color != piece.color)
            ))
                pos.push([piece.x-2, piece.y-1]);
        }
        if(piece.y < 7) {
            //can move <<v
            if(!(
                board[piece.y+1][piece.x-2]?.color == piece.color ||
                ((options & A_EXCLUDE_EMPTY) != 0 && board[piece.y+1][piece.x-2] == null) ||
                ((options & A_EXCLUDE_CAPTURES) != 0 && board[piece.y+1][piece.x-2]?.color != piece.color)
            ))
                pos.push([piece.x-2, piece.y+1]);
        }
    }
    if(piece.x > 0) {
        //can move 1 square left
        if(piece.y > 1) {
            //can move <^^
            if(!(
                board[piece.y-2][piece.x-1]?.color == piece.color ||
                ((options & A_EXCLUDE_EMPTY) != 0 && board[piece.y-2][piece.x-1] == null) ||
                ((options & A_EXCLUDE_CAPTURES) != 0 && board[piece.y-2][piece.x-1]?.color != piece.color)
            ))
                pos.push([piece.x-1, piece.y-2]);
        }
        if(piece.y < 6) {
            //can move <vv
            if(!(
                board[piece.y+2][piece.x-1]?.color == piece.color ||
                ((options & A_EXCLUDE_EMPTY) != 0 && board[piece.y+2][piece.x-1] == null) ||
                ((options & A_EXCLUDE_CAPTURES) != 0 && board[piece.y+2][piece.x-1]?.color != piece.color)
            ))
                pos.push([piece.x-1, piece.y+2]);
        }
    }
    //right
    if(piece.x < 6) {
        //can move 2 squares right
        if(piece.y > 0) {
            //can move >>^
            if(!(
                board[piece.y-1][piece.x+2]?.color == piece.color ||
                ((options & A_EXCLUDE_EMPTY) != 0 && board[piece.y-1][piece.x+2] == null) ||
                ((options & A_EXCLUDE_CAPTURES) != 0 && board[piece.y-1][piece.x+2]?.color != piece.color)
            ))
                pos.push([piece.x+2, piece.y-1]);
        }
        if(piece.y < 7) {
            //can move >>v
            if(!(
                board[piece.y+1][piece.x+2]?.color == piece.color ||
                ((options & A_EXCLUDE_EMPTY) != 0 && board[piece.y+1][piece.x+2] == null) ||
                ((options & A_EXCLUDE_CAPTURES) != 0 && board[piece.y+1][piece.x+2]?.color != piece.color)
            ))
                pos.push([piece.x+2, piece.y+1]);
        }
    } else if(piece.x < 7) {
        //can move 1 square right
        if(piece.y > 1) {
            //can move >^^
            if(!(
                board[piece.y-2][piece.x+1]?.color == piece.color ||
                ((options & A_EXCLUDE_EMPTY) != 0 && board[piece.y-2][piece.x+1] == null) ||
                ((options & A_EXCLUDE_CAPTURES) != 0 && board[piece.y-2][piece.x+1]?.color != piece.color)
            ))
                pos.push([piece.x+1, piece.y-2]);
        }
        if(piece.y < 6) {
            //can move >vv
            if(!(
                board[piece.y+2][piece.x+1]?.color == piece.color ||
                ((options & A_EXCLUDE_EMPTY) != 0 && board[piece.y+2][piece.x+1] == null) ||
                ((options & A_EXCLUDE_CAPTURES) != 0 && board[piece.y+2][piece.x+1]?.color != piece.color)
            ))
                pos.push([piece.x+1, piece.y+2]);
        }
    }
    return pos;
}

//return a list of all possible pawn moves; for options, look for 'A_${name}'
function allPawn(piece: ChessPiece, options: number = 0): number[][] {
    let pos: number[][] = [];
    let startRank = (piece.color == Color.White) ? 1 : 6;
    let moveDirection = (piece.color == Color.White) ? 1 : -1;
    if(piece.y+moveDirection < 0 || piece.y+moveDirection > 7) return [];
    //move
    if(board[piece.y+moveDirection][piece.x] == null && (options & A_EXCLUDE_EMPTY) == 0) {
        //right in front is not obstructed
        pos.push([piece.x, piece.y+moveDirection]);
        if(piece.y == startRank && board[piece.y+moveDirection*2][piece.x] == null) {
            pos.push([piece.x, piece.y+moveDirection*2]);
        }
    }
    //capture
    if((options & A_EXCLUDE_CAPTURES) == 0) {
        if(board[piece.y+moveDirection][piece.x+1] != null && board[piece.y+moveDirection][piece.x+1]!.color != piece.color)
            pos.push([piece.x+1, piece.y+moveDirection]);
        if(board[piece.y+moveDirection][piece.x-1] != null && board[piece.y+moveDirection][piece.x-1]!.color != piece.color)
            pos.push([piece.x-1, piece.y+moveDirection]);
    }
    return pos;
}

//return a list of all possible king moves; for options, look for 'A_${name}'
function allKing(piece: ChessPiece, options: number = 0): number[][] {
    let pos: number[][] = [];
    if((board[piece.y+1][piece.x] == null && (options & A_EXCLUDE_EMPTY) == 0) || 
        (board[piece.y+1][piece.x]?.color != piece.color && (options & A_EXCLUDE_CAPTURES) == 0))
        pos.push([piece.x, piece.y+1]);
    if((board[piece.y+1][piece.x+1] == null && (options & A_EXCLUDE_EMPTY) == 0) || 
        (board[piece.y+1][piece.x+1]?.color != piece.color && (options & A_EXCLUDE_CAPTURES) == 0))
        pos.push([piece.x+1, piece.y+1]);
    if((board[piece.y][piece.x+1] == null && (options & A_EXCLUDE_EMPTY) == 0) || 
        (board[piece.y][piece.x+1]?.color != piece.color && (options & A_EXCLUDE_CAPTURES) == 0))
        pos.push([piece.x+1, piece.y]);
    if((board[piece.y-1][piece.x+1] == null && (options & A_EXCLUDE_EMPTY) == 0) || 
        (board[piece.y-1][piece.x+1]?.color != piece.color && (options & A_EXCLUDE_CAPTURES) == 0))
        pos.push([piece.x+1, piece.y-1]);
    if((board[piece.y-1][piece.x] == null && (options & A_EXCLUDE_EMPTY) == 0) || 
        (board[piece.y-1][piece.x]?.color != piece.color && (options & A_EXCLUDE_CAPTURES) == 0))
        pos.push([piece.x, piece.y-1]);
    if((board[piece.y-1][piece.x-1] == null && (options & A_EXCLUDE_EMPTY) == 0) || 
        (board[piece.y-1][piece.x-1]?.color != piece.color && (options & A_EXCLUDE_CAPTURES) == 0))
        pos.push([piece.x-1, piece.y-1]);
    if((board[piece.y][piece.x-1] == null && (options & A_EXCLUDE_EMPTY) == 0) || 
        (board[piece.y][piece.x-1]?.color != piece.color && (options & A_EXCLUDE_CAPTURES) == 0))
        pos.push([piece.x-1, piece.y]);
    if((board[piece.y+1][piece.x-1] == null && (options & A_EXCLUDE_EMPTY) == 0) || 
        (board[piece.y+1][piece.x-1]?.color != piece.color && (options & A_EXCLUDE_CAPTURES) == 0))
        pos.push([piece.x-1, piece.y+1]);
    return pos;
}

//return if this move is legal in terms of check, mate and en passant (it's higher than check in priority)
//illegal moves (from most to least important):
//  there is an en passant available
//  king is in check and this move doesn't defend/move king out of check
//  this move would put king in check
//note: en passant is required when available, even if it puts king in check
//  king can also move next to the opponent king
//  in both situations, if king is captured, it's called brutality
function moveLegal(piece: ChessPiece, x: number, y: number): boolean {
    // if(!kingInCheck((piece.color == Color.White) ? wking! : bking!)) return true;
    whatIf(piece, x, y);
    if(kingInCheck((piece.color == Color.White) ? wking! : bking!)) {
        whatIfRevert();
        return false;
    }
    whatIfRevert();
    return true;
}

//return true if a 'king' is in check
function kingInCheck(color: Color) {
    let king = color == Color.White ? wking! : bking!;
    let straight = allStraight(king, A_EXCLUDE_EMPTY);
    if(straight.findIndex((value: number[], index: number, obj: number[][]) => {
        let type = board[value[1]][value[0]]?.type;
        if(type == Piece.Rook || type == Piece.Queen) return true;
    }) != -1) 
        return true;
    let diagonal = allDiagonal(king, A_EXCLUDE_EMPTY);
    if(diagonal.findIndex((value: number[], index: number, obj: number[][]) => {
        let type = board[value[1]][value[0]]?.type;
        if(type == Piece.Bishop || type == Piece.Queen) return true;
    }) != -1)
        return true;
    let knight = allKnight(king, A_EXCLUDE_EMPTY);
    if(knight.findIndex((value: number[], index: number, obj: number[][]) => {
        let type = board[value[1]][value[0]]?.type;
        if(type == Piece.Knight) return true;
    }) != -1)
        return true;
    let pawn = allPawn(king, A_EXCLUDE_EMPTY);
    if(pawn.findIndex((value: number[], index: number, obj: number[][]) => {
        let type = board[value[1]][value[0]]?.type;
        if(type == Piece.Pawn) return true;
    }) != -1)
        return true;
    return false;
}

//return true if it's a checkmate for a given color
function isCheckmate(color: Color): boolean {
}

//return true if it's a stalemate for a given color
function isStalemate(color: Color): boolean {
    if(kingInCheck)
}

//return true if there are no legal moves; false if there are legal moves
function noLegalMoves(color: Color): boolean {
    let king = color == Color.White ? wking! : bking!;
    let pieces = color == Color.White ? wpieces! : bpieces!;
    {
        let all = allKing(king);
        for(let j = 0; j < all.length; j++)
            if(moveLegal(king, all[j][0], all[j][1]))
                return false;
    }
    for(let i = 0; i < pieces.length; i++) {
        switch(pieces[i].type) {
            case Piece.King: break;
            case Piece.Bishop: {
                let all = allDiagonal(pieces[i]);
                for(let j = 0; j < all.length; j++)
                    if(moveLegal(pieces[i], all[j][0], all[j][1]))
                        return false;
                break;
            };
            case Piece.Knight: {
                let all = allKnight(pieces[i]);
                for(let j = 0; j < all.length; j++)
                    if(moveLegal(pieces[i], all[j][0], all[j][1]))
                        return false;
                break;
            };
            case Piece.Rook: {
                let all = allStraight(pieces[i]);
                for(let j = 0; j < all.length; j++)
                    if(moveLegal(pieces[i], all[j][0], all[j][1]))
                        return false;
                break;
            };
            case Piece.Queen: {
                let all = allStraight(pieces[i]).concat(allDiagonal(pieces[i]));
                for(let j = 0; j < all.length; j++)
                    if(moveLegal(pieces[i], all[j][0], all[j][1]))
                        return false;
                break;
            };
            case Piece.Pawn: {
                let all = allPawn(pieces[i]);
                for(let j = 0; j < all.length; j++)
                    if(moveLegal(pieces[i], all[j][0], all[j][1]))
                        return false;
                break;
            };
        }
    }
    return true;
}

var _whatIfCaptured: (ChessPiece|null) = null;
var _whatIfPiece: (Piece|null) = null; //if it was a pawn and it promoted
var _whatIfAt: (number[]|null) = null;
var _whatIfFrom: (number[]|null) = null;

//'piece' goes to (x,y). Easily revertable using whatIfRevert(); DON'T USE MORE THAN ONCE BEFORE REVERTING; REMEMBER TO REVERT BEFORE CONTINUING THE GAME
function whatIf(piece: ChessPiece, x: number, y: number) {
    _whatIfCaptured = board[y][x];
    _whatIfPiece = piece.type;
    _whatIfFrom = [piece.x, piece.y];
    _whatIfAt = [x, y];
    movePiece(piece, x, y, false);
}

//revert changes of the board by the last whatIf(...) call; ONLY USE AFTER whatIf(...) WAS USED ONCE
function whatIfRevert() {
    board[_whatIfFrom![1]][_whatIfFrom![0]] = board[_whatIfAt![1]][_whatIfAt![0]];
    board[_whatIfAt![1]][_whatIfAt![0]] = _whatIfCaptured;
    board[_whatIfFrom![1]][_whatIfFrom![0]]!.type = _whatIfPiece!;
    board[_whatIfFrom![1]][_whatIfFrom![0]]!.x = _whatIfFrom![0];
    board[_whatIfFrom![1]][_whatIfFrom![0]]!.y = _whatIfFrom![1];
    _whatIfCaptured = null;
    _whatIfPiece = null;
    _whatIfAt = null;
    _whatIfFrom = null;
}