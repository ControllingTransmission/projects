// ----------------------------

String.prototype.reverse = function()
{
    return this.split("").reverse().join("");
}

String.prototype.repeat = function( num )
{
	num = Math.floor(num)
	
	if (num < 0)
	{
		num = 0
	}
	
	if (num == 0)
	{
		return ""
	}
		
    return new Array( num + 1 ).join( this );
}

Array.prototype.pickAny = function()
{
	var i = Math.floor(Math.random() * this.length) % this.length
	return this[i]
}


Array.prototype.removeAt = function(i)
{
	var v = this[i]
	this.splice(i, 1);
	return v;
}

Array.prototype.indexOf = function(elt /*, from*/)
{
	var len = this.length;

	var from = Number(arguments[1]) || 0;
	from = (from < 0)
		? Math.ceil(from)
		: Math.floor(from);
	if (from < 0)
		from += len;

	for (; from < len; from++)
	{
		if (from in this &&
			this[from] === elt)
		return from;
	}
	return -1;
}

Array.prototype.remove = function(e)
{
	var i = this.indexOf(e);
	if(i > -1)
	{
		this.removeAt(i);
	}
	return this;
}

Array.prototype.contains = function(element)
{
	return this.indexOf(element) > -1;
}

Array.prototype.appendIfAbsent = function()
{
	var self = this;
	this.argsAsArray(arguments).forEach(function(value)
	{
		if(self.indexOf(value) == -1)
		{
			self.push(value);
		}
	})

	return this;
}

// ----------------------------
