#!/bin/sh

# Capture the current version.
VERSION=`cat ./VERSION`

# Currently using YUI Compressor for minification.
YUICOMPRESSOR=./3pty/yui/yuicompressor/yuicompressor-2.4.7.jar

# To use the YUI Compressor, Java is required (http://java.com).
JAVA=`which java`
if [ "$JAVA" == "" ]; then echo "Not found: java" ; exit 1 ; fi

# Output tmp version file (use comment style that works for both CSS and JS).
echo "/* uducada v$VERSION - https://github.com/m5n/uducada */" > ./version.tmp

# Process CSS files for each third-party UI framework.
UIFWKFILES=`find ./src/css/adapters/uifwk -type f`
for UIFWKFILE in $UIFWKFILES
do
    # Extract framework identifier.
    # Note: remove "-" for readability, e.g. jquery-ui => jqueryui.
    UIFWKID=`expr "$UIFWKFILE" : ".*/\(.*\).css" | tr -d "-"`

    echo "Generating uducada-$UIFWKID CSS files..."

    # Generate unminified and minified versions of the CSS file.
    # Note: add adapter file before uducada files.
    cat $UIFWKFILE ./src/css/*.css > ./uducada.css.tmp
    $JAVA -jar $YUICOMPRESSOR --type css -o ./uducada.min.css.tmp ./uducada.css.tmp

    # Add the version file to the minified and unminified versions of the CSS file.
    cat ./version.tmp ./uducada.css.tmp > ./uducada-$UIFWKID.css
    cat ./version.tmp ./uducada.min.css.tmp > ./uducada-$UIFWKID.min.css
done

# Process JS files for each third-party JS and UI framework combination.
FWKFILES=`find ./src/js/adapters/fwk -type f`
for FWKFILE in $FWKFILES
do
    # Extract framework identifier.
    # Note: remove "-" for readability, e.g. jquery-ui => jqueryui.
    FWKID=`expr "$FWKFILE" : ".*/\(.*\).js" | tr -d "-"`

    UIFWKFILES=`find ./src/js/adapters/uifwk -type f`
    for UIFWKFILE in $UIFWKFILES
    do
        # Extract framework identifier.
        # Note: remove "-" for readability, e.g. jquery-ui => jqueryui.
        UIFWKID=`expr "$UIFWKFILE" : ".*/\(.*\).js" | tr -d "-"`

        echo "Generating uducada-$FWKID-$UIFWKID JS files..."

        # Generate unminified and minified versions of the JS file.
        # Note: add adapter files before uducada files.
        cat $FWKFILE $UIFWKFILE ./src/js/*.js > ./uducada.js.tmp
        $JAVA -jar $YUICOMPRESSOR --type js -o ./uducada.min.js.tmp ./uducada.js.tmp

        # Add the version file to the minified and unminified versions of the CSS file.
        cat ./version.tmp ./uducada.js.tmp > ./uducada-$FWKID-$UIFWKID.js
        cat ./version.tmp ./uducada.min.js.tmp > ./uducada-$FWKID-$UIFWKID.min.js
    done
done

# Delete all tmp files.
rm ./*.tmp
