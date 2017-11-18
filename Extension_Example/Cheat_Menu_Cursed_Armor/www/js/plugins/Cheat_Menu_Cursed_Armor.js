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

// In this case I'm adding an index that selects the stats specific to the game
Cheat_Menu.wolf_stat_1_selection = 0;
// The array of stats from the game (built later)
// 	these are then selected from the array with the above variable
Cheat_Menu.wolf_stats_1 = [];

// Again another index for selection for some other stats specific to the game
Cheat_Menu.wolf_stat_2_selection = 0;
// The array of stats from the game (built later)
// 	these are then selected from the array with the above variable
Cheat_Menu.wolf_stats_2 = [];


/////////////////////////////////////////////////
// Initial values for reseting on new game/load
/////////////////////////////////////////////////

// Here we can specifiy the initial value for any Cheat_Menu variables defined above
//	this is applied on game load and new games
// All values below are the inital values for a new saved game
//	upon loading a saved game these values will be loaded from the
//	save game if possible overwriting the below values
//	Because of this all of these variables should be non recursive

// In this case I want my indexs for my selection to reset to the 
//	first item in each list
Cheat_Menu.initial_values.wolf_stat_1_selection = 0;
Cheat_Menu.initial_values.wolf_stat_2_selection = 0;

/////////////////////////////////////////////////
// Cheat Functions
/////////////////////////////////////////////////

// Here I add the functions that will execute the cheats
//	these will be called from the menu

// Main Wolfzq Stats
Cheat_Menu.give_wolf_stat_1 = function(amount) {
    $w.addP(Cheat_Menu.wolf_stats_1[Cheat_Menu.wolf_stat_1_selection], amount);
}

// Other Wolfzq Stats (counts of acts)
Cheat_Menu.give_wolf_stat_2 = function(amount) {
    $w.addPC(Cheat_Menu.wolf_stats_2[Cheat_Menu.wolf_stat_2_selection], amount);
}

// Player Feel Down
Cheat_Menu.player_feel_down = function() {
    $we._playerFeel = 0;
}

// Player Stamina Full
Cheat_Menu.player_stamina_full = function() {
    $gameActors._data[1]._hp = $gameActors._data[1].mhp;
}

// Client Feel Up
Cheat_Menu.client_feel_up = function() {
    $we._enemyFeel = $we._enemyMaxFeel - 1;
}

// Client Stamina Down
Cheat_Menu.client_stamina_down = function() {
    $we._enemyHP -= Math.floor($we._enemyMaxHP / 10);
}

// Activate Sleep Event
Cheat_Menu.wolf_sleep_event = function() {
    $gameTemp.reserveCommonEvent(12);
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



// Here I creat the left and right handlers for scrolling between wolfzq's stats
//	all these do is move my selection index around for the array that I have for
//	the list of stats
// The handlers determine if they are being called by left or right clicks or button
//	presses by the checking the direction argument to see if it is "left" or "right"
Cheat_Menu.scroll_wolf_stat_1 = function(direction, event) {
	if (direction == "left") {
		Cheat_Menu.wolf_stat_1_selection--;
		if (Cheat_Menu.wolf_stat_1_selection < 0) {
			Cheat_Menu.wolf_stat_1_selection = Cheat_Menu.wolf_stats_1.length;
		}
	}
	else {
		Cheat_Menu.wolf_stat_1_selection++;
		if (Cheat_Menu.wolf_stat_1_selection >= Cheat_Menu.wolf_stats_1.length) {
			Cheat_Menu.wolf_stat_1_selection = 0;
		}
	}
	SoundManager.playSystemSound(0); // neurtral menu/open sound
	Cheat_Menu.update_menu();	// if any of these functions should refresh the menu call this 
}

// Again creating the handler, but this time for the other set of stats
Cheat_Menu.scroll_wolf_stat_2 = function(direction, event) {
	if (direction == "left") {
		Cheat_Menu.wolf_stat_2_selection--;
		if (Cheat_Menu.wolf_stat_2_selection < 0) {
			Cheat_Menu.wolf_stat_2_selection = Cheat_Menu.wolf_stats_2.length;
		}
	}
	else {
		Cheat_Menu.wolf_stat_2_selection++;
		if (Cheat_Menu.wolf_stat_2_selection >= Cheat_Menu.wolf_stats_2.length) {
			Cheat_Menu.wolf_stat_2_selection = 0;
		}
	}
	SoundManager.playSystemSound(0); // neurtral menu/open sound
	
	Cheat_Menu.update_menu();
}

//	The handlers for updating the stats
//		these are called what call the cheat functions in the above section
//		I generally also play a sound as well, but that isn't needed

// For amounts I now use scroll events, again the direction of the 
//	calling function is determined by the direction argument
Cheat_Menu.apply_current_wolf_stat_1 = function(direction, event) {
	var amount = Cheat_Menu.amounts[Cheat_Menu.amount_index];
	if (direction == "left") {
		amount = -amount;
		SoundManager.playSystemSound(2); // negative sound
	}
	else {
		SoundManager.playSystemSound(1); // positive sound
	}
    Cheat_Menu.give_wolf_stat_1(amount);
	Cheat_Menu.update_menu();
}

//	The handler for updating the other stats
Cheat_Menu.apply_current_wolf_stat_2 = function(direction, event) {
	var amount = Cheat_Menu.amounts[Cheat_Menu.amount_index];
	if (direction == "left") {
		amount = -amount;
		SoundManager.playSystemSound(2); // negative sound
	}
	else {
		SoundManager.playSystemSound(1); // positive sound
	}
    Cheat_Menu.give_wolf_stat_2(amount);
	Cheat_Menu.update_menu();
}

// The functions that append each of the stat menus
Cheat_Menu.append_wolf_stat_1_selection = function(key1, key2, key3, key4) {
    Cheat_Menu.append_title("Stat");

	var stat_string = "" + $w._paramsName[Cheat_Menu.wolf_stats_1[Cheat_Menu.wolf_stat_1_selection]];

	// a scroll selector with the left and right scrolling functions
	Cheat_Menu.append_scroll_selector(stat_string, key1, key2, Cheat_Menu.scroll_wolf_stat_1);
	var current_value = "" + $w._params[Cheat_Menu.wolf_stats_1[Cheat_Menu.wolf_stat_1_selection]];

	// a cheat function
	Cheat_Menu.append_scroll_selector(current_value, key3, key4, Cheat_Menu.apply_current_wolf_stat_1);
}

// Same as above but for the other stats
Cheat_Menu.append_wolf_stat_2_selection = function(key1, key2, key3, key4) {
    Cheat_Menu.append_title("Stat");

	var stat_string = "" + $w._paramsCountName[Cheat_Menu.wolf_stats_2[Cheat_Menu.wolf_stat_2_selection]];

	Cheat_Menu.append_scroll_selector(stat_string, key1, key2, Cheat_Menu.scroll_wolf_stat_2);
	var current_value = "" + $w._paramsCount[Cheat_Menu.wolf_stats_2[Cheat_Menu.wolf_stat_2_selection]];

	Cheat_Menu.append_scroll_selector(current_value, key3, key4, Cheat_Menu.apply_current_wolf_stat_2);
}

// Here I create function to append each cheat for the 3rd menu
//	these are for an ingame minigame
Cheat_Menu.append_minigame_cheats = function(key1, key2, key3, key4, key5) {
    Cheat_Menu.append_cheat("Player Feel Down", "Activate", key1, Cheat_Menu.player_feel_down);
	Cheat_Menu.append_cheat("Player Stamina Full", "Activate", key2, Cheat_Menu.player_stamina_full);
	Cheat_Menu.append_cheat("Client Feel Up", "Activate", key3, Cheat_Menu.client_feel_up);
	Cheat_Menu.append_cheat("Client Stamina Down", "Activate", key4, Cheat_Menu.client_stamina_down);
	Cheat_Menu.append_title("Misc Cheats");
	Cheat_Menu.append_cheat("Sleep Event", "Activate", key5, Cheat_Menu.wolf_sleep_event);
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
    Cheat_Menu.append_cheat_title("Cursed Stats 1"); 

	// bulding the list of stats if they haven't been built already, this is game specific
	if (Cheat_Menu.wolf_stats_1.length == 0) {
		for (var name in $w._params) {
			Cheat_Menu.wolf_stats_1[Cheat_Menu.wolf_stats_1.length] = name;
		}
	}

    Cheat_Menu.append_amount_selection(4, 5);
    Cheat_Menu.append_wolf_stat_1_selection(6, 7, 8, 9);
};

Cheat_Menu.menus[Cheat_Menu.menus.length] = function() {
    Cheat_Menu.append_cheat_title("Cursed Stats 2");

	// bulding the list of stats if they haven't been built already, this is game specific
	if (Cheat_Menu.wolf_stats_2.length == 0) {
		for (var name in $w._paramsCount) {
			Cheat_Menu.wolf_stats_2[Cheat_Menu.wolf_stats_2.length] = name;
		}
	}

    Cheat_Menu.append_amount_selection(4, 5);
    Cheat_Menu.append_wolf_stat_2_selection(6, 7, 8, 9);
};

Cheat_Menu.menus[Cheat_Menu.menus.length] = function() {
    Cheat_Menu.append_cheat_title("Cursed Minigame Cheats");
    Cheat_Menu.append_minigame_cheats(4, 5, 6, 7, 8);
};

// Misc
// New KeyCodes can be added with
// Cheat_Menu.keyCodes.NAME = {keyCode: KEYCODE, key_listener: MAPPING};
//		NAME: is the name for the mapping (can be any valid variable name)
//		KEYCODE: is the keyCode (number) of the button press for the keydown event
//		MAPPING: is the char/num/string mapping you pass into the append function
//					this will also appear as the text on the menu

// Everything else will be handled by the main Cheat_Menu plugin
