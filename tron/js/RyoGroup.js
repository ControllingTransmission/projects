RyoGroup = Thing.clone().newSlots({
	protoType: "RyoGroup",
}).setSlots({
	init: function()
	{
		Thing.init.apply(this)
		
		this._xmax = 10
		this._ymax = 2
		
		var xs = 1/this._xmax
		var ys = 1/(this._ymax)
		for (var x = 0; x < this._xmax; x ++)
		{
			for (var y = 0; y < this._ymax; y ++)
			{			
				var ryo = Ryo.clone()
				ryo.object().position.set(x*xs + xs/2, y*ys + ys/2, 0)
				ryo.object().scale.set(xs*2, ys*2, 1)
				ryo.setXp(x)
				ryo.setYp(y)
				//ryo.setParentObject(this)
				this._object.add(ryo._object)
			}
		}
	},
})
