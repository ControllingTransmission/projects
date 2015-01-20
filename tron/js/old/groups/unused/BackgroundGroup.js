
BackgroundGroup = Group.clone().newSlots({
	protoType: "BackgroundGroup",
	items: null,

}).setSlots({
	init: function()
	{
		Group.init.apply(this)
	},
	
	keydown: function(e)
	{
		console.log("Background keydown '" + e.key + "' ", e.keyCode)
		
		var colorKeys = {
			"Z": GrayColor(.17), 
			"X": new THREE.Color().setRGB(255, 0, 0), 
			"C": new THREE.Color().setRGB(0, 0, 255), 
			"V": null, 
			"B": null, 
			"N": null, 
			"M": null
		}
		
		var color = colorKeys[e.key]
		if (color)
		{
			this.setColor(color)
		}
	},
	
	keyup: function()
	{
	},
	
	setColor: function(c)
	{
		var s = "rgb(" + Math.floor(c.r*255) + ", " + Math.floor(c.g*255) + ", " + Math.floor(c.b*255) + ")"
		//console.log(this.protoType() + " set " + s)
		document.body.style.backgroundColor = s
		return this
	}
})

