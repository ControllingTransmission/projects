Visual = Proto.clone().newSlots({
	protoType: "Visual",
	renderer: null,
	camera: null,
	scene: null,
	lights: [],
	downKeys: {},
	time: 0,
	objects: [],
}).setSlots({
	go: function()
	{
		this.setup()
		this.run()
		return this
	},
	
	run: function()
	{
		this.animate()	
	},

	setup: function()
	{
		this.setBackgroundColor(0,0,0)
		this.setScene(new THREE.Scene())
		this.setupRenderer()
		//this.setupPerspectiveCamera()
		this.setupOrthoCamera2()
		//this.setupLight()
		this.setupEvents()
		
		/*
		var geometry = new THREE.PlaneGeometry( .5, .5, 1 );
		var material = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } );
		var plane = new THREE.Mesh( geometry, material );
		plane.position.set(0,0,0)
		this.scene().add( plane );
		*/
		var thing = RyoGroup.clone()
		this.scene().add(thing.object())
		this.objects().push(thing)
	},
	
	setupRenderer: function()
	{
		var container = document.createElement('div');
		document.body.appendChild(container);
		this.setRenderer(new THREE.WebGLRenderer({ antialias: true }))
		this.renderer().setSize(window.innerWidth, window.innerHeight);
		container.appendChild(this.renderer().domElement);
	},

	setupOrthoCamera: function()
	{
		var width = 1
		var height = 1
		var near = -1
		var far = 1
		this.setCamera(new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, near, far ))		
		this.camera().position.x = 0;
		this.camera().position.y = 0;
		this.camera().position.z = .5;
		this.camera().lookAt(new THREE.Vector3(0, 0, 0));	
	},
	
	setupOrthoCamera2: function()
	{
		var width = 1
		var height = 1
		var near = -1
		var far = 1
		this.setCamera(new THREE.OrthographicCamera( 0, width, 0, height, near, far ))		
		this.camera().position.x = 0;
		this.camera().position.y = 0;
		this.camera().position.z = .5;
		this.camera().lookAt(new THREE.Vector3(0, 0, 0));	
	},
		
	setupPerspectiveCamera: function()
	{		
		this.setCamera(new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 8000))
		this.camera().position.x = 0;
		this.camera().position.y = 0;
		this.camera().position.z = 15;
		this.camera().lookAt(new THREE.Vector3(0, 0, 0));		
	},
	
	setupEvents: function()
	{	
		var self = this
		window.addEventListener('resize', function () { self.onWindowResize() }, false);
		$(document).bind('keydown', function(e) { self.keydown(e) })		
		$(document).bind('keyup', function(e) { self.keyup(e) })
	},
	
	setupLight: function()
	{	
		var light1 = new THREE.DirectionalLight(0xffffff)
		this.lights().push(light1)
		light1.position.set(0, 0, 10);
		light1.target.position.set(0, 0, 0);
		light1.intensity = 0.5
		this.scene().add(light1)
	},

	animate: function() 
	{
		var self = this
		requestAnimationFrame(function () { self.animate() });
		self._time ++
		
		var objs = this.objects().slice(0)
		for (var i = 0; i < objs.length; i ++)
		{
			var obj = objs[i]
			obj.update(self._time)
		}

		this.render();
	},
	
	render: function()
	{
		//console.log("render")
		this.renderer().render(this.scene(), this.camera());
	},

	onWindowResize: function() 
	{
		this.camera().aspect = window.innerWidth / window.innerHeight;
		this.camera().updateProjectionMatrix();
		this.renderer().setSize(window.innerWidth, window.innerHeight);
	},
	
	// -------------------------------
	
	keyForKeyCode: function(code)
	{
		var codeToKey = { 
			219: "[", 
			221: "]", 
			188: ",", 
			190: ".",
			189: "-",
			186: ";",
			222: "'"
		}
		var k = codeToKey[code]
		
		if (k == null)
	    {
			k = String.fromCharCode(code);
		}
		
		return k
	},
	
	keydown: function(e)
	{
		//console.log("e.keyCode " + e.keyCode)
		var k = this.keyForKeyCode(e.keyCode)

		if (k == "[")
		{
			return
		}	
	},
	
	keyup: function(e)
	{
		this.downKeys()[e.keyCode] = false 
	},
	
	setBackgroundColor: function(r, g, b)
	{
		var s = "rgb(" + Math.floor(r*255) + ", " + Math.floor(g*255) + ", " + Math.floor(b*255) + ")"
		document.body.style.backgroundColor = s
		return this
	}
})

Keyboard = {}
