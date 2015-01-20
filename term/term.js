var blessed = require('blessed');

// Create a screen object.
var screen = blessed.screen();

// Create a box perfectly centered horizontally and vertically.
var box = blessed.box({
  top: 0,
  left: 0,
  height: '50%',
  content: 'GREETINGS PROFESSOR {bold}FALKEN{/bold}!\nSHALL WE PLAY A SONG?',
  tags: true,
  border: {
    type: 'none',
    color: '#111'
  },
  style: {
    fg: 'white',
    bg: '#111',
    border: {
      fg: '#f0f0f0'
    },
	ch: "x"
  }
});

// Append our box to the screen.
screen.append(box);

setInterval(function () {
	box.content = "Testing " + Math.random() + "\n" + "Screen is " + screen.width + "x" + screen.height	
	screen.render();
}, 100)


// If box is focused, handle `enter`/`return` and give us some more content.
box.key('enter', function(ch, key) {
  box.setContent('{right}Even different {black-fg}content{/black-fg}.{/right}\n');
  box.setLine(1, 'bar');
  box.insertLine(1, 'foo');
  screen.render();
});

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

// Focus our element.
//box.focus();

// Render the screen.
screen.render();
