
PolygonGeometry = Proto.clone().newSlots({
	protoType: "RectGeometry",
	faceCount: 4,
	outer: 100,
	inner: 95,
	geometry: null
}).setSlots({
	init: function()
	{
	},
	
	setup: function()
	{
		var geometry = new THREE.Geometry(); 
		var vertices = []
		var r = this.inner()/this.outer()
		var i
		
		for (i = 0; i < this.faceCount() + 2; i++)
		{
			var a = Math.PI * 2* i / this.faceCount()
			var x = Math.cos(a)*this.outer()/2
			var y = Math.sin(a)*this.outer()/2
			
			//console.log("x:" + x + " y:" + y + " r:" + r)
			var outerVertex = new THREE.Vector3(x, y, 0)
			var innerVertex = new THREE.Vector3(x*r, y*r, 0)
		
			geometry.vertices.push(outerVertex);
			geometry.vertices.push(innerVertex);

			if (i > 1)
			{
				var f = i*2 - 1
				//console.log("face1: ", f-0, f-1, f-2, " and ", f-2, f-3, f-0)
				geometry.faces.push(new THREE.Face3(f-0, f-1, f-2));
				geometry.faces.push(new THREE.Face3(f-1, f-2, f-3));
			}
		}
		geometry.computeFaceNormals();
		
		// make this reuse the first vertices later
				
		this._geometry = geometry
		return this
	}
})