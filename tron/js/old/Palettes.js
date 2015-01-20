
Palette = Proto.clone().newSlots({
	protoType: "Palette",
	colors: [],
	foregroundColors: [],
	randomizationStrength: 0.9,
}).setSlots({
	background: function()
	{
		return new THREE.Color(this.colors()[0])
	},

	foreground: function()
	{
		return new THREE.Color(this.colors()[1])
	},
	
	foreground2: function()
	{
		return new THREE.Color(this.colors()[2])
	},


	
	highlight: function()
	{
		return new THREE.Color(this.colors()[3])
	},	
})

Palettes = Proto.clone().newSlots({
	protoType: "Palettes",
	palettes: [],
	index: 0
}).setSlots({
	addPaletteWithColors: function(c)
	{
		return this.addPalette(Palette.clone().setColors(c))
	},
	
	addPalette: function(p)
	{
		this.palettes().push(p)
		return p
	},
	
	next: function()
	{
		this.setIndex((this.index() + 1) % this.palettes().length)
		return this
	},

	previous: function()
	{
		var i = (this.index() - 1) % this.palettes().length
		if(i < 0) i = this.palettes().length - 1
		this.setIndex(i)
		return this
	},
	
	current: function()
	{
		return this.palettes()[this.index()]
	}
})

// back, fore, high

Palettes.addPaletteWithColors(["white", "black", "white"]).setForegroundColors([ "#AB7CFF", "#ECB4FF" ]).setRandomizationStrength(0.7)
// Palettes.addPaletteWithColors(["white", "black", "white"]).setForegroundColors([ "#AB7CFF", "#FFCE00", "#3EFFFF", "#BAFF16", "#E500FF" ]).setRandomizationStrength(0.9)
Palettes.addPaletteWithColors(["white", "black", "white"]).setForegroundColors([ "#9947B8", "#C910BA", "#FFE69D", "#FFE25D" ]).setRandomizationStrength(0.9)
// Palettes.addPaletteWithColors(["white", "black", "white"]).setForegroundColors([ "#4BBCB0", "#63F7E8" ]).setRandomizationStrength(0.7)
Palettes.addPaletteWithColors(["white", "black", "white"]).setForegroundColors([ "#FC45FF", "#FC73FF" ]).setRandomizationStrength(0.7)
Palettes.addPaletteWithColors(["white", "black", "white"]).setForegroundColors([ "#FC45FF", "#FC73FF", "#FC276E", "#FDAF20" ]).setRandomizationStrength(0.7)
Palettes.addPaletteWithColors(["white", "black", "white"]).setForegroundColors([ "#1AD1FF", "#16ACFF", "#0135FD", "#FEBA1C", "#FFFA66" ]).setRandomizationStrength(0.7)
Palettes.addPaletteWithColors(["white", "black", "white"]).setForegroundColors([ "#1AD1FF", "#16ACFF"]).setRandomizationStrength(0.7)
Palettes.addPaletteWithColors(["white", "black", "white"]).setForegroundColors([ "#16ACFF", "#A724E9", "#7043FF" ]).setRandomizationStrength(0.9)
// Palettes.addPaletteWithColors(["red", "black", "#222222", "#ffffff"])
// Palettes.addPaletteWithColors(["#0c9ae2", "#010b10", "gray", "#f3c932"])
// Palettes.addPaletteWithColors(["#000000", "#ef0c59", "gray", "#5df856"])
