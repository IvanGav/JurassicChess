//TODO: update title based on a variant
//TODO: when play again clicked, not resetting the draw agreement
var GAME_DIV_ID = "game_div";
var BOARD_DIV_ID = "board_div";
var MOVES_DIV_ID = "moves_div";
var PIECES_DIV_ID = "pieces_div";
var BOARD_ID = "board";
var AGREE_DRAW_ID = "agree_draw";
var AGREE_DRAW_COUNT_ID = "agree_draw_count";
var GAME_STATUS_ID = "game_status";
var TURN_STATUS_ID = "turn_status";
var MOVES_RECORD_ID = "moves";
var PIECE_CLASS = "piece";
var SELECTED_CLASS = "selected";
// const PLAYERS = 7;
// const DRAW_VOTE_REQUIRED = 5; //5 out of 7 people have to vote for the game to be a draw
var VARIANT_CURRENT = -1;
var PLAYERS = 2;
var DRAW_VOTE_REQUIRED = 2;
var BOARD_CELLS = 8;
var BOARD_SIZE = 600;
var CELL_SIZE = BOARD_SIZE / BOARD_CELLS;
//of view_direction is not null, it overwrites the 'turn' view
var viewDirection = null;
var htmlPieces = [];
var moves = [];
//player info
var player = 0;
var timers = [];
var playersDrawAgreed = [];
var playersDrawAgreedCount = 0;
var timeControl = 300; //inital time; in seconds
var timeBonus = 3; //added with each turn; in seconds
//callbacks
var gameEndCallback;
/*
    board initialization functions
*/
function setCallbacksMain(gameEndCallBack) {
    gameEndCallback = gameEndCallBack;
}
//init game
function initGame(variant) {
    removeBoard();
    initBoard(variant);
    VARIANT_CURRENT = variant;
    viewDirection = null;
    player = 0;
    playersDrawAgreedCount = 0;
    timers = [];
    playersDrawAgreed = [];
    placeBoard();
    placeMovesIndicatorsDiv();
    putPieces();
    updateBoardSize();
    clearMoveRecord();
    updateTurnStatus();
    setCallbacksGame(/* on promotion: */ function (piece) {
        removePiece(piece, document.getElementById(PIECES_DIV_ID));
        addPiece(piece, document.getElementById(PIECES_DIV_ID));
    }, /* on capture: */ function (piece) {
        removePiece(piece, document.getElementById(PIECES_DIV_ID));
    });
    moves = allMoves();
    for (var i = 0; i < PLAYERS; i++) {
        timers.push(timeControl * 1000);
        playersDrawAgreed.push(false);
    }
}
function removeBoard() {
    document.getElementById(GAME_DIV_ID).innerHTML = "";
}
function updateBoardSize() {
    var _a;
    var height = (_a = document.getElementById(BOARD_ID)) === null || _a === void 0 ? void 0 : _a.offsetHeight;
    if (height == undefined)
        return;
    BOARD_SIZE = height;
    CELL_SIZE = BOARD_SIZE / 8;
}
function placeBoard() {
    var board_div = document.createElement("div");
    board_div.id = BOARD_DIV_ID;
    board_div.appendChild(createBoard());
    document.getElementById(GAME_DIV_ID).appendChild(board_div);
}
//return a new board image
function createBoard() {
    var image = getImg("images/200.png", "board image", BOARD_ID, [], function () { return deselect(); });
    return image;
}
function placeMovesIndicatorsDiv() {
    var moves_div = document.createElement("div");
    moves_div.id = MOVES_DIV_ID;
    document.getElementById(GAME_DIV_ID).appendChild(moves_div);
}
function putPieces() {
    var pieces_div = document.createElement("div");
    pieces_div.id = PIECES_DIV_ID;
    for (var i = 0; i < pieces.length; i++)
        addPiece(i, pieces_div);
    document.getElementById(GAME_DIV_ID).appendChild(pieces_div);
}
//add a piece html to the board and set the 'htmlPiece' property of 'piece' (on click it the html piece will update the 'selected' variable)
function addPiece(piece, board) {
    var p = pieces[piece];
    var htmlPiece = getImg(getPieceImage(p.type, p.color, p._customModel), "chess_piece", piece.toString(10), ["piece"], function () { return pieceClicked(piece); });
    htmlPieces[piece] = htmlPiece;
    updatePiecePosition(piece);
    board.appendChild(htmlPiece);
}
//remove an associated html and a board piece 'piece'
function removePiece(piece, board) {
    board.removeChild(htmlPieces[piece]);
}
//get an img div with given arguments
function getImg(src, ifLoadFails, id, classList, onClick, size) {
    if (ifLoadFails === void 0) { ifLoadFails = "image"; }
    if (id === void 0) { id = null; }
    if (classList === void 0) { classList = []; }
    if (onClick === void 0) { onClick = null; }
    if (size === void 0) { size = null; }
    var image = document.createElement("img");
    image.src = src;
    image.alt = ifLoadFails;
    if (id != null)
        image.id = id;
    if (classList.length > 0)
        for (var i = 0; i < classList.length; i++)
            image.classList.add(classList[i]);
    if (onClick != null)
        image.onclick = onClick;
    if (size != null) {
        image.style.maxHeight = size;
        image.style.maxWidth = size;
    }
    return image;
}
//get image for a specified piece and color
function getPieceImage(piece, color, customModel) {
    switch (customModel) {
        case undefined: break;
        case CustomModel.BeastHandler: {
            if (color == Color.Black)
                return "images/z_bh.png";
            else
                return "images/z_wh.png";
        }
        case CustomModel.Veloceraptor: {
            if (color == Color.Black)
                return "images/z_bv.png";
            else
                return "images/z_wv.png";
        }
    }
    switch (piece) {
        case Piece.Pawn: {
            if (color == Color.Black)
                return "images/bp.png";
            else
                return "images/wp.png";
        }
        case Piece.Knight: {
            if (color == Color.Black)
                return "images/bn.png";
            else
                return "images/wn.png";
        }
        case Piece.Bishop: {
            if (color == Color.Black)
                return "images/bb.png";
            else
                return "images/wb.png";
        }
        case Piece.Rook: {
            if (color == Color.Black)
                return "images/br.png";
            else
                return "images/wr.png";
        }
        case Piece.Queen: {
            if (color == Color.Black)
                return "images/bq.png";
            else
                return "images/wq.png";
        }
        case Piece.King: {
            if (color == Color.Black)
                return "images/bk.png";
            else
                return "images/wk.png";
        }
        case Piece.Pterodactyl: {
            if (color == Color.Black)
                return "images/z_bp.png";
            else
                return "images/z_wp.png";
        }
        case Piece.Rex: {
            if (color == Color.Black)
                return "images/z_br.png";
            else
                return "images/z_wr.png";
        }
        case Piece.Triceratops: {
            if (color == Color.Black)
                return "images/z_bt.png";
            else
                return "images/z_wt.png";
        }
        case Piece.Dragon: {
            if (color == Color.Black)
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
    var _a;
    if (selected == NONE)
        return;
    var p = pieces[selected];
    if (p == null)
        return;
    var _loop_1 = function (i) {
        if (moves[i].from.x != p.x || moves[i].from.y != p.y)
            return "continue";
        var moveIndicator = getImg(moves[i].to.type == MoveType.Capture ? "images/can_capture.png" : "images/can_move.png", "move_indicator", null, ["move_indicator"], function () {
            boardClicked(moves[i].to.x, moves[i].to.y);
        });
        if (getViewDirection() == Color.White) {
            moveIndicator.style.left = "".concat(moves[i].to.x * 8.75, "vh");
            moveIndicator.style.top = "".concat((70 - (moves[i].to.y + 1) * 8.75), "vh");
        }
        else {
            moveIndicator.style.left = "".concat((70 - (moves[i].to.x + 1) * 8.75), "vh");
            moveIndicator.style.top = "".concat(moves[i].to.y * 8.75, "vh");
        }
        (_a = document.getElementById(MOVES_DIV_ID)) === null || _a === void 0 ? void 0 : _a.appendChild(moveIndicator);
    };
    for (var i = 0; i < moves.length; i++) {
        _loop_1(i);
    }
}
function clearMoveIndicators() {
    var moveDiv = document.getElementById(MOVES_DIV_ID);
    if (moveDiv == null)
        return;
    moveDiv.innerHTML = "";
}
//update the position of the html piece attached to 'piece'
function updatePiecePosition(piece) {
    clearMoveIndicators();
    var htmlPiece = htmlPieces[piece];
    var p = pieces[piece];
    if (getViewDirection() == Color.White) {
        htmlPiece.style.left = "".concat(p.x * 8.75, "vh");
        htmlPiece.style.top = "".concat((70 - (p.y + 1) * 8.75), "vh");
    }
    else {
        htmlPiece.style.left = "".concat((70 - (p.x + 1) * 8.75), "vh");
        htmlPiece.style.top = "".concat(p.y * 8.75, "vh");
    }
}
//fully update the state of the board; will completely ignore captured pieces
function updateBoard() {
    putMoveIndicators();
    for (var i = 0; i < pieces.length; i++) {
        if (pieces[i] != null) {
            updatePiecePosition(i);
        }
    }
}
/*
    Dealing with piece/board clicks
*/
//this function gets called for every clicked piece
function pieceClicked(piece) {
    if (gameState != GameState.Going)
        return;
    var p = pieces[piece];
    if (p.color == turn) {
        //clicking on your piece
        if (selected == piece) {
            deselect();
        }
        else {
            select(piece);
        }
    }
    else {
        //clicking on opponent piece
        boardClicked(p.x, p.y);
    }
}
//this function gets called for every square on board that's clicked
function boardClicked(x, y) {
    if (selected == NONE)
        return;
    var s = pieces[selected];
    var move = moveAvailable({ from: { x: s.x, y: s.y }, to: { x: x, y: y } });
    if (move != null) {
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
    var checkmark = document.getElementById(AGREE_DRAW_ID);
    // if(checkmark == null) return;
    var isChecked = checkmark.checked;
    if (isChecked != playersDrawAgreed[player]) {
        playersDrawAgreedCount += isChecked ? 1 : -1;
        playersDrawAgreed[player] = isChecked;
    }
}
function updateTurnStatus() {
    document.getElementById(TURN_STATUS_ID).innerText = (turn == Color.White ? "White's turn" : "Black's turn");
    document.getElementById(AGREE_DRAW_ID).checked = playersDrawAgreed[player];
    document.getElementById(AGREE_DRAW_COUNT_ID).innerHTML = "(".concat(playersDrawAgreedCount, "/").concat(PLAYERS, ")");
}
//call instead of updateGameState(moves)
function updateGameStatus() {
    if (updateGameState(moves, playersDrawAgreedCount >= DRAW_VOTE_REQUIRED)) {
        //if the game has ended
        var message = void 0;
        switch (gameState) {
            case GameState.AgreedDraw: {
                message = "Draw by agreement";
                break;
            }
            case GameState.Brutality: {
                message = (winner == Color.White ? "White has demolished Black" : "Black has demolished White");
                break;
            }
            case GameState.Checkmate: {
                message = (winner == Color.White ? "White has won" : "Black has won");
                break;
            }
            case GameState.Going: {
                message = "ERROR: game is still going";
                break;
            }
            case GameState.InsufficientMaterial: {
                message = "Draw by insufficient material";
                break;
            }
            case GameState.None: {
                message = "ERROR: game is not active";
                break;
            }
            case GameState.Stalemate: {
                message = "Stalemate";
                break;
            }
        }
        gameEndCallback();
        setGameStatus(message);
    }
}
function setGameStatus(message) {
    var status = document.getElementById(GAME_STATUS_ID);
    if (status == null)
        return;
    status.innerText = message;
}
function setPlayerDrawOffer(player, offeringDraw) {
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
function getViewDirection() {
    if (viewDirection == null)
        return turn;
    return viewDirection;
}
/*
    Helper functions
*/
//deselect the currently selected (if any) piece (both html and variable)
function deselect() {
    if (selected != NONE) {
        htmlPieces[selected].classList.remove("selected");
    }
    selected = NONE;
    clearMoveIndicators();
}
//select a piece (both html and variable) (deselect if anything is selected)
function select(piece) {
    deselect();
    htmlPieces[piece].classList.add("selected");
    selected = piece;
    putMoveIndicators();
}
//should be called instead of 'nextTurn'
function passTurnToNextPlayer() {
    nextTurn();
    player++;
    if (player == PLAYERS)
        player = 0;
}
//check if a move 'move' is available this turn; return the actual move to be taken (may change move.type field) or null if not available
function moveAvailable(move) {
    for (var i = 0; i < moves.length; i++) {
        var test = moves[i];
        if (test.from.x == move.from.x && test.from.y == move.from.y && test.to.x == move.to.x && test.to.y == move.to.y) {
            return test;
        }
    }
    return null;
}
/*
    Recording moves and retrieving recorded moves
*/
var rank = [1, 2, 3, 4, 5, 6, 7, 8];
var file = ["a", "b", "c", "d", "e", "f", "g", "h"];
var pieceLetter = [undefined, "", "N", "B", "R", "Q", "K", "P", "R", "T", "D"];
var customModelLetter = ["", "H"];
//call after the move happens, but before the turn is passed to the next player
function recordMove(move) {
    document.getElementById(MOVES_RECORD_ID).innerHTML += getMoveNotation(move) + "; ";
}
function getMoveRecord() {
    var moves_div = document.getElementById(MOVES_RECORD_ID);
    if (moves_div == null)
        return "ERROR: moves div doesn't exist";
    return moves_div.innerHTML;
}
//overwrite current move record, if available, with a givent value
function writeMoveRecord(moveRecord) {
    document.getElementById(MOVES_RECORD_ID).innerHTML = moveRecord;
}
//clear move record, if available
function clearMoveRecord() {
    document.getElementById(MOVES_RECORD_ID).innerHTML = "";
}
//given a move, get its algebraic-like notation (must be called before the move is made)
function getMoveNotation(move) {
    if (move.to.type == MoveType.ShortCastle)
        return "0-0";
    if (move.to.type == MoveType.LongCastle)
        return "0-0-0";
    var p = pieceAt(move.from);
    if (p == null)
        return "ERROR: moved piece doesn't exist";
    var notation = "";
    if (p._customModel == undefined)
        notation += pieceLetter[p.type];
    else
        notation += customModelLetter[p._customModel];
    notation += file[move.from.x];
    notation += rank[move.from.y];
    if (move.to.type == MoveType.Capture || move.to.type == MoveType.EnPassant)
        notation += "x";
    notation += file[move.to.x];
    notation += rank[move.to.y];
    if (move.to.promotion_to != undefined) {
        notation += pieceLetter[move.to.promotion_to];
        // notation.substring(1);
    }
    return notation;
}
