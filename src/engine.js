$(function() {
	engine.init();
});


var engine = {
	fps: 24,
	pixel_movement: 2,
	paused: 0,

	controls: {
		left: 0,
		up: 0,
		right: 0,
		down: 0,
		start: 0,
		attack_sword: 0,
		attack_star: 0,
		jump: 0,
	},
	controls_last_frame: {},

	ninja: {
		top: 200,
		left: 200,
	},

	bus: {
		top: 300,
		left: 100,
		motion_counter: 0,
	},


	init: function() {
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
			engine.controls[control] = 1;
			$('#control_' + control).addClass('control_pressed');
			if (e.which == 32) e.preventDefault();
		});
		$(document).keyup(function(e) {
			var control = key_map[e.which];
			engine.controls[control] = 0;
			$('#control_' + control).removeClass('control_pressed');
		});
		engine.ninja.div = $('#ninja');
		engine.bus.div = $('#bus');
		engine.handle_frame();
	},


	handle_frame: function() {

		if (engine.paused != 1) {
			
			if (engine.controls.left == 1) {
				engine.ninja.left -= engine.pixel_movement * 2;
			}
			if (engine.controls.right == 1) {
				engine.ninja.left += engine.pixel_movement * 2;
			}
			if (engine.controls.up == 1) {
				engine.ninja.top -= engine.pixel_movement;
			}
			if (engine.controls.down == 1) {
				engine.ninja.top += engine.pixel_movement;
			}

			var hor_offset = (engine.bus.motion_counter % 2) * engine.pixel_movement;
			engine.ninja.div.css({top:engine.ninja.top+hor_offset, left:engine.ninja.left});
			engine.bus.div.css({top:engine.bus.top+hor_offset, left:engine.bus.left});
		}

		// handle pausing
		if (engine.controls.start == 1 && engine.controls.start != engine.controls_last_frame.start) {
			if (engine.paused == 0) engine.paused = 1;
			else engine.paused = 0;
		}

		engine.controls_last_frame = JSON.parse(JSON.stringify(engine.controls));

		setTimeout(function() {
			engine.bus.motion_counter++;
			engine.handle_frame();
		}, Math.round((1 / engine.fps) * 1000));
	},
}
