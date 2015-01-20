
MaxWavePlane = Max.clone().newSlots({
	protoType: "MaxWavePlane",
	squares: null,
	t: 0
}).setSlots({
	init: function()
	{
		Max.init.apply(this)
		var dt = .002
		this._rd = new THREE.Vector3(0, dt, dt)
		this._zd = 3
		this._nextShift = 3*60
		
		this.setup()
		document.body.style.backgroundColor = "rgb(46, 60, 122)"
	},

	squareSize: function()
	{
		return this.size()/this.divisions()
	},

	material: function()
	{
	 	return new THREE.MeshBasicMaterial( 
			{
				//color: new THREE.Color().setRGB(181/255, 155/255, 199/255), 
				color: new THREE.Color().setRGB(1,1,1), 
				wireframe: true, 
				wireframeLinewidth: 6,
				opacity: .4,
				transparent: true,
				side: THREE.DoubleSide,
				blending: THREE.AdditiveBlending
			})
	},

	setup: function()
	{
		this._object = new THREE.Object3D()

		this._plane = new THREE.PlaneGeometry(this.size(), this.size(), this.divisions(), this.divisions());
      	var mesh = new THREE.Mesh(this._plane, this.material())
		this._object.add(mesh)

		this._t = 0
		console.log("this._t = ", this._t)
	},
	
	update: function() 
	{	
		Max.update.apply(this)
		
		var i = 0
		var d = this.divisions()
		for (var x = 0; x < d; x ++)
		{
			for (var y = 0; y < d; y ++)
			{
				//var i = Math.floor(this._plane.vertices.length*Math.random())
				//var i = x*this.divisions() + y
				var vertex = this._plane.vertices[i]
				vertex.z = Math.sin(this._t/30 + i/d)*150

				vertex.z *= this.flattenRatio()

				//vertex.z = Math.sin(this._t/30 + (Math.abs(x*this.divisions()) + Math.abs(y*this.divisions()))/80)*150
				//var r = Math.sqrt(Math.pow(x - d/2, 2) + Math.pow(y - d/2, 2))
				/*
				if (i % 2) 
				{ 
					vertex.z = Math.sin(this._t/30 + r/2)*150
				}
				*/
				i ++
			}
		}
		this._plane.verticesNeedUpdate = true
	}
})

