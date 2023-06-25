#!/bin/sh

[ "$(id -u)" = 0 ] && echo "Please run without root perms" && exit

echo "Searching for and patching RPGM Plugins.js"
PATTERN='/];/i ,{"name":"Cheat_Menu","status":true,"description":"","parameters":{}}'
if [ -f "www/js/plugins.js" ]; then
	cp -v www/js/plugins.js www/js/plugins.js~ 2>/dev/null &&
		sed -i "$PATTERN" www/js/plugins.js
elif [ -f "js/plugins.js" ]; then
	cp -v js/plugins.js js/plugins.js~ 2>/dev/null &&
		sed -i "$PATTERN" js/plugins.js
else
    echo "No RPGM installation found."
fi