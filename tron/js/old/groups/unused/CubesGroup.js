
CubesGroup = Group.clone().newSlots({
	protoType: "CubesGroup",
	items: null,
	spacing: 500,
	itemXScale: 1,
	itemYScale: .1,
	itemZScale: 1,
	max: 5
}).setSlots({
	init: function()
	{
		Group.init.apply(this)
		this.addSquares()
	},
	
	addSquares: function()
	{
		var max = this._max
		for (var x = -max; x < max-1; x ++)
		{
			for (var y = -max; y < max-1; y ++)
			{
				var s = Cube.clone()
				s._object.scale.x = this._itemXScale
				s._object.scale.y = this._itemYScale
				s._object.scale.z = this._itemZScale
				s._object.position.x += x*this._spacing
				s._object.position.y += y*this._spacing
				s.setGroupX(x).setGroupY(y).setGroupZ(0)
				this.addItem(s)
			}
		}
	}
})

