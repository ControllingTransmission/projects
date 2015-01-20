Thing = Proto.clone().newSlots({
	protoType: "Ryo",
	parentObject: null,
	object: null
}).setSlots({
	init: function()
	{
		//Thing.init.apply(this)
		this._object = new THREE.Object3D()
		this._object._thing = this
	},
	
	update: function(time)
	{
		var children = this.object().children
		var len = children.length
		for (var i = 0; i < len; i ++)
		{
			var child = children[i]
			child._thing.update(time)
		}
	},
	
	add: function(aThing)
	{
		aThing.setParentObject(this)
		this._object.add(aThing.object())	
	},
	
	remove: function(aThing)
	{
		this._object.remove(aThing.object())	
	}
})
