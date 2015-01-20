
InterleveMover = Mover.clone().newSlots({
	protoType: "InterleveMover",
	amplitude: 200,
	period: 100
}).setSlots({
	update: function() 
	{	

		this._t ++	
	}
})

