exports.Namespace      = require('test/jsdoc/namespace_test');
exports.Constructor    = require('test/jsdoc/constructor_test');
exports.Name           = require('test/jsdoc/name_test');
exports.docName        = require('test/jsdoc/docName_test');
exports.Meta           = require('test/jsdoc/meta_test');
exports.QuotedName     = require('test/jsdoc/quotedName_test');

require('ringo/unittest').run(exports);
