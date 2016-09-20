var marquee, game_screen, level_screen, points_shower;
var level_end_screen;
var level_counter, difficulty, points, time_countdown;;

var engine = {
	fps: 24,
	pixel_movement: 2,
	paused: 0,
	max_difficulty: 40,
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
	any_key: 0,
};
var controls_last_frame = {};

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

var ninja = {
	top_init: 200,
	left_init: 200,
	top: 200,
	left: 200,
	height: 128,
	width: 64,
	speed: 6,
	dead: 0,
	on_bus: 1,
	crouch: 0,
	crouch_speed: 2,
	facing: 'right',
	sword: {
		width: 100,
		height: 200,
	},
	jumping: 0,
	jump_height: 0,
	jump_frame_counter: 0,
	jump_inertia: 0,
};

var bus = {
	top_init: 300,
	left_init: 100,
	top: 300,
	left: 100,
	speed: 16,
	motion_counter: 0,
	pulling_up: 0,
	driving_off: 0,
	present_in_game: 0,
	left_bounds: 60,
	right_bounds: 608,
	wheels: {},
};

var sword_throttle = 0;
var sword_facing;

var ninja_throwing_stars = [];
var throwing_star_throttler = 0;
var throwing_star_speed = 16;


var enemies = [];

var enemy_spawn_countdown;

var enemy_bird = {
	type: 'bird',
	width: 32,
	height: 32,
	top: 0,
	left: 0,
	speed: 8,
	direction: 0,
	wing_frame: 0,
	diving: 0,
	points: 250,
};

var trees = [];
var trees_left_pos = [];
