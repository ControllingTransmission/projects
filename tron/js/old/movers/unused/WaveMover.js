

WaveMover = Mover.clone().newSlots({
	protoType: "WaveMover",
	amplitude: 200,
	period: 100
}).setSlots({
	update: function() 
	{	
		var x = this.object().position.x
		var y = this.object().position.y
		var r = Math.sqrt(x*x + y*y)
		var tt = r + Math.PI*this._t/this._period
		this.object().position.z = Math.sin(tt) * this._amplitude
		this._t ++	
	}
})

