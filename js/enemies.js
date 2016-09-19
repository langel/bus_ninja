

enemy_spawn_countdown_reset = function() {
	if (difficulty > engine.max_difficulty) difficulty = engine.max_difficulty - 1;
	enemy_spawn_countdown = engine.max_difficulty - difficulty;
};


enemy_routine = function() {
	enemy_spawn_countdown--;
	if (enemy_spawn_countdown <= 0) {
		enemies.push(enemy_spawn_bird());
		enemy_spawn_countdown_reset();
	}
	enemy_handler();
};


enemy_handler = function() {
	enemies.forEach(function(enemy, index) {
		if (enemy.diving == 1) {
			enemy.top += Math.abs(enemy.speed * engine.pixel_movement);
		}
		enemy.left += enemy.speed * engine.pixel_movement;
		if (enemy.left < -50 || enemy.left > 840 || enemy.top > 500) {
			enemy_kill(enemy, index);
		}
		else {
			enemy_collision_detection(enemy, index);
			if (enemy.type == 'bird') {
				enemy_bird_animate_wings(enemy, index);
				enemy_bird_dive_init_check(enemy);
			}
			enemy.div.css({
				top: enemy.top,
				left: enemy.left
			});
		}
	});
};


enemy_spawn_bird = function() {
	var bird = Object.assign({}, enemy_bird);	
	bird.direction = Math.floor(Math.random()*2 % 2);
	// coming from the left
	if (bird.direction == 0) {
		bird.speed = bird.speed / 2;
		bird.left = -50;
	}
	// coming from the right
	if (bird.direction == 1) {
		bird.speed = -bird.speed;
		bird.left = 800;
	}
	bird.top = Math.floor(Math.random() * 150) + 20;
	bird.div = $('<div class="enemy bird"><div class="body"></div><div class="wings"></div></div>');
	bird.wing_div = $('.wings', bird.div);
	bird.wing_frame = Math.floor(Math.random() * 8) +2;
	level_screen.append(bird.div);
	return bird;
};


enemy_kill = function(enemy, index) {
	enemy.div.remove();
	enemies.splice(index, 1);
};


enemy_collision_detection = function(enemy, index) {
	// enemy hits ninja
	if (enemy.left + enemy.width > ninja.left + 8 &&
		enemy.left < ninja.left + ninja.width -8 &&
		enemy.top + enemy.height > ninja.top + 8 &&
		enemy.top < ninja.top + ninja.height -8) {
		enemy_kill(enemy, index)
		ninja_killed();
	}
	// throwing star hits enemy
	ninja_throwing_stars.forEach(function(star, star_index) {
		if (enemy.left + enemy.width > star.left &&
			enemy.left < star.left + star.width &&
			enemy.top + enemy.height > star.top &&
			enemy.top < star.top + star.height) {
			game_add_points(enemy.points);
			enemy_kill(enemy, index);
			throwing_star_despawn(star, star_index);
		}
	});
	// sword hits enemy
	if (sword_throttle > 0 && 
		enemy.left + enemy.width > ninja.sword.left &&
		enemy.left < ninja.sword.left + ninja.sword.width &&
		enemy.top + enemy.height > ninja.sword.top &&
		enemy.top < ninja.sword.top + ninja.sword.height) {
		game_add_points(enemy.points);
		enemy_kill(enemy, index);
	}
};


enemy_clear_all = function() {
	$('.enemy').remove();	
	enemies = [];
};


enemy_bird_dive_init_check = function(bird) {
	var bird_y_to_ninja = Math.abs(ninja.top + 30 - bird.top);
	var bird_x_to_ninja = Math.abs(ninja.left + 30 - bird.left);
	var diff = bird_y_to_ninja - bird_x_to_ninja;
	if (diff < 10 && diff > -10) {
		bird.diving = 1;
	}
};


enemy_bird_animate_wings = function(bird) {
	bird.wing_frame++;
	if (bird.wing_frame == 10) {
		bird.wing_frame = 2;
	}
	var wing_top = bird.wing_frame * engine.pixel_movement;
	bird.wing_div.css({top:wing_top});
};
