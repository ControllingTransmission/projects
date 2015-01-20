
VertexObject = Proto.clone().newSlots({
	protoType: "VertexObject",
	vertex: null,
	mesh: null,
	xnum: 0,
	ynum: 0,
	t: 0
}).setSlots({
	xnum: function()
	{
		return Math.floor(this.vertex().x * MaxStretchPlane.divisions() / MaxStretchPlane.size())
	},
	
	ynum: function()
	{
		return Math.floor(this.vertex().y * MaxStretchPlane.divisions() / MaxStretchPlane.size())
	},
	
	move: function()
	{
		//var num = Math.ceil(Math.ceil(this.t()*100) % 2)
		var xd = Math.floor(Math.random()*3)+2
		var yd = Math.floor(Math.random()*3)+2
		var xb = (this.xnum() % xd) == 0
		var yb = (this.ynum() % yd) == 0
		var h = Math.sin((this.xnum()) + .5) + Math.sin(this.ynum() + .5)
		var div = .9
		if (h > div) { h = 200 } else { h = 0 }
		var h = xb && yb ? 200 : 0
	
		var self = this
		var move = new TWEEN.Tween(this.vertex()).to({ z: h }, 500)
		move.onUpdate(function () { self.mesh().verticesNeedUpdate = true })
		move.onComplete( function (v) { self.complete1() })
		move.start()
		this._tween = move
	},
	
	stop: function()
	{
		if (this._tween) 
		{
			this._tween.stop()
		}
	},
	
	complete1: function()
	{
		var self = this
		this._tween = setTimeout(function () { self.complete2() }, 1000)
	},

	complete2: function()
	{
		var self = this
		var moveBack = new TWEEN.Tween(this.vertex()).to({ z: 0 }, 500)
		moveBack.onUpdate(function () { self.mesh().verticesNeedUpdate = true })
		moveBack.start()
		this._tween = moveBack
	},
	
	flatten: function(dt)
	{
		var move = new TWEEN.Tween(this.vertex()).to({ z: 0 }, dt)
	}
})

MaxStretchPlane = Max.clone().newSlots({
	protoType: "MaxStretchPlane",
	squares: null,
	object: null,
	vertexObjects: null,
	t: 0
}).setSlots({
	init: function()
	{
		var dt = .002
		this._rd = new THREE.Vector3(0, dt, dt)
		this._t = 0
		this._zd = 3
		this._nextShift = 30
		this._vertexObjects = []
		
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
	
		var d = this.divisions()
		var i = 0
		for (var x = 0; x < d; x ++)
		{
			for (var y = 0; y < d; y ++)
			{
				var vertex = this._plane.vertices[i]
				var v = VertexObject.clone().setVertex(vertex).setMesh(this._plane)
				v.setXnum(y).setYnum(x)
				this.vertexObjects().push(v)
				i ++
			}
		}
		
	},
	
	move: function()
	{
		var i = 0
		var d = this.divisions()
		var t = Math.random()
		for (var x = 0; x < d; x ++)
		{
			for (var y = 0; y < d; y ++)
			{
				var vertex = this._vertexObjects[i]
				vertex.setT(t)
				vertex.move()
				i ++
			}
		}		
	},
	
	update: function() 
	{	
		if (this._t > this._nextShift)
		{
			this.move()
			this._nextShift = Math.random()*60*3
		}

		Max.update.apply(this)
	},
	
	flatten: function(dt)
	{
		var i = 0
		var d = this.divisions()
		for (var x = 0; x < d; x ++)
		{
			for (var y = 0; y < d; y ++)
			{
				var vertex = this._vertexObjects[i]
				vertex.flatten(dt)
				i ++
			}
		}		
	}
})

