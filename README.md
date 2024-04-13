# Chess

### v1

Variants:
- Normal Chess - Boring old chess. Go play on lichess if that's what you're playing.
- Jurassic Chess - Don't expect it to be good, it's quite *prehistoric*.

Feel free to submit any bugs, I'd appreciate. I plan to work on it a bit more. BUG_REPORT.md will additionally contain all bug records.

Written in Typescript (ts). To compile ts files, you can use `./mk.bash`. 
Generated Javascript (js) files will be put into the home directory, together with "index.html". 
To delete generated js files, you can use `./clr.bash`. 
Requires "tsc" to be installed for compilation. It can be installed with `npm install typescript --save-dev`. 
npm can be installed from [node.js official website](https://nodejs.org/en/download). 
"tsconfig.json" can be used for [ts configuration](https://www.typescriptlang.org/tsconfig) (such as strictNullChecks).

This is a "tsconfig.json" file that works for me: 
```json
{
	"compilerOptions": {
		"noImplicitAny": true,
		"module": "es6",
		"target": "es5",
		"jsx": "react",
		"allowJs": false,
		"moduleResolution": "node",
		"strict": true
	}
}
```

For now, "index.html" loads js scripts in the head without any extra import/export. It's probably going to stay this way, because oh god modules for web pages are a pain to figure out for the first time.

Code is somewhat well self documented, but if something is not clear, open an issue and I'll write better code/comments (It sucks, I know. Fortunately most of it shouldn't need to be touched again before a big overhaul).

Plans (no order):
- Timer
- Too quiet.
- Play vs AI
- Live replay
- Server support
- Design overhaul
- How to play pages
- Support for easy and flexible variant creation
- A new chess variant that nobody seems to know about...
- Lore update?...