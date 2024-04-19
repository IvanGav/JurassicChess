const BOARD_SECTION = "board_section";
const SIDE_SECTION = "side_section";

/*
	Replace side section functions
*/

function replaceSideSection(div: string) {
	let doc = document.getElementById(SIDE_SECTION);
	if(doc == null) return;
	doc.innerHTML = div;
}

function getUIMainMenu(): string {
	return `
		<p>
			<text>Start a new game:</text>
		</p>

		<button type="button" onclick="startGame(VARIANT_NORMAL)">Play Normal Chess</button>
		<button type="button" onclick="startGame(VARIANT_JURASSIC)">Play Jurassic Chess</button>`;
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

	<button type="button" onclick="playAgain()">Play Again</button>
	<button type="button" onclick="mainMenu()">Main Menu</button>
	<button type="button" onclick="analyzeCurrent()">Analyze</button>

	<hr>
	<div id="moves"></div>`;
}

function getUIReplay(): string {
	return `
	<p>
		<text>Replay</text>
	</p>

	<button type="button" onclick="mainMenu()">Main Menu</button>

	<hr>
	<div id="moves"></div>`;
}

/*
	shorthand functions
*/

function analyzeCurrent() {
	let moves = getMoveRecord();
	replaceSideSection(getUIReplay());
	writeMoveRecord(moves);
}

function mainMenu() {
	replaceSideSection(getUIMainMenu());
}

function startGame(variant: number) {
	replaceSideSection(getUIGameActive());
	initGame(variant);
}

function gameEnded() {
	let moves = getMoveRecord();
	replaceSideSection(getUIGameOver());
	writeMoveRecord(moves);
}

function playAgain() {
	startGame(VARIANT_CURRENT);
}