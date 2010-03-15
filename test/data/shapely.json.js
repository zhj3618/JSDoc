/**
	{
		"name": "shapely",
		"shortName": "shapely",
		"description": "",
		"isa": "namespace",
		"memberOf": "",
		"type": ["object"]
	}
*/
var shapely = {};

/**{
	"name": "shapely.Shape",
	"shortName": "Shape",
	"description": "A base class for all shapes.",
	"isa": "constructor",
	"memberOf": "shapely",
	"type": ["function"],
	"params": [
		{
			"name": "sides",
			"description": "The number of sides of this shape.",
			"type": ["number"],
			"required": false,
			"defaultValue": 1
		}
	]
}*/
shapely.Shape = function(sides) {
	/**{
		"name": "shapely.Shape#sides",
		"shortName": "sides",
		"description": "",
		"isa": "property",
		"memberOf": "shapely.Shape#",
		"type": ["number"],
		"defaultValue": 1
	}*/
	this.sides = sides || 1;
}

/**{
	"name": "shapely.Circle",
	"shortName": "Circle",
	"description": "", 
	"isa": "constructor",
	"memberOf": "shapely",
	"type": ["function"],
	"params": [
		{
			"name": "radius",
			"description": "The initial radius of this circle.",
			"type": ["number"],
			"required": false,
			"defaultValue": 1
		}
	]
}*/
shapely.Circle = function(radius) {
	var that = new shapely.Shape(1);
	
	/**{
		"name": "shapely.Circle#sides",
		"shortName": "sides",
		"description": "",
		"isa": "property",
		"memberOf": "shapely.Circle#",
		"type": ["number"],
		"defaultValue": 1
	}*/
	
	/**{
		"name": "shapely.Circle#radius",
		"shortName": "radius",
		"description": "",
		"isa": "property",
		"memberOf": "shapely.Circle#",
		"type": ["number"]
	}*/
	that.radius = radius || 1;
}

/**{
	"name": "shapely.Circle#setDiameter",
	"shortName": "setDiameter",
	"description": "Set the diameter of this circle.",
	"isa": "method",
	"memberOf": "shapely.Circle#",
	"type": ["function"],
	"params": [
		{
			"name": "diameter",
			"type": ["number"],
			"required": true,
			"description": "The new diameter."
		}
	],
	"returns": []
}*/
shapely.Circle.prototype.setDiameter = function(diameter) {
	this.radius = diameter/2;
}

/**{
	"name": "shapely.Circle#getDiameter",
	"shortName": "getDiameter",
	"description": "",
	"isa": "method",
	"memberOf": "shapely.Circle#",
	"type": ["function"],
	"params": [],
	"returns": [
		{
			"type": "number",
			"description": "The radius of this circle."
		}
	]
}*/
shapely.Circle.prototype.getDiameter = function() {
	return this.radius * 2;
}