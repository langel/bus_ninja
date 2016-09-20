
level_init = function() {
	// start level
	level_shower.html('LEVEL &nbsp;' + level_counter);
	bus_ride_over = 0;
	level_screen.removeClass('hidden');
	ninja.dead = 0;
	ninja.top = ninja.top_init;
	ninja.left = ninja.left_init;
	ninja.on_bus = 1;
	ninja.jump_height = 0;
	ninja.jumping = 0;
	ninja.div = $('#ninja');
	ninja.div.removeClass('dead');
	ninja.sword.div = $('#ninja_sword');
	sword_throttle = 0;
	bus.motion_counter = 0;
	bus.div = $('#bus');
	bus.top = bus.top_init;
	bus.left = bus.left_init;
	bus.wheels.div = $('#bus .wheel');
	bus.driving_off = 0;
	controls_last_frame.start = 1;
	enemy_clear_all();
	enemy_spawn_countdown_reset();
	level_frame_logic();
};

ninja_killed = function() {
	ninja.div.addClass('dead');
	ninja.falling = 1;
	ninja.jumping = 1;
	ninja.on_bus = 0;
	bus.driving_off = 1;
	audio_play_sfx('death');
};

ninja_falls_off_bus_init = function() {
	ninja.on_bus = 0;
	ninja.falling = 1;
	ninja.jumping = 1;
	ninja.jump_inertia = 1;
};

check_ninja_above_bus = function() {
	if (ninja.left > bus.left_bounds && ninja.left < bus.right_bounds) {
		return 1;
	}
	else return 0;
};

throwing_star_spawn = function(x_speed, y_speed) {
	var left = ninja.left + 20;
	var top = ninja.top + 60;
	var div = $('<div class="ninja_star">*</div>').css({
		top: top,
		left: left,
	});
	var star = {
		x_speed: x_speed,
		y_speed: y_speed,
		left: left,
		top: top,
		height: 8,
		width: 8,
		div: div,
	};
	level_screen.append(div);
	ninja_throwing_stars.push(star);
};

throwing_star_despawn = function(star, index) {
	star.div.remove();
	ninja_throwing_stars.splice(index, 1);
};


level_frame_logic = function() {


	if (engine.paused != 1) {
		
		// SO MUCH NINJA PLAYER LOGIC!!  :X
		var ninja_speed;

		// crouching
		if (controls.down == 1 && ninja.jumping == 0) {
			ninja.div.addClass('crouch');
			ninja.crouch = 32;
		}
		else {
			ninja.div.removeClass('crouch');
			ninja.crouch = 0;
		}

		if (ninja.crouch == 0) {
			ninja_speed = ninja.speed * engine.pixel_movement;
		}
		else {
			ninja_speed = ninja.crouch_speed * engine.pixel_movement;
		}
		
		var not_jumping_or_falling = (ninja.jumping != 1 && ninja.falling != 1 && bus_ride_over != 1);
		// left
		if ((controls.left == 1 && controls.up == 0) ||
			(controls.left && ninja.jumping == 1)) {
			ninja.left -= ninja_speed;
			ninja.facing = 'left';
			ninja.div.addClass('left');
			if (not_jumping_or_falling && !check_ninja_above_bus()) {
				ninja_falls_off_bus_init();
			}
		}
		// right
		if ((controls.right == 1 && controls.up == 0) ||
			(controls.right == 1 && ninja.jumping == 1)) {
			ninja.left += ninja_speed;
			ninja.facing = 'right';
			ninja.div.removeClass('left');
			if (not_jumping_or_falling && !check_ninja_above_bus()) {
				ninja_falls_off_bus_init();
			}
		}

		// handel teh jumps!!
		// also doubles as falling off bus logic
		if (controls.jump == 1 && ninja.jumping == 0) {
			ninja.jumping = 1;
			ninja.jump_inertia = 12;
			ninja.on_bus = 0;
			audio_play_sfx('jump');
		}
		if (ninja.jumping == 1) {
			ninja.jump_height -= ninja.jump_inertia * engine.pixel_movement;
			ninja.top -= ninja.jump_inertia * engine.pixel_movement;
			ninja.jump_inertia--;
			if (ninja.jump_height >= 0 && ninja.falling != 1) {
				if (check_ninja_above_bus()) {
					ninja.jumping = 0;
					if (bus_ride_over == 0) {
						ninja.on_bus = 1;
					}
				}
				else {
					ninja.falling = 1;
				}
			}
		}


		// SWORD
		if (controls.attack_sword == 1 && sword_throttle == 0 && controls_last_frame.attack_sword != 1) {
			sword_facing = ninja.facing;
			sword_throttle = 233;
			audio_play_sfx('sword');
		}
		if (sword_throttle > 0) {
			ninja.sword.top = ninja.top + Math.floor(sword_throttle / 2) - 100;
			if (sword_facing == 'right') {
				ninja.sword.left = ninja.left + 30;
				var sword_deg = sword_throttle + 140;
			}
			else {
				ninja.sword.left = ninja.left + 30 - ninja.sword.width;
				var sword_deg = -sword_throttle - 140;
			}
			var sword_rotation = 'rotate(' + sword_deg + 'deg)';
			ninja.sword.div.css({
				'transform': sword_rotation
			}).removeClass('hidden');
			sword_throttle -= 47;
		}
		else {
			sword_throttle = 0;
			ninja.sword.div.addClass('hidden');
		}


		// HANDLE THROWING STARS
		if (controls.attack_star == 1 && throwing_star_throttler == 0) {
			throwing_star_throttler = 7;
			var diag_speed = Math.floor(throwing_star_speed / 1.66);
			if (controls.left == 1 && controls.up == 1) {
				throwing_star_spawn(-diag_speed, -diag_speed);
			}
			else if (controls.right == 1 && controls.up == 1) {
				throwing_star_spawn(diag_speed, -diag_speed);
			}
			else if (controls.up == 1) {
				throwing_star_spawn(0, -throwing_star_speed);
			}
			else if (controls.down == 1 && controls.left == 1 && ninja.jumping == 1) {
				throwing_star_spawn(-diag_speed, diag_speed);
			}
			else if (controls.down == 1 && controls.right == 1 && ninja.jumping == 1) {
				throwing_star_spawn(diag_speed, diag_speed);
			}
			else if (controls.down == 1 && ninja.jumping == 1) {
				throwing_star_spawn(0, throwing_star_speed);
			}
			else if (controls.left == 1 || ninja.facing == 'left') {
				throwing_star_spawn(-throwing_star_speed, 0);
			}
			else if (controls.right == 1 || ninja.facing == 'right') {
				throwing_star_spawn(throwing_star_speed, 0);
			}
			audio_play_sfx('star');
		}
		if (throwing_star_throttler > 0) {
			throwing_star_throttler--;
		}
		// move throwing stars
		ninja_throwing_stars.forEach(function(star, i, stars) {
			star.top += star.y_speed * engine.pixel_movement;
			star.left += star.x_speed * engine.pixel_movement;
			if (star.left < -10 || star.left > 810 || star.top < -10 || star.top > 500) {
				star.div.remove();
				ninja_throwing_stars.splice(i, 1);
			}
			else {
				star.div.css({
					top: star.top,
					left: star.left,
				});
			}
		});


		// MOVE THE BUS AND THE NINJA
		var bus_rumble_offset = (bus.motion_counter % 2) * 1 * engine.pixel_movement;
		var ninja_top_offset = ninja.top + ninja.crouch;
		// kill ninja and
		// keep ninja from falling through road
		if (ninja.falling == 1 && ninja_top_offset > 400) {
			bus_ride_over = 1;
			ninja.top = 400;
			ninja.jumping = 0;
			ninja.jump_height = 0;
			ninja.falling = 0;
			ninja.dead = 1;
			ninja.div.addClass('dead');
			bus.driving_off = 1;
		}
		if (ninja.on_bus == 1) {
			ninja_top_offset += bus_rumble_offset;
		}
		ninja.div.css({
			top: ninja_top_offset, 
			left: ninja.left
		});
		bus.div.css({
			top: bus.top + bus_rumble_offset, 
			left: bus.left
		});
		bus.wheels.div.css({
			top: 160 - bus_rumble_offset
		});

		// handle bus driving off
		if (bus.driving_off == 1 && bus.left < 800) {
			bus.left += bus.speed * engine.pixel_movement;
			bus.div.css({left: bus.left});
		}


		// WILL NINJA FIGHT ENEMIES?!??!
		enemy_routine();
		

	}

	// handle spacebar
	// for pausing and reset after death
	if (controls.start == 1 && controls.start != controls_last_frame.start) {
		if (bus_ride_over == 1) {
			level_screen.addClass('hidden');
			controls_last_frame.any_key = 1;
			game_over();
			return;
		}
		else {
			if (engine.paused == 0) engine.paused = 1;
			else engine.paused = 0;
		}
	}

	// update points shower
	if (ninja.on_bus == 1 && engine.paused != 1) {
		game_add_points(1);
	}
	points_shower.text(points);
	var timer_seconds = Math.ceil((difficulty * 20 - bus.motion_counter) / engine.fps);
	time_countdown.text('TIME ' + timer_seconds);

	bus.motion_counter++;

	if (ninja.dead != 1 && bus.motion_counter >= difficulty * 20) {
		game_end_level_screen();
		return;
	}

	if (bus.driving_off != 1 && engine.paused != 1) {
		level_move_trees();
	}

	handle_frame(level_frame_logic);

};


level_move_trees = function() {
	trees.forEach(function(tree, index) {
		var bg_pos = trees_left_pos[index];
		bg_pos -= (index + 4) * 3;
		if (bg_pos < -128) {
			bg_pos = 1000;
		}
		trees_left_pos[index] = bg_pos;
		bg_pos = bg_pos + 'px 0px';
		tree.css({
			'background-position': bg_pos
		});
	});
};
