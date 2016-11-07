RPG Maker MV Cheat Menu Plugin
==============================

I've created a plugin for RPG Maker MV that allows users to access a Cheat Menu in game. The controls are all input via the number keys \[0\]\-\[9\] (not the NUMPAD).

Open the Menu by pressing the \[1\] Key.  
Move menu to different positions with \` (key with tilde ~)  
Scroll between cheats with \[2\] and \[3\] Keys.  
Any \[#\] indicates a number key to press to cause an action, if you don't want to click.  

The menu can also be interacted with by clicking (everything except opening can be done with the mouse).  
Edit: Controls are much move intuitive now, everything is left click and clickable elements will be highlighted on hover over.

Available Cheats Are
--------------------

* God Mode for any Actor (infinite hp and mp, skills shouldn't cost anything)
* Set Enemy HP to 0 hp or 1 hp
* Toggle No Clip
* Edit Exp
* Edit Stats
* Edit Gold
* Edit Items, Weapons, Armor
* Change player movement speed
* Clear Status/States Effects
* Open javascript console/developer tools with F8
 * With this you can edit game Variables and Switches (at your own risk) in the $gameVariables and $gameSwitches, as well as other advanced stuff
 
Install
-------

* Unpack Game if needed.
 * Use one of these tools: [link](http://www.ulmf.org/bbs/showpost.php?p=830445&postcount=91)
* Copy and Paste this contents of Cheat_Menu folder into folder with Game.exe
* Patch your www/js/plugins.js
 * Backup your www/js/plugins.js file
 * Patch
      * Run MVPluginPatcher.exe  
        or
      * Manually Add the following to your plugins.js file
        * {"name":"Cheat_Menu","status":true,"description":"","parameters":{}}
 * Delete MVPluginPatcher.exe and plugins_patch.txt
 
Uninstall
---------

* Delete www/js/plugins/Cheat_Menu.js and www/js/plugins/Cheat_Menu.css
* Remove plugin entry from www/js/plugins.js
 * Ideally you can just restore you backup of plugins.js
* Delete MVPluginPatcher.exe and plugins_patch.txt if you haven't already

Downloads
---------
Download: [mega link](https://mega.nz/#!VpYiWKSD!QaPex0_-ABMjVwN4mhEJc7y8Onijayw0IbsY5TKjo74)

Folder of all versions: [mega link](https://mega.nz/#F!gk4l3BLQ!lWPFyecd2bLHnn_l8frzlg)

I've tested this to work with Cursed Armor and 魔王イリスの逆襲[RJ176175]

If there's a better place to post this please feel free to move this thread (if possible).

Other Cool Stuff
----------------
I might also suggest Libellule's text hook for untranslated games: [thread](http://www.ulmf.org/bbs/showthread.php?t=29359)  
It has a packaged version of my Cheat Menu, just note it is outdated at the moment so if you install my plugin with his patcher just overwrite with the /www folder downloaded from the most recent version here.

Froggus has a save editor that works with a bunch of versions of RPG maker games including MV: [thread](http://www.ulmf.org/bbs/showthread.php?t=28936)

Initial Edits (unversioned)
---------------------------
v2 Original version on this thread  
v3 Updated for mouse controls and editing gold  
v4 Update edit inventory, open console  
v5 Fix for undefined inventory items  
v6 CRLF output changed to just LF for patcher  
v7 Can toggle between menu positions with ~ key (4 corners and center)  
v8 Initialization bug for godmode (was initializing every time menu was opened)  
v9 Added cheat to change player movement speed  
v10 Tweaked interface  
v11 Stupidity Checks and More Interface Tweaking  
v12 Added 1 second timer for more active updates (in game changes will show up on the menu without having to manually refresh)  
v13 Updated initialization to fire for new games as well as load games, menu hotkeys only function with no control keys (alt, shift, ctrl) held down  
v14 Added remove states/status for actors, added some more calls to sfx, fixed set enemy hp to 1 to actually set to 1 and not 0  
