var assert = require("assert");
var objUnderTest = require("../assets/js/imagePreview.js");
describe('imagePreview', function() {
    describe('createHandleBars()', function() {
        it('should return element with correct id and class list', function() {
            var ip = new ImagePreview('drop_file2');
            var hb = ip.createHandleBars('name', 'classA classB');
            assert.equal('drop_file2_name', hb.id);
        });
    });
});