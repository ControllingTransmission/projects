
// --- setup blessed ---------------------------------------
//var AudioContext = require('web-audio-api').AudioContext
//var AudioContextMonkeyPatch = require('audioinput/AudioContextMonkeyPatch');
//var Spectrum = require('./audioinput/Spectrum');
require('./extra.js');

var fs = require('fs')
var blessed = require('blessed')
var program = blessed.program()
var screen = blessed.screen();
screen.smartCSR = true
screen.fastCSR = true
screen.useBCE = true
screen.autoPadding = false
screen.alloc()
screen._age = 0

Printer = 
{
	
	// --- printFuncs ---------------------
	
	_printFuncs: [],
	
	addPrintFunc: function(f)
	{
		this._printFuncs.appendIfAbsent(f)
		return this
	},
	
	removePrintFunc: function(f)
	{
		this._printFuncs.remove(f)
		return this
	},
	
	capString: function(s)
	{
		if(s.length < screen.width)
		{
			s += " ".repeat(screen.width - s.length)
		}
		else if(s.length > screen.width)
		{
			s = s.substring(0, screen.width)
		}
		
		return s
	},
	
	mergeStrings: function(s1, s2)
	{
		// s2 overwrites s1 unless s2 char is a space
		
		s1 = this.capString(s1)
		s2 = this.capString(s2)
		
		var out = ""
		
		for (var i = 0; i < s1.length; i ++)
		{
			var c1 = s1.charAt(i)
			var c2 = s2.charAt(i)
			
			if (c2 == " ")
			{
				out += c1
			}
			else
			{
				out += c2
			}
		}
		
		return out
	},
	
	renderFuncsString: function()
	{
		var funcsToRemove = []
		var s = ""
		
		for (var i = 0; i < this._printFuncs.length; i ++)
		{
			var f = this._printFuncs[i]
			var s2 = f.apply(this)
			
			if (s2 == null)
			{
				funcsToRemove.push(f)
			}
			else
			{
				s = this.mergeStrings(s, s2)
			}
		}
		
		for (var i = 0; i < funcsToRemove.length; i ++)
		{
			var f = funcsToRemove[i]
			this.removePrintFunc(f)
		}
		
		return s
	},
	
	// --- colors ---------------------
	
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
	
	_nextColorNum: 0,
	
	nextColorFunc: function()
	{
		var p = this.palette()
		return p[this._nextColorNum % p.length]
	},
	
	pickNextColor: function()
	{
		this._nextColorNum ++
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
			return "#daf1fb"
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
	
	currentColor: function()
	{
		var color = this._colorFunc.apply(this) + " fg"
		return color
	},
	
	// -----------------------------------------------------------
	
	print: function()
	{
		this._pulse *= .99
		
		if (this._isMuted)
		{
			console.log("")
		}
		else
		{
			var color = this.currentColor()
			var ret = "\n"
			
			if (this._ypos != null)
			{
				program.setx(0)
				program.sety(Math.floor(screen.height*Math.random()))
				ret = ""
			}
			
			var s = ""
		
			if (this._stack.length)
			{
				s = this._stack.pop()
			}
			else 
			if (this._bikeMode)
			{
				s = this.bikeString()
			}	
			else
			{
				s = this.string()
			}

			if (this._mirrorMode) 
			{ 
				s = this.mirrorString(s) 
			}
			
			var out = s + ret
			//if (out.trim() != "")
			{
				program.write(out, color)
			}
		}
	},
	
	_isMuted: false,
			
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
	
	centerString: function(s)
	{
		s = s.substring(0, screen.width-1)

	 	var pad = " ".repeat(Math.floor((screen.width - s.length)/2))
		s = pad + s 
		return s + " ".repeat(screen.width - s.length)
	},
		
	string: function(v)
	{
		if (v == null)
		{
			v = this._pulse
		}
		
		var s = ""
		
		if (this._pulseStyle == 0)
		{
			var n = Math.floor((screen.width-1)*v)
			s = this.randChar().repeat(n) 
		}
		else
		{
			var half = Math.floor(screen.width/2)
			var n = Math.floor((half)*v)
			s = this.randChar().repeat(n-3) + " ".repeat(half - n -1) 
			s = s + s.reverse()
			s = s.substring(0, screen.width-10)
		}
		
		return this.centerString(s)
	},
	
	_pulseStyle: 0,
	
	nextPulseStyle: function()
	{
		this._pulseStyle ++
		this._pulseStyle = this._pulseStyle % 2
		
	},
		
	sinPulse: function()
	{
		var v = (1 + Math.sin(screen._age/100))/2
		this.setPulse(v)
	},
	
	_stack: [],
	
	stackPush: function(s)
	{
		if (this._stack.length < 3000)
		{
			this._stack.push(s)
		}
	},
	
	_colorFunc: null,
	
	pushBlock: function()
	{
		this.stackPush(this.randChar().repeat(screen.width))
	},
	
	pushBlock2: function()
	{
		var s = ""
		for (var i = 0; i < screen.width; i++)
		{
				s = s + this.randChar()
		}
		this.stackPush(s)
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
		this.stackPush(s)
	},
	
	mirrorString: function(s)
	{
		var h = Math.floor(screen.width/2)
		s = s.substring(0, h)
		
		if (s.length < h) 
		{ 
			s = s + " ".repeat(h - s.length) 
		}
		
		return s + s.reverse()
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
			this.stackPush(s)
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
			this.stackPush(s)
			this.stackPush("")
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
			this.stackPush(s)
		}
	},
	
	randCode: function()
	{
		var line = this._codeLines.pickAny()
		line = line.split("//")[0]
		line = line.substring(0, screen.width-1)
		return line
	},
	
	_mirrorMode: false,
	
	toggleMirrorMode: function()
	{
		this._mirrorMode = !this._mirrorMode
	},
	
	randHexCode: function()
	{
		var line = this._hexCodeLines.pickAny()
		return this.centerString(line)
	},
	
	randHexiCode: function()
	{
		var line = this._hexiCodeLines.pickAny()
		return this.centerString(line)
	},
	
	pushCodeDump: function()
	{
		for (var i = 0; i < screen.height; i++)
		{
			this.stackPush(this.randCode())
		}
	},
	
	pushHexiCodeDump: function()
	{
		for (var i = 0; i < screen.height; i++)
		{
			this.stackPush(this.randHexiCode())
		}
	},
	
	pushCodeLine: function()
	{
		this.stackPush(this.randCode())
	},
	
	pushHexCodeLine: function()
	{
		this.stackPush(this.randHexCode())
	},
	
	pushHexiCodeLine: function()
	{
		this.stackPush(this.randHexiCode())
	},

	pushHexCodeDump: function()
	{
		for (var i = 0; i < screen.height; i++)
		{
			this.stackPush(this.randHexCode())
		}
	},	
	
	_codeMode: false,
	toggleCodeMode: function()
	{
		this._codeMode = !this._codeMode
	},
	
	
	_bikeMode: false,
	toggleBikeMode: function()
	{
		this._bikeMode = !this._bikeMode
	},
	
	_bikeStrafe: false,
	toggleBikeStrafe: function()
	{
		this._bikeStrafe = !this._bikeStrafe
	},
	
	_bikeX: 0,
	
	bikeString: function()
	{
		var x = this._bikeX
		var s = ""
		var r = this._bikeStrafe ? .01 : .1
		
		if ((this._bikeShifts && Math.random() < r) || this._bikeStrafePulse)
		{
			var nx = Math.floor(Math.random() * (screen.width - 1))
			this._bikeX = nx
			
			if (this._bikeStrafe || this._bikeStrafePulse)
			{
				this._bikeStrafePulse = false
				
				var x1 = nx < x ? nx : x
				var x2 = nx > x ? nx : x
				var w = x2 - x1
			
				var c = this.bikeChar()
			
				if (c == "|")
				{
					c = "_"
				}
			
				if (c == "^")
				{
					c = nx > x ? ">" : "<"
				}
			
				s = " ".repeat(x1) + c.repeat(w)
			}			
		}
		else
		{
			s = " ".repeat(x) + this.bikeChar()
		}
		
		return s
	},
	
	bikePulse: function()
	{
		for (var i = 0; i < screen.height; i++)
		{
			this.stackPush(this.bikeString())	
		}
	},
	
	_bikeChars: [".", "|", "^"],
	_bikeCharNum: 0,
	bikeChar: function()
	{
		return this._bikeChars[this._bikeCharNum]
	},
	
	nextBikeChar: function()
	{
		this._bikeCharNum ++
		this._bikeCharNum %= this._bikeChars.length
	},
	
	_bikeStrafePulse: false,
	_bikeShifts: false,
}

Printer._colorFunc = Printer.pulseColor

fs.readFile('data/code.txt', 'utf8', function (err,data) {
	Printer._codeLines = data.split("\n")
});

fs.readFile('data/hex.txt', 'utf8', function (err,data) {
	Printer._hexCodeLines = data.split("\n")
});

fs.readFile('data/hexi.txt', 'utf8', function (err,data) {
	Printer._hexiCodeLines = data.split("\n")
});
	

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

// --- fill screen

screen.key(['r'], function(ch, key) 
{
	Printer.pushBlock4()
});

screen.key(['t'], function(ch, key) 
{
	Printer.pushBlock4("+")
});

screen.key(['y'], function(ch, key) 
{
	Printer.pushBlock4("-")
});

screen.key(['u'], function(ch, key) 
{
	Printer.pushBlock4("|")
});

screen.key(['i'], function(ch, key) 
{
	Printer.pushHexCodeDump()
});

screen.key(['o'], function(ch, key) 
{
	Printer.pushHexiCodeDump()
});

screen.key(['p'], function(ch, key) 
{
	Printer.pushCodeDump()
});


// lines

screen.key(['f'], function(ch, key) 
{
	Printer.pushCodeLine()
});

screen.key(['g'], function(ch, key) 
{
	Printer.pushHexCodeLine()
});


screen.key(['h'], function(ch, key) 
{
	Printer.pushHexiCodeLine()
});

screen.key(['j'], function(ch, key) 
{
	Printer.toggleBikeMode()
});

screen.key(['k'], function(ch, key) 
{
	Printer.bikePulse()
});

screen.key(['l'], function(ch, key) 
{
	Printer.nextBikeChar()
});

screen.key([';'], function(ch, key) 
{
	Printer.toggleBikeStrafe()
});

screen.key(['\''], function(ch, key) 
{
	Printer._bikeStrafePulse = true
});

screen.key(['/'], function(ch, key) 
{
	Printer._bikeShifts = !Printer._bikeShifts
});

// mirror

screen.key([']'], function(ch, key) 
{
	Printer.toggleMirrorMode()
});

// --- pos ---

screen.key(['\\'], function(ch, key) 
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
	Printer._colorFunc = Printer.nextColorFunc
	Printer.pickNextColor()
});

screen.key(['e'], function(ch, key) 
{
	Printer._colorFunc = Printer.cycleColor
});

// --- meter ---

screen.key(['z'], function(ch, key) 
{
	Printer.setPulse(1)
});

screen.key(['x'], function(ch, key) 
{
	Printer.setPulse(.75)
});

screen.key(['c'], function(ch, key) 
{
	Printer.setPulse(.4)
});

screen.key(['v'], function(ch, key) 
{
	Printer.setPulse(.1)
});

screen.key(['b'], function(ch, key) 
{
	Printer.setPulse(2/screen.width)
});

screen.key(['n'], function(ch, key) 
{
	Printer._isMuted = !Printer._isMuted
});

screen.key(['m'], function(ch, key) 
{
	Printer.nextPulseStyle()
});

// ----------

//program.hideCursor()

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

// --- escape key -------------------------------------------

screen.key(['escape', 'C-c'], function(ch, key) 
{
  return process.exit(0);
});


