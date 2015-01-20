LeapMotion = Proto.clone().newSlots({
	protoType: "Mover",
	hands: [],
	t: null,
}).setSlots({
	init: function()
	{
	},
});

Leap.loop(function(obj) {
  LeapMotion._hands = obj.hands;
});