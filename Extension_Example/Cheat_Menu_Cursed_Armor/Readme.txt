Requires Cheat_Menu plugin installed as well (install order doesn't matter)

Back your shit up (mainly your plugins.js file) first, not my fault if my patcher breaks something

Install
1)	Unpack Game if needed
	I use this tool by Kao: https://emerladcoder.github.io/Files/EnigmaVBUnpacker_v0.41a.zip
    	Select GameFolder/Game.exe and hit unpack
    	Rename GameFolder/%DEFAULT FOLDER% to something without the % signs
    	Copy any GameFolder/www folder from original directory into the renamed GameFolder/%DEFAULT FOLDER% direcotry
    	The renamed GameFolder/%DEFAULT FOLDER% is your new game folder (place it wherever you like, and use it for the steps below), run with the Game.exe in that folder
  	Alternately Use one of these tools if the above doesn't work: http://www.ulmf.org/bbs/showpost.php?p=830445&postcount=91
    	I don't use these so your on your own for instructions

2)	Copy and Paste this contents of this folder into folder with Game.exe

3)	Patch your www/js/plugins.js
	a)	Backup your www/js/plugins.js file
	b)	Patch
			Run MVPluginPatcher.exe
				or
			Manually Add the following to your plugins.js file
			{"name":"Cheat_Menu","status":true,"description":"","parameters":{}}
4)	Delete MVPluginPatcher.exe and plugins_patch.txt


Uninstall
1)	Delete www/js/plugins/Cheat_Menu.js and www/js/plugins/Cheat_Menu.css
2)	Remove plugin entry from www/js/plugins.js
	a)	Ideally you can just restore you backup of plugins.js
3)	Delete MVPluginPatcher.exe and plugins_patch.txt if you haven't already
