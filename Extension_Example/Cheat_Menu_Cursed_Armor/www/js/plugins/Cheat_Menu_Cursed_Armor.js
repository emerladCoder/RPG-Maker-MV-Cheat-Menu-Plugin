// Extension of the Cheat_Menu plugin for cheats specific to Cursed Armor by wolfzq
//	General guidlines for creating similar plugins are provided
//	Game is NSFW so... you've been warned

// Check if needed objects are already defined 
//	this is required in all plugins
//	this allows the plugin and the original Cheat_Menu 
//	plugin to be loaded in any order
if (typeof Cheat_Menu == "undefined") {
	Cheat_Menu = {};
}
if (typeof Cheat_Menu.initial_values == "undefined") {
	Cheat_Menu.initial_values = {};
}
if (typeof Cheat_Menu.menus == "undefined") {
	Cheat_Menu.menus = [];
}
if (typeof Cheat_Menu.keyCodes == "undefined") {
	Cheat_Menu.keyCodes = {};
}


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
//		scroll_left_handler, scroll_right_handler: functions
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


// Here I creat the left and right handlers for scrolling between wolfzq's stats
//	all these do is move my selection index around for the array that I have for
//	the list of stats
Cheat_Menu.scroll_left_wolf_stat_1 = function(event) {
	Cheat_Menu.wolf_stat_1_selection--;
	if (Cheat_Menu.wolf_stat_1_selection < 0) {
        Cheat_Menu.wolf_stat_1_selection = Cheat_Menu.wolf_stats_1.length;
	}
	Cheat_Menu.update_menu();	// if any of these functions should refresh the menu call this 
}

// the right counterpart for the above function
Cheat_Menu.scroll_right_wolf_stat_1 = function(event) {
	Cheat_Menu.wolf_stat_1_selection++;
    if (Cheat_Menu.wolf_stat_1_selection >= Cheat_Menu.wolf_stats_1.length) {
        Cheat_Menu.wolf_stat_1_selection = 0;
    }
	Cheat_Menu.update_menu();
}

// Again creating the handlers, but this time for the other set of stats
Cheat_Menu.scroll_left_wolf_stat_2 = function(event) {
	Cheat_Menu.wolf_stat_2_selection--;
	if (Cheat_Menu.wolf_stat_2_selection < 0) {
        Cheat_Menu.wolf_stat_2_selection = Cheat_Menu.wolf_stats_2.length;
	}
	Cheat_Menu.update_menu();
}

// the right counterpart for the above function

Cheat_Menu.scroll_right_wolf_stat_2 = function(event) {
	Cheat_Menu.wolf_stat_2_selection++;
    if (Cheat_Menu.wolf_stat_2_selection >= Cheat_Menu.wolf_stats_2.length) {
        Cheat_Menu.wolf_stat_2_selection = 0;
    }
	Cheat_Menu.update_menu();
}

//	The handlers for updating the stats
//		these are called what call the cheat functions
//		I generally also play a sound as well, but that isn't needed
Cheat_Menu.give_current_wolf_stat_1 = function() {
    Cheat_Menu.give_wolf_stat_1(Cheat_Menu.amounts[Cheat_Menu.amount_index]);
	Cheat_Menu.update_menu();

	SoundManager.playSystemSound(1); // positive sound
}

Cheat_Menu.remove_current_wolf_stat_1 = function() {
    Cheat_Menu.give_wolf_stat_1(-Cheat_Menu.amounts[Cheat_Menu.amount_index]);
	Cheat_Menu.update_menu();

	SoundManager.playSystemSound(2); // negative sound
}

//	The handlers for updating the other stats
Cheat_Menu.give_current_wolf_stat_2 = function() {
    Cheat_Menu.give_wolf_stat_2(Cheat_Menu.amounts[Cheat_Menu.amount_index]);
	Cheat_Menu.update_menu();

	SoundManager.playSystemSound(1);
}

Cheat_Menu.remove_current_wolf_stat_2 = function() {
    Cheat_Menu.give_wolf_stat_2(-Cheat_Menu.amounts[Cheat_Menu.amount_index]);
	Cheat_Menu.update_menu();

	SoundManager.playSystemSound(2);
}

// The functions that append each of the stat menus
Cheat_Menu.append_wolf_stat_1_selection = function(key1, key2, key3, key4) {
    Cheat_Menu.append_title("Stat");

	var stat_string = "" + $w._paramsName[Cheat_Menu.wolf_stats_1[Cheat_Menu.wolf_stat_1_selection]];

	// a scroll selector with the left and right scrolling functions
	Cheat_Menu.append_scroll_selector(stat_string, key1, key2, Cheat_Menu.scroll_left_wolf_stat_1, Cheat_Menu.scroll_right_wolf_stat_1);
	var current_value = "" + $w._params[Cheat_Menu.wolf_stats_1[Cheat_Menu.wolf_stat_1_selection]];

	// a cheat function
	Cheat_Menu.append_scroll_selector(current_value, key3, key4, Cheat_Menu.remove_current_wolf_stat_1, Cheat_Menu.give_current_wolf_stat_1);
}

// Same as above but for the other stats
Cheat_Menu.append_wolf_stat_2_selection = function(key1, key2, key3, key4) {
    Cheat_Menu.append_title("Stat");

	var stat_string = "" + $w._paramsCountName[Cheat_Menu.wolf_stats_2[Cheat_Menu.wolf_stat_2_selection]];

	Cheat_Menu.append_scroll_selector(stat_string, key1, key2, Cheat_Menu.scroll_left_wolf_stat_2, Cheat_Menu.scroll_right_wolf_stat_2);
	var current_value = "" + $w._paramsCount[Cheat_Menu.wolf_stats_2[Cheat_Menu.wolf_stat_2_selection]];

	Cheat_Menu.append_scroll_selector(current_value, key3, key4, Cheat_Menu.remove_current_wolf_stat_2, Cheat_Menu.give_current_wolf_stat_2);
}

// Here I create functions to append each cheat for the 3rd menu
//	these are for an ingame minigame
//	this could easily be simplified to one function
Cheat_Menu.append_player_feel_down = function(key1) {
    Cheat_Menu.append_cheat("Player Feel Down", "Activate", key1, Cheat_Menu.player_feel_down);
}

Cheat_Menu.append_player_stamina_full = function(key1) {
    Cheat_Menu.append_cheat("Player Stamina Full", "Activate", key1, Cheat_Menu.player_stamina_full);
}

Cheat_Menu.append_client_feel_up = function(key1) {
    Cheat_Menu.append_cheat("Client Feel Up", "Activate", key1, Cheat_Menu.client_feel_up);
}

Cheat_Menu.append_client_stamina_down = function(key1) {
    Cheat_Menu.append_cheat("Client Stamina Down", "Activate", key1, Cheat_Menu.client_stamina_down);
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

	if (Cheat_Menu.wolf_stats_2.length == 0) {
		for (var name in $w._paramsCount) {
			Cheat_Menu.wolf_stats_2[Cheat_Menu.wolf_stats_2.length] = name;
		}
	}

    Cheat_Menu.append_amount_selection(4, 5);
    Cheat_Menu.append_wolf_stat_2_selection(6, 7, 8, 9);
};

Cheat_Menu.menus[Cheat_Menu.menus.length] = function() {
    Cheat_Menu.append_cheat_title("Cursed Prostitute Cheats");
    Cheat_Menu.append_player_feel_down(4);
    Cheat_Menu.append_player_stamina_full(5);
    Cheat_Menu.append_client_feel_up(6);
    Cheat_Menu.append_client_stamina_down(7);
};

// Misc
// New KeyCodes can be added with
// Cheat_Menu.keyCodes.NAME = {keyCode: KEYCODE, key_listener: MAPPING};
//		NAME: is the name for the mapping
//		KEYCODE: is the keyCode of the button press for the keydown event
//		MAPPING: is the char/num/string mapping you pass into the append function
//					this will also appear as the text on the menu

// Everything else will be handled by the main Cheat_Menu plugin
