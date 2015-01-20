

MaxMover = Mover.clone().newSlots({
	protoType: "MaxMover",
	rd: null,
	zd: null,
	speed: 2
}).setSlots({
	init: function()
	{
		Mover.init.apply(this)
		/*
		var dt = .002
		this._rd = new THREE.Vector3(0, dt*this._speed, dt*this._speed)
		this._zd = 1
		this._nextShift = 3*60
		*/
		this.setRate(1)
	},
	
	setRate: function(r)
	{
		this._rate = r
		var dt = .002
		this._rd = new THREE.Vector3(0, dt*r*this._speed, dt*r*this._speed)
		this._zd = 1*r
		this._nextShift = 3*60/r
	},
	
	object: function()
	{
		return this._thing._object
	},
	
	update: function(dt) 
	{	
		//this.setRate(dt)
		Mover.update.apply(this)
		
		var obj = this.object()
		
		obj.rotation.add(this._rd)
		obj.position.z += this._zd
		
		if (this._t > this._nextShift || Math.abs(obj.rotation.y) > .45)
		{
			if (1 < .5)
			{
				this._rd.z = - this._rd.z
			}
			
			{
				this._rd.y = - this._rd.y
			}
			this._zd = - this._zd
			
			//this._nextShift = this._t + (3 + Math.random()*3)*60 //*100000		
			this._nextShift = this._t + (3 +10*3)*60 //*100000		
		}
		
		var zmax = 600
		if (obj.position.z > zmax/2)
		{
			obj.position.z = zmax/2
		}

		if (obj.position.z < -zmax)
		{
			obj.position.z = -zmax
		}
		
		//this._t ++	
	}
})

