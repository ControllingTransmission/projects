
Trail = Group.clone().newSlots({
	segments: null,
	maxSegments: 10,
}).setSlots({
	init: function()
	{
		Thing.init.apply(this)
		this._segments = []
	},	
	
	currentSegment:function()
	{
		return this.segments().last()
	},
	
	addSegment: function()
	{
		var current = this.currentSegment()
		var seg = TrailSegment.clone()
		
		if (current)
		{
			var p = current.endPoint()
			seg.setStartPoint(p.clone())
			seg.setEndPoint(p.clone())
		}
		
		this.segments().push(seg)
		this.addItem(seg)
		
		if (this.segments().length > this.maxSegments())
		{
			var dead = this.segments().removeFirst()
			this.removeItem(dead)
		}
	},
	
	setEndPoint: function(end)
	{
		var current = this.currentSegment()
		if (current)
		{
			//var p = end
			//p = new THREE.Vector3( p.x, p.y, p.z )
			//p = new THREE.Vector3( p.x, 0, 1 )
			
			current.setEndPoint(end)
			current.update()
			//console.log("end ", Math.floor(p.x), Math.floor(p.y), Math.floor(p.z) )

		}
	},

})