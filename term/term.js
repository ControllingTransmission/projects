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
  content: 'keys are 1, 2, x, y, f and h. Press r to begin.',
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
box.shouldMoveX = true
box.shouldMoveY = true
box.shouldHide = false
box.shouldullScreen = false

box.fullScreen = function()
{
	this.left = 0
	this.top = 0
	this.width = screen.width
	this.height = screen.height
}

box.move = function()
{
	if (this.shouldMoveX)
	{
		if (Math.random() > .5)
		{
			this.left = Math.floor((screen.width -1) * Math.random())
		}
		this.width = 1 + Math.floor((screen.width - box.left) * Math.random())
	}
	
	if (this.shouldMoveY)
	{
		if (Math.random() > .5)
		{
			this.top = Math.floor((screen.height -1) * Math.random())
		}
		this.height = 1 + Math.floor((screen.height - box.top) * Math.random())
	}	
}

step = function()
{
	count ++
	//var chars = ["/", "_", "\\", "|"]

	var colors = ["#fff", "#f00", "#0f0", "#ff0", "#00f", "#0ff", "#f0f"]

	box.move()
	
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
		box.ch = " " //pickAny(chars)
	}
	
	if (box.shouldHide)
	{
		box.style.fg = "#000" //pickAny(colors)
		box.style.bg = "#000"	
		box.ch = " "	
	}
	
	if (box.shouldullScreen)
	{
		box.fullScreen()
	}
	
	/*
	box.content = box.content + "" + Math.floor(Math.random()*10)
	if (box.content.length > 5000)
	{
		box.content = ""	
	}
	*/
	screen.render();
}


screen.key(['1', '2'], function(ch, key) 
{
  	box.drawStyle = ch
});

screen.key(['x'], function(ch, key) 
{
  	box.shouldMoveX = !box.shouldMoveX
});

screen.key(['y'], function(ch, key) 
{
  	box.shouldMoveY = !box.shouldMoveY
});

screen.key(['h'], function(ch, key) 
{
  	box.shouldHide = !box.shouldHide
});

screen.key(['f'], function(ch, key) 
{
  	box.shouldullScreen = !box.shouldullScreen
});

isRunning = false

screen.key(['r'], function(ch, key) 
{
	isRunning = true
	box.content = ""
	setInterval(function () { step() } , 1)
})





// Quit on Escape, q, or Control-C.
screen.key(['escape', 'C-c'], function(ch, key) 
{
  return process.exit(0);
});

// Focus our element.
//box.focus();

// Render the screen.
screen.render();
