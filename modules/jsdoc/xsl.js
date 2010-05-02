/**
	@overview Apply XSL to XML.
	@author Michael Mathews <micmath@gmail.com>
	@license Apache License 2.0 - See file 'LICENSE.markdown' in this project.
 */

/**
	@module jsdoc/xsl
	@namespace jsdoc.xsl
 */
var jsdoc = jsdoc || {};
jsdoc.xsl = (typeof exports === 'undefined')? {} : exports; // like commonjs

(function() {

	importPackage(javax.xml.transform);
	importPackage(javax.xml.transform.stream);
	importPackage(java.io);
	
	/**
		@method transform
		@param {string} xml Path to XML file.
		@param {string} xsl Path to XSL file.
		@param {string} out Path to output file.
	 */
	jsdoc.xsl.transform(xml, xsl, out) {
		var tFactory = TransformerFactory.newInstance();
		var transformer = tFactory.newTransformer(
			new StreamSource(xsl)
		);
		transformer.transform(
			new StreamSource(xml), 
			new StreamResult( new FileOutputStream(out) )
		);
	}
	
})();