

/////////////////////////////////////////////////
// Cheat Menu Plugin Class
/////////////////////////////////////////////////
var Cheat_Menu = {};

Cheat_Menu.initialized = false;
Cheat_Menu.cheat_menu_open = false;
Cheat_Menu.overlay_openable = false;
Cheat_Menu.position = 1;
Cheat_Menu.menu_update_timer = null;

Cheat_Menu.cheat_selected = 0;
Cheat_Menu.cheat_selected_actor = 1;
Cheat_Menu.amounts = [-100000, -10000, -1000, -100, -10, -1, 1, 10, 100, 1000, 10000, 100000];
Cheat_Menu.amount_index = 6;
Cheat_Menu.current_classes = [];
Cheat_Menu.class_selection = 0;
Cheat_Menu.stat_selection = 0;
Cheat_Menu.item_selection = 1;
Cheat_Menu.weapon_selection = 1;
Cheat_Menu.armor_selection = 1;
Cheat_Menu.move_amounts = [-1, 1];
Cheat_Menu.move_amount_index = 1;



/////////////////////////////////////////////////
// Cheat Functions
/////////////////////////////////////////////////

// enable god mode for an actor
Cheat_Menu.god_mode = function(actor) {
	if (actor instanceof Game_Actor && !(actor.god_mode)) {
		actor.god_mode = true;

		actor.gainHP_bkup = actor.gainHp;
		actor.gainHp = function(value) {
			if (value < 0) {
				value = 0;
			}
			this.gainHP_bkup(value);
		};

		actor.setHp_bkup = actor.setHp;
		actor.setHp = function(hp) {
			hp = Math.max(1, hp);
			this.setHp_bkup(hp);
		}

		actor.gainMp_bkup = actor.gainMp;
		actor.gainMp = function (value) {
			if (value < 0) {
				value = 0;
			}
			this.gainMp_bkup(value);
		};

		actor.gainTp_bkup = actor.gainTp;
		actor.gainTp = function (value) {
			if (value < 0) {
				value = 0;
			}
			this.gainTp_bkup(value);
		};

		actor.paySkillCost_bkup = actor.paySkillCost;
		actor.paySkillCost = function (skill) {
			// do nothing
		};

		actor.god_mode_interval = setInterval(function() {
			actor._hp = actor.mhp;
			actor._mp = actor.mmp;
		}, 100);
	}
};


// disable god mode for an actor
Cheat_Menu.god_mode_off = function(actor) {
	if (actor instanceof Game_Actor && actor.god_mode) {
		actor.god_mode = false;

		actor.gainHp = actor.gainHP_bkup;
		actor.setHp = actor.setHp_bkup;
		actor.gainMp = actor.gainMp_bkup;
		actor.gainTp = actor.gainTp_bkup;
		actor.paySkillCost = actor.paySkillCost_bkup;

		clearInterval(actor.god_mode_interval);
	}
};

// set all enemies hp
Cheat_Menu.set_enemy_hp = function(hp) {
	for (var i = 0; i < $gameTroop._enemies.length; i++) {
		if ($gameTroop._enemies[i]) {
			$gameTroop._enemies[i]._hp = hp;
		}
	}
};

// increase class exp
Cheat_Menu.give_exp = function(actor, class_index, amount) {
	if (actor instanceof Game_Actor) {
		if (actor._exp[class_index] != undefined) {
			actor._exp[class_index] += amount;
		}
	}
};

// increase stat bonus
Cheat_Menu.give_stat = function(actor, stat_index, amount) {
	if (actor instanceof Game_Actor) {
		if (actor._paramPlus[stat_index] != undefined) {
			actor._paramPlus[stat_index] += amount;
		}
	}
};

// increase gold
Cheat_Menu.give_gold = function(amount) {
	$gameParty._gold += amount;
};

// increase item count for party of item, by id
Cheat_Menu.give_item = function(item_id, amount) {
	if ($dataItems[item_id] != undefined) {
		if ($gameParty._items[item_id] == undefined) {
			$gameParty._items[item_id] = amount;
		}
		else {
			$gameParty._items[item_id] += amount;
		}
	}
}

// increase weapon count for party of item, by id
Cheat_Menu.give_weapon = function(weapon_id, amount) {
	if ($dataWeapons[weapon_id] != undefined) {
		if ($gameParty._weapons[weapon_id] == undefined) {
			$gameParty._weapons[weapon_id] = amount;
		}
		else {
			$gameParty._weapons[weapon_id] += amount;
		}
	}
}

// increase armor count for party of item, by id
Cheat_Menu.give_armor = function(armor_id, amount) {
	if ($dataArmors[armor_id] != undefined) {
		if ($gameParty._armors[armor_id] == undefined) {
		$gameParty._armors[armor_id] = amount;
		}
		else {
			$gameParty._armors[armor_id] += amount;
		}
	}
}

// change player movement speed
Cheat_Menu.change_player_speed = function(amount) {
	$gamePlayer._moveSpeed += amount;
}

// clear active states on an actor
Cheat_Menu.clear_actor_states = function(actor) {
	if (actor instanceof Game_Actor) {
		if (actor._states != undefined && actor._states.length > 0) {
			actor._states = [];
		}
	}
}

/////////////////////////////////////////////////
// Cheat Menu overlay
/////////////////////////////////////////////////

Cheat_Menu.overlay_box = document.createElement('div');
Cheat_Menu.overlay_box.id = "cheat_menu";
Cheat_Menu.overlay_box.style.left = "5px";
Cheat_Menu.overlay_box.style.top = "5px";
Cheat_Menu.overlay_box.style.right = "";
Cheat_Menu.overlay_box.style.bottom = "";

Cheat_Menu.overlay = document.createElement('table');
Cheat_Menu.overlay.id = "cheat_menu_text";
Cheat_Menu.overlay.style.left = "5px";
Cheat_Menu.overlay.style.top = "5px";
Cheat_Menu.overlay.style.right = "";
Cheat_Menu.overlay.style.bottom = "";


Cheat_Menu.style_css = document.createElement("link");
Cheat_Menu.style_css.type = "text/css";
Cheat_Menu.style_css.rel = "stylesheet";
Cheat_Menu.style_css.href = "js/plugins/Cheat_Menu.css";
document.head.appendChild(Cheat_Menu.style_css);


// keep menu in correct location
Cheat_Menu.position_menu = function(event) {
	//middle of screen
	if (Cheat_Menu.position == 0) {
		Cheat_Menu.overlay_box.style.left = "" + (window.innerWidth / 2) + "px";
		Cheat_Menu.overlay_box.style.top = "" + (window.innerHeight / 2) + "px";
		Cheat_Menu.overlay_box.style.right = "";
		Cheat_Menu.overlay_box.style.bottom = "";

		Cheat_Menu.overlay_box.style.marginLeft = "-110px";
		Cheat_Menu.overlay_box.style.marginTop = "-50px";

		Cheat_Menu.overlay.style.left = "" + (window.innerWidth / 2) + "px";
		Cheat_Menu.overlay.style.top = "" + (window.innerHeight / 2) + "px";
		Cheat_Menu.overlay.style.right = "";
		Cheat_Menu.overlay.style.bottom = "";

		Cheat_Menu.overlay.style.marginLeft = "-110px";
		Cheat_Menu.overlay.style.marginTop = "-50px";
	}
	// top left corner
	else if (Cheat_Menu.position == 1) {
		Cheat_Menu.overlay_box.style.left = "5px";
		Cheat_Menu.overlay_box.style.top = "5px";
		Cheat_Menu.overlay_box.style.right = "";
		Cheat_Menu.overlay_box.style.bottom = "";

		Cheat_Menu.overlay_box.style.marginLeft = "";
		Cheat_Menu.overlay_box.style.marginTop = "";

		Cheat_Menu.overlay.style.left = "5px";
		Cheat_Menu.overlay.style.top = "5px";
		Cheat_Menu.overlay.style.right = "";
		Cheat_Menu.overlay.style.bottom = "";

		Cheat_Menu.overlay.style.marginLeft = "";
		Cheat_Menu.overlay.style.marginTop = "";
	}
	// top right corner
	else if (Cheat_Menu.position == 2) {
		Cheat_Menu.overlay_box.style.left = "";
		Cheat_Menu.overlay_box.style.top = "5px";
		Cheat_Menu.overlay_box.style.right = "5px";
		Cheat_Menu.overlay_box.style.bottom = "";

		Cheat_Menu.overlay_box.style.marginLeft = "";
		Cheat_Menu.overlay_box.style.marginTop = "";

		Cheat_Menu.overlay.style.left = "";
		Cheat_Menu.overlay.style.top = "5px";
		Cheat_Menu.overlay.style.right = "-15px";
		Cheat_Menu.overlay.style.bottom = "";

		Cheat_Menu.overlay.style.marginLeft = "";
		Cheat_Menu.overlay.style.marginTop = "";
	}
	// bottom right corner
	else if (Cheat_Menu.position == 3) {
		Cheat_Menu.overlay_box.style.left = "";
		Cheat_Menu.overlay_box.style.top = "";
		Cheat_Menu.overlay_box.style.right = "5px";
		Cheat_Menu.overlay_box.style.bottom = "5px";

		Cheat_Menu.overlay_box.style.marginLeft = "";
		Cheat_Menu.overlay_box.style.marginTop = "";

		Cheat_Menu.overlay.style.left = "";
		Cheat_Menu.overlay.style.top = "";
		Cheat_Menu.overlay.style.right = "-15px";
		Cheat_Menu.overlay.style.bottom = "5px";

		Cheat_Menu.overlay.style.marginLeft = "";
		Cheat_Menu.overlay.style.marginTop = "";
	}
	// bottom left corner
	else if (Cheat_Menu.position == 4) {
		Cheat_Menu.overlay_box.style.left = "5px";
		Cheat_Menu.overlay_box.style.top = "";
		Cheat_Menu.overlay_box.style.right = "";
		Cheat_Menu.overlay_box.style.bottom = "5px";

		Cheat_Menu.overlay_box.style.marginLeft = "";
		Cheat_Menu.overlay_box.style.marginTop = "";

		Cheat_Menu.overlay.style.left = "5px";
		Cheat_Menu.overlay.style.top = "";
		Cheat_Menu.overlay.style.right = "";
		Cheat_Menu.overlay.style.bottom = "5px";

		Cheat_Menu.overlay.style.marginLeft = "";
		Cheat_Menu.overlay.style.marginTop = "";
	}
	
	// adjust background box size to match contents
	var height = 20;
	for (var i = 0; i < Cheat_Menu.overlay.children.length; i++) {
		height += Cheat_Menu.overlay.children[i].scrollHeight;
	}
	Cheat_Menu.overlay_box.style.height = "" + height + "px";
};

// insert row with buttons to scroll left and right for some context
Cheat_Menu.append_scroll_selector = function(text, key1, key2, scroll_left_handler, scroll_right_handler) {
	var scroll_selector = Cheat_Menu.overlay.insertRow();
	scroll_selector.className = "scroll_selector_row";

	var scroll_left_button = scroll_selector.insertCell();
	scroll_left_button.className = "scroll_selector_buttons cheat_menu_cell";

	
	var scroll_text = scroll_selector.insertCell();
	scroll_text.className = "cheat_menu_cell";

	var scroll_right_button = scroll_selector.insertCell();
	scroll_right_button.className = "scroll_selector_buttons cheat_menu_cell";
	
	scroll_left_button.innerHTML = "←[" + key1 + "]";
	scroll_text.innerHTML = text;
	scroll_right_button.innerHTML =  "[" + key2 + "]→";

	scroll_left_button.addEventListener('mousedown', scroll_left_handler);
	scroll_right_button.addEventListener('mousedown', scroll_right_handler);
}

// insert a title row
Cheat_Menu.append_title = function(title) {
	var title_row = Cheat_Menu.overlay.insertRow();
	var temp = title_row.insertCell()
	temp.className = "cheat_menu_cell_title";
	var title_text = title_row.insertCell();
	title_text.className = "cheat_menu_cell_title";
	temp = title_row.insertCell()
	temp.className = "cheat_menu_cell_title";
	title_text.innerHTML = title;
}

// append a cheat with some handler to activate
Cheat_Menu.append_cheat = function(cheat_text, status_text, key, click_handler) {
	var cheat_row = Cheat_Menu.overlay.insertRow();

	var cheat_title = cheat_row.insertCell();
	cheat_title.className = "cheat_menu_cell"
	var temp = cheat_row.insertCell()
	temp.className = "cheat_menu_cell";
	var cheat = cheat_row.insertCell();
	cheat.className = "cheat_menu_buttons cheat_menu_cell";

	cheat_title.innerHTML = cheat_text;
	cheat.innerHTML = status_text + "[" + key + "]";

	cheat.addEventListener('mousedown', click_handler);
}

//
// various functions to settup each page of the cheat menu
//

Cheat_Menu.scroll_left_cheat = function() {
	Cheat_Menu.cheat_selected--;
	if (Cheat_Menu.cheat_selected < 0) {
		Cheat_Menu.cheat_selected = 10;
	}
	SoundManager.playSystemSound(0);
	Cheat_Menu.update_menu();
}

Cheat_Menu.scroll_right_cheat = function() {
	Cheat_Menu.cheat_selected++;
	if (Cheat_Menu.cheat_selected > 10) {
		Cheat_Menu.cheat_selected = 0;
	}
	SoundManager.playSystemSound(0);
	Cheat_Menu.update_menu();
}

Cheat_Menu.append_cheat_title = function(cheat_name) {
	Cheat_Menu.append_title("Cheat");
	Cheat_Menu.append_scroll_selector(cheat_name, 2, 3, Cheat_Menu.scroll_left_cheat, Cheat_Menu.scroll_right_cheat);
}

Cheat_Menu.scroll_left_actor = function() {
	Cheat_Menu.cheat_selected_actor--;
	if (Cheat_Menu.cheat_selected_actor < 0) {
		Cheat_Menu.cheat_selected_actor = $gameActors._data.length - 1;
	}
	SoundManager.playSystemSound(0);
	Cheat_Menu.update_menu();
}

Cheat_Menu.scroll_right_actor = function() {
	Cheat_Menu.cheat_selected_actor++;
	if (Cheat_Menu.cheat_selected_actor >= $gameActors._data.length) {
		Cheat_Menu.cheat_selected_actor = 0;
	}
	SoundManager.playSystemSound(0);
	Cheat_Menu.update_menu();
}

Cheat_Menu.append_actor_selection = function(key1, key2) {
	Cheat_Menu.append_title("Actor");

	var actor_name;

	if ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor]._name) {
		actor_name = "<font color='#0088ff'>" + $gameActors._data[Cheat_Menu.cheat_selected_actor]._name + "</font>";
	}
	else {
		actor_name = "<font color='#ff0000'>NULL</font>";
	}

	Cheat_Menu.append_scroll_selector(actor_name, key1, key2, Cheat_Menu.scroll_left_actor, Cheat_Menu.scroll_right_actor);
}

Cheat_Menu.god_mode_toggle = function(event) {
	if ($gameActors._data[Cheat_Menu.cheat_selected_actor]) {
		if (!($gameActors._data[Cheat_Menu.cheat_selected_actor].god_mode)) {
			Cheat_Menu.god_mode($gameActors._data[Cheat_Menu.cheat_selected_actor]);
			SoundManager.playSystemSound(1);
		}
		else {
			Cheat_Menu.god_mode_off($gameActors._data[Cheat_Menu.cheat_selected_actor]);
			SoundManager.playSystemSound(2);
		}
		Cheat_Menu.update_menu();
	}
}

Cheat_Menu.append_godmode_status = function() {
	var status_text;
	if ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor].god_mode) {
		status_text = "<font color='#00ff00'>on</font>";
	}
	else {
		status_text = "<font color='#ff0000'>off</font>";
	}

	Cheat_Menu.append_cheat("Status:", status_text, 6, Cheat_Menu.god_mode_toggle);
}

Cheat_Menu.enemy_hp_cheat_1 = function() {
	Cheat_Menu.set_enemy_hp(0);
	SoundManager.playSystemSound(1);
}

Cheat_Menu.enemy_hp_cheat_2 = function() {
	Cheat_Menu.set_enemy_hp(1);
	SoundManager.playSystemSound(1);
}

Cheat_Menu.append_enemy_cheats = function(key1, key2) {
	Cheat_Menu.append_cheat("Enemy HP to 0", "Activate", key1, Cheat_Menu.enemy_hp_cheat_1);
	Cheat_Menu.append_cheat("Enemy HP to 1", "Activate", key2, Cheat_Menu.enemy_hp_cheat_2);
}

Cheat_Menu.toggle_no_clip_status = function(event) {
	$gamePlayer._through = !($gamePlayer._through);
	Cheat_Menu.update_menu();
	if ($gamePlayer._through) {
		SoundManager.playSystemSound(1);
	}
	else {
		SoundManager.playSystemSound(2);
	}
}

Cheat_Menu.append_no_clip_status = function(key1) {
	var status_text;
	if ($gamePlayer._through) {
		status_text = "<font color='#00ff00'>on</font>";
	}
	else {
		status_text = "<font color='#ff0000'>off</font>";
	}

	Cheat_Menu.append_cheat("Status:", status_text, key1, Cheat_Menu.toggle_no_clip_status);
}

Cheat_Menu.move_left_amount = function() {
	Cheat_Menu.amount_index--;
	if (Cheat_Menu.amount_index < 0) {
		Cheat_Menu.amount_index = 0;
		SoundManager.playSystemSound(2);
	}
	else {
		SoundManager.playSystemSound(1);
	}
	Cheat_Menu.update_menu();
}

Cheat_Menu.move_right_amount = function() {
	Cheat_Menu.amount_index++;
	if (Cheat_Menu.amount_index >= Cheat_Menu.amounts.length) {
		Cheat_Menu.amount_index = Cheat_Menu.amounts.length - 1;
		SoundManager.playSystemSound(2);
	}
	else {
		SoundManager.playSystemSound(1);
	}
	Cheat_Menu.update_menu();
}

Cheat_Menu.append_amount_selection = function(key1, key2) {
	Cheat_Menu.append_title("Amount");

	var current_amount = "<font color='#0088ff'>" + Cheat_Menu.amounts[Cheat_Menu.amount_index] + "</font>";
	Cheat_Menu.append_scroll_selector(current_amount, key1, key2, Cheat_Menu.move_left_amount, Cheat_Menu.move_right_amount);
}

Cheat_Menu.move_left_move_amount = function() {
	Cheat_Menu.move_amount_index--;
	if (Cheat_Menu.move_amount_index < 0) {
		Cheat_Menu.move_amount_index = 0;
		SoundManager.playSystemSound(2);
	}
	else {
		SoundManager.playSystemSound(1);
	}
	Cheat_Menu.update_menu();
}

Cheat_Menu.move_right_move_amount = function() {
	Cheat_Menu.move_amount_index++;
	if (Cheat_Menu.move_amount_index >= Cheat_Menu.move_amounts.length) {
		Cheat_Menu.move_amount_index = Cheat_Menu.move_amounts.length - 1;
		SoundManager.playSystemSound(2);
	}
	else {
		SoundManager.playSystemSound(1);
	}
	Cheat_Menu.update_menu();
}

Cheat_Menu.append_move_amount_selection = function(key1, key2) {
	Cheat_Menu.append_title("Amount");

	var current_amount = "<font color='#0088ff'>" + Cheat_Menu.move_amounts[Cheat_Menu.move_amount_index] + "</font>";
	Cheat_Menu.append_scroll_selector(current_amount, key1, key2, Cheat_Menu.move_left_move_amount, Cheat_Menu.move_right_move_amount);
}

Cheat_Menu.scroll_left_class = function(event) {
	Cheat_Menu.class_selection--;
	if (Cheat_Menu.class_selection < 0) {
		if (Cheat_Menu.current_classes.length > 0) {
			Cheat_Menu.class_selection = Cheat_Menu.current_classes.length - 1;
		}
		else {
			Cheat_Menu.class_selection = 0;
		}
	}
	Cheat_Menu.update_menu();
}

Cheat_Menu.scroll_right_class = function(event) {
	Cheat_Menu.class_selection++;
	if (Cheat_Menu.class_selection >= Cheat_Menu.current_classes.length) {
		Cheat_Menu.class_selection = 0;
	}
	Cheat_Menu.update_menu();
}

Cheat_Menu.give_current_exp = function(event) {
	Cheat_Menu.give_exp($gameActors._data[Cheat_Menu.cheat_selected_actor], Cheat_Menu.current_classes[Cheat_Menu.class_selection] , Cheat_Menu.amounts[Cheat_Menu.amount_index]);
	Cheat_Menu.update_menu();

	if (Cheat_Menu.amounts[Cheat_Menu.amount_index] > 0) {
		SoundManager.playSystemSound(1);
	}
	else {
		SoundManager.playSystemSound(2);
	}
}

Cheat_Menu.append_class_selection = function(key1, key2, key3) {
	Cheat_Menu.append_title("Class");

	var class_string = "";

	if ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor]._exp) {
		Cheat_Menu.current_classes = Object.keys($gameActors._data[Cheat_Menu.cheat_selected_actor]._exp);
		if (Cheat_Menu.current_classes.length > 0) {
			if (Cheat_Menu.class_selection >= Cheat_Menu.current_classes.length) {
				Cheat_Menu.class_selection = 0;
			}
			class_string = $dataClasses[Cheat_Menu.current_classes[Cheat_Menu.class_selection]].name;
		}
	}
	else {
		Cheat_Menu.current_classes = [];
	}


	Cheat_Menu.append_scroll_selector(class_string, key1, key2, Cheat_Menu.scroll_left_class, Cheat_Menu.scroll_right_class);
	var current_exp = "NULL";
	if (Cheat_Menu.current_classes.length > 0) {
		current_exp = $gameActors._data[Cheat_Menu.cheat_selected_actor]._exp[Cheat_Menu.current_classes[Cheat_Menu.class_selection]];
	}
	Cheat_Menu.append_cheat("EXP:", current_exp, key3, Cheat_Menu.give_current_exp);
}

Cheat_Menu.scroll_left_stat = function(event) {
	Cheat_Menu.stat_selection--;
	if (Cheat_Menu.stat_selection < 0) {
		if ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus) {
			Cheat_Menu.stat_selection = $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus.length - 1;
		}
		else {
			Cheat_Menu.stat_selection = 0;
		}
	}
	Cheat_Menu.update_menu();
}

Cheat_Menu.scroll_right_stat = function(event) {
	Cheat_Menu.stat_selection++;
	if ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus) {
		if (Cheat_Menu.stat_selection >= $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus.length) {
			Cheat_Menu.stat_selection = 0;
		}
	}
	else {
		Cheat_Menu.stat_selection = 0;
	}
	Cheat_Menu.update_menu();
}

Cheat_Menu.give_current_stat = function(event) {
	Cheat_Menu.give_stat($gameActors._data[Cheat_Menu.cheat_selected_actor], Cheat_Menu.stat_selection , Cheat_Menu.amounts[Cheat_Menu.amount_index]);
	Cheat_Menu.update_menu();

	if (Cheat_Menu.amounts[Cheat_Menu.amount_index] > 0) {
		SoundManager.playSystemSound(1);
	}
	else {
		SoundManager.playSystemSound(2);
	}
}

Cheat_Menu.append_stat_selection = function(key1, key2, key3) {
	Cheat_Menu.append_title("Stat");

	var stat_string = "";

	var stat_string = "";
	if ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus) {
		if (Cheat_Menu.stat_selection >= $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus.length) {
			Cheat_Menu.stat_selection = 0;
		}
		stat_string += $dataSystem.terms.params[Cheat_Menu.stat_selection];
	}

	Cheat_Menu.append_scroll_selector(stat_string, key1, key2, Cheat_Menu.scroll_left_stat, Cheat_Menu.scroll_right_stat);
	var current_value = "NULL";
	if ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus) {
		current_value = $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus[Cheat_Menu.stat_selection];
	}
	Cheat_Menu.append_cheat("Value:", current_value, key3, Cheat_Menu.give_current_stat);
}

Cheat_Menu.give_current_gold = function(event) {
	Cheat_Menu.give_gold(Cheat_Menu.amounts[Cheat_Menu.amount_index]);
	SoundManager.playSystemSound(1);
	Cheat_Menu.update_menu();
}

Cheat_Menu.append_gold_status = function(key1) {
	Cheat_Menu.append_cheat("Gold:", $gameParty._gold, key1, Cheat_Menu.give_current_gold);
}

Cheat_Menu.update_speed = function(event) {
	Cheat_Menu.change_player_speed(Cheat_Menu.move_amounts[Cheat_Menu.move_amount_index]);
	SoundManager.playSystemSound(1);
	Cheat_Menu.update_menu();
}

Cheat_Menu.append_speed_status = function(key1) {
	Cheat_Menu.append_cheat("Current<br>Speed:", $gamePlayer._moveSpeed, key1, Cheat_Menu.update_speed);
}

Cheat_Menu.scroll_left_item = function(event) {
	Cheat_Menu.item_selection--;
	if (Cheat_Menu.item_selection < 0) {
		Cheat_Menu.item_selection = $dataItems.length - 1;
	}
	Cheat_Menu.update_menu();
}

Cheat_Menu.scroll_right_item = function(event) {
	Cheat_Menu.item_selection++;
	if (Cheat_Menu.item_selection >= $dataItems.length) {
		Cheat_Menu.item_selection = 0;
	}
	Cheat_Menu.update_menu();
}

Cheat_Menu.give_current_item = function(event) {
	Cheat_Menu.give_item(Cheat_Menu.item_selection, Cheat_Menu.amounts[Cheat_Menu.amount_index]);
	SoundManager.playSystemSound(1);
	Cheat_Menu.update_menu();
}

Cheat_Menu.append_item_selection = function(key1, key2, key3) {
	Cheat_Menu.append_title("Item");
	var current_item = "";
	if ($dataItems[Cheat_Menu.item_selection] && $dataItems[Cheat_Menu.item_selection].name && $dataItems[Cheat_Menu.item_selection].name.length > 0) {
		current_item = $dataItems[Cheat_Menu.item_selection].name;
	}
	else {
		current_item = "NULL";
	}

	Cheat_Menu.append_scroll_selector(current_item, key1, key2, Cheat_Menu.scroll_left_item, Cheat_Menu.scroll_right_item);
	var current_item_amount = 0;
	if ($gameParty._items[Cheat_Menu.item_selection] != undefined) {
		current_item_amount = $gameParty._items[Cheat_Menu.item_selection];
	}
	Cheat_Menu.append_cheat("Amount:", current_item_amount, key3, Cheat_Menu.give_current_item);
}

Cheat_Menu.scroll_left_weapon = function(event) {
	Cheat_Menu.weapon_selection--;
	if (Cheat_Menu.weapon_selection < 0) {
		Cheat_Menu.weapon_selection = $dataWeapons.length - 1;
	}
	Cheat_Menu.update_menu();
}

Cheat_Menu.scroll_right_weapon = function(event) {
	Cheat_Menu.weapon_selection++;
	if (Cheat_Menu.weapon_selection >= $dataWeapons.length) {
		Cheat_Menu.weapon_selection = 0;
	}
	Cheat_Menu.update_menu();
}

Cheat_Menu.give_current_weapon = function(event) {
	Cheat_Menu.give_weapon(Cheat_Menu.weapon_selection, Cheat_Menu.amounts[Cheat_Menu.amount_index]);
	SoundManager.playSystemSound(1);
	Cheat_Menu.update_menu();
}

Cheat_Menu.append_weapon_selection = function(key1, key2, key3) {
	Cheat_Menu.append_title("Weapon");
	var current_weapon = "";
	if ($dataWeapons[Cheat_Menu.weapon_selection] && $dataWeapons[Cheat_Menu.weapon_selection].name && $dataWeapons[Cheat_Menu.weapon_selection].name.length > 0) {
		current_weapon = $dataWeapons[Cheat_Menu.weapon_selection].name;
	}
	else {
		current_weapon = "NULL";
	}

	Cheat_Menu.append_scroll_selector(current_weapon, key1, key2, Cheat_Menu.scroll_left_weapon, Cheat_Menu.scroll_right_weapon);
	var current_weapon_amount = 0;
	if ($gameParty._weapons[Cheat_Menu.weapon_selection] != undefined) {
		current_weapon_amount = $gameParty._weapons[Cheat_Menu.weapon_selection];
	}
	Cheat_Menu.append_cheat("Amount:", current_weapon_amount, key3, Cheat_Menu.give_current_weapon);
}

Cheat_Menu.scroll_left_armor = function(event) {
	Cheat_Menu.armor_selection--;
	if (Cheat_Menu.armor_selection < 0) {
		Cheat_Menu.armor_selection = $dataArmors.length - 1;
	}
	Cheat_Menu.update_menu();
}

Cheat_Menu.scroll_right_armor = function(event) {
	Cheat_Menu.armor_selection++;
	if (Cheat_Menu.armor_selection >= $dataArmors.length) {
		Cheat_Menu.armor_selection = 0;
	}
	Cheat_Menu.update_menu();
}

Cheat_Menu.give_current_armor = function(event) {
	Cheat_Menu.give_armor(Cheat_Menu.armor_selection, Cheat_Menu.amounts[Cheat_Menu.amount_index]);
	SoundManager.playSystemSound(1);
	Cheat_Menu.update_menu();
}

Cheat_Menu.append_armor_selection = function(key1, key2, key3) {
	Cheat_Menu.append_title("Armor");
	var current_armor = "";
	if ($dataArmors[Cheat_Menu.armor_selection] && $dataArmors[Cheat_Menu.armor_selection].name && $dataArmors[Cheat_Menu.armor_selection].name.length > 0) {
		current_armor = $dataArmors[Cheat_Menu.armor_selection].name;
	}
	else {
		current_armor = "NULL";
	}

	Cheat_Menu.append_scroll_selector(current_armor, key1, key2, Cheat_Menu.scroll_left_armor, Cheat_Menu.scroll_right_armor);
	var current_armor_amount = 0;
	if ($gameParty._armors[Cheat_Menu.armor_selection] != undefined) {
		current_armor_amount = $gameParty._armors[Cheat_Menu.armor_selection];
	}
	Cheat_Menu.append_cheat("Amount:", current_armor_amount, key3, Cheat_Menu.give_current_armor);
}

Cheat_Menu.clear_current_actor_states = function() {
	Cheat_Menu.clear_actor_states($gameActors._data[Cheat_Menu.cheat_selected_actor]);
	SoundManager.playSystemSound(1);
	Cheat_Menu.update_menu();
}

Cheat_Menu.append_current_state = function(key1) {
	Cheat_Menu.append_title("Current State");
	var number_states = 0;

	if ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor]._states && $gameActors._data[Cheat_Menu.cheat_selected_actor]._states.length >= 0) {
		number_states = $gameActors._data[Cheat_Menu.cheat_selected_actor]._states.length;
	}
	else {
		number_states = null;
	}

	Cheat_Menu.append_cheat("Number Effects:", number_states, key1, Cheat_Menu.clear_current_actor_states);
}

// update whats being displayed in menu
Cheat_Menu.update_menu = function() {
	// clear menu
	Cheat_Menu.overlay.innerHTML = "";
	

	// god mode
	if (Cheat_Menu.cheat_selected == 0) {
		Cheat_Menu.append_cheat_title("God Mode");
		Cheat_Menu.append_actor_selection(4, 5);

		Cheat_Menu.append_godmode_status();
	}
	else if (Cheat_Menu.cheat_selected == 1) {
		Cheat_Menu.append_cheat_title("Enemy Health");

		Cheat_Menu.append_enemy_cheats(4, 5);
	}
	else if (Cheat_Menu.cheat_selected == 2) {
		Cheat_Menu.append_cheat_title("No Clip");

		Cheat_Menu.append_no_clip_status(4);
	}
	else if (Cheat_Menu.cheat_selected == 3) {
		Cheat_Menu.append_cheat_title("Give Exp");
		Cheat_Menu.append_actor_selection(4, 5);
		Cheat_Menu.append_amount_selection(6, 7);
		Cheat_Menu.append_class_selection(8, 9, 0);
	}
	else if (Cheat_Menu.cheat_selected == 4) {
		Cheat_Menu.append_cheat_title("Stats");
		Cheat_Menu.append_actor_selection(4, 5);
		Cheat_Menu.append_amount_selection(6, 7);
		Cheat_Menu.append_stat_selection(8, 9, 0);
	}
	else if (Cheat_Menu.cheat_selected == 5) {
		Cheat_Menu.append_cheat_title("Gold");
		Cheat_Menu.append_amount_selection(4, 5);
		Cheat_Menu.append_gold_status(6);
	}
	else if (Cheat_Menu.cheat_selected == 6) {
		Cheat_Menu.append_cheat_title("Items");
		Cheat_Menu.append_amount_selection(4, 5);
		Cheat_Menu.append_item_selection(6, 7, 8);
	}
	else if (Cheat_Menu.cheat_selected == 7) {
		Cheat_Menu.append_cheat_title("Weapons");
		Cheat_Menu.append_amount_selection(4, 5);
		Cheat_Menu.append_weapon_selection(6, 7, 8);
	}
	else if (Cheat_Menu.cheat_selected == 8) {
		Cheat_Menu.append_cheat_title("Armors");
		Cheat_Menu.append_amount_selection(4, 5);
		Cheat_Menu.append_armor_selection(6, 7, 8);
	}
	else if (Cheat_Menu.cheat_selected == 9) {
		Cheat_Menu.append_cheat_title("Speed");
		Cheat_Menu.append_move_amount_selection(4, 5);
		Cheat_Menu.append_speed_status(6);
	}
	else if (Cheat_Menu.cheat_selected == 10) {
		Cheat_Menu.append_cheat_title("Clear States");
		Cheat_Menu.append_actor_selection(4, 5);
		Cheat_Menu.append_current_state(6);
	}

	Cheat_Menu.position_menu();
};

// listener to reposition menu
window.addEventListener("resize", Cheat_Menu.position_menu);


// prevent clicking from passing through
Cheat_Menu.overlay.addEventListener("mousedown", function(event) {
	event.stopPropagation();
});



/////////////////////////////////////////////////
// Cheat Menu Key Listener
/////////////////////////////////////////////////

// Key codes
var KEYCODE_1 = 49;
var KEYCODE_2 = 50;
var KEYCODE_3 = 51;
var KEYCODE_4 = 52;
var KEYCODE_5 = 53;
var KEYCODE_6 = 54;
var KEYCODE_7 = 55;
var KEYCODE_8 = 56;
var KEYCODE_9 = 57;
var KEYCODE_0 = 48;
var KEYCODE_TILDE = 192;

window.addEventListener("keydown", function(event) {
	if (!event.ctrlKey && !event.altKey && (event.keyCode === 119) && $gameTemp && !$gameTemp.isPlaytest()) {
		// open debug menu
		event.stopPropagation();
		event.preventDefault();
		require('nw.gui').Window.get().showDevTools();
	}
	else if (!event.altKey && !event.ctrlKey && !event.shiftKey && (event.keyCode === 120) && $gameTemp && !$gameTemp.isPlaytest()) {
		// trick the game into thinking its a playtest so it will open the switch/variable debug menu
		$gameTemp._isPlaytest = true;
		setTimeout(function() {
			// back to not being playtest
			$gameTemp._isPlaytest = false;
		}, 100);
	}
	else if (Cheat_Menu.overlay_openable && !event.altKey && !event.ctrlKey && !event.shiftKey) {
		// open and close menu
		if (event.keyCode == KEYCODE_1) {
			if (!Cheat_Menu.initialized) {
				for (var i = 0; i < $gameActors._data.length; i++) {
					if($gameActors._data[i]) {
						$gameActors._data[i].god_mode = false;
					}
				}

				// reset to inital values
				Cheat_Menu.cheat_selected = 0;
				Cheat_Menu.cheat_selected_actor = 1;
				Cheat_Menu.amount_index = 6;
				Cheat_Menu.current_classes = [];
				Cheat_Menu.class_selection = 0;
				Cheat_Menu.stat_selection = 0;
				Cheat_Menu.item_selection = 1;
				Cheat_Menu.weapon_selection = 1;
				Cheat_Menu.armor_selection = 1;
				Cheat_Menu.move_amount_index = 1;

				// only do this once per load or new game
				Cheat_Menu.initialized = true;
			}

			// open menu
			if (!Cheat_Menu.cheat_menu_open) {
				Cheat_Menu.cheat_menu_open = true;
				document.body.appendChild(Cheat_Menu.overlay_box);
				document.body.appendChild(Cheat_Menu.overlay);
				Cheat_Menu.update_menu();
				SoundManager.playSystemSound(1);
			}
			// close menu
			else {
				Cheat_Menu.cheat_menu_open = false;
				Cheat_Menu.overlay_box.remove();
				Cheat_Menu.overlay.remove();
				SoundManager.playSystemSound(2);
			}
		}

		// navigate and activate cheats
		else if (Cheat_Menu.cheat_menu_open) {
			// cycle left cheat
			if (event.keyCode == KEYCODE_2) {
				Cheat_Menu.scroll_left_cheat();
			}
			// cycle right cheat
			else if (event.keyCode == KEYCODE_3 ) {
				Cheat_Menu.scroll_right_cheat();
			}

			// move menu position
			else if (event.keyCode == KEYCODE_TILDE) {
				Cheat_Menu.position++;
				if (Cheat_Menu.position > 4) {
					Cheat_Menu.position = 0;
				}
				Cheat_Menu.update_menu();
			}


			// god mode controls
			if (Cheat_Menu.cheat_selected == 0) {
				// cycle left actor selection
				if (event.keyCode == KEYCODE_4) {
					Cheat_Menu.scroll_left_actor();
				}
				// cycle right actor selection
				else if (event.keyCode == KEYCODE_5 ) {
					Cheat_Menu.scroll_right_actor();
				}
				// toggle god mode
				else if (event.keyCode == KEYCODE_6 && $gameActors._data[Cheat_Menu.cheat_selected_actor]) {
					Cheat_Menu.god_mode_toggle();
				}
			}
			
			// enemy health
			else if (Cheat_Menu.cheat_selected == 1) {
				if (event.keyCode == KEYCODE_4) {
					Cheat_Menu.enemy_hp_cheat_1();
				}
				else if (event.keyCode == KEYCODE_5) {
					Cheat_Menu.enemy_hp_cheat_2();
				}
			}

			// no clip
			else if (Cheat_Menu.cheat_selected == 2) {
				if (event.keyCode == KEYCODE_4) {
					Cheat_Menu.toggle_no_clip_status();
				}
			}

			// give exp
			else if (Cheat_Menu.cheat_selected == 3) {
				// cycle left actor selection
				if (event.keyCode == KEYCODE_4) {
					Cheat_Menu.scroll_left_actor();
				}
				// cycle right actor selection
				else if (event.keyCode == KEYCODE_5 ) {
					Cheat_Menu.scroll_right_actor();
				}


				// cycle left amount
				else if (event.keyCode == KEYCODE_6) {
					Cheat_Menu.move_left_amount();
				}
				// cycle right amount
				else if (event.keyCode == KEYCODE_7) {
					Cheat_Menu.move_right_amount();
				}

				else if (Cheat_Menu.current_classes.length > 0) {
					// cycle left class
					if (event.keyCode == KEYCODE_8) {
						Cheat_Menu.scroll_left_class();
					}
					// cycle right class
					else if (event.keyCode == KEYCODE_9) {
						Cheat_Menu.scroll_right_class();
					}

					// edit exp
					else if (event.keyCode == KEYCODE_0) {
						Cheat_Menu.give_current_exp();
					}
				}
				
			}


			// edit stats
			else if (Cheat_Menu.cheat_selected == 4) {
				// cycle left actor selection
				if (event.keyCode == KEYCODE_4) {
					Cheat_Menu.scroll_left_actor();
				}
				// cycle right actor selection
				else if (event.keyCode == KEYCODE_5 ) {
					Cheat_Menu.scroll_right_actor();
				}


				// cycle left amount
				else if (event.keyCode == KEYCODE_6) {
					Cheat_Menu.move_left_amount();
				}
				// cycle right amount
				else if (event.keyCode == KEYCODE_7) {
					Cheat_Menu.move_right_amount();
				}

				else if ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus && $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus.length > 0) {
					// cycle left stat
					if (event.keyCode == KEYCODE_8) {
						Cheat_Menu.scroll_left_stat();
					}
					// cycle right stat
					else if (event.keyCode == KEYCODE_9) {
						Cheat_Menu.scroll_right_stat();
					}

					// edit stat
					else if (event.keyCode == KEYCODE_0) {
						Cheat_Menu.give_current_stat();
					}
				}
				
			}

			// edit gold
			else if (Cheat_Menu.cheat_selected == 5) {
				if (event.keyCode == KEYCODE_4) {
					Cheat_Menu.move_left_amount();
				}
				// cycle right amount
				else if (event.keyCode == KEYCODE_5) {
					Cheat_Menu.move_right_amount();
				}

				// edit gold
				else if (event.keyCode == KEYCODE_6) {
					Cheat_Menu.give_current_gold();
				}
			}

			// edit items
			else if (Cheat_Menu.cheat_selected == 6) {
				if (event.keyCode == KEYCODE_4) {
					Cheat_Menu.move_left_amount();
				}
				// cycle right amount
				else if (event.keyCode == KEYCODE_5) {
					Cheat_Menu.move_right_amount();
				}

				// select items
				else if (event.keyCode == KEYCODE_6) {
					Cheat_Menu.scroll_left_item();
				}
				else if (event.keyCode == KEYCODE_7) {
					Cheat_Menu.scroll_right_item();
				}

				// edit items
				else if (event.keyCode == KEYCODE_8) {
					Cheat_Menu.give_current_item();
				}

			}

			// edit weapons
			else if (Cheat_Menu.cheat_selected == 7) {
				if (event.keyCode == KEYCODE_4) {
					Cheat_Menu.move_left_amount();
				}
				// cycle right amount
				else if (event.keyCode == KEYCODE_5) {
					Cheat_Menu.move_right_amount();
				}

				// select weapons
				else if (event.keyCode == KEYCODE_6) {
					Cheat_Menu.scroll_left_weapon();
				}
				else if (event.keyCode == KEYCODE_7) {
					Cheat_Menu.scroll_right_weapon();
				}

				// edit items
				else if (event.keyCode == KEYCODE_8) {
					Cheat_Menu.give_current_weapon();
				}

			}

			// edit armors
			else if (Cheat_Menu.cheat_selected == 8) {
				if (event.keyCode == KEYCODE_4) {
					Cheat_Menu.move_left_amount();
				}
				// cycle right amount
				else if (event.keyCode == KEYCODE_5) {
					Cheat_Menu.move_right_amount();
				}

				// select armor
				else if (event.keyCode == KEYCODE_6) {
					Cheat_Menu.scroll_left_armor();
				}
				else if (event.keyCode == KEYCODE_7) {
					Cheat_Menu.scroll_right_armor();
				}

				// edit items
				else if (event.keyCode == KEYCODE_8) {
					Cheat_Menu.give_current_armor();
				}

			}

			// change movement speed
			else if (Cheat_Menu.cheat_selected == 9) {
				if (event.keyCode == KEYCODE_4) {
					Cheat_Menu.move_left_move_amount();
				}
				// cycle right amount
				else if (event.keyCode == KEYCODE_5) {
					Cheat_Menu.move_right_move_amount();
				}

				// change speed
				else if (event.keyCode == KEYCODE_6) {
					Cheat_Menu.update_speed();
				}

			}

			// clear status effects
			else if (Cheat_Menu.cheat_selected == 10) {
				if (event.keyCode == KEYCODE_4) {
					Cheat_Menu.scroll_left_actor();
				}
				// cycle right amount
				else if (event.keyCode == KEYCODE_5) {
					Cheat_Menu.scroll_right_actor();
				}

				// change speed
				else if (event.keyCode == KEYCODE_6) {
					Cheat_Menu.clear_current_actor_states();
				}

			}


		}
	}
});



/////////////////////////////////////////////////
// Load Hook
/////////////////////////////////////////////////

Cheat_Menu.initialize = function() {
	Cheat_Menu.overlay_openable = true;
	Cheat_Menu.initialized = false;
	Cheat_Menu.cheat_menu_open = false;
	Cheat_Menu.overlay_box.remove();
	Cheat_Menu.overlay.remove();

	// periodic update
	clearInterval(Cheat_Menu.menu_update_timer);
	Cheat_Menu.menu_update_timer = setInterval(function() {
		if (Cheat_Menu.cheat_menu_open) {
			Cheat_Menu.update_menu();
		}
	}, 1000);
}

DataManager.default_loadGame = DataManager.loadGame;
DataManager.loadGame = function(savefileId) {
	Cheat_Menu.initialize();

	return DataManager.default_loadGame(savefileId);
};

DataManager.default_setupNewGame = DataManager.setupNewGame;
DataManager.setupNewGame = function() {
	Cheat_Menu.initialize();

	DataManager.default_setupNewGame();
}
