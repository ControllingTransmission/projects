
ZoomOutMover = Mover.clone().newSlots({
	protoType: "ZoomOutMover",
	dz: 1
}).setSlots({
	update: function(dt) 
	{	
/*		
		console.log("this._t: " + this._t + " " + this.object().position.z )
		this.object().position.z = this.thing().groupPos().z + this._t
		this._t ++	
*/
		this.object().position.z += this.dz()*10
		if (this.object().position.z > 1200)
		{
			this.object().position.z = -2000
		}
	}
})

