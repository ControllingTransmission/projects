var blessed = require('blessed');

// Create a screen object.
var screen = blessed.screen();

// Create a box perfectly centered horizontally and vertically.
var box = blessed.box({
  top: 'top',
  left: 'left',
  height: '100%',
  width: '100%',
  content: '',
  tags: true,
  border: {
    type: 'bg',
    color: '#fff'
  },
  style: {
    fg: '#fff',
    bg: '#000',
  },
  ch: " "
});

// Append our box to the screen.
screen.append(box);

function pickAny(array)
{
	var i = Math.floor(Math.random() * array.length) % array.length
	return array[i]
}

var count = 0
setInterval(function () {
	count ++
	//box.content = "Testing " + Math.random() + "\n" + "Screen is " + screen.width + "x" + screen.height	
	var chars = ["/", "_", "\\", "|"]

	box.ch = pickAny(chars)
	var colors = ["#fff", "#f00", "#0f0", "#ff0", "#00f"]
	var i = Math.floor(Math.random()*1000) % colors.length
	box.style.fg = "#000" //pickAny(colors)
	box.style.bg = pickAny(colors)
	screen.render();
}, 300)


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
