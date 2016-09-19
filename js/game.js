game_init = function() {

	level_counter = 0;
	difficulty = 14;
	points = 0;

	ninja.dead = 0;

	game_next_level();

};

game_next_level = function() {
	level_counter++;
	difficulty += 4;
	level_init();
};


game_over = function() {
	title_init();
};


game_add_points = function(amount) {
	if (ninja.dead != 1) {
		points += amount;
	}
};


game_end_level_screen = function() {
	level_screen.addClass('hidden');
	level_end_screen.removeClass('hidden');
	game_screen.addClass('end_level_screen');
	setTimeout(function() {
		game_end_level_routine();
	}, 2500);
};

game_end_level_routine = function() {
	if (controls.any_key = 1) {
		level_end_screen.addClass('hidden');
		level_screen.removeClass('hidden');
		game_screen.removeClass('end_level_screen');
		game_next_level();
		return;
	}
	else {
		handle_frame(game_end_level_routine);
	}
};

