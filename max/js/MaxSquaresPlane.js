
MaxSquaresPlane = Max.clone().newSlots({
	protoType: "MaxSquaresPlane",
	squares: null,
	object: null,
	//size: 6000,
	//divisions: 30,
	t: 0
}).setSlots({
	init: function()
	{
		var dt = .002
		this._rd = new THREE.Vector3(0, dt, dt)
		this._t = 0
		this._zd = 3
		this._nextShift = 3*60
		this._nextBreath = 2*60
		
		this.setup()
		
		var self = this
		// window.addEventListener('keydown', function (e) { self.keydown(e) }, false)
		document.body.style.backgroundColor = "rgb(46, 60, 122)"
	},

	keydown: function(e)
	{
		//return 
		var k = e.keyCode
		console.log(k)
		for (var i = 0; i < this._squares.length; i ++)
		{
			if (i % 33 == k % 33)
			{
				this._squares[i].breath()
			}
		}
	},

	squareSize: function()
	{
		return this.size()/this.divisions()
	},

	newSquare: function()
	{
		var poly =  PolygonGeometry.clone()
		poly.setOuter(this.squareSize()*Math.sqrt(2))
		poly.setInner(this.squareSize()*Math.sqrt(2)*.9825)
		//poly.setInner(this.squareSize()*.95)
		poly.setup()
		var geometry = poly.geometry()
	
		var material = new THREE.MeshBasicMaterial( 
			{
				//color: new THREE.Color().setRGB(181/255, 155/255, 199/255), 
				color: new THREE.Color().setRGB(1,1,1), 
				wireframe: false, 
				wireframeLinewidth: 1,
				opacity: 1, // .7
				transparent: true,
				side: THREE.DoubleSide,
				blending: THREE.AdditiveBlending
			} );

	    return new THREE.Mesh(geometry, material);
	},

	setup: function()
	{
		this._object = new THREE.Object3D()
		
		this._squares = []
		var ss = this.squareSize() -1
		var max = this.divisions()*ss 
		var offset = ss/2
		
		for (var x = 0; x < this.divisions(); x ++)
		{
			for (var y = 0; y < this.divisions(); y ++)
			{
				var square = new THREE.Object3D()
				var mesh = this.newSquare()
				mesh.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI/4));
				mesh.applyMatrix(new THREE.Matrix4().makeTranslation(offset + x*ss - max/2, offset + y*ss - max/2, 0));
				square.add(mesh)
				square.ynum = y
				square.xnum = x
				square.max = this.divisions()

				square.takeBreath = function (dir)
				{
					var v = dir ? this.ynum : this.xnum
					var delay =  (v/this.max) * 2000
					var self = this
					setTimeout(function () { self.breath() }, delay)
				}
				
				square.breath = function ()
				{
					this._tween = this.inhale()
					var self = this
					this._tween.onComplete(function () {
						setTimeout(function () { self.exhale() }, 2000)
					})
				}

				square.inhale = function ()
				{
					var h = (this.ynum % 2)*100 + (this.xnum % 2)*50
					this._tween = new TWEEN.Tween(this.position).to({ z: h }, 500)
					this._tween.start()					
					return this._tween					
				}
				
				square.exhale = function ()
				{
					this._tween = new TWEEN.Tween(this.position).to({ z: 0 }, 500)
					this._tween.start()
					return this._tween							
				}
				
				square.flatten = function()
				{
					this.stop()
					this._tween = new TWEEN.Tween(this.position).to({ z: 0 }, 500)
					this._tween.start()
				}
				
				square.stop = function()
				{
					if (this._tween) { this._tween.stop(); this._tween = null }
				}
								
				this._object.add(square)
				this._squares.push(square)
			}
		}

	},
		
	breath: function()
	{
		var dir = Math.random() > .2
		for (var i = 0; i < this._squares.length; i ++)
		{
			var square = this._squares[i]
			square.takeBreath(dir)
		}		
	},

	update: function() 
	{	
		if (this._t > this._nextBreath)
		{
			this._nextBreath = this._t + Math.floor(4 + 3*Math.random())*60 
			this.breath()
		}
		
		Max.update.apply(this)
	},

	flatten: function(dt)
	{
		for (var i = 0; i < this._squares.length; i ++)
		{
			var square = this._squares[i]
			square.flatten(dt)
		}		
	}
		
	
})

