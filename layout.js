var BOARD_SECTION = "board_section";
var SIDE_SECTION = "side_section";
/*
    Replace side section functions
*/
function replaceSideSection(div) {
    var doc = document.getElementById(SIDE_SECTION);
    if (doc == null)
        return;
    doc.innerHTML = div;
}
function getUIMainMenu() {
    return "\n\t\t<p>\n\t\t\t<text>Start a new game:</text>\n\t\t</p>\n\n\t\t<button type=\"button\" onclick=\"startGame(VARIANT_NORMAL)\">Play Normal Chess</button>\n\t\t<button type=\"button\" onclick=\"startGame(VARIANT_JURASSIC)\">Play Jurassic Chess</button>";
}
function getUIGameActive() {
    return "\n\t<p>\n\t\t<text id=\"turn_status\"></text>\n\t</p>\n\n\t<button type=\"button\" onclick=\"toggleViewDirection()\">Flip</button>\n\t<button type=\"button\" onclick=\"lockViewDirection()\">Don't Flip</button>\n\t<button type=\"button\" onclick=\"resetViewDirection()\">Do Flip</button>\n\t<input type=\"checkbox\" id=\"agree_draw\">\n\t\t<label for=\"agree_draw\">Agree to Draw</label>\n\t\t<label id=\"agree_draw_count\" for=\"agree_draw\">(0/2)</label>\n\n\t<hr>\n\t<div id=\"moves\"></div>";
}
function getUIGameOver() {
    return "\n\t<p>\n\t\t<text id=\"game_status\"></text>\n\t</p>\n\n\t<button type=\"button\" onclick=\"playAgain()\">Play Again</button>\n\t<button type=\"button\" onclick=\"mainMenu()\">Main Menu</button>\n\t<button type=\"button\" onclick=\"analyzeCurrent()\">Analyze</button>\n\n\t<hr>\n\t<div id=\"moves\"></div>";
}
function getUIReplay() {
    return "\n\t<p>\n\t\t<text>Replay</text>\n\t</p>\n\n\t<button type=\"button\" onclick=\"mainMenu()\">Main Menu</button>\n\n\t<hr>\n\t<div id=\"moves\"></div>";
}
/*
    shorthand functions
*/
function analyzeCurrent() {
    var moves = getMoveRecord();
    replaceSideSection(getUIReplay());
    writeMoveRecord(moves);
}
function mainMenu() {
    replaceSideSection(getUIMainMenu());
}
function startGame(variant) {
    replaceSideSection(getUIGameActive());
    initGame(variant);
}
function gameEnded() {
    var moves = getMoveRecord();
    replaceSideSection(getUIGameOver());
    writeMoveRecord(moves);
}
function playAgain() {
    startGame(VARIANT_CURRENT);
}
