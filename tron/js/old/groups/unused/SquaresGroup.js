
SquaresGroup = Group.clone().newSlots({
	protoType: "SquaresGroup",
	items: null,
	spacing: 500,
	itemXScale: 1,
	itemYScale: 1,
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
		for (var x = -1; x < max; x ++)
		{
				var s = Square.clone()
				s._object.scale.x = .1
				s._object.scale.y = 1
				s._object.position.x = .2*x
				s._object.position.y = 0
				s.setGroupX(x).setGroupY(0)
				s.setMover("x", XInterleveMover.clone())
				this.addItem(s)
		}
	}
})

ThinSquaresGroup = Group.clone().newSlots({
	protoType: "ThinSquaresGroup",
	items: null,
	spacing: 500,
	itemXScale: 1,
	itemYScale: 1,
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
		for (var x = -1; x < max; x ++)
		{
				var s = Square.clone()
				s._object.scale.x = .1
				s._object.scale.y = 1
				s._object.position.x = .2*x
				s._object.position.y = 0
				s.setGroupX(x).setGroupY(0)
				//console.log(x + ", " + y)
				console.log(s._object.position.x + ", " + s._object.position.y)
				this.addItem(s)
		}
	}
})

