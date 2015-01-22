
// --- setup blessed ---------------------------------------

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
	
	randColor: function()
	{
		return ["#fff", "#f00", "#0f0", "#ff0", "#00f", "#0ff", "#f0f"].pickAny()
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

Boxed.start = function()
{
	Thing.start.apply(this)
	
	//if (this._box == null)
	{
		this._box = this.newBox()
		this.screenAppend(this._box)
	}
}

Boxed.stop = function()
{
	Thing.stop.apply(this)
	this._box = null
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

BlueHLine = HLine.clone()
BlueHLine._color = '#00f bg'
BlueHLine.attachToKey("h")

GreenHLine = HLine.clone()
GreenHLine._color = '#0f0 bg'
GreenHLine.attachToKey("g")


RedHLine = HLine.clone()
RedHLine._color = '#f00 bg'
RedHLine.attachToKey("j")

// --- vLine -----------------------

var vLine = Thing.clone()
vLine._movesX = true
vLine._changesColor = true
vLine._changesDir = false
vLine.start = function()
{
	Thing.start.apply(this)
	
	this._color = this.randColor() + ' bg'

	if (this._movesX)
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

vLine.attachToKey("v")

{
	var line = vLine.clone()
	line._changesColor = false
	line._movesX = false
	line.attachToKey("b")
}

{
	var line = vLine.clone()
	line._changesColor = false
	line.attachToKey("n")
}

{
	var line = vLine.clone()
	line._changesColor = true
	line._changesDir = true
	line.attachToKey("m")
}

{
	var line = vLine.clone()
	line._movesX = false
	line._changesColor = true
	line._changesDir = true
	line.attachToKey(",")
}



// --- tDot ------------------------------

var tDot = Thing.clone()
tDot.render = function()
{
	program.setx(this.randX())
	program.sety(this.randY())
	program.write(" ", this.randColor() + ' bg')
}	
tDot._ttl = 15
tDot.attachToKey("d")

// --- TextBlob ------------------------------

var Blob = Boxed.clone()

Blob.start = function()
{
	Boxed.start.apply(this)
	this._box.ch = this.randChar()
}

Blob.randBoxFgColor = function()
{
	this._box.style.fg = this.randColor()
}

Blob.randBoxBgColor = function()
{
	this._box.style.bg = this.randColor()
}

Blob.randBoxX = function()
{
	var w = this._box.width
	this._box.left = Math.floor(Math.random()*(screen.width - 2))
	this._box.width = w
}

Blob.randBoxWidth = function()
{
	this._box.width = Math.floor(Math.random()*(screen.width  - this._box.left))
}

Blob.randBoxY = function()
{
	var h = this._box.height
	this._box.top = Math.floor(Math.random()*(screen.height  - 2))
	this._box.height = h
}

Blob.randBoxHeight = function()
{
	this._box.height = Math.floor(Math.random()*(screen.height - this._box.top))
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
		this._box.ch = " "
		this.randBoxBgColor()
	}
	else
	{
		this._box.style.bg = "#000"
		this._box.ch = this.randChar()
		this.randBoxFgColor()
	}
}


Blob._ttl = 0
Blob.toggleAttachToKey("q")
Blob._kind = "random"
Blob._isSolid = false


screen.key(["e"], function(ch, key) 
{
  	Blob._kind = "vertical"
});	

screen.key(["r"], function(ch, key) 
{
  	Blob._kind = "horizontal"
});

screen.key(["t"], function(ch, key) 
{
  	Blob._kind = "random"
});

screen.key(["w"], function(ch, key) 
{
  	Blob._isSolid = !Blob._isSolid
});


// --- Flash ----------------------------------------

var Flash = Boxed.clone()

Flash.start = function()
{
	Boxed.start.apply(this)
	this._box.ch = ' '
	this._box.left = 0
	this._box.top = 0
	this._box.width = screen.width
	this._box.height = screen.height
	this._box.style.bg = "#fff"
	//this.middle()
}

Flash.middle = function()
{
	var h = 10
	var w = h*3
	this._box.left = Math.floor((screen.width - w)/2)
	this._box.top = Math.floor((screen.height - h)/2)
	this._box.width = w
	this._box.height = h	
	//console.log("this._box.top = " + this._box.top)
}

Flash.render = function()
{
}

Flash._ttl = 1
Flash.attachToKey("u")

// ---

RedFlash = Flash.clone()
RedFlash.start = function()
{
	Flash.start.apply(this)
	this._box.style.bg = "#f00"
}
RedFlash.attachToKey("i")

// ---

GreenFlash = Flash.clone()
GreenFlash.start = function()
{
	Flash.start.apply(this)
	this._box.style.bg = "#0f0"
}
GreenFlash.attachToKey("o")

// ---

BlueFlash = Flash.clone()
BlueFlash.start = function()
{
	Flash.start.apply(this)
	this._box.style.bg = "#00f"
}
BlueFlash.attachToKey("p")

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
	//this._box.style.bg = color
}
Blinker.attachToKey("[")

// ---

{
	var TextBlinker = Blob.clone()
	TextBlinker.start = function()
	{
		Flash.start.apply(this)
		this.randBox()
		this._box.style.bg = "#000"
		this._box.style.fg = this.randColor()
		this._box.ch = this.randChar()
		this._ttl = 1
	}
	TextBlinker.render = function()
	{
		//var color = this._age % 5 ? "#fff" : "#000"
		//this._box.style.bg = color
	}
	TextBlinker.attachToKey("]")
}


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

setInterval(function () { screen.step() } , 40)

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


