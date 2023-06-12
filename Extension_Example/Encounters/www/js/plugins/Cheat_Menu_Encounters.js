// Extension of the Cheat_Menu plugin for cheats specific to Cursed Armor by wolfzq
//	General guidlines for creating similar plugins are provided
//	Game is NSFW so... you've been warned

// Check if needed objects are already defined 
//	this is required in all plugins
//	this allows the plugin and the original Cheat_Menu 
//	plugin to be loaded in any order
if (typeof Cheat_Menu == "undefined") { Cheat_Menu = {}; }
if (typeof Cheat_Menu.initial_values == "undefined") { Cheat_Menu.initial_values = {}; }
if (typeof Cheat_Menu.menus == "undefined") { Cheat_Menu.menus = []; }
if (typeof Cheat_Menu.keyCodes == "undefined") { Cheat_Menu.keyCodes = {}; }


//////////////////////////
// Cheats Class 
//////////////////////////

// Here I add new globals in the cheat menu object that are used for cheats

// interval for setting encounter to fixed value
Cheat_Menu.encounterInterval = null;
Cheat_Menu.encounterIntervalValue = 1;



/////////////////////////////////////////////////
// Initial values for reseting on new game/load
/////////////////////////////////////////////////

// Here we can specifiy the initial value for any Cheat_Menu variables defined above
//	this is applied on game load and new games
// All values below are the inital values for a new saved game
//	upon loading a saved game these values will be loaded from the
//	save game if possible overwriting the below values
//	Because of this all of these variables should be non recursive


/////////////////////////////////////////////////
// Cheat Functions
/////////////////////////////////////////////////

// Here I add the functions that will execute the cheats
//	these will be called from the menu

// freeze encounter value
Cheat_Menu.freezeEncounterValue = function() {
    Cheat_Menu.encounterIntervalValue = $gamePlayer._encounterCount;
	clearInterval(Cheat_Menu.encounterInterval);
	Cheat_Menu.encounterInterval = setInterval(function(){
		$gamePlayer._encounterCount = Cheat_Menu.encounterIntervalValue;
	},100);
	SoundManager.playSystemSound(1);
	Cheat_Menu.update_menu();
}

// unfreeze encounter value
Cheat_Menu.unfreezeEncounterValue = function() {
	clearInterval(Cheat_Menu.encounterInterval);
	Cheat_Menu.encounterInterval = null;
	SoundManager.playSystemSound(2);
	Cheat_Menu.update_menu();
}

Cheat_Menu.change_encounter_steps = function(amount) {
	Cheat_Menu.encounterIntervalValue += amount;
	$gamePlayer._encounterCount += amount;
}


/////////////////////////////////////////////////////////////
// Various functions to settup each page of the cheat menu
/////////////////////////////////////////////////////////////

// Now its time to create the functions that build each part of 
//	the new menus

// To do this a number of helper functions are available

////Cheat_Menu.append_scroll_selector(text, key1, key2, scroll_left_handler, scroll_right_handler)
//		insert row with buttons to scroll left and right for some context
//		
//		appears as:
//		<-[key1] text [key2]->
//
//		scrolling is handled by scroll_left_handler and scroll_right_handler functions
//
//		text: string 
// 		key1,key2: key mapping
//		scroll_handler: single function that handles the left and right scroll arguments should be (direction, event)
//
//		Provided selectors include:
//
////////Cheat_Menu.append_cheat_title(cheat_name)
//			Menu title with scroll options to go between menu, should be first
//			append on each menu
//
////////Cheat_Menu.append_amount_selection(key1, key2)
// 			append the amount selection to the menu
//
//
////Cheat_Menu.append_cheat(cheat_text, status_text, key, click_handler)
//		Append a cheat with some handler to activate
//		
//		Appears as:
//		cheat text	status text[key]
//
//		cheat_text: string
//		status_text: string 
//		key: key mapping
//		click_handler: function
//
//
////Cheat_Menu.append_title(title) 
//		Insert a title row
//		A row in the menu that is just text
//		title: string
//
//
////Cheat_Menu.append_description(text) 
//		Insert a desciption row
//		A row in the menu that is just text (smaller text than than title)
//		text: string


Cheat_Menu.encounterScrollHandler = function(direction, event) {
	var amount = Cheat_Menu.amounts[Cheat_Menu.amount_index];
	if (direction == "left") {
		amount = -amount;
		SoundManager.playSystemSound(2);
	}
	else {
		SoundManager.playSystemSound(1);
	}
	Cheat_Menu.change_encounter_steps(amount);
	Cheat_Menu.update_menu();
}



//	The handlers for updating the stats
//		these are called what call the cheat functions in the above section
//		I generally also play a sound as well, but that isn't needed

// For amounts I now use scroll events, again the direction of the 
//	calling function is determined by the direction argument


// The functions that append each of the stat menus
Cheat_Menu.append_encounter_cheats = function(key1, key2, key3, key4, key5) {
	Cheat_Menu.append_amount_selection(key1, key2);
	Cheat_Menu.append_scroll_selector($gamePlayer._encounterCount, key3, key4, Cheat_Menu.encounterScrollHandler)
	Cheat_Menu.append_cheat("Freeze", (Cheat_Menu.encounterInterval == null ? "<font color='#ff0000'>false</font>" : "<font color='#00ff00'>true</font>"), key5, (Cheat_Menu.encounterInterval == null ? Cheat_Menu.freezeEncounterValue : Cheat_Menu.unfreezeEncounterValue))
}



//////////////////////////////////////////////////////////////////////////////////
// Final Functions for building each Menu and function list for updating the menu
//////////////////////////////////////////////////////////////////////////////////

// For the last step we must actually append the menus with the functions that create them
// 	these are all added the Cheat_Menu.menus list which is responsible for creating cycling
//	between the menus

Cheat_Menu.menus[Cheat_Menu.menus.length] = function() {
	// all cheat menus should have a title cheat as it 
	//	provides the scroll for switching between cheats
    Cheat_Menu.append_cheat_title("Encounters"); 
    Cheat_Menu.append_encounter_cheats(4, 5, 6, 7, 8);
};



// Misc
// New KeyCodes can be added with
// Cheat_Menu.keyCodes.NAME = {keyCode: KEYCODE, key_listener: MAPPING};
//		NAME: is the name for the mapping (can be any valid variable name)
//		KEYCODE: is the keyCode (number) of the button press for the keydown event
//		MAPPING: is the char/num/string mapping you pass into the append function
//					this will also appear as the text on the menu

// Everything else will be handled by the main Cheat_Menu plugin
