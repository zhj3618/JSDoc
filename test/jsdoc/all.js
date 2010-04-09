exports.Isa                 = require('test/jsdoc/isa_test');
exports.Ignore              = require('test/jsdoc/ignore_test');
exports.Memberof            = require('test/jsdoc/memberof_test');
exports.MethodName          = require('test/jsdoc/method_name_test');
exports.MethodProperty_name = require('test/jsdoc/methodProperty_name');
exports.Namespace           = require('test/jsdoc/namespace_test');
exports.Constructor         = require('test/jsdoc/constructor_test');
exports.ConstructorName     = require('test/jsdoc/constructorName_test');
exports.Class               = require('test/jsdoc/class_test');
exports.Name                = require('test/jsdoc/name_test');
exports.docName             = require('test/jsdoc/docName_test');
exports.QuotedName          = require('test/jsdoc/quotedName_test');

require('ringo/unittest').run(exports);
