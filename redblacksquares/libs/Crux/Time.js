
Time = Proto.clone().newSlots({			
	protoType: "Time",
	value: 0 // seconds
}).setSlots({
	init: function()
	{
		//Object.init.apply(this)
	},
	
	setValue: function(v)
	{
		this._value = v //Math.floor(v)
		//console.log("time set value = " + v )
		//console.log("time set value 2 = " + this._value )
		return this
	},
	
	// ---
	
	date: function()
	{
		//console.log("time value = " + this._value )
		var d = new Date(this._value*1000)
		//console.log("time date  = " + d.toString() )
		//console.log("time getUTCHours = " + d.getUTCHours() )
		return d
	},
	
	// ---
	
	hours: function()
	{
		return this.date().getUTCHours()
	},
	
	hours12: function()
	{
		var h = (this.date().getUTCHours() % 12) 
		if (h == 0) { h = 12; }
		return h
	},
	
	minutes: function()
	{
		return this.date().getUTCMinutes()
	},
	
	minutesString: function()
	{
		var m = this.minutes()
		if (m == 0) { return "00" }
		return "" + m
	},
	
	seconds: function()
	{
		return this.date().getUTCSeconds()
	},
	
	zone: function()
	{
		return "UTC"
	},
	
	meridiem: function()
	{
		if (this.date().getUTCHours() > 12)
		{
			return "pm"
		}
		
		return "am"
	},
	
	// ---
	
	setHours: function(v)
	{
		var d = this.date()
		d.setUTCHours(v)
		this._value = d.getTime()/1000
		return this
	},
	
	setHours12: function(v)
	{
		v = v % 12
		
		if (this.meridiem() == "am")
		{
			this.setHours(v)
		}
		else
		{
			this.setHours(v + 12)
		}

		return this
	},
	
	setMinutes: function(v)
	{
		var d = this.date()
		d.setUTCMinutes(v)
		this._value = d.UTC()
		return this
	},
	
	setSeconds: function(v)
	{
		var d = this.date()
		d.setUTCSeconds(v)
		this._value = d.UTC()
		return this
	},
	
	makeAm: function()
	{
		var h = this.hours()
		if (h > 12) 
		{
			this.setHours(h - 12)
		}		
		return this
	},
	
	makePm: function()
	{
		var h = this.hours()
		if (h < 12) 
		{
			this.setHours(h + 12)
		}		
		return this
	},
	
	setMeridiem: function(v)
	{
		if (v == "am" || v == "a" || v == "AM" || v == "A")
		{
			this.makeAm()
		}
		else
		{
			this.makePm()
		}
		
		return this
	},
	
	toggleMeridiem: function(v)
	{
		if (this.meridiem() == "am")
		{
			this.setMeridiem("pm")
		}
		else
		{
			this.setMeridiem("am")
		}
		return this
	}
})
		

