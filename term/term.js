var blessed = require('blessed')
var program = blessed.program()

var screen = blessed.screen();
screen.smartCSR = true
screen.fastCSR = true
screen.useBCE = true
screen.autoPadding = false

// ------------------------------------------

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

function pickAny(array)
{
	var i = Math.floor(Math.random() * array.length) % array.length
	return array[i]
}

// ----------------------------------------------

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
	},
	
	_count: 0,
	_ttl: 0,
	
	step: function()
	{
		this._count ++
		
		if (this._ttl != 0 && this._count > this._ttl)
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
		return pickAny(["#fff", "#f00", "#0f0", "#ff0", "#00f", "#0ff", "#f0f"])
	},
	
	randChar: function()
	{
		return pickAny(["O", "+", "|", "-"])
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
	
	start: function()
	{
		things.push(this)
		return this
	},
	
	stop: function()
	{
		things.remove(this)
		return this
	},
	
	attachToKey: function(k)
	{
		var self = this
		screen.key([k], function(ch, key) 
		{
		  	self.clone().start()
		});	
	}
}

// --- hLine -----------------------

var hLine = Thing.clone()

hLine.render = function()
{
	this._ttl = screen.height -1
	program.setx(0)
	program.sety(this._count % screen.height)
	program.write(this.blockString(), this.randColor() + ' bg')
	/*
	var color = this.randColor() + ' bg'
	for (var x = 0; x < screen.width; x ++)
	{
		program.setx(x)
		program.sety(this._count % screen.height)
		program.write(" ", color)
	}	
	*/
}

hLine.attachToKey("h")

// --- vLine -----------------------

var vLine = Thing.clone()

vLine.init = function()
{
	this._x = 0
}

vLine.render = function()
{
	var aChar = "  "
	var color = this.randColor() + ' bg'
	this._x += aChar.length
	
	if (this._x > screen.width -1)
	{	
		this.stop()
		return
	}
	
	for (var y = 0; y < screen.height; y += Math.floor((screen.height -1)/4))
	{
		program.setx(this._x)
		program.sety(y)
		program.write(aChar, color)
	}
}

vLine.attachToKey("v")

// --- tDot ------------------------------

var tDot = Thing.clone()

tDot.render = function()
{
	//this._ttl = 15
	program.setx(this.randX())
	program.sety(this.randY())
	program.write(" ", this.randColor() + ' bg')
}	


tDot._ttl = 15

tDot.attachToKey("d")

// --- textBlob ------------------------------

var textBlob = Thing.clone()

textBlob.init = function()
{
	this._box = blessed.box(
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
			ch: 'x'
		}
	);
	
	this._box.ch = this.randChar()

	screen.append(this._box)
}

textBlob.randPos = function()
{
	this._box.top = Math.floor(Math.random()*(screen.width  - 2))
	this._box.left = Math.floor(Math.random()*(screen.height - 2))
	this._box.width = Math.floor(Math.random()*(screen.width  - this._box.left))
	this._box.height = Math.floor(Math.random()*(screen.height - this._box.top))
	this._box.style.fg = this.randColor()
	//this._box.ch = this.randChar()
		
}

textBlob.render = function()
{
	//Thing.step.apply(this)
	this.randPos()
}

textBlob.stop = function()
{
	Thing.stop.apply(this)
	screen.remove(this._box)
	this._box = null
}

textBlob._ttl = 20

textBlob.attachToKey("t")


// ----------------------------------------------

screen._age = 0

screen.step = function()
{
	//program.alternateBuffer();
	program.hideCursor()
	program.clear()

	for (var i = 0; i < things.length; i ++)
	{
		var thing = things[i]
		thing.render()
	}
		
	for (var i = 0; i < things.length; i ++)
	{
		var thing = things[i]
		thing.step()
	}
	
	program.setx(0)
	program.sety(0)

	this._age ++
	
	screen.render()
}

setInterval(function () { screen.step() } , 30)

screen.key(['escape', 'C-c'], function(ch, key) 
{
  return process.exit(0);
});

