var audio_objects = {
	music: {},
	sfx: {},
};

var current_music, current_sfx;

var sfx_files = [
	'death',
	'ninja basu',
	'jump',
	'star',
	'sword',
];

audio_init = function() {
	sfx_files.forEach(function(file) {
		audio_objects.sfx[file] = new Audio('audio/' + file + '.mp3');
	});
};

audio_play_sfx = function(sfx_name) {
	if (typeof current_sfx != 'undefined') {
		audio_objects.sfx[current_sfx].pause();
		audio_objects.sfx[current_sfx].currentTime = 0;
	}
	audio_objects.sfx[sfx_name].play();
	current_sfx = sfx_name;
};
