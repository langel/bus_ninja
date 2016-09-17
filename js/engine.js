$(function() {
	init();
});

var marquee;

var engine = {
	fps: 24,
	pixel_movement: 2,
	paused: 0,
}

var controls = {
	left: 0,
	up: 0,
	right: 0,
	down: 0,
	start: 0,
	attack_sword: 0,
	attack_star: 0,
	jump: 0,
};
var controls_last_frame = {};

var ninja = {
	top: 200,
	left: 200,
};

var bus = {
	top: 300,
	left: 100,
	motion_counter: 0,
};


init = function() {
	marquee = $('#marquee');
	marquee_flicker();
	var key_map = {
		32: 'start',
		65: 'left',
		87: 'up',
		68: 'right',
		83: 'down',
		74: 'attack_sword',
		75: 'attack_star',
		76: 'jump'
	};
	$(document).keydown(function(e) {
		var control = key_map[e.which];
		controls[control] = 1;
		$('#control_' + control).addClass('control_pressed');
		if (e.which == 32) e.preventDefault();
	});
	$(document).keyup(function(e) {
		var control = key_map[e.which];
		controls[control] = 0;
		$('#control_' + control).removeClass('control_pressed');
	});
	ninja.div = $('#ninja');
	bus.div = $('#bus');
	handle_frame();
};

marquee_flicker = function() {
	setTimeout(function() {
		marquee.addClass('flicker_on');
		setTimeout(function() {
			marquee.removeClass('flicker_on');
		}, 50);
		marquee_flicker();
	}, Math.floor(Math.random() * 7500));
};

handle_frame = function() {

	if (engine.paused != 1) {
		
		if (controls.left == 1) {
			ninja.left -= engine.pixel_movement * 2;
		}
		if (controls.right == 1) {
			ninja.left += engine.pixel_movement * 2;
		}
		if (controls.up == 1) {
			ninja.top -= engine.pixel_movement;
		}
		if (controls.down == 1) {
			ninja.top += engine.pixel_movement;
		}

		var hor_offset = (bus.motion_counter % 2) * engine.pixel_movement;
		ninja.div.css({top:ninja.top+hor_offset, left:ninja.left});
		bus.div.css({top:bus.top+hor_offset, left:bus.left});
	}

	// handle pausing
	if (controls.start == 1 && controls.start != controls_last_frame.start) {
		if (engine.paused == 0) engine.paused = 1;
		else engine.paused = 0;
	}

	controls_last_frame = JSON.parse(JSON.stringify(controls));

	setTimeout(function() {
		bus.motion_counter++;
		handle_frame();
	}, Math.round((1 / engine.fps) * 1000));
};

