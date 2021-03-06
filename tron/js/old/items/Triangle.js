
Triangle = Thing.clone().newSlots({
	protoType: "Triangle"
}).setSlots({
	init: function()
	{
		Thing.init.apply(this)
		this.setup()
	},
	
	setup: function()
	{		
		var geometry = new THREE.CircleGeometry(.6, 3);
	
		var material = new THREE.MeshLambertMaterial( 
			{
				//color: new THREE.Color().setRGB(0,0,0), 
				color: Palettes.current().foreground(), 
				wireframe: false, 
				wireframeLinewidth: 36,
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

