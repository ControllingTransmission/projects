
YWaveMover = Mover.clone().newSlots({
	protoType: "WaveMover",
	amplitude: 200,
	period: 100
}).setSlots({
	update: function() 
	{	
		var tt = this.object().position.y + Math.PI*this._t/this._period
		this.object().position.z = Math.sin(tt)*this._amplitude
		this._t ++	
	}
})

