

TargetPoint = Proto.clone().newSlots({
	position: null,
	yForce: 0,
	maxYForce:.1,
	yVelocity: 0,
	yDirection: 0,
	t: 0,
	trail: null,
	minDist: 10,
	followMethods: ["followTop", "follow", "followBack"],
	followMethodNumber: 0,
	cameraRotCurrent: 0,
	cameraRotTarget: 0,
	minZCurrent: 10,
	minZTarget: 10,
	cameraZoffset: 0,
	autoRotate: true,
}).setSlots({
	init: function()
	{
		this.setPosition(new THREE.Vector3( 0, 0, 1 ))
		this.setTrail(Trail.clone())
		this.trail().open()
	},	
	
	toggleAutoRotate: function()
	{
		this._autoRotate = !this._autoRotate
	},
	
	setPosition: function(p)
	{
		this._position = p.clone()
		return this
	},
		
	camera: function()
	{
		return Visual.camera()
	},
	
	updateCameraRot: function()
	{
		var camera = this.camera()

		this._cameraRotCurrent -= (this._cameraRotCurrent - this._cameraRotTarget)*.01
		camera.rotateOnAxis( new THREE.Vector3( 0, 0, 1 ), this._cameraRotCurrent);
		
		this._minZCurrent -= (this._minZCurrent - this._minZTarget)*0.01 
		
		if (camera.position.z < this._minZCurrent )
		{
			camera.position.z = this._minZCurrent 
		}
	},
	
	pulse: function()
	{
		var camera = this.camera()
		camera.position.z += 2
		//this._cameraZoffset = 15
		console.log("pulse")
	},
	
	lookAt: function(p)
	{
		//this._cameraZoffset *= .99
		//var z = camera.position.z
		//camera.position.z -= this._cameraZoffset
		var camera = this.camera()
		camera.lookAt(p)
	},
	
	followTop: function()
	{
		this._minZTarget = 15
		
		var camera = this.camera()
		camera.position.x -= (camera.position.x - this._position.x)*.1
		camera.position.z -= (camera.position.z - this._position.z)*.1 

		this.lookAt(this._position)
		
		//this._cameraRotTarget = -Math.PI/2
		this._cameraRotTarget = 0
		this.updateCameraRot()
		camera.position.y = 0
	},
		
	follow: function()
	{
		this._minZTarget = 6
		
		var camera = this.camera()
		camera.position.x -= (camera.position.x - this._position.x)*.01
		camera.position.y -= (camera.position.y - this._position.y)*.1
		camera.position.z -= (camera.position.z - this._position.z)*.1

		//camera.lookAt(this._position)
		//camera.rotateOnAxis( new THREE.Vector3( 0, 0, 1 ), (Math.PI)*Math.sin(this._t/150)*Math.sin(3 + this._t/150));
		this.lookAt(this._position)

		
		this._cameraRotTarget = (Math.PI)*Math.sin(this._t/150)*Math.sin(3 + this._t/150)
		this.updateCameraRot()
	},
	
	followBack: function()
	{
		this._minZTarget = 1.1
		var camera = this.camera()
		
		var f = .01
		var xoffset = 0
		camera.position.x -= (camera.position.x - (this._position.x - xoffset))*f
		camera.position.y -= (camera.position.y - this._position.y)*.1
		camera.position.z -= (camera.position.z - this._position.z)*.1

		this.lookAt(this._position)
		

		//camera.rotateOnAxis( new THREE.Vector3( 0, 0, 1 ), (Math.PI)*Math.sin(this._t/150)*Math.sin(3 + this._t/150));
		if (this.autoRotate())
		{
			this._cameraRotTarget = -Math.PI/2 + this._t /100
			if (this._t > 10)
			{
				this._t = 0
			}
		}
		else
		{
			this._cameraRotTarget = -Math.PI/2
		}
		//this._cameraRotTarget = (Math.PI)*Math.sin(this._t/150)*Math.sin(3 + this._t/150)
		this.updateCameraRot()	
	},
	
	step: function()
	{
		this._t ++
		this[this.followMethodName()].apply(this)
		var end = this._position.clone()
		this.trail().setEndPoint(end)
	},
	
	followMethodName: function()
	{
		return this.followMethods()[this.followMethodNumber()]
	},
	
	nextFollowStyle: function()
	{
		this._followMethodNumber = (this._followMethodNumber + 1) % this.followMethods().length		
		console.log("methodName = ", this.followMethodName())
	}
})