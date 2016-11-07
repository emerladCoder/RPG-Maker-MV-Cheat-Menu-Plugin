
Back you shit up (mainly your plugins.js file) first, not my fault if it breaks something

Install

1)	Unpack Game if needed
	Use one of these tools: http://www.ulmf.org/bbs/showpost.php?p=830445&postcount=91

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
1)	Delete www/js/plugins/Cheat_Menu.js
	and
		   www/js/plugins/Cheat_Menu.css

2)	Remove plugin entry from www/js/plugins.js

	a)	Ideally you can just restore you backup of plugins.js

3)	Delete MVPluginPatcher.exe and plugins_patch.txt if you haven't already
