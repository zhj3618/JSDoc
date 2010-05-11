/**
	@overview Schema for validating JSON produced by JsDoc Toolkit.
	@author Michael Mathews <micmath@gmail.com>
	@license Apache License 2.0 - See file 'LICENSE.markdown' in this project.
 */

var jsdoc = jsdoc || {};
jsdoc.schema = (typeof exports === 'undefined')? {} : exports; // like commonjs

jsdoc.schema.jsdocSchema = {
   "properties": {
		"doc": {
			"items": {
				"type": "object",
				"properties": {
					"id": {
						"type": "string"
					},
					"name": {
						"type": "string"
					},
					"longname": {
						"type": "string"
					},
					"memberof": {
						"type": "string",
						"optional": true
					},
					"kind": {
						"type": "string"
					},
				}
			}
		}
	},
	"meta": {
		"type": "string",
		"optional": true
	}
};