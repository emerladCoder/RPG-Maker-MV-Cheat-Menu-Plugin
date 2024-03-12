#!/bin/sh

[ "$(id -u)" = 0 ] && echo "Please run without root perms" && exit

echo "Searching for and patching RPGM Plugins.js"
PATTERN='/];/i ,{"name":"Cheat_Menu","status":true,"description":"","parameters":{}}'
if [ -f "www/js/plugins.js" ]; then
    file_path="www/js/plugins.js"
elif [ -f "js/plugins.js" ]; then
    file_path="js/plugins.js"
else
    echo "No RPGM installation found."
fi


# Find the line number of the last occurrence of "];"
last_occurrence=$(grep -n '];' "$file_path" | tail -n 1 | cut -d ':' -f 1)

# If there is an occurrence of "];"
if [ -n "$last_occurrence" ]; then
    # Remove the last occurrence of "];"
    sed -i "${last_occurrence}d" "$file_path"
    # Add the plugin
    echo ',{"name":"Cheat_Menu","status":true,"description":"","parameters":{}}];' >> "$file_path"
fi
