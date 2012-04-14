#!/bin/sh

# Currently using UglifyJS for minification: https://github.com/mishoo/UglifyJS
# To use it, install Node.js (http://nodejs.org/) and run "npm install uglify-js"
# Thanks http://stackoverflow.com/a/5349538

UGLIFYJS=../node_modules/uglify-js/bin/uglifyjs

cat ./src/*.js > ./uducada.js
$UGLIFYJS -o ./uducada.min.js ./uducada.js
