Ryo = Thing.clone().newSlots({
	protoType: "Ryo",
	rtime: 0,
	rate: 0,
	xp: 0,
	yp: 0
}).setSlots({
	
	init: function()
	{
		Thing.init.apply(this)

		this._geometry = new THREE.PlaneGeometry( .5, .5, 1 );
		this._material = new THREE.MeshBasicMaterial( { color: 0xff9900, side: THREE.DoubleSide, transparent:true } );
		this._mesh = new THREE.Mesh( this._geometry, this._material );
		this._mesh.position.set(0,0,0)
		this._object.position.set(0,0,0)
		
		this._material.color.setRGB(Math.random(), Math.random(), Math.random())
		this._object.add(this._mesh)
		this._rtime = Math.floor(Math.random()*3.14159*200)
		this._rate = Math.floor(Math.random()*4) + 1
		//this._rate = Math.log(Math.random()*10)/2
		//console.log("this._rate = ", this._rate)
	},
	
	update: function(time)
	{
		//this._rtime += this._rate
		//this._rtime += 1
		
		var mat = this._material
	//	mat.color.setRGB(Math.random(), Math.random(), Math.random())
		var s = 1/15
		mat.color.setRGB(
				colorMutate(mat.color.r), 
				colorMutate(mat.color.g), 
				colorMutate(mat.color.b)
		)
		//mat.opacity = Math.floor(this._rtime / this._rate ) % 2
	//	mat.opacity = (Math.sin(this._rtime) + 1)/2
		//mat.opacity = Math.floor(this._rtime  + (this._xp - this._yp)) % 10
		mat.needsUpdate = true
	},
})

colorMutate = function(v)
{
	var s = 1/20
	var d = (Math.random()-.5)*s
	var nv = v + d
	if (nv < 1 && nv > 0) 
	{
		return nv
	}
	
	return v
}
	
	
