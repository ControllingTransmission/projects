

Mover = Proto.clone().newSlots({
	protoType: "Mover",
	thing: null,
	t: null,
	rate: 1,
	originalPosition: null,
	originalScale: null,
	originalMaterial: null,
	orientation: "x",
	key: null
}).setSlots({
	init: function()
	{
	},
	
	prepareToStart: function()
	{
		this.setOriginalPosition(this.object().position.clone())
		this.setOriginalScale(this.object().scale.clone())
		this.setOriginalMaterial(this.object().material.clone())
		return this
	},
	
	position: function()
	{
		return this.object().position
	},
	
	revertToOriginal: function()
	{
		this.object().position = this._originalPosition 
		this.object().scale = this._originalScale
		this.object().material = this._originalMaterial	
	},

	revertColor: function()
	{
		var mat = this.object().material
		if (mat == null) { return }
		this._originalColor = mat.color
	},
	
	revertOpacity: function()
	{
		var mat = this.object().material
		mat.opacity = this.originalMaterial().opacity
		mat.needsUpdate = true
	},
	
	setColor: function(c)
	{
		this.thing().setColor(c)
	},
	
	opacity: function()
	{
		return this.thing().opacity()
	},
	
	setOpacity: function(v)
	{
		this.thing().setOpacity(v)
		return this
	},
		
	prepareToStop: function()
	{
		return this
	},
	
	object: function()
	{
		return this._thing._object
	},
	
	update: function(dt) 
	{	
		this._t += dt*this._rate
	},
	
	wrapBounds: function()
	{
		var p = this.object().position
		
		// x
		var xmax = 3000
		if (p.x < -xmax) { p.x =  xmax - (Math.abs(p.x) % xmax) }		
		if (p.x >  xmax) { p.x = -xmax + (Math.abs(p.x) % xmax) }
		
		// y
		var ymax = 3000
		if (p.y < -ymax) { p.y =  ymax }		
		if (p.y >  ymax) { p.y = -ymax }
		
		// z
		var zmin = -2000
		var zmax = 1000
		if (p.z >  zmax) { p.z = zmin }
		if (p.z < zmin) { p.z = zmax }
	}
})

