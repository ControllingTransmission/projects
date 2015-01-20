
Groups = Proto.clone().newSlots({
	protoType: "Groups",
	groups: [],
}).setSlots({
	
	add: function(g)
	{
		this.groups().push(g)
	},
	
	groupWithKey: function(k)
	{
		for (var i = 0; i < this.groups().length; i ++)
		{
			var g = this.groups()[i]
			if (g.key() == k)
			{
				return g
			}
		}
		return null
	}
})




// ----------------------

WaveStrip = Group.clone().newSlots({
	protoType: "WaveStrip",
	spacing: 500,
	itemXScale: 1,
	itemYScale: 1,
	max: 5,
	orientation: "x",
	key: "1",
	waveGroup: null
}).setSlots({
	init: function()
	{
		Group.init.apply(this)
		this.addSquares()
	},
	
	setWaveGroup: function(w)
	{		
		this._waveGroup = w
		
		// var black = new THREE.Color("#000000")
		var block = w.block()
		
		if (!block.doneRendered())
		{
			for (var y = 0; y < w.block().current()*2 + 1; y ++)
			{
				var h = y
				if (w.block().isTop())
				{
					h = this.items().length - y - 1
				}
				var triangle = this.items()[h]
				triangle.darken()
				var mover = TriangleBlockMover.clone().setBlock(block)
				triangle.addMover(mover)
				block.addBlockMover(mover)
				
			}
			
			if (w.block().isDone())
			{
				w.block().setDoneRendered(true)
			}
		}
	},

	setMover: function(name, m)
	{
		console.log('set mover')
		this.setItemMover(name, m)
		// this.items().forEach(function(item){ 
		// 	console.log(item)
			 
		// })
	},

	addXY: function(x, y, inverted)
	{
		var h = Math.sqrt(3)/2.0
		
		var xoffset = 0
		if (inverted)
		{
			xoffset = .5
		}
		
		var s = Prism.clone()
		s.reset()
		s._object.position.x = (x + xoffset) + y/2

		s._object.position.y = y*.869 

		if (!inverted)
		{
			s._object.position.y -= h/3
		}
		
	 	s._object.rotation.z = Math.PI * (1-inverted) - Math.PI/2
		
		s.setGroupX(x)
		s.setGroupY(y)
		s.setupColor()

		this.addItem(s)			
	},
	
	reset: function()
	{
		this.items().forEach(function(prism)
		{
			prism.setupColor()
			prism.removeMovers()
		})
	},
	
	addRowAtY: function(y, inverted)
	{		
		var xmax = 1

		for (var x = 0; x < xmax; x ++)
		{
			this.addXY(x, y, 0)
			this.addXY(x, y, 1)
		}	
	},
	
	addSquares: function()
	{
		var ymax = 9
		
		for (var y = 0; y < ymax; y ++)
		{
			var invert = Math.abs(y) % 2 == 0
			
			this.addRowAtY(y, 0)
		}		
	},

	setupDropMover: function()
	{
		for (var y = 0; y < this.items().length; y ++)
		{
			var triangle = this.items()[y]
			triangle._object.position.z = 14 - Math.floor(y/2)*1.5
			triangle.setMover(triangle, TriangleDropMover.clone())
		}
	}
})

// -------------------------------------------------

BlackBlock = Group.clone().newSlots({
	protoType: "BlackBlock",
	current: 4,
	max: 4,
	goingDown: true,
	isDone: false,
	isTop: false,
	rebirthCountdown: 0,
	doneRendered: false,
	blockMovers: null
}).setSlots({
	init: function()
	{
		this.setBlockMovers([])
	},
	
	addBlockMover: function(aMover)
	{
		this.blockMovers().push(aMover)
		return this
	},
	
	startBlockMovers: function()
	{
		this.blockMovers().forEach(function(aMover){
			aMover.begin();
		});
	},
	
	reset: function()
	{
		this.setMax(Math.floor(3 + Math.random()*3))
		this._isTop = !this._isTop
		
		if (this.isTop())
		{
			this._current = 0
			this._goingDown = false
		}
		else
		{
			this._current = this.max()
			this._goingDown = true
		}
		
		this._doneRendered = false
		this.setBlockMovers([])
		
		this._isDone = false
	},
	
	finish: function()
	{
		this._isDone = true
		this._rebirthCountdown = Math.floor(this._max*1.5)
		if (!this._isTop)
		{
			this._rebirthCountdown = Math.floor(this._rebirthCountdown/2)
		}
	},
	
	update: function()
	{		
		if (!this._isDone)
		{		
			if (this._goingDown)
			{
				this._current --
				
				if (this._current == 0)
				{
					this.finish()
				}
			}
			else
			{
				this._current ++
								
				if (this._current == this._max)
				{
					if (this._isTop)
					{
						this.finish()
					}
					
					this._goingDown = true
				}
			}
		}
		
		if (this._rebirthCountdown)
		{
			this._rebirthCountdown --
			if (this._rebirthCountdown == 0)
			{
				this.reset()
			}
		}
	}
})	
	
WaveGroup = Group.clone().newSlots({
	protoType: "WaveGroup",
	spacing: 500,
	itemXScale: 1,
	itemYScale: 1,
	max: 5,
	orientation: "x",
	key: "1",
	currentX: 0,
	//cachedStrips: null,
	maxStripCount: 40,
	block: BlackBlock.clone(),	
	rate: 10,
}).setSlots({
	init: function()
	{
		Group.init.apply(this)
		//this.setCachedStrips([])
		this.addStrip()
		this._object.position.y -= 3.5
		
		for (var x = 0; x < this.maxStripCount(); x++)
		{
			this.addStrip()
		}
		
		Visual.cycle().position().x += this.maxStripCount() - 16
		this.block().reset()
	},

	removeStrip: function()
	{
		var item = this.items().first()
		
		if (item && this.items().length > this.maxStripCount())
		{
			//this.cachedStrips().push(item)
			this.removeItem(item)
		}
	},
	
	newStrip: function()
	{
		//var strip = this.cachedStrips().pop()
		//if (strip == null)
		//{
			strip = WaveStrip.clone()
		//}
		return strip
	},
	
	addStrip: function()
	{		
		this._currentX ++
		var strip = this.newStrip()
		strip.setX(this._currentX)
		
		this.removeStrip()
		this.addItem(strip)
		
		/*
		var firstStrip = this._items[0]
		if (firstStrip)
		{
			strip.copyMoversFrom(firstStrip)
		}
		*/
		
		return strip
	},
		
	update: function()
	{
		Group.update.apply(this)
		this._t ++
		
		var rate = this.rate()
		
		//Visual.camera().position.x += 1/rate;
		
		Visual.cycle().position().x += 1/rate;
		
		if (this._t % rate == 0)
		{
			var strip = this.addStrip()
			strip.setupDropMover()
			this._block.update()
			strip.setWaveGroup(this)
			//Visual.cycle().position().x = strip.x();
		}
	}
})

Groups.add(WaveGroup) // for 0 key
Groups.add(WaveGroup)
