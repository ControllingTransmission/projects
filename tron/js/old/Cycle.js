
Cycle = Proto.clone().newSlots({
	position: new THREE.Vector3( 0, 0, .01 ),
	yDirection: 0,
	trail: null,
}).setSlots({
	init: function()
	{
		this.setTrail(Trail.clone())
		this.trail().open()
		this.trail().addSegment()
	},
	
	move: function()
	{
		var y = this.position().y
		
		if (Math.abs(y) > 5)
		{
			this.turn()
		}

		this.position().y += this._yDirection * .17;
		//this.position().y += this._yDirection * 1/WaveGroup.rate()
		
		this.trail().setEndPoint(this.position().clone())
	},

	turn: function()
	{
		if (this._yDirection == 0)
		{
			this._yDirection = 1
		}
		else
		{
			this._yDirection *= -1
		}
		
		this.trail().addSegment()
	},
		
	step: function()
	{
		this.move()
		Visual.targetPoint().setPosition(this.position())
	}
})