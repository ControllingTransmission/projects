var blessed = require('blessed');


// Create a screen object.
var screen = blessed.screen();
screen.smartCSR = true
screen.fastCSR = true
screen.useBCE = true

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
box.drawStyle = '1';

setInterval(function () {
	count ++
	//var chars = ["/", "_", "\\", "|"]

	var colors = ["#fff", "#f00", "#0f0", "#ff0", "#00f", "#0ff", "#f0f"]

	if (Math.random() > .33)
	{
		if (Math.random() > .5)
		{
			box.left = Math.floor(screen.width * Math.random())
		}
		box.width = Math.floor((screen.width - box.left) * Math.random())
	}
	else
	{
		if (Math.random() > .5)
		{
			box.top = Math.floor(screen.height * Math.random())
		}
		box.height = Math.floor((screen.height - box.top) * Math.random())
	}

	if (box.drawStyle == '1')
	{
		box.style.fg = pickAny(colors) //"#fff" //pickAny(colors)
		box.style.bg ="#000"
		box.ch = pickAny(["x", "o", "|", "-"])	
	}
	else
	{
		var chars = [" ", ":", " ", ".", " ", " "]
		var i = Math.floor(Math.random()*1000) % colors.length
		box.style.fg = "#000" //pickAny(colors)
		box.style.bg = pickAny(colors)		
		box.ch = pickAny(chars)
	}

	screen.render();
}, 1)


screen.key(['1', '2'], function(ch, key) 
{
  	box.drawStyle = ch
	box.content = " " + ch
});



// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) 
{
  return process.exit(0);
});

// Focus our element.
//box.focus();

// Render the screen.
screen.render();
