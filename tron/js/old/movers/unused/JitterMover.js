
JitterMover = Mover.clone().newSlots({
	protoType: "JitterMover",
	amplitude: 3
}).setSlots({
	
	update: function() 
	{	
		this.object().position.x = this.thing().groupPos().x + (Math.random() - .5) * this.amplitude()
		this.object().position.y = this.thing().groupPos().y + (Math.random() - .5) * this.amplitude()
		this._t ++	
	}
})

