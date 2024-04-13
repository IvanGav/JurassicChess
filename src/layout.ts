const BOARD_SECTION = "board_section";
const SIDE_SECTION = "side_section";

/*
    Replace side section functions
*/

function replaceSideSection(div: string) { //HTMLElement
    // document.getElementById(SIDE_SECTION)?.replaceChildren(div);
    let doc = document.getElementById(SIDE_SECTION);
    if(doc == null) return;
    doc.innerHTML = div;
}

function getUIMainMenu(): string {
    return `
        <p>
            <text id="turn_status">Start a new game:</text>
        </p>

        <button type="button" onclick="initGame()">Play Jurassic Chess</button>
        <button type="button" onclick="initGame()">Play Normal Chess</button>`;
}

function getUIGameActive(): string {
    return `
    <p>
        <text id="turn_status"></text>
    </p>

    <button type="button" onclick="toggleViewDirection()">Flip</button>
    <button type="button" onclick="lockViewDirection()">Don't Flip</button>
    <button type="button" onclick="resetViewDirection()">Do Flip</button>
    <input type="checkbox" id="agree_draw">
        <label for="agree_draw">Agree to Draw</label>
        <label id="agree_draw_count" for="agree_draw">(0/2)</label>

    <hr>
    <div id="moves"></div>`;
}

function getUIGameOver(): string {
    return `
    <p>
        <text id="game_status"></text>
    </p>

    <button type="button" onclick="initGame()">New Game</button>
    <button type="button" onclick="mainMenu()">Main Menu</button>
    <button type="button" onclick="analyzeCurrent()">Analyze</button>

    <hr>
    <div id="moves"></div>`;
}

function getUIReplay(): string {
    return ``;
}

/*
    shorthand functions
*/

function analyzeCurrent() {
    let moves_div = document.getElementById(MOVES_DIV_ID);
    if(moves_div == null) return;
    let moves = moves_div.innerHTML;
    replaceSideSection(getUIReplay());
    writeMoveRecord(moves);
}

function mainMenu() {
    replaceSideSection(getUIMainMenu());
}