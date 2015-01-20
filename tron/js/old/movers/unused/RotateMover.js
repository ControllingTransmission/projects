
RotateMover = Mover.clone().newSlots({
	protoType: "RotateMover",
	period: 100
}).setSlots({
	update: function(dt) 
	{	
		this.object().rotation.z += dt/this.period()
		this._t ++	
	}
})

