var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var VARIANT_NORMAL = 0;
var VARIANT_JURASSIC = 1;
var Piece;
(function (Piece) {
    Piece[Piece["Pawn"] = 1] = "Pawn";
    Piece[Piece["Knight"] = 2] = "Knight";
    Piece[Piece["Bishop"] = 3] = "Bishop";
    Piece[Piece["Rook"] = 4] = "Rook";
    Piece[Piece["Queen"] = 5] = "Queen";
    Piece[Piece["King"] = 6] = "King";
    //JURASSIC CHESS:
    Piece[Piece["Pterodactyl"] = 7] = "Pterodactyl";
    Piece[Piece["Rex"] = 8] = "Rex";
    Piece[Piece["Triceratops"] = 9] = "Triceratops";
    Piece[Piece["Dragon"] = 10] = "Dragon";
})(Piece || (Piece = {}));
var Color;
(function (Color) {
    Color[Color["Black"] = -1] = "Black";
    Color[Color["White"] = 1] = "White";
})(Color || (Color = {}));
var MoveType;
(function (MoveType) {
    MoveType[MoveType["Capture"] = 0] = "Capture";
    MoveType[MoveType["ShortCastle"] = 1] = "ShortCastle";
    MoveType[MoveType["LongCastle"] = 2] = "LongCastle";
    MoveType[MoveType["EnPassant"] = 3] = "EnPassant";
})(MoveType || (MoveType = {}));
var GameState;
(function (GameState) {
    GameState[GameState["None"] = 0] = "None";
    GameState[GameState["Going"] = 1] = "Going";
    GameState[GameState["Checkmate"] = 2] = "Checkmate";
    GameState[GameState["Stalemate"] = 3] = "Stalemate";
    GameState[GameState["Brutality"] = 4] = "Brutality";
    GameState[GameState["AgreedDraw"] = 5] = "AgreedDraw";
    GameState[GameState["InsufficientMaterial"] = 6] = "InsufficientMaterial";
})(GameState || (GameState = {}));
var NONE = -1;
var WHITE_PIECES_FIRST = true; //in 'pieces', white pieces are before black pieces
var PIECES_PER_PLAYER = 16;
var KNIGHT_RELATIVE_MOVES = [{ x: -2, y: -1 }, { x: -2, y: 1 }, { x: -1, y: -2 }, { x: -1, y: 2 }, { x: 1, y: -2 }, { x: 1, y: 2 }, { x: 2, y: -1 }, { x: 2, y: 1 }]; //offsets!
var KING_RELATIVE_MOVES = [{ x: -1, y: -1 }, { x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -1 }, { x: 0, y: 1 }, { x: 1, y: -1 }, { x: 1, y: 0 }, { x: 1, y: 1 }]; //offsets!
/*
    game state
*/
//board[0][0] = a1; board[7][0] = a8; board[0][7] = h1; board[7][7] = h8
var board = [];
var selected = NONE;
var turn = Color.White;
var promotionPiece = Piece.Queen;
var promoteCallback;
var captureCallback;
var pieces = []; //white pieces should be first
var wking = NONE;
var bking = NONE;
var winner = null;
var gameState = GameState.None;
/*
    init functions
*/
//reset the game position
function initBoard(variant) {
    gameState = GameState.None;
    winner = null;
    playersDrawAgreed = [];
    turn = Color.White;
    selected = NONE;
    board = [];
    //NORMAL CHESS:
    // promotionPiece = Piece.Queen;
    //JURASSIC CHESS:
    promotionPiece = Piece.Dragon;
    pieces = [];
    wking = NONE;
    bking = NONE;
    for (var y = 0; y < 8; y++) {
        board.push([]);
        for (var x = 0; x < 8; x++) {
            board[y].push(NONE);
        }
    }
    if (variant == VARIANT_NORMAL)
        _standardBoard(pieces);
    else if (variant == VARIANT_JURASSIC)
        _jurassicBoard(pieces);
    for (var i = 0; i < pieces.length; i++) {
        var p = pieces[i];
        board[p.y][p.x] = i;
        if (p.type == Piece.King) {
            if (p.color == Color.White)
                wking = i;
            else
                bking = i;
        }
    }
    gameState = GameState.Going;
}
function setCallbacksGame(promotionCallBack, captureCallBack) {
    promoteCallback = promotionCallBack;
    captureCallback = captureCallBack;
}
//NORMAL CHESS:
function _standardBoard(pieces) {
    pieces.push({ type: Piece.Rook, color: Color.White, x: 0, y: 0 });
    pieces.push({ type: Piece.Knight, color: Color.White, x: 1, y: 0 });
    pieces.push({ type: Piece.Bishop, color: Color.White, x: 2, y: 0 });
    pieces.push({ type: Piece.Queen, color: Color.White, x: 3, y: 0 });
    pieces.push({ type: Piece.King, color: Color.White, x: 4, y: 0 });
    pieces.push({ type: Piece.Bishop, color: Color.White, x: 5, y: 0 });
    pieces.push({ type: Piece.Knight, color: Color.White, x: 6, y: 0 });
    pieces.push({ type: Piece.Rook, color: Color.White, x: 7, y: 0 });
    pieces.push({ type: Piece.Pawn, color: Color.White, x: 0, y: 1 });
    pieces.push({ type: Piece.Pawn, color: Color.White, x: 1, y: 1 });
    pieces.push({ type: Piece.Pawn, color: Color.White, x: 2, y: 1 });
    pieces.push({ type: Piece.Pawn, color: Color.White, x: 3, y: 1 });
    pieces.push({ type: Piece.Pawn, color: Color.White, x: 4, y: 1 });
    pieces.push({ type: Piece.Pawn, color: Color.White, x: 5, y: 1 });
    pieces.push({ type: Piece.Pawn, color: Color.White, x: 6, y: 1 });
    pieces.push({ type: Piece.Pawn, color: Color.White, x: 7, y: 1 });
    pieces.push({ type: Piece.Rook, color: Color.Black, x: 0, y: 7 });
    pieces.push({ type: Piece.Knight, color: Color.Black, x: 1, y: 7 });
    pieces.push({ type: Piece.Bishop, color: Color.Black, x: 2, y: 7 });
    pieces.push({ type: Piece.Queen, color: Color.Black, x: 3, y: 7 });
    pieces.push({ type: Piece.King, color: Color.Black, x: 4, y: 7 });
    pieces.push({ type: Piece.Bishop, color: Color.Black, x: 5, y: 7 });
    pieces.push({ type: Piece.Knight, color: Color.Black, x: 6, y: 7 });
    pieces.push({ type: Piece.Rook, color: Color.Black, x: 7, y: 7 });
    pieces.push({ type: Piece.Pawn, color: Color.Black, x: 0, y: 6 });
    pieces.push({ type: Piece.Pawn, color: Color.Black, x: 1, y: 6 });
    pieces.push({ type: Piece.Pawn, color: Color.Black, x: 2, y: 6 });
    pieces.push({ type: Piece.Pawn, color: Color.Black, x: 3, y: 6 });
    pieces.push({ type: Piece.Pawn, color: Color.Black, x: 4, y: 6 });
    pieces.push({ type: Piece.Pawn, color: Color.Black, x: 5, y: 6 });
    pieces.push({ type: Piece.Pawn, color: Color.Black, x: 6, y: 6 });
    pieces.push({ type: Piece.Pawn, color: Color.Black, x: 7, y: 6 });
}
//JURASSIC CHESS:
function _jurassicBoard(pieces) {
    promotionPiece = Piece.Dragon;
    pieces.push({ type: Piece.Triceratops, color: Color.White, x: 0, y: 0 });
    pieces.push({ type: Piece.Pterodactyl, color: Color.White, x: 1, y: 0 });
    pieces.push({ type: Piece.Rex, color: Color.White, x: 2, y: 0 });
    pieces.push({ type: Piece.Dragon, color: Color.White, x: 3, y: 0 });
    pieces.push({ type: Piece.King, color: Color.White, x: 4, y: 0 });
    pieces.push({ type: Piece.Rex, color: Color.White, x: 5, y: 0 });
    pieces.push({ type: Piece.Pterodactyl, color: Color.White, x: 6, y: 0 });
    pieces.push({ type: Piece.Triceratops, color: Color.White, x: 7, y: 0 });
    pieces.push({ type: Piece.Pawn, color: Color.White, x: 0, y: 1 });
    pieces.push({ type: Piece.Pawn, color: Color.White, x: 1, y: 1 });
    pieces.push({ type: Piece.Pawn, color: Color.White, x: 2, y: 1 });
    pieces.push({ type: Piece.Pawn, color: Color.White, x: 3, y: 1 });
    pieces.push({ type: Piece.Pawn, color: Color.White, x: 4, y: 1 });
    pieces.push({ type: Piece.Pawn, color: Color.White, x: 5, y: 1 });
    pieces.push({ type: Piece.Pawn, color: Color.White, x: 6, y: 1 });
    pieces.push({ type: Piece.Pawn, color: Color.White, x: 7, y: 1 });
    pieces.push({ type: Piece.Triceratops, color: Color.Black, x: 0, y: 7 });
    pieces.push({ type: Piece.Pterodactyl, color: Color.Black, x: 1, y: 7 });
    pieces.push({ type: Piece.Rex, color: Color.Black, x: 2, y: 7 });
    pieces.push({ type: Piece.Dragon, color: Color.Black, x: 3, y: 7 });
    pieces.push({ type: Piece.King, color: Color.Black, x: 4, y: 7 });
    pieces.push({ type: Piece.Rex, color: Color.Black, x: 5, y: 7 });
    pieces.push({ type: Piece.Pterodactyl, color: Color.Black, x: 6, y: 7 });
    pieces.push({ type: Piece.Triceratops, color: Color.Black, x: 7, y: 7 });
    pieces.push({ type: Piece.Pawn, color: Color.Black, x: 0, y: 6 });
    pieces.push({ type: Piece.Pawn, color: Color.Black, x: 1, y: 6 });
    pieces.push({ type: Piece.Pawn, color: Color.Black, x: 2, y: 6 });
    pieces.push({ type: Piece.Pawn, color: Color.Black, x: 3, y: 6 });
    pieces.push({ type: Piece.Pawn, color: Color.Black, x: 4, y: 6 });
    pieces.push({ type: Piece.Pawn, color: Color.Black, x: 5, y: 6 });
    pieces.push({ type: Piece.Pawn, color: Color.Black, x: 6, y: 6 });
    pieces.push({ type: Piece.Pawn, color: Color.Black, x: 7, y: 6 });
}
/*
    game progression functions
*/
//pass the board to the next player
function nextTurn() {
    turn = _opposite(turn);
}
//make a given move, without legality checks
function makeMove(piece, to) {
    _detectEnPassant(piece, to);
    _capturePiece(board[to.y][to.x], false);
    _movePiece(piece, to);
    _optionEnPassant(piece, to, false);
    _optionCastle(piece, to);
    _optionPromote(piece, to);
}
//make a move without detecting (and setting) en passant to other pawns and without promotion
function _makeMoveWhatIf(piece, to) {
    _capturePiece(board[to.y][to.x], true);
    _movePiece(piece, to);
    _optionEnPassant(piece, to, true);
}
//remove a given piece
function _capturePiece(piece, isWhatIf) {
    if (piece == NONE)
        return;
    var p = pieces[piece];
    if (p == null)
        return;
    board[p.y][p.x] = NONE;
    pieces[piece] = null;
    if (!isWhatIf)
        captureCallback(piece);
}
//no move legality checking, just move a given piece to a given position
function _movePiece(piece, to) {
    if (piece == NONE)
        return;
    var p = pieces[piece];
    if (p == null)
        return;
    board[to.y][to.x] = piece;
    board[p.y][p.x] = NONE;
    p.x = to.x;
    p.y = to.y;
    p._moved = true;
}
//shoul be called right before each _movePiece call to tell neighboring pawns (if any) that the moving pawn (if one) can be captured with en passant
function _detectEnPassant(piece, to) {
    if (piece == NONE)
        return;
    var p = pieces[piece];
    if (p == null)
        return;
    if (p.type != Piece.Pawn)
        return;
    if (Math.abs(p.y - to.y) != 2)
        return;
    //it's a double move of a pawn
    var moveDir = p.color == Color.White ? 1 : -1;
    var other = pieceAt({ x: to.x - 1, y: to.y });
    if (other != null && other.type == Piece.Pawn && other.color == _opposite(p.color))
        other._pawnEnPassantMove = { x: to.x, y: to.y - moveDir, type: MoveType.EnPassant };
    other = pieceAt({ x: to.x + 1, y: to.y });
    if (other != null && other.type == Piece.Pawn && other.color == _opposite(p.color))
        other._pawnEnPassantMove = { x: to.x, y: to.y - moveDir, type: MoveType.EnPassant };
}
//promote a piece if the move was to promote (assume that _movePiece was called on the pawn)
function _optionPromote(piece, to) {
    if (piece == NONE)
        return;
    var p = pieces[piece];
    if (p == null)
        return;
    if (to.promotion_to != undefined) {
        p.type = to.promotion_to;
    }
    promoteCallback(piece);
}
//castle if the move was to castle (assume that _movePiece was called on the king)
function _optionCastle(piece, to) {
    if (piece == NONE)
        return;
    var p = pieces[piece];
    if (p == null)
        return;
    if (to.type == MoveType.LongCastle) {
        if (turn == Color.White) {
            //white castled long
            _movePiece(board[0][0], { x: 3, y: 0 });
        }
        else {
            //black castled long
            _movePiece(board[7][0], { x: 3, y: 7 });
        }
    }
    else if (to.type == MoveType.ShortCastle) {
        if (turn == Color.White) {
            //white castled short
            _movePiece(board[0][7], { x: 5, y: 0 });
        }
        else {
            //black castled short
            _movePiece(board[7][7], { x: 5, y: 7 });
        }
    }
}
//perform en passant extra capture if the move was to en passant (assume that _movePiece was called on the pawn)
function _optionEnPassant(piece, to, isWhatIf) {
    if (piece == NONE)
        return;
    var p = pieces[piece];
    if (p == null)
        return;
    if (to.type == MoveType.EnPassant) {
        var moveDir = p.color == Color.White ? 1 : -1; //movement direction of the pawn 'piece'
        _capturePiece(board[p.y - moveDir][p.x], isWhatIf);
    }
}
/*
    All moves functions
*/
//return all moves legal in this position
//all moves by the same piece will be adjacent
function allMoves() {
    var moves = [];
    var from = turn == Color.White ? 0 : PIECES_PER_PLAYER;
    for (var id = from; id < from + PIECES_PER_PLAYER; id++) {
        if (pieces[id] == null)
            continue;
        switch (pieces[id].type) {
            case Piece.Pawn: {
                var to = _allPawn(id);
                for (var i = 0; i < to.length; i++) {
                    //TODO: Doesn't actually work if there are 2 legal en passant captures
                    if (to[i].type == MoveType.EnPassant)
                        return [{ from: { x: pieces[id].x, y: pieces[id].y }, to: to[i] }];
                    if (moveLegal(id, to[i]))
                        moves.push({ from: { x: pieces[id].x, y: pieces[id].y }, to: to[i] });
                }
                break;
            }
            case Piece.Knight: {
                var to = _allSet(id, KNIGHT_RELATIVE_MOVES);
                for (var i = 0; i < to.length; i++) {
                    if (moveLegal(id, to[i]))
                        moves.push({ from: { x: pieces[id].x, y: pieces[id].y }, to: to[i] });
                }
                break;
            }
            case Piece.Bishop: {
                var to = _allDiagonal(id);
                for (var i = 0; i < to.length; i++) {
                    if (moveLegal(id, to[i]))
                        moves.push({ from: { x: pieces[id].x, y: pieces[id].y }, to: to[i] });
                }
                break;
            }
            case Piece.Rook: {
                var to = _allStraight(id);
                for (var i = 0; i < to.length; i++) {
                    if (moveLegal(id, to[i]))
                        moves.push({ from: { x: pieces[id].x, y: pieces[id].y }, to: to[i] });
                }
                break;
            }
            case Piece.Queen: {
                var to = _allStraight(id).concat(_allDiagonal(id));
                for (var i = 0; i < to.length; i++) {
                    if (moveLegal(id, to[i]))
                        moves.push({ from: { x: pieces[id].x, y: pieces[id].y }, to: to[i] });
                }
                break;
            }
            case Piece.King: {
                var to = _allSet(id, KING_RELATIVE_MOVES);
                for (var i = 0; i < to.length; i++) {
                    if (moveLegal(id, to[i]))
                        moves.push({ from: { x: pieces[id].x, y: pieces[id].y }, to: to[i] });
                }
                //check for castle
                if (!kingInCheck(turn) && pieces[id]._moved != true) {
                    var y = pieces[id].y;
                    if (board[y][1] == NONE && board[y][2] == NONE && board[y][3] == NONE &&
                        pieceAt({ x: 0, y: y }) != null && pieceAt({ x: 0, y: y })._moved != true &&
                        moveLegal(id, { x: 2, y: y, type: MoveType.LongCastle }))
                        moves.push({ from: { x: pieces[id].x, y: y }, to: { x: 2, y: y, type: MoveType.LongCastle } });
                    if (board[y][5] == NONE && board[y][6] == NONE &&
                        pieceAt({ x: 7, y: y }) != null && pieceAt({ x: 7, y: y })._moved != true &&
                        moveLegal(id, { x: 6, y: y, type: MoveType.ShortCastle }))
                        moves.push({ from: { x: pieces[id].x, y: y }, to: { x: 6, y: y, type: MoveType.ShortCastle } });
                }
                break;
            }
            //JURASSIC CHESS:
            case Piece.Pterodactyl: {
                var to = _allPterodactyl(id);
                for (var i = 0; i < to.length; i++) {
                    if (moveLegal(id, to[i]))
                        moves.push({ from: { x: pieces[id].x, y: pieces[id].y }, to: to[i] });
                }
                break;
            }
            case Piece.Rex: {
                var to = _allRex(id);
                for (var i = 0; i < to.length; i++) {
                    if (moveLegal(id, to[i]))
                        moves.push({ from: { x: pieces[id].x, y: pieces[id].y }, to: to[i] });
                }
                break;
            }
            case Piece.Triceratops: {
                var to = _allTriceratops(id);
                for (var i = 0; i < to.length; i++) {
                    if (moveLegal(id, to[i]))
                        moves.push({ from: { x: pieces[id].x, y: pieces[id].y }, to: to[i] });
                }
                break;
            }
            case Piece.Dragon: {
                var to = _allDragon(id);
                for (var i = 0; i < to.length; i++) {
                    if (moveLegal(id, to[i]))
                        moves.push({ from: { x: pieces[id].x, y: pieces[id].y }, to: to[i] });
                }
                break;
            }
        }
    }
    return moves;
}
//return a list of all possible straight moves
function _allStraight(piece) {
    if (piece == NONE)
        return [];
    var p = pieces[piece];
    if (p == null)
        return [];
    var all = [];
    var x = -1, y = -1;
    //left
    for (x = p.x - 1; x >= 0 && board[p.y][x] == NONE; x--)
        all.push({ x: x, y: p.y });
    if (x >= 0 && pieces[board[p.y][x]].color != p.color)
        all.push({ x: x, y: p.y, type: MoveType.Capture });
    //right
    for (x = p.x + 1; x < 8 && board[p.y][x] == NONE; x++)
        all.push({ x: x, y: p.y });
    if (x < 8 && pieces[board[p.y][x]].color != p.color)
        all.push({ x: x, y: p.y, type: MoveType.Capture });
    //up
    for (y = p.y - 1; y >= 0 && board[y][p.x] == NONE; y--)
        all.push({ x: p.x, y: y });
    if (y >= 0 && pieces[board[y][p.x]].color != p.color)
        all.push({ x: p.x, y: y, type: MoveType.Capture });
    //down
    for (y = p.y + 1; y < 8 && board[y][p.x] == NONE; y++)
        all.push({ x: p.x, y: y });
    if (y < 8 && pieces[board[y][p.x]].color != p.color)
        all.push({ x: p.x, y: y, type: MoveType.Capture });
    return all;
}
//return a list of all possible diagonal moves
function _allDiagonal(piece) {
    if (piece == NONE)
        return [];
    var p = pieces[piece];
    if (p == null)
        return [];
    var all = [];
    var x = -1, y = -1;
    //top left
    for (x = p.x - 1, y = p.y - 1; x >= 0 && y >= 0 && board[y][x] == NONE; x--, y--)
        all.push({ x: x, y: y });
    if (x >= 0 && y >= 0 && pieces[board[y][x]].color != p.color)
        all.push({ x: x, y: y, type: MoveType.Capture });
    //top right
    for (x = p.x + 1, y = p.y - 1; x < 8 && y >= 0 && board[y][x] == NONE; x++, y--)
        all.push({ x: x, y: y });
    if (x < 8 && y >= 0 && pieces[board[y][x]].color != p.color)
        all.push({ x: x, y: y, type: MoveType.Capture });
    //bottom left
    for (x = p.x - 1, y = p.y + 1; x >= 0 && y < 8 && board[y][x] == NONE; x--, y++)
        all.push({ x: x, y: y });
    if (x >= 0 && y < 8 && pieces[board[y][x]].color != p.color)
        all.push({ x: x, y: y, type: MoveType.Capture });
    //bottom right
    for (x = p.x + 1, y = p.y + 1; x < 8 && y < 8 && board[y][x] == NONE; x++, y++)
        all.push({ x: x, y: y });
    if (x < 8 && y < 8 && pieces[board[y][x]].color != p.color)
        all.push({ x: x, y: y, type: MoveType.Capture });
    return all;
}
//return a list of all possible moves from 'set', where elements of 'set' are **offsets**
function _allSet(piece, set) {
    if (piece == NONE)
        return [];
    var p = pieces[piece];
    if (p == null)
        return [];
    var all = [];
    for (var i = 0; i < set.length; i++) {
        if (p.x + set[i].x >= 0 && p.x + set[i].x < 8 && p.y + set[i].y >= 0 && p.y + set[i].y < 8)
            if (pieceAt({ x: p.x + set[i].x, y: p.y + set[i].y }) == null)
                all.push({ x: p.x + set[i].x, y: p.y + set[i].y });
            else if (pieceAt({ x: p.x + set[i].x, y: p.y + set[i].y }).color == _opposite(p.color))
                all.push({ x: p.x + set[i].x, y: p.y + set[i].y, type: MoveType.Capture });
    }
    return all;
}
//return a list of all possible pawn moves
function _allPawn(piece) {
    var _a, _b;
    if (piece == NONE)
        return [];
    var p = pieces[piece];
    if (p == null)
        return [];
    var all = [];
    //check if en passant available
    if (p._pawnEnPassantMove != undefined) {
        all.push(p._pawnEnPassantMove);
        p._pawnEnPassantMove = undefined;
        return all;
    }
    var startRank = (p.color == Color.White) ? 1 : 6;
    var promotionRank = (p.color == Color.White) ? 7 : 0;
    var moveDirection = (p.color == Color.White) ? 1 : -1;
    //move
    if (board[p.y + moveDirection][p.x] == NONE) {
        //right in front is not obstructed
        all.push({ x: p.x, y: p.y + moveDirection });
        if (p.y == startRank && board[p.y + moveDirection * 2][p.x] == NONE) {
            all.push({ x: p.x, y: p.y + moveDirection * 2 });
        }
    }
    //capture
    if (((_a = pieceAt({ x: p.x + 1, y: p.y + moveDirection })) === null || _a === void 0 ? void 0 : _a.color) == _opposite(p.color))
        all.push({ x: p.x + 1, y: p.y + moveDirection, type: MoveType.Capture });
    if (((_b = pieceAt({ x: p.x - 1, y: p.y + moveDirection })) === null || _b === void 0 ? void 0 : _b.color) == _opposite(p.color))
        all.push({ x: p.x - 1, y: p.y + moveDirection, type: MoveType.Capture });
    //check promotion
    for (var i = 0; i < all.length; i++) {
        if (all[i].y == promotionRank)
            all[i].promotion_to = promotionPiece;
    }
    return all;
}
//JURASSIC CHESS:
function _allPterodactyl(piece) {
    if (piece == NONE)
        return [];
    var p = pieces[piece];
    if (p == null)
        return [];
    var fly = [];
    var x = -1, y = -1;
    //left
    for (x = p.x - 2; x >= 0; x--)
        if (board[p.y][x] == NONE)
            fly.push({ x: x, y: p.y });
    //right
    for (x = p.x + 2; x < 8; x++)
        if (board[p.y][x] == NONE)
            fly.push({ x: x, y: p.y });
    //up
    for (y = p.y - 2; y >= 0; y--)
        if (board[y][p.x] == NONE)
            fly.push({ x: p.x, y: y });
    //down
    for (y = p.y + 2; y < 8; y++)
        if (board[y][p.x] == NONE)
            fly.push({ x: p.x, y: y });
    var capture = _allSet(piece, KING_RELATIVE_MOVES);
    return fly.concat(capture);
}
function _allRex(piece) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    if (piece == NONE)
        return [];
    var p = pieces[piece];
    if (p == null)
        return [];
    var all = [];
    var moveDirection = (p.color == Color.White) ? 1 : -1;
    //backwards
    if (_squareValid({ x: p.x - 1, y: p.y - moveDirection })) {
        if (pieceAt({ x: p.x - 1, y: p.y - moveDirection }) == null)
            all.push({ x: p.x - 1, y: p.y - moveDirection });
        if (((_a = pieceAt({ x: p.x - 1, y: p.y - moveDirection })) === null || _a === void 0 ? void 0 : _a.color) == _opposite(p.color))
            all.push({ x: p.x - 1, y: p.y - moveDirection, type: MoveType.Capture });
    }
    if (_squareValid({ x: p.x + 1, y: p.y - moveDirection })) {
        if (pieceAt({ x: p.x + 1, y: p.y - moveDirection }) == null)
            all.push({ x: p.x + 1, y: p.y - moveDirection });
        if (((_b = pieceAt({ x: p.x + 1, y: p.y - moveDirection })) === null || _b === void 0 ? void 0 : _b.color) == _opposite(p.color))
            all.push({ x: p.x + 1, y: p.y - moveDirection, type: MoveType.Capture });
    }
    //left
    var leftAt = { x: p.x - 1, y: p.y + moveDirection };
    leftAt.type = ((_c = pieceAt(leftAt)) === null || _c === void 0 ? void 0 : _c.color) == _opposite(p.color) ? MoveType.Capture : undefined;
    if (_squareValid(leftAt) && ((_d = pieceAt(leftAt)) === null || _d === void 0 ? void 0 : _d.color) != p.color)
        all.push(leftAt);
    if (_squareValid({ x: p.x - 2, y: p.y + 2 * moveDirection }) && board[leftAt.y][leftAt.x] == NONE && ((_e = pieceAt({ x: p.x - 2, y: p.y + 2 * moveDirection })) === null || _e === void 0 ? void 0 : _e.color) != p.color)
        all.push({ x: p.x - 2, y: p.y + 2 * moveDirection, type: board[p.y + 2 * moveDirection][p.x - 2] == NONE ? undefined : MoveType.Capture });
    //up
    var upAt = { x: p.x, y: p.y + moveDirection };
    upAt.type = ((_f = pieceAt(upAt)) === null || _f === void 0 ? void 0 : _f.color) == _opposite(p.color) ? MoveType.Capture : undefined;
    if (_squareValid(upAt) && ((_g = pieceAt(upAt)) === null || _g === void 0 ? void 0 : _g.color) != p.color)
        all.push(upAt);
    if (_squareValid({ x: p.x, y: p.y + 2 * moveDirection }) && board[upAt.y][upAt.x] == NONE && ((_h = pieceAt({ x: p.x, y: p.y + 2 * moveDirection })) === null || _h === void 0 ? void 0 : _h.color) != p.color)
        all.push({ x: p.x, y: p.y + 2 * moveDirection, type: board[p.y + 2 * moveDirection][p.x] == NONE ? undefined : MoveType.Capture });
    //right
    var rightAt = { x: p.x + 1, y: p.y + moveDirection };
    rightAt.type = ((_j = pieceAt(rightAt)) === null || _j === void 0 ? void 0 : _j.color) == _opposite(p.color) ? MoveType.Capture : undefined;
    if (_squareValid(rightAt) && ((_k = pieceAt(rightAt)) === null || _k === void 0 ? void 0 : _k.color) != p.color)
        all.push(rightAt);
    if (_squareValid({ x: p.x + 2, y: p.y + 2 * moveDirection }) && board[rightAt.y][rightAt.x] == NONE && ((_l = pieceAt({ x: p.x + 2, y: p.y + 2 * moveDirection })) === null || _l === void 0 ? void 0 : _l.color) != p.color)
        all.push({ x: p.x + 2, y: p.y + 2 * moveDirection, type: board[p.y + 2 * moveDirection][p.x + 2] == NONE ? undefined : MoveType.Capture });
    //knight-like
    if (_squareValid({ x: rightAt.x, y: p.y + 2 * moveDirection }) && (board[upAt.y][upAt.x] == NONE || board[rightAt.y][rightAt.x] == NONE) &&
        ((_m = pieceAt({ x: rightAt.x, y: p.y + 2 * moveDirection })) === null || _m === void 0 ? void 0 : _m.color) != p.color)
        all.push({ x: rightAt.x, y: p.y + 2 * moveDirection, type: board[p.y + 2 * moveDirection][rightAt.x] == NONE ? undefined : MoveType.Capture });
    if (_squareValid({ x: leftAt.x, y: p.y + 2 * moveDirection }) && (board[upAt.y][upAt.x] == NONE || board[leftAt.y][leftAt.x] == NONE) &&
        ((_o = pieceAt({ x: leftAt.x, y: p.y + 2 * moveDirection })) === null || _o === void 0 ? void 0 : _o.color) != p.color)
        all.push({ x: leftAt.x, y: p.y + 2 * moveDirection, type: board[p.y + 2 * moveDirection][leftAt.x] == NONE ? undefined : MoveType.Capture });
    return all;
}
function _allTriceratops(piece) {
    if (piece == NONE)
        return [];
    var p = pieces[piece];
    if (p == null)
        return [];
    var all = [];
    var x = -1, y = -1;
    //up
    for (y = p.y - 1; y >= 0 && board[y][p.x] == NONE; y--)
        all.push({ x: p.x, y: y });
    if (y >= 0 && pieces[board[y][p.x]].color != p.color)
        all.push({ x: p.x, y: y, type: MoveType.Capture });
    //down
    for (y = p.y + 1; y < 8 && board[y][p.x] == NONE; y++)
        all.push({ x: p.x, y: y });
    if (y < 8 && pieces[board[y][p.x]].color != p.color)
        all.push({ x: p.x, y: y, type: MoveType.Capture });
    if (p.color == Color.Black) {
        //top left
        for (x = p.x - 1, y = p.y - 1; x >= 0 && y >= 0 && board[y][x] == NONE; x--, y--)
            all.push({ x: x, y: y });
        if (x >= 0 && y >= 0 && pieces[board[y][x]].color != p.color)
            all.push({ x: x, y: y, type: MoveType.Capture });
        //top right
        for (x = p.x + 1, y = p.y - 1; x < 8 && y >= 0 && board[y][x] == NONE; x++, y--)
            all.push({ x: x, y: y });
        if (x < 8 && y >= 0 && pieces[board[y][x]].color != p.color)
            all.push({ x: x, y: y, type: MoveType.Capture });
    }
    else {
        //bottom left
        for (x = p.x - 1, y = p.y + 1; x >= 0 && y < 8 && board[y][x] == NONE; x--, y++)
            all.push({ x: x, y: y });
        if (x >= 0 && y < 8 && pieces[board[y][x]].color != p.color)
            all.push({ x: x, y: y, type: MoveType.Capture });
        //bottom right
        for (x = p.x + 1, y = p.y + 1; x < 8 && y < 8 && board[y][x] == NONE; x++, y++)
            all.push({ x: x, y: y });
        if (x < 8 && y < 8 && pieces[board[y][x]].color != p.color)
            all.push({ x: x, y: y, type: MoveType.Capture });
    }
    return all;
}
//it returns duplicate turns, i know, i don't care enough
function _allDragon(piece) {
    if (piece == NONE)
        return [];
    var p = pieces[piece];
    if (p == null)
        return [];
    var first = _allSet(piece, KNIGHT_RELATIVE_MOVES);
    var second = _allStraight(piece);
    return first.concat(second);
}
/*
    Other game flow functions
*/
//return if this move is legal in terms of check, mate and en passant (it's higher than check in priority)
//illegal moves (from most to least important):
//  taking opponent's king is always legal
//  there is an en passant available (not checked here, but will be the only returned available move from allMoves!)
//  king is in check and this move doesn't defend/move king out of check or this move would put king in check
//note: does not check if a piece can move like that
function moveLegal(piece, to) {
    var _a;
    if (piece == NONE)
        return false;
    var p = pieces[piece];
    if (p == null)
        return false;
    if (((_a = pieceAt(to)) === null || _a === void 0 ? void 0 : _a.type) == Piece.King)
        return true;
    _whatIf(piece, to);
    if (kingInCheck(p.color)) {
        _whatIfRevert();
        return false;
    }
    _whatIfRevert();
    //if it's castling, make sure there's also no check on the way to the final square
    if (to.type == MoveType.LongCastle) {
        _whatIf(piece, { x: to.x + 1, y: to.y });
        if (kingInCheck(p.color)) {
            _whatIfRevert();
            return false;
        }
        _whatIfRevert();
    }
    else if (to.type == MoveType.ShortCastle) {
        _whatIf(piece, { x: to.x - 1, y: to.y });
        if (kingInCheck(p.color)) {
            _whatIfRevert();
            return false;
        }
        _whatIfRevert();
    }
    return true;
}
//return true if a 'king' is in check
//king cannot check another king in this version
function kingInCheck(color) {
    var king = color == Color.White ? wking : bking;
    var check = false;
    //NORMAL CHESS:
    // let moves = _allStraight(king);
    // _forSquaresCaptures(moves, (piece: number) => {
    //     let type = pieces[piece]!.type;
    //     if(type == Piece.Rook || type == Piece.Queen) check = true;
    // });
    // if(check) return true;
    // moves = _allDiagonal(king);
    // _forSquaresCaptures(moves, (piece: number) => {
    //     let type = pieces[piece]!.type;
    //     if(type == Piece.Bishop || type == Piece.Queen) check = true;
    // });
    // if(check) return true;
    // moves = _allSet(king, KNIGHT_RELATIVE_MOVES);
    // _forSquaresCaptures(moves, (piece: number) => {
    //     let type = pieces[piece]!.type;
    //     if(type == Piece.Knight) check = true;
    // });
    // if(check) return true;
    // moves = _allPawn(king);
    // _forSquaresCaptures(moves, (piece: number) => {
    //     let type = pieces[piece]!.type;
    //     if(type == Piece.Pawn) check = true;
    // });
    // if(check) return true;
    //JURASSIC CHESS:
    var moves = _allDragon(king);
    _forSquaresCaptures(moves, function (piece) {
        var type = pieces[piece].type;
        if (type == Piece.Dragon)
            check = true;
    });
    if (check)
        return true;
    moves = _allRex(king);
    _forSquaresCaptures(moves, function (piece) {
        var type = pieces[piece].type;
        if (type == Piece.Rex)
            check = true;
    });
    if (check)
        return true;
    moves = _allTriceratops(king);
    _forSquaresCaptures(moves, function (piece) {
        var type = pieces[piece].type;
        if (type == Piece.Triceratops)
            check = true;
    });
    if (check)
        return true;
    moves = _allPterodactyl(king);
    _forSquaresCaptures(moves, function (piece) {
        var type = pieces[piece].type;
        if (type == Piece.Pterodactyl)
            check = true;
    });
    if (check)
        return true;
    moves = _allPawn(king);
    _forSquaresCaptures(moves, function (piece) {
        var type = pieces[piece].type;
        if (type == Piece.Pawn)
            check = true;
    });
    if (check)
        return true;
    return false;
}
//should be called at the beginning of every move with input of all possible moves for current player
function updateGameState(moves, agreedDraw) {
    if (agreedDraw) {
        winner = null;
        gameState = GameState.AgreedDraw;
        return true;
    }
    if (pieces[(turn == Color.White ? wking : bking)] == null) {
        winner = _opposite(turn);
        gameState = GameState.Brutality;
        return true;
    }
    if (moves.length == 0) {
        if (kingInCheck(turn)) {
            winner = _opposite(turn);
            gameState = GameState.Checkmate;
            return true;
        }
        winner = null;
        gameState = GameState.Stalemate;
        return true;
    }
    //NORMALL CHESS:
    //check for not enough material
    // let wmap = new Map<Piece, number>(); //where number is 0 or 1, depending on color of the square (for bishops)
    // let bmap = new Map<Piece, number>();
    // for(let i = 0; i < PIECES_PER_PLAYER; i++) {
    //     let p = pieces[i];
    //     if(p == null) continue;
    //     wmap.set(p.type, (p.x+p.y)%2);
    //     if(wmap.size > 2) return false;
    // }
    // for(let i = PIECES_PER_PLAYER; i < 2*PIECES_PER_PLAYER; i++) {
    //     let p = pieces[i];
    //     if(p == null) continue;
    //     bmap.set(p.type, (p.x+p.y)%2);
    // }
    //K vs K, K vs K + N, K vs K + B, K + B vs K vs B where bishops are the same color
    // if((wmap.size == 1 && bmap.size == 1) ||
    // (wmap.size == 1 && bmap.size == 2 && (bmap.get(Piece.Bishop) != undefined || bmap.get(Piece.Knight) != undefined)) ||
    // (wmap.size == 2 && bmap.size == 1 && (wmap.get(Piece.Bishop) != undefined || wmap.get(Piece.Knight) != undefined)) ||
    // (wmap.size == 2 && bmap.size == 2 && (wmap.get(Piece.Bishop) != undefined && wmap.get(Piece.Bishop) == bmap.get(Piece.Bishop)))) {
    //     winner = null;
    //     gameState = GameState.InsufficientMaterial;
    //     return true;
    // }
    return false;
}
/*
    What if functions
*/
var _whatIfHappened = false;
var _whatIfMove = null;
var _whatIfPiece1Id = NONE;
var _whatIfPiece1 = null; //before move
var _whatIfPiece2Id = NONE;
var _whatIfPiece2 = null; //before move
//'piece' goes to 'to'. Easily revertable using _whatIfRevert; DON'T USE MORE THAN ONCE BEFORE REVERTING; REMEMBER TO REVERT BEFORE CONTINUING THE GAME
function _whatIf(piece, to) {
    if (_whatIfHappened)
        return;
    if (piece == NONE)
        return;
    var p = pieces[piece];
    if (p == null)
        return;
    _whatIfMove = { from: { x: p.x, y: p.y }, to: to };
    _whatIfPiece1 = _copyPiece(p);
    _whatIfPiece1Id = piece;
    //special case: the move is en passant - save the captured pawn, not the square 'to'
    if (to.type == MoveType.EnPassant) {
        var moveDirection = p.color == Color.White ? 1 : -1;
        var capture_at = { x: to.x, y: to.y - moveDirection };
        _whatIfPiece2 = _copyPiece(pieceAt(capture_at));
        _whatIfPiece2Id = board[capture_at.y][capture_at.x];
    }
    else {
        _whatIfPiece2 = _copyPiece(pieceAt(to));
        _whatIfPiece2Id = board[to.y][to.x];
    }
    _makeMoveWhatIf(piece, to); //important to do _makeMoveMinimal to not have to do unnesseary reverse engineering in _whatIfRevert
    _whatIfHappened = true;
}
//revert changes of the board by the last _whatIf call; ONLY USE AFTER _whatIf WAS USED ONCE
function _whatIfRevert() {
    if (!_whatIfHappened)
        return;
    pieces[_whatIfPiece1Id] = _whatIfPiece1;
    board[_whatIfMove.from.y][_whatIfMove.from.x] = _whatIfPiece1Id;
    pieces[_whatIfPiece2Id] = _whatIfPiece2;
    //check for: castle long, castle short, en passant
    if (_whatIfMove.to.type == MoveType.EnPassant) {
        board[_whatIfPiece2.y][_whatIfPiece2.x] = _whatIfPiece2Id;
    }
    else {
        board[_whatIfMove.to.y][_whatIfMove.to.x] = _whatIfPiece2Id;
    }
    //moving the rook is irrelevant when looking for checks
    // if(_whatIfMove!.to.type == MoveType.LongCastle) {
    //     //move the rook
    //     let rookAt = {x: _whatIfPiece1!.x-1, y: _whatIfPiece1!.y};
    //     let rookId = board[rookAt.y][rookAt.x];
    //     pieces[rookId]!.x = 0;
    //     board[rookAt.y][rookAt.x] = NONE;
    //     board[rookAt.y][0] = rookId;
    // } else if(_whatIfMove!.to.type == MoveType.ShortCastle) {
    //     //move the rook
    //     let rookAt = {x: _whatIfPiece1!.x+1, y: _whatIfPiece1!.y};
    //     let rookId = board[rookAt.y][rookAt.x];
    //     pieces[rookId]!.x = 7;
    //     board[rookAt.y][rookAt.x] = NONE;
    //     board[rookAt.y][7] = rookId;
    // }
    _whatIfHappened = false;
}
/*
    Helper functions
*/
function pieceAt(at) {
    if (board[at.y][at.x] == NONE)
        return null;
    return pieces[board[at.y][at.x]];
}
function _opposite(color) {
    if (color == Color.Black)
        return Color.White;
    return Color.Black;
}
function _forSquares(all, fn) {
    for (var i = 0; i < all.length; i++)
        fn(all[i]);
}
function _forSquaresEmpty(all, fn) {
    for (var i = 0; i < all.length; i++) {
        if (board[all[i].y][all[i].x] == NONE)
            fn(all[i]);
    }
}
function _forSquaresCaptures(all, fn) {
    for (var i = 0; i < all.length; i++) {
        if (board[all[i].y][all[i].x] != NONE)
            fn(board[all[i].y][all[i].x]);
    }
}
function _copyBoard() {
    var newb = [];
    for (var i = 0; i < 8; i++) {
        newb.push([]);
        for (var j = 0; j < 8; j++)
            newb[i].push(board[i][j]);
    }
    return newb;
}
function _copyPiece(chessPiece) {
    if (chessPiece == null)
        return null;
    return __assign({}, chessPiece);
}
//return true if the square is on the board
function _squareValid(at) {
    return at.x >= 0 && at.x < 8 && at.y >= 0 && at.y < 8;
}
