
function run()
{
	init();
	objects = [MaxSquaresPlane.clone().open()]
	animate()	
}


document.addEventListener("DOMContentLoaded", run, false)

function setupWebGl()
{
	container = document.createElement('div');
	document.body.appendChild(container);
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);
	scene = new THREE.Scene();	
}

function init()
{
	sharedProjector = new THREE.Projector();

	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 1200;
	
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	setupWebGl()	
	
	window.addEventListener('resize', onWindowResize, false);

	scene.add(new THREE.AmbientLight( 0x222222));

	light = new THREE.DirectionalLight(0xffffff);
	light.position.set(0, 50, 50);
	light.target.position.set(0, 0, 0);
	scene.add(light)
		
	setupBindings()
}

function onWindowResize() 
{
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() 
{
	requestAnimationFrame(animate);
	TWEEN.update();
	objects.forEach(function(obj) { obj.update() })
	render();
}

function render() 
{
	renderer.render(scene, camera);
}

function setupBindings()
{
	$(document).bind('keydown', function(e) { 
		/*
		Keyboard.shiftKey = e.shiftKey
		Keyboard.altKey   = e.altKey
		Keyboard.ctrlKey  = e.ctrlKey
		var retChar = 13
		var escChar = 27
		var sqChar = 192
		
		var char = String.fromCharCode(e.keyCode).toLowerCase()
		*/
		
		/*
		var space = 32
		
		if (e.keyCode == 32)
		{
		}
		*/
		
		console.log("e.keyCode: " + e.keyCode)
		objects.forEach(function (obj) { if (obj.keydown) { obj.keydown(e) } })
	})
}
