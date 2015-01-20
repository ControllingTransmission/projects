
Movers = Mover.clone().newSlots({
	protoType: "Movers",
	movers: []
}).setSlots({
	add: function(m)
	{
		this.movers().append(m)
	},
	
	moverWithKey: function(k)
	{
		var items = this.movers()
		for (var i = 0; i < items.length; i ++)
		{
			var g = items[i]
			if (g.key() == k)
			{
				return g
			}
		}
		return null
	}
})	

// -------------------------------------------------

TriangleDropMover = Mover.clone().newSlots({
	protoType: "TriangleDropMover",
	key: ""
}).setSlots({
	prepareToStart: function()
	{
		//this.setOpacity(0.0)
	},
	
	update: function()
	{
		this.position().z = this.position().z * 0.95
		var op = this.opacity()
		//this.setOpacity(op + (1-op)*.01)
		if(this.position().z < 0.02)
		{
			this.position().z = 0
			this.thing().removeMover(this)
		}
	}
})

//Movers.add(TriangleDropMover)

// -------------------------------------------------

TriangleBlockMover = Mover.clone().newSlots({
	protoType: "TriangleBlockMover",
	maxHeight: 1,
	defaultHeight: .001, // Prism.defaultHeight()
	key: "",
	shouldStart: false,
	block: null
}).setSlots({
	update: function()
	{	
		if (this.shouldStart())
		{
			this.thing().object().material.wireframe.true
			this.thing().object().material.needsUpdate = true
				
			var targetScale = this.maxHeight()/this.defaultHeight()
			var dz = (targetScale - this.object().scale.z)
			this.object().scale.z += dz*.05
			var h = this.object().scale.z*this.defaultHeight()
			
			this.object().position.z = h/2
			
			if (dz < .001)
			{
				// this.thing().toggleWireframe()
				//this.thing().object().material.wireframe.true
				//this.thing().object().material.needsUpdate = true
				this.thing().removeMover(this)
			}
		}
		else if (this.position().z == 0)
		{
			this.setShouldStart(true)
			//this.block().startBlockMovers()
		}
	},
	
	begin: function()
	{
		this.setShouldStart(true)
		this.position().z = 0.01
	},
	
})

//Movers.add(TriangleBlockMover)

// -------------------------------------------------

HighlightJitterColorMover = Mover.clone().newSlots({
	protoType: "HighlightJitterColorMover",
	key: "Q"
}).setSlots({
	prepareToStop: function()
	{
		this.setColor(this.originalMaterial().color)
		// this.setColor(new THREE.Color().setRGB(0, 0, 0))
	},



	update: function() 
	{	
		Mover.update.apply(this)
		var c = Math.random()
		if (Math.random() < .007 && this.originalMaterial().color == this.thing().material().color)
		{
			//this.setColor(new THREE.Color().setRGB(2, 2, 2))
			this.setColor(Palettes.current().highlight())
			return
			//console.log("set color ")
		}
		if(this.originalMaterial().color != this.thing().material().color)
			this.setColor(this.originalMaterial().color)
		//this._t ++	
	}
})

Movers.add(HighlightJitterColorMover)


// -----------------------------------------------------

SetAlphaMover = Mover.clone().newSlots({
	protoType: "SetAlphaMover",
	targetAlpha: 0,
	key: "W"
}).setSlots({
	prepareToStart: function()
	{
		this.setTargetAlpha(.5*Math.random())
		//this.setColor(new THREE.Color().setRGB(0, 0, 0))
	},

	update: function() 
	{	
		//Mover.update.apply(this)
		if (this.t() == 1)
		{
			var a = this.targetAlpha()
			this.setOpacity(a)
			this.thing().removeMover(this)
		}
		this._t ++	
	}
})

//Movers.add(SetAlphaMover)


// -----------------------------------------------------

ScaleMover = Mover.clone().newSlots({
	protoType: "ScaleMover",
	key: "E"
}).setSlots({
	init: function()
	{
		Mover.init.apply(this)
	},

	prepareToStart: function()
	{
		Mover.prepareToStart.apply(this)
		//this._t = Math.random()*100
	},
		
	prepareToStop: function()
	{
		//this.object().scale = this.originalScale()
	},

	update: function() 
	{	
		//Mover.update.apply(this)
		var v = Math.sin(this.t()/100)
		v = v*this.originalScale()[this.orientation()] + this.originalScale()[this.orientation()]
		this.object().scale[this.orientation()] = v
		//console.log(v)
		this._t ++
	}
})

//Movers.add(ScaleMover)

// -----------------------------------------------------



WaveMover = Mover.clone().newSlots({
	protoType: "WaveMover",
	amplitude: 2000,
	period: 100,
	key: "R"
}).setSlots({
	prepareToStop: function()
	{
		this.object().scale.z = 1
	},

	update: function() 
	{	
		var x = this.object().position.x
		var y = this.object().position.y
		var r = Math.sqrt(x*x + y*y)
		var tt = r + Math.PI*this._t/this._period
		this.object().scale.z = (Math.sin(tt)+1) * 0.5 * this._amplitude
		this._t ++	
	}
})

Movers.add(WaveMover)


WaveMoverX = Mover.clone().newSlots({
	protoType: "WaveMoverX",
	amplitude: .3,
	period: 100,
	key: "T",
	refZ: 0,
}).setSlots({
	prepareToStart: function()
	{
		this._refZ = this._thing.z()
	},
	
	prepareToStop: function()
	{
		this.object().position.z = this._refZ
	},

	update: function() 
	{	
		var x = this.object().position.x
		var r = x
		var tt = r + Math.PI*this._t/this._period
		this.object().position.z = this._refZ + (Math.sin(tt)+1) * this._amplitude
		this._t ++	
	}
})

Movers.add(WaveMoverX)


// RScaleMover = Mover.clone().newSlots({
// 	protoType: "RScaleMover",
// 	key: "R"
// }).setSlots({
// 	init: function()
// 	{
// 		Mover.init.apply(this)
// 	},
	
// 	prepareToStop: function()
// 	{
// 		this.object().scale = this.originalScale()
// 	},

// 	update: function() 
// 	{	
// 		Mover.update.apply(this)
		
// 		this.object().scale[this.orientation()] = Math.random()
// 	}
// })

// Movers.add(RScaleMover)

// -----------------------------------------------------


ScaleToOneMover = Mover.clone().newSlots({
	protoType: "ScaleToOneMover",
}).setSlots({
	prepareToStart: function()
	{
		this._t = 0
	},
	
	prepareToStop: function()
	{
		this.object().scale = this.originalScale()
	},

	update: function() 
	{	
		//Mover.update.apply(this)
		
		var v = 1 - 60/(60 + this._t) // zero to one
		console.log("s " + v + " t " +this._t)
		var o = this.orientation()
		//this.object().scale.x = v*this.originalScale().x
		this.object().scale.x = .001
		this._t ++
	}
})

/*
BlueJitterColorMover = Mover.clone().newSlots({
	protoType: "ColorMover",
}).setSlots({
	prepareToStart: function()
	{
		var mat = this.object().material
		if (mat == null) { return }
		this._originalColor = mat.color
	},
	
	prepareToStop: function()
	{
		var mat = this.object().material
		if (mat == null) { return }
		mat.color = this._originalColor
	},
	
	update: function() 
	{	
		Mover.update.apply(this)
		var mat = this.object().material
		if (mat == null) { return }
		var c = Math.random()
		mat.color = new THREE.Color().setRGB(0, 0, c)
		mat.needsUpdate = true
		//this._t ++	
	}
})

Movers.add(BlueJitterColorMover)
*/




// ------------------------------------------------------------------

XInterleveMover = Mover.clone().newSlots({
	protoType: "XInterleveMover",
	speed: .001,
}).setSlots({
	init: function()
	{
		this.setSpeed(.001 + .001*Math.random())
	},
	
	prepareToStop: function()
	{
		this.position().y = 0
	},
	
	update: function() 
	{	
		var direction = this.thing().groupX() % 2 == 0 ? 1 : -1
		//console.log("this.thing().groupX() " + this.thing().groupX())
		this.position().y += direction * this.speed()
		if (this.position().y > 1)
		{
			this.position().y = -1
		}
		
		if (this.position().y < -1)
		{
			this.position().y = 1
		}
		this._t ++	
		this.wrapBounds()
	}
})

//Movers.add(XInterleveMover)

XMover = Mover.clone().newSlots({
	protoType: "YInterleveMover",
	speed: .001,
	wraps: true
}).setSlots({
	prepareToStop: function()
	{
		this.position().x = 0
	},
	
	update: function() 
	{	
		var direction = this.thing().groupY() % 2 == 0 ? 1 : -1
		this.position().x += direction * this.speed()
		this._t ++	
		
		if (this.wraps())
		{
			if (this.position().x < -1)
			{
				this.position().x = 1
			}
			
			if (this.position().x > 1)
			{
				this.position().x = -1
			}
		}
	}
})

//Movers.add(XMover)


RandXMover = Mover.clone().newSlots({
	protoType: "RandXMover",
}).setSlots({
	prepareToStop: function()
	{
		this.position().x = this._originalPosition.x
	},
	
	update: function() 
	{	
		//var direction = this.thing().groupY() % 2 == 0 ? 1 : -1
		this.position().x = (Math.random() - .5)*2
		this._t ++	
		this.wrapBounds()
	}
})

Movers.add(RandXMover)


// ------------------------------------------------------------------

// ------------------------------------------------------------------

RandAlphaMover = Mover.clone().newSlots({
	protoType: "RandAlphaMover",
	key: "T"
}).setSlots({
	
	prepareToStop: function()
	{
		var mat = this.object().material
		mat.opacity = this.originalMaterial().opacity
		mat.needsUpdate = true
	},
	
	update: function() 
	{	
		//var direction = this.thing().groupY() % 2 == 0 ? 1 : -1
		var mat = this.object().material
		mat.opacity = Math.random()
		mat.needsUpdate = true
		this._t ++	
	}
})

Movers.add(RandAlphaMover)

// ------------------------------------------------------------------


FadeOutMover = Mover.clone().newSlots({
	protoType: "FadeOutMover",
}).setSlots({
	
	prepareToStop: function()
	{
		this.revertOpacity()
	},
	
	update: function() 
	{	
		var period = 400
		var v = period/(period+this.t()*this.t())
		this.setOpacity(v)
		if (v < .0001)
		{
			this.thing().group().removeSelf()
		}
		this._t ++	
	}
})

Movers.add(FadeOutMover)

// ------------------------------------------------------------------

/*
LeapMotionBackgroundGreyMover = Mover.clone().newSlots({
	protoType: "LeapMotionBackgroundGreyMover",
	key: "A",
}).setSlots({
	init: function()
	{
		Mover.init.apply(this)
	},
	
	object: function()
	{
		return this._thing._object
	},
	
	update: function() 
	{	
		Mover.update.apply(this)
		var hand = LeapMotion._hands[0]
		if(typeof hand == "undefined") return
		var x = hand.palmPosition[0];
		var y = hand.palmPosition[1];
		var z = hand.palmPosition[2];

		var hue = 0;
		var saturation = 0;
		var lightness = Math.round(z/2);

		document.body.style.background = "hsl(" + hue + "," + saturation + "%," + lightness + "%)";
		//this._t ++	
	}
})

Movers.add(LeapMotionBackgroundGreyMover)

// ------------------------------------------------------------------

LeapMotionBackgroundHueMover = Mover.clone().newSlots({
	protoType: "LeapMotionBackgroundHueMover",
	key: "S",
}).setSlots({
	init: function()
	{
		Mover.init.apply(this)
	},
	
	object: function()
	{
		return this._thing._object
	},
	
	update: function() 
	{	
		Mover.update.apply(this)
		var hand = LeapMotion._hands[0]
		if(typeof hand == "undefined") return
		var x = hand.palmPosition[0];
		var y = hand.palmPosition[1];
		var z = hand.palmPosition[2];

		var hue = Math.round(x) % 360;
		var saturation = Math.round(y/3);
		var lightness = Math.round(z/2);

		document.body.style.background = "hsl(" + hue + "," + saturation + "%," + lightness + "%)";
		//this._t ++	
	}
})

Movers.add(LeapMotionBackgroundHueMover)

// ------------------------------------------------------------------

LeapMotionBackgroundShadesMover = Mover.clone().newSlots({
	protoType: "LeapMotionBackgroundShadesMover",
	color: null,
	key: "D",
}).setSlots({
	init: function()
	{
		Mover.init.apply(this)
		this._color = $('body').css('background-color');
	},
	
	object: function()
	{
		return this._thing._object
	},
	
	update: function() 
	{	
		Mover.update.apply(this)
		var hand = LeapMotion._hands[0]
		if(typeof hand == "undefined") return
		var x = hand.palmPosition[0];
		var y = hand.palmPosition[1];
		var z = hand.palmPosition[2];

		var rgb = this._color.match(/rgb\(([0-9]*), ([0-9]*), ([0-9]*)\)/)
		var r = rgb[1]
		var g = rgb[2]
		var b = rgb[3]
		var hsl = Colors.rgb2hsl(r,g,b).a

		var hue = hsl[0]
		var saturation = hsl[1]
		var lightness = Math.round(z/2);

		document.body.style.background = "hsl(" + hue + "," + saturation + "%," + lightness + "%)";
		//this._t ++	
	}
})

Movers.add(LeapMotionBackgroundShadesMover)
*/

/*

Movers.add(PulseAlphaMover)

JitterMover = Mover.clone().newSlots({
	protoType: "JitterMover",
	amplitude: 3
}).setSlots({
	
	update: function() 
	{	
		if (this._t < 10)
		{
			this.position().x = this.thing().groupPos().x + (Math.random() - .5) * this.amplitude()
			this.position().y = this.thing().groupPos().y + (Math.random() - .5) * this.amplitude()
			this.position().z = this.thing().groupPos().y + (Math.random() - .5) * this.amplitude()
		}
		this._t ++	
	}
})

Movers.add(JitterMover)
*/

// ------------------------------------------------------------------

/*
XRotateMover = Mover.clone().newSlots({
	protoType: "XRotateMover",
	period: 100
}).setSlots({
	update: function(dt) 
	{	
		this.object().rotation.x += dt/this.period()
		this._t ++	
	}
})

Movers.add(XRotateMover)


YRotateMover = Mover.clone().newSlots({
	protoType: "XRotateMover",
	period: 100
}).setSlots({
	update: function(dt) 
	{	
		this.object().rotation.y += dt/this.period()
		this._t ++	
	}
})

Movers.add(YRotateMover)

ZRotateMover = Mover.clone().newSlots({
	protoType: "XRotateMover",
	period: 100
}).setSlots({
	prepareToStop: function()
	{
		var r = this.object().rotation.z
		var d = (360*r/Math.PI*2) % 360
		console.log("d " + d)
		d = Math.ceil(d/45)*45
		console.log("d2 " + d)
		r = d *Math.PI*2/360
		
		this.object().rotation.z = r;
		return this
	},

	update: function(dt) 
	{	
		this.object().rotation.z += .01
		this._t ++	
	}
})

Movers.add(ZRotateMover)

// ------------------------------------------------------------------

WaveMover = Mover.clone().newSlots({
	protoType: "WaveMover",
	amplitude: 200,
	period: 100
}).setSlots({
	update: function() 
	{	
		var x = this.position().x
		var y = this.position().y
		var r = Math.sqrt(x*x + y*y)
		var tt = r + Math.PI*this._t/this._period
		this.position().z = Math.sin(tt) * this._amplitude
		this._t ++	
	}
})

Movers.add(WaveMover)

// ------------------------------------------------------------------

ZoomOutMover = Mover.clone().newSlots({
	protoType: "ZoomOutMover",
	dz: 1
}).setSlots({
	update: function(dt) 
	{	
		this.position().z += this.dz()*10
		this.wrapBounds()
	}
})


Movers.add(ZoomOutMover)
Movers.add(ZoomOutMover.clone().setDz(-1))

// ------------------------------------------------------------------



XScaleMover = Mover.clone().newSlots({
	protoType: "XScaleMover",
	dz: .001
}).setSlots({
	update: function(dt) 
	{	
		this.object().scale.x += this.dz()*10
		
		if (this.object().scale.x > 2 || this.object().scale.x < .01)
		{
			this.setDz(-this.dz())
		}
		this.wrapBounds()
	}
})

Movers.add(XScaleMover)

YScaleMover = Mover.clone().newSlots({
	protoType: "YScaleMover",
	dz: .001
}).setSlots({
	update: function(dt) 
	{	
		this.object().scale.y += this.dz()*10
		
		if (this.object().scale.y > 1.5 || this.object().scale.y < .01)
		{
			this.setDz(-this.dz())
		}
		this.wrapBounds()
	}
})

Movers.add(YScaleMover)


// ------------------------------------------------------------------

	
WhiteJitterColorMover = Mover.clone().newSlots({
	protoType: "WhiteJitterColorMover",
}).setSlots({
	init: function()
	{
		Mover.init.apply(this)
	},
	
	object: function()
	{
		return this._thing._object
	},
	
	update: function() 
	{	
		Mover.update.apply(this)
		var mat = this.object().material
		if (mat == null) { return }
		var c = Math.random()
		mat.color = new THREE.Color().setRGB(c, c, c)
		mat.needsUpdate = true
		//this._t ++	
	}
})

Movers.add(WhiteJitterColorMover)
*/

