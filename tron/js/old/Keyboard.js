
/*
Key = Proto.clone().newSlots({
	protoType: "Key",
	keyCode: null,
	character: null,
	state: false,
}).setSlots({
	
	isUp: function()
	{
		
	},
	
	isDown: function()
	{
		
	}
})
*/
	

Keyboard = Proto.clone().newSlots({
	protoType: "Keyboard",
	downKeys: {},
	modifiers: {},
}).setSlots({
	setup: function()
	{
		this.characterToKey = { 
			219: "[", 
			221: "]", 
			188: ",", 
			190: ".",
			189: "-",
			186: ";",
			222: "'"
		}
	},

	charForKeyCode: function(code)
	{	
		var c = this.characterToKey[code]
		
		if (c == null)
	    {
			c = String.fromCharCode(code);
		}
		
		return c
	},
	
	keydown: function(e)
	{
		var c = this.charForKeyCode(e.keyCode)
		this.downKeys()[e.keyCode] = true 
	},
	
	keyup: function(e)
	{
		this.downKeys()[e.keyCode] = false 
	},
})

