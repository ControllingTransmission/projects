

Thing = Proto.clone().newSlots({
	protoType: "Thing",
	open: false,
	object: null,
	groupPos: null,
	movers: null,
	t: 0,
	groupX: 0,
	groupY: 0,
	groupZ: 0,
	group: null
}).setSlots({
	init: function()
	{
		this._movers = {}
	},
	
	opacity: function()
	{
		return this.object().material.opacity
	},
	
	setX: function(v)
	{
		this._object.position.x = v
	},
	
	x: function()
	{
		return this._object.position.x
	},
	
	setY: function(v)
	{
		this._object.position.y = v
	},
	
	y: function()
	{
		return this._object.position.y
	},
	
	setZ: function(v)
	{
		this._object.position.z = v
	},
	
	z: function()
	{
		return this._object.position.z
	},
	
	setPosition: function(p)
	{
		this._object.position = p.clone()
	},
	
	setOpacity: function(v)
	{
		var mat = this.object().material
		mat.opacity = v
		mat.needsUpdate = true
		return this
	},
	
	setGroupPosToCurrent: function()
	{
		this.setGroupPos(this.object().position.clone())
		return this
	},

	open: function()
	{
		Visual.scene().add(this._object)
		this._open = true
		return this
	},	
	
	close: function()
	{
		Visual.scene().remove(this._object)
		this._open = false
		return this
	},

	toggle: function()
	{
		if(this._open)
			this.close()
		else
			this.open()
		return this
	},
	
	/*
	copyMoversFrom: function(otherThing)
	{
		this.removeMovers()
		
		for (var k in otherThing.movers())
		{
			var m = otherThing.movers()[k]
			this.setMover(k, m)
		}
		
		otherThing._movers = {}
	},
	*/
	
	addMover: function(aMover)
	{
		this.setMover(aMover.protoType(), aMover)
	},
	
	setMover: function(name, m)
	{
		var oldMover = this.movers()[name]
		
		if (oldMover)
		{
			oldMover.prepareToStop()
			delete this.movers()[name]
		}
		else
		{
			this.movers()[name] = m
			m.setThing(this)
			m.prepareToStart()
		}
		
		return this
	},
	
	removeMovers: function()
	{
		for (var name in this.movers().copy())
		{
			var m = this.movers()[name]
			m.prepareToStop()
			delete this.movers()[name]
		}		
	},
	
	removeMover: function(aMover)
	{
		for (var name in this.movers())
		{
			var m = this.movers()[name]
			if (m == aMover)
			{
				m.prepareToStop()
				delete this.movers()[name]
			}
		}
		
		return this
	},
	
	prepareToStop: function()
	{
		
	},
	
	update: function(dt) 
	{			
		//this.movers().forEach(function (k, mover) { mover.update(dt) })
		for (var k in this.movers())
		{
			var mover = this._movers[k]
			mover.update(dt)
		}
	},
	
	setColor: function (c)
	{
		var mat = this.object().material
		mat.color = c
		mat.needsUpdate = true
		return this
	},
	
	color: function()
	{
		return this._object.material.color
	},

	material: function()
	{
		return this._object.material
	},
	
	toggleWireframe: function()
	{
		var mat = this.object().material
		mat.wireframe = !mat.wireframe
		mat.needsUpdate = true
		return this
	},
		
	increaseAlpha: function()
	{
		var mat = this.object().material
		mat.opacity = 1
		mat.needsUpdate = true
	},
	
	decreaseAlpha: function()
	{
		var mat = this.object().material
		mat.opacity = .25
		mat.needsUpdate = true
	},	
})

