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

    # Check if the last character is a comma
    last_char=$(tail -n 1 "$file_path" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')
    if [ "${last_char: -1}" = "," ]; then
        # Comma already present, no need to add one
        comma_needed=false
    else
        # Comma not present, add one
        comma_needed=true
    fi

    # If a comma is needed, add it
    if $comma_needed; then
        sed -i '$s/$/,/' "$file_path"
    fi

    # Add the plugin
    echo '{"name":"Cheat_Menu","status":true,"description":"","parameters":{}}];' >> "$file_path"
fi
