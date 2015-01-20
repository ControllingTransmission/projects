
ScanLines = Thing.clone().newSlots({
	protoType: "ScanLines",
	spacing: 27,
	itemXScale: 1000,
	itemYScale: .05,
	max: 50
}).setSlots({
	init: function()
	{
		Thing.init.apply(this)
		this.setup()
	},
	
	setup: function()
	{		
		var max = this._max
		geometry = null
		for (var y = -max; y < max-1; y ++)
		{
			var s = Square.clone()
			s._object.scale.x = this._itemXScale
			s._object.scale.y = this._itemYScale
			s._object.position.y += y*this._spacing
			if(geometry == null) {
				geometry = s._object.geometry
			}
			else {
				THREE.GeometryUtils.merge(geometry, s._object.geometry)
			}
		}
		
		var material = new THREE.MeshLambertMaterial( 
			{
				color: new THREE.Color().setRGB(0,0,0), 
				wireframe: false, 
				wireframeLinewidth: 6,
				opacity: 1,
				transparent: true
			} );


	    this._object = new THREE.Mesh(geometry, material);
	},

/*
	update: function() 
	{	
		Thing.update.apply(this)		
	}
	*/
})

