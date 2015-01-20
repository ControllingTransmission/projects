

MaxPlane = Max.clone().newSlots({
	protoType: "MaxPlane"
}).setSlots({
	init: function()
	{
		var dt = .002
		this._rd = new THREE.Vector3(0, dt, dt)
		this._t = 0
		this._zd = 1
		this._nextShift = 3*60
		this.setup()
		document.body.style.backgroundColor = "black"
	},
	
	setup: function()
	{
		var geometry = null
		
		if (true)
		{
			var s = 10000
			var d = 150
			//var geometry = new THREE.CubeGeometry(s, s, s, d, d, d);
			geometry = new THREE.PlaneGeometry(s, s, 1, d);
		}
		else
		{
			var s = 10000
			var d = 150
			var geometry = new THREE.PlaneGeometry(s, s, d, d);
		}
		
		var material = new THREE.MeshLambertMaterial( 
			{
				color: new THREE.Color().setRGB(1,1,0), 
				wireframe: true, 
				wireframeLinewidth: 6,
				opacity: 1,
				transparent: true
			} );

	    this._object = new THREE.Mesh(geometry, material);
	},


	update: function() 
	{	
		this._object.rotation.add(this._rd)
		this._object.position.z += this._zd
		
		if (this._t > this._nextShift || Math.abs(this._object.rotation.y) > .45)
		{
			if (Math.random() < .5)
			{
				this._rd.z = - this._rd.z
			}
			
			{
				this._rd.y = - this._rd.y
			}
			this._zd = - this._zd
			
			this._nextShift = this._t + (3 + Math.random()*3)*60 //*100000
		}
		this._t ++		
	}
})

