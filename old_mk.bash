#!/bin/bash

# compile .ts code into a single file
# .ts files have to be in ./src/ (all .js files will be deleted) and the output file will be ./index.js

tsc ./src/*.ts
rm index.js
touch index.js
echo "//code my Momong" > index.js
for js in ./src/*.js
do
    cat $js >> index.js
done
rm ./src/*.js