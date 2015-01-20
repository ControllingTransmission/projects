
Prism = Thing.clone().newSlots({
	protoType: "Triangle",
	defaultHeight: .001,
	objectCache: []
}).setSlots({
	init: function()
	{
		Thing.init.apply(this)
		this.setup()
	},
	
	setup: function()
	{		
		// radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, segmentsAlongHeight,
		var geometry = new THREE.CylinderGeometry( .58, .58, this.defaultHeight(), 3, 1 );

		var material = new THREE.MeshLambertMaterial( 
			{
				color: new THREE.Color().setRGB(0, 0, 0), 
				wireframe: false, 
				wireframeLinewidth: 4,
				opacity: 1,
				transparent: false // faster if false
			} );

	    this._object = new THREE.Mesh(geometry, material);
	    this._object.geometry.applyMatrix( new THREE.Matrix4().makeRotationX( Math.PI/2 ) );
	    this._object.geometry.applyMatrix( new THREE.Matrix4().makeRotationZ( Math.PI/2 ) );
		this._object.geometry.verticesNeedUpdate = true;
	},
	
	reset: function()
	{
		this.object().scale.x = 1
		this.object().scale.y = 1
		this.object().scale.z = 1
		this.setupColor()
	},
	
	setupColor: function()
	{
		var cc = null
		if(Palettes.current().foregroundColors().length == 2) cc = this.fadeColor()
		else cc = this.paletteColor();

		this.setColor(new THREE.Color(cc))
	},

	fadeColor: function()
	{
		var c = Palettes.current().foregroundColors();
		
		// First two foreground colors fade from first to second in Y
		var cc = c[0];
		var chsv = Colors.hex2hsv(cc);
		var crgb = Colors.hex2rgb(cc);

		var cc2 = c[1];
		var chsv2 = Colors.hex2hsv(cc2);
		var crgb2 = Colors.hex2rgb(cc2);

		var crand = Math.floor(Palettes.current().randomizationStrength()*(this.groupY()+2)*Math.random())
		crgb.R = crgb.R + (crand * (crgb2.R - crgb.R))
		crgb.R = (crgb.R>=255 ? 255 : crgb.R)
		crgb.G = crgb.G + (crand * (crgb2.G - crgb.G))
		crgb.G = (crgb.G>=255 ? 255 : crgb.G)
		crgb.B = crgb.B + (crand * (crgb2.B - crgb.B))
		crgb.B = (crgb.B>=255 ? 255 : crgb.B)

		cc = Colors.rgb2hex(crgb.R, crgb.G, crgb.B);

		return cc
	},

	paletteColor: function()
	{
		var c = Palettes.current().foregroundColors();
		var cc = c[Math.floor(Math.random()*c.length)];
		var chsv = Colors.hex2hsv(cc);
		var crgb = Colors.hex2rgb(cc);

		var crand = Math.random()
		crgb.R = crgb.R + Math.floor(100*crand)
		crgb.R = (crgb.R>=255 ? 255 : crgb.R)
		crgb.G = crgb.G + Math.floor(100*crand)
		crgb.G = (crgb.G>=255 ? 255 : crgb.G)
		crgb.B = crgb.B + Math.floor(100*crand)
		crgb.B = (crgb.B>=255 ? 255 : crgb.B)
		// crgb.G += 50
		// crgb.G = crgb.G - crgb.G%255
		// crgb.B += 50
		// crgb.B = crgb.B - crgb.B%255
		
		cc = Colors.rgb2hex(crgb.R, crgb.G, crgb.B);

		return cc
	},

	darken: function()
	{
		this.color().offsetHSL(0, 0, -0.9)
		this.material().needsUpdate = true;
	}

/*
	update: function() 
	{	
		Thing.update.apply(this)		
	}
	*/
})

