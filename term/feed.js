
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

screen._age = 0

// ----------------------------

String.prototype.reverse = function()
{
    return this.split("").reverse().join("");
}

String.prototype.repeat = function( num )
{
	num = Math.floor(num)
	
	if (num < 0)
	{
		num = 0
	}
	
	if (num == 0)
	{
		return ""
	}
		
    return new Array( num + 1 ).join( this );
}

Array.prototype.pickAny = function()
{
	var i = Math.floor(Math.random() * this.length) % this.length
	return this[i]
}

// ----------------------------

Printer = 
{
	_palettes: [
			["#fff", "#f00", "#0f0", "#ff0", "#00f", "#0ff", "#f0f"],
			["#111", "#222", "#333", "#444", "#555", "#666"]
			//["#f00", "#f33", "#f66", "#f99", "#fcc"]
		],
	
	_paletteNum: 0,
	
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
	
	chars: function()
	{
		return ["O", "+", "|", "-"]
	},
	
	randChar: function()
	{
		return this.chars().pickAny()
	},
	
	cycleColor: function()
	{
		var p = this.palette()
		return p[Math.floor(screen._age/10) % p.length]
	},
	
	pulseColor: function(v)
	{
		if (v == null)
		{
			v = this._pulse
		}
		
		if (v < .2)
		{
			return "#f99"
		}
		
		if (v < .4)
		{
			return "#f00"
		}
		
		if (v < .5)
		{
			return "#0f0"
		}
		
		if (v < .6)
		{
			return "#0ff"
		}
		
		return "#00f"
	},
	
	_ypos: null,

	print: function()
	{
		this._pulse *= .99
		if (this._isMuted)
		{
			console.log("")
		}
		else
		{
			var color = this._colorFunc.apply(this) + " fg"
			
			if (this._ypos != null)
			{
				program.setx(0)
				program.sety(this._ypos)
			}
				
			if (this._stack.length)
			{
				var s = this._stack.pop()
				program.write(s + "\n", color)
			}
			else
			{
				program.write(this.string() + "\n", color)
			}
		}
	},
	
	_isMuted: false,
			//var n = Math.floor(screen.width*Math.random())
			//var n = Math.floor((screen.width-1)*(1+Math.sin(screen._age/10))/2)
			
	_pulses: [],
	_pulse: 0,
	
	setPulse: function(v)
	{
		this._isMuted = false
		
		if (v < 0) { v = 0; }
		if (v > 1) { v = 1; }
		
		if (v == this._pulses[0])
		{
			
		}
		else
		{
			this._pulses.push(v)
			
			if (this._pulses.length > 2)
			{
				this._pulses.pop()
			}
		}
		
		this._pulse = v
	},
		
	string: function(v)
	{
		if (v == null)
		{
			v = this._pulse
		}
		
		var n = Math.floor((screen.width-1)*v)
		var s = this.randChar().repeat(n) 
	 	var pad = " ".repeat(Math.floor((screen.width - s.length)/2))
	
		this._string = pad + s
		return this._string
	},
	
		
	sinPulse: function()
	{
		var v = (1 + Math.sin(screen._age/100))/2
		this.setPulse(v)
	},
	
	_stack: [],
	_colorFunc: null,
	
	pushBlock: function()
	{
		this._stack.push(this.randChar().repeat(screen.width))
	},
	
	pushBlock2: function()
	{
		var s = ""
		for (var i = 0; i < screen.width; i++)
		{
				s = s + this.randChar()
		}
		this._stack.push(s)
	},
	
	pushBlock3: function()
	{
		var s = ""
		for (var i = 0; i < screen.width/2; i++)
		{
			if (Math.random() < .1)
			{
				s = s + this.randChar()
			}
			else
			{
				s = s + " "
			}
		}
		s = s + s.reverse()
		this._stack.push(s)
	},
		
	pushBlock4: function(c)
	{
		if (c == null)
		{
			c = this.randChar()
		}
		
		var s = c.repeat(screen.width)
		for (var i = 0; i < screen.height; i++)
		{
			this._stack.push(s)
		}
	},
	
	pushBlock5: function(c)
	{				
		for (var y = 0; y < screen.height; y++)
		{
			var s = ""
			for (var x = 0; x < screen.width; x++)
			{
				var c = (x % 2 == 1) ? c : " "
				s = s + c
			}
			this._stack.push(s)
			this._stack.push("")
		}
	},
	
	pushBlock6: function(c)
	{		
		var chars = [" ", c]
		
		for (var y = 0; y < screen.height; y++)
		{
			var s = ""
			for (var x = 0; x < screen.width; x++)
			{
				var c = chars[Math.floor(y*x) % chars.length]
				s = s + c
			}
			this._stack.push(s)
		}
	},
}

Printer._colorFunc = Printer.pulseColor

// ----------


screen.key(['a'], function(ch, key) 
{
	Printer.pushBlock()
});

screen.key(['s'], function(ch, key) 
{
	Printer.pushBlock2()
});

screen.key(['d'], function(ch, key) 
{
	Printer.pushBlock3()
});

screen.key(['f'], function(ch, key) 
{
	Printer.pushBlock4()
});

screen.key(['g'], function(ch, key) 
{
	Printer.pushBlock4("+")
});

screen.key(['h'], function(ch, key) 
{
	Printer.pushBlock4("-")
});

screen.key(['j'], function(ch, key) 
{
	Printer.pushBlock5(".")
});

screen.key(['k'], function(ch, key) 
{
	Printer.pushBlock5("'")
});

screen.key(['l'], function(ch, key) 
{
	Printer.pushBlock5("`")
});

// --- pos ---

screen.key(['p'], function(ch, key) 
{
	if (Printer._ypos == null)
	{
		Printer._ypos = Math.floor(screen.height/2)
	}
	else
	{
		Printer._ypos = null
	}
});

// --- color ---

screen.key(['q'], function(ch, key) 
{
	Printer._colorFunc = Printer.pulseColor
});

screen.key(['w'], function(ch, key) 
{
	Printer._colorFunc = Printer.cycleColor
});


// ----------

screen.key(['m'], function(ch, key) 
{
	Printer.sinPulse()
});

screen.key(['n'], function(ch, key) 
{
	Printer._isMuted = !Printer._isMuted
});

screen.key(['b'], function(ch, key) 
{
	Printer.setPulse(2/screen.width)
});

screen.key(['v'], function(ch, key) 
{
	Printer.setPulse(.1)
});

screen.key(['c'], function(ch, key) 
{
	Printer.setPulse(.4)
});

screen.key(['x'], function(ch, key) 
{
	Printer.setPulse(.75)
});

screen.key(['z'], function(ch, key) 
{
	Printer.setPulse(1)
});

// ----------

program.hideCursor()

screen.step = function()
{
	Printer.print()
	this._age ++		
}

// --- setting the speed with number keys ---

intervalObj = null
isPaused = false

function setDt(dt)
{
	if (dt < 0) { dt = 0; }
	clearInterval(intervalObj)
	intervalObj = setInterval( function () { screen.step() } , dt)
	lastDt = dt	
}

setDt(0)

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
	setDt(0)
});

screen.key(['8'], function(ch, key) 
{
	setDt(lastDt + 3)
});

screen.key(['9'], function(ch, key) 
{
	setDt(lastDt - 3)
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


