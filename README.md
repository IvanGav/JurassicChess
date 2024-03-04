# Crazy9x9

This is web version of Crazy9x9 (read "crazy nines") Chess variant. It's completely made up my a small group of people including me (If you're one of them and want to be mentioned here, tell). It's very scuffed.

Written in Typescript (ts). To compile ts files, you can use `./mk.bash`. 
Generated Javascript (js) files will be put into the home directory, together with "index.html". 
To delete generated js files, you can use `./clr.bash`. 
Requires "tsc" to be installed for compilation. It can be installed with `npm install typescript --save-dev`. 
npm can be installed from [node.js official website](https://nodejs.org/en/download).

For now, "index.html" loads js scripts in the head without any extra import/export. It's probably going to stay this way, because oh god modules for web pages are a pain to figure out for the first time.

More details will be added later, when it's remotely playable.

The plan is to make it playable on the same computer, then on a server (not even sure if it's going to happen).
