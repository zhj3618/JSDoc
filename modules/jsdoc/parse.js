export('parse');

include('ringo/file');
include('jsdoc/common');

function parse(src) {
	var dummyData = { // TODO: this will be generated from source code
		project: {
			name: "Shapely",
			description: "A collection of tools for working with shapes."
		},
		classes: [
			{
				name: "Shape",
				attributes: ["abstract"],
				properties: [
					{
						name: "Shape#sides",
						type: "number",
						access: ["read"]
					}
				]
			},
			{
				name: "Circle", 
				properties: [
					{
						name: "Circle#radius",
						type: "number",
						access: ["read"]
					},
					{
						name: "Circle#sides",
						from: "Shape#sides"
					}
				]
			},
			{
				name: "Square",
				properties: [
					{
						name: "Square#width",
						type: "number",
						access: ["read", "write"]
					},
					{
						name: "Square#height",
						type: "number",
						access: ["read", "write"]
					},
					{
						name: "Circle#sides",
						from: "Shape#sides"
					}
				]
			}
		]
	};
	
	return dummyData;
}