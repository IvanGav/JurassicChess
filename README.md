# Jurassic Chess

Jurassic chess variant. Don't expect it to be good, it's quite *prehistoric*.

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
		"outDir": "./dist/",
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

So, it's normal chess. Nothing more nothing less. Needs more polishing and testing.

The plan is to make it playable on the same computer, then on a server (not even sure if it's going to happen).
