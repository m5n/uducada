#!/bin/sh

# Capture the current version.
VERSION=`cat ./VERSION`

# Currently using YUI Compressor for minification.  To use it, install Java (http://java.com/)
# and download the YUI compressor (http://yuilibrary.com/download/yuicompressor/).
YUICOMPRESSOR=../yuicompressor-2.4.7/build/yuicompressor-2.4.7.jar

# Output tmp version file (use comment style that works for both CSS and JS).
echo "/* uducada v$VERSION - https://github.com/m5n/uducada */" > ./version.tmp

# Add the version file to the minified and unminified versions of the CSS file.
# Note: no specific inclusion order needed.
cat ./src/css/*.css > ./uducada.css.tmp
java -jar $YUICOMPRESSOR --type css -o ./uducada.min.css.tmp ./uducada.css.tmp
cat ./version.tmp ./uducada.css.tmp > ./uducada.css
cat ./version.tmp ./uducada.min.css.tmp > ./uducada.min.css

# Add the version file to the minified and unminified versions of the JS file.
# Note: JS and UI frameworks need to be added first.
cat ./src/js/js-framework-adapter.js ./src/js/ui-framework-adapter.js ./src/js/busy-mask.js ./src/js/dialog.js ./src/js/form.js> ./uducada.js.tmp
java -jar $YUICOMPRESSOR --type js -o ./uducada.min.js.tmp ./uducada.js.tmp
cat ./version.tmp ./uducada.js.tmp > ./uducada.js
cat ./version.tmp ./uducada.min.js.tmp > ./uducada.min.js

# Delete all tmp files.
rm ./*.tmp
