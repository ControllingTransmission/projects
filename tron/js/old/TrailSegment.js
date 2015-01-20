

TrailSegment = Thing.clone().newSlots({
	startPoint: null,
	endPoint: null,
	width: .6
}).setSlots({
	init: function()
	{
		Thing.init.apply(this)
		this._startPoint = new THREE.Vector3( 0, 0, -.9 )
		this._endPoint   = new THREE.Vector3( 0, 0, -.9 )		
		this.setup()
	},
	
	/*
	setStartPoint: function(p)
	{
		this._startPoint = p
		this.setup()
	},
	*/
	
	setup: function()
	{
		var material = new THREE.MeshLambertMaterial( 
			{
				color: new THREE.Color().setRGB(0, 0, 0), 
				wireframe: false, 
				wireframeLinewidth: 4,
				opacity: 1,
				transparent: false, // faster if false
				side: THREE.DoubleSide
			} );

		var geometry = new THREE.PlaneGeometry( 100, 100 );
		//var material = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.DoubleSide} );
		this._object = new THREE.Mesh( geometry, material );
		
	    //this._object.geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0, 0, 2) );
		//this._object.geometry.verticesNeedUpdate = true;
		this.update()
	},
		
	update: function()
	{
		if (!this._object)
		{
			this.setup()
			console.log("this._object = ", this._object)
		}
		
	//	console.log("this._startPoint = ", this._startPoint)
	//	console.log("this._object = ", this._object)
		
		this._object.position = this._startPoint
		
		var dx = this._endPoint.x - this._startPoint.x
		var dy = this._endPoint.y - this._startPoint.y
		var dz = this._endPoint.z - this._startPoint.z
		
		var w = this._width
		var z = -.95
		z = this._endPoint.z
		
		// start left
		var p0 = this._object.geometry.vertices[0] 
		p0.x = 0
		p0.y = 0 - w/2
		p0.z = z
		
		// start right
		var p1 = this._object.geometry.vertices[1]
		p1.x = 0
		p1.y = 0+ w/2
		p1.z = z
		
		// end left
		var p2 = this._object.geometry.vertices[2]
		p2.x = dx
		p2.y = dy - w/2
		p2.z = z
		
		// end right
		var p3 = this._object.geometry.vertices[3]
		p3.x = dx
		p3.y = dy + w/2
		p3.z = z

		this._object.geometry.verticesNeedUpdate = true;
	},
})