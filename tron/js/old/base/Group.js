
GrayColor = function(v)
{
	if (v >= 1) { v = 10 }
	//console.log("v " + v)
	//return new THREE.Color().setRGB(v*255, v*255, v*255)
	return new THREE.Color().setRGB(v, v, v)
}

Group = Thing.clone().newSlots({
	protoType: "Group",
	items: null,
	isPaused: false,
	rate: 1,
	owner: null,
	key: null,
	resets: false
}).setSlots({
	init: function()
	{
		this._items = []
		this._object = new THREE.Object3D()
	},
	
	addItem: function(item)
	{
		item.setGroupPosToCurrent()
		item.setGroup(this)
		this._items.push(item)
		this._object.add(item.object())
	},
	
	removeSelf: function()
	{
		if (this.owner())
		{
			this.owner().removeGroup(this)
		}
	},
	
	removeItem: function(item)
	{
		this._items.remove(item)
		this._object.remove(item.object())
		item.close()
	},

	update: function() 
	{	
		Thing.update.apply(this)
		//console.log(this.protoType() + " update")
		
		if (!this.isPaused()) 
		{
			this.updateItems()	
		}
	},
	
	updateItems: function()
	{
		for (var i = 0; i < this._items.length; i++)
		{
			var item = this._items[i]
			item.update(this.rate())
		}
	},
	
	setColor: function (c)
	{
		console.log("setting group color")
		this.items().forEach(function (item) { item.setColor(c) })
		return this
	},
	
	toggleIsPaused: function()
	{
		this.setIsPaused(!this.isPaused())
	},
	
	moverKeyMap: function()
	{
		if (this._moverKeyMap == null) 
		{
		
			var moverKeysArray = [	
				"Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P",
				"A", "S", "D", "F", "G", "H", "J", "K", "L"
			]
				
			var movers = Movers.movers()
			this._moverKeyMap = {}
			for (var i = 0; i < moverKeysArray.length; i++)
			{
				var k = moverKeysArray[i]
				var mover = Movers.movers()[i]
				this._moverKeyMap[k] = mover
			}
		}
		
		return this._moverKeyMap;
	},
	
	keydown: function(e)
	{
		console.log(this.protoType() + " keydown '" + e.key + "' ", e.keyCode)
		
		/*
		if (e.key == "P")
		{
			this.setIsPaused(true)
			return
		}
		*/
		
		/*
		if (e.key == "[")
		{
			this.setRate(this.rate()/2)
			console.log("rate: ", this.rate())
			return
		}
		
		if (e.key == "]")
		{
			this.setRate(this.rate()*2)
			console.log("rate: ", this.rate())
			return
		}
		
		// color
		var colorKeys = {
			"Z": GrayColor(0), 
			"X": new THREE.Color("#0ff"), 
			"C": new THREE.Color("#f0f"), 
			"V": GrayColor(.3), 
			"B": null, 
			"N": null, 
			"M": null
		}
		
		var color = colorKeys[e.key]
		
		if (color)
		{
			this.setColor(color)
			return
		}
		
		// alpha
		
		if (e.key == ",")
		{
			this.items().forEach(function (item) { item.increaseAlpha() })
			return
		}
		
		if (e.key == ".")
		{
			this.items().forEach(function (item) { item.decreaseAlpha() })
			return
		}
		*/
		
		// wireframe

		if (e.key == "-")
		{
			console.log("toggle wireframe")
			this.items().forEach(function (item) { item.toggleWireframe() })
			return
		}		
		
		//var moverProto = this.moverKeyMap()[e.key]
		var moverProto = Movers.moverWithKey(e.key)
		
		if (moverProto)
		{
			this.setItemMover(e.key, moverProto.clone())
			return
		}
	},
	
	setItemMover: function(name, m)
	{
		if (Keyboard.shiftKey)
		{
			this.setMover(name, m.clone())
		}
		else
		{
			//console.log("setItemMover " + m.protoType())
			this.items().forEach(function (item) { item.setMover(name, m.clone()) })
		}
	},
	
	keyup: function(e)
	{
		//console.log(this.protoType() + " keyup ", e.key)
		if (e.key == "P")
		{
			this.setIsPaused(false)
		}
	},
	
})

