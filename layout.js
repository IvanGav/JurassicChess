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
    return "\n        <p>\n            <text>Start a new game:</text>\n        </p>\n\n        <button type=\"button\" onclick=\"startGame(VARIANT_NORMAL)\">Play Normal Chess</button>\n        <button type=\"button\" onclick=\"startGame(VARIANT_JURASSIC)\">Play Jurassic Chess</button>";
}
function getUIGameActive() {
    return "\n    <p>\n        <text id=\"turn_status\"></text>\n    </p>\n\n    <button type=\"button\" onclick=\"toggleViewDirection()\">Flip</button>\n    <button type=\"button\" onclick=\"lockViewDirection()\">Don't Flip</button>\n    <button type=\"button\" onclick=\"resetViewDirection()\">Do Flip</button>\n    <input type=\"checkbox\" id=\"agree_draw\">\n        <label for=\"agree_draw\">Agree to Draw</label>\n        <label id=\"agree_draw_count\" for=\"agree_draw\">(0/2)</label>\n\n    <hr>\n    <div id=\"moves\"></div>";
}
function getUIGameOver() {
    return "\n    <p>\n        <text id=\"game_status\"></text>\n    </p>\n\n    <button type=\"button\" onclick=\"playAgain()\">Play Again</button>\n    <button type=\"button\" onclick=\"mainMenu()\">Main Menu</button>\n    <button type=\"button\" onclick=\"analyzeCurrent()\">Analyze</button>\n\n    <hr>\n    <div id=\"moves\"></div>";
}
function getUIReplay() {
    return "\n    <p>\n        <text>Replay</text>\n    </p>\n\n    <button type=\"button\" onclick=\"mainMenu()\">Main Menu</button>\n\n    <hr>\n    <div id=\"moves\"></div>";
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
