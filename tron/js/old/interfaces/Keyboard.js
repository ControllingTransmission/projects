keypress.combo("1", function() {
	objects[0].toggle();
});

keypress.register_combo({
	"keys": "!", 
	"on_keydown": function() {
			objects[0].toggle();
		},
	"on_keyup": function() {
			objects[0].toggle();
		},
	"prevent_repeat": true,
	"is_exclusive": true,
});

keypress.combo("2", function() {
	objects[1].toggle();
});

keypress.register_combo({
	"keys": "@", 
	"on_keydown": function() {
			objects[1].toggle();
		},
	"on_keyup": function() {
			objects[1].toggle();
		},
	"prevent_repeat": true,
	"is_exclusive": true,
});