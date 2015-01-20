

MaxCube = Max.clone().newSlots({
	protoType: "MaxCube",
	size: 1500,
	divisions: 45,
	dt: .0025
}).setSlots({
	init: function()
	{
		if (false) // puke
		{
			this.setDt(.004)
			this.setDivisions(300)
		}
		
		var dt = this.dt()
		this._rd = new THREE.Vector3(dt/5, dt, dt)
		this._t = 0
		this._zd = 2
		this._nextShift = 3*60
		this.setup()
		camera.position.z = 0;
		document.body.style.backgroundColor = "black"
	},
	
	material: function(r, g, b)
	{
		return new THREE.MeshBasicMaterial( 
			{
				color: new THREE.Color().setRGB(r,g,b), 
				wireframe: false, 
				opacity: 1,
				transparent: false,
				side: THREE.DoubleSide,
			} );
	},
	
	newPlane: function(size, divisions, material, backMaterialOpacity)
	{
		var plane = new THREE.Object3D()
		
		var width = 3
		
		for (var i = 0; i < divisions + 1; i ++)
		{
			var y = size * i / divisions - size/2;
			
			//var line = this.newLine(-size/2, x, 0, size/2, x, 0)
			var line = new THREE.PlaneGeometry(size, width, 1, 1);
	      	var mesh = new THREE.Mesh(line, material);
			line.applyMatrix(new THREE.Matrix4().makeTranslation(0, y, 0));
			plane.add(mesh)
		}
		
		if (backMaterialOpacity != 0 && backMaterialOpacity != null)
		{
			var backMaterial = material.clone()
			//backMaterial = this.material(1,1,1)
			backMaterial.opacity = backMaterialOpacity
			backMaterial.transparent = true
			backMaterial.needsUpdate = true

			var s = 0
			var back = new THREE.PlaneGeometry(size-s, size-s, 1, 1);
			back.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, -1));
	      	var mesh = new THREE.Mesh(back, backMaterial);
			plane.add(mesh)
		}
		
		return plane
	},
	
	setup: function()
	{
		var size = this.size()
		var divisions = this.divisions() 
		this._object = new THREE.Object3D()

		var c = .5
		
		var heavy = .15
		var light = .1

		// z
		
		var plane = this.newPlane(size, divisions, this.material(1,1,c), light)
		plane.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI));
		plane.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, size/2));
		this._object.add(plane)
		
		var plane = this.newPlane(size, divisions, this.material(c,c,1), heavy)
		plane.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, -size/2));
		this._object.add(plane)

		// x
		
		var plane = this.newPlane(size, divisions, this.material(c,c,1), heavy)
		plane.applyMatrix(new THREE.Matrix4().makeRotationY(-Math.PI/2));
		plane.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
		plane.applyMatrix(new THREE.Matrix4().makeTranslation(size/2, 0, 0));
		this._object.add(plane)

		var plane = this.newPlane(size, divisions, this.material(c,1,c), light)
		plane.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI/2));
		plane.applyMatrix(new THREE.Matrix4().makeTranslation(-size/2, 0, 0));
		this._object.add(plane)

		// y
		
		var plane = this.newPlane(size, divisions, this.material(1,1,c), light)
		plane.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI/2));
		plane.applyMatrix(new THREE.Matrix4().makeTranslation(0, size/2, 0));
		this._object.add(plane)

		var plane = this.newPlane(size, divisions, this.material(1,c,c), heavy)
		plane.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
		plane.applyMatrix(new THREE.Matrix4().makeTranslation(0, -size/2, 0));
		this._object.add(plane)
						
	},


	update: function() 
	{	
		this._object.rotation.add(this._rd)
		this._object.position.z += this._zd
		
		if (this._t > this._nextShift) //|| Math.abs(this._mesh.rotation.y) > .45)
		{
			if (Math.random() < .5)
			{
				this._rd.x = - this._rd.x
			}
			
			if (Math.random() < .5)
			{
				this._rd.z = - this._rd.z
			}
			
			if (Math.random() < .5)
			{
				this._rd.y = - this._rd.y
			}
			
			if (Math.random() < .5)
			{			
				this._zd = - this._zd
			}
			
			this._nextShift = this._t + (3 + Math.random()*3)*60 //*100000
		}
		
		var zmax = 600
		if (this._object.position.z > zmax/2)
		{
			this._object.position.z = zmax/2
		}

		if (this._object.position.z < -zmax)
		{
			this._object.position.z = -zmax
		}
		this._t ++		
	}
})

