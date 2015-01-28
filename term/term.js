
// --- setup blessed ---------------------------------------
//var AudioContext = require('web-audio-api').AudioContext
//var AudioContextMonkeyPatch = require('audioinput/AudioContextMonkeyPatch');
//var Spectrum = require('./audioinput/Spectrum');


var blessed = require('blessed')
var program = blessed.program()

var screen = blessed.screen();
screen.smartCSR = true
screen.fastCSR = true
screen.useBCE = true
screen.autoPadding = false
screen.alloc()

// --- utlity methods ---------------------------------------

String.prototype.repeat = function( num )
{
    return new Array( num + 1 ).join( this );
}

Array.prototype.removeAt = function(i)
{
	var v = this[i]
	this.splice(i, 1);
	return v;
}
	
Array.prototype.indexOf = function(elt /*, from*/)
{
	var len = this.length;

	var from = Number(arguments[1]) || 0;
	from = (from < 0)
		? Math.ceil(from)
		: Math.floor(from);
	if (from < 0)
		from += len;

	for (; from < len; from++)
	{
		if (from in this &&
			this[from] === elt)
		return from;
	}
	return -1;
}
	
Array.prototype.remove = function(e)
{
	var i = this.indexOf(e);
	if(i > -1)
	{
		this.removeAt(i);
	}
	return this;
}

Array.prototype.pickAny = function()
{
	var i = Math.floor(Math.random() * this.length) % this.length
	return this[i]
}

// --- Thing class, our custom animation objects clone this ----

var things = []

var Thing = {
	clone: function()
	{
		var obj = {}
		//obj.__proto__ = this

		for (var k in this)
		{
			if (this.hasOwnProperty(k))
			{
				obj[k] = this[k]
			}
		}

		obj.init()
		return obj
	},
	
	init: function()
	{
		this._removeOnStop = []
	},
	
	setup:function()
	{
		
	},
	
	newBox: function()
	{
		return blessed.box(
			{
				top:10,
				left:10,
				width:10,
				height:10,
				content: '',
				tags: false,
				style: 
				{
					fg: "#fff"
				},
				ch: ' '
			}
		);
	},
	
	_age: 0,
	_ttl: 0,
	
	step: function()
	{
		this._age ++
		
		if (this._ttl != 0 && this._age > this._ttl)
		{
			this.stop()
		}
	},
	
	blockString: function()
	{
		if (this._blockString == null || this._blockString.length != screen.width)
		{
			this._blockString = " ".repeat(screen.width)	
		}	
		return this._blockString
	},
	
	_paletteNum: 0,
	
	_palettes: [
			["#fff", "#f00", "#0f0", "#ff0", "#00f", "#0ff", "#f0f"],
			["#111", "#222", "#333", "#444", "#555", "#666"]
			//["#f00", "#f33", "#f66", "#f99", "#fcc"]
		],
	
	nextPalette: function()
	{
		this._paletteNum ++
		
		if (this._paletteNum > this._palettes.length - 1)
		{
			this._paletteNum = 0
		}
	},
	
	palette: function()
	{
		return this._palettes[this._paletteNum]
	},
	
	randColor: function()
	{
		return this.palette().pickAny()
	},
	
	randChar: function()
	{
		return ["O", "+", "|", "-"].pickAny()
	},
	
	randX: function()
	{
		return Math.floor(Math.random()*screen.width)	
	},
	
	randY: function()
	{
		return Math.floor(Math.random()*screen.height)	
	},
	
	
	render: function()
	{
	},
	
	_isRunning: false,
	
	start: function()
	{
		this._isRunning = true
		things.push(this)
		return this
	},
	
	stop: function()
	{
		this._isRunning = false
		things.remove(this)
		
		for (var i = 0; i < this._removeOnStop.length; i++)
		{
			screen.remove(this._removeOnStop[i])
		}
		
		this._removeOnStop = []
		
		return this
	},
	
	toggleRunning: function()
	{
		if (this._isRunning)
		{
			this.stop()
		}
		else
		{
			this.start()
		}
	},
	
	attachToKey: function(k)
	{
		var self = this
		screen.key([k], function(ch, key) 
		{
		  	self.clone().start()
		});	
	},
	
	toggleAttachToKey: function(k)
	{
		var self = this
		screen.key([k], function(ch, key) 
		{
		  	self.toggleRunning()
		});	
	},
		
	screenAppend: function(e)
	{
		screen.append(e)
		this._removeOnStop.push(e)
	},
	
	screenRemove: function(e)
	{
		screen.remove(e)
		this._removeOnStop.remove(e)
	},
}

// --- boxed ------------------------

var Boxed = Thing.clone()
Boxed._box = null

Boxed._boxActive = false

Boxed.box = function()
{
	if (this._box == null)
	{
		this._box = this.newBox()
	}
	
	return this._box
}

Boxed.start = function()
{
	Thing.start.apply(this)
	
	if (!this._boxActive)
	{
		this._boxActive = true
		this.screenAppend(this.box())
	}
}

Boxed.stop = function()
{
	Thing.stop.apply(this)
	if (this._box)
	{
		this.screenRemove(this._box)
		this._boxActive = false
	}
}

// --- hLine -----------------------

HLine = Thing.clone()
HLine._color = '#fff bg'

HLine.render = function()
{
	this._ttl = screen.height - 1
	program.setx(0)
	program.sety(this._age % screen.height)
	program.write(this.blockString(), this._color)
}

{
	var line = HLine.clone()
	line._color = '#f00 bg'
	line.attachToKey("h")
}

{
	line = HLine.clone()
	line._color = '#0f0 bg'
	line.attachToKey("j")
}

{
	line = HLine.clone()
	line._color = '#00f bg'
	line.attachToKey("k")
}

// --- vLine -----------------------

var vLine = Thing.clone()
vLine._changesColor = true
vLine._changesDir = false
vLine.start = function()
{
	Thing.start.apply(this)
	
	this._color = this.randColor() + ' bg'

	if (Math.random() < .5)
	{
		this._y = 1 + Math.floor((screen.height -2)*Math.random())
		this._xdir = Math.random() > .5 ? 1 : -1
		this._ydir = 0
	
		if (this._xdir == -1)
		{
			this._x = screen.width
		}
		else
		{
			this._x = 0
		}
	}
	else
	{
		this._x = 1 + Math.floor((screen.width -2)*Math.random())
		this._ydir = Math.random() > .5 ? 1 : -1
		this._xdir = 0
	
		if (this._ydir == -1)
		{
			this._y = screen.height
		}
		else
		{
			this._y = 0
		}
	}	
}

vLine.changeDir = function()
{
	if (this._xdir != 0)
	{
		this._xdir = 0
		this._ydir = Math.random() > .5 ? 1 : -1
	}
	else
	{
		this._ydir = 0
		this._xdir = Math.random() > .5 ? 1 : -1
	}	
}

vLine.render = function()
{
	var aChar = "  "
	
	if (this._changesDir && Math.random() < .05)
	{
		this.changeDir()
	}
	
	if (this._changesColor)
	{
		this._color = this.randColor() + ' bg'
	}
	
	this._x += this._xdir * aChar.length
	this._y += this._ydir 
	
	if (this._x > screen.width  -1 || this._x < 0 ||
		this._y > screen.height -1 || this._y < 0 )
	{	
		this.stop()
		return
	}
	
	program.setx(this._x)
	program.sety(this._y)
	program.write(aChar, this._color)
}


{
	var line = vLine.clone()
	line._changesColor = false
	line._changesDir = false
	line.attachToKey("n")
}

{
	var line = vLine.clone()
	line._changesColor = true
	line._changesDir = true
	line.attachToKey("m")
}




// --- tDot ------------------------------

var tDot = Thing.clone()
tDot._char = "          "  
tDot.render = function()
{
	program.setx(this.randX())
	program.sety(this.randY())
	program.write(this._char, this.randColor() + ' bg')
}	
tDot._ttl = 10
tDot.attachToKey("z")

{
	var dot = tDot.clone()
	dot._char = "  "
	dot._ttl = 0
	dot.toggleAttachToKey("x")
}

{
	var dot2 = tDot.clone()
	dot2._ttl = 1
	/*
	dot2._ttl = 10
	dot2.start2 = function()
	{
		program.setx(this.randX())
		program.sety(this.randY())
	}
	dot2.render2 = function()
	{
		program.write(this._char, this.randColor() + ' bg')
	}	
	*/
	dot2.attachToKey("c")
}

// --- TextBlob ------------------------------

var Blob = Boxed.clone()

Blob.start = function()
{
	Boxed.start.apply(this)
	this.box().ch = this.randChar()
}

Blob.randBoxFgColor = function()
{
	this.box().style.fg = this.randColor()
}

Blob.randBoxBgColor = function()
{
	this.box().style.bg = this.randColor()
}

Blob.randBoxX = function()
{
	var box =  this.box()
	var w = box.width
	if (box == null)
	{
	console.log("box = ", box)
	}
	box.left = Math.floor(Math.random()*(screen.width - 2))
	box.width = w
}

Blob.randBoxWidth = function()
{
	do {
		this.box().width = Math.floor(Math.random()*(screen.width  - this.box().left))
	} while (this.box().width * this.box().height > screen.width * screen.height *.25)
}

Blob.randBoxY = function()
{
	var h = this.box().height
	this.box().top = Math.floor(Math.random()*(screen.height  - 2))
	this.box().height = h
}

Blob.randBoxHeight = function()
{
	do {
		this.box().height = Math.floor(Math.random()*(screen.height - this.box().top))
	} while (this.box().width * this.box().height > screen.width * screen.height *.25)
}

Blob.randBox = function()
{
	this.randBoxX()
	this.randBoxWidth()
	
	this.randBoxY()
	this.randBoxHeight()
	
	this.randBoxBgColor()
}

Blob.render = function()
{
	if (this._kind == "random")
	{
		this.randBoxX()	
		this.randBoxWidth()	
		this.randBoxY()	
		//this.randBoxHeight()	
	}
	else if (this._kind == "horizontal")
	{
		this.randBoxX()
	}
	
	else if (this._kind == "vertical")
	{
		this.randBoxY()
	}

	if (this._isSolid)
	{
		this.box().ch = " "
		this.randBoxBgColor()
	}
	else
	{
		this.box().style.bg = "#000"
		this.box().ch = this.randChar()
		this.randBoxFgColor()
	}
}

Blob.makeVertical = function()
{
	if (this._kind == "vertical")
	{
		this.randBoxX()
		this.randBoxWidth()
		this.randBoxY()
		this.randBoxHeight()
	}
  	this._kind = "vertical"	
}

Blob.makeHorizontal = function()
{
	if (this._kind == "horizontal")
	{
		this.randBoxX()
		this.randBoxWidth()
		this.randBoxY()
		this.randBoxHeight()
	}
  	this._kind = "horizontal"	
}


Blob._ttl = 0
Blob._kind = "random"
Blob._isSolid = false
Blob.toggleAttachToKey("q")

screen.key(["w"], function(ch, key) 
{
  	Blob._isSolid = !Blob._isSolid
});

screen.key(["e"], function(ch, key) 
{
  	Blob.makeVertical()
});	

screen.key(["r"], function(ch, key) 
{
  	Blob.makeHorizontal()
});

screen.key(["t"], function(ch, key) 
{
  	Blob._kind = "random"
});

// ----

Blob2 = Blob.clone()
Blob2.toggleAttachToKey("a")

screen.key(["s"], function(ch, key) 
{
  	Blob2._isSolid = !Blob2._isSolid
});

screen.key(["d"], function(ch, key) 
{
  	Blob2.makeVertical()
});	

screen.key(["f"], function(ch, key) 
{
  	Blob2.makeHorizontal()
});

screen.key(["g"], function(ch, key) 
{
  	Blob2._kind = "random"
});


// --- Flash ----------------------------------------

var Flash = Boxed.clone()

Flash.start = function()
{
	Boxed.start.apply(this)
	this.box().ch = ' '
	this.box().left = 0
	this.box().top = 0
	this.box().width = screen.width
	this.box().height = screen.height
	this.box().style.bg = "#fff"
	//this.middle()
}

Flash.middle = function()
{
	var h = 10
	var w = h*3
	this.box().left = Math.floor((screen.width - w)/2)
	this.box().top = Math.floor((screen.height - h)/2)
	this.box().width = w
	this.box().height = h	
	//console.log("this.box().top = " + this.box().top)
}

Flash.render = function()
{
}

Flash._ttl = 1

{
	var flash = Flash.clone()
	flash.start = function()
	{
		Flash.start.apply(this)
		this.box().style.bg = "#f00"
	}
	flash.attachToKey("u")
}

{
	var flash = Flash.clone()
	flash.start = function()
	{
		Flash.start.apply(this)
		this.box().style.bg = "#0f0"
	}
	flash.attachToKey("i")
}

{
	var flash = Flash.clone()
	flash.start = function()
	{
		Flash.start.apply(this)
		this.box().style.bg = "#00f"
	}
	flash.attachToKey("o")
}


// ---

Blinker = Blob.clone()
Blinker.start = function()
{
	Flash.start.apply(this)
	this.randBox()
	this._ttl = 1
}
Blinker.render = function()
{
	//var color = this._age % 5 ? "#fff" : "#000"
	//this.box().style.bg = color
}
Blinker.attachToKey("[")

// ---

{
	var TextBlinker = Blob.clone()
	TextBlinker.start = function()
	{
		Flash.start.apply(this)
		this.randBox()
		this.box().style.bg = "#000"
		this.box().style.fg = this.randColor()
		this.box().ch = this.randChar()
		this._ttl = 1
	}
	TextBlinker.render = function()
	{
		//var color = this._age % 5 ? "#fff" : "#000"
		//this.box().style.bg = color
	}
	TextBlinker.attachToKey("]")
}

// ------------------

function componentToHex(c) 
{
    var hex = c.toString(16);
	return hex.charAt(0)
    //return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) 
{
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

Photo = Boxed.clone()
Photo._ttl = 1000
Photo._x = 0
Photo._y = 0
Photo.width = function()
{
	return this._pixels.shape[0]
}

Photo.height = function()
{
	return this._pixels.shape[1]
}

Photo._isSetup = false

Photo.center = function()
{
//	if (!this._isSetup)
	{
		this._isSetup = true
		this._x = (screen.width - this.width())/2
		this._y = (screen.height - this.height())/2
/*
		this.box().top = this._y
		this.box().left = this._x
		this.box().width = this.width()
		this.box().height = this.height()
		this.box().setText(this.content())	
		this.box().style.fg = "#fff"
		*/
	}
}

Photo.render = function()
{
	var pixels = this.pixels()

	if (pixels == null) 
	{
		return
	}

	this.center()

	var w = this.width()
	var h = this.height()
	
	for (var x = 0; x < w && x + this._x < screen.width -1 && x + this._x > 0; x ++)
	{
		for (var y = 0; y < h && y + this._y < screen.height -1 && y + this._y > 0; y ++)
		{
			var r = pixels.get(x, y, 0)
			var g = pixels.get(x, y, 1)
			var b = pixels.get(x, y, 2)
			
			if (r + g + b < 256*3*.8)
			{
				var px = x + this._x
				var py = y + this._y
				//if (px > 0 && py > 0 && px < screen.width - 1 && px < screen.height - 1)
				{
					program.setx(px)
					program.sety(py)
					//var color = rgbToHex(r, g, b) + " bg"
					//program.write('x', color)
					program.write('x', "#fff fg")
				}
			}
		}
	}
}
Photo._content = null
Photo.content = function()
{
	var pixels = this.pixels()
	
	if (pixels && this._content == null) 
	{
		this._content = ""
		var w = this.width()
		var h = this.height()
	
		for (var y = 0; y < h && y + this._y < screen.height -1; y ++)
		{
			for (var x = 0; x < w && x + this._x < screen.width -1; x ++)
			{
				var r = pixels.get(x, y, 0)
				var g = pixels.get(x, y, 1)
				var b = pixels.get(x, y, 2)
				
				if (r+g+b < 256*3*.8)
				{
					this._content = this._content + "x"
				}
				else
				{
					this._content = this._content + " "
				}
			}
			this._content = this._content + "\n"
		}
	}
	
	return this._content
}

Photo._name = "cat.png"
Photo._pixels = null
Photo._isLoading = false

Photo.pixels = function()
{
	if (this._pixels == null && this._isLoading == false)
	{
		console.log("loading '" + this._name + "'")

		this._isLoading = true
		
		var getPixels = require("get-pixels")
		
		var self = this
		getPixels(this._name, function(err, pixels) 
		{
			if(err) 
			{
				console.log("Bad image path")
				return
			}
			//console.log("got pixels", pixels.get(0,0,1))
			self._pixels = pixels
		})
	}
	
	return this._pixels
}

//program.clear()
Photo.pixels()
Photo.toggleAttachToKey("v")



// --- screen render loop -------------------------------------------

screen._age = 0

screen.step = function()
{
	//program.alternateBuffer();
	program.hideCursor()
	program.clear()
  	//program.normalBuffer();

	for (var i = 0; i < things.length; i ++)
	{
		things[i].render()
	}
		
	for (var i = 0; i < things.length; i ++)
	{
		things[i].step()
	}

	program.setx(0)
	program.sety(0)

	this._age ++
		
	screen.render()
}

// --- setting the speed with number keys ---

intervalObj = null
isPaused = false

function setDt(dt)
{
	clearInterval(intervalObj)
	intervalObj = setInterval( function () { screen.step() } , dt)
	lastDt = dt	
}

setDt(50)

screen.key(['0'], function(ch, key) 
{	
	if (isPaused)
	{
		isPaused = false
		setDt(lastDt)
	}
	else
	{
		isPaused = true
		clearInterval(intervalObj)
	}

});

screen.key(['1'], function(ch, key) 
{
	setDt(500)
});

screen.key(['2'], function(ch, key) 
{
	setDt(250)

});

screen.key(['3'], function(ch, key) 
{
	setDt(120)
});

screen.key(['4'], function(ch, key) 
{
	setDt(80)
});

screen.key(['5'], function(ch, key) 
{
	setDt(50)
});

screen.key(['6'], function(ch, key) 
{
	setDt(25)
});

screen.key(['7'], function(ch, key) 
{
	setDt(5)
});

screen.key(['\\'], function(ch, key) 
{
	Thing.nextPalette()
});



// --- escape key -------------------------------------------

screen.key(['escape', 'C-c'], function(ch, key) 
{
  return process.exit(0);
});


// --- picture -------------------------------------------

/*

var contrib = require('blessed-contrib')

var pic = contrib.picture(
    { 
		file: './a.png', 
		cols: 30, //screen.width,
		onReady: ready
	}
)

pic.step = function () {}

var picture = null
function ready() 
{ 
	//things.push(pic)
  	pic.setContent(pic.writer.toString())
	picture = pic
}

	if (picture)
	{
		program.setx(10)
		program.sety(10)
		//program.write(picture.content)
		//picture.render()
	}
*/


