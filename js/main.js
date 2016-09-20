$(function() {
	init();
});

var bus_ride_over;

init = function() {

	// initialize marquee flicker
	marquee = $('#marquee');
	marquee_flicker();

	// initialize controls reader
	$(document).keydown(function(e) {
		controls.any_key = 1;
		var control = key_map[e.which];
		controls[control] = 1;
		$('#control_' + control).addClass('control_pressed');
		if (e.which == 32) e.preventDefault();
	});
	$(document).keyup(function(e) {
		controls.any_key = 0;
		var control = key_map[e.which];
		controls[control] = 0;
		$('#control_' + control).removeClass('control_pressed');
	});

	// initialize audio player objects
	audio_init();
	
	// define major elements
	game_screen = $('#game_screen');
	level_screen = $('#level_screen');
	level_shower = $('#level_notice');
	points_shower = $('#points_shower');
	time_countdown = $('#time_countdown');
	level_end_screen = $('#level_end_screen');
	for (i=0; i<5; i++) {
		trees.push($('.trees' + i));
		trees_left_pos.push(1000);
	}

	title_init();
	//level_init();
	//game_init();
	//game_end_level_screen();
	

};

marquee_flicker = function() {
	var rnd_interval = 1 / (Math.random() * 100 + 1);
	setTimeout(function() {
		marquee.addClass('flicker_on');
		setTimeout(function() {
			marquee.removeClass('flicker_on');
		}, 50);
		marquee_flicker();
	}, Math.floor(rnd_interval * 10000));
};


title_init = function() {
	// title screen
	game_screen.addClass('title_screen');
	audio_play_sfx('ninja basu');
	title_frame_logic();
};

title_frame_logic = function() {
	if (controls.any_key == 1 && controls_last_frame.any_key != 1) {
		game_screen.removeClass('title_screen');
		game_init();
	}
	else {
		handle_frame(title_frame_logic);
	}
};



handle_frame = function(callback) {
	controls_last_frame = JSON.parse(JSON.stringify(controls));
	setTimeout(function() {
		callback();
	}, Math.round((1 / engine.fps) * 1000));
};


